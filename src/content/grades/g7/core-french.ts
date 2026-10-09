import { frQuestions, type FrItem } from "../../french";
import type { Course } from "../../types";

// Core French: instructions are in English, the French is what students learn.

// ---------- Les directions ----------

const DIR_HINT = "Direction words: à gauche (left), à droite (right), tout droit (straight ahead), devant (in front of), derrière (behind), à côté de (beside), en face de (across from), entre (between).";

const DIRECTIONS: FrItem[] = [
  ["What does “Tournez à gauche” mean?", "Turn left", ["Turn right", "Go straight"], DIR_HINT],
  ["What does “Tournez à droite” mean?", "Turn right", ["Turn left", "Stop here"], DIR_HINT],
  ["What does “Allez tout droit” mean?", "Go straight ahead", ["Turn around", "Turn left"], DIR_HINT],
  ["How do you say “The library is behind the school”?", "La bibliothèque est derrière l'école.", ["La bibliothèque est devant l'école.", "La bibliothèque est à droite de l'école."], DIR_HINT],
  ["How do you say “The park is in front of the museum”?", "Le parc est devant le musée.", ["Le parc est derrière le musée.", "Le parc est entre le musée."], DIR_HINT],
  ["What does “à côté de” mean?", "beside", ["far from", "behind"], DIR_HINT],
  ["What does “en face de” mean?", "across from", ["beside", "inside"], DIR_HINT],
  ["What does “loin de” mean?", "far from", ["close to", "behind"], DIR_HINT],
  ["What does “près de” mean?", "close to", ["far from", "across from"], DIR_HINT],
  ["The shop is between the bank and the pool. Which sentence is correct?", "Le magasin est entre la banque et la piscine.", ["Le magasin est derrière la banque et la piscine.", "Le magasin est loin de la banque et la piscine."], DIR_HINT],
  ["Someone asks “Où est la gare?” Which answer gives directions?", "Allez tout droit, puis tournez à gauche.", ["Je m'appelle Léo.", "J'aime les trains."], DIR_HINT],
  ["How do you ask “Where is the washroom?”", "Où sont les toilettes?", ["Qui sont les toilettes?", "Quand sont les toilettes?"], "“Où” means where."],
];

// ---------- Les lieux ----------

const PLACE_HINT = "Learn places with their articles: la bibliothèque, le parc, l'école. Think of what people do there.";

const PLACES: FrItem[] = [
  ["Where do you buy bread?", "à la boulangerie", ["à la bibliothèque", "à la piscine"], PLACE_HINT, "🥖"],
  ["Where do you borrow books?", "à la bibliothèque", ["à la boulangerie", "à l'hôpital"], PLACE_HINT, "📚"],
  ["Where do you go swimming?", "à la piscine", ["au musée", "à l'épicerie"], PLACE_HINT, "🏊"],
  ["Where do you see paintings and old objects?", "au musée", ["à la piscine", "à la gare"], PLACE_HINT, "🖼️"],
  ["Where do you buy fruit and vegetables?", "à l'épicerie", ["à la bibliothèque", "à l'école"], PLACE_HINT, "🍎"],
  ["Where do you catch a train?", "à la gare", ["au parc", "à l'hôpital"], PLACE_HINT, "🚆"],
  ["Where do you go when you are sick?", "à l'hôpital", ["au musée", "à la boulangerie"], PLACE_HINT, "🏥"],
  ["Where do children learn with their teacher?", "à l'école", ["à la piscine", "à la gare"], PLACE_HINT, "🏫"],
  ["What does “la ville” mean?", "the city", ["the village", "the street"], PLACE_HINT],
  ["What does “la rue” mean?", "the street", ["the city", "the park"], PLACE_HINT],
  ["What does “le magasin” mean?", "the store", ["the museum", "the school"], PLACE_HINT],
  ["How do you say “I go to the park”?", "Je vais au parc.", ["Je vais à le parc.", "Je vais de parc."], "À + le becomes au: à + le parc = au parc. À + les becomes aux."],
];

