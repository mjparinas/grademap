import { coreQuestions, tagCoreFrench, type FrItem } from "../../french";
import { randInt, shuffle, textChoice } from "../../random";
import type { Course, GenerateOptions, Question } from "../../types";

// Core French: instructions are in English, the French is what students learn.

// ---------- Salutations ----------

const GREET_HINT = "Greetings and polite phrases are the first building blocks of French. Say each one out loud as you read it.";

const GREETINGS: FrItem[] = [
  ["What do you say when you meet someone in the morning?", "Bonjour", ["Bonsoir", "Au revoir"], GREET_HINT],
  ["What do you say when you meet someone in the evening?", "Bonsoir", ["Bonjour", "Bonne chance"], "“Bonsoir” is used from the late afternoon on. “Bonjour” is for the day."],
  ["What does “Comment t'appelles-tu?” mean?", "What is your name?", ["How old are you?", "Where do you live?"], GREET_HINT],
  ["How do you say your name?", "Je m'appelle Léa.", ["J'ai dix ans.", "Ça va bien."], GREET_HINT],
  ["How do you answer “Comment ça va?” if you feel great?", "Ça va très bien!", ["Je m'appelle Maya.", "J'ai neuf ans."], GREET_HINT],
  ["What does “De rien” mean?", "You're welcome", ["Thank you", "Excuse me"], GREET_HINT],
  ["What does “Excusez-moi” mean?", "Excuse me", ["Goodbye", "Thank you"], GREET_HINT],
  ["What does “À bientôt” mean?", "See you soon", ["Good night", "Please"], GREET_HINT],
  ["What does “S'il vous plaît” mean?", "Please", ["Thank you", "You're welcome"], GREET_HINT],
  ["What does “Enchanté” mean when you meet someone?", "Nice to meet you", ["See you later", "I'm hungry"], GREET_HINT],
  ["Which greeting is polite for a teacher you've just met?", "Bonjour, madame.", ["Salut!", "Allô!"], "With adults, start with “Bonjour” and use “madame” or “monsieur”."],
  ["How do you say “Thank you very much”?", "Merci beaucoup", ["Pas de problème", "Bonne nuit"], GREET_HINT],
  ["How do you say goodbye?", "Au revoir", ["Bonjour", "Merci"], GREET_HINT],
  ["What does “Bonsoir” mean?", "Good evening", ["Good morning", "Please"], GREET_HINT],
  ["What does “Bonne nuit” mean?", "Good night", ["Good evening", "See you soon"], GREET_HINT],
  ["What does “Salut” mean?", "Hi", ["Thank you", "Excuse me"], GREET_HINT],
  ["How do you say “I'm sorry”?", "Désolé", ["Enchanté", "De rien"], GREET_HINT],
  ["How do you politely ask an adult how they are?", "Comment allez-vous?", ["Comment t'appelles-tu?", "Quel âge as-tu?"], "“Comment allez-vous?” is the polite way to ask an adult how they are."],
  ["How do you ask someone's age?", "Quel âge as-tu?", ["Comment ça va?", "Où habites-tu?"], GREET_HINT],
  ["How do you say “I am ten years old”?", "J'ai dix ans.", ["Je suis dix ans.", "Je m'appelle dix."], "In French you “have” your age: j'ai dix ans."],
  ["What does “Où habites-tu?” ask?", "Where do you live?", ["What is your name?", "How old are you?"], GREET_HINT],
  ["How do you say “I live in Canada”?", "J'habite au Canada.", ["Je m'appelle Canada.", "J'ai au Canada."], GREET_HINT],
  ["What does “Bienvenue” mean?", "Welcome", ["Goodbye", "Good luck"], GREET_HINT],
  ["What does “Bonne chance” mean?", "Good luck", ["Good night", "Thank you"], GREET_HINT],
  ["How do you answer “Comment ça va?” when you feel tired?", "Je suis fatigué.", ["Je m'appelle Léa.", "Merci beaucoup."], GREET_HINT],
];

// ---------- Sons et accents ----------

const SOUND_HINT = "French spelling follows patterns. Accents change the letter's sound or show the word's history, so they must be written.";

