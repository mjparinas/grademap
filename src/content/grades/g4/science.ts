import { chance, pick, randInt, sample, shuffle, textChoice } from "../../random";
import type { Course, GenerateOptions, InputQuestion, OrderQuestion, Question, Visual } from "../../types";
import { fromBank, sortQuestion, type BankItem, type SortSet } from "../../bank";

// Bank items marked `hard` are stretch questions. Difficulty 1 uses only the
// easier items, 2 mixes in about a third, 3 is mostly stretch.
type Item = BankItem & { hard?: true };
type Level = 1 | 2 | 3;

function levelled(bank: Item[], count: number, difficulty: Level): Question[] {
  const easy = bank.filter((b) => !b.hard);
  const hard = bank.filter((b) => b.hard);
  const want = difficulty === 1 ? 0 : difficulty === 2 ? Math.ceil(count / 3) : Math.ceil((count * 2) / 3);
  const nHard = Math.min(want, hard.length);
  return [...fromBank(easy, count - nHard), ...fromBank(hard, nHard)];
}

/** Smaller two-basket sorts at difficulty 1, bigger ones at 3. */
const perBin = (difficulty: Level) => (difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4);

// =====================================================================
// Sense & Respond
// =====================================================================

const RESPOND_SORT: SortSet = {
  prompt: "Who is responding: a plant or an animal? Tap an item, then tap its basket.",
  hint: "Plants respond slowly, by growing, bending or dropping leaves. Animals can move their whole bodies, change their fur, or sleep through winter.",
  bins: [
    { id: "plant", label: "plant", emoji: "🪴" },
    { id: "animal", label: "animal", emoji: "🐾" },
  ],
  items: [
    { label: "stem bends toward a sunny window", emoji: "🪟", bin: "plant" },
    { label: "roots grow down into the soil", emoji: "🌱", bin: "plant" },
    { label: "flytrap snaps shut when touched", emoji: "🪰", bin: "plant" },
    { label: "tree drops its leaves in autumn", emoji: "🍂", bin: "plant" },
    { label: "tendril curls around a stick", emoji: "🌿", bin: "plant" },
    { label: "flower closes up at night", emoji: "🌷", bin: "plant" },
    { label: "bat hibernates in a cave", emoji: "🦇", bin: "animal" },
    { label: "geese fly south for the winter", emoji: "🐦", bin: "animal" },
    { label: "rabbit freezes when it spots a hawk", emoji: "🐇", bin: "animal" },
    { label: "cat's pupils shrink in bright light", emoji: "🐈", bin: "animal" },
    { label: "snowshoe hare's fur turns white", emoji: "❄️", bin: "animal" },
    { label: "dog wags its tail when you get home", emoji: "🐕", bin: "animal" },
  ],
};

const BELL_ORDER: OrderQuestion = {
  kind: "order",
  prompt: "The school bell rings. Put the steps of your response in order.",
  hint: "Your senses notice first. Nerves carry the message to your brain, your brain decides, then your muscles move.",
  items: [
    { id: "ears", label: "Your ears sense the sound", emoji: "👂" },
    { id: "nerves", label: "Nerves carry a message to your brain", emoji: "⚡" },
    { id: "brain", label: "Your brain decides what to do", emoji: "🧠" },
    { id: "muscles", label: "Your muscles move you to line up", emoji: "🏃" },
  ],
};

const REFLEX_ORDER: OrderQuestion = {
  kind: "order",
  prompt: "You touch a hot pan by accident. Put this fast reflex in order.",
  hint: "A reflex is a shortcut! The message goes to your spinal cord and straight back to your muscles. Your brain notices the pain a moment later.",
  items: [
    { id: "skin", label: "Nerves in your skin sense the heat", emoji: "✋" },
    { id: "to-cord", label: "A message zips to your spinal cord", emoji: "⚡" },
    { id: "back", label: "Your spinal cord sends a message right back", emoji: "↩️" },
    { id: "pull", label: "Arm muscles pull your hand away", emoji: "💪" },
    { id: "ouch", label: "Your brain notices: \"Ouch, hot!\"", emoji: "🧠" },
  ],
};

const SENSE_BANK: Item[] = [
  {
    prompt: "Which sense organ helps you notice smoke from a campfire?",
    right: { label: "nose", emoji: "👃" },
    wrong: [
      { label: "ears", emoji: "👂" },
      { label: "tongue", emoji: "👅" },
      { label: "skin", emoji: "✋" },
    ],
    hint: "Tiny particles of smoke float into your nose, and your nose senses the smell.",
  },
  {
    prompt: "Something in the environment that a living thing reacts to is called a…",
    right: "stimulus",
    wrong: ["response", "habitat", "fossil"],
    hint: "A stimulus is what you sense (like a loud noise). A response is what you do about it (like jumping).",
    emoji: "📢",
  },
  {
    prompt: "Which body part receives messages from your senses and decides what to do?",
    right: { label: "brain", emoji: "🧠" },
    wrong: [
      { label: "stomach", emoji: "🍽️" },
      { label: "heart", emoji: "❤️" },
      { label: "lungs", emoji: "🫁" },
    ],
    hint: "Your brain is the control centre of your nervous system.",
  },
  {
    prompt: "Your nervous system is made of your brain, your spinal cord and your…",
    right: "nerves",
    wrong: ["bones", "muscles", "teeth"],
    hint: "Nerves are like wires that carry messages between your body and your brain.",
    emoji: "🧠",
  },
  {
    prompt: "How do bats find flying insects in the dark?",
    right: "They listen for echoes of their own calls",
    wrong: ["Their eyes glow like flashlights", "They feel the insects with their wings", "They follow the moonlight"],
    hint: "Bats make high-pitched sounds. The sounds bounce off insects, and bats listen for the echoes. This is called echolocation.",
    emoji: "🦇",
  },
  {
    prompt: "A plant on a windowsill slowly bends toward the window. What is it responding to?",
    right: { label: "light", emoji: "☀️" },
    wrong: [
      { label: "sound", emoji: "🔊" },
      { label: "the colour of its pot", emoji: "🎨" },
      { label: "the smell of the kitchen", emoji: "🍳" },
    ],
    hint: "Plants need light to make food, so their stems grow toward the light.",
    emoji: "🪴",
  },
  {
    prompt: "On a hot day, your body sweats. How does sweating help you?",
    right: "It cools you down",
    wrong: ["It warms you up", "It helps you hear better", "It makes you grow taller"],
    hint: "When sweat dries on your skin, it carries heat away. That's your body responding to heat!",
    emoji: "🥵",
  },
  {
    prompt: "You walk out of a dark room into bright sunshine. What do your pupils do?",
    right: "They get smaller",
    wrong: ["They get bigger", "They change colour", "They stay exactly the same"],
    hint: "Pupils shrink in bright light to let in less light and protect your eyes.",
    emoji: "👀",
  },
  {
    prompt: "Many trees drop their leaves in autumn. What are they responding to?",
    right: "Shorter days and colder weather",
    wrong: ["Longer, warmer days", "Birds singing in the branches", "People raking the yard"],
    hint: "When days get shorter and colder, many trees drop their leaves to save water and energy for winter.",
    emoji: "🍂",
  },
  {
    prompt: "Which response helps an animal survive a cold winter?",
    right: { label: "A bat hibernates in a cave", emoji: "🦇" },
    wrong: [
      { label: "A dog chases a ball", emoji: "🐕" },
      { label: "A cat purrs on a lap", emoji: "🐈" },
      { label: "A bird sings in spring", emoji: "🐦" },
    ],
    hint: "Hibernating saves energy when food is hard to find in winter.",
  },
  {
    prompt: "Salmon swim back to the stream where they hatched. Which sense helps them find it?",
    right: { label: "smell", emoji: "👃" },
    wrong: [
      { label: "sight", emoji: "👀" },
      { label: "hearing", emoji: "👂" },
      { label: "taste", emoji: "👅" },
    ],
    hint: "Each stream has its own smell. Salmon remember the smell of home and follow it back.",
    emoji: "🐟",
    hard: true,
  },
  {
    prompt: "Why do you pull your hand off something hot before you even feel the pain?",
    right: "It's a reflex: your spinal cord sends the message back fast",
    wrong: ["Your eyes see the heat first", "Your hand muscles can think on their own", "Your ears hear the heat"],
    hint: "In a reflex, the message takes a shortcut through your spinal cord, so you move before your brain notices.",
    emoji: "✋",
    hard: true,
  },
  {
    prompt: "A Venus flytrap snaps shut when an insect touches tiny hairs inside it. What is the stimulus?",
    right: "The insect touching the hairs",
    wrong: ["The trap snapping shut", "The green colour of the leaf", "The soil around the roots"],
    hint: "The stimulus is what the plant senses. The response is what the plant does.",
    emoji: "🪰",
    hard: true,
  },
  {
    prompt: "Some snakes, like rattlesnakes, can find a mouse in the dark. What do they sense?",
    right: { label: "the mouse's body heat", emoji: "🔥" },
    wrong: [
      { label: "the mouse's colours", emoji: "🎨" },
      { label: "echoes from their calls", emoji: "🔊" },
      { label: "moonlight on the mouse", emoji: "🌙" },
    ],
    hint: "Rattlesnakes have special pits on their faces that sense heat from warm animals.",
    emoji: "🐍",
    hard: true,
  },
  {
    prompt: "A shark can find a fish hiding under the sand. Which special sense helps?",
    right: "Sensing tiny electric signals from the fish",
    wrong: ["Seeing right through the sand", "Using echoes like a bat", "Feeling the sun's heat"],
    hint: "Every animal's muscles give off tiny electric signals. Sharks have special spots on their snouts that sense them.",
    emoji: "🦈",
    hard: true,
  },
  {
    prompt: "A snowshoe hare's fur turns from brown to white in winter. How does this help it?",
    right: "It blends in with the snow",
    wrong: ["It keeps the hare cooler", "It helps the hare run faster", "It helps the hare see in the dark"],
    hint: "White fur on white snow is hard for a lynx or a fox to spot. The change is a response to shorter days.",
    emoji: "🐇",
    hard: true,
  },
  {
    prompt: "Why do plant roots grow downward, even if a seed is planted upside down?",
    right: "Roots sense gravity and grow toward it",
    wrong: ["Roots are afraid of the light", "Worms pull the roots down", "Rain pushes the roots down"],
    hint: "Roots respond to gravity by growing down, where they can find water and hold the plant in place.",
    emoji: "🌱",
    hard: true,
  },
];

