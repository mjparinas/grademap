import { sortQuestion, type BankItem, type SortSet } from "../bank";
import { sample, textChoice } from "../random";
import type { GenerateOptions, Question, Visual } from "../types";

// Shared by the Ontario Grade 5 and 6 science and social studies units: bank items marked
// `hard` are stretch questions. Difficulty 1 uses only the core items, 2 mixes in about a
// third, and 3 is mostly stretch.

export type Level = NonNullable<GenerateOptions["difficulty"]>;
export type Item = BankItem & { hard?: true; visual?: Visual };

function toQuestion(b: Item): Question {
  const visual: Visual | undefined = b.visual ?? (b.emoji ? { type: "emoji", emoji: b.emoji, caption: b.caption } : undefined);
  const q = textChoice(b.prompt, b.right, b.wrong, b.hint, visual);
  if (b.speak) q.speak = b.speak;
  return q;
}

export function levelled(bank: Item[], count: number, difficulty: Level): Question[] {
  const easy = bank.filter((b) => !b.hard);
  const hard = bank.filter((b) => b.hard);
  const want = difficulty === 1 ? 0 : difficulty === 2 ? Math.ceil(count / 3) : Math.ceil((count * 2) / 3);
  const nHard = Math.min(want, hard.length);
  return [...sample(easy, count - nHard), ...sample(hard, nHard)].map(toQuestion);
}

/** Two-basket sorts grow with difficulty (4, 6 or 8 items). */
export const perBin = (d: Level) => (d === 1 ? 2 : d === 2 ? 3 : 4);

/** Seven bank questions and one sort. */
export function withSort(bank: Item[], set: SortSet, d: Level): Question[] {
  return [...levelled(bank, 7, d), sortQuestion(set, perBin(d))];
}
