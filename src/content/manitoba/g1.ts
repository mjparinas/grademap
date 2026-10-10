import type { Course } from "../types";
import { courses as ontario } from "../ontario/g1";
import { frenchCourses } from "./french";
import { adopt, course, unitsOf } from "./kit";
import { unit as manitobaAndCanada } from "./units/g1-social";

// Manitoba Grade 1. Math follows the Grade 1 mathematics outcomes (1.N, 1.PR, 1.SS), English language arts the ELA curriculum
// (strands A to D), science the Grade 1 science outcomes (SCI.1) and social studies Connecting and Belonging (1-K outcomes).
// Units BC or Ontario already has are listed with the Manitoba outcomes they practise.

export const courses: Course[] = [
  course("1", "math", {
    share: {
      "numbers-to-20": ["1.N.1, 1.N.4, 1.N.5, 1.N.8", "counting, representing and comparing numbers to 20, and one more and one less"],
      "make-ten": ["1.N.9, 1.N.10", "addition and subtraction facts to 10 and making 10"],
      adding: ["1.N.9, 1.N.10", "addition facts to 20 with counting on and doubles"],
      "take-away": ["1.N.9, 1.N.10", "subtraction facts to 20 as the opposite of addition"],
      "equal-or-not": ["1.PR.3, 1.PR.4", "equality as a balance, and recording equalities with the equal symbol"],
      patterns: ["1.PR.1, 1.PR.2", "repeating patterns, and translating them from one form to another"],
      measuring: ["1.SS.1", "measurement as comparing attributes of objects"],
      shapes: ["1.SS.2, 1.SS.3, 1.SS.4", "sorting and building 2-D shapes and 3-D objects"],
    },
  }),
  course("1", "language", {
    share: {
      "blend-it": ["ELA.1.A2.1, ELA.1.A2.3", "blending and segmenting sounds to read and spell words"],
      "short-vowels": ["ELA.1.A2.3, ELA.1.C3.2", "short vowel sounds in reading and spelling"],
      "word-families": ["ELA.1.A2.1, ELA.1.A2.3", "word families and rhyming patterns"],
      "sh-ch-th": ["ELA.1.A2.3", "the sounds sh, ch and th"],
      "sight-words": ["ELA.1.A2.6, ELA.1.C3.2", "recognizing and spelling high-frequency words"],
      sentences: ["ELA.1.C3.3, ELA.1.C3.4", "capital letters and periods in sentences"],
      "story-time": ["ELA.1.B2.6", "story elements, and retelling in order"],
      "describing-words": ["ELA.1.A2.5, ELA.1.C2.3", "describing words and opposites"],
      "more-than-one": ["ELA.1.A2.4, ELA.1.C3.2", "word endings that make plurals"],
    },
    adopted: adopt(unitsOf(ontario, "language"), {
      "sentence-types": ["ELA.1.C2.2, ELA.1.C3.4", "sentences that tell, ask and exclaim, and the punctuation they need"],
      "think-it-through": ["ELA.1.B2.5, ELA.1.B2.6", "using strategies to check and show understanding of a text"],
    }),
  }),
  course("1", "science", {
    share: {
      materials: ["SCI.1.E.1, SCI.1.E.2, SCI.1.E.3", "matter, its properties and how they suit materials to jobs"],
      "sky-and-seasons": ["SCI.1.E.6, SCI.1.E.7", "patterns of the Sun and Moon, and daily and seasonal change"],
      "living-things": ["SCI.1.E.9, SCI.1.E.11", "how living things differ from non-living things, and the variety of organisms"],
      "animal-survival": ["SCI.1.E.8, SCI.1.E.10", "how seasons affect organisms, and what living things need"],
    },
    adopted: adopt(unitsOf(ontario, "science"), {
      "energy-in-our-lives": ["SCI.1.E.4, SCI.1.E.5", "energy makes things happen, and the sources of energy"],
      "think-like-a-scientist": ["SCI.1.D.1, SCI.1.C.3", "asking questions and trying to explain what is happening"],
    }),
    order: ["think-like-a-scientist", "materials", "energy-in-our-lives", "sky-and-seasons", "living-things", "animal-survival"],
  }),
  course("1", "social", {
    share: {
      "my-community": ["1-KC-005, 1-KC-006, 1-KI-008", "responsibilities and rights, characteristics of communities, and how people help one another"],
      "different-and-alike": ["1-KI-010, 1-KI-011", "the many ways people live and express themselves, and what communities share"],
      "our-land": ["1-KL-012, 1-KH-019", "how people depend on the environment, and the patterns of the seasons"],
      maps: ["1-KL-014, 1-KL-015, 1-KL-016", "maps and globes, land and water, and finding places with relative terms"],
    },
    adopted: adopt(unitsOf(ontario, "social"), {
      "respect-and-inclusion": ["1-KP-024, 1-KP-025, 1-KP-026", "rules, solving conflicts and dealing with bullying"],
      "community-services": ["1-KC-006, 1-KE-029", "how people depend on and help one another, and sharing work"],
    }),
    own: [manitobaAndCanada],
    order: ["mb-manitoba-and-canada", "my-community", "different-and-alike", "respect-and-inclusion", "community-services", "our-land", "maps"],
  }),
  ...frenchCourses("1"),
];
