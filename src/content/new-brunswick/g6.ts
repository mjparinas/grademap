import type { Course } from "../types";
import { courses as alberta } from "../alberta/g6";
import { courses as manitoba } from "../manitoba/g6";
import { courses as ontario } from "../ontario/g6";
import { courses as novaScotia } from "../nova-scotia/g6";
import { atlanticEconomy, atlanticRegion } from "./units/g6-social";
import { senses, technicalSensors } from "./units/g6-science";
import { frenchCourses } from "./french";
import { adopt, course, poolOf } from "./kit";

// New Brunswick Grade 6. Math follows the Grade 6 mathematics outcomes (N, PR, M, G, SP), English language arts the Grade 6 ELA
// strand outcomes (A1 to D1), science the six Grade 6 learning bundles and social studies the six Grade 6 outcomes. Units
// BC, Ontario, Alberta or Manitoba already has are listed with the New Brunswick outcomes they practise.


export const courses: Course[] = [
  course("6", "math", {
    share: {
      "thousandths-to-billions": ["Number: Number Sense", "place value from billions to thousandths, and solving problems with whole numbers and decimals"],
      "facts-and-factors": ["Number: Operations", "factors and multiples"],
      "mixed-numbers-and-ratios": ["Number: Number Sense", "improper fractions, mixed numbers and ratios"],
      "percents-and-budgets": ["Number: Number Sense", "percent as a part of 100"],
      "decimal-multiply-divide": ["Number: Operations", "multiplying and dividing decimals"],
      "patterns-and-graphs": ["Patterns and Relations: Algebra", "tables of values, graphs and patterns"],
      equations: ["Patterns and Relations: Algebra", "equations with letter variables and preservation of equality"],
      "angles-and-triangles": ["Shape and Space: Measurement, Shape and Space: 2-D Shapes and 3-D Objects", "angles, interior angles and triangles"],
      "perimeter-and-area": ["Shape and Space: Measurement", "formulas for perimeter and area"],
      "volume-and-capacity": ["Shape and Space: Measurement", "volume of right rectangular prisms"],
      transformations: ["Shape and Space: 2-D Shapes and 3-D Objects", "translations, rotations and reflections, alone and combined"],
      probability: ["Statistics and Probability: Chance and Uncertainty", "possible outcomes and probability"],
    },
    adopted: adopt(poolOf("math", manitoba, ontario, alberta), {
      "shapes-6": ["Shape and Space: 2-D Shapes and 3-D Objects", "plotting points in the first quadrant of a Cartesian plane"],
      "mb-line-graphs": ["Statistics and Probability: Data Analysis", "line graphs and collecting data"],
    }),
    order: ["thousandths-to-billions", "facts-and-factors", "mixed-numbers-and-ratios", "percents-and-budgets", "decimal-multiply-divide", "patterns-and-graphs", "equations", "angles-and-triangles", "perimeter-and-area", "volume-and-capacity", "shapes-6", "transformations", "mb-line-graphs", "probability"],
  }),
  course("6", "language", {
    share: {
      "close-reading": ["Reading: Reading Comprehension", "reading closely for meaning"],
      "point-of-view": ["Reading: Text Analysis and Criticality", "point of view and perspective"],
      "figurative-language": ["Representing: Craft", "figurative language"],
      "connotation-tone": ["Reading: Reading Comprehension", "connotation and tone"],
      "persuasive-writing": ["Representing: Craft", "writing to persuade"],
      "sources-bias": ["Reading: Text Analysis and Criticality", "sources, bias and reliability"],
      agreement: ["Representing: Craft", "subject-verb and pronoun agreement"],
      "sentence-repair": ["Representing: Craft", "fixing run-ons, fragments and awkward sentences"],
      "commas-clauses": ["Representing: Craft", "commas and clauses"],
      "roots-analogies": ["Reading: Word Study", "word roots and analogies"],
    },
    adopted: adopt(poolOf("language", ontario, manitoba, alberta), {
      "text-forms-6": ["Reading: Text Analysis and Criticality", "text forms and features"],
    }),
    order: ["roots-analogies", "agreement", "sentence-repair", "commas-clauses", "text-forms-6", "close-reading", "connotation-tone", "point-of-view", "figurative-language", "sources-bias", "persuasive-writing"],
  }),
  course("6", "science", {
    share: {
      "solar-system": ["Scientific Literacy: Sensemaking", "the Sun, planets and moons of our solar system"],
      "galaxies-and-space": ["Scientific Literacy: Sensemaking", "galaxies and space technology"],
    },
    adopted: adopt(poolOf("science", ontario, manitoba, alberta), {
      "static-electricity-6": ["Scientific Literacy: Sensemaking", "static electricity"],
      "circuits-6": ["Scientific Literacy: Sensemaking", "electrical energy flowing through circuits and materials"],
      "flight-6": ["Scientific Literacy: Sensemaking", "the forces that influence flight"],
      "earth-moon-sun-6": ["Scientific Literacy: Sensemaking", "Earth, the Moon and the Sun"],
      "weight-and-space-tech-6": ["Scientific Literacy: Sensemaking", "gravity and the technology of space exploration"],
      "classifying-life-6": ["Scientific Literacy: Sensemaking", "sorting living things into groups"],
      "biodiversity-6": ["Learning and Living Sustainably: Responsible and Sustainable Application", "the variety of life and how living things depend on one another"],
    }),
    own: [senses, technicalSensors],
    order: ["nb-senses-6", "nb-technical-sensors-6", "static-electricity-6", "circuits-6", "flight-6", "earth-moon-sun-6", "solar-system", "galaxies-and-space", "weight-and-space-tech-6", "classifying-life-6", "biodiversity-6"],
  }),
  course("6", "social", {
    share: {
      "map-skills": ["Geography: Methods and Tools", "reading maps to locate the Atlantic region and other places"],
      "governments-and-rights": ["Civics: Power and Governance", "how people shape political culture and influence decisions"],
      "trade-and-globalization": ["Economics: Decision-making", "trade and economic links with national and global communities"],
      "global-challenges": ["Economics: Sustainability", "local, regional and global economic patterns and issues"],
    },
    adopted: adopt(poolOf("social", ontario, manitoba, novaScotia), {
      "canadian-identities-6": ["Geography: Human Systems and Interactions", "contemporary cultures and their connections to other global cultures"],
      "global-help-6": ["Civics: Civic Engagement", "how people are members of global communities"],
    }),
    own: [atlanticRegion, atlanticEconomy],
    order: ["map-skills", "nb-atlantic-region-6", "canadian-identities-6", "governments-and-rights", "nb-atlantic-economy-6", "trade-and-globalization", "global-challenges", "global-help-6"],
  }),
  ...frenchCourses("6"),
];