// ---------- Les comparaisons ----------

const COMP_HINT = "Compare with plus… que (more… than), moins… que (less… than) and aussi… que (as… as). The adjective agrees with the first person or thing.";

const COMPARE: FrItem[] = [
  ["How do you say “Anna is taller than Maya”?", "Anna est plus grande que Maya.", ["Anna est moins grande que Maya.", "Anna est aussi grande que Maya."], COMP_HINT],
  ["How do you say “Amir is as fast as Leo”?", "Amir est aussi rapide que Leo.", ["Amir est plus rapide que Leo.", "Amir est moins rapide que Leo."], COMP_HINT],
  ["How do you say “The dog is less big than the horse”?", "Le chien est moins grand que le cheval.", ["Le chien est plus grand que le cheval.", "Le chien est aussi grand que le cheval."], COMP_HINT],
  ["How do you say “My sister is older than me”?", "Ma sœur est plus âgée que moi.", ["Ma sœur est moins âgée que moi.", "Ma sœur est aussi âgée que moi."], COMP_HINT],
  ["Complète : Un éléphant est ___ lourd qu'une souris. (heavier)", "plus", ["moins", "aussi"], COMP_HINT],
  ["Complète : La glace est ___ chaude que le feu. (less)", "moins", ["plus", "aussi"], COMP_HINT],
  ["Complète : Cette boîte est ___ lourde que l'autre. They weigh the same.", "aussi", ["plus", "moins"], COMP_HINT],
  ["Which sentence is correct?", "Mon frère est plus grand que moi.", ["Mon frère est plus grand de moi.", "Mon frère est plus grand comme moi."], "After plus… or moins… we use “que”: plus grand que moi."],
  ["“Bon” becomes which word in “This cake is better than that one”?", "meilleur", ["plus bon", "mieux"], "The comparative of “bon” is “meilleur”: Ce gâteau est meilleur que celui-là."],
  ["How do you say “She sings better than me”?", "Elle chante mieux que moi.", ["Elle chante meilleur que moi.", "Elle chante plus bien que moi."], "The comparative of the adverb “bien” is “mieux”."],
];

// ---------- Décrire les autres ----------

const PERS_HINT = "Adjectives agree with the person: il est gentil / elle est gentille; sportif / sportive. Some adjectives stay the same for both: drôle, timide, sympa.";

const PERSONALITY: FrItem[] = [
  ["Ma meilleure amie est ___. (funny)", "drôle", ["drôles", "drôl"], PERS_HINT],
  ["Mon frère est ___. (athletic)", "sportif", ["sportive", "sportifs"], PERS_HINT],
  ["Ma sœur est ___. (athletic)", "sportive", ["sportif", "sportifs"], PERS_HINT],
  ["Mon professeur est ___. (kind)", "gentil", ["gentille", "gentils"], PERS_HINT],
  ["Ma cousine est ___. (shy)", "timide", ["timides", "timid"], PERS_HINT],
  ["Mes amis sont ___. (friendly, plural)", "sympas", ["sympa", "sympathique"], "“Sympa” is a casual word for nice. It takes an s in the plural."],
  ["What does “Elle est très intelligente” mean?", "She is very smart", ["She is very tall", "She is very tired"], PERS_HINT],
  ["What does “Il est généreux” mean?", "He is generous", ["He is greedy", "He is shy"], PERS_HINT],
  ["What does “Mon ami est curieux” mean?", "My friend is curious", ["My friend is careful", "My friend is clumsy"], PERS_HINT],
  ["How do you say “Maya is brave”?", "Maya est courageuse.", ["Maya est courageux.", "Maya est courage."], PERS_HINT],
  ["Which word means “patient”?", "patient", ["pressé", "fâché"], PERS_HINT],
  ["Which question asks what someone is like?", "Comment est ton ami?", ["Où est ton ami?", "Qui est ton ami?"], "“Comment est…?” asks for a description."],
];

