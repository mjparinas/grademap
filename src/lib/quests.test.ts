import { describe, expect, it } from "vitest";
import type { AgeBand } from "@/content/types";
import type { DayStat } from "./derive";
import { dayKey } from "./model";
import { activeDay, dailyQuests, weekDays, weeklyQuests, weekStart, type Quest, type WeeklyQuest } from "./quests";

const DAY = 86_400_000;
const T = new Date(2026, 0, 1, 12).getTime();

const dayStat = (over: Partial<DayStat> = {}): DayStat => ({
  day: "2026-10-05", learnSeconds: 0, answers: 0, correct: 0, sessions: 0, perfect: 0, playSeconds: 0, bestRun: 0, subjects: {}, modes: {}, ...over,
});

/** Every quest a band can get, gathered from a few years of days and two children. */
function dailyPool(band: AgeBand): Map<string, Quest> {
  const all = new Map<string, Quest>();
  for (const child of ["p1", "p2"]) for (let i = 0; i < 1000; i++) for (const q of dailyQuests(child, dayKey(T + i * DAY), band)) all.set(q.id, q);
  return all;
}

function weeklyPool(band: AgeBand): Map<string, WeeklyQuest> {
  const all = new Map<string, WeeklyQuest>();
  for (const child of ["p1", "p2"]) for (let i = 0; i < 300; i++) for (const q of weeklyQuests(child, weekStart(T + i * 7 * DAY), band)) all.set(q.id, q);
  return all;
}

const summary = (pool: Map<string, Quest | WeeklyQuest>) =>
  Object.fromEntries([...pool.values()].map((q) => [q.id, [q.target, q.reward]]).sort(([a], [b]) => String(a).localeCompare(String(b))));

const sorted = (o: Record<string, [number, number]>) => Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b)));

const SHARED = {
  run: [5, 20], lessons: [2, 20], "lessons-3": [3, 30], flawless: [1, 25], "two-subjects": [2, 20], "three-subjects": [3, 30],
  practice: [1, 15], daily: [1, 25], adventure: [1, 15], challenge: [1, 30],
} satisfies Record<string, [number, number]>;

describe("daily quests", () => {
  it("gives little kids smaller goals and no Speed Run, Review or 15-question quests", () => {
    expect(summary(dailyPool("little"))).toEqual(sorted({
      ...SHARED, answers: [10, 20], "answers-big": [20, 35], "run-8": [7, 25], minutes: [5, 25], "minutes-long": [8, 35],
      "math-5": [5, 20], "language-5": [5, 20], "science-5": [5, 20], "social-5": [5, 20],
    }));
  });

  it.each(["middle", "big"] as const)("gives %s kids the full pool", (band) => {
    expect(summary(dailyPool(band))).toEqual(sorted({
      ...SHARED, answers: [20, 20], "answers-big": [40, 35], "run-8": [8, 25], minutes: [10, 25], "minutes-long": [15, 35],
      "math-8": [8, 20], "language-8": [8, 20], "science-8": [8, 20], "social-8": [8, 20],
      "math-15": [15, 30], "language-15": [15, 30], "science-15": [15, 30], "social-15": [15, 30],
      speed: [1, 15], review: [1, 20],
    }));
  });

  it("is one answer-count quest plus two different others each day", () => {
    for (let i = 0; i < 100; i++) {
      const ids = dailyQuests("p1", dayKey(T + i * DAY), "middle").map((q) => q.id);
      expect(ids[0]).toMatch(/^answers/);
      expect(ids.slice(1).some((id) => id.startsWith("answers"))).toBe(false);
      expect(new Set(ids).size).toBe(3);
    }
  });

  it("differs between children and between days", () => {
    const days = Array.from({ length: 30 }, (_, i) => dayKey(T + i * DAY));
    const sets = (child: string) => days.map((d) => dailyQuests(child, d, "middle").map((q) => q.id).join());
    expect(new Set(sets("p1")).size).toBeGreaterThan(10);
    expect(sets("p1")).not.toEqual(sets("p2"));
  });

  it("reads each quest's progress from the right part of the day", () => {
    const day = dayStat({
      answers: 11, sessions: 3, perfect: 2, learnSeconds: 659, bestRun: 6,
      subjects: { math: 7, language: 3, science: 2 },
      modes: { practice: 4, daily: 5, adventure: 16, challenge: 17, speed: 18, review: 19 },
    });
    const pool = dailyPool("big");
    const progress = Object.fromEntries([...pool.values()].map((q) => [q.id, q.progress(day)]));
    expect(progress).toEqual({
      answers: 11, "answers-big": 11, run: 6, "run-8": 6, lessons: 3, "lessons-3": 3, flawless: 2, minutes: 10, "minutes-long": 10,
      "two-subjects": 2, "three-subjects": 2, practice: 4, daily: 5, adventure: 16, challenge: 17, speed: 18, review: 19,
      "math-8": 7, "language-8": 3, "science-8": 2, "social-8": 0, "math-15": 7, "language-15": 3, "science-15": 2, "social-15": 0,
    });
    for (const q of pool.values()) expect(q.progress(undefined), q.id).toBe(0);
    for (const q of pool.values()) expect(q.progress(dayStat()), q.id).toBe(0);
  });

  it("names subject quests after the subject as the child's age band says it", () => {
    expect(dailyPool("little").get("language-5")!.title).toBe("Answer 5 Letters & Words questions");
    expect(dailyPool("big").get("social-15")!.title).toBe("Answer 15 Social Studies questions");
  });
});

