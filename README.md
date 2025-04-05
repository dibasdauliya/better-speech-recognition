# Better Speech Recognition

[![npm version](https://img.shields.io/npm/v/better-speech-recognition.svg)](https://www.npmjs.com/package/better-speech-recognition)

An improved speech recognition library with TypeScript support, built on top of the Web Speech API.

## Features

- Real-time transcription with interim results
- Continuous recognition mode
- TypeScript support

## Installation

```bash
npm install better-speech-recognition
```

## Usage

### ES Modules

```javascript
import {
  createSpeechRecognition,
  isSupported,
} from "better-speech-recognition";

if (isSupported()) {
  const recognition = createSpeechRecognition({
    language: "en-US",
    continuous: true,
    interimResults: true,
  });

  recognition.onResult = ({
    finalTranscript,
    interimTranscript,
    completeTranscript,
  }) => {
    console.log("You said:", completeTranscript);
    console.log("Currently saying:", interimTranscript);
  };

  recognition.start();
}
```

### Browser via CDN

```html
<script src="https://cdn.jsdelivr.net/npm/better-speech-recognition@latest/dist/index.min.js"></script>

<script>
  if (BetterSpeechRecognition.isSupported()) {
    const recognition = BetterSpeechRecognition.createSpeechRecognition();

    recognition.onResult = function (result) {
      console.log("You said:", result.completeTranscript);
    };

    document.getElementById("startButton").onclick = function () {
      recognition.start();
    };
  }
</script>
```

## API Reference

### `isSupported()`

Checks if speech recognition is supported in the current environment.

```javascript
import { isSupported } from "better-speech-recognition";

if (isSupported()) {
  // Speech recognition is available
} else {
  // Speech recognition is not supported in this browser
}
```

### `createSpeechRecognition(options)`

Creates a new speech recognition instance with the given options.

#### Options

- `continuous` (boolean): Continue listening even after results. Default: `true`
- `interimResults` (boolean): Provide interim results. Default: `true`
- `language` (string): Recognition language. Default: `'en-US'`

### BetterSpeechRecognition Methods

- `start()`: Start recognition
- `stop()`: Stop recognition
- `reset()`: Clear all transcripts
- `setLanguage(language)`: Change recognition language

### Event Handlers

- `onResult`: Fired when results are available

  ```typescript
  recognition.onResult = ({
    finalTranscript,
    interimTranscript,
    completeTranscript,
    event,
  }) => {
    // Handle the recognition results
  };
  ```

- `onStart`: Fired when recognition starts
- `onEnd`: Fired when recognition ends
- `onError`: Fired when an error occurs

## Browser Compatibility

Visit [caniuse.com](https://caniuse.com/#feat=speech-recognition) for the latest compatibility information.

## License

MIT
