/* istanbul ignore file -- browser audio utilities exercise Web Audio APIs */
import { STT_SAMPLE_RATE } from './constants.js';

function getAudioContextCtor() {
  if (typeof window === 'undefined') return null;
  return window.AudioContext || window.webkitAudioContext || null;
}

function getOfflineAudioContextCtor() {
  if (typeof window === 'undefined') return null;
  return window.OfflineAudioContext || window.webkitOfflineAudioContext || null;
}

export function supportsAudioProcessing() {
  return Boolean(getAudioContextCtor() && getOfflineAudioContextCtor());
}

/* istanbul ignore next -- requires Web Audio API environment */
export async function decodeToMono16k(blobOrFile) {
  const arrayBuffer = await ensureArrayBuffer(blobOrFile);
  const AudioContextCtor = getAudioContextCtor();
  if (!AudioContextCtor) {
    throw new Error('AudioContext is not available');
  }
  const context = new AudioContextCtor();
  let decoded;
  try {
    decoded = await context.decodeAudioData(arrayBuffer.slice(0));
  } finally {
    if (typeof context.close === 'function') {
      await context.close();
    }
  }

  const mono = mixToMono(decoded);
  const rendered = await resampleBuffer(
    mono,
    decoded.sampleRate,
    STT_SAMPLE_RATE
  );
  return {
    pcm: rendered.getChannelData(0),
    sampleRate: rendered.sampleRate,
    durationMs: (rendered.length / rendered.sampleRate) * 1000,
  };
}

async function ensureArrayBuffer(blobOrFile) {
  if (!blobOrFile) throw new Error('Audio blob is required');
  if (blobOrFile.arrayBuffer) {
    return blobOrFile.arrayBuffer();
  }
  if (blobOrFile.buffer) {
    const buffer = blobOrFile.buffer;
    if (buffer instanceof ArrayBuffer) return buffer;
  }
  throw new Error('Unsupported audio input');
}

/* istanbul ignore next -- requires Web Audio API environment */
function mixToMono(decoded) {
  const channels = decoded.numberOfChannels;
  if (channels === 1) return decoded;

  const OfflineAudioContextCtor = getOfflineAudioContextCtor();
  if (!OfflineAudioContextCtor) {
    throw new Error('OfflineAudioContext is not available for mixing');
  }

  const offlineCtx = new OfflineAudioContextCtor(
    1,
    decoded.length,
    decoded.sampleRate
  );
  const buffer = offlineCtx.createBuffer(1, decoded.length, decoded.sampleRate);
  const output = buffer.getChannelData(0);

  for (let channel = 0; channel < channels; channel += 1) {
    const data = decoded.getChannelData(channel);
    for (let i = 0; i < decoded.length; i += 1) {
      output[i] += data[i] / channels;
    }
  }

  const source = offlineCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(offlineCtx.destination);
  source.start(0);
  return offlineCtx.startRendering();
}

/* istanbul ignore next -- requires Web Audio API environment */
async function resampleBuffer(bufferPromise, fromRate, targetRate) {
  const buffer = await bufferPromise;
  if (fromRate === targetRate) {
    return buffer;
  }
  const OfflineAudioContextCtor = getOfflineAudioContextCtor();
  if (!OfflineAudioContextCtor) {
    throw new Error('OfflineAudioContext is not available for resampling');
  }

  const duration = buffer.length / fromRate;
  const length = Math.ceil(duration * targetRate);
  const offlineCtx = new OfflineAudioContextCtor(1, length, targetRate);
  const resampleBuffer = offlineCtx.createBuffer(1, buffer.length, fromRate);
  resampleBuffer.copyToChannel(buffer.getChannelData(0), 0);
  const source = offlineCtx.createBufferSource();
  source.buffer = resampleBuffer;
  source.connect(offlineCtx.destination);
  source.start(0);
  return offlineCtx.startRendering();
}

export function pcmSliceToWav(
  pcm,
  startMs,
  endMs,
  sampleRate = STT_SAMPLE_RATE
) {
  if (!pcm || typeof pcm.length !== 'number') {
    throw new Error('PCM data is required');
  }
  const startSample = Math.max(0, Math.floor((startMs / 1000) * sampleRate));
  const endSample = Math.min(
    pcm.length,
    Math.ceil((endMs / 1000) * sampleRate)
  );
  const sliceLength = Math.max(0, endSample - startSample);

  const int16Buffer = new Int16Array(sliceLength);
  for (let i = 0; i < sliceLength; i += 1) {
    const sample = Math.max(-1, Math.min(1, pcm[startSample + i] || 0));
    int16Buffer[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
  }

  const wavBuffer = new ArrayBuffer(44 + int16Buffer.length * 2);
  const view = new DataView(wavBuffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + int16Buffer.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, int16Buffer.length * 2, true);

  const wavData = new DataView(wavBuffer, 44);
  for (let i = 0; i < int16Buffer.length; i += 1) {
    wavData.setInt16(i * 2, int16Buffer[i], true);
  }

  return new Blob([wavBuffer], { type: 'audio/wav' });
}

function writeString(view, offset, value) {
  for (let i = 0; i < value.length; i += 1) {
    view.setUint8(offset + i, value.charCodeAt(i));
  }
}
