import { chance, pick, randInt, shuffle, textChoice } from "../../random";
import type { Course, GenerateOptions, InputQuestion, OrderQuestion, Question, Visual } from "../../types";
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

/** Eight questions: the generated/sort/order extras plus enough bank items to fill up. */
function make(bank: Item[], difficulty: Level, extras: Question[], total = 8): Question[] {
  return shuffle([...levelled(bank, total - extras.length, difficulty), ...extras]);
}

const level = (o?: GenerateOptions): Level => o?.difficulty ?? 2;

/** Two-basket sorts: 6 items at difficulty 1, 8 at 2 and 3. */
const perBin = (difficulty: Level) => (difficulty === 1 ? 3 : 4);

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Format a number of tenths (e.g. 25 -> "2.5", 30 -> "3"). */
function tenths(n10: number): string {
  return n10 % 10 === 0 ? String(n10 / 10) : (n10 / 10).toFixed(1);
}

function numInput(
  prompt: string,
  answer: number | string,
  hint: string,
  keypad: InputQuestion["keypad"] = "number",
  suffix?: string,
  visual?: Visual,
): InputQuestion {
  return { kind: "input", prompt, answer: String(answer), hint, keypad, suffix, visual };
}

// ---------- Scientific Inquiry ----------

interface Experiment {
  setup: string;
  ind: string;
  dep: string;
  controls: string[];
}

const EXPERIMENTS: Experiment[] = [
  {
    setup: "Amira grows bean plants to test how the hours of sunlight per day affect plant height.",
    ind: "hours of sunlight per day",
    dep: "height of the bean plants",
    controls: ["type of bean seed", "amount of water", "size of pot", "type of soil"],
  },
  {
    setup: "Kenji tests how water temperature affects how quickly sugar dissolves.",
    ind: "water temperature",
    dep: "time for the sugar to dissolve",
    controls: ["mass of sugar", "volume of water", "amount of stirring"],
  },
  {
    setup: "Priya rolls a toy car down a ramp to test how ramp height affects the distance the car travels.",
    ind: "height of the ramp",
    dep: "distance the car travels",
    controls: ["the car used", "the ramp surface", "the way the car is released"],
  },
  {
    setup: "Leo slides a block across different surfaces to test how the surface affects the time the block takes to stop.",
    ind: "type of surface",
    dep: "time the block takes to stop",
    controls: ["the block used", "the starting speed", "the length of the track"],
  },
  {
    setup: "Noah swings pendulums to test how the length of the string affects the time for 10 swings.",
    ind: "length of the string",
    dep: "time for 10 swings",
    controls: ["mass of the bob", "starting angle", "how the time is measured"],
  },
  {
    setup: "Zoe tests how the amount of salt in water affects how long an ice cube takes to melt.",
    ind: "amount of salt in the water",
    dep: "time for the ice cube to melt",
    controls: ["size of the ice cube", "volume of water", "starting water temperature"],
  },
];

function variableQuestion(): Question {
  const e = pick(EXPERIMENTS);
  const style = randInt(0, 2);
  if (style === 0) {
    return textChoice(
      `${e.setup} What is the independent (manipulated) variable?`,
      e.ind,
      [e.dep, pick(e.controls)],
      "The independent variable is the one thing the experimenter deliberately changes. What is measured at the end is the dependent variable.",
    );
  }
  if (style === 1) {
    return textChoice(
      `${e.setup} What is the dependent (responding) variable?`,
      e.dep,
      [e.ind, pick(e.controls)],
      "The dependent variable is what you measure to see the effect. It depends on the change you made.",
    );
  }
  return textChoice(
    `${e.setup} Which of these must be kept the same to make it a fair test?`,
    pick(e.controls),
    [e.ind, e.dep],
    "Controlled variables stay the same so that only the independent variable can explain any change in the results.",
  );
}

interface Conversion {
  from: string;
  to: string;
  factor: number;
  fromName: string;
  toName: string;
}

const CONVERSIONS: Conversion[] = [
  { from: "km", to: "m", factor: 1000, fromName: "kilometres", toName: "metres" },
  { from: "m", to: "cm", factor: 100, fromName: "metres", toName: "centimetres" },
  { from: "cm", to: "mm", factor: 10, fromName: "centimetres", toName: "millimetres" },
  { from: "kg", to: "g", factor: 1000, fromName: "kilograms", toName: "grams" },
  { from: "g", to: "mg", factor: 1000, fromName: "grams", toName: "milligrams" },
  { from: "L", to: "mL", factor: 1000, fromName: "litres", toName: "millilitres" },
];

function conversionQuestion(difficulty: Level): InputQuestion {
  const c = pick(CONVERSIONS);
  const decimals = difficulty > 1;
  const q10 = decimals ? randInt(11, 99) : randInt(1, 9) * 10;
  const q = tenths(q10);
  const big = tenths(q10 * c.factor); // q * factor, written without float error
  const bigText = (q10 * c.factor) % 10 === 0 ? String((q10 * c.factor) / 10) : big;
  if (difficulty === 3 || chance(0.5)) {
    // small unit -> big unit
    return numInput(
      `Convert ${bigText} ${c.to} to ${c.fromName}.`,
      q,
      `1 ${c.from} = ${c.factor} ${c.to}. Going from the smaller unit to the larger one, divide by ${c.factor}. That moves the decimal point ${String(c.factor).length - 1} place${c.factor === 10 ? "" : "s"} left.`,
      "decimal",
      c.from,
    );
  }
  return numInput(
    `Convert ${q} ${c.from} to ${c.toName}.`,
    bigText,
    `1 ${c.from} = ${c.factor} ${c.to}. Going from the larger unit to the smaller one, multiply by ${c.factor}. That moves the decimal point ${String(c.factor).length - 1} place${c.factor === 10 ? "" : "s"} right.`,
    "decimal",
    c.to,
  );
}

function speedGraph(difficulty: Level): Question {
  const v = randInt(2, 5);
  const xs = [0, 1, 2, 3, 4, 5, 6];
  const visual: Visual = {
    type: "plot",
    xMin: 0,
    xMax: 6,
    yMin: 0,
    yMax: 6 * v,
    step: 2,
    curves: [{ points: xs.map((x) => ({ x, y: v * x })), label: "cart" }],
    points: [{ x: 4, y: 4 * v, label: "A" }],
  };
  const setup = "The graph shows the distance (m, vertical axis) of a cart from its start against time (s, horizontal axis).";
  if (difficulty === 1) {
    return numInput(
      `${setup} How far from the start is the cart at point A (4 s)?`,
      4 * v,
      "Find 4 s on the horizontal axis, go up to point A, then read across to the vertical axis.",
      "number",
      "m",
      visual,
    );
  }
  return numInput(
    `${setup} What is the cart's speed?`,
    v,
    "Speed = distance ÷ time. Read the distance at point A and divide by 4 s. On a straight line through the origin, this is the slope.",
    "number",
    "m/s",
    visual,
  );
}

function plantBars(): Question {
  const groups = ["No fertilizer", "Fertilizer A", "Fertilizer B", "Fertilizer C"];
  const used = new Set<number>();
  const values = groups.map(() => {
    let v = randInt(6, 20);
    while (used.has(v)) v = randInt(6, 20);
    used.add(v);
    return v;
  });
  const visual: Visual = {
    type: "bars",
    title: "Plant height after 4 weeks (cm)",
    bars: groups.map((label, i) => ({ label, value: values[i] })),
  };
  if (chance(0.5)) {
    const best = values.indexOf(Math.max(...values));
    return textChoice(
      "A class grew plants with different fertilizers. Which treatment gave the tallest plants?",
      groups[best],
      groups.filter((_, i) => i !== best),
      "Find the tallest bar. The bar labels tell you which treatment it was.",
      visual,
    );
  }
  const a = randInt(1, 3);
  return numInput(
    `By how many centimetres did ${groups[a]} plants beat the plants with no fertilizer? (Enter a negative number if they were shorter.)`,
    values[a] - values[0],
    `Subtract the no-fertilizer height (${values[0]}) from the ${groups[a]} height (${values[a]}).`,
    "integer",
    "cm",
    visual,
  );
}

const INQUIRY_BANK: Item[] = [
  {
    prompt: "Which is the SI base unit of mass?",
    right: "kilogram (kg)",
    wrong: ["gram (g)", "pound (lb)", "newton (N)"],
    hint: "The SI system uses the kilogram as its base unit of mass, even though it already has a prefix. A newton measures force.",
  },
  {
    prompt: "Which tool would you use to measure 35 mL of water most accurately?",
    right: "graduated cylinder",
    wrong: ["beaker", "balance", "thermometer"],
    hint: "A graduated cylinder has fine markings for volume. A beaker's markings are only rough, and a balance measures mass.",
  },
  {
    prompt: "When reading the volume of water in a graduated cylinder, where should your eyes be and what do you read?",
    right: "Eyes level with the surface; read the bottom of the curve (meniscus)",
    wrong: [
      "Eyes above the cylinder; read the top of the curve",
      "Eyes level with the surface; read the top of the curve",
      "Eyes below the cylinder; read the bottom of the curve",
    ],
    hint: "Water curves up the sides. Looking from the side at eye level and reading the bottom of the curve avoids a parallax error.",
  },
  {
    prompt: "A hypothesis is best described as…",
    right: "a testable prediction that explains what you think will happen and why",
    wrong: [
      "a fact that has already been proven",
      "a list of the measurements you collected",
      "a question that can't be tested",
    ],
    hint: "A hypothesis comes before the experiment. It must be testable, and it can turn out to be wrong.",
  },
  {
    prompt: "Which statement is an observation rather than an inference?",
    right: "The soil in the pot is dark and damp.",
    wrong: ["The plant is dying because it got too much water.", "Someone forgot to water the plant.", "The plant doesn't like this room."],
    hint: "An observation is what you can see, measure or hear directly. An inference is an explanation you add to it.",
  },
  {
    prompt: "Why do scientists repeat their trials several times?",
    right: "To make the results more reliable by reducing the effect of chance errors",
    wrong: [
      "To make sure the hypothesis is proven right",
      "To change the independent variable each time",
      "Because one trial is never allowed",
    ],
    hint: "A single result might be a fluke. Repeating and averaging gives more trustworthy data, whether or not it supports your hypothesis.",
  },
  {
    prompt: "Which type of graph is best for showing how a temperature changes over 12 hours?",
    right: "line graph",
    wrong: ["pie chart", "bar graph of unrelated categories", "pictograph of favourite colours"],
    hint: "A line graph shows continuous change over time, with one point for each time you measured.",
  },
  {
    prompt: "A student's thermometer always reads 2 °C too high. Their readings are consistent with each other but wrong. This is a problem with…",
    right: "accuracy",
    wrong: ["precision", "the control variable", "the hypothesis"],
    hint: "Precise results agree with each other. Accurate results are close to the true value. These readings are precise but not accurate.",
    hard: true,
  },
  {
    prompt: "In a fair test, how many variables should you change at a time?",
    right: "one",
    wrong: ["two", "all of them", "none"],
    hint: "Change only the independent variable. If you change two things, you can't tell which one caused the result.",
  },
  {
    prompt: "A group's graph shows a straight line sloping up through the origin for distance against time. What does this tell you?",
    right: "The speed is constant",
    wrong: ["The object is not moving", "The object is slowing down", "The object is speeding up"],
    hint: "A straight line has a constant slope, and slope on a distance–time graph is speed. A flat line would mean no movement.",
    hard: true,
  },
  {
    prompt: "A group says: 'Plants in the sun grew taller, so sunlight causes plants to grow taller.' What would make this conclusion stronger?",
    right: "Repeating the test with more plants and the same conditions",
    wrong: [
      "Changing the type of plant for the sun group",
      "Ignoring the plants that did not grow",
      "Writing the conclusion before collecting data",
    ],
    hint: "Stronger conclusions come from more trials, controlled variables and honest use of all the data.",
    hard: true,
  },
  {
    prompt: "What does the prefix 'milli-' mean?",
    right: "one thousandth (0.001)",
    wrong: ["one thousand (1000)", "one hundredth (0.01)", "one millionth (0.000001)"],
    hint: "A millimetre is 1/1000 of a metre, so there are 1000 mm in 1 m. 'Kilo-' is the thousand.",
  },
  {
    prompt: "Which unit would be the most sensible for measuring the mass of a paper clip?",
    right: "grams",
    wrong: ["kilograms", "tonnes", "kilometres"],
    hint: "A paper clip is tiny: about one gram. A kilometre is a unit of length, so it can't measure mass.",
  },
  {
    prompt: "A data table has the column heading 'Time (s)'. What does the '(s)' tell you?",
    right: "The time was measured in seconds",
    wrong: ["The time was measured in samples", "The numbers are the sum of all trials", "The time is an estimate"],
    hint: "Headings show the quantity and its unit in brackets, so anyone reading the table knows what the numbers mean.",
  },
  {
    prompt: "Which is the best way to reduce bias in an experiment?",
    right: "Decide how you will measure and record before you start, and report all results",
    wrong: [
      "Leave out results that don't match your hypothesis",
      "Only test the conditions you expect to work",
      "Change the method partway through if you don't like the data",
    ],
    hint: "Scientists plan their method ahead of time and report everything, including surprises.",
    hard: true,
  },
];

function scientificInquiry(opts?: GenerateOptions): Question[] {
  const d = level(opts);
  return make(INQUIRY_BANK, d, [variableQuestion(), conversionQuestion(d), speedGraph(d), plantBars()], 8);
}

// ---------- Cells & Microscopes ----------

function magnification(difficulty: Level): Question {
  const eyepiece = pick([10, 10, 15]);
  const objective = pick(difficulty === 1 ? [4, 10] : [4, 10, 40]);
  const total = eyepiece * objective;
  if (difficulty === 3 && chance(0.5)) {
    return numInput(
      `A microscope has a ${eyepiece}× eyepiece lens. Maya sees a cell at a total magnification of ${total}×. What power is the objective lens?`,
      objective,
      `Total magnification = eyepiece × objective. Divide ${total} by ${eyepiece}.`,
      "number",
      "×",
    );
  }
  return numInput(
    `A microscope has a ${eyepiece}× eyepiece lens and a ${objective}× objective lens. What is the total magnification?`,
    total,
    "Total magnification = eyepiece power × objective power. Multiply the two.",
    "number",
    "×",
  );
}

const ORGANISM_LEVELS = [
  { id: "cell", label: "cell" },
  { id: "tissue", label: "tissue" },
  { id: "organ", label: "organ" },
  { id: "system", label: "organ system" },
  { id: "organism", label: "organism" },
];

function levelsOrder(difficulty: Level): OrderQuestion {
  const items = difficulty === 1 ? ORGANISM_LEVELS.slice(0, 4) : ORGANISM_LEVELS;
  return {
    kind: "order",
    prompt: "Put the levels of organization in a multicellular organism in order, from smallest to largest.",
    hint: "Cells of one type form a tissue, different tissues work together as an organ, organs form an organ system, and systems make up the whole organism.",
    items,
  };
}

