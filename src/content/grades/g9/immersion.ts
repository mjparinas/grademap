import { frQuestions, type FrItem } from "../../french";
import type { Course } from "../../types";

const FR = { lang: "fr" } as const;

// ---------- Registres de langue et exposé oral ----------

const REG_HINT = "Familier : entre amis. Courant : tous les jours. Soutenu : raffiné ou littéraire.";

const REGISTERS: FrItem[] = [
  ["Quel registre de langue est utilisé? « Ché pas où est ton bouquin. »", "Familier", ["Courant", "Soutenu"], REG_HINT],
  ["Quel registre de langue est utilisé? « Je ne sais pas où est ton livre. »", "Courant", ["Familier", "Soutenu"], REG_HINT],
  ["Quel registre de langue est utilisé? « Je ne sais point où est placé votre ouvrage. »", "Soutenu", ["Familier", "Courant"], REG_HINT],
  ["Quel registre de langue est utilisé? « Il fait un froid de canard! »", "Familier", ["Courant", "Soutenu"], REG_HINT],
  ["Quel registre de langue est utilisé? « Il fait très froid aujourd'hui. »", "Courant", ["Familier", "Soutenu"], REG_HINT],
  ["Quel registre de langue est utilisé? « Le froid est saisissant en cette matinée. »", "Soutenu", ["Familier", "Courant"], REG_HINT],
  ["Pour un exposé devant la classe, quel registre est le plus approprié?", "Courant", ["Familier", "De l'argot"], "Devant un auditoire, on choisit une langue claire et correcte."],
  ["Quelle phrase est écrite en langue soutenue?", "Je vous prie de bien vouloir m'excuser.", ["Désolé, hein!", "Excuse-moi."], REG_HINT],
  ["Quelle intention a un orateur qui clarifie un mot difficile?", "Se faire mieux comprendre", ["Faire rire l'auditoire", "Raccourcir l'exposé"], "Clarifier, c'est rendre plus clair. Expliquer, c'est donner des détails ou un exemple."],
  ["Que fait un orateur qui donne un exemple pour appuyer son idée?", "Il explique", ["Il change de sujet", "Il conclut"], "Un exemple sert à expliquer une idée."],
  ["Dans l'organisation d'un exposé, que présente l'introduction?", "Le sujet et l'intention", ["Tous les arguments", "Les remerciements seulement"], "L'introduction annonce le sujet; le développement le détaille; la conclusion le résume."],
  ["Quel registre de langue est utilisé? « Ce film est trop nul! »", "Familier", ["Courant", "Soutenu"], REG_HINT],
  ["Quel registre de langue est utilisé? « Ce film est très ennuyeux. »", "Courant", ["Familier", "Soutenu"], REG_HINT],
  ["Quel registre de langue est utilisé? « Ce film est d'un ennui profond. »", "Soutenu", ["Familier", "Courant"], REG_HINT],
  ["Quel registre de langue est utilisé? « Mon vieux m'a engueulé. »", "Familier", ["Courant", "Soutenu"], REG_HINT],
  ["Quel registre de langue est utilisé? « Mon père m'a grondé. »", "Courant", ["Familier", "Soutenu"], REG_HINT],
  ["Quel registre de langue est utilisé? « Mon père m'a réprimandé. »", "Soutenu", ["Familier", "Courant"], REG_HINT],
  ["Quel registre de langue est utilisé? « On bouffe à midi? »", "Familier", ["Courant", "Soutenu"], REG_HINT],
  ["Quel registre de langue est utilisé? « On mange à midi? »", "Courant", ["Familier", "Soutenu"], REG_HINT],
  ["Quel registre de langue est utilisé? « Prendrons-nous notre repas à midi? »", "Soutenu", ["Familier", "Courant"], REG_HINT],
  ["Comment dit-on « fatigué » en langue familière?", "crevé", ["épuisé", "exténué"], "Crevé est un mot familier pour fatigué."],
  ["Comment dit-on « manger » en langue familière?", "bouffer", ["se nourrir", "se restaurer"], "Bouffer est un mot familier pour manger."],
  ["Quel registre choisir pour une entrevue d'emploi?", "Courant ou soutenu", ["Familier", "De l'argot"], REG_HINT],
  ["Pourquoi un orateur fait-il une pause avant son idée principale?", "Pour attirer l'attention de l'auditoire", ["Pour oublier son texte", "Pour terminer plus vite"], "Une pause bien placée met une idée en valeur."],
  ["Dans l'organisation d'un exposé, où présente-t-on le résumé des idées?", "Dans la conclusion", ["Dans l'introduction", "Dans le titre"], "L'introduction annonce le sujet; le développement le détaille; la conclusion le résume."],
  ["Quelle intention a un orateur qui présente des faits sur les volcans?", "Informer", ["Convaincre", "Divertir"], "On parle pour informer, convaincre ou divertir."],
  ["Quelle intention a un orateur qui défend l'idée de planter plus d'arbres?", "Convaincre", ["Divertir", "Raconter une blague"], "On parle pour informer, convaincre ou divertir."],
  ["Quelle partie d'un exposé présente les idées principales?", "Le développement", ["L'introduction", "La conclusion"], "L'introduction annonce le sujet; le développement le détaille; la conclusion le résume."],
  ["Pour un exposé devant la direction de l'école, quelle phrase convient le mieux?", "Bonjour, je vous remercie de m'accueillir.", ["Salut! Ça roule?", "Yo, écoutez ça!"], REG_HINT],
];

// ---------- La fable ----------

const FABLE = {
  type: "passage" as const,
  title: "Le renard et le héron",
  paragraphs: [
    "Un jour, un renard invita un héron à dîner. Il servit une soupe claire dans une assiette plate et se mit à rire en voyant le héron, dont le long bec ne pouvait rien boire.",
    "Quelques jours plus tard, le héron invita le renard à son tour. Il servit un délicieux ragoût dans une bouteille au col étroit. Le renard ne put goûter à rien.",
    "Le renard comprit alors que celui qui se moque des autres risque d'être moqué à son tour.",
  ],
};

const FABLE_PEACOCK = {
  type: "passage" as const,
  title: "Le paon et le moineau",
  paragraphs: [
    "Un paon se promenait fièrement dans le jardin en déployant sa queue brillante. « Regarde comme je suis beau! disait-il au moineau, qui picorait des graines. Toi, tu es si petit et si gris. »",
    "Un jour, le vent se leva et un orage éclata. Le paon, avec sa lourde queue, ne put pas s'envoler pour se cacher et il resta trempé au milieu du jardin. Le petit moineau, lui, se réfugia sans peine dans un buisson.",
    "Le paon baissa la tête, honteux. Il comprit que les belles apparences ne valent pas toujours les qualités utiles.",
  ],
};

