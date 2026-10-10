import { coreQuestions, type FrItem } from "../../french";
import type { Course } from "../../types";

// Core French 8: instructions are in English, the French is what students learn.

// ---------- Passé, présent, futur ----------

const TIME_HINT = "Time words tell you the tense: hier (yesterday) points to the past, aujourd'hui (today) to the present, demain (tomorrow) to the future.";

const TIMES: FrItem[] = [
  ["Which sentence talks about the past?", "J'ai étudié pour mon test hier soir.", ["Nous allons regarder un film demain.", "Elles sont à l'école aujourd'hui."], TIME_HINT],
  ["Which sentence talks about the future?", "Nous allons regarder un film demain.", ["J'ai mangé une pomme hier.", "Il joue au parc maintenant."], TIME_HINT],
  ["Which sentence talks about now?", "Elles sont à l'école aujourd'hui.", ["Elles étaient à l'école hier.", "Elles seront à l'école demain."], TIME_HINT],
  ["Complète : Hier, j'___ une pizza. (past)", "ai mangé", ["mange", "vais manger"], TIME_HINT],
  ["Complète : Demain, nous ___ visiter le musée. (future)", "allons", ["avons", "sommes"], "The near future is aller + an infinitive: nous allons visiter."],
  ["Complète : Aujourd'hui, elles ___ à l'école. (present)", "sont", ["étaient", "seront"], TIME_HINT],
  ["What does “hier” mean?", "yesterday", ["tomorrow", "today"], TIME_HINT],
  ["What does “demain” mean?", "tomorrow", ["yesterday", "today"], TIME_HINT],
  ["How do you say “We went to the park yesterday”?", "Nous sommes allés au parc hier.", ["Nous allons au parc hier.", "Nous irons au parc hier."], TIME_HINT],
  ["How do you say “Tomorrow I am going to play soccer”?", "Demain, je vais jouer au soccer.", ["Demain, j'ai joué au soccer.", "Demain, je jouais au soccer."], TIME_HINT],
  ["Which structure makes the near future?", "aller + an infinitive", ["avoir + a past participle", "être + an adjective"], "Je vais manger, tu vas partir, nous allons jouer."],
  ["Which structure makes the passé composé?", "avoir or être + a past participle", ["aller + an infinitive", "a verb ending in -ment"], "J'ai mangé, elle est partie."],
  ["Complète : Hier, elle ___ ses devoirs. (past)", "a fait", ["fait", "va faire"], TIME_HINT],
  ["What does “aujourd'hui” mean?", "today", ["yesterday", "tomorrow"], TIME_HINT],
  ["Complète : Hier, tu ___ un livre. (lire, past)", "as lu", ["lis", "vas lire"], TIME_HINT],
  ["Complète : Demain, ils ___ jouer au hockey. (near future)", "vont", ["ont", "sont"], "The near future is aller + an infinitive: ils vont jouer."],
  ["Complète : Maintenant, nous ___ nos devoirs. (faire, present)", "faisons", ["avons fait", "allons faire"], TIME_HINT],
  ["Complète : Samedi dernier, elle ___ à la plage. (aller, past)", "est allée", ["a allé", "va aller"], "Aller uses être in the passé composé, and the participle agrees with the subject."],
  ["Which sentence talks about the future?", "Ce soir, je vais cuisiner.", ["Hier, j'ai cuisiné.", "Je cuisine maintenant."], TIME_HINT],
  ["Which sentence talks about the past?", "Le week-end dernier, nous avons dansé.", ["Le week-end prochain, nous allons danser.", "Maintenant, nous dansons."], TIME_HINT],
  ["How do you say “Tomorrow we are going to swim”?", "Demain, nous allons nager.", ["Hier, nous avons nagé.", "Aujourd'hui, nous nageons."], TIME_HINT],
  ["How do you say “Yesterday I read a book”?", "Hier, j'ai lu un livre.", ["Demain, je vais lire un livre.", "Aujourd'hui, je lis un livre."], TIME_HINT],
  ["What does “la semaine prochaine” mean?", "next week", ["last week", "this week"], TIME_HINT],
  ["What does “la semaine dernière” mean?", "last week", ["next week", "every week"], TIME_HINT],
  ["What does “maintenant” mean?", "now", ["later", "yesterday"], TIME_HINT],
  ["Which helper verb goes with “manger” in the passé composé?", "avoir (j'ai mangé)", ["être (je suis mangé)", "aller (je vais mangé)"], "Most verbs use avoir in the passé composé. Only a small group, like aller and arriver, use être."],
  ["Complète : Elle ___ son vélo hier. (réparer, past)", "a réparé", ["répare", "va réparer"], TIME_HINT],
  ["Complète : Ce week-end, je ___ visiter mes cousins. (near future)", "vais", ["ai", "suis"], "The near future is aller + an infinitive: je vais visiter."],
];

// ---------- Les questions ----------

const Q_HINT = "Question words: qui (who), que/qu'est-ce que (what), où (where), quand (when), combien (how many/much), comment (how), pourquoi (why), quel/quelle (which).";