const SOUNDS: FrItem[] = [
  ["Which word has an accent aigu (é)?", "école", ["ami", "chat", "lune"], SOUND_HINT],
  ["Which word has a cédille (ç)?", "garçon", ["garage", "chat", "grand"], SOUND_HINT],
  ["Which word has an accent circonflexe (ê, â, ô)?", "forêt", ["forme", "lune", "vélo"], SOUND_HINT],
  ["Which word has an accent grave (è)?", "mère", ["mari", "mur", "pas"], SOUND_HINT],
  ["Which word has a nasal vowel, like the “on” in “bon”?", "bon", ["bol", "bal", "bus"], SOUND_HINT],
  ["Which word has a nasal vowel, like the “an” in “enfant”?", "enfant", ["école", "lune", "salade"], SOUND_HINT],
  ["In “chat”, the letters “ch” make the sound…", "sh (as in ship)", ["k (as in kite)", "ch (as in chair)"], SOUND_HINT],
  ["In “rouge”, the letters “ou” sound like…", "oo (as in food)", ["ow (as in cow)", "oh (as in go)"], SOUND_HINT],
  ["In “jaune”, the letter “j” sounds like…", "the s in “measure”", ["the j in “jump”", "the y in “yes”"], SOUND_HINT],
  ["Which spelling is correct?", "français", ["francais", "françias", "frencais"], SOUND_HINT],
  ["Which spelling is correct?", "été", ["ete", "étè", "êté"], SOUND_HINT],
  ["The final “t” in “petit” is usually…", "silent", ["pronounced like “t”", "pronounced like “s”"], "Many final consonants in French are not pronounced."],
  ["Which word has an accent aigu (é)?", "élève", ["table", "lune", "moto"], SOUND_HINT],
  ["Which word has an accent grave (è)?", "père", ["pomme", "pied", "pont"], SOUND_HINT],
  ["Which word has a cédille (ç)?", "leçon", ["lune", "lac", "loup"], SOUND_HINT],
  ["Which word has an accent circonflexe (ê, â, ô)?", "tête", ["thé", "tente", "taille"], SOUND_HINT],
  ["Which word has a nasal vowel, like the “in” in “matin”?", "lapin", ["lac", "lune", "salade"], SOUND_HINT],
  ["Which word has a nasal vowel, like the “on” in “bon”?", "pont", ["port", "pot", "pas"], SOUND_HINT],
  ["In “gare”, the letter “g” sounds like…", "g (as in go)", ["j (as in jam)", "s (as in sun)"], SOUND_HINT],
  ["In “gentil”, the letter “g” sounds like…", "zh (like the s in measure)", ["g (as in go)", "s (as in sun)"], "Before e, i and y, the letter g makes a soft sound."],
  ["In “ville”, the final “e” is…", "silent", ["pronounced like ay", "pronounced like ee"], "Many final letters in French are not pronounced."],
  ["Which spelling is correct?", "élève", ["eleve", "élevè", "êlève"], SOUND_HINT],
  ["Which spelling is correct?", "hôpital", ["hopital", "hôpitale", "ôpital"], SOUND_HINT],
  ["Which spelling is correct?", "forêt", ["foret", "forét", "forèt"], SOUND_HINT],
  ["Which spelling is correct?", "ça va", ["ca va", "çà va", "cá va"], SOUND_HINT],
];

// ---------- Les nombres ----------

const NUMBER_WORDS: Record<number, string> = {
  0: "zéro", 1: "un", 2: "deux", 3: "trois", 4: "quatre", 5: "cinq", 6: "six", 7: "sept", 8: "huit", 9: "neuf", 10: "dix",
  11: "onze", 12: "douze", 13: "treize", 14: "quatorze", 15: "quinze", 16: "seize", 17: "dix-sept", 18: "dix-huit", 19: "dix-neuf",
  20: "vingt", 21: "vingt et un", 22: "vingt-deux", 23: "vingt-trois", 24: "vingt-quatre", 25: "vingt-cinq", 26: "vingt-six",
  27: "vingt-sept", 28: "vingt-huit", 29: "vingt-neuf", 30: "trente",
};

function near(n: number, count: number): number[] {
  const out = new Set<number>();
  for (const d of shuffle([1, -1, 2, -2, 10, -10, 3, -3])) {
    const m = n + d;
    if (m >= 0 && m <= 30 && m !== n) out.add(m);
    if (out.size >= count) break;
  }
  return [...out];
}

