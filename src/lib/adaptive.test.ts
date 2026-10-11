import { beforeAll, describe, expect, it } from "vitest";
import { allUnitRefs, loadGrade, type UnitRef } from "@/content";
import type { SubjectId } from "@/content/types";
import { candidates, difficultyFor, pickNext, refresherUnit, REFRESHER_DAYS, unitWeight, weakest, type PickOptions } from "./adaptive";
import type { Derived, UnitStat } from "./derive";

beforeAll(() => loadGrade("2"));

const DAY = 86_400_000;
const NOW = new Date("2026-10-10T12:00:00").getTime();

const stat = (attempts: number, mastery: number, daysAgo = 0): Partial<UnitStat> => ({ attempts, mastery, lastT: NOW - daysAgo * DAY });
const derived = (units: Record<string, Partial<UnitStat>> = {}) => ({ units }) as unknown as Derived;
const ref = (key: string) => ({ key, course: { subject: key.split("/")[1] as SubjectId } }) as UnitRef;
const opts = (over: Partial<PickOptions> = {}): PickOptions => ({
  grade: "2", framework: "ca-bc", derived: derived(), subjects: ["math", "language"], recent: [], mode: "adventure", now: NOW, ...over,
});
const weight = (mode: PickOptions["mode"], s?: Partial<UnitStat>, recent: string[] = []) =>
  unitWeight(opts({ mode, recent, derived: derived(s ? { "2/math/a": s } : {}) }), ref("2/math/a"));

describe("unitWeight", () => {
  it("weighs Adventure units by need, novelty and spacing", () => {
    expect(weight("adventure")).toBeCloseTo(0.15 + 1.6 + 1.2);
    // need = (1 - 0.75)^1.5 = 0.125; 5 attempts is the middle novelty band; 3.5 days is half spaced.
    expect(weight("adventure", stat(5, 0.75, 3.5))).toBeCloseTo(0.15 + 0.2 + 0.4 + 0.3);
    expect(weight("adventure", stat(4, 1))).toBeCloseTo(0.15 + 1.2);
    expect(weight("adventure", stat(11, 1))).toBeCloseTo(0.15 + 0.4);
    expect(weight("adventure", stat(12, 1))).toBeCloseTo(0.15);
    expect(weight("adventure", stat(12, 1, 14))).toBeCloseTo(0.15 + 0.6);
  });

  it("only weighs practised units in Review, favouring weak and stale ones", () => {
    expect(weight("review")).toBe(0);
    expect(weight("review", stat(3, 0.75, 7))).toBeCloseTo(0.05 + 0.25 + 1.5);
    expect(weight("review", stat(3, 1, 30))).toBeCloseTo(0.05 + 1.5);
  });

  it("favours known units in Speed Run", () => {
    expect(weight("speed")).toBeCloseTo(0.2);
    expect(weight("speed", stat(3, 0.6))).toBeCloseTo(0.9);
  });

  it("damps a unit seen in the last two questions and a subject seen twice in a row", () => {
    const fresh = weight("adventure");
    expect(weight("adventure", undefined, ["2/math/a", "2/language/b"])).toBeCloseTo(fresh * 0.08);
    expect(weight("adventure", undefined, ["2/math/a", "2/language/b", "2/language/c"])).toBeCloseTo(fresh);
    expect(weight("adventure", undefined, ["2/math/b", "2/math/c"])).toBeCloseTo(fresh * 0.4);
    expect(weight("adventure", undefined, ["2/math/b", "2/language/c"])).toBeCloseTo(fresh);
    expect(weight("adventure", undefined, ["2/math/b", "2/math/a"])).toBeCloseTo(fresh * 0.08 * 0.4);
  });
});

describe("difficultyFor", () => {
  it("steps up at 50% and 80% mastery, one step easier in Review and Speed Run", () => {
    expect([0.49, 0.5, 0.79, 0.8].map((m) => difficultyFor(m, "adventure"))).toEqual([1, 2, 2, 3]);
    expect([0.3, 0.5, 0.8].map((m) => difficultyFor(m, "review"))).toEqual([1, 1, 2]);
    expect([0.3, 0.5, 0.8].map((m) => difficultyFor(m, "speed"))).toEqual([1, 1, 2]);
  });
});

