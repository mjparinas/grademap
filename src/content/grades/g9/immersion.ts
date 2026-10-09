import { frQuestions, type FrItem } from "../../french";
import type { Course } from "../../types";

const FR = { lang: "fr" } as const;

// ---------- Registres de langue et exposé oral ----------

const REG_HINT = "Familier : entre amis. Courant : tous les jours. Soutenu : raffiné ou littéraire.";

const REGISTERS: FrItem[] = [
  ["Quel registre de langue est utilisé? « Ché pas où est ton bouquin. »", "Familier", ["Courant", "Soutenu"], REG_HINT],
  ["Quel registre de langue est utilisé? « Je ne sais pas où est ton livre. »", "Courant", ["Familier", "Soutenu"], REG_HINT],
  ["Quel registre de langue est utilisé? « Je ne sais point où est placé votre ouvrage. »", "Soutenu", ["Familier", "Courant"], REG_HINT],
  ["Quel registre de langue est utilisé? « Il fait un froid de canard! »", "Familier", ["Courant", "Soutenu"], REG_HINT],
  ["Quel registre de langue est utilisé? « Il fait très froid aujourd'hui. »", "Courant", ["Familier", "Soutenu"], REG_HINT],
  ["Quel registre de langue est utilisé? « Le froid est saisissant en cette matinée. »", "Soutenu", ["Familier", "Courant"], REG_HINT],
  ["Pour un exposé devant la classe, quel registre est le plus approprié?", "Courant", ["Familier", "De l'argot"], "Devant un auditoire, on choisit une langue claire et correcte."],
  ["Quelle phrase est écrite en langue soutenue?", "Je vous prie de bien vouloir m'excuser.", ["Désolé, hein!", "Excuse-moi."], REG_HINT],
  ["Quelle intention a un orateur qui clarifie un mot difficile?", "Se faire mieux comprendre", ["Faire rire l'auditoire", "Raccourcir l'exposé"], "Clarifier, c'est rendre plus clair. Expliquer, c'est donner des détails ou un exemple."],
  ["Que fait un orateur qui donne un exemple pour appuyer son idée?", "Il explique", ["Il change de sujet", "Il conclut"], "Un exemple sert à expliquer une idée."],
  ["Dans l'organisation d'un exposé, que présente l'introduction?", "Le sujet et l'intention", ["Tous les arguments", "Les remerciements seulement"], "L'introduction annonce le sujet; le développement le détaille; la conclusion le résume."],
];

// ---------- La fable ----------

const FABLE = {
  type: "passage" as const,
  title: "Le renard et le héron",
  paragraphs: [
    "Un jour, un renard invita un héron à dîner. Il servit une soupe claire dans une assiette plate et se mit à rire en voyant le héron, dont le long bec ne pouvait rien boire.",
    "Quelques jours plus tard, le héron invita le renard à son tour. Il servit un délicieux ragoût dans une bouteille au col étroit. Le renard ne put goûter à rien.",
    "Le renard comprit alors que celui qui se moque des autres risque d'être moqué à son tour.",
  ],
};

const FABLE_HINT = "Une fable est un court récit avec des animaux qui agissent comme des humains. Elle se termine par une morale, un enseignement.";

