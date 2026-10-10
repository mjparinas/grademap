import type { Course } from "../types";
import { ab } from "./kit";
import { frenchCourses } from "./french";
import { units as languageUnits } from "./g8-language";
import { units as mathUnits } from "./g8-math";
import { units as scienceUnits } from "./g8-science";
import { units as socialUnits } from "./g8-social";

// Alberta Grade 8. Units the BC or Ontario Grade 8 courses already have are shared with Alberta's own
// standards text; the rest are written for the Alberta programs of study (Mathematics K–9, 2007; English
// Language Arts, 2000; Science 7–9, 2003; Social Studies, 2005).

export const courses: Course[] = [
  {
    grade: "8",
    subject: "math",
    bigIdeas: {
      "ca-ab": [
        "Number: develop number sense, with perfect squares, square roots, percents, ratios and rates, and operations on fractions and integers",
        "Patterns and Relations: graph and analyze linear relations, and solve linear equations",
        "Shape and Space: use the Pythagorean theorem, nets, surface area, volume and views, and describe congruence",
        "Statistics and Probability: critique how data is shown, and use probability to solve problems with independent events",
      ],
    },
    units: mathUnits,
    shares: {
      "fraction-operations": { standards: ab("N6", "multiplying and dividing positive fractions and mixed numbers") },
      "ratios-and-rates": { standards: ab("N4, N5", "ratios, rates and proportional reasoning") },
      "integers-8": { standards: ab("N7", "multiplying and dividing integers") },
      "pythagorean-theorem": { standards: ab("SS1", "developing and applying the Pythagorean theorem") },
      "surface-area-volume": { standards: ab("SS3, SS4", "surface area and volume of prisms and cylinders") },
    },
    order: {
      "ca-ab": ["squares-roots-ab", "percents-ab", "ratios-and-rates", "fraction-operations", "integers-8", "linear-relations-ab", "bracket-equations-ab", "pythagorean-theorem", "nets-views-ab", "surface-area-volume", "congruence-ab", "graph-critique-ab", "independent-events-ab"],
    },
  },
  {
    grade: "8",
    subject: "language",
    bigIdeas: {
      "ca-ab": [
        "General Outcome 1: students explore thoughts, ideas, feelings and experiences",
        "General Outcome 2: students listen, speak, read, write, view and represent to comprehend and respond personally and critically",
        "General Outcome 3: students manage ideas and information",
        "General Outcome 4: students enhance the clarity and artistry of communication",
        "General Outcome 5: students respect, support and collaborate with others",
      ],
    },
    units: languageUnits,
    shares: {
      "close-reading": { standards: ab("General Outcome 2", "making inferences and analyzing complex texts") },
      "literary-devices": { standards: ab("General Outcome 2", "literary devices such as symbolism and irony") },
      "argument-and-media": { standards: ab("General Outcomes 2, 3", "analyzing arguments, media and perspectives") },
      "grammar-and-style": { standards: ab("General Outcome 4", "sentence structure, grammar and style") },
      "word-study": { standards: ab("General Outcome 4", "word meanings, roots and correct usage") },
      "irony-satire-8": { standards: ab("General Outcome 2", "irony and satire") },
      "narrator-8": { standards: ab("General Outcome 2", "the narrator and point of view") },
      "forms-features-8": { standards: ab("General Outcomes 2, 3", "text forms and features") },
      "strategies-8": { standards: ab("General Outcome 2", "reading strategies for complex texts") },
      "digital-8": { standards: ab("General Outcome 3", "finding and judging information in digital texts") },
      "writing-8": { standards: ab("General Outcomes 3, 4", "planning, drafting and revising writing") },
    },
    order: {
      "ca-ab": ["respectful-talk-ab", "close-reading", "strategies-8", "narrator-8", "literary-devices", "irony-satire-8", "forms-features-8", "argument-and-media", "digital-8", "writing-8", "grammar-and-style", "word-study"],
    },
  },
  {
    grade: "8",
    subject: "science",
    bigIdeas: {
      "ca-ab": [
        "Unit A, Mix and Flow of Matter: substances mix and flow, and their properties can be explained with the particle model",
        "Unit B, Cells and Systems: living things are made of cells, and body systems work together",
        "Unit C, Light and Optical Systems: light behaves in predictable ways, and optical devices use it",
        "Unit D, Mechanical Systems: machines transmit force and motion, and some are more efficient than others",
        "Unit E, Freshwater and Saltwater Systems: water shapes Earth's surface and supports life, and people protect its quality",
      ],
    },
    units: scienceUnits,
    shares: {
      "particles-and-matter": { standards: ab("Unit A: Mix and Flow of Matter", "pure substances, mixtures and the particle model of matter") },
      "viscosity-flow-8": { standards: ab("Unit A: Mix and Flow of Matter", "viscosity and how fluids flow") },
      "density-buoyancy-8": { standards: ab("Unit A: Mix and Flow of Matter", "density and buoyancy") },
      "pressure-pascal-8": { standards: ab("Unit A: Mix and Flow of Matter", "pressure in fluids") },
      "hydraulics-pneumatics-8": { standards: ab("Unit A: Mix and Flow of Matter", "hydraulic and pneumatic systems") },
      "cells-and-life": { standards: ab("Unit B: Cells and Systems", "cells as the basic unit of living things") },
      "cells-organisms-8": { standards: ab("Unit B: Cells and Systems", "cells, tissues and organisms") },
      "systems-8": { standards: ab("Unit B: Cells and Systems", "how body systems work together") },
      "light-and-radiation": { standards: ab("Unit C: Light and Optical Systems", "how light behaves and travels") },
      "work-energy-8": { standards: ab("Unit D: Mechanical Systems", "work, energy and efficiency") },
      "machines-8": { standards: ab("Unit D: Mechanical Systems", "simple and compound machines") },
      "water-systems-8": { standards: ab("Unit E: Freshwater and Saltwater Systems", "Earth's water systems") },
      "water-stewardship-8": { standards: ab("Unit E: Freshwater and Saltwater Systems", "protecting water quality") },
    },
    order: {
      "ca-ab": ["mixtures-solutions-ab", "particles-and-matter", "viscosity-flow-8", "density-buoyancy-8", "pressure-pascal-8", "hydraulics-pneumatics-8", "cells-and-life", "cells-organisms-8", "cells-diffusion-ab", "systems-8", "body-systems-ab", "light-behaviour-ab", "light-and-radiation", "optics-vision-ab", "machines-8", "work-energy-8", "gears-efficiency-ab", "water-systems-8", "water-quality-ab", "shores-streams-ab", "aquatic-life-ab", "water-stewardship-8"],
    },
  },
  {
    grade: "8",
    subject: "social",
    bigIdeas: {
      "ca-ab": [
        "Historical Models of Societies is the Grade 8 focus",
        "8.1 Japan: how Japan's land, values and history shaped it before and after the Tokugawa and Meiji periods",
        "8.2 Renaissance Europe: how new ideas in art, learning and trade changed Europe",
        "8.3 The Spanish and the Aztecs: what happened when the Spanish met the Mexica, who are living peoples with living cultures",
      ],
    },
    units: socialUnits,
    shares: {
      "renaissance-and-reformation": { standards: ab("8.2", "the Renaissance, the Reformation and their effects on Europe") },
    },
    order: {
      "ca-ab": ["japan-land-values-ab", "japan-tokugawa-ab", "japan-meiji-ab", "renaissance-origins-ab", "renaissance-art-ideas-ab", "renaissance-and-reformation", "aztec-empire-ab", "spain-worldview-ab", "conquest-contact-ab", "worldviews-skills-ab"],
    },
  },
  ...frenchCourses("8"),
];
