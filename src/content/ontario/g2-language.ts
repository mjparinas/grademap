import { fromBank, type BankItem } from "../bank";
import { pick, randInt, sample, textChoice } from "../random";
import type { GenerateOptions, OrderQuestion, Question, Unit } from "../types";
import { buildSet, on, type Passage, passageQuestions, range } from "./kit";

// Ontario Grade 2 language (2023 curriculum). BC's phonics, sentence and story units are shared;
// these units cover the grammar, punctuation, sound devices and text features Ontario names.

// ---------- Grammar ----------

const GRAMMAR: BankItem[] = [
  { prompt: "Which word names a group? flock, feather, nest", right: "flock", wrong: ["feather", "nest"], hint: "A collective noun names a group of animals, people or things." },
  { prompt: "A ___ of wolves howled at the moon.", right: "pack", wrong: ["school", "bouquet"], hint: "Wolves travel in a pack." },
  { prompt: "A ___ of fish swam under the dock.", right: "school", wrong: ["pack", "flock"], hint: "A group of fish is called a school." },
  { prompt: "Which word is a noun for an idea or feeling? kindness, table, puppy", right: "kindness", wrong: ["table", "puppy"], hint: "You can't touch kindness. It is an idea, so it is an abstract noun." },
  { prompt: "Which word names something you can only feel or think? courage, backpack, river", right: "courage", wrong: ["backpack", "river"], hint: "Courage is an idea, not a thing you can hold." },
  { prompt: "Mia and Sam went home. ___ were tired.", right: "They", wrong: ["He", "She"], hint: "They stands for two or more people." },
  { prompt: "Which word can take the place of “the girl”?", right: "she", wrong: ["he", "they"], hint: "Use she for one girl or woman." },
  { prompt: "Which word can take the place of “my brother and me”?", right: "we", wrong: ["they", "he"], hint: "We includes the person who is talking." },
  { prompt: "I ___ happy today.", right: "am", wrong: ["is", "are"], hint: "Use am with I." },
  { prompt: "They ___ at the park.", right: "are", wrong: ["is", "am"], hint: "Use are with they, we and you." },
  { prompt: "She ___ ten years old.", right: "is", wrong: ["are", "am"], hint: "Use is with he, she and it." },
  { prompt: "This box is ___ than that box. (big)", right: "bigger", wrong: ["biggest", "more big"], hint: "Add -er when you compare two things." },
  { prompt: "Mari is the ___ runner in the class. (fast)", right: "fastest", wrong: ["faster", "more fast"], hint: "Add -est when you compare three or more things." },
  { prompt: "Which is the best sentence?", right: "My dog is the smallest dog on our street.", wrong: ["My dog is the smaller dog on our street.", "My dog is the most small dog on our street."], hint: "Use -est to compare one thing with many others." },
  { prompt: "Which word tells about the verb? The dog ran quickly.", right: "quickly", wrong: ["dog", "The"], hint: "An adverb tells how, when or where something happens." },
  { prompt: "What does the adverb “loudly” tell about? Tom sang loudly.", right: "sang", wrong: ["Tom", "loudly"], hint: "Loudly tells how Tom sang." },
  { prompt: "I wanted to play outside, ___ it was raining.", right: "but", wrong: ["or", "so"], hint: "But shows that the second part is a surprise." },
  { prompt: "We can walk ___ ride the bus.", right: "or", wrong: ["but", "because"], hint: "Or shows a choice." },
  { prompt: "She smiled ___ she won the game.", right: "because", wrong: ["or", "but"], hint: "Because gives the reason." },
];

function grammar(_opts?: GenerateOptions): Question[] {
  return fromBank(GRAMMAR, 8);
}

// ---------- Sentences: telling, asking, commanding, exclaiming, joining ----------

