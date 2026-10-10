import type { Unit } from "../types";
import { e, order, q, sorter, unitOf, type Item } from "../ontario/k-g2-kit";
import { ab } from "./kit";

// Alberta Kindergarten English language arts. The letter, sound, word and story units are shared with BC and
// Ontario (see k.ts). These two units cover talking and listening, and sharing real and imaginary ideas.

// ---------- Talk and Listen ----------

const TALK: Item[] = [
  q("Mia wants to tell about her weekend. Which is a whole idea?", "I went to the lake with my dad.", ["lake", "went the"], "A sentence tells a whole idea, with who and what happened.", { emoji: "🏞️" }),
  q("Which one is a sentence?", "The dog runs fast.", ["dog fast", "the the run"], "A sentence has words in an order that makes sense."),
  q("Your friend is talking. What do your ears and eyes do?", "listen and look at them", ["look away and hum", "run around"], "Good listeners look at the speaker and keep quiet.", { emoji: "👂" }),
  q("You have a question for the teacher. What do you do?", "raise your hand", ["shout out", "walk away"], "We take turns by raising a hand and waiting.", { emoji: "✋" }),
  q("Which one is a question?", "Can I have a turn?", ["I like turns.", "It is my turn."], "A question asks something. It often starts with who, what, where or can."),
  q("Which word starts a question?", "Where", ["Blue", "Jump"], "Question words include who, what, where, when and why.", { d: 2 }),
  q("A friend shares a story. What is a good thing to ask?", "What happened next?", ["Why are you here?", "Be quiet!"], "Asking a question shows that we listened.", { d: 2 }),
  q("Which sentence tells about a poem?", "A poem has rhyming words.", ["A poem is a tall chair.", "A poem cooks lunch."], "Poems often have rhymes and a beat.", { emoji: "📜", d: 2 }),
  q("Sam says, “I saw a big red truck.” What did Sam tell about?", "a truck", ["a boat", "a snow day"], "Listen for the main thing in what someone says.", { emoji: "🚚" }),
  q("Everyone is sharing in a circle. How do you know it is your turn?", "The talker passes to you", ["You jump in right away", "You go to the door"], "Sharing circles use turns so everybody is heard.", { d: 2 }),
  q("Which one is the best way to say what you need?", "May I have some water, please?", ["Water now!", "mmm"], "Clear words and a kind voice help others understand.", { d: 2 }),
  q("Which sentence says it all?", "My cat sleeps on the couch.", ["My cat", "on the couch the"], "A complete idea tells who or what and what they do.", { d: 3 }),
  q("You tell a story. Which word helps the listener know when?", "yesterday", ["purple", "round"], "Words like yesterday, today and later tell when.", { d: 3 }),
  q("Which is a poem line that rhymes with “cat”?", "The cat sat on a mat.", ["The dog ran in the sun.", "A fish swims in a bowl."], "Cat, sat and mat all end with the same sound.", { d: 3 }),
];

// ---------- Real or Imaginary ----------

