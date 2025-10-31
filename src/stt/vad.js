import {
  DEFAULT_ORT_WASM_PATH,
  DEFAULT_SILERO_MODEL_URL,
  STT_CONFIG,
} from './config.js';
import { samplesToMs } from './audio.js';

let ortPromise = null;
let sessionPromise = null;

/* istanbul ignore next -- runtime depends on onnxruntime-web in browser */
function ensureOrt() {
  if (!ortPromise) {
    // Prefer the vendored local ESM build under /ort to avoid external
    // CDN dependencies and cross-origin complications. Use a dynamic
    // import so the module is only loaded at runtime (preserves tests
    // and server-side evaluation safety).
    ortPromise = (async () => {
      try {
        const localUrl = '/ort/ort.wasm.min.mjs';
        const module = await import(localUrl);
        const ort = module?.default || module;
        if (!ort) throw new Error('empty module');

        // basic sanity: must expose InferenceSession.create
        if (
          !ort.InferenceSession ||
          typeof ort.InferenceSession.create !== 'function'
        ) {
          throw new Error(
            'incomplete ort module (missing InferenceSession.create)'
          );
        }

        // configure WASM loader (single-threaded to avoid COOP/COEP)
        if (ort?.env?.wasm) {
          ort.env.wasm.numThreads = 1;
          ort.env.wasm.wasmPaths = DEFAULT_ORT_WASM_PATH;
        }

        try {
          console.info('Loaded ONNX Runtime Web from', localUrl);
          console.log('ORT object keys:', Object.keys(ort));
          console.log('InferenceSession:', ort.InferenceSession);
          console.log('create function:', typeof ort.InferenceSession?.create);
        } catch {
          /* ignore */
        }

        return ort;
      } catch (err) {
        console.warn(
          'Failed to load ONNX Runtime Web from local /ort path',
          err
        );
        throw new Error('ONNX Runtime Web not available');
      }
    })();
  }
  return ortPromise;
}

async function ensureSession() {
  if (!sessionPromise) {
    try {
      const ort = await ensureOrt();
      if (
        !ort.InferenceSession ||
        typeof ort.InferenceSession.create !== 'function'
      ) {
        throw new Error(
          'InferenceSession.create not available in ONNX Runtime Web module'
        );
      }
      console.log('VAD: Creating session with URL:', DEFAULT_SILERO_MODEL_URL);
      sessionPromise = ort.InferenceSession.create(DEFAULT_SILERO_MODEL_URL);
    } catch (error) {
      console.warn('VAD: Session creation failed with error:', error);
      console.warn(
        'Failed to create ONNX InferenceSession, VAD will not be available',
        error
      );
      throw new Error('ONNX InferenceSession not available');
    }
  }
  return sessionPromise;
}

function createStateTensor(ort) {
  return new ort.Tensor('float32', new Float32Array(256), [2, 1, 128]);
}

function createInputTensor(ort, chunk, windowSamples) {
  const buffer = new Float32Array(windowSamples);
  buffer.set(chunk);
  return new ort.Tensor('float32', buffer, [1, windowSamples]);
}

function createSrTensor(ort) {
  const rate = BigInt(STT_CONFIG.sampleRate);
  const srArray = new BigInt64Array([rate]);
  return new ort.Tensor('int64', srArray, [1]);
}

function appendSegment({ segments, startMs, endMs, totalDurationMs }) {
  const start = Math.max(0, startMs - STT_CONFIG.speechPadMs);
  const end = Math.min(endMs + STT_CONFIG.speechPadMs, totalDurationMs);
  if (end - start >= STT_CONFIG.minSpeechMs) {
    segments.push({ startMs: start, endMs: end });
  }
}

function mergeSegments(segments) {
  if (!segments.length) return segments;
  segments.sort((a, b) => a.startMs - b.startMs);
  const merged = [segments[0]];

  for (let i = 1; i < segments.length; i += 1) {
    const prev = merged[merged.length - 1];
    const current = segments[i];
    if (current.startMs <= prev.endMs + STT_CONFIG.minSilenceMs) {
      prev.endMs = Math.max(prev.endMs, current.endMs);
    } else {
      merged.push(current);
    }
  }

  return merged;
}

