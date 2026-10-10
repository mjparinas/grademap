import { frOrder, frQuestions, type FrItem } from "../../french";
import type { Course, GenerateOptions, Question } from "../../types";

const FR = { lang: "fr" } as const;

// ---------- Qui, que, où, dont ----------

const REL_HINT = "“Qui” replaces the subject, “que” replaces the direct object, “où” gives a place or time and “dont” replaces a phrase with “de”.";

const RELATIVES: FrItem[] = [
  ["Complète : Le livre ___ est sur la table est à moi.", "qui", ["que", "où", "dont"], REL_HINT],
  ["Complète : Le film ___ j'ai vu hier était drôle.", "que", ["qui", "où", "dont"], REL_HINT],
  ["Complète : La ville ___ j'habite est grande.", "où", ["que", "qui", "dont"], REL_HINT],
  ["Complète : Le garçon ___ je parle est mon cousin.", "dont", ["que", "qui", "où"], "We say “parler de quelqu'un”, so the link word is “dont” (de + whom)."],
  ["Complète : C'est l'amie ___ m'a aidé.", "qui", ["que", "où", "dont"], REL_HINT],
  ["Complète : Voici le chien ___ Léa a adopté.", "que", ["qui", "où", "dont"], REL_HINT],
  ["Complète : Le jour ___ nous sommes arrivés était froid.", "où", ["que", "qui", "dont"], REL_HINT],
  ["Complète : Le livre ___ j'ai besoin est sur l'étagère.", "dont", ["que", "qui", "où"], "We say “avoir besoin de”, so the link word is “dont”."],
  ["Complète : L'enseignante ___ nous aimons beaucoup s'appelle Mme Lee.", "que", ["qui", "où", "dont"], REL_HINT],
  ["Complète : Le parc ___ nous jouons est près d'ici.", "où", ["que", "dont", "qui"], REL_HINT],
  ["Complète : Les enfants ___ chantent sont dans la chorale.", "qui", ["que", "où", "dont"], REL_HINT],
  ["Complète : Le jeu ___ tu parles est très populaire.", "dont", ["que", "qui", "où"], "We say “parler de quelque chose”, so the link word is “dont”."],
  ["Complète : La fille ___ chante est ma sœur.", "qui", ["que", "où", "dont"], REL_HINT],
  ["Complète : Le gâteau ___ Ana a préparé est délicieux.", "que", ["qui", "où", "dont"], REL_HINT],
  ["Complète : La maison ___ je suis né est très vieille.", "où", ["que", "qui", "dont"], REL_HINT],
  ["Complète : Le sport ___ Kenji rêve est le hockey.", "dont", ["que", "qui", "où"], "We say “rêver de quelque chose”, so the link word is “dont”."],
  ["Complète : Les fleurs ___ poussent dans le jardin sont jaunes.", "qui", ["que", "où", "dont"], REL_HINT],
  ["Complète : Le cadeau ___ Noé a reçu est un livre.", "que", ["qui", "où", "dont"], REL_HINT],
  ["Complète : Le lac ___ nous nageons est froid.", "où", ["que", "qui", "dont"], REL_HINT],
  ["Complète : Le film ___ il se souvient est triste.", "dont", ["que", "qui", "où"], "We say “se souvenir de quelque chose”, so the link word is “dont”."],
  ["Complète : Le garçon ___ a gagné la course s'appelle Leo.", "qui", ["que", "où", "dont"], REL_HINT],
  ["Complète : Les devoirs ___ elle fait sont difficiles.", "que", ["qui", "où", "dont"], REL_HINT],
  ["Complète : L'outil ___ il a besoin est dans le garage.", "dont", ["que", "qui", "où"], "We say “avoir besoin de”, so the link word is “dont”."],
  ["Complète : Le chien ___ aboie est à mon voisin.", "qui", ["que", "où", "dont"], REL_HINT],
  ["Complète : La fille ___ j'ai rencontrée hier s'appelle Priya.", "que", ["qui", "où", "dont"], REL_HINT],
];

// ---------- Ne… plus, jamais, rien ----------

const NEG_HINT = "Ne… plus means no longer, ne… jamais means never and ne… rien means nothing. Put “ne” before the verb and the other word after it.";

