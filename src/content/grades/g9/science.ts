import type { SortSet } from "../../bank";
import { pick, randInt, sample, shuffle } from "../../random";
import type { Course, GenerateOptions, Question } from "../../types";
import { ask, choose, fromParts, levelOf, numQ, orderOf, q, typed, type Item } from "../kit";

// Grade 9 science: cells and cell division, atoms and electrons, bonding and reactions,
// electric current, and ecosystems and sustainability (with BC examples).

type Parts = Parameters<typeof fromParts>[0];
const unit = (parts: Parts) => (opts?: GenerateOptions): Question[] => fromParts(parts, opts);

// ---------- Cells from Cells ----------

const CELL_DIVISION: Item[] = [
  q(1, "Where is the cell's DNA stored in an animal cell?", "in the nucleus", ["in the cell membrane", "in the cytoplasm only", "in the mitochondria only"], "The nucleus holds the chromosomes, which are made of DNA."),
  q(1, "What is a gene?", "A section of DNA that carries instructions for a trait or protein", ["A type of cell", "A kind of organ", "A protein only"], "Genes are the units of heredity: sections of DNA with instructions."),
  q(1, "Why do cells divide?", "To grow, replace old cells and repair damage", ["To get smaller", "To stop working", "To make non-living matter"], "Cell division lets organisms grow and heal."),
  q(1, "Where do new cells come from?", "From existing cells dividing", ["From non-living matter", "From sunlight", "From water alone"], "“Cells are derived from cells,” as the cell theory says."),
  q(2, "What is mitosis?", "Cell division that makes two identical daughter cells", ["Cell division that makes four different cells", "The joining of two cells", "The death of a cell"], "In mitosis, one cell's nucleus divides, making two genetically identical cells."),
  q(2, "Before a cell divides, the DNA is…", "copied, so each new cell gets a full set", ["destroyed", "split into random pieces", "removed from the cell"], "DNA replication ensures each daughter cell receives complete instructions."),
  q(2, "What are the stages of mitosis in order?", "prophase, metaphase, anaphase, telophase", ["metaphase, prophase, telophase, anaphase", "telophase, anaphase, metaphase, prophase", "anaphase, prophase, telophase, metaphase"], "A common memory trick is PMAT: Prophase, Metaphase, Anaphase, Telophase."),
  q(2, "During which stage do chromosomes line up in the middle of the cell?", "metaphase", ["prophase", "anaphase", "telophase"], "In metaphase, chromosomes line up along the cell's centre before being pulled apart."),
  q(2, "What is the cell cycle?", "The series of events a cell goes through as it grows and divides", ["The path of blood around the body", "The cycle of day and night", "The life of a plant seed"], "It includes interphase (growing and copying DNA) and mitosis."),
  q(2, "Most of a cell's life is spent in…", "interphase", ["mitosis", "telophase", "anaphase"], "Interphase is when the cell grows, does its job and copies its DNA."),
  q(2, "How are plant cells different in the last stage of cell division?", "They build a new cell plate between the two cells.", ["They explode.", "They skip it.", "They make a new nucleus only."], "Plant cells have rigid walls, so a cell plate forms and becomes the new wall."),
  q(3, "What can happen when cells ignore the signals to stop dividing?", "They may form a tumour, which can become cancer", ["They die immediately", "They turn into plants", "They stop needing food"], "Cancer begins when cell growth is out of control."),
  q(3, "Why can a cut on your skin heal?", "Nearby cells divide to replace the damaged ones.", ["Skin is non-living.", "The air makes new cells.", "Blood turns into skin."], "Mitosis makes new cells to fill in the injury."),
  q(3, "Which describes a stem cell?", "An unspecialized cell that can divide and develop into different cell types", ["A cell that is stuck in one job forever", "A cell found only in plant stems", "A dead cell"], "Stem cells can become many kinds of cells."),
  q(3, "A skin cell has 46 chromosomes. How many chromosomes does each daughter cell have after mitosis?", "46", ["23", "92", "12"], "Mitosis makes identical copies, so each daughter cell has the same number of chromosomes."),
  q(3, "Which is a reason that damaged DNA can be harmful?", "Instructions copied incorrectly can lead to cells that do not work properly.", ["DNA only affects colour.", "DNA is not copied.", "DNA is outside the cell."], "Mutations change the instructions, and some change how a cell behaves."),
];

