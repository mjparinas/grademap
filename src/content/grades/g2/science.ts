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

const PLANT: OrderQuestion = {
  kind: "order",
  prompt: "Put the life cycle of a bean plant in order.",
  hint: "A seed sprouts roots and a shoot, grows leaves, makes flowers, and then makes new seeds.",
  items: [
    { id: "seed", label: "seed", emoji: "🌰" },
    { id: "sprout", label: "sprout", emoji: "🌱" },
    { id: "plant", label: "growing plant with leaves", emoji: "🪴" },
    { id: "flower", label: "flowers and new seeds", emoji: "🌸" },
  ],
};

const CHICKEN: OrderQuestion = {
  kind: "order",
  prompt: "Put the chicken's life cycle in order.",
  hint: "A chick hatches from an egg, grows feathers, and becomes a hen or rooster.",
  items: [
    { id: "egg", label: "egg", emoji: "🥚" },
    { id: "chick", label: "chick", emoji: "🐥" },
    { id: "young", label: "young chicken with feathers" },
    { id: "adult", label: "adult hen", emoji: "🐔" },
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
  {
    prompt: "A tadpole grows up to be a…",
    right: { label: "frog", emoji: "🐸" },
    wrong: [
      { label: "fish", emoji: "🐟" },
      { label: "turtle", emoji: "🐢" },
    ],
    hint: "Tadpoles grow back legs and front legs, lose their tails and become frogs.",
    emoji: "🫧",
  },
  {
    prompt: "What hatches out of a butterfly egg?",
    right: { label: "a caterpillar", emoji: "🐛" },
    wrong: [
      { label: "a butterfly", emoji: "🦋" },
      { label: "a bird", emoji: "🐦" },
    ],
    hint: "A tiny caterpillar hatches from the egg and starts eating leaves.",
    emoji: "🥚",
  },
  {
    prompt: "What does a caterpillar make before it becomes a butterfly?",
    right: { label: "a chrysalis", emoji: "🍃" },
    wrong: [
      { label: "a nest", emoji: "🪺" },
      { label: "a web", emoji: "🕸️" },
    ],
    hint: "Inside the chrysalis, the caterpillar's body changes a lot.",
  },
  {
    prompt: "A kitten grows up to be a…",
    right: { label: "cat", emoji: "🐈" },
    wrong: [
      { label: "dog", emoji: "🐕" },
      { label: "rabbit", emoji: "🐇" },
    ],
    hint: "Kittens look like small cats and grow bigger.",
    emoji: "🐱",
  },
  {
    prompt: "A calf grows up to be a…",
    right: { label: "cow", emoji: "🐄" },
    wrong: [
      { label: "pig", emoji: "🐖" },
      { label: "sheep", emoji: "🐑" },
    ],
    hint: "A calf is a baby cow.",
  },
  {
    prompt: "A lamb grows up to be a…",
    right: { label: "sheep", emoji: "🐑" },
    wrong: [
      { label: "goat", emoji: "🐐" },
      { label: "horse", emoji: "🐎" },
    ],
    hint: "A lamb is a baby sheep.",
  },
  {
    prompt: "A baby deer is called a…",
    right: { label: "fawn", emoji: "🦌" },
    wrong: [
      { label: "cub", emoji: "🐻" },
      { label: "calf", emoji: "🐄" },
    ],
    hint: "A fawn is a young deer. It has spots on its coat to hide in the forest.",
  },
  {
    prompt: "A baby bear is called a…",
    right: { label: "cub", emoji: "🐻" },
    wrong: [
      { label: "fawn", emoji: "🦌" },
      { label: "chick", emoji: "🐥" },
    ],
    hint: "Bear cubs stay with their mother while they grow and learn.",
  },
  {
    prompt: "Which animal does NOT change its shape completely as it grows?",
    right: { label: "a dog", emoji: "🐕" },
    wrong: [
      { label: "a butterfly", emoji: "🦋" },
      { label: "a frog", emoji: "🐸" },
    ],
    hint: "A puppy looks like a small dog. A butterfly and a frog change a lot.",
  },
  {
    prompt: "Which animal starts life in an egg?",
    right: { label: "a robin", emoji: "🐦" },
    wrong: [
      { label: "a cat", emoji: "🐈" },
      { label: "a dog", emoji: "🐕" },
    ],
    hint: "Birds, fish, frogs and insects hatch from eggs. Cats and dogs are born alive.",
    emoji: "🥚",
  },
  {
    prompt: "A baby that is born alive and drinks its mother's milk is…",
    right: { label: "a puppy", emoji: "🐶" },
    wrong: [
      { label: "a caterpillar", emoji: "🐛" },
      { label: "a tadpole", emoji: "🫧" },
    ],
    hint: "Puppies are mammals. They are born alive and drink milk.",
  },
  {
    prompt: "Which part of a plant's life comes first?",
    right: { label: "seed", emoji: "🌰" },
    wrong: [
      { label: "flower", emoji: "🌸" },
      { label: "fruit", emoji: "🍎" },
    ],
    hint: "Plants start as seeds, then sprout, grow, flower and make new seeds.",
    emoji: "🌱",
  },
  {
    prompt: "What does a flower make that can grow into a new plant?",
    right: { label: "seeds", emoji: "🌰" },
    wrong: [
      { label: "eggs", emoji: "🥚" },
      { label: "bricks", emoji: "🧱" },
    ],
    hint: "Seeds start new plants, and the cycle begins again.",
    emoji: "🌻",
  },
  {
    prompt: "Pine trees make seeds inside…",
    right: { label: "cones", emoji: "🌲" },
    wrong: [
      { label: "shells", emoji: "🐚" },
      { label: "bubbles", emoji: "🫧" },
    ],
    hint: "Pine cones hold seeds, which can grow into new trees.",
  },
  {
    prompt: "Baby salmon are born in…",
    right: { label: "freshwater rivers and streams", emoji: "🏞️" },
    wrong: [
      { label: "a deep dark cave", emoji: "🕳️" },
      { label: "the top of a tree", emoji: "🌲" },
    ],
    hint: "Salmon eggs are laid in gravel in a cool, clean stream.",
    emoji: "🐟",
  },
  {
    prompt: "When salmon are fully grown, many live in the ocean for a time. Then they…",
    right: { label: "swim back up rivers to lay eggs", emoji: "🏞️" },
    wrong: [
      { label: "walk across the land", emoji: "🥾" },
      { label: "fly south", emoji: "🛫" },
    ],
    hint: "This amazing trip is how the salmon life cycle starts again.",
  },
  {
    prompt: "A parent and its baby usually…",
    right: { label: "look alike in some ways", emoji: "👨‍👧" },
    wrong: [
      { label: "look exactly the same", emoji: "👥" },
      { label: "never look alike", emoji: "🙅" },
    ],
    hint: "Babies often share traits with their parents, like fur colour or ear shape.",
  },
  {
    prompt: "Which pair is a parent and its baby?",
    right: { label: "hen and chick", emoji: "🐔" },
    wrong: [
      { label: "cow and chick", emoji: "🐄" },
      { label: "horse and tadpole", emoji: "🐎" },
    ],
    hint: "A chick hatches from a hen's egg.",
  },
  {
    prompt: "What do baby birds need from their parents?",
    right: { label: "food and a safe nest", emoji: "🪺" },
    wrong: [
      { label: "a bicycle", emoji: "🚲" },
      { label: "a computer", emoji: "💻" },
    ],
    hint: "Parents feed and protect their young until they can fly and find their own food.",
  },
  {
    prompt: "A life cycle shows how a living thing…",
    right: { label: "grows, changes and makes new life", emoji: "🔄" },
    wrong: [
      { label: "stays exactly the same", emoji: "🗿" },
      { label: "turns into a rock", emoji: "🪨" },
    ],
    hint: "A cycle goes round and round, from egg to adult and back to egg.",
  },
  {
    prompt: "A ladybug starts its life as…",
    right: { label: "a tiny egg", emoji: "🥚" },
    wrong: [
      { label: "an adult ladybug", emoji: "🐞" },
      { label: "a seed", emoji: "🌰" },
    ],
    hint: "Insects like ladybugs begin as eggs, then become larvae, pupae and adults.",
    emoji: "🐞",
  },
];

function lifeCycles(): Question[] {
  return [BUTTERFLY, ...shuffle([SALMON, FROG, PLANT, CHICKEN]).slice(0, 1), ...fromBank(LIFE_BANK, 6)];
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
  {
    prompt: "Which one is a liquid?",
    right: { label: "milk", emoji: "🥛" },
    wrong: [
      { label: "a brick", emoji: "🧱" },
      { label: "a spoon", emoji: "🥄" },
    ],
    hint: "A liquid flows and takes the shape of its container.",
  },
  {
    prompt: "Which one is a solid?",
    right: { label: "a wooden block", emoji: "🪵" },
    wrong: [
      { label: "orange juice", emoji: "🧃" },
      { label: "steam", emoji: "♨️" },
    ],
    hint: "A solid keeps its own shape.",
  },
  {
    prompt: "What happens when you pour water into a different glass?",
    right: { label: "It takes the shape of the new glass", emoji: "🥛" },
    wrong: [
      { label: "It stays in a ball", emoji: "⚽" },
      { label: "It turns into ice", emoji: "🧊" },
    ],
    hint: "Liquids change shape to fit their container.",
  },
  {
    prompt: "Which is made of tiny bits you can pour, but each bit is a solid?",
    right: { label: "sand", emoji: "🏖️" },
    wrong: [
      { label: "water", emoji: "💧" },
      { label: "air", emoji: "💨" },
    ],
    hint: "Sand is made of tiny solid grains.",
  },
  {
    prompt: "What happens to a puddle of water on a very cold day?",
    right: { label: "It can freeze into ice", emoji: "🧊" },
    wrong: [
      { label: "It turns into sand", emoji: "🏖️" },
      { label: "It becomes juice", emoji: "🧃" },
    ],
    hint: "Water freezes when it gets cold enough.",
  },
  {
    prompt: "What happens to a snowman on a warm sunny day?",
    right: { label: "It melts", emoji: "☃️" },
    wrong: [
      { label: "It grows taller", emoji: "📏" },
      { label: "It turns to wood", emoji: "🪵" },
    ],
    hint: "Heat turns solid snow into liquid water.",
  },
  {
    prompt: "Which can be undone: melting an ice cube or baking a cake?",
    right: { label: "melting an ice cube", emoji: "🧊" },
    wrong: [
      { label: "baking a cake", emoji: "🎂" },
      { label: "burning a log", emoji: "🪵" },
    ],
    hint: "You can freeze melted water to make ice again, but you can't un-bake a cake.",
  },
  {
    prompt: "Which change CANNOT be undone?",
    right: { label: "toast being made from bread", emoji: "🍞" },
    wrong: [
      { label: "ice melting", emoji: "🧊" },
      { label: "water freezing", emoji: "💧" },
    ],
    hint: "Toasting makes a new material. You can't turn toast back into bread.",
  },
  {
    prompt: "Which one is a gas?",
    right: { label: "the air in a balloon", emoji: "🎈" },
    wrong: [
      { label: "a pencil", emoji: "✏️" },
      { label: "a glass of juice", emoji: "🧃" },
    ],
    hint: "Gases spread out to fill whatever space they are in.",
  },
  {
    prompt: "What do we call the process of a liquid becoming a solid when it gets cold?",
    right: "freezing",
    wrong: ["melting", "boiling"],
    hint: "Freezing happens when a liquid cools down until it is solid.",
  },
  {
    prompt: "What do we call it when a solid turns into a liquid because it gets warm?",
    right: "melting",
    wrong: ["freezing", "growing"],
    hint: "Melting needs heat. Ice melts into water.",
  },
  {
    prompt: "What happens when you warm up butter?",
    right: { label: "It gets softer and melts", emoji: "🧈" },
    wrong: [
      { label: "It becomes a gas right away", emoji: "💨" },
      { label: "It turns into stone", emoji: "🪨" },
    ],
    hint: "Heat can change solids into liquids.",
  },
  {
    prompt: "Which words describe a solid?",
    right: { label: "hard and keeps its shape", emoji: "🧱" },
    wrong: [
      { label: "flows and pours", emoji: "💧" },
      { label: "floats away in the air", emoji: "💨" },
    ],
    hint: "Solids don't change shape unless you do something to them.",
  },
  {
    prompt: "Which words describe a liquid?",
    right: { label: "flows and pours", emoji: "💧" },
    wrong: [
      { label: "always keeps its shape", emoji: "🧱" },
      { label: "can't be seen or felt", emoji: "👻" },
    ],
    hint: "Liquids can be poured and take the shape of their container.",
  },
  {
    prompt: "A rubber ball is…",
    right: { label: "a solid", emoji: "⚽" },
    wrong: [
      { label: "a liquid", emoji: "💧" },
      { label: "a gas", emoji: "💨" },
    ],
    hint: "A ball keeps its shape, so it is a solid.",
  },
  {
    prompt: "Which of these is NOT a liquid?",
    right: { label: "a crayon", emoji: "🖍️" },
    wrong: [
      { label: "paint", emoji: "🎨" },
      { label: "soup", emoji: "🍲" },
    ],
    hint: "A crayon is hard and keeps its shape.",
  },
  {
    prompt: "What is the best way to turn water into ice?",
    right: { label: "put it in a freezer", emoji: "🧊" },
    wrong: [
      { label: "put it in the sun", emoji: "☀️" },
      { label: "stir it with a spoon", emoji: "🥄" },
    ],
    hint: "Cold temperatures freeze water.",
  },
  {
    prompt: "Ice cream left in the sun will…",
    right: { label: "melt", emoji: "🍦" },
    wrong: [
      { label: "get harder", emoji: "🧱" },
      { label: "turn into water vapour", emoji: "♨️" },
    ],
    hint: "Heat from the sun melts ice cream.",
  },
  {
    prompt: "A material that can be squeezed and stretched into a new shape, like clay, is still a…",
    right: { label: "solid", emoji: "🧱" },
    wrong: [
      { label: "liquid", emoji: "💧" },
      { label: "gas", emoji: "💨" },
    ],
    hint: "Clay changes shape when we press it, but it doesn't flow like water.",
  },
  {
    prompt: "Where would you find water as a gas?",
    right: { label: "steam rising from hot soup", emoji: "🍲" },
    wrong: [
      { label: "an ice cube", emoji: "🧊" },
      { label: "a river", emoji: "🏞️" },
    ],
    hint: "Hot water makes steam, which is water as a gas.",
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
  {
    prompt: "What do you use to start a swing moving?",
    right: { label: "a push", emoji: "👐" },
    wrong: [
      { label: "a colour", emoji: "🎨" },
      { label: "a whisper", emoji: "🤫" },
    ],
    hint: "A push or a pull is a force that makes something start to move.",
    emoji: "🛝",
  },
  {
    prompt: "Pushes and pulls are called…",
    right: "forces",
    wrong: ["sounds", "colours"],
    hint: "A force is a push or a pull that changes how something moves.",
  },
  {
    prompt: "What force pulls a dropped pencil down to the floor?",
    right: { label: "gravity", emoji: "⬇️" },
    wrong: [
      { label: "a magnet", emoji: "🧲" },
      { label: "the wind", emoji: "💨" },
    ],
    hint: "Gravity pulls everything toward the ground.",
    emoji: "✏️",
  },
  {
    prompt: "Which surface makes a rolling ball stop fastest?",
    right: { label: "thick carpet", emoji: "🧶" },
    wrong: [
      { label: "smooth ice", emoji: "🧊" },
      { label: "a shiny wood floor", emoji: "🪵" },
    ],
    hint: "Rough or soft surfaces slow things down more than smooth ones.",
  },
  {
    prompt: "Which would slide the farthest?",
    right: { label: "a puck on ice", emoji: "🏒" },
    wrong: [
      { label: "a puck on sand", emoji: "🏖️" },
      { label: "a puck on thick grass", emoji: "🌿" },
    ],
    hint: "Smooth, slippery surfaces let things slide farther.",
  },
  {
    prompt: "A magnet can pull a…",
    right: { label: "metal paper clip", emoji: "📎" },
    wrong: [
      { label: "wooden block", emoji: "🪵" },
      { label: "plastic cup", emoji: "🥤" },
    ],
    hint: "Magnets pull on things that have iron in them, like many metal objects.",
    emoji: "🧲",
  },
  {
    prompt: "A magnet can pull on something without touching it. This is because magnets have a…",
    right: { label: "magnetic force", emoji: "🧲" },
    wrong: [
      { label: "sticky glue", emoji: "🧴" },
      { label: "string", emoji: "🧵" },
    ],
    hint: "Magnetic force can work across a small gap.",
  },
  {
    prompt: "What happens to a toy car if you give it a push and then stop pushing?",
    right: { label: "It slows down and stops", emoji: "🚗" },
    wrong: [
      { label: "It keeps speeding up forever", emoji: "🚀" },
      { label: "It flies up", emoji: "🛫" },
    ],
    hint: "Friction between the wheels and floor slows the car down.",
  },
  {
    prompt: "Which one is a pull?",
    right: { label: "opening a drawer by the handle", emoji: "🗄️" },
    wrong: [
      { label: "kicking a soccer ball", emoji: "⚽" },
      { label: "closing a door with your hand", emoji: "🚪" },
    ],
    hint: "A pull moves something toward you.",
  },
  {
    prompt: "Which one is a push?",
    right: { label: "pushing a shopping cart", emoji: "🛒" },
    wrong: [
      { label: "pulling a wagon", emoji: "🛻" },
      { label: "tugging a rope", emoji: "🪢" },
    ],
    hint: "A push moves something away from you.",
  },
  {
    prompt: "Which would be hardest to push?",
    right: { label: "a heavy box", emoji: "📦" },
    wrong: [
      { label: "a feather", emoji: "🪶" },
      { label: "a balloon", emoji: "🎈" },
    ],
    hint: "Heavier things need a bigger force to move them.",
  },
  {
    prompt: "A force can change the…",
    right: { label: "speed or direction of a moving object", emoji: "🧭" },
    wrong: [
      { label: "age of a toy", emoji: "🎂" },
      { label: "colour of the sky", emoji: "🌤️" },
    ],
    hint: "Pushes and pulls can speed things up, slow them down, or turn them.",
  },
  {
    prompt: "Wind pushes a sailboat. What does that make the boat do?",
    right: { label: "move across the water", emoji: "⛵" },
    wrong: [
      { label: "sink at once", emoji: "🌊" },
      { label: "fall asleep", emoji: "😴" },
    ],
    hint: "Wind is moving air, and it can push things.",
  },
  {
    prompt: "A magnet has two ends called…",
    right: { label: "poles", emoji: "🧲" },
    wrong: [
      { label: "wheels", emoji: "🛞" },
      { label: "chimneys", emoji: "🏠" },
    ],
    hint: "Opposite poles pull together. Same poles push apart.",
  },
  {
    prompt: "A skateboard rolls farther on…",
    right: { label: "smooth pavement", emoji: "🛹" },
    wrong: [
      { label: "soft sand", emoji: "🏖️" },
      { label: "tall grass", emoji: "🌾" },
    ],
    hint: "Rough or soft surfaces slow things more than smooth ones.",
  },
  {
    prompt: "When you throw a ball up, what pulls it back down?",
    right: { label: "gravity", emoji: "⬇️" },
    wrong: [
      { label: "a tiny rope", emoji: "🪢" },
      { label: "a wish", emoji: "⭐" },
    ],
    hint: "Gravity pulls things toward the ground.",
    emoji: "⚾",
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
  {
    prompt: "Water falling from clouds as drops is called…",
    right: { label: "rain", emoji: "🌧️" },
    wrong: [
      { label: "wind", emoji: "💨" },
      { label: "sunshine", emoji: "☀️" },
    ],
    hint: "Clouds fill with tiny drops of water. When the drops get heavy, they fall as rain.",
  },
  {
    prompt: "When the air is very cold, water can fall as…",
    right: { label: "snow", emoji: "❄️" },
    wrong: [
      { label: "sand", emoji: "🏖️" },
      { label: "leaves", emoji: "🍂" },
    ],
    hint: "In freezing air, water in clouds becomes ice crystals that fall as snow.",
  },
  {
    prompt: "What does the sun do to a puddle on a warm day?",
    right: { label: "It dries up as water goes into the air", emoji: "☀️" },
    wrong: [
      { label: "It grows bigger", emoji: "💦" },
      { label: "It turns into a rock", emoji: "🪨" },
    ],
    hint: "The sun's heat makes water rise into the air as a gas you can't see. This is called evaporation.",
    emoji: "💧",
  },
  {
    prompt: "Where do rivers usually end up?",
    right: { label: "in a lake or the ocean", emoji: "🌊" },
    wrong: [
      { label: "at the top of a mountain", emoji: "🏔️" },
      { label: "in the sky", emoji: "☁️" },
    ],
    hint: "Water flows downhill, from streams to rivers and then to lakes or the ocean.",
  },
  {
    prompt: "Water in rivers, lakes and streams that people can drink (after it is cleaned) is mostly…",
    right: { label: "fresh water", emoji: "🚰" },
    wrong: [
      { label: "salt water", emoji: "🧂" },
      { label: "juice", emoji: "🧃" },
    ],
    hint: "Fresh water has no salt. Ocean water is salty.",
  },
  {
    prompt: "Ocean water tastes…",
    right: { label: "salty", emoji: "🧂" },
    wrong: [
      { label: "sweet", emoji: "🍬" },
      { label: "sour", emoji: "🍋" },
    ],
    hint: "The ocean has lots of salt in it. We can't drink it.",
    emoji: "🌊",
  },
  {
    prompt: "Which of these needs water to live?",
    right: { label: "a tree", emoji: "🌳" },
    wrong: [
      { label: "a rock", emoji: "🪨" },
      { label: "a toy truck", emoji: "🚚" },
    ],
    hint: "Living things need water. Rocks and toys are not alive.",
  },
  {
    prompt: "A plant that doesn't get water will…",
    right: { label: "droop and dry out", emoji: "🥀" },
    wrong: [
      { label: "grow faster", emoji: "🌻" },
      { label: "turn into a tree overnight", emoji: "🌳" },
    ],
    hint: "Plants take water in through their roots to stay healthy.",
  },
  {
    prompt: "Which animal lives in water all its life?",
    right: { label: "a fish", emoji: "🐟" },
    wrong: [
      { label: "a squirrel", emoji: "🐿️" },
      { label: "a robin", emoji: "🐦" },
    ],
    hint: "Fish breathe underwater using their gills.",
  },
  {
    prompt: "What is a good way to share water with plants without wasting it?",
    right: { label: "water them with rain collected in a barrel", emoji: "🪣" },
    wrong: [
      { label: "leave the hose on all night", emoji: "💦" },
      { label: "pour out a full bath on the grass", emoji: "🛁" },
    ],
    hint: "Collecting rain helps us use less tap water.",
  },
  {
    prompt: "Why should we keep litter out of streams and oceans?",
    right: { label: "It can harm fish and other animals", emoji: "🐠" },
    wrong: [
      { label: "It makes the water taste better", emoji: "😋" },
      { label: "Fish love garbage", emoji: "🗑️" },
    ],
    hint: "Clean water keeps animals and plants healthy.",
  },
  {
    prompt: "The water that falls on land and flows along the ground is called…",
    right: { label: "runoff", emoji: "🏞️" },
    wrong: [
      { label: "a shadow", emoji: "🌑" },
      { label: "a cloud", emoji: "☁️" },
    ],
    hint: "Rain that doesn't soak in runs downhill into streams and rivers.",
  },
  {
    prompt: "Which of these is frozen water?",
    right: { label: "an icicle", emoji: "🧊" },
    wrong: [
      { label: "a puddle", emoji: "💧" },
      { label: "steam", emoji: "♨️" },
    ],
    hint: "Water becomes ice when it gets very cold.",
  },
  {
    prompt: "Steam from a kettle is water as a…",
    right: { label: "gas", emoji: "♨️" },
    wrong: [
      { label: "solid", emoji: "🧱" },
      { label: "rock", emoji: "🪨" },
    ],
    hint: "When water is heated until it boils, it turns into a gas called water vapour.",
  },
  {
    prompt: "Which weather brings the most water to the land?",
    right: { label: "a rainy day", emoji: "🌧️" },
    wrong: [
      { label: "a sunny day", emoji: "☀️" },
      { label: "a clear night", emoji: "🌙" },
    ],
    hint: "Rain adds water to rivers, lakes and the ground.",
  },
  {
    prompt: "What do people use water for every day?",
    right: { label: "drinking, cooking and washing", emoji: "🚿" },
    wrong: [
      { label: "only for painting", emoji: "🎨" },
      { label: "nothing at all", emoji: "🚫" },
    ],
    hint: "We use water for lots of things at home and at school.",
  },
  {
    prompt: "Where does our drinking water often come from?",
    right: { label: "lakes, rivers and underground water", emoji: "🏞️" },
    wrong: [
      { label: "the moon", emoji: "🌙" },
      { label: "clouds on the ground", emoji: "☁️" },
    ],
    hint: "Water from lakes, rivers or underground is cleaned before it comes out of our taps.",
  },
  {
    prompt: "In the water cycle, what happens right after clouds get heavy with water?",
    right: { label: "Rain or snow falls", emoji: "🌧️" },
    wrong: [
      { label: "The ocean disappears", emoji: "🌊" },
      { label: "The sun goes out", emoji: "🌞" },
    ],
    hint: "Water goes up, forms clouds, and then comes back down as rain or snow.",
  },
  {
    prompt: "Where in the cycle does water go back up into the sky?",
    right: { label: "when the sun warms it", emoji: "☀️" },
    wrong: [
      { label: "when it snows", emoji: "❄️" },
      { label: "when it sinks in the ground", emoji: "🕳️" },
    ],
    hint: "Warm water turns into vapour and rises into the air.",
  },
  {
    prompt: "Which one is a body of water?",
    right: { label: "a lake", emoji: "🏞️" },
    wrong: [
      { label: "a hill", emoji: "⛰️" },
      { label: "a forest", emoji: "🌲" },
    ],
    hint: "Lakes, oceans, rivers and ponds are bodies of water.",
  },
  {
    prompt: "A very big, deep body of salt water is an…",
    right: { label: "ocean", emoji: "🌊" },
    wrong: [
      { label: "puddle", emoji: "💧" },
      { label: "pond", emoji: "🦆" },
    ],
    hint: "Oceans cover most of our planet.",
  },
  {
    prompt: "A glacier is a big piece of…",
    right: { label: "ice that moves very slowly", emoji: "🧊" },
    wrong: [
      { label: "warm sand", emoji: "🏖️" },
      { label: "hot lava", emoji: "🌋" },
    ],
    hint: "Glaciers are huge rivers of ice found in cold, mountainous places.",
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
