import { coursesForGrade, unitKey } from "@/content";
import { rand, sample } from "@/content/random";
import { GRADE_LABEL, GRADE_ORDER } from "@/content/subjects";
import type { GradeId, Question, SubjectId } from "@/content/types";
import type { AppEvent, EventOf } from "./model";

// The placement test: a short, adaptive check of where a child sits against
// grade-level expectations in one subject. It walks up or down the grades in
// blocks of four questions, built from the same BC-aligned lesson generators
// as practice. Answers are NOT logged as practice (no XP, stars or mastery), and
// there are no retries or hints, so the result reflects what the child can do alone.

export const STAGE_SIZE = 4;
export const MAX_STAGES = 4;
/** Subjects with a placement test, in the order parents see them. */
export const PLACEMENT_SUBJECTS: SubjectId[] = ["math", "language"];

export type Verdict = "strong" | "partial" | "weak";

export interface Stage {
  grade: GradeId;
  total: number;
  correct: number;
  /** Unit keys asked in this stage, and the ones missed. */
  asked: string[];
  missed: string[];
}

export interface StageQuestion {
  question: Question;
  unitKey: string;
}

export type PlacementEvent = EventOf<"placement">;

/** 3 or 4 of 4 right is secure, 2 is mixed, 0 or 1 is not there yet. */
export function verdict(stage: Pick<Stage, "total" | "correct">): Verdict {
  const share = stage.total ? stage.correct / stage.total : 0;
  return share >= 0.75 ? "strong" : share >= 0.5 ? "partial" : "weak";
}

/** Grades that have lessons in this subject, lowest first. Only counts grades that have loaded. */
export function gradesWithSubject(subject: SubjectId): GradeId[] {
  return GRADE_ORDER.filter((g) => coursesForGrade(g).some((c) => c.subject === subject && c.units.length > 0));
}

/**
 * The next grade to test, or undefined when the test is finished: a mixed
 * result (the child is working at that grade), a bracket (secure below, not
 * yet above), the edge of the curriculum, or the question limit.
 */
export function nextGrade(stages: Stage[], grades: GradeId[]): GradeId | undefined {
  const last = stages[stages.length - 1];
  if (!last || stages.length >= MAX_STAGES) return undefined;
  const v = verdict(last);
  if (v === "partial") return undefined;
  const i = grades.indexOf(last.grade);
  const next = grades[v === "strong" ? i + 1 : i - 1];
  if (!next || stages.some((s) => s.grade === next)) return undefined;
  return next;
}

/** Four questions from four different units of one grade, quick answer types first. */
export function buildStage(grade: GradeId, subject: SubjectId): StageQuestion[] {
  const course = coursesForGrade(grade).find((c) => c.subject === subject);
  if (!course) return [];
  const units = sample(course.units, Math.min(STAGE_SIZE, course.units.length));
  const out: StageQuestion[] = [];
  for (let i = 0; i < STAGE_SIZE; i++) {
    const unit = units[i % units.length];
    const all = unit.generate({ difficulty: 2 });
    const quick = all.filter((q) => q.kind === "choice" || q.kind === "input");
    const pool = quick.length ? quick : all;
    // Avoid asking the exact same question twice when a unit is used again.
    const fresh = pool.filter((q) => !out.some((o) => o.question.prompt === q.prompt));
    const list = fresh.length ? fresh : pool;
    out.push({ question: list[Math.floor(rand() * list.length)], unitKey: unitKey(grade, subject, unit.id) });
  }
  return out;
}

export interface PlacementResult {
  subject: SubjectId;
  /** The grade the child was checked against first (their current grade). */
  startGrade: GradeId;
  stages: Pick<Stage, "grade" | "total" | "correct">[];
  /** The highest grade they handled securely (or, if none, where their answers were mixed). */
  placedGrade: GradeId;
  /** Up to three units to begin with, in the placed grade. */
  startUnits: string[];
  /** Units missed in lower grades, worth a quick revisit. */
  reviewUnits: string[];
  /** A short test is only a snapshot: "low" when the answers were mixed or ran out of room. */
  confidence: "ok" | "low";
}

