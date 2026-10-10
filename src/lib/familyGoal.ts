import type { Derived } from "./derive";
import { activeDay, weekDays, weekStart } from "./quests";

// A parent's weekly "days practised" goal and the short kind notes they can send. Both live in the
// child's synced settings; progress is read from events, so it needs no stored state.

export const NUDGE_PRESETS = [
  { id: "proud", text: "I'm proud of you! 🌟" },
  { id: "together", text: "Let's practise together today 💛" },
  { id: "great-week", text: "Great week so far. Keep it going! 🌈" },
  { id: "tell-me", text: "I can't wait to hear what you learned 📚" },
] as const;

/** A note stops showing after this long if the child hasn't opened the app. */
export const NUDGE_DAYS = 3;

export const GOAL_CHOICES = [2, 3, 4, 5, 7] as const;

export function nudgeText(presetId: string): string | undefined {
  return NUDGE_PRESETS.find((n) => n.id === presetId)?.text;
}

/** The note to show a child now: a known preset, not too old. */
export function activeNudge(nudge: { id: string; preset: string; sentAt: number } | undefined, now: number): { id: string; text: string } | undefined {
  if (!nudge || now - nudge.sentAt > NUDGE_DAYS * 86_400_000) return undefined;
  const text = nudgeText(nudge.preset);
  return text ? { id: nudge.id, text } : undefined;
}

export interface WeekProgress {
  /** Days practised so far this week (Monday to Sunday). */
  days: number;
  goal: number;
  met: boolean;
  /** One entry per day, Monday first. */
  dots: { day: string; practised: boolean }[];
}

export function weekProgress(d: Pick<Derived, "days">, goalDays: number, now: number): WeekProgress {
  const dots = weekDays(weekStart(now)).map((day) => ({ day, practised: Boolean(d.days[day] && activeDay(d.days[day])) }));
  const days = dots.filter((x) => x.practised).length;
  return { days, goal: goalDays, met: days >= goalDays, dots };
}