const CELL_SORT: SortSet = {
  prompt: "Plant cells only, or found in both plant and animal cells? Sort each cell part.",
  hint: "Both kinds of cell have a nucleus, membrane, cytoplasm and mitochondria. Only plant cells have a cell wall, chloroplasts and a large central vacuole.",
  bins: [
    { id: "plant", label: "plant cells only", emoji: "🌿" },
    { id: "both", label: "plant and animal cells", emoji: "🔬" },
  ],
  items: [
    { label: "cell wall", emoji: "🧱", bin: "plant" },
    { label: "chloroplasts", emoji: "🍃", bin: "plant" },
    { label: "large central vacuole", emoji: "💧", bin: "plant" },
    { label: "nucleus", emoji: "⚫", bin: "both" },
    { label: "cell membrane", emoji: "🫧", bin: "both" },
    { label: "mitochondria", emoji: "🔋", bin: "both" },
    { label: "cytoplasm", emoji: "🧪", bin: "both" },
    { label: "ribosomes", emoji: "🔹", bin: "both" },
  ],
};

const CELLS_BANK: Item[] = [
  {
    prompt: "Which statement is part of the cell theory?",
    right: "All living things are made of one or more cells",
    wrong: [
      "Cells can form from non-living matter",
      "Only animals are made of cells",
      "Cells are the smallest things that exist",
    ],
    hint: "The cell theory has three parts: all living things are made of cells, the cell is the basic unit of life, and all cells come from existing cells.",
  },
  {
    prompt: "Where do new cells come from, according to the cell theory?",
    right: "From existing cells that divide",
    wrong: ["From non-living material", "From water and sunlight alone", "From the cell wall"],
    hint: "The third part of the cell theory says all cells come from pre-existing cells.",
  },
  {
    prompt: "Which organelle contains the cell's DNA and controls its activities?",
    right: "nucleus",
    wrong: ["vacuole", "cell membrane", "ribosome"],
    hint: "The nucleus holds the genetic instructions. It is often called the control centre.",
  },
  {
    prompt: "Which organelle releases usable energy from glucose through cellular respiration?",
    right: "mitochondrion",
    wrong: ["chloroplast", "nucleus", "cell wall"],
    hint: "Mitochondria are the cell's power stations. Chloroplasts make glucose instead of breaking it down.",
  },
  {
    prompt: "Which organelle captures light energy for photosynthesis?",
    right: "chloroplast",
    wrong: ["mitochondrion", "vacuole", "ribosome"],
    hint: "Chloroplasts contain the green pigment chlorophyll, which absorbs light. Animal cells do not have them.",
  },
  {
    prompt: "What does the cell membrane do?",
    right: "Controls which materials enter and leave the cell",
    wrong: ["Stores the cell's DNA", "Makes glucose from sunlight", "Gives every cell a rigid, square shape"],
    hint: "The membrane is selectively permeable. It lets some materials through and keeps others out or in.",
  },
  {
    prompt: "What is the main job of ribosomes?",
    right: "Build proteins",
    wrong: ["Store water", "Release energy from food", "Digest the cell's DNA"],
    hint: "Ribosomes read instructions from the nucleus and assemble proteins.",
  },
  {
    prompt: "A student looks at onion skin under a microscope and sees box-like cells with a clear, firm outline. Which structure explains the firm outline?",
    right: "cell wall",
    wrong: ["nucleus", "mitochondria", "cytoplasm"],
    hint: "Plant cells have a rigid cell wall outside the membrane, which gives plants support and a regular shape.",
  },
  {
    prompt: "Which cell is specialized to carry oxygen around the body?",
    right: "red blood cell",
    wrong: ["nerve cell", "muscle cell", "skin cell"],
    hint: "Red blood cells contain haemoglobin, which binds oxygen. They are small, flexible discs that squeeze through tiny vessels.",
  },
  {
    prompt: "Nerve cells are long and thin with branching ends. How does this shape help them?",
    right: "It lets them carry messages over long distances to many other cells",
    wrong: [
      "It lets them store large amounts of food",
      "It lets them photosynthesize",
      "It lets them fit inside the nucleus",
    ],
    hint: "In specialized cells, structure matches function. A long cell with branches can send signals far and reach many cells.",
  },
  {
    prompt: "What is the name for a group of similar cells that work together to do one job, such as muscle?",
    right: "tissue",
    wrong: ["organ", "organelle", "organism"],
    hint: "Cells form tissues, tissues form organs. Organelles are the parts inside a single cell.",
  },
  {
    prompt: "Why do cells have to be small?",
    right: "A small cell has more surface area compared to its volume, so materials can move in and out quickly enough",
    wrong: [
      "Large cells would not fit under a microscope",
      "The cell membrane can only hold small amounts of water",
      "Large cells have no nucleus",
    ],
    hint: "As a cell grows, its volume increases faster than its surface area. Eventually it can't exchange materials fast enough.",
    hard: true,
  },
  {
    prompt: "Oxygen moves from the air in the lungs, where it is concentrated, into blood, where it is less concentrated. What is this movement called?",
    right: "diffusion",
    wrong: ["respiration", "photosynthesis", "reproduction"],
    hint: "Diffusion is the movement of particles from an area of higher concentration to an area of lower concentration, with no energy needed from the cell.",
    hard: true,
  },
  {
    prompt: "Why did Robert Hooke's 1665 observation of cork matter to the cell theory?",
    right: "He saw tiny box-like compartments and named them 'cells'",
    wrong: [
      "He proved that all cells come from existing cells",
      "He discovered the nucleus in animal cells",
      "He found the first living bacteria",
    ],
    hint: "Hooke looked at thin slices of cork with an early microscope and named the compartments he saw. Other scientists later built the cell theory.",
    hard: true,
  },
  {
    prompt: "You switch from a 10× objective to a 40× objective. What happens to the field of view?",
    right: "It gets smaller, so you see less of the specimen but in more detail",
    wrong: ["It gets bigger, so you see more of the specimen", "It stays the same size", "It turns upside down permanently"],
    hint: "Higher magnification shows a smaller part of the slide. Always find the specimen on low power first.",
    hard: true,
  },
  {
    prompt: "A microscope's coarse focus knob should NOT be used with the high-power objective because…",
    right: "you could crash the lens into the slide and break it",
    wrong: [
      "it makes the light too bright",
      "it only works for plant cells",
      "it changes the eyepiece power",
    ],
    hint: "At high power the lens sits very close to the slide. Use the fine focus knob only.",
  },
];

function cellsAndMicroscopes(opts?: GenerateOptions): Question[] {
  const d = level(opts);
  return make(CELLS_BANK, d, [magnification(d), levelsOrder(d), sortQuestion(CELL_SORT, perBin(d))], 8);
}

// ---------- Photosynthesis & Respiration ----------

const PROCESS_SORT: SortSet = {
  prompt: "Photosynthesis or cellular respiration? Sort each description.",
  hint: "Photosynthesis builds glucose using light, carbon dioxide and water. Cellular respiration breaks glucose down with oxygen to release energy.",
  bins: [
    { id: "photo", label: "photosynthesis", emoji: "☀️" },
    { id: "resp", label: "cellular respiration", emoji: "🔋" },
  ],
  items: [
    { label: "needs light energy", emoji: "💡", bin: "photo" },
    { label: "takes in carbon dioxide", emoji: "☁️", bin: "photo" },
    { label: "makes glucose", emoji: "🍬", bin: "photo" },
    { label: "happens in chloroplasts", emoji: "🍃", bin: "photo" },
    { label: "releases energy from glucose", emoji: "⚡", bin: "resp" },
    { label: "uses oxygen", emoji: "💨", bin: "resp" },
    { label: "produces carbon dioxide and water", emoji: "🫧", bin: "resp" },
    { label: "happens in mitochondria", emoji: "🔋", bin: "resp" },
  ],
};

const PROCESS_BANK: Item[] = [
  {
    prompt: "Which word equation shows photosynthesis?",
    right: "carbon dioxide + water → glucose + oxygen",
    wrong: [
      "glucose + oxygen → carbon dioxide + water",
      "glucose + water → carbon dioxide + oxygen",
      "carbon dioxide + oxygen → glucose + water",
    ],
    hint: "Photosynthesis takes in light, carbon dioxide and water and produces glucose and oxygen. It is the reverse of respiration.",
  },
  {
    prompt: "Which word equation shows cellular respiration?",
    right: "glucose + oxygen → carbon dioxide + water + energy",
    wrong: [
      "carbon dioxide + water → glucose + oxygen",
      "glucose + carbon dioxide → oxygen + water",
      "oxygen + water → glucose + carbon dioxide",
    ],
    hint: "In respiration, glucose is broken down using oxygen. Carbon dioxide and water are the waste products, and energy is released.",
  },
  {
    prompt: "Where does the energy stored in glucose originally come from?",
    right: "Light energy from the Sun, captured by photosynthesis",
    wrong: ["Heat from the soil", "Water absorbed by the roots", "Oxygen in the air"],
    hint: "Photosynthesis converts light energy into chemical energy stored in glucose. Almost all food chains begin with it.",
  },
  {
    prompt: "Which gas do plants take in for photosynthesis?",
    right: "carbon dioxide",
    wrong: ["oxygen", "nitrogen", "hydrogen"],
    hint: "Carbon dioxide enters the leaf through tiny pores called stomata.",
  },
  {
    prompt: "Why are most leaves flat and thin?",
    right: "To catch more light and let gases reach the cells quickly",
    wrong: [
      "To store as much water as possible",
      "To stay heavy in the wind",
      "To keep light out of the plant",
    ],
    hint: "A large, thin surface absorbs more light, and gases only have a short distance to travel inside the leaf.",
  },
  {
    prompt: "Do plant cells carry out cellular respiration?",
    right: "Yes. Plants make glucose by photosynthesis and then release its energy by respiration",
    wrong: [
      "No. Plants only photosynthesize",
      "Only at night, and only in the roots",
      "Only animals have mitochondria, so plants cannot",
    ],
    hint: "Plant cells have mitochondria and respire all day and night. In daylight they usually photosynthesize faster than they respire.",
  },
  {
    prompt: "Which part of a plant cell contains the green pigment that absorbs light?",
    right: "chloroplast",
    wrong: ["vacuole", "nucleus", "cell wall"],
    hint: "Chlorophyll is the pigment inside the chloroplast. It reflects green light, which is why leaves look green.",
  },
  {
    prompt: "A hockey player breathes faster during a game. Why does this help her muscle cells?",
    right: "More oxygen reaches the cells for cellular respiration, and carbon dioxide leaves faster",
    wrong: [
      "The muscle cells begin photosynthesis",
      "Carbon dioxide is needed to make more energy",
      "Oxygen is turned into glucose",
    ],
    hint: "Active muscles respire faster. They need more oxygen and produce more carbon dioxide to be removed.",
  },
  {
    prompt: "What is glucose used for in a plant?",
    right: "As fuel for cellular respiration and as a building block for materials such as starch and cellulose",
    wrong: [
      "Only to make flowers smell sweet",
      "To make the leaves absorb carbon dioxide",
      "It is a waste product that is released through the stomata",
    ],
    hint: "Plants use glucose for energy and to build new tissues. Extra glucose can be stored as starch.",
    hard: true,
  },
  {
    prompt: "A potted plant is put in a dark cupboard for a week. Why will it eventually die?",
    right: "Without light it cannot photosynthesize, so it runs out of stored glucose",
    wrong: [
      "Without light its cells stop respiring",
      "It takes in too much oxygen in the dark",
      "Darkness destroys the chlorophyll's carbon dioxide",
    ],
    hint: "Respiration keeps using up glucose, but without light there is no photosynthesis to make more.",
    hard: true,
  },
  {
    prompt: "Which change would most directly speed up photosynthesis in a plant that is in dim light?",
    right: "Move it to a brighter spot",
    wrong: ["Give it less carbon dioxide", "Cover its leaves with foil", "Lower the oxygen level around it"],
    hint: "Light, carbon dioxide, water and temperature all limit the rate. If light is the limiting factor, adding light helps.",
    hard: true,
  },
  {
    prompt: "A sealed jar holds a healthy plant in strong light. Over time, what happens to the oxygen level in the jar during the day?",
    right: "It increases, because photosynthesis produces more oxygen than respiration uses",
    wrong: [
      "It decreases, because plants only use oxygen",
      "It stays at zero",
      "It turns into carbon dioxide at once",
    ],
    hint: "In bright light the plant photosynthesizes faster than it respires, so there is a net release of oxygen.",
    hard: true,
  },
  {
    prompt: "What is the main product of cellular respiration that cells use to power their activities?",
    right: "usable energy (ATP)",
    wrong: ["glucose", "chlorophyll", "oxygen"],
    hint: "Respiration transfers energy from glucose into ATP, a form of energy cells can use right away.",
  },
  {
    prompt: "Cells need energy for growth, movement and repair. Where does an animal get the glucose to supply it?",
    right: "From the food it eats, which came from plants or from animals that ate plants",
    wrong: [
      "From photosynthesis in its own mitochondria",
      "From breathing in glucose with the air",
      "From the oxygen it inhales",
    ],
    hint: "Animals cannot make their own food. They get glucose by eating, then release its energy by respiration.",
  },
];

function cellProcesses(opts?: GenerateOptions): Question[] {
  const d = level(opts);
  return make(PROCESS_BANK, d, [sortQuestion(PROCESS_SORT, perBin(d))], 8);
}

// ---------- Reproduction & Heredity ----------

interface Trait {
  letter: string;
  dominant: string;
  recessive: string;
  organism: string;
}

const TRAITS: Trait[] = [
  { letter: "T", dominant: "tall", recessive: "short", organism: "pea plants" },
  { letter: "P", dominant: "purple flowers", recessive: "white flowers", organism: "pea plants" },
  { letter: "R", dominant: "round seeds", recessive: "wrinkled seeds", organism: "pea plants" },
  { letter: "Y", dominant: "yellow seeds", recessive: "green seeds", organism: "pea plants" },
  { letter: "B", dominant: "black fur", recessive: "brown fur", organism: "guinea pigs" },
  { letter: "L", dominant: "short fur", recessive: "long fur", organism: "guinea pigs" },
];

function genotype(letter: string, dom: number): string {
  // dom = number of dominant alleles (0, 1, 2)
  return dom === 2 ? letter + letter : dom === 1 ? letter + letter.toLowerCase() : letter.toLowerCase() + letter.toLowerCase();
}

function alleles(g: string): string[] {
  return [g[0], g[1]];
}

function normalize(a: string, b: string): string {
  // dominant (uppercase) allele first
  return a === a.toUpperCase() ? a + b : b + a;
}

function punnett(trait: Trait, p1: string, p2: string) {
  const top = alleles(p1);
  const side = alleles(p2);
  const cells = side.map((s) => top.map((t) => normalize(t, s)));
  const flat = cells.flat();
  const visual: Visual = {
    type: "table",
    title: `${p1} × ${p2}`,
    headers: ["", ...top],
    rows: side.map((s, i) => [s, ...cells[i]]),
  };
  const recessive = flat.filter((g) => g === trait.letter.toLowerCase() + trait.letter.toLowerCase()).length;
  return { visual, flat, recessive };
}

const PERCENTS = [0, 25, 50, 75, 100];

