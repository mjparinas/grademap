import type { PlacementResult } from "./placement";
import type { FrameworkId, GradeId, SubjectId } from "@/content/types";

// Shared shapes for the device database, the sync API and the server.

export type Mode = "practice" | "adventure" | "review" | "speed" | "daily" | "challenge";

export interface Profile {
  id: string;
  name: string;
  /** Mascot/critter id used as the avatar. */
  avatar: string;
  colour: string;
  grade: GradeId;
  framework: FrameworkId;
  birthYear?: number;
  /** Equipped cosmetics. */
  companion?: string;
  title?: string;
  confetti?: string;
  /** Progress before this time is ignored (a parent reset it). */
  resetAt?: number;
  createdAt: number;
  updatedAt: number;
  deleted?: boolean;
}

export interface ChildSettings {
  profileId: string;
  dailyGoalMinutes: number;
  /** Minutes of learning that earn a game break. */
  learnMinutesPerReward: number;
  /** Minutes of games each reward unlocks. */
  rewardGameMinutes: number;
  maxGameMinutesPerDay: number;
  gamesEnabled: boolean;
  /** Games are always unlocked (no learning needed). */
  freePlay: boolean;
  showTimer: boolean;
  /** Focus options for children who find lots of motion, noise or pressure hard. All default to off. */
  /** Turn off bursts, confetti, floating text and screen shakes, whatever the device setting is. */
  calmMotion?: boolean;
  /** Keep only gentle sounds: no fanfares, chimes or countdown ticks. */
  quietSounds?: boolean;
  /** Hide clocks and countdown numbers; timed modes show a quiet bar instead. */
  hideTimers?: boolean;
  /** Hold trophy and level pop-ups until the lesson is over. */
  quietToasts?: boolean;
  /** Five questions at a time (Adventure checkpoints and Review). */
  shortSessions?: boolean;
  /** Reading comfort: extra space between letters, words and lines. */
  /** A hint opened before answering still counts as a first-try answer. Off by default: it counts like a retry. */
  freeHints?: boolean;
  roomyText?: boolean;
  /** Stronger text colours and outlines. */
  highContrast?: boolean;
  autoRead: boolean;
  sound: boolean;
  /** Light vibration on taps and answers, on devices that support it. On unless set to false. */
  haptics?: boolean;
  enabledSubjects: SubjectId[];
  updatedAt: number;
}

export interface FamilyInfo {
  /** Server-side account, when a parent has signed in on this device. */
  account?: { email: string; familyId: string; /** Has the parent confirmed their email address? */ verified?: boolean };
  plan: "trial" | "free" | "premium";
  trialEndsAt: number;
  subscription?: { status: string; interval?: "month" | "year"; currentPeriodEnd?: number };
  updatedAt: number;
}

interface EventBase {
  /** Unique id (random), so events can be merged from many devices safely. */
  id: string;
  profileId: string;
  /** When it happened (ms since epoch). */
  t: number;
}

export type AppEvent = EventBase &
  (
    | {
        type: "answer";
        unit: string;
        /** Right on the first try. */
        correct: boolean;
        attempts: number;
        revealed: boolean;
        /** The child opened the hint before answering. */
        hinted?: boolean;
        ms: number;
        mode: Mode;
        difficulty?: number;
      }
    | {
        type: "session";
        mode: Mode;
        /** A unit key, a subject id, or "mix". */
        scope: string;
        total: number;
        correct: number;
        ms: number;
      }
    | { type: "play"; game: string; seconds: number }
    | { type: "game"; game: string; score: number; level: number }
    | { type: "trophy"; trophy: string }
    /** A hidden easter egg found (for example "konami"). */
    | { type: "secret"; code: string }
    | { type: "buy"; item: string; cost: number }
    | { type: "quest"; quest: string; day: string; reward: number }
    /** A finished placement test. Not practice: it never counts toward XP, stars or proficiency. */
    | ({ type: "placement" } & PlacementResult)
  );

export type EventOf<T extends AppEvent["type"]> = Extract<AppEvent, { type: T }>;

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Local calendar day, e.g. "2026-10-08". */
export function dayKey(t: number): string {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Grades whose children have read-aloud switched on by default. Parents can still turn it off per child. */
export const AUTO_READ_GRADES: readonly GradeId[] = ["k", "1"];

export function defaultChildSettings(profileId: string, little: boolean, grade?: GradeId): ChildSettings {
  return {
    profileId,
    dailyGoalMinutes: little ? 10 : 15,
    learnMinutesPerReward: 20,
    rewardGameMinutes: 5,
    maxGameMinutesPerDay: 20,
    gamesEnabled: true,
    freePlay: false,
    showTimer: !little,
    autoRead: grade ? AUTO_READ_GRADES.includes(grade) : little,
    sound: true,
    enabledSubjects: ["math", "language", "science", "social"],
    updatedAt: Date.now(),
  };
}
