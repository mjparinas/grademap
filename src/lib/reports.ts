import { allUnitRefs, parseUnitKey, type UnitRef } from "@/content";
import type { FrameworkId, GradeId, SubjectId } from "@/content/types";
import type { Derived } from "./derive";
import { learnSecondsFor } from "./derive";
import { dayKey, type AppEvent } from "./model";
import { recentAccuracy, unitLevel } from "./proficiency";

// Numbers for the parent reports, computed from a child's event log.

const DAY = 86_400_000;

export interface DayPoint {
  day: string;
  label: string;
  minutes: number;
  answers: number;
  correct: number;
}

export interface WeekPoint {
  start: string;
  label: string;
  answers: number;
  accuracy: number | null;
}

export interface SubjectPoint {
  subject: SubjectId;
  answers: number;
  correct: number;
  minutes: number;
}

export interface UnitRow {
  ref: UnitRef;
  level: number;
  attempts: number;
  accuracy: number;
  lastT: number;
}

export interface Report {
  days: DayPoint[];
  weeks: WeekPoint[];
  subjects: SubjectPoint[];
  totals: { minutes: number; answers: number; correct: number; sessions: number; activeDays: number; avgSeconds: number; hints: number };
  previous: { minutes: number; answers: number; correct: number };
  units: UnitRow[];
  strengths: UnitRow[];
  needs: UnitRow[];
  notStarted: number;
  trophies: { id: string; t: number }[];
}

function startOfDay(t: number): number {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

const shortDate = (t: number) => new Date(t).toLocaleDateString("en-CA", { month: "short", day: "numeric" });

export function buildReport(events: AppEvent[], derived: Derived, grade: GradeId, framework: FrameworkId, periodDays: number, now = Date.now()): Report {
  const end = startOfDay(now) + DAY;
  const start = end - periodDays * DAY;
  const prevStart = start - periodDays * DAY;

  const days: DayPoint[] = Array.from({ length: periodDays }, (_, i) => {
    const t = start + i * DAY;
    return { day: dayKey(t), label: shortDate(t), minutes: 0, answers: 0, correct: 0 };
  });
  const byDay = new Map(days.map((d) => [d.day, d]));
  const subjects = new Map<SubjectId, SubjectPoint>();
  const totals = { minutes: 0, answers: 0, correct: 0, sessions: 0, activeDays: 0, avgSeconds: 0, hints: 0 };
  const previous = { minutes: 0, answers: 0, correct: 0 };
  let ms = 0;

  for (const e of events) {
    if (e.t >= prevStart && e.t < start && e.type === "answer") {
      previous.answers++;
      if (e.correct) previous.correct++;
      previous.minutes += learnSecondsFor(e.ms) / 60;
    }
    if (e.t < start || e.t >= end) continue;
    if (e.type === "session") totals.sessions++;
    if (e.type !== "answer") continue;
    const mins = learnSecondsFor(e.ms) / 60;
    const d = byDay.get(dayKey(e.t));
    if (d) {
      d.minutes += mins;
      d.answers++;
      if (e.correct) d.correct++;
    }
    totals.minutes += mins;
    totals.answers++;
    ms += Math.min(e.ms, 60_000);
    if (e.correct) totals.correct++;
    if (e.hinted) totals.hints++;
    const subject = parseUnitKey(e.unit)?.subject;
    if (subject) {
      const s = subjects.get(subject) ?? { subject, answers: 0, correct: 0, minutes: 0 };
      s.answers++;
      if (e.correct) s.correct++;
      s.minutes += mins;
      subjects.set(subject, s);
    }
  }
  totals.activeDays = days.filter((d) => d.answers > 0).length;
  totals.avgSeconds = totals.answers ? ms / totals.answers / 1000 : 0;

  // Weekly accuracy for the last 12 weeks (Monday to Sunday).
  const weeks: WeekPoint[] = [];
  const monday = (() => {
    const d = new Date(startOfDay(now));
    const dow = (d.getDay() + 6) % 7;
    return d.getTime() - dow * DAY;
  })();
  for (let w = 11; w >= 0; w--) {
    const ws = monday - w * 7 * DAY;
    const we = ws + 7 * DAY;
    let answers = 0;
    let correct = 0;
    for (const e of events) {
      if (e.type === "answer" && e.t >= ws && e.t < we) {
        answers++;
        if (e.correct) correct++;
      }
    }
    weeks.push({ start: dayKey(ws), label: shortDate(ws), answers, accuracy: answers >= 5 ? correct / answers : null });
  }

  const units: UnitRow[] = allUnitRefs(grade, framework).map((ref) => {
    const s = derived.units[ref.key];
    return { ref, level: unitLevel(s), attempts: s?.attempts ?? 0, accuracy: s ? recentAccuracy(s) : 0, lastT: s?.lastT ?? 0 };
  });
  const started = units.filter((u) => u.attempts > 0);

  return {
    days,
    weeks,
    subjects: [...subjects.values()].sort((a, b) => b.answers - a.answers),
    totals,
    previous,
    units,
    strengths: started.filter((u) => u.attempts >= 8 && u.accuracy >= 0.75).sort((a, b) => b.accuracy - a.accuracy || b.attempts - a.attempts).slice(0, 4),
    needs: started.filter((u) => u.attempts >= 3 && u.level <= 1).sort((a, b) => a.accuracy - b.accuracy).slice(0, 4),
    notStarted: units.length - started.length,
    trophies: Object.entries(derived.trophies)
      .filter(([, t]) => t >= start)
      .map(([id, t]) => ({ id, t }))
      .sort((a, b) => b.t - a.t),
  };
}
