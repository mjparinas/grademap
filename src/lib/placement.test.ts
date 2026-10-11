import { beforeAll, describe, expect, it } from "vitest";
import { loadGrades } from "@/content";
import { AVAILABLE_GRADES } from "@/content";
import { withSeed } from "@/content/random";
import type { GradeId } from "@/content/types";
import type { AppEvent } from "./model";
import { buildStage, compareToGrade, gradesWithSubject, latestPlacements, MAX_STAGES, nextGrade, placementSentence, STAGE_SIZE, summarize, toEvent, verdict, type PlacementResult, type Stage } from "./placement";

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

  it("compares the placed grade with the child's grade", () => {
    expect(compareToGrade("2", "4")).toBe("below");
    expect(compareToGrade("4", "4")).toBe("at");
    expect(compareToGrade("k", "1")).toBe("below");
    expect(compareToGrade("6", "4")).toBe("above");
  });

  it("says where the child sits, in the words a parent reads", () => {
    const result = (placedGrade: GradeId): PlacementResult => ({
      subject: "math",
      startGrade: "3",
      stages: [],
      placedGrade,
      startUnits: [],
      reviewUnits: [],
      confidence: "ok",
    });
    expect(placementSentence(result("3"), "Maya", "3")).toBe("Maya is working at a Grade 3 level in this subject.");
    expect(placementSentence(result("5"), "Maya", "3")).toBe("Maya handled Grade 5 work, which is ahead of Grade 3.");
    expect(placementSentence(result("1"), "Maya", "3")).toBe("Maya found Grade 3 work tricky, and is most comfortable around Grade 1.");
    expect(placementSentence(result("k"), "Maya", "1")).toBe("Maya found Grade 1 work tricky, and is most comfortable around Kindergarten.");
  });

  it("stores a placement as an event and keeps the latest one per subject", () => {
    const result = (subject: "math" | "language", placedGrade: GradeId): PlacementResult => ({
      subject,
      startGrade: "3",
      stages: [],
      placedGrade,
      startUnits: ["3/math/tens-and-ones"],
      reviewUnits: [],
      confidence: "ok",
    });
    const event = (id: string, t: number, subject: "math" | "language", placed: GradeId): AppEvent => ({
      id,
      profileId: "p",
      t,
      ...toEvent(result(subject, placed)),
    });
    expect(toEvent(result("math", "3"))).toMatchObject({ type: "placement", subject: "math", placedGrade: "3" });
    const latest = latestPlacements([
      event("old", 1, "math", "2"),
      event("new", 5, "math", "4"),
      event("late-but-earlier", 0, "math", "k"),
      event("lang", 3, "language", "1"),
      { id: "other", profileId: "p", t: 9, type: "secret", code: "konami" },
    ]);
    expect(latest.math?.placedGrade).toBe("4");
    expect(latest.math?.t).toBe(5);
    expect(latest.language?.placedGrade).toBe("1");
    expect(Object.keys(latest).sort()).toEqual(["language", "math"]);

    const tied = latestPlacements([event("first", 5, "math", "2"), event("second", 5, "math", "9")]);
    expect(tied.math?.id).toBe("first");
    expect(tied.math?.placedGrade).toBe("2");
  });
});
