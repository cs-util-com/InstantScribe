import { STT_CONFIG } from './config.js';
import { estimateChunkBytes } from './audio.js';

function normalizeSegment(segment, durationMs) {
  const startMs = Math.max(
    0,
    Math.min(durationMs, Math.floor(segment.startMs))
  );
  const endMs = Math.max(
    startMs,
    Math.min(durationMs, Math.ceil(segment.endMs))
  );
  return { startMs, endMs };
}

export function normalizeSegments(segments, durationMs) {
  const normalized = segments
    .map((segment) => normalizeSegment(segment, durationMs))
    .filter((segment) => segment.endMs > segment.startMs);

  if (!normalized.length) return [];

  normalized.sort((a, b) => a.startMs - b.startMs);
  const merged = [normalized[0]];

  for (let i = 1; i < normalized.length; i += 1) {
    const current = normalized[i];
    const prev = merged[merged.length - 1];

    if (current.startMs <= prev.endMs) {
      prev.endMs = Math.max(prev.endMs, current.endMs);
    } else {
      merged.push(current);
    }
  }

  return merged;
}

function shouldFinalizeChunk(chunk, segmentEndMs, estimateBytes) {
  const duration = segmentEndMs - chunk.startMs;
  if (duration <= 0) return false;
  if (duration >= STT_CONFIG.maxChunkMs) return true;
  if (estimateBytes(duration) >= STT_CONFIG.maxChunkBytes) return true;
  return false;
}

export function packSegmentsIntoChunks(segments, durationMs) {
  const normalized = normalizeSegments(segments, durationMs);
  const chunks = [];
  const estimateBytes = (duration) => estimateChunkBytes(duration);

  if (!normalized.length) {
    const safeMax = Math.min(
      STT_CONFIG.maxChunkMs,
      Math.floor(
        (STT_CONFIG.maxChunkBytes /
          (STT_CONFIG.sampleRate * STT_CONFIG.wavBytesPerSample)) *
          1000
      )
    );
    const chunkDuration = Math.max(60_000, safeMax);

    for (let start = 0; start < durationMs; start += chunkDuration) {
      const end = Math.min(durationMs, start + chunkDuration);
      chunks.push({ startMs: start, endMs: end });
    }
    return chunks;
  }

  let current = {
    startMs: normalized[0].startMs,
    endMs: normalized[0].endMs,
  };

  for (let i = 1; i < normalized.length; i += 1) {
    const segment = normalized[i];
    const prospectiveEnd = Math.max(current.endMs, segment.endMs);
    const finalize = shouldFinalizeChunk(
      current,
      prospectiveEnd,
      estimateBytes
    );

    if (finalize) {
      chunks.push({ ...current });
      current = {
        startMs: Math.max(segment.startMs, current.endMs),
        endMs: segment.endMs,
      };
    } else {
      current.endMs = prospectiveEnd;
    }
  }

  chunks.push({ ...current });
  return chunks;
}

export function applyChunkOverlaps(chunks, durationMs) {
  if (!chunks.length) return [];

  return chunks.map((chunk, index) => {
    const startOverlap = index === 0 ? 0 : STT_CONFIG.chunkOverlapMs;
    const endOverlap =
      index === chunks.length - 1 ? 0 : STT_CONFIG.chunkOverlapMs;

    return {
      ...chunk,
      renderStartMs: Math.max(0, chunk.startMs - startOverlap),
      renderEndMs: Math.min(durationMs, chunk.endMs + endOverlap),
      index,
    };
  });
}

export function buildFallbackChunks(durationMs) {
  const estimateBytes = (duration) => estimateChunkBytes(duration);
  const safeDuration = Math.min(
    STT_CONFIG.maxChunkMs,
    Math.floor(
      (STT_CONFIG.maxChunkBytes /
        (STT_CONFIG.sampleRate * STT_CONFIG.wavBytesPerSample)) *
        1000
    )
  );
  const chunkDuration = Math.max(5 * 60_000, safeDuration);
  const chunks = [];

  for (let start = 0; start < durationMs; start += chunkDuration) {
    const end = Math.min(durationMs, start + chunkDuration);
    const duration = end - start;
    if (duration <= 0) continue;
    if (estimateBytes(duration) > STT_CONFIG.maxChunkBytes) {
      const maxDuration = Math.floor(
        (STT_CONFIG.maxChunkBytes /
          (STT_CONFIG.sampleRate * STT_CONFIG.wavBytesPerSample)) *
          1000
      );
      const midpoint = start + Math.floor(maxDuration / 2);
      chunks.push({ startMs: start, endMs: midpoint });
      chunks.push({ startMs: midpoint, endMs: end });
    } else {
      chunks.push({ startMs: start, endMs: end });
    }
  }

  return applyChunkOverlaps(chunks, durationMs);
}

export function planChunks({ segments, durationMs }) {
  const packed = packSegmentsIntoChunks(segments, durationMs);
  const withOverlap = applyChunkOverlaps(packed, durationMs);
  return withOverlap.length ? withOverlap : buildFallbackChunks(durationMs);
}
