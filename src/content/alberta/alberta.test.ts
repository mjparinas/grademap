import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { COURSES } from "../all";
import { FRAMEWORKS, getFramework } from "../frameworks";
import { allUnitRefs, coursesForGrade, isGradeLoaded, loadGrade } from "../index";
import type { GradeId } from "../types";

// Alberta standards cite the official learning outcomes (docs/research/alberta/outcomes.json), checked here.
// How each subject cites them:
//   math K–6, science K–6: outcome codes, e.g. "4N1.1" or "3LS 1.2"
//   math 7–9: strand and number, e.g. "N5, PR2"
//   science 7–9: "Unit A: Interactions and Ecosystems"
//   social 7–9: "7.1; 7.2"; language 7–9: "General Outcome 2"; core French: "Applications; Strategies"
//   language, social studies and French immersion K–6: items from the official grade snapshot
//   (ELA and immersion lines, social studies topic phrases), joined by "; "

interface Outcomes {
  math: Record<string, string[]>;
  science: { "k-6": string[]; "7-9-units": Record<string, string[]> };
  snapshots: Record<string, Record<string, string[] | { focus: string; topics: string[] }>>;
  "language-7-9": string[];
  "social-7-9": Record<string, string>;
  "core-french": string[];
}

const OUTCOMES = JSON.parse(readFileSync(join(__dirname, "../../../docs/research/alberta/outcomes.json"), "utf8")) as Outcomes;