const FABLES: FrItem[] = [
  ["Quelle est la morale de cette fable?", "Celui qui se moque des autres risque d'être moqué", ["Il faut toujours manger de la soupe", "Les hérons sont plus rusés que les renards"], FABLE_HINT, FABLE],
  ["Qu'est-ce qui rend les animaux de cette fable semblables aux humains?", "Ils invitent à dîner et se moquent", ["Ils vivent dans la forêt", "Ils ont un long bec"], FABLE_HINT, FABLE],
  ["Pourquoi le héron ne peut-il pas boire la soupe?", "Son bec est long et l'assiette est plate", ["Il n'a pas faim", "La soupe est trop chaude"], FABLE_HINT, FABLE],
  ["Pourquoi le renard ne peut-il pas goûter au ragoût?", "Le col de la bouteille est trop étroit", ["Il n'aime pas le ragoût", "Le ragoût est brûlé"], FABLE_HINT, FABLE],
  ["Où trouve-t-on généralement la morale d'une fable?", "À la fin", ["Au début seulement", "Dans le titre"], FABLE_HINT],
  ["Que signifie le sens propre d'un mot?", "Son sens exact, dans le dictionnaire", ["Un sens imagé", "Un sens caché"], "Le sens propre est le sens réel. Le sens figuré est une image : « avoir un cœur de pierre »."],
  ["« Il a un cœur de pierre. » Quel est le sens figuré?", "Il est sans pitié", ["Son cœur est lourd", "Il aime les cailloux"], "Le sens figuré est une image qui ne se prend pas à la lettre."],
  ["Quelles coutumes une fable peut-elle montrer?", "Les manières et les valeurs d'une époque", ["Seulement la météo", "Seulement des chiffres"], "Une fable reflète souvent les mœurs (manières de vivre) de son époque."],
];

// ---------- Le roman et les personnages ----------

const ROMAN: FrItem[] = [
  ["Qui raconte l'histoire quand on lit « Je suis entrée dans la grotte »?", "Le personnage lui-même", ["Un narrateur absent", "L'auteur au hasard"], "Avec « je », le narrateur est un personnage de l'histoire (point de vue interne)."],
  ["Dans « Elle entra dans la grotte », qui raconte?", "Un narrateur qui n'est pas dans l'histoire", ["Le personnage lui-même", "Le lecteur"], "Avec « il » ou « elle », le narrateur raconte de l'extérieur."],
  ["Qu'est-ce que le cadre spatio-temporel d'un roman?", "Le lieu et l'époque de l'histoire", ["La liste des personnages", "La couverture du livre"], "Le cadre répond à : où? et quand?"],
  ["Quel est le rôle du héros?", "Il est le personnage principal", ["Il écrit le livre", "Il est toujours le méchant"], "Le héros porte l'histoire. L'opposant essaie de l'arrêter."],
  ["Quel est le rôle de l'opposant?", "Il nuit au héros", ["Il aide le héros", "Il raconte l'histoire"], "L'opposant crée des obstacles. L'adjuvant aide le héros."],
  ["Quel est le rôle de l'adjuvant?", "Il aide le héros", ["Il nuit au héros", "Il change l'époque"], "Adjuvant vient de « aider »."],
  ["« Léa a les cheveux roux et de grands yeux verts. » Quel portrait est-ce?", "Un portrait physique", ["Un portrait psychologique", "Un portrait sonore"], "Physique : le corps. Psychologique : les sentiments et les valeurs."],
  ["« Léa est courageuse et toujours honnête. » Quel portrait est-ce?", "Un portrait psychologique", ["Un portrait physique", "Un portrait sonore"], "Psychologique : le caractère, les sentiments et les valeurs."],
  ["Un personnage rend toujours ce qu'il emprunte et dit la vérité. Quelle valeur montre-t-il?", "L'honnêteté", ["L'avarice", "La paresse"], "Les actions d'un personnage révèlent ses valeurs."],
  ["Quel indice aide à comprendre la personnalité d'un personnage?", "Ses actions et ses paroles", ["Le nombre de pages", "La couleur de la couverture"], "Ce qu'il fait et ce qu'il dit montre qui il est."],
];

// ---------- Figures de style ----------

const STYLE_HINT = "Personnification : une chose agit comme une personne. Métaphore : une image sans « comme ». Comparaison : avec « comme ». Hyperbole : une exagération. Allitération : le même son répété.";

