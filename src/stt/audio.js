/* istanbul ignore file -- depends on browser Web Audio APIs unavailable in Jest */

import { STT_CONFIG } from './config.js';

async function decodeWithContext(arrayBuffer) {
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextCtor) {
    throw new Error('AudioContext is unavailable in this environment');
  }
  const context = new AudioContextCtor();
  try {
    return await context.decodeAudioData(arrayBuffer.slice(0));
  } finally {
    if (typeof context.close === 'function') {
      context.close();
    }
  }
}

function mixToMono(buffer) {
  const { numberOfChannels, length } = buffer;
  if (numberOfChannels === 1) {
    return buffer.getChannelData(0);
  }
  const mixed = new Float32Array(length);
  for (let channel = 0; channel < numberOfChannels; channel += 1) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < length; i += 1) {
      mixed[i] += data[i] / numberOfChannels;
    }
  }
  return mixed;
}

async function resampleToTarget(samples, sourceRate, targetRate) {
  if (sourceRate === targetRate) {
    return samples;
  }

  const frameCount = Math.ceil((samples.length * targetRate) / sourceRate);
  const OfflineAudioContextCtor =
    window.OfflineAudioContext || window.webkitOfflineAudioContext;
  if (!OfflineAudioContextCtor) {
    throw new Error('OfflineAudioContext is unavailable in this environment');
  }

  const offlineContext = new OfflineAudioContextCtor(1, frameCount, targetRate);
  const buffer = offlineContext.createBuffer(1, samples.length, sourceRate);
  buffer.copyToChannel(samples, 0);
  const source = offlineContext.createBufferSource();
  source.buffer = buffer;
  source.connect(offlineContext.destination);
  source.start(0);
  const rendered = await offlineContext.startRendering();
  return rendered.getChannelData(0);
}

export async function decodeFileToMonoPcm({
  file,
  targetSampleRate = STT_CONFIG.sampleRate,
}) {
  if (!file) throw new Error('Audio file is required');
  const arrayBuffer = await file.arrayBuffer();
  const decoded = await decodeWithContext(arrayBuffer);
  const mono = mixToMono(decoded);
  const pcm = await resampleToTarget(
    mono,
    decoded.sampleRate,
    targetSampleRate
  );
  return {
    pcm,
    durationMs: (pcm.length / targetSampleRate) * 1000,
    sampleRate: targetSampleRate,
  };
}