const QUESTIONS: FrItem[] = [
  ["What does “pourquoi” ask?", "why", ["when", "where"], Q_HINT],
  ["What does “quand” ask?", "when", ["why", "how many"], Q_HINT],
  ["What does “où” ask?", "where", ["who", "when"], Q_HINT],
  ["What does “combien” ask?", "how many or how much", ["how", "who"], Q_HINT],
  ["What does “comment” ask?", "how", ["where", "when"], Q_HINT],
  ["What does “qui” ask?", "who", ["what", "where"], Q_HINT],
  ["Complète : ___ habites-tu? — J'habite dans une grande ville.", "Où", ["Quand", "Pourquoi"], Q_HINT],
  ["Complète : ___ est ton anniversaire? — Le 5 mai.", "Quand", ["Où", "Combien"], Q_HINT],
  ["Complète : ___ de frères as-tu? — J'ai deux frères.", "Combien", ["Quand", "Pourquoi"], Q_HINT],
  ["Complète : ___ es-tu fatigué? — Parce que j'ai mal dormi.", "Pourquoi", ["Comment", "Où"], Q_HINT],
  ["Complète : ___ t'appelles-tu? — Je m'appelle Samir.", "Comment", ["Où", "Quand"], Q_HINT],
  ["Complète : ___ est ton enseignant? — C'est madame Roy.", "Qui", ["Où", "Combien"], Q_HINT],
  ["Complète : ___ âge as-tu? — J'ai treize ans.", "Quel", ["Quelle", "Qui"], "Âge is masculine, so we say quel âge. Couleur is feminine: quelle couleur."],
  ["Complète : ___ est ta couleur préférée? — Le vert.", "Quelle", ["Quel", "Quels"], "Couleur is feminine, so we say quelle couleur."],
  ["Which sentence is an est-ce que question?", "Est-ce que tu aimes la musique?", ["Tu aimes la musique.", "La musique est belle."], "Est-ce que at the start turns a statement into a question."],
  ["What does “qu'est-ce que” ask?", "what", ["who", "where"], Q_HINT],
  ["Complète : ___ habite à Calgary? — C'est mon oncle.", "Qui", ["Où", "Quand"], Q_HINT],
  ["Complète : ___ allez-vous? — Au parc.", "Où", ["Quand", "Combien"], Q_HINT],
  ["Complète : ___ coûte ce livre? — Dix dollars.", "Combien", ["Comment", "Pourquoi"], Q_HINT],
  ["Complète : ___ viens-tu à l'école? — En autobus.", "Comment", ["Où", "Combien"], Q_HINT],
  ["Complète : ___ commence le film? — À sept heures.", "Quand", ["Qui", "Pourquoi"], Q_HINT],
  ["Complète : ___ est ton sport préféré? — Le soccer.", "Quel", ["Quelle", "Quels"], "Sport is masculine, so we say quel sport."],
  ["Complète : ___ est ta chanson préférée? — C'est celle-ci.", "Quelle", ["Quel", "Quand"], "Chanson is feminine, so we say quelle chanson."],
  ["Complète : ___ tu manges? — Une pomme.", "Qu'est-ce que", ["Où est-ce que", "Pourquoi"], Q_HINT],
  ["Which question asks about a person?", "Qui est ton ami?", ["Où est ton ami?", "Quand arrive ton ami?"], Q_HINT],
  ["Which question asks about a time?", "Quand est le concert?", ["Qui est le chanteur?", "Où est la salle?"], Q_HINT],
  ["Which question asks about a number?", "Combien de livres as-tu?", ["Comment vas-tu?", "Quel livre lis-tu?"], Q_HINT],
  ["How do you ask “How are you?”", "Comment vas-tu?", ["Combien vas-tu?", "Où vas-tu?"], Q_HINT],
  ["How do you ask “Where is the library?”", "Où est la bibliothèque?", ["Quand est la bibliothèque?", "Qui est la bibliothèque?"], Q_HINT],
];

// ---------- Le temps et la fréquence ----------

const FREQ_HINT = "Frequency words tell how often: toujours (always), souvent (often), parfois (sometimes), jamais (never), chaque jour (every day).";

const FREQUENCY: FrItem[] = [
  ["What does “toujours” mean?", "always", ["never", "sometimes"], FREQ_HINT],
  ["What does “jamais” mean?", "never", ["always", "often"], FREQ_HINT],
  ["What does “parfois” mean?", "sometimes", ["never", "always"], FREQ_HINT],
  ["What does “souvent” mean?", "often", ["never", "yesterday"], FREQ_HINT],
  ["What does “chaque jour” mean?", "every day", ["every week", "once a year"], FREQ_HINT],
  ["Which word means the opposite of “toujours”?", "jamais", ["souvent", "chaque"], FREQ_HINT],
  ["Complète : Je lis ___ jour.", "chaque", ["aucun", "parfois"], FREQ_HINT],
  ["Complète : Il ne mange ___ de viande. (never)", "jamais", ["toujours", "parfois"], "With ne… jamais, the sentence means “never”: Il ne mange jamais de viande."],
  ["Which sentence says you sometimes go to the library?", "Je vais parfois à la bibliothèque.", ["Je vais toujours à la bibliothèque.", "Je ne vais jamais à la bibliothèque."], FREQ_HINT],
  ["How do you say “Every day I walk to school”?", "Chaque jour, je marche à l'école.", ["Parfois, je marche à l'école.", "Je ne marche jamais à l'école."], FREQ_HINT],
  ["Which sentence says Léa never plays hockey?", "Léa ne joue jamais au hockey.", ["Léa joue toujours au hockey.", "Léa joue parfois au hockey."], FREQ_HINT],
  ["Which sentence says Amir always eats breakfast?", "Amir mange toujours un déjeuner.", ["Amir ne mange jamais de déjeuner.", "Amir mange parfois un déjeuner."], FREQ_HINT],
  ["What does “rarement” mean?", "rarely", ["often", "always"], FREQ_HINT],
  ["What does “tous les jours” mean?", "every day", ["every week", "once a month"], FREQ_HINT],
  ["What does “une fois par semaine” mean?", "once a week", ["twice a day", "once a year"], FREQ_HINT],
  ["What does “deux fois par mois” mean?", "twice a month", ["once a month", "every two days"], FREQ_HINT],
  ["What does “le week-end” mean?", "on weekends", ["on weekdays", "at night"], FREQ_HINT],
  ["Which word means the opposite of “jamais”?", "toujours", ["rarement", "souvent"], FREQ_HINT],
  ["Complète : Je mange ___ des légumes. (often)", "souvent", ["jamais", "rarement"], FREQ_HINT],
  ["Complète : Il ne pleut ___ ici en été. (never)", "jamais", ["toujours", "souvent"], "With ne… jamais, the sentence means “never”."],
  ["Complète : Je me brosse ___ les dents après le dîner. (always)", "toujours", ["jamais", "rarement"], FREQ_HINT],
  ["Which sentence says Zoé rarely eats candy?", "Zoé mange rarement des bonbons.", ["Zoé mange toujours des bonbons.", "Zoé mange des bonbons chaque jour."], FREQ_HINT],
  ["Which sentence says Noah often reads?", "Noah lit souvent.", ["Noah ne lit jamais.", "Noah lit parfois."], FREQ_HINT],
  ["How do you say “I sometimes bike to school”?", "Je vais parfois à l'école à vélo.", ["Je vais toujours à l'école à vélo.", "Je ne vais jamais à l'école à vélo."], FREQ_HINT],
  ["How do you say “We never go out on Mondays”?", "Nous ne sortons jamais le lundi.", ["Nous sortons toujours le lundi.", "Nous sortons souvent le lundi."], FREQ_HINT],
  ["How do you say “Once a week I call my grandmother”?", "Une fois par semaine, j'appelle ma grand-mère.", ["Chaque jour, j'appelle ma grand-mère.", "Je n'appelle jamais ma grand-mère."], FREQ_HINT],
  ["Which word means “most often”?", "toujours", ["parfois", "jamais"], FREQ_HINT],
];

