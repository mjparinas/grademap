export type SubjectId = "math" | "reading" | "science" | "world";

/** Things drawn above a question to help explain it. */
export type Visual =
  | { type: "equation"; text: string }
  | { type: "emoji"; emoji: string; caption?: string }
  | { type: "emojiRow"; items: string[]; showBlank?: boolean }
  | { type: "blocks"; tens: number; ones: number }
  | { type: "coins"; coins: number[] }
  | { type: "ruler"; length: number; emoji: string }
  | { type: "pictograph"; title: string; rows: { label: string; emoji: string; count: number }[] }
  | { type: "shape"; shape: ShapeName }
  | { type: "spinner"; segments: string[] }
  | { type: "towers"; heights: number[]; showBlank?: boolean }
  | { type: "story"; lines: string[] }
  | { type: "tenFrame"; filled: number; extra?: number };

export type ShapeName =
  | "triangle"
  | "square"
  | "rectangle"
  | "pentagon"
  | "hexagon"
  | "circle"
  | "cube"
  | "sphere"
  | "cylinder"
  | "cone";

export interface Choice {
  id: string;
  label: string;
  emoji?: string;
  shape?: ShapeName;
  /** Draw a Canadian coin worth this many cents. */
  coin?: number;
}

interface BaseQuestion {
  /** What the child reads (and hears with read-aloud). */
  prompt: string;
  /** Shown after a miss, and again with the answer if they still need help. */
  hint: string;
  visual?: Visual;
}

export interface ChoiceQuestion extends BaseQuestion {
  kind: "choice";
  choices: Choice[];
  answer: string;
}

/** Build a number with tens rods and ones cubes. */
export interface BuildQuestion extends BaseQuestion {
  kind: "build";
  target: number;
}

/** Tap Canadian coins to make an amount in cents. */
export interface CoinsQuestion extends BaseQuestion {
  kind: "coins";
  target: number;
  coins: number[];
}

/** Tap the items in the right order. `items` is listed in the correct order. */
export interface OrderQuestion extends BaseQuestion {
  kind: "order";
  items: { id: string; label: string; emoji?: string }[];
}

/** Put each item in the right basket. */
export interface SortQuestion extends BaseQuestion {
  kind: "sort";
  bins: { id: string; label: string; emoji: string }[];
  items: { id: string; label: string; emoji: string; bin: string }[];
}

export type Question =
  | ChoiceQuestion
  | BuildQuestion
  | CoinsQuestion
  | OrderQuestion
  | SortQuestion;

export interface Unit {
  id: string;
  title: string;
  emoji: string;
  /** One short line for kids. */
  blurb: string;
  /** The BC Grade 2 learning standard (curricular content) this unit practises. */
  standard: string;
  /** Plain-language note for parents. */
  parentNote: string;
  generate: () => Question[];
}

export interface Subject {
  id: SubjectId;
  title: string;
  emoji: string;
  colour: string;
  colourDark: string;
  colourSoft: string;
  tagline: string;
  /** BC curriculum Big Ideas for Grade 2, shown to parents. */
  bigIdeas: string[];
  units: Unit[];
}
