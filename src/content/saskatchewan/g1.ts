import type { Course } from "../types";
import { units as g1_science } from "../ontario/g1-science";
import { units as g1_social } from "../ontario/g1-social";
import { reuse, share, sk } from "./kit";
import { SK_OUTCOMES as O } from "./outcomes";

// Saskatchewan Grade 1. Units that BC or Ontario already teach, and that fit the Saskatchewan outcomes, are
// shared with the outcomes they practise. The rest are written for Saskatchewan. Outcome codes are checked against
// docs/research/saskatchewan/outcomes.json in content.test.ts.

export const courses: Course[] = [
  {
    grade: "1",
    subject: "math",
    bigIdeas: { "ca-sk": O["1"].math },
    units: [],
    shares: {
      "numbers-to-20": share("N1.1–N1.8", "counting, representing, comparing and estimating numbers to 20, and one more or less"),
      "make-ten": share("N1.10", "mental strategies such as making 10"),
      "adding": share("N1.9", "addition with answers to 20"),
      "take-away": share("N1.9", "subtraction facts to 20"),
      "equal-or-not": share("P1.3, P1.4", "equality and inequality as balance, and the equal symbol"),
      "patterns": share("P1.1, P1.2", "repeating patterns and translating them from one form to another"),
      "measuring": share("SS1.1", "measurement as comparing attributes of objects"),
      "shapes": share("SS1.2–SS1.4", "sorting, building and comparing 2-D shapes and 3-D objects"),
    },
    order: { "ca-sk": ["numbers-to-20", "make-ten", "adding", "take-away", "equal-or-not", "patterns", "measuring", "shapes"] },
  },
  {
    grade: "1",
    subject: "language",
    bigIdeas: { "ca-sk": O["1"].language },
    units: [],
    shares: {
      "blend-it": share("CR1.4", "blending and segmenting sounds to read words"),
      "short-vowels": share("CR1.4", "short vowel sounds in reading and spelling simple words"),
      "word-families": share("CR1.4", "word patterns and word families in reading"),
      "sight-words": share("CR1.4", "reading common words"),
      "sentences": share("CC1.4", "writing sentences with capital letters and end marks"),
      "story-time": share("CR1.3, CR1.4", "the sequence and key points of stories"),
      "describing-words": share("CC1.4", "describing words and opposites in writing"),
      "more-than-one": share("CC1.4", "plurals in writing"),
    },
    order: { "ca-sk": ["blend-it", "short-vowels", "word-families", "sight-words", "sentences", "story-time", "describing-words", "more-than-one"] },
  },
  {
    grade: "1",
    subject: "science",
    bigIdeas: { "ca-sk": O["1"].science },
    units: [...reuse(g1_science, {
      "our-bodies-and-senses": sk("SE1.1, SE1.2", "the five senses and how people and animals use them"),
    })],
    shares: {
      "living-things": share("LT1.1", "telling living things apart by appearance and behaviour"),
      "animal-survival": share("LT1.2", "how plants, animals and people meet their basic needs in their environments"),
      "materials": share("OM1.1", "observable characteristics and uses of materials"),
      "sky-and-seasons": share("DS1.1", "daily and seasonal changes in the sky and the natural world"),
    },
    order: { "ca-sk": ["living-things", "animal-survival", "materials", "our-bodies-and-senses", "sky-and-seasons"] },
  },
  {
    grade: "1",
    subject: "social",
    bigIdeas: { "ca-sk": O["1"].social },
    units: [...reuse(g1_social, {
      "changes-in-my-life": sk("DR1.1, DR1.5", "family events and stories of the past, and when and where things happened"),
      "respect-and-inclusion": sk("PA1.1, PA1.2", "actions that support peace and harmony, and returning to harmony"),
    })],
    shares: {
      "different-and-alike": share("IN1.1, IN1.2", "traditions and celebrations, and what makes families and classrooms alike and different"),
      "our-land": share("DR1.3", "how people rely on the natural environment to meet needs"),
      "maps": share("DR1.4", "globes and maps as representations of Earth"),
    },
    order: { "ca-sk": ["different-and-alike", "changes-in-my-life", "our-land", "maps", "respect-and-inclusion"] },
  },
];
