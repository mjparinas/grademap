import { frQuestions, type FrItem } from "../../french";
import type { Course } from "../../types";

const FR = { lang: "fr" } as const;

// ---------- Imparfait ou passé composé? ----------

const TENSE_HINT = "Use the imparfait to describe, set the scene or tell what used to happen. Use the passé composé for a specific event that happened and finished.";

const TENSES: FrItem[] = [
  ["Complète : Je ___ la télé quand le téléphone a sonné. (regarder)", "regardais", ["ai regardé", "regarde", "regarderai"], TENSE_HINT],
  ["Complète : Soudain, la porte ___ . (s'ouvrir)", "s'est ouverte", ["s'ouvrait", "s'ouvre", "s'ouvrira"], TENSE_HINT],
  ["Complète : Hier, Maya ___ à l'école à huit heures. (arriver)", "est arrivée", ["a arrivé", "arrivait", "arrive"], "Arriver uses “être” in the passé composé, and the participle agrees with the subject: Maya est arrivée."],
  ["Complète : Quand j'étais petit, nous ___ chaque été au lac. (aller)", "allions", ["sommes allés", "allons", "irions"], TENSE_HINT],
  ["Complète : Il ___ beau et le ciel était bleu. (faire)", "faisait", ["a fait", "fait", "fera"], TENSE_HINT],
  ["Complète : Hier, nous ___ un gâteau, puis nous l'avons mangé. (préparer)", "avons préparé", ["préparions", "préparons", "préparent"], TENSE_HINT],
  ["Complète : Elle ___ un livre quand son ami est entré. (lire)", "lisait", ["a lu", "lit", "lira"], TENSE_HINT],
  ["Complète : Hier, les élèves ___ une visite au musée. (faire)", "ont fait", ["faisaient", "font", "feront"], TENSE_HINT],
  ["Complète : Chaque matin, mon grand-père ___ le journal. (lire)", "lisait", ["a lu", "lit", "lira"], "“Chaque matin” shows a habit in the past, so we use the imparfait."],
  ["Complète : Tout à coup, un oiseau ___ sur la branche. (se poser)", "s'est posé", ["se posait", "se pose", "se posera"], TENSE_HINT],
];

// ---------- Racines, préfixes, suffixes ----------

const ROOT_HINT = "Words in the same family share a root. Prefixes and suffixes add meaning: pré- (before), sous- (under), sur- (over), -able (can be), -tion (action).";

const WORD_FAMILY: FrItem[] = [
  ["Quel mot est de la famille de « terre »?", "souterrain", ["sourire", "porter"], ROOT_HINT, "🌍"],
  ["Quel mot est de la famille de « dent »?", "dentiste", ["danser", "dette"], ROOT_HINT, "🦷"],
  ["Quel mot est de la famille de « porter »?", "transporter", ["potager", "poterie"], ROOT_HINT, "📦"],
  ["Quel mot est de la famille de « lait »?", "laitier", ["laid", "lettre"], ROOT_HINT, "🥛"],
  ["Que veut dire le préfixe « pré- » dans « préhistoire »?", "avant", ["après", "sous"], ROOT_HINT, "🦕"],
  ["Que veut dire le préfixe « sous- » dans « sous-marin »?", "sous", ["sur", "avant"], ROOT_HINT, "🌊"],
  ["Que veut dire le préfixe « sur- » dans « surnaturel »?", "au-dessus de", ["sous", "avant"], ROOT_HINT, "✨"],
  ["Que veut dire le suffixe « -able » dans « lavable »?", "qui peut être", ["qui est très", "qui n'est pas"], ROOT_HINT, "🧺"],
  ["Que veut dire le préfixe « anti- » dans « antivol »?", "contre", ["avec", "avant"], ROOT_HINT, "🔒"],
  ["Que veut dire le suffixe « -tion » dans « décoration »?", "l'action de", ["qui est", "pas"], ROOT_HINT, "🎈"],
  ["« Un livre lisible » est un livre…", "qu'on peut lire", ["qu'on ne peut pas lire", "qu'on lit trop vite"], ROOT_HINT, "📚"],
  ["Que veut dire le préfixe « dés- » ou « dé- » dans « déplaire »?", "le contraire", ["encore", "avant"], ROOT_HINT, "🚫"],
];

