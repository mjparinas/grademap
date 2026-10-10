import { getFramework } from "@/content/frameworks";
import { CORE_SUBJECTS, getSubjectMeta, GRADE_LABEL } from "@/content/subjects";
import type { GradeId, SubjectId } from "@/content/types";
import type { FrameworkId } from "@/content/types";
import type { Derived } from "./derive";
import { levelInfo, subjectSummaries } from "./proficiency";
import type { Report, UnitRow } from "./reports";

// A one-page "report card conversation" sheet for a parent to bring to a teacher conference or read
// beside a report card: where practice stands in each subject, what to celebrate, what to ask, and a
// small two-week plan. It describes practice, never a report-card mark.

export interface SheetSubject {
  subject: SubjectId;
  title: string;
  /** -1 when nothing has been practised yet. */
  level: number;
  levelLabel: string;
  /** What the report card's scale says this level means at home. */
  atHome: string;
  /** How this level is marked on a report card, when the province uses marks. */
  marks?: string;
  started: number;
  total: number;
  /** First-try accuracy over the units practised, or null. */
  accuracy: number | null;
  strengths: string[];
  growing: string[];
}

export interface PlanItem {
  key: string;
  title: string;
  subject: string;
  goal: string;
}

export interface ConferenceSheet {
  name: string;
  gradeLabel: string;
  curriculumName: string;
  scaleName: string;
  subjects: SheetSubject[];
  /** Questions for the teacher, most useful first. */
  questions: string[];
  /** Week 1, then week 2. */
  plan: [PlanItem[], PlanItem[]];
  sessionsPerWeek: number;
  minutesPerSession: number;
}

export interface SheetInput {
  name: string;
  grade: GradeId;
  framework: FrameworkId;
  report: Report;
  derived: Derived;
  dailyGoalMinutes: number;
}

const unitAccuracy = (rows: UnitRow[]): number | null => {
  const attempts = rows.reduce((n, r) => n + r.attempts, 0);
  return attempts ? rows.reduce((n, r) => n + r.accuracy * r.attempts, 0) / attempts : null;
};

function goalFor(row: UnitRow | undefined): string {
  if (!row || row.attempts === 0) return "Try a first lesson and see how it feels.";
  if (row.level <= 1) return "Aim for 3 out of 4 right on the first try.";
  if (row.level === 2 && row.accuracy < 0.9) return "Aim for 9 out of 10 right to reach the next level.";
  return "Keep it fresh with a quick review.";
}

export function buildConferenceSheet({ name, grade, framework, report, derived, dailyGoalMinutes }: SheetInput): ConferenceSheet {
  const f = getFramework(framework);
  const scheme = f.scoringFor(grade);
  const summaries = new Map(subjectSummaries(derived, grade, framework).map((s) => [s.subject, s]));

  const subjects: SheetSubject[] = CORE_SUBJECTS.filter((s) => summaries.has(s)).map((subject) => {
    const sum = summaries.get(subject)!;
    const rows = report.units.filter((u) => u.ref.course.subject === subject);
    const started = rows.filter((r) => r.attempts > 0);
    const info = levelInfo(framework, grade, sum.level);
    return {
      subject,
      title: getSubjectMeta(subject).title.big,
      level: sum.level,
      levelLabel: info?.label ?? "Not started yet",
      atHome: info?.atHome ?? "Nothing practised yet, so there is nothing to say. A first lesson is a gentle start.",
      marks: info?.marks,
      started: sum.started,
      total: sum.total,
      accuracy: unitAccuracy(started),
      strengths: report.strengths.filter((u) => u.ref.course.subject === subject).slice(0, 2).map((u) => u.ref.unit.title),
      growing: report.needs.filter((u) => u.ref.course.subject === subject).slice(0, 2).map((u) => u.ref.unit.title),
    };
  });

  // The plan: tricky units first, then units still at Developing, then the next steps up, then new ground.
  // No more than two per subject, so it stays balanced.
  const core = report.units.filter((u) => (CORE_SUBJECTS as string[]).includes(u.ref.course.subject));
  const ranked: UnitRow[] = [
    ...core.filter((u) => u.attempts >= 3 && u.level <= 1).sort((a, b) => a.accuracy - b.accuracy),
    ...core.filter((u) => u.attempts > 0 && u.attempts < 3 && u.level <= 1),
    ...core.filter((u) => u.level === 2 && u.accuracy < 0.9).sort((a, b) => a.accuracy - b.accuracy),
    ...core.filter((u) => u.attempts === 0),
  ];
  const perSubject = new Map<string, number>();
  const picked: PlanItem[] = [];
  for (const row of ranked) {
    const subject = row.ref.course.subject;
    if (picked.some((p) => p.key === row.ref.key) || (perSubject.get(subject) ?? 0) >= 2) continue;
    perSubject.set(subject, (perSubject.get(subject) ?? 0) + 1);
    picked.push({ key: row.ref.key, title: row.ref.unit.title, subject: getSubjectMeta(subject).title.big, goal: goalFor(row) });
    if (picked.length === 4) break;
  }

  const questions: string[] = [];
  const firstGrowing = report.needs[0];
  if (firstGrowing) questions.push(`${name} is finding “${firstGrowing.ref.unit.title}” tricky in practice. Are you seeing that in class, and what would help most at home?`);
  const next = subjects.find((s) => s.level >= 0 && s.level < scheme.levels.length - 1);
  if (next) questions.push(`In ${next.title}, what would help ${name} move from ${next.levelLabel} to ${scheme.levels[next.level + 1].label}?`);
  questions.push(`What does ${scheme.levels[Math.min(2, scheme.levels.length - 1)].label} look like in ${GRADE_LABEL[grade]}? Can you show me an example?`);
  questions.push(`Which learning skills and work habits is ${name} working on, and how can we support them at home?`);
  questions.push("How can I tell whether practice at home is helping?");

  return {
    name,
    gradeLabel: GRADE_LABEL[grade],
    curriculumName: f.curriculumName,
    scaleName: scheme.name,
    subjects,
    questions,
    plan: [picked.slice(0, 2), picked.slice(2, 4)],
    sessionsPerWeek: 3,
    minutesPerSession: dailyGoalMinutes,
  };
}
