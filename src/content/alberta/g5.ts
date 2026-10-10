import type { Course } from "../types";
import { frenchCourses } from "./french";
import { G5_LANGUAGE, G5_MATH, G5_SCIENCE, G5_SOCIAL } from "./g5-overall";
import { units as languageUnits } from "./g5-language";
import { units as mathUnits } from "./g5-math";
import { units as scienceUnits } from "./g5-science";
import { units as socialUnits } from "./g5-social";
import { ab } from "./kit";

// Alberta Grade 5. Units the BC or Ontario course already has are shared with Alberta's own standards text.
// Social studies (Ancient civilizations) is written new for Alberta.

export const courses: Course[] = [
  {
    grade: "5",
    subject: "math",
    bigIdeas: { "ca-ab": G5_MATH },
    units: mathUnits,
    shares: {
      "numbers-to-a-million": { standards: ab("5N1.1", "reading, writing, comparing and rounding whole numbers using place value") },
      decimals: { standards: ab("5N1.1, 5N2.1", "decimals to thousandths using place value, and adding and subtracting them") },
      "add-and-subtract": { standards: ab("5N2.1", "adding and subtracting whole numbers to 1 000 000") },
      multiply: { standards: ab("5N4.1", "multiplying whole numbers, including 3-digit by 2-digit") },
      divide: { standards: ab("5N4.1", "dividing 3-digit numbers by 1-digit numbers, with and without remainders") },
      "fractions-5": { standards: ab("5N5.1", "improper fractions and mixed numbers, and equivalent fractions") },
      "decimals-5": { standards: ab("5N7.1", "showing the same part-whole relationship as fractions, decimals and percents") },
      "multiply-divide-5": { standards: ab("5N4.1, 5N7.1", "multiplication and division facts, and ratios") },
      "algebra-5": { standards: ab("5A1.1, 5A1.2, 5A1.3", "expressions, order of operations and solving one- and two-step equations") },
      "patterns-and-equations": { standards: ab("5P1.1, 5A1.3", "arithmetic sequences, position and term, and solving equations") },
      "area-and-perimeter": { standards: ab("5M1.1", "area of squares and rectangles in square units, and its relationship to perimeter") },
    },
    order: {
      "ca-ab": ["numbers-to-a-million", "decimals", "add-and-subtract", "multiply", "divide", "divisibility-ab", "fractions-5", "fraction-add-subtract-ab", "decimals-5", "multiply-divide-5", "algebra-5", "patterns-and-equations", "symmetry-ab", "area-and-perimeter"],
    },
  },
  {
    grade: "5",
    subject: "language",
    bigIdeas: { "ca-ab": G5_LANGUAGE },
    units: languageUnits,
    shares: {
      "context-clues": { standards: ab("Apply knowledge of vocabulary to reading and writing.", "using context to work out the meaning of new words") },
      "word-roots": { standards: ab("Apply knowledge of vocabulary to reading and writing.", "Greek and Latin roots and word parts") },
      "reading-detectives": { standards: ab("Evaluate ideas and information to comprehend texts.", "main ideas, inferences and understanding what you read") },
      "plot-and-conflict": { standards: ab("Evaluate ideas and information to comprehend texts.", "plot, conflict and the order of events in a story") },
      "purpose-and-structure": { standards: ab("Examine how text genres, forms, and structures support and enhance communication in a variety of digital or non-digital formats.", "text forms, purposes and structures") },
      "media-smarts": { standards: ab("Examine how text genres, forms, and structures support and enhance communication in a variety of digital or non-digital formats.", "persuasive techniques and facts and opinions in media") },
      "verb-tenses": { standards: ab("Experiment with and apply grammar, spelling, and punctuation to develop precise written communication.", "verb tenses and subject-verb agreement") },
      "complex-sentences": { standards: ab("Experiment with and apply grammar, spelling, and punctuation to develop precise written communication.", "simple, compound and complex sentences") },
      "punctuation-power": { standards: ab("Experiment with and apply grammar, spelling, and punctuation to develop precise written communication.", "commas, quotation marks, colons and apostrophes") },
    },
    order: {
      "ca-ab": ["group-talk-ab", "context-clues", "word-roots", "reading-detectives", "plot-and-conflict", "purpose-and-structure", "media-smarts", "writing-audience-ab", "verb-tenses", "complex-sentences", "punctuation-power", "spelling-ab"],
    },
  },
  {
    grade: "5",
    subject: "science",
    bigIdeas: { "ca-ab": G5_SCIENCE },
    units: scienceUnits,
    shares: {
      "states-of-matter-5": { standards: ab("5M 1.1, 5M 1.2", "the particle model of matter, and mass and volume of solids, liquids and gases") },
      "changes-of-state-5": { standards: ab("5M 1.1", "how particles behave as matter melts, freezes, evaporates and condenses") },
      "energy-sources-5": { standards: ab("5E 2", "renewable and non-renewable energy resources and how people use them") },
    },
    order: {
      "ca-ab": ["states-of-matter-5", "measuring-matter-ab", "changes-of-state-5", "flight-forces-ab", "buoyancy-ab", "energy-sources-5"],
    },
  },
  {
    grade: "5",
    subject: "social",
    bigIdeas: { "ca-ab": G5_SOCIAL },
    units: socialUnits,
    order: {
      "ca-ab": ["where-and-when-ab", "rise-and-fall-ab", "environment-ab", "trade-and-taxes-ab", "governments-ab", "legacies-ab", "informed-citizens-ab"],
    },
  },
  ...frenchCourses("5"),
];
