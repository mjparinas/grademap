import { sortQuestion, type SortSet } from "../../bank";
import { sample, shuffle } from "../../random";
import type { Course, GenerateOptions, Question, Visual } from "../../types";
import { ask, choose, fromParts, levelOf, perBin, q, qe, type Item, type Level } from "../kit";

// Grade 8 English language arts: close reading, literary devices, argument and media,
// grammar and style, and word study. Passages are original.

// ---------- Close Reading ----------

interface Reading {
  level: Level;
  title: string;
  paragraphs: string[];
  questions: Omit<Item, "level" | "visual">[];
}

const READINGS: Reading[] = [
  {
    level: 1,
    title: "The Last Ferry",
    paragraphs: [
      "Every Friday, Dara took the last ferry home from the mainland. She liked the quiet of the upper deck, where the engine's hum faded into the sound of gulls.",
      "One evening, the captain announced a delay. A thick fog had settled over the strait, and the ferry crept forward at a walking pace. Passengers grumbled and checked their phones. Dara pressed her forehead to the cold window and watched the grey nothing slide by.",
      "Then, without warning, the fog tore open. Ahead lay the island, its windows glowing like a string of lanterns. Dara smiled. She had been home a hundred times, but never before had she seen it arrive.",
    ],
    questions: [
      { prompt: "Which words from the passage best show that Dara is calm during the delay?", right: "“pressed her forehead to the cold window and watched”", wrong: ["“Passengers grumbled and checked their phones”", "“the captain announced a delay”", "“the ferry crept forward”"], hint: "Compare Dara with the other passengers. Which detail shows her patient and watchful, not annoyed?" },
      { prompt: "What does the simile “glowing like a string of lanterns” suggest about the island?", right: "It looks warm and welcoming.", wrong: ["It looks dangerous and dark.", "It looks very large.", "It looks empty."], hint: "Lanterns give soft, friendly light. That tells you how Dara feels about the island." },
      { prompt: "What is the main idea of the last sentence?", right: "Dara sees something familiar in a new and special way.", wrong: ["Dara is tired of travelling.", "Dara is lost in the fog.", "Dara wishes the ferry were faster."], hint: "She has been home a hundred times, but “never before had she seen it arrive.” Something about it feels new." },
      { prompt: "What does the word “crept” suggest about the ferry?", right: "It moved very slowly and carefully.", wrong: ["It moved quickly.", "It was damaged.", "It was empty."], hint: "People creep when they move slowly and quietly. The text also says it moved “at a walking pace.”" },
    ],
  },
  {
    level: 2,
    title: "Fourth Down",
    paragraphs: [
      "Mateo had practised the kick a thousand times, in the backyard, in the school gym, even in the hallway at night until his dad said to stop. Now the whole season came down to one play.",
      "The stadium lights blurred. His teammates were shouting something, but the words sounded like they were underwater. Mateo took two steps back, then one to the left, exactly as always. He thought of Coach's advice: “Don't aim at the goalposts. Aim at the one blade of grass in front of you.”",
      "His foot met the ball with a sound like a snapping branch. For one long second nobody moved. Then the crowd's roar rolled over him, and Mateo realized he had been holding his breath since the whistle.",
    ],
    questions: [
      { prompt: "What does the phrase “the words sounded like they were underwater” show about Mateo?", right: "He is so focused and nervous that he can barely hear his teammates.", wrong: ["He is swimming at the time.", "He does not like his teammates.", "He cannot speak English well."], hint: "The simile describes how sound feels to him. Think about what pressure does to attention." },
      { prompt: "Why does the author describe Mateo's practising in so many places?", right: "To show how hard he has worked to prepare.", wrong: ["To show that he is bored.", "To show that his dad is angry.", "To suggest he plays several sports."], hint: "Backyard, gym, hallway: the repeated places show dedication." },
      { prompt: "What is the effect of the sentence “For one long second nobody moved”?", right: "It builds suspense before the result.", wrong: ["It shows the game is boring.", "It shows the crowd is unhappy.", "It shows Mateo has missed."], hint: "A pause just before the outcome makes readers wait and wonder." },
      { prompt: "What is the main message of Coach's advice?", right: "Focus on one small, close target instead of the huge pressure.", wrong: ["Always aim for the goalposts.", "Never practise at home.", "Grass is more important than the ball."], hint: "“One blade of grass” makes a big task feel small and manageable." },
    ],
  },
  {
    level: 2,
    title: "Why We Keep Bees",
    paragraphs: [
      "When the Hartman family started keeping bees on their roof in the city, their neighbours were nervous. Bees, they said, belonged in the countryside, not beside the laundromat.",
      "But researchers have found that cities can be surprisingly good homes for pollinators. A city garden, balcony pot or park offers flowers from early spring to late autumn, while farms often have only one crop that blooms for a few weeks. Many cities also use fewer pesticides than large farms.",
      "Still, urban beekeeping is not a perfect solution. Honey bees are not native to North America, and when too many hives crowd a neighbourhood they can compete with wild bees for food. Experts suggest that city dwellers who want to help should also plant native flowers and leave small patches of bare soil, where many wild bees nest.",
    ],
    questions: [
      { prompt: "Which sentence best states the central idea of the passage?", right: "City beekeeping can help pollinators, but it works best alongside support for wild bees.", wrong: ["Bees should only live in the countryside.", "Honey bees are native to North America.", "Farms are always better than cities for pollinators."], hint: "The passage gives benefits first, then a caution, then advice. The central idea combines them." },
      { prompt: "Why does the author include the phrase “beside the laundromat” in the first paragraph?", right: "To show how unexpected bees seemed in a city", wrong: ["To explain how honey is made", "To advertise a business", "To prove that bees can swim"], hint: "A laundromat is the opposite of a meadow. The detail shows why the neighbours were surprised." },
      { prompt: "According to the passage, why are cities good for pollinators?", right: "They offer flowers over a longer part of the year.", wrong: ["They have no flowers to compete over.", "They use more pesticides.", "They have fewer people."], hint: "Reread the second paragraph: “flowers from early spring to late autumn.”" },
      { prompt: "What does the author do in the final paragraph?", right: "Presents a limit to the idea and offers a suggestion", wrong: ["Tells a personal story", "Describes how to build a hive", "Compares two cities"], hint: "“Still, … is not a perfect solution” introduces a concern, and the last sentence gives advice." },
    ],
  },
  {
    level: 3,
    title: "Inheritance",
    paragraphs: [
      "My grandmother's kitchen smelled of cardamom, and her hands were never still. Even when she talked, her fingers pleated dough or turned over the coals of an old argument she refused to let go cold.",
      "“Recipes,” she said, “are not instructions. They are memories with measurements.” But when I asked her to write them down, she only laughed. Her cooking lived in pinches and handfuls, in “until it feels right,” a language that no cookbook had ever learned to speak.",
      "Now she is gone, and I stand in my own kitchen with her dented pot. I add the spices, taste, add more. It is never quite hers. But the steam rises, the same cardamom drifts up, and for a moment I am small again, waiting for someone to tell me it is ready.",
    ],
    questions: [
      { prompt: "What does the metaphor “turned over the coals of an old argument” suggest about the grandmother?", right: "She keeps old disagreements alive.", wrong: ["She often cooks over a fire.", "She is afraid of arguments.", "She is easily forgiven."], hint: "She “refused to let go cold” an argument. Coals that are turned stay hot." },
      { prompt: "What does the narrator mean by “memories with measurements”?", right: "Recipes hold feelings and stories, not just amounts.", wrong: ["Recipes need exact measuring cups.", "Memories should be measured.", "Cooking is a science test."], hint: "The grandmother says recipes are “not instructions.” They carry personal history." },
      { prompt: "Which theme is developed most strongly in the passage?", right: "Family traditions can keep people close even after they are gone.", wrong: ["Cooking is easy for everyone.", "Old pots are better than new ones.", "Written recipes are always best."], hint: "The final paragraph shows the narrator reconnecting with the grandmother through her recipe and her pot." },
      { prompt: "The tone of the last paragraph is best described as…", right: "tender and wistful", wrong: ["angry and bitter", "humorous and playful", "formal and distant"], hint: "“It is never quite hers,” “small again”: the narrator misses her but finds comfort." },
    ],
  },
];

