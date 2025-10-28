import { transcribeFile } from './openai.js';
import { decodeFileToMonoPcm } from './stt/audio.js';
import { STT_CONFIG } from './stt/config.js';
import { createLimiter } from './stt/limiter.js';
import { mergeTranscriptions } from './stt/merge.js';
import {
  planSpeechChunks,
  slicePcm,
  normalizeSpeechSegments,
} from './stt/chunkPlanner.js';
import { buildTimeChunks } from './stt/timeChunker.js';
import { detectSpeechSegments } from './stt/vad.js';
import { encodeWav } from './stt/wav.js';

function hasBrowserAudioSupport() {
  if (typeof window === 'undefined') return false;
  const hasContext = Boolean(window.AudioContext || window.webkitAudioContext);
  const hasOffline = Boolean(
    window.OfflineAudioContext || window.webkitOfflineAudioContext
  );
  return hasContext && hasOffline;
}

function fallbackTranscription({ file, language }) {
  return transcribeFile({ file, language, prompt: undefined });
}

async function decodeAudioFile(file) {
  return decodeFileToMonoPcm({
    file,
    targetSampleRate: STT_CONFIG.sampleRate,
  });
}

function detectAndNormalizeSegments(decoded, detector = detectSpeechSegments) {
  try {
    const rawSegments = detector({
      pcm: decoded.pcm,
      sampleRate: decoded.sampleRate,
      config: STT_CONFIG.vad,
    });
    return normalizeSpeechSegments({
      segments: rawSegments,
      durationMs: decoded.durationMs,
      padMs: STT_CONFIG.padMs,
      minSpeechMs: STT_CONFIG.vad.minSpeechMs,
      minSilenceMs: STT_CONFIG.vad.minSilenceMs,
      maxSpeechMs: STT_CONFIG.vad.maxSpeechMs,
    });
  } catch (error) {
    console.warn('VAD failed, continuing with fallback chunking', error);
    return [];
  }
}

function buildChunkPlan(decoded, normalizedSegments) {
  if (normalizedSegments.length > 0) {
    const speechChunks = planSpeechChunks({
      segments: normalizedSegments,
      audioDurationMs: decoded.durationMs,
      config: STT_CONFIG,
    });
    if (speechChunks.length > 0) {
      return speechChunks;
    }
  }

  const fallbackChunks = buildTimeChunks({
    durationMs: decoded.durationMs,
    config: STT_CONFIG,
  });

  if (fallbackChunks.length > 0) {
    return fallbackChunks;
  }

  return [
    {
      index: 0,
      startMs: 0,
      endMs: decoded.durationMs,
      segments: [
        {
          startMs: 0,
          endMs: decoded.durationMs,
        },
      ],
    },
  ];
}

const LANGUAGE_STORAGE_KEY = 'transcription_language';

export function getStoredLanguage(preferred, availableOptions) {
  const stored =
    (typeof window !== 'undefined'
      ? window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
      : null) || '';
  const candidate = (stored || preferred || '').trim();
  const options = Array.isArray(availableOptions) ? availableOptions : [];

  if (options.length === 0) {
    return pickDefaultLanguage(candidate, preferred);
  }

  const match = findMatchingOption(candidate, options);
  if (match) return match;

  return options[0];
}

function pickDefaultLanguage(candidate, preferred) {
  if (candidate) return candidate;
  if (preferred) return preferred;
  return 'en-US';
}

function findMatchingOption(candidate, options) {
  if (!candidate) return null;
  if (options.includes(candidate)) return candidate;
  const fallback = candidate.split('-')[0];
  return options.find((option) => option.startsWith(fallback)) || null;
}

export function storeLanguage(
  language,
  storage = typeof window !== 'undefined' ? window.localStorage : undefined
) {
  if (!storage) return;
  storage.setItem(LANGUAGE_STORAGE_KEY, language);
}

export function createSpeechRecognitionController({
  onFinal,
  onInterim,
  onError,
}) {
  const SpeechRecognition =
    typeof window !== 'undefined' &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  if (!SpeechRecognition) {
    throw new Error('SpeechRecognition API is not available in this browser');
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  let active = false;
  let shouldRestart = false;

  recognition.onresult = (event) => {
    let finalTranscript = '';
    let interimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const result = event.results[i][0].transcript;
      if (event.results[i].isFinal) finalTranscript += result;
      else interimTranscript += result;
    }

    if (finalTranscript && typeof onFinal === 'function') {
      onFinal(finalTranscript);
    }
    if (typeof onInterim === 'function') {
      onInterim(interimTranscript);
    }
  };

  recognition.onerror = (event) => {
    if (typeof onError === 'function') onError(event);
    if (active) {
      try {
        recognition.stop();
        recognition.start();
      } catch (error) {
        // Swallow restart errors to avoid crashing the UI loop.
        if (typeof onError === 'function') {
          onError({ error: error.message, type: 'restart' });
        }
      }
    }
  };

  recognition.onend = () => {
    if (active && shouldRestart) {
      try {
        recognition.start();
      } catch (error) {
        if (typeof onError === 'function') {
          onError({ error: error.message, type: 'restart' });
        }
      }
    }
  };

  return {
    start() {
      if (active) return;
      active = true;
      shouldRestart = true;
      recognition.start();
    },
    stop() {
      if (!active) return;
      shouldRestart = false;
      active = false;
      recognition.stop();
    },
    setLanguage(language) {
      recognition.lang = language;
      if (active) {
        recognition.stop();
        shouldRestart = true;
      }
    },
    get isActive() {
      return active;
    },
  };
}

export async function transcribeAudioFile({ file, language }) {
  if (!file) throw new Error('File is required for transcription');

  if (!hasBrowserAudioSupport()) {
    return fallbackTranscription({ file, language });
  }

  let decoded;
  try {
    decoded = await decodeAudioFile(file);
  } catch (error) {
    console.warn(
      'Audio decode failed, falling back to single chunk transcription',
      error
    );
    return fallbackTranscription({ file, language });
  }

  const normalizedSegments = detectAndNormalizeSegments(decoded);
  const chunks = buildChunkPlan(decoded, normalizedSegments);

  const limiter = createLimiter(STT_CONFIG.concurrency);
  const chunkResults = new Array(chunks.length);

  const tasks = chunks.map((chunk, index) =>
    limiter(async () => {
      const pcmSlice = slicePcm({
        pcm: decoded.pcm,
        startMs: chunk.startMs,
        endMs: chunk.endMs,
        sampleRate: decoded.sampleRate,
      });
      const wav = encodeWav({ pcm: pcmSlice, sampleRate: decoded.sampleRate });
      /* istanbul ignore next */
      const chunkFile =
        typeof File !== 'undefined'
          ? new File(
              [wav],
              `${(file.name || 'audio').replace(/\.[^.]+$/, '')}-chunk-${String(index + 1).padStart(3, '0')}.wav`,
              {
                type: 'audio/wav',
              }
            )
          : wav;

      /* istanbul ignore next */
      const prompt =
        index > 0 && typeof chunkResults[index - 1] === 'string'
          ? chunkResults[index - 1].slice(-200)
          : undefined;

      const transcription = await transcribeFile({
        file: chunkFile,
        language,
        prompt,
      });
      chunkResults[index] = transcription || '';
    })
  );

  await Promise.all(tasks);

  return mergeTranscriptions(chunkResults);
}

export const __testables = {
  hasBrowserAudioSupport,
  fallbackTranscription,
  detectAndNormalizeSegments,
  buildChunkPlan,
};
