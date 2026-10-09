import { frQuestions, type FrItem } from "../../french";
import { sample, textChoice } from "../../random";
import type { Course, GenerateOptions, Question } from "../../types";

// Core French: instructions are in English, the French is what students learn.

// ---------- Letter patterns ----------

interface Pattern {
  letters: string[];
  label: string;
  words: string[];
}

const PATTERNS: Pattern[] = [
  { letters: ["oi"], label: "oi", words: ["roi", "moi", "toi", "loi"] },
  { letters: ["ou"], label: "ou", words: ["rouge", "jour", "nous", "loup"] },
  { letters: ["eau", "au"], label: "eau / au", words: ["bateau", "gâteau", "chaud", "auto"] },
  { letters: ["ch"], label: "ch", words: ["chat", "chien", "chocolat", "chaise"] },
  { letters: ["gn"], label: "gn", words: ["montagne", "signe", "ligne", "champignon"] },
  { letters: ["qu"], label: "qu", words: ["quatre", "quand", "qui", "question"] },
  { letters: ["ai"], label: "ai", words: ["lait", "mais", "jamais", "maison"] },
  { letters: ["on"], label: "on", words: ["bon", "chanson", "mouton", "pont"] },
  { letters: ["an", "en"], label: "an / en", words: ["enfant", "dans", "grand", "vent"] },
];

function motifs(opts?: GenerateOptions): Question[] {
  const wrongCount = opts?.difficulty === 1 ? 1 : opts?.difficulty === 3 ? 3 : 2;
  return sample(PATTERNS, 8).map((p) => {
    const [a, b] = sample(p.words, 2);
    const others = PATTERNS.filter((o) => o !== p).flatMap((o) => o.words).filter((w) => !p.letters.some((l) => w.includes(l)));
    return textChoice(
      `Which word has the same “${p.label}” sound as “${a}”?`,
      b,
      sample(others, wrongCount),
      "In French, the same letter pattern almost always makes the same sound. Say each word out loud and listen for the pattern.",
    );
  });
}

// ---------- Les mots interrogatifs ----------

const Q_HINT = "Question words: qui (who), où (where), quand (when), pourquoi (why), comment (how), combien (how many/much), qu'est-ce que (what).";

const QUESTIONS: FrItem[] = [
  ["Which question word means “why”?", "Pourquoi", ["Qui", "Où"], Q_HINT],
  ["Which question word means “where”?", "Où", ["Quand", "Comment"], Q_HINT],
  ["Which question word means “who”?", "Qui", ["Combien", "Pourquoi"], Q_HINT],
  ["Which question word means “when”?", "Quand", ["Où", "Qui"], Q_HINT],
  ["Which question word means “how many”?", "Combien", ["Comment", "Pourquoi"], Q_HINT],
  ["Choose the best word: “___ est ton professeur?” (Who is your teacher?)", "Qui", ["Où", "Quand"], Q_HINT],
  ["Choose the best word: “___ habites-tu?” (Where do you live?)", "Où", ["Qui", "Pourquoi"], Q_HINT],
  ["Choose the best word: “___ est ton anniversaire?” (When is your birthday?)", "Quand", ["Où", "Combien"], Q_HINT],
  ["Which answer fits “Pourquoi aimes-tu le hockey?”", "Parce que c'est amusant.", ["Au parc.", "À huit heures."], "“Pourquoi” asks for a reason, and the answer starts with “parce que”."],
  ["Which answer fits “Où est l'école?”", "Elle est près du parc.", ["Parce qu'elle est grande.", "Mon frère."], Q_HINT],
  ["Which answer fits “Combien de frères as-tu?”", "J'ai deux frères.", ["Il est grand.", "À la maison."], Q_HINT],
  ["Which answer fits “Qui est-ce?”", "C'est mon ami Amir.", ["C'est à midi.", "C'est en classe."], Q_HINT],
];

// ---------- Loisirs ----------

const HOBBY_HINT = "For sports and games we say jouer à (au hockey, à la balle). For instruments we say jouer de (de la guitare). Many activities use faire: faire du vélo, faire de la natation.";