function nombres(opts?: GenerateOptions): Question[] {
  const wrongCount = opts?.difficulty === 1 ? 1 : opts?.difficulty === 3 ? 3 : 2;
  const qs: Question[] = [];
  for (let i = 0; i < 3; i++) {
    const n = randInt(0, 30);
    qs.push(textChoice(`Which word means ${n}?`, NUMBER_WORDS[n], near(n, wrongCount).map((m) => NUMBER_WORDS[m]), "Break big numbers into parts: dix-sept is 10 + 7, vingt-trois is 20 + 3."));
  }
  for (let i = 0; i < 3; i++) {
    const n = randInt(0, 30);
    qs.push(textChoice(`What number is “${NUMBER_WORDS[n]}”?`, String(n), near(n, wrongCount).map(String), "Break big numbers into parts: dix-sept is 10 + 7, vingt-trois is 20 + 3."));
  }
  for (let i = 0; i < 2; i++) {
    const a = randInt(1, 10);
    const b = randInt(1, 10);
    qs.push(textChoice(`Combien font ${a} + ${b}?`, NUMBER_WORDS[a + b], near(a + b, wrongCount).map((m) => NUMBER_WORDS[m]), "Add the numbers, then say the answer in French."));
  }
  return qs.map(tagCoreFrench);
}

// ---------- Le, la, les ----------

const GENDER_HINT = "French nouns are masculine (le, un) or feminine (la, une). In the plural, both use les (des). Learn each noun with its article.";

const GENDER: FrItem[] = [
  ["Which article goes with “livre”?", "le", ["la", "les"], GENDER_HINT],
  ["Which article goes with “table”?", "la", ["le", "un"], GENDER_HINT],
  ["Which article goes with “chaise”?", "une", ["un", "le"], GENDER_HINT],
  ["Which article goes with “crayon”?", "un", ["une", "la"], GENDER_HINT],
  ["What is the plural of “le chat”?", "les chats", ["la chats", "le chats"], GENDER_HINT],
  ["What is the plural of “une pomme”?", "des pommes", ["un pommes", "une pommes"], GENDER_HINT],
  ["What is the plural of “un cheval”?", "des chevaux", ["des chevals", "un chevaux"], "Words ending in -al usually change to -aux in the plural."],
  ["What is the plural of “un gâteau”?", "des gâteaux", ["des gâteaus", "un gâteaux"], "Words ending in -eau add an x in the plural."],
  ["Which sentence is correct?", "Le garçon est petit.", ["Le garçon est petite.", "La garçon est petit."], "The adjective agrees with the noun: petit (masculine), petite (feminine)."],
  ["Which sentence is correct?", "La fille est petite.", ["La fille est petit.", "Le fille est petite."], "The adjective agrees with the noun: petit (masculine), petite (feminine)."],
  ["Which sentence is correct?", "Les enfants sont contents.", ["Les enfants est content.", "Les enfants sont content."], "A plural subject takes a plural verb (sont) and an adjective with an s."],
  ["How do you say “the school”?", "l'école", ["le école", "la école"], "Before a vowel sound, le and la become l'."],
  ["Which article goes with “école”?", "une", ["un", "le"], GENDER_HINT],
  ["Which article goes with “stylo”?", "un", ["une", "la"], GENDER_HINT],
  ["Which article goes with “porte”?", "la", ["le", "un"], GENDER_HINT],
  ["Which article goes with “soleil”?", "le", ["la", "une"], GENDER_HINT],
  ["What is the plural of “un livre”?", "des livres", ["un livres", "des livre"], GENDER_HINT],
  ["What is the plural of “le chien”?", "les chiens", ["le chiens", "les chien"], GENDER_HINT],
  ["What is the plural of “un journal”?", "des journaux", ["des journals", "un journaux"], "Words ending in -al usually change to -aux in the plural."],
  ["What is the plural of “un bateau”?", "des bateaux", ["des bateaus", "un bateaux"], "Words ending in -eau add an x in the plural."],
  ["Which sentence is correct?", "Les filles sont petites.", ["Les filles est petite.", "Les filles sont petit."], "A plural subject takes a plural verb (sont) and an adjective with an s."],
  ["Which sentence is correct?", "Mon frère est grand.", ["Mon frère est grande.", "Ma frère est grand."], "The adjective agrees with the noun: grand (masculine), grande (feminine)."],
  ["Which sentence is correct?", "La chatte est blanche.", ["La chatte est blanc.", "Le chatte est blanche."], "The adjective agrees with the noun: blanc (masculine), blanche (feminine)."],
  ["Which sentence is correct?", "Les livres sont verts.", ["Les livres sont vert.", "Les livre sont verts."], "A plural subject takes a plural verb (sont) and an adjective with an s."],
  ["How do you say “the friend” (a boy)?", "l'ami", ["le ami", "la ami"], "Before a vowel sound, le and la become l'."],
  ["How do you say “the orange”?", "l'orange", ["le orange", "la orange"], "Before a vowel sound, le and la become l'."],
];

