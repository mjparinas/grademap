import type { Course } from "../types";
import { units as g6_math } from "../ontario/g6-math";
import { units as g6_science } from "../ontario/g6-science";
import { units as g6_social } from "../ontario/g6-social";
import { reuse, share, sk } from "./kit";
import { SK_OUTCOMES as O } from "./outcomes";

// Saskatchewan Grade 6. Units that BC or Ontario already teach, and that fit the Saskatchewan outcomes, are
// shared with the outcomes they practise. The rest are written for Saskatchewan. Outcome codes are checked against
// docs/research/saskatchewan/outcomes.json in content.test.ts.

export const courses: Course[] = [
  {
    grade: "6",
    subject: "math",
    bigIdeas: { "ca-sk": O["6"].math },
    units: [...reuse(g6_math, {
      "numbers-6": sk("N6.6", "integers"),
      "shapes-6": sk("SS6.4", "the first quadrant of the Cartesian plane and ordered pairs"),
      "data-6": sk("SP6.1", "data analysis, including line graphs"),
    })],
    shares: {
      "thousandths-to-billions": share("N6.1", "place value for numbers greater than a million and less than a thousandth"),
      "facts-and-factors": share("N6.2", "factors and multiples"),
      "decimal-multiply-divide": share("N6.4", "multiplying and dividing decimals"),
      "percents-and-budgets": share("N6.5", "percent, with whole numbers to 100"),
      "mixed-numbers-and-ratios": share("N6.7, N6.8", "improper fractions, mixed numbers and ratio"),
      "patterns-and-graphs": share("P6.1", "patterns and relationships in tables of values and graphs"),
      "equations": share("P6.2, P6.3", "preservation of equality, and expressions and equations with variables"),
      "angles-and-triangles": share("SS6.1, SS6.3", "angles, and classifying triangles and polygons"),
      "perimeter-and-area": share("SS6.2", "perimeter of polygons and area of rectangles"),
      "volume-and-capacity": share("SS6.2", "volume of right rectangular prisms"),
      "transformations": share("SS6.5", "single and combined transformations of 2-D shapes"),
      "probability": share("SP6.2", "sample space and experimental and theoretical probability"),
    },
    order: { "ca-sk": ["thousandths-to-billions", "facts-and-factors", "decimal-multiply-divide", "percents-and-budgets", "numbers-6", "mixed-numbers-and-ratios", "patterns-and-graphs", "equations", "angles-and-triangles", "perimeter-and-area", "volume-and-capacity", "shapes-6", "transformations", "data-6", "probability"] },
  },
  {
    grade: "6",
    subject: "language",
    bigIdeas: { "ca-sk": O["6"].language },
    units: [],
    shares: {
      "close-reading": share("CR6.6", "reading and interpreting grade-level texts"),
      "point-of-view": share("CR6.6", "narrator and point of view"),
      "figurative-language": share("CR6.6", "figurative language and imagery"),
      "connotation-tone": share("CR6.6", "connotation and tone in texts"),
      "sources-bias": share("CR6.7", "sources, evidence and bias in information texts"),
      "roots-analogies": share("CR6.3", "word roots and analogies"),
      "persuasive-writing": share("CC6.7", "writing to persuade"),
      "agreement": share("CC6.3", "subject–verb and pronoun agreement"),
      "sentence-repair": share("CC6.3", "fixing fragments and run-ons"),
      "commas-clauses": share("CC6.3", "commas and clauses"),
    },
    order: { "ca-sk": ["close-reading", "point-of-view", "figurative-language", "connotation-tone", "sources-bias", "roots-analogies", "persuasive-writing", "agreement", "sentence-repair", "commas-clauses"] },
  },
  {
    grade: "6",
    subject: "science",
    bigIdeas: { "ca-sk": O["6"].science },
    units: [...reuse(g6_science, {
      "classifying-life-6": sk("DL6.2", "how people sort and classify living things"),
      "biodiversity-6": sk("DL6.1, DL6.4", "the diversity of living things and how structures and behaviours help them survive"),
      "static-electricity-6": sk("EL6.2", "static electric charges, conductors and insulators"),
      "circuits-6": sk("EL6.2, EL6.3", "switches and simple series and parallel circuits"),
      "flight-6": sk("FL6.2", "thrust, drag, lift and gravity in flight"),
      "earth-moon-sun-6": sk("SS6.2", "phases of the moon, eclipses and seasons"),
      "weight-and-space-tech-6": sk("SS6.3", "space exploration and its technologies"),
    })],
    shares: {
      "solar-system": share("SS6.1", "the sun, planets, moons and other parts of the solar system"),
    },
    order: { "ca-sk": ["classifying-life-6", "biodiversity-6", "static-electricity-6", "circuits-6", "flight-6", "solar-system", "earth-moon-sun-6", "weight-and-space-tech-6"] },
  },
  {
    grade: "6",
    subject: "social",
    bigIdeas: { "ca-sk": O["6"].social },
    units: [...reuse(g6_social, {
      "canada-and-world-6": sk("IN6.3", "Canada's connections with other countries"),
      "canadian-identities-6": sk("IN6.1, IN6.2", "culture, identity and diversity in Canada"),
    })],
    shares: {
      "map-skills": share("DR6.3", "using maps to orient ourselves in place"),
      "cities-and-migration": share("DR6.2", "how the land affects where people settle"),
      "global-challenges": share("RW6.2", "taking action on environmental and social challenges"),
      "trade-and-globalization": share("IN6.3", "global interdependence and its effect on daily life"),
    },
    order: { "ca-sk": ["map-skills", "cities-and-migration", "global-challenges", "trade-and-globalization", "canada-and-world-6", "canadian-identities-6"] },
  },
];
