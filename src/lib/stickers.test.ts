import { beforeAll, describe, expect, it } from "vitest";
import { allUnitRefs, loadGrade } from "@/content";
import { derive, type Derived, type UnitStat } from "./derive";
import type { AppEvent } from "./model";
import { countEarned, momentStickers, MOMENT_COUNT, unitStickers } from "./stickers";

beforeAll(() => loadGrade("2"));

const T = new Date("2026-10-10T12:00:00").getTime();
const KEY = "2/math/tens-and-ones";
const answers = (n: number, correct = true): AppEvent[] =>
  Array.from({ length: n }, (_, i) => ({ id: `a${i}${correct}`, profileId: "p", t: T + i * 1000, type: "answer", unit: KEY, correct, attempts: 1, revealed: false, ms: 3000, mode: "practice" }));
const refs = () => allUnitRefs("2", "ca-bc");

describe("sticker book", () => {
  it("starts empty and gives a lesson sticker once the lesson is grown", () => {
    const empty = unitStickers(refs(), derive([]));
    expect(countEarned(empty.math)).toBe(0);
    const grown = unitStickers(refs(), derive(answers(10)));
    const mine = grown.math.find((s) => s.id === KEY)!;
    expect(mine.earned).toBe(true);
    expect(mine.shiny).toBe(false);
    expect(countEarned(grown.math)).toBe(1);
  });
  it("shines a Star lesson", () => {
    const events = [...answers(20), { id: "s1", profileId: "p", t: T + 99_000, type: "session", mode: "challenge", scope: KEY, total: 10, correct: 10, ms: 1000 } as AppEvent];
    expect(unitStickers(refs(), derive(events)).math.find((s) => s.id === KEY)?.shiny).toBe(true);
  });
  it("hides French until it has been started", () => {
    const pages = unitStickers(refs(), derive([]));
    expect(pages.immersion).toBeUndefined();
    expect(pages["core-french"]).toBeUndefined();
  });
  it("earns moment stickers from practice", () => {
    expect(countEarned(momentStickers(derive([])))).toBe(0);
    const d = derive(answers(100));
    const got = momentStickers(d).filter((s) => s.earned).map((s) => s.id);
    expect(got).toContain("hundred");
    expect(got).toContain("run-5");
    expect(momentStickers(d)).toHaveLength(MOMENT_COUNT);
  });
});

const unitAt = (key: string, level: 1 | 2 | 3): UnitStat => ({
  key, attempts: level === 1 ? 3 : 20, firstTry: 0, recent: Array(20).fill(true), mastery: 1, lastT: 0, sessions: 0,
  challengePassed: level === 3, ms: 0, wasEmerging: false, grew: false, returnLeft: 0, kept: false,
});
const withUnits = (units: Record<string, UnitStat>) => ({ ...derive([]), units }) as Derived;

describe("lesson stickers", () => {
  it("has a page per core subject with every lesson, named after the lesson", () => {
    const pages = unitStickers(refs(), derive([]));
    for (const subject of ["math", "language", "science", "social"]) {
      const lessons = refs().filter((r) => r.course.subject === subject);
      expect(pages[subject].map((s) => s.id), subject).toEqual(lessons.map((r) => r.key));
    }
    const first = refs().find((r) => r.key === KEY)!;
    expect(pages.math.find((s) => s.id === KEY)).toEqual({ id: KEY, name: first.unit.title, emoji: first.unit.emoji, earned: false, shiny: false, hint: "Grow a tree in this lesson" });
  });

  it("is earned at Proficient, not Developing, and shines only at Extending", () => {
    const sticker = (level: 1 | 2 | 3) => unitStickers(refs(), withUnits({ [KEY]: unitAt(KEY, level) })).math.find((s) => s.id === KEY)!;
    expect([sticker(1).earned, sticker(1).shiny]).toEqual([false, false]);
    expect([sticker(2).earned, sticker(2).shiny]).toEqual([true, false]);
    expect([sticker(3).earned, sticker(3).shiny]).toEqual([true, true]);
  });

  it("adds a French page once one French lesson is started, listing only started lessons", () => {
    const french = refs().find((r) => r.course.subject === "immersion")!;
    const pages = unitStickers(refs(), withUnits({ [french.key]: unitAt(french.key, 1) }));
    expect(pages.immersion.map((s) => [s.id, s.earned])).toEqual([[french.key, false]]);
  });
});

describe("moment stickers", () => {
  const moment = (change: (d: Derived) => void) => {
    const d = derive([]);
    change(d);
    return momentStickers(d).filter((s) => s.earned).map((s) => s.id);
  };
  const cases: [string, (d: Derived) => void, (d: Derived) => void][] = [
    ["first-lesson", (d) => { d.totals.sessions = 1; }, () => {}],
    ["perfect", (d) => { d.totals.perfectSessions = 1; }, () => {}],
    ["oops-fixed", (d) => { d.totals.comebacks = 1; }, () => {}],
    ["run-5", (d) => { d.totals.bestRun = 5; }, (d) => { d.totals.bestRun = 4; }],
    ["hundred", (d) => { d.totals.correct = 100; }, (d) => { d.totals.correct = 99; }],
    ["streak-3", (d) => { d.streak.best = 3; }, (d) => { d.streak.best = 2; }],
    ["streak-7", (d) => { d.streak.best = 7; }, (d) => { d.streak.best = 6; }],
    ["daily", (d) => { d.dailyDone = ["2026-10-10"]; }, () => {}],
    ["speed", (d) => { d.modes.speed = 1; }, (d) => { d.modes.practice = 3; }],
    ["challenge", (d) => { d.units = { [KEY]: unitAt(KEY, 3) }; }, (d) => { d.units = { [KEY]: unitAt(KEY, 2) }; }],
    ["arcade", (d) => { d.gamesPlayed = { munchers: 1 }; }, () => {}],
    ["shopper", (d) => { d.owned = ["hat"]; }, () => {}],
    ["all-subjects", (d) => { d.subjects = { math: { answers: 1, correct: 0 }, language: { answers: 1, correct: 0 }, science: { answers: 1, correct: 0 }, social: { answers: 1, correct: 0 } }; },
      (d) => { d.subjects = { math: { answers: 1, correct: 0 }, language: { answers: 1, correct: 0 }, science: { answers: 1, correct: 0 }, social: { answers: 0, correct: 0 } }; }],
    ["level-10", (d) => { d.level = 10; }, (d) => { d.level = 9; }],
  ];

  it("covers every moment", () => {
    expect(cases.map(([id]) => id).sort()).toEqual(momentStickers(derive([])).map((s) => s.id).sort());
  });

  it.each(cases)("earns %s exactly at its goal", (id, reach, below) => {
    expect(moment(reach)).toEqual(id === "streak-7" ? ["streak-3", "streak-7"] : [id]);
    expect(moment(below).filter((s) => s === id)).toEqual([]);
  });

  it("shows the name, emoji and hint of every moment", () => {
    for (const s of momentStickers(derive([]))) {
      expect(s.name && s.emoji && s.hint, s.id).toBeTruthy();
      expect(s.earned).toBe(false);
    }
    expect(momentStickers(derive([]))[0]).toEqual({ id: "first-lesson", name: "First lesson", emoji: "🎒", earned: false, hint: "Finish a lesson" });
  });
});