// ---------- J'aime, je n'aime pas ----------

const LIKE_HINT = "Use j'aime (I like), j'adore (I love), je préfère (I prefer), je n'aime pas (I don't like) and je déteste (I hate), then add le, la, l' or les plus the thing.";

const LIKES: FrItem[] = [
  ["How do you say “I like pizza”?", "J'aime la pizza.", ["Je n'aime pas la pizza.", "Je déteste la pizza."], LIKE_HINT],
  ["What does “Je déteste le brocoli” mean?", "I hate broccoli", ["I love broccoli", "I like broccoli"], LIKE_HINT],
  ["What does “J'adore la musique” mean?", "I love music", ["I don't like music", "I prefer music"], LIKE_HINT],
  ["What does “Je préfère l'été” mean?", "I prefer summer", ["I hate summer", "I like winter"], LIKE_HINT],
  ["How do you say “I don't like winter”?", "Je n'aime pas l'hiver.", ["J'aime l'hiver.", "J'adore l'hiver."], LIKE_HINT],
  ["How do you say “I like to read”?", "J'aime lire.", ["Je déteste lire.", "Je n'aime pas lire."], LIKE_HINT],
  ["How do you say “I love dogs”?", "J'adore les chiens.", ["Je déteste les chiens.", "Je n'aime pas les chiens."], LIKE_HINT],
  ["How do you say “I play hockey”?", "Je joue au hockey.", ["Je joue du hockey.", "Je fais au hockey."], "With sports we say jouer + à + the sport: au hockey, au soccer."],
  ["What does “Elle aime dessiner” mean?", "She likes to draw", ["She likes to dance", "She doesn't like to draw"], LIKE_HINT],
  ["How do you ask a friend “Do you like music?”", "Est-ce que tu aimes la musique?", ["Est-ce que aimes tu la musique?", "Tu est-ce que aimes la musique?"], "Start with “Est-ce que” and keep the rest of the sentence in its usual order."],
  ["What does “Je n'aime pas le poisson” mean?", "I don't like fish", ["I love fish", "I eat fish"], LIKE_HINT],
  ["How do you say “I love soccer”?", "J'adore le soccer.", ["Je déteste le soccer.", "Je n'aime pas le soccer."], LIKE_HINT],
  ["How do you say “I prefer tea”?", "Je préfère le thé.", ["J'adore le thé.", "Je déteste le thé."], LIKE_HINT],
  ["What does “Il déteste les araignées” mean?", "He hates spiders", ["He loves spiders", "He likes to draw spiders"], LIKE_HINT],
  ["How do you say “I like to swim”?", "J'aime nager.", ["Je déteste nager.", "Je n'aime pas nager."], LIKE_HINT],
  ["What does “Nous aimons la pizza” mean?", "We like pizza", ["I like pizza", "They like pizza"], "“Nous” means “we”, and the verb ends in -ons."],
  ["How do you say “I play the piano”?", "Je joue du piano.", ["Je joue au piano.", "Je joue le piano."], "With instruments we say jouer + de + the instrument: du piano, de la guitare."],
  ["How do you say “I love to dance”?", "J'adore danser.", ["Je déteste danser.", "Je n'aime pas danser."], LIKE_HINT],
  ["What does “Tu aimes le chocolat?” ask?", "Do you like chocolate?", ["Do you have chocolate?", "Where is the chocolate?"], LIKE_HINT],
  ["How do you say “I don't like spiders”?", "Je n'aime pas les araignées.", ["J'adore les araignées.", "J'aime les araignées."], LIKE_HINT],
  ["What does “Ma matière préférée est l'art” mean?", "My favourite subject is art", ["I prefer art to math", "I hate art class"], LIKE_HINT],
  ["How do you say “She likes to sing”?", "Elle aime chanter.", ["Il aime chanter.", "Elle déteste chanter."], LIKE_HINT],
  ["How do you say “I play soccer”?", "Je joue au soccer.", ["Je joue du soccer.", "Je fais au soccer."], "With sports we say jouer + à + the sport: au hockey, au soccer."],
  ["How do you say “I prefer to read”?", "Je préfère lire.", ["Je n'aime pas lire.", "J'adore lire."], LIKE_HINT],
  ["How do you ask a friend “What do you like?”", "Qu'est-ce que tu aimes?", ["Où est-ce que tu aimes?", "Qui aime tu?"], "“Qu'est-ce que” asks “what”."],
];

