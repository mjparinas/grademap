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
  ["Complète : Hier, nous ___ au parc. (aller, passé composé)", "sommes allés", ["avons allé", "allons aller"], "Aller uses être in the passé composé, and the participle agrees with the subject."],
  ["Complète : Demain, vous ___ visiter la ville. (near future)", "allez", ["avez", "êtes"], "The near future is aller + an infinitive: vous allez visiter."],
  ["Complète : Quand j'avais six ans, j'___ un chat. (avoir, habit)", "avais", ["ai eu", "aurai"], "The imparfait describes habits and background in the past."],
  ["Complète : Hier matin, elle ___ un courriel. (envoyer, finished event)", "a envoyé", ["envoyait", "enverra"], "The passé composé tells what happened and was finished."],
  ["How do you say “Last year we travelled to Québec”?", "L'année dernière, nous avons voyagé au Québec.", ["L'année prochaine, nous voyageons au Québec.", "L'année dernière, nous allons voyager au Québec."], TIME_HINT],
  ["How do you say “Next Saturday I am going to paint”?", "Samedi prochain, je vais peindre.", ["Samedi dernier, j'ai peint.", "Samedi prochain, je peignais."], TIME_HINT],
  ["What does “le mois dernier” mean?", "last month", ["next month", "every month"], TIME_HINT],
  ["What does “l'été prochain” mean?", "next summer", ["last summer", "every summer"], TIME_HINT],
  ["What does “autrefois” mean?", "in the past, long ago", ["tomorrow", "right now"], TIME_HINT],
  ["What does “dans deux jours” mean?", "in two days", ["two days ago", "every two days"], TIME_HINT],
  ["What does “il y a deux jours” mean?", "two days ago", ["in two days", "every two days"], TIME_HINT],
  ["Which sentence uses the imparfait to describe the background?", "Il faisait froid et il neigeait.", ["Il a fait froid hier.", "Il fera froid demain."], "The imparfait describes how things were. The passé composé tells what happened."],
  ["Which sentence uses the passé composé for a finished event?", "Elle a gagné la course.", ["Elle gagnait la course.", "Elle gagnera la course."], TIME_HINT],
  ["Which sentence is in the near future?", "Tu vas aider ta sœur.", ["Tu as aidé ta sœur.", "Tu aidais ta sœur."], TIME_HINT],
  ["Complète : Ce matin, mes amis ___ en retard. (arriver, passé composé)", "sont arrivés", ["ont arrivé", "arrivent"], "Arriver uses être in the passé composé."],
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
  ["Change “Tu aimes le chocolat.” into a question with inversion.", "Aimes-tu le chocolat?", ["Tu aimes-tu le chocolat?", "Est-ce aimes-tu le chocolat?"], QUEST_HINT],
  ["Change “Ils jouent au soccer.” into a question with inversion.", "Jouent-ils au soccer?", ["Ils jouent-ils au soccer?", "Est-ce jouent-ils au soccer?"], QUEST_HINT],
  ["Change “Il a un frère.” into a question with inversion.", "A-t-il un frère?", ["A-il un frère?", "Il a-t-il un frère?"], "Add -t- between two vowels to make the question easy to say: a-t-il."],
  ["Which question uses est-ce que?", "Est-ce que vous habitez ici?", ["Habitez-vous ici?", "Vous habitez ici?"], QUEST_HINT],
  ["Which question uses inversion?", "Parlez-vous anglais?", ["Est-ce que vous parlez anglais?", "Vous parlez anglais?"], QUEST_HINT],
  ["Change “Tu joues au tennis.” into a question with est-ce que.", "Est-ce que tu joues au tennis?", ["Est-ce tu joues au tennis?", "Que tu joues au tennis?"], QUEST_HINT],
  ["Complète : ___ coûtent ces souliers? — Soixante dollars.", "Combien", ["Quand", "Où"], QUEST_HINT],
  ["Complète : ___ commences-tu ton projet? — Lundi.", "Quand", ["Qui", "Combien"], QUEST_HINT],
  ["Complète : ___ est ton nouvel enseignant? — C'est monsieur Dubois.", "Qui", ["Où", "Quand"], QUEST_HINT],
  ["Complète : ___ viens-tu à l'école? — À pied.", "Comment", ["Combien", "Quand"], QUEST_HINT],
  ["Complète : ___ n'es-tu pas venu? — J'étais malade.", "Pourquoi", ["Comment", "Où"], QUEST_HINT],
  ["Which answer fits “Où est le gymnase?”", "Il est au bout du couloir.", ["Il est midi.", "Il coûte dix dollars."], QUEST_HINT],
  ["Which answer fits “Combien de sœurs as-tu?”", "J'ai deux sœurs.", ["Elle s'appelle Sara.", "À huit heures."], QUEST_HINT],
  ["Which answer fits “Quand est le concert?”", "Samedi soir.", ["Au gymnase.", "Dix dollars."], QUEST_HINT],
  ["Which question asks for a person?", "Qui a gagné?", ["Où a-t-il gagné?", "Quand a-t-il gagné?"], QUEST_HINT],
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
  ["What does “d'abord” mean?", "first", ["last", "never"], SEQ_HINT],
  ["What does “premièrement” mean?", "first of all", ["lastly", "yesterday"], SEQ_HINT],
  ["What does “deuxièmement” mean?", "secondly", ["twice a day", "before"], SEQ_HINT],
  ["What does “enfin” mean?", "finally, at last", ["at first", "sometimes"], SEQ_HINT],
  ["What does “puis” mean?", "then", ["before", "because"], SEQ_HINT],
  ["What does “pendant” mean?", "during", ["after", "before"], SEQ_HINT],
  ["D'abord, je me brosse les dents. ___, je me couche.", "Ensuite", ["Avant", "Hier"], SEQ_HINT],
  ["___, on se lave les mains. Ensuite, on mange.", "D'abord", ["Finalement", "Après"], SEQ_HINT],
  ["Premièrement, on ouvre le livre. Deuxièmement, on lit. ___, on discute.", "Troisièmement", ["Premièrement", "Hier"], SEQ_HINT],
  ["Which word introduces the last step?", "Enfin", ["D'abord", "Ensuite"], SEQ_HINT],
  ["Which sentence puts a morning routine in order?", "D'abord, je me lève; ensuite, je m'habille; finalement, je pars.", ["Finalement, je me lève; d'abord, je pars.", "Ensuite, je pars; d'abord, je me lève; finalement, je m'habille."], SEQ_HINT],
  ["Which expression means “at the same time”?", "en même temps", ["jamais", "demain"], SEQ_HINT],
  ["Complète : Je fais mes devoirs ___ le dîner. (before)", "avant", ["après", "pendant"], SEQ_HINT],
  ["Complète : Nous jouons dehors ___ le dîner. (after)", "après", ["avant", "pendant"], SEQ_HINT],
  ["Complète : Elle chante ___ qu'elle cuisine. (while)", "pendant", ["avant", "après"], "Pendant que means “while”: elle chante pendant qu'elle cuisine."],
  ["Which word tells you a new step is coming?", "ensuite", ["jamais", "hier"], SEQ_HINT],
  ["In a recipe, which word would come first?", "D'abord", ["Finalement", "Ensuite"], SEQ_HINT],
  ["Which sentence is in the right order?", "Premièrement, je prends mon sac; deuxièmement, je mets mes souliers; troisièmement, je sors.", ["Troisièmement, je prends mon sac; premièrement, je sors.", "Deuxièmement, je sors; premièrement, je mets mes souliers."], SEQ_HINT],
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
  ["What does “Je voudrais un jus” mean?", "I would like a juice", ["I saw a juice", "I am making a juice"], NEED_HINT],
  ["What does “Il me faut un cahier” mean?", "I need a notebook", ["I lost a notebook", "I sell notebooks"], NEED_HINT],
  ["How do you politely ask what time it is?", "Pourriez-vous me dire l'heure, s'il vous plaît?", ["Dis-moi l'heure!", "Quelle heure? Vite!"], NEED_HINT],
  ["How do you politely ask someone to repeat?", "Pouvez-vous répéter, s'il vous plaît?", ["Répète encore!", "Je n'écoute pas."], NEED_HINT],
  ["How do you say “I need help with my homework”?", "J'ai besoin d'aide avec mes devoirs.", ["J'ai fini mes devoirs.", "Je déteste mes devoirs."], NEED_HINT],
  ["How do you politely ask to borrow a pen?", "Puis-je emprunter ton stylo, s'il te plaît?", ["Donne ton stylo!", "Je prends ton stylo."], NEED_HINT],
  ["What does “Selon moi” mean?", "in my opinion", ["without me", "with me"], NEED_HINT],
  ["Which sentence gives an opinion?", "Je pense que ce livre est amusant.", ["Ce livre a deux cents pages.", "Ce livre est sur la table."], NEED_HINT],
  ["Which sentence agrees politely?", "Tu as raison, c'est une bonne idée.", ["Tu as tort, c'est stupide.", "Je ne t'écoute pas."], NEED_HINT],
  ["What does “Tu as raison” mean?", "You are right", ["You are late", "You are wrong"], NEED_HINT],
  ["What does “Tu as tort” mean?", "You are wrong", ["You are right", "You are tired"], NEED_HINT],
  ["Complète : Je ___ un stylo, s'il te plaît. (would like)", "voudrais", ["voulais", "veux"], NEED_HINT],
  ["Complète : J'ai besoin ___ ton aide. (of)", "de", ["à", "en"], NEED_HINT],
  ["Which phrase expresses a need?", "J'ai besoin de repos.", ["J'adore le repos.", "Le repos est fini."], NEED_HINT],
  ["Which sentence disagrees politely?", "Je comprends, mais je pense autrement.", ["C'est faux!", "Tu n'y connais rien!"], NEED_HINT],
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
  ["Complète : J'ai ___ de patience que mon frère. (less)", "moins", ["autant", "plus"], COMP_HINT],
  ["Complète : Il y a ___ de neige en février qu'en octobre. (more)", "plus", ["moins", "aussi"], COMP_HINT],
  ["Complète : Marc et Léa ont quatre stylos chacun. Marc a ___ de stylos que Léa.", "autant", ["plus", "moins"], COMP_HINT],
  ["Complète : Ce film est ___ long que l'autre. (the same length)", "aussi", ["autant", "plus de"], COMP_HINT],
  ["Complète : Elle lit ___ de livres que moi. (fewer)", "moins", ["plus", "aussi"], COMP_HINT],
  ["Complète : Ma ville a ___ d'habitants que ta ville. (the same number)", "autant", ["aussi", "très"], COMP_HINT],
  ["Which sentence is correct?", "Nous avons autant de temps que vous.", ["Nous avons aussi de temps que vous.", "Nous avons autant temps que vous."], COMP_HINT],
  ["How do you say “There are more cars than bikes”?", "Il y a plus de voitures que de vélos.", ["Il y a moins de voitures que de vélos.", "Il y a autant de voitures que de vélos."], COMP_HINT],
  ["How do you say “She runs as fast as her brother”?", "Elle court aussi vite que son frère.", ["Elle court plus vite que son frère.", "Elle court moins vite que son frère."], COMP_HINT],
  ["How do you say “I have fewer books than you”?", "J'ai moins de livres que toi.", ["J'ai plus de livres que toi.", "J'ai autant de livres que toi."], COMP_HINT],
  ["What does “moins de… que” mean?", "fewer or less… than", ["as many… as", "more… than"], COMP_HINT],
  ["What does “plus de… que” mean?", "more… than", ["fewer… than", "as many… as"], COMP_HINT],
  ["Which sentence compares two adjectives?", "Cette rivière est plus longue que la nôtre.", ["Cette rivière a autant d'eau que la nôtre.", "Cette rivière coule vers l'est."], COMP_HINT],
  ["Which sentence compares amounts?", "Ma classe a moins d'élèves que la tienne.", ["Ma classe est aussi grande que la tienne.", "Ma classe est au premier étage."], COMP_HINT],
  ["Which sentence shows a contrast with “mais”?", "Je suis fatigué, mais je continue.", ["Je suis fatigué parce que j'ai couru.", "Je suis fatigué donc je dors."], COMP_HINT],
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
  ["Complète : Les fleurs sont ___. (beau)", "belles", ["beau", "beaux"], DESC_HINT],
  ["Complète : Mon frère est ___. (grand)", "grand", ["grande", "grandes"], DESC_HINT],
  ["Complète : Ma cousine est ___ et ___. (gentil, drôle)", "gentille et drôle", ["gentil et drôle", "gentilles et drôles"], DESC_HINT],
  ["Complète : Ces garçons sont ___. (sportif)", "sportifs", ["sportives", "sportif"], DESC_HINT],
  ["Complète : La classe est ___. (bruyant)", "bruyante", ["bruyant", "bruyants"], DESC_HINT],
  ["Complète : Nos voisins sont ___. (sympathique)", "sympathiques", ["sympathique", "sympathiquement"], DESC_HINT],
  ["Which word means “friendly, nice”?", "sympathique", ["fâché", "timide"], DESC_HINT],
  ["Which word means “shy”?", "timide", ["courageux", "drôle"], DESC_HINT],
  ["Which word means “funny”?", "drôle", ["sérieux", "paresseux"], DESC_HINT],
  ["Which word means “brave”?", "courageux", ["peureux", "paresseux"], DESC_HINT],
  ["Which word describes a place with lots of people and activity?", "animé", ["désert", "tranquille"], DESC_HINT],
  ["Which sentence describes a personal interest?", "J'adore dessiner et peindre.", ["Mon frère a douze ans.", "Il habite à Ottawa."], DESC_HINT],
  ["Which sentence describes a place?", "La plage est grande, propre et ensoleillée.", ["Elle nage tous les matins.", "Hier, j'ai visité la plage."], DESC_HINT],
  ["Which sentence describes an object?", "C'est un sac rouge, léger et pratique.", ["Il a acheté un sac hier.", "Ils cherchent un sac."], DESC_HINT],
  ["Complète : C'est une ville ___ et ___. (ancien, tranquille)", "ancienne et tranquille", ["ancien et tranquille", "anciennes et tranquilles"], DESC_HINT],
  ["Complète : Mes chaussures sont ___. (neuf)", "neuves", ["neuf", "neufs"], DESC_HINT],
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
  ["Which closing is informal?", "Bisous, Maya", ["Cordialement,", "Veuillez agréer mes salutations distinguées."], TEXT_HINT],
  ["Which greeting is formal?", "Monsieur Roy,", ["Salut Léo!", "Allô!"], TEXT_HINT],
  ["Which greeting is formal?", "Madame, Monsieur,", ["Coucou!", "Hé, toi!"], TEXT_HINT],
  ["What is the purpose of a postcard?", "To share news from a trip", ["To sell a product", "To give instructions"], TEXT_HINT],
  ["What is the purpose of a thank-you note?", "To show appreciation", ["To advertise a sale", "To report news"], TEXT_HINT],
  ["What is the purpose of a poster for a school play?", "To announce an event and attract an audience", ["To teach a recipe", "To describe a person"], TEXT_HINT],
  ["Which text has a headline, a date and facts about an event?", "A news report", ["A postcard", "A birthday invitation"], TEXT_HINT],
  ["Which text gives the time, place and date of a party?", "An invitation", ["A recipe", "A news report"], TEXT_HINT],
  ["Which text often begins with “Chère Maya,”?", "A personal letter", ["A recipe", "A bus schedule"], TEXT_HINT],
  ["Which tone suits an email to a principal?", "Polite and formal", ["Slangy and jokey", "Rude and short"], TEXT_HINT],
  ["Which sentence uses “vous” correctly with a teacher?", "Pouvez-vous m'aider, madame?", ["Peux-tu m'aider, madame?", "Aide-moi, madame!"], TEXT_HINT],
  ["Which sentence uses “tu” correctly with a friend?", "Veux-tu venir chez moi?", ["Voulez-vous bien venir chez moi, cher ami?", "Venez-vous à la maison, monsieur?"], TEXT_HINT],
  ["Which register fits a text message to a close friend?", "Informal", ["Very formal", "Legal"], TEXT_HINT],
  ["Which text is meant to persuade?", "An advertisement", ["A recipe", "A weather report"], TEXT_HINT],
  ["Which word often ends a formal email?", "Cordialement", ["Bisous", "Coucou"], TEXT_HINT],
  ["Who is the audience of a letter to the mayor?", "The mayor", ["Only your friends", "Nobody"], TEXT_HINT],
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
  ["What is the Carnaval de Québec?", "A winter festival in Québec City", ["A summer swimming race", "A harvest market"], TRAD_HINT, "⛄"],
  ["What is a cabane à sucre?", "A place where maple syrup is made and enjoyed in spring", ["A winter ski hut", "A fishing cabin"], TRAD_HINT, "🍁"],
  ["What does “Ce n'est pas la fin du monde” mean?", "It's not a big deal", ["The world is ending", "It's near the end"], "Figurative meaning: it's nothing to worry about."],
  ["What does “avoir le coup de foudre” mean?", "To fall in love at first sight", ["To be struck by a storm", "To feel angry"], "Figurative meaning: love at first sight."],
  ["What does “mettre son grain de sel” mean?", "To give an opinion nobody asked for", ["To add salt to soup", "To buy salt"], "Figurative meaning: to give an opinion nobody asked for."],
  ["What does “tomber dans les pommes” mean?", "To faint", ["To fall in an orchard", "To eat apples"], "Figurative meaning: to faint.", "🍎"],
  ["What does “être dans la lune” mean?", "To be daydreaming", ["To travel to the moon", "To stay up all night"], "Figurative meaning: to be daydreaming.", "🌙"],
  ["What does “casser les pieds à quelqu'un” mean?", "To annoy someone", ["To hurt someone's feet", "To help someone dance"], "Figurative meaning: to annoy someone."],
  ["What does “Il fait un temps de chien” mean?", "The weather is terrible", ["The weather is perfect for dogs", "It is sunny"], "Figurative meaning: the weather is awful.", "🐶"],
  ["What does “un froid de canard” describe?", "Very cold weather", ["A duck pond", "A soft coat"], "Figurative meaning: bitterly cold weather.", "🦆"],
  ["What is Mardi gras known for in many Francophone places?", "Parades, costumes and special foods", ["Quiet reading", "Fireworks on July 1"], TRAD_HINT, "🎭"],
  ["Which winter festival in Winnipeg celebrates Francophone and Métis heritage?", "Festival du Voyageur", ["Tour de France", "Carnaval de Rio"], TRAD_HINT],
  ["What is poutine?", "A Québec dish of fries, cheese curds and gravy", ["A winter coat", "A sports game"], TRAD_HINT, "🍟"],
  ["What is a tourtière?", "A traditional meat pie, often eaten around Christmas", ["A kind of skate", "A winter hat"], TRAD_HINT, "🥧"],
  ["What does “chanter comme une casserole” mean?", "To sing badly", ["To sing in a choir", "To sing while cooking"], "Figurative meaning: to sing out of tune."],
  ["What does “rire aux éclats” mean?", "To burst out laughing", ["To laugh quietly", "To cry"], "Figurative meaning: to laugh out loud.", "😂"],
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

