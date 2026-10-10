import { describe, expect, it } from "vitest";
import { derive } from "./derive";
import { effectiveGoal, goalOptions } from "./goal";
import { defaultChildSettings, dayKey, type AppEvent } from "./model";

const day = dayKey(Date.now());
const pick = (level: "easy" | "regular" | "stretch", minutes: number, id = "g1", t = Date.now()): AppEvent => ({ id, profileId: "p1", t, type: "goal", day, level, minutes });

describe("daily goal choices", () => {
  it("offers a lighter and a longer goal around the parent's", () => {
    expect(goalOptions(15)).toEqual({ easy: 10, regular: 15, stretch: 20 });
    expect(goalOptions(10)).toEqual({ easy: 5, regular: 10, stretch: 15 });
    expect(goalOptions(5)).toEqual({ easy: 5, regular: 5, stretch: 10 });
    expect(goalOptions(60).stretch).toBe(60);
  });
  it("uses the parent's goal until a pick is made, and the latest pick after", () => {
    const s = defaultChildSettings("p1", false);
    expect(effectiveGoal(s, derive([]), day)).toEqual({ minutes: 15, level: "regular" });
    const d = derive([pick("stretch", 20, "a", Date.now() - 1000), pick("easy", 10, "b")]);
    expect(effectiveGoal(s, d, day)).toEqual({ minutes: 10, level: "easy" });
  });
  it("ignores picks when a parent turns the choice off", () => {
    const s = { ...defaultChildSettings("p1", false), lockGoal: true };
    expect(effectiveGoal(s, derive([pick("stretch", 20)]), day)).toEqual({ minutes: 15, level: "regular" });
  });
  it("ignores a pick from another day", () => {
    const s = defaultChildSettings("p1", false);
    const old = { ...pick("stretch", 20), day: "2020-01-01" } as AppEvent;
    expect(effectiveGoal(s, derive([old]), day).level).toBe("regular");
  });
});
