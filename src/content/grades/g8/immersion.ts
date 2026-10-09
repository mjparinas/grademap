import { frOrder, frQuestions, type FrItem } from "../../french";
import type { Course, GenerateOptions, Question } from "../../types";

const FR = { lang: "fr" } as const;

// ---------- Les registres de langue ----------

const REG_HINT = "Il y a trois registres : familier (entre amis, parfois de l'argot), courant (la langue de tous les jours) et soutenu (raffiné, littéraire).";

const REGISTERS: FrItem[] = [
  ["Quel registre de langue est utilisé? « Ché pas où est ton bouquin. »", "Familier", ["Courant", "Soutenu"], REG_HINT],
  ["Quel registre de langue est utilisé? « Je ne sais pas où est ton livre. »", "Courant", ["Familier", "Soutenu"], REG_HINT],
  ["Quel registre de langue est utilisé? « Je ne sais point où est placé votre ouvrage. »", "Soutenu", ["Familier", "Courant"], REG_HINT],
  ["Quel registre de langue est utilisé? « T'as vu la bagnole de mon pote? »", "Familier", ["Courant", "Soutenu"], REG_HINT],
  ["Quel registre de langue est utilisé? « As-tu vu la voiture de mon ami? »", "Courant", ["Familier", "Soutenu"], REG_HINT],
  ["Quel registre de langue est utilisé? « Avez-vous remarqué l'automobile de mon camarade? »", "Soutenu", ["Familier", "Courant"], REG_HINT],
  ["Quelle phrase est écrite en langue courante?", "Je vais au parc avec mes amis.", ["J'vais au parc avec mes potes.", "Je me rends au parc en compagnie de mes camarades."], REG_HINT],
  ["Quelle phrase est écrite en langue familière?", "J'ai trop la trouille!", ["J'ai très peur.", "Je suis saisi d'une grande frayeur."], REG_HINT],
  ["Quel registre convient le mieux pour écrire une lettre à la directrice?", "Courant ou soutenu", ["Familier", "De l'argot"], REG_HINT],
  ["Avec qui est-il normal d'utiliser la langue familière?", "Avec tes amis", ["Avec un juge", "Avec le premier ministre"], REG_HINT],
  ["Comment dit-on « livre » en langue familière?", "bouquin", ["ouvrage", "manuel"], "Bouquin est un mot familier pour livre. Ouvrage est plus soutenu."],
  ["Comment dit-on « voiture » en langue familière?", "bagnole", ["automobile", "véhicule"], "Bagnole est un mot familier pour voiture."],
  ["Quel registre de langue est utilisé? « C'est super cool, ton jeu! »", "Familier", ["Courant", "Soutenu"], REG_HINT],
  ["Quel registre de langue est utilisé? « Ton jeu est très amusant. »", "Courant", ["Familier", "Soutenu"], REG_HINT],
  ["Quel registre de langue est utilisé? « Votre jeu est des plus divertissants. »", "Soutenu", ["Familier", "Courant"], REG_HINT],
  ["Quel registre de langue est utilisé? « J'ai la flemme de ranger ma chambre. »", "Familier", ["Courant", "Soutenu"], REG_HINT],
  ["Quel registre de langue est utilisé? « Je n'ai pas envie de ranger ma chambre. »", "Courant", ["Familier", "Soutenu"], REG_HINT],
  ["Quel registre de langue est utilisé? « Je n'éprouve aucun désir de mettre ma chambre en ordre. »", "Soutenu", ["Familier", "Courant"], REG_HINT],
  ["Comment dit-on « argent » en langue familière?", "fric", ["somme", "fortune"], "Fric est un mot familier pour argent."],
  ["Comment dit-on « travail » en langue familière?", "boulot", ["emploi", "labeur"], "Boulot est un mot familier pour travail. Labeur est plus soutenu."],
  ["Comment dit-on « ami » en langue familière?", "pote", ["camarade", "compagnon"], "Pote est un mot familier pour ami."],
  ["Quelle phrase est écrite en langue soutenue?", "Veuillez patienter un instant, je vous prie.", ["Attends deux secondes!", "Attends un peu."], REG_HINT],
  ["Quelle phrase est écrite en langue courante?", "Je suis fatigué après la classe.", ["Chu crevé après l'école!", "Je suis harassé au terme de la journée."], REG_HINT],
  ["Quelle phrase est écrite en langue familière?", "T'es prêt? On y va!", ["Es-tu prêt? Nous y allons.", "Êtes-vous prêt? Nous partons sur-le-champ."], REG_HINT],
  ["Quel registre convient pour parler avec ton enseignante?", "Courant", ["Familier", "De l'argot"], REG_HINT],
  ["Pourquoi change-t-on de registre selon la situation?", "Pour s'adapter à la personne et au contexte", ["Pour parler plus vite", "Pour ne pas se faire comprendre"], REG_HINT],
];

// ---------- Communication verbale et non verbale ----------

const COM_HINT = "La communication verbale utilise la voix : intonation, volume, débit, ton, pauses. La communication non verbale utilise le corps : gestes et mimiques.";

const COMMUNICATION: FrItem[] = [
  ["Quel élément est non verbal?", "Les gestes", ["Le volume de la voix", "Le débit"], COM_HINT],
  ["Quel élément est non verbal?", "Les mimiques du visage", ["L'intonation", "Les pauses"], COM_HINT],
  ["Quel élément est verbal?", "Le ton de la voix", ["Un haussement d'épaules", "Un sourire"], COM_HINT],
  ["Quel élément est verbal?", "Le débit (la vitesse)", ["Les mains sur les hanches", "Un clin d'œil"], COM_HINT],
  ["Ana parle très fort et très vite. Quels éléments de communication verbale utilise-t-elle?", "Le volume et le débit", ["Les gestes et les mimiques", "Le sourire et le clin d'œil"], COM_HINT],
  ["Léo croise les bras et fronce les sourcils. Que montre-t-il?", "Qu'il est mécontent", ["Qu'il est très content", "Qu'il a faim"], COM_HINT],
  ["Pourquoi les pauses sont-elles importantes dans un exposé oral?", "Elles aident l'auditoire à comprendre", ["Elles rendent l'exposé plus court", "Elles cachent les erreurs"], COM_HINT],
  ["Pour présenter un sujet triste, quel ton choisir?", "Un ton doux et lent", ["Un ton joyeux et rapide", "Un ton moqueur"], COM_HINT],
  ["Quelle stratégie aide l'auditoire à bien entendre?", "Parler assez fort et articuler", ["Parler tout bas", "Parler en regardant le plancher"], COM_HINT],
  ["Comment un geste peut-il aider un message?", "Il illustre ou renforce ce qu'on dit", ["Il remplace tous les mots", "Il empêche de comprendre"], COM_HINT],
  ["Quel élément est non verbal?", "Le regard", ["Le volume de la voix", "Le ton"], COM_HINT],
  ["Quel élément est non verbal?", "La posture du corps", ["Le débit", "L'intonation"], COM_HINT],
  ["Quel élément est verbal?", "L'intonation (la mélodie de la voix)", ["Un hochement de tête", "Les bras croisés"], COM_HINT],
  ["Quel élément est verbal?", "Les pauses", ["Un sourire", "Un geste de la main"], COM_HINT],
  ["Quel élément est verbal?", "Le volume de la voix", ["Un clin d'œil", "Les mimiques"], COM_HINT],
  ["Samir hoche la tête et sourit pendant que Zoé parle. Que montre-t-il?", "Qu'il l'écoute et qu'il approuve", ["Qu'il s'ennuie", "Qu'il veut partir"], COM_HINT],
  ["Lena chuchote pour annoncer une surprise. Quel élément verbal utilise-t-elle?", "Un volume très bas", ["Un haussement d'épaules", "Un geste de la main"], COM_HINT],
  ["Pour montrer son enthousiasme dans un exposé, que peut-on faire?", "Varier l'intonation et sourire", ["Parler toujours sur le même ton", "Lire à voix très basse"], COM_HINT],
  ["Pourquoi faut-il regarder l'auditoire pendant un exposé?", "Pour garder son attention et créer un lien", ["Pour oublier son texte", "Pour parler plus vite"], COM_HINT],
  ["Quel débit convient le mieux pour un exposé?", "Ni trop rapide ni trop lent", ["Le plus rapide possible", "Très lent, avec de longs silences sans raison"], COM_HINT],
  ["Kenji parle d'une voix monotone, sans changer de ton. Que peut-il faire pour s'améliorer?", "Varier l'intonation", ["Parler plus bas", "Éviter toutes les pauses"], COM_HINT],
  ["Ravi se tient droit, les épaules détendues. Quel type de communication est-ce?", "De la communication non verbale", ["De la communication verbale", "De la communication écrite"], COM_HINT],
  ["Priya dit plus fort le mot le plus important de sa phrase. Qu'utilise-t-elle?", "Le volume de la voix", ["Une mimique", "Un geste"], COM_HINT],
  ["Maya lève la main pour demander la parole. Quel type de communication est-ce?", "De la communication non verbale", ["De la communication verbale", "De la communication écrite"], COM_HINT],
];