describe("candidates", () => {
  it("filters by the child's subjects, one chosen subject and the allowed units", () => {
    const all = allUnitRefs("2", "ca-bc");
    const subjectsOf = (refs: UnitRef[]) => [...new Set(refs.map((r) => r.course.subject))].sort();
    expect(subjectsOf(candidates(opts()))).toEqual(["language", "math"]);
    expect(subjectsOf(candidates(opts({ subject: "language" })))).toEqual(["language"]);
    expect(candidates(opts({ subjects: ["math"] }))).toEqual(all.filter((r) => r.course.subject === "math"));
    const first = all.find((r) => r.course.subject === "math")!;
    expect(candidates(opts({ allowed: (r) => r.key === first.key }))).toEqual([first]);
  });
});

describe("pickNext", () => {
  const math = () => allUnitRefs("2", "ca-bc").filter((r) => r.course.subject === "math");

  it("rolls along the weights: equal weights split at exactly half", () => {
    const [a, b] = math();
    const two = { allowed: (r: UnitRef) => r.key === a.key || r.key === b.key };
    expect(pickNext(opts({ ...two, random: () => 0 }))!.ref.key).toBe(a.key);
    expect(pickNext(opts({ ...two, random: () => 0.5 }))!.ref.key).toBe(a.key);
    expect(pickNext(opts({ ...two, random: () => 0.5000001 }))!.ref.key).toBe(b.key);
    expect(pickNext(opts({ ...two, random: () => 0.9999999 }))!.ref.key).toBe(b.key);
  });

  it("returns nothing when no unit is allowed", () => {
    expect(pickNext(opts({ allowed: () => false, random: () => 0 }))).toBeUndefined();
  });

  it("falls back to an Adventure-style pick when nothing has been practised for Review", () => {
    const pick = pickNext(opts({ mode: "review", random: () => 0 }));
    expect(pick?.ref.key).toBe(candidates(opts())[0].key);
    expect(pick?.difficulty).toBe(1);
  });

  it("sets the difficulty from the unit's mastery and the mode", () => {
    const [a] = math();
    const only = { allowed: (r: UnitRef) => r.key === a.key, derived: derived({ [a.key]: stat(10, 0.85) }), random: () => 0 };
    expect(pickNext(opts(only))!.difficulty).toBe(3);
    expect(pickNext(opts({ ...only, mode: "review" }))!.difficulty).toBe(2);
  });
});

describe("weakest", () => {
  it("lists practised units from lowest mastery, up to n", () => {
    const [a, b, c] = allUnitRefs("2", "ca-bc").filter((r) => r.course.subject === "math");
    const d = derived({ [a.key]: stat(5, 0.9), [b.key]: stat(5, 0.2), [c.key]: stat(5, 0.5) });
    const keys = (n?: number) => weakest({ grade: "2", framework: "ca-bc", derived: d, subjects: ["math"], now: NOW }, n).map((r) => r.key);
    expect(keys()).toEqual([b.key, c.key, a.key]);
    expect(keys(2)).toEqual([b.key, c.key]);
  });
});

describe("refresherUnit", () => {
  it("offers a Proficient unit from exactly two weeks untouched", () => {
    const [a] = allUnitRefs("2", "ca-bc").filter((r) => r.course.subject === "math");
    const proficient = (lastT: number) => ({ attempts: 10, recent: Array(10).fill(true), challengePassed: false, mastery: 1, lastT });
    const offer = (lastT: number) => refresherUnit({ grade: "2", framework: "ca-bc", derived: derived({ [a.key]: proficient(lastT) }), subjects: ["math"], now: NOW })?.key;
    expect(offer(NOW - REFRESHER_DAYS * DAY)).toBe(a.key);
    expect(offer(NOW - REFRESHER_DAYS * DAY + 1)).toBeUndefined();
  });
});
