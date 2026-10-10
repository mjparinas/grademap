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
  ["Complète : Cette montagne est ___ haute du pays.", "la plus", ["le plus", "les plus", "très"], SUP_HINT],
  ["Complète : Ce sont ___ beaux jours de l'été.", "les plus", ["le plus", "la plus", "plus"], SUP_HINT],
  ["Complète : Léo est ___ gentil de la classe.", "le plus", ["la plus", "les plus", "très"], SUP_HINT],
  ["Complète : C'est le chemin ___ court.", "le plus", ["la plus", "les plus", "très"], SUP_HINT],
  ["Complète : Cette robe est ___ chère de la boutique. (aucune n'est moins chère)", "la moins", ["le moins", "les moins", "très"], SUP_HINT],
  ["Complète : Parmi les frères, Ravi est ___ âgé. (aucun n'est plus âgé)", "le plus", ["la plus", "les plus", "très"], SUP_HINT],
  ["Complète : Ces exercices sont ___ difficiles du livre. (aucun n'est plus facile)", "les moins", ["le moins", "la moins", "moins"], SUP_HINT],
  ["Complète : Elle court ___ vite de l'équipe.", "le plus", ["la plus", "les plus", "très"], "With an adverb such as “vite”, the superlative is always “le plus”: elle court le plus vite."],
  ["Complète : Ce sont ___ chansons que j'aime. (bon)", "les meilleures", ["les plus bonnes", "les mieux", "le meilleur"], "“Bon” has its own superlative: le meilleur, la meilleure, les meilleurs, les meilleures."],
  ["Complète : Parmi tous les élèves, c'est Maya qui écrit ___ . (bien)", "le mieux", ["le meilleur", "la mieux", "le plus bien"], "The adverb “bien” becomes “le mieux” in the superlative."],
  ["Quelle phrase contient un superlatif relatif?", "C'est le plus grand lac de la région.", ["Ce lac est immense.", "Ce lac est grand."], SUP_HINT],
  ["Quelle phrase contient un superlatif relatif?", "Ana est la moins timide du groupe.", ["Ana est timide.", "Ana est plus timide que Zoé."], SUP_HINT],
  ["Quelle phrase contient un superlatif absolu?", "La nuit était très sombre.", ["C'était la nuit la plus sombre de l'année.", "La nuit était sombre."], SUP_HINT],
  ["Quel mot complète : « C'est la ___ pizza de la ville. » (bonne)", "meilleure", ["plus bonne", "mieux"], "“Bon” has its own superlative: le meilleur, la meilleure."],
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
  ["Complète : Demain, nous ___ au parc d'attractions. (aller)", "irons", ["allons", "sommes allés", "allions"], TENSE_HINT],
  ["Complète : L'été dernier, ils ___ trois semaines en Gaspésie. (passer)", "ont passé", ["passeront", "passaient", "passent"], TENSE_HINT],
  ["Complète : Quand elle était enfant, elle ___ toujours des dessins. (faire)", "faisait", ["a fait", "fait", "fera"], TENSE_HINT],
  ["Complète : En ce moment, Kenji ___ un roman. (lire)", "lit", ["lisait", "a lu", "lira"], TENSE_HINT],
  ["Complète : La semaine prochaine, je ___ mon vélo. (réparer)", "réparerai", ["ai réparé", "réparais", "réparions"], TENSE_HINT],
  ["Complète : Hier soir, il y ___ une panne d'électricité. (avoir)", "a eu", ["avait", "aura", "a"], TENSE_HINT],
  ["Complète : Pendant que nous mangions, le chien ___ sous la table. (dormir)", "dormait", ["a dormi", "dormira", "dort"], TENSE_HINT],
  ["Complète : Il y a longtemps, les villages ___ très petits. (être)", "étaient", ["ont été", "seront", "sont"], TENSE_HINT],
  ["Complète : Ce matin, ma mère ___ le déjeuner à sept heures. (préparer)", "a préparé", ["préparait", "préparera", "prépare"], TENSE_HINT],
  ["Complète : Dans l'avenir, les voitures ___ peut-être toutes électriques. (être)", "seront", ["étaient", "ont été", "sont"], TENSE_HINT],
  ["Complète : L'an dernier, chaque vendredi, notre classe ___ de la lecture à voix haute. (faire)", "faisait", ["a fait", "fera", "fait"], TENSE_HINT],
  ["Complète : Nous marchions dans le parc quand l'orage ___ . (éclater)", "a éclaté", ["éclatait", "éclatera", "éclate"], TENSE_HINT],
  ["Complète : Si tu étudies, tu ___ ton examen. (réussir)", "réussiras", ["as réussi", "réussissais", "réussissons"], "After “si” + présent, the result is in the futur: si tu étudies, tu réussiras."],
  ["Dans la phrase « Demain, il pleuvra. », quel est le temps du verbe?", "Le futur simple", ["L'imparfait", "Le passé composé"], TENSE_HINT],
  ["Dans la phrase « Hier, il pleuvait. », quel est le temps du verbe?", "L'imparfait", ["Le futur simple", "Le passé composé"], TENSE_HINT],
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
  figure("Elle est légère comme une plume.", COMP),
  figure("Ses mains sont froides comme la glace.", COMP),
  figure("Il dort comme un loir.", COMP),
  figure("Cette classe est une ruche.", META),
  figure("Ma grand-mère est un trésor.", META),
  figure("La vie est un long fleuve.", META),
  figure("Le soleil se lève et réveille la ville.", PERS),
  figure("Les nuages pleurent sur le village.", PERS),
  figure("La maison nous attend les bras ouverts.", PERS),
  figure("J'ai une montagne de devoirs à faire.", HYP),
  figure("Ce sac pèse une tonne.", HYP),
  figure("Il m'a répété cent fois la même chose.", HYP),
  ["Quelle figure de style donne des actions humaines à un objet?", "la personnification", ["la comparaison", "l'hyperbole"], FIG_HINT],
  ["Quelle figure de style dit qu'une chose EST une autre, sans « comme »?", "la métaphore", ["la comparaison", "la personnification"], FIG_HINT],
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

