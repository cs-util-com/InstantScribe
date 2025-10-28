/* istanbul ignore file -- browser-only DOM orchestration pending integration tests */

import {
  Recorder,
  checkRecorderSupport,
  downloadBlob,
  getDateTimePrefix,
  htmlToPlainText,
  padZero,
} from './recording.js';
import {
  showNotification,
  updateSummarizeButtonVisibility,
  updateDownloadAiTextsButtonVisibility,
} from './ui/notifications.js';
import { initClient, summarizeText as requestSummary } from './openai.js';
import {
  createSpeechRecognitionController,
  getStoredLanguage,
  storeLanguage,
  transcribeAudioFile,
} from './transcription.js';

const API_KEY_STORAGE_KEY = 'openai_api_key';
const INTERIM_SPAN_ID = 'interim-transcript';
const INITIAL_PERIOD_MS = 10000;

let recorder = null;
let recognitionController = null;
let apiKey = '';
let isRecording = false;
let exitWarningEnabled = false;
let isInitialRecordingPeriod = true;
let initialPeriodTimer = null;
let interimStartTime = null;
let recordingStartTime = Date.now();
let droppedFile = null;

const state = {
  elements: {},
};

document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
  cacheDomElements();

  if (!checkRecorderSupport()) {
    alert(
      'Your browser does not support the required APIs for audio recording and transcription.'
    );
    return;
  }

  attachUiEventHandlers();
  hydrateApiKey();
  configureLanguageSelection();
  displayStartupPrompt();
  setupRecognition();
  startRecording();

  window.addEventListener('beforeunload', handleBeforeUnload);
}

function cacheDomElements() {
  state.elements.stopButton = document.getElementById('stop');
  state.elements.summarizeBtn = document.getElementById('summarize');
  state.elements.whisperBtn = document.getElementById('whisper-transcribe');
  state.elements.transcriptionEl = document.getElementById('transcription');
  state.elements.highQualityTranscriptionEl = document.getElementById(
    'high-quality-transcription'
  );
  state.elements.highQualityContainer = document.getElementById(
    'high-quality-container'
  );
  state.elements.transcriptionContainer = document.getElementById(
    'transcription-container'
  );
  state.elements.summaryHeading = document.getElementById('summary-heading');
  state.elements.summaryContainer =
    document.getElementById('summary-container');
  state.elements.summaryContentEl = document.getElementById('summary-content');
  state.elements.downloadAiTextsBtn =
    document.getElementById('download-ai-texts');
  state.elements.downloadAiTextsContainer = document.getElementById(
    'download-ai-texts-container'
  );
  state.elements.apiKeyField = document.getElementById('api-key');
  state.elements.apiKeyToggle = document.querySelector('.api-key-toggle');
  state.elements.apiKeyInputWrapper = document.querySelector('.api-key-input');
  state.elements.saveApiKeyBtn = document.getElementById('save-api-key');
  state.elements.languageSelect = document.getElementById('language-select');
  state.elements.customFilenameInput =
    document.getElementById('custom-filename');
}