function closeReading(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  return choose(READINGS, level, 2).flatMap((r) => {
    const visual: Visual = { type: "passage", title: r.title, paragraphs: r.paragraphs };
    return sample(r.questions, 4).map((item) => ask({ ...item, visual }));
  });
}

// ---------- Literary Devices ----------

const DEVICE = "Which literary device does this excerpt use?";
const dev = (level: Level, text: string, right: string, wrong: string[], hint: string): Item => qe(level, text, DEVICE, right, wrong, hint);

const DEVICES: Item[] = [
  dev(1, "The wind whispered secrets through the trees.", "Personification", ["Simile", "Hyperbole", "Alliteration"], "Wind can't whisper. Giving human actions to non-human things is personification."),
  dev(1, "He was as brave as a lion.", "Simile", ["Metaphor", "Irony", "Personification"], "“As brave as” compares two things using “as,” so it is a simile."),
  dev(1, "Life is a roller coaster.", "Metaphor", ["Simile", "Hyperbole", "Onomatopoeia"], "It says life IS a roller coaster without “like” or “as.” That's a metaphor."),
  dev(1, "I'm so hungry I could eat a horse.", "Hyperbole", ["Simile", "Irony", "Symbolism"], "An extreme exaggeration for effect is hyperbole."),
  dev(1, "The bacon sizzled and the pancakes plopped onto the plate.", "Onomatopoeia", ["Alliteration", "Metaphor", "Foreshadowing"], "Words like “sizzled” and “plopped” imitate sounds."),
  dev(1, "Peter Piper picked a peck of pickled peppers.", "Alliteration", ["Onomatopoeia", "Simile", "Irony"], "Repeating the same starting sound (here “p”) is alliteration."),
  dev(2, "The fire station burned down on Tuesday.", "Irony", ["Simile", "Alliteration", "Hyperbole"], "It is unexpected, and the opposite of what we would expect, that a fire station would burn. That's situational irony."),
  dev(2, "Dark clouds gathered over the picnic as Dana noticed the unlocked gate swinging in the wind.", "Foreshadowing", ["Flashback", "Simile", "Onomatopoeia"], "Details that hint at trouble to come are foreshadowing."),
  dev(2, "Whenever Lila saw the white dove, she felt a sense of calm, as if it carried peace itself.", "Symbolism", ["Hyperbole", "Alliteration", "Irony"], "A dove standing for peace is a symbol: an object that represents a bigger idea."),
  dev(2, "As she opened the old photo album, Ana remembered the summer she turned ten, when the lake froze early.", "Flashback", ["Foreshadowing", "Irony", "Metaphor"], "Jumping back to an earlier time in the story is a flashback."),
  dev(2, "The classroom was a zoo before the teacher walked in.", "Metaphor", ["Simile", "Personification", "Irony"], "It says the classroom WAS a zoo, with no “like” or “as.”"),
  dev(2, "“Great weather we're having,” Sam muttered, as rain poured through the broken umbrella.", "Verbal irony", ["Simile", "Foreshadowing", "Symbolism"], "Sam says the opposite of what he means. That's verbal irony, often sarcasm."),
  dev(3, "The audience was struck by the silence that fell like a heavy curtain.", "Simile", ["Metaphor", "Personification", "Irony"], "“Like a heavy curtain” makes a comparison with “like,” so it is a simile."),
  dev(3, "She wore a smile that could light a city.", "Hyperbole", ["Simile", "Foreshadowing", "Onomatopoeia"], "A smile can't actually light a city. The exaggeration is hyperbole."),
  dev(3, "The mountain stood, patient and unmoved, as the storm raged at its feet.", "Personification", ["Simile", "Irony", "Alliteration"], "The mountain is described as patient, a human feeling, so this is personification."),
  dev(3, "The audience gasped when the lights went out: the one thing the magician had promised would never happen.", "Situational irony", ["Verbal irony", "Foreshadowing", "Alliteration"], "The outcome is the opposite of what was promised. That's situational irony."),
  dev(3, "By midnight, the moon was a ghostly balloon drifting over the lake.", "Metaphor", ["Simile", "Onomatopoeia", "Flashback"], "The moon is said to BE a balloon, with no “like” or “as.”"),
];

