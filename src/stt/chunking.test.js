import { planChunks, buildFallbackChunks } from './chunking.js';
import { STT_CONFIG } from './config.js';

describe('chunk planning utilities', () => {
  test('planChunks splits segments exceeding max duration', () => {
    const segments = [
      { startMs: 0, endMs: 600_000 },
      { startMs: 610_000, endMs: 1_300_000 },
    ];
    const chunks = planChunks({ segments, durationMs: 1_400_000 });
    expect(chunks).toHaveLength(2);
    expect(chunks[0].renderStartMs).toBe(0);
    expect(chunks[1].renderStartMs).toBeGreaterThan(chunks[0].renderStartMs);
    expect(chunks[0].renderEndMs - chunks[0].renderStartMs).toBeLessThanOrEqual(
      1_200_000 + 500
    );
  });

  test('planChunks falls back when no speech detected', () => {
    const chunks = planChunks({ segments: [], durationMs: 900_000 });
    expect(chunks.length).toBeGreaterThan(0);
    chunks.forEach((chunk, index) => {
      expect(chunk.index).toBe(index);
      expect(chunk.renderEndMs).toBeGreaterThan(chunk.renderStartMs);
    });
  });

  test('buildFallbackChunks total rendered duration is reasonable', () => {
    const durationMs = 10 * 60 * 1000; // 10 minutes
    const chunks = buildFallbackChunks(durationMs);
    const totalRendered = chunks.reduce(
      (sum, chunk) => sum + (chunk.renderEndMs - chunk.renderStartMs),
      0
    );
    // For fallback chunks with overlap, total should be close to input duration
    // Allow up to 10% extra for overlaps
    expect(totalRendered).toBeLessThanOrEqual(durationMs * 1.1);
    expect(totalRendered).toBeGreaterThanOrEqual(durationMs);
  });

  test('planChunks respects size thresholds during packing', () => {
    const originalBytes = STT_CONFIG.maxChunkBytes;
    STT_CONFIG.maxChunkBytes = 32_000;
    const segments = [
      { startMs: 0, endMs: 40_000 },
      { startMs: 45_000, endMs: 80_000 },
    ];
    const chunks = planChunks({ segments, durationMs: 90_000 });
    expect(chunks.length).toBeGreaterThan(1);
    STT_CONFIG.maxChunkBytes = originalBytes;
  });

  test('planChunks keeps single chunk when under limits', () => {
    const chunks = planChunks({
      segments: [
        { startMs: 0, endMs: 10_000 },
        { startMs: 12_000, endMs: 18_000 },
      ],
      durationMs: 20_000,
    });
    expect(chunks).toHaveLength(1);
  });

  test('planChunks merges overlapping segments', () => {
    const chunks = planChunks({
      segments: [
        { startMs: 0, endMs: 10_000 },
        { startMs: 9_000, endMs: 15_000 },
      ],
      durationMs: 20_000,
    });
    expect(chunks).toHaveLength(1);
    expect(chunks[0].renderEndMs).toBeGreaterThan(chunks[0].renderStartMs);
  });
});

describe('merge helpers', () => {
  // Merge helper tests moved to `src/stt/merge.test.js` to keep unit tests
  // focused and file-level responsibilities separate.
});
