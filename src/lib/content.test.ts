import { describe, expect, it } from "vitest";
import { SUBJECTS } from "./curriculum";
import type { Question } from "./types";

const RUNS = 300;

function checkQuestion(q: Question) {
  expect(q.prompt.trim()).not.toBe("");
  expect(q.hint.trim()).not.toBe("");

  switch (q.kind) {
    case "choice": {
      expect(q.choices.length).toBeGreaterThanOrEqual(2);
      expect(new Set(q.choices.map((c) => c.id)).size).toBe(q.choices.length);
      // Two buttons that look the same would make the question unfair.
      expect(new Set(q.choices.map((c) => c.label)).size).toBe(q.choices.length);
      expect(q.choices.map((c) => c.id)).toContain(q.answer);
      const answerLabel = q.choices.find((c) => c.id === q.answer)!.label;
      checkMath(q, answerLabel);
      break;
    }
    case "build":
      expect(Number.isInteger(q.target)).toBe(true);
      expect(q.target).toBeGreaterThanOrEqual(1);
      expect(q.target).toBeLessThanOrEqual(99);
      break;
    case "coins":
      expect(q.target % 5).toBe(0);
      expect(q.target).toBeGreaterThan(0);
      expect(q.target).toBeLessThanOrEqual(100);
      expect(q.coins).toContain(5);
      break;
    case "order":
      expect(q.items.length).toBeGreaterThanOrEqual(3);
      expect(new Set(q.items.map((i) => i.id)).size).toBe(q.items.length);
      expect(new Set(q.items.map((i) => i.label)).size).toBe(q.items.length);
      break;
    case "sort": {
      const bins = q.bins.map((b) => b.id);
      for (const item of q.items) expect(bins).toContain(item.bin);
      for (const bin of bins) expect(q.items.some((i) => i.bin === bin)).toBe(true);
      expect(new Set(q.items.map((i) => i.id)).size).toBe(q.items.length);
      break;
    }
  }
}

/** Where a question's visual fully determines the answer, check the maths. */
function checkMath(q: Question & { kind: "choice" }, answerLabel: string) {
  const v = q.visual;
  const n = parseInt(answerLabel, 10);
  if (v?.type === "equation") {
    const m = v.text.match(/^(\d+) ([+−]) (\d+) = \?$/);
    if (m) {
      const [a, op, b] = [Number(m[1]), m[2], Number(m[3])];
      expect(n).toBe(op === "+" ? a + b : a - b);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThanOrEqual(100);
    }
    const missing = v.text.match(/^(\d+) \+ ☐ = (\d+)$/);
    if (missing) expect(Number(missing[1]) + n).toBe(Number(missing[2]));
  }
  if (v?.type === "blocks" && q.prompt.startsWith("What number")) expect(n).toBe(v.tens * 10 + v.ones);
  if (v?.type === "coins") expect(n).toBe(v.coins.reduce((s, c) => s + c, 0));
  if (v?.type === "ruler") expect(n).toBe(v.length);
  if (v?.type === "tenFrame") expect(n).toBe(v.filled + (v.extra ?? 0));
  if (v?.type === "pictograph" && q.prompt.startsWith("How many") && !q.prompt.includes("more")) {
    const label = q.prompt.replace(/^How many /, "").replace(/\?$/, "");
    expect(n).toBe(v.rows.find((r) => r.label === label)!.count);
  }
}

describe("curriculum content", () => {
  it("has unique subject and unit ids", () => {
    expect(new Set(SUBJECTS.map((s) => s.id)).size).toBe(SUBJECTS.length);
    for (const s of SUBJECTS) {
      expect(new Set(s.units.map((u) => u.id)).size).toBe(s.units.length);
    }
  });

  for (const subject of SUBJECTS) {
    for (const unit of subject.units) {
      it(`${subject.id}/${unit.id} generates fair questions`, () => {
        for (let run = 0; run < RUNS; run++) {
          const qs = unit.generate();
          expect(qs.length).toBeGreaterThanOrEqual(6);
          expect(qs.length).toBeLessThanOrEqual(10);
          qs.forEach(checkQuestion);
        }
      });
    }
  }
});
