import type { Course } from "../types";
import { units as g7_math } from "../ontario/g7-math";
import { units as g7_science } from "../ontario/g7-science";
import { units as sk_social_7 } from "./g7-social";
import { reuse, share, sk } from "./kit";
import { SK_OUTCOMES as O } from "./outcomes";

// Saskatchewan Grade 7. Units that BC or Ontario already teach, and that fit the Saskatchewan outcomes, are
// shared with the outcomes they practise. The rest are written for Saskatchewan. Outcome codes are checked against
// docs/research/saskatchewan/outcomes.json in content.test.ts.

export const courses: Course[] = [
  {
    grade: "7",
    subject: "math",
    bigIdeas: { "ca-sk": O["7"].math },
    units: [...reuse(g7_math, {
      "fractions-7": sk("N7.5", "adding and subtracting fractions and mixed numbers"),
    })],
    shares: {
      "decimal-operations": share("N7.2", "adding, subtracting, multiplying and dividing decimals"),
      "fractions-decimals-percents": share("N7.3, N7.4", "relating fractions, decimals and percents"),
      "integer-add-subtract": share("N7.6", "adding and subtracting integers"),
      "linear-relations": share("P7.1", "relationships between patterns, tables and graphs"),
      "two-step-equations": share("P7.3, P7.4", "one- and two-step linear equations"),
      "circles": share("SS7.1, SS7.2", "circumference, central angles and area of circles"),
      "coordinates-transformations": share("SS7.4, SS7.5", "the Cartesian plane and transformations"),
      "circle-graphs": share("SP7.2", "circle graphs"),
      "probability": share("SP7.3", "theoretical and experimental probability of two independent events"),
    },
    order: { "ca-sk": ["decimal-operations", "fractions-decimals-percents", "fractions-7", "integer-add-subtract", "linear-relations", "two-step-equations", "circles", "coordinates-transformations", "circle-graphs", "probability"] },
  },
  {
    grade: "7",
    subject: "language",
    bigIdeas: { "ca-sk": O["7"].language },
    units: [],
    shares: {
      "close-reading": share("CR7.6", "reading and interpreting grade-level texts"),
      "literary-devices": share("CR7.6", "literary devices in stories and poems"),
      "tone-mood": share("CR7.6", "tone and mood"),
      "poetry-lab": share("CR7.6", "reading and responding to poetry"),
      "source-check": share("CR7.7", "checking sources in information texts"),
      "persuasion": share("CC7.7", "persuasive writing"),
      "clauses-sentences": share("CC7.3", "clauses and sentence structure"),
      "modifiers-parallelism": share("CC7.3", "modifiers and parallel structure"),
      "semicolons-colons-dashes": share("CC7.3", "semicolons, colons and dashes"),
      "word-mix-ups": share("CC7.3", "commonly confused words"),
    },
    order: { "ca-sk": ["close-reading", "literary-devices", "tone-mood", "poetry-lab", "source-check", "persuasion", "clauses-sentences", "modifiers-parallelism", "semicolons-colons-dashes", "word-mix-ups"] },
  },
  {
    grade: "7",
    subject: "science",
    bigIdeas: { "ca-sk": O["7"].science },
    units: [...reuse(g7_science, {
      "ecosystems-7": sk("IE7.2", "living things in ecosystems as food webs, populations and communities"),
      "food-chains-7": sk("IE7.2, IE7.3", "food chains and the flow of energy in ecosystems"),
      "cycles-succession-7": sk("IE7.3", "water, carbon and nitrogen cycles, and how ecosystems change"),
      "human-impact-7": sk("IE7.4", "how ecosystems respond to natural and human influences"),
      "particles-mixtures-7": sk("MS7.1", "pure substances and mixtures using the particle model"),
      "solutions-separation-7": sk("MS7.2, MS7.3", "separating mixtures, and solubility and concentration"),
      "heat-particles-7": sk("HT7.2", "states of matter and the effect of heat on the particle model"),
      "heat-transfer-7": sk("HT7.3", "conduction, convection and radiation"),
    })],
    shares: {
      "restless-earth": share("EC7.1", "earthquakes, volcanoes and the movement of Earth's crust"),
    },
    order: { "ca-sk": ["ecosystems-7", "food-chains-7", "cycles-succession-7", "human-impact-7", "particles-mixtures-7", "solutions-separation-7", "heat-particles-7", "heat-transfer-7", "restless-earth"] },
  },
  {
    grade: "7",
    subject: "social",
    bigIdeas: { "ca-sk": O["7"].social },
    units: [...sk_social_7],
    order: { "ca-sk": [...sk_social_7.map((u) => u.id)] },
  },
];