const NEGATION: FrItem[] = [
  ["Complète : Je n'ai ___ mangé de sushi. (pas une seule fois)", "jamais", ["rien", "plus", "personne"], NEG_HINT],
  ["Complète : Il n'y a ___ dans la boîte. (elle est vide)", "rien", ["jamais", "plus", "pas"], NEG_HINT],
  ["Complète : Elle ne joue ___ du piano. (elle a arrêté)", "plus", ["jamais", "rien", "personne"], NEG_HINT],
  ["Complète : Nous n'avons ___ vu cet enfant. (pas une seule fois)", "jamais", ["rien", "plus", "personne"], NEG_HINT],
  ["Complète : Je ne comprends ___ . (aucune chose)", "rien", ["jamais", "plus", "personne"], NEG_HINT],
  ["Complète : Il ne neige ___ . (c'est fini pour cette année)", "plus", ["jamais", "rien", "personne"], NEG_HINT],
  ["Quelle phrase est correcte?", "Je ne vois rien.", ["Je ne rien vois.", "Je vois ne rien.", "Ne je vois rien."], NEG_HINT],
  ["Quelle phrase est correcte?", "Il ne mange jamais de légumes.", ["Il jamais ne mange de légumes.", "Il mange ne jamais de légumes.", "Il ne jamais mange de légumes."], NEG_HINT],
  ["Quelle phrase est correcte?", "Nous n'habitons plus ici.", ["Nous ne habitons plus ici.", "Nous habitons ne plus ici.", "Nous plus n'habitons ici."], NEG_HINT],
  ["Complète : Tu ne dis ___ . (aucune chose)", "rien", ["jamais", "plus", "personne"], NEG_HINT],
  ["Complète : Nous ne mangeons ___ de bonbons. (pas une seule fois)", "jamais", ["rien", "plus", "personne"], NEG_HINT],
  ["Complète : Ils n'habitent ___ à Halifax. (avant oui, maintenant non)", "plus", ["jamais", "rien", "personne"], NEG_HINT],
  ["Complète : Il ne voit ___ sans ses lunettes. (aucune chose)", "rien", ["jamais", "plus", "personne"], NEG_HINT],
  ["Complète : Elle ne rit ___ . (pas une seule fois)", "jamais", ["rien", "plus", "personne"], NEG_HINT],
  ["Complète : Je n'ai ___ de devoirs. (c'est fini)", "plus", ["jamais", "rien", "personne"], NEG_HINT],
  ["Complète : Vous n'entendez ___ . (aucune chose)", "rien", ["jamais", "plus", "personne"], NEG_HINT],
  ["Complète : Léo ne dort ___ avec une lumière. (pas une seule fois)", "jamais", ["rien", "plus", "personne"], NEG_HINT],
  ["Complète : La boutique ne vend ___ de journaux. (avant oui, maintenant non)", "plus", ["jamais", "rien", "personne"], NEG_HINT],
  ["Complète : Je n'ai ___ oublié. (aucune chose)", "rien", ["jamais", "plus", "personne"], NEG_HINT],
  ["Quelle phrase est correcte?", "Elle ne parle jamais fort.", ["Elle jamais ne parle fort.", "Elle parle ne jamais fort.", "Ne elle parle jamais fort."], NEG_HINT],
  ["Quelle phrase est correcte?", "Je n'ai plus faim.", ["Je ne ai plus faim.", "Je plus n'ai faim.", "J'ai n'plus faim."], NEG_HINT],
  ["Quelle phrase est correcte?", "Il ne dit rien.", ["Il dit ne rien.", "Il ne rien dit.", "Ne il dit rien."], NEG_HINT],
  ["Quelle phrase est correcte?", "Nous ne jouons plus dehors.", ["Nous jouons ne plus dehors.", "Nous ne plus jouons dehors.", "Ne nous jouons plus dehors."], NEG_HINT],
  ["Quelle phrase est correcte?", "Tu n'oublies jamais ton sac.", ["Tu ne jamais oublies ton sac.", "Tu oublies n'jamais ton sac.", "Tu jamais n'oublies ton sac."], NEG_HINT],
];

// ---------- Les adverbes ----------

const ADV_HINT = "Adverbs tell when (temps), where (lieu), how (manière) or how much (quantité). Ask yourself which question the adverb answers.";

