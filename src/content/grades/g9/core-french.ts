import { coreQuestions, frOrder, type FrItem } from "../../french";
import type { Course, GenerateOptions, Question } from "../../types";

// Core French 9: instructions are in English, the French is what students learn.

// ---------- Le passé, le présent et le futur ----------

const TIME_HINT = "Choose the tense the time clue calls for: hier and dernier point to the past (passé composé or imparfait), maintenant and aujourd'hui to the present, demain and prochain to the future.";

const TIMES: FrItem[] = [
  ["Complète : Hier, elles ___ au cinéma. (aller)", "sont allées", ["ont allé", "vont aller"], "Aller uses être in the passé composé, and the participle agrees with the subject."],
  ["Complète : Samedi dernier, j'___ un gâteau. (faire)", "ai fait", ["fais", "ferai"], TIME_HINT],
  ["Complète : Ce soir, je ___ regarder un film. (near future)", "vais", ["ai", "suis"], "The near future is aller + an infinitive: je vais regarder."],
  ["Complète : Quand j'étais petit, je ___ souvent aux dessins animés. (jouer, habit)", "jouais", ["jouerai", "joue"], "The imparfait describes habits and background in the past."],
  ["Complète : Hier soir, il ___ un film pendant deux heures. (regarder, finished event)", "a regardé", ["regardera", "regarde"], "The passé composé tells what happened and was finished."],
  ["How do you say “Last weekend, we visited our grandparents”?", "Le week-end dernier, nous avons visité nos grands-parents.", ["Le week-end prochain, nous visitons nos grands-parents.", "Le week-end dernier, nous allons visiter nos grands-parents."], TIME_HINT],
  ["How do you say “Next summer, I am going to travel”?", "L'été prochain, je vais voyager.", ["L'été dernier, j'ai voyagé.", "L'été prochain, je voyageais."], TIME_HINT],
  ["What does “dernier” mean in “la semaine dernière”?", "last", ["next", "every"], TIME_HINT],
  ["What does “prochain” mean in “l'année prochaine”?", "next", ["last", "every"], TIME_HINT],
  ["Which sentence is in the future?", "Nous allons visiter le musée demain.", ["Nous avons visité le musée hier.", "Nous visitions le musée chaque été."], TIME_HINT],
  ["Which sentence tells what always used to happen?", "Chaque été, nous allions au lac.", ["Hier, nous sommes allés au lac.", "Demain, nous irons au lac."], "The imparfait (allions) describes repeated actions in the past."],
  ["Complète : Les élèves ___ à la bibliothèque ce matin. (arriver, passé composé)", "sont arrivés", ["ont arrivé", "arrivent"], "Arriver uses être in the passé composé."],
];

// ---------- Poser des questions ----------

const QUEST_HINT = "Three ways to ask a yes-or-no question: raise your voice (Tu as faim?), use Est-ce que (Est-ce que tu as faim?), or invert the verb and the pronoun (As-tu faim?).";

