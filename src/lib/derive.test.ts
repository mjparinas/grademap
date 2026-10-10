import { describe, expect, it } from "vitest";
import { derive, learnSecondsFor, xpForLevel } from "./derive";
import { dayKey, type AppEvent, type Mode } from "./model";
import { TIER_COINS, TIER_POINTS, trophyTier } from "./trophies";

const DAY = 86_400_000;
const UNIT = "2/math/tens-and-ones";
const T0 = new Date(2026, 9, 1, 15, 0).getTime();
let n = 0;
const id = () => `e${String(n++).padStart(6, "0")}`;

const answer = (correct: boolean, t: number, extra: Partial<Extract<AppEvent, { type: "answer" }>> = {}): AppEvent => ({
  id: id(), profileId: "p1", t, type: "answer", unit: UNIT, correct, attempts: correct ? 1 : 2, revealed: false, ms: 5000, mode: "practice", ...extra,
});
const answers = (pattern: boolean[], t = T0) => pattern.map((correct, i) => answer(correct, t + i));
const session = (mode: Mode, total: number, correct: number, t = T0, scope = UNIT): AppEvent => ({
  id: id(), profileId: "p1", t, type: "session", mode, scope, total, correct, ms: 60_000,
});
const game = (score: number, t = T0): AppEvent => ({ id: id(), profileId: "p1", t, type: "game", game: "munchers", score, level: 1 });
const at = (hours: number, minutes: number) => new Date(2026, 9, 1, hours, minutes).getTime();

describe("derive: answers", () => {
  it("adds 2 XP per streak step, capped at +10", () => {
    expect(derive(answers(Array(7).fill(true))).xp).toBe(10 + 12 + 14 + 16 + 18 + 20 + 20);
  });

  it("gives 4 XP for a fix, 1 for a revealed answer, and counts comebacks and hints", () => {
    const d = derive([answer(false, T0), answer(false, T0 + 1, { revealed: true }), answer(false, T0 + 2, { hinted: true })]);
    expect(d.xp).toBe(4 + 1 + 4);
    expect(d.totals.comebacks).toBe(1);
    expect(d.totals.hints).toBe(1);
    expect(d.coins).toBe(0);
  });

  it("tracks runs per day and overall", () => {
    const d = derive([...answers([true, true, true]), ...answers([false, true], T0 + DAY)]);
    expect(d.totals.bestRun).toBe(3);
    expect(d.totals.currentRun).toBe(1);
    expect(d.days[dayKey(T0)].bestRun).toBe(3);
    expect(d.days[dayKey(T0 + DAY)].bestRun).toBe(1);
    expect(d.days[dayKey(T0)].correct).toBe(3);
  });

  it("keeps first-try counts, the last 20 results and total time per unit", () => {
    const u = derive(answers([false, false, ...Array(20).fill(true)])).units[UNIT];
    expect(u.attempts).toBe(22);
    expect(u.firstTry).toBe(20);
    expect(u.recent).toEqual(Array(20).fill(true));
    expect(u.ms).toBe(22 * 5000);
  });

  it("moves mastery fast at first and by at least 15% later", () => {
    expect(derive(answers([true, false])).units[UNIT].mastery).toBeCloseTo(0.5);
    expect(derive(answers([...Array(10).fill(true), false])).units[UNIT].mastery).toBeCloseTo(0.85);
  });

  it("caps learning time at 60 seconds per answer", () => {
    expect(learnSecondsFor(90_000)).toBe(60);
    expect(learnSecondsFor(59_000)).toBe(59);
    const d = derive([answer(true, T0, { ms: 90_000 }), answer(true, T0 + 1, { ms: 2000 })]);
    expect(d.totals.learnSeconds).toBe(62);
    expect(d.days[dayKey(T0)].learnSeconds).toBe(62);
  });

  it("counts answers by subject (from the unit key) and by mode", () => {
    const d = derive([
      answer(true, T0),
      answer(false, T0 + 1, { mode: "adventure" }),
      answer(true, T0 + 2, { unit: "2/language/rhymes" }),
      answer(true, T0 + 3, { unit: "not-a-unit-key" }),
    ]);
    expect(d.subjects).toEqual({ math: { answers: 2, correct: 1 }, language: { answers: 1, correct: 1 } });
    expect(d.days[dayKey(T0)].subjects).toEqual({ math: 2, language: 1 });
    expect(d.modeAnswers).toEqual({ practice: 3, adventure: 1 });
  });
});