const ADVERB_TYPES: FrItem[] = [
  ["« Demain » est un adverbe de…", "temps", ["lieu", "manière", "quantité"], ADV_HINT],
  ["« Souvent » est un adverbe de…", "temps", ["lieu", "manière", "quantité"], ADV_HINT],
  ["« Ici » est un adverbe de…", "lieu", ["temps", "manière", "quantité"], ADV_HINT],
  ["« Partout » est un adverbe de…", "lieu", ["temps", "manière", "quantité"], ADV_HINT],
  ["« Doucement » est un adverbe de…", "manière", ["temps", "lieu", "quantité"], ADV_HINT],
  ["« Vite » est un adverbe de…", "manière", ["temps", "lieu", "quantité"], ADV_HINT],
  ["« Beaucoup » est un adverbe de…", "quantité", ["temps", "lieu", "manière"], ADV_HINT],
  ["« Trop » est un adverbe de…", "quantité", ["temps", "lieu", "manière"], ADV_HINT],
  ["« Loin » est un adverbe de…", "lieu", ["temps", "manière", "quantité"], ADV_HINT],
  ["« Toujours » est un adverbe de…", "temps", ["lieu", "manière", "quantité"], ADV_HINT],
  ["Dans « Elle chante joliment », que dit l'adverbe?", "Comment elle chante", ["Quand elle chante", "Où elle chante"], ADV_HINT],
  ["Dans « Il joue dehors », que dit l'adverbe?", "Où il joue", ["Quand il joue", "Comment il joue"], ADV_HINT],
  ["« Hier » est un adverbe de…", "temps", ["lieu", "manière", "quantité"], ADV_HINT],
  ["« Dedans » est un adverbe de…", "lieu", ["temps", "manière", "quantité"], ADV_HINT],
  ["« Gentiment » est un adverbe de…", "manière", ["temps", "lieu", "quantité"], ADV_HINT],
  ["« Peu » est un adverbe de…", "quantité", ["temps", "lieu", "manière"], ADV_HINT],
  ["« Maintenant » est un adverbe de…", "temps", ["lieu", "manière", "quantité"], ADV_HINT],
  ["« Dessus » est un adverbe de…", "lieu", ["temps", "manière", "quantité"], ADV_HINT],
  ["« Rapidement » est un adverbe de…", "manière", ["temps", "lieu", "quantité"], ADV_HINT],
  ["« Assez » est un adverbe de…", "quantité", ["temps", "lieu", "manière"], ADV_HINT],
  ["« Bientôt » est un adverbe de…", "temps", ["lieu", "manière", "quantité"], ADV_HINT],
  ["« Là-bas » est un adverbe de…", "lieu", ["temps", "manière", "quantité"], ADV_HINT],
  ["« Parfois » est un adverbe de…", "temps", ["lieu", "manière", "quantité"], ADV_HINT],
  ["« Près » est un adverbe de…", "lieu", ["temps", "manière", "quantité"], ADV_HINT],
  ["Dans « Il parle trop », que dit l'adverbe?", "Combien il parle", ["Quand il parle", "Où il parle"], ADV_HINT],
  ["Dans « Nous arrivons bientôt », que dit l'adverbe?", "Quand nous arrivons", ["Où nous arrivons", "Comment nous arrivons"], ADV_HINT],
];

// ---------- La ponctuation ----------

const PUNCT_HINT = "Guillemets « » show what someone says, a colon : introduces a list or an explanation and parentheses ( ) add extra information.";