function senseRespond({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const order = difficulty === 3 || (difficulty === 2 && chance(0.4)) ? REFLEX_ORDER : BELL_ORDER;
  return [order, ...shuffle([sortQuestion(RESPOND_SORT, perBin(difficulty)), ...levelled(SENSE_BANK, 6, difficulty)])];
}

// =====================================================================
// Biomes
// =====================================================================

interface Biome {
  name: string;
  emoji: string;
  temperature: string;
  precipitation: string;
  plants: string;
  animals: string;
}

const BIOMES: Biome[] = [
  {
    name: "tundra",
    emoji: "❄️",
    temperature: "Very cold most of the year; short, cool summers",
    precipitation: "Very little",
    plants: "Mosses, lichens and low shrubs; no trees",
    animals: "Caribou, Arctic foxes, snowy owls",
  },
  {
    name: "boreal forest",
    emoji: "🌲",
    temperature: "Long, cold winters and short, warm summers",
    precipitation: "Medium, with lots of snow",
    plants: "Thick forests of spruce, pine and fir",
    animals: "Moose, lynx, black bears",
  },
  {
    name: "temperate deciduous forest",
    emoji: "🍁",
    temperature: "Four seasons: warm summers and cold winters",
    precipitation: "Plenty, all through the year",
    plants: "Maple and oak trees that drop their leaves in autumn",
    animals: "Deer, raccoons, squirrels",
  },
  {
    name: "grassland",
    emoji: "🌾",
    temperature: "Hot summers and cold winters",
    precipitation: "Enough for grass, but not much",
    plants: "Grasses and wildflowers; very few trees",
    animals: "Bison, prairie dogs, hawks",
  },
  {
    name: "desert",
    emoji: "🌵",
    temperature: "Often very hot days and cool nights",
    precipitation: "Less than 25 cm in a whole year",
    plants: "Cacti and tough shrubs that store water",
    animals: "Lizards, scorpions, camels",
  },
  {
    name: "tropical rainforest",
    emoji: "🌴",
    temperature: "Hot all year long",
    precipitation: "Heavy rain almost every day",
    plants: "Very tall trees, vines and huge leaves",
    animals: "Monkeys, parrots, sloths",
  },
];

/** Read a clue table and name the biome. */
function biomeDetective(d: Level): Question {
  const biome = pick(BIOMES);
  const rows: string[][] = [
    ["Temperature", biome.temperature],
    ["Rain and snow", biome.precipitation],
    ["Plants", biome.plants],
  ];
  if (d < 3) rows.push(["Animals", biome.animals]);
  const wrong = sample(
    BIOMES.filter((b) => b !== biome),
    3,
  ).map((b) => ({ label: b.name, emoji: b.emoji }));
  return textChoice(
    "Biome detective! Which biome matches these clues?",
    { label: biome.name, emoji: biome.emoji },
    wrong,
    `Look at the plants first, then the temperature and rain. These clues describe the ${biome.name}.`,
    { type: "table", title: "Field notes", headers: ["Clue", "What we found"], rows },
  );
}

/** Read a bar graph of yearly rain and snow. */
function rainfallGraph(d: Level): Question {
  const letters = shuffle(["A", "B", "C", "D"]);
  const desert = randInt(1, 4) * 5; // 5–20 cm
  const grass = randInt(6, 10) * 5; // 30–50 cm
  const forest = randInt(18, 28) * 5; // 90–140 cm
  const rain = randInt(46, 70) * 5; // 230–350 cm
  const places = [
    { letter: letters[0], value: desert, kind: "desert" },
    { letter: letters[1], value: grass, kind: "grassland" },
    { letter: letters[2], value: forest, kind: "forest" },
    { letter: letters[3], value: rain, kind: "rainforest" },
  ].sort((a, b) => a.letter.localeCompare(b.letter));
  const visual: Visual = {
    type: "bars",
    title: "Rain and snow in one year (cm)",
    bars: places.map((p) => ({ label: `Place ${p.letter}`, value: p.value })),
  };
  const dry = places.find((p) => p.kind === "desert")!;
  const wet = places.find((p) => p.kind === "rainforest")!;

  if (d === 3 && chance(0.5)) {
    const q: InputQuestion = {
      kind: "input",
      prompt: `How many more centimetres of rain and snow does Place ${wet.letter} get than Place ${dry.letter}?`,
      hint: `Subtract: ${wet.value} − ${dry.value}. Place ${wet.letter} is the wet rainforest and Place ${dry.letter} is the dry desert.`,
      answer: String(wet.value - dry.value),
      keypad: "number",
      suffix: "cm",
      visual,
    };
    return q;
  }
  const askDesert = chance(0.5);
  const target = askDesert ? dry : wet;
  return textChoice(
    askDesert ? "Which place is most likely a desert?" : "Which place is most likely a tropical rainforest?",
    `Place ${target.letter}`,
    places.filter((p) => p !== target).map((p) => `Place ${p.letter}`),
    askDesert
      ? "A desert gets less than 25 cm of rain and snow in a whole year. Look for the shortest bar."
      : "A tropical rainforest gets heavy rain almost every day. Look for the tallest bar.",
    visual,
  );
}

const BIOME_SORT: SortSet = {
  prompt: "Which biome is each living thing adapted to? Tap an item, then tap its basket.",
  hint: "Deserts are dry, the tundra is cold with no trees, and tropical rainforests are hot and wet.",
  bins: [
    { id: "desert", label: "desert", emoji: "🌵" },
    { id: "tundra", label: "tundra", emoji: "❄️" },
    { id: "rainforest", label: "tropical rainforest", emoji: "🌴" },
  ],
  items: [
    { label: "camel", emoji: "🐪", bin: "desert" },
    { label: "lizard", emoji: "🦎", bin: "desert" },
    { label: "scorpion", emoji: "🦂", bin: "desert" },
    { label: "Arctic fox", emoji: "🦊", bin: "tundra" },
    { label: "caribou", emoji: "🦌", bin: "tundra" },
    { label: "snowy owl", emoji: "🦉", bin: "tundra" },
    { label: "parrot", emoji: "🦜", bin: "rainforest" },
    { label: "sloth", emoji: "🦥", bin: "rainforest" },
    { label: "monkey", emoji: "🐒", bin: "rainforest" },
  ],
};

const BIOME_BANK: Item[] = [
  {
    prompt: "What is a biome?",
    right: "A large region with a similar climate, plants and animals",
    wrong: ["A single tree and the bugs on it", "A kind of rock found in caves", "A weather report for one day"],
    hint: "Biomes are huge areas, like deserts or forests, where the climate and living things are alike.",
    emoji: "🌍",
  },
  {
    prompt: "Which biome covers much of northern Canada with evergreen trees like spruce?",
    right: { label: "boreal forest", emoji: "🌲" },
    wrong: [
      { label: "tropical rainforest", emoji: "🌴" },
      { label: "desert", emoji: "🌵" },
      { label: "grassland", emoji: "🌾" },
    ],
    hint: "The boreal forest stretches right across Canada. It is Canada's largest biome.",
  },
  {
    prompt: "In which biome is the ground frozen all year, just below the surface?",
    right: { label: "tundra", emoji: "❄️" },
    wrong: [
      { label: "grassland", emoji: "🌾" },
      { label: "tropical rainforest", emoji: "🌴" },
      { label: "temperate deciduous forest", emoji: "🍁" },
    ],
    hint: "Frozen ground that never thaws is called permafrost. It's found in the tundra.",
  },
  {
    prompt: "Which biome is hot and rainy all year long?",
    right: { label: "tropical rainforest", emoji: "🌴" },
    wrong: [
      { label: "tundra", emoji: "❄️" },
      { label: "boreal forest", emoji: "🌲" },
      { label: "desert", emoji: "🌵" },
    ],
    hint: "Tropical rainforests are near the equator, where it is warm and wet every month.",
  },
  {
    prompt: "A cactus stores water in its thick stem. Which biome is it adapted to?",
    right: { label: "desert", emoji: "🏜️" },
    wrong: [
      { label: "tundra", emoji: "❄️" },
      { label: "tropical rainforest", emoji: "🌴" },
      { label: "ocean", emoji: "🌊" },
    ],
    hint: "Storing water helps a cactus survive in a place with very little rain.",
    emoji: "🌵",
  },
  {
    prompt: "The Canadian Prairies are part of which biome?",
    right: { label: "grassland", emoji: "🌾" },
    wrong: [
      { label: "tundra", emoji: "❄️" },
      { label: "tropical rainforest", emoji: "🌴" },
      { label: "desert", emoji: "🌵" },
    ],
    hint: "The Prairies are wide, open land covered in grasses, with few trees.",
  },
  {
    prompt: "In which biome do maple and oak trees drop their leaves every autumn?",
    right: { label: "temperate deciduous forest", emoji: "🍁" },
    wrong: [
      { label: "tundra", emoji: "❄️" },
      { label: "desert", emoji: "🌵" },
      { label: "tropical rainforest", emoji: "🌴" },
    ],
    hint: "Deciduous means 'falling off'. These forests have four seasons, and the leaves fall in autumn.",
  },
  {
    prompt: "Thick white fur helps an Arctic fox survive in the…",
    right: { label: "tundra", emoji: "❄️" },
    wrong: [
      { label: "desert", emoji: "🌵" },
      { label: "tropical rainforest", emoji: "🌴" },
      { label: "grassland", emoji: "🌾" },
    ],
    hint: "Thick fur keeps it warm, and white fur blends in with the snow.",
    emoji: "🦊",
  },
  {
    prompt: "Why are there no trees in the tundra?",
    right: "The ground is frozen and summers are short and cool",
    wrong: ["There is too much rain", "It is too hot for trees", "Animals eat every seed"],
    hint: "Tree roots can't grow deep into frozen ground, and the growing season is very short.",
    emoji: "❄️",
    hard: true,
  },
  {
    prompt: "What makes a place a desert?",
    right: "It gets very little rain or snow",
    wrong: ["It is always hot", "It is covered in sand dunes", "It has camels"],
    hint: "Deserts are dry, not always hot. Antarctica is a cold desert!",
    emoji: "🏜️",
    hard: true,
  },
  {
    prompt: "Which biome is home to more than half of all the kinds of plants and animals on Earth?",
    right: { label: "tropical rainforests", emoji: "🌴" },
    wrong: [
      { label: "tundra", emoji: "❄️" },
      { label: "deserts", emoji: "🌵" },
      { label: "grasslands", emoji: "🌾" },
    ],
    hint: "Warmth and lots of rain all year let a huge variety of living things grow in rainforests.",
    hard: true,
  },
  {
    prompt: "Why do evergreen trees in the boreal forest have needles instead of wide leaves?",
    right: "Needles lose less water and let snow slide off",
    wrong: ["Needles help the trees grow fruit", "Needles keep all birds away", "Needles soak up more sunlight in summer"],
    hint: "Thin, waxy needles hold on to water in winter, and the tree's shape helps heavy snow slide off.",
    emoji: "🌲",
    hard: true,
  },
  {
    prompt: "Many grassland animals, like prairie dogs, live in burrows. How does this help them?",
    right: "Burrows protect them from heat, cold and predators",
    wrong: ["Burrows help them catch fish", "Burrows help them climb trees", "Burrows keep them wet all day"],
    hint: "Grasslands have few trees to hide in, so going underground is a good way to stay safe.",
    emoji: "🌾",
    hard: true,
  },
  {
    prompt: "Which is the largest biome on Earth?",
    right: { label: "ocean", emoji: "🌊" },
    wrong: [
      { label: "desert", emoji: "🌵" },
      { label: "tundra", emoji: "❄️" },
      { label: "grassland", emoji: "🌾" },
    ],
    hint: "Salt water covers about 70% of Earth's surface!",
    hard: true,
  },
];

function biomes({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return shuffle([
    biomeDetective(difficulty),
    rainfallGraph(difficulty),
    sortQuestion(BIOME_SORT, difficulty === 1 ? 1 : 2),
    ...levelled(BIOME_BANK, 5, difficulty),
  ]);
}

// =====================================================================
// Phase Changes
// =====================================================================

const STATE_EMOJI: Record<string, string> = { solid: "🧊", liquid: "💧", gas: "♨️" };

const PHASE_CHANGES = [
  { from: "solid", to: "liquid", name: "melting", basic: true, tip: "Think of ice cream melting on a hot day." },
  { from: "liquid", to: "solid", name: "freezing", basic: true, tip: "Think of a pond freezing in winter." },
  { from: "liquid", to: "gas", name: "evaporation", basic: true, tip: "Think of a puddle drying up in the sun." },
  { from: "gas", to: "liquid", name: "condensation", basic: true, tip: "Think of water drops forming on a cold glass." },
  { from: "solid", to: "gas", name: "sublimation", basic: false, tip: "Think of dry ice turning straight into gas." },
  { from: "gas", to: "solid", name: "deposition", basic: false, tip: "Think of frost forming on a cold window." },
];

function phaseNameQuestion(d: Level): Question {
  const pool = d === 1 ? PHASE_CHANGES.filter((p) => p.basic) : PHASE_CHANGES;
  const p = pick(pool);
  const visual: Visual = { type: "emoji", emoji: `${STATE_EMOJI[p.from]}➡️${STATE_EMOJI[p.to]}`, caption: `${p.from} → ${p.to}` };
  if (d === 3 && chance(0.5)) {
    return textChoice(
      `Which change of state is ${p.name}?`,
      `${p.from} → ${p.to}`,
      sample(
        PHASE_CHANGES.filter((o) => o !== p),
        3,
      ).map((o) => `${o.from} → ${o.to}`),
      `${p.name[0].toUpperCase()}${p.name.slice(1)} changes a ${p.from} into a ${p.to}. ${p.tip}`,
      { type: "letter", text: p.name },
    );
  }
  return textChoice(
    `What is the change from a ${p.from} to a ${p.to} called?`,
    p.name,
    sample(
      pool.filter((o) => o !== p),
      3,
    ).map((o) => o.name),
    `${p.tip} That change from ${p.from} to ${p.to} is called ${p.name}.`,
    visual,
  );
}

const PHASE_SORT: SortSet = {
  prompt: "Is heat being added or taken away? Tap an item, then tap its basket.",
  hint: "Melting, evaporation and sublimation need heat added. Freezing, condensation and deposition happen when heat is taken away.",
  bins: [
    { id: "add", label: "heat added", emoji: "🔥" },
    { id: "remove", label: "heat taken away", emoji: "❄️" },
  ],
  items: [
    { label: "ice cream melts on a hot day", emoji: "🍦", bin: "add" },
    { label: "a puddle dries up in the sun", emoji: "☀️", bin: "add" },
    { label: "butter melts in a warm pan", emoji: "🧈", bin: "add" },
    { label: "water boils in a kettle", emoji: "♨️", bin: "add" },
    { label: "dry ice turns into gas", emoji: "🌫️", bin: "add" },
    { label: "a pond freezes over", emoji: "🧊", bin: "remove" },
    { label: "frost forms on a window", emoji: "🪟", bin: "remove" },
    { label: "drops form on a cold glass", emoji: "🥤", bin: "remove" },
    { label: "melted candle wax hardens", emoji: "🕯️", bin: "remove" },
    { label: "dew forms on cool grass", emoji: "🌱", bin: "remove" },
  ],
};

const ICE_ORDER: OrderQuestion = {
  kind: "order",
  prompt: "An ice cube sits in a pot on a hot stove. Put what you would see in order.",
  hint: "Heat melts the solid into a liquid. More heat makes the liquid evaporate into a gas.",
  items: [
    { id: "solid", label: "solid ice", emoji: "🧊" },
    { id: "liquid", label: "liquid water", emoji: "💧" },
    { id: "gas", label: "water vapour rising (gas)", emoji: "♨️" },
  ],
};

const CYCLE_ORDER: OrderQuestion = {
  kind: "order",
  prompt: "Put the steps of the water cycle in order, starting with the sun.",
  hint: "The sun's heat makes water evaporate. The vapour cools and condenses into clouds, then falls as rain or snow.",
  items: [
    { id: "sun", label: "The sun heats water in a lake", emoji: "☀️" },
    { id: "evap", label: "Water evaporates into the air", emoji: "♨️" },
    { id: "cond", label: "Water vapour condenses into clouds", emoji: "☁️" },
    { id: "precip", label: "Rain or snow falls back down", emoji: "🌧️" },
  ],
};

const PHASE_BANK: Item[] = [
  {
    prompt: "Water drops form on the outside of a cold glass of juice. What is this change called?",
    right: "condensation",
    wrong: ["evaporation", "melting", "freezing"],
    hint: "Water vapour in the air touches the cold glass, cools down and turns back into liquid drops.",
    emoji: "🥤",
  },
  {
    prompt: "Wet clothes on a clothesline dry in the sun. Where did the water go?",
    right: "It evaporated into the air as water vapour",
    wrong: ["It soaked into the clothespins", "It froze into tiny ice cubes", "It was destroyed and is gone forever"],
    hint: "Heat from the sun turns liquid water into an invisible gas called water vapour.",
    emoji: "👕",
  },
  {
    prompt: "Which change turns a liquid into a solid?",
    right: "freezing",
    wrong: ["melting", "evaporation", "condensation"],
    hint: "Liquid water in a freezer becomes solid ice. That's freezing.",
    emoji: "🧊",
  },
  {
    prompt: "A chocolate bar in your pocket turns soft and gooey on a hot day. What is happening?",
    right: "melting",
    wrong: ["freezing", "condensation", "deposition"],
    hint: "Heat is changing the solid chocolate into a liquid.",
    emoji: "🍫",
  },
  {
    prompt: "What are the three common states of matter?",
    right: "solid, liquid and gas",
    wrong: ["hot, warm and cold", "ice, rain and snow", "rock, water and air"],
    hint: "Water can be a solid (ice), a liquid (water) or a gas (water vapour).",
    emoji: "🧪",
  },
  {
    prompt: "To turn liquid water into ice, you need to…",
    right: "take heat away",
    wrong: ["add heat", "shake it hard", "pour it into a bigger cup"],
    hint: "Cooling water takes heat away. When it gets cold enough (0 °C), it freezes.",
    emoji: "❄️",
  },
  {
    prompt: "Which is an example of evaporation?",
    right: { label: "a puddle drying up after rain", emoji: "☀️" },
    wrong: [
      { label: "a lake freezing in winter", emoji: "🧊" },
      { label: "frost on a car window", emoji: "🚗" },
      { label: "an icicle growing", emoji: "❄️" },
    ],
    hint: "Evaporation turns a liquid into a gas. The puddle's water goes into the air.",
  },
  {
    prompt: "At what temperature does pure water freeze?",
    right: "0 °C",
    wrong: ["100 °C", "50 °C", "25 °C"],
    hint: "Water freezes at 0 degrees Celsius and boils at 100 degrees Celsius.",
    emoji: "🌡️",
  },
  {
    prompt: "On a freezing, sunny day, a snowbank shrinks without melting. The snow turns straight into gas. This is…",
    right: "sublimation",
    wrong: ["condensation", "deposition", "freezing"],
    hint: "Sublimation is when a solid skips the liquid stage and turns straight into a gas.",
    emoji: "☃️",
    hard: true,
  },
  {
    prompt: "On a cold night, water vapour turns straight into ice crystals on a window. This is called…",
    right: "deposition",
    wrong: ["sublimation", "melting", "evaporation"],
    hint: "Deposition is when a gas skips the liquid stage and turns straight into a solid, like frost.",
    emoji: "🪟",
    hard: true,
  },
  {
    prompt: "Which two changes need heat to be added?",
    right: "melting and evaporation",
    wrong: ["freezing and condensation", "condensation and deposition", "freezing and deposition"],
    hint: "Adding heat makes particles move faster: solids melt into liquids, and liquids evaporate into gases.",
    emoji: "🔥",
    hard: true,
  },
  {
    prompt: "Tiny drops of water cover the grass in the morning, but it didn't rain. Where did they come from?",
    right: "Water vapour in the air condensed on the cool grass",
    wrong: ["The grass pushed water up from its roots", "Ice in the soil sublimated", "Clouds melted onto the lawn"],
    hint: "This is dew. Overnight the grass cools, and water vapour in the air condenses on it.",
    emoji: "🌱",
    hard: true,
  },
  {
    prompt: "When water freezes into ice, what happens to the space it takes up?",
    right: "It expands and takes up more space",
    wrong: ["It shrinks to half its size", "It takes up no space at all", "It always stays exactly the same"],
    hint: "Water expands when it freezes. That's why a full bottle of water can crack in the freezer!",
    emoji: "🧊",
    hard: true,
  },
];

function phaseChanges({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const order = difficulty === 1 ? ICE_ORDER : difficulty === 3 ? CYCLE_ORDER : pick([ICE_ORDER, CYCLE_ORDER]);
  return [
    order,
    ...shuffle([
      phaseNameQuestion(difficulty),
      sortQuestion(PHASE_SORT, perBin(difficulty)),
      ...levelled(PHASE_BANK, 5, difficulty),
    ]),
  ];
}

// =====================================================================
// Particles & Mass
// =====================================================================

const NAMES = ["Maya", "Jay", "Sam", "Amir", "Lena", "Kenji", "Zoe", "Ravi", "Ana", "Noah", "Priya", "Leo"];

function massInput(prompt: string, answer: number, hint: string): InputQuestion {
  return {
    kind: "input",
    prompt,
    hint,
    answer: String(answer),
    keypad: "number",
    suffix: "g",
    visual: { type: "emoji", emoji: "⚖️" },
  };
}

const MASS_TYPES: Record<Level, string[]> = {
  1: ["melt", "clay", "freeze"],
  2: ["melt", "dissolve", "freeze"],
  3: ["jar", "mix3", "dissolve"],
};

/** Conservation of mass: nothing is added or taken away, so the mass stays the same. */
function massQuestion(d: Level, type: string): Question {
  const who = pick(NAMES);
  const big = () => (d === 1 ? randInt(5, 30) * 10 : randInt(120, 650));
  switch (type) {
    case "melt": {
      const m = big();
      return massInput(
        `${who} seals ${m} g of ice in a bag. The ice melts. What is the mass of the water in the bag?`,
        m,
        "Melting changes the state, not the amount of matter. Nothing got in or out of the bag, so the mass stays the same.",
      );
    }
    case "freeze": {
      const m = big();
      return massInput(
        `${who} puts ${m} g of water in a closed container in the freezer. What is the mass of the ice?`,
        m,
        "Freezing changes a liquid into a solid, but the mass stays the same when nothing is added or taken away.",
      );
    }
    case "clay": {
      const m = big();
      return massInput(
        `${who} has a ${m} g ball of clay and squishes it into a flat pancake. What is its mass now?`,
        m,
        "Changing the shape doesn't add or remove any clay, so the mass stays the same.",
      );
    }
    case "dissolve": {
      const water = randInt(15, 50) * 10;
      const salt = randInt(8, 45);
      return massInput(
        `${who} stirs ${salt} g of salt into ${water} g of water until it dissolves. What is the mass of the salt water?`,
        water + salt,
        `The salt is still there, just mixed in as tiny particles. Add the masses: ${water} + ${salt}.`,
      );
    }
    case "jar": {
      const jar = randInt(20, 45) * 10;
      const ice = randInt(60, 240);
      return massInput(
        `An empty jar with its lid has a mass of ${jar} g. ${who} adds ${ice} g of ice and closes the lid. After the ice melts, what is the total mass?`,
        jar + ice,
        `The water has the same mass as the ice did. Add the jar and the water: ${jar} + ${ice}.`,
      );
    }
    default: {
      const water = randInt(20, 40) * 10;
      const sugar = randInt(15, 40);
      const juice = randInt(10, 60);
      return massInput(
        `${who} makes lemonade with ${water} g of water, ${sugar} g of sugar and ${juice} g of lemon juice. What is the mass of the lemonade?`,
        water + sugar + juice,
        `Mixing and dissolving don't change the total mass. Add all three: ${water} + ${sugar} + ${juice}.`,
      );
    }
  }
}

/** Hotter water has faster particles. */
function particleTable(d: Level): Question {
  const count = d === 3 ? 4 : 3;
  const temps = sample([4, 12, 20, 35, 50, 65, 80], count).sort((a, b) => a - b);
  const cups = shuffle(["A", "B", "C", "D"].slice(0, count));
  const rows = cups
    .map((cup, i) => ({ cup, temp: temps[i] }))
    .sort((a, b) => a.cup.localeCompare(b.cup));
  const askFast = chance(0.5);
  const target = askFast ? rows.reduce((a, b) => (b.temp > a.temp ? b : a)) : rows.reduce((a, b) => (b.temp < a.temp ? b : a));
  const dye = d >= 2 && chance(0.5);
  const prompt = dye
    ? `A drop of food colouring is added to each cup. In which cup will the colour spread ${askFast ? "fastest" : "slowest"}?`
    : `In which cup are the water particles moving the ${askFast ? "fastest" : "slowest"}?`;
  return textChoice(
    prompt,
    `Cup ${target.cup}`,
    rows.filter((r) => r !== target).map((r) => `Cup ${r.cup}`),
    askFast
      ? "Heat makes particles move faster. Find the hottest cup."
      : "Cold particles move more slowly. Find the coldest cup.",
    {
      type: "table",
      title: "Cups of water",
      headers: ["Cup", "Temperature"],
      rows: rows.map((r) => [r.cup, `${r.temp} °C`]),
    },
  );
}

const STATE_SORT: SortSet = {
  prompt: "Solid, liquid or gas? Tap an item, then tap its basket.",
  hint: "Solids keep their shape. Liquids flow and take the shape of their container. Gases spread out to fill any space.",
  bins: [
    { id: "solid", label: "solid", emoji: "🧱" },
    { id: "liquid", label: "liquid", emoji: "💧" },
    { id: "gas", label: "gas", emoji: "💨" },
  ],
  items: [
    { label: "rock", emoji: "🪨", bin: "solid" },
    { label: "ice cube", emoji: "🧊", bin: "solid" },
    { label: "pencil", emoji: "✏️", bin: "solid" },
    { label: "milk", emoji: "🥛", bin: "liquid" },
    { label: "maple syrup", emoji: "🍯", bin: "liquid" },
    { label: "rain drops", emoji: "🌧️", bin: "liquid" },
    { label: "steam from a kettle", emoji: "♨️", bin: "gas" },
    { label: "air in a balloon", emoji: "🎈", bin: "gas" },
    { label: "the air you breathe out", emoji: "🌬️", bin: "gas" },
  ],
};

const PARTICLE_BANK: Item[] = [
  {
    prompt: "Anything that has mass and takes up space is called…",
    right: "matter",
    wrong: ["energy", "light", "sound"],
    hint: "Rocks, water and even air are all matter. Light and sound are energy, not matter.",
    emoji: "🧱",
  },
  {
    prompt: "What happens to particles when they are heated?",
    right: "They move faster",
    wrong: ["They move slower", "They stop moving", "They disappear"],
    hint: "Heat gives particles more energy, so they move faster and spread apart.",
    emoji: "🔥",
  },
  {
    prompt: "In which state of matter are the particles packed tightly together?",
    right: { label: "solid", emoji: "🧱" },
    wrong: [
      { label: "liquid", emoji: "💧" },
      { label: "gas", emoji: "💨" },
    ],
    hint: "In a solid, particles are packed tightly and just wiggle in place. That's why solids keep their shape.",
  },
  {
    prompt: "In which state of matter do particles slide past each other so it can pour?",
    right: { label: "liquid", emoji: "💧" },
    wrong: [
      { label: "solid", emoji: "🧱" },
      { label: "gas", emoji: "💨" },
    ],
    hint: "Liquid particles are close together but can slide around, so liquids flow.",
  },
  {
    prompt: "Which one has mass and takes up space?",
    right: { label: "the air inside a balloon", emoji: "🎈" },
    wrong: [
      { label: "a shadow", emoji: "👤" },
      { label: "a sound", emoji: "🔊" },
      { label: "a rainbow", emoji: "🌈" },
    ],
    hint: "Air is matter! It fills up the balloon. Shadows, sounds and rainbows are not matter.",
  },
  {
    prompt: "Which tool measures mass?",
    right: { label: "a balance or scale", emoji: "⚖️" },
    wrong: [
      { label: "a thermometer", emoji: "🌡️" },
      { label: "a ruler", emoji: "📏" },
      { label: "a clock", emoji: "⏰" },
    ],
    hint: "A balance compares the mass of objects. A scale shows mass in grams or kilograms.",
  },
  {
    prompt: "Mass is measured in…",
    right: "grams and kilograms",
    wrong: ["metres and centimetres", "litres and millilitres", "degrees Celsius"],
    hint: "A paper clip has a mass of about 1 gram. A big bag of flour is about 1 kilogram or more.",
    emoji: "⚖️",
  },
  {
    prompt: "Ice melts into water. What happens to its mass?",
    right: "It stays the same",
    wrong: ["It doubles", "It drops to zero", "It gets much smaller"],
    hint: "Changing state doesn't add or remove matter, so the mass is conserved (stays the same).",
    emoji: "🧊",
  },
  {
    prompt: "Why does the red liquid in a thermometer rise when it gets warmer?",
    right: "Its particles move faster and spread out, so it expands",
    wrong: ["The liquid gets heavier", "Cold air pushes it up", "The glass tube shrinks"],
    hint: "Heated particles move faster and take up more room, so the liquid climbs up the tube.",
    emoji: "🌡️",
    hard: true,
  },
  {
    prompt: "You push an upside-down empty cup straight down into water. Why does the inside stay mostly dry?",
    right: "The cup is full of air, and air takes up space",
    wrong: ["The water is too cold to go in", "Water can't touch plastic", "Water only flows downhill"],
    hint: "The 'empty' cup is really full of air. The trapped air takes up space, so water can't fill it.",
    emoji: "🥤",
    hard: true,
  },
  {
    prompt: "When sugar dissolves in water, what happens to the sugar?",
    right: "It is still there, mixed in as tiny particles",
    wrong: ["It is destroyed completely", "It turns into water", "It floats away as smoke"],
    hint: "You can't see the sugar, but you can taste it! Its mass is still there in the water.",
    emoji: "🍬",
    hard: true,
  },
  {
    prompt: "An uncovered glass of water sits out for a week. Its mass goes down. Where did the missing water go?",
    right: "It evaporated into the air",
    wrong: ["It was destroyed", "It soaked into the glass", "It turned into sugar"],
    hint: "Matter isn't destroyed. The water became water vapour and left the open glass.",
    emoji: "🥛",
    hard: true,
  },
  {
    prompt: "Why does a hot-air balloon rise?",
    right: "Heated air spreads out, so it's lighter than the same space of cool air",
    wrong: ["Hot air has no mass at all", "The flame pushes the basket up", "Clouds pull the balloon upward"],
    hint: "Heated particles spread apart. The balloon's warm air is less packed than the cooler air around it, so it floats up.",
    emoji: "🎈",
    hard: true,
  },
  {
    prompt: "In a gas, the particles…",
    right: "spread far apart and move freely",
    wrong: ["stay locked in place", "are packed tightly in rows", "never move at all"],
    hint: "Gas particles zoom around and spread out to fill whatever space they are in.",
    emoji: "💨",
    hard: true,
  },
];

function particlesMass({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return shuffle([
    ...sample(MASS_TYPES[difficulty], 2).map((type) => massQuestion(difficulty, type)),
    particleTable(difficulty),
    sortQuestion(STATE_SORT, difficulty === 1 ? 1 : 2),
    ...levelled(PARTICLE_BANK, 4, difficulty),
  ]);
}

// =====================================================================
// Energy Changes
// =====================================================================

interface Device {
  name: string;
  /** Finishes the prompt "Which energy change happens …?" */
  where: string;
  emoji: string;
  change: string;
  /** Other changes that are partly true for this device, so never used as wrong answers. */
  avoid?: string[];
  level: Level;
}

const DEVICES: Device[] = [
  { name: "toaster", where: "in a toaster", emoji: "🍞", change: "electrical → heat", avoid: ["electrical → light"], level: 1 },
  { name: "light bulb", where: "in a light bulb", emoji: "💡", change: "electrical → light", avoid: ["electrical → heat"], level: 1 },
  { name: "speaker", where: "in a speaker", emoji: "🔊", change: "electrical → sound", avoid: ["electrical → motion", "motion → sound"], level: 1 },
  { name: "electric fan", where: "in an electric fan", emoji: "🌀", change: "electrical → motion", avoid: ["electrical → sound"], level: 1 },
  { name: "drum", where: "when you hit a drum", emoji: "🥁", change: "motion → sound", avoid: ["motion → heat"], level: 1 },
  { name: "solar panel", where: "in a solar panel", emoji: "☀️", change: "light → electrical", level: 1 },
  { name: "campfire", where: "in a campfire", emoji: "🔥", change: "chemical → heat and light", level: 1 },
  { name: "wind turbine", where: "in a wind turbine", emoji: "🌬️", change: "motion → electrical", avoid: ["motion → sound", "motion → heat"], level: 2 },
  { name: "rubbing hands", where: "when you rub your hands together fast", emoji: "👐", change: "motion → heat", avoid: ["motion → sound"], level: 2 },
  { name: "runner", where: "when a person runs", emoji: "🏃", change: "chemical → motion", level: 2 },
  { name: "flashlight", where: "in a flashlight", emoji: "🔦", change: "chemical → electrical → light", avoid: ["chemical → heat and light", "electrical → light"], level: 2 },
  { name: "microphone", where: "in a microphone", emoji: "🎤", change: "sound → electrical", avoid: ["motion → electrical"], level: 3 },
  { name: "green leaf", where: "in a green leaf making food", emoji: "🌿", change: "light → chemical", level: 3 },
  { name: "hydroelectric dam", where: "at a hydroelectric dam", emoji: "🌊", change: "motion → electrical", avoid: ["motion → sound", "motion → heat"], level: 3 },
];

const ALL_CHANGES = [...new Set(DEVICES.map((x) => x.change))];

/** `count` questions about different devices. */
function deviceQuestions(d: Level, count: number): Question[] {
  return sample(
    DEVICES.filter((x) => x.level <= d),
    count,
  ).map((device) =>
    textChoice(
      `Which energy change happens ${device.where}?`,
      device.change,
      sample(
        ALL_CHANGES.filter((c) => c !== device.change && !(device.avoid ?? []).includes(c)),
        3,
      ),
      `Ask yourself: what kind of energy goes in, and what kind comes out? Here it's ${device.change}.`,
      { type: "emoji", emoji: device.emoji, caption: device.name },
    ),
  );
}

const ENERGY_SORT: SortSet = {
  prompt: "Renewable or non-renewable? Tap an item, then tap its basket.",
  hint: "Renewable resources are replaced by nature quickly. Non-renewable ones took millions of years to form and can run out.",
  bins: [
    { id: "renew", label: "renewable", emoji: "♻️" },
    { id: "non", label: "non-renewable", emoji: "⛽" },
  ],
  items: [
    { label: "sunlight", emoji: "☀️", bin: "renew" },
    { label: "wind", emoji: "🌬️", bin: "renew" },
    { label: "moving water", emoji: "🌊", bin: "renew" },
    { label: "heat from inside Earth", emoji: "🌋", bin: "renew" },
    { label: "coal", emoji: "🪨", bin: "non" },
    { label: "oil", emoji: "🛢️", bin: "non" },
    { label: "natural gas", emoji: "🔥", bin: "non" },
    { label: "gasoline", emoji: "🚗", bin: "non" },
  ],
};

const FLASHLIGHT_ORDER: OrderQuestion = {
  kind: "order",
  prompt: "Follow the energy in a flashlight. Put the steps in order.",
  hint: "The battery stores chemical energy. It becomes electrical energy in the wires, then light in the bulb.",
  items: [
    { id: "battery", label: "The battery stores chemical energy", emoji: "🔋" },
    { id: "wires", label: "Electricity flows through the wires", emoji: "⚡" },
    { id: "bulb", label: "The bulb gives off light", emoji: "💡" },
  ],
};

const DAM_ORDER: OrderQuestion = {
  kind: "order",
  prompt: "How does a hydroelectric dam make electricity? Put the steps in order.",
  hint: "Stored water falls, spins a turbine, a generator makes electricity, and wires carry it to homes.",
  items: [
    { id: "store", label: "Water is held behind a dam", emoji: "🏞️" },
    { id: "spin", label: "Falling water spins a turbine", emoji: "🌊" },
    { id: "gen", label: "A generator makes electricity", emoji: "⚡" },
    { id: "wires", label: "Power lines carry it to homes", emoji: "🏠" },
  ],
};

const FOOD_ORDER: OrderQuestion = {
  kind: "order",
  prompt: "Follow the energy from the sun to a hopping rabbit. Put the steps in order.",
  hint: "Plants turn sunlight into food (chemical energy). Animals eat the plants and use that energy to move.",
  items: [
    { id: "sun", label: "The sun gives off light", emoji: "☀️" },
    { id: "grass", label: "Grass stores the energy as food", emoji: "🌾" },
    { id: "eat", label: "A rabbit eats the grass", emoji: "🐇" },
    { id: "hop", label: "The rabbit uses the energy to hop", emoji: "🐾" },
  ],
};

const ENERGY_BANK: Item[] = [
  {
    prompt: "What kind of energy does a battery store?",
    right: { label: "chemical energy", emoji: "🔋" },
    wrong: [
      { label: "sound energy", emoji: "🔊" },
      { label: "light energy", emoji: "💡" },
      { label: "motion energy", emoji: "🏃" },
    ],
    hint: "Batteries, food and fuels all store chemical energy until it's released.",
  },
  {
    prompt: "Which is a renewable energy source?",
    right: { label: "wind", emoji: "🌬️" },
    wrong: [
      { label: "coal", emoji: "🪨" },
      { label: "oil", emoji: "🛢️" },
      { label: "natural gas", emoji: "🔥" },
    ],
    hint: "Wind keeps blowing, so it won't run out. Coal, oil and gas can run out.",
  },
  {
    prompt: "Why are coal, oil and natural gas called non-renewable?",
    right: "They took millions of years to form, so they can run out",
    wrong: ["They can be made again in a day", "They come from the wind", "They will never run out"],
    hint: "These fuels formed from ancient plants and animals over millions of years. We use them much faster than that.",
    emoji: "🛢️",
  },
  {
    prompt: "Most of Canada's electricity is made using…",
    right: { label: "moving water (hydroelectricity)", emoji: "🌊" },
    wrong: [
      { label: "solar panels", emoji: "☀️" },
      { label: "wind turbines", emoji: "🌬️" },
      { label: "burning coal", emoji: "🪨" },
    ],
    hint: "Canada has many big rivers. More than half of our electricity comes from hydroelectric dams.",
    emoji: "⚡",
  },
  {
    prompt: "Which form of energy do your ears sense?",
    right: { label: "sound", emoji: "🔊" },
    wrong: [
      { label: "light", emoji: "💡" },
      { label: "chemical", emoji: "🔋" },
      { label: "electrical", emoji: "⚡" },
    ],
    hint: "Sound energy travels as vibrations through the air to your ears.",
  },
  {
    prompt: "Energy from the sun reaches Earth as…",
    right: "light and heat",
    wrong: ["sound and motion", "chemical energy in batteries", "electricity in wires"],
    hint: "Sunlight lights up the day and warms the land, water and air.",
    emoji: "☀️",
  },
  {
    prompt: "What is one way to save energy at home?",
    right: { label: "Turn off lights when you leave a room", emoji: "💡" },
    wrong: [
      { label: "Leave the TV on all night", emoji: "📺" },
      { label: "Keep the fridge door open", emoji: "🧊" },
      { label: "Open the windows with the heat on", emoji: "🪟" },
    ],
    hint: "Using less electricity and heat saves energy and money.",
  },
  {
    prompt: "A light bulb that's been on for a while feels warm. Some electrical energy changed into…",
    right: "heat",
    wrong: ["sound", "chemical energy", "motion"],
    hint: "Devices often change some energy into heat we don't need. LED bulbs waste less energy as heat.",
    emoji: "💡",
    hard: true,
  },
  {
    prompt: "Which statement about energy is true?",
    right: "It can change form, but it is never destroyed",
    wrong: ["It disappears after we use it", "It can only be in the form of light", "It can be made from nothing"],
    hint: "Energy just changes from one form to another, like electrical energy changing into light and heat.",
    emoji: "⚡",
    hard: true,
  },
  {
    prompt: "You stretch an elastic band and let go. Its stored energy changes into…",
    right: "motion",
    wrong: ["light", "chemical energy", "electrical energy"],
    hint: "Stretching stores energy. When you let go, the band snaps forward: that's motion energy.",
    hard: true,
  },
  {
    prompt: "The energy stored in your breakfast first came from…",
    right: { label: "the sun", emoji: "☀️" },
    wrong: [
      { label: "the soil", emoji: "🪨" },
      { label: "the fridge", emoji: "🧊" },
      { label: "the moon", emoji: "🌙" },
    ],
    hint: "Plants use sunlight to make food. Animals and people get energy by eating plants (or animals that ate plants).",
    emoji: "🥣",
    hard: true,
  },
  {
    prompt: "Geothermal energy uses…",
    right: "heat from deep inside Earth",
    wrong: ["energy from the wind", "light from the moon", "heat from burning coal"],
    hint: "Geo means Earth and thermal means heat. Hot springs are a clue that Earth is hot inside!",
    emoji: "🌋",
    hard: true,
  },
  {
    prompt: "A community near a big, fast river wants to make electricity. Why might they choose hydroelectricity?",
    right: "Moving water is a renewable resource right nearby",
    wrong: ["Rivers are non-renewable", "Dams never change the land around them", "Hydroelectricity needs no machines"],
    hint: "Using a local, renewable resource makes sense. But dams can flood land and affect fish, so communities plan carefully.",
    emoji: "🏞️",
    hard: true,
  },
  {
    prompt: "Which device changes sound energy into electrical energy?",
    right: { label: "microphone", emoji: "🎤" },
    wrong: [
      { label: "speaker", emoji: "🔊" },
      { label: "toaster", emoji: "🍞" },
      { label: "light bulb", emoji: "💡" },
    ],
    hint: "A microphone 'hears' your voice and turns it into an electrical signal. A speaker does the opposite.",
    hard: true,
  },
];

function energy({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const order = difficulty === 1 ? FLASHLIGHT_ORDER : difficulty === 2 ? pick([FLASHLIGHT_ORDER, DAM_ORDER]) : pick([DAM_ORDER, FOOD_ORDER]);
  return [
    order,
    ...shuffle([
      ...deviceQuestions(difficulty, 2),
      sortQuestion(ENERGY_SORT, perBin(difficulty)),
      ...levelled(ENERGY_BANK, 4, difficulty),
    ]),
  ];
}

// =====================================================================
// Earth, Moon & Sun
// =====================================================================

const PHASES = [
  { emoji: "🌑", name: "new moon", mirror: "full moon" },
  { emoji: "🌒", name: "waxing crescent", mirror: "waning crescent" },
  { emoji: "🌓", name: "first quarter", mirror: "third quarter" },
  { emoji: "🌔", name: "waxing gibbous", mirror: "waning gibbous" },
  { emoji: "🌕", name: "full moon", mirror: "new moon" },
  { emoji: "🌖", name: "waning gibbous", mirror: "waxing gibbous" },
  { emoji: "🌗", name: "third quarter", mirror: "first quarter" },
  { emoji: "🌘", name: "waning crescent", mirror: "waxing crescent" },
];

const PHASE_HINTS: Record<string, string> = {
  "new moon": "At new moon, the lit side faces away from Earth, so the moon looks dark.",
  "full moon": "At full moon, we see the whole sunlit side of the moon.",
  "first quarter": "At first quarter, the moon is a quarter of the way around Earth and we see the right half lit.",
  "third quarter": "At third quarter, the moon is three quarters of the way around Earth and we see the left half lit.",
  "waxing crescent": "Waxing means growing. A thin sliver lit on the right is a waxing crescent.",
  "waning crescent": "Waning means shrinking. A thin sliver lit on the left is a waning crescent.",
  "waxing gibbous": "Gibbous means more than half lit. Lit on the right and growing: waxing gibbous.",
  "waning gibbous": "Gibbous means more than half lit. Lit on the left and shrinking: waning gibbous.",
};

function moonPhaseQuestion(d: Level): Question {
  const pool = d === 1 ? PHASES.filter((p) => ["new moon", "first quarter", "full moon", "third quarter"].includes(p.name)) : PHASES;
  const phase = pick(pool);
  // At level 2, leave out the look-alike phase (waxing vs waning) to keep it fair.
  const others = pool.filter((p) => p !== phase && (d !== 2 || p.name !== phase.mirror));
  return textChoice(
    "Which phase of the moon is this? (as seen from Canada)",
    phase.name,
    sample(others, 3).map((p) => p.name),
    PHASE_HINTS[phase.name],
    { type: "emoji", emoji: phase.emoji },
  );
}

const MOON_ORDER_SHORT: OrderQuestion = {
  kind: "order",
  prompt: "Put the moon's phases in order, starting with the new moon.",
  hint: "After the new moon, the lit part grows to a half (first quarter), then to full, then shrinks to the other half (third quarter).",
  items: [
    { id: "new", label: "new moon", emoji: "🌑" },
    { id: "first", label: "first quarter", emoji: "🌓" },
    { id: "full", label: "full moon", emoji: "🌕" },
    { id: "third", label: "third quarter", emoji: "🌗" },
  ],
};

const MOON_ORDER_LONG: OrderQuestion = {
  kind: "order",
  prompt: "Put the waxing moon in order, from new moon to full moon.",
  hint: "Waxing means growing: the lit part gets bigger each night, from a thin crescent to a half to more than half (gibbous), then full.",
  items: [
    { id: "new", label: "new moon", emoji: "🌑" },
    { id: "crescent", label: "waxing crescent", emoji: "🌒" },
    { id: "first", label: "first quarter", emoji: "🌓" },
    { id: "gibbous", label: "waxing gibbous", emoji: "🌔" },
    { id: "full", label: "full moon", emoji: "🌕" },
  ],
};

const DAYLIGHT: Visual = {
  type: "bars",
  title: "Hours of daylight (rounded) in a city in southern Canada",
  bars: [
    { label: "March", value: 12 },
    { label: "June", value: 16 },
    { label: "September", value: 12 },
    { label: "December", value: 8 },
  ],
};

function daylightQuestion(d: Level): Question {
  if (d === 3 && chance(0.5)) {
    return textChoice(
      "Why are there so many more hours of daylight in June than in December?",
      "In June, our part of Earth is tilted toward the sun",
      ["In June, Earth is much closer to the sun", "In June, Earth spins more slowly", "In June, the sun gives off more light"],
      "Earth's tilted axis means the Northern Hemisphere leans toward the sun in June, so the sun is up longer. (Earth is actually closest to the sun in January!)",
      DAYLIGHT,
    );
  }
  const long = chance(0.5);
  return textChoice(
    long ? "In which month are the days longest?" : "In which month are the days shortest?",
    long ? "June" : "December",
    long ? ["March", "September", "December"] : ["March", "June", "September"],
    long ? "Find the tallest bar. Summer days are long!" : "Find the shortest bar. Winter days are short!",
    DAYLIGHT,
  );
}

const MOTION_SORT: SortSet = {
  prompt: "Is it caused by Earth spinning or Earth orbiting the sun? Tap an item, then tap its basket.",
  hint: "One spin (rotation) takes a day, so it causes daily patterns. One trip around the sun (revolution) takes a year, so it causes yearly patterns.",
  bins: [
    { id: "spin", label: "Earth spinning (rotation)", emoji: "🔄" },
    { id: "orbit", label: "Earth orbiting the sun (revolution)", emoji: "☀️" },
  ],
  items: [
    { label: "day and night", emoji: "🌃", bin: "spin" },
    { label: "the sun seems to rise in the east", emoji: "🌅", bin: "spin" },
    { label: "your shadow changes during the day", emoji: "👤", bin: "spin" },
    { label: "stars seem to move across the night sky", emoji: "⭐", bin: "spin" },
    { label: "the four seasons", emoji: "🍂", bin: "orbit" },
    { label: "one year passing", emoji: "📅", bin: "orbit" },
    { label: "different star patterns in winter and summer", emoji: "🌌", bin: "orbit" },
    { label: "birds migrating every autumn", emoji: "🐦", bin: "orbit" },
  ],
};

const EARTH_BANK: Item[] = [
  {
    prompt: "Why do we have day and night?",
    right: "Earth spins (rotates) on its axis",
    wrong: ["The sun travels around Earth", "The moon blocks the sun every night", "Earth moves closer to and farther from the sun"],
    hint: "As Earth spins, your side turns toward the sun (day) and then away from it (night).",
    emoji: "🌍",
  },
  {
    prompt: "About how long does it take Earth to spin around once?",
    right: "24 hours",
    wrong: ["1 week", "1 month", "365 days"],
    hint: "One full spin of Earth gives us one day and one night: about 24 hours.",
    emoji: "🔄",
  },
  {
    prompt: "About how long does it take Earth to travel once around the sun?",
    right: "365 days",
    wrong: ["24 hours", "30 days", "7 days"],
    hint: "One trip around the sun is one year: about 365 days.",
    emoji: "☀️",
  },
  {
    prompt: "Why does the moon shine?",
    right: "It reflects light from the sun",
    wrong: ["It makes its own light", "It is on fire", "It reflects light from city lights on Earth"],
    hint: "The moon is made of rock. It shines because sunlight bounces off it.",
    emoji: "🌕",
  },
  {
    prompt: "About how long does the moon take to go through all its phases?",
    right: "about a month",
    wrong: ["one day", "one week", "one year"],
    hint: "From one new moon to the next takes about 29 and a half days, or about a month.",
    emoji: "🌙",
  },
  {
    prompt: "Ocean tides are caused mostly by…",
    right: "the pull of the moon's gravity",
    wrong: ["strong winds", "whales swimming", "rain from clouds"],
    hint: "The moon's gravity pulls on Earth's oceans, making the water rise and fall.",
    emoji: "🌊",
  },
  {
    prompt: "During a solar eclipse, what blocks the sun's light from reaching part of Earth?",
    right: { label: "the moon", emoji: "🌑" },
    wrong: [
      { label: "a cloud", emoji: "☁️" },
      { label: "Earth's shadow", emoji: "🌍" },
      { label: "another planet", emoji: "🪐" },
    ],
    hint: "In a solar eclipse, the moon passes between the sun and Earth.",
  },
  {
    prompt: "What is a safe way to watch a solar eclipse?",
    right: { label: "special eclipse glasses or a pinhole viewer", emoji: "🕶️" },
    wrong: [
      { label: "regular sunglasses", emoji: "😎" },
      { label: "a quick stare at the sun", emoji: "👀" },
      { label: "binoculars", emoji: "🔭" },
    ],
    hint: "Never look straight at the sun. It can badly hurt your eyes, even during an eclipse.",
  },
  {
    prompt: "At what time of day is your shadow the shortest?",
    right: "around noon, when the sun is highest",
    wrong: ["early morning", "late evening", "just before sunrise"],
    hint: "When the sun is high in the sky, shadows are short. When the sun is low, shadows are long.",
    emoji: "👤",
  },
  {
    prompt: "An owl hunts at night and sleeps during the day. An animal like this is…",
    right: "nocturnal",
    wrong: ["hibernating", "migrating", "endangered"],
    hint: "Nocturnal animals are active at night. Day and night are caused by Earth's spin.",
    emoji: "🦉",
  },
  {
    prompt: "What causes Earth's seasons?",
    right: "Earth's tilted axis as it orbits the sun",
    wrong: ["Earth getting closer to the sun in summer", "The moon blocking sunlight in winter", "The sun getting hotter and colder"],
    hint: "When our half of Earth tilts toward the sun, we get summer. Earth is actually closest to the sun in January!",
    emoji: "🌍",
    hard: true,
  },
  {
    prompt: "When it is summer in Canada, what season is it in Australia?",
    right: { label: "winter", emoji: "❄️" },
    wrong: [
      { label: "summer", emoji: "☀️" },
      { label: "spring", emoji: "🌷" },
      { label: "autumn", emoji: "🍂" },
    ],
    hint: "Australia is in the Southern Hemisphere. When the north tilts toward the sun, the south tilts away.",
    hard: true,
  },
  {
    prompt: "A lunar eclipse happens when…",
    right: "Earth is between the sun and the moon",
    wrong: ["the moon is between the sun and Earth", "the sun is between Earth and the moon", "clouds cover the moon"],
    hint: "In a lunar eclipse, Earth's shadow falls on the moon. It can only happen at full moon.",
    emoji: "🌕",
    hard: true,
  },
  {
    prompt: "Why do many shorebirds look for food at low tide?",
    right: "Low tide uncovers clams, crabs and worms",
    wrong: ["The water is warmest then", "Fish jump onto the sand", "The moon lights up the beach"],
    hint: "When the tide goes out, a whole beach of food is uncovered. Tides affect living things on the shore.",
    emoji: "🦀",
    hard: true,
  },
  {
    prompt: "In most places along the ocean, about how many high tides happen each day?",
    right: "two",
    wrong: ["ten", "one each week", "one each year"],
    hint: "Most coasts get two high tides and two low tides about every day.",
    emoji: "🌊",
    hard: true,
  },
  {
    prompt: "Why do we always see the same side of the moon?",
    right: "The moon spins once for each trip around Earth",
    wrong: ["The moon doesn't spin at all", "The other side is always dark", "Earth blocks the other side"],
    hint: "The moon's spin and its orbit take the same amount of time, so one side always faces us.",
    emoji: "🌕",
    hard: true,
  },
  {
    prompt: "Why does the sun seem to rise in the east?",
    right: "Earth spins toward the east",
    wrong: ["The sun moves from east to west around Earth", "The sun is closer to the east", "The moon pushes the sun up"],
    hint: "The sun isn't moving across our sky. Earth is turning, carrying us toward the east to meet the sun each morning.",
    emoji: "🌅",
    hard: true,
  },
];

function earthMoon({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return [
    difficulty === 1 ? MOON_ORDER_SHORT : MOON_ORDER_LONG,
    ...shuffle([
      moonPhaseQuestion(difficulty),
      daylightQuestion(difficulty),
      sortQuestion(MOTION_SORT, perBin(difficulty)),
      ...levelled(EARTH_BANK, 4, difficulty),
    ]),
  ];
}

export const course: Course = {
  grade: "4",
  subject: "science",
  bigIdeas: {
    "ca-bc": [
      "All living things sense and respond to their environment.",
      "Matter has mass, takes up space, and can change phase.",
      "Energy can be transformed.",
      "The motions of Earth and the moon cause observable patterns that affect living and non-living systems.",
    ],
  },
  units: [
    {
      id: "sense-and-respond",
      title: "Sense & Respond",
      emoji: "🦇",
      blurb: "How living things react",
      standards: { "ca-bc": "Sensing and responding: humans, other animals and plants" },
      parentNote: "How people, animals and plants sense and respond to their environment: the nervous system, reflexes, special animal senses and plant responses to light, gravity and touch.",
      generate: senseRespond,
    },
    {
      id: "biomes",
      title: "Biomes",
      emoji: "🌵",
      blurb: "Deserts, tundra and rainforests",
      standards: { "ca-bc": "Biomes as large regions with similar environmental features" },
      parentNote: "Earth's major biomes (tundra, boreal forest, grassland, desert, rainforest and more), reading clue tables and rainfall graphs, and how living things are adapted to each biome.",
      generate: biomes,
    },
    {
      id: "phase-changes",
      title: "Phase Changes",
      emoji: "🧊",
      blurb: "Melting, freezing and more",
      standards: { "ca-bc": "Phase changes: melting, freezing, evaporation, condensation, sublimation and deposition" },
      parentNote: "The six changes of state, whether heat is added or taken away, and everyday examples like dew, frost and drying puddles.",
      generate: phaseChanges,
    },
    {
      id: "particles-and-mass",
      title: "Particles & Mass",
      emoji: "⚖️",
      blurb: "Matter has mass and space",
      standards: { "ca-bc": "Matter has mass and takes up space; effect of temperature on particle movement; conservation of mass" },
      parentNote: "Solids, liquids and gases at the particle level, how temperature changes particle speed, and conservation of mass (melting or dissolving doesn't change the total mass), with some adding of grams.",
      generate: particlesMass,
    },
    {
      id: "energy-changes",
      title: "Energy Changes",
      emoji: "⚡",
      blurb: "Energy changes form",
      standards: { "ca-bc": "Energy has various forms and can be transformed; devices that transform energy; local energy resources" },
      parentNote: "Forms of energy, how everyday devices change one form into another, renewable and non-renewable resources, and how hydroelectricity is made.",
      generate: energy,
    },
    {
      id: "earth-and-moon",
      title: "Earth, Moon & Sun",
      emoji: "🌙",
      blurb: "Days, seasons, moon and tides",
      standards: { "ca-bc": "Earth's rotation and revolution (day and night, seasons); phases of the moon; tides; eclipses" },
      parentNote: "How Earth's spin causes day and night, how its tilt and orbit cause seasons, the moon's phases, tides and eclipses, and how these patterns affect plants and animals.",
      generate: earthMoon,
    },
  ],
};
