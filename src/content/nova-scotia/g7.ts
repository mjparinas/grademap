import type { Course } from "../types";
import { courses as alberta } from "../alberta/g7";
import { courses as manitoba } from "../manitoba/g7";
import { courses as ontario } from "../ontario/g7";
import { frenchCourses } from "./french";
import { adopt, course, poolOf } from "./kit";
import { culturalExpressions7 } from "./units/g7-language";
import { coastlines, netukulimk } from "./units/g7-science";
import { changingSociety, maritimeCommunitiesToday, maritimesHistory, mikmawTreaties, politicalChange, worldWarOne } from "./units/g7-social";

// Nova Scotia Grade 7. Math follows the Grade 7 mathematics outcomes (N, PR, M, G, SP), English language arts the six Grade 7
// strands, science the three Grade 7 learning bundles and social studies the six Grade 7 outcomes (Maritimes history).
// Units BC, Ontario, Alberta or Manitoba already has are listed with the Nova Scotia outcomes they practise.

const ACTION = "Environmental Action";
const STRUCTURES = "Engineering Structures";
const GEOLOGY = "Geological Evolution";

export const courses: Course[] = [
  course("7", "math", {
    share: {
      "integer-add-subtract": ["N06", "adding and subtracting integers"],
      "decimal-operations": ["N02", "operations with decimals"],
      "fractions-decimals-percents": ["N03, N04", "percents, fractions and decimals"],
      "tax-tips-discounts": ["N03", "percent in everyday money problems"],
      "coordinates-transformations": ["G02", "transformations of shapes on a coordinate grid"],
      "linear-relations": ["PR01, PR02", "patterns, tables and graphs of linear relations"],
      "two-step-equations": ["PR06, PR07", "solving one- and two-step equations"],
      circles: ["M01", "circumference and the relationship to diameter"],
      "circle-graphs": ["SP03", "creating and interpreting circle graphs"],
      probability: ["SP04, SP06", "probability of single and two independent events"],
    },
    adopted: adopt(poolOf("math", manitoba, ontario, alberta), {
      "fractions-7": ["N05", "adding and subtracting positive fractions and mixed numbers"],
      "mb-divisibility": ["N01", "divisibility rules and factors"],
      "mb-expressions-equations": ["PR03, PR04, PR05", "expressions, equations and the distributive property"],
      "area-constructions-ab": ["M02", "area of triangles, parallelograms and circles"],
    }),
    order: ["mb-divisibility", "integer-add-subtract", "fractions-7", "decimal-operations", "fractions-decimals-percents", "tax-tips-discounts", "mb-expressions-equations", "two-step-equations", "linear-relations", "circles", "area-constructions-ab", "coordinates-transformations", "circle-graphs", "probability"],
  }),
  course("7", "language", {
    share: {
      "close-reading": ["Comprehending", "reading closely for meaning"],
      "literary-devices": ["Responses", "literary devices in stories and poems"],
      "tone-mood": ["Responses", "tone and mood"],
      persuasion: ["Speaking and writing strategies", "persuasive techniques"],
      "source-check": ["Accuracy and bias", "checking sources for accuracy and bias"],
      "clauses-sentences": ["Creating", "clauses and sentence structure in writing"],
      "modifiers-parallelism": ["Creating", "modifiers and parallel structure"],
      "semicolons-colons-dashes": ["Creating", "semicolons, colons and dashes"],
      "word-mix-ups": ["Creating", "commonly confused words"],
      "poetry-lab": ["Creating", "writing and reading poems"],
    },
    adopted: adopt(poolOf("language", ontario, manitoba, alberta), {
      "point-of-view-7": ["Responses", "point of view and perspective"],
    }),
    own: [culturalExpressions7],
    order: ["ns-cultural-expressions-7", "close-reading", "literary-devices", "tone-mood", "point-of-view-7", "persuasion", "source-check", "clauses-sentences", "modifiers-parallelism", "semicolons-colons-dashes", "word-mix-ups", "poetry-lab"],
  }),
  course("7", "science", {
    share: {
      "natural-selection": [GEOLOGY, "how living things change over time"],
      "restless-earth": [GEOLOGY, "Earth's changing crust, fossils and geological time"],
    },
    adopted: adopt(poolOf("science", ontario, manitoba, alberta), {
      "particles-mixtures-7": [ACTION, "particles and mixtures"],
      "heat-particles-7": [ACTION, "heat and particles"],
      "ecosystems-7": [ACTION, "ecosystems and the living things in them"],
      "food-chains-7": [ACTION, "food chains and energy in an ecosystem"],
      "human-impact-7": [ACTION, "how people affect ecosystems"],
      "structures-forces-7": [STRUCTURES, "forces acting on structures"],
      "safe-structures-7": [STRUCTURES, "designing structures that are safe and strong"],
    }),
    own: [netukulimk, coastlines],
    order: ["ecosystems-7", "food-chains-7", "human-impact-7", "ns-netukulimk-7", "particles-mixtures-7", "heat-particles-7", "structures-forces-7", "safe-structures-7", "restless-earth", "natural-selection", "ns-coastlines-7"],
  }),
  course("7", "social", {
    own: [mikmawTreaties, maritimesHistory, politicalChange, changingSociety, worldWarOne, maritimeCommunitiesToday],
  }),
  ...frenchCourses("7"),
];