function attachUiEventHandlers() {
  const {
    transcriptionEl,
    highQualityTranscriptionEl,
    summarizeBtn,
    summaryContentEl,
    downloadAiTextsBtn,
    apiKeyToggle,
    apiKeyInputWrapper,
    saveApiKeyBtn,
    apiKeyField,
    transcriptionContainer,
    whisperBtn,
    languageSelect,
    stopButton,
  } = state.elements;

  const refreshSummarizeVisibility = () =>
    updateSummarizeButtonVisibility({
      transcriptionEl,
      highQualityEl: highQualityTranscriptionEl,
      summarizeBtn,
    });

  const refreshDownloadVisibility = () =>
    updateDownloadAiTextsButtonVisibility({
      highQualityEl: highQualityTranscriptionEl,
      summaryEl: summaryContentEl,
      container: state.elements.downloadAiTextsContainer,
    });

  transcriptionEl.addEventListener('input', refreshSummarizeVisibility);
  highQualityTranscriptionEl.addEventListener(
    'input',
    refreshSummarizeVisibility
  );
  highQualityTranscriptionEl.addEventListener(
    'input',
    refreshDownloadVisibility
  );
  summaryContentEl.addEventListener('input', refreshDownloadVisibility);

  apiKeyToggle.addEventListener('click', () => {
    apiKeyInputWrapper.classList.toggle('hidden');
  });

  saveApiKeyBtn.addEventListener('click', () => {
    apiKey = apiKeyField.value.trim();
    window.localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    initClient(apiKey);
    apiKeyInputWrapper.classList.add('hidden');
    showNotification('API key saved');
  });

  transcriptionContainer.addEventListener('dragenter', (event) => {
    event.preventDefault();
    event.stopPropagation();
    transcriptionContainer.classList.add(
      'bg-gray-600',
      'border-2',
      'border-dashed',
      'border-blue-400'
    );
  });

  transcriptionContainer.addEventListener('dragover', (event) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  });

  transcriptionContainer.addEventListener('dragleave', (event) => {
    event.preventDefault();
    event.stopPropagation();
    transcriptionContainer.classList.remove(
      'bg-gray-600',
      'border-2',
      'border-dashed',
      'border-blue-400'
    );
  });

  transcriptionContainer.addEventListener('drop', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    transcriptionContainer.classList.remove(
      'bg-gray-600',
      'border-2',
      'border-dashed',
      'border-blue-400'
    );

    const file = getFileFromDrop(event);
    if (!file) return;
    const fileType = (file.type || '').toLowerCase();

    if (fileType.includes('text/plain') || /\.txt$/i.test(file.name)) {
      if (isRecording) {
        await stopRecording({ downloadOutputs: false });
        showNotification('Recording stopped to load text file');
      }
      loadTextFile(file);
    } else {
      showNotification('Please drop a valid text (.txt) file');
    }
  });

  whisperBtn.addEventListener('dragenter', (event) => {
    event.preventDefault();
    event.stopPropagation();
    whisperBtn.classList.add(
      'bg-green-800',
      'border-2',
      'border-dashed',
      'border-green-400'
    );
  });

  whisperBtn.addEventListener('dragover', (event) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  });

  whisperBtn.addEventListener('dragleave', (event) => {
    event.preventDefault();
    event.stopPropagation();
    whisperBtn.classList.remove(
      'bg-green-800',
      'border-2',
      'border-dashed',
      'border-green-400'
    );
  });

  whisperBtn.addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();
    whisperBtn.classList.remove(
      'bg-green-800',
      'border-2',
      'border-dashed',
      'border-green-400'
    );

    const file = getFileFromDrop(event);
    if (!file) return;
    const fileType = (file.type || '').toLowerCase();

    if (
      fileType.includes('audio') ||
      fileType.includes('mp3') ||
      fileType.includes('mp4') ||
      fileType.includes('mpeg') ||
      /\.(mp3|m4a|mp4|wav|ogg|webm)$/i.test(file.name)
    ) {
      droppedFile = file;
      showNotification(`Audio file "${file.name}" ready for transcription`);
      if (apiKey) {
        generateHighQualityTranscription();
      } else {
        showNotification('Please provide an OpenAI API key first');
        state.elements.apiKeyInputWrapper.classList.remove('hidden');
      }
    } else {
      showNotification('Please drop a valid audio file (mp3, m4a, mp4, etc.)');
    }
  });

  whisperBtn.addEventListener('click', () => {
    generateHighQualityTranscription();
  });

  summarizeBtn.addEventListener('click', () => {
    generateSummary();
  });

  downloadAiTextsBtn.addEventListener('click', () => {
    downloadAiOutputs();
  });

  languageSelect.addEventListener('change', () => {
    const newLanguage = languageSelect.value;
    storeLanguage(newLanguage);
    if (recognitionController) {
      recognitionController.setLanguage(newLanguage);
      if (isRecording && !recognitionController.isActive) {
        recognitionController.start();
      }
    }
  });

  stopButton.addEventListener('click', async () => {
    if (!isRecording) return;
    await stopRecording({ downloadOutputs: !isInitialRecordingPeriod });
  });

  refreshSummarizeVisibility();
  refreshDownloadVisibility();
}

