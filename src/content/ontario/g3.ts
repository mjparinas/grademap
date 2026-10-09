import type { Course } from "../types";
import { G3_LANGUAGE, G3_MATH } from "./overall";
import { units as languageUnits } from "./g3-language";
import { units as mathUnits } from "./g3-math";
import { on } from "./kit";

// Ontario Grade 3. Units the BC course also has are shared; the rest are written for the
// Ontario expectations.

export const courses: Course[] = [
  {
    grade: "3",
    subject: "math",
    bigIdeas: { "ca-on": G3_MATH },
    units: mathUnits,
    shares: {
      "numbers-to-1000": { standards: on("B1.1, B1.2, B1.5", "reading, comparing and using place value for whole numbers up to 1000") },
      multiplication: { standards: on("B2.2, B2.6", "multiplication facts of 2, 5 and 10, and multiplication with arrays") },
      division: { standards: on("B2.6, B2.7", "division as sharing and grouping") },
      "add-subtract-1000": { standards: on("B2.3–B2.5", "adding and subtracting whole numbers to 1000 with mental math and algorithms") },
      "patterns-and-equations": { standards: on("C1.1–C1.4, C2.2, C2.3", "patterns, and equal and unequal expressions") },
      "3d-objects": { standards: on("E1.1", "sorting and describing 3D objects by faces, edges and vertices") },
      measuring: { standards: on("E2.2, E2.4, E2.5", "metric units of length, and mass") },
      time: { standards: on("E2.6", "telling time with analog and digital clocks") },
    },
    order: {
      "ca-on": ["numbers-to-1000", "round-and-count", "add-subtract-1000", "multiplication", "division", "fair-shares-3", "patterns-and-equations", "data-and-mean", "likelihood-3", "3d-objects", "move-it", "measuring", "area-and-perimeter-3", "time", "make-change"],
    },
  },
  {
    grade: "3",
    subject: "language",
    bigIdeas: { "ca-on": G3_LANGUAGE },
    units: languageUnits,
    shares: {
      "spelling-patterns": { standards: on("B2.1, B2.2", "spelling with phonics and orthographic patterns") },
      "prefixes-suffixes": { standards: on("B2.3, B2.4", "prefixes, suffixes and base words") },
      "word-pairs": { standards: on("B2.4", "synonyms, antonyms and homophones") },
      "story-elements": { standards: on("C2.6, C3.3", "problem, solution and sequence in a story") },
      "read-and-think": { standards: on("C2.6, C3.2", "main idea, details and inferences") },
    },
    order: {
      "ca-on": ["spelling-patterns", "prefixes-suffixes", "word-pairs", "grammar-3", "sentences-3", "punctuation-3", "devices-3", "story-elements", "read-and-think", "text-patterns"],
    },
  },
];
