import { shuffle } from "../../random";
import type { Course, GenerateOptions, OrderQuestion, Question } from "../../types";
import { fromBank, sortQuestion, type BankItem, type SortSet } from "../../bank";

// Kindergarten science: short prompts, 3 picture choices, small sorts.

type Level = NonNullable<GenerateOptions["difficulty"]>;

/** Mix easy and stretch bank items by difficulty (1: all easy, 3: mostly stretch). */
function leveled(easy: BankItem[], hard: BankItem[], count: number, difficulty: Level = 2): Question[] {
  const hardCount = difficulty === 1 ? 0 : difficulty === 2 ? 2 : 4;
  return [...fromBank(easy, count - hardCount), ...fromBank(hard, hardCount)];
}

/** Smaller sorts for easier play. */
function sortFor(set: SortSet, difficulty: Level = 2) {
  return sortQuestion(set, difficulty === 1 ? 2 : 3);
}

// ---------- What Living Things Need ----------

const LIVING_SORT: SortSet = {
  prompt: "Living or not living? Tap a picture, then its basket.",
  hint: "Living things grow and need water and air. Toys and spoons don't!",
  bins: [
    { id: "living", label: "living", emoji: "🌱" },
    { id: "not", label: "not living", emoji: "🪨" },
  ],
  items: [
    { label: "dog", emoji: "🐕", bin: "living" },
    { label: "tree", emoji: "🌳", bin: "living" },
    { label: "fish", emoji: "🐟", bin: "living" },
    { label: "sunflower", emoji: "🌻", bin: "living" },
    { label: "ladybug", emoji: "🐞", bin: "living" },
    { label: "bird", emoji: "🐦", bin: "living" },
    { label: "teddy bear", emoji: "🧸", bin: "not" },
    { label: "ball", emoji: "⚽", bin: "not" },
    { label: "toy car", emoji: "🚗", bin: "not" },
    { label: "spoon", emoji: "🥄", bin: "not" },
    { label: "chair", emoji: "🪑", bin: "not" },
    { label: "shoe", emoji: "👟", bin: "not" },
  ],
};

const NEEDS_EASY: BankItem[] = [
  {
    prompt: "What does a plant need to grow?",
    right: { label: "water", emoji: "💧" },
    wrong: [
      { label: "candy", emoji: "🍬" },
      { label: "a toy", emoji: "🧸" },
    ],
    hint: "Plants need water, sunlight and air to grow.",
    emoji: "🌱",
  },
  {
    prompt: "Plants need light. What gives plants light outside?",
    right: { label: "the sun", emoji: "☀️" },
    wrong: [
      { label: "a rock", emoji: "🪨" },
      { label: "the wind", emoji: "🌬️" },
    ],
    hint: "The sun shines on plants and helps them grow.",
    emoji: "🌻",
  },
  {
    prompt: "What do animals need to live?",
    right: { label: "food and water", emoji: "🍎" },
    wrong: [
      { label: "toys", emoji: "🧸" },
      { label: "a TV", emoji: "📺" },
    ],
    hint: "All animals need food, water and air to live.",
    emoji: "🐇",
  },
  {
    prompt: "What do we breathe in to stay alive?",
    right: { label: "air", emoji: "🌬️" },
    wrong: [
      { label: "juice", emoji: "🧃" },
      { label: "sand", emoji: "🏖️" },
    ],
    hint: "Take a big breath. You are breathing in air!",
  },
  {
    prompt: "Which one is living?",
    right: { label: "a tree", emoji: "🌳" },
    wrong: [
      { label: "a rock", emoji: "🪨" },
      { label: "a teddy bear", emoji: "🧸" },
    ],
    hint: "Living things grow and change. A tree grows taller every year!",
  },
  {
    prompt: "Which one is NOT living?",
    speak: "Which one is not living?",
    right: { label: "a ball", emoji: "⚽" },
    wrong: [
      { label: "a cat", emoji: "🐈" },
      { label: "a flower", emoji: "🌷" },
    ],
    hint: "A ball does not eat, drink or grow. It is not living.",
  },
  {
    prompt: "A dog is thirsty. What does it need?",
    right: { label: "water", emoji: "💧" },
    wrong: [
      { label: "a ball", emoji: "⚽" },
      { label: "a bed", emoji: "🛏️" },
    ],
    hint: "When we are thirsty, we need a drink of water. Dogs do too!",
    emoji: "🐕",
  },
  {
    prompt: "Where does a fish live?",
    right: { label: "in water", emoji: "🌊" },
    wrong: [
      { label: "in a tree", emoji: "🌳" },
      { label: "in the desert", emoji: "🏜️" },
    ],
    hint: "Fish live in water. They need water to breathe.",
    emoji: "🐟",
  },
];

