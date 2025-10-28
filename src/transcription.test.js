import {
  getStoredLanguage,
  storeLanguage,
  createSpeechRecognitionController,
  transcribeAudioFile,
} from './transcription.js';
import { chunkedTranscription } from './stt/transcriber.js';

jest.mock('./stt/transcriber.js', () => ({
  chunkedTranscription: jest.fn(),
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

  test('transcribeAudioFile delegates to chunked transcriber', async () => {
    const file = new File(['data'], 'audio.mp3', { type: 'audio/mpeg' });
    chunkedTranscription.mockResolvedValue('transcribed');
    const result = await transcribeAudioFile({ file, language: 'en' });
    expect(chunkedTranscription).toHaveBeenCalledWith({
      file,
      language: 'en',
    });
    expect(result).toBe('transcribed');
  });
});
