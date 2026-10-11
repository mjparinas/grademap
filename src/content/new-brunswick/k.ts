import type { Course } from "../types";
import { courses as ontario } from "../ontario/k";
import { kNature, kProvince } from "./units/early";
import { course, adopt, poolOf } from "./kit";

// New Brunswick Kindergarten. Math and English language arts follow the Kindergarten skill descriptors, cited by strand and big
// idea. Kindergarten to Grade 2 has no separate science or social studies course: Explore Your World covers inquiry, well-being,
// play and community, so those units practise its skill descriptors. There is no French Immersion in Kindergarten (early
// entry is Grade 1).

const NUMBER = "Number: Number Sense";
const OPERATIONS = "Number: Operations";
const SHAPE = "Shape and Space: 2-D Shapes and 3-D Objects";
const PHONOLOGICAL = "Reading: Phonological Awareness";
const SUSTAINABLE = "Diversity and Social Responsibility: Sustainable Futures";
const PROBLEM = "Play and Playfulness: Exploration and Problem Solving";
const BELONGING = "Well-Being: Belonging and Interconnectedness";
const INCLUSION = "Diversity and Social Responsibility: Inclusiveness and Equity";
const DEMOCRATIC = "Diversity and Social Responsibility: Democratic Practices";

export const courses: Course[] = [
  course("k", "math", {
    share: {
      "count-to-10": [NUMBER, "counting and relating numerals to quantities to 10"],
      "make-5-and-10": [NUMBER, "ways to make 5 and 10"],
      "more-less-same": [NUMBER, "comparing quantities with one-to-one correspondence"],
      "add-and-take-away": [OPERATIONS, "joining and separating small groups"],
      patterns: ["Patterns and Relations: Algebra", "repeating patterns with two or three elements"],
      "shapes-and-sizes": [SHAPE, "sorting and describing shapes and objects by one attribute"],
    },
    adopted: adopt(poolOf("math", ontario), {
      "numbers-to-20": [NUMBER, "counting forward and back, and reading numbers to 20"],
    }),
    order: ["count-to-10", "numbers-to-20", "more-less-same", "make-5-and-10", "add-and-take-away", "patterns", "shapes-and-sizes"],
  }),
  course("k", "language", {
    share: {
      "book-detectives": ["Reading: Concepts of Print", "the parts of a book, and how print and pictures carry meaning"],
      "letter-partners": ["Reading: Fluency", "naming upper- and lowercase letters"],
      "first-sounds": [PHONOLOGICAL, "identifying first sounds and linking letters and sounds"],
      "rhyme-time": [PHONOLOGICAL, "recognizing rhyme"],
      "clap-the-beat": [PHONOLOGICAL, "clapping the syllables in words"],
      "sight-words": ["Reading: Fluency", "reading familiar words"],
      "picture-clues": ["Reading: Phonics", "using pictures and first letters to work out a word"],
      "story-order": ["Reading: Reading Comprehension", "retelling a story in order"],
    },
    adopted: adopt(poolOf("language", ontario), {
      "blend-a-word": ["Reading: Phonics", "using letters and sounds to read simple words"],
    }),
    order: ["book-detectives", "letter-partners", "first-sounds", "rhyme-time", "clap-the-beat", "blend-a-word", "sight-words", "picture-clues", "story-order"],
  }),
  course("k", "science", {
    share: {
      "living-things-need": [BELONGING, "what plants and animals need, and how living things are connected to us"],
      "animal-features": [SUSTAINABLE, "noticing patterns in the features of animals and plants"],
      materials: [PROBLEM, "gathering evidence about materials by looking, touching and testing"],
      "push-and-pull": [PROBLEM, "gathering evidence about how pushes and pulls move things"],
      "weather-and-seasons": [SUSTAINABLE, "recognizing patterns in weather and the seasons"],
    },
    adopted: adopt(poolOf("science", ontario), {
      "safe-scientists": ["Well-Being: Physical Health and Active Participation", "safe ways to explore and test"],
    }),
    own: [kNature],
    order: ["nb-nature-k", "living-things-need", "animal-features", "weather-and-seasons", "materials", "push-and-pull", "safe-scientists"],
  }),
  course("k", "social", {
    share: {
      "all-about-me": ["Well-Being: Emotional Health and Positive Identities", "interests, strengths and feelings"],
      families: [BELONGING, "families, belonging and ways we are the same and different"],
      "needs-and-wants": [BELONGING, "defining and expressing needs, wants and choices"],
      "helpers-and-rules": [DEMOCRATIC, "community helpers, rules and being responsible community members"],
    },
    adopted: adopt(poolOf("social", ontario), {
      "fair-and-kind": [INCLUSION, "noticing what is fair and kind, and honouring differences"],
      "we-belong": [INCLUSION, "belonging to groups and respecting other points of view"],
    }),
    own: [kProvince],
    order: ["nb-my-province-k", "all-about-me", "families", "we-belong", "needs-and-wants", "fair-and-kind", "helpers-and-rules"],
  }),
];
