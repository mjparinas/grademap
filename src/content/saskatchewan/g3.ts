import type { Course } from "../types";
import { units as g3_science } from "../ontario/g3-science";
import { units as sk_science_3 } from "./g3-science";
import { reuse, share, sk } from "./kit";
import { SK_OUTCOMES as O } from "./outcomes";

// Saskatchewan Grade 3. Units that BC or Ontario already teach, and that fit the Saskatchewan outcomes, are
// shared with the outcomes they practise. The rest are written for Saskatchewan. Outcome codes are checked against
// docs/research/saskatchewan/outcomes.json in content.test.ts.

export const courses: Course[] = [
  {
    grade: "3",
    subject: "math",
    bigIdeas: { "ca-sk": O["3"].math },
    units: [],
    shares: {
      "numbers-to-1000": share("N3.1", "whole numbers to 1000"),
      "add-subtract-1000": share("N3.2", "addition and subtraction with answers to 1000"),
      "multiplication": share("N3.3", "multiplication as repeated addition and equal groups"),
      "division": share("N3.3", "division as sharing and grouping"),
      "fractions": share("N3.4", "fractions of a whole and of a set"),
      "patterns-and-equations": share("P3.1, P3.2", "increasing and decreasing patterns, and one-step equations"),
      "time": share("SS3.1", "the passage of time and units of time"),
      "measuring": share("SS3.2, SS3.3", "measuring mass and length in standard units"),
      "3d-objects": share("SS3.4", "faces, edges and vertices of 3-D objects"),
      "graphs-and-chance": share("SP3.1", "collecting data and reading bar graphs and pictographs"),
    },
    order: { "ca-sk": ["numbers-to-1000", "add-subtract-1000", "multiplication", "division", "fractions", "patterns-and-equations", "time", "measuring", "3d-objects", "graphs-and-chance"] },
  },
  {
    grade: "3",
    subject: "language",
    bigIdeas: { "ca-sk": O["3"].language },
    units: [],
    shares: {
      "read-and-think": share("CR3.4", "reading strategies and thinking about texts"),
      "story-elements": share("CR3.1, CR3.4", "characters, setting, plot and problem and solution"),
      "spelling-patterns": share("CC3.4", "spelling patterns used in writing"),
      "prefixes-suffixes": share("CR3.4", "prefixes, suffixes and base words"),
      "word-pairs": share("CR3.4", "synonyms, antonyms and homophones"),
      "word-jobs": share("CC3.4", "parts of speech in writing"),
      "punctuation-power": share("CC3.4", "punctuation in writing"),
      "sentence-smarts": share("CC3.4", "sentence types and complete sentences"),
      "fact-or-opinion": share("CR3.4", "telling fact from opinion in non-fiction"),
    },
    order: { "ca-sk": ["read-and-think", "story-elements", "spelling-patterns", "prefixes-suffixes", "word-pairs", "word-jobs", "punctuation-power", "sentence-smarts", "fact-or-opinion"] },
  },
  {
    grade: "3",
    subject: "science",
    bigIdeas: { "ca-sk": O["3"].science },
    units: [...reuse(g3_science, {
      "plant-parts": sk("PL3.1", "plant parts and what plants need to grow"),
      "plant-life": sk("PL3.1", "growth, life cycles and germination of plants"),
      "structures-3": sk("SM3.2", "natural and built structures and what they are for"),
      "strong-stable": sk("SM3.1, SM3.2", "materials, joins and what makes a structure strong and stable"),
      "forces-3": sk("ME3.1", "contact and non-contact forces"),
    }), ...sk_science_3],
    order: { "ca-sk": ["plant-parts", "plant-life", "structures-3", "strong-stable", "forces-3", ...sk_science_3.map((u) => u.id)] },
  },
  {
    grade: "3",
    subject: "social",
    bigIdeas: { "ca-sk": O["3"].social },
    units: [],
    shares: {
      "maps-and-globes": share("DR3.1", "model representations of Earth: maps and globes"),
      "meeting-needs": share("RW3.1", "how communities around the world meet needs and wants"),
      "world-cultures": share("IN3.1, IN3.2", "daily life, cultures and traditions in communities around the world"),
      "global-indigenous": share("DR3.3", "beliefs about living on and with the land"),
    },
    order: { "ca-sk": ["maps-and-globes", "meeting-needs", "world-cultures", "global-indigenous"] },
  },
];