function punnettQuestion(difficulty: Level): Question {
  const trait = pick(TRAITS);
  const pool = difficulty === 1 ? [[1, 1]] : difficulty === 2 ? [[1, 1], [1, 0], [2, 1], [2, 0], [0, 0]] : [[1, 1], [1, 0], [2, 1], [2, 0], [1, 2], [0, 1]];
  const [a, b] = pick(pool);
  const p1 = genotype(trait.letter, a);
  const p2 = genotype(trait.letter, b);
  const { visual, flat, recessive } = punnett(trait, p1, p2);
  const setup = `In ${trait.organism}, ${trait.dominant} (${trait.letter}) is dominant over ${trait.recessive} (${trait.letter.toLowerCase()}). The Punnett square shows a cross between ${p1} and ${p2} parents.`;
  const styles = difficulty === 1 ? [0, 1] : [0, 1, 2, 3];
  const style = pick(styles);
  if (style === 0) {
    const pct = (recessive / 4) * 100;
    const others = shuffle(PERCENTS.filter((p) => p !== pct)).slice(0, 3);
    return textChoice(
      `${setup} What percentage of offspring are expected to have ${trait.recessive}?`,
      `${pct}%`,
      others.map((p) => `${p}%`),
      `${trait.recessive} is recessive, so it shows only in offspring with two lowercase alleles (${trait.letter.toLowerCase()}${trait.letter.toLowerCase()}). Count those boxes out of 4 and multiply by 25.`,
      visual,
    );
  }
  if (style === 1) {
    const dominantShow = flat.filter((g) => g[0] === g[0].toUpperCase()).length;
    return numInput(
      `${setup} Out of the 4 boxes, how many offspring will show ${trait.dominant}?`,
      dominantShow,
      `Dominant ${trait.dominant} shows whenever at least one capital ${trait.letter} is present: genotypes ${trait.letter}${trait.letter} and ${trait.letter}${trait.letter.toLowerCase()}. Count those boxes.`,
      "number",
      undefined,
      visual,
    );
  }
  if (style === 2) {
    const het = flat.filter((g) => g === trait.letter + trait.letter.toLowerCase()).length;
    return numInput(
      `${setup} How many of the 4 boxes are heterozygous (${trait.letter}${trait.letter.toLowerCase()})?`,
      het,
      `Heterozygous means two different alleles: one capital and one lowercase. Count the ${trait.letter}${trait.letter.toLowerCase()} boxes.`,
      "number",
      undefined,
      visual,
    );
  }
  const pureDominant = flat.filter((g) => g === trait.letter + trait.letter).length;
  const pct = (pureDominant / 4) * 100;
  const others = shuffle(PERCENTS.filter((p) => p !== pct)).slice(0, 3);
  return textChoice(
    `${setup} What percentage of offspring are expected to be homozygous dominant (${trait.letter}${trait.letter})?`,
    `${pct}%`,
    others.map((p) => `${p}%`),
    `Homozygous dominant means two capital letters. Count the ${trait.letter}${trait.letter} boxes out of 4, then multiply by 25.`,
    visual,
  );
}

function phenotypeQuestion(): Question {
  const trait = pick(TRAITS);
  const dom = pick([0, 1, 2]);
  const g = genotype(trait.letter, dom);
  const shows = dom === 0 ? trait.recessive : trait.dominant;
  const other = dom === 0 ? trait.dominant : trait.recessive;
  return textChoice(
    `In ${trait.organism}, ${trait.dominant} (${trait.letter}) is dominant over ${trait.recessive} (${trait.letter.toLowerCase()}). What phenotype has the genotype ${g}?`,
    shows,
    [other],
    dom === 0
      ? "Two recessive alleles means the recessive trait shows, because there is no dominant allele to hide it."
      : "One or two dominant (capital) alleles means the dominant trait shows. The recessive allele is present but hidden.",
  );
}

const TRAIT_SORT: SortSet = {
  prompt: "Asexual or sexual reproduction? Sort each description.",
  hint: "Asexual reproduction needs one parent and makes offspring that are genetically identical to it. Sexual reproduction combines genetic material from two parents, so the offspring are different.",
  bins: [
    { id: "asexual", label: "asexual reproduction", emoji: "1️⃣" },
    { id: "sexual", label: "sexual reproduction", emoji: "2️⃣" },
  ],
  items: [
    { label: "a bacterium splitting into two", emoji: "🦠", bin: "asexual" },
    { label: "a new plant growing from a potato piece", emoji: "🥔", bin: "asexual" },
    { label: "a hydra budding a small copy of itself", emoji: "🌱", bin: "asexual" },
    { label: "a strawberry plant sending out runners", emoji: "🍓", bin: "asexual" },
    { label: "offspring genetically identical to the parent", emoji: "🟰", bin: "asexual" },
    { label: "a sperm cell joining an egg cell", emoji: "🧬", bin: "sexual" },
    { label: "pollen fertilizing a flower's ovule", emoji: "🌼", bin: "sexual" },
    { label: "offspring with a mix of both parents' traits", emoji: "🔀", bin: "sexual" },
    { label: "a fish laying fertilized eggs", emoji: "🐟", bin: "sexual" },
  ],
};

const HEREDITY_BANK: Item[] = [
  {
    prompt: "What is the relationship between DNA, genes and chromosomes?",
    right: "Chromosomes are long coils of DNA, and genes are sections of DNA that code for traits",
    wrong: [
      "Genes are made of chromosomes, which are made of cells",
      "DNA is a single gene found on one chromosome",
      "Chromosomes are the traits that genes produce",
    ],
    hint: "Think from small to large: a gene is a section of DNA, DNA is wound into chromosomes, and chromosomes are in the nucleus.",
  },
  {
    prompt: "How many chromosomes are in a typical human body cell?",
    right: "46 (23 pairs)",
    wrong: ["23 (11.5 pairs)", "92 (46 pairs)", "64 (32 pairs)"],
    hint: "Humans have 23 pairs: 46 chromosomes in total. One of each pair came from each parent.",
  },
  {
    prompt: "How many chromosomes are in a human egg or sperm cell?",
    right: "23",
    wrong: ["46", "12", "92"],
    hint: "Sex cells carry half the usual number, so that when they join the offspring has 46 again.",
  },
  {
    prompt: "What shape is a DNA molecule?",
    right: "a double helix (a twisted ladder)",
    wrong: ["a single straight chain", "a flat circle", "a hollow cube"],
    hint: "Two strands twist around each other. Rosalind Franklin's X-ray images helped Watson and Crick work out this shape in 1953.",
  },
  {
    prompt: "What is a gene?",
    right: "A section of DNA that carries instructions for a trait",
    wrong: [
      "A trait that is only found in animals",
      "A type of cell found in the nucleus",
      "A protein that copies DNA",
    ],
    hint: "Genes are the instructions. They are often described as the recipe for a trait or protein.",
  },
  {
    prompt: "A sunflower plant grows a new plant from a cutting. How does the new plant compare genetically to the parent?",
    right: "It is genetically identical",
    wrong: ["It is a mix of two parents", "It has half as many genes", "It has completely new genes"],
    hint: "Growing from a cutting is vegetative propagation, a form of asexual reproduction. There is only one parent, so the offspring is a clone.",
  },
  {
    prompt: "What is one advantage of sexual reproduction for a species?",
    right: "It produces variation, so some offspring may survive if conditions change",
    wrong: [
      "It always produces offspring that are better than the parents",
      "It needs only one parent",
      "It makes offspring identical to the parent",
    ],
    hint: "Variation helps a population. For example, a new disease may not harm every individual if they differ genetically.",
  },
  {
    prompt: "What is one advantage of asexual reproduction?",
    right: "An organism can reproduce quickly without needing a mate",
    wrong: [
      "It produces a lot of genetic variation",
      "It needs two parents",
      "Offspring always differ from the parent",
    ],
    hint: "With only one parent, there's no mate to find, so populations can grow fast, though the offspring are genetically identical.",
  },
  {
    prompt: "An allele is…",
    right: "one version of a gene",
    wrong: ["a type of chromosome", "a trait that is always dominant", "a cell that makes eggs"],
    hint: "The gene for seed shape has two alleles in the pea plant: one for round and one for wrinkled.",
  },
  {
    prompt: "What does it mean if an organism is homozygous for a trait?",
    right: "It has two identical alleles for the gene",
    wrong: [
      "It has two different alleles for the gene",
      "It has no alleles for the gene",
      "It shows both traits at the same time",
    ],
    hint: "'Homo-' means same. Homozygous means the two alleles match (such as TT or tt). Heterozygous means they differ (Tt).",
  },
  {
    prompt: "What is a phenotype?",
    right: "The observable trait that an organism shows",
    wrong: ["The pair of alleles an organism carries", "The number of chromosomes in a cell", "The parent that gave a gene"],
    hint: "Phenotype is what you can see (for example tall). Genotype is the allele pair (for example Tt).",
  },
  {
    prompt: "Two parents both show a dominant trait but have a child who shows the recessive trait. What must be true about the parents?",
    right: "They are both heterozygous",
    wrong: ["They are both homozygous dominant", "One is homozygous dominant", "They are both homozygous recessive"],
    hint: "The child must have received a recessive allele from each parent. Parents that show the dominant trait yet carry a recessive allele are Aa.",
    hard: true,
  },
  {
    prompt: "A scientist says: 'A Punnett square shows that 25% of the offspring will be short, so 1 out of every 4 children in a family of 4 will be short.' What is wrong with this?",
    right: "A Punnett square shows probability for each offspring. A small family may not match it exactly",
    wrong: [
      "Punnett squares only work for plants",
      "Percentages can't be used in genetics",
      "Short is never a recessive trait",
    ],
    hint: "Each offspring is a separate chance, like flipping a coin. Over many offspring the results get closer to the prediction.",
    hard: true,
  },
  {
    prompt: "Mitosis is a type of cell division that produces two daughter cells. How do they compare to the parent cell?",
    right: "They are genetically identical to it",
    wrong: [
      "They have half as many chromosomes",
      "They are all different from each other",
      "They have double the number of chromosomes",
    ],
    hint: "Mitosis is how body cells grow and repair, and how many organisms reproduce asexually. It copies the DNA first, then splits it evenly.",
    hard: true,
  },
  {
    prompt: "Why are identical twins genetically identical but fraternal twins are not?",
    right: "Identical twins come from one fertilized egg that splits; fraternal twins come from two separate eggs and sperm",
    wrong: [
      "Identical twins reproduce asexually",
      "Fraternal twins have a different number of chromosomes",
      "Identical twins are always the same age and fraternal twins are not",
    ],
    hint: "One fertilized egg gives one set of genes, and splitting it makes two people with the same genes. Two eggs means two different combinations.",
    hard: true,
  },
  {
    prompt: "Which of these is an inherited trait?",
    right: "natural eye colour",
    wrong: ["a scar on the knee", "the ability to play piano", "a suntan"],
    hint: "Inherited traits are passed in the genes. Scars, skills and tans are acquired during life.",
  },
];

function heredity(opts?: GenerateOptions): Question[] {
  const d = level(opts);
  const extras: Question[] = [punnettQuestion(d), punnettQuestion(d), sortQuestion(TRAIT_SORT, perBin(d))];
  if (d >= 2) extras.push(phenotypeQuestion());
  return make(HEREDITY_BANK, d, extras, 8);
}

// ---------- Particles & States of Matter ----------

function heatingGraph(difficulty: Level): Question {
  const pts = [
    { x: 0, y: -20 },
    { x: 10, y: 0 },
    { x: 50, y: 0 },
    { x: 90, y: 100 },
    { x: 150, y: 100 },
    { x: 160, y: 115 },
  ];
  const visual: Visual = {
    type: "plot",
    xMin: 0,
    xMax: 160,
    yMin: -20,
    yMax: 120,
    step: 20,
    curves: [{ points: pts, label: "water" }],
  };
  const setup = "A beaker of ice is heated at a steady rate. The graph shows temperature (°C, vertical) against time (s, horizontal).";
  const options: Question[] = [
    textChoice(
      `${setup} What is the melting point of ice?`,
      "0 °C",
      ["100 °C", "-20 °C", "20 °C"],
      "Melting happens at the first flat section, where the temperature stays the same while the solid turns into liquid.",
      visual,
    ),
    textChoice(
      `${setup} What is the boiling point of water?`,
      "100 °C",
      ["0 °C", "50 °C", "115 °C"],
      "Boiling happens at the second flat section, where liquid water turns to gas.",
      visual,
    ),
    textChoice(
      `${setup} During the flat section at 0 °C, what is the heat energy doing?`,
      "Pulling the particles out of their fixed positions, so the ice melts",
      [
        "Making the particles move faster, so the temperature rises",
        "Being destroyed by the water",
        "Making the particles smaller",
      ],
      "While a substance changes state, energy goes into overcoming the attractions between particles, not into raising the temperature.",
      visual,
    ),
    textChoice(
      `${setup} What state is the water at 70 s?`,
      "liquid",
      ["solid", "gas", "a mixture of solid and liquid"],
      "At 70 s the temperature is between 0 °C and 100 °C and rising, so the water is a liquid.",
      visual,
    ),
    numInput(
      `${setup} For how many seconds is the temperature at 0 °C (the flat section)?`,
      40,
      "Read where the flat section starts (10 s) and where it ends (50 s), then subtract.",
      "number",
      "s",
      visual,
    ),
  ];
  const pool = difficulty === 1 ? options.slice(0, 2).concat(options[3]) : options;
  return pick(pool);
}

function densityQuestion(difficulty: Level): InputQuestion {
  const volume = difficulty === 1 ? randInt(2, 10) : randInt(2, 12) * 2;
  const density10 = difficulty === 1 ? randInt(1, 9) * 10 : randInt(2, 28) * 5;
  const dens = tenths(density10);
  // mass = density * volume; volume even when density has a half so the mass is whole
  const mass = (density10 * volume) / 10;
  const kind = difficulty === 1 ? 0 : randInt(0, 2);
  if (kind === 0) {
    return numInput(
      `A sample has a mass of ${mass} g and a volume of ${volume} cm³. What is its density?`,
      dens,
      `Density = mass ÷ volume. Divide ${mass} g by ${volume} cm³.`,
      "decimal",
      "g/cm³",
    );
  }
  if (kind === 1) {
    return numInput(
      `A metal has a density of ${dens} g/cm³. What is the mass of ${volume} cm³ of it?`,
      mass,
      `Mass = density × volume. Multiply ${dens} by ${volume}.`,
      "number",
      "g",
    );
  }
  return numInput(
    `A liquid has a density of ${dens} g/cm³, and a sample has a mass of ${mass} g. What is the volume of the sample?`,
    volume,
    `Volume = mass ÷ density. Divide ${mass} by ${dens}.`,
    "number",
    "cm³",
  );
}

const STATE_SORT: SortSet = {
  prompt: "Solid, liquid or gas? Sort each description.",
  hint: "In a solid, particles vibrate in fixed positions. In a liquid, they slide past each other. In a gas, they are far apart and move freely.",
  bins: [
    { id: "solid", label: "solid", emoji: "🧊" },
    { id: "liquid", label: "liquid", emoji: "💧" },
    { id: "gas", label: "gas", emoji: "💨" },
  ],
  items: [
    { label: "keeps its own shape and volume", emoji: "🧱", bin: "solid" },
    { label: "particles only vibrate in place", emoji: "📌", bin: "solid" },
    { label: "takes the shape of its container but keeps its volume", emoji: "🥤", bin: "liquid" },
    { label: "particles slide past each other", emoji: "🌊", bin: "liquid" },
    { label: "fills its whole container and is easy to compress", emoji: "🎈", bin: "gas" },
    { label: "particles are far apart and move quickly", emoji: "🚀", bin: "gas" },
  ],
};

