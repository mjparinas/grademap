import { frQuestions, type FrItem, type Opt } from "../../french";
import type { Course, GenerateOptions, Question } from "../../types";

const FR = { lang: "fr" } as const;

// ---------- Le superlatif ----------

const SUP_HINT = "The relative superlative uses le/la/les plus or moins + adjective: la plus rapide. The absolute superlative uses a word like très or extrêmement: très rapide.";

const SUPERLATIVES: FrItem[] = [
  ["Complète : Léa est ___ rapide de la classe.", "la plus", ["le plus", "plus", "très"], SUP_HINT],
  ["Complète : Ce livre est ___ intéressant de la bibliothèque.", "le plus", ["la plus", "plus", "très"], SUP_HINT],
  ["Complète : Voici la ville ___ froide du pays.", "la plus", ["le plus", "plus", "très"], SUP_HINT],
  ["Complète : Ces sacs sont ___ lourds de tous.", "les plus", ["le plus", "la plus", "plus"], SUP_HINT],
  ["Complète : Cette chanson est ___ belle de toutes.", "la plus", ["le plus", "très", "plus"], SUP_HINT],
  ["Complète : Marc est ___ petit de ses frères. (aucun n'est plus petit)", "le plus", ["la plus", "les plus", "très"], SUP_HINT],
  ["Quelle phrase contient un superlatif relatif?", "Maya est la plus rapide de la classe.", ["Maya est très rapide.", "Maya court vite."], SUP_HINT],
  ["Quelle phrase contient un superlatif absolu?", "Cette soupe est extrêmement chaude.", ["C'est la soupe la plus chaude.", "La soupe est chaude."], SUP_HINT],
  ["Quelle phrase contient un superlatif absolu?", "Ce film est très long.", ["C'est le film le plus long.", "Ce film est long."], SUP_HINT],
  ["Complète : C'est ___ gâteau que j'ai goûté.", "le meilleur", ["le plus bon", "le mieux", "plus meilleur"], "“Bon” has its own superlative: le meilleur / la meilleure."],
  ["Complète : Ana chante ___ de toute la chorale. (adverbe)", "le mieux", ["le meilleur", "le plus bien", "la plus bonne"], "The adverb “bien” becomes “le mieux” in the superlative."],
];

// ---------- Concordance des temps ----------

const TENSE_HINT = "Pick the tense the time clue calls for: the imparfait for descriptions and habits, the passé composé for finished events, the présent for now and the futur for later.";

const TENSES: FrItem[] = [
  ["Complète : Quand j'étais petite, j'___ peur du noir, mais maintenant je n'ai plus peur.", "avais", ["ai eu", "aurai", "ai"], TENSE_HINT],
  ["Complète : Hier, il pleuvait et nous ___ à la maison.", "sommes restés", ["restons", "resterons", "restait"], TENSE_HINT],
  ["Complète : Chaque été, ma famille ___ au lac. (aller)", "allait", ["est allée", "ira", "va"], TENSE_HINT],
  ["Complète : Dans dix ans, je ___ pilote. (devenir)", "deviendrai", ["suis devenu", "devenais", "deviens"], TENSE_HINT],
  ["Complète : Pendant que je faisais mes devoirs, ma sœur ___ du piano. (jouer)", "jouait", ["a joué", "jouera", "joue"], TENSE_HINT],
  ["Complète : Ce matin, la cloche ___ et les élèves sont entrés. (sonner)", "a sonné", ["sonnait", "sonnera", "sonne"], TENSE_HINT],
  ["Complète : Aujourd'hui, nous ___ un projet de sciences. (faire)", "faisons", ["avons fait", "faisions", "ferons"], TENSE_HINT],
  ["Complète : Demain, vous ___ le musée. (visiter)", "visiterez", ["avez visité", "visitiez", "visitez"], TENSE_HINT],
  ["Complète : Autrefois, les gens ___ leur eau au puits. (chercher)", "cherchaient", ["ont cherché", "chercheront", "cherchent"], TENSE_HINT],
  ["Complète : Soudain, un éclair ___ le ciel. (traverser)", "a traversé", ["traversait", "traversera", "traverse"], TENSE_HINT],
];

// ---------- Figures de style ----------

const COMP = "comparaison";
const META = "métaphore";
const PERS = "personnification";
const HYP = "hyperbole";
const FIG = [COMP, META, PERS, HYP];
const FIG_HINT = "A comparison uses “comme”. A metaphor says one thing IS another. Personification gives human actions to things. A hyperbole is a big exaggeration.";

function figure(sentence: string, right: string): FrItem {
  return [`« ${sentence} » est une…`, right, FIG.filter((f) => f !== right), FIG_HINT];
}

