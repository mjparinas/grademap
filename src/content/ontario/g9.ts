import type { Course } from "../types";
import { units as languageUnits } from "./g9-language";
import { units as mathUnits } from "./g9-math";
import { on } from "./kit";
import { frenchCourses } from "./french";

// Ontario Grade 9: MTH1W mathematics and ENL1W English (de-streamed courses). Units the BC course
// also has are shared; the rest are written for the Ontario expectations. The overall expectations
// below come from docs/research/ontario/expectations.json.

const G9_MATH: string[] = [
  "AA1 Social-Emotional Learning Skills: Develop and explore a variety of social-emotional learning skills in a context that supports and reflects this learning in connection with the expectations across all other strands",
  "A1 Mathematical Processes: Apply the mathematical processes to develop a conceptual understanding of, and procedural fluency with, the mathematics they are learning",
  "A2 Making Connections: Make connections between mathematics and various knowledge systems, their lived experiences, and various real-life applications of mathematics, including careers",
  "B1 Development of Numbers and Number Sets: Demonstrate an understanding of the development and use of numbers, and make connections between sets of numbers",
  "B2 Powers: Represent numbers in various ways, evaluate powers, and simplify expressions by using the relationships between powers and their exponents",
  "B3 Number Sense and Operations: Apply an understanding of rational numbers, ratios, rates, percentages, and proportions, in various mathematical contexts, and to solve problems",
  "C1 Algebraic Expressions and Equations: Demonstrate an understanding of the development and use of algebraic concepts and of their connection to numbers, using various tools and representations",
  "C2 Coding: Apply coding skills to represent mathematical concepts and relationships dynamically, and to solve problems, in algebra and across the other strands",
  "C3 Application of Relations: Represent and compare linear and non-linear relations that model real-life situations, and use these representations to make predictions",
  "C4 Characteristics of Relations: Demonstrate an understanding of the characteristics of various representations of linear and non-linear relations, using tools, including coding when appropriate",
  "D1 Collection, Representation, and Analysis of Data: Describe the collection and use of data, and represent and analyse data involving one and two variables",
  "D2 Mathematical Modelling: Apply the process of mathematical modelling, using data and mathematical concepts from other strands, to represent, analyse, make predictions, and provide insight into real-life situations",
  "E1 Geometric and Measurement Relationships: Demonstrate an understanding of the development and use of geometric and measurement relationships, and apply these relationships to solve problems, including problems involving real-life situations",
  "F1 Financial Decisions: Demonstrate the knowledge and skills needed to make informed financial decisions"
];

const G9_LANGUAGE: string[] = [
  "A1 Transferable Skills: Demonstrate an understanding of how the seven transferable skills (critical thinking and problem solving; innovation, creativity, and entrepreneurship; self-directed learning; collaboration; communication; global citizenship and sustainability; and digital literacy) are used in various language and literacy contexts",
  "A2 Digital Media Literacy: Demonstrate and apply the knowledge and skills needed to interact safely and responsibly in online environments, use digital and media tools to construct knowledge, and demonstrate learning as critical consumers and creators of media",
  "A3 Applications, Connections, and Contributions: Apply language and literacy skills in cross-curricular and integrated learning, and demonstrate an understanding of, and make connections to, diverse voices, experiences, perspectives, histories, and contributions, including those of First Nations, Métis, and Inuit individuals, communities, groups, and nations",
  "B1 Oral and Non-Verbal Communication: Apply listening, speaking, and non-verbal communication skills and strategies to understand and communicate meaning in formal and informal contexts and for various purposes and audiences",
  "B2 Language Foundations for Reading and Writing: Demonstrate an understanding of foundational language knowledge and skills, and apply this understanding when reading and writing",
  "B3 Language Conventions for Reading and Writing: Demonstrate an understanding of sentence structure, grammar, cohesive ties, and capitalization and punctuation, and apply this knowledge when reading and writing sentences, paragraphs, and a variety of texts",
  "C1 Knowledge about Texts: Apply foundational knowledge and skills to understand a variety of texts, including digital and media texts, by creators with diverse identities, perspectives, and experience, and demonstrate an understanding of the patterns, features, and elements of style associated with various text forms and genres",
  "C2 Comprehension Strategies: Apply comprehension strategies before, during, and after reading, listening to, and viewing a variety of texts, including digital and media texts, by creators with diverse identities, perspectives, and experience, in order to understand and clarify the meaning of texts",
  "C3 Critical Thinking in Literacy: Apply critical thinking skills to deepen understanding of texts, and analyze how various perspectives and topics are communicated and addressed in a variety of texts, including digital, media, and cultural texts",
  "D1 Developing Ideas and Organizing Content: Plan, develop ideas, gather information, and organize content for creating texts of various forms, including digital and media texts, on a variety of topics",
  "D2 Creating Texts: Apply knowledge and understanding of various text forms and genres to create, revise, edit, and proofread their own texts, using a variety of media, tools, and strategies, and reflect critically on created texts",
  "D3 Publishing, Presenting, and Reflecting: Select suitable and effective media, techniques, and tools to publish and present final texts, and critically analyze how well the texts address various topics"
];

export const courses: Course[] = [
  {
    grade: "9",
    subject: "math",
    bigIdeas: { "ca-on": G9_MATH },
    units: mathUnits,
    shares: {
      "rational-numbers": { standards: on("B3.1, B3.3, B3.4", "operations with positive and negative fractions, decimals and integers") },
      "exponent-laws": { standards: on("B2.2", "relationships between exponents and operations with powers") },
      polynomials: { standards: on("C1.3, C1.4", "comparing and simplifying algebraic expressions") },
      "multi-step-equations": { standards: on("C1.5", "creating and solving equations and verifying solutions") },
      "linear-relations": { standards: on("C3.2, C4.4", "linear relations, rates of change, slopes and intercepts") },
    },
    order: {
      "ca-on": ["number-sets-9", "rational-numbers", "powers-9", "exponent-laws", "rates-percents-9", "expressions-9", "polynomials", "multi-step-equations", "coding-9", "linear-relations", "lines-9", "data-9", "geometry-9", "volume-units-9", "finance-9"],
    },
  },
  {
    grade: "9",
    subject: "language",
    bigIdeas: { "ca-on": G9_LANGUAGE },
    units: languageUnits,
    shares: {
      "close-reading": { standards: on("C3.2, C3.3", "inferences and analyzing complex texts") },
      "argument-and-rhetoric": { standards: on("C3.3, C3.5, A2.3", "credibility, bias, perspectives and persuasive techniques") },
      "grammar-and-style": { standards: on("B3.1, B3.2, B3.3", "sentence structure, grammar, capitalization and punctuation") },
      "language-and-style": { standards: on("C1.5, B1.5", "elements of style, word choice and register") },
      "voices-and-perspectives": { standards: on("C1.6, C3.5", "point of view, perspectives and bias") },
    },
    order: {
      "ca-on": ["word-parts-9", "grammar-and-style", "revise-edit-9", "close-reading", "devices-9", "language-and-style", "voices-and-perspectives", "forms-features-9", "argument-and-rhetoric", "digital-9"],
    },
  },
  ...frenchCourses("9"),
];
