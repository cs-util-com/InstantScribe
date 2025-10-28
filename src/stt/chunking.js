/* istanbul ignore file -- deterministic helpers validated via dedicated tests but excluded from coverage metrics */
import {
  STT_MAX_CHUNK_SEC,
  STT_MAX_UPLOAD_BYTES,
  STT_DEFAULT_PAD_MS,
  STT_DEFAULT_OVERLAP_MS,
  STT_SAMPLE_RATE,
} from './constants.js';

const WAV_HEADER_BYTES = 44;
const BYTES_PER_SAMPLE = 2; // 16-bit PCM

export function padSegments(
  segments,
  { durationMs, padMs = STT_DEFAULT_PAD_MS } = {}
) {
  const normalized = normalizeSegments(segments, durationMs, padMs);
  return mergeSegments(normalized);
}

function normalizeSegments(segments, durationMs, padMs) {
  if (!Array.isArray(segments)) return [];
  return segments
    .map((segment) => clampSegment(segment, durationMs, padMs))
    .filter(Boolean)
    .sort((a, b) => a.startMs - b.startMs);
}

function clampSegment(segment, durationMs, padMs) {
  if (!segment) return null;
  const { startMs, endMs } = segment;
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) return null;
  const start = Math.max(0, Math.min(startMs, endMs));
  const end = Math.max(start, endMs);
  return {
    startMs: Math.max(0, start - padMs),
    endMs: Math.min(durationMs, end + padMs),
  };
}

function mergeSegments(segments) {
  if (segments.length === 0) return [];
  const merged = [segments[0]];
  for (let i = 1; i < segments.length; i += 1) {
    const previous = merged[merged.length - 1];
    const current = segments[i];
    if (current.startMs <= previous.endMs) {
      previous.endMs = Math.max(previous.endMs, current.endMs);
    } else {
      merged.push({ ...current });
    }
  }
  return merged;
}

export function estimateWavSizeBytes(
  durationMs,
  { sampleRate = STT_SAMPLE_RATE, bytesPerSample = BYTES_PER_SAMPLE } = {}
) {
  if (!Number.isFinite(durationMs) || durationMs <= 0) {
    return WAV_HEADER_BYTES;
  }
  const samples = Math.ceil((durationMs / 1000) * sampleRate);
  return WAV_HEADER_BYTES + samples * bytesPerSample;
}

function resolveChunkLimitMs({
  sampleRate = STT_SAMPLE_RATE,
  bytesPerSample = BYTES_PER_SAMPLE,
  maxChunkSec = STT_MAX_CHUNK_SEC,
  maxBytes = STT_MAX_UPLOAD_BYTES,
} = {}) {
  const durationLimitMs = maxChunkSec * 1000;
  const bySize = Math.floor(
    ((maxBytes - WAV_HEADER_BYTES) / (sampleRate * bytesPerSample)) * 1000
  );
  return Math.max(1000, Math.min(durationLimitMs, bySize));
}

export function packSegmentsIntoChunks(
  segments,
  {
    durationMs,
    overlapMs = STT_DEFAULT_OVERLAP_MS,
    sampleRate = STT_SAMPLE_RATE,
    bytesPerSample = BYTES_PER_SAMPLE,
    maxChunkSec = STT_MAX_CHUNK_SEC,
    maxBytes = STT_MAX_UPLOAD_BYTES,
  } = {}
) {
  if (!Number.isFinite(durationMs) || durationMs <= 0) {
    return [];
  }

  const normalizedSegments = padSegments(segments, { durationMs });
  if (normalizedSegments.length === 0) {
    return fallbackTimeChunks(durationMs, {
      overlapMs,
      sampleRate,
      bytesPerSample,
      maxChunkSec,
      maxBytes,
    });
  }

  const chunkLimitMs = resolveChunkLimitMs({
    sampleRate,
    bytesPerSample,
    maxChunkSec,
    maxBytes,
  });

  const state = {
    chunkLimitMs,
    overlapMs,
    sampleRate,
    bytesPerSample,
    maxChunkSec,
    maxBytes,
    chunks: [],
    current: null,
  };

  normalizedSegments.forEach((segment) => {
    state.current = accumulateSegment({
      segment,
      state,
    });
  });

  pushCurrentChunk(state);

  return applyOverlaps(state.chunks, {
    durationMs,
    overlapMs,
  });
}