// ---------- Opinions et raisons ----------

const OPIN_HINT = "Opinion phrases: à mon avis (in my opinion), selon moi (according to me), je pense que (I think that), je préfère (I prefer). Give a reason with parce que (because).";

const OPINIONS: FrItem[] = [
  ["What does “À mon avis” mean?", "in my opinion", ["at my house", "at my age"], OPIN_HINT],
  ["What does “Selon moi” mean?", "according to me", ["without me", "with me"], OPIN_HINT],
  ["What does “Je pense que” mean?", "I think that", ["I pay for", "I put away"], OPIN_HINT],
  ["What does “Je préfère” mean?", "I prefer", ["I prepare", "I forget"], OPIN_HINT],
  ["What does “parce que” mean?", "because", ["but", "when"], OPIN_HINT],
  ["Complète : Je préfère le hockey ___ c'est rapide.", "parce que", ["pourquoi", "comment"], OPIN_HINT],
  ["Complète : J'ai peur ___ il y a un orage.", "parce qu'", ["pourquoi", "comment"], "Parce que becomes parce qu' before a vowel: parce qu'il y a un orage."],
  ["Which sentence gives an opinion?", "À mon avis, ce film est excellent.", ["Ce film dure deux heures.", "Le film commence à midi."], OPIN_HINT],
  ["Which sentence gives a reason?", "Je reste à la maison parce que je suis malade.", ["Je reste à la maison demain.", "Je reste à la maison et je lis."], OPIN_HINT],
  ["Elle est fatiguée parce que…", "elle a mal dormi", ["il fait beau", "elle a un chien"], "Choose a reason that explains the feeling."],
  ["Il est content parce qu'…", "il a gagné le match", ["il a perdu son chien", "il est malade"], "Choose a reason that explains the feeling."],
  ["Nous avons froid parce qu'…", "il neige", ["il fait chaud", "c'est l'été"], "Choose a reason that explains the feeling."],
  ["What does “J'ai faim” tell you?", "I am hungry", ["I am cold", "I am afraid"], "In French we use avoir for many physical states: j'ai faim, j'ai soif, j'ai froid, j'ai chaud, j'ai peur."],
  ["What does “J'ai soif” mean?", "I am thirsty", ["I am hungry", "I am tired"], "In French we use avoir for many physical states: j'ai faim, j'ai soif, j'ai froid, j'ai chaud, j'ai peur."],
  ["What does “Je trouve que” mean?", "I find that", ["I look for", "I lose"], OPIN_HINT],
  ["What does “Je déteste” mean?", "I hate", ["I love", "I forget"], OPIN_HINT],
  ["What does “J'adore” mean?", "I love", ["I hate", "I wait"], OPIN_HINT],
  ["What does “Je suis d'accord” mean?", "I agree", ["I am late", "I am sorry"], OPIN_HINT],
  ["Complète : J'aime la musique ___ elle me rend joyeux.", "parce qu'", ["parce que", "pourquoi"], "Parce que becomes parce qu' before a vowel: parce qu'elle."],
  ["Complète : Je pense ___ le hockey est amusant.", "que", ["qui", "où"], OPIN_HINT],
  ["Complète : ___ moi, le français est facile. (according to)", "Selon", ["Avec", "Sans"], OPIN_HINT],
  ["Complète : ___ mon avis, ce livre est génial. (in)", "À", ["De", "En"], OPIN_HINT],
  ["Elle est triste parce que…", "son ami déménage", ["elle a gagné", "il fait beau"], "Choose a reason that explains the feeling."],
  ["Nous sommes contents parce que…", "c'est la fin de semaine", ["nous avons perdu notre chien", "nous avons mal à la tête"], "Choose a reason that explains the feeling."],
  ["Il a peur parce que…", "il y a un gros orage", ["il a gagné un prix", "il fait chaud"], "Choose a reason that explains the feeling."],
  ["What does “J'ai chaud” mean?", "I am hot", ["I am cold", "I am hungry"], "In French we use avoir for many physical states: j'ai faim, j'ai soif, j'ai froid, j'ai chaud, j'ai peur."],
  ["What does “J'ai froid” mean?", "I am cold", ["I am hot", "I am thirsty"], "In French we use avoir for many physical states: j'ai faim, j'ai soif, j'ai froid, j'ai chaud, j'ai peur."],
  ["What does “J'ai sommeil” mean?", "I am sleepy", ["I am hungry", "I am hot"], "In French we use avoir for many physical states: j'ai faim, j'ai soif, j'ai froid, j'ai chaud, j'ai peur, j'ai sommeil."],
  ["How do you say “I prefer soccer because it is fun”?", "Je préfère le soccer parce que c'est amusant.", ["Je préfère le soccer mais c'est amusant.", "Je préfère le soccer pourquoi c'est amusant."], OPIN_HINT],
  ["How do you say “In my opinion, the film is great”?", "À mon avis, le film est excellent.", ["À mon avis, le film est ennuyeux.", "À mon avis, le film est trop court."], OPIN_HINT],
];

