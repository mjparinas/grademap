import type { Course } from "../types";
import { G6_LANGUAGE, G6_MATH } from "./overall";
import { G6_SCIENCE, G6_SOCIAL } from "./g6-overall-ss";
import { units as languageUnits } from "./g6-language";
import { units as mathUnits } from "./g6-math";
import { units as scienceUnits } from "./g6-science";
import { units as socialUnits } from "./g6-social";
import { on } from "./kit";
import { frenchCourses } from "./french";

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
  {
    grade: "6",
    subject: "science",
    bigIdeas: { "ca-on": G6_SCIENCE },
    units: scienceUnits,
    shares: {
      "solar-system": { standards: on("E2.1", "the components of the solar system and their main physical characteristics") },
    },
    order: {
      "ca-on": ["classifying-life-6", "biodiversity-6", "biodiversity-risks-6", "static-electricity-6", "circuits-6", "electrical-energy-6", "flight-6", "earth-moon-sun-6", "solar-system", "weight-and-space-tech-6", "science-skills-6"],
    },
  },
  {
    grade: "6",
    subject: "social",
    bigIdeas: { "ca-on": G6_SOCIAL },
    units: socialUnits,
    shares: {
      "map-skills": { standards: on("B3.7", "locating countries and regions using latitude, longitude and hemispheres") },
      "global-challenges": { standards: on("B1.2, B1.3, B3.3", "how Canadians, governments and organizations respond to global issues, and why some issues need worldwide cooperation") },
      "trade-and-globalization": { standards: on("B3.8, B3.9", "Canada's trade relationships and their economic effects") },
    },
    order: {
      "ca-on": ["canadian-identities-6", "indigenous-contributions-6", "newcomers-6", "communities-past-6", "indigenous-histories-6", "canada-and-world-6", "global-help-6", "map-skills", "canada-partners-6", "global-challenges", "trade-and-globalization", "inquiry-6"],
    },
  },
  ...frenchCourses("6"),
];
