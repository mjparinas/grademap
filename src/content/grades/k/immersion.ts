import { familyQuestions, frQuestions, soundItems, vocabQuestions, type FrItem, type Pair } from "../../french";
import { sample, shuffle, textChoice } from "../../random";
import type { Course, Question } from "../../types";

const FR = { lang: "fr" } as const;

// ---------- Bonjour et merci ----------

const POLITE: FrItem[] = [
  ["Tu arrives à l'école. Que dis-tu?", "Bonjour", ["Au revoir", "Bonne nuit"], "When we arrive and say hello, we say “bonjour”.", "🏫"],
  ["Tu pars de l'école. Que dis-tu?", "Au revoir", ["Bonjour", "Merci"], "When we leave, we say goodbye: “au revoir”.", "🎒"],
  ["Ton ami te donne un jouet. Que dis-tu?", "Merci", ["Au revoir", "Bonjour"], "When someone gives us something, we say thank you: “merci”.", "🧸"],
  ["Tu veux un verre d'eau. Que dis-tu?", "S'il vous plaît", ["Au revoir", "Bonjour"], "To ask politely we say “s'il vous plaît”.", "🥛"],
  ["Comment salues-tu cette dame?", "Bonjour, Madame", ["Bonjour, Monsieur", "Au revoir, Monsieur"], "“Madame” is for a woman. “Monsieur” is for a man.", "👩"],
  ["Comment salues-tu ce monsieur?", "Bonjour, Monsieur", ["Bonjour, Madame", "Merci, Madame"], "“Monsieur” is for a man. “Madame” is for a woman.", "👨"],
  ["Le matin, tu dis…", "Bonjour", ["Bonne nuit", "Au revoir"], "In the morning, we say “bonjour”.", "🌅"],
  ["Avant de dormir, tu dis…", "Bonne nuit", ["Bonjour", "Merci"], "At bedtime we say “bonne nuit”: good night.", "🌙"],
  ["Quelqu'un t'aide. Que dis-tu?", "Merci", ["Bonne nuit", "Bonjour"], "When someone helps us, we say “merci”.", "🤝"],
  ["Ton ami parle. Que fais-tu?", "J'écoute", ["Je crie", "Je cours"], "A good listener keeps quiet, looks at the speaker and listens.", "👂"],
  ["C'est le tour de ton amie. Que fais-tu?", "J'attends mon tour", ["Je parle en même temps", "Je pars"], "We take turns when we talk, so everyone can be heard.", "🗣️"],
  ["Tu vois ton enseignante le matin. Tu dis…", "Bonjour, Madame", ["Au revoir, Madame", "Bonne nuit, Madame"], "We greet people politely when we see them.", "🍎"],
];

// ---------- Mes premiers mots ----------

const WORDS: Pair[] = [
  ["🐱", "chat"], ["🐶", "chien"], ["🐦", "oiseau"], ["🐟", "poisson"], ["🐰", "lapin"], ["🐄", "vache"], ["🐴", "cheval"], ["🦆", "canard"],
  ["🍎", "pomme"], ["🍌", "banane"], ["🍓", "fraise"], ["🍊", "orange"], ["📖", "livre"], ["✏️", "crayon"], ["🪑", "chaise"], ["🏠", "maison"],
  ["☀️", "soleil"], ["🌙", "lune"], ["🚗", "voiture"], ["🌳", "arbre"],
];

const COLOURS: Pair[] = [
  ["🔴", "rouge"], ["🔵", "bleu"], ["🟢", "vert"], ["🟡", "jaune"], ["🟠", "orange"], ["🟣", "violet"], ["⚫", "noir"], ["⚪", "blanc"],
];

const NUMBERS = ["un", "deux", "trois", "quatre", "cinq"];