const PUNCTUATION: FrItem[] = [
  ["Quels signes servent à écrire les paroles de quelqu'un?", "Les guillemets « »", ["Les parenthèses ( )", "Le deux-points :"], PUNCT_HINT],
  ["Quel signe annonce une liste?", "Le deux-points :", ["Les guillemets « »", "Les parenthèses ( )"], PUNCT_HINT],
  ["Quels signes ajoutent une précision dans une phrase?", "Les parenthèses ( )", ["Les guillemets « »", "Le deux-points :"], PUNCT_HINT],
  ["Quelle phrase est bien ponctuée?", "Léa dit : « Bonjour! »", ["Léa dit « Bonjour! »,", "Léa dit ; (Bonjour!)", "Léa dit, Bonjour!"], PUNCT_HINT],
  ["Quelle phrase est bien ponctuée?", "Il faut trois choses : de la farine, des œufs et du lait.", ["Il faut trois choses « de la farine, des œufs et du lait. »", "Il faut trois choses (de la farine, des œufs et du lait)", "Il faut trois choses ; de la farine des œufs et du lait"], PUNCT_HINT],
  ["Quelle phrase est bien ponctuée?", "Mon chien (un labrador) aime nager.", ["Mon chien « un labrador » aime nager.", "Mon chien : un labrador aime nager.", "Mon chien, un labrador. aime nager."], PUNCT_HINT],
  ["Quelle phrase est bien ponctuée?", "Amir répond : « Je suis prêt. »", ["Amir répond (Je suis prêt).", "Amir répond « : Je suis prêt. »", "Amir : répond « Je suis prêt. »"], PUNCT_HINT],
  ["Où mettre les guillemets?", "Maya a dit : « J'arrive. »", ["Maya « a dit » : J'arrive.", "« Maya a dit : » J'arrive.", "Maya a dit : J'arrive. « »"], PUNCT_HINT],
  ["Quel signe termine une phrase qui pose une question?", "Le point d'interrogation ?", ["Le point d'exclamation !", "Les guillemets « »"], PUNCT_HINT],
  ["Quel signe montre la surprise ou la joie?", "Le point d'exclamation !", ["Le point d'interrogation ?", "Le deux-points :"], PUNCT_HINT],
  ["Quel signe sépare les éléments d'une liste dans une phrase?", "La virgule ,", ["Les guillemets « »", "Le deux-points :"], PUNCT_HINT],
  ["Pour citer les paroles exactes d'une personne, on utilise…", "les guillemets « »", ["le deux-points :", "les parenthèses ( )"], PUNCT_HINT],
  ["Pour annoncer une explication, on utilise…", "le deux-points :", ["les parenthèses ( )", "les guillemets « »"], PUNCT_HINT],
  ["Dans « Mon chat (un siamois) dort », que font les parenthèses?", "Elles ajoutent une précision", ["Elles annoncent une liste", "Elles montrent une parole"], PUNCT_HINT],
  ["Dans « Ana dit : Salut! », que fait le deux-points?", "Il annonce les paroles d'Ana", ["Il termine la phrase", "Il ajoute une précision"], PUNCT_HINT],
  ["Quelle phrase est bien ponctuée?", "Zoe demande : « Où est mon sac? »", ["Zoe demande « : Où est mon sac? »", "Zoe demande (Où est mon sac?),", "Zoe : demande « Où est mon sac? »"], PUNCT_HINT],
  ["Quelle phrase est bien ponctuée?", "Ravi annonce : « Nous partons demain! »", ["Ravi annonce (Nous partons demain!)", "Ravi « annonce : » Nous partons demain!", "Ravi annonce ; Nous partons demain! :"], PUNCT_HINT],
  ["Quelle phrase est bien ponctuée?", "J'apporte trois fruits : une pomme, une poire et une orange.", ["J'apporte trois fruits « une pomme, une poire et une orange. »", "J'apporte (trois fruits : une pomme) une poire et une orange.", "J'apporte trois fruits, : une pomme, une poire et une orange."], PUNCT_HINT],
  ["Quelle phrase est bien ponctuée?", "Ma tante (la sœur de mon père) habite à Calgary.", ["Ma tante « la sœur de mon père » habite à Calgary.", "Ma tante : la sœur de mon père habite à Calgary.", "Ma tante (la sœur de mon père. habite à Calgary."], PUNCT_HINT],
  ["Quelle phrase est bien ponctuée?", "L'enseignant dit : « Ouvrez vos livres. »", ["L'enseignant dit « Ouvrez : vos livres ».", "L'enseignant (dit Ouvrez vos livres).", "L'enseignant dit ; « Ouvrez vos livres, »"], PUNCT_HINT],
  ["Quelle phrase est bien ponctuée?", "Il y a deux saisons que j'aime : l'été et l'automne.", ["Il y a deux saisons : que j'aime l'été et l'automne.", "Il y a : deux saisons que j'aime l'été et l'automne.", "Il y a deux saisons « que j'aime l'été et l'automne »."], PUNCT_HINT],
  ["Quelle phrase est bien ponctuée?", "Ana chuchote : « Chut, le bébé dort. »", ["Ana chuchote « : Chut, le bébé dort. »", "Ana (chuchote : Chut, le bébé dort.)", "Ana chuchote ; Chut « le bébé dort »."], PUNCT_HINT],
  ["Où faut-il mettre les guillemets? Noé répond : Je suis là.", "Noé répond : « Je suis là. »", ["« Noé » répond : Je suis là.", "Noé répond : Je « suis » là."], PUNCT_HINT],
  ["Où faut-il mettre les parenthèses? Mon cousin Amir il a douze ans habite à Ottawa.", "Mon cousin Amir (il a douze ans) habite à Ottawa.", ["Mon cousin (Amir il a douze ans) habite à Ottawa.", "Mon (cousin) Amir il a douze ans habite à Ottawa."], PUNCT_HINT],
];