const QUESTIONS: FrItem[] = [
  ["Which question uses inversion?", "As-tu faim?", ["Tu as faim?", "Est-ce que tu as faim?"], QUEST_HINT],
  ["Which question uses est-ce que?", "Est-ce que tu as faim?", ["As-tu faim?", "Tu as faim?"], QUEST_HINT],
  ["Which question is asked only with intonation?", "Tu as faim?", ["As-tu faim?", "Est-ce que tu as faim?"], QUEST_HINT],
  ["Change “Vous parlez français.” into a question with inversion.", "Parlez-vous français?", ["Vous parlez-français?", "Est-ce vous parlez français?"], QUEST_HINT],
  ["Change “Elle aime la musique.” into a question with inversion.", "Aime-t-elle la musique?", ["Aime-elle la musique?", "Elle aime-t-elle la musique?"], "Add -t- between two vowels to make the question easy to say: aime-t-elle."],
  ["Complète : ___ est-ce que tu pars? — Demain matin.", "Quand", ["Où", "Pourquoi"], QUEST_HINT],
  ["Complète : ___ allez-vous? — Au musée.", "Où", ["Quand", "Combien"], QUEST_HINT],
  ["Complète : ___ coûte ce livre? — Dix dollars.", "Combien", ["Quand", "Qui"], QUEST_HINT],
  ["Complète : ___ est-ce que tu ris? — Parce que c'est drôle.", "Pourquoi", ["Où", "Combien"], QUEST_HINT],
  ["Which answer fits “Comment vas-tu?”", "Je vais bien, merci.", ["J'ai douze ans.", "Il est midi."], QUEST_HINT],
  ["Which question asks for a place?", "Où habites-tu?", ["Quand arrives-tu?", "Qui est-ce?"], QUEST_HINT],
  ["Which question asks for a reason?", "Pourquoi es-tu en retard?", ["Combien coûte le billet?", "Où est le gymnase?"], QUEST_HINT],
];

// ---------- Les séquences ----------

const SEQ_HINT = "Sequence words put events in order: premièrement, deuxièmement, troisièmement, d'abord, ensuite, après, finalement.";

const SEQUENCES: FrItem[] = [
  ["Which word comes first in a sequence?", "premièrement", ["finalement", "ensuite"], SEQ_HINT],
  ["What does “finalement” show?", "the last step", ["the first step", "a question"], SEQ_HINT],
  ["What does “ensuite” mean?", "then, next", ["before", "never"], SEQ_HINT],
  ["Premièrement, on mélange la farine. ___, on ajoute les œufs. Troisièmement, on verse la pâte.", "Deuxièmement", ["Finalement", "Troisièmement"], SEQ_HINT],
  ["D'abord, je me lève. ___, je prends mon déjeuner. Finalement, je pars pour l'école.", "Ensuite", ["Premièrement", "Hier"], SEQ_HINT],
  ["Which sentence tells the steps in order?", "D'abord, je lave les légumes; ensuite, je les coupe; finalement, je les mange.", ["Finalement, je mange les légumes; d'abord, je les coupe.", "Ensuite, je lave les légumes; d'abord, je les mange."], SEQ_HINT],
  ["Which word means “after that”?", "après", ["avant", "pendant"], SEQ_HINT],
  ["Which word means “before”?", "avant", ["après", "finalement"], SEQ_HINT],
];

function sequences(opts?: GenerateOptions): Question[] {
  return [
    ...coreQuestions(SEQUENCES, opts, 6),
    frOrder("Put the sequence words in order.", SEQ_HINT, ["premièrement", "deuxièmement", "troisièmement", "finalement"]),
  ];
}

// ---------- Besoins et opinions ----------

const NEED_HINT = "To state a need: J'ai besoin de… To ask politely: Je voudrais… / Pouvez-vous… s'il vous plaît? To give an opinion: Je trouve que… / À mon avis…";

const NEEDS: FrItem[] = [
  ["What does “J'ai besoin d'un crayon” mean?", "I need a pencil", ["I like pencils", "I lost a pencil"], NEED_HINT],
  ["How do you politely ask for water?", "Je voudrais de l'eau, s'il vous plaît.", ["Donne-moi de l'eau!", "Je veux de l'eau maintenant!"], NEED_HINT],
  ["How do you ask for help politely?", "Pouvez-vous m'aider, s'il vous plaît?", ["Aide-moi tout de suite!", "Je ne veux pas d'aide."], NEED_HINT],
  ["Which sentence expresses a need?", "J'ai besoin de mon manteau.", ["Mon manteau est rouge.", "Je range mon manteau."], NEED_HINT],
  ["What does “Je suis d'accord” mean?", "I agree", ["I am late", "I am sorry"], NEED_HINT],
  ["What does “Je ne suis pas d'accord” mean?", "I don't agree", ["I don't know", "I am not hungry"], NEED_HINT],
  ["Which sentence disagrees politely?", "Je ne suis pas d'accord, parce que…", ["Tu as tort, point final!", "Tais-toi!"], NEED_HINT],
  ["Complète : À mon avis, c'est ___ idée.", "une bonne", ["un bon", "une bon"], "Idée is feminine, so use une bonne idée."],
  ["What does “Je trouve que c'est intéressant” mean?", "I find that it's interesting", ["I found it in the street", "I am not interested"], NEED_HINT],
  ["Which sentence gives an opinion about a familiar topic?", "Je trouve que le hockey est un sport rapide.", ["Le hockey se joue sur la glace.", "Le match commence à sept heures."], NEED_HINT],
  ["Il me faut… means…", "I need…", ["I am missing the bus", "I am thinking of…"], NEED_HINT],
];

