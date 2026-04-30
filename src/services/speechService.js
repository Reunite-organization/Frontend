class SpeechService {
  constructor() {
    this.recognition = null;
    this.synthesis = null;
    this.isListening = false;
    this.isSpeaking = false;
    this.currentLanguage = "en-US"; 
    this.onResult = null;
    this.onError = null;
    this.onStart = null;
    this.onEnd = null;

    this.initializeSpeechRecognition();
    this.initializeSpeechSynthesis();
  }

  initializeSpeechRecognition() {
    // Check for browser support
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser");
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = this.currentLanguage;

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.onStart) this.onStart();
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (this.onResult) this.onResult(transcript);
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      if (this.onError) this.onError(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onEnd) this.onEnd();
    };
  }

  initializeSpeechSynthesis() {
    if (!("speechSynthesis" in window)) {
      console.warn("Speech synthesis not supported in this browser");
      return;
    }

    this.synthesis = window.speechSynthesis;
  }

  setLanguage(language) {
    const normalizedLanguage = this.normalizeLanguageCode(language);
    this.currentLanguage = normalizedLanguage;
    if (this.recognition) {
      this.recognition.lang = normalizedLanguage;
    }
  }

  startListening(onResult, onError, onStart, onEnd) {
    if (!this.recognition) {
      if (onError) onError("not_supported");
      return false;
    }

    if (this.isListening) {
      this.stopListening();
    }

    this.onResult = onResult;
    this.onError = onError;
    this.onStart = onStart;
    this.onEnd = onEnd;

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      if (onError) onError("start_failed");
      return false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  speak(text, language = null, onEnd = null) {
    if (!this.synthesis) {
      console.warn("Speech synthesis not available");
      return false;
    }

    // Stop any current speech
    this.stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);

    // Set language if provided
    if (language) {
      utterance.lang = language;
    } else {
      utterance.lang = this.currentLanguage;
    }

    // Set voice preferences based on language
    const voices = this.synthesis.getVoices();
    if (language?.startsWith("am") || utterance.lang.startsWith("am")) {
      // Prefer Amharic voices if available
      const amharicVoice = voices.find((voice) => voice.lang.includes("am"));
      if (amharicVoice) {
        utterance.voice = amharicVoice;
      }
    }

    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;
    utterance.volume = 0.8;

    if (onEnd) {
      utterance.onend = onEnd;
    }

    this.isSpeaking = true;
    this.synthesis.speak(utterance);

    return true;
  }

  stopSpeaking() {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.cancel();
      this.isSpeaking = false;
    }
  }

  isSupported() {
    return (
      !!(window.SpeechRecognition || window.webkitSpeechRecognition) &&
      !!("speechSynthesis" in window)
    );
  }

  getAvailableVoices() {
    if (!this.synthesis) return [];
    return this.synthesis.getVoices();
  }

  normalizeLanguageCode(language) {
    const lang = (language || "en-US").toLowerCase();

    if (lang.startsWith("en")) return "en-US";
    if (lang.startsWith("am")) return "am-ET";
    if (lang.startsWith("om") || lang.startsWith("orm")) return "om-ET";

    return "en-US";
  }

  // Utility method to detect language from text
  detectLanguage(text) {
    const amharicChars = /[\u1200-\u137F]/;
    const hasAmharic = amharicChars.test(text);
    if (hasAmharic) {
      return "am-ET";
    }


    const oromoKeywords = /\b(namni|dhabe|beeksisa|dhaabbata|magaalaa)\b/i;
    if (oromoKeywords.test(text)) {
      return "om-ET";
    }

    // Default to English
    return "en-US";
  }
}

// Export singleton instance
const speechService = new SpeechService();
export default speechService;