const STYLES: FrItem[] = [
  ["« Le vent murmure dans les arbres. » Quelle figure de style est-ce?", "Une personnification", ["Une hyperbole", "Une allitération"], STYLE_HINT],
  ["« Cet enfant est un vrai soleil. » Quelle figure de style est-ce?", "Une métaphore", ["Une comparaison", "Une allitération"], STYLE_HINT],
  ["« Elle court comme un lièvre. » Quelle figure de style est-ce?", "Une comparaison", ["Une métaphore", "Une personnification"], STYLE_HINT],
  ["« J'ai mille choses à faire! » Quelle figure de style est-ce?", "Une hyperbole", ["Une comparaison", "Une personnification"], STYLE_HINT],
  ["« Pour qui sont ces serpents qui sifflent sur vos têtes? » Quelle figure de style est-ce?", "Une allitération", ["Une métaphore", "Une hyperbole"], "Le son « s » est répété plusieurs fois."],
  ["« La lune sourit à la ville. » Quelle figure de style est-ce?", "Une personnification", ["Une comparaison", "Une hyperbole"], STYLE_HINT],
  ["Quel mot signale une comparaison?", "comme", ["parce que", "mais"], "Une comparaison relie deux choses avec comme, tel, pareil à…"],
  ["Quelle phrase contient une métaphore?", "Ses yeux sont deux étoiles.", ["Ses yeux brillent comme des étoiles.", "Elle a les yeux bleus."], STYLE_HINT],
  ["Quelle phrase contient une comparaison?", "Il est fort comme un lion.", ["Il est un lion.", "Le lion rugit."], STYLE_HINT],
  ["Quelle phrase contient une hyperbole?", "Je meurs de faim!", ["J'ai un peu faim.", "Il est midi."], STYLE_HINT],
];

// ---------- Séquence descriptive ----------

const DESCRIPTION: FrItem[] = [
  ["Quelle partie d'un texte descriptif présente le sujet central?", "L'introduction", ["La conclusion", "Un aspect"], "L'introduction nomme le sujet. Le développement le décrit par aspects. La conclusion termine."],
  ["Pour décrire un lac, quel est un aspect?", "Sa couleur et sa profondeur", ["Le titre du texte", "Le nom de l'auteur"], "Un aspect est un angle de la description."],
  ["Dans un texte sur les loups, « Leur nourriture » est un…", "Aspect", ["Sujet central", "Titre de la conclusion"], "Le sujet central est « les loups ». Les aspects sont leur nourriture, leur habitat…"],
  ["Dans le texte « Les loups », « Les loups vivent en meute » est un…", "Sous-aspect de leur vie sociale", ["Sujet central", "Titre"], "Un sous-aspect précise un aspect."],
  ["Que fait la conclusion d'un texte descriptif?", "Elle résume le sujet", ["Elle commence un autre sujet", "Elle remplace l'introduction"], "La conclusion termine et rappelle l'essentiel."],
  ["Quel mot varie le vocabulaire de « grand »?", "immense", ["petit", "rapidement"], "Un synonyme garde le même sens."],
  ["Quel mot est un synonyme de « beau »?", "magnifique", ["laid", "bruyant"], "Variez le vocabulaire pour enrichir un texte."],
  ["Quel type de phrase pose une question?", "La phrase interrogative", ["La phrase déclarative", "La phrase impérative"], "Interrogative : ?  Impérative : un ordre.  Exclamative : !"],
  ["Quel type de phrase exprime un ordre?", "La phrase impérative", ["La phrase interrogative", "La phrase déclarative"], "Ferme la porte. = impérative."],
];

// ---------- Les temps du passé ----------

const PAST_HINT = "Passé composé : une action terminée. Imparfait : une description ou une habitude. Plus-que-parfait : une action avant une autre action passée.";

