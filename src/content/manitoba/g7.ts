import type { Course } from "../types";
import { courses as ontario } from "../ontario/g7";
import { frenchCourses } from "./french";
import { adopt, course, unitsOf } from "./kit";
import { centralTendency, divisibility, expressionsEquations } from "./units/g7-math";
import { wordRoots } from "./units/g7-language";
import { gravityTides, photosynthesis, solarSystem } from "./units/g7-science";
import { climateChange, humanRights, latLong, qualityOfLife, worldMap } from "./units/g7-social";

// Manitoba Grade 7. Math follows the Grade 7 mathematics outcomes (7.N, 7.PR, 7.SS, 7.SP), English language arts the ELA
// curriculum (strands A to D), science the Grade 7 science outcomes (SCI.7.E: matter and energy, gravity, the Solar System,
// ecosystems) and social studies Canada in the Contemporary World (7-K outcomes: global geography, human rights, quality of life).
// Units BC or Ontario already has are listed with the Manitoba outcomes they practise.

export const courses: Course[] = [
  course("7", "math", {
    share: {
      "integer-add-subtract": ["7.N.6", "adding and subtracting integers"],
      "decimal-operations": ["7.N.2", "adding, subtracting, multiplying and dividing decimals"],
      "fractions-decimals-percents": ["7.N.3, 7.N.4, 7.N.7", "percents, converting between fractions and decimals, and comparing and ordering"],
      "tax-tips-discounts": ["7.N.3", "solving problems with percents from 1% to 100%"],
      "coordinates-transformations": ["7.SS.4, 7.SS.5", "plotting points in four quadrants, and transformations of 2-D shapes"],
      "linear-relations": ["7.PR.1, 7.PR.2", "patterns and relations, tables of values and graphs"],
      "two-step-equations": ["7.PR.7", "solving linear equations of the form ax + b = c"],
      circles: ["7.SS.1, 7.SS.2", "radius, diameter and circumference, and the area of a circle"],
      "circle-graphs": ["7.SP.3", "constructing and interpreting circle graphs"],
      probability: ["7.SP.4, 7.SP.5, 7.SP.6", "probabilities as ratios, fractions and percents, sample spaces and experiments"],
    },
    adopted: adopt(unitsOf(ontario, "math"), {
      "fractions-7": ["7.N.5", "adding and subtracting positive fractions and mixed numbers"],
    }),
    own: [divisibility, centralTendency, expressionsEquations],
    order: [
      "mb-divisibility", "integer-add-subtract", "decimal-operations", "fractions-7", "fractions-decimals-percents", "tax-tips-discounts",
      "mb-expressions-equations", "linear-relations", "two-step-equations", "coordinates-transformations", "circles",
      "mb-mean-median-mode", "circle-graphs", "probability",
    ],
  }),
  course("7", "language", {
    share: {
      "close-reading": ["ELA.7.B2.5, ELA.7.B2.6", "using strategies to understand a text, and summarizing main ideas and drawing conclusions"],
      "literary-devices": ["ELA.7.B2.2, ELA.7.A2.5", "using text cues to interpret meaning, and figures of speech"],
      "tone-mood": ["ELA.7.B2.2, ELA.7.D1.1", "tone and mood in a text and in a speaker's delivery"],
      persuasion: ["ELA.7.B3.2, ELA.7.B3.3", "fact, opinion and bias, and the creator's point of view"],
      "source-check": ["ELA.7.B1.2, ELA.7.B3.2", "judging sources and telling fact from opinion"],
      "clauses-sentences": ["ELA.7.C2.2", "compound and complex sentences"],
      "modifiers-parallelism": ["ELA.7.C2.2, ELA.7.C2.5", "clear, balanced sentences"],
      "semicolons-colons-dashes": ["ELA.7.C3.4", "using a variety of punctuation"],
      "word-mix-ups": ["ELA.7.C3.2", "spelling and commonly confused words"],
      "poetry-lab": ["ELA.7.B2.1, ELA.7.B2.2", "features of poems and how they build meaning"],
    },
    adopted: adopt(unitsOf(ontario, "language"), {
      "point-of-view-7": ["ELA.7.B3.3", "the creator's point of view, such as first, second or third person"],
    }),
    own: [wordRoots],
    order: [
      "close-reading", "point-of-view-7", "literary-devices", "tone-mood", "poetry-lab", "persuasion", "source-check",
      "clauses-sentences", "modifiers-parallelism", "semicolons-colons-dashes", "mb-word-roots", "word-mix-ups",
    ],
  }),
  course("7", "science", {
    adopted: adopt(unitsOf(ontario, "science"), {
      "heat-particles-7": ["SCI.7.E.1, SCI.7.E.2, SCI.7.E.8", "the particle theory of matter, and how heat changes the motion of particles"],
      "heat-transfer-7": ["SCI.7.E.9", "conduction, convection and radiation"],
      "ecosystems-7": ["SCI.7.E.17, SCI.7.E.21", "self-sustaining ecosystems and competition for resources"],
      "food-chains-7": ["SCI.7.E.19, SCI.7.E.20", "energy transfer in food chains and the roles of organisms"],
      "cycles-succession-7": ["SCI.7.E.22", "recycling of nutrients and the replenishing of energy"],
      "human-impact-7": ["SCI.7.E.23", "effects on plants and animals when conditions change"],
    }),
    own: [gravityTides, solarSystem, photosynthesis],
    order: [
      "heat-particles-7", "heat-transfer-7", "mb-gravity-tides", "mb-solar-system", "ecosystems-7", "mb-photosynthesis",
      "food-chains-7", "cycles-succession-7", "human-impact-7",
    ],
  }),
  course("7", "social", {
    own: [latLong, worldMap, humanRights, qualityOfLife, climateChange],
    order: ["mb-latitude-longitude", "mb-world-map", "mb-human-rights", "mb-quality-of-life", "mb-climate-change"],
  }),
  ...frenchCourses("7"),
];
