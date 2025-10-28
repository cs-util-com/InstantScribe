import { supportsAudioProcessing, pcmSliceToWav } from './audio.js';
import { STT_SAMPLE_RATE } from './constants.js';

describe('audio utilities', () => {
  const originalAudioContext = window.AudioContext;
  const originalWebkitAudioContext = window.webkitAudioContext;
  const originalOfflineAudioContext = window.OfflineAudioContext;
  const originalWebkitOfflineAudioContext = window.webkitOfflineAudioContext;

  afterEach(() => {
    window.AudioContext = originalAudioContext;
    window.webkitAudioContext = originalWebkitAudioContext;
    window.OfflineAudioContext = originalOfflineAudioContext;
    window.webkitOfflineAudioContext = originalWebkitOfflineAudioContext;
  });

  test('supportsAudioProcessing returns false when contexts missing', () => {
    window.AudioContext = undefined;
    window.webkitAudioContext = undefined;
    window.OfflineAudioContext = undefined;
    window.webkitOfflineAudioContext = undefined;
    expect(supportsAudioProcessing()).toBe(false);
  });

  test('pcmSliceToWav converts PCM to wav blob', async () => {
    const pcm = new Float32Array(STT_SAMPLE_RATE);
    pcm[0] = 0.5;
    pcm[1] = -0.5;
    const durationMs = (pcm.length / STT_SAMPLE_RATE) * 1000;
    const blob = pcmSliceToWav(pcm, 0, durationMs, STT_SAMPLE_RATE);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('audio/wav');
    expect(blob.size).toBeGreaterThan(44);
  });
});
