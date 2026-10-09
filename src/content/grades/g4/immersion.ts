import { frOrder, frQuestions, type FrItem } from "../../french";
import { sample } from "../../random";
import type { Course, GenerateOptions, Question } from "../../types";

const FR = { lang: "fr" } as const;

// ---------- Tu ou vous? ----------

const TU_HINT = "Use “tu” with friends, classmates, family and children your age. Use “vous” to show respect to an adult you don't know well, or when speaking to more than one person.";

const TU_VOUS: FrItem[] = [
  ["Que dis-tu à ta directrice?", "Comment allez-vous?", ["Comment vas-tu?", "Comment va-t-il?"], TU_HINT, "🏫"],
  ["Que dis-tu à ton ami?", "Comment vas-tu?", ["Comment allez-vous?", "Comment va-t-elle?"], TU_HINT, "🧒"],
  ["Que dis-tu à ton enseignante?", "Pouvez-vous m'aider, s'il vous plaît?", ["Peux-tu m'aider, s'il te plaît?", "Peut-il m'aider, s'il vous plaît?"], TU_HINT, "👩‍🏫"],
  ["Que dis-tu à ton petit frère?", "As-tu faim?", ["Avez-vous faim?", "A-t-elle faim?"], TU_HINT, "👶"],
  ["Tu parles à toute ta classe. Que dis-tu?", "Avez-vous fini?", ["As-tu fini?", "A-t-il fini?"], "When you speak to a group, you always use “vous”.", "👥"],
  ["Un adulte que tu ne connais pas te demande l'heure. Il te dit…", "Excusez-moi, avez-vous l'heure?", ["Excuse-moi, as-tu l'heure?", "Excusons-nous, a-t-il l'heure?"], TU_HINT, "⌚"],
  ["Tu parles à ton chat. Que dis-tu?", "Tu veux jouer?", ["Vous voulez jouer?", "Elle veut jouer?"], "With a pet, a close friend or a family member, we usually say “tu”.", "🐱"],
  ["Tu demandes de l'aide à un policier. Que dis-tu?", "Pouvez-vous m'aider?", ["Peux-tu m'aider?", "Peut-elle m'aider?"], TU_HINT, "🚓"],
  ["Tu parles à une camarade de classe. Que dis-tu?", "Veux-tu jouer avec moi?", ["Voulez-vous jouer avec moi?", "Veulent-ils jouer avec moi?"], TU_HINT, "🤝"],
];

// ---------- Poser des questions ----------

const Q_HINT = "Question words: qui (who), que (what), où (where), quand (when), pourquoi (why), comment (how), combien (how many).";

const QUESTION_WORDS: FrItem[] = [
  ["Complète : ___ habites-tu? J'habite à la campagne.", "Où", ["Quand", "Combien", "Qui"], Q_HINT],
  ["Complète : ___ est-ce? C'est mon frère.", "Qui", ["Où", "Quand", "Combien"], Q_HINT],
  ["Complète : ___ arrives-tu? J'arrive demain.", "Quand", ["Où", "Qui", "Comment"], Q_HINT],
  ["Complète : ___ pleures-tu? Parce que je suis triste.", "Pourquoi", ["Quand", "Où", "Combien"], Q_HINT],
  ["Complète : ___ vas-tu à l'école? J'y vais à pied.", "Comment", ["Quand", "Pourquoi", "Qui"], Q_HINT],
  ["Complète : ___ de frères as-tu? J'en ai deux.", "Combien", ["Où", "Qui", "Pourquoi"], Q_HINT],
  ["Quelle question utilise l'inversion du sujet et du verbe?", "Aimes-tu la musique?", ["Tu aimes la musique.", "Est-ce que tu aimes la musique?"], "In an inversion, the verb comes first and is linked to the pronoun with a hyphen: tu aimes → aimes-tu?", "🎵"],
  ["Quelle question utilise l'inversion du sujet et du verbe?", "Où vas-tu?", ["Où est-ce que tu vas?", "Tu vas où."], "In an inversion, the verb comes before the pronoun: tu vas → vas-tu?", "🧭"],
  ["Quelle question utilise l'inversion du sujet et du verbe?", "Mange-t-il une pomme?", ["Est-ce qu'il mange une pomme?", "Il mange une pomme."], "With il, elle or on, add a “t” between two vowels: mange-t-il?", "🍎"],
  ["Quelle question utilise l'inversion du sujet et du verbe?", "Parlez-vous français?", ["Est-ce que vous parlez français?", "Vous parlez français."], "Inversion: the verb comes first, then the pronoun.", "🗣️"],
];

