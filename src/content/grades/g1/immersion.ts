import { frOrder, frQuestions, vocabQuestions, type FrItem, type Pair } from "../../french";
import { sample } from "../../random";
import type { Course, GenerateOptions, Question } from "../../types";

const FR = { lang: "fr" } as const;

// ---------- Je me présente ----------

const ABOUT_ME: FrItem[] = [
  ["On demande : « Comment t'appelles-tu? »", "Je m'appelle Maya.", ["J'ai six ans.", "Ça va bien."], "To say your name, start with “Je m'appelle…”.", "🙋"],
  ["On demande : « Quel âge as-tu? »", "J'ai six ans.", ["Je m'appelle Léo.", "J'aime les chats."], "To say your age, start with “J'ai…” and add “ans”.", "🎂"],
  ["On demande : « Comment ça va? »", "Ça va bien, merci.", ["J'ai sept ans.", "Je m'appelle Ana."], "“Ça va bien” tells how you feel today.", "😊"],
  ["On demande : « Qu'est-ce que tu aimes? »", "J'aime les chiens.", ["J'ai huit ans.", "Je m'appelle Zoé."], "To say what you like, start with “J'aime…”.", "❤️"],
  ["On demande : « As-tu un frère? »", "Oui, j'ai un frère.", ["Oui, je m'appelle Noé.", "Oui, ça va bien."], "To answer, say “Oui, j'ai…” or “Non, je n'ai pas…”.", "👦"],
  ["On demande : « Où habites-tu? »", "J'habite près de l'école.", ["J'ai six ans.", "J'aime la pizza."], "To say where you live, start with “J'habite…”.", "🏘️"],
  ["On demande : « Quelle est ta couleur préférée? »", "Ma couleur préférée est le bleu.", ["J'ai cinq ans.", "Je m'appelle Kenji."], "Say “Ma couleur préférée est…” and name a colour.", "🎨"],
  ["On demande : « Comment ça va? »", "Je suis content.", ["Je m'appelle Amir.", "J'habite ici."], "“Je suis content” (or contente) means I am happy.", "😃"],
  ["On demande : « Comment t'appelles-tu? »", "Je m'appelle Amir.", ["J'ai sept ans.", "Je suis content."], "To say your name, start with “Je m'appelle…”.", "🙋"],
  ["On demande : « Comment t'appelles-tu? »", "Je m'appelle Lena.", ["J'aime la musique.", "J'habite ici."], "Say “Je m'appelle…” and then your name.", "🙋"],
  ["On demande : « Quel âge as-tu? »", "J'ai sept ans.", ["Je m'appelle Ravi.", "J'aime le bleu."], "Say “J'ai…” and a number, then “ans”.", "🎂"],
  ["On demande : « Quel âge as-tu? »", "J'ai cinq ans.", ["J'habite ici.", "Ça va bien."], "Say “J'ai…” and a number, then “ans”.", "🖐️"],
  ["On demande : « Qu'est-ce que tu aimes? »", "J'aime les pommes.", ["J'ai six ans.", "Je m'appelle Léo."], "To say what you like, start with “J'aime…”.", "🍎"],
  ["On demande : « Qu'est-ce que tu aimes? »", "J'aime dessiner.", ["Je suis content.", "J'habite ici."], "“J'aime…” can be followed by an action like dessiner.", "🖍️"],
  ["On demande : « As-tu une sœur? »", "Oui, j'ai une sœur.", ["Oui, j'ai six ans.", "Oui, je m'appelle Léa."], "To answer, say “Oui, j'ai…” or “Non, je n'ai pas…”.", "👧"],
  ["On demande : « As-tu un chien? »", "Non, je n'ai pas de chien.", ["Non, je m'appelle Noé.", "Non, j'ai six ans."], "To say no, use “Non, je n'ai pas de…”.", "🐶"],
  ["On demande : « Comment ça va? »", "Je suis fatigué.", ["Je m'appelle Léo.", "J'aime les chats."], "“Je suis fatigué” (or fatiguée) means I am tired.", "😴"],
  ["On demande : « Comment ça va? »", "Je suis triste.", ["J'ai huit ans.", "J'aime les fraises."], "“Je suis triste” means I am sad.", "😢"],
  ["On demande : « Où habites-tu? »", "J'habite dans une grande ville.", ["J'ai sept ans.", "J'aime les chats."], "To say where you live, start with “J'habite…”.", "🏙️"],
  ["On demande : « Où habites-tu? »", "J'habite à la campagne.", ["Je m'appelle Zoé.", "Ça va bien."], "“J'habite…” tells where your home is.", "🌾"],
  ["On demande : « Quelle est ta couleur préférée? »", "Ma couleur préférée est le rouge.", ["J'ai six ans.", "J'habite ici."], "Say “Ma couleur préférée est…” and name a colour.", "🔴"],
  ["On demande : « Quel est ton animal préféré? »", "Mon animal préféré est le chat.", ["J'ai sept ans.", "Je m'appelle Ana."], "Say “Mon animal préféré est…” and name an animal.", "🐱"],
  ["On demande : « Quel est ton fruit préféré? »", "Mon fruit préféré est la fraise.", ["Je suis content.", "J'habite ici."], "Say “Mon fruit préféré est…” and name a fruit.", "🍓"],
  ["On demande : « Est-ce que tu aimes jouer? »", "Oui, j'aime jouer.", ["Oui, je m'appelle Zoé.", "Oui, j'ai huit ans."], "Answer with “Oui, j'aime…” or “Non, je n'aime pas…”.", "⚽"],
];