// ---------- Mots amis ----------

const COG_HINT = "Cognates are words that look alike in English and French: animal, hôpital, restaurant. Beware of faux amis (false friends) that look alike but mean something different.";

const COGNATES: FrItem[] = [
  ["Which French word is a cognate of “hospital”?", "hôpital", ["maison", "école"], COG_HINT],
  ["Which French word is a cognate of “restaurant”?", "restaurant", ["boulangerie", "piscine"], COG_HINT],
  ["You see “pharmacie” on a sign. What is it?", "a pharmacy", ["a bakery", "a school"], COG_HINT],
  ["You see “musée” on a sign. What is it?", "a museum", ["a market", "a theatre"], COG_HINT],
  ["What does “une librairie” mean? (a faux ami)", "a bookstore", ["a library", "a bakery"], "A library is “une bibliothèque”. “Librairie” is a place that sells books."],
  ["What does “actuellement” mean? (a faux ami)", "currently", ["actually", "finally"], COG_HINT],
  ["What does “le pain” mean? (a faux ami)", "bread", ["pain", "a painting"], COG_HINT],
  ["What does “la chair” mean? (a faux ami)", "flesh", ["a chair", "a cheek"], COG_HINT],
  ["What does “le journal” mean?", "the newspaper", ["the journey", "the jewellery"], "A journal for private writing is “un cahier” or “un journal intime”. Without more context, “le journal” is the newspaper."],
  ["Which strategy helps most when you meet a new French word?", "Look for words you recognize and use the picture or context", ["Skip the whole sentence", "Guess a different language"], COG_HINT],
  ["Which word is most likely a cognate of “animal”?", "animal", ["chat", "cheval"], COG_HINT],
  ["What does “la bibliothèque” mean?", "the library", ["the bookstore", "the notebook"], COG_HINT],
];

// ---------- Histoires ----------

const STORY_HINT = "Story elements: characters (who), setting (where and when), problem (what goes wrong) and solution (how it is solved).";

const LEO = {
  type: "passage" as const,
  title: "Léo et Max",
  paragraphs: [
    "Léo est un garçon de onze ans. Il habite dans une petite ville. Un jour, il perd son chien Max au parc. Il cherche Max partout. Enfin, il trouve Max près du lac. Léo est très content.",
  ],
};

const SNOW = {
  type: "passage" as const,
  title: "Le bonhomme de neige",
  paragraphs: [
    "C'est l'hiver. Maya et sa sœur Zoé veulent faire un bonhomme de neige. Il y a beaucoup de neige dans la cour. Elles roulent trois grosses boules. Zoé met un chapeau rouge. Le bonhomme de neige est parfait!",
  ],
};

const FRIDGE = {
  type: "passage" as const,
  title: "Le frigo vide",
  paragraphs: [
    "Amir a faim. Il ouvre le frigo, mais il est vide! Il va à l'épicerie avec sa mère. Ils achètent du pain, du fromage et des pommes. Ce soir, la famille mange ensemble.",
  ],
};

const STORIES: FrItem[] = [
  ["Who is the main character?", "Léo", ["Max", "A boy named Amir"], STORY_HINT, LEO],
  ["What is the problem in the story?", "Léo loses his dog", ["Léo is sick", "It is raining"], STORY_HINT, LEO],
  ["Where does Léo find Max?", "Near the lake", ["At school", "At home"], STORY_HINT, LEO],
  ["How does Léo feel at the end?", "Very happy", ["Angry", "Afraid"], STORY_HINT, LEO],
  ["What is the season?", "Winter", ["Summer", "Spring"], STORY_HINT, SNOW],
  ["Who are the characters?", "Maya and her sister Zoé", ["Maya and her brother", "Zoé and her mother"], STORY_HINT, SNOW],
  ["What do the girls make?", "A snowman", ["A cake", "A kite"], STORY_HINT, SNOW],
  ["What colour is the hat?", "Red", ["Blue", "Green"], STORY_HINT, SNOW],
  ["What is Amir's problem?", "He is hungry and the fridge is empty", ["He lost his book", "He is lost in the city"], STORY_HINT, FRIDGE],
  ["Where do Amir and his mother go?", "To the grocery store", ["To the library", "To the pool"], STORY_HINT, FRIDGE],
  ["What do they buy?", "Bread, cheese and apples", ["Fish, milk and eggs", "Rice, carrots and juice"], STORY_HINT, FRIDGE],
  ["How does the story end?", "The family eats together", ["Amir goes to bed hungry", "The store is closed"], STORY_HINT, FRIDGE],
];