// ---------- Synonymes et contraires ----------

const SYN_HINT = "Synonyms mean almost the same thing. Antonyms (contraires) mean the opposite.";

const SYNONYMS: FrItem[] = [
  ["Quel mot est un synonyme de « content »?", "heureux", ["triste", "fatigué"], SYN_HINT],
  ["Quel mot est un synonyme de « jolie »?", "belle", ["laide", "petite"], SYN_HINT],
  ["Quel mot est un synonyme de « fatigué »?", "épuisé", ["énergique", "affamé"], SYN_HINT],
  ["Quel mot est un synonyme de « gentil »?", "aimable", ["méchant", "pressé"], SYN_HINT],
  ["Quel mot est un synonyme de « commencer »?", "débuter", ["finir", "arrêter"], SYN_HINT],
  ["Quel mot est un synonyme de « très grand »?", "immense", ["minuscule", "étroit"], SYN_HINT],
  ["Quel est le contraire de « grand »?", "petit", ["gros", "long"], SYN_HINT],
  ["Quel est le contraire de « chaud »?", "froid", ["tiède", "sec"], SYN_HINT],
  ["Quel est le contraire de « haut »?", "bas", ["large", "petit"], SYN_HINT],
  ["Quel est le contraire de « lent »?", "rapide", ["doux", "calme"], SYN_HINT],
  ["Quel est le contraire de « ouvrir »?", "fermer", ["pousser", "tirer"], SYN_HINT],
  ["Quel est le contraire de « facile »?", "difficile", ["simple", "léger"], SYN_HINT],
  ["Quel est le contraire de « monter »?", "descendre", ["marcher", "tourner"], SYN_HINT],
  ["Quel est le contraire de « plein »?", "vide", ["gros", "lourd"], SYN_HINT],
];

// ---------- Les adverbes en -ment ----------

const ADV_HINT = "Take the feminine form of the adjective and add -ment: lente → lentement, douce → doucement. Careful with endings in -ent/-ant: they become -emment/-amment.";

const ADVERBS: FrItem[] = [
  ["Complète : Elle marche ___. (lent)", "lentement", ["lentment", "lente", "lentemment"], ADV_HINT],
  ["Complète : Parle ___, s'il te plaît. (doux)", "doucement", ["douxment", "douce", "doucément"], ADV_HINT],
  ["Complète : ___, il a trouvé ses clés. (heureux)", "Heureusement", ["Heureuxment", "Heureuse", "Heureusment"], ADV_HINT],
  ["Complète : Il répond ___. (calme)", "calmement", ["calmment", "calme", "calmément"], ADV_HINT],
  ["Complète : Elle court ___. (rapide)", "rapidement", ["rapidment", "rapide", "rapidemment"], ADV_HINT],
  ["Complète : Il parle ___. (franc)", "franchement", ["francment", "franc", "franchément"], ADV_HINT],
  ["Complète : Elle explique ___. (clair)", "clairement", ["clairment", "claire", "clairémment"], ADV_HINT],
  ["Complète : Il écrit ___. (lent)", "lentement", ["lentment", "lente", "lentémment"], ADV_HINT],
  ["Complète : Nous avançons ___. (prudent)", "prudemment", ["prudentment", "prudent", "prudement"], "Adjectives ending in -ent make adverbs ending in -emment: prudent → prudemment."],
];

// ---------- Comparer ----------

const COMP_HINT = "Use plus… que (more… than), moins… que (less… than) and aussi… que (as… as) to compare.";

const COMPARE: FrItem[] = [
  ["Complète : Un éléphant est ___ grand qu'une souris.", "plus", ["moins", "aussi", "très"], COMP_HINT, "🐘"],
  ["Complète : Une souris est ___ grande qu'un éléphant.", "moins", ["plus", "aussi", "très"], COMP_HINT, "🐭"],
  ["Complète : Léa et Maya courent à la même vitesse. Léa court ___ vite que Maya.", "aussi", ["plus", "moins", "très"], COMP_HINT, "🏃"],
  ["Complète : Le guépard court ___ vite que la tortue.", "plus", ["moins", "aussi", "très"], COMP_HINT, "🐆"],
  ["Complète : La glace est ___ chaude que le feu.", "moins", ["plus", "aussi", "très"], COMP_HINT, "🧊"],
  ["Complète : Ces deux livres ont le même prix. Ce livre est ___ cher que l'autre.", "aussi", ["plus", "moins", "très"], COMP_HINT, "📚"],
  ["Complète : Le chat marche ___ lentement que l'escargot.", "moins", ["plus", "aussi", "très"], COMP_HINT, "🐌"],
  ["Complète : Une montagne est ___ haute qu'une colline.", "plus", ["moins", "aussi", "très"], COMP_HINT, "⛰️"],
];