const KMT_BANK: Item[] = [
  {
    prompt: "What does the kinetic molecular theory say about particles of matter?",
    right: "They are always moving, and they have spaces between them",
    wrong: [
      "They only move when matter is heated",
      "They are packed together with no space in any state",
      "They stop moving at room temperature",
    ],
    hint: "'Kinetic' means motion. Particles never stop moving, and there are gaps between them, especially in gases.",
  },
  {
    prompt: "What happens to the movement of particles in a substance when its temperature increases?",
    right: "They move faster on average",
    wrong: ["They move more slowly", "They stop moving", "They get larger"],
    hint: "Temperature is a measure of the average kinetic energy of the particles. Higher temperature means faster particles.",
  },
  {
    prompt: "Why can a gas be compressed much more than a liquid?",
    right: "The particles in a gas are far apart, so they can be squeezed closer together",
    wrong: [
      "The particles in a gas are bigger",
      "The particles in a gas are not moving",
      "Liquids have no particles",
    ],
    hint: "Most of a gas is empty space. In a liquid, the particles are already touching.",
  },
  {
    prompt: "A drop of food colouring spreads through a glass of still water without stirring. What explains this?",
    right: "Moving water particles bump the colouring particles, spreading them out (diffusion)",
    wrong: [
      "The water particles are not moving, so the colour sinks",
      "The colouring particles dissolve into nothing",
      "Gravity pulls the colour evenly through the water",
    ],
    hint: "Particles in liquids move constantly and randomly. Over time they mix evenly. This is diffusion.",
  },
  {
    prompt: "What is the name for a solid turning directly into a gas?",
    right: "sublimation",
    wrong: ["condensation", "deposition", "evaporation"],
    hint: "Dry ice (solid carbon dioxide) does this at normal air pressure. Evaporation is liquid to gas.",
  },
  {
    prompt: "What is condensation?",
    right: "A gas turning into a liquid",
    wrong: ["A liquid turning into a gas", "A solid turning into a liquid", "A liquid turning into a solid"],
    hint: "Think of water droplets forming on a cold glass. Water vapour cools and becomes liquid.",
  },
  {
    prompt: "As a solid is heated until it melts, what happens to the arrangement of its particles?",
    right: "They gain enough energy to break out of their fixed positions and slide past one another",
    wrong: [
      "They stop moving",
      "They are destroyed and replaced",
      "They get further apart than the particles in a gas",
    ],
    hint: "Melting doesn't create or destroy particles. They just have enough energy to move around instead of vibrating in place.",
  },
  {
    prompt: "A cup of hot water and a cup of cold water are the same size. Which statement is correct?",
    right: "The particles in the hot water have a higher average kinetic energy",
    wrong: [
      "The particles in the cold water move faster on average",
      "The particles in the hot water are larger",
      "The particles in the cold water have stopped moving",
    ],
    hint: "Temperature measures the average kinetic energy of the particles. Hotter means faster, but even cold water particles keep moving.",
    hard: true,
  },
  {
    prompt: "Why does a sealed bag of chips puff up when it is taken to a high mountain?",
    right: "The air outside has lower pressure, so the gas particles inside push the bag outward",
    wrong: [
      "The chips make more gas in the cold",
      "The particles inside get bigger",
      "The particles of gas are attracted to the mountain",
    ],
    hint: "Gas pressure comes from particles hitting the container. With less air pressing from outside, the bag expands.",
    hard: true,
  },
  {
    prompt: "Why does a balloon shrink when it's put in a freezer?",
    right: "The gas particles slow down and hit the walls less often and less hard",
    wrong: [
      "Some of the gas particles disappear",
      "The particles get smaller",
      "The balloon rubber makes the particles heavier",
    ],
    hint: "At lower temperatures, particles move more slowly, so the pressure inside drops and the volume decreases.",
    hard: true,
  },
  {
    prompt: "Why does ice float in liquid water?",
    right: "Ice is less dense than liquid water because its particles are arranged with more space between them",
    wrong: [
      "Ice has no particles",
      "Ice is made of a different substance from water",
      "The particles in ice are heavier than water particles",
    ],
    hint: "Unusually, water expands when it freezes. The same mass takes up more volume, so ice has a lower density.",
    hard: true,
  },
  {
    prompt: "How does a temperature change of 1 °C compare with a change of 1 K (kelvin)?",
    right: "They are the same size",
    wrong: ["1 °C is 10 times larger", "1 K is about 33 times larger", "They can't be compared"],
    hint: "The kelvin and Celsius degrees are the same size. The Kelvin scale just starts at absolute zero, where particle motion is at a minimum.",
    hard: true,
  },
  {
    prompt: "Which is an example of evaporation rather than boiling?",
    right: "A puddle slowly disappearing on a warm day",
    wrong: [
      "A kettle of water at 100 °C bubbling",
      "Steam rising from a pot on the stove",
      "Bubbles forming throughout heated water",
    ],
    hint: "Evaporation happens only at the surface and at any temperature. Boiling happens throughout the liquid at the boiling point.",
  },
  {
    prompt: "What happens to the volume of a gas in a flexible container if its temperature rises and the pressure stays the same?",
    right: "It increases",
    wrong: ["It decreases", "It stays the same", "It becomes zero"],
    hint: "Faster particles push harder, so the container expands until the pressure inside matches outside again.",
  },
];

function particlesAndStates(opts?: GenerateOptions): Question[] {
  const d = level(opts);
  return make(KMT_BANK, d, [heatingGraph(d), densityQuestion(d), sortQuestion(STATE_SORT, 2)], 8);
}

// ---------- Atoms & Elements ----------

interface Element {
  name: string;
  symbol: string;
  z: number;
  a: number;
}

const ELEMENTS: Element[] = [
  { name: "hydrogen", symbol: "H", z: 1, a: 1 },
  { name: "helium", symbol: "He", z: 2, a: 4 },
  { name: "lithium", symbol: "Li", z: 3, a: 7 },
  { name: "beryllium", symbol: "Be", z: 4, a: 9 },
  { name: "boron", symbol: "B", z: 5, a: 11 },
  { name: "carbon", symbol: "C", z: 6, a: 12 },
  { name: "nitrogen", symbol: "N", z: 7, a: 14 },
  { name: "oxygen", symbol: "O", z: 8, a: 16 },
  { name: "fluorine", symbol: "F", z: 9, a: 19 },
  { name: "neon", symbol: "Ne", z: 10, a: 20 },
  { name: "sodium", symbol: "Na", z: 11, a: 23 },
  { name: "magnesium", symbol: "Mg", z: 12, a: 24 },
  { name: "aluminum", symbol: "Al", z: 13, a: 27 },
  { name: "silicon", symbol: "Si", z: 14, a: 28 },
  { name: "phosphorus", symbol: "P", z: 15, a: 31 },
  { name: "sulfur", symbol: "S", z: 16, a: 32 },
  { name: "chlorine", symbol: "Cl", z: 17, a: 35 },
  { name: "argon", symbol: "Ar", z: 18, a: 40 },
  { name: "potassium", symbol: "K", z: 19, a: 39 },
  { name: "calcium", symbol: "Ca", z: 20, a: 40 },
];

function outerElectrons(z: number): number {
  let left = z;
  let last = 0;
  for (const cap of [2, 8, 8, 2]) {
    last = Math.min(cap, left);
    left -= last;
    if (left <= 0) break;
  }
  return last;
}

function particleQuestion(difficulty: Level): Question {
  const e = pick(difficulty === 1 ? ELEMENTS.slice(0, 10) : ELEMENTS);
  const visual: Visual = {
    type: "table",
    title: `${cap(e.name)} (${e.symbol}), a neutral atom`,
    headers: ["Atomic number", "Mass number"],
    rows: [[e.z, e.a]],
  };
  const kinds = difficulty === 1 ? [0, 1] : difficulty === 2 ? [0, 1, 2] : [1, 2, 3];
  const kind = pick(kinds);
  if (kind === 0) {
    return numInput(
      `How many protons does an atom of ${e.name} have?`,
      e.z,
      "The atomic number is the number of protons. It is what makes an element that element.",
      "number",
      undefined,
      visual,
    );
  }
  if (kind === 1) {
    return numInput(
      `How many electrons does a neutral atom of ${e.name} have?`,
      e.z,
      "In a neutral atom the positive charge of the protons is balanced by the same number of negative electrons.",
      "number",
      undefined,
      visual,
    );
  }
  if (kind === 2) {
    return numInput(
      `How many neutrons are in the most common form of ${e.name}?`,
      e.a - e.z,
      `Mass number = protons + neutrons. So neutrons = ${e.a} − ${e.z}.`,
      "number",
      undefined,
      visual,
    );
  }
  return numInput(
    `Using the Bohr model (shells hold 2, 8, 8 electrons), how many electrons are in the outer shell of ${e.name}?`,
    outerElectrons(e.z),
    `Fill the shells in order: the first holds 2, the second 8, the third 8. Whatever is left over is in the outer shell (${e.z} electrons in total).`,
    "number",
    undefined,
    visual,
  );
}

const ATOMIC_MODELS = [
  { id: "dalton", label: "Dalton: atoms are tiny solid spheres (early 1800s)" },
  { id: "thomson", label: "Thomson: electrons are scattered in a positive 'pudding' (1897–1904)" },
  { id: "rutherford", label: "Rutherford: a tiny, dense nucleus with electrons around it (1911)" },
  { id: "bohr", label: "Bohr: electrons orbit the nucleus in energy levels (1913)" },
];

function modelOrder(difficulty: Level): OrderQuestion {
  const items = difficulty === 1 ? [ATOMIC_MODELS[0], ATOMIC_MODELS[2], ATOMIC_MODELS[3]] : ATOMIC_MODELS;
  return {
    kind: "order",
    prompt: "Put these atomic models in the order they were proposed, earliest first.",
    hint: "Dalton's solid sphere came first. Thomson found the electron, Rutherford found the nucleus, and Bohr added energy levels.",
    items,
  };
}

const ATOMS_BANK: Item[] = [
  {
    prompt: "Which particle in an atom has a negative charge?",
    right: "electron",
    wrong: ["proton", "neutron", "nucleus"],
    hint: "Electrons are negative, protons are positive and neutrons have no charge.",
  },
  {
    prompt: "Which two particles are found in the nucleus of an atom?",
    right: "protons and neutrons",
    wrong: ["protons and electrons", "neutrons and electrons", "electrons only"],
    hint: "Electrons move around outside the nucleus. The nucleus is made of protons and neutrons.",
  },
  {
    prompt: "What does the atomic number of an element tell you?",
    right: "The number of protons in each atom",
    wrong: [
      "The number of neutrons in each atom",
      "The mass of one atom in grams",
      "The number of atoms in a sample",
    ],
    hint: "Each element has its own atomic number. All carbon atoms have 6 protons, and an atom with 7 protons is nitrogen.",
  },
  {
    prompt: "Rutherford's gold foil experiment showed that most particles passed straight through, but a few bounced back. What did he conclude?",
    right: "An atom is mostly empty space with a tiny, dense, positive nucleus",
    wrong: [
      "An atom is a solid sphere with no empty space",
      "Electrons are spread evenly through a positive sphere",
      "Atoms cannot be split into smaller parts",
    ],
    hint: "Most particles went through, so atoms are mostly empty. Only the occasional strike on a small dense centre bounced one back.",
  },
  {
    prompt: "Who discovered the electron in 1897?",
    right: "J.J. Thomson",
    wrong: ["John Dalton", "Ernest Rutherford", "Niels Bohr"],
    hint: "Thomson's experiments showed that atoms contain tiny negative particles. He pictured them scattered in a positive material.",
  },
  {
    prompt: "In the periodic table, what do the elements in the same column (group) have in common?",
    right: "Similar chemical properties",
    wrong: ["The same number of protons", "The same mass", "The same number of neutrons"],
    hint: "Elements in a group have the same number of outer electrons, so they react in similar ways.",
  },
  {
    prompt: "Which scientist published the first widely used periodic table in 1869?",
    right: "Dmitri Mendeleev",
    wrong: ["Marie Curie", "Isaac Newton", "Antoine Lavoisier"],
    hint: "Mendeleev arranged known elements by atomic mass and left gaps for elements that had not been found yet.",
  },
  {
    prompt: "Elements in Group 18 (helium, neon, argon) rarely react with other elements. Why?",
    right: "Their outer electron shell is full, so they're very stable",
    wrong: [
      "They have no electrons",
      "They have no protons",
      "They are all liquids at room temperature",
    ],
    hint: "A full outer shell makes an atom stable. These elements are called the noble gases.",
  },
  {
    prompt: "Which of these is a typical property of a metal?",
    right: "It conducts electricity well",
    wrong: ["It is brittle and shatters easily when hit", "It is a poor conductor of heat", "It is usually dull and crumbly"],
    hint: "Metals are shiny, malleable, ductile and conduct heat and electricity. Many non-metals are brittle.",
  },
  {
    prompt: "What is an element?",
    right: "A pure substance made of only one kind of atom",
    wrong: [
      "A mixture of two or more kinds of atoms",
      "Any substance that is a solid",
      "A substance made of molecules only",
    ],
    hint: "Elements, like oxygen or iron, are listed on the periodic table and can't be broken down into simpler substances by chemical means.",
  },
  {
    prompt: "What is the chemical symbol for sodium?",
    right: "Na",
    wrong: ["S", "So", "Sd"],
    hint: "The symbol 'Na' comes from natrium, the Latin name. S is sulfur.",
    hard: true,
  },
  {
    prompt: "An atom has 17 protons and 17 electrons. A second atom has 17 protons and 18 electrons. How do they differ?",
    right: "The second is a negative ion because it has one extra electron",
    wrong: [
      "The second is a different element",
      "The second is a positive ion",
      "The first has a negative charge",
    ],
    hint: "The proton number tells you the element, and both are chlorine. Gaining an electron makes an atom negatively charged.",
    hard: true,
  },
  {
    prompt: "Isotopes of an element have the same number of…",
    right: "protons but different numbers of neutrons",
    wrong: ["neutrons but different numbers of protons", "electrons but no protons", "protons and neutrons, but different masses"],
    hint: "Carbon-12 and carbon-14 both have 6 protons, but carbon-14 has two more neutrons.",
    hard: true,
  },
  {
    prompt: "An atom of lithium has 3 protons. If it loses one electron, what is its charge?",
    right: "+1",
    wrong: ["−1", "0", "+3"],
    hint: "There would be 3 positive protons but only 2 negative electrons, so the overall charge is +1.",
    hard: true,
  },
  {
    prompt: "Which statement about Dalton's atomic theory (early 1800s) is still accepted today?",
    right: "Atoms of different elements combine in fixed ratios to form compounds",
    wrong: [
      "Atoms are indivisible",
      "All atoms of an element are exactly identical in mass",
      "Atoms are never rearranged in chemical reactions",
    ],
    hint: "We now know atoms contain smaller particles and that isotopes exist, but fixed ratios in compounds still hold.",
    hard: true,
  },
];

function atomsAndElements(opts?: GenerateOptions): Question[] {
  const d = level(opts);
  return make(ATOMS_BANK, d, [particleQuestion(d), particleQuestion(d), modelOrder(d)], 8);
}

// ---------- Classifying Matter ----------

