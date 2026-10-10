import type { Course } from "../types";
import { frenchCourses } from "./french";
import { ab } from "./kit";
import { K_LANGUAGE, K_MATH, K_SCIENCE, K_SOCIAL } from "./k-overall";
import { units as mathUnits } from "./k-math";
import { units as languageUnits } from "./k-language";
import { units as scienceUnits } from "./k-science";
import { units as socialUnits } from "./k-social";

// Alberta Kindergarten. Units the BC and Ontario courses already have are shared, with the Alberta outcomes
// they practise; the units written here cover the rest of the Alberta Kindergarten outcomes.

export const courses: Course[] = [
  {
    grade: "k",
    subject: "math",
    bigIdeas: { "ca-ab": K_MATH },
    units: mathUnits,
    shares: {
      "count-to-10": { standards: ab("KN1.2, KN1.3", "counting forward and backward within 10, and matching one number to each object") },
      "make-5-and-10": { standards: ab("KN1.1, KN2.1", "putting numbers together and taking them apart within 10") },
      "add-and-take-away": { standards: ab("KN2.1", "adding and taking away within 10 with objects") },
      "more-less-same": { standards: ab("KN1.1", "comparing quantities using more, less, the same, enough and not enough") },
      patterns: { standards: ab("KP1.1", "copying, extending and making repeating patterns of up to three parts") },
      "shapes-and-sizes": { standards: ab("KG1.1, KM1.1, KM1.2", "2D shapes and 3D objects in the world, and comparing size by length, weight and capacity") },
    },
    order: {
      "ca-ab": ["count-to-10", "see-it-fast-ab", "more-less-same", "make-5-and-10", "add-and-take-away", "patterns", "shapes-and-sizes", "first-next-today-ab"],
    },
  },
  {
    grade: "k",
    subject: "language",
    bigIdeas: { "ca-ab": K_LANGUAGE },
    units: languageUnits,
    shares: {
      "letter-partners": { standards: ab("Recognize and write some letters and words.", "naming upper- and lowercase letters") },
      "first-sounds": { standards: ab("Recognize and write some letters and words.", "hearing the first sound in a word and matching it to a letter") },
      "rhyme-time": { standards: ab("Develop listening and speaking skills by sharing ideas, stories, and poems.", "listening for rhymes in poems and songs") },
      "clap-the-beat": { standards: ab("Develop listening and speaking skills by sharing ideas, stories, and poems.", "hearing the parts (syllables) in words") },
      "blend-a-word": { standards: ab("Recognize and write some letters and words.; Copy words to become familiar with how words are spelled.", "blending sounds to read and spell simple words") },
      "sight-words": { standards: ab("Copy words to become familiar with how words are spelled.", "reading and spelling common words that are used often") },
      "book-detectives": { standards: ab("Share understandings of ideas and information about people, places, or things that are real or imaginary.", "how books and print work, and sharing what we understand") },
      "picture-clues": { standards: ab("Share understandings of ideas and information about people, places, or things that are real or imaginary.", "using pictures and what we know to make meaning") },
      "story-order": { standards: ab("Develop listening and speaking skills by sharing ideas, stories, and poems.", "telling what happens first, next and last in a story") },
    },
    order: {
      "ca-ab": ["talk-and-listen-ab", "rhyme-time", "clap-the-beat", "story-order", "letter-partners", "first-sounds", "blend-a-word", "sight-words", "book-detectives", "picture-clues", "real-or-imaginary-ab"],
    },
  },
  {
    grade: "k",
    subject: "science",
    bigIdeas: { "ca-ab": K_SCIENCE },
    units: scienceUnits,
    shares: {
      materials: { standards: ab("KM 1", "exploring, describing and sorting the properties of objects and materials") },
      "push-and-pull": { standards: ab("KE 1.1, KE 1.2", "exploring how objects move when pushed and pulled, and how people and animals move") },
      "living-things-need": { standards: ab("KES 1.1", "plants, animals and people as living parts of the environment, and what they need") },
      "animal-features": { standards: ab("KES 1.1", "describing the plants and animals in the environment") },
      "weather-and-seasons": { standards: ab("KES 1.3", "noticing changes in the environment, such as weather, sunlight, day and night") },
    },
    order: {
      "ca-ab": ["five-senses-ab", "materials", "push-and-pull", "living-things-need", "animal-features", "natural-or-made-ab", "weather-and-seasons", "care-for-earth-ab", "follow-the-steps-ab"],
    },
  },
  {
    grade: "k",
    subject: "social",
    bigIdeas: { "ca-ab": K_SOCIAL },
    units: socialUnits,
    shares: {
      "all-about-me": { standards: ab("cultures, traditions, and histories", "how people are alike and different, and sharing feelings and ideas with kindness") },
      families: { standards: ab("cultures, traditions, and histories", "how families are alike and different, and family stories and histories") },
      "needs-and-wants": { standards: ab("needs and wants", "telling needs from wants") },
      "places-near-me": { standards: ab("places in communities", "natural and built places in the community and what they are for") },
      "helpers-and-rules": { standards: ab("places in communities; leaders in communities", "people and places in the community, and the rules and helpers that keep us safe") },
      "we-belong": { standards: ab("cooperation and collaboration in groups", "belonging to groups, working together and respecting other ideas") },
    },
    order: {
      "ca-ab": ["all-about-me", "families", "traditions-and-celebrations-ab", "needs-and-wants", "places-near-me", "helpers-and-rules", "leaders-in-community-ab", "we-belong"],
    },
  },
  ...frenchCourses("k"),
];
