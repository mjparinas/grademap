// The content model. Nothing here is specific to one province or country:
// units carry learning-standard text per framework (e.g. "ca-bc"), and the
// scoring scheme and report-card language live with the framework.

export type GradeId = "k" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
export type SubjectId = "math" | "language" | "science" | "social" | "immersion" | "core-french";
/** A curriculum framework: a province, state or national standard set. */
export type FrameworkId = "ca-bc" | "ca-on" | "ca-ab" | "ca-sk" | "ca-mb" | "ca-yt" | "ca-nt" | "ca-ns" | "ca-nb";
/** UI and wording adapt to the child's age band. */
export type AgeBand = "little" | "middle" | "big";

export type ShapeName =
  | "triangle"
  | "square"
  | "rectangle"
  | "pentagon"
  | "hexagon"
  | "octagon"
  | "circle"
  | "oval"
  | "rhombus"
  | "trapezoid"
  | "parallelogram"
  | "cube"
  | "sphere"
  | "cylinder"
  | "cone"
  | "rectangular-prism"
  | "pyramid";

/** Pictures drawn above a question to help explain it. */
export type Visual =
  /** Big maths or text; each ☐ is drawn as a blank box. */
  | { type: "equation"; text: string }
  | { type: "emoji"; emoji: string; caption?: string }
  /** A row of emoji, optionally ending in a "?" blank (patterns). */
  | { type: "emojiRow"; items: string[]; showBlank?: boolean }
  /** Objects to count, laid out in a neat grid. */
  | { type: "dots"; count: number; emoji?: string }
  /** Base-ten blocks. */
  | { type: "blocks"; hundreds?: number; tens: number; ones: number }
  /** Coins and bills, in cents (5, 10, 25, 100, 200, 500, 1000, 2000, 5000). */
  | { type: "coins"; coins: number[] }
  | { type: "ruler"; length: number; emoji: string }
  | {
      type: "pictograph";
      title: string;
      /** `count` is the number of pictures drawn. */
      rows: { label: string; emoji: string; count: number }[];
      /** How many each picture stands for. Defaults to 1. */
      each?: number;
    }
  | { type: "bars"; title: string; bars: { label: string; value: number; emoji?: string }[] }
  | { type: "table"; title?: string; headers: string[]; rows: (string | number)[][] }
  | { type: "shape"; shape: ShapeName }
  | { type: "spinner"; segments: string[] }
  | { type: "towers"; heights: number[]; showBlank?: boolean }
  /** A short story, one line per sentence. */
  | { type: "story"; lines: string[] }
  /**
   * A longer reading passage with an optional title. In a poem, put a line break (`\n`) between lines of a
   * stanza and use an empty string between stanzas.
   */
  | { type: "passage"; title?: string; paragraphs: string[] }
  | { type: "tenFrame"; filled: number; extra?: number }
  /** An analog clock. */
  | { type: "clock"; hour: number; minute: number }
  /** A number line; `blankAt` shows a "?" at that value, `jumps` draws hops. */
  | {
      type: "numberLine";
      min: number;
      max: number;
      step: number;
      labelEvery?: number;
      marks?: number[];
      blankAt?: number;
      jumps?: { from: number; to: number }[];
    }
  /** A fraction model: shaded parts of a bar or circle. */
  | { type: "fraction"; numerator: number; denominator: number; shape?: "bar" | "circle" }
  /** Rows × columns of objects (multiplication arrays). */
  | { type: "array"; rows: number; cols: number; emoji?: string }
  /** A big letter, word or symbol card. */
  | { type: "letter"; text: string; caption?: string }
  /** Points on a coordinate grid (first quadrant unless min is negative). */
  | { type: "grid"; size: number; min?: number; points: { x: number; y: number; label?: string }[] }
  /** An angle drawn with two rays. */
  | { type: "angle"; degrees: number };

