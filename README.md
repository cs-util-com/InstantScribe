# InstantScribe
Web based audio recorder that also transcribes the recorded conversations

# Main statement

## It can be faster (and more fun) to use ChatGPT to build an app for your needed workflow vs searching for and testing existing solutions

* **The challange**: I yesterday needed [a browser-based audio recorder with instant transcription](https://github.com/cs-util-com/InstantScribe/blob/main/index.html) locally without any data leaving the client.
* After 5 minutes of googling I decided to try generating a web app using ChatGPT instead and host it for myself on [github pages](https://pages.github.com/). 
* Within a [few iterations refining the requirements](https://github.com/cs-util-com/InstantScribe/commits/main/), I had a [working single html file with only a few 100 lines of js code](https://github.com/cs-util-com/InstantScribe/blob/main/index.html) that met all my requirements and was easy to further improve.
* As a bonus I learned a bit about javascript and some new browser APIs like the **Web Speech API** for transcription.

## App Usage

1. Open https://cs-util-com.github.io/InstantScribe/
2. Speak into your microphone; the app will transcribe your speech in real-time in addition to recording a normal audio file. 
3. Click **Save Recording** to end and save the audio file along with the transcription.

## Improvement suggestions

1. Fork https://github.com/cs-util-com/InstantScribe and ask ChatGPT to do them for you ;)