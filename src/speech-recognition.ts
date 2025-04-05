import {
  RecognitionResultCallback,
  SpeechRecognitionErrorEvent,
  SpeechRecognitionEvent,
  SpeechRecognitionInstance,
  SpeechRecognitionOptions,
} from "./types";

class BetterSpeechRecognition {
  private options: SpeechRecognitionOptions;
  private recognition: SpeechRecognitionInstance;
  private isListening: boolean;
  private transcript: string;
  private interimTranscript: string;

  public onResult: ((result: RecognitionResultCallback) => void) | null;
  public onStart: ((event: Event) => void) | null;
  public onEnd: ((event: Event) => void) | null;
  public onError: ((event: SpeechRecognitionErrorEvent) => void) | null;

  constructor(options: SpeechRecognitionOptions = {}) {
    // Default options
    this.options = {
      continuous: true,
      interimResults: true,
      language: "en-US",
      ...options,
    };

    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      throw new Error("Speech recognition is not supported in this browser");
    }

    const SpeechRecognitionImpl =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionImpl) {
      throw new Error("Speech recognition is not supported in this browser");
    }

    this.recognition = new SpeechRecognitionImpl();
    this.recognition.continuous = Boolean(this.options.continuous);
    this.recognition.interimResults = Boolean(this.options.interimResults);
    this.recognition.lang = this.options.language || "en-US";

    this.isListening = false;
    this.transcript = "";
    this.interimTranscript = "";

    this.onResult = null;
    this.onStart = null;
    this.onEnd = null;
    this.onError = null;

    this._bindEventListeners();
  }

  private _bindEventListeners(): void {
    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      this.transcript += ` ${finalTranscript}`;
      this.interimTranscript = interimTranscript;

      if (this.onResult) {
        this.onResult({
          finalTranscript,
          interimTranscript,
          completeTranscript: this.transcript,
          event,
        });
      }
    };

    this.recognition.onstart = (event: Event) => {
      this.isListening = true;
      if (this.onStart) this.onStart(event);
    };

    this.recognition.onend = (event: Event) => {
      this.isListening = false;
      if (this.onEnd) this.onEnd(event);

      if (this.options.continuous && this.isListening) {
        this.recognition.start();
      }
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (this.onError) this.onError(event);
    };
  }

  public start(): BetterSpeechRecognition {
    if (!this.isListening) {
      this.recognition.start();
      this.isListening = true;
    }
    return this;
  }

  public stop(): BetterSpeechRecognition {
    if (this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
    return this;
  }

  public reset(): BetterSpeechRecognition {
    this.transcript = "";
    this.interimTranscript = "";
    return this;
  }

  public setLanguage(language: string): BetterSpeechRecognition {
    this.options.language = language;
    this.recognition.lang = language;
    return this;
  }
}

export default BetterSpeechRecognition;
