import { pick, shuffle } from "../../random";
import type { Course, GenerateOptions, OrderQuestion, Question } from "../../types";
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

/** Smaller sorts for little hands at difficulty 1, bigger ones at 3. */
const perBin = (difficulty: Level) => (difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4);

// ---------- Living Things ----------

const LIVING_SORT: SortSet = {
  prompt: "Is it living or not living? Tap an item, then tap its basket.",
  hint: "Living things grow, need food and water, and make more of their kind.",
  bins: [
    { id: "living", label: "living", emoji: "🌱" },
    { id: "not", label: "not living", emoji: "🧱" },
  ],
  items: [
    { label: "dog", emoji: "🐕", bin: "living" },
    { label: "tree", emoji: "🌳", bin: "living" },
    { label: "bird", emoji: "🐦", bin: "living" },
    { label: "fish", emoji: "🐟", bin: "living" },
    { label: "ladybug", emoji: "🐞", bin: "living" },
    { label: "worm", emoji: "🪱", bin: "living" },
    { label: "flower", emoji: "🌷", bin: "living" },
    { label: "rock", emoji: "🪨", bin: "not" },
    { label: "ball", emoji: "⚽", bin: "not" },
    { label: "chair", emoji: "🪑", bin: "not" },
    { label: "teddy bear", emoji: "🧸", bin: "not" },
    { label: "toy car", emoji: "🚗", bin: "not" },
    { label: "robot", emoji: "🤖", bin: "not" },
    { label: "pencil", emoji: "✏️", bin: "not" },
  ],
};

const PLANT_ANIMAL_SORT: SortSet = {
  prompt: "Is it a plant or an animal? Tap an item, then tap its basket.",
  hint: "Plants stay in one spot and use sunlight to make food. Animals move around to find food.",
  bins: [
    { id: "plant", label: "plant", emoji: "🪴" },
    { id: "animal", label: "animal", emoji: "🐾" },
  ],
  items: [
    { label: "pine tree", emoji: "🌲", bin: "plant" },
    { label: "maple tree", emoji: "🍁", bin: "plant" },
    { label: "tulip", emoji: "🌷", bin: "plant" },
    { label: "sunflower", emoji: "🌻", bin: "plant" },
    { label: "clover", emoji: "☘️", bin: "plant" },
    { label: "blueberry bush", emoji: "🫐", bin: "plant" },
    { label: "deer", emoji: "🦌", bin: "animal" },
    { label: "owl", emoji: "🦉", bin: "animal" },
    { label: "bee", emoji: "🐝", bin: "animal" },
    { label: "frog", emoji: "🐸", bin: "animal" },
    { label: "snail", emoji: "🐌", bin: "animal" },
    { label: "rabbit", emoji: "🐇", bin: "animal" },
    { label: "beaver", emoji: "🦫", bin: "animal" },
    { label: "raccoon", emoji: "🦝", bin: "animal" },
  ],
};

const LIVING_BANK: Item[] = [
  {
    prompt: "Which one is living?",
    right: { label: "tree", emoji: "🌳" },
    wrong: [
      { label: "rock", emoji: "🪨" },
      { label: "chair", emoji: "🪑" },
    ],
    hint: "A tree is alive. It drinks water and grows taller every year!",
  },
  {
    prompt: "Tap the living thing.",
    right: { label: "cat", emoji: "🐈" },
    wrong: [
      { label: "teddy bear", emoji: "🧸" },
      { label: "toy car", emoji: "🚗" },
    ],
    hint: "A cat eats, drinks and grows. Toys never do!",
  },
  {
    prompt: "Which one is NOT living?",
    speak: "Which one is not living?",
    right: { label: "ball", emoji: "⚽" },
    wrong: [
      { label: "bird", emoji: "🐦" },
      { label: "flower", emoji: "🌷" },
    ],
    hint: "A ball can't eat, drink or grow, so it is not living.",
  },
  {
    prompt: "What do all living things need?",
    right: { label: "water", emoji: "💧" },
    wrong: [
      { label: "toys", emoji: "🧸" },
      { label: "shoes", emoji: "👟" },
    ],
    hint: "Plants, animals and people all need water to stay alive.",
  },
  {
    prompt: "What do plants need to grow?",
    right: { label: "sunlight and water", emoji: "☀️" },
    wrong: [
      { label: "candy", emoji: "🍬" },
      { label: "music", emoji: "🎵" },
    ],
    hint: "Plants need sunlight, water, air and soil to grow.",
    emoji: "🌱",
  },
  {
    prompt: "Which one is an animal?",
    right: { label: "deer", emoji: "🦌" },
    wrong: [
      { label: "pine tree", emoji: "🌲" },
      { label: "rock", emoji: "🪨" },
    ],
    hint: "Animals move around and eat food. A deer walks in the forest looking for plants to eat.",
  },
  {
    prompt: "Which one is a plant?",
    right: { label: "sunflower", emoji: "🌻" },
    wrong: [
      { label: "bee", emoji: "🐝" },
      { label: "ball", emoji: "⚽" },
    ],
    hint: "A sunflower grows from a seed in the soil. That makes it a plant!",
  },
  {
    prompt: "A kitten grows. A teddy bear does not. Which is living?",
    right: { label: "kitten", emoji: "🐱" },
    wrong: [{ label: "teddy bear", emoji: "🧸" }],
    hint: "Living things grow and change. A kitten grows into a cat!",
  },
  {
    prompt: "Is a seed living?",
    right: { label: "Yes, it can grow into a plant", emoji: "🌱" },
    wrong: [{ label: "No, it is like a rock", emoji: "🪨" }],
    hint: "A seed is alive! Give it water and soil and it will grow into a plant.",
    emoji: "🌰",
    hard: true,
  },
  {
    prompt: "A robot can move. Is it living?",
    right: { label: "No, it can't grow or eat", emoji: "🤖" },
    wrong: [{ label: "Yes, because it moves", emoji: "🏃" }],
    hint: "Moving isn't enough. Living things grow, eat and make more of their kind.",
    hard: true,
  },
  {
    prompt: "A cloud moves and changes. Is it living?",
    right: { label: "No, it is not alive", emoji: "☁️" },
    wrong: [{ label: "Yes, it is alive", emoji: "💚" }],
    hint: "Clouds are made of tiny drops of water. They don't eat, grow up or have babies.",
    hard: true,
  },
  {
    prompt: "Which part of a plant drinks water from the soil?",
    right: "the roots",
    wrong: ["the flowers", "the leaves"],
    hint: "Roots grow down into the soil and soak up water, like a straw.",
    emoji: "🌱",
    hard: true,
  },
  {
    prompt: "Plants use sunlight to make their own…",
    right: { label: "food", emoji: "🍽️" },
    wrong: [
      { label: "noise", emoji: "🔊" },
      { label: "rocks", emoji: "🪨" },
    ],
    hint: "Leaves catch sunlight and use it to make food for the plant.",
    emoji: "🍃",
    hard: true,
  },
  {
    prompt: "A duck lays eggs. What hatches out?",
    right: { label: "baby ducks", emoji: "🐣" },
    wrong: [
      { label: "puppies", emoji: "🐶" },
      { label: "kittens", emoji: "🐱" },
    ],
    hint: "Living things make more of their own kind. Ducks have baby ducks!",
    emoji: "🦆",
    hard: true,
  },
  {
    prompt: "Which one needs air, food and water?",
    right: { label: "rabbit", emoji: "🐇" },
    wrong: [
      { label: "bike", emoji: "🚲" },
      { label: "kite", emoji: "🪁" },
    ],
    hint: "Only living things need air, food and water. A rabbit is alive!",
    hard: true,
  },
];

