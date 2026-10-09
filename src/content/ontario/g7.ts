import type { Course } from "../types";
import { G7_LANGUAGE, G7_MATH } from "./overall";
import { units as languageUnits } from "./g7-language";
import { units as mathUnits } from "./g7-math";
import { on } from "./kit";
import { frenchCourses } from "./french";

// Ontario Grade 7. Units the BC course also has are shared; the rest are written for the
// Ontario expectations.

export const courses: Course[] = [
  {
    grade: "7",
    subject: "math",
    bigIdeas: { "ca-on": G7_MATH },
    units: mathUnits,
    shares: {
      "integer-add-subtract": { standards: on("B2.4", "adding and subtracting integers") },
      "decimal-operations": { standards: on("B2.1, B2.9", "operations with decimal numbers and order of operations") },
      "fractions-decimals-percents": { standards: on("B1.7, B2.2", "fractions, decimals and percents") },
      "coordinates-transformations": { standards: on("E1.4", "transformations on a coordinate plane") },
      "linear-relations": { standards: on("C1.1–C1.3", "linear relations, tables and graphs") },
      "two-step-equations": { standards: on("C2.3", "solving two-step equations") },
      circles: { standards: on("E2.3–E2.5", "circumference and area of circles") },
      volume: { standards: on("E2.7", "volume of prisms and cylinders") },
      "circle-graphs": { standards: on("D1.3", "circle graphs") },
      probability: { standards: on("D2.2", "probability of events") },
    },
    order: {
      "ca-on": ["numbers-7", "powers-7", "integer-add-subtract", "decimal-operations", "fractions-7", "fractions-decimals-percents", "percents-7", "linear-relations", "algebra-7", "two-step-equations", "data-7", "circle-graphs", "probability", "dependent-events", "coordinates-transformations", "circles", "solids-7", "volume", "measure-7", "money-7"],
    },
  },
  {
    grade: "7",
    subject: "language",
    bigIdeas: { "ca-on": G7_LANGUAGE },
    units: languageUnits,
    shares: {
      "clauses-sentences": { standards: on("B3.1", "complex sentences that combine phrases and clauses") },
      "modifiers-parallelism": { standards: on("B3.1, B3.2", "sentence structure, modifiers and parallel ideas") },
      "semicolons-colons-dashes": { standards: on("B3.3", "semicolons, colons and dashes") },
      "close-reading": { standards: on("C3.2, C3.3", "inferences and analyzing complex texts") },
      "literary-devices": { standards: on("C3.1", "foreshadowing, symbolism and other literary devices") },
      "tone-mood": { standards: on("C1.5", "word choice, voice and tone") },
      persuasion: { standards: on("C3.3, C3.5", "analyzing arguments and perspectives") },
      "source-check": { standards: on("C3.5", "evidence of bias and checking sources") },
      "poetry-lab": { standards: on("C1.2", "text forms and genres, including poetry") },
    },
    order: {
      "ca-on": ["clauses-sentences", "grammar-7", "modifiers-parallelism", "punctuation-7", "semicolons-colons-dashes", "close-reading", "point-of-view-7", "literary-devices", "tone-mood", "text-patterns-7", "persuasion", "source-check", "poetry-lab"],
    },
  },
  ...frenchCourses("7"),
];
