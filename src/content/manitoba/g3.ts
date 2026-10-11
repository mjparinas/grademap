import type { Course } from "../types";
import { courses as ontario } from "../ontario/g3";
import { frenchCourses } from "./french";
import { adopt, course, unitsOf } from "./kit";
import { polygons } from "./units/g3-math";
import { life, speed } from "./units/g3-science";
import { listening, sounds, wonder, plan, better, media, goals } from "./units/g3-more-language";
import { find, solve, careers, ways } from "./units/g3-more-science";
import { identity, land, people, team, findOut, think } from "./units/g3-more-social";
import { citizenship, groups } from "./units/g3-social-a";
import { maps, life as communities, needs, ancient } from "./units/g3-social-b";

// Manitoba Grade 3. Math follows the Grade 3 mathematics outcomes (3.N, 3.PR, 3.SS, 3.SP), English language arts the ELA
// curriculum (strands A to D), science the Grade 3 science outcomes (SCI.3, forces and motion, life and engineering) and social
// studies Global Communities and an ancient society (3-K outcomes). Units BC or Ontario already has are listed with the
// Manitoba outcomes they practise.

export const courses: Course[] = [
  course("3", "math", {
    share: {
      "numbers-to-1000": ["3.N.1, 3.N.2, 3.N.3, 3.N.5", "counting, representing, comparing and ordering numbers to 1000, and place value"],
      "facts-to-20": ["3.N.10", "mental math strategies for addition facts and related subtraction facts"],
      "add-subtract-1000": ["3.N.6, 3.N.7, 3.N.9", "adding and subtracting 2-digit and 3-digit numbers"],
      multiplication: ["3.N.11", "multiplication as repeated addition, arrays and equal groups"],
      division: ["3.N.12", "division as sharing and grouping"],
      fractions: ["3.N.13", "fractions as parts of a whole or a set"],
      "patterns-and-equations": ["3.PR.1, 3.PR.2, 3.PR.3", "increasing and decreasing patterns, and one-step equations with a symbol"],
      time: ["3.SS.1, 3.SS.2", "the passage of time, and seconds, minutes, hours, days and months"],
      measuring: ["3.SS.3, 3.SS.4", "measuring length in cm and m, and mass in g and kg"],
      "3d-objects": ["3.SS.6", "describing 3-D objects by their faces and edges"],
      "graphs-and-chance": ["3.SP.1, 3.SP.2", "collecting data and reading bar graphs"],
    },
    adopted: adopt(unitsOf(ontario, "math"), {
      "round-and-count": ["3.N.4, 3.N.8", "estimating quantities and sums and differences"],
      "area-and-perimeter-3": ["3.SS.5", "perimeter of regular and irregular shapes"],
    }),
    own: [polygons],
    order: ["numbers-to-1000", "round-and-count", "facts-to-20", "add-subtract-1000", "multiplication", "division", "fractions", "patterns-and-equations", "time", "measuring", "area-and-perimeter-3", "3d-objects", "mb-polygons", "graphs-and-chance"],
  }),
  course("3", "language", {
    share: {
      "read-and-think": ["ELA.3.B2.3, ELA.3.B2.5, ELA.3.B2.6", "predicting, using strategies to understand a text, and recalling important information"],
      "story-elements": ["ELA.3.B2.4, ELA.3.B3.4", "story elements, connections to a text and sharing an opinion about it"],
      "word-jobs": ["ELA.3.C2.3, ELA.3.C3.2", "more specific nouns, verbs and adjectives"],
      "punctuation-power": ["ELA.3.C3.3, ELA.3.C3.4", "capital letters and punctuation"],
      "spelling-patterns": ["ELA.3.A2.3, ELA.3.C3.2", "reading and spelling words with common spelling patterns"],
      "prefixes-suffixes": ["ELA.3.A2.4", "prefixes, suffixes and word parts that change meaning"],
      "word-pairs": ["ELA.3.A2.5, ELA.3.B2.7", "new vocabulary, and words that go together"],
      "sentence-smarts": ["ELA.3.C2.2", "simple and compound sentences"],
      "fact-or-opinion": ["ELA.3.B3.2, ELA.3.B3.3", "telling fact from opinion in fiction and nonfiction"],
      "abc-dictionary": ["ELA.3.A2.5, ELA.3.B1.3", "alphabetical order and using a dictionary to learn word meanings"],
    },
    adopted: adopt(unitsOf(ontario, "language"), {
      "text-patterns": ["ELA.3.B2.1, ELA.3.B2.2, ELA.3.C2.1", "how the form and structure of texts and text features organize ideas"],
    }),
    own: [listening, sounds, wonder, plan, better, media, goals],
  }),
  course("3", "science", {
    share: {
      "grouping-living-things": ["SCI.3.E.14", "classification systems that group living things by what they have in common"],
    },
    adopted: adopt(unitsOf(ontario, "science"), {
      "forces-3": ["SCI.3.E.4, SCI.3.E.5, SCI.3.E.6, SCI.3.E.7, SCI.3.E.8", "contact and non-contact forces, and how pushes, pulls and twists change motion"],
      "structures-3": ["SCI.3.E.1, SCI.3.E.2", "what structures are for, and how materials are joined"],
      "strong-stable": ["SCI.3.E.1, SCI.3.E.3, SCI.3.D.5", "strong and stable structures, shapes in nature and building"],
      "skills-3": ["SCI.3.C.2, SCI.3.C.3, SCI.3.C.4", "measuring, doing investigations and using materials safely"],
    }),
    own: [life, speed, find, solve, careers, ways],
    order: ["skills-3", "forces-3", "mb-speed-and-motion", "structures-3", "strong-stable", "mb-needs-life-cycles", "grouping-living-things", "mb-how-scientists-find-out", "mb-solutions-and-technology", "mb-science-everywhere", "mb-ways-of-knowing"],
  }),
  course("3", "social", {
    own: [citizenship, groups, maps, communities, needs, ancient, identity, land, people, team, findOut, think],
    order: ["mb-citizenship", "mb-groups-and-leaders", "mb-world-maps", "mb-global-communities", "mb-needs-and-rights", "mb-ancient-egypt", "mb-who-i-am", "mb-living-with-the-land", "mb-contributions-and-connections", "mb-working-together", "mb-ask-and-find", "mb-think-it-through"],
  }),
  ...frenchCourses("3"),
];