// ---------- Comparer et opposer ----------

const COMP_HINT = "Compare with plus… que (more… than), moins… que (less… than) and aussi… que (as… as). Use mais (but) to show a contrast.";

const COMPARE: FrItem[] = [
  ["Nicole is 14. Sarah is 12. Which sentence is correct?", "Sarah est plus jeune que Nicole.", ["Sarah est plus âgée que Nicole.", "Sarah est aussi jeune que Nicole."], COMP_HINT],
  ["Complète : Un guépard est ___ rapide qu'une tortue.", "plus", ["moins", "aussi"], COMP_HINT],
  ["Complète : Les pommes sont ___ chères que les mangues. (The mangoes cost more.)", "moins", ["plus", "aussi"], COMP_HINT],
  ["Mon sac est aussi lourd que ton sac. What does it mean?", "They weigh the same.", ["Mine is heavier.", "Mine is lighter."], COMP_HINT],
  ["What does “mais” mean?", "but", ["because", "and"], COMP_HINT],
  ["Complète : Il est petit, ___ il est très fort.", "mais", ["donc", "car"], COMP_HINT],
  ["Complète : J'aime le chocolat, ___ je n'aime pas les bonbons.", "mais", ["donc", "car"], COMP_HINT],
  ["How do you say “The lake is bigger than the pond”?", "Le lac est plus grand que l'étang.", ["Le lac est moins grand que l'étang.", "Le lac est aussi grand que l'étang."], COMP_HINT],
  ["How do you say “Soccer is as popular as hockey”?", "Le soccer est aussi populaire que le hockey.", ["Le soccer est plus populaire que le hockey.", "Le soccer est moins populaire que le hockey."], COMP_HINT],
  ["Complète : Je mange ___ de fruits que mon frère. (more)", "plus", ["aussi", "très"], "Use plus de + a noun to say more of something: plus de fruits que."],
  ["Which word means “less than”?", "moins que", ["plus que", "aussi que"], COMP_HINT],
  ["Complète : Le lion est ___ fort que le chat.", "plus", ["moins", "aussi"], COMP_HINT],
  ["Complète : Une souris est ___ grosse qu'un éléphant.", "moins", ["plus", "aussi"], COMP_HINT],
  ["Complète : Léa et Jay ont tous les deux douze ans. Léa est ___ âgée que Jay.", "aussi", ["plus", "moins"], COMP_HINT],
  ["Complète : Il fait ___ froid en hiver qu'en été.", "plus", ["moins", "aussi"], COMP_HINT],
  ["Complète : Ce sac est lourd, ___ il n'est pas cher.", "mais", ["donc", "car"], COMP_HINT],
  ["Complète : J'aime la pizza, ___ je préfère les pâtes.", "mais", ["car", "donc"], COMP_HINT],
  ["How do you say “The book is more interesting than the film”?", "Le livre est plus intéressant que le film.", ["Le livre est moins intéressant que le film.", "Le livre est aussi intéressant que le film."], COMP_HINT],
  ["How do you say “The bus is slower than the train”?", "L'autobus est moins rapide que le train.", ["L'autobus est plus rapide que le train.", "L'autobus est aussi rapide que le train."], COMP_HINT],
  ["How do you say “Maya is as tall as Sam”?", "Maya est aussi grande que Sam.", ["Maya est plus grande que Sam.", "Maya est moins grande que Sam."], COMP_HINT],
  ["Which word means “more than”?", "plus que", ["moins que", "aussi que"], COMP_HINT],
  ["Which word means “as… as”?", "aussi… que", ["plus… que", "moins… que"], COMP_HINT],
  ["What does “Mon sac est moins lourd que ton sac” mean?", "Mine is lighter.", ["Mine is heavier.", "They weigh the same."], COMP_HINT],
  ["What does “Ce chien est plus grand que ce chat” mean?", "The dog is bigger.", ["The cat is bigger.", "They are the same size."], COMP_HINT],
  ["In “Julie est plus rapide que Marc”, who runs faster?", "Julie", ["Marc", "They run the same speed"], COMP_HINT],
  ["Which sentence shows a contrast?", "J'aime le sport, mais je déteste le froid.", ["J'aime le sport et la musique.", "J'aime le sport parce que c'est amusant."], COMP_HINT],
  ["Which sentence shows a contrast?", "Il est petit, mais il est rapide.", ["Il est petit et gentil.", "Il est petit parce qu'il a huit ans."], COMP_HINT],
];

// ---------- Sons et lettres ----------

const SOUND_HINT = "Letter groups can make one sound: au, aux and eau sound like “o”; ai sounds like “è”; oi sounds like “wa”; gn sounds like “ny”. Some final letters are silent.";