// ---------- Comparer ----------

const COMP_HINT = "Compare adjectives with plus / moins / aussi… que. Compare amounts with plus de / moins de / autant de… que.";

const COMPARE: FrItem[] = [
  ["Complète : Il y a ___ de filles que de garçons. (the same number)", "autant", ["plus", "moins"], COMP_HINT],
  ["Complète : Elle a ___ de livres que moi. (more)", "plus", ["autant", "aussi"], COMP_HINT],
  ["Complète : Nous mangeons ___ de sucre qu'avant. (less)", "moins", ["plus", "aussi"], COMP_HINT],
  ["Which sentence is correct?", "J'ai autant de devoirs que toi.", ["J'ai aussi de devoirs que toi.", "J'ai autant devoirs que toi."], COMP_HINT],
  ["What does “autant de… que” mean?", "as much or as many… as", ["more than", "less than"], COMP_HINT],
  ["Which sentence compares two adjectives?", "Ce chien est aussi gentil que le tien.", ["Ce chien a autant de jouets que le tien.", "Ce chien dort beaucoup."], COMP_HINT],
  ["How do you say “She has fewer friends than me”?", "Elle a moins d'amis que moi.", ["Elle a plus d'amis que moi.", "Elle a autant d'amis que moi."], COMP_HINT],
  ["How do you say “He has as many cousins as I do”?", "Il a autant de cousins que moi.", ["Il a plus de cousins que moi.", "Il est aussi cousin que moi."], COMP_HINT],
  ["Complète : Ma sœur est ___ grande que moi. (the same height)", "aussi", ["autant", "plus de"], COMP_HINT],
  ["Complète : Mon frère mange ___ de pain que moi. (more)", "plus", ["aussi", "très"], COMP_HINT],
];

// ---------- Décrire ----------

const DESC_HINT = "Adjectives agree with the noun in gender and number: une grande maison, des montagnes hautes. Add -e for feminine and -s for plural.";

const DESCRIPTIONS: FrItem[] = [
  ["Complète : La maison est ___. (grand)", "grande", ["grand", "grands"], DESC_HINT],
  ["Complète : Ces montagnes sont ___. (haut)", "hautes", ["haut", "haute"], DESC_HINT],
  ["Complète : Mon chat est ___ et ___. (petit, noir)", "petit et noir", ["petite et noire", "petits et noirs"], DESC_HINT],
  ["Complète : Mes cousines sont ___. (sportif)", "sportives", ["sportif", "sportifs"], DESC_HINT],
  ["Which word describes a place with lots of noise?", "bruyant", ["calme", "silencieux"], DESC_HINT],
  ["Which word means “quiet, peaceful”?", "tranquille", ["bruyant", "pressé"], DESC_HINT],
  ["Which sentence describes a place?", "C'est un grand parc avec des arbres et un lac.", ["Il joue au soccer avec ses amis.", "Hier, elle est allée au parc."], DESC_HINT],
  ["Which sentence describes a person?", "Mon voisin est grand, blond et très gentil.", ["Mon voisin habite à côté.", "Mon voisin arrive demain."], DESC_HINT],
  ["Which sentence describes a personal interest?", "J'adore le basketball et je joue chaque semaine.", ["La salle de sport est grande.", "Le basketball est un ballon."], DESC_HINT],
  ["Complète : C'est une ville ___ et ___. (moderne, animé)", "moderne et animée", ["moderne et animé", "modernes et animées"], DESC_HINT],
];

