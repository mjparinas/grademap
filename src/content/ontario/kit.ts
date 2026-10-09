import { numberChoice, shuffle, textChoice } from "../random";
import type { GenerateOptions, InputQuestion, Question, Unit, Visual } from "../types";

// Small helpers shared by the Ontario units. The expectation codes in `on()` are
// checked against the official expectations in content.test.ts.

export type Level = 1 | 2 | 3;

/** 1 = easier, 2 = on level, 3 = stretch. */
export const levelOf = (opts?: GenerateOptions): Level => opts?.difficulty ?? 2;

/** Standards text for a unit: the expectation codes, then a short plain description. */
export function on(codes: string, text: string): Unit["standards"] {
  return { "ca-on": `${codes} · ${text}` };
}

export function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

export const eq = (text: string): Visual => ({ type: "equation", text });

/** Canadian number spacing: 12 345, with a regular space for read-aloud and the keypad kept plain. */
export function spaced(n: number): string {
  const s = String(Math.abs(n));
  const grouped = Math.abs(n) >= 10000 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : s;
  return n < 0 ? `−${grouped}` : grouped;
}

export function typeIn(prompt: string, answer: number | string, hint: string, visual?: Visual, extra: Partial<InputQuestion> = {}): InputQuestion {
  return { kind: "input", prompt, hint, visual, answer: String(answer), keypad: "number", ...extra };
}

/** What makes two questions "the same" for a child: prompt, picture and right answer. */
function questionKey(q: Question): string {
  const answer =
    q.kind === "choice"
      ? q.choices.find((c) => c.id === q.answer)?.label
      : q.kind === "input"
        ? q.answer
        : q.kind === "build" || q.kind === "coins"
          ? q.target
          : "";
  return `${q.prompt}#${JSON.stringify(q.visual ?? null)}#${answer}`;
}

export type Maker = () => Question;

/** `n` copies of a maker, for repeated question types. */
export const times = (n: number, make: Maker): Maker[] => Array.from({ length: n }, () => make);

/** Run each maker once, re-rolling any question that repeats one already in the set. */
export function buildSet(makers: Maker[]): Question[] {
  const out: Question[] = [];
  const seen = new Set<string>();
  for (const make of makers) {
    let q = make();
    for (let tries = 0; seen.has(questionKey(q)) && tries < 40; tries++) q = make();
    seen.add(questionKey(q));
    out.push(q);
  }
  return shuffle(out);
}

export const NAMES = ["Maya", "Jay", "Sam", "Amir", "Lena", "Kenji", "Zoe", "Ravi", "Ana", "Noah", "Priya", "Leo", "Fatima", "Mateo", "Aiyana", "Tomás"];

export interface Thing {
  emoji: string;
  word: string;
  one: string;
}

export const THINGS: Thing[] = [
  { emoji: "🍎", word: "apples", one: "apple" },
  { emoji: "⭐", word: "stars", one: "star" },
  { emoji: "🐟", word: "fish", one: "fish" },
  { emoji: "🌸", word: "flowers", one: "flower" },
  { emoji: "🐞", word: "ladybugs", one: "ladybug" },
  { emoji: "🎈", word: "balloons", one: "balloon" },
  { emoji: "🍪", word: "cookies", one: "cookie" },
  { emoji: "🐥", word: "chicks", one: "chick" },
  { emoji: "🚗", word: "cars", one: "car" },
  { emoji: "⚽", word: "balls", one: "ball" },
  { emoji: "🍓", word: "strawberries", one: "strawberry" },
  { emoji: "🦋", word: "butterflies", one: "butterfly" },
  { emoji: "🐸", word: "frogs", one: "frog" },
  { emoji: "📚", word: "books", one: "book" },
];

/** "A" or "An" to start a sentence with this word. */
export const capArticle = (word: string) => (/^[aeiou]/i.test(word) ? "An" : "A");

/** 1st, 2nd, 3rd, 4th… */
export function ordinal(n: number): string {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  return `${n}${["th", "st", "nd", "rd"][n % 10 < 4 ? n % 10 : 0]}`;
}

// ---------- Banks and passages for language units ----------

export interface PassageQ {
  prompt: string;
  right: string;
  wrong: string[];
  hint: string;
}

export interface Passage {
  title?: string;
  /** Sentences or paragraphs, shown as the story or passage. */
  text: string[];
  questions: PassageQ[];
}

/** Reading questions: picks passages, then asks their questions in turn until there are `total`. */
export function passageQuestions(passages: Passage[], visual: "story" | "passage", total = 8): Question[] {
  const per = Math.ceil(total / 2);
  const chosen = shuffle(passages).slice(0, Math.ceil(total / per));
  const out: Question[] = [];
  for (const p of chosen) {
    const v: Visual = visual === "story" ? { type: "story", lines: p.text } : { type: "passage", title: p.title, paragraphs: p.text };
    for (const q of shuffle(p.questions).slice(0, per)) {
      out.push(textChoice(q.prompt, q.right, q.wrong, q.hint, v));
    }
  }
  return out.slice(0, total);
}

/** A number-answer multiple choice question with wrong answers near the right one. */
export function numQ(prompt: string, answer: number, hint: string, visual?: Visual, max = 100, min = 0): Question {
  return numberChoice(prompt, answer, hint, visual, { min, max });
}

/** Distinct wrong answers drawn from `pool`, never equal to `right`. */
export function others<T>(pool: readonly T[], right: T, n: number): T[] {
  return shuffle(pool.filter((x) => x !== right)).slice(0, n);
}
