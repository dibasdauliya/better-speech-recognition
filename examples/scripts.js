import { createSpeechRecognition, isSupported } from "../dist/index.esm.js";

const finalElement = document.getElementById("final");
const interimElement = document.getElementById("interim");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");
const languageSelect = document.getElementById("language");
const statusElement = document.getElementById("status");

if (!isSupported()) {
  document.getElementById("result").innerHTML =
    '<p style="color: red">Speech recognition is not supported in your browser.</p>';
  startBtn.disabled = true;
  stopBtn.disabled = true;
  resetBtn.disabled = true;
  languageSelect.disabled = true;
  statusElement.textContent = "Speech recognition not supported";
} else {
  let recognition = createSpeechRecognition({
    continuous: true,
    interimResults: true,
  });

  recognition.onResult = ({
    finalTranscript,
    interimTranscript,
    completeTranscript,
  }) => {
    if (finalTranscript) {
      finalElement.textContent = completeTranscript;
    }
    interimElement.textContent = interimTranscript;
  };

  recognition.onStart = () => {
    startBtn.disabled = true;
    stopBtn.disabled = false;
    statusElement.textContent = "Listening...";
  };

  recognition.onEnd = () => {
    startBtn.disabled = false;
    stopBtn.disabled = true;
    statusElement.textContent = "Ready to start";
  };

  recognition.onError = (event) => {
    console.error("Speech recognition error", event);
    statusElement.textContent = `Error: ${event.error}`;
    startBtn.disabled = false;
    stopBtn.disabled = true;
  };

  startBtn.addEventListener("click", () => {
    recognition.start();
  });

  stopBtn.addEventListener("click", () => {
    recognition.stop();
  });

  resetBtn.addEventListener("click", () => {
    recognition.reset();
    finalElement.textContent = "";
    interimElement.textContent = "";
  });

  languageSelect.addEventListener("change", (e) => {
    const language = e.target.value;
    recognition.setLanguage(language);
    statusElement.textContent = `Language set to ${language}`;
  });
}
