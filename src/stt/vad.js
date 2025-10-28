/* istanbul ignore file -- browser VAD integration relies on complex runtime primitives */
import {
  STT_SAMPLE_RATE,
  STT_VAD_THRESHOLD,
  STT_VAD_MIN_SPEECH_MS,
  STT_VAD_MIN_SILENCE_MS,
  STT_VAD_MAX_SEGMENT_SEC,
} from './constants.js';

const DEFAULT_MODEL_URL = '/models/silero_v5_16k.onnx';
const DEFAULT_WASM_PATH = '/ort/';
const SUPPORTED_WINDOW_SIZES = [512, 1024, 1536];

let ortModulePromise = null;
let sessionPromise = null;

function getWindowSize(windowSize) {
  if (SUPPORTED_WINDOW_SIZES.includes(windowSize)) return windowSize;
  return SUPPORTED_WINDOW_SIZES[0];
}

export function resetVadSessionForTesting() {
  ortModulePromise = null;
  sessionPromise = null;
}

export async function detectSpeechSegments(pcm, options = {}) {
  const config = resolveVadConfig(options);
  const session = await loadSessionSafe(config);
  if (session) {
    const result = await runVadSafely(session, pcm, config);
    if (result) return result;
  }
  return energyBasedSegments(pcm, config);
}

function resolveVadConfig({
  sampleRate = STT_SAMPLE_RATE,
  modelUrl = DEFAULT_MODEL_URL,
  wasmPath = DEFAULT_WASM_PATH,
  windowSize = SUPPORTED_WINDOW_SIZES[0],
  threshold = STT_VAD_THRESHOLD,
  minSpeechMs = STT_VAD_MIN_SPEECH_MS,
  minSilenceMs = STT_VAD_MIN_SILENCE_MS,
  maxSegmentSec = STT_VAD_MAX_SEGMENT_SEC,
} = {}) {
  return {
    sampleRate,
    modelUrl,
    wasmPath,
    windowSamples: getWindowSize(windowSize),
    threshold,
    minSpeechMs,
    minSilenceMs,
    maxSegmentSec,
  };
}

async function loadSessionSafe(config) {
  try {
    return await loadSession({
      modelUrl: config.modelUrl,
      wasmPath: config.wasmPath,
    });
  } catch (error) {
    console.warn('Unable to initialize Silero VAD session', error);
    return null;
  }
}

async function runVadSafely(session, pcm, config) {
  try {
    return await runSileroVad(session, pcm, config);
  } catch (error) {
    console.warn('Silero VAD inference failed, using fallback', error);
    return null;
  }
}

async function loadSession({ modelUrl, wasmPath }) {
  if (!sessionPromise) {
    const ort = await loadOrtModule(wasmPath);
    sessionPromise = ort.InferenceSession.create(modelUrl);
  }
  return sessionPromise;
}

async function loadOrtModule(wasmPath) {
  if (!ortModulePromise) {
    ortModulePromise = import(
      'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.19.0/dist/ort.esm.min.js'
    ).then((ort) => {
      if (wasmPath) {
        ort.env.wasm.wasmPaths = wasmPath;
      }
      return ort;
    });
  }
  return ortModulePromise;
}

async function runSileroVad(session, pcm, config) {
  if (!pcm || pcm.length === 0) return [];
  const ort = await loadOrtModule();
  const srTensor = createSampleRateTensor(ort, config.sampleRate);
  const hiddenState = createHiddenStateTensor(ort);
  let h = hiddenState();
  let c = hiddenState();

  const segments = [];
  const frameMs = (config.windowSamples / config.sampleRate) * 1000;
  const state = createVadState(config);

  for (let offset = 0; offset < pcm.length; offset += config.windowSamples) {
    const frame = new Float32Array(config.windowSamples);
    frame.set(pcm.subarray(offset, offset + config.windowSamples));

    const feeds = buildFeeds(ort, frame, h, c, srTensor, config.windowSamples);
    const results = await session.run(feeds);
    const probability = extractProbability(results);
    h = extractHiddenState(results, ['h', 'hn', 'output_h']) || h;
    c = extractHiddenState(results, ['c', 'cn', 'output_c']) || c;

    const currentTimeMs = (offset / config.sampleRate) * 1000;
    const currentEndMs = currentTimeMs + frameMs;
    processVadFrame({
      state,
      probability,
      startMs: currentTimeMs,
      endMs: currentEndMs,
      segments,
    });
  }

  finalizeVadSegments(state, segments);
  return segments;
}