const PURE_SORT: SortSet = {
  prompt: "Pure substance or mixture? Sort each item.",
  hint: "A pure substance has a fixed makeup (one element or one compound). A mixture is two or more substances that are only physically combined and can vary.",
  bins: [
    { id: "pure", label: "pure substance", emoji: "💎" },
    { id: "mixture", label: "mixture", emoji: "🥗" },
  ],
  items: [
    { label: "gold", emoji: "🥇", bin: "pure" },
    { label: "distilled water", emoji: "💧", bin: "pure" },
    { label: "oxygen gas", emoji: "💨", bin: "pure" },
    { label: "table salt", emoji: "🧂", bin: "pure" },
    { label: "air", emoji: "🌬️", bin: "mixture" },
    { label: "salad", emoji: "🥗", bin: "mixture" },
    { label: "muddy water", emoji: "🟤", bin: "mixture" },
    { label: "granite", emoji: "🪨", bin: "mixture" },
    { label: "sea water", emoji: "🌊", bin: "mixture" },
  ],
};

const COMPOUND_SORT: SortSet = {
  prompt: "Element or compound? Sort each pure substance.",
  hint: "An element has only one kind of atom. A compound has two or more elements chemically bonded in a fixed ratio.",
  bins: [
    { id: "element", label: "element", emoji: "⚛️" },
    { id: "compound", label: "compound", emoji: "🧪" },
  ],
  items: [
    { label: "iron", emoji: "🔩", bin: "element" },
    { label: "oxygen", emoji: "💨", bin: "element" },
    { label: "gold", emoji: "🥇", bin: "element" },
    { label: "copper", emoji: "🪙", bin: "element" },
    { label: "helium", emoji: "🎈", bin: "element" },
    { label: "water (H₂O)", emoji: "💧", bin: "compound" },
    { label: "table salt (NaCl)", emoji: "🧂", bin: "compound" },
    { label: "carbon dioxide (CO₂)", emoji: "☁️", bin: "compound" },
    { label: "baking soda", emoji: "🧁", bin: "compound" },
    { label: "rust (iron oxide)", emoji: "🟠", bin: "compound" },
  ],
};

function atomsInFormula(): Question {
  const formulas = [
    { name: "water", f: "H₂O", atoms: 3, parts: "2 hydrogen + 1 oxygen" },
    { name: "carbon dioxide", f: "CO₂", atoms: 3, parts: "1 carbon + 2 oxygen" },
    { name: "methane", f: "CH₄", atoms: 5, parts: "1 carbon + 4 hydrogen" },
    { name: "glucose", f: "C₆H₁₂O₆", atoms: 24, parts: "6 carbon + 12 hydrogen + 6 oxygen" },
    { name: "ammonia", f: "NH₃", atoms: 4, parts: "1 nitrogen + 3 hydrogen" },
    { name: "sulfuric acid", f: "H₂SO₄", atoms: 7, parts: "2 hydrogen + 1 sulfur + 4 oxygen" },
  ];
  const f = pick(formulas);
  return numInput(
    `How many atoms are in one molecule of ${f.name}, ${f.f}?`,
    f.atoms,
    `Add up the numbers in the subscripts. A letter with no number counts as 1. For ${f.f}: ${f.parts}.`,
    "number",
  );
}

function separationQuestion(): Question {
  const cases = [
    {
      mix: "sand mixed with water",
      method: "filtration",
      wrong: ["magnetism", "chromatography", "evaporation of the sand"],
      hint: "Sand particles are too large to pass through filter paper, but water passes through.",
    },
    {
      mix: "salt dissolved in water, when you want to recover the salt",
      method: "evaporation",
      wrong: ["filtration", "using a magnet", "chromatography"],
      hint: "Salt is dissolved, so it passes through filter paper. Evaporating the water leaves the salt behind.",
    },
    {
      mix: "iron filings mixed with sand",
      method: "using a magnet",
      wrong: ["evaporation", "chromatography", "distillation"],
      hint: "A magnet attracts iron but not sand, so it separates the two.",
    },
    {
      mix: "the different coloured pigments in black ink",
      method: "paper chromatography",
      wrong: ["filtration", "using a magnet", "evaporation"],
      hint: "Chromatography separates substances by how far they travel up the paper in a solvent.",
    },
    {
      mix: "clean water from sea water, when you want to collect the water",
      method: "distillation",
      wrong: ["filtration", "using a magnet", "chromatography"],
      hint: "Distillation boils the water off and condenses the vapour back into liquid water, leaving the salt behind.",
    },
  ];
  const c = pick(cases);
  return textChoice(`Which method would best separate ${c.mix}?`, c.method, c.wrong, c.hint);
}

const MATTER_BANK: Item[] = [
  {
    prompt: "What is a solution?",
    right: "A mixture in which one substance is evenly dissolved in another",
    wrong: ["A mixture of two solids that can be picked apart", "Any liquid", "A pure substance"],
    hint: "In a solution, the particles of the solute spread evenly through the solvent, and it looks like one substance.",
  },
  {
    prompt: "In a salt-water solution, what is the solvent?",
    right: "water",
    wrong: ["salt", "both water and salt", "neither; a solution has no solvent"],
    hint: "The solvent is the substance that does the dissolving, usually the larger amount. The salt is the solute.",
  },
  {
    prompt: "What is the difference between a heterogeneous and a homogeneous mixture?",
    right: "In a heterogeneous mixture you can see the different parts; in a homogeneous mixture it looks the same throughout",
    wrong: [
      "A heterogeneous mixture is always a solid",
      "A homogeneous mixture is a pure substance",
      "A heterogeneous mixture has only one substance in it",
    ],
    hint: "Trail mix is heterogeneous. Salt water is homogeneous, which is another word for a solution.",
  },
  {
    prompt: "Which of these is a homogeneous mixture?",
    right: "juice with no pulp",
    wrong: ["a pizza", "granola with raisins", "soil with stones"],
    hint: "A homogeneous mixture looks the same all the way through. You can see the separate parts of a pizza.",
  },
  {
    prompt: "Why is water (H₂O) a compound and not a mixture?",
    right: "Hydrogen and oxygen atoms are chemically bonded in a fixed ratio, and it has different properties from either gas",
    wrong: [
      "It is a liquid",
      "Hydrogen and oxygen are only loosely mixed together",
      "It can be separated with a filter",
    ],
    hint: "In a compound the elements are chemically combined in a fixed ratio. Water is very different from the gases it's made of.",
  },
  {
    prompt: "Which statement describes a compound?",
    right: "It always has the same elements in the same ratio",
    wrong: [
      "It can have any ratio of the elements",
      "It can be separated by a magnet or by filtering",
      "It is made of only one kind of atom",
    ],
    hint: "Water is always 2 hydrogen atoms to 1 oxygen atom. A mixture, in contrast, can have varying amounts.",
  },
  {
    prompt: "Which property is NOT a physical property?",
    right: "Flammability (ability to burn)",
    wrong: ["Melting point", "Density", "Colour"],
    hint: "A physical property can be observed without changing the substance into something new. Burning produces new substances, so flammability is chemical.",
  },
  {
    prompt: "Which is a chemical property of iron?",
    right: "It rusts when it reacts with oxygen and water",
    wrong: ["It is shiny", "It is attracted to magnets", "It melts at a high temperature"],
    hint: "A chemical property describes how a substance reacts to form new substances.",
  },
  {
    prompt: "Air is a mixture of gases, mostly nitrogen and oxygen. Which fact shows it's a mixture and not a compound?",
    right: "The amount of each gas can vary from place to place, and the gases keep their own properties",
    wrong: [
      "It is invisible",
      "It is always found as a gas",
      "Its gases are always bonded in a fixed ratio",
    ],
    hint: "In a mixture the substances keep their own properties and can be in different proportions.",
    hard: true,
  },
  {
    prompt: "Brass is made by melting copper and zinc together. It is still a mixture of the two metals. What is this kind of mixture called?",
    right: "an alloy",
    wrong: ["a compound", "an element", "a suspension"],
    hint: "An alloy is a mixture of a metal with one or more other elements, often to make it stronger or less likely to corrode.",
    hard: true,
  },
  {
    prompt: "Why can't you separate the elements in water by filtering it?",
    right: "They're chemically bonded as a compound, so filtering can only separate physically mixed things",
    wrong: [
      "Water has no particles",
      "Filters only work on solids",
      "Water is an element",
    ],
    hint: "Filtering separates by particle size. Breaking a compound into elements needs a chemical change, such as electrolysis.",
    hard: true,
  },
  {
    prompt: "A student heats a green powder and it turns into a black powder and a gas. This suggests the green powder was…",
    right: "a compound that broke down into simpler substances",
    wrong: [
      "an element that melted",
      "a mixture that was filtered",
      "a pure element that was dissolved",
    ],
    hint: "New substances with different properties formed, which signals a chemical change. Compounds can break down into elements or simpler compounds.",
    hard: true,
  },
  {
    prompt: "Which symbols form the chemical formula for carbon dioxide?",
    right: "CO₂",
    wrong: ["Co", "C₂O", "CO"],
    hint: "Carbon dioxide has one carbon atom and two oxygen atoms. CO (one oxygen) is carbon monoxide.",
  },
  {
    prompt: "Which of these is a suspension rather than a solution?",
    right: "muddy water that settles if left to stand",
    wrong: ["salt water", "sugar dissolved in tea", "air"],
    hint: "In a suspension the particles are large enough to settle or be filtered. In a solution they are dissolved and don't settle.",
  },
];

function classifyingMatter(opts?: GenerateOptions): Question[] {
  const d = level(opts);
  const extras: Question[] = [sortQuestion(PURE_SORT, perBin(d)), sortQuestion(COMPOUND_SORT, perBin(d)), separationQuestion()];
  if (d >= 2) extras.push(atomsInFormula());
  return make(MATTER_BANK, d, extras, 8);
}

// ---------- Physical & Chemical Change ----------

const CHANGE_SORT: SortSet = {
  prompt: "Physical change or chemical change? Sort each example.",
  hint: "In a physical change the substance is the same before and after (only its form or state changes). In a chemical change new substances form.",
  bins: [
    { id: "physical", label: "physical change", emoji: "🧊" },
    { id: "chemical", label: "chemical change", emoji: "🔥" },
  ],
  items: [
    { label: "ice melting", emoji: "🧊", bin: "physical" },
    { label: "sugar dissolving in tea", emoji: "🍵", bin: "physical" },
    { label: "crushing a can", emoji: "🥫", bin: "physical" },
    { label: "water boiling", emoji: "♨️", bin: "physical" },
    { label: "tearing paper", emoji: "📄", bin: "physical" },
    { label: "wood burning", emoji: "🔥", bin: "chemical" },
    { label: "iron rusting", emoji: "🟠", bin: "chemical" },
    { label: "baking a cake", emoji: "🎂", bin: "chemical" },
    { label: "milk going sour", emoji: "🥛", bin: "chemical" },
    { label: "silver tarnishing", emoji: "🥄", bin: "chemical" },
  ],
};

function conservationQuestion(difficulty: Level): Question {
  const k = randInt(1, difficulty === 1 ? 3 : 6);
  const mg = 3 * k;
  const o = 2 * k;
  const product = mg + o;
  if (difficulty === 3 && chance(0.5)) {
    return numInput(
      `In a sealed container, ${mg} g of magnesium reacts completely with oxygen to make ${product} g of magnesium oxide. How many grams of oxygen reacted?`,
      o,
      `Mass is conserved in a chemical reaction: mass of reactants = mass of products. Subtract ${mg} from ${product}.`,
      "number",
      "g",
    );
  }
  return numInput(
    `In a sealed container, ${mg} g of magnesium reacts completely with ${o} g of oxygen. What is the mass of magnesium oxide produced?`,
    product,
    "The law of conservation of mass says that the mass of the products equals the mass of the reactants. Add the two masses.",
    "number",
    "g",
  );
}

const CHANGE_BANK: Item[] = [
  {
    prompt: "Which is a sign that a chemical change has occurred?",
    right: "Bubbles of gas form and a new smell appears",
    wrong: ["A solid is cut into smaller pieces", "A liquid is poured into a different container", "A substance changes its size"],
    hint: "Signs of chemical change include gas production, colour change, heat or light being given off, a precipitate forming and a new odour.",
  },
  {
    prompt: "A chunk of ice melts into liquid water. Why is this a physical change?",
    right: "It's still water (H₂O) before and after; only its state has changed",
    wrong: [
      "The water gets colder",
      "The ice made a new substance",
      "Heat energy was added",
    ],
    hint: "The particles are the same. Only their arrangement and motion changed. No new substance formed.",
  },
  {
    prompt: "Baking soda and vinegar are mixed in an open cup and fizz. What do the bubbles tell you?",
    right: "A gas formed, which is evidence of a chemical change",
    wrong: ["The vinegar is boiling", "The baking soda is melting", "Only a physical change happened"],
    hint: "The reaction makes carbon dioxide gas, a new substance with different properties from either starting material.",
  },
  {
    prompt: "A student mixes baking soda and vinegar in an open cup on a balance, and the mass reading drops. Why is the law of conservation of mass not broken?",
    right: "Carbon dioxide gas escaped into the air, so its mass is no longer being measured",
    wrong: [
      "Mass is destroyed in chemical reactions",
      "The vinegar evaporated instantly",
      "Gases have no mass",
    ],
    hint: "Atoms are rearranged, not destroyed. In a sealed container the total mass would stay the same.",
    hard: true,
  },
  {
    prompt: "A piece of paper burns, leaving a small pile of ash. Which statement is true?",
    right: "New substances formed, so it's a chemical change that can't easily be reversed",
    wrong: [
      "It's a physical change because the paper got smaller",
      "No new substance was made",
      "The ash is the same substance as the paper",
    ],
    hint: "Burning combines the paper with oxygen to make new substances such as carbon dioxide, water vapour and ash.",
  },
  {
    prompt: "Which is an example of a reactant in the reaction: iron + oxygen → iron oxide (rust)?",
    right: "iron",
    wrong: ["iron oxide", "rust", "none of them; only products are shown"],
    hint: "Reactants are on the left of the arrow (the starting materials). Products are on the right.",
  },
  {
    prompt: "What does an exothermic reaction do?",
    right: "Releases energy to the surroundings, often as heat",
    wrong: ["Absorbs energy from the surroundings", "Always make the surroundings colder", "Creates new atoms"],
    hint: "'Exo-' means out. A campfire is exothermic. An endothermic reaction absorbs energy, like an instant cold pack.",
    hard: true,
  },
  {
    prompt: "A student wants to test if dissolving sugar is a chemical change. After the sugar dissolves, she evaporates the water and sugar crystals remain. What does this show?",
    right: "The sugar was still sugar, so dissolving is a physical change",
    wrong: [
      "A new substance formed",
      "The sugar was destroyed",
      "It was a chemical change because the sugar disappeared",
    ],
    hint: "If you can get the original substance back with a physical method, no new substance was formed.",
    hard: true,
  },
  {
    prompt: "Which is a chemical property of wood?",
    right: "It burns in oxygen",
    wrong: ["It floats on water", "It is brown", "It can be cut with a saw"],
    hint: "A chemical property describes how a substance changes into new substances. Colour, buoyancy and hardness are physical properties.",
  },
  {
    prompt: "A shiny piece of copper turns green and crusty when left outside for years. This is evidence of…",
    right: "a chemical change that formed a new compound on the surface",
    wrong: [
      "a physical change, because the colour is different",
      "the copper melting slowly",
      "the copper being turned into an element",
    ],
    hint: "Copper reacts with oxygen, water and carbon dioxide in the air to form a green compound.",
  },
  {
    prompt: "Which is a physical change?",
    right: "Water vapour condensing on a cold window",
    wrong: ["Toast burning", "An apple turning brown after it's cut", "A candle's wax burning"],
    hint: "Condensing changes state from gas to liquid. The substance stays water.",
  },
  {
    prompt: "What happens to the atoms in a chemical reaction?",
    right: "They are rearranged to form new substances, and the number of each kind stays the same",
    wrong: [
      "They're destroyed and new ones are created",
      "They turn into energy",
      "They are all changed into the same element",
    ],
    hint: "Chemical reactions regroup atoms. This is why mass is conserved.",
  },
  {
    prompt: "When hydrogen burns in oxygen, the product is water. Why is water so different from hydrogen and oxygen?",
    right: "The atoms are bonded into a new compound, so it has its own properties",
    wrong: [
      "The atoms are destroyed",
      "Water is only hydrogen and oxygen mixed together",
      "Water is made of different elements from the starting gases",
    ],
    hint: "Compounds have properties different from those of the elements that form them. The same elements, hydrogen and oxygen, are in both, but bonded differently.",
    hard: true,
  },
  {
    prompt: "A reaction has the word equation: methane + oxygen → carbon dioxide + water. How many products are there?",
    right: "2",
    wrong: ["1", "3", "4"],
    hint: "Count the substances after the arrow: carbon dioxide and water.",
  },
];

