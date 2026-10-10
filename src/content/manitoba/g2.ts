import type { Course } from "../types";
import { courses as ontario } from "../ontario/g2";
import { frenchCourses } from "./french";
import { adopt, course, unitsOf } from "./kit";
import { calendar, evenOdd, skipCounting } from "./units/g2-math";
import { airAndWeather, foodAndEnergy } from "./units/g2-science";
import { leaders, resources, symbols } from "./units/g2-social";

// Manitoba Grade 2. Math follows the Grade 2 mathematics outcomes (2.N, 2.PR, 2.SS, 2.SP), English language arts the ELA
// curriculum (strands A to D), science the Grade 2 outcomes (SCI.2) and social studies Our Community and Canada's communities
// (2-K outcomes). Units BC or Ontario already has are listed with the Manitoba outcomes they practise.

export const courses: Course[] = [
  course("2", "math", {
    share: {
      "tens-and-ones": ["2.N.4, 2.N.7", "representing numbers to 100 and the meaning of place value"],
      "bigger-or-smaller": ["2.N.5, 2.N.6", "comparing and ordering numbers to 100, and estimating"],
      "facts-to-20": ["2.N.9, 2.N.10", "addition and subtraction facts and mental math strategies"],
      "adding-to-100": ["2.N.8, 2.N.9", "adding and subtracting 1- and 2-digit numbers"],
      patterns: ["2.RR.1, 2.PR.2", "repeating and increasing patterns"],
      measuring: ["2.SS.2, 2.SS.3, 2.SS.4", "measuring length with non-standard units"],
      shapes: ["2.SS.6, 2.SS.7, 2.SS.8, 2.SS.9", "sorting and describing 2-D shapes and 3-D objects"],
      graphs: ["2.SP.1, 2.SP.2", "gathering data and reading concrete graphs and pictographs"],
    },
    adopted: adopt(unitsOf(ontario, "math"), {
      "balance-the-equation": ["2.PR.3, 2.PR.4", "equality and inequality, and recording them with symbols"],
    }),
    own: [skipCounting, evenOdd, calendar],
    order: ["mb-skip-counting", "mb-even-odd", "tens-and-ones", "bigger-or-smaller", "facts-to-20", "adding-to-100", "balance-the-equation", "patterns", "mb-calendar", "measuring", "shapes", "graphs"],
  }),
  course("2", "language", {
    share: {
      "rhyme-time": ["ELA.2.A2.1, ELA.2.A2.3", "sounds in words, and rhyme"],
      "sound-detectives": ["ELA.2.A2.1, ELA.2.A2.3, ELA.2.C3.2", "reading and spelling words with common sound patterns"],
      "super-sentences": ["ELA.2.C2.2, ELA.2.C3.3, ELA.2.C3.4", "complete sentences with capitals and end marks"],
      "story-builders": ["ELA.2.B2.6, ELA.2.C2.1", "story parts and retelling"],
      "word-power": ["ELA.2.A2.4, ELA.2.A2.5", "building vocabulary and word parts"],
    },
    adopted: adopt(unitsOf(ontario, "language"), {
      "build-sentences": ["ELA.2.C2.2, ELA.2.C2.3", "simple and compound sentences with precise words"],
      "word-pictures": ["ELA.2.C2.3, ELA.2.C2.4", "descriptive word choice"],
      "reading-detectives": ["ELA.2.B2.3, ELA.2.B2.5, ELA.2.B2.6", "predicting, using strategies and recalling information"],
      "text-features": ["ELA.2.B2.1, ELA.2.B2.2", "forms of texts and text features"],
    }),
  }),
  course("2", "science", {
    share: {
      "solids-and-liquids": ["SCI.2.E.1, SCI.2.E.2", "states of matter and changes of state"],
      "water-world": ["SCI.2.E.4, SCI.2.E.5", "the role of water in Earth's environment and the movement of water"],
      "life-cycles": ["SCI.2.E.10", "plants and animals produce offspring that resemble them"],
    },
    adopted: adopt(unitsOf(ontario, "science"), {
      "think-like-a-scientist": ["SCI.2.D.1, SCI.2.C.3", "asking questions about the world and trying ways to answer them"],
      "air-and-water-for-life": ["SCI.2.E.6", "air and water are essential to life"],
    }),
    own: [airAndWeather, foodAndEnergy],
    order: ["think-like-a-scientist", "solids-and-liquids", "water-world", "mb-air-and-weather", "air-and-water-for-life", "mb-food-and-energy", "life-cycles"],
  }),
  course("2", "social", {
    share: {
      "needs-and-wants": ["2-KE-038, 2-KE-036", "needs common to all Canadians, and goods produced in communities"],
      "communities-in-canada": ["2-KI-012, 2-KE-037, 2-KL-023", "features and work in Canadian communities, and where they are on a map"],
      "caring-citizens": ["2-KL-022, 2-S-103", "caring for the environment and for shared places"],
    },
    adopted: adopt(unitsOf(ontario, "social"), {
      "then-and-now": ["2-KH-026, 2-S-204", "how life in communities has changed over time"],
      "globe-and-continents": ["2-KL-024, 2-KG-031", "finding Canada on a globe, and Canada as one of many countries"],
    }),
    own: [leaders, symbols, resources],
    order: ["mb-leaders-and-rights", "mb-canada-symbols", "communities-in-canada", "mb-natural-resources", "then-and-now", "globe-and-continents", "needs-and-wants", "caring-citizens"],
  }),
  ...frenchCourses("2"),
];
