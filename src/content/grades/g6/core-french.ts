import { coreQuestions, tagCoreFrench, type FrItem } from "../../french";
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
  }).map(tagCoreFrench);
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
  ["Which question word means “how”?", "Comment", ["Quand", "Qui"], Q_HINT],
  ["Choose the best word: “___ vas-tu à l'école?” (How do you get to school?)", "Comment", ["Qui", "Où"], Q_HINT],
  ["Choose the best word: “___ de livres as-tu?” (How many books do you have?)", "Combien", ["Qui", "Où"], Q_HINT],
  ["Choose the best word: “___ pleures-tu?” (Why are you crying?)", "Pourquoi", ["Qui", "Quand"], Q_HINT],
  ["Which answer fits “Quand est la fête?”", "Samedi à midi.", ["Au parc.", "Mon cousin."], Q_HINT],
  ["Which answer fits “Comment vas-tu?”", "Je vais très bien.", ["Il est lundi.", "À l'école."], Q_HINT],
  ["Which answer fits “Pourquoi es-tu en retard?”", "Parce que j'ai manqué l'autobus.", ["Demain matin.", "Dans mon sac."], "“Pourquoi” asks for a reason, and the answer starts with “parce que”."],
  ["Which answer fits “Combien coûte le livre?”", "Il coûte dix dollars.", ["Il est sur la table.", "Parce qu'il est bon."], Q_HINT],
  ["Which answer fits “Où vas-tu en vacances?”", "Je vais à la plage.", ["Je vais bien.", "C'est mon oncle."], Q_HINT],
  ["How do you ask “Who is your best friend?”", "Qui est ton meilleur ami?", ["Où est ton meilleur ami?", "Quand est ton meilleur ami?"], Q_HINT],
  ["How do you ask “How many students are there?”", "Combien d'élèves y a-t-il?", ["Comment d'élèves y a-t-il?", "Pourquoi d'élèves y a-t-il?"], Q_HINT],
  ["How do you ask “When is the game?”", "Quand est le match?", ["Où est le match?", "Qui est le match?"], Q_HINT],
  ["How do you ask “Why are you laughing?”", "Pourquoi ris-tu?", ["Où ris-tu?", "Combien ris-tu?"], Q_HINT],
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
  ["Complète : Je joue ___ volleyball.", "au", ["du", "de la"], HOBBY_HINT],
  ["Complète : Elle joue ___ flûte.", "de la", ["au", "à la"], HOBBY_HINT],
  ["Complète : Nous faisons ___ ski.", "du", ["de la", "au"], HOBBY_HINT],
  ["Complète : Il fait ___ danse.", "de la", ["du", "au"], HOBBY_HINT],
  ["Complète : Tu joues ___ violon.", "du", ["au", "à la"], HOBBY_HINT],
  ["Complète : Elles jouent ___ cartes.", "aux", ["au", "de la"], "“Jouer aux cartes” uses “aux” because cartes is plural: à + les = aux."],
  ["What does “Il fait du patinage” mean?", "He goes skating", ["He goes swimming", "He goes skiing"], HOBBY_HINT],
  ["How do you say “I play the drums”?", "Je joue de la batterie.", ["Je joue à la batterie.", "Je fais de la batterie."], HOBBY_HINT],
  ["How do you say “She likes to read”?", "Elle aime lire.", ["Elle aime courir.", "Elle aime cuisiner."], HOBBY_HINT],
  ["What does “Mon passe-temps préféré est le dessin” mean?", "My favourite hobby is drawing", ["My favourite hobby is dancing", "My favourite hobby is singing"], HOBBY_HINT],
  ["Which hobby is “la danse”?", "dancing", ["skiing", "reading"], HOBBY_HINT],
  ["Which hobby is “le patinage”?", "skating", ["swimming", "cooking"], HOBBY_HINT],
  ["How do you say “We play soccer”?", "Nous jouons au soccer.", ["Nous jouons du soccer.", "Nous faisons au soccer."], HOBBY_HINT],
  ["How do you say “They like to sing”?", "Ils aiment chanter.", ["Ils aime chanter.", "Ils aiment chantent."], HOBBY_HINT],
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
  ["Which reason fits: “J'aime la musique…”?", "parce que c'est relaxant", ["parce que j'ai un frère", "parce qu'il est mardi"], BECAUSE_HINT],
  ["Which reason fits: “J'adore la lecture…”?", "parce que j'aime les histoires", ["parce que j'ai faim", "parce qu'il neige"], BECAUSE_HINT],
  ["Which reason fits: “Je n'aime pas les devoirs…”?", "parce que c'est long", ["parce que c'est amusant", "parce que c'est délicieux"], BECAUSE_HINT],
  ["Which reason fits: “J'aime le printemps…”?", "parce que les fleurs poussent", ["parce qu'il est midi", "parce que j'ai dix ans"], BECAUSE_HINT],
  ["Which reason fits: “Je mange des légumes…”?", "parce que c'est bon pour la santé", ["parce que c'est mon crayon", "parce que le ciel est grand"], BECAUSE_HINT],
  ["Complète : Je suis content ___ c'est vendredi.", "parce que", ["pourquoi", "parce qu'"], BECAUSE_HINT],
  ["Complète : Il porte un manteau ___ il fait froid.", "parce qu'", ["parce que", "pourquoi"], "Before il, elle, on, un and une, “parce que” becomes “parce qu'”: parce qu'il fait froid."],
  ["Complète : Elle sourit ___ elle est heureuse.", "parce qu'", ["parce que", "pourquoi"], "Before il, elle, on, un and une, “parce que” becomes “parce qu'”: parce qu'elle est heureuse."],
  ["What does “Je mange parce que j'ai faim” mean?", "I eat because I am hungry", ["I am hungry because I eat", "I eat with my friend"], BECAUSE_HINT],
  ["What does “Il rit parce que le film est drôle” mean?", "He laughs because the movie is funny", ["The movie is funny because he laughs", "He watches the funny movie again"], BECAUSE_HINT],
  ["How do you say “I am happy because it is sunny”?", "Je suis content parce qu'il y a du soleil.", ["Je suis content pourquoi il y a du soleil.", "Je suis content parce il y a du soleil."], BECAUSE_HINT],
  ["How do you say “She is tired because she plays a lot”?", "Elle est fatiguée parce qu'elle joue beaucoup.", ["Elle est fatiguée pourquoi elle joue beaucoup.", "Elle est fatiguée parce elle joue beaucoup."], BECAUSE_HINT],
  ["Which answer fits “Pourquoi aimes-tu les chiens?”", "Parce qu'ils sont gentils.", ["Dans le parc.", "Mon chien s'appelle Max."], "“Pourquoi” asks for a reason, and the answer starts with “parce que”."],
  ["Which answer fits “Pourquoi es-tu fâché?”", "Parce que j'ai perdu mon jeu.", ["À midi.", "Avec mon ami."], "“Pourquoi” asks for a reason, and the answer starts with “parce que”."],
  ["Which sentence gives a reason?", "Je prends mon manteau parce qu'il neige.", ["Je prends mon manteau.", "Il neige beaucoup."], BECAUSE_HINT],
  ["Which sentence gives a reason?", "Elle joue au hockey parce qu'elle aime patiner.", ["Elle joue au hockey.", "Elle aime patiner."], BECAUSE_HINT],
  ["Which question asks for a reason?", "Pourquoi aimes-tu l'automne?", ["Quand aimes-tu l'automne?", "Où aimes-tu l'automne?"], "“Pourquoi” means why, and it asks for a reason."],
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
  ["How do you say “I am nervous”?", "Je suis nerveux.", ["J'ai nerveux.", "Je nerveux."], STATE_HINT],
  ["How do you say “I am proud”?", "Je suis fier.", ["J'ai fier.", "Je fier."], STATE_HINT],
  ["How do you say “I am right”?", "J'ai raison.", ["Je suis raison.", "Je raison."], "In French we “have” reason: j'ai raison, tu as tort (you are wrong)."],
  ["How do you say “I am lucky”?", "J'ai de la chance.", ["Je suis chance.", "Je chance."], "In French we “have luck”: j'ai de la chance."],
  ["How do you say “I am ten years old”?", "J'ai dix ans.", ["Je suis dix ans.", "Je dix ans."], "In French we “have” our age: j'ai dix ans."],
  ["How do you say “You are afraid”?", "Tu as peur.", ["Tu es peur.", "Tu peur."], STATE_HINT],
  ["What does “Il a peur du noir” mean?", "He is afraid of the dark", ["He is happy in the dark", "He is bored at night"], STATE_HINT],
  ["What does “Elles sont surprises” mean?", "They are surprised", ["They are tired", "They are hungry"], STATE_HINT],
  ["What does “Nous avons soif” mean?", "We are thirsty", ["We are cold", "We are sleepy"], STATE_HINT],
  ["What does “J'ai mal au ventre” mean?", "I have a stomachache", ["I have a headache", "I have a sore throat"], "“Avoir mal à…” means to have pain in a part of the body."],
  ["Which sentence means “He is thirsty”?", "Il a soif.", ["Il est soif.", "Elle a soif."], STATE_HINT],
  ["Which sentence means “They are cold”?", "Ils ont froid.", ["Ils sont froid.", "Il a froid."], STATE_HINT],
  ["Which word means “angry”?", "fâché", ["content", "fatigué"], STATE_HINT],
  ["Which word means “sad”?", "triste", ["content", "fâché"], STATE_HINT],
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
  ["Complète : Voici ___ tante. (my aunt)", "ma", ["mon", "mes"], FAM_HINT],
  ["Complète : Voici ___ oncle. (my uncle)", "mon", ["ma", "mes"], FAM_HINT],
  ["Complète : Voici ___ cousins. (my cousins)", "mes", ["mon", "ma"], FAM_HINT],
  ["Complète : Zoé aime ___ frère. (her brother)", "son", ["sa", "ses"], FAM_HINT],
  ["Complète : Kenji aime ___ sœur. (his sister)", "sa", ["son", "ses"], FAM_HINT],
  ["Complète : Léa et Noah aiment ___ école. (their school)", "leur", ["leurs", "nos"], "“Leur” is for one thing and “leurs” is for many: leur école, leurs amis."],
  ["Complète : Les enfants aiment ___ jouets. (their toys)", "leurs", ["leur", "notre"], "“Leur” is for one thing and “leurs” is for many: leur école, leurs amis."],
  ["Complète : Nous aimons ___ maison. (our house)", "notre", ["nos", "mes"], "“Notre” is for one thing and “nos” is for many: notre école, nos amis."],
  ["Complète : Tu aimes ___ amie Priya? (your friend)", "ton", ["ta", "tes"], "Before a vowel sound we use “ton”, even for a feminine noun: ton amie."],
  ["What is “un petit-fils”?", "a grandson", ["a nephew", "a cousin"], FAM_HINT],
  ["What is “une nièce”?", "a niece", ["a cousin", "an aunt"], FAM_HINT],
  ["How do you say “my grandfather”?", "mon grand-père", ["ma grand-père", "mes grand-père"], FAM_HINT],
  ["How do you say “my little brother”?", "mon petit frère", ["ma petit frère", "mes petit frère"], FAM_HINT],
  ["How do you say “her friends”?", "ses amis", ["son amis", "sa amis"], FAM_HINT],
  ["How do you say “my twin sister”?", "ma sœur jumelle", ["mon sœur jumelle", "mes sœur jumelle"], FAM_HINT],
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
  ["Which Canadian city has the largest French-speaking population?", "Montréal", ["Vancouver", "Calgary"], COMM2_HINT],
  ["Which province has the most French speakers?", "Québec", ["Alberta", "Manitoba"], COMM2_HINT],
  ["The Fransaskois community is found in…", "Saskatchewan", ["Nova Scotia", "Yukon"], COMM2_HINT],
  ["Franco-Albertan communities are found in…", "Alberta", ["Prince Edward Island", "Saskatchewan"], COMM2_HINT],
  ["Acadian communities are found mainly in…", "Atlantic Canada", ["the Prairies", "the Pacific coast"], COMM2_HINT],
  ["The Festival du Voyageur is held every winter in…", "Winnipeg, Manitoba", ["Victoria, British Columbia", "St. John's, Newfoundland"], COMM2_HINT],
  ["The Festival du Voyageur celebrates…", "Francophone and Métis heritage and the fur-trade era", ["the potato harvest", "summer sailing"], COMM2_HINT],
  ["A “tourtière” is…", "a traditional meat pie", ["a frozen dessert", "a winter coat"], COMM2_HINT, "🥧"],
  ["Michif is…", "a Métis language that blends French and Cree", ["a kind of bread", "a Québec festival"], "Michif combines French nouns with Cree verbs. It is one of the languages of Métis communities.", "🗣️"],
  ["Francophone communities exist in which northern territory?", "Yukon", ["Prince Edward Island", "Newfoundland and Labrador"], COMM2_HINT],
  ["The fleur-de-lis appears on the provincial flag of…", "Québec", ["Alberta", "Nova Scotia"], COMM2_HINT, "⚜️"],
  ["Acadian National Day is celebrated on…", "August 15", ["July 4", "December 25"], COMM2_HINT],
  ["“Tire d'érable sur la neige” is…", "maple taffy poured on snow", ["ice cream in a cone", "hot chocolate"], COMM2_HINT, "🍁"],
  ["Why is French found in many parts of Canada?", "Francophone people settled and built communities from coast to coast", ["Only Québec has French speakers", "French is taught only in schools"], COMM2_HINT],
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
  ["You find a great picture book online. How do you show respect for the author?", "Name the author and the book in your project", ["Cut off the title", "Say you drew it"], SRC_HINT],
  ["What is a trusted source for a project about Acadian history?", "A book or website from an Acadian museum or historians", ["A rumour a friend told you", "An old joke"], SRC_HINT],
  ["Which is the best way to take notes from a website?", "Write the main ideas in your own words and note the website", ["Copy whole paragraphs", "Take no notes"], SRC_HINT],
  ["A friend gives you their finished essay to hand in as yours. This is…", "plagiarism", ["teamwork", "research"], SRC_HINT],
  ["You use the exact words from a book. What should you add?", "Quotation marks and the title of the book", ["Nothing, it is fine", "A different title"], SRC_HINT],
  ["What is a bibliography?", "A list of the sources you used", ["A story about someone's life", "A drawing for a cover"], SRC_HINT],
  ["Which source is most likely to be accurate for a report on animals?", "An encyclopedia or a trusted nature organization", ["A comment under a video", "A friend's guess"], SRC_HINT],
  ["You want to wear a traditional outfit for a school event. What is respectful?", "Ask someone from that culture and learn what it means", ["Wear it as a funny costume", "Change it for a joke"], SRC_HINT],
  ["Which sentence shows you have learned from a community?", "I interviewed a member of the community, with permission", ["I guessed what they believe", "I copied it from a movie"], SRC_HINT],
  ["Why should you ask permission before sharing a classmate's photo?", "It respects their privacy and choice", ["Photos are heavy", "It is a rule only for teachers"], SRC_HINT],
  ["You are not sure who made an image. What is the best choice?", "Pick a different image whose creator you can name", ["Use it and say it is yours", "Remove the creator's name"], SRC_HINT],
  ["Which is NOT a way to give credit?", "Changing a few words and leaving out the author", ["Naming the author", "Adding a list of sources"], SRC_HINT],
  ["A story belongs to a particular First Nation. What should you do before retelling it?", "Ask the community and give credit", ["Retell it as your own", "Change it to make it funnier"], SRC_HINT],
  ["Your project uses a French song. What do you include?", "The title, the singer and where you found it", ["Only the lyrics", "Nothing at all"], SRC_HINT],
  ["Why is it good to use your own words?", "It shows what you understand", ["It hides the author", "It makes copying faster"], SRC_HINT],
  ["When you learn about a custom you don't know, a good question is…", "“Can you tell me what this means to you?”", ["“Why is that so weird?”", "“Can I wear it as a joke?”"], SRC_HINT],
  ["Which website is most likely to give reliable facts about a Francophone festival?", "The festival's own official site", ["A random comment", "An anonymous post"], SRC_HINT],
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
      generate: (o) => coreQuestions(QUESTIONS, o, 8),
    },
    {
      id: "loisirs",
      title: "Hobbies",
      emoji: "⚽",
      blurb: "Jouer à, jouer de, faire de",
      parentNote: "Talking about hobbies and interests, including the difference between jouer à (sports) and jouer de (instruments).",
      standards: { "ca-bc": "Hobbies and topics of interest" },
      generate: (o) => coreQuestions(HOBBIES, o, 8),
    },
    {
      id: "parce-que",
      title: "Giving reasons",
      emoji: "💭",
      blurb: "Parce que…",
      parentNote: "Explaining likes, dislikes and preferences with “parce que”.",
      standards: { "ca-bc": "Reasons for likes, dislikes and preferences" },
      generate: (o) => coreQuestions(BECAUSE, o, 8),
    },
    {
      id: "emotions-et-etats",
      title: "Feelings and states",
      emoji: "😊",
      blurb: "J'ai faim, je suis content",
      parentNote: "Common emotions and physical states, including the French habit of saying “I have hunger” (j'ai faim) instead of “I am hungry”.",
      standards: { "ca-bc": "Common emotions and physical states" },
      generate: (o) => coreQuestions(STATES, o, 8),
    },
    {
      id: "famille",
      title: "Family and friends",
      emoji: "👨‍👩‍👧",
      blurb: "Mon, ma, mes, son, sa, ses",
      parentNote: "Describing family members and friends, with the possessive words that match what is owned.",
      standards: { "ca-bc": "Descriptions of people and items" },
      generate: (o) => coreQuestions(FAMILY, o, 8),
    },
    {
      id: "communautes-francophones",
      title: "Francophone communities",
      emoji: "🌎",
      blurb: "Acadian, Métis, and more",
      parentNote: "Communities where French is spoken across Canada, including Acadian, Franco-Albertan, Franco-Columbian, Fransaskois, Québécois and Métis communities.",
      standards: { "ca-bc": "Communities where French is spoken across Canada, including Acadian, Franco-Albertan, Franco-Columbian, Fransaskois, Québécois and Métis communities" },
      generate: (o) => coreQuestions(COMMUNITIES, o, 8),
    },
    {
      id: "sources-et-respect",
      title: "Sources and respect",
      emoji: "🤝",
      blurb: "Credit, culture, honesty",
      parentNote: "The ethics of plagiarism and cultural appropriation: naming sources, using your own words and learning about cultures from the people who live them.",
      standards: { "ca-bc": "The ethics of cultural appropriation and plagiarism" },
      generate: (o) => coreQuestions(RESPECT, o, 8),
    },
  ],
};
