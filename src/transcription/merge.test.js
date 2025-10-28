import { mergeChunkTranscripts, computeOverlapLength } from './merge.js';

describe('transcription merging', () => {
  test('computeOverlapLength detects shared prefix/suffix', () => {
    const overlap = computeOverlapLength(
      'Hello world today',
      'World today we meet'
    );
    expect(overlap).toBeGreaterThan(5);
  });

  test('mergeChunkTranscripts merges ordered chunks', () => {
    const merged = mergeChunkTranscripts([
      { startMs: 0, endMs: 1000, text: 'Hello world' },
      { startMs: 900, endMs: 2000, text: 'world today we meet' },
      { startMs: 2100, endMs: 3000, text: 'Next segment' },
    ]);

    expect(merged).toContain('Hello world today we meet');
    expect(merged).toContain('Next segment');
    expect(merged.match(/world/g).length).toBe(1);
  });

  test('mergeChunkTranscripts handles empty inputs', () => {
    expect(mergeChunkTranscripts([])).toBe('');
    expect(mergeChunkTranscripts([{ text: '', startMs: 0, endMs: 1 }])).toBe(
      ''
    );
  });
});