// ---------- La bande dessinée ----------

const BD_HINT = "A comic book (bande dessinée, or BD) tells a story with panels (cases), speech bubbles (bulles) and sound words (onomatopées).";

const COMICS: FrItem[] = [
  ["Que contient une bulle dans une BD?", "Les paroles d'un personnage", ["Le titre de la BD", "Le nom de l'auteur"], BD_HINT, "💬"],
  ["Qu'est-ce qu'une case?", "Un dessin encadré qui montre un moment", ["Une bulle de pensée", "Le titre d'un chapitre"], BD_HINT, "🖼️"],
  ["Qu'est-ce qu'une onomatopée?", "Un mot qui imite un bruit", ["Un mot très long", "Le nom d'un personnage"], BD_HINT, "💥"],
  ["Quel mot est une onomatopée?", "Boum!", ["Bonjour", "Demain"], BD_HINT, "💥"],
  ["Quel mot est une onomatopée?", "Splash!", ["Soleil", "Aujourd'hui"], BD_HINT, "💦"],
  ["Une bulle en forme de nuage avec de petits ronds montre…", "ce que le personnage pense", ["ce que le personnage crie", "le bruit d'un objet"], "Round, cloud-shaped bubbles show thoughts. Pointed bubbles show speech.", "💭"],
  ["Dans une BD, les dessins et les mots…", "racontent l'histoire ensemble", ["sont toujours inutiles", "n'ont aucun lien"], "In a comic book the images and the text work together to tell the story.", "📖"],
  ["Une bulle avec des pointes très marquées montre souvent…", "que le personnage crie", ["que le personnage dort", "que le personnage pense"], BD_HINT, "😲"],
  ["La personnification, c'est…", "donner des qualités humaines à un animal ou un objet", ["décrire un paysage", "compter les cases"], "A talking cat or a smiling sun is personification.", "🐱"],
  ["Pour lire une BD, on lit les cases…", "dans l'ordre, de gauche à droite et de haut en bas", ["de bas en haut", "au hasard"], "Follow the panels in order, like reading text.", "➡️"],
  ["Que contient un cartouche dans une BD?", "Le texte du narrateur", ["La voix d'un personnage", "Le bruit d'un objet"], "A cartouche is the rectangle of text, often at the top of a panel, where the narrator explains what is happening.", "📝"],
  ["Quel mot est une onomatopée?", "Crac!", ["Maison", "Hier"], BD_HINT, "💥"],
  ["Quel mot est une onomatopée?", "Vroum!", ["Chapeau", "Lundi"], BD_HINT, "🚗"],
  ["Quel mot est une onomatopée?", "Plouf!", ["Tableau", "Souvent"], BD_HINT, "💧"],
  ["Quel mot est une onomatopée?", "Toc toc!", ["Jardin", "Heureux"], BD_HINT, "🚪"],
  ["Que veut dire « Aïe! » dans une bulle?", "Le personnage a mal", ["Le personnage rit", "Le personnage dort"], BD_HINT, "🤕"],
  ["Que montre un « ? » au-dessus de la tête d'un personnage?", "Il ne comprend pas", ["Il est content", "Il dort"], "Symbols above a character's head show feelings: ? = confused, ! = surprised.", "❓"],
  ["Un « ! » au-dessus de la tête d'un personnage montre…", "la surprise", ["la faim", "le sommeil"], "Symbols above a character's head show feelings: ? = confused, ! = surprised.", "❗"],
  ["Des lignes autour d'un personnage qui court montrent…", "le mouvement", ["le froid", "la nuit"], "Speed lines show that something is moving fast.", "🏃"],
  ["Une case plus grande que les autres sert souvent à…", "mettre un moment important en valeur", ["cacher l'histoire", "compter les pages"], BD_HINT, "🖼️"],
  ["Dans une BD, l'espace blanc entre deux cases s'appelle…", "la gouttière", ["la bulle", "la couverture"], "The gutter is the blank space between panels. It gives readers a pause between moments.", "⬜"],
  ["Qui dessine une BD?", "Un dessinateur ou une dessinatrice", ["Un boulanger", "Un pilote"], BD_HINT, "✏️"],
  ["Dans une BD, les couleurs peuvent montrer…", "l'ambiance ou les émotions", ["le prix du livre", "le nom de l'auteur"], "Warm colours can feel happy; dark colours can feel gloomy or mysterious.", "🎨"],
  ["Un ours qui parle et s'habille comme un humain est un exemple de…", "personnification", ["onomatopée", "bulle"], "Giving human qualities to an animal or an object is personification.", "🐻"],
  ["Pour parler à voix basse, la bulle est parfois…", "en pointillés ou plus petite", ["en forme de cœur", "complètement noire"], "A dashed or small bubble often means a whisper.", "🤫"],
  ["Par quelle case commence-t-on la lecture d'une BD?", "Par la case en haut à gauche", ["Par la case en bas à droite", "Par une case au hasard"], "Start at the top left and follow the panels in order.", "➡️"],
];

