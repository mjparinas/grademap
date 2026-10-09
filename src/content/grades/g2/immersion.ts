import { frOrder, frQuestions, type FrItem } from "../../french";
import { sample } from "../../random";
import type { Course, GenerateOptions, Question } from "../../types";

const FR = { lang: "fr" } as const;

// ---------- Le, la, un, une ----------

const MASCULINE = ["garçon", "livre", "crayon", "chat", "soleil", "ballon", "lit", "camion", "stylo", "nuage", "jardin", "pain"];
const FEMININE = ["fille", "table", "porte", "maison", "lune", "fleur", "chaise", "souris", "fenêtre", "pomme", "tortue", "girafe"];

const ARTICLE_HINT = "Every French noun is masculine (le, un) or feminine (la, une). Learn each new word together with its article, like “le chat” or “la table”.";

function articleItems(): FrItem[] {
  const items: FrItem[] = [];
  for (const w of MASCULINE) {
    items.push([`Complète : ___ ${w}`, "le", ["la", "les", "une"], ARTICLE_HINT]);
    items.push([`Complète : ___ ${w}`, "un", ["une", "les", "la"], ARTICLE_HINT]);
  }
  for (const w of FEMININE) {
    items.push([`Complète : ___ ${w}`, "la", ["le", "les", "un"], ARTICLE_HINT]);
    items.push([`Complète : ___ ${w}`, "une", ["un", "les", "le"], ARTICLE_HINT]);
  }
  return items;
}

// ---------- L'accord des adjectifs ----------

const ADJ_HINT = "An adjective agrees with its noun: a feminine noun usually takes an adjective with an “e” at the end (petit → petite). For plurals, add an “s”.";

const ADJECTIVES: FrItem[] = [
  ["Complète : Un chat ___.", "noir", ["noire", "noirs", "noires"], ADJ_HINT],
  ["Complète : Une maison ___.", "blanche", ["blanc", "blancs", "blanches"], ADJ_HINT],
  ["Complète : Une souris ___.", "petite", ["petit", "petits", "petites"], ADJ_HINT],
  ["Complète : Un garçon ___.", "content", ["contente", "contents", "contentes"], ADJ_HINT],
  ["Complète : Une fille ___.", "contente", ["content", "contents", "contentes"], ADJ_HINT],
  ["Complète : Le ballon est ___.", "grand", ["grande", "grands", "grandes"], ADJ_HINT],
  ["Complète : La girafe est ___.", "grande", ["grand", "grands", "grandes"], ADJ_HINT],
  ["Complète : La fleur est ___.", "jolie", ["joli", "jolis", "jolies"], ADJ_HINT],
  ["Complète : Le jardin est ___.", "vert", ["verte", "verts", "vertes"], ADJ_HINT],
  ["Complète : La porte est ___.", "verte", ["vert", "verts", "vertes"], ADJ_HINT],
  ["Complète : Les chats sont ___.", "noirs", ["noir", "noire", "noires"], ADJ_HINT],
  ["Complète : Les fleurs sont ___.", "jolies", ["joli", "jolie", "jolis"], ADJ_HINT],
  ["Complète : Le ciel est ___.", "gris", ["grise", "grises"], ADJ_HINT],
];

// ---------- L'ordre des mots ----------

const SENTENCE_CHOICES: FrItem[] = [
  ["Quelle phrase est dans le bon ordre?", "Le chat noir dort.", ["Dort noir le chat.", "Chat le dort noir.", "Noir dort le chat."], "A simple French sentence starts with who or what, then says what they do.", "🐈‍⬛"],
  ["Quelle phrase est dans le bon ordre?", "Léa mange une pomme.", ["Mange Léa pomme une.", "Une pomme Léa mange.", "Pomme une mange Léa."], "Start with who (Léa), then what she does (mange), then what (une pomme).", "🍎"],
  ["Quelle phrase est dans le bon ordre?", "Nous aimons les fraises.", ["Aimons les nous fraises.", "Les fraises nous aimons.", "Fraises aimons les nous."], "Start with who (nous), then the verb (aimons).", "🍓"],
  ["Quelle phrase est dans le bon ordre?", "Mon ami joue au ballon.", ["Ami mon ballon joue au.", "Joue mon ami au ballon.", "Au ballon mon joue ami."], "Start with who, then the action, then the rest.", "⚽"],
  ["Quelle phrase est dans le bon ordre?", "Les enfants chantent.", ["Chantent les enfants.", "Enfants les chantent.", "Les chantent enfants."], "Say who first (les enfants), then what they do.", "🎤"],
  ["Quelle phrase est dans le bon ordre?", "Maya lit un livre.", ["Lit Maya un livre.", "Un Maya livre lit.", "Livre un lit Maya."], "Who? Maya. Does what? Lit. What? Un livre.", "📖"],
];

const WORD_ORDERS: { items: string[] }[] = [
  { items: ["Mon", "ami", "joue", "au", "ballon"] },
  { items: ["Nous", "aimons", "les", "fraises"] },
  { items: ["Maya", "lit", "un", "livre"] },
  { items: ["Les", "enfants", "chantent", "une", "chanson"] },
  { items: ["Léa", "mange", "une", "pomme"] },
];

