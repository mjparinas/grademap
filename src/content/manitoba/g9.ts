import type { Course } from "../types";
import { courses as ontario } from "../ontario/g9";
import { frenchCourses } from "./french";
import { adopt, course, unitsOf } from "./kit";
import { units as socialUnits } from "./units/g9-social";
import { units as scienceUnits } from "./units/g9-science";
import { units as moreMath } from "./units/g9-more-math";
import { units as moreLanguage } from "./units/g9-more-language";
import { units as moreScience } from "./units/g9-more-science";
import { units as moreSocialA } from "./units/g9-more-social-a";
import { units as moreSocialB } from "./units/g9-more-social-b";

// Manitoba Grade 9. Math follows the Grade 9 mathematics outcomes (9.N, 9.PR, 9.SS, 9.SP), English language arts the ELA
// curriculum (strands A to D), science the Grade 9 science outcomes (SCI.9) and social studies Canada in the Contemporary
// World (9-K outcomes). Units BC or Ontario already has are listed with the Manitoba outcomes they practise.

export const courses: Course[] = [
  course("9", "math", {
    share: {
      "exponent-laws": ["9.N.1, 9.N.2, 9.N.4", "powers with integral bases, laws of exponents and the order of operations"],
      "rational-numbers": ["9.N.3, 9.N.5, 9.N.6", "rational numbers, and perfect and approximate square roots"],
      "linear-relations": ["9.PR.1, 9.PR.2", "patterns and linear relations, their graphs, and interpolating and extrapolating"],
      "multi-step-equations": ["9.PR.3, 9.PR.4", "solving linear equations and inequalities"],
      polynomials: ["9.PR.5, 9.PR.6, 9.PR.7", "polynomials of degree two or less, and adding, subtracting, multiplying and dividing them"],
      "similarity-and-scale": ["9.SS.3, 9.SS.4", "similar polygons, and scale diagrams of 2-D shapes"],
      "statistics-in-society": ["9.SP.1, 9.SP.2, 9.SP.3", "bias in data collection, samples and populations, and planning a data project"],
    },
    own: moreMath,
    order: ["exponent-laws", "rational-numbers", "linear-relations", "multi-step-equations", "polynomials", "similarity-and-scale", "mb-circle-properties", "mb-composite-surface-area", "mb-line-rotation-symmetry", "statistics-in-society", "mb-probability-in-society"],
  }),
  course("9", "language", {
    share: {
      "close-reading": ["ELA.9.B2.1, ELA.9.B2.3, ELA.9.B3.1", "inferences, monitoring understanding and finding ideas and evidence in texts"],
      "literary-elements": ["ELA.9.B3.1, ELA.9.B3.2", "themes, perspectives and how a creator's choices shape a text"],
      "voices-and-perspectives": ["ELA.9.B3.2, ELA.9.B4.2, ELA.9.B4.3", "viewpoints in texts and how perspectives shape responses"],
      "argument-and-rhetoric": ["ELA.9.B3.1, ELA.9.D1.3", "opinions, evidence and persuasive choices"],
      "grammar-and-style": ["ELA.9.A2.7, ELA.9.C2.2, ELA.9.C3.2, ELA.9.C3.3", "sentence structure, grammar, capitalization and punctuation"],
      "language-and-style": ["ELA.9.A2.6, ELA.9.C2.3", "word choice, precision and style"],
    },
    adopted: adopt(unitsOf(ontario, "language"), {
      "word-parts-9": ["ELA.9.A2.5, ELA.9.A2.6", "Greek and Latin roots, affixes and word origins"],
      "revise-edit-9": ["ELA.9.C2.2, ELA.9.C2.3, ELA.9.C3.1, ELA.9.C3.3", "revising and editing for clarity, spelling and punctuation"],
      "forms-features-9": ["ELA.9.B1.3, ELA.9.C1.3", "text cues, features and forms"],
    }),
    own: moreLanguage,
    order: ["mb-reading-with-purpose", "close-reading", "mb-summarizing", "literary-elements", "voices-and-perspectives", "argument-and-rhetoric", "mb-plan-and-research", "mb-choose-form-and-compose", "forms-features-9", "word-parts-9", "mb-vocabulary-and-spelling", "grammar-and-style", "language-and-style", "revise-edit-9", "mb-feedback-and-goals"],
  }),
  course("9", "science", {
    share: {
      "cells-from-cells": ["SCI.9.E.15, SCI.9.E.21", "cell division, asexual reproduction and genetic material"],
      reproduction: ["SCI.9.E.16, SCI.9.E.18", "sexual reproduction and variety in traits"],
      "atoms-and-electrons": ["SCI.9.E.4, SCI.9.E.5", "atoms and their internal structure"],
      "bonding-and-reactions": ["SCI.9.E.2, SCI.9.E.3", "chemical and physical change, and conservation of mass"],
      "electric-current": ["SCI.9.E.10", "current electricity: polarity, voltage, current and resistance"],
    },
    adopted: adopt(unitsOf(ontario, "science"), {
      "periodic-table-9": ["SCI.9.E.7", "the arrangement of the elements on the periodic table"],
      "compounds-9": ["SCI.9.E.1", "pure substances, elements, compounds and mixtures"],
      "static-charges-9": ["SCI.9.E.6", "static electricity: attraction, repulsion and charging"],
    }),
    own: [...scienceUnits, ...moreScience],
  }),
  course("9", "social", {
    own: [...socialUnits, ...moreSocialA, ...moreSocialB],
  }),
  ...frenchCourses("9"),
];