const FABLE_BEAVER = {
  type: "passage" as const,
  title: "Le castor et le lièvre",
  paragraphs: [
    "Un lièvre se moquait d'un castor qui travaillait tout l'été à construire sa hutte. « Pourquoi tant d'efforts? disait-il. Viens plutôt courir avec moi! » Le castor continuait à empiler ses branches sans répondre.",
    "Quand l'hiver arriva, la rivière gela et la neige couvrit les champs. Le lièvre, grelottant, frappa à la porte du castor. Celui-ci, bon, le laissa entrer et lui servit une tisane chaude.",
    "« Les efforts d'aujourd'hui préparent le confort de demain », dit simplement le castor.",
  ],
};

const FABLE_HINT = "Une fable est un court récit avec des animaux qui agissent comme des humains. Elle se termine par une morale, un enseignement.";

const FABLES: FrItem[] = [
  ["Quelle est la morale de cette fable?", "Celui qui se moque des autres risque d'être moqué", ["Il faut toujours manger de la soupe", "Les hérons sont plus rusés que les renards"], FABLE_HINT, FABLE],
  ["Qu'est-ce qui rend les animaux de cette fable semblables aux humains?", "Ils invitent à dîner et se moquent", ["Ils vivent dans la forêt", "Ils ont un long bec"], FABLE_HINT, FABLE],
  ["Pourquoi le héron ne peut-il pas boire la soupe?", "Son bec est long et l'assiette est plate", ["Il n'a pas faim", "La soupe est trop chaude"], FABLE_HINT, FABLE],
  ["Pourquoi le renard ne peut-il pas goûter au ragoût?", "Le col de la bouteille est trop étroit", ["Il n'aime pas le ragoût", "Le ragoût est brûlé"], FABLE_HINT, FABLE],
  ["Où trouve-t-on généralement la morale d'une fable?", "À la fin", ["Au début seulement", "Dans le titre"], FABLE_HINT],
  ["Que signifie le sens propre d'un mot?", "Son sens exact, dans le dictionnaire", ["Un sens imagé", "Un sens caché"], "Le sens propre est le sens réel. Le sens figuré est une image : « avoir un cœur de pierre »."],
  ["« Il a un cœur de pierre. » Quel est le sens figuré?", "Il est sans pitié", ["Son cœur est lourd", "Il aime les cailloux"], "Le sens figuré est une image qui ne se prend pas à la lettre."],
  ["Quelles coutumes une fable peut-elle montrer?", "Les manières et les valeurs d'une époque", ["Seulement la météo", "Seulement des chiffres"], "Une fable reflète souvent les mœurs (manières de vivre) de son époque."],
  ["Quelle est la morale de cette fable?", "Les belles apparences ne valent pas toujours les qualités utiles", ["Il faut toujours se cacher dans un buisson", "Les moineaux sont plus fiers que les paons"], FABLE_HINT, FABLE_PEACOCK],
  ["Quel défaut le paon montre-t-il au début?", "La vanité (il est fier de son apparence)", ["La paresse", "La peur"], FABLE_HINT, FABLE_PEACOCK],
  ["Pourquoi le paon ne peut-il pas se cacher de l'orage?", "Sa queue est lourde", ["Il est trop petit", "Il dort"], FABLE_HINT, FABLE_PEACOCK],
  ["Qu'est-ce qui rend les animaux de cette fable semblables aux humains?", "Ils se parlent et se jugent", ["Ils vivent dans un jardin", "Ils ont des plumes"], FABLE_HINT, FABLE_PEACOCK],
  ["Comment réagit le moineau à l'orage?", "Il se réfugie dans un buisson", ["Il se moque du paon", "Il quitte le pays"], FABLE_HINT, FABLE_PEACOCK],
  ["Que ressent le paon à la fin?", "De la honte", ["De la joie", "De l'ennui"], FABLE_HINT, FABLE_PEACOCK],
  ["Quelle valeur la fable met-elle en avant?", "L'humilité", ["L'orgueil", "La vitesse"], FABLE_HINT, FABLE_PEACOCK],
  ["Quelle est la morale de cette fable?", "Les efforts d'aujourd'hui préparent le confort de demain", ["Il faut toujours courir vite", "L'hiver est la plus belle saison"], FABLE_HINT, FABLE_BEAVER],
  ["Quel défaut le lièvre montre-t-il?", "La paresse (il ne se prépare pas)", ["La générosité", "L'honnêteté"], FABLE_HINT, FABLE_BEAVER],
  ["Quelle qualité le castor montre-t-il à la fin?", "La bonté (il accueille le lièvre)", ["L'avarice", "La ruse"], FABLE_HINT, FABLE_BEAVER],
  ["Pourquoi le lièvre frappe-t-il à la porte du castor?", "Il a froid", ["Il veut jouer", "Il apporte du bois"], FABLE_HINT, FABLE_BEAVER],
  ["Quel indice montre que la scène se passe en hiver?", "La rivière gèle et la neige couvre les champs", ["Le castor empile des branches", "Le lièvre court"], FABLE_HINT, FABLE_BEAVER],
  ["Que fait le castor quand le lièvre se moque de lui?", "Il continue à travailler", ["Il le chasse", "Il court avec lui"], FABLE_HINT, FABLE_BEAVER],
  ["Que représente le castor dans cette fable?", "Une personne travaillante qui pense à l'avenir", ["Un chasseur", "Un animal sauvage seulement"], FABLE_HINT, FABLE_BEAVER],
  ["« Il a un chat dans la gorge. » Quel est le sens figuré?", "Il a la voix enrouée", ["Il possède un chat", "Il a mal au ventre"], "Le sens figuré est une image qui ne se prend pas à la lettre."],
  ["« Il pleut des cordes. » Quel est le sens figuré?", "Il pleut très fort", ["Des cordes tombent du ciel", "Il neige"], "Le sens figuré est une image qui ne se prend pas à la lettre."],
  ["« Elle a un cœur d'or. » Quel est le sens figuré?", "Elle est très généreuse", ["Son cœur est jaune", "Elle est riche"], "Le sens figuré est une image qui ne se prend pas à la lettre."],
  ["Pourquoi les fables mettent-elles en scène des animaux?", "Pour parler des qualités et des défauts humains avec humour", ["Parce que les humains n'existent pas", "Pour enseigner la zoologie"], FABLE_HINT],
  ["Qu'est-ce qu'une morale?", "Un enseignement tiré de l'histoire", ["Un personnage", "Un lieu"], FABLE_HINT],
  ["Une fable est un récit…", "court, avec une morale", ["très long, sans morale", "écrit sans personnages"], FABLE_HINT],
];

