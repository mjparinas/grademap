import type { Course } from "../types";
import { courses as alberta } from "../alberta/g9";
import { courses as manitoba } from "../manitoba/g9";
import { courses as ontario } from "../ontario/g9";
import { frenchCourses } from "./french";
import { adopt, course, poolOf } from "./kit";
import { citizenRights, digitalCitizenship, engagedCitizenship, financialCitizenship, globalCitizenship, governance } from "./units/g9-social";

// Nova Scotia Grade 9. Math follows the Grade 9 mathematics outcomes (N, PR, G, SP), English language arts the numbered
// Grade 9 outcomes, science the four Grade 9 learning bundles and social studies Citizenship 9. Units BC, Ontario, Alberta
// or Manitoba already has are listed with the Nova Scotia outcomes they practise.

const ELECTRICITY = "Characteristics of Electricity";
const ATOMS = "Atoms and Elements";
const SPACE = "Space Exploration";
const REPRO = "Reproduction";

export const courses: Course[] = [
  course("9", "math", {
    share: {
      "rational-numbers": ["N03, N05, N06", "operations with rational numbers"],
      "exponent-laws": ["N01, N02, N04", "powers, exponent laws and scientific notation"],
      polynomials: ["PR05, PR06, PR07", "adding, subtracting and multiplying polynomials"],
      "multi-step-equations": ["PR03, PR04", "solving linear equations in several steps"],
      "linear-relations": ["PR01, PR02", "linear relations: tables, graphs and equations"],
      "statistics-in-society": ["SP01, SP03", "collecting data and how statistics are used"],
    },
    adopted: adopt(poolOf("math", alberta, ontario, manitoba), {
      "surface-area-ab": ["G01", "surface area of composite 3-D objects"],
    }),
    order: ["exponent-laws", "rational-numbers", "linear-relations", "multi-step-equations", "polynomials", "surface-area-ab", "statistics-in-society"],
  }),
  course("9", "language", {
    share: {
      "close-reading": ["4.4, 6.1", "reading closely and responding to texts"],
      "literary-elements": ["4.2, 6.2", "literary elements and how they work"],
      "argument-and-rhetoric": ["1.3, 7.1", "argument and rhetorical techniques"],
      "grammar-and-style": ["8.1, 8.2", "grammar and conventions in writing"],
      "language-and-style": ["8.3", "language and style"],
      "voices-and-perspectives": ["4.2, 7.3", "voices and perspectives in texts"],
    },
    adopted: adopt(poolOf("language", ontario, manitoba, alberta), {
      "word-parts-9": ["2.4", "using word parts to work out meaning"],
      "devices-9": ["4.5", "sound, image and figurative devices"],
      "digital-9": ["5.1", "digital and media texts"],
      "revise-edit-9": ["9.2, 9.3", "revising and editing writing"],
      "forms-features-9": ["2.1", "text forms and features"],
    }),
    order: ["word-parts-9", "forms-features-9", "close-reading", "literary-elements", "devices-9", "voices-and-perspectives", "argument-and-rhetoric", "digital-9", "language-and-style", "grammar-and-style", "revise-edit-9"],
  }),
  course("9", "science", {
    share: {
      reproduction: [REPRO, "reproduction in living things"],
      "cells-from-cells": [REPRO, "cell division and how cells make more cells"],
      "atoms-and-electrons": [ATOMS, "atoms, electrons and the periodic table"],
      "electric-current": [ELECTRICITY, "electric current and circuits"],
    },
    adopted: adopt(poolOf("science", ontario, manitoba, alberta), {
      "periodic-table-9": [ATOMS, "the periodic table and what it tells us"],
      "compounds-9": [ATOMS, "elements and compounds"],
      "atoms-9": [ATOMS, "the parts of an atom"],
      "static-charges-9": [ELECTRICITY, "static charges"],
      "circuits-9": [ELECTRICITY, "series and parallel circuits"],
      "electrical-energy-9": [ELECTRICITY, "electrical energy and its use"],
      "space-exploration-ab": [SPACE, "technology for exploring space"],
    }),
    order: ["reproduction", "cells-from-cells", "atoms-and-electrons", "atoms-9", "periodic-table-9", "compounds-9", "static-charges-9", "electric-current", "circuits-9", "electrical-energy-9", "space-exploration-ab"],
  }),
  course("9", "social", {
    share: {
    },
    own: [engagedCitizenship, citizenRights, financialCitizenship, digitalCitizenship, governance, globalCitizenship],
    order: ["ns-citizen-rights-9", "ns-governance-9", "ns-digital-citizenship-9", "ns-financial-citizenship-9", "ns-global-citizenship-9", "ns-engaged-citizenship-9"],
  }),
  ...frenchCourses("9"),
];
