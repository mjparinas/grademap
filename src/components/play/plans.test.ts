import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { allUnitRefs, loadGrade, type UnitRef } from "@/content";
import { hashSeed, shuffle, withSeed } from "@/content/random";
import type { SubjectId } from "@/content/types";
import { derive, type UnitStat } from "@/lib/derive";
import { dayKey } from "@/lib/model";
import { makePlan, suggestions, type Plan, type PlanInput } from "./plans";

beforeAll(() => loadGrade("2"));

afterEach(() => {
  vi.restoreAllMocks();
});

const UNIT = "2/math/tens-and-ones";

const input = (over: Partial<PlanInput> & Pick<PlanInput, "mode">): PlanInput => ({
  scope: "mix",
  grade: "2",
  framework: "ca-bc",
  band: "middle",
  profileId: "p",
  subjects: ["math", "language"] satisfies SubjectId[],
  derived: derive([]),
  allowed: () => true,
  ...over,
});

const withMastery = (mastery: number) => {
  const derived = derive([]);
  derived.units[UNIT] = { mastery } as UnitStat;
  return derived;
};

const prompts = (plan: Plan) =>
  Array.from({ length: plan.total ?? 0 }, (_, index) => {
    const item = plan.next({ index, recent: [], derived: derive([]) });
    return `${item?.unitKey}|${item?.difficulty}|${item?.question.prompt}`;
  });

/** The day's units, in subject order: math, language, math, language, and so on. */
function dailyUnitKeys(profileId: string, when: number, subjects: SubjectId[], allowed: (ref: UnitRef) => boolean) {
  return withSeed(hashSeed(`${profileId}:daily:${dayKey(when)}`), () => {
    const refs = allUnitRefs("2", "ca-bc").filter((r) => subjects.includes(r.course.subject) && allowed(r));
    const bySubject = subjects.map((s) => shuffle(refs.filter((r) => r.course.subject === s))).filter((list) => list.length);
    const chosen: string[] = [];
    for (let i = 0; chosen.length < 10 && bySubject.length; i++) {
      const list = bySubject[i % bySubject.length];
      chosen.push(list[Math.floor(i / bySubject.length) % list.length].key);
    }
    return chosen;
  });
}

