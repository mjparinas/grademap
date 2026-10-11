import type { Course } from "../types";
import { courses as alberta } from "../alberta/g7";
import { courses as manitoba } from "../manitoba/g7";
import { courses as ontario } from "../ontario/g7";
import { courses as novaScotiaSix } from "../nova-scotia/g6";
import { courses as novaScotia } from "../nova-scotia/g7";
import { wabanakiWorldview } from "./units/g7-social";
import { frenchCourses } from "./french";
import { adopt, course, poolOf } from "./kit";

// New Brunswick Grade 7. Math follows the Grade 7 mathematics outcomes (N, PR, M, G, SP), English language arts the six Grade 7
// strands, science the three Grade 7 learning bundles and social studies the six Grade 7 outcomes (Maritimes history).
// Units BC, Ontario, Alberta or Manitoba already has are listed with the New Brunswick outcomes they practise.


export const courses: Course[] = [
  course("7", "math", {
    share: {
      "integer-add-subtract": ["Number: Operations", "adding and subtracting integers"],
      "decimal-operations": ["Number: Operations", "operations with decimals"],
      "fractions-decimals-percents": ["Number: Number Sense", "percents, fractions and decimals"],
      "tax-tips-discounts": ["Number: Number Sense", "percent in everyday money problems"],
      "coordinates-transformations": ["Shape and Space: 2-D Shapes and 3-D Objects", "transformations of shapes on a coordinate grid"],
      "linear-relations": ["Patterns and Relations: Algebra", "patterns, tables and graphs of linear relations"],
      "two-step-equations": ["Patterns and Relations: Algebra", "solving one- and two-step equations"],
      circles: ["Shape and Space: Measurement", "circumference and the relationship to diameter"],
      "circle-graphs": ["Statistics and Probability: Data Analysis", "creating and interpreting circle graphs"],
      probability: ["Statistics and Probability: Chance and Uncertainty", "probability of single and two independent events"],
    },
    adopted: adopt(poolOf("math", manitoba, ontario, alberta), {
      "fractions-7": ["Number: Operations", "adding and subtracting positive fractions and mixed numbers"],
      "mb-divisibility": ["Number: Number Sense", "divisibility rules and factors"],
      "mb-expressions-equations": ["Patterns and Relations: Algebra", "expressions, equations and the distributive property"],
      "area-constructions-ab": ["Shape and Space: Measurement", "area of triangles, parallelograms and circles"],
    }),
    order: ["mb-divisibility", "integer-add-subtract", "fractions-7", "decimal-operations", "fractions-decimals-percents", "tax-tips-discounts", "mb-expressions-equations", "two-step-equations", "linear-relations", "circles", "area-constructions-ab", "coordinates-transformations", "circle-graphs", "probability"],
  }),
  course("7", "language", {
    share: {
      "close-reading": ["Reading: Reading Comprehension", "reading closely for meaning"],
      "literary-devices": ["Reading: Text Analysis and Criticality", "literary devices in stories and poems"],
      "tone-mood": ["Reading: Text Analysis and Criticality", "tone and mood"],
      persuasion: ["Representing: Process", "persuasive techniques"],
      "source-check": ["Reading: Text Analysis and Criticality", "checking sources for accuracy and bias"],
      "clauses-sentences": ["Representing: Craft", "clauses and sentence structure in writing"],
      "modifiers-parallelism": ["Representing: Craft", "modifiers and parallel structure"],
      "semicolons-colons-dashes": ["Representing: Craft", "semicolons, colons and dashes"],
      "word-mix-ups": ["Representing: Craft", "commonly confused words"],
      "poetry-lab": ["Representing: Craft", "writing and reading poems"],
    },
    adopted: adopt(poolOf("language", ontario, manitoba, alberta, novaScotia), {
      "point-of-view-7": ["Reading: Text Analysis and Criticality", "point of view and perspective"],
    }),
    order: ["close-reading", "literary-devices", "tone-mood", "point-of-view-7", "persuasion", "source-check", "clauses-sentences", "modifiers-parallelism", "semicolons-colons-dashes", "word-mix-ups", "poetry-lab"],
  }),
  course("7", "science", {
    share: {
      "natural-selection": ["Scientific Literacy: Sensemaking", "how living things change over time"],
      "restless-earth": ["Scientific Literacy: Sensemaking", "Earth's changing crust, fossils and geological time"],
    },
    adopted: adopt(poolOf("science", ontario, manitoba, alberta, novaScotia), {
      "particles-mixtures-7": ["Scientific Literacy: Sensemaking", "particles and mixtures"],
      "heat-particles-7": ["Scientific Literacy: Sensemaking", "heat and particles"],
      "ecosystems-7": ["Learning and Living Sustainably: Responsible and Sustainable Application", "ecosystems and the living things in them"],
      "food-chains-7": ["Learning and Living Sustainably: Responsible and Sustainable Application", "food chains and energy in an ecosystem"],
      "human-impact-7": ["Learning and Living Sustainably: Responsible and Sustainable Application", "how people affect ecosystems"],
      "structures-forces-7": ["Scientific Literacy: Sensemaking", "forces acting on structures"],
      "safe-structures-7": ["Scientific Literacy: Sensemaking", "designing structures that are safe and strong"],
    }),
    order: ["ecosystems-7", "food-chains-7", "human-impact-7", "ns-netukulimk-7", "particles-mixtures-7", "heat-particles-7", "structures-forces-7", "safe-structures-7", "restless-earth", "natural-selection", "ns-coastlines-7"],
  }),
  course("7", "social", {
    share: {
      "world-beliefs": ["Geography: Human Systems and Interactions", "how worldview and culture influence identity"],
      "where-civilizations-grew": ["History: Events and Peoples", "researching historically diverse regions of the world"],
    },
    adopted: adopt(poolOf("social", manitoba, novaScotia, novaScotiaSix), {
      "mb-7-societies-compared": ["Geography: Human Systems and Interactions", "the importance of cross-cultural understanding"],
      "ns-child-rights-6": ["Civics: Rights and Responsibilities", "human rights and the rights of children around the world"],
    }),
    own: [wabanakiWorldview],
    order: ["world-beliefs", "nb-wabanaki-worldview-7", "mb-7-societies-compared", "where-civilizations-grew", "ns-child-rights-6"],
  }),
  ...frenchCourses("7"),
];