// ---------- Le roman et les personnages ----------

const ROMAN: FrItem[] = [
  ["Qui raconte l'histoire quand on lit « Je suis entrée dans la grotte »?", "Le personnage lui-même", ["Un narrateur absent", "L'auteur au hasard"], "Avec « je », le narrateur est un personnage de l'histoire (point de vue interne)."],
  ["Dans « Elle entra dans la grotte », qui raconte?", "Un narrateur qui n'est pas dans l'histoire", ["Le personnage lui-même", "Le lecteur"], "Avec « il » ou « elle », le narrateur raconte de l'extérieur."],
  ["Qu'est-ce que le cadre spatio-temporel d'un roman?", "Le lieu et l'époque de l'histoire", ["La liste des personnages", "La couverture du livre"], "Le cadre répond à : où? et quand?"],
  ["Quel est le rôle du héros?", "Il est le personnage principal", ["Il écrit le livre", "Il est toujours le méchant"], "Le héros porte l'histoire. L'opposant essaie de l'arrêter."],
  ["Quel est le rôle de l'opposant?", "Il nuit au héros", ["Il aide le héros", "Il raconte l'histoire"], "L'opposant crée des obstacles. L'adjuvant aide le héros."],
  ["Quel est le rôle de l'adjuvant?", "Il aide le héros", ["Il nuit au héros", "Il change l'époque"], "Adjuvant vient de « aider »."],
  ["« Léa a les cheveux roux et de grands yeux verts. » Quel portrait est-ce?", "Un portrait physique", ["Un portrait psychologique", "Un portrait sonore"], "Physique : le corps. Psychologique : les sentiments et les valeurs."],
  ["« Léa est courageuse et toujours honnête. » Quel portrait est-ce?", "Un portrait psychologique", ["Un portrait physique", "Un portrait sonore"], "Psychologique : le caractère, les sentiments et les valeurs."],
  ["Un personnage rend toujours ce qu'il emprunte et dit la vérité. Quelle valeur montre-t-il?", "L'honnêteté", ["L'avarice", "La paresse"], "Les actions d'un personnage révèlent ses valeurs."],
  ["Quel indice aide à comprendre la personnalité d'un personnage?", "Ses actions et ses paroles", ["Le nombre de pages", "La couleur de la couverture"], "Ce qu'il fait et ce qu'il dit montre qui il est."],
  ["Dans « Nous avons marché toute la nuit », qui raconte?", "Un personnage qui fait partie de l'histoire", ["Un narrateur absent", "Le lecteur"], "Avec « je » ou « nous », le narrateur est dans l'histoire."],
  ["Qu'est-ce qu'un narrateur omniscient?", "Un narrateur qui connaît les pensées de tous les personnages", ["Un narrateur qui ne parle jamais", "Un personnage qui dort"], "Omniscient veut dire « qui sait tout »."],
  ["Quel est le cadre spatial d'un roman?", "Le lieu où se passe l'action", ["L'époque", "Le nom de l'éditeur"], "Le cadre répond à : où? et quand?"],
  ["Quel est le cadre temporel d'un roman?", "Le moment ou l'époque de l'action", ["Le lieu", "Le nombre de chapitres"], "Le cadre répond à : où? et quand?"],
  ["« Il y a longtemps, dans un village de pêcheurs... » Que décrit cette phrase?", "Le cadre spatio-temporel", ["Le portrait du héros", "La morale"], "Le cadre répond à : où? et quand?"],
  ["« Samir a les épaules larges et une petite cicatrice au menton. » Quel portrait est-ce?", "Un portrait physique", ["Un portrait psychologique", "Un portrait sonore"], "Physique : le corps. Psychologique : les sentiments et les valeurs."],
  ["« Samir est timide, mais très loyal envers ses amis. » Quel portrait est-ce?", "Un portrait psychologique", ["Un portrait physique", "Un portrait sonore"], "Psychologique : le caractère, les sentiments et les valeurs."],
  ["Un personnage partage toujours sa collation avec ses camarades. Quelle valeur montre-t-il?", "La générosité", ["L'avarice", "La jalousie"], "Les actions d'un personnage révèlent ses valeurs."],
  ["Un personnage ne laisse jamais tomber ses amis, même dans le danger. Quelle valeur montre-t-il?", "La loyauté", ["La trahison", "La paresse"], "Les actions d'un personnage révèlent ses valeurs."],
  ["Un personnage dit toujours la vérité, même quand c'est difficile. Quelle valeur montre-t-il?", "L'honnêteté", ["La vantardise", "La jalousie"], "Les actions d'un personnage révèlent ses valeurs."],
  ["Un personnage change d'avis grâce à un ami. Que peut-on dire de lui?", "Il évolue au cours de l'histoire", ["Il ne change jamais", "Il n'existe pas"], "Un personnage évolue quand ses idées ou son comportement changent."],
  ["Qu'est-ce qu'un chapitre?", "Une grande partie d'un roman", ["Un personnage", "Une phrase"], "Un roman est souvent divisé en chapitres."],
  ["Quelle différence y a-t-il entre l'auteur et le narrateur?", "L'auteur écrit le livre; le narrateur raconte l'histoire", ["Il n'y en a aucune", "Le narrateur imprime le livre"], "L'auteur est une personne réelle. Le narrateur est la voix qui raconte."],
  ["Qu'est-ce qu'un point de vue interne?", "On voit l'histoire par les yeux d'un personnage", ["On voit l'histoire de loin, sans entrer dans les pensées", "On ne lit que les dialogues"], "Avec « je », le narrateur est un personnage de l'histoire (point de vue interne)."],
  ["Un dragon attaque le village de l'héroïne. Quel est son rôle?", "L'opposant", ["L'adjuvant", "Le narrateur"], "L'opposant crée des obstacles. L'adjuvant aide le héros."],
  ["Un vieux marin donne une carte à l'héroïne pour l'aider. Quel est son rôle?", "L'adjuvant", ["L'opposant", "Le narrateur"], "L'opposant crée des obstacles. L'adjuvant aide le héros."],
];

// ---------- Figures de style ----------

const STYLE_HINT = "Personnification : une chose agit comme une personne. Métaphore : une image sans « comme ». Comparaison : avec « comme ». Hyperbole : une exagération. Allitération : le même son répété.";