const NEEDS_HARD: BankItem[] = [
  {
    prompt: "A plant is kept in a dark closet. What will happen?",
    right: { label: "It won't grow well", emoji: "🥀" },
    wrong: [
      { label: "It will grow faster", emoji: "⬆️" },
      { label: "Nothing will change", emoji: "😐" },
    ],
    hint: "Plants need sunlight to grow. Without light, they get weak.",
    emoji: "🪴",
  },
  {
    prompt: "Animals need shelter. What is shelter?",
    right: { label: "a safe place to rest", emoji: "🏠" },
    wrong: [
      { label: "a kind of food", emoji: "🍎" },
      { label: "a toy", emoji: "🧸" },
    ],
    hint: "Shelter keeps animals safe, dry and warm, like a den or a nest.",
  },
  {
    prompt: "Where can a bird make a safe home?",
    right: { label: "in a tree", emoji: "🌳" },
    wrong: [
      { label: "in a lake", emoji: "🌊" },
      { label: "on a busy road", emoji: "🛣️" },
    ],
    hint: "Many birds build nests in trees to keep their eggs safe.",
    emoji: "🐦",
  },
  {
    prompt: "What do roots take in for the plant?",
    right: { label: "water", emoji: "💧" },
    wrong: [
      { label: "sunlight", emoji: "☀️" },
      { label: "toys", emoji: "🧸" },
    ],
    hint: "Roots grow in the soil and drink up water for the plant.",
    emoji: "🌱",
  },
  {
    prompt: "Which one needs food, water and air?",
    right: { label: "a rabbit", emoji: "🐇" },
    wrong: [
      { label: "a rock", emoji: "🪨" },
      { label: "a bike", emoji: "🚲" },
    ],
    hint: "A rabbit is living, so it needs food, water and air.",
  },
  {
    prompt: "What do a dog, a tree and you all need?",
    right: { label: "water", emoji: "💧" },
    wrong: [
      { label: "shoes", emoji: "👟" },
      { label: "books", emoji: "📚" },
    ],
    hint: "All living things need water.",
  },
];

