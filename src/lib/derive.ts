import { parseUnitKey } from "@/content";
import type { SubjectId } from "@/content/types";
import { dayKey, type AppEvent, type Mode } from "./model";
import { unitLevel } from "./proficiency";
import { TIER_COINS, TIER_POINTS, trophyTier } from "./trophies";

// Everything a child has achieved is computed from their event log. Because
// events are append-only and have unique ids, logs from several devices can
// be merged in any order and every device computes the same result.

export interface UnitStat {
  key: string;
  attempts: number;
  firstTry: number;
  /** First-try results, most recent last (up to 20). */
  recent: boolean[];
  /** Smoothed first-try accuracy, 0–1. */
  mastery: number;
  lastT: number;
  sessions: number;
  challengePassed: boolean;
  ms: number;
  /** Once dipped to Emerging after a fair number of tries. */
  wasEmerging: boolean;
  /** Climbed from Emerging to Proficient or better. */
  grew: boolean;
  /** Answers still to give after coming back from 30+ days away (while Proficient). */
  returnLeft: number;
  /** Came back after 30+ days and was still Proficient. */
  kept: boolean;
}

export interface DayStat {
  day: string;
  learnSeconds: number;
  answers: number;
  correct: number;
  sessions: number;
  /** Flawless lessons that day. */
  perfect: number;
  playSeconds: number;
  bestRun: number;
  /** Per-subject answers that day. */
  subjects: Partial<Record<SubjectId, number>>;
  modes: Partial<Record<Mode, number>>;
}

export interface Derived {
  xp: number;
  level: number;
  levelXp: number;
  levelNeed: number;
  coins: number;
  trophyPoints: number;
  trophies: Record<string, number>;
  units: Record<string, UnitStat>;
  days: Record<string, DayStat>;
  streak: {
    current: number;
    best: number;
    activeToday: boolean;
    /** Rest-day shields banked (earned by learning, up to 2). */
    shields: number;
    /** Shields spent so far. */
    shieldsUsed: number;
    /** Today's streak is only alive because a shield will cover missed days. */
    saved: boolean;
  };
  /** Days with real practice. */
  activeDays: number;
  /** Sessions finished at 11:11. */
  wishSessions: number;
  /** Easter eggs found, by code. */
  secrets: string[];
  totals: {
    answers: number;
    correct: number;
    sessions: number;
    perfectSessions: number;
    learnSeconds: number;
    playSeconds: number;
    bestRun: number;
    currentRun: number;
    comebacks: number;
    /** Answers where the child opened the hint first. */
    hints: number;
  };
  subjects: Partial<Record<SubjectId, { answers: number; correct: number }>>;
  modes: Partial<Record<Mode, number>>;
  /** Answers given in each mode. */
  modeAnswers: Partial<Record<Mode, number>>;
  /** All coins ever earned (before spending). */
  coinsEarned: number;
  /** Days of the week with a finished session, for hidden trophies. */
  earlySessions: number;
  /** Best timed-mode score per scope. */
  speedBest: Record<string, number>;
  gameBest: Record<string, number>;
  gamesPlayed: Record<string, number>;
  owned: string[];
  questsClaimed: Record<string, string[]>;
  dailyDone: string[];
}

/** XP needed to go from `level` to `level + 1`. */
export function xpForLevel(level: number): number {
  return 80 + 40 * (level - 1);
}

/** Learning time counted for one answer, so a child who walks away doesn't rack up minutes. */
export function learnSecondsFor(ms: number): number {
  return Math.min(ms, 60_000) / 1000;
}

function emptyDay(day: string): DayStat {
  return { day, learnSeconds: 0, answers: 0, correct: 0, sessions: 0, perfect: 0, playSeconds: 0, bestRun: 0, subjects: {}, modes: {} };
}