const MITOSIS_ORDER = orderOf(
  "Put the stages of cell division in order, earliest first.",
  "Interphase: the cell grows and copies its DNA. Prophase: chromosomes become visible. Metaphase: they line up. Anaphase: they are pulled apart. Telophase: two nuclei form. Then the cell splits.",
  [
    { id: "inter", label: "Interphase: DNA is copied", emoji: "🧬" },
    { id: "pro", label: "Prophase: chromosomes condense", emoji: "🔬" },
    { id: "meta", label: "Metaphase: chromosomes line up", emoji: "➖" },
    { id: "ana", label: "Anaphase: chromosomes pull apart", emoji: "↔️" },
    { id: "telo", label: "Telophase: two new nuclei form", emoji: "⚪" },
  ],
);

// ---------- Atoms & Electrons ----------

interface Element {
  name: string;
  symbol: string;
  z: number;
}

const ELEMENTS: Element[] = [
  { name: "hydrogen", symbol: "H", z: 1 },
  { name: "helium", symbol: "He", z: 2 },
  { name: "lithium", symbol: "Li", z: 3 },
  { name: "beryllium", symbol: "Be", z: 4 },
  { name: "boron", symbol: "B", z: 5 },
  { name: "carbon", symbol: "C", z: 6 },
  { name: "nitrogen", symbol: "N", z: 7 },
  { name: "oxygen", symbol: "O", z: 8 },
  { name: "fluorine", symbol: "F", z: 9 },
  { name: "neon", symbol: "Ne", z: 10 },
  { name: "sodium", symbol: "Na", z: 11 },
  { name: "magnesium", symbol: "Mg", z: 12 },
  { name: "aluminum", symbol: "Al", z: 13 },
  { name: "silicon", symbol: "Si", z: 14 },
  { name: "phosphorus", symbol: "P", z: 15 },
  { name: "sulfur", symbol: "S", z: 16 },
  { name: "chlorine", symbol: "Cl", z: 17 },
  { name: "argon", symbol: "Ar", z: 18 },
  { name: "potassium", symbol: "K", z: 19 },
  { name: "calcium", symbol: "Ca", z: 20 },
];

/** Electrons in each shell for the first 20 elements: 2, 8, 8, then the rest. */
function shells(z: number): number[] {
  const out: number[] = [];
  let left = z;
  for (const cap of [2, 8, 8, 2]) {
    if (left <= 0) break;
    const n = Math.min(left, cap);
    out.push(n);
    left -= n;
  }
  return out;
}

const valence = (z: number): number => shells(z).at(-1) ?? 0;

function elementQuestions(count: number): Question[] {
  const out: Question[] = [];
  for (const e of sample(ELEMENTS, count)) {
    const sh = shells(e.z);
    switch (randInt(0, 2)) {
      case 0:
        out.push(
          numQ(
            `How many valence electrons (electrons in the outer shell) does ${e.name} (${e.symbol}) have?`,
            valence(e.z),
            [valence(e.z) + 1, valence(e.z) - 1, e.z, sh.length],
            `${e.name[0].toUpperCase() + e.name.slice(1)} has ${e.z} electrons in shells of ${sh.join(", ")}. The outer shell holds ${valence(e.z)}.`,
            undefined,
            { min: 0 },
          ),
        );
        break;
      case 1:
        out.push(
          typed(
            `${e.name[0].toUpperCase() + e.name.slice(1)} (${e.symbol}) has atomic number ${e.z}. How many electrons does a neutral atom of it have?`,
            String(e.z),
            "In a neutral atom, the number of electrons equals the number of protons, which is the atomic number.",
            "number",
          ),
        );
        break;
      default:
        out.push(
          numQ(
            `How many electron shells (energy levels) are used by a neutral ${e.name} atom?`,
            sh.length,
            [sh.length + 1, sh.length - 1, sh.length + 2],
            `${e.name[0].toUpperCase() + e.name.slice(1)} has ${e.z} electrons arranged ${sh.join("-")}, so ${sh.length} shell${sh.length === 1 ? " is" : "s are"} in use.`,
            undefined,
            { min: 1 },
          ),
        );
    }
  }
  return out;
}

