import { pick, sample, shuffle, textChoice } from "../random";
import { sortQuestion, type BankItem, type SortSet } from "../bank";
import type { GenerateOptions, OrderQuestion, Question, Visual } from "../types";
import { levelOf, type Level } from "./kit";

// Helpers for the Ontario Grade 3 and 4 science and social studies units: hand-written question
// banks with easier and harder items, plus the odd sort, ordering or generated question.

/** A bank question. `hard` items are held back for the easier levels. */
export type Item = BankItem & { hard?: true; visual?: Visual };

/** A question: the first answer given is the right one. */
export function q(prompt: string, right: string, wrong: string[], hint: string, emoji?: string, visual?: Visual): Item {
  return { prompt, right, wrong, hint, emoji, visual };
}

/** A stretch question. */
export function hq(prompt: string, right: string, wrong: string[], hint: string, emoji?: string, visual?: Visual): Item {
  return { ...q(prompt, right, wrong, hint, emoji, visual), hard: true };
}

function ask(b: Item): Question {
  const visual: Visual | undefined = b.visual ?? (b.emoji ? { type: "emoji", emoji: b.emoji, caption: b.caption } : undefined);
  const out = textChoice(b.prompt, b.right, b.wrong, b.hint, visual);
  if (b.speak) out.speak = b.speak;
  return out;
}

/** `count` questions: none of the stretch ones at level 1, about a third at level 2, two thirds at level 3. */
export function levelled(bank: Item[], count: number, d: Level): Question[] {
  const easy = bank.filter((b) => !b.hard);
  const hard = bank.filter((b) => b.hard);
  const want = d === 1 ? 0 : d === 2 ? Math.ceil(count / 3) : Math.ceil((count * 2) / 3);
  const nHard = Math.min(want, hard.length);
  return [...sample(easy, count - nHard), ...sample(hard, nHard)].map(ask);
}

/** Sort questions grow with the level, but never past 8 items in all. */
function perBin(d: Level, bins: number): number {
  const base = d === 1 ? 2 : d === 2 ? 3 : 4;
  return Math.min(base, Math.floor(8 / bins));
}

/** An ordering question; list the items in their correct order. */
export function order(prompt: string, hint: string, items: [string, string][]): OrderQuestion {
  return { kind: "order", prompt, hint, items: items.map(([label, emoji], i) => ({ id: `o${i}`, label, emoji })) };
}

interface Extras {
  sorts?: SortSet[];
  orders?: OrderQuestion[];
  /** Generated questions (they should vary with the seed), added to the set. */
  makers?: ((d: Level) => Question)[];
}

/** A generator for a bank unit: one sort and one ordering question if there are any, then bank questions to make 8. */
export function bankUnit(bank: Item[], extras: Extras = {}) {
  const { sorts = [], orders = [], makers = [] } = extras;
  return (opts?: GenerateOptions): Question[] => {
    const d = levelOf(opts);
    const special: Question[] = [];
    if (sorts.length) {
      const set = pick(sorts);
      special.push(sortQuestion(set, perBin(d, set.bins.length)));
    }
    if (orders.length) special.push(pick(orders));
    for (const make of makers) special.push(make(d));
    return shuffle([...special, ...levelled(bank, 8 - special.length, d)]);
  };
}
