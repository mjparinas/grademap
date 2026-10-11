import type { Course, GradeId, SubjectId, Unit } from "../types";
import { overall } from "./overall";

// Helpers shared by the New Brunswick grade files. New Brunswick's curriculum has no outcome codes: a standard cites the strand
// and big idea ("Reading: Phonics"), which content.test.ts checks against docs/research/new-brunswick/outcomes.json.

/** Strand and big idea ("Number: Operations"), then a short plain description of what the unit practises. */
export type Std = readonly [codes: string, text: string];

/** Standards text for a unit: the strand and big idea, then a short plain description. */
export function nb(citation: string, text: string): Unit["standards"] {
  return { "ca-nb": `${citation} · ${text}` };
}

/**
 * A New Brunswick copy of units another grade or province already has. Each is cloned with New Brunswick standards only,
 * so it never shows up for another province by accident. A clone keeps the original's id and questions, so a
 * family that has both provinces loaded sees one unit that carries both sets of standards.
 * `rename` gives the clone a new id when the same id is already a different unit in this grade (for example
 * a Grade 4 unit borrowed by Grade 5).
 */
export function adopt(pool: Unit[], plan: Record<string, Std>, rename: Record<string, string> = {}): Unit[] {
  return Object.entries(plan).map(([id, [codes, text]]) => {
    const unit = pool.find((u) => u.id === id);
    if (!unit) throw new Error(`New Brunswick: no unit "${id}" to adopt`);
    return { ...unit, id: rename[id] ?? id, standards: nb(codes, text) };
  });
}

interface CourseSpec {
  /** Units BC already has in this grade and subject. Their ids are listed here with New Brunswick's outcomes. */
  share?: Record<string, Std>;
  /** Units written elsewhere (another grade, or Ontario), as New Brunswick copies. */
  adopted?: Unit[];
  /** Units written for the New Brunswick outcomes. */
  own?: Unit[];
  /** Unit order. Defaults to shared units, then adopted, then own. */
  order?: string[];
}

/** One New Brunswick course. The learning focus comes from the official course page (./overall.ts). */
export function course(grade: GradeId, subject: SubjectId, spec: CourseSpec): Course {
  const shares = Object.fromEntries(Object.entries(spec.share ?? {}).map(([id, [codes, text]]) => [id, { standards: nb(codes, text) }]));
  const units = [...(spec.adopted ?? []), ...(spec.own ?? [])];
  return {
    grade,
    subject,
    bigIdeas: { "ca-nb": overall(grade, subject) },
    units,
    shares,
    order: { "ca-nb": spec.order ?? [...Object.keys(shares), ...units.map((u) => u.id)] },
  };
}

/** The units one subject's course holds in a list of courses (a grade's Ontario or BC courses). */
export function unitsOf(courses: Course[], subject: SubjectId): Unit[] {
  return courses.find((c) => c.subject === subject)?.units ?? [];
}

/** The units one subject has across several lists of courses (for example Ontario's and Manitoba's), for `adopt`. */
export function poolOf(subject: SubjectId, ...lists: Course[][]): Unit[] {
  return lists.flatMap((courses) => unitsOf(courses, subject));
}
