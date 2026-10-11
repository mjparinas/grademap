import type { Course } from "../types";
import { courses as ontario } from "../ontario/g1";
import { g1Nature, g1Community } from "./units/early";
import { frenchCourses } from "./french";
import { adopt, course, poolOf } from "./kit";

// New Brunswick Grade 1. Math and English language arts follow the Grade 1 skill descriptors, cited by strand and big idea.
// Science and social studies are part of Explore Your World (Kindergarten to Grade 2), so those units practise its skill
// descriptors. Early French Immersion starts this year.

const NUMBER = "Number: Number Sense";
const OPERATIONS = "Number: Operations";
const SHAPE = "Shape and Space: 2-D Shapes and 3-D Objects";
const PHONICS = "Reading: Phonics";
const SUSTAINABLE = "Diversity and Social Responsibility: Sustainable Futures";
const PROBLEM = "Play and Playfulness: Exploration and Problem Solving";
const BELONGING = "Well-Being: Belonging and Interconnectedness";
const INCLUSION = "Diversity and Social Responsibility: Inclusiveness and Equity";
const DEMOCRATIC = "Diversity and Social Responsibility: Democratic Practices";

export const courses: Course[] = [
  course("1", "math", {
    share: {
      "numbers-to-20": [NUMBER, "representing, comparing and ordering numbers to 20"],
      "make-ten": [NUMBER, "ways to make 10 and other numbers to 20"],
      adding: [OPERATIONS, "addition facts to 20"],
      "take-away": [OPERATIONS, "subtraction facts to 20"],
      "equal-or-not": [NUMBER, "what equal and not equal mean"],
      patterns: ["Patterns and Relations: Algebra", "repeating patterns with several elements"],
      measuring: ["Shape and Space: Measurement", "measuring with non-standard units"],
      shapes: [SHAPE, "comparing 2-D shapes and 3-D objects"],
    },
    adopted: adopt(poolOf("math", ontario), {
      "data-and-graphs": ["Statistics and Probability: Data Analysis", "sorting and reading concrete graphs and pictographs"],
    }),
    order: ["numbers-to-20", "make-ten", "adding", "take-away", "equal-or-not", "patterns", "measuring", "shapes", "data-and-graphs"],
  }),
  course("1", "language", {
    share: {
      "blend-it": [PHONICS, "blending and segmenting sounds to read words"],
      "short-vowels": [PHONICS, "short vowel sounds and simple words"],
      "word-families": ["Reading: Phonological Awareness", "rhyme and word families"],
      "sh-ch-th": [PHONICS, "the digraphs sh, ch and th"],
      "sight-words": ["Reading: Fluency", "reading familiar words"],
      sentences: ["Representations: Sentence Structure", "capital letters, periods and complete sentences"],
      "story-time": ["Reading: Reading Comprehension", "characters, setting and events"],
      "describing-words": ["Reading: Vocabulary", "describing words and opposites"],
      "more-than-one": ["Representations: Spelling", "plurals and spelling simple words"],
    },
    adopted: adopt(poolOf("language", ontario), {
      "sentence-types": ["Representations: Sentence Structure", "telling, asking, command and exclamation sentences"],
    }),
    order: ["word-families", "blend-it", "short-vowels", "sh-ch-th", "sight-words", "describing-words", "more-than-one", "sentences", "sentence-types", "story-time"],
  }),
  course("1", "science", {
    share: {
      "living-things": [SUSTAINABLE, "noticing patterns in living and non-living things"],
      "animal-survival": [SUSTAINABLE, "how animals' features and behaviours help them survive"],
      materials: [PROBLEM, "gathering evidence about the properties of materials"],
      "sky-and-seasons": [SUSTAINABLE, "recognizing patterns in the sky and the seasons"],
      "light-and-sound": [PROBLEM, "gathering evidence about light and sound"],
    },
    adopted: adopt(poolOf("science", ontario), {
      "what-living-things-need": [BELONGING, "what living things need and how they help one another"],
    }),
    own: [g1Nature],
    order: ["nb-nature-1", "living-things", "what-living-things-need", "animal-survival", "sky-and-seasons", "materials", "light-and-sound"],
  }),
  course("1", "social", {
    share: {
      "my-community": [DEMOCRATIC, "roles and responsibilities in the community"],
      "different-and-alike": [INCLUSION, "honouring differences and what makes our families and communities unique"],
      "our-land": [BELONGING, "how natural features of the land are connected to us"],
      maps: [PROBLEM, "gathering evidence from simple maps and symbols"],
    },
    adopted: adopt(poolOf("social", ontario), {
      "respect-and-inclusion": [INCLUSION, "including others and treating people and the environment with respect"],
      "community-services": [DEMOCRATIC, "services and jobs that help the community"],
    }),
    own: [g1Community],
    order: ["nb-community-1", "different-and-alike", "respect-and-inclusion", "my-community", "community-services", "our-land", "maps"],
  }),
  ...frenchCourses("1"),
];
