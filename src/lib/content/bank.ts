import { sample, shuffle, textChoice } from "../random";
import type { Choice, Question, SortQuestion } from "../types";

type Option = Omit<Choice, "id"> | string;

/** A hand-written multiple-choice question. The first option in `right` is correct. */
export interface BankItem {
  prompt: string;
  right: Option;
  wrong: Option[];
  hint: string;
  emoji?: string;
  caption?: string;
}

export function fromBank(items: BankItem[], count: number): Question[] {
  return sample(items, count).map((b) =>
    textChoice(
      b.prompt,
      b.right,
      b.wrong,
      b.hint,
      b.emoji ? { type: "emoji", emoji: b.emoji, caption: b.caption } : undefined,
    ),
  );
}

export interface SortSet {
  prompt: string;
  hint: string;
  bins: { id: string; label: string; emoji: string }[];
  items: { label: string; emoji: string; bin: string }[];
}

/** Pick `perBin` items for each basket and shuffle them. */
export function sortQuestion(set: SortSet, perBin: number): SortQuestion {
  const items = set.bins.flatMap((bin) => sample(set.items.filter((i) => i.bin === bin.id), perBin));
  return {
    kind: "sort",
    prompt: set.prompt,
    hint: set.hint,
    bins: set.bins,
    items: shuffle(items).map((item, i) => ({ id: `s${i}`, ...item })),
  };
}
