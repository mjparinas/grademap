import { describe, expect, it } from "vitest";
import { COURSES } from "../all";
import { ageBandFor } from "../subjects";
import { FRAMEWORKS } from "../frameworks";

// Lessons are attached per grade by unit id. These checks keep them honest: every lesson belongs to a
// real unit and is short enough to read. Units two provinces share carry the same lesson in both.

const withLesson = COURSES.flatMap((c) => c.units.filter((u) => u.lesson).map((u) => ({ c, u })));

describe("unit lessons", () => {
  it("covers every grade", () => {
    const grades = new Set(withLesson.map(({ c }) => c.grade));
    expect([...grades].sort()).toEqual(["1", "2", "3", "4", "5", "6", "7", "8", "9", "k"].sort());
  });

  it("is short, clear and complete", () => {
    for (const { c, u } of withLesson) {
      const l = u.lesson!;
      const name = `${c.grade}/${c.subject}/${u.id}`;
      expect(l.steps.length, name).toBeGreaterThanOrEqual(2);
      expect(l.steps.length, name).toBeLessThanOrEqual(4);
      const little = ageBandFor(c.grade) === "little";
      for (const step of l.steps) {
        expect(step.trim(), name).toBe(step);
        expect(step.length, `${name}: ${step}`).toBeLessThanOrEqual(little ? 80 : 160);
      }
      expect(l.example.question.length, name).toBeLessThanOrEqual(little ? 80 : 140);
      expect(l.example.work.length, name).toBeGreaterThanOrEqual(1);
      expect(l.example.work.length, name).toBeLessThanOrEqual(4);
      expect(l.example.answer.length, name).toBeGreaterThan(0);
      // Canadian spelling.
      expect(JSON.stringify(l), name).not.toMatch(/\b(color|center|meter|liter|favorite|practice[sd]?\b(?= (a|the|it)))/i);
    }
  });

  it("is written for the shared math units first", () => {
    const sharedMath = COURSES.filter((c) => c.subject === "math").flatMap((c) => c.units.filter((u) => FRAMEWORKS.every((f) => u.standards[f.id])));
    const covered = sharedMath.filter((u) => u.lesson).length;
    expect(covered).toBe(sharedMath.length);
  });
});
