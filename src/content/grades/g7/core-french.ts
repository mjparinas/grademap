import { coreQuestions, type FrItem } from "../../french";
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
  ["What does “au coin de la rue” mean?", "at the corner of the street", ["at the end of the street", "across the street"], DIR_HINT],
  ["What does “Traversez la rue” mean?", "Cross the street", ["Turn around", "Stop here"], DIR_HINT],
  ["What does “Continuez tout droit” mean?", "Keep going straight", ["Turn around", "Turn left"], DIR_HINT],
  ["What does “Prenez la deuxième rue à droite” mean?", "Take the second street on the right", ["Take the first street on the left", "Take the second street on the left"], DIR_HINT],
  ["What does “Faites demi-tour” mean?", "Turn around", ["Stop here", "Go straight"], DIR_HINT],
  ["What does “au bout de la rue” mean?", "at the end of the street", ["at the beginning of the street", "far from the street"], DIR_HINT],
  ["How do you say “Turn right at the corner”?", "Tournez à droite au coin.", ["Tournez à gauche au coin.", "Allez tout droit au coin."], DIR_HINT],
  ["How do you say “The bank is across from the school”?", "La banque est en face de l'école.", ["La banque est derrière l'école.", "La banque est entre l'école."], DIR_HINT],
  ["How do you say “The pool is far from the park”?", "La piscine est loin du parc.", ["La piscine est près du parc.", "La piscine est devant le parc."], "De + le becomes du: loin de + le parc = loin du parc."],
  ["How do you say “The store is next to the pharmacy”?", "Le magasin est à côté de la pharmacie.", ["Le magasin est en face de la pharmacie.", "Le magasin est derrière la pharmacie."], DIR_HINT],
  ["How do you say “Excuse me, where is the library?”", "Excusez-moi, où est la bibliothèque?", ["Excusez-moi, qui est la bibliothèque?", "Excusez-moi, quand est la bibliothèque?"], "“Où” means where."],
  ["Which word means “north”?", "le nord", ["le sud", "l'est"], DIR_HINT],
  ["Which word means “west”?", "l'ouest", ["l'est", "le sud"], DIR_HINT],
  ["The sign says “Sortie”. What does it mean?", "exit", ["entrance", "parking"], DIR_HINT],
  ["The sign says “Entrée”. What does it mean?", "entrance", ["exit", "closed"], DIR_HINT],
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
  ["Where do you buy medicine?", "à la pharmacie", ["à la bibliothèque", "au musée"], PLACE_HINT, "💊"],
  ["Where do you mail a letter?", "au bureau de poste", ["à la gare", "à la piscine"], PLACE_HINT, "📮"],
  ["Where do you watch a movie on a big screen?", "au cinéma", ["à la banque", "à l'école"], PLACE_HINT, "🎬"],
  ["Where do you play and see trees and swings?", "au parc", ["à la gare", "à l'hôpital"], PLACE_HINT, "🌳"],
  ["Where do you keep your money safe?", "à la banque", ["à la boulangerie", "à l'école"], PLACE_HINT, "🏦"],
  ["Where do you go to see a play or a show?", "au théâtre", ["à l'épicerie", "à la piscine"], PLACE_HINT, "🎭"],
  ["Where do you buy a new book?", "à la librairie", ["à la boulangerie", "à la piscine"], "A “librairie” sells books. A “bibliothèque” lends them.", "📖"],
  ["Where do you go to see animals from around the world?", "au zoo", ["à la banque", "à la bibliothèque"], PLACE_HINT, "🦁"],
  ["What does “la mairie” mean?", "city hall", ["the post office", "the market"], PLACE_HINT],
  ["What does “le marché” mean?", "the market", ["the park", "the bank"], PLACE_HINT],
  ["What does “un quartier” mean?", "a neighbourhood", ["a village", "a street"], PLACE_HINT],
  ["How do you say “I go to the bank”?", "Je vais à la banque.", ["Je vais au banque.", "Je vais de la banque."], "À + la stays à la: à la banque. À + le becomes au: au parc."],
  ["How do you say “We go to the pool”?", "Nous allons à la piscine.", ["Nous allons au piscine.", "Nous allons de la piscine."], "À + la stays à la: à la piscine. À + le becomes au: au musée."],
  ["How do you say “They go to the stores”?", "Ils vont aux magasins.", ["Ils vont au magasins.", "Ils vont à la magasins."], "À + les becomes aux: aux magasins."],
  ["How do you say “I am at the museum”?", "Je suis au musée.", ["Je suis à le musée.", "Je suis du musée."], "À + le becomes au: à + le musée = au musée."],
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
  ["How do you say “Zoé is shorter than Léa”?", "Zoé est plus petite que Léa.", ["Zoé est aussi petite que Léa.", "Zoé est moins petite que Léa."], COMP_HINT],
  ["How do you say “Noah is as strong as Ravi”?", "Noah est aussi fort que Ravi.", ["Noah est plus fort que Ravi.", "Noah est moins fort que Ravi."], COMP_HINT],
  ["How do you say “The lake is less deep than the sea”?", "Le lac est moins profond que la mer.", ["Le lac est plus profond que la mer.", "Le lac est aussi profond que la mer."], COMP_HINT],
  ["How do you say “My bag is heavier than your bag”?", "Mon sac est plus lourd que ton sac.", ["Mon sac est moins lourd que ton sac.", "Mon sac est aussi lourd que ton sac."], COMP_HINT],
  ["How do you say “Anna reads better than Amir”?", "Anna lit mieux qu'Amir.", ["Anna lit meilleur qu'Amir.", "Anna lit plus bien qu'Amir."], "The comparative of the adverb “bien” is “mieux”. Before a vowel, que becomes qu'."],
  ["How do you say “These cookies are better than the others”?", "Ces biscuits sont meilleurs que les autres.", ["Ces biscuits sont mieux que les autres.", "Ces biscuits sont plus bons que les autres."], "The comparative of “bon” is “meilleur”, and it agrees with the noun: meilleurs."],
  ["Complète : Une voiture est ___ rapide qu'un vélo. (faster)", "plus", ["moins", "aussi"], COMP_HINT],
  ["Complète : Un nuage est ___ lourd qu'une pierre. (less)", "moins", ["plus", "aussi"], COMP_HINT],
  ["Complète : Ces deux sacs coûtent dix dollars. Ce sac est ___ cher que l'autre.", "aussi", ["plus", "moins"], COMP_HINT],
  ["Complète : Mon frère court ___ vite que moi. (faster)", "plus", ["moins", "aussi"], COMP_HINT],
  ["Which sentence is correct?", "Cette pomme est aussi sucrée que cette poire.", ["Cette pomme est aussi sucrée de cette poire.", "Cette pomme est aussi sucrée comme cette poire."], "After aussi… we use “que”: aussi sucrée que cette poire."],
  ["Which sentence is correct?", "Mes amis sont plus drôles que moi.", ["Mes amis sont plus drôle que moi.", "Mes amis sont plus drôles de moi."], "The adjective agrees with the first person or thing, and “que” follows plus: plus drôles que moi."],
  ["What does “Mon frère est moins fatigué que moi” mean?", "My brother is less tired than me", ["My brother is more tired than me", "My brother is as tired as me"], COMP_HINT],
  ["What does “Il fait plus froid en janvier qu'en juin” mean?", "It is colder in January than in June", ["It is warmer in January than in June", "It is as cold in January as in June"], COMP_HINT],
  ["What does “Elle est plus âgée que son frère” mean?", "She is older than her brother", ["She is younger than her brother", "She is as old as her brother"], COMP_HINT],
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
  ["Mon père est ___. (generous)", "généreux", ["généreuse", "généreuses"], PERS_HINT],
  ["Ma tante est ___. (generous)", "généreuse", ["généreux", "généreuses"], PERS_HINT],
  ["Mes cousines sont ___. (funny)", "drôles", ["drôle", "drôl"], PERS_HINT],
  ["Mon oncle est ___. (patient)", "patient", ["patiente", "patients"], PERS_HINT],
  ["Ma grand-mère est ___. (kind)", "gentille", ["gentil", "gentils"], PERS_HINT],
  ["Mes sœurs sont ___. (athletic)", "sportives", ["sportifs", "sportive"], PERS_HINT],
  ["Mon ami est ___. (smart)", "intelligent", ["intelligente", "intelligents"], PERS_HINT],
  ["Mon voisin est ___. (calm)", "calme", ["calmes", "calm"], PERS_HINT],
  ["What does “Il est travailleur” mean?", "He is hardworking", ["He is lazy", "He is shy"], PERS_HINT],
  ["What does “Elle est paresseuse” mean?", "She is lazy", ["She is hardworking", "She is brave"], PERS_HINT],
  ["What does “Mon professeur est sévère” mean?", "My teacher is strict", ["My teacher is sleepy", "My teacher is new"], PERS_HINT],
  ["How do you say “My brother is shy”?", "Mon frère est timide.", ["Mon frère est timides.", "Ma frère est timide."], PERS_HINT],
  ["Which word is the opposite of “paresseux”?", "travailleur", ["timide", "drôle"], PERS_HINT],
  ["Which question asks “What is your teacher like?”", "Comment est ton professeur?", ["Où est ton professeur?", "Qui est ton professeur?"], "“Comment est…?” asks for a description."],
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
  ["Which French word is a cognate of “chocolate”?", "chocolat", ["fromage", "pain"], COG_HINT],
  ["Which French word is a cognate of “music”?", "musique", ["peinture", "danse"], COG_HINT],
  ["Which French word is a cognate of “family”?", "famille", ["ami", "frère"], COG_HINT],
  ["You see “aéroport” on a sign. What is it?", "an airport", ["a train station", "a harbour"], COG_HINT],
  ["You see “cinéma” on a sign. What is it?", "a movie theatre", ["a circus", "a market"], COG_HINT],
  ["You see “banque” on a sign. What is it?", "a bank", ["a bench", "a bakery"], COG_HINT],
  ["What does “la monnaie” mean? (a faux ami)", "change, or coins", ["a monkey", "the moon"], "“La monnaie” is the small change in your pocket, not the word for all money."],
  ["What does “la lecture” mean? (a faux ami)", "reading", ["a lecture", "a library"], "A lecture is “une conférence” or “un cours”. “La lecture” is reading."],
  ["What does “attendre” mean? (a faux ami)", "to wait", ["to attend", "to attack"], "To attend is “assister à”. “Attendre” means to wait."],
  ["What does “assister à” mean? (a faux ami)", "to attend", ["to assist", "to assure"], "“Assister à” means to be present at an event."],
  ["What does “la veste” mean? (a faux ami)", "the jacket", ["the vest", "the west"], "A vest is “un gilet”. “La veste” is a jacket."],
  ["What does “crier” mean? (a faux ami)", "to shout", ["to cry", "to creep"], "To cry with tears is “pleurer”. “Crier” means to shout."],
  ["Which strategy helps when you read a story and meet a new word?", "Look at the pictures and the words around it", ["Stop reading", "Skip the whole book"], COG_HINT],
  ["Which strategy helps when you listen to French?", "Listen for words you know and watch gestures", ["Cover your ears", "Wait for someone to speak English"], COG_HINT],
  ["Which French word looks like “library” but means “bookstore”?", "librairie", ["bibliothèque", "bibliographie"], "A library is “une bibliothèque”. “Une librairie” sells books."],
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