describe("makePlan", () => {
  it("gives a Challenge ten hard questions, no retries, and a longer clock for little kids", () => {
    const older = makePlan(input({ mode: "challenge", scope: UNIT }));
    expect(older).toMatchObject({ total: 10, timeLimit: 300, retries: false, feedback: "bar" });
    const asked = Array.from({ length: 10 }, (_, index) => older!.next({ index, recent: [], derived: derive([]) }));
    expect(asked.every((item) => item?.difficulty === 3 && item.unitKey === UNIT)).toBe(true);
    expect(older!.next({ index: 10, recent: [], derived: derive([]) })).toBeUndefined();

    const little = makePlan(input({ mode: "challenge", scope: UNIT, band: "little" }));
    expect(little?.timeLimit).toBe(420);
    expect(little?.retries).toBe(false);
  });

  it("sets practice difficulty from how well the unit is going", () => {
    const next = (mastery: number | undefined) => {
      const derived = mastery === undefined ? derive([]) : withMastery(mastery);
      return makePlan(input({ mode: "practice", scope: UNIT, derived }))!.next({ index: 0, recent: [], derived });
    };
    expect(next(undefined)?.difficulty).toBe(2);
    expect(next(0.49)?.difficulty).toBe(1);
    expect(next(0.5)?.difficulty).toBe(2);
    expect(next(0.84)?.difficulty).toBe(2);
    expect(next(0.85)?.difficulty).toBe(3);
    const practice = makePlan(input({ mode: "practice", scope: UNIT }))!;
    expect(practice.retries).toBe(true);
    expect(practice.total).toBeLessThan(10);
    expect(makePlan(input({ mode: "practice", scope: "2/math/not-a-unit" }))).toBeNull();
  });

  it("runs Speed Run as a short flash round with no retries, and only quick questions", () => {
    const run = makePlan(input({ mode: "speed", scope: "math" }));
    expect(run).toMatchObject({ title: "Math Speed Run", timeLimit: 60, retries: false, feedback: "flash" });
    expect(run?.total).toBeUndefined();
    const little = makePlan(input({ mode: "speed", scope: "math", band: "little" }));
    expect(little).toMatchObject({ title: "Numbers Speed Run", timeLimit: 90 });
    expect(makePlan(input({ mode: "speed", scope: "mix" }))?.title).toBe("Speed Run");
    expect(makePlan(input({ mode: "review" }))?.retries).toBe(true);
    expect(makePlan(input({ mode: "adventure" }))?.retries).toBe(true);
    const quick = (kind: string | undefined) => kind === "choice" || kind === "input";
    expect(quick(run!.next({ index: 0, recent: [], derived: derive([]) })?.question.kind)).toBe(true);
    const placeValue = makePlan(input({ mode: "speed", scope: "math", allowed: (ref) => ref.key === UNIT }))!;
    for (let i = 0; i < 20; i++) {
      const kind = placeValue.next({ index: 0, recent: [], derived: derive([]) })?.question.kind;
      expect(quick(kind)).toBe(true);
    }
  });

  it("gives everyone the same Daily Challenge for a day, then a new one the next day", () => {
    const now = vi.spyOn(Date, "now").mockReturnValue(new Date(2026, 9, 10, 12).getTime());
    const first = makePlan(input({ mode: "daily" }))!;
    const again = makePlan(input({ mode: "daily" }))!;
    expect(first).toMatchObject({ total: 10, retries: true, feedback: "bar" });
    expect(first.timeLimit).toBeUndefined();
    const today = prompts(first);
    const keys = today.map((line) => line.split("|")[0]);
    expect(today).toHaveLength(10);
    expect(keys).toEqual(dailyUnitKeys("p", new Date(2026, 9, 10, 12).getTime(), ["math", "language"], () => true));
    expect(keys.filter((key) => key.startsWith("2/math/")).length).toBeGreaterThan(0);
    expect(keys.filter((key) => key.startsWith("2/language/")).length).toBeGreaterThan(0);
    expect(today.every((line) => line.includes("|2|"))).toBe(true);
    expect(prompts(again)).toEqual(today);
    expect(makePlan(input({ mode: "daily", subjects: ["math"], allowed: () => false }))?.total).toBe(0);

    now.mockReturnValue(new Date(2026, 9, 12, 12).getTime());
    expect(prompts(makePlan(input({ mode: "daily" }))!)).not.toEqual(today);

    now.mockReturnValue(new Date(2026, 9, 10, 12).getTime());
    expect(prompts(makePlan(input({ mode: "daily", profileId: "someone-else" }))!)).not.toEqual(today);
  });
});

describe("suggestions", () => {
  const math = () => allUnitRefs("2", "ca-bc").filter((r) => r.course.subject === "math");

  it("leads with one weak unit, then units not started yet", () => {
    const refs = math();
    const derived = derive([]);
    const weak = refs.slice(0, 3);
    for (const unit of weak) derived.units[unit.key] = { mastery: 0.4 } as UnitStat;
    const picked = suggestions("2", "ca-bc", derived, ["math"], () => true);
    const weakKeys = new Set(weak.map((unit) => unit.key));
    expect(picked).toHaveLength(3);
    expect(picked.filter((unit) => weakKeys.has(unit.key))).toHaveLength(1);
    expect(picked.filter((unit) => !derived.units[unit.key])).toHaveLength(2);
    expect(picked.every((r) => r.course.subject === "math")).toBe(true);
  });

  it("skips units at 70% or better, units the filter closes, and other subjects", () => {
    const refs = math();
    const derived = derive([]);
    for (const r of refs) derived.units[r.key] = { mastery: 0.7 } as UnitStat;
    expect(suggestions("2", "ca-bc", derived, ["math"], () => true)).toEqual([]);

    const open = derive([]);
    const blocked = refs[0].key;
    const picked = suggestions("2", "ca-bc", open, ["math"], (r) => r.key !== blocked, 5);
    expect(picked.some((r) => r.key === blocked)).toBe(false);
    expect(picked.every((r) => r.key.startsWith("2/math/"))).toBe(true);
  });
});
