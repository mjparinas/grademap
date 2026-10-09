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
  { prompt: "A ___ of bees buzzed around the flowers.", right: "swarm", wrong: ["pack", "school"], hint: "A group of bees is called a swarm." },
  { prompt: "A ___ of cows stood in the field.", right: "herd", wrong: ["school", "swarm"], hint: "A group of cows is called a herd." },
  { prompt: "Which word names a feeling you cannot touch? joy, spoon, rock", right: "joy", wrong: ["spoon", "rock"], hint: "Joy is a feeling, so it is an abstract noun." },
  { prompt: "Which word can take the place of “Leo and Zoe”?", right: "they", wrong: ["we", "she"], hint: "Use they for two or more other people." },
  { prompt: "He ___ my best friend.", right: "is", wrong: ["am", "are"], hint: "Use is with he, she and it." },
];

function grammar(): Question[] {
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
  { prompt: "Which one is a statement?", right: "The snow fell all night.", wrong: ["Did the snow fall?", "Look at the snow!"], hint: "A statement tells something and ends with a period." },
  { prompt: "Which one is a question?", right: "Can we play outside?", wrong: ["We can play outside.", "Play outside."], hint: "A question asks something and ends with a question mark." },
  { prompt: "Which one is a command?", right: "Wash your hands.", wrong: ["Did you wash your hands?", "My hands are clean."], hint: "A command tells someone to do something." },
  { prompt: "Which one is an exclamation?", right: "That was so much fun!", wrong: ["That was a game.", "Was that fun?"], hint: "An exclamation shows a strong feeling and ends with an exclamation mark." },
  { prompt: "Which is a compound sentence?", right: "Amir sang, and Lena played the drum.", wrong: ["Amir sang a song.", "Lena and Amir."], hint: "A compound sentence joins two complete ideas with a joining word." },
  { prompt: "Which is a compound sentence?", right: "I wanted a snack, but we had none.", wrong: ["I wanted a snack.", "A snack, but none."], hint: "But joins two complete sentences." },
  { prompt: "Which joins these two sentences? It was cold. We wore coats.", right: "It was cold, so we wore coats.", wrong: ["It was cold so, we wore coats.", "It was cold we wore coats."], hint: "Use a comma and a joining word like so." },
  { prompt: "Which one is NOT a complete sentence?", right: "Ran down the hill.", wrong: ["Sam ran down the hill.", "The kids play."], hint: "It does not tell who ran." },
  { prompt: "Which one is NOT a complete sentence?", right: "The tall green tree.", wrong: ["The tree grows.", "Birds sing."], hint: "It does not tell what the tree does." },
  { prompt: "Which one is a complete sentence?", right: "Priya reads a book.", wrong: ["Reads a book.", "A good book."], hint: "A complete sentence tells who and what they do." },
  { prompt: "Which end mark goes with: What a lovely surprise", right: "an exclamation mark", wrong: ["a question mark", "a period"], hint: "A strong feeling ends with an exclamation mark." },
  { prompt: "Which end mark goes with: We ate lunch at noon", right: "a period", wrong: ["a question mark", "an exclamation mark"], hint: "A telling sentence ends with a period." },
];

