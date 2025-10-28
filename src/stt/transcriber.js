import { decodeToMono16k, encodeWavChunk } from './audio.js';
import { detectSpeechSegments } from './vad.js';
import { planChunks, buildFallbackChunks } from './chunking.js';
import { buildPromptFromTail, mergeChunkResults } from './merge.js';
import { STT_CONFIG } from './config.js';
import { transcribeFile } from '../openai.js';

function createLimiter(concurrency) {
  let active = 0;
  const queue = [];

  const next = () => {
    if (active >= concurrency) return;
    const task = queue.shift();
    if (!task) return;
    active += 1;
    Promise.resolve()
      .then(task.fn)
      .then(task.resolve, task.reject)
      .finally(() => {
        active -= 1;
        next();
      });
  };

  return (fn) =>
    new Promise((resolve, reject) => {
      queue.push({ fn, resolve, reject });
      next();
    });
}

function buildChunkFileName(baseName, index) {
  const padded = String(index + 1).padStart(3, '0');
  return `${baseName}-chunk-${padded}.wav`;
}

function createChunkFiles(pcm, chunks, baseName) {
  const files = [];

  for (const chunk of chunks) {
    const encoded = encodeWavChunk(pcm, chunk.renderStartMs, chunk.renderEndMs);
    if (!encoded) continue;
    const fileName = buildChunkFileName(baseName, chunk.index);
    const file = new File([encoded.blob], fileName, { type: 'audio/wav' });
    files.push({ ...chunk, file, durationMs: encoded.durationMs });
  }

  return files;
}

function makeFileFromSlice({ file, start, end, index }) {
  const slice = file.slice(start, end);
  const padded = String(index + 1).padStart(3, '0');
  const originalName = file.name || 'audio';
  const suffix =
    file.type && !file.type.includes('wav') && !originalName.endsWith('.wav')
      ? '.bin'
      : '';
  const name = `${originalName}-fallback-${padded}${suffix}`;
  return new File([slice], name, {
    type: file.type || 'application/octet-stream',
  });
}

async function fallbackByteChunking({ file, language }) {
  const maxBytes = STT_CONFIG.maxChunkBytes;
  const chunks = Math.ceil(file.size / maxBytes);
  const results = [];
  let accumulated = '';

  for (let index = 0; index < chunks; index += 1) {
    const start = index * maxBytes;
    const end = Math.min(file.size, start + maxBytes);
    const chunkFile = makeFileFromSlice({ file, start, end, index });
    const prompt = buildPromptFromTail(accumulated);
    const text = await transcribeFile({ file: chunkFile, language, prompt });
    results.push({ index, text });
    accumulated = accumulated ? `${accumulated}\n${text}` : text;
  }

  return mergeChunkResults(results);
}

export async function chunkedTranscription({ file, language }) {
  const baseName = (file?.name || 'audio').replace(/\.[^/.]+$/, '');
  let pcmInfo;
  let chunks = [];

  try {
    pcmInfo = await decodeToMono16k(file);
  } catch (error) {
    console.warn(
      'Falling back to byte-based chunking due to decode failure',
      error
    );
    return fallbackByteChunking({ file, language });
  }

  const { pcm, durationMs } = pcmInfo;

  try {
    const vadSegments = await detectSpeechSegments(pcm);
    chunks = planChunks({ segments: vadSegments, durationMs });
  } catch (error) {
    console.warn('VAD segmentation failed, using fallback chunking', error);
    chunks = buildFallbackChunks(durationMs);
  }

  const chunkFiles = createChunkFiles(pcm, chunks, baseName);
  if (!chunkFiles.length) {
    throw new Error('Failed to prepare audio chunks for transcription');
  }

  const limit = createLimiter(STT_CONFIG.uploadConcurrency);
  const results = [];
  let accumulatedText = '';

  for (const chunk of chunkFiles) {
    const prompt = buildPromptFromTail(accumulatedText);
    const task = limit(async () => {
      const text = await transcribeFile({
        file: chunk.file,
        language,
        prompt,
      });
      return { index: chunk.index, text };
    });

    const result = await task;
    results.push(result);
    accumulatedText = accumulatedText
      ? `${accumulatedText}\n${result.text}`
      : result.text;
  }

  return mergeChunkResults(results);
}
