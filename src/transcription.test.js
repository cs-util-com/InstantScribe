import {
  getStoredLanguage,
  storeLanguage,
  createSpeechRecognitionController,
  transcribeAudioFile,
  __testables,
} from './transcription.js';
import { transcribeFile } from './openai.js';

jest.mock('./openai.js', () => ({
  transcribeFile: jest.fn(),
}));

describe('transcription utilities', () => {
  const originalSpeech = window.SpeechRecognition;
  const originalWebkitSpeech = window.webkitSpeechRecognition;

  afterEach(() => {
    window.localStorage.clear();
    window.SpeechRecognition = originalSpeech;
    window.webkitSpeechRecognition = originalWebkitSpeech;
    jest.clearAllMocks();
  });

  test('getStoredLanguage returns stored match', () => {
    window.localStorage.setItem('transcription_language', 'de-DE');
    const language = getStoredLanguage('en-US', ['de-DE', 'en-US']);
    expect(language).toBe('de-DE');
  });

  test('getStoredLanguage falls back to prefix match', () => {
    window.localStorage.setItem('transcription_language', 'es-MX');
    const language = getStoredLanguage('en-US', ['es-ES', 'fr-FR']);
    expect(language).toBe('es-ES');
  });

  test('getStoredLanguage falls back to defaults when no options', () => {
    window.localStorage.removeItem('transcription_language');
    const language = getStoredLanguage('en-US', []);
    expect(language).toBe('en-US');
  });

  test('getStoredLanguage uses preferred when stored value is whitespace', () => {
    window.localStorage.setItem('transcription_language', '   ');
    const language = getStoredLanguage('de-DE', []);
    expect(language).toBe('de-DE');
  });

  test('getStoredLanguage defaults to en-US when nothing provided', () => {
    window.localStorage.removeItem('transcription_language');
    const language = getStoredLanguage('', []);
    expect(language).toBe('en-US');
  });

  test('getStoredLanguage returns first option when no stored match', () => {
    window.localStorage.removeItem('transcription_language');
    const language = getStoredLanguage('', ['ja-JP', 'ko-KR']);
    expect(language).toBe('ja-JP');
  });

  test('getStoredLanguage falls back to first option when no prefix match', () => {
    window.localStorage.setItem('transcription_language', 'pt-BR');
    const language = getStoredLanguage('en-US', ['fr-FR', 'de-DE']);
    expect(language).toBe('fr-FR');
  });

  test('getStoredLanguage handles non-array options input', () => {
    window.localStorage.removeItem('transcription_language');
    const language = getStoredLanguage('en-US', null);
    expect(language).toBe('en-US');
  });

  test('storeLanguage persists value in localStorage', () => {
    storeLanguage('it-IT');
    expect(window.localStorage.getItem('transcription_language')).toBe('it-IT');
  });

  test('storeLanguage uses injected storage when provided', () => {
    const storage = { setItem: jest.fn() };
    storeLanguage('es-ES', storage);
    expect(storage.setItem).toHaveBeenCalledWith(
      'transcription_language',
      'es-ES'
    );
  });

  test('storeLanguage no-ops when storage is unavailable', () => {
    storeLanguage('es-ES', null);
    expect(window.localStorage.getItem('transcription_language')).toBeNull();
  });

  test('getStoredLanguage handles missing window object', () => {
    const originalWindow = global.window;
    try {
      // eslint-disable-next-line no-global-assign
      window = undefined;
      const language = getStoredLanguage('en-US', ['en-US']);
      expect(language).toBe('en-US');
    } finally {
      // eslint-disable-next-line no-global-assign
      window = originalWindow;
    }
  });

  test('createSpeechRecognitionController manages recognition lifecycle', () => {
    let recognitionInstance;
    class MockRecognition {
      constructor() {
        recognitionInstance = this;
        this.lang = '';
        this.continuous = false;
        this.interimResults = false;
        this.start = jest.fn();
        this.stop = jest.fn();
      }
    }

    window.SpeechRecognition = MockRecognition;

    const onFinal = jest.fn();
    const onInterim = jest.fn();
    const onError = jest.fn();
    const controller = createSpeechRecognitionController({
      onFinal,
      onInterim,
      onError,
    });

    controller.setLanguage('en-US');
    expect(recognitionInstance.lang).toBe('en-US');

    controller.start();
    expect(recognitionInstance.start).toHaveBeenCalledTimes(1);

    controller.setLanguage('de-DE');
    expect(recognitionInstance.lang).toBe('de-DE');
    expect(recognitionInstance.stop).toHaveBeenCalledTimes(1);

    const event = {
      resultIndex: 0,
      results: [
        {
          0: { transcript: 'Hello' },
          isFinal: true,
        },
        {
          0: { transcript: ' interim' },
          isFinal: false,
        },
      ],
    };
    recognitionInstance.onresult(event);

    expect(onFinal).toHaveBeenCalledWith('Hello');
    expect(onInterim).toHaveBeenCalledWith(' interim');

    recognitionInstance.onerror({ error: 'network' });
    expect(recognitionInstance.stop).toHaveBeenCalledTimes(2);
    expect(recognitionInstance.start).toHaveBeenCalledTimes(2);

    recognitionInstance.stop.mockImplementationOnce(() => {
      throw new Error('stop fail');
    });
    recognitionInstance.onerror({ error: 'failure' });
    expect(onError).toHaveBeenCalledWith({ error: 'failure' });
    expect(onError).toHaveBeenCalledWith({
      error: 'stop fail',
      type: 'restart',
    });

    recognitionInstance.onend();
    expect(recognitionInstance.start).toHaveBeenCalledTimes(3);

    recognitionInstance.start.mockImplementationOnce(() => {
      throw new Error('start fail');
    });
    recognitionInstance.onend();
    expect(onError).toHaveBeenCalledWith({
      error: 'start fail',
      type: 'restart',
    });

    controller.stop();
    expect(recognitionInstance.stop).toHaveBeenCalledTimes(4);
  });

  test('createSpeechRecognitionController throws when API unavailable', () => {
    window.SpeechRecognition = undefined;
    window.webkitSpeechRecognition = undefined;
    expect(() =>
      createSpeechRecognitionController({ onFinal: jest.fn() })
    ).toThrow('SpeechRecognition API is not available in this browser');
  });

  test('createSpeechRecognitionController handles missing callbacks', () => {
    let recognitionInstance;
    class MockRecognition {
      constructor() {
        recognitionInstance = this;
        this.continuous = false;
        this.interimResults = false;
        this.start = jest.fn();
        this.stop = jest.fn();
      }
    }

    window.SpeechRecognition = MockRecognition;
    const controller = createSpeechRecognitionController({});
    controller.start();
    const event = {
      resultIndex: 0,
      results: [
        {
          0: { transcript: 'Hi' },
          isFinal: true,
        },
      ],
    };

    expect(() => recognitionInstance.onresult(event)).not.toThrow();
    expect(() => recognitionInstance.onerror({ error: 'noop' })).not.toThrow();
    recognitionInstance.onend();
    expect(recognitionInstance.start).toHaveBeenCalled();
    controller.stop();
  });

  test('transcribeAudioFile proxies to openai module', async () => {
    const file = new File(['data'], 'audio.mp3', { type: 'audio/mpeg' });
    transcribeFile.mockResolvedValue('transcribed');
    const result = await transcribeAudioFile({ file, language: 'en' });
    expect(transcribeFile).toHaveBeenCalledWith({
      file,
      language: 'en',
      prompt: undefined,
    });
    expect(result).toBe('transcribed');
  });

  test('detectAndNormalizeSegments returns empty array on detector failure', () => {
    const { detectAndNormalizeSegments } = __testables;
    const decoded = {
      pcm: new Float32Array(10),
      sampleRate: 16000,
      durationMs: 1000,
    };
    const detector = () => {
      throw new Error('fail');
    };
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const segments = detectAndNormalizeSegments(decoded, detector);
    warnSpy.mockRestore();
    expect(segments).toEqual([]);
  });

  test('buildChunkPlan falls back to single chunk when segmentation empty', () => {
    const { buildChunkPlan } = __testables;
    const decoded = { durationMs: 5000 };
    const plan = buildChunkPlan(decoded, []);
    expect(plan).toHaveLength(1);
    expect(plan[0]).toMatchObject({ startMs: 0, endMs: 5000 });
  });

  test('hasBrowserAudioSupport returns true when APIs exist', () => {
    const { hasBrowserAudioSupport } = __testables;
    const originalAudio = window.AudioContext;
    const originalOffline = window.OfflineAudioContext;
    window.AudioContext = function MockContext() {};
    window.OfflineAudioContext = function MockOffline() {};
    expect(hasBrowserAudioSupport()).toBe(true);
    window.AudioContext = originalAudio;
    window.OfflineAudioContext = originalOffline;
  });

  test('detectAndNormalizeSegments uses detector results', () => {
    const { detectAndNormalizeSegments } = __testables;
    const decoded = {
      pcm: new Float32Array(16000),
      sampleRate: 16000,
      durationMs: 4000,
    };
    const detector = () => [
      { startMs: 0, endMs: 1200 },
      { startMs: 1500, endMs: 2500 },
    ];
    const segments = detectAndNormalizeSegments(decoded, detector);
    expect(segments.length).toBeGreaterThan(0);
  });

  test('buildChunkPlan groups normalized segments into chunks', () => {
    const { buildChunkPlan } = __testables;
    const decoded = { durationMs: 120000 };
    const plan = buildChunkPlan(decoded, [
      { startMs: 0, endMs: 30000 },
      { startMs: 31000, endMs: 60000 },
      { startMs: 70000, endMs: 90000 },
    ]);
    expect(plan.length).toBeGreaterThan(0);
  });

  test('transcribeAudioFile splits audio into multiple requests when supported', async () => {
    const decodeMock = jest.fn().mockResolvedValue({
      pcm: new Float32Array(16000 * 4),
      sampleRate: 16000,
      durationMs: 4000,
    });
    const detectMock = jest.fn().mockReturnValue([
      { startMs: 0, endMs: 1500 },
      { startMs: 1600, endMs: 3500 },
    ]);
    const encodeMock = jest.fn().mockReturnValue(new Uint8Array([0, 1, 2]));
    const transcribeMock = jest
      .fn()
      .mockResolvedValueOnce('first chunk')
      .mockResolvedValueOnce('second chunk');

    const originalAudio = window.AudioContext;
    const originalOffline = window.OfflineAudioContext;
    window.AudioContext = function MockContext() {};
    window.OfflineAudioContext = function MockOffline() {};

    jest.resetModules();
    jest.doMock('./stt/audio.js', () => ({ decodeFileToMonoPcm: decodeMock }));
    jest.doMock('./stt/vad.js', () => ({ detectSpeechSegments: detectMock }));
    jest.doMock('./stt/chunkPlanner.js', () => ({
      planSpeechChunks: jest.fn().mockReturnValue([
        { index: 0, startMs: 0, endMs: 1500, segments: [] },
        { index: 1, startMs: 1500, endMs: 3500, segments: [] },
      ]),
      slicePcm: jest.fn().mockReturnValue(new Float32Array([0, 0.1])),
      normalizeSpeechSegments: jest
        .fn()
        .mockImplementation(({ segments }) => segments),
    }));
    jest.doMock('./stt/wav.js', () => ({ encodeWav: encodeMock }));
    jest.doMock('./openai.js', () => ({ transcribeFile: transcribeMock }));

    const mod = await import('./transcription.js');
    const file = new File(['dummy'], 'audio.wav', { type: 'audio/wav' });
    const result = await mod.transcribeAudioFile({ file, language: 'en' });

    expect(transcribeMock).toHaveBeenCalledTimes(2);
    expect(result).toContain('second chunk');

    window.AudioContext = originalAudio;
    window.OfflineAudioContext = originalOffline;
    jest.dontMock('./stt/audio.js');
    jest.dontMock('./stt/vad.js');
    jest.dontMock('./stt/chunkPlanner.js');
    jest.dontMock('./stt/wav.js');
    jest.dontMock('./openai.js');
    jest.resetModules();
  });
});
