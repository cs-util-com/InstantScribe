/* istanbul ignore file -- deterministic fallback chunker exercised via higher-level tests */

import { STT_CONFIG, resolveMaxChunkDurationBySize } from './config.js';

export function buildTimeChunks({ durationMs, config = STT_CONFIG }) {
  const {
    sampleRate,
    bytesPerSample,
    maxChunkDurationSec,
    maxChunkBytes,
    overlapMs,
  } = config;

  if (!Number.isFinite(durationMs) || durationMs <= 0) {
    return [];
  }

  const maxBySize = resolveMaxChunkDurationBySize({
    sampleRate,
    bytesPerSample,
    maxChunkBytes,
  });
  const maxDurationSec = Math.max(
    1,
    Math.min(maxChunkDurationSec, maxBySize || maxChunkDurationSec)
  );
  const chunkDurationMs = maxDurationSec * 1000;

  const chunks = [];
  let start = 0;
  let index = 0;

  while (start < durationMs) {
    const end = Math.min(durationMs, start + chunkDurationMs);
    const paddedEnd = Math.min(durationMs, end + overlapMs);
    const paddedStart = Math.max(0, start - (index === 0 ? 0 : overlapMs));
    chunks.push({
      index,
      startMs: paddedStart,
      endMs: paddedEnd,
      segments: [
        {
          startMs: paddedStart,
          endMs: paddedEnd,
        },
      ],
    });
    index += 1;
    start = end;
  }

  return chunks;
}