const POINT_OF_VIEW: Item[] = [
  qe(1, "I knew the moment I stepped into the room that something was different.", "Which point of view is used?", "First person", ["Second person", "Third person limited", "Third person omniscient"], "“I” tells you the narrator is a character in the story: first person."),
  qe(1, "She slammed the door and wondered why nobody had warned her.", "Which point of view is used?", "Third person limited", ["First person", "Second person", "Third person omniscient"], "The narrator is outside the story and knows only one character's thoughts."),
  qe(2, "He was angry. Across town, his sister was planning a surprise. In the bakery, a stranger prepared to deliver the cake that would ruin it all.", "This narrator knows what several characters think and do. What is the point of view?", "Third person omniscient", ["First person", "Third person limited", "Second person"], "An all-knowing narrator who moves between characters is omniscient."),
  qe(2, "You open the box and your hands begin to tremble.", "Which point of view is used?", "Second person", ["First person", "Third person limited", "Third person omniscient"], "Speaking to “you” is second person."),
];

// ---------- Argument & Media ----------

const ARGUMENT: Item[] = [
  q(1, "What is a claim in an argument?", "A statement the writer wants you to accept", ["A fact nobody disagrees with", "A list of sources", "The title of the article"], "A claim is the main point an author argues for. Evidence supports it."),
  q(1, "Which is the best evidence for the claim “Our school should start later”?", "A study showing teens learn better with more sleep", ["Mornings are annoying", "My cousin likes sleeping in", "Everyone says so"], "Strong evidence comes from reliable studies or facts, not feelings or rumours."),
  q(1, "A fact can be…", "checked and proven true or false", ["only a person's opinion", "something you like", "always about the future"], "A fact can be verified. An opinion is a belief or judgment."),
  q(1, "Which sentence is an opinion?", "Pizza is the best lunch.", ["Pizza is often baked in an oven.", "Some pizzas have cheese.", "Pizza was served at noon."], "“Best” is a judgment. People can disagree, so it is an opinion."),
  q(2, "An ad says “9 out of 10 dentists recommend brand X,” but doesn't say how many dentists were asked. What is the problem?", "The sample size is not shared, so the claim may mislead.", ["Dentists cannot recommend products.", "Brand X must be bad.", "The ad uses numbers."], "A claim about a group needs details, such as how many were surveyed and who they were."),
  q(2, "What does ethos mean in a persuasive text?", "Appealing to the writer's credibility or character", ["Appealing to emotions", "Appealing to logic and facts", "Appealing to humour"], "Ethos is about trust: “Listen to me because I am an expert.”"),
  q(2, "What does pathos mean in a persuasive text?", "Appealing to the audience's emotions", ["Appealing to the writer's credibility", "Appealing to logic and statistics", "Appealing to the writer's age"], "Pathos is about feelings, such as a sad story to move readers."),
  q(2, "What does logos mean in a persuasive text?", "Appealing to logic, reasons and facts", ["Appealing to emotions", "Appealing to the writer's fame", "Appealing to fear"], "Logos uses evidence and clear reasoning."),
  q(2, "A speaker says, “If we allow short recess, soon students will have no breaks at all!” What is this?", "A slippery slope", ["A fact", "A personal attack", "A bandwagon"], "A slippery slope claims one small step will unavoidably lead to an extreme result."),
  q(2, "“Everybody is buying this phone, so it must be the best.” What is the flaw?", "Bandwagon: popularity doesn't prove quality", ["It uses facts", "It cites an expert", "It is a fair comparison"], "Many people doing something doesn't make it good."),
  q(3, "A news site only publishes stories that make one politician look bad. What is this called?", "Bias", ["Satire", "A summary", "A fact check"], "Bias means leaning one way and leaving out other perspectives."),
  q(3, "Which source is usually most reliable for the number of students in a school district?", "The district's official report", ["An anonymous comment online", "A friend's text message", "A meme"], "Official reports from the organization responsible are usually the most accurate for facts like these."),
  q(3, "Why do websites label some posts “sponsored”?", "To show someone paid for the content", ["To show the post is false", "To show it is a fact check", "To show it is a news report"], "Sponsored content is advertising. Knowing that helps you judge its purpose."),
  q(3, "A headline reads “Scientists SHOCKED by new discovery!” without saying what was found. What technique is this?", "Clickbait", ["A summary", "A fact check", "A balanced report"], "Clickbait uses emotional, vague wording to make you click."),
  q(3, "To check whether a photo online is real, what is a good first step?", "Search for the original source of the image", ["Share it right away", "Trust it if many people like it", "Assume it is real because it looks real"], "Tracing the source helps spot edited or misplaced images."),
  q(3, "Which question best helps you judge the purpose of a media message?", "Who made this, and why?", ["How many colours does it use?", "How long is it?", "Is it popular?"], "Knowing the creator and their reason helps you spot persuasion or bias."),
];