// ---------- La légende ----------

const LEGEND_LAKE = {
  type: "passage" as const,
  title: "Le lac qui chante",
  paragraphs: [
    "Il était une fois un petit lac, au pied d'une montagne, qui ne faisait aucun bruit. Les oiseaux passaient sans s'arrêter, car l'endroit leur semblait triste et silencieux.",
    "Un matin, le garçon Tarek s'assit au bord de l'eau et lança un caillou. Le lac fit « ploc » et une note claire monta dans l'air. Tarek lança un deuxième caillou, puis un troisième : chaque caillou faisait une note différente.",
    "Depuis ce jour, quand le vent et la pluie touchent l'eau, le lac chante. Les oiseaux reviennent l'écouter, et on raconte que la mélodie vient du garçon qui a su réveiller le lac.",
  ],
};

const LEGEND_OWL = {
  type: "passage" as const,
  title: "Le hibou et le soleil",
  paragraphs: [
    "Au commencement du monde, le hibou était un oiseau du jour. Il aimait le soleil, mais il se plaignait toujours : la lumière était trop forte pour ses grands yeux.",
    "Un jour, le hibou demanda au soleil de briller moins fort. Le soleil, vexé, lui répondit : « Si ma lumière te dérange, tu vivras dans l'ombre. » Et il se coucha tôt ce soir-là.",
    "Depuis, le hibou sort quand la nuit tombe et il reste dans ses arbres pendant le jour. On dit qu'il murmure encore ses excuses au soleil, chaque soir, avant de s'envoler.",
  ],
};

const LEGEND = {
  type: "passage" as const,
  title: "Pourquoi la lune change de forme",
  paragraphs: [
    "Il y a très longtemps, la lune était un grand disque qui brillait toute la nuit sans jamais changer. Les animaux de la forêt dormaient mal, car la lumière ne s'éteignait jamais.",
    "Un soir, la petite renarde Aube monta sur la plus haute colline et demanda à la lune de se reposer. La lune réfléchit longtemps, puis elle répondit : « Je me cacherai un peu chaque nuit, puis je reviendrai. »",
    "Depuis ce jour, la lune diminue, disparaît et grossit de nouveau. Les animaux peuvent enfin dormir, et ils se souviennent d'Aube, la renarde qui a su demander.",
  ],
};

const LEGEND_HINT = "Une légende raconte une histoire souvent merveilleuse qui explique un phénomène. Sa structure : situation initiale, élément déclencheur, transformation, fin.";

const LEGENDS: FrItem[] = [
  ["Quel phénomène cette légende explique-t-elle?", "Les changements de forme de la lune", ["Pourquoi il neige", "Pourquoi les renards courent vite"], LEGEND_HINT, LEGEND],
  ["Qui est le personnage principal?", "Aube, la petite renarde", ["La lune", "Les oiseaux"], LEGEND_HINT, LEGEND],
  ["Quel élément est merveilleux (fantastique)?", "La lune parle et répond", ["Les animaux dorment", "La colline est haute"], LEGEND_HINT, LEGEND],
  ["Quelle est la situation initiale?", "La lune brille toute la nuit et les animaux dorment mal", ["Aube monte sur la colline", "La lune se cache"], LEGEND_HINT, LEGEND],
  ["Quel est l'élément déclencheur?", "Aube demande à la lune de se reposer", ["La lune brille toute la nuit", "Les animaux dorment"], LEGEND_HINT, LEGEND],
  ["Quelle est la transformation?", "La lune se cache un peu chaque nuit", ["La lune devient une étoile", "Aube devient une lune"], LEGEND_HINT, LEGEND],
  ["Comment finit la légende?", "Les animaux peuvent enfin dormir", ["La lune disparaît pour toujours", "Aube quitte la forêt"], LEGEND_HINT, LEGEND],
  ["Quelle phrase contient une métaphore?", "La lune était un grand disque qui brillait.", ["Les animaux dormaient mal.", "Aube monta sur la colline."], "Une métaphore compare sans « comme ». Ici, la lune « est » un disque.", LEGEND],
  ["Quelle est la fonction d'une légende?", "Expliquer un phénomène ou une origine de façon imagée", ["Donner une recette", "Annoncer la météo"], LEGEND_HINT],
  ["Quel est un élément de la tradition orale?", "Un récit transmis de bouche à oreille", ["Un formulaire de sondage", "Une facture"], "La tradition orale transmet des récits, des chansons et des savoirs de génération en génération."],
  ["Quel phénomène cette légende explique-t-elle?", "Pourquoi le lac fait de la musique", ["Pourquoi les montagnes sont hautes", "Pourquoi les oiseaux voyagent"], LEGEND_HINT, LEGEND_LAKE],
  ["Qui est le personnage principal?", "Tarek, un garçon", ["Le lac", "Un oiseau"], LEGEND_HINT, LEGEND_LAKE],
  ["Quel élément est merveilleux (fantastique)?", "Chaque caillou fait une note de musique", ["Un garçon s'assoit au bord de l'eau", "Le lac est au pied d'une montagne"], LEGEND_HINT, LEGEND_LAKE],
  ["Quelle est la situation initiale?", "Le petit lac est silencieux et les oiseaux ne s'arrêtent pas", ["Tarek lance un caillou", "Le lac chante"], LEGEND_HINT, LEGEND_LAKE],
  ["Quel est l'élément déclencheur?", "Tarek lance un caillou dans l'eau", ["Les oiseaux reviennent", "Le vent se lève"], LEGEND_HINT, LEGEND_LAKE],
  ["Quelle est la transformation?", "Le lac se met à chanter", ["Tarek quitte la montagne", "Le lac s'assèche"], LEGEND_HINT, LEGEND_LAKE],
  ["Comment finit la légende?", "Les oiseaux reviennent écouter le lac", ["Le lac redevient silencieux", "Tarek lance son dernier caillou"], LEGEND_HINT, LEGEND_LAKE],
  ["Pourquoi les oiseaux ne s'arrêtaient-ils pas au lac au début?", "L'endroit leur semblait triste et silencieux", ["Ils avaient peur de Tarek", "Il y avait trop de vent"], LEGEND_HINT, LEGEND_LAKE],
  ["Quelle phrase contient une personnification?", "Le lac chante.", ["Tarek lance un caillou.", "Le lac est au pied d'une montagne."], "Une personnification donne des actions humaines à une chose.", LEGEND_LAKE],
  ["Quel phénomène cette légende explique-t-elle?", "Pourquoi le hibou vit la nuit", ["Pourquoi il pleut la nuit", "Pourquoi les arbres perdent leurs feuilles"], LEGEND_HINT, LEGEND_OWL],
  ["Qui est le personnage principal?", "Le hibou", ["Le soleil", "Un arbre"], LEGEND_HINT, LEGEND_OWL],
  ["Quel élément est merveilleux (fantastique)?", "Le soleil parle et se vexe", ["Le hibou a de grands yeux", "La nuit tombe"], LEGEND_HINT, LEGEND_OWL],
  ["Quel est l'élément déclencheur?", "Le hibou demande au soleil de briller moins fort", ["Le hibou aime le soleil", "Le hibou s'envole le soir"], LEGEND_HINT, LEGEND_OWL],
  ["Comment finit la légende?", "Le hibou sort la nuit et s'excuse chaque soir", ["Le soleil ne se couche plus", "Le hibou redevient un oiseau du jour"], LEGEND_HINT, LEGEND_OWL],
  ["Que ressent le soleil quand le hibou se plaint?", "Il est vexé", ["Il est ravi", "Il a peur"], LEGEND_HINT, LEGEND_OWL],
];

