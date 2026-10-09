import { isCoreSubject } from "@/content/subjects";
import { allUnitRefs } from "@/content";
import type { GradeId, SubjectId } from "@/content/types";
import type { Derived } from "./derive";
import type { Mode } from "./model";
import { unitLevel } from "./proficiency";

// Console-style trophies: bronze, silver, gold and one platinum per grade.
// Each trophy checks the derived stats; `progress` powers the progress bars
// in the trophy room.

export type Tier = "bronze" | "silver" | "gold" | "platinum";

export const TIER_POINTS: Record<Tier, number> = { bronze: 15, silver: 30, gold: 90, platinum: 300 };
export const TIER_COINS: Record<Tier, number> = { bronze: 10, silver: 25, gold: 60, platinum: 250 };

export const TIER_STYLE: Record<Tier, { label: string; colour: string; dark: string; glow: string; /** Readable text colour on a light tint of `colour`. */ text: string }> = {
  bronze: { label: "Bronze", colour: "#d08a4c", dark: "#9a5a26", glow: "#f6cfa6", text: "#7a4416" },
  silver: { label: "Silver", colour: "#a7b4c6", dark: "#6f7d90", glow: "#e8eef6", text: "#4a5668" },
  gold: { label: "Gold", colour: "#f0bd2a", dark: "#b88905", glow: "#ffe9a3", text: "#6b4f00" },
  platinum: { label: "Platinum", colour: "#8fd3f0", dark: "#3d93b8", glow: "#e0f6ff", text: "#1f6a8a" },
};

export type TrophyCategory = "Getting started" | "Practice" | "Streaks" | "Mastery" | "Modes" | "Arcade" | "Collector" | "French" | "Secret";

export interface TrophyContext {
  grade: GradeId;
}

export interface Trophy {
  id: string;
  name: string;
  description: string;
  tier: Tier;
  icon: string;
  category: TrophyCategory;
  /** Hidden trophies show "???" until unlocked. */
  hidden?: boolean;
  progress: (d: Derived, ctx: TrophyContext) => { value: number; target: number };
}

const count = (target: number, value: (d: Derived, ctx: TrophyContext) => number) =>
  (d: Derived, ctx: TrophyContext) => ({ value: Math.min(target, value(d, ctx)), target });

function unitsAtLevel(d: Derived, grade: GradeId, min: number, subject?: SubjectId): number {
  return allUnitRefs(grade).filter((r) => (subject ? r.course.subject === subject : isCoreSubject(r.course.subject)) && unitLevel(d.units[r.key]) >= min)
    .length;
}

function unitsInGrade(grade: GradeId, subject?: SubjectId): number {
  return allUnitRefs(grade).filter((r) => (subject ? r.course.subject === subject : isCoreSubject(r.course.subject))).length;
}

const ALL_MODES: Mode[] = ["practice", "adventure", "review", "speed", "daily", "challenge"];
export const ARCADE_GAMES = ["munchers", "ninja", "catch", "bubbles", "memory"];

const subjectMastery = (subject: SubjectId, name: string, icon: string, description: string, category: TrophyCategory = "Mastery"): Trophy => ({
  id: `master-${subject}`,
  name,
  description,
  tier: "gold",
  icon,
  category,
  progress: (d, ctx) => ({ value: unitsAtLevel(d, ctx.grade, 2, subject), target: Math.max(1, unitsInGrade(ctx.grade, subject)) }),
});

// French (opt-in subjects). Kept in their own list so they are easy to maintain separately.
const frenchAnswers = (d: Derived) => (d.subjects.immersion?.answers ?? 0) + (d.subjects["core-french"]?.answers ?? 0);
const frenchCorrect = (d: Derived) => (d.subjects.immersion?.correct ?? 0) + (d.subjects["core-french"]?.correct ?? 0);
const frenchUnits = (d: Derived, grade: GradeId, min: number) =>
  unitsAtLevel(d, grade, min, "immersion") + unitsAtLevel(d, grade, min, "core-french");