const HOBBIES: FrItem[] = [
  ["Complète : Je joue ___ hockey.", "au", ["du", "de la"], HOBBY_HINT],
  ["Complète : Elle joue ___ guitare.", "de la", ["au", "à la"], HOBBY_HINT],
  ["Complète : Il fait ___ vélo.", "du", ["de la", "au"], HOBBY_HINT],
  ["Complète : Nous faisons ___ natation.", "de la", ["du", "au"], HOBBY_HINT],
  ["Complète : Tu joues ___ soccer.", "au", ["de la", "du"], HOBBY_HINT],
  ["Complète : Ils jouent ___ piano.", "du", ["au", "à la"], HOBBY_HINT],
  ["What does “Elle aime dessiner et danser” mean?", "She likes to draw and dance", ["She likes to swim and sing", "She likes to read and cook"], HOBBY_HINT],
  ["How do you say “I like to swim”?", "J'aime nager.", ["J'aime danser.", "J'aime chanter."], HOBBY_HINT],
  ["What does “Mon passe-temps préféré est la lecture” mean?", "My favourite hobby is reading", ["My favourite hobby is cooking", "My favourite hobby is skiing"], HOBBY_HINT],
  ["How do you say “We play basketball”?", "Nous jouons au basketball.", ["Nous jouons du basketball.", "Nous faisons au basketball."], HOBBY_HINT],
  ["Which hobby is “la cuisine”?", "cooking", ["painting", "swimming"], HOBBY_HINT],
  ["Which hobby is “la peinture”?", "painting", ["reading", "cooking"], HOBBY_HINT],
];

// ---------- Parce que ----------

const BECAUSE_HINT = "“Parce que” (because) introduces a reason: J'aime l'été parce qu'il fait chaud.";

const BECAUSE: FrItem[] = [
  ["Which sentence gives a reason?", "J'aime l'été parce qu'il fait chaud.", ["J'aime l'été.", "L'été est une saison."], BECAUSE_HINT],
  ["Complète : Je n'aime pas la pluie ___ je suis mouillé.", "parce que", ["pourquoi", "comme ça"], BECAUSE_HINT],
  ["Which reason fits: “J'aime le chocolat…”?", "parce que c'est délicieux", ["parce que c'est fermé", "parce qu'il est lundi"], BECAUSE_HINT],
  ["Which reason fits: “Je déteste l'hiver…”?", "parce qu'il fait très froid", ["parce que c'est mon ami", "parce que j'ai dix ans"], BECAUSE_HINT],
  ["Which reason fits: “J'adore la natation…”?", "parce que c'est amusant", ["parce que c'est ennuyeux", "parce que j'ai mangé"], BECAUSE_HINT],
  ["What does “Je lis parce que j'aime les histoires” mean?", "I read because I like stories", ["I read stories to my friend", "I like to read at school"], BECAUSE_HINT],
  ["How do you say “I like winter because there is snow”?", "J'aime l'hiver parce qu'il y a de la neige.", ["J'aime l'hiver pourquoi il y a de la neige.", "J'aime l'hiver parce il y a neige."], BECAUSE_HINT],
  ["Which sentence gives a reason?", "Il est content parce qu'il a gagné.", ["Il est content.", "Il a gagné le match."], BECAUSE_HINT],
];

// ---------- Émotions et états ----------

const STATE_HINT = "In French we “have” many feelings and states: j'ai faim (I'm hungry), j'ai froid (I'm cold). We use “être” for others: je suis content.";

const STATES: FrItem[] = [
  ["How do you say “I am hungry”?", "J'ai faim.", ["Je suis faim.", "Je faim."], STATE_HINT],
  ["How do you say “I am cold”?", "J'ai froid.", ["Je suis froid.", "Je froid."], STATE_HINT],
  ["How do you say “I am thirsty”?", "J'ai soif.", ["Je suis soif.", "Je soif."], STATE_HINT],
  ["How do you say “I am hot”?", "J'ai chaud.", ["Je suis chaud.", "Je chaud."], STATE_HINT],
  ["How do you say “I am afraid”?", "J'ai peur.", ["Je suis peur.", "Je peur."], STATE_HINT],
  ["How do you say “I am sleepy”?", "J'ai sommeil.", ["Je suis sommeil.", "Je sommeil."], STATE_HINT],
  ["What does “Je suis fatigué” mean?", "I am tired", ["I am happy", "I am hungry"], STATE_HINT],
  ["What does “Elle est contente” mean?", "She is happy", ["She is sad", "She is angry"], STATE_HINT],
  ["What does “Il est fâché” mean?", "He is angry", ["He is shy", "He is excited"], STATE_HINT],
  ["How do you say “We are sad”?", "Nous sommes tristes.", ["Nous avons tristes.", "Nous est triste."], STATE_HINT],
  ["What does “J'ai mal à la tête” mean?", "I have a headache", ["I have a stomachache", "I have a cold"], "“Avoir mal à…” means to have pain in a part of the body."],
  ["Which sentence means “She is hungry”?", "Elle a faim.", ["Elle est faim.", "Il a faim."], STATE_HINT],
];

// ---------- La famille ----------

