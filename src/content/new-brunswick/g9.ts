import type { Course } from "../types";
import { courses as alberta } from "../alberta/g9";
import { courses as manitoba } from "../manitoba/g9";
import { courses as ontario } from "../ontario/g9";
import { courses as novaScotia } from "../nova-scotia/g9";
import { governance, identityMigration, placesAndPeople, rightsRoles, treatyRelationships } from "./units/g9-social";
import { solarSystem, ecosystems9 } from "./units/g9-science";
import { frenchCourses } from "./french";
import { adopt, course, poolOf } from "./kit";

// New Brunswick Grade 9. Math follows the Grade 9 mathematics outcomes (N, PR, G, SP), English language arts the numbered
// Grade 9 outcomes, science the four Grade 9 learning bundles and social studies Citizenship 9. Units BC, Ontario, Alberta
// or Manitoba already has are listed with the New Brunswick outcomes they practise.


export const courses: Course[] = [
  course("9", "math", {
    share: {
      "rational-numbers": ["Number: Operations", "operations with rational numbers"],
      "exponent-laws": ["Number: Operations", "powers, exponent laws and scientific notation"],
      polynomials: ["Patterns and Relations: Algebra", "adding, subtracting and multiplying polynomials"],
      "multi-step-equations": ["Patterns and Relations: Algebra", "solving linear equations in several steps"],
      "linear-relations": ["Patterns and Relations: Algebra", "linear relations: tables, graphs and equations"],
      "statistics-in-society": ["Statistics and Probability: Data Analysis", "collecting data and how statistics are used"],
    },
    adopted: adopt(poolOf("math", alberta, ontario, manitoba), {
      "surface-area-ab": ["Shape and Space: 3D Objects and 2D Shapes", "surface area of composite 3-D objects"],
    }),
    order: ["exponent-laws", "rational-numbers", "linear-relations", "multi-step-equations", "polynomials", "surface-area-ab", "statistics-in-society"],
  }),
  course("9", "language", {
    share: {
      "close-reading": ["Reading: Text Analysis/Criticality, Reading: Reading Comprehension", "reading closely and responding to texts"],
      "literary-elements": ["Reading: Text Analysis/Criticality, Reading: Reading Comprehension", "literary elements and how they work"],
      "argument-and-rhetoric": ["Representing: Craft", "argument and rhetorical techniques"],
      "grammar-and-style": ["Representing: Craft", "grammar and conventions in writing"],
      "language-and-style": ["Representing: Craft", "language and style"],
      "voices-and-perspectives": ["Reading: Text Analysis/Criticality", "voices and perspectives in texts"],
    },
    adopted: adopt(poolOf("language", ontario, manitoba, alberta), {
      "word-parts-9": ["Reading: Word Study", "using word parts to work out meaning"],
      "devices-9": ["Reading: Text Analysis/Criticality", "sound, image and figurative devices"],
      "digital-9": ["Reading: Text Analysis/Criticality", "digital and media texts"],
      "revise-edit-9": ["Representing: Process", "revising and editing writing"],
      "forms-features-9": ["Reading: Word Study", "text forms and features"],
    }),
    order: ["word-parts-9", "forms-features-9", "close-reading", "literary-elements", "devices-9", "voices-and-perspectives", "argument-and-rhetoric", "digital-9", "language-and-style", "grammar-and-style", "revise-edit-9"],
  }),
  course("9", "science", {
    share: {
      reproduction: ["Scientific Literacy: Sensemaking", "reproduction in living things"],
      "cells-from-cells": ["Scientific Literacy: Sensemaking", "cell division and how cells make more cells"],
      "atoms-and-electrons": ["Scientific Literacy: Sensemaking", "atoms, electrons and the periodic table"],
      "electric-current": ["Scientific Literacy: Sensemaking", "electric current and circuits"],
    },
    adopted: adopt(poolOf("science", ontario, manitoba, alberta), {
      "periodic-table-9": ["Scientific Literacy: Sensemaking", "the periodic table and what it tells us"],
      "compounds-9": ["Scientific Literacy: Sensemaking", "elements and compounds"],
      "atoms-9": ["Scientific Literacy: Sensemaking", "the parts of an atom"],
      "static-charges-9": ["Scientific Literacy: Sensemaking", "static charges"],
      "circuits-9": ["Scientific Literacy: Sensemaking", "series and parallel circuits"],
      "electrical-energy-9": ["Scientific Literacy: Sensemaking", "electrical energy and its use"],
      "space-exploration-ab": ["Scientific Literacy: Sensemaking", "technology for exploring space"],
    }),
    own: [solarSystem, ecosystems9],
    order: ["nb-solar-system-9", "nb-ecosystems-9", "reproduction", "cells-from-cells", "atoms-and-electrons", "atoms-9", "periodic-table-9", "compounds-9", "static-charges-9", "electric-current", "circuits-9", "electrical-energy-9", "space-exploration-ab"],
  }),
  course("9", "social", {
    share: {
      "canadas-landscapes": ["Geography: Places and Regions", "Canada's landscape and climate"],
    },
    adopted: adopt(poolOf("social", novaScotia), {
      "ns-engaged-citizenship-9": ["Civics: Civic Engagement", "actions that show the rights and responsibilities of citizenship"],
    }),
    own: [placesAndPeople, identityMigration, governance, rightsRoles, treatyRelationships],
    order: ["canadas-landscapes", "nb-places-people-9", "nb-identity-migration-9", "nb-governance-9", "nb-rights-roles-9", "ns-engaged-citizenship-9", "nb-treaty-relationships-9"],
  }),
  ...frenchCourses("9"),
];