// ---------- Les légendes ----------

const LEGEND_HINT = "A legend is a story told for generations. It mixes real places or people with imaginary events.";

const LEGEND_PASSAGE = {
  type: "passage" as const,
  title: "Le lac qui chantait",
  paragraphs: [
    "On raconte qu'autrefois, un lac chantait chaque soir au coucher du soleil. Un vieux pêcheur, nommé Étienne, venait l'écouter.",
    "Un soir, le lac s'est tu. Étienne a compris que les gens ne prenaient plus le temps d'écouter.",
    "Depuis, on dit que le lac chante seulement pour ceux qui savent se taire.",
  ],
};

const LEGENDS: FrItem[] = [
  ["Qu'est-ce qu'une légende?", "Un récit transmis de génération en génération, mêlant réel et imaginaire", ["Un texte qui donne l'horaire d'un autobus", "Un article de journal sur le sport"], LEGEND_HINT, "📜"],
  ["Qu'est-ce que la tradition orale?", "Des histoires racontées de bouche à oreille, de génération en génération", ["Des histoires écrites seulement dans des livres", "Des histoires inventées en une heure"], "Oral tradition keeps stories, knowledge and values alive by telling them aloud.", "🗣️"],
  ["Pourquoi les histoires orales ont-elles souvent des répétitions?", "Pour aider à écouter et à se souvenir", ["Pour allonger le texte", "Parce que le conteur a oublié"], "Repetition helps listeners follow along and remember the story.", "🔁"],
  ["Plusieurs communautés des Premières Nations transmettent leurs histoires oralement. Pourquoi est-ce important?", "Pour garder vivants la langue, les savoirs et les valeurs", ["Parce qu'elles n'ont pas de livres", "Pour vendre des histoires"], "Stories are a way to share language, knowledge and values with the next generation.", "🌲"],
  ["Les histoires des Premières Nations sont-elles toutes pareilles?", "Non, chaque Nation a ses propres histoires", ["Oui, elles sont toutes pareilles", "Oui, il n'y en a que deux"], "There are many First Nations, each with its own languages, histories and stories.", "🌎"],
  ["Dans « Le lac qui chantait », quel élément est imaginaire?", "Un lac qui chante", ["Un pêcheur", "Le coucher du soleil"], LEGEND_HINT, LEGEND_PASSAGE],
  ["Dans « Le lac qui chantait », quelle leçon la légende donne-t-elle?", "Il faut prendre le temps d'écouter", ["Il faut pêcher plus de poissons", "Il faut éviter les lacs"], LEGEND_HINT, LEGEND_PASSAGE],
  ["Quelle expression annonce souvent une légende?", "On raconte qu'autrefois…", ["Voici la recette du jour", "Selon le bulletin météo…"], LEGEND_HINT, LEGEND_PASSAGE],
  ["Une légende et un conte sont différents parce que la légende…", "se rattache souvent à un lieu ou à une personne réels", ["n'a jamais de personnages", "est toujours un poème"], LEGEND_HINT, "🏞️"],
];

// ---------- Quand et où? ----------

const IND_HINT = "Time clues (le lendemain, soudain, pendant ce temps) tell when. Place clues (au sommet, derrière la maison) tell where.";

