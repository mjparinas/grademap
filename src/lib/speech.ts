"use client";

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

let voice: SpeechSynthesisVoice | null | undefined;

function pickVoice(): SpeechSynthesisVoice | null {
  if (voice !== undefined) return voice;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  voice =
    voices.find((v) => v.lang === "en-CA") ??
    voices.find((v) => v.lang.startsWith("en") && /female|samantha|google/i.test(v.name)) ??
    voices.find((v) => v.lang.startsWith("en")) ??
    null;
  return voice;
}

export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text: string) {
  if (!canSpeak()) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(forSpeech(text));
  const v = pickVoice();
  if (v) u.voice = v;
  u.lang = v?.lang ?? "en-CA";
  u.rate = 0.9;
  u.pitch = 1.05;
  synth.speak(u);
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel();
}
