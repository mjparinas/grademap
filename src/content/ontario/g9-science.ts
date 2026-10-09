import { sortQuestion, type BankItem, type SortSet } from "../bank";
import { pick, randInt, sample, shuffle, textChoice } from "../random";
import type { GenerateOptions, Question, Unit, Visual } from "../types";
import { buildSet, levelOf, on, spaced, typeIn, type Level, type Maker } from "./kit";

// Ontario Grade 9 science, SNC1W (2022 de-streamed course). BC's Grade 9 science is organized
// differently (cell division, reproduction, bonding), so no BC units are shared; every unit here is
// written for the Ontario expectations: STEM skills, ecosystems and climate, atoms and the periodic
// table, compounds, electricity, and the Sun, solar system and universe.

// ---------- Helpers ----------

export interface Item extends BankItem {
  /** 1 = easier, 2 = on level, 3 = stretch. */
  d: Level;
}

/** A multiple-choice bank item: the first answer after the prompt is correct. */
export function q(d: Level, prompt: string, right: string, wrong: string[], hint: string): Item {
  return { d, prompt, right, wrong, hint };
}

/** Bank items near the child's level (easier sets skip the stretch items and the reverse). */
export function nearLevel(items: Item[], level: Level, need: number): Item[] {
  const near = items.filter((i) => Math.abs(i.d - level) <= 1);
  return near.length >= need ? near : items;
}

/** A unit's question set: some generated questions, the rest from a bank near the child's level. */
export function unitSet(items: Item[], level: Level, makers: Maker[], total = 8): Question[] {
  const bankCount = total - makers.length;
  const picked = sample(nearLevel(items, level, bankCount), bankCount).map((b) => textChoice(b.prompt, b.right as string, b.wrong as string[], b.hint));
  const seen = new Set(picked.map((p) => p.prompt));
  const made = buildSet(makers).filter((m) => !seen.has(m.prompt));
  return shuffle([...picked, ...made]);
}

const code = (lines: string[]): Visual => ({ type: "passage", title: "Code", paragraphs: lines });

// ---------- A: STEM skills ----------

const STEM: Item[] = [
  q(1, "In an experiment, the variable you change on purpose is the…", "independent (manipulated) variable", ["dependent (responding) variable", "controlled variable", "hypothesis"], "You change the independent variable and watch what happens to the dependent variable."),
  q(1, "In an experiment, the variable you measure to see the effect is the…", "dependent (responding) variable", ["independent (manipulated) variable", "controlled variable", "conclusion"], "The dependent variable responds to the change you make."),
  q(1, "Why do scientists keep controlled variables the same in a fair test?", "so only one thing changes and the results can be trusted", ["so the results are always the same", "so the experiment takes less time", "so the hypothesis is always right"], "If several things change at once, you cannot tell which one caused the result."),
  q(1, "Which is a testable hypothesis?", "If a plant gets more light, then it will grow taller.", ["Plants are beautiful.", "Why do plants grow?", "Light is the best thing for everyone."], "A hypothesis is a prediction you can test with measurements, written like an if…then statement."),
  q(1, "What does WHMIS stand for?", "Workplace Hazardous Materials Information System", ["Workplace Health and Medical Injury Service", "World Hazardous Materials Inspection Standard", "Work Hazard Management and Information Sheet"], "WHMIS tells workers and students about hazardous products through labels and safety data sheets."),
  q(1, "Chemicals splash into your eyes in the lab. What should you do first?", "Go to the eyewash station right away and tell your teacher", ["Wait to see if it starts to hurt", "Rub your eyes with a paper towel", "Finish the experiment, then tell your teacher"], "Rinse right away for a long time, and get help at once."),
  q(1, "Which is a quantitative observation?", "The mass of the sample is 25 g.", ["The liquid smells sweet.", "The solid is shiny.", "The flame is orange."], "Quantitative observations use numbers and units. Qualitative ones describe with words."),
  q(1, "Which skilled trade installs and repairs electrical wiring in homes and buildings?", "electrician", ["plumber", "welder", "carpenter"], "Electricians apply the science of circuits, current and safety every day."),
  q(2, "When you heat a liquid in a test tube, how should you hold it?", "Point the opening away from everyone, including yourself", ["Look into the opening to watch it", "Seal the opening with a stopper", "Hold it close to your face to see better"], "Hot liquid can shoot out of the tube suddenly."),
  q(2, "Which document gives detailed hazard and handling information for a hazardous product?", "Safety Data Sheet (SDS)", ["the barcode on the package", "the sales receipt", "a periodic table"], "WHMIS uses supplier labels for a quick warning and an SDS for full details."),
  q(2, "A student tests how a cart's mass affects its stopping distance. Which is the dependent variable?", "the stopping distance", ["the mass of the cart", "the slope of the ramp", "the surface it rolls on"], "Stopping distance is what is measured in response to the change in mass."),
  q(2, "On a graph, which axis usually shows the independent variable?", "the horizontal (x) axis", ["the vertical (y) axis", "the title", "the legend"], "Put the variable you change on x and the variable you measure on y."),
  q(2, "What is the first step of an engineering design process?", "Define the problem, with its criteria and constraints", ["Build the final product", "Sell the design", "Test the prototype"], "You need to know what the design must do before you can plan it."),
  q(2, "In a design challenge, which is a constraint?", "a limit on cost, time or materials", ["the goal the design must meet", "the results of a test", "the name of the design"], "Criteria say what the design must do. Constraints are the limits you must work within."),
  q(2, "After testing a prototype, an engineer should…", "evaluate the results and improve the design", ["stop, since the first design is always final", "hide the failures", "skip testing next time"], "Design is a cycle: test, evaluate, redesign and test again."),
  q(2, "Which source is most credible for climate data?", "a science agency report that cites its data", ["an anonymous post with no sources", "an advertisement", "a message forwarded by a friend"], "Check who made it, whether it cites evidence, and whether others can confirm it."),
  q(2, "An AI system gives you an answer to a science question. What is the best next step?", "Check it against reliable sources before you trust it", ["Trust it because it sounds confident", "Copy it without reading it", "Assume it is right if it is long"], "AI tools can make mistakes or invent facts, so confirm important claims."),
  q(2, "In code for a simulation, a loop is used to…", "repeat a set of instructions", ["store a value with a name", "make the program run only once", "hide the output"], "Loops let a model repeat a step, such as one day of growth, many times."),
  q(2, "In code, a variable is…", "a named place that stores a value that can change", ["a step that repeats", "a mistake in the program", "the title of the program"], "A model may use a variable such as population to track a value through time."),
  q(2, "Dr. Donna Strickland, a Canadian physicist, shared the 2018 Nobel Prize in Physics for work on…", "laser pulses", ["insulin", "space travel", "the periodic table"], "Her research at the University of Waterloo led to very short, strong laser pulses that are used in eye surgery."),
  q(2, "Two Canadians, Frederick Banting and Charles Best, worked in Toronto in 1921 on the discovery of…", "insulin as a treatment for diabetes", ["the electron", "penicillin", "the telephone"], "Insulin changed diabetes from a deadly disease into a manageable one."),
  q(3, "Why do scientists repeat their trials?", "to reduce the effect of chance errors and check the results are reliable", ["to make the results match the hypothesis", "because the first trial is always wrong", "to use up more time"], "A result seen again and again is more trustworthy than one trial."),
  q(3, "Two variables are correlated. Does this prove one causes the other?", "No, other factors may be involved, so more investigation is needed", ["Yes, always", "Yes, if the graph is a straight line", "No, correlation never means anything"], "Correlation shows a relationship. Cause needs a controlled test or more evidence."),
  q(3, "A prototype fails its test. What is the best response?", "Analyse why it failed, then redesign and test again", ["Change the criteria so it passes", "Throw away the results", "Declare the design perfect"], "Failure gives information that helps the next design."),
  q(3, "How can bias in the data used to train an AI system affect its results?", "It can make the results unfair or inaccurate for some groups", ["It has no effect because computers are neutral", "It makes the program run faster", "It changes only the colours"], "AI learns patterns from its data. If the data leaves out people or places, so will the output."),
  q(3, "Measurements of 4.9 g, 5.0 g and 5.1 g are taken for a sample whose true mass is 5.0 g. These measurements are…", "both precise and accurate", ["precise but not accurate", "accurate but not precise", "neither precise nor accurate"], "They are close together (precise) and close to the true value (accurate)."),
  q(3, "Dr. Arthur McDonald led the Sudbury Neutrino Observatory, deep in a nickel mine in Ontario. His work helped show that…", "neutrinos change from one type to another", ["atoms are solid spheres", "the Sun is cooling quickly", "electrons are heavier than protons"], "He shared the 2015 Nobel Prize in Physics for the discovery."),
];

function meanQ(): Question {
  const m = randInt(10, 40);
  const a = randInt(1, 6);
  const b = randInt(1, 6);
  const trials = shuffle([m + a, m - a, m + b, m - b]);
  return typeIn(`Four trials of a reaction took ${trials.join(", ")} seconds. What is the mean time, in seconds?`, m, `Add the four times and divide by 4: the total is ${4 * m}, and ${4 * m} ÷ 4 = ${m}.`);
}

function loopQ(): Question {
  const start = randInt(2, 9);
  const n = randInt(3, 6);
  if (randInt(0, 1) === 0) {
    const step = randInt(2, 5);
    return typeIn(
      `What does this code print?`,
      start + n * step,
      `The loop adds ${step} each time, ${n} times: ${start} + ${n} × ${step} = ${start + n * step}.`,
      code([`height = ${start}`, `repeat ${n} times:`, `    height = height + ${step}`, "print(height)"]),
    );
  }
  const reps = randInt(2, 4);
  return typeIn(
    `A model starts with ${start} cells. What does this code print?`,
    start * 2 ** reps,
    `The number doubles ${reps} times: ${start} × ${2 ** reps} = ${start * 2 ** reps}.`,
    code([`cells = ${start}`, `repeat ${reps} times:`, "    cells = cells * 2", "print(cells)"]),
  );
}

function stemSkills(opts?: GenerateOptions): Question[] {
  return unitSet(STEM, levelOf(opts), [meanQ, loopQ]);
}

// ---------- B: Ecosystems ----------

