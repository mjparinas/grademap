import { fromBank, type BankItem } from "../bank";
import { pick, sample, shuffle, textChoice } from "../random";
import type { Question, Unit } from "../types";
import { on, type Passage, passageQuestions } from "./kit";

// Ontario Grade 3 language (2023 curriculum). BC's phonics, spelling, word-part and story units are
// shared; these units cover the grammar, sentence types, punctuation, literary devices and text
// patterns Ontario names for Grade 3.

// ---------- Grammar ----------

const GRAMMAR: BankItem[] = [
  { prompt: "Which shows that the bone belongs to the dog?", right: "the dog's bone", wrong: ["the dogs bone", "the dog bone's"], hint: "Add an apostrophe and s to one owner." },
  { prompt: "Two girls each own a hat. Which is correct? The ___ hats are red.", right: "girls'", wrong: ["girl's", "girls"], hint: "When there is more than one owner and the word ends in s, the apostrophe goes after the s." },
  { prompt: "Which sentence uses the apostrophe correctly?", right: "Mia's backpack is blue.", wrong: ["Mias' backpack is blue.", "Mia backpack's is blue."], hint: "The apostrophe goes right after the owner's name, before the s." },
  { prompt: "Which is correct?", right: "The children's toys are in the box.", wrong: ["The childrens' toys are in the box.", "The childrens toys are in the box."], hint: "Children is already plural, so add 's to show who owns the toys." },
  { prompt: "Which word is the linking verb? The soup is hot.", right: "is", wrong: ["soup", "hot"], hint: "A linking verb links the subject to a word that describes it." },
  { prompt: "Which sentence has a linking verb?", right: "The cat is sleepy.", wrong: ["The cat chased the mouse.", "The cat jumped high."], hint: "Is links the cat to the word sleepy. The other verbs show actions." },
  { prompt: "The pie ___ delicious yesterday.", right: "was", wrong: ["were", "is"], hint: "Yesterday means past tense, and one pie needs was." },
  { prompt: "Which sentence tells what is happening right now?", right: "She is reading a book.", wrong: ["She read a book.", "She will read a book."], hint: "The progressive tense uses is, am or are with an -ing verb." },
  { prompt: "Which sentence is in the past progressive tense?", right: "They were playing soccer.", wrong: ["They play soccer.", "They played soccer."], hint: "Use was or were with an -ing verb." },
  { prompt: "Use the progressive tense: Right now, the birds ___ in the tree.", right: "are singing", wrong: ["sang", "will sing"], hint: "Right now means are plus an -ing verb." },
  { prompt: "Which word completes the question? ___ book do you want to read?", right: "Which", wrong: ["Where", "How"], hint: "Which asks you to choose one from a group, and it describes the noun book." },
  { prompt: "Which word completes the question? ___ coat is this?", right: "Whose", wrong: ["Where", "When"], hint: "Whose asks who owns something." },
  { prompt: "___ is the party? At the park.", right: "Where", wrong: ["When", "Why"], hint: "The answer tells a place, so ask where." },
  { prompt: "___ does the movie start? At 3 o'clock.", right: "When", wrong: ["Where", "Why"], hint: "The answer tells a time, so ask when." },
  { prompt: "___ did you walk to school? Because it was sunny.", right: "Why", wrong: ["How", "When"], hint: "The answer gives a reason, so ask why." },
  { prompt: "Which word is the preposition? The cat hid under the table.", right: "under", wrong: ["hid", "cat"], hint: "A preposition shows where something is or how things are related." },
  { prompt: "Which word shows where the ball is? The ball is beside the box.", right: "beside", wrong: ["ball", "box"], hint: "Beside is a preposition. It tells where the ball is." },
  { prompt: "Which word is an interjection? Wow! That is a huge fish.", right: "Wow", wrong: ["huge", "fish"], hint: "An interjection shows a sudden feeling, like surprise." },
  { prompt: "Which sentence has an interjection?", right: "Oops! I dropped my cup.", wrong: ["I dropped my cup.", "My cup is on the floor."], hint: "Oops! shows a quick feeling at the start of the sentence." },
];

function grammar(): Question[] {
  return fromBank(GRAMMAR, 8);
}

