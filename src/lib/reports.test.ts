import { beforeAll, describe, expect, it } from "vitest";
import { allUnitRefs, loadGrade, type UnitRef } from "@/content";
import { isCoreSubject } from "@/content/subjects";
import { derive } from "./derive";
import type { AppEvent } from "./model";
import { buildReport } from "./reports";

beforeAll(() => loadGrade("2"));

const DAY = 86_400_000;
const at = (month: number, day: number, h = 12, min = 0, s = 0, ms = 0) => new Date(2026, month - 1, day, h, min, s, ms).getTime();
const NOW = at(10, 10); // Saturday; a 7-day report covers Sunday 4 October to Saturday 10 October.
const START = at(10, 4, 0);
const END = at(10, 11, 0);

let n = 0;
const answer = (unit: string, correct: boolean, t: number, extra: Partial<Extract<AppEvent, { type: "answer" }>> = {}): AppEvent => ({
  id: `r${n++}`, profileId: "p", t, type: "answer", unit, correct, attempts: correct ? 1 : 2, revealed: false, ms: 5000, mode: "practice", ...extra,
});
const session = (t: number): AppEvent => ({ id: `s${n++}`, profileId: "p", t, type: "session", mode: "practice", scope: "mix", total: 5, correct: 5, ms: 1000 });
/** `count` answers, the first `right` correct, a minute apart from `t`. */
const run = (unit: string, count: number, right: number, t: number) => Array.from({ length: count }, (_, i) => answer(unit, i < right, t + i * 60_000));

const shortDate = (t: number) => new Date(t).toLocaleDateString("en-CA", { month: "short", day: "numeric" });