const PAST: FrItem[] = [
  ["Complète : Hier, nous ___ au cinéma. (aller, passé composé)", "sommes allés", ["allions", "étions allés"], PAST_HINT],
  ["Complète : Quand j'étais petit, je ___ souvent au parc. (aller, imparfait)", "allais", ["suis allé", "étais allé"], PAST_HINT],
  ["Complète : Elle ___ déjà mangé quand je suis arrivé. (avoir, plus-que-parfait)", "avait", ["a", "aura"], PAST_HINT],
  ["Complète : Il pleuvait quand nous ___ de l'école. (sortir, passé composé)", "sommes sortis", ["sortions", "étions sortis"], PAST_HINT],
  ["Quel temps décrit une habitude du passé?", "L'imparfait", ["Le passé composé", "Le futur simple"], PAST_HINT],
  ["Quel temps décrit une action terminée?", "Le passé composé", ["L'imparfait", "Le conditionnel"], PAST_HINT],
  ["Quelle phrase est au plus-que-parfait?", "Il avait fini son devoir.", ["Il a fini son devoir.", "Il finissait son devoir."], PAST_HINT],
  ["Quelle phrase est au passé composé?", "Ils ont gagné le match.", ["Ils gagnaient le match.", "Ils avaient gagné le match."], PAST_HINT],
  ["Complète : Les filles sont ___ . (arriver, passé composé)", "arrivées", ["arrivé", "arrivés"], "Avec être, le participe s'accorde avec le sujet : les filles → féminin pluriel."],
  ["Complète : La lettre que j'ai ___ . (écrire, passé composé)", "écrite", ["écrit", "écrits"], "Avec avoir, on accorde avec le complément direct placé avant : « que » = la lettre → féminin singulier."],
  ["Complète : Les pommes qu'elle a ___ étaient bonnes. (manger)", "mangées", ["mangé", "mangée"], "Le complément direct « que » (les pommes) est placé avant le verbe : féminin pluriel."],
  ["Quel temps utilise-t-on pour raconter une action avant une autre dans le passé?", "Le plus-que-parfait", ["Le futur simple", "Le présent"], PAST_HINT],
];

// ---------- Les pronoms compléments ----------

const PRON_HINT = "Complément direct : le, la, les, me, te. Complément indirect (à + quelqu'un) : lui, leur, me, te. Y remplace un lieu; en remplace « de + quelque chose ».";

const PRONOUNS: FrItem[] = [
  ["Remplace le complément : Je vois Marie. → Je ___ vois.", "la", ["lui", "leur"], PRON_HINT],
  ["Remplace le complément : Je vois mes amis. → Je ___ vois.", "les", ["leur", "lui"], PRON_HINT],
  ["Remplace le complément : Je parle à Marie. → Je ___ parle.", "lui", ["la", "les"], PRON_HINT],
  ["Remplace le complément : Je parle à mes amis. → Je ___ parle.", "leur", ["les", "la"], PRON_HINT],
  ["Remplace le complément : Il mange le gâteau. → Il ___ mange.", "le", ["lui", "leur"], PRON_HINT],
  ["Remplace le lieu : Nous allons à la plage. → Nous ___ allons.", "y", ["en", "lui"], PRON_HINT],
  ["Remplace « de + chose » : Elle a besoin de livres. → Elle ___ a besoin.", "en", ["y", "les"], PRON_HINT],
  ["Remplace le complément : Tu me vois. Quel pronom est le complément direct?", "me", ["Tu", "vois"], PRON_HINT],
  ["Dans « Je lui donne un livre », lui est un complément…", "indirect", ["direct", "de lieu"], PRON_HINT],
  ["Dans « Je le regarde », le est un complément…", "direct", ["indirect", "de temps"], PRON_HINT],
  ["Remplace le complément : Nous voyons Paul et Léa. → Nous ___ voyons.", "les", ["leur", "lui"], PRON_HINT],
];

// ---------- Phrases hypothétiques ----------

const IF_HINT = "Si + présent → futur simple. Si + imparfait → conditionnel présent. Si + plus-que-parfait → conditionnel passé.";