// ---------- Sentences ----------

const SENTENCES: BankItem[] = [
  { prompt: "Which is a simple sentence?", right: "The bird sings.", wrong: ["The bird sings, and the frog croaks.", "When the sun rises, the bird sings."], hint: "A simple sentence has one complete idea." },
  { prompt: "Which is a compound sentence?", right: "I wanted to swim, but the pool was closed.", wrong: ["I wanted to swim.", "Although the pool was closed, I wanted to swim."], hint: "A compound sentence joins two complete ideas with a word like and, but or so." },
  { prompt: "Which is a complex sentence?", right: "Because it was cold, we wore mittens.", wrong: ["It was cold, so we wore mittens.", "We wore mittens."], hint: "A complex sentence has a main idea plus a part that starts with a word like because, when or although." },
  { prompt: "Which word starts the adverbial clause? We ate lunch after we finished the game.", right: "after", wrong: ["lunch", "ate"], hint: "An adverbial clause tells when, why or how. It begins with a joining word like after." },
  { prompt: "Which part is the adverbial clause? Although it was late, Noah kept reading.", right: "Although it was late", wrong: ["Noah kept reading", "kept reading"], hint: "The clause with the joining word, Although, cannot stand alone as a sentence." },
  { prompt: "Which word completes the sentence? ___ the bell rang, everyone lined up.", right: "When", wrong: ["But", "Or"], hint: "When tells the time that everyone lined up." },
  { prompt: "Which word completes the sentence? I like soccer, ___ my sister prefers hockey.", right: "but", wrong: ["when", "because"], hint: "But joins two ideas that are different." },
  { prompt: "Which word completes the sentence? Lena stayed inside ___ it was raining.", right: "because", wrong: ["but", "or"], hint: "The second part gives the reason." },
  { prompt: "Which sentence joins these two ideas? Tom likes pizza. Ana likes tacos.", right: "Tom likes pizza, and Ana likes tacos.", wrong: ["Tom likes pizza and, Ana likes tacos.", "Tom likes pizza Ana likes tacos."], hint: "Put a comma before and when you join two complete sentences." },
  { prompt: "Which is a run-on sentence?", right: "The dog barked the mailman left.", wrong: ["The dog barked, and the mailman left.", "The dog barked."], hint: "A run-on sentence squishes two ideas together without a joining word or punctuation." },
  { prompt: "Which is a sentence fragment?", right: "Because the road was icy.", wrong: ["The road was icy.", "We drove slowly."], hint: "A fragment leaves the idea unfinished. What happened because the road was icy?" },
  { prompt: "Which sentence puts the adverbial clause at the end?", right: "We played outside while the sun was shining.", wrong: ["While the sun was shining, we played outside.", "We played outside."], hint: "Look for the part that starts with while and comes last." },
  { prompt: "Which is a complex sentence?", right: "I will bring a snack if you bring a drink.", wrong: ["I will bring a snack, and you bring a drink.", "I will bring a snack."], hint: "If starts a part that cannot stand alone." },
  { prompt: "What does the word although show?", right: "a surprise or a difference", wrong: ["a reason", "a time"], hint: "Although shows that something is not what you would expect." },
  { prompt: "What does the word because show?", right: "a reason", wrong: ["a choice", "a surprise"], hint: "Because tells why something happened." },
  { prompt: "What does the word while show?", right: "two things happening at the same time", wrong: ["a choice", "a reason"], hint: "While means during the time that something else is happening." },
];

function sentences(): Question[] {
  return fromBank(SENTENCES, 8);
}

// ---------- Punctuation ----------

