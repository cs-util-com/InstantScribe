import {
  clampMs,
  encodeWavChunk,
  estimateChunkBytes,
  msToSamples,
  samplesToMs,
} from './audio.js';

describe('audio helpers', () => {
  test('estimateChunkBytes uses pcm byte rate', () => {
    const estimate = estimateChunkBytes(1000);
    expect(estimate).toBeGreaterThan(32000);
  });

  test('encodeWavChunk converts float32 pcm to wav blob', () => {
    const pcm = new Float32Array(16_000);
    for (let i = 0; i < pcm.length; i += 1) {
      pcm[i] = Math.sin((i / pcm.length) * Math.PI * 2);
    }
    const result = encodeWavChunk(pcm, 0, 1000);
    expect(result).not.toBeNull();
    expect(result.durationMs).toBeGreaterThanOrEqual(900);
    expect(result.blob.type).toBe('audio/wav');
    expect(result.blob.size).toBeGreaterThan(0);
  });

  test('clampMs enforces bounds', () => {
    expect(clampMs(50, 100, 200)).toBe(100);
    expect(clampMs(250, 100, 200)).toBe(200);
    expect(clampMs(150, 100, 200)).toBe(150);
  });

  test('sample conversions are consistent', () => {
    const samples = msToSamples(1000);
    const ms = samplesToMs(samples);
    expect(ms).toBeCloseTo(1000, 0);
  });
});