// ---------- Le théâtre ----------

const PLAY = {
  type: "passage" as const,
  title: "La soupe brûlée (scène 1)",
  paragraphs: [
    "Une cuisine d'école, tôt le matin.",
    "JULIE (inquiète, tenant une casserole) : Madame Roy! La soupe est brûlée!",
    "MADAME ROY (calme) : Respire, Julie. Nous allons recommencer ensemble.",
    "MONSIEUR LAVOIE (entrant avec un sourire méchant) : Ha! Je savais que vous n'y arriveriez pas!",
  ],
};

const PLAY_LOCKER = {
  type: "passage" as const,
  title: "Le casque perdu (scène 2)",
  paragraphs: [
    "Un vestiaire de gymnase, après la classe.",
    "AMIR (cherchant partout) : Mon casque de vélo a disparu! Il était là ce matin.",
    "LENA (en l'aidant) : Ne panique pas, Amir. Regardons ensemble.",
    "MONSIEUR PAGÉ (en cachant quelque chose derrière son dos) : Je n'ai rien vu, moi.",
  ],
};

const PLAY_HINT = "Au théâtre, les répliques sont précédées du nom du personnage. Les didascalies (indications de jeu) sont entre parenthèses. Le héros mène l'histoire; l'opposant lui fait obstacle.";

const PLAYS: FrItem[] = [
  ["Qui est le héros de la scène?", "Julie", ["Madame Roy", "Monsieur Lavoie"], PLAY_HINT, PLAY],
  ["Qui est le personnage secondaire qui aide?", "Madame Roy", ["Monsieur Lavoie", "Julie"], PLAY_HINT, PLAY],
  ["Qui est l'opposant (le rival) de Julie?", "Monsieur Lavoie", ["Madame Roy", "La casserole"], PLAY_HINT, PLAY],
  ["Comment appelle-t-on les mots entre parenthèses, comme (calme)?", "Des didascalies", ["Des rimes", "Des titres"], PLAY_HINT, PLAY],
  ["À quoi servent les didascalies?", "À indiquer comment jouer et où se passe l'action", ["À rimer", "À résumer l'histoire"], PLAY_HINT, PLAY],
  ["Où et quand se passe la scène?", "Dans une cuisine d'école, tôt le matin", ["Dans un parc, le soir", "Dans une classe, l'après-midi"], PLAY_HINT, PLAY],
  ["Quel indice montre que Madame Roy est calme?", "La didascalie « calme » et sa phrase rassurante", ["Elle crie", "Elle laisse tomber la casserole"], PLAY_HINT, PLAY],
  ["Que montre la didascalie « avec un sourire méchant »?", "Que M. Lavoie se moque de Julie", ["Qu'il veut aider", "Qu'il a peur"], PLAY_HINT, PLAY],
  ["Que signifie le sens explicite d'une réplique?", "Ce que le personnage dit clairement", ["Ce qu'il pense sans le dire", "Le titre de la pièce"], "Le sens explicite est dit. Le sens implicite est suggéré."],
  ["« Je savais que vous n'y arriveriez pas! » Quel est le sens implicite?", "M. Lavoie voulait que Julie échoue", ["M. Lavoie aime la soupe", "M. Lavoie est en retard"], "Le sens implicite se déduit du ton et des indices.", PLAY],
  ["Pourquoi le dialogue est-il important au théâtre?", "Il fait connaître les personnages et l'action", ["Il remplace le décor", "Il sert à faire rire seulement"], PLAY_HINT],
  ["Qui est le héros de la scène?", "Amir", ["Lena", "Monsieur Pagé"], PLAY_HINT, PLAY_LOCKER],
  ["Qui est le personnage secondaire qui aide?", "Lena", ["Monsieur Pagé", "Amir"], PLAY_HINT, PLAY_LOCKER],
  ["Quel personnage semble cacher quelque chose?", "Monsieur Pagé", ["Lena", "Amir"], PLAY_HINT, PLAY_LOCKER],
  ["Où et quand se passe la scène?", "Dans un vestiaire de gymnase, après la classe", ["Dans une cuisine, le matin", "Dans un parc, pendant la fin de semaine"], PLAY_HINT, PLAY_LOCKER],
  ["Que montre la didascalie « en cachant quelque chose derrière son dos »?", "Que M. Pagé n'est pas tout à fait honnête", ["Qu'il a froid", "Qu'il aide Amir"], PLAY_HINT, PLAY_LOCKER],
  ["Quel indice montre qu'Amir est inquiet?", "Il cherche partout et dit que son casque a disparu", ["Il rit avec Lena", "Il rentre chez lui"], PLAY_HINT, PLAY_LOCKER],
  ["« Je n'ai rien vu, moi. » Quel est le sens implicite, avec la didascalie?", "M. Pagé sait où est le casque", ["M. Pagé aime les casques", "M. Pagé cherche aussi"], "Le sens implicite se déduit du ton et des indices.", PLAY_LOCKER],
  ["Que fait Lena pour aider Amir?", "Elle l'invite à chercher avec elle", ["Elle se moque de lui", "Elle cache le casque"], PLAY_HINT, PLAY_LOCKER],
  ["Pourquoi chaque réplique commence-t-elle par un nom comme « LENA »?", "Pour indiquer quel personnage parle", ["Pour donner le titre de la pièce", "Pour décrire le décor"], PLAY_HINT, PLAY_LOCKER],
  ["Qu'est-ce qu'un monologue?", "Une longue réplique d'un seul personnage", ["Une scène sans personnage", "Un décor"], "Un monologue : un personnage parle longuement. Un dialogue : au moins deux personnages se parlent."],
  ["Qu'est-ce qu'un dialogue?", "Une conversation entre des personnages", ["Un décor de théâtre", "Le titre de la pièce"], "Un dialogue est une conversation entre au moins deux personnages."],
  ["Qu'est-ce qu'une scène?", "Une partie d'une pièce de théâtre", ["Un personnage", "Une rime"], PLAY_HINT],
  ["Les acteurs disent-ils les didascalies à voix haute pendant la pièce?", "Non, elles guident le jeu et le décor", ["Oui, toujours", "Oui, mais seulement à la fin"], PLAY_HINT],
  ["Que fait l'opposant dans une pièce?", "Il rend la tâche du héros plus difficile", ["Il aide le héros à gagner", "Il écrit les répliques"], PLAY_HINT],
];