const PUNCTUATION: BankItem[] = [
  { prompt: "Which sentence is punctuated correctly?", right: "Maya said, “Let's go to the park.”", wrong: ["Maya said, “let's go to the park.”", "Maya said “Let's go to the park”."], hint: "Put a comma after said, a capital letter on the first spoken word, and the end mark inside the quotation marks." },
  { prompt: "Which sentence is punctuated correctly?", right: "“I love swimming,” said Jay.", wrong: ["“I love swimming.” said Jay.", "“I love swimming” said, Jay."], hint: "When the speaker comes after the words, end the spoken part with a comma inside the quotation marks." },
  { prompt: "Which sentence shows the exact words the teacher said?", right: "The teacher said, “Please sit down.”", wrong: ["The teacher said please sit down.", "The teacher said that we should sit down."], hint: "Quotation marks show the exact words someone said out loud." },
  { prompt: "Which title is written correctly?", right: "The Tale of the Brave Rabbit", wrong: ["the tale of the brave rabbit", "The tale Of The brave Rabbit"], hint: "Capitalize the first word and the important words in a title. Small words like of and the stay lowercase in the middle." },
  { prompt: "Which title is written correctly?", right: "Little Bear and the Moon", wrong: ["Little bear and the moon", "little Bear And The Moon"], hint: "Capitalize the first word and the important words of a title." },
  { prompt: "Which shows the short form of “do not”?", right: "don't", wrong: ["dont", "do'nt"], hint: "The apostrophe goes where the missing letter was." },
  { prompt: "Which shows the short form of “it is”?", right: "it's", wrong: ["its", "it'is"], hint: "The apostrophe takes the place of the letter i that was left out." },
  { prompt: "Which shows the short form of “we are”?", right: "we're", wrong: ["were", "w'ere"], hint: "The apostrophe takes the place of the letter a." },
  { prompt: "Which sentence uses its or it's correctly?", right: "It's a sunny day.", wrong: ["Its a sunny day.", "It's' a sunny day."], hint: "It's means it is. Check by reading it is in its place." },
  { prompt: "Which sentence quotes the book correctly?", right: "The book says, “Owls hunt at night.”", wrong: ["The book says “owls hunt at night”.", "The book says, Owls “hunt at night.”"], hint: "Use a comma, then quotation marks around the exact words from the book." },
  { prompt: "Which sentence has a comma in the right place?", right: "After we ate, we played cards.", wrong: ["After we ate we, played cards.", "After, we ate we played cards."], hint: "Put a comma after the opening part, before the main idea." },
  { prompt: "Which sentence has a comma in the right place?", right: "When it rains, we play inside.", wrong: ["When it rains we, play inside.", "When, it rains we play inside."], hint: "Put a comma after the part that starts with When." },
  { prompt: "Which sentence uses capital letters correctly?", right: "Our teacher, Ms. Lee, lives in Ottawa.", wrong: ["Our Teacher, ms. Lee, lives in Ottawa.", "Our teacher, Ms. Lee, lives in ottawa."], hint: "Capitalize names of people, titles that go with a name, and places." },
  { prompt: "Which line shows who is speaking, with capital letters in the right places?", right: "“Where is my hat?” asked Ravi.", wrong: ["“Where is my hat?” Asked Ravi.", "“where is my hat?” asked Ravi."], hint: "The spoken words start with a capital. Asked is a regular word in the middle of the sentence." },
  { prompt: "Which sentence is punctuated correctly?", right: "Mom said, “Dinner is ready.”", wrong: ["Mom said, “Dinner is ready”.", "Mom said “, Dinner is ready.”"], hint: "In Canada, the end mark goes inside the closing quotation marks." },
  { prompt: "Which shows the short form of “they have”?", right: "they've", wrong: ["theyve", "they'ave"], hint: "The apostrophe takes the place of the letters ha." },
  { prompt: "Many girls own the team. Which is correct?", right: "The girls' team won the game.", wrong: ["The girl's team won the game.", "The girls team's won the game."], hint: "Many girls own one team, so put the apostrophe after the s." },
];

function punctuation(): Question[] {
  return fromBank(PUNCTUATION, 8);
}

// ---------- Literary devices and style ----------

