import { chance, pick, randInt, sample, shuffle, textChoice } from "../../random";
import type { Course, GenerateOptions, InputQuestion, OrderQuestion, Question } from "../../types";
import { fromBank, sortQuestion, type BankItem, type SortSet } from "../../bank";

// Bank items marked `hard` are stretch questions. Difficulty 1 uses only the
// easier items, 2 mixes in about a third, 3 is mostly stretch.
type Item = BankItem & { hard?: true };
type Level = 1 | 2 | 3;

function levelled(bank: Item[], count: number, difficulty: Level): Question[] {
  if (count <= 0) return [];
  const easy = bank.filter((b) => !b.hard);
  const hard = bank.filter((b) => b.hard);
  const want = difficulty === 1 ? 0 : difficulty === 2 ? Math.ceil(count / 3) : Math.ceil((count * 2) / 3);
  const nHard = Math.min(want, hard.length);
  return [...fromBank(easy, count - nHard), ...fromBank(hard, nHard)];
}

/** Two-basket sorts: 6 items at difficulty 1, 8 at 2 and 3. */
const perBin = (difficulty: Level) => (difficulty === 1 ? 3 : 4);

const lvl = (opts?: GenerateOptions): Level => opts?.difficulty ?? 2;

function numInput(prompt: string, answer: number, hint: string, suffix?: string, visual?: Question["visual"]): InputQuestion {
  return { kind: "input", prompt, answer: String(answer), hint, keypad: "number", suffix, visual };
}

// ---------- Cells & the Cell Cycle ----------

const CELL_PHASES = [
  { id: "interphase", label: "Interphase: the cell grows and copies its DNA", emoji: "🧬" },
  { id: "prophase", label: "Prophase: chromosomes condense and become visible", emoji: "🧵" },
  { id: "metaphase", label: "Metaphase: chromosomes line up across the middle", emoji: "↔️" },
  { id: "anaphase", label: "Anaphase: copies of each chromosome are pulled apart", emoji: "🧲" },
  { id: "telophase", label: "Telophase: two new nuclei form", emoji: "⚪" },
  { id: "cytokinesis", label: "Cytokinesis: the cytoplasm splits into two cells", emoji: "✂️" },
];

function phaseOrder(difficulty: Level): OrderQuestion {
  const items = difficulty === 1 ? CELL_PHASES.filter((p) => p.id !== "prophase" && p.id !== "telophase") : difficulty === 2 ? CELL_PHASES.filter((p) => p.id !== "interphase") : CELL_PHASES;
  return {
    kind: "order",
    prompt: "Put these stages of the cell cycle in order, first to last.",
    hint: "A memory trick for mitosis: PMAT (prophase, metaphase, anaphase, telophase). Interphase comes before it, and cytokinesis finishes the job.",
    items,
  };
}

function doubling(difficulty: Level): Question {
  const n = randInt(2, difficulty === 1 ? 4 : difficulty === 2 ? 5 : 7);
  const minutes = pick([20, 30, 60]);
  const total = n * minutes;
  const cells = 2 ** n;
  if (difficulty === 3 && chance(0.5)) {
    return numInput(
      `A bacterium divides into two cells every ${minutes} minutes, and every cell keeps dividing. How many divisions does it take to reach ${cells} cells from one cell?`,
      n,
      `Each division doubles the count: 1, 2, 4, 8… Keep doubling until you reach ${cells}, counting the steps.`,
    );
  }
  return numInput(
    `One cell divides by mitosis every ${minutes} minutes, and all its offspring keep dividing at the same rate. How many cells are there after ${total} minutes?`,
    cells,
    `${total} minutes is ${n} divisions. Each division doubles the number of cells, so start at 1 and double ${n} times.`,
  );
}

const CHROMOSOMES = [
  { who: "a human skin cell", n: 46 },
  { who: "a fruit fly body cell", n: 8 },
  { who: "a pea plant leaf cell", n: 14 },
  { who: "a cat body cell", n: 38 },
  { who: "a dog body cell", n: 78 },
];