// ---------- Le schéma narratif ----------

const NARR_HINT = "Le schéma narratif : situation initiale, élément déclencheur, péripéties (action qui monte), dénouement (action qui descend) et situation finale.";

const SCHEME: FrItem[] = [
  ["Comment s'appelle le début d'un récit qui présente les personnages et le lieu?", "La situation initiale", ["Le dénouement", "La situation finale"], NARR_HINT],
  ["Quel événement lance l'action d'un récit?", "L'élément déclencheur", ["Le dénouement", "La situation finale"], NARR_HINT],
  ["Que sont les péripéties?", "Les événements qui compliquent l'histoire", ["Les noms des personnages", "Le titre"], NARR_HINT],
  ["Que se passe-t-il au dénouement?", "Le problème se résout", ["On présente les personnages", "Le problème apparaît"], NARR_HINT],
  ["Comment s'appelle la fin du récit, quand tout est calme?", "La situation finale", ["L'élément déclencheur", "Les péripéties"], NARR_HINT],
  ["« Un matin, Zoé trouve une carte au trésor dans son sac. » De quelle étape s'agit-il?", "L'élément déclencheur", ["La situation finale", "Le dénouement"], NARR_HINT],
  ["« Zoé et son frère vivent près d'un grand lac. » De quelle étape s'agit-il?", "La situation initiale", ["Le dénouement", "Les péripéties"], NARR_HINT],
  ["« Enfin, Zoé retrouve le trésor et le partage avec toute la classe. » De quelle étape s'agit-il?", "Le dénouement ou la situation finale", ["L'élément déclencheur", "La situation initiale"], NARR_HINT],
  ["« Il était une fois une petite ville au bord de la mer. » De quelle étape s'agit-il?", "La situation initiale", ["L'élément déclencheur", "Le dénouement"], NARR_HINT],
  ["« Soudain, une grosse vague emporte le chapeau de Noa. » De quelle étape s'agit-il?", "L'élément déclencheur", ["La situation finale", "Le dénouement"], NARR_HINT],
  ["« Noa nage, grimpe sur un rocher, puis appelle à l'aide. » De quelle étape s'agit-il?", "Les péripéties", ["La situation initiale", "La situation finale"], NARR_HINT],
  ["« Enfin, une pêcheuse lance une corde et Noa est sauvé. » De quelle étape s'agit-il?", "Le dénouement", ["La situation initiale", "L'élément déclencheur"], NARR_HINT],
  ["« Le soir, Noa est de retour chez lui, au chaud, et il sourit. » De quelle étape s'agit-il?", "La situation finale", ["L'élément déclencheur", "Les péripéties"], NARR_HINT],
  ["Quelle étape présente le lieu, le moment et les personnages?", "La situation initiale", ["Le dénouement", "Les péripéties"], NARR_HINT],
  ["Quelle étape contient plusieurs obstacles que le héros doit surmonter?", "Les péripéties", ["La situation initiale", "La situation finale"], NARR_HINT],
  ["Quelle étape résout le problème principal?", "Le dénouement", ["La situation initiale", "L'élément déclencheur"], NARR_HINT],
  ["Qu'est-ce qui rompt l'équilibre de la situation initiale?", "L'élément déclencheur", ["La situation finale", "Le titre"], NARR_HINT],
  ["Dans quelle étape le héros retrouve-t-il un nouvel équilibre?", "La situation finale", ["L'élément déclencheur", "Les péripéties"], NARR_HINT],
  ["Quelle étape vient juste après l'élément déclencheur?", "Les péripéties", ["La situation finale", "La situation initiale"], NARR_HINT],
  ["Quelle étape vient juste avant le dénouement?", "Les péripéties", ["La situation initiale", "La situation finale"], NARR_HINT],
  ["Quelle expression annonce souvent la situation initiale d'un conte?", "Il était une fois", ["Soudain", "À la fin"], NARR_HINT],
  ["Quel mot peut annoncer l'élément déclencheur?", "Soudain", ["Il était une fois", "Enfin"], NARR_HINT],
  ["Quel est l'ordre correct des trois premières étapes?", "Situation initiale, élément déclencheur, péripéties", ["Péripéties, situation initiale, dénouement", "Dénouement, élément déclencheur, situation finale"], NARR_HINT],
  ["Pourquoi un récit a-t-il besoin d'un élément déclencheur?", "Pour lancer l'action", ["Pour présenter l'auteur", "Pour terminer l'histoire"], NARR_HINT],
];

function scheme(opts?: GenerateOptions): Question[] {
  return [
    ...frQuestions(SCHEME, opts, 6, FR),
    frOrder("Mets les étapes du schéma narratif dans l'ordre.", NARR_HINT, ["Situation initiale", "Élément déclencheur", "Péripéties", "Dénouement", "Situation finale"], FR),
  ];
}

// ---------- Structure des textes ----------

const TEXT_HINT = "Un texte informatif a une introduction, un développement et une conclusion. Un texte argumentatif présente un point de vue, des arguments, un contre-argument et une conclusion.";

