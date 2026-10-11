import type { Course } from "../types";
import { frenchCourses } from "./french";
import { course } from "./kit";
import { cells, climate, friction, weather } from "./units/g5-science";
import { measure, mental, quadrilaterals } from "./units/g5-math";
import { planning, revising, diversity, multisyllabic, reading, multimodal, talk, goals } from "./units/g5-more-language";
import { matter, natureOfScience, skills as scienceSkills } from "./units/g5-more-science";
import { maps, inquiry, together, citizenship } from "./units/g5-more-social";
import { confederation, earlyColonies, firstPeoples, furTrade, skills } from "./units/g5-social";

// Manitoba Grade 5. Math follows the Grade 5 mathematics outcomes (5.N, 5.PR, 5.SS, 5.SP), English language arts the ELA
// curriculum (strands A to D), science the Grade 5 science outcomes (SCI.5) and social studies The Mosaic of Canada
// (5-K outcomes). Units BC already has are listed with the Manitoba outcomes they practise.

export const courses: Course[] = [
  course("5", "math", {
    share: {
      "numbers-to-a-million": ["5.N.1", "representing and describing whole numbers to 1 000 000"],
      "add-and-subtract": ["5.N.2, 5.N.11", "estimation strategies, and adding and subtracting decimals"],
      multiply: ["5.N.5", "multiplying with 1- and 2-digit multipliers"],
      divide: ["5.N.6", "dividing with 1- and 2-digit divisors"],
      "equivalent-fractions": ["5.N.7", "creating sets of equivalent fractions"],
      decimals: ["5.N.8, 5.N.9, 5.N.10", "decimals to thousandths, relating them to fractions, and comparing and ordering them"],
      "patterns-and-equations": ["5.PR.1, 5.PR.2", "pattern rules, and one-step equations with a variable"],
      "area-and-perimeter": ["5.SS.1", "designing rectangles given perimeter or area"],
      "prisms-pyramids-and-moves": ["5.SS.7, 5.SS.8", "single transformations of 2-D shapes"],
      "graphs-and-chance": ["5.SP.1, 5.SP.2, 5.SP.3, 5.SP.4", "first- and second-hand data, double bar graphs, and the likelihood of outcomes"],
    },
    own: [mental, measure, quadrilaterals],
    order: ["numbers-to-a-million", "add-and-subtract", "mb-mental-math-5", "multiply", "divide", "equivalent-fractions", "decimals", "patterns-and-equations", "area-and-perimeter", "mb-measuring-5", "mb-quadrilaterals-5", "prisms-pyramids-and-moves", "graphs-and-chance"],
  }),
  course("5", "language", {
    share: {
      "reading-detectives": ["ELA.5.B2.3, ELA.5.B2.5, ELA.5.B2.6", "predicting, monitoring understanding and summarizing key ideas"],
      "plot-and-conflict": ["ELA.5.B2.1, ELA.5.B2.4", "the structure of stories, and connecting to texts"],
      "figurative-language": ["ELA.5.A2.5, ELA.5.C2.3, ELA.5.C2.4", "descriptive and figurative language"],
      "purpose-and-structure": ["ELA.5.B2.1, ELA.5.C1.4, ELA.5.C2.1", "text forms, purposes and organization patterns"],
      "context-clues": ["ELA.5.A2.5, ELA.5.B2.7", "using context to work out word meaning"],
      "word-roots": ["ELA.5.A2.4", "word parts and morphology"],
      "verb-tenses": ["ELA.5.C2.3, ELA.5.C3.4", "verb tenses in writing"],
      "complex-sentences": ["ELA.5.C2.2", "simple, compound and complex sentences"],
      "punctuation-power": ["ELA.5.C3.3, ELA.5.C3.4", "capitals, commas, colons and apostrophes"],
      "media-smarts": ["ELA.5.B3.2, ELA.5.B3.3", "bias, point of view and persuasive techniques in media"],
    },
    own: [planning, revising, diversity, multisyllabic, reading, multimodal, talk, goals],
    order: ["reading-detectives", "plot-and-conflict", "mb-read-with-purpose-5", "figurative-language", "purpose-and-structure", "context-clues", "word-roots", "mb-long-words-5", "verb-tenses", "complex-sentences", "punctuation-power", "mb-research-planning-5", "mb-multimodal-texts-5", "mb-revising-spelling-5", "mb-talk-and-listen-5", "media-smarts", "mb-diversity-bias-5", "mb-learning-goals-5"],
  }),
  course("5", "science", {
    share: {
      "digestion-and-breathing": ["SCI.5.E.17", "how the digestive and respiratory systems help keep the body healthy"],
      "heart-bones-muscles": ["SCI.5.E.17", "how the circulatory and musculoskeletal systems work with other organ systems"],
      "simple-machines": ["SCI.5.E.7", "how simple machines change the size and direction of a force"],
    },
    own: [weather, climate, cells, friction, matter, natureOfScience, scienceSkills],
    order: ["mb-matter-changes-5", "mb-cells-5", "digestion-and-breathing", "heart-bones-muscles", "mb-friction-5", "simple-machines", "mb-weather-5", "mb-climate-5", "mb-nature-of-science-5", "mb-science-skills-5"],
  }),
  course("5", "social", {
    share: {
      "immigration-multiculturalism": ["5-KI-010, 5-KI-011, 5-KG-045, 5-VI-006", "migration to Canada and the roots of its multicultural nature"],
      "regions-and-resources": ["5-KL-015, 5-VL-007", "Canada's regions, bodies of water and natural resources"],
    },
    own: [firstPeoples, earlyColonies, furTrade, confederation, skills, maps, inquiry, together, citizenship],
    order: ["mb-first-peoples-5", "mb-early-colonies-5", "mb-fur-trade-5", "mb-confederation-5", "immigration-multiculturalism", "regions-and-resources", "mb-history-skills-5", "mb-maps-and-land-5", "mb-history-inquiry-5", "mb-respectful-talk-5", "mb-citizens-and-values-5"],
  }),
  ...frenchCourses("5"),
];
