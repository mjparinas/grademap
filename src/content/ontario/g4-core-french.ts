import { coreQuestions, type FrItem } from "../french";
import type { Course, GenerateOptions, Question } from "../types";
import { on } from "./kit";
import { CORE_IDEAS } from "./french";

// Ontario Core French, Grade 4 (FSL 2013). BC's Core French starts in Grade 5, so these
// units are written for Ontario. Instructions are in English; the French is what students learn.

const GREET_HINT = "Greetings are the first words of French. Say each one out loud as you read it.";

const GREETINGS: FrItem[] = [
  ["What do you say when you meet someone during the day?", "Bonjour", ["Bonsoir", "Au revoir"], GREET_HINT],
  ["What do you say when you leave?", "Au revoir", ["Bonjour", "Merci"], GREET_HINT],
  ["What does “Comment t'appelles-tu?” mean?", "What is your name?", ["How old are you?", "How are you?"], GREET_HINT],
  ["How do you say your name is Sam?", "Je m'appelle Sam.", ["J'ai Sam ans.", "Ça va Sam."], GREET_HINT],
  ["What does “Merci” mean?", "Thank you", ["Please", "Excuse me"], GREET_HINT],
  ["What does “S'il vous plaît” mean?", "Please", ["Thank you", "Goodbye"], GREET_HINT],
  ["What does “Ça va?” ask?", "How are you?", ["What is your name?", "Where are you?"], GREET_HINT],
  ["How do you answer “Ça va?” when you feel good?", "Ça va bien, merci.", ["Je m'appelle Léa.", "Au revoir."], GREET_HINT],
  ["What does “À demain” mean?", "See you tomorrow", ["Good morning", "Thank you"], GREET_HINT],
  ["What does “Bonne journée” wish someone?", "A good day", ["A good night", "Good luck"], GREET_HINT],
];

const CLASS_HINT = "Look at the picture. Classroom words come with le (masculine) or la (feminine): le livre, la table.";

const CLASSROOM: FrItem[] = [
  ["Which word goes with the picture?", "un livre", ["un crayon", "une chaise"], CLASS_HINT, "📖"],
  ["Which word goes with the picture?", "un crayon", ["un livre", "une table"], CLASS_HINT, "✏️"],
  ["Which word goes with the picture?", "une chaise", ["une table", "un sac"], CLASS_HINT, "🪑"],
  ["Which word goes with the picture?", "un sac", ["une chaise", "un livre"], CLASS_HINT, "🎒"],
  ["Which word goes with the picture?", "une règle", ["un crayon", "un sac"], CLASS_HINT, "📏"],
  ["Which word goes with the picture?", "une horloge", ["une règle", "une porte"], CLASS_HINT, "🕒"],
  ["Which word goes with the picture?", "un ordinateur", ["un cahier", "un livre"], CLASS_HINT, "💻"],
  ["Which word goes with the picture?", "une porte", ["une fenêtre", "une chaise"], CLASS_HINT, "🚪"],
  ["What does “Écoutez” mean in class?", "Listen", ["Sit down", "Read"], "Teachers use short commands like Écoutez, Asseyez-vous, Levez la main."],
  ["What does “Levez la main” mean?", "Raise your hand", ["Close the door", "Open your book"], "Teachers use short commands like Écoutez, Asseyez-vous, Levez la main."],
  ["What does “Asseyez-vous” mean?", "Sit down", ["Listen", "Stand up"], "Teachers use short commands like Écoutez, Asseyez-vous, Levez la main."],
];

const COLOUR_HINT = "Colours are adjectives. Look at the picture and say the colour out loud.";

const COLOURS: FrItem[] = [
  ["What colour is this heart?", "rouge", ["bleu", "vert"], COLOUR_HINT, "❤️"],
  ["What colour is the sky on a clear day?", "bleu", ["rouge", "jaune"], COLOUR_HINT, "💙"],
  ["What colour is grass?", "vert", ["jaune", "noir"], COLOUR_HINT, "💚"],
  ["What colour is the sun?", "jaune", ["vert", "violet"], COLOUR_HINT, "💛"],
  ["What colour is coal?", "noir", ["blanc", "rouge"], COLOUR_HINT, "⚫"],
  ["What colour is snow?", "blanc", ["noir", "vert"], COLOUR_HINT, "⚪"],
  ["What colour is a carrot?", "orange", ["bleu", "noir"], COLOUR_HINT, "🥕"],
  ["What colour is a grape?", "violet", ["jaune", "blanc"], COLOUR_HINT, "🍇"],
  ["What does “Quelle est ta couleur préférée?” ask?", "What is your favourite colour?", ["What colour is it?", "How many colours?"], COLOUR_HINT],
  ["How do you say “My favourite colour is green”?", "Ma couleur préférée est le vert.", ["J'ai vert ans.", "Le vert s'appelle moi."], COLOUR_HINT],
];

const NUMBER_WORDS = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf", "vingt"];