function chromosomeCount(): Question {
  const c = pick(CHROMOSOMES);
  return numInput(
    `${cap(c.who)} has ${c.n} chromosomes and divides by mitosis. How many chromosomes does each new daughter cell have?`,
    c.n,
    "Mitosis makes two genetically identical cells. The cell copies its DNA first, then splits the copies evenly, so each daughter cell has the same number as the parent.",
  );
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const CELL_BANK: Item[] = [
  {
    prompt: "Which statement is part of the cell theory?",
    right: "All new cells come from existing cells",
    wrong: ["Cells appear on their own from non-living matter", "Only animals are made of cells", "Cells are the largest unit of life"],
    hint: "The cell theory says: all living things are made of cells, the cell is the basic unit of life, and all cells come from other cells.",
    emoji: "🔬",
  },
  {
    prompt: "Why do cells divide? Choose the best list of reasons.",
    right: "growth, repair and replacing worn-out cells",
    wrong: ["to get smaller, to sleep and to make energy", "to make the organism heavier only", "to turn into a different species"],
    hint: "Think of a scraped knee healing and a child getting taller. Both need more cells.",
  },
  {
    prompt: "What happens during the S phase of interphase?",
    right: "The cell copies its DNA",
    wrong: ["The nucleus disappears for good", "The cell splits in two", "Chromosomes line up in the middle"],
    hint: "S stands for synthesis. DNA is built (copied) so each new cell can receive a full set.",
    emoji: "🧬",
  },
  {
    prompt: "A cell spends most of its life in which part of the cell cycle?",
    right: "Interphase",
    wrong: ["Metaphase", "Anaphase", "Cytokinesis"],
    hint: "Mitosis itself is short. Growing, doing its job and copying DNA all happen during interphase.",
  },
  {
    prompt: "What is the result of one round of mitosis and cytokinesis?",
    right: "Two daughter cells with identical DNA to the parent cell",
    wrong: ["Four cells with half the DNA", "Two cells with different DNA from each other", "One larger cell with double the DNA"],
    hint: "Mitosis copies the DNA once and divides it once, so each daughter cell is a genetic copy of the parent.",
  },
  {
    prompt: "Which of these is one way plant and animal cell division differ?",
    right: "Plant cells build a cell plate; animal cells pinch in two",
    wrong: ["Only plant cells copy their DNA", "Only animal cells have a nucleus", "Plant cells divide without a nucleus"],
    hint: "Plant cells have a rigid cell wall, so they build a new wall (a cell plate) between the daughter cells. Animal cells pinch in the middle.",
    emoji: "🌱",
  },
  {
    prompt: "You scrape your knee. Which process helps the skin heal?",
    right: "Cells near the wound divide to fill the gap",
    wrong: ["Cells from your blood turn into a new knee", "Old cells change into stone-like scar cells", "Your cells stop dividing until it heals"],
    hint: "Healing needs new skin cells, and new cells come from existing cells dividing by mitosis.",
    emoji: "🩹",
  },
  {
    prompt: "What are chromosomes made of?",
    right: "DNA wrapped around proteins",
    wrong: ["Only water and salt", "Fats that store energy", "Cell membrane and cell wall"],
    hint: "Chromosomes carry the genetic instructions. They are long DNA molecules coiled up with proteins.",
  },
  {
    prompt: "Why must DNA be copied before a cell divides?",
    right: "So each daughter cell gets a full set of instructions",
    wrong: ["So the cell can get smaller", "So the cell can skip interphase", "So the daughter cells can be different"],
    hint: "If the DNA weren't copied first, one daughter cell would be missing instructions.",
  },
  {
    prompt: "What is cancer, in simple terms?",
    right: "A group of diseases in which cells divide in an uncontrolled way",
    wrong: ["An infection caused by too many white blood cells", "A normal stage of the cell cycle", "A disease caused only by old age"],
    hint: "Healthy cells follow signals that tell them when to divide and when to stop. In cancer, those controls stop working properly.",
  },
  {
    prompt: "Which action can lower the risk of some cancers?",
    right: "Not smoking and using sunscreen or shade",
    wrong: ["Skipping all medical check-ups", "Eating nothing but one food", "Staying indoors in the dark"],
    hint: "Tobacco smoke and too much ultraviolet (UV) radiation damage the DNA in cells. Reducing exposure lowers the risk.",
    emoji: "🧴",
  },
  {
    prompt: "Why is finding cancer early helpful?",
    right: "Treatment is often more effective when the tumour is small",
    wrong: ["Early cancers always disappear on their own", "Tumours only grow after treatment starts", "It makes the cells divide faster"],
    hint: "Smaller, localized tumours are usually easier to treat before they spread to other parts of the body.",
  },
  {
    prompt: "What is a stem cell?",
    right: "An unspecialized cell that can divide and become specialized cell types",
    wrong: ["A cell that can never divide", "A plant cell that holds up a stem", "A fully specialized nerve cell"],
    hint: "'Unspecialized' means it hasn't yet taken on one job. Under the right signals it can become different types of cells.",
    emoji: "🧫",
  },
  {
    prompt: "A person receives a bone marrow transplant. Why does this help?",
    right: "Stem cells in the marrow can make new blood cells",
    wrong: ["The marrow turns into new bones only", "The marrow stops all cell division", "The marrow makes the body's DNA"],
    hint: "Bone marrow contains stem cells that keep producing red blood cells, white blood cells and platelets.",
  },
  {
    prompt: "Every cell in your body has the same DNA. How can a muscle cell and a nerve cell look and act so differently?",
    right: "Each type uses (turns on) a different set of genes",
    wrong: ["They have completely different DNA", "Nerve cells have no DNA", "Muscle cells have extra chromosomes"],
    hint: "Specialization isn't about having different DNA. It's about which genes are switched on in each cell type.",
    hard: true,
  },
  {
    prompt: "Red blood cells have no nucleus when mature and are shaped like flattened discs. Why does this suit their job?",
    right: "There is more room to carry oxygen, and the shape lets them squeeze through tiny vessels",
    wrong: ["They need space to store DNA copies", "They must divide constantly in the blood", "They need to look like nerve cells"],
    hint: "Structure matches function. Fewer internal parts means more space for oxygen-carrying hemoglobin.",
    hard: true,
  },
  {
    prompt: "A tumour is described as 'benign'. What does that mean?",
    right: "It is a lump of cells that does not spread to other parts of the body",
    wrong: ["It has already spread everywhere", "It is made of non-living material", "It is always cured without treatment"],
    hint: "Malignant tumours can invade nearby tissue and spread. Benign ones stay in one place, though some still need treatment.",
    hard: true,
  },
  {
    prompt: "As a cell grows larger, its volume increases faster than its surface area. Why does this limit cell size and lead to division?",
    right: "The membrane cannot move enough materials in and out for such a large volume",
    wrong: ["The nucleus becomes too light to function", "Large cells cannot contain DNA", "Surface area stops mattering once a cell is big"],
    hint: "Nutrients and wastes cross the surface. A large volume needs more transport than the surface can supply, so dividing into smaller cells helps.",
    hard: true,
  },
];

const SPECIAL_SORT: SortSet = {
  prompt: "Match each cell to its job. Is it a transport or a signalling/movement cell?",
  hint: "Red blood cells and root hair cells take materials in or carry them. Nerve and muscle cells are about sending signals and producing movement.",
  bins: [
    { id: "move", label: "carries or absorbs materials", emoji: "🚚" },
    { id: "signal", label: "sends signals or makes movement", emoji: "⚡" },
  ],
  items: [
    { label: "red blood cell carrying oxygen", emoji: "🩸", bin: "move" },
    { label: "root hair cell absorbing water", emoji: "🌿", bin: "move" },
    { label: "cell lining the small intestine absorbing nutrients", emoji: "🍎", bin: "move" },
    { label: "xylem cell carrying water up a stem", emoji: "🪵", bin: "move" },
    { label: "nerve cell sending messages", emoji: "🧠", bin: "signal" },
    { label: "muscle cell contracting", emoji: "💪", bin: "signal" },
    { label: "heart muscle cell", emoji: "❤️", bin: "signal" },
    { label: "sensory cell in the eye", emoji: "👁️", bin: "signal" },
  ],
};

function cells(opts?: GenerateOptions): Question[] {
  const d = lvl(opts);
  return shuffle([
    ...levelled(CELL_BANK, 6, d),
    phaseOrder(d),
    doubling(d),
    chance(0.5) ? chromosomeCount() : sortQuestion(SPECIAL_SORT, 3),
  ]).slice(0, 8);
}

// ---------- Atoms ----------

interface El {
  z: number;
  s: string;
  n: string;
  m: number;
}

const ELEMENTS: El[] = [
  { z: 1, s: "H", n: "hydrogen", m: 1 },
  { z: 2, s: "He", n: "helium", m: 4 },
  { z: 3, s: "Li", n: "lithium", m: 7 },
  { z: 4, s: "Be", n: "beryllium", m: 9 },
  { z: 5, s: "B", n: "boron", m: 11 },
  { z: 6, s: "C", n: "carbon", m: 12 },
  { z: 7, s: "N", n: "nitrogen", m: 14 },
  { z: 8, s: "O", n: "oxygen", m: 16 },
  { z: 9, s: "F", n: "fluorine", m: 19 },
  { z: 10, s: "Ne", n: "neon", m: 20 },
  { z: 11, s: "Na", n: "sodium", m: 23 },
  { z: 12, s: "Mg", n: "magnesium", m: 24 },
  { z: 13, s: "Al", n: "aluminum", m: 27 },
  { z: 14, s: "Si", n: "silicon", m: 28 },
  { z: 15, s: "P", n: "phosphorus", m: 31 },
  { z: 16, s: "S", n: "sulfur", m: 32 },
  { z: 17, s: "Cl", n: "chlorine", m: 35 },
  { z: 18, s: "Ar", n: "argon", m: 40 },
  { z: 19, s: "K", n: "potassium", m: 39 },
  { z: 20, s: "Ca", n: "calcium", m: 40 },
];

function shells(z: number): number[] {
  const caps = [2, 8, 8, 2];
  const out: number[] = [];
  let left = z;
  for (const c of caps) {
    if (left <= 0) break;
    const k = Math.min(c, left);
    out.push(k);
    left -= k;
  }
  return out;
}

const arrangement = (z: number) => shells(z).join(", ");
const valence = (z: number) => shells(z)[shells(z).length - 1];
const maxZ = (d: Level) => (d === 1 ? 10 : d === 2 ? 18 : 20);
const pickEl = (d: Level, min = 1) => pick(ELEMENTS.filter((e) => e.z >= min && e.z <= maxZ(d)));

function valenceQ(d: Level): Question {
  const e = pickEl(d, 3);
  const sh = shells(e.z);
  return numInput(
    `${cap(e.n)} (${e.s}) has atomic number ${e.z}. How many valence electrons does a neutral atom of ${e.n} have?`,
    valence(e.z),
    `Fill the shells from the inside: 2, then 8, then 8. For ${e.z} electrons the arrangement is ${sh.join(", ")}. Valence electrons are the ones in the outermost shell: ${valence(e.z)}.`,
  );
}

function arrangementQ(d: Level): Question {
  const e = pickEl(d, 3);
  const others = sample(
    ELEMENTS.filter((o) => o.z !== e.z && Math.abs(o.z - e.z) <= 4 && o.z >= 3),
    3,
  );
  return textChoice(
    `Which electron arrangement (electrons in each shell, inner to outer) matches ${e.n}, atomic number ${e.z}?`,
    arrangement(e.z),
    others.map((o) => arrangement(o.z)),
    `A neutral atom has as many electrons as protons: ${e.z}. Fill 2 in the first shell, up to 8 in the second, up to 8 in the third. That gives ${arrangement(e.z)}.`,
  );
}

function neutronsQ(d: Level): Question {
  const e = pickEl(d, 2);
  const kind = d === 1 ? 0 : randInt(0, 2);
  if (kind === 0) {
    return numInput(
      `${cap(e.n)} has atomic number ${e.z} and mass number ${e.m}. How many neutrons are in this atom?`,
      e.m - e.z,
      `Neutrons = mass number − atomic number = ${e.m} − ${e.z}.`,
    );
  }
  if (kind === 1) {
    return numInput(
      `A neutral atom of ${e.n} has atomic number ${e.z}. How many electrons does it have?`,
      e.z,
      "In a neutral atom the positive protons and negative electrons balance, so the number of electrons equals the atomic number.",
    );
  }
  return numInput(
    `An atom has ${e.z} protons and ${e.m - e.z} neutrons. What is its mass number?`,
    e.m,
    `The mass number counts the particles in the nucleus: protons + neutrons = ${e.z} + ${e.m - e.z}.`,
  );
}

function periodQ(d: Level): Question {
  const e = pickEl(d, 3);
  if (d === 3 && chance(0.5)) {
    const g = pick(ELEMENTS.filter((x) => x.z >= 3 && x.z <= 20 && x.s !== "H"));
    const mates = ELEMENTS.filter((x) => x.z >= 3 && x.z !== g.z && valence(x.z) === valence(g.z) && x.s !== "He");
    const odd = ELEMENTS.filter((x) => x.z >= 3 && valence(x.z) !== valence(g.z));
    return textChoice(
      `Which element is most likely to have chemical properties similar to ${g.n} (${g.s})?`,
      pick(mates).n,
      sample(odd, 3).map((x) => x.n),
      `Elements in the same group have the same number of valence electrons. ${cap(g.n)} has ${valence(g.z)}, so look for another element with ${valence(g.z)} in its outer shell.`,
    );
  }
  return numInput(
    `${cap(e.n)} has the electron arrangement ${arrangement(e.z)}. Which period (row) of the periodic table is it in?`,
    shells(e.z).length,
    "The period number equals the number of occupied electron shells. Count the numbers in the arrangement.",
  );
}

const ATOM_BANK: Item[] = [
  {
    prompt: "Which particle has a negative charge?",
    right: "electron",
    wrong: ["proton", "neutron", "nucleus"],
    hint: "Protons are positive, neutrons are neutral, and electrons are negative.",
  },
  {
    prompt: "Where are protons and neutrons found in an atom?",
    right: "In the nucleus at the centre",
    wrong: ["Orbiting in the outer shells", "Only in the outermost shell", "Spread evenly through the atom"],
    hint: "Protons and neutrons make up the tiny, dense nucleus. Electrons move around it in energy levels.",
  },
  {
    prompt: "What does the atomic number of an element tell you?",
    right: "The number of protons in each atom",
    wrong: ["The number of neutrons in each atom", "The total mass of the atom in grams", "The number of shells the atom has"],
    hint: "The atomic number defines the element. Carbon always has 6 protons, no matter what else changes.",
  },
  {
    prompt: "What does a Bohr model of an atom show?",
    right: "Electrons arranged in energy levels (shells) around a nucleus",
    wrong: ["The exact path of every electron", "How many atoms are in a molecule", "The colour of the element"],
    hint: "Bohr diagrams show the nucleus in the middle and electrons in circles (shells) at different distances.",
  },
  {
    prompt: "What is the maximum number of electrons in the first shell?",
    right: "2",
    wrong: ["1", "8", "18"],
    hint: "The first shell is closest to the nucleus and holds only 2. The next holds 8.",
  },
  {
    prompt: "Why are valence electrons important?",
    right: "They are the outermost electrons and are involved in chemical bonding",
    wrong: ["They make up the nucleus", "They determine the atom's mass", "They never change in a reaction"],
    hint: "When atoms react, it is the outer electrons that are gained, lost or shared.",
  },
  {
    prompt: "Dmitri Mendeleev's periodic table was powerful because it…",
    right: "left gaps and predicted elements that had not yet been discovered",
    wrong: ["listed every element by colour", "was based on the number of neutrons", "included only metals"],
    hint: "He arranged elements by properties and atomic mass, and left spaces. Later discoveries such as gallium filled those gaps.",
    hard: true,
  },
  {
    prompt: "The modern periodic table is arranged in order of increasing…",
    right: "atomic number",
    wrong: ["atomic mass only", "number of neutrons", "melting point"],
    hint: "Atomic number (protons) is what defines each element. Mendeleev used mass, but the modern table uses atomic number.",
  },
  {
    prompt: "Isotopes of the same element have different numbers of…",
    right: "neutrons",
    wrong: ["protons", "electrons in a neutral atom", "valence shells"],
    hint: "Same protons means same element. Different neutrons means a different mass, such as carbon-12 and carbon-14.",
    hard: true,
  },
  {
    prompt: "An atom of chlorine gains one electron. What happens?",
    right: "It becomes a negative ion",
    wrong: ["It becomes a positive ion", "It becomes a different element", "It stays a neutral atom"],
    hint: "Gaining a negative particle makes the whole particle negative. The number of protons (and the element) doesn't change.",
  },
  {
    prompt: "What is the main idea of the periodic law?",
    right: "Elements show repeating patterns in properties when arranged by atomic number",
    wrong: ["Every element has the same properties", "Properties change randomly across the table", "Only elements in the same period are similar"],
    hint: "The table repeats: each new row begins with a reactive metal and ends with a noble gas, and columns share properties.",
    hard: true,
  },
  {
    prompt: "In which part of an atom is almost all of its mass found?",
    right: "The nucleus",
    wrong: ["The electron shells", "The empty space", "The outermost shell"],
    hint: "Protons and neutrons are about 1800 times heavier than an electron, so the nucleus holds nearly all the mass.",
    hard: true,
  },
];

function atoms(opts?: GenerateOptions): Question[] {
  const d = lvl(opts);
  return shuffle([
    valenceQ(d),
    arrangementQ(d),
    neutronsQ(d),
    periodQ(d),
    ...levelled(ATOM_BANK, 4, d),
  ]).slice(0, 8);
}

// ---------- Periodic table, ions and bonding ----------

const IONS: { n: string; s: string; z: number; ch: number }[] = [
  { n: "lithium", s: "Li", z: 3, ch: 1 },
  { n: "sodium", s: "Na", z: 11, ch: 1 },
  { n: "potassium", s: "K", z: 19, ch: 1 },
  { n: "beryllium", s: "Be", z: 4, ch: 2 },
  { n: "magnesium", s: "Mg", z: 12, ch: 2 },
  { n: "calcium", s: "Ca", z: 20, ch: 2 },
  { n: "aluminum", s: "Al", z: 13, ch: 3 },
  { n: "fluorine", s: "F", z: 9, ch: -1 },
  { n: "chlorine", s: "Cl", z: 17, ch: -1 },
  { n: "oxygen", s: "O", z: 8, ch: -2 },
  { n: "sulfur", s: "S", z: 16, ch: -2 },
  { n: "nitrogen", s: "N", z: 7, ch: -3 },
  { n: "phosphorus", s: "P", z: 15, ch: -3 },
];

const chargeLabel = (c: number) => `${Math.abs(c)}${c > 0 ? "+" : "−"}`;

function ionChargeQ(d: Level): Question {
  const pool = d === 1 ? IONS.filter((i) => Math.abs(i.ch) === 1 || Math.abs(i.ch) === 2) : IONS;
  const i = pick(pool);
  const v = valence(i.z);
  const wrongs = shuffle(["1+", "2+", "3+", "1−", "2−", "3−"].filter((l) => l !== chargeLabel(i.ch))).slice(0, 3);
  const how =
    i.ch > 0
      ? `It has ${v} valence electrons, so it loses ${v} to reach a full outer shell, leaving more protons than electrons: ${chargeLabel(i.ch)}.`
      : `It has ${v} valence electrons and needs ${8 - v} more for a full outer shell. Gaining ${8 - v} electrons gives it a charge of ${chargeLabel(i.ch)}.`;
  return textChoice(
    `${cap(i.n)} (${i.s}) has ${v} valence electrons. What charge does a typical ${i.s} ion have?`,
    chargeLabel(i.ch),
    wrongs,
    `${how} Metals tend to lose electrons (positive ions); non-metals tend to gain them (negative ions).`,
  );
}

function netChargeQ(): Question {
  const p = randInt(3, 17);
  const delta = pick([-3, -2, -1, 1, 2, 3]);
  const e = p + delta;
  return {
    kind: "input",
    prompt: `A particle has ${p} protons and ${e} electrons. What is its net charge? Use the minus key for a negative charge.`,
    answer: String(p - e),
    keypad: "integer",
    hint: `Net charge = protons − electrons = ${p} − ${e}. More protons than electrons is positive; more electrons is negative.`,
  };
}

function ionFormulaQ(): Question {
  const pairs: [typeof IONS[number], typeof IONS[number]][] = [];
  for (const c of IONS.filter((i) => i.ch > 0))
    for (const a of IONS.filter((i) => i.ch < 0)) {
      if (c.ch % -a.ch === 0 || -a.ch % c.ch === 0) pairs.push([c, a]);
    }
  const [c, a] = pick(pairs);
  const mag = (x: number) => Math.abs(x);
  const anionsPerCation = mag(c.ch) % mag(a.ch) === 0;
  if (anionsPerCation) {
    const n = c.ch / mag(a.ch);
    return numInput(
      `A compound forms from ${c.n} ions (${chargeLabel(c.ch)}) and ${a.n} ions (${chargeLabel(a.ch)}). The total charge must be zero. How many ${a.n} ions combine with each ${c.n} ion?`,
      n,
      `One ${c.n} ion has a charge of ${chargeLabel(c.ch)}. Each ${a.n} ion cancels ${mag(a.ch)} of that, so you need ${mag(c.ch)} ÷ ${mag(a.ch)} = ${n}.`,
    );
  }
  const n = mag(a.ch) / c.ch;
  return numInput(
    `A compound forms from ${c.n} ions (${chargeLabel(c.ch)}) and ${a.n} ions (${chargeLabel(a.ch)}). The total charge must be zero. How many ${c.n} ions combine with each ${a.n} ion?`,
    n,
    `One ${a.n} ion has a charge of ${chargeLabel(a.ch)}. Each ${c.n} ion cancels ${c.ch} of that, so you need ${mag(a.ch)} ÷ ${c.ch} = ${n}.`,
  );
}

const IONIC_SORT: SortSet = {
  prompt: "Ionic or covalent? Sort each compound.",
  hint: "A metal plus a non-metal usually transfers electrons, which makes an ionic compound. Two non-metals share electrons, which makes a covalent compound.",
  bins: [
    { id: "ionic", label: "ionic (metal + non-metal)", emoji: "🧂" },
    { id: "covalent", label: "covalent (non-metals sharing)", emoji: "🔗" },
  ],
  items: [
    { label: "table salt, NaCl", emoji: "🧂", bin: "ionic" },
    { label: "magnesium oxide, MgO", emoji: "⚪", bin: "ionic" },
    { label: "calcium fluoride, CaF₂", emoji: "🦷", bin: "ionic" },
    { label: "potassium iodide, KI", emoji: "💊", bin: "ionic" },
    { label: "water, H₂O", emoji: "💧", bin: "covalent" },
    { label: "carbon dioxide, CO₂", emoji: "☁️", bin: "covalent" },
    { label: "methane, CH₄", emoji: "🔥", bin: "covalent" },
    { label: "ammonia, NH₃", emoji: "🧴", bin: "covalent" },
  ],
};

const METAL_SORT: SortSet = {
  prompt: "Metal or non-metal? Sort each element.",
  hint: "Metals are on the left and centre of the periodic table; non-metals are mostly on the right. Metals conduct electricity and are shiny; solid non-metals are usually brittle.",
  bins: [
    { id: "metal", label: "metal", emoji: "🔩" },
    { id: "nonmetal", label: "non-metal", emoji: "🎈" },
  ],
  items: [
    { label: "sodium", emoji: "🧈", bin: "metal" },
    { label: "magnesium", emoji: "🎆", bin: "metal" },
    { label: "aluminum", emoji: "🥫", bin: "metal" },
    { label: "calcium", emoji: "🦴", bin: "metal" },
    { label: "oxygen", emoji: "💨", bin: "nonmetal" },
    { label: "sulfur", emoji: "🟡", bin: "nonmetal" },
    { label: "chlorine", emoji: "🏊", bin: "nonmetal" },
    { label: "neon", emoji: "💡", bin: "nonmetal" },
  ],
};

const BOND_BANK: Item[] = [
  {
    prompt: "What do alkali metals (Group 1) have in common?",
    right: "One valence electron and very high reactivity",
    wrong: ["A full outer shell and no reactivity", "Seven valence electrons", "They are all gases at room temperature"],
    hint: "Lithium, sodium and potassium each have 1 valence electron, which they lose easily. That makes them very reactive.",
    emoji: "🧪",
  },
  {
    prompt: "Sodium is stored under oil. Why?",
    right: "It reacts quickly with oxygen and water in the air",
    wrong: ["It would otherwise melt in the cold", "It is a gas that would escape", "It is too heavy to hold otherwise"],
    hint: "Alkali metals react with water and air. Oil keeps them away from both.",
  },
  {
    prompt: "As you move down the alkali metals (Li, Na, K), reactivity…",
    right: "increases",
    wrong: ["decreases", "stays exactly the same", "disappears"],
    hint: "Lower down the group, the outer electron is farther from the nucleus and is lost more easily, so potassium reacts more strongly than lithium.",
    hard: true,
  },
  {
    prompt: "Why are noble gases (Group 18) very unreactive?",
    right: "Their outer shells are already full",
    wrong: ["They have only one valence electron", "They have no electrons", "They are too heavy to move"],
    hint: "A full valence shell is a stable arrangement, so noble gases rarely gain, lose or share electrons.",
    emoji: "💡",
  },
  {
    prompt: "Why is helium used to fill party balloons rather than hydrogen?",
    right: "Helium is very light and does not react or burn",
    wrong: ["Helium is heavier than air", "Helium is a reactive metal", "Hydrogen is a noble gas"],
    hint: "Both are lighter than air, but hydrogen is flammable. Helium is a noble gas and does not react.",
    emoji: "🎈",
  },
  {
    prompt: "The halogens (Group 17) have how many valence electrons?",
    right: "7",
    wrong: ["1", "2", "8"],
    hint: "Fluorine and chlorine each need just one more electron to fill the outer shell, which is why they are so reactive.",
  },
  {
    prompt: "A halogen atom such as chlorine reacts with sodium. What happens to chlorine?",
    right: "It gains one electron and forms a 1− ion",
    wrong: ["It loses one electron and forms a 1+ ion", "It loses seven electrons", "Its nucleus splits"],
    hint: "Chlorine has 7 valence electrons. Gaining 1 completes the shell of 8, giving it a 1− charge.",
  },
  {
    prompt: "In ionic bonding, electrons are…",
    right: "transferred from one atom to another",
    wrong: ["shared equally between two atoms", "removed from the nucleus", "created from energy"],
    hint: "A metal gives up electrons and a non-metal accepts them. The resulting positive and negative ions attract each other.",
  },
  {
    prompt: "In covalent bonding, electrons are…",
    right: "shared between atoms",
    wrong: ["transferred entirely to one atom", "lost to the surroundings", "turned into protons"],
    hint: "Non-metal atoms each need electrons to fill their shells, so they share pairs of electrons.",
  },
  {
    prompt: "Which of these is NOT a typical property of metals?",
    right: "Brittle and a poor conductor of electricity",
    wrong: ["Shiny", "Good conductor of heat", "Can be shaped into wires"],
    hint: "Metals are malleable and ductile and conduct heat and electricity. Brittleness and poor conduction are typical of solid non-metals.",
  },
  {
    prompt: "Calcium (2 valence electrons) reacts with oxygen (6 valence electrons). What best describes the change in calcium?",
    right: "It loses 2 electrons to become Ca²⁺",
    wrong: ["It gains 6 electrons to become Ca⁶⁻", "It shares 2 electrons and stays neutral", "It loses 6 electrons"],
    hint: "Losing 2 gives calcium the same stable arrangement as argon, and the 2 electrons go to oxygen, which needs 2 to fill its shell.",
    hard: true,
  },
  {
    prompt: "A solid dissolves in water and the solution conducts electricity well. Which type of compound is it most likely?",
    right: "ionic",
    wrong: ["covalent", "an element", "a noble gas"],
    hint: "Dissolved ionic compounds split into charged ions that can carry current. Most covalent compounds do not.",
    hard: true,
  },
  {
    prompt: "Group 2 elements (alkaline earth metals) like magnesium have how many valence electrons?",
    right: "2",
    wrong: ["1", "6", "8"],
    hint: "The group number tells you the valence electrons for the main groups: Group 1 has one, Group 2 has two.",
  },
];

function bonding(opts?: GenerateOptions): Question[] {
  const d = lvl(opts);
  return shuffle([
    ionChargeQ(d),
    d === 1 ? ionChargeQ(d) : chance(0.5) ? netChargeQ() : d === 3 ? ionFormulaQ() : netChargeQ(),
    sortQuestion(pick([IONIC_SORT, METAL_SORT]), perBin(d)),
    ...levelled(BOND_BANK, 5, d),
  ]).slice(0, 8);
}

// ---------- Chemical Reactions, Acids & Bases ----------

function massQ(d: Level): Question {
  const a = randInt(2, d === 1 ? 10 : 40);
  const b = randInt(2, d === 1 ? 20 : 60);
  const total = a + b;
  const kind = d === 1 ? 0 : randInt(0, 2);
  const container = pick(["sealed flask", "sealed bag", "closed container"]);
  if (kind === 0) {
    return numInput(
      `In a ${container}, ${a} g of one substance reacts completely with ${b} g of another. What is the total mass of the products?`,
      total,
      `Matter is not created or destroyed in a closed system, so the total mass stays the same: ${a} + ${b}.`,
      "g",
    );
  }
  if (kind === 1) {
    return numInput(
      `In a ${container}, a reaction makes ${total} g of products. One reactant had a mass of ${a} g. What was the mass of the other reactant?`,
      b,
      `Mass of reactants = mass of products = ${total} g. Subtract the known reactant: ${total} − ${a}.`,
      "g",
    );
  }
  return numInput(
    `A sealed flask has a mass of ${a + total} g before a reaction. The reaction makes gas and a solid inside the flask. What is its mass after?`,
    a + total,
    "Nothing can escape from a sealed flask, so the mass before equals the mass after, even if the substances change form.",
    "g",
  );
}

const WORD_BANK: Item[] = [
  {
    prompt: "Hydrogen + oxygen → water. Which substances are the reactants?",
    right: "hydrogen and oxygen",
    wrong: ["water only", "oxygen and water", "hydrogen and water"],
    hint: "Reactants are on the left of the arrow: they are used up. The product (water) is on the right.",
  },
  {
    prompt: "In the word equation magnesium + oxygen → magnesium oxide, what is the product?",
    right: "magnesium oxide",
    wrong: ["magnesium", "oxygen", "magnesium and oxygen"],
    hint: "The product is what is made, written after the arrow.",
  },
  {
    prompt: "Which word equation shows the burning (combustion) of methane?",
    right: "methane + oxygen → carbon dioxide + water",
    wrong: ["methane + water → oxygen + carbon dioxide", "carbon dioxide + water → methane + oxygen only", "methane → oxygen + water"],
    hint: "Burning a fuel needs oxygen. Fuels that contain carbon and hydrogen make carbon dioxide and water.",
    emoji: "🔥",
  },
  {
    prompt: "Photosynthesis can be written as carbon dioxide + water → glucose + ____ .",
    right: "oxygen",
    wrong: ["hydrogen", "nitrogen", "carbon monoxide"],
    hint: "Plants release oxygen as they make glucose from carbon dioxide and water, using light energy.",
    emoji: "🌿",
  },
  {
    prompt: "Which is the best evidence that a chemical reaction has happened?",
    right: "A gas forms and the temperature changes without heating",
    wrong: ["Sugar dissolves in water", "Ice melts in a drink", "A glass is broken into pieces"],
    hint: "Chemical changes make new substances. Bubbles of a new gas, a colour change, light, heat or a new solid (precipitate) are clues. Dissolving, melting and breaking are physical changes.",
  },
  {
    prompt: "A student mixes two clear liquids and a cloudy white solid appears. This solid is called a…",
    right: "precipitate",
    wrong: ["reactant", "catalyst", "solvent"],
    hint: "A solid that forms from a reaction between solutions is a precipitate, a sign of a chemical change.",
  },
  {
    prompt: "Iron nails left outside slowly turn orange-brown. This is an example of…",
    right: "a chemical reaction between iron and oxygen (rusting)",
    wrong: ["a physical change from drying", "a change of state", "a mixture separating"],
    hint: "Rust is iron oxide, a new substance. New substance means chemical change.",
    emoji: "🔩",
  },
  {
    prompt: "Sodium + chlorine → sodium chloride. How many different elements are in the product?",
    right: "2",
    wrong: ["1", "3", "4"],
    hint: "Sodium chloride (table salt) is a compound made of sodium and chlorine only.",
  },
  {
    prompt: "A reaction gives off heat to its surroundings, and a thermometer in the mixture rises. This reaction is…",
    right: "exothermic",
    wrong: ["endothermic", "physical", "a mixture"],
    hint: "Exo means 'out'. Exothermic reactions release energy; endothermic reactions absorb it and feel cold.",
    hard: true,
  },
  {
    prompt: "A student burns a candle on a balance and the mass seems to decrease. What is the best explanation?",
    right: "Gases (carbon dioxide and water vapour) left the open system",
    wrong: ["Matter was destroyed", "Energy turned into less mass", "The wax stopped being matter"],
    hint: "The mass of the products is still there, but the gases drifted away. In a sealed container, the total mass would stay the same.",
    hard: true,
  },
  {
    prompt: "Zinc + hydrochloric acid → zinc chloride + hydrogen. How could you tell hydrogen gas is being made?",
    right: "Bubbles are seen rising from the zinc",
    wrong: ["The liquid becomes a solid immediately", "The mass of the zinc doubles", "The temperature must drop below 0 °C"],
    hint: "Bubbles of gas are a common sign of a gas product. (A lit splint can test for hydrogen, but only a teacher should do this.)",
    hard: true,
  },
];

const CHANGE_SORT: SortSet = {
  prompt: "Physical or chemical change? Sort each example.",
  hint: "A chemical change makes a new substance (burning, rusting, baking, rotting). A physical change alters form or state, such as melting, dissolving or cutting, without a new substance.",
  bins: [
    { id: "physical", label: "physical change", emoji: "🧊" },
    { id: "chemical", label: "chemical change", emoji: "🔥" },
  ],
  items: [
    { label: "ice melting", emoji: "🧊", bin: "physical" },
    { label: "sugar dissolving in tea", emoji: "🍬", bin: "physical" },
    { label: "cutting paper", emoji: "✂️", bin: "physical" },
    { label: "water boiling", emoji: "♨️", bin: "physical" },
    { label: "wood burning", emoji: "🪵", bin: "chemical" },
    { label: "milk going sour", emoji: "🥛", bin: "chemical" },
    { label: "baking a cake", emoji: "🎂", bin: "chemical" },
    { label: "silver tarnishing", emoji: "🥄", bin: "chemical" },
  ],
};

const PH_THINGS = [
  { n: "lemon juice", ph: 2 },
  { n: "vinegar", ph: 3 },
  { n: "black coffee", ph: 5 },
  { n: "pure water", ph: 7 },
  { n: "baking soda solution", ph: 8 },
  { n: "hand soap", ph: 10 },
  { n: "household ammonia cleaner", ph: 11 },
];

function phQ(d: Level): Question {
  if (d === 3 && chance(0.5)) {
    const a = randInt(1, 5);
    const diff = randInt(1, 3);
    return numInput(
      `Solution A has a pH of ${a} and solution B has a pH of ${a + diff}. About how many times more hydrogen ions does A have than B?`,
      10 ** diff,
      `Each pH step is a factor of 10. A is ${diff} step${diff > 1 ? "s" : ""} lower, so 10${diff > 1 ? ` × 10${diff > 2 ? " × 10" : ""}` : ""} = ${10 ** diff}. A lower pH means more hydrogen ions (more acidic).`,
    );
  }
  const t = d === 1 ? pick(PH_THINGS.filter((x) => [2, 7, 10, 3, 11].includes(x.ph))) : pick(PH_THINGS);
  const right = t.ph < 7 ? "acid" : t.ph > 7 ? "base" : "neutral";
  return textChoice(
    `${cap(t.n)} has a pH of about ${t.ph}. How would you classify it?`,
    right,
    ["acid", "base", "neutral"].filter((x) => x !== right),
    "pH below 7 is acidic, exactly 7 is neutral, and above 7 is basic (alkaline).",
    { type: "numberLine", min: 0, max: 14, step: 1, labelEvery: 1, marks: [t.ph] },
  );
}

const ACID_BANK: Item[] = [
  {
    prompt: "Blue litmus paper turns red in a solution. What does that tell you?",
    right: "The solution is an acid",
    wrong: ["The solution is a base", "The solution is neutral", "The solution has no dissolved substances"],
    hint: "Acids turn blue litmus red. Bases turn red litmus blue.",
    emoji: "🧪",
  },
  {
    prompt: "Which property is typical of a base?",
    right: "Feels slippery and tastes bitter (never taste lab chemicals!)",
    wrong: ["Turns blue litmus paper red", "Has a pH below 7", "Tastes sour like lemon"],
    hint: "Bases feel slippery (like soap) and taste bitter. Sourness and a pH below 7 are signs of acids.",
  },
  {
    prompt: "What are the products when an acid reacts with a base (neutralization)?",
    right: "a salt and water",
    wrong: ["a gas and a metal", "an acid and a base again", "only water vapour"],
    hint: "Neutralization example: hydrochloric acid + sodium hydroxide → sodium chloride (a salt) + water.",
  },
  {
    prompt: "Why might someone take an antacid for heartburn?",
    right: "The base in the tablet neutralizes extra stomach acid",
    wrong: ["It adds more acid", "It turns stomach acid into a gas", "It makes the stomach pH exactly 14"],
    hint: "Antacids contain bases that react with excess acid and raise the pH a little.",
    emoji: "💊",
  },
  {
    prompt: "What is acid rain mainly caused by?",
    right: "Gases such as sulfur dioxide and nitrogen oxides from burning fossil fuels",
    wrong: ["Carbon monoxide from campfires only", "Chlorine from swimming pools", "Water vapour from clouds"],
    hint: "Those gases dissolve in water in the air and form acids that fall as rain or snow, which can harm lakes, forests and buildings.",
  },
  {
    prompt: "A farmer adds lime (a base) to acidic soil. What is the purpose?",
    right: "To raise the soil's pH toward neutral",
    wrong: ["To lower the soil's pH", "To make the soil more acidic for plants", "To remove all minerals"],
    hint: "Adding a base to an acid neutralizes some of it, raising the pH.",
  },
  {
    prompt: "Which pH value represents the most acidic solution?",
    right: "1",
    wrong: ["5", "7", "13"],
    hint: "The lower the pH below 7, the stronger the acid.",
    hard: true,
  },
  {
    prompt: "Universal indicator is used because it…",
    right: "changes colour across a range of pH values",
    wrong: ["only works on bases", "always turns green", "gives the exact mass of acid"],
    hint: "It shows colours (often red for strong acids to purple for strong bases) so you can estimate pH.",
  },
  {
    prompt: "Pure water has a pH of 7. What does this tell you?",
    right: "It is neutral: neither acidic nor basic",
    wrong: ["It is a weak acid", "It is a strong base", "It has no hydrogen in it"],
    hint: "pH 7 is the neutral point, with a balance of hydrogen and hydroxide ions.",
  },
];

function reactions(opts?: GenerateOptions): Question[] {
  const d = lvl(opts);
  return shuffle([
    massQ(d),
    phQ(d),
    sortQuestion(CHANGE_SORT, perBin(d)),
    ...levelled(WORD_BANK, 3, d),
    ...levelled(ACID_BANK, 3, d),
  ]).slice(0, 8);
}

// ---------- Electricity ----------

function ohmQ(d: Level): Question {
  const rs = d === 1 ? [2, 3, 4, 5, 10] : [2, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30];
  const R = pick(rs);
  const I = randInt(1, d === 1 ? 5 : 8);
  const V = I * R;
  const kind = d === 1 ? 0 : randInt(0, 2);
  if (kind === 0) {
    return numInput(`A resistor of ${R} Ω carries a current of ${I} A. What is the voltage across it?`, V, `Ohm's law: V = I × R = ${I} × ${R}.`, "V");
  }
  if (kind === 1) {
    return numInput(`A ${V} V battery drives a current of ${I} A through a device. What is its resistance?`, R, `Rearrange V = I × R to R = V ÷ I = ${V} ÷ ${I}.`, "Ω");
  }
  return numInput(`A ${V} V supply is connected across a ${R} Ω resistor. What current flows?`, I, `Rearrange V = I × R to I = V ÷ R = ${V} ÷ ${R}.`, "A");
}

function seriesQ(d: Level): Question {
  const r1 = pick([2, 4, 6, 10]);
  const r2 = pick([2, 4, 5, 8]);
  const R = r1 + r2;
  const I = randInt(1, 4);
  const V = I * R;
  if (d === 1 || chance(0.4)) {
    return numInput(
      `Two resistors of ${r1} Ω and ${r2} Ω are connected in series. What is their total resistance?`,
      R,
      "In a series circuit there is one path, so resistances add: R_total = R₁ + R₂.",
      "Ω",
    );
  }
  return numInput(
    `A ${V} V battery is connected to a ${r1} Ω and a ${r2} Ω resistor in series. What current flows from the battery?`,
    I,
    `First add the resistances: ${r1} + ${r2} = ${R} Ω. Then I = V ÷ R = ${V} ÷ ${R}.`,
    "A",
  );
}

function parallelCurrentQ(): Question {
  const a = randInt(1, 6);
  const b = randInt(1, 6);
  return numInput(
    `In a parallel circuit, one branch carries ${a} A and another branch carries ${b} A. What is the total current from the battery?`,
    a + b,
    "In parallel the current splits between branches and recombines, so the total current is the sum of the branch currents.",
    "A",
  );
}

function powerQ(d: Level): Question {
  const kind = d === 1 ? 0 : randInt(0, 2);
  if (kind === 0) {
    const V = pick([6, 12, 24, 120]);
    const I = V === 120 ? randInt(1, 12) : randInt(1, 5);
    return numInput(`A device runs on ${V} V and draws ${I} A. How much power does it use?`, V * I, `Power = voltage × current = ${V} × ${I}.`, "W");
  }
  if (kind === 1) {
    const kw = pick([1, 2, 3]);
    const h = randInt(2, 6);
    const rate = pick([10, 12, 15]);
    return numInput(
      `A ${kw} kW electric heater runs for ${h} hours. Electricity costs ${rate}¢ per kilowatt-hour. What is the cost, in cents?`,
      kw * h * rate,
      `Energy = power × time = ${kw} kW × ${h} h = ${kw * h} kWh. Cost = ${kw * h} × ${rate}¢.`,
      "¢",
    );
  }
  const w = pick([100, 200, 500, 1000, 1500]);
  const h = pick([2, 4, 5, 10]);
  return numInput(
    `A ${w} W appliance is used for ${h} hours. How many watt-hours of energy does it use?`,
    w * h,
    `Energy = power × time = ${w} W × ${h} h.`,
    "Wh",
  );
}

const ELEC_BANK: Item[] = [
  {
    prompt: "Two plastic rods are rubbed with wool. Each ends up with a negative charge. What will happen when they are brought close together?",
    right: "They repel each other",
    wrong: ["They attract each other", "Nothing happens", "They swap charges instantly"],
    hint: "Like charges repel, opposite charges attract. Both rods are negative.",
    emoji: "⚡",
  },
  {
    prompt: "When a balloon is rubbed on hair and becomes negatively charged, what moved?",
    right: "Electrons moved from the hair to the balloon",
    wrong: ["Protons moved from the hair to the balloon", "Neutrons moved to the balloon", "Nothing moved; charge appeared from nowhere"],
    hint: "Electrons are the charges that can move easily. Protons stay in the nucleus.",
    emoji: "🎈",
  },
  {
    prompt: "What does voltage measure in a circuit?",
    right: "The energy given to each unit of charge by the source",
    wrong: ["The number of electrons in the wire", "How hard the wire is to bend", "The length of the wire"],
    hint: "Voltage (in volts) is like the 'push' that makes charge move. Think of it as electrical pressure.",
  },
  {
    prompt: "Which unit is used to measure electric current?",
    right: "ampere (A)",
    wrong: ["volt (V)", "ohm (Ω)", "watt (W)"],
    hint: "Current: amps. Voltage: volts. Resistance: ohms. Power: watts.",
  },
  {
    prompt: "Which meter must be connected in series with a device to measure current?",
    right: "an ammeter",
    wrong: ["a voltmeter", "a thermometer", "a barometer"],
    hint: "An ammeter goes in the path so the current flows through it; a voltmeter connects across (in parallel with) the device.",
    hard: true,
  },
  {
    prompt: "In a series circuit with three bulbs, one bulb burns out. What happens to the others?",
    right: "They go out, because the circuit is broken",
    wrong: ["They get brighter", "They stay on at the same brightness", "Only the next bulb goes out"],
    hint: "A series circuit has only one path. A break anywhere stops the flow everywhere.",
    emoji: "💡",
  },
  {
    prompt: "Why are the outlets in a home wired in parallel?",
    right: "Each device gets full voltage and works independently of the others",
    wrong: ["So that if one device turns off all the rest turn off", "So the current is the same everywhere", "So they use no electricity"],
    hint: "In parallel, each branch is connected across the supply, so turning one device off doesn't affect the others.",
  },
  {
    prompt: "Which material is the best electrical insulator?",
    right: "rubber",
    wrong: ["copper", "aluminum foil", "salt water"],
    hint: "Insulators don't let charge flow easily. Metals and salt water conduct.",
  },
  {
    prompt: "What happens to the resistance of a wire if it is made longer (same material and thickness)?",
    right: "It increases",
    wrong: ["It decreases", "It stays the same", "It becomes zero"],
    hint: "Charges collide with atoms along the way. A longer wire means more collisions, so more resistance.",
    hard: true,
  },
  {
    prompt: "Lightning is a very large…",
    right: "static discharge",
    wrong: ["magnetic field", "chemical reaction of the air", "series circuit"],
    hint: "Charge builds up in storm clouds until it jumps to the ground or another cloud as a huge spark.",
    hard: true,
  },
  {
    prompt: "A fuse or circuit breaker is in a circuit to…",
    right: "stop the current if it gets dangerously high",
    wrong: ["increase the voltage", "store energy for later", "make bulbs brighter"],
    hint: "Too much current heats wires and can start a fire. A fuse melts, or a breaker trips, to break the circuit.",
  },
  {
    prompt: "A third bulb is added in series to a circuit with two bulbs and a fixed battery. What happens to the brightness of each bulb?",
    right: "Each is dimmer, because the total resistance is greater",
    wrong: ["Each is brighter", "No change", "Only the new bulb lights"],
    hint: "More resistance in series means less current (I = V ÷ R), so each bulb glows less.",
    hard: true,
  },
];

const CIRCUIT_SORT: SortSet = {
  prompt: "Series or parallel? Sort each feature.",
  hint: "Series: a single path, same current everywhere, one break stops everything. Parallel: several branches, each with the full voltage, and the others keep working if one is removed.",
  bins: [
    { id: "series", label: "series circuit", emoji: "➖" },
    { id: "parallel", label: "parallel circuit", emoji: "🔀" },
  ],
  items: [
    { label: "only one path for the current", emoji: "🛤️", bin: "series" },
    { label: "current is the same in every part", emoji: "🟰", bin: "series" },
    { label: "removing one bulb turns off all the others", emoji: "🌑", bin: "series" },
    { label: "resistances add up", emoji: "➕", bin: "series" },
    { label: "more than one path for the current", emoji: "🔀", bin: "parallel" },
    { label: "each branch has the full battery voltage", emoji: "🔋", bin: "parallel" },
    { label: "removing one bulb leaves the others on", emoji: "💡", bin: "parallel" },
    { label: "household wiring", emoji: "🏠", bin: "parallel" },
  ],
};

function electricity(opts?: GenerateOptions): Question[] {
  const d = lvl(opts);
  return shuffle([
    ohmQ(d),
    d === 1 ? ohmQ(d) : seriesQ(d),
    chance(0.5) ? parallelCurrentQ() : powerQ(d),
    powerQ(d),
    sortQuestion(CIRCUIT_SORT, perBin(d)),
    ...levelled(ELEC_BANK, 3, d),
  ]).slice(0, 8);
}

// ---------- Energy ----------

function efficiencyQ(d: Level): Question {
  const total = pick([50, 100, 200, 400, 500, 1000]);
  const effs = d === 1 ? [10, 20, 25, 50, 75, 80] : [10, 20, 25, 30, 40, 50, 60, 75, 80, 90];
  const eff = pick(effs.filter((e) => (total * e) % 100 === 0));
  const useful = (total * eff) / 100;
  const device = pick(["motor", "heater", "lamp", "engine", "charger"]);
  const kind = d === 1 ? 0 : randInt(0, 2);
  if (kind === 0) {
    return numInput(
      `A ${device} takes in ${total} J of energy and gives out ${useful} J of useful energy. What is its efficiency, in percent?`,
      eff,
      `Efficiency = (useful energy out ÷ total energy in) × 100 = (${useful} ÷ ${total}) × 100.`,
      "%",
    );
  }
  if (kind === 1) {
    return numInput(
      `A ${device} is ${eff}% efficient and takes in ${total} J of energy. How much of that is useful output energy?`,
      useful,
      `Useful energy = efficiency × energy in = ${eff}% of ${total} = ${eff / 100} × ${total}.`,
      "J",
    );
  }
  return numInput(
    `A ${device} takes in ${total} J and is ${eff}% efficient. How much energy is wasted, mostly as heat?`,
    total - useful,
    `Useful output is ${eff}% of ${total} = ${useful} J. The rest is wasted: ${total} − ${useful}.`,
    "J",
  );
}

const ENERGY_BANK: Item[] = [
  {
    prompt: "A toaster is plugged in and toasts bread. What is the main energy transformation?",
    right: "electrical energy → thermal (heat) energy",
    wrong: ["chemical energy → electrical energy", "thermal energy → electrical energy", "light energy → sound energy"],
    hint: "Electric current flows through a heating element, which gets hot. The energy ends mostly as heat.",
    emoji: "🍞",
  },
  {
    prompt: "A cyclist rides down a hill without pedalling and speeds up. Which transformation is happening?",
    right: "gravitational potential energy → kinetic energy",
    wrong: ["kinetic energy → gravitational potential energy", "chemical energy → nuclear energy", "sound energy → light energy"],
    hint: "Going downhill, height (potential energy) is lost and speed (kinetic energy) is gained.",
    emoji: "🚴",
  },
  {
    prompt: "What does the law of conservation of energy say?",
    right: "Energy cannot be created or destroyed, only changed from one form to another",
    wrong: ["Energy is used up and disappears", "Machines can create energy", "Energy can be destroyed by friction"],
    hint: "Friction turns some energy into heat, but the total amount stays the same.",
  },
  {
    prompt: "A wind turbine produces electricity. What is the transformation?",
    right: "kinetic energy of wind → electrical energy",
    wrong: ["chemical energy → electrical energy", "nuclear energy → kinetic energy", "light energy → sound energy"],
    hint: "Moving air spins the blades, and a generator changes that motion into electrical energy.",
    emoji: "🌬️",
  },
  {
    prompt: "A solar cell converts…",
    right: "light energy into electrical energy",
    wrong: ["heat into sound", "electrical energy into light", "chemical energy into motion"],
    hint: "Photovoltaic cells use sunlight to push electrons through a circuit.",
    emoji: "☀️",
  },
  {
    prompt: "Why is no machine 100% efficient?",
    right: "Some energy is always transformed into unwanted forms such as heat and sound",
    wrong: ["Energy is destroyed by machines", "Machines make new energy", "Efficiency is only about speed"],
    hint: "Friction and other effects send some energy to the surroundings as heat. It isn't lost; it just isn't useful.",
  },
  {
    prompt: "Which light bulb wastes the least energy as heat for the same amount of light?",
    right: "an LED bulb",
    wrong: ["an incandescent bulb", "a candle", "a bulb with a dirty glass cover"],
    hint: "Incandescent bulbs make light by heating a filament, so most energy becomes heat. LEDs turn more of it into light.",
    emoji: "💡",
  },
  {
    prompt: "Which of these is a renewable energy source?",
    right: "hydroelectric power from flowing water",
    wrong: ["coal", "natural gas", "oil"],
    hint: "Renewable sources are replenished naturally on a human timescale, like sunlight, wind and flowing water. Fossil fuels took millions of years.",
  },
  {
    prompt: "A campfire gives out heat by which transfer to people standing across from it?",
    right: "radiation",
    wrong: ["conduction", "convection", "condensation"],
    hint: "Radiation travels as waves and needs no material. Conduction passes through touching matter, and convection is movement of fluids.",
    hard: true,
  },
  {
    prompt: "A metal spoon in a hot soup gets hot at the handle. This heat transfer is…",
    right: "conduction",
    wrong: ["radiation", "convection", "evaporation"],
    hint: "Heat passes through the solid from particle to particle, which is conduction.",
  },
  {
    prompt: "Warm air rises above a heater and cooler air sinks to replace it. This circulation is…",
    right: "convection",
    wrong: ["conduction", "radiation", "insulation"],
    hint: "Convection is heat carried by the movement of a fluid (liquid or gas).",
  },
  {
    prompt: "A battery-powered torch lights up. Which sequence best shows the energy?",
    right: "chemical → electrical → light (and some heat)",
    wrong: ["light → electrical → chemical", "electrical → chemical → heat only", "thermal → chemical → sound"],
    hint: "The battery stores chemical energy, which becomes electrical energy in the circuit, then light, with some heat wasted.",
    hard: true,
  },
  {
    prompt: "A hybrid car's brakes recover some energy as the car slows. What is converted?",
    right: "kinetic energy into electrical energy stored in the battery",
    wrong: ["electrical energy into kinetic energy only", "heat into chemical fuel", "light into motion"],
    hint: "Regenerative braking turns the car's motion into electricity instead of just wasting it as heat.",
    hard: true,
  },
];

const SOURCE_SORT: SortSet = {
  prompt: "Renewable or non-renewable? Sort each energy source.",
  hint: "Renewable sources are replaced naturally quickly enough to keep using them (sun, wind, water, geothermal). Fossil fuels and uranium are limited supplies.",
  bins: [
    { id: "renew", label: "renewable", emoji: "♻️" },
    { id: "nonrenew", label: "non-renewable", emoji: "⛽" },
  ],
  items: [
    { label: "solar", emoji: "☀️", bin: "renew" },
    { label: "wind", emoji: "🌬️", bin: "renew" },
    { label: "hydro (flowing water)", emoji: "🌊", bin: "renew" },
    { label: "geothermal", emoji: "🌋", bin: "renew" },
    { label: "coal", emoji: "⚫", bin: "nonrenew" },
    { label: "natural gas", emoji: "🔥", bin: "nonrenew" },
    { label: "oil", emoji: "🛢️", bin: "nonrenew" },
    { label: "uranium (nuclear)", emoji: "☢️", bin: "nonrenew" },
  ],
};

function energy(opts?: GenerateOptions): Question[] {
  const d = lvl(opts);
  return shuffle([efficiencyQ(d), efficiencyQ(d), sortQuestion(SOURCE_SORT, perBin(d)), ...levelled(ENERGY_BANK, 5, d)]).slice(0, 8);
}

// ---------- Cycles & Ecosystems ----------

const CARBON_STEPS = [
  { id: "co2", label: "Plants take in carbon dioxide from the air", emoji: "🌿" },
  { id: "photo", label: "Photosynthesis builds the carbon into sugars", emoji: "☀️" },
  { id: "eat", label: "An animal eats the plant, passing the carbon on", emoji: "🐄" },
  { id: "resp", label: "Cellular respiration returns carbon dioxide to the air", emoji: "💨" },
];

const WATER_STEPS = [
  { id: "evap", label: "The sun heats water; it evaporates into vapour", emoji: "♨️" },
  { id: "cond", label: "Vapour cools and condenses into clouds", emoji: "☁️" },
  { id: "precip", label: "Water falls as rain or snow (precipitation)", emoji: "🌧️" },
  { id: "run", label: "Runoff and groundwater flow back to lakes and oceans", emoji: "🏞️" },
];

const NITROGEN_STEPS = [
  { id: "air", label: "Nitrogen gas (N₂) makes up most of the air", emoji: "🌬️" },
  { id: "fix", label: "Bacteria convert it into forms plants can use (nitrogen fixation)", emoji: "🦠" },
  { id: "plant", label: "Plants absorb nitrates through their roots", emoji: "🌱" },
  { id: "eat", label: "Animals get nitrogen by eating plants or other animals", emoji: "🐇" },
  { id: "decomp", label: "Decomposers return nitrogen to the soil from waste and dead organisms", emoji: "🍄" },
];

function cycleOrder(d: Level): OrderQuestion {
  const t = pick(d === 1 ? [{ n: "water cycle", s: WATER_STEPS }] : d === 2 ? [{ n: "water cycle", s: WATER_STEPS }, { n: "carbon cycle", s: CARBON_STEPS }] : [{ n: "carbon cycle", s: CARBON_STEPS }, { n: "nitrogen cycle", s: NITROGEN_STEPS }]);
  return {
    kind: "order",
    prompt: `Put these steps of one path through the ${t.n} in order.`,
    hint: t.n === "water cycle"
      ? "Water evaporates, then condenses into clouds, falls as precipitation, and collects or runs off before the cycle repeats."
      : t.n === "carbon cycle"
        ? "Plants take in CO₂ first. Then the carbon moves to animals through food, and respiration returns CO₂ to the air."
        : "Start with nitrogen in the air, then bacteria make it usable, plants absorb it, animals eat the plants, and decomposers return it.",
    items: t.s,
  };
}

function energyPyramidQ(d: Level): Question {
  const e0 = pick([10000, 20000, 50000, 100000]);
  const level = d === 1 ? 2 : randInt(2, 4);
  const names = ["producers", "primary consumers", "secondary consumers", "tertiary consumers"];
  const val = e0 / 10 ** (level - 1);
  return numInput(
    `Producers in an ecosystem capture ${e0} kJ of energy. About 10% is passed up to each next trophic level. How much energy reaches the ${names[level - 1]}?`,
    val,
    `Multiply by 10% (divide by 10) for each step up: ${level - 1} step${level > 2 ? "s" : ""} from the producers. ${e0} ÷ ${10 ** (level - 1)} = ${val}.`,
    "kJ",
  );
}

const CYCLE_BANK: Item[] = [
  {
    prompt: "Which process removes carbon dioxide from the atmosphere?",
    right: "Photosynthesis",
    wrong: ["Respiration", "Burning fossil fuels", "Decomposition"],
    hint: "Plants, algae and some bacteria use CO₂, water and light to make sugars. The other three put CO₂ into the air.",
    emoji: "🌳",
  },
  {
    prompt: "Burning coal, oil and natural gas affects the carbon cycle by…",
    right: "moving carbon stored underground into the atmosphere as CO₂",
    wrong: ["removing carbon from the air", "stopping photosynthesis everywhere", "creating new carbon atoms"],
    hint: "Fossil fuels hold carbon from ancient organisms. Burning releases it quickly as carbon dioxide.",
  },
  {
    prompt: "What is transpiration?",
    right: "Plants releasing water vapour through their leaves",
    wrong: ["Rain falling on leaves", "Water freezing in plants", "Roots absorbing minerals"],
    hint: "Water goes up from the roots and exits through tiny leaf pores as vapour. It is part of the water cycle.",
    emoji: "🍃",
  },
  {
    prompt: "Which part of the water cycle makes clouds?",
    right: "Condensation",
    wrong: ["Evaporation", "Runoff", "Infiltration"],
    hint: "Water vapour cools and turns back into tiny droplets, forming clouds.",
  },
  {
    prompt: "Why can't most plants use nitrogen gas straight from the air?",
    right: "They need nitrogen in compounds such as nitrates, made by bacteria or lightning",
    wrong: ["Air has almost no nitrogen", "Nitrogen is poisonous to plants", "Plants only take nitrogen from rain"],
    hint: "About 78% of air is N₂, but the strong bond between nitrogen atoms makes it hard to use. Nitrogen-fixing bacteria make it available.",
  },
  {
    prompt: "Beans and peas have root nodules that contain…",
    right: "nitrogen-fixing bacteria",
    wrong: ["decomposers that eat the roots", "fungi that make carbon dioxide", "water-storing cells"],
    hint: "These bacteria turn atmospheric nitrogen into compounds, which helps the plant grow in poor soil.",
    hard: true,
  },
  {
    prompt: "What is the main role of decomposers in an ecosystem?",
    right: "Break down dead organisms and wastes, returning nutrients to the soil",
    wrong: ["Capture energy from the sun", "Hunt other animals", "Make the water cycle happen"],
    hint: "Fungi and bacteria recycle matter so that nutrients are available to producers again.",
    emoji: "🍄",
  },
  {
    prompt: "Where does almost all the energy in most ecosystems come from?",
    right: "The sun",
    wrong: ["The soil", "Decomposers", "The moon"],
    hint: "Producers capture sunlight and make food, which passes energy to every other level.",
  },
  {
    prompt: "Energy flows through an ecosystem in one direction, while matter…",
    right: "is recycled",
    wrong: ["also flows one way and is lost", "is created by consumers", "is destroyed by decomposers"],
    hint: "Energy is lost as heat at each level, so it needs constant input from the sun. Atoms such as carbon and nitrogen are reused over and over.",
    hard: true,
  },
  {
    prompt: "Why are food chains usually only 4 or 5 links long?",
    right: "Only about 10% of energy passes up each level, so little is left at the top",
    wrong: ["Animals refuse to eat larger prey", "Predators run out of space", "Plants stop growing after five years"],
    hint: "Most energy at each level is used for life processes or lost as heat, leaving too little to support more levels.",
    hard: true,
  },
  {
    prompt: "Fertilizer from a farm washes into a lake. Algae grow rapidly, then die and decompose, using up the oxygen. This is called…",
    right: "eutrophication",
    wrong: ["photosynthesis", "condensation", "transpiration"],
    hint: "Extra nitrogen and phosphorus feed algae blooms. The decomposition of dead algae can use up oxygen that fish need.",
    hard: true,
  },
  {
    prompt: "In a food web, which organisms are the producers?",
    right: "Green plants and algae",
    wrong: ["Herbivores", "Carnivores", "Fungi"],
    hint: "Producers make their own food from sunlight. Everything else eats something else.",
  },
  {
    prompt: "Oceans and forests are called carbon sinks. What does this mean?",
    right: "They absorb and store more carbon than they release",
    wrong: ["They release all carbon to space", "They have no carbon", "They make new carbon from nothing"],
    hint: "A sink takes in carbon dioxide (through photosynthesis or dissolving). Protecting forests helps keep carbon out of the atmosphere.",
  },
];

function cycles(opts?: GenerateOptions): Question[] {
  const d = lvl(opts);
  return shuffle([cycleOrder(d), energyPyramidQ(d), ...levelled(CYCLE_BANK, 6, d)]).slice(0, 8);
}

// ---------- Climate & Sustainability ----------

const CO2_ROWS: [number, number][] = [
  [1960, 317],
  [1980, 339],
  [2000, 369],
  [2020, 414],
];

function co2Q(d: Level): Question {
  const visual = {
    type: "table" as const,
    title: "Carbon dioxide in the air (rounded yearly averages, parts per million)",
    headers: ["Year", "CO₂ (ppm)"],
    rows: CO2_ROWS.map(([y, v]) => [y, v]),
  };
  const [i, j] = d === 1 ? [0, 3] : pick([[0, 1], [1, 2], [2, 3], [0, 2], [1, 3]]);
  const diff = CO2_ROWS[j][1] - CO2_ROWS[i][1];
  if (d === 3 && chance(0.5)) {
    return textChoice(
      "Which statement does the data table support?",
      "CO₂ rose over the period, and the rise was larger between 2000 and 2020 than between 1960 and 1980",
      [
        "CO₂ stayed about the same over the period",
        "CO₂ fell between 1980 and 2020",
        "CO₂ rose faster between 1960 and 1980 than between 2000 and 2020",
      ],
      "Subtract to compare: 1960–1980 rose 339 − 317 = 22 ppm; 2000–2020 rose 414 − 369 = 45 ppm. The rise has been speeding up.",
      visual,
    );
  }
  return numInput(
    `By how much did the CO₂ concentration rise from ${CO2_ROWS[i][0]} to ${CO2_ROWS[j][0]}?`,
    diff,
    `Subtract the earlier value from the later one: ${CO2_ROWS[j][1]} − ${CO2_ROWS[i][1]}.`,
    "ppm",
    visual,
  );
}

const CLIMATE_BANK: Item[] = [
  {
    prompt: "What is the greenhouse effect?",
    right: "Gases in the atmosphere trap some of the heat given off by Earth's surface",
    wrong: ["Plants make greenhouses warmer", "The ozone layer reflects all sunlight", "The sun gets hotter each year"],
    hint: "Sunlight warms Earth. Greenhouse gases absorb and re-emit part of the outgoing heat, keeping the planet warmer.",
    emoji: "🌡️",
  },
  {
    prompt: "Without any natural greenhouse effect, Earth's average temperature would be about −18 °C instead of about 15 °C. What does this tell you?",
    right: "The natural greenhouse effect is needed for life as we know it",
    wrong: ["Greenhouse gases are always harmful", "Earth would be warmer without them", "The effect is only caused by humans"],
    hint: "The natural effect keeps Earth habitable. The concern is that human activity is making it stronger.",
    hard: true,
  },
  {
    prompt: "Which of these is a greenhouse gas?",
    right: "methane",
    wrong: ["argon", "helium", "oxygen (O₂)"],
    hint: "Carbon dioxide, methane, nitrous oxide and water vapour trap heat. The main gases oxygen, nitrogen and argon do not.",
  },
  {
    prompt: "Which human activity adds the most carbon dioxide to the atmosphere?",
    right: "Burning fossil fuels for energy and transport",
    wrong: ["Breathing", "Boiling water", "Planting trees"],
    hint: "Fossil fuel use releases carbon that was locked underground for millions of years. Planting trees removes CO₂.",
  },
  {
    prompt: "What is the difference between weather and climate?",
    right: "Weather is short-term conditions; climate is the average pattern over many years",
    wrong: ["They mean the same thing", "Weather is the average over decades", "Climate changes every hour"],
    hint: "A cold day is weather. The typical conditions of a region over 30 years or more are its climate.",
  },
  {
    prompt: "Which is evidence that Earth's climate is warming?",
    right: "Glaciers and Arctic sea ice are shrinking",
    wrong: ["It snowed on one day this winter", "Some mountains are very tall", "The ocean is salty"],
    hint: "Look for long-term trends measured by many scientists around the world, not one day's weather.",
    emoji: "🧊",
  },
  {
    prompt: "Scientists study air bubbles trapped in ice cores. What can they learn?",
    right: "What the atmosphere was like thousands of years ago",
    wrong: ["Tomorrow's weather", "How many people lived in a city", "The depth of the ocean"],
    hint: "Ice builds up in layers. Old air trapped in bubbles reveals past levels of gases like CO₂.",
    hard: true,
  },
  {
    prompt: "Why does melting land ice (such as glaciers) raise sea level, but melting floating sea ice does not by much?",
    right: "Land ice adds new water to the ocean; floating ice already displaces its own weight of water",
    wrong: ["Sea ice is made of different water", "Glaciers float on the ocean", "Warm water shrinks"],
    hint: "Think of ice cubes in a glass: melting floating ice barely changes the level. Water from land ice flows in as extra volume. Warming ocean water also expands.",
    hard: true,
  },
  {
    prompt: "Which action is an example of climate mitigation (reducing the causes)?",
    right: "Switching a city's buses from diesel to electric power",
    wrong: ["Building a sea wall to hold back rising water", "Planting drought-tolerant crops", "Moving homes away from a flooded shore"],
    hint: "Mitigation cuts greenhouse gas emissions or removes them. Adaptation helps people cope with changes that are happening.",
  },
  {
    prompt: "A coastal town builds a sea wall because of rising seas. This is an example of…",
    right: "adaptation",
    wrong: ["mitigation", "denial", "photosynthesis"],
    hint: "Adaptation means adjusting to climate impacts. It doesn't reduce emissions by itself.",
  },
  {
    prompt: "What does a 'carbon footprint' measure?",
    right: "The greenhouse gases released by a person, product or group's activities",
    wrong: ["The size of a person's shoe", "The weight of coal a person owns", "How much carbon is in the soil"],
    hint: "It adds up emissions from things like travel, home energy and food.",
  },
  {
    prompt: "Which choice does the most to cut a household's carbon footprint over time?",
    right: "Heating with electricity from renewable sources and improving insulation",
    wrong: ["Leaving lights on all day", "Driving short trips alone every day", "Running appliances half-empty"],
    hint: "Heating and transportation are big sources of household emissions, so changes there matter most.",
  },
  {
    prompt: "What is sustainability?",
    right: "Meeting present needs without harming the ability of future generations to meet theirs",
    wrong: ["Using up resources as fast as possible", "Never using any resources at all", "Only caring about the economy"],
    hint: "A sustainable choice considers the environment, people and the economy over the long term.",
  },
  {
    prompt: "Which statement is the most scientific about the cause of recent warming?",
    right: "Multiple lines of evidence show that human greenhouse gas emissions are the main cause",
    wrong: ["Scientists have no evidence either way", "It is caused by only the sun getting brighter", "It is caused by the phases of the moon"],
    hint: "Scientists compare many types of evidence (gases, temperatures, ice, oceans). Solar activity has not risen enough to explain the warming of recent decades.",
    hard: true,
  },
  {
    prompt: "Methane, a strong greenhouse gas, is released by…",
    right: "livestock, landfills and leaks from natural gas systems",
    wrong: ["only volcanoes", "wind turbines", "solar panels"],
    hint: "Methane comes from digestion in cattle, decomposing waste without oxygen and fossil fuel leaks.",
    hard: true,
  },
];

const ACTION_SORT: SortSet = {
  prompt: "Mitigation or adaptation? Sort each climate action.",
  hint: "Mitigation reduces greenhouse gas emissions or stores carbon. Adaptation helps people and nature cope with the changes already under way.",
  bins: [
    { id: "mit", label: "mitigation (cut the causes)", emoji: "✂️" },
    { id: "adapt", label: "adaptation (cope with changes)", emoji: "🛡️" },
  ],
  items: [
    { label: "building wind farms", emoji: "🌬️", bin: "mit" },
    { label: "planting forests", emoji: "🌲", bin: "mit" },
    { label: "improving home insulation", emoji: "🏠", bin: "mit" },
    { label: "expanding public transit", emoji: "🚌", bin: "mit" },
    { label: "building flood barriers", emoji: "🧱", bin: "adapt" },
    { label: "developing heat-tolerant crops", emoji: "🌾", bin: "adapt" },
    { label: "adding shade and cooling centres in cities", emoji: "⛱️", bin: "adapt" },
    { label: "improving early wildfire warnings", emoji: "🚨", bin: "adapt" },
  ],
};

function climate(opts?: GenerateOptions): Question[] {
  const d = lvl(opts);
  return shuffle([co2Q(d), sortQuestion(ACTION_SORT, perBin(d)), ...levelled(CLIMATE_BANK, 6, d)]).slice(0, 8);
}

// ---------- Indigenous Knowledge & Stewardship ----------

const INDIG_BANK: Item[] = [
  {
    prompt: "How has Indigenous knowledge of the land been developed and passed on?",
    right: "Through careful observation over many generations, shared in stories, language and practice",
    wrong: ["Only in the last twenty years by laboratory tests", "By guessing, without observation", "It cannot be passed on"],
    hint: "Many Indigenous communities have lived in relationship with the same lands for thousands of years, learning from experience and teaching younger people.",
  },
  {
    prompt: "Which statement is respectful and accurate?",
    right: "Indigenous peoples are diverse, and knowledge and practices differ between Nations",
    wrong: ["All Indigenous peoples share exactly the same beliefs and practices", "Indigenous knowledge belongs only to the past", "There are no Indigenous scientists today"],
    hint: "First Nations, Métis and Inuit have many distinct languages, cultures and territories. Their knowledge is alive today.",
  },
  {
    prompt: "In many Indigenous worldviews, people are…",
    right: "part of the land and responsible for caring for it, now and for future generations",
    wrong: ["separate from and in charge of nature", "only visitors who never use resources", "not connected to any place"],
    hint: "Stewardship is about reciprocity and responsibility: taking care of the land that provides for you.",
  },
  {
    prompt: "Some coastal First Nations on the Pacific coast built rock-walled 'clam gardens' in the intertidal zone. What was the effect?",
    right: "They made better habitat so that more clams could grow",
    wrong: ["They stopped the tide from ever coming in", "They killed all the shellfish", "They were used only for decoration"],
    hint: "The walls created a gentler slope in the sand, which helped clams grow in larger numbers. These gardens are still being studied and, in places, restored with communities.",
    hard: true,
  },
  {
    prompt: "Some Indigenous communities have used planned, low-intensity fires on the land for many generations. What can this do?",
    right: "Reduce the build-up of fuel that feeds large wildfires and support useful plants",
    wrong: ["Destroy all the forest on purpose", "Make the soil impossible to grow in", "Attract wildfires from far away"],
    hint: "Carefully managed burning, led by knowledgeable people, can clear brush and help some plants and animals. Today, many fire agencies work with Indigenous communities on this.",
    hard: true,
  },
  {
    prompt: "'Two-Eyed Seeing' was described by Mi'kmaw Elder Albert Marshall. What is the idea?",
    right: "Using the strengths of Indigenous ways of knowing with one eye and Western science with the other, and using both together",
    wrong: ["Using only Western science and ignoring other knowledge", "Using only one way of knowing for every question", "Looking at things with only one eye"],
    hint: "It is a way of bringing knowledge systems together respectfully for the benefit of all.",
  },
  {
    prompt: "A scientist wants to share an Indigenous community's knowledge of local plants. What is the respectful approach?",
    right: "Ask permission, work with the community and credit them",
    wrong: ["Use it freely without asking, since it's public", "Publish it and claim it as new discoveries", "Guess without speaking to the community"],
    hint: "Knowledge belongs to the community that holds it. Respect means consent, partnership and giving credit.",
  },
  {
    prompt: "Many First Nations in Canada have depended on salmon for thousands of years. What practice shows stewardship?",
    right: "Harvesting in ways that leave enough fish to return and spawn",
    wrong: ["Taking every fish found", "Blocking rivers so fish can't move", "Never fishing at all"],
    hint: "Stewardship means making sure the salmon runs stay healthy so they can feed people for generations.",
  },
  {
    prompt: "What are Indigenous Protected and Conserved Areas (IPCAs)?",
    right: "Lands and waters where Indigenous governments have the primary role in protecting and conserving ecosystems",
    wrong: ["Zoos run by the provincial government", "Mining zones", "Private farms with no rules"],
    hint: "IPCAs are led by Indigenous peoples and rooted in their laws and knowledge systems.",
    hard: true,
  },
  {
    prompt: "Why is local Indigenous knowledge useful to scientists studying climate change?",
    right: "People living in a place for generations can notice long-term changes in plants, animals, weather and ice",
    wrong: ["It replaces all measurements", "It only describes events from the last week", "It has no connection to the environment"],
    hint: "Long-term, place-based observation, such as when ice freezes or when animals appear, gives important information to combine with scientific data.",
  },
  {
    prompt: "Many Indigenous languages have precise words for local plants, animals and seasons. Why does losing a language matter for science?",
    right: "Knowledge about the land is often carried in the language",
    wrong: ["Language has no connection to knowledge", "Words for plants are never needed", "Only translated books hold knowledge"],
    hint: "Languages hold detailed knowledge, stories and relationships to place. That is why language revitalization is important.",
    hard: true,
  },
  {
    prompt: "Which action best shows that you care for the land where you live?",
    right: "Learning whose traditional territory you are on and taking part in local restoration or clean-up",
    wrong: ["Ignoring where your food comes from", "Leaving garbage in parks", "Believing that one person's choices never matter"],
    hint: "Stewardship starts with learning about the place and its history, then acting to protect it.",
  },
];

function indigenous(opts?: GenerateOptions): Question[] {
  const d = lvl(opts);
  return shuffle(levelled(INDIG_BANK, 8, d));
}

// ---------- Scientific Inquiry & Data ----------

function meanQ(d: Level): Question {
  const n = d === 1 ? 3 : 5;
  const mean = randInt(25, 45);
  const vals: number[] = [];
  let total = 0;
  for (let i = 0; i < n - 1; i++) {
    const v = mean + randInt(-5, 5);
    vals.push(v);
    total += v;
  }
  vals.push(mean * n - total);
  const list = shuffle(vals);
  return numInput(
    `Trial results for how long a plant took to sprout were ${list.join(", ")} hours. What is the mean (average)?`,
    mean,
    `Add all the values (${vals.reduce((a, b) => a + b, 0)}) and divide by the number of trials (${n}).`,
    "h",
  );
}

function slopeQ(d: Level): Question {
  const v = randInt(2, d === 1 ? 4 : 6);
  const pts: { x: number; y: number }[] = [];
  for (let x = 0; x <= 10; x += 1) pts.push({ x, y: x * v });
  return numInput(
    `The graph shows distance against time for a toy car moving at a steady speed. What is its speed?`,
    v,
    `Speed is the slope: rise ÷ run. From the labelled point (4, ${4 * v}): ${4 * v} m ÷ 4 s = ${v} m/s.`,
    "m/s",
    {
      type: "plot",
      xMin: 0,
      xMax: 10,
      yMin: 0,
      yMax: 10 * v,
      step: 2,
      curves: [{ points: pts, label: "toy car" }],
      points: [{ x: 4, y: 4 * v, label: `(4, ${4 * v})` }],
    },
  );
}

function unitQ(): Question {
  const cases = [
    { from: "kilograms", to: "grams", f: 1000, unit: "g", label: "kg" },
    { from: "litres", to: "millilitres", f: 1000, unit: "mL", label: "L" },
    { from: "kilometres", to: "metres", f: 1000, unit: "m", label: "km" },
    { from: "metres", to: "centimetres", f: 100, unit: "cm", label: "m" },
  ];
  const c = pick(cases);
  const a = randInt(2, 9);
  return numInput(`Convert ${a} ${c.from} (${a} ${c.label}) to ${c.to}.`, a * c.f, `Multiply by ${c.f}: there are ${c.f} ${c.to} in 1 ${c.from.slice(0, -1)}. ${a} × ${c.f}.`, c.unit);
}

const INQUIRY_BANK: Item[] = [
  {
    prompt: "A student tests whether fertilizer amount changes how tall bean plants grow. What is the independent variable?",
    right: "The amount of fertilizer",
    wrong: ["The height of the plants", "The type of bean", "The amount of light"],
    hint: "The independent variable is the one you change on purpose. The one you measure is the dependent variable.",
  },
  {
    prompt: "In that same experiment, what is the dependent variable?",
    right: "The height of the plants",
    wrong: ["The amount of fertilizer", "The pots used", "The room temperature"],
    hint: "The dependent variable is what you measure to see the effect of your change.",
  },
  {
    prompt: "In that experiment, why should every plant get the same amount of light and water?",
    right: "These are controlled variables, so only fertilizer can explain any difference",
    wrong: ["So the plants grow equally tall", "So the plants don't need soil", "So the data is not needed"],
    hint: "A fair test changes one variable at a time and keeps all the others the same.",
  },
  {
    prompt: "Which is a testable hypothesis?",
    right: "If the temperature of the water is raised, then sugar will dissolve faster",
    wrong: ["Warm water is nicer", "Sugar is the best substance", "Everyone likes dissolving things"],
    hint: "A good hypothesis predicts a relationship between variables that can be measured.",
  },
  {
    prompt: "Why do scientists repeat their trials?",
    right: "To check results are reliable and reduce the effect of chance errors",
    wrong: ["To make the data look better", "Because one trial is never allowed", "To get the answer they want"],
    hint: "Repeated results that agree make a finding more trustworthy.",
  },
  {
    prompt: "Which graph is best for showing how a temperature changes over 24 hours?",
    right: "A line graph",
    wrong: ["A pie chart", "A pictograph with one icon", "A bar graph of the names of the days"],
    hint: "Line graphs show change in a continuous measurement over time.",
  },
  {
    prompt: "Which graph is best for comparing the number of students who chose each of five favourite sports?",
    right: "A bar graph",
    wrong: ["A line graph over time", "A scatter plot with no categories", "A map"],
    hint: "Bar graphs compare separate categories.",
  },
  {
    prompt: "A result is far away from all the others in a data set. What is the best first step?",
    right: "Check for a possible mistake in measuring or recording, and report it honestly",
    wrong: ["Delete it without telling anyone", "Change it to match the others", "Throw out the whole experiment"],
    hint: "Never remove data just because it doesn't fit. Investigate the cause and be transparent about what you did.",
  },
  {
    prompt: "A scale reads 12.0 g, 12.1 g and 11.9 g for the same object, but the object's true mass is 15 g. These measurements are…",
    right: "precise but not accurate",
    wrong: ["accurate but not precise", "both accurate and precise", "neither precise nor reliable"],
    hint: "Precise means the readings are close together. Accurate means close to the true value.",
    hard: true,
  },
  {
    prompt: "A student concludes that ice cream sales cause sunburns because both rise in summer. What is the flaw?",
    right: "Two things rising together doesn't prove one causes the other; another factor (hot sunny weather) may cause both",
    wrong: ["Sunburns happen only in winter", "Ice cream is a medicine", "The data can't be graphed"],
    hint: "Correlation is not causation. Look for a third factor that affects both.",
    hard: true,
  },
  {
    prompt: "What makes a scientific source more credible?",
    right: "It is peer-reviewed or comes from experts, and others can check its evidence",
    wrong: ["It has many ads", "It agrees with what you already think", "It was shared by many people online"],
    hint: "Check who wrote it, what evidence they used and whether independent experts reviewed it.",
  },
  {
    prompt: "Why do scientists use SI units like metres and kilograms?",
    right: "Everyone around the world can compare and share measurements",
    wrong: ["They are older than other units", "They make numbers bigger", "They cannot be converted"],
    hint: "A shared system avoids confusion and mistakes when results are compared.",
  },
  {
    prompt: "A graph's data points make a clear straight line going up to the right. What does this suggest?",
    right: "The two variables have a steady, proportional relationship",
    wrong: ["The data is random", "The measurements must be wrong", "The dependent variable never changes"],
    hint: "A straight line through the origin means the quantities change at a constant rate together.",
    hard: true,
  },
];

function inquiry(opts?: GenerateOptions): Question[] {
  const d = lvl(opts);
  return shuffle([meanQ(d), chance(0.5) ? slopeQ(d) : unitQ(), unitQ(), ...levelled(INQUIRY_BANK, 5, d)]).slice(0, 8);
}

export const course: Course = {
  grade: "9",
  subject: "science",
  bigIdeas: {
    "ca-bc": [
      "The cell is the basic unit of life, and all cells come from other cells (cell division is how organisms grow and repair).",
      "The electron arrangement of atoms helps us to understand patterns in the periodic table and how elements combine.",
      "Matter is conserved in chemical reactions and can be described and predicted.",
      "Electric current is the flow of electric charge, and its behaviour in circuits depends on voltage and resistance.",
      "Energy is conserved and its transformation can be traced and measured, but it is never transformed with perfect efficiency.",
      "Life on Earth depends on interactions among the spheres and on cycles of matter and the flow of energy.",
      "Human activity affects the climate and ecosystems, and sustainable choices can reduce those impacts.",
      "Indigenous knowledge of the land developed over generations offers important perspectives on caring for the environment.",
    ],
  },
  units: [
    {
      id: "cells-and-division",
      title: "Cells & Cell Division",
      emoji: "🔬",
      blurb: "How cells grow, divide and specialize",
      parentNote:
        "The cell theory, the cell cycle and mitosis, why cells divide, how a cell can double over time, specialization and stem cells, and a simple, factual look at cancer as uncontrolled cell division.",
      standards: { "ca-bc": "Cells come from cells: the cell cycle, mitosis, growth and repair; specialization and stem cells; cancer as uncontrolled cell division" },
      generate: cells,
    },
    {
      id: "atoms-and-electrons",
      title: "Atoms & Electrons",
      emoji: "⚛️",
      blurb: "Protons, electrons and shells",
      parentNote:
        "Atomic structure, protons, neutrons and electrons, Bohr diagrams for the first 20 elements, valence electrons, and reading groups and periods on the periodic table.",
      standards: { "ca-bc": "Atomic structure and electron arrangement (Bohr models, first 20 elements); valence electrons; periodic table organization" },
      generate: atoms,
    },
    {
      id: "ions-bonding-families",
      title: "Ions, Bonds & Families",
      emoji: "🧂",
      blurb: "How atoms gain, lose and share",
      parentNote:
        "Why atoms form ions, ionic versus covalent bonding, metals and non-metals, and the properties of alkali metals, halogens and noble gases.",
      standards: { "ca-bc": "Periodic trends and chemical families; ions; ionic and covalent bonding at an introductory level" },
      generate: bonding,
    },
    {
      id: "reactions-acids-bases",
      title: "Reactions, Acids & Bases",
      emoji: "🧪",
      blurb: "Chemical change and the pH scale",
      parentNote:
        "Evidence of chemical change, conservation of mass, simple word equations, acids, bases, indicators, the pH scale and neutralization.",
      standards: { "ca-bc": "Chemical reactions and conservation of mass; word equations; acids, bases and pH" },
      generate: reactions,
    },
    {
      id: "electricity",
      title: "Electricity & Circuits",
      emoji: "⚡",
      blurb: "Volts, amps, ohms and power",
      parentNote:
        "Static charge, current, voltage and resistance, series and parallel circuits, Ohm's law (V = I × R) with calculations, and electrical power and household energy cost.",
      standards: { "ca-bc": "Electric charge, current, voltage and resistance; series and parallel circuits; Ohm's law; electrical power and energy use" },
      generate: electricity,
    },
    {
      id: "energy-efficiency",
      title: "Energy & Efficiency",
      emoji: "🔋",
      blurb: "Transform, transfer and waste",
      parentNote:
        "Forms of energy and how they change, conservation of energy, heat transfer, calculating efficiency, and renewable versus non-renewable sources.",
      standards: { "ca-bc": "Energy is conserved and can be transformed; efficiency; renewable and non-renewable energy sources" },
      generate: energy,
    },
    {
      id: "earth-cycles",
      title: "Cycles & Ecosystems",
      emoji: "♻️",
      blurb: "Carbon, water, nitrogen and energy",
      parentNote:
        "How carbon, water and nitrogen move through Earth's spheres, the roles of producers and decomposers, and how energy flows through food chains (about 10% passes up each level).",
      standards: { "ca-bc": "Interconnected spheres; carbon, water and nitrogen cycles; energy flow in ecosystems" },
      generate: cycles,
    },
    {
      id: "climate-sustainability",
      title: "Climate & Sustainability",
      emoji: "🌍",
      blurb: "Evidence, causes and solutions",
      parentNote:
        "The greenhouse effect, evidence of climate change from data, human causes, and the difference between mitigation and adaptation. Includes reading a data table of carbon dioxide levels.",
      standards: { "ca-bc": "Climate change: greenhouse effect, evidence, human impacts, mitigation, adaptation and sustainability" },
      generate: climate,
    },
    {
      id: "indigenous-stewardship",
      title: "Land Knowledge & Stewardship",
      emoji: "🌲",
      blurb: "Caring for the land together",
      parentNote:
        "Indigenous knowledge of the land, stewardship practices of some Indigenous communities, Two-Eyed Seeing, and respectful ways of working with Indigenous knowledge. Written in general terms: practices differ between Nations.",
      standards: { "ca-bc": "Indigenous knowledge systems and stewardship; connections between traditional knowledge and scientific understanding of ecosystems" },
      generate: indigenous,
    },
    {
      id: "inquiry-and-data",
      title: "Inquiry & Data Skills",
      emoji: "📈",
      blurb: "Variables, graphs and fair tests",
      parentNote:
        "Planning fair tests, independent and dependent variables, reading graphs, mean, precision and accuracy, unit conversions and judging sources.",
      standards: { "ca-bc": "Scientific inquiry: questioning, planning fair tests, analyzing data and evaluating evidence" },
      generate: inquiry,
    },
  ],
};
