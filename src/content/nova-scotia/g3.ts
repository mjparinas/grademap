import type { Course } from "../types";
import { courses as alberta } from "../alberta/g3";
import { courses as manitoba } from "../manitoba/g3";
import { courses as ontario } from "../ontario/g3";
import { frenchCourses } from "./french";
import { adopt, course, poolOf } from "./kit";
import { atlanticCanada, cultures, democracy } from "./units/g3-social";

// Nova Scotia Grade 3. Math follows the Grade 3 mathematics outcomes (N, PR, M, G, SP), English language arts the Grade 3 ELA
// strand outcomes (A1 to D1), science the four Grade 3 learning bundles and social studies the four Grade 3 outcomes. Units
// BC, Ontario, Alberta or Manitoba already has are listed with the Nova Scotia outcomes they practise.

const POSITIVE = "Implement strategies that promote positive interactions in the community";

export const courses: Course[] = [
  course("3", "math", {
    share: {
      "numbers-to-1000": ["N01, N02, N03, N04, N05", "saying, representing, comparing, estimating and placing numbers to 1000"],
      "add-subtract-1000": ["N06, N07, N08, N09", "adding and subtracting 2- and 3-digit numbers, with mental math and estimation"],
      "facts-to-20": ["N10", "quick recall of basic addition and subtraction facts"],
      multiplication: ["N11", "multiplication to 5 × 5"],
      division: ["N12", "division as sharing and grouping"],
      fractions: ["N13", "fractions as parts of a whole and of a set"],
      "patterns-and-equations": ["PR01, PR02, PR03", "increasing and decreasing patterns, and one-step equations with an unknown"],
      measuring: ["M03, M04", "measuring length in centimetres and metres and mass in grams and kilograms"],
      time: ["M01, M02", "the passage of time in minutes, hours, days, weeks, months and years"],
      "3d-objects": ["G01", "describing 3-D objects by the shape of their faces"],
      "graphs-and-chance": ["SP01, SP02", "collecting data, tally marks, line plots and bar graphs"],
    },
    adopted: adopt(poolOf("math", ontario, manitoba, alberta), {
      "area-and-perimeter-3": ["M05", "perimeter of regular, irregular and composite shapes"],
      "mb-polygons": ["G02", "naming, describing and sorting polygons"],
    }),
    order: ["numbers-to-1000", "add-subtract-1000", "facts-to-20", "multiplication", "division", "fractions", "patterns-and-equations", "time", "measuring", "area-and-perimeter-3", "3d-objects", "mb-polygons", "graphs-and-chance"],
  }),
  course("3", "language", {
    share: {
      "read-and-think": ["B2", "using reading strategies to understand a text"],
      "story-elements": ["B1, C2", "characters, setting and plot in stories"],
      "word-jobs": ["A3", "nouns, verbs and describing words"],
      "punctuation-power": ["A3", "capitals, periods, commas and quotation marks"],
      "spelling-patterns": ["A2", "spelling patterns and rules"],
      "prefixes-suffixes": ["A2", "word parts that change meaning"],
      "word-pairs": ["A2", "homophones, synonyms and antonyms"],
      "sentence-smarts": ["A3, C2", "writing complete and varied sentences"],
      "fact-or-opinion": ["B3", "telling facts from opinions"],
      "abc-dictionary": ["A2", "alphabetical order and using a dictionary"],
    },
    adopted: adopt(poolOf("language", ontario, manitoba, alberta), {
      "speak-listen-ab": ["A1", "speaking and listening with others"],
      "text-patterns": ["B1", "how different texts are organized"],
    }),
    order: ["speak-listen-ab", "spelling-patterns", "prefixes-suffixes", "word-pairs", "abc-dictionary", "word-jobs", "sentence-smarts", "punctuation-power", "text-patterns", "read-and-think", "story-elements", "fact-or-opinion"],
  }),
  course("3", "science", {
    adopted: adopt(poolOf("science", ontario, manitoba, alberta), {
      "plant-parts": ["Life Science: Plants", "plant parts and what plants need"],
      "plant-life": ["Life Science: Plants", "how plants grow and change"],
      "forces-3": ["Physical Science: Invisible Forces", "forces that act without touching"],
      "structures-3": ["Physical Science: Structures", "structures and their jobs"],
      "strong-stable": ["Physical Science: Structures", "what makes a structure strong and stable"],
    }),
  }),
  course("3", "social", {
    share: {
      "maps-and-globes": ["Investigate the location of Nova Scotia in Atlantic Canada", "using maps and globes to find places"],
    },
    adopted: adopt(poolOf("social", ontario, manitoba, alberta), {
      "mb-groups-and-leaders": [POSITIVE, "groups, leaders and getting along"],
    }),
    own: [atlanticCanada, cultures, democracy],
    order: ["maps-and-globes", "ns-atlantic-canada-3", "ns-cultures-3", "mb-groups-and-leaders", "ns-democracy-3"],
  }),
  ...frenchCourses("3"),
];
