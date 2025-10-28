import {
  packSegmentsIntoChunks,
  estimateChunkBytes,
  extractPcmChunk,
  DEFAULT_CHUNK_CONFIG,
} from './chunking.js';
import { TARGET_SAMPLE_RATE } from '../audio/decode.js';

describe('chunk planning utilities', () => {
  test('estimateChunkBytes accounts for PCM16 payload', () => {
    const durationMs = 1000;
    const bytes = estimateChunkBytes(durationMs, TARGET_SAMPLE_RATE);
    expect(bytes).toBeGreaterThan(44);
  });

  test('packSegmentsIntoChunks merges segments with overlap and limits', () => {
    const segments = [
      { startMs: 0, endMs: 400000 },
      { startMs: 410000, endMs: 820000 },
      { startMs: 830000, endMs: 1400000 },
    ];
    const chunks = packSegmentsIntoChunks({
      segments,
      durationMs: 1500000,
      sampleRate: TARGET_SAMPLE_RATE,
      maxChunkSec: 600,
      maxChunkBytes: DEFAULT_CHUNK_CONFIG.maxChunkBytes,
      overlapMs: DEFAULT_CHUNK_CONFIG.overlapMs,
    });

    expect(chunks.length).toBeGreaterThanOrEqual(2);
    for (const chunk of chunks) {
      const duration = chunk.endMs - chunk.startMs;
      expect(duration).toBeLessThanOrEqual(
        600000 + DEFAULT_CHUNK_CONFIG.overlapMs
      );
      const estimatedBytes = estimateChunkBytes(duration, TARGET_SAMPLE_RATE);
      expect(estimatedBytes).toBeLessThanOrEqual(
        DEFAULT_CHUNK_CONFIG.maxChunkBytes + 2048
      );
    }
    if (chunks.length >= 2) {
      expect(chunks[1].startMs).toBeLessThan(chunks[0].endMs);
    }
  });

  test('packSegmentsIntoChunks falls back to uniform splits', () => {
    const chunks = packSegmentsIntoChunks({
      segments: [],
      durationMs: 900000,
      sampleRate: TARGET_SAMPLE_RATE,
      maxChunkSec: 600,
      maxChunkBytes: DEFAULT_CHUNK_CONFIG.maxChunkBytes,
      overlapMs: DEFAULT_CHUNK_CONFIG.overlapMs,
    });

    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks[0].startMs).toBe(0);
  });

  test('extractPcmChunk slices pcm data by millisecond range', () => {
    const samples = TARGET_SAMPLE_RATE * 2;
    const pcm = new Float32Array(samples);
    pcm[0] = 0.5;
    const slice = extractPcmChunk(pcm, TARGET_SAMPLE_RATE, 0, 1000);
    expect(slice.length).toBeGreaterThan(0);
    expect(slice[0]).toBeCloseTo(0.5);
  });

  test('packSegmentsIntoChunks splits segments exceeding byte limit', () => {
    const longSegment = { startMs: 0, endMs: 2000000 };
    const chunks = packSegmentsIntoChunks({
      segments: [longSegment],
      durationMs: 2000000,
      sampleRate: TARGET_SAMPLE_RATE,
      maxChunkSec: 1200,
      maxChunkBytes: estimateChunkBytes(500000, TARGET_SAMPLE_RATE),
      overlapMs: DEFAULT_CHUNK_CONFIG.overlapMs,
    });

    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) {
      const duration = chunk.endMs - chunk.startMs;
      expect(duration).toBeLessThanOrEqual(
        500000 + DEFAULT_CHUNK_CONFIG.overlapMs
      );
    }
  });

  test('packSegmentsIntoChunks keeps overlap between consecutive chunks', () => {
    const segments = [
      { startMs: 0, endMs: 400000 },
      { startMs: 410000, endMs: 800000 },
      { startMs: 1200000, endMs: 1500000 },
    ];
    const chunks = packSegmentsIntoChunks({
      segments,
      durationMs: 1500000,
      sampleRate: TARGET_SAMPLE_RATE,
      maxChunkSec: 600,
      maxChunkBytes: DEFAULT_CHUNK_CONFIG.maxChunkBytes,
      overlapMs: 500,
    });

    for (let i = 1; i < chunks.length; i += 1) {
      expect(chunks[i].startMs).toBeLessThanOrEqual(chunks[i - 1].endMs);
    }
  });
});
