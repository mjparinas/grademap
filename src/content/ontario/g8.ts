import type { Course } from "../types";
import { G8_LANGUAGE, G8_MATH } from "./g8-overall";
import { units as languageUnits } from "./g8-language";
import { units as mathUnits } from "./g8-math";
import { on } from "./kit";
import { frenchCourses } from "./french";
import { G8_SCIENCE, G8_SOCIAL } from "./g8-overall-ss";
import { units as scienceUnits } from "./g8-science";
import { units as socialUnits } from "./g8-social";

// Ontario Grade 8. Units the BC course also has are shared; the rest are written for the
// Ontario expectations.

export const courses: Course[] = [
  {
    grade: "8",
    subject: "math",
    bigIdeas: { "ca-on": G8_MATH },
    units: mathUnits,
    shares: {
      "fraction-operations": { standards: on("B2.5, B2.6", "adding, subtracting, multiplying and dividing fractions and mixed numbers") },
      "squares-and-roots": { standards: on("B1.3, B2.2", "square numbers, square roots and estimating square roots") },
      "ratios-and-rates": { standards: on("B2.8", "ratios, rates and proportional reasoning") },
      "linear-equations": { standards: on("C1.3, C2.2, C2.3", "pattern rules, evaluating expressions and solving equations") },
      "pythagorean-theorem": { standards: on("E2.4", "the Pythagorean relationship and finding an unknown side length") },
      "surface-area-volume": { standards: on("E2.3", "surface area and volume of prisms and cylinders") },
    },
    order: {
      "ca-on": ["numbers-8", "squares-and-roots", "integers-8", "fraction-operations", "percents-8", "ratios-and-rates", "patterns-8", "algebra-8", "linear-equations", "data-8", "chance-8", "transformations-8", "scale-8", "angles-8", "pythagorean-theorem", "measure-8", "surface-area-volume", "money-8"],
    },
  },
  {
    grade: "8",
    subject: "language",
    bigIdeas: { "ca-on": G8_LANGUAGE },
    units: languageUnits,
    shares: {
      "close-reading": { standards: on("C3.2, C3.3", "inferences and analyzing complex texts") },
      "literary-devices": { standards: on("C3.1", "literary devices such as irony and symbolism") },
      "argument-and-media": { standards: on("A2.3, C3.5", "credibility, bias and the perspectives in arguments and media") },
      "grammar-and-style": { standards: on("B3.1, B3.2, B3.3", "sentence structure, grammar, capitalization and punctuation") },
      "word-study": { standards: on("B2.1, B2.2", "morphemes, vocabulary and word meanings") },
    },
    order: {
      "ca-on": ["close-reading", "strategies-8", "narrator-8", "literary-devices", "irony-satire-8", "forms-features-8", "argument-and-media", "digital-8", "grammar-and-style", "word-study", "writing-8"],
    },
  },
  {
    grade: "8",
    subject: "science",
    bigIdeas: { "ca-on": G8_SCIENCE },
    units: scienceUnits,
    shares: {
      "cells-and-life": { standards: on("B2.1–B2.4, B2.6", "the cell theory, organelles, plant and animal cells, diffusion and osmosis, and cells, tissues, organs and systems") },
    },
    order: {
      "ca-on": ["stem-skills-8", "cells-organisms-8", "cells-and-life", "viscosity-flow-8", "density-buoyancy-8", "pressure-pascal-8", "hydraulics-pneumatics-8", "fluids-society-8", "systems-8", "work-energy-8", "machines-8", "water-systems-8", "water-stewardship-8"],
    },
  },
  {
    grade: "8",
    subject: "social",
    bigIdeas: { "ca-on": G8_SOCIAL },
    units: socialUnits,
    order: {
      "ca-on": ["historical-thinking-8", "confederation-8", "railway-west-8", "treaties-indian-act-8", "metis-resistance-8", "residential-schools-8", "black-communities-8", "newcomers-rights-8", "canada-1890-1914-8", "work-cities-reform-8", "settlement-patterns-8", "sustainable-settlement-8", "maps-graphs-8", "quality-of-life-8", "economies-8"],
    },
  },
  ...frenchCourses("8"),
];