const FACT_OPINION: SortSet = {
  prompt: "Fact or opinion? Sort each statement.",
  hint: "A fact can be checked and proved. An opinion is what someone thinks or feels, often with words like best, worst, boring or should.",
  bins: [
    { id: "fact", label: "Fact", emoji: "📋" },
    { id: "opinion", label: "Opinion", emoji: "💭" },
  ],
  items: [
    { label: "Vancouver Island is an island off the BC coast.", emoji: "🏝️", bin: "fact" },
    { label: "Water boils at 100 °C at sea level.", emoji: "♨️", bin: "fact" },
    { label: "A hexagon has six sides.", emoji: "⬡", bin: "fact" },
    { label: "Victoria is the capital of British Columbia.", emoji: "🏛️", bin: "fact" },
    { label: "The Grade 8 class has 28 students.", emoji: "🧑‍🎓", bin: "fact" },
    { label: "Winter is the best season.", emoji: "❄️", bin: "opinion" },
    { label: "Math homework is boring.", emoji: "📚", bin: "opinion" },
    { label: "Everyone should learn to play guitar.", emoji: "🎸", bin: "opinion" },
    { label: "That film was the funniest ever made.", emoji: "🎬", bin: "opinion" },
    { label: "Cats make better pets than dogs.", emoji: "🐱", bin: "opinion" },
  ],
};

