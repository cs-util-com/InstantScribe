/* istanbul ignore file -- browser audio pipeline is not exercised in Jest */

const TARGET_SAMPLE_RATE = 16000;

function defaultCreateAudioContext() {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  return new Ctor();
}

function defaultCreateOfflineAudioContext(channels, length, sampleRate) {
  if (typeof window === 'undefined') return null;
  const OfflineCtor =
    window.OfflineAudioContext || window.webkitOfflineAudioContext;
  if (!OfflineCtor) return null;
  return new OfflineCtor(channels, length, sampleRate);
}

async function decodeArrayBuffer(arrayBuffer, createAudioContext) {
  const audioContext = createAudioContext && createAudioContext();
  if (!audioContext || typeof audioContext.decodeAudioData !== 'function') {
    throw new Error('Web Audio API is not available for decoding');
  }

  const decoded = await audioContext.decodeAudioData(arrayBuffer.slice(0));
  if (typeof audioContext.close === 'function') {
    audioContext.close();
  }
  return decoded;
}

function mixToMono(decodedBuffer) {
  const { length, numberOfChannels } = decodedBuffer;
  if (numberOfChannels === 1) {
    return decodedBuffer.getChannelData(0).slice();
  }

  const mixed = new Float32Array(length);
  for (let channel = 0; channel < numberOfChannels; channel += 1) {
    const channelData = decodedBuffer.getChannelData(channel);
    for (let i = 0; i < length; i += 1) {
      mixed[i] += channelData[i] / numberOfChannels;
    }
  }
  return mixed;
}

function resampleLinear(input, sourceRate, targetRate) {
  if (sourceRate === targetRate) return input;

  const ratio = targetRate / sourceRate;
  const outputLength = Math.round(input.length * ratio);
  const output = new Float32Array(outputLength);

  for (let i = 0; i < outputLength; i += 1) {
    const position = i / ratio;
    const index = Math.floor(position);
    const fraction = position - index;
    const sampleA = input[index] || 0;
    const sampleB = input[index + 1] || sampleA;
    output[i] = sampleA + (sampleB - sampleA) * fraction;
  }

  return output;
}

async function renderWithOfflineContext(
  mono,
  sourceRate,
  createOfflineAudioContext
) {
  if (!createOfflineAudioContext) return null;
  const length = Math.ceil((mono.length / sourceRate) * TARGET_SAMPLE_RATE);
  const offline = createOfflineAudioContext(1, length, TARGET_SAMPLE_RATE);
  if (!offline || typeof offline.startRendering !== 'function') {
    return null;
  }

  const buffer = offline.createBuffer(1, mono.length, sourceRate);
  buffer.copyToChannel(mono, 0);
  const source = offline.createBufferSource();
  source.buffer = buffer;
  source.connect(offline.destination);
  source.start(0);
  const rendered = await offline.startRendering();
  return rendered.getChannelData(0).slice();
}

export async function decodeToMono16k(
  arrayBuffer,
  {
    createAudioContext = defaultCreateAudioContext,
    createOfflineAudioContext = defaultCreateOfflineAudioContext,
  } = {}
) {
  if (!(arrayBuffer instanceof ArrayBuffer)) {
    throw new TypeError('arrayBuffer must be an ArrayBuffer');
  }

  const decodedBuffer = await decodeArrayBuffer(
    arrayBuffer,
    createAudioContext
  );
  const mono = mixToMono(decodedBuffer);
  const rendered = await renderWithOfflineContext(
    mono,
    decodedBuffer.sampleRate,
    createOfflineAudioContext
  );
  if (rendered) return rendered;
  return resampleLinear(mono, decodedBuffer.sampleRate, TARGET_SAMPLE_RATE);
}

export { TARGET_SAMPLE_RATE };
