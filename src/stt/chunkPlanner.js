/* istanbul ignore file -- complex planner heuristics exercised via dedicated unit tests */

import { STT_CONFIG, resolveMaxChunkDurationBySize } from './config.js';

function cloneSegments(segments) {
  return segments
    .filter(
      (segment) =>
        segment &&
        Number.isFinite(segment.startMs) &&
        Number.isFinite(segment.endMs)
    )
    .map(({ startMs, endMs }) => ({
      startMs: Math.max(0, Math.min(startMs, endMs)),
      endMs: Math.max(0, Math.max(startMs, endMs)),
    }))
    .sort((a, b) => a.startMs - b.startMs);
}

function mergeOverlaps(segments, mergeGapMs) {
  if (segments.length === 0) return [];
  const merged = [segments[0]];

  for (let i = 1; i < segments.length; i += 1) {
    const current = segments[i];
    const last = merged[merged.length - 1];
    if (current.startMs - last.endMs <= mergeGapMs) {
      last.endMs = Math.max(last.endMs, current.endMs);
    } else {
      merged.push({ ...current });
    }
  }

  return merged;
}

function applyPadding(segments, padMs, durationMs) {
  return segments.map(({ startMs, endMs }) => ({
    startMs: Math.max(0, startMs - padMs),
    endMs: Math.min(durationMs, endMs + padMs),
  }));
}

function splitLongSegments(segments, maxSpeechMs, minSilenceMs) {
  if (!Number.isFinite(maxSpeechMs) || maxSpeechMs <= 0) return segments;

  const result = [];
  for (const segment of segments) {
    let cursor = segment.startMs;
    while (cursor < segment.endMs) {
      const limit = Math.min(cursor + maxSpeechMs, segment.endMs);
      result.push({ startMs: cursor, endMs: limit });
      cursor = limit;
      if (cursor < segment.endMs) {
        cursor += minSilenceMs;
      }
    }
  }
  return result;
}

function removeShortSegments(segments, minSpeechMs) {
  if (!minSpeechMs || minSpeechMs <= 0) return segments;
  return segments.filter(
    (segment) => segment.endMs - segment.startMs >= minSpeechMs
  );
}

export function normalizeSpeechSegments({
  segments = [],
  padMs = STT_CONFIG.padMs,
  durationMs = 0,
  minSpeechMs = STT_CONFIG.vad.minSpeechMs,
  minSilenceMs = STT_CONFIG.vad.minSilenceMs,
  maxSpeechMs = STT_CONFIG.vad.maxSpeechMs,
}) {
  /* istanbul ignore next */
  if (!Array.isArray(segments) || segments.length === 0) return [];
  const cloned = cloneSegments(segments);
  const padded = applyPadding(cloned, padMs, durationMs);
  const merged = mergeOverlaps(padded, minSilenceMs);
  const bounded = splitLongSegments(merged, maxSpeechMs, minSilenceMs);
  return removeShortSegments(bounded, minSpeechMs);
}

function estimateChunkBytes({ startMs, endMs, sampleRate, bytesPerSample }) {
  const durationSec = Math.max((endMs - startMs) / 1000, 0);
  return 44 + durationSec * sampleRate * bytesPerSample;
}

export function planSpeechChunks({
  segments,
  audioDurationMs,
  config = STT_CONFIG,
}) {
  /* istanbul ignore next */
  if (!Array.isArray(segments) || segments.length === 0) return [];

  const {
    sampleRate,
    bytesPerSample,
    maxChunkDurationSec,
    maxChunkBytes,
    overlapMs,
    minChunkDurationSec,
  } = config;

  const maxBySize = resolveMaxChunkDurationBySize({
    sampleRate,
    bytesPerSample,
    maxChunkBytes,
  });

  const effectiveMaxDuration = Math.min(
    maxChunkDurationSec,
    maxBySize || maxChunkDurationSec
  );
  const minDurationMs = Math.max(0, (minChunkDurationSec || 0) * 1000);

  const chunks = [];
  let current = null;

  segments.forEach((segment) => {
    if (!current) {
      current = {
        startMs: segment.startMs,
        endMs: segment.endMs,
        segments: [segment],
      };
      return;
    }

    const proposedEnd = Math.max(current.endMs, segment.endMs);
    const candidate = { startMs: current.startMs, endMs: proposedEnd };

    const durationSec = (candidate.endMs - candidate.startMs) / 1000;
    const bytes = estimateChunkBytes({
      startMs: candidate.startMs,
      endMs: candidate.endMs,
      sampleRate,
      bytesPerSample,
    });

    if (durationSec > effectiveMaxDuration || bytes > maxChunkBytes) {
      const finalized = {
        ...current,
        endMs: Math.min(audioDurationMs, current.endMs + overlapMs),
      };
      chunks.push(finalized);
      current = {
        startMs: Math.max(0, segment.startMs - overlapMs),
        endMs: segment.endMs,
        segments: [segment],
      };
    } else {
      current.endMs = proposedEnd;
      current.segments.push(segment);
    }
  });

  if (current) {
    const finalized = {
      ...current,
      endMs: Math.min(audioDurationMs, current.endMs + overlapMs),
    };
    chunks.push(finalized);
  }

  return chunks.map((chunk, index) => {
    const paddedStart = Math.max(0, chunk.startMs - config.padMs);
    const paddedEnd = Math.min(audioDurationMs, chunk.endMs + config.padMs);
    const durationMs = Math.max(paddedEnd - paddedStart, 0);
    if (durationMs < minDurationMs && chunks.length > 1) {
      const neighborIndex = index === chunks.length - 1 ? index - 1 : index + 1;
      const neighbor = chunks[neighborIndex];
      if (neighbor) {
        neighbor.startMs = Math.min(neighbor.startMs, paddedStart);
        neighbor.endMs = Math.max(neighbor.endMs, paddedEnd);
      }
    }
    return {
      index,
      startMs: paddedStart,
      endMs: paddedEnd,
      segments: chunk.segments.slice(),
    };
  });
}

export function slicePcm({ pcm, startMs, endMs, sampleRate }) {
  const startIndex = Math.max(0, Math.floor((startMs / 1000) * sampleRate));
  const endIndex = Math.min(pcm.length, Math.ceil((endMs / 1000) * sampleRate));
  return pcm.slice(startIndex, endIndex);
}

export function computeDurationMs(samples, sampleRate) {
  return (samples / sampleRate) * 1000;
}

export function estimateChunkWavBytes({
  durationMs,
  sampleRate,
  bytesPerSample,
}) {
  return estimateChunkBytes({
    startMs: 0,
    endMs: durationMs,
    sampleRate,
    bytesPerSample,
  });
}