const SENTENCES: BankItem[] = [
  { prompt: "Which one is a command?", right: "Hang up your coat.", wrong: ["Where is your coat?", "Your coat is blue."], hint: "A command tells someone to do something." },
  { prompt: "Which one is a question?", right: "Did you feed the cat?", wrong: ["Feed the cat.", "You fed the cat."], hint: "A question asks something." },
  { prompt: "Which one is an exclamation?", right: "What a huge wave!", wrong: ["The wave is huge.", "Is the wave huge?"], hint: "An exclamation shows a strong feeling." },
  { prompt: "Which one is a statement?", right: "Our class has a pet fish.", wrong: ["Does our class have a fish?", "Feed the fish."], hint: "A statement tells something." },
  { prompt: "Which is a compound sentence?", right: "I like soup, and Mia likes salad.", wrong: ["I like soup.", "Soup and salad."], hint: "A compound sentence joins two complete sentences with a word like and, but or so." },
  { prompt: "Which is a compound sentence?", right: "It rained, so we stayed inside.", wrong: ["We stayed inside.", "Because it rained."], hint: "Two complete ideas are joined with so." },
  { prompt: "Which joins these two sentences? I was tired. I kept playing.", right: "I was tired, but I kept playing.", wrong: ["I was tired but, I kept playing.", "I was tired I kept playing."], hint: "Use a comma and a joining word between the two ideas." },
  { prompt: "Which one is NOT a complete sentence?", right: "Under the bed.", wrong: ["The dog sleeps.", "We eat lunch."], hint: "A sentence needs someone or something doing something." },
  { prompt: "Which one is a complete sentence?", right: "The bus stops here.", wrong: ["The big yellow bus.", "Stops at the corner."], hint: "A complete sentence tells who or what, and what they do." },
  { prompt: "Which end mark goes with: Please sit down", right: "a period", wrong: ["a question mark", "an exclamation mark"], hint: "A calm command ends with a period." },
  { prompt: "Which end mark goes with: Are you ready", right: "a question mark", wrong: ["a period", "an exclamation mark"], hint: "A question ends with a question mark." },
  { prompt: "Which sentence has the words in the best order?", right: "The little frog jumped into the pond.", wrong: ["Jumped the little frog into pond the.", "Into the little jumped frog pond the."], hint: "Say it out loud. The right order sounds natural." },
];

function sentences(_opts?: GenerateOptions): Question[] {
  return fromBank(SENTENCES, 8);
}

// ---------- Punctuation ----------

const PUNCTUATION: BankItem[] = [
  { prompt: "Which sentence uses capital letters correctly?", right: "My friend Aiyana lives in Toronto.", wrong: ["my friend aiyana lives in toronto.", "My Friend Aiyana lives in toronto."], hint: "Capital letters start sentences and the names of people and places." },
  { prompt: "Which sentence uses capital letters correctly?", right: "We visited Niagara Falls in July.", wrong: ["We visited niagara falls in July.", "We visited Niagara Falls in july."], hint: "Names of places are capitalized. Months are capitalized too." },
  { prompt: "Which sentence has commas in the right places?", right: "We bought apples, pears and plums.", wrong: ["We bought, apples pears and plums.", "We bought apples pears, and plums."], hint: "Use commas to separate items in a list." },
  { prompt: "Which sentence has commas in the right places?", right: "I packed socks, shoes, a hat and gloves.", wrong: ["I packed socks shoes a hat, and gloves.", "I packed, socks, shoes, a hat and gloves."], hint: "Put a comma after each item except the last." },
  { prompt: "Which shows that the hat belongs to Sam?", right: "Sam's hat", wrong: ["Sams hat", "Sams' hat"], hint: "Add an apostrophe and s to show who owns something." },
  { prompt: "Which shows that the toy belongs to the baby?", right: "the baby's toy", wrong: ["the babys toy", "the babies toy"], hint: "Add 's to show it belongs to one baby." },
  { prompt: "Which is correct?", right: "Ravi's dog is friendly.", wrong: ["Ravis dog is friendly.", "Ravi dog's is friendly."], hint: "The apostrophe goes right after the owner's name, before the s." },
  { prompt: "Which sentence shows the exact words someone said?", right: "“I am hungry,” said Ravi.", wrong: ["Ravi said he was hungry.", "I am hungry said Ravi."], hint: "Quotation marks go around the words a person says out loud." },
  { prompt: "Which uses quotation marks correctly?", right: "Mom said, “Time for dinner.”", wrong: ["“Mom said, Time for dinner.”", "Mom said Time for “dinner.”"], hint: "Put quotation marks around only the spoken words." },
  { prompt: "Which sentence is written correctly?", right: "We saw a moose.", wrong: ["we saw a moose.", "We saw a Moose."], hint: "Every sentence starts with a capital letter." },
  { prompt: "Which day of the week is written correctly?", right: "Wednesday", wrong: ["wednesday", "wednesDay"], hint: "Days of the week start with a capital letter." },
];

