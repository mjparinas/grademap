import type { Derived } from "./derive";
import type { ChildSettings } from "./model";

// A child can pick a lighter or a stretch goal for the day, always relative to the goal the parent set.
// Learning time and rewards are unchanged; only the progress bar's target moves.

export type GoalLevel = "easy" | "regular" | "stretch";

const roundTo5 = (n: number) => Math.round(n / 5) * 5;

/** Minutes for each choice. Easy is about two thirds, stretch adds a third (at least 5 minutes), capped at 60. */
export function goalOptions(parentGoal: number): Record<GoalLevel, number> {
  const regular = Math.max(5, Math.min(60, parentGoal));
  return {
    easy: Math.max(5, Math.min(regular, roundTo5((regular * 2) / 3))),
    regular,
    stretch: Math.min(60, regular + Math.max(5, roundTo5(regular / 3))),
  };
}

export const GOAL_LABEL: Record<GoalLevel, { name: string; icon: string }> = {
  easy: { name: "Easy", icon: "🌱" },
  regular: { name: "Regular", icon: "🌿" },
  stretch: { name: "Stretch", icon: "🚀" },
};

/** Today's goal in minutes: the child's pick when allowed, otherwise the parent's goal. */
export function effectiveGoal(settings: ChildSettings | undefined, d: Derived, day: string): { minutes: number; level: GoalLevel } {
  const parent = settings?.dailyGoalMinutes ?? 15;
  const options = goalOptions(parent);
  const pick = settings?.lockGoal ? undefined : d.goalPicks[day];
  const level = pick?.level ?? "regular";
  return { minutes: options[level], level };
}

export const STRETCH_QUEST = "goal-stretch";
export const STRETCH_REWARD = 15;