// ---------- Le passé composé et l'imparfait ----------

const PC_HINT = "The passé composé is a form of avoir + the past participle: j'ai mangé, tu as chanté, elle a joué, nous avons dansé, vous avez écouté, ils ont nagé.";

const PASSE: FrItem[] = [
  ["Complète : Hier, j'___ joué au parc.", "ai", ["as", "a", "ont"], PC_HINT],
  ["Complète : Hier, tu ___ chanté très bien.", "as", ["ai", "a", "avons"], PC_HINT],
  ["Complète : Hier, Léa ___ dansé.", "a", ["as", "ai", "ont"], PC_HINT],
  ["Complète : Hier, nous ___ regardé un film.", "avons", ["avez", "ont", "ai"], PC_HINT],
  ["Complète : Hier, ils ___ nagé au lac.", "ont", ["a", "avons", "avez"], PC_HINT],
  ["Complète : Hier, vous ___ écouté la radio.", "avez", ["avons", "ont", "as"], PC_HINT],
  ["Complète : Hier, j'ai ___ une pomme. (manger)", "mangé", ["manger", "mangez", "mange"], PC_HINT],
  ["Complète : Hier, elle a ___ une chanson. (chanter)", "chanté", ["chanter", "chantez", "chante"], PC_HINT],
  ["Complète : Hier, nous avons ___ au ballon. (jouer)", "joué", ["jouer", "jouez", "joue"], PC_HINT],
  ["Complète : Hier, tu as ___ ton dessin. (colorier)", "colorié", ["colorier", "coloriez", "colorie"], PC_HINT],
];

const IMP_HINT = "The imparfait describes how things used to be or how they were. Take the “nous” form of the present, remove -ons and add -ais, -ais, -ait, -ions, -iez, -aient.";

const IMPARFAIT: FrItem[] = [
  ["Complète : Autrefois, je ___ au parc chaque jour. (jouer)", "jouais", ["joue", "jouerai", "joué"], IMP_HINT],
  ["Complète : Quand tu étais petit, tu ___ souvent. (chanter)", "chantais", ["chantes", "chanteras", "chanté"], IMP_HINT],
  ["Complète : Il était une fois une princesse qui ___ seule. (vivre)", "vivait", ["vit", "vivra", "vécu"], IMP_HINT],
  ["Complète : Autrefois, nous ___ à pied à l'école. (aller)", "allions", ["allons", "irons", "allé"], IMP_HINT],
  ["Complète : Quand vous étiez jeunes, vous ___ beaucoup. (parler)", "parliez", ["parlez", "parlerez", "parlé"], IMP_HINT],
  ["Complète : Dans le conte, les loups ___ dans la forêt. (habiter)", "habitaient", ["habitent", "habiteront", "habité"], IMP_HINT],
  ["Complète : Il y a longtemps, Maya ___ les dinosaures. (aimer)", "aimait", ["aime", "aimera", "aimé"], IMP_HINT],
  ["Complète : Avant, je me ___ très tôt. (lever)", "levais", ["lève", "lèverai", "levé"], IMP_HINT],
];

// ---------- Comprendre un texte ----------

const READ_HINT = "Look for clues in the text. Clues you find help you work out what the author does not say.";

const TEXTS: Record<string, { title: string; paragraphs: string[] }> = {
  neige: { title: "Un matin d'hiver", paragraphs: ["Ce matin, Noé regarde par la fenêtre. Tout est blanc! Il court chercher ses mitaines et sa tuque. Il a hâte de sortir."] },
  chat: { title: "Minou", paragraphs: ["Priya cherche son chat partout. Elle regarde sous le lit, dans l'armoire et derrière le canapé. Soudain, elle entend un petit bruit dans la boîte. Minou dort là!"] },
  gateau: { title: "Une bonne odeur", paragraphs: ["Il y a beaucoup de bruit dans la cuisine. Ana rit en ouvrant le four. Une odeur sucrée remplit la maison. Sur la table, on voit de la farine et des œufs."] },
  grenouille: { title: "De l'œuf à la grenouille", paragraphs: ["Les grenouilles commencent leur vie sous forme d'œufs. Ensuite, des têtards sortent des œufs. Peu à peu, les têtards poussent des pattes. À la fin, ils deviennent des grenouilles."] },
  tournoi: { title: "Le tournoi", paragraphs: ["Le tournoi de soccer commence à dix heures. Léo met ses souliers et prend sa bouteille d'eau. Sa mère le conduit au terrain. Il sourit, car son équipe est prête."] },
};

