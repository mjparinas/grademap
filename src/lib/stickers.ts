import { isCoreSubject } from "@/content/subjects";
import type { UnitRef } from "@/content";
import type { SubjectId } from "@/content/types";
import type { Derived } from "./derive";
import { unitLevel } from "./proficiency";

// The sticker book: a sticker for every lesson a child has grown in, plus stickers for special moments.
// Everything is read from the derived stats, so nothing is stored and nothing is ever taken away.

export interface Sticker {
  id: string;
  name: string;
  emoji: string;
  earned: boolean;
  /** A Star lesson: the sticker is shiny. */
  shiny?: boolean;
  /** How to get it, shown on stickers still to find. */
  hint: string;
}

export interface StickerPage {
  id: SubjectId | "moments";
  stickers: Sticker[];
}

/** A lesson sticker is earned at the second level (Proficient in BC) and shines at the top level. */
export function unitStickers(refs: UnitRef[], d: Derived): Record<string, Sticker[]> {
  const pages: Record<string, Sticker[]> = {};
  for (const ref of refs) {
    // French is opt-in: only show it once the child has started it.
    if (!isCoreSubject(ref.course.subject) && !d.units[ref.key]) continue;
    const level = unitLevel(d.units[ref.key]);
    (pages[ref.course.subject] ??= []).push({
      id: ref.key,
      name: ref.unit.title,
      emoji: ref.unit.emoji,
      earned: level >= 2,
      shiny: level >= 3,
      hint: "Grow a tree in this lesson",
    });
  }
  return pages;
}

const MOMENTS: { id: string; name: string; emoji: string; hint: string; earned: (d: Derived) => boolean }[] = [
  { id: "first-lesson", name: "First lesson", emoji: "🎒", hint: "Finish a lesson", earned: (d) => d.totals.sessions >= 1 },
  { id: "perfect", name: "Perfect lesson", emoji: "💯", hint: "Get every answer right in a lesson", earned: (d) => d.totals.perfectSessions >= 1 },
  { id: "oops-fixed", name: "Try again", emoji: "💪", hint: "Fix an answer after a miss", earned: (d) => d.totals.comebacks >= 1 },
  { id: "run-5", name: "On a roll", emoji: "🎳", hint: "Get 5 in a row", earned: (d) => d.totals.bestRun >= 5 },
  { id: "hundred", name: "100 right", emoji: "🎯", hint: "Answer 100 questions right", earned: (d) => d.totals.correct >= 100 },
  { id: "streak-3", name: "Three days", emoji: "🔥", hint: "Learn 3 days in a row", earned: (d) => d.streak.best >= 3 },
  { id: "streak-7", name: "A whole week", emoji: "🗓️", hint: "Learn 7 days in a row", earned: (d) => d.streak.best >= 7 },
  { id: "daily", name: "Daily Challenge", emoji: "☀️", hint: "Finish a Daily Challenge", earned: (d) => d.dailyDone.length >= 1 },
  { id: "speed", name: "Speedy", emoji: "⚡", hint: "Try a Speed Run", earned: (d) => (d.modes.speed ?? 0) >= 1 },
  { id: "challenge", name: "Challenger", emoji: "🏅", hint: "Pass a Challenge", earned: (d) => Object.values(d.units).some((u) => u.challengePassed) },
  { id: "arcade", name: "Game on", emoji: "🕹️", hint: "Play an arcade game", earned: (d) => Object.keys(d.gamesPlayed).length >= 1 },
  { id: "shopper", name: "New friend", emoji: "🛍️", hint: "Get something from the shop", earned: (d) => d.owned.length >= 1 },
  { id: "all-subjects", name: "Explorer", emoji: "🧭", hint: "Answer in all four subjects", earned: (d) => (["math", "language", "science", "social"] as SubjectId[]).every((s) => (d.subjects[s]?.answers ?? 0) > 0) },
  { id: "level-10", name: "Level 10", emoji: "⭐", hint: "Reach level 10", earned: (d) => d.level >= 10 },
];

export function momentStickers(d: Derived): Sticker[] {
  return MOMENTS.map((m) => ({ id: m.id, name: m.name, emoji: m.emoji, earned: m.earned(d), hint: m.hint }));
}

export const MOMENT_COUNT = MOMENTS.length;

export function countEarned(stickers: Sticker[]): number {
  return stickers.filter((s) => s.earned).length;
}
