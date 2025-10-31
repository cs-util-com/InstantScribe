import { mergeChunkResults, buildPromptFromTail } from './merge.js';

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
