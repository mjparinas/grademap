import type { Course } from "../types";
import { courses as alberta } from "../alberta/g5";
import { courses as manitoba } from "../manitoba/g5";
import { courses as ontario } from "../ontario/g5";
import { courses as saskatchewan } from "../saskatchewan/g5";
import { courses as novaScotia } from "../nova-scotia/g5";
import { acadiaLoyalists, wabanakiConfederacy, worldviewEconomics } from "./units/g5-social";
import { frenchCourses } from "./french";
import { adopt, course, poolOf } from "./kit";

// New Brunswick Grade 5. Math follows the Grade 5 mathematics outcomes (N, PR, M, G, SP), English language arts the Grade 5 ELA
// strand outcomes (A1 to D1), science the five Grade 5 learning bundles and social studies the five Grade 5 outcomes. Units
// BC, Ontario, Alberta, Saskatchewan or Manitoba already has are listed with the New Brunswick outcomes they practise.


export const courses: Course[] = [
  course("5", "math", {
    share: {
      "numbers-to-a-million": ["Number: Number Sense", "representing and partitioning whole numbers to 1 000 000"],
      "add-and-subtract": ["Number: Operations", "estimation strategies, and adding and subtracting decimals"],
      multiply: ["Number: Operations", "mental strategies for multiplication, and two-digit by two-digit multiplication"],
      divide: ["Number: Operations", "dividing three-digit numbers by one-digit numbers, and interpreting remainders"],
      "equivalent-fractions": ["Number: Number Sense", "creating sets of equivalent fractions"],
      decimals: ["Number: Number Sense", "decimals to thousandths, relating them to fractions, and comparing and ordering them"],
      "patterns-and-equations": ["Patterns and Relations: Algebra", "pattern rules, and one-step equations with a variable"],
      "area-and-perimeter": ["Shape and Space: Measurement", "designing rectangles given perimeter or area"],
      "prisms-pyramids-and-moves": ["Shape and Space: 2-D Shapes and 3-D Objects", "edges, faces and sides, and single transformations of 2-D shapes"],
      "graphs-and-chance": ["Statistics and Probability: Data Analysis, Statistics and Probability: Chance and Uncertainty", "first- and second-hand data, double bar graphs, and the likelihood of outcomes"],
    },
    adopted: adopt(poolOf("math", manitoba, ontario, alberta), {
      "mb-mental-math-5": ["Number: Operations", "mental math strategies for multiplication and division facts"],
      "mb-measuring-5": ["Shape and Space: Measurement", "millimetres, volume and capacity"],
      "mb-quadrilaterals-5": ["Shape and Space: 2-D Shapes and 3-D Objects", "parallel and perpendicular lines and right angles in quadrilaterals"],
    }),
    order: ["numbers-to-a-million", "add-and-subtract", "mb-mental-math-5", "multiply", "divide", "equivalent-fractions", "decimals", "patterns-and-equations", "area-and-perimeter", "mb-measuring-5", "mb-quadrilaterals-5", "prisms-pyramids-and-moves", "graphs-and-chance"],
  }),
  course("5", "language", {
    share: {
      "reading-detectives": ["Reading: Reading Comprehension", "predicting, monitoring understanding and summarizing"],
      "plot-and-conflict": ["Reading: Text Analysis", "the structure of stories"],
      "figurative-language": ["Representations: Composition", "descriptive and figurative language"],
      "purpose-and-structure": ["Reading: Text Analysis", "text forms, purposes and organization patterns"],
      "context-clues": ["Reading: Vocabulary", "using context to work out word meaning"],
      "word-roots": ["Reading: Word Study", "Greek and Latin roots and word parts"],
      "verb-tenses": ["Representations: Sentence Structure", "verb tenses in writing"],
      "complex-sentences": ["Representations: Sentence Structure", "simple, compound and complex sentences"],
      "punctuation-power": ["Representations: Sentence Structure", "capitals, commas, colons and apostrophes"],
      "media-smarts": ["Reading: Text Analysis", "bias, point of view and persuasive techniques in media"],
    },
    adopted: adopt(poolOf("language", ontario, manitoba, alberta), {
      "group-talk-ab": ["Interactions: Expression", "talking and listening in a group"],
      "spelling-ab": ["Representations: Spelling", "spelling strategies"],
      "writing-audience-ab": ["Representations: Composition", "writing for a reader"],
      "style-and-perspective": ["Reading: Text Analysis", "style and perspective in texts"],
    }),
    order: ["group-talk-ab", "spelling-ab", "context-clues", "word-roots", "verb-tenses", "complex-sentences", "punctuation-power", "purpose-and-structure", "reading-detectives", "plot-and-conflict", "figurative-language", "style-and-perspective", "media-smarts", "writing-audience-ab"],
  }),
  course("5", "science", {
    share: {
      "simple-machines": ["Scientific Literacy: Sensemaking", "how simple machines change the size and direction of a force"],
      "digestion-and-breathing": ["Scientific Literacy: Sensemaking", "how the digestive and respiratory systems work"],
      "heart-bones-muscles": ["Scientific Literacy: Sensemaking", "how the circulatory and musculoskeletal systems work"],
    },
    adopted: adopt(poolOf("science", manitoba, saskatchewan, ontario, alberta), {
      "mb-weather-5": ["Scientific Literacy: Sensemaking", "weather and the water cycle"],
      "mb-friction-5": ["Scientific Literacy: Sensemaking", "forces, friction and machines"],
      "matter-changes-5": ["Scientific Literacy: Sensemaking", "physical and chemical changes"],
      "changes-of-state-5": ["Scientific Literacy: Sensemaking", "changes of state"],
    }),
    order: ["mb-weather-5", "mb-friction-5", "simple-machines", "digestion-and-breathing", "heart-bones-muscles", "changes-of-state-5", "matter-changes-5"],
  }),
  course("5", "social", {
    share: {
      "learning-from-the-past": ["History: Sources and Methods", "how historians use evidence and thinking concepts to answer questions about the past"],
    },
    adopted: adopt(poolOf("social", ontario, manitoba, novaScotia), {
    }),
    own: [wabanakiConfederacy, acadiaLoyalists, worldviewEconomics],
    order: ["learning-from-the-past", "nb-acadia-loyalists-5", "nb-wabanaki-confederacy-5", "nb-worldview-economics-5"],
  }),
  ...frenchCourses("5"),
];
