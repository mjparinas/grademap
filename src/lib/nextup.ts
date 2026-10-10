import type { Derived } from "./derive";
import { questionsToNextLevel } from "./proficiency";

export interface NextUp {
  key: string;
  questions: number;
  /** The level the child is about to reach (0 to 3). */
  level: number;
}

/**
 * The unit that is closest to its next level, so a child always has one small, near step to aim for.
 * Only units the child has started count; ties go to the one practised most recently.
 */
export function nextUp(d: Derived, keys: string[]): NextUp | null {
  let best: (NextUp & { lastT: number }) | null = null;
  for (const key of keys) {
    const stat = d.units[key];
    const step = questionsToNextLevel(stat);
    if (!step) continue;
    if (!best || step.questions < best.questions || (step.questions === best.questions && stat.lastT > best.lastT)) {
      best = { key, questions: step.questions, level: step.level, lastT: stat.lastT };
    }
  }
  return best && { key: best.key, questions: best.questions, level: best.level };
}
