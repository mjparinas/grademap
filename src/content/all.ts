import { courses as k } from "./grades/k";
import { courses as g1 } from "./grades/g1";
import { courses as g2 } from "./grades/g2";
import { courses as g3 } from "./grades/g3";
import { courses as g4 } from "./grades/g4";
import { courses as g5 } from "./grades/g5";
import { courses as g6 } from "./grades/g6";
import { courses as g7 } from "./grades/g7";
import { courses as onK } from "./ontario/k";
import { courses as on1 } from "./ontario/g1";
import { courses as on2 } from "./ontario/g2";
import { courses as on3 } from "./ontario/g3";
import { courses as on4 } from "./ontario/g4";
import { courses as on5 } from "./ontario/g5";
import { courses as on6 } from "./ontario/g6";
import { courses as on7 } from "./ontario/g7";
import { mergeCourses } from "./index";
import { courses as g8 } from "./grades/g8";
import { courses as g9 } from "./grades/g9";
import type { Course, GradeId, SubjectId } from "./types";

// Every grade at once, for the statically generated public pages and for tests.
// Never import this from client code (the apps): it would put all content back
// into the first download. ESLint enforces this; the apps use ./index.

/** Every course with at least one unit. */
export const COURSES: Course[] = mergeCourses([k, g1, g2, g3, g4, g5, g6, g7, g8, g9, onK, on1, on2, on3, on4, on5, on6, on7]).filter(
  (c) => c.units.length > 0,
);

export function getCourse(grade: GradeId, subject: SubjectId | string): Course | undefined {
  return COURSES.find((c) => c.grade === grade && c.subject === subject);
}
