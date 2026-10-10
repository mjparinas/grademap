import { beforeAll, describe, expect, it } from "vitest";
import { allUnitRefs, loadGrade } from "@/content";
import { makePlan } from "@/components/play/plans";
import { pickNext } from "./adaptive";
import { derive, xpForLevel } from "./derive";
import { dayKey, defaultChildSettings, type AppEvent } from "./model";
import { unitLevel } from "./proficiency";
import { dailyQuests } from "./quests";
import { newlyEarned, TROPHIES } from "./trophies";

// The apps download a grade's lessons before using them; do the same here.
beforeAll(() => loadGrade("2"));

const DAY = 86_400_000;
const UNIT = "2/math/tens-and-ones";
let n = 0;
const answer = (correct: boolean, t: number, unit = UNIT): AppEvent => ({
  id: `e${n++}`,
  profileId: "p1",
  t,
  type: "answer",
  unit,
  correct,
  attempts: correct ? 1 : 2,
  revealed: false,
  ms: 5000,
  mode: "practice",
});

describe("derive", () => {
  it("scores XP, coins, runs and learning time", () => {
    const t = Date.now();
    const d = derive([answer(true, t), answer(true, t + 1), answer(false, t + 2), answer(true, t + 3)]);
    expect(d.totals.answers).toBe(4);
    expect(d.totals.correct).toBe(3);
    expect(d.totals.bestRun).toBe(2);
    expect(d.coins).toBe(3);
    expect(d.totals.learnSeconds).toBe(20);
    expect(d.xp).toBe(10 + 12 + 4 + 10);
  });

  it("ignores duplicate events (merged from two devices)", () => {
    const t = Date.now();
    const e = answer(true, t);
    expect(derive([e, e, { ...e }]).totals.answers).toBe(1);
  });

  it("gives the same result whatever order events arrive in", () => {
    const t = Date.now();
    const events = Array.from({ length: 30 }, (_, i) => answer(i % 3 !== 0, t + i * 1000));
    const a = derive(events);
    const b = derive([...events].reverse());
    expect(b.xp).toBe(a.xp);
    expect(b.units[UNIT].mastery).toBeCloseTo(a.units[UNIT].mastery, 10);
  });

  it("counts day streaks", () => {
    const now = new Date("2026-10-08T15:00:00").getTime();
    const events: AppEvent[] = [];
    for (const back of [0, 1, 2, 4]) {
      for (let i = 0; i < 5; i++) events.push(answer(true, now - back * DAY + i));
    }
    const d = derive(events, now);
    expect(d.streak.current).toBe(3);
    expect(d.streak.best).toBe(3);
    expect(d.streak.activeToday).toBe(true);
    expect(d.streak.daysPracticed).toBe(4); // the gap doesn't take earlier days away
  });

  it("keeps days practised after a streak breaks", () => {
    const now = new Date("2026-10-08T15:00:00").getTime();
    const events: AppEvent[] = [];
    for (const back of [5, 6, 7]) for (let i = 0; i < 5; i++) events.push(answer(true, now - back * DAY + i));
    const d = derive(events, now);
    expect(d.streak.current).toBe(0);
    expect(d.streak.daysPracticed).toBe(3);
  });

  it("levels up along the XP curve", () => {
    const t = Date.now();
    const events = Array.from({ length: 30 }, (_, i) => answer(true, t + i));
    const d = derive(events);
    let xp = d.xp;
    let level = 1;
    while (xp >= xpForLevel(level)) xp -= xpForLevel(level++);
    expect(d.level).toBe(level);
    expect(d.level).toBeGreaterThan(1);
  });
});

describe("proficiency", () => {
  it("climbs from Emerging to Proficient and needs a Challenge for Extending", () => {
    const t = Date.now();
    expect(unitLevel(undefined)).toBe(-1);
    const few = derive([answer(false, t), answer(false, t + 1)]);
    expect(unitLevel(few.units[UNIT])).toBe(0);
    const good = derive(Array.from({ length: 20 }, (_, i) => answer(true, t + i)));
    expect(unitLevel(good.units[UNIT])).toBe(2);
    const challenged = derive([
      ...Array.from({ length: 20 }, (_, i) => answer(true, t + i)),
      { id: "c1", profileId: "p1", t: t + 100, type: "session", mode: "challenge", scope: UNIT, total: 10, correct: 9, ms: 1000 },
    ]);
    expect(unitLevel(challenged.units[UNIT])).toBe(3);
  });
});

