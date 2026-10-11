import type { Course } from "../types";
import { courses as alberta } from "../alberta/k";
import { courses as manitoba } from "../manitoba/k";
import { courses as ontario } from "../ontario/k";
import { frenchCourses } from "./french";
import { adopt, course, poolOf } from "./kit";
import { celebrations } from "./units/k-social";
import { sandAndWater } from "./units/k-science";

// Nova Scotia Primary (Kindergarten). Math follows the Primary mathematics outcomes (N, PR, M, G), English language arts the
// Primary ELA strand outcomes (A1 to C3), science the four Primary learning bundles and social studies the three Primary
// outcomes. Units BC, Ontario or Alberta already has are listed with the Nova Scotia outcomes they practise.

const GROUPS = "Investigate groups to which they belong";
const COOPERATION = "Investigate how cooperation is an important part of being a group member";

export const courses: Course[] = [
  course("k", "math", {
    share: {
      "count-to-10": ["N01, N03, N06", "saying the number sequence, relating numerals to quantities and counting to 10"],
      "make-5-and-10": ["N04", "representing and describing numbers 2 to 10 in two parts"],
      "more-less-same": ["N05", "comparing quantities 1 to 10 with one-to-one correspondence"],
      patterns: ["PR01", "repeating patterns with two or three elements"],
      "shapes-and-sizes": ["M01, G01, G02", "comparing objects by one attribute, sorting and building 3-D objects"],
    },
    adopted: adopt(poolOf("math", ontario, alberta), {
      "numbers-to-20": ["N01", "saying the number sequence by 1s to 20"],
      "see-it-fast-ab": ["N02", "recognizing and naming small quantities at a glance"],
    }),
    order: ["count-to-10", "numbers-to-20", "see-it-fast-ab", "make-5-and-10", "more-less-same", "patterns", "shapes-and-sizes"],
  }),
  course("k", "language", {
    share: {
      "letter-partners": ["A2", "naming upper- and lowercase letters"],
      "first-sounds": ["A2", "identifying first sounds and linking letters and sounds"],
      "rhyme-time": ["A2", "recognizing rhyme"],
      "clap-the-beat": ["A2", "clapping the syllables in words"],
      "sight-words": ["A2", "reading and spelling familiar words"],
      "story-order": ["B2", "retelling a story in order"],
      "book-detectives": ["B1", "the parts of a book, and how print and pictures carry meaning"],
      "picture-clues": ["B2", "using pictures and first letters to work out a word"],
    },
    adopted: adopt(poolOf("language", ontario, alberta), {
      "blend-a-word": ["A2", "using letters and sounds to read and spell words"],
      "talk-and-listen-ab": ["A1", "listening and speaking with others"],
    }),
    order: ["talk-and-listen-ab", "letter-partners", "first-sounds", "rhyme-time", "clap-the-beat", "blend-a-word", "sight-words", "picture-clues", "book-detectives", "story-order"],
  }),
  course("k", "science", {
    share: {
      materials: ["Physical Science: Materials and the world around us", "matter, and describing materials by their properties"],
      "push-and-pull": ["Physical Science: Movement", "how pushes and pulls make objects move"],
      "living-things-need": ["Life Science: Living Things", "what makes living things different from non-living things"],
      "animal-features": ["Life Science: Living Things", "the wide variety of living things"],
    },
    adopted: adopt(poolOf("science", ontario, alberta), {
      "five-senses-ab": ["Physical Science: Materials and the world around us", "using the five senses to investigate"],
    }),
    own: [sandAndWater],
    order: ["ns-sand-and-water", "five-senses-ab", "materials", "push-and-pull", "living-things-need", "animal-features"],
  }),
  course("k", "social", {
    share: {
      families: [GROUPS, "the people who care for us, and groups we live and play in"],
      "helpers-and-rules": [COOPERATION, "rules and their purposes, and different kinds of work"],
    },
    adopted: adopt(poolOf("social", ontario, alberta, manitoba), {
      "we-belong": [GROUPS, "groups that matter to us, and how people cooperate"],
      "fair-and-kind": [COOPERATION, "kind actions, and working through disagreements"],
    }),
    own: [celebrations],
    order: ["families", "we-belong", "fair-and-kind", "helpers-and-rules", "ns-celebrations-k"],
  }),
  ...frenchCourses("k"),
];
