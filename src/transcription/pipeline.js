/* istanbul ignore file -- browser-only transcription orchestration */

import { decodeToMono16k, TARGET_SAMPLE_RATE } from '../audio/decode.js';
import { pcm16ToWav } from '../audio/wav.js';
import { computeSpeechSegments, DEFAULT_VAD_CONFIG } from '../vad/silero.js';
import {
  packSegmentsIntoChunks,
  extractPcmChunk,
  DEFAULT_CHUNK_CONFIG,
} from './chunking.js';
import { mergeChunkTranscripts } from './merge.js';

const PROMPT_TAIL_CHARS = 200;

function sanitizeBaseName(name) {
  if (typeof name !== 'string' || !name) return 'chunk';
  const normalized = name.replace(/[^a-z0-9]+/gi, '_').replace(/_+/g, '_');
  return normalized.slice(0, 32) || 'chunk';
}

function formatChunkFileName(baseName, index, startMs, endMs) {
  const paddedIndex = String(index + 1).padStart(3, '0');
  const start = Math.round(startMs);
  const end = Math.round(endMs);
  return `${baseName}_chunk${paddedIndex}_${start}-${end}.wav`;
}

function createLimiter(limit) {
  let active = 0;
  const queue = [];

  const next = () => {
    if (active >= limit) return;
    const item = queue.shift();
    if (!item) return;
    active += 1;
    item
      .fn()
      .then((value) => item.resolve(value))
      .catch((error) => item.reject(error))
      .finally(() => {
        active -= 1;
        next();
      });
  };

  return function enqueue(fn) {
    return new Promise((resolve, reject) => {
      queue.push({ fn, resolve, reject });
      next();
    });
  };
}

function getPromptFromResults(results, index) {
  if (index <= 0) return '';
  const previous = results[index - 1];
  if (!previous || !previous.text) return '';
  return previous.text.slice(-PROMPT_TAIL_CHARS);
}

async function transcribeChunk({
  chunk,
  pcmData,
  sampleRate,
  language,
  transcribe,
  baseName,
  prompt,
}) {
  const pcmSlice = extractPcmChunk(
    pcmData,
    sampleRate,
    chunk.startMs,
    chunk.endMs
  );
  const wavBuffer = pcm16ToWav(pcmSlice, sampleRate);
  const blob = new Blob([wavBuffer], { type: 'audio/wav' });
  const fileName = formatChunkFileName(
    baseName,
    chunk.index,
    chunk.startMs,
    chunk.endMs
  );
  const file = new File([blob], fileName, { type: 'audio/wav' });
  const text = await transcribe({ file, language, prompt });
  return {
    text: text || '',
    startMs: chunk.startMs,
    endMs: chunk.endMs,
  };
}

async function runChunks({
  chunks,
  pcmData,
  sampleRate,
  language,
  transcribe,
  fileName,
  concurrency,
}) {
  if (chunks.length === 0) return '';

  const baseName = sanitizeBaseName(fileName);
  const limit = createLimiter(Math.max(1, concurrency));
  const results = new Array(chunks.length);
  const tasks = [];

  const schedule = (index) => {
    if (index >= chunks.length) return;
    const chunk = chunks[index];
    const prompt = getPromptFromResults(results, index);
    const task = limit(() =>
      transcribeChunk({
        chunk,
        pcmData,
        sampleRate,
        language,
        transcribe,
        baseName,
        prompt,
      })
    ).then((result) => {
      results[index] = result;
      schedule(index + 1);
      return result;
    });
    tasks.push(task);
  };

  schedule(0);
  await Promise.all(tasks);

  const merged = mergeChunkTranscripts(results);
  return merged;
}

function resolveConfigs(vadConfig, chunkConfig) {
  return {
    vad: { ...DEFAULT_VAD_CONFIG, ...vadConfig },
    chunk: { ...DEFAULT_CHUNK_CONFIG, ...chunkConfig },
  };
}

async function decodeAndSegment(file, vadConfig) {
  const arrayBuffer = await file.arrayBuffer();
  const pcm16 = await decodeToMono16k(arrayBuffer);
  const durationMs = (pcm16.length / TARGET_SAMPLE_RATE) * 1000;

  try {
    const segments = await computeSpeechSegments(pcm16, vadConfig);
    return { pcm16, durationMs, segments };
  } catch (error) {
    console.warn(
      'VAD segmentation failed, falling back to time-based slicing',
      error
    );
    return { pcm16, durationMs, segments: [] };
  }
}

function createChunkPlan({ segments, durationMs, chunkConfig }) {
  return packSegmentsIntoChunks({
    segments,
    durationMs,
    sampleRate: TARGET_SAMPLE_RATE,
    maxChunkSec: chunkConfig.maxChunkSec,
    maxChunkBytes: chunkConfig.maxChunkBytes,
    overlapMs: chunkConfig.overlapMs,
  });
}

async function transcribeSingleChunk({
  pcm16,
  file,
  language,
  transcribe,
  durationMs,
}) {
  const wavBuffer = pcm16ToWav(pcm16, TARGET_SAMPLE_RATE);
  const blob = new Blob([wavBuffer], { type: 'audio/wav' });
  const baseName = sanitizeBaseName(file?.name || 'audio');
  const wavFile = new File(
    [blob],
    `${baseName}_chunk001_0-${Math.round(durationMs)}.wav`,
    {
      type: 'audio/wav',
    }
  );
  const text = await transcribe({ file: wavFile, language });
  return text || '';
}

export async function executeTranscriptionPipeline({
  file,
  language,
  transcribe,
  vadConfig = {},
  chunkConfig = {},
}) {
  if (!file || typeof file.arrayBuffer !== 'function') {
    throw new Error('A File or Blob with arrayBuffer() is required');
  }

  const configs = resolveConfigs(vadConfig, chunkConfig);
  const audio = await decodeAndSegment(file, configs.vad);
  const chunks = createChunkPlan({
    segments: audio.segments,
    durationMs: audio.durationMs,
    chunkConfig: configs.chunk,
  });

  if (chunks.length === 0) {
    return transcribeSingleChunk({
      pcm16: audio.pcm16,
      file,
      language,
      transcribe,
      durationMs: audio.durationMs,
    });
  }

  const transcription = await runChunks({
    chunks,
    pcmData: audio.pcm16,
    sampleRate: TARGET_SAMPLE_RATE,
    language,
    transcribe,
    fileName: file?.name || 'audio',
    concurrency: configs.chunk.concurrency || 1,
  });

  return transcription;
}