const FIGURES: FrItem[] = [
  figure("Elle est rapide comme l'éclair.", COMP),
  figure("Il est fort comme un lion.", COMP),
  figure("Le vent murmure dans les arbres.", PERS),
  figure("La lune sourit aux enfants.", PERS),
  figure("Cet homme est un roc.", META),
  figure("Mon petit frère est un moulin à paroles.", META),
  figure("J'ai attendu une éternité.", HYP),
  figure("Il y a mille choses à faire!", HYP),
  figure("Ses yeux brillent comme des étoiles.", COMP),
  figure("La forêt s'endort sous la neige.", PERS),
  ["Quel mot introduit souvent une comparaison?", "comme", ["parce que", "alors", "donc"], FIG_HINT],
  ["Dans « Il est têtu comme une mule », que compare-t-on?", "Un garçon et une mule", ["Une mule et une mouche", "Une école et un garçon"], FIG_HINT],
];

// ---------- La poésie ----------

const POEM_HINT = "A poem is made of lines (vers) grouped into stanzas (strophes). Rhymes, repetition and images (comparisons, metaphors) create its effect.";

const AUTUMN = {
  type: "passage" as const,
  title: "L'automne",
  paragraphs: ["Les feuilles dansent dans le vent,\nRouges et jaunes, un tapis d'or.\nL'automne arrive doucement,\nIl peint la forêt dehors."],
};

const MOON = {
  type: "passage" as const,
  title: "La lune",
  paragraphs: ["La lune veille sur la ville\nComme une lampe dans la nuit.\nElle sourit, calme et tranquille,\nEt garde le sommeil de tous."],
};

const POEMS: FrItem[] = [
  ["Quels mots riment dans le poème « L'automne »?", "vent et doucement", ["feuilles et forêt", "rouges et jaunes"], POEM_HINT, AUTUMN],
  ["Quels mots riment aussi dans « L'automne »?", "or et dehors", ["tapis et arrive", "danse et peint"], POEM_HINT, AUTUMN],
  ["Que désigne « un tapis d'or » dans « L'automne »?", "Les feuilles sur le sol", ["Un vrai tapis", "Un trésor"], "This is a metaphor: the fallen leaves look like a golden carpet.", AUTUMN],
  ["Dans « Il peint la forêt », quelle figure de style est utilisée?", "Une personnification", ["Une comparaison", "Une hyperbole"], POEM_HINT, AUTUMN],
  ["Quel est le thème du poème « L'automne »?", "Les couleurs de la saison", ["Un voyage en mer", "Une fête d'anniversaire"], POEM_HINT, AUTUMN],
  ["Combien de vers y a-t-il dans « La lune »?", "4", ["2", "8"], "Each line of a poem is a vers.", MOON],
  ["Quels mots riment dans « La lune »?", "ville et tranquille", ["lune et nuit", "lampe et sommeil"], POEM_HINT, MOON],
  ["Dans « Comme une lampe dans la nuit », quelle figure de style est utilisée?", "Une comparaison", ["Une personnification", "Une hyperbole"], "The word “comme” introduces a comparison.", MOON],
  ["Qu'est-ce qu'une strophe?", "Un groupe de vers", ["Un seul mot", "Le titre du poème"], POEM_HINT, "📜"],
  ["Qu'est-ce que la rime?", "La répétition d'un même son à la fin de deux vers", ["Un poème très long", "Un mot au début du vers"], POEM_HINT, "🎵"],
];

// ---------- Le paragraphe argumentatif ----------

const ARG_HINT = "An argumentative paragraph gives an opinion, then arguments, an example and a conclusion. Linking words (d'abord, de plus, par exemple, en conclusion) guide the reader.";

const READING = {
  type: "passage" as const,
  title: "Du temps pour lire",
  paragraphs: [
    "Je pense que les élèves devraient avoir du temps de lecture chaque jour. D'abord, la lecture améliore le vocabulaire. Par exemple, un élève qui lit souvent connaît plus de mots. De plus, lire détend et aide à se concentrer. En conclusion, la lecture quotidienne fait du bien à tous les élèves.",
  ],
};

const GARDEN = {
  type: "passage" as const,
  title: "Un jardin à l'école",
  paragraphs: [
    "Les écoles devraient avoir un jardin. Premièrement, un jardin apprend aux élèves d'où viennent les légumes. Par exemple, ils voient une graine devenir une carotte. En outre, travailler ensemble crée des amitiés. Pour conclure, un jardin enrichit la vie de l'école.",
  ],
};