const ATOMS: Item[] = [
  q(1, "Which particle is found in the nucleus and has a positive charge?", "proton", ["electron", "neutron", "photon"], "Protons are positive. Neutrons are neutral. Electrons are negative and orbit outside."),
  q(1, "An atom's mass number is the number of…", "protons plus neutrons", ["protons only", "electrons only", "shells"], "Protons and neutrons make up almost all the mass of an atom."),
  q(1, "The atomic number of an element is its number of…", "protons", ["neutrons", "shells", "isotopes"], "Each element has a unique number of protons."),
  q(1, "What is the maximum number of electrons in the first shell?", "2", ["4", "8", "18"], "The first shell holds up to 2 electrons, and the second holds up to 8."),
  q(2, "In the periodic table, elements in the same column (group) have…", "similar chemical properties, because they have the same number of valence electrons", ["the same number of protons", "the same mass", "the same colour"], "Valence electrons control how an atom reacts."),
  q(2, "The elements in Group 18 (the noble gases) rarely react because…", "their outer shells are already full", ["they have no electrons", "they are very heavy", "they are liquids"], "A full outer shell is stable, so noble gases don't need to gain or lose electrons."),
  q(2, "Group 1 elements, the alkali metals, are very reactive because they have…", "one valence electron that is easily lost", ["a full outer shell", "no neutrons", "eight valence electrons"], "Losing one electron gives them a stable arrangement."),
  q(2, "In the periodic table, a period (row) tells you…", "the number of electron shells in the atom", ["the number of neutrons", "the colour of the element", "the element's state at 0 °C"], "Elements in the same row have the same number of occupied shells."),
  q(2, "Which of these is a metal?", "sodium", ["oxygen", "chlorine", "carbon"], "Metals are shiny and conduct heat and electricity. Sodium is a soft, reactive metal."),
  q(2, "Metals are generally…", "good conductors of electricity and malleable", ["brittle and poor conductors", "gases at room temperature", "always magnetic"], "Metals can be shaped without breaking and let electrons flow."),
  q(3, "Who proposed that electrons orbit the nucleus in fixed energy levels (shells)?", "Niels Bohr", ["Isaac Newton", "Charles Darwin", "Louis Pasteur"], "The Bohr model arranges electrons in energy levels."),
  q(3, "What is an isotope?", "Atoms of the same element with different numbers of neutrons", ["Atoms with different numbers of protons", "A type of ion", "A kind of molecule"], "Carbon-12 and carbon-14 both have 6 protons but different numbers of neutrons."),
  q(3, "When an atom gains an electron, it becomes…", "a negative ion", ["a positive ion", "a different element", "a neutron"], "More electrons than protons gives a negative charge."),
  q(3, "When an atom loses an electron, it becomes…", "a positive ion", ["a negative ion", "a different element", "an isotope"], "Fewer electrons than protons gives a positive charge."),
];

function atomsAndElectrons(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  return shuffle([...choose(ATOMS, level, 5).map(ask), ...elementQuestions(3)]);
}

// ---------- Bonding & Reactions ----------