// ---------- Grammar & Style ----------

const GRAMMAR: Item[] = [
  q(1, "Which sentence is punctuated correctly?", "My brother, who lives in Kelowna, is visiting.", ["My brother who lives in Kelowna, is visiting.", "My brother, who lives in Kelowna is visiting.", "My, brother who lives in Kelowna, is visiting."], "Commas go before and after extra information that isn't needed to identify the noun."),
  q(1, "Which sentence uses an apostrophe correctly?", "The dog's bowl is empty.", ["The dogs bowl's is empty.", "The dog's bowl's is empty.", "The dogs' bowl are empty."], "An apostrophe + s shows that something belongs to one dog."),
  q(1, "Choose the correct word: “__ going to be late.”", "They're", ["Their", "There", "Theyre"], "“They're” is a contraction of “they are.”"),
  q(1, "Choose the correct word: “The team lost __ final game.”", "its", ["it's", "its'", "it is"], "“Its” shows possession. “It's” means “it is.”"),
  q(1, "Which is a complete sentence?", "After the bell rang, we left.", ["After the bell rang.", "Running down the hall.", "Because we were late."], "A complete sentence has a subject and a verb and expresses a complete thought."),
  q(2, "Which sentence is in the passive voice?", "The window was broken by the ball.", ["The ball broke the window.", "Noah kicked the ball.", "The ball rolled away."], "In passive voice, the subject receives the action: “The window was broken.”"),
  q(2, "Rewrite in the active voice: “The cake was eaten by Mei.”", "Mei ate the cake.", ["The cake ate Mei.", "Eating was done by Mei.", "The cake was Mei's."], "Active voice puts the doer first: Mei (doer) ate (action) the cake."),
  q(2, "Which sentence has a run-on error?", "The bus was late we walked.", ["The bus was late, so we walked.", "The bus was late; we walked.", "The bus was late. We walked."], "Two complete sentences run together without punctuation or a connecting word make a run-on."),
  q(2, "Which sentence has parallel structure?", "She likes hiking, biking and swimming.", ["She likes hiking, to bike and swimming.", "She likes to hike, biking and swim.", "She likes hiking, biking and to swim."], "Keep a list in the same form: hiking, biking, swimming."),
  q(2, "In “Walking to school, Ravi found a wallet,” what is “Walking to school”?", "A participial phrase", ["A noun", "A complete sentence", "A conjunction"], "A phrase that begins with an -ing verb form and describes a noun is a participial phrase."),
  q(2, "Which sentence uses a semicolon correctly?", "I wanted to go; however, it was raining.", ["I wanted to go; but it was raining.", "I wanted; to go however it was raining.", "I wanted to go however; it was raining."], "A semicolon can join two related complete sentences, often before a word like “however.”"),
  q(2, "Which is a compound sentence?", "I made lunch, and Sam set the table.", ["I made lunch for Sam.", "After I made lunch, we ate.", "Making lunch is fun."], "A compound sentence joins two independent clauses with a conjunction such as “and.”"),
  q(3, "Choose the correct word: “The decision is between Ana and __.”", "me", ["I", "myself", "mine"], "After “between,” use an object pronoun: me."),
  q(3, "Which sentence has a misplaced modifier?", "Covered in mud, the coach cleaned the dog.", ["The coach cleaned the muddy dog.", "Covered in mud, the dog was cleaned by the coach.", "The coach cleaned the dog, which was covered in mud."], "“Covered in mud” seems to describe the coach, not the dog. Put the modifier next to what it describes."),
  q(3, "Choose the best word: “Neither of the answers __ correct.”", "is", ["are", "were", "be"], "“Neither” is singular, so it takes “is.”"),
  q(3, "Which sentence correctly uses a colon?", "Pack these: a jacket, boots and a hat.", ["Pack: these a jacket, boots and a hat.", "Pack these a jacket: boots and a hat.", "Pack, these: a jacket boots and a hat."], "A colon follows a complete statement and introduces a list or explanation."),
  q(3, "Which word is a gerund (a verb form used as a noun) in “Swimming is great exercise”?", "Swimming", ["is", "great", "exercise"], "“Swimming” names an activity and acts as the subject, so it is a gerund."),
];

