import { STT_CONFIG } from './config.js';
import { buildTimeChunks } from './timeChunker.js';

describe('buildTimeChunks', () => {
  test('creates chunks that cover the entire duration', () => {
    const durationMs = 60 * 1000;
    const chunks = buildTimeChunks({ durationMs, config: STT_CONFIG });
    expect(chunks.length).toBeGreaterThan(0);
    const last = chunks[chunks.length - 1];
    expect(last.endMs).toBeGreaterThanOrEqual(durationMs);
    expect(chunks[0].startMs).toBe(0);
  });

  test('returns empty array for invalid duration', () => {
    expect(buildTimeChunks({ durationMs: 0, config: STT_CONFIG })).toEqual([]);
  });
});
