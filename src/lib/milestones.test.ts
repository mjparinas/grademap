import { describe, expect, it } from "vitest";
import { derive, type Derived, type UnitStat } from "./derive";
import { milestones } from "./milestones";
import { dayKey } from "./model";

const DAY = 86_400_000;
const NOW = new Date(2026, 9, 10, 12).getTime();

const unit = (key: string, extra: Partial<UnitStat> = {}): UnitStat => ({
  key, attempts: 10, firstTry: 10, recent: Array(10).fill(true), mastery: 1, lastT: NOW, sessions: 1,
  challengePassed: false, ms: 0, wasEmerging: false, grew: false, returnLeft: 0, kept: false, ...extra,
});

/** A child's stats with only the fields a test cares about set. */
function stats(over: { startedDaysAgo?: number; activeDays?: number; correct?: number; answers?: number; units?: UnitStat[]; bestStreak?: number } = {}): Derived {
  const d = derive([], NOW);
  if (over.startedDaysAgo !== undefined) {
    const key = dayKey(NOW - over.startedDaysAgo * DAY);
    d.days = { [dayKey(NOW)]: { ...emptyDay(dayKey(NOW)) }, [key]: emptyDay(key) };
  }
  d.activeDays = over.activeDays ?? 0;
  d.totals.correct = over.correct ?? 0;
  d.totals.answers = over.answers ?? over.correct ?? 0;
  d.units = Object.fromEntries((over.units ?? []).map((u) => [u.key, u]));
  d.streak.best = over.bestStreak ?? 0;
  return d;
}

const emptyDay = (day: string) => ({ day, learnSeconds: 0, answers: 0, correct: 0, sessions: 0, perfect: 0, playSeconds: 0, bestRun: 0, subjects: {}, modes: {} });

const titles = (d: Derived, past?: Derived) => milestones("Sam", d, past, NOW).map((m) => m.title);
const byId = (d: Derived, id: string, past?: Derived) => milestones("Sam", d, past, NOW).find((m) => m.id === id);

