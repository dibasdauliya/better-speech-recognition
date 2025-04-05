import BetterSpeechRecognition from "./speech-recognition";

const isBrowser = typeof window !== "undefined";

/**
 * Checks if speech recognition is supported in the current environment
 * @returns boolean indicating if speech recognition is available
 */
export function isSupported(): boolean {
  return (
    isBrowser &&
    ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
  );
}

/**
 * Creates a speech recognition instance with the provided options
 * @param options Configuration options for speech recognition
 * @returns A configured BetterSpeechRecognition instance
 */
export function createSpeechRecognition(options?: {
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
}): BetterSpeechRecognition {
  if (!isSupported()) {
    throw new Error("Speech recognition is not supported in this environment");
  }
  return new BetterSpeechRecognition(options);
}

export { BetterSpeechRecognition };
