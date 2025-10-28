/* istanbul ignore file -- configuration module */

export const STT_CONFIG = {
  sampleRate: 16000,
  bytesPerSample: 2,
  maxChunkDurationSec: 1200,
  maxChunkBytes: 24 * 1024 * 1024,
  overlapMs: 500,
  padMs: 200,
  minChunkDurationSec: 15,
  fallbackChunkDurationSec: 18 * 60,
  concurrency: 3,
  vad: {
    windowSize: 512,
    threshold: 0.5,
    minSpeechMs: 250,
    minSilenceMs: 100,
    speechPadMs: 200,
    maxSpeechMs: 15 * 60 * 1000,
  },
};

export function resolveMaxChunkDurationBySize({
  sampleRate = STT_CONFIG.sampleRate,
  bytesPerSample = STT_CONFIG.bytesPerSample,
  maxChunkBytes = STT_CONFIG.maxChunkBytes,
}) {
  const headerBytes = 44;
  const usableBytes = Math.max(maxChunkBytes - headerBytes, 0);
  if (usableBytes === 0) return 0;
  const seconds = usableBytes / (sampleRate * bytesPerSample);
  return seconds;
}
