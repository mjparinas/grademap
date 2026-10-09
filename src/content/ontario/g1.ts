import type { Course } from "../types";
import { G1_LANGUAGE, G1_MATH } from "./overall";
import { units as languageUnits } from "./g1-language";
import { units as mathUnits } from "./g1-math";
import { on } from "./kit";
import { G1_SCIENCE, G1_SOCIAL } from "./g1-overall-ss";
import { units as scienceUnits } from "./g1-science";
import { units as socialUnits } from "./g1-social";
import { frenchCourses } from "./french";

// Ontario Grade 1. Units the BC course also has (counting and adding to 20, patterns, shapes
// and so on) are shared; the rest are written for the Ontario expectations.

export const courses: Course[] = [
  {
    grade: "1",
    subject: "math",
    bigIdeas: { "ca-on": G1_MATH },
    units: mathUnits,
    shares: {
      "make-ten": { standards: on("B2.2", "recalling addition facts to 10 and related subtraction facts") },
      adding: { standards: on("B2.1, B2.3", "adding whole numbers that add up to no more than 20 with mental math") },
      "take-away": { standards: on("B2.1–B2.3", "taking away within 20 and the link between adding and taking away") },
      "equal-or-not": { standards: on("C2.2, C2.3", "equal and not equal expressions, and equivalent relationships") },
      patterns: { standards: on("C1.1–C1.3", "describing, extending and predicting repeating patterns") },
      measuring: { standards: on("E2.1, E2.2", "measurable attributes, and comparing and ordering objects by length") },
      shapes: { standards: on("E1.1, E1.3", "sorting 2D shapes and 3D objects and describing their features") },
    },
    order: {
      "ca-on": ["numbers-to-50", "make-ten", "adding", "take-away", "add-subtract-to-50", "fair-shares", "equal-or-not", "patterns", "data-and-graphs", "possible-or-certain", "shapes", "where-is-it", "measuring", "calendar", "money-to-50"],
    },
  },
  {
    grade: "1",
    subject: "language",
    bigIdeas: { "ca-on": G1_LANGUAGE },
    units: languageUnits,
    shares: {
      "blend-it": { standards: on("B2.1, B2.4", "blending and segmenting sounds to read and spell words") },
      "short-vowels": { standards: on("B2.3, B2.4", "short vowel sounds and the letters that spell them") },
      "word-families": { standards: on("B2.4, B2.5", "reading and spelling words that share a pattern") },
      "sh-ch-th": { standards: on("B2.3, B2.4", "the sounds sh, ch and th and the letters that spell them") },
      "sight-words": { standards: on("B2.4, B2.5", "reading and spelling common words") },
      sentences: { standards: on("B3.1, B3.3", "sentences, capital letters and end marks") },
      "story-time": { standards: on("C2.6, C3.3", "who, where and what happens in a story") },
      "describing-words": { standards: on("B2.7, B3.2", "describing words, opposites and vocabulary") },
      "more-than-one": { standards: on("B3.2", "singular and plural nouns") },
    },
    order: {
      "ca-on": ["blend-it", "short-vowels", "sh-ch-th", "word-families", "sight-words", "word-jobs", "more-than-one", "describing-words", "sentences", "sentence-types", "sound-play", "story-time", "think-it-through"],
    },
  },
  {
    grade: "1",
    subject: "science",
    bigIdeas: { "ca-on": G1_SCIENCE },
    units: scienceUnits,
    shares: {
      "living-things": { standards: on("B2.2, B2.3", "living and non-living things, plants and animals, and what living things need") },
      "animal-survival": { standards: on("B2.3, E2.5", "how animal features and behaviours help them meet their needs and respond to the seasons") },
      materials: { standards: on("D2.1, D2.3, D2.6", "the materials objects are made of and the properties that suit them for a job") },
      "sky-and-seasons": { standards: on("E2.1–E2.4", "Earth and the Sun, day and night, and the four seasons as a cycle") },
    },
    order: {
      "ca-on": ["think-like-a-scientist", "living-things", "what-living-things-need", "our-bodies-and-senses", "animal-survival", "a-healthy-environment", "energy-in-our-lives", "materials", "objects-and-structures", "sky-and-seasons", "day-night-and-seasons"],
    },
  },
  {
    grade: "1",
    subject: "social",
    bigIdeas: { "ca-on": G1_SOCIAL },
    units: socialUnits,
    shares: {
      "my-community": { standards: on("A3.1, B1.2, B3.8", "roles and responsibilities, community helpers and shared services") },
      "different-and-alike": { standards: on("A1.3, A3.4", "how families and celebrations are alike and different, and respectful, inclusive behaviour") },
      "our-land": { standards: on("B1.1, B1.3, B3.2", "natural and built features and caring for them") },
      maps: { standards: on("B2.3, B3.5", "reading maps: symbols, legends and directions") },
    },
    order: {
      "ca-on": ["my-roles", "changes-in-my-life", "my-community", "respect-and-inclusion", "different-and-alike", "our-land", "places-in-my-community", "community-services", "maps", "measure-and-map", "social-studies-detectives"],
    },
  },
  ...frenchCourses("1"),
];
