import type { Course } from "../types";
import { frenchCourses } from "./french";
import { ab } from "./kit";
import { units as languageUnits } from "./g2-language";
import { units as mathUnits } from "./g2-math";
import { units as scienceUnits } from "./g2-science";
import { units as socialUnits } from "./g2-social";

// Alberta Grade 2. Units that BC or Ontario already have and that fit the Alberta outcomes are shared; the rest are
// written for Alberta in the g2-*.ts files. French is added by the lead.

export const courses: Course[] = [
  {
    grade: "2",
    subject: "math",
    bigIdeas: {
      "ca-ab": [
        "Number and operations: students analyze quantities to 1000, using place value, counting, odd and even numbers, benchmarks and comparison.",
        "Addition and subtraction: students investigate addition and subtraction within 100, and know that sums can be composed in more than one way.",
        "Fractions: students interpret part-whole relationships using unit fractions with 10 or fewer equal parts.",
        "Patterns: students explain and analyze increasing and decreasing patterns, with numbers and with objects.",
        "Measurement: students communicate length using non-standard units and centimetres.",
        "Geometry: students analyze and explain the sides, vertices and faces of shapes, and investigate slides, flips and turns.",
        "Time: students relate how long something takes to days, weeks, months, years and minutes.",
      ],
    },
    units: mathUnits,
    shares: {
      "tens-and-ones": { standards: ab("2N1.1", "reading, writing and building two-digit numbers with tens and ones") },
      "numbers-to-200": { standards: ab("2N1.2, 2N1.3", "counting forwards and backwards by 1s, 10s and 100s, skip counting, and even and odd numbers") },
      "bigger-or-smaller": { standards: ab("2N1.5", "comparing numbers and showing equal and unequal with =, ≠, < and >") },
      "adding-to-100": { standards: ab("2N2.1, 2N2.2", "adding and subtracting within 100 in more than one way") },
      patterns: { standards: ab("2P1.1, 2P1.2", "describing, extending and creating increasing and decreasing patterns") },
      measuring: { standards: ab("2M1.1, 2M1.2", "measuring length with non-standard units and centimetres, and using referents") },
      shapes: { standards: ab("2G1.1", "sides, vertices and faces of 2D shapes and 3D objects, and sorting shapes by attributes") },
    },
    order: {
      "ca-ab": ["tens-and-ones", "numbers-to-200", "numbers-to-1000-ab", "bigger-or-smaller", "adding-to-100", "unit-fractions-ab", "patterns", "measuring", "shapes", "slides-flips-turns-ab", "time-ab"],
    },
  },
  {
    grade: "2",
    subject: "language",
    bigIdeas: {
      "ca-ab": [
        "Listening and speaking: students adjust how they listen and speak to communicate clearly and build positive relationships.",
        "Reading: students make connections between letters and sounds to read fluently, and use strategies such as rereading and predicting to understand stories and information texts.",
        "Questions: students ask and answer questions to clarify information.",
        "Creating and sharing: students create imaginative representations or dramatizations of stories with characters, setting and plot.",
        "Writing: students clarify written ideas using appropriate vocabulary, grammar and punctuation.",
      ],
    },
    units: languageUnits,
    shares: {
      "sound-detectives": { standards: ab("Make connections between letters and the sounds they represent to read fluently and spell words correctly.", "matching letters to sounds to read and spell words") },
      "word-power": { standards: ab("Clarify written ideas and information through use of appropriate vocabulary, grammar, and punctuation.", "building vocabulary and using plurals and opposites") },
      "super-sentences": { standards: ab("Clarify written ideas and information through use of appropriate vocabulary, grammar, and punctuation.", "writing complete sentences with capitals and end marks") },
      "build-sentences": { standards: ab("Clarify written ideas and information through use of appropriate vocabulary, grammar, and punctuation.", "statements, questions, commands and exclamations, and joining sentences") },
      "grammar-2": { standards: ab("Clarify written ideas and information through use of appropriate vocabulary, grammar, and punctuation.", "nouns, pronouns, verbs and joining words") },
      "punctuation-2": { standards: ab("Clarify written ideas and information through use of appropriate vocabulary, grammar, and punctuation.", "capital letters, commas in lists, apostrophes and quotation marks") },
      "reading-detectives": { standards: ab("Use a variety of reading strategies, including altering speed, rereading, and making predictions, to understand the message in a story or an informational text.", "predicting, rereading and understanding stories and information texts") },
      "text-features": { standards: ab("Use a variety of reading strategies, including altering speed, rereading, and making predictions, to understand the message in a story or an informational text.", "using the table of contents, charts and other text features to understand information") },
      "story-builders": { standards: ab("Create imaginative representations or dramatizations of stories that include characters, setting, and plot.", "characters, setting, plot and retelling a story") },
    },
    order: {
      "ca-ab": ["listen-and-speak-ab", "sound-detectives", "word-power", "super-sentences", "build-sentences", "grammar-2", "punctuation-2", "reading-detectives", "text-features", "ask-and-answer-ab", "story-builders"],
    },
  },
  {
    grade: "2",
    subject: "science",
    bigIdeas: {
      "ca-ab": [
        "Materials: students examine properties, types and suitability of natural and processed materials.",
        "Light and sound: students investigate the sources and behaviours of light and sound.",
        "Earth: students examine landforms, bodies of water and Earth's relationship to the Sun.",
        "Living things: students investigate how plants and animals grow and develop, and how people affect them.",
        "Computer science: students apply creativity to design precise, reliable and efficient instructions.",
        "Nature of science: students describe the purposes and procedures of investigations.",
      ],
    },
    units: scienceUnits,
    shares: {
      "think-like-a-scientist": { standards: ab("2SM 1.1, 2SM 1.2", "asking questions, carrying out simple investigations and recording what you observe") },
      "life-cycles": { standards: ab("2LS 1.2, 2LS 1.3", "how plants and animals are like their parents and the stages of their life cycles") },
      "animals-and-people": { standards: ab("2LS 1.1", "positive and negative ways people affect plants and animals") },
    },
    order: {
      "ca-ab": ["think-like-a-scientist", "materials-ab", "light-and-sound-ab", "landforms-ab", "waters-ab", "day-and-year-ab", "life-cycles", "animals-and-people", "instructions-ab"],
    },
  },
  {
    grade: "2",
    subject: "social",
    bigIdeas: {
      "ca-ab": [
        "Focus: Canada, communities and heritage.",
        "Canada's physical regions and natural resources shape how communities live and work.",
        "Leaders in Canada, including the prime minister and the premiers, make decisions for the people they serve.",
        "Traditions and heritages across Canada include those of First Nations, Métis, Inuit, francophones and many other communities.",
        "Trade and transportation support communities by bringing people what they need.",
        "Democratic discussion and decision making need listening, respect, reasons and fair voting.",
      ],
    },
    units: socialUnits,
    shares: {
      "traditions-and-celebrations": { standards: ab("traditions and heritages across Canada, including those of First Nations, Métis, Inuit, francophones, and diverse communities", "celebrations and traditions in different families and communities") },
      "groups-in-our-community": { standards: ab("traditions and heritages across Canada, including those of First Nations, Métis, Inuit, francophones, and diverse communities", "the groups and cultures that make up a community, and where families come from") },
    },
    order: {
      "ca-ab": ["regions-resources-ab", "heritage-ab", "traditions-and-celebrations", "groups-in-our-community", "trade-transport-ab", "leaders-ab", "talking-together-ab"],
    },
  },
  ...frenchCourses("2"),
];