const SOUNDS: FrItem[] = [
  ["Which word ends with the same sound as “bateau”?", "gâteau", ["chat", "lait"], SOUND_HINT],
  ["Which word has the same vowel sound as “chaud”?", "beau", ["pas", "père"], SOUND_HINT],
  ["Which word has the “gn” sound, as in “montagne”?", "campagne", ["gare", "grand"], SOUND_HINT],
  ["Which word has the same “wa” sound as “moi”?", "voix", ["mai", "mie"], SOUND_HINT],
  ["Which word has the same vowel sound as “lait”?", "mai", ["lit", "lot"], SOUND_HINT],
  ["Which word rhymes with “attention”?", "invitation", ["monument", "attendre"], SOUND_HINT],
  ["Which letter is silent at the end of “grand”?", "d", ["g", "r"], "Final consonants are often silent in French: grand, petit, gris."],
  ["Which phrase has a liaison (the s is pronounced like z)?", "les amis", ["les chats", "les livres"], "A liaison links a final consonant to a vowel sound that follows: les_amis."],
  ["In “vous avez”, the s of “vous” is pronounced like…", "z", ["s", "k"], "This is a liaison: vous_avez."],
  ["How do you write “le” + “ami” with an élision?", "l'ami", ["le ami", "la ami"], "Before a vowel sound, le and la drop their vowel: l'ami, l'école."],
  ["How do you write “je” + “aime” with an élision?", "j'aime", ["je aime", "ja aime"], "Je becomes j' before a vowel sound."],
  ["Which word has a silent h?", "l'homme", ["le haricot", "le hibou"], "In « l'homme » the h is silent, so the élision happens. « le hibou » and « le haricot » have an aspirated h, so there is no élision."],
  ["Which word has the same vowel sound as “eau”?", "château", ["rue", "mer"], SOUND_HINT],
  ["Which word has the same vowel sound as “mai”?", "lait", ["lit", "loup"], SOUND_HINT],
  ["Which word has the “gn” sound, as in “signe”?", "ligne", ["gare", "gris"], SOUND_HINT],
  ["Which word has the same “wa” sound as “roi”?", "toit", ["tu", "tôt"], SOUND_HINT],
  ["Which word rhymes with “chanson”?", "garçon", ["jardin", "montagne"], SOUND_HINT],
  ["Which word has the “ou” sound, as in “loup”?", "nous", ["nuit", "note"], SOUND_HINT],
  ["Which letter is silent at the end of “petit”?", "t", ["p", "i"], "Final consonants are often silent in French: grand, petit, gris."],
  ["Which letter is silent at the end of “vert”?", "t", ["v", "r"], "Final consonants are often silent in French: vert, petit, gris."],
  ["Which phrase has a liaison (the s is pronounced like z)?", "deux ans", ["deux chats", "deux livres"], "A liaison links a final consonant to a vowel sound that follows: deux_ans."],
  ["Which phrase has a liaison (the s is pronounced like z)?", "des enfants", ["des garçons", "des chiens"], "A liaison links a final consonant to a vowel sound that follows: des_enfants."],
  ["How do you write “le” + “école” with an élision?", "l'école", ["le école", "la école"], "Before a vowel sound, le and la drop their vowel: l'ami, l'école."],
  ["How do you write “de” + “eau” with an élision?", "d'eau", ["de eau", "da eau"], "Before a vowel sound, de becomes d': d'eau, d'abord."],
  ["How do you write “ce” + “est” with an élision?", "c'est", ["ce est", "ces est"], "Before a vowel sound, ce becomes c': c'est."],
  ["How do you write “que” + “il” with an élision?", "qu'il", ["que il", "qui il"], "Before a vowel sound, que becomes qu': qu'il, qu'elle."],
  ["Which word has a silent h?", "l'heure", ["le héros", "le haut"], "In « l'heure » the h is silent, so the élision happens. « le héros » and « le haut » have an aspirated h, so there is no élision."],
  ["The “ç” in “garçon” sounds like…", "s", ["k", "g"], "The cedilla (ç) makes the letter c sound like s before a, o or u."],
  ["The “ch” in “chat” sounds like…", "sh, as in “shoe”", ["k, as in “kite”", "t, as in “top”"], "In French, ch usually makes the same sound as English sh."],
  ["Which word ends with the same sound as “attention”?", "solution", ["soleil", "salade"], SOUND_HINT],
];

// ---------- Histoires ----------

const STORY_HINT = "Stories have characters (who), a setting (where and when), a problem and a solution. Words like d'abord, ensuite and finalement show the order of events.";

const DOG = {
  type: "passage" as const,
  title: "Le chien perdu",
  paragraphs: [
    "Samedi matin, Inès trouve un petit chien dans le parc. Il n'a pas de collier. Elle est inquiète. D'abord, elle montre le chien à une voisine. Ensuite, elle colle une affiche sur la porte de l'école. Finalement, le propriétaire arrive. Il dit merci à Inès.",
  ],
};

const RACE = {
  type: "passage" as const,
  title: "La course",
  paragraphs: [
    "Lundi, Karim s'inscrit à la course de l'école. Il a peur parce qu'il n'est pas très rapide. Chaque jour, il s'entraîne avec sa grande sœur. Le jour de la course, il ne gagne pas, mais il termine la course et il est fier de lui.",
  ],
};

const CAKE = {
  type: "passage" as const,
  title: "Le gâteau d'anniversaire",
  paragraphs: [
    "Dimanche après-midi, Mathis prépare un gâteau pour l'anniversaire de sa mère. D'abord, il mélange la farine et les œufs. Ensuite, il met le gâteau au four. Soudain, il sent une odeur de brûlé! Le gâteau est trop cuit. Mathis est triste, mais sa sœur Nour l'aide à faire un nouveau gâteau. Finalement, ils chantent « Joyeux anniversaire » ensemble.",
  ],
};

const NEW_SCHOOL = {
  type: "passage" as const,
  title: "Le premier jour",
  paragraphs: [
    "Lundi matin, Yasmine arrive dans une nouvelle école. Elle ne connaît personne et elle a le trac. Dans la classe, un garçon nommé Étienne lui sourit. À la récréation, il l'invite à jouer au basketball. Yasmine accepte, parce qu'elle adore ce sport. À la fin de la journée, elle a deux nouveaux amis et elle n'a plus peur.",
  ],
};

const SNOW = {
  type: "passage" as const,
  title: "La tempête de neige",
  paragraphs: [
    "Mardi, il y a une grosse tempête de neige. L'école est fermée. Julien et son frère construisent un fort dans la cour. Ensuite, ils boivent un chocolat chaud. Plus tard, la neige s'arrête et ils font de la luge. Le soir, Julien est fatigué, mais il est très content.",
  ],
};

