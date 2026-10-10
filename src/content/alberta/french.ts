import type { Course, GradeId } from "../types";
import { ab } from "./kit";

// Alberta French. Immersion is French Immersion Language Arts and Literature (new K–6 curriculum, Alberta
// Education) for Kindergarten to Grade 6 and the Grades 7–9 immersion language arts program after that.
// Core French is French as a Second Language, Grades 4 to 9 (Alberta's nine-year FSL program, 2004), whose
// general outcomes are Applications, Language competence, Global citizenship and Strategies.
// Units the BC French courses also have are shared; Grade 4 Core French shares the Ontario units.
// The Grades 7–9 immersion citations are descriptive only and still need a French teacher's review.

type Kind = "listen" | "speak" | "read" | "write" | "culture" | "sound" | "story";

const KIND_TEXT: Record<Kind, string> = {
  listen: "listening to understand French",
  speak: "speaking and interacting in French",
  read: "reading and understanding French texts",
  write: "writing in French with correct conventions",
  culture: "French-speaking communities in Canada and around the world",
  sound: "connecting spoken French to letters and sounds",
  story: "French stories, texts and their parts",
};

const FSL_OUTCOMES: Record<Kind, string> = {
  listen: "Applications; Language competence",
  speak: "Applications; Language competence",
  read: "Applications; Language competence",
  write: "Applications; Language competence",
  culture: "Global citizenship; Applications",
  sound: "Language competence; Strategies",
  story: "Applications; Language competence",
};

const IMMERSION_SNAPSHOT: Record<string, Record<string, string>> = {
  k: {
    speak: "Explore verbal and non-verbal language to show understanding and communicate using a few familiar words in French.",
    listen: "Make connections between French words and their meaning.",
    read: "Recognize letters and a few French words.",
    write: "Communicate ideas in different ways.",
    sound: "Recognize connections between spoken and written language.",
    story: "Recognize and explore texts in their immediate environment.",
  },
  "1": {
    speak: "Experiment with listening and speaking in French on very familiar topics.",
    listen: "Use clues to understand messages on familiar topics.",
    read: "Make connections between letters and the sounds they represent to develop reading and writing skills.",
    write: "Represent ideas using a few sentences, referring to model sentences.",
  },
  "2": {
    speak: "Speak using basic French sentences on familiar topics.",
    listen: "Understand the overall meaning of spoken messages on familiar topics.",
    read: "Demonstrate an understanding of the overall meaning of messages in short fiction and non-fiction texts.",
    write: "Write short fiction and non-fiction texts to express ideas, using basic sentence elements.",
  },
  "3": {
    speak: "Speak in French on a variety of familiar topics in spontaneous and prepared communication situations.",
    listen: "Identify important ideas within spoken messages on various familiar topics.",
    read: "Use reading strategies and demonstrate comprehension of fiction and non-fiction texts.",
    write: "Use the writing process and basic sentences to express ideas in fiction and non-fiction texts.",
  },
  "4": {
    speak: "Understand and express messages on various topics in different contexts.",
    listen: "Understand and express messages on various topics in different contexts.",
    read: "Apply reading strategies to understand various fiction and non-fiction texts.",
    write: "Use the writing process and complete sentences to express ideas in fiction and non-fiction texts.",
  },
  "5": {
    speak: "Communicate regularly in French in spontaneous and prepared situations, considering topic, purpose, and context.",
    listen: "Listen to and understand primary and secondary ideas in spoken communications.",
    read: "Select and apply comprehension strategies and demonstrate understanding of various texts.",
    write: "Consider text and purpose to generate, plan, and write ideas using sentence grammar.",
  },
  "6": {
    speak: "Communicate consistently in French, in spontaneous and prepared situations, considering strategies for improving language skills.",
    listen: "Interpret the meaning of messages in various spoken communications.",
    read: "Generate, plan, and write ideas, respecting text form requirements and sentence grammar.",
    write: "Generate, plan, and write ideas, respecting text form requirements and sentence grammar.",
  },
};

type Plan = Record<string, Kind>;

const CORE: Partial<Record<GradeId, Plan>> = {
  "4": { "salutations-4": "speak", "ma-classe": "listen", "couleurs-4": "speak", "nombres-4": "listen", "calendrier-4": "read", "animaux-4": "speak" },
  "5": { salutations: "speak", "sons-et-accents": "sound", nombres: "speak", "genre-et-nombre": "write", gouts: "speak", descriptions: "write", "communautes-francophones": "culture", respect: "culture" },
  "6": { "motifs-de-lettres": "sound", "mots-interrogatifs": "speak", loisirs: "speak", "parce-que": "speak", "emotions-et-etats": "speak", famille: "write", "communautes-francophones": "culture", "sources-et-respect": "culture" },
  "7": { directions: "speak", lieux: "write", comparaisons: "write", personnalite: "speak", "mots-amis": "read", histoires: "read", "monde-francophone": "culture", "cultures-et-respect": "culture" },
  "8": { "passe-present-futur": "write", questions: "speak", frequence: "write", "opinions-et-raisons": "speak", "comparer-et-opposer": "write", "sons-et-lettres": "sound", histoires: "read", "monde-francophone": "culture", "culture-et-respect": "culture" },
  "9": { "temps-9": "write", "poser-des-questions": "speak", sequences: "write", "besoins-et-opinions": "speak", "comparer-9": "write", descriptions: "write", "types-de-textes": "read", traditions: "culture", "histoires-9": "read", "identite-et-creations": "write", "culture-et-respect-9": "culture" },
};

