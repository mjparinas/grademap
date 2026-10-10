import { describe, expect, it } from "vitest";
import type { UnitStat } from "./derive";
import { NOT_STARTED, nextStep, unitLevel } from "./proficiency";

const stat = (attempts: number, right: number, of: number, challengePassed = false): UnitStat => ({
  key: "4/math/fractions",
  attempts,
  firstTry: right,
  recent: Array.from({ length: of }, (_, i) => i < right),
  mastery: 0,
  lastT: 0,
  sessions: 0,
  challengePassed,
  ms: 0,
  wasEmerging: false,
  grew: false,
  returnLeft: 0,
  kept: false,
});

describe("unitLevel follows the proficiency table at its boundaries", () => {
  it("is not started with no attempts", () => {
    expect(unitLevel(undefined)).toBe(NOT_STARTED);
    expect(unitLevel(stat(0, 0, 0))).toBe(NOT_STARTED);
  });

  it("gives Developing at 75% and Emerging below it for fewer than 4 attempts", () => {
    expect(unitLevel(stat(3, 3, 4))).toBe(1);
    expect(unitLevel(stat(3, 2, 3))).toBe(0);
    expect(unitLevel(stat(3, 1, 2))).toBe(0);
    expect(unitLevel(stat(4, 1, 2))).toBe(1);
  });

  it("needs 75% and 8 attempts for Proficient", () => {
    expect(unitLevel(stat(8, 15, 20))).toBe(2);
    expect(unitLevel(stat(7, 15, 20))).toBe(1);
    expect(unitLevel(stat(8, 14, 20))).toBe(1);
  });

  it("needs 90%, 16 attempts and a passed Challenge for Extending", () => {
    expect(unitLevel(stat(16, 18, 20, true))).toBe(3);
    expect(unitLevel(stat(15, 18, 20, true))).toBe(2);
    expect(unitLevel(stat(16, 17, 20, true))).toBe(2);
    expect(unitLevel(stat(16, 20, 20, false))).toBe(2);
    expect(unitLevel(stat(16, 10, 20, true))).toBe(1);
  });

  it("gives Developing at 50% and Emerging below it", () => {
    expect(unitLevel(stat(8, 10, 20))).toBe(1);
    expect(unitLevel(stat(8, 9, 20))).toBe(0);
  });
});

describe("nextStep says what the next level needs", () => {
  it("covers every level", () => {
    expect(nextStep(undefined)).toBe("Play a lesson to get started!");
    expect(nextStep(stat(16, 18, 20, true))).toMatch(/star at this/);
    expect(nextStep(stat(8, 15, 20))).toBe("Get 9 out of 10 right to reach the next level.");
    expect(nextStep(stat(15, 18, 20))).toBe("Keep practising to reach the next level.");
    expect(nextStep(stat(16, 18, 20))).toBe("Pass a Challenge to become a Star!");
    expect(nextStep(stat(7, 15, 20))).toBe("Keep practising to grow!");
    expect(nextStep(stat(8, 10, 20))).toBe("Get 3 out of 4 right to grow into a tree.");
    expect(nextStep(stat(8, 9, 20))).toBe("Every try helps you grow. Keep going!");
  });
});