// ---------- Majuscule et point ----------

const SENTENCES = [
  "Le chat dort.", "Léa aime la musique.", "Nous allons à l'école.", "Le soleil brille.", "Amir mange une pomme.", "Mon ami joue au parc.",
  "Il fait chaud.", "Maya dessine un arbre.", "Le chien court vite.", "Nous lisons un livre.",
  "Zoé chante bien.", "Mon papa cuisine.", "La lune est belle.", "Kenji saute haut.", "Nous jouons ensemble.", "Le lapin mange une carotte.", "Ana peint une fleur.",
  "Il neige dehors.", "Ma sœur lit un livre.", "Le bébé dort.", "Leo aime le ballon.", "Les enfants rient.", "Priya nage dans le lac.", "Le poisson nage vite.",
];

function sentenceItems(): FrItem[] {
  return SENTENCES.map((s): FrItem => {
    const lower = s[0].toLowerCase() + s.slice(1);
    const noDots = s.slice(0, -1);
    return [
      "Quelle phrase est bien écrite?",
      s,
      [lower, noDots, lower.slice(0, -1), s.replace(/ /, "")],
      "A sentence starts with a capital letter, has a space between words and ends with a period.",
      "✍️",
    ];
  });
}

// ---------- Est-ce que… ----------

const QUESTIONS: FrItem[] = [
  ["Choisis la question.", "Est-ce que tu as un chat?", ["Tu as un chat.", "J'ai un chat."], "A question starts with “Est-ce que” and ends with a question mark.", "❓"],
  ["Choisis la question.", "Est-ce que Léa joue au parc?", ["Léa joue au parc.", "Léa joue au parc!"], "“Est-ce que” turns a sentence into a question.", "❓"],
  ["Choisis la question.", "Est-ce que le chat dort?", ["Le chat dort.", "Le chat dort bien."], "Questions end with “?”.", "❓"],
  ["Choisis la question.", "Est-ce que tu aimes la pizza?", ["Tu aimes la pizza.", "J'aime la pizza."], "“Est-ce que” starts the question.", "❓"],
  ["Choisis la question.", "Est-ce que nous allons au parc?", ["Nous allons au parc.", "Allons au parc!"], "Look for “Est-ce que” and “?”.", "❓"],
  ["Choisis la question.", "Est-ce que Kenji mange une pomme?", ["Kenji mange une pomme.", "Kenji aime les pommes."], "Questions start with “Est-ce que” here.", "❓"],
  ["Comment poser cette question? Tu as un frère.", "Est-ce que tu as un frère?", ["Est-ce que tu as un frère.", "Tu as un frère."], "Add “Est-ce que” at the start and “?” at the end.", "👦"],
  ["Comment poser cette question? Il pleut.", "Est-ce qu'il pleut?", ["Est-ce que il pleut?", "Il pleut."], "Before “il”, “est-ce que” becomes “est-ce qu'”.", "🌧️"],
  ["Choisis la question.", "Est-ce que Maya chante?", ["Maya chante.", "Maya chante!"], "A question starts with “Est-ce que” and ends with “?”.", "🎤"],
  ["Choisis la question.", "Est-ce que tu veux jouer?", ["Tu veux jouer.", "Tu veux jouer!"], "A question starts with “Est-ce que” and ends with “?”.", "🎲"],
  ["Choisis la question.", "Est-ce que Zoé a faim?", ["Zoé a faim.", "Zoé a faim!"], "A question starts with “Est-ce que” and ends with “?”.", "🍽️"],
  ["Choisis la question.", "Est-ce que tu aimes les fraises?", ["Tu aimes les fraises.", "Tu aimes les fraises!"], "A question starts with “Est-ce que” and ends with “?”.", "🍓"],
  ["Choisis la question.", "Est-ce que le chien court?", ["Le chien court.", "Le chien court!"], "A question starts with “Est-ce que” and ends with “?”.", "🐕"],
  ["Choisis la question.", "Est-ce que nous allons à l'école?", ["Nous allons à l'école.", "Nous allons à l'école!"], "A question starts with “Est-ce que” and ends with “?”.", "🏫"],
  ["Choisis la question.", "Est-ce que tu lis un livre?", ["Tu lis un livre.", "Tu lis un livre!"], "A question starts with “Est-ce que” and ends with “?”.", "📖"],
  ["Choisis la question.", "Est-ce que Léo dessine?", ["Léo dessine.", "Léo dessine!"], "A question starts with “Est-ce que” and ends with “?”.", "🖍️"],
  ["Comment poser cette question? Tu veux du lait.", "Est-ce que tu veux du lait?", ["Est-ce que tu veux du lait.", "Tu veux du lait."], "Add “Est-ce que” at the start and “?” at the end.", "🥛"],
  ["Comment poser cette question? Maya aime le bleu.", "Est-ce que Maya aime le bleu?", ["Est-ce que Maya aime le bleu.", "Maya aime le bleu."], "Add “Est-ce que” at the start and “?” at the end.", "💙"],
  ["Comment poser cette question? Tu as faim.", "Est-ce que tu as faim?", ["Est-ce que tu as faim.", "Tu as faim."], "Add “Est-ce que” at the start and “?” at the end.", "🍞"],
  ["Comment poser cette question? Léo court.", "Est-ce que Léo court?", ["Est-ce que Léo court.", "Léo court."], "Add “Est-ce que” at the start and “?” at the end.", "🏃"],
  ["Comment poser cette question? Il neige.", "Est-ce qu'il neige?", ["Est-ce que il neige?", "Il neige."], "Before “il”, “est-ce que” becomes “est-ce qu'”.", "❄️"],
  ["Comment poser cette question? Elle chante.", "Est-ce qu'elle chante?", ["Est-ce que elle chante?", "Elle chante."], "Before “elle”, “est-ce que” becomes “est-ce qu'”.", "🎶"],
  ["Comment poser cette question? Il est content.", "Est-ce qu'il est content?", ["Est-ce que il est content?", "Il est content."], "Before “il”, “est-ce que” becomes “est-ce qu'”.", "😃"],
  ["Comment poser cette question? Ana joue.", "Est-ce qu'Ana joue?", ["Est-ce que Ana joue?", "Ana joue."], "Before “Ana”, “est-ce que” becomes “est-ce qu'”.", "🎈"],
];