// ---------- Types de textes ----------

const TEXT_HINT = "Different texts have different formats, registers (formal or informal) and purposes. Use vous and polite words for formal texts, and tu for friends.";

const TEXTS: FrItem[] = [
  ["Which message is more formal?", "Madame, je vous écris pour demander des renseignements.", ["Salut! Je t'écris pour avoir des infos.", "Yo! Réponds-moi vite!"], TEXT_HINT],
  ["Which closing is formal?", "Veuillez agréer mes salutations distinguées.", ["Bisous!", "À plus!"], TEXT_HINT],
  ["Which greeting suits an email to a friend?", "Salut Léa,", ["Madame la directrice,", "À qui de droit,"], TEXT_HINT],
  ["When do you use “vous” with one person?", "With an adult you don't know, or to be formal", ["With your close friend", "With your pet"], TEXT_HINT],
  ["What is the purpose of a recipe?", "To give instructions", ["To make people laugh", "To tell a legend"], TEXT_HINT],
  ["What is the purpose of an invitation?", "To invite people to an event", ["To sell a product", "To describe a place"], TEXT_HINT],
  ["What is the purpose of an advertisement?", "To persuade people to buy something", ["To teach a recipe", "To report the weather"], TEXT_HINT],
  ["What is the purpose of a news report?", "To inform people about events", ["To invite friends", "To tell jokes"], TEXT_HINT],
  ["Which text uses a list of ingredients and numbered steps?", "A recipe", ["A postcard", "A poem"], TEXT_HINT],
  ["Who is the audience of a school announcement?", "Students and teachers at the school", ["Only the principal", "People in another country"], TEXT_HINT],
  ["Which tone suits a postcard to your cousin?", "Friendly and informal", ["Very formal", "Stiff and distant"], TEXT_HINT],
];

// ---------- Traditions et expressions ----------

const TRAD_HINT = "Francophone communities celebrate with festivals, food and sayings of their own. An expression often has a figurative meaning that is different from its words.";

const TRADITIONS: FrItem[] = [
  ["What is the Tour de France?", "A famous bicycle race held every summer", ["A cooking festival", "A winter parade"], TRAD_HINT, "🚴"],
  ["What do people celebrate on June 24 in Québec, la Saint-Jean-Baptiste?", "The Fête nationale du Québec", ["Halloween", "Thanksgiving"], TRAD_HINT, "🎆"],
  ["What is the poisson d'avril tradition?", "Playing harmless pranks on April 1", ["Eating fish on Christmas", "Fishing in June"], "On April 1, children sometimes tape a paper fish on someone's back.", "🐟"],
  ["What is Mardi gras?", "A carnival day before the start of Lent", ["A summer fair", "A new year party"], TRAD_HINT, "🎭"],
  ["What do many Francophone families do at the Noël réveillon?", "Share a festive meal on Christmas Eve", ["Go fishing", "Run a race"], TRAD_HINT, "🎄"],
  ["What does the expression “Il pleut des cordes” mean?", "It's pouring rain", ["It's snowing ropes", "It's a little cloudy"], "Figurative meaning: it is raining very hard.", "🌧️"],
  ["What does “C'est du gâteau” mean?", "It's a piece of cake (easy)", ["It's dessert time", "It tastes bad"], "Figurative meaning: something is very easy.", "🍰"],
  ["What does “poser un lapin à quelqu'un” mean?", "To not show up when you said you would", ["To give someone a pet", "To tell a secret"], "Figurative meaning: to stand someone up.", "🐰"],
  ["What does “avoir le cafard” mean?", "To feel sad or down", ["To have a bug in the house", "To drink coffee"], "Figurative meaning: to feel blue.", "😔"],
  ["What does “coûter les yeux de la tête” mean?", "To be very expensive", ["To cost very little", "To need glasses"], "Figurative meaning: to cost a lot.", "💰"],
  ["Why do expressions often confuse language learners?", "Their meaning is different from the meaning of the words", ["They have no verbs", "They are always in the future"], TRAD_HINT],
];