describe("weekly quests", () => {
  it("has smaller goals for little kids", () => {
    const shared = { "w-days": [4, 60], "w-flawless": [3, 60], "w-all-subjects": [4, 80], "w-daily": [3, 70], "w-lessons": [10, 60], "w-challenge": [2, 70] } satisfies Record<string, [number, number]>;
    expect(summary(weeklyPool("little"))).toEqual(sorted({ ...shared, "w-answers": [100, 60], "w-minutes": [30, 70], "w-run": [8, 50] }));
    expect(summary(weeklyPool("middle"))).toEqual(sorted({ ...shared, "w-answers": [200, 60], "w-minutes": [60, 70], "w-run": [12, 50] }));
  });

  it("adds up the week's days", () => {
    const days = [
      dayStat({ answers: 11, sessions: 3, perfect: 2, learnSeconds: 659, bestRun: 6, subjects: { math: 7, language: 3, science: 2 }, modes: { daily: 5, challenge: 7 } }),
      dayStat({ answers: 4, perfect: 1, learnSeconds: 61, bestRun: 9, subjects: { math: 8, language: 12, science: 20 }, modes: { daily: 1 } }),
      dayStat({ answers: 5 }),
    ];
    const progress = Object.fromEntries([...weeklyPool("middle").values()].map((q) => [q.id, q.progress(days)]));
    expect(progress).toEqual({
      "w-answers": 20, "w-days": 2, "w-flawless": 3, "w-all-subjects": 3, "w-daily": 6, "w-minutes": 12, "w-lessons": 3, "w-run": 9, "w-challenge": 7,
    });
    for (const q of weeklyPool("middle").values()) expect(q.progress([]), q.id).toBe(0);
  });

  it("needs 15 answers in a subject across the week for it to count", () => {
    const allSubjects = weeklyPool("middle").get("w-all-subjects")!;
    const week = (n: number) => [dayStat({ subjects: { math: n, language: n, science: n, social: n } })];
    expect(allSubjects.progress(week(14))).toBe(0);
    expect(allSubjects.progress(week(15))).toBe(4);
  });

  it("counts a day with a finished lesson or at least 5 answers", () => {
    expect(activeDay(dayStat({ sessions: 1 }))).toBe(true);
    expect(activeDay(dayStat({ answers: 4 }))).toBe(false);
    expect(activeDay(dayStat({ answers: 5 }))).toBe(true);
    expect(activeDay(dayStat())).toBe(false);
  });

  it("starts the week on Monday, so Sunday belongs to the week before", () => {
    expect(weekStart(new Date(2026, 9, 5, 0, 1).getTime())).toBe("2026-10-05");
    expect(weekStart(new Date(2026, 9, 11, 23, 59).getTime())).toBe("2026-10-05");
    expect(weekStart(new Date(2026, 9, 12, 0, 1).getTime())).toBe("2026-10-12");
    expect(weekStart(new Date(2026, 9, 1, 12).getTime())).toBe("2026-09-28");
  });

  it("lists the seven days of the week, across a month end", () => {
    expect(weekDays("2026-09-28")).toEqual(["2026-09-28", "2026-09-29", "2026-09-30", "2026-10-01", "2026-10-02", "2026-10-03", "2026-10-04"]);
  });
});