const FAM_HINT = "“Mon, ma, mes” (my) agree with the thing owned: mon frère, ma sœur, mes parents. “Son, sa, ses” mean his or her.";

const FAMILY: FrItem[] = [
  ["Complète : Voici ___ frère. (my brother)", "mon", ["ma", "mes"], FAM_HINT],
  ["Complète : Voici ___ sœur. (my sister)", "ma", ["mon", "mes"], FAM_HINT],
  ["Complète : Voici ___ parents. (my parents)", "mes", ["mon", "ma"], FAM_HINT],
  ["Complète : Léa aime ___ chat. (her cat)", "son", ["sa", "ses"], FAM_HINT],
  ["Complète : Amir aime ___ école. (his school)", "son", ["sa", "ses"], "Before a vowel sound we use “son”, even for a feminine noun: son école."],
  ["Complète : Maya aime ___ amies. (her friends)", "ses", ["son", "sa"], FAM_HINT],
  ["What is “une tante”?", "an aunt", ["an uncle", "a cousin"], FAM_HINT],
  ["What is “un oncle”?", "an uncle", ["an aunt", "a grandfather"], FAM_HINT],
  ["What is “une grand-mère”?", "a grandmother", ["a mother", "an aunt"], FAM_HINT],
  ["How do you say “my cousin” if your cousin is a girl?", "ma cousine", ["mon cousine", "mes cousine"], FAM_HINT],
  ["How do you say “my best friend” if your friend is a boy?", "mon meilleur ami", ["ma meilleure ami", "mes meilleur ami"], FAM_HINT],
  ["Complète : Nous aimons ___ grands-parents. (our grandparents)", "nos", ["notre", "mes"], "“Notre” is for one thing and “nos” is for many: notre école, nos amis."],
];

// ---------- Communautés francophones ----------

const COMM2_HINT = "Francophone communities across Canada have shaped the country's history, languages, food and music.";

const COMMUNITIES: FrItem[] = [
  ["Saint-Boniface is a historic French-speaking community in…", "Winnipeg, Manitoba", ["Halifax, Nova Scotia", "Victoria, British Columbia"], COMM2_HINT],
  ["Maillardville is a well-known Francophone community in…", "Coquitlam, British Columbia", ["Moncton, New Brunswick", "Regina, Saskatchewan"], COMM2_HINT],
  ["The Acadian flag is…", "the French tricolour with a yellow star", ["a red flag with a maple leaf", "a blue flag with a fleur-de-lis"], "The Acadian flag has blue, white and red stripes and a gold star in the blue stripe.", "🏳️"],
  ["A “cabane à sucre” is a place associated with…", "making maple syrup", ["building boats", "growing wheat"], COMM2_HINT, "🍁"],
  ["Which province is officially bilingual in English and French?", "New Brunswick", ["British Columbia", "Newfoundland and Labrador"], COMM2_HINT],
  ["Canada has how many official languages?", "Two: English and French", ["One: English", "Three"], COMM2_HINT],
  ["Francophone communities in Canada include…", "Acadian, Québécois, Franco-Albertan, Fransaskois and Franco-Columbian communities", ["only Québécois communities", "only communities in the Maritimes"], COMM2_HINT],
  ["Many Métis communities have a connection to French because…", "French-speaking fur traders and Indigenous peoples shared communities and families", ["Métis people only speak French", "French has never been spoken in the West"], "French and Indigenous languages met through the fur trade and family ties. Métis communities have their own cultures and languages, including Michif.", "🤝"],
  ["A “tintamarre” is…", "a noisy, joyful Acadian parade", ["a type of soup", "a school test"], COMM2_HINT],
  ["Winter Carnival in Québec City has a snowman mascot called…", "Bonhomme", ["Père Noël", "Ti-Jean"], COMM2_HINT, "⛄"],
];

// ---------- Sources et respect ----------

const SRC_HINT = "Name your sources and describe cultures with respect. Using elements of a culture without permission or context can misrepresent it.";

