import { GRADE_ORDER } from "./subjects";
import type { Course, GradeId, SubjectId, Unit } from "./types";

// The content registry for the apps. Each grade's content is its own download,
// loaded on demand with `loadGrade`, so a Grade 2 child never downloads Grade 7.
// Lookups only see grades that have loaded; the apps wait for the grades they need
// (see src/lib/useGradeContent.ts). Server pages and tests use ./all instead.

const LOADERS: Record<GradeId, () => Promise<{ courses: Course[] }>> = {
  k: () => import("./grades/k"),
  "1": () => import("./grades/g1"),
  "2": () => import("./grades/g2"),
  "3": () => import("./grades/g3"),
  "4": () => import("./grades/g4"),
  "5": () => import("./grades/g5"),
  "6": () => import("./grades/g6"),
  "7": () => import("./grades/g7"),
};

/** Grades that have content. Every grade has a loader; tests check each one has units. */
export const AVAILABLE_GRADES: GradeId[] = GRADE_ORDER.filter((g) => g in LOADERS);

/** Progress is keyed by "grade/subject/unit", e.g. "2/math/tens-and-ones". */
export function unitKey(grade: GradeId, subject: SubjectId, unitId: string): string {
  return `${grade}/${subject}/${unitId}`;
}

/** Reads a unit key without needing its grade loaded, so scoring never depends on downloads. */
export function parseUnitKey(key: string): { grade: GradeId; subject: SubjectId; unitId: string } | undefined {
  const [grade, subject, unitId] = key.split("/");
  if (!unitId || !GRADE_ORDER.includes(grade as GradeId)) return undefined;
  return { grade: grade as GradeId, subject: subject as SubjectId, unitId };
}

export interface UnitRef {
  key: string;
  course: Course;
  unit: Unit;
}

const courses = new Map<GradeId, Course[]>();
const refs = new Map<string, UnitRef>();
const pending = new Map<GradeId, Promise<void>>();
const failed = new Set<GradeId>();
const listeners = new Set<() => void>();

function register(grade: GradeId, list: Course[]) {
  const withUnits = list.filter((c) => c.units.length > 0);
  courses.set(grade, withUnits);
  for (const course of withUnits) {
    for (const unit of course.units) {
      const key = unitKey(course.grade, course.subject, unit.id);
      refs.set(key, { key, course, unit });
    }
  }
}

function notify() {
  for (const l of listeners) l();
}

/** Downloads a grade's content once; later calls return the same promise. */
export function loadGrade(grade: GradeId): Promise<void> {
  if (courses.has(grade)) return Promise.resolve();
  let p = pending.get(grade);
  if (!p) {
    failed.delete(grade);
    p = LOADERS[grade]()
      .then((m) => register(grade, m.courses))
      .catch((err: unknown) => {
        // Usually offline before this grade was ever downloaded. Allow a retry.
        failed.add(grade);
        throw err;
      })
      .finally(() => {
        pending.delete(grade);
        notify();
      });
    pending.set(grade, p);
    notify();
  }
  return p;
}

export function loadGrades(grades: Iterable<GradeId>): Promise<void> {
  return Promise.all([...new Set(grades)].map(loadGrade)).then(() => undefined);
}

export function isGradeLoaded(grade: GradeId): boolean {
  return courses.has(grade);
}

export function gradeLoadFailed(grade: GradeId): boolean {
  return failed.has(grade);
}

/** For useSyncExternalStore: called whenever a grade starts, finishes or fails loading. */
export function subscribeToContent(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** A grade's courses, or [] if that grade hasn't loaded yet. */
export function coursesForGrade(grade: GradeId): Course[] {
  return courses.get(grade) ?? [];
}

export function getCourse(grade: GradeId, subject: SubjectId | string): Course | undefined {
  return coursesForGrade(grade).find((c) => c.subject === subject);
}

export function getUnitRef(key: string): UnitRef | undefined {
  return refs.get(key);
}

export function allUnitRefs(grade: GradeId): UnitRef[] {
  return coursesForGrade(grade).flatMap((course) =>
    course.units.map((unit) => refs.get(unitKey(course.grade, course.subject, unit.id))!),
  );
}