const ECOSYSTEMS: Item[] = [
  q(1, "Which sphere of Earth includes all living things?", "biosphere", ["hydrosphere", "lithosphere", "atmosphere"], "Bio means life."),
  q(1, "Which sphere is the layer of gases around Earth?", "atmosphere", ["biosphere", "hydrosphere", "lithosphere"], "The atmosphere holds nitrogen, oxygen, carbon dioxide and other gases."),
  q(1, "Which sphere includes oceans, lakes, rivers, groundwater and ice?", "hydrosphere", ["biosphere", "lithosphere", "atmosphere"], "Hydro means water."),
  q(1, "Which sphere includes rock, soil and landforms?", "lithosphere", ["hydrosphere", "atmosphere", "biosphere"], "Litho means stone."),
  q(1, "Which is an abiotic factor in an ecosystem?", "water temperature", ["a beaver", "a maple tree", "a mushroom"], "Abiotic means non-living, such as sunlight, water, temperature and soil."),
  q(1, "What does a producer do in an ecosystem?", "Makes its own food, usually by photosynthesis", ["Eats other animals", "Breaks down dead matter", "Only lives in water"], "Plants and algae are the producers at the base of food chains."),
  q(1, "What do decomposers such as fungi and bacteria do?", "Break down dead matter and return nutrients to the soil", ["Make food from sunlight", "Hunt other animals", "Produce all of the oxygen"], "Decomposers recycle matter so producers can use it again."),
  q(1, "A tree's roots take in water from the soil. Which spheres are interacting?", "biosphere, lithosphere and hydrosphere", ["atmosphere only", "atmosphere and hydrosphere only", "hydrosphere only"], "The tree (biosphere) takes water (hydrosphere) from the soil (lithosphere)."),
  q(2, "In the food chain grass → grasshopper → frog → heron, which organism is the secondary consumer?", "frog", ["grass", "grasshopper", "heron"], "Grass is the producer, the grasshopper is a primary consumer, and the frog eats it."),
  q(2, "In the food chain grass → grasshopper → frog → heron, which organism is the tertiary consumer?", "heron", ["grass", "grasshopper", "frog"], "The tertiary consumer eats the secondary consumer."),
  q(2, "What does it mean for an ecosystem to be in dynamic equilibrium?", "It stays fairly stable overall even though its populations and conditions keep changing", ["Nothing in it ever changes", "It contains only producers", "It has no living things"], "Balance comes from change: births and deaths, feeding and growth keep adjusting."),
  q(2, "Snowshoe hare and lynx populations rise and fall in linked cycles. This shows…", "predator and prey populations balancing each other", ["succession on bare rock", "an abiotic factor", "an ecosystem with no producers"], "More hares feed more lynx, then more lynx reduce the hares."),
  q(2, "Which statement about matter and energy in an ecosystem is correct?", "Matter is recycled, while energy flows through and leaves as heat", ["Energy is recycled, while matter flows through", "Both are used up completely", "Both cycle forever with no loss"], "Atoms such as carbon are reused. Energy from the Sun is transformed and eventually lost as heat."),
  q(2, "Which process removes carbon dioxide from the atmosphere?", "photosynthesis", ["cellular respiration", "burning wood", "decomposition"], "Producers take in CO₂ to make sugars."),
  q(2, "Which process turns water vapour into liquid droplets?", "condensation", ["evaporation", "transpiration", "melting"], "Cooling water vapour condenses into clouds."),
  q(2, "Bacteria in the root nodules of legumes such as beans…", "change nitrogen from the air into forms that plants can use", ["make oxygen from nitrogen", "remove nitrogen from the soil", "turn nitrogen into carbon"], "This is nitrogen fixation, one step of the nitrogen cycle."),
  q(2, "Why does a higher biodiversity usually make an ecosystem more resilient?", "If one species declines, others can fill its role", ["It means fewer species depend on each other", "It stops all change", "It removes the need for producers"], "Many species means more than one species doing each job."),
  q(2, "Primary succession begins on…", "bare rock with no soil, such as rock uncovered by a retreating glacier", ["a field after a forest fire", "a lawn that is not mowed", "a farm field that was just harvested"], "Pioneer species such as lichens break rock down and slowly build the first soil."),
  q(2, "Secondary succession begins…", "in an area where soil remains, such as a forest after a fire", ["on newly formed bare rock", "in the middle of a glacier", "only in the ocean"], "Soil already has nutrients and seeds, so recovery is faster than primary succession."),
  q(2, "Which action helps soil health?", "adding compost and leaving plant residue on the field", ["leaving soil bare all year", "removing all organic matter", "spraying the soil with salt"], "Organic matter feeds decomposers and holds water and nutrients."),
  q(2, "Fertilizer runs off a field into a lake. What often happens?", "Algae grow quickly, and when they die decomposers use up the oxygen", ["The lake becomes cleaner", "Fish numbers rise with no other effects", "The water becomes a solid"], "Extra nutrients cause algal blooms, which can lower dissolved oxygen."),
  q(2, "Zebra mussels, which spread in the Great Lakes, are an example of…", "an invasive species", ["a native producer", "a decomposer", "an abiotic factor"], "Invasive species are non-native organisms that spread and harm an ecosystem."),
  q(2, "Why do wetlands matter for ecosystem sustainability?", "They filter water, store floodwater and shelter many species", ["They add pollution to rivers", "They have no living things", "They stop water cycling"], "Healthy wetlands are some of the most useful ecosystems."),
  q(2, "Farmers plant a legume such as clover in rotation with other crops. Why?", "Its bacteria add nitrogen to the soil, so less fertilizer is needed", ["It removes carbon from the soil", "It makes other crops grow without sunlight", "It attracts only pests"], "Crop rotation is a sustainable practice that uses the nitrogen cycle."),
  q(3, "No-till farming leaves the soil mostly undisturbed. A benefit is that it…", "reduces erosion and helps keep carbon stored in the soil", ["increases erosion", "removes all organisms from the soil", "needs no water"], "Soil that is not turned over stays covered and keeps its structure."),
  q(3, "Why are there usually only a few top predators in an ecosystem?", "Little energy is left after several energy transfers", ["Top predators eat energy from the Sun", "Producers are too large", "Predators cannot reproduce"], "Only about 10% of the energy moves to the next level."),
  q(3, "Unlike carbon and nitrogen, phosphorus mostly cycles through…", "rocks, soil and water, not the atmosphere", ["the atmosphere as a gas", "only the Sun", "only animals"], "Phosphorus has no major gas phase in its cycle."),
  q(3, "Cutting down a large area of forest and not replanting would most likely…", "reduce biodiversity and carbon storage", ["increase the number of producers", "improve water filtering", "increase soil nutrients permanently"], "Trees shelter organisms, anchor soil and take in carbon dioxide."),
  q(3, "Which is a sign of good water quality in a stream?", "high dissolved oxygen and sensitive insects such as mayfly larvae", ["thick green scum on the surface", "a foul smell", "dead fish along the banks"], "Some organisms live only in clean, well-oxygenated water, so they are indicators."),
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
    { label: "sugar maple", emoji: "🍁", bin: "producer" },
    { label: "algae in a lake", emoji: "🌿", bin: "producer" },
    { label: "cattails", emoji: "🌾", bin: "producer" },
    { label: "white-tailed deer", emoji: "🦌", bin: "consumer" },
    { label: "loon", emoji: "🦆", bin: "consumer" },
    { label: "beaver", emoji: "🦫", bin: "consumer" },
    { label: "mushrooms on a fallen log", emoji: "🍄", bin: "decomposer" },
    { label: "soil bacteria", emoji: "🦠", bin: "decomposer" },
    { label: "earthworms in compost", emoji: "🐛", bin: "decomposer" },
  ],
};

function energyQ(): Question {
  const start = pick([1000, 2000, 5000, 10000, 20000]);
  const steps = randInt(1, 3);
  const names = ["the primary consumers", "the secondary consumers", "the tertiary consumers"];
  const left = start / 10 ** steps;
  return typeIn(
    `Producers in a meadow store ${spaced(start)} kJ of energy. About 10% passes to each next level. How much reaches ${names[steps - 1]}, in kJ?`,
    left,
    `Multiply by 0.1 for each step. ${steps} step${steps > 1 ? "s" : ""} gives ${spaced(start)} ÷ ${spaced(10 ** steps)} = ${left} kJ.`,
    undefined,
    { suffix: "kJ" },
  );
}

function ecosystems(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const makers: Maker[] = [energyQ];
  if (level !== 3) makers.push(() => sortQuestion(ROLE_SORT, 2));
  return unitSet(ECOSYSTEMS, level, makers);
}

// ---------- B: Photosynthesis and cellular respiration ----------

const PHOTO: Item[] = [
  q(1, "Where in a plant cell does photosynthesis happen?", "chloroplasts", ["mitochondria", "the nucleus", "the cell wall"], "Chloroplasts contain chlorophyll, which captures light energy."),
  q(1, "Where in a cell is most of the energy released by cellular respiration?", "mitochondria", ["chloroplasts", "the nucleus", "the cell membrane"], "Mitochondria are the cell's energy converters."),
  q(1, "What are the reactants of photosynthesis?", "carbon dioxide and water", ["glucose and oxygen", "oxygen and water", "glucose and carbon dioxide"], "Plants take in carbon dioxide from the air and water from the soil."),
  q(1, "What are the products of photosynthesis?", "glucose and oxygen", ["carbon dioxide and water", "carbon dioxide and glucose", "water and oxygen only"], "The plant stores energy in glucose and releases oxygen."),
  q(1, "Which type of energy does a plant need for photosynthesis?", "light energy", ["sound energy", "nuclear energy", "thermal energy from the soil"], "Chlorophyll absorbs light, usually from the Sun."),
  q(2, "What are the reactants of cellular respiration?", "glucose and oxygen", ["carbon dioxide and water", "glucose and carbon dioxide", "light and water"], "Cells break down glucose using oxygen."),
  q(2, "What are the products of cellular respiration?", "carbon dioxide, water and usable energy", ["glucose and oxygen", "glucose and light", "oxygen and water only"], "The energy released is used for growth, movement and repair."),
  q(2, "Which words summarize photosynthesis?", "carbon dioxide + water + light energy → glucose + oxygen", ["glucose + oxygen → carbon dioxide + water + energy", "glucose + carbon dioxide → water + oxygen", "oxygen + water → carbon dioxide + glucose"], "Photosynthesis builds glucose from carbon dioxide and water."),
  q(2, "Do plant cells carry out cellular respiration?", "Yes, all living cells do, in the day and at night", ["No, only animal cells do", "Only at night", "Only in the roots"], "Plants make glucose by photosynthesis and then use it in respiration."),
  q(2, "Which gas released by photosynthesis do animals use in cellular respiration?", "oxygen", ["carbon dioxide", "nitrogen", "hydrogen"], "The products of one process are the reactants of the other."),
  q(2, "Why are photosynthesis and cellular respiration called complementary?", "The products of each are the reactants of the other", ["They both need light", "They both happen only in animals", "They both make oxygen"], "Together they cycle carbon and oxygen through ecosystems."),
  q(2, "Which is an energy transformation in photosynthesis?", "light energy to chemical energy", ["chemical energy to light energy", "thermal energy to sound energy", "kinetic energy to light energy"], "The energy is stored in the chemical bonds of glucose."),
  q(3, "At night a plant makes no glucose by photosynthesis. What does it do with carbon dioxide?", "It releases carbon dioxide from cellular respiration", ["It takes in even more carbon dioxide", "It releases only oxygen", "It stops all chemical reactions"], "Respiration continues without light, so the plant gives off CO₂."),
  q(3, "A sealed jar holds a healthy plant and a small snail in the light. Why can both survive for a while?", "The plant's oxygen supports the snail's respiration, and the snail's carbon dioxide supports the plant", ["The snail makes oxygen", "The plant makes no oxygen", "Neither one uses energy"], "Each organism provides what the other needs."),
  q(3, "Large forests are called carbon sinks because they…", "take in more carbon dioxide than they release over time", ["release more carbon than they take in", "produce no oxygen", "stop the water cycle"], "Trees store carbon in wood and soil."),
  q(3, "What happens to the dynamic equilibrium of the atmosphere if photosynthesis falls and respiration and burning continue?", "Carbon dioxide levels rise", ["Oxygen levels rise sharply", "Nothing changes", "Nitrogen levels rise"], "Less carbon dioxide is removed, while it is still being added."),
];

