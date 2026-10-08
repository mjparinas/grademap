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

function ordinal(n: number): string {
  const tens = n % 100;
  if (tens >= 11 && tens <= 13) return `${n}th`;
  return `${n}${["th", "st", "nd", "rd"][n % 10] ?? "th"}`;
}

// ---------- First Farmers ----------

const HUMAN_STORY = [
  { id: "tools", label: "Early humans make the first stone tools", emoji: "🪨", when: "more than 2.5 million years ago" },
  { id: "fire", label: "Early humans learn to control fire", emoji: "🔥", when: "at least 400,000 years ago" },
  { id: "sapiens", label: "Modern humans (Homo sapiens) appear in Africa", emoji: "🧍", when: "about 300,000 years ago" },
  { id: "art", label: "People paint animals on cave walls", emoji: "🎨", when: "more than 30,000 years ago" },
  { id: "farm", label: "People begin farming in Southwest Asia", emoji: "🌾", when: "about 12,000 years ago, or 10,000 BCE" },
  { id: "city", label: "The first cities grow in Mesopotamia", emoji: "🏙️", when: "about 5,500 years ago, or 3500 BCE" },
];

function humanStoryOrder(difficulty: Level): OrderQuestion {
  const events = keepInOrder(HUMAN_STORY, difficulty + 2);
  return {
    kind: "order",
    prompt: "Put these events from the human story in order, earliest first.",
    hint: events.map((e) => `${e.label}: ${e.when}.`).join(" "),
    items: events.map((e) => ({
      id: e.id,
      label: difficulty === 1 ? `${e.label}: ${e.when}` : e.label,
      emoji: e.emoji,
    })),
  };
}

const LIFESTYLE_SORT: SortSet = {
  prompt: "Early hunter-gatherers or a farming village? Sort each way of life.",
  hint: "Most early hunter-gatherers moved to follow animals and wild plants, so they carried little. Farmers stayed in one place, built permanent homes, raised animals and stored extra food.",
  bins: [
    { id: "hunt", label: "early hunter-gatherers", emoji: "🦌" },
    { id: "farm", label: "farming village", emoji: "🌾" },
  ],
  items: [
    { label: "moving with the seasons to follow food", emoji: "🧭", bin: "hunt" },
    { label: "gathering wild berries, nuts and roots", emoji: "🫐", bin: "hunt" },
    { label: "hunting wild animals", emoji: "🐗", bin: "hunt" },
    { label: "living in small, mobile groups", emoji: "👣", bin: "hunt" },
    { label: "carrying only a few belongings", emoji: "🎒", bin: "hunt" },
    { label: "living in one place all year", emoji: "🏡", bin: "farm" },
    { label: "storing surplus grain in clay pots", emoji: "🏺", bin: "farm" },
    { label: "raising sheep and goats", emoji: "🐐", bin: "farm" },
    { label: "building permanent mud-brick houses", emoji: "🧱", bin: "farm" },
    { label: "planting and harvesting crops", emoji: "🌱", bin: "farm" },
  ],
};

const FARMING_BANK: Item[] = [
  {
    prompt: "Before farming began, how did people get their food?",
    right: "By hunting, fishing and gathering wild plants",
    wrong: ["By buying it at markets", "By growing wheat in large fields", "By trading with cities"],
    hint: "For most of human history, people found their food in the wild.",
    emoji: "🦌",
  },
  {
    prompt: "What is a surplus?",
    right: "Extra food or goods beyond what people need right away",
    wrong: ["A tool for digging soil", "A shortage of food", "A kind of ancient coin"],
    hint: "When a harvest is bigger than a family needs, the extra is a surplus that can be stored or traded.",
    emoji: "🏺",
  },
  {
    prompt: "Why could some people in farming villages become potters, weavers or toolmakers?",
    right: "Food surpluses meant not everyone had to farm",
    wrong: ["Farming was against the law", "Nobody needed food anymore", "The crops grew without any work"],
    hint: "When farmers grew extra food, others could specialize in different jobs and trade for food.",
  },
  {
    prompt: "What does it mean to 'domesticate' a plant or animal?",
    right: "To tame and breed it over generations for human use",
    wrong: ["To hunt it in the wild", "To draw it on a cave wall", "To move it to a new continent"],
    hint: "Wild wolves became dogs, and wild grasses became wheat, through domestication.",
  },
  {
    prompt: "Which crop was one of the first to be farmed in Southwest Asia's Fertile Crescent?",
    right: "wheat",
    wrong: ["potatoes", "maize (corn)", "cacao"],
    hint: "Early farmers there grew wheat and barley. Potatoes, maize and cacao were first farmed in the Americas.",
    emoji: "🌾",
  },
  {
    prompt: "What was the Fertile Crescent?",
    right: "A curve of rich farmland in Southwest Asia, from Mesopotamia to the eastern Mediterranean",
    wrong: ["A desert in northern Africa", "A mountain range in China", "An island in the Pacific Ocean"],
    hint: "It's shaped like a crescent moon and includes the valleys of the Tigris and Euphrates rivers.",
  },
  {
    prompt: "How do archaeologists learn about people who lived before writing existed?",
    right: "By studying artifacts and remains they left behind",
    wrong: ["By reading their diaries", "By watching old films", "By interviewing them"],
    hint: "Tools, pottery, bones, seeds and the remains of homes are clues to how people lived.",
  },
  {
    prompt: "Which tool helped early farmers break up and turn the soil?",
    right: "the plough",
    wrong: ["the compass", "the sundial", "the abacus"],
    hint: "Ploughs, often pulled by oxen, made it possible to farm much larger fields.",
  },
  {
    prompt: "Why did early farming villages often grow near rivers or springs?",
    right: "Crops and animals needed a steady supply of water",
    wrong: ["Rivers kept all wild animals away", "Boats were needed to plant seeds", "It never rained near rivers"],
    hint: "Water for crops, animals and people was the first thing a village needed.",
  },
  {
    prompt: "Maize (corn) was first domesticated about 9,000 years ago in…",
    right: "Mesoamerica (present-day Mexico)",
    wrong: ["Egypt", "China", "Greece"],
    hint: "Farmers there slowly bred a wild grass called teosinte into maize.",
    emoji: "🌽",
    hard: true,
  },
  {
    prompt: "Rice was first domesticated along which river?",
    right: "the Yangtze, in China",
    wrong: ["the Nile, in Egypt", "the Tigris, in Mesopotamia", "the Tiber, in Italy"],
    hint: "Rice needs lots of water. It was first farmed in the wet lands of southern China.",
    emoji: "🍚",
    hard: true,
  },
  {
    prompt: "Why is the change to farming sometimes called the Agricultural (or Neolithic) Revolution?",
    right: "It completely changed how people lived, leading to villages, towns and new jobs",
    wrong: ["It happened in a single year", "It was a war between farmers and hunters", "It ended the use of stone tools overnight"],
    hint: "A revolution is a huge change. Farming led to permanent settlements, surpluses and specialization.",
    hard: true,
  },
  {
    prompt: "Historians use the word 'civilization' for a society with…",
    right: "cities, a government, specialized jobs and often writing",
    wrong: ["only a few families living together", "no farming of any kind", "people who move every season"],
    hint: "Civilizations are complex societies. Cities, leaders, laws and record-keeping are signs of one.",
    hard: true,
  },
  {
    prompt: "As farming villages grew, what new need arose?",
    right: "Ways to protect stored food, divide land and settle disputes",
    wrong: ["Ways to stop people from farming", "Ways to move the village every week", "Ways to forget about property"],
    hint: "More people, land and stored goods meant more disagreements, which led to leaders and laws.",
    hard: true,
  },
  {
    prompt: "Which animal was the first to be domesticated, at least 15,000 years ago?",
    right: "the dog",
    wrong: ["the horse", "the camel", "the chicken"],
    hint: "Dogs descended from wolves and lived alongside hunter-gatherers long before farming began.",
    emoji: "🐕",
    hard: true,
  },
];

