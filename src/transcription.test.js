import {
  getStoredLanguage,
  storeLanguage,
  createSpeechRecognitionController,
  transcribeAudioFile,
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

  test('storeLanguage persists value in localStorage', () => {
    storeLanguage('it-IT');
    expect(window.localStorage.getItem('transcription_language')).toBe('it-IT');
  });

  test('createSpeechRecognitionController manages recognition lifecycle', async () => {
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
    const controller = createSpeechRecognitionController({
      onFinal,
      onInterim,
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

    recognitionInstance.onend();
    expect(recognitionInstance.start).toHaveBeenCalledTimes(2);

    controller.stop();
    expect(recognitionInstance.stop).toHaveBeenCalledTimes(2);
  });

  test('transcribeAudioFile proxies to openai module', async () => {
    const file = new File(['data'], 'audio.mp3', { type: 'audio/mpeg' });
    transcribeFile.mockResolvedValue('transcribed');
    const result = await transcribeAudioFile({ file, language: 'en' });
    expect(transcribeFile).toHaveBeenCalledWith({ file, language: 'en' });
    expect(result).toBe('transcribed');
  });
});