// ---------- Verbes d'action ----------

interface Verb {
  sentence: string; // with ___
  right: string;
  wrong: string[];
}

const VERBS: Verb[] = [
  { sentence: "Léa ___ une chanson.", right: "chante", wrong: ["chanter", "chantons", "chantent"] },
  { sentence: "Je ___ une pomme.", right: "mange", wrong: ["manges", "mangeons", "mangent"] },
  { sentence: "Tu ___ au ballon.", right: "joues", wrong: ["joue", "jouons", "jouent"] },
  { sentence: "Amir ___ très haut.", right: "saute", wrong: ["sautes", "sautons", "sautent"] },
  { sentence: "Nous ___ dans la classe.", right: "dansons", wrong: ["danse", "danses", "dansent"] },
  { sentence: "Les enfants ___ dans le parc.", right: "courent", wrong: ["cours", "court", "courons"] },
  { sentence: "Maya et Zoé ___ un dessin.", right: "dessinent", wrong: ["dessine", "dessines", "dessinons"] },
  { sentence: "Mon chat ___ sur le lit.", right: "dort", wrong: ["dors", "dormons", "dorment"] },
  { sentence: "Je ___ à la maison.", right: "reste", wrong: ["restes", "restons", "restent"] },
  { sentence: "Noé ___ dans le lac.", right: "nage", wrong: ["nages", "nageons", "nagent"] },
  { sentence: "Tu ___ une histoire.", right: "lis", wrong: ["lit", "lisons", "lisent"] },
  { sentence: "Je ___ un dessin.", right: "dessine", wrong: ["dessines", "dessinons", "dessinent"] },
  { sentence: "Léo ___ la porte.", right: "ferme", wrong: ["fermes", "fermons", "ferment"] },
  { sentence: "Nous ___ une chanson.", right: "chantons", wrong: ["chante", "chantes", "chantent"] },
  { sentence: "Les oiseaux ___ dans le ciel.", right: "volent", wrong: ["vole", "voles", "volons"] },
  { sentence: "Tu ___ la télé.", right: "regardes", wrong: ["regarde", "regardons", "regardent"] },
  { sentence: "Ana ___ du lait.", right: "boit", wrong: ["bois", "buvons", "boivent"] },
  { sentence: "Nous ___ à l'école.", right: "marchons", wrong: ["marche", "marches", "marchent"] },
  { sentence: "Je ___ mon ami.", right: "aide", wrong: ["aides", "aidons", "aident"] },
  { sentence: "Kenji ___ une balle.", right: "lance", wrong: ["lances", "lançons", "lancent"] },
  { sentence: "Les élèves ___ en classe.", right: "écoutent", wrong: ["écoute", "écoutes", "écoutons"] },
  { sentence: "Tu ___ un gâteau.", right: "prépares", wrong: ["prépare", "préparons", "préparent"] },
  { sentence: "Lena ___ la table.", right: "nettoie", wrong: ["nettoies", "nettoyons", "nettoient"] },
  { sentence: "Mes amis ___ au parc.", right: "jouent", wrong: ["joue", "joues", "jouons"] },
];