export interface Choice {
  id: string;
  label: string;
  emoji?: string;
  shape?: ShapeName;
  /** Draw a coin or bill worth this many cents. */
  coin?: number;
  /** What read-aloud says for this choice, if different from the label. */
  speak?: string;
}

interface BaseQuestion {
  /** What the child reads. Keep it short for little kids. */
  prompt: string;
  /** What read-aloud says, if different from the prompt (e.g. letter sounds). */
  speak?: string;
  /** Set to "fr" when the prompt (and passage) is in French, so read-aloud uses a French voice. Hints stay in English. */
  lang?: "fr";
  /** Core French: the answer choices are French even though the prompt is English. */
  choicesLang?: "fr";
  /** Core French: the passage or story shown above is French even though the prompt is English. */
  visualLang?: "fr";
  /** Shown after a miss, and again with the answer if they still need help. */
  hint: string;
  visual?: Visual;
}

export interface ChoiceQuestion extends BaseQuestion {
  kind: "choice";
  choices: Choice[];
  answer: string;
}

/** Build a number with base-ten blocks (up to 99, or up to 999 with `hundreds`). */
export interface BuildQuestion extends BaseQuestion {
  kind: "build";
  target: number;
  hundreds?: boolean;
}

/** Tap coins (and bills) to make an amount in cents. */
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

/** Type an answer on an on-screen keypad. */
export interface InputQuestion extends BaseQuestion {
  kind: "input";
  /** The canonical answer, e.g. "42", "3.5", "3/4", "-7". */
  answer: string;
  /** Other answers that also count (e.g. "6/8" for "3/4"). */
  accept?: string[];
  /** Which keys to show. */
  keypad?: "number" | "decimal" | "fraction" | "integer";
  /** Text shown after the answer box, e.g. "cm" or "¢". */
  suffix?: string;
}

export type Question =
  | ChoiceQuestion
  | BuildQuestion
  | CoinsQuestion
  | OrderQuestion
  | SortQuestion
  | InputQuestion;

export interface GenerateOptions {
  /** 1 = easier, 2 = on level, 3 = stretch. Units may ignore it. */
  difficulty?: 1 | 2 | 3;
}

/**
 * A short "how it works" a child can open before practising: a few steps and one worked example.
 * Practice only; it never changes scoring. Keep steps short, in kid-facing words.
 */
export interface Lesson {
  /** 2 to 4 short steps. Kindergarten and Grade 1 steps stay under 80 characters. */
  steps: string[];
  example: {
    question: string;
    /** The working, one line per step. */
    work: string[];
    answer: string;
    /** A picture to show beside the example. */
    visual?: Visual;
  };
}

export interface Unit {
  id: string;
  title: string;
  emoji: string;
  /** One short, kid-facing line. */
  blurb: string;
  /** Plain-language note for parents. */
  parentNote: string;
  /** The learning standard this unit practises, per framework. */
  standards: Partial<Record<FrameworkId, string>>;
  /** An optional short lesson. Added per grade in ./lessons, so it can be shared by every province that uses the unit. */
  lesson?: Lesson;
  /** Returns 6–10 questions. Must only use the helpers in ../random (never Math.random). */
  generate: (opts?: GenerateOptions) => Question[];
}

/** One grade's units in one subject. */
export interface Course {
  grade: GradeId;
  subject: SubjectId;
  /** Big Ideas (or equivalent) per framework, shown to parents. */
  bigIdeas: Partial<Record<FrameworkId, string[]>>;
  units: Unit[];
  /**
   * Units another framework's content already provides that this framework also uses as they
   * are. The standards listed here are added to the unit, so progress carries over if a family
   * switches between the two.
   */
  shares?: Record<string, { standards: Partial<Record<FrameworkId, string>> }>;
  /** The order of unit ids a framework shows them in. Units it doesn't list come last. */
  order?: Partial<Record<FrameworkId, string[]>>;
}
