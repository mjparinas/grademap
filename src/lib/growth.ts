import { derive, type Derived } from "./derive";
import type { AppEvent } from "./model";
import { unitLevel } from "./proficiency";

// "Is it working?" for the grown-ups: where a child's units stood some time ago against today.
// Reads only the event log and unit keys, so it never depends on which grades have loaded.
// It describes practice in the app, not a report-card mark.

const DAY = 86_400_000;

export interface UnitMove {
  key: string;
  /** Level then (-1 = not started) and now. */
  from: number;
  to: number;
}

export interface Growth {
  days: number;
  /** The child had practised before the starting point; otherwise "then" is a blank slate. */
  hadHistory: boolean;
  startedThen: number;
  startedNow: number;
  proficientThen: number;
  proficientNow: number;
  /** Units that went up at least one level, biggest jumps first. */
  moved: UnitMove[];
  answersSince: number;
  daysPractisedSince: number;
}

const count = (d: Derived, test: (level: number) => boolean) => Object.values(d.units).filter((u) => test(unitLevel(u))).length;

export function growthSince(events: AppEvent[], now: number, days: number, current?: Derived): Growth {
  const cutoff = now - days * DAY;
  const before = events.filter((e) => e.t < cutoff);
  const then = derive(before, cutoff);
  const today = current ?? derive(events, now);
  const moved: UnitMove[] = [];
  for (const [key, stat] of Object.entries(today.units)) {
    const to = unitLevel(stat);
    const from = unitLevel(then.units[key]);
    if (to > from && to >= 0) moved.push({ key, from, to });
  }
  moved.sort((a, b) => b.to - b.from - (a.to - a.from) || b.to - a.to);
  const since = events.filter((e) => e.t >= cutoff);
  return {
    days,
    hadHistory: then.totals.answers > 0,
    startedThen: count(then, (l) => l >= 0),
    startedNow: count(today, (l) => l >= 0),
    proficientThen: count(then, (l) => l >= 2),
    proficientNow: count(today, (l) => l >= 2),
    moved,
    answersSince: since.filter((e) => e.type === "answer").length,
    daysPractisedSince: new Set(since.filter((e) => e.type === "answer").map((e) => new Date(e.t).toDateString())).size,
  };
}