function ordreDesMots(opts?: GenerateOptions): Question[] {
  return [
    ...frQuestions(SENTENCE_CHOICES, opts, 5, FR),
    ...sample(WORD_ORDERS, 3).map((o) => frOrder("Remets les mots dans l'ordre.", "Start with who is doing something, then say what they do.", o.items, FR)),
  ];
}

// ---------- Les contes ----------

const TALE_HINT = "Fairy tales and folk tales are old stories told in many cultures, with a beginning, a problem and an ending.";

const CONTES: FrItem[] = [
  ["Quelle phrase commence souvent un conte?", "Il était une fois…", ["Voici les ingrédients…", "Aujourd'hui, la météo annonce…", "Mode d'emploi :"], TALE_HINT, "📜"],
  ["Dans un conte, que se passe-t-il souvent à la fin?", "Le problème est réglé", ["On donne le prix d'un objet", "On explique la météo", "On lit une liste de courses"], TALE_HINT],
  ["Dans « Les trois petits cochons », la troisième maison est faite de…", "briques", ["paille", "bois", "neige"], "The first pig builds with straw, the second with wood and the third with bricks.", "🐷"],
  ["Dans « Boucle d'or et les trois ours », qui goûte au gruau des ours?", "Boucle d'or", ["Le loup", "Cendrillon", "Le Petit Chaperon rouge"], TALE_HINT, "🐻"],
  ["Dans « Le Petit Chaperon rouge », qui va chez sa grand-mère?", "Une petite fille", ["Un roi", "Trois cochons", "Un robot"], TALE_HINT, "🧣"],
  ["Dans « Cendrillon », que perd Cendrillon au bal?", "Une pantoufle", ["Un chapeau", "Un livre", "Un ballon"], TALE_HINT, "👠"],
  ["Qu'est-ce qu'un conte?", "Une histoire inventée", ["Un texte qui donne des faits", "Une recette", "Un horaire d'autobus"], TALE_HINT, "📚"],
  ["Quel texte est un conte?", "Il était une fois un petit dragon qui voulait voler.", ["Les dragons de mer vivent dans l'eau chaude.", "Pour faire un gâteau, il faut des œufs.", "Le bus arrive à huit heures."], TALE_HINT],
  ["Beaucoup de cultures racontent des contes. Pourquoi?", "Pour partager des idées et des leçons", ["Pour vendre des objets", "Pour donner la météo", "Pour compter jusqu'à dix"], "People of many cultures, including First Peoples and Francophone communities, share stories to pass on ideas, humour and lessons.", "🌍"],
  ["Dans un conte, un animal peut souvent…", "parler", ["payer un billet", "conduire un camion", "écrire un courriel"], TALE_HINT, "🦊"],
];

// ---------- D'abord, ensuite, enfin ----------

const MARKERS: FrItem[] = [
  ["Complète : ___, je me lève. Ensuite, je mange. Enfin, je pars.", "D'abord", ["Enfin", "Ensuite", "Hier"], "“D'abord” tells us what comes first.", "⏰"],
  ["Complète : D'abord, je mets mes bottes. ___, je sors.", "Ensuite", ["D'abord", "Hier", "Ici"], "“Ensuite” tells us what comes next.", "🥾"],
  ["Complète : D'abord, je lave mes mains. Ensuite, je mange. ___, je range.", "Enfin", ["D'abord", "Hier", "Ici"], "“Enfin” tells us what comes last.", "🍽️"],
  ["Complète : Le chat est loin. Le chien est ___.", "près", ["tard", "demain", "froid"], "“Près” means close by. It is the opposite of “loin”.", "🐶"],
  ["Complète : Le ballon est ___ de la table. Il est sous la table.", "en dessous", ["au-dessus", "à côté", "loin"], "“Sous” and “en dessous” mean below.", "⚽"],
  ["Complète : Je mets mon livre ___ la table, tout en haut.", "sur", ["sous", "dans", "loin"], "“Sur” means on top of.", "📖"],
  ["Complète : Le chat dort ___ la boîte, à l'intérieur.", "dans", ["sur", "loin", "demain"], "“Dans” means inside.", "📦"],
  ["Complète : Hier, il pleuvait. Aujourd'hui, il y a du soleil. ___, il va neiger.", "Demain", ["Hier", "Enfin", "Ici"], "“Demain” means tomorrow.", "📅"],
];

const SEQUENCES = [
  { prompt: "Remets les phrases dans l'ordre.", items: ["D'abord, je me lève.", "Ensuite, je déjeune.", "Enfin, je pars à l'école."] },
  { prompt: "Remets les phrases dans l'ordre.", items: ["D'abord, je mets mes bottes.", "Ensuite, je mets mon manteau.", "Enfin, je sors jouer."] },
  { prompt: "Remets les phrases dans l'ordre.", items: ["D'abord, je prends une feuille.", "Ensuite, je dessine un arbre.", "Enfin, je colorie mon dessin."] },
  { prompt: "Remets les phrases dans l'ordre.", items: ["D'abord, on plante une graine.", "Ensuite, on l'arrose.", "Enfin, une fleur pousse."] },
];

