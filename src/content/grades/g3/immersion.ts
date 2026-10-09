import { frQuestions, type FrItem } from "../../french";
import type { Course } from "../../types";

const FR = { lang: "fr" } as const;

// ---------- Les verbes pronominaux ----------

const REFLEXIVE_HINT = "With verbs like “se laver”, the little word before the verb matches the person: je me, tu te, il/elle se, nous nous, vous vous, ils/elles se.";

const REFLEXIVE: FrItem[] = [
  ["Complète : Je ___ lave les mains.", "me", ["te", "se", "nous"], REFLEXIVE_HINT],
  ["Complète : Tu ___ brosses les dents.", "te", ["me", "se", "vous"], REFLEXIVE_HINT],
  ["Complète : Léa ___ réveille tôt.", "se", ["me", "te", "nous"], REFLEXIVE_HINT],
  ["Complète : Nous ___ habillons vite.", "nous", ["me", "te", "se"], REFLEXIVE_HINT],
  ["Complète : Vous ___ couchez tard.", "vous", ["me", "te", "se"], REFLEXIVE_HINT],
  ["Complète : Les enfants ___ lavent les mains.", "se", ["me", "te", "nous"], REFLEXIVE_HINT],
  ["Complète : Je ___ repose après l'école.", "me", ["te", "se", "vous"], REFLEXIVE_HINT],
  ["Complète : Tu ___ lèves à sept heures.", "te", ["me", "se", "nous"], REFLEXIVE_HINT],
  ["Complète : Amir ___ peigne les cheveux.", "se", ["me", "te", "vous"], REFLEXIVE_HINT],
  ["Complète : Nous ___ promenons au parc.", "nous", ["me", "te", "se"], REFLEXIVE_HINT],
];

// ---------- Et, mais, ou, avec ----------

const LINK_HINT = "“Et” adds, “mais” shows a surprise or a problem, “ou” gives a choice and “avec” means together with.";

const LINKS: FrItem[] = [
  ["Complète : Nous mangeons des pommes ___ des poires. Les deux!", "et", ["mais", "ou", "avec"], LINK_HINT],
  ["Complète : Je voudrais sortir, ___ il pleut.", "mais", ["et", "ou", "avec"], LINK_HINT],
  ["Complète : Tu choisis le rouge ___ le bleu. Un seul!", "ou", ["et", "mais", "avec"], LINK_HINT],
  ["Complète : Je joue ___ mon frère.", "avec", ["mais", "ou", "et"], LINK_HINT],
  ["Complète : Léa lit un livre ___ Maya dessine.", "et", ["avec", "ou", "mais"], LINK_HINT],
  ["Complète : Il est petit, ___ il est très fort.", "mais", ["et", "ou", "avec"], LINK_HINT],
  ["Complète : Veux-tu du lait ___ du jus?", "ou", ["et", "mais", "avec"], LINK_HINT],
  ["Complète : J'ai faim, ___ je n'ai plus de pain.", "mais", ["et", "ou", "avec"], LINK_HINT],
  ["Complète : Amir va au parc ___ sa sœur.", "avec", ["mais", "ou", "et"], LINK_HINT],
  ["Complète : Le chat dort ___ le chien mange.", "et", ["avec", "ou", "mais"], LINK_HINT],
];

// ---------- Ne… pas ----------

const NEG_HINT = "To say no in French, put “ne” before the verb and “pas” after it: je ne mange pas. Before a vowel, “ne” becomes “n'”: elle n'aime pas.";

