import { chance, pick, randInt, sample, shuffle, textChoice } from "../../random";
import type { Course, GenerateOptions, OrderQuestion, Question, Visual } from "../../types";
import { sortQuestion, type BankItem, type SortSet } from "../../bank";

// Bank items marked `hard` are stretch questions. Difficulty 1 uses only the
// easier items, 2 mixes in about a third, 3 is mostly stretch. Items can carry
// their own `visual` (a passage, a table…) instead of a single emoji.
type Level = 1 | 2 | 3;
type Item = BankItem & { hard?: true; visual?: Visual };

function ask(b: Item): Question {
  const visual: Visual | undefined =
    b.visual ?? (b.emoji ? { type: "emoji", emoji: b.emoji, caption: b.caption } : undefined);
  const q = textChoice(b.prompt, b.right, b.wrong, b.hint, visual);
  if (b.speak) q.speak = b.speak;
  return q;
}

function levelled(bank: Item[], count: number, difficulty: Level): Question[] {
  const easy = bank.filter((b) => !b.hard);
  const hard = bank.filter((b) => b.hard);
  const want = difficulty === 1 ? 0 : difficulty === 2 ? Math.ceil(count / 3) : Math.ceil((count * 2) / 3);
  const nHard = Math.min(want, hard.length);
  return [...sample(easy, count - nHard), ...sample(hard, nHard)].map(ask);
}

/** Smaller sorts at difficulty 1, bigger ones at 3 (two baskets only). */
const perBin = (difficulty: Level) => (difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4);

function order(prompt: string, hint: string, items: [string, string][]): OrderQuestion {
  return {
    kind: "order",
    prompt,
    hint,
    items: items.map(([label, emoji], i) => ({ id: `o${i}`, label, emoji })),
  };
}

// ---------- Grouping Living Things ----------

const BACKBONE_SORT: SortSet = {
  prompt: "Does it have a backbone? Tap an item, then tap its basket.",
  hint: "Fish, frogs, snakes, birds and mammals all have a backbone. Worms, snails, insects, spiders and crabs do not.",
  bins: [
    { id: "yes", label: "has a backbone", emoji: "🦴" },
    { id: "no", label: "no backbone", emoji: "🪱" },
  ],
  items: [
    { label: "deer", emoji: "🦌", bin: "yes" },
    { label: "salmon", emoji: "🐟", bin: "yes" },
    { label: "eagle", emoji: "🦅", bin: "yes" },
    { label: "frog", emoji: "🐸", bin: "yes" },
    { label: "snake", emoji: "🐍", bin: "yes" },
    { label: "turtle", emoji: "🐢", bin: "yes" },
    { label: "worm", emoji: "🪱", bin: "no" },
    { label: "snail", emoji: "🐌", bin: "no" },
    { label: "spider", emoji: "🕷️", bin: "no" },
    { label: "ant", emoji: "🐜", bin: "no" },
    { label: "crab", emoji: "🦀", bin: "no" },
    { label: "octopus", emoji: "🐙", bin: "no" },
  ],
};

const ANIMAL_GROUP_SORT: SortSet = {
  prompt: "Mammal, bird or fish? Tap an item, then tap its basket.",
  hint: "Mammals have fur or hair. Birds have feathers. Fish have fins and breathe with gills.",
  bins: [
    { id: "mammal", label: "mammal", emoji: "🐻" },
    { id: "bird", label: "bird", emoji: "🐦" },
    { id: "fish", label: "fish", emoji: "🐟" },
  ],
  items: [
    { label: "deer", emoji: "🦌", bin: "mammal" },
    { label: "rabbit", emoji: "🐇", bin: "mammal" },
    { label: "beaver", emoji: "🦫", bin: "mammal" },
    { label: "raccoon", emoji: "🦝", bin: "mammal" },
    { label: "owl", emoji: "🦉", bin: "bird" },
    { label: "duck", emoji: "🦆", bin: "bird" },
    { label: "eagle", emoji: "🦅", bin: "bird" },
    { label: "salmon", emoji: "🐟", bin: "fish" },
    { label: "clownfish", emoji: "🐠", bin: "fish" },
    { label: "pufferfish", emoji: "🐡", bin: "fish" },
  ],
};

const TRICKY_GROUP_SORT: SortSet = {
  prompt: "Some of these are tricky! Mammal, bird or fish?",
  hint: "Look at the body, not where it lives. Whales, bats and seals have hair and feed babies milk. Penguins have feathers. Sharks have fins and gills.",
  bins: ANIMAL_GROUP_SORT.bins,
  items: [
    { label: "whale", emoji: "🐋", bin: "mammal" },
    { label: "bat", emoji: "🦇", bin: "mammal" },
    { label: "seal", emoji: "🦭", bin: "mammal" },
    { label: "penguin", emoji: "🐧", bin: "bird" },
    { label: "flamingo", emoji: "🦩", bin: "bird" },
    { label: "chicken", emoji: "🐔", bin: "bird" },
    { label: "shark", emoji: "🦈", bin: "fish" },
    { label: "pufferfish", emoji: "🐡", bin: "fish" },
  ],
};

const GROUPING_BANK: Item[] = [
  {
    prompt: "What does biodiversity mean?",
    right: "the variety of living things in a place",
    wrong: ["the number of rocks in a place", "how hot or cold a place is"],
    hint: "“Bio” means life and “diversity” means variety. Biodiversity is all the different kinds of living things in a place.",
    emoji: "🌳",
  },
  {
    prompt: "Which feature do all birds have?",
    right: { label: "feathers", emoji: "🪶" },
    wrong: [
      { label: "fur", emoji: "🐻" },
      { label: "gills", emoji: "🐟" },
    ],
    hint: "Every bird has feathers, even birds that can't fly, like penguins.",
    emoji: "🐦",
  },
  {
    prompt: "Which feature do mammals have?",
    right: "fur or hair",
    wrong: ["feathers", "gills", "six legs"],
    hint: "Mammals have fur or hair, and mother mammals feed their babies milk. You are a mammal too!",
    emoji: "🦝",
  },
  {
    prompt: "How do fish breathe underwater?",
    right: "with gills",
    wrong: ["with their fins", "with their tails"],
    hint: "Gills take oxygen out of the water. Fins and tails help fish swim and steer.",
    emoji: "🐟",
  },
  {
    prompt: "How many legs does an insect have?",
    right: "6 legs",
    wrong: ["8 legs", "4 legs", "10 legs"],
    hint: "Insects have 6 legs and 3 body parts. Ants, bees and butterflies are insects.",
    emoji: "🐜",
  },
  {
    prompt: "A spider has 8 legs. Is it an insect?",
    right: "No, insects have 6 legs",
    wrong: ["Yes, every small crawling animal is an insect", "Yes, insects have 8 legs"],
    hint: "Count the legs! Insects have 6. Spiders have 8, so they are in a different group.",
    emoji: "🕷️",
  },
  {
    prompt: "Which animal has a backbone?",
    right: { label: "deer", emoji: "🦌" },
    wrong: [
      { label: "worm", emoji: "🪱" },
      { label: "snail", emoji: "🐌" },
    ],
    hint: "A backbone is a row of bones down the middle of the back. Deer have one, but worms and snails don't.",
  },
  {
    prompt: "Which animal has NO backbone?",
    speak: "Which animal has no backbone?",
    right: { label: "ant", emoji: "🐜" },
    wrong: [
      { label: "fish", emoji: "🐟" },
      { label: "bear", emoji: "🐻" },
    ],
    hint: "Insects like ants have a hard outside covering instead of a backbone.",
  },
  {
    prompt: "Scientists sort living things into groups by looking at their…",
    right: "features, like body parts and leaves",
    wrong: ["names in ABC order", "favourite places to visit"],
    hint: "Living things with the same features go together, like all the animals with feathers.",
    emoji: "🔍",
  },
  {
    prompt: "A forest has many kinds of trees, birds, insects and mushrooms. It has…",
    right: "high biodiversity",
    wrong: ["low biodiversity", "no biodiversity"],
    hint: "Lots of different kinds of living things in one place means high biodiversity.",
    emoji: "🌲",
  },
  {
    prompt: "Where would you look to find worms, beetles and slugs?",
    right: "under a damp log",
    wrong: ["on a hot, dry sidewalk", "inside a closed glass jar"],
    hint: "Many small animals like cool, damp, dark places where they can find food and hide.",
    emoji: "🪵",
  },
  {
    prompt: "Which living thing is a plant?",
    right: { label: "fern", emoji: "🌿" },
    wrong: [
      { label: "mushroom", emoji: "🍄" },
      { label: "beetle", emoji: "🪲" },
    ],
    hint: "Plants have leaves and make their own food from sunlight. A mushroom is a fungus, not a plant.",
  },
  {
    prompt: "Which animal is a reptile?",
    right: { label: "snake", emoji: "🐍" },
    wrong: [
      { label: "frog", emoji: "🐸" },
      { label: "salmon", emoji: "🐟" },
    ],
    hint: "Reptiles have dry, scaly skin. Frogs have smooth, damp skin, so they are amphibians.",
    hard: true,
  },
  {
    prompt: "A frog starts life in water and has smooth, damp skin. It is an…",
    right: "amphibian",
    wrong: ["reptile", "insect", "mammal"],
    hint: "Amphibians, like frogs and salamanders, usually start life in water and have smooth, damp skin.",
    emoji: "🐸",
    hard: true,
  },
  {
    prompt: "A whale lives in the ocean, but it breathes air and feeds its babies milk. It is a…",
    right: "mammal",
    wrong: ["fish", "bird", "reptile"],
    hint: "Breathing air and feeding babies milk are mammal features. Whales even have a few hairs!",
    emoji: "🐋",
    hard: true,
  },
  {
    prompt: "A bat can fly, but it has fur and feeds its babies milk. Which group is it in?",
    right: "mammals",
    wrong: ["birds", "insects"],
    hint: "Flying doesn't make an animal a bird. Birds have feathers. Bats have fur, so they are mammals.",
    emoji: "🦇",
    hard: true,
  },
  {
    prompt: "A mushroom is not a plant or an animal. It belongs to a group called…",
    right: "fungi",
    wrong: ["insects", "reptiles"],
    hint: "Mushrooms are fungi. They can't make food from sunlight, so they get food from dead leaves and wood.",
    emoji: "🍄",
    hard: true,
  },
  {
    prompt: "Why is high biodiversity good for a forest?",
    right: "animals have many kinds of food and shelter",
    wrong: ["there is less food for everyone", "nothing in the forest can change"],
    hint: "When there are many kinds of plants and animals, there are more choices for food and homes.",
    emoji: "🌲",
    hard: true,
  },
  {
    prompt: "Which group has 3 body parts and 6 legs?",
    right: "insects",
    wrong: ["spiders", "worms", "fish"],
    hint: "Insects have a head, a middle part and an abdomen, plus 6 legs.",
    emoji: "🐝",
    hard: true,
  },
  {
    prompt: "Mammals, birds, fish, reptiles and amphibians all have a…",
    right: "backbone",
    wrong: ["hard shell", "pair of wings", "set of gills"],
    hint: "These five groups are all animals with a backbone.",
    emoji: "🦴",
    hard: true,
  },
];