const IMMERSION: Partial<Record<GradeId, Plan>> = {
  k: { "bonjour-et-merci": "speak", "mes-premiers-mots": "listen", lettres: "read", "sons-du-debut": "sound", syllabes: "sound", rimes: "sound", histoires: "story" },
  "1": { "je-me-presente": "speak", "majuscule-et-point": "write", "est-ce-que": "speak", "verbes-d-action": "write", "couleurs-et-adjectifs": "write", "histoire-ou-texte": "read", "elements-d-une-histoire": "read" },
  "2": { "le-la-un-une": "write", "accord-des-adjectifs": "write", "ordre-des-mots": "write", "les-contes": "read", "dabord-ensuite-enfin": "write", "etre-et-avoir": "write" },
  "3": { "verbes-pronominaux": "write", "et-mais-ou-avec": "write", "ne-pas": "write", "futur-proche": "write", "pluriels-en-x": "write", "prefixes-et-suffixes": "read", "idee-principale": "read" },
  "4": { "tu-ou-vous": "speak", "poser-des-questions": "speak", "synonymes-et-contraires": "read", "adverbes-en-ment": "write", comparer: "write", "passe-compose": "write", imparfait: "write", "comprendre-un-texte": "read", "structure-du-recit": "read" },
  "5": { "pronoms-relatifs": "write", negation: "write", adverbes: "write", ponctuation: "write", "bande-dessinee": "read", biographie: "read", "fait-ou-opinion": "read" },
  "6": { "imparfait-ou-passe-compose": "write", "familles-de-mots": "read", legendes: "read", "temps-et-lieux": "read", "roman-jeunesse": "read", "marqueurs-de-relation": "write", resumer: "write" },
  "7": { superlatif: "write", "concordance-des-temps": "write", "figures-de-style": "read", poesie: "read", "paragraphe-argumentatif": "write", "inferences-et-themes": "read", "portrait-de-personnage": "write" },
  "8": { "registres-de-langue": "speak", "communication-verbale": "speak", legende: "read", theatre: "read", "schema-narratif": "read", "structure-des-textes": "read", "point-virgule-et-guillemets": "write", "subordonnees-relatives": "write", "accord-du-participe": "write", complements: "write", "futur-et-conditionnel": "write" },
  "9": { "registres-et-expose": "speak", fable: "read", roman: "read", "figures-de-style": "read", "sequence-descriptive": "write", "temps-du-passe": "write", "pronoms-complements": "write", "phrases-hypothetiques": "write", "passe-simple": "write" },
};

function coreShares(plan: Plan): NonNullable<Course["shares"]> {
  return Object.fromEntries(Object.entries(plan).map(([id, kind]) => [id, { standards: ab(FSL_OUTCOMES[kind], KIND_TEXT[kind]) }]));
}

function immersionShares(grade: GradeId, plan: Plan): NonNullable<Course["shares"]> {
  const lines = IMMERSION_SNAPSHOT[grade];
  return Object.fromEntries(
    Object.entries(plan).map(([id, kind]) => {
      // Kindergarten to Grade 6 cite the official grade snapshot. Grades 7 to 9 name the program.
      const citation = lines ? (lines[kind] ?? lines.read) : "Alberta French immersion language arts, Grades 7 to 9";
      return [id, { standards: ab(citation, KIND_TEXT[kind]) }];
    }),
  );
}

const CORE_IDEAS = [
  "Applications: using French to communicate in everyday situations, to explore and to have fun.",
  "Language competence: understanding and using the sounds, words, sentences and texts of French.",
  "Global citizenship: learning about Francophone communities in Alberta, Canada and the world, and about other cultures.",
  "Strategies: choosing ways to learn, use and remember French, and to manage your own learning.",
];

const IMMERSION_IDEAS = [
  "Listening and speaking in French grow every day when French is the language of learning.",
  "Reading French texts of many kinds builds comprehension and the habit of reading for meaning.",
  "Writing in French for a purpose and an audience uses the conventions of the language.",
  "Understanding how French words, sentences and texts work helps students choose the right words and forms.",
  "Learning in French connects students with Francophone communities in Alberta, Canada and the world.",
];

/** The Alberta Core French (FSL) and French Immersion courses for a grade: BC and Ontario units, with Alberta citations. */
export function frenchCourses(grade: GradeId): Course[] {
  const out: Course[] = [];
  const core = CORE[grade];
  if (core) out.push({ grade, subject: "core-french", bigIdeas: { "ca-ab": CORE_IDEAS }, units: [], shares: coreShares(core), order: { "ca-ab": Object.keys(core) } });
  const imm = IMMERSION[grade];
  if (imm) out.push({ grade, subject: "immersion", bigIdeas: { "ca-ab": IMMERSION_IDEAS }, units: [], shares: immersionShares(grade, imm), order: { "ca-ab": Object.keys(imm) } });
  return out;
}
