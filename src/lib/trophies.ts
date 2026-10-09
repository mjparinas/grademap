import { allUnitRefs } from "@/content";
import type { GradeId, SubjectId } from "@/content/types";
import type { Derived } from "./derive";
import type { Mode } from "./model";
import { SHOP } from "./shop";
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

export type TrophyCategory = "Getting started" | "Practice" | "Streaks" | "Mastery" | "Modes" | "Arcade" | "Collector" | "Journey" | "Secret";

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
  /** Set on trophies that belong to one grade; only that grade's are shown and earned. */
  grade?: GradeId;
  /** Hidden trophies show "???" until unlocked. */
  hidden?: boolean;
  progress: (d: Derived, ctx: TrophyContext) => { value: number; target: number };
}

const COMPANIONS = SHOP.filter((i) => i.kind === "companion");

const count = (target: number, value: (d: Derived, ctx: TrophyContext) => number) =>
  (d: Derived, ctx: TrophyContext) => ({ value: Math.min(target, value(d, ctx)), target });

function unitsAtLevel(d: Derived, grade: GradeId, min: number, subject?: SubjectId): number {
  return allUnitRefs(grade).filter((r) => (!subject || r.course.subject === subject) && unitLevel(d.units[r.key]) >= min)
    .length;
}

function unitsInGrade(grade: GradeId, subject?: SubjectId): number {
  return allUnitRefs(grade).filter((r) => !subject || r.course.subject === subject).length;
}

const ALL_MODES: Mode[] = ["practice", "adventure", "review", "speed", "daily", "challenge"];
export const ARCADE_GAMES = ["munchers", "ninja", "catch", "bubbles", "memory"];

const GRADES: GradeId[] = ["k", "1", "2", "3", "4", "5", "6", "7"];
const gradeName = (g: GradeId) => (g === "k" ? "Kindergarten" : `Grade ${g}`);

/** Units at a level across every grade, read from the unit stats alone so it never depends on loaded content. */
const unitsEverAt = (d: Derived, min: number) => Object.values(d.units).filter((u) => unitLevel(u) >= min).length;

const subjectMastery = (grade: GradeId, subject: SubjectId, name: string, icon: string, description: string): Trophy => ({
  id: `master-${subject}-${grade}`,
  name: `${name} · ${gradeName(grade)}`,
  description: `${description} (${gradeName(grade)})`,
  tier: "gold",
  icon,
  category: "Mastery",
  grade,
  progress: (d) => ({ value: unitsAtLevel(d, grade, 2, subject), target: Math.max(1, unitsInGrade(grade, subject)) }),
});

/** Mastery trophies come once per grade, so a child who moves up has fresh long goals. */
const gradeTrophies = (grade: GradeId): Trophy[] => [
  subjectMastery(grade, "math", "Math Master", "🧮", "Reach Proficient in every Math unit"),
  subjectMastery(grade, "language", "Word Wizard", "🪄", "Reach Proficient in every Language unit"),
  subjectMastery(grade, "science", "Super Scientist", "🧪", "Reach Proficient in every Science unit"),
  subjectMastery(grade, "social", "World Explorer", "🗺️", "Reach Proficient in every Social Studies unit"),
  {
    id: `grade-champion-${grade}`,
    name: `${gradeName(grade)} Champion`,
    description: `Reach Proficient in every unit in ${gradeName(grade)}.`,
    tier: "platinum",
    icon: "🏆",
    category: "Mastery",
    grade,
    progress: (d) => ({ value: unitsAtLevel(d, grade, 2), target: Math.max(1, unitsInGrade(grade)) }),
  },
  {
    id: `polymath-${grade}`,
    name: `Polymath · ${gradeName(grade)}`,
    description: `Reach Proficient in 3 units of every subject in ${gradeName(grade)}.`,
    tier: "gold",
    icon: "🦉",
    category: "Secret",
    hidden: true,
    grade,
    progress: (d) => ({ value: (["math", "language", "science", "social"] as SubjectId[]).filter((s) => unitsAtLevel(d, grade, 2, s) >= 3).length, target: 4 }),
  },
];

