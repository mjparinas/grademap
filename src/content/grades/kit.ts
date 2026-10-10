import { sortQuestion, type SortSet } from "../bank";
import { pick, randInt, sample, shuffle, textChoice } from "../random";
import type { ChoiceQuestion, GenerateOptions, InputQuestion, OrderQuestion, Question, Visual } from "../types";

// Small helpers shared by the Grade 8 and Grade 9 content: difficulty levels,
// hand-written multiple-choice items, and the number formatting maths units need.

export type Level = 1 | 2 | 3;
export const levelOf = (opts?: GenerateOptions): Level => opts?.difficulty ?? 2;

export const NAMES = ["Maya", "Jay", "Sam", "Amir", "Lena", "Kenji", "Zoe", "Ravi", "Ana", "Noah", "Priya", "Leo", "Mei", "Omar", "Tessa", "Kofi"];

// ---------- Hand-written multiple choice ----------

/** A multiple-choice item with a difficulty level. The first answer (`right`) is correct. */
export interface Item {
  level: Level;
  prompt: string;
  right: string;
  wrong: string[];
  hint: string;
  visual?: Visual;
}

/** Shorthand for writing an item on one or two lines. */
export function q(level: Level, prompt: string, right: string, wrong: string[], hint: string, visual?: Visual): Item {
  return { level, prompt, right, wrong, hint, visual };
}

/** An item that shows a short excerpt or statement in a reading box above the question. */
export function qe(level: Level, text: string, prompt: string, right: string, wrong: string[], hint: string): Item {
  return q(level, prompt, right, wrong, hint, { type: "passage", paragraphs: [text] });
}

/** Up to 4 wrong answers, so there are never more than 5 choices. */
export function ask(item: Omit<Item, "level">): ChoiceQuestion {
  return textChoice(item.prompt, item.right, sample(item.wrong, Math.min(4, item.wrong.length)), item.hint, item.visual);
}

/** Pick `count` items: mostly at `level`, the rest from neighbouring levels. */
export function choose<T extends { level: Level }>(items: readonly T[], level: Level, count: number): T[] {
  const main = shuffle(items.filter((i) => i.level === level));
  const near = shuffle(items.filter((i) => Math.abs(i.level - level) === 1));
  const take = Math.min(main.length, Math.ceil(count * 0.65));
  const picked = [...main.slice(0, take), ...near.slice(0, count - take)];
  if (picked.length < count) {
    picked.push(...shuffle(items.filter((i) => !picked.includes(i))).slice(0, count - picked.length));
  }
  return shuffle(picked);
}

/** Two-basket sorts: 3 per basket at difficulty 1, 4 per basket at 2 and 3. */
export const perBin = (level: Level): number => (level === 1 ? 3 : 4);

export interface UnitParts {
  items: Item[];
  /** Sort sets: one is used per round. */
  sorts?: SortSet[];
  /** Ordering questions: one is used per round. */
  orders?: ((level: Level) => OrderQuestion)[];
}

/** Builds 8 questions from a unit's bank: one sort and one ordering question when the unit has them. */
export function fromParts(parts: UnitParts, opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const extras: Question[] = [];
  if (parts.sorts?.length) {
    const set = pick(parts.sorts);
    // Sorts show at most 8 items, so three baskets get fewer items each.
    extras.push(sortQuestion(set, Math.min(perBin(level), Math.floor(8 / set.bins.length))));
  }
  if (parts.orders?.length) extras.push(pick(parts.orders)(level));
  const mc = choose(parts.items, level, 8 - extras.length).map(ask);
  return shuffle([...mc, ...extras]);
}

/** Keep `n` of the events (listed in the correct order), still in order. */
export function keepInOrder<T>(events: T[], n: number): T[] {
  const idx = sample(
    events.map((_, i) => i),
    n,
  ).sort((a, b) => a - b);
  return idx.map((i) => events[i]);
}

/** An ordering question built from a list that is already in the right order. */
export function orderOf(prompt: string, hint: string, events: { id: string; label: string; emoji?: string }[]) {
  return (level: Level): OrderQuestion => {
    const kept = keepInOrder(events, Math.min(events.length, level + 2));
    return { kind: "order", prompt, hint, items: kept };
  };
}

// ---------- Number helpers for maths ----------

/** Tidy number text: 0.1 + 0.2 → "0.3", −0 → "0". Negatives use "-" so keypads and tests can read them. */
export function fmt(x: number): string {
  const v = Number(x.toFixed(6));
  return String(v === 0 ? 0 : v);
}

/** A number placed inside an expression: negatives get brackets, e.g. 5 − (-3). */
export const br = (x: number): string => (x < 0 ? `(${fmt(x)})` : fmt(x));

