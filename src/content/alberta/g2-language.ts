import { shuffle } from "../random";
import type { GenerateOptions, Question, Unit } from "../types";
import { ab, passageQuestions, type Passage } from "./kit";
import { q, sorter, unitOf, type Item } from "../ontario/k-g2-kit";

// Alberta Grade 2 English language arts. The two units here cover the listening, speaking and questioning outcomes
// that BC and Ontario units do not. The standards cite the Grade 2 ELA snapshot (see alberta.test.ts).

// ---------- Listening and speaking ----------

const LISTEN_SORT = {
  prompt: "Is it good listening or not-so-good listening? Tap an item, then tap its basket.",
  hint: "Good listeners look at the speaker, keep their bodies calm and wait for their turn to talk.",
  bins: [
    { id: "good", label: "good listening", emoji: "👂" },
    { id: "not", label: "not-so-good", emoji: "🙉" },
  ],
  items: [
    { label: "looking at the speaker", emoji: "👀", bin: "good" },
    { label: "waiting for your turn to talk", emoji: "✋", bin: "good" },
    { label: "nodding to show you understand", emoji: "🙂", bin: "good" },
    { label: "asking a question about what was said", emoji: "❓", bin: "good" },
    { label: "talking while someone else talks", emoji: "🗣️", bin: "not" },
    { label: "looking at your toys", emoji: "🧸", bin: "not" },
    { label: "walking away mid-story", emoji: "🚶", bin: "not" },
    { label: "interrupting with a different story", emoji: "🙊", bin: "not" },
  ],
};

const LISTEN: Item[] = [
  q("A classmate is sharing a story. What does a good listener do?", "looks at them and waits", ["talks over them", "looks out the window"], "Show that you are listening with your eyes and your quiet body."),
  q("Your teacher gives two steps: get a book, then sit down. What do you do first?", "get a book", ["sit down", "put the book away"], "Listen for the order words first, then, next.", { d: 2 }),
  q("You want to share an idea, but Leo is still talking. What can you do?", "wait for him to finish", ["shout louder", "walk away"], "Waiting for your turn shows respect."),
  q("You did not hear what your friend said. What can you say?", "“Can you say that again, please?”", ["“Boring!”", "nothing, and walk off"], "Asking kindly helps you understand."),
  q("When you talk to the class, what helps everyone hear you?", "a clear, steady voice", ["a whisper into your sleeve", "a very fast voice"], "Speak clearly and not too fast."),
  q("You are talking in a small group. How loud should your voice be?", "just loud enough for the group", ["as loud as you can", "so quiet nobody hears"], "Use the right voice for the place.", { d: 2 }),
  q("Which is a kind way to disagree with a friend?", "“I see it a different way.”", ["“You are wrong!”", "“That is silly.”"], "You can disagree and still be kind.", { d: 2 }),
  q("A friend tells you she is sad. What is a kind thing to say?", "“I am sorry. Do you want to talk?”", ["“Whatever.”", "“Stop being sad.”"], "Kind words help friendships grow."),
  q("Your friend is telling about her trip. Which question shows you were listening?", "“What was your favourite part?”", ["“What is for lunch?”", "“Can I have a turn on the swing?”"], "A good question stays on the topic.", { d: 2 }),
  q("When we give a talk, what should we say first?", "what the talk is about", ["goodbye", "nothing at all"], "Start by telling your listeners the topic.", { d: 3 }),
  q("Why do we say “please” and “thank you” when we speak?", "It is polite and makes people feel respected", ["It makes the talk shorter", "It is a secret code"], "Polite words help people get along."),
  q("You say, “Can I borrow your pencil?” Your friend says, “Sure!” What do you say?", "“Thank you!”", ["“Give it.”", "nothing"], "Thanking people builds good relationships."),
  q("Two friends talk at once and nobody hears. What could they do?", "take turns speaking", ["both speak louder", "stop being friends"], "Taking turns lets everyone be heard.", { d: 2 }),
  q("In a group talk, one friend never gets a turn. What can you say?", "“What do you think?”", ["“Hurry up.”", "“We don't need you.”"], "Inviting others in makes a group feel welcome.", { d: 3 }),
  q("Which voice is best for sharing a sad story?", "a soft, slow voice", ["a silly sing-song voice", "a shout"], "Match your voice to your message.", { d: 3 }),
  q("When someone speaks another language at home, a friend can…", "ask them to teach a word", ["laugh at the words", "tell them not to speak it"], "Learning about each other's languages builds friendships.", { d: 2 }),
];

// ---------- Asking and answering questions ----------

