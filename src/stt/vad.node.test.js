/**
 * @jest-environment node
 */
import { detectSpeechSegments } from './vad.js';
import { STT_CONFIG } from './config.js';

test('detectSpeechSegments throws in Node environment (no window)', async () => {
  // non-empty PCM to avoid early-return
  const pcm = new Float32Array(STT_CONFIG.sampleRate);
  await expect(detectSpeechSegments(pcm)).rejects.toThrow(
    'VAD requires browser environment'
  );
});
