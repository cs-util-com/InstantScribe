const DEFAULT_BUFFER_SIZE = 16384;
const DEFAULT_AUDIO_BITRATE = 128000;
const DEFAULT_MP3_BITRATE = 64;
const DEFAULT_MIME_TYPE = 'audio/mpeg';

export function checkRecorderSupport() {
  if (typeof window === 'undefined') return false;
  const hasMediaRecorder = typeof window.MediaRecorder !== 'undefined';
  const hasSpeechRecognition = Boolean(
    window.SpeechRecognition || window.webkitSpeechRecognition
  );
  return hasMediaRecorder && hasSpeechRecognition;
}

/* istanbul ignore next */
export class Recorder {
  constructor({
    bufferSize = DEFAULT_BUFFER_SIZE,
    audioBitsPerSecond = DEFAULT_AUDIO_BITRATE,
  } = {}) {
    this.bufferSize = bufferSize;
    this.audioBitsPerSecond = audioBitsPerSecond;
    this.stream = null;
    this.mediaRecorder = null;
    this.stopPromise = null;
    this.audioChunks = [];
    this.mp3Data = [];
    this.audioContext = null;
    this.sourceNode = null;
    this.processorNode = null;
    this.encoder = null;
    this.audioBlob = null;
    this.mimeType = DEFAULT_MIME_TYPE;
    this.isRecording = false;
  }

  async start() {
    if (this.isRecording) return this.stream;
    if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
      throw new Error('Media devices API is not available in this environment');
    }

    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.isRecording = true;
    this.audioChunks = [];
    this.mp3Data = [];
    this.audioBlob = null;

    const supportsMP3 =
      typeof window !== 'undefined' &&
      window.MediaRecorder &&
      (window.MediaRecorder.isTypeSupported('audio/mpeg') ||
        window.MediaRecorder.isTypeSupported('audio/mp3'));

    if (supportsMP3) {
      this.setupMediaRecorder();
    } else {
      this.setupLameRecorder();
    }

    return this.stream;
  }

  setupMediaRecorder() {
    const mimeType = window.MediaRecorder.isTypeSupported('audio/mpeg')
      ? 'audio/mpeg'
      : window.MediaRecorder.isTypeSupported('audio/mp3')
        ? 'audio/mp3'
        : '';

    this.mimeType = mimeType || DEFAULT_MIME_TYPE;
    this.mediaRecorder = new window.MediaRecorder(this.stream, {
      mimeType: this.mimeType,
      audioBitsPerSecond: this.audioBitsPerSecond,
    });

    this.stopPromise = new Promise((resolve, reject) => {
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.audioBlob = new Blob(this.audioChunks, { type: this.mimeType });
        resolve(this.audioBlob);
      };

      this.mediaRecorder.onerror = (event) => {
        reject(event.error || new Error('MediaRecorder error'));
      };
    });

    this.mediaRecorder.start();
  }

  setupLameRecorder() {
    const AudioCtx =
      (typeof window !== 'undefined' &&
        (window.AudioContext || window.webkitAudioContext)) ||
      null;
    if (!AudioCtx) {
      throw new Error('Web Audio API is not available');
    }

    const lamejs = typeof window !== 'undefined' ? window.lamejs : null;
    if (!lamejs) {
      throw new Error('lamejs encoder is not loaded');
    }

    this.audioContext = new AudioCtx();
    this.sourceNode = this.audioContext.createMediaStreamSource(this.stream);
    this.processorNode = this.audioContext.createScriptProcessor(
      this.bufferSize,
      1,
      1
    );
    this.encoder = new lamejs.Mp3Encoder(
      1,
      this.audioContext.sampleRate,
      DEFAULT_MP3_BITRATE
    );

    this.processorNode.onaudioprocess = (event) => {
      if (!this.isRecording) return;
      const samples = event.inputBuffer.getChannelData(0);
      const sampleBuffer = new Int16Array(samples.length);
      for (let i = 0; i < samples.length; i += 1) {
        sampleBuffer[i] = Math.max(-32768, Math.min(32767, samples[i] * 32768));
      }
      const mp3buf = this.encoder.encodeBuffer(sampleBuffer);
      if (mp3buf.length > 0) {
        this.mp3Data.push(mp3buf);
      }
    };

    this.sourceNode.connect(this.processorNode);
    this.processorNode.connect(this.audioContext.destination);
    this.mimeType = DEFAULT_MIME_TYPE;
  }

  async stop() {
    if (!this.isRecording) return this.audioBlob;
    this.isRecording = false;

    let blob = null;
    if (this.mediaRecorder) {
      const stopPromise = this.stopPromise || Promise.resolve(null);
      this.mediaRecorder.stop();
      blob = await stopPromise;
      this.cleanupMediaRecorder();
    } else {
      blob = this.flushLameRecorder();
    }

    this.stopTracks();
    this.audioBlob = blob;
    return this.audioBlob;
  }

  flushLameRecorder() {
    if (this.encoder) {
      const mp3Final = this.encoder.flush();
      if (mp3Final && mp3Final.length > 0) {
        this.mp3Data.push(mp3Final);
      }
    }

    if (this.processorNode) {
      this.processorNode.disconnect();
      this.processorNode = null;
    }
    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    const blob = new Blob(this.mp3Data, { type: this.mimeType });
    this.mp3Data = [];
    return blob;
  }

  cleanupMediaRecorder() {
    if (this.mediaRecorder) {
      this.mediaRecorder.ondataavailable = null;
      this.mediaRecorder.onstop = null;
      this.mediaRecorder.onerror = null;
    }
    this.mediaRecorder = null;
    this.stopPromise = null;
  }

  stopTracks() {
    if (!this.stream) return;
    this.stream.getTracks().forEach((track) => track.stop());
    this.stream = null;
  }

  getAudioBlobSnapshot() {
    if (this.mediaRecorder && this.audioChunks.length > 0) {
      return new Blob(this.audioChunks, { type: this.mimeType });
    }
    if (this.mp3Data.length > 0) {
      return new Blob(this.mp3Data, { type: this.mimeType });
    }
    return null;
  }

  getAudioFileSnapshot(filename = 'audio.mp3') {
    const blob = this.getAudioBlobSnapshot();
    if (!blob) return null;
    return new File([blob], filename, { type: this.mimeType });
  }

  getAudioBlob() {
    return this.audioBlob;
  }
}

export function downloadBlob(blob, fileName) {
  if (!blob) return;
  if (typeof document === 'undefined') return;
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export function getDateTimePrefix(time) {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

export function htmlToPlainText(html) {
  if (typeof document === 'undefined') return html;
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  function traverse(node) {
    let text = '';
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        text += child.textContent;
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        if (['BR', 'DIV', 'P'].includes(child.tagName)) {
          text += '\n';
        }
        text += traverse(child);
      }
    });
    return text;
  }

  return traverse(tempDiv)
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
}

export function padZero(num) {
  return num < 10 ? `0${num}` : String(num);
}