// ---------- Le monde francophone ----------

const WORLD_HINT = "French is spoken by hundreds of millions of people on several continents. Each Francophone community has its own culture, food and traditions.";

const WORLD: FrItem[] = [
  ["Which of these countries has French as one of its official languages?", "Belgium", ["Japan", "Brazil"], WORLD_HINT, "🌍"],
  ["French is an official language in which West African country?", "Senegal", ["Egypt", "Kenya"], "Senegal's capital, Dakar, is a major Francophone city.", "🌍"],
  ["In which region of the world is Haiti?", "The Caribbean", ["Europe", "Asia"], "Haiti is a Francophone country with its own language, Haitian Creole, alongside French.", "🌴"],
  ["What is the capital of France?", "Paris", ["Brussels", "Dakar"], WORLD_HINT, "🗼"],
  ["What is the capital of Belgium?", "Brussels", ["Paris", "Montréal"], WORLD_HINT, "🏛️"],
  ["Where is French widely spoken in North Africa?", "Morocco", ["Iceland", "Chile"], "French is widely used in Morocco, alongside Arabic and Tamazight.", "🌍"],
  ["French is spoken on how many continents?", "Several", ["Only one", "None"], WORLD_HINT, "🗺️"],
  ["Which of these places is in Canada and has a mostly French-speaking population?", "Québec", ["Texas", "Belgium"], WORLD_HINT, "🍁"],
  ["What is Québec's capital?", "Québec City", ["Montréal", "Ottawa"], "Montréal is the largest city. Québec City is the capital.", "🏰"],
  ["Why can a Canadian student use French when travelling?", "French is spoken in many countries and in parts of Canada", ["It is spoken only in France", "No one speaks it outside school"], WORLD_HINT, "✈️"],
];

// ---------- Cultures et respect ----------

const CULT_HINT = "Cultural appropriation means using elements of a culture without permission or context in ways that may misrepresent it. Plagiarism means passing off someone else's work as your own.";

const CULTURE: FrItem[] = [
  ["Cultural appropriation is…", "using elements of a culture without permission or context, in ways that may misrepresent it", ["learning from people who share their culture", "trying a food at a festival"], CULT_HINT],
  ["Which is an example of cultural appreciation?", "Learning about a tradition from people who celebrate it", ["Wearing sacred clothing as a costume", "Copying a design and selling it"], CULT_HINT],
  ["You want to use a traditional song in a class video. What should you do first?", "Learn its meaning and ask permission from the community", ["Change the words so no one notices", "Use it without saying where it is from"], CULT_HINT],
  ["Plagiarism is…", "presenting someone else's work as your own", ["quoting an author and naming them", "summarizing in your own words with a source"], CULT_HINT],
  ["Which citation habit is best?", "Write where each fact and image came from", ["List only the title of your project", "Skip sources if you change a few words"], CULT_HINT],
  ["Why is it important to name the source of an image or story?", "It credits the creator and shows respect", ["It makes the page longer", "It hides who made it"], CULT_HINT],
  ["A classmate from a Francophone community shares a family tradition. A respectful reaction is…", "to listen, ask questions and thank them", ["to joke about it", "to retell it as your own"], CULT_HINT],
  ["Which statement shows careful research?", "I used several trusted sources, including people from the community", ["I only used the first website I found", "I made up what I couldn't find"], CULT_HINT],
];

