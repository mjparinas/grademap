import type { Course } from "../types";
import { units as ontarioMath } from "../ontario/g8-math";
import { units as ontarioLanguage } from "../ontario/g8-language";
import { units as ontarioScience } from "../ontario/g8-science";
import { frenchCourses } from "./french";
import { adopt, course } from "./kit";
import { units as social } from "./units/g8-social";
import { units as science } from "./units/g8-science";

// Manitoba Grade 8. Math follows the Grade 8 mathematics outcomes (8.N, 8.PR, 8.SS, 8.SP), English language arts the ELA
// curriculum (strands A to D), science the Grade 8 science outcomes (SCI.8) and social studies Origins of Western Society
// (8-K outcomes). Units BC or Ontario already has are listed with the Manitoba outcomes they practise.

export const courses: Course[] = [
  course("8", "math", {
    share: {
      "squares-and-roots": ["8.N.1, 8.N.2", "perfect squares, square roots and estimating square roots of whole numbers"],
      "percents-and-money": ["8.N.3", "percents greater than or equal to 0%"],
      "ratios-and-rates": ["8.N.4, 8.N.5", "ratios, rates and proportional reasoning"],
      "fraction-operations": ["8.N.6, 8.N.8", "multiplying and dividing positive fractions and mixed numbers, and solving problems with them"],
      "linear-equations": ["8.PR.1, 8.PR.2", "linear relations and solving linear equations"],
      "pythagorean-theorem": ["8.SS.1", "developing and applying the Pythagorean theorem"],
      "surface-area-volume": ["8.SS.3, 8.SS.4", "surface area and volume of prisms and cylinders"],
      "probability-and-data": ["8.SP.1, 8.SP.2", "critiquing data displays, and the probability of independent events"],
    },
    adopted: adopt(ontarioMath, {
      "integers-8": ["8.N.7", "multiplying and dividing integers"],
      "transformations-8": ["8.SS.6", "tessellations and the transformations that create them"],
    }),
    order: ["squares-and-roots", "fraction-operations", "integers-8", "percents-and-money", "ratios-and-rates", "linear-equations", "pythagorean-theorem", "surface-area-volume", "transformations-8", "probability-and-data"],
  }),
  course("8", "language", {
    share: {
      "close-reading": ["ELA.8.B2.3, ELA.8.B2.6", "predicting, inferring and summarizing from grade-level texts"],
      "literary-devices": ["ELA.8.B2.4, ELA.8.B2.7", "literary devices and connecting ideas across texts"],
      "argument-and-media": ["ELA.8.B3.1, ELA.8.B3.2", "fact, opinion and subtle bias in arguments and media"],
      "grammar-and-style": ["ELA.8.C2.2, ELA.8.C3.3, ELA.8.C3.4", "sentence variety, capitalization and punctuation"],
      "word-study": ["ELA.8.A2.4, ELA.8.A2.5", "word structure and vocabulary"],
    },
    adopted: adopt(ontarioLanguage, {
      "narrator-8": ["ELA.8.B3.3", "a text creator's point of view and the narrator's voice"],
      "strategies-8": ["ELA.8.B2.5", "choosing reading strategies to understand a text"],
      "forms-features-8": ["ELA.8.B2.1, ELA.8.B2.2", "text forms, features and cues that carry a message"],
      "writing-8": ["ELA.8.C2.5", "revising writing for clear word choice and sentence structure"],
    }),
    order: ["strategies-8", "close-reading", "narrator-8", "literary-devices", "forms-features-8", "argument-and-media", "word-study", "grammar-and-style", "writing-8"],
  }),
  course("8", "science", {
    share: {
      "cells-and-life": ["SCI.8.E.18, SCI.8.E.19, SCI.8.E.20, SCI.8.E.21", "the cell theory, cell structures, and cells, tissues, organs and systems"],
      "light-and-radiation": ["SCI.8.E.7, SCI.8.E.8, SCI.8.E.9", "solar radiation and the electromagnetic spectrum"],
      "particles-and-matter": ["SCI.8.E.4, SCI.8.E.5", "the particle theory of matter, and changes of state"],
    },
    adopted: adopt(ontarioScience, {
      "density-buoyancy-8": ["SCI.8.E.1, SCI.8.E.2", "density as mass over volume, and how temperature changes it"],
      "viscosity-flow-8": ["SCI.8.E.3, SCI.8.D.2", "viscosity, and testing predictions with a fair experiment"],
    }),
    own: science,
    order: ["cells-and-life", "mb-circulatory-8", "particles-and-matter", "density-buoyancy-8", "viscosity-flow-8", "light-and-radiation", "mb-earth-energy-8", "mb-earth-structure-8"],
  }),
  course("8", "social", {
    share: {
      "medieval-europe": ["8-KH-035, 8-KP-052, 8-KE-057", "feudalism, the Church and how work and education were organized in medieval Europe"],
      "islamic-world": ["8-KI-018, 8-KP-049, 8-KP-053", "Islamic achievements, the Arab conquests and the Ottoman Empire"],
      "trade-and-empires": ["8-KI-019, 8-KP-051, 8-KG-041", "China, the Mongol Empire and the spread of ideas and technologies"],
      "renaissance-and-reformation": ["8-KI-020, 8-KH-036, 8-KH-037", "the Renaissance and the Protestant Reformation"],
      "exploration-and-exchange": ["8-KI-021, 8-KL-026, 8-KG-044", "European voyages, and their impact on the peoples they met"],
    },
    own: social,
    order: ["mb-history-skills-8", "mb-world-views-8", "mb-ancient-greece", "mb-ancient-rome", "medieval-europe", "islamic-world", "trade-and-empires", "renaissance-and-reformation", "exploration-and-exchange"],
  }),
  ...frenchCourses("8"),
];
