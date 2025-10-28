import { transcribeFile } from './openai.js';
import { executeTranscriptionPipeline } from './transcription/pipeline.js';
import { DEFAULT_VAD_CONFIG } from './vad/silero.js';
import { DEFAULT_CHUNK_CONFIG } from './transcription/chunking.js';

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

const FALLBACK_ATTEMPTS = 2;

function adjustChunkConfig(config) {
  return {
    ...config,
    maxChunkSec: Math.max(300, Math.floor(config.maxChunkSec / 2)),
    maxChunkBytes: Math.max(
      8 * 1024 * 1024,
      Math.floor(config.maxChunkBytes * 0.75)
    ),
  };
}

async function runPipelineWithRetries({ file, language, attempts }) {
  const baseChunkConfig = { ...DEFAULT_CHUNK_CONFIG };
  let attempt = 0;
  let currentConfig = baseChunkConfig;
  let lastError = null;

  while (attempt <= attempts) {
    try {
      return await executeTranscriptionPipeline({
        file,
        language,
        transcribe: ({ file: chunkFile, language: chunkLanguage, prompt }) =>
          transcribeFile({ file: chunkFile, language: chunkLanguage, prompt }),
        vadConfig: DEFAULT_VAD_CONFIG,
        chunkConfig: currentConfig,
      });
    } catch (error) {
      lastError = error;
      attempt += 1;
      currentConfig = adjustChunkConfig(currentConfig);
    }
  }

  throw lastError || new Error('Transcription pipeline failed');
}

export async function transcribeAudioFile({ file, language }) {
  try {
    return await runPipelineWithRetries({
      file,
      language,
      attempts: FALLBACK_ATTEMPTS,
    });
  } catch (error) {
    console.warn('Falling back to single-file transcription', error);
    return transcribeFile({ file, language });
  }
}
