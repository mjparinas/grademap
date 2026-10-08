import { shuffle } from "../../random";
import type { OrderQuestion, Question, Course } from "../../types";
import { fromBank, sortQuestion, type BankItem } from "../../bank";

// ---------- Life Cycles ----------

const BUTTERFLY: OrderQuestion = {
  kind: "order",
  prompt: "Put the butterfly's life cycle in order.",
  hint: "It starts as a tiny egg on a leaf. A caterpillar hatches, makes a chrysalis, then comes out as a butterfly.",
  items: [
    { id: "egg", label: "egg", emoji: "🥚" },
    { id: "caterpillar", label: "caterpillar", emoji: "🐛" },
    { id: "chrysalis", label: "chrysalis" },
    { id: "butterfly", label: "butterfly", emoji: "🦋" },
  ],
};

const SALMON: OrderQuestion = {
  kind: "order",
  prompt: "Put the salmon's life cycle in order.",
  hint: "Salmon start as eggs in a river. An alevin hatches, grows into a fry, then becomes an adult salmon.",
  items: [
    { id: "egg", label: "eggs in the river", emoji: "🟠" },
    { id: "alevin", label: "alevin (baby with a yolk sac)" },
    { id: "fry", label: "fry (small fish)" },
    { id: "adult", label: "adult salmon", emoji: "🐟" },
  ],
};

const FROG: OrderQuestion = {
  kind: "order",
  prompt: "Put the frog's life cycle in order.",
  hint: "Frogs start as eggs in a pond. Tadpoles hatch, grow legs, and become frogs.",
  items: [
    { id: "egg", label: "eggs in a pond", emoji: "🫧" },
    { id: "tadpole", label: "tadpole" },
    { id: "froglet", label: "tadpole with legs" },
    { id: "frog", label: "frog", emoji: "🐸" },
  ],
};

const LIFE_BANK: BankItem[] = [
  {
    prompt: "What does a caterpillar turn into?",
    right: { label: "a butterfly", emoji: "🦋" },
    wrong: [
      { label: "a bee", emoji: "🐝" },
      { label: "a bird", emoji: "🐦" },
    ],
    hint: "A caterpillar makes a chrysalis and comes out as a butterfly.",
    emoji: "🐛",
  },
  {
    prompt: "A puppy grows up to be a…",
    right: { label: "dog", emoji: "🐕" },
    wrong: [
      { label: "cat", emoji: "🐈" },
      { label: "horse", emoji: "🐎" },
    ],
    hint: "Baby animals often look like their parents. A puppy is a baby dog.",
    emoji: "🐶",
  },
  {
    prompt: "A chick grows up to be a…",
    right: { label: "chicken", emoji: "🐔" },
    wrong: [
      { label: "duck", emoji: "🦆" },
      { label: "owl", emoji: "🦉" },
    ],
    hint: "A chick hatches from a chicken's egg and grows into a chicken.",
    emoji: "🐣",
  },
  {
    prompt: "Which animal changes its body a LOT as it grows up?",
    right: { label: "frog", emoji: "🐸" },
    wrong: [
      { label: "dog", emoji: "🐕" },
      { label: "horse", emoji: "🐎" },
    ],
    hint: "A frog starts as a tadpole that swims like a fish! This big change is called metamorphosis.",
  },
  {
    prompt: "Where do adult salmon go to lay their eggs?",
    right: { label: "back to the river where they hatched", emoji: "🏞️" },
    wrong: [
      { label: "into a desert", emoji: "🏜️" },
      { label: "up a tall tree", emoji: "🌲" },
    ],
    hint: "Salmon swim from the ocean back up the river where they were born. Salmon have been important to First Peoples in BC for thousands of years.",
    emoji: "🐟",
  },
  {
    prompt: "What do all living things do?",
    right: { label: "grow and change", emoji: "🌱" },
    wrong: [
      { label: "stay the same forever", emoji: "🗿" },
      { label: "turn into toys", emoji: "🧸" },
    ],
    hint: "Plants, animals and people all grow and change during their lives.",
  },
  {
    prompt: "What does a seed need to start growing?",
    right: { label: "water and warmth", emoji: "💧" },
    wrong: [
      { label: "a toy", emoji: "🧸" },
      { label: "a phone", emoji: "📱" },
    ],
    hint: "Seeds need water, warmth and soil to sprout.",
    emoji: "🌱",
  },
];

