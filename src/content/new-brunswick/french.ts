import type { Course, GradeId, Unit } from "../types";
import { course as ontarioCoreFrench4 } from "../ontario/g4-core-french";
import { overall } from "./overall";
import { adopt, nb, type Std } from "./kit";

// New Brunswick French. Intensive French (Grades 4 and 5) and Post-Intensive French (Grade 6 on) are the English-pathway French
// programs; the app calls them Core French. Each has three strands: oral communication, reading and viewing, and writing and
// representing. French Immersion follows French Immersion Language Arts, with early entry in Grade 1 (Kindergarten has no
// immersion). Units the BC French courses also have are shared.

type Kind = "listen" | "speak" | "read" | "write" | "culture";

const CORE: Record<Kind, Std> = {
  listen: ["Oral Communication: Speak, Listen, Communicate, Interact", "listening to understand a message in French"],
  speak: ["Oral Communication: Speak, Listen, Communicate, Interact", "speaking and interacting in French"],
  read: ["Reading and Viewing: Read, Comprehend, Respond, Interpret", "reading French texts and showing understanding"],
  write: ["Writing and Representing: Create Simple Texts", "creating clear French texts for a purpose"],
  culture: ["Reading and Viewing: Read, Comprehend, Respond, Interpret", "French texts that represent a variety of francophone cultures"],
};

// French Immersion Language Arts names its strands differently in Grades 1 to 2, 3 to 5, 6 to 8 and 9.
const IMMERSION_CITES: Record<"1-2" | "3-5" | "6-8" | "9", Record<Kind, Std>> = {
  "1-2": {
    listen: ["Speaking and Listening: Oral Comprehension", "listening to French and understanding how its sounds and words work"],
    speak: ["Speaking and Listening: Oral Production", "speaking about oneself and the world in French"],
    read: ["Reading and Viewing: Comprehension", "reading and understanding a range of French texts"],
    write: ["Writing and Representing: Written Production and the Writing Process", "writing in French with correct spelling, grammar and punctuation"],
    culture: ["Speaking and Listening: Oral Production", "francophone culture and identity"],
  },
  "3-5": {
    listen: ["Speaking and Listening: Oral Comprehension", "listening to French and understanding how its sounds and words work"],
    speak: ["Speaking and Listening: Oral Production and Interaction", "speaking about oneself and the world in French"],
    read: ["Reading and Viewing: Comprehension", "reading and understanding a range of French texts"],
    write: ["Writing and Representing: Written Production and the Writing Process", "writing in French with correct spelling, grammar and punctuation"],
    culture: ["Speaking and Listening: Oral Production and Interaction", "francophone culture and identity"],
  },
  "6-8": {
    listen: ["Speaking and Listening: Oral Comprehension", "listening to French and understanding how its sounds and words work"],
    speak: ["Speaking and Listening: Oral Production and Interaction", "speaking about oneself and the world in French"],
    read: ["Reading and Viewing: Comprehension", "reading and understanding a range of French texts"],
    write: ["Writing and Representing: Written Production", "writing in French with correct spelling, grammar and punctuation"],
    culture: ["Speaking and Listening: Multilingual Identities and Cultural Appreciation", "francophone culture and identity"],
  },
  "9": {
    listen: ["Listening and speaking: Listening comprehension", "listening to French and understanding how its sounds and words work"],
    speak: ["Listening and speaking: Oral communication", "speaking about oneself and the world in French"],
    read: ["Reading: Reading comprehension", "reading and understanding a range of French texts"],
    write: ["Writing: Written communication", "writing in French with correct spelling, grammar and punctuation"],
    culture: ["Intercultural competencies: Intercultural knowledge", "francophone culture and identity"],
  },
};

const immersionCites = (grade: GradeId) => IMMERSION_CITES[grade === "1" || grade === "2" ? "1-2" : grade === "9" ? "9" : grade === "6" || grade === "7" || grade === "8" ? "6-8" : "3-5"];

type Plan = Record<string, Kind>;

// The grades and ids mirror the BC French units, so a family that moves between provinces keeps its progress.
const CORE_PLAN: Partial<Record<GradeId, Plan>> = {
  "5": { salutations: "speak", "sons-et-accents": "listen", nombres: "speak", "genre-et-nombre": "write", gouts: "speak", descriptions: "write", "communautes-francophones": "culture", respect: "culture" },
  "6": { "motifs-de-lettres": "listen", "mots-interrogatifs": "speak", loisirs: "speak", "parce-que": "speak", "emotions-et-etats": "speak", famille: "write", "communautes-francophones": "culture", "sources-et-respect": "culture" },
  "7": { directions: "speak", lieux: "write", comparaisons: "write", personnalite: "speak", "mots-amis": "read", histoires: "read", "monde-francophone": "culture", "cultures-et-respect": "culture" },
  "8": { "passe-present-futur": "write", questions: "speak", frequence: "write", "opinions-et-raisons": "speak", "comparer-et-opposer": "write", "sons-et-lettres": "listen", histoires: "read", "monde-francophone": "culture", "culture-et-respect": "culture" },
  "9": { "temps-9": "write", "poser-des-questions": "speak", sequences: "write", "besoins-et-opinions": "speak", "comparer-9": "write", descriptions: "write", "types-de-textes": "read", traditions: "culture", "histoires-9": "read", "identite-et-creations": "write", "culture-et-respect-9": "culture" },
};

// Grade 4 Core French units are the ones written for Ontario, whose Core French also starts in Grade 4.
const CORE_4: Record<string, Kind> = { "salutations-4": "speak", "ma-classe": "listen", "couleurs-4": "read", "nombres-4": "speak", "calendrier-4": "read", "animaux-4": "culture" };

const IMMERSION_PLAN: Partial<Record<GradeId, Plan>> = {
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

function sharesFor(plan: Plan, standard: (kind: Kind) => Unit["standards"]): NonNullable<Course["shares"]> {
  return Object.fromEntries(Object.entries(plan).map(([id, kind]) => [id, { standards: standard(kind) }]));
}

/** The New Brunswick Core French and French Immersion courses for a grade: BC units with New Brunswick standards. */
export function frenchCourses(grade: GradeId): Course[] {
  const out: Course[] = [];
  const core = CORE_PLAN[grade];
  if (grade === "4") {
    const units = adopt(ontarioCoreFrench4.units, Object.fromEntries(Object.entries(CORE_4).map(([id, kind]) => [id, CORE[kind]])));
    out.push({ grade, subject: "core-french", bigIdeas: { "ca-nb": overall(grade, "core-french") }, units, order: { "ca-nb": units.map((u) => u.id) } });
  } else if (core) {
    const shares = sharesFor(core, (kind) => nb(CORE[kind][0], CORE[kind][1]));
    out.push({ grade, subject: "core-french", bigIdeas: { "ca-nb": overall(grade, "core-french") }, units: [], shares, order: { "ca-nb": Object.keys(core) } });
  }
  const imm = IMMERSION_PLAN[grade];
  if (imm) {
    const cites = immersionCites(grade);
    out.push({
      grade,
      subject: "immersion",
      bigIdeas: { "ca-nb": overall(grade, "immersion") },
      units: [],
      shares: sharesFor(imm, (kind) => nb(cites[kind][0], cites[kind][1])),
      order: { "ca-nb": Object.keys(imm) },
    });
  }
  return out;
}
