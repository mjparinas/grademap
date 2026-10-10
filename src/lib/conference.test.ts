import { beforeAll, describe, expect, it } from "vitest";
import { loadGrade } from "@/content";
import { buildConferenceSheet } from "./conference";
import { derive } from "./derive";
import type { AppEvent } from "./model";
import { buildReport } from "./reports";

const NOW = Date.parse("2026-10-10T12:00:00Z");

beforeAll(async () => {
  await Promise.all([loadGrade("3", "ca-bc"), loadGrade("3", "ca-on")]);
});

const answers = (unit: string, right: number, wrong: number, start = 0): AppEvent[] =>
  Array.from({ length: right + wrong }, (_, i) => ({
    id: `${unit}-${start + i}`,
    profileId: "p",
    type: "answer" as const,
    t: NOW - 3_600_000 - (start + i) * 1000,
    unit,
    correct: i < right,
    attempts: 1,
    revealed: false,
    ms: 9000,
    mode: "practice" as const,
  }));

function sheet(framework: "ca-bc" | "ca-on", events: AppEvent[]) {
  const derived = derive(events, NOW);
  const report = buildReport(events, derived, "3", framework, 90, NOW);
  return buildConferenceSheet({ name: "Maya", grade: "3", framework, report, derived, dailyGoalMinutes: 15 });
}

describe("report card conversation sheet", () => {
  const events = [...answers("3/math/multiplication", 3, 7), ...answers("3/math/time", 11, 1, 100)];

  it("speaks the language of the province's report card", () => {
    const bc = sheet("ca-bc", events);
    const on = sheet("ca-on", events);
    expect(bc.curriculumName).toMatch(/BC/);
    expect(on.curriculumName).toMatch(/Ontario/);
    expect(bc.scaleName).not.toBe(on.scaleName);
    expect(bc.subjects.map((s) => s.subject)).toEqual(["math", "language", "science", "social"]);
  });

  it("names strengths and tricky spots from real practice", () => {
    const math = sheet("ca-bc", events).subjects.find((s) => s.subject === "math")!;
    expect(math.growing).toContain("Multiplication");
    expect(math.strengths).toContain("Time");
    expect(math.accuracy).toBeGreaterThan(0.3);
    expect(math.accuracy).toBeLessThan(0.8);
    const language = sheet("ca-bc", events).subjects.find((s) => s.subject === "language")!;
    expect(language.level).toBe(-1);
    expect(language.atHome).toMatch(/Nothing practised/);
  });

  it("builds a balanced two-week plan that starts with the trickiest unit", () => {
    const s = sheet("ca-bc", events);
    const all = s.plan.flat();
    expect(all).toHaveLength(4);
    expect(all[0].title).toBe("Multiplication");
    expect(all[0].goal).toMatch(/3 out of 4/);
    expect(new Set(all.map((p) => p.key)).size).toBe(4);
    expect(all.filter((p) => p.subject === all[0].subject).length).toBeLessThanOrEqual(2);
    expect(s.minutesPerSession).toBe(15);
  });

  it("still gives a gentle start when nothing has been practised", () => {
    const s = sheet("ca-on", []);
    expect(s.plan.flat().length).toBe(4);
    expect(s.plan.flat()[0].goal).toMatch(/first lesson/);
    expect(s.questions.length).toBeGreaterThanOrEqual(3);
  });
});
