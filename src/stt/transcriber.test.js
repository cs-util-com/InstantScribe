import { chunkedTranscription } from './transcriber.js';
import { STT_CONFIG } from './config.js';
import { decodeToMono16k, encodeWavChunk } from './audio.js';
import { detectSpeechSegments } from './vad.js';
import { planChunks, buildFallbackChunks } from './chunking.js';
import { transcribeFile } from '../openai.js';

jest.mock('./audio.js', () => ({
  decodeToMono16k: jest.fn(),
  encodeWavChunk: jest.fn(),
}));

jest.mock('./vad.js', () => ({
  detectSpeechSegments: jest.fn(),
}));

jest.mock('./chunking.js', () => ({
  planChunks: jest.fn(),
  buildFallbackChunks: jest.fn(),
}));

jest.mock('../openai.js', () => ({
  transcribeFile: jest.fn(),
}));

describe('chunkedTranscription', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('splits audio into chunks and preserves prompts', async () => {
    const pcm = new Float32Array(32_000);
    decodeToMono16k.mockResolvedValue({ pcm, durationMs: 2000 });
    detectSpeechSegments.mockResolvedValue([{ startMs: 0, endMs: 1500 }]);
    planChunks.mockReturnValue([
      { index: 0, renderStartMs: 0, renderEndMs: 1200 },
      { index: 1, renderStartMs: 1000, renderEndMs: 2000 },
    ]);
    encodeWavChunk.mockImplementation((buffer, startMs, endMs) => ({
      blob: new Blob([`${startMs}-${endMs}`]),
      durationMs: endMs - startMs,
    }));
    transcribeFile
      .mockResolvedValueOnce('First chunk content.')
      .mockResolvedValueOnce('Continuation second chunk.');

    const file = new File([new Uint8Array(10)], 'example.wav', {
      type: 'audio/wav',
    });

    const result = await chunkedTranscription({ file, language: 'en' });

    expect(planChunks).toHaveBeenCalled();
    expect(encodeWavChunk).toHaveBeenCalledTimes(2);
    expect(transcribeFile).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ prompt: '' })
    );
    expect(transcribeFile).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ prompt: 'First chunk content.' })
    );
    expect(result).toContain('First chunk content.');
    expect(result).toContain('Continuation second chunk.');
  });

  test('falls back to chunking when VAD fails', async () => {
    const pcm = new Float32Array(16_000);
    decodeToMono16k.mockResolvedValue({ pcm, durationMs: 1000 });
    detectSpeechSegments.mockRejectedValue(new Error('vad failure'));
    buildFallbackChunks.mockReturnValue([
      { index: 0, renderStartMs: 0, renderEndMs: 1000 },
    ]);
    encodeWavChunk.mockReturnValue({
      blob: new Blob(['fallback']),
      durationMs: 1000,
    });
    transcribeFile.mockResolvedValue('Recovered text');

    const file = new File([new Uint8Array(10)], 'fallback.wav', {
      type: 'audio/wav',
    });

    const result = await chunkedTranscription({ file, language: 'en' });

    expect(buildFallbackChunks).toHaveBeenCalled();
    expect(transcribeFile).toHaveBeenCalledWith(
      expect.objectContaining({ prompt: '' })
    );
    expect(result).toBe('Recovered text');
  });

  test('falls back to byte chunking when decode fails', async () => {
    decodeToMono16k.mockRejectedValue(new Error('decode error'));
    const originalSize = STT_CONFIG.maxChunkBytes / 2;
    const file = new File([new Uint8Array(originalSize)], 'large.bin', {
      type: 'application/octet-stream',
    });
    transcribeFile.mockResolvedValue('Single chunk text');

    const result = await chunkedTranscription({ file, language: 'en' });

    expect(transcribeFile).toHaveBeenCalledTimes(1);
    expect(result).toBe('Single chunk text');
  });

  test('byte chunking splits very large files', async () => {
    decodeToMono16k.mockRejectedValue(new Error('decode error'));
    const size = STT_CONFIG.maxChunkBytes * 1.5;
    const file = new File([new Uint8Array(size)], 'massive.bin', {
      type: 'application/octet-stream',
    });
    transcribeFile
      .mockResolvedValueOnce('Part A')
      .mockResolvedValueOnce('Part B');

    const result = await chunkedTranscription({ file, language: 'en' });

    expect(transcribeFile).toHaveBeenCalledTimes(2);
    expect(result).toContain('Part A');
    expect(result).toContain('Part B');
  });

  test('skips chunks that fail to encode', async () => {
    const pcm = new Float32Array(32_000);
    decodeToMono16k.mockResolvedValue({ pcm, durationMs: 2000 });
    detectSpeechSegments.mockResolvedValue([{ startMs: 0, endMs: 1500 }]);
    planChunks.mockReturnValue([
      { index: 0, renderStartMs: 0, renderEndMs: 1200 },
      { index: 1, renderStartMs: 1000, renderEndMs: 2000 },
    ]);
    encodeWavChunk.mockReturnValueOnce(null).mockReturnValueOnce({
      blob: new Blob(['valid']),
      durationMs: 800,
    });
    transcribeFile.mockResolvedValue('Only valid chunk');

    const file = new File([new Uint8Array(10)], 'example.wav', {
      type: 'audio/wav',
    });

    const result = await chunkedTranscription({ file, language: 'en' });

    expect(transcribeFile).toHaveBeenCalledTimes(1);
    expect(result).toBe('Only valid chunk');
  });

  test('throws when no chunks can be encoded', async () => {
    const pcm = new Float32Array(16_000);
    decodeToMono16k.mockResolvedValue({ pcm, durationMs: 1000 });
    detectSpeechSegments.mockResolvedValue([{ startMs: 0, endMs: 800 }]);
    planChunks.mockReturnValue([
      { index: 0, renderStartMs: 0, renderEndMs: 900 },
    ]);
    encodeWavChunk.mockReturnValue(null);

    const file = new File([new Uint8Array(10)], 'broken.wav', {
      type: 'audio/wav',
    });

    await expect(
      chunkedTranscription({ file, language: 'en' })
    ).rejects.toThrow('Failed to prepare audio chunks for transcription');
  });
});
