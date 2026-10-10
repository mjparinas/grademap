import type { Course } from "../types";
import { units as g8_math } from "../ontario/g8-math";
import { units as g8_language } from "../ontario/g8-language";
import { units as g8_science } from "../ontario/g8-science";
import { units as sk_social_8 } from "./g8-social";
import { reuse, share, sk } from "./kit";
import { SK_OUTCOMES as O } from "./outcomes";

// Saskatchewan Grade 8. Units that BC or Ontario already teach, and that fit the Saskatchewan outcomes, are
// shared with the outcomes they practise. The rest are written for Saskatchewan. Outcome codes are checked against
// docs/research/saskatchewan/outcomes.json in content.test.ts.

export const courses: Course[] = [
  {
    grade: "8",
    subject: "math",
    bigIdeas: { "ca-sk": O["8"].math },
    units: [...reuse(g8_math, {
      "integers-8": sk("N8.5", "multiplying and dividing integers"),
      "patterns-8": sk("P8.1", "linear relations in tables, graphs and equations"),
      "transformations-8": sk("SS8.4", "tessellations and transformations"),
    })],
    shares: {
      "squares-and-roots": share("N8.1", "squares and square roots of whole numbers"),
      "percents-and-money": share("N8.2", "percents, including fractional and decimal percents"),
      "ratios-and-rates": share("N8.3", "rates, ratios and proportional reasoning"),
      "fraction-operations": share("N8.4", "multiplying and dividing fractions and mixed numbers"),
      "linear-equations": share("P8.1, P8.2", "linear relations and solving linear equations"),
      "pythagorean-theorem": share("SS8.1", "the Pythagorean theorem"),
      "surface-area-volume": share("SS8.2, SS8.3", "surface area and volume of right prisms and cylinders"),
      "probability-and-data": share("SP8.1, SP8.2", "displaying data, and the probability of independent events"),
    },
    order: { "ca-sk": ["squares-and-roots", "percents-and-money", "ratios-and-rates", "fraction-operations", "integers-8", "patterns-8", "linear-equations", "pythagorean-theorem", "surface-area-volume", "transformations-8", "probability-and-data"] },
  },
  {
    grade: "8",
    subject: "language",
    bigIdeas: { "ca-sk": O["8"].language },
    units: [...reuse(g8_language, {
      "irony-satire-8": sk("CR8.6", "irony, satire and allusion"),
      "narrator-8": sk("CR8.6", "narrators and point of view"),
      "digital-8": sk("CR8.4", "reading digital and multimedia texts"),
      "forms-features-8": sk("CR8.7", "forms and features of information texts"),
      "writing-8": sk("CC8.7", "revising and improving writing"),
    })],
    shares: {
      "close-reading": share("CR8.6", "reading and interpreting grade-level texts"),
      "literary-devices": share("CR8.6", "literary devices"),
      "argument-and-media": share("CR8.4", "argument and persuasive techniques in media"),
      "word-study": share("CR8.3", "word parts and vocabulary"),
      "grammar-and-style": share("CC8.3", "grammar and style in writing"),
    },
    order: { "ca-sk": ["close-reading", "literary-devices", "irony-satire-8", "narrator-8", "argument-and-media", "digital-8", "forms-features-8", "word-study", "grammar-and-style", "writing-8"] },
  },
  {
    grade: "8",
    subject: "science",
    bigIdeas: { "ca-sk": O["8"].science },
    units: [...reuse(g8_science, {
      "density-buoyancy-8": sk("FD8.1, FD8.2", "density, buoyancy and forces in fluids"),
      "viscosity-flow-8": sk("FD8.3", "viscosity and other properties of fluids"),
      "pressure-pascal-8": sk("FD8.3, FD8.4", "pressure and compressibility in fluids"),
      "hydraulics-pneumatics-8": sk("FD8.4", "how hydraulic and pneumatic systems work"),
    })],
    shares: {
      "cells-and-life": share("CS8.1", "plant and animal cells and their parts"),
      "light-and-radiation": share("OP8.1, OP8.4", "light, its properties and electromagnetic radiation"),
    },
    order: { "ca-sk": ["cells-and-life", "light-and-radiation", "density-buoyancy-8", "viscosity-flow-8", "pressure-pascal-8", "hydraulics-pneumatics-8"] },
  },
  {
    grade: "8",
    subject: "social",
    bigIdeas: { "ca-sk": O["8"].social },
    units: [...sk_social_8],
    order: { "ca-sk": [...sk_social_8.map((u) => u.id)] },
  },
];
