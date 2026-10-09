// The Konami code: up up down down left right left right B A.
// On a keyboard it's the arrow keys, then B and A. On a touch screen it's eight
// swipes (same order), then two taps standing in for B and A.

export type KonamiStep = "up" | "down" | "left" | "right" | "b" | "a";

export const KONAMI: KonamiStep[] = ["up", "up", "down", "down", "left", "right", "left", "right", "b", "a"];

export const SWIPE_MIN = 40;
export const TAP_MAX = 10;

const KEYS: Record<string, KonamiStep> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  b: "b",
  a: "a",
};

export function stepForKey(key: string): KonamiStep | null {
  return KEYS[key.length === 1 ? key.toLowerCase() : key] ?? null;
}

/** A swipe's direction, or null for something in between a tap and a swipe. */
export function stepForGesture(dx: number, dy: number): KonamiStep | null {
  const ax = Math.abs(dx);
  const ay = Math.abs(dy);
  if (Math.max(ax, ay) < SWIPE_MIN) return null;
  if (ax > ay * 1.5) return dx > 0 ? "right" : "left";
  if (ay > ax * 1.5) return dy > 0 ? "down" : "up";
  return null;
}

const endsWith = (recent: KonamiStep[], prefix: KonamiStep[]) =>
  recent.length >= prefix.length && prefix.every((x, i) => recent[recent.length - prefix.length + i] === x);

/** Feeds steps in; returns true when the last ten steps are the whole code. */
export function createKonamiMatcher() {
  let recent: KonamiStep[] = [];
  return (input: KonamiStep | "tap"): boolean => {
    // A touch tap stands in for B, or for A when B has just been entered.
    const step: KonamiStep = input === "tap" ? (endsWith(recent, KONAMI.slice(0, 9)) ? "a" : "b") : input;
    recent = [...recent, step].slice(-KONAMI.length);
    return endsWith(recent, KONAMI);
  };
}
