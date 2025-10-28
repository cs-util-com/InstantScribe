import { mergeTranscriptions } from './merge.js';

describe('mergeTranscriptions', () => {
  test('joins non-empty chunks with spacing', () => {
    const result = mergeTranscriptions(['Hello world', 'this is a test']);
    expect(result).toBe('Hello world this is a test');
  });

  test('deduplicates overlapping segments', () => {
    const result = mergeTranscriptions([
      'Hello world. This is',
      'This is a follow up sentence.',
    ]);
    expect(result).toBe('Hello world. This is a follow up sentence.');
  });

  test('ignores empty chunks', () => {
    const result = mergeTranscriptions(['', '   ', 'Hello']);
    expect(result).toBe('Hello');
  });
});