const PR_SORT: SortSet = {
  prompt: "Photosynthesis or cellular respiration? Sort each statement.",
  hint: "Photosynthesis builds glucose using light. Cellular respiration breaks glucose down to release energy.",
  bins: [
    { id: "photo", label: "Photosynthesis", emoji: "☀️" },
    { id: "resp", label: "Cellular respiration", emoji: "⚡" },
  ],
  items: [
    { label: "Uses light energy", emoji: "☀️", bin: "photo" },
    { label: "Takes in carbon dioxide", emoji: "🌫️", bin: "photo" },
    { label: "Happens in chloroplasts", emoji: "🌿", bin: "photo" },
    { label: "Makes glucose", emoji: "🍬", bin: "photo" },
    { label: "Releases oxygen", emoji: "💨", bin: "photo" },
    { label: "Breaks down glucose", emoji: "🔥", bin: "resp" },
    { label: "Releases carbon dioxide", emoji: "💭", bin: "resp" },
    { label: "Happens in mitochondria", emoji: "🔋", bin: "resp" },
    { label: "Uses oxygen", emoji: "🌬️", bin: "resp" },
    { label: "Happens in plant and animal cells", emoji: "🐾", bin: "resp" },
  ],
};

function atomCountQ(): Question {
  const sets: [string, number, string, number, string][] = [
    ["6 CO₂", 6, "carbon", 6, "Each CO₂ has 1 carbon atom, and there are 6 of them."],
    ["6 CO₂", 6, "oxygen", 12, "Each CO₂ has 2 oxygen atoms, and 6 × 2 = 12."],
    ["6 H₂O", 6, "hydrogen", 12, "Each H₂O has 2 hydrogen atoms, and 6 × 2 = 12."],
    ["6 H₂O", 6, "oxygen", 6, "Each H₂O has 1 oxygen atom, and there are 6 of them."],
    ["6 O₂", 6, "oxygen", 12, "Each O₂ has 2 oxygen atoms, and 6 × 2 = 12."],
    ["C₆H₁₂O₆", 1, "hydrogen", 12, "The subscript 12 after H means 12 hydrogen atoms in one molecule."],
    ["C₆H₁₂O₆", 1, "oxygen", 6, "The subscript 6 after O means 6 oxygen atoms in one molecule."],
  ];
  const [what, , element, n, hint] = pick(sets);
  return typeIn(`In ${what}, how many ${element} atoms are there altogether?`, n, hint);
}

function photosynthesis(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const makers: Maker[] = [atomCountQ, () => sortQuestion(PR_SORT, 3)];
  return unitSet(PHOTO, level, makers);
}

// ---------- B: Climate change ----------

const CLIMATE: Item[] = [
  q(1, "Which is a greenhouse gas?", "methane", ["nitrogen", "argon", "helium"], "Carbon dioxide, methane, nitrous oxide and water vapour trap heat. Nitrogen, argon and helium do not."),
  q(1, "What does the greenhouse effect do?", "Gases in the atmosphere trap some of Earth's heat", ["It makes the Sun hotter", "It stops sunlight from reaching Earth", "It removes carbon dioxide"], "The natural greenhouse effect keeps Earth warm enough for life."),
  q(1, "Which is a fossil fuel?", "coal", ["wind", "sunlight", "flowing water"], "Coal, oil and natural gas formed from ancient living things."),
  q(1, "Burning fossil fuels releases which greenhouse gas?", "carbon dioxide", ["nitrogen", "helium", "argon"], "Carbon stored for millions of years is released in a short time."),
  q(1, "Climate is…", "the average weather in a region over many years", ["the weather today", "the temperature at noon", "a storm"], "Weather changes daily. Climate is the long-term pattern, usually 30 years or more."),
  q(1, "Which is an indicator of climate change?", "shrinking Arctic sea ice", ["one cold winter day", "a rainy weekend", "a single thunderstorm"], "Indicators are long-term measurements showing a trend."),
  q(2, "Why is one cold winter day not evidence against climate change?", "Weather is short-term, while climate is a long-term average", ["Cold days cannot happen in a warming world", "Climate is the same as weather", "Scientists do not measure temperature"], "A single day tells you about weather. A trend over decades tells you about climate."),
  q(2, "Sea level is rising because…", "ocean water expands as it warms and land ice melts", ["rain has increased everywhere", "the Moon is moving closer", "mountains are sinking"], "Both thermal expansion and melting glaciers and ice sheets add to sea level."),
  q(2, "Which human activity has added the most carbon dioxide to the atmosphere since 1850?", "burning fossil fuels", ["volcanoes", "ocean waves", "meteorites"], "Natural sources exist, but fossil fuels are the largest source of the recent increase."),
  q(2, "Cattle, landfills and rice paddies are sources of which greenhouse gas?", "methane", ["helium", "argon", "oxygen"], "Microbes that break down organic matter without oxygen release methane."),
  q(2, "Thawing permafrost in northern Canada can damage roads and buildings. Why?", "Frozen ground that supported them softens and shifts", ["Permafrost turns into rock", "Thawing makes the ground drier and harder", "Roads melt in the cold"], "Permafrost is ground that stays frozen all year. As it thaws it sinks and shifts."),
  q(2, "The ocean absorbs extra carbon dioxide from the air. What is one result?", "ocean acidification, which harms shellfish and corals", ["the oceans become fresh water", "the oceans stop moving", "fish grow larger shells"], "Dissolved CO₂ forms a weak acid."),
  q(2, "Installing solar panels to replace fossil-fuel electricity is an example of…", "mitigation", ["adaptation", "succession", "decomposition"], "Mitigation reduces greenhouse gas emissions or removes them from the air."),
  q(2, "Building a sea wall to protect a coastal town from higher seas is an example of…", "adaptation", ["mitigation", "photosynthesis", "succession"], "Adaptation means adjusting to the effects of climate change."),
  q(2, "Planting trees helps with climate change mainly because trees…", "take in carbon dioxide as they grow", ["release methane", "reflect all sunlight", "stop the water cycle"], "Growing trees are a carbon sink, so planting trees is a mitigation action."),
  q(2, "Ontario stopped generating electricity from coal in 2014. What was one environmental effect?", "Less carbon dioxide and fewer air pollutants from burning coal", ["More greenhouse gases from coal", "No electricity from any source", "Coal was replaced with more coal"], "Replacing coal with lower-emission sources reduces both pollution and emissions."),
  q(2, "Warmer winters in parts of Ontario have helped ticks that carry Lyme disease spread north. This is an example of climate change affecting…", "where organisms can live and survive", ["the speed of light", "the number of planets", "the strength of gravity"], "Fewer very cold days means more ticks survive the winter."),
  q(2, "Why is the Great Lakes ice cover important for lake ecosystems?", "Ice affects water temperature, evaporation and the life cycles of fish", ["Ice has no effect on lakes", "Ice makes lakes saltier", "Ice stops all fish from living"], "Less winter ice can mean more evaporation and warmer water."),
  q(3, "Before the industrial era, atmospheric carbon dioxide was about 280 ppm. Today it is over 420 ppm. Which statement is correct?", "The concentration has risen by about half", ["The concentration has fallen", "The concentration has doubled exactly", "The concentration has not changed"], "420 − 280 = 140 ppm, and 140 is half of 280."),
  q(3, "Which pair of actions is a mitigation action and an adaptation action, in that order?", "Taking transit; planting drought-tolerant crops", ["Planting drought-tolerant crops; taking transit", "Building a sea wall; using solar power", "Building a flood barrier; building a sea wall"], "Mitigation lowers emissions. Adaptation prepares for the changes that are happening."),
  q(3, "A farm adds cover crops and uses precision tools so it applies fertilizer only where it is needed. How does this support sustainability?", "It cuts nutrient runoff and protects soil", ["It increases erosion", "It uses more fertilizer", "It removes soil organisms"], "Applying only what plants need keeps extra nutrients out of water."),
  q(3, "Which is the best evidence that human activities contribute to climate change?", "Measurements show carbon dioxide rising along with fossil fuel use, and the extra carbon has the chemical signature of fossil fuels", ["People feel warm in summer", "Weather forecasts are sometimes wrong", "Winters are always cold"], "Several independent lines of evidence point to the same cause."),
];

function ppmQ(): Question {
  const before = 280;
  const after = randInt(410, 430);
  return typeIn(`Atmospheric carbon dioxide rose from about ${before} ppm before the industrial era to about ${after} ppm. By how many ppm did it rise?`, after - before, `Subtract: ${after} − ${before} = ${after - before} ppm.`);
}

function cutQ(): Question {
  const total = pick([4, 8, 12, 16, 20]);
  const pct = total % 8 === 0 || total === 20 ? pick([25, 50]) : 25;
  const cut = (total * pct) / 100;
  return typeIn(`A household produces ${total} tonnes of CO₂ a year. A program cuts this by ${pct}%. How many tonnes are cut?`, cut, `${pct}% of ${total} = ${total} × ${pct / 100} = ${cut} tonnes.`, undefined, { suffix: "t" });
}

function climate(opts?: GenerateOptions): Question[] {
  return unitSet(CLIMATE, levelOf(opts), [ppmQ, cutQ]);
}

// ---------- C: Atoms ----------

interface El {
  name: string;
  symbol: string;
  z: number;
  mass: number;
}

const ELEMENTS: El[] = [
  { name: "hydrogen", symbol: "H", z: 1, mass: 1 },
  { name: "helium", symbol: "He", z: 2, mass: 4 },
  { name: "lithium", symbol: "Li", z: 3, mass: 7 },
  { name: "beryllium", symbol: "Be", z: 4, mass: 9 },
  { name: "boron", symbol: "B", z: 5, mass: 11 },
  { name: "carbon", symbol: "C", z: 6, mass: 12 },
  { name: "nitrogen", symbol: "N", z: 7, mass: 14 },
  { name: "oxygen", symbol: "O", z: 8, mass: 16 },
  { name: "fluorine", symbol: "F", z: 9, mass: 19 },
  { name: "neon", symbol: "Ne", z: 10, mass: 20 },
  { name: "sodium", symbol: "Na", z: 11, mass: 23 },
  { name: "magnesium", symbol: "Mg", z: 12, mass: 24 },
  { name: "aluminum", symbol: "Al", z: 13, mass: 27 },
  { name: "silicon", symbol: "Si", z: 14, mass: 28 },
  { name: "phosphorus", symbol: "P", z: 15, mass: 31 },
  { name: "sulphur", symbol: "S", z: 16, mass: 32 },
  { name: "chlorine", symbol: "Cl", z: 17, mass: 35 },
  { name: "argon", symbol: "Ar", z: 18, mass: 40 },
  { name: "potassium", symbol: "K", z: 19, mass: 39 },
  { name: "calcium", symbol: "Ca", z: 20, mass: 40 },
];