const NEGATIVES: FrItem[] = [
  ["Quelle phrase dit le contraire de « Je mange »?", "Je ne mange pas.", ["Je mange pas.", "Ne je mange pas.", "Je pas mange."], NEG_HINT],
  ["Quelle phrase dit le contraire de « Il joue »?", "Il ne joue pas.", ["Il joue ne pas.", "Ne il joue pas.", "Il pas joue."], NEG_HINT],
  ["Quelle phrase dit le contraire de « Tu chantes »?", "Tu ne chantes pas.", ["Tu chantes ne pas.", "Ne tu chantes pas.", "Tu pas chantes."], NEG_HINT],
  ["Quelle phrase dit le contraire de « Elle aime »?", "Elle n'aime pas.", ["Elle ne aime pas.", "Elle aime ne pas.", "Elle pas aime."], NEG_HINT],
  ["Quelle phrase dit le contraire de « Nous dansons »?", "Nous ne dansons pas.", ["Nous dansons ne pas.", "Ne nous dansons pas.", "Nous pas dansons."], NEG_HINT],
  ["Quelle phrase dit le contraire de « J'habite ici »?", "Je n'habite pas ici.", ["Je ne habite pas ici.", "J'habite ne pas ici.", "Je pas habite ici."], NEG_HINT],
  ["Quelle phrase dit le contraire de « Ils courent »?", "Ils ne courent pas.", ["Ils courent ne pas.", "Ne ils courent pas.", "Ils pas courent."], NEG_HINT],
  ["Quelle phrase dit le contraire de « Léa dort »?", "Léa ne dort pas.", ["Léa dort ne pas.", "Ne Léa dort pas.", "Léa pas dort."], NEG_HINT],
  ["Quelle phrase dit le contraire de « Vous parlez »?", "Vous ne parlez pas.", ["Vous parlez ne pas.", "Ne vous parlez pas.", "Vous pas parlez."], NEG_HINT],
  ["Quelle phrase dit le contraire de « Il écoute »?", "Il n'écoute pas.", ["Il ne écoute pas.", "Il écoute ne pas.", "Il pas écoute."], NEG_HINT],
];

// ---------- Le futur proche ----------

const FUTURE_HINT = "The near future is “aller” + a verb: je vais manger, tu vas manger, il va manger, nous allons manger, vous allez manger, ils vont manger.";

const FUTURE: FrItem[] = [
  ["Complète : Demain, je ___ jouer.", "vais", ["vas", "va", "vont"], FUTURE_HINT],
  ["Complète : Nous ___ manger bientôt.", "allons", ["allez", "vont", "vais"], FUTURE_HINT],
  ["Complète : Tu ___ chanter ce soir.", "vas", ["vais", "va", "allez"], FUTURE_HINT],
  ["Complète : Ils ___ partir demain.", "vont", ["va", "allons", "vais"], FUTURE_HINT],
  ["Complète : Elle ___ lire un livre.", "va", ["vas", "vais", "vont"], FUTURE_HINT],
  ["Complète : Vous ___ danser avec nous.", "allez", ["allons", "vont", "va"], FUTURE_HINT],
  ["Quelle phrase parle de demain?", "Je vais manger.", ["Je mange.", "J'ai mangé."], "Look for “aller” + a verb: it tells what will happen soon.", "📅"],
  ["Quelle phrase parle de ce qui est déjà arrivé?", "J'ai mangé.", ["Je vais manger.", "Je vais jouer."], "“J'ai mangé” is the past: it already happened.", "⏪"],
  ["Quelle phrase parle de ce qui va arriver?", "Nous allons nager.", ["Nous avons nagé.", "Nous nagions."], "“Aller” + a verb tells about the near future.", "🏊"],
  ["Quelle phrase parle du passé?", "Hier, Léa a joué.", ["Demain, Léa va jouer.", "Bientôt, Léa va jouer."], "Hier means yesterday. Yesterday is the past.", "🗓️"],
];

// ---------- Les pluriels en x ----------

const PLURAL_HINT = "Many words that end in -eau, -eu or -ou add an “x” in the plural (un bateau → des bateaux). Words ending in -al change to -aux (un cheval → des chevaux).";

const PLURALS: FrItem[] = [
  ["Un bateau, deux ___", "bateaux", ["bateaus", "bateau"], PLURAL_HINT, "⛵"],
  ["Un gâteau, trois ___", "gâteaux", ["gâteaus", "gâteau"], PLURAL_HINT, "🎂"],
  ["Un chapeau, deux ___", "chapeaux", ["chapeaus", "chapeau"], PLURAL_HINT, "🎩"],
  ["Un oiseau, quatre ___", "oiseaux", ["oiseaus", "oiseau"], PLURAL_HINT, "🐦"],
  ["Un cheval, deux ___", "chevaux", ["chevals", "cheval"], PLURAL_HINT, "🐴"],
  ["Un animal, des ___", "animaux", ["animals", "animal"], PLURAL_HINT, "🐾"],
  ["Un journal, des ___", "journaux", ["journals", "journal"], PLURAL_HINT, "📰"],
  ["Un jeu, des ___", "jeux", ["jeus", "jeu"], PLURAL_HINT, "🎲"],
  ["Un feu, des ___", "feux", ["feus", "feu"], PLURAL_HINT, "🔥"],
  ["Un chou, des ___", "choux", ["chous", "chou"], PLURAL_HINT, "🥬"],
  ["Un bijou, des ___", "bijoux", ["bijous", "bijou"], PLURAL_HINT, "💍"],
  ["Un couteau, des ___", "couteaux", ["couteaus", "couteau"], PLURAL_HINT, "🍴"],
];

