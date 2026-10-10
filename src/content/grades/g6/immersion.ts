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
  ["Complète : Hier soir, nous ___ une pizza. (commander)", "avons commandé", ["commandions", "commandons", "commanderons"], TENSE_HINT],
  ["Complète : Quand j'avais six ans, je ___ toujours mon doudou. (garder)", "gardais", ["ai gardé", "garde", "garderai"], TENSE_HINT],
  ["Complète : Samedi dernier, Ravi ___ une affiche. (dessiner)", "a dessiné", ["dessinait", "dessine", "dessinera"], TENSE_HINT],
  ["Complète : La nuit était calme et la lune ___ . (briller)", "brillait", ["a brillé", "brille", "brillera"], TENSE_HINT],
  ["Complète : Elle est tombée parce qu'elle ___ trop vite. (courir)", "courait", ["a couru", "court", "courra"], TENSE_HINT],
  ["Complète : Hier, Noah ___ chez sa tante. (partir)", "est parti", ["a parti", "partait", "part"], "Partir uses “être” in the passé composé, and the participle agrees with the subject: Noah est parti."],
  ["Complète : Pendant que papa cuisinait, nous ___ la table. (mettre)", "mettions", ["avons mis", "mettons", "mettrons"], TENSE_HINT],
  ["Complète : Un jour, un renard ___ dans le village. (entrer)", "est entré", ["entrait", "entre", "entrera"], TENSE_HINT],
  ["Complète : Autrefois, ma tante ___ du pain tous les dimanches. (faire)", "faisait", ["a fait", "fait", "fera"], "“Autrefois … tous les dimanches” shows a habit in the past, so we use the imparfait."],
  ["Complète : Hier, j'___ mes devoirs avant le souper. (finir)", "ai fini", ["finissais", "finis", "finirai"], TENSE_HINT],
  ["Complète : Il y ___ beaucoup de neige quand nous sommes arrivés. (avoir)", "avait", ["a eu", "a", "aura"], TENSE_HINT],
  ["Complète : Tout à coup, les lumières ___ . (s'éteindre)", "se sont éteintes", ["s'éteignaient", "s'éteignent", "s'éteindront"], "Pronominal verbs use “être” in the passé composé, and the participle agrees with the subject: les lumières se sont éteintes."],
  ["Complète : Le chat dormait quand le téléphone ___ . (sonner)", "a sonné", ["sonnait", "sonne", "sonnera"], TENSE_HINT],
  ["Complète : Lundi dernier, mes amis ___ au parc. (aller)", "sont allés", ["allaient", "vont", "iront"], "Aller uses “être” in the passé composé, and the participle agrees with the subject: mes amis sont allés."],
  ["Complète : Quand elle était jeune, Mamie ___ sur une ferme et elle se levait tôt. (vivre)", "vivait", ["a vécu", "vit", "vivra"], TENSE_HINT],
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
  ["Quel mot est de la famille de « fleur »?", "fleuriste", ["flâner", "fluide"], ROOT_HINT, "🌸"],
  ["Quel mot est de la famille de « neige »?", "enneigé", ["nager", "nuage"], ROOT_HINT, "❄️"],
  ["Quel mot est de la famille de « mer »?", "marin", ["merci", "mère"], ROOT_HINT, "🌊"],
  ["Quel mot est de la famille de « chant »?", "chanteur", ["champ", "chanceux"], ROOT_HINT, "🎤"],
  ["Quel mot est de la famille de « jardin »?", "jardinier", ["jargon", "jaune"], ROOT_HINT, "🌻"],
  ["Quel mot est de la famille de « lune »?", "lunaire", ["lutin", "ruine"], ROOT_HINT, "🌙"],
  ["Quel mot est de la famille de « soleil »?", "ensoleillé", ["solide", "sommeil"], ROOT_HINT, "☀️"],
  ["Que veut dire le préfixe « re- » dans « refaire »?", "encore", ["jamais", "contre"], ROOT_HINT, "🔄"],
  ["Que veut dire le préfixe « bi- » dans « bicyclette »?", "deux", ["trois", "un"], ROOT_HINT, "🚲"],
  ["Que veut dire le préfixe « télé- » dans « téléphone »?", "loin", ["sous", "avec"], ROOT_HINT, "📞"],
  ["Que veut dire le préfixe « co- » dans « coéquipier »?", "avec", ["contre", "sans"], ROOT_HINT, "🤝"],
  ["Que veut dire le suffixe « -eur » dans « chanteur »?", "celui qui fait", ["l'action de", "qui peut être"], ROOT_HINT, "🎶"],
  ["Que veut dire le suffixe « -ette » dans « maisonnette »?", "plus petit", ["plus grand", "pas"], ROOT_HINT, "🏠"],
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

