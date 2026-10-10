"use client";

import { getLocalVoiceSnapshot, isLocalVoiceEnabled, shouldUseLocalVoice, speakWithLocalVoice, stopLocalVoice } from "./localVoice";

// Read-aloud defaults to the device's own voices (Web Speech API), so it works
// offline and costs nothing. Parents can opt in to a cached local neural English
// model; French and the fallback continue to use installed device voices.

/** English is the app's language; French is for French Immersion and Core French questions. */
export type SpeechLanguage = "en" | "fr";

export type VoiceQuality = "natural" | "enhanced" | "standard" | "basic";

export interface VoiceOption {
  uri: string;
  name: string;
  lang: string;
  quality: VoiceQuality;
  /** Cloud voices (e.g. "Google US English") don't work offline. */
  online: boolean;
  score: number;
}

/** The parts of SpeechSynthesisVoice we use (so ranking can be tested without a browser). */
export interface VoiceLike {
  voiceURI: string;
  name: string;
  lang: string;
  localService: boolean;
  default: boolean;
}

// Apple's joke voices: never offer these for reading to kids.
const NOVELTY = /\b(albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|fred|junior|kathy|ralph)\b/i;
// Apple's older "Eloquence" voices: understandable but robotic.
const ELOQUENCE = /\b(eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley)\b/i;
// Apple's better standard voices.
const APPLE_GOOD = /\b(amélie|amelie|thomas|audrey|aurélie|aurelie|marie|jacques|nicolas|samantha|ava|allison|susan|zoe|karen|moira|tessa|daniel|serena|evan|nathan|tom|alex|nicky|aaron|martha|arthur)\b/i;

const LOCALE_BONUS: Record<string, number> = {
  "en-ca": 12, "en-us": 8, "en-gb": 6, "en-au": 6, "en-nz": 6, "en-ie": 6,
  "fr-ca": 12, "fr-fr": 8, "fr-be": 4, "fr-ch": 4,
};

/** Scores one voice, or undefined if it shouldn't be offered at all. */
export function scoreVoice(v: VoiceLike, language: SpeechLanguage = "en"): VoiceOption | undefined {
  const lang = v.lang.replace("_", "-").toLowerCase();
  if (!lang.startsWith(language) || NOVELTY.test(v.name)) return undefined;
  const id = `${v.name} ${v.voiceURI}`;
  let quality: VoiceQuality;
  let score: number;
  if (/natural|neural|premium/i.test(id)) [quality, score] = ["natural", 100];
  else if (/enhanced/i.test(id)) [quality, score] = ["enhanced", 70];
  else if (/google|network/i.test(id)) [quality, score] = ["enhanced", 60];
  else if (ELOQUENCE.test(v.name) || /espeak/i.test(id)) [quality, score] = ["basic", 0];
  else if (/microsoft/i.test(id) && !/online/i.test(id)) [quality, score] = ["basic", 10]; // old Windows desktop voices
  else if (APPLE_GOOD.test(v.name)) [quality, score] = ["standard", 40];
  else [quality, score] = ["standard", 30];
  score += LOCALE_BONUS[lang.slice(0, 5)] ?? 2;
  if (v.default) score += 3;
  return { uri: v.voiceURI, name: v.name, lang: v.lang, quality, online: !v.localService, score };
}

/** English voices, most natural first. Locale only breaks ties between similar voices. */
export function rankVoices(voices: readonly VoiceLike[], language: SpeechLanguage = "en"): VoiceOption[] {
  return voices
    .map((v) => scoreVoice(v, language))
    .filter((o): o is VoiceOption => !!o)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}

/** The voice to use: the parent's choice if it can play now, otherwise the best one that can. */
export function chooseVoice(ranked: readonly VoiceOption[], preferredUri: string | null, offline: boolean): VoiceOption | undefined {
  const playable = (o: VoiceOption) => !(offline && o.online);
  const preferred = preferredUri ? ranked.find((o) => o.uri === preferredUri) : undefined;
  if (preferred && playable(preferred)) return preferred;
  return ranked.find(playable);
}

// ---- Browser state ----

const PREF_KEY = "grademap.voice";
const PREF_KEY_FR = "grademap.voice.fr";
const prefKey = (language: SpeechLanguage) => (language === "fr" ? PREF_KEY_FR : PREF_KEY);
const EMPTY: VoiceOption[] = [];
let ranked: VoiceOption[] = EMPTY;
let rankedFr: VoiceOption[] = EMPTY;
const listeners = new Set<() => void>();

export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function refresh() {
  if (!canSpeak()) return;
  const voices = window.speechSynthesis.getVoices();
  ranked = rankVoices(voices);
  rankedFr = rankVoices(voices, "fr");
  for (const l of listeners) l();
}

let watching = false;
function watch() {
  if (watching || !canSpeak()) return;
  watching = true;
  // Many browsers load voices asynchronously (and some add cloud voices later).
  window.speechSynthesis.addEventListener?.("voiceschanged", refresh);
  refresh();
}

