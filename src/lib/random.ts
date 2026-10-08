import type { Choice, ChoiceQuestion, Visual } from "./types";

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function shuffle<T>(items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Pick `count` distinct items. */
export function sample<T>(items: readonly T[], count: number): T[] {
  return shuffle(items).slice(0, count);
}

/**
 * Wrong answers near `answer`, never equal to it and within [min, max].
 * Falls back to wider offsets when the range is tight.
 */
export function nearbyNumbers(answer: number, count: number, min = 0, max = 100): number[] {
  const out = new Set<number>();
  const offsets = shuffle([1, -1, 2, -2, 10, -10, 3, -3, 5, -5, 4, -4, 6, -6]);
  for (const offset of offsets) {
    if (out.size >= count) break;
    const n = answer + offset;
    if (n >= min && n <= max && n !== answer) out.add(n);
  }
  for (let n = min; out.size < count && n <= max; n++) {
    if (n !== answer) out.add(n);
  }
  return [...out];
}

/** A multiple-choice question whose answers are numbers. */
export function numberChoice(
  prompt: string,
  answer: number,
  hint: string,
  visual?: Visual,
  opts: { min?: number; max?: number; count?: number; suffix?: string } = {},
): ChoiceQuestion {
  const { min = 0, max = 100, count = 3, suffix = "" } = opts;
  const options = shuffle([answer, ...nearbyNumbers(answer, count - 1, min, max)]);
  return {
    kind: "choice",
    prompt,
    hint,
    visual,
    answer: String(answer),
    choices: options.map((n) => ({ id: String(n), label: `${n}${suffix}` })),
  };
}

/** A multiple-choice question from labelled options; the first option is correct. */
export function textChoice(
  prompt: string,
  correct: Omit<Choice, "id"> | string,
  wrong: (Omit<Choice, "id"> | string)[],
  hint: string,
  visual?: Visual,
): ChoiceQuestion {
  const toChoice = (c: Omit<Choice, "id"> | string, i: number): Choice =>
    typeof c === "string" ? { id: `c${i}`, label: c } : { id: `c${i}`, ...c };
  const all = [correct, ...wrong].map(toChoice);
  return {
    kind: "choice",
    prompt,
    hint,
    visual,
    answer: all[0].id,
    choices: shuffle(all),
  };
}