function verbItems(): FrItem[] {
  return VERBS.map((v): FrItem => [
    `Complète : ${v.sentence}`,
    v.right,
    v.wrong,
    "Look at who is doing the action. The verb ending changes with the person.",
    "🏃",
  ]);
}

// ---------- Couleurs et adjectifs ----------

const COLOURS: Pair[] = [
  ["🔴", "rouge"], ["🔵", "bleu"], ["🟢", "vert"], ["🟡", "jaune"], ["🟠", "orange"], ["🟣", "violet"], ["⚫", "noir"], ["⚪", "blanc"], ["🟤", "brun"],
];

const DESCRIBE: FrItem[] = [
  ["Un éléphant est…", "grand", ["petit", "court"], "An elephant is a very big animal.", "🐘"],
  ["Une souris est…", "petite", ["grande", "géante"], "A mouse is a small animal. For “une souris” we say “petite”.", "🐭"],
  ["Le feu est…", "chaud", ["froid", "doux"], "Fire is hot: “chaud”.", "🔥"],
  ["La glace est…", "froide", ["chaude", "brûlante"], "Ice is cold. For “la glace” we say “froide”.", "🧊"],
  ["Le citron est…", "jaune", ["bleu", "violet"], "Think of the colour of a lemon.", "🍋"],
  ["La neige est…", "blanche", ["noire", "verte"], "Snow is white. For “la neige” we say “blanche”.", "❄️"],
  ["La fraise mûre est…", "rouge", ["bleue", "noire"], "Think of a ripe strawberry.", "🍓"],
  ["Le ciel d'une belle journée est…", "bleu", ["rouge", "vert"], "On a clear day, the sky is blue.", "☀️"],
  ["La tortue est…", "lente", ["rapide", "bruyante"], "A turtle moves slowly: “lente”.", "🐢"],
  ["Le guépard est…", "rapide", ["lent", "petit"], "A cheetah runs very fast: “rapide”.", "🐆"],
  ["Le soleil est…", "chaud", ["froid", "mouillé"], "The sun makes us warm: “chaud”.", "☀️"],
  ["La girafe est…", "grande", ["petite", "courte"], "A giraffe is very tall. For “la girafe” we say “grande”.", "🦒"],
  ["Le bébé est…", "petit", ["grand", "géant"], "A baby is small: “petit”.", "👶"],
  ["L'herbe est…", "verte", ["rouge", "bleue"], "Grass is green. For “l'herbe” we say “verte”.", "🌱"],
  ["Le nuage est…", "blanc", ["noir", "vert"], "A fluffy cloud is white: “blanc”.", "☁️"],
  ["La banane est…", "jaune", ["bleue", "noire"], "Think of the colour of a banana.", "🍌"],
];

