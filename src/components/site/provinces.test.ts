import { describe, expect, it } from "vitest";
import { FRAMEWORKS, getFramework, type Framework } from "@/content/frameworks";
import type { GradeId, SubjectId } from "@/content/types";
import { kidPracticeSteps, provinceCoverage, regionList, subjectList } from "./provinces";

describe("homepage province coverage", () => {
  it("names shared subjects once and keeps proper nouns", () => {
    expect(subjectList(["math", "language", "science", "social"])).toBe("math, English language arts, science and social studies");
    expect(subjectList(["immersion", "core-french"])).toBe("French Immersion and Core French");
    expect(subjectList(["math"])).toBe("math");
  });

  it("states the subjects every province shares, and that only Saskatchewan is without French", () => {
    const coverage = provinceCoverage(FRAMEWORKS);
    expect(coverage.sharedSubjects).toEqual(["math", "language", "science", "social"]);
    expect(coverage.range).toEqual({ from: "k", to: "9" });
    expect(coverage.gaps).toHaveLength(1);
    const [french] = coverage.gaps;
    expect(french.subjects).toEqual(["immersion", "core-french"]);
    expect(french.style).toBe("except");
    expect(french.missing.map((f) => f.id)).toEqual(["ca-sk"]);
    expect(french.included.map((f) => f.id)).toEqual(FRAMEWORKS.filter((f) => f.id !== "ca-sk").map((f) => f.id));
  });

  it("names the province that has a subject when most provinces do not", () => {
    const bc = getFramework("ca-bc");
    const sk = getFramework("ca-sk");
    const ab = withSubjects(getFramework("ca-ab"), ["math", "language", "science", "social"]);
    const coverage = provinceCoverage([bc, sk, ab]);
    expect(coverage.gaps).toEqual([
      expect.objectContaining({
        subjects: ["immersion", "core-french"],
        style: "only",
        included: [bc],
        missing: [sk, ab],
      }),
    ]);
  });

  it("names every province, with 'the' before the Northwest Territories", () => {
    expect(regionList(FRAMEWORKS)).toBe(
      "British Columbia, Ontario, Alberta, Saskatchewan, Manitoba, Yukon, the Northwest Territories, Nova Scotia and New Brunswick",
    );
  });

  it("shows the kid steps every province shares, not one province's report-card words", () => {
    const steps = kidPracticeSteps(FRAMEWORKS);
    expect(steps.map((s) => s.kidLabel)).toEqual(["Seedling", "Sprout", "Tree", "Star"]);
    expect(steps.map((s) => s.icon)).toEqual(["🌱", "🌿", "🌳", "⭐"]);
    for (const step of steps) expect(step.atHome).not.toMatch(/Level \d|Emerging|Proficient|Extending|Meeting|British Columbia/);
    expect(steps[2]?.atHome).toMatch(/Mixed review/);
    for (const f of FRAMEWORKS) {
      expect(f.scoringFor("3").levels.map((l) => l.kidLabel)).toEqual(steps.map((s) => s.kidLabel));
    }
  });

  it("leaves the grade range unset when provinces don't share one", () => {
    const bc = withGrades(getFramework("ca-bc"), ["k", "1"]);
    const on = withGrades(getFramework("ca-on"), ["1", "2", "3"]);
    expect(provinceCoverage([bc, on]).range).toBeNull();
  });
});

function withSubjects(framework: Framework, subjects: SubjectId[]): Framework {
  return { ...framework, subjects };
}

function withGrades(framework: Framework, grades: GradeId[]): Framework {
  return { ...framework, grades };
}