/** For useSyncExternalStore: the ranked voices on this device. */
export function subscribeVoices(listener: () => void): () => void {
  watch();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getVoiceOptions(language: SpeechLanguage = "en"): VoiceOption[] {
  watch();
  return language === "fr" ? rankedFr : ranked;
}

export function getVoicePreference(language: SpeechLanguage = "en"): string | null {
  try {
    return localStorage.getItem(prefKey(language));
  } catch {
    return null;
  }
}

/** null = automatic (best available). Saved on this device only. */
export function setVoicePreference(uri: string | null, language: SpeechLanguage = "en") {
  try {
    if (uri) localStorage.setItem(prefKey(language), uri);
    else localStorage.removeItem(prefKey(language));
  } catch {
    // Private mode: the choice just won't stick.
  }
  for (const l of listeners) l();
}

/** The voice read-aloud will use right now (for showing in Settings). */
export function currentVoice(language: SpeechLanguage = "en"): VoiceOption | undefined {
  watch();
  const offline = isLocalVoiceEnabled() || (typeof navigator !== "undefined" && navigator.onLine === false);
  return chooseVoice(language === "fr" ? rankedFr : ranked, getVoicePreference(language), offline);
}

/** Turn on-screen symbols into words a speech engine reads naturally. */
function forSpeech(text: string, language: SpeechLanguage = "en"): string {
  const blank = language === "fr" ? " mot manquant " : " blank ";
  return text
    .replace(/☐/g, blank)
    .replace(/(\d+)¢/g, "$1 cents")
    .replace(/−/g, " minus ")
    .replace(/_{2,}/g, blank)
    .replace(/\s+/g, " ")
    .trim();
}

function utter(text: string, option: VoiceOption | undefined, onFail?: () => void, language: SpeechLanguage = "en", onDone?: () => void) {
  const synth = window.speechSynthesis;
  const u = new SpeechSynthesisUtterance(forSpeech(text, language));
  const voice = option ? synth.getVoices().find((v) => v.voiceURI === option.uri) : undefined;
  if (voice) u.voice = voice;
  u.lang = voice?.lang ?? (language === "fr" ? "fr-CA" : "en-CA");
  // A touch slower than normal for young listeners; natural pitch (raising it makes good voices sound processed).
  u.rate = 0.92;
  u.pitch = 1;
  u.onend = () => onDone?.();
  u.onerror = (e) => {
    if (e.error === "interrupted" || e.error === "canceled") return;
    if (onFail) onFail();
    else onDone?.();
  };
  synth.speak(u);
}

function queue(text: string, voiceUri: string | null | undefined, language: SpeechLanguage, onDone?: () => void) {
  const localModel = shouldUseLocalVoice(language, isLocalVoiceEnabled(), getLocalVoiceSnapshot().state);
  const offline = isLocalVoiceEnabled() || navigator.onLine === false;
  if (localModel) {
    const sequence = run;
    void speakWithLocalVoice(forSpeech(text, language)).then((played) => {
      if (sequence !== run) return;
      if (played) onDone?.();
      else queueWithNativeVoice(text, voiceUri, language, onDone, true);
    }).catch(() => {
      if (sequence === run) queueWithNativeVoice(text, voiceUri, language, onDone, true);
    });
    return;
  }
  queueWithNativeVoice(text, voiceUri, language, onDone, offline);
}

function queueWithNativeVoice(text: string, voiceUri: string | null | undefined, language: SpeechLanguage, onDone: (() => void) | undefined, offline: boolean) {
  // English and French each have their own ranked list and saved choice.
  const list = language === "fr" ? rankedFr : ranked;
  const preferred = voiceUri !== undefined ? voiceUri : getVoicePreference(language);
  const choice = chooseVoice(list, preferred, offline);
  if (!choice) return;
  // A cloud voice can fail on a flaky connection: try again with the best on-device voice.
  const fallback = choice?.online ? chooseVoice(list, null, true) : undefined;
  utter(text, choice, fallback && fallback.uri !== choice?.uri ? () => utter(text, fallback, undefined, language, onDone) : undefined, language, onDone);
}

export function speak(text: string, voiceUri?: string | null, language: SpeechLanguage = "en") {
  if (!canSpeak()) return;
  watch();
  cancelAll();
  queue(text, voiceUri, language);
}

/** One piece of speech. `pause` is a gap of silence (ms) before it, which the speech engine has no way to ask for itself. */
export interface SpeechPiece {
  text: string;
  lang: SpeechLanguage;
  pause?: number;
}

// Bumped whenever speech is cancelled, so a sequence that is waiting on a pause or an utterance stops.
let run = 0;
let pauseTimer: ReturnType<typeof setTimeout> | undefined;

function cancelAll() {
  run++;
  clearTimeout(pauseTimer);
  window.speechSynthesis.cancel();
  stopLocalVoice();
}

/** Speaks pieces one after another, each in its own language, with optional pauses between them. */
export function speakSegments(segments: readonly SpeechPiece[]) {
  if (!canSpeak() || segments.length === 0) return;
  watch();
  cancelAll();
  const id = run;
  let i = 0;
  const next = () => {
    if (id !== run || i >= segments.length) return;
    const piece = segments[i++];
    const go = () => {
      if (id === run) queue(piece.text, undefined, piece.lang, next);
    };
    if (piece.pause) pauseTimer = setTimeout(go, piece.pause);
    else go();
  };
  next();
}

export function stopSpeaking() {
  if (canSpeak()) cancelAll();
}

/** A short sample for the voice picker. */
export function previewVoice(uri: string | null, language: SpeechLanguage = "en") {
  if (language === "fr") speak("Bonjour! Je m'appelle Ollie la loutre. Comptons ensemble : un, deux, trois. Bravo!", uri, "fr");
  else speak("Hi! I'm Ollie the Otter. Let's count together: one, two, three. Great job!", uri);
}