function punctuation(_opts?: GenerateOptions): Question[] {
  return fromBank(PUNCTUATION, 8);
}

// ---------- Word pictures: simile and consonance ----------

const WORD_PICTURES: BankItem[] = [
  { prompt: "Which sentence has a simile?", right: "The baby was as quiet as a mouse.", wrong: ["The baby was very quiet.", "The baby slept."], hint: "A simile compares two things using like or as." },
  { prompt: "Which sentence has a simile?", right: "Her hands were like ice.", wrong: ["Her hands were cold.", "Her hands got cold."], hint: "A simile uses the word like or as to compare." },
  { prompt: "Which is a simile?", right: "as busy as a bee", wrong: ["a busy day", "the bee buzzed"], hint: "Look for as … as or like." },
  { prompt: "What does “as brave as a lion” tell us?", right: "The person is very brave.", wrong: ["The person is a lion.", "The person lives in a zoo."], hint: "A simile compares to show a feeling or quality." },
  { prompt: "Which sentence repeats an ending or middle consonant sound?", right: "The black duck stuck in the muck.", wrong: ["The cat sat on the mat.", "A big red ball rolled by."], hint: "Listen for repeated consonant sounds like ck." },
  { prompt: "Which phrase has the same consonant sound again and again?", right: "pitter-patter, plip-plop", wrong: ["red and blue", "up and down"], hint: "Consonance repeats the same consonant sound in nearby words." },
  { prompt: "Which phrase uses repeated consonant sounds? lost, last, list", right: "lost, last, list", wrong: ["cat, dog, fish", "sun, moon, star"], hint: "The s and t sounds in the middle and end repeat." },
  { prompt: "Which is NOT a simile?", right: "The snow is a blanket.", wrong: ["The snow is like a blanket.", "The snow is as soft as a blanket."], hint: "No like or as here, so it is not a simile." },
  { prompt: "Complete the simile: as light as a ___", right: "feather", wrong: ["rock", "truck"], hint: "Pick something that is very light." },
  { prompt: "Complete the simile: as slow as a ___", right: "snail", wrong: ["rocket", "cheetah"], hint: "Pick something that moves very slowly." },
];

function wordPictures(_opts?: GenerateOptions): Question[] {
  return fromBank(WORD_PICTURES, 8);
}

// ---------- Reading detectives ----------