function lifeCycles(): Question[] {
  return [BUTTERFLY, ...shuffle([SALMON, FROG]).slice(0, 1), ...fromBank(LIFE_BANK, 6)];
}

// ---------- Solids, Liquids & Gases ----------

const MATTER_SORT = {
  prompt: "Is it a solid or a liquid? Tap an item, then tap its basket.",
  hint: "A solid keeps its shape. A liquid flows and takes the shape of its container.",
  bins: [
    { id: "solid", label: "solid", emoji: "🧱" },
    { id: "liquid", label: "liquid", emoji: "💧" },
  ],
  items: [
    { label: "rock", emoji: "🪨", bin: "solid" },
    { label: "ice cube", emoji: "🧊", bin: "solid" },
    { label: "apple", emoji: "🍎", bin: "solid" },
    { label: "book", emoji: "📕", bin: "solid" },
    { label: "spoon", emoji: "🥄", bin: "solid" },
    { label: "milk", emoji: "🥛", bin: "liquid" },
    { label: "juice", emoji: "🧃", bin: "liquid" },
    { label: "water", emoji: "💧", bin: "liquid" },
    { label: "honey", emoji: "🍯", bin: "liquid" },
  ],
};

const MATTER_BANK: BankItem[] = [
  {
    prompt: "What happens to ice when it gets warm?",
    right: { label: "It melts into water", emoji: "💧" },
    wrong: [
      { label: "It turns into a rock", emoji: "🪨" },
      { label: "It gets bigger", emoji: "⬆️" },
    ],
    hint: "Heat makes ice melt. The solid becomes a liquid.",
    emoji: "🧊",
  },
  {
    prompt: "What happens to water in the freezer?",
    right: { label: "It freezes into ice", emoji: "🧊" },
    wrong: [
      { label: "It turns into juice", emoji: "🧃" },
      { label: "It disappears", emoji: "💨" },
    ],
    hint: "Cold makes water freeze. The liquid becomes a solid.",
    emoji: "❄️",
  },
  {
    prompt: "When water boils, some of it turns into…",
    right: { label: "steam (a gas)", emoji: "♨️" },
    wrong: [
      { label: "ice", emoji: "🧊" },
      { label: "sand", emoji: "🏖️" },
    ],
    hint: "Very hot water turns into steam. Steam is a gas.",
    emoji: "🫖",
  },
  {
    prompt: "Which change can be undone?",
    right: { label: "melting ice", emoji: "🧊" },
    wrong: [
      { label: "baking cookies", emoji: "🍪" },
      { label: "burning wood", emoji: "🔥" },
    ],
    hint: "Melted ice can be frozen again. You can't un-bake a cookie!",
  },
  {
    prompt: "Which one is a gas?",
    right: { label: "the air we breathe", emoji: "🌬️" },
    wrong: [
      { label: "a pencil", emoji: "✏️" },
      { label: "orange juice", emoji: "🧃" },
    ],
    hint: "Gases spread out to fill any space. Air is a gas!",
  },
  {
    prompt: "Can melted chocolate become solid again?",
    right: { label: "Yes, if it cools down", emoji: "🍫" },
    wrong: [{ label: "No, never", emoji: "🚫" }],
    hint: "When melted chocolate cools, it becomes solid again. That change can be undone.",
    emoji: "🍫",
  },
];

function matter(): Question[] {
  return shuffle([sortQuestion(MATTER_SORT, 3), ...fromBank(MATTER_BANK, 6)]);
}

// ---------- Push & Pull ----------