function hydrateApiKey() {
  const { apiKeyField } = state.elements;
  apiKey = window.localStorage.getItem(API_KEY_STORAGE_KEY) || '';
  if (apiKey) {
    apiKeyField.value = apiKey;
    initClient(apiKey);
  }
}

function configureLanguageSelection() {
  const { languageSelect } = state.elements;
  const availableLanguages = Array.from(languageSelect.options).map(
    (option) => option.value
  );
  const browserLanguage = navigator.language || 'en-US';
  const initialLanguage = getStoredLanguage(
    browserLanguage,
    availableLanguages
  );
  languageSelect.value = initialLanguage;
}

function displayStartupPrompt() {
  const notification = document.createElement('div');
  notification.className =
    'fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-black/70 text-white py-2.5 px-4 rounded-md z-50 text-center transition-opacity duration-500';
  notification.innerHTML =
    'Recording & Transcription started (Click anywhere to hide message)';
  document.body.appendChild(notification);

  function enableExitWarning() {
    exitWarningEnabled = true;
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 500);
    document.removeEventListener('click', enableExitWarning);
  }

  document.addEventListener('click', enableExitWarning, { once: true });
}

function setupRecognition() {
  const { highQualityTranscriptionEl, summarizeBtn, summaryContentEl } =
    state.elements;

  recognitionController = createSpeechRecognitionController({
    onFinal: (finalTranscript) => {
      if (!finalTranscript) return;
      removeInterimTranscript();
      if (interimStartTime) {
        const elapsed = interimStartTime - recordingStartTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        appendTimestamp(minutes, seconds);
        interimStartTime = null;
      }
      state.elements.transcriptionEl.appendChild(
        document.createTextNode(finalTranscript)
      );
      updateSummarizeButtonVisibility({
        transcriptionEl: state.elements.transcriptionEl,
        highQualityEl: highQualityTranscriptionEl,
        summarizeBtn,
      });
    },
    onInterim: (interimTranscript) => {
      if (interimTranscript && !interimStartTime) {
        interimStartTime = Date.now();
      }
      renderInterimTranscript(interimTranscript);
    },
    onError: (event) => {
      console.error('Speech recognition error:', event);
      summaryContentEl.dataset.lastRecognitionError = String(
        event?.error || event?.type || ''
      );
    },
  });

  const { languageSelect } = state.elements;
  recognitionController.setLanguage(languageSelect.value);
}

async function startRecording() {
  const { stopButton } = state.elements;
  try {
    recorder = new Recorder();
    const stream = await recorder.start();
    window.microphoneStream = stream;
    recordingStartTime = Date.now();
    interimStartTime = null;
    isInitialRecordingPeriod = true;
    stopButton.textContent = 'Stop Recording';
    stopButton.style.display = 'inline-block';
    isRecording = true;

    clearTimeout(initialPeriodTimer);
    initialPeriodTimer = window.setTimeout(() => {
      isInitialRecordingPeriod = false;
      stopButton.textContent = 'Save Recording';
    }, INITIAL_PERIOD_MS);

    if (recognitionController && !recognitionController.isActive) {
      recognitionController.start();
    }
  } catch (error) {
    console.error('Error accessing microphone:', error);
    alert('Microphone access denied or unavailable.');
  }
}

