import { unitKey } from "@/content";
import { COURSES, getCourse } from "@/content/all";
import { FRAMEWORKS, getFramework, type Framework } from "@/content/frameworks";
import { GRADE_LABEL, ageBandFor, getSubjectMeta, gradeFromSlug, gradeSlug } from "@/content/subjects";
import type { Course, GradeId, SubjectId, Unit } from "@/content/types";

// Shared lookups for the public curriculum pages. URLs look like
// /curriculum/bc/grade-3/math/multiplication/ and never change with content.

export function frameworkBySlug(slug: string): Framework | undefined {
  return FRAMEWORKS.find((f) => f.slug === slug);
}

export function coursesFor(framework: Framework, grade: GradeId): Course[] {
  // Every course carries standards per framework; only list the ones this framework covers.
  return COURSES.filter((c) => c.grade === grade && framework.grades.includes(grade) && c.units.some((u) => u.standards[framework.id]));
}

export function gradesWithContent(framework: Framework): GradeId[] {
  return framework.grades.filter((g) => coursesFor(framework, g).length > 0);
}

export function subjectTitle(subject: SubjectId, grade: GradeId): string {
  return getSubjectMeta(subject).title[ageBandFor(grade)];
}

/** Subject name as parents search for it, whatever the kids see. */
export function subjectSeoTitle(subject: SubjectId): string {
  return { math: "Math", language: "English Language Arts", science: "Science", social: "Social Studies", immersion: "French Immersion", "core-french": "Core French" }[subject];
}

export const curriculumPath = {
  index: () => "/curriculum/",
  framework: (f: Framework) => `/curriculum/${f.slug}/`,
  grade: (f: Framework, g: GradeId) => `/curriculum/${f.slug}/${gradeSlug(g)}/`,
  subject: (f: Framework, g: GradeId, s: SubjectId) => `/curriculum/${f.slug}/${gradeSlug(g)}/${s}/`,
  unit: (f: Framework, g: GradeId, s: SubjectId, u: string) => `/curriculum/${f.slug}/${gradeSlug(g)}/${s}/${u}/`,
};

export interface Resolved {
  framework: Framework;
  grade: GradeId;
  course?: Course;
  unit?: Unit;
}

/** Resolve URL params, or undefined for a 404. */
export function resolve(params: { framework: string; grade?: string; subject?: string; unit?: string }): Resolved | undefined {
  const framework = frameworkBySlug(params.framework);
  if (!framework) return undefined;
  if (!params.grade) return { framework, grade: framework.grades[0] };
  const grade = gradeFromSlug(params.grade);
  if (!grade || !framework.grades.includes(grade)) return undefined;
  if (!params.subject) return { framework, grade };
  const course = getCourse(grade, params.subject);
  if (!course || !coursesFor(framework, grade).includes(course)) return undefined;
  if (!params.unit) return { framework, grade, course };
  const unit = course.units.find((u) => u.id === params.unit && u.standards[framework.id]);
  if (!unit) return undefined;
  return { framework, grade, course, unit };
}

export function allCurriculumPaths(): string[] {
  const paths: string[] = [curriculumPath.index()];
  for (const f of FRAMEWORKS) {
    paths.push(curriculumPath.framework(f));
    for (const g of gradesWithContent(f)) {
      paths.push(curriculumPath.grade(f, g));
      for (const c of coursesFor(f, g)) {
        paths.push(curriculumPath.subject(f, g, c.subject));
        for (const u of c.units) if (u.standards[f.id]) paths.push(curriculumPath.unit(f, g, c.subject, u.id));
      }
    }
  }
  return paths;
}

export function gradeHeading(framework: Framework, grade: GradeId): string {
  return `${GRADE_LABEL[grade]} ${framework.shortName}`;
}

export { getFramework, unitKey };
