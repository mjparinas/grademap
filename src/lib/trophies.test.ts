import { beforeAll, describe, expect, it } from "vitest";
import { allUnitRefs, loadGrade } from "@/content";
import { FRAMEWORKS } from "@/content/frameworks";
import type { GradeId, SubjectId } from "@/content/types";
import { derive, type Derived, type UnitStat } from "./derive";
import { SHOP } from "./shop";
import { ARCADE_GAMES, getTrophy, newlyEarned, TIER_STYLE, TROPHIES, trophyTier, visibleTrophies, type TrophyContext } from "./trophies";

const GRADES: GradeId[] = ["k", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const CONTEXTS: TrophyContext[] = FRAMEWORKS.flatMap((f) => GRADES.map((grade) => ({ grade, framework: f.id })));

beforeAll(() => Promise.all(CONTEXTS.map((c) => loadGrade(c.grade, c.framework))), 60_000);

const BIG = 1_000_000;
const SUBJECTS: SubjectId[] = ["math", "language", "science", "social", "immersion", "core-french"];

const unitAt = (key: string, level: 2 | 3): UnitStat => ({
  key, attempts: 20, firstTry: 20, recent: Array(20).fill(true), mastery: 1, lastT: 0, sessions: 1,
  challengePassed: level === 3, ms: 0, wasEmerging: true, grew: true, returnLeft: 0, kept: true,
});

/** A child who has done everything there is to do, with every unit of every grade at `level`. */
function didEverything(level: 2 | 3): Derived {
  const d = derive([]);
  const keys = [...new Set(CONTEXTS.flatMap((c) => allUnitRefs(c.grade, c.framework).map((r) => r.key)))];
  d.units = Object.fromEntries(keys.map((k) => [k, unitAt(k, level)]));
  Object.assign(d.totals, { answers: BIG, correct: BIG, sessions: BIG, perfectSessions: BIG, learnSeconds: BIG * 60, bestRun: BIG, comebacks: BIG });
  d.subjects = Object.fromEntries(SUBJECTS.map((s) => [s, { answers: BIG, correct: BIG }]));
  d.modes = { practice: BIG, adventure: BIG, review: BIG, speed: BIG, daily: BIG, challenge: BIG };
  d.modeAnswers = { ...d.modes };
  d.streak = { ...d.streak, best: BIG, shieldsUsed: 1 };
  d.dailyDone = Array.from({ length: 1000 }, (_, i) => `day-${i}`);
  d.speedBest = { mix: BIG };
  d.gameBest = Object.fromEntries(ARCADE_GAMES.map((g) => [g, BIG]));
  d.gamesPlayed = Object.fromEntries(ARCADE_GAMES.map((g) => [g, 1]));
  d.days = { "2026-10-01": { day: "2026-10-01", learnSeconds: 0, answers: BIG, correct: BIG, sessions: 1, perfect: 0, playSeconds: 0, bestRun: 0, subjects: {}, modes: {} } };
  d.level = BIG;
  d.owned = SHOP.map((i) => i.id);
  d.coinsEarned = BIG;
  d.earlySessions = 1;
  d.wishSessions = 1;
  d.activeDays = BIG;
  d.secrets = ["konami", "dizzy-ollie", "polite-moose", "secret-word"];
  return d;
}

describe("trophy progress", () => {
  it("earns nothing before any practice", () => {
    const empty = derive([]);
    // Every child starts at level 1 with the free buddies.
    const start = (id: string) => (id.startsWith("level-") ? 1 : id === "critter-party" ? SHOP.filter((i) => i.kind === "companion" && i.cost === 0).length : 0);
    for (const ctx of CONTEXTS) {
      for (const t of visibleTrophies(empty, ctx)) {
        const p = t.progress(empty, ctx);
        expect(p.value, `${t.id} in ${ctx.framework} ${ctx.grade}`).toBe(start(t.id));
        expect(p.target, t.id).toBeGreaterThanOrEqual(1);
      }
      expect(newlyEarned(empty, ctx)).toEqual([]);
    }
  });

  it("lets a child who has done everything earn every trophy they can see, with progress exactly at the goal", () => {
    const d = didEverything(3);
    for (const ctx of CONTEXTS) {
      const visible = visibleTrophies(d, ctx);
      for (const t of visible) {
        const p = t.progress(d, ctx);
        expect(p.value, `${t.id} in ${ctx.framework} ${ctx.grade}`).toBe(p.target);
      }
      expect(newlyEarned(d, ctx).map((t) => t.id)).toEqual(visible.map((t) => t.id));
    }
  });

  it("needs Extending, not just Proficient, for the Extending trophies", () => {
    const d = didEverything(2);
    const ctx: TrophyContext = { grade: "4", framework: "ca-bc" };
    const earned = newlyEarned(d, ctx).map((t) => t.id);
    expect(earned).toEqual(expect.arrayContaining(["proficient-1", "proficient-10", "proficient-25", "grade-champion-4", "master-math-4"]));
    for (const id of ["extending-1", "extending-5", "extending-15", "extending-30", "french-extending-1"]) expect(earned).not.toContain(id);
  });

  it("only counts core subjects toward Grade Champion", () => {
    const ctx: TrophyContext = { grade: "4", framework: "ca-bc" };
    const champion = TROPHIES.find((t) => t.id === "grade-champion-4")!;
    const d = derive([]);
    d.units = Object.fromEntries(allUnitRefs("4", "ca-bc").filter((r) => ["immersion", "core-french"].includes(r.course.subject)).map((r) => [r.key, unitAt(r.key, 3)]));
    expect(Object.keys(d.units).length).toBeGreaterThan(0);
    expect(champion.progress(d, ctx).value).toBe(0);
  });

  it("sets each counting trophy's goal to the number in its id", () => {
    const empty = derive([]);
    const ctx: TrophyContext = { grade: "4", framework: "ca-bc" };
    const counted = TROPHIES.filter((t) => !t.grade && /-\d+$/.test(t.id));
    expect(counted.length).toBeGreaterThan(60);
    for (const t of counted) expect(t.progress(empty, ctx).target, t.id).toBe(Number(t.id.split("-").pop()));
  });
});

describe("the trophy list", () => {
  it("has 186 trophies with the secret ones hidden", () => {
    expect(TROPHIES).toHaveLength(186);
    expect(TROPHIES.filter((t) => t.hidden).map((t) => t.id).sort()).toEqual(
      ["early-bird", "konami", "marathon", "dizzy-ollie", "polite-moose", "secret-word", "palindrome", "make-a-wish", ...GRADES.map((g) => `polymath-${g}`)].sort(),
    );
  });

  it("has a practice ladder per subject: 100, 500 and 2,000 for the core four, 250 for each French", () => {
    const ladder = (subject: string) => TROPHIES.filter((t) => t.id.startsWith(`subject-${subject}-`)).map((t) => [t.id, t.tier, t.category]);
    for (const s of ["math", "language", "science", "social"]) {
      expect(ladder(s)).toEqual([[`subject-${s}-100`, "bronze", "Practice"], [`subject-${s}-500`, "silver", "Practice"], [`subject-${s}-2000`, "gold", "Practice"]]);
    }
    for (const s of ["immersion", "core-french"]) expect(ladder(s)).toEqual([[`subject-${s}-250`, "silver", "French"]]);
    expect(getTrophy("subject-math-2000")).toMatchObject({ name: "Math Legend", icon: "♾️", description: "Get 2,000 Math questions right." });
  });

  it("names grade trophies after the grade", () => {
    expect(getTrophy("master-math-k")?.name).toBe("Math Master · Kindergarten");
    expect(getTrophy("grade-champion-4")).toMatchObject({ name: "Grade 4 Champion", tier: "platinum", grade: "4" });
    expect(getTrophy("polymath-9")?.description).toBe("Reach Proficient in 3 units of every subject in Grade 9.");
  });

  it("looks up trophies and their tiers by id", () => {
    for (const t of TROPHIES) {
      expect(getTrophy(t.id)).toBe(t);
      expect(trophyTier(t.id)).toBe(t.tier);
    }
    expect(getTrophy("no-such-trophy")).toBeUndefined();
    expect(trophyTier("no-such-trophy")).toBeUndefined();
  });

  it("labels every tier", () => {
    expect(Object.fromEntries(Object.entries(TIER_STYLE).map(([tier, s]) => [tier, s.label]))).toEqual({ bronze: "Bronze", silver: "Silver", gold: "Gold", platinum: "Platinum" });
  });
});

describe("trophies that count units or time", () => {
  const ctx: TrophyContext = { grade: "4", framework: "ca-bc" };
  const value = (id: string, d: Derived) => getTrophy(id)!.progress(d, ctx).value;

  it("counts whole minutes of learning", () => {
    const d = derive([]);
    d.totals.learnSeconds = 3599;
    expect(value("minutes-60", d)).toBe(59);
    d.totals.learnSeconds = 3600;
    expect(value("minutes-60", d)).toBe(60);
    for (const id of ["minutes-600", "minutes-3000", "minutes-6000", "minutes-15000"]) expect(value(id, d), id).toBe(60);
  });

  it("only counts units that passed a Challenge, grew or were kept", () => {
    const d = derive([]);
    d.units = { a: { ...unitAt("a", 2), grew: false, kept: false }, b: unitAt("b", 3) };
    for (const id of ["challenge-1", "challenge-10", "grew-1", "grew-5", "kept-1", "kept-5"]) expect(value(id, d), id).toBe(1);
    d.units = { a: d.units.a };
    for (const id of ["challenge-1", "grew-1", "kept-1"]) expect(value(id, d), id).toBe(0);
  });
});

describe("which trophies are earned", () => {
  it("skips trophies already earned and other grades' mastery trophies", () => {
    const d = didEverything(3);
    d.trophies = { "first-answer": 1 };
    const ids = newlyEarned(d, { grade: "4", framework: "ca-bc" }).map((t) => t.id);
    expect(ids).not.toContain("first-answer");
    expect(ids).toContain("first-lesson");
    expect(ids).toContain("master-math-4");
    expect(ids).not.toContain("master-math-5");
  });

  it("only shows French trophies where the grade and curriculum teach French", () => {
    const ids = (grade: GradeId, framework: TrophyContext["framework"]) => visibleTrophies(derive([]), { grade, framework }).map((t) => t.id);
    const french = ["french-first", "french-100", "french-500", "french-proficient-1", "french-proficient-5", "french-extending-1"];
    expect(ids("k", "ca-bc")).toEqual(expect.arrayContaining([...french, "subject-immersion-250"]));
    expect(ids("k", "ca-bc")).not.toContain("subject-core-french-250");
    expect(ids("5", "ca-bc")).toContain("subject-core-french-250");
    for (const id of [...french, "subject-immersion-250", "subject-core-french-250"]) {
      expect(ids("k", "ca-on"), id).not.toContain(id);
      expect(ids("4", "ca-sk"), id).not.toContain(id);
    }
    expect(ids("4", "ca-sk")).toContain("subject-math-100");
  });

  it("keeps showing an earned trophy even when it no longer applies", () => {
    const d = derive([]);
    d.trophies = { "master-math-5": 1 };
    expect(visibleTrophies(d, { grade: "4", framework: "ca-bc" }).map((t) => t.id)).toContain("master-math-5");
  });
});