const PICNIC = {
  type: "passage" as const,
  title: "Le pique-nique",
  paragraphs: [
    "C'est samedi. Priya et son père préparent un pique-nique. Ils mettent des sandwichs, des fraises et de l'eau dans un panier. Ils marchent jusqu'au parc. Soudain, il commence à pleuvoir! Ils mangent sous un grand arbre et rient ensemble.",
  ],
};

const NEIGHBOUR = {
  type: "passage" as const,
  title: "Le nouveau voisin",
  paragraphs: [
    "Un nouveau garçon, Kenji, habite à côté de chez Noah. Il ne parle pas encore beaucoup de français. Noah lui montre le parc et l'école. Ils jouent au soccer. Le soir, Kenji dit : « Merci, Noah! Tu es mon premier ami. »",
  ],
};

const HAT = {
  type: "passage" as const,
  title: "La tuque perdue",
  paragraphs: [
    "Ana perd sa tuque rouge dans la neige. Elle cherche dans la cour, puis près de l'école. Son ami Leo lui dit : « Regarde! Elle est sur la clôture! » Ana rit et remet sa tuque. Elle dit : « Merci, Leo! »",
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
  ["Who goes on the picnic?", "Priya and her father", ["Priya and her mother", "Priya and her friend"], STORY_HINT, PICNIC],
  ["What food is in the basket?", "Sandwiches, strawberries and water", ["Cheese, apples and juice", "Soup, bread and milk"], STORY_HINT, PICNIC],
  ["What is the problem?", "It starts to rain", ["They lose the basket", "The park is closed"], STORY_HINT, PICNIC],
  ["How do they solve the problem?", "They eat under a big tree", ["They go home", "They cancel the picnic"], STORY_HINT, PICNIC],
  ["Who is new in the neighbourhood?", "Kenji", ["Noah", "Amir"], STORY_HINT, NEIGHBOUR],
  ["What does Noah show Kenji?", "The park and the school", ["The library and the pool", "The bakery and the museum"], STORY_HINT, NEIGHBOUR],
  ["What do the boys play?", "Soccer", ["Hockey", "Basketball"], STORY_HINT, NEIGHBOUR],
  ["Why is Kenji thankful?", "Noah is his first friend", ["Noah gives him a gift", "Noah gives him homework"], STORY_HINT, NEIGHBOUR],
  ["What does Ana lose?", "Her red hat", ["Her blue scarf", "Her red mitten"], STORY_HINT, HAT],
  ["Where does Ana look first?", "In the yard", ["At home", "In the gym"], STORY_HINT, HAT],
  ["Who sees the hat?", "Leo", ["Ana", "Her teacher"], STORY_HINT, HAT],
  ["Where is the hat?", "On the fence", ["In the snow", "In her bag"], STORY_HINT, HAT],
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
  ["Which country in Europe has French as one of its official languages?", "Switzerland", ["Portugal", "Norway"], WORLD_HINT, "🏔️"],
  ["Which large Francophone African country has Kinshasa as its capital?", "The Democratic Republic of the Congo", ["Kenya", "Egypt"], WORLD_HINT, "🌍"],
  ["Dakar is the capital of which country?", "Senegal", ["Haiti", "Belgium"], WORLD_HINT, "🌍"],
  ["Port-au-Prince is the capital of which country?", "Haiti", ["Senegal", "Morocco"], WORLD_HINT, "🌴"],
  ["Rabat is the capital of which country?", "Morocco", ["Senegal", "Belgium"], WORLD_HINT, "🌍"],
  ["Martinique is an island in which sea?", "The Caribbean Sea", ["The Arctic Ocean", "The Baltic Sea"], "French is spoken on Martinique, a Caribbean island that is part of France.", "🏝️"],
  ["Tahiti is an island where French is spoken. It is in the…", "Pacific Ocean", ["Atlantic Ocean", "Arctic Ocean"], "Tahiti is part of French Polynesia, where French and Tahitian are both spoken.", "🌺"],
  ["The Eiffel Tower is in which city?", "Paris", ["Brussels", "Dakar"], WORLD_HINT, "🗼"],
  ["The Atomium, a giant silver building, is in which Francophone city?", "Brussels", ["Paris", "Montréal"], WORLD_HINT, "🏛️"],
  ["Is French an official language of the United Nations?", "Yes", ["No", "Only in Québec"], WORLD_HINT, "🌐"],
  ["On which continent do most people who speak French live?", "Africa", ["Asia", "Australia"], WORLD_HINT, "🗺️"],
  ["Cajun culture in Louisiana has roots in which community?", "Acadians from Atlantic Canada", ["Settlers from Brazil", "Travellers from Japan"], "Many Cajun families are descended from Acadians, who kept their French language and music alive.", "🎻"],
  ["Which language is spoken in Haiti alongside French?", "Haitian Creole", ["Spanish", "Portuguese"], WORLD_HINT, "🗣️"],
  ["What is the largest city in Québec?", "Montréal", ["Québec City", "Ottawa"], WORLD_HINT, "🏙️"],
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
  ["A classmate wears a traditional outfit for a cultural day. What is respectful?", "Ask about it with curiosity and thank them for sharing", ["Laugh at the colours", "Post photos without asking"], CULT_HINT],
  ["Before posting a video of a friend's family dance, you should…", "ask the family for permission", ["change the music", "tag random people"], CULT_HINT],
  ["Which is an example of plagiarism?", "Handing in an essay copied from a website", ["Quoting a book and naming the author", "Writing a summary in your own words"], CULT_HINT],
  ["You use an idea from a book. How do you avoid plagiarism?", "Say whose idea it is and where you read it", ["Change the title", "Mix it with someone else's idea"], CULT_HINT],
  ["What is a good way to learn about a Francophone tradition?", "Read or listen to people from that community", ["Make a guess", "Copy a movie"], CULT_HINT],
  ["What does “giving credit” mean?", "Saying who created the work you use", ["Giving a prize", "Paying money"], CULT_HINT],
  ["A company copies a community's traditional pattern for its products without asking or crediting. This is…", "cultural appropriation", ["cultural appreciation", "a school project"], CULT_HINT],
  ["Which choice shows respect when you present about Métis culture?", "Use sources by Métis people and explain that every community is different", ["Say all Indigenous peoples are the same", "Use one cartoon as proof"], CULT_HINT],
  ["You copy a paragraph and change three words. Is that okay?", "No, use your own words and cite the source", ["Yes, it is now yours", "Yes, if nobody notices"], CULT_HINT],
  ["Why do we ask before using someone's drawing in a poster?", "It is their work, and they should decide", ["Drawings are always free", "It is faster"], CULT_HINT],
  ["A traditional story belongs to a community. How do you share it responsibly?", "Credit the storyteller and share it only as they allow", ["Say you invented it", "Change the ending to be funnier"], CULT_HINT],
  ["Which behaviour shows curiosity without disrespect?", "Asking, “Can you teach me about this tradition?”", ["Saying, “That's strange”", "Mimicking it for laughs"], CULT_HINT],
  ["Which is the most trustworthy source of facts about a Francophone country?", "Its government or national museum website", ["A rumour", "A stranger's comment"], CULT_HINT],
  ["A teammate says “I wrote this poem”, but you know it is from a book. What is a kind thing to do?", "Gently remind them to credit the author", ["Tell everyone loudly", "Say nothing and copy it too"], CULT_HINT],
  ["What is the difference between inspiration and copying?", "Inspiration creates something new and credits the idea", ["They are the same thing", "Copying is always allowed with a friend"], CULT_HINT],
  ["When you cite a website, what should you include?", "Its name and where you found it", ["Only your name", "Nothing"], CULT_HINT],
];

export const course: Course = {
  grade: "7",
  subject: "core-french",
  bigIdeas: {
    "ca-bc": [
      "Listening and viewing with intent helps us increase our understanding of French.",
      "Using various strategies helps us understand and acquire language.",
      "With simple French, we can discuss our interests.",
      "Reciprocal interactions are possible even with limited French.",
      "Stories help us to acquire language and understand the world around us.",
      "Deepening our knowledge of Francophone communities helps us develop cultural awareness.",
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
      generate: (o) => coreQuestions(DIRECTIONS, o, 8),
    },
    {
      id: "lieux",
      title: "Places in town",
      emoji: "🏙️",
      blurb: "La ville et les magasins",
      parentNote: "Vocabulary for places in a community and the contractions au, à la, à l'.",
      standards: { "ca-bc": "Locations and directions; cultural aspects of communities" },
      generate: (o) => coreQuestions(PLACES, o, 8),
    },
    {
      id: "comparaisons",
      title: "Comparing",
      emoji: "⚖️",
      blurb: "Plus, moins, aussi… que",
      parentNote: "Making simple comparisons with plus… que, moins… que and aussi… que, and the special forms meilleur and mieux.",
      standards: { "ca-bc": "Simple comparisons" },
      generate: (o) => coreQuestions(COMPARE, o, 8),
    },
    {
      id: "personnalite",
      title: "Describing people",
      emoji: "🙂",
      blurb: "Family, friends, teachers",
      parentNote: "Describing the personality of family, friends and teachers, with adjectives that agree in gender and number.",
      standards: { "ca-bc": "Describing others, such as family, friends and teachers" },
      generate: (o) => coreQuestions(PERSONALITY, o, 8),
    },
    {
      id: "mots-amis",
      title: "Cognates and strategies",
      emoji: "🔍",
      blurb: "Words that look alike",
      parentNote: "Using cognates and context to understand new French words, and watching out for false friends such as librairie.",
      standards: { "ca-bc": "Use a range of strategies to support understanding, such as using cognates and context" },
      generate: (o) => coreQuestions(COGNATES, o, 8),
    },
    {
      id: "histoires",
      title: "Reading short stories",
      emoji: "📖",
      blurb: "Characters, setting, problem",
      parentNote: "Understanding key information and events in simple French stories: characters, setting, problem and solution.",
      standards: { "ca-bc": "Stories: common story elements (place, characters, setting and plot)" },
      generate: (o) => coreQuestions(STORIES, o, 8),
    },
    {
      id: "monde-francophone",
      title: "The Francophone world",
      emoji: "🌍",
      blurb: "French around the world",
      parentNote: "Communities where French is spoken around the world, such as Belgium, Haiti, Morocco and Senegal, and in Canada.",
      standards: { "ca-bc": "Communities where French is spoken across Canada and around the world" },
      generate: (o) => coreQuestions(WORLD, o, 8),
    },
    {
      id: "cultures-et-respect",
      title: "Culture and honesty",
      emoji: "🤝",
      blurb: "Appropriation and plagiarism",
      parentNote: "The ethics of cultural appropriation and plagiarism: crediting sources and learning from cultures respectfully.",
      standards: { "ca-bc": "Ethics: cultural appropriation; plagiarism" },
      generate: (o) => coreQuestions(CULTURE, o, 8),
    },
  ],
};
