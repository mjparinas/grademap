import type { Course } from "../types";
import { units as k_social } from "../ontario/k-social";
import { reuse, share, sk } from "./kit";
import { SK_OUTCOMES as O } from "./outcomes";

// Saskatchewan Kindergarten. Units that BC or Ontario already teach, and that fit the Saskatchewan outcomes, are
// shared with the outcomes they practise. The rest are written for Saskatchewan. Outcome codes are checked against
// docs/research/saskatchewan/outcomes.json in content.test.ts.

export const courses: Course[] = [
  {
    grade: "k",
    subject: "math",
    bigIdeas: { "ca-sk": O.k.math },
    units: [],
    shares: {
      "count-to-10": share("NK.1–NK.3", "saying the number sequence, recognizing small groups at a glance and relating numerals to quantities to 10"),
      "make-5-and-10": share("NK.4", "partitioning whole numbers to 10 concretely and pictorially"),
      "more-less-same": share("NK.5", "comparing quantities to 10 using one-to-one correspondence"),
      "patterns": share("PK.1", "identifying, reproducing, extending and creating repeating patterns"),
      "shapes-and-sizes": share("SSK.1–SSK.3", "comparing objects by one attribute, and sorting, building and describing 3-D objects"),
    },
    order: { "ca-sk": ["count-to-10", "make-5-and-10", "more-less-same", "patterns", "shapes-and-sizes"] },
  },
  {
    grade: "k",
    subject: "language",
    bigIdeas: { "ca-sk": O.k.language },
    units: [],
    shares: {
      "letter-partners": share("CCK.4", "letters and symbols used to create messages"),
      "first-sounds": share("CRK.3", "listening for the sounds at the start of words"),
      "rhyme-time": share("CRK.3, CRK.4", "listening for rhymes and word sounds in songs, poems and stories"),
      "clap-the-beat": share("CRK.3", "listening for the parts (syllables) in spoken words"),
      "sight-words": share("CRK.1, CCK.4", "everyday words seen in print and used in messages"),
      "story-order": share("CRK.4", "retelling the basic ideas and order of events in a story"),
      "book-detectives": share("CRK.1, CRK.4", "how books work and what stories and informational texts say"),
    },
    order: { "ca-sk": ["letter-partners", "first-sounds", "rhyme-time", "clap-the-beat", "sight-words", "story-order", "book-detectives"] },
  },
  {
    grade: "k",
    subject: "science",
    bigIdeas: { "ca-sk": O.k.science },
    units: [],
    shares: {
      "animal-features": share("LTK.1", "observable characteristics of plants, animals and people in the local environment"),
      "living-things-need": share("LTK.1", "what living things in the local environment need"),
      "push-and-pull": share("FEK.1", "the effects of pushes, pulls and other forces on objects"),
      "materials": share("MOK.1", "observable characteristics of familiar objects and materials"),
      "weather-and-seasons": share("NSK.1", "features of the natural surroundings, including weather and changes over time"),
    },
    order: { "ca-sk": ["animal-features", "living-things-need", "push-and-pull", "materials", "weather-and-seasons"] },
  },
  {
    grade: "k",
    subject: "social",
    bigIdeas: { "ca-sk": O.k.social },
    units: [...reuse(k_social, {
      "places-near-me": sk("DRK.1", "where people, places and environments are in relation to each other"),
      "caring-for-nature": sk("RWK.2", "caring for the environment through daily actions"),
    })],
    shares: {
      "all-about-me": share("INK.1, INK.2", "similarities and differences among individuals, and the diversity of groups in the classroom"),
      "helpers-and-rules": share("PAK.1, PAK.2", "classroom, playground and school rules, and working through disagreements"),
    },
    order: { "ca-sk": ["all-about-me", "helpers-and-rules", "places-near-me", "caring-for-nature"] },
  },
];