const TEXTS: FrItem[] = [
  ["Où présente-t-on le sujet dans un texte informatif?", "Dans l'introduction", ["Dans la conclusion", "Dans le contre-argument"], TEXT_HINT],
  ["Que contient le développement d'un texte informatif?", "Les idées principales et les détails", ["Seulement le titre", "Seulement un résumé"], TEXT_HINT],
  ["Que fait la conclusion d'un texte informatif?", "Elle résume l'essentiel", ["Elle présente le sujet", "Elle donne un contre-argument"], TEXT_HINT],
  ["Quelle partie d'un texte argumentatif exprime l'opinion de l'auteur?", "Le point de vue", ["Le contre-argument", "La conclusion"], TEXT_HINT],
  ["Qu'est-ce qu'un argument?", "Une raison qui appuie un point de vue", ["Une dispute", "Un titre"], TEXT_HINT],
  ["Qu'est-ce qu'un contre-argument?", "Une idée qui s'oppose au point de vue", ["Une raison qui appuie la thèse", "Le titre du texte"], TEXT_HINT],
  ["Pourquoi présenter un contre-argument?", "Pour montrer qu'on comprend les autres opinions et y répondre", ["Pour changer de sujet", "Pour faire rire"], TEXT_HINT],
  ["« À mon avis, les élèves devraient avoir plus de récréation. » De quoi s'agit-il?", "D'un point de vue", ["D'une conclusion", "D'un contre-argument"], TEXT_HINT],
  ["« Certains disent que cela réduit le temps d'étude, mais la concentration s'améliore après une pause. » De quoi s'agit-il?", "Un contre-argument et sa réponse", ["Une introduction", "Un titre"], TEXT_HINT],
  ["Quelle source est la plus fiable pour un texte informatif sur les volcans?", "Un livre d'un volcanologue", ["Une publicité", "Un message sans auteur"], "Vérifie qui a écrit l'information et si elle s'appuie sur des preuves."],
  ["Quelle partie d'un texte argumentatif rappelle le point de vue à la fin?", "La conclusion", ["Le contre-argument", "L'introduction"], TEXT_HINT],
  ["Où présente-t-on le point de vue dans un texte argumentatif?", "Dans l'introduction", ["Dans la conclusion seulement", "Dans la bibliographie"], TEXT_HINT],
  ["Dans un texte argumentatif, que contient le développement?", "Les arguments et les exemples", ["Seulement la conclusion", "Le nom de l'éditeur"], TEXT_HINT],
  ["Quel texte a pour but de convaincre?", "Un texte argumentatif", ["Un texte informatif", "Un horaire d'autobus"], TEXT_HINT],
  ["Quel texte a pour but de faire connaître un sujet?", "Un texte informatif", ["Un texte argumentatif", "Un slogan"], TEXT_HINT],
  ["Quel mot annonce un argument?", "Premièrement", ["Autrefois", "Hier"], TEXT_HINT],
  ["Quel mot annonce un contre-argument?", "Cependant", ["Donc", "Ensuite"], TEXT_HINT],
  ["Quelle expression annonce la conclusion?", "En somme", ["Cependant", "D'abord"], TEXT_HINT],
  ["« Les vélos sont bons pour la santé, car ils font bouger le corps. » Que contient cette phrase?", "Un argument", ["Une introduction", "Un titre"], TEXT_HINT],
  ["Quel exemple appuie l'argument « Lire aide à apprendre des mots »?", "Un élève qui lit chaque soir connaît plus de mots", ["Il pleut souvent en avril", "Le livre a deux cents pages"], TEXT_HINT],
  ["Quel intertitre convient à une section sur l'habitat des phoques?", "Où vivent les phoques?", ["Les prix des billets", "Comment faire un gâteau?"], "Un intertitre annonce le contenu de la section."],
  ["À quoi sert un intertitre dans un texte informatif?", "À annoncer le contenu d'une section", ["À remplacer la conclusion", "À cacher les sources"], "Un intertitre annonce le contenu de la section."],
  ["Quelle phrase exprime un fait?", "Le Canada compte dix provinces.", ["Le Canada est le plus beau pays.", "Tout le monde devrait visiter le Canada."], "Un fait peut être vérifié. Une opinion exprime ce que l'on pense."],
  ["Quelle phrase exprime une opinion?", "Tout le monde devrait visiter le Canada.", ["Le Canada compte dix provinces.", "Ottawa est la capitale du Canada."], "Un fait peut être vérifié. Une opinion exprime ce que l'on pense."],
  ["Pourquoi appuie-t-on un argument par un exemple ou un fait?", "Pour le rendre plus convaincant", ["Pour allonger le texte", "Pour changer de sujet"], TEXT_HINT],
];

// ---------- La ponctuation ----------

const PONCT_HINT = "Le point-virgule sépare deux phrases proches par le sens. Les guillemets « » encadrent les paroles rapportées et les citations.";

const PUNCT: FrItem[] = [
  ["Quelle phrase utilise correctement le point-virgule?", "J'aime le hockey; mon frère préfère le soccer.", ["J'aime; le hockey mon frère préfère le soccer.", "J'aime le hockey mon frère; préfère le soccer."], PONCT_HINT],
  ["Quelle phrase utilise correctement le point-virgule?", "Il pleut beaucoup; nous restons à la maison.", ["Il pleut; beaucoup nous restons à la maison.", "Il pleut beaucoup nous; restons à la maison."], PONCT_HINT],
  ["À quoi sert le point-virgule?", "À séparer deux idées proches dans une même phrase", ["À finir un paragraphe", "À poser une question"], PONCT_HINT],
  ["Quelle phrase rapporte correctement des paroles?", "Léa a dit : « Je suis prête. »", ["Léa a dit : Je suis prête.", "Léa a dit « : Je suis prête. »"], PONCT_HINT],
  ["Que fait-on avec les guillemets « »?", "On encadre les paroles de quelqu'un", ["On montre un titre de chapitre", "On sépare les syllabes"], PONCT_HINT],
  ["Pourquoi utilise-t-on des guillemets pour une citation?", "Pour montrer que ce sont les mots exacts de l'auteur", ["Pour cacher la source", "Pour rendre la phrase plus longue"], PONCT_HINT],
  ["Quelle phrase cite une source correctement?", "Selon l'auteur, « la lecture ouvre des mondes » (Roy, 2020).", ["Selon l'auteur, la lecture « ouvre des mondes » sans source.", "Selon l'auteur, la lecture ouvre des mondes, 2020 Roy."], "Une citation : guillemets + auteur + année."],
  ["Où met-on le deux-points avant une citation?", "Avant les guillemets", ["Après le dernier mot de la citation", "Au milieu d'un mot"], PONCT_HINT],
  ["Quelle phrase est bien ponctuée?", "Samir a répondu : « Je viens demain. »", ["Samir a répondu « Je viens » : demain.", "Samir a répondu : Je viens demain. »"], PONCT_HINT],
  ["Quelle phrase est bien ponctuée?", "Ana a dit : « J'arrive tout de suite. »", ["Ana a dit « : J'arrive tout de suite. »", "Ana a dit : J'arrive tout de suite. »"], PONCT_HINT],
  ["Quelle phrase utilise correctement le point-virgule?", "Elle aime lire; son frère préfère dessiner.", ["Elle aime; lire son frère préfère dessiner.", "Elle aime lire son; frère préfère dessiner."], PONCT_HINT],
  ["Quelle phrase utilise correctement le point-virgule?", "Il fait beau; nous allons au parc.", ["Il fait; beau nous allons au parc.", "Il fait beau nous allons; au parc."], PONCT_HINT],
  ["Quelle phrase utilise correctement le point-virgule?", "Léo joue du piano; Zoé joue du violon.", ["Léo; joue du piano Zoé joue du violon.", "Léo joue du piano Zoé; joue du violon."], PONCT_HINT],
  ["Quand le point-virgule convient-il?", "Pour lier deux phrases qui expriment des idées reliées", ["Pour terminer une question", "Pour entourer une citation"], PONCT_HINT],
  ["Quel signe encadre des paroles rapportées?", "Les guillemets", ["Le point-virgule", "Les parenthèses"], PONCT_HINT],
  ["Dans la phrase Marie a dit : « Il pleut. », quel signe annonce les paroles?", "Le deux-points", ["Le point-virgule", "Le point d'interrogation"], PONCT_HINT],
  ["Quelle phrase cite un texte correctement?", "Le poète écrit : « La nuit tombe doucement. »", ["Le poète écrit : La nuit tombe doucement.", "Le poète écrit ; « La nuit tombe doucement. »"], PONCT_HINT],
  ["Que faut-il ajouter à une citation tirée d'un livre?", "La source (auteur et année)", ["Un point-virgule", "Un deuxième titre"], "Une citation : guillemets + auteur + année."],
  ["Pourquoi les guillemets sont-ils importants dans un travail de recherche?", "Ils montrent quels mots viennent d'une autre personne", ["Ils rendent le texte plus joli", "Ils remplacent la bibliographie"], PONCT_HINT],
  ["Quelle phrase est bien ponctuée?", "Nous avons gagné; les autres ont perdu.", ["Nous avons gagné; les autres, ont perdu;", "Nous avons gagné: les autres; ont perdu."], PONCT_HINT],
  ["Après un point-virgule, un mot ordinaire (pas un nom propre) commence par…", "une minuscule", ["une majuscule", "un guillemet"], PONCT_HINT],
  ["Quelle phrase rapporte une question correctement?", "Zoé a demandé : « Viens-tu? »", ["Zoé a demandé : « Viens-tu »?", "Zoé a demandé « : Viens-tu? »"], PONCT_HINT],
  ["Quels signes entourent une citation en français?", "Les guillemets « »", ["Les parenthèses ( )", "Les crochets [ ]"], PONCT_HINT],
  ["Quelle phrase utilise mal le point-virgule?", "Je mange; de la soupe.", ["Il neige; je reste au chaud.", "Elle chante; il danse."], "Le point-virgule sépare deux phrases proches par le sens. Il ne coupe pas une phrase en deux morceaux qui ne se suffisent pas."],
  ["Que sépare le point-virgule dans « Elle chante; il danse »?", "Deux propositions reliées", ["Un nom et un adjectif", "Un titre et un auteur"], PONCT_HINT],
];