// ---------- Préfixes et suffixes ----------

const AFFIXES: FrItem[] = [
  ["Que veut dire « relire »?", "lire de nouveau", ["lire très vite", "ne pas lire"], "The prefix “re-” means again.", "📖"],
  ["Que veut dire « refaire »?", "faire de nouveau", ["ne pas faire", "faire très bien"], "The prefix “re-” means again.", "🔁"],
  ["Que veut dire « recommencer »?", "commencer de nouveau", ["finir", "commencer trop tard"], "The prefix “re-” means again.", "🔁"],
  ["Que veut dire « défaire »?", "défaire ce qui est fait", ["faire de nouveau", "faire très vite"], "The prefix “dé-” often means the opposite.", "🧶"],
  ["Que veut dire « impossible »?", "pas possible", ["très possible", "possible demain"], "The prefix “im-” (or “in-”) often means not.", "🚫"],
  ["Que veut dire « inutile »?", "pas utile", ["très utile", "utile demain"], "The prefix “in-” often means not.", "🚫"],
  ["Que veut dire « malheureux »?", "pas heureux", ["très heureux", "heureux demain"], "The prefix “mal-” means badly or not.", "😢"],
  ["Que veut dire « invisible »?", "qu'on ne peut pas voir", ["qu'on voit très bien", "qu'on voit demain"], "The prefix “in-” often means not.", "👻"],
  ["Une maisonnette est…", "une petite maison", ["une grande maison", "une vieille maison"], "The ending “-ette” means small.", "🏡"],
  ["Une fillette est…", "une petite fille", ["une grande fille", "une vieille fille"], "The ending “-ette” means small.", "👧"],
  ["Un chanteur est une personne qui…", "chante", ["lit", "court"], "The ending “-eur” names the person who does the action.", "🎤"],
  ["Un pommier est…", "un arbre qui donne des pommes", ["une sorte de pomme", "un panier de pommes"], "The ending “-ier” can name the tree that gives a fruit.", "🌳"],
];

// ---------- L'idée principale ----------

const MAIN_HINT = "The main idea is what the whole text is about. Details are smaller facts that support it.";

const MAIN_IDEA: FrItem[] = [
  [
    "Quelle est l'idée principale?",
    "Les chats dorment beaucoup.",
    ["Les chats aiment les boîtes.", "Les chats mangent du poisson."],
    MAIN_HINT,
    { type: "passage", title: "Les chats", paragraphs: ["Les chats aiment dormir. Ils dorment douze heures par jour. Ils dorment au soleil, sur un lit ou dans une boîte."] },
  ],
  [
    "Quelle est l'idée principale?",
    "Les abeilles travaillent en équipe.",
    ["Les abeilles mangent des fleurs.", "Le miel est très sucré."],
    MAIN_HINT,
    { type: "passage", title: "Les abeilles", paragraphs: ["Les abeilles travaillent ensemble. Certaines cherchent des fleurs. D'autres fabriquent du miel. Chacune a son rôle dans la ruche."] },
  ],
  [
    "Quelle est l'idée principale?",
    "Je m'habille et je joue sous la pluie.",
    ["J'ai perdu mon parapluie.", "Il pleut toute la semaine."],
    MAIN_HINT,
    { type: "passage", title: "Jour de pluie", paragraphs: ["Quand il pleut, je mets mon imperméable et mes bottes. Je prends mon parapluie. Je saute dans les flaques."] },
  ],
  [
    "Quelle est l'idée principale?",
    "On peut faire plusieurs choses à la bibliothèque.",
    ["On doit se taire à la bibliothèque.", "Les livres sont rangés par couleur."],
    MAIN_HINT,
    { type: "passage", title: "La bibliothèque", paragraphs: ["À la bibliothèque, on peut emprunter des livres. On peut aussi lire sur place ou écouter une histoire. Tout le monde est le bienvenu."] },
  ],
  [
    "Quelle est l'idée principale?",
    "Les légumes ont besoin de soin pour pousser.",
    ["Les carottes sont orange.", "Le soleil est chaud."],
    MAIN_HINT,
    { type: "passage", title: "Le potager", paragraphs: ["Pour faire pousser des légumes, il faut de la terre, de l'eau et du soleil. Il faut aussi de la patience."] },
  ],
  [
    "Quelle est l'idée principale?",
    "Maya aide Kenji à se faire un ami.",
    ["Kenji est triste.", "La récréation est longue."],
    MAIN_HINT,
    { type: "passage", title: "Un nouvel élève", paragraphs: ["Kenji est nouveau à l'école. Maya lui montre la classe. Ils jouent ensemble à la récréation. Kenji se sent bien."] },
  ],
];

