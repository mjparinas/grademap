import type { Course } from "../types";
import { courses as alberta } from "../alberta/g2";
import { courses as manitoba } from "../manitoba/g2";
import { courses as ontario } from "../ontario/g2";
import { frenchCourses } from "./french";
import { adopt, course, poolOf } from "./kit";
import { consumers, contributions, sustainableCommunities } from "./units/g2-social";

// Nova Scotia Grade 2. Math follows the Grade 2 mathematics outcomes (N, PR, M, G, SP), English language arts the Grade 2 ELA
// strand outcomes (A1 to C3), science the four Grade 2 learning bundles and social studies the four Grade 2 outcomes. Units
// BC, Ontario, Alberta or Manitoba already has are listed with the Nova Scotia outcomes they practise.

const CONSUMERS = "Investigate how decisions are made as consumers";

export const courses: Course[] = [
  course("2", "math", {
    share: {
      "tens-and-ones": ["N04, N07", "representing and partitioning numbers to 100 and place value"],
      "bigger-or-smaller": ["N05", "comparing and ordering numbers to 100"],
      "facts-to-20": ["N10", "quick recall of basic addition facts to 18 and related subtraction facts"],
      "adding-to-100": ["N08, N09", "adding and subtracting 1- and 2-digit numbers with answers to 100"],
      patterns: ["PR01, PR02", "repeating and increasing patterns"],
      measuring: ["M02, M03, M04", "measuring and comparing length and mass with non-standard units"],
      shapes: ["G01, G02, G03, G04", "sorting, naming and building 2-D shapes and 3-D objects"],
      graphs: ["SP01, SP02", "gathering data and making concrete graphs and pictographs"],
    },
    adopted: adopt(poolOf("math", manitoba, ontario, alberta), {
      "mb-skip-counting": ["N01", "saying the number sequence by 2s, 5s and 10s"],
      "mb-even-odd": ["N02", "telling whether a number is even or odd"],
      "balance-the-equation": ["PR03, PR04", "equality and inequality, and recording them with symbols"],
      "mb-calendar": ["M01", "the calendar and the relationships among days, weeks, months and years"],
    }),
    order: ["mb-skip-counting", "tens-and-ones", "bigger-or-smaller", "mb-even-odd", "facts-to-20", "adding-to-100", "patterns", "balance-the-equation", "mb-calendar", "measuring", "shapes", "graphs"],
  }),
  course("2", "language", {
    share: {
      "rhyme-time": ["A2", "recognizing rhymes and word patterns"],
      "sound-detectives": ["A2", "hearing and using sounds in words"],
      "super-sentences": ["A3, C2", "writing complete sentences"],
      "story-builders": ["B1, C2", "the parts of a story and writing one"],
      "word-power": ["A2", "building vocabulary"],
    },
    adopted: adopt(poolOf("language", ontario, manitoba, alberta), {
      "listen-and-speak-ab": ["A1", "listening and speaking with others"],
      "ask-and-answer-ab": ["A1", "asking and answering questions"],
      "grammar-2": ["A3", "nouns, verbs and describing words in sentences"],
      "build-sentences": ["A3, C2", "putting words in order to build a sentence"],
      "word-pictures": ["C2", "using describing words to paint a picture"],
      "reading-detectives": ["B2", "using strategies to understand what you read"],
      "text-features": ["B1", "using titles, headings and pictures to understand a text"],
    }),
    order: ["listen-and-speak-ab", "ask-and-answer-ab", "rhyme-time", "sound-detectives", "word-power", "grammar-2", "build-sentences", "super-sentences", "word-pictures", "text-features", "reading-detectives", "story-builders"],
  }),
  course("2", "science", {
    share: {
      "water-world": ["Earth and Space Science: Air and water in the environment", "water in the environment and how it changes"],
      "life-cycles": ["Life Science: Animal Growth and Changes", "how animals grow and change"],
      "solids-and-liquids": ["Physical Science: Liquids and solids", "the properties of solids and liquids"],
      "push-and-pull": ["Physical Science: Motion", "how pushes and pulls change an object's motion"],
    },
    adopted: adopt(poolOf("science", ontario, manitoba, alberta), {
      "air-and-water-for-life": ["Earth and Space Science: Air and water in the environment", "why living things need clean air and water"],
      "animal-life-cycles": ["Life Science: Animal Growth and Changes", "the life cycles of animals"],
      "mixtures-and-materials": ["Physical Science: Liquids and solids", "mixing and separating solids and liquids"],
    }),
    order: ["water-world", "air-and-water-for-life", "life-cycles", "animal-life-cycles", "solids-and-liquids", "mixtures-and-materials", "push-and-pull"],
  }),
  course("2", "social", {
    share: {
      "needs-and-wants": [CONSUMERS, "needs and wants, and choosing what to buy"],
    },
    adopted: adopt(poolOf("social", ontario, manitoba, alberta), {
      "then-and-now": ["Investigate change in the community", "how communities and ways of living change over time"],
    }),
    own: [contributions, consumers, sustainableCommunities],
    order: ["then-and-now", "ns-contributions-2", "needs-and-wants", "ns-consumers-2", "ns-sustainable-communities-2"],
  }),
  ...frenchCourses("2"),
];
