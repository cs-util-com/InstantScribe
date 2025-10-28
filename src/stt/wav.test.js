import { encodeWav } from './wav.js';

function readHeader(view, offset, length) {
  let text = '';
  for (let i = 0; i < length; i += 1) {
    text += String.fromCharCode(view.getUint8(offset + i));
  }
  return text;
}

describe('encodeWav', () => {
  test('encodes pcm into wav blob or array', () => {
    const pcm = new Float32Array([0, 0.5, -0.5, 1, -1]);
    const result = encodeWav({ pcm, sampleRate: 16000 });
    const bufferPromise = (() => {
      if (result && typeof result.arrayBuffer === 'function') {
        return result.arrayBuffer();
      }
      if (result instanceof Blob) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsArrayBuffer(result);
        });
      }
      return Promise.resolve(result.buffer);
    })();

    return bufferPromise.then((arrayBuffer) => {
      const view = new DataView(arrayBuffer);
      expect(readHeader(view, 0, 4)).toBe('RIFF');
      expect(readHeader(view, 8, 4)).toBe('WAVE');
      expect(view.getUint32(24, true)).toBe(16000);
      expect(view.getUint16(34, true)).toBe(16);
    });
  });
});