function firstFarmers({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return [
    humanStoryOrder(difficulty),
    ...shuffle([sortQuestion(LIFESTYLE_SORT, perBin(difficulty)), ...levelled(FARMING_BANK, 6, difficulty)]),
  ];
}

// ---------- Where Civilizations Grew ----------

const RIVER_CIVS = [
  { civ: "Mesopotamia (Sumer and Babylon)", river: "the Tigris and Euphrates rivers" },
  { civ: "Ancient Egypt", river: "the Nile River" },
  { civ: "the Harappan civilization (cities like Harappa and Mohenjo-daro)", river: "the Indus River" },
  { civ: "early Chinese civilization (the Shang dynasty)", river: "the Huang He (Yellow River)" },
];

function riverQuestion(): Question {
  const c = pick(RIVER_CIVS);
  return textChoice(
    `Along which river valley did ${c.civ} grow?`,
    c.river,
    RIVER_CIVS.filter((x) => x !== c).map((x) => x.river),
    "Mesopotamia: Tigris and Euphrates. Egypt: Nile. Indus Valley: Indus. Early China: Huang He (Yellow River).",
    { type: "emoji", emoji: "🏞️", caption: c.civ },
  );
}

const CIV_FEATURES = [
  {
    bin: { id: "egypt", label: "Ancient Egypt", emoji: "🐊" },
    items: [
      { label: "pyramids built as royal tombs", emoji: "🔺" },
      { label: "hieroglyphs carved on temple walls", emoji: "👁️" },
      { label: "pharaohs who ruled as god-kings", emoji: "👑" },
      { label: "mummies prepared for the afterlife", emoji: "🏺" },
    ],
  },
  {
    bin: { id: "meso", label: "Mesopotamia", emoji: "🌴" },
    items: [
      { label: "cuneiform pressed into clay tablets", emoji: "🧱" },
      { label: "Hammurabi's law code", emoji: "⚖️" },
      { label: "Sumerian city-states like Ur", emoji: "🏙️" },
      { label: "stepped temple towers called ziggurats", emoji: "🔶" },
    ],
  },
  {
    bin: { id: "indus", label: "Indus Valley", emoji: "🐘" },
    items: [
      { label: "planned cities like Mohenjo-daro", emoji: "🏘️" },
      { label: "brick-lined drains along the streets", emoji: "🚰" },
      { label: "a large public pool called the Great Bath", emoji: "🛁" },
      { label: "a script no one has deciphered yet", emoji: "❓" },
    ],
  },
  {
    bin: { id: "china", label: "Ancient China (Shang)", emoji: "🐉" },
    items: [
      { label: "oracle bones with early Chinese writing", emoji: "🦴" },
      { label: "silk woven from silkworm thread", emoji: "🧵" },
      { label: "millet farms along the Yellow River", emoji: "🌾" },
      { label: "the earliest Chinese dynasty with written records", emoji: "🏯" },
    ],
  },
];

function civSort(): Question {
  const civs = sample(CIV_FEATURES, 3);
  const set: SortSet = {
    prompt: "Which civilization is each feature from? Sort them.",
    hint: "Egypt: pyramids, hieroglyphs, pharaohs, mummies. Mesopotamia: cuneiform, ziggurats, Hammurabi, Ur. Indus Valley: planned cities, drains, the Great Bath, an undeciphered script. Shang China: oracle bones, silk, millet, the first written records.",
    bins: civs.map((c) => c.bin),
    items: civs.flatMap((c) => c.items.map((i) => ({ ...i, bin: c.bin.id }))),
  };
  return sortQuestion(set, 2);
}

const NILE = {
  type: "passage" as const,
  title: "The Gift of the Nile",
  paragraphs: [
    "Egypt gets very little rain, yet thousands of years ago it fed a large population. The reason was the Nile River. The Greek historian Herodotus called Egypt 'the gift of the Nile.'",
    "Every summer, heavy rains fell far to the south in the highlands of Ethiopia. The water flowed north, and the Nile rose until it spilled over its banks. When the flood went down in autumn, it left a layer of dark, rich silt on the fields. Egyptians called their land Kemet, 'the black land,' after this soil, and the desert beyond it Deshret, 'the red land.'",
    "Farmers planted wheat and barley in the damp silt and harvested them in spring. Because the flood came at about the same time each year, Egyptians kept a calendar of 365 days. Officials measured the river's height with stone gauges called nilometers to predict the harvest and decide how much tax to collect.",
  ],
};

function nileQuestion(): Question {
  return pick([
    () =>
      textChoice(
        "According to the passage, where did the water for the Nile's yearly flood come from?",
        "Heavy summer rain in the highlands of Ethiopia",
        ["Rain falling on Egypt every day", "Melting snow from Greece", "Seawater pushed in from the Mediterranean"],
        "Look at the start of paragraph 2.",
        NILE,
      ),
    () =>
      textChoice(
        "Why did Egyptians call their land Kemet, 'the black land'?",
        "Because of the dark, rich silt left by the flood",
        ["Because the nights were very dark", "Because the desert sand was black", "Because of smoke from cooking fires"],
        "Paragraph 2 explains the name. Compare it with Deshret, 'the red land'.",
        NILE,
      ),
    () =>
      textChoice(
        "How did nilometers help Egypt's government?",
        "They measured the river's height to predict the harvest and set taxes",
        ["They pumped water into the desert", "They told the time of day", "They measured the height of the pyramids"],
        "Reread the last sentence of the passage.",
        NILE,
      ),
    () =>
      textChoice(
        "Based on the passage, how could Egypt grow so much food with so little rain?",
        "The yearly flood watered the fields and renewed the soil",
        ["Farmers grew food only in the desert", "Egypt imported all of its food", "It rained every day in winter"],
        "Think about what the flood brought each year: water and fresh silt.",
        NILE,
      ),
  ])();
}

const GEO_BANK: Item[] = [
  {
    prompt: "Why did many of the earliest civilizations grow up along rivers?",
    right: "Rivers gave water for crops, fertile soil, and routes for travel and trade",
    wrong: ["Rivers kept the weather cold all year", "There were no animals near rivers", "Mountains were too crowded"],
    hint: "Farming needs water and good soil, and boats made moving goods much easier.",
    emoji: "🏞️",
  },
  {
    prompt: "How did the deserts on each side of the Nile help Ancient Egypt?",
    right: "They made it hard for invaders to reach Egypt",
    wrong: ["They provided rich farmland", "They supplied fresh drinking water", "They were full of forests for timber"],
    hint: "Few armies could cross large, dry deserts, so Egypt was naturally protected.",
    emoji: "🏜️",
  },
  {
    prompt: "The name Mesopotamia comes from Greek. What does it mean?",
    right: "land between the rivers",
    wrong: ["land of the pharaohs", "city on seven hills", "home of the gods"],
    hint: "'Meso' means middle or between, and 'potamos' means river: the land between the Tigris and Euphrates.",
  },
  {
    prompt: "Most of ancient Mesopotamia lies in which present-day country?",
    right: "Iraq",
    wrong: ["Egypt", "India", "Greece"],
    hint: "The Tigris and Euphrates rivers flow through Iraq (and parts of Syria and Türkiye).",
  },
  {
    prompt: "Why did Ancient Greece develop as many separate city-states instead of one kingdom?",
    right: "Mountains and seas divided the land into small regions",
    wrong: ["The Greeks had only one big river valley", "A pharaoh ruled all of Greece", "The land was completely flat"],
    hint: "Rugged mountains and many islands kept communities apart, so each city-state, like Athens and Sparta, ran itself.",
    emoji: "⛰️",
  },
  {
    prompt: "Greece has little flat farmland but a long coastline. How did this shape Greek life?",
    right: "Many Greeks became sailors, traders and fishers",
    wrong: ["Greeks never used boats", "Greeks grew rice in large paddies", "Greeks lived only in deserts"],
    hint: "The sea connected Greek cities to each other and to trading partners around the Mediterranean.",
    emoji: "⛵",
  },
  {
    prompt: "Ancient Rome grew up on hills beside which river?",
    right: "the Tiber",
    wrong: ["the Nile", "the Indus", "the Huang He"],
    hint: "Rome was built on seven hills near the Tiber River in central Italy.",
    emoji: "🏛️",
  },
  {
    prompt: "Where did the Maya civilization develop?",
    right: "In Mesoamerica: southern Mexico and parts of Central America",
    wrong: ["In the Nile Valley", "In the Andes mountains of South America", "In the Fertile Crescent"],
    hint: "Maya cities grew in the rainforests and lowlands of the Yucatán Peninsula, Guatemala and Belize.",
    emoji: "🌽",
  },
  {
    prompt: "The Indus Valley civilization was located in present-day…",
    right: "Pakistan and northwest India",
    wrong: ["Iraq and Syria", "Egypt and Sudan", "China and Mongolia"],
    hint: "The Indus River flows from the Himalaya through Pakistan to the Arabian Sea.",
    hard: true,
  },
  {
    prompt: "The northern Maya lowlands had few rivers on the surface. Where did people get water?",
    right: "From cenotes (natural sinkholes) and stored rainwater",
    wrong: ["From melting glaciers", "From the Nile", "From desalinated seawater"],
    hint: "The Yucatán is limestone. Rain soaks underground, and sinkholes called cenotes open onto that water.",
    hard: true,
  },
  {
    prompt: "Why is the Huang He called the Yellow River?",
    right: "It carries huge amounts of yellow-brown silt",
    wrong: ["Its banks are covered in yellow flowers", "The Sun reflects off it at sunset", "It was painted for festivals"],
    hint: "The river picks up fine, yellowish soil called loess. Its floods also earned it the name 'China's Sorrow.'",
    hard: true,
  },
  {
    prompt: "Which body of water made trade and travel easy for the Phoenicians, Greeks and Romans?",
    right: "the Mediterranean Sea",
    wrong: ["the Pacific Ocean", "the Arctic Ocean", "the Caspian Sea"],
    hint: "These peoples all lived around the same sea and sailed it to trade.",
    emoji: "⛵",
    hard: true,
  },
  {
    prompt: "The Tigris and Euphrates flooded unpredictably. How did Mesopotamian farmers manage the water?",
    right: "They dug irrigation canals and built up banks called levees",
    wrong: ["They moved to the mountains every spring", "They waited for rain instead", "They farmed only on rafts"],
    hint: "Controlling water took planning and teamwork, which helped lead to strong local governments.",
    hard: true,
  },
  {
    prompt: "Why did early Chinese civilization develop somewhat apart from other early civilizations?",
    right: "Mountains, deserts and the ocean separated it from other regions",
    wrong: ["It had no rivers", "It was on an island far out at sea", "Its people never traded with anyone"],
    hint: "The Himalaya, the Gobi Desert and the Pacific Ocean made travel to and from China difficult.",
    hard: true,
  },
];

function whereCivilizationsGrew({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const extras = difficulty === 1 ? [] : [nileQuestion()];
  return shuffle([riverQuestion(), civSort(), ...extras, ...levelled(GEO_BANK, 6 - extras.length, difficulty)]);
}

// ---------- Laws & Government ----------

const GOV_SORT: SortSet = {
  prompt: "Athenian democracy or the Roman Republic? Sort each feature.",
  hint: "In Athens, citizens voted on laws themselves and were picked by lottery for some jobs. Rome's Republic had elected consuls, a Senate, tribunes and the written Twelve Tables.",
  bins: [
    { id: "athens", label: "Athenian democracy", emoji: "🦉" },
    { id: "rome", label: "Roman Republic", emoji: "🦅" },
  ],
  items: [
    { label: "an Assembly where citizens voted on laws themselves", emoji: "🗳️", bin: "athens" },
    { label: "council members chosen by lottery", emoji: "🎲", bin: "athens" },
    { label: "ostracism: voting to send a leader away for 10 years", emoji: "🏺", bin: "athens" },
    { label: "citizen juries of hundreds of people", emoji: "👥", bin: "athens" },
    { label: "Pericles as a leading statesman", emoji: "🗣️", bin: "athens" },
    { label: "two consuls elected each year", emoji: "✌️", bin: "rome" },
    { label: "a Senate of powerful, experienced men", emoji: "🏛️", bin: "rome" },
    { label: "tribunes who protected the plebeians", emoji: "🛡️", bin: "rome" },
    { label: "laws written on the Twelve Tables", emoji: "📜", bin: "rome" },
    { label: "a dictator chosen only for emergencies", emoji: "⏳", bin: "rome" },
  ],
};

function egyptPyramid(difficulty: Level): OrderQuestion {
  const tiers = [
    { id: "pharaoh", label: "the pharaoh", emoji: "👑" },
    { id: "nobles", label: "nobles, officials and priests", emoji: "💎" },
    { id: "scribes", label: "scribes", emoji: "✍️" },
    { id: "crafts", label: "craftspeople and merchants", emoji: "🔨" },
    { id: "farmers", label: "farmers and labourers", emoji: "🌾" },
  ];
  return {
    kind: "order",
    prompt: "Put Ancient Egypt's social pyramid in order, from most powerful to least.",
    hint: "The pharaoh was at the top. Nobles and priests helped rule. Scribes could read and write, so they were respected. Most Egyptians were farmers, near the bottom.",
    items: difficulty === 1 ? tiers.filter((t) => t.id !== "crafts") : tiers,
  };
}

const HAMMURABI = {
  type: "passage" as const,
  title: "Hammurabi's Code",
  paragraphs: [
    "Around 1754 BCE, King Hammurabi of Babylon had about 282 laws carved into a tall pillar of black stone, called a stele. It was set up in public, where people could see the laws.",
    "The laws covered many parts of daily life: trade, wages, borrowing, farming, family life and crime. At the top of the stele, Hammurabi is shown standing before Shamash, the Babylonian god of justice, to show that his laws had the gods' approval.",
    "Many punishments followed the idea of 'an eye for an eye': the punishment matched the harm done. But the laws did not treat everyone the same. The penalty often depended on whether a person was a noble, a free commoner or enslaved.",
    "Hammurabi's code was not the first written set of laws, but it is one of the most complete to survive. The original stele is now in a museum in Paris.",
  ],
};

function hammurabiQuestion(): Question {
  return pick([
    () =>
      textChoice(
        "According to the passage, why was the stele set up in public?",
        "So people could see the laws",
        ["To mark Hammurabi's tomb", "To record each year's harvest", "To point the way to Babylon"],
        "Look at the last sentence of paragraph 1.",
        HAMMURABI,
      ),
    () =>
      textChoice(
        "What does the passage say about fairness in Hammurabi's code?",
        "Penalties often depended on a person's social class",
        [
          "Everyone received exactly the same punishment",
          "There were no punishments, only rewards",
          "Only enslaved people had to follow the laws",
        ],
        "Paragraph 3 says the laws 'did not treat everyone the same'.",
        HAMMURABI,
      ),
    () =>
      textChoice(
        "Why is Hammurabi shown with Shamash at the top of the stele?",
        "To show that his laws had the gods' approval",
        ["Because Shamash was a king of Egypt", "To show a picture of the harvest", "Because Shamash was Hammurabi's teacher"],
        "Paragraph 2 explains the picture at the top.",
        HAMMURABI,
      ),
    () =>
      textChoice(
        "Which statement is true, according to the passage?",
        "Hammurabi's code was not the first written set of laws",
        ["It was the first written set of laws ever", "It had only ten laws", "It was carved around 500 CE"],
        "Check the dates and numbers in the passage, and reread paragraph 4.",
        HAMMURABI,
      ),
  ])();
}

const LAW_BANK: Item[] = [
  {
    prompt: "The word 'democracy' comes from Greek words meaning…",
    right: "rule by the people",
    wrong: ["rule by one king", "rule by the gods", "rule by the army"],
    hint: "'Demos' means people and 'kratos' means power or rule.",
    emoji: "🗳️",
  },
  {
    prompt: "In Athenian democracy, who could vote?",
    right: "Only adult male citizens",
    wrong: ["All adults, including women", "Everyone who lived in Athens", "Only the king"],
    hint: "Women, enslaved people and foreigners living in Athens could not vote.",
    emoji: "🦉",
  },
  {
    prompt: "Athens had a direct democracy. What does that mean?",
    right: "Citizens voted on laws themselves instead of electing representatives",
    wrong: ["A king made every decision directly", "Laws were chosen by drawing names from a hat", "Only priests could make laws"],
    hint: "In a direct democracy, citizens gather and vote on each decision themselves.",
  },
  {
    prompt: "In the Roman Republic, how were leaders such as consuls chosen?",
    right: "Citizens elected them",
    wrong: ["They inherited the job from their parents", "The pharaoh appointed them", "They were chosen by a lottery of enslaved people"],
    hint: "A republic is a government where citizens elect officials to lead and make decisions.",
    emoji: "🦅",
  },
  {
    prompt: "Why did the Roman Republic have two consuls who served for only one year?",
    right: "So that no single person could hold too much power",
    wrong: ["Because one consul ruled Greece", "So they could share one crown", "Because the Senate had no members"],
    hint: "After overthrowing their last king, Romans wanted to avoid one person ruling alone.",
  },
  {
    prompt: "How did Ancient Egyptians see their pharaoh?",
    right: "As a ruler who was also considered god-like",
    wrong: ["As an elected official who served one year", "As a merchant who ran the markets", "As a scribe who kept records"],
    hint: "Pharaohs were believed to be connected to the gods, which gave them great authority.",
    emoji: "👑",
  },
  {
    prompt: "In Rome, wealthy landowning families were patricians. What were ordinary citizens called?",
    right: "plebeians",
    wrong: ["pharaohs", "scribes", "consuls"],
    hint: "Plebeians were farmers, workers and traders. Over time they won more rights, such as electing tribunes.",
  },
  {
    prompt: "Why did growing societies need written laws?",
    right: "More people, trade and property led to more disputes that needed fair rules",
    wrong: ["Small villages had too many laws already", "People had nothing to argue about", "Writing was only used for laws"],
    hint: "When rules are written down, everyone can know them and judges can apply them the same way.",
  },
  {
    prompt: "What is a city-state?",
    right: "A city and its surrounding land with its own government",
    wrong: ["A city that belongs to no country", "A state with no cities", "A type of temple"],
    hint: "Sumer, Ancient Greece and the Maya were all made up of many city-states.",
  },
  {
    prompt: "Who became the first Roman emperor in 27 BCE?",
    right: "Augustus (Octavian)",
    wrong: ["Julius Caesar", "Hammurabi", "Pericles"],
    hint: "Julius Caesar was never emperor. His adopted heir took the title Augustus and ruled for over 40 years.",
    hard: true,
  },
  {
    prompt: "Chinese dynasties claimed the 'Mandate of Heaven.' What did this mean?",
    right: "Heaven gave a just ruler the right to rule, and could take it away from an unjust one",
    wrong: ["Rulers were elected by citizens every year", "Only priests could become rulers", "The ruler had to live in the mountains"],
    hint: "Floods, famine or revolt were seen as signs a ruler had lost Heaven's approval.",
    hard: true,
  },
  {
    prompt: "What were the Twelve Tables?",
    right: "Rome's first written laws, displayed in public around 450 BCE",
    wrong: ["Twelve stone altars in Athens", "The twelve rooms of a pharaoh's tomb", "A Chinese calendar of twelve months"],
    hint: "Plebeians demanded that laws be written and posted so patricians couldn't change them at will.",
    hard: true,
  },
  {
    prompt: "Which idea still used in courts today comes from Roman law?",
    right: "A person is innocent until proven guilty",
    wrong: ["Laws should be kept secret", "Only kings may own property", "Judges never need evidence"],
    hint: "Roman law said the person making an accusation had to prove it.",
    hard: true,
  },
  {
    prompt: "Tikal and Calakmul were large, independent cities with their own rulers. Which civilization were they part of?",
    right: "the Maya",
    wrong: ["Ancient Egypt", "Ancient Greece", "the Roman Empire"],
    hint: "The Maya were never one empire. They were organized as many city-states, each with a ruler.",
    emoji: "🌽",
    hard: true,
  },
  {
    prompt: "After uniting China in 221 BCE, what did Qin Shi Huang standardize?",
    right: "writing, money, and weights and measures",
    wrong: ["the date of the Olympic Games", "the language of Rome", "the shape of the pyramids"],
    hint: "Making these the same everywhere helped him control and tax his huge new empire.",
    hard: true,
  },
];

function lawsAndGovernment({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return shuffle([
    sortQuestion(GOV_SORT, perBin(difficulty)),
    hammurabiQuestion(),
    egyptPyramid(difficulty),
    ...levelled(LAW_BANK, 5, difficulty),
  ]);
}

// ---------- World Beliefs ----------

const ORIGIN_SORT: SortSet = {
  prompt: "Where did each belief system begin? Sort them by region.",
  hint: "Hinduism and Buddhism began in South Asia. Confucianism, Daoism and Shinto began in East Asia. Judaism, Christianity and Islam began in Southwest Asia (the Middle East).",
  bins: [
    { id: "south", label: "South Asia", emoji: "⛰️" },
    { id: "east", label: "East Asia", emoji: "🏯" },
    { id: "southwest", label: "Southwest Asia", emoji: "🏜️" },
  ],
  items: [
    { label: "Hinduism", emoji: "🛕", bin: "south" },
    { label: "Buddhism", emoji: "☸️", bin: "south" },
    { label: "Confucianism", emoji: "📜", bin: "east" },
    { label: "Daoism", emoji: "☯️", bin: "east" },
    { label: "Shinto", emoji: "⛩️", bin: "east" },
    { label: "Judaism", emoji: "🕍", bin: "southwest" },
    { label: "Christianity", emoji: "⛪", bin: "southwest" },
    { label: "Islam", emoji: "🕌", bin: "southwest" },
  ],
};

interface Belief {
  name: string;
  began: string;
  ago: number;
  figure: string;
  texts: string;
}

const BELIEFS: Belief[] = [
  {
    name: "Judaism",
    began: "more than 3,000 years ago, Southwest Asia",
    ago: 3000,
    figure: "Abraham and Moses",
    texts: "the Torah (Hebrew Bible)",
  },
  {
    name: "Hinduism",
    began: "more than 3,000 years ago, South Asia",
    ago: 3000,
    figure: "no single founder",
    texts: "the Vedas and the Bhagavad Gita",
  },
  {
    name: "Buddhism",
    began: "about 2,500 years ago, South Asia",
    ago: 2500,
    figure: "Siddhartha Gautama (the Buddha)",
    texts: "the Tripitaka",
  },
  {
    name: "Confucianism",
    began: "about 2,500 years ago, China",
    ago: 2500,
    figure: "Confucius (Kongzi)",
    texts: "the Analects",
  },
  {
    name: "Christianity",
    began: "about 2,000 years ago, Southwest Asia",
    ago: 2000,
    figure: "Jesus of Nazareth",
    texts: "the Bible",
  },
  {
    name: "Islam",
    began: "about 1,400 years ago, Arabia",
    ago: 1400,
    figure: "the Prophet Muhammad",
    texts: "the Qur'an",
  },
];

function beliefTable(difficulty: Level): Question {
  const rows = sample(BELIEFS, 4);
  const visual = {
    type: "table" as const,
    title: "Origins of some major belief systems",
    headers: ["Belief system", "Began", "Founder or key figure", "Important texts"],
    rows: rows.map((b) => [b.name, b.began, b.figure, b.texts]),
  };
  const names = rows.map((b) => b.name);
  const hint = "Find the right column in the table, then read across that row to the name of the belief system.";
  const ask = (prompt: string, b: Belief) =>
    textChoice(
      prompt,
      b.name,
      names.filter((n) => n !== b.name),
      hint,
      visual,
    );

  if (difficulty === 3) {
    const min = Math.min(...rows.map((b) => b.ago));
    const newest = rows.filter((b) => b.ago === min);
    if (newest.length === 1) {
      return textChoice(
        "According to the table, which of these belief systems began most recently?",
        newest[0].name,
        names.filter((n) => n !== newest[0].name),
        "Compare the 'Began' column. The smallest number of years ago is the most recent.",
        visual,
      );
    }
  }
  const b = pick(rows);
  if (chance(0.5)) return ask(`According to the table, which belief system's important texts include ${b.texts}?`, b);
  if (b.figure === "no single founder") return ask("According to the table, which belief system has no single founder?", b);
  return ask(`According to the table, which belief system is linked with ${b.figure}?`, b);
}

const BELIEF_BANK: Item[] = [
  {
    prompt: "Buddhism began with the teachings of Siddhartha Gautama. What does the title 'Buddha' mean?",
    right: "the awakened (enlightened) one",
    wrong: ["the king of kings", "the great builder", "the traveller"],
    hint: "Buddhists believe Siddhartha reached enlightenment, a deep understanding of life and suffering.",
    emoji: "☸️",
  },
  {
    prompt: "The Four Noble Truths and the Eightfold Path are central teachings of which belief system?",
    right: "Buddhism",
    wrong: ["Confucianism", "Judaism", "Islam"],
    hint: "The Buddha taught these as a way to understand suffering and live a balanced life.",
  },
  {
    prompt: "Confucius taught that society works best when…",
    right: "people respect family and elders, and rulers govern with good character",
    wrong: ["everyone lives alone in the wilderness", "there are no rulers at all", "people worship only one god"],
    hint: "Confucius focused on proper relationships, education, duty and leading by example.",
    emoji: "📜",
  },
  {
    prompt: "Daoism teaches people to live in harmony with…",
    right: "the Dao, the natural way of the universe",
    wrong: ["the laws of the Roman Senate", "the pharaoh's commands", "the rules of the marketplace"],
    hint: "Daoism, linked to the teacher Laozi, values simplicity, balance and nature. The yin-yang symbol is linked with it.",
    emoji: "☯️",
  },
  {
    prompt: "Judaism was one of the first religions to teach…",
    right: "belief in one God (monotheism)",
    wrong: ["belief in many gods (polytheism)", "that the Sun was the only god", "that there are no gods"],
    hint: "'Mono' means one and 'theos' means god.",
    emoji: "🕍",
  },
  {
    prompt: "Christianity is based on the life and teachings of…",
    right: "Jesus of Nazareth",
    wrong: ["Confucius", "Siddhartha Gautama", "Hammurabi"],
    hint: "Christianity began about 2,000 years ago in Judea, then part of the Roman Empire.",
    emoji: "⛪",
  },
  {
    prompt: "Islam began in the early 600s CE, when the Prophet Muhammad began preaching in which city?",
    right: "Mecca, in Arabia",
    wrong: ["Rome, in Italy", "Athens, in Greece", "Babylon, in Mesopotamia"],
    hint: "Mecca is in the Arabian Peninsula. Today, millions of Muslims travel there each year.",
    emoji: "🕌",
  },
  {
    prompt: "Why did Ancient Egyptians preserve bodies as mummies?",
    right: "They believed the body was needed in the afterlife",
    wrong: ["To use them as building material", "To keep them as decorations", "Because the Nile was too cold"],
    hint: "Egyptian beliefs about the afterlife shaped tombs, burial goods and mummification.",
    emoji: "🏺",
  },
  {
    prompt: "The ancient Greeks believed their most important gods lived on…",
    right: "Mount Olympus",
    wrong: ["the island of Crete", "the banks of the Nile", "the Great Wall"],
    hint: "Zeus, Athena, Apollo and other Greek gods were said to live on Greece's highest mountain.",
    emoji: "⛰️",
  },
  {
    prompt: "What does 'polytheism' mean?",
    right: "belief in many gods",
    wrong: ["belief in one God", "belief in no gods", "belief in ancestors only"],
    hint: "'Poly' means many. Ancient Egyptians, Greeks, Romans and Maya were polytheistic.",
  },
  {
    prompt: "Which three religions are called 'Abrahamic' because they trace their roots to Abraham?",
    right: "Judaism, Christianity and Islam",
    wrong: ["Hinduism, Buddhism and Jainism", "Confucianism, Daoism and Shinto", "Judaism, Hinduism and Daoism"],
    hint: "All three began in Southwest Asia and honour Abraham as an important figure.",
    hard: true,
  },
  {
    prompt: "Hinduism and Buddhism both include the idea of karma. What is karma?",
    right: "The idea that a person's actions affect their future",
    wrong: ["A type of temple", "A holy river", "A yearly harvest festival"],
    hint: "Good actions are believed to lead to good results, and harmful actions to harmful results.",
    hard: true,
  },
  {
    prompt: "Which belief system has no single founder and developed over thousands of years in South Asia?",
    right: "Hinduism",
    wrong: ["Buddhism", "Christianity", "Confucianism"],
    hint: "It grew from many traditions and texts, including the ancient Vedas.",
    emoji: "🛕",
    hard: true,
  },
  {
    prompt: "Which Roman emperor supported Christianity and agreed to the Edict of Milan in 313 CE, granting religious freedom?",
    right: "Constantine",
    wrong: ["Augustus", "Julius Caesar", "Hadrian"],
    hint: "Constantine and his co-emperor agreed to the Edict of Milan. In 380 CE, Christianity became the empire's official religion.",
    hard: true,
  },
  {
    prompt: "The Five Pillars (faith, prayer, charity, fasting and pilgrimage) are central practices of…",
    right: "Islam",
    wrong: ["Daoism", "Hinduism", "Greek religion"],
    hint: "Muslims follow the Five Pillars as the foundation of their faith.",
    hard: true,
  },
  {
    prompt: "How did Buddhism spread from India to China?",
    right: "Monks and merchants carried it along trade routes like the Silk Road",
    wrong: ["Roman soldiers brought it", "It was carved on Hammurabi's stele", "The Maya sailed it across the ocean"],
    hint: "Trade routes carried ideas and beliefs as well as goods.",
    hard: true,
  },
  {
    prompt: "In Judaism, what is the Torah?",
    right: "The first five books of the Hebrew Bible",
    wrong: ["A temple in Jerusalem", "A Greek god", "A Roman law code"],
    hint: "The Torah contains Jewish teachings and laws, and is read in synagogues.",
    hard: true,
  },
  {
    prompt: "Which statement about these ancient belief systems is true?",
    right: "Many are still practised by millions of people around the world today",
    wrong: ["All of them disappeared long ago", "They were all started by the same person", "None of them influenced art or law"],
    hint: "Religions and philosophies from this period still shape holidays, values, laws and art today.",
    hard: true,
  },
];

function worldBeliefs({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return shuffle([sortQuestion(ORIGIN_SORT, 2), beliefTable(difficulty), ...levelled(BELIEF_BANK, 6, difficulty)]);
}

// ---------- Trade Networks ----------

const GOODS = [
  { region: "China", goods: "silk, bronze mirrors, lacquerware", key: "silk" },
  { region: "India", goods: "pepper and other spices, cotton cloth, gems", key: "pepper" },
  { region: "Central Asia", goods: "strong, fast horses", key: "horses" },
  { region: "Arabia", goods: "frankincense and myrrh", key: "frankincense" },
  { region: "the Roman Empire", goods: "glassware, gold coins, wool", key: "glassware" },
];

function goodsTable(): Question {
  const rows = sample(GOODS, 4);
  const g = pick(rows);
  return textChoice(
    `Use the table. A merchant wants to buy ${g.key}. Which region should they trade with?`,
    g.region,
    rows.filter((r) => r !== g).map((r) => r.region),
    "Find the good in the 'Famous goods' column, then read across to the region.",
    {
      type: "table",
      title: "Goods traded along the Silk Road and connected sea routes",
      headers: ["Region", "Famous goods"],
      rows: rows.map((r) => [r.region, r.goods]),
    },
  );
}

const SILK_ROAD = {
  type: "passage" as const,
  title: "The Silk Road",
  paragraphs: [
    "The Silk Road was not one road. It was a network of land and sea routes linking China with Central Asia, India, Persia, Arabia and the Mediterranean world. It grew busy after China's Han dynasty sent envoys west in the 100s BCE.",
    "Few merchants travelled the whole way. Instead, goods passed from trader to trader and city to city, and each trader added to the price. Camel caravans crossed deserts and stopped to rest and get water at oasis towns such as Samarkand and Dunhuang.",
    "The routes carried more than silk, spices and horses. Ideas travelled too: Buddhism spread from India into China, and art styles and inventions moved in both directions. Unfortunately, diseases also spread along the same routes.",
  ],
};

function silkRoadQuestion(): Question {
  return pick([
    () =>
      textChoice(
        "According to the passage, why did goods cost more the farther they travelled?",
        "They passed from trader to trader, and each added to the price",
        ["Every merchant paid a toll to the Roman Senate", "Silk got heavier over time", "Camels charged by the kilometre"],
        "Reread the first two sentences of paragraph 2.",
        SILK_ROAD,
      ),
    () =>
      textChoice(
        "Besides goods, what else moved along the Silk Road?",
        "Ideas, religions, inventions and diseases",
        ["Only soldiers", "Nothing but silk", "Only letters between kings"],
        "Paragraph 3 lists several things that were not goods.",
        SILK_ROAD,
      ),
    () =>
      textChoice(
        "Why were oasis towns like Samarkand and Dunhuang important?",
        "Caravans could rest and get water there",
        ["They were the only places that made silk", "They were capital cities of Rome", "They were built on the ocean floor"],
        "Think about what travellers crossing a desert need most.",
        SILK_ROAD,
      ),
    () =>
      textChoice(
        "Which statement best describes the Silk Road, according to the passage?",
        "A network of many land and sea routes",
        ["One paved road from Rome to China", "A single river used by silk boats", "A wall built to keep traders out"],
        "Look at the first two sentences of the passage.",
        SILK_ROAD,
      ),
  ])();
}

function barterQuestion(difficulty: Level): InputQuestion {
  if (difficulty === 3) {
    const a = randInt(2, 4);
    const b = a + randInt(1, 3);
    const m = randInt(2, 5);
    return {
      kind: "input",
      prompt: `At a market, ${a} rolls of cloth trade for ${b} jars of olive oil. How many jars of oil would ${a * m} rolls of cloth get?`,
      hint: `${a * m} rolls is ${m} groups of ${a} rolls. Each group gets ${b} jars, so multiply ${m} × ${b}.`,
      answer: String(m * b),
      keypad: "number",
      visual: { type: "equation", text: `${a} rolls of cloth = ${b} jars of oil` },
    };
  }
  const rate = randInt(2, 5);
  const pots = randInt(3, 8);
  return {
    kind: "input",
    prompt: `In a barter market, ${rate} sacks of barley trade for 1 copper pot. How many sacks of barley are needed for ${pots} pots?`,
    hint: `Each pot costs ${rate} sacks, so multiply ${pots} × ${rate}.`,
    answer: String(rate * pots),
    keypad: "number",
    visual: { type: "equation", text: `${rate} sacks of barley = 1 copper pot` },
  };
}

const TRADE_SORT: SortSet = {
  prompt: "Did trade lead to cooperation or conflict? Sort each example.",
  hint: "Cooperation is when societies work together and both gain. Conflict is when they compete or fight over routes, resources or profits.",
  bins: [
    { id: "coop", label: "cooperation", emoji: "🤝" },
    { id: "conflict", label: "conflict", emoji: "🛡️" },
  ],
  items: [
    { label: "merchants from many lands sharing a market", emoji: "🏪", bin: "coop" },
    { label: "kingdoms agreeing on trade rules", emoji: "📜", bin: "coop" },
    { label: "learning new crops and inventions from neighbours", emoji: "🌱", bin: "coop" },
    { label: "using shared coins and weights", emoji: "🪙", bin: "coop" },
    { label: "rival cities going to war over a trade route", emoji: "🗺️", bin: "conflict" },
    { label: "Rome and Carthage competing for Mediterranean trade", emoji: "🚢", bin: "conflict" },
    { label: "a kingdom blocking rivals from its ports", emoji: "⚓", bin: "conflict" },
    { label: "disputes over high tolls and taxes on goods", emoji: "💰", bin: "conflict" },
  ],
};

const TRADE_BANK: Item[] = [
  {
    prompt: "What is economic specialization?",
    right: "When people or regions focus on producing certain goods or services",
    wrong: ["When everyone makes everything they need", "When a society stops trading", "When prices are set by the weather"],
    hint: "A potter makes pots, a weaver makes cloth, and they trade. Regions specialize too.",
  },
  {
    prompt: "What is barter?",
    right: "Trading goods directly for other goods, without money",
    wrong: ["Paying with gold coins", "Borrowing money from a bank", "Giving goods away for free"],
    hint: "Swapping 3 sacks of grain for a pot is bartering.",
  },
  {
    prompt: "Why did coins make trade easier than barter?",
    right: "Coins had an agreed value and were easy to carry and count",
    wrong: ["Coins could be eaten in an emergency", "Coins made goods free", "Coins could only be used once"],
    hint: "With barter, you need someone who wants exactly what you have. Coins solve that problem.",
    emoji: "🪙",
  },
  {
    prompt: "Which animal carried goods across the deserts of the Silk Road?",
    right: "the camel",
    wrong: ["the elephant", "the llama", "the reindeer"],
    hint: "Bactrian camels, with two humps, could travel far with little water through cold and hot deserts.",
    emoji: "🐫",
  },
  {
    prompt: "How can trade lead to cooperation between societies?",
    right: "Both sides gain goods they need, so they benefit from staying at peace",
    wrong: ["Trade makes every society exactly the same", "Trade means only one side gains", "Trade stops people from travelling"],
    hint: "When trade helps both partners, they have good reasons to keep good relations.",
  },
  {
    prompt: "How can trade lead to conflict between societies?",
    right: "Societies may compete or fight to control valuable routes and resources",
    wrong: ["Trade always ends all wars", "Traders never disagree about prices", "No one wants valuable goods"],
    hint: "Control of rich routes, ports and resources meant wealth, so rivals sometimes fought over them.",
  },
  {
    prompt: "The Phoenicians were famous for…",
    right: "sea trade across the Mediterranean and a costly purple dye",
    wrong: ["building the pyramids", "inventing paper", "the Code of Hammurabi"],
    hint: "Phoenician cities like Tyre traded by ship. Their purple dye, made from sea snails, was worth a fortune.",
    emoji: "⛵",
  },
  {
    prompt: "Mesopotamia had plenty of clay and grain but very little…",
    right: "wood, stone and metal",
    wrong: ["water", "soil", "sunlight"],
    hint: "Mesopotamians traded their grain and goods for timber, stone and metals from other regions.",
  },
  {
    prompt: "The first known coins were made around 600 BCE in which kingdom?",
    right: "Lydia (in present-day Türkiye)",
    wrong: ["Ancient Egypt", "the Maya city of Tikal", "Shang China"],
    hint: "Lydian coins were made of electrum, a natural mix of gold and silver.",
    hard: true,
  },
  {
    prompt: "Why did China keep the method of making silk a secret for centuries?",
    right: "It kept silk rare, valuable and profitable to trade",
    wrong: ["Silk was against the law to wear", "No one outside China wanted silk", "Silk was used only in temples"],
    hint: "If only China could make silk, buyers far away had to pay high prices for it.",
    emoji: "🧵",
    hard: true,
  },
  {
    prompt: "Around 550 CE, monks smuggled silkworm eggs to Constantinople, so its empire could make its own silk. Which empire was it?",
    right: "the Byzantine Empire",
    wrong: ["the Maya", "Ancient Egypt", "Babylon"],
    hint: "The Byzantine Empire was the eastern part of the Roman world, centred on Constantinople.",
    hard: true,
  },
  {
    prompt: "Seasonal monsoon winds helped sailors trade across the Indian Ocean, linking India with…",
    right: "Arabia, East Africa and Egypt",
    wrong: ["the Maya and Mexico", "Iceland and Greenland", "Central Asia's deserts"],
    hint: "Ships sailed one way with the summer monsoon and returned with the winter winds.",
    hard: true,
  },
  {
    prompt: "The name 'Silk Road' was invented in 1877. Why is it a little misleading?",
    right: "It was a network of many routes, and many goods besides silk were traded",
    wrong: ["Silk was never traded on it", "It was one straight road", "It was only used in the 1800s"],
    hint: "Traders used many land and sea routes and carried spices, horses, glass, ideas and more.",
    hard: true,
  },
  {
    prompt: "A region has rich farmland but no metal. What does specialization and trade let it do?",
    right: "Grow extra food and trade it for metal tools",
    wrong: ["Stop growing food completely", "Make metal from wheat", "Avoid all contact with neighbours"],
    hint: "Each region produces what it's good at and trades for what it lacks.",
    hard: true,
  },
];

function tradeNetworks({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const extras: Question[] = [];
  if (difficulty >= 2) extras.push(silkRoadQuestion());
  if (difficulty === 3) extras.push(barterQuestion(3));
  else if (difficulty === 2 && chance(0.5)) extras.push(barterQuestion(2));
  return shuffle([
    goodsTable(),
    sortQuestion(TRADE_SORT, perBin(difficulty)),
    ...extras,
    ...levelled(TRADE_BANK, 6 - extras.length, difficulty),
  ]);
}

// ---------- Inventions & Timelines ----------

interface Event {
  id: string;
  label: string;
  emoji: string;
  year: number;
  date: string;
}

const EVENTS: Event[] = [
  { id: "farming", label: "Farming begins in the Fertile Crescent", emoji: "🌾", year: -10000, date: "about 10,000 BCE" },
  { id: "wheel", label: "Wheels are used in Mesopotamia", emoji: "🐂", year: -3500, date: "about 3500 BCE" },
  { id: "writing", label: "Cuneiform writing begins in Sumer", emoji: "🧱", year: -3200, date: "about 3200 BCE" },
  { id: "pyramid", label: "The Great Pyramid of Giza is built", emoji: "🔺", year: -2560, date: "about 2560 BCE" },
  { id: "hammurabi", label: "Hammurabi's laws are carved in stone", emoji: "⚖️", year: -1754, date: "about 1754 BCE" },
  { id: "alphabet", label: "The Phoenician alphabet develops", emoji: "🔤", year: -1050, date: "about 1050 BCE" },
  { id: "olympics", label: "The first recorded Olympic Games are held", emoji: "🏅", year: -776, date: "776 BCE" },
  { id: "republic", label: "Rome becomes a republic", emoji: "🏛️", year: -509, date: "509 BCE" },
  { id: "qin", label: "Qin Shi Huang unites China", emoji: "🐉", year: -221, date: "221 BCE" },
  { id: "augustus", label: "Augustus becomes the first Roman emperor", emoji: "👑", year: -27, date: "27 BCE" },
  { id: "paper", label: "Cai Lun improves papermaking in China", emoji: "📄", year: 105, date: "105 CE" },
  { id: "maya", label: "The Maya Classic period begins", emoji: "🌽", year: 250, date: "about 250 CE" },
  { id: "rome-ends", label: "The Western Roman Empire ends", emoji: "🏚️", year: 476, date: "476 CE" },
  { id: "islam", label: "Islam begins in Arabia", emoji: "🌙", year: 610, date: "about 610 CE" },
];

/** Pick `n` events at least `gap` years apart, in time order. */
function spacedEvents(n: number, gap: number): Event[] {
  for (let attempt = 0; attempt < 30; attempt++) {
    const picked: Event[] = [];
    for (const e of shuffle(EVENTS)) {
      if (picked.every((p) => Math.abs(p.year - e.year) >= gap)) picked.push(e);
      if (picked.length === n) return picked.sort((a, b) => a.year - b.year);
    }
  }
  return [EVENTS[0], EVENTS[3], EVENTS[7], EVENTS[12]].slice(0, n);
}

function timelineOrder(difficulty: Level): OrderQuestion {
  const events = difficulty === 1 ? spacedEvents(3, 1500) : difficulty === 2 ? spacedEvents(4, 400) : spacedEvents(5, 100);
  return {
    kind: "order",
    prompt: "Put these events on a timeline, earliest first.",
    hint: "BCE years count down toward year 1, so 3000 BCE is earlier than 500 BCE. After that, CE years count up: 100 CE is earlier than 600 CE.",
    items: events.map((e) => ({ id: e.id, label: `${e.date}: ${e.label}`, emoji: e.emoji })),
  };
}

const ARTIFACTS = [
  "clay tablet",
  "bronze mirror",
  "painted vase",
  "stone carving",
  "copper coin",
  "wooden comb",
  "woven basket",
  "glass bead",
];

function bceGap(difficulty: Level): InputQuestion {
  const [a, b] = sample(ARTIFACTS, 2);
  // Older dates are 1000–3500 BCE and newer ones 50–950 BCE, so the order is always clear.
  const [olderYear, newerYear] =
    difficulty === 1
      ? [randInt(10, 30) * 100, randInt(1, 9) * 100]
      : difficulty === 2
        ? [randInt(20, 60) * 50, randInt(2, 18) * 50]
        : [randInt(100, 350) * 10, randInt(5, 95) * 10];
  return {
    kind: "input",
    prompt: `A museum has a ${a} made in ${olderYear} BCE and a ${b} made in ${newerYear} BCE. How many years older is the ${a}?`,
    hint: `BCE years count down toward year 1, so the bigger BCE number is older. Subtract: ${olderYear} − ${newerYear}.`,
    answer: String(olderYear - newerYear),
    keypad: "number",
    suffix: "years",
    visual: {
      type: "table",
      title: "Museum labels",
      headers: ["Artifact", "Made in"],
      rows: [
        [a, `${olderYear} BCE`],
        [b, `${newerYear} BCE`],
      ],
    },
  };
}

function centuryQuestion(): Question {
  const n = randInt(2, 9);
  const year = (n - 1) * 100 + randInt(1, 99);
  const era = chance(0.5) ? "BCE" : "CE";
  const other = era === "BCE" ? "CE" : "BCE";
  return textChoice(
    `The year ${year} ${era} falls in which century?`,
    `the ${ordinal(n)} century ${era}`,
    [`the ${ordinal(n - 1)} century ${era}`, `the ${ordinal(n + 1)} century ${era}`, `the ${ordinal(n)} century ${other}`],
    "The 1st century is years 1 to 100, the 2nd century is 101 to 200, and so on. So a year in the 200s is in the 3rd century. BCE centuries work the same way, counting back from year 1.",
    { type: "letter", text: `${year} ${era}` },
  );
}

const INVENT_BANK: Item[] = [
  {
    prompt: "Cuneiform, one of the world's first writing systems, was made by pressing a reed into…",
    right: "wet clay tablets",
    wrong: ["sheets of paper", "wax candles", "silk scrolls"],
    hint: "Sumerian scribes used a cut reed to make wedge-shaped marks in clay, which then hardened.",
    emoji: "🧱",
  },
  {
    prompt: "What is Ancient Egyptian writing that uses picture symbols called?",
    right: "hieroglyphs",
    wrong: ["cuneiform", "oracle bones", "the Latin alphabet"],
    hint: "Hieroglyphs were carved on temples and tombs, and written on papyrus.",
  },
  {
    prompt: "Which people created an alphabet of about 22 letters that later Greek and Latin alphabets grew from?",
    right: "the Phoenicians",
    wrong: ["the Sumerians", "the Maya", "the Shang Chinese"],
    hint: "These Mediterranean sea traders needed a quick, simple way to keep records. Our own alphabet descends from theirs.",
    emoji: "🔤",
  },
  {
    prompt: "Why was writing such an important invention?",
    right: "It let people keep records, write down laws and pass on knowledge",
    wrong: ["It replaced the need for farming", "It was only used for decoration", "It made trade impossible"],
    hint: "Early writing was used for trade records and taxes, then for laws, history and stories.",
  },
  {
    prompt: "Why did the Romans build aqueducts?",
    right: "To carry fresh water to cities from far away",
    wrong: ["To store grain for the winter", "To defend cities from attacks", "To hold chariot races"],
    hint: "Aqueducts used a gentle downhill slope so gravity moved the water to fountains, baths and homes.",
    emoji: "🏛️",
  },
  {
    prompt: "Which invention came from ancient China?",
    right: "paper",
    wrong: ["cuneiform", "the aqueduct", "the Olympic Games"],
    hint: "Paper was made in Han China. Around 105 CE, an official named Cai Lun improved the process.",
    emoji: "📄",
  },
  {
    prompt: "The Maya developed an advanced number system. What did it include?",
    right: "a symbol for zero",
    wrong: ["only even numbers", "no numbers above ten", "letters instead of numbers"],
    hint: "The Maya were among the first peoples to use zero, which helped with their detailed calendars.",
    emoji: "🌽",
  },
  {
    prompt: "One early use of the wheel in Mesopotamia was…",
    right: "the potter's wheel, for shaping clay pots",
    wrong: ["bicycles", "printing presses", "mechanical clocks"],
    hint: "Spinning wheels helped potters make even, round pots. Wheels on carts came soon after.",
  },
  {
    prompt: "What does BCE stand for?",
    right: "Before the Common Era",
    wrong: ["Before Current Events", "British Calendar Era", "Beginning of Civilization Era"],
    hint: "BCE years count down toward year 1. CE (Common Era) years count up from year 1.",
  },
  {
    prompt: "Why did the Romans build a huge network of roads?",
    right: "To move armies, trade goods and messages quickly across the empire",
    wrong: ["To mark the edges of farms", "To give chariots a place to race", "Because walking on grass was not allowed"],
    hint: "Straight, paved Roman roads connected cities across Europe, North Africa and Southwest Asia.",
  },
  {
    prompt: "Which famous Roman building, finished around 125 CE, still has the world's largest unreinforced concrete dome?",
    right: "the Pantheon",
    wrong: ["the Great Pyramid", "the Parthenon", "the Great Wall"],
    hint: "This temple in Rome has a round opening at the top of its dome. The Parthenon is in Athens and has no dome.",
    hard: true,
  },
  {
    prompt: "How did the Egyptians use the Nile's yearly flood to build an important tool?",
    right: "They based a 365-day calendar on it",
    wrong: ["They invented the compass", "They built the first aqueducts", "They used it to make paper money"],
    hint: "Tracking the flood each year helped Egyptians count the days in a year.",
    hard: true,
  },
  {
    prompt: "The Archimedes screw, named after a Greek inventor, was used to…",
    right: "lift water uphill for irrigation",
    wrong: ["tell the time", "carve stone statues", "send messages over long distances"],
    hint: "Turning a screw inside a tube scoops water up from a river or ditch.",
    hard: true,
  },
  {
    prompt: "In 132 CE, the Chinese scientist Zhang Heng built an instrument that could detect…",
    right: "earthquakes",
    wrong: ["rainfall", "eclipses", "wind speed"],
    hint: "When the ground shook, a bronze ball dropped from a dragon's mouth into a toad's mouth, showing the direction.",
    emoji: "🐉",
    hard: true,
  },
  {
    prompt: "Why do many historians use BCE and CE?",
    right: "They are neutral labels for the same year numbers as BC and AD",
    wrong: ["They use completely different year numbers", "They only work for European history", "They start counting from the first pyramid"],
    hint: "500 BCE is the same year as 500 BC. The labels don't refer to any one religion.",
    hard: true,
  },
  {
    prompt: "The Romans made a strong building material that could even harden underwater. What was it?",
    right: "concrete",
    wrong: ["papyrus", "bronze", "silk"],
    hint: "Roman concrete mixed lime with volcanic ash. Harbours built with it still survive.",
    hard: true,
  },
];

function inventionsTimelines({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const extras = difficulty === 3 ? [centuryQuestion()] : [];
  return [
    timelineOrder(difficulty),
    ...shuffle([bceGap(difficulty), ...extras, ...levelled(INVENT_BANK, 6 - extras.length, difficulty)]),
  ];
}

export const course: Course = {
  grade: "7",
  subject: "social",
  bigIdeas: {
    "ca-bc": [
      "Geographic conditions shaped the emergence of civilizations.",
      "Religious and cultural practices that emerged during this period have endured and continue to influence people.",
      "Increasingly complex societies required new systems of laws and government.",
      "Economic specialization and trade networks can lead to conflict and cooperation between societies.",
    ],
  },
  units: [
    {
      id: "first-farmers",
      title: "First Farmers",
      emoji: "🌾",
      blurb: "From hunting to farming villages",
      parentNote:
        "The long story of early humans, how farming began about 12,000 years ago, domestication, food surpluses, and how settling down led to specialized jobs and the first cities.",
      standards: {
        "ca-bc": "Human and environmental factors that shaped early civilizations: the shift from hunting and gathering to agriculture",
      },
      generate: firstFarmers,
    },
    {
      id: "where-civilizations-grew",
      title: "Where Civilizations Grew",
      emoji: "🏞️",
      blurb: "Rivers, mountains and seas",
      parentNote:
        "How geography shaped Mesopotamia, Egypt, the Indus Valley and Shang China along their rivers, plus Greece, Rome and the Maya. Includes a reading passage about the Nile flood.",
      standards: {
        "ca-bc": "Geographic conditions and the rise of civilizations: river valleys, Greece, Rome and the Maya",
      },
      generate: whereCivilizationsGrew,
    },
    {
      id: "laws-and-government",
      title: "Laws & Government",
      emoji: "⚖️",
      blurb: "Codes, citizens and emperors",
      parentNote:
        "Hammurabi's code (with a reading passage), Athenian democracy, the Roman Republic and Empire, the Mandate of Heaven, and Egypt's social pyramid.",
      standards: {
        "ca-bc": "Systems of law and government: Code of Hammurabi, Athenian democracy, the Roman Republic and Empire; social structures",
      },
      generate: lawsAndGovernment,
    },
    {
      id: "world-beliefs",
      title: "World Beliefs",
      emoji: "🕊️",
      blurb: "Origins of major belief systems",
      parentNote:
        "Where and when major religions and philosophies began (Judaism, Hinduism, Buddhism, Confucianism, Daoism, Christianity, Islam), their key figures, texts and ideas, described respectfully and factually.",
      standards: {
        "ca-bc": "Origins, core beliefs and spread of religions and philosophies that continue to influence people",
      },
      generate: worldBeliefs,
    },
    {
      id: "trade-networks",
      title: "Trade Networks",
      emoji: "🐫",
      blurb: "Silk Road, barter and coins",
      parentNote:
        "Specialization, barter and the first coins, the Silk Road and sea routes (with a reading passage and goods table), and how trade led to both cooperation and conflict.",
      standards: {
        "ca-bc": "Economic specialization and trade networks such as the Silk Road; cooperation and conflict between societies",
      },
      generate: tradeNetworks,
    },
    {
      id: "inventions-and-timelines",
      title: "Inventions & Timelines",
      emoji: "📜",
      blurb: "Writing, wheels and BCE/CE",
      parentNote:
        "Writing systems, the wheel, aqueducts, paper, concrete and other innovations, plus timeline skills: ordering BCE and CE dates, finding the years between BCE dates, and naming centuries.",
      standards: {
        "ca-bc": "Technologies and innovations of ancient civilizations; chronology using BCE and CE",
      },
      generate: inventionsTimelines,
    },
  ],
};
