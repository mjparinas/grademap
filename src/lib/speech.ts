"use client";

// Read-aloud with the device's own voices (Web Speech API), so it works offline
// and costs nothing. Voice quality varies hugely between devices, so we rank the
// installed voices and pick the most natural one; parents can choose another in
// Settings (saved per device, because every device has different voices).

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
const APPLE_GOOD = /\b(samantha|ava|allison|susan|zoe|karen|moira|tessa|daniel|serena|evan|nathan|tom|alex|nicky|aaron|martha|arthur)\b/i;

const LOCALE_BONUS: Record<string, number> = { "en-ca": 12, "en-us": 8, "en-gb": 6, "en-au": 6, "en-nz": 6, "en-ie": 6 };

/** Scores one voice, or undefined if it shouldn't be offered at all. */
export function scoreVoice(v: VoiceLike): VoiceOption | undefined {
  const lang = v.lang.replace("_", "-").toLowerCase();
  if (!lang.startsWith("en") || NOVELTY.test(v.name)) return undefined;
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
export function rankVoices(voices: readonly VoiceLike[]): VoiceOption[] {
  return voices
    .map(scoreVoice)
    .filter((o): o is VoiceOption => !!o)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}

/** The voice to use: the parent's choice if it can play now, otherwise the best one that can. */
export function chooseVoice(ranked: readonly VoiceOption[], preferredUri: string | null, offline: boolean): VoiceOption | undefined {
  const playable = (o: VoiceOption) => !(offline && o.online);
  const preferred = preferredUri ? ranked.find((o) => o.uri === preferredUri) : undefined;
  if (preferred && playable(preferred)) return preferred;
  return ranked.find(playable) ?? ranked[0];
}

// ---- Browser state ----

const PREF_KEY = "grademap.voice";
const EMPTY: VoiceOption[] = [];
let ranked: VoiceOption[] = EMPTY;
const listeners = new Set<() => void>();

export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function refresh() {
  if (!canSpeak()) return;
  ranked = rankVoices(window.speechSynthesis.getVoices());
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

export function getVoiceOptions(): VoiceOption[] {
  watch();
  return ranked;
}

export function getVoicePreference(): string | null {
  try {
    return localStorage.getItem(PREF_KEY);
  } catch {
    return null;
  }
}

/** null = automatic (best available). Saved on this device only. */
export function setVoicePreference(uri: string | null) {
  try {
    if (uri) localStorage.setItem(PREF_KEY, uri);
    else localStorage.removeItem(PREF_KEY);
  } catch {
    // Private mode: the choice just won't stick.
  }
  for (const l of listeners) l();
}

/** The voice read-aloud will use right now (for showing in Settings). */
export function currentVoice(): VoiceOption | undefined {
  watch();
  return chooseVoice(ranked, getVoicePreference(), typeof navigator !== "undefined" && navigator.onLine === false);
}

/** Turn on-screen symbols into words a speech engine reads naturally. */
function forSpeech(text: string): string {
  return text
    .replace(/☐/g, " blank ")
    .replace(/(\d+)¢/g, "$1 cents")
    .replace(/−/g, " minus ")
    .replace(/_{2,}/g, " blank ")
    .replace(/\s+/g, " ")
    .trim();
}

function utter(text: string, option: VoiceOption | undefined, onFail?: () => void) {
  const synth = window.speechSynthesis;
  const u = new SpeechSynthesisUtterance(forSpeech(text));
  const voice = option ? synth.getVoices().find((v) => v.voiceURI === option.uri) : undefined;
  if (voice) u.voice = voice;
  u.lang = voice?.lang ?? "en-CA";
  // A touch slower than normal for young listeners; natural pitch (raising it makes good voices sound processed).
  u.rate = 0.92;
  u.pitch = 1;
  if (onFail) {
    u.onerror = (e) => {
      if (e.error !== "interrupted" && e.error !== "canceled") onFail();
    };
  }
  synth.speak(u);
}

export function speak(text: string, voiceUri?: string | null) {
  if (!canSpeak()) return;
  watch();
  window.speechSynthesis.cancel();
  const offline = navigator.onLine === false;
  const choice = chooseVoice(ranked, voiceUri !== undefined ? voiceUri : getVoicePreference(), offline);
  // A cloud voice can fail on a flaky connection: try again with the best on-device voice.
  const fallback = choice?.online ? chooseVoice(ranked, null, true) : undefined;
  utter(text, choice, fallback && fallback.uri !== choice?.uri ? () => utter(text, fallback) : undefined);
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel();
}

/** A short sample for the voice picker. */
export function previewVoice(uri: string | null) {
  speak("Hi! I'm Ollie the Otter. Let's count together: one, two, three. Great job!", uri);
}
