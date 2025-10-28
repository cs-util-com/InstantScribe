import {
  STT_MAX_CHUNK_SEC,
  STT_UPLOAD_CONCURRENCY,
  STT_PROMPT_TAIL_CHARS,
  STT_SAMPLE_RATE,
} from './constants.js';
import {
  packSegmentsIntoChunks,
  mergeTranscriptsInOrder,
  tailPromptSource,
} from './chunking.js';
import {
  decodeToMono16k,
  pcmSliceToWav,
  supportsAudioProcessing,
} from './audio.js';
import { detectSpeechSegments } from './vad.js';
import { transcribeFile } from '../openai.js';

const DEFAULT_OPTIONS = {
  overlapMs: 500,
  maxChunkSec: STT_MAX_CHUNK_SEC,
};

export function supportsChunkedTranscription() {
  if (typeof window === 'undefined') return false;
  if (!supportsAudioProcessing()) return false;
  if (typeof window.Blob !== 'function' || typeof window.File !== 'function') {
    return false;
  }
  return true;
}

export async function transcribeWithVad({ file, language }, options = {}) {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  const { pcm, durationMs } = await decodeToMono16k(file);
  const segments = await detectSpeechSegments(pcm, {
    sampleRate: STT_SAMPLE_RATE,
    windowSize: 512,
  });
  const chunks = packSegmentsIntoChunks(segments, {
    durationMs,
    overlapMs: mergedOptions.overlapMs,
    maxChunkSec: mergedOptions.maxChunkSec,
  });

  if (chunks.length === 0) {
    return transcribeFile({ file, language });
  }

  const promptTracker = createPromptTracker();
  const completion = chunks.map(() => null);

  const tasks = chunks.map((chunk, index) => {
    let resolveCompletion;
    let rejectCompletion;
    const completionPromise = new Promise((resolve, reject) => {
      resolveCompletion = resolve;
      rejectCompletion = reject;
    });
    completion[index] = completionPromise;

    return async () => {
      if (index > 0) {
        try {
          await completion[index - 1];
        } catch (error) {
          rejectCompletion(error);
          throw error;
        }
      }

      const prompt = promptTracker.source();

      try {
        const result = await transcribeChunk({
          chunk,
          pcm,
          language,
          prompt,
          onChunkComplete: mergedOptions.onChunkComplete,
        });
        promptTracker.append(result.text);
        resolveCompletion(result);
        return result;
      } catch (error) {
        rejectCompletion(error);
        throw error;
      }
    };
  });

  const results = await runWithConcurrency(tasks, STT_UPLOAD_CONCURRENCY);
  const merged = mergeTranscriptsInOrder(results);
  return merged;
}

async function transcribeChunk({
  chunk,
  pcm,
  language,
  prompt,
  onChunkComplete,
}) {
  const { startMs, endMs, index } = chunk;
  const wavBlob = pcmSliceToWav(pcm, startMs, endMs, STT_SAMPLE_RATE);
  const fileName = `chunk-${index}.wav`;
  const chunkFile = new File([wavBlob], fileName, { type: 'audio/wav' });

  const response = await transcribeFile({
    file: chunkFile,
    language,
    prompt,
  });

  if (typeof onChunkComplete === 'function') {
    onChunkComplete({ index, text: response });
  }

  return { index, text: response };
}

async function runWithConcurrency(tasks, limit) {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return [];
  }
  const cappedLimit = Math.max(1, Math.min(limit || 1, tasks.length));
  const results = new Array(tasks.length);
  let nextIndex = 0;

  async function worker() {
    while (true) {
      if (nextIndex >= tasks.length) return;
      const current = nextIndex;
      nextIndex += 1;
      const task = tasks[current];
      results[current] = await task();
    }
  }

  const workers = Array.from({ length: cappedLimit }, () => worker());
  await Promise.all(workers);
  return results;
}

export function createPromptTracker() {
  let mergedText = '';
  return {
    source() {
      return tailPromptSource(mergedText, STT_PROMPT_TAIL_CHARS);
    },
    append(text) {
      if (typeof text !== 'string' || text.trim().length === 0) return;
      if (!mergedText) {
        mergedText = text.trim();
        return;
      }
      mergedText = mergeTranscriptsInOrder([
        { index: 0, text: mergedText },
        { index: 1, text },
      ]);
    },
    get value() {
      return mergedText;
    },
  };
}

export const __TESTING__ = {
  runWithConcurrency,
};