// ---------- Histoires ----------

const SCIENCE_FAIR = {
  type: "passage" as const,
  title: "Le volcan brisé",
  paragraphs: [
    "Nadia et Tom doivent présenter un projet de sciences vendredi. Mercredi, leur volcan en papier mâché tombe et se brise. Ils sont découragés. Premièrement, ils respirent profondément. Ensuite, ils demandent de l'aide à leur enseignante. Finalement, ils reconstruisent le volcan et leur présentation est un succès.",
  ],
};

const MARKET = {
  type: "passage" as const,
  title: "Le marché de Noël",
  paragraphs: [
    "Chaque décembre, Chloé visite le marché de Noël avec sa grand-mère. Cette année, la neige tombe fort et les rues sont glissantes. Chloé s'inquiète pour sa grand-mère, mais elle lui donne le bras. Elles boivent un chocolat chaud et rentrent heureuses.",
  ],
};

const STORY_HINT = "A story has characters, a setting, a plot, a problem and a resolution. Look for sequence words and time words to follow the order.";

const STORIES: FrItem[] = [
  ["What is the problem in the story?", "Their volcano falls and breaks", ["They forget their lunch", "Their teacher is away"], STORY_HINT, SCIENCE_FAIR],
  ["When does the volcano break?", "Wednesday", ["Friday", "Monday"], STORY_HINT, SCIENCE_FAIR],
  ["What do Nadia and Tom do after taking a deep breath?", "They ask their teacher for help", ["They quit the project", "They go home"], STORY_HINT, SCIENCE_FAIR],
  ["What is the resolution?", "They rebuild the volcano and the presentation succeeds", ["They win a trip", "They change projects"], STORY_HINT, SCIENCE_FAIR],
  ["Which word shows the last step?", "Finalement", ["Premièrement", "Ensuite"], STORY_HINT, SCIENCE_FAIR],
  ["How often does Chloé visit the market?", "Every December", ["Every Friday", "Only once"], STORY_HINT, MARKET],
  ["What is different this year?", "It snows heavily and the streets are slippery", ["The market is closed", "Her grandmother is away"], STORY_HINT, MARKET],
  ["Why does Chloé give her grandmother her arm?", "She is worried about the slippery streets", ["She wants to run", "She is tired of waiting"], STORY_HINT, MARKET],
  ["How does the story end?", "They have hot chocolate and go home happy", ["They get lost", "They cancel the visit"], STORY_HINT, MARKET],
  ["What season is it?", "Winter", ["Summer", "Spring"], STORY_HINT, MARKET],
];

// ---------- Identité et créations ----------

const ID_HINT = "Learning French lets us look at our own culture from a new point of view. Francophone creative works, such as songs, films, paintings and poems, express the experience of Francophone communities.";

