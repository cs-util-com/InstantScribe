# InstantScribe

**A Web-Based Audio Recorder & Live Transcription Tool**

InstantScribe is a lightweight, single-page web application that records audio and transcribes speech in real time directly in the browser. The entire workflow runs locally except for the optional OpenAI-powered refinement features, making it a privacy-preserving utility for interviews, meetings, or personal notes.

## Overview

InstantScribe leverages the **MediaRecorder API** for audio recording and the **Web Speech API** for real-time transcription.
In a single HTML file and a few hundred lines of JavaScript, the app provides a fast, privacy-friendly way to capture conversations, interviews, or personal notes directly in your browser.

---

## Usage

1.  **Open the App:**

    Go to [https://cs-util-com.github.io/InstantScribe](https://cs-util-com.github.io/InstantScribe/) (or download the **index.html** and open it locally on your computer)

2.  **Start Speaking:**  
    Allow microphone access, then start speaking. Watch your words appear in the transcription area in real time.
3.  **Customize Your File:**  
    Enter a custom title (optional) to personalize the file names.
4.  **Save Your Recording:**  
    Click the **Save Recording** button. This stops the recording, downloads the audio file, and saves the complete transcription as a text file.

## Functional Specification (Single-File Implementation)

The current application lives entirely in `index.html`. A developer reimplementing it should recreate the behaviors in this section to maintain feature parity.

### 1. Architecture Overview

- Serve a single HTML document that includes Tailwind CSS from the CDN, the `lamejs` MP3 encoder, and a module import of `openai@~4.86.2` via esm.sh.
- Embed all JavaScript inline. The script registers global helpers and event handlers once `DOMContentLoaded` fires.
- Rely exclusively on browser-native APIs—no build tooling, bundlers, or background services.

### 2. User Interface Layout

- Render a centered container (`max-w-3xl`) with a dark theme. Core elements, in order:
  - Filename input (`#custom-filename`) and a primary button (`#stop`) that starts labeled “Stop Recording” and switches to “Save Recording” after 10 seconds of capture time.
  - Language selector (`#language-select`) with predefined locale tags.
  - Primary transcription area (`#transcription-container`) containing an editable div (`#transcription`).
  - Collapsible high-quality transcription block (`#high-quality-container`) with contenteditable output (`#high-quality-transcription`). Hidden until needed.
  - Action buttons: a green Whisper trigger (`#whisper-transcribe`, doubles as drag-and-drop target) and a blue summarize button (`#summarize`, hidden until transcription text exists).
  - API key accordion exposing a password input (`#api-key`) and save button (`#save-api-key`).
  - Summary heading (`#summary-heading`) and container (`#summary-container`) with editable output (`#summary-content`), both initially hidden.
  - “Download AI Texts” button (`#download-ai-texts`) inside `#download-ai-texts-container`, hidden until AI-generated text exists.

### 3. Initialization Sequence

- On load, pull any stored `openai_api_key` from `localStorage` and populate `#api-key`.
- Register listeners to toggle the API key accordion, persist new keys, and update button visibility when transcription-related content changes.
- Immediately display a dismissible toast (“Recording & Transcription started…”) to prompt user interaction; once the user clicks anywhere, enable `beforeunload` warnings (`exitWarningEnabled`).
- Verify availability of `MediaRecorder` and Web Speech API; if absent, show an alert blocking usage.
- Request microphone access via `navigator.mediaDevices.getUserMedia({ audio: true })` and kick off the recording/transcription flow when granted.

### 4. Recording Lifecycle

- Establish global state flags: `isRecording`, `isInitialRecordingPeriod` (true for first 10 seconds), and storage for audio chunks (`audioChunks`) plus MP3 encoder buffers (`mp3Data`).
- For browsers supporting MP3 in `MediaRecorder`, stream data into `audioChunks`; otherwise, instantiate `AudioContext` + `ScriptProcessorNode` and encode MP3 frames manually with `lamejs`.
- After 10 seconds, switch the stop button label to “Save Recording”. If the user stops earlier, simply end the session without saving files (toast: “Recording stopped without saving files”).
- On normal stop (post-initial period), perform these downloads:
  - Captured audio as `YYYY-MM-DD_HH-MM-SS [custom title] audio recording.mp3`.
  - Plain-text transcript derived from the editable transcription area (HTML converted to text).
  - Any available high-quality transcript and summary (file names mirror the same timestamp/title pattern).
- Always stop the speech recognizer, media recorder, MP3 encoder, and microphone tracks during shutdown.

### 5. Live Transcription Behavior

- Instantiate `SpeechRecognition` with `continuous = true` and `interimResults = true`.
- Auto-select the recognition language by matching `navigator.language` with dropdown options; update when the user changes the dropdown.
- Each interim result is rendered inside a semi-transparent `<span id="interim-transcript">` and replaced when final text arrives.
- On final results, prepend a timestamp line (`[[MM:SS]]`) derived from the elapsed time since recording start (value captured when the interim text first appeared) and then append the recognized text node. Removing interim spans ensures clean output.
- Resume recognition automatically on `onend` while recording remains active; recover gracefully on `onerror` by restarting recognition when appropriate.

### 6. Drag-and-Drop Interactions

- `#transcription-container` accepts plain-text files (`.txt` or MIME `text/plain`). On drop:
  - Abort any active recording and transcription.
  - Replace current transcription content with the file’s text.
  - Show a notification confirming the load.
- `#whisper-transcribe` accepts audio files with MIME containing “audio”, “mp3”, “mp4”, “mpeg”, or extensions in `{mp3,m4a,mp4,wav,ogg,webm}`. On drop, stash the file in `droppedFile`, notify the user, and, if an API key is present, immediately trigger high-quality transcription.
- Visual feedback: add/remove dashed border and background classes during drag lifecycle for both zones.

### 7. OpenAI-Powered Features

- High-quality transcription (Whisper):
  - Requires a non-empty `apiKey`; otherwise, show a toast and expand the API key panel.
  - Works on the most recent audio source: dropped file takes priority, then native `audioChunks`, then `mp3Data` fallback.
  - Uses `client.audio.transcriptions.create({ file, model: 'whisper-1', language })` where the language is the dropdown’s two-letter prefix.
  - Displays progress text while awaiting the result, then populates `#high-quality-transcription`, reveals its container, resets `droppedFile`, updates AI-download visibility, and emits a success toast.
- Summarization:
  - Hidden until either the low-quality transcription or the high-quality transcription contains non-whitespace text.
  - On click, ensure at least one text source exists and an API key is available.
  - Call `client.chat.completions.create` with model `gpt-4o-mini`, passing a prompt that instructs the assistant to produce bullet takeaways, a structured paragraph summary, and a full high-quality transcript (prioritizing the Whisper text when present).
  - Write “Generating summary…” while awaiting the response, then inject the result, reveal summary UI, and update download visibility. On failure, surface the error message in the summary area.
- Download AI Texts button becomes visible when either high-quality transcription or summary content is populated. Downloads individual `.txt` files for each available artifact using the same timestamp/title naming scheme and confirms via toast.

### 8. Notification System

- `showNotification(message, duration = 3000)` renders a centered toast with fade-out animation. Use this helper for all user feedback (saved key, missing key, invalid drops, errors, success messages).
- Avoid stacking logic: each notification is appended to `document.body` and self-destructs after fading.

### 9. Persistence & Exit Guardrails

- Persist the API key under `localStorage['openai_api_key']`. Never expose it elsewhere.
- After first user interaction, add a `beforeunload` handler that, when `isRecording` is true, prompts the user before leaving the page to avoid accidental data loss.

### 10. Error and Support States

- If media access is denied or unavailable, log the error and alert the user.
- Catch and log OpenAI failures in both Whisper and summarization flows, resetting UI messages appropriately and clearing `droppedFile` on Whisper errors.
- Ensure recognition restarts automatically after recoverable errors while recording remains active.

## External Dependencies & APIs

- **Tailwind CSS (cdn.tailwindcss.com):** Provides utility classes for styling without build tooling.
- **lamejs@1.2.1:** Supplies an MP3 encoder when browsers lack native MP3 support.
- **OpenAI JS SDK (~4.86.2):** Exposes `OpenAI` client used for Whisper and summarization. The client must be instantiated with `{ apiKey, dangerouslyAllowBrowser: true }` to run in the browser.
- **Browser APIs:**
  - `navigator.mediaDevices.getUserMedia` for microphone capture.
  - `MediaRecorder` for audio chunks (with fallback to Web Audio API + `ScriptProcessorNode`).
  - Web Speech API (`SpeechRecognition` or `webkitSpeechRecognition`) for live transcription.
  - DOM drag-and-drop events for file ingestion.

## Future Work: Modularized Architecture (High-Level)

While the current implementation succeeds as a single page, a maintainable evolution could:

- Split UI markup into HTML templates with components for the toolbar, transcription panes, AI actions, and notifications.
- Move business logic into ES modules under `src/` (e.g., `src/recording.js`, `src/transcription.js`, `src/openai.js`, `src/ui/notifications.js`).
- Replace global state with a lightweight state container that exposes observable properties for recording status, API key, and AI outputs.
- Extract configuration (language list, OpenAI prompt text, toast durations) into dedicated modules or JSON files.
- Add unit tests alongside modules to cover edge cases (recording stop states, drag-drop validation, OpenAI request shaping).
- Consider a custom event system or message bus so UI elements only respond to relevant updates, enabling future multi-page or component-based expansions without rewriting core logic.

## Contributing

Contributions, feedback, or suggestions are welcome. To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a clear description of your changes.