// ---------- Les propositions subordonnées relatives ----------

const REL_HINT = "Une subordonnée relative commence par qui, que, où ou dont et complète un nom. Qui remplace le sujet, que remplace le complément direct, où indique le lieu ou le temps.";

const RELATIVES: FrItem[] = [
  ["Complète : Le livre ___ j'ai lu était passionnant.", "que", ["qui", "où"], REL_HINT],
  ["Complète : L'élève ___ parle est mon ami.", "qui", ["que", "où"], REL_HINT],
  ["Complète : La ville ___ j'habite est grande.", "où", ["qui", "que"], REL_HINT],
  ["Complète : Le chat ___ dort sur le divan est à moi.", "qui", ["que", "où"], REL_HINT],
  ["Complète : La chanson ___ elle chante est très belle.", "que", ["qui", "où"], REL_HINT],
  ["Complète : Voici le parc ___ nous jouons chaque été.", "où", ["qui", "que"], REL_HINT],
  ["Quelle est la subordonnée relative? « L'amie que j'ai invitée est arrivée. »", "que j'ai invitée", ["L'amie", "est arrivée"], REL_HINT],
  ["Quelle est la subordonnée relative? « Le garçon qui joue du piano est mon cousin. »", "qui joue du piano", ["Le garçon", "est mon cousin"], REL_HINT],
  ["À quel nom se rapporte « qui » dans « J'ai un chat qui ronronne »?", "chat", ["J'ai", "ronronne"], REL_HINT],
  ["Quelle phrase contient une subordonnée relative?", "Le film que nous avons vu était drôle.", ["Nous avons vu un film drôle.", "Le film est drôle."], REL_HINT],
  ["Complète : Le garçon ___ chante est mon voisin.", "qui", ["que", "où"], REL_HINT],
  ["Complète : Le film ___ nous regardons est drôle.", "que", ["qui", "où"], REL_HINT],
  ["Complète : La maison ___ je suis né est vieille.", "où", ["qui", "que"], REL_HINT],
  ["Complète : Les fruits ___ poussent ici sont sucrés.", "qui", ["que", "où"], REL_HINT],
  ["Complète : Le cadeau ___ Ana a reçu est un livre.", "que", ["qui", "où"], REL_HINT],
  ["Complète : Le village ___ nous passons l'été est calme.", "où", ["qui", "que"], REL_HINT],
  ["Complète : La fille ___ je vois sur la photo est ma cousine.", "que", ["qui", "où"], REL_HINT],
  ["Complète : Le chien ___ aboie est dans le jardin.", "qui", ["que", "où"], REL_HINT],
  ["Complète : Voici la bibliothèque ___ je lis chaque semaine.", "où", ["qui", "que"], REL_HINT],
  ["Complète : L'histoire ___ elle raconte est drôle.", "que", ["qui", "où"], REL_HINT],
  ["Quelle est la subordonnée relative? « Le gâteau que Maya a préparé est délicieux. »", "que Maya a préparé", ["Le gâteau", "est délicieux"], REL_HINT],
  ["Quelle est la subordonnée relative? « La voisine qui arrose les fleurs est gentille. »", "qui arrose les fleurs", ["La voisine", "est gentille"], REL_HINT],
  ["Quelle est la subordonnée relative? « Voici la cour où nous jouons. »", "où nous jouons", ["Voici la cour", "jouons"], REL_HINT],
  ["À quel nom se rapporte « que » dans « Le livre que je lis est long »?", "livre", ["je", "long"], REL_HINT],
  ["Quel pronom relatif remplace un complément de lieu?", "où", ["qui", "que"], REL_HINT],
  ["Quel pronom relatif remplace le sujet?", "qui", ["que", "où"], REL_HINT],
  ["Quelle phrase contient une subordonnée relative?", "La chanson que tu aimes joue à la radio.", ["Tu aimes la chanson.", "La chanson joue à la radio."], REL_HINT],
];

// ---------- L'accord du participe passé ----------

const PP_HINT = "Avec être, le participe passé s'accorde avec le sujet. Avec avoir, il s'accorde avec le complément direct seulement s'il est placé avant le verbe.";

const PARTICIPLES: FrItem[] = [
  ["Complète : Elles sont ___ au parc.", "allées", ["allé", "allée"], PP_HINT],
  ["Complète : Marie est ___ en retard.", "arrivée", ["arrivé", "arrivés"], PP_HINT],
  ["Complète : Les garçons sont ___ à la maison.", "rentrés", ["rentré", "rentrée"], PP_HINT],
  ["Complète : J'ai ___ une pomme.", "mangé", ["mangée", "mangés"], PP_HINT],
  ["Complète : Les pommes que j'ai ___ étaient bonnes.", "mangées", ["mangé", "mangée"], PP_HINT],
  ["Complète : La lettre que Marie a ___ est longue.", "écrite", ["écrit", "écrits"], PP_HINT],
  ["Complète : Nous avons ___ la lettre. (la lettre vient après le verbe)", "reçu", ["reçue", "reçus"], PP_HINT],
  ["Complète : Ils sont ___ très tôt ce matin.", "partis", ["parti", "partie"], PP_HINT],
  ["Complète : Les fleurs qu'elle a ___ sont rouges.", "achetées", ["acheté", "achetée"], PP_HINT],
  ["Complète : Anna et Léa se sont ___ à la bibliothèque.", "rencontrées", ["rencontré", "rencontrés"], "Anna et Léa sont des filles : le participe passé s'accorde au féminin pluriel."],
  ["Complète : Mes sœurs sont ___ hier soir.", "parties", ["parti", "partis"], PP_HINT],
  ["Complète : Lucas est ___ à huit heures.", "sorti", ["sortie", "sortis"], PP_HINT],
  ["Complète : Les filles sont ___ dans le gymnase.", "entrées", ["entré", "entrés"], PP_HINT],
  ["Complète : Zoé est ___ de son vélo.", "tombée", ["tombé", "tombés"], PP_HINT],
  ["Complète : Nous avons ___ nos devoirs. (les devoirs viennent après le verbe)", "fini", ["finis", "finie"], PP_HINT],
  ["Complète : Les devoirs que nous avons ___ sont faciles.", "finis", ["fini", "finie"], PP_HINT],
  ["Complète : La clé que j'ai ___ était dans mon sac.", "trouvée", ["trouvé", "trouvés"], PP_HINT],
  ["Complète : Les livres que tu as ___ sont sur la table.", "lus", ["lu", "lue"], PP_HINT],
  ["Complète : Ils ont ___ un beau film. (le film vient après le verbe)", "vu", ["vus", "vue"], PP_HINT],
  ["Complète : Les photos qu'il a ___ sont belles.", "prises", ["pris", "prise"], PP_HINT],
  ["Complète : Elle est ___ chez sa tante pour la fin de semaine.", "restée", ["resté", "restés"], PP_HINT],
  ["Complète : Les chansons que nous avons ___ étaient joyeuses.", "chantées", ["chanté", "chantée"], PP_HINT],
  ["Complète : Léo et Samir sont ___ à l'école.", "venus", ["venu", "venues"], PP_HINT],
  ["Quel auxiliaire le verbe « aller » utilise-t-il au passé composé?", "être", ["avoir", "pouvoir"], PP_HINT],
  ["Dans « La soupe que Rémi a préparée », pourquoi écrit-on « préparée » avec un -e?", "Parce que « que » remplace la soupe, placée avant le verbe", ["Parce que Rémi est une fille", "Parce que tous les verbes en -er prennent un -e"], PP_HINT],
];

