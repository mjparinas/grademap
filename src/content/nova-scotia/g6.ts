import type { Course } from "../types";
import { courses as alberta } from "../alberta/g6";
import { courses as manitoba } from "../manitoba/g6";
import { courses as ontario } from "../ontario/g6";
import { frenchCourses } from "./french";
import { adopt, course, poolOf } from "./kit";
import { childRights, crossCultural, traditionsBeliefs } from "./units/g6-social";

// Nova Scotia Grade 6. Math follows the Grade 6 mathematics outcomes (N, PR, M, G, SP), English language arts the Grade 6 ELA
// strand outcomes (A1 to D1), science the six Grade 6 learning bundles and social studies the six Grade 6 outcomes. Units
// BC, Ontario, Alberta or Manitoba already has are listed with the Nova Scotia outcomes they practise.

const ELECTRICITY = "Physical Science: Electricity";
const SPACE = "Earth and Space Science: Space";
const LIFE = "Life Science: Diversity of Life";
const CULTURE = "Investigate the role of culture in communities";
const GLOBAL = "Implement age appropriate actions that demonstrate responsibility as global citizens";

export const courses: Course[] = [
  course("6", "math", {
    share: {
      "thousandths-to-billions": ["N01, N02", "place value from billions to thousandths, and solving problems with whole numbers and decimals"],
      "facts-and-factors": ["N03", "factors and multiples"],
      "mixed-numbers-and-ratios": ["N04, N05", "improper fractions, mixed numbers and ratios"],
      "percents-and-budgets": ["N06", "percent as a part of 100"],
      "decimal-multiply-divide": ["N08", "multiplying and dividing decimals"],
      "patterns-and-graphs": ["PR01, PR02", "tables of values, graphs and patterns"],
      equations: ["PR03, PR04", "equations with letter variables and preservation of equality"],
      "angles-and-triangles": ["M01, M02, G01", "angles, interior angles and triangles"],
      "perimeter-and-area": ["M03", "formulas for perimeter and area"],
      "volume-and-capacity": ["M03", "volume of right rectangular prisms"],
      transformations: ["G03, G04, G06", "translations, rotations and reflections, alone and combined"],
      probability: ["SP04", "possible outcomes and probability"],
    },
    adopted: adopt(poolOf("math", manitoba, ontario, alberta), {
      "shapes-6": ["G05", "plotting points in the first quadrant of a Cartesian plane"],
      "mb-line-graphs": ["SP01, SP02", "line graphs and collecting data"],
    }),
    order: ["thousandths-to-billions", "facts-and-factors", "mixed-numbers-and-ratios", "percents-and-budgets", "decimal-multiply-divide", "patterns-and-graphs", "equations", "angles-and-triangles", "perimeter-and-area", "volume-and-capacity", "shapes-6", "transformations", "mb-line-graphs", "probability"],
  }),
  course("6", "language", {
    share: {
      "close-reading": ["B2", "reading closely for meaning"],
      "point-of-view": ["B3", "point of view and perspective"],
      "figurative-language": ["C2", "figurative language"],
      "connotation-tone": ["B2", "connotation and tone"],
      "persuasive-writing": ["C2", "writing to persuade"],
      "sources-bias": ["B3", "sources, bias and reliability"],
      agreement: ["A3", "subject-verb and pronoun agreement"],
      "sentence-repair": ["A3", "fixing run-ons, fragments and awkward sentences"],
      "commas-clauses": ["A3", "commas and clauses"],
      "roots-analogies": ["A2", "word roots and analogies"],
    },
    adopted: adopt(poolOf("language", ontario, manitoba, alberta), {
      "text-forms-6": ["B1", "text forms and features"],
    }),
    order: ["roots-analogies", "agreement", "sentence-repair", "commas-clauses", "text-forms-6", "close-reading", "connotation-tone", "point-of-view", "figurative-language", "sources-bias", "persuasive-writing"],
  }),
  course("6", "science", {
    share: {
      "solar-system": [SPACE, "the Sun, planets and moons of our solar system"],
      "galaxies-and-space": ["Earth and Space Science: Space", "galaxies and space technology"],
    },
    adopted: adopt(poolOf("science", ontario, manitoba, alberta), {
      "static-electricity-6": [ELECTRICITY, "static electricity"],
      "circuits-6": [ELECTRICITY, "electrical energy flowing through circuits and materials"],
      "flight-6": ["Physical Science: Flight", "the forces that influence flight"],
      "earth-moon-sun-6": [SPACE, "Earth, the Moon and the Sun"],
      "weight-and-space-tech-6": [SPACE, "gravity and the technology of space exploration"],
      "classifying-life-6": [LIFE, "sorting living things into groups"],
      "biodiversity-6": [LIFE, "the variety of life and how living things depend on one another"],
    }),
    order: ["static-electricity-6", "circuits-6", "flight-6", "earth-moon-sun-6", "solar-system", "galaxies-and-space", "weight-and-space-tech-6", "classifying-life-6", "biodiversity-6"],
  }),
  course("6", "social", {
    share: {
      "global-challenges": ["Compare sustainability practices between Canada and a selected country", "global challenges and sustainable choices"],
    },
    adopted: adopt(poolOf("social", ontario, manitoba, alberta), {
      "canadian-identities-6": [CULTURE, "what shapes culture and identity in Canada"],
      "global-help-6": [GLOBAL, "how people and groups help around the world"],
    }),
    own: [crossCultural, traditionsBeliefs, childRights],
    order: ["canadian-identities-6", "ns-cross-cultural-6", "global-challenges", "ns-traditions-beliefs-6", "ns-child-rights-6", "global-help-6"],
  }),
  ...frenchCourses("6"),
];
