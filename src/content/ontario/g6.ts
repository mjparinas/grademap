import type { Course } from "../types";
import { G6_LANGUAGE, G6_MATH } from "./overall";
import { units as languageUnits } from "./g6-language";
import { units as mathUnits } from "./g6-math";
import { on } from "./kit";

// Ontario Grade 6. Units the BC course also has are shared; the rest are written for the
// Ontario expectations.

export const courses: Course[] = [
  {
    grade: "6",
    subject: "math",
    bigIdeas: { "ca-on": G6_MATH },
    units: mathUnits,
    shares: {
      "decimal-multiply-divide": { standards: on("B2.4, B2.7, B2.8, B2.11", "adding, subtracting, multiplying and dividing decimal numbers") },
      "patterns-and-graphs": { standards: on("C1.1–C1.4", "repeating, growing and shrinking patterns, including linear patterns") },
      equations: { standards: on("B2.1, C2.3", "order of operations and solving equations") },
      transformations: { standards: on("E1.3, E1.4", "coordinates and combinations of transformations") },
    },
    order: {
      "ca-on": ["numbers-6", "factors-6", "fractions-6", "decimal-multiply-divide", "percents-6", "patterns-and-graphs", "algebra-6", "equations", "data-6", "probability-6", "shapes-6", "transformations", "measure-6", "money-6"],
    },
  },
  {
    grade: "6",
    subject: "language",
    bigIdeas: { "ca-on": G6_LANGUAGE },
    units: languageUnits,
    shares: {
      "roots-analogies": { standards: on("B2.1, B2.2", "word roots, morphology and vocabulary") },
      "commas-clauses": { standards: on("B3.1, B3.3", "clauses and commas") },
      "close-reading": { standards: on("C2.6, C3.2, C3.3", "main ideas, inferences and evaluating information") },
      "point-of-view": { standards: on("C1.6", "the narrator's point of view") },
      "figurative-language": { standards: on("C3.1", "hyperbole, idioms and other literary devices") },
      "connotation-tone": { standards: on("C1.5", "word choice, voice and tone") },
      "sources-bias": { standards: on("C3.3, C3.5", "evaluating sources and spotting bias") },
    },
    order: {
      "ca-on": ["roots-analogies", "grammar-6", "sentences-6", "commas-clauses", "punctuation-6", "close-reading", "point-of-view", "figurative-language", "connotation-tone", "sources-bias", "text-forms-6"],
    },
  },
];