const SEA = {
  type: "passage" as const,
  title: "La mer",
  paragraphs: ["La mer chuchote à la plage,\nElle roule ses vagues d'argent.\nLes mouettes dessinent des nuages\nEt s'envolent avec le vent."],
};

const CAT = {
  type: "passage" as const,
  title: "Mon chat",
  paragraphs: ["Mon chat est un petit soleil,\nIl dort au creux de mon fauteuil.\nQuand il ronronne, tout est doux,\nLa maison chante avec nous."],
};

const MORNING = {
  type: "passage" as const,
  title: "Le matin",
  paragraphs: ["Le matin se lève en chantant,\nLe ciel s'habille d'orange et de blanc.\nLe jour commence, grand et doux,\nComme un livre ouvert pour nous."],
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
  ["Quels mots riment dans le poème « La mer »?", "plage et nuages", ["mer et vagues", "mouettes et vent"], POEM_HINT, SEA],
  ["Quels mots riment aussi dans « La mer »?", "argent et vent", ["vagues et mouettes", "roule et chuchote"], POEM_HINT, SEA],
  ["Dans « La mer chuchote à la plage », quelle figure de style est utilisée?", "Une personnification", ["Une comparaison", "Une hyperbole"], POEM_HINT, SEA],
  ["Que désignent « ses vagues d'argent »?", "Des vagues brillantes", ["Des pièces de monnaie", "Des poissons"], "This is a metaphor: the waves shine like silver.", SEA],
  ["Combien de vers y a-t-il dans « La mer »?", "4", ["2", "8"], "Each line of a poem is a vers.", SEA],
  ["Quel est le thème du poème « La mer »?", "La beauté de la mer", ["Une journée d'école", "Un repas en famille"], POEM_HINT, SEA],
  ["Quels mots riment dans le poème « Mon chat »?", "soleil et fauteuil", ["chat et soleil", "doux et chante"], POEM_HINT, CAT],
  ["Quels mots riment aussi dans « Mon chat »?", "doux et nous", ["ronronne et maison", "tout et chante"], POEM_HINT, CAT],
  ["Dans « Mon chat est un petit soleil », quelle figure de style est utilisée?", "Une métaphore", ["Une comparaison", "Une hyperbole"], "A metaphor says one thing IS another, without “comme”.", CAT],
  ["Dans « La maison chante avec nous », quelle figure de style est utilisée?", "Une personnification", ["Une comparaison", "Une hyperbole"], POEM_HINT, CAT],
  ["Quel sentiment domine dans « Mon chat »?", "La tendresse", ["La peur", "La colère"], POEM_HINT, CAT],
  ["Quels mots riment dans le poème « Le matin »?", "chantant et blanc", ["matin et jour", "orange et livre"], POEM_HINT, MORNING],
  ["Quels mots riment aussi dans « Le matin »?", "doux et nous", ["jour et livre", "ciel et ouvert"], POEM_HINT, MORNING],
  ["Dans « Comme un livre ouvert pour nous », quelle figure de style est utilisée?", "Une comparaison", ["Une personnification", "Une hyperbole"], "The word “comme” introduces a comparison.", MORNING],
  ["Dans « Le ciel s'habille d'orange et de blanc », quelle figure de style est utilisée?", "Une personnification", ["Une comparaison", "Une hyperbole"], POEM_HINT, MORNING],
  ["Qu'est-ce qu'un vers libre?", "Un vers sans rime ni mesure obligatoires", ["Un vers qui rime toujours", "Un poème de dix pages"], POEM_HINT, "✍️"],
  ["Qu'est-ce qu'un calligramme?", "Un poème dont les mots forment un dessin", ["Un poème sans mots", "Un poème chanté"], POEM_HINT, "🖼️"],
  ["Pourquoi un poète répète-t-il parfois un mot?", "Pour créer un rythme ou insister sur une émotion", ["Pour remplir la page", "Parce qu'il a oublié"], POEM_HINT, "🔁"],
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

const HOMEWORK = {
  type: "passage" as const,
  title: "Moins de devoirs?",
  paragraphs: [
    "Je crois que les élèves devraient avoir moins de devoirs. D'abord, après l'école, ils ont besoin de jouer et de se reposer. Par exemple, une heure de sport aide à mieux dormir. Ensuite, le temps en famille est précieux. En somme, moins de devoirs donnerait des élèves plus en forme.",
  ],
};

const SCREENS = {
  type: "passage" as const,
  title: "Un jour sans écran",
  paragraphs: [
    "À mon avis, chaque famille devrait avoir un jour sans écran. Premièrement, on se parle davantage. Par exemple, au souper, on raconte sa journée. De plus, on découvre d'autres passe-temps, comme la lecture ou la marche. Pour terminer, un jour sans écran rapproche la famille.",
  ],
};

const BIKES = {
  type: "passage" as const,
  title: "Des vélos à l'école",
  paragraphs: [
    "Il faudrait plus de supports à vélo devant l'école. D'une part, plus d'élèves viendraient à vélo. Par exemple, Ana n'y va pas parce qu'elle craint le vol. D'autre part, moins de voitures passeraient dans la rue. Bref, de nouveaux supports aideraient tout le monde.",
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
  ["Quelle phrase donne l'opinion de l'auteur?", "Je crois que les élèves devraient avoir moins de devoirs.", ["Une heure de sport aide à mieux dormir.", "Le temps en famille est précieux."], ARG_HINT, HOMEWORK],
  ["Quelle phrase est un exemple?", "Une heure de sport aide à mieux dormir.", ["Les élèves ont besoin de jouer et de se reposer.", "Moins de devoirs donnerait des élèves plus en forme."], ARG_HINT, HOMEWORK],
  ["Quelle phrase est la conclusion?", "Moins de devoirs donnerait des élèves plus en forme.", ["Le temps en famille est précieux.", "Les élèves ont besoin de jouer et de se reposer."], ARG_HINT, HOMEWORK],
  ["Quel mot ajoute un deuxième argument?", "Ensuite", ["Par exemple", "En somme"], ARG_HINT, HOMEWORK],
  ["Quels mots annoncent la conclusion?", "En somme", ["D'abord", "Par exemple"], ARG_HINT, HOMEWORK],
  ["Quelle phrase donne l'opinion de l'auteur?", "Chaque famille devrait avoir un jour sans écran.", ["Au souper, on raconte sa journée.", "On découvre d'autres passe-temps."], ARG_HINT, SCREENS],
  ["Quelle phrase est un exemple?", "Au souper, on raconte sa journée.", ["On se parle davantage.", "Un jour sans écran rapproche la famille."], ARG_HINT, SCREENS],
  ["Quelle phrase est la conclusion?", "Un jour sans écran rapproche la famille.", ["On se parle davantage.", "On découvre d'autres passe-temps."], ARG_HINT, SCREENS],
  ["Quel mot annonce le premier argument?", "Premièrement", ["Pour terminer", "Par exemple"], ARG_HINT, SCREENS],
  ["Quel est le premier argument de l'auteur?", "On se parle davantage.", ["Les écrans coûtent cher.", "Il faut acheter un livre."], ARG_HINT, SCREENS],
  ["Quelle phrase donne l'opinion de l'auteur?", "Il faudrait plus de supports à vélo devant l'école.", ["Ana n'y va pas parce qu'elle craint le vol.", "Moins de voitures passeraient dans la rue."], ARG_HINT, BIKES],
  ["Quelle phrase est un exemple?", "Ana n'y va pas parce qu'elle craint le vol.", ["Plus d'élèves viendraient à vélo.", "De nouveaux supports aideraient tout le monde."], ARG_HINT, BIKES],
  ["Quelle phrase est la conclusion?", "De nouveaux supports aideraient tout le monde.", ["Moins de voitures passeraient dans la rue.", "Plus d'élèves viendraient à vélo."], ARG_HINT, BIKES],
  ["Quels mots annoncent le deuxième argument?", "D'autre part", ["D'une part", "Par exemple"], ARG_HINT, BIKES],
  ["Complète : Les chats sont de bons compagnons. ___, ils sont propres et calmes.", "De plus", ["Pourtant", "Par exemple"], ARG_HINT],
  ["Quel mot annonce une idée contraire?", "Cependant", ["Par exemple", "En conclusion"], ARG_HINT],
  ["Quelle phrase est un argument faible, parce qu'elle ne donne pas de raison?", "C'est comme ça, c'est tout.", ["Parce que cela protège les élèves.", "Car la lecture aide à comprendre."], ARG_HINT],
  ["Pourquoi donne-t-on un exemple dans un paragraphe argumentatif?", "Pour rendre l'argument plus clair et plus convaincant", ["Pour changer de sujet", "Pour allonger la conclusion"], ARG_HINT],
  ["Quelle phrase convient le mieux comme introduction?", "Je pense que les parcs devraient rester ouverts plus tard.", ["En conclusion, les parcs sont utiles.", "Par exemple, il y a des bancs."], ARG_HINT],
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

const LUNCH = {
  type: "passage" as const,
  title: "Le goûter",
  paragraphs: ["Ravi ouvre sa boîte à lunch et soupire. Il regarde les autres élèves manger, puis il referme la boîte. Sa voisine lui tend la moitié de son sandwich. Il sourit et dit merci."],
};

const RETURN = {
  type: "passage" as const,
  title: "Le retour",
  paragraphs: ["Lena rentre de l'école et laisse tomber son sac. Elle ne dit pas bonjour et monte directement dans sa chambre. Sa mère remarque ses yeux rouges et frappe doucement à la porte."],
};

const STORM = {
  type: "passage" as const,
  title: "La tempête",
  paragraphs: ["Le vent hurle et les branches frappent la fenêtre. Zoé remonte la couverture jusqu'au menton. Son petit frère entre dans sa chambre avec une lampe de poche. « Je peux dormir ici? » murmure-t-il."],
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
  ["Pourquoi Ravi soupire-t-il?", "Il n'a probablement rien à manger", ["Il a trop mangé", "Il veut sortir jouer"], INF_HINT, LUNCH],
  ["Comment se sent la voisine de Ravi?", "Généreuse", ["Jalouse", "Fâchée"], INF_HINT, LUNCH],
  ["Comment se sent Ravi à la fin?", "Soulagé et reconnaissant", ["Fâché", "Ennuyé"], INF_HINT, LUNCH],
  ["Quel est le thème de l'extrait « Le goûter »?", "La générosité", ["La vitesse", "La tricherie"], INF_HINT, LUNCH],
  ["Comment se sent Lena?", "Triste ou déçue", ["Joyeuse", "Impatiente"], INF_HINT, RETURN],
  ["Quel indice montre que Lena a pleuré?", "Ses yeux rouges", ["Son sac", "La porte de la maison"], INF_HINT, RETURN],
  ["Comment la mère de Lena réagit-elle?", "Elle est attentionnée", ["Elle est fâchée", "Elle est indifférente"], INF_HINT, RETURN],
  ["Que va probablement faire la mère ensuite?", "Parler doucement avec Lena", ["Crier", "Quitter la maison"], INF_HINT, RETURN],
  ["Comment se sent le frère de Zoé?", "Effrayé", ["Fâché", "Fier"], INF_HINT, STORM],
  ["Quel temps fait-il?", "Il y a une tempête de vent", ["Il fait très chaud", "Il y a un brouillard"], INF_HINT, STORM],
  ["Pourquoi le frère entre-t-il dans la chambre de Zoé?", "Il cherche du réconfort", ["Il veut jouer au ballon", "Il cherche ses clés"], INF_HINT, STORM],
  ["Que va probablement répondre Zoé?", "Oui, viens", ["Non, va dormir ailleurs", "Rien, elle part"], INF_HINT, STORM],
  ["Un personnage s'excuse après avoir dit une parole blessante. Quel est le thème?", "Le respect des autres", ["La météo", "La chance"], "The theme is the big idea the story explores through what happens to the character.", "🙏"],
  ["Une équipe perd, mais continue de s'entraîner ensemble. Quel est le thème?", "La persévérance", ["La jalousie", "Le voyage"], "The theme is the big idea the story explores through what happens to the character.", "🏅"],
  ["Deux voisins s'entraident après une inondation. Quel est le thème?", "La solidarité", ["La compétition", "L'ennui"], "The theme is the big idea the story explores through what happens to the character.", "🤝"],
  ["Un personnage découvre que l'argent ne rend pas heureux. Quel est le thème?", "Le vrai bonheur", ["La chasse au trésor", "La météo"], "The theme is the big idea the story explores through what happens to the character.", "💭"],
  ["Qu'est-ce qu'une inférence?", "Une conclusion tirée d'indices et de ce qu'on sait déjà", ["Une phrase copiée du texte", "Un mot du dictionnaire"], INF_HINT, "🔎"],
  ["Un personnage baisse les yeux et parle très bas. Que peut-on déduire?", "Il est timide ou gêné", ["Il est furieux", "Il est très fier"], INF_HINT, "😳"],
  ["Un personnage claque la porte et serre les poings. Que peut-on déduire?", "Il est en colère", ["Il est ravi", "Il est endormi"], INF_HINT, "🚪"],
  ["Un personnage saute de joie en regardant sa lettre. Que peut-on déduire?", "Il a reçu une bonne nouvelle", ["Il a perdu quelque chose", "Il est malade"], INF_HINT, "✉️"],
];

// ---------- Portrait de personnage ----------

const PORTRAIT_HINT = "A character portrait has two parts: physical traits (how the character looks) and psychological traits (personality, how they think and act).";

const PHYSICAL = ["grand", "petit", "blond", "brun", "mince", "musclé", "frisé", "roux", "costaud", "élancé"];
const PSYCH = ["courageux", "timide", "généreux", "curieux", "patient", "honnête", "drôle", "têtu", "poli", "rêveur"];

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
    ["« Elle aide toujours les nouveaux élèves. » montre qu'elle est…", "serviable", ["égoïste", "paresseuse"], "A character's actions show their personality."],
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