function groupingLife({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const sort =
    difficulty === 1
      ? sortQuestion(BACKBONE_SORT, 2)
      : difficulty === 2
        ? pick([sortQuestion(BACKBONE_SORT, 3), sortQuestion(ANIMAL_GROUP_SORT, 2)])
        : pick([sortQuestion(BACKBONE_SORT, 4), sortQuestion(TRICKY_GROUP_SORT, 2)]);
  return shuffle([sort, ...levelled(GROUPING_BANK, 7, difficulty)]);
}

// ---------- Ecosystems & Food Chains ----------

type Chain = [string, string][];

const CHAINS: Record<Level, Chain[]> = {
  1: [
    [["grass", "🌿"], ["rabbit", "🐇"], ["fox", "🦊"]],
    [["seeds", "🌾"], ["mouse", "🐁"], ["owl", "🦉"]],
    [["leaves", "🍃"], ["caterpillar", "🐛"], ["songbird", "🐦"]],
    [["plants", "🌱"], ["deer", "🦌"], ["wolf", "🐺"]],
  ],
  2: [
    [["sun", "☀️"], ["grass", "🌿"], ["rabbit", "🐇"], ["fox", "🦊"]],
    [["grass", "🌿"], ["grasshopper", "🦗"], ["frog", "🐸"], ["snake", "🐍"]],
    [["sun", "☀️"], ["seeds", "🌾"], ["mouse", "🐁"], ["owl", "🦉"]],
    [["leaves", "🍃"], ["caterpillar", "🐛"], ["songbird", "🐦"], ["hawk", "🦅"]],
  ],
  3: [
    [["sun", "☀️"], ["grass", "🌿"], ["grasshopper", "🦗"], ["frog", "🐸"], ["snake", "🐍"]],
    [["sun", "☀️"], ["leaves", "🍃"], ["caterpillar", "🐛"], ["songbird", "🐦"], ["hawk", "🦅"]],
    [["sun", "☀️"], ["seeds", "🌾"], ["mouse", "🐁"], ["snake", "🐍"], ["hawk", "🦅"]],
  ],
};

function foodChain(difficulty: Level): OrderQuestion {
  const chain = pick(CHAINS[difficulty]);
  const fromSun = chain[0][0] === "sun";
  return order(
    fromSun
      ? "Put the food chain in order. Start where the energy comes from."
      : "Put the food chain in order. Start with the one that makes its own food.",
    "Energy starts with the sun. Plants use sunlight to make food. Then each animal eats the one before it.",
    chain,
  );
}

const ECO_PARTS_SORT: SortSet = {
  prompt: "Is it a living or non-living part of an ecosystem?",
  hint: "Living things grow, need food and make more of their kind. Sunlight, water, rocks and air are not alive, but living things need them.",
  bins: [
    { id: "living", label: "living", emoji: "🌱" },
    { id: "non", label: "non-living", emoji: "🪨" },
  ],
  items: [
    { label: "tree", emoji: "🌳", bin: "living" },
    { label: "beetle", emoji: "🪲", bin: "living" },
    { label: "mushroom", emoji: "🍄", bin: "living" },
    { label: "trout", emoji: "🐟", bin: "living" },
    { label: "fern", emoji: "🌿", bin: "living" },
    { label: "sunlight", emoji: "☀️", bin: "non" },
    { label: "water", emoji: "💧", bin: "non" },
    { label: "rock", emoji: "🪨", bin: "non" },
    { label: "air", emoji: "🌬️", bin: "non" },
    { label: "snow", emoji: "❄️", bin: "non" },
  ],
};

const EATER_SORT: SortSet = {
  prompt: "What does it eat? Tap an item, then tap its basket.",
  hint: "Herbivores eat plants. Carnivores eat other animals. Omnivores eat both plants and animals.",
  bins: [
    { id: "herb", label: "plants (herbivore)", emoji: "🌿" },
    { id: "carn", label: "animals (carnivore)", emoji: "🍖" },
    { id: "omni", label: "both (omnivore)", emoji: "🍽️" },
  ],
  items: [
    { label: "deer", emoji: "🦌", bin: "herb" },
    { label: "rabbit", emoji: "🐇", bin: "herb" },
    { label: "beaver", emoji: "🦫", bin: "herb" },
    { label: "caterpillar", emoji: "🐛", bin: "herb" },
    { label: "wolf", emoji: "🐺", bin: "carn" },
    { label: "owl", emoji: "🦉", bin: "carn" },
    { label: "eagle", emoji: "🦅", bin: "carn" },
    { label: "shark", emoji: "🦈", bin: "carn" },
    { label: "bear", emoji: "🐻", bin: "omni" },
    { label: "raccoon", emoji: "🦝", bin: "omni" },
    { label: "chicken", emoji: "🐔", bin: "omni" },
    { label: "pig", emoji: "🐖", bin: "omni" },
  ],
};

const ECO_BANK: Item[] = [
  {
    prompt: "Where does the energy in almost every food chain start?",
    right: { label: "the sun", emoji: "☀️" },
    wrong: [
      { label: "the soil", emoji: "🟫" },
      { label: "the wind", emoji: "🌬️" },
    ],
    hint: "Plants catch energy from sunlight to make food. Animals get that energy when they eat.",
  },
  {
    prompt: "Plants are called producers because they…",
    right: "make their own food using sunlight",
    wrong: ["get food by eating animals", "don't need any energy"],
    hint: "Plants produce (make) their own food in their leaves using sunlight, air and water.",
    emoji: "🌱",
  },
  {
    prompt: "Why do animals need to eat food?",
    right: "food gives them energy to live and grow",
    wrong: ["food keeps their fur clean", "food changes their colour"],
    hint: "All living things need energy. Animals get their energy from the food they eat.",
    emoji: "🐿️",
  },
  {
    prompt: "Which living thing is a decomposer?",
    right: { label: "mushroom", emoji: "🍄" },
    wrong: [
      { label: "deer", emoji: "🦌" },
      { label: "sunflower", emoji: "🌻" },
    ],
    hint: "Decomposers, like mushrooms and worms, break down dead plants and animals.",
  },
  {
    prompt: "What do decomposers like worms and mushrooms do?",
    right: "break down dead plants and animals into soil",
    wrong: ["make food from sunlight", "hunt other animals"],
    hint: "Decomposers are nature's recyclers. They turn dead leaves and logs back into rich soil.",
    emoji: "🪱",
  },
  {
    prompt: "An animal that eats only plants is called a…",
    right: "herbivore",
    wrong: ["carnivore", "omnivore"],
    hint: "Herbivores, like deer and rabbits, eat only plants.",
    emoji: "🐇",
  },
  {
    prompt: "An animal that eats both plants and animals is called an…",
    right: "omnivore",
    wrong: ["herbivore", "carnivore"],
    hint: "“Omni” means all. Omnivores, like raccoons and people, eat plants and animals.",
    emoji: "🦝",
  },
  {
    prompt: "What is an ecosystem?",
    right: "living and non-living things working together in one place",
    wrong: ["one kind of animal", "a type of rock"],
    hint: "An ecosystem includes the plants, animals, water, soil, air and sunlight in a place, and how they affect each other.",
    emoji: "🏞️",
  },
  {
    prompt: "How do bees help flowers?",
    right: "they carry pollen, so new seeds can form",
    wrong: ["they eat all the leaves", "they keep the flowers warm at night"],
    hint: "Bees move pollen from flower to flower while they collect nectar. This helps plants make seeds.",
    emoji: "🐝",
  },
  {
    prompt: "Which is a non-living part of an ecosystem?",
    right: { label: "water", emoji: "💧" },
    wrong: [
      { label: "frog", emoji: "🐸" },
      { label: "moss", emoji: "🌿" },
    ],
    hint: "Water isn't alive, but every living thing in an ecosystem needs it.",
  },
  {
    prompt: "First Peoples have learned about local plants and animals for thousands of years. How is this knowledge often shared?",
    right: "Elders teach it through stories and time on the land",
    wrong: ["only from TV shows", "only from textbooks"],
    hint: "Elders are respected knowledge keepers. They teach young people by telling stories and by showing them on the land.",
    emoji: "🌲",
  },
  {
    prompt: "A rabbit eats grass. A fox eats the rabbit. Where did the fox's energy first come from?",
    right: { label: "the sun", emoji: "☀️" },
    wrong: [
      { label: "the fox's den", emoji: "🕳️" },
      { label: "the rain", emoji: "🌧️" },
    ],
    hint: "Follow the energy backward: fox ← rabbit ← grass ← sun. The grass used sunlight to make food.",
    hard: true,
  },
  {
    prompt: "If all the rabbits in a forest disappeared, what might happen to the foxes?",
    right: "they would have less food",
    wrong: ["they would have more food", "nothing would change"],
    hint: "Foxes eat rabbits. Living things in an ecosystem depend on each other.",
    emoji: "🦊",
    hard: true,
  },
  {
    prompt: "In the food chain grass → rabbit → fox, what do the arrows show?",
    right: "the way energy moves, from food to eater",
    wrong: ["which animal is the biggest", "which way the wind blows"],
    hint: "Each arrow points to the eater. Energy moves from the grass to the rabbit, then to the fox.",
    emoji: "➡️",
    hard: true,
  },
  {
    prompt: "A bear eats berries and salmon. What kind of eater is it?",
    right: "omnivore",
    wrong: ["herbivore", "carnivore"],
    hint: "Berries are plants and salmon are animals. An animal that eats both is an omnivore.",
    emoji: "🐻",
    hard: true,
  },
  {
    prompt: "How do decomposers help plants grow?",
    right: "they put nutrients back into the soil",
    wrong: ["they give plants sunlight", "they make it rain"],
    hint: "When decomposers break down dead things, they return nutrients to the soil. Plants use them to grow.",
    emoji: "🍄",
    hard: true,
  },
  {
    prompt: "Bears catch salmon and leave the leftovers in the forest. The leftovers help trees grow. This shows that…",
    right: "living things in an ecosystem are connected",
    wrong: ["bears and trees never affect each other", "trees eat salmon with their leaves"],
    hint: "The salmon feed the bears, and the leftovers break down into nutrients for the trees. Everything is connected!",
    emoji: "🐟",
    hard: true,
  },
  {
    prompt: "Many First Peoples teach that we should take only what we need from the land. How does this help ecosystems?",
    right: "plants and animals can keep growing for the future",
    wrong: ["the land gets used up faster", "animals end up with less food"],
    hint: "Leaving enough behind means plants can grow back and animals still have food.",
    emoji: "🫐",
    hard: true,
  },
  {
    prompt: "Which food chain is in the right order?",
    right: "grass → grasshopper → frog",
    wrong: ["frog → grass → grasshopper", "grasshopper → frog → grass"],
    hint: "Start with the plant. Then the grasshopper eats the grass, and the frog eats the grasshopper.",
    emoji: "🦗",
    hard: true,
  },
  {
    prompt: "What would happen to a forest with no sunlight?",
    right: "plants couldn't make food, so animals would go hungry",
    wrong: ["plants would grow faster", "animals would have more food"],
    hint: "Plants need sunlight to make food, and animals depend on plants. No sun means no food chain.",
    emoji: "🌑",
    hard: true,
  },
];

function ecosystems({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const sort =
    difficulty === 1
      ? sortQuestion(ECO_PARTS_SORT, 2)
      : difficulty === 2
        ? pick([sortQuestion(ECO_PARTS_SORT, 3), sortQuestion(EATER_SORT, 2)])
        : sortQuestion(EATER_SORT, 2);
  return [foodChain(difficulty), ...shuffle([sort, ...levelled(ECO_BANK, 6, difficulty)])];
}

// ---------- Matter & Particles ----------

const PARTICLE_ORDERS: Record<Level, OrderQuestion[]> = {
  1: [
    order(
      "Put these in order, from particles packed closest together to farthest apart.",
      "Solid particles are packed tightly. Liquid particles are close but slide around. Gas particles are spread far apart.",
      [
        ["solid ice", "🧊"],
        ["liquid water", "💧"],
        ["water vapour (a gas)", "💨"],
      ],
    ),
    order(
      "An ice cube sits in the hot sun. Put what happens in order.",
      "Heat melts the solid ice into liquid water. More heat makes the water evaporate into the air.",
      [
        ["a solid ice cube", "🧊"],
        ["it melts into a puddle", "💧"],
        ["the puddle evaporates into the air", "☀️"],
      ],
    ),
  ],
  2: [
    order(
      "A pot of cold water is heated on the stove. Put what happens in order.",
      "Heating makes the particles move faster and faster. Then the water boils and turns into a gas.",
      [
        ["cold water sits in the pot", "💧"],
        ["the water warms and its particles speed up", "🔥"],
        ["the water boils and bubbles", "♨️"],
        ["water vapour rises into the air", "💨"],
      ],
    ),
    order(
      "An ice cube sits in the hot sun. Put what happens in order.",
      "Heat melts the solid ice into liquid water. More heat makes the water evaporate into the air.",
      [
        ["a solid ice cube", "🧊"],
        ["it melts into a puddle", "💧"],
        ["the puddle evaporates into the air", "☀️"],
      ],
    ),
  ],
  3: [
    order(
      "Drops of water form on a cold glass. Put what happens in order.",
      "Water vapour in the air cools when it touches the cold glass. Cooled vapour condenses into liquid drops.",
      [
        ["a cold glass comes out of the fridge", "🥛"],
        ["water vapour in the air touches the glass", "💨"],
        ["the vapour cools down", "❄️"],
        ["drops of liquid water form on the glass", "💧"],
      ],
    ),
    order(
      "A pot of cold water is heated on the stove. Put what happens in order.",
      "Heating makes the particles move faster and faster. Then the water boils and turns into a gas.",
      [
        ["cold water sits in the pot", "💧"],
        ["the water warms and its particles speed up", "🔥"],
        ["the water boils and bubbles", "♨️"],
        ["water vapour rises into the air", "💨"],
      ],
    ),
  ],
};

const STATE_SORT: SortSet = {
  prompt: "Solid, liquid or gas? Tap an item, then tap its basket.",
  hint: "A solid keeps its shape. A liquid flows and takes the shape of its container. A gas spreads out to fill any space.",
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
    { label: "juice", emoji: "🧃", bin: "liquid" },
    { label: "honey", emoji: "🍯", bin: "liquid" },
    { label: "air in a balloon", emoji: "🎈", bin: "gas" },
    { label: "bubbles in fizzy water", emoji: "🥤", bin: "gas" },
    { label: "the air we breathe", emoji: "🌬️", bin: "gas" },
  ],
};

const HEAT_COOL_SORT: SortSet = {
  prompt: "Is this change caused by heating or cooling?",
  hint: "Heating makes particles move faster (melting, evaporating). Cooling slows them down (freezing, condensing).",
  bins: [
    { id: "heat", label: "heating", emoji: "🔥" },
    { id: "cool", label: "cooling", emoji: "❄️" },
  ],
  items: [
    { label: "ice melts in your hand", emoji: "🧊", bin: "heat" },
    { label: "butter melts in a pan", emoji: "🧈", bin: "heat" },
    { label: "a puddle dries up in the sun", emoji: "☀️", bin: "heat" },
    { label: "chocolate goes soft in the sun", emoji: "🍫", bin: "heat" },
    { label: "a pond freezes in winter", emoji: "⛸️", bin: "cool" },
    { label: "drops form on a cold window", emoji: "🪟", bin: "cool" },
    { label: "melted wax hardens", emoji: "🕯️", bin: "cool" },
    { label: "juice becomes a frozen pop", emoji: "🍧", bin: "cool" },
  ],
};

const MATTER_BANK: Item[] = [
  {
    prompt: "Everything around us is made of tiny bits called…",
    right: "particles",
    wrong: ["pixels", "pebbles"],
    hint: "All matter (solids, liquids and gases) is made of particles that are far too small to see.",
    emoji: "🔬",
  },
  {
    prompt: "Can you see the particles in a rock with just your eyes?",
    right: "No, they are much too small",
    wrong: ["Yes, they are as big as marbles", "Yes, if you look very closely"],
    hint: "Particles are so tiny that millions of them would fit on the tip of a pencil.",
    emoji: "🪨",
  },
  {
    prompt: "In a solid, the particles are…",
    right: "packed tightly, wiggling in place",
    wrong: ["far apart and zooming around", "sliding past each other"],
    hint: "That's why a solid keeps its shape. Its particles stay in place and just wiggle.",
    emoji: "🧊",
  },
  {
    prompt: "In a gas, the particles are…",
    right: "far apart and moving fast",
    wrong: ["packed tightly in rows", "stuck together in one spot"],
    hint: "Gas particles zoom around and spread out to fill whatever space they are in.",
    emoji: "💨",
  },
  {
    prompt: "Which one keeps its own shape?",
    right: { label: "a wooden block", emoji: "🪵" },
    wrong: [
      { label: "milk", emoji: "🥛" },
      { label: "air", emoji: "🌬️" },
    ],
    hint: "Solids keep their shape. Liquids and gases change shape to fit their container.",
  },
  {
    prompt: "Pour juice into a tall glass, then into a bowl. What happens to its shape?",
    right: "it takes the shape of each container",
    wrong: ["it stays tall and thin", "it turns into a solid"],
    hint: "Liquids flow. Their particles slide past each other, so a liquid takes the shape of its container.",
    emoji: "🧃",
  },
  {
    prompt: "When a solid is heated and turns into a liquid, it is called…",
    right: "melting",
    wrong: ["freezing", "condensing"],
    hint: "Heat makes a solid melt. Think of an ice cube turning into water.",
    emoji: "🍦",
  },
  {
    prompt: "When liquid water gets cold enough to turn into ice, it is called…",
    right: "freezing",
    wrong: ["melting", "boiling"],
    hint: "Cooling slows the particles down until they lock in place. The water freezes.",
    emoji: "❄️",
  },
  {
    prompt: "Heating makes particles move…",
    right: "faster",
    wrong: ["slower", "not at all"],
    hint: "Adding heat gives particles more energy, so they move faster.",
    emoji: "🔥",
  },
  {
    prompt: "Wet clothes on a clothesline dry in the sun. Where does the water go?",
    right: "it evaporates into the air as a gas",
    wrong: ["it soaks into the clothespins", "it freezes into ice"],
    hint: "The sun's heat turns the liquid water into water vapour, a gas we can't see. That's evaporation.",
    emoji: "👕",
  },
  {
    prompt: "You put juice in the freezer. What change happens?",
    right: "it freezes into a solid",
    wrong: ["it turns into a gas", "it starts to boil"],
    hint: "A freezer takes heat away. The liquid juice cools down and freezes solid.",
    emoji: "🧃",
  },
  {
    prompt: "A cold glass of water gets wet on the outside on a hot day. Why?",
    right: "water vapour in the air cools and turns into drops",
    wrong: ["water leaks through the glass", "the glass is melting"],
    hint: "Water vapour in the air touches the cold glass, cools down and becomes liquid. That's condensation.",
    emoji: "🥛",
    hard: true,
  },
  {
    prompt: "When a gas cools and turns into a liquid, it is called…",
    right: "condensation",
    wrong: ["evaporation", "melting"],
    hint: "Condensation is the opposite of evaporation. Gas becomes liquid when it cools.",
    emoji: "💧",
    hard: true,
  },
  {
    prompt: "Why does a gas spread out to fill a whole balloon?",
    right: "its particles move in every direction",
    wrong: ["its particles are packed tightly", "a gas has no particles"],
    hint: "Gas particles move fast and spread out to fill all the space they can.",
    emoji: "🎈",
    hard: true,
  },
  {
    prompt: "Cookies are baking. Soon you can smell them in the next room. Why?",
    right: "tiny particles spread through the air",
    wrong: ["the smell stays inside the oven", "the cookies roll into the room"],
    hint: "Tiny particles from the cookies mix with the air and spread out until they reach your nose.",
    emoji: "🍪",
    hard: true,
  },
  {
    prompt: "What happens to the particles in ice as it melts?",
    right: "they move faster and slide past each other",
    wrong: ["they stop moving", "they disappear"],
    hint: "Heat gives the particles energy. They break out of their places and start sliding, like in a liquid.",
    emoji: "🧊",
    hard: true,
  },
  {
    prompt: "When does a puddle dry up fastest?",
    right: "on a hot, sunny day",
    wrong: ["on a cold, cloudy day", "on a cool, rainy night"],
    hint: "Heat makes water particles move faster, so more of them escape into the air.",
    emoji: "☀️",
    hard: true,
  },
  {
    prompt: "Butter melts in a hot pan, then turns solid again in the fridge. This shows that changes of state can…",
    right: "be undone",
    wrong: ["never be undone", "only happen to water"],
    hint: "Melting and freezing can go back and forth. Heat it to melt it; cool it to make it solid again.",
    emoji: "🧈",
    hard: true,
  },
  {
    prompt: "A drop of food colouring is added to two cups of water. Where does it spread fastest?",
    right: "in hot water",
    wrong: ["in cold water", "in ice water"],
    hint: "Particles move faster in hot water, so they mix the colour around more quickly.",
    emoji: "🌈",
    hard: true,
  },
  {
    prompt: "Is air matter?",
    right: "Yes, it is made of particles and takes up space",
    wrong: ["No, because we can't see it", "No, air is just empty space"],
    hint: "Blow up a balloon. The air inside takes up space, so it is matter!",
    emoji: "🎈",
    hard: true,
  },
];

function particles({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const sort =
    difficulty === 1
      ? sortQuestion(STATE_SORT, 2)
      : difficulty === 2
        ? pick([sortQuestion(STATE_SORT, 2), sortQuestion(HEAT_COOL_SORT, 3)])
        : sortQuestion(HEAT_COOL_SORT, 4);
  return shuffle([pick(PARTICLE_ORDERS[difficulty]), sort, ...levelled(MATTER_BANK, 6, difficulty)]);
}

// ---------- Thermal Energy ----------

/** Read a bar graph from a heat experiment. The numbers change, the science doesn't. */
function heatExperiment(difficulty: Level): Question {
  if (chance(0.5)) {
    const bars = [
      { label: "metal plate", value: randInt(4, 8) },
      { label: "plastic plate", value: randInt(12, 18) },
      { label: "foam plate", value: randInt(22, 30) },
    ];
    const visual: Visual = { type: "bars", title: "Minutes for an ice cube to melt", bars: shuffle(bars) };
    const labels = bars.map((b) => b.label);
    if (difficulty === 1) {
      return textChoice(
        "Ice cubes were put on three plates. Which ice cube melted the fastest?",
        "metal plate",
        labels.filter((l) => l !== "metal plate"),
        "The fastest melt took the fewest minutes. Look for the shortest bar.",
        visual,
      );
    }
    if (difficulty === 2) {
      return textChoice(
        "Ice cubes were put on three plates. Which plate is the best conductor of heat?",
        "metal plate",
        labels.filter((l) => l !== "metal plate"),
        "Heat moved from the room, through the plate, into the ice. The best conductor let heat through fastest, so its ice melted first.",
        visual,
      );
    }
    return textChoice(
      "Ice cubes were put on three plates. Which plate is the best insulator?",
      "foam plate",
      labels.filter((l) => l !== "foam plate"),
      "An insulator slows heat down, so the ice on it took the longest to melt. Look for the tallest bar.",
      visual,
    );
  }
  const bars = [
    { label: "foam cup", value: randInt(55, 60) },
    { label: "paper cup", value: randInt(45, 50) },
    { label: "metal cup", value: randInt(34, 40) },
  ];
  const visual: Visual = { type: "bars", title: "Hot water after 30 minutes (°C)", bars: shuffle(bars) };
  const labels = bars.map((b) => b.label);
  if (difficulty === 1) {
    return textChoice(
      "Three cups started with the same hot water. Which water is warmest after 30 minutes?",
      "foam cup",
      labels.filter((l) => l !== "foam cup"),
      "The tallest bar shows the highest temperature.",
      visual,
    );
  }
  if (difficulty === 2) {
    return textChoice(
      "Three cups started with the same hot water. Which cup is the best insulator?",
      "foam cup",
      labels.filter((l) => l !== "foam cup"),
      "An insulator slows heat from escaping, so the water in it stayed the warmest.",
      visual,
    );
  }
  return textChoice(
    "Three cups started with the same hot water. Which cup let heat escape the fastest?",
    "metal cup",
    labels.filter((l) => l !== "metal cup"),
    "Metal is a good conductor, so heat moved out through it quickly. Its water cooled the most: the shortest bar.",
    visual,
  );
}

const CONDUCTOR_SORT: SortSet = {
  prompt: "Conductor or insulator? Tap an item, then tap its basket.",
  hint: "Conductors, like metals, let heat move through them easily. Insulators, like wool, wood and foam, slow heat down.",
  bins: [
    { id: "conductor", label: "conductor (heat moves easily)", emoji: "🥄" },
    { id: "insulator", label: "insulator (slows heat)", emoji: "🧤" },
  ],
  items: [
    { label: "metal spoon", emoji: "🥄", bin: "conductor" },
    { label: "frying pan", emoji: "🍳", bin: "conductor" },
    { label: "metal key", emoji: "🔑", bin: "conductor" },
    { label: "coin", emoji: "🪙", bin: "conductor" },
    { label: "steel bolt", emoji: "🔩", bin: "conductor" },
    { label: "oven mitt", emoji: "🧤", bin: "insulator" },
    { label: "wool scarf", emoji: "🧣", bin: "insulator" },
    { label: "wooden block", emoji: "🪵", bin: "insulator" },
    { label: "winter coat", emoji: "🧥", bin: "insulator" },
    { label: "foam cup", emoji: "🥤", bin: "insulator" },
  ],
};

const THERMAL_BANK: Item[] = [
  {
    prompt: "What is Earth's biggest source of heat and light?",
    right: { label: "the sun", emoji: "☀️" },
    wrong: [
      { label: "the moon", emoji: "🌙" },
      { label: "the clouds", emoji: "☁️" },
    ],
    hint: "The sun warms the land, water and air all over Earth.",
  },
  {
    prompt: "Rub your hands together fast. What happens?",
    right: "they get warm",
    wrong: ["they get cold", "nothing changes"],
    hint: "Rubbing makes friction, and friction produces thermal energy (heat).",
    emoji: "👐",
  },
  {
    prompt: "Which one is a source of thermal energy?",
    right: { label: "a campfire", emoji: "🔥" },
    wrong: [
      { label: "an ice cube", emoji: "🧊" },
      { label: "a snowman", emoji: "⛄" },
    ],
    hint: "A source of thermal energy gives off heat. Burning wood gives off lots of heat.",
  },
  {
    prompt: "Heat always moves from…",
    right: "warmer things to cooler things",
    wrong: ["cooler things to warmer things", "nowhere, it stays still"],
    hint: "Hold an ice cube: heat moves from your warm hand into the cold ice, and the ice melts.",
    emoji: "🌡️",
  },
  {
    prompt: "A metal spoon sits in hot soup. Soon the handle feels hot. Why?",
    right: "heat moved through the metal",
    wrong: ["the spoon makes its own heat", "air blew on the handle"],
    hint: "Metal is a good conductor. Heat travels from the hot soup up through the spoon.",
    emoji: "🥄",
  },
  {
    prompt: "Which is a good insulator that keeps you warm?",
    right: { label: "a wool sweater", emoji: "🧶" },
    wrong: [
      { label: "a metal tray", emoji: "🍽️" },
      { label: "a wet T-shirt", emoji: "👕" },
    ],
    hint: "Wool traps air, which slows heat from leaving your body.",
  },
  {
    prompt: "Why do many pots have handles made of plastic or wood?",
    right: "they are insulators, so the handle stays cool enough to hold",
    wrong: ["they are conductors, so heat moves fast", "they make the food cook faster"],
    hint: "Plastic and wood slow heat down. That keeps your hand safe while the metal pot heats the food.",
    emoji: "🍲",
  },
  {
    prompt: "Which material is a good conductor of heat?",
    right: { label: "metal", emoji: "🔩" },
    wrong: [
      { label: "wool", emoji: "🧶" },
      { label: "foam", emoji: "🥤" },
    ],
    hint: "Metals let heat move through them quickly. That's why pots and pans are made of metal.",
  },
  {
    prompt: "How do mittens keep your hands warm in winter?",
    right: "they slow down heat leaving your hands",
    wrong: ["they make their own heat", "they push the cold away forever"],
    hint: "Your body makes the heat. Mittens are insulators that keep that heat in.",
    emoji: "🧤",
  },
  {
    prompt: "Where do our bodies get the energy to stay warm?",
    right: { label: "from the food we eat", emoji: "🍎" },
    wrong: [
      { label: "from the moon", emoji: "🌙" },
      { label: "from our shoes", emoji: "👟" },
    ],
    hint: "Food gives our bodies energy. Some of that energy becomes heat that keeps us warm.",
  },
  {
    prompt: "A thermometer measures…",
    right: "how hot or cold something is",
    wrong: ["how heavy something is", "how long something is"],
    hint: "A thermometer measures temperature in degrees Celsius (°C).",
    emoji: "🌡️",
  },
  {
    prompt: "On a cold morning, a metal bench and a wooden bench are the same temperature. Why does the metal feel colder?",
    right: "metal pulls heat from your body faster",
    wrong: ["metal is always colder than wood", "wood makes its own heat"],
    hint: "Metal is a conductor. It carries heat away from your skin quickly, so it feels colder.",
    emoji: "🪑",
    hard: true,
  },
  {
    prompt: "Snow is full of trapped air. That makes snow a good…",
    right: "insulator",
    wrong: ["conductor", "source of heat"],
    hint: "Trapped air slows heat down. Some animals dig into the snow to stay warm in winter!",
    emoji: "❄️",
    hard: true,
  },
  {
    prompt: "Why do birds fluff up their feathers when it is cold?",
    right: "trapped air keeps their body heat in",
    wrong: ["it lets more cold air reach their skin", "feathers make heat by themselves"],
    hint: "Fluffy feathers trap air, and air is a good insulator.",
    emoji: "🐦",
    hard: true,
  },
  {
    prompt: "You hold a mug of hot cocoa. Which way does the heat move?",
    right: "from the mug into your hands",
    wrong: ["from your hands into the mug", "it does not move at all"],
    hint: "Heat moves from warmer things to cooler things. The cocoa is warmer than your hands.",
    emoji: "☕",
    hard: true,
  },
  {
    prompt: "An ice cube is dropped into a glass of warm juice. What happens?",
    right: "heat moves from the juice to the ice, and the ice melts",
    wrong: ["the ice makes the juice boil", "the ice gets bigger and bigger"],
    hint: "Heat flows from warm to cool. The juice gives heat to the ice, so the ice melts and the juice cools.",
    emoji: "🧊",
    hard: true,
  },
  {
    prompt: "Which would keep a cold drink cold the longest in your lunch bag?",
    right: "an insulated bottle",
    wrong: ["a thin metal can", "a paper cup"],
    hint: "Insulated bottles slow heat from moving in, so cold drinks stay cold.",
    emoji: "🥤",
    hard: true,
  },
  {
    prompt: "Which of these produces thermal energy using friction?",
    right: "rubbing two sticks together",
    wrong: ["putting ice in a cup", "reading a book"],
    hint: "Rubbing things together makes friction, and friction makes heat.",
    emoji: "🪵",
    hard: true,
  },
  {
    prompt: "A metal pot heats up quickly on the stove because metal is a good…",
    right: "conductor",
    wrong: ["insulator", "decomposer"],
    hint: "Conductors let heat move through them easily.",
    emoji: "🍳",
    hard: true,
  },
  {
    prompt: "Why do builders put insulation inside the walls of a home?",
    right: "to keep heat inside in winter",
    wrong: ["to let cold air in", "to make the walls shiny"],
    hint: "Insulation slows heat from escaping, so homes stay warm and use less energy.",
    emoji: "🏠",
    hard: true,
  },
];

function thermal({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return shuffle([
    heatExperiment(difficulty),
    sortQuestion(CONDUCTOR_SORT, perBin(difficulty)),
    ...levelled(THERMAL_BANK, 6, difficulty),
  ]);
}

// ---------- Landforms ----------

const LAND_WATER_SORT: SortSet = {
  prompt: "Is it a landform or a body of water?",
  hint: "Landforms are shapes of the land, like mountains and islands. Bodies of water are places where water collects or flows.",
  bins: [
    { id: "land", label: "landform", emoji: "⛰️" },
    { id: "water", label: "body of water", emoji: "🌊" },
  ],
  items: [
    { label: "mountain", emoji: "🏔️", bin: "land" },
    { label: "island", emoji: "🏝️", bin: "land" },
    { label: "volcano", emoji: "🌋", bin: "land" },
    { label: "hill", emoji: "⛰️", bin: "land" },
    { label: "plain", emoji: "🌾", bin: "land" },
    { label: "ocean", emoji: "🌊", bin: "water" },
    { label: "lake", emoji: "🛶", bin: "water" },
    { label: "river", emoji: "🏞️", bin: "water" },
    { label: "pond", emoji: "🦆", bin: "water" },
  ],
};

const JAY_TRIP: Visual = {
  type: "passage",
  title: "Jay's Road Trip",
  paragraphs: [
    "Jay's family drove across a wide, flat plain covered with farms.",
    "Then the road climbed into tall, rocky mountains with snow on top.",
    "They stopped for lunch in a low valley beside a rushing river.",
    "The river flowed into a lake. In the middle of the lake was a small island with trees.",
  ],
};

const PRIYA_MODEL: Visual = {
  type: "passage",
  title: "Priya's Land Model",
  paragraphs: [
    "Priya built a model of the land. First she made a high plateau out of clay. It was flat on top.",
    "Then she poured water across it again and again. The water slowly cut a deep, narrow canyon.",
    "Where the water reached her pretend ocean, sand and mud piled up in a fan shape. Her grandpa said, “That's a delta!”",
  ],
};

const LAND_PASSAGE_BANK: Item[] = [
  {
    prompt: "What landform did Jay's family drive across first?",
    right: "a plain",
    wrong: ["a mountain", "an island", "a valley"],
    hint: "Look at the first sentence. A wide, flat area of land is a plain.",
    visual: JAY_TRIP,
  },
  {
    prompt: "Where did Jay's family stop for lunch?",
    right: "in a valley beside a river",
    wrong: ["on top of a mountain", "on the island"],
    hint: "Find the word “lunch” in the story. A valley is low land between hills or mountains.",
    visual: JAY_TRIP,
  },
  {
    prompt: "What was in the middle of the lake?",
    right: "an island",
    wrong: ["a volcano", "a canyon"],
    hint: "Read the last sentence. Land with water all around it is an island.",
    visual: JAY_TRIP,
  },
  {
    prompt: "What did the water cut into Priya's plateau?",
    right: "a deep, narrow canyon",
    wrong: ["a wide, flat plain", "a tall volcano"],
    hint: "Read the second paragraph. Moving water can slowly carve a canyon.",
    visual: PRIYA_MODEL,
  },
  {
    prompt: "In the story, what is the top of a plateau like?",
    right: "high and flat",
    wrong: ["low and wet", "pointy and steep"],
    hint: "Look at the first paragraph. A plateau is high land that is flat on top.",
    visual: PRIYA_MODEL,
  },
  {
    prompt: "What formed where the water reached the pretend ocean?",
    right: "a delta",
    wrong: ["a glacier", "a mountain"],
    hint: "Read the last paragraph. Sand and mud dropped by a river can build a delta.",
    visual: PRIYA_MODEL,
  },
];

const LANDFORM_BANK: Item[] = [
  {
    prompt: "Land with water all around it is called an…",
    right: { label: "island", emoji: "🏝️" },
    wrong: [
      { label: "peninsula", emoji: "🗺️" },
      { label: "valley", emoji: "🏞️" },
    ],
    hint: "An island is surrounded by water on every side.",
  },
  {
    prompt: "Low land between hills or mountains is called a…",
    right: "valley",
    wrong: ["plateau", "peak"],
    hint: "Valleys are the low places between higher land. Rivers often flow through them.",
    emoji: "🏞️",
  },
  {
    prompt: "A very high landform with steep sides is a…",
    right: "mountain",
    wrong: ["plain", "valley"],
    hint: "Mountains are the tallest landforms. Some have snow on top all year.",
    emoji: "🏔️",
  },
  {
    prompt: "A large, flat area of land is called a…",
    right: "plain",
    wrong: ["canyon", "hill"],
    hint: "Plains are wide and flat. They are often good for farming.",
    emoji: "🌾",
  },
  {
    prompt: "How is a hill different from a mountain?",
    right: "a hill is lower and more rounded",
    wrong: ["a hill is taller and pointier", "a hill is always covered in snow"],
    hint: "Hills and mountains are both raised land, but hills are smaller and gentler.",
    emoji: "⛰️",
  },
  {
    prompt: "Which landform can be carved by a river cutting deep into rock?",
    right: "a canyon",
    wrong: ["an island", "a mountain"],
    hint: "Over a very long time, a river can wear away rock and carve a deep canyon.",
    emoji: "🏜️",
  },
  {
    prompt: "What is a landform?",
    right: "a natural shape of Earth's surface",
    wrong: ["a type of cloud", "a building made by people"],
    hint: "Mountains, valleys, hills and islands are all landforms, natural shapes of the land.",
    emoji: "🌍",
  },
  {
    prompt: "Which landform can erupt with hot, melted rock?",
    right: { label: "volcano", emoji: "🌋" },
    wrong: [
      { label: "plateau", emoji: "🟫" },
      { label: "valley", emoji: "🏞️" },
    ],
    hint: "A volcano is an opening in Earth's surface where melted rock, called lava, can come out.",
  },
  {
    prompt: "A huge body of salt water is an…",
    right: "ocean",
    wrong: ["pond", "stream"],
    hint: "Oceans are the biggest bodies of water, and they are salty.",
    emoji: "🌊",
  },
  {
    prompt: "Many First Peoples' place names describe the land. What could a place name tell you?",
    right: "what the land is like, such as where two rivers meet",
    wrong: ["what time it is", "who won a race there"],
    hint: "Place names in Indigenous languages often hold knowledge about the land and what can be found there.",
    emoji: "🗺️",
  },
  {
    prompt: "Land with water on three sides is called a…",
    right: "peninsula",
    wrong: ["island", "lake", "canyon"],
    hint: "An island has water all around. A peninsula has water on three sides and is joined to land on one.",
    emoji: "🗺️",
    hard: true,
  },
  {
    prompt: "High land that is flat on top is called a…",
    right: "plateau",
    wrong: ["valley", "canyon"],
    hint: "A plateau is like a giant table: high up, but flat on top.",
    emoji: "🟫",
    hard: true,
  },
  {
    prompt: "A river slows down and drops sand and mud where it meets the ocean. This can build a…",
    right: "delta",
    wrong: ["volcano", "glacier"],
    hint: "A delta is new, flat land made from the sand and mud a river carries and drops.",
    emoji: "🌊",
    hard: true,
  },
  {
    prompt: "A deep, narrow valley with steep, rocky sides is a…",
    right: "canyon",
    wrong: ["plain", "delta"],
    hint: "Canyons have steep walls. They are often carved by a river over a very long time.",
    emoji: "🏜️",
    hard: true,
  },
  {
    prompt: "First Peoples have lived on and watched the land for thousands of years. What can their knowledge teach us?",
    right: "how local rivers, mountains and seasons change over time",
    wrong: ["only what happened last week", "only about faraway planets"],
    hint: "Knowledge gathered over many generations can show how the land changes over long periods of time.",
    emoji: "🏔️",
    hard: true,
  },
  {
    prompt: "Which landform is made by melted rock that builds up over time?",
    right: "volcano",
    wrong: ["valley", "delta"],
    hint: "Each time lava comes out and cools, the volcano can grow a little taller.",
    emoji: "🌋",
    hard: true,
  },
  {
    prompt: "Which landform is the lowest?",
    right: "valley",
    wrong: ["mountain", "plateau", "hill"],
    hint: "Mountains, hills and plateaus are raised land. A valley is low land between them.",
    emoji: "🏞️",
    hard: true,
  },
];

function landforms({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return shuffle([
    sortQuestion(LAND_WATER_SORT, perBin(difficulty)),
    ask(pick(LAND_PASSAGE_BANK)),
    ...levelled(LANDFORM_BANK, 6, difficulty),
  ]);
}

// ---------- Wind, Water & Ice ----------

const EROSION_ORDERS: Record<Level, OrderQuestion[]> = {
  1: [
    order(
      "How does ice break a rock? Put the steps in order.",
      "Water gets into a crack. When it freezes, it expands and pushes the crack wider until the rock breaks.",
      [
        ["rain fills a crack in a rock", "🌧️"],
        ["the water freezes and expands", "🧊"],
        ["the rock splits apart", "🪨"],
      ],
    ),
  ],
  2: [
    order(
      "How does ice break a rock? Put the steps in order.",
      "Water gets into a crack. When it freezes, it expands and pushes the crack wider until the rock breaks.",
      [
        ["rain fills a crack in a rock", "🌧️"],
        ["the water freezes and expands", "🧊"],
        ["the crack gets wider", "↔️"],
        ["the rock splits apart", "🪨"],
      ],
    ),
    order(
      "How does a river make a canyon? Put the steps in order.",
      "Moving water carries away tiny bits of rock. Over many, many years, the river cuts deeper and deeper.",
      [
        ["a river flows over rock", "🏞️"],
        ["the water carries away tiny bits of rock", "💧"],
        ["over many years, the river cuts deeper", "⏳"],
        ["a deep canyon forms", "🏜️"],
      ],
    ),
  ],
  3: [
    order(
      "How can a big rock become beach sand? Put the steps in order.",
      "First the rock is broken (weathering). Then water carries the pieces away (erosion), and they get smaller as they tumble.",
      [
        ["a big rock sits on a mountain", "⛰️"],
        ["ice splits the rock into pieces", "🧊"],
        ["a river tumbles the pieces and makes them smaller", "🏞️"],
        ["tiny grains of sand wash up on a beach", "🏖️"],
      ],
    ),
    order(
      "How does a river make a canyon? Put the steps in order.",
      "Moving water carries away tiny bits of rock. Over many, many years, the river cuts deeper and deeper.",
      [
        ["a river flows over rock", "🏞️"],
        ["the water carries away tiny bits of rock", "💧"],
        ["over many years, the river cuts deeper", "⏳"],
        ["a deep canyon forms", "🏜️"],
      ],
    ),
  ],
};

const AGENT_SORT: SortSet = {
  prompt: "What is changing the land: wind, water or ice?",
  hint: "Wind blows sand and dust. Water flows, splashes and washes things away. Ice freezes in cracks, and glaciers scrape the land.",
  bins: [
    { id: "wind", label: "wind", emoji: "🌬️" },
    { id: "water", label: "water", emoji: "🌊" },
    { id: "ice", label: "ice", emoji: "🧊" },
  ],
  items: [
    { label: "blows sand into dunes", emoji: "🏜️", bin: "wind" },
    { label: "blows dry soil off a field", emoji: "🌾", bin: "wind" },
    { label: "blowing sand wears a rock smooth", emoji: "🪨", bin: "wind" },
    { label: "waves wear away a cliff", emoji: "🏖️", bin: "water" },
    { label: "a river carves a canyon", emoji: "🏞️", bin: "water" },
    { label: "rain washes soil down a hill", emoji: "🌧️", bin: "water" },
    { label: "a glacier carves a valley", emoji: "🏔️", bin: "ice" },
    { label: "frozen water splits a rock", emoji: "❄️", bin: "ice" },
  ],
};

const WEATHER_EROSION_SORT: SortSet = {
  prompt: "Weathering (breaking rock) or erosion (moving it away)?",
  hint: "Weathering breaks rock into smaller pieces. Erosion carries the pieces somewhere new.",
  bins: [
    { id: "weathering", label: "weathering", emoji: "🔨" },
    { id: "erosion", label: "erosion", emoji: "🚚" },
  ],
  items: [
    { label: "ice cracks a boulder", emoji: "🧊", bin: "weathering" },
    { label: "waves break rocks into pebbles", emoji: "🌊", bin: "weathering" },
    { label: "blowing sand chips a rock", emoji: "🌬️", bin: "weathering" },
    { label: "rain slowly wears down a stone wall", emoji: "🧱", bin: "weathering" },
    { label: "a river carries sand downstream", emoji: "🏞️", bin: "erosion" },
    { label: "wind blows soil away", emoji: "🌾", bin: "erosion" },
    { label: "a glacier drags rocks along", emoji: "🏔️", bin: "erosion" },
    { label: "rain washes mud down a hill", emoji: "🌧️", bin: "erosion" },
  ],
};

const EROSION_BANK: Item[] = [
  {
    prompt: "Breaking rock into smaller pieces is called…",
    right: "weathering",
    wrong: ["erosion", "melting"],
    hint: "Weathering breaks rock down. Wind, water and ice can all do it.",
    emoji: "🪨",
  },
  {
    prompt: "Moving bits of rock and soil to a new place is called…",
    right: "erosion",
    wrong: ["weathering", "freezing"],
    hint: "Erosion carries rock and soil away, like a river carrying sand downstream.",
    emoji: "🏞️",
  },
  {
    prompt: "Which of these can wear away rock over a long time?",
    right: { label: "flowing water", emoji: "🌊" },
    wrong: [
      { label: "moonlight", emoji: "🌙" },
      { label: "a rainbow", emoji: "🌈" },
    ],
    hint: "Wind, water and ice are strong enough to change the shape of the land.",
  },
  {
    prompt: "Rocks in a river are often smooth and round. Why?",
    right: "they tumble and rub together in the water for a long time",
    wrong: ["people polish them", "they grow that way"],
    hint: "Moving water knocks the rocks into each other. Their sharp edges slowly wear off.",
    emoji: "🪨",
  },
  {
    prompt: "How does a glacier change the land?",
    right: "it scrapes and carves rock as it slowly moves",
    wrong: ["it builds volcanoes", "it makes the land float"],
    hint: "A glacier is a huge, slow river of ice. It pushes rocks and carves out valleys.",
    emoji: "🏔️",
  },
  {
    prompt: "Where does most beach sand come from?",
    right: "rocks and shells broken into tiny pieces",
    wrong: ["salt from the ocean", "melted ice"],
    hint: "Waves and rivers break rocks and shells into tiny grains over a very long time.",
    emoji: "🏖️",
  },
  {
    prompt: "Which helps stop soil from washing away?",
    right: "plants with roots that hold the soil",
    wrong: ["cutting down all the trees", "pulling out all the grass"],
    hint: "Roots grip the soil like a net, so rain and wind can't carry it off as easily.",
    emoji: "🌱",
  },
  {
    prompt: "Wind can pile sand into hills called…",
    right: "dunes",
    wrong: ["glaciers", "deltas"],
    hint: "Sand dunes are made by wind blowing sand into big piles.",
    emoji: "🏜️",
  },
  {
    prompt: "How fast do weathering and erosion usually change the land?",
    right: "slowly, over many years",
    wrong: ["in one second", "only at night"],
    hint: "Most changes are slow. It can take thousands of years for a river to carve a canyon.",
    emoji: "⏳",
  },
  {
    prompt: "What happens when water freezes in a crack in a rock?",
    right: "it expands and can split the rock",
    wrong: ["it shrinks and glues the rock", "it disappears"],
    hint: "Water takes up more space when it freezes. That push can crack rocks apart.",
    emoji: "🧊",
  },
  {
    prompt: "Ocean waves crash on a rocky cliff every day. Over many years, the cliff…",
    right: "wears away",
    wrong: ["grows taller", "turns into ice"],
    hint: "Each wave breaks off tiny bits of rock. Over time, the cliff wears away.",
    emoji: "🌊",
  },
  {
    prompt: "A valley shaped like a V was most likely carved by…",
    right: "a river",
    wrong: ["a glacier", "the wind"],
    hint: "Rivers cut narrow V-shaped valleys. Glaciers scrape out wide U-shaped valleys.",
    emoji: "🏞️",
    hard: true,
  },
  {
    prompt: "A wide valley shaped like a U was most likely carved by…",
    right: "a glacier",
    wrong: ["a small stream", "the wind"],
    hint: "Glaciers are huge and heavy. They scrape out wide, U-shaped valleys.",
    emoji: "🏔️",
    hard: true,
  },
  {
    prompt: "Which is an example of erosion, not weathering?",
    right: "a river carrying sand downstream",
    wrong: ["ice cracking a rock", "a rock splitting in two"],
    hint: "Erosion means moving. Weathering means breaking.",
    emoji: "🚚",
    hard: true,
  },
  {
    prompt: "Which is an example of weathering, not erosion?",
    right: "ice splitting a rock into pieces",
    wrong: ["wind carrying sand away", "a river carrying mud to the ocean"],
    hint: "Weathering breaks rock where it is. Erosion carries pieces somewhere else.",
    emoji: "🔨",
    hard: true,
  },
  {
    prompt: "Why does a river look brown after a big rainstorm?",
    right: "it is carrying soil that the rain washed away",
    wrong: ["fish changed the water's colour", "the clouds were brown"],
    hint: "Heavy rain washes soil into rivers. That is erosion you can see!",
    emoji: "🌧️",
    hard: true,
  },
  {
    prompt: "When a glacier melts back, what does it leave behind?",
    right: "piles of rocks and soil it carried",
    wrong: ["a new volcano", "a field of seashells"],
    hint: "Glaciers carry rocks and soil as they move. When the ice melts, the rocks stay behind.",
    emoji: "🧊",
    hard: true,
  },
  {
    prompt: "Farmers plant rows of trees beside their fields. How does this help?",
    right: "the trees slow the wind, so less soil blows away",
    wrong: ["the trees make the wind stronger", "the trees pull soil up into the sky"],
    hint: "Trees block the wind. Slower wind can't carry away as much soil.",
    emoji: "🌳",
    hard: true,
  },
  {
    prompt: "Which change to the land can happen quickly?",
    right: "a flood washing away a riverbank",
    wrong: ["a glacier carving a valley", "wind wearing down a mountain"],
    hint: "Most changes are slow, but floods and big storms can change the land in a day.",
    emoji: "🌊",
    hard: true,
  },
  {
    prompt: "Some First Peoples' oral histories tell about floods and rivers changing course long ago. What does this show?",
    right: "oral histories hold long-term knowledge of the land",
    wrong: ["the land never changes", "stories are never about real places"],
    hint: "Knowledge passed down over many generations can remember changes to the land from long ago.",
    emoji: "🗣️",
    hard: true,
  },
];

function windWaterIce({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const sort =
    difficulty === 3 ? pick([sortQuestion(WEATHER_EROSION_SORT, 4), sortQuestion(AGENT_SORT, 2)]) : sortQuestion(AGENT_SORT, 2);
  return shuffle([pick(EROSION_ORDERS[difficulty]), sort, ...levelled(EROSION_BANK, 6, difficulty)]);
}

export const course: Course = {
  grade: "3",
  subject: "science",
  bigIdeas: {
    "ca-bc": [
      "Living things are diverse, can be grouped, and interact in their ecosystems.",
      "All matter is made of particles.",
      "Thermal energy can be produced and transferred.",
      "Wind, water, and ice change the shape of the land.",
    ],
  },
  units: [
    {
      id: "grouping-living-things",
      title: "Grouping Living Things",
      emoji: "🐞",
      blurb: "Sort living things into groups",
      standards: { "ca-bc": "Biodiversity in the local environment; living things can be grouped by their features" },
      parentNote:
        "Biodiversity (the variety of life in a place) and sorting living things into groups by their features: backbones, legs, fur, feathers, fins and more.",
      generate: groupingLife,
    },
    {
      id: "food-chains",
      title: "Ecosystems & Food Chains",
      emoji: "🦊",
      blurb: "Energy from the sun to you",
      standards: {
        "ca-bc": "Energy is needed for life; living things interact in ecosystems; local First Peoples knowledge of ecosystems",
      },
      parentNote:
        "How energy from the sun moves through food chains (producers, consumers and decomposers), how living things in an ecosystem depend on each other, and how First Peoples' knowledge of local ecosystems is passed down.",
      generate: ecosystems,
    },
    {
      id: "particles",
      title: "Matter & Particles",
      emoji: "🧊",
      blurb: "Everything is made of particles",
      standards: { "ca-bc": "Matter is made of particles; changes in states of matter with heating and cooling" },
      parentNote:
        "All matter is made of tiny particles. How particles are arranged in solids, liquids and gases, and how heating and cooling cause melting, freezing, evaporation and condensation.",
      generate: particles,
    },
    {
      id: "thermal-energy",
      title: "Thermal Energy",
      emoji: "🔥",
      blurb: "Heat on the move",
      standards: { "ca-bc": "Sources of thermal energy; thermal energy transfer; heat conductors and insulators" },
      parentNote:
        "Where heat comes from (the sun, fire, friction, food), how heat moves from warmer things to cooler things, and which materials are conductors or insulators, including reading simple experiment graphs.",
      generate: thermal,
    },
    {
      id: "landforms",
      title: "Landforms",
      emoji: "🏔️",
      blurb: "Mountains, valleys, islands and more",
      standards: { "ca-bc": "Types of landforms; local First Peoples knowledge of local landforms" },
      parentNote:
        "Naming landforms such as mountains, valleys, plains, plateaus, islands, peninsulas, canyons and deltas, and how First Peoples' place names and knowledge describe the land.",
      generate: landforms,
    },
    {
      id: "wind-water-ice",
      title: "Wind, Water & Ice",
      emoji: "🌊",
      blurb: "How the land changes shape",
      standards: { "ca-bc": "Weathering and erosion by wind, water and ice; how landforms change over time" },
      parentNote:
        "How wind, water and ice break rock down (weathering) and carry it away (erosion), slowly changing the shape of the land, and how plants and windbreaks protect soil.",
      generate: windWaterIce,
    },
  ],
};
