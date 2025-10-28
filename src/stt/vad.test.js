jest.mock(
  'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.19.0/dist/ort.esm.min.js',
  () => {
    class FakeTensor {
      constructor(type, data, dims) {
        this.type = type;
        this.data = data;
        this.dims = dims;
      }
    }

    class FakeSession {
      async run(feeds) {
        this.calls = (this.calls || 0) + 1;
        const prob = this.calls % 2 === 0 ? 0.2 : 0.9;
        return {
          output: { data: new Float32Array([prob]) },
          h: feeds.h,
          c: feeds.c,
        };
      }
    }

    return {
      __esModule: true,
      env: { wasm: {} },
      Tensor: FakeTensor,
      InferenceSession: {
        async create() {
          return new FakeSession();
        },
      },
    };
  },
  { virtual: true }
);

import {
  detectSpeechSegments,
  resetVadSessionForTesting,
  __TESTING__,
} from './vad.js';
import { STT_SAMPLE_RATE } from './constants.js';

describe('vad helpers', () => {
  afterEach(() => {
    resetVadSessionForTesting();
  });

  test('resolveVadConfig normalizes options', () => {
    const config = __TESTING__.resolveVadConfig({ windowSize: 999 });
    expect(config.windowSamples).toBe(512);
    expect(config.sampleRate).toBe(STT_SAMPLE_RATE);
  });

  test('energyBasedSegments detects high-energy region', () => {
    const pcm = new Float32Array(STT_SAMPLE_RATE);
    for (let i = 2000; i < 8000; i += 1) {
      pcm[i] = 0.7;
    }
    const config = {
      sampleRate: STT_SAMPLE_RATE,
      windowSamples: 512,
      threshold: 0.5,
      minSpeechMs: 200,
      minSilenceMs: 100,
      maxSegmentSec: 60,
    };
    const segments = __TESTING__.energyBasedSegments(pcm, config);
    expect(segments.length).toBeGreaterThan(0);
  });

  test('detectSpeechSegments uses Silero when available', async () => {
    const pcm = new Float32Array(2048);
    const segments = await detectSpeechSegments(pcm, {
      sampleRate: STT_SAMPLE_RATE,
      windowSize: 512,
      minSpeechMs: 100,
      minSilenceMs: 50,
      maxSegmentSec: 1,
    });
    expect(Array.isArray(segments)).toBe(true);
  });
});
