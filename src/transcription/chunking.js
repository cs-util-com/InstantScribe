/* istanbul ignore file -- complex chunk planning validated via integration */

import { WAV_HEADER_BYTES } from '../audio/wav.js';
import { TARGET_SAMPLE_RATE } from '../audio/decode.js';

const BYTES_PER_SAMPLE = 2;
const MIN_CHUNK_MS = 250;

export const DEFAULT_CHUNK_CONFIG = {
  maxChunkSec: 1200,
  maxChunkBytes: 24 * 1024 * 1024,
  overlapMs: 500,
  sampleRate: TARGET_SAMPLE_RATE,
  concurrency: 3,
};

function clamp(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export function estimateChunkBytes(
  durationMs,
  sampleRate = TARGET_SAMPLE_RATE
) {
  const samples = Math.max(1, Math.ceil((durationMs / 1000) * sampleRate));
  return WAV_HEADER_BYTES + samples * BYTES_PER_SAMPLE;
}

function normalizeSegments(segments, durationMs) {
  if (!Array.isArray(segments)) return [];
  return segments
    .map((segment) => ({
      startMs: clamp(segment.startMs ?? 0, 0, durationMs),
      endMs: clamp(segment.endMs ?? 0, 0, durationMs),
    }))
    .filter((segment) => segment.endMs > segment.startMs)
    .sort((a, b) => a.startMs - b.startMs);
}

function createUniformChunks(durationMs, maxChunkMs) {
  if (!durationMs || durationMs <= 0) {
    return [];
  }

  const chunks = [];
  let start = 0;
  while (start < durationMs) {
    const end = Math.min(start + maxChunkMs, durationMs);
    chunks.push({ startMs: start, endMs: end });
    if (end === durationMs) break;
    start = end;
  }
  return chunks;
}

function maxDurationFromBytes(limitBytes, sampleRate) {
  const available = Math.max(limitBytes - WAV_HEADER_BYTES, BYTES_PER_SAMPLE);
  const samples = Math.floor(available / BYTES_PER_SAMPLE);
  if (samples <= 0) return 0;
  return (samples / sampleRate) * 1000;
}

function splitChunkByLimit(chunk, hardLimitMs) {
  if (chunk.endMs - chunk.startMs <= hardLimitMs) {
    return [chunk];
  }

  const segments = [];
  let start = chunk.startMs;
  while (start < chunk.endMs) {
    const end = Math.min(start + hardLimitMs, chunk.endMs);
    segments.push({ startMs: start, endMs: end });
    if (end === chunk.endMs) break;
    start = end;
  }
  return segments;
}

function applyOverlap(chunks, overlapMs) {
  for (let index = 1; index < chunks.length; index += 1) {
    const previous = chunks[index - 1];
    const current = chunks[index];
    const desiredStart = Math.max(previous.endMs - overlapMs, 0);
    if (current.startMs > desiredStart) {
      current.startMs = desiredStart;
    }
    current.startMs = Math.min(current.startMs, current.endMs - 1);
  }
}

function mergeSegmentsIntoChunks(
  segments,
  { maxChunkMs, maxChunkBytes, sampleRate, overlapMs }
) {
  const merged = [];
  let current = null;

  for (const segment of segments) {
    if (!current) {
      current = { ...segment };
      continue;
    }

    const candidate = {
      startMs: current.startMs,
      endMs: Math.max(current.endMs, segment.endMs),
    };
    const candidateDuration = candidate.endMs - candidate.startMs;
    const candidateBytes = estimateChunkBytes(candidateDuration, sampleRate);

    if (candidateDuration > maxChunkMs || candidateBytes > maxChunkBytes) {
      merged.push({ ...current });
      current = {
        startMs: Math.max(segment.startMs - overlapMs, 0),
        endMs: segment.endMs,
      };
    } else {
      current = candidate;
    }
  }

  if (current) {
    merged.push(current);
  }

  applyOverlap(merged, overlapMs);
  return merged;
}

function enforceChunkLimits({
  chunks,
  durationMs,
  sampleRate,
  hardLimitMs,
  maxChunkBytes,
}) {
  const bounded = [];
  for (const chunk of chunks) {
    const duration = chunk.endMs - chunk.startMs;
    const estimatedBytes = estimateChunkBytes(duration, sampleRate);
    if (duration <= hardLimitMs && estimatedBytes <= maxChunkBytes) {
      bounded.push(chunk);
      continue;
    }
    const splits = splitChunkByLimit(chunk, hardLimitMs);
    for (const split of splits) {
      const limitedDuration = split.endMs - split.startMs;
      const limitedBytes = estimateChunkBytes(limitedDuration, sampleRate);
      if (limitedBytes > maxChunkBytes) {
        const safeDuration = Math.max(
          maxDurationFromBytes(maxChunkBytes, sampleRate),
          MIN_CHUNK_MS
        );
        const smallerSplits = splitChunkByLimit(split, safeDuration);
        bounded.push(...smallerSplits);
      } else {
        bounded.push({ ...split });
      }
    }
  }

  return bounded
    .map((chunk) => ({
      startMs: clamp(chunk.startMs, 0, durationMs),
      endMs: clamp(chunk.endMs, 0, durationMs),
    }))
    .filter((chunk) => chunk.endMs > chunk.startMs);
}

export function packSegmentsIntoChunks({
  segments,
  durationMs,
  sampleRate = TARGET_SAMPLE_RATE,
  maxChunkSec = DEFAULT_CHUNK_CONFIG.maxChunkSec,
  maxChunkBytes = DEFAULT_CHUNK_CONFIG.maxChunkBytes,
  overlapMs = DEFAULT_CHUNK_CONFIG.overlapMs,
}) {
  const normalized = normalizeSegments(segments, durationMs);
  const maxChunkMs = maxChunkSec * 1000;
  const sizeLimitedMs = maxDurationFromBytes(maxChunkBytes, sampleRate);
  const hardLimitMs = Math.max(
    Math.min(maxChunkMs, sizeLimitedMs || maxChunkMs),
    MIN_CHUNK_MS
  );

  if (normalized.length === 0) {
    const fallback = createUniformChunks(durationMs, hardLimitMs);
    return fallback.map((chunk, index) => ({ ...chunk, index }));
  }

  const mergedChunks = mergeSegmentsIntoChunks(normalized, {
    maxChunkMs,
    maxChunkBytes,
    sampleRate,
    overlapMs,
  });

  const bounded = enforceChunkLimits({
    chunks: mergedChunks,
    durationMs,
    sampleRate,
    hardLimitMs,
    maxChunkBytes,
  });

  return bounded.map((chunk, index) => ({ ...chunk, index }));
}

export function extractPcmChunk(pcmData, sampleRate, startMs, endMs) {
  const startSample = Math.max(0, Math.floor((startMs / 1000) * sampleRate));
  const endSample = Math.max(
    startSample + 1,
    Math.ceil((endMs / 1000) * sampleRate)
  );
  return pcmData.subarray(startSample, endSample);
}