const FRENCH_TROPHIES: Trophy[] = [
  { id: "french-first", name: "Bonjour!", description: "Answer your first French question.", tier: "bronze", icon: "👋", category: "French", progress: count(1, frenchAnswers) },
  { id: "french-100", name: "Petit à petit", description: "Answer 100 French questions.", tier: "silver", icon: "🥐", category: "French", progress: count(100, frenchAnswers) },
  { id: "french-500", name: "Très bien!", description: "Get 500 French questions right.", tier: "gold", icon: "🥖", category: "French", progress: count(500, frenchCorrect) },
  { id: "french-proficient-1", name: "French Sprout", description: "Reach Proficient in any French unit.", tier: "bronze", icon: "🌿", category: "French", progress: count(1, (d, ctx) => frenchUnits(d, ctx.grade, 2)) },
  { id: "french-proficient-5", name: "Parlez-vous?", description: "Reach Proficient in 5 French units.", tier: "silver", icon: "💬", category: "French", progress: count(5, (d, ctx) => frenchUnits(d, ctx.grade, 2)) },
  { id: "french-extending-1", name: "Étoile du français", description: "Reach Extending in any French unit.", tier: "silver", icon: "⭐", category: "French", progress: count(1, (d, ctx) => frenchUnits(d, ctx.grade, 3)) },
  subjectMastery("immersion", "Maître du français", "🎓", "Reach Proficient in every French Immersion unit in your grade.", "French"),
  subjectMastery("core-french", "Core French Champion", "🍁", "Reach Proficient in every Core French unit in your grade.", "French"),
];

