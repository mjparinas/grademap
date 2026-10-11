import type { Course } from "../types";
import { courses as alberta } from "../alberta/g3";
import { courses as manitoba } from "../manitoba/g3";
import { courses as ontario } from "../ontario/g3";
import { habitatsNb, livingThings, weatherClimate } from "./units/g3-science";
import { citizens, governmentNb, ourProvince, peoplesOfNb, resources, treaties, wabanakiNations } from "./units/g3-social";
import { frenchCourses } from "./french";
import { adopt, course, poolOf } from "./kit";

// New Brunswick Grade 3. Math follows the Grade 3 mathematics outcomes (N, PR, M, G, SP), English language arts the Grade 3 ELA
// strand outcomes (A1 to D1), science the four Grade 3 learning bundles and social studies the four Grade 3 outcomes. Units
// BC, Ontario, Alberta or Manitoba already has are listed with the New Brunswick outcomes they practise.


export const courses: Course[] = [
  course("3", "math", {
    share: {
      "numbers-to-1000": ["Number: Operations", "saying, representing, comparing, estimating and placing numbers to 1000"],
      "add-subtract-1000": ["Number: Operations", "adding and subtracting 2- and 3-digit numbers, with mental math and estimation"],
      "facts-to-20": ["Number: Operations", "quick recall of basic addition and subtraction facts"],
      multiplication: ["Number: Operations", "multiplication to 5 × 5"],
      division: ["Number: Number Sense", "division as sharing and grouping"],
      fractions: ["Number: Number Sense", "fractions as parts of a whole and of a set"],
      "patterns-and-equations": ["Patterns and Relations: Algebra", "increasing and decreasing patterns, and one-step equations with an unknown"],
      measuring: ["Shape and Space: Measurement", "measuring length in centimetres and metres and mass in grams and kilograms"],
      time: ["Shape and Space: Measurement", "the passage of time in minutes, hours, days, weeks, months and years"],
      "3d-objects": ["Shape and Space: 2-D Shapes and 3-D Objects", "describing 3-D objects by the shape of their faces"],
      "graphs-and-chance": ["Statistics and Probability: Data Analysis", "collecting data, tally marks, line plots and bar graphs"],
    },
    adopted: adopt(poolOf("math", ontario, manitoba, alberta), {
      "area-and-perimeter-3": ["Shape and Space: Measurement", "perimeter of regular, irregular and composite shapes"],
      "mb-polygons": ["Shape and Space: 2-D Shapes and 3-D Objects", "naming, describing and sorting polygons"],
    }),
    order: ["numbers-to-1000", "add-subtract-1000", "facts-to-20", "multiplication", "division", "fractions", "patterns-and-equations", "time", "measuring", "area-and-perimeter-3", "3d-objects", "mb-polygons", "graphs-and-chance"],
  }),
  course("3", "language", {
    share: {
      "read-and-think": ["Reading: Reading Comprehension", "using reading strategies to understand a text"],
      "story-elements": ["Reading: Text Analysis, Representations: Composition", "characters, setting and plot in stories"],
      "word-jobs": ["Representations: Sentence Structure", "nouns, verbs and describing words"],
      "punctuation-power": ["Representations: Sentence Structure", "capitals, periods, commas and quotation marks"],
      "spelling-patterns": ["Representations: Spelling", "spelling patterns and rules"],
      "prefixes-suffixes": ["Reading: Word Study", "word parts that change meaning"],
      "word-pairs": ["Representations: Spelling", "homophones, synonyms and antonyms"],
      "sentence-smarts": ["Representations: Sentence Structure, Representations: Composition", "writing complete and varied sentences"],
      "fact-or-opinion": ["Reading: Text Analysis", "telling facts from opinions"],
      "abc-dictionary": ["Representations: Spelling", "alphabetical order and using a dictionary"],
    },
    adopted: adopt(poolOf("language", ontario, manitoba, alberta), {
      "speak-listen-ab": ["Interactions: Expression", "speaking and listening with others"],
      "text-patterns": ["Reading: Text Analysis", "how different texts are organized"],
    }),
    order: ["speak-listen-ab", "spelling-patterns", "prefixes-suffixes", "word-pairs", "abc-dictionary", "word-jobs", "sentence-smarts", "punctuation-power", "text-patterns", "read-and-think", "story-elements", "fact-or-opinion"],
  }),
  course("3", "science", {
    adopted: adopt(poolOf("science", ontario, manitoba, alberta), {
      "plant-parts": ["Scientific Literacy: Sensemaking", "plant parts and what plants need"],
      "plant-life": ["Scientific Literacy: Sensemaking", "how plants grow and change"],
      "forces-3": ["Scientific Literacy: Sensemaking", "forces that act without touching"],
      "structures-3": ["Scientific Literacy: Sensemaking", "structures and their jobs"],
      "strong-stable": ["Scientific Literacy: Sensemaking", "what makes a structure strong and stable"],
    }),
    own: [weatherClimate, habitatsNb, livingThings],
    order: ["nb-weather-climate-3", "nb-habitats-3", "plant-parts", "plant-life", "nb-living-things-3", "forces-3", "structures-3", "strong-stable"],
  }),
  course("3", "social", {
    share: {
      "maps-and-globes": ["Geography: Methods and Tools", "using maps and globes to find places"],
    },
    adopted: adopt(poolOf("social", manitoba), {
      "mb-groups-and-leaders": ["Civics: Power and Governance", "groups, leaders and getting along"],
    }),
    own: [ourProvince, wabanakiNations, peoplesOfNb, governmentNb, citizens, treaties, resources],
    order: ["maps-and-globes", "nb-our-province-3", "nb-wabanaki-nations-3", "nb-peoples-3", "mb-groups-and-leaders", "nb-government-3", "nb-citizens-3", "nb-treaties-3", "nb-resources-3"],
  }),
  ...frenchCourses("3"),
];