// ---------- Les compléments ----------

const COMP_HINT = "Le complément direct répond à « quoi? » ou « qui? » sans préposition. Le complément indirect est introduit par une préposition comme à ou de. Le complément circonstanciel donne le lieu, le temps ou la manière.";

const COMPLEMENTS: FrItem[] = [
  ["Dans « Léa mange une pomme dans le parc », quel groupe est le complément direct?", "une pomme", ["dans le parc", "Léa"], COMP_HINT],
  ["Dans « Léa mange une pomme dans le parc », « dans le parc » est un complément…", "circonstanciel de lieu", ["direct", "indirect"], COMP_HINT],
  ["Dans « Il parle à son frère », « à son frère » est un complément…", "indirect", ["direct", "circonstanciel de temps"], COMP_HINT],
  ["Dans « Elle offre un livre à sa mère », le complément indirect est…", "à sa mère", ["un livre", "Elle"], COMP_HINT],
  ["Dans « Elle offre un livre à sa mère », le complément direct est…", "un livre", ["à sa mère", "Elle"], COMP_HINT],
  ["Dans « Nous partons demain matin », « demain matin » est un complément…", "circonstanciel de temps", ["direct", "indirect"], COMP_HINT],
  ["Dans « Il court rapidement », « rapidement » indique…", "la manière", ["le lieu", "le temps"], COMP_HINT],
  ["Quelle question permet de trouver le complément direct?", "Il fait quoi? ou Il voit qui?", ["Où?", "Quand?"], COMP_HINT],
  ["Dans « Marc lit un journal le soir », « le soir » est un complément…", "circonstanciel de temps", ["direct", "indirect"], COMP_HINT],
  ["Dans « Zoé lit un livre à la bibliothèque », quel groupe est le complément direct?", "un livre", ["à la bibliothèque", "Zoé"], COMP_HINT],
  ["Dans « Zoé lit un livre à la bibliothèque », « à la bibliothèque » est un complément…", "circonstanciel de lieu", ["direct", "indirect"], COMP_HINT],
  ["Dans « Tom donne une pomme à Ana », le complément indirect est…", "à Ana", ["une pomme", "Tom"], COMP_HINT],
  ["Dans « Tom donne une pomme à Ana », le complément direct est…", "une pomme", ["à Ana", "Tom"], COMP_HINT],
  ["Dans « Nous marchons lentement », « lentement » indique…", "la manière", ["le lieu", "le temps"], COMP_HINT],
  ["Dans « Ils arrivent ce soir », « ce soir » est un complément…", "circonstanciel de temps", ["direct", "indirect"], COMP_HINT],
  ["Dans « Elle téléphone à son amie », « à son amie » est un complément…", "indirect", ["direct", "circonstanciel de lieu"], COMP_HINT],
  ["Dans « Lou range ses jouets dans le coffre », « dans le coffre » est un complément…", "circonstanciel de lieu", ["direct", "indirect"], COMP_HINT],
  ["Dans « Ravi parle de son voyage », « de son voyage » est un complément…", "indirect", ["direct", "circonstanciel de temps"], COMP_HINT],
  ["Dans « Maya écoute la musique », le complément direct est…", "la musique", ["Maya", "écoute"], COMP_HINT],
  ["Quelle question permet de trouver le complément indirect introduit par à?", "À qui? ou à quoi?", ["Quand?", "Où?"], COMP_HINT],
  ["Quelle question permet de trouver un complément de temps?", "Quand?", ["Qui?", "Quoi?"], COMP_HINT],
  ["Quelle question permet de trouver un complément de lieu?", "Où?", ["Quand?", "Comment?"], COMP_HINT],
  ["Quelle question permet de trouver un complément de manière?", "Comment?", ["Où?", "Quand?"], COMP_HINT],
  ["Dans « Sam mange rapidement une pomme », quel mot indique la manière?", "rapidement", ["une pomme", "Sam"], COMP_HINT],
  ["Peut-on souvent déplacer un complément circonstanciel dans la phrase?", "Oui, par exemple : « Dans le parc, il court. »", ["Non, jamais", "Seulement s'il est un complément direct"], COMP_HINT],
];

// ---------- Futur simple et conditionnel présent ----------

const MOOD_HINT = "Le futur simple parle de ce qui arrivera : j'irai, tu iras. Le conditionnel présent exprime une demande polie ou une possibilité : je voudrais, j'irais.";