const STORIES: FrItem[] = [
  ["Where does the story take place?", "In a park", ["At school", "At the library"], STORY_HINT, DOG],
  ["What day does the story begin?", "Saturday", ["Monday", "Sunday"], STORY_HINT, DOG],
  ["What is Inès's problem?", "She finds a dog with no owner nearby", ["She is lost", "She cannot find her homework"], STORY_HINT, DOG],
  ["What does Inès do first?", "She shows the dog to a neighbour", ["She puts up a poster", "She takes the dog home"], STORY_HINT, DOG],
  ["Which word shows the last step?", "Finalement", ["D'abord", "Ensuite"], STORY_HINT, DOG],
  ["How does the story end?", "The owner arrives and thanks Inès", ["The dog runs away", "The poster is lost"], STORY_HINT, DOG],
  ["Why is Karim afraid?", "He is not very fast", ["He is sick", "He lost his shoes"], STORY_HINT, RACE],
  ["Who helps Karim train?", "His older sister", ["His teacher", "His father"], STORY_HINT, RACE],
  ["How often does Karim train?", "Every day", ["Once a week", "Never"], STORY_HINT, RACE],
  ["Does Karim win?", "No, but he finishes and feels proud", ["Yes, he comes first", "He does not race"], STORY_HINT, RACE],
  ["Which word shows a contrast in the last sentence?", "mais", ["parce que", "chaque"], STORY_HINT, RACE],
  ["When does the story take place?", "Sunday afternoon", ["Saturday morning", "Monday evening"], STORY_HINT, CAKE],
  ["Who is the cake for?", "Mathis's mother", ["Nour", "Mathis's teacher"], STORY_HINT, CAKE],
  ["What is the problem?", "The cake is burned", ["Mathis has no flour", "The oven is broken"], STORY_HINT, CAKE],
  ["Who helps Mathis?", "His sister Nour", ["His father", "A neighbour"], STORY_HINT, CAKE],
  ["Which word shows the first step?", "D'abord", ["Finalement", "Soudain"], STORY_HINT, CAKE],
  ["Which word shows something unexpected?", "Soudain", ["Ensuite", "D'abord"], STORY_HINT, CAKE],
  ["How does the story end?", "They sing happy birthday together", ["Mathis throws the cake away alone", "They go to a restaurant"], STORY_HINT, CAKE],
  ["How does Mathis feel after the cake burns?", "Sad", ["Proud", "Angry at Nour"], STORY_HINT, CAKE],
  ["Where does the story take place?", "At a new school", ["At a park", "At a library"], STORY_HINT, NEW_SCHOOL],
  ["What is Yasmine's problem?", "She doesn't know anyone", ["She lost her bag", "She is late"], STORY_HINT, NEW_SCHOOL],
  ["Who invites Yasmine to play?", "Étienne", ["Her teacher", "Her brother"], STORY_HINT, NEW_SCHOOL],
  ["Which sport do they play?", "Basketball", ["Soccer", "Hockey"], STORY_HINT, NEW_SCHOOL],
  ["Why does Yasmine accept?", "She loves that sport", ["She is hungry", "She has to"], STORY_HINT, NEW_SCHOOL],
  ["How does Yasmine feel at the end?", "Happy and no longer afraid", ["Still scared", "Angry"], STORY_HINT, NEW_SCHOOL],
  ["What day does the story start?", "Monday", ["Friday", "Sunday"], STORY_HINT, NEW_SCHOOL],
  ["What closes the school?", "A big snowstorm", ["A fire drill", "A holiday"], STORY_HINT, SNOW],
  ["What do the brothers build?", "A fort", ["A snowman", "A sled"], STORY_HINT, SNOW],
  ["What do they drink?", "Hot chocolate", ["Milk", "Juice"], STORY_HINT, SNOW],
  ["What do they do when the snow stops?", "They go sledding", ["They skate", "They read"], STORY_HINT, SNOW],
  ["How does Julien feel in the evening?", "Tired but very happy", ["Sad", "Bored"], STORY_HINT, SNOW],
];

// ---------- Le monde francophone ----------

const WORLD_HINT = "French is spoken on several continents. Each Francophone community has its own culture, food, music and traditions.";