const BONDING: Item[] = [
  q(1, "What is a chemical bond?", "An attraction that holds atoms together", ["A kind of mixture", "A type of heat", "A way to separate atoms"], "Atoms bond by sharing or transferring electrons."),
  q(1, "Which type of bond forms when electrons are transferred from a metal to a non-metal?", "ionic", ["covalent", "metallic only", "physical"], "In ionic compounds, positive and negative ions attract each other."),
  q(1, "Which type of bond forms when atoms share electrons?", "covalent", ["ionic", "nuclear", "magnetic"], "Non-metal atoms often share electrons, forming molecules."),
  q(1, "Table salt (NaCl) is made of…", "sodium and chlorine joined by ionic bonds", ["two gases sharing electrons", "carbon and hydrogen", "metals only"], "Sodium gives an electron to chlorine, and the ions attract."),
  q(2, "What is the chemical formula of water?", "H₂O", ["HO₂", "H₂O₂", "H₂"], "Water has 2 hydrogen atoms and 1 oxygen atom."),
  q(2, "What does the formula CO₂ tell you?", "One carbon atom and two oxygen atoms are in each molecule.", ["Two carbon atoms and one oxygen atom", "Carbon is an oxygen ion", "Carbon dioxide is an element"], "The small number (subscript) after a symbol says how many atoms."),
  q(2, "In a chemical equation, the substances on the left of the arrow are the…", "reactants", ["products", "catalysts", "isotopes"], "Reactants change into products: reactants → products."),
  q(2, "The law of conservation of mass says that in a chemical reaction…", "the total mass of reactants equals the total mass of products", ["mass is created", "mass disappears", "products weigh more"], "Atoms are rearranged, not created or destroyed."),
  q(2, "Which equation for hydrogen burning in oxygen is balanced?", "2H₂ + O₂ → 2H₂O", ["H₂ + O₂ → H₂O", "H₂ + O₂ → 2H₂O", "2H₂ + 2O₂ → 2H₂O"], "Count the atoms on each side: 4 H and 2 O on the left, 4 H and 2 O on the right."),
  q(2, "Which equation for methane burning in oxygen is balanced?", "CH₄ + 2O₂ → CO₂ + 2H₂O", ["CH₄ + O₂ → CO₂ + H₂O", "CH₄ + 2O₂ → CO₂ + H₂O", "2CH₄ + 2O₂ → CO₂ + 2H₂O"], "Left: 1 C, 4 H, 4 O. Right: 1 C, 4 H, 2 + 2 = 4 O."),
  q(2, "In 2H₂O, what does the large 2 in front mean?", "There are two molecules of water.", ["Each molecule has two oxygen atoms.", "Each molecule has two hydrogens only.", "Water is doubled in mass."], "A coefficient in front multiplies the whole formula."),
  q(2, "What is an acid?", "A substance that releases hydrogen ions (H⁺) in water and has a pH below 7", ["A substance with pH above 7", "A pure metal", "A neutral liquid"], "Acids have a pH from 0 to less than 7."),
  q(2, "Which pH value is the most basic?", "13", ["2", "7", "5"], "A pH above 7 is basic. The higher the number, the stronger the base."),
  q(3, "Which is evidence that a chemical reaction has occurred?", "A gas forms and the temperature changes", ["Ice melts", "A solid is cut in half", "Salt dissolves in water"], "Gas, colour change, light, heat and a new substance are signs of a chemical change."),
  q(3, "In the reaction of a metal with oxygen to form a metal oxide (like rusting), what is the oxygen?", "a reactant", ["a product", "a catalyst", "an isotope"], "The metal and oxygen react to form the oxide."),
  q(3, "5 g of baking soda reacts with 10 g of vinegar in an open container, and the mass reading drops. What explains it?", "A gas formed and escaped into the air.", ["Mass was destroyed.", "The container shrank.", "Vinegar is lighter than air."], "In a closed container the mass would stay the same. Here a gas escaped."),
  q(3, "A neutralization reaction between an acid and a base produces…", "a salt and water", ["only a gas", "a new element", "a metal"], "For example, hydrochloric acid + sodium hydroxide → sodium chloride + water."),
];

const BOND_SORT: SortSet = {
  prompt: "Ionic or covalent? Sort each compound.",
  hint: "Ionic compounds are usually a metal plus a non-metal (like NaCl). Covalent compounds are usually two or more non-metals sharing electrons (like H₂O).",
  bins: [
    { id: "ionic", label: "Ionic", emoji: "⚡" },
    { id: "covalent", label: "Covalent", emoji: "🤝" },
  ],
  items: [
    { label: "NaCl (table salt)", emoji: "🧂", bin: "ionic" },
    { label: "MgO (magnesium oxide)", emoji: "⚗️", bin: "ionic" },
    { label: "CaCl₂ (calcium chloride)", emoji: "🧊", bin: "ionic" },
    { label: "KBr (potassium bromide)", emoji: "🧪", bin: "ionic" },
    { label: "H₂O (water)", emoji: "💧", bin: "covalent" },
    { label: "CO₂ (carbon dioxide)", emoji: "🌫️", bin: "covalent" },
    { label: "CH₄ (methane)", emoji: "🔥", bin: "covalent" },
    { label: "NH₃ (ammonia)", emoji: "🧴", bin: "covalent" },
  ],
};

// ---------- Electric Current ----------

