import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { allUnitRefs, loadGrade } from "@/content";
import type { SubjectId } from "@/content/types";
import { derive, type UnitStat } from "@/lib/derive";
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
    expect(makePlan(input({ mode: "practice", scope: "2/math/not-a-unit" }))).toBeNull();
  });

  it("runs Speed Run as a short flash round with no retries, and only quick questions", () => {
    const run = makePlan(input({ mode: "speed", scope: "math" }));
    expect(run).toMatchObject({ title: "Math Speed Run", timeLimit: 60, retries: false, feedback: "flash" });
    expect(run?.total).toBeUndefined();
    const little = makePlan(input({ mode: "speed", scope: "math", band: "little" }));
    expect(little).toMatchObject({ title: "Numbers Speed Run", timeLimit: 90 });
    const item = run!.next({ index: 0, recent: [], derived: derive([]) });
    expect(item?.question.kind === "choice" || item?.question.kind === "input").toBe(true);
  });

  it("gives everyone the same Daily Challenge for a day, then a new one the next day", () => {
    const now = vi.spyOn(Date, "now").mockReturnValue(new Date(2026, 9, 10, 12).getTime());
    const first = makePlan(input({ mode: "daily" }))!;
    const again = makePlan(input({ mode: "daily" }))!;
    expect(first).toMatchObject({ total: 10, retries: true, feedback: "bar" });
    expect(first.timeLimit).toBeUndefined();
    const today = prompts(first);
    expect(today).toHaveLength(10);
    expect(today.every((line) => line.startsWith("2/") && line.includes("|2|"))).toBe(true);
    expect(prompts(again)).toEqual(today);

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
    const weak = refs[2];
    derived.units[weak.key] = { mastery: 0.4 } as UnitStat;
    const picked = suggestions("2", "ca-bc", derived, ["math"], () => true);
    expect(picked.map((r) => r.key)[0]).toBe(weak.key);
    expect(picked).toHaveLength(3);
    expect(picked.slice(1).every((r) => !derived.units[r.key])).toBe(true);
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