function numbers(o?: GenerateOptions): Question[] {
  const max = o?.difficulty === 1 ? 10 : 20;
  const items: FrItem[] = NUMBER_WORDS.slice(0, max + 1).map((word, n) => [
    `How do you say ${n} in French?`,
    word,
    NUMBER_WORDS.slice(0, max + 1).filter((w) => w !== word),
    "Count in French from zéro: un, deux, trois…",
  ]);
  return coreQuestions(items, o, 8);
}

const TIME_HINT = "Days and months are not capitalized in French: lundi, mardi, janvier, février.";

const CALENDAR: FrItem[] = [
  ["Which day comes after lundi?", "mardi", ["jeudi", "dimanche"], TIME_HINT],
  ["Which day comes after mercredi?", "jeudi", ["lundi", "samedi"], TIME_HINT],
  ["Which two days make the weekend?", "samedi et dimanche", ["lundi et mardi", "jeudi et vendredi"], TIME_HINT],
  ["What does “vendredi” mean?", "Friday", ["Thursday", "Saturday"], TIME_HINT],
  ["What does “aujourd'hui” mean?", "today", ["tomorrow", "yesterday"], TIME_HINT],
  ["What does “demain” mean?", "tomorrow", ["today", "yesterday"], TIME_HINT],
  ["Which month comes after janvier?", "février", ["mars", "décembre"], TIME_HINT],
  ["Which month comes before juillet?", "juin", ["août", "mai"], TIME_HINT],
  ["What does “décembre” mean?", "December", ["November", "September"], TIME_HINT],
  ["Which season is “l'hiver”?", "winter", ["summer", "spring"], "Seasons: le printemps (spring), l'été (summer), l'automne (fall), l'hiver (winter)."],
  ["Which season is “l'été”?", "summer", ["winter", "fall"], "Seasons: le printemps (spring), l'été (summer), l'automne (fall), l'hiver (winter)."],
];

const ANIMAL_HINT = "Look at the picture. Animal words come with un (masculine) or une (feminine).";

const ANIMALS: FrItem[] = [
  ["Which word goes with the picture?", "un chien", ["un chat", "un oiseau"], ANIMAL_HINT, "🐶"],
  ["Which word goes with the picture?", "un chat", ["un chien", "un poisson"], ANIMAL_HINT, "🐱"],
  ["Which word goes with the picture?", "un oiseau", ["un cheval", "un chat"], ANIMAL_HINT, "🐦"],
  ["Which word goes with the picture?", "un poisson", ["un oiseau", "une vache"], ANIMAL_HINT, "🐟"],
  ["Which word goes with the picture?", "un cheval", ["un chien", "un lapin"], ANIMAL_HINT, "🐴"],
  ["Which word goes with the picture?", "un lapin", ["un cheval", "un ours"], ANIMAL_HINT, "🐰"],
  ["Which word goes with the picture?", "une vache", ["un cheval", "un chat"], ANIMAL_HINT, "🐮"],
  ["Which word goes with the picture?", "un ours", ["un lapin", "un chien"], ANIMAL_HINT, "🐻"],
  ["How do you say “I have a cat”?", "J'ai un chat.", ["Je suis un chat.", "Tu as un chat."], "“J'ai” means “I have”. “Je suis” means “I am”."],
  ["What does “Tu as un chien?” ask?", "Do you have a dog?", ["Is it a dog?", "Where is the dog?"], "“Tu as” means “you have”."],
];

function mk(id: string, title: string, emoji: string, blurb: string, parentNote: string, codes: string, text: string, generate: Course["units"][number]["generate"]): Course["units"][number] {
  return { id, title, emoji, blurb, parentNote, standards: on(codes, text), generate };
}

export const course: Course = {
  grade: "4",
  subject: "core-french",
  bigIdeas: { "ca-on": CORE_IDEAS },
  units: [
    mk("salutations-4", "Greetings", "👋", "Say hello and goodbye", "Greetings, introductions and polite words: bonjour, comment t'appelles-tu?, merci, au revoir.", "A1, A2, B2", "listening to and using classroom greetings and polite phrases", (o) => coreQuestions(GREETINGS, o, 8)),
    mk("ma-classe", "My classroom", "🏫", "Things and commands in class", "Classroom objects and the short commands teachers use: écoutez, asseyez-vous, levez la main.", "A1, B1", "understanding and naming familiar classroom objects and instructions", (o) => coreQuestions(CLASSROOM, o, 8)),
    mk("couleurs-4", "Colours", "🎨", "Name the colours", "The colours in French and saying a favourite colour.", "B1", "naming familiar things and giving a simple preference", (o) => coreQuestions(COLOURS, o, 8)),
    mk("nombres-4", "Numbers 0 to 20", "🔢", "Count in French", "Numbers from zéro to vingt.", "A1, B1", "recognizing and saying numbers", numbers),
    mk("calendrier-4", "Days, months and seasons", "📅", "Lundi, mardi, janvier…", "Days of the week, months and seasons in French; days and months are not capitalized.", "A1, C1", "recognizing familiar words about time and the calendar", (o) => coreQuestions(CALENDAR, o, 8)),
    mk("animaux-4", "Animals", "🐶", "Pets and farm animals", "Common animals with un and une, and saying what pet you have.", "B1, B2", "naming familiar animals and saying what you have", (o) => coreQuestions(ANIMALS, o, 8)),
  ],
};