describe("derive: growth", () => {
  it("marks Emerging only after 4 tries, and growth once Proficient", () => {
    expect(derive(answers([false, false, false])).units[UNIT].wasEmerging).toBe(false);
    const emerging = Array(4).fill(false);
    expect(derive(answers(emerging)).units[UNIT].wasEmerging).toBe(true);
    expect(derive(answers([...emerging, ...Array(11).fill(true)])).units[UNIT]).toMatchObject({ wasEmerging: true, grew: false });
    expect(derive(answers([...emerging, ...Array(12).fill(true)])).units[UNIT].grew).toBe(true);
  });

  it("counts a unit as kept after 5 answers at Proficient following 30+ days away", () => {
    const before = answers(Array(8).fill(true));
    const last = before[before.length - 1].t;
    const back = (gapDays: number, pattern: boolean[]) => derive([...before, ...answers(pattern, last + gapDays * DAY)]).units[UNIT];
    expect(back(30, Array(5).fill(true)).kept).toBe(true);
    expect(back(30, Array(4).fill(true)).kept).toBe(false);
    expect(back(29, Array(5).fill(true)).kept).toBe(false);
    expect(back(30, [false, false, false, ...Array(5).fill(true)]).kept).toBe(false);
  });

  it("doesn't count a unit as kept if it wasn't Proficient before the break", () => {
    const before = answers(Array(7).fill(true));
    const last = before[before.length - 1].t;
    expect(derive([...before, ...answers(Array(5).fill(true), last + 30 * DAY)]).units[UNIT].kept).toBe(false);
  });
});

describe("derive: sessions", () => {
  it("gives 15 XP and 5 coins, plus 25 XP and 10 coins for a perfect lesson of 5 or more", () => {
    const d = derive([session("practice", 5, 5)]);
    expect([d.xp, d.coins, d.totals.perfectSessions, d.days[dayKey(T0)].perfect]).toEqual([40, 15, 1, 1]);
    for (const [total, correct] of [[4, 4], [5, 4]]) {
      const plain = derive([session("practice", total, correct)]);
      expect([plain.xp, plain.coins, plain.totals.perfectSessions]).toEqual([15, 5, 0]);
    }
  });

  it("counts sessions by mode and day", () => {
    const d = derive([session("practice", 3, 1), session("review", 3, 1, T0 + 1), session("review", 3, 1, T0 + DAY)]);
    expect(d.totals.sessions).toBe(3);
    expect(d.modes).toEqual({ practice: 1, review: 2 });
    expect(d.days[dayKey(T0)]).toMatchObject({ sessions: 2, modes: { practice: 1, review: 1 } });
  });

  it("passes a Challenge at 8 out of 10 for +30 XP", () => {
    const run = (mode: Mode, total: number, correct: number) => derive([answer(true, T0 - 1), session(mode, total, correct)]);
    const passed = run("challenge", 10, 8);
    expect(passed.units[UNIT]).toMatchObject({ challengePassed: true, sessions: 1 });
    expect(passed.xp).toBe(10 + 15 + 30);
    for (const [mode, total, correct] of [["challenge", 10, 7], ["challenge", 0, 0], ["practice", 10, 10]] as const) {
      expect(run(mode, total, correct).units[UNIT].challengePassed).toBe(false);
    }
    expect(run("challenge", 10, 7).xp).toBe(10 + 15);
  });

  it("keeps the best Speed Run per scope", () => {
    const d = derive([session("speed", 20, 12), session("speed", 20, 9, T0 + 1), session("practice", 20, 15, T0 + 2), session("speed", 20, 4, T0 + 3, "math")]);
    expect(d.speedBest).toEqual({ [UNIT]: 12, math: 4 });
  });

  it("gives the Daily Challenge bonus once a day", () => {
    const d = derive([session("daily", 3, 1), session("daily", 3, 1, T0 + 1), session("daily", 3, 1, T0 + DAY)]);
    expect(d.dailyDone).toEqual([dayKey(T0), dayKey(T0 + DAY)]);
    expect(d.xp).toBe(3 * 15 + 2 * 40);
  });

  it("counts early sessions before 8 am and wish sessions at 11:11", () => {
    const d = derive([at(6, 30), at(7, 59), at(8, 0)].map((t) => session("practice", 3, 1, t)));
    expect(d.earlySessions).toBe(2);
    const wishes = derive([at(11, 11), at(23, 11), at(11, 12), at(10, 11), at(12, 11), at(9, 11)].map((t) => session("practice", 3, 1, t)));
    expect(wishes.wishSessions).toBe(2);
  });
});

