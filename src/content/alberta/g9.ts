import type { Course } from "../types";
import { frenchCourses } from "./french";
import { units as mathUnits } from "./g9-math";
import { units as scienceUnits } from "./g9-science";
import { units as socialUnits } from "./g9-social";
import { ab } from "./kit";

// Alberta Grade 9. Units the BC or Ontario Grade 9 course already has are shared with Alberta's own
// standards text; the rest are written for the Alberta programs of study (Mathematics K-9, 2007; English
// Language Arts, 2000; Science 7-9, 2003; Social Studies, 2005). Neither BC's Grade 9 social studies (history)
// nor Ontario's (geography of Canada) matches Alberta's governance, rights and economics, so social studies
// is all Alberta-written.

const G9_MATH: string[] = [
  "Number: develop number sense, including powers, exponent laws, rational numbers, the order of operations and square roots",
  "Patterns and Relations: use patterns to describe the world and solve problems, including linear relations, linear equations and polynomials",
  "Shape and Space: use direct and indirect measurement to solve problems, describe the properties of circles, similar shapes, scale diagrams, symmetry and the surface area of 3-D objects",
  "Statistics and Probability: collect, display and analyze data to solve problems, and understand the role of probability in society",
];

const G9_LANGUAGE: string[] = [
  "General Outcome 1: students listen, speak, read, write, view and represent to explore thoughts, ideas, feelings and experiences",
  "General Outcome 2: students listen, speak, read, write, view and represent to comprehend and respond personally and critically to oral, print and other media texts",
  "General Outcome 3: students listen, speak, read, write, view and represent to manage ideas and information",
  "General Outcome 4: students listen, speak, read, write, view and represent to enhance the clarity and artistry of communication",
  "General Outcome 5: students listen, speak, read, write, view and represent to respect, support and collaborate with others",
];

const G9_SCIENCE: string[] = [
  "Unit A: Biological Diversity: how living things pass on their characteristics, and how human activity affects variety among and within species",
  "Unit B: Matter and Chemical Change: the properties of materials, the periodic table and what happens during chemical change",
  "Unit C: Environmental Chemistry: how chemical substances move through the environment and affect living things",
  "Unit D: Electrical Principles and Technologies: how electrical energy is generated, controlled, measured and used efficiently",
  "Unit E: Space Exploration: how technology has changed what we know about space, and the challenges and issues of exploring it",
];

const G9_SOCIAL: string[] = [
  "Canada: Opportunities and Challenges: Grade 9 looks at issues that Canadians face today, in two parts",
  "9.1 Issues for Canadians: Governance and Rights: how Canada is governed and how the rights of individuals and groups, including Indigenous peoples, are protected",
  "9.2 Issues for Canadians: Economic Systems in Canada and the United States: how the two countries organize their economies and trade with each other",
];

export const courses: Course[] = [
  {
    grade: "9",
    subject: "math",
    bigIdeas: { "ca-ab": G9_MATH },
    units: mathUnits,
    shares: {
      "exponent-laws": { standards: ab("N1, N2", "powers with whole-number exponents and the exponent laws") },
      "rational-numbers": { standards: ab("N3, N4", "operations on rational numbers and the order of operations") },
      polynomials: { standards: ab("PR5, PR6, PR7", "adding, subtracting, multiplying and dividing polynomials of degree 2 or less") },
      "multi-step-equations": { standards: ab("PR3, PR4", "solving linear equations and single-variable inequalities") },
      "linear-relations": { standards: ab("PR1, PR2", "writing, graphing and analysing linear relations") },
      "similarity-and-scale": { standards: ab("SS3, SS4", "similar polygons and scale diagrams") },
      "statistics-in-society": { standards: ab("SP1, SP2, SP3", "bias, samples and populations, and planning a data project") },
    },
    order: {
      "ca-ab": ["exponent-laws", "rational-numbers", "square-roots-ab", "polynomials", "multi-step-equations", "linear-relations", "similarity-and-scale", "circles-ab", "surface-area-ab", "statistics-in-society"],
    },
  },
  {
    grade: "9",
    subject: "language",
    bigIdeas: { "ca-ab": G9_LANGUAGE },
    units: [],
    shares: {
      "close-reading": { standards: ab("General Outcome 2", "reading closely for inference, theme, tone and the author's craft") },
      "literary-elements": { standards: ab("General Outcome 2", "literary elements and devices such as irony, symbolism and foreshadowing") },
      "argument-and-rhetoric": { standards: ab("General Outcomes 2, 3", "persuasive techniques, credibility and bias") },
      "voices-and-perspectives": { standards: ab("General Outcomes 2, 5", "point of view and respecting different voices and perspectives") },
      "digital-9": { standards: ab("General Outcome 3", "online safety, spotting misinformation and judging sources") },
      "grammar-and-style": { standards: ab("General Outcome 4", "sentence structure, grammar and punctuation") },
      "language-and-style": { standards: ab("General Outcome 4", "word choice, style and register") },
      "revise-edit-9": { standards: ab("General Outcome 4", "revising for clarity and editing for spelling and conventions") },
    },
    order: {
      "ca-ab": ["close-reading", "literary-elements", "voices-and-perspectives", "argument-and-rhetoric", "digital-9", "language-and-style", "grammar-and-style", "revise-edit-9"],
    },
  },
  {
    grade: "9",
    subject: "science",
    bigIdeas: { "ca-ab": G9_SCIENCE },
    units: scienceUnits,
    shares: {
      reproduction: { standards: ab("Unit A: Biological Diversity", "sexual and asexual reproduction in plants and animals") },
      "compounds-9": { standards: ab("Unit B: Matter and Chemical Change", "physical and chemical properties of materials, mixtures and compounds") },
      "atoms-and-electrons": { standards: ab("Unit B: Matter and Chemical Change", "atoms, electrons and the periodic table") },
      "static-charges-9": { standards: ab("Unit D: Electrical Principles and Technologies", "static electricity, conductors and insulators") },
      "circuits-9": { standards: ab("Unit D: Electrical Principles and Technologies", "circuits, current, voltage, resistance and Ohm's law") },
      "electrical-energy-9": { standards: ab("Unit D: Electrical Principles and Technologies", "generating electrical energy, power, energy use and efficiency") },
    },
    order: {
      "ca-ab": ["biodiversity-ab", "reproduction", "compounds-9", "atoms-and-electrons", "chemical-change-ab", "environmental-chemistry-ab", "static-charges-9", "circuits-9", "electrical-energy-9", "space-exploration-ab"],
    },
  },
  {
    grade: "9",
    subject: "social",
    bigIdeas: { "ca-ab": G9_SOCIAL },
    units: socialUnits,
    order: {
      "ca-ab": ["governance-ab", "charter-ab", "treaties-and-rights-ab", "economic-systems-ab", "supply-demand-ab", "canada-us-trade-ab"],
    },
  },
  ...frenchCourses("9"),
];
