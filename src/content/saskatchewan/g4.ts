import type { Course } from "../types";
import { units as g4_science } from "../ontario/g4-science";
import { units as sk_science_4 } from "./g4-science";
import { units as sk_social_4 } from "./g4-social";
import { reuse, share, sk } from "./kit";
import { SK_OUTCOMES as O } from "./outcomes";

// Saskatchewan Grade 4. Units that BC or Ontario already teach, and that fit the Saskatchewan outcomes, are
// shared with the outcomes they practise. The rest are written for Saskatchewan. Outcome codes are checked against
// docs/research/saskatchewan/outcomes.json in content.test.ts.

export const courses: Course[] = [
  {
    grade: "4",
    subject: "math",
    bigIdeas: { "ca-sk": O["4"].math },
    units: [],
    shares: {
      "numbers-to-10000": share("N4.1", "whole numbers to 10 000"),
      "add-subtract": share("N4.2", "addition and subtraction with answers to 10 000"),
      "times-tables": share("N4.3", "multiplication facts to 10 × 10 and related division facts"),
      "multiply-divide": share("N4.4, N4.5", "multiplying 2- and 3-digit numbers by 1-digit numbers, and dividing"),
      "fractions": share("N4.6", "fractions less than or equal to one"),
      "decimals": share("N4.7, N4.8", "decimal tenths and hundredths, with addition and subtraction"),
      "patterns-and-tables": share("P4.1", "patterns and relationships in tables and charts"),
      "equations": share("P4.2", "equations with a symbol for an unknown value"),
      "telling-time": share("SS4.1", "reading and recording time on digital and analog clocks"),
      "polygons-and-perimeter": share("SS4.4", "line symmetry of 2-D shapes"),
      "graphs-and-chance": share("SP4.1", "many-to-one correspondence on graphs"),
    },
    order: { "ca-sk": ["numbers-to-10000", "add-subtract", "times-tables", "multiply-divide", "fractions", "decimals", "patterns-and-tables", "equations", "telling-time", "polygons-and-perimeter", "graphs-and-chance"] },
  },
  {
    grade: "4",
    subject: "language",
    bigIdeas: { "ca-sk": O["4"].language },
    units: [],
    shares: {
      "reading-detectives": share("CR4.4", "main idea, inferences and summaries in fiction and non-fiction"),
      "text-features": share("CR4.4", "text features of non-fiction"),
      "figurative-language": share("CR4.4", "similes, metaphors and personification"),
      "point-of-view": share("CR4.4", "narrator and point of view"),
      "word-builders": share("CR4.4", "prefixes, suffixes and word structure"),
      "parts-of-speech": share("CC4.4", "parts of speech in writing"),
      "super-sentences": share("CC4.4", "simple and compound sentences"),
      "punctuation-power": share("CC4.4", "apostrophes, commas and other punctuation"),
      "sound-alikes": share("CC4.4", "homophones and choosing the right word"),
      "paragraph-power": share("CC4.4", "paragraphs with a central idea and a logical order"),
    },
    order: { "ca-sk": ["reading-detectives", "text-features", "figurative-language", "point-of-view", "word-builders", "parts-of-speech", "super-sentences", "punctuation-power", "sound-alikes", "paragraph-power"] },
  },
  {
    grade: "4",
    subject: "science",
    bigIdeas: { "ca-sk": O["4"].science },
    units: [...reuse(g4_science, {
      "habitats-4": sk("HC4.1, HC4.3", "habitats and communities, and how people affect them"),
      "food-webs-4": sk("HC4.1", "how plants and animals depend on each other in food chains and webs"),
      "light-4": sk("LI4.1–LI4.3", "sources of light, how light interacts with materials, and light technologies"),
      "sound-4": sk("SO4.1–SO4.3", "sources and properties of sound, and sound technologies"),
    }), ...sk_science_4],
    order: { "ca-sk": ["habitats-4", "food-webs-4", "light-4", "sound-4", ...sk_science_4.map((u) => u.id)] },
  },
  {
    grade: "4",
    subject: "social",
    bigIdeas: { "ca-sk": O["4"].social },
    units: [...sk_social_4],
    order: { "ca-sk": [...sk_social_4.map((u) => u.id)] },
  },
];
