import { fromBank, sortQuestion, type BankItem, type SortSet } from "../bank";
import { shuffle } from "../random";
import type { GenerateOptions, OrderQuestion, Question } from "../types";
import { levelOf, type Level } from "./kit";

// Helpers for the Ontario Kindergarten to Grade 2 science and social studies units. Each unit is
// a bank of hand-written questions (some tagged with the difficulty they first appear at) plus
// a sort or order activity.

export type Opt = BankItem["right"];
export interface Item extends BankItem {
  /** The lowest difficulty this question appears at (default 1). */
  d?: Level;
}

export const e = (label: string, emoji: string): Opt => ({ label, emoji });

/** A compact bank question; the first `right` option is the correct one. */
export function q(prompt: string, right: Opt, wrong: Opt[], hint: string, more: { d?: Level; emoji?: string; speak?: string } = {}): Item {
  return { prompt, right, wrong, hint, ...more };
}

/** Tap the items in the right order (listed in the correct order). */
export function order(prompt: string, hint: string, items: [string, string?][]): Special {
  const make = (): OrderQuestion => ({
    kind: "order",
    prompt,
    hint,
    items: items.map(([label, emoji], i) => ({ id: `o${i}`, label, emoji })),
  });
  return make;
}

/** Sort items into 2 or 3 baskets. */
export function sorter(set: SortSet): Special {
  return (d) => sortQuestion(set, set.bins.length === 2 ? (d === 1 ? 2 : 3) : 2);
}

export type Special = (d: Level) => Question;

/** A unit's `generate`: the activities (sort, order) plus enough bank questions for 8. */
export function unitOf(bank: Item[], specials: Special[] = []): (opts?: GenerateOptions) => Question[] {
  return (opts) => {
    const d = levelOf(opts);
    const extras = specials.map((s) => s(d));
    const n = 8 - extras.length;
    const pool = bank.filter((i) => (i.d ?? 1) <= d);
    return shuffle([...extras, ...fromBank(pool.length >= n + 2 ? pool : bank, n)]);
  };
}