function marqueurs(opts?: GenerateOptions): Question[] {
  return [
    ...frQuestions(MARKERS, opts, 6, FR),
    ...sample(SEQUENCES, 2).map((s) => frOrder(s.prompt, "Look for the clue words: d'abord (first), ensuite (next), enfin (last).", s.items, FR)),
  ];
}

// ---------- Être et avoir ----------

const VERB_HINT = "“Être” (to be) and “avoir” (to have) change with the person: je suis, tu es, il est… / j'ai, tu as, il a…";

const BE_HAVE: FrItem[] = [
  ["Complète : Je ___ content.", "suis", ["es", "est", "sont"], VERB_HINT],
  ["Complète : Tu ___ un chien.", "as", ["a", "ai", "ont"], VERB_HINT],
  ["Complète : Il ___ petit.", "est", ["es", "suis", "sommes"], VERB_HINT],
  ["Complète : Nous ___ amis.", "sommes", ["êtes", "sont", "suis"], VERB_HINT],
  ["Complète : Elles ___ deux chats.", "ont", ["a", "avons", "avez"], VERB_HINT],
  ["Complète : Vous ___ prêts.", "êtes", ["sommes", "sont", "es"], VERB_HINT],
  ["Complète : J'___ sept ans.", "ai", ["as", "a", "ont"], VERB_HINT],
  ["Complète : Nous ___ une idée.", "avons", ["avez", "ont", "ai"], VERB_HINT],
  ["Complète : Maya ___ à la maison.", "est", ["es", "sont", "suis"], VERB_HINT],
  ["Complète : Les enfants ___ à l'école.", "sont", ["est", "sommes", "êtes"], VERB_HINT],
  ["Complète : Léo ___ un livre.", "a", ["as", "ai", "ont"], VERB_HINT],
  ["Complète : Tu ___ gentil.", "es", ["est", "suis", "êtes"], VERB_HINT],
];

export const course: Course = {
  grade: "2",
  subject: "immersion",
  bigIdeas: {
    "ca-bc": [
      "Fluency in a language facilitates our interactions with others.",
      "Awareness of other cultures helps us discover our own culture and build our own identity.",
      "The task and its context determine the strategies of comprehension and expression that are chosen.",
      "Fairy and folk tales share common characteristics that define the genre.",
      "Organizing and connecting our ideas in a logical fashion helps others better understand our message.",
    ],
  },
  units: [
    {
      id: "le-la-un-une",
      title: "Le, la, un, une",
      emoji: "🔤",
      blurb: "Les articles",
      parentNote: "Choosing the right article (le, la, un, une) for a noun. In French every noun is masculine or feminine, so nouns are best learned with their article.",
      standards: { "ca-bc": "Language elements: the gender of nouns and articles" },
      generate: (o) => frQuestions(articleItems(), o, 8, FR),
    },
    {
      id: "accord-des-adjectifs",
      title: "Les adjectifs",
      emoji: "🎨",
      blurb: "Petit ou petite?",
      parentNote: "Making an adjective agree in gender and number with the noun it describes.",
      standards: { "ca-bc": "Language elements: adjectives; spelling conventions" },
      generate: (o) => frQuestions(ADJECTIVES, o, 8, FR),
    },
    {
      id: "ordre-des-mots",
      title: "L'ordre des mots",
      emoji: "🧩",
      blurb: "Bâtir une phrase",
      parentNote: "Building simple French sentences: who or what, then the action, then the rest.",
      standards: { "ca-bc": "Language elements: structure of simple sentences; write short texts that follow the rules of sentence structure" },
      generate: ordreDesMots,
    },
    {
      id: "les-contes",
      title: "Les contes",
      emoji: "🏰",
      blurb: "Il était une fois…",
      parentNote: "Features of fairy tales and folk tales, including well-known French tales, and why cultures share stories.",
      standards: { "ca-bc": "Literary elements: characteristics of fairy tales and folk tales; cultural elements" },
      generate: (o) => frQuestions(CONTES, o, 8, FR),
    },
    {
      id: "dabord-ensuite-enfin",
      title: "D'abord, ensuite, enfin",
      emoji: "🪜",
      blurb: "Temps et lieux",
      parentNote: "Words that show time (d'abord, ensuite, enfin) and place (sur, sous, dans, près, loin), and putting events in order.",
      standards: { "ca-bc": "Text organization: structure of narrative texts; markers of time and place" },
      generate: marqueurs,
    },
    {
      id: "etre-et-avoir",
      title: "Être et avoir",
      emoji: "🧸",
      blurb: "Je suis, j'ai",
      parentNote: "The present tense of the two most important verbs in French, être (to be) and avoir (to have).",
      standards: { "ca-bc": "Language elements: verb moods and tenses (present indicative)" },
      generate: (o) => frQuestions(BE_HAVE, o, 8, FR),
    },
  ],
};
