import { sample, shuffle, textChoice } from "./random";
import type { Choice, GenerateOptions, OrderQuestion, Question, Visual } from "./types";

// Shared helpers for the two French subjects (French Immersion and Core French).
// Items are written as short tuples so a bank of a dozen questions stays readable.

/** A choice: plain text, or text with a picture. */
export type Opt = string | { label: string; emoji?: string };

/**
 * One multiple-choice item: [prompt, right answer, wrong answers, hint, visual?].
 * A string visual is an emoji shown above the question.
 */
export type FrItem = [prompt: string, right: Opt, wrong: Opt[], hint: string, visual?: Visual | string];

/** Shorthand for a choice with a picture: e("🐱", "chat"). */
export const e = (emoji: string, label: string): Opt => ({ emoji, label });

export interface FrOptions {
  /** "fr" = the prompt is in French, so read-aloud uses a French voice. */
  lang?: "fr";
  /** Read-aloud text, when it differs from the prompt. */
  speak?: boolean;
}

const visualOf = (v: FrItem[4]): Visual | undefined => (typeof v === "string" ? { type: "emoji", emoji: v } : v);

/**
 * Builds `count` questions from a bank. Easier levels show fewer wrong answers, so a
 * struggling child isn't faced with a wall of choices.
 */
export function frQuestions(items: FrItem[], opts: GenerateOptions | undefined, count = 8, fr: FrOptions = {}): Question[] {
  const wrongCount = opts?.difficulty === 1 ? 1 : opts?.difficulty === 3 ? 3 : 2;
  return sample(items, count).map(([prompt, right, wrong, hint, visual]) => {
    const q = textChoice(prompt, right as Omit<Choice, "id"> | string, shuffle(wrong).slice(0, wrongCount) as (Omit<Choice, "id"> | string)[], hint, visualOf(visual));
    if (fr.lang) q.lang = fr.lang;
    return q;
  });
}

/** A sequencing question; `items` are listed in the correct order. */
export function frOrder(prompt: string, hint: string, items: (string | { label: string; emoji?: string })[], fr: FrOptions = {}): OrderQuestion {
  const q: OrderQuestion = {
    kind: "order",
    prompt,
    hint,
    items: items.map((it, i) => (typeof it === "string" ? { id: `o${i}`, label: it } : { id: `o${i}`, ...it })),
  };
  if (fr.lang) q.lang = fr.lang;
  return q;
}

/** Items grouped into families (rhymes, verb endings…). A question picks two from one family and others from different families. */
export function familyQuestions(
  families: string[][],
  make: (a: string, b: string) => { prompt: string; hint: string; visual?: Visual | string },
  opts: GenerateOptions | undefined,
  count = 8,
  fr: FrOptions = {},
): Question[] {
  const wrongCount = opts?.difficulty === 1 ? 1 : opts?.difficulty === 3 ? 3 : 2;
  return sample(families, Math.min(count, families.length)).map((fam) => {
    const [a, b] = sample(fam, 2);
    const others = sample(families.filter((f) => f !== fam).flatMap((f) => sample(f, 1)), wrongCount);
    const m = make(a, b);
    const q = textChoice(m.prompt, b, others, m.hint, visualOf(m.visual));
    if (fr.lang) q.lang = fr.lang;
    return q;
  });
}

/** [emoji, word] pairs for picture vocabulary. */
export type Pair = [emoji: string, word: string];

/**
 * "Which word goes with the picture?" Wrong answers are other words from the same list, so keep a list
 * free of synonyms (no "voiture" and "auto" together).
 */
export function vocabQuestions(pairs: Pair[], prompt: string, opts: GenerateOptions | undefined, count = 8, fr: FrOptions = {}): Question[] {
  const items: FrItem[] = pairs.map(([emoji, word]) => [
    prompt,
    word,
    pairs.filter((p) => p[1] !== word).map((p) => p[1]),
    `Look closely at the picture. The word starts with “${[...word].slice(0, 2).join("")}”.`,
    emoji,
  ]);
  return frQuestions(items, opts, count, fr);
}

/** Words grouped by their first sound: "Which word starts like lune?" */
export function soundItems(groups: Pair[][]): FrItem[] {
  return groups.flatMap((group, gi) =>
    group.map(([emoji, word], i): FrItem => {
      const [, match] = group[(i + 1) % group.length];
      const matchEmoji = group[(i + 1) % group.length][0];
      const wrong = groups.filter((_, gj) => gj !== gi).map((g) => ({ emoji: g[0][0], label: g[0][1] }));
      return [
        `Quel mot commence comme « ${word} »?`,
        { emoji: matchEmoji, label: match },
        wrong,
        `Say “${word}” slowly and listen to the first sound. Which word begins the same way?`,
        { type: "emoji", emoji, caption: word },
      ];
    }),
  );
}

// ---------- Core French read-aloud ----------
// Core French prompts are English with French in them. These helpers mark which parts are French so
// read-aloud can switch voices (see src/lib/readaloud.ts).

// English glosses in quotes: “I am hungry”. Anything else in quotes is French.
const ENGLISH_GLOSS = /\b(the|is|are|am|i|my|she|he|we|you|why|who|where|when|how|kind|funny|hospital|thank|do|play|love|like|go|can|better|older|taller|fast)\b/i;

// Prompts whose answer choices are French.
const FRENCH_CHOICES =
  /^(How do you (say|ask)|Choose the best|What is the plural|Where do (you|children)|Which (word has|word means|word is|article|question word|spelling|greeting|French word|question asks|reason fits|sentence (says|means|gives|is correct)))|Which (answer|sentence is correct)/;

/** Marks the French parts of a Core French question for read-aloud, and sets French quotations in « ». */
export function tagCoreFrench(q: Question): Question {
  if (/^(Complète|Combien|Mon |Ma |Mes )/.test(q.prompt)) {
    // A French sentence with an English gloss in brackets: say only the French.
    q.speak = q.prompt.replace(/\s*\([^)]*\)/g, "");
    q.lang = "fr";
    return q;
  }
  q.prompt = q.prompt.replace(/“([^”]*)”/g, (m, inner: string) => (ENGLISH_GLOSS.test(inner) ? m : `«${inner}»`));
  if (q.kind === "choice" && FRENCH_CHOICES.test(q.prompt)) q.choicesLang = "fr";
  if (q.visual?.type === "story" || q.visual?.type === "passage") q.visualLang = "fr";
  return q;
}

/** Like frQuestions, for Core French banks. */
export function coreQuestions(items: FrItem[], opts: GenerateOptions | undefined, count = 8): Question[] {
  return frQuestions(items, opts, count).map(tagCoreFrench);
}