const IDENTITY: FrItem[] = [
  ["Why might learning French help you understand your own identity?", "It lets you see your culture from a new point of view", ["It erases your first language", "It is only for travel"], ID_HINT],
  ["Which is a creative work from a Francophone culture?", "A song, a film or a poem in French", ["A phone bill", "A bus schedule"], ID_HINT],
  ["What can you learn from a Francophone song?", "How people express feelings and traditions", ["Only grammar rules", "Nothing about culture"], ID_HINT],
  ["Which statement is true?", "Some First Nations and Métis communities in Canada have a history with the French language.", ["No Indigenous community has any link with French.", "All Indigenous peoples speak only French."], "For example, the Huron-Wendat Nation at Wendake in Québec, or the Métis community of Île-à-la-Crosse in Saskatchewan."],
  ["Why do some Innu writers in Québec write poems and stories in French?", "To share their experiences and bring attention to their communities", ["Because they have no language of their own", "To avoid being read"], "Innu authors write in Innu languages and in French. They use poetry and prose to talk about their families and communities."],
  ["How can you compare traditions in two cultures?", "Describe what is similar and what is different, and explain why", ["Say one is better", "Avoid talking about them"], ID_HINT],
  ["Which question helps you explore a cultural practice?", "What is the purpose of this celebration for the people who take part?", ["Who is richer?", "Which food is cheaper?"], ID_HINT],
  ["What does “la francophonie” include?", "Communities around the world where French is spoken", ["Only France", "Only schools"], ID_HINT],
];

// ---------- Culture et respect ----------

const CULT_HINT = "Cultural appropriation is using a cultural motif, theme, voice, image, knowledge, story, song or drama without permission or context in a way that may misrepresent the people it comes from. Plagiarism is passing off someone else's work as your own.";

const CULTURE: FrItem[] = [
  ["Which is an example of cultural appropriation?", "Performing a community's sacred song as a joke", ["Attending a festival and learning its meaning", "Asking a friend to explain a tradition"], CULT_HINT],
  ["Before using a story from a culture that is not yours, you should…", "ask permission and give credit", ["change the story's ending", "say you wrote it"], CULT_HINT],
  ["Which is plagiarism?", "Handing in a classmate's paragraph as your own", ["Quoting a book and citing it", "Paraphrasing and giving the source"], CULT_HINT],
  ["Which habit avoids plagiarism?", "Take notes in your own words and list the sources", ["Copy and paste then change one word", "Skip the bibliography"], CULT_HINT],
  ["Why is it important to credit the creator of an image?", "It shows respect and lets others find the original", ["It makes the picture bigger", "It hides the source"], CULT_HINT],
  ["Which statement shows respect when you talk about a culture?", "I learned this from members of that community.", ["I know everything about them.", "They are all the same."], CULT_HINT],
  ["You want to show a traditional dance in a video. What is a respectful first step?", "Ask people from that community and learn its meaning", ["Copy it from a movie", "Change the moves so it's funnier"], CULT_HINT],
  ["What does “voice” mean in the idea of cultural appropriation?", "The way a community tells its own stories", ["The volume of a speaker", "A microphone"], "Using a community's voice without permission can misrepresent their real experience."],
];

