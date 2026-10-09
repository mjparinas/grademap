import { COMPETITORS } from "@/content/compare";
import { FRAMEWORKS, type Framework } from "@/content/frameworks";
import { gradeSlug } from "@/content/subjects";
import type { GradeId, SubjectId } from "@/content/types";
import { coursesFor, gradesWithContent } from "./curriculum";

// URLs for the parent guides. Like the curriculum pages, they carry the framework
// slug: /guides/bc/grade-3/math/ and so on.

export const guidePath = {
  hub: (f: Framework) => `/guides/${f.slug}/`,
  grade: (f: Framework, g: GradeId) => `/guides/${f.slug}/${gradeSlug(g)}/`,
  subject: (f: Framework, g: GradeId, s: SubjectId) => `/guides/${f.slug}/${gradeSlug(g)}/${s}/`,
  worksheet: (f: Framework, g: GradeId, s: SubjectId) => `/guides/${f.slug}/${gradeSlug(g)}/${s}/worksheet/`,
  competencies: (f: Framework) => `/guides/${f.slug}/core-competencies/`,
  assessment: (f: Framework) => `/guides/${f.slug}/fsa/`,
  compareIndex: () => "/compare/",
  compare: (slug: string) => `/compare/${slug}/`,
};

export function allGuidePaths(): { path: string; priority: number }[] {
  const out: { path: string; priority: number }[] = [{ path: guidePath.compareIndex(), priority: 0.6 }];
  for (const c of COMPETITORS) out.push({ path: guidePath.compare(c.slug), priority: 0.6 });
  for (const f of FRAMEWORKS) {
    out.push({ path: guidePath.hub(f), priority: 0.8 });
    out.push({ path: guidePath.competencies(f), priority: 0.8 });
    out.push({ path: guidePath.assessment(f), priority: 0.8 });
    for (const g of gradesWithContent(f)) {
      out.push({ path: guidePath.grade(f, g), priority: 0.8 });
      for (const c of coursesFor(f, g)) {
        out.push({ path: guidePath.subject(f, g, c.subject), priority: 0.7 });
        out.push({ path: guidePath.worksheet(f, g, c.subject), priority: 0.6 });
      }
    }
  }
  return out;
}
