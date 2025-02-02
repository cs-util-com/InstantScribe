# InstantScribe

**A Web-Based Audio Recorder & Live Transcription Tool**

InstantScribe is a lightweight, single-page web application that records audio and transcribes your speech in real-time—all within your browser. Using modern browser APIs, the entire recording and transcription process happens locally on your device, ensuring your data never leaves your computer.

## Overview

InstantScribe leverages the **MediaRecorder API** for audio recording and the **Web Speech API** for real-time transcription. 
In a single HTML file and a few hundred lines of JavaScript, the app provides a fast, privacy-friendly way to capture conversations, interviews, or personal notes directly in your browser.

----------

## Usage

1.  **Open the App:**  
    
    Go to [https://cs-util-com.github.io/InstantScribe](https://cs-util-com.github.io/InstantScribe/) (or download the **index.html** and open it locally on your computer)
    
2.  **Start Speaking:**  
    Allow microphone access, then start speaking. Watch your words appear in the transcription area in real time.
    
3.  **Customize Your File:**  
    Enter a custom title (optional) to personalize the file names.
    
4.  **Save Your Recording:**  
    Click the **Save Recording** button. This stops the recording, downloads the audio file, and saves the complete transcription as a text file.
    

----------

## Features

-   **Local Processing:** All recording and transcription occur on the client side.
-   **Real-Time Transcription:** See your spoken words appear on-screen as you talk.
-   **Custom File Naming:** Option to specify a title that will be prepended to your downloaded files.
-   **Downloadable Assets:** Save both the audio recording and its transcript with a single click.
-   **Multiple Languages:** Easily switch the transcription language (English, German, French, Spanish, Italian, Japanese, Chinese, etc.).

----------

## Motivation why this app was built

The main motivation was really that it was a lot more fun (and maybe even faster) to just build exactly the web app I needed vs trying to find an existing online tool that was "good enough". So I decided to use ChatGpt to help me build a browser-based audio recorder with instant transcription (without sending your data to a server). After a few first iterations (see initial commits) a first working draft was usable that I then iterated until it did everything I ever wanted for such a recorder app. 

----------

## How It Works

1.  **Audio Recording:**  
    The app uses the [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder) to capture audio from your microphone. It determines a supported audio MIME type and saves the recording as an audio file.
    
2.  **Real-Time Transcription:**  
    With the [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API), the application continuously transcribes your speech. Timestamps are added automatically for clarity, and you have the option to edit the transcription before saving.
    
3.  **File Downloads:**  
    When you click the **Save Recording** button, both the audio file and a plain-text transcription are generated and automatically downloaded to your device.

----------

## Contributing

Contributions, feedback, or suggestions are welcome. To contribute:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Submit a pull request with a clear description of your changes.