function physicalChemicalChange(opts?: GenerateOptions): Question[] {
  const d = level(opts);
  return make(CHANGE_BANK, d, [sortQuestion(CHANGE_SORT, perBin(d)), conservationQuestion(d)], 8);
}

// ---------- Light & Optics ----------

function reflectionQuestion(difficulty: Level): Question {
  const i = difficulty === 1 ? randInt(2, 8) * 5 : randInt(4, 17) * 5;
  const kind = difficulty === 1 ? 0 : randInt(0, 2);
  if (kind === 0) {
    return numInput(
      `A ray of light hits a flat mirror with an angle of incidence of ${i}°. What is the angle of reflection?`,
      i,
      "The law of reflection: the angle of reflection equals the angle of incidence. Both are measured from the normal, the line at right angles to the mirror.",
      "number",
      "°",
    );
  }
  if (kind === 1) {
    const surface = 90 - i;
    return numInput(
      `A ray hits a flat mirror at ${surface}° to the mirror's surface. What is the angle of reflection, measured from the normal?`,
      i,
      `The normal is at 90° to the mirror, so the angle of incidence is 90° − ${surface}°. The angle of reflection is the same.`,
      "number",
      "°",
    );
  }
  return numInput(
    `A ray of light hits a flat mirror with an angle of incidence of ${i}°. What is the angle between the incoming ray and the reflected ray?`,
    2 * i,
    `The incoming ray is ${i}° on one side of the normal and the reflected ray is ${i}° on the other, so add them: ${i} + ${i}.`,
    "number",
    "°",
  );
}

function lightSpeedQuestion(difficulty: Level): Question {
  const secs = difficulty === 1 ? randInt(2, 5) : randInt(3, 12);
  const dist = secs * 300000;
  const spaced = String(dist).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return numInput(
    `Light travels about 300 000 km every second. How many seconds would light take to travel ${spaced} km?`,
    secs,
    `Time = distance ÷ speed. Divide ${spaced} by 300 000.`,
    "number",
    "s",
  );
}

const EM_SPECTRUM = [
  { id: "radio", label: "radio waves" },
  { id: "micro", label: "microwaves" },
  { id: "ir", label: "infrared" },
  { id: "visible", label: "visible light" },
  { id: "uv", label: "ultraviolet" },
  { id: "xray", label: "X-rays" },
  { id: "gamma", label: "gamma rays" },
];

function spectrumOrder(difficulty: Level): OrderQuestion {
  const items = difficulty === 1 ? [EM_SPECTRUM[0], EM_SPECTRUM[3], EM_SPECTRUM[5], EM_SPECTRUM[6]] : difficulty === 2 ? [EM_SPECTRUM[0], EM_SPECTRUM[2], EM_SPECTRUM[3], EM_SPECTRUM[4], EM_SPECTRUM[6]] : EM_SPECTRUM.slice(0, 6);
  return {
    kind: "order",
    prompt: "Put these parts of the electromagnetic spectrum in order from the longest wavelength to the shortest.",
    hint: "Radio waves have the longest wavelength and gamma rays the shortest. The waves with the shortest wavelengths carry the most energy.",
    items,
  };
}

const OPACITY_SORT: SortSet = {
  prompt: "Transparent, translucent or opaque? Sort each material.",
  hint: "Transparent materials let light pass so you can see clearly through them. Translucent ones let some light through but scatter it. Opaque ones block light.",
  bins: [
    { id: "transparent", label: "transparent", emoji: "🔍" },
    { id: "translucent", label: "translucent", emoji: "🌫️" },
    { id: "opaque", label: "opaque", emoji: "🧱" },
  ],
  items: [
    { label: "clear window glass", emoji: "🪟", bin: "transparent" },
    { label: "clear plastic wrap", emoji: "📦", bin: "transparent" },
    { label: "frosted bathroom glass", emoji: "🚿", bin: "translucent" },
    { label: "wax paper", emoji: "📜", bin: "translucent" },
    { label: "a brick wall", emoji: "🧱", bin: "opaque" },
    { label: "a metal sheet", emoji: "🔩", bin: "opaque" },
  ],
};

const LIGHT_BANK: Item[] = [
  {
    prompt: "What happens when a ray of light passes from air into water at an angle?",
    right: "It slows down and bends toward the normal",
    wrong: [
      "It speeds up and bends away from the normal",
      "It keeps going in the same direction at the same speed",
      "It speeds up and bends toward the normal",
    ],
    hint: "Light travels more slowly in water than in air. That change in speed makes the ray refract (bend) toward the normal.",
  },
  {
    prompt: "Why does a straw in a glass of water look bent at the surface?",
    right: "Light bends (refracts) as it passes from water into air",
    wrong: [
      "The straw really bends in water",
      "Water reflects the straw",
      "The glass magnifies the straw",
    ],
    hint: "Refraction changes the direction of the light rays from the submerged part, so your brain places it somewhere else.",
  },
  {
    prompt: "What type of lens is thicker in the middle and makes parallel light rays converge?",
    right: "convex lens",
    wrong: ["concave lens", "plane lens", "diffuse lens"],
    hint: "A convex lens bulges outward and focuses light to a point. It's used in magnifying glasses and cameras.",
  },
  {
    prompt: "A concave lens is thinner in the middle than at the edges. What does it do to parallel light rays?",
    right: "It spreads them apart (diverges them)",
    wrong: ["It focuses them to a point", "It reflects them back", "It does nothing to them"],
    hint: "Concave lenses diverge light. They are used in glasses to help correct nearsightedness.",
  },
  {
    prompt: "In the human eye, which part focuses light onto the retina?",
    right: "the lens (with the cornea)",
    wrong: ["the iris", "the optic nerve", "the pupil"],
    hint: "The cornea and the lens bend light so an image forms on the retina. The iris controls the size of the pupil.",
  },
  {
    prompt: "What is the image on the retina like?",
    right: "Upside down, which the brain interprets the right way up",
    wrong: ["Always the right way up", "Always a mirror image", "Larger than the object"],
    hint: "The lens in your eye is convex, so the image on the retina is inverted. Your brain flips how you perceive it.",
    hard: true,
  },
  {
    prompt: "A plane (flat) mirror forms an image that is…",
    right: "the same size as the object, and as far behind the mirror as the object is in front",
    wrong: [
      "larger than the object",
      "upside down and smaller",
      "formed on the mirror's surface",
    ],
    hint: "Plane mirrors form virtual images. The image appears to be behind the mirror at the same distance as the object.",
  },
  {
    prompt: "Which colours of light combine to make white light?",
    right: "red, green and blue",
    wrong: ["red, yellow and blue", "cyan, magenta and yellow", "red, orange and yellow"],
    hint: "Red, green and blue are the primary colours of light. Yellow, blue and red are the primary colours of paint in an older model.",
  },
  {
    prompt: "Why does a red apple look red in white light?",
    right: "It reflects red light and absorbs most of the other colours",
    wrong: [
      "It absorbs red light and reflects the other colours",
      "It produces its own red light",
      "It reflects all colours equally",
    ],
    hint: "We see the colour that is reflected into our eyes. The rest is absorbed.",
  },
  {
    prompt: "What colour does a red apple look under pure blue light?",
    right: "black or very dark",
    wrong: ["bright red", "yellow", "white"],
    hint: "The apple reflects red and absorbs blue. With only blue light there's almost nothing to reflect.",
    hard: true,
  },
  {
    prompt: "Which colour of visible light has the longest wavelength?",
    right: "red",
    wrong: ["violet", "green", "blue"],
    hint: "Red light has the longest wavelength and the least energy in the visible spectrum. Violet has the shortest.",
  },
  {
    prompt: "A prism splits white light into a rainbow of colours. What does this show?",
    right: "White light is made of many colours that bend by different amounts",
    wrong: [
      "The prism adds colour to the light",
      "Light stops being a wave in glass",
      "Only red light can pass through glass",
    ],
    hint: "Each colour refracts by a slightly different amount, so they spread out (disperse).",
  },
  {
    prompt: "Which type of electromagnetic wave do remote controls and night-vision cameras use?",
    right: "infrared",
    wrong: ["ultraviolet", "X-rays", "radio waves"],
    hint: "Infrared is just below red in the spectrum. We feel it as heat, and a camera can detect it.",
    hard: true,
  },
  {
    prompt: "Which EM waves are used to take images of bones?",
    right: "X-rays",
    wrong: ["radio waves", "microwaves", "infrared"],
    hint: "X-rays pass through soft tissue but are absorbed more by bone, so bones appear on the image.",
  },
  {
    prompt: "Which is true of all electromagnetic waves in a vacuum?",
    right: "They travel at the same speed",
    wrong: [
      "Gamma rays travel faster than radio waves",
      "Light needs a medium such as air to travel",
      "Radio waves are the slowest",
    ],
    hint: "All EM waves travel at about 300 000 km/s in a vacuum. They differ in wavelength, frequency and energy.",
    hard: true,
  },
  {
    prompt: "Why do we see lightning before we hear thunder?",
    right: "Light travels much faster than sound",
    wrong: [
      "Sound is produced after the lightning",
      "Light is louder than sound",
      "Sound waves travel faster in air than light",
    ],
    hint: "Light covers about 300 000 km every second, while sound travels roughly 340 m/s in air.",
  },
];

function lightAndOptics(opts?: GenerateOptions): Question[] {
  const d = level(opts);
  const extras: Question[] = [reflectionQuestion(d), spectrumOrder(d), sortQuestion(OPACITY_SORT, 2)];
  if (d >= 2) extras.push(lightSpeedQuestion(d));
  return make(LIGHT_BANK, d, extras, 8);
}

// ---------- Energy ----------

function efficiencyQuestion(difficulty: Level): Question {
  const total = pick([100, 200, 400, 500]);
  const pct = pick(difficulty === 1 ? [25, 50, 75] : [10, 20, 25, 40, 60, 75, 80, 90]);
  const useful = (total * pct) / 100;
  const wasted = total - useful;
  const devices = ["an electric motor", "a hair dryer", "a gas furnace", "a kettle", "a toy car's motor"];
  const device = pick(devices);
  const kind = difficulty === 1 ? 0 : randInt(0, 2);
  if (kind === 0) {
    return numInput(
      `${cap(device)} takes in ${total} J of energy and transfers ${useful} J usefully. What is its efficiency (%)?`,
      pct,
      `Efficiency = useful energy out ÷ total energy in × 100. Divide ${useful} by ${total}, then multiply by 100.`,
      "number",
      "%",
    );
  }
  if (kind === 1) {
    return numInput(
      `${cap(device)} takes in ${total} J of energy and is ${pct}% efficient. How much energy is wasted (usually as heat)?`,
      wasted,
      `Useful energy = ${pct}% of ${total} = ${useful} J. Wasted energy is the rest: ${total} − ${useful}.`,
      "number",
      "J",
    );
  }
  return numInput(
    `${cap(device)} takes in ${total} J of energy and is ${pct}% efficient. How much useful energy does it give out?`,
    useful,
    `Useful energy out = efficiency × energy in. Find ${pct}% of ${total}.`,
    "number",
    "J",
  );
}

const CHAINS: { prompt: string; items: { id: string; label: string }[]; hint: string }[] = [
  {
    prompt: "Put the steps in a hydroelectric dam in order, starting with the stored energy.",
    items: [
      { id: "a", label: "Water stored high behind the dam (gravitational potential energy)" },
      { id: "b", label: "Water rushes down the pipes (kinetic energy)" },
      { id: "c", label: "The turbine spins (kinetic energy)" },
      { id: "d", label: "The generator produces electricity (electrical energy)" },
    ],
    hint: "Energy flows from stored height to moving water, to a moving turbine, to electricity.",
  },
  {
    prompt: "Put the steps in a natural-gas power plant in order, starting with the fuel.",
    items: [
      { id: "a", label: "Natural gas holds energy (chemical energy)" },
      { id: "b", label: "The gas burns and heats water (thermal energy)" },
      { id: "c", label: "Steam spins the turbine (kinetic energy)" },
      { id: "d", label: "The generator produces electricity (electrical energy)" },
    ],
    hint: "Burning the fuel releases thermal energy that boils water into steam. The steam turns the turbine, which drives the generator.",
  },
  {
    prompt: "Put these in order for a flashlight, starting with the battery.",
    items: [
      { id: "a", label: "Energy stored in the battery (chemical energy)" },
      { id: "b", label: "Current flows through the wires (electrical energy)" },
      { id: "c", label: "The bulb glows (light energy, plus some thermal energy)" },
    ],
    hint: "The battery stores chemical energy, which becomes electrical energy in the circuit and finally light.",
  },
];

function chainOrder(difficulty: Level): OrderQuestion {
  const c = difficulty === 1 ? CHAINS[2] : pick(CHAINS);
  return { kind: "order", prompt: c.prompt, hint: c.hint, items: c.items };
}

const KINETIC_SORT: SortSet = {
  prompt: "Kinetic or potential energy? Sort each example.",
  hint: "Kinetic energy is the energy of motion. Potential energy is stored energy, such as from height, stretching or chemical bonds.",
  bins: [
    { id: "kinetic", label: "kinetic energy (moving)", emoji: "🏃" },
    { id: "potential", label: "potential energy (stored)", emoji: "🔋" },
  ],
  items: [
    { label: "a car driving down the highway", emoji: "🚗", bin: "kinetic" },
    { label: "a falling apple", emoji: "🍎", bin: "kinetic" },
    { label: "a swimmer crossing a pool", emoji: "🏊", bin: "kinetic" },
    { label: "wind blowing a flag", emoji: "🚩", bin: "kinetic" },
    { label: "a book on a high shelf", emoji: "📚", bin: "potential" },
    { label: "a stretched elastic band", emoji: "➰", bin: "potential" },
    { label: "a compressed spring", emoji: "🌀", bin: "potential" },
    { label: "a battery that is not in use", emoji: "🔋", bin: "potential" },
  ],
};

const SOURCE_SORT: SortSet = {
  prompt: "Renewable or non-renewable? Sort each energy source.",
  hint: "Renewable sources (like solar, wind and hydro) are replaced naturally on a human time scale. Fossil fuels and uranium take far longer to form or are limited.",
  bins: [
    { id: "renewable", label: "renewable", emoji: "♻️" },
    { id: "non", label: "non-renewable", emoji: "⛽" },
  ],
  items: [
    { label: "solar", emoji: "☀️", bin: "renewable" },
    { label: "wind", emoji: "🌬️", bin: "renewable" },
    { label: "hydroelectric", emoji: "💧", bin: "renewable" },
    { label: "geothermal", emoji: "🌋", bin: "renewable" },
    { label: "coal", emoji: "⚫", bin: "non" },
    { label: "oil", emoji: "🛢️", bin: "non" },
    { label: "natural gas", emoji: "🔥", bin: "non" },
    { label: "uranium (nuclear fission)", emoji: "☢️", bin: "non" },
  ],
};