const MOODS: FrItem[] = [
  ["Complète : Demain, j'___ au musée. (aller)", "irai", ["allais", "suis allé"], MOOD_HINT],
  ["Complète : Demain, nous ___ notre projet. (finir)", "finirons", ["finirions", "avons fini"], MOOD_HINT],
  ["Complète : La semaine prochaine, elle ___ à Montréal. (voyager)", "voyagera", ["voyageait", "a voyagé"], MOOD_HINT],
  ["Complète : Ce soir, tu ___ tes devoirs. (faire)", "feras", ["ferais", "as fait"], MOOD_HINT],
  ["Pour demander poliment : Je ___ un verre d'eau, s'il vous plaît. (vouloir)", "voudrais", ["voulais", "voulu"], MOOD_HINT],
  ["Pour demander poliment : Pourriez-vous ___ la porte? (fermer)", "fermer", ["fermé", "ferme"], "Après pourriez-vous, le verbe reste à l'infinitif."],
  ["Quelle phrase est au conditionnel présent?", "Je mangerais bien une pomme.", ["Je mangerai une pomme.", "Je mangeais une pomme."], MOOD_HINT],
  ["Quelle phrase est au futur simple?", "Nous partirons à midi.", ["Nous partirions à midi.", "Nous partions à midi."], MOOD_HINT],
  ["Complète : Il ___ du soleil demain. (faire, futur)", "fera", ["ferait", "faisait"], MOOD_HINT],
  ["Quel mot exprime le futur?", "demain", ["hier", "autrefois"], MOOD_HINT],
  ["Complète : Demain, tu ___ ton cousin. (voir)", "verras", ["verrais", "as vu"], MOOD_HINT],
  ["Complète : L'été prochain, nous ___ à la mer. (aller)", "irons", ["irions", "allions"], MOOD_HINT],
  ["Complète : Dans deux jours, ils ___ une surprise. (avoir)", "auront", ["auraient", "avaient"], MOOD_HINT],
  ["Complète : Plus tard, je ___ médecin. (être)", "serai", ["serais", "étais"], MOOD_HINT],
  ["Complète : Demain, vous ___ au musée. (venir)", "viendrez", ["viendriez", "veniez"], MOOD_HINT],
  ["Pour demander très poliment : ___-vous m'aider? (pouvoir, conditionnel)", "Pourriez", ["Pourrez", "Pouviez"], MOOD_HINT],
  ["Complète : Si j'avais le temps, je ___ un livre. (lire, conditionnel)", "lirais", ["lirai", "lisais"], MOOD_HINT],
  ["Complète : À ta place, je ___ plus tôt. (partir, conditionnel)", "partirais", ["partirai", "partais"], MOOD_HINT],
  ["Complète : Nous ___ volontiers un jus. (prendre, conditionnel)", "prendrions", ["prendrons", "prenions"], MOOD_HINT],
  ["Quelle phrase est au futur simple?", "Elle chantera ce soir.", ["Elle chanterait ce soir.", "Elle chantait ce soir."], MOOD_HINT],
  ["Quelle phrase est au conditionnel présent?", "Tu aimerais ce jeu.", ["Tu aimeras ce jeu.", "Tu aimais ce jeu."], MOOD_HINT],
  ["Quelle forme est au futur simple?", "je finirai", ["je finirais", "je finissais"], MOOD_HINT],
  ["Quelle forme est au conditionnel présent?", "je finirais", ["je finirai", "je finissais"], MOOD_HINT],
  ["Complète : Le mois prochain, Léa ___ dix ans. (avoir)", "aura", ["aurait", "avait"], MOOD_HINT],
  ["Complète : Je ___ bien aller au cinéma, mais je suis fatigué. (vouloir, conditionnel)", "voudrais", ["voudrai", "voulais"], MOOD_HINT],
  ["Quelle expression annonce le futur?", "la semaine prochaine", ["la semaine dernière", "hier soir"], MOOD_HINT],
];

export const course: Course = {
  grade: "8",
  subject: "immersion",
  bigIdeas: {
    "ca-bc": [
      "The choice of verbal and non-verbal language conveys the speaker's intentions.",
      "Becoming aware of the values conveyed in texts helps us to better understand their cultural content.",
      "Deepening our understanding of a text requires discovering the implicit and explicit information in it.",
      "The communicator, by organizing his or her ideas and relying on various sources, defends his or her point of view and influences the audience.",
      "Literature, when viewed in its context, helps to expand our perception of a society.",
    ],
  },
  units: [
    {
      id: "registres-de-langue",
      title: "Les registres de langue",
      emoji: "🎚️",
      blurb: "Familier, courant, soutenu",
      parentNote: "Recognizing colloquial, standard and formal language, and choosing the right register for the audience.",
      standards: { "ca-bc": "Registers of language: colloquial, standard and formal language" },
      generate: (o) => frQuestions(REGISTERS, o, 8, FR),
    },
    {
      id: "communication-verbale",
      title: "Parler et se faire comprendre",
      emoji: "🗣️",
      blurb: "Voix, gestes et mimiques",
      parentNote: "Verbal communication (intonation, volume, speed, tone, pauses) and non-verbal communication (gestures and facial expressions).",
      standards: { "ca-bc": "Communication strategies: verbal (intonation, voice, volume, speed, tone, pauses) and non-verbal (gestures and mimicry)" },
      generate: (o) => frQuestions(COMMUNICATION, o, 8, FR),
    },
    {
      id: "legende",
      title: "La légende",
      emoji: "🌙",
      blurb: "Personnages et phénomènes",
      parentNote: "Characteristics and structure of a legend (characters, fantasy elements, explanation of a phenomenon) using an original story, and oral tradition.",
      standards: { "ca-bc": "Literary elements: characteristics of the legend; structure of legends; elements of oral tradition" },
      generate: (o) => frQuestions(LEGENDS, o, 8, FR),
    },
    {
      id: "theatre",
      title: "Le théâtre",
      emoji: "🎭",
      blurb: "Héros, opposant, didascalies",
      parentNote: "Characters in a play (hero, supporting character, nemesis), dialogue, stage directions, and explicit versus implicit meaning, using an original scene.",
      standards: { "ca-bc": "Literary elements: characteristics of the play (setting, hero, supporting character, nemesis, dialogue, stage directions, explicit and implicit meaning)" },
      generate: (o) => frQuestions(PLAYS, o, 8, FR),
    },
    {
      id: "schema-narratif",
      title: "Le schéma narratif",
      emoji: "🧭",
      blurb: "Du début à la fin d'un récit",
      parentNote: "The stages of a story: setting, inciting incident, rising action, falling action and resolution.",
      standards: { "ca-bc": "Text organization: narrative structure (setting, inciting incident, rising action, falling action and resolution)" },
      generate: scheme,
    },
    {
      id: "structure-des-textes",
      title: "Informer et argumenter",
      emoji: "📣",
      blurb: "Introduction, arguments, conclusion",
      parentNote: "The structure of informational and argumentative texts, including point of view, argument and counter-argument.",
      standards: { "ca-bc": "Text organization: structure of informational texts and argumentative texts" },
      generate: (o) => frQuestions(TEXTS, o, 8, FR),
    },
    {
      id: "point-virgule-et-guillemets",
      title: "Point-virgule et guillemets",
      emoji: "✒️",
      blurb: "Ponctuer avec précision",
      parentNote: "Using the semicolon and quotation marks to join ideas, report speech and cite sources.",
      standards: { "ca-bc": "Punctuation: semicolon and quotation marks" },
      generate: (o) => frQuestions(PUNCT, o, 8, FR),
    },
    {
      id: "subordonnees-relatives",
      title: "Qui, que, où",
      emoji: "🔗",
      blurb: "Les subordonnées relatives",
      parentNote: "Building and recognizing relative clauses with qui, que and où.",
      standards: { "ca-bc": "Language elements: structure of relative subordinate clauses" },
      generate: (o) => frQuestions(RELATIVES, o, 8, FR),
    },
    {
      id: "accord-du-participe",
      title: "L'accord du participe passé",
      emoji: "✅",
      blurb: "Être, avoir et le complément direct",
      parentNote: "Making past participles agree in the passé composé with être (with the subject) and with avoir (with a direct object placed before the verb).",
      standards: { "ca-bc": "Language elements: subject/verb and direct object agreement with the verbs être and avoir in the passé composé" },
      generate: (o) => frQuestions(PARTICIPLES, o, 8, FR),
    },
    {
      id: "complements",
      title: "Les compléments",
      emoji: "🧩",
      blurb: "Direct, indirect, circonstanciel",
      parentNote: "Telling apart direct objects, indirect objects and circumstantial complements (place, time, manner).",
      standards: { "ca-bc": "Language elements: grammatical functions of complements" },
      generate: (o) => frQuestions(COMPLEMENTS, o, 8, FR),
    },
    {
      id: "futur-et-conditionnel",
      title: "Futur simple et conditionnel",
      emoji: "🔮",
      blurb: "Demain et les demandes polies",
      parentNote: "Forming and using the simple future and the present conditional, including polite requests.",
      standards: { "ca-bc": "Language elements: verb moods and tenses: present conditional and simple future" },
      generate: (o) => frQuestions(MOODS, o, 8, FR),
    },
  ],
};