// ---------- Word Study ----------

const WORDS: Item[] = [
  q(1, "The prefix “re-” in “rebuild” means…", "again", ["not", "before", "under"], "Re- means again: to build again."),
  q(1, "The prefix “un-” in “unfair” means…", "not", ["again", "above", "between"], "Un- means not: not fair."),
  q(1, "The suffix “-less” in “fearless” means…", "without", ["full of", "more", "able to"], "-less means without: without fear."),
  q(1, "The suffix “-ful” in “thankful” means…", "full of", ["without", "again", "before"], "-ful means full of: full of thanks."),
  q(1, "What does “synonym” mean?", "A word with a similar meaning", ["A word with the opposite meaning", "A word that sounds the same", "A word that rhymes"], "Syn- means same. Synonyms mean nearly the same thing."),
  q(2, "The Greek root “graph” means “write.” What does “autograph” most likely mean?", "A person's own signature", ["A machine for writing", "A long story", "A picture of a car"], "Auto means self and graph means write: writing by yourself."),
  q(2, "The Latin root “aqua” means “water.” What does “aquarium” most likely mean?", "A place to keep water animals", ["A kind of flower", "A type of desert", "A tall building"], "Aqua means water, so an aquarium is connected to water."),
  q(2, "The root “bio” means “life.” What is “biology”?", "The study of living things", ["The study of rocks", "The study of stars", "The study of words"], "Bio (life) + logy (study of) = the study of life."),
  q(2, "The root “port” means “carry.” Which word fits: “Please __ the box to the car.”?", "transport", ["report card", "import tax", "portrait"], "Trans- means across, port means carry. To transport is to carry across."),
  q(2, "Which word has the most positive connotation?", "slim", ["skinny", "scrawny", "bony"], "All four describe a thin body, but “slim” feels positive while the others feel negative."),
  q(2, "Which word has a more negative connotation than “curious”?", "nosy", ["interested", "eager", "inquisitive"], "“Nosy” suggests someone who pries where they shouldn't. “Curious” is neutral or positive."),
  q(2, "“The room was so quiet you could hear a pin drop.” This is…", "an idiom", ["a synonym", "a prefix", "a root"], "An idiom is a phrase whose meaning differs from its literal words."),
  q(3, "Read: “Her reticent nature meant she rarely shared opinions in class.” What does “reticent” most likely mean?", "reserved, not eager to speak", ["very loud", "friendly", "angry"], "The clue is “rarely shared opinions.” A reticent person holds back."),
  q(3, "Read: “The scientist’s meticulous notes recorded every tiny detail.” What does “meticulous” mean?", "very careful and exact", ["messy", "short", "hidden"], "“Every tiny detail” is the context clue. Meticulous means paying close attention to detail."),
  q(3, "The root “spect” means “look.” Which word means “to look closely at something”?", "inspect", ["respect", "suspect", "prospect"], "In- (into) + spect (look) = look into carefully. The other words have other meanings."),
  q(3, "Which pair are antonyms?", "ancient / modern", ["rapid / swift", "big / large", "calm / peaceful"], "Antonyms have opposite meanings. Ancient means very old and modern means new."),
  q(3, "What does the word “benevolent” most likely mean, knowing “bene” means “good” and “vol” means “wish”?", "kind and well-meaning", ["cruel", "forgetful", "powerful"], "Bene (good) + vol (wish) = wishing good for others."),
];