const ELECTRICITY: Item[] = [
  q(1, "Electric current is…", "the flow of charged particles", ["the push that moves charge", "the opposition to flow", "stored energy"], "Current is how much charge flows past a point each second, measured in amperes (A)."),
  q(1, "In a circuit, voltage is…", "the energy given to each unit of charge (the push)", ["the flow of charge", "the opposition to flow", "the speed of light"], "Voltage is measured in volts (V). A battery provides voltage."),
  q(1, "Resistance is measured in…", "ohms (Ω)", ["volts (V)", "amperes (A)", "watts (W)"], "Resistance opposes current flow and is measured in ohms."),
  q(1, "Which device measures current?", "ammeter", ["voltmeter", "thermometer", "barometer"], "An ammeter measures current (A). A voltmeter measures voltage (V)."),
  q(1, "Which is a good electrical conductor?", "copper", ["rubber", "wood", "glass"], "Metals like copper let electrons move easily. Rubber, wood and glass are insulators."),
  q(2, "What is static electricity?", "A build-up of electric charge on an object", ["A flow of charge in a wire", "A kind of battery", "Heat in a circuit"], "Rubbing materials together can transfer electrons, leaving objects charged."),
  q(2, "Why does a charged balloon stick to a wall?", "Opposite charges attract.", ["Gravity pulls it.", "The wall is a magnet.", "Air pushes it."], "The balloon's charge causes opposite charge to gather on the nearest part of the wall."),
  q(2, "In a series circuit, if one bulb burns out…", "the other bulbs go out too", ["the other bulbs get brighter", "nothing changes", "the battery stops"], "A series circuit has only one path, so a break stops all current."),
  q(2, "In a parallel circuit, if one bulb burns out…", "the other bulbs stay lit", ["all the bulbs go out", "the battery explodes", "current stops everywhere"], "Parallel circuits have separate branches, so current still flows through the others."),
  q(2, "Houses are wired in parallel because…", "each device can work independently on the full voltage", ["it uses less metal", "it makes bulbs dimmer", "series circuits do not work"], "Each branch gets the same voltage and can be turned off without affecting others."),
  q(2, "A switch turns off a circuit by…", "creating a gap so current cannot flow", ["removing the battery's voltage", "increasing the resistance to zero", "making the wire longer"], "An open switch makes an open circuit with no complete path."),
  q(3, "If you increase the resistance in a circuit and keep the voltage the same, the current…", "decreases", ["increases", "stays the same", "becomes static"], "According to Ohm's law, I = V ÷ R, so more resistance means less current."),
  q(3, "A fuse or circuit breaker is used to…", "stop the current if it becomes too large", ["increase the voltage", "store energy", "make bulbs brighter"], "Too much current can overheat wires and cause fires."),
  q(3, "Most of BC's electricity is produced by…", "hydroelectric generating stations", ["coal plants", "wind turbines only", "nuclear plants"], "BC Hydro generates most of its electricity from water, a renewable source."),
  q(3, "Why is it dangerous to use electrical devices near water?", "Water with dissolved substances can conduct electricity through the body.", ["Water is an insulator.", "Water makes devices lighter.", "Water makes voltage zero."], "Impure water conducts electricity, so contact can allow current to pass through you."),
];

function electricity(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const qs: Question[] = choose(ELECTRICITY, level, 5).map(ask);
  const r = randInt(2, level === 1 ? 6 : 12);
  const i = randInt(1, level === 1 ? 4 : 8);
  const v = r * i;
  switch (randInt(0, 2)) {
    case 0:
      qs.push(typed(`A circuit has a resistance of ${r} Ω and a current of ${i} A. What is the voltage in volts? (V = I × R)`, String(v), `V = I × R = ${i} × ${r} = ${v} V.`, "number", { suffix: "V" }));
      break;
    case 1:
      qs.push(typed(`A battery supplies ${v} V to a resistor of ${r} Ω. What is the current in amperes? (I = V ÷ R)`, String(i), `I = V ÷ R = ${v} ÷ ${r} = ${i} A.`, "number", { suffix: "A" }));
      break;
    default:
      qs.push(typed(`A device has ${v} V across it and a current of ${i} A. What is its resistance in ohms? (R = V ÷ I)`, String(r), `R = V ÷ I = ${v} ÷ ${i} = ${r} Ω.`, "number", { suffix: "Ω" }));
  }
  const r2 = randInt(2, 9);
  const r3 = randInt(2, 9);
  qs.push(typed(`Two resistors, ${r2} Ω and ${r3} Ω, are connected in series. What is the total resistance?`, String(r2 + r3), `In a series circuit the resistances add: ${r2} + ${r3} = ${r2 + r3} Ω.`, "number", { suffix: "Ω" }));
  const watts = pick([2, 3, 4, 5, 6]) * pick([10, 20, 30]);
  const hrs = pick([2, 3, 4, 5]);
  qs.push(
    typed(`A ${watts} W device runs for ${hrs} hours. How many watt-hours of energy does it use? (E = P × t)`, String(watts * hrs), `Energy = power × time = ${watts} × ${hrs} = ${watts * hrs} Wh.`, "number", { suffix: "Wh" }),
  );
  return shuffle(qs).slice(0, 9);
}

