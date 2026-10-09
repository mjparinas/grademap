import { frOrder, frQuestions, type FrItem } from "../../french";
import type { Course, GenerateOptions, Question } from "../../types";

const FR = { lang: "fr" } as const;

// ---------- Qui, que, où, dont ----------

const REL_HINT = "“Qui” replaces the subject, “que” replaces the direct object, “où” gives a place or time and “dont” replaces a phrase with “de”.";

const RELATIVES: FrItem[] = [
  ["Complète : Le livre ___ est sur la table est à moi.", "qui", ["que", "où", "dont"], REL_HINT],
  ["Complète : Le film ___ j'ai vu hier était drôle.", "que", ["qui", "où", "dont"], REL_HINT],
  ["Complète : La ville ___ j'habite est grande.", "où", ["que", "qui", "dont"], REL_HINT],
  ["Complète : Le garçon ___ je parle est mon cousin.", "dont", ["que", "qui", "où"], "We say “parler de quelqu'un”, so the link word is “dont” (de + whom)."],
  ["Complète : C'est l'amie ___ m'a aidé.", "qui", ["que", "où", "dont"], REL_HINT],
  ["Complète : Voici le chien ___ Léa a adopté.", "que", ["qui", "où", "dont"], REL_HINT],
  ["Complète : Le jour ___ nous sommes arrivés était froid.", "où", ["que", "qui", "dont"], REL_HINT],
  ["Complète : Le livre ___ j'ai besoin est sur l'étagère.", "dont", ["que", "qui", "où"], "We say “avoir besoin de”, so the link word is “dont”."],
  ["Complète : L'enseignante ___ nous aimons beaucoup s'appelle Mme Lee.", "que", ["qui", "où", "dont"], REL_HINT],
  ["Complète : Le parc ___ nous jouons est près d'ici.", "où", ["que", "dont", "qui"], REL_HINT],
  ["Complète : Les enfants ___ chantent sont dans la chorale.", "qui", ["que", "où", "dont"], REL_HINT],
  ["Complète : Le jeu ___ tu parles est très populaire.", "dont", ["que", "qui", "où"], "We say “parler de quelque chose”, so the link word is “dont”."],
];

// ---------- Ne… plus, jamais, rien ----------

const NEG_HINT = "Ne… plus means no longer, ne… jamais means never and ne… rien means nothing. Put “ne” before the verb and the other word after it.";

const NEGATION: FrItem[] = [
  ["Complète : Je n'ai ___ mangé de sushi. (pas une seule fois)", "jamais", ["rien", "plus", "personne"], NEG_HINT],
  ["Complète : Il n'y a ___ dans la boîte. (elle est vide)", "rien", ["jamais", "plus", "pas"], NEG_HINT],
  ["Complète : Elle ne joue ___ du piano. (elle a arrêté)", "plus", ["jamais", "rien", "personne"], NEG_HINT],
  ["Complète : Nous n'avons ___ vu cet enfant. (pas une seule fois)", "jamais", ["rien", "plus", "personne"], NEG_HINT],
  ["Complète : Je ne comprends ___ . (aucune chose)", "rien", ["jamais", "plus", "personne"], NEG_HINT],
  ["Complète : Il ne neige ___ . (c'est fini pour cette année)", "plus", ["jamais", "rien", "personne"], NEG_HINT],
  ["Quelle phrase est correcte?", "Je ne vois rien.", ["Je ne rien vois.", "Je vois ne rien.", "Ne je vois rien."], NEG_HINT],
  ["Quelle phrase est correcte?", "Il ne mange jamais de légumes.", ["Il jamais ne mange de légumes.", "Il mange ne jamais de légumes.", "Il ne jamais mange de légumes."], NEG_HINT],
  ["Quelle phrase est correcte?", "Nous n'habitons plus ici.", ["Nous ne habitons plus ici.", "Nous habitons ne plus ici.", "Nous plus n'habitons ici."], NEG_HINT],
];

// ---------- Les adverbes ----------

const ADV_HINT = "Adverbs tell when (temps), where (lieu), how (manière) or how much (quantité). Ask yourself which question the adverb answers.";