function couleurs(opts?: GenerateOptions): Question[] {
  return [...vocabQuestions(COLOURS, "Cette couleur est…", opts, 4, FR), ...frQuestions(DESCRIBE, opts, 4, FR)];
}

// ---------- Histoire ou texte qui informe? ----------

const STORY_TEXT: [string, string[]][] = [
  ["Zoé et son chapeau", ["Zoé perd son chapeau rouge. Le vent l'emporte dans le ciel. Un oiseau le rapporte à Zoé."]],
  ["Un nouvel ami", ["Kenji veut un ami. Il invite un petit chien à jouer. Ils courent ensemble dans le parc."]],
  ["Le gâteau de Maya", ["Maya fait un gâteau. Elle met trop de sucre! Tout le monde rit."]],
  ["Le petit ours", ["Le petit ours a peur du noir. Sa maman allume une lampe. Il s'endort."]],
  ["Une étoile dans la poche", ["Léo trouve une étoile dans son jardin. Il la garde dans sa poche. Le soir, elle brille."]],
  ["Le dragon timide", ["Un petit dragon est timide. Une fille lui sourit. Ils deviennent amis."]],
  ["Ana et la lune", ["Ana regarde la lune par la fenêtre. Elle fait un vœu. Puis elle s'endort."]],
  ["Le chat perdu", ["Ravi cherche son chat. Il l'appelle partout. Le chat dort dans le panier!"]],
  ["La soupe magique", ["Lena fait une soupe. Elle dit un mot magique. La soupe devient rose!"]],
  ["Le robot et la fleur", ["Un robot voit une fleur. Il l'arrose avec soin. La fleur lui dit merci."]],
  ["Noé et le vent", ["Noé lance son cerf-volant. Le vent le fait danser. Noé court derrière."]],
  ["La petite souris", ["Une petite souris cherche du fromage. Elle entre dans la cuisine. Elle trouve un gros morceau."]],
];

const INFO_TEXT: [string, string[]][] = [
  ["Les abeilles", ["Les abeilles font du miel. Elles vivent dans une ruche."]],
  ["Les ours", ["Les ours dorment longtemps en hiver. Au printemps, ils cherchent de la nourriture."]],
  ["La Terre", ["La Terre tourne autour du Soleil. Un tour dure une année."]],
  ["Les castors", ["Les castors construisent des barrages avec des branches. Ils vivent près de l'eau."]],
  ["Les arbres", ["Beaucoup d'arbres perdent leurs feuilles en automne. Elles tombent sur le sol."]],
  ["Les poissons", ["Les poissons vivent dans l'eau. Ils respirent avec des branchies."]],
  ["La lune", ["La Lune tourne autour de la Terre. Elle ne fait pas de lumière toute seule."]],
  ["Les fourmis", ["Les fourmis vivent en groupe. Elles transportent de la nourriture."]],
  ["Les pommes", ["Les pommes poussent sur des arbres. On les cueille à la fin de l'été."]],
  ["Les oiseaux", ["Les oiseaux ont des plumes. Beaucoup d'oiseaux construisent un nid."]],
  ["La pluie", ["La pluie tombe des nuages. Elle donne de l'eau aux plantes."]],
  ["Les grenouilles", ["Les grenouilles pondent des œufs dans l'eau. Les petits s'appellent des têtards."]],
];

const KIND: FrItem[] = [
  ...STORY_TEXT.map(([title, paragraphs]): FrItem => [
    "Est-ce une histoire ou un texte qui informe?",
    "Une histoire",
    ["Un texte qui informe"],
    "A story has characters and things that happen. A text that informs gives facts.",
    { type: "passage", title, paragraphs },
  ]),
  ...INFO_TEXT.map(([title, paragraphs]): FrItem => [
    "Est-ce une histoire ou un texte qui informe?",
    "Un texte qui informe",
    ["Une histoire"],
    "A text that informs gives facts. A story has characters and things that happen.",
    { type: "passage", title, paragraphs },
  ]),
];