const STYLES: FrItem[] = [
  ["« Le vent murmure dans les arbres. » Quelle figure de style est-ce?", "Une personnification", ["Une hyperbole", "Une allitération"], STYLE_HINT],
  ["« Cet enfant est un vrai soleil. » Quelle figure de style est-ce?", "Une métaphore", ["Une comparaison", "Une allitération"], STYLE_HINT],
  ["« Elle court comme un lièvre. » Quelle figure de style est-ce?", "Une comparaison", ["Une métaphore", "Une personnification"], STYLE_HINT],
  ["« J'ai mille choses à faire! » Quelle figure de style est-ce?", "Une hyperbole", ["Une comparaison", "Une personnification"], STYLE_HINT],
  ["« Pour qui sont ces serpents qui sifflent sur vos têtes? » Quelle figure de style est-ce?", "Une allitération", ["Une métaphore", "Une hyperbole"], "Le son « s » est répété plusieurs fois."],
  ["« La lune sourit à la ville. » Quelle figure de style est-ce?", "Une personnification", ["Une comparaison", "Une hyperbole"], STYLE_HINT],
  ["Quel mot signale une comparaison?", "comme", ["parce que", "mais"], "Une comparaison relie deux choses avec comme, tel, pareil à…"],
  ["Quelle phrase contient une métaphore?", "Ses yeux sont deux étoiles.", ["Ses yeux brillent comme des étoiles.", "Elle a les yeux bleus."], STYLE_HINT],
  ["Quelle phrase contient une comparaison?", "Il est fort comme un lion.", ["Il est un lion.", "Le lion rugit."], STYLE_HINT],
  ["Quelle phrase contient une hyperbole?", "Je meurs de faim!", ["J'ai un peu faim.", "Il est midi."], STYLE_HINT],
  ["« Le soleil danse sur l'eau. » Quelle figure de style est-ce?", "Une personnification", ["Une hyperbole", "Une comparaison"], STYLE_HINT],
  ["« Ce garçon est une vraie tortue. » Quelle figure de style est-ce?", "Une métaphore", ["Une comparaison", "Une hyperbole"], STYLE_HINT],
  ["« Il est rusé comme un renard. » Quelle figure de style est-ce?", "Une comparaison", ["Une métaphore", "Une personnification"], STYLE_HINT],
  ["« J'ai attendu une éternité! » Quelle figure de style est-ce?", "Une hyperbole", ["Une comparaison", "Une allitération"], STYLE_HINT],
  ["« Les feuilles chuchotent entre elles. » Quelle figure de style est-ce?", "Une personnification", ["Une métaphore", "Une allitération"], STYLE_HINT],
  ["« Sa voix est du velours. » Quelle figure de style est-ce?", "Une métaphore", ["Une comparaison", "Une allitération"], STYLE_HINT],
  ["« Elle est blanche comme neige. » Quelle figure de style est-ce?", "Une comparaison", ["Une métaphore", "Une hyperbole"], STYLE_HINT],
  ["« Un million de fourmis envahit la cuisine. » Quelle figure de style est-ce?", "Une hyperbole", ["Une personnification", "Une métaphore"], STYLE_HINT],
  ["« Le chat chasse six souris sans cesse. » Quelle figure de style est-ce?", "Une allitération", ["Une métaphore", "Une hyperbole"], "Les sons « ch » et « s » sont répétés."],
  ["« La vie est un long fleuve. » Quelle figure de style est-ce?", "Une métaphore", ["Une personnification", "Une allitération"], STYLE_HINT],
  ["Quelle phrase contient une personnification?", "Le vent siffle une chanson.", ["Le vent est fort.", "Le vent souffle à midi."], STYLE_HINT],
  ["Quelle phrase contient une allitération?", "Trois tortues trottaient tranquillement.", ["La tortue marche lentement.", "Le lièvre court vite."], "Le son « t » est répété plusieurs fois."],
  ["Quelle phrase contient une hyperbole?", "Ce sac pèse une tonne!", ["Ce sac est lourd.", "Ce sac est bleu."], STYLE_HINT],
  ["Quelle phrase contient une comparaison?", "Il court comme le vent.", ["Il est le vent.", "Le vent court."], STYLE_HINT],
  ["Quelle phrase contient une métaphore?", "Cette classe est une ruche.", ["Cette classe est calme.", "Cette classe est comme une ruche."], STYLE_HINT],
  ["Quel est l'effet d'une hyperbole?", "Elle exagère pour frapper l'imagination", ["Elle explique un fait", "Elle donne une date"], STYLE_HINT],
  ["Quel est l'effet d'une personnification?", "Elle donne vie à une chose ou à un animal", ["Elle donne un chiffre", "Elle résume le texte"], STYLE_HINT],
];

// ---------- Séquence descriptive ----------