const COMPREHENSION: FrItem[] = [
  ["Quelle est l'idée principale?", "Noé est heureux de voir la neige.", ["Noé perd ses mitaines.", "Noé a froid à la fenêtre."], READ_HINT, { type: "passage", ...TEXTS.neige }],
  ["Quelle saison est-ce?", "L'hiver", ["L'été", "Le printemps"], READ_HINT, { type: "passage", ...TEXTS.neige }],
  ["Où est le chat à la fin?", "Dans la boîte", ["Sous le lit", "Dans l'armoire"], READ_HINT, { type: "passage", ...TEXTS.chat }],
  ["Que prépare Ana?", "Un gâteau", ["Une soupe", "Une salade"], "The sweet smell, the oven, the flour and the eggs are clues.", { type: "passage", ...TEXTS.gateau }],
  ["Quelle est l'idée principale?", "Les grenouilles changent beaucoup en grandissant.", ["Les grenouilles aiment l'eau.", "Les têtards mangent des œufs."], READ_HINT, { type: "passage", ...TEXTS.grenouille }],
  ["Qu'est-ce qui arrive après les œufs?", "Des têtards sortent des œufs", ["Les grenouilles sautent", "Les pattes disparaissent"], READ_HINT, { type: "passage", ...TEXTS.grenouille }],
  ["Que fait Léo pour se préparer?", "Il met ses souliers et prend de l'eau", ["Il dort jusqu'à dix heures", "Il fait un gâteau"], READ_HINT, { type: "passage", ...TEXTS.tournoi }],
  ["Comment se sent Léo à la fin?", "Il est confiant", ["Il est fâché", "Il est fatigué"], "He smiles because his team is ready: that is a clue about how he feels.", { type: "passage", ...TEXTS.tournoi }],
  ["Comment se sent Priya à la fin?", "Elle est soulagée", ["Elle est fâchée", "Elle est fatiguée"], "She finds her cat after looking everywhere. How would you feel?", { type: "passage", ...TEXTS.chat }],
];

// ---------- La structure du récit ----------

const TALES: { lines: string[] }[] = [
  { lines: ["Au début, Léa vit seule dans la forêt.", "Un jour, elle trouve un oiseau blessé.", "Elle le soigne avec de l'eau et des graines.", "Après une semaine, l'oiseau guérit et s'envole.", "Léa est contente : elle a maintenant un nouvel ami."] },
  { lines: ["Dans un petit village, Kenji aime dessiner.", "Un matin, ses crayons disparaissent.", "Il cherche dans la classe, dans la cour et dans son sac.", "Il trouve ses crayons chez son chien, qui jouait avec eux.", "Kenji rit et range ses crayons dans sa boîte."] },
  { lines: ["Maya et Amir construisent un cerf-volant.", "Le jour du festival, le vent est trop fort.", "Ils changent la queue du cerf-volant et essaient encore.", "Le cerf-volant monte très haut dans le ciel.", "Les deux amis sont fiers de leur travail."] },
];

const ROLES = [
  { label: "la situation initiale", hint: "The initial situation tells us who and where we are at the beginning, before anything happens." },
  { label: "l'élément déclencheur", hint: "The inciting incident is the event that starts the problem or the adventure." },
  { label: "le déroulement", hint: "The rising action is what the characters do to try to solve the problem." },
  { label: "le dénouement", hint: "The resolution is the moment when the problem is solved." },
  { label: "la situation finale", hint: "The final situation shows how things are at the end." },
];

function structure(opts?: GenerateOptions): Question[] {
  const items: FrItem[] = TALES.flatMap((t) =>
    ROLES.map((r, i): FrItem => [
      `Quelle phrase est ${r.label}?`,
      t.lines[i],
      t.lines.filter((_, j) => j !== i),
      r.hint,
      { type: "story", lines: t.lines },
    ]),
  );
  const t = sample(TALES, 1)[0];
  return [...frQuestions(items, opts, 7, FR), frOrder("Remets l'histoire dans l'ordre.", "Think: beginning, problem, what happens, solution, ending.", t.lines, FR)];
}