// ---------- La biographie ----------

const BIO_HINT = "A biography tells the true story of a real person's life, usually in the third person, with dates, places and sources.";

const BIOGRAPHY: FrItem[] = [
  ["Une biographie raconte…", "la vie d'une personne réelle", ["une histoire inventée", "une recette"], BIO_HINT, "📚"],
  ["Une autobiographie est écrite par…", "la personne elle-même", ["un voisin", "un robot"], "“Auto-” means oneself: the person tells their own life.", "✍️"],
  ["Dans une biographie, l'auteur écrit le plus souvent…", "à la troisième personne (il, elle)", ["à la deuxième personne (tu)", "avec des onomatopées"], BIO_HINT, "👤"],
  ["Où trouve-t-on la liste des sources d'un texte?", "Dans la bibliographie", ["Dans la bulle", "Dans le titre"], "A bibliography lists the books and websites the author used.", "🔎"],
  ["Pourquoi un auteur ajoute-t-il des dates dans une biographie?", "Pour situer les événements dans le temps", ["Pour faire rimer le texte", "Pour ajouter des bruits"], BIO_HINT, "📅"],
  ["Pourquoi utilise-t-on des guillemets pour une citation?", "Pour montrer les mots exacts de la personne", ["Pour décorer", "Pour montrer un bruit"], "Quotation marks show the person's exact words.", "💬"],
  ["Quel texte est une biographie?", "La vie d'une inventrice, de sa naissance à ses grandes découvertes", ["Un chat qui voyage sur la Lune", "Les étapes pour faire un gâteau"], BIO_HINT],
  ["Une biographie est organisée…", "en ordre chronologique", ["en ordre alphabétique", "au hasard"], "Chronological order follows time from the earliest event to the latest.", "⏳"],
  ["Quelle phrase est écrite à la troisième personne?", "Elle est née à Winnipeg en 1990.", ["Je suis née à Winnipeg en 1990.", "Tu es née à Winnipeg en 1990."], BIO_HINT, "👤"],
  ["Quelle phrase est écrite à la première personne, comme dans une autobiographie?", "Je suis né dans un petit village.", ["Il est né dans un petit village.", "Ils sont nés dans un petit village."], "In an autobiography the person says “je” because they tell their own life.", "✍️"],
  ["Quelle information trouve-t-on dans une biographie?", "La date de naissance de la personne", ["Une recette de gâteau", "Les règles d'un jeu"], BIO_HINT, "🎂"],
  ["Que fait l'auteur d'une biographie avant d'écrire?", "Il cherche des informations dans plusieurs sources", ["Il invente des aventures", "Il copie un autre texte"], BIO_HINT, "🔎"],
  ["Quel texte est une autobiographie?", "« J'ai grandi près de la mer et j'adorais nager. »", ["« Elle a grandi près de la mer. »", "« Les poissons vivent dans la mer. »"], "An autobiography is told by the person, with “je”.", "🌊"],
  ["Quel mot aide à suivre l'ordre du temps dans une biographie?", "ensuite", ["parce que", "mais"], "Words like d'abord, ensuite, puis and enfin show the order of events.", "⏳"],
  ["Pourquoi ajoute-t-on une photo dans une biographie?", "Pour montrer la personne ou un moment de sa vie", ["Pour cacher le texte", "Pour faire un jeu"], BIO_HINT, "📷"],
  ["Quel temps de verbe est le plus souvent utilisé pour raconter la vie d'une personne du passé?", "Le passé (il a vécu, il était)", ["Le futur (il vivra)", "Le présent (il vit)"], BIO_HINT, "🕰️"],
  ["Quelle phrase est un fait vérifiable dans une biographie?", "Elle a reçu un prix en 2015.", ["C'était la personne la plus gentille du monde.", "Tout le monde l'adorait sans doute."], "A fact can be checked in a source. A feeling or guess cannot.", "🏅"],
  ["Que montre une ligne du temps?", "Les événements de la vie dans l'ordre", ["Les mots difficiles", "Les personnages d'une BD"], "A timeline places events in order from the earliest to the latest.", "📅"],
  ["Une biographie peut aussi contenir…", "des citations de la personne", ["des onomatopées", "des recettes"], BIO_HINT, "💬"],
  ["Dans une biographie, de qui parle-t-on?", "D'une personne réelle", ["D'un personnage inventé", "D'un animal qui parle"], BIO_HINT, "🧑"],
  ["Pourquoi lire une biographie?", "Pour connaître la vie de personnes importantes", ["Pour apprendre à compter", "Pour jouer à un jeu"], BIO_HINT, "📚"],
  ["Pourquoi les sources sont-elles utiles?", "Elles prouvent que les informations sont vraies", ["Elles rendent le texte plus long", "Elles servent à décorer"], "Sources let readers check where the facts came from.", "🔗"],
  ["Comment appelle-t-on le récit de sa propre vie?", "Une autobiographie", ["Une biographie", "Une bande dessinée"], "“Auto-” means oneself.", "📖"],
];

