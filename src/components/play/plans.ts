import { allUnitRefs, getUnitRef, type UnitRef } from "@/content";
import { hashSeed, pick, sample, shuffle, withSeed } from "@/content/random";
import { getSubjectMeta } from "@/content/subjects";
import type { AgeBand, GradeId, Question, SubjectId } from "@/content/types";
import { pickNext, type PickOptions } from "@/lib/adaptive";
import type { Derived } from "@/lib/derive";
import { dayKey, type Mode } from "@/lib/model";

// How each mode chooses questions, how long it lasts, and its rules.

export interface Item {
  question: Question;
  unitKey: string;
  difficulty: number;
}

export interface Plan {
  mode: Mode;
  scope: string;
  title: string;
  icon: string;
  /** Fixed number of questions; undefined = keep going. */
  total?: number;
  /** Countdown in seconds. */
  timeLimit?: number;
  /** Can the child try again after a miss? */
  retries: boolean;
  /** "flash" = quick auto-advance (speed runs). */
  feedback: "bar" | "flash";
  /** Endless modes pause for a summary every N questions. */
  checkpoint?: number;
  next: (ctx: { index: number; recent: string[]; derived: Derived }) => Item | undefined;
}

const QUICK = (q: Question) => q.kind === "choice" || q.kind === "input";

function oneFrom(ref: UnitRef, difficulty: 1 | 2 | 3, filter?: (q: Question) => boolean): Question | undefined {
  for (let tries = 0; tries < 4; tries++) {
    const qs = ref.unit.generate({ difficulty });
    const ok = filter ? qs.filter(filter) : qs;
    if (ok.length) return pick(ok);
  }
  return undefined;
}

function difficultyFromMastery(m: number | undefined): 1 | 2 | 3 {
  if (m === undefined) return 2;
  return m < 0.5 ? 1 : m < 0.85 ? 2 : 3;
}

export interface PlanInput {
  mode: Mode;
  scope: string;
  grade: GradeId;
  band: AgeBand;
  profileId: string;
  subjects: SubjectId[];
  derived: Derived;
  allowed: (ref: UnitRef) => boolean;
  /** Five questions at a time in Adventure and Review. */
  short?: boolean;
}

export function makePlan(input: PlanInput): Plan | null {
  const { mode, scope, grade, band, subjects, derived, allowed } = input;
  const pickOpts = (m: PickOptions["mode"], recent: string[], d: Derived): PickOptions => ({
    grade,
    derived: d,
    subjects,
    recent,
    mode: m,
    allowed,
    subject: subjects.includes(scope as SubjectId) ? (scope as SubjectId) : undefined,
  });

  if (mode === "practice" || mode === "challenge") {
    const ref = getUnitRef(scope);
    if (!ref) return null;
    const challenge = mode === "challenge";
    const difficulty = challenge ? 3 : difficultyFromMastery(derived.units[ref.key]?.mastery);
    let qs = ref.unit.generate({ difficulty });
    if (challenge) {
      while (qs.length < 10) qs = [...qs, ...ref.unit.generate({ difficulty })];
      qs = qs.slice(0, 10);
    }
    return {
      mode,
      scope,
      title: challenge ? `${ref.unit.title} Challenge` : ref.unit.title,
      icon: challenge ? "🛡️" : ref.unit.emoji,
      total: qs.length,
      timeLimit: challenge ? (band === "little" ? 420 : 300) : undefined,
      retries: !challenge,
      feedback: "bar",
      next: ({ index }) => (qs[index] ? { question: qs[index], unitKey: ref.key, difficulty } : undefined),
    };
  }

  if (mode === "daily") {
    const day = dayKey(Date.now());
    // Same 10 questions all day, on every device.
    const items = withSeed(hashSeed(`${input.profileId}:daily:${day}`), () => {
      const refs = allUnitRefs(grade).filter((r) => subjects.includes(r.course.subject) && allowed(r));
      const bySubject = subjects.map((s) => shuffle(refs.filter((r) => r.course.subject === s))).filter((l) => l.length);
      const chosen: UnitRef[] = [];
      for (let i = 0; chosen.length < 10 && bySubject.length; i++) {
        const list = bySubject[i % bySubject.length];
        chosen.push(list[Math.floor(i / bySubject.length) % list.length]);
      }
      return chosen.map((ref) => {
        const q = oneFrom(ref, 2) ?? ref.unit.generate()[0];
        return { question: q, unitKey: ref.key, difficulty: 2 };
      });
    });
    return {
      mode,
      scope: "mix",
      title: "Daily Challenge",
      icon: "☀️",
      total: items.length,
      retries: true,
      feedback: "bar",
      next: ({ index }) => items[index],
    };
  }

  if (mode === "speed") {
    return {
      mode,
      scope,
      title: scope === "mix" ? "Speed Run" : `${getSubjectMeta(scope).title[band]} Speed Run`,
      icon: "⚡",
      timeLimit: band === "little" ? 90 : 60,
      retries: false,
      feedback: "flash",
      next: ({ recent, derived: d }) => {
        for (let tries = 0; tries < 8; tries++) {
          const p = pickNext(pickOpts("speed", recent, d));
          if (!p) return undefined;
          const q = oneFrom(p.ref, p.difficulty, QUICK);
          if (q) return { question: q, unitKey: p.ref.key, difficulty: p.difficulty };
        }
        return undefined;
      },
    };
  }

  // Adventure (endless, adaptive) and Review (10 from weak spots).
  const review = mode === "review";
  return {
    mode,
    scope: "mix",
    title: review ? "Review" : "Adventure",
    icon: review ? "🔍" : "🗺️",
    total: review ? (input.short ? 5 : 10) : undefined,
    retries: true,
    feedback: "bar",
    checkpoint: review ? undefined : input.short ? 5 : 10,
    next: ({ recent, derived: d }) => {
      const p = pickNext(pickOpts(review ? "review" : "adventure", recent, d));
      if (!p) return undefined;
      const q = oneFrom(p.ref, p.difficulty);
      return q ? { question: q, unitKey: p.ref.key, difficulty: p.difficulty } : undefined;
    },
  };
}

/** Pick a few units for the hub's "try next" suggestions. */
export function suggestions(grade: GradeId, derived: Derived, subjects: SubjectId[], allowed: (r: UnitRef) => boolean, n = 3): UnitRef[] {
  const refs = allUnitRefs(grade).filter((r) => subjects.includes(r.course.subject) && allowed(r));
  const fresh = refs.filter((r) => !derived.units[r.key]);
  const weak = refs.filter((r) => derived.units[r.key] && derived.units[r.key].mastery < 0.7);
  return [...sample(weak, Math.min(1, weak.length)), ...fresh].slice(0, n);
}