const byGradeIndex = (a: Stage, b: Stage) => GRADE_ORDER.indexOf(a.grade) - GRADE_ORDER.indexOf(b.grade);

/** Turns finished stages into a recommendation. Needs the tested grades to be loaded to order units. */
export function summarize(subject: SubjectId, startGrade: GradeId, stages: Stage[]): PlacementResult {
  const sorted = [...stages].sort(byGradeIndex);
  const secure = sorted.filter((s) => verdict(s) === "strong");
  const mixed = sorted.filter((s) => verdict(s) === "partial");
  const lowest = sorted[0];
  const all = gradesWithSubject(subject);

  let placed: GradeId;
  if (secure.length) placed = secure[secure.length - 1].grade;
  else if (mixed.length) placed = mixed[mixed.length - 1].grade;
  else {
    // Not secure anywhere we looked: place one grade below the lowest tested, if the test ran out of room.
    const below = all[all.indexOf(lowest.grade) - 1];
    placed = below ?? lowest.grade;
  }

  const startStage = sorted.find((s) => s.grade === placed);
  const order = coursesForGrade(placed)
    .filter((c) => c.subject === subject)
    .flatMap((c) => c.units.map((u) => unitKey(c.grade, c.subject, u.id)));
  const correct = new Set((startStage?.asked ?? []).filter((k) => !startStage?.missed.includes(k)));
  const missedHere = startStage?.missed ?? [];
  const rest = order.filter((k) => !missedHere.includes(k) && !correct.has(k));
  const startUnits = [...new Set([...missedHere, ...rest, ...order])].slice(0, 3);

  const reviewUnits = [
    ...new Set(
      sorted
        .filter((s) => GRADE_ORDER.indexOf(s.grade) < GRADE_ORDER.indexOf(placed))
        .flatMap((s) => s.missed),
    ),
  ].slice(0, 4);

  // Low confidence: only mixed answers, or the test ran out of questions before it pinned the level down.
  const last = stages[stages.length - 1];
  const lastVerdict = last ? verdict(last) : "partial";
  const idx = all.indexOf(last?.grade);
  const untested = all[lastVerdict === "strong" ? idx + 1 : idx - 1];
  const unresolved = lastVerdict !== "partial" && untested !== undefined && !stages.some((s) => s.grade === untested);
  const confidence = (mixed.length && !secure.length) || unresolved ? "low" : "ok";

  return {
    subject,
    startGrade,
    stages: sorted.map(({ grade, total, correct: c }) => ({ grade, total, correct: c })),
    placedGrade: placed,
    startUnits,
    reviewUnits,
    confidence,
  };
}

/** How the placed grade compares with the child's current grade. */
export function compareToGrade(placed: GradeId, current: GradeId): "below" | "at" | "above" {
  const d = GRADE_ORDER.indexOf(placed) - GRADE_ORDER.indexOf(current);
  return d < 0 ? "below" : d > 0 ? "above" : "at";
}

export function placementSentence(result: PlacementResult, name: string, current: GradeId): string {
  const placed = GRADE_LABEL[result.placedGrade];
  const where = compareToGrade(result.placedGrade, current);
  if (where === "at") return `${name} is working at a ${placed} level in this subject.`;
  if (where === "above") return `${name} handled ${placed} work, which is ahead of ${GRADE_LABEL[current]}.`;
  return `${name} found ${GRADE_LABEL[current]} work tricky, and is most comfortable around ${placed}.`;
}

export function toEvent(result: PlacementResult): Omit<PlacementEvent, "id" | "t" | "profileId"> {
  return { type: "placement", ...result };
}

/** The latest placement result for each subject, from a child's events. */
export function latestPlacements(events: AppEvent[]): Partial<Record<SubjectId, PlacementEvent>> {
  const out: Partial<Record<SubjectId, PlacementEvent>> = {};
  for (const e of events) {
    if (e.type !== "placement") continue;
    const prev = out[e.subject];
    if (!prev || e.t > prev.t) out[e.subject] = e;
  }
  return out;
}
