import type { Course } from "../types";
import { G2_LANGUAGE, G2_MATH } from "./overall";
import { units as languageUnits } from "./g2-language";
import { units as mathUnits } from "./g2-math";
import { on } from "./kit";
import { frenchCourses } from "./french";

// Ontario Grade 2. Units the BC course also has are shared; the rest are written for the
// Ontario expectations.

export const courses: Course[] = [
  {
    grade: "2",
    subject: "math",
    bigIdeas: { "ca-on": G2_MATH },
    units: mathUnits,
    shares: {
      "facts-to-20": { standards: on("B2.2", "recalling addition facts to 20 and related subtraction facts") },
      "adding-to-100": { standards: on("B2.3, B2.4", "adding and subtracting whole numbers to 100") },
      patterns: { standards: on("C1.1–C1.3", "describing, extending and creating patterns") },
      measuring: { standards: on("E2.2, E2.3", "measuring length and comparing measurements") },
    },
    order: {
      "ca-on": ["numbers-to-200", "facts-to-20", "adding-to-100", "balance-the-equation", "sharing-fairly", "groups-and-sharing", "patterns", "graphs-and-mode", "chance-2", "shapes-and-symmetry", "simple-maps", "measuring", "how-long", "money-to-200"],
    },
  },
  {
    grade: "2",
    subject: "language",
    bigIdeas: { "ca-on": G2_LANGUAGE },
    units: languageUnits,
    shares: {
      "rhyme-time": { standards: on("B2.1, B2.2", "rhyme and the sounds in words") },
      "sound-detectives": { standards: on("B2.3, B2.4", "reading and spelling words with common sound patterns") },
      "super-sentences": { standards: on("B3.1, B3.3", "writing complete sentences with capitals and end marks") },
      "story-builders": { standards: on("C2.6, C3.3", "story parts and retelling") },
      "word-power": { standards: on("B2.4, B3.2", "building vocabulary") },
    },
    order: {
      "ca-on": ["rhyme-time", "sound-detectives", "word-power", "grammar-2", "super-sentences", "build-sentences", "punctuation-2", "word-pictures", "story-builders", "reading-detectives", "text-features"],
    },
  },
  ...frenchCourses("2"),
];