describe("buildReport", () => {
  let core: UnitRef[];
  let math: string;
  let language: string;
  beforeAll(() => {
    core = allUnitRefs("2", "ca-bc").filter((r) => isCoreSubject(r.course.subject));
    math = core.find((r) => r.course.subject === "math")!.key;
    language = core.find((r) => r.course.subject === "language")!.key;
  });

  const windowEvents = () => [
    answer(language, true, at(10, 7, 10), { ms: 30_000 }),
    answer(math, true, START, { ms: 5000 }),
    answer(math, false, END - 1, { ms: 90_000, hinted: true }),
    answer(math, true, END),
    answer(math, true, START - 1, { ms: 12_000 }),
    answer(math, false, START - 7 * DAY, { ms: 90_000 }),
    answer(math, true, START - 7 * DAY - 1),
    session(at(10, 8)),
    session(START - 1),
  ];

  it("totals the period, counting the first moment and not the end", () => {
    const events = windowEvents();
    const r = buildReport(events, derive(events, NOW), "2", "ca-bc", 7, NOW);
    const { minutes, avgSeconds, ...counts } = r.totals;
    expect(minutes).toBeCloseTo(95 / 60, 10);
    expect(avgSeconds).toBeCloseTo(95 / 3, 10);
    expect(counts).toEqual({ answers: 3, correct: 2, sessions: 1, activeDays: 3, hints: 1 });
    expect(r.previous.minutes).toBeCloseTo(72 / 60, 10);
    expect(r.previous).toMatchObject({ answers: 2, correct: 1 });
  });

  it("has one point per day, from the first day of the period", () => {
    const events = windowEvents();
    const r = buildReport(events, derive(events, NOW), "2", "ca-bc", 7, NOW);
    expect(r.days.map((d) => d.day)).toEqual(["2026-10-04", "2026-10-05", "2026-10-06", "2026-10-07", "2026-10-08", "2026-10-09", "2026-10-10"]);
    expect(r.days[0]).toEqual({ day: "2026-10-04", label: shortDate(START), minutes: 5 / 60, answers: 1, correct: 1 });
    expect(r.days[3]).toMatchObject({ minutes: 0.5, answers: 1, correct: 1 });
    expect(r.days[6]).toMatchObject({ minutes: 1, answers: 1, correct: 0 });
    expect(r.days[1]).toMatchObject({ minutes: 0, answers: 0, correct: 0 });
    expect(buildReport(events, derive(events, NOW), "2", "ca-bc", 30, NOW).days).toHaveLength(30);
  });

  it("lists subjects with the most answers first", () => {
    const events = windowEvents();
    const r = buildReport(events, derive(events, NOW), "2", "ca-bc", 7, NOW);
    expect(r.subjects).toEqual([
      { subject: "math", answers: 2, correct: 1, minutes: 65 / 60 },
      { subject: "language", answers: 1, correct: 1, minutes: 0.5 },
    ]);
  });

  it("averages zero seconds when nothing was answered", () => {
    const r = buildReport([], derive([], NOW), "2", "ca-bc", 7, NOW);
    expect(r.totals).toEqual({ minutes: 0, answers: 0, correct: 0, sessions: 0, activeDays: 0, avgSeconds: 0, hints: 0 });
    expect(r.subjects).toEqual([]);
    expect(r.notStarted).toBe(core.length);
  });

  it("charts 12 Monday-to-Sunday weeks, with accuracy only from 5 answers", () => {
    const events = [
      ...windowEvents(),
      ...run(core[1].key, 5, 4, at(8, 3, 9)),
      ...run(core[1].key, 4, 4, at(8, 10, 9)),
      answer(core[1].key, true, at(7, 19, 23, 59)),
      answer(core[1].key, true, at(7, 20, 0)),
    ];
    const r = buildReport(events, derive(events, NOW), "2", "ca-bc", 7, NOW);
    expect(r.weeks).toHaveLength(12);
    expect(r.weeks[0]).toEqual({ start: "2026-07-20", label: shortDate(at(7, 20, 0)), answers: 1, accuracy: null });
    expect(r.weeks.at(-1)).toEqual({ start: "2026-10-05", label: shortDate(at(10, 5, 0)), answers: 3, accuracy: null });
    expect(r.weeks.at(-2)?.answers).toBe(2);
    expect(r.weeks.find((w) => w.start === "2026-08-03")?.accuracy).toBe(0.8);
    expect(r.weeks.find((w) => w.start === "2026-08-10")).toMatchObject({ answers: 4, accuracy: null });
  });

  it("picks strengths and next steps from practised units", () => {
    const June = at(6, 1, 9);
    const [s1, s2, s3, s4, s5, dev, weak, few, mid] = core.slice(1, 10).map((r) => r.key);
    const events = [
      ...run(s1, 10, 10, June), // 100%, 10 tries
      ...run(s2, 12, 9, June), // exactly 75%
      ...run(s3, 8, 8, June), // 100%, exactly 8 tries
      ...run(s4, 9, 9, June), // 100%, 9 tries
      ...run(s5, 16, 13, June), // 81%
      ...run(dev, 7, 7, June), // too few tries for a strength: Developing
      ...run(weak, 3, 0, June), // Emerging after exactly 3 tries
      ...run(few, 2, 0, June), // too few tries for a next step
      ...run(mid, 4, 2, June), // 50%, Developing
    ];
    const d = derive(events, NOW);
    const r = buildReport(events, d, "2", "ca-bc", 7, NOW);
    expect(r.strengths.map((u) => u.ref.key)).toEqual([s1, s4, s3, s5]);
    expect(r.needs.map((u) => u.ref.key)).toEqual([weak, mid, dev]);
    expect(r.needs.map((u) => u.accuracy)).toEqual([0, 0.5, 1]);
    const row = r.units.find((u) => u.ref.key === s2)!;
    expect(row).toMatchObject({ level: 2, attempts: 12, accuracy: 0.75, lastT: June + 11 * 60_000 });
    expect(r.units.find((u) => u.ref.key === core[0].key)).toMatchObject({ level: -1, attempts: 0, accuracy: 0, lastT: 0 });
    expect(r.notStarted).toBe(core.length - 9);
  });

  it("needs 75% accuracy for a strength, not just 8 tries", () => {
    const June = at(6, 1, 9);
    const [justUnder, exactly] = core.slice(1, 3).map((r) => r.key);
    const events = [...run(justUnder, 20, 14, June), ...run(exactly, 20, 15, June)];
    const r = buildReport(events, derive(events, NOW), "2", "ca-bc", 7, NOW);
    expect(r.strengths.map((u) => u.ref.key)).toEqual([exactly]);
    expect(r.strengths[0].accuracy).toBe(0.75);
  });

  it("counts an answer at the first moment of a week and not at the next Monday", () => {
    const monday = at(8, 3, 0);
    const events = [...run(core[1].key, 4, 4, at(8, 3, 9)), answer(core[1].key, true, monday), answer(core[1].key, false, monday + 7 * DAY)];
    const week = buildReport(events, derive(events, NOW), "2", "ca-bc", 7, NOW).weeks.find((w) => w.start === "2026-08-03")!;
    expect(week).toMatchObject({ answers: 5, accuracy: 1 });
  });

  it("skips answers whose unit key names no subject", () => {
    const events = [answer("not-a-unit", true, at(10, 5)), answer(math, true, at(10, 5, 13))];
    const r = buildReport(events, derive(events, NOW), "2", "ca-bc", 7, NOW);
    expect(r.subjects).toEqual([{ subject: "math", answers: 1, correct: 1, minutes: 5 / 60 }]);
    expect(r.totals.answers).toBe(2);
  });

  it("keeps the four lowest next steps", () => {
    const June = at(6, 1, 9);
    const keys = core.slice(1, 6).map((r) => r.key);
    const events = keys.flatMap((k, i) => run(k, 4, [2, 0, 3, 2, 0][i], June));
    const r = buildReport(events, derive(events, NOW), "2", "ca-bc", 7, NOW);
    expect(r.needs.map((u) => u.accuracy)).toEqual([0, 0, 0.5, 0.5]);
  });

  it("only lists French units once they've been started", () => {
    const french = allUnitRefs("2", "ca-bc").find((r) => !isCoreSubject(r.course.subject))!;
    const none = buildReport([], derive([], NOW), "2", "ca-bc", 7, NOW);
    expect(none.units.map((u) => u.ref.key)).toEqual(core.map((r) => r.key));
    const events = [answer(french.key, true, at(10, 5))];
    const some = buildReport(events, derive(events, NOW), "2", "ca-bc", 7, NOW);
    expect(some.units.map((u) => u.ref.key)).toContain(french.key);
    expect(some.units).toHaveLength(core.length + 1);
    expect(some.notStarted).toBe(core.length);
  });

  it("lists trophies won in the period, newest first", () => {
    const d = derive([], NOW);
    d.trophies = { early: START - 1, first: START, later: START + DAY };
    expect(buildReport([], d, "2", "ca-bc", 7, NOW).trophies).toEqual([{ id: "later", t: START + DAY }, { id: "first", t: START }]);
  });
});