const RESPECT: FrItem[] = [
  ["Plagiarism is…", "using someone else's words or work as your own", ["quoting a book and naming it", "writing in your own words"], SRC_HINT],
  ["You quote a sentence from a book. What should you do?", "Use quotation marks and name the source", ["Remove the author's name", "Say you thought of it"], SRC_HINT],
  ["Which is a good way to avoid plagiarism?", "Write ideas in your own words and list your sources", ["Copy and paste from a website", "Ask a friend to write it"], SRC_HINT],
  ["Cultural appropriation means…", "using elements of a culture without permission, in ways that may misrepresent it", ["learning about a culture from the people who live it", "visiting a cultural festival"], SRC_HINT],
  ["Which choice shows respect for a cultural celebration?", "Learn what it means from people who celebrate it", ["Wear its special clothing as a costume", "Make jokes about it"], SRC_HINT],
  ["Your project is about a Francophone festival. Where should you look?", "At trusted sources, ideally from the community itself", ["At the first thing you see online", "At nothing, you can make it up"], SRC_HINT],
  ["You use a photo from a website. What should you do?", "Credit the photo and check you may use it", ["Say you took it", "Crop the credit out"], SRC_HINT],
  ["Why is it important to learn about First Peoples' connections to French?", "To understand the history and people of our communities accurately", ["To decide which culture is better", "To skip other parts of history"], SRC_HINT],
];

export const course: Course = {
  grade: "6",
  subject: "core-french",
  bigIdeas: {
    "ca-bc": [
      "Listening and viewing with intent helps us understand French.",
      "Using various strategies helps us understand and acquire language.",
      "With simple French, we can describe others and their interests.",
      "Reciprocal communication in French is possible using high-frequency vocabulary and sentence structures.",
      "Stories help us to acquire language and understand the world around us.",
      "Learning about Francophone communities helps us develop cultural awareness.",
    ],
  },
  units: [
    {
      id: "motifs-de-lettres",
      title: "Letter patterns",
      emoji: "🔠",
      blurb: "Same letters, same sound",
      parentNote: "Connecting common French letter patterns (oi, ou, eau, ch, gn, qu, ai, on, an) to how they sound.",
      standards: { "ca-bc": "French letter patterns, such as letter groupings with the same sound, rhyming words and consistently pronounced patterns" },
      generate: motifs,
    },
    {
      id: "mots-interrogatifs",
      title: "Question words",
      emoji: "❓",
      blurb: "Qui, où, quand, pourquoi",
      parentNote: "Asking and answering questions with qui, où, quand, pourquoi, comment and combien.",
      standards: { "ca-bc": "Common high-frequency vocabulary and sentence structures: questions" },
      generate: (o) => frQuestions(QUESTIONS, o, 8),
    },
    {
      id: "loisirs",
      title: "Hobbies",
      emoji: "⚽",
      blurb: "Jouer à, jouer de, faire de",
      parentNote: "Talking about hobbies and interests, including the difference between jouer à (sports) and jouer de (instruments).",
      standards: { "ca-bc": "Hobbies and topics of interest" },
      generate: (o) => frQuestions(HOBBIES, o, 8),
    },
    {
      id: "parce-que",
      title: "Giving reasons",
      emoji: "💭",
      blurb: "Parce que…",
      parentNote: "Explaining likes, dislikes and preferences with “parce que”.",
      standards: { "ca-bc": "Reasons for likes, dislikes and preferences" },
      generate: (o) => frQuestions(BECAUSE, o, 8),
    },
    {
      id: "emotions-et-etats",
      title: "Feelings and states",
      emoji: "😊",
      blurb: "J'ai faim, je suis content",
      parentNote: "Common emotions and physical states, including the French habit of saying “I have hunger” (j'ai faim) instead of “I am hungry”.",
      standards: { "ca-bc": "Common emotions and physical states" },
      generate: (o) => frQuestions(STATES, o, 8),
    },
    {
      id: "famille",
      title: "Family and friends",
      emoji: "👨‍👩‍👧",
      blurb: "Mon, ma, mes, son, sa, ses",
      parentNote: "Describing family members and friends, with the possessive words that match what is owned.",
      standards: { "ca-bc": "Descriptions of people and items" },
      generate: (o) => frQuestions(FAMILY, o, 8),
    },
    {
      id: "communautes-francophones",
      title: "Francophone communities",
      emoji: "🌎",
      blurb: "Acadian, Métis, and more",
      parentNote: "Communities where French is spoken across Canada, including Acadian, Franco-Albertan, Franco-Columbian, Fransaskois, Québécois and Métis communities.",
      standards: { "ca-bc": "Communities where French is spoken across Canada, including Acadian, Franco-Albertan, Franco-Columbian, Fransaskois, Québécois and Métis communities" },
      generate: (o) => frQuestions(COMMUNITIES, o, 8),
    },
    {
      id: "sources-et-respect",
      title: "Sources and respect",
      emoji: "🤝",
      blurb: "Credit, culture, honesty",
      parentNote: "The ethics of plagiarism and cultural appropriation: naming sources, using your own words and learning about cultures from the people who live them.",
      standards: { "ca-bc": "The ethics of cultural appropriation and plagiarism" },
      generate: (o) => frQuestions(RESPECT, o, 8),
    },
  ],
};
