import { __internal } from './vad.js';
import { STT_CONFIG } from './config.js';

const { postProcessProbabilities, readProbability, extractSpeechProbability } =
  __internal;

describe('vad helpers', () => {
  test('readProbability handles different inputs', () => {
    expect(readProbability(0.5)).toBe(0.5);
    expect(readProbability([0.7])).toBe(0.7);
    expect(readProbability({ data: [0.2] })).toBe(0.2);
    expect(readProbability({ data: new Float32Array([0.3]) })).toBeCloseTo(0.3);
    expect(readProbability(null)).toBeNull();
  });

  test('extractSpeechProbability picks first available key', () => {
    const results = {
      output: null,
      prob: null,
      probs: null,
      'output.1': { data: [0.6] },
      speech_prob: { data: [0.1] },
    };
    expect(extractSpeechProbability(results)).toBe(0.6);
  });

  test('postProcessProbabilities merges short gaps', () => {
    const probabilities = new Array(20).fill(0);
    for (let i = 1; i <= 3; i += 1) probabilities[i] = 0.9;
    for (let i = 5; i <= 7; i += 1) probabilities[i] = 0.85;
    const totalSamples = STT_CONFIG.sampleRate * 2; // 2 seconds of audio
    const segments = postProcessProbabilities(probabilities, totalSamples);
    expect(segments).toHaveLength(1);
    const [segment] = segments;
    expect(segment.startMs).toBeGreaterThanOrEqual(0);
    expect(segment.endMs).toBeGreaterThan(segment.startMs);
  });

  test('postProcessProbabilities respects max speech length', () => {
    const originalMaxSpeech = STT_CONFIG.maxSpeechMs;
    const originalMinSilence = STT_CONFIG.minSilenceMs;
    STT_CONFIG.maxSpeechMs = 100;
    STT_CONFIG.minSilenceMs = 50;
    const probabilities = [
      ...new Array(10).fill(0.95),
      ...new Array(4).fill(0),
      ...new Array(10).fill(0.95),
    ];
    const totalSamples = STT_CONFIG.sampleRate * 3;
    const segments = postProcessProbabilities(probabilities, totalSamples);
    expect(segments.length).toBeGreaterThan(0);
    STT_CONFIG.maxSpeechMs = originalMaxSpeech;
    STT_CONFIG.minSilenceMs = originalMinSilence;
  });
});