// ---------- Descriptions ----------

const DESC_HINT = "Adjectives agree with who you describe: il est grand / elle est grande. Add -e for a girl or a feminine noun.";

const DESCRIBE: FrItem[] = [
  ["Which sentence says “She is tall”?", "Elle est grande.", ["Il est grand.", "Elle est petite."], DESC_HINT],
  ["Which sentence says “He is small”?", "Il est petit.", ["Elle est petite.", "Il est grand."], DESC_HINT],
  ["What does “Elle a les cheveux bruns” mean?", "She has brown hair", ["She has brown eyes", "She has short hair"], DESC_HINT],
  ["What does “Il a les yeux bleus” mean?", "He has blue eyes", ["He has blue hair", "He has green eyes"], DESC_HINT],
  ["How do you say “The cat is black”?", "Le chat est noir.", ["Le chat est noire.", "La chat est noir."], DESC_HINT],
  ["How do you say “The house is white”?", "La maison est blanche.", ["La maison est blanc.", "Le maison est blanche."], DESC_HINT],
  ["Which word means “funny”?", "drôle", ["triste", "timide"], DESC_HINT],
  ["Which word means “kind”?", "gentil", ["méchant", "fatigué"], DESC_HINT],
  ["What does “Mon ami est sportif” mean?", "My friend is athletic", ["My friend is tired", "My friend is shy"], DESC_HINT],
  ["How do you say “She is happy”?", "Elle est contente.", ["Il est content.", "Elle est triste."], DESC_HINT],
  ["Which sentence says “He is tall”?", "Il est grand.", ["Elle est grande.", "Il est petit."], DESC_HINT],
  ["Which sentence says “She is short”?", "Elle est petite.", ["Il est petit.", "Elle est grande."], DESC_HINT],
  ["What does “Elle a les cheveux blonds” mean?", "She has blond hair", ["She has brown hair", "She has blue eyes"], DESC_HINT],
  ["What does “Il a les cheveux roux” mean?", "He has red hair", ["He has black hair", "He has grey eyes"], DESC_HINT],
  ["What does “Elle a les yeux verts” mean?", "She has green eyes", ["She has green hair", "She has blue eyes"], DESC_HINT],
  ["How do you say “The dog is big”?", "Le chien est grand.", ["Le chien est grande.", "La chien est grand."], DESC_HINT],
  ["How do you say “The flower is yellow”?", "La fleur est jaune.", ["La fleur est jaunes.", "Le fleur est jaune."], DESC_HINT],
  ["How do you say “The books are red”?", "Les livres sont rouges.", ["Les livres est rouge.", "Les livres sont rouge."], DESC_HINT],
  ["Which word means “shy”?", "timide", ["drôle", "sportif"], DESC_HINT],
  ["Which word means “tired”?", "fatigué", ["content", "gentil"], DESC_HINT],
  ["Which word means “brave”?", "courageux", ["triste", "timide"], DESC_HINT],
  ["Which word means “young”?", "jeune", ["vieux", "grand"], DESC_HINT],
  ["What does “Mon frère est timide” mean?", "My brother is shy", ["My brother is funny", "My brother is tall"], DESC_HINT],
  ["How do you say “He is sad”?", "Il est triste.", ["Elle est contente.", "Il est content."], DESC_HINT],
  ["What does “Ma sœur est sportive” mean?", "My sister is athletic", ["My sister is shy", "My sister is kind"], DESC_HINT],
];

