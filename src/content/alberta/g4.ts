import type { Course } from "../types";
import { ab } from "./kit";
import { frenchCourses } from "./french";
import { units as mathUnits } from "./g4-math";
import { units as languageUnits } from "./g4-language";
import { units as scienceUnits } from "./g4-science";
import { units as socialUnits } from "./g4-social";

// Alberta Grade 4. Units the BC or Ontario Grade 4 courses already have are shared with Alberta's wording;
// the rest are written for the Alberta outcomes (the ids end in -ab).

const ELA = {
  texts: "Identify the purpose, form, and structure of a variety of texts and how they can communicate ideas and information.",
  strategies: "Examine and apply strategies that support text comprehension.",
  write: "Create a variety of written texts to share information and develop personal expression.",
  conventions: "Examine and apply grammar, spelling, and punctuation to develop concise written communication.",
};

export const courses: Course[] = [
  {
    grade: "4",
    subject: "math",
    bigIdeas: {
      "ca-ab": [
        "Place value: whole numbers within 10 000 can be read, written, compared and ordered, and prime and composite numbers are described by their factors.",
        "Addition, subtraction, multiplication and division of whole numbers use strategies that work with place value, and the order of operations gives expressions one value.",
        "Fractions, decimals and percent are different ways to describe parts of a whole.",
        "Patterns follow rules, and equations show that two expressions are equal.",
        "Triangles, quadrilaterals and angles can be classified by their properties.",
        "Perimeter, area and time are measured and compared.",
      ],
    },
    units: mathUnits,
    shares: {
      "numbers-to-10000": { standards: ab("4N1.1", "reading, writing, comparing and ordering whole numbers within 10 000") },
      "add-subtract": { standards: ab("4N2.1", "adding and subtracting whole numbers with strategies and problem solving") },
      "times-tables": { standards: ab("4N4.1", "multiplication facts and the related division facts") },
      "multiply-divide": { standards: ab("4N4.1", "multiplying and dividing whole numbers, including 2-digit by 1-digit") },
      "big-multiply": { standards: ab("4N4.1", "multiplying and dividing larger whole numbers") },
      fractions: { standards: ab("4N5.1", "fractions as parts of a whole, and comparing and ordering them") },
      decimals: { standards: ab("4N6.1", "decimals to hundredths as parts of a whole") },
      "patterns-and-tables": { standards: ab("4P1.1, 4P1.2", "increasing and decreasing patterns and tables of values") },
      equations: { standards: ab("4A1.2", "solving one-step equations with an unknown") },
      "telling-time": { standards: ab("4T1.1", "telling and writing time on analog and digital clocks") },
      "polygons-and-perimeter": { standards: ab("4M1.1", "perimeter of polygons and the properties of shapes") },
      "metric-4": { standards: ab("4M1.2, 4M2.1", "measuring length, perimeter and area in standard units") },
    },
    order: {
      "ca-ab": ["numbers-to-10000", "add-subtract", "primes-composites-ab", "times-tables", "multiply-divide", "big-multiply", "order-of-operations-ab", "fractions", "decimals", "fractions-decimals-percent-ab", "patterns-and-tables", "equations", "shapes-angles-ab", "polygons-and-perimeter", "metric-4", "telling-time"],
    },
  },
  {
    grade: "4",
    subject: "language",
    bigIdeas: {
      "ca-ab": [
        "Listening and speaking build relationships and understanding.",
        "Reading aloud with emphasis, pausing, phrasing and intonation shows that you understand the text.",
        "Reading strategies help readers understand fiction and non-fiction texts.",
        "Texts have a purpose, a form and a structure, and these shape how they share ideas and information.",
        "Writing shares information and personal expression, and concise writing uses grammar, spelling and punctuation well.",
        "Information is accessed, shared and stored ethically, on paper or on a device.",
      ],
    },
    units: languageUnits,
    shares: {
      "reading-detectives": { standards: ab(ELA.strategies, "using strategies to understand and make inferences about a text") },
      "text-features": { standards: ab(ELA.texts, "text features that help readers find information") },
      "text-features-4": { standards: ab(ELA.texts, "headings, captions, diagrams and other text features") },
      "figurative-language": { standards: ab(ELA.texts, "similes, metaphors and other figurative language") },
      "point-of-view": { standards: ab(ELA.texts, "who is telling the story and how that shapes the text") },
      "parts-of-speech": { standards: ab(ELA.conventions, "nouns, verbs, adjectives and other parts of speech") },
      "super-sentences": { standards: ab(ELA.conventions, "writing clear, complete and varied sentences") },
      "grammar-4": { standards: ab(ELA.conventions, "grammar that makes writing clear") },
      "sentences-4": { standards: ab(ELA.conventions, "building and combining sentences") },
      "punctuation-power": { standards: ab(ELA.conventions, "punctuation that clarifies writing") },
      "punctuation-4": { standards: ab(ELA.conventions, "commas, quotation marks and other punctuation") },
      "word-builders": { standards: ab(ELA.conventions, "spelling and building words with prefixes, suffixes and roots") },
      "sound-alikes": { standards: ab(ELA.conventions, "spelling homophones and other tricky words") },
      "paragraph-power": { standards: ab(ELA.write, "writing paragraphs that share information") },
    },
    order: {
      "ca-ab": ["listening-speaking-ab", "reading-detectives", "text-features", "text-features-4", "figurative-language", "point-of-view", "parts-of-speech", "grammar-4", "super-sentences", "sentences-4", "punctuation-power", "punctuation-4", "word-builders", "sound-alikes", "paragraph-power", "sharing-information-ab"],
    },
  },
  {
    grade: "4",
    subject: "science",
    bigIdeas: {
      "ca-ab": [
        "Waste materials need to be managed, and some materials are dangerous.",
        "Gravity and magnetism are forces that act without touching.",
        "Earth's land, air, water and living things are connected, and people can help conserve them.",
        "External structures and sensory organs help organisms survive.",
        "Objects in space are connected to daily life.",
        "Design processes solve problems, and data and evidence build scientific knowledge.",
      ],
    },
    units: scienceUnits,
    shares: {
      "sense-and-respond": { standards: ab("4LS1.1, 4LS1.2", "the external structures and sensory organs of organisms and what they do") },
    },
    order: {
      "ca-ab": ["waste-and-materials-ab", "gravity-and-magnets-ab", "earth-systems-ab", "conservation-ab", "sense-and-respond", "space-and-sky-ab", "design-process-ab", "evidence-and-data-ab"],
    },
  },
  {
    grade: "4",
    subject: "social",
    bigIdeas: {
      "ca-ab": [
        "Colonial Canada and Confederation is the Grade 4 focus.",
        "Power and influence shifted among First Nations, France, Britain and the colonies before 1867.",
        "Explorers, settlers, Loyalists and traders shaped early Canada, and First Nations and Métis peoples were partners and neighbours throughout.",
        "Rebellions, responsible government and Confederation changed how Canadians were governed.",
        "Citizens have rights and responsibilities.",
      ],
    },
    units: socialUnits,
    order: {
      "ca-ab": ["power-and-influence-ab", "cartier-ab", "champlain-new-france-ab", "fur-trade-resources-ab", "treaty-of-paris-ab", "loyalists-ab", "rebellions-responsible-government-ab", "confederation-ab", "citizenship-ab"],
    },
  },
  ...frenchCourses("4"),
];
