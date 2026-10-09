import { beforeAll, describe, expect, it } from "vitest";
import { loadGrades } from "@/content";
import { AVAILABLE_GRADES } from "@/content";
import { withSeed } from "@/content/random";
import type { GradeId } from "@/content/types";
import { buildStage, gradesWithSubject, MAX_STAGES, nextGrade, STAGE_SIZE, summarize, verdict, type Stage } from "./placement";

beforeAll(() => loadGrades(AVAILABLE_GRADES.map((grade) => ({ grade, framework: "ca-bc" as const }))));

const stage = (grade: GradeId, correct: number, missed: string[] = []): Stage => ({ grade, total: STAGE_SIZE, correct, asked: [], missed });

describe("placement", () => {
  it("rates a block of four", () => {
    expect([4, 3, 2, 1, 0].map((c) => verdict(stage("3", c)))).toEqual(["strong", "strong", "partial", "weak", "weak"]);
  });

  it("moves up after a strong block, down after a weak one, and stops on a mixed one", () => {
    const grades = gradesWithSubject("math");
    expect(nextGrade([stage("3", 4)], grades)).toBe("4");
    expect(nextGrade([stage("3", 0)], grades)).toBe("2");
    expect(nextGrade([stage("3", 2)], grades)).toBeUndefined();
  });

  it("stops when the answer is bracketed, at the edges, and at the limit", () => {
    const grades = gradesWithSubject("math");
    expect(nextGrade([stage("3", 4), stage("4", 0)], grades)).toBeUndefined();
    expect(nextGrade([stage("k", 0)], grades)).toBeUndefined();
    const top = grades[grades.length - 1];
    expect(nextGrade([stage(top, 4)], grades)).toBeUndefined();
    expect(nextGrade([stage("2", 4), stage("3", 4), stage("4", 4), stage("5", 4)], grades)).toBeUndefined();
    expect(MAX_STAGES).toBeGreaterThan(2);
  });

  it("builds four fair questions per grade and subject", () => {
    for (const subject of ["math", "language"] as const) {
      for (const grade of gradesWithSubject(subject)) {
        const qs = buildStage(grade, subject);
        expect(qs).toHaveLength(STAGE_SIZE);
        for (const { question, unitKey } of qs) {
          expect(unitKey.startsWith(`${grade}/${subject}/`)).toBe(true);
          expect(question.prompt.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("builds the same questions from the same seed", () => {
    const a = withSeed(7, () => buildStage("3", "math").map((x) => x.question.prompt));
    const b = withSeed(7, () => buildStage("3", "math").map((x) => x.question.prompt));
    expect(a).toEqual(b);
  });

  it("places at the highest secure grade and suggests units there, missed ones first", () => {
    const missed = "3/math/" + buildStage("3", "math")[0].unitKey.split("/")[2];
    const r = summarize("math", "3", [stage("3", 3, [missed]), stage("4", 1)].map((s) => ({ ...s, asked: s.grade === "3" ? [missed] : [] })));
    expect(r.placedGrade).toBe("3");
    expect(r.startUnits[0]).toBe(missed);
    expect(r.startUnits.length).toBeLessThanOrEqual(3);
    expect(r.startUnits.every((k) => k.startsWith("3/math/"))).toBe(true);
    expect(r.confidence).toBe("ok");
  });

  it("places ahead of grade, and low when answers are all mixed", () => {
    expect(summarize("math", "3", [stage("3", 4), stage("4", 4), stage("5", 2)]).placedGrade).toBe("4");
    const mixed = summarize("math", "3", [stage("3", 2)]);
    expect(mixed.placedGrade).toBe("3");
    expect(mixed.confidence).toBe("low");
  });

  it("places below the lowest grade tried when nothing was secure and the test ran out of room", () => {
    const r = summarize("math", "5", [stage("5", 0), stage("4", 1), stage("3", 0), stage("2", 1)]);
    expect(r.placedGrade).toBe("1");
    expect(r.confidence).toBe("low");
    expect(summarize("math", "k", [stage("k", 0)]).placedGrade).toBe("k");
  });

  it("suggests revisiting units missed in lower grades", () => {
    const r = summarize("math", "3", [stage("2", 3, ["2/math/x"]), stage("3", 4), stage("4", 4)]);
    expect(r.placedGrade).toBe("4");
    expect(r.reviewUnits).toContain("2/math/x");
  });
});