const POWER_CUT = {
  type: "passage" as const,
  title: "La panne d'électricité",
  paragraphs: [
    "Vendredi soir, il y a une panne d'électricité dans le quartier de Karim. Il fait noir et sa petite sœur Aya a peur. D'abord, Karim cherche une lampe de poche. Ensuite, il allume des chandelles avec sa mère. Pendant la panne, la famille joue aux cartes. Finalement, l'électricité revient et Aya s'endort, rassurée.",
  ],
};

const CONCERT = {
  type: "passage" as const,
  title: "Le concert de Sofia",
  paragraphs: [
    "Sofia joue du violon depuis deux ans. Samedi dernier, elle a joué à son premier concert devant toute l'école. Avant de commencer, ses mains tremblaient parce qu'elle avait le trac. Puis, elle a regardé son professeur, qui lui a souri. Elle a respiré profondément et elle a joué sa pièce sans erreur. À la fin, tout le monde a applaudi.",
  ],
};

const HIKE = {
  type: "passage" as const,
  title: "Le sentier",
  paragraphs: [
    "Dimanche, Hugo et son oncle font une randonnée dans la forêt. Le sentier est long et la journée est chaude. Au milieu du chemin, Hugo perd sa bouteille d'eau. Il est inquiet, mais son oncle partage la sienne. Au sommet, ils admirent le lac et ils mangent des sandwichs. Hugo se promet de ne plus oublier son sac.",
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
  ["When does the story take place?", "Friday evening", ["Monday morning", "Saturday afternoon"], STORY_HINT, POWER_CUT],
  ["What is the problem?", "There is a power outage", ["Karim loses his key", "A storm destroys the house"], STORY_HINT, POWER_CUT],
  ["Who is afraid?", "Aya", ["Karim", "Their mother"], STORY_HINT, POWER_CUT],
  ["What does Karim look for first?", "A flashlight", ["Candles", "Cards"], STORY_HINT, POWER_CUT],
  ["What does the family do during the outage?", "They play cards", ["They watch TV", "They go to bed early"], STORY_HINT, POWER_CUT],
  ["Which word shows the last step?", "Finalement", ["D'abord", "Ensuite"], STORY_HINT, POWER_CUT],
  ["How does the story end?", "The power comes back and Aya falls asleep reassured", ["Aya cries all night", "The power stays off"], STORY_HINT, POWER_CUT],
  ["How long has Sofia played the violin?", "Two years", ["Two months", "Ten years"], STORY_HINT, CONCERT],
  ["When was the concert?", "Last Saturday", ["Next Saturday", "Yesterday"], STORY_HINT, CONCERT],
  ["Why do her hands shake?", "She is nervous", ["She is cold", "She is hungry"], STORY_HINT, CONCERT],
  ["What helps Sofia calm down?", "Her teacher's smile and a deep breath", ["A glass of water", "A new violin"], STORY_HINT, CONCERT],
  ["How does her performance go?", "She plays without mistakes", ["She stops in the middle", "She forgets the music"], STORY_HINT, CONCERT],
  ["What does the audience do at the end?", "They applaud", ["They leave", "They sing"], STORY_HINT, CONCERT],
  ["Which word in the story means “last”?", "dernier", ["prochain", "chaque"], STORY_HINT, CONCERT],
  ["Who goes hiking?", "Hugo and his uncle", ["Hugo and his sister", "Hugo and his teacher"], STORY_HINT, HIKE],
  ["What is the weather like?", "Hot", ["Snowy", "Rainy"], STORY_HINT, HIKE],
  ["What is Hugo's problem?", "He loses his water bottle", ["He loses his shoes", "He breaks his phone"], STORY_HINT, HIKE],
  ["How does his uncle help?", "He shares his water", ["He carries Hugo", "He turns back"], STORY_HINT, HIKE],
  ["What do they see at the top?", "A lake", ["A city", "A road"], STORY_HINT, HIKE],
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
  ["How can a song in French help you learn about a community?", "It shows the feelings, stories and traditions of the people who made it", ["It teaches only math", "It replaces your own culture"], ID_HINT],
  ["Why is it useful to read a poem written by a Francophone author?", "To see the world through another person's experience", ["To avoid learning vocabulary", "To prove one culture is better"], ID_HINT],
  ["Which of these is a Francophone creative work?", "A film made in Québec", ["A calculator", "A road sign"], ID_HINT],
  ["What can a painting tell you about a culture?", "How its people see their land, history and daily life", ["Nothing at all", "Only the price of paint"], ID_HINT],
  ["How does learning French help you see your own culture?", "You compare traditions and notice what is similar and different", ["You forget your own traditions", "You decide which culture is best"], ID_HINT],
  ["Which question helps you compare two cultures respectfully?", "What do these traditions have in common, and what is unique?", ["Which culture is more modern?", "Whose food is cheaper?"], ID_HINT],
  ["Why is it important to listen to Indigenous people when learning about their languages and cultures?", "They are the best source for their own stories and knowledge", ["They have nothing to share", "Books are always enough"], "Indigenous peoples in Canada are living communities with their own languages, stories and knowledge."],
  ["Which statement is true?", "Many Indigenous nations in Canada have languages that are different from French and English.", ["All Indigenous peoples in Canada speak the same language.", "Indigenous languages are no longer spoken."], "There are many different Indigenous languages in Canada. They are living languages, and many communities are working to teach and strengthen them."],
  ["Why do some Francophone communities in Canada work to protect their language?", "Language carries culture, history and identity", ["Because French is the only language in Canada", "Because it is easy"], ID_HINT],
  ["What is an Acadian?", "A member of a Francophone community with roots in the Atlantic provinces", ["A kind of French food", "A Canadian bank"], ID_HINT],
  ["What is Michif?", "A Métis language that mixes Cree and French", ["A kind of dance", "A French dictionary"], "Michif is a living language of the Métis that blends parts of Cree and French."],
  ["What does it mean to explore your cultural identity?", "To think about the traditions, languages and stories that shape who you are", ["To copy another culture", "To hide where you come from"], ID_HINT],
  ["A class listens to a Francophone song about winter. Which question asks about culture?", "What does this song say about how people live in winter?", ["How many words are in the song?", "What day was it recorded?"], ID_HINT],
  ["Which creative work uses images and words together?", "A poster or a comic strip", ["A train ticket", "A phone number"], ID_HINT],
  ["Why do artists share their experiences in creative works?", "To help others understand their point of view", ["To avoid being heard", "To copy other artists"], ID_HINT],
  ["Learning French can help you…", "make connections with people in many communities", ["avoid other languages", "stop using English"], ID_HINT],
  ["What does “francophone” mean?", "a person or community that speaks French", ["a person who speaks English", "a kind of music"], ID_HINT],
  ["What does “bilingue” mean?", "speaking two languages", ["speaking no language", "speaking very loudly"], ID_HINT],
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
  ["Which is plagiarism?", "Copying a paragraph from a website and calling it yours", ["Quoting a sentence and citing the author", "Paraphrasing and listing the source"], CULT_HINT],
  ["You find a quote that supports your idea. What do you do?", "Put it in quotation marks and name the author", ["Remove the quotation marks", "Change one word and use it as yours"], CULT_HINT],
  ["Why is giving credit important?", "It respects the creator and shows where your information comes from", ["It makes your project longer", "It hides the source"], CULT_HINT],
  ["Which is a way to avoid plagiarism?", "Use your own words and list the sources", ["Copy and change a few words", "Skip the sources"], CULT_HINT],
  ["A friend lets you read their essay. Which action is plagiarism?", "Handing in parts of it as your own", ["Reading it for ideas, then writing your own", "Asking how they organized it"], CULT_HINT],
  ["Which is an example of cultural appropriation?", "Using a community's sacred design on products you sell, without asking", ["Learning a traditional dance from a teacher who invites you", "Reading a book written by someone from the community"], CULT_HINT],
  ["Which action shows respect for a culture that is not yours?", "Ask community members how to take part and listen to their answers", ["Decide for them what is okay", "Take photos of private events without asking"], CULT_HINT],
  ["You want to use a traditional story in a school play. What should you do first?", "Ask permission from the community and credit them", ["Rewrite it so no one recognizes it", "Just use it, because it is online"], CULT_HINT],
  ["Which statement is true about stories that belong to a community?", "The community decides who may share them", ["Anyone may change them freely", "They belong to everyone"], CULT_HINT],
  ["Why can wearing another culture's traditional clothing as a costume be hurtful?", "It can turn something meaningful into a joke", ["It is hard to wash", "It is too expensive"], CULT_HINT],
  ["What should you include in a bibliography?", "The authors, titles and dates of your sources", ["Your favourite colour", "Your friends' names"], CULT_HINT],
  ["You paraphrase a paragraph from an article. What must you still do?", "Name the article as a source", ["Nothing, it's your idea now", "Put quotation marks around every word"], CULT_HINT],
  ["Which is an example of using a community's voice without permission?", "Telling a community's story as if you were a member, without asking", ["Sharing a story with permission and credit", "Reading a story aloud and naming the author"], CULT_HINT],
  ["You take a photo of a mural. What shows respect when you share it?", "Credit the artist", ["Crop the signature", "Say you painted it"], CULT_HINT],
  ["What can you do if you are not sure whether a source needs credit?", "Ask your teacher and cite it to be safe", ["Leave it out of the list", "Hope no one notices"], CULT_HINT],
  ["Which is a respectful question to ask a community member?", "Would you be willing to share how you celebrate this tradition?", ["Why is your tradition so strange?", "Can I have your costume?"], CULT_HINT],
  ["Which behaviour is both fair and honest?", "Doing your own work and thanking those who helped", ["Letting others do your work", "Using a stranger's drawing without a name"], CULT_HINT],
  ["What does “plagier” mean?", "to plagiarize", ["to play", "to plan"], "Plagier is the French verb for passing off someone else's work as your own."],
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
