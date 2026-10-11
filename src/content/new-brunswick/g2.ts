import type { Course } from "../types";
import { courses as ontario } from "../ontario/g2";
import { g2Nature, g2Community } from "./units/early";
import { frenchCourses } from "./french";
import { adopt, course, poolOf } from "./kit";

// New Brunswick Grade 2. Math and English language arts follow the Grade 2 skill descriptors, cited by strand and big idea.
// Science and social studies are part of Explore Your World (Kindergarten to Grade 2), so those units practise its skill
// descriptors.

const NUMBER = "Number: Number Sense";
const OPERATIONS = "Number: Operations";
const PHONICS = "Reading: Phonics";
const SUSTAINABLE = "Diversity and Social Responsibility: Sustainable Futures";
const PROBLEM = "Play and Playfulness: Exploration and Problem Solving";
const BELONGING = "Well-Being: Belonging and Interconnectedness";
const INCLUSION = "Diversity and Social Responsibility: Inclusiveness and Equity";
const DEMOCRATIC = "Diversity and Social Responsibility: Democratic Practices";

export const courses: Course[] = [
  course("2", "math", {
    share: {
      "tens-and-ones": [NUMBER, "representing numbers to 100 with tens and ones"],
      "bigger-or-smaller": [NUMBER, "comparing and ordering numbers, and using the symbols for equal and not equal"],
      "facts-to-20": [OPERATIONS, "addition and subtraction facts to 20"],
      "adding-to-100": [OPERATIONS, "adding and subtracting numbers to 100"],
      patterns: ["Patterns and Relations: Algebra", "repeating and increasing patterns"],
      measuring: ["Shape and Space: Measurement", "measuring length in centimetres and metres"],
      shapes: ["Shape and Space: 2-D Shapes and 3-D Objects", "describing 2-D shapes and 3-D objects by their attributes"],
      graphs: ["Statistics and Probability: Data Analysis", "pictorial graphs with one-to-one correspondence"],
    },
    adopted: adopt(poolOf("math", ontario), {
      "balance-the-equation": ["Patterns and Relations: Algebra", "equal expressions, unknown numbers and number patterns"],
    }),
    order: ["tens-and-ones", "bigger-or-smaller", "facts-to-20", "adding-to-100", "balance-the-equation", "patterns", "measuring", "shapes", "graphs"],
  }),
  course("2", "language", {
    share: {
      "rhyme-time": ["Reading: Phonological Awareness", "rhyme and word families"],
      "sound-detectives": [PHONICS, "listening for sounds and matching them to letters"],
      "word-power": ["Reading: Vocabulary", "word patterns, plurals and vocabulary"],
      "super-sentences": ["Representations: Sentence Structure", "capital letters, end punctuation and complete sentences"],
      "story-builders": ["Reading: Reading Comprehension", "characters, setting and the order of events"],
    },
    adopted: adopt(poolOf("language", ontario), {
      "build-sentences": ["Representations: Sentence Structure", "statements, questions, commands and compound sentences"],
      "text-features": ["Reading: Text Analysis", "text features such as headings, charts and a table of contents"],
      "reading-detectives": ["Reading: Reading Comprehension", "predicting, inferring and comparing"],
    }),
    order: ["rhyme-time", "sound-detectives", "word-power", "super-sentences", "build-sentences", "story-builders", "reading-detectives", "text-features"],
  }),
  course("2", "science", {
    share: {
      "life-cycles": [SUSTAINABLE, "recognizing patterns in the life cycles of animals"],
      "solids-and-liquids": [PROBLEM, "gathering evidence about solids and liquids"],
      "push-and-pull": [PROBLEM, "gathering evidence about forces and motion"],
      "water-world": [BELONGING, "how water is connected to us and our environment"],
    },
    adopted: adopt(poolOf("science", ontario), {
      "animal-adaptations": [SUSTAINABLE, "recognizing patterns in how animals adapt"],
      "simple-machines": [PROBLEM, "exploring how simple machines make jobs easier"],
    }),
    own: [g2Nature],
    order: ["nb-nature-2", "life-cycles", "animal-adaptations", "water-world", "solids-and-liquids", "push-and-pull", "simple-machines"],
  }),
  course("2", "social", {
    share: {
      "needs-and-wants": [BELONGING, "needs, wants and choices in our communities"],
      "caring-citizens": [DEMOCRATIC, "being responsible, caring community members"],
      "communities-in-canada": [INCLUSION, "honouring differences among communities in Canada"],
    },
    adopted: adopt(poolOf("social", ontario), {
      "groups-in-our-community": [INCLUSION, "groups and cultures in the community"],
      "traditions-and-celebrations": [INCLUSION, "traditions and celebrations in different families and communities"],
      "then-and-now": [PROBLEM, "gathering evidence about how ways of life change over time"],
    }),
    own: [g2Community],
    order: ["nb-community-2", "needs-and-wants", "caring-citizens", "groups-in-our-community", "traditions-and-celebrations", "communities-in-canada", "then-and-now"],
  }),
  ...frenchCourses("2"),
];