const norm = (s: string) => s.replace(/[“”"]/g, "").replace(/[’']/g, "'").replace(/\.$/, "").trim().toLowerCase();
const prefix = (grade: GradeId) => (grade === "k" ? "K" : grade);
const head = (standard: string) => standard.split(" · ")[0];

const mathCodes = (standard: string) => head(standard).match(/\b[K1-6][NAGMTSP]\d+(?:\.\d+)?\b/g) ?? [];
const upperMath = (standard: string) => head(standard).match(/\b(?:N|PR|SS|SP)\d{1,2}\b/g) ?? [];
const scienceCodes = (standard: string) => (head(standard).match(/\b[K1-6][A-Z]{1,2}\s?\d(?:\.\d+)?\b/g) ?? []).map((c) => c.replace(/\s/g, ""));

function snapshotItems(subject: string, grade: GradeId): string[] {
  const g = OUTCOMES.snapshots[subject]?.[grade];
  if (!g) return [];
  return Array.isArray(g) ? g : g.topics;
}

describe("Alberta framework", () => {
  const alberta = getFramework("ca-ab");

  it("is registered with Alberta names and Kindergarten to Grade 9", () => {
    expect(FRAMEWORKS.map((f) => f.id)).toContain("ca-ab");
    expect(alberta.slug).toBe("alberta");
    expect(alberta.region).toBe("Alberta");
    expect(alberta.grades).toHaveLength(10);
  });

  it("uses one practice scale with four steps, never a provincial scale", () => {
    const scheme = alberta.scoringFor("4");
    expect(scheme.levels).toHaveLength(4);
    expect(scheme.levels.map((l) => l.kidLabel)).toEqual(["Seedling", "Sprout", "Tree", "Star"]);
    expect(alberta.reportCard.intro).toMatch(/doesn't use one provincial report card/);
    expect(alberta.scoringFor("k")).toBe(scheme);
  });
});

describe("Alberta content", () => {
  const mine = COURSES.flatMap((course) => course.units.filter((u) => u.standards["ca-ab"]).map((unit) => ({ course, unit, standard: unit.standards["ca-ab"]! })));

  it("covers every grade and subject Alberta teaches", () => {
    for (const grade of alberta().grades) {
      for (const subject of ["math", "language", "science", "social"]) {
        expect(mine.filter((m) => m.course.grade === grade && m.course.subject === subject).length, `${grade}/${subject}`).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it("cites real Alberta outcomes", () => {
    for (const { course, unit, standard } of mine) {
      const name = `${course.grade}/${course.subject}/${unit.id}: "${standard}"`;
      const g = course.grade;
      const first = head(standard);
      expect(standard.includes(" · "), `${name} needs "citation · description"`).toBe(true);
      if (course.subject === "math") {
        if (g <= "6" || g === "k") {
          const codes = mathCodes(standard);
          expect(codes.length, `${name} cites no outcome`).toBeGreaterThan(0);
          for (const c of codes) {
            expect(OUTCOMES.math["k-6"], `${name}: ${c}`).toContain(c);
            expect(c.startsWith(prefix(g)), `${name}: ${c} is not a Grade ${g} outcome`).toBe(true);
          }
        } else {
          const codes = upperMath(standard);
          expect(codes.length, `${name} cites no outcome`).toBeGreaterThan(0);
          for (const c of codes) expect(OUTCOMES.math[g], `${name}: ${c}`).toContain(c);
        }
      } else if (course.subject === "science") {
        if (g <= "6" || g === "k") {
          const codes = scienceCodes(standard);
          expect(codes.length, `${name} cites no outcome`).toBeGreaterThan(0);
          for (const c of codes) {
            expect(OUTCOMES.science["k-6"], `${name}: ${c}`).toContain(c);
            expect(c.startsWith(prefix(g)), `${name}: ${c} is not a Grade ${g} outcome`).toBe(true);
          }
        } else {
          const units = OUTCOMES.science["7-9-units"][g];
          const hit = first.split("; ").every((p) => units.some((u) => p === `Unit ${u.slice(0, 1)}: ${u.slice(2)}`));
          expect(hit, `${name} must name Grade ${g} science units like "Unit A: ${units[0].slice(2)}"`).toBe(true);
        }
      } else if (course.subject === "social" && (g === "7" || g === "8" || g === "9")) {
        const codes = first.split("; ");
        for (const c of codes) {
          expect(OUTCOMES["social-7-9"][c], `${name}: ${c}`).toBeDefined();
          expect(c.startsWith(`${g}.`), `${name}: ${c} is not Grade ${g}`).toBe(true);
        }
      } else if (course.subject === "language" && (g === "7" || g === "8" || g === "9")) {
        const nums = first.replace(/^General Outcomes? /, "").split(/,\s*/);
        expect(first.startsWith("General Outcome"), `${name} should start with "General Outcome"`).toBe(true);
        for (const n of nums) expect(OUTCOMES["language-7-9"].some((o) => o.startsWith(`${n} `)), `${name}: ${n}`).toBe(true);
      } else if (course.subject === "core-french") {
        for (const p of first.split("; ")) expect(OUTCOMES["core-french"].some((o) => o.endsWith(` ${p}`) || o === p), `${name}: ${p}`).toBe(true);
      } else if (["language", "social", "immersion"].includes(course.subject) && (g <= "6" || g === "k")) {
        const items = snapshotItems(course.subject, g).map(norm);
        expect(items.length, `${course.subject} Grade ${g} snapshot`).toBeGreaterThan(0);
        for (const p of first.split("; ")) expect(items, `${name}: "${p}" is not in the Grade ${g} snapshot`).toContain(norm(p));
      }
    }
  });

  it("has no repeated unit ids inside a course", () => {
    for (const course of COURSES) {
      const ids = course.units.map((u) => u.id);
      expect(new Set(ids).size, `${course.grade}/${course.subject}`).toBe(ids.length);
    }
  });

  it("loads an Alberta grade with the Ontario units it shares", async () => {
    await loadGrade("4", "ca-ab");
    expect(isGradeLoaded("4", "ca-ab")).toBe(true);
    const courses = coursesForGrade("4", "ca-ab");
    expect(courses.map((c) => c.subject)).toEqual(expect.arrayContaining(["math", "language", "science", "social"]));
    const refs = allUnitRefs("4", "ca-ab");
    expect(refs.length).toBeGreaterThan(0);
    for (const r of refs) expect(r.unit.standards["ca-ab"]).toBeTruthy();
  });
});

function alberta() {
  return getFramework("ca-ab");
}