const FORCE_SORT = {
  prompt: "Is it a push or a pull? Tap an item, then tap its basket.",
  hint: "A push moves something away from you. A pull moves something toward you.",
  bins: [
    { id: "push", label: "push", emoji: "👐" },
    { id: "pull", label: "pull", emoji: "🪢" },
  ],
  items: [
    { label: "kick a ball", emoji: "⚽", bin: "push" },
    { label: "push a cart", emoji: "🛒", bin: "push" },
    { label: "ring a doorbell", emoji: "🔔", bin: "push" },
    { label: "bowl a ball", emoji: "🎳", bin: "push" },
    { label: "pull a sled", emoji: "🛷", bin: "pull" },
    { label: "reel in a fish", emoji: "🎣", bin: "pull" },
    { label: "pull a weed", emoji: "🌱", bin: "pull" },
    { label: "tug-of-war", emoji: "🪢", bin: "pull" },
  ],
};

const FORCE_BANK: BankItem[] = [
  {
    prompt: "What makes a toy car roll farther?",
    right: { label: "a bigger push", emoji: "💪" },
    wrong: [
      { label: "a tiny push", emoji: "🤏" },
      { label: "no push", emoji: "🚫" },
    ],
    hint: "A stronger push gives the car more energy, so it goes farther.",
    emoji: "🚗",
  },
  {
    prompt: "Which thing will a magnet pull?",
    right: { label: "a paper clip", emoji: "📎" },
    wrong: [
      { label: "a wooden block", emoji: "🪵" },
      { label: "a paper cup", emoji: "🥤" },
    ],
    hint: "Magnets pull on some metals, like iron and steel. Paper clips are made of steel!",
    emoji: "🧲",
  },
  {
    prompt: "Gravity pulls things…",
    right: { label: "down", emoji: "⬇️" },
    wrong: [
      { label: "up", emoji: "⬆️" },
      { label: "sideways", emoji: "➡️" },
    ],
    hint: "When you drop a ball, gravity pulls it down to the ground.",
    emoji: "🍎",
  },
  {
    prompt: "Which is easier to push?",
    right: { label: "an empty box", emoji: "📦" },
    wrong: [{ label: "a box full of books", emoji: "📚" }],
    hint: "Heavier things need a bigger push to move.",
  },
  {
    prompt: "Where will a toy car slow down the fastest?",
    right: { label: "on bumpy grass", emoji: "🌿" },
    wrong: [
      { label: "on smooth ice", emoji: "🧊" },
      { label: "on a smooth floor", emoji: "🟫" },
    ],
    hint: "Rough, bumpy surfaces rub against the wheels and slow them down.",
  },
  {
    prompt: "What can make a rolling ball stop or change direction?",
    right: { label: "a push or a pull", emoji: "🤲" },
    wrong: [
      { label: "saying “stop!”", emoji: "🗣️" },
      { label: "looking at it", emoji: "👀" },
    ],
    hint: "Forces (pushes and pulls) change how things move.",
    emoji: "⚽",
  },
];

function forces(): Question[] {
  return shuffle([sortQuestion(FORCE_SORT, 3), ...fromBank(FORCE_BANK, 6)]);
}

// ---------- Water World ----------

const WATER_CYCLE: OrderQuestion = {
  kind: "order",
  prompt: "Put the water cycle in order. Start with the sun warming the water.",
  hint: "Warm water rises into the sky, makes clouds, falls as rain, and collects in rivers and oceans.",
  items: [
    { id: "evap", label: "Sun warms water and it rises", emoji: "☀️" },
    { id: "cloud", label: "Clouds form", emoji: "☁️" },
    { id: "rain", label: "Rain or snow falls", emoji: "🌧️" },
    { id: "collect", label: "Water collects in rivers and oceans", emoji: "🌊" },
  ],
};

const WATER_SORT = {
  prompt: "Does it save water or waste water?",
  hint: "Using only the water you need saves it. Leaving water running wastes it.",
  bins: [
    { id: "save", label: "saves water", emoji: "👍" },
    { id: "waste", label: "wastes water", emoji: "👎" },
  ],
  items: [
    { label: "turn off the tap while brushing", emoji: "🪥", bin: "save" },
    { label: "take a short shower", emoji: "🚿", bin: "save" },
    { label: "collect rain for plants", emoji: "🪣", bin: "save" },
    { label: "leave the hose running", emoji: "💦", bin: "waste" },
    { label: "let the tap drip", emoji: "🚰", bin: "waste" },
    { label: "take a really full bath", emoji: "🛁", bin: "waste" },
  ],
};

