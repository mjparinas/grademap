import type { Course } from "../types";
import { courses as alberta } from "../alberta/g8";
import { courses as manitoba } from "../manitoba/g8";
import { courses as ontario } from "../ontario/g8";
import { frenchCourses } from "./french";
import { adopt, course, poolOf } from "./kit";
import { culturalExpressions8 } from "./units/g8-language";
import { climateAction, climateEvidence } from "./units/g8-science";
import { advocacy, conflicts, worldWarTwo } from "./units/g8-social";

// Nova Scotia Grade 8. Math follows the Grade 8 mathematics outcomes (N, PR, M, G, SP), English language arts the six Grade 8
// strands, science the three Grade 8 learning bundles and social studies the six Grade 8 outcomes (Canada from 1920).
// Units BC, Ontario, Alberta or Manitoba already has are listed with the Nova Scotia outcomes they practise.

const CELLS = "Healthy Cells, Healthy Systems";
const FLUIDS = "Hydraulic and Pneumatic Systems";

export const courses: Course[] = [
  course("8", "math", {
    share: {
      "squares-and-roots": ["N01, N02", "perfect squares, square roots and estimating square roots"],
      "percents-and-money": ["N03", "percents greater than 100 and less than 1, and money problems"],
      "ratios-and-rates": ["N04, N05", "ratios, rates and proportional reasoning"],
      "fraction-operations": ["N06", "multiplying and dividing positive fractions and mixed numbers"],
      "linear-equations": ["PR01, PR02", "linear relations and solving linear equations"],
      "pythagorean-theorem": ["M01", "the Pythagorean theorem"],
      "surface-area-volume": ["M02, M03, M04", "surface area and volume of prisms and cylinders"],
      "probability-and-data": ["SP01", "choosing and critiquing ways to show data"],
    },
    adopted: adopt(poolOf("math", manitoba, ontario, alberta), {
      "integers-8": ["N07", "multiplying and dividing integers"],
      "nets-views-ab": ["G01", "nets and views of 3-D objects"],
    }),
    order: ["squares-and-roots", "pythagorean-theorem", "integers-8", "fraction-operations", "percents-and-money", "ratios-and-rates", "linear-equations", "surface-area-volume", "nets-views-ab", "probability-and-data"],
  }),
  course("8", "language", {
    share: {
      "close-reading": ["Comprehending", "reading closely for meaning"],
      "literary-devices": ["Responses", "literary devices and their effect"],
      "argument-and-media": ["Accuracy and bias", "argument, media messages and bias"],
      "grammar-and-style": ["Creating", "grammar and style in writing"],
      "word-study": ["Speaking and writing strategies", "word choice and word study"],
    },
    adopted: adopt(poolOf("language", ontario, manitoba, alberta), {
      "narrator-8": ["Responses", "narrator and point of view"],
      "forms-features-8": ["Comprehending", "text forms and features"],
      "strategies-8": ["Comprehending", "reading strategies"],
      "digital-8": ["Accuracy and bias", "digital texts and media"],
      "writing-8": ["Creating", "planning, drafting and revising writing"],
    }),
    own: [culturalExpressions8],
    order: ["ns-cultural-expressions-8", "word-study", "strategies-8", "forms-features-8", "close-reading", "narrator-8", "literary-devices", "argument-and-media", "digital-8", "writing-8", "grammar-and-style"],
  }),
  course("8", "science", {
    share: {
      "cells-and-life": [CELLS, "cells, and how they make up living things"],
      "particles-and-matter": [FLUIDS, "particle theory and how matter behaves"],
    },
    adopted: adopt(poolOf("science", ontario, manitoba, alberta), {
      "viscosity-flow-8": [FLUIDS, "viscosity and how fluids flow"],
      "pressure-pascal-8": [FLUIDS, "pressure in fluids"],
      "hydraulics-pneumatics-8": [FLUIDS, "hydraulic and pneumatic systems"],
      "density-buoyancy-8": [FLUIDS, "density and buoyancy"],
    }),
    own: [climateEvidence, climateAction],
    order: ["cells-and-life", "particles-and-matter", "viscosity-flow-8", "density-buoyancy-8", "pressure-pascal-8", "hydraulics-pneumatics-8", "ns-climate-evidence-8", "ns-climate-action-8"],
  }),
  course("8", "social", {
    adopted: adopt(poolOf("social", ontario, manitoba, alberta), {
    }),
    own: [conflicts, worldWarTwo, advocacy],
    order: ["ns-conflicts-8", "ns-world-war-2-8", "ns-advocacy-8"],
  }),
  ...frenchCourses("8"),
];