// ---------- Les communautés francophones ----------

const COMM_HINT = "French is spoken in every province and territory in Canada. Francophone communities have their own history, music, food and celebrations.";

const COMMUNITIES: FrItem[] = [
  ["Which province has the most French speakers?", "Québec", ["Nova Scotia", "Alberta"], COMM_HINT, "🍁"],
  ["Acadian communities are found mainly in…", "the Atlantic provinces", ["the Prairies", "the North"], COMM_HINT],
  ["The Fransaskois are Francophones in…", "Saskatchewan", ["Nova Scotia", "Nunavut"], COMM_HINT],
  ["Franco-Albertans live in…", "Alberta", ["Manitoba", "Ontario"], COMM_HINT],
  ["Franco-Columbians live in…", "British Columbia", ["Newfoundland and Labrador", "Québec"], COMM_HINT],
  ["Which festival is held in Québec City in the winter?", "Carnaval de Québec", ["Fête nationale de l'Acadie", "Festival du Bois"], "Bonhomme Carnaval is the festival's famous snowman mascot.", "⛄"],
  ["The Festival du Voyageur is held in…", "Winnipeg (Saint-Boniface), Manitoba", ["Halifax, Nova Scotia", "Vancouver, British Columbia"], "The Festival du Voyageur celebrates fur-trade and Francophone history every February.", "🎻"],
  ["The Festival du Bois is held in…", "Coquitlam, British Columbia", ["Charlottetown, PEI", "Calgary, Alberta"], "It celebrates Francophone music and culture in the Maillardville neighbourhood.", "🎶"],
  ["The Fête nationale de l'Acadie, with its noisy tintamarre parade, is on…", "August 15", ["July 1", "December 25"], "Acadians celebrate on August 15 with music and a parade called the tintamarre.", "🥁"],
  ["A Francophone is a person who…", "speaks French", ["lives in Québec", "likes winter"], COMM_HINT],
  ["Michif, the language of many Métis people, combines…", "Cree and French", ["English and Spanish", "Inuktitut and German"], "Michif blends Cree and French. It shows how First Peoples and French-speaking communities have been connected.", "🤝"],
  ["Which Canadian province is officially bilingual in English and French?", "New Brunswick", ["Alberta", "Saskatchewan"], COMM_HINT],
  ["What is the capital city of Québec?", "Québec City", ["Montréal", "Gatineau"], COMM_HINT, "🍁"],
  ["The Festival international de jazz, a large music festival, is held in…", "Montréal, Québec", ["Winnipeg, Manitoba", "Halifax, Nova Scotia"], COMM_HINT, "🎷"],
  ["Saint-Boniface, a Francophone neighbourhood, is part of…", "Winnipeg, Manitoba", ["Coquitlam, British Columbia", "Moncton, New Brunswick"], COMM_HINT],
  ["Maillardville, a Francophone neighbourhood, is in…", "Coquitlam, British Columbia", ["Winnipeg, Manitoba", "Moncton, New Brunswick"], COMM_HINT],
  ["Poutine is a food that comes from…", "Québec", ["Alberta", "Yukon"], COMM_HINT, "🍟"],
  ["Tourtière, a meat pie, is often eaten at…", "Christmas time in Québec", ["summer picnics only", "Halloween only"], COMM_HINT, "🥧"],
  ["Maple syrup is made from the sap of…", "maple trees", ["apple trees", "pine trees"], "Many Francophone families in Québec celebrate the spring sugar season with maple syrup.", "🍁"],
  ["A “cabane à sucre” is a place where people…", "make maple syrup and share a meal", ["repair boats", "grow wheat"], "Many families visit a cabane à sucre in early spring to taste fresh maple syrup.", "🏡"],
  ["The Acadian flag is blue, white and red with…", "a gold star", ["a maple leaf", "a moose"], "The star on the Acadian flag stands for the Virgin Mary, the Acadians' patron, and was chosen in 1884.", "⭐"],
  ["Franco-Ontarians live in…", "Ontario", ["Manitoba", "British Columbia"], COMM_HINT],
  ["Why do many products in Canada have French and English on them?", "Canada has two official languages", ["French is easier to read", "Only Québec has labels"], COMM_HINT],
  ["The Fête nationale du Québec is celebrated on…", "June 24", ["July 1", "August 15"], "Québec's national holiday is on June 24.", "🎆"],
];

