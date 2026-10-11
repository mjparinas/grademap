import { describe, expect, it } from "vitest";
import type { Derived, UnitStat } from "./derive";
import { nextUp } from "./nextup";
import { questionsToNextLevel, unitLevel } from "./proficiency";

const stat = (key: string, recent: boolean[], extra: Partial<UnitStat> = {}): UnitStat => ({
  key, attempts: recent.length, firstTry: recent.filter(Boolean).length, recent, mastery: 0.5, lastT: 1, sessions: 1,
  challengePassed: false, ms: 0, wasEmerging: false, grew: false, returnLeft: 0, kept: false, ...extra,
});
const derived = (units: UnitStat[]) => ({ units: Object.fromEntries(units.map((u) => [u.key, u])) }) as unknown as Derived;

describe("questionsToNextLevel", () => {
  it("counts the all-right answers that lift a unit one level", () => {
    const s = stat("u", [true, false, false, true, true, true, false]); // 4/7: Developing
    const step = questionsToNextLevel(s)!;
    expect(unitLevel(s)).toBe(1);
    expect(step.level).toBe(2);
    expect(step.questions).toBeGreaterThan(0);
    const after = { ...s, attempts: s.attempts + step.questions, recent: [...s.recent, ...Array<boolean>(step.questions).fill(true)] };
    expect(unitLevel(after)).toBe(2);
    const before = { ...s, attempts: s.attempts + step.questions - 1, recent: [...s.recent, ...Array<boolean>(step.questions - 1).fill(true)] };
    expect(unitLevel(before)).toBe(1);
  });
  it("has nothing to say for new units, Stars, or Proficient units that still need a Challenge", () => {
    expect(questionsToNextLevel(undefined)).toBeNull();
    expect(questionsToNextLevel(stat("u", Array(20).fill(true), { challengePassed: true }))).toBeNull();
    expect(questionsToNextLevel(stat("u", Array(20).fill(true)))).toBeNull();
  });
});

describe("nextUp", () => {
  it("picks the unit closest to growing, preferring the one practised most recently", () => {
    const close = stat("a", [true, true, true, true, true, true, true]); // one answer from Proficient
    const far = stat("b", [true, false, false]);
    expect(nextUp(derived([far, close]), ["a", "b"])?.key).toBe("a");
    expect(nextUp(derived([close, far]), ["b", "z"])?.key).toBe("b");
    expect(nextUp(derived([]), ["a"])).toBeNull();
  });
  it("breaks a tie with the unit practised most recently, whatever the order", () => {
    const older = stat("a", Array(7).fill(true), { lastT: 1 });
    const newer = stat("b", Array(7).fill(true), { lastT: 2 });
    expect(nextUp(derived([older, newer]), ["a", "b"])).toEqual({ key: "b", questions: 1, level: 2 });
    expect(nextUp(derived([older, newer]), ["b", "a"])?.key).toBe("b");
  });
  it("prefers the closer unit over a more recent one, whatever the order", () => {
    const close = stat("a", Array(7).fill(true), { lastT: 1 });
    const far = stat("b", Array(6).fill(false), { lastT: 2 });
    expect(questionsToNextLevel(far)!.questions).toBeGreaterThan(1);
    expect(nextUp(derived([close, far]), ["a", "b"])?.key).toBe("a");
    expect(nextUp(derived([close, far]), ["b", "a"])?.key).toBe("a");
  });
});
