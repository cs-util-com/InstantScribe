import { detectSpeechSegments } from './vad.js';
import { STT_CONFIG } from './config.js';

describe('detectSpeechSegments', () => {
  test('returns empty array for silence', () => {
    const pcm = new Float32Array(STT_CONFIG.sampleRate * 2);
    const segments = detectSpeechSegments({
      pcm,
      sampleRate: STT_CONFIG.sampleRate,
    });
    expect(segments).toEqual([]);
  });

  test('detects a loud region as speech', () => {
    const pcm = new Float32Array(STT_CONFIG.sampleRate * 2);
    for (
      let i = STT_CONFIG.sampleRate * 0.5;
      i < STT_CONFIG.sampleRate * 1.5;
      i += 1
    ) {
      pcm[i] = Math.sin((i / STT_CONFIG.sampleRate) * Math.PI * 4) * 0.8;
    }
    const segments = detectSpeechSegments({
      pcm,
      sampleRate: STT_CONFIG.sampleRate,
    });
    expect(segments.length).toBeGreaterThan(0);
  });
});