async function stopRecording({ downloadOutputs }) {
  const { stopButton, transcriptionEl, customFilenameInput } = state.elements;

  isRecording = false;
  clearTimeout(initialPeriodTimer);
  isInitialRecordingPeriod = false;
  stopButton.style.display = 'none';
  removeInterimTranscript();

  if (recognitionController && recognitionController.isActive) {
    recognitionController.stop();
  }

  if (recorder) {
    await recorder.stop();
  }

  if (!downloadOutputs) {
    showNotification('Recording stopped without saving files');
    return;
  }

  const customTitle = customFilenameInput.value.trim();
  const prefix = getDateTimePrefix(recordingStartTime);

  const transcriptionHTML = transcriptionEl.innerHTML;
  const transcriptionText = htmlToPlainText(transcriptionHTML);
  downloadTextArtifact(
    transcriptionText,
    prefix,
    customTitle,
    'audio transcript'
  );

  const audioBlob =
    recorder?.getAudioBlob() || recorder?.getAudioBlobSnapshot();
  if (audioBlob && audioBlob.size > 0) {
    const audioFile = buildFileName(
      prefix,
      customTitle,
      'audio recording',
      'mp3'
    );
    downloadBlob(audioBlob, audioFile);
  }

  downloadRecordingTexts(prefix, customTitle);
}

function loadTextFile(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const content = event.target?.result;
    if (typeof content !== 'string') return;
    state.elements.transcriptionEl.innerHTML = '';
    state.elements.transcriptionEl.textContent = content;
    updateSummarizeButtonVisibility({
      transcriptionEl: state.elements.transcriptionEl,
      highQualityEl: state.elements.highQualityTranscriptionEl,
      summarizeBtn: state.elements.summarizeBtn,
    });
    showNotification(`Text file "${file.name}" loaded successfully`);
  };
  reader.onerror = () => {
    showNotification('Error reading the text file');
  };
  reader.readAsText(file);
}

async function generateHighQualityTranscription() {
  const {
    highQualityContainer,
    highQualityTranscriptionEl,
    languageSelect,
    summarizeBtn,
    summaryContentEl,
  } = state.elements;

  if (!apiKey) {
    showNotification('Please provide an OpenAI API key first');
    state.elements.apiKeyInputWrapper.classList.remove('hidden');
    return;
  }

  const audioFile = await resolveAudioFile();
  if (!audioFile) {
    showNotification('No audio recorded yet');
    return;
  }

  highQualityContainer.classList.remove('hidden');
  highQualityTranscriptionEl.textContent =
    'Generating high-quality transcription...';

  try {
    initClient(apiKey);
    const languageCode = languageSelect.value.split('-')[0];
    const transcription = await transcribeAudioFile({
      file: audioFile,
      language: languageCode,
    });
    highQualityTranscriptionEl.textContent = transcription;
    droppedFile = null;

    updateSummarizeButtonVisibility({
      transcriptionEl: state.elements.transcriptionEl,
      highQualityEl: highQualityTranscriptionEl,
      summarizeBtn,
    });
    updateDownloadAiTextsButtonVisibility({
      highQualityEl: highQualityTranscriptionEl,
      summaryEl: summaryContentEl,
      container: state.elements.downloadAiTextsContainer,
    });
    showNotification('High-quality transcription completed');
  } catch (error) {
    console.error('Error generating high-quality transcription:', error);
    highQualityTranscriptionEl.textContent = `Error: ${error.message}`;
    showNotification('High-quality transcription failed. Please try again.');
    droppedFile = null;
  }
}

async function resolveAudioFile() {
  if (droppedFile) return droppedFile;
  if (!recorder) return null;
  const snapshot = recorder.getAudioFileSnapshot('audio.mp3');
  if (snapshot) return snapshot;
  const audioBlob = recorder.getAudioBlob();
  if (audioBlob) {
    return new File([audioBlob], 'audio.mp3', { type: audioBlob.type });
  }
  return null;
}

function getFileFromDrop(event) {
  const files = event.dataTransfer?.files;
  if (!files || files.length === 0) return null;
  return files[0];
}

