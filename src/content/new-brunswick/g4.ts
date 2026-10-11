import type { Course } from "../types";
import { courses as alberta } from "../alberta/g4";
import { courses as manitoba } from "../manitoba/g4";
import { courses as ontario } from "../ontario/g4";
import { courses as novaScotia } from "../nova-scotia/g4";
import { earthResources, rocksMinerals, soils, surfaceChanges } from "./units/g4-science";
import { exploration, physicalRegions, wabanakiLands } from "./units/g4-social";
import { frenchCourses } from "./french";
import { adopt, course, poolOf } from "./kit";

// New Brunswick Grade 4. Math follows the Grade 4 mathematics outcomes (N, PR, M, G, SP), English language arts the Grade 4 ELA
// strand outcomes (A1 to D1), science the four Grade 4 learning bundles and social studies the six Grade 4 outcomes. Units
// BC, Ontario, Alberta or Manitoba already has are listed with the New Brunswick outcomes they practise.


export const courses: Course[] = [
  course("4", "math", {
    share: {
      "numbers-to-10000": ["Number: Number Sense", "representing, partitioning, comparing and ordering whole numbers to 10 000"],
      "add-subtract": ["Number: Operations", "adding and subtracting three- and four-digit numbers"],
      "times-tables": ["Number: Operations", "properties of 0 and 1 and multiplication facts to 9 × 9"],
      "multiply-divide": ["Number: Operations", "multiplying by one-digit numbers and dividing by a one-digit divisor"],
      fractions: ["Number: Number Sense", "fractions less than or equal to 1"],
      decimals: ["Number: Operations", "tenths and hundredths, relating decimals to fractions, and adding and subtracting decimals"],
      "patterns-and-tables": ["Patterns and Relations: Algebra", "patterns in tables and charts, and relationships that solve problems"],
      equations: ["Patterns and Relations: Algebra", "expressing a problem as an equation and solving one-step equations"],
      "telling-time": ["Shape and Space: Measurement", "reading and recording time on digital, analog and 24-hour clocks"],
      "polygons-and-perimeter": ["Shape and Space: 2-D Shapes and 3-D Objects", "line symmetry and polygons"],
      "graphs-and-chance": ["Statistics and Probability: Data Analysis", "many-to-one correspondence, pictographs and bar graphs"],
    },
    adopted: adopt(poolOf("math", ontario, manitoba, alberta), {
      "angles-and-area": ["Shape and Space: Measurement", "area of regular and irregular 2-D shapes"],
    }),
    order: ["numbers-to-10000", "add-subtract", "times-tables", "multiply-divide", "fractions", "decimals", "patterns-and-tables", "equations", "telling-time", "angles-and-area", "polygons-and-perimeter", "graphs-and-chance"],
  }),
  course("4", "language", {
    share: {
      "reading-detectives": ["Reading: Reading Comprehension", "using reading strategies to understand a text"],
      "text-features": ["Reading: Text Analysis", "using text features to find and understand information"],
      "figurative-language": ["Representations: Composition", "similes, metaphors and other figurative language"],
      "point-of-view": ["Reading: Text Analysis", "who is telling the story and how it changes the story"],
      "parts-of-speech": ["Representations: Sentence Structure", "nouns, verbs, adjectives and adverbs"],
      "super-sentences": ["Representations: Sentence Structure, Representations: Composition", "writing complete and interesting sentences"],
      "punctuation-power": ["Representations: Sentence Structure", "capitals, commas and quotation marks"],
      "word-builders": ["Reading: Word Study", "prefixes, suffixes and root words"],
      "sound-alikes": ["Representations: Spelling", "homophones and commonly confused words"],
      "paragraph-power": ["Representations: Composition", "writing a paragraph with a main idea and details"],
    },
    adopted: adopt(poolOf("language", ontario, manitoba, alberta), {
      "listening-speaking-ab": ["Interactions: Expression", "listening, speaking and reading aloud"],
      "sharing-information-ab": ["Interactions: Exchanges", "sharing information fairly and clearly in different subjects"],
    }),
    order: ["listening-speaking-ab", "word-builders", "sound-alikes", "parts-of-speech", "super-sentences", "punctuation-power", "text-features", "reading-detectives", "point-of-view", "figurative-language", "paragraph-power", "sharing-information-ab"],
  }),
  course("4", "science", {
    adopted: adopt(poolOf("science", ontario, manitoba, alberta, novaScotia), {
      "habitats-4": ["Learning & Living Sustainably: Responsible and Sustainable Application", "local habitats and the living things in them"],
      "food-webs-4": ["Learning & Living Sustainably: Responsible and Sustainable Application", "food chains and webs in a habitat"],
      "light-4": ["Scientific Literacy: Sensemaking", "properties of light and how light is used"],
      "sound-4": ["Scientific Literacy: Sensemaking", "how sound is made, travels and changes"],
    }),
    own: [rocksMinerals, soils, surfaceChanges, earthResources],
    order: ["nb-rocks-minerals-4", "nb-soils-4", "nb-surface-changes-4", "nb-earth-resources-4", "habitats-4", "food-webs-4", "light-4", "sound-4"],
  }),
  course("4", "social", {
    share: {
      "provinces-and-regions": ["Civics: Power and Governance", "Canada's provinces, territories and regions, and the political landscape of Canada"],
    },
    adopted: adopt(poolOf("social", ontario, manitoba, novaScotia), {
      "environment-4": ["Geography: Human Systems and Interactions", "how people use the land and are affected by the physical environment"],
    }),
    own: [wabanakiLands, physicalRegions, exploration],
    order: ["nb-physical-regions-4", "provinces-and-regions", "environment-4", "nb-wabanaki-lands-4", "nb-exploration-4"],
  }),
  ...frenchCourses("4"),
];