const WORD_PARTS: SortSet = {
  prompt: "Prefix or suffix? Sort each word part.",
  hint: "A prefix goes at the start of a word (re-, un-, pre-). A suffix goes at the end (-less, -ful, -ness).",
  bins: [
    { id: "prefix", label: "Prefix", emoji: "⏮️" },
    { id: "suffix", label: "Suffix", emoji: "⏭️" },
  ],
  items: [
    { label: "re- (again)", emoji: "🔁", bin: "prefix" },
    { label: "un- (not)", emoji: "🚫", bin: "prefix" },
    { label: "pre- (before)", emoji: "⏪", bin: "prefix" },
    { label: "mis- (wrongly)", emoji: "❌", bin: "prefix" },
    { label: "dis- (opposite of)", emoji: "↔️", bin: "prefix" },
    { label: "-less (without)", emoji: "0️⃣", bin: "suffix" },
    { label: "-ful (full of)", emoji: "🧺", bin: "suffix" },
    { label: "-ness (state of)", emoji: "💛", bin: "suffix" },
    { label: "-able (can be)", emoji: "✅", bin: "suffix" },
    { label: "-ment (result of)", emoji: "📦", bin: "suffix" },
  ],
};

// ---------- Unit builders ----------

function devices(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  return shuffle([...choose(DEVICES, level, 6), ...choose(POINT_OF_VIEW, level, 2)]).map(ask);
}

