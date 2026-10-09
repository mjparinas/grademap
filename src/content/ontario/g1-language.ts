import { fromBank, type BankItem } from "../bank";
import type { Question, Unit } from "../types";
import { on, type Passage, passageQuestions } from "./kit";

// Ontario Grade 1 language (2023 curriculum). The phonics, sentences and story units BC children
// use are shared; these four cover the grammar, sentence types, sound devices and reasoning
// about texts that Ontario names for Grade 1.

// ---------- Word jobs: verbs in time, describing words, joining words ----------

const WORD_JOBS: BankItem[] = [
  { prompt: "Which sentence tells about the past?", right: "I jumped over the log.", wrong: ["I jump over the log.", "I will jump over the log."], hint: "Past means it already happened. Many past words end in -ed." },
  { prompt: "Which sentence tells about right now?", right: "I paint a picture.", wrong: ["I painted a picture.", "I will paint a picture."], hint: "Present means it is happening now." },
  { prompt: "Which sentence tells about the future?", right: "I will read a book tomorrow.", wrong: ["I read a book yesterday.", "I read a book today."], hint: "Future means it has not happened yet. Look for the word will." },
  { prompt: "Which word tells about the past? walked, walk, will walk", right: "walked", wrong: ["walk", "will walk"], hint: "Past action words often end in -ed." },
  { prompt: "Which word tells about the future?", right: "will play", wrong: ["played", "plays"], hint: "The word will tells us it is going to happen later." },
  { prompt: "Which word is a describing word? The big dog ran.", right: "big", wrong: ["dog", "ran"], hint: "A describing word tells us more about a person, animal or thing." },
  { prompt: "Which word describes how it feels? The soft blanket is warm.", right: "soft", wrong: ["blanket", "is"], hint: "Soft tells us about the blanket." },
  { prompt: "Which word tells how someone moves? Ana runs quickly.", right: "quickly", wrong: ["Ana", "runs"], hint: "Quickly tells us how Ana runs." },
  { prompt: "Which word joins the two parts? I like tea and I like milk.", right: "and", wrong: ["like", "milk"], hint: "Joining words like and, but and or connect ideas." },
  { prompt: "Which joining word fits? I want a snack, ___ I am hungry.", right: "because", wrong: ["but", "or"], hint: "Because tells us the reason." },
  { prompt: "Which joining word fits? I like cake, ___ I do not like pie.", right: "but", wrong: ["and", "because"], hint: "But shows that two ideas are different." },
  { prompt: "Which joining word fits? Do you want milk ___ juice?", right: "or", wrong: ["and", "but"], hint: "Or gives a choice." },
  { prompt: "Which word is a naming word (noun)? The cat sleeps.", right: "cat", wrong: ["the", "sleeps"], hint: "A noun names a person, place or thing." },
  { prompt: "Which word is an action word (verb)? The frog jumps.", right: "jumps", wrong: ["frog", "the"], hint: "An action word tells what someone does." },
  { prompt: "Which sentence is written correctly?", right: "Mom and I went to the park.", wrong: ["Mom and i went to the park.", "i and Mom went to the park."], hint: "The word I is always a capital letter." },
  { prompt: "Which word fits? Yesterday we ___ in the snow.", right: "played", wrong: ["play", "will play"], hint: "Yesterday means it already happened." },
];

function wordJobs(): Question[] {
  return fromBank(WORD_JOBS, 8);
}

// ---------- Sentence types ----------