function postProcessProbabilities(probabilities, totalSamples) {
  const windowMs = samplesToMs(STT_CONFIG.windowSamples);
  const totalDurationMs = samplesToMs(totalSamples);
  const segments = [];

  let speechStart = null;
  let lastSpeechMs = 0;
  let silenceMs = 0;

  const finalizeSpeech = () => {
    if (speechStart === null) return;
    appendSegment({
      segments,
      startMs: speechStart,
      endMs: lastSpeechMs,
      totalDurationMs,
    });
    speechStart = null;
    silenceMs = 0;
  };

  for (let i = 0; i < probabilities.length; i += 1) {
    const prob = probabilities[i];
    const frameStart = i * windowMs;
    const frameEnd = frameStart + windowMs;

    if (prob >= STT_CONFIG.threshold) {
      speechStart = speechStart ?? frameStart;
      lastSpeechMs = frameEnd;
      silenceMs = 0;

      if (lastSpeechMs - speechStart >= STT_CONFIG.maxSpeechMs) {
        finalizeSpeech();
      }
      continue;
    }

    if (speechStart === null) continue;

    silenceMs += windowMs;
    if (silenceMs >= STT_CONFIG.minSilenceMs) {
      finalizeSpeech();
    }
  }

  finalizeSpeech();
  return mergeSegments(segments);
}

const PROBABILITY_KEYS = ['output', 'prob', 'probs', 'output.1', 'speech_prob'];

function readProbability(value) {
  if (value == null) return null;
  if (typeof value === 'number') return value;

  const arrayLike = Array.isArray(value) ? value : value?.data;
  if (arrayLike && typeof arrayLike[0] === 'number') {
    return arrayLike[0];
  }

  return null;
}

function extractSpeechProbability(results) {
  for (const key of PROBABILITY_KEYS) {
    const probability = readProbability(results[key]);
    if (probability !== null && typeof probability === 'number') {
      return probability;
    }
  }
  return 0;
}

export async function detectSpeechSegments(pcm) {
  if (!pcm || pcm.length === 0) return [];
  if (typeof window === 'undefined') {
    throw new Error('VAD requires browser environment');
  }

  console.log('VAD: Starting ORT setup');
  const ort = await ensureOrt();
  console.log('VAD: ORT loaded successfully');

  console.log('VAD: Creating session');
  const session = await ensureSession();
  console.log('VAD: Session created successfully');

  if (!session || typeof session.run !== 'function') {
    throw new Error(
      `ONNX InferenceSession.run not available (type=${typeof (session && session.run)})`
    );
  }

  const probabilities = [];
  const windowSamples = STT_CONFIG.windowSamples;
  let stateTensor = createStateTensor(ort);
  const srTensor = createSrTensor(ort);

  console.log('VAD: Starting inference loop');
  for (let offset = 0; offset < pcm.length; offset += windowSamples) {
    const chunk = pcm.subarray(offset, offset + windowSamples);
    const inputTensor = createInputTensor(ort, chunk, windowSamples);

    const feeds = {
      input: inputTensor,
      state: stateTensor,
      sr: srTensor,
    };

    if (offset % (windowSamples * 4000) === 0) {
      console.log('VAD: Running inference for chunk at offset', offset);
    }
    let results;
    try {
      results = await session.run(feeds);
      if (offset % (windowSamples * 4000) === 0) {
        console.log(
          'VAD: Inference successful, results keys:',
          Object.keys(results)
        );
      }
    } catch (error) {
      console.warn('VAD: Inference failed with error:', error);
      console.warn(
        'Silero VAD inference failed, falling back to naive chunking',
        error
      );
      throw error;
    }

    const probability = extractSpeechProbability(results);
    probabilities.push(typeof probability === 'number' ? probability : 0);

    stateTensor = results.stateN || stateTensor;
  }

  console.log('VAD: Inference loop completed');
  return postProcessProbabilities(probabilities, pcm.length);
}

export function __resetVadForTesting() {
  ortPromise = null;
  sessionPromise = null;
}

/* istanbul ignore next -- test helper to inject fake ort/session in Node tests */
export function __injectOrtForTesting(fakeOrt, fakeSession) {
  ortPromise = Promise.resolve(fakeOrt);
  // If fakeSession is omitted, leave sessionPromise null so ensureSession
  // still runs its creation logic (useful for testing failure branches).
  sessionPromise =
    typeof fakeSession === 'undefined' ? null : Promise.resolve(fakeSession);
}

export const __internal = {
  appendSegment,
  mergeSegments,
  postProcessProbabilities,
  readProbability,
  extractSpeechProbability,
};