/** Round half up to `dp` decimal places (for positive measurements). */
export function roundTo(x: number, dp: number): number {
  const f = 10 ** dp;
  return Math.round(x * f + 1e-7) / f;
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

/** A fraction in lowest terms: (6, 8) → "3/4"; whole numbers lose the "/1". */
export function frac(n: number, d: number): string {
  const g = gcd(n, d);
  const [a, b] = [n / g, d / g];
  return b === 1 ? String(a) : `${a}/${b}`;
}

/** A fraction in lowest terms, always written with a denominator and a proper sign: (-6, 8) → "-3/4". */
export function fracText(n: number, d: number): string {
  const sign = n * d < 0 ? "-" : "";
  return `${sign}${frac(Math.abs(n), Math.abs(d))}`;
}

/** Lowest-terms mixed number as text: (11, 4) → "2 3/4". */
export function mixed(n: number, d: number): string {
  const g = gcd(n, d);
  [n, d] = [n / g, d / g];
  const whole = Math.floor(n / d);
  const rem = n % d;
  if (rem === 0) return String(whole);
  return whole === 0 ? `${rem}/${d}` : `${whole} ${rem}/${d}`;
}

const SUP: Record<string, string> = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻" };
/** Superscript digits for exponents: sup(-3) → "⁻³". */
export const sup = (n: number): string => String(n).replace(/./g, (c) => SUP[c] ?? c);

/** A non-zero integer whose size is between min and max, with a random sign. */
export function signed(min: number, max: number): number {
  const n = randInt(min, max);
  return rand01() ? -n : n;
}
const rand01 = (): boolean => randInt(0, 1) === 1;

export const range = (a: number, b: number): number[] => Array.from({ length: b - a + 1 }, (_, i) => a + i);

/** A linear expression: lin(3, 2) → "3n + 2", lin(-2, -5, "x") → "-2x − 5", lin(1, 0) → "n". */
export function lin(m: number, b: number, v = "n"): string {
  const term = m === 1 ? v : m === -1 ? `-${v}` : `${m}${v}`;
  if (b === 0) return term;
  return `${term} ${b < 0 ? "−" : "+"} ${Math.abs(b)}`;
}

export const money = (cents: number): string => `$${(cents / 100).toFixed(2)}`;

interface NumOpts {
  unit?: string;
  format?: (n: number) => string;
  step?: number;
  min?: number;
  count?: number;
}

/**
 * Multiple choice with number answers. Wrong answers that clash with the answer
 * (or each other) are skipped; any gaps are filled with nearby values.
 */
export function numQ(prompt: string, answer: number, wrong: number[], hint: string, visual?: Visual, opts: NumOpts = {}): ChoiceQuestion {
  const { unit = "", format = fmt, step = 1, min = -Infinity, count = 4 } = opts;
  const label = (n: number) => `${format(n)}${unit}`;
  const right = label(answer);
  const used = new Set([right]);
  const out: string[] = [];
  const tryAdd = (n: number) => {
    if (out.length >= count - 1 || !Number.isFinite(n) || n < min) return;
    const l = label(Number(n.toFixed(6)));
    if (!used.has(l)) {
      used.add(l);
      out.push(l);
    }
  };
  wrong.forEach(tryAdd);
  for (let k = 1; out.length < count - 1 && k < 200; k++) {
    tryAdd(answer + k * step);
    tryAdd(answer - k * step);
  }
  return textChoice(prompt, right, out, hint, visual);
}

/** Multiple choice where every option is text (an expression, a fraction). Duplicates and the answer are removed from `wrong`. */
export function textQ(prompt: string, right: string, wrong: string[], hint: string, visual?: Visual): ChoiceQuestion {
  const seen = new Set([right]);
  const clean = wrong.filter((w) => (seen.has(w) ? false : (seen.add(w), true)));
  return textChoice(prompt, right, clean.slice(0, 4), hint, visual);
}

/** A typed-answer question. */
export function typed(
  prompt: string,
  answer: string,
  hint: string,
  keypad: NonNullable<InputQuestion["keypad"]>,
  extra: { accept?: string[]; suffix?: string; visual?: Visual } = {},
): InputQuestion {
  const q: InputQuestion = { kind: "input", prompt, hint, answer, keypad };
  const accept = [...new Set(extra.accept ?? [])].filter((a) => a !== answer);
  if (accept.length) q.accept = accept;
  if (extra.suffix) q.suffix = extra.suffix;
  if (extra.visual) q.visual = extra.visual;
  return q;
}

/** π × k using 3.14, rounded to one decimal place, plus sensible rounding variants. */
export function piAnswer(k: number): { exact: number; answer: string; accept: string[] } {
  const exact = Number((3.14 * k).toFixed(6));
  const answer = roundTo(exact, 1).toFixed(1);
  const accept = [fmt(exact), fmt(roundTo(exact, 2)), fmt(roundTo(Math.PI * k, 1)), fmt(roundTo(Math.PI * k, 2))];
  return { exact, answer, accept };
}

/** A concept item for maths, offered at the listed levels. */
export interface Concept {
  levels: Level[];
  prompt: string;
  right: string;
  wrong: string[];
  hint: string;
}

export function conceptQ(bank: Concept[], d: Level): ChoiceQuestion {
  const c = pick(bank.filter((b) => b.levels.includes(d)));
  return textChoice(c.prompt, c.right, c.wrong, c.hint);
}

export const ROUND_NOTE = "Use π ≈ 3.14 and round to 1 decimal place.";
