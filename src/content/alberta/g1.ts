import type { Course } from "../types";
import { frenchCourses } from "./french";
import { ab } from "./kit";
import { units as mathUnits } from "./g1-math";
import { units as languageUnits } from "./g1-language";
import { units as scienceUnits } from "./g1-science";
import { units as socialUnits } from "./g1-social";

// Alberta Grade 1. Units BC or Ontario already provide are shared with Alberta's outcome text; the rest are
// written for the Alberta outcomes (files g1-math.ts, g1-language.ts, g1-science.ts, g1-social.ts).

export const courses: Course[] = [
  {
    grade: "1",
    subject: "math",
    bigIdeas: {
      "ca-ab": [
        "Number and operations: children interpret and explain quantities to 100 and count forward, back and by 2s, 5s and 10s.",
        "Addition and subtraction: children combine and take apart quantities within 20 and recall addition facts to 20 and the related subtraction facts.",
        "Fractions: children begin with one half as one of two equal parts.",
        "Patterns: children identify, describe and extend repeating patterns.",
        "Geometry: children sort and describe 2D shapes and 3D objects.",
        "Measurement and time: children measure length with non-standard units and explain days and months as cycles.",
      ],
    },
    units: mathUnits,
    shares: {
      "numbers-to-20": { standards: ab("1N1.1, 1N1.2, 1N1.4", "reading, building and counting numbers to 20, and seeing small amounts at a glance") },
      "make-ten": { standards: ab("1N2.1, 1N2.3", "combining and taking apart numbers to 10, and recalling facts") },
      adding: { standards: ab("1N2.1, 1N2.2", "adding within 20 using objects, ten frames and number lines") },
      "take-away": { standards: ab("1N2.1, 1N2.2", "taking away within 20 and linking subtraction to addition") },
      "equal-or-not": { standards: ab("1N1.5", "telling when two amounts are equal and when they are not") },
      patterns: { standards: ab("1P1.1", "repeating patterns with more than one element and more than one change") },
      measuring: { standards: ab("1M1.1, 1M1.2", "measuring length with non-standard units and comparing sizes directly") },
      shapes: { standards: ab("1G1.1", "sorting 2D shapes and 3D objects and describing their features") },
    },
    order: {
      "ca-ab": ["numbers-to-20", "numbers-to-100-ab", "counting-patterns-ab", "equal-or-not", "make-ten", "adding", "take-away", "halves-ab", "patterns", "shapes", "measuring", "days-and-months-ab"],
    },
  },
  {
    grade: "1",
    subject: "language",
    bigIdeas: {
      "ca-ab": [
        "Speaking and listening: children share experiences and information clearly, with suitable words, volume and speed.",
        "Reading: children show they know letter–sound relationships and recognize common words automatically.",
        "Understanding stories: children retell the main idea, characters and details of a story or poem.",
        "Writing: children combine ideas in a logical order to speak and write complete sentences.",
        "Conventions: sentences begin with a capital letter and end with a period, question mark or exclamation mark.",
        "Creating: children organize ideas to make stories and poems or to record facts.",
      ],
    },
    units: languageUnits,
    shares: {
      "blend-it": { standards: ab("Show understandings of letter-sound relationships and automatic recognition of words.", "blending and segmenting sounds to read and spell words") },
      "short-vowels": { standards: ab("Show understandings of letter-sound relationships and automatic recognition of words.", "short vowel sounds and the letters that spell them") },
      "word-families": { standards: ab("Show understandings of letter-sound relationships and automatic recognition of words.", "reading and spelling words that share a pattern") },
      "sh-ch-th": { standards: ab("Show understandings of letter-sound relationships and automatic recognition of words.", "the sounds sh, ch and th and the letters that spell them") },
      "sight-words": { standards: ab("Show understandings of letter-sound relationships and automatic recognition of words.", "reading and spelling common words") },
      sentences: { standards: ab("Begin sentences with a capital letter, and end them with a period, a question mark, or an exclamation mark.", "sentences, capital letters and end marks") },
      "sentence-types": { standards: ab("Begin sentences with a capital letter, and end them with a period, a question mark, or an exclamation mark.", "telling, asking and exclamation sentences and their end marks") },
      "describing-words": { standards: ab("Speak about experiences and information using appropriate vocabulary, volume, and speed.", "describing words, opposites and vocabulary") },
      "story-time": { standards: ab("Retell the main idea, characters, and details in a story or poem.", "who, where and what happens in a story") },
      "think-it-through": { standards: ab("Retell the main idea, characters, and details in a story or poem.", "finding the main idea and making simple inferences") },
    },
    order: {
      "ca-ab": ["blend-it", "short-vowels", "sh-ch-th", "word-families", "sight-words", "describing-words", "sentences", "sentence-types", "build-sentences-ab", "story-time", "think-it-through"],
    },
  },
  {
    grade: "1",
    subject: "science",
    bigIdeas: {
      "ca-ab": [
        "Matter: objects have measurable properties, such as length, area and weight, and some physical changes can be made to them.",
        "Energy: objects, people and animals move in different directions, pathways and speeds.",
        "Earth and space: the seasons bring changes to environments, plants and animals, and affect our daily choices.",
        "Living systems: plants and animals need food, water, air and shelter, and people depend on them and can help care for them.",
        "Computer science: following instructions step by step, in order, helps us do tasks and stay safe.",
        "Scientific methods: scientists describe the steps of an investigation and make predictions, observations and conclusions.",
      ],
    },
    units: scienceUnits,
    shares: {
      "living-things": { standards: ab("1LS 1.1", "plants and animals, what makes them alike and different, and living and non-living things") },
      "animal-survival": { standards: ab("1ES 1.2", "how animals respond to the seasons, including migration and hibernation") },
      "a-healthy-environment": { standards: ab("1ES 1.5, 1LS 1.3", "caring for nature and the plants and animals in it") },
      "think-like-a-scientist": { standards: ab("1SM 1.1, 1SM 1.2", "tools and steps of an investigation, predictions and sharing what was found") },
    },
    order: {
      "ca-ab": ["think-like-a-scientist", "properties-ab", "movement-ab", "seasons-alberta-ab", "animal-survival", "living-things", "alberta-habitats-ab", "a-healthy-environment", "follow-steps-ab"],
    },
  },
  {
    grade: "1",
    subject: "social",
    bigIdeas: {
      "ca-ab": [
        "Focus: local communities and cultures.",
        "Key physical features and landmarks help us describe and find places in our communities.",
        "Communities include diverse cultures, such as First Nations, Métis, Inuit and francophone communities.",
        "People exchange goods and services to meet their needs.",
        "Everyone has roles and responsibilities in the groups they belong to.",
        "We support a sense of belonging by treating others with respect, and Canada has official symbols.",
      ],
    },
    units: socialUnits,
    shares: {
      "my-community": { standards: ab("roles and responsibilities in groups", "roles and responsibilities, community helpers and being a good neighbour") },
      "respect-and-inclusion": { standards: ab("supporting belonging", "kind and inclusive behaviour so that everyone belongs") },
      "different-and-alike": { standards: ab("cultures of diverse communities, including First Nations, Métis, Inuit, and francophone communities", "how families and celebrations are alike and different") },
      "places-in-my-community": { standards: ab("key physical features and landmarks of communities", "natural and built features and different areas of a community") },
      "community-services": { standards: ab("exchange of goods and services", "services in the community and the people who provide them") },
    },
    order: {
      "ca-ab": ["my-community", "respect-and-inclusion", "different-and-alike", "cultures-alberta-ab", "places-in-my-community", "landmarks-ab", "community-services", "goods-services-ab", "symbols-canada-ab"],
    },
  },
  ...frenchCourses("1"),
];