const PASSAGES: Passage[] = [
  {
    title: "Fox Night",
    text: ["Fox crept past the sleeping hens. Her stomach rumbled.", "She stopped at the gate and listened. Something creaked in the barn.", "With a quick leap, she was back in the dark woods."],
    questions: [
      { prompt: "Who is telling this story?", right: "someone outside the story", wrong: ["Fox", "a hen"], hint: "The story says “Fox crept” and “she”. The narrator uses third person." },
      { prompt: "Why did Fox go back to the woods?", right: "She heard a noise and got scared.", wrong: ["She was full.", "She wanted to sleep."], hint: "Something creaked in the barn." },
      { prompt: "What will Fox most likely do next?", right: "Look for food somewhere else.", wrong: ["Join the hens.", "Fix the barn."], hint: "Her stomach rumbled, so she still needs food." },
    ],
  },
  {
    title: "My Big Swim",
    text: ["I stood on the edge of the pool and my knees shook.", "“You can do it,” said Coach Lin. I took a deep breath and jumped.", "When I popped up, I was grinning from ear to ear."],
    questions: [
      { prompt: "Who is telling the story?", right: "the swimmer, using I", wrong: ["Coach Lin", "an outside narrator"], hint: "The word I shows first-person point of view." },
      { prompt: "How did the swimmer feel at the start?", right: "nervous", wrong: ["sleepy", "angry"], hint: "Their knees shook." },
      { prompt: "How did the swimmer feel at the end?", right: "proud and happy", wrong: ["scared", "bored"], hint: "They were grinning from ear to ear." },
    ],
  },
  {
    title: "Two Pets",
    text: ["Mateo has a dog named Pepper. Pepper loves to run and fetch sticks.", "Lena has a cat named Willow. Willow likes to nap in the sun.", "Both pets like to be petted."],
    questions: [
      { prompt: "How are Pepper and Willow the same?", right: "Both like to be petted.", wrong: ["Both love to fetch.", "Both are dogs."], hint: "Look at the last line." },
      { prompt: "How are Pepper and Willow different?", right: "Pepper likes to run. Willow likes to nap.", wrong: ["Pepper naps. Willow runs.", "They are exactly alike."], hint: "Compare what each pet loves to do." },
      { prompt: "Which pet is most likely to be tired after a walk?", right: "Pepper", wrong: ["Willow", "neither"], hint: "Pepper loves to run." },
    ],
  },
  {
    title: "Planting Day",
    text: ["First, Kenji dug a small hole. Next, he put the seed inside.", "Then he covered it with soil and gave it water.", "Finally, he put a sign in the ground."],
    questions: [
      { prompt: "What did Kenji do right after he dug the hole?", right: "put in the seed", wrong: ["watered it", "made a sign"], hint: "The word “next” tells us what came second." },
      { prompt: "What did Kenji do last?", right: "put a sign in the ground", wrong: ["dug a hole", "covered the seed"], hint: "Look for the word “finally”." },
      { prompt: "What kind of text is this?", right: "steps to follow in order", wrong: ["a poem", "a made-up fairy tale"], hint: "Words like first, next, then and finally tell us the order of steps." },
    ],
  },
];

function readingDetectives(_opts?: GenerateOptions): Question[] {
  return passageQuestions(PASSAGES, "passage", 8);
}

// ---------- Text features ----------

function textFeatures(opts?: GenerateOptions): Question[] {
  void opts;
  const chapters = [
    ["Bears", "Owls", "Frogs", "Bees", "Whales"],
    ["Maps", "Weather", "Rivers", "Farms", "Cities"],
  ];
  const toc = () => {
    const names = pick(chapters);
    const pages = [3, 9, 15, 21, 27].map((p) => p + randInt(0, 2));
    return names.map((n, i) => ({ chapter: i + 1, name: n, page: pages[i] }));
  };
  const tocVisual = (rows: ReturnType<typeof toc>) => ({ type: "table" as const, title: "Table of Contents", headers: ["Chapter", "Title", "Page"], rows: rows.map((r) => [r.chapter, r.name, r.page]) });
  const findPage = (): Question => {
    const rows = toc();
    const r = pick(rows);
    return textChoice(`On which page does the chapter “${r.name}” begin?`, String(r.page), sample(rows.filter((x) => x !== r).map((x) => String(x.page)), 2), "Find the title in the middle column, then read the page number.", tocVisual(rows));
  };
  const whichChapter = (): Question => {
    const rows = toc();
    const r = pick(rows);
    return textChoice(`You want to read about ${r.name.toLowerCase()}. Which chapter do you read?`, `Chapter ${r.chapter}`, sample(rows.filter((x) => x !== r).map((x) => `Chapter ${x.chapter}`), 2), "A table of contents lists the chapter titles in order.", tocVisual(rows));
  };
  const feature = (): Question =>
    pick<() => Question>([
      () => textChoice("Which text feature shows the order of chapters and their pages?", "table of contents", ["chart", "icon"], "A table of contents is at the front of a book."),
      () => textChoice("A small picture on a sign that tells you something is called a…", "icon", ["chapter", "title"], "An icon is a small symbol that gives information quickly."),
      () => textChoice("Which feature puts facts in rows and columns?", "chart", ["icon", "journal"], "A chart organizes information in rows and columns."),
      () => textChoice("Which text is a journal entry?", "October 3. Today we saw a moose at the lake.", ["Mix flour and eggs. Then stir.", "Once upon a time, a dragon slept."], "A journal entry often starts with a date and tells what happened to the writer."),
      () => textChoice("Words like first, next and finally help the reader know…", "the order of events", ["the name of the author", "the price of the book"], "Order words show what comes first, next and last."),
    ])();
  const order = (): OrderQuestion => {
    const sets = [
      ["Wake up", "Brush your teeth", "Get dressed", "Eat breakfast", "Go to school"],
      ["Mix the batter", "Pour it in a pan", "Bake it", "Let it cool", "Eat the cake"],
    ];
    const items = pick(sets);
    return { kind: "order", prompt: "Tap the steps in the order they happen.", hint: "Think about what has to happen first.", items: items.map((label, i) => ({ id: `t${i}`, label })) };
  };
  const chartRead = (): Question => {
    const rows = ["Mon", "Tue", "Wed"].map((day) => ({ day, books: randInt(2, 9) }));
    const r = pick(rows);
    return textChoice(`How many books were read on ${r.day}?`, String(r.books), sample(range(1, 11).filter((n) => n !== r.books).map(String), 2), "Find the day, then read across to the number.", { type: "table", title: "Books we read", headers: ["Day", "Books"], rows: rows.map((x) => [x.day, x.books]) });
  };
  return buildSet([findPage, findPage, whichChapter, feature, feature, feature, order, chartRead]);
}

