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

/** Keep `n` of the events (listed in the correct order), still in order. */
function keepInOrder<T>(events: T[], n: number): T[] {
  const idx = sample(
    events.map((_, i) => i),
    n,
  ).sort((a, b) => a - b);
  return idx.map((i) => events[i]);
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// ---------- Natural Selection ----------

const TRAIT_SORT: SortSet = {
  prompt: "Inherited or acquired? Sort each trait.",
  hint: "Inherited traits are passed from parents to offspring in their genes. Acquired traits are gained during one organism's life and are not passed on to its offspring.",
  bins: [
    { id: "inherited", label: "inherited (in the genes)", emoji: "🧬" },
    { id: "acquired", label: "acquired during life", emoji: "🏋️" },
  ],
  items: [
    { label: "a tiger's stripe pattern", emoji: "🐅", bin: "inherited" },
    { label: "a finch's beak shape", emoji: "🐦", bin: "inherited" },
    { label: "a flower's petal colour", emoji: "🌺", bin: "inherited" },
    { label: "a person's natural eye colour", emoji: "👁️", bin: "inherited" },
    { label: "a cactus's sharp spines", emoji: "🌵", bin: "inherited" },
    { label: "a scar from a cut", emoji: "🩹", bin: "acquired" },
    { label: "muscles built by lifting weights", emoji: "💪", bin: "acquired" },
    { label: "knowing how to ride a bike", emoji: "🚲", bin: "acquired" },
    { label: "a dog that learned to sit", emoji: "🐕", bin: "acquired" },
    { label: "a branch bent by strong winds", emoji: "🌳", bin: "acquired" },
  ],
};

interface Scenario {
  organism: string;
  setting: string;
  predator: string;
  favoured: string;
  other: string;
}

const SCENARIOS: Scenario[] = [
  { organism: "beetles", setting: "dark brown soil", predator: "birds", favoured: "brown", other: "green" },
  { organism: "mice", setting: "pale sand dunes", predator: "owls", favoured: "light", other: "dark" },
  { organism: "moths", setting: "tree bark darkened by soot", predator: "birds", favoured: "dark", other: "light" },
  { organism: "lizards", setting: "black volcanic rock", predator: "hawks", favoured: "dark", other: "pale" },
];

/** A table from a predator-prey model; the trait that blends in becomes more common. */
function selectionTable(difficulty: Level): Question {
  const s = pick(SCENARIOS);
  const fav: number[] = [randInt(40, 55)];
  for (let g = 1; g < 4; g++) fav.push(fav[g - 1] + randInt(8, 14));
  const favFirst = chance(0.5);
  const favCol = `${cap(s.favoured)} ${s.organism}`;
  const otherCol = `${cap(s.other)} ${s.organism}`;
  const visual = {
    type: "table" as const,
    title: `A sample of 100 ${s.organism} in each generation`,
    headers: ["Generation", ...(favFirst ? [favCol, otherCol] : [otherCol, favCol])],
    rows: fav.map((f, g) => [g + 1, ...(favFirst ? [f, 100 - f] : [100 - f, f])]),
  };
  const setup = `A class modelled ${s.organism} living on ${s.setting}. ${cap(s.predator)} hunt them by sight.`;

  if (difficulty === 3) {
    return {
      kind: "input",
      prompt: `${setup} By how many did the number of ${s.favoured} ${s.organism} increase from generation 1 to generation 4?`,
      hint: `Read the ${s.favoured} column: subtract the generation 1 number from the generation 4 number (${fav[3]} − ${fav[0]}).`,
      answer: String(fav[3] - fav[0]),
      keypad: "number",
      visual,
    };
  }
  if (difficulty === 2) {
    return textChoice(
      `${setup} What best explains the pattern in the table?`,
      `${cap(s.favoured)} ${s.organism} are harder for ${s.predator} to spot, so more survive and reproduce`,
      [
        `${cap(s.other)} ${s.organism} change colour during their lives to match the ground`,
        `The ${s.organism} decide to have ${s.favoured} offspring so they can hide`,
        `${cap(s.predator)} cannot see any of the ${s.organism} at all`,
      ],
      "Individuals can't change their inherited colour. Those that blend in are eaten less, so they live to pass their colour on to more offspring.",
      visual,
    );
  }
  return textChoice(
    `${setup} Which colour is natural selection favouring here?`,
    `${s.favoured} ${s.organism}`,
    [`${s.other} ${s.organism}`, "neither: the numbers stay about the same"],
    "Look for the column whose numbers go up each generation. Those individuals are surviving and reproducing more.",
    visual,
  );
}

const EVOLUTION_BANK: Item[] = [
  {
    prompt: "What is an adaptation?",
    right: "An inherited trait that helps a living thing survive and reproduce in its environment",
    wrong: [
      "A change an animal decides to make during its life",
      "A habit an animal learns by watching others",
      "Any trait at all, even one that makes survival harder",
    ],
    hint: "Adaptations are passed down through genes and make an organism better suited to where it lives.",
    emoji: "🦎",
  },
  {
    prompt: "Snowshoe hares turn white in winter. How does this help them survive?",
    right: "It camouflages them against the snow",
    wrong: ["It helps them swim faster", "It makes them taste bad to predators", "It lets them see in the dark"],
    hint: "Think about what a predator sees. A white hare on white snow is hard to spot.",
    emoji: "🐇",
  },
  {
    prompt: "Which scientist proposed the theory of evolution by natural selection after studying finches, tortoises and other species?",
    right: "Charles Darwin",
    wrong: ["Isaac Newton", "Marie Curie", "Dmitri Mendeleev"],
    hint: "He sailed on HMS Beagle to the Galápagos Islands. Alfred Russel Wallace came up with the same idea on his own.",
    emoji: "🐢",
  },
  {
    prompt: "What does 'variation' mean in biology?",
    right: "Differences in traits among individuals of the same species",
    wrong: [
      "The way a species stays exactly the same for millions of years",
      "Changes in the weather from season to season",
      "Differences between a plant and an animal",
    ],
    hint: "Look at a group of people, dogs or sunflowers: no two are exactly alike. Those differences are variation.",
  },
  {
    prompt: "Which is the best evidence that living things have changed over a very long time?",
    right: "Fossils found in layers of rock",
    wrong: ["Leaves changing colour in autumn", "A puppy growing into a dog", "Daily weather forecasts"],
    hint: "Fossils preserve organisms from long ago. Older rock layers hold fossils that look different from life today.",
    emoji: "🦴",
  },
  {
    prompt: "A cactus has thick stems that store water and spines instead of leaves. These are adaptations to…",
    right: "a hot, dry desert",
    wrong: ["a cold ocean", "a shady rainforest floor", "a freshwater pond"],
    hint: "Storing water and losing less of it through leaves helps a plant where rain is rare.",
    emoji: "🌵",
  },
  {
    prompt: "In natural selection, what does 'survival of the fittest' really mean?",
    right: "Individuals best suited to their environment are more likely to survive and reproduce",
    wrong: [
      "The biggest, strongest animal always wins",
      "Animals that exercise the most live the longest",
      "Only predators survive, never prey",
    ],
    hint: "'Fit' means 'a good fit' for the environment, like a key that fits a lock, not physically strong.",
  },
  {
    prompt: "Farmers breed only the cows that give the most milk. Over many generations, the herd gives more milk. This is called…",
    right: "artificial (selective) breeding",
    wrong: ["natural selection", "extinction", "camouflage"],
    hint: "Here people, not nature, choose which animals reproduce.",
    emoji: "🐄",
  },
  {
    prompt: "Which trait would best help a fox survive in the snowy Arctic?",
    right: "thick white fur and small ears",
    wrong: ["thin fur and large ears", "dark fur and a bare tail", "short fur that sheds in winter"],
    hint: "Thick fur keeps heat in, small ears lose less heat, and white fur hides the fox in the snow.",
    emoji: "🦊",
  },
  {
    prompt: "Which of these is NOT needed for natural selection to happen?",
    right: "Animals deciding to change their bodies",
    wrong: [
      "Variation in traits within a population",
      "Traits passed from parents to offspring",
      "More offspring born than can survive",
    ],
    hint: "Natural selection needs variation, inheritance and competition to survive. Nobody chooses their inherited traits.",
    hard: true,
  },
  {
    prompt: "A giraffe stretches its neck to reach leaves all its life. Will its calves be born with longer necks because of the stretching?",
    right: "No. Changes gained during life are not passed on in the genes",
    wrong: [
      "Yes. Calves inherit the stretched neck",
      "Only if the parent stretches every single day",
      "Only the male calves will",
    ],
    hint: "Long necks became common because giraffes born with longer necks reached more food and had more calves.",
    emoji: "🦒",
    hard: true,
  },
  {
    prompt: "Bacteria are treated with an antibiotic. A few have a trait that lets them survive it. What happens over many generations?",
    right: "Antibiotic-resistant bacteria become more common",
    wrong: [
      "All bacteria disappear forever",
      "The bacteria learn to resist the drug on purpose",
      "Nothing changes in the population",
    ],
    hint: "The survivors reproduce and pass on their resistance. This is natural selection happening fast.",
    emoji: "🧫",
    hard: true,
  },
  {
    prompt: "Whales have small hip bones that they do not use for walking. What do scientists think this shows?",
    right: "Whales evolved from ancestors that walked on land",
    wrong: [
      "Whales will soon grow legs again",
      "Whales use the bones to dig in the sea floor",
      "Whales and fish have the same skeleton",
    ],
    hint: "Fossils show early whale relatives with four legs. The tiny hip bones are leftovers from those ancestors.",
    emoji: "🐋",
    hard: true,
  },
  {
    prompt: "Finches on different Galápagos islands have different beak shapes. What best explains this?",
    right: "Each beak shape suited the food found on that island",
    wrong: [
      "The birds reshaped their beaks by pecking hard",
      "Beak shape is random and never affects survival",
      "Each island's finches chose a new beak style",
    ],
    hint: "Thick beaks crack seeds; thin beaks catch insects. Birds whose beaks matched the local food survived and reproduced more.",
    hard: true,
  },
  {
    prompt: "What is a mutation?",
    right: "A change in an organism's DNA that can create a new trait",
    wrong: ["A trait learned from a parent", "A type of fossil", "An injury that heals over time"],
    hint: "Mutations are one source of new variation. Natural selection then acts on that variation.",
    emoji: "🧬",
    hard: true,
  },
  {
    prompt: "Why is variation important for a species when its environment changes?",
    right: "Some individuals may have traits that help them survive the new conditions",
    wrong: [
      "It guarantees every individual survives",
      "It stops the environment from changing",
      "It means the species can never go extinct",
    ],
    hint: "If every individual were identical, one change could harm them all. Differences give some a chance.",
    hard: true,
  },
];

function naturalSelection({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return shuffle([
    sortQuestion(TRAIT_SORT, perBin(difficulty)),
    selectionTable(difficulty),
    ...levelled(EVOLUTION_BANK, 6, difficulty),
  ]);
}

// ---------- Atoms & Elements ----------

interface Element {
  name: string;
  symbol: string;
  level: Level;
  wrongSymbols: string[];
  wrongNames: string[];
}

const ELEMENTS: Element[] = [
  { name: "hydrogen", symbol: "H", level: 1, wrongSymbols: ["Hy", "He", "Hd"], wrongNames: ["helium", "mercury", "nitrogen"] },
  { name: "oxygen", symbol: "O", level: 1, wrongSymbols: ["Ox", "Os", "Oy"], wrongNames: ["gold", "nitrogen", "carbon"] },
  { name: "carbon", symbol: "C", level: 1, wrongSymbols: ["Ca", "Cb", "Cr"], wrongNames: ["calcium", "chlorine", "copper"] },
  { name: "nitrogen", symbol: "N", level: 1, wrongSymbols: ["Ni", "Ne", "Nt"], wrongNames: ["neon", "nickel", "sodium"] },
  { name: "helium", symbol: "He", level: 1, wrongSymbols: ["H", "Hm", "Hl"], wrongNames: ["hydrogen", "mercury", "neon"] },
  { name: "neon", symbol: "Ne", level: 1, wrongSymbols: ["N", "Nn", "Ni"], wrongNames: ["nitrogen", "nickel", "sodium"] },
  { name: "sodium", symbol: "Na", level: 2, wrongSymbols: ["S", "So", "Sd"], wrongNames: ["nitrogen", "neon", "nickel"] },
  { name: "chlorine", symbol: "Cl", level: 2, wrongSymbols: ["C", "Ch", "Co"], wrongNames: ["calcium", "carbon", "copper"] },
  { name: "calcium", symbol: "Ca", level: 2, wrongSymbols: ["C", "Cl", "Cm"], wrongNames: ["carbon", "chlorine", "copper"] },
  { name: "magnesium", symbol: "Mg", level: 2, wrongSymbols: ["Mn", "Ma", "M"], wrongNames: ["manganese", "mercury", "sodium"] },
  { name: "aluminum", symbol: "Al", level: 2, wrongSymbols: ["A", "Am", "Au"], wrongNames: ["argon", "silver", "lead"] },
  { name: "sulfur", symbol: "S", level: 2, wrongSymbols: ["Su", "Sf", "Sl"], wrongNames: ["sodium", "silicon", "silver"] },
  { name: "copper", symbol: "Cu", level: 2, wrongSymbols: ["Co", "Cp", "Cr"], wrongNames: ["carbon", "calcium", "chlorine"] },
  { name: "iron", symbol: "Fe", level: 3, wrongSymbols: ["I", "Ir", "In"], wrongNames: ["fluorine", "iodine", "lead"] },
  { name: "gold", symbol: "Au", level: 3, wrongSymbols: ["Go", "Gd", "Ag"], wrongNames: ["silver", "aluminum", "argon"] },
  { name: "silver", symbol: "Ag", level: 3, wrongSymbols: ["Si", "Sv", "Au"], wrongNames: ["gold", "argon", "aluminum"] },
  { name: "potassium", symbol: "K", level: 3, wrongSymbols: ["P", "Po", "Pt"], wrongNames: ["phosphorus", "krypton", "calcium"] },
  { name: "lead", symbol: "Pb", level: 3, wrongSymbols: ["L", "Le", "Ld"], wrongNames: ["phosphorus", "platinum", "potassium"] },
  { name: "mercury", symbol: "Hg", level: 3, wrongSymbols: ["Me", "Mr", "Hy"], wrongNames: ["hydrogen", "helium", "magnesium"] },
  { name: "tin", symbol: "Sn", level: 3, wrongSymbols: ["Ti", "T", "Tn"], wrongNames: ["sodium", "silicon", "sulfur"] },
];

const SYMBOL_HINT =
  "Most symbols are the first one or two letters of the name (O for oxygen, Ca for calcium). Some come from Latin names: Na (natrium) for sodium, Fe (ferrum) for iron, Au (aurum) for gold, Ag (argentum) for silver, K (kalium) for potassium, Pb (plumbum) for lead, Hg (hydrargyrum) for mercury, Sn (stannum) for tin.";

function symbolQuestions(difficulty: Level): Question[] {
  const [a, b] = sample(
    ELEMENTS.filter((e) => e.level === difficulty),
    2,
  );
  const toSymbol = textChoice(`What is the chemical symbol for ${a.name}?`, a.symbol, a.wrongSymbols, SYMBOL_HINT, {
    type: "emoji",
    emoji: "⚛️",
    caption: a.name,
  });
  const toName = textChoice(`Which element has the chemical symbol ${b.symbol}?`, b.name, b.wrongNames, SYMBOL_HINT, {
    type: "letter",
    text: b.symbol,
    caption: "chemical symbol",
  });
  return [toSymbol, toName];
}

interface Formula {
  formula: string;
  name: string;
  atoms: number;
  elements: number;
  level: Level;
}

const FORMULAS: Formula[] = [
  { formula: "H₂O", name: "water", atoms: 3, elements: 2, level: 1 },
  { formula: "CO₂", name: "carbon dioxide", atoms: 3, elements: 2, level: 1 },
  { formula: "O₂", name: "oxygen gas", atoms: 2, elements: 1, level: 1 },
  { formula: "CH₄", name: "methane", atoms: 5, elements: 2, level: 1 },
  { formula: "NaCl", name: "table salt", atoms: 2, elements: 2, level: 1 },
  { formula: "NH₃", name: "ammonia", atoms: 4, elements: 2, level: 2 },
  { formula: "H₂O₂", name: "hydrogen peroxide", atoms: 4, elements: 2, level: 2 },
  { formula: "CaCO₃", name: "calcium carbonate (limestone)", atoms: 5, elements: 3, level: 2 },
  { formula: "C₃H₈", name: "propane", atoms: 11, elements: 2, level: 2 },
  { formula: "O₃", name: "ozone", atoms: 3, elements: 1, level: 2 },
  { formula: "C₆H₁₂O₆", name: "glucose", atoms: 24, elements: 3, level: 3 },
  { formula: "NaHCO₃", name: "baking soda", atoms: 6, elements: 4, level: 3 },
  { formula: "H₂SO₄", name: "sulfuric acid", atoms: 7, elements: 3, level: 3 },
  { formula: "C₁₂H₂₂O₁₁", name: "table sugar (sucrose)", atoms: 45, elements: 3, level: 3 },
  { formula: "Fe₂O₃", name: "iron oxide", atoms: 5, elements: 2, level: 3 },
];

function formulaQuestion(difficulty: Level): InputQuestion {
  const f = pick(FORMULAS.filter((x) => x.level === difficulty));
  const visual = { type: "letter" as const, text: f.formula, caption: f.name };
  if (difficulty >= 2 && chance(0.4)) {
    return {
      kind: "input",
      prompt: `How many different elements are in ${f.formula} (${f.name})?`,
      hint: "Each capital letter starts a new element symbol. Count the different symbols, not the small numbers.",
      answer: String(f.elements),
      keypad: "number",
      visual,
    };
  }
  return {
    kind: "input",
    prompt: `How many atoms in total does the formula ${f.formula} (${f.name}) show?`,
    hint: "A small number after a symbol tells how many of that atom there are. A symbol with no small number means 1. Add them all up.",
    answer: String(f.atoms),
    keypad: "number",
    visual,
  };
}

const SUBSTANCE_SORT: SortSet = {
  prompt: "Element, compound or mixture? Sort each substance.",
  hint: "An element has only one kind of atom. A compound has different elements chemically joined in a fixed ratio. A mixture is substances mixed together but not chemically joined.",
  bins: [
    { id: "element", label: "element", emoji: "⚛️" },
    { id: "compound", label: "compound", emoji: "🧪" },
    { id: "mixture", label: "mixture", emoji: "🥣" },
  ],
  items: [
    { label: "gold (Au)", emoji: "🟡", bin: "element" },
    { label: "helium (He)", emoji: "🎈", bin: "element" },
    { label: "oxygen gas (O₂)", emoji: "💨", bin: "element" },
    { label: "diamond (pure carbon, C)", emoji: "💎", bin: "element" },
    { label: "copper (Cu)", emoji: "🟠", bin: "element" },
    { label: "water (H₂O)", emoji: "💧", bin: "compound" },
    { label: "table salt (NaCl)", emoji: "🧂", bin: "compound" },
    { label: "carbon dioxide (CO₂)", emoji: "🥤", bin: "compound" },
    { label: "table sugar (C₁₂H₂₂O₁₁)", emoji: "🍬", bin: "compound" },
    { label: "baking soda (NaHCO₃)", emoji: "🧁", bin: "compound" },
    { label: "air", emoji: "🌬️", bin: "mixture" },
    { label: "salt water", emoji: "🌊", bin: "mixture" },
    { label: "trail mix", emoji: "🥜", bin: "mixture" },
    { label: "garden soil", emoji: "🪴", bin: "mixture" },
    { label: "fruit salad", emoji: "🥗", bin: "mixture" },
  ],
};

const CHEM_BANK: Item[] = [
  {
    prompt: "What is an element?",
    right: "A pure substance made of only one type of atom",
    wrong: [
      "A substance made of two or more different kinds of atoms joined together",
      "A mixture that can be separated by filtering",
      "Any liquid that conducts electricity",
    ],
    hint: "Gold contains only gold atoms; oxygen contains only oxygen atoms. That's what makes them elements.",
    emoji: "⚛️",
  },
  {
    prompt: "What is a compound?",
    right: "A substance made of atoms of two or more different elements chemically combined",
    wrong: [
      "A substance made of only one type of atom",
      "Two substances stirred together but not joined",
      "A metal that has been melted down",
    ],
    hint: "Water (H₂O) is a compound: hydrogen and oxygen atoms are chemically joined.",
    emoji: "💧",
  },
  {
    prompt: "Which of these elements is a metal?",
    right: "copper",
    wrong: ["sulfur", "oxygen", "carbon"],
    hint: "Metals are usually shiny, bendable and good conductors. Copper is used in electrical wires.",
  },
  {
    prompt: "Which property is typical of a solid non-metal, such as sulfur?",
    right: "dull and brittle",
    wrong: ["shiny and bendable", "a good conductor of electricity", "easy to hammer into thin sheets"],
    hint: "Non-metals are usually poor conductors, and as solids they tend to be dull and break easily.",
  },
  {
    prompt: "Where are most metals found on the periodic table?",
    right: "on the left side and in the middle",
    wrong: ["only in the top row", "in the far right column", "only in the bottom row"],
    hint: "A zigzag 'staircase' line separates metals (left and middle) from non-metals (upper right).",
  },
  {
    prompt: "What are the horizontal rows of the periodic table called?",
    right: "periods",
    wrong: ["groups", "families", "symbols"],
    hint: "Rows run across and are called periods. Columns run up and down and are called groups (or families).",
  },
  {
    prompt: "Water is H₂O. What does the small 2 tell you?",
    right: "There are 2 hydrogen atoms for every oxygen atom",
    wrong: ["There are 2 oxygen atoms", "There are 2 water molecules", "Hydrogen weighs 2 times as much as oxygen"],
    hint: "A small number written after a symbol counts the atoms of the element just before it.",
    emoji: "💧",
  },
  {
    prompt: "About 21% of the air is made of which element, the one we need to breathe?",
    right: "oxygen",
    wrong: ["nitrogen", "helium", "carbon"],
    hint: "Air is about 78% nitrogen and 21% oxygen. Our bodies use the oxygen.",
    emoji: "🌬️",
  },
  {
    prompt: "Elements in the same column (group) of the periodic table…",
    right: "have similar chemical properties",
    wrong: ["all have the same mass", "are all gases", "were all discovered in the same year"],
    hint: "Groups are like families: sodium and potassium, in the same group, both react strongly with water.",
    hard: true,
  },
  {
    prompt: "Which scientist published an early periodic table in 1869 and left gaps for elements not yet discovered?",
    right: "Dmitri Mendeleev",
    wrong: ["Albert Einstein", "Charles Darwin", "Isaac Newton"],
    hint: "This Russian chemist arranged elements by mass and properties, and predicted missing ones correctly.",
    hard: true,
  },
  {
    prompt: "Which statement about compounds is true?",
    right: "A compound always has the same elements in the same proportions",
    wrong: [
      "A compound can have a different recipe each time it forms",
      "A compound has only one kind of atom",
      "Every compound contains a metal",
    ],
    hint: "Water is always 2 hydrogen atoms to 1 oxygen atom, whether it's in a lake or a glass.",
    hard: true,
  },
  {
    prompt: "Which particles are found in the nucleus (centre) of an atom?",
    right: "protons and neutrons",
    wrong: ["only electrons", "electrons and protons", "neutrons and electrons"],
    hint: "Electrons move around the outside of the nucleus. Protons and neutrons are packed in the centre.",
    hard: true,
  },
  {
    prompt: "What makes atoms of one element different from atoms of another element?",
    right: "the number of protons in the nucleus",
    wrong: ["their colour", "how fast they move", "the temperature of the room"],
    hint: "Every hydrogen atom has 1 proton; every carbon atom has 6. That number is the atomic number.",
    hard: true,
  },
  {
    prompt: "Sodium is a soft, very reactive metal. Chlorine is a poisonous green gas. Chemically combined, they make…",
    right: "table salt (sodium chloride)",
    wrong: ["baking soda", "sugar", "water"],
    hint: "A compound can have very different properties from the elements in it. NaCl is safe to eat in small amounts.",
    emoji: "🧂",
    hard: true,
  },
  {
    prompt: "Which element is a noble gas that almost never reacts with other elements?",
    right: "neon (Ne)",
    wrong: ["sodium (Na)", "chlorine (Cl)", "iron (Fe)"],
    hint: "Noble gases sit in the far right column of the periodic table. They glow in signs but rarely form compounds.",
    hard: true,
  },
];

function atomsAndElements({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return shuffle([
    sortQuestion(SUBSTANCE_SORT, 2),
    ...symbolQuestions(difficulty),
    formulaQuestion(difficulty),
    ...levelled(CHEM_BANK, 4, difficulty),
  ]);
}

// ---------- Circuits & Static ----------

const CONDUCTOR_SORT: SortSet = {
  prompt: "Conductor or insulator? Sort each material.",
  hint: "Conductors let electric current flow easily (most metals, graphite, salt water). Insulators block it (plastic, rubber, glass, dry wood).",
  bins: [
    { id: "conductor", label: "conductor", emoji: "⚡" },
    { id: "insulator", label: "insulator", emoji: "🚫" },
  ],
  items: [
    { label: "copper wire", emoji: "🔌", bin: "conductor" },
    { label: "steel spoon", emoji: "🥄", bin: "conductor" },
    { label: "iron nail", emoji: "🔩", bin: "conductor" },
    { label: "salt water", emoji: "🌊", bin: "conductor" },
    { label: "graphite pencil lead", emoji: "✏️", bin: "conductor" },
    { label: "rubber glove", emoji: "🧤", bin: "insulator" },
    { label: "plastic ruler", emoji: "📏", bin: "insulator" },
    { label: "dry wood", emoji: "🪵", bin: "insulator" },
    { label: "window glass", emoji: "🪟", bin: "insulator" },
    { label: "wool yarn", emoji: "🧶", bin: "insulator" },
  ],
};

function bulbsQuestion(): InputQuestion {
  const n = randInt(3, 6);
  const series = chance(0.5);
  return {
    kind: "input",
    prompt: `A ${series ? "series" : "parallel"} circuit has ${n} identical bulbs and a battery. One bulb burns out. How many bulbs stay lit?`,
    hint: series
      ? "A series circuit has only one path. A burnt-out bulb breaks that path, so the current stops everywhere."
      : "In a parallel circuit, each bulb is on its own branch. The other branches are still complete, so those bulbs stay lit.",
    answer: String(series ? 0 : n - 1),
    keypad: "number",
    visual: { type: "emojiRow", items: Array<string>(n).fill("💡") },
  };
}

function cellsQuestion(): InputQuestion {
  const n = randInt(2, 6);
  const total = 1.5 * n;
  return {
    kind: "input",
    prompt: `Each cell gives 1.5 V. If ${n} cells are connected in series (end to end), what is the total voltage?`,
    hint: `Cells in series add their voltages: 1.5 V × ${n}.`,
    answer: String(total),
    accept: Number.isInteger(total) ? [`${total}.0`] : [],
    keypad: "decimal",
    suffix: "V",
    visual: { type: "emojiRow", items: Array<string>(n).fill("🔋") },
  };
}

const ELEC_BANK: Item[] = [
  {
    prompt: "What does a circuit need for current to flow?",
    right: "A complete, unbroken loop from the energy source and back",
    wrong: ["Just a bulb and one wire", "A switch that is left open", "Two batteries touching each other"],
    hint: "Current flows only around a closed loop. Any gap stops it.",
    emoji: "🔁",
  },
  {
    prompt: "What does a switch do in a circuit?",
    right: "It opens or closes the loop to stop or start the current",
    wrong: ["It stores extra electricity", "It makes the battery stronger", "It changes electricity into light"],
    hint: "An open switch makes a gap in the loop; a closed switch completes it.",
  },
  {
    prompt: "In a series circuit, the current has…",
    right: "only one path to follow",
    wrong: ["two or more separate paths", "no path at all", "a path that skips every bulb"],
    hint: "In series, everything is connected one after another in a single loop.",
  },
  {
    prompt: "Which part of a circuit is the source of electrical energy?",
    right: "the battery",
    wrong: ["the bulb", "the switch", "the wire"],
    hint: "A battery (or cell) pushes the current around the circuit.",
    emoji: "🔋",
  },
  {
    prompt: "Two balloons both have a negative charge. What happens when you bring them close?",
    right: "They push apart (repel)",
    wrong: ["They pull together (attract)", "Nothing happens", "They both become positive"],
    hint: "Like charges repel; opposite charges attract.",
    emoji: "🎈",
  },
  {
    prompt: "A positively charged rod is held near a negatively charged balloon. What happens?",
    right: "They attract each other",
    wrong: ["They repel each other", "Nothing happens", "The rod becomes magnetic"],
    hint: "Opposite charges (positive and negative) pull toward each other.",
  },
  {
    prompt: "You rub a balloon on your hair and it sticks to a wall. Why?",
    right: "Rubbing moved electrons, so the balloon now has an electric charge",
    wrong: ["The balloon got sticky from the heat", "Air pressure glued it in place", "The balloon turned into a magnet"],
    hint: "Rubbing two materials can move electrons from one to the other. That build-up of charge is static electricity.",
    emoji: "🎈",
  },
  {
    prompt: "Why are electrical wires covered in plastic?",
    right: "Plastic is an insulator, so it keeps the current in the wire and protects people",
    wrong: ["Plastic makes the current flow faster", "Plastic stores electricity for later", "Plastic is a good conductor"],
    hint: "Insulators don't let current pass, so the plastic coating keeps electricity where it belongs.",
    emoji: "🔌",
  },
  {
    prompt: "Lightning is a giant example of…",
    right: "static electricity discharging",
    wrong: ["a magnet being switched off", "a series circuit", "sound energy"],
    hint: "Charge builds up in storm clouds, then jumps through the air in a huge spark.",
    emoji: "🌩️",
  },
  {
    prompt: "Why are the lights in a house wired in parallel?",
    right: "Each light can work even if another is switched off or burns out",
    wrong: [
      "So one switch turns off every light at once",
      "Parallel circuits need no power source",
      "It makes every bulb dimmer to save energy",
    ],
    hint: "In parallel, each light has its own branch, so it doesn't depend on the others.",
    emoji: "🏠",
    hard: true,
  },
  {
    prompt: "In a metal wire, which particles move to carry the electric current?",
    right: "electrons",
    wrong: ["protons", "neutrons", "whole atoms"],
    hint: "Protons and neutrons stay in the nucleus. Tiny, negative electrons drift through the metal.",
    hard: true,
  },
  {
    prompt: "You add more identical bulbs in series to the same battery. What happens to the bulbs?",
    right: "Each bulb gets dimmer",
    wrong: ["Each bulb gets brighter", "The brightness stays the same", "Only the first bulb lights up"],
    hint: "More bulbs in one loop means more resistance, so less current flows through each bulb.",
    hard: true,
  },
  {
    prompt: "What does a circuit breaker or fuse do?",
    right: "It breaks the circuit if too much current flows, preventing overheating",
    wrong: ["It adds extra current when needed", "It stores power during a blackout", "It turns AC into sunlight"],
    hint: "Too much current makes wires hot. A breaker 'trips' to open the circuit before that becomes dangerous.",
    hard: true,
  },
  {
    prompt: "After you walk across a carpet, you feel a tiny shock when you touch a metal doorknob. Why?",
    right: "Charge built up on your body jumps to the metal",
    wrong: ["The doorknob is plugged into the wall", "The carpet is a battery", "Your shoes are magnetic"],
    hint: "Walking on carpet rubs electrons onto (or off) you. Metal is a conductor, so the charge jumps across as a spark.",
    hard: true,
  },
];

function circuits({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const extra = difficulty === 1 ? [] : [cellsQuestion()];
  return shuffle([
    sortQuestion(CONDUCTOR_SORT, perBin(difficulty)),
    bulbsQuestion(),
    ...extra,
    ...levelled(ELEC_BANK, 6 - extra.length, difficulty),
  ]);
}

// ---------- Magnets & Motors ----------

function polesQuestion(): Question {
  const [a, b] = pick([
    ["N", "N"],
    ["S", "S"],
    ["N", "S"],
    ["S", "N"],
  ]);
  const name = (p: string) => (p === "N" ? "north" : "south");
  const repel = a === b;
  return textChoice(
    `The ${name(a)} pole of one magnet is held near the ${name(b)} pole of another magnet. What happens?`,
    repel ? "They repel (push apart)" : "They attract (pull together)",
    [repel ? "They attract (pull together)" : "They repel (push apart)", "Nothing happens"],
    "Like poles (N–N or S–S) repel. Opposite poles (N–S) attract.",
    { type: "letter", text: `${a}  ${b}`, caption: "two magnet poles" },
  );
}

function electromagnetTable(difficulty: Level): InputQuestion {
  const k = randInt(2, 5);
  const visual = {
    type: "table" as const,
    title: "Electromagnet test: wire coiled around an iron nail",
    headers: ["Coils of wire", "Paper clips picked up"],
    rows: [
      [10, k],
      [20, 2 * k],
      [30, 3 * k],
    ],
  };
  if (difficulty === 3 && chance(0.5)) {
    const m = pick([5, 6, 8]);
    return {
      kind: "input",
      prompt: `Students tested an electromagnet with different numbers of coils. If the pattern continues, how many coils would be needed to pick up ${k * m} paper clips?`,
      hint: `Every 10 coils picks up ${k} more clips. ${k * m} ÷ ${k} = ${m}, so you need ${m} groups of 10 coils.`,
      answer: String(m * 10),
      keypad: "number",
      visual,
    };
  }
  const coils = difficulty === 3 ? pick([60, 80]) : pick([40, 50]);
  return {
    kind: "input",
    prompt: `Students tested an electromagnet with different numbers of coils. If the pattern continues, how many paper clips would ${coils} coils pick up?`,
    hint: `Every 10 coils picks up ${k} clips. ${coils} coils is ${coils / 10} groups of 10, so multiply ${coils / 10} × ${k}.`,
    answer: String((coils / 10) * k),
    keypad: "number",
    visual,
  };
}

const MOTOR_SORT: SortSet = {
  prompt: "Motor or generator? Sort each device.",
  hint: "A motor turns electrical energy into motion. A generator turns motion into electrical energy.",
  bins: [
    { id: "motor", label: "motor (electricity → motion)", emoji: "⚙️" },
    { id: "generator", label: "generator (motion → electricity)", emoji: "⚡" },
  ],
  items: [
    { label: "electric car wheels", emoji: "🚗", bin: "motor" },
    { label: "washing machine drum", emoji: "🧺", bin: "motor" },
    { label: "electric toothbrush", emoji: "🪥", bin: "motor" },
    { label: "ceiling fan", emoji: "🔄", bin: "motor" },
    { label: "electric drill", emoji: "🔧", bin: "motor" },
    { label: "wind turbine", emoji: "🌬️", bin: "generator" },
    { label: "hydroelectric dam", emoji: "🌊", bin: "generator" },
    { label: "hand-crank flashlight", emoji: "🔦", bin: "generator" },
    { label: "bike wheel light dynamo", emoji: "🚲", bin: "generator" },
    { label: "steam turbine in a power station", emoji: "🏭", bin: "generator" },
  ],
};

const MAG_BANK: Item[] = [
  {
    prompt: "What is an electromagnet?",
    right: "A coil of wire that acts as a magnet when current flows through it",
    wrong: ["A magnet made of natural rock", "A battery that stores magnetism", "A magnet that only works underwater"],
    hint: "Electric current flowing in a wire makes a magnetic field. Coiling the wire makes the field stronger.",
    emoji: "🧲",
  },
  {
    prompt: "Which change would make an electromagnet stronger?",
    right: "Wrapping more coils of wire around the core",
    wrong: ["Using a wooden core instead of iron", "Using fewer coils of wire", "Switching the current off"],
    hint: "More coils, more current, or an iron core all make an electromagnet stronger.",
  },
  {
    prompt: "What happens to an electromagnet when the current is switched off?",
    right: "It loses most of its magnetism",
    wrong: ["It becomes twice as strong", "It turns into a battery", "Its poles get stuck forever"],
    hint: "The magnetism comes from the current. No current means (almost) no magnetic field.",
  },
  {
    prompt: "A generator changes…",
    right: "motion into electrical energy",
    wrong: ["electrical energy into motion", "light into sound", "heat into magnetism"],
    hint: "Spinning a coil near a magnet (or a magnet near a coil) produces an electric current.",
  },
  {
    prompt: "An electric motor changes…",
    right: "electrical energy into motion",
    wrong: ["motion into electrical energy", "sound into light", "chemical energy into heat"],
    hint: "Current in a coil makes a magnetic field that pushes against magnets, making the motor spin.",
    emoji: "⚙️",
  },
  {
    prompt: "Which metal is strongly attracted to a magnet?",
    right: "iron",
    wrong: ["aluminum", "copper", "gold"],
    hint: "Iron, nickel and cobalt (and steel, which is mostly iron) are magnetic. Most other metals are not.",
    emoji: "🧲",
  },
  {
    prompt: "A compass needle is a small magnet. What does it line up with?",
    right: "Earth's magnetic field",
    wrong: ["the position of the Sun", "the nearest mountain", "the direction of the wind"],
    hint: "Earth acts like a giant magnet. A compass needle turns to line up with its field.",
    emoji: "🧭",
  },
  {
    prompt: "Where is the magnetic field of a bar magnet strongest?",
    right: "at its poles (the ends)",
    wrong: ["exactly in the middle", "evenly everywhere along it", "far away from the magnet"],
    hint: "Sprinkle iron filings around a bar magnet: they bunch up most at the two ends.",
  },
  {
    prompt: "Why do scrapyards use electromagnets, not permanent magnets, to lift old cars?",
    right: "An electromagnet can be switched off to drop the load",
    wrong: [
      "Permanent magnets can't lift metal",
      "Electromagnets work without electricity",
      "Permanent magnets only attract plastic",
    ],
    hint: "Turning the current off makes the electromagnet let go exactly where the crane operator wants.",
    emoji: "🏗️",
  },
  {
    prompt: "Outside a bar magnet, which way do magnetic field lines point?",
    right: "from the north pole to the south pole",
    wrong: ["from the south pole to the north pole", "in circles around the middle only", "straight up away from both poles"],
    hint: "By convention, field lines leave the north pole and curve around to enter the south pole.",
    hard: true,
  },
  {
    prompt: "In 1820, which scientist noticed that an electric current made a nearby compass needle move?",
    right: "Hans Christian Ørsted",
    wrong: ["Charles Darwin", "Dmitri Mendeleev", "Galileo Galilei"],
    hint: "This Danish scientist's discovery showed that electricity and magnetism are connected.",
    hard: true,
  },
  {
    prompt: "What do electricity and magnetism have in common?",
    right: "Both are produced by the electromagnetic force",
    wrong: ["Both are caused by gravity", "Both only happen in outer space", "Both need sunlight to work"],
    hint: "Moving charges create magnetic fields, and moving magnets create currents: one force, two effects.",
    hard: true,
  },
  {
    prompt: "In a generator, what must happen to produce a current?",
    right: "A magnet and a coil of wire must move relative to each other",
    wrong: ["A battery must be connected to the coil", "The coil must be kept perfectly still", "The magnet must be heated"],
    hint: "Changing the magnetic field through a coil pushes electrons along the wire. This is called electromagnetic induction.",
    hard: true,
  },
  {
    prompt: "How does a hydroelectric dam make electricity?",
    right: "Falling water spins turbines that turn generators",
    wrong: ["Water is burned like fuel", "Fish swimming past create a current", "Sunlight on the water charges batteries"],
    hint: "The motion of the water turns the generator's coils and magnets.",
    emoji: "🌊",
    hard: true,
  },
  {
    prompt: "You cut a bar magnet in half. What do you get?",
    right: "Two smaller magnets, each with its own north and south pole",
    wrong: ["One north-only magnet and one south-only magnet", "Two pieces that are no longer magnetic", "One magnet and one piece of plain iron"],
    hint: "Every magnet, however small, has both a north and a south pole.",
    emoji: "🧲",
    hard: true,
  },
];

function magnetsAndMotors({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return shuffle([
    difficulty === 1 ? polesQuestion() : electromagnetTable(difficulty),
    sortQuestion(MOTOR_SORT, perBin(difficulty)),
    ...levelled(MAG_BANK, 6, difficulty),
  ]);
}

// ---------- Restless Earth ----------

const LAYERS_ORDER: OrderQuestion = {
  kind: "order",
  prompt: "Put Earth's layers in order, from the surface to the centre.",
  hint: "The thin rocky crust is on top, then the thick mantle, then the liquid outer core and the solid inner core.",
  items: [
    { id: "crust", label: "crust (thin, rocky outer layer)", emoji: "🌍" },
    { id: "mantle", label: "mantle (hot rock that flows very slowly)", emoji: "🟠" },
    { id: "outer", label: "outer core (liquid iron and nickel)", emoji: "🔴" },
    { id: "inner", label: "inner core (solid iron and nickel)", emoji: "⚪" },
  ],
};

const DEEP_TIME = [
  { id: "earth", label: "Earth forms", emoji: "🌍", when: "about 4.6 billion years ago" },
  { id: "life", label: "First simple life appears in the oceans", emoji: "🦠", when: "at least 3.5 billion years ago" },
  { id: "fish", label: "First fish swim in the oceans", emoji: "🐟", when: "about 500 million years ago" },
  { id: "dinos", label: "First dinosaurs appear", emoji: "🦕", when: "about 230 million years ago" },
  { id: "extinct", label: "Dinosaurs (except birds) die out", emoji: "☄️", when: "about 66 million years ago" },
  { id: "humans", label: "Modern humans appear in Africa", emoji: "🧍", when: "about 300,000 years ago" },
];

function deepTimeOrder(n: number): OrderQuestion {
  const events = keepInOrder(DEEP_TIME, n);
  return {
    kind: "order",
    prompt: "Put these events in Earth's history in order, oldest first.",
    hint: events.map((e) => `${e.label}: ${e.when}.`).join(" "),
    items: events.map(({ id, label, emoji }) => ({ id, label, emoji })),
  };
}

function plateQuestion(difficulty: Level): InputQuestion {
  const rate = randInt(2, 9);
  const visual = { type: "emoji" as const, emoji: "🌋", caption: `${rate} cm per year` };
  if (difficulty === 3) {
    return {
      kind: "input",
      prompt: `A tectonic plate moves about ${rate} cm per year. How many metres would it move in 1000 years?`,
      hint: `First find centimetres: ${rate} × 1000 = ${rate * 1000} cm. There are 100 cm in a metre, so divide by 100.`,
      answer: String(rate * 10),
      keypad: "number",
      suffix: "m",
      visual,
    };
  }
  const years = difficulty === 1 ? 10 : 100;
  return {
    kind: "input",
    prompt: `A tectonic plate moves about ${rate} cm per year (about as fast as fingernails grow). How far would it move in ${years} years?`,
    hint: `Multiply the distance per year by the number of years: ${rate} × ${years}.`,
    answer: String(rate * years),
    keypad: "number",
    suffix: "cm",
    visual,
  };
}

// Listed top (youngest) to bottom (oldest), in a realistic order.
const FOSSIL_LAYERS = ["mammoth tooth", "dinosaur bone", "ammonite shell", "trilobite"];

function fossilLayers(difficulty: Level): Question {
  const visual = {
    type: "table" as const,
    title: "Fossils in undisturbed rock layers at a cliff",
    headers: ["Layer", "Fossil found"],
    rows: FOSSIL_LAYERS.map((f, i) => [
      i === 0 ? "1 (top)" : i === FOSSIL_LAYERS.length - 1 ? `${i + 1} (bottom)` : String(i + 1),
      f,
    ]),
  };
  const hint =
    "Rock layers form on top of each other, so in undisturbed rock the bottom layer is oldest and the top layer is youngest. This is called the law of superposition.";
  const others = (keep: string) => FOSSIL_LAYERS.filter((f) => f !== keep);
  if (difficulty === 3) {
    return textChoice(
      "Which fossil is older than the dinosaur bone but younger than the trilobite?",
      "ammonite shell",
      others("ammonite shell"),
      hint,
      visual,
    );
  }
  if (chance(0.5)) {
    return textChoice("Which fossil is probably the oldest?", "trilobite", others("trilobite"), hint, visual);
  }
  return textChoice("Which fossil is probably the youngest?", "mammoth tooth", others("mammoth tooth"), hint, visual);
}

const CASCADIA = {
  type: "passage" as const,
  title: "The Earthquake of 1700",
  paragraphs: [
    "First Nations on the Pacific coast of North America have oral histories, passed down for many generations, about a winter night long ago when the ground shook and the sea rose over the land.",
    "For a long time, scientists had no written record of a great earthquake on that coast. Then they found 'ghost forests': dead cedar trees whose roots had suddenly dropped into salt water when the land sank. Tree rings showed that the trees died between 1699 and 1700.",
    "Records from Japan described a tsunami in January 1700 that arrived with no earthquake felt in Japan. Putting all the evidence together, scientists concluded that a huge earthquake struck the Cascadia Subduction Zone on January 26, 1700.",
  ],
};

function cascadiaQuestion(): Question {
  return pick([
    () =>
      textChoice(
        "Besides oral histories, what evidence does the passage say scientists used to date the earthquake?",
        "Tree rings from ghost forests and tsunami records from Japan",
        [
          "Photographs taken during the earthquake",
          "Measurements from modern seismometers in 1700",
          "Fossils of dinosaurs on the coast",
        ],
        "Reread paragraphs 2 and 3. Two kinds of evidence, one from trees and one from another country, matched the oral histories.",
        CASCADIA,
      ),
    () =>
      textChoice(
        "What does this passage show about Indigenous oral histories?",
        "They can carry accurate knowledge of real events across many generations",
        [
          "They only describe events from the last few years",
          "They were proved wrong by scientists",
          "They are not connected to any real places",
        ],
        "Scientists' evidence matched what the oral histories had described for over 300 years.",
        CASCADIA,
      ),
    () =>
      textChoice(
        "Why did the cedar trees in the ghost forests die?",
        "The land sank and their roots were flooded with salt water",
        ["A volcano covered them with lava", "People cut them down for canoes", "A long drought dried them out"],
        "Paragraph 2 says the roots 'suddenly dropped into salt water when the land sank'.",
        CASCADIA,
      ),
  ])();
}

const EARTH_BANK: Item[] = [
  {
    prompt: "Which layer of Earth do we live on?",
    right: "the crust",
    wrong: ["the mantle", "the outer core", "the inner core"],
    hint: "The crust is Earth's thin, rocky outer layer: the ground under your feet and the ocean floor.",
    emoji: "🌍",
  },
  {
    prompt: "What are tectonic plates?",
    right: "Huge slabs of Earth's crust and upper mantle that slowly move",
    wrong: ["Layers of ice on the poles", "Clouds of gas in the atmosphere", "Flat rocks found only on beaches"],
    hint: "Earth's outer shell is broken into giant pieces that move a few centimetres a year.",
  },
  {
    prompt: "What causes most earthquakes?",
    right: "Plates suddenly slipping along a fault",
    wrong: ["Strong winds blowing over mountains", "The Moon pulling on rocks every night", "Underground rivers freezing"],
    hint: "Stress builds up where plates meet. When the rocks finally slip, the energy is released as shaking.",
  },
  {
    prompt: "Many earthquakes and volcanoes happen around the edge of the Pacific Ocean. What is this zone called?",
    right: "the Ring of Fire",
    wrong: ["the Mid-Atlantic Ridge", "the Equator", "Pangaea"],
    hint: "Plates meet all around the Pacific, making a ring of volcanoes and earthquake zones.",
    emoji: "🌋",
  },
  {
    prompt: "What was Pangaea?",
    right: "A supercontinent that slowly broke apart into today's continents",
    wrong: ["An ancient ocean that dried up last century", "The first volcano on Earth", "A layer of Earth's core"],
    hint: "Hundreds of millions of years ago, most land was joined in one giant continent.",
  },
  {
    prompt: "At a divergent boundary, two plates…",
    right: "move apart",
    wrong: ["push into each other", "slide past each other sideways", "stay completely still"],
    hint: "'Diverge' means to separate. Magma rises in the gap and forms new crust, like at the Mid-Atlantic Ridge.",
  },
  {
    prompt: "Alfred Wegener noticed that South America and Africa fit together like puzzle pieces. What idea did he propose?",
    right: "continental drift",
    wrong: ["natural selection", "the greenhouse effect", "electromagnetism"],
    hint: "Wegener suggested in 1912 that the continents were once joined and have slowly moved apart.",
  },
  {
    prompt: "What is a fossil?",
    right: "The preserved remains or traces of an organism from long ago",
    wrong: ["A type of volcanic rock", "A crystal that grows in caves", "A layer of soil on a farm"],
    hint: "Bones, shells, footprints and leaf prints preserved in rock are all fossils.",
    emoji: "🦴",
  },
  {
    prompt: "About how old do scientists estimate Earth to be?",
    right: "about 4.6 billion years",
    wrong: ["about 46 million years", "about 460,000 years", "about 46 billion years"],
    hint: "Scientists date the oldest rocks and meteorites using radioactive elements. Earth is a few billion years old.",
  },
  {
    prompt: "Which layer of Earth is made of liquid metal?",
    right: "the outer core",
    wrong: ["the inner core", "the crust", "the mantle"],
    hint: "The outer core is liquid iron and nickel. Its swirling motion creates Earth's magnetic field.",
    hard: true,
  },
  {
    prompt: "At a transform boundary, two plates…",
    right: "slide past each other sideways",
    wrong: ["move straight apart", "melt into each other", "stack on top of each other"],
    hint: "The San Andreas Fault in California is a famous transform boundary, with many earthquakes.",
    hard: true,
  },
  {
    prompt: "An ocean plate sinks beneath a continental plate (subduction). What often forms on the continent above it?",
    right: "a chain of volcanoes and mountains",
    wrong: ["a new ocean in the middle of the land", "a flat desert of sand", "a coral reef"],
    hint: "The sinking plate melts deep down, and the magma rises to make volcanoes.",
    emoji: "🏔️",
    hard: true,
  },
  {
    prompt: "Which evidence supports the idea that continents were once joined?",
    right: "Fossils of the same species found on continents now separated by oceans",
    wrong: ["Different languages spoken on each continent", "Rivers flowing in different directions", "Each continent having its own weather"],
    hint: "Fossils of the reptile Mesosaurus are found in both South America and Africa. It couldn't swim across an ocean.",
    hard: true,
  },
  {
    prompt: "The inner core is hotter than the surface of the Sun. Why is it solid?",
    right: "The enormous pressure squeezes it into a solid",
    wrong: ["It is made of ice", "It is cooled by the oceans", "It gets no heat from anywhere"],
    hint: "The weight of all the rock above presses so hard that the iron can't melt.",
    hard: true,
  },
  {
    prompt: "How did the Himalaya mountains form?",
    right: "Two continental plates collided and pushed rock upward",
    wrong: ["A giant volcano erupted once", "Glaciers piled up rocks", "Wind blew sand into huge dunes"],
    hint: "The plate carrying India crashed into Asia, and is still pushing the mountains higher today.",
    emoji: "🏔️",
    hard: true,
  },
  {
    prompt: "What is the geological time scale?",
    right: "A calendar of Earth's history, divided into eras and periods using rock and fossil evidence",
    wrong: ["A tool for weighing rocks", "A chart of today's weather", "A list of every volcano on Earth"],
    hint: "Geologists divide Earth's 4.6-billion-year history into eons, eras and periods.",
    hard: true,
  },
];

function restlessEarth({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  if (difficulty === 1) {
    return [LAYERS_ORDER, ...shuffle([fossilLayers(1), ...levelled(EARTH_BANK, 6, 1)])];
  }
  const extras = difficulty === 3 ? [cascadiaQuestion()] : [];
  return [
    deepTimeOrder(difficulty === 3 ? 5 : 4),
    ...shuffle([
      plateQuestion(difficulty),
      fossilLayers(difficulty),
      ...extras,
      ...levelled(EARTH_BANK, 5 - extras.length, difficulty),
    ]),
  ];
}

// ---------- Changing Climate ----------

const CO2_BARS = {
  type: "bars" as const,
  title: "CO₂ in the air at Mauna Loa, Hawaii (parts per million)",
  bars: [
    { label: "1960", value: 317 },
    { label: "1980", value: 339 },
    { label: "2000", value: 370 },
    { label: "2020", value: 414 },
  ],
};

function co2Question(difficulty: Level): Question {
  if (difficulty === 1) {
    return textChoice(
      "What trend does the graph show?",
      "CO₂ in the air rose from 1960 to 2020",
      ["CO₂ in the air fell from 1960 to 2020", "CO₂ stayed the same", "CO₂ went up and down at random"],
      "Compare the bar heights from left to right. Each one is taller than the one before.",
      CO2_BARS,
    );
  }
  if (difficulty === 2) {
    return textChoice(
      "About how much did CO₂ rise from 1960 to 2020?",
      "about 100 ppm",
      ["about 10 ppm", "about 50 ppm", "about 400 ppm"],
      "Subtract the 1960 value from the 2020 value: 414 − 317 = 97, which is about 100.",
      CO2_BARS,
    );
  }
  if (chance(0.5)) {
    return {
      kind: "input",
      prompt: "How many parts per million did CO₂ rise from 2000 to 2020?",
      hint: "Subtract the 2000 value from the 2020 value: 414 − 370.",
      answer: "44",
      keypad: "number",
      suffix: "ppm",
      visual: CO2_BARS,
    };
  }
  return textChoice(
    "In which 20-year period did CO₂ rise the most?",
    "2000 to 2020",
    ["1960 to 1980", "1980 to 2000"],
    "Find each rise: 339 − 317 = 22, 370 − 339 = 31, 414 − 370 = 44. The rise is speeding up.",
    CO2_BARS,
  );
}

function greenhouseOrder(difficulty: Level): OrderQuestion {
  const steps = [
    { id: "sun", label: "Sunlight passes through the atmosphere to Earth's surface", emoji: "☀️" },
    { id: "absorb", label: "Land and oceans absorb the light and warm up", emoji: "🌍" },
    { id: "emit", label: "The warm surface gives off heat (infrared energy)", emoji: "♨️" },
    { id: "trap", label: "Greenhouse gases absorb some heat and send part back down", emoji: "🌫️" },
    { id: "warm", label: "Earth stays warmer than it would without those gases", emoji: "🌡️" },
  ];
  return {
    kind: "order",
    prompt: "Put the steps of the greenhouse effect in order.",
    hint: "Energy arrives as sunlight, warms the surface, leaves as heat, and some of that heat is held in by greenhouse gases.",
    items: difficulty === 3 ? steps : steps.slice(0, 4),
  };
}

const EMISSIONS_SORT: SortSet = {
  prompt: "Does it add greenhouse gases or help reduce them? Sort each action.",
  hint: "Burning fossil fuels (coal, oil, gas), clearing forests and sending food waste to landfills add greenhouse gases. Trees, clean energy and using less fuel help reduce them.",
  bins: [
    { id: "adds", label: "adds greenhouse gases", emoji: "🏭" },
    { id: "reduces", label: "helps reduce them", emoji: "🌱" },
  ],
  items: [
    { label: "burning coal to make electricity", emoji: "⚫", bin: "adds" },
    { label: "driving a gas-powered car alone", emoji: "🚗", bin: "adds" },
    { label: "clearing forests for land", emoji: "🪵", bin: "adds" },
    { label: "sending food scraps to a landfill", emoji: "🗑️", bin: "adds" },
    { label: "heating a home with an oil furnace", emoji: "🛢️", bin: "adds" },
    { label: "planting trees", emoji: "🌳", bin: "reduces" },
    { label: "walking or cycling to school", emoji: "🚲", bin: "reduces" },
    { label: "using solar or wind power", emoji: "🔆", bin: "reduces" },
    { label: "taking public transit", emoji: "🚌", bin: "reduces" },
    { label: "sealing drafty windows to save heat", emoji: "🏠", bin: "reduces" },
  ],
};

const CLIMATE_BANK: Item[] = [
  {
    prompt: "What is the greenhouse effect?",
    right: "Gases in the atmosphere trap some of Earth's heat, keeping the planet warm",
    wrong: [
      "A hole in the ozone layer letting in more sunlight",
      "Heat from greenhouses on farms warming the planet",
      "All of Earth's heat escaping straight into space",
    ],
    hint: "Gases like carbon dioxide and methane act a bit like a blanket around Earth.",
    emoji: "🌍",
  },
  {
    prompt: "Burning fossil fuels releases which gas, the main cause of recent warming?",
    right: "carbon dioxide (CO₂)",
    wrong: ["oxygen (O₂)", "nitrogen (N₂)", "helium (He)"],
    hint: "Fossil fuels are made of carbon from ancient life. Burning them combines carbon with oxygen.",
    emoji: "🏭",
  },
  {
    prompt: "Which of these is a fossil fuel?",
    right: "coal",
    wrong: ["wind", "sunlight", "flowing water"],
    hint: "Coal, oil and natural gas formed over millions of years from the remains of ancient plants and sea life.",
  },
  {
    prompt: "Which is evidence that Earth's climate is warming?",
    right: "Glaciers around the world are shrinking",
    wrong: ["The Moon has phases", "Earthquakes happen along plate boundaries", "The Sun rises in the east"],
    hint: "Photos and measurements over many decades show most glaciers losing ice.",
    emoji: "🧊",
  },
  {
    prompt: "What is the difference between weather and climate?",
    right: "Weather is day to day; climate is the average pattern over many years",
    wrong: [
      "Weather is the average over many years; climate is day to day",
      "They mean exactly the same thing",
      "Climate only describes rain, and weather only describes wind",
    ],
    hint: "One cold day is weather. Thirty years of temperatures for a region describes its climate.",
    emoji: "🌦️",
  },
  {
    prompt: "Which energy source is renewable?",
    right: "wind",
    wrong: ["coal", "oil", "natural gas"],
    hint: "Renewable sources won't run out: wind, sunlight and flowing water keep coming.",
    emoji: "🌬️",
  },
  {
    prompt: "Which choice for a short trip to school produces the least greenhouse gas?",
    right: "walking or cycling",
    wrong: ["being driven alone in a gas car", "taking a taxi", "riding in an idling car"],
    hint: "Walking and cycling burn no fuel at all.",
    emoji: "🚲",
  },
  {
    prompt: "Many Indigenous communities have watched the same lands and waters for generations. How can this knowledge help climate science?",
    right: "It gives detailed, long-term observations of local changes in ice, plants and animals",
    wrong: [
      "It only describes what happened last week",
      "It replaces the need for any other evidence",
      "It is only about predicting tomorrow's weather",
    ],
    hint: "Knowledge passed down through generations can show how a place has changed over a long time, alongside scientific measurements.",
    emoji: "🌲",
  },
  {
    prompt: "Without any greenhouse effect at all, Earth would be…",
    right: "much colder, too cold for most life",
    wrong: ["much hotter, like an oven", "exactly the same temperature", "completely covered in water"],
    hint: "Some greenhouse effect is natural and needed: without it Earth's average temperature would be about −18 °C.",
    hard: true,
  },
  {
    prompt: "How do ice cores help scientists study climates from long ago?",
    right: "Air bubbles trapped in the ice show what the atmosphere was like in the past",
    wrong: ["The ice shows what animals ate", "Ice cores record the history of earthquakes only", "The ice is used to cool lab computers"],
    hint: "Ice sheets build up layer by layer, sealing in tiny samples of old air. Some cores go back 800,000 years.",
    emoji: "🧊",
    hard: true,
  },
  {
    prompt: "Earth's climate changed in the past, during ice ages. What is different about today's warming?",
    right: "It is happening much faster and is mainly caused by human activities",
    wrong: ["It is caused only by volcanoes", "It is happening more slowly than ever before", "It is not really happening"],
    hint: "Past changes usually took thousands of years. Since the 1800s, burning fossil fuels has quickly raised CO₂ levels.",
    hard: true,
  },
  {
    prompt: "Methane is a powerful greenhouse gas. Which is a major source of it?",
    right: "landfills and cattle",
    wrong: ["solar panels", "wind turbines", "growing trees"],
    hint: "Methane comes from rotting waste without oxygen, digestion in cows, and natural gas leaks.",
    hard: true,
  },
  {
    prompt: "Why does cutting down large forests add to climate change?",
    right: "Trees store carbon; clearing them releases CO₂ and leaves fewer trees to absorb it",
    wrong: ["Trees produce greenhouse gases while growing", "Forests make the Sun shine brighter", "Fewer trees means more rain everywhere"],
    hint: "Growing trees take in CO₂ to build wood. Burning or rotting cleared trees puts that carbon back into the air.",
    emoji: "🌳",
    hard: true,
  },
  {
    prompt: "How can tree rings help scientists learn about past climate?",
    right: "Wider rings usually mean better growing years, often warmer or wetter",
    wrong: ["Each ring shows one earthquake", "Tree rings show the weather of the last day only", "The number of rings shows the tree's height"],
    hint: "A tree adds one ring per year, and good growing conditions make that ring wider.",
    hard: true,
  },
  {
    prompt: "Which two things are making sea levels rise?",
    right: "Melting land ice, and seawater expanding as it warms",
    wrong: ["More fish in the ocean, and more rain", "Earthquakes, and the Moon getting closer", "Boats displacing water, and rivers drying up"],
    hint: "Water from glaciers and ice sheets flows into the sea, and warm water takes up more space than cold water.",
    emoji: "🌊",
    hard: true,
  },
  {
    prompt: "Which was one natural cause of climate change in Earth's distant past?",
    right: "Slow changes in Earth's orbit around the Sun",
    wrong: ["Electric cars", "Burning gasoline", "Plastic waste in the ocean"],
    hint: "Over tens of thousands of years, small changes in Earth's orbit and tilt helped start and end ice ages.",
    hard: true,
  },
];

function changingClimate({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  if (difficulty === 1) {
    return shuffle([sortQuestion(EMISSIONS_SORT, 3), co2Question(1), ...levelled(CLIMATE_BANK, 6, 1)]);
  }
  return [
    greenhouseOrder(difficulty),
    ...shuffle([sortQuestion(EMISSIONS_SORT, 4), co2Question(difficulty), ...levelled(CLIMATE_BANK, 5, difficulty)]),
  ];
}

export const course: Course = {
  grade: "7",
  subject: "science",
  bigIdeas: {
    "ca-bc": [
      "Evolution by natural selection provides an explanation for the diversity and survival of living things.",
      "Elements consist of one type of atom, and compounds consist of atoms of different elements chemically combined.",
      "The electromagnetic force produces both electricity and magnetism.",
      "Earth and its climate have changed over geological time.",
    ],
  },
  units: [
    {
      id: "natural-selection",
      title: "Natural Selection",
      emoji: "🦒",
      blurb: "How species adapt and change",
      parentNote:
        "Variation, inherited versus acquired traits, adaptations, and how natural selection changes populations over generations, with fossils and other evidence. Includes reading data from a predator–prey model.",
      standards: { "ca-bc": "Evolution by natural selection; adaptation and variation; evidence such as fossils" },
      generate: naturalSelection,
    },
    {
      id: "atoms-and-elements",
      title: "Atoms & Elements",
      emoji: "⚛️",
      blurb: "Elements, compounds and chemical symbols",
      parentNote:
        "Elements versus compounds and mixtures, chemical symbols (H, O, Na, Cl, Fe, Au…), counting atoms in formulas like H₂O and C₆H₁₂O₆, metals and non-metals, and the basics of the periodic table.",
      standards: {
        "ca-bc": "Elements consist of one type of atom; compounds; chemical symbols; metals and non-metals; the periodic table",
      },
      generate: atomsAndElements,
    },
    {
      id: "circuits-and-static",
      title: "Circuits & Static",
      emoji: "💡",
      blurb: "Circuits, conductors and static charge",
      parentNote:
        "Complete circuits, series versus parallel wiring, conductors and insulators, adding cell voltages, and static electricity (like and opposite charges, lightning).",
      standards: { "ca-bc": "Electromagnetic force: electric circuits, conductors and insulators, static charge" },
      generate: circuits,
    },
    {
      id: "magnets-and-motors",
      title: "Magnets & Motors",
      emoji: "🧲",
      blurb: "Electromagnets, motors and generators",
      parentNote:
        "Magnetic poles and fields, building stronger electromagnets (with a data table to extend), and how motors and generators change energy from one form to another.",
      standards: { "ca-bc": "Electromagnetic force: magnetism, field lines, electromagnets, motors and generators" },
      generate: magnetsAndMotors,
    },
    {
      id: "restless-earth",
      title: "Restless Earth",
      emoji: "🌋",
      blurb: "Plates, quakes and deep time",
      parentNote:
        "Earth's layers, plate tectonics, earthquakes and volcanoes, fossils in rock layers, and the order of major events in Earth's 4.6-billion-year history. Includes how First Nations oral histories and scientific evidence together date the great 1700 earthquake.",
      standards: {
        "ca-bc": "Layers of the Earth; plate tectonics; earthquakes and volcanoes; fossils and geological time; First Peoples knowledge of Earth's history",
      },
      generate: restlessEarth,
    },
    {
      id: "changing-climate",
      title: "Changing Climate",
      emoji: "🌡️",
      blurb: "Greenhouse gases and solutions",
      parentNote:
        "The greenhouse effect, evidence of climate change (real CO₂ measurements, glaciers, ice cores), human causes, actions that help, and the value of Indigenous knowledge of the land.",
      standards: {
        "ca-bc": "Climate change: greenhouse effect, evidence, human causes and actions; Indigenous knowledge of climate and land",
      },
      generate: changingClimate,
    },
  ],
};