const INDICATORS: FrItem[] = [
  ["Dans « Le lendemain, Léa est partie vers la montagne. », « Le lendemain » indique…", "le temps", ["le lieu", "la manière"], IND_HINT],
  ["Dans « Au sommet de la colline, un vieil arbre se dressait. », « Au sommet de la colline » indique…", "le lieu", ["le temps", "la cause"], IND_HINT],
  ["Dans « Soudain, un bruit a retenti. », « Soudain » indique…", "le temps", ["le lieu", "la manière"], IND_HINT],
  ["Dans « Derrière la maison, il y avait un puits. », « Derrière la maison » indique…", "le lieu", ["le temps", "la cause"], IND_HINT],
  ["Dans « Pendant ce temps, Amir préparait le repas. », « Pendant ce temps » indique…", "le temps", ["le lieu", "la manière"], IND_HINT],
  ["Dans « Dans la forêt, les arbres étaient très hauts. », « Dans la forêt » indique…", "le lieu", ["le temps", "la cause"], IND_HINT],
  ["Dans « Au bout d'une heure, ils sont arrivés. », « Au bout d'une heure » indique…", "le temps", ["le lieu", "la manière"], IND_HINT],
  ["Dans « Là-bas, près du lac, un feu brûlait. », « Là-bas, près du lac » indique…", "le lieu", ["le temps", "la cause"], IND_HINT],
  ["Quel mot indique un moment dans le temps?", "autrefois", ["partout", "doucement"], IND_HINT],
  ["Quel mot indique un endroit?", "ici", ["bientôt", "rapidement"], IND_HINT],
  ["Quelle phrase se passe dans le futur?", "Demain, nous irons au parc.", ["Hier, nous sommes allés au parc.", "Autrefois, nous allions au parc."], IND_HINT],
];

// ---------- Le roman jeunesse ----------

const NOVEL_HINT = "In a youth novel, the main character faces a problem (the plot) in a setting. The theme is the big idea behind the story, such as friendship or courage.";

const NOVEL_PASSAGE_1 = {
  type: "passage" as const,
  title: "Une nouvelle école",
  paragraphs: [
    "Zoé déménage dans une nouvelle ville. À l'école, elle ne connaît personne. Un matin, un élève lui offre de s'asseoir avec lui. Peu à peu, elle se fait un ami.",
  ],
};

const NOVEL_PASSAGE_2 = {
  type: "passage" as const,
  title: "Le grand défi",
  paragraphs: [
    "Kenji a peur de l'eau profonde, mais le cours de natation final approche. Chaque soir, il s'entraîne un peu plus. Le grand jour, il saute et nage jusqu'au bord. Il est fier de lui.",
  ],
};

const NOVELS: FrItem[] = [
  ["Quel est le problème de Zoé?", "Elle ne connaît personne", ["Elle perd son livre", "Elle a peur de l'eau"], NOVEL_HINT, NOVEL_PASSAGE_1],
  ["Quel est le thème de l'extrait de Zoé?", "L'amitié", ["La guerre", "Le sport"], NOVEL_HINT, NOVEL_PASSAGE_1],
  ["Où se passe l'extrait de Zoé?", "Dans une nouvelle ville et à l'école", ["Dans une forêt", "Sur la Lune"], NOVEL_HINT, NOVEL_PASSAGE_1],
  ["Quel est le problème de Kenji?", "Il a peur de l'eau profonde", ["Il est en retard", "Il n'a pas d'amis"], NOVEL_HINT, NOVEL_PASSAGE_2],
  ["Quel est le thème de l'extrait de Kenji?", "Le courage", ["La jalousie", "Le voyage"], NOVEL_HINT, NOVEL_PASSAGE_2],
  ["Comment se termine l'histoire de Kenji?", "Il réussit et il est fier", ["Il abandonne", "Il déménage"], NOVEL_HINT, NOVEL_PASSAGE_2],
  ["Qui est le personnage principal du texte sur Kenji?", "Kenji", ["Zoé", "Le maître-nageur"], NOVEL_HINT, NOVEL_PASSAGE_2],
  ["Qu'est-ce qu'un chapitre?", "Une grande partie d'un roman", ["Le titre du livre", "La dernière phrase"], NOVEL_HINT, "📘"],
  ["Qu'est-ce que le cadre d'une histoire?", "Le lieu et l'époque où elle se passe", ["Le nom de l'auteur", "Le nombre de pages"], NOVEL_HINT, "🗺️"],
  ["Qu'est-ce que l'intrigue?", "La suite des événements qui forment l'histoire", ["Le titre de l'histoire", "Le dessin sur la couverture"], NOVEL_HINT, "🧩"],
];

// ---------- Les marqueurs de relation ----------

