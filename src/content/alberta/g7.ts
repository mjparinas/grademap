import type { Course } from "../types";
import { units as mathUnits } from "./g7-math";
import { units as scienceUnits } from "./g7-science";
import { units as socialUnits } from "./g7-social";
import { ab } from "./kit";

// Alberta Grade 7. Units the BC or Ontario course already has are shared with Alberta's own standards text;
// the rest are written for the Alberta programs of study (Mathematics K–9, 2007; English Language Arts, 2000;
// Science 7–9, 2003; Social Studies, 2005).

export const courses: Course[] = [
  {
    grade: "7",
    subject: "math",
    bigIdeas: {
      "ca-ab": [
        "Number: develop number sense, with divisibility, decimals, fractions, percents and integers",
        "Patterns and Relations: use patterns to describe the world, and represent algebraic expressions in many ways",
        "Shape and Space: use direct and indirect measurement, describe 2-D shapes and 3-D objects, and describe position and motion",
        "Statistics and Probability: collect, display and analyze data, and use probability to represent and solve problems",
      ],
    },
    units: mathUnits,
    shares: {
      "decimal-operations": { standards: ab("N2", "adding, subtracting, multiplying and dividing decimals") },
      "fractions-decimals-percents": { standards: ab("N3, N4", "percents from 1% to 100%, and terminating and repeating decimals as fractions") },
      "tax-tips-discounts": { standards: ab("N3", "solving percent problems, including sales tax, tips and discounts") },
      "integer-add-subtract": { standards: ab("N6", "adding and subtracting integers") },
      "linear-relations": { standards: ab("PR1, PR2", "linear relations, tables of values and graphs") },
      "two-step-equations": { standards: ab("PR7", "solving linear equations of the form ax + b = c") },
      circles: { standards: ab("SS1, SS2", "radius, diameter, circumference and area of circles") },
      "coordinates-transformations": { standards: ab("SS4, SS5", "plotting points in four quadrants and transforming shapes") },
      "circle-graphs": { standards: ab("SP3", "constructing and interpreting circle graphs") },
      probability: { standards: ab("SP4, SP5, SP6", "probability as ratios, fractions and percents, and two independent events") },
    },
    order: {
      "ca-ab": [
        "divisibility-ab",
        "decimal-operations",
        "fractions-ab",
        "compare-order-ab",
        "fractions-decimals-percents",
        "tax-tips-discounts",
        "integer-add-subtract",
        "linear-relations",
        "expressions-ab",
        "two-step-equations",
        "circles",
        "area-constructions-ab",
        "coordinates-transformations",
        "central-tendency-ab",
        "circle-graphs",
        "probability",
      ],
    },
  },
  {
    grade: "7",
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
    units: [],
    shares: {
      "close-reading": { standards: ab("General Outcome 2", "making inferences and analyzing complex texts") },
      "literary-devices": { standards: ab("General Outcome 2", "foreshadowing, symbolism and other literary devices") },
      "tone-mood": { standards: ab("General Outcomes 2, 4", "word choice, voice, tone and mood") },
      "point-of-view-7": { standards: ab("General Outcome 2", "the narrator's point of view") },
      "poetry-lab": { standards: ab("General Outcomes 1, 2", "poetry, text forms and responding to what you read") },
      persuasion: { standards: ab("General Outcomes 2, 3", "analyzing arguments and perspectives") },
      "source-check": { standards: ab("General Outcome 3", "checking sources for bias and reliability") },
      "text-patterns-7": { standards: ab("General Outcomes 2, 3", "text patterns and features in information texts") },
      "clauses-sentences": { standards: ab("General Outcome 4", "complex sentences that combine phrases and clauses") },
      "modifiers-parallelism": { standards: ab("General Outcome 4", "sentence structure, modifiers and parallel ideas") },
      "grammar-7": { standards: ab("General Outcome 4", "parts of sentences, such as predicate nouns and participles") },
      "semicolons-colons-dashes": { standards: ab("General Outcome 4", "semicolons, colons and dashes") },
      "punctuation-7": { standards: ab("General Outcome 4", "punctuating quotations, conjunctive adverbs and interruptions") },
      "word-mix-ups": { standards: ab("General Outcome 4", "commonly confused words and correct usage") },
    },
    order: {
      "ca-ab": [
        "close-reading",
        "point-of-view-7",
        "literary-devices",
        "tone-mood",
        "poetry-lab",
        "text-patterns-7",
        "source-check",
        "persuasion",
        "clauses-sentences",
        "grammar-7",
        "modifiers-parallelism",
        "punctuation-7",
        "semicolons-colons-dashes",
        "word-mix-ups",
      ],
    },
  },
  {
    grade: "7",
    subject: "science",
    bigIdeas: {
      "ca-ab": [
        "Unit A, Interactions and Ecosystems: living things depend on each other and on their environment, and people affect ecosystems",
        "Unit B, Plants for Food and Fibre: how plants grow, how people use them, and how to grow them sustainably",
        "Unit C, Heat and Temperature: heat is the movement of particles, and it can be transferred and controlled",
        "Unit D, Structures and Forces: structures are designed to carry loads safely, and forces act on them",
        "Unit E, Planet Earth: evidence from rocks, fossils and landforms shows how Earth has changed over time",
      ],
    },
    units: scienceUnits,
    shares: {
      "ecosystems-7": { standards: ab("Unit A: Interactions and Ecosystems", "ecosystems, living and non-living parts and limiting factors") },
      "food-chains-7": { standards: ab("Unit A: Interactions and Ecosystems", "producers, consumers, decomposers and energy transfer") },
      "cycles-succession-7": { standards: ab("Unit A: Interactions and Ecosystems", "cycles of matter and how ecosystems change over time") },
      "human-impact-7": { standards: ab("Unit A: Interactions and Ecosystems", "how people and their technologies affect ecosystems") },
      "heat-particles-7": { standards: ab("Unit C: Heat and Temperature", "heat, temperature and the particle model") },
      "heat-transfer-7": { standards: ab("Unit C: Heat and Temperature", "conduction, convection, radiation and controlling heat transfer") },
      "structures-forces-7": { standards: ab("Unit D: Structures and Forces", "kinds of structures, forces and how structures stay stable") },
      "safe-structures-7": { standards: ab("Unit D: Structures and Forces", "designing safe structures and why structures fail") },
      "restless-earth": { standards: ab("Unit E: Planet Earth", "Earth's layers, plate movement, earthquakes, volcanoes and fossils") },
    },
    order: {
      "ca-ab": [
        "ecosystems-7",
        "food-chains-7",
        "cycles-succession-7",
        "human-impact-7",
        "plant-parts-ab",
        "plant-uses-ab",
        "growing-crops-ab",
        "heat-particles-7",
        "heat-transfer-7",
        "structures-forces-7",
        "safe-structures-7",
        "rocks-minerals-ab",
        "restless-earth",
        "fossils-time-ab",
      ],
    },
  },
  {
    grade: "7",
    subject: "social",
    bigIdeas: {
      "ca-ab": [
        "Canada: Origins, Histories and Movement of Peoples is the Grade 7 focus",
        "7.1 Toward Confederation: how First Nations, Métis, Inuit, French and British peoples shaped what became Canada",
        "7.2 Following Confederation, Canadian Expansions: how Canada grew, including into the West, and what that meant for the people who lived there",
        "Different peoples have different perspectives on the same events, and a fair history includes many voices",
      ],
    },
    units: socialUnits,
    shares: {
      "new-france-7": { standards: ab("7.1", "daily life in New France, the fur trade and partnerships with First Nations") },
      "power-conflict-7": { standards: ab("7.1", "conflicts, treaties and changes in control between 1713 and 1800") },
      "war-1812-7": { standards: ab("7.1", "Loyalist settlement and the War of 1812") },
      "reform-rebellions-7": { standards: ab("7.1", "reform movements, the rebellions of 1837 and responsible government") },
    },
    order: {
      "ca-ab": [
        "new-france-7",
        "fur-trade-west-ab",
        "power-conflict-7",
        "war-1812-7",
        "reform-rebellions-7",
        "confederation-ab",
        "metis-red-river-ab",
        "treaties-west-ab",
        "railway-settlement-ab",
        "people-on-the-move-ab",
      ],
    },
  },
];