// ---------- Respecter les cultures ----------

const RESPECT_HINT = "Plagiarism means using someone else's words or work as if they were yours. Cultural appropriation means using parts of a culture without permission or understanding, in ways that can disrespect it.";

const RESPECT: FrItem[] = [
  ["What is plagiarism?", "Copying someone's work and saying it is yours", ["Reading a book twice", "Asking a friend for help"], RESPECT_HINT],
  ["When you use facts from a book for a project, you should…", "say where they came from", ["pretend you wrote them", "change one word"], RESPECT_HINT],
  ["You find a great paragraph online. What is the honest thing to do?", "Write it in your own words and name the source", ["Copy it and put your name on it", "Copy it and hide the website"], RESPECT_HINT],
  ["What is cultural appropriation?", "Using parts of a culture without permission or understanding", ["Learning about a culture respectfully", "Eating a food from another country"], RESPECT_HINT],
  ["You want to learn about a celebration from a culture that isn't yours. What is respectful?", "Learn what it means and listen to people from that culture", ["Wear a costume as a joke", "Copy it without asking"], RESPECT_HINT],
  ["A classmate shares a story from their family. You should…", "listen respectfully and ask before you retell it", ["post it online without asking", "change the story to be funny"], RESPECT_HINT],
  ["Why do we name our sources?", "To give credit to the people who did the work", ["To make the project longer", "To hide our ideas"], RESPECT_HINT],
  ["Which is an example of respecting another culture?", "Asking questions and learning the real meaning of a tradition", ["Treating a tradition like a costume", "Making fun of a language"], RESPECT_HINT],
  ["You use a picture from a website in your poster. What should you do?", "Say where the picture came from", ["Say you drew it", "Cover up the website name"], RESPECT_HINT],
  ["Why is it unfair to copy a classmate's homework?", "It takes credit for work you did not do", ["It is too easy", "It uses too much paper"], RESPECT_HINT],
  ["What is a source?", "Where you found your information", ["A kind of paint", "A sentence you invent"], RESPECT_HINT],
  ["Which choice shows good research?", "Using more than one book or website", ["Copying one page word for word", "Guessing the facts"], RESPECT_HINT],
  ["A friend tells you about a tradition in their family. What is a respectful question?", "Can you tell me what it means to your family?", ["Why is your family so strange?", "Can I copy it for my party?"], RESPECT_HINT],
  ["What does it mean to put an idea in your own words?", "Say it in a new way and still name the source", ["Copy the words exactly", "Draw a picture of it"], RESPECT_HINT],
  ["You use someone's exact words in your report. You should…", "put quotation marks around them and name the person", ["leave out the quotation marks", "remove their name"], RESPECT_HINT],
  ["Why should you ask permission before using someone's photo?", "It is their work, and they should choose", ["Photos are always free", "It makes the photo look better"], RESPECT_HINT],
  ["Which action shows respect for a language that is not your own?", "Learning how to say words correctly", ["Making up funny sounds", "Laughing at an accent"], RESPECT_HINT],
  ["A bibliography is a list of…", "the sources you used", ["your favourite books", "words you misspelled"], RESPECT_HINT],
  ["Which choice is NOT plagiarism?", "Writing a summary in your own words and naming the source", ["Copying a paragraph from an online article", "Handing in an older sibling's essay"], RESPECT_HINT],
  ["A story belongs to a community. Before sharing it widely you should…", "ask the people it belongs to", ["change the words", "post it quickly"], RESPECT_HINT],
  ["Why do we respect cultural clothing and symbols?", "They can have deep meaning for people", ["They are always costumes", "They are not important"], RESPECT_HINT],
  ["What can you do when you learn about a new culture?", "Read, listen and ask kind questions", ["Guess what it means", "Tell people they are wrong"], RESPECT_HINT],
  ["What does it mean to cite a source?", "To say where the information came from", ["To change the information", "To read it aloud"], RESPECT_HINT],
  ["You hear a joke that makes fun of someone's culture. A kind response is…", "to say that it is not okay", ["to laugh along", "to repeat it"], RESPECT_HINT],
  ["A costume copies another culture's clothing. A respectful choice is to…", "choose a different costume", ["wear it as a joke", "wear it without learning about it"], RESPECT_HINT],
];