export function derive(events: AppEvent[], now = Date.now()): Derived {
  const sorted = [...events].sort((a, b) => a.t - b.t || (a.id < b.id ? -1 : 1));
  const d: Derived = {
    xp: 0,
    level: 1,
    levelXp: 0,
    levelNeed: xpForLevel(1),
    coins: 0,
    trophyPoints: 0,
    trophies: {},
    units: {},
    days: {},
    streak: { current: 0, best: 0, activeToday: false, shields: 0, shieldsUsed: 0, saved: false },
    activeDays: 0,
    wishSessions: 0,
    totals: {
      answers: 0,
      correct: 0,
      sessions: 0,
      perfectSessions: 0,
      learnSeconds: 0,
      playSeconds: 0,
      bestRun: 0,
      currentRun: 0,
      comebacks: 0,
      hints: 0,
    },
    subjects: {},
    modes: {},
    modeAnswers: {},
    coinsEarned: 0,
    earlySessions: 0,
    speedBest: {},
    gameBest: {},
    gamesPlayed: {},
    owned: [],
    questsClaimed: {},
    dailyDone: [],
    secrets: [],
  };
  const seen = new Set<string>();
  let run = 0;
  let spent = 0;

  for (const e of sorted) {
    if (seen.has(e.id)) continue;
    seen.add(e.id);
    const day = (d.days[dayKey(e.t)] ??= emptyDay(dayKey(e.t)));

    switch (e.type) {
      case "answer": {
        const u = (d.units[e.unit] ??= {
          key: e.unit,
          attempts: 0,
          firstTry: 0,
          recent: [],
          mastery: 0,
          lastT: 0,
          sessions: 0,
          challengePassed: false,
          ms: 0,
          wasEmerging: false,
          grew: false,
          returnLeft: 0,
          kept: false,
        });
        const levelBefore = unitLevel(u);
        const away = u.lastT > 0 && e.t - u.lastT >= 30 * 86_400_000;
        u.attempts++;
        if (e.hinted) d.totals.hints++;
        if (e.correct) u.firstTry++;
        u.recent.push(e.correct);
        if (u.recent.length > 20) u.recent.shift();
        // Early answers move mastery quickly; later ones refine it.
        const alpha = Math.max(0.15, 1 / u.attempts);
        u.mastery = u.mastery + alpha * ((e.correct ? 1 : 0) - u.mastery);
        u.lastT = e.t;
        u.ms += e.ms;
        // Growth: climbing out of Emerging, and still knowing a unit after a month away.
        const levelNow = unitLevel(u);
        if (u.attempts >= 4 && levelNow === 0) u.wasEmerging = true;
        if (u.wasEmerging && levelNow >= 2) u.grew = true;
        if (away && levelBefore >= 2) u.returnLeft = 5;
        if (u.returnLeft > 0) {
          if (levelNow < 2) u.returnLeft = 0;
          else if (--u.returnLeft === 0) u.kept = true;
        }

        const secs = learnSecondsFor(e.ms);
        day.learnSeconds += secs;
        day.answers++;
        d.totals.learnSeconds += secs;
        d.totals.answers++;
        d.modeAnswers[e.mode] = (d.modeAnswers[e.mode] ?? 0) + 1;
        // From the key, not the content, so scoring never depends on which grades are downloaded.
        const subject = parseUnitKey(e.unit)?.subject;
        if (subject) {
          day.subjects[subject] = (day.subjects[subject] ?? 0) + 1;
          const s = (d.subjects[subject] ??= { answers: 0, correct: 0 });
          s.answers++;
          if (e.correct) s.correct++;
        }

        if (e.correct) {
          run++;
          day.correct++;
          d.totals.correct++;
          d.xp += 10 + 2 * Math.min(run - 1, 5);
          d.coins += 1;
        } else {
          run = 0;
          if (!e.revealed) {
            d.xp += 4;
            // Asking for a hint first isn't a comeback from a miss.
            if (!e.hinted) d.totals.comebacks++;
          } else d.xp += 1;
        }
        d.totals.bestRun = Math.max(d.totals.bestRun, run);
        day.bestRun = Math.max(day.bestRun, run);
        break;
      }
      case "session": {
        d.totals.sessions++;
        day.sessions++;
        d.modes[e.mode] = (d.modes[e.mode] ?? 0) + 1;
        day.modes[e.mode] = (day.modes[e.mode] ?? 0) + 1;
        if (new Date(e.t).getHours() < 8) d.earlySessions++;
        {
          const at = new Date(e.t);
          if (at.getHours() % 12 === 11 && at.getMinutes() === 11) d.wishSessions++;
        }
        const ratio = e.total ? e.correct / e.total : 0;
        d.xp += 15;
        d.coins += 5;
        if (e.total >= 5 && e.correct === e.total) {
          d.totals.perfectSessions++;
          day.perfect++;
          d.xp += 25;
          d.coins += 10;
        }
        const u = d.units[e.scope];
        if (u) {
          u.sessions++;
          if (e.mode === "challenge" && ratio >= 0.8) u.challengePassed = true;
        }
        if (e.mode === "speed") d.speedBest[e.scope] = Math.max(d.speedBest[e.scope] ?? 0, e.correct);
        if (e.mode === "daily" && !d.dailyDone.includes(day.day)) {
          d.dailyDone.push(day.day);
          d.xp += 40;
        }
        if (e.mode === "challenge" && ratio >= 0.8) d.xp += 30;
        break;
      }
      case "play":
        day.playSeconds += e.seconds;
        d.totals.playSeconds += e.seconds;
        break;
      case "game":
        d.gamesPlayed[e.game] = (d.gamesPlayed[e.game] ?? 0) + 1;
        d.gameBest[e.game] = Math.max(d.gameBest[e.game] ?? 0, e.score);
        d.xp += 5;
        d.coins += 2;
        break;
      case "trophy": {
        if (d.trophies[e.trophy]) break;
        d.trophies[e.trophy] = e.t;
        const tier = trophyTier(e.trophy);
        if (tier) {
          d.trophyPoints += TIER_POINTS[tier];
          d.xp += TIER_POINTS[tier];
          d.coins += TIER_COINS[tier];
        }
        break;
      }
      case "secret":
        if (!d.secrets.includes(e.code)) d.secrets.push(e.code);
        break;
      case "buy":
        if (!d.owned.includes(e.item)) {
          d.owned.push(e.item);
          d.coins -= e.cost;
          spent += e.cost;
        }
        break;
      case "quest": {
        const claimed = (d.questsClaimed[e.day] ??= []);
        if (!claimed.includes(e.quest)) {
          claimed.push(e.quest);
          d.coins += e.reward;
          d.xp += e.quest.startsWith("w-") ? 60 : 25;
        }
        break;
      }
    }
  }
  d.totals.currentRun = run;
  d.coinsEarned = d.coins + spent;

  // Level from total XP.
  let xp = d.xp;
  let level = 1;
  while (xp >= xpForLevel(level)) {
    xp -= xpForLevel(level);
    level++;
  }
  d.level = level;
  d.levelXp = xp;
  d.levelNeed = xpForLevel(level);

  // Streak: days with real practice (a finished session or 5+ answers).
  // Every 7 practice days earns a rest-day shield (up to 2) that covers a missed day.
  const active = (s: DayStat | undefined) => !!s && (s.sessions > 0 || s.answers >= 5);
  const dayNum = (k: string) => Math.round(new Date(`${k}T12:00:00`).getTime() / 86_400_000);
  const days = Object.keys(d.days).sort();
  let best = 0;
  let cur = 0;
  let bank = 0;
  let used = 0;
  let count = 0;
  let prev: string | null = null;
  for (const k of days) {
    if (!active(d.days[k])) continue;
    const missed = prev ? dayNum(k) - dayNum(prev) - 1 : 0;
    if (!prev) cur = 1;
    else if (missed <= 0) cur++;
    else if (missed <= bank) {
      bank -= missed;
      used += missed;
      cur++;
    } else cur = 1;
    count++;
    if (count % 7 === 0) bank = Math.min(2, bank + 1);
    best = Math.max(best, cur);
    prev = k;
  }
  const today = dayKey(now);
  const away = prev ? Math.max(0, dayNum(today) - dayNum(prev) - 1) : 0;
  const alive = !!prev && away <= bank;
  d.activeDays = count;
  d.streak = {
    current: alive ? cur : 0,
    best,
    activeToday: active(d.days[today]),
    shields: bank,
    shieldsUsed: used,
    saved: alive && away > 0,
  };
  return d;
}
