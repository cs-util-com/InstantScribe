import { planChunks, buildFallbackChunks } from './chunking.js';
import { STT_CONFIG } from './config.js';
import { mergeChunkResults, buildPromptFromTail } from './merge.js';

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

  test('buildFallbackChunks respects size limits', () => {
    const originalBytes = STT_CONFIG.maxChunkBytes;
    STT_CONFIG.maxChunkBytes = 32_000; // ~1s of 16k PCM
    const fallback = buildFallbackChunks(120_000);
    expect(fallback.length).toBeGreaterThan(1);
    fallback.forEach((chunk) => {
      expect(chunk.renderEndMs).toBeGreaterThan(chunk.renderStartMs);
    });
    STT_CONFIG.maxChunkBytes = originalBytes;
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
  test('buildPromptFromTail trims tail characters', () => {
    const prompt = buildPromptFromTail('  Example transcript text  ');
    expect(prompt.endsWith('text')).toBe(true);
  });

  test('mergeChunkResults removes duplicate sentences', () => {
    const merged = mergeChunkResults([
      { index: 0, text: 'Hello world. This is chunk one.' },
      { index: 1, text: 'This is chunk one. And here is more.' },
    ]);
    expect(merged).toContain('Hello world.');
    expect(merged).toContain('And here is more.');
    expect(merged).not.toContain('This is chunk one.\nThis is chunk one.');
  });
});
