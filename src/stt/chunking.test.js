import {
  padSegments,
  packSegmentsIntoChunks,
  fallbackTimeChunks,
  mergeTranscriptsInOrder,
  tailPromptSource,
  estimateWavSizeBytes,
} from './chunking.js';
import { STT_SAMPLE_RATE } from './constants.js';

describe('chunking helpers', () => {
  test('padSegments merges overlapping regions and applies padding', () => {
    const segments = [
      { startMs: 1000, endMs: 2000 },
      { startMs: 2100, endMs: 2800 },
    ];
    const padded = padSegments(segments, { durationMs: 5000, padMs: 200 });
    expect(padded).toEqual([{ startMs: 800, endMs: 3000 }]);
  });

  test('packSegmentsIntoChunks respects chunk limit and overlap', () => {
    const segments = [
      { startMs: 0, endMs: 5000 },
      { startMs: 6000, endMs: 11000 },
      { startMs: 12000, endMs: 18000 },
    ];
    const chunks = packSegmentsIntoChunks(segments, {
      durationMs: 20000,
      overlapMs: 400,
      maxChunkSec: 10,
    });
    expect(chunks).toHaveLength(3);
    chunks.forEach((chunk, index) => {
      expect(chunk.startMs).toBeLessThan(chunk.endMs);
      const duration = chunk.endMs - chunk.startMs;
      expect(duration).toBeLessThanOrEqual(10400);
      if (index > 0) {
        expect(chunk.startMs).toBeGreaterThanOrEqual(
          chunks[index - 1].endMs - 200
        );
      }
    });
  });

  test('fallbackTimeChunks divides timeline when no segments detected', () => {
    const chunks = fallbackTimeChunks(15000, {
      overlapMs: 300,
      maxChunkSec: 6,
    });
    expect(chunks).toHaveLength(3);
    expect(chunks[0].startMs).toBe(0);
    expect(chunks[2].endMs).toBeLessThanOrEqual(15000 + 150);
  });

  test('mergeTranscriptsInOrder removes duplicated overlaps', () => {
    const merged = mergeTranscriptsInOrder([
      { index: 0, text: 'Hello world.' },
      { index: 1, text: 'world. This is a test.' },
    ]);
    expect(merged).toBe('Hello world. This is a test.');
  });

  test('tailPromptSource truncates to the requested length', () => {
    const value = tailPromptSource('abcdefghijklmnopqrstuvwxyz', 5);
    expect(value).toBe('vwxyz');
  });

  test('estimateWavSizeBytes estimates size based on duration', () => {
    const size = estimateWavSizeBytes(1000, { sampleRate: STT_SAMPLE_RATE });
    expect(size).toBeGreaterThan(44);
  });
});