export const course: Course = {
  grade: "3",
  subject: "immersion",
  bigIdeas: {
    "ca-bc": [
      "Making connections between personal experiences and the experiences of others can help us to better understand and respond to a message.",
      "Texts present cultural elements that allow us to experience or understand different viewpoints.",
      "The structure and textual cues, as well as the words, all help to convey the message.",
      "Fairy and folk tales illustrate universal aspects of human life.",
      "Every language has a system of rules that distinguishes it from other languages.",
    ],
  },
  units: [
    {
      id: "verbes-pronominaux",
      title: "Je me, tu te, il se",
      emoji: "🪥",
      blurb: "Les verbes pronominaux",
      parentNote: "Reflexive pronouns (me, te, se, nous, vous) with everyday routines like se laver and se coucher.",
      standards: { "ca-bc": "Language elements: reflexive personal pronouns" },
      generate: (o) => frQuestions(REFLEXIVE, o, 8, FR),
    },
    {
      id: "et-mais-ou-avec",
      title: "Et, mais, ou, avec",
      emoji: "🔗",
      blurb: "Relier des idées",
      parentNote: "Joining ideas into longer sentences with coordinating conjunctions and simple prepositions.",
      standards: { "ca-bc": "Language elements: complex sentences joined by coordinating conjunctions and simple prepositions (et, mais, ou, avec)" },
      generate: (o) => frQuestions(LINKS, o, 8, FR),
    },
    {
      id: "ne-pas",
      title: "Ne… pas",
      emoji: "🚫",
      blurb: "Dire non",
      parentNote: "The negative form ne… pas, including n' before a vowel sound.",
      standards: { "ca-bc": "Language elements: affirmative and negative forms, including ne… pas" },
      generate: (o) => frQuestions(NEGATIVES, o, 8, FR),
    },
    {
      id: "futur-proche",
      title: "Le futur proche",
      emoji: "🔮",
      blurb: "Je vais jouer",
      parentNote: "Talking about what is about to happen with aller + a verb, and telling past from future.",
      standards: { "ca-bc": "Language elements: verb moods and tenses (present, near future, introduction to past tenses)" },
      generate: (o) => frQuestions(FUTURE, o, 8, FR),
    },
    {
      id: "pluriels-en-x",
      title: "Les pluriels en -x",
      emoji: "✖️",
      blurb: "Bateaux et chevaux",
      parentNote: "Plural spellings: -eau/-eu/-ou nouns add an x, and -al nouns become -aux.",
      standards: { "ca-bc": "Spelling conventions: plural nouns ending in “x”" },
      generate: (o) => frQuestions(PLURALS, o, 8, FR),
    },
    {
      id: "prefixes-et-suffixes",
      title: "Préfixes et suffixes",
      emoji: "🧱",
      blurb: "Les morceaux des mots",
      parentNote: "Using prefixes and suffixes (re-, dé-, in-, -ette, -eur, -ier) to work out the meaning of new words.",
      standards: { "ca-bc": "Language elements: word roots, prefixes and suffixes" },
      generate: (o) => frQuestions(AFFIXES, o, 8, FR),
    },
    {
      id: "idee-principale",
      title: "L'idée principale",
      emoji: "💡",
      blurb: "De quoi parle le texte?",
      parentNote: "Reading a short text and telling the main idea apart from smaller details.",
      standards: { "ca-bc": "Identify the main idea in oral, written or visual texts" },
      generate: (o) => frQuestions(MAIN_IDEA, o, 6, FR),
    },
  ],
};
