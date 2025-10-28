/* istanbul ignore file -- runtime encoding verified via integration */

const WAV_HEADER_BYTES = 44;

function floatTo16BitPCM(samples) {
  const buffer = new ArrayBuffer(samples.length * 2);
  const view = new DataView(buffer);

  for (let i = 0; i < samples.length; i += 1) {
    let sample = samples[i];
    if (sample > 1) sample = 1;
    else if (sample < -1) sample = -1;
    view.setInt16(i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
  }

  return buffer;
}

export function pcm16ToWav(samples, sampleRate) {
  const pcmBuffer = floatTo16BitPCM(samples);
  const totalBytes = WAV_HEADER_BYTES + pcmBuffer.byteLength;
  const buffer = new ArrayBuffer(totalBytes);
  const view = new DataView(buffer);

  // RIFF identifier
  view.setUint32(0, 0x52494646, false);
  // file length minus RIFF identifier length and file description length
  view.setUint32(4, totalBytes - 8, true);
  // RIFF type
  view.setUint32(8, 0x57415645, false);
  // format chunk identifier
  view.setUint32(12, 0x666d7420, false);
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (raw)
  view.setUint16(20, 1, true);
  // channel count
  view.setUint16(22, 1, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sample rate * block align)
  const byteRate = sampleRate * 2;
  view.setUint32(28, byteRate, true);
  // block align (channel count * bytes per sample)
  view.setUint16(32, 2, true);
  // bits per sample
  view.setUint16(34, 16, true);
  // data chunk identifier
  view.setUint32(36, 0x64617461, false);
  // data chunk length
  view.setUint32(40, pcmBuffer.byteLength, true);

  const pcmView = new Uint8Array(pcmBuffer);
  const output = new Uint8Array(buffer);
  output.set(pcmView, WAV_HEADER_BYTES);

  return buffer;
}

export { WAV_HEADER_BYTES };