const DESCRIPTION: FrItem[] = [
  ["Quelle partie d'un texte descriptif présente le sujet central?", "L'introduction", ["La conclusion", "Un aspect"], "L'introduction nomme le sujet. Le développement le décrit par aspects. La conclusion termine."],
  ["Pour décrire un lac, quel est un aspect?", "Sa couleur et sa profondeur", ["Le titre du texte", "Le nom de l'auteur"], "Un aspect est un angle de la description."],
  ["Dans un texte sur les loups, « Leur nourriture » est un…", "Aspect", ["Sujet central", "Titre de la conclusion"], "Le sujet central est « les loups ». Les aspects sont leur nourriture, leur habitat…"],
  ["Dans le texte « Les loups », « Les loups vivent en meute » est un…", "Sous-aspect de leur vie sociale", ["Sujet central", "Titre"], "Un sous-aspect précise un aspect."],
  ["Que fait la conclusion d'un texte descriptif?", "Elle résume le sujet", ["Elle commence un autre sujet", "Elle remplace l'introduction"], "La conclusion termine et rappelle l'essentiel."],
  ["Quel mot varie le vocabulaire de « grand »?", "immense", ["petit", "rapidement"], "Un synonyme garde le même sens."],
  ["Quel mot est un synonyme de « beau »?", "magnifique", ["laid", "bruyant"], "Variez le vocabulaire pour enrichir un texte."],
  ["Quel type de phrase pose une question?", "La phrase interrogative", ["La phrase déclarative", "La phrase impérative"], "Interrogative : ?  Impérative : un ordre.  Exclamative : !"],
  ["Quel type de phrase exprime un ordre?", "La phrase impérative", ["La phrase interrogative", "La phrase déclarative"], "Ferme la porte. = impérative."],
  ["Quel est le sujet central d'un texte qui décrit les ours polaires, leur nourriture et leur habitat?", "Les ours polaires", ["Leur nourriture", "Leur habitat"], "Le sujet central est ce qu'on décrit. Les aspects sont les angles de la description."],
  ["Dans un texte sur les ours polaires, « Leur habitat » est un…", "Aspect", ["Sujet central", "Titre"], "Un aspect est un angle de la description."],
  ["Dans un texte sur les abeilles, « La fabrication du miel » est un…", "Aspect", ["Sujet central", "Titre de la conclusion"], "Un aspect est un angle de la description."],
  ["Dans un texte sur les abeilles, « Les abeilles ouvrières » est un…", "Sous-aspect", ["Sujet central", "Titre de l'introduction"], "Un sous-aspect précise un aspect."],
  ["Quel mot est un synonyme de « petit »?", "minuscule", ["énorme", "rapide"], "Un synonyme garde le même sens."],
  ["Quel mot est un synonyme de « joli »?", "charmant", ["laid", "pesant"], "Un synonyme garde le même sens."],
  ["Quel mot est un synonyme de « froid »?", "glacial", ["brûlant", "doux"], "Un synonyme garde le même sens."],
  ["Quel mot est un synonyme de « vieux »?", "ancien", ["neuf", "léger"], "Un synonyme garde le même sens."],
  ["Quel type de phrase exprime un sentiment fort avec un point d'exclamation?", "La phrase exclamative", ["La phrase interrogative", "La phrase déclarative"], "Interrogative : ?  Impérative : un ordre.  Exclamative : !"],
  ["Quel type de phrase donne une information?", "La phrase déclarative", ["La phrase impérative", "La phrase interrogative"], "Déclarative : elle affirme ou informe. Impérative : un ordre."],
  ["« Ferme la fenêtre. » Quel type de phrase est-ce?", "Impérative", ["Exclamative", "Interrogative"], "Interrogative : ?  Impérative : un ordre.  Exclamative : !"],
  ["« Quel beau paysage! » Quel type de phrase est-ce?", "Exclamative", ["Déclarative", "Impérative"], "Interrogative : ?  Impérative : un ordre.  Exclamative : !"],
  ["« Où vivent les pingouins? » Quel type de phrase est-ce?", "Interrogative", ["Déclarative", "Impérative"], "Interrogative : ?  Impérative : un ordre.  Exclamative : !"],
  ["Pourquoi varier les types de phrases dans une description?", "Pour rendre le texte plus vivant", ["Pour le raccourcir", "Pour éviter les verbes"], "Varier les phrases et le vocabulaire enrichit un texte."],
  ["Quelle phrase contient un adjectif qui précise un aspect du lac?", "Le lac est profond et glacé.", ["Le lac est là.", "Nous allons au lac."], "Un adjectif précise une qualité du sujet."],
  ["Qu'est-ce qu'un aspect dans un texte descriptif?", "Un angle sous lequel on décrit le sujet", ["Le titre du texte", "Une rime"], "L'introduction nomme le sujet. Le développement le décrit par aspects."],
  ["Que contient l'introduction d'un texte descriptif?", "Le sujet central et ce qu'on va décrire", ["Tous les détails", "Seulement la source"], "L'introduction nomme le sujet. Le développement le décrit par aspects."],
];

// ---------- Les temps du passé ----------

const PAST_HINT = "Passé composé : une action terminée. Imparfait : une description ou une habitude. Plus-que-parfait : une action avant une autre action passée.";

const PAST: FrItem[] = [
  ["Complète : Hier, nous ___ au cinéma. (aller, passé composé)", "sommes allés", ["allions", "étions allés"], PAST_HINT],
  ["Complète : Quand j'étais petit, je ___ souvent au parc. (aller, imparfait)", "allais", ["suis allé", "étais allé"], PAST_HINT],
  ["Complète : Elle ___ déjà mangé quand je suis arrivé. (avoir, plus-que-parfait)", "avait", ["a", "aura"], PAST_HINT],
  ["Complète : Il pleuvait quand nous ___ de l'école. (sortir, passé composé)", "sommes sortis", ["sortions", "étions sortis"], PAST_HINT],
  ["Quel temps décrit une habitude du passé?", "L'imparfait", ["Le passé composé", "Le futur simple"], PAST_HINT],
  ["Quel temps décrit une action terminée?", "Le passé composé", ["L'imparfait", "Le conditionnel"], PAST_HINT],
  ["Quelle phrase est au plus-que-parfait?", "Il avait fini son devoir.", ["Il a fini son devoir.", "Il finissait son devoir."], PAST_HINT],
  ["Quelle phrase est au passé composé?", "Ils ont gagné le match.", ["Ils gagnaient le match.", "Ils avaient gagné le match."], PAST_HINT],
  ["Complète : Les filles sont ___ . (arriver, passé composé)", "arrivées", ["arrivé", "arrivés"], "Avec être, le participe s'accorde avec le sujet : les filles → féminin pluriel."],
  ["Complète : La lettre que j'ai ___ . (écrire, passé composé)", "écrite", ["écrit", "écrits"], "Avec avoir, on accorde avec le complément direct placé avant : « que » = la lettre → féminin singulier."],
  ["Complète : Les pommes qu'elle a ___ étaient bonnes. (manger)", "mangées", ["mangé", "mangée"], "Le complément direct « que » (les pommes) est placé avant le verbe : féminin pluriel."],
  ["Quel temps utilise-t-on pour raconter une action avant une autre dans le passé?", "Le plus-que-parfait", ["Le futur simple", "Le présent"], PAST_HINT],
  ["Complète : Hier soir, elle ___ un film. (regarder, passé composé)", "a regardé", ["regardait", "avait regardé"], PAST_HINT],
  ["Complète : Chaque été, nous ___ au lac. (aller, imparfait)", "allions", ["sommes allés", "étions allés"], PAST_HINT],
  ["Complète : Il ___ déjà parti quand je suis arrivé. (être, plus-que-parfait)", "était", ["est", "sera"], PAST_HINT],
  ["Complète : Quand il ___ petit, il aimait les dinosaures. (être, imparfait)", "était", ["a été", "sera"], PAST_HINT],
  ["Complète : Le chat ___ sur le divan quand le téléphone a sonné. (dormir, imparfait)", "dormait", ["a dormi", "avait dormi"], PAST_HINT],
  ["Complète : Les garçons sont ___ à neuf heures. (arriver, passé composé)", "arrivés", ["arrivé", "arrivées"], "Avec être, le participe s'accorde avec le sujet : les garçons → masculin pluriel."],
  ["Complète : Les histoires que Léa a ___ sont drôles. (écrire)", "écrites", ["écrit", "écrite"], "Le complément direct « que » (les histoires) est placé avant le verbe : féminin pluriel."],
  ["Complète : Nous avons ___ la lettre hier. (recevoir; la lettre vient après le verbe)", "reçu", ["reçue", "reçus"], "Le complément direct est placé après le verbe : le participe ne s'accorde pas."],
  ["Quelle phrase décrit une habitude passée?", "Autrefois, je lisais chaque soir.", ["Hier, j'ai lu un chapitre.", "Demain, je lirai un chapitre."], PAST_HINT],
  ["Quelle phrase décrit une action terminée?", "Samedi, nous avons visité le musée.", ["Samedi, nous visitions le musée.", "Samedi, nous visiterons le musée."], PAST_HINT],
  ["Quelle phrase est au plus-que-parfait?", "Elle avait déjà fini ses devoirs.", ["Elle finit ses devoirs.", "Elle finira ses devoirs."], PAST_HINT],
  ["Quelle phrase est à l'imparfait?", "Il pleuvait depuis midi.", ["Il a plu depuis midi.", "Il pleuvra depuis midi."], PAST_HINT],
  ["Complète : Elle était fatiguée parce qu'elle ___ mal dormi. (avoir, plus-que-parfait)", "avait", ["a", "aura"], PAST_HINT],
  ["Complète : Hier, mes parents ___ au restaurant. (aller, passé composé)", "sont allés", ["allaient", "étaient allés"], PAST_HINT],
];

