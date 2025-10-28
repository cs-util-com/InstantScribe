import { STT_CONFIG } from './config.js';

/* istanbul ignore next -- depends on browser-specific audio globals */
function hasWebAudio() {
  return (
    typeof window !== 'undefined' &&
    (window.AudioContext || window.webkitAudioContext) &&
    window.OfflineAudioContext
  );
}

/* istanbul ignore next -- depends on browser-specific audio globals */
function getAudioContext() {
  const Ctor = window.AudioContext || window.webkitAudioContext;
  return new Ctor();
}

/* istanbul ignore next -- exercised via decodeToMono16k in browser */
function mixToMono(audioBuffer) {
  const { numberOfChannels } = audioBuffer;
  if (numberOfChannels === 1) {
    return audioBuffer.getChannelData(0).slice();
  }

  const length = audioBuffer.length;
  const output = new Float32Array(length);

  for (let channel = 0; channel < numberOfChannels; channel += 1) {
    const data = audioBuffer.getChannelData(channel);
    for (let i = 0; i < length; i += 1) {
      output[i] += data[i] / numberOfChannels;
    }
  }

  return output;
}

/* istanbul ignore next -- exercised via decodeToMono16k in browser */
async function resampleMonoBuffer(mono, sourceRate, targetRate) {
  if (sourceRate === targetRate) {
    return mono;
  }

  const length = Math.ceil((mono.length * targetRate) / sourceRate);
  const offline = new OfflineAudioContext(1, length, targetRate);
  const buffer = offline.createBuffer(1, mono.length, sourceRate);
  buffer.copyToChannel(mono, 0);

  const source = offline.createBufferSource();
  source.buffer = buffer;
  source.connect(offline.destination);
  source.start(0);

  const rendered = await offline.startRendering();
  return rendered.getChannelData(0).slice();
}

/* istanbul ignore next -- browser-only decode path */
export async function decodeToMono16k(file) {
  if (!hasWebAudio()) {
    throw new Error('Web Audio API not available');
  }

  const arrayBuffer = await file.arrayBuffer();
  const ctx = getAudioContext();

  try {
    const decoded = await ctx.decodeAudioData(arrayBuffer);
    const mono = mixToMono(decoded);
    const resampled = await resampleMonoBuffer(
      mono,
      decoded.sampleRate,
      STT_CONFIG.sampleRate
    );

    return {
      pcm: resampled,
      sampleRate: STT_CONFIG.sampleRate,
      durationMs: Math.round((resampled.length / STT_CONFIG.sampleRate) * 1000),
    };
  } finally {
    ctx.close?.();
  }
}

export function clampMs(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function estimateChunkBytes(durationMs) {
  const seconds = durationMs / 1000;
  const bytesPerSecond = STT_CONFIG.sampleRate * STT_CONFIG.wavBytesPerSample;
  return Math.ceil(seconds * bytesPerSecond) + 44; // WAV header overhead
}

function floatTo16BitPCM(float32Array) {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);

  for (let i = 0; i < float32Array.length; i += 1) {
    let sample = Math.max(-1, Math.min(1, float32Array[i]));
    sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
    view.setInt16(i * 2, sample, true);
  }

  return new Uint8Array(buffer);
}

function writeWavHeader(dataLength) {
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);
  const byteRate = STT_CONFIG.sampleRate * STT_CONFIG.wavBytesPerSample;
  const blockAlign = STT_CONFIG.wavBytesPerSample;

  view.setUint32(0, 0x52494646, false); // 'RIFF'
  view.setUint32(4, 36 + dataLength, true);
  view.setUint32(8, 0x57415645, false); // 'WAVE'
  view.setUint32(12, 0x666d7420, false); // 'fmt '
  view.setUint32(16, 16, true); // Subchunk1Size
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, STT_CONFIG.sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); // bits per sample
  view.setUint32(36, 0x64617461, false); // 'data'
  view.setUint32(40, dataLength, true);

  return new Uint8Array(buffer);
}

export function encodeWavChunk(pcm, startMs, endMs) {
  const totalSamples = pcm.length;
  const sampleRate = STT_CONFIG.sampleRate;
  const startIndex = Math.max(0, Math.floor((startMs / 1000) * sampleRate));
  const endIndex = Math.min(
    totalSamples,
    Math.ceil((endMs / 1000) * sampleRate)
  );

  if (endIndex <= startIndex) {
    return null;
  }

  const slice = pcm.slice(startIndex, endIndex);
  const pcm16 = floatTo16BitPCM(slice);
  const header = writeWavHeader(pcm16.length);
  const blob = new Blob([header, pcm16], { type: 'audio/wav' });
  return {
    blob,
    durationMs: Math.round(((endIndex - startIndex) / sampleRate) * 1000),
  };
}

export function samplesToMs(samples) {
  return Math.round((samples / STT_CONFIG.sampleRate) * 1000);
}

export function msToSamples(ms) {
  return Math.round((ms / 1000) * STT_CONFIG.sampleRate);
}
