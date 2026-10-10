import { describe, expect, it } from "vitest";
import { classInsights, type StudentRow } from "./classroom";

const DAY = 86_400_000;
const NOW = 100 * DAY;
const unit = (key: string, attempts: number, accuracy: number, level = 0) => ({ key, attempts, accuracy, level });
const student = (profileId: string, units: StudentRow["units"], lastActive: number | null = NOW - DAY): StudentRow => ({ profileId, name: profileId.toUpperCase(), avatar: "ollie", grade: "3", lastActive, units });
const name = (k: string) => k.split("/")[2];

describe("classInsights", () => {
  it("flags a unit when a good share of those who tried it are struggling", () => {
    const students = [
      student("a", [unit("3/math/fractions", 10, 0.4), unit("3/math/time", 10, 0.9, 2)]),
      student("b", [unit("3/math/fractions", 12, 0.5), unit("3/math/time", 8, 0.8, 2)]),
      student("c", [unit("3/math/fractions", 10, 0.9, 2), unit("3/math/time", 0, 0)]),
    ];
    const r = classInsights(students, ["3/math/fractions", "3/math/time"], name, NOW);
    expect(r.focusUnits.map((u) => u.key)).toEqual(["3/math/fractions"]);
    expect(r.units[0].needHand).toEqual(["a", "b"]);
    expect(r.units[1]).toMatchObject({ started: 2, notStarted: 1, proficient: 2 });
    expect(r.checkIn.map((s) => s.name)).toEqual(["A", "B"]);
    expect(r.checkIn[0].reasons[0]).toBe("Finding fractions tricky");
  });

  it("ignores a low score on too few questions", () => {
    const r = classInsights([student("a", [unit("3/math/time", 3, 0)])], ["3/math/time"], name, NOW);
    expect(r.focusUnits).toEqual([]);
    expect(r.checkIn).toEqual([]);
  });

  it("checks in with students who haven't practised in a week, or not at all", () => {
    const r = classInsights([student("a", [unit("3/math/time", 5, 0.9, 2)], NOW - 9 * DAY), student("b", [unit("3/math/time", 0, 0)], null)], ["3/math/time"], name, NOW);
    expect(r.checkIn).toEqual([
      { profileId: "a", name: "A", reasons: ["No practice this week"] },
      { profileId: "b", name: "B", reasons: ["Hasn’t started yet"] },
    ]);
  });

  it("flags no one when nothing is assigned", () => {
    expect(classInsights([student("a", [], null)], [], name, NOW).checkIn).toEqual([]);
  });
});
