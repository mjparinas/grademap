import { beforeAll, describe, expect, it } from "vitest";
import { loadGrade } from "@/content";
import { derive } from "./derive";
import { milestones } from "./milestones";
import { dayKey, type AppEvent } from "./model";
import { dailyQuests, weekDays, weeklyQuests, weekStart } from "./quests";
import { isUnlocked, SHOP } from "./shop";
import { newlyEarned, TROPHIES, trophyTier, visibleTrophies } from "./trophies";

beforeAll(() => loadGrade("2"));

const DAY = 86_400_000;
const UNIT = "2/math/tens-and-ones";
let n = 0;
const answer = (correct: boolean, t: number, unit = UNIT): AppEvent => ({
  id: `r${n++}`, profileId: "p1", t, type: "answer", unit, correct, attempts: correct ? 1 : 2, revealed: false, ms: 5000, mode: "practice",
});
/** Five answers on a day (enough to count as practised). */
const practise = (daysAgo: number, now: number, correct = true) =>
  Array.from({ length: 5 }, (_, i) => answer(correct, now - daysAgo * DAY + i * 1000));

// Noon today, so day arithmetic never straddles midnight.
const noon = () => {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  return d.getTime();
};

describe("per-grade mastery trophies", () => {
  it("have unique ids, and only the child's grade is earned or shown", () => {
    expect(new Set(TROPHIES.map((t) => t.id)).size).toBe(TROPHIES.length);
    expect(TROPHIES.some((t) => t.id === "grade-champion-2")).toBe(true);
    expect(TROPHIES.some((t) => t.id === "grade-champion-k")).toBe(true);
    const d = derive([]);
    const shown = visibleTrophies(d, "2").filter((t) => t.grade);
    expect(shown.every((t) => t.grade === "2")).toBe(true);
    expect(newlyEarned(d, { grade: "2", framework: "ca-bc" }).every((t) => !t.grade || t.grade === "2")).toBe(true);
  });
  it("still count points for trophies earned before they went per-grade", () => {
    expect(trophyTier("grade-champion")).toBe("platinum");
    const d = derive([{ id: "x", profileId: "p1", t: 1, type: "trophy", trophy: "grade-champion" }]);
    expect(d.trophyPoints).toBe(300);
  });
});

describe("rest-day shields", () => {
  it("cover one missed day once earned, and run out", () => {
    const now = noon();
    // 7 practice days in a row (ending 10 days ago) earn a shield; then a one-day gap; then 2 more days.
    const run = [16, 15, 14, 13, 12, 11, 10].flatMap((d) => practise(d, now));
    const withGap = [...run, ...practise(8, now), ...practise(7, now)];
    const d = derive(withGap, now - 6 * DAY);
    expect(d.streak.shieldsUsed).toBe(1);
    expect(d.streak.current).toBe(9);
    // Without the earned shield the same gap resets the streak.
    const noShield = derive([...[14, 13, 12].flatMap((x) => practise(x, now)), ...practise(10, now)], now - 9 * DAY);
    expect(noShield.streak.current).toBe(1);
  });
  it("keeps a streak alive while a shield could cover missed days, then lets it go", () => {
    const now = noon();
    const week = [8, 7, 6, 5, 4, 3, 2].flatMap((d) => practise(d, now));
    expect(derive(week, now).streak.current).toBe(7); // played up to two days ago, one shield banked
    expect(derive(week, now).streak.saved).toBe(true);
    expect(derive(week, now + 3 * DAY).streak.current).toBe(0);
  });
});

describe("growth trophies", () => {
  it("notices a unit growing from Emerging to Proficient", () => {
    const now = noon();
    const misses = Array.from({ length: 6 }, (_, i) => answer(false, now - 5 * DAY + i));
    const hits = Array.from({ length: 30 }, (_, i) => answer(true, now - 4 * DAY + i));
    expect(derive([...misses, ...hits]).units[UNIT].grew).toBe(true);
    expect(derive(hits).units[UNIT].grew).toBe(false);
  });
  it("notices staying Proficient after a month away", () => {
    const now = noon();
    const learn = Array.from({ length: 12 }, (_, i) => answer(true, now - 60 * DAY + i));
    const back = Array.from({ length: 5 }, (_, i) => answer(true, now - 10 * DAY + i));
    expect(derive(learn).units[UNIT].kept).toBe(false);
    expect(derive([...learn, ...back]).units[UNIT].kept).toBe(true);
  });
});

describe("quests", () => {
  it("daily quests are stable and little kids never get Speed Run or Review", () => {
    for (let i = 0; i < 60; i++) {
      const day = dayKey(Date.UTC(2026, 0, 1) + i * DAY);
      const a = dailyQuests("p1", day, "little");
      expect(a.map((q) => q.id)).toEqual(dailyQuests("p1", day, "little").map((q) => q.id));
      expect(a).toHaveLength(3);
      expect(a.some((q) => q.id === "speed" || q.id === "review")).toBe(false);
    }
  });
  it("weekly quests run Monday to Sunday and are the same all week", () => {
    const wed = new Date(2026, 9, 7, 15).getTime(); // Wed 7 Oct 2026
    expect(weekStart(wed)).toBe("2026-10-05");
    expect(weekDays("2026-10-05")).toHaveLength(7);
    const a = weeklyQuests("p1", weekStart(wed), "middle").map((q) => q.id);
    expect(a).toHaveLength(2);
    expect(a.every((id) => id.startsWith("w-"))).toBe(true);
    expect(weeklyQuests("p1", weekStart(wed + 3 * DAY), "middle").map((q) => q.id)).toEqual(a);
  });
  it("pays more XP for a weekly quest", () => {
    const base = derive([]).xp;
    const d = derive([{ id: "q", profileId: "p1", t: 1, type: "quest", quest: "w-days", day: "2026-10-05", reward: 60 }]);
    expect(d.xp - base).toBe(60);
    expect(d.coins).toBe(60);
  });
});

describe("shop unlocks", () => {
  it("has unique ids and gates items by level or trophy", () => {
    expect(new Set(SHOP.map((i) => i.id)).size).toBe(SHOP.length);
    const rain = SHOP.find((i) => i.id === "rain")!;
    expect(isUnlocked(rain, 7, {})).toBe(false);
    expect(isUnlocked(rain, 8, {})).toBe(true);
    const pancakes = SHOP.find((i) => i.id === "pancakes")!;
    expect(isUnlocked(pancakes, 99, {})).toBe(false);
    expect(isUnlocked(pancakes, 1, { "streak-7": 1 })).toBe(true);
    for (const item of SHOP) if (item.unlock?.trophy) expect(TROPHIES.some((t) => t.id === item.unlock!.trophy)).toBe(true);
  });
});

describe("secrets and milestones", () => {
  it("record easter eggs once", () => {
    const e = (id: string): AppEvent => ({ id, profileId: "p1", t: 1, type: "secret", code: "konami" });
    expect(derive([e("a"), e("b")]).secrets).toEqual(["konami"]);
  });
  it("describe a year of learning", () => {
    const now = noon();
    const events = [400, 300, 200, 100, 3].flatMap((d) => practise(d, now));
    const d = derive(events, now);
    const titles = milestones("Sam", d, undefined, now).map((m) => m.title);
    expect(titles.some((t) => t.includes("year of learning"))).toBe(true);
  });
});
