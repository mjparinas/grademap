import { isCoreSubject } from "@/content/subjects";
import { allUnitRefs } from "@/content";
import { getFramework, type ProficiencyLevel } from "@/content/frameworks";
import type { FrameworkId, GradeId, SubjectId } from "@/content/types";
import type { Derived, UnitStat } from "./derive";

// Turns practice results into a proficiency level using the child's
// framework's scale (BC: Emerging → Developing → Proficient → Extending).
// Levels are indexes 0–3; -1 means not started.

export const NOT_STARTED = -1;

export function recentAccuracy(stat: UnitStat): number {
  return stat.recent.length ? stat.recent.filter(Boolean).length / stat.recent.length : 0;
}

export function unitLevel(stat: UnitStat | undefined): number {
  if (!stat || stat.attempts === 0) return NOT_STARTED;
  const acc = recentAccuracy(stat);
  if (stat.attempts < 4) return acc >= 0.75 ? 1 : 0;
  if (acc >= 0.9 && stat.attempts >= 16 && stat.challengePassed) return 3;
  if (acc >= 0.75 && stat.attempts >= 8) return 2;
  if (acc >= 0.5) return 1;
  return 0;
}

/** What it takes to reach the next level, in kid-friendly words. */
export function nextStep(stat: UnitStat | undefined): string {
  const level = unitLevel(stat);
  const acc = stat ? recentAccuracy(stat) : 0;
  if (level === NOT_STARTED) return "Play a lesson to get started!";
  if (level === 3) return "You're a star at this! Keep it shiny with a review now and then.";
  if (level === 2) {
    if (acc < 0.9) return "Get 9 out of 10 right to reach the next level.";
    if ((stat?.attempts ?? 0) < 16) return "Keep practising to reach the next level.";
    return "Pass a Challenge to become a Star!";
  }
  if (level === 1) return (stat?.attempts ?? 0) < 8 ? "Keep practising to grow!" : "Get 3 out of 4 right to grow into a tree.";
  return "Every try helps you grow. Keep going!";
}

export function levelInfo(framework: FrameworkId, grade: GradeId, level: number): ProficiencyLevel | undefined {
  if (level < 0) return undefined;
  return getFramework(framework).scoringFor(grade).levels[level];
}

export interface SubjectSummary {
  subject: SubjectId;
  started: number;
  total: number;
  /** Typical level across started units (median), or -1. */
  level: number;
  counts: number[];
}

export function subjectSummaries(d: Derived, grade: GradeId, framework: FrameworkId): SubjectSummary[] {
  const bySubject = new Map<SubjectId, number[]>();
  for (const ref of allUnitRefs(grade, framework)) {
    // French is opt-in: only show it once the child has started it.
    if (!isCoreSubject(ref.course.subject) && !d.units[ref.key]) continue;
    const list = bySubject.get(ref.course.subject) ?? [];
    list.push(unitLevel(d.units[ref.key]));
    bySubject.set(ref.course.subject, list);
  }
  return [...bySubject.entries()].map(([subject, levels]) => {
    const started = levels.filter((l) => l >= 0).sort((a, b) => a - b);
    const counts = [0, 1, 2, 3].map((i) => levels.filter((l) => l === i).length);
    return {
      subject,
      started: started.length,
      total: levels.length,
      level: started.length ? started[Math.floor((started.length - 1) / 2)] : NOT_STARTED,
      counts,
    };
  });
}

/** Units in the child's grade at or above `level`. */
export function unitsAtLeast(d: Derived, grade: GradeId, framework: FrameworkId, level: number, subject?: SubjectId): number {
  return allUnitRefs(grade, framework).filter((r) => (subject ? r.course.subject === subject : isCoreSubject(r.course.subject)) && unitLevel(d.units[r.key]) >= level)
    .length;
}
