const mockDecodeToMono16k = jest.fn();
const mockSupportsAudioProcessing = jest.fn(() => true);
const mockPcmSliceToWav = jest.fn(
  () => new Blob(['data'], { type: 'audio/wav' })
);
const mockDetectSpeechSegments = jest.fn();

jest.mock('./audio.js', () => ({
  decodeToMono16k: (...args) => mockDecodeToMono16k(...args),
  supportsAudioProcessing: (...args) => mockSupportsAudioProcessing(...args),
  pcmSliceToWav: (...args) => mockPcmSliceToWav(...args),
}));

jest.mock('./vad.js', () => ({
  detectSpeechSegments: (...args) => mockDetectSpeechSegments(...args),
}));

jest.mock('../openai.js', () => ({
  transcribeFile: jest.fn(),
}));

import {
  supportsChunkedTranscription,
  createPromptTracker,
  transcribeWithVad,
  __TESTING__,
} from './chunked-transcriber.js';
import { transcribeFile } from '../openai.js';
import { STT_SAMPLE_RATE } from './constants.js';

describe('chunked transcriber helpers', () => {
  const originalBlob = window.Blob;
  const originalFile = window.File;
  const originalAudioContext = window.AudioContext;
  const originalOfflineAudioContext = window.OfflineAudioContext;

  afterEach(() => {
    window.Blob = originalBlob;
    window.File = originalFile;
    window.AudioContext = originalAudioContext;
    window.OfflineAudioContext = originalOfflineAudioContext;
    mockDecodeToMono16k.mockReset();
    mockDetectSpeechSegments.mockReset();
    mockPcmSliceToWav.mockReset();
    mockSupportsAudioProcessing.mockReset();
    transcribeFile.mockReset();
  });

  test('supportsChunkedTranscription returns false when File missing', () => {
    mockSupportsAudioProcessing.mockReturnValue(true);
    window.Blob = function MockBlob() {};
    window.File = undefined;
    window.AudioContext = function MockAudio() {};
    window.OfflineAudioContext = function MockOffline() {};
    expect(supportsChunkedTranscription()).toBe(false);
  });

  test('supportsChunkedTranscription returns true when APIs exist', () => {
    mockSupportsAudioProcessing.mockReturnValue(true);
    window.Blob = function MockBlob() {};
    window.File = function MockFile() {};
    window.AudioContext = function MockAudio() {};
    window.OfflineAudioContext = function MockOffline() {};
    expect(supportsChunkedTranscription()).toBe(true);
  });

  test('createPromptTracker merges overlapping text', () => {
    const tracker = createPromptTracker();
    tracker.append('Hello world.');
    tracker.append('world. Again.');
    expect(tracker.value).toBe('Hello world. Again.');
    expect(tracker.source().length).toBeGreaterThan(0);
  });

  test('runWithConcurrency preserves task ordering', async () => {
    const values = [];
    const tasks = [
      () => Promise.resolve(values.push('a')),
      () => Promise.resolve(values.push('b')),
      () => Promise.resolve(values.push('c')),
    ];
    const results = await __TESTING__.runWithConcurrency(tasks, 2);
    expect(results).toEqual([1, 2, 3]);
    expect(values).toEqual(['a', 'b', 'c']);
  });

  test('transcribeWithVad merges chunk transcripts', async () => {
    mockSupportsAudioProcessing.mockReturnValue(true);
    window.Blob = function MockBlob() {};
    window.File = function MockFile() {};
    window.AudioContext = function MockAudio() {};
    window.OfflineAudioContext = function MockOffline() {};

    const pcm = new Float32Array(STT_SAMPLE_RATE * 7);
    mockDecodeToMono16k.mockResolvedValue({ pcm, durationMs: 7000 });
    mockDetectSpeechSegments.mockResolvedValue([
      { startMs: 0, endMs: 1000 },
      { startMs: 5000, endMs: 6000 },
    ]);
    transcribeFile
      .mockResolvedValueOnce('Hello world.')
      .mockResolvedValue('World continues.');

    const onChunkComplete = jest.fn();
    const file = new File(['input'], 'audio.wav', { type: 'audio/wav' });
    const result = await transcribeWithVad(
      { file, language: 'en' },
      { maxChunkSec: 0.3, onChunkComplete }
    );

    expect(mockDecodeToMono16k).toHaveBeenCalled();
    expect(mockDetectSpeechSegments).toHaveBeenCalled();
    const callCount = transcribeFile.mock.calls.length;
    expect(callCount).toBeGreaterThan(1);
    expect(onChunkComplete).toHaveBeenCalledTimes(callCount);
    expect(result).toContain('Hello world.');
    expect(result).toContain('World continues.');
  });

  test('transcribeWithVad falls back when no VAD segments', async () => {
    mockSupportsAudioProcessing.mockReturnValue(true);

    const pcm = new Float32Array(0);
    mockDecodeToMono16k.mockResolvedValue({ pcm, durationMs: 0 });
    mockDetectSpeechSegments.mockResolvedValue([]);
    transcribeFile.mockResolvedValue('Single chunk');

    const file = new File(['input'], 'audio.wav', { type: 'audio/wav' });
    const result = await transcribeWithVad({ file, language: 'en' });

    expect(transcribeFile).toHaveBeenCalledWith({ file, language: 'en' });
    expect(mockPcmSliceToWav).not.toHaveBeenCalled();
    expect(result).toBe('Single chunk');
  });
});