describe("derive: games, trophies, shop and quests", () => {
  it("counts arcade time, games and best scores", () => {
    const d = derive([
      { id: id(), profileId: "p1", t: T0, type: "play", game: "munchers", seconds: 90 },
      game(40), game(25, T0 + 1),
    ]);
    expect(d.totals.playSeconds).toBe(90);
    expect(d.days[dayKey(T0)].playSeconds).toBe(90);
    expect(d.gamesPlayed).toEqual({ munchers: 2 });
    expect(d.gameBest).toEqual({ munchers: 40 });
    expect([d.xp, d.coins]).toEqual([10, 4]);
  });

  it("awards a trophy's points, XP and coins once", () => {
    const tier = trophyTier("first-answer")!;
    const trophy = (t: number, trophyId = "first-answer"): AppEvent => ({ id: id(), profileId: "p1", t, type: "trophy", trophy: trophyId });
    const d = derive([trophy(T0), trophy(T0 + 1), trophy(T0 + 2, "no-such-trophy")]);
    expect(d.trophies).toEqual({ "first-answer": T0, "no-such-trophy": T0 + 2 });
    expect([d.trophyPoints, d.xp, d.coins]).toEqual([TIER_POINTS[tier], TIER_POINTS[tier], TIER_COINS[tier]]);
  });

  it("spends coins once per item and remembers what was earned", () => {
    const buy = (item: string, cost: number): AppEvent => ({ id: id(), profileId: "p1", t: T0 + 10, type: "buy", item, cost });
    const d = derive([game(1), game(1, T0 + 1), buy("hat", 3), buy("hat", 3)]);
    expect(d.owned).toEqual(["hat"]);
    expect(d.coins).toBe(1);
    expect(d.coinsEarned).toBe(4);
  });

  it("claims a quest once per day: 25 XP daily, 60 XP weekly", () => {
    const quest = (quest: string, day: string): AppEvent => ({ id: id(), profileId: "p1", t: T0, type: "quest", quest, day, reward: 7 });
    const d = derive([quest("q1", "2026-10-01"), quest("q1", "2026-10-01"), quest("q1", "2026-10-02"), quest("w-q", "2026-09-28")]);
    expect(d.questsClaimed).toEqual({ "2026-10-01": ["q1"], "2026-10-02": ["q1"], "2026-09-28": ["w-q"] });
    expect([d.xp, d.coins]).toEqual([25 + 25 + 60, 21]);
  });

  it("keeps the last goal pick and each secret once", () => {
    const d = derive([
      { id: id(), profileId: "p1", t: T0, type: "goal", day: "2026-10-01", level: "easy", minutes: 10 },
      { id: id(), profileId: "p1", t: T0 + 1, type: "goal", day: "2026-10-01", level: "stretch", minutes: 20 },
      { id: id(), profileId: "p1", t: T0, type: "secret", code: "konami" },
      { id: id(), profileId: "p1", t: T0 + 1, type: "secret", code: "konami" },
    ]);
    expect(d.goalPicks).toEqual({ "2026-10-01": { level: "stretch", minutes: 20 } });
    expect(d.secrets).toEqual(["konami"]);
  });
});