function sentences(): Question[] {
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
  { prompt: "Which sentence uses capital letters correctly?", right: "Noah and Zoe live in Ottawa.", wrong: ["noah and zoe live in ottawa.", "Noah and zoe live in Ottawa."], hint: "Names of people and places start with a capital letter." },
  { prompt: "Which sentence uses capital letters correctly?", right: "Our school is closed on Monday.", wrong: ["Our school is closed on monday.", "our school is closed on Monday."], hint: "Days of the week are capitalized, and so is the first word." },
  { prompt: "Which sentence has commas in the right places?", right: "I like red, blue, green and yellow.", wrong: ["I like red blue, green and yellow.", "I like, red, blue, green and yellow."], hint: "Use commas to separate items in a list." },
  { prompt: "Which sentence has commas in the right places?", right: "We saw ducks, geese, swans and herons.", wrong: ["We saw ducks geese swans, and herons.", "We saw, ducks, geese, swans and herons."], hint: "Put a comma after each item except the last." },
  { prompt: "Which shows that the ball belongs to Maya?", right: "Maya's ball", wrong: ["Mayas ball", "Mayas' ball"], hint: "Add an apostrophe and s to show who owns something." },
  { prompt: "Which shows that the bike belongs to the girl?", right: "the girl's bike", wrong: ["the girls bike", "the girl bike's"], hint: "Add 's right after the owner." },
  { prompt: "Which is correct?", right: "Kenji's backpack is red.", wrong: ["Kenjis backpack is red.", "Kenji backpack's is red."], hint: "The apostrophe goes after the owner's name, before the s." },
  { prompt: "Which sentence shows the exact words someone said?", right: "“Let's go,” said Ana.", wrong: ["Ana said they should go.", "Let's go said Ana."], hint: "Quotation marks go around the spoken words." },
  { prompt: "Which uses quotation marks correctly?", right: "Dad asked, “Who wants toast?”", wrong: ["“Dad asked, Who wants toast?”", "Dad “asked,” Who wants toast?"], hint: "Put quotation marks around only the words that are spoken." },
  { prompt: "Which month is written correctly?", right: "September", wrong: ["september", "sepTember"], hint: "Months of the year start with a capital letter." },
  { prompt: "Which sentence is written correctly?", right: "Jay has a new puppy.", wrong: ["jay has a new puppy.", "Jay has a new Puppy."], hint: "Names start with a capital letter, and so does the first word." },
  { prompt: "Which place name is written correctly?", right: "Lake Ontario", wrong: ["lake ontario", "Lake ontario"], hint: "Every word in the name of a place starts with a capital letter." },
  { prompt: "Which sentence has the right punctuation?", right: "Sam said, “I found it!”", wrong: ["Sam said, I found it!", "“Sam said, I found it!”"], hint: "Quotation marks go around only what Sam said." },
];

function punctuation(): Question[] {
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
  { prompt: "Which sentence has a simile?", right: "The kitten was as soft as a cloud.", wrong: ["The kitten was very soft.", "The kitten purred."], hint: "A simile compares two things using like or as." },
  { prompt: "Which sentence has a simile?", right: "The wind howled like a wolf.", wrong: ["The wind was strong.", "The wind howled."], hint: "Look for the word like." },
  { prompt: "Which is a simile?", right: "as tall as a tree", wrong: ["a tall tree", "the tree grew"], hint: "Look for as … as or like." },
  { prompt: "Which is a simile?", right: "like a rocket", wrong: ["a fast rocket", "the rocket flew"], hint: "A simile uses like or as to compare." },
  { prompt: "What does “as quiet as a mouse” tell us?", right: "Someone is very quiet.", wrong: ["Someone is a mouse.", "Someone is squeaking."], hint: "The simile compares to show how quiet someone is." },
  { prompt: "What does “as cold as ice” tell us?", right: "Something is very cold.", wrong: ["Something is made of ice.", "Something is slippery."], hint: "A simile compares to show a quality." },
  { prompt: "Which is NOT a simile?", right: "The moon is a night light.", wrong: ["The moon is like a night light.", "The moon is as bright as a lamp."], hint: "There is no like or as, so it is not a simile." },
  { prompt: "Complete the simile: as sweet as ___", right: "honey", wrong: ["a lemon", "a rock"], hint: "Pick something that tastes very sweet." },
  { prompt: "Complete the simile: as fast as a ___", right: "cheetah", wrong: ["turtle", "snail"], hint: "Pick something that runs very fast." },
  { prompt: "Complete the simile: as soft as a ___", right: "pillow", wrong: ["brick", "nail"], hint: "Pick something that is very soft." },
  { prompt: "Complete the simile: as flat as a ___", right: "pancake", wrong: ["ball", "balloon"], hint: "Pick something that is very flat." },
  { prompt: "Which phrase repeats the same consonant sound?", right: "slippery slimy slug", wrong: ["big brown bear", "red hot ball"], hint: "Listen for the s and sl sounds repeated." },
  { prompt: "Which sentence repeats a consonant sound?", right: "The fish flipped and flopped in the foam.", wrong: ["The dog ran to the park.", "A bird sat in a tree."], hint: "Listen for the f sound at the start of words." },
  { prompt: "Which words use the repeated sound ck?", right: "tick, tock, clock", wrong: ["ring, bell, song", "drip, drop, rain"], hint: "Each word has the ck sound." },
];