const cap = (s: string): string => s[0].toUpperCase() + s.slice(1);

/** Electrons in each shell for the first 20 elements: 2, 8, 8, then the rest. */
function shells(z: number): number[] {
  const out: number[] = [];
  let left = z;
  for (const max of [2, 8, 8, 2]) {
    if (left <= 0) break;
    const n = Math.min(left, max);
    out.push(n);
    left -= n;
  }
  return out;
}
const arrangement = (z: number): string => shells(z).join(", ");
const valence = (z: number): number => shells(z).at(-1) ?? 0;

const ATOMS: Item[] = [
  q(1, "Which particle in an atom has a positive charge?", "proton", ["electron", "neutron", "none of them"], "Protons are positive, electrons are negative and neutrons have no charge."),
  q(1, "Which particle in an atom has a negative charge?", "electron", ["proton", "neutron", "nucleus"], "Electrons are found outside the nucleus."),
  q(1, "Which particle has no charge?", "neutron", ["proton", "electron", "ion"], "Neutral means neither positive nor negative."),
  q(1, "Where are the protons and neutrons found?", "in the nucleus", ["in the outer shells", "spread evenly through the atom", "outside the atom"], "The nucleus is a tiny, dense centre."),
  q(1, "Where are the electrons found?", "in energy levels (shells) around the nucleus", ["inside the nucleus", "only on the surface of the nucleus", "between the protons"], "In the Bohr–Rutherford model, electrons move in shells around the nucleus."),
  q(1, "The atomic number of an element is the number of…", "protons", ["neutrons", "shells", "electrons plus neutrons"], "Each element has its own number of protons."),
  q(1, "How many electrons can the first shell hold?", "2", ["4", "8", "18"], "The first shell holds up to 2, and the second and third hold up to 8 for the first 20 elements."),
  q(2, "Which two particles have about the same mass?", "proton and neutron", ["proton and electron", "neutron and electron", "all three have the same mass"], "A proton or neutron is about 1836 times heavier than an electron."),
  q(2, "Which particle has a mass that is very small compared with the others?", "electron", ["proton", "neutron", "nucleus"], "Almost all of an atom's mass is in its nucleus."),
  q(2, "A neutral atom has the same number of…", "protons and electrons", ["protons and neutrons", "neutrons and electrons", "shells and protons"], "Equal positive and negative charges cancel."),
  q(2, "An atom's mass number is the number of…", "protons plus neutrons", ["protons only", "electrons only", "shells"], "Electrons add almost no mass."),
  q(2, "In Rutherford's gold foil experiment, most particles passed straight through. What did this show?", "Atoms are mostly empty space", ["Atoms are solid spheres", "Atoms have no charge", "Electrons are in the nucleus"], "If atoms were solid, many more particles would have been blocked."),
  q(2, "In Rutherford's gold foil experiment, a few particles bounced back. What did this show?", "There is a small, dense, positively charged nucleus", ["Atoms have no nucleus", "Electrons are heavy", "Gold atoms are neutral spheres of pudding"], "Only something small, heavy and positive would repel the particles."),
  q(2, "Thomson's 'plum pudding' model pictured…", "electrons scattered through a positive sphere", ["a tiny nucleus with orbiting electrons", "indivisible solid spheres", "electrons only in fixed shells"], "Thomson's cathode ray experiments showed that atoms contain negative particles."),
  q(2, "Dalton's model of the atom pictured atoms as…", "tiny solid spheres that cannot be divided", ["a nucleus surrounded by shells", "a positive sphere with electrons inside", "clouds of electrons only"], "Dalton's model explained why elements combine in fixed ratios."),
  q(2, "What did Bohr add to the model of the atom?", "Electrons move in specific energy levels around the nucleus", ["Atoms are solid spheres", "The nucleus is neutral", "Electrons have no mass"], "The Bohr model arranges electrons in shells."),
  q(3, "Why do scientists keep revising the model of the atom?", "New experimental evidence does not fit the older model", ["Because older models were never tested", "Because atoms keep changing size", "Because models are never useful"], "A model is useful until evidence shows it needs to be improved."),
  q(3, "Why is almost all of an atom's mass in its nucleus?", "Protons and neutrons are far heavier than electrons", ["The electrons are heavier than protons", "The nucleus is empty", "The shells weigh the most"], "Over 99.9% of an atom's mass is in its nucleus."),
  q(3, "Carbon-12 and carbon-14 both have 6 protons. How do they differ?", "They have different numbers of neutrons", ["They have different numbers of protons", "They have different numbers of shells", "They are different elements"], "Atoms of the same element with different numbers of neutrons are isotopes."),
];

function neutronsQ(): Question {
  const e = pick(ELEMENTS.filter((x) => x.z > 2 && x.z !== 19));
  return typeIn(`${cap(e.name)} (${e.symbol}) has atomic number ${e.z} and mass number ${e.mass}. How many neutrons are in the nucleus of one atom?`, e.mass - e.z, `Neutrons = mass number − atomic number = ${e.mass} − ${e.z} = ${e.mass - e.z}.`);
}

function arrangementQ(): Question {
  const e = pick(ELEMENTS.filter((x) => x.z >= 3));
  const wrongs = shuffle([-2, -1, 1, 2].map((d) => e.z + d).filter((z) => z >= 1 && z <= 20 && arrangement(z) !== arrangement(e.z)))
    .map(arrangement)
    .filter((a, i, all) => all.indexOf(a) === i)
    .slice(0, 3);
  return textChoice(
    `Which shows the electrons in each shell (Bohr–Rutherford) of a neutral ${e.name} atom (atomic number ${e.z})?`,
    arrangement(e.z),
    wrongs,
    `A neutral atom has ${e.z} electrons. Fill the shells in order: 2, then 8, then 8. That gives ${arrangement(e.z)}.`,
  );
}

function protonsFromShellsQ(): Question {
  const z = randInt(3, 20);
  return typeIn(`A neutral atom has electrons arranged ${arrangement(z)}. How many protons are in its nucleus?`, z, `Add the electrons: ${shells(z).join(" + ")} = ${z}. A neutral atom has the same number of protons.`);
}

function whichElementQ(): Question {
  const e = pick(ELEMENTS.filter((x) => x.z >= 3 && x.z <= 18));
  const wrongs = ELEMENTS.filter((x) => x.z >= 3 && x.z <= 18 && x.z !== e.z && Math.abs(x.z - e.z) <= 4).slice(0, 4);
  return textChoice(
    `A neutral atom has ${e.z} protons. Which element is it?`,
    cap(e.name),
    sample(wrongs, 3).map((w) => cap(w.name)),
    `The number of protons is the atomic number. Atomic number ${e.z} is ${e.name} (${e.symbol}).`,
  );
}

function atoms(opts?: GenerateOptions): Question[] {
  return unitSet(ATOMS, levelOf(opts), [neutronsQ, arrangementQ, protonsFromShellsQ, whichElementQ].slice(0, levelOf(opts) === 1 ? 2 : 3));
}

// ---------- C: Periodic table ----------

const PERIODIC: Item[] = [
  q(1, "In the periodic table, a vertical column is called a…", "group (family)", ["period", "shell", "isotope"], "Groups run down. Periods run across."),
  q(1, "In the periodic table, a horizontal row is called a…", "period", ["group", "family", "ion"], "Elements in a period have the same number of electron shells."),
  q(1, "Group 18 elements, such as neon and argon, are called the…", "noble gases", ["alkali metals", "halogens", "metalloids"], "Noble gases are very unreactive."),
  q(1, "Group 1 elements, such as lithium, sodium and potassium (not hydrogen), are called the…", "alkali metals", ["noble gases", "halogens", "alkaline earth metals"], "They are soft, shiny and very reactive."),
  q(1, "Group 17 elements, such as fluorine and chlorine, are called the…", "halogens", ["alkali metals", "noble gases", "transition metals"], "Halogens are reactive non-metals."),
  q(1, "Where are the metals found on the periodic table?", "on the left and in the middle", ["only on the far right", "only in the top row", "metals are not on the table"], "Most elements are metals. Non-metals are mostly on the right."),
  q(1, "A solid is shiny, bends without breaking and conducts electricity. It is most likely a…", "metal", ["non-metal", "noble gas", "halogen gas"], "Metals are lustrous, malleable and good conductors."),
  q(1, "A solid is dull, brittle and does not conduct electricity. It is most likely a…", "non-metal", ["metal", "alkali metal", "transition metal"], "Sulphur and carbon (as coal) are examples of non-metals."),
  q(2, "Which element is a metalloid?", "silicon", ["sodium", "oxygen", "chlorine"], "Metalloids sit along the staircase between metals and non-metals and have properties of both."),
  q(2, "Which is the only common metal that is a liquid at room temperature?", "mercury", ["iron", "aluminum", "copper"], "Mercury is liquid at about 20 °C."),
  q(2, "Elements in the same group have similar chemical properties because they have…", "the same number of valence electrons", ["the same number of shells", "the same number of neutrons", "the same mass"], "Valence electrons in the outer shell control how an atom reacts."),
  q(2, "The elements in a period all have the same number of…", "electron shells", ["valence electrons", "neutrons", "protons"], "Going across a period, the outer shell fills up but the shell count stays the same."),
  q(2, "Why are noble gases mostly unreactive?", "Their outer shells are full", ["They have no electrons", "They have no protons", "They are very heavy"], "A full outer shell is stable."),
  q(2, "Mendeleev left gaps in his periodic table. Why?", "He predicted undiscovered elements with properties that fit the pattern", ["He ran out of space", "He did not know any metals", "He believed the table was finished"], "Elements such as gallium and germanium were found later, with properties he predicted."),
  q(2, "Which property do all metals share at room temperature, except mercury?", "they are solid", ["they are gases", "they are brittle", "they do not conduct"], "Most metals are solid, and mercury is the exception."),
  q(3, "Moving down Group 1 (lithium, sodium, potassium), the reactivity of the metals…", "increases", ["decreases", "stays the same", "disappears"], "The outer electron is farther from the nucleus, so it is easier to lose."),
  q(3, "Hydrogen is in the top left of the periodic table, but it is not an alkali metal. Why?", "It is a non-metal gas with different properties", ["It is a noble gas", "It has no electrons", "It is a liquid metal"], "Hydrogen has one valence electron, but its properties are not like Group 1 metals."),
  q(3, "Which pattern is shown by atomic number across the periodic table?", "It increases by one from each element to the next", ["It decreases across a period", "It is the same in a group", "It goes up by two each time"], "Each element has one more proton than the one before."),
  q(3, "Which pair is likely to have the most similar chemical properties?", "sodium and potassium", ["sodium and chlorine", "carbon and neon", "oxygen and magnesium"], "Both are in Group 1."),
];