const ARGUMENTS: FrItem[] = [
  ["Quelle phrase donne l'opinion de l'auteur?", "Je pense que les élèves devraient avoir du temps de lecture chaque jour.", ["La lecture améliore le vocabulaire.", "Un élève qui lit connaît plus de mots."], ARG_HINT, READING],
  ["Quelle phrase est un exemple?", "Un élève qui lit souvent connaît plus de mots.", ["La lecture améliore le vocabulaire.", "La lecture quotidienne fait du bien à tous."], ARG_HINT, READING],
  ["Quelle phrase est la conclusion?", "La lecture quotidienne fait du bien à tous les élèves.", ["Lire détend et aide à se concentrer.", "La lecture améliore le vocabulaire."], ARG_HINT, READING],
  ["Quel mot ajoute un deuxième argument?", "De plus", ["Par exemple", "En conclusion"], ARG_HINT, READING],
  ["Quelle phrase donne l'opinion de l'auteur?", "Les écoles devraient avoir un jardin.", ["Ils voient une graine devenir une carotte.", "Travailler ensemble crée des amitiés."], ARG_HINT, GARDEN],
  ["Quelle phrase est un exemple?", "Ils voient une graine devenir une carotte.", ["Un jardin enrichit la vie de l'école.", "Les écoles devraient avoir un jardin."], ARG_HINT, GARDEN],
  ["Quels mots annoncent la conclusion?", "Pour conclure", ["En outre", "Par exemple"], ARG_HINT, GARDEN],
  ["Complète : Je suis contre le bruit en classe, ___ il empêche de se concentrer.", "car", ["mais", "pourtant", "avant"], ARG_HINT],
  ["Complète : Il a bien étudié ; ___, il a réussi son examen.", "par conséquent", ["par exemple", "pourtant", "d'abord"], ARG_HINT],
  ["Quel mot annonce un exemple?", "Par exemple", ["En conclusion", "Pourtant"], ARG_HINT],
];

// ---------- Inférences et thèmes ----------

const INF_HINT = "Inferring means using clues in the text, plus what you already know, to find what the author does not say directly.";

const NERVOUS = {
  type: "passage" as const,
  title: "Le concours",
  paragraphs: ["Amir regarde l'horloge pour la dixième fois. Il tape du pied et mordille son crayon. Dans quelques minutes, on annoncera les résultats du concours."],
};

const LETTER = {
  type: "passage" as const,
  title: "La lettre",
  paragraphs: ["Maya serre fort la lettre contre son cœur. Par la fenêtre, elle regarde la valise près de la porte. Demain, son amie partira pour une autre province."],
};

const YARD = {
  type: "passage" as const,
  title: "La cour vide",
  paragraphs: ["La cour est vide. La cloche n'a pas sonné, mais personne ne joue. Les élèves restent près des murs, un manteau sur la tête. Le ciel est gris."],
};

const INFERENCES: FrItem[] = [
  ["Comment se sent Amir?", "Nerveux", ["Calme", "Fâché"], INF_HINT, NERVOUS],
  ["Quels indices montrent l'état d'Amir?", "Il regarde l'horloge, tape du pied et mordille son crayon", ["Il lit un livre", "Il chante une chanson"], INF_HINT, NERVOUS],
  ["Que ressent Maya?", "De la tristesse", ["De la colère", "De l'ennui"], INF_HINT, LETTER],
  ["Qu'est-ce qui est sous-entendu dans « La lettre »?", "Maya va être séparée de son amie", ["Maya part en voyage seule", "Maya a perdu sa valise"], INF_HINT, LETTER],
  ["Pourquoi les élèves ne jouent-ils pas dans la cour?", "Il pleut ou il va pleuvoir", ["Il fait très chaud", "C'est un jour de fête"], INF_HINT, YARD],
  ["Quel indice montre le temps qu'il fait?", "Un manteau sur la tête et un ciel gris", ["La cloche n'a pas sonné", "La cour est grande"], INF_HINT, YARD],
  ["Un personnage apprend à pardonner à son ami. Quel est le thème?", "Le pardon", ["La vitesse", "La météo"], "The theme is the big idea the story explores through what happens to the character.", "📖"],
  ["Un personnage surmonte sa peur pour sauver son chien. Quel est le thème?", "Le courage", ["La paresse", "La jalousie"], "The theme is the big idea the story explores through what happens to the character.", "🐕"],
];

// ---------- Portrait de personnage ----------

const PORTRAIT_HINT = "A character portrait has two parts: physical traits (how the character looks) and psychological traits (personality, how they think and act).";

const PHYSICAL = ["grand", "petit", "blond", "brun", "mince", "musclé", "frisé", "roux"];
const PSYCH = ["courageux", "timide", "généreux", "curieux", "patient", "honnête", "drôle", "têtu"];