function buildFeeds(ort, frame, h, c, srTensor, windowSamples) {
  const input = new ort.Tensor('float32', frame, [1, windowSamples]);
  const feeds = { input, sr: srTensor, h, c };
  if (!feeds.c) delete feeds.c;
  if (!feeds.h) delete feeds.h;
  return feeds;
}

function createHiddenStateTensor(ort) {
  const shape = [2, 1, 64];
  const size = shape.reduce((acc, value) => acc * value, 1);
  return () => new ort.Tensor('float32', new Float32Array(size), shape);
}

function createSampleRateTensor(ort, sampleRate) {
  if (typeof BigInt64Array !== 'undefined') {
    return new ort.Tensor('int64', new BigInt64Array([BigInt(sampleRate)]));
  }
  return new ort.Tensor('int32', new Int32Array([sampleRate]));
}

function extractProbability(results) {
  const candidates = ['output', 'probabilities', 'output0', 'modelOutput'];
  for (const key of candidates) {
    const tensor = results[key];
    if (tensor && tensor.data && tensor.data.length > 0) {
      return tensor.data[0];
    }
  }
  const fallback = Object.values(results).find(
    (tensor) => tensor && tensor.data && tensor.data.length === 1
  );
  return fallback ? fallback.data[0] : 0;
}

function extractHiddenState(results, keys) {
  for (const key of keys) {
    if (results[key]) return results[key];
  }
  return null;
}

function energyBasedSegments(pcm, config) {
  if (!pcm || pcm.length === 0) return [];
  const segments = [];
  const frameMs = (config.windowSamples / config.sampleRate) * 1000;
  const energyThreshold = config.threshold * 0.5;
  const state = createVadState({
    threshold: 0.5,
    minSpeechMs: config.minSpeechMs,
    minSilenceMs: config.minSilenceMs,
    maxSegmentSec: config.maxSegmentSec,
  });

  for (let offset = 0; offset < pcm.length; offset += config.windowSamples) {
    const frame = pcm.subarray(offset, offset + config.windowSamples);
    let energy = 0;
    for (let i = 0; i < frame.length; i += 1) {
      const sample = frame[i];
      energy += sample * sample;
    }
    energy /= frame.length || 1;

    const currentTimeMs = (offset / config.sampleRate) * 1000;
    const currentEndMs = currentTimeMs + frameMs;
    const probability = energy >= energyThreshold ? 1 : 0;
    processVadFrame({
      state,
      probability,
      startMs: currentTimeMs,
      endMs: currentEndMs,
      segments,
    });
  }

  finalizeVadSegments(state, segments);
  return segments;
}

function createVadState({
  threshold,
  minSpeechMs,
  minSilenceMs,
  maxSegmentSec,
}) {
  return {
    threshold,
    minSpeechMs,
    minSilenceMs,
    maxSegmentMs: maxSegmentSec * 1000,
    active: false,
    segmentStart: 0,
    lastSpeechMs: -Infinity,
  };
}

function processVadFrame({ state, probability, startMs, endMs, segments }) {
  if (probability >= state.threshold) {
    if (!state.active) {
      state.active = true;
      state.segmentStart = startMs;
    }
    state.lastSpeechMs = endMs;
    if (state.lastSpeechMs - state.segmentStart >= state.maxSegmentMs) {
      segments.push({ startMs: state.segmentStart, endMs: state.lastSpeechMs });
      state.active = false;
    }
    return;
  }

  if (!state.active) return;
  if (startMs - state.lastSpeechMs < state.minSilenceMs) return;
  if (state.lastSpeechMs - state.segmentStart >= state.minSpeechMs) {
    segments.push({ startMs: state.segmentStart, endMs: state.lastSpeechMs });
  }
  state.active = false;
}

function finalizeVadSegments(state, segments) {
  if (!state.active) return;
  if (state.lastSpeechMs - state.segmentStart >= state.minSpeechMs) {
    segments.push({ startMs: state.segmentStart, endMs: state.lastSpeechMs });
  }
}

export const __TESTING__ = {
  energyBasedSegments,
  createVadState,
  processVadFrame,
  finalizeVadSegments,
  resolveVadConfig,
};