/** The group number (1, 2 or 13 to 18) of one of the first 18 elements, from its electron shells. */
function groupOf(z: number): number {
  const v = valence(z);
  if (z === 1) return 1;
  if (z === 2) return 18;
  return v <= 2 ? v : 10 + v;
}

function groupQ(): Question {
  const e = pick(ELEMENTS.filter((x) => x.z >= 3 && x.z <= 18));
  return typeIn(`${cap(e.name)} has electrons arranged ${arrangement(e.z)}. Which group (column) number is it in?`, groupOf(e.z), `The outer shell has ${valence(e.z)} valence electrons. For this element that means Group ${groupOf(e.z)} (groups 13 to 18 have 3 to 8 valence electrons).`);
}

function periodQ(): Question {
  const e = pick(ELEMENTS.filter((x) => x.z >= 3 && x.z <= 18));
  return typeIn(`${cap(e.name)} has electrons arranged ${arrangement(e.z)}. Which period (row) is it in?`, shells(e.z).length, `The number of occupied shells is the period number: ${shells(e.z).length}.`);
}

function whoQ(): Question {
  const e = pick(ELEMENTS.filter((x) => x.z >= 3 && x.z <= 18));
  const sh = shells(e.z).length;
  const wrongs = ELEMENTS.filter((x) => x.z >= 3 && x.z <= 18 && x.z !== e.z && !(shells(x.z).length === sh) && !(valence(x.z) === valence(e.z))).slice(0, 3);
  return textChoice(
    `Which element has ${sh} electron shells and ${valence(e.z)} valence electron${valence(e.z) === 1 ? "" : "s"}?`,
    cap(e.name),
    sample(wrongs, 3).map((w) => cap(w.name)),
    `${sh} shells puts it in period ${sh}, and ${valence(e.z)} valence electron${valence(e.z) === 1 ? "" : "s"} places it in group ${groupOf(e.z)}: that is ${e.name}.`,
  );
}

function periodic(opts?: GenerateOptions): Question[] {
  return unitSet(PERIODIC, levelOf(opts), [groupQ, periodQ, whoQ].slice(0, levelOf(opts) === 1 ? 2 : 3));
}

// ---------- C: Compounds and properties ----------

const COMPOUNDS: Item[] = [
  q(1, "A pure substance made of only one kind of atom is a(n)…", "element", ["compound", "mixture", "solution"], "Oxygen, iron and gold are elements."),
  q(1, "A compound is…", "two or more elements chemically joined in a fixed ratio", ["two substances stirred together", "a single kind of atom", "any liquid"], "Water, H₂O, always has 2 hydrogen atoms for every oxygen atom."),
  q(1, "Which is a compound?", "carbon dioxide", ["oxygen gas", "gold", "helium"], "CO₂ has two different elements chemically joined."),
  q(1, "Which is an element?", "copper", ["water", "table salt", "sugar"], "Copper is made of one kind of atom."),
  q(1, "What is the chemical formula for water?", "H₂O", ["HO₂", "H₂O₂", "OH"], "Two hydrogen atoms and one oxygen atom."),
  q(1, "Table salt has the formula NaCl. Which elements does it contain?", "sodium and chlorine", ["nitrogen and carbon", "sodium and calcium", "neon and chlorine"], "Na stands for sodium and Cl for chlorine."),
  q(1, "Which is a physical property?", "melting point", ["flammability", "rusting", "reacting with acid"], "A physical property can be observed without changing the substance into a new one."),
  q(1, "Which is a chemical property?", "flammability (burns in air)", ["colour", "density", "melting point"], "A chemical property describes how a substance changes into a new substance."),
  q(2, "In the formula CO₂, what does the small 2 mean?", "There are two oxygen atoms in each molecule", ["There are two carbon atoms", "There are two molecules", "The charge is 2"], "A subscript tells how many atoms of the element before it."),
  q(2, "Which is a sign of a chemical change?", "bubbles of new gas form when vinegar is added to baking soda", ["ice melts", "sugar dissolves in tea", "water boils"], "Melting, dissolving and boiling are physical changes. A new gas means a new substance."),
  q(2, "Which is a physical change?", "ice melting", ["wood burning", "iron rusting", "milk turning sour"], "The substance is still water, only in a new state."),
  q(2, "Rust is mainly iron oxide. How does it form?", "Iron reacts with oxygen and water", ["Iron melts in air", "Iron dissolves in water", "Iron cools quickly"], "Rusting is a chemical change that makes a new substance."),
  q(2, "What is limewater used to test for?", "carbon dioxide, which turns it cloudy", ["oxygen, which relights a splint", "hydrogen, which makes a pop", "water, which turns it blue"], "Bubbling CO₂ through limewater makes calcium carbonate, which looks cloudy."),
  q(2, "Baking soda is NaHCO₃. How many different elements does it contain?", "4", ["3", "6", "2"], "Sodium, hydrogen, carbon and oxygen."),
  q(2, "Chlorine bleach and ammonia cleaners should never be mixed because…", "they can react to make a toxic gas", ["they make a stronger cleaner", "they form harmless water", "they turn into a solid"], "Always read the label and the WHMIS hazard symbols on household products."),
  q(2, "Aluminum foil is easy to shape into a sheet without breaking. This property is called…", "malleability", ["brittleness", "flammability", "solubility"], "Malleable materials can be hammered or rolled into thin sheets."),
  q(2, "Why does ice float on a lake?", "Ice is less dense than liquid water", ["Ice is heavier than water", "Ice is hotter than water", "Ice has no particles"], "Water expands as it freezes, so ice is less dense."),
  q(3, "Why is it important for lake life that ice floats?", "A layer of ice on top insulates the water below, so organisms can survive the winter", ["The ice sinks and warms the lake", "The ice removes oxygen from the lake", "The ice makes fish heavier"], "If ice sank, lakes could freeze solid from the bottom up."),
  q(3, "A mixture of sand and salt is separated by adding water, filtering and evaporating. This works because…", "salt dissolves in water but sand does not", ["sand dissolves in water", "salt burns in water", "both dissolve in water"], "A mixture can be separated using differences in physical properties, such as solubility."),
  q(3, "Why are copper and aluminum used in electrical wires?", "They conduct electricity well and can be drawn into wires", ["They are brittle", "They are insulators", "They are gases"], "Metals are good conductors and ductile, which means they can be drawn out."),
  q(3, "A student says, 'Burning a candle is only a physical change because the wax disappears.' What is wrong with this?", "The wax reacts with oxygen to make new substances, such as carbon dioxide and water", ["Nothing is wrong", "Candles do not contain wax", "Burning needs no oxygen"], "New substances form, so it is a chemical change."),
];

const PROP_SORT: SortSet = {
  prompt: "Physical or chemical property? Sort each.",
  hint: "A physical property can be seen or measured without making a new substance. A chemical property describes how a substance reacts or changes into a new one.",
  bins: [
    { id: "physical", label: "Physical property", emoji: "📏" },
    { id: "chemical", label: "Chemical property", emoji: "🧪" },
  ],
  items: [
    { label: "Copper conducts electricity", emoji: "🔌", bin: "physical" },
    { label: "Gold is malleable", emoji: "🥇", bin: "physical" },
    { label: "Water boils at 100 °C", emoji: "♨️", bin: "physical" },
    { label: "Salt dissolves in water", emoji: "🧂", bin: "physical" },
    { label: "Iron rusts in damp air", emoji: "🟤", bin: "chemical" },
    { label: "Wood burns", emoji: "🔥", bin: "chemical" },
    { label: "Silver tarnishes", emoji: "⚫", bin: "chemical" },
    { label: "Baking soda reacts with vinegar", emoji: "⚗️", bin: "chemical" },
  ],
};

const ELEMENT_SORT: SortSet = {
  prompt: "Element or compound? Sort each formula.",
  hint: "An element has one kind of atom in its formula. A compound has two or more different elements.",
  bins: [
    { id: "element", label: "Element", emoji: "⚛️" },
    { id: "compound", label: "Compound", emoji: "🧪" },
  ],
  items: [
    { label: "O₂ (oxygen gas)", emoji: "💨", bin: "element" },
    { label: "Fe (iron)", emoji: "🔩", bin: "element" },
    { label: "Au (gold)", emoji: "🥇", bin: "element" },
    { label: "N₂ (nitrogen gas)", emoji: "🌬️", bin: "element" },
    { label: "H₂O (water)", emoji: "💧", bin: "compound" },
    { label: "NaCl (table salt)", emoji: "🧂", bin: "compound" },
    { label: "CO₂ (carbon dioxide)", emoji: "🌫️", bin: "compound" },
    { label: "CH₄ (methane)", emoji: "🔥", bin: "compound" },
  ],
};

const FORMULAS: [string, string, number][] = [
  ["H₂O", "water", 3],
  ["CO₂", "carbon dioxide", 3],
  ["NH₃", "ammonia", 4],
  ["CH₄", "methane", 5],
  ["C₂H₆", "ethane", 8],
  ["H₂SO₄", "sulphuric acid", 7],
  ["NaHCO₃", "baking soda", 6],
  ["CaCO₃", "limestone", 5],
  ["C₆H₁₂O₆", "glucose", 24],
];

function formulaAtomsQ(): Question {
  const [f, name, total] = pick(FORMULAS);
  return typeIn(`How many atoms are in one unit of ${name}, ${f}?`, total, `Add the subscripts, counting a missing subscript as 1, in ${f}. The total is ${total}.`);
}

function densityQ(): Question {
  const rho = pick([0.5, 0.8, 1.2, 2.5, 2.7, 7.8, 8.9]);
  const v = pick([2, 4, 5, 10, 20]);
  const m = Math.round(rho * v * 10) / 10;
  return typeIn(`A sample has a mass of ${m} g and a volume of ${v} cm³. What is its density in g/cm³?`, rho, `Density = mass ÷ volume = ${m} ÷ ${v} = ${rho} g/cm³.`, undefined, { keypad: "decimal", suffix: "g/cm³" });
}

function floatQ(): Question {
  const mats: [string, number][] = [["pine wood", 0.5], ["ice", 0.9], ["cooking oil", 0.9], ["aluminum", 2.7], ["iron", 7.9], ["copper", 9.0], ["a rock", 2.6], ["cork", 0.2]];
  const [name, rho] = pick(mats);
  const floats = rho < 1;
  return textChoice(
    `Water has a density of 1.0 g/cm³. A sample of ${name} has a density of ${rho} g/cm³. In water it will…`,
    floats ? "float" : "sink",
    [floats ? "sink" : "float"],
    "A material floats if its density is less than the liquid's density, and sinks if it is greater.",
  );
}