const ADVERB_TYPES: FrItem[] = [
  ["« Demain » est un adverbe de…", "temps", ["lieu", "manière", "quantité"], ADV_HINT],
  ["« Souvent » est un adverbe de…", "temps", ["lieu", "manière", "quantité"], ADV_HINT],
  ["« Ici » est un adverbe de…", "lieu", ["temps", "manière", "quantité"], ADV_HINT],
  ["« Partout » est un adverbe de…", "lieu", ["temps", "manière", "quantité"], ADV_HINT],
  ["« Doucement » est un adverbe de…", "manière", ["temps", "lieu", "quantité"], ADV_HINT],
  ["« Vite » est un adverbe de…", "manière", ["temps", "lieu", "quantité"], ADV_HINT],
  ["« Beaucoup » est un adverbe de…", "quantité", ["temps", "lieu", "manière"], ADV_HINT],
  ["« Trop » est un adverbe de…", "quantité", ["temps", "lieu", "manière"], ADV_HINT],
  ["« Loin » est un adverbe de…", "lieu", ["temps", "manière", "quantité"], ADV_HINT],
  ["« Toujours » est un adverbe de…", "temps", ["lieu", "manière", "quantité"], ADV_HINT],
  ["Dans « Elle chante joliment », que dit l'adverbe?", "Comment elle chante", ["Quand elle chante", "Où elle chante"], ADV_HINT],
  ["Dans « Il joue dehors », que dit l'adverbe?", "Où il joue", ["Quand il joue", "Comment il joue"], ADV_HINT],
];

// ---------- La ponctuation ----------

const PUNCT_HINT = "Guillemets « » show what someone says, a colon : introduces a list or an explanation and parentheses ( ) add extra information.";

const PUNCTUATION: FrItem[] = [
  ["Quels signes servent à écrire les paroles de quelqu'un?", "Les guillemets « »", ["Les parenthèses ( )", "Le deux-points :"], PUNCT_HINT],
  ["Quel signe annonce une liste?", "Le deux-points :", ["Les guillemets « »", "Les parenthèses ( )"], PUNCT_HINT],
  ["Quels signes ajoutent une précision dans une phrase?", "Les parenthèses ( )", ["Les guillemets « »", "Le deux-points :"], PUNCT_HINT],
  ["Quelle phrase est bien ponctuée?", "Léa dit : « Bonjour! »", ["Léa dit « Bonjour! »,", "Léa dit ; (Bonjour!)", "Léa dit, Bonjour!"], PUNCT_HINT],
  ["Quelle phrase est bien ponctuée?", "Il faut trois choses : de la farine, des œufs et du lait.", ["Il faut trois choses « de la farine, des œufs et du lait. »", "Il faut trois choses (de la farine, des œufs et du lait)", "Il faut trois choses ; de la farine des œufs et du lait"], PUNCT_HINT],
  ["Quelle phrase est bien ponctuée?", "Mon chien (un labrador) aime nager.", ["Mon chien « un labrador » aime nager.", "Mon chien : un labrador aime nager.", "Mon chien, un labrador. aime nager."], PUNCT_HINT],
  ["Quelle phrase est bien ponctuée?", "Amir répond : « Je suis prêt. »", ["Amir répond (Je suis prêt).", "Amir répond « : Je suis prêt. »", "Amir : répond « Je suis prêt. »"], PUNCT_HINT],
  ["Où mettre les guillemets?", "Maya a dit : « J'arrive. »", ["Maya « a dit » : J'arrive.", "« Maya a dit : » J'arrive.", "Maya a dit : J'arrive. « »"], PUNCT_HINT],
];

// ---------- La bande dessinée ----------

const BD_HINT = "A comic book (bande dessinée, or BD) tells a story with panels (cases), speech bubbles (bulles) and sound words (onomatopées).";