async function generateSummary() {
  const {
    summarizeBtn,
    summaryHeading,
    summaryContainer,
    summaryContentEl,
    highQualityTranscriptionEl,
  } = state.elements;

  const lowQualityText = state.elements.transcriptionEl.textContent || '';
  const highQualityText = highQualityTranscriptionEl.textContent || '';

  if (!lowQualityText.trim() && !highQualityText.trim()) {
    showNotification('No transcription text to summarize');
    return;
  }
  if (!apiKey) {
    showNotification('Please provide an OpenAI API key first');
    state.elements.apiKeyInputWrapper.classList.remove('hidden');
    return;
  }

  initClient(apiKey);
  summarizeBtn.disabled = true;
  summaryHeading.classList.remove('hidden');
  summaryContainer.classList.remove('hidden');
  summaryContentEl.textContent = 'Generating summary...';

  try {
    const summary = await requestSummary({
      lowQuality: lowQualityText,
      highQuality: highQualityText,
    });
    summaryContentEl.textContent = summary;
    updateDownloadAiTextsButtonVisibility({
      highQualityEl: highQualityTranscriptionEl,
      summaryEl: summaryContentEl,
      container: state.elements.downloadAiTextsContainer,
    });
  } catch (error) {
    console.error('Error generating summary:', error);
    summaryContentEl.textContent = `Error generating summary: ${error.message}`;
  } finally {
    summarizeBtn.disabled = false;
  }
}

function downloadAiOutputs() {
  const { customFilenameInput } = state.elements;
  const customTitle = customFilenameInput.value.trim();
  const prefix = getDateTimePrefix(Date.now());

  downloadRecordingTexts(prefix, customTitle);

  showNotification('AI texts downloaded');
}

function handleBeforeUnload(event) {
  if (isRecording && exitWarningEnabled) {
    const message =
      'A recording is still in progress. Are you sure you want to leave?';
    event.preventDefault();
    event.returnValue = message;
    return message;
  }
  return undefined;
}

function appendTimestamp(minutes, seconds) {
  const timestampDiv = document.createElement('div');
  timestampDiv.style.fontWeight = 'bold';
  timestampDiv.style.color = 'lightgray';
  timestampDiv.textContent = `[[${padZero(minutes)}:${padZero(seconds)}]] `;
  state.elements.transcriptionEl.appendChild(timestampDiv);
}

function renderInterimTranscript(interimTranscript) {
  removeInterimTranscript();
  if (!interimTranscript) return;
  const interimSpan = document.createElement('span');
  interimSpan.id = INTERIM_SPAN_ID;
  interimSpan.style.opacity = '0.5';
  interimSpan.textContent = interimTranscript;
  state.elements.transcriptionEl.appendChild(interimSpan);
}

function removeInterimTranscript() {
  const interim = document.getElementById(INTERIM_SPAN_ID);
  if (interim) interim.remove();
}

function downloadRecordingTexts(prefix, customTitle) {
  const { highQualityTranscriptionEl, summaryContentEl } = state.elements;
  downloadTextArtifact(
    highQualityTranscriptionEl.textContent,
    prefix,
    customTitle,
    'high quality transcript'
  );
  downloadTextArtifact(
    summaryContentEl.textContent,
    prefix,
    customTitle,
    'summary'
  );
}

function downloadTextArtifact(text, prefix, customTitle, suffix) {
  if (!text || !text.trim()) return;
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const fileName = buildFileName(prefix, customTitle, suffix, 'txt');
  downloadBlob(blob, fileName);
}

function buildFileName(prefix, customTitle, suffix, extension = 'txt') {
  const safeSuffix = suffix ? ` ${suffix}` : '';
  const safeTitle = customTitle ? ` ${customTitle}` : '';
  return `${prefix}${safeTitle}${safeSuffix}.${extension}`;
}
