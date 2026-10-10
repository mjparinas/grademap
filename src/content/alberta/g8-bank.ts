import { ask, choose, fromParts, type Item, type Level, type UnitParts } from "../grades/kit";
import { shuffle } from "../random";
import type { GenerateOptions, Question } from "../types";
import { levelOf } from "./kit";

export { q, qe, type Item, type Level } from "../grades/kit";

/**
 * A generator for a unit written as a bank of multiple-choice items, with a few made-up (typed or
 * calculated) questions mixed in. Eight questions in all: the extras first, then bank items at the
 * child's level.
 */
export function fromItems(items: Item[], extras: ((level: Level) => Question)[] = [], total = 8) {
  return (opts?: GenerateOptions): Question[] => {
    const level = levelOf(opts);
    const made = extras.map((make) => make(level));
    return shuffle([...choose(items, level, total - made.length).map(ask), ...made]);
  };
}

/**
 * Like `fromParts` (a bank with optional sort and ordering questions) but swaps a few of the plain
 * multiple-choice questions for made-up (typed or calculated) ones.
 */
export function partsPlus(parts: UnitParts, extras: ((level: Level) => Question)[] = []) {
  return (opts?: GenerateOptions): Question[] => {
    const level = levelOf(opts);
    const keep = [...fromParts(parts, opts)];
    for (let removed = 0; removed < extras.length; removed++) {
      const i = keep.findIndex((x) => x.kind === "choice");
      if (i >= 0) keep.splice(i, 1);
    }
    return shuffle([...keep, ...extras.map((make) => make(level))]);
  };
}
