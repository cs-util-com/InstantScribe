/* istanbul ignore file -- WebAssembly execution not testable in Jest */

import { TARGET_SAMPLE_RATE } from '../audio/decode.js';

const DEFAULT_MODEL_PATH = '/models/silero_v5_16k.onnx';
const DEFAULT_WASM_PATH = '/ort/';
const STATE_SHAPE = [2, 1, 64];

export const DEFAULT_VAD_CONFIG = {
  sampleRate: TARGET_SAMPLE_RATE,
  windowSize: 512,
  threshold: 0.5,
  minSpeechMs: 250,
  minSilenceMs: 100,
  speechPadMs: 200,
  maxSpeechSec: 15 * 60,
  energyThreshold: 0.015,
  modelPath: DEFAULT_MODEL_PATH,
  wasmPaths: DEFAULT_WASM_PATH,
};

let cachedSessionPromise = null;

function resolveOrtModule(customOrt) {
  if (customOrt) return customOrt;
  if (typeof window === 'undefined') {
    throw new Error('onnxruntime-web requires a browser-like environment');
  }
  return import('https://esm.sh/onnxruntime-web@1.20.0?target=es2020');
}

async function createSileroSession(config, customOrt) {
  if (cachedSessionPromise) return cachedSessionPromise;

  cachedSessionPromise = (async () => {
    const ortModule = await resolveOrtModule(customOrt);
    const ort = ortModule.default ? ortModule.default : ortModule;

    if (!ort?.InferenceSession) {
      throw new Error('onnxruntime-web InferenceSession not available');
    }

    if (config.wasmPaths) {
      ort.env.wasm.wasmPaths = config.wasmPaths;
    }

    const session = await ort.InferenceSession.create(config.modelPath, {
      executionProviders: ['wasm'],
    });

    return { session, ort };
  })();

  return cachedSessionPromise;
}

function frameDurationMs({ windowSize, sampleRate }) {
  return (windowSize / sampleRate) * 1000;
}

function createStateTensor(ort, data) {
  return new ort.Tensor('float32', data, STATE_SHAPE);
}

function createSampleRateTensor(ort, sampleRate) {
  const tensorData = new BigInt64Array([BigInt(sampleRate)]);
  return new ort.Tensor('int64', tensorData, [1]);
}

function extractProbability(outputs) {
  const data = outputs.output?.data || outputs.prob?.data;
  if (!data) {
    throw new Error('Unexpected Silero VAD output format');
  }
  return data[0];
}

function resolveState(nextData, currentState) {
  return nextData ? nextData.slice() : currentState;
}

async function evaluateSileroFrame(ortState, config, srTensor, frame, states) {
  const inputs = {
    input: new ortState.ort.Tensor('float32', frame, [1, config.windowSize]),
    h: createStateTensor(ortState.ort, states.hState),
    c: createStateTensor(ortState.ort, states.cState),
    sr: srTensor,
  };

  const outputs = await ortState.session.run(inputs);

  return {
    probability: extractProbability(outputs),
    hState: resolveState(outputs.hn?.data || outputs.h?.data, states.hState),
    cState: resolveState(outputs.cn?.data || outputs.c?.data, states.cState),
  };
}

async function runSileroInference(pcmData, config, ortState) {
  const { session, ort } = ortState;
  const totalFrames = Math.ceil(pcmData.length / config.windowSize);
  const probabilities = new Array(totalFrames);

  const stateSize = STATE_SHAPE.reduce((acc, value) => acc * value, 1);
  let states = {
    hState: new Float32Array(stateSize),
    cState: new Float32Array(stateSize),
  };
  const srTensor = createSampleRateTensor(ort, config.sampleRate);

  for (let frameIndex = 0; frameIndex < totalFrames; frameIndex += 1) {
    const start = frameIndex * config.windowSize;
    const end = Math.min(start + config.windowSize, pcmData.length);
    const frame = new Float32Array(config.windowSize);
    frame.set(pcmData.subarray(start, end));

    const result = await evaluateSileroFrame(
      { session, ort },
      config,
      srTensor,
      frame,
      states
    );

    probabilities[frameIndex] = result.probability;
    states = { hState: result.hState, cState: result.cState };
  }

  return probabilities;
}

function addSegment(
  segments,
  segment,
  minSpeechFrames,
  frameEnd,
  totalDurationMs
) {
  if (!segment || segment.frames < minSpeechFrames) return;
  segments.push({
    startMs: segment.startMs,
    endMs: Math.min(frameEnd, totalDurationMs),
  });
}

