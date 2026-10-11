import type { Framework } from "@/content/frameworks";
import { SUBJECTS } from "@/content/subjects";
import type { GradeId, SubjectId } from "@/content/types";
import { subjectSeoTitle } from "./curriculum";

/** Subjects in the same order as the subject list, so a new province doesn't reshuffle the sentence. */
function orderedSubjects(ids: Iterable<SubjectId>): SubjectId[] {
  const have = new Set(ids);
  return SUBJECTS.map((s) => s.id).filter((id) => have.has(id));
}

const PROPER_SUBJECT_WORDS = new Set(["English", "French", "Core", "Immersion"]);

function joinAnd(items: readonly string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** "math, English language arts, science and social studies" */
export function subjectList(ids: readonly SubjectId[]): string {
  const names = orderedSubjects(ids).map((id) =>
    subjectSeoTitle(id)
      .split(" ")
      .map((word) => (PROPER_SUBJECT_WORDS.has(word) ? word : word.toLowerCase()))
      .join(" "),
  );
  return joinAnd(names);
}

/** "British Columbia, Ontario and the Northwest Territories" */
export function regionList(frameworks: readonly Framework[]): string {
  return joinAnd(frameworks.map((f) => (f.region === "Northwest Territories" ? "the Northwest Territories" : f.region)));
}

export interface KidStep {
  icon: string;
  kidLabel: string;
  atHome: string;
}

function mostCommon(values: readonly string[]): string | undefined {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  let best: string | undefined;
  let n = 0;
  for (const [value, count] of counts) {
    if (count > n) {
      best = value;
      n = count;
    }
  }
  return best;
}

/**
 * The four practice steps kids see in every province. The at-home note is the one most
 * provinces share, so one province's official report-card words don't become the homepage.
 */
export function kidPracticeSteps(frameworks: readonly Framework[]): KidStep[] {
  const first = frameworks[0]?.scoringFor("3").levels ?? [];
  return first.map((level, i) => {
    const notes = frameworks.map((f) => f.scoringFor("3").levels[i]?.atHome).filter((note): note is string => Boolean(note));
    return { icon: level.icon, kidLabel: level.kidLabel, atHome: mostCommon(notes) ?? level.atHome };
  });
}

/** A subject set that only some provinces include. */
export interface SubjectGap {
  subjects: SubjectId[];
  /** Provinces that include every subject in this gap. */
  included: Framework[];
  /** Provinces that are missing at least one of them. */
  missing: Framework[];
  /**
   * "except" when most provinces include the subjects ("everywhere except Saskatchewan").
   * "only" when naming the provinces that have them is the shorter sentence.
   */
  style: "except" | "only";
}

export interface ProvinceCoverage {
  /** Subjects every province includes. */
  sharedSubjects: SubjectId[];
  /** Set when every province starts and ends on the same grade. */
  range: { from: GradeId; to: GradeId } | null;
  gaps: SubjectGap[];
}

/**
 * Collapses the homepage province list. Subjects that every province shares are
 * stated once; subjects that only some provinces include stay attached to those provinces.
 */
export function provinceCoverage(frameworks: readonly Framework[]): ProvinceCoverage {
  const sharedSubjects = orderedSubjects(SUBJECTS.map((s) => s.id).filter((id) => frameworks.every((f) => f.subjects.includes(id))));
  const extra = orderedSubjects(SUBJECTS.map((s) => s.id).filter((id) => frameworks.some((f) => f.subjects.includes(id)) && !sharedSubjects.includes(id)));

  // Group extras that the same provinces include, so French Immersion and Core French stay one phrase.
  const byWho = new Map<string, { subjects: SubjectId[]; included: Framework[] }>();
  for (const id of extra) {
    const included = frameworks.filter((f) => f.subjects.includes(id));
    const key = included.map((f) => f.id).join(",");
    const group = byWho.get(key) ?? { subjects: [], included };
    group.subjects.push(id);
    byWho.set(key, group);
  }

  const gaps: SubjectGap[] = [...byWho.values()].map((group) => {
    const missing = frameworks.filter((f) => !group.included.includes(f));
    return {
      subjects: group.subjects,
      included: group.included,
      missing,
      style: missing.length < group.included.length ? "except" : "only",
    };
  });

  const first = frameworks[0];
  const from = first?.grades[0];
  const to = first ? first.grades[first.grades.length - 1] : undefined;
  const sameRange = Boolean(from && to && frameworks.every((f) => f.grades[0] === from && f.grades[f.grades.length - 1] === to));

  return {
    sharedSubjects,
    range: sameRange && from && to ? { from, to } : null,
    gaps,
  };
}
