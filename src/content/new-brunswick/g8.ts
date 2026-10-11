import type { Course } from "../types";
import { courses as alberta } from "../alberta/g8";
import { courses as manitoba } from "../manitoba/g8";
import { courses as ontario } from "../ontario/g8";
import { courses as novaScotia } from "../nova-scotia/g8";
import { blackHistory, confederation, rightsReform, wabanakiEmpowerment } from "./units/g8-social";
import { frenchCourses } from "./french";
import { adopt, course, poolOf } from "./kit";

// New Brunswick Grade 8. Math follows the Grade 8 mathematics outcomes (N, PR, M, G, SP), English language arts the six Grade 8
// strands, science the three Grade 8 learning bundles and social studies the six Grade 8 outcomes (Canada from 1920).
// Units BC, Ontario, Alberta or Manitoba already has are listed with the New Brunswick outcomes they practise.


export const courses: Course[] = [
  course("8", "math", {
    share: {
      "squares-and-roots": ["Number: Operations", "perfect squares, square roots and estimating square roots"],
      "percents-and-money": ["Number: Number Sense", "percents greater than 100 and less than 1, and money problems"],
      "ratios-and-rates": ["Number: Number Sense", "ratios, rates and proportional reasoning"],
      "fraction-operations": ["Number: Operations", "multiplying and dividing positive fractions and mixed numbers"],
      "linear-equations": ["Patterns and Relations: Algebra", "linear relations and solving linear equations"],
      "pythagorean-theorem": ["Shape and Space: Measurement", "the Pythagorean theorem"],
      "surface-area-volume": ["Shape and Space: Measurement", "surface area and volume of prisms and cylinders"],
      "probability-and-data": ["Statistics and Probability: Data Analysis", "choosing and critiquing ways to show data"],
    },
    adopted: adopt(poolOf("math", manitoba, ontario, alberta), {
      "integers-8": ["Number: Operations", "multiplying and dividing integers"],
      "nets-views-ab": ["Shape and Space: Measurement", "nets and views of 3-D objects"],
    }),
    order: ["squares-and-roots", "pythagorean-theorem", "integers-8", "fraction-operations", "percents-and-money", "ratios-and-rates", "linear-equations", "surface-area-volume", "nets-views-ab", "probability-and-data"],
  }),
  course("8", "language", {
    share: {
      "close-reading": ["Reading: Reading Comprehension", "reading closely for meaning"],
      "literary-devices": ["Reading: Text Analysis and Criticality", "literary devices and their effect"],
      "argument-and-media": ["Reading: Text Analysis and Criticality", "argument, media messages and bias"],
      "grammar-and-style": ["Representing: Craft", "grammar and style in writing"],
      "word-study": ["Reading: Vocabulary", "word choice and word study"],
    },
    adopted: adopt(poolOf("language", ontario, manitoba, alberta, novaScotia), {
      "narrator-8": ["Reading: Text Analysis and Criticality", "narrator and point of view"],
      "forms-features-8": ["Reading: Reading Comprehension", "text forms and features"],
      "strategies-8": ["Reading: Reading Comprehension", "reading strategies"],
      "digital-8": ["Reading: Text Analysis and Criticality", "digital texts and media"],
      "writing-8": ["Representing: Craft", "planning, drafting and revising writing"],
    }),
    order: ["word-study", "strategies-8", "forms-features-8", "close-reading", "narrator-8", "literary-devices", "argument-and-media", "digital-8", "writing-8", "grammar-and-style"],
  }),
  course("8", "science", {
    share: {
      "cells-and-life": ["Scientific Literacy: Sensemaking", "cells, and how they make up living things"],
      "particles-and-matter": ["Scientific Literacy: Sensemaking", "particle theory and how matter behaves"],
    },
    adopted: adopt(poolOf("science", ontario, manitoba, alberta, novaScotia), {
      "viscosity-flow-8": ["Scientific Literacy: Sensemaking", "viscosity and how fluids flow"],
      "pressure-pascal-8": ["Scientific Literacy: Sensemaking", "pressure in fluids"],
      "hydraulics-pneumatics-8": ["Scientific Literacy: Sensemaking", "hydraulic and pneumatic systems"],
      "ns-climate-action-8": ["Learning and Living Sustainably: Responsible and Sustainable Application", "the causes of climate change and actions people can take"],
      "density-buoyancy-8": ["Scientific Literacy: Sensemaking", "density and buoyancy"],
    }),
    order: ["cells-and-life", "particles-and-matter", "viscosity-flow-8", "density-buoyancy-8", "pressure-pascal-8", "hydraulics-pneumatics-8", "ns-climate-action-8"],
  }),
  course("8", "social", {
    own: [confederation, blackHistory, rightsReform, wabanakiEmpowerment],
    order: ["nb-confederation-8", "nb-black-history-8", "nb-wabanaki-empowerment-8", "nb-rights-reform-8"],
  }),
  ...frenchCourses("8"),
];
