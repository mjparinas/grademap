import type { Course, GradeId, Unit } from "../types";
import { course as ontarioCoreFrench4 } from "../ontario/g4-core-french";
import { overall } from "./overall";
import { adopt, mb, type Std } from "./kit";

// Manitoba French. Core French is "French: Communication and Culture" (Grades 4 to 12, French (English Program)); its four
// strands (Oral Communication, Reading, Writing, Culture) are the standards cited below. French Immersion follows the
// Français arts langagiers – immersion framework, which is organized in stages (En éveil, Apprenti, En transition, En
// expansion) rather than numbered outcomes, so immersion units cite the framework and the skill they practise.
// Units the BC French courses also have are shared.

type Kind = "listen" | "speak" | "read" | "write" | "culture";

const CORE: Record<Kind, Std> = {
  listen: ["Oral Communication", "listening to understand a message in French"],
  speak: ["Oral Communication", "speaking and interacting in French with attention to message, fluency and accuracy"],
  read: ["Reading", "reading French texts and showing understanding"],
  write: ["Writing", "writing clear, simple French texts for a purpose"],
  culture: ["Culture", "francophone cultures, and applying that knowledge in interactions with others"],
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
  "French immersion is first and foremost a language program: French is both the language we learn in and the language we learn.",
  "Listening and speaking in French grow every day, in school and in the francophone community.",
  "Reading a range of French texts builds comprehension and the habit of reading for meaning.",
  "Writing in French for a purpose and an audience uses the conventions of the language.",
  "Learning in French builds a proud, confident, plurilingual identity and a connection to Francophone communities in Canada and around the world.",
];

function sharesFor(plan: Plan, standard: (kind: Kind) => Unit["standards"]): NonNullable<Course["shares"]> {
  return Object.fromEntries(Object.entries(plan).map(([id, kind]) => [id, { standards: standard(kind) }]));
}

const STAGE: Record<string, string> = { k: "En éveil", "1": "En éveil", "2": "Apprenti", "3": "Apprenti", "4": "En transition", "5": "En transition", "6": "En transition", "7": "En expansion", "8": "En expansion", "9": "Secondary" };

/** The Manitoba Core French and French Immersion courses for a grade: BC units with Manitoba standards. */
export function frenchCourses(grade: GradeId): Course[] {
  const out: Course[] = [];
  const core = CORE_PLAN[grade];
  if (grade === "4") {
    const units = adopt(ontarioCoreFrench4.units, Object.fromEntries(Object.entries(CORE_4).map(([id, kind]) => [id, CORE[kind]])));
    out.push({ grade, subject: "core-french", bigIdeas: { "ca-mb": overall(grade, "core-french") }, units, order: { "ca-mb": units.map((u) => u.id) } });
  } else if (core) {
    const shares = sharesFor(core, (kind) => mb(CORE[kind][0], CORE[kind][1]));
    out.push({ grade, subject: "core-french", bigIdeas: { "ca-mb": overall(grade, "core-french") }, units: [], shares, order: { "ca-mb": Object.keys(core) } });
  }
  const imm = IMMERSION_PLAN[grade];
  if (imm) {
    const stage = STAGE[grade];
    const label = grade === "9" ? "Français – immersion (Grade 9)" : `Français arts langagiers – immersion (stade ${stage})`;
    out.push({
      grade,
      subject: "immersion",
      bigIdeas: { "ca-mb": IMMERSION_IDEAS },
      units: [],
      shares: sharesFor(imm, (kind) => mb(label, IMMERSION[kind])),
      order: { "ca-mb": Object.keys(imm) },
    });
  }
  return out;
}