const MARK_HINT = "Linking words: parce que / car (cause), donc / alors (consequence), mais / pourtant (opposition), de plus (addition), d'abord / puis / enfin (order).";

const MARKERS: FrItem[] = [
  ["Complète : Il pleut, ___ je prends mon parapluie.", "donc", ["parce que", "pourtant", "de plus"], MARK_HINT],
  ["Complète : Je prends mon parapluie ___ il pleut.", "parce que", ["donc", "pourtant", "de plus"], MARK_HINT],
  ["Complète : Elle est petite, ___ elle saute très haut.", "pourtant", ["donc", "parce que", "enfin"], MARK_HINT],
  ["Complète : Il aime lire. ___, il écrit des poèmes.", "De plus", ["Pourtant", "Donc", "Parce que"], MARK_HINT],
  ["Complète : ___, je prépare la pâte. Ensuite, je fais cuire les crêpes.", "D'abord", ["Enfin", "Pourtant", "Donc"], MARK_HINT],
  ["Complète : Nous avons marché longtemps. ___, nous sommes arrivés au sommet.", "Enfin", ["D'abord", "Parce que", "Pourtant"], MARK_HINT],
  ["Dans « Il est malade, donc il reste à la maison », « donc » montre…", "la conséquence", ["la cause", "l'opposition"], MARK_HINT],
  ["Dans « Il reste à la maison parce qu'il est malade », « parce que » montre…", "la cause", ["la conséquence", "l'opposition"], MARK_HINT],
  ["Dans « Il fait froid, pourtant elle sort sans manteau », « pourtant » montre…", "l'opposition", ["la cause", "l'addition"], MARK_HINT],
  ["Complète : Je voulais sortir, ___ il pleuvait trop.", "mais", ["donc", "de plus", "parce que"], MARK_HINT],
];

// ---------- Reformuler l'idée principale ----------

const SUM_HINT = "A good summary gives the main idea in your own words. It is not just one detail, and it is not so general that it could fit any text.";

const BEAVER = {
  type: "passage" as const,
  title: "Le castor",
  paragraphs: [
    "Le castor est le plus gros rongeur d'Amérique du Nord. Il construit des barrages avec des branches et de la boue. Ces barrages forment des étangs où il bâtit sa hutte. Les étangs aident aussi d'autres animaux, comme les canards et les grenouilles.",
  ],
};

const RECYCLE = {
  type: "passage" as const,
  title: "Le recyclage",
  paragraphs: [
    "Chaque année, nous jetons beaucoup d'emballages. Le recyclage permet de transformer le papier, le verre et le métal en nouveaux objets. Il réduit les déchets et économise de l'énergie. Pour bien recycler, il faut trier à la maison.",
  ],
};

const SLEEP = {
  type: "passage" as const,
  title: "Le sommeil",
  paragraphs: [
    "Les enfants de ton âge ont besoin d'entre neuf et douze heures de sommeil. Pendant la nuit, le corps se repose et le cerveau range ce qu'on a appris. Se coucher à la même heure chaque soir aide à mieux dormir.",
  ],
};

const SUMMARIES: FrItem[] = [
  ["Quel est le meilleur résumé du texte?", "Le castor construit des barrages qui créent des étangs utiles à lui et à d'autres animaux.", ["Le castor est un gros rongeur.", "Les canards et les grenouilles vivent dans les étangs.", "Les animaux aiment l'eau."], SUM_HINT, BEAVER],
  ["Quel est le meilleur résumé du texte?", "Le recyclage réduit les déchets et économise de l'énergie si on trie bien.", ["On jette beaucoup d'emballages.", "Le verre est un matériau.", "Il faut jeter ses déchets."], SUM_HINT, RECYCLE],
  ["Quel est le meilleur résumé du texte?", "Dormir assez aide le corps et le cerveau, et une heure de coucher régulière aide à bien dormir.", ["Le corps se repose.", "Les enfants vont à l'école.", "Il faut dormir tout le temps."], SUM_HINT, SLEEP],
  ["Quelle phrase est un détail (une idée secondaire)?", "Les canards et les grenouilles profitent des étangs.", ["Le castor construit des barrages qui créent des étangs.", "Les castors changent leur environnement."], SUM_HINT, BEAVER],
  ["Quelle phrase est un détail (une idée secondaire)?", "Le papier, le verre et le métal peuvent être recyclés.", ["Le recyclage réduit les déchets.", "Le recyclage est utile pour l'environnement."], SUM_HINT, RECYCLE],
  ["Quelle phrase est un détail (une idée secondaire)?", "Le cerveau range ce qu'on a appris pendant la nuit.", ["Le sommeil est important pour les enfants.", "Dormir aide le corps et l'esprit."], SUM_HINT, SLEEP],
];