// ---------- Éléments d'une histoire ----------

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
  { lines: ["Priya aide son grand-père.", "Ils plantent des carottes dans le potager.", "Après la pluie, les carottes poussent."], who: "Priya", whoWrong: ["les carottes", "la pluie"], where: "Dans le potager", whereWrong: ["Au zoo", "Dans le lac"], what: "Ils plantent des carottes", whatWrong: ["Ils font un gâteau", "Ils vont à la plage"] },
  { lines: ["Le petit renard cherche sa maison.", "Il traverse la forêt.", "Il trouve sa famille."], who: "Le petit renard", whoWrong: ["la forêt", "la famille"], where: "Dans la forêt", whereWrong: ["À la ville", "Sur la plage"], what: "Il trouve sa famille", whatWrong: ["Il perd son chapeau", "Il mange un gâteau"] },
  { lines: ["Ravi et Ana font un bonhomme de neige.", "Ils sont dans la cour.", "Ils lui mettent un grand chapeau."], who: "Ravi et Ana", whoWrong: ["le chapeau", "la cour"], where: "Dans la cour", whereWrong: ["À la piscine", "Dans la cuisine"], what: "Ils font un bonhomme de neige", whatWrong: ["Ils nagent", "Ils lisent"] },
  { lines: ["Le robot Bip arrive à l'école.", "Il aide les élèves à ranger.", "Tout le monde dit merci."], who: "Le robot Bip", whoWrong: ["l'école", "les élèves"], where: "À l'école", whereWrong: ["Au parc", "À la plage"], what: "Il aide les élèves à ranger", whatWrong: ["Il dort", "Il joue au ballon"] },
  { lines: ["Lena cherche son livre.", "Elle regarde dans sa chambre.", "Elle le trouve sous le lit."], who: "Lena", whoWrong: ["le livre", "le lit"], where: "Dans sa chambre", whereWrong: ["Au parc", "Dans la forêt"], what: "Elle cherche son livre", whatWrong: ["Elle fait un gâteau", "Elle nage"] },
  { lines: ["Kenji veut une glace.", "Il va au marché.", "Il achète une glace à la fraise."], who: "Kenji", whoWrong: ["le marché", "la glace"], where: "Au marché", whereWrong: ["À l'école", "Dans la forêt"], what: "Il achète une glace", whatWrong: ["Il fait un dessin", "Il joue au ballon"] },
  { lines: ["Zoé et sa tortue vont au parc.", "Il fait beau.", "Elles regardent les oiseaux."], who: "Zoé et sa tortue", whoWrong: ["le parc", "les oiseaux"], where: "Au parc", whereWrong: ["À la piscine", "Dans la classe"], what: "Elles regardent les oiseaux", whatWrong: ["Elles dorment", "Elles nagent"] },
  { lines: ["Amir trouve un ballon rouge.", "Il est dans la rue.", "Amir le rapporte à son ami."], who: "Amir", whoWrong: ["le ballon", "la rue"], where: "Dans la rue", whereWrong: ["Dans la cuisine", "À la plage"], what: "Il rapporte le ballon", whatWrong: ["Il perd son chapeau", "Il fait un gâteau"] },
];

const ORDERS: { prompt: string; hint: string; items: string[] }[] = [
  { prompt: "Mets l'histoire dans l'ordre.", hint: "Think about what happens first, next and last.", items: ["Léa a faim.", "Elle prend une pomme.", "Elle mange la pomme."] },
  { prompt: "Mets l'histoire dans l'ordre.", hint: "Think about what happens first, next and last.", items: ["Amir voit la pluie.", "Il met ses bottes.", "Il saute dans les flaques."] },
  { prompt: "Mets l'histoire dans l'ordre.", hint: "A plant starts as a seed, then grows.", items: ["Maya plante une graine.", "Elle arrose la graine.", "Une fleur pousse."] },
  { prompt: "Mets l'histoire dans l'ordre.", hint: "Think about what happens first, next and last.", items: ["Il fait nuit.", "Ana se brosse les dents.", "Elle va au lit."] },
  { prompt: "Mets l'histoire dans l'ordre.", hint: "Think about what happens first, next and last.", items: ["Noé a soif.", "Il prend un verre d'eau.", "Il boit l'eau."] },
];

