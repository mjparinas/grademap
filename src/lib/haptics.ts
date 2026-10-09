"use client";

// Light taps and buzzes on phones and tablets, through the Web Vibration API.
// Android browsers support it. iOS and iPadOS Safari do not, so there it quietly does nothing.

// The store says whether the active child has vibration on. It's injected rather than
// imported so public pages don't load the store.
let hapticsOn: () => boolean = () => true;
export function setHapticsCheck(check: () => boolean) {
  hapticsOn = check;
}

type Pattern = number | number[];

/** Short, gentle patterns in milliseconds (vibrate, pause, vibrate, ...). */
export const buzz = {
  tap: 8,
  correct: [10, 40, 18],
  tryAgain: 28,
  pop: 10,
} satisfies Record<string, Pattern>;

export function vibrate(pattern: Pattern) {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
  if (!hapticsOn()) return;
  // Vibration is motion too: respect the device's reduced-motion setting.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    // Some browsers throw when vibration is blocked; it is only a nicety.
  }
}
