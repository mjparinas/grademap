import type { Framework } from "@/content/frameworks";
import { gradeSlug } from "@/content/subjects";
import type { GradeId } from "@/content/types";
import { FRAMEWORKS } from "@/content/frameworks";
import { gradesWithContent } from "./curriculum";

// Public pages for teachers. The classroom area itself (/teachers/) is a private app and stays
// noindex; these pages are what search visitors land on before they create a teacher account.

/** Frameworks the classroom area can assign units from. Classes follow BC or Ontario (see TeacherApp). */
const TEACHER_FRAMEWORK_IDS = ["ca-bc", "ca-on", "ca-sk", "ca-mb"];

export const TEACHER_FRAMEWORKS: Framework[] = FRAMEWORKS.filter((f) => TEACHER_FRAMEWORK_IDS.includes(f.id));

/** Where a teacher creates an account and signs in. */
export const TEACHER_SIGNUP = "/teachers/";

export const teacherPath = {
  hub: () => "/for-teachers/",
  framework: (f: Framework) => `/for-teachers/${f.slug}/`,
  grade: (f: Framework, g: GradeId) => `/for-teachers/${f.slug}/${gradeSlug(g)}/`,
};

export function allTeacherPaths(): { path: string; priority: number }[] {
  const out = [{ path: teacherPath.hub(), priority: 0.8 }];
  for (const f of TEACHER_FRAMEWORKS) {
    out.push({ path: teacherPath.framework(f), priority: 0.8 });
    for (const g of gradesWithContent(f)) out.push({ path: teacherPath.grade(f, g), priority: 0.7 });
  }
  return out;
}