describe("milestones", () => {
  it("has nothing to say before any practice", () => {
    expect(milestones("Sam", derive([], NOW), undefined, NOW)).toEqual([]);
  });

  it("counts months of learning from the first day, in 30.4-day months", () => {
    expect(byId(stats({ startedDaysAgo: 30 }), "anniversary")).toBeUndefined();
    expect(byId(stats({ startedDaysAgo: 31, activeDays: 3 }), "anniversary")).toEqual({
      id: "anniversary", icon: "🌱", title: "1 month of learning", detail: "Sam has practised on 3 days so far.",
    });
    expect(byId(stats({ startedDaysAgo: 61 }), "anniversary")?.title).toBe("2 months of learning");
    expect(byId(stats({ startedDaysAgo: 364 }), "anniversary")?.title).toBe("11 months of learning");
  });

  it("switches to years after 12 months", () => {
    expect(byId(stats({ startedDaysAgo: 365, activeDays: 1200 }), "anniversary")).toEqual({
      id: "anniversary", icon: "🎂", title: "1 year of learning", detail: "Sam started practising 12 months ago and has practised on 1,200 days since.",
    });
    expect(byId(stats({ startedDaysAgo: 730 }), "anniversary")?.title).toBe("2 years of learning");
    expect(byId(stats({ startedDaysAgo: 729 }), "anniversary")?.title).toBe("1 year of learning");
  });

  it("marks days practised at 30, 100, 180, 365 and 730", () => {
    expect(byId(stats({ activeDays: 29 }), "days")).toBeUndefined();
    expect(byId(stats({ activeDays: 30 }), "days")).toEqual({
      id: "days", icon: "📅", title: "30 days practised", detail: "Learning doesn't need to be every day. Sam has shown up on 30 different days.",
    });
    expect([99, 100, 179, 180, 364, 365, 729, 730, 5000].map((n) => byId(stats({ activeDays: n }), "days")?.title)).toEqual([
      "30 days practised", "100 days practised", "100 days practised", "180 days practised", "180 days practised",
      "365 days practised", "365 days practised", "730 days practised", "730 days practised",
    ]);
  });

  it("leaves out the 30-day card when a months card already says it, but not from 100 days", () => {
    expect(byId(stats({ startedDaysAgo: 60, activeDays: 30 }), "days")).toBeUndefined();
    expect(byId(stats({ startedDaysAgo: 200, activeDays: 100 }), "days")?.title).toBe("100 days practised");
  });

  it("marks first-try answers at 100, 500, 1,000, 5,000, 10,000 and 25,000", () => {
    expect(byId(stats({ correct: 99 }), "right")).toBeUndefined();
    expect(byId(stats({ correct: 1234, answers: 2000 }), "right")).toEqual({
      id: "right", icon: "✅", title: "1,000 questions right on the first try", detail: "1,234 in total, out of 2,000 answered.",
    });
    expect([100, 499, 500, 4999, 5000, 9999, 10000, 24999, 25000, 90000].map((n) => byId(stats({ correct: n }), "right")?.title.split(" ")[0])).toEqual([
      "100", "100", "500", "1,000", "5,000", "5,000", "10,000", "10,000", "25,000", "25,000",
    ]);
  });

  it("counts units that grew or were kept, with the right plural", () => {
    expect(byId(stats({ units: [unit("a")] }), "grew")).toBeUndefined();
    expect(byId(stats({ units: [unit("a")] }), "kept")).toBeUndefined();
    expect(byId(stats({ units: [unit("a", { grew: true }), unit("b")] }), "grew")).toEqual({
      id: "grew", icon: "🌿", title: "1 unit grown from Emerging to Proficient", detail: "Practice paid off: Sam stuck with topics that started out tricky.",
    });
    expect(byId(stats({ units: [unit("a", { grew: true }), unit("b", { grew: true })] }), "grew")?.title).toBe("2 units grown from Emerging to Proficient");
    expect(byId(stats({ units: [unit("a", { kept: true }), unit("b")] }), "kept")).toEqual({
      id: "kept", icon: "🧠", title: "Remembered 1 unit after a month away", detail: "Sam came back to old topics and was still Proficient.",
    });
    expect(byId(stats({ units: [unit("a", { kept: true }), unit("b", { kept: true })] }), "kept")?.title).toBe("Remembered 2 units after a month away");
  });

  it("compares Proficient units with six months ago, only when there was practice then and more now", () => {
    const weak = unit("w", { recent: Array(10).fill(false), firstTry: 0 });
    const now = stats({ units: [unit("a"), unit("b"), weak] });
    const pastOne = stats({ correct: 5, units: [unit("a"), weak] });
    expect(byId(now, "since", pastOne)).toEqual({
      id: "since", icon: "📈", title: "1 more Proficient unit than six months ago", detail: "Proficient in 2 units now, compared with 1 then.",
    });
    expect(byId(stats({ units: [unit("a"), unit("b"), unit("c")] }), "since", stats({ correct: 5, units: [unit("a")] }))?.title).toBe(
      "2 more Proficient units than six months ago",
    );
    expect(byId(now, "since", undefined)).toBeUndefined();
    expect(byId(now, "since", stats({ correct: 0, units: [] }))).toBeUndefined();
    expect(byId(now, "since", stats({ correct: 5, units: [unit("a"), unit("b")] }))).toBeUndefined();
    expect(byId(stats({ units: [weak] }), "since", stats({ correct: 5 }))).toBeUndefined();
  });

  it("mentions a best streak from 14 days", () => {
    expect(byId(stats({ bestStreak: 13 }), "streak")).toBeUndefined();
    expect(byId(stats({ bestStreak: 14 }), "streak")).toEqual({
      id: "streak", icon: "🔥", title: "Best streak: 14 days", detail: "A streak is a bonus, not a rule. Rest-day shields cover a missed day.",
    });
  });

  it("lists cards in a fixed order", () => {
    const d = stats({ startedDaysAgo: 400, activeDays: 120, correct: 600, units: [unit("a", { grew: true, kept: true }), unit("b")], bestStreak: 20 });
    const ids = milestones("Sam", d, stats({ correct: 5 }), NOW).map((m) => m.id);
    expect(ids).toEqual(["anniversary", "days", "right", "grew", "kept", "since", "streak"]);
    expect(titles(d)).toHaveLength(6);
  });
});
