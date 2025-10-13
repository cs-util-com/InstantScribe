Refactor audio recorder into modular ES modules.

## Overview

- Move inline logic from `index.html` into dedicated modules: `recording.js`, `transcription.js`, `openai.js`, `ui/notifications.js`, and `main.js`.
- Preserve existing user flows for recording, transcription, high-quality Whisper processing, summaries, and downloads.

## Module Responsibilities

- `recording.js`: manage MediaRecorder/Web Audio setup, audio blob snapshots, finalization, and download helpers.
- `transcription.js`: wrap SpeechRecognition lifecycle, language persistence, and Whisper transcription via the OpenAI client.
- `openai.js`: encapsulate OpenAI client initialization and expose high-level summarize/transcription helpers.
- `ui/notifications.js`: manage transient notifications and visibility toggles for summarize/download buttons.
- `main.js`: orchestrate DOM bindings, state management, drag-drop flows, event handling, and coordination across modules.

## Integration Notes

- `index.html` now loads `src/main.js` as the entry module after Tailwind and lamejs scripts.
- Browser storage keys for API key and language preferences remain unchanged.
- Recording start/stop behavior matches legacy flow, including the initial 10-second grace period before downloads.

## Testing Strategy

- Unit tests cover helper utilities for formatting and DOM visibility toggles (`recording.test.js`, `ui/notifications.test.js`).
- Run `npm test` to ensure Jest executes with the updated module layout and coverage expectations.