function livingNeeds({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return shuffle([sortFor(LIVING_SORT, difficulty), ...leveled(NEEDS_EASY, NEEDS_HARD, 7, difficulty)]);
}

// ---------- Animal Features ----------

const COAT_SORT: SortSet = {
  prompt: "Fur or feathers? Tap an animal, then its basket.",
  hint: "Birds have feathers. Animals like bears and cats have fur.",
  bins: [
    { id: "fur", label: "fur", emoji: "🐾" },
    { id: "feathers", label: "feathers", emoji: "🪶" },
  ],
  items: [
    { label: "bear", emoji: "🐻", bin: "fur" },
    { label: "rabbit", emoji: "🐇", bin: "fur" },
    { label: "fox", emoji: "🦊", bin: "fur" },
    { label: "cat", emoji: "🐈", bin: "fur" },
    { label: "squirrel", emoji: "🐿️", bin: "fur" },
    { label: "duck", emoji: "🦆", bin: "feathers" },
    { label: "owl", emoji: "🦉", bin: "feathers" },
    { label: "chicken", emoji: "🐔", bin: "feathers" },
    { label: "eagle", emoji: "🦅", bin: "feathers" },
    { label: "penguin", emoji: "🐧", bin: "feathers" },
  ],
};

const FEATURES_EASY: BankItem[] = [
  {
    prompt: "Which animal has feathers?",
    right: { label: "bird", emoji: "🐦" },
    wrong: [
      { label: "fish", emoji: "🐟" },
      { label: "dog", emoji: "🐕" },
    ],
    hint: "Birds are the only animals with feathers.",
  },
  {
    prompt: "Which animal has fins?",
    right: { label: "fish", emoji: "🐟" },
    wrong: [
      { label: "cow", emoji: "🐄" },
      { label: "bird", emoji: "🐦" },
    ],
    hint: "Fish use their fins to swim through the water.",
  },
  {
    prompt: "Which animal has a shell?",
    right: { label: "turtle", emoji: "🐢" },
    wrong: [
      { label: "rabbit", emoji: "🐇" },
      { label: "frog", emoji: "🐸" },
    ],
    hint: "A turtle carries a hard shell on its back.",
  },
  {
    prompt: "Which animal has fur?",
    right: { label: "bear", emoji: "🐻" },
    wrong: [
      { label: "fish", emoji: "🐟" },
      { label: "frog", emoji: "🐸" },
    ],
    hint: "Fur is soft, thick hair. It keeps animals warm.",
  },
  {
    prompt: "Which animal has wings?",
    right: { label: "butterfly", emoji: "🦋" },
    wrong: [
      { label: "snake", emoji: "🐍" },
      { label: "turtle", emoji: "🐢" },
    ],
    hint: "A butterfly flaps its wings to fly from flower to flower.",
  },
  {
    prompt: "Which animal has a long trunk?",
    right: { label: "elephant", emoji: "🐘" },
    wrong: [
      { label: "pig", emoji: "🐖" },
      { label: "horse", emoji: "🐎" },
    ],
    hint: "An elephant uses its long trunk like a nose and a hand!",
  },
  {
    prompt: "Which animal has a very long neck?",
    right: { label: "giraffe", emoji: "🦒" },
    wrong: [
      { label: "pig", emoji: "🐖" },
      { label: "rabbit", emoji: "🐇" },
    ],
    hint: "A giraffe's long neck helps it reach leaves high in the trees.",
  },
  {
    prompt: "Which animal has no legs?",
    right: { label: "snake", emoji: "🐍" },
    wrong: [
      { label: "dog", emoji: "🐕" },
      { label: "duck", emoji: "🦆" },
    ],
    hint: "A snake has no legs. It slides along on its belly!",
  },
  {
    prompt: "Which animal has a beak?",
    right: { label: "duck", emoji: "🦆" },
    wrong: [
      { label: "cow", emoji: "🐄" },
      { label: "cat", emoji: "🐈" },
    ],
    hint: "Birds, like ducks, have a beak instead of lips and teeth.",
  },
];

const FEATURES_HARD: BankItem[] = [
  {
    prompt: "How does a bear's thick fur help it?",
    right: { label: "It keeps the bear warm", emoji: "🧣" },
    wrong: [
      { label: "It helps the bear fly", emoji: "✈️" },
      { label: "It helps the bear see", emoji: "👀" },
    ],
    hint: "Thick fur is like a warm coat for an animal.",
    emoji: "🐻",
  },
  {
    prompt: "An owl has big eyes. What do they help it do?",
    right: { label: "see at night", emoji: "🌙" },
    wrong: [
      { label: "swim", emoji: "🌊" },
      { label: "dig", emoji: "⛏️" },
    ],
    hint: "Big eyes let in lots of light, so owls can see in the dark.",
    emoji: "🦉",
  },
  {
    prompt: "A duck's webbed feet help it…",
    speak: "A duck's webbed feet help it do what?",
    right: { label: "swim", emoji: "🏊" },
    wrong: [
      { label: "climb trees", emoji: "🌳" },
      { label: "dig holes", emoji: "🕳️" },
    ],
    hint: "Webbed feet work like paddles to push the water.",
    emoji: "🦆",
  },
  {
    prompt: "A turtle's hard shell helps it…",
    speak: "A turtle's hard shell helps it do what?",
    right: { label: "stay safe", emoji: "🛡️" },
    wrong: [
      { label: "fly", emoji: "☁️" },
      { label: "run fast", emoji: "💨" },
    ],
    hint: "A turtle can pull into its hard shell to stay safe.",
    emoji: "🐢",
  },
  {
    prompt: "A rabbit's long ears help it…",
    speak: "A rabbit's long ears help it do what?",
    right: { label: "hear well", emoji: "👂" },
    wrong: [
      { label: "swim", emoji: "🌊" },
      { label: "fly", emoji: "☁️" },
    ],
    hint: "Long ears catch sounds, so a rabbit can hear danger coming.",
    emoji: "🐇",
  },
  {
    prompt: "A beaver's big front teeth help it…",
    speak: "A beaver's big front teeth help it do what?",
    right: { label: "chew wood", emoji: "🪵" },
    wrong: [
      { label: "see at night", emoji: "🌙" },
      { label: "fly", emoji: "☁️" },
    ],
    hint: "Beavers chew on trees and use the wood to build their homes.",
    emoji: "🦫",
  },
  {
    prompt: "Which part of a plant grows under the ground?",
    right: { label: "roots", emoji: "🥕" },
    wrong: [
      { label: "flower", emoji: "🌸" },
      { label: "leaf", emoji: "🍃" },
    ],
    hint: "Roots grow under the ground. A carrot is a root we can eat!",
    emoji: "🌱",
  },
  {
    prompt: "Which tree has needles instead of flat leaves?",
    right: { label: "pine tree", emoji: "🌲" },
    wrong: [
      { label: "maple tree", emoji: "🍁" },
      { label: "palm tree", emoji: "🌴" },
    ],
    hint: "Pine trees have thin, pointy needles that stay green all year.",
  },
];

function animalFeatures({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return shuffle([sortFor(COAT_SORT, difficulty), ...leveled(FEATURES_EASY, FEATURES_HARD, 7, difficulty)]);
}

// ---------- Materials ----------

const SOFT_SORT: SortSet = {
  prompt: "Soft or hard? Tap a picture, then its basket.",
  hint: "Squeeze it in your mind. Soft things squish. Hard things don't!",
  bins: [
    { id: "soft", label: "soft", emoji: "🧸" },
    { id: "hard", label: "hard", emoji: "🪨" },
  ],
  items: [
    { label: "feather", emoji: "🪶", bin: "soft" },
    { label: "sponge", emoji: "🧽", bin: "soft" },
    { label: "yarn", emoji: "🧶", bin: "soft" },
    { label: "socks", emoji: "🧦", bin: "soft" },
    { label: "scarf", emoji: "🧣", bin: "soft" },
    { label: "brick", emoji: "🧱", bin: "hard" },
    { label: "key", emoji: "🔑", bin: "hard" },
    { label: "hammer", emoji: "🔨", bin: "hard" },
    { label: "log", emoji: "🪵", bin: "hard" },
    { label: "coin", emoji: "🪙", bin: "hard" },
  ],
};

const MATERIALS_EASY: BankItem[] = [
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
    prompt: "Which one is hard?",
    right: { label: "rock", emoji: "🪨" },
    wrong: [
      { label: "sock", emoji: "🧦" },
      { label: "feather", emoji: "🪶" },
    ],
    hint: "Hard things don't squish when you press on them.",
  },
  {
    prompt: "Which one is made of wood?",
    right: { label: "log", emoji: "🪵" },
    wrong: [
      { label: "key", emoji: "🔑" },
      { label: "window", emoji: "🪟" },
    ],
    hint: "Wood comes from trees. A log is part of a tree.",
  },
  {
    prompt: "Which one is made of metal?",
    right: { label: "key", emoji: "🔑" },
    wrong: [
      { label: "T-shirt", emoji: "👕" },
      { label: "book", emoji: "📕" },
    ],
    hint: "Metal is hard and shiny. Keys are made of metal.",
  },
  {
    prompt: "Which one is made of glass?",
    right: { label: "window", emoji: "🪟" },
    wrong: [
      { label: "sock", emoji: "🧦" },
      { label: "log", emoji: "🪵" },
    ],
    hint: "Glass is hard, and you can see through it.",
  },
  {
    prompt: "Which one is made of cloth?",
    right: { label: "T-shirt", emoji: "👕" },
    wrong: [
      { label: "rock", emoji: "🪨" },
      { label: "key", emoji: "🔑" },
    ],
    hint: "Cloth is soft and bendy. Our clothes are made of cloth.",
  },
  {
    prompt: "Which one is made of paper?",
    right: { label: "book", emoji: "📕" },
    wrong: [
      { label: "brick", emoji: "🧱" },
      { label: "key", emoji: "🔑" },
    ],
    hint: "The pages of a book are made of paper.",
  },
  {
    prompt: "Which one can you see through?",
    right: { label: "window", emoji: "🪟" },
    wrong: [
      { label: "brick wall", emoji: "🧱" },
      { label: "log", emoji: "🪵" },
    ],
    hint: "Windows are made of clear glass, so light comes through.",
  },
];

const MATERIALS_HARD: BankItem[] = [
  {
    prompt: "Which one feels rough and bumpy?",
    right: { label: "pineapple", emoji: "🍍" },
    wrong: [
      { label: "balloon", emoji: "🎈" },
      { label: "egg", emoji: "🥚" },
    ],
    hint: "Rough things feel bumpy. Smooth things feel even and slippery.",
  },
  {
    prompt: "Which one feels smooth?",
    right: { label: "egg", emoji: "🥚" },
    wrong: [
      { label: "pineapple", emoji: "🍍" },
      { label: "tree bark", emoji: "🪵" },
    ],
    hint: "Smooth things have no bumps. Run your finger over an egg!",
  },
  {
    prompt: "Which one bends easily?",
    right: { label: "paper", emoji: "📄" },
    wrong: [
      { label: "brick", emoji: "🧱" },
      { label: "rock", emoji: "🪨" },
    ],
    hint: "Bendy things change shape when you bend them. Bricks and rocks stay stiff.",
  },
  {
    prompt: "Which would make the best raincoat?",
    right: { label: "plastic", emoji: "🧴" },
    wrong: [
      { label: "paper", emoji: "📄" },
      { label: "yarn", emoji: "🧶" },
    ],
    hint: "Plastic keeps water out. Paper and yarn get soggy!",
    emoji: "🌧️",
  },
  {
    prompt: "Which one will float on water?",
    right: { label: "leaf", emoji: "🍃" },
    wrong: [
      { label: "rock", emoji: "🪨" },
      { label: "key", emoji: "🔑" },
    ],
    hint: "A leaf stays on top of the water. Rocks and keys sink to the bottom.",
    emoji: "🌊",
  },
  {
    prompt: "Which one will sink in water?",
    right: { label: "rock", emoji: "🪨" },
    wrong: [
      { label: "rubber duck", emoji: "🦆" },
      { label: "leaf", emoji: "🍃" },
    ],
    hint: "A rock sinks to the bottom. Rubber ducks and leaves float.",
    emoji: "🌊",
  },
  {
    prompt: "Which is best for building a strong house?",
    right: { label: "bricks", emoji: "🧱" },
    wrong: [
      { label: "paper", emoji: "📄" },
      { label: "feathers", emoji: "🪶" },
    ],
    hint: "Bricks are hard and strong. Paper and feathers are too soft.",
  },
  {
    prompt: "Which material comes from trees?",
    right: { label: "wood", emoji: "🪵" },
    wrong: [
      { label: "glass", emoji: "🪟" },
      { label: "metal", emoji: "🔩" },
    ],
    hint: "Wood comes from the trunks and branches of trees.",
    emoji: "🌳",
  },
];

function materials({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return shuffle([sortFor(SOFT_SORT, difficulty), ...leveled(MATERIALS_EASY, MATERIALS_HARD, 7, difficulty)]);
}

// ---------- Push & Pull ----------

const PUSH_SORT: SortSet = {
  prompt: "Push or pull? Tap a picture, then its basket.",
  hint: "A push moves something away from you. A pull moves it toward you.",
  bins: [
    { id: "push", label: "push", emoji: "👐" },
    { id: "pull", label: "pull", emoji: "🪢" },
  ],
  items: [
    { label: "kick a ball", emoji: "⚽", bin: "push" },
    { label: "push a cart", emoji: "🛒", bin: "push" },
    { label: "tap a bell", emoji: "🛎️", bin: "push" },
    { label: "push a toy car", emoji: "🚗", bin: "push" },
    { label: "roll a bowling ball", emoji: "🎳", bin: "push" },
    { label: "pull a sled", emoji: "🛷", bin: "pull" },
    { label: "pull out a carrot", emoji: "🥕", bin: "pull" },
    { label: "pull on socks", emoji: "🧦", bin: "pull" },
    { label: "reel in a fish", emoji: "🎣", bin: "pull" },
  ],
};

const MOTION_EASY: BankItem[] = [
  {
    prompt: "You kick a ball. Is that a push or a pull?",
    right: { label: "push", emoji: "👐" },
    wrong: [{ label: "pull", emoji: "🪢" }],
    hint: "Your foot moves the ball away from you. That's a push!",
    emoji: "⚽",
  },
  {
    prompt: "You reel in a fish. Is that a push or a pull?",
    right: { label: "pull", emoji: "🪢" },
    wrong: [{ label: "push", emoji: "👐" }],
    hint: "The fish comes toward you. That's a pull!",
    emoji: "🎣",
  },
  {
    prompt: "You open a drawer toward you. Push or pull?",
    right: { label: "pull", emoji: "🪢" },
    wrong: [{ label: "push", emoji: "👐" }],
    hint: "When something comes toward you, it's a pull.",
    emoji: "🗄️",
  },
  {
    prompt: "Which push will make the ball go farther?",
    right: { label: "a big push", emoji: "💪" },
    wrong: [{ label: "a tiny push", emoji: "🤏" }],
    hint: "A bigger push makes things go faster and farther.",
    emoji: "⚽",
  },
  {
    prompt: "Which one will roll?",
    right: { label: "ball", emoji: "⚽" },
    wrong: [
      { label: "box", emoji: "📦" },
      { label: "book", emoji: "📕" },
    ],
    hint: "Round things roll. Things with flat sides slide or stop.",
  },
  {
    prompt: "Which is easier to push?",
    right: { label: "a toy car", emoji: "🚗" },
    wrong: [{ label: "a big truck", emoji: "🚚" }],
    hint: "Light things are easy to move. Heavy things need a bigger push.",
  },
  {
    prompt: "How can you stop a rolling toy car?",
    right: { label: "put your hand in front", emoji: "✋" },
    wrong: [
      { label: "clap your hands", emoji: "👏" },
      { label: "look at it", emoji: "👀" },
    ],
    hint: "Your hand pushes on the car and makes it stop.",
    emoji: "🚗",
  },
  {
    prompt: "A ball rolls on a hill. Which way does it go?",
    right: { label: "down", emoji: "⬇️" },
    wrong: [{ label: "up", emoji: "⬆️" }],
    hint: "Balls roll down hills. They don't roll up by themselves!",
    emoji: "⛰️",
  },
];

const MOTION_HARD: BankItem[] = [
  {
    prompt: "Which one will slide, not roll?",
    right: { label: "box", emoji: "📦" },
    wrong: [
      { label: "ball", emoji: "⚽" },
      { label: "orange", emoji: "🍊" },
    ],
    hint: "A box has flat sides, so it slides. Round things roll.",
  },
  {
    prompt: "Where will a toy car roll the farthest?",
    right: { label: "on a smooth floor", emoji: "🟫" },
    wrong: [
      { label: "on bumpy grass", emoji: "🌿" },
      { label: "in sand", emoji: "🏖️" },
    ],
    hint: "Smooth floors let wheels roll far. Bumpy grass and sand slow them down.",
    emoji: "🚗",
  },
  {
    prompt: "A rolling ball hits a wall. What happens?",
    right: { label: "It stops or bounces back", emoji: "↩️" },
    wrong: [
      { label: "It goes through the wall", emoji: "🧱" },
      { label: "It rolls faster", emoji: "⏩" },
    ],
    hint: "The wall pushes back on the ball and changes how it moves.",
    emoji: "⚽",
  },
  {
    prompt: "How can you make a swing go higher?",
    right: { label: "push harder", emoji: "💪" },
    wrong: [
      { label: "push softer", emoji: "🤏" },
      { label: "stop pushing", emoji: "✋" },
    ],
    hint: "A bigger push makes things move faster and farther.",
  },
  {
    prompt: "Which is the hardest to push?",
    right: { label: "a big rock", emoji: "🪨" },
    wrong: [
      { label: "a ball", emoji: "⚽" },
      { label: "a feather", emoji: "🪶" },
    ],
    hint: "Heavy things need a really big push to move.",
  },
  {
    prompt: "Which one moves when you blow on it?",
    right: { label: "a feather", emoji: "🪶" },
    wrong: [
      { label: "a brick", emoji: "🧱" },
      { label: "a rock", emoji: "🪨" },
    ],
    hint: "Blowing is a push of air! Light things move easily.",
  },
  {
    prompt: "What pushes a kite up into the sky?",
    right: { label: "the wind", emoji: "🌬️" },
    wrong: [
      { label: "the moon", emoji: "🌙" },
      { label: "a magnet", emoji: "🧲" },
    ],
    hint: "Wind pushes on the kite and lifts it up.",
    emoji: "🪁",
  },
];

function pushPull({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return shuffle([sortFor(PUSH_SORT, difficulty), ...leveled(MOTION_EASY, MOTION_HARD, 7, difficulty)]);
}

// ---------- Weather & Seasons ----------

const SEASONS: OrderQuestion = {
  kind: "order",
  prompt: "Put the seasons in order. Start with spring.",
  hint: "Flowers grow in spring. Next comes hot summer, then leafy fall, then cold winter.",
  items: [
    { id: "spring", label: "spring", emoji: "🌷" },
    { id: "summer", label: "summer", emoji: "☀️" },
    { id: "fall", label: "fall", emoji: "🍂" },
    { id: "winter", label: "winter", emoji: "❄️" },
  ],
};

const WEAR_SORT: SortSet = {
  prompt: "Hot day or cold day? Put each one in its basket.",
  hint: "On hot days we wear cool, light things. On cold days we bundle up!",
  bins: [
    { id: "hot", label: "hot day", emoji: "☀️" },
    { id: "cold", label: "cold day", emoji: "❄️" },
  ],
  items: [
    { label: "shorts", emoji: "🩳", bin: "hot" },
    { label: "sun hat", emoji: "👒", bin: "hot" },
    { label: "sandals", emoji: "🩴", bin: "hot" },
    { label: "swimsuit", emoji: "🩱", bin: "hot" },
    { label: "mittens", emoji: "🧤", bin: "cold" },
    { label: "scarf", emoji: "🧣", bin: "cold" },
    { label: "winter coat", emoji: "🧥", bin: "cold" },
    { label: "boots", emoji: "👢", bin: "cold" },
  ],
};

const WEATHER_EASY: BankItem[] = [
  {
    prompt: "It is raining. What can keep you dry?",
    right: { label: "umbrella", emoji: "☂️" },
    wrong: [
      { label: "sunglasses", emoji: "🕶️" },
      { label: "sandals", emoji: "🩴" },
    ],
    hint: "An umbrella keeps the rain off your head.",
    emoji: "🌧️",
  },
  {
    prompt: "It is snowy and cold. What should you wear?",
    right: { label: "mittens", emoji: "🧤" },
    wrong: [
      { label: "shorts", emoji: "🩳" },
      { label: "sandals", emoji: "🩴" },
    ],
    hint: "Mittens keep your hands warm in the cold snow.",
    emoji: "☃️",
  },
  {
    prompt: "It is hot and sunny. What should you wear?",
    right: { label: "sun hat", emoji: "👒" },
    wrong: [
      { label: "scarf", emoji: "🧣" },
      { label: "mittens", emoji: "🧤" },
    ],
    hint: "A sun hat shades your face on a hot, sunny day.",
    emoji: "☀️",
  },
  {
    prompt: "Which season is the coldest?",
    right: { label: "winter", emoji: "❄️" },
    wrong: [
      { label: "summer", emoji: "☀️" },
      { label: "spring", emoji: "🌷" },
    ],
    hint: "Winter is the coldest season. Some places get snow!",
  },
  {
    prompt: "Which season is the warmest?",
    right: { label: "summer", emoji: "☀️" },
    wrong: [
      { label: "winter", emoji: "❄️" },
      { label: "fall", emoji: "🍂" },
    ],
    hint: "Summer is the hottest season, with long sunny days.",
  },
  {
    prompt: "In which season do many leaves fall off trees?",
    right: { label: "fall", emoji: "🍂" },
    wrong: [
      { label: "summer", emoji: "☀️" },
      { label: "spring", emoji: "🌷" },
    ],
    hint: "In fall, many leaves change colour and drop off the trees.",
  },
  {
    prompt: "In which season do many flowers start to grow?",
    right: { label: "spring", emoji: "🌷" },
    wrong: [
      { label: "winter", emoji: "❄️" },
      { label: "fall", emoji: "🍂" },
    ],
    hint: "In spring the days get warmer, and new flowers pop up.",
  },
  {
    prompt: "When is the sky dark so we can see stars?",
    right: { label: "night", emoji: "🌙" },
    wrong: [
      { label: "morning", emoji: "🌅" },
      { label: "lunchtime", emoji: "🥪" },
    ],
    hint: "At night the sky is dark, and we can see the stars.",
    emoji: "⭐",
  },
  {
    prompt: "What lights up the sky in the daytime?",
    right: { label: "the sun", emoji: "☀️" },
    wrong: [
      { label: "the moon", emoji: "🌙" },
      { label: "a rainbow", emoji: "🌈" },
    ],
    hint: "The sun rises in the morning and lights up the day.",
  },
];

const WEATHER_HARD: BankItem[] = [
  {
    prompt: "What do many birds do when it gets cold?",
    right: { label: "fly to warmer places", emoji: "🐦" },
    wrong: [
      { label: "grow thick fur", emoji: "🐻" },
      { label: "dig a hole", emoji: "🕳️" },
    ],
    hint: "Many birds fly to warmer places for the winter. This is called migration.",
    emoji: "🍂",
  },
  {
    prompt: "What do squirrels do in the fall?",
    right: { label: "hide food for winter", emoji: "🌰" },
    wrong: [
      { label: "fly away", emoji: "🐦" },
      { label: "swim in the lake", emoji: "🌊" },
    ],
    hint: "Squirrels hide nuts and seeds in fall, so they have food in winter.",
    emoji: "🐿️",
  },
  {
    prompt: "What do some bears do in winter?",
    right: { label: "sleep in a den", emoji: "💤" },
    wrong: [
      { label: "fly away", emoji: "🐦" },
      { label: "go swimming", emoji: "🏊" },
    ],
    hint: "Some bears sleep in a den for most of the winter. This is called hibernation.",
    emoji: "🐻",
  },
  {
    prompt: "What happens to many trees in the fall?",
    right: { label: "Their leaves change colour", emoji: "🍁" },
    wrong: [
      { label: "They grow new green leaves", emoji: "🌱" },
      { label: "They grow taller fast", emoji: "⬆️" },
    ],
    hint: "In fall, many leaves turn red, orange or yellow, then drop.",
    emoji: "🌳",
  },
  {
    prompt: "In winter, a snowshoe hare's fur turns…",
    speak: "In winter, a snowshoe hare's fur turns what colour?",
    right: { label: "white", emoji: "⬜" },
    wrong: [
      { label: "green", emoji: "🟩" },
      { label: "orange", emoji: "🟧" },
    ],
    hint: "White fur helps the hare hide in the snow!",
    emoji: "🐇",
  },
  {
    prompt: "Many owls sleep in the day. When are they awake?",
    right: { label: "at night", emoji: "🌙" },
    wrong: [
      { label: "in the morning", emoji: "🌅" },
      { label: "at lunchtime", emoji: "🥪" },
    ],
    hint: "Many owls wake up when it gets dark. They hunt at night.",
    emoji: "🦉",
  },
  {
    prompt: "Which animal is awake at night?",
    right: { label: "bat", emoji: "🦇" },
    wrong: [
      { label: "butterfly", emoji: "🦋" },
      { label: "bee", emoji: "🐝" },
    ],
    hint: "Bats sleep in the day and fly around at night.",
  },
  {
    prompt: "In winter, the days are…",
    speak: "In winter, are the days short or long?",
    right: { label: "short, with long nights", emoji: "🌙" },
    wrong: [{ label: "long, with short nights", emoji: "☀️" }],
    hint: "In winter the sun sets early, so it gets dark before dinner.",
    emoji: "❄️",
  },
];

function weatherSeasons({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return [SEASONS, ...shuffle([sortFor(WEAR_SORT, difficulty), ...leveled(WEATHER_EASY, WEATHER_HARD, 6, difficulty)])];
}

export const course: Course = {
  grade: "k",
  subject: "science",
  bigIdeas: {
    "ca-bc": [
      "Plants and animals have observable features.",
      "Humans interact with matter every day through familiar materials.",
      "The motion of objects depends on their properties.",
      "Daily and seasonal changes affect all living things.",
    ],
  },
  units: [
    {
      id: "living-things-need",
      title: "What Living Things Need",
      emoji: "🌱",
      blurb: "Food, water, air and sunlight",
      standards: { "ca-bc": "Basic needs of plants and animals" },
      parentNote:
        "Telling living from non-living things, and what plants and animals need to live: food, water, air, shelter and sunlight.",
      generate: livingNeeds,
    },
    {
      id: "animal-features",
      title: "Animal Features",
      emoji: "🐾",
      blurb: "Fur, feathers, fins and shells",
      standards: { "ca-bc": "Observable features and adaptations of local plants and animals" },
      parentNote:
        "Noticing body parts like fur, feathers, fins and shells, and how features help animals and plants live where they do.",
      generate: animalFeatures,
    },
    {
      id: "materials",
      title: "Materials",
      emoji: "🧸",
      blurb: "Soft, hard, rough and smooth",
      standards: { "ca-bc": "Properties of familiar materials" },
      parentNote:
        "Describing everyday materials (soft or hard, rough or smooth, bendy or stiff), what sinks or floats, and naming what things are made of, like wood, metal, glass and cloth.",
      generate: materials,
    },
    {
      id: "push-and-pull",
      title: "Push & Pull",
      emoji: "🛒",
      blurb: "Make things move",
      standards: { "ca-bc": "Effects of pushes and pulls on movement; changes in motion" },
      parentNote:
        "Telling pushes from pulls, and seeing how a bigger push, an object's shape and its weight change how it moves.",
      generate: pushPull,
    },
    {
      id: "weather-and-seasons",
      title: "Weather & Seasons",
      emoji: "🌦️",
      blurb: "Weather, seasons, day and night",
      standards: {
        "ca-bc":
          "Weather changes; seasonal changes; living things make changes to accommodate daily and seasonal cycles",
      },
      parentNote:
        "Dressing for the weather, the four seasons in order, day and night, and how plants and animals change with the seasons.",
      generate: weatherSeasons,
    },
  ],
};