export const units: Unit[] = [
  {
    id: "grammar-2",
    title: "Grammar Gears",
    emoji: "⚙️",
    blurb: "Nouns, pronouns, verbs and more",
    standards: on("B3.2", "collective and abstract nouns, pronouns, forms of “to be”, comparing with adjectives, adverbs and joining words"),
    parentNote: "Using the right form of the verb “to be”, choosing pronouns, comparing with -er and -est, and picking joining words like but, or and because.",
    generate: grammar,
  },
  {
    id: "build-sentences",
    title: "Build Sentences",
    emoji: "🧱",
    blurb: "Four kinds of sentences, and joining them",
    standards: on("B3.1, B3.3", "statements, questions, commands, exclamations and compound sentences"),
    parentNote: "Telling the four sentence types apart, spotting complete sentences, and joining two ideas into a compound sentence.",
    generate: sentences,
  },
  {
    id: "punctuation-2",
    title: "Punctuation Power",
    emoji: "✏️",
    blurb: "Capitals, commas, apostrophes and quotes",
    standards: on("B3.3", "capital letters for proper nouns, commas in lists, apostrophes and quotation marks"),
    parentNote: "Capital letters for names and places, commas in lists, apostrophes to show who owns something, and quotation marks for speech.",
    generate: punctuation,
  },
  {
    id: "word-pictures",
    title: "Word Pictures",
    emoji: "🎨",
    blurb: "Similes and sound patterns",
    standards: on("C3.1", "similes and consonance"),
    parentNote: "Spotting similes (comparisons with like or as) and repeated consonant sounds, and what they add to a text.",
    generate: wordPictures,
  },
  {
    id: "reading-detectives",
    title: "Reading Detectives",
    emoji: "🔎",
    blurb: "Clues, feelings and who is telling it",
    standards: on("C1.6, C2.3, C3.2, C3.3", "who is telling the story, predicting, making inferences, and comparing"),
    parentNote: "Reading short texts to work out who is telling the story, what will happen next, how characters feel, and how things are the same and different.",
    generate: readingDetectives,
  },
  {
    id: "text-features",
    title: "Text Features",
    emoji: "📖",
    blurb: "Contents, charts, icons and order",
    standards: on("C1.3", "the table of contents, charts, icons and chronological order"),
    parentNote: "Using a table of contents, charts and icons to find information, and following order words in steps and journal entries.",
    generate: textFeatures,
  },
];