function livingThings({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return shuffle([
    sortQuestion(LIVING_SORT, perBin(difficulty)),
    sortQuestion(PLANT_ANIMAL_SORT, perBin(difficulty)),
    ...levelled(LIVING_BANK, 6, difficulty),
  ]);
}

// ---------- Animal Survival ----------

const FEATURE_SORT: SortSet = {
  prompt: "Is it a body part or something an animal does?",
  hint: "Body parts are things an animal has, like fur. Other things are what it does, like sleeping.",
  bins: [
    { id: "body", label: "body part", emoji: "🦶" },
    { id: "does", label: "something it does", emoji: "🏃" },
  ],
  items: [
    { label: "thick fur", emoji: "🐻", bin: "body" },
    { label: "webbed feet", emoji: "🦆", bin: "body" },
    { label: "hard shell", emoji: "🐢", bin: "body" },
    { label: "sharp beak", emoji: "🦉", bin: "body" },
    { label: "fins", emoji: "🐟", bin: "body" },
    { label: "long ears", emoji: "🐇", bin: "body" },
    { label: "sleeps all winter", emoji: "💤", bin: "does" },
    { label: "flies south in fall", emoji: "🐦", bin: "does" },
    { label: "stores nuts", emoji: "🌰", bin: "does" },
    { label: "builds a dam", emoji: "🦫", bin: "does" },
    { label: "hunts at night", emoji: "🌙", bin: "does" },
  ],
};

const ANIMAL_BANK: Item[] = [
  {
    prompt: "Which animal has thick fur to stay warm?",
    right: { label: "bear", emoji: "🐻" },
    wrong: [
      { label: "frog", emoji: "🐸" },
      { label: "fish", emoji: "🐟" },
    ],
    hint: "Thick fur is like a warm coat that an animal never takes off.",
  },
  {
    prompt: "What helps a duck swim?",
    right: { label: "webbed feet", emoji: "🦶" },
    wrong: [
      { label: "long ears", emoji: "👂" },
      { label: "sharp claws", emoji: "🐾" },
    ],
    hint: "A duck's webbed feet push the water like paddles.",
    emoji: "🦆",
  },
  {
    prompt: "What helps a fish swim?",
    right: { label: "fins and a tail", emoji: "🐟" },
    wrong: [
      { label: "legs", emoji: "🦵" },
      { label: "feathers", emoji: "🪶" },
    ],
    hint: "A fish swishes its tail and uses its fins to steer.",
  },
  {
    prompt: "What helps a bird fly?",
    right: { label: "wings and feathers", emoji: "🪶" },
    wrong: [
      { label: "fins", emoji: "🐟" },
      { label: "a hard shell", emoji: "🐢" },
    ],
    hint: "Birds flap their wings. Light feathers help them lift into the air.",
    emoji: "🐦",
  },
  {
    prompt: "What keeps a turtle safe?",
    right: { label: "its hard shell", emoji: "🐢" },
    wrong: [
      { label: "its long ears", emoji: "👂" },
      { label: "its fluffy fur", emoji: "🧸" },
    ],
    hint: "A turtle can pull its head and legs inside its hard shell to stay safe.",
  },
  {
    prompt: "Why does a squirrel hide nuts in the fall?",
    right: { label: "to eat in winter", emoji: "❄️" },
    wrong: [
      { label: "to make a bed", emoji: "🛏️" },
      { label: "to give to birds", emoji: "🐦" },
    ],
    hint: "Food is hard to find in winter, so squirrels save nuts for later.",
    emoji: "🐿️",
  },
  {
    prompt: "Why do many birds fly south in the fall?",
    right: { label: "to find food and warmth", emoji: "☀️" },
    wrong: [
      { label: "to find more snow", emoji: "❄️" },
      { label: "to sleep in caves", emoji: "💤" },
    ],
    hint: "Winter is cold with little food, so many birds fly to warmer places. That is called migrating.",
  },
  {
    prompt: "Many bears sleep all winter. What is this called?",
    right: { label: "hibernating", emoji: "💤" },
    wrong: [
      { label: "migrating", emoji: "🐦" },
      { label: "swimming", emoji: "🏊" },
    ],
    hint: "A long winter sleep is called hibernating. Bears wake up in spring!",
    emoji: "🐻",
  },
  {
    prompt: "An owl hunts at night. What helps it see?",
    right: { label: "big eyes", emoji: "👀" },
    wrong: [
      { label: "webbed feet", emoji: "🦶" },
      { label: "a long tail", emoji: "〰️" },
    ],
    hint: "An owl's big eyes let in lots of light, so it can see in the dark.",
    emoji: "🦉",
  },
  {
    prompt: "A green frog sits on a green leaf. Why is it hard to see?",
    right: { label: "its colour blends in", emoji: "🍃" },
    wrong: [
      { label: "it is very fast", emoji: "💨" },
      { label: "it is asleep", emoji: "💤" },
    ],
    hint: "Its colour matches the leaf. Hiding by blending in is called camouflage.",
    emoji: "🐸",
    hard: true,
  },
  {
    prompt: "Snowshoe hares turn white in winter. How does this help?",
    right: { label: "they can hide in the snow", emoji: "❄️" },
    wrong: [
      { label: "they stay cooler", emoji: "🧊" },
      { label: "they can swim", emoji: "🏊" },
    ],
    hint: "White fur blends in with snow, so foxes can't spot them. That's camouflage!",
    emoji: "🐇",
    hard: true,
  },
  {
    prompt: "Which animal flies south for the winter?",
    right: { label: "duck", emoji: "🦆" },
    wrong: [
      { label: "frog", emoji: "🐸" },
      { label: "squirrel", emoji: "🐿️" },
    ],
    hint: "Many ducks fly to warmer places for winter. That is called migrating.",
    hard: true,
  },
  {
    prompt: "What does a beaver use to cut down trees?",
    right: { label: "strong front teeth", emoji: "🦷" },
    wrong: [
      { label: "its flat tail", emoji: "🦫" },
      { label: "its webbed feet", emoji: "🦶" },
    ],
    hint: "A beaver chews through wood with its strong front teeth. They never stop growing!",
    hard: true,
  },
  {
    prompt: "Which one is a behaviour (something an animal does)?",
    right: { label: "a bear sleeps all winter", emoji: "💤" },
    wrong: [
      { label: "a bear has thick fur", emoji: "🐻" },
      { label: "a duck has webbed feet", emoji: "🦆" },
    ],
    hint: "A behaviour is an action. Fur and feet are body parts, but sleeping is something you do.",
    hard: true,
  },
  {
    prompt: "Why do many animals grow thicker fur in the fall?",
    right: { label: "to stay warm in winter", emoji: "❄️" },
    wrong: [
      { label: "to swim faster", emoji: "🏊" },
      { label: "to hide food", emoji: "🌰" },
    ],
    hint: "Winter is coming! Thicker fur keeps animals warm when it's cold.",
    hard: true,
  },
  {
    prompt: "Frogs can't keep warm in winter. What do many of them do?",
    right: { label: "rest in mud or leaves until spring", emoji: "💤" },
    wrong: [
      { label: "fly south", emoji: "🐦" },
      { label: "grow thick fur", emoji: "🐻" },
    ],
    hint: "Many frogs hide in mud or under leaves and rest all winter. That is hibernating.",
    emoji: "🐸",
    hard: true,
  },
];

function animalSurvival({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return shuffle([sortQuestion(FEATURE_SORT, perBin(difficulty)), ...levelled(ANIMAL_BANK, 7, difficulty)]);
}

// ---------- Materials ----------

const HARD_SOFT_SORT: SortSet = {
  prompt: "Is it hard or soft? Tap an item, then tap its basket.",
  hint: "Press it in your mind. Soft things squish. Hard things don't.",
  bins: [
    { id: "hard", label: "hard", emoji: "🔨" },
    { id: "soft", label: "soft", emoji: "☁️" },
  ],
  items: [
    { label: "rock", emoji: "🪨", bin: "hard" },
    { label: "brick", emoji: "🧱", bin: "hard" },
    { label: "key", emoji: "🔑", bin: "hard" },
    { label: "spoon", emoji: "🥄", bin: "hard" },
    { label: "shell", emoji: "🐚", bin: "hard" },
    { label: "coin", emoji: "🪙", bin: "hard" },
    { label: "teddy bear", emoji: "🧸", bin: "soft" },
    { label: "sock", emoji: "🧦", bin: "soft" },
    { label: "scarf", emoji: "🧣", bin: "soft" },
    { label: "mittens", emoji: "🧤", bin: "soft" },
    { label: "sponge", emoji: "🧽", bin: "soft" },
    { label: "feather", emoji: "🪶", bin: "soft" },
  ],
};

const SEE_THROUGH_SORT: SortSet = {
  prompt: "Can you see through it? Tap an item, then tap its basket.",
  hint: "If light passes through and you can see what's behind it, it is see-through.",
  bins: [
    { id: "clear", label: "see-through", emoji: "👀" },
    { id: "opaque", label: "not see-through", emoji: "🙈" },
  ],
  items: [
    { label: "window", emoji: "🪟", bin: "clear" },
    { label: "glasses", emoji: "👓", bin: "clear" },
    { label: "glass cup", emoji: "🥃", bin: "clear" },
    { label: "magnifying glass", emoji: "🔍", bin: "clear" },
    { label: "brick wall", emoji: "🧱", bin: "opaque" },
    { label: "book", emoji: "📕", bin: "opaque" },
    { label: "wooden door", emoji: "🚪", bin: "opaque" },
    { label: "rock", emoji: "🪨", bin: "opaque" },
    { label: "box", emoji: "📦", bin: "opaque" },
  ],
};

const MATERIAL_BANK: Item[] = [
  {
    prompt: "What is the best material for a raincoat?",
    right: { label: "waterproof plastic", emoji: "🧥" },
    wrong: [
      { label: "paper", emoji: "📄" },
      { label: "cotton, like a T-shirt", emoji: "👕" },
    ],
    hint: "A raincoat must keep water out. Waterproof plastic does that!",
    emoji: "🌧️",
  },
  {
    prompt: "What are windows made of so we can see out?",
    right: { label: "glass", emoji: "🪟" },
    wrong: [
      { label: "wood", emoji: "🪵" },
      { label: "brick", emoji: "🧱" },
    ],
    hint: "Glass is see-through, so light comes in and we can see outside.",
  },
  {
    prompt: "Which is best for a cozy, warm blanket?",
    right: { label: "soft wool", emoji: "🧶" },
    wrong: [
      { label: "hard wood", emoji: "🪵" },
      { label: "metal", emoji: "🔩" },
    ],
    hint: "A blanket should be soft and warm. Wool is both!",
    emoji: "🛏️",
  },
  {
    prompt: "Which one is made of wood?",
    right: { label: "pencil", emoji: "✏️" },
    wrong: [
      { label: "spoon", emoji: "🥄" },
      { label: "window", emoji: "🪟" },
    ],
    hint: "Most pencils are wood on the outside. Wood comes from trees.",
  },
  {
    prompt: "Which one is made of metal?",
    right: { label: "key", emoji: "🔑" },
    wrong: [
      { label: "sock", emoji: "🧦" },
      { label: "book", emoji: "📕" },
    ],
    hint: "Metal is hard, strong and often shiny, like a key.",
  },
  {
    prompt: "Which one is soft?",
    right: { label: "teddy bear", emoji: "🧸" },
    wrong: [
      { label: "rock", emoji: "🪨" },
      { label: "brick", emoji: "🧱" },
    ],
    hint: "Soft things squish when you squeeze them, like a teddy bear.",
  },
  {
    prompt: "Which one can you fold easily?",
    right: { label: "paper", emoji: "📄" },
    wrong: [
      { label: "rock", emoji: "🪨" },
      { label: "glass cup", emoji: "🥃" },
    ],
    hint: "Paper is thin and bendy, so it folds easily.",
  },
  {
    prompt: "Which keeps your feet dry in a puddle?",
    right: { label: "rubber boots", emoji: "👢" },
    wrong: [
      { label: "cotton socks", emoji: "🧦" },
      { label: "bare feet", emoji: "🦶" },
    ],
    hint: "Rubber is waterproof. It keeps water out!",
  },
  {
    prompt: "Which material would make the strongest house?",
    right: { label: "bricks", emoji: "🧱" },
    wrong: [
      { label: "straw", emoji: "🌾" },
      { label: "paper", emoji: "📄" },
    ],
    hint: "Bricks are hard and strong. They keep a house standing in wind and rain.",
    emoji: "🏠",
  },
  {
    prompt: "Wool comes from…",
    right: { label: "sheep", emoji: "🐑" },
    wrong: [
      { label: "trees", emoji: "🌳" },
      { label: "fish", emoji: "🐟" },
    ],
    hint: "Sheep grow woolly coats. Farmers give them a haircut and spin the wool into yarn.",
    emoji: "🧶",
  },
  {
    prompt: "Why are boots often made of rubber?",
    right: { label: "rubber keeps water out", emoji: "💧" },
    wrong: [
      { label: "rubber is see-through", emoji: "👀" },
      { label: "rubber melts in rain", emoji: "🌧️" },
    ],
    hint: "Rubber is waterproof, so your feet stay dry.",
    emoji: "👢",
    hard: true,
  },
  {
    prompt: "Why is a cooking pot made of metal?",
    right: { label: "it won't burn on the stove", emoji: "🍳" },
    wrong: [
      { label: "it is soft and fluffy", emoji: "🧸" },
      { label: "it is see-through", emoji: "👀" },
    ],
    hint: "Metal is strong and can get very hot without burning.",
    hard: true,
  },
  {
    prompt: "Which one floats in water?",
    right: { label: "wooden log", emoji: "🪵" },
    wrong: [
      { label: "rock", emoji: "🪨" },
      { label: "metal key", emoji: "🔑" },
    ],
    hint: "Wood floats! Rocks and metal keys sink to the bottom.",
    emoji: "🌊",
    hard: true,
  },
  {
    prompt: "Why isn't an umbrella made of paper?",
    right: { label: "paper gets soggy in rain", emoji: "💧" },
    wrong: [
      { label: "paper is too heavy", emoji: "🏋️" },
      { label: "paper is too hard", emoji: "🧱" },
    ],
    hint: "Paper soaks up water and tears. An umbrella needs a waterproof material.",
    emoji: "☔",
    hard: true,
  },
  {
    prompt: "A spoon for hot soup should NOT be made of…",
    speak: "A spoon for hot soup should not be made of what?",
    right: { label: "ice", emoji: "🧊" },
    wrong: [
      { label: "metal", emoji: "🥄" },
      { label: "wood", emoji: "🪵" },
    ],
    hint: "Hot soup would melt an ice spoon right away!",
    emoji: "🍲",
    hard: true,
  },
  {
    prompt: "Which one is made of more than one material?",
    right: { label: "pencil with an eraser", emoji: "✏️" },
    wrong: [
      { label: "rock", emoji: "🪨" },
      { label: "ice cube", emoji: "🧊" },
    ],
    hint: "A pencil has wood, a dark middle, a metal band and an eraser.",
    hard: true,
  },
  {
    prompt: "Which material comes from trees?",
    right: { label: "wood", emoji: "🪵" },
    wrong: [
      { label: "glass", emoji: "🥃" },
      { label: "metal", emoji: "🔩" },
    ],
    hint: "Wood is cut from trees. We use it for houses, chairs and paper.",
    hard: true,
  },
  {
    prompt: "Why do we make windows from glass?",
    right: { label: "light can shine through", emoji: "☀️" },
    wrong: [
      { label: "glass is soft", emoji: "🧸" },
      { label: "glass is bendy", emoji: "〰️" },
    ],
    hint: "Glass is see-through, so sunlight comes in and we can see out.",
    emoji: "🪟",
    hard: true,
  },
];

function materials({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const sort = pick([HARD_SOFT_SORT, SEE_THROUGH_SORT]);
  return shuffle([sortQuestion(sort, perBin(difficulty)), ...levelled(MATERIAL_BANK, 7, difficulty)]);
}

// ---------- Light & Sound ----------

const LIGHT_SORT: SortSet = {
  prompt: "Does it make its own light? Tap an item, then tap its basket.",
  hint: "Light sources glow on their own. The moon and mirrors only bounce light back.",
  bins: [
    { id: "light", label: "makes light", emoji: "✨" },
    { id: "dark", label: "does not make light", emoji: "⬛" },
  ],
  items: [
    { label: "sun", emoji: "☀️", bin: "light" },
    { label: "candle", emoji: "🕯️", bin: "light" },
    { label: "flashlight", emoji: "🔦", bin: "light" },
    { label: "light bulb", emoji: "💡", bin: "light" },
    { label: "campfire", emoji: "🔥", bin: "light" },
    { label: "star", emoji: "⭐", bin: "light" },
    { label: "moon", emoji: "🌙", bin: "dark" },
    { label: "mirror", emoji: "🪞", bin: "dark" },
    { label: "book", emoji: "📕", bin: "dark" },
    { label: "spoon", emoji: "🥄", bin: "dark" },
    { label: "teddy bear", emoji: "🧸", bin: "dark" },
    { label: "rock", emoji: "🪨", bin: "dark" },
  ],
};

const SOUND_SORT: SortSet = {
  prompt: "Is the sound loud or quiet? Tap an item, then tap its basket.",
  hint: "Loud sounds are big and strong. Quiet sounds are soft, and you have to listen closely.",
  bins: [
    { id: "loud", label: "loud", emoji: "📢" },
    { id: "quiet", label: "quiet", emoji: "🤫" },
  ],
  items: [
    { label: "fire truck siren", emoji: "🚒", bin: "loud" },
    { label: "drum", emoji: "🥁", bin: "loud" },
    { label: "thunder", emoji: "⛈️", bin: "loud" },
    { label: "jet plane", emoji: "✈️", bin: "loud" },
    { label: "trumpet", emoji: "🎺", bin: "loud" },
    { label: "alarm clock", emoji: "⏰", bin: "loud" },
    { label: "whisper", emoji: "💬", bin: "quiet" },
    { label: "cat purring", emoji: "🐈", bin: "quiet" },
    { label: "snow falling", emoji: "❄️", bin: "quiet" },
    { label: "turning a page", emoji: "📖", bin: "quiet" },
    { label: "ticking watch", emoji: "⌚", bin: "quiet" },
    { label: "feather falling", emoji: "🪶", bin: "quiet" },
  ],
};

const LIGHT_SOUND_BANK: Item[] = [
  {
    prompt: "Where does daylight come from?",
    right: { label: "the sun", emoji: "☀️" },
    wrong: [
      { label: "the moon", emoji: "🌙" },
      { label: "the clouds", emoji: "☁️" },
    ],
    hint: "The sun is a giant ball of light. It lights up our day.",
  },
  {
    prompt: "Which one do we use to make music?",
    right: { label: "drum", emoji: "🥁" },
    wrong: [
      { label: "sock", emoji: "🧦" },
      { label: "crayon", emoji: "🖍️" },
    ],
    hint: "When you tap a drum, it makes a sound. Boom, boom!",
  },
  {
    prompt: "Which one helps you see in the dark?",
    right: { label: "flashlight", emoji: "🔦" },
    wrong: [
      { label: "book", emoji: "📕" },
      { label: "mirror", emoji: "🪞" },
    ],
    hint: "A flashlight makes its own light, so it lights up the dark.",
  },
  {
    prompt: "What makes a shadow?",
    right: { label: "something blocks the light", emoji: "✋" },
    wrong: [
      { label: "a loud noise", emoji: "📢" },
      { label: "lots of water", emoji: "💧" },
    ],
    hint: "When something is in the way of light, it makes a dark shape called a shadow.",
  },
  {
    prompt: "Light can shine through…",
    right: { label: "a clear window", emoji: "🪟" },
    wrong: [
      { label: "a brick wall", emoji: "🧱" },
      { label: "a wooden door", emoji: "🚪" },
    ],
    hint: "Clear glass lets light pass through. Walls and doors block it.",
  },
  {
    prompt: "Which animal makes a high, squeaky sound?",
    right: { label: "mouse", emoji: "🐭" },
    wrong: [
      { label: "cow", emoji: "🐄" },
      { label: "bear", emoji: "🐻" },
    ],
    hint: "Small animals often make high sounds. Squeak, squeak!",
  },
  {
    prompt: "Which animal makes a low, deep sound?",
    right: { label: "cow", emoji: "🐄" },
    wrong: [
      { label: "mouse", emoji: "🐭" },
      { label: "little bird", emoji: "🐦" },
    ],
    hint: "A cow's moo is low and deep. Little animals often make high sounds.",
  },
  {
    prompt: "How can you make a drum sound louder?",
    right: { label: "hit it harder", emoji: "💪" },
    wrong: [
      { label: "hit it softly", emoji: "🤏" },
      { label: "don't touch it", emoji: "🚫" },
    ],
    hint: "A bigger hit makes a bigger, louder sound.",
    emoji: "🥁",
  },
  {
    prompt: "Which one wakes you up with a sound?",
    right: { label: "alarm clock", emoji: "⏰" },
    wrong: [
      { label: "lamp", emoji: "💡" },
      { label: "mirror", emoji: "🪞" },
    ],
    hint: "An alarm clock rings loudly to wake you up.",
  },
  {
    prompt: "Which one uses light to tell cars to stop?",
    right: { label: "traffic light", emoji: "🚦" },
    wrong: [
      { label: "drum", emoji: "🥁" },
      { label: "bell", emoji: "🔔" },
    ],
    hint: "A traffic light shines red for stop and green for go.",
  },
  {
    prompt: "Does the moon make its own light?",
    right: { label: "No, sunlight bounces off it", emoji: "☀️" },
    wrong: [{ label: "Yes, it glows by itself", emoji: "✨" }],
    hint: "The moon has no light of its own. It shines because sunlight bounces off it.",
    emoji: "🌕",
    hard: true,
  },
  {
    prompt: "A guitar string makes sound when it…",
    right: { label: "shakes fast (vibrates)", emoji: "〰️" },
    wrong: [
      { label: "gets wet", emoji: "💧" },
      { label: "gets cold", emoji: "❄️" },
    ],
    hint: "Sounds are made when things shake back and forth very fast. That's called vibrating.",
    emoji: "🎸",
    hard: true,
  },
  {
    prompt: "What does a mirror do with light?",
    right: { label: "bounces it back", emoji: "🪞" },
    wrong: [
      { label: "makes new light", emoji: "✨" },
      { label: "turns it into sound", emoji: "🔊" },
    ],
    hint: "A mirror doesn't make light. It bounces light back so you can see yourself.",
    hard: true,
  },
  {
    prompt: "Move your hand closer to a lamp. What happens to its shadow?",
    right: { label: "it gets bigger", emoji: "⬆️" },
    wrong: [
      { label: "it gets smaller", emoji: "⬇️" },
      { label: "it turns blue", emoji: "🔵" },
    ],
    hint: "The closer your hand is to the light, the more light it blocks, so the shadow grows.",
    emoji: "💡",
    hard: true,
  },
  {
    prompt: "Which light is natural (not made by people)?",
    right: { label: "the sun", emoji: "☀️" },
    wrong: [
      { label: "a lamp", emoji: "💡" },
      { label: "a flashlight", emoji: "🔦" },
    ],
    hint: "People make lamps and flashlights. The sun is part of nature.",
    hard: true,
  },
  {
    prompt: "What do we need to see colours?",
    right: { label: "light", emoji: "💡" },
    wrong: [
      { label: "sound", emoji: "🔊" },
      { label: "wind", emoji: "🌬️" },
    ],
    hint: "In a totally dark room you can't see any colours. We need light to see.",
    emoji: "🌈",
    hard: true,
  },
];

function lightAndSound({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return shuffle([
    sortQuestion(LIGHT_SORT, perBin(difficulty)),
    sortQuestion(SOUND_SORT, perBin(difficulty)),
    ...levelled(LIGHT_SOUND_BANK, 6, difficulty),
  ]);
}

// ---------- Sky & Seasons ----------

const SEASONS_ORDER: OrderQuestion = {
  kind: "order",
  prompt: "Put the seasons in order. Start with spring.",
  hint: "Spring, summer, fall, winter… and then spring comes again!",
  items: [
    { id: "spring", label: "spring", emoji: "🌷" },
    { id: "summer", label: "summer", emoji: "☀️" },
    { id: "fall", label: "fall", emoji: "🍂" },
    { id: "winter", label: "winter", emoji: "❄️" },
  ],
};

const DAY_ORDER: OrderQuestion = {
  kind: "order",
  prompt: "Put the day in order. Start with morning.",
  hint: "The sun comes up in the morning, is high at midday, goes down in the evening, and then it's night.",
  items: [
    { id: "morning", label: "morning: the sun comes up", emoji: "🌅" },
    { id: "midday", label: "midday: the sun is high", emoji: "☀️" },
    { id: "evening", label: "evening: the sun goes down", emoji: "🌇" },
    { id: "night", label: "night: the sky is dark", emoji: "🌃" },
  ],
};

const MOON_ORDER: OrderQuestion = {
  kind: "order",
  prompt: "Put the moon in order, from dark to full.",
  hint: "Each night we see a little more of the moon's sunny side, until it's a full circle.",
  items: [
    { id: "new", label: "new moon", emoji: "🌑" },
    { id: "crescent", label: "thin crescent", emoji: "🌒" },
    { id: "half", label: "half moon", emoji: "🌓" },
    { id: "almost", label: "almost full", emoji: "🌔" },
    { id: "full", label: "full moon", emoji: "🌕" },
  ],
};

const SEASON_SORT: SortSet = {
  prompt: "Winter or summer? Tap an item, then tap its basket.",
  hint: "Think about the weather. Is it a cold winter day or a hot summer day?",
  bins: [
    { id: "winter", label: "winter", emoji: "❄️" },
    { id: "summer", label: "summer", emoji: "☀️" },
  ],
  items: [
    { label: "snowman", emoji: "⛄", bin: "winter" },
    { label: "mittens", emoji: "🧤", bin: "winter" },
    { label: "sledding", emoji: "🛷", bin: "winter" },
    { label: "skating on a pond", emoji: "⛸️", bin: "winter" },
    { label: "warm scarf", emoji: "🧣", bin: "winter" },
    { label: "swimming outside", emoji: "🏊", bin: "summer" },
    { label: "sunglasses", emoji: "🕶️", bin: "summer" },
    { label: "shorts", emoji: "🩳", bin: "summer" },
    { label: "watermelon picnic", emoji: "🍉", bin: "summer" },
    { label: "sun hat", emoji: "👒", bin: "summer" },
  ],
};

const SKY_BANK: Item[] = [
  {
    prompt: "When do we usually see the sun in the sky?",
    right: { label: "in the daytime", emoji: "☀️" },
    wrong: [{ label: "in the middle of the night", emoji: "🌃" }],
    hint: "The sun lights up the sky in the daytime. At night our side of Earth faces away from it.",
  },
  {
    prompt: "When can we see lots of stars?",
    right: { label: "on a clear, dark night", emoji: "🌃" },
    wrong: [
      { label: "at lunchtime", emoji: "🥪" },
      { label: "on a sunny morning", emoji: "🌅" },
    ],
    hint: "Stars are always there, but the sun is so bright that we only see them at night.",
  },
  {
    prompt: "Which season comes after winter?",
    right: { label: "spring", emoji: "🌷" },
    wrong: [
      { label: "summer", emoji: "☀️" },
      { label: "fall", emoji: "🍂" },
    ],
    hint: "Winter, then spring! Snow melts and plants start to grow.",
  },
  {
    prompt: "In which season do many leaves change colour and fall?",
    right: { label: "fall", emoji: "🍂" },
    wrong: [
      { label: "spring", emoji: "🌷" },
      { label: "summer", emoji: "☀️" },
    ],
    hint: "That's why we call it fall! It's also called autumn.",
  },
  {
    prompt: "Which season is often the coldest?",
    right: { label: "winter", emoji: "❄️" },
    wrong: [
      { label: "summer", emoji: "☀️" },
      { label: "spring", emoji: "🌷" },
    ],
    hint: "Winter is the coldest season. In many places it snows!",
  },
  {
    prompt: "In which season do many flowers start to grow?",
    right: { label: "spring", emoji: "🌷" },
    wrong: [
      { label: "winter", emoji: "❄️" },
      { label: "fall", emoji: "🍂" },
    ],
    hint: "In spring the days get warmer, and plants start to grow again.",
  },
  {
    prompt: "When does the sun go down?",
    right: { label: "in the evening", emoji: "🌇" },
    wrong: [
      { label: "at breakfast", emoji: "🥣" },
      { label: "at lunch", emoji: "🥪" },
    ],
    hint: "The sun comes up in the morning and goes down in the evening.",
  },
  {
    prompt: "What do you wear to play outside on a snowy day?",
    right: { label: "warm coat and mittens", emoji: "🧤" },
    wrong: [
      { label: "swimsuit", emoji: "🩱" },
      { label: "sandals", emoji: "👡" },
    ],
    hint: "Snow is cold! Warm clothes keep you cozy.",
    emoji: "⛄",
  },
  {
    prompt: "Why does the moon look bright at night?",
    right: { label: "sunlight shines on it", emoji: "☀️" },
    wrong: [
      { label: "it is on fire", emoji: "🔥" },
      { label: "it has light bulbs", emoji: "💡" },
    ],
    hint: "The moon doesn't make light. Sunlight bounces off it, so it looks bright.",
    emoji: "🌕",
    hard: true,
  },
  {
    prompt: "Is the sun a star?",
    right: { label: "Yes, it's the closest star", emoji: "☀️" },
    wrong: [
      { label: "No, it's a planet", emoji: "🪐" },
      { label: "No, it's a moon", emoji: "🌙" },
    ],
    hint: "The sun is a star! It looks big and bright because it's the star closest to Earth.",
    hard: true,
  },
  {
    prompt: "Why do we have day and night?",
    right: { label: "Earth spins around", emoji: "🌍" },
    wrong: [
      { label: "the sun turns off", emoji: "💡" },
      { label: "clouds hide the sun", emoji: "☁️" },
    ],
    hint: "Earth spins. When our side faces the sun it's day. When it turns away, it's night.",
    hard: true,
  },
  {
    prompt: "What do we call a round, bright moon?",
    right: { label: "full moon", emoji: "🌕" },
    wrong: [
      { label: "new moon", emoji: "🌑" },
      { label: "half moon", emoji: "🌓" },
    ],
    hint: "When we can see the whole round moon, it's called a full moon.",
    hard: true,
  },
  {
    prompt: "Which season comes after fall?",
    right: { label: "winter", emoji: "❄️" },
    wrong: [
      { label: "spring", emoji: "🌷" },
      { label: "summer", emoji: "☀️" },
    ],
    hint: "Spring, summer, fall, winter. After fall comes winter!",
    hard: true,
  },
  {
    prompt: "In summer, the days are…",
    right: { label: "long, with lots of daylight", emoji: "☀️" },
    wrong: [{ label: "short and dark", emoji: "🌑" }],
    hint: "In summer the sun comes up early and goes down late, so days are long.",
    hard: true,
  },
  {
    prompt: "Which animal is usually awake at night?",
    right: { label: "owl", emoji: "🦉" },
    wrong: [
      { label: "butterfly", emoji: "🦋" },
      { label: "chicken", emoji: "🐔" },
    ],
    hint: "Many owls sleep in the day and hunt at night.",
    emoji: "🌙",
    hard: true,
  },
  {
    prompt: "Does the moon always look the same shape?",
    right: { label: "No, its shape seems to change", emoji: "🌓" },
    wrong: [{ label: "Yes, it is always round", emoji: "🌕" }],
    hint: "Over about a month, we see more and then less of the moon's sunny side.",
    hard: true,
  },
];

function skyAndSeasons({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const orders = difficulty === 3 ? [SEASONS_ORDER, DAY_ORDER, MOON_ORDER] : [SEASONS_ORDER, DAY_ORDER];
  return [
    pick(orders),
    ...shuffle([sortQuestion(SEASON_SORT, perBin(difficulty)), ...levelled(SKY_BANK, 6, difficulty)]),
  ];
}

export const course: Course = {
  grade: "1",
  subject: "science",
  bigIdeas: {
    "ca-bc": [
      "Living things have features and behaviours that help them survive in their environment.",
      "Matter is useful because of its properties.",
      "Light and sound can be produced and their properties can be changed.",
      "Observable patterns and cycles occur in the local sky and landscape.",
    ],
  },
  units: [
    {
      id: "living-things",
      title: "Living Things",
      emoji: "🌱",
      blurb: "Living or not? Plant or animal?",
      standards: { "ca-bc": "Classification of living and non-living things; names of local plants and animals" },
      parentNote:
        "Sorting living and non-living things, telling plants from animals, and what living things need to grow.",
      generate: livingThings,
    },
    {
      id: "animal-survival",
      title: "Animal Survival",
      emoji: "🐻",
      blurb: "How animals stay safe and warm",
      standards: {
        "ca-bc":
          "Structural features of living things in the local environment; behavioural adaptations of animals in the local environment",
      },
      parentNote:
        "Body features (thick fur, webbed feet, shells, camouflage) and behaviours (hibernating, migrating, storing food) that help animals survive.",
      generate: animalSurvival,
    },
    {
      id: "materials",
      title: "Materials",
      emoji: "🧱",
      blurb: "What is it made of?",
      standards: { "ca-bc": "Properties of materials" },
      parentNote:
        "Describing materials (hard, soft, see-through, waterproof) and choosing the best material for a job, like a raincoat or a window.",
      generate: materials,
    },
    {
      id: "light-and-sound",
      title: "Light & Sound",
      emoji: "💡",
      blurb: "Bright, dark, loud and quiet",
      standards: { "ca-bc": "Light and sound can be produced; sources of light and sound; properties of light and sound" },
      parentNote:
        "Sources of light and sound, loud and quiet, high and low sounds, shadows, and how light passes through glass but not walls.",
      generate: lightAndSound,
    },
    {
      id: "sky-and-seasons",
      title: "Sky & Seasons",
      emoji: "🌤️",
      blurb: "Day, night and the seasons",
      standards: {
        "ca-bc":
          "Local patterns and cycles in the sky (day and night, the sun, the moon, the stars) and landscape (seasons)",
      },
      parentNote:
        "Day and night, the sun, moon and stars (the moon reflects sunlight), and the order of the seasons.",
      generate: skyAndSeasons,
    },
  ],
};
