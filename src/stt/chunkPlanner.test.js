import { STT_CONFIG } from './config.js';
import {
  planSpeechChunks,
  slicePcm,
  normalizeSpeechSegments,
} from './chunkPlanner.js';

function secondsToMs(value) {
  return value * 1000;
}

describe('planSpeechChunks', () => {
  const config = {
    ...STT_CONFIG,
    maxChunkDurationSec: 10,
    maxChunkBytes: 44 + STT_CONFIG.sampleRate * STT_CONFIG.bytesPerSample * 10,
    padMs: 200,
    overlapMs: 500,
  };

  test('splits segments when exceeding duration', () => {
    const segments = [
      { startMs: secondsToMs(0), endMs: secondsToMs(6) },
      { startMs: secondsToMs(6.5), endMs: secondsToMs(13) },
    ];

    const chunks = planSpeechChunks({
      segments,
      audioDurationMs: secondsToMs(20),
      config,
    });

    expect(chunks).toHaveLength(2);
    expect(chunks[0].startMs).toBeGreaterThanOrEqual(0);
    expect(chunks[0].endMs).toBeGreaterThan(chunks[0].startMs);
    expect(chunks[1].startMs).toBeLessThanOrEqual(secondsToMs(13));
  });

  test('ensures overlap padding is applied', () => {
    const segments = [
      { startMs: secondsToMs(0), endMs: secondsToMs(3) },
      { startMs: secondsToMs(4), endMs: secondsToMs(7) },
      { startMs: secondsToMs(9), endMs: secondsToMs(12) },
    ];

    const chunks = planSpeechChunks({
      segments,
      audioDurationMs: secondsToMs(15),
      config,
    });

    expect(chunks[0].startMs).toBe(0);
    expect(chunks[0].endMs).toBeLessThanOrEqual(secondsToMs(15));
    expect(chunks[1].startMs).toBeLessThanOrEqual(chunks[0].endMs);
  });

  test('slicePcm respects ms boundaries', () => {
    const durationSec = 5;
    const sampleRate = STT_CONFIG.sampleRate;
    const samples = new Float32Array(sampleRate * durationSec);
    for (let i = 0; i < samples.length; i += 1) {
      samples[i] = i / samples.length;
    }

    const slice = slicePcm({
      pcm: samples,
      startMs: 1000,
      endMs: 3000,
      sampleRate,
    });

    expect(slice.length).toBeGreaterThan(0);
    expect(slice.length).toBeLessThan(samples.length);
  });

  test('normalizeSpeechSegments merges nearby regions and trims short ones', () => {
    const raw = [
      { startMs: 0, endMs: 50 },
      { startMs: 120, endMs: 400 },
      { startMs: 430, endMs: 600 },
    ];
    const normalized = normalizeSpeechSegments({
      segments: raw,
      durationMs: secondsToMs(2),
      padMs: 50,
      minSpeechMs: 100,
      minSilenceMs: 80,
      maxSpeechMs: 500,
    });
    expect(normalized.length).toBe(1);
    expect(normalized[0].startMs).toBe(0);
    expect(normalized[0].endMs).toBeGreaterThanOrEqual(500);
  });

  test('planSpeechChunks expands short chunk duration into neighbor', () => {
    const shortConfig = {
      ...config,
      minChunkDurationSec: 6,
      padMs: 0,
      overlapMs: 0,
    };
    const segments = [
      { startMs: 0, endMs: 2000 },
      { startMs: 2500, endMs: 2700 },
      { startMs: 4000, endMs: 12000 },
    ];

    const chunks = planSpeechChunks({
      segments,
      audioDurationMs: secondsToMs(20),
      config: shortConfig,
    });

    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks[0].startMs).toBeLessThanOrEqual(0);
    expect(chunks[chunks.length - 1].endMs).toBeGreaterThan(11000);
  });
});