describe("trophies", () => {
  it("have unique ids and award First Steps", () => {
    expect(new Set(TROPHIES.map((t) => t.id)).size).toBe(TROPHIES.length);
    const d = derive([answer(true, Date.now())]);
    const earned = newlyEarned(d, { grade: "2" }).map((t) => t.id);
    expect(earned).toContain("first-answer");
    expect(earned).not.toContain("correct-50");
  });

  it("add trophy points and coins once", () => {
    const t = Date.now();
    const trophy: AppEvent = { id: "t1", profileId: "p1", t, type: "trophy", trophy: "first-answer" };
    const d = derive([trophy, { ...trophy, id: "t2" }]);
    expect(d.trophyPoints).toBe(15);
  });
});

describe("adaptive", () => {
  it("favours weak and new units and avoids repeats", () => {
    const t = Date.now();
    const strong = Array.from({ length: 30 }, (_, i) => answer(true, t + i));
    const d = derive(strong);
    const counts = new Map<string, number>();
    for (let i = 0; i < 2000; i++) {
      const p = pickNext({ grade: "2", derived: d, subjects: ["math"], recent: [], mode: "adventure" });
      counts.set(p!.ref.key, (counts.get(p!.ref.key) ?? 0) + 1);
    }
    const others = allUnitRefs("2").filter((r) => r.course.subject === "math" && r.key !== UNIT);
    const avgOther = others.reduce((s, r) => s + (counts.get(r.key) ?? 0), 0) / others.length;
    expect(counts.get(UNIT) ?? 0).toBeLessThan(avgOther);
    const again = pickNext({ grade: "2", derived: d, subjects: ["math"], recent: [UNIT, UNIT], mode: "adventure" });
    expect(again).toBeDefined();
  });

  it("review only picks practised units", () => {
    const d = derive([answer(false, Date.now())]);
    for (let i = 0; i < 50; i++) {
      expect(pickNext({ grade: "2", derived: d, subjects: ["math", "language"], recent: [], mode: "review" })!.ref.key).toBe(UNIT);
    }
  });
});

describe("quests", () => {
  it("are stable per child per day", () => {
    const day = dayKey(Date.now());
    const a = dailyQuests("p1", day, "middle").map((q) => q.id);
    expect(dailyQuests("p1", day, "middle").map((q) => q.id)).toEqual(a);
    expect(a).toHaveLength(3);
  });
});

describe("calm and focus options", () => {
  it("are all off by default", () => {
    const s = defaultChildSettings("p", false);
    for (const key of ["calmMotion", "quietSounds", "hideTimers", "quietToasts", "shortSessions", "roomyText", "highContrast"] as const) expect(Boolean(s[key])).toBe(false);
  });

  it("shorter sessions use five questions in Review and a five-question checkpoint in Adventure", () => {
    const base = { scope: "mix", grade: "2" as const, band: "middle" as const, profileId: "p", subjects: ["math" as const], derived: derive([]), allowed: () => true };
    expect(makePlan({ ...base, mode: "review" })?.total).toBe(10);
    expect(makePlan({ ...base, mode: "review", short: true })?.total).toBe(5);
    expect(makePlan({ ...base, mode: "adventure" })?.checkpoint).toBe(10);
    expect(makePlan({ ...base, mode: "adventure", short: true })?.checkpoint).toBe(5);
  });
});

describe("text contrast helper", () => {
  it("uses dark text on the bright subject colours and white on the dark ones", async () => {
    const { contrast, onColour } = await import("./contrast");
    for (const bg of ["#4f8ef7", "#e9559a", "#25b47e", "#ff9636", "#ffb020", "#06b6d4", "#22b573", "#ff9f43"]) {
      expect(contrast(onColour(bg), bg), bg).toBeGreaterThanOrEqual(4.5);
    }
    expect(onColour("#2f6fd6")).toBe("#ffffff");
    expect(onColour("#253047")).toBe("#ffffff");
  });
});

describe("hints opened before answering", () => {
  const base = { type: "answer" as const, unit: "2/math/tens-and-ones", attempts: 1, revealed: false, ms: 5000, mode: "practice" as const, profileId: "p" };

  it("earn retry XP and no first-try credit, and aren't comebacks", () => {
    const t = Date.now() - 60_000;
    const clean = derive([{ ...base, id: "a", t, correct: true }]);
    const hinted = derive([{ ...base, id: "b", t, correct: false, attempts: 2, hinted: true }]);
    expect(clean.xp).toBe(10);
    expect(hinted.xp).toBe(4);
    expect(hinted.units["2/math/tens-and-ones"].firstTry).toBe(0);
    expect(hinted.totals.hints).toBe(1);
    expect(hinted.totals.comebacks).toBe(0);
    // A real miss followed by a fix still is a comeback.
    expect(derive([{ ...base, id: "c", t, correct: false, attempts: 2 }]).totals.comebacks).toBe(1);
  });

  it("are only free when the parent turns it on", () => {
    expect(defaultChildSettings("p", false).freeHints).toBeFalsy();
  });
});