export const course: Course = {
  grade: "9",
  subject: "core-french",
  bigIdeas: {
    "ca-bc": [
      "Listening and viewing with intent supports our acquisition and understanding of French.",
      "We can have meaningful conversations in French about things that are important to us.",
      "We can share our experiences and perspectives through stories.",
      "Francophone creative works are expressions of Francophone cultures.",
      "Acquiring French provides opportunities to explore our own cultural identity from a new perspective.",
    ],
  },
  units: [
    {
      id: "temps-9",
      title: "Past, present, future",
      emoji: "⏳",
      blurb: "Passé composé, imparfait, futur",
      parentNote: "Using past, present and future time frames: the passé composé, the imparfait for habits, and the near future.",
      standards: { "ca-bc": "Commonly used vocabulary and sentence structures for communication in past, present and future time frames" },
      generate: (o) => coreQuestions(TIMES, o, 8),
    },
    {
      id: "poser-des-questions",
      title: "Asking questions",
      emoji: "❓",
      blurb: "Intonation, est-ce que, inversion",
      parentNote: "Three ways to ask questions (intonation, est-ce que, inversion) and question words.",
      standards: { "ca-bc": "Various types of questions: intonated, est-ce que, inversion, and questions using different interrogative words" },
      generate: (o) => coreQuestions(QUESTIONS, o, 8),
    },
    {
      id: "sequences",
      title: "Putting events in order",
      emoji: "🔢",
      blurb: "Premièrement, ensuite, finalement",
      parentNote: "Sequence words that show the order of events (premièrement, d'abord, ensuite, finalement).",
      standards: { "ca-bc": "Sequences of events using words that indicate sequence" },
      generate: sequences,
    },
    {
      id: "besoins-et-opinions",
      title: "Needs and opinions",
      emoji: "🙋",
      blurb: "J'ai besoin de, je trouve que",
      parentNote: "Expressing simple needs, asking politely, and sharing opinions about familiar topics.",
      standards: { "ca-bc": "Simple needs; opinions about familiar topics" },
      generate: (o) => coreQuestions(NEEDS, o, 8),
    },
    {
      id: "comparer-9",
      title: "Comparing amounts",
      emoji: "⚖️",
      blurb: "Plus de, moins de, autant de",
      parentNote: "Comparing adjectives (aussi… que) and amounts (plus de, moins de, autant de… que).",
      standards: { "ca-bc": "Comparisons and contrasts using aussi, mais, plus que, aussi que, moins que, plus de, autant de, moins de" },
      generate: (o) => coreQuestions(COMPARE, o, 8),
    },
    {
      id: "descriptions",
      title: "Describing things and places",
      emoji: "🖼️",
      blurb: "Adjectives that agree",
      parentNote: "Describing items, people, places and personal interests, with adjectives that agree in gender and number.",
      standards: { "ca-bc": "Descriptions of items, people, places and personal interests" },
      generate: (o) => coreQuestions(DESCRIPTIONS, o, 8),
    },
    {
      id: "types-de-textes",
      title: "Types of texts",
      emoji: "📨",
      blurb: "Format, register and purpose",
      parentNote: "How letters, emails, recipes and advertisements differ in format, audience, register (tu or vous) and purpose.",
      standards: { "ca-bc": "Elements of common types of texts: format, language, context, audience, register and purpose" },
      generate: (o) => coreQuestions(TEXTS, o, 8),
    },
    {
      id: "traditions",
      title: "Traditions and expressions",
      emoji: "🎉",
      blurb: "Fêtes et expressions",
      parentNote: "Francophone celebrations such as Noël, Mardi gras, la Saint-Jean-Baptiste and poisson d'avril, and common idiomatic expressions.",
      standards: { "ca-bc": "Traditions and other cultural practices relating to celebrations, holidays and festivals in various Francophone regions; idiomatic use of language" },
      generate: (o) => coreQuestions(TRADITIONS, o, 8),
    },
    {
      id: "histoires-9",
      title: "Stories: problem and resolution",
      emoji: "📖",
      blurb: "Plot, problem, resolution",
      parentNote: "Understanding key elements, time and place in short French stories, and narrating events in order.",
      standards: { "ca-bc": "Common elements of stories: place, characters, setting, plot, problem and resolution; narrate stories" },
      generate: (o) => coreQuestions(STORIES, o, 8),
    },
    {
      id: "identite-et-creations",
      title: "Identity and creative works",
      emoji: "🎨",
      blurb: "Culture through songs and stories",
      parentNote: "How Francophone creative works express culture, how French connects with Indigenous communities in Canada, and how learning French shapes our view of our own identity.",
      standards: { "ca-bc": "Francophone creative works as expressions of culture; connections between Indigenous communities and the French language; exploring our own cultural identity" },
      generate: (o) => coreQuestions(IDENTITY, o, 8),
    },
    {
      id: "culture-et-respect-9",
      title: "Culture and respect",
      emoji: "🤝",
      blurb: "Appropriation and plagiarism",
      parentNote: "The ethics of cultural appropriation and plagiarism: asking permission, giving credit and learning respectfully.",
      standards: { "ca-bc": "Ethics of cultural appropriation and plagiarism" },
      generate: (o) => coreQuestions(CULTURE, o, 8),
    },
  ],
};