export const course: Course = {
  grade: "6",
  subject: "immersion",
  bigIdeas: {
    "ca-bc": [
      "The impact of a message largely depends on the author's word choices and style.",
      "Discovering other cultures encourages us to examine our own mores and values.",
      "Asking questions allows us to connect ideas and develop our ability to think critically.",
      "The author transports the audience to a unique world that is a reflection of the former's experiences and imagination.",
      "Reflecting on the form of the language improves the coherence of the message.",
    ],
  },
  units: [
    {
      id: "imparfait-ou-passe-compose",
      title: "Imparfait ou passé composé?",
      emoji: "⏳",
      blurb: "Choisir le bon temps",
      parentNote: "Choosing between the imparfait (description, habits) and the passé composé (completed events), including verbs that take être.",
      standards: { "ca-bc": "Language elements: agreement of tenses (imparfait and passé composé)" },
      generate: (o) => frQuestions(TENSES, o, 8, FR),
    },
    {
      id: "familles-de-mots",
      title: "Racines et préfixes",
      emoji: "🌱",
      blurb: "Les familles de mots",
      parentNote: "Using word roots, prefixes and suffixes to work out the meaning of unfamiliar French words.",
      standards: { "ca-bc": "Language elements: the roots of words and affixes (prefixes and suffixes)" },
      generate: (o) => frQuestions(WORD_FAMILY, o, 8, FR),
    },
    {
      id: "legendes",
      title: "Les légendes",
      emoji: "📜",
      blurb: "Récits d'autrefois",
      parentNote: "Features of legends and the role of oral tradition, including that First Nations have many distinct stories and ways of telling them.",
      standards: { "ca-bc": "Literary elements: characteristics of the legend; elements of oral tradition; structure of legends" },
      generate: (o) => frQuestions(LEGENDS, o, 8, FR),
    },
    {
      id: "temps-et-lieux",
      title: "Quand et où?",
      emoji: "🧭",
      blurb: "Indicateurs de temps et de lieu",
      parentNote: "Spotting spatial and temporal clues in a text to picture the setting and follow the order of events.",
      standards: { "ca-bc": "Text organization: spatial and temporal indicators" },
      generate: (o) => frQuestions(INDICATORS, o, 8, FR),
    },
    {
      id: "roman-jeunesse",
      title: "Le roman jeunesse",
      emoji: "📘",
      blurb: "Personnages, intrigue, thème",
      parentNote: "Features of a youth novel: main character, setting, plot, theme and chapters.",
      standards: { "ca-bc": "Literary elements: characteristics of the youth novel; narrative structure" },
      generate: (o) => frQuestions(NOVELS, o, 8, FR),
    },
    {
      id: "marqueurs-de-relation",
      title: "Relier les idées",
      emoji: "🔗",
      blurb: "Donc, parce que, pourtant",
      parentNote: "Linking words that show cause, consequence, opposition, addition and order.",
      standards: { "ca-bc": "Text organization: transitions between ideas (discourse markers)" },
      generate: (o) => frQuestions(MARKERS, o, 8, FR),
    },
    {
      id: "resumer",
      title: "Résumer un texte",
      emoji: "📝",
      blurb: "L'idée principale",
      parentNote: "Reformulating the main idea of an informational text and telling it from supporting details.",
      standards: { "ca-bc": "Reformulate the main idea in a text; structure of informational texts (thematic progression)" },
      generate: (o) => frQuestions(SUMMARIES, o, 6, FR),
    },
  ],
};