const DEVICES: BankItem[] = [
  { prompt: "Which sentence is a metaphor?", right: "The classroom was a zoo.", wrong: ["The classroom was like a zoo.", "The classroom was noisy."], hint: "A metaphor says one thing IS another thing, without using like or as." },
  { prompt: "Which sentence is a metaphor?", right: "My brother is a night owl.", wrong: ["My brother stays up late.", "My brother is as sleepy as an owl."], hint: "A metaphor describes something by saying it is something else." },
  { prompt: "Which sentence is a simile?", right: "He ran like the wind.", wrong: ["He was the wind.", "He ran fast."], hint: "A simile uses like or as to compare." },
  { prompt: "“The moon is a silver coin.” What does this metaphor tell you?", right: "The moon is round and shiny.", wrong: ["The moon is made of money.", "The moon is very small."], hint: "Think about what a silver coin looks like." },
  { prompt: "“Her smile is sunshine.” What does this metaphor mean?", right: "Her smile is warm and bright and makes people happy.", wrong: ["She is smiling outside.", "Her smile is hot enough to burn."], hint: "Think about how sunshine makes you feel." },
  { prompt: "“My brother is a night owl.” What does it mean?", right: "He likes to stay up late.", wrong: ["He has feathers.", "He sleeps all day and all night."], hint: "Owls are awake at night." },
  { prompt: "What two things are being compared? “The snow is a white blanket.”", right: "snow and a blanket", wrong: ["white and a blanket", "snow and white"], hint: "Find the two nouns that the sentence says are the same." },
  { prompt: "How does a metaphor help the reader?", right: "It helps us picture something by comparing it to something else.", wrong: ["It tells us the author's name.", "It makes the story shorter."], hint: "A metaphor paints a picture in our minds." },
  { prompt: "Which phrase has assonance, with words that repeat the same vowel sound?", right: "a cool blue moon", wrong: ["a quick brown dog", "a blue pencil case"], hint: "Say it aloud. Listen for the same vowel sound in cool, blue and moon." },
  { prompt: "Which phrase has assonance?", right: "high white kites flying by", wrong: ["the bus drove past", "my old wooden box"], hint: "Listen for the long i sound in high, white, kites and flying." },
  { prompt: "Which phrase has assonance?", right: "the green seeds sleep", wrong: ["a quick brown dog", "the bus drove past"], hint: "Listen for the long e sound in green, seeds and sleep." },
  { prompt: "What is assonance?", right: "repeating the same vowel sound in nearby words", wrong: ["repeating the same word", "words that mean the opposite"], hint: "Assonance is about vowel sounds, like the o in slow and road." },
  { prompt: "Which sentence has the strongest word choice?", right: "The tiny puppy trembled in the storm.", wrong: ["The little puppy was in the storm.", "The puppy did things in the storm."], hint: "Exact, vivid words help us picture what is happening." },
  { prompt: "Which word is the strongest verb? The mouse ___ across the floor.", right: "scurried", wrong: ["went", "moved"], hint: "A strong verb shows exactly how something moves." },
  { prompt: "Which sentence sounds like it was written by someone who is excited?", right: "We won! I can't believe it!", wrong: ["The game ended.", "There was a game on Saturday."], hint: "Short bursts and exclamation marks show strong feeling. That is the writer's voice." },
];

function devices(): Question[] {
  return fromBank(DEVICES, 8);
}

// ---------- Text patterns, point of view and inferences ----------

