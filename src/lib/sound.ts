"use client";

import { useStore } from "./store";

// Small synthesized sounds, so there are no audio files to download.
// Pitches vary a little each time so repeated taps never sound robotic.

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!useStore.getState().settings.sound) return null;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function vary(freq: number, amount = 0.06): number {
  return freq * (1 + (Math.random() * 2 - 1) * amount);
}

function tone(
  freq: number,
  start: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.18,
  slideTo?: number,
) {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime + start;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + duration);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}

/** C major pentatonic, so any sequence of these sounds pleasant. */
const SCALE = [523, 587, 659, 784, 880, 1047, 1175, 1319, 1568];

export const sounds = {
  tap: () => tone(vary(620, 0.12), 0, 0.07, "triangle", 0.07, vary(820, 0.1)),
  correct: (streak = 0) => {
    const base = Math.min(streak, 4);
    tone(SCALE[base], 0, 0.16);
    tone(SCALE[base + 2], 0.08, 0.18);
    tone(SCALE[base + 4], 0.16, 0.3);
  },
  // Soft and low: a nudge, not a buzzer.
  tryAgain: () => {
    tone(392, 0, 0.16, "triangle", 0.11);
    tone(330, 0.12, 0.22, "triangle", 0.09);
  },
  /** A coin landing in the purse. */
  clink: () => {
    tone(vary(1900, 0.05), 0, 0.12, "square", 0.035);
    tone(vary(2600, 0.05), 0.03, 0.18, "sine", 0.06);
  },
  /** A block snapping into place. */
  clack: () => tone(vary(300, 0.1), 0, 0.09, "square", 0.05, 180),
  /** Rising pop: pass an index to climb the scale, e.g. while filling slots. */
  pop: (step = 0) => tone(SCALE[Math.min(step, SCALE.length - 1)], 0, 0.14, "sine", 0.13, SCALE[Math.min(step, SCALE.length - 1)] * 1.25),
  whoosh: () => tone(vary(240, 0.1), 0, 0.22, "sine", 0.06, 900),
  /** One per star on the finish screen: pitch climbs with each. */
  starLand: (i: number) => {
    tone(SCALE[2 + i * 2], 0, 0.25, "triangle", 0.15);
    tone(110, 0, 0.12, "sine", 0.2, 60);
  },
  complete: () => {
    [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.1, 0.35, "sine", 0.15));
  },
};