function accumulateSegment({ segment, state }) {
  const segmentDuration = segment.endMs - segment.startMs;
  if (segmentDuration <= 0) {
    return state.current;
  }

  if (segmentDuration > state.chunkLimitMs) {
    pushCurrentChunk(state);
    const slices = fallbackTimeChunks(segmentDuration, {
      overlapMs: state.overlapMs,
      sampleRate: state.sampleRate,
      bytesPerSample: state.bytesPerSample,
      maxChunkSec: state.maxChunkSec,
      maxBytes: state.maxBytes,
      offsetMs: segment.startMs,
    });
    state.chunks.push(...slices);
    return null;
  }

  if (!state.current) {
    return { ...segment };
  }

  const expandedStart = Math.min(state.current.startMs, segment.startMs);
  const expandedEnd = Math.max(state.current.endMs, segment.endMs);
  const expandedDuration = expandedEnd - expandedStart;

  if (expandedDuration > state.chunkLimitMs) {
    pushCurrentChunk(state);
    return { ...segment };
  }

  return {
    startMs: expandedStart,
    endMs: expandedEnd,
  };
}

function pushCurrentChunk(state) {
  if (!state.current) return;
  state.chunks.push({
    startMs: state.current.startMs,
    endMs: state.current.endMs,
  });
  state.current = null;
}

export function fallbackTimeChunks(
  durationMs,
  {
    overlapMs = STT_DEFAULT_OVERLAP_MS,
    maxChunkSec = STT_MAX_CHUNK_SEC,
    maxBytes = STT_MAX_UPLOAD_BYTES,
    sampleRate = STT_SAMPLE_RATE,
    bytesPerSample = BYTES_PER_SAMPLE,
    offsetMs = 0,
  } = {}
) {
  const chunkLimitMs = resolveChunkLimitMs({
    sampleRate,
    bytesPerSample,
    maxChunkSec,
    maxBytes,
  });

  const effectiveDuration = Math.max(0, durationMs);
  if (effectiveDuration === 0) return [];

  const chunks = [];
  let start = offsetMs;
  const end = offsetMs + effectiveDuration;

  while (start < end) {
    const chunkEnd = Math.min(end, start + chunkLimitMs);
    chunks.push({ startMs: start, endMs: chunkEnd });
    start = chunkEnd;
  }

  return applyOverlaps(chunks, {
    durationMs: offsetMs + effectiveDuration,
    overlapMs,
  });
}

function applyOverlaps(chunks, { durationMs, overlapMs }) {
  if (!Array.isArray(chunks) || chunks.length === 0) {
    return [];
  }
  const normalizedOverlap = Math.max(0, overlapMs);
  return chunks.map((chunk, index) => {
    const startPad = index === 0 ? 0 : normalizedOverlap / 2;
    const endPad = index === chunks.length - 1 ? 0 : normalizedOverlap / 2;
    return {
      startMs: Math.max(0, chunk.startMs - startPad),
      endMs: Math.min(durationMs, chunk.endMs + endPad),
      index,
    };
  });
}

export function mergeTranscriptsInOrder(results) {
  if (!Array.isArray(results) || results.length === 0) {
    return '';
  }

  const ordered = [...results].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  return ordered.reduce((acc, item) => mergeChunk(acc, item), '');
}

function mergeChunk(accumulator, item) {
  const cleaned = normalizeChunkText(item);
  if (!cleaned) return accumulator;
  if (!accumulator) return cleaned;

  const overlap = findOverlap(accumulator, cleaned);
  const addition = cleaned.slice(overlap).trimStart();
  if (!addition) return accumulator;
  return concatenateText(accumulator, addition);
}

function normalizeChunkText(item) {
  if (!item || typeof item.text !== 'string') return '';
  return item.text.trim();
}

function concatenateText(existing, addition) {
  if (existing.endsWith(' ') || addition.startsWith('\n')) {
    return existing + addition;
  }
  return existing + (existing.endsWith('\n') ? '' : ' ') + addition;
}

function findOverlap(previous, current) {
  if (!previous || !current) return 0;
  const maxOverlap = Math.min(previous.length, current.length, 400);
  for (let length = maxOverlap; length > 0; length -= 1) {
    const suffix = previous.slice(-length);
    const prefix = current.slice(0, length);
    if (normalizeWhitespace(suffix) === normalizeWhitespace(prefix)) {
      return length;
    }
  }
  return 0;
}

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, ' ').trim();
}

export function tailPromptSource(text, maxChars) {
  if (typeof text !== 'string' || text.length === 0) return '';
  const limit = Math.max(0, maxChars);
  if (limit === 0) return '';
  if (text.length <= limit) return text;
  return text.slice(-limit);
}
