import type { Course } from "../types";
import { ab } from "./kit";
import { units as mathUnits } from "./g6-math";
import { units as scienceUnits } from "./g6-science";
import { units as socialUnits } from "./g6-social";

// Alberta Grade 6. Units that BC or Ontario already have, and that truly fit the Alberta outcomes, are
// shared with Alberta standards text. The rest are written for Alberta (ids end in -ab). Social studies
// is entirely new: Alberta's Grade 6 focus is Democracy.

const LANG_COLLAB = "Offer relevant information and logical reasoning to enhance collaborative dialogue.";
const LANG_TEXTS = "Analyze texts and interpret contexts to build comprehension.";
const LANG_WRITE = "Refine and adjust writing through creative and critical thinking to reflect individuality and skills.";
const LANG_CONVENTIONS = "Apply grammar, spelling, and punctuation accurately and skillfully in written communication.";
const LANG_ORGANIZED = "Analyze how a variety of texts are organized and can influence understandings of ourselves, other people, and the world.";

export const courses: Course[] = [
  {
    grade: "6",
    subject: "math",
    bigIdeas: {
      "ca-ab": [
        "Number: Work with positive and negative whole numbers and decimals to thousandths, add and subtract integers, use prime factorization and powers, and multiply and divide decimals with standard algorithms.",
        "Fractions and ratios: Relate fractions to division, add and subtract fractions, multiply a fraction by a whole number, and use unit rates, equivalent ratios and percents.",
        "Algebra: Evaluate expressions with powers, use the commutative, associative and distributive properties, and solve one- and two-step equations.",
        "Patterns: Study functions through tables of values, increasing and decreasing sequences and algebraic expressions.",
        "Geometry: Analyze shapes through reflection, rotation and symmetry, and use the Cartesian plane to describe location and transformations.",
        "Measurement: Find the area of parallelograms, triangles and composite figures, and the volume of prisms.",
      ],
    },
    units: mathUnits,
    shares: {
      "numbers-6": { standards: ab("6N1.1", "positive and negative numbers, comparing integers and decimals to thousandths") },
      "factors-6": { standards: ab("6N3.1", "divisibility, prime and composite numbers and prime factorization") },
      "decimal-multiply-divide": { standards: ab("6N2.1, 6N4.1", "adding, subtracting, multiplying and dividing decimals with standard algorithms") },
      "fractions-6": { standards: ab("6N5.1, 6N6.1, 6N7.1", "fractions as quotients, adding and subtracting fractions, and multiplying a fraction by a whole number") },
      "percents-6": { standards: ab("6N8.1", "unit rates, equivalent ratios and percent of a number") },
      equations: { standards: ab("6A1.1, 6A1.3", "order of operations and solving one- and two-step equations") },
      "patterns-and-graphs": { standards: ab("6P1.1", "functions as tables of values, expressions and graphs") },
      "perimeter-and-area": { standards: ab("6M1.1, 6M1.2", "area of parallelograms, triangles and composite figures") },
      "volume-and-capacity": { standards: ab("6M2.1", "volume of rectangular prisms") },
      transformations: { standards: ab("6G1.2, 6CG1.1, 6CG1.2", "the Cartesian plane and translations, reflections and rotations") },
    },
    order: {
      "ca-ab": [
        "numbers-6", "integer-moves-ab", "factors-6", "exponents-ab", "decimal-multiply-divide", "fractions-6", "percents-6",
        "equations", "patterns-and-graphs", "symmetry-ab", "transformations", "perimeter-and-area", "volume-and-capacity",
      ],
    },
  },
  {
    grade: "6",
    subject: "language",
    bigIdeas: {
      "ca-ab": [
        "Listening and speaking: Offer relevant information and logical reasoning in group conversations.",
        "Reading: Analyze texts and their contexts to build understanding.",
        "Writing: Refine writing through creative and critical thinking so it reflects your own voice and skills.",
        "Conventions: Use grammar, spelling and punctuation accurately and skillfully.",
        "Texts and the world: Analyze how a variety of texts are organized and how they can shape the way we see ourselves, other people and the world.",
      ],
    },
    units: [],
    shares: {
      "persuasive-writing": { standards: ab(`${LANG_COLLAB}; ${LANG_WRITE}`, "building a claim with reasons and answering the other side in persuasive writing") },
      "close-reading": { standards: ab(LANG_TEXTS, "main ideas, inferences and text evidence") },
      "point-of-view": { standards: ab(LANG_TEXTS, "the narrator's point of view") },
      "figurative-language": { standards: ab(LANG_TEXTS, "simile, metaphor, personification, hyperbole and idioms") },
      "connotation-tone": { standards: ab(LANG_ORGANIZED, "word choice, connotation and tone, and how they influence readers") },
      "text-forms-6": { standards: ab(LANG_ORGANIZED, "text forms, text patterns and features") },
      "sources-bias": { standards: ab(LANG_ORGANIZED, "evaluating sources, bias and point of view") },
      agreement: { standards: ab(LANG_CONVENTIONS, "subject-verb and pronoun agreement") },
      "sentence-repair": { standards: ab(LANG_CONVENTIONS, "fixing fragments, run-ons and comma splices") },
      "commas-clauses": { standards: ab(LANG_CONVENTIONS, "clauses and commas") },
      "punctuation-6": { standards: ab(LANG_CONVENTIONS, "commas after transitions, colons and other punctuation") },
    },
    order: {
      "ca-ab": [
        "close-reading", "point-of-view", "figurative-language", "connotation-tone", "text-forms-6", "sources-bias",
        "persuasive-writing", "agreement", "sentence-repair", "commas-clauses", "punctuation-6",
      ],
    },
  },
  {
    grade: "6",
    subject: "science",
    bigIdeas: {
      "ca-ab": [
        "Matter: How can the particles of matter be influenced by heating or cooling?",
        "Energy (forces): In what ways can interactions between objects lead to physical change?",
        "Energy (resources): How are energy resources used, and what influences which ones people choose?",
        "Working like a scientist: Investigate, build and test ideas safely, and look at traditional and modern technologies.",
      ],
    },
    units: scienceUnits,
    shares: {
      "forces-at-work": { standards: ab("6E 1.1", "forces such as friction and gravity acting between objects") },
      "electrical-energy-6": { standards: ab("6E 2.2", "energy resources processed into electricity, and using electrical energy wisely") },
    },
    order: {
      "ca-ab": [
        "particles-heat-ab", "thermometers-ab", "expansion-water-ab", "forces-interactions-ab", "forces-at-work", "shape-changes-ab",
        "energy-resources-ab", "electrical-energy-6",
      ],
    },
  },
  {
    grade: "6",
    subject: "social",
    bigIdeas: {
      "ca-ab": [
        "Democracy: history, principles and operation. A democracy is government by the people, with rights, rules and responsibilities.",
        "Principles of democracy: equality, majority rule with minority rights, the rule of law, and direct and representative democracy.",
        "Ancient Athens and the Roman Republic: two early ways of sharing power, and who was left out.",
        "Haudenosaunee Confederacy: an Indigenous system of decision making by consensus, with clan mothers and a Grand Council.",
        "Canada today: federal, provincial and municipal governments, and the Canadian Charter of Rights and Freedoms.",
        "Taking part: formal and informal ways citizens take part, and how to respond to discrimination and racism.",
      ],
    },
    units: socialUnits,
    order: {
      "ca-ab": [
        "democracy-principles-ab", "athens-ab", "rome-republic-ab", "haudenosaunee-ab", "governments-canada-ab",
        "charter-ab", "civic-participation-ab", "discrimination-racism-ab",
      ],
    },
  },
];