const PASSAGES: Passage[] = [
  {
    title: "Why Leaves Change Colour",
    text: [
      "Leaves are green because they hold a green material that helps the tree make food.",
      "In autumn the days get shorter, so the tree makes less of this green material. As the green fades, the yellow and orange colours that were hiding in the leaf can be seen.",
      "Soon the leaves drop, and the tree rests through the winter.",
    ],
    questions: [
      { prompt: "Why do leaves lose their green colour in autumn?", right: "The tree makes less of the green material.", wrong: ["The leaves get too much rain.", "The wind paints them."], hint: "Look for the cause. The days get shorter, so the tree makes less green material." },
      { prompt: "What happens after the green fades?", right: "Yellow and orange colours can be seen.", wrong: ["The tree grows new leaves.", "The tree makes more food."], hint: "Read the second paragraph again." },
      { prompt: "Which word in the first sentence shows a cause?", right: "because", wrong: ["green", "tree"], hint: "Because tells the reason." },
      { prompt: "What is the main idea?", right: "Leaves change colour when the days get shorter.", wrong: ["Trees need a lot of water.", "Winter is cold."], hint: "The main idea is what the whole passage is mostly about." },
    ],
  },
  {
    title: "The Missing Mitten",
    text: [
      "When Hana got to the bus stop, she patted her pockets. She had only one mitten. Her ears felt cold, but her heart felt even colder.",
      "She looked all along the sidewalk, retracing her steps. Then she saw a bright red scrap sticking out of the snow bank. “Found you!” she cried, and tugged it free.",
    ],
    questions: [
      { prompt: "Where did Hana find the mitten?", right: "in a snow bank", wrong: ["on the bus", "in her desk"], hint: "Read the last sentences." },
      { prompt: "How did Hana feel when she saw the mitten?", right: "relieved and happy", wrong: ["angry", "bored"], hint: "She cried “Found you!” That tells us she was glad." },
      { prompt: "What does “retracing her steps” mean?", right: "going back along the way she came", wrong: ["running very fast", "counting her steps"], hint: "She looked along the sidewalk where she had already walked." },
      { prompt: "What can you tell about the weather?", right: "It was cold and snowy.", wrong: ["It was hot.", "It was rainy and warm."], hint: "She needed mittens and there was a snow bank." },
    ],
  },
  {
    title: "Volcano Day",
    text: [
      "I carried my volcano to the gym with both arms. My heart was thumping.",
      "When the judge stopped at my table, I forgot every word I had practised. Then I took a deep breath and began, “This is how a volcano erupts.”",
    ],
    questions: [
      { prompt: "Who is telling this story?", right: "the person who made the volcano", wrong: ["the judge", "a teacher"], hint: "The word I shows who is telling it." },
      { prompt: "What point of view is this story told from?", right: "first person", wrong: ["third person", "second person"], hint: "A story that uses I is told in the first person." },
      { prompt: "How did the narrator feel at first?", right: "nervous", wrong: ["bored", "sleepy"], hint: "Their heart was thumping and they forgot their words." },
      { prompt: "Which sentence tells the start of the story from the judge's point of view?", right: "The judge stopped at the table and listened to the young scientist.", wrong: ["I forgot every word I had practised.", "My heart was thumping."], hint: "A third-person telling uses the judge and the scientist, not I." },
    ],
  },
  {
    title: "The Heron",
    text: [
      "Every morning, a great blue heron stood still at the edge of the pond. It watched the water with sharp yellow eyes.",
      "A frog hopped near the reeds. Quick as lightning, the heron struck.",
    ],
    questions: [
      { prompt: "Who is telling this story?", right: "someone outside the story", wrong: ["the heron", "the frog"], hint: "The story says “it” and “the heron”, not I." },
      { prompt: "What point of view is this story told from?", right: "third person", wrong: ["first person", "second person"], hint: "When the narrator is not a character, it is told in the third person." },
      { prompt: "Why does the heron stand so still?", right: "so it can catch a meal without scaring it away", wrong: ["because it is sleeping", "because it is cold"], hint: "Think about what the heron does when the frog hops close." },
      { prompt: "What will most likely happen to the frog?", right: "It will be eaten.", wrong: ["It will hop away safely.", "It will swim across the pond."], hint: "The heron struck as quick as lightning." },
    ],
  },
  {
    title: "Staying Safe on Your Bike",
    text: [
      "Most important of all, always wear a helmet. It protects your head if you fall.",
      "Also, ride on the right-hand side of the road and stop at stop signs.",
      "Finally, a bell or bright clothes help other people see and hear you.",
    ],
    questions: [
      { prompt: "Which tip does the writer say is most important?", right: "wearing a helmet", wrong: ["ringing a bell", "wearing bright clothes"], hint: "Look for the words “most important of all”." },
      { prompt: "How are the tips organized?", right: "from most important to less important", wrong: ["in alphabetical order", "from smallest to biggest"], hint: "The writer starts with the most important tip and ends with the last one." },
      { prompt: "What word shows that a tip is coming last?", right: "Finally", wrong: ["Also", "Most"], hint: "Finally means last." },
      { prompt: "Which tip helps people see you?", right: "wearing bright clothes", wrong: ["stopping at stop signs", "riding on the right-hand side"], hint: "Look at the last paragraph." },
    ],
  },
];