export const course: Course = {
  grade: "5",
  subject: "core-french",
  bigIdeas: {
    "ca-bc": [
      "Listening and viewing with intent helps us begin to understand French.",
      "Both verbal and non-verbal cues contribute meaning in language.",
      "With simple French, we can describe ourselves and our interests.",
      "Reciprocal communication in French is possible using high-frequency vocabulary and sentence structures.",
      "Stories help us to acquire language.",
      "Each culture has traditions and ways of celebrating.",
    ],
  },
  units: [
    {
      id: "salutations",
      title: "Salutations",
      emoji: "👋",
      blurb: "Greet and introduce yourself",
      parentNote: "Greetings, introductions and polite phrases: bonjour, comment t'appelles-tu?, merci, de rien, à bientôt.",
      standards: { "ca-bc": "Common high-frequency vocabulary and sentence structures: greetings and introductions; basic information about oneself and others" },
      generate: (o) => coreQuestions(GREETINGS, o, 8),
    },
    {
      id: "sons-et-accents",
      title: "Sounds and accents",
      emoji: "🔊",
      blurb: "Letters, accents, nasal vowels",
      parentNote: "French sounds (including nasal vowels), accents (é, è, ê, ç) and silent letters.",
      standards: { "ca-bc": "The French alphabet; French phonemes, including diphthongs and nasal vowels" },
      generate: (o) => coreQuestions(SOUNDS, o, 8),
    },
    {
      id: "nombres",
      title: "Numbers 0 to 30",
      emoji: "🔢",
      blurb: "Count in French",
      parentNote: "Reading and saying numbers from 0 to 30, and giving small sums in French.",
      standards: { "ca-bc": "Basic information about oneself and others (numbers, age)" },
      generate: nombres,
    },
    {
      id: "genre-et-nombre",
      title: "Masculine, feminine, plural",
      emoji: "⚥",
      blurb: "Le, la, les, un, une",
      parentNote: "An introduction to gender (masculine and feminine) and number (singular and plural) in French nouns and adjectives.",
      standards: { "ca-bc": "An introduction to gender (masculine and feminine forms) and number (singular and plural forms)" },
      generate: (o) => coreQuestions(GENDER, o, 8),
    },
    {
      id: "gouts",
      title: "Likes and dislikes",
      emoji: "❤️",
      blurb: "J'aime, je n'aime pas",
      parentNote: "Saying what you like, love, prefer and dislike, and asking others the same.",
      standards: { "ca-bc": "Likes, dislikes, preferences and interests" },
      generate: (o) => coreQuestions(LIKES, o, 8),
    },
    {
      id: "descriptions",
      title: "Describing people and things",
      emoji: "🧑‍🎨",
      blurb: "Il est grand, elle est petite",
      parentNote: "Simple descriptions of people and objects, with adjectives that agree in gender and number.",
      standards: { "ca-bc": "Simple descriptions" },
      generate: (o) => coreQuestions(DESCRIBE, o, 8),
    },
    {
      id: "communautes-francophones",
      title: "Francophone Canada",
      emoji: "🍁",
      blurb: "Communities and festivals",
      parentNote: "Where French is spoken across Canada, Francophone festivals and celebrations, and a connection between First Peoples and the French language.",
      standards: { "ca-bc": "Communities where French is spoken across Canada; a Francophone cultural festival or celebration in Canada" },
      generate: (o) => coreQuestions(COMMUNITIES, o, 8),
    },
    {
      id: "respect",
      title: "Giving credit, showing respect",
      emoji: "🤝",
      blurb: "Plagiarism and culture",
      parentNote: "The ethics of plagiarism and cultural appropriation, at a Grade 5 level: name your sources and learn about cultures respectfully.",
      standards: { "ca-bc": "The ethics of cultural appropriation and plagiarism" },
      generate: (o) => coreQuestions(RESPECT, o, 8),
    },
  ],
};

