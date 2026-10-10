import type { Course, GradeId, SubjectId, Unit } from "../types";
import { overall } from "./overall";

// Helpers shared by the Manitoba grade files. The outcome codes in a standard are checked against the
// official outcomes in content.test.ts (docs/research/manitoba/outcomes.json).

/** Outcome codes, then a short plain description of what the unit practises. */
export type Std = readonly [codes: string, text: string];

/** Standards text for a unit: the outcome codes, then a short plain description. */
export function mb(codes: string, text: string): Unit["standards"] {
  return { "ca-mb": `${codes} · ${text}` };
}

/**
 * A Manitoba copy of units another grade or province already has. Each is cloned with Manitoba standards only,
 * so it never shows up for another province by accident. A clone keeps the original's id and questions, so a
 * family that has both provinces loaded sees one unit that carries both sets of standards.
 * `rename` gives the clone a new id when the same id is already a different unit in this grade (for example
 * a Grade 4 unit borrowed by Grade 5).
 */
export function adopt(pool: Unit[], plan: Record<string, Std>, rename: Record<string, string> = {}): Unit[] {
  return Object.entries(plan).map(([id, [codes, text]]) => {
    const unit = pool.find((u) => u.id === id);
    if (!unit) throw new Error(`Manitoba: no unit "${id}" to adopt`);
    return { ...unit, id: rename[id] ?? id, standards: mb(codes, text) };
  });
}

interface CourseSpec {
  /** Units BC already has in this grade and subject. Their ids are listed here with Manitoba's outcomes. */
  share?: Record<string, Std>;
  /** Units written elsewhere (another grade, or Ontario), as Manitoba copies. */
  adopted?: Unit[];
  /** Units written for the Manitoba outcomes. */
  own?: Unit[];
  /** Unit order. Defaults to shared units, then adopted, then own. */
  order?: string[];
}

/** One Manitoba course. The learning focus comes from the official course page (./overall.ts). */
export function course(grade: GradeId, subject: SubjectId, spec: CourseSpec): Course {
  const shares = Object.fromEntries(Object.entries(spec.share ?? {}).map(([id, [codes, text]]) => [id, { standards: mb(codes, text) }]));
  const units = [...(spec.adopted ?? []), ...(spec.own ?? [])];
  return {
    grade,
    subject,
    bigIdeas: { "ca-mb": overall(grade, subject) },
    units,
    shares,
    order: { "ca-mb": spec.order ?? [...Object.keys(shares), ...units.map((u) => u.id)] },
  };
}

/** The units one subject's course holds in a list of courses (a grade's Ontario or BC courses). */
export function unitsOf(courses: Course[], subject: SubjectId): Unit[] {
  return courses.find((c) => c.subject === subject)?.units ?? [];
}