const WORLD: FrItem[] = [
  ["In which region of the world is Haiti?", "The Caribbean", ["Europe", "South Asia"], WORLD_HINT, "🌴"],
  ["Which of these is a country in Europe where French is spoken?", "Belgium", ["Japan", "Brazil"], WORLD_HINT, "🌍"],
  ["In which part of Africa is Senegal?", "West Africa", ["Southern Africa", "East Africa"], WORLD_HINT, "🌍"],
  ["Which of these places in Africa has French-speaking communities?", "Côte d'Ivoire", ["Mexico", "Norway"], WORLD_HINT, "🌍"],
  ["Which Canadian province has the most French speakers?", "Québec", ["Alberta", "Nova Scotia"], WORLD_HINT, "🍁"],
  ["La Francophonie describes…", "people and countries that share the French language", ["only people born in France", "a French sports team"], WORLD_HINT],
  ["Which statement is true?", "Some Indigenous communities in Canada use French as one of their languages.", ["No Indigenous community uses French.", "All Indigenous peoples speak only French."], "Many Indigenous communities in Canada have their own languages. Some also live and work in French, such as the Huron-Wendat Nation at Wendake, Québec."],
  ["Île-à-la-Crosse is a Métis community in which province?", "Saskatchewan", ["Nova Scotia", "Ontario"], "Some Métis communities in Western Canada have a long history of speaking French, such as Île-à-la-Crosse in Saskatchewan."],
  ["Festival du Voyageur celebrates Francophone and Métis heritage in which city?", "Winnipeg", ["Halifax", "Calgary"], "Every winter, Winnipeg's Saint-Boniface neighbourhood hosts this festival with music, food and dance."],
  ["Which of these is an example of a creative work?", "a song, a film or a painting", ["a bus schedule", "a grocery receipt"], "Creative works express the experience of the people they come from."],
  ["How can you take part in Francophone culture where you live?", "Go to a festival, watch a film or read a book in French", ["Avoid anything in French", "Wait until you travel"], WORLD_HINT],
  ["Which of these countries in Africa has French as an official language?", "Mali", ["Kenya", "Egypt"], WORLD_HINT, "🌍"],
  ["Which of these places in the Caribbean is part of France and speaks French?", "Martinique", ["Jamaica", "Barbados"], WORLD_HINT, "🌴"],
  ["Which of these cities is the capital of France?", "Paris", ["Brussels", "Dakar"], WORLD_HINT, "🌍"],
  ["Which city is the capital of the province of Québec?", "Québec City", ["Montréal", "Gatineau"], WORLD_HINT, "🍁"],
  ["Which Canadian province is officially bilingual (English and French)?", "New Brunswick", ["Alberta", "British Columbia"], WORLD_HINT, "🍁"],
  ["Acadian communities are French-speaking communities found mainly in which part of Canada?", "The Atlantic provinces", ["The Prairies", "The Far North"], WORLD_HINT, "🍁"],
  ["La Francophonie includes people living on which continents?", "Europe, Africa, the Americas and more", ["Only Europe", "Only Antarctica"], WORLD_HINT],
  ["Which statement is true about French in Canada?", "French is one of Canada's two official languages.", ["French is not used in Canada.", "French is spoken only in Québec."], "Canada's official languages are English and French, and Francophone communities live in every province and territory."],
  ["Which of these countries has French as one of its official languages?", "Switzerland", ["Portugal", "Austria"], WORLD_HINT, "🌍"],
  ["Which small European country has French as one of its three official languages?", "Luxembourg", ["Iceland", "Malta"], WORLD_HINT, "🌍"],
  ["International Francophonie Day is celebrated each year on which date?", "March 20", ["December 25", "July 1"], WORLD_HINT],
  ["The Huron-Wendat Nation has a community near Québec City. What is it called?", "Wendake", ["Saint-Boniface", "Île-à-la-Crosse"], "Many Indigenous nations in Canada have their own languages. Wendake is a living community of the Huron-Wendat Nation."],
  ["Fransaskois are Francophones from which province?", "Saskatchewan", ["Nova Scotia", "Newfoundland and Labrador"], WORLD_HINT, "🍁"],
  ["Franco-Ontarians are Francophones from which province?", "Ontario", ["Alberta", "Nova Scotia"], WORLD_HINT, "🍁"],
  ["Why can the French of one region sound different from another's?", "Words, accents and expressions change from place to place", ["French has no rules", "Only one kind of French exists"], WORLD_HINT],
  ["What is a good way to learn about another Francophone region?", "Listen to its music or read its stories", ["Ignore it", "Guess from stereotypes"], WORLD_HINT],
  ["Which sentence respects Francophone diversity?", "Francophone communities have many cultures and traditions.", ["All Francophones are the same.", "Only France has French culture."], WORLD_HINT],
];

// ---------- Culture et respect ----------

const CULT_HINT = "Cultural appropriation is using a cultural motif, story, song or image without permission or context in a way that may misrepresent the people it comes from. Plagiarism is passing off someone else's work as your own.";

const CULTURE: FrItem[] = [
  ["A story is told to you by a Francophone elder. What shows respect when you share it?", "Say who told it and ask for permission", ["Say you made it up", "Change it so no one knows"], CULT_HINT],
  ["Which is an example of cultural appropriation?", "Using a community's sacred symbol on a T-shirt you sell", ["Reading a book about a festival", "Asking a friend to teach you a dance"], CULT_HINT],
  ["Which is plagiarism?", "Copying a paragraph from a website and calling it yours", ["Quoting a sentence and naming the author", "Writing a summary in your own words with a source"], CULT_HINT],
  ["What should you do when you use an author's exact words?", "Put them in quotation marks and name the source", ["Remove the author's name", "Change two words and keep going"], CULT_HINT],
  ["Why do we list our sources?", "To give credit and help readers find the information", ["To make the page longer", "To hide where facts came from"], CULT_HINT],
  ["Which is a respectful way to learn about a culture?", "Listen to people from that culture and read their own words", ["Guess from a movie", "Copy their clothing for fun"], CULT_HINT],
  ["You find a great photo online for your project. What do you do?", "Check who owns it and credit them", ["Cut off the name", "Say you took it"], CULT_HINT],
  ["Why can a costume of a culture's traditional clothing hurt people?", "It can reduce something meaningful to a joke", ["It is too expensive", "It is hard to wash"], CULT_HINT],
  ["You use a poem written by a classmate in your own project. What should you do?", "Ask permission and say who wrote it", ["Say you wrote it", "Change the title only"], CULT_HINT],
  ["Which action shows respect for a community's traditional story?", "Learn who the story belongs to and ask before sharing it", ["Retell it online without asking", "Change it to make it funnier"], CULT_HINT],
  ["A sentence in your report is word for word from a book. How do you show it?", "Put it in quotation marks and name the book", ["Write it without any mark", "Change one word and keep it"], CULT_HINT],
  ["Which is an example of plagiarism?", "Turning in an essay your cousin wrote", ["Writing a summary in your own words and listing the source", "Quoting a poem and naming the poet"], CULT_HINT],
  ["Which is an example of plagiarism?", "Copying a friend's answers and handing them in as yours", ["Studying together, then writing your own answers", "Asking a teacher for help"], CULT_HINT],
  ["What does “citing a source” mean?", "Telling where an idea or quote came from", ["Copying a page", "Hiding the author"], CULT_HINT],
  ["Which of these is a source you can list?", "A book, a website or an interview", ["A guess", "A rumour"], CULT_HINT],
  ["Which is a respectful way to wear traditional clothing from another culture?", "Only when invited by people of that culture, for the right occasion", ["As a costume for a party", "As a joke for photos"], CULT_HINT],
  ["Why should you not use a sacred symbol as decoration?", "It may have a deep meaning for the community", ["It is too colourful", "It costs too much"], CULT_HINT],
  ["A friend from a Francophone community teaches you a song. How can you respectfully share it at school?", "Say who taught you and ask if you may perform it", ["Say you invented it", "Change all the words"], CULT_HINT],
  ["Which is a good way to avoid plagiarism?", "Write notes in your own words", ["Copy the first page", "Paste text from the internet"], CULT_HINT],
  ["Why is plagiarism unfair?", "It takes credit for someone else's work", ["It makes homework shorter", "It uses too much paper"], CULT_HINT],
  ["Which statement is true?", "Giving credit shows respect for the people who made the work.", ["Credit is not needed if the work is online.", "Credit is only for books."], CULT_HINT],
  ["Which is an example of cultural appropriation?", "Selling products with another culture's sacred designs without asking", ["Reading a story told by a person from that culture", "Trying a traditional food at a festival"], CULT_HINT],
  ["Which is a respectful way to learn about a tradition?", "Attend a public festival and listen to what community members share", ["Make a costume from it", "Take photos without asking and post them"], CULT_HINT],
  ["You want to use a photo of an artist's painting. What do you do first?", "Ask the artist or check the licence, and give credit", ["Crop out the name", "Save it and use it"], CULT_HINT],
  ["Why is it important to name the person or community who taught you a story?", "It respects them and shows where the knowledge comes from", ["It makes your story longer", "It keeps the story secret"], CULT_HINT],
  ["What is a bibliography?", "A list of the sources you used", ["A list of your friends", "A summary of the story"], CULT_HINT],
];