function compounds(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const makers: Maker[] = [formulaAtomsQ, densityQ, floatQ, () => sortQuestion(pick([PROP_SORT, ELEMENT_SORT]), 3)];
  return unitSet(COMPOUNDS, level, level === 1 ? makers.slice(0, 1).concat(makers.slice(2)) : makers);
}

// ---------- D: Static electricity and conductivity ----------

const STATIC: Item[] = [
  q(1, "Charges that are the same…", "repel each other", ["attract each other", "cancel out completely", "have no effect"], "Like charges repel. Opposite charges attract."),
  q(1, "Opposite charges…", "attract each other", ["repel each other", "have no effect", "turn into neutrons"], "A positive and a negative charge pull toward each other."),
  q(1, "A neutral object has…", "equal amounts of positive and negative charge", ["only positive charge", "only negative charge", "no atoms"], "The charges balance, so there is no net charge."),
  q(1, "Which particles move when objects are charged by rubbing?", "electrons", ["protons", "neutrons", "nuclei"], "Protons are locked in the nucleus of each atom. Outer electrons can be transferred."),
  q(1, "An object that gains electrons becomes…", "negatively charged", ["positively charged", "neutral", "a different element"], "More electrons than protons gives a net negative charge."),
  q(1, "An object that loses electrons becomes…", "positively charged", ["negatively charged", "neutral", "lighter than air"], "Fewer electrons than protons gives a net positive charge."),
  q(1, "Which is a good electrical conductor?", "copper", ["rubber", "dry wood", "plastic"], "Metals have electrons that move freely."),
  q(1, "Which is an electrical insulator?", "rubber", ["copper", "silver", "aluminum"], "Insulators hold their electrons tightly."),
  q(2, "A plastic rod is rubbed with wool and becomes negatively charged. What happened?", "Electrons moved from the wool to the rod", ["Protons moved from the wool to the rod", "Electrons moved from the rod to the wool", "New charges were created"], "The wool lost electrons, so it is positive. Charge is moved, not created."),
  q(2, "Why do metals conduct electricity well?", "They have electrons that are free to move", ["They have no electrons", "Their protons move", "They are always hot"], "The outer electrons of metal atoms are loosely held."),
  q(2, "Why do insulators like plastic and glass not conduct well?", "Their electrons are held tightly and cannot move freely", ["They have no atoms", "They have only protons", "They are too heavy to move"], "Charge cannot flow easily through them."),
  q(2, "A charged balloon sticks to a neutral wall. Why?", "The balloon's charge causes opposite charge to gather at the wall's surface", ["The wall is a magnet", "Gravity pulls the balloon", "The wall is also charged the same"], "Charges in the wall shift (induction), so there is attraction."),
  q(2, "Two balloons are rubbed on hair and hung side by side. They move apart. Why?", "They have the same charge and repel", ["They have opposite charges and attract", "They are neutral", "They are made of different materials"], "Both took electrons from hair, so both are negative."),
  q(2, "Charging by contact (conduction) happens when…", "a charged object touches a neutral one and charge transfers", ["two neutral objects are far apart", "a magnet is moved", "a rod is heated"], "Electrons move between the objects during touch."),
  q(2, "Why do lightning rods have a wire to the ground?", "To carry the electric charge safely into the Earth", ["To attract more clouds", "To store the charge in the rod", "To stop thunder"], "Grounding gives charge a safe path."),
  q(2, "Which is the safest place during a thunderstorm?", "inside a building or a hard-topped vehicle", ["under a lone tree", "in an open field", "in a lake or pool"], "Lightning finds the tallest or most conductive path."),
  q(2, "An electrical cord has copper wire inside and plastic outside. Why?", "Copper conducts the current, and plastic insulates to keep people safe", ["Plastic carries the current and copper insulates", "Both materials conduct equally", "The plastic makes the copper heavier"], "Use conductors where current must flow and insulators to stop it reaching people."),
  q(3, "A charged electroscope's leaves spread apart. Why?", "The leaves have the same charge and repel each other", ["The leaves have opposite charges", "The leaves are neutral", "Gravity pushes them apart"], "The charge spreads across the metal rod and leaves."),
  q(3, "Why does a spark jump when you touch a metal doorknob after walking on carpet?", "Built-up charge rapidly flows to the neutral metal", ["The carpet loses its protons", "The doorknob makes electrons", "Static electricity is created from nothing"], "Charge you gained from the carpet discharges."),
  q(3, "Why are electrons, and not protons, transferred between solids when they are rubbed?", "Electrons are outside the nucleus, and protons are held in it", ["Protons are lighter than electrons", "Neutrons carry the charge", "Protons have no charge"], "Only outer electrons can easily leave an atom."),
];

function netChargeQ(): Question {
  const p = randInt(10, 40);
  const e = p + randInt(-6, 6);
  const state = e === p ? "neutral" : e > p ? "negatively charged" : "positively charged";
  return textChoice(
    `An object has ${p} protons and ${e} electrons. Which describes it?`,
    state,
    ["neutral", "negatively charged", "positively charged"].filter((s) => s !== state),
    e === p ? "Equal protons and electrons means no net charge." : e > p ? "More electrons than protons gives a net negative charge." : "Fewer electrons than protons gives a net positive charge.",
  );
}

function electronsLeftQ(): Question {
  const n = randInt(12, 40);
  const lost = randInt(2, 7);
  return typeIn(`A neutral object has ${n} protons and ${n} electrons. It loses ${lost} electrons. How many electrons does it have now?`, n - lost, `${n} − ${lost} = ${n - lost}. It now has more protons than electrons, so it is positively charged.`);
}

function staticCharges(opts?: GenerateOptions): Question[] {
  return unitSet(STATIC, levelOf(opts), [netChargeQ, electronsLeftQ]);
}

// ---------- D: Circuits ----------

const CIRCUITS: Item[] = [
  q(1, "What is electric current?", "the flow of electric charge", ["stored energy", "the push on charge", "the opposition to flow"], "Current is measured in amperes (A) and given the symbol I."),
  q(1, "What is the SI unit of electric current?", "ampere (A)", ["volt (V)", "ohm (Ω)", "watt (W)"], "Current is measured with an ammeter."),
  q(1, "What is the SI unit of potential difference (voltage)?", "volt (V)", ["ampere (A)", "ohm (Ω)", "joule (J)"], "Potential difference is the energy given to each unit of charge. Its symbol is V."),
  q(1, "What is the SI unit of resistance?", "ohm (Ω)", ["volt (V)", "ampere (A)", "watt (W)"], "Resistance is the opposition to the flow of charge. Its symbol is R."),
  q(1, "In a circuit, what is the job of the battery (source)?", "to give energy to the charges", ["to use up charge", "to reduce the current to zero", "to open the circuit"], "A battery supplies a potential difference."),
  q(1, "In a circuit, what is the job of a switch?", "to open or close the path for current", ["to supply energy", "to measure voltage", "to increase resistance forever"], "An open switch breaks the circuit, so current stops."),
  q(1, "A bulb in a circuit is called a…", "load", ["source", "switch", "conductor"], "The load changes electrical energy into another form, such as light."),
  q(2, "How is an ammeter connected in a circuit?", "in series with the part being measured", ["in parallel with the part being measured", "outside the circuit", "across the battery only"], "Current must flow through the ammeter."),
  q(2, "How is a voltmeter connected in a circuit?", "in parallel across the part being measured", ["in series with the part being measured", "between the battery and the switch only", "it is not connected"], "A voltmeter compares the potential at two points."),
  q(2, "Which equation is Ohm's law?", "V = I × R", ["V = I + R", "V = R ÷ I", "I = V × R"], "Potential difference equals current times resistance."),
  q(2, "In a series circuit, if one bulb burns out, the others…", "go out too", ["stay lit", "get brighter", "flicker only"], "A series circuit has one path, so a break stops all current."),
  q(2, "In a parallel circuit, if one bulb burns out, the others…", "stay lit", ["go out too", "get dimmer for good", "explode"], "Each branch is its own path to the battery."),
  q(2, "A longer wire of the same material and thickness has…", "more resistance", ["less resistance", "the same resistance", "no resistance"], "Charges meet more obstacles in a longer wire."),
  q(2, "A thicker wire of the same material and length has…", "less resistance", ["more resistance", "the same resistance", "infinite resistance"], "A wider wire gives charge more room to flow."),
  q(2, "Why are homes wired in parallel?", "Each device gets the full voltage and works independently", ["so one switch controls everything", "to use less wire", "so all devices share the same current"], "A device can be turned off without affecting the others."),
  q(3, "A circuit's voltage stays the same and the resistance is doubled. What happens to the current?", "It is cut in half", ["It doubles", "It stays the same", "It becomes zero"], "I = V ÷ R, so doubling R halves I."),
  q(3, "Why does a fuse or circuit breaker matter?", "It opens the circuit if the current gets dangerously large", ["It increases the voltage", "It stores charge", "It makes bulbs brighter"], "Too much current can overheat wires."),
  q(3, "Which part of a circuit diagram would you add to measure current through one bulb?", "an ammeter in series with the bulb", ["a voltmeter in series", "a second battery in parallel", "an extra switch"], "Current is the same at every point in a series path, so measure it in line."),
];

function ohmQ(): Question {
  const r = randInt(2, 12);
  const i = randInt(1, 8);
  const v = r * i;
  switch (randInt(0, 2)) {
    case 0:
      return typeIn(`A circuit has a current of ${i} A through a resistance of ${r} Ω. What is the potential difference across it, in volts?`, v, `V = I × R = ${i} × ${r} = ${v} V.`, undefined, { suffix: "V" });
    case 1:
      return typeIn(`A ${v} V battery is connected across a ${r} Ω resistor. What is the current, in amperes?`, i, `I = V ÷ R = ${v} ÷ ${r} = ${i} A.`, undefined, { suffix: "A" });
    default:
      return typeIn(`A device has ${v} V across it and a current of ${i} A. What is its resistance, in ohms?`, r, `R = V ÷ I = ${v} ÷ ${i} = ${r} Ω.`, undefined, { suffix: "Ω" });
  }
}

function decimalCurrentQ(): Question {
  const pairs: [number, number, number][] = [[3, 2, 1.5], [9, 6, 1.5], [6, 4, 1.5], [5, 4, 1.25], [12, 8, 1.5], [3, 5, 0.6], [9, 10, 0.9], [6, 5, 1.2]];
  const [v, r, i] = pick(pairs);
  return typeIn(`A ${v} V source is connected to a ${r} Ω resistor. What is the current, in amperes?`, i, `I = V ÷ R = ${v} ÷ ${r} = ${i} A.`, undefined, { keypad: "decimal", suffix: "A" });
}