function mesMots(opts?: { difficulty?: 1 | 2 | 3 }): Question[] {
  const picture = vocabQuestions(WORDS, "Quel mot va avec l'image?", opts, 4, FR);
  const colour = vocabQuestions(COLOURS, "De quelle couleur est-ce?", opts, 2, FR);
  const counting: Question[] = sample([1, 2, 3, 4, 5], 2).map((n) => {
    const q = textChoice(
      "Combien y en a-t-il?",
      NUMBERS[n - 1],
      shuffle(NUMBERS.filter((_, i) => i !== n - 1)).slice(0, opts?.difficulty === 1 ? 1 : 2),
      "Touch each one and count out loud: un, deux, trois…",
      { type: "dots", count: n, emoji: "🍎" },
    );
    q.lang = "fr";
    return q;
  });
  return [...picture, ...colour, ...counting];
}

// ---------- Lettres ----------

const LETTERS = ["b", "d", "f", "g", "h", "l", "m", "n", "r", "s", "t", "v"];

function lettres(opts?: { difficulty?: 1 | 2 | 3 }): Question[] {
  const wrongCount = opts?.difficulty === 1 ? 1 : opts?.difficulty === 3 ? 3 : 2;
  const upper = (l: string) => l.toUpperCase();
  const qs: Question[] = [];
  for (const l of sample(LETTERS, 4)) {
    const q = textChoice(
      "Quelle est cette lettre?",
      upper(l),
      sample(LETTERS.filter((x) => x !== l).map(upper), wrongCount),
      "Look at the shape of the letter. Trace it in the air with your finger.",
      { type: "letter", text: upper(l) },
    );
    q.lang = "fr";
    qs.push(q);
  }
  for (const l of sample(LETTERS, 4)) {
    const q = textChoice(
      `Quelle est la majuscule de « ${l} »?`,
      upper(l),
      sample(LETTERS.filter((x) => x !== l).map(upper), wrongCount),
      "A capital letter (majuscule) is the big version of the letter.",
      { type: "letter", text: l },
    );
    q.lang = "fr";
    qs.push(q);
  }
  return qs;
}

// ---------- Sons du début ----------

const SOUND_GROUPS: Pair[][] = [
  [["🌙", "lune"], ["🐰", "lapin"], ["📖", "livre"]],
  [["🏠", "maison"], ["✋", "main"], ["🐑", "mouton"]],
  [["🍎", "pomme"], ["🐟", "poisson"], ["🍕", "pizza"]],
  [["🎈", "ballon"], ["⛵", "bateau"], ["🍌", "banane"]],
  [["🐄", "vache"], ["🚗", "voiture"], ["🎻", "violon"]],
  [["🌸", "fleur"], ["🍓", "fraise"], ["🔥", "feu"]],
  [["🍅", "tomate"], ["🐢", "tortue"], ["🚂", "train"]],
  [["👗", "robe"], ["🐀", "rat"], ["🤖", "robot"]],
  [["🐱", "chat"], ["🪑", "chaise"], ["🎩", "chapeau"]],
  [["🚚", "camion"], ["🦆", "canard"], ["🥕", "carotte"]],
];

const SOUND_ITEMS = soundItems(SOUND_GROUPS);

// ---------- Syllabes ----------

const SYLLABLES: [string, string, number][] = [
  ["🐱", "chat", 1], ["🌸", "fleur", 1], ["🍞", "pain", 1],
  ["🐰", "lapin", 2], ["🏠", "maison", 2], ["🎈", "ballon", 2], ["☀️", "soleil", 2], ["⛵", "bateau", 2], ["🦆", "canard", 2], ["🐴", "cheval", 2],
  ["🦋", "papillon", 3], ["🐘", "éléphant", 3], ["🍫", "chocolat", 3], ["🍍", "ananas", 3], ["🦘", "kangourou", 3], ["☂️", "parapluie", 3],
  ["💻", "ordinateur", 4], ["🚁", "hélicoptère", 4], ["📺", "télévision", 4],
];