const INDEX_TOPICS = ["Ants", "Beavers", "Caribou", "Eagles", "Frogs", "Lynx", "Moose", "Otters", "Salmon", "Wolves"];

function indexQuestions(count: number): Question[] {
  const rows = () => {
    const names = sample(INDEX_TOPICS, 5).sort();
    const pages = shuffle([4, 9, 12, 17, 23, 28, 31, 36]).slice(0, 5);
    return names.map((name, i) => ({ name, page: pages[i] }));
  };
  const visual = (r: ReturnType<typeof rows>) => ({ type: "table" as const, title: "Index", headers: ["Topic", "Page"], rows: r.map((x) => [x.name, x.page]) });
  const findPage = (): Question => {
    const r = rows();
    const t = pick(r);
    return textChoice(`On which page can you read about ${t.name.toLowerCase()}?`, String(t.page), r.filter((x) => x !== t).slice(0, 2).map((x) => String(x.page)), "Find the topic in the list, then read its page number.", visual(r));
  };
  const findTopic = (): Question => {
    const r = rows();
    const t = pick(r);
    return textChoice(`Which topic is on page ${t.page}?`, t.name, r.filter((x) => x !== t).slice(0, 2).map((x) => x.name), "Find the page number, then read the topic beside it.", visual(r));
  };
  const first = (): Question => {
    const three = sample(INDEX_TOPICS, 3);
    const top = [...three].sort()[0];
    return textChoice("An index lists topics in alphabetical order. Which of these would come first?", top, three.filter((x) => x !== top), "Compare the first letters. Which comes earliest in the alphabet?");
  };
  const purpose = (): Question => textChoice("What is an index used for?", "to find the page where a topic is", ["to tell you who wrote the book", "to show the story's ending"], "An index is at the back of a book. It lists topics and the pages they are on.");
  const makers = [findPage, findTopic, first, purpose];
  return shuffle(makers).slice(0, count).map((m) => m());
}

function textPatterns(): Question[] {
  return shuffle([...passageQuestions(PASSAGES, "passage", 5), ...indexQuestions(3)]);
}

export const units: Unit[] = [
  {
    id: "grammar-3",
    title: "Grammar Gears",
    emoji: "⚙️",
    blurb: "Possessives, verbs and prepositions",
    standards: on("B3.2", "possessive nouns, linking verbs, the progressive tense, question words, prepositions and interjections"),
    parentNote: "Showing who owns something with 's, choosing linking verbs and -ing verbs, using question words like which and whose, and spotting prepositions and interjections.",
    generate: grammar,
  },
  {
    id: "sentences-3",
    title: "Sentence Builders",
    emoji: "🧱",
    blurb: "Simple, compound and complex",
    standards: on("B3.1", "simple, compound and complex sentences with adverbial clauses"),
    parentNote: "Telling simple, compound and complex sentences apart, choosing joining words like because, although and while, and fixing run-ons and fragments.",
    generate: sentences,
  },
  {
    id: "punctuation-3",
    title: "Punctuation Power",
    emoji: "❝",
    blurb: "Quotes, titles and apostrophes",
    standards: on("B3.3", "capital letters in titles and dialogue, commas and quotation marks, and apostrophes"),
    parentNote: "Punctuating what people say with commas and quotation marks, capitalizing titles, and using apostrophes in short forms and for owners.",
    generate: punctuation,
  },
  {
    id: "devices-3",
    title: "Word Pictures",
    emoji: "🖼️",
    blurb: "Metaphors and sound patterns",
    standards: on("C1.5, C3.1", "metaphor, assonance and word choice, and how they help communicate meaning"),
    parentNote: "Understanding metaphors and similes, hearing repeated vowel sounds (assonance), and choosing strong, exact words.",
    generate: devices,
  },
  {
    id: "text-patterns",
    title: "Reading Patterns",
    emoji: "🔍",
    blurb: "Cause, order, point of view and the index",
    standards: on("C1.3, C1.6, C3.2, C3.3", "text patterns and features, point of view, inferences and main ideas"),
    parentNote: "Spotting cause and effect and order of importance, deciding who is telling a story, making inferences from clues, and using an index.",
    generate: textPatterns,
  },
];