export const course: Course = {
  grade: "4",
  subject: "immersion",
  bigIdeas: {
    "ca-bc": [
      "One's self-image is revealed by one's choice of message and the way it is communicated.",
      "The diversity of cultural elements in texts reflects the cultural diversity within society.",
      "The nuances in a text can be discovered through inferences.",
      "Characters are defined by who they are, but also by how others see them.",
      "The use of stylistic devices and specific vocabulary creates unique effects.",
    ],
  },
  units: [
    {
      id: "tu-ou-vous",
      title: "Tu ou vous?",
      emoji: "🤝",
      blurb: "Parler poliment",
      parentNote: "Choosing between “tu” and “vous” depending on who is being spoken to, an important courtesy in French.",
      standards: { "ca-bc": "Communication strategies: expressions of courtesy, specifically the use of “tu” and “vous”" },
      generate: (o) => frQuestions(TU_VOUS, o, 8, FR),
    },
    {
      id: "poser-des-questions",
      title: "Poser des questions",
      emoji: "❓",
      blurb: "Où? Quand? Pourquoi?",
      parentNote: "Question words (qui, où, quand, pourquoi, comment, combien) and questions formed by inverting the subject and verb.",
      standards: { "ca-bc": "Language elements: structure of interrogative sentences, including subject-verb inversion and interrogative pronouns" },
      generate: (o) => frQuestions(QUESTION_WORDS, o, 8, FR),
    },
    {
      id: "synonymes-et-contraires",
      title: "Synonymes et contraires",
      emoji: "↔️",
      blurb: "Des mots qui se ressemblent",
      parentNote: "Building vocabulary with synonyms (similar meaning) and antonyms (opposite meaning).",
      standards: { "ca-bc": "Language elements: synonyms and antonyms" },
      generate: (o) => frQuestions(SYNONYMS, o, 8, FR),
    },
    {
      id: "adverbes-en-ment",
      title: "Les adverbes en -ment",
      emoji: "🐢",
      blurb: "Lentement, doucement",
      parentNote: "Forming adverbs from the feminine form of an adjective plus -ment.",
      standards: { "ca-bc": "Language elements: forming adverbs from the feminine form of a regular adjective plus “-ment”" },
      generate: (o) => frQuestions(ADVERBS, o, 8, FR),
    },
    {
      id: "comparer",
      title: "Comparer",
      emoji: "⚖️",
      blurb: "Plus, moins, aussi",
      parentNote: "Comparing with plus… que, moins… que and aussi… que, with adjectives and adverbs.",
      standards: { "ca-bc": "Language elements: comparative adverbs and their structure with adjectives" },
      generate: (o) => frQuestions(COMPARE, o, 8, FR),
    },
    {
      id: "passe-compose",
      title: "Le passé composé",
      emoji: "⏪",
      blurb: "J'ai mangé, tu as chanté",
      parentNote: "The passé composé of first-group (-er) verbs, formed with avoir and the past participle.",
      standards: { "ca-bc": "Language elements: the passé composé of first-group verbs" },
      generate: (o) => frQuestions(PASSE, o, 8, FR),
    },
    {
      id: "imparfait",
      title: "L'imparfait",
      emoji: "🕰️",
      blurb: "Il était une fois…",
      parentNote: "The imparfait, the tense used to describe and to set the scene in stories and tales.",
      standards: { "ca-bc": "Language elements: the imparfait, used with the genres studied" },
      generate: (o) => frQuestions(IMPARFAIT, o, 8, FR),
    },
    {
      id: "comprendre-un-texte",
      title: "Comprendre un texte",
      emoji: "🔍",
      blurb: "Idées et indices",
      parentNote: "Reading a short text, finding the main idea and making inferences from clues.",
      standards: { "ca-bc": "Identify a text's main idea and supporting details; draw inferences from texts" },
      generate: (o) => frQuestions(COMPREHENSION, o, 8, FR),
    },
    {
      id: "structure-du-recit",
      title: "La structure du récit",
      emoji: "🧭",
      blurb: "Début, problème, fin",
      parentNote: "The five parts of a narrative: initial situation, inciting incident, rising action, resolution and final situation.",
      standards: { "ca-bc": "Text organization: narrative structure (setting, inciting incident, rising action, falling action, resolution)" },
      generate: structure,
    },
  ],
};