const ENERGY_BANK: Item[] = [
  {
    prompt: "State the law of conservation of energy.",
    right: "Energy cannot be created or destroyed, only transformed from one form to another",
    wrong: [
      "Energy is used up when it is transformed",
      "Energy can be created in a power plant",
      "Energy only exists as heat",
    ],
    hint: "When a machine seems to 'use up' energy, it has changed into other forms, often thermal energy that spreads out into the surroundings.",
  },
  {
    prompt: "A solar panel transforms which type of energy into which?",
    right: "Light energy into electrical energy",
    wrong: ["Thermal energy into light", "Chemical energy into electrical energy", "Electrical energy into light"],
    hint: "Photovoltaic cells in a solar panel convert radiant (light) energy from the Sun into electricity.",
  },
  {
    prompt: "What is the main energy transformation in a toaster?",
    right: "Electrical energy to thermal energy (and some light)",
    wrong: ["Thermal energy to electrical energy", "Chemical energy to kinetic energy", "Sound energy to thermal energy"],
    hint: "Current flows through wires that get hot and glow. That's electrical energy becoming thermal and light energy.",
  },
  {
    prompt: "A skateboarder rolls down a ramp. As she goes down, her gravitational potential energy is mainly transformed into…",
    right: "kinetic energy",
    wrong: ["chemical energy", "nuclear energy", "sound energy only"],
    hint: "As she loses height she loses gravitational potential energy and gains speed, which means more kinetic energy. A little becomes thermal due to friction.",
  },
  {
    prompt: "When you rub your hands together, they get warmer. What is the transformation?",
    right: "Kinetic energy to thermal energy by friction",
    wrong: ["Thermal energy to kinetic energy", "Electrical energy to thermal energy", "Chemical energy to light"],
    hint: "Friction between moving surfaces transforms some kinetic energy into thermal energy.",
  },
  {
    prompt: "Which type of heat transfer moves energy through direct contact between particles in a solid, like a spoon in hot soup?",
    right: "conduction",
    wrong: ["convection", "radiation", "reflection"],
    hint: "In conduction, vibrating particles pass their energy on to neighbouring particles. Convection needs a fluid to move, and radiation can cross empty space.",
  },
  {
    prompt: "Which type of heat transfer allows the Sun's energy to reach Earth through space?",
    right: "radiation",
    wrong: ["conduction", "convection", "evaporation"],
    hint: "Radiation is carried by electromagnetic waves and doesn't need a medium.",
  },
  {
    prompt: "Warm air near a heater rises and cooler air sinks to take its place. This is an example of…",
    right: "convection",
    wrong: ["conduction", "radiation", "condensation"],
    hint: "Convection is heat transfer by the movement of a fluid (a liquid or gas). Warm fluid is less dense and rises.",
  },
  {
    prompt: "An incandescent light bulb gives off much more heat than light. What does that say about the bulb?",
    right: "It is not very efficient, because most of the energy becomes thermal energy instead of light",
    wrong: [
      "It breaks the law of conservation of energy",
      "It is perfectly efficient",
      "Heat is created from nothing",
    ],
    hint: "Efficiency compares useful energy out with total energy in. The energy is conserved, but most of it ends up as unwanted thermal energy.",
  },
  {
    prompt: "A ball is dropped and bounces a little lower each time. Where does the 'missing' mechanical energy go?",
    right: "Into thermal energy and sound, which spread into the surroundings",
    wrong: [
      "It is destroyed",
      "It becomes the ball's mass",
      "It stays in the ball as extra potential energy",
    ],
    hint: "Each bounce, some energy becomes thermal and sound energy. Total energy stays the same; the mechanical energy decreases.",
  },
  {
    prompt: "Which type of energy is stored in food, fuel and batteries?",
    right: "chemical energy",
    wrong: ["kinetic energy", "sound energy", "electromagnetic energy"],
    hint: "Chemical energy is stored in the bonds between atoms and is released in a chemical reaction.",
  },
  {
    prompt: "Why are fossil fuels called non-renewable?",
    right: "They take millions of years to form, so we use them far faster than they're replaced",
    wrong: [
      "They can never be burned a second time",
      "They contain no energy",
      "They are only found in space",
    ],
    hint: "Renewable doesn't mean unlimited. It means replaced naturally within a human lifetime.",
  },
  {
    prompt: "Which is an example of sound energy being transformed into electrical energy?",
    right: "A microphone",
    wrong: ["A loudspeaker", "A light bulb", "A toaster"],
    hint: "A microphone turns the vibrations of sound into electrical signals. A loudspeaker does the reverse.",
    hard: true,
  },
  {
    prompt: "A 100 J input produces 30 J of light and 70 J of thermal energy. What is true about the energy output?",
    right: "The total output is 100 J, so energy is conserved",
    wrong: [
      "30 J of energy has been destroyed",
      "70 J of energy has been created",
      "The output is only 30 J",
    ],
    hint: "Add all the outputs, wanted and unwanted: 30 + 70 = 100 J, equal to the input.",
    hard: true,
  },
  {
    prompt: "Why do many cars use a hybrid system that can store braking energy in a battery?",
    right: "To transform kinetic energy that would be wasted as heat into stored energy for later use",
    wrong: [
      "To create new energy from the brakes",
      "To make the car heavier",
      "To turn sound into fuel",
    ],
    hint: "Regenerative braking uses the motor as a generator, turning some kinetic energy into electrical energy stored in the battery.",
    hard: true,
  },
  {
    prompt: "Which two forms of energy does a campfire mainly give off?",
    right: "thermal and light energy",
    wrong: ["electrical and sound energy", "gravitational and elastic energy", "nuclear and magnetic energy"],
    hint: "Burning releases chemical energy as heat and light.",
  },
];

function energyUnit(opts?: GenerateOptions): Question[] {
  const d = level(opts);
  const extras: Question[] = [chainOrder(d), efficiencyQuestion(d)];
  extras.push(sortQuestion(chance(0.5) ? KINETIC_SORT : SOURCE_SORT, perBin(d)));
  return make(ENERGY_BANK, d, extras, 8);
}

// ---------- Plate Tectonics ----------

const EARTH_LAYERS = [
  { id: "crust", label: "crust" },
  { id: "mantle", label: "mantle" },
  { id: "outer", label: "outer core" },
  { id: "inner", label: "inner core" },
];

function layersOrder(difficulty: Level): OrderQuestion {
  const items = difficulty === 1 ? [EARTH_LAYERS[0], EARTH_LAYERS[1], EARTH_LAYERS[3]] : EARTH_LAYERS;
  return {
    kind: "order",
    prompt: "Put Earth's layers in order, from the surface down to the centre.",
    hint: "Start at the thin outer crust, then the thick mantle. The core has a liquid outer layer and a solid inner layer.",
    items,
  };
}

function plateMovement(difficulty: Level): Question {
  const speed = randInt(2, difficulty === 1 ? 5 : 9);
  const myr = pick(difficulty === 1 ? [10, 20, 50] : [10, 20, 25, 40, 50]);
  const km = speed * myr * 10; // cm/yr × million years = ×10 km
  return numInput(
    `A tectonic plate moves about ${speed} cm per year. How far, in kilometres, would it move in ${myr} million years? (1 km = 100 000 cm)`,
    km,
    `${speed} cm/year × ${myr} 000 000 years = ${speed * myr * 1000000} cm. Divide by 100 000 to convert centimetres to kilometres.`,
    "number",
    "km",
  );
}

const ROCK_SORT: SortSet = {
  prompt: "Igneous, sedimentary or metamorphic? Sort each rock.",
  hint: "Igneous rocks form from cooled magma or lava. Sedimentary rocks form from compacted, cemented sediments. Metamorphic rocks are changed by heat and pressure.",
  bins: [
    { id: "igneous", label: "igneous", emoji: "🌋" },
    { id: "sedimentary", label: "sedimentary", emoji: "🏖️" },
    { id: "metamorphic", label: "metamorphic", emoji: "🔥" },
  ],
  items: [
    { label: "granite", emoji: "🪨", bin: "igneous" },
    { label: "basalt", emoji: "⚫", bin: "igneous" },
    { label: "sandstone", emoji: "🏜️", bin: "sedimentary" },
    { label: "limestone", emoji: "🐚", bin: "sedimentary" },
    { label: "marble", emoji: "🏛️", bin: "metamorphic" },
    { label: "slate", emoji: "🏠", bin: "metamorphic" },
  ],
};

const BOUNDARY_SORT: SortSet = {
  prompt: "Divergent, convergent or transform? Sort each example.",
  hint: "Divergent: plates move apart. Convergent: plates move together. Transform: plates slide sideways past each other.",
  bins: [
    { id: "divergent", label: "divergent (moving apart)", emoji: "↔️" },
    { id: "convergent", label: "convergent (colliding)", emoji: "➡️" },
    { id: "transform", label: "transform (sliding past)", emoji: "↕️" },
  ],
  items: [
    { label: "the Mid-Atlantic Ridge", emoji: "🌊", bin: "divergent" },
    { label: "the East African Rift", emoji: "🏜️", bin: "divergent" },
    { label: "the Himalayan mountains forming", emoji: "🏔️", bin: "convergent" },
    { label: "an ocean plate sinking under a continent", emoji: "⬇️", bin: "convergent" },
    { label: "the San Andreas Fault", emoji: "📏", bin: "transform" },
    { label: "plates grinding sideways, building up stress", emoji: "🪨", bin: "transform" },
  ],
};

const TECTONICS_BANK: Item[] = [
  {
    prompt: "Who proposed the theory of continental drift in the early 1900s?",
    right: "Alfred Wegener",
    wrong: ["Charles Darwin", "Isaac Newton", "Louis Pasteur"],
    hint: "Wegener proposed in 1912 that the continents were once joined in a supercontinent he called Pangaea.",
  },
  {
    prompt: "Which of these is evidence that the continents were once joined?",
    right: "Matching fossils of the same land species on continents now separated by an ocean",
    wrong: [
      "Continents are all the same shape",
      "All continents have mountains",
      "All of the continents are surrounded by water",
    ],
    hint: "Fossils of the same freshwater reptile (Mesosaurus) were found in South America and Africa. It could not have swum across the ocean.",
  },
  {
    prompt: "Why was Wegener's idea not widely accepted at first?",
    right: "He couldn't explain what force could move whole continents",
    wrong: [
      "He had no evidence at all",
      "He did not believe that continents exist",
      "It was proved wrong by fossils",
    ],
    hint: "He had good evidence, but not a mechanism. Later discoveries about the seafloor and the mantle provided one.",
  },
  {
    prompt: "What does seafloor spreading mean?",
    right: "New oceanic crust forms at mid-ocean ridges and moves away on both sides",
    wrong: [
      "The oceans get deeper everywhere over time",
      "Continents spread over the seafloor",
      "Oceanic crust is destroyed at mid-ocean ridges",
    ],
    hint: "At a mid-ocean ridge, magma rises, cools and forms new crust. The older crust is pushed to the sides.",
  },
  {
    prompt: "Rock samples from the seafloor show that the rock gets older the farther it is from a mid-ocean ridge. What does this support?",
    right: "Seafloor spreading",
    wrong: ["The oceans are shrinking everywhere", "The Earth is getting smaller", "Volcanoes only form on land"],
    hint: "The youngest rock is at the ridge, where new crust forms. The older rock was carried away on both sides.",
  },
  {
    prompt: "What causes the plates to move?",
    right: "Heat from Earth's interior creates convection currents in the mantle, along with the pull of sinking plate edges",
    wrong: [
      "The pull of the Moon alone",
      "Wind and ocean waves",
      "The spinning of the core, which pushes the oceans",
    ],
    hint: "Hot mantle rock rises slowly and cooler rock sinks. This slow flow and the weight of sinking plates drag the plates along.",
  },
  {
    prompt: "What forms at a divergent boundary on the ocean floor?",
    right: "A mid-ocean ridge with new crust",
    wrong: ["A deep ocean trench", "A huge mountain range", "A strike-slip fault"],
    hint: "Plates moving apart leave a gap that magma fills. Trenches form at convergent boundaries.",
  },
  {
    prompt: "What happens when a dense oceanic plate meets a less dense continental plate?",
    right: "The oceanic plate sinks beneath the continental plate (subduction)",
    wrong: [
      "The continental plate sinks beneath it",
      "The two plates stay perfectly level",
      "Both plates rise to form an island",
    ],
    hint: "Oceanic crust is denser, so it is forced down. This creates trenches, earthquakes and a line of volcanoes on land.",
  },
  {
    prompt: "What is the focus of an earthquake?",
    right: "The point underground where the rock first breaks and moves",
    wrong: [
      "The point on the surface directly above the break",
      "The strongest crack at the surface",
      "The place where the tsunami begins",
    ],
    hint: "The epicentre is the point on the surface above the focus.",
  },
  {
    prompt: "Which seismic waves arrive first at a seismograph station?",
    right: "P waves",
    wrong: ["S waves", "surface waves", "They all arrive together"],
    hint: "P stands for primary. They're the fastest waves, so they arrive first. S waves follow.",
  },
  {
    prompt: "Seismologists find that S waves do not travel through Earth's outer core. What does this suggest?",
    right: "The outer core is liquid",
    wrong: ["The outer core is solid iron", "The outer core is hollow", "The outer core is cold"],
    hint: "S waves can only travel through solids. If they are blocked, that layer must be liquid.",
    hard: true,
  },
  {
    prompt: "Each whole-number step up the magnitude scale means the ground shaking is about…",
    right: "10 times larger",
    wrong: ["1 larger", "2 times larger", "100 times larger"],
    hint: "The scale is logarithmic. A magnitude 6 earthquake shakes the ground about 10 times more than a magnitude 5.",
    hard: true,
  },
  {
    prompt: "What causes most tsunamis?",
    right: "A sudden movement of the seafloor, such as a large earthquake at a subduction zone",
    wrong: ["Strong winds blowing over the ocean", "The tides", "Heavy rain"],
    hint: "When a large area of seafloor suddenly lifts or drops, it moves the water above it and creates waves.",
  },
  {
    prompt: "Where do most of the world's volcanoes and earthquakes occur?",
    right: "Along plate boundaries, such as the Ring of Fire around the Pacific Ocean",
    wrong: [
      "At the centre of continents",
      "Evenly spread across the Earth",
      "Only at the equator",
    ],
    hint: "Most of the action happens where plates meet. The Ring of Fire is a horseshoe-shaped belt of volcanoes and earthquakes around the Pacific Ocean.",
  },
  {
    prompt: "The Hawaiian Islands are far from any plate boundary. How did they form?",
    right: "A hot spot in the mantle melts rock, and the plate moves over it, making a chain of volcanoes",
    wrong: [
      "A divergent boundary runs through them",
      "They are the remains of a sunken continent",
      "They were thrown up by a meteorite",
    ],
    hint: "A hot spot stays in place while the plate moves over it, leaving a line of islands. The oldest are the farthest from the hot spot.",
    hard: true,
  },
  {
    prompt: "Off the coast of BC, the Juan de Fuca plate is sinking beneath the North American plate. What is this boundary called?",
    right: "a subduction zone (convergent boundary)",
    wrong: ["a mid-ocean ridge (divergent boundary)", "a transform fault", "a hot spot"],
    hint: "Where one plate slides under another, it is called subduction. This zone is a source of large earthquakes.",
    hard: true,
  },
  {
    prompt: "In the rock cycle, which process turns loose sediments into sedimentary rock?",
    right: "compaction and cementation",
    wrong: ["melting and cooling", "heat and pressure", "evaporation"],
    hint: "Layers of sediment are squeezed together (compaction) and glued by minerals (cementation).",
  },
  {
    prompt: "Which rock forms when magma cools and hardens?",
    right: "igneous rock",
    wrong: ["sedimentary rock", "metamorphic rock", "fossil rock"],
    hint: "'Igneous' comes from the Latin word for fire. If it cools slowly underground, it forms large crystals, as in granite.",
  },
  {
    prompt: "Which process changes limestone into marble?",
    right: "heat and pressure without melting",
    wrong: ["cooling of lava", "compaction of sediments", "weathering by wind"],
    hint: "Metamorphic rocks are existing rocks changed by heat and pressure, but not melted.",
  },
];

