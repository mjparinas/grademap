import type { Course } from "../types";
import { units as g9_language } from "../ontario/g9-language";
import { units as g9_science } from "../ontario/g9-science";
import { units as sk_science_9 } from "./g9-science";
import { units as sk_social_9 } from "./g9-social";
import { reuse, share, sk } from "./kit";
import { SK_OUTCOMES as O } from "./outcomes";

// Saskatchewan Grade 9. Units that BC or Ontario already teach, and that fit the Saskatchewan outcomes, are
// shared with the outcomes they practise. The rest are written for Saskatchewan. Outcome codes are checked against
// docs/research/saskatchewan/outcomes.json in content.test.ts.

export const courses: Course[] = [
  {
    grade: "9",
    subject: "math",
    bigIdeas: { "ca-sk": O["9"].math },
    units: [],
    shares: {
      "exponent-laws": share("N9.1", "powers with integral bases"),
      "rational-numbers": share("N9.2, N9.3", "rational numbers, and square roots of positive rational numbers"),
      "linear-relations": share("P9.1", "graphing and analyzing linear relations"),
      "multi-step-equations": share("P9.2, P9.3", "linear equations and inequalities"),
      "polynomials": share("P9.4", "polynomials of degree two or less"),
      "similarity-and-scale": share("SS9.3", "similarity of 2-D shapes"),
      "statistics-in-society": share("SP9.1, SP9.2", "collecting and analyzing data, and what can bias it"),
    },
    order: { "ca-sk": ["exponent-laws", "rational-numbers", "linear-relations", "multi-step-equations", "polynomials", "similarity-and-scale", "statistics-in-society"] },
  },
  {
    grade: "9",
    subject: "language",
    bigIdeas: { "ca-sk": O["9"].language },
    units: [...reuse(g9_language, {
      "devices-9": sk("CR9.6a, CR9.6b", "literary devices and their effects"),
      "forms-features-9": sk("CR9.7a, CR9.7b", "forms and features of information texts"),
      "word-parts-9": sk("CR9.3a, CR9.3b", "word parts and vocabulary in reading"),
      "revise-edit-9": sk("AR9.2a, AR9.2b", "revising and editing for clarity, correctness and impact"),
    })],
    shares: {
      "close-reading": share("CR9.6a, CR9.6b", "reading and interpreting grade-level texts"),
      "literary-elements": share("CR9.6a, CR9.6b", "literary elements in fiction and poetry"),
      "voices-and-perspectives": share("CR9.1a, CR9.1b", "responding to a variety of voices and perspectives"),
      "argument-and-rhetoric": share("CR9.7a, CR9.7b", "argument and rhetoric in information texts"),
      "grammar-and-style": share("CC9.4a, CC9.4b", "grammar and style in writing"),
      "language-and-style": share("CC9.4a, CC9.4b", "language choices and style"),
    },
    order: { "ca-sk": ["close-reading", "literary-elements", "devices-9", "voices-and-perspectives", "argument-and-rhetoric", "forms-features-9", "word-parts-9", "grammar-and-style", "language-and-style", "revise-edit-9"] },
  },
  {
    grade: "9",
    subject: "science",
    bigIdeas: { "ca-sk": O["9"].science },
    units: [...reuse(g9_science, {
      "atoms-9": sk("AE9.2", "historical models of the atom"),
      "periodic-table-9": sk("AE9.3", "elements, and the periodic table"),
      "compounds-9": sk("AE9.1, AE9.3", "physical and chemical properties, elements and compounds"),
      "static-charges-9": sk("CE9.1", "static electric charge"),
      "circuits-9": sk("CE9.2", "voltage, current and resistance in circuits"),
      "electrical-energy-9": sk("CE9.3, CE9.4", "electrical devices, energy costs and efficiency"),
    }), ...sk_science_9],
    shares: {
      "cells-from-cells": share("RE9.2", "mitosis, meiosis and cellular reproduction"),
      "reproduction": share("RE9.1, RE9.3", "genetic information, and sexual and asexual reproduction"),
      "electric-current": share("CE9.1, CE9.2", "current electricity"),
    },
    order: { "ca-sk": ["cells-from-cells", "reproduction", "atoms-9", "periodic-table-9", "compounds-9", "static-charges-9", "circuits-9", "electric-current", "electrical-energy-9", ...sk_science_9.map((u) => u.id)] },
  },
  {
    grade: "9",
    subject: "social",
    bigIdeas: { "ca-sk": O["9"].social },
    units: [...sk_social_9],
    order: { "ca-sk": [...sk_social_9.map((u) => u.id)] },
  },
];