function syllabes(opts?: { difficulty?: 1 | 2 | 3 }): Question[] {
  const wrongCount = opts?.difficulty === 1 ? 1 : 2;
  return sample(SYLLABLES, 8).map(([emoji, word, n]) => {
    const q = textChoice(
      `Combien de syllabes dans « ${word} »?`,
      String(n),
      shuffle([1, 2, 3, 4].filter((x) => x !== n).map(String)).slice(0, wrongCount),
      "Clap each part of the word, like ba-llon. Then count your claps!",
      { type: "emoji", emoji, caption: word },
    );
    q.lang = "fr";
    return q;
  });
}

// ---------- Rimes ----------

const RHYME_FAMILIES: string[][] = [
  ["chat", "rat"],
  ["lune", "prune"],
  ["bateau", "gâteau", "radeau"],
  ["pain", "main", "lapin", "dauphin"],
  ["fée", "thé"],
  ["cloche", "poche"],
  ["abeille", "oreille"],
  ["fraise", "chaise"],
  ["maison", "saison"],
  ["fourmi", "ami"],
];

function rimes(opts?: { difficulty?: 1 | 2 | 3 }): Question[] {
  return familyQuestions(
    RHYME_FAMILIES,
    (a) => ({
      prompt: `Quel mot rime avec « ${a} »?`,
      hint: `Rhyming words end with the same sound. Say “${a}” and each choice out loud.`,
      visual: { type: "letter", text: a },
    }),
    opts,
    8,
    FR,
  );
}

// ---------- Histoires ----------

interface Tale {
  lines: string[];
  who: string;
  whoWrong: string[];
  where: string;
  whereWrong: string[];
  what: string;
  whatWrong: string[];
}

const TALES: Tale[] = [
  { lines: ["Léa mange une pomme.", "Elle est dans le jardin."], who: "Léa", whoWrong: ["la pomme", "le jardin"], where: "Dans le jardin", whereWrong: ["À l'école", "Dans la cuisine"], what: "Elle mange une pomme", whatWrong: ["Elle lit un livre", "Elle nage"] },
  { lines: ["Amir joue au ballon.", "Il est au parc."], who: "Amir", whoWrong: ["le ballon", "le parc"], where: "Au parc", whereWrong: ["À la maison", "Dans le lac"], what: "Il joue au ballon", whatWrong: ["Il dort", "Il mange"] },
  { lines: ["Maya dessine un chat.", "Elle est à l'école."], who: "Maya", whoWrong: ["le dessin", "l'école"], where: "À l'école", whereWrong: ["Au parc", "Dans la forêt"], what: "Elle dessine un chat", whatWrong: ["Elle saute", "Elle chante"] },
  { lines: ["Noé nage.", "Il est dans le lac."], who: "Noé", whoWrong: ["le lac", "l'eau"], where: "Dans le lac", whereWrong: ["Dans la neige", "À la maison"], what: "Il nage", whatWrong: ["Il lit", "Il dort"] },
  { lines: ["Zoé lit un livre.", "Elle est dans sa chambre."], who: "Zoé", whoWrong: ["le livre", "la chambre"], where: "Dans sa chambre", whereWrong: ["Au parc", "Dans le jardin"], what: "Elle lit un livre", whatWrong: ["Elle nage", "Elle court"] },
  { lines: ["Kenji saute dans la neige.", "Il est dehors."], who: "Kenji", whoWrong: ["la neige", "le froid"], where: "Dehors", whereWrong: ["Dans la cuisine", "À l'école"], what: "Il saute dans la neige", whatWrong: ["Il dort", "Il mange un gâteau"] },
  { lines: ["Ana mange un gâteau.", "Elle est dans la cuisine."], who: "Ana", whoWrong: ["le gâteau", "la cuisine"], where: "Dans la cuisine", whereWrong: ["Au parc", "Dans le lac"], what: "Elle mange un gâteau", whatWrong: ["Elle dessine", "Elle nage"] },
];

