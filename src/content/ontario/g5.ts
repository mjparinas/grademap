import type { Course } from "../types";
import { G5_LANGUAGE, G5_MATH } from "./overall";
import { units as languageUnits } from "./g5-language";
import { units as mathUnits } from "./g5-math";
import { on } from "./kit";
import { frenchCourses } from "./french";

// Ontario Grade 5. Units the BC course also has are shared; the rest are written for the
// Ontario expectations.

export const courses: Course[] = [
  {
    grade: "5",
    subject: "math",
    bigIdeas: { "ca-on": G5_MATH },
    units: mathUnits,
    shares: {
      "patterns-and-equations": { standards: on("C1.1–C1.4, C2.3", "growing and shrinking patterns, and solving equations") },
    },
    order: {
      "ca-on": ["numbers-100k", "multiply-divide-5", "fractions-5", "decimals-5", "patterns-and-equations", "algebra-5", "data-5", "probability-5", "shapes-5", "measure-5", "money-5"],
    },
  },
  {
    grade: "5",
    subject: "language",
    bigIdeas: { "ca-on": G5_LANGUAGE },
    units: languageUnits,
    shares: {
      "word-roots": { standards: on("B2.1, B2.2", "word parts, roots and vocabulary") },
      "context-clues": { standards: on("B2.2", "using context to understand new words") },
      "reading-detectives": { standards: on("C2.6, C3.2, C3.3", "main ideas, inferences and analyzing texts") },
      "plot-and-conflict": { standards: on("C3.3", "sequencing the events of multiple plots") },
      "figurative-language": { standards: on("C3.1", "literary devices, imagery and humour") },
      "purpose-and-structure": { standards: on("C1.2, C1.3", "text forms, purpose and text patterns") },
    },
    order: {
      "ca-on": ["word-roots", "context-clues", "grammar-5", "sentences-5", "punctuation-5", "reading-detectives", "plot-and-conflict", "figurative-language", "purpose-and-structure", "style-and-perspective"],
    },
  },
  ...frenchCourses("5"),
];
