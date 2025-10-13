import { transcribeFile } from './openai.js';

const LANGUAGE_STORAGE_KEY = 'transcription_language';

export function getStoredLanguage(preferred, availableOptions) {
  const stored =
    (typeof window !== 'undefined'
      ? window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
      : null) || '';
  const candidate = (stored || preferred || '').trim();
  const options = Array.isArray(availableOptions) ? availableOptions : [];

  if (options.length === 0) {
    if (candidate) return candidate;
    if (preferred) return preferred;
    return 'en-US';
  }

  if (candidate) {
    if (options.includes(candidate)) {
      return candidate;
    }

    const fallback = candidate.split('-')[0];
    const match = options.find((option) => option.startsWith(fallback));
    if (match) return match;
  }

  return options[0];
}

export function storeLanguage(language) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}

export function createSpeechRecognitionController({
  onFinal,
  onInterim,
  onError,
}) {
  const SpeechRecognition =
    typeof window !== 'undefined' &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  if (!SpeechRecognition) {
    throw new Error('SpeechRecognition API is not available in this browser');
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  let active = false;
  let shouldRestart = false;

  recognition.onresult = (event) => {
    let finalTranscript = '';
    let interimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const result = event.results[i][0].transcript;
      if (event.results[i].isFinal) finalTranscript += result;
      else interimTranscript += result;
    }

    if (finalTranscript && typeof onFinal === 'function') {
      onFinal(finalTranscript);
    }
    if (typeof onInterim === 'function') {
      onInterim(interimTranscript);
    }
  };

  recognition.onerror = (event) => {
    if (typeof onError === 'function') onError(event);
    if (active) {
      try {
        recognition.stop();
        recognition.start();
      } catch (error) {
        // Swallow restart errors to avoid crashing the UI loop.
        if (typeof onError === 'function') {
          onError({ error: error.message, type: 'restart' });
        }
      }
    }
  };

  recognition.onend = () => {
    if (active && shouldRestart) {
      try {
        recognition.start();
      } catch (error) {
        if (typeof onError === 'function') {
          onError({ error: error.message, type: 'restart' });
        }
      }
    }
  };

  return {
    start() {
      if (active) return;
      active = true;
      shouldRestart = true;
      recognition.start();
    },
    stop() {
      if (!active) return;
      shouldRestart = false;
      active = false;
      recognition.stop();
    },
    setLanguage(language) {
      recognition.lang = language;
      if (active) {
        recognition.stop();
        shouldRestart = true;
      }
    },
    get isActive() {
      return active;
    },
  };
}

export async function transcribeAudioFile({ file, language }) {
  return transcribeFile({ file, language });
}