const SENTENCE_TYPES: BankItem[] = [
  { prompt: "Which one is a question?", right: "Where is my hat?", wrong: ["My hat is red.", "Put on your hat."], hint: "A question asks something and ends with a question mark (?)." },
  { prompt: "Which one is a question?", right: "Can we go outside?", wrong: ["We can go outside.", "Go outside now."], hint: "A question asks something and ends with a question mark (?)." },
  { prompt: "Which one tells you to do something?", right: "Please close the door.", wrong: ["The door is open.", "Is the door open?"], hint: "A command tells someone what to do." },
  { prompt: "Which one tells you to do something?", right: "Wash your hands.", wrong: ["My hands are clean.", "Are your hands clean?"], hint: "A command tells someone what to do." },
  { prompt: "Which one is a telling sentence?", right: "The bird sings.", wrong: ["Does the bird sing?", "Sing with the bird."], hint: "A telling sentence tells something and usually ends with a period (.)." },
  { prompt: "Which one is a telling sentence?", right: "I have a red ball.", wrong: ["Do you have a ball?", "Give me the ball."], hint: "A telling sentence tells something and usually ends with a period (.)." },
  { prompt: "Which one shows a big feeling?", right: "Wow, that is huge!", wrong: ["That is big.", "Is that big?"], hint: "An exclamation shows a strong feeling and ends with an exclamation mark (!)." },
  { prompt: "Which one shows a big feeling?", right: "I won the race!", wrong: ["I ran in a race.", "Did you race?"], hint: "An exclamation shows a strong feeling and ends with an exclamation mark (!)." },
  { prompt: "Which mark ends this sentence? Do you like pizza", right: "?", wrong: [".", "!"], hint: "A question ends with a question mark." },
  { prompt: "Which mark ends this sentence? The sun is hot", right: ".", wrong: ["?", "!"], hint: "A telling sentence ends with a period." },
  { prompt: "Which one is one sentence with two ideas joined?", right: "I like dogs and I like cats.", wrong: ["I like dogs.", "Like cats."], hint: "A joined sentence has two ideas connected by a word like and." },
  { prompt: "Which one is one sentence with two ideas joined?", right: "It is cold, but I am warm.", wrong: ["It is cold.", "Warm and cold."], hint: "A joined sentence has two ideas connected by a word like but." },
  { prompt: "Which sentence starts correctly?", right: "The cat is sleeping.", wrong: ["the cat is sleeping.", "The Cat is sleeping."], hint: "A sentence starts with a capital letter. Only names need other capitals." },
];

function sentenceTypes(): Question[] {
  return fromBank(SENTENCE_TYPES, 8);
}

// ---------- Sound play: rhyme, alliteration, sound words ----------

const SOUND_PLAY: BankItem[] = [
  { prompt: "Which word rhymes with cat?", right: "hat", wrong: ["cup", "dog"], hint: "Rhyming words end with the same sound." },
  { prompt: "Which word rhymes with sun?", right: "run", wrong: ["sit", "sad"], hint: "Rhyming words end with the same sound." },
  { prompt: "Which word rhymes with night?", right: "light", wrong: ["name", "nest"], hint: "Rhyming words end with the same sound." },
  { prompt: "Which words rhyme?", right: "bee and tree", wrong: ["bee and bed", "tree and trap"], hint: "Say both words and listen to the ending." },
  { prompt: "Which one is a sound word? Buzz, flower, yellow", right: "buzz", wrong: ["flower", "yellow"], hint: "A sound word sounds like the noise it names." },
  { prompt: "Which one is a sound word?", right: "splash", wrong: ["puddle", "wet"], hint: "Splash sounds like the water noise." },
  { prompt: "Which sound word goes with a clock?", right: "tick", wrong: ["roar", "moo"], hint: "A clock makes a ticking sound." },
  { prompt: "Which sound word goes with a cow?", right: "moo", wrong: ["tick", "pop"], hint: "A cow says moo." },
  { prompt: "Which sentence starts many words with the same sound?", right: "Silly snakes slide slowly.", wrong: ["The dog ran home.", "Birds fly high."], hint: "Look for the same first sound again and again: s, s, s, s." },
  { prompt: "Which sentence starts many words with the same sound?", right: "Big bears bake bread.", wrong: ["My cat sat down.", "The sun is up."], hint: "Look for the same first sound again and again: b, b, b, b." },
  { prompt: "Which sentence has the same first sound over and over?", right: "Tiny turtles take turns.", wrong: ["Rain falls from clouds.", "We eat our lunch."], hint: "Say it out loud and listen for t, t, t, t." },
  { prompt: "Rhymes make a poem fun to hear. Which pair rhymes?", right: "star and far", wrong: ["star and stop", "far and fun"], hint: "The ending sounds are the same in rhyming words." },
];

function soundPlay(): Question[] {
  return fromBank(SOUND_PLAY, 8);
}

// ---------- Think it through: main idea, details and simple inferences ----------