function wordPictures(): Question[] {
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
  {
    title: "The Lost Mitten",
    text: ["Priya found a small red mitten in the snow. It was wet and cold.", "She hung it on the fence so its owner could see it.", "The next day, a boy ran up and shouted, “That's mine!”"],
    questions: [
      { prompt: "Why did Priya hang the mitten on the fence?", right: "So its owner could find it.", wrong: ["So it could dry for her.", "Because she did not like it."], hint: "She wanted the owner to see it." },
      { prompt: "How do we know the boy was happy to see the mitten?", right: "He shouted, “That's mine!”", wrong: ["He walked away.", "He was wearing a hat."], hint: "Look at what he said and how he said it." },
      { prompt: "Who is telling this story?", right: "someone outside the story", wrong: ["Priya", "the boy"], hint: "The story says “Priya found”, not “I found”." },
    ],
  },
  {
    title: "Cat and Dog Day",
    text: ["Jay has a cat named Mochi. Mochi likes to sit by the window and watch birds.", "Ana has a dog named Biscuit. Biscuit likes to dig in the garden.", "Both animals love treats."],
    questions: [
      { prompt: "How are Mochi and Biscuit the same?", right: "Both love treats.", wrong: ["Both dig in the garden.", "Both watch birds."], hint: "Look at the last line." },
      { prompt: "How are Mochi and Biscuit different?", right: "Mochi watches birds. Biscuit digs.", wrong: ["Mochi digs. Biscuit watches birds.", "They do the same things."], hint: "Compare what each animal likes to do." },
      { prompt: "Which animal is more likely to get muddy paws?", right: "Biscuit", wrong: ["Mochi", "neither"], hint: "Biscuit digs in the garden." },
    ],
  },
  {
    title: "Making a Sandwich",
    text: ["First, Lena put two slices of bread on a plate. Next, she spread butter on one slice.", "Then she added cheese and a leaf of lettuce.", "Finally, she put the other slice on top."],
    questions: [
      { prompt: "What did Lena do right after she put bread on the plate?", right: "spread butter", wrong: ["added lettuce", "put bread on top"], hint: "The word “next” tells what came second." },
      { prompt: "What did Lena do last?", right: "put the other slice on top", wrong: ["added cheese", "spread butter"], hint: "Look for the word “finally”." },
      { prompt: "What kind of text is this?", right: "steps to follow in order", wrong: ["a made-up fairy tale", "a poem"], hint: "First, next, then and finally show the order of steps." },
    ],
  },
  {
    title: "Thunder Night",
    text: ["I pulled the blanket up to my nose. Thunder rumbled outside my window.", "Then I heard a soft scratch. My cat Pip jumped onto the bed and curled up beside me.", "Soon, my heart felt calm and my eyes grew heavy."],
    questions: [
      { prompt: "Who is telling the story?", right: "the child, using I", wrong: ["Pip the cat", "an outside narrator"], hint: "The words I and my show first-person point of view." },
      { prompt: "How did the child feel at the start?", right: "scared", wrong: ["excited", "bored"], hint: "They pulled the blanket up to their nose when the thunder rumbled." },
      { prompt: "What will the child most likely do next?", right: "fall asleep", wrong: ["go outside", "start a game"], hint: "Their eyes grew heavy." },
    ],
  },
];

function readingDetectives(): Question[] {
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
