import type { Course, GradeId, Unit } from "../types";
import { course as ontarioCoreFrench4 } from "../ontario/g4-core-french";
import { overall } from "./overall";
import { adopt, ns, type Std } from "./kit";

// Nova Scotia French. Core French (Français de base, Grades 4 to 9) has three headline outcomes per grade: communicate orally,
// determine the meaning of French texts and create texts in French. French Immersion follows Français arts langagiers
// (Maternelle to Grade 9, early and late entry), which this app cites by course name and skill. Units the BC French
// courses also have are shared.

type Kind = "listen" | "speak" | "read" | "write" | "culture";

const CORE: Record<Kind, Std> = {
  listen: ["Oral communication", "listening to understand a message in French"],
  speak: ["Oral communication", "speaking and interacting in French in authentic situations"],
  read: ["Reading", "reading French texts and showing understanding"],
  write: ["Writing", "creating clear French texts for a purpose"],
  culture: ["Reading", "French texts that represent a variety of francophone cultures"],
};

const IMMERSION: Record<Kind, string> = {
  listen: "listening to French and understanding how its sounds and words work",
  speak: "speaking about oneself and the world in French",
  read: "reading and understanding a range of French texts",
  write: "writing in French with correct spelling, grammar and punctuation",
  culture: "francophone culture and identity",
};

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
  k: { "bonjour-et-merci": "speak", "mes-premiers-mots": "speak", lettres: "read", "sons-du-debut": "listen", syllabes: "listen", rimes: "listen", histoires: "read" },
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

const IMMERSION_IDEAS = [
  "French Immersion is first and foremost a language program: French is both the language students learn in and the language they learn.",
  "Early French Immersion begins in Primary and Late French Immersion in Grade 7, and both follow Français arts langagiers.",
  "Students listen, speak, read and write in French for real purposes and audiences.",
  "Reading a range of French texts, including texts from Acadian and other francophone communities, builds comprehension and a love of reading.",
  "Learning in French builds a proud, confident, plurilingual identity and a connection to francophone communities in Nova Scotia, Canada and around the world.",
];

function sharesFor(plan: Plan, standard: (kind: Kind) => Unit["standards"]): NonNullable<Course["shares"]> {
  return Object.fromEntries(Object.entries(plan).map(([id, kind]) => [id, { standards: standard(kind) }]));
}

const COURSE_NAME: Record<GradeId, string> = {
  k: "Français arts langagiers Maternelle",
  "1": "Français arts langagiers 1re année",
  "2": "Français arts langagiers 2e année",
  "3": "Français arts langagiers 3e année",
  "4": "Français arts langagiers 4e année",
  "5": "Français arts langagiers 5e année",
  "6": "Français arts langagiers 6e année",
  "7": "Français arts langagiers 7e année",
  "8": "Français arts langagiers 8e année",
  "9": "Français arts langagiers 9e année",
};

/** The Nova Scotia Core French and French Immersion courses for a grade: BC units with Nova Scotia standards. */
export function frenchCourses(grade: GradeId): Course[] {
  const out: Course[] = [];
  const core = CORE_PLAN[grade];
  if (grade === "4") {
    const units = adopt(ontarioCoreFrench4.units, Object.fromEntries(Object.entries(CORE_4).map(([id, kind]) => [id, CORE[kind]])));
    out.push({ grade, subject: "core-french", bigIdeas: { "ca-ns": overall(grade, "core-french") }, units, order: { "ca-ns": units.map((u) => u.id) } });
  } else if (core) {
    const shares = sharesFor(core, (kind) => ns(CORE[kind][0], CORE[kind][1]));
    out.push({ grade, subject: "core-french", bigIdeas: { "ca-ns": overall(grade, "core-french") }, units: [], shares, order: { "ca-ns": Object.keys(core) } });
  }
  const imm = IMMERSION_PLAN[grade];
  if (imm) {
    const label = COURSE_NAME[grade];
    out.push({
      grade,
      subject: "immersion",
      bigIdeas: { "ca-ns": IMMERSION_IDEAS },
      units: [],
      shares: sharesFor(imm, (kind) => ns(label, IMMERSION[kind])),
      order: { "ca-ns": Object.keys(imm) },
    });
  }
  return out;
}