// ---------- Ecosystems & Sustainability ----------

const ECOSYSTEMS: Item[] = [
  q(1, "What is an ecosystem?", "All the living and non-living things in an area, and how they interact", ["Only the animals in a place", "Only the plants in a place", "A kind of weather"], "Ecosystems include organisms (biotic factors) and their environment (abiotic factors)."),
  q(1, "Which is an abiotic factor?", "sunlight", ["a salmon", "a cedar tree", "a bear"], "Abiotic means non-living, like sunlight, water, soil and temperature."),
  q(1, "What does a producer do in a food chain?", "Makes its own food, usually by photosynthesis", ["Eats other animals", "Breaks down dead things", "Hunts in packs"], "Plants and algae are producers and form the base of food chains."),
  q(1, "Decomposers such as fungi and bacteria…", "break down dead matter and return nutrients to the soil", ["make food from sunlight", "hunt animals", "produce oxygen only"], "Decomposers recycle nutrients so producers can use them again."),
  q(2, "Why are there fewer organisms at each higher level of a food pyramid?", "Only about 10% of the energy passes to the next level.", ["Predators are lazy.", "The Sun gets weaker.", "Plants eat animals."], "Most energy is used or lost as heat at each level."),
  q(2, "Salmon return from the ocean to BC rivers to spawn and die. How do they help the forest ecosystem?", "Their bodies add nutrients to the soil and feed many animals.", ["They pollute the water.", "They remove all trees.", "They have no effect."], "Bears, eagles and even trees benefit from the nutrients."),
  q(2, "What is biodiversity?", "The variety of living things in an ecosystem", ["The number of trees only", "The size of a lake", "The amount of rainfall"], "A greater variety makes an ecosystem more resilient."),
  q(2, "What is an invasive species?", "A non-native species that spreads and harms the ecosystem", ["Any new plant", "A native animal", "A rare plant in a garden"], "Examples in BC include Scotch broom, European green crab and purple loosestrife."),
  q(2, "In the carbon cycle, which process takes carbon dioxide out of the air?", "photosynthesis", ["burning fuels", "respiration", "decomposition"], "Plants take in CO₂ to make sugars."),
  q(2, "How do burning fossil fuels affect the carbon cycle?", "They add carbon dioxide to the atmosphere faster than it can be removed.", ["They remove carbon dioxide.", "They have no effect.", "They make oxygen."], "Carbon locked underground for millions of years is released quickly."),
  q(2, "Warmer winters in BC have helped the mountain pine beetle survive. What has been the result?", "Large areas of pine forest have died.", ["Pine forests have grown larger.", "The beetle has gone extinct.", "Pine forests are unaffected."], "Fewer very cold days means fewer beetles die in winter."),
  q(2, "Which is an example of sustainable resource use?", "Harvesting trees at a rate that lets the forest regrow", ["Cutting all trees in an area", "Dumping waste in rivers", "Overfishing a population"], "Sustainability means meeting needs now without harming the future."),
  q(3, "What is bioaccumulation?", "A build-up of a substance, such as a toxin, in an organism over time", ["The growth of a plant", "The movement of animals", "The breakdown of rocks"], "Toxins can build up in tissues and become more concentrated in higher levels of a food web (biomagnification)."),
  q(3, "Why can removing one keystone species (like sea otters in kelp forests) have large effects?", "Many other species depend on it, directly or indirectly.", ["Keystone species are the most numerous.", "Nothing depends on them.", "They only live in labs."], "Sea otters eat urchins, which would otherwise destroy kelp that shelters fish."),
  q(3, "Which action would most help protect biodiversity in a local watershed?", "Restoring wetlands and protecting stream banks", ["Paving over wetlands", "Introducing new species at random", "Draining streams"], "Healthy habitats support many species."),
  q(3, "Indigenous peoples have cared for ecosystems in BC for thousands of years. What can this knowledge help with today?", "Managing land and waters sustainably", ["Nothing, because it is old", "Only art projects", "Only museums"], "Traditional ecological knowledge can guide modern stewardship, and many nations lead conservation work today."),
  q(3, "A population graph shows deer numbers rising and then falling as wolves are reintroduced. What does this show?", "Predators can limit prey populations.", ["Deer cannot reproduce.", "Wolves are producers.", "Populations never change."], "Predator-prey relationships help balance populations."),
];

