import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { COURSES } from "./all";
import { FRAMEWORKS } from "./frameworks";
import { CORE_SUBJECTS, GRADE_ORDER } from "./subjects";
import { withSeed } from "./random";
import type { FrameworkId, GradeId } from "./types";

// Parity checks: whatever one province or state gets, every framework gets. These fail when new
// content, a new grade or a new framework is added for one place and not the others. See
// "Every framework, every grade" in AGENTS.md.

const range = (from: GradeId, to: GradeId) => GRADE_ORDER.slice(GRADE_ORDER.indexOf(from), GRADE_ORDER.indexOf(to) + 1);

/**
 * The grades each framework offers the two French subjects in. These follow each province's
 * French as a second language requirements (BC: second language from Grade 5; Ontario: Core French
 * from Grade 4; Alberta: French as a Second Language from Grade 4). Adding a framework means adding its row here.
 */
const FRENCH_GRADES: Record<FrameworkId, { immersion: GradeId[]; "core-french": GradeId[] }> = {
  "ca-bc": { immersion: range("k", "9"), "core-french": range("5", "9") },
  "ca-on": { immersion: range("1", "9"), "core-french": range("4", "9") },
  // Alberta: French Immersion from Kindergarten; the French as a Second Language program starts in Grade 4.
  "ca-ab": { immersion: range("k", "9"), "core-french": range("4", "9") },
  // Saskatchewan French is not built yet (see docs/research/saskatchewan/README.md).
  "ca-sk": { immersion: [], "core-french": [] },
  "ca-mb": { immersion: range("k", "9"), "core-french": range("4", "9") },
};

const units = (framework: FrameworkId, grade: GradeId, subject: string) =>
  COURSES.find((c) => c.grade === grade && c.subject === subject)?.units.filter((u) => u.standards[framework]) ?? [];

describe("every framework covers every grade and subject", () => {
  it("has a French row for every framework", () => {
    for (const f of FRAMEWORKS) expect(FRENCH_GRADES[f.id], `French grades for ${f.id}`).toBeDefined();
  });

  it("offers each framework's grades as Kindergarten to Grade 9", () => {
    for (const f of FRAMEWORKS) expect(f.grades, f.id).toEqual(GRADE_ORDER);
  });

  it("has math, language, science and social studies in every grade, with Big Ideas or strands", () => {
    for (const f of FRAMEWORKS) {
      for (const grade of f.grades) {
        for (const subject of CORE_SUBJECTS) {
          expect(units(f.id, grade, subject).length, `${f.id} ${grade}/${subject}`).toBeGreaterThanOrEqual(3);
          const course = COURSES.find((c) => c.grade === grade && c.subject === subject)!;
          expect(course.bigIdeas[f.id]?.length ?? 0, `${f.id} ${grade}/${subject} big ideas`).toBeGreaterThan(0);
        }
      }
    }
  });

  it("has French in exactly the grades the province teaches it", () => {
    for (const f of FRAMEWORKS) {
      for (const grade of f.grades) {
        for (const subject of ["immersion", "core-french"] as const) {
          const expected = FRENCH_GRADES[f.id][subject].includes(grade);
          expect(units(f.id, grade, subject).length > 0, `${f.id} ${grade}/${subject}`).toBe(expected);
        }
      }
    }
  });
});

describe("public pages", () => {
  const walk = (dir: string): string[] =>
    readdirSync(dir).flatMap((n) => {
      const p = join(dir, n);
      return statSync(p).isDirectory() ? walk(p) : p.endsWith("page.tsx") ? [p] : [];
    });
  const appDir = join(__dirname, "../app");
  /** Pages that serve people who already have an account, or legal text. */
  const NO_CTA = ["/contact/", "/help/", "/account/"];

  it("end with a call to action to try the app", () => {
    // Shared page bodies (the guide extras) render inside thin page.tsx wrappers.
    const missing = [...walk(appDir), join(__dirname, "../components/site/GuideExtras.tsx")]
      .filter((f) => readFileSync(f, "utf8").includes("<SitePage"))
      .filter((f) => !NO_CTA.some((n) => f.replaceAll("\\", "/").includes(`/app${n}`)))
      .filter((f) => {
        const src = readFileSync(f, "utf8");
        // Teacher pages end with the teacher call to action instead.
        return !/<SitePage cta\b/.test(src) && !src.includes('href="/play/"') && !src.includes("<TeacherCta");
      });
    expect(missing).toEqual([]);
  });
});

// Practice needs enough variety that a child does not see the same question every few sessions. A question
// counts as distinct by prompt, picture and correct answer, so reshuffled choices do not count.
const MIN_DISTINCT = 24;

describe("every unit has a deep enough question pool", () => {
  it(`has at least ${MIN_DISTINCT} distinct questions in every unit`, () => {
    const thin: string[] = [];
    for (const course of COURSES) {
      for (const unit of course.units) {
        const seen = new Set<string>();
        for (const difficulty of [1, 2, 3] as const) {
          for (let seed = 0; seed < 150; seed++) {
            for (const q of withSeed(seed * 7919 + difficulty, () => unit.generate({ difficulty }))) {
              const answer =
                q.kind === "choice"
                  ? q.choices.find((c) => c.id === q.answer)?.label
                  : "items" in q
                    ? q.items.map((i) => i.label).sort()
                    : undefined;
              seen.add(JSON.stringify([q.prompt, q.visual, answer]));
            }
          }
        }
        if (seen.size < MIN_DISTINCT) thin.push(`${course.grade}/${course.subject}/${unit.id}: ${seen.size}`);
      }
    }
    expect(thin, "units with too few distinct questions").toEqual([]);
  }, 120000);
});