const COMICS: FrItem[] = [
  ["Que contient une bulle dans une BD?", "Les paroles d'un personnage", ["Le titre de la BD", "Le nom de l'auteur"], BD_HINT, "💬"],
  ["Qu'est-ce qu'une case?", "Un dessin encadré qui montre un moment", ["Une bulle de pensée", "Le titre d'un chapitre"], BD_HINT, "🖼️"],
  ["Qu'est-ce qu'une onomatopée?", "Un mot qui imite un bruit", ["Un mot très long", "Le nom d'un personnage"], BD_HINT, "💥"],
  ["Quel mot est une onomatopée?", "Boum!", ["Bonjour", "Demain"], BD_HINT, "💥"],
  ["Quel mot est une onomatopée?", "Splash!", ["Soleil", "Aujourd'hui"], BD_HINT, "💦"],
  ["Une bulle en forme de nuage avec de petits ronds montre…", "ce que le personnage pense", ["ce que le personnage crie", "le bruit d'un objet"], "Round, cloud-shaped bubbles show thoughts. Pointed bubbles show speech.", "💭"],
  ["Dans une BD, les dessins et les mots…", "racontent l'histoire ensemble", ["sont toujours inutiles", "n'ont aucun lien"], "In a comic book the images and the text work together to tell the story.", "📖"],
  ["Une bulle avec des pointes très marquées montre souvent…", "que le personnage crie", ["que le personnage dort", "que le personnage pense"], BD_HINT, "😲"],
  ["La personnification, c'est…", "donner des qualités humaines à un animal ou un objet", ["décrire un paysage", "compter les cases"], "A talking cat or a smiling sun is personification.", "🐱"],
  ["Pour lire une BD, on lit les cases…", "dans l'ordre, de gauche à droite et de haut en bas", ["de bas en haut", "au hasard"], "Follow the panels in order, like reading text.", "➡️"],
];

// ---------- La biographie ----------

const BIO_HINT = "A biography tells the true story of a real person's life, usually in the third person, with dates, places and sources.";

const BIOGRAPHY: FrItem[] = [
  ["Une biographie raconte…", "la vie d'une personne réelle", ["une histoire inventée", "une recette"], BIO_HINT, "📚"],
  ["Une autobiographie est écrite par…", "la personne elle-même", ["un voisin", "un robot"], "“Auto-” means oneself: the person tells their own life.", "✍️"],
  ["Dans une biographie, l'auteur écrit le plus souvent…", "à la troisième personne (il, elle)", ["à la deuxième personne (tu)", "avec des onomatopées"], BIO_HINT, "👤"],
  ["Où trouve-t-on la liste des sources d'un texte?", "Dans la bibliographie", ["Dans la bulle", "Dans le titre"], "A bibliography lists the books and websites the author used.", "🔎"],
  ["Pourquoi un auteur ajoute-t-il des dates dans une biographie?", "Pour situer les événements dans le temps", ["Pour faire rimer le texte", "Pour ajouter des bruits"], BIO_HINT, "📅"],
  ["Pourquoi utilise-t-on des guillemets pour une citation?", "Pour montrer les mots exacts de la personne", ["Pour décorer", "Pour montrer un bruit"], "Quotation marks show the person's exact words.", "💬"],
  ["Quel texte est une biographie?", "La vie d'une inventrice, de sa naissance à ses grandes découvertes", ["Un chat qui voyage sur la Lune", "Les étapes pour faire un gâteau"], BIO_HINT],
  ["Une biographie est organisée…", "en ordre chronologique", ["en ordre alphabétique", "au hasard"], "Chronological order follows time from the earliest event to the latest.", "⏳"],
];

const BIO_ORDERS = [
  ["Naissance de la personne", "Premières études", "Premier emploi", "Grande réussite", "Retraite"],
];

function biographies(opts?: GenerateOptions): Question[] {
  return [...frQuestions(BIOGRAPHY, opts, 7, FR), frOrder("Remets les étapes de la vie dans l'ordre.", "A biography follows time: birth first, then school, work and later years.", BIO_ORDERS[0], FR)];
}

// ---------- Fait ou opinion ----------

const FACT = "Objective (un fait)";
const OPINION = "Subjective (une opinion)";
const OBJ_HINT = "An objective sentence gives a fact you can check. A subjective sentence gives a feeling or opinion, with words like “meilleur”, “beau” or “ennuyeux”.";

