import { allUnitRefs, type UnitRef } from "@/content";
import type { GradeId, SubjectId } from "@/content/types";
import type { Derived } from "./derive";

// Picks the next unit for Adventure and Review. Units the child finds hard,
// hasn't tried much, or hasn't seen in a while come up more often, while the
// mix keeps hopping between subjects so it never feels repetitive.

const DAY = 86_400_000;

export interface Pick {
  ref: UnitRef;
  difficulty: 1 | 2 | 3;
}

export interface PickOptions {
  grade: GradeId;
  derived: Derived;
  subjects: SubjectId[];
  /** Unit keys asked most recently, newest last. */
  recent: string[];
  mode: "adventure" | "review" | "speed";
  /** Limit to one subject. */
  subject?: SubjectId;
  /** Allowed unit keys (e.g. the free plan's units). */
  allowed?: (ref: UnitRef) => boolean;
  now?: number;
  random?: () => number;
}

export function unitWeight(opts: PickOptions, ref: UnitRef): number {
  const now = opts.now ?? Date.now();
  const stat = opts.derived.units[ref.key];
  const attempts = stat?.attempts ?? 0;
  const mastery = stat?.mastery ?? 0;
  const need = Math.pow(1 - mastery, 1.5);
  const staleDays = stat ? (now - stat.lastT) / DAY : 0;
  const spaced = attempts > 0 ? Math.min(1, staleDays / 7) : 0;

  let w: number;
  if (opts.mode === "review") {
    if (attempts === 0) return 0;
    w = 0.05 + need * 2 + spaced * 1.5;
  } else if (opts.mode === "speed") {
    // Speed runs favour things the child already knows, to build fluency.
    w = attempts === 0 ? 0.2 : 0.3 + mastery;
  } else {
    const novelty = attempts < 5 ? 1.2 : attempts < 12 ? 0.4 : 0;
    w = 0.15 + need * 1.6 + novelty + spaced * 0.6;
  }

  const last = opts.recent.slice(-2);
  if (last.includes(ref.key)) w *= 0.08;
  const lastSubjects = last.map((k) => k.split("/")[1]);
  if (lastSubjects.filter((s) => s === ref.course.subject).length >= 2) w *= 0.4;
  return w;
}

export function difficultyFor(mastery: number, mode: PickOptions["mode"]): 1 | 2 | 3 {
  const base = mastery < 0.5 ? 1 : mastery < 0.8 ? 2 : 3;
  if (mode === "review") return Math.max(1, base - 1) as 1 | 2;
  if (mode === "speed") return Math.max(1, base - 1) as 1 | 2;
  return base;
}

export function candidates(opts: PickOptions): UnitRef[] {
  return allUnitRefs(opts.grade).filter(
    (r) =>
      opts.subjects.includes(r.course.subject) &&
      (!opts.subject || r.course.subject === opts.subject) &&
      (!opts.allowed || opts.allowed(r)),
  );
}

export function pickNext(opts: PickOptions): Pick | undefined {
  const random = opts.random ?? Math.random;
  let pool = candidates(opts);
  let weights = pool.map((r) => unitWeight(opts, r));
  // Review with nothing practised yet falls back to an adventure-style pick.
  if (weights.every((w) => w === 0)) {
    weights = pool.map((r) => unitWeight({ ...opts, mode: "adventure" }, r));
  }
  const total = weights.reduce((a, b) => a + b, 0);
  if (!pool.length || total <= 0) return undefined;
  let roll = random() * total;
  let i = 0;
  for (; i < pool.length - 1; i++) {
    roll -= weights[i];
    if (roll <= 0) break;
  }
  pool = pool.slice();
  const ref = pool[i];
  return { ref, difficulty: difficultyFor(opts.derived.units[ref.key]?.mastery ?? 0, opts.mode) };
}

/** Units that most need practice, for parent reports and the Review screen. */
export function weakest(opts: Omit<PickOptions, "recent" | "mode">, n = 5): UnitRef[] {
  return candidates({ ...opts, recent: [], mode: "review" })
    .filter((r) => (opts.derived.units[r.key]?.attempts ?? 0) > 0)
    .sort((a, b) => (opts.derived.units[a.key]?.mastery ?? 0) - (opts.derived.units[b.key]?.mastery ?? 0))
    .slice(0, n);
}
