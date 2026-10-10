import type { Course } from "../types";
import { units as g5_science } from "../ontario/g5-science";
import { units as sk_science_5 } from "./g5-science";
import { units as g5_social } from "../ontario/g5-social";
import { reuse, share, sk } from "./kit";
import { SK_OUTCOMES as O } from "./outcomes";

// Saskatchewan Grade 5. Units that BC or Ontario already teach, and that fit the Saskatchewan outcomes, are
// shared with the outcomes they practise. The rest are written for Saskatchewan. Outcome codes are checked against
// docs/research/saskatchewan/outcomes.json in content.test.ts.

export const courses: Course[] = [
  {
    grade: "5",
    subject: "math",
    bigIdeas: { "ca-sk": O["5"].math },
    units: [],
    shares: {
      "numbers-to-a-million": share("N5.1", "whole numbers to 1 000 000"),
      "add-and-subtract": share("N5.4", "estimation and computation strategies for adding and subtracting"),
      "multiply": share("N5.2", "multiplication of whole numbers"),
      "divide": share("N5.3", "division of 3-digit numbers by 1-digit numbers, with remainders"),
      "equivalent-fractions": share("N5.5", "creating and comparing sets of equivalent fractions"),
      "decimals": share("N5.6, N5.7", "decimals to thousandths, with addition and subtraction"),
      "patterns-and-equations": share("P5.1, P5.2", "patterns, and one-step equations with a variable"),
      "area-and-perimeter": share("SS5.1", "designing rectangles given perimeter or area"),
      "prisms-pyramids-and-moves": share("SS5.5, SS5.7", "faces and edges of 3-D objects, and single transformations"),
      "graphs-and-chance": share("SP5.2, SP5.3", "double bar graphs and the likelihood of outcomes"),
    },
    order: { "ca-sk": ["numbers-to-a-million", "add-and-subtract", "multiply", "divide", "equivalent-fractions", "decimals", "patterns-and-equations", "area-and-perimeter", "prisms-pyramids-and-moves", "graphs-and-chance"] },
  },
  {
    grade: "5",
    subject: "language",
    bigIdeas: { "ca-sk": O["5"].language },
    units: [],
    shares: {
      "reading-detectives": share("CR5.4", "inferring, summarizing and finding the main idea"),
      "plot-and-conflict": share("CR5.4", "plot and conflict in stories"),
      "figurative-language": share("CR5.4", "figurative language in poetry and prose"),
      "purpose-and-structure": share("CR5.4", "forms, purposes and structures of texts"),
      "context-clues": share("CR5.4", "using context clues to work out word meaning"),
      "word-roots": share("CR5.4", "Greek and Latin roots"),
      "verb-tenses": share("CC5.4", "verb tenses in writing"),
      "complex-sentences": share("CC5.4", "simple, compound and complex sentences"),
      "punctuation-power": share("CC5.4", "commas, colons and apostrophes"),
      "media-smarts": share("CR5.2", "persuasive techniques in visual and media texts"),
    },
    order: { "ca-sk": ["reading-detectives", "plot-and-conflict", "figurative-language", "purpose-and-structure", "context-clues", "word-roots", "verb-tenses", "complex-sentences", "punctuation-power", "media-smarts"] },
  },
  {
    grade: "5",
    subject: "science",
    bigIdeas: { "ca-sk": O["5"].science },
    units: [...reuse(g5_science, {
      "healthy-choices-5": sk("HB5.1", "factors that affect a healthy body"),
      "body-teamwork-5": sk("HB5.3", "how body systems work together"),
      "states-of-matter-5": sk("MC5.1", "properties of solids, liquids and gases"),
      "changes-of-state-5": sk("MC5.2", "reversible changes, including changes of state"),
      "matter-changes-5": sk("MC5.2", "reversible and non-reversible changes to materials"),
    }), ...sk_science_5],
    shares: {
      "digestion-and-breathing": share("HB5.2", "structures and functions of the digestive and respiratory systems"),
      "heart-bones-muscles": share("HB5.2", "structures and functions of the circulatory and musculoskeletal systems"),
      "simple-machines": share("FM5.2", "levers, wheels and axles, pulleys, inclined planes and other simple machines"),
    },
    order: { "ca-sk": ["healthy-choices-5", "digestion-and-breathing", "heart-bones-muscles", "body-teamwork-5", "states-of-matter-5", "changes-of-state-5", "matter-changes-5", "simple-machines", ...sk_science_5.map((u) => u.id)] },
  },
  {
    grade: "5",
    subject: "social",
    bigIdeas: { "ca-sk": O["5"].social },
    units: [...reuse(g5_social, {
      "explorers-5": sk("DR5.3", "European exploration and its influence on early Canadian society"),
      "fur-trade-5": sk("DR5.3", "the fur trade and its effects on people and communities"),
    })],
    shares: {
      "immigration-multiculturalism": share("IN5.2", "how Canada became a multicultural nation"),
      "levels-of-government": share("PA5.2", "the purposes and functions of governments in Canada"),
      "making-laws": share("PA5.1, PA5.2", "how Canada governs itself and makes laws"),
      "regions-and-resources": share("DR5.2, RW5.1", "how Canada's environment and resources shape life and the economy"),
    },
    order: { "ca-sk": ["immigration-multiculturalism", "explorers-5", "fur-trade-5", "levels-of-government", "making-laws", "regions-and-resources"] },
  },
];
