import type { Course } from "../types";
import { courses as alberta } from "../alberta/g4";
import { courses as manitoba } from "../manitoba/g4";
import { courses as ontario } from "../ontario/g4";
import { frenchCourses } from "./french";
import { adopt, course, poolOf } from "./kit";
import { interconnectedHabitats } from "./units/g4-science";
import { exploration, explorationImpacts, explorers } from "./units/g4-social";

// Nova Scotia Grade 4. Math follows the Grade 4 mathematics outcomes (N, PR, M, G, SP), English language arts the Grade 4 ELA
// strand outcomes (A1 to D1), science the four Grade 4 learning bundles and social studies the six Grade 4 outcomes. Units
// BC, Ontario, Alberta or Manitoba already has are listed with the Nova Scotia outcomes they practise.

const HABITAT = "Life Science: Habitat";
const HUMANS = "Investigate the relationships between humans and the physical environment";
const POLITICAL = "Investigate the political landscape of Canada";

export const courses: Course[] = [
  course("4", "math", {
    share: {
      "numbers-to-10000": ["N01, N02", "representing, partitioning, comparing and ordering whole numbers to 10 000"],
      "add-subtract": ["N03", "adding and subtracting three- and four-digit numbers"],
      "times-tables": ["N04, N05", "properties of 0 and 1 and multiplication facts to 9 × 9"],
      "multiply-divide": ["N06, N07", "multiplying by one-digit numbers and dividing by a one-digit divisor"],
      fractions: ["N08", "fractions less than or equal to 1"],
      decimals: ["N09, N10, N11", "tenths and hundredths, relating decimals to fractions, and adding and subtracting decimals"],
      "patterns-and-tables": ["PR01, PR02, PR03, PR04", "patterns in tables and charts, and relationships that solve problems"],
      equations: ["PR05, PR06", "expressing a problem as an equation and solving one-step equations"],
      "telling-time": ["M01", "reading and recording time on digital, analog and 24-hour clocks"],
      "polygons-and-perimeter": ["G03", "line symmetry and polygons"],
      "graphs-and-chance": ["SP01, SP02", "many-to-one correspondence, pictographs and bar graphs"],
    },
    adopted: adopt(poolOf("math", ontario, manitoba, alberta), {
      "angles-and-area": ["M03", "area of regular and irregular 2-D shapes"],
    }),
    order: ["numbers-to-10000", "add-subtract", "times-tables", "multiply-divide", "fractions", "decimals", "patterns-and-tables", "equations", "telling-time", "angles-and-area", "polygons-and-perimeter", "graphs-and-chance"],
  }),
  course("4", "language", {
    share: {
      "reading-detectives": ["B2", "using reading strategies to understand a text"],
      "text-features": ["B1", "using text features to find and understand information"],
      "figurative-language": ["C2", "similes, metaphors and other figurative language"],
      "point-of-view": ["B3", "who is telling the story and how it changes the story"],
      "parts-of-speech": ["A3", "nouns, verbs, adjectives and adverbs"],
      "super-sentences": ["A3, C2", "writing complete and interesting sentences"],
      "punctuation-power": ["A3", "capitals, commas and quotation marks"],
      "word-builders": ["A2", "prefixes, suffixes and root words"],
      "sound-alikes": ["A2", "homophones and commonly confused words"],
      "paragraph-power": ["C2", "writing a paragraph with a main idea and details"],
    },
    adopted: adopt(poolOf("language", ontario, manitoba, alberta), {
      "listening-speaking-ab": ["A1", "listening, speaking and reading aloud"],
      "sharing-information-ab": ["D1", "sharing information fairly and clearly in different subjects"],
    }),
    order: ["listening-speaking-ab", "word-builders", "sound-alikes", "parts-of-speech", "super-sentences", "punctuation-power", "text-features", "reading-detectives", "point-of-view", "figurative-language", "paragraph-power", "sharing-information-ab"],
  }),
  course("4", "science", {
    adopted: adopt(poolOf("science", ontario, manitoba, alberta), {
      "habitats-4": [HABITAT, "local habitats and the living things in them"],
      "food-webs-4": [HABITAT, "food chains and webs in a habitat"],
      "light-4": ["Physical Science: Light", "properties of light and how light is used"],
      "sound-4": ["Physical Science: Sound", "how sound is made, travels and changes"],
    }),
    own: [interconnectedHabitats],
    order: ["habitats-4", "food-webs-4", "ns-interconnected-habitats-4", "light-4", "sound-4"],
  }),
  course("4", "social", {
    share: {
      "provinces-and-regions": [POLITICAL, "Canada's provinces, territories and regions"],
    },
    adopted: adopt(poolOf("social", ontario, manitoba, alberta), {
      "environment-4": [HUMANS, "how people use and are affected by the land"],
    }),
    own: [exploration, explorers, explorationImpacts],
    order: ["ns-exploration-4", "ns-explorers-4", "ns-exploration-impacts-4", "environment-4", "provinces-and-regions"],
  }),
  ...frenchCourses("4"),
];