export const course: Course = {
  grade: "7",
  subject: "core-french",
  bigIdeas: {
    "ca-bc": [
      "Listening and viewing with intent helps us increase our understanding of French.",
      "Using various strategies helps us understand and acquire language.",
      "With simple French, we can describe others and their interests.",
      "Reciprocal communication in French is possible using high-frequency vocabulary and sentence structures.",
      "Stories help us acquire language and understand the world around us, including our thoughts, feelings, culture and identity.",
      "Learning about Francophone communities helps us develop cultural awareness.",
    ],
  },
  units: [
    {
      id: "directions",
      title: "Directions",
      emoji: "🧭",
      blurb: "Left, right, straight ahead",
      parentNote: "Asking for and giving directions, and describing where places are (à gauche, devant, derrière, à côté de).",
      standards: { "ca-bc": "Common, high-frequency vocabulary and sentence structures for locations and directions" },
      generate: (o) => frQuestions(DIRECTIONS, o, 8),
    },
    {
      id: "lieux",
      title: "Places in town",
      emoji: "🏙️",
      blurb: "La ville et les magasins",
      parentNote: "Vocabulary for places in a community and the contractions au, à la, à l'.",
      standards: { "ca-bc": "Locations and directions; cultural aspects of communities" },
      generate: (o) => frQuestions(PLACES, o, 8),
    },
    {
      id: "comparaisons",
      title: "Comparing",
      emoji: "⚖️",
      blurb: "Plus, moins, aussi… que",
      parentNote: "Making simple comparisons with plus… que, moins… que and aussi… que, and the special forms meilleur and mieux.",
      standards: { "ca-bc": "Simple comparisons" },
      generate: (o) => frQuestions(COMPARE, o, 8),
    },
    {
      id: "personnalite",
      title: "Describing people",
      emoji: "🙂",
      blurb: "Family, friends, teachers",
      parentNote: "Describing the personality of family, friends and teachers, with adjectives that agree in gender and number.",
      standards: { "ca-bc": "Describing others, such as family, friends and teachers" },
      generate: (o) => frQuestions(PERSONALITY, o, 8),
    },
    {
      id: "mots-amis",
      title: "Cognates and strategies",
      emoji: "🔍",
      blurb: "Words that look alike",
      parentNote: "Using cognates and context to understand new French words, and watching out for false friends such as librairie.",
      standards: { "ca-bc": "Use a range of strategies to support understanding, such as using cognates and context" },
      generate: (o) => frQuestions(COGNATES, o, 8),
    },
    {
      id: "histoires",
      title: "Reading short stories",
      emoji: "📖",
      blurb: "Characters, setting, problem",
      parentNote: "Understanding key information and events in simple French stories: characters, setting, problem and solution.",
      standards: { "ca-bc": "Stories: common story elements (place, characters, setting and plot)" },
      generate: (o) => frQuestions(STORIES, o, 8),
    },
    {
      id: "monde-francophone",
      title: "The Francophone world",
      emoji: "🌍",
      blurb: "French around the world",
      parentNote: "Communities where French is spoken around the world, such as Belgium, Haiti, Morocco and Senegal, and in Canada.",
      standards: { "ca-bc": "Communities where French is spoken across Canada and around the world" },
      generate: (o) => frQuestions(WORLD, o, 8),
    },
    {
      id: "cultures-et-respect",
      title: "Culture and honesty",
      emoji: "🤝",
      blurb: "Appropriation and plagiarism",
      parentNote: "The ethics of cultural appropriation and plagiarism: crediting sources and learning from cultures respectfully.",
      standards: { "ca-bc": "Ethics: cultural appropriation; plagiarism" },
      generate: (o) => frQuestions(CULTURE, o, 8),
    },
  ],
};
