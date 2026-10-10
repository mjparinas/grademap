import type { Course } from "../types";
import { G5_LANGUAGE, G5_MATH } from "./overall";
import { G5_SCIENCE, G5_SOCIAL } from "./g5-overall-ss";
import { units as languageUnits } from "./g5-language";
import { units as mathUnits } from "./g5-math";
import { units as scienceUnits } from "./g5-science";
import { units as socialUnits } from "./g5-social";
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
  {
    grade: "5",
    subject: "science",
    bigIdeas: { "ca-on": G5_SCIENCE },
    units: scienceUnits,
    shares: {
      "digestion-and-breathing": { standards: on("B2.1, B2.2", "the digestive and respiratory systems and their vital organs") },
      "heart-bones-muscles": { standards: on("B2.1–B2.3", "the circulatory and musculoskeletal systems, and how body systems work together") },
      "natural-resources": { standards: on("E1.1, E2.5", "renewable and non-renewable resources and using them wisely") },
    },
    order: {
      "ca-on": ["healthy-choices-5", "digestion-and-breathing", "heart-bones-muscles", "body-teamwork-5", "states-of-matter-5", "changes-of-state-5", "matter-changes-5", "forces-on-structures-5", "forms-of-energy-5", "energy-sources-5", "natural-resources", "science-skills-5"],
    },
  },
  {
    grade: "5",
    subject: "social",
    bigIdeas: { "ca-on": G5_SOCIAL },
    units: socialUnits,
    shares: {
      "levels-of-government": { standards: on("B3.2, B3.4", "the levels of government, what each looks after, and shared responsibilities") },
      "making-laws": { standards: on("B3.5, B3.9", "elections, how laws are made, and ways citizens can take part") },
      "rights-and-freedoms": { standards: on("B3.1", "citizens' rights and responsibilities, including the Canadian Charter of Rights and Freedoms") },
    },
    order: {
      "ca-on": ["first-peoples-5", "explorers-5", "new-france-5", "fur-trade-5", "conflict-and-change-5", "treaties-today-5", "levels-of-government", "services-5", "making-laws", "rights-and-freedoms", "citizen-action-5", "inquiry-5"],
    },
  },
  ...frenchCourses("5"),
];