const OBJECTIVITY: FrItem[] = [
  ["Cette phrase est-elle objective ou subjective? « L'eau gèle à 0 °C. »", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Le chocolat est le meilleur dessert. »", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Il y a sept jours dans une semaine. »", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Ce film est trop long. »", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Le Canada a dix provinces. »", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « L'hiver est une saison ennuyeuse. »", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Le français est une belle langue. »", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Une araignée a huit pattes. »", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Les chiens sont plus gentils que les chats. »", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « La Terre tourne autour du Soleil. »", FACT, [OPINION], OBJ_HINT],
];

export const course: Course = {
  grade: "5",
  subject: "immersion",
  bigIdeas: {
    "ca-bc": [
      "Interactions with other people reveal their varied perspectives and thus expose human diversity.",
      "Fiction presents sociocultural and historical elements that have been adapted and shaped by the author.",
      "Looking for information in multiple sources provides different points of view and enriches knowledge and vocabulary.",
      "The interpretation of a text depends as much on its structure and visual presentation as on its content.",
    ],
  },
  units: [
    {
      id: "pronoms-relatifs",
      title: "Qui, que, où, dont",
      emoji: "🔗",
      blurb: "Les pronoms relatifs",
      parentNote: "Using the simple relative pronouns qui, que, où and dont to join two ideas in one sentence.",
      standards: { "ca-bc": "Language elements: simple relative pronouns (qui, que, quoi, dont, où)" },
      generate: (o) => frQuestions(RELATIVES, o, 8, FR),
    },
    {
      id: "negation",
      title: "Ne… plus, jamais, rien",
      emoji: "🚫",
      blurb: "La négation",
      parentNote: "Negative forms ne… plus, ne… jamais and ne… rien, and where each word goes in the sentence.",
      standards: { "ca-bc": "Language elements: negation (ne… plus, ne… jamais, ne… rien)" },
      generate: (o) => frQuestions(NEGATION, o, 8, FR),
    },
    {
      id: "adverbes",
      title: "Les adverbes",
      emoji: "⏱️",
      blurb: "Temps, lieu, manière",
      parentNote: "Adverbs of time, place, manner and quantity, and what each one tells us about the action.",
      standards: { "ca-bc": "Language elements: adverbs of time, place, manner and quantity" },
      generate: (o) => frQuestions(ADVERB_TYPES, o, 8, FR),
    },
    {
      id: "ponctuation",
      title: "La ponctuation",
      emoji: "❝",
      blurb: "Guillemets et deux-points",
      parentNote: "Quotation marks, the colon and parentheses used correctly in French.",
      standards: { "ca-bc": "Text organization: punctuation (quotation marks, colon and parentheses)" },
      generate: (o) => frQuestions(PUNCTUATION, o, 8, FR),
    },
    {
      id: "bande-dessinee",
      title: "La bande dessinée",
      emoji: "💬",
      blurb: "Cases, bulles, onomatopées",
      parentNote: "The features of a comic book: panels, speech and thought bubbles, sound words and how pictures and text work together.",
      standards: { "ca-bc": "Literary elements: characteristics of the comic book (panels, dialogue, text/image relationship, onomatopoeia, personification)" },
      generate: (o) => frQuestions(COMICS, o, 8, FR),
    },
    {
      id: "biographie",
      title: "La biographie",
      emoji: "🧑‍🔬",
      blurb: "Raconter une vie",
      parentNote: "Features of a biography: point of view, dates, quotations, sources and chronological order.",
      standards: { "ca-bc": "Literary elements: characteristics of the biography; chronological organization; bibliographies" },
      generate: biographies,
    },
    {
      id: "fait-ou-opinion",
      title: "Fait ou opinion?",
      emoji: "⚖️",
      blurb: "Objectif ou subjectif",
      parentNote: "Telling an objective statement (a fact) from a subjective one (an opinion), an early critical-thinking skill.",
      standards: { "ca-bc": "Distinguish objectivity from subjectivity in a text" },
      generate: (o) => frQuestions(OBJECTIVITY, o, 8, FR),
    },
  ],
};
