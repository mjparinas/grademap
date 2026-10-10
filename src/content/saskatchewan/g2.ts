import type { Course } from "../types";
import { units as g2_language } from "../ontario/g2-language";
import { units as g2_science } from "../ontario/g2-science";
import { units as g2_social } from "../ontario/g2-social";
import { reuse, share, sk } from "./kit";
import { SK_OUTCOMES as O } from "./outcomes";

// Saskatchewan Grade 2. Units that BC or Ontario already teach, and that fit the Saskatchewan outcomes, are
// shared with the outcomes they practise. The rest are written for Saskatchewan. Outcome codes are checked against
// docs/research/saskatchewan/outcomes.json in content.test.ts.

export const courses: Course[] = [
  {
    grade: "2",
    subject: "math",
    bigIdeas: { "ca-sk": O["2"].math },
    units: [],
    shares: {
      "tens-and-ones": share("N2.1", "whole numbers to 100: place value, skip counting, odd and even, comparing and ordering"),
      "bigger-or-smaller": share("N2.1, P2.3", "comparing and ordering numbers to 100, and equality and inequality"),
      "facts-to-20": share("N2.2", "addition and subtraction facts and strategies"),
      "adding-to-100": share("N2.2", "addition and subtraction with answers to 100"),
      "patterns": share("P2.1, P2.2", "repeating and increasing patterns"),
      "shapes": share("SS2.3–SS2.5", "describing and comparing 2-D shapes and 3-D objects"),
      "graphs": share("SP2.1", "concrete graphs and pictographs"),
    },
    order: { "ca-sk": ["tens-and-ones", "bigger-or-smaller", "facts-to-20", "adding-to-100", "patterns", "shapes", "graphs"] },
  },
  {
    grade: "2",
    subject: "language",
    bigIdeas: { "ca-sk": O["2"].language },
    units: [...reuse(g2_language, {
      "reading-detectives": sk("CR2.4", "predicting, inferring and understanding what is read"),
      "text-features": sk("CR2.4", "using features of informational texts"),
    })],
    shares: {
      "rhyme-time": share("CR2.4", "word patterns, word families and rhyme in reading"),
      "sound-detectives": share("CR2.4", "sounds and letters used to read words"),
      "super-sentences": share("CC2.4", "clear, complete sentences with capital letters and end marks"),
      "story-builders": share("CR2.4, CC2.4", "story elements in reading and writing"),
      "word-power": share("CC2.4", "word patterns, vocabulary and plurals"),
    },
    order: { "ca-sk": ["rhyme-time", "sound-detectives", "super-sentences", "story-builders", "word-power", "reading-detectives", "text-features"] },
  },
  {
    grade: "2",
    subject: "science",
    bigIdeas: { "ca-sk": O["2"].science },
    units: [...reuse(g2_science, {
      "animals-and-people": sk("AN2.3", "how people and animals depend on each other"),
    })],
    shares: {
      "life-cycles": share("AN2.1, AN2.2", "growth and life cycles of familiar animals, and how humans compare"),
      "solids-and-liquids": share("LS2.1, LS2.2", "properties of familiar liquids and solids and how they interact"),
      "push-and-pull": share("MP2.2", "factors, such as friction, that affect motion"),
      "water-world": share("AW2.1, AW2.2", "air and water in the environment and why living things need them"),
    },
    order: { "ca-sk": ["life-cycles", "animals-and-people", "solids-and-liquids", "push-and-pull", "water-world"] },
  },
  {
    grade: "2",
    subject: "social",
    bigIdeas: { "ca-sk": O["2"].social },
    units: [...reuse(g2_social, {
      "groups-in-our-community": sk("IN2.2", "the groups and cultures in the local community"),
      "then-and-now": sk("DR2.1", "the history of the local community and its people"),
    })],
    shares: {
      "needs-and-wants": share("RW2.1", "how the local community meets the needs and wants of its members"),
      "communities-in-canada": share("IN2.1, IN2.2", "characteristics of communities and the cultural groups in them"),
      "caring-citizens": share("PA2.3, RW2.3", "rights and responsibilities, and acting for a sustainable community"),
    },
    order: { "ca-sk": ["needs-and-wants", "communities-in-canada", "groups-in-our-community", "then-and-now", "caring-citizens"] },
  },
];