export const course: Course = {
  grade: "8",
  subject: "core-french",
  bigIdeas: {
    "ca-bc": [
      "Listening and viewing with intent supports our acquisition and understanding of French.",
      "We can express ourselves and talk about the world around us in French.",
      "With increasing fluency in French, we can participate more actively in reciprocal interactions.",
      "We can share our experiences and perspective through stories.",
      "We can experience authentic Francophone cultures through creative works.",
      "Our understanding of culture is influenced by the languages we speak and the communities with which we engage.",
    ],
  },
  units: [
    {
      id: "passe-present-futur",
      title: "Past, present, future",
      emoji: "⏳",
      blurb: "Hier, aujourd'hui, demain",
      parentNote: "Telling when things happen: yesterday, today and tomorrow, with the passé composé and the near future (aller + infinitive).",
      standards: { "ca-bc": "Common, high-frequency vocabulary and sentence structures for communication in past, present and future time frames" },
      generate: (o) => coreQuestions(TIMES, o, 8),
    },
    {
      id: "questions",
      title: "Asking questions",
      emoji: "❓",
      blurb: "Où, quand, pourquoi…",
      parentNote: "Question words (qui, où, quand, combien, comment, pourquoi, quel) and est-ce que questions.",
      standards: { "ca-bc": "A variety of questions: Combien…?; Comment…?; Est-ce que…?; Où…?; Pourquoi…?; Quand…?; Quel…?; Qu'est-ce que…?; Qui…?" },
      generate: (o) => coreQuestions(QUESTIONS, o, 8),
    },
    {
      id: "frequence",
      title: "How often?",
      emoji: "🔁",
      blurb: "Toujours, parfois, jamais",
      parentNote: "Words for time and frequency: toujours, souvent, parfois, jamais and chaque jour.",
      standards: { "ca-bc": "Time and frequency: aujourd'hui, hier, demain, chaque jour, toujours, parfois, jamais" },
      generate: (o) => coreQuestions(FREQUENCY, o, 8),
    },
    {
      id: "opinions-et-raisons",
      title: "Opinions and reasons",
      emoji: "💬",
      blurb: "À mon avis, parce que",
      parentNote: "Sharing opinions (à mon avis, je pense que), preferences, emotions and physical states, and giving a reason with parce que.",
      standards: { "ca-bc": "Beliefs and opinions; reasons for preferences, emotions and physical states" },
      generate: (o) => coreQuestions(OPINIONS, o, 8),
    },
    {
      id: "comparer-et-opposer",
      title: "Comparing and contrasting",
      emoji: "⚖️",
      blurb: "Plus que, aussi que, mais",
      parentNote: "Comparing with plus… que, moins… que and aussi… que, and contrasting ideas with mais.",
      standards: { "ca-bc": "Comparisons and contrasts using expressions such as aussi, mais, plus que, aussi que, moins que" },
      generate: (o) => coreQuestions(COMPARE, o, 8),
    },
    {
      id: "sons-et-lettres",
      title: "Sounds and letters",
      emoji: "🔤",
      blurb: "Eau, ai, gn, liaisons",
      parentNote: "Linking French letter groups to sounds (eau, ai, oi, gn, -tion), silent letters, liaisons and élisions.",
      standards: { "ca-bc": "French letter patterns, silent letters, les liaisons and les élisions" },
      generate: (o) => coreQuestions(SOUNDS, o, 8),
    },
    {
      id: "histoires",
      title: "Reading and retelling stories",
      emoji: "📖",
      blurb: "Characters, setting, plot",
      parentNote: "Understanding key information and events in short French stories and the words that show the order of events.",
      standards: { "ca-bc": "Common elements of stories: place, characters, setting, plot; comprehend and retell stories; narrate simple stories" },
      generate: (o) => coreQuestions(STORIES, o, 8),
    },
    {
      id: "monde-francophone",
      title: "The Francophone world",
      emoji: "🌍",
      blurb: "French around the world",
      parentNote: "Francophone communities around the world, Indigenous communities where French is spoken, and creative works.",
      standards: { "ca-bc": "Francophone communities around the world; connections between Indigenous communities and the French language; creative works" },
      generate: (o) => coreQuestions(WORLD, o, 8),
    },
    {
      id: "culture-et-respect",
      title: "Culture and respect",
      emoji: "🤝",
      blurb: "Appropriation and plagiarism",
      parentNote: "The ethics of cultural appropriation and plagiarism: crediting sources and learning from cultures respectfully.",
      standards: { "ca-bc": "Ethics of cultural appropriation and plagiarism" },
      generate: (o) => coreQuestions(CULTURE, o, 8),
    },
  ],
};
