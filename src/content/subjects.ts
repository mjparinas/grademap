import type { AgeBand, GradeId, SubjectId } from "./types";

export interface SubjectMeta {
  id: SubjectId;
  /** Names change with age: "Letters & Words" for little kids, "Language Arts" for older ones. */
  title: Record<AgeBand, string>;
  emoji: string;
  colour: string;
  colourDark: string;
  colourSoft: string;
  tagline: Record<AgeBand, string>;
  /** Which mascot guides this subject. */
  mascot: string;
}

export const SUBJECTS: SubjectMeta[] = [
  {
    id: "math",
    title: { little: "Numbers", middle: "Math", big: "Math" },
    emoji: "🔢",
    colour: "#4f8ef7",
    colourDark: "#2f6fd6",
    colourSoft: "#e6f0ff",
    tagline: { little: "Count, shapes & patterns", middle: "Numbers, shapes & money", big: "Number sense to pre-calculus" },
    mascot: "hoot",
  },
  {
    id: "language",
    title: { little: "Letters & Words", middle: "Reading & Writing", big: "Language Arts" },
    emoji: "📚",
    colour: "#e9559a",
    colourDark: "#c43a7c",
    colourSoft: "#ffe8f3",
    tagline: { little: "Sounds, letters & stories", middle: "Sounds, words & stories", big: "Reading, writing & literature" },
    mascot: "ruby",
  },
  {
    id: "science",
    title: { little: "Science", middle: "Science", big: "Science" },
    emoji: "🔬",
    colour: "#25b47e",
    colourDark: "#16925f",
    colourSoft: "#e2f8ee",
    tagline: { little: "Animals, plants & weather", middle: "Life, matter & energy", big: "Life, matter, energy & space" },
    mascot: "bolt",
  },
  {
    id: "social",
    title: { little: "My World", middle: "Our World", big: "Social Studies" },
    emoji: "🌎",
    colour: "#ff9636",
    colourDark: "#e57a12",
    colourSoft: "#fff1e2",
    tagline: { little: "Me, family & community", middle: "Communities & caring", big: "People, places & history" },
    mascot: "juniper",
  },
];

export function getSubjectMeta(id: SubjectId | string): SubjectMeta {
  return SUBJECTS.find((s) => s.id === id) ?? SUBJECTS[0];
}

export const GRADE_ORDER: GradeId[] = ["k", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

export const GRADE_LABEL: Record<GradeId, string> = {
  k: "Kindergarten",
  "1": "Grade 1",
  "2": "Grade 2",
  "3": "Grade 3",
  "4": "Grade 4",
  "5": "Grade 5",
  "6": "Grade 6",
  "7": "Grade 7",
  "8": "Grade 8",
  "9": "Grade 9",
  "10": "Grade 10",
  "11": "Grade 11",
  "12": "Grade 12",
};

export const GRADE_SHORT: Record<GradeId, string> = {
  k: "K",
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",
  "10": "10",
  "11": "11",
  "12": "12",
};

export function gradeSlug(grade: GradeId): string {
  return grade === "k" ? "kindergarten" : `grade-${grade}`;
}

export function gradeFromSlug(slug: string): GradeId | undefined {
  return GRADE_ORDER.find((g) => gradeSlug(g) === slug);
}

export function ageBandFor(grade: GradeId): AgeBand {
  const g = GRADE_ORDER.indexOf(grade);
  if (g <= 1) return "little";
  if (g >= 5) return "big";
  return "middle";
}

/** Typical age at the start of a grade, for suggesting a grade from a child's age. */
export function gradeForAge(age: number): GradeId {
  const g = Math.max(0, Math.min(12, Math.round(age) - 5));
  return GRADE_ORDER[g];
}