const ASK: Item[] = [
  q("Which word asks about a person?", "who", ["where", "when"], "Who asks about people or characters."),
  q("Which word asks about a place?", "where", ["who", "when"], "Where asks about a place."),
  q("Which word asks about a time?", "when", ["where", "who"], "When asks about time."),
  q("Which word asks for a reason?", "why", ["what", "where"], "Why asks for a reason."),
  q("Which question word asks for how something is done?", "how", ["who", "when"], "How asks about the way something is done."),
  q("Which one is a question?", "Where is the library?", ["The library is big.", "Go to the library."], "A question asks for information and ends with a question mark."),
  q("Which end mark goes with a question?", "?", [".", "!"], "A question mark shows that someone is asking."),
  q("“Who found the lost mitten?” Which answer fits?", "Noah found it.", ["It was red.", "Under the bench."], "Who is answered with a person.", { d: 2 }),
  q("“Where did they find the mitten?” Which answer fits?", "Under the bench.", ["Noah found it.", "At noon."], "Where is answered with a place.", { d: 2 }),
  q("“When does the bus come?” Which answer fits?", "At eight o'clock.", ["At the bus stop.", "The driver."], "When is answered with a time.", { d: 2 }),
  q("“Why do we wear boots in the slush?” Which answer fits?", "to keep our feet dry", ["in the porch", "on Tuesday"], "Why is answered with a reason.", { d: 2 }),
  q("You are not sure what a word means. What can you ask?", "“What does that word mean?”", ["“Why are you talking?”", "“Where is lunch?”"], "Asking helps you learn."),
  q("You do not understand the directions. What is a good thing to do?", "ask a question", ["guess and hope", "stop trying"], "Asking questions helps you understand."),
  q("A friend says, “I saw an elk.” Which question asks for more information?", "“Where did you see it?”", ["“I like elk.”", "“Wow!”"], "A good question asks for details.", { d: 2 }),
  q("A speaker says, “Our class grows plants.” What question could you ask?", "“What plants do you grow?”", ["“Is it Tuesday?”", "“Where is my hat?”"], "Ask about the topic.", { d: 3 }),
  q("Which question can be answered with “yes” or “no”?", "Is it raining?", ["What is the weather?", "Why is it raining?"], "Some questions only need a yes or a no.", { d: 3 }),
  q("Which question needs a longer answer?", "How did you make the card?", ["Did you make a card?", "Is the card red?"], "How and why questions need longer answers.", { d: 3 }),
];

const PASSAGES: Passage[] = [
  {
    title: "The Bike Rodeo",
    text: ["On Saturday, the community centre held a bike rodeo.", "Kids rode through cones and learned to signal.", "Ravi won a sticker for riding the slowest."],
    questions: [
      { prompt: "When was the bike rodeo?", right: "on Saturday", wrong: ["in the community centre", "at the cones"], hint: "Look for the word that tells the day." },
      { prompt: "Where was the bike rodeo?", right: "at the community centre", wrong: ["on Saturday", "at the school"], hint: "Look for the place." },
      { prompt: "Who won a sticker?", right: "Ravi", wrong: ["the teacher", "the cones"], hint: "Look for the person's name." },
      { prompt: "What did the kids learn to do?", right: "signal", wrong: ["bake", "swim"], hint: "Look for what the kids learned." },
    ],
  },
  {
    title: "Garden Helpers",
    text: ["Aiyana planted peas in the school garden.", "She watered them every morning.", "After two weeks, little green shoots came up."],
    questions: [
      { prompt: "Who planted peas?", right: "Aiyana", wrong: ["the teacher", "the gardener"], hint: "Look for the name." },
      { prompt: "What did Aiyana plant?", right: "peas", wrong: ["corn", "flowers"], hint: "Look for the plant." },
      { prompt: "How often did she water them?", right: "every morning", wrong: ["once a month", "every night"], hint: "Look for when she watered." },
      { prompt: "When did green shoots come up?", right: "after two weeks", wrong: ["on the first day", "after a year"], hint: "Look for how long it took." },
    ],
  },
  {
    title: "Snow Day",
    text: ["Last night a lot of snow fell in Edmonton.", "School buses ran late, so class began at nine thirty.", "Mei and Sam built a snow fort at recess."],
    questions: [
      { prompt: "Where did a lot of snow fall?", right: "in Edmonton", wrong: ["at recess", "on the bus"], hint: "Look for the place." },
      { prompt: "Why did class begin late?", right: "The buses ran late.", wrong: ["The teacher was away.", "It was a holiday."], hint: "Look for the reason." },
      { prompt: "Who built the snow fort?", right: "Mei and Sam", wrong: ["the bus driver", "the whole school"], hint: "Look for the names." },
      { prompt: "When did they build the fort?", right: "at recess", wrong: ["last night", "at nine thirty"], hint: "Look for the time." },
    ],
  },
];

function askAndAnswer(opts?: GenerateOptions): Question[] {
  const words = unitOf(ASK)(opts).slice(0, 4);
  const passages = passageQuestions(PASSAGES, "story", 4);
  return shuffle([...words, ...passages]);
}

export const units: Unit[] = [
  {
    id: "listen-and-speak-ab",
    title: "Listen and Speak",
    emoji: "👂",
    blurb: "Good listening and kind, clear talking",
    standards: ab("Adjust listening and speaking to communicate clearly and to develop positive relationships.", "listening to others, taking turns, and speaking clearly and kindly"),
    parentNote: "Listening with care, taking turns, asking politely when you did not hear, and using a clear voice that fits the place and the people. These habits help friendships and learning.",
    generate: unitOf(LISTEN, [sorter(LISTEN_SORT)]),
  },
  {
    id: "ask-and-answer-ab",
    title: "Ask and Answer",
    emoji: "❓",
    blurb: "Who, what, where, when, why and how",
    standards: ab("Ask and answer questions to clarify information.", "using question words, and asking and answering questions about what you hear and read"),
    parentNote: "Using who, what, where, when, why and how to ask good questions, and finding answers in short texts. Asking questions is how readers and listeners make sure they understand.",
    generate: askAndAnswer,
  },
];