function elements(opts?: GenerateOptions): Question[] {
  const items: FrItem[] = TALES.flatMap((t): FrItem[] => {
    const visual = { type: "story" as const, lines: t.lines };
    return [
      ["Qui est le personnage?", t.who, t.whoWrong, "The character is who the story is about.", visual],
      ["Où se passe l'histoire?", t.where, t.whereWrong, "The setting is the place where the story happens.", visual],
      ["Que se passe-t-il?", t.what, t.whatWrong, "The event is what happens in the story.", visual],
    ];
  });
  const choices = frQuestions(items, opts, 6, FR);
  const orders = sample(ORDERS, 2).map((o) => frOrder(o.prompt, o.hint, o.items, FR));
  return [...choices, ...orders];
}

export const course: Course = {
  grade: "1",
  subject: "immersion",
  bigIdeas: {
    "ca-bc": [
      "Communicating in French fosters a sense of belonging to the Francophone community.",
      "As our vocabulary increases, so does our ability to make ourselves understood.",
      "Our ability to communicate in a new language improves as we take risks in that language.",
      "Readers must not only decode words, but also understand the meaning of a text.",
      "Texts follow specific structures, depending on their type.",
    ],
  },
  units: [
    {
      id: "je-me-presente",
      title: "Je me présente",
      emoji: "🙋",
      blurb: "Parler de moi",
      parentNote: "Speaking about oneself and one's daily life with simple sentence patterns: my name, age, likes and feelings.",
      standards: { "ca-bc": "Speak about oneself and one's daily life; reproduce simple sentence structures in oral self-expression" },
      generate: (o) => frQuestions(ABOUT_ME, o, 8, FR),
    },
    {
      id: "majuscule-et-point",
      title: "Majuscule et point",
      emoji: "✍️",
      blurb: "Écrire une phrase",
      parentNote: "Writing conventions: capital letters, spaces between words and end punctuation.",
      standards: { "ca-bc": "Writing conventions: uppercase and lowercase letters, spaces between words, punctuation" },
      generate: (o) => frQuestions(sentenceItems(), o, 8, FR),
    },
    {
      id: "est-ce-que",
      title: "Est-ce que…?",
      emoji: "❓",
      blurb: "Poser des questions",
      parentNote: "Forming questions with “est-ce que” and recognizing the question mark.",
      standards: { "ca-bc": "Language elements: formulation of questions using “est-ce que”" },
      generate: (o) => frQuestions(QUESTIONS, o, 8, FR),
    },
    {
      id: "verbes-d-action",
      title: "Les verbes d'action",
      emoji: "🏃",
      blurb: "Je saute, tu cours",
      parentNote: "Present-tense endings of common action verbs, matched to the person doing the action.",
      standards: { "ca-bc": "Language elements: present indicative of action verbs; simple affirmative sentences" },
      generate: (o) => frQuestions(verbItems(), o, 8, FR),
    },
    {
      id: "couleurs-et-adjectifs",
      title: "Couleurs et adjectifs",
      emoji: "🎨",
      blurb: "Décrire avec des mots",
      parentNote: "Colours and simple adjectives to describe people, animals and things, including feminine forms.",
      standards: { "ca-bc": "Language elements: adjectives; recognize frequently encountered words" },
      generate: couleurs,
    },
    {
      id: "histoire-ou-texte",
      title: "Histoire ou texte?",
      emoji: "📚",
      blurb: "Raconter ou informer",
      parentNote: "Telling a story apart from an informational text, a key reading skill in Grade 1.",
      standards: { "ca-bc": "Text organization: structure of a story and structure of an informational text" },
      generate: (o) => frQuestions(KIND, o, 8, FR),
    },
    {
      id: "elements-d-une-histoire",
      title: "Dans l'histoire",
      emoji: "📖",
      blurb: "Qui, où, quoi, ordre",
      parentNote: "Elements of a story (characters, setting, events) and putting events in order to retell a story.",
      standards: { "ca-bc": "Elements of a story: characters, settings, events; structure of a story" },
      generate: elements,
    },
  ],
};
