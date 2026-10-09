import type { Derived } from "./derive";
import { unitLevel } from "./proficiency";

// Plain-language milestones for the grown-ups' Overview and Reports. They describe
// practice in the app (never a report-card mark) and use only the child's first name.

export interface Milestone {
  id: string;
  icon: string;
  title: string;
  detail: string;
}

const DAY = 86_400_000;
const fmt = (n: number) => n.toLocaleString("en-CA");

/** The highest threshold reached, or undefined. */
const reached = (value: number, steps: number[]) => [...steps].reverse().find((s) => value >= s);

function proficientUnits(d: Derived): number {
  return Object.values(d.units).filter((u) => unitLevel(u) >= 2).length;
}

/**
 * `past` is the same child's progress as it stood about six months ago (or undefined if they hadn't started).
 */
export function milestones(name: string, d: Derived, past: Derived | undefined, now = Date.now()): Milestone[] {
  const out: Milestone[] = [];

  const firstDay = Object.keys(d.days).sort()[0];
  if (firstDay) {
    const months = Math.floor((now - new Date(`${firstDay}T12:00:00`).getTime()) / (30.4 * DAY));
    if (months >= 12) {
      const years = Math.floor(months / 12);
      out.push({ id: "anniversary", icon: "🎂", title: `${years} year${years === 1 ? "" : "s"} of learning`, detail: `${name} started practising ${months} months ago and has practised on ${fmt(d.activeDays)} days since.` });
    } else if (months >= 1) {
      out.push({ id: "anniversary", icon: "🌱", title: `${months} month${months === 1 ? "" : "s"} of learning`, detail: `${name} has practised on ${fmt(d.activeDays)} days so far.` });
    }
  }

  const days = reached(d.activeDays, [30, 100, 180, 365, 730]);
  if (days && !out.some((m) => m.id === "anniversary" && days < 100)) {
    out.push({ id: "days", icon: "📅", title: `${fmt(days)} days practised`, detail: `Learning doesn't need to be every day. ${name} has shown up on ${fmt(d.activeDays)} different days.` });
  }

  const right = reached(d.totals.correct, [100, 500, 1000, 5000, 10000, 25000]);
  if (right) out.push({ id: "right", icon: "✅", title: `${fmt(right)} questions right on the first try`, detail: `${fmt(d.totals.correct)} in total, out of ${fmt(d.totals.answers)} answered.` });

  const grew = Object.values(d.units).filter((u) => u.grew).length;
  if (grew) out.push({ id: "grew", icon: "🌿", title: `${grew} unit${grew === 1 ? "" : "s"} grown from Emerging to Proficient`, detail: `Practice paid off: ${name} stuck with topics that started out tricky.` });

  const kept = Object.values(d.units).filter((u) => u.kept).length;
  if (kept) out.push({ id: "kept", icon: "🧠", title: `Remembered ${kept} unit${kept === 1 ? "" : "s"} after a month away`, detail: `${name} came back to old topics and was still Proficient.` });

  if (past && past.totals.answers > 0) {
    const more = proficientUnits(d) - proficientUnits(past);
    if (more > 0) out.push({ id: "since", icon: "📈", title: `${more} more Proficient unit${more === 1 ? "" : "s"} than six months ago`, detail: `Proficient in ${proficientUnits(d)} units now, compared with ${proficientUnits(past)} then.` });
  }

  if (d.streak.best >= 14) out.push({ id: "streak", icon: "🔥", title: `Best streak: ${d.streak.best} days`, detail: "A streak is a bonus, not a rule. Rest-day shields cover a missed day." });

  return out;
}
