export const STT_CONFIG = {
  sampleRate: 16000,
  windowSamples: 512,
  threshold: 0.5,
  minSpeechMs: 250,
  minSilenceMs: 100,
  speechPadMs: 200,
  maxSpeechMs: 15 * 60 * 1000,
  chunkOverlapMs: 500,
  maxChunkMs: 1200 * 1000,
  maxChunkBytes: 24 * 1024 * 1024,
  uploadConcurrency: 3,
  wavBytesPerSample: 2,
  promptTailChars: 200,
};

export const DEFAULT_SILERO_MODEL_URL =
  typeof window !== 'undefined' && window.SILERO_VAD_MODEL
    ? window.SILERO_VAD_MODEL
    : '/models/silero_v5_16k.onnx';

export const DEFAULT_ORT_WASM_PATH =
  typeof window !== 'undefined' && window.ORT_WASM_PATH
    ? window.ORT_WASM_PATH
    : '/ort/';
