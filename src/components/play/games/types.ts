import type { AgeBand, GradeId } from "@/content/types";

export interface GameProps {
  grade: GradeId;
  band: AgeBand;
  /** Report the score whenever it changes. */
  onScore: (score: number) => void;
  onLevel: (level: number) => void;
  /** Out of lives (or finished). */
  onOver: () => void;
}

export interface GameInfo {
  id: string;
  title: string;
  icon: string;
  subject: string;
  desc: string;
  colour: string;
  dark: string;
}

export const GAMES: GameInfo[] = [
  { id: "munchers", title: "Number Munchers", icon: "🟢", subject: "Math", desc: "Munch the numbers that fit the rule. Watch out for Grumbles!", colour: "#4f8ef7", dark: "#2f6fd6" },
  { id: "ninja", title: "Word Ninja", icon: "🥷", subject: "Reading", desc: "Swipe to slice the right words as they fly!", colour: "#e9559a", dark: "#c43a7c" },
  { id: "catch", title: "Critter Catch", icon: "🧺", subject: "Science", desc: "Move the basket to catch the right things.", colour: "#25b47e", dark: "#16925f" },
  { id: "bubbles", title: "Bubble Pop", icon: "🫧", subject: "Phonics", desc: "Pop the bubbles that match the sound or rule.", colour: "#06b6d4", dark: "#0891b2" },
  { id: "memory", title: "Memory Match", icon: "🃏", subject: "Brain", desc: "Flip cards to find matching pairs.", colour: "#ff9636", dark: "#e57a12" },
];
