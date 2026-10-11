import { beforeAll, describe, expect, it } from "vitest";
import { allUnitRefs, loadGrade } from "@/content";
import { getFramework } from "@/content/frameworks";
import { derive, type Derived, type UnitStat } from "./derive";
import { levelInfo, NOT_STARTED, nextStep, questionsToNextLevel, subjectSummaries, unitLevel, unitsAtLeast } from "./proficiency";

beforeAll(() => loadGrade("2"));

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

describe("levelInfo", () => {
  it("reads the level from the framework's scale, with nothing for not started", () => {
    const levels = getFramework("ca-bc").scoringFor("2").levels;
    expect(levelInfo("ca-bc", "2", NOT_STARTED)).toBeUndefined();
    expect(levelInfo("ca-bc", "2", 0)).toBe(levels[0]);
    expect(levelInfo("ca-bc", "2", 3)).toBe(levels[3]);
  });
});

/** Stats that `unitLevel` reads as the given level (0 Emerging to 3 Extending). */
const at = (level: 0 | 1 | 2 | 3) => [stat(8, 8, 20), stat(8, 10, 20), stat(8, 15, 20), stat(16, 18, 20, true)][level];
const derivedWith = (levels: Record<string, 0 | 1 | 2 | 3>) =>
  ({ ...derive([]), units: Object.fromEntries(Object.entries(levels).map(([k, l]) => [k, { ...at(l), key: k }])) }) as Derived;
const unitsOf = (subject: string) => allUnitRefs("2", "ca-bc").filter((r) => r.course.subject === subject).map((r) => r.key);

describe("subjectSummaries", () => {
  it("gives each core subject its started count, total, middle level and level counts", () => {
    const [m1, m2, m3] = unitsOf("math");
    const [l1, l2] = unitsOf("language");
    const byId = Object.fromEntries(subjectSummaries(derivedWith({ [m1]: 0, [m2]: 3, [m3]: 2, [l1]: 1, [l2]: 3 }), "2", "ca-bc").map((s) => [s.subject, s]));
    expect(Object.keys(byId).sort()).toEqual(["language", "math", "science", "social"]);
    expect(byId.math).toEqual({ subject: "math", started: 3, total: unitsOf("math").length, level: 2, counts: [1, 0, 1, 1] });
    // With an even number started, the lower middle level is shown.
    expect(byId.language).toMatchObject({ started: 2, level: 1, counts: [0, 1, 0, 1] });
    expect(byId.science).toMatchObject({ started: 0, level: NOT_STARTED, counts: [0, 0, 0, 0] });
  });

  it("adds French once it's started, counting only started lessons", () => {
    const [f] = unitsOf("immersion");
    const french = subjectSummaries(derivedWith({ [f]: 2 }), "2", "ca-bc").find((s) => s.subject === "immersion");
    expect(french).toEqual({ subject: "immersion", started: 1, total: 1, level: 2, counts: [0, 0, 1, 0] });
  });
});

describe("unitsAtLeast", () => {
  it("counts core units at or above a level, or one subject's", () => {
    const [m1, m2] = unitsOf("math");
    const [f] = unitsOf("immersion");
    const d = derivedWith({ [m1]: 2, [m2]: 1, [f]: 3 });
    expect(unitsAtLeast(d, "2", "ca-bc", 2)).toBe(1);
    expect(unitsAtLeast(d, "2", "ca-bc", 1)).toBe(2);
    expect(unitsAtLeast(d, "2", "ca-bc", 2, "immersion")).toBe(1);
    expect(unitsAtLeast(d, "2", "ca-bc", 1, "math")).toBe(2);
    expect(unitsAtLeast(d, "2", "ca-bc", 1, "language")).toBe(0);
  });
});

describe("questionsToNextLevel", () => {
  it("counts the right answers to the next level", () => {
    expect(questionsToNextLevel(stat(7, 7, 7))).toEqual({ questions: 1, level: 2 });
    expect(questionsToNextLevel(stat(20, 0, 20))).toEqual({ questions: 10, level: 1 });
  });

  it("has no count for a unit not started or already a Star", () => {
    expect(questionsToNextLevel(stat(0, 0, 0))).toBeNull();
    expect(questionsToNextLevel(at(3))).toBeNull();
  });
});