function argumentAndMedia(opts?: GenerateOptions): Question[] {
  return fromParts({ items: ARGUMENT, sorts: [FACT_OPINION] }, opts);
}

function grammarAndStyle(opts?: GenerateOptions): Question[] {
  return fromParts({ items: GRAMMAR }, opts);
}

function wordStudy(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  return shuffle([...choose(WORDS, level, 7).map(ask), sortQuestion(WORD_PARTS, perBin(level))]);
}

// ---------- Course ----------

export const course: Course = {
  grade: "8",
  subject: "language",
  bigIdeas: {
    "ca-bc": [
      "Language and story can be a source of creativity and joy.",
      "Exploring stories and other texts helps us understand ourselves and make connections to others and to the world.",
      "People understand text differently depending on their worldviews and perspectives.",
      "Texts are socially, culturally, and historically constructed.",
      "Questioning what we hear, read, and view contributes to our ability to be educated and engaged citizens.",
    ],
  },
  units: [
    {
      id: "close-reading",
      title: "Close Reading",
      emoji: "🔍",
      blurb: "Theme, tone and evidence",
      standards: { "ca-bc": "Reading closely: theme, tone, inference and evidence from short fiction and non-fiction texts" },
      parentNote:
        "Reading original short passages and answering questions about theme, tone, word choice, inference and the author's purpose, using evidence from the text.",
      generate: closeReading,
    },
    {
      id: "literary-devices",
      title: "Literary Devices",
      emoji: "🎭",
      blurb: "Irony, symbolism and point of view",
      standards: { "ca-bc": "Literary elements and devices, including irony, symbolism, foreshadowing and point of view" },
      parentNote:
        "Naming devices like simile, metaphor, personification, hyperbole, irony, foreshadowing and symbolism in short excerpts, and identifying a narrator's point of view.",
      generate: devices,
    },
    {
      id: "argument-and-media",
      title: "Argument & Media",
      emoji: "📰",
      blurb: "Claims, evidence and bias",
      standards: { "ca-bc": "Evaluating arguments and media: claims, evidence, persuasive appeals, bias and credibility" },
      parentNote:
        "Telling fact from opinion, spotting persuasive appeals (ethos, pathos, logos) and weak reasoning, and judging how reliable a source or media message is.",
      generate: argumentAndMedia,
    },
    {
      id: "grammar-and-style",
      title: "Grammar & Style",
      emoji: "✏️",
      blurb: "Clauses, voice and punctuation",
      standards: { "ca-bc": "Conventions of Canadian English: sentence structure, voice, punctuation and agreement" },
      parentNote:
        "Active and passive voice, run-ons, parallel structure, commas, apostrophes, semicolons, colons and common usage choices.",
      generate: grammarAndStyle,
    },
    {
      id: "word-study",
      title: "Word Study",
      emoji: "🔤",
      blurb: "Roots, affixes and connotation",
      standards: { "ca-bc": "Vocabulary strategies: Greek and Latin roots, affixes, context clues and connotation" },
      parentNote:
        "Using prefixes, suffixes and Greek and Latin roots to work out unfamiliar words, reading context clues, and noticing how word choice changes feeling.",
      generate: wordStudy,
    },
  ],
};
