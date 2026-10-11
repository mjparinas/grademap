import type { Course } from "../types";
import { courses as alberta } from "../alberta/g1";
import { courses as manitoba } from "../manitoba/g1";
import { courses as ontario } from "../ontario/g1";
import { frenchCourses } from "./french";
import { adopt, course, poolOf } from "./kit";
import { mikmawCommunities, needsWants } from "./units/g1-social";

// Nova Scotia Grade 1. Math follows the Grade 1 mathematics outcomes (N, PR, M, G), English language arts the Grade 1 ELA strand
// outcomes (A1 to C3), science the three Grade 1 learning bundles and social studies the four Grade 1 outcomes. Units BC,
// Ontario or Alberta already has are listed with the Nova Scotia outcomes they practise.

const CULTURES = "Investigate the diversity of cultural groups";
const ENVIRONMENT = "Implement age-appropriate actions for responsible behaviour in caring for the environment";

export const courses: Course[] = [
  course("1", "math", {
    share: {
      "numbers-to-20": ["N01, N03, N04, N05, N06, N07, N08", "counting, representing, comparing and estimating numbers to 20, and one more and one less"],
      "make-ten": ["N09, N10", "addition and subtraction facts to 10 and making 10"],
      adding: ["N09, N10", "addition facts to 20 with counting on and doubles"],
      "take-away": ["N09, N10", "subtraction facts to 20 as the opposite of addition"],
      "equal-or-not": ["PR03, PR04", "equality as a balance, and recording equalities with the equal symbol"],
      patterns: ["PR01", "repeating patterns with two to four elements"],
      measuring: ["M01", "measurement as comparing attributes of objects"],
      shapes: ["G01, G02, G03", "sorting, building and finding 2-D shapes and 3-D objects"],
    },
  }),
  course("1", "language", {
    share: {
      "blend-it": ["A2", "blending and segmenting sounds to read and spell words"],
      "short-vowels": ["A2", "short vowel sounds in reading and spelling"],
      "word-families": ["A2", "word families and rhyming patterns"],
      "sh-ch-th": ["A2", "the sounds sh, ch and th"],
      "sight-words": ["A2", "recognizing and spelling high-frequency words"],
      sentences: ["A3", "capital letters and periods in sentences"],
      "story-time": ["B1, B2", "story elements, and retelling in order"],
      "describing-words": ["A2, A3", "describing words and opposites"],
      "more-than-one": ["A3", "word endings that make plurals"],
    },
    adopted: adopt(poolOf("language", ontario, manitoba, alberta), {
      "sentence-types": ["A3", "sentences that tell, ask and exclaim, and the punctuation they need"],
      "think-it-through": ["B2", "using strategies to check and show understanding of a text"],
    }),
    order: ["blend-it", "short-vowels", "word-families", "sh-ch-th", "sight-words", "sentences", "sentence-types", "describing-words", "more-than-one", "story-time", "think-it-through"],
  }),
  course("1", "science", {
    share: {
      "sky-and-seasons": ["Earth and Space Science: Daily and Seasonal Changes", "patterns of the Sun and Moon, and daily and seasonal change"],
      "living-things": ["Life Science: Needs of living things", "how living things differ from non-living things, and the variety of organisms"],
      "animal-survival": ["Life Science: Needs of living things", "how seasons affect organisms, and what living things need"],
      materials: ["Physical Science: Materials, objects, and devices", "matter, its properties and how they suit materials to jobs"],
    },
    adopted: adopt(poolOf("science", ontario, manitoba, alberta), {
      "a-healthy-environment": ["Life Science: Needs of living things", "how living things and the environment depend on each other"],
      "objects-and-structures": ["Physical Science: Materials, objects, and devices", "building objects and structures to solve a problem"],
    }),
    order: ["sky-and-seasons", "living-things", "animal-survival", "a-healthy-environment", "materials", "objects-and-structures"],
  }),
  course("1", "social", {
    share: {
      "different-and-alike": [CULTURES, "the many ways people live and express themselves, and what communities share"],
      "our-land": [ENVIRONMENT, "how people depend on the environment and care for it"],
      maps: ["Investigate the locations of Mi’kmaq communities in Nova Scotia", "maps and globes, land and water, and finding places"],
    },
    own: [mikmawCommunities, needsWants],
    order: ["different-and-alike", "our-land", "ns-needs-wants-1", "maps", "ns-mikmaq-communities-1"],
  }),
  ...frenchCourses("1"),
];
