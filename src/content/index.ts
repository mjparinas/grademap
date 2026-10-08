import { courses as k } from "./grades/k";
import { courses as g1 } from "./grades/g1";
import { courses as g2 } from "./grades/g2";
import { courses as g3 } from "./grades/g3";
import { courses as g4 } from "./grades/g4";
import { courses as g5 } from "./grades/g5";
import { courses as g6 } from "./grades/g6";
import { courses as g7 } from "./grades/g7";
import { GRADE_ORDER } from "./subjects";
import type { Course, GradeId, SubjectId, Unit } from "./types";

/** Every course with at least one unit. */
export const COURSES: Course[] = [...k, ...g1, ...g2, ...g3, ...g4, ...g5, ...g6, ...g7].filter((c) => c.units.length > 0);

/** Grades that have content. */
export const AVAILABLE_GRADES: GradeId[] = GRADE_ORDER.filter((g) => COURSES.some((c) => c.grade === g));

export function coursesForGrade(grade: GradeId): Course[] {
  return COURSES.filter((c) => c.grade === grade);
}

export function getCourse(grade: GradeId, subject: SubjectId | string): Course | undefined {
  return COURSES.find((c) => c.grade === grade && c.subject === subject);
}

/** Progress is keyed by "grade/subject/unit", e.g. "2/math/tens-and-ones". */
export function unitKey(grade: GradeId, subject: SubjectId, unitId: string): string {
  return `${grade}/${subject}/${unitId}`;
}

export interface UnitRef {
  key: string;
  course: Course;
  unit: Unit;
}

const BY_KEY = new Map<string, UnitRef>();
for (const course of COURSES) {
  for (const unit of course.units) {
    const key = unitKey(course.grade, course.subject, unit.id);
    BY_KEY.set(key, { key, course, unit });
  }
}

export function getUnitRef(key: string): UnitRef | undefined {
  return BY_KEY.get(key);
}

export function allUnitRefs(grade?: GradeId): UnitRef[] {
  return [...BY_KEY.values()].filter((r) => !grade || r.course.grade === grade);
}