function seriesQ(): Question {
  const total = randInt(8, 24);
  const a = randInt(2, total - 3);
  switch (randInt(0, 2)) {
    case 0: {
      const b = randInt(2, 12);
      return typeIn(`Two resistors of ${a} Ω and ${b} Ω are connected in series. What is the total resistance, in ohms?`, a + b, `In series the resistances add: ${a} + ${b} = ${a + b} Ω.`, undefined, { suffix: "Ω" });
    }
    case 1:
      return typeIn(`Two bulbs are in series across a ${total} V battery. The potential difference across the first is ${a} V. What is it across the second, in volts?`, total - a, `In series the voltages add to the source voltage: ${total} − ${a} = ${total - a} V.`, undefined, { suffix: "V" });
    default: {
      const i = randInt(1, 6);
      return typeIn(`Two bulbs are in series. The current through the first is ${i} A. What is the current through the second, in amperes?`, i, "In a series circuit there is only one path, so the current is the same everywhere.", undefined, { suffix: "A" });
    }
  }
}

function parallelQ(): Question {
  const a = randInt(1, 5);
  const b = randInt(1, 5);
  if (randInt(0, 1) === 0) {
    return typeIn(`Two branches of a parallel circuit carry ${a} A and ${b} A. What is the current in the main wire before the branches, in amperes?`, a + b, `The branch currents add: ${a} + ${b} = ${a + b} A.`, undefined, { suffix: "A" });
  }
  const v = pick([3, 6, 9, 12]);
  return typeIn(`Two bulbs are connected in parallel across a ${v} V battery. What is the potential difference across each bulb, in volts?`, v, "Each branch of a parallel circuit has the same potential difference as the source.", undefined, { suffix: "V" });
}

function circuits(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const makers: Maker[] = [ohmQ, ohmQ, seriesQ, parallelQ];
  if (level === 3) makers[1] = decimalCurrentQ;
  return unitSet(CIRCUITS, level, makers);
}

// ---------- D: Electrical energy ----------

const ENERGY: Item[] = [
  q(1, "Which is the SI unit of energy?", "joule (J)", ["watt (W)", "volt (V)", "ampere (A)"], "A watt is a joule per second. It measures power."),
  q(1, "The electrical energy used in homes is often measured in…", "kilowatt-hours (kWh)", ["kilograms", "newtons", "metres per second"], "1 kWh is the energy used by a 1 kW device in 1 hour."),
  q(1, "A solar cell changes…", "light energy to electrical energy", ["electrical energy to light", "sound to heat", "heat to sound"], "A solar cell is a source, not a load."),
  q(1, "An electric kettle mainly changes…", "electrical energy to thermal energy", ["electrical energy to sound", "chemical energy to light", "thermal energy to electrical energy"], "Heating elements turn electrical energy into heat."),
  q(1, "An electric motor mainly changes…", "electrical energy to kinetic energy", ["kinetic energy to light", "light to electrical energy", "chemical energy to sound"], "Motors power fans, washing machines and electric vehicles."),
  q(1, "Which source of electricity is renewable?", "flowing water (hydroelectric)", ["coal", "natural gas", "uranium"], "Rivers are refilled by the water cycle."),
  q(2, "What is the difference between electricity and electrical energy?", "Electricity is the presence and flow of charge, and electrical energy is the energy the charge carries", ["They are the same thing", "Electricity is energy and electrical energy is charge", "Electrical energy is only stored in batteries"], "Charges carry energy from the source to the load."),
  q(2, "Why does an LED bulb have a higher efficiency than an incandescent bulb?", "It changes more of its electrical energy into light and less into heat", ["It uses no electrical energy", "It changes all its electrical energy into heat", "It is brighter because it is bigger"], "An incandescent bulb wastes most of its energy as thermal energy."),
  q(2, "Efficiency is the ratio of…", "useful energy output to total energy input", ["total energy to useful energy", "voltage to current", "power to time"], "Efficiency = useful output ÷ total input × 100%."),
  q(2, "Hydroelectric dams provide renewable power. What is one challenge they can cause?", "They can flood land and change river habitats for fish and communities", ["They burn uranium to heat steam", "They need coal to run", "They cannot make electricity"], "Every source has benefits and costs."),
  q(2, "Why is wind power not available all the time?", "The wind does not always blow, so backup sources or storage are needed", ["Wind turbines make no energy", "The Sun must shine", "Wind uses coal"], "Wind and solar are variable (intermittent) sources."),
  q(2, "Nuclear power plants do not release carbon dioxide while operating. What is a challenge of using them?", "They produce radioactive waste that must be stored safely for a very long time", ["They use coal", "They need constant wind", "They release large amounts of methane"], "Nuclear power has low emissions but needs careful long-term waste management."),
  q(2, "Why do time-of-use electricity prices help the electrical system?", "They encourage people to use less power at times of high demand", ["They make power free", "They stop people using power", "They increase peak demand"], "Moving laundry or dishwashing to off-peak hours lowers peak demand."),
  q(2, "Which action saves the most electrical energy over a year?", "replacing old incandescent bulbs with LEDs", ["leaving lights on", "buying a bigger TV", "running a fan in an empty room"], "Efficient devices give the same service with less energy."),
  q(2, "A remote northern community relies on diesel generators. How can solar panels and battery storage help?", "They reduce diesel use, lowering costs and emissions", ["They make diesel more expensive", "They stop all electricity", "They need more diesel"], "Many remote communities are adding renewable power to cut fuel use."),
  q(3, "A battery stores energy. What kind of energy is stored in it?", "chemical energy", ["kinetic energy", "light energy", "sound energy"], "A battery changes chemical energy to electrical energy when used."),
  q(3, "Why can big batteries make wind and solar power more useful?", "They store extra energy for times when the wind is calm or the Sun is down", ["They make the Sun shine longer", "They stop turbines turning", "They make fossil fuels necessary"], "Storage helps match supply to demand."),
  q(3, "A smart grid uses sensors and data. What is one benefit?", "It helps match supply and demand and find outages faster", ["It increases the use of coal", "It removes the need for wires", "It removes all risks"], "Emerging technologies can improve conservation but raise questions about cost and privacy."),
  q(3, "Why is it fair to say no electricity source has zero environmental impact?", "Making and building equipment, mining materials and land use all have effects", ["Because all sources burn fuel", "Because renewable sources always cost more", "Because impacts are never measured"], "Compare the life cycle of each source, not just how it runs."),
];

function jouleQ(): Question {
  const w = pick([20, 40, 60, 75, 100, 150]);
  const s = pick([5, 10, 20, 30, 60]);
  return typeIn(`A ${w} W bulb is on for ${s} s. How much electrical energy does it use, in joules? (E = P × t)`, w * s, `E = P × t = ${w} × ${s} = ${w * s} J.`, undefined, { suffix: "J" });
}

function kwhQ(): Question {
  const kw = pick([1, 2, 3]);
  const h = pick([2, 3, 4, 5, 6]);
  return typeIn(`A ${kw} kW heater runs for ${h} hours. How many kilowatt-hours of energy does it use?`, kw * h, `kWh = kW × hours = ${kw} × ${h} = ${kw * h} kWh.`, undefined, { suffix: "kWh" });
}

function costQ(): Question {
  const kwh = pick([4, 6, 8, 10, 12, 20]);
  const rate = pick([10, 15]);
  return typeIn(`Electricity costs ${rate}¢ per kWh. A device uses ${kwh} kWh. What is the cost, in cents?`, kwh * rate, `Cost = ${kwh} × ${rate}¢ = ${kwh * rate}¢.`, undefined, { suffix: "¢" });
}

function efficiencyQ(): Question {
  const input = pick([100, 200, 400, 500]);
  const pct = pick([20, 25, 40, 50, 60, 80]);
  const useful = (input * pct) / 100;
  return typeIn(`A device takes in ${input} J of electrical energy and gives out ${useful} J of useful energy. What is its efficiency, as a percent?`, pct, `Efficiency = useful ÷ input × 100 = ${useful} ÷ ${input} × 100 = ${pct}%.`, undefined, { suffix: "%" });
}

function electricalEnergy(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const makers: Maker[] = level === 1 ? [kwhQ, jouleQ] : [kwhQ, level === 2 ? jouleQ : costQ, efficiencyQ];
  return unitSet(ENERGY, level, makers);
}

// ---------- E: The Sun, solar system and universe ----------

