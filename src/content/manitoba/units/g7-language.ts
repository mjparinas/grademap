import { bankUnit, type Q } from "../own";

// Grade 7 word study: Greek and Latin roots and affixes (ELA.7.A2.4), expanded vocabulary and figures of speech
// (ELA.7.A2.5) and spelling by word parts (ELA.7.C3.2).

const ITEMS: Q[] = [
  ["The Latin root spect means “look”. What is a spectator?", "a person who watches", ["a person who sings", "a person who builds", "a person who sleeps"], "Spect means look, and -or names a person who does something."],
  ["The root port means “carry”. What does portable mean?", "able to be carried", ["too heavy to move", "close to the water", "very quiet"], "Port (carry) + -able (able to be)."],
  ["What does it mean to export goods?", "to carry them out to sell elsewhere", ["to carry them in from elsewhere", "to throw them away", "to make them smaller"], "Ex- means out and port means carry."],
  ["The root dict means “say”. What does predict mean?", "say what will happen before it happens", ["say it again", "say it loudly", "say nothing"], "Pre- means before and dict means say."],
  ["A teacher dictates a sentence. What does she do?", "says it aloud for students to write", ["writes it on the board", "erases it", "reads it silently"], "Dict means say."],
  ["The root aud means “hear”. Audible means…", "able to be heard", ["able to be seen", "able to be touched", "able to be tasted"], "Aud (hear) + -ible (able to be)."],
  ["The root scrib or script means “write”. A manuscript is…", "a text written by hand", ["a kind of movie", "a loud announcement", "a map"], "Manu means hand and script means write."],
  ["The root bio means “life”. Biology is the study of…", "living things", ["rocks", "stars", "numbers"], "Bio (life) + -ology (study of)."],
  ["The root geo means “earth”. Geology is the study of…", "Earth and its rocks", ["living things", "the weather only", "the oceans only"], "Geo (earth) + -ology (study of)."],
  ["Tele means “far”. A telescope is used to…", "see things far away", ["hear things far away", "measure heat", "write messages"], "Tele (far) + scope (to look at)."],
  ["Therm means “heat”. A thermometer measures…", "temperature", ["distance", "mass", "time"], "Therm (heat) + meter (measure)."],
  ["Aqua means “water”. An aquarium is a place for…", "keeping water animals and plants", ["growing wheat", "storing books", "parking cars"], "Aqua means water."],
  ["Auto means “self”. An autobiography is a story of a person’s life written by…", "that person", ["a teacher", "a stranger", "a machine"], "Auto (self) + bio (life) + graph (write)."],
  ["The prefix re- means “again”. What does rebuild mean?", "build again", ["build first", "never build", "build less"], "Re- means again."],
  ["The prefix pre- means “before”. What is a preview?", "a look at something before it is shown", ["a look back at something", "a loud speech", "a final grade"], "Pre- (before) + view (see)."],
  ["The prefix sub- means “under”. A submarine travels…", "under the sea", ["over the sea", "beside the sea", "above the clouds"], "Sub- means under."],
  ["The prefix inter- means “between”. International means…", "between nations", ["inside one nation", "against a nation", "without a nation"], "Inter- (between) + national."],
  ["The prefix dis- means “not” or “opposite of”. What does disagree mean?", "not to hold the same opinion", ["to agree twice", "to agree first", "to speak loudly"], "Dis- reverses the meaning."],
  ["The prefix mis- means “wrongly”. What does misspell mean?", "spell wrongly", ["spell again", "spell aloud", "spell quickly"], "Mis- means wrongly."],
  ["The suffix -less means “without”. Fearless means…", "without fear", ["full of fear", "fear again", "before fear"], "-less is the opposite of -ful."],
  ["Which word contains the root port, meaning “carry”?", "transport", ["magnet", "planet", "vision"], "Trans- (across) + port (carry)."],
  ["The root ced or cede means “go”. What does precede mean?", "go before", ["go back", "go away from a group", "go around"], "Pre- means before."],
  ["The root ced or cede means “go”. What does recede mean?", "go back", ["go before", "go faster", "go around"], "Re- means back or again. Flood waters recede when they go back down."],
  ["Which word is closest in meaning to friendship?", "camaraderie", ["rivalry", "silence", "distance"], "Camaraderie is the trust and friendship of people who spend time together."],
  ["“The wind whispered through the trees.” What figure of speech is this?", "personification", ["hyperbole", "alliteration", "idiom"], "The wind is given a human action, whispering."],
  ["“I’m so hungry I could eat a horse.” What figure of speech is this?", "hyperbole", ["personification", "simile", "onomatopoeia"], "Hyperbole is a big exaggeration."],
  ["“It’s raining cats and dogs.” What does this idiom mean?", "It is raining very hard", ["Animals are falling from the sky", "It is raining a little", "It is a sunny day"], "An idiom’s meaning is different from its words."],
  ["Which word is spelled correctly?", "recede", ["receed", "resede", "reseed"], "The root cede is spelled c-e-d-e, as in precede and secede.", true],
  ["The root secede combines se- (apart) and cede (go). What does it mean?", "to withdraw from a group", ["to join a group", "to lead a group", "to follow a group"], "Se- means apart, so seceding means going apart from a group.", true],
  ["Which words belong to the same word family?", "vision, visible, visual", ["vision, victory, visit", "visible, vital, view", "visual, valley, value"], "All three come from the Latin root vis, meaning see.", true],
];

export const wordRoots = bankUnit({
  id: "mb-word-roots",
  title: "Roots & Word Parts",
  emoji: "🌳",
  blurb: "Greek and Latin roots, prefixes and suffixes",
  parentNote: "Children work out the meaning and spelling of new words from their roots, prefixes and suffixes, and meet figures of speech.",
  standards: ["ELA.7.A2.4, ELA.7.A2.5, ELA.7.C3.2", "Greek and Latin roots and affixes, expanded vocabulary, figures of speech and spelling by word parts"],
  items: ITEMS,
});
