import type { Course } from "../types";
import { courses as ontario } from "../ontario/k";
import { frenchCourses } from "./french";
import { adopt, course, unitsOf } from "./kit";

// Manitoba Kindergarten. Math follows the Kindergarten mathematics outcomes (K.N, K.PR, K.SS), English language arts the
// ELA curriculum (strands A to D), science the Kindergarten science outcomes (SCI.K) and social studies the Kindergarten
// clusters (0-K outcomes). Units BC or Ontario already has are listed with the Manitoba outcomes they practise.

export const courses: Course[] = [
  course("k", "math", {
    share: {
      "count-to-10": ["K.N.3, K.N.5", "relating numerals 1 to 10 to quantities, and counting to find how many"],
      "make-5-and-10": ["K.N.4", "representing and describing numbers 2 to 10 in two parts"],
      "more-less-same": ["K.N.6", "comparing quantities 1 to 10 with one-to-one correspondence"],
      patterns: ["K.PR.1", "repeating patterns with two or three elements"],
      "shapes-and-sizes": ["K.SS.1, K.SS.2", "comparing objects by one attribute, and sorting 3-D objects"],
    },
    adopted: adopt(unitsOf(ontario, "math"), { "numbers-to-20": ["K.N.1, K.N.3", "saying the number sequence, and relating numerals to quantities"] }),
    order: ["count-to-10", "numbers-to-20", "make-5-and-10", "more-less-same", "patterns", "shapes-and-sizes"],
  }),
  course("k", "language", {
    share: {
      "letter-partners": ["ELA.K.A2.2", "naming upper- and lowercase letters"],
      "first-sounds": ["ELA.K.A2.1, ELA.K.A2.3", "identifying first sounds, and linking letters and sounds"],
      "rhyme-time": ["ELA.K.A2.1", "recognizing rhyme"],
      "clap-the-beat": ["ELA.K.A2.1", "clapping the syllables in words"],
      "sight-words": ["ELA.K.A2.3, ELA.K.C3.2", "reading and spelling familiar words"],
      "story-order": ["ELA.K.B2.6", "retelling a story in order"],
      "book-detectives": ["ELA.K.B2.1, ELA.K.B2.2", "the parts of a book, and how print and pictures carry meaning"],
      "picture-clues": ["ELA.K.B2.2, ELA.K.A2.3", "using pictures and first letters to work out a word"],
    },
    adopted: adopt(unitsOf(ontario, "language"), { "blend-a-word": ["ELA.K.A2.3", "using letters and sounds to read and spell words"] }),
    order: ["letter-partners", "first-sounds", "rhyme-time", "clap-the-beat", "blend-a-word", "sight-words", "picture-clues", "book-detectives", "story-order"],
  }),
  course("k", "science", {
    share: {
      "living-things-need": ["SCI.K.E.4", "what makes living things different from non-living things"],
      "animal-features": ["SCI.K.E.5", "the wide variety of living things"],
      materials: ["SCI.K.E.1, SCI.K.E.2", "matter, and describing materials by their properties"],
    },
    adopted: adopt(unitsOf(ontario, "science"), {
      "safe-scientists": ["SCI.K.C.4", "using materials and equipment safely"],
      "be-a-scientist": ["SCI.K.C.3, SCI.K.D.1", "asking questions and trying to explain what is happening"],
    }),
    order: ["be-a-scientist", "materials", "living-things-need", "animal-features", "safe-scientists"],
  }),
  course("k", "social", {
    share: {
      "all-about-me": ["0-KC-002, 0-KI-008", "how our actions affect others, and everyone's interests and abilities"],
      families: ["0-KC-003, 0-KI-009", "the people who care for us, and groups we live and play in"],
      "needs-and-wants": ["0-KE-025, 0-KG-020", "basic needs that people everywhere share"],
      "helpers-and-rules": ["0-KP-022, 0-KE-026", "rules and their purposes, and different kinds of work"],
    },
    adopted: adopt(unitsOf(ontario, "social"), {
      "we-belong": ["0-KI-007, 0-KC-004", "groups that matter to us, and how people cooperate"],
      "fair-and-kind": ["0-KC-002, 0-KP-024", "kind actions, and working through disagreements"],
      "places-near-me": ["0-KL-012, 0-KL-015", "the places and landmarks around us"],
    }),
    order: ["all-about-me", "families", "we-belong", "fair-and-kind", "helpers-and-rules", "needs-and-wants", "places-near-me"],
  }),
  ...frenchCourses("k"),
];