const PASSAGES: Passage[] = [
  {
    text: ["Amir put on his boots and a warm hat.", "He grabbed his shovel and ran outside.", "White flakes fell on his nose."],
    questions: [
      { prompt: "What is the story mostly about?", right: "Amir plays outside in the snow.", wrong: ["Amir goes swimming.", "Amir bakes a cake."], hint: "Think about what Amir wears and what falls on his nose." },
      { prompt: "What fell on Amir's nose?", right: "snowflakes", wrong: ["rain", "leaves"], hint: "Reread the last line. The flakes were white." },
      { prompt: "What time of year is it most likely?", right: "winter", wrong: ["summer", "spring"], hint: "Boots, a warm hat and snow tell us it is cold." },
    ],
  },
  {
    text: ["Lena filled the bowl with seeds.", "She hung it from the tree.", "Soon a chickadee came to eat."],
    questions: [
      { prompt: "What is the main idea?", right: "Lena feeds the birds.", wrong: ["Lena plants a tree.", "Lena goes to bed."], hint: "What did Lena put in the bowl, and who came to eat?" },
      { prompt: "Where did Lena hang the bowl?", right: "in a tree", wrong: ["on a door", "on a fence"], hint: "Reread the second line." },
      { prompt: "What do we know about the chickadee?", right: "It likes seeds.", wrong: ["It is sleepy.", "It is afraid of Lena."], hint: "The chickadee came to eat the seeds." },
    ],
  },
  {
    text: ["Ravi's sister was crying.", "Her balloon floated up into the sky.", "Ravi gave her a big hug."],
    questions: [
      { prompt: "Why was Ravi's sister crying?", right: "Her balloon floated away.", wrong: ["She was hungry.", "She lost her shoe."], hint: "Reread the second line." },
      { prompt: "How did Ravi most likely feel?", right: "kind and caring", wrong: ["angry", "bored"], hint: "He gave her a hug to help her feel better." },
      { prompt: "What did Ravi do?", right: "He hugged her.", wrong: ["He ran away.", "He popped a balloon."], hint: "Look at the last line." },
    ],
  },
  {
    text: ["The sky turned dark and grey.", "Zoe heard a loud boom.", "She hid under her blanket and waited."],
    questions: [
      { prompt: "What was most likely happening?", right: "a thunderstorm", wrong: ["a parade", "a sunny day"], hint: "A dark sky and a loud boom are clues." },
      { prompt: "How did Zoe feel?", right: "a little scared", wrong: ["very sleepy", "silly"], hint: "She hid under her blanket." },
      { prompt: "Where did Zoe hide?", right: "under her blanket", wrong: ["in the car", "behind a tree"], hint: "Reread the last line." },
    ],
  },
  {
    text: ["Mateo planted a seed in a pot.", "Every day he gave it water.", "One morning, a tiny green sprout poked out."],
    questions: [
      { prompt: "What did Mateo do every day?", right: "gave the seed water", wrong: ["dug it up", "painted the pot"], hint: "Reread the second line." },
      { prompt: "What happened one morning?", right: "A sprout came up.", wrong: ["The pot broke.", "The seed flew away."], hint: "Reread the last line." },
      { prompt: "What is the main idea?", right: "A seed grows into a plant.", wrong: ["Mateo goes shopping.", "A pot is empty."], hint: "Think about the seed, the water and the sprout." },
    ],
  },
];

function thinkItThrough(): Question[] {
  return passageQuestions(PASSAGES, "story", 8);
}

export const units: Unit[] = [
  {
    id: "word-jobs",
    title: "Word Jobs",
    emoji: "🧩",
    blurb: "Past, now, future and joining words",
    standards: on("B3.2", "verb tenses, describing words, and joining words in sentences"),
    parentNote: "Telling past, present and future apart, spotting describing words and action words, and choosing joining words like and, but, or and because.",
    generate: wordJobs,
  },
  {
    id: "sentence-types",
    title: "Kinds of Sentences",
    emoji: "💬",
    blurb: "Tell, ask, command and shout",
    standards: on("B3.1, B3.3", "telling, asking, command and exclamation sentences, with the right end mark"),
    parentNote: "Knowing a telling sentence from a question, a command and an exclamation, choosing the end mark, and seeing sentences with two ideas joined.",
    generate: sentenceTypes,
  },
  {
    id: "sound-play",
    title: "Sound Play",
    emoji: "🎵",
    blurb: "Rhymes, sound words and tongue twisters",
    standards: on("C3.1", "rhyme, alliteration and onomatopoeia"),
    parentNote: "Hearing rhymes, sound words (like buzz and splash) and repeated beginning sounds, and noticing how they make texts fun to read.",
    generate: soundPlay,
  },
  {
    id: "think-it-through",
    title: "Think It Through",
    emoji: "🕵️",
    blurb: "Main idea, details and clues",
    standards: on("C2.6, C3.2", "finding the main idea and making simple inferences"),
    parentNote: "Reading a short story, finding the main idea and details, and using clues to work out what is not said.",
    generate: thinkItThrough,
  },
];
