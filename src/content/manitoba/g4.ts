import type { Course } from "../types";
import { courses as ontario } from "../ontario/g4";
import { frenchCourses } from "./french";
import { adopt, course, unitsOf } from "./kit";
import { units as socialUnits } from "./units/g4-social";
import { units as scienceUnits } from "./units/g4-science";

// Manitoba Grade 4. Math follows the Grade 4 mathematics outcomes (4.N, 4.PR, 4.SS, 4.SP), English language arts the ELA
// curriculum (strands A to D), science the Grade 4 outcomes (SCI.4) and social studies Canada's geography and Manitoba (4-K outcomes).
// Units BC or Ontario already has are listed with the Manitoba outcomes they practise.

export const courses: Course[] = [
  course("4", "math", {
    share: {
      "numbers-to-10000": ["4.N.1, 4.N.2", "representing, comparing and ordering whole numbers to 10 000"],
      "add-subtract": ["4.N.3", "adding and subtracting numbers with answers to 10 000"],
      "times-tables": ["4.N.4, 4.N.5", "multiplication and division facts, the properties of 0 and 1, and mental strategies"],
      "multiply-divide": ["4.N.6, 4.N.7", "multiplying 2- and 3-digit numbers by 1-digit numbers, and dividing"],
      fractions: ["4.N.8", "fractions less than or equal to one"],
      decimals: ["4.N.9, 4.N.10, 4.N.11", "decimal tenths and hundredths, fractions, and adding and subtracting decimals"],
      "patterns-and-tables": ["4.PR.1, 4.PR.2, 4.PR.3, 4.PR.4", "patterns and relationships in tables and charts"],
      equations: ["4.PR.5, 4.PR.6", "equations with a symbol for an unknown number"],
      "telling-time": ["4.SS.1, 4.SS.2", "reading and recording time and calendar dates"],
      "polygons-and-perimeter": ["4.SS.4, 4.SS.6", "solving problems with 2-D shapes, and line symmetry"],
      "graphs-and-chance": ["4.SP.1, 4.SP.2", "pictographs and bar graphs with many-to-one correspondence"],
    },
    adopted: adopt(unitsOf(ontario, "math"), {
      "angles-and-area": ["4.SS.3", "area of regular and irregular 2-D shapes"],
    }),
  }),
  course("4", "language", {
    share: {
      "word-builders": ["ELA.4.A2.4, ELA.4.A2.5", "word parts, meanings and new vocabulary"],
      "reading-detectives": ["ELA.4.B2.3, ELA.4.B2.5, ELA.4.B2.6", "predicting, using strategies to understand, and recalling important information"],
      "text-features": ["ELA.4.B2.1, ELA.4.B2.2", "the form and structure of texts, and text features"],
      "figurative-language": ["ELA.4.B2.7, ELA.4.C2.4", "descriptive language and varied, vivid writing"],
      "point-of-view": ["ELA.4.B3.3", "how different perspectives in a text can influence an audience"],
      "parts-of-speech": ["ELA.4.C3.2", "using words and word meanings correctly in writing"],
      "super-sentences": ["ELA.4.C2.2, ELA.4.A1.5", "varied and complex sentences with transitions"],
      "punctuation-power": ["ELA.4.C3.3, ELA.4.C3.4", "capital letters and punctuation"],
      "sound-alikes": ["ELA.4.C3.2", "spelling patterns and homophones"],
      "paragraph-power": ["ELA.4.C2.1", "organizing writing into paragraphs"],
    },
  }),
  course("4", "science", {
    adopted: adopt(unitsOf(ontario, "science"), {
      "light-4": ["SCI.4.E.2, SCI.4.E.4, SCI.4.E.5", "light, how it travels, and how we see objects"],
      "sound-4": ["SCI.4.E.1, SCI.4.E.3", "sound as energy made by vibrations"],
      "food-webs-4": ["SCI.4.E.14", "the flow of energy and cycling of matter among living things"],
    }),
    own: scienceUnits,
    order: ["light-4", "sound-4", "mb-soil", "mb-rocks", "mb-energy-resources", "food-webs-4"],
  }),
  course("4", "social", {
    own: socialUnits,
    order: ["mb-canada-map", "mb-canada-regions", "mb-canadian-citizens", "mb-manitoba-land", "mb-manitoba-people", "mb-manitoba-story"],
  }),
  ...frenchCourses("4"),
];