const HYPOTHETICAL: FrItem[] = [
  ["Complète : Si tu étudies, tu ___ ton examen. (réussir)", "réussiras", ["réussirais", "aurais réussi"], IF_HINT],
  ["Complète : Si j'avais des ailes, je ___ . (voler)", "volerais", ["volerai", "vole"], IF_HINT],
  ["Complète : S'il pleut demain, nous ___ à l'intérieur. (rester)", "resterons", ["resterions", "sommes restés"], IF_HINT],
  ["Complète : Si nous avions plus de temps, nous ___ le musée. (visiter)", "visiterions", ["visiterons", "visitons"], IF_HINT],
  ["Quelle phrase est correcte?", "Si elle vient, je serai content.", ["Si elle viendra, je serai content.", "Si elle viendrait, je serai content."], "Après « si », on n'emploie pas le futur ni le conditionnel."],
  ["Quelle phrase est correcte?", "Si j'étais riche, je voyagerais.", ["Si je serais riche, je voyagerais.", "Si j'étais riche, je voyagerai."], "Après « si », on n'emploie pas le conditionnel."],
  ["Quelle phrase exprime une hypothèse?", "Si je gagnais, je serais ravi.", ["Je gagne souvent.", "J'ai gagné hier."], IF_HINT],
  ["Quel mot commence une phrase hypothétique?", "si", ["car", "donc"], IF_HINT],
];

// ---------- Le passé simple et le plus-que-parfait ----------

const SIMPLE_PAST: FrItem[] = [
  ["Dans un conte, « Il ouvrit la porte » est au…", "Passé simple", ["Plus-que-parfait", "Futur simple"], "Le passé simple se trouve surtout à l'écrit, dans les contes et les romans : il ouvrit, elle chanta."],
  ["Quelle phrase est au passé simple?", "Elle chanta une chanson.", ["Elle chantait une chanson.", "Elle avait chanté une chanson."], "Le passé simple se termine par -a, -it, -ent… à la 3e personne."],
  ["Quelle forme est le passé simple de « parler » (il)?", "parla", ["parlait", "parlera"], "Il parla = passé simple. Il parlait = imparfait."],
  ["Quelle forme est le passé simple de « finir » (il)?", "finit", ["finissait", "finira"], "Il finit = passé simple."],
  ["Quel temps est « avait fini »?", "Le plus-que-parfait", ["Le passé simple", "Le futur simple"], "Auxiliaire à l'imparfait + participe passé."],
  ["Comment forme-t-on le plus-que-parfait?", "Auxiliaire à l'imparfait + participe passé", ["Auxiliaire au présent + participe passé", "Radical + -ait"], "J'avais mangé; elle était partie."],
  ["Complète : Quand elle est arrivée, nous ___ déjà fini. (plus-que-parfait)", "avions", ["avons", "aurons"], "Avoir à l'imparfait : j'avais, tu avais, il avait, nous avions…"],
  ["Complète : Elle ___ partie avant la pluie. (être, plus-que-parfait)", "était", ["est", "sera"], "Être à l'imparfait : j'étais, elle était…"],
];

