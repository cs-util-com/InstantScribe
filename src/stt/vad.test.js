import {
  __internal,
  __resetVadForTesting,
  __injectOrtForTesting,
  detectSpeechSegments,
} from './vad.js';
import { STT_CONFIG } from './config.js';

const {
  postProcessProbabilities,
  readProbability,
  extractSpeechProbability,
  appendSegment,
  mergeSegments,
} = __internal;

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

  test('appendSegment applies speechPadMs and clamps to duration', () => {
    const segments = [];
    const totalDurationMs = 10000;

    // A segment will be padded by speechPadMs on both sides and clamped
    appendSegment({ segments, startMs: 2000, endMs: 3000, totalDurationMs });
    expect(segments).toHaveLength(1);
    const seg = segments[0];
    // With speechPadMs=200 the start should be <= 2000 and >= 0
    expect(seg.startMs).toBeGreaterThanOrEqual(0);
    expect(seg.startMs).toBeLessThanOrEqual(2000);
    expect(seg.endMs).toBeGreaterThanOrEqual(3000);
    expect(seg.endMs).toBeLessThanOrEqual(totalDurationMs);
  });

  test('mergeSegments merges overlapping and close segments', () => {
    const a = { startMs: 0, endMs: 100 };
    const b = { startMs: 90, endMs: 200 };
    const c = { startMs: 500, endMs: 600 };
    const merged = mergeSegments([c, b, a]);
    // a and b should merge, c should remain separate
    expect(merged).toHaveLength(2);
    expect(merged[0].startMs).toBe(0);
    expect(merged[0].endMs).toBeGreaterThanOrEqual(200);
  });

  test('readProbability and extractSpeechProbability handle missing/unknown shapes', () => {
    expect(readProbability({})).toBeNull();
    expect(readProbability({ data: [] })).toBeNull();
    expect(extractSpeechProbability({})).toBe(0);
  });

  test('detectSpeechSegments works with injected fake ort/session', async () => {
    __resetVadForTesting();

    const fakeOrt = {
      Tensor: class FakeTensor {
        constructor(type, data) {
          this.data = data;
        }
      },
    };

    const fakeSession = {
      run: jest.fn(async (feeds) => {
        // return a probability in one of the known keys
        return { speech_prob: { data: [0.9] }, stateN: feeds.state };
      }),
    };

    __injectOrtForTesting(fakeOrt, fakeSession);

    // 1 second of audio at sampleRate -> should produce at least one probability
    const pcm = new Float32Array(STT_CONFIG.sampleRate);
    const segments = await detectSpeechSegments(pcm);
    expect(Array.isArray(segments)).toBe(true);
  });

  test('detectSpeechSegments accepts `state` output key', async () => {
    __resetVadForTesting();

    const fakeOrt = {
      Tensor: class FakeTensor {
        constructor(type, data) {
          this.data = data;
        }
      },
    };

    const fakeSession = {
      run: jest.fn(async (feeds) => {
        // model returns next-state under `state`
        return { speech_prob: { data: [0.8] }, state: feeds.state };
      }),
    };

    __injectOrtForTesting(fakeOrt, fakeSession);
    const pcm = new Float32Array(STT_CONFIG.sampleRate);
    const segments = await detectSpeechSegments(pcm);
    expect(Array.isArray(segments)).toBe(true);
  });

  test('detectSpeechSegments accepts `state_out` output key', async () => {
    __resetVadForTesting();

    const fakeOrt = {
      Tensor: class FakeTensor {
        constructor(type, data) {
          this.data = data;
        }
      },
    };

    const fakeSession = {
      run: jest.fn(async (feeds) => {
        // model returns next-state under `state_out`
        return { speech_prob: { data: [0.7] }, state_out: feeds.state };
      }),
    };

    __injectOrtForTesting(fakeOrt, fakeSession);
    const pcm = new Float32Array(STT_CONFIG.sampleRate);
    const segments = await detectSpeechSegments(pcm);
    expect(Array.isArray(segments)).toBe(true);
  });

  test('detectSpeechSegments surfaces session errors', async () => {
    __resetVadForTesting();
    const fakeOrt = { Tensor: class FakeTensor {} };
    const fakeSession = {
      run: jest.fn(async () => {
        throw new Error('session fail');
      }),
    };
    __injectOrtForTesting(fakeOrt, fakeSession);

    const pcm = new Float32Array(STT_CONFIG.sampleRate);
    await expect(detectSpeechSegments(pcm)).rejects.toThrow('session fail');
  });

  test('ensureSession failure branch when InferenceSession.create missing', async () => {
    __resetVadForTesting();
    // ort object lacks InferenceSession.create -> should trigger session creation failure
    const fakeOrt = { InferenceSession: {} };
    __injectOrtForTesting(fakeOrt); // do not provide session -> let ensureSession run

    const pcm = new Float32Array(STT_CONFIG.sampleRate);
    await expect(detectSpeechSegments(pcm)).rejects.toThrow(
      'ONNX InferenceSession not available'
    );
  });

  test('detectSpeechSegments returns empty for empty pcm', async () => {
    const result = await detectSpeechSegments(new Float32Array(0));
    expect(result).toEqual([]);
  });

  test('mergeSegments returns empty array when given no segments', () => {
    expect(mergeSegments([])).toEqual([]);
  });

  // NOTE: skipping a direct test for `typeof window === 'undefined'` because
  // the test environment provides a persistent `window` (jsdom). Other
  // runtime branches are covered below (session/run checks and fallback
  // state key matching).

  test('detectSpeechSegments throws when session has no run function', async () => {
    __resetVadForTesting();
    // Provide an ort with a proper InferenceSession.create that returns
    // an object lacking a run function to trigger the runtime check.
    const fakeOrt = {
      Tensor: class FakeTensor {},
      InferenceSession: { create: () => ({}) },
    };
    // Inject ort and a session object without `run`
    __injectOrtForTesting(fakeOrt, {});

    const pcm = new Float32Array(STT_CONFIG.sampleRate);
    await expect(detectSpeechSegments(pcm)).rejects.toThrow(
      /ONNX InferenceSession.run not available/
    );
  });

  test('detectSpeechSegments uses fallback state key when STATE_KEYS missing', async () => {
    __resetVadForTesting();
    const fakeOrt = {
      Tensor: class FakeTensor {
        constructor(type, data) {
          this.data = data;
        }
      },
    };

    const fakeSession = {
      run: jest.fn(async () => {
        // return a probability and a non-standard state key that still
        // matches /state/i so the fallback branch is exercised
        return { speech_prob: { data: [0.65] }, myStateValue: { data: [] } };
      }),
    };

    __injectOrtForTesting(fakeOrt, fakeSession);
    const pcm = new Float32Array(STT_CONFIG.sampleRate);
    const segments = await detectSpeechSegments(pcm);
    expect(Array.isArray(segments)).toBe(true);
  });
});