const ROLE_SORT: SortSet = {
  prompt: "Producer, consumer or decomposer? Sort each organism.",
  hint: "Producers make their own food. Consumers eat other organisms. Decomposers break down dead matter.",
  bins: [
    { id: "producer", label: "Producer", emoji: "🌱" },
    { id: "consumer", label: "Consumer", emoji: "🦌" },
    { id: "decomposer", label: "Decomposer", emoji: "🍄" },
  ],
  items: [
    { label: "Douglas fir tree", emoji: "🌲", bin: "producer" },
    { label: "kelp", emoji: "🌿", bin: "producer" },
    { label: "black-tailed deer", emoji: "🦌", bin: "consumer" },
    { label: "orca", emoji: "🐋", bin: "consumer" },
    { label: "mushrooms breaking down a fallen log", emoji: "🍄", bin: "decomposer" },
    { label: "soil bacteria", emoji: "🦠", bin: "decomposer" },
  ],
};

// ---------- Course ----------

export const course: Course = {
  grade: "9",
  subject: "science",
  bigIdeas: {
    "ca-bc": [
      "Cells are derived from cells.",
      "The electron arrangement of atoms impacts their chemical nature.",
      "Electric current is the flow of charged particles.",
      "Disruptions to ecosystems affect the sustainability of local and global environments.",
    ],
  },
  units: [
    {
      id: "cells-from-cells",
      title: "Cells from Cells",
      emoji: "🧫",
      blurb: "DNA, mitosis and growth",
      standards: { "ca-bc": "Cell division: DNA, genes, the cell cycle, mitosis and the role of cell division in growth and repair" },
      parentNote:
        "How cells copy their DNA and divide by mitosis, the stages in order, why cells divide for growth and healing, and what can go wrong when cell growth isn't controlled.",
      generate: unit({ items: CELL_DIVISION, orders: [MITOSIS_ORDER] }),
    },
    {
      id: "atoms-and-electrons",
      title: "Atoms & Electrons",
      emoji: "⚛️",
      blurb: "Shells, valence and the periodic table",
      standards: { "ca-bc": "Atomic structure and the periodic table: electron arrangement, valence electrons and ions" },
      parentNote:
        "Protons, neutrons and electrons, drawing electron shells for the first 20 elements, valence electrons, periodic table groups and periods, and ions and isotopes.",
      generate: atomsAndElectrons,
    },
    {
      id: "bonding-and-reactions",
      title: "Bonding & Reactions",
      emoji: "🧪",
      blurb: "Ionic, covalent and balanced equations",
      standards: { "ca-bc": "Chemical bonding and chemical reactions: ionic and covalent compounds, conservation of mass, acids and bases" },
      parentNote:
        "Ionic and covalent bonds, reading chemical formulas, balancing equations, the law of conservation of mass, evidence of chemical change, and acids and bases.",
      generate: unit({ items: BONDING, sorts: [BOND_SORT] }),
    },
    {
      id: "electric-current",
      title: "Electric Current",
      emoji: "🔌",
      blurb: "Circuits, Ohm's law and safety",
      standards: { "ca-bc": "Electricity: static electricity, current, voltage, resistance, Ohm's law, series and parallel circuits" },
      parentNote:
        "Static electricity, current, voltage and resistance, solving V = I × R, series and parallel circuits, electrical safety, and electricity generation in BC.",
      generate: electricity,
    },
    {
      id: "ecosystems",
      title: "Ecosystems & Sustainability",
      emoji: "🌲",
      blurb: "Food webs, cycles and human impact",
      standards: { "ca-bc": "Ecosystems: energy flow, biodiversity, nutrient cycles, invasive species and human impacts on sustainability" },
      parentNote:
        "Energy and nutrient flow in ecosystems, the carbon cycle, biodiversity and keystone species, BC examples like salmon and the mountain pine beetle, and ways to keep ecosystems sustainable.",
      generate: unit({ items: ECOSYSTEMS, sorts: [ROLE_SORT] }),
    },
  ],
};
