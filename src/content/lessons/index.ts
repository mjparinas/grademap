import type { Course, Lesson, Visual } from "../types";

// Short lessons ("how it works") for units, written once per grade and attached by unit id. A unit
// that two provinces share gets the lesson in both. Each grade's lessons ship in that grade's
// download, never in the first load.

/** A lesson, written compactly. */
export const lesson = (steps: string[], question: string, work: string[], answer: string, visual?: Visual): Lesson => ({
  steps,
  example: { question, work, answer, ...(visual ? { visual } : {}) },
});

/** Lessons for one grade, keyed "subject/unit-id". */
export type GradeLessons = Record<string, Lesson>;

export function withLessons(courses: Course[], lessons: GradeLessons): Course[] {
  return courses.map((c) => ({
    ...c,
    units: c.units.map((u) => {
      const found = lessons[`${c.subject}/${u.id}`];
      return found && !u.lesson ? { ...u, lesson: found } : u;
    }),
  }));
}
