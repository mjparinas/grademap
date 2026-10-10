import type { Course } from "../types";
import { frenchCourses } from "./french";
import { ab } from "./kit";
import { units as mathUnits } from "./g3-math";
import { units as languageUnits } from "./g3-language";
import { units as scienceUnits } from "./g3-science";
import { units as socialUnits } from "./g3-social";

// Alberta Grade 3. Units the BC or Ontario Grade 3 courses already have are shared with Alberta's wording;
// the rest are written for the Alberta outcomes (the ids end in -ab).

const ELA = {
  read: "Identify how a variety of texts can communicate ideas and information.",
  fluent: "Read complex words, phrases, and passages fluently and with expression.",
  conventions: "Demonstrate grammar, spelling, and punctuation that clarify written communication.",
};

export const courses: Course[] = [
  {
    grade: "3",
    subject: "math",
    bigIdeas: {
      "ca-ab": [
        "Place value: whole numbers within 100 000 can be read, written, compared and ordered by looking at the value of each digit.",
        "Addition and subtraction within 1000 use strategies that work with place value, and multiplication and division within 100 use equal groups, arrays and tables.",
        "Fractions describe equal parts of one whole, built from unit fractions.",
        "Patterns follow rules, and an equation says that two expressions are equal; an unknown can be shown with a symbol.",
        "Shapes have properties: polygons, parallel and perpendicular lines, and right angles can be compared and moved by slides, flips and turns.",
        "Length, perimeter and angles are measured and compared, and clocks tell time to the minute.",
        "Data can be collected and shown in dot plots and bar graphs to answer a statistical question.",
      ],
    },
    units: mathUnits,
    shares: {
      "add-subtract-1000": { standards: ab("3N2.1", "adding and subtracting whole numbers within 1000 with strategies and problem solving") },
      multiplication: { standards: ab("3N3.1, 3N3.2", "multiplication as equal groups and arrays, and the multiplication tables") },
      division: { standards: ab("3N3.1, 3N3.2", "division as sharing and grouping, and the related division facts") },
      fractions: { standards: ab("3N4.1", "fractions of one whole, built from unit fractions and equal parts") },
      "patterns-and-equations": { standards: ab("3P1.1, 3P1.2, 3A1.1, 3A1.2", "number patterns, equal expressions and finding an unknown in one-step equations") },
      time: { standards: ab("3T1.1", "telling time with analog and digital clocks") },
    },
    order: {
      "ca-ab": ["numbers-100000-ab", "add-subtract-1000", "multiplication", "division", "fractions", "patterns-and-equations", "polygons-ab", "angles-ab", "moves-ab", "length-perimeter-ab", "time", "data-ab"],
    },
  },
  {
    grade: "3",
    subject: "language",
    bigIdeas: {
      "ca-ab": [
        "Speaking and listening: using eye contact, posture, gestures and movements to communicate, and listening with respect.",
        "Oral traditions carry shared knowledge for many First Nations, Métis and Inuit communities, and are shared with respect.",
        "Reading: reading words, phrases and passages fluently and with expression, and understanding how texts share ideas and information.",
        "Connecting what you read to your own experiences makes books, poems and plays easier to understand.",
        "Writing: using ideas from many sources of inspiration, and writing strategies, to create texts.",
        "Grammar, spelling and punctuation make writing clear.",
      ],
    },
    units: languageUnits,
    shares: {
      "read-and-think": { standards: ab(ELA.read, "finding main ideas, details and what a text tells us") },
      "story-elements": { standards: ab(ELA.read, "story parts such as characters, problem and solution") },
      "text-patterns": { standards: ab(ELA.read, "how texts are organized and what features help readers") },
      "fact-or-opinion": { standards: ab(ELA.read, "telling facts from opinions in texts") },
      "prefixes-suffixes": { standards: ab(`${ELA.fluent}; ${ELA.conventions}`, "reading complex words using prefixes, suffixes and base words") },
      "spelling-patterns": { standards: ab(ELA.conventions, "spelling patterns that make writing clear") },
      "word-jobs": { standards: ab(ELA.conventions, "parts of speech and how words work in sentences") },
      "sentence-smarts": { standards: ab(ELA.conventions, "writing complete, clear sentences") },
      "punctuation-power": { standards: ab(ELA.conventions, "capital letters and punctuation that clarify writing") },
    },
    order: {
      "ca-ab": ["speak-listen-ab", "oral-traditions-ab", "prefixes-suffixes", "spelling-patterns", "word-jobs", "sentence-smarts", "punctuation-power", "read-and-think", "story-elements", "text-patterns", "fact-or-opinion", "connect-texts-ab", "writing-ideas-ab"],
    },
  },
  {
    grade: "3",
    subject: "science",
    bigIdeas: {
      "ca-ab": [
        "Substances can change state, including water as it moves through the water cycle.",
        "Contact forces affect how objects move, and simple machines make work easier.",
        "Earth's surface changes over time through natural events and the activities of plants, animals and people, including farming.",
        "Layers of Earth's surface, including dinosaur fossils found in Alberta, hold information about the past.",
        "First Nations, Métis and Inuit peoples have long-held relationships with, and intergenerational knowledge of, the land.",
        "Plants, animals, people and the environment depend on each other, and food chains show how.",
        "Creativity and computational thinking help solve problems, and careful data builds scientific knowledge.",
      ],
    },
    units: scienceUnits,
    shares: {
      "food-chains": { standards: ab("3LS1.1, 3LS1.2", "food chains, and sorting animals as carnivores, herbivores or omnivores") },
      "wind-water-ice": { standards: ab("3ES1.3", "how wind, water and ice shape Earth's surface") },
      "forces-3": { standards: ab("3E1.1", "how pushes and pulls change the way objects move") },
      "skills-3": { standards: ab("3SM1.1", "investigating, collecting accurate data and staying safe") },
    },
    order: {
      "ca-ab": ["states-matter-ab", "materials-change-ab", "water-cycle-ab", "forces-3", "simple-machines-ab", "earth-changes-ab", "wind-water-ice", "soil-habitat-ab", "land-use-ab", "fossils-ab", "food-chains", "senses-ab", "protect-nature-ab", "coding-thinking-ab", "skills-3"],
    },
  },
  {
    grade: "3",
    subject: "social",
    bigIdeas: {
      "ca-ab": [
        "Alberta has distinct physical regions (the Rocky Mountains, foothills, parkland, grasslands and boreal forest) and political boundaries that it shares with its neighbours.",
        "First Nations and Métis peoples have made, and continue to make, important contributions to Alberta.",
        "Francophone settlers and communities have helped shape Alberta.",
        "Everyone deserves respect: children begin to learn what discrimination and racism are and how to stand up for fairness.",
        "Provincial and municipal governments make decisions and provide services, and citizens take part.",
        "Official symbols show what Albertans value and share.",
        "Natural resources shape Alberta's land, jobs and way of life, and need to be used wisely.",
        "Charitable giving and volunteering help communities.",
      ],
    },
    units: socialUnits,
    order: {
      "ca-ab": ["regions-ab", "first-nations-metis-ab", "francophone-ab", "fairness-ab", "governments-ab", "symbols-ab", "resources-ab", "giving-ab"],
    },
  },
  ...frenchCourses("3"),
];
