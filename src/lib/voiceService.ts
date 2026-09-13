import type { LanguageCode } from "./types";

/**
 * voiceService abstracts speech-to-text and text-to-speech so a real
 * provider (e.g. a hosted ASR/TTS pipeline) can replace the browser
 * Web Speech API implementation later without touching UI code. It also
 * picks the most natural available Indian-language voice for each
 * locale and applies a "voice style" (warm vs. bold/filmy) on top of it.
 */

export type VoiceStyle = "warm" | "bold";

const localeMap: Record<LanguageCode, string> = {
  en: "en-IN",
  hi: "hi-IN",
  ta: "ta-IN",
  te: "te-IN",
  kn: "kn-IN",
  ml: "ml-IN",
};

// Known Indian-locale voice names shipped by common browsers/OSes, used to
// rank candidates when several voices share a language prefix.
const INDIAN_VOICE_HINTS = [
  "india",
  "indian",
  "ravi",
  "rishi",
  "hemant",
  "prabhat",
  "veena",
  "heera",
  "lekha",
  "swara",
  "neerja",
  "priya",
];

const BOLD_VOICE_HINTS = ["ravi", "rishi", "hemant", "prabhat", "male"];
const WARM_VOICE_HINTS = ["veena", "heera", "lekha", "swara", "neerja", "priya", "female"];

export interface RecognitionResult {
  transcript: string;
  isFinal: boolean;
}

export interface VoiceServiceCallbacks {
  onResult?: (result: RecognitionResult) => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  onStart?: () => void;
}

type SpeechRecognitionCtor = new () => SpeechRecognition;

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export function isVoiceSupported(): boolean {
  return getRecognitionCtor() !== null;
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

let cachedVoices: SpeechSynthesisVoice[] = [];
let voicesRequested = false;

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (!isSpeechSynthesisSupported()) return Promise.resolve([]);
  const existing = window.speechSynthesis.getVoices();
  if (existing.length > 0) {
    cachedVoices = existing;
    return Promise.resolve(existing);
  }
  if (voicesRequested) return Promise.resolve(cachedVoices);
  voicesRequested = true;
  return new Promise((resolve) => {
    const onVoicesChanged = () => {
      cachedVoices = window.speechSynthesis.getVoices();
      window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
      resolve(cachedVoices);
    };
    window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
    // Some browsers never fire the event if voices were already cached elsewhere.
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 400);
  });
}

function scoreVoice(voice: SpeechSynthesisVoice, targetLang: string, style: VoiceStyle): number {
  let score = 0;
  const lang = voice.lang.toLowerCase();
  const name = voice.name.toLowerCase();
  const targetPrefix = targetLang.split("-")[0];

  if (lang === targetLang.toLowerCase()) score += 6;
  else if (lang.startsWith(targetPrefix)) score += 3;
  else return -1; // wrong language entirely, never usable

  if (INDIAN_VOICE_HINTS.some((h) => name.includes(h)) || lang.endsWith("-in")) score += 4;

  const styleHints = style === "bold" ? BOLD_VOICE_HINTS : WARM_VOICE_HINTS;
  if (styleHints.some((h) => name.includes(h))) score += 2;

  if (voice.localService) score += 1;
  return score;
}

async function pickVoice(language: LanguageCode, style: VoiceStyle): Promise<SpeechSynthesisVoice | null> {
  const voices = await loadVoices();
  const target = localeMap[language];
  const ranked = voices
    .map((v) => ({ voice: v, score: scoreVoice(v, target, style) }))
    .filter((v) => v.score >= 0)
    .sort((a, b) => b.score - a.score);
  return ranked[0]?.voice ?? null;
}

class VoiceService {
  private recognition: SpeechRecognition | null = null;
  private listening = false;

  startListening(language: LanguageCode, callbacks: VoiceServiceCallbacks) {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      callbacks.onError?.("unsupported");
      return;
    }
    try {
      const recognition = new Ctor();
      recognition.lang = localeMap[language];
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        this.listening = true;
        callbacks.onStart?.();
      };
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const last = event.results[event.results.length - 1];
        callbacks.onResult?.({ transcript: last[0].transcript, isFinal: last.isFinal });
      };
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        callbacks.onError?.(event.error || "unknown");
      };
      recognition.onend = () => {
        this.listening = false;
        callbacks.onEnd?.();
      };

      this.recognition = recognition;
      recognition.start();
    } catch {
      callbacks.onError?.("unsupported");
    }
  }

  stopListening() {
    this.recognition?.stop();
    this.listening = false;
  }

  isListening() {
    return this.listening;
  }

  async speak(
    text: string,
    language: LanguageCode,
    rate: "slow" | "normal" | "fast" = "normal",
    style: VoiceStyle = "warm"
  ) {
    if (!isSpeechSynthesisSupported()) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = localeMap[language];

    const baseRate = rate === "slow" ? 0.82 : rate === "fast" ? 1.15 : 0.95;
    if (style === "bold") {
      // Deeper, slightly slower, more deliberate — a confident "filmy" narrator tone.
      utterance.rate = baseRate * 0.9;
      utterance.pitch = 0.78;
    } else {
      utterance.rate = baseRate;
      utterance.pitch = 1.02;
    }

    const voice = await pickVoice(language, style);
    if (voice) utterance.voice = voice;

    window.speechSynthesis.speak(utterance);
  }

  stopSpeaking() {
    if (isSpeechSynthesisSupported()) window.speechSynthesis.cancel();
  }
}

export const voiceService = new VoiceService();