// ---------- Les pronoms compléments ----------

const PRON_HINT = "Complément direct : le, la, les, me, te. Complément indirect (à + quelqu'un) : lui, leur, me, te. Y remplace un lieu; en remplace « de + quelque chose ».";

const PRONOUNS: FrItem[] = [
  ["Remplace le complément : Je vois Marie. → Je ___ vois.", "la", ["lui", "leur"], PRON_HINT],
  ["Remplace le complément : Je vois mes amis. → Je ___ vois.", "les", ["leur", "lui"], PRON_HINT],
  ["Remplace le complément : Je parle à Marie. → Je ___ parle.", "lui", ["la", "les"], PRON_HINT],
  ["Remplace le complément : Je parle à mes amis. → Je ___ parle.", "leur", ["les", "la"], PRON_HINT],
  ["Remplace le complément : Il mange le gâteau. → Il ___ mange.", "le", ["lui", "leur"], PRON_HINT],
  ["Remplace le lieu : Nous allons à la plage. → Nous ___ allons.", "y", ["en", "lui"], PRON_HINT],
  ["Remplace « de + chose » : Elle a besoin de livres. → Elle ___ a besoin.", "en", ["y", "les"], PRON_HINT],
  ["Remplace le complément : Tu me vois. Quel pronom est le complément direct?", "me", ["Tu", "vois"], PRON_HINT],
  ["Dans « Je lui donne un livre », lui est un complément…", "indirect", ["direct", "de lieu"], PRON_HINT],
  ["Dans « Je le regarde », le est un complément…", "direct", ["indirect", "de temps"], PRON_HINT],
  ["Remplace le complément : Nous voyons Paul et Léa. → Nous ___ voyons.", "les", ["leur", "lui"], PRON_HINT],
  ["Remplace le complément : Je vois Paul. → Je ___ vois.", "le", ["lui", "les"], PRON_HINT],
  ["Remplace le complément : Tu appelles ta tante. → Tu ___ appelles.", "l'", ["lui", "leur"], PRON_HINT],
  ["Remplace le complément : Elle téléphone à Paul. → Elle ___ téléphone.", "lui", ["le", "les"], PRON_HINT],
  ["Remplace le complément : Nous écrivons à nos cousins. → Nous ___ écrivons.", "leur", ["les", "lui"], PRON_HINT],
  ["Remplace « des + chose » : Il achète des pommes. → Il ___ achète.", "en", ["y", "les"], PRON_HINT],
  ["Remplace le lieu : Elle va à l'école. → Elle ___ va.", "y", ["en", "lui"], PRON_HINT],
  ["Remplace « de + chose » : Il parle de son voyage. → Il ___ parle.", "en", ["y", "lui"], PRON_HINT],
  ["Remplace le complément : Tu prends tes lunettes. → Tu ___ prends.", "les", ["leur", "lui"], PRON_HINT],
  ["Remplace le complément : Je donne la clé à Ana. → Je ___ donne la clé.", "lui", ["la", "les"], PRON_HINT],
  ["Remplace le complément : Elle regarde ses photos. → Elle ___ regarde.", "les", ["leur", "en"], PRON_HINT],
  ["Dans « Nous les voyons », « les » est un complément…", "direct", ["indirect", "de lieu"], PRON_HINT],
  ["Dans « Je leur parle », « leur » est un complément…", "indirect", ["direct", "de temps"], PRON_HINT],
  ["Dans « Il y va », y remplace un complément de…", "lieu", ["temps", "manière"], PRON_HINT],
  ["Où place-t-on le pronom complément dans « Je le vois »?", "Avant le verbe", ["Après le verbe", "À la fin de la phrase"], PRON_HINT],
  ["Quel pronom remplace un complément direct féminin singulier?", "la", ["le", "lui"], PRON_HINT],
  ["Quel pronom remplace un complément indirect pluriel (à + personnes)?", "leur", ["les", "lui"], PRON_HINT],
];

// ---------- Phrases hypothétiques ----------

const IF_HINT = "Si + présent → futur simple. Si + imparfait → conditionnel présent. Si + plus-que-parfait → conditionnel passé.";