export const TROPHIES: Trophy[] = [
  // Getting started
  { id: "first-answer", name: "First Steps", description: "Answer your first question.", tier: "bronze", icon: "👣", category: "Getting started", progress: count(1, (d) => d.totals.answers) },
  { id: "first-lesson", name: "Lesson Learned", description: "Finish your first lesson.", tier: "bronze", icon: "📗", category: "Getting started", progress: count(1, (d) => d.totals.sessions) },
  { id: "explorer", name: "Explorer", description: "Answer questions in all four subjects.", tier: "bronze", icon: "🧭", category: "Getting started", progress: count(4, (d) => Object.keys(d.subjects).length) },
  { id: "all-modes", name: "Mode Master", description: "Finish a session in every mode.", tier: "silver", icon: "🎛️", category: "Modes", progress: count(ALL_MODES.length, (d) => ALL_MODES.filter((m) => d.modes[m]).length) },

  // Practice volume
  { id: "correct-50", name: "Warming Up", description: "Get 50 answers right.", tier: "bronze", icon: "🔥", category: "Practice", progress: count(50, (d) => d.totals.correct) },
  { id: "correct-250", name: "On a Roll", description: "Get 250 answers right.", tier: "silver", icon: "🎳", category: "Practice", progress: count(250, (d) => d.totals.correct) },
  { id: "correct-1000", name: "Knowledge Machine", description: "Get 1,000 answers right.", tier: "gold", icon: "🤖", category: "Practice", progress: count(1000, (d) => d.totals.correct) },
  { id: "correct-5000", name: "Unstoppable", description: "Get 5,000 answers right.", tier: "gold", icon: "🚀", category: "Practice", progress: count(5000, (d) => d.totals.correct) },
  { id: "run-5", name: "High Five", description: "Get 5 right in a row.", tier: "bronze", icon: "🖐️", category: "Practice", progress: count(5, (d) => d.totals.bestRun) },
  { id: "run-10", name: "Perfect Ten", description: "Get 10 right in a row.", tier: "silver", icon: "🔟", category: "Practice", progress: count(10, (d) => d.totals.bestRun) },
  { id: "run-25", name: "On Fire", description: "Get 25 right in a row.", tier: "gold", icon: "☄️", category: "Practice", progress: count(25, (d) => d.totals.bestRun) },
  { id: "perfect-1", name: "Flawless", description: "Finish a lesson with every answer right the first time.", tier: "bronze", icon: "💎", category: "Practice", progress: count(1, (d) => d.totals.perfectSessions) },
  { id: "perfect-10", name: "Perfectionist", description: "Finish 10 flawless lessons.", tier: "silver", icon: "💠", category: "Practice", progress: count(10, (d) => d.totals.perfectSessions) },
  { id: "perfect-50", name: "Precision", description: "Finish 50 flawless lessons.", tier: "gold", icon: "🎯", category: "Practice", progress: count(50, (d) => d.totals.perfectSessions) },
  { id: "comeback-10", name: "Never Give Up", description: "Fix 10 answers after a first miss.", tier: "bronze", icon: "💪", category: "Practice", progress: count(10, (d) => d.totals.comebacks) },
  { id: "comeback-100", name: "Bounce Back", description: "Fix 100 answers after a first miss.", tier: "silver", icon: "🏀", category: "Practice", progress: count(100, (d) => d.totals.comebacks) },
  { id: "minutes-60", name: "Hour of Power", description: "Learn for 60 minutes in total.", tier: "bronze", icon: "⏱️", category: "Practice", progress: count(60, (d) => Math.floor(d.totals.learnSeconds / 60)) },
  { id: "minutes-600", name: "Ten-Hour Club", description: "Learn for 10 hours in total.", tier: "silver", icon: "⌛", category: "Practice", progress: count(600, (d) => Math.floor(d.totals.learnSeconds / 60)) },
  { id: "minutes-3000", name: "Scholar", description: "Learn for 50 hours in total.", tier: "gold", icon: "🎓", category: "Practice", progress: count(3000, (d) => Math.floor(d.totals.learnSeconds / 60)) },

  // Streaks
  { id: "streak-3", name: "Three-Peat", description: "Learn 3 days in a row.", tier: "bronze", icon: "📅", category: "Streaks", progress: count(3, (d) => d.streak.best) },
  { id: "streak-7", name: "Week Warrior", description: "Learn 7 days in a row.", tier: "silver", icon: "🗓️", category: "Streaks", progress: count(7, (d) => d.streak.best) },
  { id: "streak-30", name: "Monthly Master", description: "Learn 30 days in a row.", tier: "gold", icon: "🏅", category: "Streaks", progress: count(30, (d) => d.streak.best) },
  { id: "daily-1", name: "Daily Dose", description: "Finish a Daily Challenge.", tier: "bronze", icon: "☀️", category: "Streaks", progress: count(1, (d) => d.dailyDone.length) },
  { id: "daily-7", name: "Regular", description: "Finish 7 Daily Challenges.", tier: "silver", icon: "🌤️", category: "Streaks", progress: count(7, (d) => d.dailyDone.length) },
  { id: "daily-30", name: "Dedicated", description: "Finish 30 Daily Challenges.", tier: "gold", icon: "🌞", category: "Streaks", progress: count(30, (d) => d.dailyDone.length) },

  // Mastery (proficiency)
  { id: "proficient-1", name: "Growing Tree", description: "Reach Proficient in any unit.", tier: "bronze", icon: "🌳", category: "Mastery", progress: (d, ctx) => ({ value: Math.min(1, unitsAtLevel(d, ctx.grade, 2)), target: 1 }) },
  { id: "proficient-10", name: "Forest", description: "Reach Proficient in 10 units.", tier: "silver", icon: "🌲", category: "Mastery", progress: (d, ctx) => ({ value: Math.min(10, unitsAtLevel(d, ctx.grade, 2)), target: 10 }) },
  { id: "extending-1", name: "Shooting Star", description: "Reach Extending in any unit.", tier: "silver", icon: "🌠", category: "Mastery", progress: (d, ctx) => ({ value: Math.min(1, unitsAtLevel(d, ctx.grade, 3)), target: 1 }) },
  { id: "extending-5", name: "Constellation", description: "Reach Extending in 5 units.", tier: "gold", icon: "✨", category: "Mastery", progress: (d, ctx) => ({ value: Math.min(5, unitsAtLevel(d, ctx.grade, 3)), target: 5 }) },
  subjectMastery("math", "Math Master", "🧮", "Reach Proficient in every Math unit in your grade."),
  subjectMastery("language", "Word Wizard", "🪄", "Reach Proficient in every Language unit in your grade."),
  subjectMastery("science", "Super Scientist", "🧪", "Reach Proficient in every Science unit in your grade."),
  subjectMastery("social", "World Explorer", "🗺️", "Reach Proficient in every Social Studies unit in your grade."),
  {
    id: "grade-champion",
    name: "Grade Champion",
    description: "Reach Proficient in every unit in your grade.",
    tier: "platinum",
    icon: "🏆",
    category: "Mastery",
    progress: (d, ctx) => ({ value: unitsAtLevel(d, ctx.grade, 2), target: Math.max(1, unitsInGrade(ctx.grade)) }),
  },

  // Modes
  { id: "speed-10", name: "Quick Thinker", description: "Score 10 in a Speed Run.", tier: "bronze", icon: "⚡", category: "Modes", progress: count(10, (d) => Math.max(0, ...Object.values(d.speedBest))) },
  { id: "speed-20", name: "Lightning", description: "Score 20 in a Speed Run.", tier: "silver", icon: "🌩️", category: "Modes", progress: count(20, (d) => Math.max(0, ...Object.values(d.speedBest))) },
  { id: "speed-30", name: "Supersonic", description: "Score 30 in a Speed Run.", tier: "gold", icon: "💨", category: "Modes", progress: count(30, (d) => Math.max(0, ...Object.values(d.speedBest))) },
  { id: "challenge-1", name: "Challenger", description: "Pass a Challenge (8 out of 10 or better).", tier: "bronze", icon: "🛡️", category: "Modes", progress: count(1, (d) => Object.values(d.units).filter((u) => u.challengePassed).length) },
  { id: "challenge-10", name: "Champion", description: "Pass Challenges in 10 different units.", tier: "gold", icon: "👑", category: "Modes", progress: count(10, (d) => Object.values(d.units).filter((u) => u.challengePassed).length) },
  { id: "adventure-100", name: "Adventurer", description: "Answer 100 questions in Adventure mode.", tier: "silver", icon: "🗺️", category: "Modes", progress: count(100, (d) => d.modeAnswers.adventure ?? 0) },
  { id: "review-5", name: "Second Look", description: "Finish 5 Review sessions.", tier: "bronze", icon: "🔍", category: "Modes", progress: count(5, (d) => d.modes.review ?? 0) },

  // Arcade
  { id: "game-first", name: "Game On", description: "Play an arcade game.", tier: "bronze", icon: "🕹️", category: "Arcade", progress: count(1, (d) => Object.values(d.gamesPlayed).reduce((a, b) => a + b, 0)) },
  { id: "game-all", name: "Arcade Fan", description: "Play every arcade game.", tier: "silver", icon: "👾", category: "Arcade", progress: count(ARCADE_GAMES.length, (d) => ARCADE_GAMES.filter((g) => d.gamesPlayed[g]).length) },
  { id: "munchers-500", name: "Big Muncher", description: "Score 500 in Number Munchers.", tier: "silver", icon: "🟢", category: "Arcade", progress: count(500, (d) => d.gameBest.munchers ?? 0) },
  { id: "ninja-300", name: "Word Ninja", description: "Score 300 in Word Ninja.", tier: "silver", icon: "🥷", category: "Arcade", progress: count(300, (d) => d.gameBest.ninja ?? 0) },
  { id: "catch-300", name: "Safe Hands", description: "Score 300 in Critter Catch.", tier: "silver", icon: "🧺", category: "Arcade", progress: count(300, (d) => d.gameBest.catch ?? 0) },
  { id: "bubbles-300", name: "Bubble Boss", description: "Score 300 in Bubble Pop.", tier: "silver", icon: "🫧", category: "Arcade", progress: count(300, (d) => d.gameBest.bubbles ?? 0) },
  { id: "memory-200", name: "Elephant Memory", description: "Score 200 in Memory Match.", tier: "silver", icon: "🐘", category: "Arcade", progress: count(200, (d) => d.gameBest.memory ?? 0) },

  // Collector
  { id: "level-5", name: "Level 5", description: "Reach level 5.", tier: "bronze", icon: "5️⃣", category: "Collector", progress: count(5, (d) => d.level) },
  { id: "level-10", name: "Level 10", description: "Reach level 10.", tier: "silver", icon: "🔟", category: "Collector", progress: count(10, (d) => d.level) },
  { id: "level-25", name: "Level 25", description: "Reach level 25.", tier: "gold", icon: "🌟", category: "Collector", progress: count(25, (d) => d.level) },
  { id: "buy-1", name: "Shopper", description: "Buy something in the shop.", tier: "bronze", icon: "🛍️", category: "Collector", progress: count(1, (d) => d.owned.length) },
  { id: "collect-6", name: "Collector", description: "Own 6 shop items.", tier: "silver", icon: "🧸", category: "Collector", progress: count(6, (d) => d.owned.length) },
  { id: "coins-1000", name: "Treasure Hunter", description: "Earn 1,000 coins in total.", tier: "silver", icon: "💰", category: "Collector", progress: count(1000, (d) => d.coinsEarned) },

  ...FRENCH_TROPHIES,

  // Secret
  { id: "early-bird", name: "Early Bird", description: "Finish a session before 8 a.m.", tier: "bronze", icon: "🐦", category: "Secret", hidden: true, progress: count(1, (d) => d.earlySessions) },
  { id: "polymath", name: "Polymath", description: "Reach Proficient in 3 units of every subject.", tier: "gold", icon: "🦉", category: "Secret", hidden: true, progress: (d, ctx) => ({ value: (["math", "language", "science", "social"] as SubjectId[]).filter((s) => unitsAtLevel(d, ctx.grade, 2, s) >= 3).length, target: 4 }) },
  { id: "marathon", name: "Marathon", description: "Answer 100 questions in one day.", tier: "silver", icon: "🏃", category: "Secret", hidden: true, progress: count(100, (d) => Math.max(0, ...Object.values(d.days).map((x) => x.answers))) },
];

const TIER_BY_ID = new Map(TROPHIES.map((t) => [t.id, t.tier]));

export function trophyTier(id: string): Tier | undefined {
  return TIER_BY_ID.get(id);
}

export function getTrophy(id: string): Trophy | undefined {
  return TROPHIES.find((t) => t.id === id);
}

/** Trophies whose goal is met but which haven't been awarded yet. */
export function newlyEarned(d: Derived, ctx: TrophyContext): Trophy[] {
  return TROPHIES.filter((t) => {
    if (d.trophies[t.id]) return false;
    const p = t.progress(d, ctx);
    return p.value >= p.target;
  });
}