const WATER_BANK: BankItem[] = [
  {
    prompt: "Why do all living things need water?",
    right: { label: "to live and grow", emoji: "🌱" },
    wrong: [
      { label: "to play games", emoji: "🎮" },
      { label: "to stay dry", emoji: "☂️" },
    ],
    hint: "Plants, animals and people all need water to stay alive.",
    emoji: "💧",
  },
  {
    prompt: "Rain that falls on mountains flows down into…",
    right: { label: "streams, rivers and lakes", emoji: "🏞️" },
    wrong: [
      { label: "the clouds", emoji: "☁️" },
      { label: "the moon", emoji: "🌙" },
    ],
    hint: "Water flows downhill. The land it flows across is called a watershed.",
    emoji: "🏔️",
  },
  {
    prompt: "Water as a solid is called…",
    right: { label: "ice", emoji: "🧊" },
    wrong: [
      { label: "steam", emoji: "♨️" },
      { label: "juice", emoji: "🧃" },
    ],
    hint: "When water gets very cold, it freezes into ice.",
  },
  {
    prompt: "Clouds are made of…",
    right: { label: "tiny drops of water", emoji: "💧" },
    wrong: [
      { label: "cotton", emoji: "🧶" },
      { label: "smoke", emoji: "💨" },
    ],
    hint: "Water rises into the sky, cools down and makes tiny drops. Lots of drops make a cloud.",
    emoji: "☁️",
  },
  {
    prompt: "What is the best way to keep rivers clean?",
    right: { label: "put garbage in the bin", emoji: "🗑️" },
    wrong: [
      { label: "throw litter in the river", emoji: "🥤" },
      { label: "wash paint into the drain", emoji: "🎨" },
    ],
    hint: "Litter and paint can wash into rivers and hurt fish like salmon.",
    emoji: "🏞️",
  },
  {
    prompt: "Where does most of Earth's water live?",
    right: { label: "in the oceans", emoji: "🌊" },
    wrong: [
      { label: "in bathtubs", emoji: "🛁" },
      { label: "in puddles", emoji: "💧" },
    ],
    hint: "Oceans are huge! They hold almost all the water on Earth.",
    emoji: "🌍",
  },
];

function water(): Question[] {
  return [WATER_CYCLE, ...shuffle([sortQuestion(WATER_SORT, 3), ...fromBank(WATER_BANK, 6)])];
}

export const course: Course = {
  grade: "2",
  subject: "science",
  bigIdeas: {
    "ca-bc": [
    "Living things have life cycles adapted to their environment.",
    "Materials can be changed through physical and chemical processes.",
    "Forces influence the motion of an object.",
    "Water is essential to all living things, and it cycles through the environment.",
    ],
  },
  units: [
    {
      id: "life-cycles",
      title: "Life Cycles",
      emoji: "🦋",
      blurb: "Butterflies, frogs and salmon",
      standards: { "ca-bc": "Metamorphic and non-metamorphic life cycles; similarities between offspring and parents" },
      parentNote: "Life cycles of butterflies, frogs and BC salmon, and how babies compare with their parents.",
      generate: lifeCycles,
    },
    {
      id: "solids-and-liquids",
      title: "Solids & Liquids",
      emoji: "🧊",
      blurb: "Melting, freezing and steam",
      standards: { "ca-bc": "Properties of matter; physical and chemical changes" },
      parentNote: "Sorting solids and liquids, describing melting, freezing and boiling, and changes that can or can't be undone.",
      generate: matter,
    },
    {
      id: "push-and-pull",
      title: "Push & Pull",
      emoji: "🛷",
      blurb: "Forces make things move",
      standards: { "ca-bc": "Forces: pushes and pulls; effects of forces on motion" },
      parentNote: "Pushes and pulls, magnets, gravity, and how surfaces slow things down.",
      generate: forces,
    },
    {
      id: "water-world",
      title: "Water World",
      emoji: "💧",
      blurb: "The water cycle",
      standards: { "ca-bc": "The water cycle; water sources including local watersheds; water conservation" },
      parentNote: "The water cycle, where our water comes from, and simple ways to save water and keep rivers clean.",
      generate: water,
    },
  ],
};