const HYPOTHETICAL: FrItem[] = [
  ["Complète : Si tu étudies, tu ___ ton examen. (réussir)", "réussiras", ["réussirais", "aurais réussi"], IF_HINT],
  ["Complète : Si j'avais des ailes, je ___ . (voler)", "volerais", ["volerai", "vole"], IF_HINT],
  ["Complète : S'il pleut demain, nous ___ à l'intérieur. (rester)", "resterons", ["resterions", "sommes restés"], IF_HINT],
  ["Complète : Si nous avions plus de temps, nous ___ le musée. (visiter)", "visiterions", ["visiterons", "visitons"], IF_HINT],
  ["Quelle phrase est correcte?", "Si elle vient, je serai content.", ["Si elle viendra, je serai content.", "Si elle viendrait, je serai content."], "Après « si », on n'emploie pas le futur ni le conditionnel."],
  ["Quelle phrase est correcte?", "Si j'étais riche, je voyagerais.", ["Si je serais riche, je voyagerais.", "Si j'étais riche, je voyagerai."], "Après « si », on n'emploie pas le conditionnel."],
  ["Quelle phrase exprime une hypothèse?", "Si je gagnais, je serais ravi.", ["Je gagne souvent.", "J'ai gagné hier."], IF_HINT],
  ["Quel mot commence une phrase hypothétique?", "si", ["car", "donc"], IF_HINT],
  ["Complète : Si tu pars tôt, tu ___ le train. (attraper)", "attraperas", ["attraperais", "aurais attrapé"], IF_HINT],
  ["Complète : Si j'avais un chien, je le ___ chaque matin. (promener)", "promènerais", ["promènerai", "promenais"], IF_HINT],
  ["Complète : Si nous gagnons le match, nous ___ une fête. (faire)", "ferons", ["ferions", "avons fait"], IF_HINT],
  ["Complète : Si elle savait la réponse, elle la ___. (dire)", "dirait", ["dira", "disait"], IF_HINT],
  ["Complète : S'il faisait beau, nous ___ au parc. (aller)", "irions", ["irons", "allions"], IF_HINT],
  ["Complète : Si tu ne manges pas, tu ___ faim. (avoir)", "auras", ["aurais", "avais"], IF_HINT],
  ["Complète : Si vous étiez plus patients, vous ___ mieux. (réussir)", "réussiriez", ["réussirez", "réussissiez"], IF_HINT],
  ["Complète : Si je pouvais voyager, je ___ au Japon. (aller)", "irais", ["irai", "allais"], IF_HINT],
  ["Quelle phrase est correcte?", "Si tu avais faim, tu mangerais.", ["Si tu aurais faim, tu mangerais.", "Si tu avais faim, tu mangeras."], "Après « si », on n'emploie pas le conditionnel."],
  ["Quelle phrase est correcte?", "Si nous finissons tôt, nous jouerons.", ["Si nous finirons tôt, nous jouerons.", "Si nous finirions tôt, nous jouerons."], "Après « si », on n'emploie pas le futur ni le conditionnel."],
  ["Quelle phrase exprime une hypothèse peu probable?", "Si j'étais un oiseau, je volerais.", ["Si je mange, je grandirai.", "Je vole chaque jour."], IF_HINT],
  ["Quel temps suit « si » + imparfait?", "Le conditionnel présent", ["Le futur simple", "Le passé composé"], IF_HINT],
  ["Quel temps suit « si » + présent?", "Le futur simple", ["Le conditionnel présent", "L'imparfait"], IF_HINT],
  ["Dans « Si tu viens, je serai content », quel temps suit « si »?", "Le présent", ["Le futur simple", "Le conditionnel"], IF_HINT],
  ["Dans « Si j'avais des ailes, je volerais », quel temps suit « si »?", "L'imparfait", ["Le conditionnel", "Le futur simple"], IF_HINT],
  ["Complète : Si elle étudie, elle ___ de bonnes notes. (obtenir)", "obtiendra", ["obtiendrait", "obtenait"], IF_HINT],
  ["Complète : Si j'étais toi, je ___ la vérité. (dire)", "dirais", ["dirai", "disais"], IF_HINT],
  ["Complète : Si nous avions un jardin, nous ___ des tomates. (planter)", "planterions", ["planterons", "plantions"], IF_HINT],
];

// ---------- Le passé simple et le plus-que-parfait ----------

const SIMPLE_PAST: FrItem[] = [
  ["Dans un conte, « Il ouvrit la porte » est au…", "Passé simple", ["Plus-que-parfait", "Futur simple"], "Le passé simple se trouve surtout à l'écrit, dans les contes et les romans : il ouvrit, elle chanta."],
  ["Quelle phrase est au passé simple?", "Elle chanta une chanson.", ["Elle chantait une chanson.", "Elle avait chanté une chanson."], "Le passé simple se termine par -a, -it, -ent… à la 3e personne."],
  ["Quelle forme est le passé simple de « parler » (il)?", "parla", ["parlait", "parlera"], "Il parla = passé simple. Il parlait = imparfait."],
  ["Quelle forme est le passé simple de « finir » (il)?", "finit", ["finissait", "finira"], "Il finit = passé simple."],
  ["Quel temps est « avait fini »?", "Le plus-que-parfait", ["Le passé simple", "Le futur simple"], "Auxiliaire à l'imparfait + participe passé."],
  ["Comment forme-t-on le plus-que-parfait?", "Auxiliaire à l'imparfait + participe passé", ["Auxiliaire au présent + participe passé", "Radical + -ait"], "J'avais mangé; elle était partie."],
  ["Complète : Quand elle est arrivée, nous ___ déjà fini. (plus-que-parfait)", "avions", ["avons", "aurons"], "Avoir à l'imparfait : j'avais, tu avais, il avait, nous avions…"],
  ["Complète : Elle ___ partie avant la pluie. (être, plus-que-parfait)", "était", ["est", "sera"], "Être à l'imparfait : j'étais, elle était…"],
  ["Quelle forme est le passé simple de « marcher » (ils)?", "marchèrent", ["marchaient", "marcheront"], "Le passé simple se trouve surtout à l'écrit : ils marchèrent."],
  ["Quelle forme est le passé simple de « dire » (il)?", "dit", ["disait", "dira"], "Il dit = passé simple. Il disait = imparfait."],
  ["Quelle forme est le passé simple de « courir » (elle)?", "courut", ["courait", "courra"], "Elle courut = passé simple. Elle courait = imparfait."],
  ["Quelle forme est le passé simple de « être » (il)?", "fut", ["était", "sera"], "Il fut = passé simple. Il était = imparfait."],
  ["Quelle forme est le passé simple de « avoir » (elle)?", "eut", ["avait", "aura"], "Elle eut = passé simple. Elle avait = imparfait."],
  ["Quelle forme est le passé simple de « aller » (il)?", "alla", ["allait", "ira"], "Il alla = passé simple. Il allait = imparfait."],
  ["Quelle forme est le passé simple de « faire » (il)?", "fit", ["faisait", "fera"], "Il fit = passé simple. Il faisait = imparfait."],
  ["Quelle forme est le passé simple de « voir » (elle)?", "vit", ["voyait", "verra"], "Elle vit = passé simple. Elle voyait = imparfait."],
  ["Quelle phrase est au passé simple?", "Le roi ouvrit la porte.", ["Le roi ouvrait la porte.", "Le roi avait ouvert la porte."], "Le passé simple se trouve surtout à l'écrit, dans les contes et les romans."],
  ["Quelle phrase est au passé simple?", "Ils dansèrent toute la nuit.", ["Ils dansaient toute la nuit.", "Ils avaient dansé toute la nuit."], "Le passé simple se trouve surtout à l'écrit, dans les contes et les romans."],
  ["Quelle phrase est au plus-que-parfait?", "Nous avions fini le travail.", ["Nous finîmes le travail.", "Nous finissions le travail."], "Auxiliaire à l'imparfait + participe passé."],
  ["Quelle phrase est au plus-que-parfait?", "Elle était partie avant minuit.", ["Elle partit avant minuit.", "Elle partait avant minuit."], "Auxiliaire à l'imparfait + participe passé."],
  ["Complète : Quand tu es arrivé, ils ___ déjà mangé. (avoir, plus-que-parfait)", "avaient", ["ont", "auront"], "Avoir à l'imparfait : j'avais, tu avais, il avait, ils avaient…"],
  ["Complète : Hier, j'___ oublié mon sac avant de partir. (avoir, plus-que-parfait)", "avais", ["ai", "aurai"], "Avoir à l'imparfait : j'avais, tu avais, il avait…"],
  ["Complète : Elles ___ sorties avant la pluie. (être, plus-que-parfait)", "étaient", ["sont", "seront"], "Être à l'imparfait : j'étais, elles étaient…"],
  ["Où trouve-t-on surtout le passé simple?", "Dans les contes et les romans", ["Dans les messages texte", "Dans les conversations de tous les jours"], "Le passé simple se trouve surtout à l'écrit, dans les contes et les romans."],
  ["Pourquoi le passé simple est-il rare à l'oral?", "Il est surtout un temps de l'écrit littéraire", ["Il n'existe pas", "Il est réservé aux enfants"], "Le passé simple se trouve surtout à l'écrit, dans les contes et les romans."],
  ["Dans « Elle ouvrit la porte et vit un chat », combien de verbes sont au passé simple?", "Deux", ["Un", "Trois"], "Cherche les verbes : ouvrit et vit."],
  ["Quel verbe est au passé simple? « Il mangeait quand elle arriva. »", "arriva", ["mangeait", "elle"], "Il mangeait = imparfait. Elle arriva = passé simple."],
];