export const course: Course = {
  grade: "9",
  subject: "immersion",
  bigIdeas: {
    "ca-bc": [
      "Improving communication skills in a language helps us define ourselves and affirm our ideas.",
      "Language is a cultural tool, the common thread of knowledge and values.",
      "Studying a text on different levels allows the various meanings to be brought to light.",
      "Literature reflects the reality of society at the time and its questions and preoccupations.",
    ],
  },
  units: [
    {
      id: "registres-et-expose",
      title: "Registres et exposés oraux",
      emoji: "🎤",
      blurb: "Parler à un auditoire",
      parentNote: "Registers of language (colloquial, standard, formal) and speaking to an audience: intention, organization, clarification and explanation.",
      standards: { "ca-bc": "Communication strategies: registers of language; speaking to an audience (intention, organization, clarification, explanation)" },
      generate: (o) => frQuestions(REGISTERS, o, 8, FR),
    },
    {
      id: "fable",
      title: "La fable",
      emoji: "🦊",
      blurb: "Morale, sens propre et sens figuré",
      parentNote: "Characteristics of the fable (moral, literal and figurative meaning, manners and customs), using an original fable.",
      standards: { "ca-bc": "Literary elements: characteristics of the fable (moral, literal meaning, figurative meaning, manners and customs)" },
      generate: (o) => frQuestions(FABLES, o, 8, FR),
    },
    {
      id: "roman",
      title: "Le roman et ses personnages",
      emoji: "📖",
      blurb: "Narrateur, héros et portraits",
      parentNote: "Characteristics of the novel (modes of narration, function of characters, point of view, setting) and character portrayal (physical and psychological).",
      standards: { "ca-bc": "Literary elements: characteristics of the novel; text organization: character portrayal (psychological and physical)" },
      generate: (o) => frQuestions(ROMAN, o, 8, FR),
    },
    {
      id: "figures-de-style",
      title: "Les figures de style",
      emoji: "🎨",
      blurb: "Métaphore, comparaison, hyperbole…",
      parentNote: "Stylistic elements: personification, metaphor, alliteration, comparison and hyperbole.",
      standards: { "ca-bc": "Literary elements: stylistic elements (personification, metaphor, alliteration, comparison, hyperbole)" },
      generate: (o) => frQuestions(STYLES, o, 8, FR),
    },
    {
      id: "sequence-descriptive",
      title: "La séquence descriptive",
      emoji: "🔍",
      blurb: "Sujet, aspects et vocabulaire",
      parentNote: "Descriptive sequences: introduction, central subject with aspects and sub-aspects, conclusion; enriching a text with varied vocabulary and types of sentences.",
      standards: { "ca-bc": "Text organization: descriptive sequences; elements to enrich a text (varied vocabulary, types of sentences)" },
      generate: (o) => frQuestions(DESCRIPTION, o, 8, FR),
    },
    {
      id: "temps-du-passe",
      title: "Les temps du passé",
      emoji: "⏳",
      blurb: "Passé composé, imparfait, plus-que-parfait",
      parentNote: "Choosing among the passé composé, imparfait and plus-que-parfait, and making past participles agree.",
      standards: { "ca-bc": "Language elements: agreement of past tenses: passé composé, imparfait and plus-que-parfait" },
      generate: (o) => frQuestions(PAST, o, 8, FR),
    },
    {
      id: "pronoms-complements",
      title: "Les pronoms compléments",
      emoji: "🔁",
      blurb: "le, la, lui, leur, y, en",
      parentNote: "Direct pronouns (me, te, se, le, la, les) and indirect pronouns (me, te, nous, vous, lui, leur, y, en).",
      standards: { "ca-bc": "Language elements: pronouns used as direct and indirect object complements" },
      generate: (o) => frQuestions(PRONOUNS, o, 8, FR),
    },
    {
      id: "phrases-hypothetiques",
      title: "Les phrases hypothétiques",
      emoji: "💭",
      blurb: "Si + présent, si + imparfait",
      parentNote: "Hypothetical sentences with si: matching the tense after si with the tense of the result.",
      standards: { "ca-bc": "Language elements: hypothetical sentences" },
      generate: (o) => frQuestions(HYPOTHETICAL, o, 8, FR),
    },
    {
      id: "passe-simple",
      title: "Passé simple et plus-que-parfait",
      emoji: "📜",
      blurb: "Les temps des récits",
      parentNote: "Using the pluperfect (plus-que-parfait) tense and recognizing the simple past (passé simple) in stories.",
      standards: { "ca-bc": "Language elements: using the plus-que-parfait tense and recognizing the passé simple" },
      generate: (o) => frQuestions(SIMPLE_PAST, o, 8, FR),
    },
  ],
};
