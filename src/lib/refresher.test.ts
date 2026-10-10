import { beforeAll, describe, expect, it } from "vitest";
import { loadGrade } from "@/content";
import { refresherUnit, REFRESHER_DAYS } from "./adaptive";
import { derive } from "./derive";
import type { AppEvent } from "./model";

beforeAll(() => loadGrade("2"));

const DAY = 86_400_000;
const NOW = new Date("2026-10-10T12:00:00").getTime();
const answers = (unit: string, daysAgo: number, correct: boolean, n = 10): AppEvent[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `${unit}-${daysAgo}-${i}`, profileId: "p1", t: NOW - daysAgo * DAY + i * 1000, type: "answer", unit, correct, attempts: 1, revealed: false, ms: 4000, mode: "practice",
  }));
const opts = (events: AppEvent[]) => ({ grade: "2" as const, framework: "ca-bc" as const, derived: derive(events, NOW), subjects: ["math" as const], now: NOW });

describe("refresher offer", () => {
  it("offers a unit the child knew well and left alone for two weeks", () => {
    const ref = refresherUnit(opts(answers("2/math/tens-and-ones", REFRESHER_DAYS + 1, true)));
    expect(ref?.key).toBe("2/math/tens-and-ones");
  });
  it("does not offer recent units, units the child struggled with, or units never started", () => {
    expect(refresherUnit(opts(answers("2/math/tens-and-ones", 3, true)))).toBeUndefined();
    expect(refresherUnit(opts(answers("2/math/tens-and-ones", 30, false)))).toBeUndefined();
    expect(refresherUnit(opts([]))).toBeUndefined();
  });
  it("offers the unit left longest first", () => {
    const events = [...answers("2/math/tens-and-ones", 20, true), ...answers("2/math/patterns", 40, true)];
    const keys = refresherUnit(opts(events))?.key;
    expect(keys).toBe("2/math/patterns");
  });
});