const BIO_ORDERS = [
  ["Naissance de la personne", "Premières études", "Premier emploi", "Grande réussite", "Retraite"],
];

function biographies(opts?: GenerateOptions): Question[] {
  return [...frQuestions(BIOGRAPHY, opts, 7, FR), frOrder("Remets les étapes de la vie dans l'ordre.", "A biography follows time: birth first, then school, work and later years.", BIO_ORDERS[0], FR)];
}

// ---------- Fait ou opinion ----------

const FACT = "Objective (un fait)";
const OPINION = "Subjective (une opinion)";
const OBJ_HINT = "An objective sentence gives a fact you can check. A subjective sentence gives a feeling or opinion, with words like “meilleur”, “beau” or “ennuyeux”.";

const OBJECTIVITY: FrItem[] = [
  ["Cette phrase est-elle objective ou subjective? « L'eau gèle à 0 °C. »", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Le chocolat est le meilleur dessert. »", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Il y a sept jours dans une semaine. »", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Ce film est trop long. »", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Le Canada a dix provinces. »", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « L'hiver est une saison ennuyeuse. »", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Le français est une belle langue. »", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Une araignée a huit pattes. »", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Les chiens sont plus gentils que les chats. »", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « La Terre tourne autour du Soleil. »", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Un triangle a trois côtés. »", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Ottawa est la capitale du Canada. »", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Le soleil se lève à l'est. »", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Un kilomètre contient mille mètres. »", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Les baleines sont des mammifères. »", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Février est le deuxième mois de l'année. »", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Le hockey est le sport le plus excitant. »", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Cette musique est affreuse. »", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Les mathématiques sont trop difficiles. »", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Le printemps est la plus belle saison. »", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Ce gâteau est délicieux. »", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Les bandes dessinées sont plus amusantes que les romans. »", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Courir le matin est ennuyeux. »", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Un carré a quatre côtés égaux. »", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Le Pacifique est un océan.»", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Un jour compte vingt-quatre heures.»", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « L'oxygène est un gaz que nous respirons.»", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Le Canada a trois océans sur ses côtes.»", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Un hexagone a six côtés.»", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Le Yukon est un territoire canadien.»", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Les oiseaux pondent des œufs.»", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Le cœur pompe le sang dans le corps.»", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Un siècle compte cent ans.»", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « La glace fond quand il fait chaud.»", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Le Saint-Laurent est un fleuve.»", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Un adulte a trente-deux dents.»", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Le mot chat a quatre lettres.»", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Le Manitoba est à l'ouest de l'Ontario.»", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « La Lune tourne autour de la Terre.»", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Les abeilles produisent du miel.»", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Il y a douze mois dans une année.»", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Le thermomètre mesure la température.»", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « La Colombie-Britannique borde l'océan Pacifique.»", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Un litre contient mille millilitres.»", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Les plantes ont besoin de lumière pour grandir.»", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Le Nunavut est le plus grand territoire du Canada.»", FACT, [OPINION], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Les films d'aventure sont les plus passionnants.»", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Le vert est la plus jolie couleur.»", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Les devoirs sont toujours ennuyeux.»", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Cette chanson est la meilleure de l'année.»", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « La poutine est le meilleur repas du monde.»", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Les chats sont des animaux trop paresseux.»", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Jouer dehors est plus amusant que jouer dedans.»", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Ce livre est vraiment trop triste.»", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « L'été est la saison la plus agréable.»", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « La classe d'art est la plus intéressante de l'école.»", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Ce dessin animé est ridicule.»", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Le soccer est plus facile que le basketball.»", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Les mathématiques sont la matière la plus utile.»", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Cette pièce de théâtre est magnifique.»", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Il fait trop chaud dans cette classe.»", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Les légumes sont dégoûtants.»", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Ce jeu vidéo est très difficile à comprendre.»", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Les montagnes sont plus belles que la mer.»", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Mon voisin est un très bon cuisinier.»", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Ce parc est le plus joli de la ville.»", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « Lire avant de dormir est une excellente habitude.»", OPINION, [FACT], OBJ_HINT],
  ["Cette phrase est-elle objective ou subjective? « La soupe aux pois est trop salée.»", OPINION, [FACT], OBJ_HINT],
];

