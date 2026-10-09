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
];

// ---------- La légende ----------

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
