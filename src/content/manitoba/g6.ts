import type { Course } from "../types";
import { courses as ontario } from "../ontario/g6";
import { frenchCourses } from "./french";
import { adopt, course, unitsOf } from "./kit";
import { integers, lineGraphs } from "./units/g6-math";
import { buoyancy, heredity, storedEnergy } from "./units/g6-science";
import { capitalsSpelling, learning, mediaBias, textFeatures, writingPlan } from "./units/g6-more-language";
import { electricalSafety, measurement, scienceWorks, species } from "./units/g6-more-science";
import { canadaMap, citizens, fairness, historySkills, identity, industry, since1945 } from "./units/g6-more-social";
import { canadaToday, confederation, depression, government, homesteads, railway, treaties, worldWarOne } from "./units/g6-social";

// Manitoba Grade 6. Math follows the Grade 6 mathematics outcomes (6.N, 6.PR, 6.SS, 6.SP), English language arts the ELA
// curriculum (strands A to D), science the Grade 6 outcomes (SCI.6: forces, energy and electricity, Earth and Sun, living things)
// and social studies Canada: A Country of Change (1867 to the present). Units BC or Ontario already has are listed with the
// Manitoba outcomes they practise.

export const courses: Course[] = [
  course("6", "math", {
    share: {
      "thousandths-to-billions": ["6.N.1", "place value for numbers greater than one million, reading, writing and comparing large numbers"],
      "facts-and-factors": ["6.N.3", "factors and multiples, prime and composite numbers"],
      "mixed-numbers-and-ratios": ["6.N.4, 6.N.5", "improper fractions and mixed numbers, and ratio"],
      "decimal-multiply-divide": ["6.N.8", "multiplying and dividing decimals by one-digit whole numbers"],
      "percents-and-budgets": ["6.N.6", "percent as a part of 100, and using percent in everyday situations"],
      "patterns-and-graphs": ["6.PR.1, 6.PR.2", "relationships in tables of values, and patterns shown with graphs and tables"],
      equations: ["6.N.9, 6.PR.3, 6.PR.4", "order of operations, equations with letter variables, and keeping equations balanced"],
      "perimeter-and-area": ["6.SS.3", "perimeter of polygons and area of rectangles"],
      "angles-and-triangles": ["6.SS.1, 6.SS.2, 6.SS.4", "angles, the angle sum of triangles and quadrilaterals, and types of triangles"],
      "volume-and-capacity": ["6.SS.3", "volume of right rectangular prisms"],
      transformations: ["6.SS.6, 6.SS.7, 6.SS.8, 6.SS.9", "transformations and plotting points in the first quadrant"],
      probability: ["6.SP.4", "possible outcomes and probability of an event"],
    },
    own: [integers, lineGraphs],
    order: [
      "thousandths-to-billions", "facts-and-factors", "mixed-numbers-and-ratios", "decimal-multiply-divide", "percents-and-budgets", "mb-integers",
      "equations", "patterns-and-graphs", "perimeter-and-area", "angles-and-triangles", "volume-and-capacity", "transformations", "mb-line-graphs", "probability",
    ],
  }),
  course("6", "language", {
    share: {
      "close-reading": ["ELA.6.B2.3, ELA.6.B2.5, ELA.6.B2.6", "making predictions, checking understanding and summarizing key ideas"],
      "point-of-view": ["ELA.6.B3.3", "how the point of view chosen by the text creator shapes a text"],
      "figurative-language": ["ELA.6.C2.3, ELA.6.B2.1", "figurative language, vivid verbs and specific nouns"],
      "connotation-tone": ["ELA.6.C2.4, ELA.6.A2.5", "word choice, tone and the feeling of words"],
      "persuasive-writing": ["ELA.6.C1.4, ELA.6.D1.3", "persuasive writing and presenting ideas to persuade"],
      "sources-bias": ["ELA.6.B3.2, ELA.6.B1.4", "bias in sources, and checking information"],
      agreement: ["ELA.6.C3.4, ELA.6.C2.2", "subject-verb agreement in sentences"],
      "sentence-repair": ["ELA.6.C2.2, ELA.6.C2.5", "fixing fragments and run-ons when revising"],
      "commas-clauses": ["ELA.6.C3.4, ELA.6.C2.2", "commas and clauses in simple, compound and complex sentences"],
      "roots-analogies": ["ELA.6.A2.4, ELA.6.A2.5", "word parts, roots and relationships between words"],
    },
    own: [textFeatures, writingPlan, capitalsSpelling, mediaBias, learning],
    order: [
      "mb-reading-and-learning-strategies", "close-reading", "mb-text-features-forms", "point-of-view", "figurative-language", "connotation-tone", "roots-analogies",
      "mb-media-and-bias", "sources-bias", "mb-planning-and-organizing", "persuasive-writing", "agreement", "commas-clauses", "sentence-repair", "mb-capitals-and-spelling",
    ],
  }),
  course("6", "science", {
    share: {
      "forces-at-work": ["SCI.6.E.1, SCI.6.E.2", "gravity, weight and forces such as friction that act against motion"],
      "galaxies-and-space": ["SCI.6.E.11", "the Sun as a star among billions of others in our galaxy"],
    },
    adopted: adopt(unitsOf(ontario, "science"), {
      "flight-6": ["SCI.6.E.2", "lift and other forces that oppose gravity"],
      "circuits-6": ["SCI.6.E.6", "how electricity flows in battery-powered circuits"],
      "earth-moon-sun-6": ["SCI.6.E.8, SCI.6.E.9, SCI.6.E.10", "Earth's rotation and tilt, day and night, and the seasons"],
      "classifying-life-6": ["SCI.6.E.14", "the variety of organisms and how they are grouped"],
      "science-skills-6": ["SCI.6.C.3, SCI.6.D.5", "planning fair tests, safety and solving design problems"],
    }),
    own: [buoyancy, storedEnergy, heredity, scienceWorks, measurement, electricalSafety, species],
    order: [
      "science-skills-6", "mb-how-science-works", "mb-scientific-measurement", "forces-at-work", "mb-buoyancy", "flight-6", "mb-stored-energy", "circuits-6", "mb-electrical-safety",
      "earth-moon-sun-6", "galaxies-and-space", "mb-heredity-and-fossils", "classifying-life-6", "mb-species-and-hybrids",
    ],
  }),
  course("6", "social", {
    share: {
      "map-skills": ["6-S-205, 6-S-206, 6-S-207", "reading maps, and using latitude and longitude"],
      "governments-and-rights": ["6-KC-004, 6-KC-005", "democracy and the rights in the Canadian Charter"],
    },
    adopted: adopt(unitsOf(ontario, "social"), {
      "inquiry-6": ["6-S-202, 6-S-304, 6-S-306", "primary and secondary sources, fact and opinion, and checking sources"],
      "canada-and-world-6": ["6-KG-045, 6-KG-047", "Canada's part in the United Nations and other world organizations"],
    }),
    own: [confederation, treaties, homesteads, railway, worldWarOne, depression, canadaToday, government, canadaMap, since1945, industry, citizens, identity, fairness, historySkills],
    order: [
      "mb-confederation", "mb-treaties-and-resistance", "mb-newcomers-and-homesteads", "mb-railway-and-gold", "mb-first-world-war-and-1919",
      "mb-depression-and-second-world-war", "mb-canada-today", "mb-government-and-democracy", "mb-rights-then-and-now", "governments-and-rights", "mb-canada-since-1945", "canada-and-world-6", "mb-industry-and-technology", "mb-identity-and-organizations", "mb-fairness-and-respect", "map-skills", "mb-canada-map-and-landforms", "inquiry-6", "mb-history-research-skills",
    ],
  }),
  ...frenchCourses("6"),
];
