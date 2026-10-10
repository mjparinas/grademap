import { describe, expect, it } from "vitest";
import { derive } from "./derive";
import { growthSince } from "./growth";
import type { AppEvent } from "./model";

const DAY = 86_400_000;
const now = new Date(2026, 9, 10, 12).getTime();
let n = 0;
const answer = (unit: string, correct: boolean, t: number): AppEvent => ({ id: `g${n++}`, profileId: "p", t, type: "answer", unit, correct, attempts: correct ? 1 : 2, revealed: false, ms: 5000, mode: "practice" });
const run = (unit: string, count: number, right: number, t: number) => Array.from({ length: count }, (_, i) => answer(unit, i < right, t + i * 1000));

describe("growthSince", () => {
  const A = "4/math/fractions";
  const B = "4/language/spelling";
  it("shows units that rose a level and the Proficient count then and now", () => {
    const events = [...run(A, 6, 2, now - 60 * DAY), ...run(A, 10, 10, now - 5 * DAY), ...run(B, 5, 5, now - 3 * DAY)];
    const g = growthSince(events, now, 30, derive(events, now));
    expect(g.hadHistory).toBe(true);
    expect(g.proficientThen).toBe(0);
    expect(g.proficientNow).toBeGreaterThanOrEqual(1);
    expect(g.startedThen).toBe(1);
    expect(g.startedNow).toBe(2);
    const a = g.moved.find((m) => m.key === A)!;
    expect(a.to).toBeGreaterThan(a.from);
    expect(g.moved.find((m) => m.key === B)?.from).toBe(-1);
    expect(g.answersSince).toBe(15);
    expect(g.daysPractisedSince).toBe(2);
  });
  it("is a blank slate for a child who started inside the window", () => {
    const events = run(A, 8, 8, now - DAY);
    const g = growthSince(events, now, 90);
    expect(g.hadHistory).toBe(false);
    expect(g.startedThen).toBe(0);
  });
  it("lists nothing when a unit has not improved", () => {
    const events = [...run(A, 10, 10, now - 60 * DAY), ...run(A, 3, 3, now - DAY)];
    expect(growthSince(events, now, 30).moved).toEqual([]);
  });
});