const REAL: Item[] = [
  q("Which one is real?", e("a dog that barks", "🐕"), [e("a dog that flies to the Moon", "🚀"), e("a dog that talks on the phone", "📞")], "Real things can happen in our world.", { emoji: "🐕" }),
  q("Which one is make-believe?", "a dragon who bakes bread", ["a baker who bakes bread", "a bus that stops"], "Dragons who bake are only in stories we imagine.", { emoji: "🐉" }),
  q("A story says a rabbit can talk. This part is…", "imaginary", ["real", "a recipe"], "Real rabbits do not talk, so a talking rabbit is imaginary.", { emoji: "🐇" }),
  q("A book shows how a seed grows into a bean plant. It is…", "real information", ["make-believe", "a song"], "Books that tell facts about the world share real information.", { emoji: "🌱" }),
  q("Which place is real?", "a library in your town", ["a castle in the clouds", "a house made of cake"], "A library is a real place you can visit.", { emoji: "📚" }),
  q("Which is a real animal?", e("a moose", "🫎"), [e("a unicorn", "🦄"), e("a dragon", "🐉")], "Moose live in forests and wetlands in Alberta.", { d: 2 }),
  q("Which is imaginary?", e("a unicorn", "🦄"), [e("a bison", "🦬"), e("a horse", "🐴")], "Bison and horses are real animals. Unicorns are made up.", { d: 2 }),
  q("Which could be a story you make up?", "A bear who drives a bus", ["The bus stops at school", "It snowed on Monday"], "Bears do not drive, so this is a made-up story.", { d: 2 }),
  q("You draw a picture of your family. What do you share?", "something real", ["something no one can know", "a made-up monster only"], "A drawing of your family shows real people you know.", { emoji: "🖍️" }),
  q("You tell a story about a flying bike. Is it real?", "No, it is imaginary", ["Yes, bikes fly", "It is a rule"], "Bikes do not fly, so this is a story from your imagination.", { emoji: "🚲" }),
  q("Which can you do with an idea?", "draw it or tell it", ["eat it", "put it in a pocket"], "We share ideas by drawing, speaking, writing or acting.", { d: 2 }),
  q("Rin acts out a duck in a play. What is Rin doing?", "sharing an idea by acting", ["washing dishes", "sleeping"], "Acting is one way to share a story.", { emoji: "🦆", d: 2 }),
  q("Which one tells about a real person?", "My grandpa works at a farm.", ["A giant eats the Moon.", "A fish rides a bike."], "A real person is someone who lives in our world.", { d: 3 }),
  q("Which one is a good title for a make-believe story?", "The Cloud Who Wanted a Hat", ["How to Wash Your Hands", "Bus Safety Rules"], "Make-believe stories use imaginary ideas, like a cloud with a hat.", { d: 3 }),
];

const REAL_SORT = sorter({
  prompt: "Real or make-believe? Tap a picture, then its basket.",
  hint: "Real things are in our world. Make-believe things are from stories we imagine.",
  bins: [
    { id: "real", label: "Real", emoji: "🌎" },
    { id: "pretend", label: "Make-believe", emoji: "✨" },
  ],
  items: [
    { label: "cow", emoji: "🐄", bin: "real" },
    { label: "tree", emoji: "🌳", bin: "real" },
    { label: "bus", emoji: "🚌", bin: "real" },
    { label: "duck", emoji: "🦆", bin: "real" },
    { label: "dragon", emoji: "🐉", bin: "pretend" },
    { label: "unicorn", emoji: "🦄", bin: "pretend" },
    { label: "fairy", emoji: "🧚", bin: "pretend" },
    { label: "mermaid", emoji: "🧜", bin: "pretend" },
  ],
});

const TELL = order("Tell a story. Tap the pictures in order: first, next, last.", "A story has a beginning, a middle and an end.", [
  ["wake up", "⏰"],
  ["play outside", "🛝"],
  ["go to bed", "🛏️"],
]);

export const units: Unit[] = [
  {
    id: "talk-and-listen-ab",
    title: "Talk & Listen",
    emoji: "🗣️",
    blurb: "Sentences, questions and taking turns",
    standards: ab("Develop listening and speaking skills by sharing ideas, stories, and poems.; Contribute to discussions by asking questions and speaking in sentences that contain complete ideas.", "listening, taking turns, asking questions and speaking in sentences with complete ideas"),
    parentNote: "Chat about the day, ask your child to answer in a whole sentence, and let them ask you questions. Poems and rhymes are great practice too.",
    generate: unitOf(TALK),
  },
  {
    id: "real-or-imaginary-ab",
    title: "Real or Imaginary",
    emoji: "🧚",
    blurb: "Share ideas about real and make-believe things",
    standards: ab("Share understandings of ideas and information about people, places, or things that are real or imaginary.; Express ideas and information creatively.", "sharing ideas about real and imaginary people, places and things, and sharing them creatively"),
    parentNote: "Read both stories and fact books together and ask: could this really happen? Then invite your child to draw, tell or act out a story of their own.",
    generate: unitOf(REAL, [REAL_SORT, TELL]),
  },
];