describe("derive: order and levels", () => {
  it("orders events by time, then id, whatever order they arrive in", () => {
    const events = [
      { ...answer(true, T0 + 5), id: "c" },
      { ...answer(true, T0), id: "b" },
      { ...answer(false, T0), id: "a" },
    ];
    for (const order of [events, [...events].reverse()]) {
      const d = derive(order);
      expect([d.xp, d.totals.currentRun]).toEqual([4 + 10 + 12, 2]);
    }
  });

  it("levels up at 80, 120, 160 XP", () => {
    expect([1, 2, 3].map(xpForLevel)).toEqual([80, 120, 160]);
    const games = (count: number) => derive(Array.from({ length: count }, (_, i) => game(1, T0 + i)));
    expect(games(15)).toMatchObject({ level: 1, levelXp: 75, levelNeed: 80 });
    expect(games(16)).toMatchObject({ level: 2, levelXp: 0, levelNeed: 120 });
    expect(games(40)).toMatchObject({ level: 3, levelXp: 0, levelNeed: 160 });
  });
});

describe("derive: streaks and rest-day shields", () => {
  const practised = (dayIndexes: number[]) => dayIndexes.map((i) => session("practice", 3, 1, T0 + i * DAY));
  const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
  const now = (dayIndex: number) => T0 + dayIndex * DAY;

  it("counts a day with a session or 5 answers, not 4", () => {
    expect(derive(answers(Array(4).fill(true)), now(0)).streak).toMatchObject({ current: 0, activeToday: false });
    expect(derive(answers(Array(5).fill(true)), now(0)).streak).toMatchObject({ current: 1, activeToday: true });
    expect(derive(practised([0]), now(0)).streak).toMatchObject({ current: 1, activeToday: true, best: 1 });
  });

  it("earns a shield every 7 practice days, up to 2", () => {
    expect(derive(practised(range(0, 5)), now(5)).streak.shields).toBe(0);
    expect(derive(practised(range(0, 6)), now(6)).streak.shields).toBe(1);
    expect(derive(practised(range(0, 13)), now(13)).streak.shields).toBe(2);
    expect(derive(practised(range(0, 20)), now(20)).streak.shields).toBe(2);
  });

  it("spends a shield on a missed day instead of breaking the streak", () => {
    const d = derive(practised([...range(0, 6), 8]), now(8));
    expect(d.streak).toMatchObject({ current: 8, best: 8, shields: 0, shieldsUsed: 1, saved: false });
    expect(d.activeDays).toBe(8);
  });

  it("breaks the streak when the gap is bigger than the shields", () => {
    expect(derive(practised([...range(0, 6), 9]), now(9)).streak).toMatchObject({ current: 1, best: 7, shieldsUsed: 0 });
    expect(derive(practised([0, 2]), now(2)).streak).toMatchObject({ current: 1, best: 1 });
  });

  it("shows a streak kept alive by a shield as saved, until the shields run out", () => {
    const week = practised(range(0, 6));
    expect(derive(week, now(7)).streak).toMatchObject({ current: 7, saved: false, activeToday: false });
    expect(derive(week, now(8)).streak).toMatchObject({ current: 7, saved: true });
    expect(derive(week, now(9)).streak).toMatchObject({ current: 0, saved: false });
    expect(derive([], now(0)).streak).toMatchObject({ current: 0, best: 0, shields: 0, shieldsUsed: 0, saved: false });
  });
});