const BOOK: FrItem[] = [
  ["Comment s'appelle le nom d'un livre?", "Le titre", ["Le dessin", "La page"], "The title is the name of the book. You find it on the cover.", "📕"],
  ["Quelle partie du livre protège les pages?", "La couverture", ["Le titre", "L'image"], "The cover is the front of the book. It keeps the pages safe.", "📚"],
];

function histoires(opts?: { difficulty?: 1 | 2 | 3 }): Question[] {
  const items: FrItem[] = TALES.flatMap((t): FrItem[] => [
    ["Qui est le personnage?", t.who, t.whoWrong, "The character is the person (or animal) the story is about.", { type: "story", lines: t.lines }],
    ["Où se passe l'histoire?", t.where, t.whereWrong, "The setting is the place where the story happens.", { type: "story", lines: t.lines }],
    ["Que se passe-t-il?", t.what, t.whatWrong, "The event is what happens in the story.", { type: "story", lines: t.lines }],
  ]);
  return frQuestions([...items, ...BOOK], opts, 8, FR);
}

export const course: Course = {
  grade: "k",
  subject: "immersion",
  bigIdeas: {
    "ca-bc": [
      "A new language is acquired by listening to and reproducing the models introduced by the teacher.",
      "Observing codes of politeness, knowing how to listen and letting others speak are practices that facilitate communication and promote respect.",
      "Images convey meaning and facilitate the understanding of a text.",
      "Each letter has its own graphic representation and its own sound.",
    ],
  },
  units: [
    {
      id: "bonjour-et-merci",
      title: "Bonjour et merci",
      emoji: "👋",
      blurb: "Politesse et salutations",
      parentNote: "Greetings and courtesy words in French (bonjour, au revoir, merci, s'il vous plaît, Madame, Monsieur) and good listening habits.",
      standards: { "ca-bc": "Communication strategies: active listening, taking turns, expressions of courtesy and greetings" },
      generate: (o) => frQuestions(POLITE, o, 8, FR),
    },
    {
      id: "mes-premiers-mots",
      title: "Mes premiers mots",
      emoji: "🐱",
      blurb: "Animaux, couleurs, nombres",
      parentNote: "First French vocabulary matched to pictures: animals, fruit, colours and counting to five.",
      standards: { "ca-bc": "Use learned vocabulary to name characters and objects in pictures" },
      generate: mesMots,
    },
    {
      id: "lettres",
      title: "Les lettres",
      emoji: "🔤",
      blurb: "Majuscules et lettres",
      parentNote: "Recognizing letters of the alphabet and matching small letters to capital letters.",
      standards: { "ca-bc": "Spelling conventions: letters of the alphabet and capital letters" },
      generate: lettres,
    },
    {
      id: "sons-du-debut",
      title: "Le son du début",
      emoji: "👂",
      blurb: "Quel mot commence pareil?",
      parentNote: "Phonemic awareness: hearing the first sound of a word and matching it to other words that begin the same way.",
      standards: { "ca-bc": "Phonemic awareness: letter sounds" },
      generate: (o) => frQuestions(SOUND_ITEMS, o, 8, FR),
    },
    {
      id: "syllabes",
      title: "Les syllabes",
      emoji: "👏",
      blurb: "Frappe les parties du mot",
      parentNote: "Phonemic awareness: clapping and counting the syllables in a word.",
      standards: { "ca-bc": "Phonemic awareness: syllables" },
      generate: syllabes,
    },
    {
      id: "rimes",
      title: "Les rimes",
      emoji: "🎵",
      blurb: "Des mots qui riment",
      parentNote: "Phonemic awareness: recognizing words that end with the same sound.",
      standards: { "ca-bc": "Phonemic awareness: rhymes" },
      generate: rimes,
    },
    {
      id: "histoires",
      title: "Les histoires",
      emoji: "📖",
      blurb: "Personnages, lieux, événements",
      parentNote: "Elements of a story (characters, setting, events) and parts of a book such as the cover and title.",
      standards: { "ca-bc": "Elements of a story: characters, settings, events; text organization: cover, title" },
      generate: histoires,
    },
  ],
};
