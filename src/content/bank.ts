import { sample, shuffle, textChoice } from "./random";
import type { Choice, Question, SortQuestion } from "./types";

type Option = Omit<Choice, "id"> | string;

/** A hand-written multiple-choice question. The first option in `right` is correct. */
export interface BankItem {
  prompt: string;
  /** Read-aloud text, if different from the prompt. */
  speak?: string;
  right: Option;
  wrong: Option[];
  hint: string;
  emoji?: string;
  caption?: string;
}

export function fromBank(items: BankItem[], count: number): Question[] {
  return sample(items, count).map((b) => {
    const q = textChoice(
      b.prompt,
      b.right,
      b.wrong,
      b.hint,
      b.emoji ? { type: "emoji", emoji: b.emoji, caption: b.caption } : undefined,
    );
    if (b.speak) q.speak = b.speak;
    return q;
  });
}

export interface SortSet {
  prompt: string;
  speak?: string;
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
    speak: set.speak,
    hint: set.hint,
    bins: set.bins,
    items: shuffle(items).map((item, i) => ({ id: `s${i}`, ...item })),
  };
}