function padSegments(segments, padMs, totalDurationMs) {
  return segments
    .map((segment) => ({
      startMs: Math.max(segment.startMs - padMs, 0),
      endMs: Math.min(segment.endMs + padMs, totalDurationMs),
    }))
    .sort((a, b) => a.startMs - b.startMs);
}

function mergeSegments(segments, minSilenceMs) {
  const merged = [];
  for (const segment of segments) {
    const last = merged[merged.length - 1];
    if (!last) {
      merged.push({ ...segment });
    } else if (segment.startMs <= last.endMs + minSilenceMs) {
      last.endMs = Math.max(last.endMs, segment.endMs);
    } else {
      merged.push({ ...segment });
    }
  }
  return merged;
}

function enforceMaxSpeechDuration(segments, maxSpeechSec) {
  const maxSpeechMs = (maxSpeechSec || 0) * 1000;
  if (!maxSpeechMs) return segments;

  const bounded = [];
  for (const segment of segments) {
    if (segment.endMs - segment.startMs <= maxSpeechMs) {
      bounded.push(segment);
      continue;
    }
    let start = segment.startMs;
    while (start < segment.endMs) {
      const end = Math.min(start + maxSpeechMs, segment.endMs);
      bounded.push({ startMs: start, endMs: end });
      start = end;
    }
  }
  return bounded;
}

function collectSegments(probabilities, config, totalDurationMs) {
  const segments = [];
  const frameMs = frameDurationMs(config);
  const minSpeechFrames = Math.max(1, Math.ceil(config.minSpeechMs / frameMs));
  const minSilenceFrames = Math.max(
    1,
    Math.ceil(config.minSilenceMs / frameMs)
  );

  let activeSegment = null;
  let silenceFrames = 0;

  probabilities.forEach((probability = 0, index) => {
    const frameStart = index * frameMs;
    const frameEnd = frameStart + frameMs;

    if (probability >= config.threshold) {
      if (!activeSegment) {
        activeSegment = { startMs: frameStart, endMs: frameEnd, frames: 1 };
      } else {
        activeSegment.endMs = frameEnd;
        activeSegment.frames += 1;
      }
      silenceFrames = 0;
      return;
    }

    if (!activeSegment) return;

    silenceFrames += 1;
    if (silenceFrames >= minSilenceFrames) {
      addSegment(
        segments,
        activeSegment,
        minSpeechFrames,
        frameEnd,
        totalDurationMs
      );
      activeSegment = null;
      silenceFrames = 0;
    } else {
      activeSegment.endMs = frameEnd;
    }
  });

  if (activeSegment) {
    addSegment(
      segments,
      activeSegment,
      minSpeechFrames,
      activeSegment.endMs,
      totalDurationMs
    );
  }

  if (segments.length === 0) return [];

  const padded = padSegments(segments, config.speechPadMs, totalDurationMs);
  const merged = mergeSegments(padded, config.minSilenceMs);
  return enforceMaxSpeechDuration(merged, config.maxSpeechSec);
}

function energyBasedProbabilities(pcmData, config) {
  const { windowSize, energyThreshold } = config;
  const probabilities = new Array(Math.ceil(pcmData.length / windowSize));

  for (let frameIndex = 0; frameIndex < probabilities.length; frameIndex += 1) {
    const start = frameIndex * windowSize;
    const end = Math.min(start + windowSize, pcmData.length);
    let energy = 0;
    for (let i = start; i < end; i += 1) {
      const value = pcmData[i];
      energy += value * value;
    }
    energy /= windowSize;
    const rms = Math.sqrt(energy);
    const probability = rms / (rms + energyThreshold);
    probabilities[frameIndex] = probability;
  }

  return probabilities;
}

export async function computeSpeechSegments(pcmData, options = {}) {
  const config = { ...DEFAULT_VAD_CONFIG, ...options };
  const totalDurationMs = (pcmData.length / config.sampleRate) * 1000;

  if (!pcmData || pcmData.length === 0) {
    return [];
  }

  try {
    const sessionState = await createSileroSession(config, options.ort);
    const probabilities = await runSileroInference(
      pcmData,
      config,
      sessionState
    );
    return collectSegments(probabilities, config, totalDurationMs);
  } catch (error) {
    console.warn(
      'Silero VAD unavailable, falling back to energy-based detection',
      error
    );
    const probabilities = energyBasedProbabilities(pcmData, config);
    return collectSegments(probabilities, config, totalDurationMs);
  }
}

export function __resetSileroCache() {
  cachedSessionPromise = null;
}
