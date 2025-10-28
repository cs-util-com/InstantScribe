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
    ortPromise = import(
      'https://esm.sh/onnxruntime-web@1.18.0?target=es2020'
    ).then((module) => {
      const ort = module.default || module;
      if (ort?.env?.wasm) {
        if (typeof ort.env.wasm.wasmPaths === 'string') {
          ort.env.wasm.wasmPaths = DEFAULT_ORT_WASM_PATH;
        } else {
          ort.env.wasm.wasmPaths = DEFAULT_ORT_WASM_PATH;
        }
      }
      return ort;
    });
  }
  return ortPromise;
}

/* istanbul ignore next -- runtime depends on onnxruntime-web in browser */
async function ensureSession() {
  if (!sessionPromise) {
    const ort = await ensureOrt();
    sessionPromise = ort.InferenceSession.create(DEFAULT_SILERO_MODEL_URL);
  }
  return sessionPromise;
}

function createStateTensor(ort) {
  return new ort.Tensor('float32', new Float32Array(128), [1, 128]);
}

function createHiddenTensor(ort) {
  return new ort.Tensor('float32', new Float32Array(2 * 1 * 64), [2, 1, 64]);
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

/* istanbul ignore next -- requires onnx runtime in browser */
export async function detectSpeechSegments(pcm) {
  if (!pcm || pcm.length === 0) return [];
  if (typeof window === 'undefined') {
    throw new Error('VAD requires browser environment');
  }

  const ort = await ensureOrt();
  const session = await ensureSession();

  const probabilities = [];
  const windowSamples = STT_CONFIG.windowSamples;
  let hTensor = createHiddenTensor(ort);
  let cTensor = createHiddenTensor(ort);
  let stateTensor = createStateTensor(ort);
  const srTensor = createSrTensor(ort);

  for (let offset = 0; offset < pcm.length; offset += windowSamples) {
    const chunk = pcm.subarray(offset, offset + windowSamples);
    const inputTensor = createInputTensor(ort, chunk, windowSamples);

    const feeds = {
      input: inputTensor,
      h: hTensor,
      c: cTensor,
      sr: srTensor,
      state: stateTensor,
    };

    let results;
    try {
      results = await session.run(feeds);
    } catch (error) {
      console.warn(
        'Silero VAD inference failed, falling back to naive chunking',
        error
      );
      throw error;
    }

    const probability = extractSpeechProbability(results);
    probabilities.push(typeof probability === 'number' ? probability : 0);

    hTensor = results.h || hTensor;
    cTensor = results.c || cTensor;
    stateTensor = results.state || stateTensor;
  }

  return postProcessProbabilities(probabilities, pcm.length);
}

export function __resetVadForTesting() {
  ortPromise = null;
  sessionPromise = null;
}

export const __internal = {
  appendSegment,
  mergeSegments,
  postProcessProbabilities,
  readProbability,
  extractSpeechProbability,
};
