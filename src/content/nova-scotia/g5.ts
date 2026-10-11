import type { Course } from "../types";
import { courses as alberta } from "../alberta/g5";
import { courses as manitoba } from "../manitoba/g5";
import { courses as ontario } from "../ontario/g5";
import { courses as saskatchewan } from "../saskatchewan/g5";
import { frenchCourses } from "./french";
import { adopt, course, poolOf } from "./kit";
import { atlanticInteractions, decisionMaking } from "./units/g5-social";

// Nova Scotia Grade 5. Math follows the Grade 5 mathematics outcomes (N, PR, M, G, SP), English language arts the Grade 5 ELA
// strand outcomes (A1 to D1), science the five Grade 5 learning bundles and social studies the five Grade 5 outcomes. Units
// BC, Ontario, Alberta, Saskatchewan or Manitoba already has are listed with the Nova Scotia outcomes they practise.

const WEATHER = "Earth and Space Science: Weather";
const MATTER = "Physical Science: Chemical and Physical Properties";
const BODY = "Life Science: Healthy Body";
const ANCIENT = "Investigate how environment influenced the development of an ancient society";

export const courses: Course[] = [
  course("5", "math", {
    share: {
      "numbers-to-a-million": ["N01", "representing and partitioning whole numbers to 1 000 000"],
      "add-and-subtract": ["N02, N11", "estimation strategies, and adding and subtracting decimals"],
      multiply: ["N04, N05", "mental strategies for multiplication, and two-digit by two-digit multiplication"],
      divide: ["N06", "dividing three-digit numbers by one-digit numbers, and interpreting remainders"],
      "equivalent-fractions": ["N07", "creating sets of equivalent fractions"],
      decimals: ["N08, N09, N10", "decimals to thousandths, relating them to fractions, and comparing and ordering them"],
      "patterns-and-equations": ["PR01, PR02", "pattern rules, and one-step equations with a variable"],
      "area-and-perimeter": ["M01", "designing rectangles given perimeter or area"],
      "prisms-pyramids-and-moves": ["G01, G03", "edges, faces and sides, and single transformations of 2-D shapes"],
      "graphs-and-chance": ["SP01, SP02, SP03, SP04", "first- and second-hand data, double bar graphs, and the likelihood of outcomes"],
    },
    adopted: adopt(poolOf("math", manitoba, ontario, alberta), {
      "mb-mental-math-5": ["N03", "mental math strategies for multiplication and division facts"],
      "mb-measuring-5": ["M02, M03, M04", "millimetres, volume and capacity"],
      "mb-quadrilaterals-5": ["G01, G05", "parallel and perpendicular lines and right angles in quadrilaterals"],
    }),
    order: ["numbers-to-a-million", "add-and-subtract", "mb-mental-math-5", "multiply", "divide", "equivalent-fractions", "decimals", "patterns-and-equations", "area-and-perimeter", "mb-measuring-5", "mb-quadrilaterals-5", "prisms-pyramids-and-moves", "graphs-and-chance"],
  }),
  course("5", "language", {
    share: {
      "reading-detectives": ["B2", "predicting, monitoring understanding and summarizing"],
      "plot-and-conflict": ["B1", "the structure of stories"],
      "figurative-language": ["C2", "descriptive and figurative language"],
      "purpose-and-structure": ["B1", "text forms, purposes and organization patterns"],
      "context-clues": ["A2", "using context to work out word meaning"],
      "word-roots": ["A2", "Greek and Latin roots and word parts"],
      "verb-tenses": ["A3", "verb tenses in writing"],
      "complex-sentences": ["A3", "simple, compound and complex sentences"],
      "punctuation-power": ["A3", "capitals, commas, colons and apostrophes"],
      "media-smarts": ["B3", "bias, point of view and persuasive techniques in media"],
    },
    adopted: adopt(poolOf("language", ontario, manitoba, alberta), {
      "group-talk-ab": ["A1", "talking and listening in a group"],
      "spelling-ab": ["A2", "spelling strategies"],
      "writing-audience-ab": ["C1", "writing for a reader"],
      "style-and-perspective": ["B3", "style and perspective in texts"],
    }),
    order: ["group-talk-ab", "spelling-ab", "context-clues", "word-roots", "verb-tenses", "complex-sentences", "punctuation-power", "purpose-and-structure", "reading-detectives", "plot-and-conflict", "figurative-language", "style-and-perspective", "media-smarts", "writing-audience-ab"],
  }),
  course("5", "science", {
    share: {
      "simple-machines": ["Physical Science: Forces and Simple Machines", "how simple machines change the size and direction of a force"],
      "digestion-and-breathing": [BODY, "how the digestive and respiratory systems work"],
      "heart-bones-muscles": [BODY, "how the circulatory and musculoskeletal systems work"],
    },
    adopted: adopt(poolOf("science", manitoba, saskatchewan, ontario, alberta), {
      "mb-weather-5": [WEATHER, "weather and the water cycle"],
      "mb-friction-5": ["Physical Science: Forces and Simple Machines", "forces, friction and machines"],
      "matter-changes-5": [MATTER, "physical and chemical changes"],
      "changes-of-state-5": [MATTER, "changes of state"],
    }),
    order: ["mb-weather-5", "mb-friction-5", "simple-machines", "digestion-and-breathing", "heart-bones-muscles", "changes-of-state-5", "matter-changes-5"],
  }),
  course("5", "social", {
    share: {
      "learning-from-the-past": ["Investigate how we learn about the past", "how historians and archaeologists use evidence"],
    },
    adopted: adopt(poolOf("social", ontario, manitoba, alberta), {
      "environment-ab": [ANCIENT, "how land and water shaped an ancient society"],
      "rise-and-fall-ab": [ANCIENT, "how ancient societies grew and declined"],
    }),
    own: [decisionMaking, atlanticInteractions],
    order: ["learning-from-the-past", "environment-ab", "rise-and-fall-ab", "ns-decision-making-5", "ns-atlantic-interactions-5"],
  }),
  ...frenchCourses("5"),
];