function portraitItems(): FrItem[] {
  const toOpts = (words: string[]): Opt[] => words;
  const items: FrItem[] = [];
  for (const w of PSYCH) items.push(["Quel mot décrit un trait psychologique?", w, toOpts(PHYSICAL), PORTRAIT_HINT, "🧠"]);
  for (const w of PHYSICAL) items.push(["Quel mot décrit un trait physique?", w, toOpts(PSYCH), PORTRAIT_HINT, "🧍"]);
  items.push(
    ["« Elle a les cheveux roux et de grands yeux verts. » décrit…", "un trait physique", ["un trait psychologique", "un lieu"], PORTRAIT_HINT],
    ["« Il est généreux et toujours prêt à aider. » décrit…", "un trait psychologique", ["un trait physique", "un lieu"], PORTRAIT_HINT],
    ["« Elle partage toujours son goûter. » montre qu'elle est…", "généreuse", ["jalouse", "paresseuse"], "A character's actions show their personality."],
    ["« Il n'a pas peur de parler devant toute la classe. » montre qu'il est…", "courageux", ["timide", "paresseux"], "A character's actions show their personality."],
  );
  return items;
}

function portrait(opts?: GenerateOptions): Question[] {
  return frQuestions(portraitItems(), opts, 8, FR);
}

export const course: Course = {
  grade: "7",
  subject: "immersion",
  bigIdeas: {
    "ca-bc": [
      "Expressing our thoughts enables us to situate ourselves in relation to our own and others' cultures.",
      "Considering the feelings evoked by a message and its unspoken elements allows us to construct the meaning of a message.",
      "The themes of a narrative emerge from the situations characters experience and the way they respond to those situations.",
      "The form of a text plays as important a role as its content in conveying a message and creating a desired effect.",
    ],
  },
  units: [
    {
      id: "superlatif",
      title: "Le superlatif",
      emoji: "🏆",
      blurb: "Le plus, le moins, très",
      parentNote: "The relative superlative (le plus, la moins…) and the absolute superlative (très, extrêmement).",
      standards: { "ca-bc": "Language elements: structure of the superlative (relative with adjectives and absolute with adverbs)" },
      generate: (o) => frQuestions(SUPERLATIVES, o, 8, FR),
    },
    {
      id: "concordance-des-temps",
      title: "Choisir le bon temps",
      emoji: "⏳",
      blurb: "Concordance des temps",
      parentNote: "Choosing verb tenses that fit together logically in a text, using clues such as hier, chaque été and demain.",
      standards: { "ca-bc": "Language elements: agreement of tenses (logical choice of verb moods and tenses in a text)" },
      generate: (o) => frQuestions(TENSES, o, 8, FR),
    },
    {
      id: "figures-de-style",
      title: "Figures de style",
      emoji: "🎭",
      blurb: "Comparaison, métaphore…",
      parentNote: "Recognizing comparisons, metaphors, personification and hyperbole, and how they create an effect.",
      standards: { "ca-bc": "Identify poetic elements and explain their effects on readers; use figures of speech" },
      generate: (o) => frQuestions(FIGURES, o, 8, FR),
    },
    {
      id: "poesie",
      title: "La poésie",
      emoji: "🌸",
      blurb: "Vers, strophes et rimes",
      parentNote: "Features of poetry: verses, stanzas, rhyme, theme and images, using two original poems.",
      standards: { "ca-bc": "Literary elements: characteristics of poetry (implicit meaning, explicit meaning, theme, tone, poetic elements)" },
      generate: (o) => frQuestions(POEMS, o, 8, FR),
    },
    {
      id: "paragraphe-argumentatif",
      title: "Défendre son opinion",
      emoji: "📣",
      blurb: "Le paragraphe argumentatif",
      parentNote: "Structure of an argumentative paragraph: opinion, arguments, examples and conclusion, linked with discourse markers.",
      standards: { "ca-bc": "Text organization: argumentative paragraphs (main idea, explanation, examples, transitions, conclusion)" },
      generate: (o) => frQuestions(ARGUMENTS, o, 8, FR),
    },
    {
      id: "inferences-et-themes",
      title: "Lire entre les lignes",
      emoji: "🕵️",
      blurb: "Inférences et thèmes",
      parentNote: "Finding implicit information from clues in a text, and identifying the theme of a story.",
      standards: { "ca-bc": "Identify implicit information in a text, relying on specific cues and prior knowledge; themes of a narrative" },
      generate: (o) => frQuestions(INFERENCES, o, 8, FR),
    },
    {
      id: "portrait-de-personnage",
      title: "Portrait de personnage",
      emoji: "🖼️",
      blurb: "Physique et personnalité",
      parentNote: "Describing a character with physical traits and psychological traits, and inferring personality from actions.",
      standards: { "ca-bc": "Create a character portrayal including physical characteristics and psychological traits" },
      generate: portrait,
    },
  ],
};
