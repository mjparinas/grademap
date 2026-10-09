import type { Course } from "../types";
import { G4_LANGUAGE, G4_MATH } from "./overall";
import { G4_SCIENCE, G4_SOCIAL } from "./g4-overall-ss";
import { units as scienceUnits } from "./g4-science";
import { units as socialUnits } from "./g4-social";
import { units as languageUnits } from "./g4-language";
import { units as mathUnits } from "./g4-math";
import { on } from "./kit";
import { frenchCourses } from "./french";
import { course as coreFrench4 } from "./g4-core-french";

// Ontario Grade 4. Units the BC course also has are shared; the rest are written for the
// Ontario expectations.

export const courses: Course[] = [
  {
    grade: "4",
    subject: "math",
    bigIdeas: { "ca-on": G4_MATH },
    units: mathUnits,
    shares: {
      "numbers-to-10000": { standards: on("B1.1–B1.3", "reading, comparing, ordering and rounding whole numbers up to 10 000") },
      "add-subtract": { standards: on("B2.1, B2.4", "adding and subtracting whole numbers that add up to no more than 10 000") },
      "times-tables": { standards: on("B2.2", "multiplication facts to 10 × 10 and the related division facts") },
      "multiply-divide": { standards: on("B2.5, B2.6", "multiplying and dividing two- and three-digit numbers by one-digit numbers") },
      "patterns-and-tables": { standards: on("C1.1–C1.4", "repeating and growing patterns, rules and tables of values") },
      "telling-time": { standards: on("E2.3", "elapsed time and the relationships between units of time") },
    },
    order: {
      "ca-on": ["numbers-to-10000", "add-subtract", "times-tables", "multiply-divide", "big-multiply", "fractions-4", "decimals-4", "patterns-and-tables", "equations-4", "data-4", "chance-4", "rectangles-and-grids", "angles-and-area", "metric-4", "telling-time", "money-4"],
    },
  },
  {
    grade: "4",
    subject: "language",
    bigIdeas: { "ca-on": G4_LANGUAGE },
    units: languageUnits,
    shares: {
      "word-builders": { standards: on("B2.1, B2.2", "prefixes, suffixes, base words and vocabulary") },
      "reading-detectives": { standards: on("C2.6, C3.2, C3.3", "main ideas, inferences and analyzing texts") },
      "text-features": { standards: on("C1.3", "text patterns and features") },
      "point-of-view": { standards: on("C1.6", "the narrator's point of view") },
      "figurative-language": { standards: on("C3.1", "literary devices such as personification") },
    },
    order: {
      "ca-on": ["word-builders", "grammar-4", "sentences-4", "punctuation-4", "reading-detectives", "text-features", "text-features-4", "point-of-view", "figurative-language"],
    },
  },
  {
    grade: "4",
    subject: "science",
    bigIdeas: { "ca-on": G4_SCIENCE },
    units: scienceUnits,
    order: {
      "ca-on": ["habitats-4", "food-webs-4", "adaptations-4", "light-4", "sound-4", "machines-4", "motion-4", "rocks-4", "earth-history-4"],
    },
  },
  {
    grade: "4",
    subject: "social",
    bigIdeas: { "ca-on": G4_SOCIAL },
    units: socialUnits,
    shares: {
      "provinces-and-regions": { standards: on("B3.1, B3.5", "Canada's provinces, territories and capitals, and its physical regions") },
    },
    order: {
      "ca-on": ["early-societies", "daily-life-4", "environment-4", "governing-4", "early-tech-4", "physical-regions-4", "sectors-4", "industry-env-4", "political-4", "provinces-and-regions"],
    },
  },
  coreFrench4,
  ...frenchCourses("4"),
];
