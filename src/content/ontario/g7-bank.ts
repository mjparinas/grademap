import { fromBank, type BankItem } from "../bank";
import { sample, shuffle } from "../random";
import type { OrderQuestion, Question } from "../types";
import type { Level } from "./kit";

// Small helpers shared by the Ontario Grade 7 science and social studies units.

/** A bank item; `hard` items are stretch questions (used mostly at difficulty 3). */
export type Item = BankItem & { hard?: true };

/** `count` bank questions: difficulty 1 uses only the easier items, 2 mixes in a third, 3 is mostly stretch. */
export function levelled(bank: Item[], count: number, difficulty: Level): Question[] {
  if (count <= 0) return [];
  const easy = bank.filter((b) => !b.hard);
  const hard = bank.filter((b) => b.hard);
  const want = difficulty === 1 ? 0 : difficulty === 2 ? Math.ceil(count / 3) : Math.ceil((count * 2) / 3);
  const nHard = Math.min(want, hard.length);
  return shuffle([...fromBank(easy, count - nHard), ...fromBank(hard, nHard)]);
}

/** Items per basket for a two-basket sort: 3 at difficulty 1, otherwise 4. */
export const perBin = (difficulty: Level) => (difficulty === 1 ? 3 : 4);

export interface Step {
  id: string;
  label: string;
  emoji?: string;
}

/** An ordering question: 3, 4 or 5 of the steps (by difficulty), kept in their true order. */
export function orderQuestion(prompt: string, hint: string, steps: Step[], difficulty: Level): OrderQuestion {
  const n = Math.min(steps.length, difficulty === 1 ? 3 : difficulty === 2 ? 4 : 5);
  const idx = sample(
    steps.map((_, i) => i),
    n,
  ).sort((a, b) => a - b);
  return { kind: "order", prompt, hint, items: idx.map((i) => steps[i]) };
}
