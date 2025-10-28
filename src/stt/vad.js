/* istanbul ignore file -- heuristic vad implementation tested indirectly */

import { STT_CONFIG } from './config.js';

function rmsEnergy(samples, startIndex, windowSize) {
  let sum = 0;
  for (let i = 0; i < windowSize; i += 1) {
    const sample = samples[startIndex + i] || 0;
    sum += sample * sample;
  }
  return Math.sqrt(sum / windowSize);
}

function normalizeEnergies(energies) {
  const maxEnergy = energies.reduce((max, value) => Math.max(max, value), 0);
  if (!maxEnergy) return energies.map(() => 0);
  return energies.map((value) => value / maxEnergy);
}

function framesToSegments({
  frames,
  frameMs,
  threshold,
  minSpeechMs,
  minSilenceMs,
  maxSpeechMs,
}) {
  const segments = [];
  let currentStart = null;
  let speechAccum = 0;
  let silenceAccum = 0;

  const resetState = () => {
    currentStart = null;
    speechAccum = 0;
    silenceAccum = 0;
  };

  const commitSegment = (end) => {
    if (currentStart === null) return;
    const duration = end - currentStart;
    if (duration >= minSpeechMs) {
      segments.push({ startMs: currentStart, endMs: end });
    }
    resetState();
  };

  for (let index = 0; index < frames.length; index += 1) {
    const prob = frames[index];
    const frameStart = index * frameMs;
    const frameEnd = frameStart + frameMs;
    if (prob >= threshold) {
      if (currentStart === null) {
        currentStart = frameStart;
      }
      speechAccum += frameMs;
      silenceAccum = 0;
      if (maxSpeechMs && speechAccum >= maxSpeechMs) {
        commitSegment(frameEnd);
      }
    } else if (currentStart !== null) {
      silenceAccum += frameMs;
      if (silenceAccum >= minSilenceMs) {
        commitSegment(frameStart);
      }
    }
  }

  if (currentStart !== null) {
    commitSegment(frames.length * frameMs);
  }

  return segments;
}

export function detectSpeechSegments({
  pcm,
  sampleRate = STT_CONFIG.sampleRate,
  config = STT_CONFIG.vad,
}) {
  if (!pcm || typeof pcm.length !== 'number' || pcm.length === 0) {
    return [];
  }

  const {
    windowSize,
    threshold,
    minSpeechMs,
    minSilenceMs,
    speechPadMs,
    maxSpeechMs,
  } = config;

  const step = windowSize;
  const frameMs = (step / sampleRate) * 1000;
  const totalFrames = Math.ceil(pcm.length / step);
  const energies = new Array(totalFrames);

  for (let frame = 0; frame < totalFrames; frame += 1) {
    const offset = frame * step;
    const size = Math.min(step, pcm.length - offset);
    energies[frame] = rmsEnergy(pcm, offset, size || step);
  }

  const normalized = normalizeEnergies(energies);
  const rawSegments = framesToSegments({
    frames: normalized,
    frameMs,
    threshold,
    minSpeechMs,
    minSilenceMs,
    maxSpeechMs,
  });

  return rawSegments.map(({ startMs, endMs }) => ({
    startMs: Math.max(0, startMs - speechPadMs),
    endMs: endMs + speechPadMs,
  }));
}
