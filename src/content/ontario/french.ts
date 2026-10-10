import type { Course, GradeId } from "../types";
import { on } from "./kit";

// Ontario French as a Second Language (FSL, 2013; Grade 9 FSF1D and FIF1D). The FSL
// curriculum is skills-based: the same four strands (A Listening, B Speaking, C Reading,
// D Writing) run through every grade, so the expectation codes cited here are the strands'
// overall expectations. Units the BC French courses also have are shared.

type Kind = "listen" | "speak" | "read" | "write" | "culture";

const KIND: Record<Kind, { codes: string; text: string }> = {
  listen: { codes: "A1, A2", text: "listening to understand and to interact in French" },
  speak: { codes: "B1, B2", text: "speaking to communicate and to interact in French" },
  read: { codes: "C1, C2", text: "reading comprehension, and the purpose, form and style of French texts" },
  write: { codes: "D1, D2", text: "writing for a purpose and audience, using correct French conventions" },
  culture: { codes: "A3, B3, C3, D3", text: "intercultural understanding of French-speaking communities" },
};

type Plan = Record<string, Kind>;

const CORE: Partial<Record<GradeId, Plan>> = {
  "5": { salutations: "speak", "sons-et-accents": "listen", nombres: "speak", "genre-et-nombre": "write", gouts: "speak", descriptions: "write", "communautes-francophones": "culture", respect: "culture" },
  "6": { "motifs-de-lettres": "listen", "mots-interrogatifs": "speak", loisirs: "speak", "parce-que": "speak", "emotions-et-etats": "speak", famille: "write", "communautes-francophones": "culture", "sources-et-respect": "culture" },
  "7": { directions: "speak", lieux: "write", comparaisons: "write", personnalite: "speak", "mots-amis": "read", histoires: "read", "monde-francophone": "culture", "cultures-et-respect": "culture" },
  "8": { "passe-present-futur": "write", questions: "speak", frequence: "write", "opinions-et-raisons": "speak", "comparer-et-opposer": "write", "sons-et-lettres": "listen", histoires: "read", "monde-francophone": "culture", "culture-et-respect": "culture" },
  "9": { "temps-9": "write", "poser-des-questions": "speak", sequences: "write", "besoins-et-opinions": "speak", "comparer-9": "write", descriptions: "write", "types-de-textes": "read", traditions: "culture", "histoires-9": "read", "identite-et-creations": "write", "culture-et-respect-9": "culture" },
};

const IMMERSION: Partial<Record<GradeId, Plan>> = {
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

function sharesFor(plan: Plan): NonNullable<Course["shares"]> {
  return Object.fromEntries(Object.entries(plan).map(([id, kind]) => [id, { standards: on(KIND[kind].codes, KIND[kind].text) }]));
}

const CORE_IDEAS = [
  "Listening to French and responding to it builds understanding, one step at a time.",
  "Speaking and interacting in French uses familiar words and sentence patterns.",
  "Reading a range of French texts builds comprehension and an eye for how texts are put together.",
  "Writing in French for different purposes and audiences uses the conventions of the language.",
  "Learning French opens a window on French-speaking communities in Canada and around the world.",
];

const IMMERSION_IDEAS = [
  "In immersion, French is the language we learn in, so listening and speaking grow every day.",
  "Reading French texts of many kinds builds comprehension and the habit of reading for meaning.",
  "Writing in French for a purpose and an audience uses the conventions of the language.",
  "Understanding how French works helps us choose the right words, tenses and sentence structures.",
  "Learning in French connects us with Francophone communities in Canada and around the world.",
];

/** The Ontario Core French and French Immersion courses for a grade: BC units, with FSL strand codes. */
export function frenchCourses(grade: GradeId): Course[] {
  const out: Course[] = [];
  const core = CORE[grade];
  if (core) out.push({ grade, subject: "core-french", bigIdeas: { "ca-on": CORE_IDEAS }, units: [], shares: sharesFor(core) });
  const imm = IMMERSION[grade];
  if (imm) out.push({ grade, subject: "immersion", bigIdeas: { "ca-on": IMMERSION_IDEAS }, units: [], shares: sharesFor(imm) });
  return out;
}

export { CORE_IDEAS };