function plateTectonics(opts?: GenerateOptions): Question[] {
  const d = level(opts);
  const extras: Question[] = [layersOrder(d), plateMovement(d)];
  extras.push(sortQuestion(chance(0.5) ? ROCK_SORT : BOUNDARY_SORT, 2));
  return make(TECTONICS_BANK, d, extras, 8);
}

// ---------- Indigenous Knowledge of Ecosystems ----------

const RESPECT_SORT: SortSet = {
  prompt: "Respectful or not? Sort each way of learning about Indigenous knowledge.",
  hint: "Respectful learning means listening to the people who hold the knowledge, asking permission, giving credit and remembering that each Nation is different.",
  bins: [
    { id: "respectful", label: "respectful", emoji: "🤝" },
    { id: "not", label: "not respectful", emoji: "🚫" },
  ],
  items: [
    { label: "Inviting a knowledge keeper to share, and thanking them", emoji: "🙏", bin: "respectful" },
    { label: "Giving credit to the community that shared knowledge", emoji: "📝", bin: "respectful" },
    { label: "Asking permission before sharing someone's story", emoji: "🗣️", bin: "respectful" },
    { label: "Learning about the Nations whose territory you live on", emoji: "🗺️", bin: "respectful" },
    { label: "Saying all Indigenous peoples believe the same things", emoji: "❌", bin: "not" },
    { label: "Using a community's knowledge without asking", emoji: "🚷", bin: "not" },
    { label: "Treating Indigenous knowledge as only in the past", emoji: "⏳", bin: "not" },
    { label: "Copying a story and presenting it as your own", emoji: "©️", bin: "not" },
  ],
};

const INDIGENOUS_BANK: Item[] = [
  {
    prompt: "Many Indigenous communities have lived on and cared for the same lands for countless generations. How does this help them understand local ecosystems?",
    right: "They have a long record of observations about how plants, animals and weather change over time",
    wrong: [
      "They only know about ecosystems far away",
      "Their knowledge is limited to a single season",
      "They rely only on written textbooks",
    ],
    hint: "Long-term observation, passed on from generation to generation, can reveal patterns that short studies might miss.",
  },
  {
    prompt: "What is meant by 'seasonal knowledge' of a place?",
    right: "Knowing when and how plants, animals and weather change through the year in that place",
    wrong: [
      "Knowing only about the summer",
      "Knowing how to change the seasons",
      "Knowing which season is the best",
    ],
    hint: "Noticing signs, such as when certain plants bloom or when animals arrive, helps people decide when and where to harvest or travel.",
  },
  {
    prompt: "Which word best describes caring for land and resources so they stay healthy for the future?",
    right: "stewardship",
    wrong: ["exploitation", "ownership only", "abandonment"],
    hint: "A steward looks after something that must last. Many Indigenous communities describe a responsibility to care for the land for future generations.",
  },
  {
    prompt: "Why is it inaccurate to say 'Indigenous knowledge' is the same everywhere?",
    right: "First Nations, Métis and Inuit communities have different languages, territories and ecosystems, so their knowledge is different",
    wrong: [
      "All communities share exactly the same knowledge",
      "Indigenous knowledge has only one source",
      "Knowledge doesn't depend on place",
    ],
    hint: "Knowledge is tied to specific lands and relationships. An Inuit community in the Arctic and a First Nation on the coast know different ecosystems.",
  },
  {
    prompt: "How is Indigenous knowledge often shared within communities?",
    right: "Through stories, languages, teaching and experience on the land",
    wrong: [
      "Only through written scientific journals",
      "It is never shared",
      "Only through computers",
    ],
    hint: "Knowledge is often passed on through relationships: Elders and knowledge keepers teaching, and learning while spending time on the land.",
  },
  {
    prompt: "A class wants to learn about local plants from a Nation's knowledge keeper. What is the most respectful first step?",
    right: "Contact the community through the proper channels and ask whether and how they would like to share",
    wrong: [
      "Search online and copy what you find",
      "Take photos of a community without asking",
      "Assume you know the answer",
    ],
    hint: "Communities decide what knowledge to share and with whom. Asking permission is part of respect.",
  },
  {
    prompt: "Is Indigenous knowledge only about the past?",
    right: "No. It is living knowledge that people continue to use, adapt and add to today",
    wrong: [
      "Yes. It stopped being used long ago",
      "Yes. It can only be studied in museums",
      "No. It's always the same and never changes",
    ],
    hint: "Indigenous communities are living, modern communities. Their knowledge continues to grow through new observations.",
  },
  {
    prompt: "What is the idea of 'Two-Eyed Seeing', described by Mi'kmaw Elder Albert Marshall?",
    right: "Looking at the world using both Indigenous knowledge and Western science, using the strengths of each",
    wrong: [
      "Believing that only one way of knowing is right",
      "Looking at the same thing twice",
      "Ignoring evidence that doesn't match your view",
    ],
    hint: "'Two-Eyed Seeing' means learning to see with the strengths of both ways of knowing, rather than treating them as rivals.",
  },
  {
    prompt: "A forest research team and a local Nation work together to monitor the health of a river. What might each bring?",
    right: "Scientists may bring measurements, and community members may bring long-term local knowledge and a deep connection to the place",
    wrong: [
      "Only the scientists have useful information",
      "Only the community has useful information",
      "Neither has anything to contribute",
    ],
    hint: "Respectful partnerships value different strengths. Both can help us understand the ecosystem.",
  },
  {
    prompt: "In an ecosystem, why does it matter if one species is removed?",
    right: "Species depend on each other through food webs, so removing one can affect many others",
    wrong: [
      "It never matters",
      "Only the removed species is affected",
      "Only the plants are affected",
    ],
    hint: "Ecosystems are connected webs. Observing these connections over long periods is a strength of many traditional knowledge systems.",
  },
  {
    prompt: "Which of these is an example of a stewardship action that anyone can take?",
    right: "Taking only what you need and leaving a natural area as you found it",
    wrong: [
      "Picking every berry you see",
      "Leaving garbage so the soil gets fertilizer",
      "Disturbing nests to take photos",
    ],
    hint: "Caring for a place so it stays healthy for those who come after you is the heart of stewardship.",
  },
  {
    prompt: "Why is it important to say which Nation a piece of knowledge comes from?",
    right: "It gives credit and respects that the knowledge belongs to that community",
    wrong: [
      "It makes the writing longer",
      "Because every Nation knows the same thing",
      "It isn't important",
    ],
    hint: "Naming the source avoids the mistake of treating all Indigenous peoples as one group and recognizes the people who hold the knowledge.",
  },
  {
    prompt: "A scientist records the date of the first spring bloom each year for decades. Another person's family has noticed spring signs in the same place across generations. What do both have in common?",
    right: "Both use long-term observation to notice patterns and change",
    wrong: [
      "Both rely on a single year of data",
      "Neither involves observation",
      "Both ignore the seasons",
    ],
    hint: "Careful, repeated observation over time is a strength of both scientific monitoring and long-held community knowledge.",
    hard: true,
  },
  {
    prompt: "Why is it important that research about Indigenous lands includes the people who live there?",
    right: "They hold knowledge of the place and have the right to make decisions about it",
    wrong: [
      "It is only needed for photos",
      "It makes the research take longer for no reason",
      "They have no knowledge of the land",
    ],
    hint: "Respectful research is done with communities rather than just about them.",
    hard: true,
  },
  {
    prompt: "Which word describes the idea of balance and give-and-take in the relationship between people and the land?",
    right: "reciprocity",
    wrong: ["domination", "isolation", "competition"],
    hint: "Reciprocity means giving back as well as taking. Many people, including many Indigenous communities, describe caring for the land as a relationship with obligations on both sides.",
    hard: true,
  },
  {
    prompt: "Which statement is respectful and accurate?",
    right: "Many First Nations, Métis and Inuit communities hold detailed knowledge of their own ecosystems",
    wrong: [
      "All Indigenous peoples have identical traditions",
      "Indigenous peoples no longer live on or care for the land",
      "Indigenous knowledge is just a legend with no science in it",
    ],
    hint: "Use 'many' or 'some' rather than 'all', and speak about Indigenous peoples in the present tense.",
  },
];

function indigenousKnowledge(opts?: GenerateOptions): Question[] {
  const d = level(opts);
  return make(INDIGENOUS_BANK, d, [sortQuestion(RESPECT_SORT, perBin(d))], 8);
}

// ---------- The course ----------

export const course: Course = {
  grade: "8",
  subject: "science",
  bigIdeas: {
    "ca-bc": [
      "Life processes are performed at the cellular level.",
      "The behaviour of matter can be explained by the kinetic molecular theory and atomic theory.",
      "Energy is conserved and its transformation can affect living and non-living things.",
      "The theory of plate tectonics is the unifying theory that explains Earth's geological processes.",
    ],
  },
  units: [
    {
      id: "scientific-inquiry",
      title: "Think Like a Scientist",
      emoji: "🔬",
      blurb: "Fair tests, graphs and units",
      parentNote:
        "Scientific inquiry skills: identifying independent, dependent and controlled variables, planning fair tests, reading graphs and tables, using measurement tools, and converting SI units.",
      standards: {
        "ca-bc": "Questioning and predicting; planning and conducting; processing and analyzing data; evaluating; SI units and measurement",
      },
      generate: scientificInquiry,
    },
    {
      id: "cells",
      title: "Cells & Microscopes",
      emoji: "🦠",
      blurb: "The building blocks of life",
      parentNote:
        "Cell theory, organelles and their jobs, plant and animal cells, specialized cells, levels of organization, and using a microscope including total magnification.",
      standards: {
        "ca-bc": "Cell theory; organelles and their functions; differences between plant and animal cells; specialization; use of the microscope",
      },
      generate: cellsAndMicroscopes,
    },
    {
      id: "cell-processes",
      title: "Photosynthesis & Respiration",
      emoji: "🌿",
      blurb: "How cells get energy",
      parentNote:
        "How plants make glucose through photosynthesis, how cells release its energy through cellular respiration, and how the two processes are linked.",
      standards: {
        "ca-bc": "Photosynthesis and cellular respiration as life processes performed at the cellular level",
      },
      generate: cellProcesses,
    },
    {
      id: "heredity",
      title: "Genes & Inheritance",
      emoji: "🧬",
      blurb: "Why you look like you",
      parentNote:
        "Asexual and sexual reproduction, DNA, genes and chromosomes at an introductory level, dominant and recessive alleles, and predicting offspring with Punnett squares.",
      standards: {
        "ca-bc": "Asexual and sexual reproduction; DNA, genes and chromosomes; inherited traits and Punnett squares",
      },
      generate: heredity,
    },
    {
      id: "states-of-matter",
      title: "Particles & States of Matter",
      emoji: "🧊",
      blurb: "Solids, liquids, gases",
      parentNote:
        "The kinetic molecular theory, states of matter and changes of state, reading a heating curve, temperature as particle motion, and calculating density.",
      standards: {
        "ca-bc": "Kinetic molecular theory; states of matter and changes of state; density",
      },
      generate: particlesAndStates,
    },
    {
      id: "atoms",
      title: "Atoms & Elements",
      emoji: "⚛️",
      blurb: "Inside the atom",
      parentNote:
        "The development of atomic theory from Dalton to Bohr, protons, neutrons and electrons, atomic and mass numbers, and the periodic table.",
      standards: {
        "ca-bc": "Atomic theory and models; atomic structure; the periodic table",
      },
      generate: atomsAndElements,
    },
    {
      id: "classifying-matter",
      title: "Mixtures & Compounds",
      emoji: "🧪",
      blurb: "Sorting what things are made of",
      parentNote:
        "Pure substances and mixtures, elements and compounds, solutions, chemical formulas and methods of separating mixtures.",
      standards: {
        "ca-bc": "Pure substances and mixtures; elements and compounds; separating mixtures",
      },
      generate: classifyingMatter,
    },
    {
      id: "chemical-change",
      title: "Physical & Chemical Change",
      emoji: "🔥",
      blurb: "When do new substances form?",
      parentNote:
        "Telling physical changes from chemical changes, signs of a chemical reaction, reactants and products, and the conservation of mass.",
      standards: {
        "ca-bc": "Physical and chemical changes; conservation of mass in chemical reactions",
      },
      generate: physicalChemicalChange,
    },
    {
      id: "light-optics",
      title: "Light & Optics",
      emoji: "🔦",
      blurb: "Mirrors, lenses and colour",
      parentNote:
        "Reflection and refraction, mirrors and lenses, the eye, the electromagnetic spectrum, how we see colour, and the speed of light.",
      standards: {
        "ca-bc": "Properties of light: reflection, refraction, lenses; the electromagnetic spectrum; colour",
      },
      generate: lightAndOptics,
    },
    {
      id: "energy",
      title: "Energy Transformations",
      emoji: "⚡",
      blurb: "Energy changes form, never vanishes",
      parentNote:
        "Forms of energy, transformations and energy chains, the law of conservation of energy, heat transfer, efficiency, and renewable and non-renewable sources.",
      standards: {
        "ca-bc": "Energy transformations; conservation of energy; efficiency; sources of energy",
      },
      generate: energyUnit,
    },
    {
      id: "plate-tectonics",
      title: "Plate Tectonics",
      emoji: "🌋",
      blurb: "Moving continents and shaking ground",
      parentNote:
        "Earth's layers, evidence for continental drift and seafloor spreading, plate boundaries, earthquakes, volcanoes and the rock cycle.",
      standards: {
        "ca-bc": "Theory of plate tectonics; evidence; earthquakes and volcanoes; the rock cycle",
      },
      generate: plateTectonics,
    },
    {
      id: "indigenous-ecosystems",
      title: "Knowledge of the Land",
      emoji: "🌲",
      blurb: "Long-term observation and stewardship",
      parentNote:
        "How many Indigenous communities hold detailed, living knowledge of their local ecosystems through long-term observation and stewardship, and respectful ways of learning from it. Stays general; it does not describe the practices of any one Nation.",
      standards: {
        "ca-bc": "First Peoples knowledge of local ecosystems and stewardship; Two-Eyed Seeing; respectful use of Indigenous knowledge",
      },
      generate: indigenousKnowledge,
    },
  ],
};