export const course: Course = {
  grade: "9",
  subject: "immersion",
  bigIdeas: {
    "ca-bc": [
      "Improving communication skills in a language helps us define ourselves and affirm our ideas.",
      "Language is a cultural tool, the common thread of knowledge and values.",
      "Studying a text on different levels allows the various meanings to be brought to light.",
      "Literature reflects the reality of society at the time and its questions and preoccupations.",
    ],
  },
  units: [
    {
      id: "registres-et-expose",
      title: "Registres et exposés oraux",
      emoji: "🎤",
      blurb: "Parler à un auditoire",
      parentNote: "Registers of language (colloquial, standard, formal) and speaking to an audience: intention, organization, clarification and explanation.",
      standards: { "ca-bc": "Communication strategies: registers of language; speaking to an audience (intention, organization, clarification, explanation)" },
      generate: (o) => frQuestions(REGISTERS, o, 8, FR),
    },
    {
      id: "fable",
      title: "La fable",
      emoji: "🦊",
      blurb: "Morale, sens propre et sens figuré",
      parentNote: "Characteristics of the fable (moral, literal and figurative meaning, manners and customs), using an original fable.",
      standards: { "ca-bc": "Literary elements: characteristics of the fable (moral, literal meaning, figurative meaning, manners and customs)" },
      generate: (o) => frQuestions(FABLES, o, 8, FR),
    },
    {
      id: "roman",
      title: "Le roman et ses personnages",
      emoji: "📖",
      blurb: "Narrateur, héros et portraits",
      parentNote: "Characteristics of the novel (modes of narration, function of characters, point of view, setting) and character portrayal (physical and psychological).",
      standards: { "ca-bc": "Literary elements: characteristics of the novel; text organization: character portrayal (psychological and physical)" },
      generate: (o) => frQuestions(ROMAN, o, 8, FR),
    },
    {
      id: "figures-de-style",
      title: "Les figures de style",
      emoji: "🎨",
      blurb: "Métaphore, comparaison, hyperbole…",
      parentNote: "Stylistic elements: personification, metaphor, alliteration, comparison and hyperbole.",
      standards: { "ca-bc": "Literary elements: stylistic elements (personification, metaphor, alliteration, comparison, hyperbole)" },
      generate: (o) => frQuestions(STYLES, o, 8, FR),
    },
    {
      id: "sequence-descriptive",
      title: "La séquence descriptive",
      emoji: "🔍",
      blurb: "Sujet, aspects et vocabulaire",
      parentNote: "Descriptive sequences: introduction, central subject with aspects and sub-aspects, conclusion; enriching a text with varied vocabulary and types of sentences.",
      standards: { "ca-bc": "Text organization: descriptive sequences; elements to enrich a text (varied vocabulary, types of sentences)" },
      generate: (o) => frQuestions(DESCRIPTION, o, 8, FR),
    },
    {
      id: "temps-du-passe",
      title: "Les temps du passé",
      emoji: "⏳",
      blurb: "Passé composé, imparfait, plus-que-parfait",
      parentNote: "Choosing among the passé composé, imparfait and plus-que-parfait, and making past participles agree.",
      standards: { "ca-bc": "Language elements: agreement of past tenses: passé composé, imparfait and plus-que-parfait" },
      generate: (o) => frQuestions(PAST, o, 8, FR),
    },
    {
      id: "pronoms-complements",
      title: "Les pronoms compléments",
      emoji: "🔁",
      blurb: "le, la, lui, leur, y, en",
      parentNote: "Direct pronouns (me, te, se, le, la, les) and indirect pronouns (me, te, nous, vous, lui, leur, y, en).",
      standards: { "ca-bc": "Language elements: pronouns used as direct and indirect object complements" },
      generate: (o) => frQuestions(PRONOUNS, o, 8, FR),
    },
    {
      id: "phrases-hypothetiques",
      title: "Les phrases hypothétiques",
      emoji: "💭",
      blurb: "Si + présent, si + imparfait",
      parentNote: "Hypothetical sentences with si: matching the tense after si with the tense of the result.",
      standards: { "ca-bc": "Language elements: hypothetical sentences" },
      generate: (o) => frQuestions(HYPOTHETICAL, o, 8, FR),
    },
    {
      id: "passe-simple",
      title: "Passé simple et plus-que-parfait",
      emoji: "📜",
      blurb: "Les temps des récits",
      parentNote: "Using the pluperfect (plus-que-parfait) tense and recognizing the simple past (passé simple) in stories.",
      standards: { "ca-bc": "Language elements: using the plus-que-parfait tense and recognizing the passé simple" },
      generate: (o) => frQuestions(SIMPLE_PAST, o, 8, FR),
    },
  ],
};