const SPACE: Item[] = [
  q(1, "What is the Sun?", "a star at the centre of our solar system", ["a planet", "a moon", "a comet"], "The Sun is a star that gives off light and heat."),
  q(1, "What process in the Sun's core makes its energy?", "nuclear fusion", ["burning coal", "chemical rusting", "wind"], "Hydrogen nuclei fuse into helium and release energy."),
  q(1, "Which planet is the largest?", "Jupiter", ["Earth", "Mars", "Venus"], "Jupiter is a gas giant bigger than all the other planets combined."),
  q(1, "Which planet is closest to the Sun?", "Mercury", ["Venus", "Mars", "Neptune"], "Mercury's orbit is the smallest."),
  q(1, "The four inner planets are…", "rocky (terrestrial)", ["gas giants", "all ice", "made of the Sun"], "Mercury, Venus, Earth and Mars have solid surfaces."),
  q(1, "What causes day and night on Earth?", "Earth rotating on its axis", ["Earth orbiting the Sun in a day", "the Moon blocking the Sun", "the Sun spinning around Earth"], "Rotation takes about 24 hours."),
  q(1, "What are the northern lights (aurora borealis)?", "light made when charged particles from the Sun hit gases in Earth's atmosphere", ["reflections from the Moon", "lightning in clouds", "light from distant cities"], "Earth's magnetic field guides the particles toward the poles."),
  q(2, "The Sun's energy makes winds on Earth. How?", "It heats land and water unevenly, so air moves", ["It pushes the air directly", "It cools the air", "It stops air from moving"], "Warm air rises and cooler air flows in. That wind can turn turbines."),
  q(2, "How does the Sun's energy drive the water cycle?", "It heats water so that it evaporates", ["It makes water denser", "It freezes the oceans", "It changes water into carbon"], "Evaporated water later condenses and falls, which feeds rivers used for hydroelectric power."),
  q(2, "The Sun makes up about what part of the solar system's mass?", "99.8%", ["50%", "10%", "1%"], "Almost all of the mass is in the Sun."),
  q(2, "Why is it warmer in summer than in winter in Ontario?", "Earth's axis is tilted, so the Sun's rays are more direct and days are longer", ["Earth is closer to the Sun in summer", "The Sun gets hotter in June", "The Moon heats Earth"], "Earth's tilt is about 23.5°. Earth is actually slightly farther from the Sun in July."),
  q(2, "In a solar eclipse…", "the Moon passes between the Sun and Earth", ["Earth passes between the Sun and Moon", "the Sun turns off", "a planet passes in front of the Moon"], "The Moon's shadow falls on part of Earth."),
  q(2, "In a lunar eclipse…", "Earth passes between the Sun and the Moon", ["the Moon passes between the Sun and Earth", "the Sun is hidden by Venus", "the Moon moves out of orbit"], "Earth's shadow falls on the Moon."),
  q(2, "The Bay of Fundy has some of the world's highest tides. What mainly causes ocean tides?", "the gravitational pull of the Moon (and the Sun)", ["wind alone", "Earth's magnetic field", "ocean temperature only"], "The Moon's gravity pulls on the oceans."),
  q(2, "Which is the best definition of a light-year?", "the distance light travels in one year", ["the time light takes to go around Earth", "one year of sunlight", "the speed of light"], "A light-year is a distance, about 9.5 trillion km."),
  q(2, "Between which two planets is the main asteroid belt?", "Mars and Jupiter", ["Earth and Mars", "Saturn and Uranus", "Venus and Earth"], "It is a region of rocky bodies orbiting the Sun."),
  q(2, "The Milky Way is…", "the galaxy that contains our solar system", ["a planet", "the Moon's other name", "the same as the solar system"], "A galaxy is a huge group of stars, gas and dust held together by gravity."),
  q(2, "Which is the biggest: a planet, a star, a galaxy or the solar system?", "a galaxy", ["a planet", "a star", "the solar system"], "A galaxy holds billions of stars, and each star may have its own planets."),
  q(2, "Canadarm2 on the International Space Station was built in Canada. Its main job is to…", "move equipment and help astronauts work outside the station", ["power the Sun", "launch rockets from Earth", "take photos of Earth only"], "Canada's space robotics are used around the world."),
  q(2, "RADARSAT satellites help Canadians by…", "mapping sea ice, floods and land from space", ["producing electricity for homes", "carrying astronauts", "listening to distant galaxies"], "Satellite imagery helps monitor wildfires, floods and ice, and supports climate research."),
  q(3, "Redshift of light from distant galaxies is evidence that…", "the universe is expanding", ["the universe is shrinking", "galaxies are at rest", "the Sun is cooling"], "Light from galaxies moving away is stretched to longer, redder wavelengths."),
  q(3, "The cosmic microwave background is…", "faint radiation left from the early, hot universe", ["radio from city towers", "light from the Sun's surface", "a type of aurora"], "It is evidence for the Big Bang."),
  q(3, "About how old do scientists estimate the universe is?", "13.8 billion years", ["4.6 billion years", "138 million years", "13.8 thousand years"], "4.6 billion years is the age of the solar system."),
  q(3, "How do scientists know the solar system is about 4.6 billion years old?", "by dating the oldest meteorites and rocks", ["by counting the planets", "by measuring the Sun's size", "by looking at clouds"], "Radioactive dating of meteorites gives that age."),
  q(3, "Why do astronomers use light-years or AU rather than kilometres?", "Space distances in kilometres would be huge numbers", ["Kilometres are not a unit of distance", "Light has no speed", "Planets are not far apart"], "A convenient unit keeps numbers small."),
  q(3, "Space exploration has benefits and costs. Which is a benefit?", "Satellites help track weather, climate and natural disasters", ["It makes all other research unnecessary", "It never produces any debris", "It has no cost"], "Weigh the benefits against the cost, debris and environmental impact of launches."),
  q(3, "Space debris is a concern for space exploration because…", "fast-moving fragments can damage satellites and spacecraft", ["debris cools the Sun", "debris makes the Moon bigger", "debris reduces gravity"], "Old satellites and rocket parts stay in orbit and move at very high speeds."),
  q(3, "A nebula is…", "a cloud of gas and dust where stars can form", ["a type of planet", "a spacecraft", "a comet's tail"], "Gravity pulls clumps of gas together until they form stars."),
];

function auQ(): Question {
  const au = pick([2, 3, 4, 5, 6, 8, 10, 20, 30]);
  return typeIn(`One astronomical unit (AU) is about 150 million km. An object orbits ${au} AU from the Sun. About how many million km is that?`, 150 * au, `${au} × 150 = ${150 * au} million km.`, undefined, { suffix: "M km" });
}

function scaleModelQ(): Question {
  const bodies: [string, number][] = [["Venus", 0.7], ["Earth", 1], ["Mars", 1.5], ["Jupiter", 5.2], ["Saturn", 9.5], ["Neptune", 30]];
  const [name, au] = pick(bodies);
  const perAu = 10;
  const cm = Math.round(au * perAu);
  return typeIn(
    `A model of the solar system uses ${perAu} cm for each AU. ${name} is ${au} AU from the Sun. How far from the Sun should ${name} be placed, in cm?`,
    String(cm),
    `${au} × ${perAu} = ${cm} cm.`,
    undefined,
    { keypad: "decimal", suffix: "cm" },
  );
}

function lightTimeQ(): Question {
  const k = randInt(2, 9);
  return typeIn(`Light and radio waves travel 300 000 km each second. A spacecraft is ${spaced(k * 300000)} km from Earth. How many seconds does its signal take to reach Earth?`, k, `Time = distance ÷ speed = ${spaced(k * 300000)} ÷ 300 000 = ${k} s.`, undefined, { suffix: "s" });
}

function space(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const makers: Maker[] = level === 1 ? [auQ, scaleModelQ] : [auQ, scaleModelQ, lightTimeQ];
  return unitSet(SPACE, level, makers);
}

// ---------- Units ----------

export const units: Unit[] = [
  {
    id: "stem-skills-9",
    title: "Think Like a Scientist",
    emoji: "🔬",
    blurb: "Experiments, design and safety",
    standards: on("A1.1, A1.2, A1.3, A1.4, A1.5, A2.1, A2.2, A2.5", "scientific experiments and research, the engineering design process, coding models, WHMIS and lab safety, careers and contributions to science"),
    parentNote: "Variables and fair tests, graphs and averages, the engineering design process, simple code that models a change, WHMIS and lab safety, how to check AI-generated answers, and skilled-trade and STEM careers.",
    generate: stemSkills,
  },
  {
    id: "ecosystems-9",
    title: "Ecosystems in Balance",
    emoji: "🌲",
    blurb: "Cycles, food webs and succession",
    standards: on("B2.1, B2.2, B2.4, B2.5, B2.7", "Earth's spheres, matter cycles and energy flow, biodiversity and succession, human effects on ecosystems, sustainable agriculture"),
    parentNote: "How the biosphere, hydrosphere, lithosphere and atmosphere interact, food webs and the 10% energy rule, the carbon, nitrogen, water and phosphorus cycles, succession and biodiversity, how people change ecosystems, and farming practices that protect soil and water.",
    generate: ecosystems,
  },
  {
    id: "photosynthesis-respiration-9",
    title: "Photosynthesis & Respiration",
    emoji: "🌿",
    blurb: "How cells make and use energy",
    standards: on("B2.3, B2.2", "comparing photosynthesis and cellular respiration and how they balance each other in ecosystems"),
    parentNote: "The reactants, products and location of photosynthesis and cellular respiration, why they are complementary, and how they link plants, animals and the carbon cycle.",
    generate: photosynthesis,
  },
  {
    id: "climate-change-9",
    title: "Climate Change",
    emoji: "🌡️",
    blurb: "Causes, evidence and solutions",
    standards: on("B1.1, B2.6", "causes and indicators of climate change, effects on ecosystems, and mitigation and adaptation"),
    parentNote: "The greenhouse effect, how fossil fuels and other human activities add greenhouse gases, indicators of climate change, effects on Canadian ecosystems and communities, and the difference between mitigation and adaptation. Effects on First Nations, Métis and Inuit communities are not covered yet and need community review.",
    generate: climate,
  },
  {
    id: "atoms-9",
    title: "Inside the Atom",
    emoji: "⚛️",
    blurb: "Particles, models and shells",
    standards: on("C2.2, C2.3", "evidence for atomic models, and the location, mass and charge of subatomic particles in the Bohr–Rutherford model"),
    parentNote: "Protons, neutrons and electrons, how Dalton, Thomson, Rutherford and Bohr's models changed with evidence, atomic and mass numbers, and drawing the electron shells of the first 20 elements.",
    generate: atoms,
  },
  {
    id: "periodic-table-9",
    title: "The Periodic Table",
    emoji: "🧪",
    blurb: "Groups, periods and patterns",
    standards: on("C2.4, C2.5", "how an element's position in the periodic table relates to its atoms and properties"),
    parentNote: "Groups and periods, metals, non-metals and metalloids, alkali metals, halogens and noble gases, and how valence electrons and shells explain the patterns.",
    generate: periodic,
  },
  {
    id: "compounds-9",
    title: "Elements & Compounds",
    emoji: "💧",
    blurb: "Formulas, properties and changes",
    standards: on("C2.1, C2.6, C2.7", "physical and chemical properties of elements and compounds, density, chemical formulas and household products"),
    parentNote: "Elements, compounds and mixtures, reading chemical formulas, physical and chemical properties and changes, density, and common household chemicals, including why some should never be mixed.",
    generate: compounds,
  },
  {
    id: "static-charges-9",
    title: "Static Electricity",
    emoji: "⚡",
    blurb: "Charges, conductors and insulators",
    standards: on("D2.1, D2.2", "how electric charges behave and how materials hold or transfer charge"),
    parentNote: "Positive and negative charges and the particles behind them, charging by friction, contact and induction, conductors and insulators, and electrical safety in a thunderstorm.",
    generate: staticCharges,
  },
  {
    id: "circuits-9",
    title: "Circuits & Ohm's Law",
    emoji: "🔌",
    blurb: "Current, voltage and resistance",
    standards: on("D2.3, D2.4, D2.5, D2.6", "DC circuit parts, electrical quantities and units, Ohm's law, and series and parallel circuits"),
    parentNote: "Circuit components and their jobs, current, potential difference and resistance with their symbols and SI units, calculating with V = I × R, and how current, voltage and resistance behave in series and parallel circuits.",
    generate: circuits,
  },
  {
    id: "electrical-energy-9",
    title: "Electrical Energy",
    emoji: "💡",
    blurb: "Power, efficiency and sources",
    standards: on("D1.1, D1.2, D1.3, D1.4, D2.7, D2.8", "electrical energy production and use, efficiency, energy transformations, conservation and emerging technologies"),
    parentNote: "The difference between electricity and electrical energy, energy in joules and kilowatt-hours, cost of electricity, efficiency of devices, and the benefits and challenges of sources such as hydro, wind, solar, nuclear and gas.",
    generate: electricalEnergy,
  },
  {
    id: "space-9",
    title: "Sun, Solar System & Universe",
    emoji: "🪐",
    blurb: "Our place in space",
    standards: on("E1.1, E1.2, E1.3, E2.1, E2.2, E2.3, E2.4, E2.5, E2.6", "the Sun and its energy, the solar system and universe, distances and scale, astronomical phenomena, and the impacts of space exploration"),
    parentNote: "The Sun's role on Earth, the planets and other bodies, distances in AU and light-years, seasons, eclipses, tides and the aurora, evidence for the Big Bang, and the benefits and costs of space exploration. Indigenous ways of knowing about the sky are not covered yet and need community review.",
    generate: space,
  },
];