const GIANT_PASSAGE = {
  type: "passage" as const,
  title: "Le géant de la montagne",
  paragraphs: [
    "On raconte que, dans la vallée, un géant dormait sous la montagne. Quand il ronflait, la terre tremblait.",
    "Un jour, un enfant nommé Léo lui a apporté du pain. Le géant a souri et s'est rendormi doucement.",
    "Depuis, on entend parfois un ronflement lointain, mais la terre ne tremble presque plus.",
  ],
};

const LIGHT_PASSAGE = {
  type: "passage" as const,
  title: "La lumière du phare",
  paragraphs: [
    "On raconte qu'une lanterne s'allumait toute seule sur le rocher quand un bateau était en danger. Les marins disaient que la lumière était un cadeau de la mer.",
    "Même aujourd'hui, certains villages de pêcheurs gardent cette histoire vivante.",
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
  ["Dans « Le géant de la montagne », quel élément est imaginaire?", "Un géant qui dort sous la montagne", ["Une vallée", "Un enfant"], LEGEND_HINT, GIANT_PASSAGE],
  ["Selon la légende, pourquoi la terre tremblait-elle?", "Parce que le géant ronflait", ["Parce qu'il pleuvait", "Parce que le village dansait"], LEGEND_HINT, GIANT_PASSAGE],
  ["Qui a calmé le géant?", "Un enfant nommé Léo", ["Un pêcheur", "Un roi"], LEGEND_HINT, GIANT_PASSAGE],
  ["Que cherche à expliquer « Le géant de la montagne »?", "Pourquoi la terre tremble parfois", ["Comment faire du pain", "Comment lire une carte"], LEGEND_HINT, GIANT_PASSAGE],
  ["Dans « La lumière du phare », quel élément est imaginaire?", "Une lanterne qui s'allume seule", ["Des bateaux", "Des marins"], LEGEND_HINT, LIGHT_PASSAGE],
  ["Que représente la lanterne dans « La lumière du phare »?", "Une aide pour les bateaux en danger", ["Un jouet pour les enfants", "Un signal de fête"], LEGEND_HINT, LIGHT_PASSAGE],
  ["Pourquoi cette légende est-elle encore racontée aujourd'hui?", "Elle fait partie de la mémoire du village", ["Elle vient d'être inventée", "Elle est une recette"], LEGEND_HINT, LIGHT_PASSAGE],
  ["Qui transmet souvent les légendes?", "Un conteur ou une conteuse", ["Un horaire d'autobus", "Un robot"], LEGEND_HINT, "🎙️"],
  ["Quelle partie d'une légende est souvent réelle?", "Le lieu où elle se passe", ["Les créatures magiques", "Les pouvoirs étonnants"], LEGEND_HINT, "📍"],
  ["Pourquoi raconte-t-on des légendes?", "Pour expliquer le monde ou transmettre des valeurs", ["Pour annoncer la météo", "Pour vendre des produits"], LEGEND_HINT, "🌟"],
  ["Quel début convient à une légende?", "Il y a très longtemps, dit-on, un village vivait au bord du fleuve…", ["Ingrédients : deux œufs et du lait", "Résultat du match : 3 à 2"], LEGEND_HINT, "🏘️"],
  ["Qu'est-ce qu'un héros de légende?", "Un personnage courageux qui accomplit des actions extraordinaires", ["Le titre du livre", "Un personnage qui ne fait jamais rien"], LEGEND_HINT, "🦸"],
  ["Pourquoi une légende change-t-elle un peu d'un conteur à l'autre?", "Parce qu'elle est racontée de bouche à oreille", ["Parce qu'elle est imprimée", "Parce qu'elle est trop courte"], "When a story is told aloud again and again, each storyteller adds their own voice and details.", "👂"],
  ["Une aînée d'une communauté partage une histoire. Que fais-tu?", "J'écoute avec respect sans l'interrompre", ["Je ris pendant l'histoire", "Je raconte l'histoire à ma façon sans demander"], "Stories belong to the people and communities who carry them. We listen with respect and ask before sharing.", "🙏"],
  ["Que veut dire « se transmettre de génération en génération »?", "Passer des grands-parents aux enfants, puis aux petits-enfants", ["S'écrire en une seule fois", "Être oublié tout de suite"], LEGEND_HINT, "👨‍👩‍👧‍👦"],
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
  ["Dans « Hier soir, Kenji a joué du piano. », « Hier soir » indique…", "le temps", ["le lieu", "la manière"], IND_HINT],
  ["Dans « Sous le lit, un chat dormait. », « Sous le lit » indique…", "le lieu", ["le temps", "la cause"], IND_HINT],
  ["Dans « Plus tard, ils ont mangé des fruits. », « Plus tard » indique…", "le temps", ["le lieu", "la cause"], IND_HINT],
  ["Dans « Au loin, une cloche a sonné. », « Au loin » indique…", "le lieu", ["le temps", "la manière"], IND_HINT],
  ["Dans « Pendant l'été, la famille campe au bord du lac. », « Pendant l'été » indique…", "le temps", ["le lieu", "la cause"], IND_HINT],
  ["Dans « Près de la rivière, des enfants jouaient. », « Près de la rivière » indique…", "le lieu", ["le temps", "la manière"], IND_HINT],
  ["Dans « En ce moment, Zoé lit dans sa chambre. », « En ce moment » indique…", "le temps", ["le lieu", "la cause"], IND_HINT],
  ["Dans « À l'intérieur, il faisait chaud. », « À l'intérieur » indique…", "le lieu", ["le temps", "la manière"], IND_HINT],
  ["Dans « Chaque matin, Ravi promène son chien. », « Chaque matin » indique…", "le temps", ["le lieu", "la cause"], IND_HINT],
  ["Dans « En haut de l'escalier, une porte s'ouvre. », « En haut de l'escalier » indique…", "le lieu", ["le temps", "la manière"], IND_HINT],
  ["Dans « Au centre de la ville, il y a une grande place. », « Au centre de la ville » indique…", "le lieu", ["le temps", "la cause"], IND_HINT],
  ["Dans « Tout à coup, la lumière s'est éteinte. », « Tout à coup » indique…", "le temps", ["le lieu", "la manière"], IND_HINT],
  ["Quel mot indique un moment dans le temps?", "demain", ["loin", "dedans"], IND_HINT],
  ["Quelle phrase se passe dans le passé?", "Hier, nous avons visité le zoo.", ["Demain, nous visiterons le zoo.", "Bientôt, nous visiterons le zoo."], IND_HINT],
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

const NOVEL_PASSAGE_3 = {
  type: "passage" as const,
  title: "Le chien perdu",
  paragraphs: [
    "Noah trouve un petit chien perdu près de l'école. Il ne sait pas à qui il appartient. Il colle des affiches dans le quartier et il attend. Trois jours plus tard, une dame téléphone : c'est son chien! Noah est triste de le rendre, mais heureux de l'avoir aidée.",
  ],
};

const NOVEL_PASSAGE_4 = {
  type: "passage" as const,
  title: "Le grand match",
  paragraphs: [
    "Ana joue au soccer, mais elle rate un tir devant tout le monde. Elle veut tout abandonner. Sa coéquipière Priya lui dit que tout le monde rate parfois. Au match suivant, Ana essaie de nouveau et marque un but.",
  ],
};

const NOVEL_PASSAGE_5 = {
  type: "passage" as const,
  title: "Le secret du grenier",
  paragraphs: [
    "Amir et sa cousine Zoé explorent le grenier de leur grand-mère. Dans une vieille boîte, ils trouvent une carte dessinée à la main. Ils suivent les indices dans le jardin et découvrent un coffre rempli de vieilles photos. Leur grand-mère sourit : c'est son trésor.",
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
  ["Quel est le problème de Noah?", "Il doit retrouver le propriétaire du chien", ["Il a perdu ses clés", "Il est en retard"], NOVEL_HINT, NOVEL_PASSAGE_3],
  ["Quel est le thème de l'extrait de Noah?", "L'entraide", ["La peur", "La compétition"], NOVEL_HINT, NOVEL_PASSAGE_3],
  ["Comment Noah se sent-il à la fin?", "Triste et heureux à la fois", ["Seulement fâché", "Ennuyé"], NOVEL_HINT, NOVEL_PASSAGE_3],
  ["Qu'est-ce qui règle le problème de Noah?", "Une dame téléphone après avoir vu les affiches", ["Le chien rentre seul", "Noah garde le chien"], NOVEL_HINT, NOVEL_PASSAGE_3],
  ["Quel est le problème d'Ana?", "Elle a raté un tir et veut abandonner", ["Elle est en retard", "Elle a perdu son ballon"], NOVEL_HINT, NOVEL_PASSAGE_4],
  ["Quel est le thème de l'extrait d'Ana?", "La persévérance", ["Le voyage", "La jalousie"], NOVEL_HINT, NOVEL_PASSAGE_4],
  ["Qui encourage Ana?", "Priya", ["Kenji", "Son entraîneur"], NOVEL_HINT, NOVEL_PASSAGE_4],
  ["Que fait Ana au match suivant?", "Elle essaie de nouveau et marque un but", ["Elle reste sur le banc", "Elle change de sport"], NOVEL_HINT, NOVEL_PASSAGE_4],
  ["Où commence l'aventure d'Amir et de Zoé?", "Dans le grenier de leur grand-mère", ["Dans une école", "Sur un bateau"], NOVEL_HINT, NOVEL_PASSAGE_5],
  ["Que trouvent Amir et Zoé dans le coffre?", "De vieilles photos", ["De l'or", "Un chat"], NOVEL_HINT, NOVEL_PASSAGE_5],
  ["Quel est le thème de l'extrait d'Amir et de Zoé?", "Les souvenirs de famille", ["La guerre", "Le sport"], NOVEL_HINT, NOVEL_PASSAGE_5],
  ["Quel type d'histoire est l'extrait d'Amir et de Zoé?", "Un récit d'aventure et de mystère", ["Un article de journal", "Un mode d'emploi"], NOVEL_HINT, NOVEL_PASSAGE_5],
  ["Qu'est-ce qu'un narrateur?", "Celui qui raconte l'histoire", ["Le dessinateur du livre", "Le titre du chapitre"], NOVEL_HINT, "🎙️"],
  ["Qu'est-ce que le dénouement?", "La fin, où le problème se règle", ["Le début de l'histoire", "Le nom de l'auteur"], NOVEL_HINT, "🏁"],
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
  ["Complète : Je suis fatigué, ___ je vais me coucher tôt.", "donc", ["parce que", "pourtant", "d'abord"], MARK_HINT],
  ["Complète : Ils ont gagné ___ ils se sont bien entraînés.", "parce qu'", ["donc", "pourtant", "enfin"], MARK_HINT],
  ["Complète : Il est riche, ___ il n'est pas heureux.", "pourtant", ["donc", "parce que", "de plus"], MARK_HINT],
  ["Complète : Cette école a une piscine. ___, elle a un grand gymnase.", "De plus", ["Pourtant", "Donc", "Parce que"], MARK_HINT],
  ["Complète : Pour planter une graine, il faut ___ creuser un petit trou.", "d'abord", ["enfin", "pourtant", "parce que"], MARK_HINT],
  ["Complète : Il n'a pas dormi, ___ il est très fatigué.", "donc", ["pourtant", "parce que", "de plus"], MARK_HINT],
  ["Dans « Elle aime le sport, mais elle déteste courir », « mais » montre…", "l'opposition", ["la cause", "l'addition"], MARK_HINT],
  ["Dans « Il neige, alors nous portons des tuques », « alors » montre…", "la conséquence", ["la cause", "l'opposition"], MARK_HINT],
  ["Dans « Il a pleuré car il avait perdu son jouet », « car » montre…", "la cause", ["la conséquence", "l'ordre"], MARK_HINT],
  ["Dans « De plus, il parle trois langues », « De plus » montre…", "l'addition", ["l'opposition", "la cause"], MARK_HINT],
  ["Dans « D'abord, lave-toi les mains », « D'abord » montre…", "l'ordre des actions", ["la cause", "l'opposition"], MARK_HINT],
  ["Quel mot ajoute une idée?", "de plus", ["pourtant", "parce que"], MARK_HINT],
  ["Quel mot exprime l'opposition?", "pourtant", ["donc", "enfin"], MARK_HINT],
  ["Quel mot annonce la fin d'une suite d'actions?", "enfin", ["d'abord", "de plus"], MARK_HINT],
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

const BEES = {
  type: "passage" as const,
  title: "Les abeilles",
  paragraphs: [
    "Les abeilles vivent dans une ruche et chacune a un travail. Certaines récoltent le nectar des fleurs, d'autres s'occupent des petites. En visitant les fleurs, elles transportent le pollen, ce qui aide les plantes à produire des fruits. Sans abeilles, nous aurions moins de pommes et de bleuets.",
  ],
};

const LIBRARY = {
  type: "passage" as const,
  title: "La bibliothèque",
  paragraphs: [
    "La bibliothèque de quartier offre bien plus que des livres. On peut y emprunter des films, des jeux de société et même des instruments de musique. Des ateliers gratuits y sont organisés chaque semaine. Tout cela est accessible avec une simple carte.",
  ],
};

const MAPLE = {
  type: "passage" as const,
  title: "L'érable",
  paragraphs: [
    "Au printemps, quand la sève de l'érable coule, on peut fabriquer du sirop. En été, l'arbre fait de l'ombre. À l'automne, ses feuilles deviennent rouges. En hiver, il se repose. À chaque saison, l'érable change et nous offre quelque chose.",
  ],
};

const BIKE = {
  type: "passage" as const,
  title: "Le vélo en ville",
  paragraphs: [
    "Se déplacer à vélo est bon pour la santé et pour la planète. Le vélo ne produit pas de fumée et il coûte peu. Dans certaines villes, des pistes cyclables rendent les trajets plus sûrs. Il faut toujours porter un casque.",
  ],
};

const VOLCANO = {
  type: "passage" as const,
  title: "Les volcans",
  paragraphs: [
    "Un volcan est une ouverture dans la croûte terrestre par où sort de la roche fondue, appelée lave. Certains volcans dorment pendant des siècles. D'autres entrent souvent en éruption. Les scientifiques surveillent les volcans pour prévenir les gens qui vivent tout près.",
  ],
};

const TEAM = {
  type: "passage" as const,
  title: "Le jeu d'équipe",
  paragraphs: [
    "Dans un sport d'équipe, chaque joueur compte. On apprend à s'encourager, à partager le ballon et à accepter de perdre. Les équipes qui communiquent bien gagnent souvent plus de matchs. Mais le plus important reste le plaisir de jouer ensemble.",
  ],
};

const SUMMARIES: FrItem[] = [
  ["Quel est le meilleur résumé du texte?", "Le castor construit des barrages qui créent des étangs utiles à lui et à d'autres animaux.", ["Le castor est un gros rongeur.", "Les canards et les grenouilles vivent dans les étangs.", "Les animaux aiment l'eau."], SUM_HINT, BEAVER],
  ["Quel est le meilleur résumé du texte?", "Le recyclage réduit les déchets et économise de l'énergie si on trie bien.", ["On jette beaucoup d'emballages.", "Le verre est un matériau.", "Il faut jeter ses déchets."], SUM_HINT, RECYCLE],
  ["Quel est le meilleur résumé du texte?", "Dormir assez aide le corps et le cerveau, et une heure de coucher régulière aide à bien dormir.", ["Le corps se repose.", "Les enfants vont à l'école.", "Il faut dormir tout le temps."], SUM_HINT, SLEEP],
  ["Quelle phrase est un détail (une idée secondaire)?", "Les canards et les grenouilles profitent des étangs.", ["Le castor construit des barrages qui créent des étangs.", "Les castors changent leur environnement."], SUM_HINT, BEAVER],
  ["Quelle phrase est un détail (une idée secondaire)?", "Le papier, le verre et le métal peuvent être recyclés.", ["Le recyclage réduit les déchets.", "Le recyclage est utile pour l'environnement."], SUM_HINT, RECYCLE],
  ["Quelle phrase est un détail (une idée secondaire)?", "Le cerveau range ce qu'on a appris pendant la nuit.", ["Le sommeil est important pour les enfants.", "Dormir aide le corps et l'esprit."], SUM_HINT, SLEEP],
  ["Quel est le meilleur résumé du texte?", "Les abeilles travaillent en équipe et aident les plantes à produire des fruits.", ["Les abeilles vivent dans une ruche.", "Les pommes et les bleuets sont des fruits."], SUM_HINT, BEES],
  ["Quelle phrase est un détail (une idée secondaire)?", "Certaines abeilles s'occupent des petites.", ["Les abeilles sont utiles à la nature.", "Le travail des abeilles aide les plantes."], SUM_HINT, BEES],
  ["Quel titre convient le mieux à ce texte?", "Des abeilles précieuses", ["Une ruche vide", "La recette des bleuets"], SUM_HINT, BEES],
  ["Quel est le meilleur résumé du texte?", "La bibliothèque offre de nombreux services gratuits en plus des livres.", ["On peut emprunter des livres.", "Il y a des ateliers chaque semaine."], SUM_HINT, LIBRARY],
  ["Quelle phrase est un détail (une idée secondaire)?", "On peut même emprunter des instruments de musique.", ["La bibliothèque offre beaucoup de services.", "La bibliothèque est utile à tout le quartier."], SUM_HINT, LIBRARY],
  ["Quel titre convient le mieux à ce texte?", "Plus que des livres", ["Un film à la maison", "La carte perdue"], SUM_HINT, LIBRARY],
  ["Quel est le meilleur résumé du texte?", "L'érable change à chaque saison et offre quelque chose de différent.", ["L'érable fait de l'ombre.", "Le sirop d'érable est sucré."], SUM_HINT, MAPLE],
  ["Quelle phrase est un détail (une idée secondaire)?", "À l'automne, les feuilles de l'érable deviennent rouges.", ["L'érable change au fil de l'année.", "L'érable offre beaucoup à chaque saison."], SUM_HINT, MAPLE],
  ["Quel titre convient le mieux à ce texte?", "L'érable au fil de l'année", ["Un arbre sans feuilles", "La fabrique de sirop"], SUM_HINT, MAPLE],
  ["Quel est le meilleur résumé du texte?", "Le vélo est bon pour la santé et la planète, surtout avec des pistes sûres et un casque.", ["Il faut porter un casque.", "Les villes sont grandes."], SUM_HINT, BIKE],
  ["Quelle phrase est un détail (une idée secondaire)?", "Le vélo coûte peu.", ["Le vélo est bon pour la santé et la planète.", "Le vélo est un moyen de transport."], SUM_HINT, BIKE],
  ["Quel titre convient le mieux à ce texte?", "Pédaler pour la santé et la planète", ["Un casque trop petit", "La ville la plus grande"], SUM_HINT, BIKE],
  ["Quel est le meilleur résumé du texte?", "Les volcans laissent sortir de la lave et les scientifiques les surveillent pour protéger les gens.", ["Les volcans sont des montagnes.", "Certains volcans dorment longtemps."], SUM_HINT, VOLCANO],
  ["Quelle phrase est un détail (une idée secondaire)?", "Certains volcans dorment pendant des siècles.", ["Les volcans sont étudiés pour protéger les gens.", "Les volcans libèrent de la lave."], SUM_HINT, VOLCANO],
  ["Quel titre convient le mieux à ce texte?", "Comprendre les volcans", ["Une recette de lave", "Un voyage en bateau"], SUM_HINT, VOLCANO],
  ["Quel est le meilleur résumé du texte?", "Les sports d'équipe enseignent à coopérer et à s'amuser ensemble, même quand on perd.", ["Il faut partager le ballon.", "Les équipes gagnent plus de matchs."], SUM_HINT, TEAM],
  ["Quelle phrase est un détail (une idée secondaire)?", "Les équipes qui communiquent bien gagnent souvent plus de matchs.", ["Les sports d'équipe apprennent à coopérer.", "Le plaisir de jouer ensemble est important."], SUM_HINT, TEAM],
  ["Quel titre convient le mieux à ce texte?", "Jouer ensemble", ["Un ballon perdu", "Gagner à tout prix"], SUM_HINT, TEAM],
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