export const course: Course = {
  grade: "5",
  subject: "immersion",
  bigIdeas: {
    "ca-bc": [
      "Interactions with other people reveal their varied perspectives and thus expose human diversity.",
      "Fiction presents sociocultural and historical elements that have been adapted and shaped by the author.",
      "Looking for information in multiple sources provides different points of view and enriches knowledge and vocabulary.",
      "The interpretation of a text depends as much on its structure and visual presentation as on its content.",
    ],
  },
  units: [
    {
      id: "pronoms-relatifs",
      title: "Qui, que, où, dont",
      emoji: "🔗",
      blurb: "Les pronoms relatifs",
      parentNote: "Using the simple relative pronouns qui, que, où and dont to join two ideas in one sentence.",
      standards: { "ca-bc": "Language elements: simple relative pronouns (qui, que, quoi, dont, où)" },
      generate: (o) => frQuestions(RELATIVES, o, 8, FR),
    },
    {
      id: "negation",
      title: "Ne… plus, jamais, rien",
      emoji: "🚫",
      blurb: "La négation",
      parentNote: "Negative forms ne… plus, ne… jamais and ne… rien, and where each word goes in the sentence.",
      standards: { "ca-bc": "Language elements: negation (ne… plus, ne… jamais, ne… rien)" },
      generate: (o) => frQuestions(NEGATION, o, 8, FR),
    },
    {
      id: "adverbes",
      title: "Les adverbes",
      emoji: "⏱️",
      blurb: "Temps, lieu, manière",
      parentNote: "Adverbs of time, place, manner and quantity, and what each one tells us about the action.",
      standards: { "ca-bc": "Language elements: adverbs of time, place, manner and quantity" },
      generate: (o) => frQuestions(ADVERB_TYPES, o, 8, FR),
    },
    {
      id: "ponctuation",
      title: "La ponctuation",
      emoji: "❝",
      blurb: "Guillemets et deux-points",
      parentNote: "Quotation marks, the colon and parentheses used correctly in French.",
      standards: { "ca-bc": "Text organization: punctuation (quotation marks, colon and parentheses)" },
      generate: (o) => frQuestions(PUNCTUATION, o, 8, FR),
    },
    {
      id: "bande-dessinee",
      title: "La bande dessinée",
      emoji: "💬",
      blurb: "Cases, bulles, onomatopées",
      parentNote: "The features of a comic book: panels, speech and thought bubbles, sound words and how pictures and text work together.",
      standards: { "ca-bc": "Literary elements: characteristics of the comic book (panels, dialogue, text/image relationship, onomatopoeia, personification)" },
      generate: (o) => frQuestions(COMICS, o, 8, FR),
    },
    {
      id: "biographie",
      title: "La biographie",
      emoji: "🧑‍🔬",
      blurb: "Raconter une vie",
      parentNote: "Features of a biography: point of view, dates, quotations, sources and chronological order.",
      standards: { "ca-bc": "Literary elements: characteristics of the biography; chronological organization; bibliographies" },
      generate: biographies,
    },
    {
      id: "fait-ou-opinion",
      title: "Fait ou opinion?",
      emoji: "⚖️",
      blurb: "Objectif ou subjectif",
      parentNote: "Telling an objective statement (a fact) from a subjective one (an opinion), an early critical-thinking skill.",
      standards: { "ca-bc": "Distinguish objectivity from subjectivity in a text" },
      generate: (o) => frQuestions(OBJECTIVITY, o, 8, FR),
    },
  ],
};