/** Trophy ids from before mastery went per-grade. Kept so points already earned still count. */
const LEGACY_TIERS: Record<string, Tier> = {
  "master-math": "gold",
  "master-language": "gold",
  "master-science": "gold",
  "master-social": "gold",
  "grade-champion": "platinum",
  polymath: "gold",
};

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

  // Secret
  { id: "early-bird", name: "Early Bird", description: "Finish a session before 8 a.m.", tier: "bronze", icon: "🐦", category: "Secret", hidden: true, progress: count(1, (d) => d.earlySessions) },
  { id: "konami", name: "Old School", description: "Up, up, down, down, left, right, left, right, B, A.", tier: "silver", icon: "🎮", category: "Secret", hidden: true, progress: count(1, (d) => (d.secrets.includes("konami") ? 1 : 0)) },
  { id: "marathon", name: "Marathon", description: "Answer 100 questions in one day.", tier: "silver", icon: "🏃", category: "Secret", hidden: true, progress: count(100, (d) => Math.max(0, ...Object.values(d.days).map((x) => x.answers))) },


  // Long-haul ladders
  { id: "correct-10000", name: "Ten Thousand", description: "Get 10,000 answers right.", tier: "gold", icon: "🌌", category: "Practice", progress: count(10000, (d) => d.totals.correct) },
  { id: "correct-25000", name: "Answer Legend", description: "Get 25,000 answers right.", tier: "gold", icon: "🪐", category: "Practice", progress: count(25000, (d) => d.totals.correct) },
  { id: "minutes-6000", name: "Hundred-Hour Club", description: "Learn for 100 hours in total.", tier: "gold", icon: "🕰️", category: "Practice", progress: count(6000, (d) => Math.floor(d.totals.learnSeconds / 60)) },
  { id: "minutes-15000", name: "Master Scholar", description: "Learn for 250 hours in total.", tier: "gold", icon: "📜", category: "Practice", progress: count(15000, (d) => Math.floor(d.totals.learnSeconds / 60)) },
  { id: "perfect-100", name: "Flawless Century", description: "Finish 100 flawless lessons.", tier: "gold", icon: "🔷", category: "Practice", progress: count(100, (d) => d.totals.perfectSessions) },
  { id: "perfect-250", name: "Spotless", description: "Finish 250 flawless lessons.", tier: "gold", icon: "🔆", category: "Practice", progress: count(250, (d) => d.totals.perfectSessions) },
  { id: "comeback-500", name: "Bounce Back Pro", description: "Fix 500 answers after a first miss.", tier: "gold", icon: "🏐", category: "Practice", progress: count(500, (d) => d.totals.comebacks) },
  { id: "streak-14", name: "Fortnight", description: "Learn 14 days in a row.", tier: "silver", icon: "📆", category: "Streaks", progress: count(14, (d) => d.streak.best) },
  { id: "streak-100", name: "Hundred Days Strong", description: "Learn 100 days in a row.", tier: "gold", icon: "💯", category: "Streaks", progress: count(100, (d) => d.streak.best) },
  { id: "streak-365", name: "Unbreakable", description: "Learn 365 days in a row.", tier: "platinum", icon: "🔥", category: "Streaks", progress: count(365, (d) => d.streak.best) },
  { id: "daily-100", name: "Daily Devotion", description: "Finish 100 Daily Challenges.", tier: "gold", icon: "🌅", category: "Streaks", progress: count(100, (d) => d.dailyDone.length) },
  { id: "rest-day", name: "Rest Easy", description: "Let a rest-day shield cover a missed day.", tier: "bronze", icon: "🛡️", category: "Streaks", progress: count(1, (d) => d.streak.shieldsUsed) },
  { id: "level-50", name: "Level 50", description: "Reach level 50.", tier: "gold", icon: "💫", category: "Collector", progress: count(50, (d) => d.level) },
  { id: "level-75", name: "Level 75", description: "Reach level 75.", tier: "gold", icon: "🌠", category: "Collector", progress: count(75, (d) => d.level) },
  { id: "level-100", name: "Level 100", description: "Reach level 100.", tier: "platinum", icon: "👑", category: "Collector", progress: count(100, (d) => d.level) },
  { id: "critter-party", name: "Critter Party", description: "Have every buddy from the shop.", tier: "gold", icon: "🎊", category: "Collector", progress: count(COMPANIONS.length, (d) => COMPANIONS.filter((c) => c.cost === 0 || d.owned.includes(c.id)).length) },

  // Journey: days practised (they don't need to be in a row)
  { id: "days-30", name: "One Month In", description: "Practise on 30 different days.", tier: "bronze", icon: "🌙", category: "Journey", progress: count(30, (d) => d.activeDays) },
  { id: "days-100", name: "Hundred Days", description: "Practise on 100 different days.", tier: "silver", icon: "🌱", category: "Journey", progress: count(100, (d) => d.activeDays) },
  { id: "days-180", name: "Half a Year", description: "Practise on 180 different days.", tier: "gold", icon: "🌗", category: "Journey", progress: count(180, (d) => d.activeDays) },
  { id: "days-365", name: "A Full Year", description: "Practise on 365 different days.", tier: "platinum", icon: "🎂", category: "Journey", progress: count(365, (d) => d.activeDays) },
  { id: "days-730", name: "Two Years Strong", description: "Practise on 730 different days.", tier: "gold", icon: "🎈", category: "Journey", progress: count(730, (d) => d.activeDays) },

  // Growth
  { id: "grew-1", name: "Growth Mindset", description: "Grow a unit from Emerging to Proficient.", tier: "silver", icon: "🌿", category: "Mastery", progress: count(1, (d) => Object.values(d.units).filter((u) => u.grew).length) },
  { id: "grew-5", name: "Green Thumb", description: "Grow 5 units from Emerging to Proficient.", tier: "gold", icon: "🪴", category: "Mastery", progress: count(5, (d) => Object.values(d.units).filter((u) => u.grew).length) },
  { id: "kept-1", name: "Still Got It", description: "Come back to a unit after 30 days and still be Proficient.", tier: "silver", icon: "🧠", category: "Mastery", progress: count(1, (d) => Object.values(d.units).filter((u) => u.kept).length) },
  { id: "kept-5", name: "Long Memory", description: "Do that in 5 different units.", tier: "gold", icon: "🐘", category: "Mastery", progress: count(5, (d) => Object.values(d.units).filter((u) => u.kept).length) },
  { id: "proficient-25", name: "Woodland", description: "Reach Proficient in 25 units.", tier: "gold", icon: "🌲", category: "Mastery", progress: count(25, (d) => unitsEverAt(d, 2)) },
  { id: "extending-15", name: "Star Cluster", description: "Reach Extending in 15 units.", tier: "gold", icon: "🌌", category: "Mastery", progress: count(15, (d) => unitsEverAt(d, 3)) },
  { id: "extending-30", name: "Galaxy", description: "Reach Extending in 30 units.", tier: "gold", icon: "🪐", category: "Mastery", progress: count(30, (d) => unitsEverAt(d, 3)) },

  // Easter eggs
  { id: "dizzy-ollie", name: "Otter Nonsense", description: "Tap your buddy 10 times.", tier: "bronze", icon: "🌀", category: "Secret", hidden: true, progress: count(1, (d) => (d.secrets.includes("dizzy-ollie") ? 1 : 0)) },
  { id: "polite-moose", name: "Sorry, Eh?", description: "Say hello to a very polite moose.", tier: "bronze", icon: "🫎", category: "Secret", hidden: true, progress: count(1, (d) => (d.secrets.includes("polite-moose") ? 1 : 0)) },
  { id: "secret-word", name: "Magic Word", description: "Type a secret word on a keyboard.", tier: "bronze", icon: "🔤", category: "Secret", hidden: true, progress: count(1, (d) => (d.secrets.includes("secret-word") ? 1 : 0)) },
  { id: "palindrome", name: "Palindrome", description: "Get 11 right in a row.", tier: "silver", icon: "🪞", category: "Secret", hidden: true, progress: count(11, (d) => d.totals.bestRun) },
  { id: "make-a-wish", name: "Make a Wish", description: "Finish a lesson at 11:11.", tier: "silver", icon: "🌠", category: "Secret", hidden: true, progress: count(1, (d) => d.wishSessions) },

  ...GRADES.flatMap(gradeTrophies),
];

const TIER_BY_ID = new Map(TROPHIES.map((t) => [t.id, t.tier]));

export function trophyTier(id: string): Tier | undefined {
  return TIER_BY_ID.get(id) ?? LEGACY_TIERS[id];
}

export function getTrophy(id: string): Trophy | undefined {
  return TROPHIES.find((t) => t.id === id);
}

/** Trophies whose goal is met but which haven't been awarded yet. */
export function newlyEarned(d: Derived, ctx: TrophyContext): Trophy[] {
  return TROPHIES.filter((t) => {
    if (d.trophies[t.id]) return false;
    // Per-grade trophies are only earned in that grade.
    if (t.grade && t.grade !== ctx.grade) return false;
    const p = t.progress(d, ctx);
    return p.value >= p.target;
  });
}

/** The trophies a child sees: everything except other grades' mastery trophies (unless already earned). */
export function visibleTrophies(d: Derived, grade: GradeId): Trophy[] {
  return TROPHIES.filter((t) => !t.grade || t.grade === grade || d.trophies[t.id]);
}
