import { describe, expect, it } from "vitest";
import { derive } from "./derive";
import { growthSince } from "./progressSince";
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

  it("lists the biggest jumps first, then the highest level", () => {
    const [X, Y, W] = ["4/math/x", "4/math/y", "4/math/w"];
    const events = [
      ...run(Y, 4, 0, now - 60 * DAY),
      ...run(X, 8, 8, now - 5 * DAY),
      ...run(Y, 12, 12, now - 5 * DAY),
      ...run(W, 3, 3, now - 5 * DAY),
    ];
    const g = growthSince(events, now, 30);
    expect(g.moved).toEqual([{ key: X, from: -1, to: 2 }, { key: Y, from: 0, to: 2 }, { key: W, from: -1, to: 1 }]);
    expect([g.startedThen, g.startedNow, g.proficientThen, g.proficientNow]).toEqual([1, 3, 0, 2]);
  });

  it("counts units already Proficient or Emerging at each point", () => {
    const [P, E] = ["4/math/p", "4/math/e"];
    const events = [...run(P, 8, 8, now - 60 * DAY), ...run(E, 4, 0, now - 5 * DAY)];
    const g = growthSince(events, now, 30);
    expect([g.startedThen, g.startedNow, g.proficientThen, g.proficientNow]).toEqual([1, 2, 1, 1]);
  });

  it("counts the moment of the cutoff as inside the window", () => {
    const g = growthSince([answer(A, true, now - 30 * DAY)], now, 30);
    expect([g.hadHistory, g.answersSince, g.startedThen, g.days]).toEqual([false, 1, 0, 30]);
  });

  it("counts only answers toward answers and days practised", () => {
    const session: AppEvent = { id: "s", profileId: "p", t: now - 2 * DAY, type: "session", mode: "practice", scope: A, total: 3, correct: 3, ms: 1000 };
    const g = growthSince([...run(A, 3, 3, now - DAY), session], now, 30);
    expect([g.answersSince, g.daysPractisedSince]).toEqual([3, 1]);
  });

  it("uses today's stats when they're passed in", () => {
    const events = run(A, 8, 8, now - DAY);
    expect(growthSince(events, now, 30, derive([], now)).startedNow).toBe(0);
    expect(growthSince(events, now, 30).startedNow).toBe(1);
  });
});
