import { chance, pick, sample, shuffle, textChoice } from "../../random";
import type { Course, GenerateOptions, Question } from "../../types";
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

// ---------- My Community ----------

const CHOICES_SORT: SortSet = {
  prompt: "Is it a helpful choice or not? Tap an item, then tap its basket.",
  hint: "Helpful choices are kind and safe. They show we care about the people around us.",
  bins: [
    { id: "good", label: "helpful choice", emoji: "👍" },
    { id: "not", label: "not helpful", emoji: "👎" },
  ],
  items: [
    { label: "share your toys", emoji: "🧸", bin: "good" },
    { label: "take turns", emoji: "🔄", bin: "good" },
    { label: "help a friend", emoji: "🤝", bin: "good" },
    { label: "say thank you", emoji: "💬", bin: "good" },
    { label: "hold the door", emoji: "🚪", bin: "good" },
    { label: "clean up your mess", emoji: "🧹", bin: "good" },
    { label: "grab a toy", emoji: "✊", bin: "not" },
    { label: "leave someone out", emoji: "🙅", bin: "not" },
    { label: "yell in the library", emoji: "📢", bin: "not" },
    { label: "push in line", emoji: "👉", bin: "not" },
    { label: "leave a big mess", emoji: "🗑️", bin: "not" },
  ],
};

const COMMUNITY_BANK: Item[] = [
  {
    prompt: "Who helps you when you are sick?",
    right: { label: "doctor", emoji: "🩺" },
    wrong: [
      { label: "bus driver", emoji: "🚌" },
      { label: "baker", emoji: "🍞" },
    ],
    hint: "Doctors and nurses help us get better and stay healthy.",
  },
  {
    prompt: "Who brings letters to your home?",
    right: { label: "mail carrier", emoji: "📬" },
    wrong: [
      { label: "firefighter", emoji: "🚒" },
      { label: "farmer", emoji: "🚜" },
    ],
    hint: "A mail carrier delivers letters and packages to homes.",
  },
  {
    prompt: "Who puts out fires?",
    right: { label: "firefighter", emoji: "🚒" },
    wrong: [
      { label: "librarian", emoji: "📚" },
      { label: "dentist", emoji: "🦷" },
    ],
    hint: "Firefighters put out fires and help keep everyone safe.",
  },
  {
    prompt: "Who grows food for us to eat?",
    right: { label: "farmer", emoji: "🚜" },
    wrong: [
      { label: "librarian", emoji: "📚" },
      { label: "mail carrier", emoji: "📬" },
    ],
    hint: "Farmers grow fruit, vegetables and grain for our community.",
  },
  {
    prompt: "Who helps sick pets get better?",
    right: { label: "vet", emoji: "🐶" },
    wrong: [
      { label: "bus driver", emoji: "🚌" },
      { label: "baker", emoji: "🍞" },
    ],
    hint: "A vet (veterinarian) is a doctor for animals.",
  },
  {
    prompt: "Where do you go to borrow books?",
    right: { label: "library", emoji: "📚" },
    wrong: [
      { label: "grocery store", emoji: "🛒" },
      { label: "fire hall", emoji: "🚒" },
    ],
    hint: "At the library, everyone can borrow books for free and bring them back later.",
  },
  {
    prompt: "Where can you play on swings and slides?",
    right: { label: "park", emoji: "🌳" },
    wrong: [
      { label: "hospital", emoji: "🏥" },
      { label: "bank", emoji: "🏦" },
    ],
    hint: "Parks and playgrounds are places in a community where everyone can play.",
  },
  {
    prompt: "Where do families buy food?",
    right: { label: "grocery store", emoji: "🛒" },
    wrong: [
      { label: "library", emoji: "📚" },
      { label: "school", emoji: "🏫" },
    ],
    hint: "Grocery stores and markets sell food for families.",
  },
  {
    prompt: "Who helps you learn at school?",
    right: { label: "teacher", emoji: "🏫" },
    wrong: [
      { label: "dentist", emoji: "🦷" },
      { label: "farmer", emoji: "🚜" },
    ],
    hint: "Teachers help children learn to read, write, count and more.",
  },
  {
    prompt: "What is a community?",
    right: { label: "people who live, work and play in one place", emoji: "🏘️" },
    wrong: [
      { label: "one big building", emoji: "🏢" },
      { label: "a kind of food", emoji: "🍲" },
    ],
    hint: "A community is a group of people who live, work and play near each other.",
    hard: true,
  },
  {
    prompt: "Which is a responsibility at home?",
    right: { label: "help set the table", emoji: "🍽️" },
    wrong: [
      { label: "leave toys on the stairs", emoji: "🧸" },
      { label: "watch TV all day", emoji: "📺" },
    ],
    hint: "A responsibility is a job we do to help our family or community.",
    hard: true,
  },
  {
    prompt: "All children have the right to…",
    right: { label: "be safe and cared for", emoji: "❤️" },
    wrong: [
      { label: "drive a car", emoji: "🚗" },
      { label: "stay up all night", emoji: "🌙" },
    ],
    hint: "Every child has the right to be safe, cared for and able to learn.",
    hard: true,
  },
  {
    prompt: "Why do we have rules?",
    right: { label: "to keep us safe and be fair", emoji: "🛡️" },
    wrong: [
      { label: "to make us sad", emoji: "😢" },
      { label: "to waste time", emoji: "⏳" },
    ],
    hint: "Rules help everyone stay safe and get a fair turn.",
    hard: true,
  },
  {
    prompt: "What is a crossing guard's job?",
    right: { label: "help kids cross the street safely", emoji: "🛑" },
    wrong: [
      { label: "fix cars", emoji: "🔧" },
      { label: "sell food", emoji: "🛒" },
    ],
    hint: "A crossing guard holds up a stop sign so cars wait while children cross.",
    hard: true,
  },
  {
    prompt: "What is a student's role at school?",
    right: { label: "learn and try their best", emoji: "📚" },
    wrong: [
      { label: "drive the school bus", emoji: "🚌" },
      { label: "cook lunch for everyone", emoji: "🍲" },
    ],
    hint: "Everyone has a role. A student's job is to learn, listen and try their best.",
    hard: true,
  },
  {
    prompt: "How can you help your community?",
    right: { label: "pick up litter at the park", emoji: "🧤" },
    wrong: [
      { label: "leave garbage on the grass", emoji: "🥤" },
      { label: "be noisy in the library", emoji: "📢" },
    ],
    hint: "Small helpful jobs, like picking up litter, make our community a better place.",
    hard: true,
  },
];

function myCommunity({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return shuffle([sortQuestion(CHOICES_SORT, perBin(difficulty)), ...levelled(COMMUNITY_BANK, 7, difficulty)]);
}

// ---------- Different & Alike ----------

const NEEDS_SORT: SortSet = {
  prompt: "Do we all need it, or can it be different?",
  hint: "We all need the same things to live, like water and love. Our favourite things can be different!",
  bins: [
    { id: "all", label: "everyone needs it", emoji: "🤝" },
    { id: "diff", label: "can be different", emoji: "🌈" },
  ],
  items: [
    { label: "water", emoji: "💧", bin: "all" },
    { label: "a safe home", emoji: "🏠", bin: "all" },
    { label: "love and care", emoji: "❤️", bin: "all" },
    { label: "sleep", emoji: "😴", bin: "all" },
    { label: "healthy food", emoji: "🥕", bin: "all" },
    { label: "clean air", emoji: "🌬️", bin: "all" },
    { label: "favourite colour", emoji: "🎨", bin: "diff" },
    { label: "language we speak", emoji: "💬", bin: "diff" },
    { label: "favourite sport", emoji: "⚽", bin: "diff" },
    { label: "music we like", emoji: "🎵", bin: "diff" },
    { label: "how we celebrate", emoji: "🎉", bin: "diff" },
    { label: "pets we have", emoji: "🐕", bin: "diff" },
  ],
};

const ALIKE_BANK: Item[] = [
  {
    prompt: "Priya lives with her grandma. Is that a family?",
    right: { label: "Yes!", emoji: "❤️" },
    wrong: [{ label: "No", emoji: "❌" }],
    hint: "Families come in many kinds. People who love and care for each other are a family.",
  },
  {
    prompt: "Which is true about families?",
    right: { label: "Families can be big or small", emoji: "👪" },
    wrong: [
      { label: "All families look the same", emoji: "🔁" },
      { label: "A family must have a dog", emoji: "🐕" },
    ],
    hint: "Some families have one parent, two moms, two dads or grandparents. Every family is special.",
  },
  {
    prompt: "Hola, bonjour and ni hao are all ways to say…",
    speak: "Hola, bonjour, and nee how are all ways to say what?",
    right: { label: "hello", emoji: "👋" },
    wrong: [
      { label: "thank you", emoji: "🙏" },
      { label: "good night", emoji: "🌙" },
    ],
    hint: "People in our community speak many languages. These words all mean hello!",
  },
  {
    prompt: "Which is something many celebrations have?",
    right: { label: "food, music and family", emoji: "🎶" },
    wrong: [
      { label: "homework", emoji: "📝" },
      { label: "a spelling test", emoji: "🔤" },
    ],
    hint: "Many celebrations bring people together to share food, music and fun.",
  },
  {
    prompt: "Your friend has a lunch you've never tried. What can you say?",
    right: { label: "“Can you tell me about it?”", emoji: "😊" },
    wrong: [
      { label: "“That's weird!”", emoji: "😒" },
      { label: "“Yuck!”", emoji: "😖" },
    ],
    hint: "Asking kind questions helps us learn about each other.",
  },
  {
    prompt: "How are all people alike?",
    right: { label: "we all need love and care", emoji: "❤️" },
    wrong: [
      { label: "we all have the same name", emoji: "🏷️" },
      { label: "we all like the same food", emoji: "🍕" },
    ],
    hint: "We are all different, but everyone needs love, care, food and a safe home.",
  },
  {
    prompt: "Kenji and Ana speak different languages. Can they be friends?",
    right: { label: "Yes!", emoji: "🤝" },
    wrong: [{ label: "No", emoji: "❌" }],
    hint: "Friends can play, laugh and share, even when they speak different languages.",
  },
  {
    prompt: "Which is a way families celebrate special days?",
    right: { label: "share a meal together", emoji: "🍲" },
    wrong: [
      { label: "brush their teeth", emoji: "🪥" },
      { label: "tie their shoes", emoji: "👟" },
    ],
    hint: "Lots of families celebrate by eating together, singing, dancing or giving gifts.",
  },
  {
    prompt: "What is a tradition?",
    right: { label: "something a family or group does again and again", emoji: "🔁" },
    wrong: [
      { label: "a kind of train", emoji: "🚂" },
      { label: "a brand-new toy", emoji: "🧸" },
    ],
    hint: "A tradition is passed down and done again and again, like a special meal each year.",
    hard: true,
  },
  {
    prompt: "Indigenous peoples have lived on this land for…",
    right: { label: "thousands of years", emoji: "⏳" },
    wrong: [
      { label: "one year", emoji: "📅" },
      { label: "one week", emoji: "🗓️" },
    ],
    hint: "Indigenous peoples were the first people to live on this land, long before anyone else.",
    emoji: "🌲",
    hard: true,
  },
  {
    prompt: "Lena's family speaks two languages at home. That is…",
    right: { label: "a great skill!", emoji: "⭐" },
    wrong: [
      { label: "not allowed", emoji: "🚫" },
      { label: "something to hide", emoji: "🙈" },
    ],
    hint: "Speaking more than one language is a wonderful thing to share.",
    hard: true,
  },
  {
    prompt: "People from many cultures live in our community. That makes it…",
    right: { label: "diverse (full of differences)", emoji: "🌈" },
    wrong: [
      { label: "all the same", emoji: "🔁" },
      { label: "boring", emoji: "😴" },
    ],
    hint: "Diverse means having many different people, languages and traditions.",
    hard: true,
  },
  {
    prompt: "How can we show respect for other cultures?",
    right: { label: "listen and learn about them", emoji: "👂" },
    wrong: [
      { label: "say ours is the only right way", emoji: "☝️" },
      { label: "ignore them", emoji: "🙈" },
    ],
    hint: "Respect means listening, asking kind questions and learning from each other.",
    hard: true,
  },
  {
    prompt: "Why might families celebrate different special days?",
    right: { label: "they have different traditions", emoji: "🎊" },
    wrong: [
      { label: "there is only one special day", emoji: "1️⃣" },
      { label: "special days are only for grown-ups", emoji: "🧑" },
    ],
    hint: "Families have different cultures and traditions, so they celebrate in different ways.",
    hard: true,
  },
];

function differentAndAlike({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return shuffle([sortQuestion(NEEDS_SORT, perBin(difficulty)), ...levelled(ALIKE_BANK, 7, difficulty)]);
}

// ---------- Our Land ----------

const NATURAL_SORT: SortSet = {
  prompt: "Is it natural or made by people? Tap an item, then tap its basket.",
  hint: "Natural things come from nature. People build or make the other things.",
  bins: [
    { id: "natural", label: "natural", emoji: "🌿" },
    { id: "made", label: "made by people", emoji: "🔨" },
  ],
  items: [
    { label: "tree", emoji: "🌳", bin: "natural" },
    { label: "mountain", emoji: "⛰️", bin: "natural" },
    { label: "ocean", emoji: "🌊", bin: "natural" },
    { label: "rock", emoji: "🪨", bin: "natural" },
    { label: "flower", emoji: "🌷", bin: "natural" },
    { label: "forest", emoji: "🌲", bin: "natural" },
    { label: "house", emoji: "🏠", bin: "made" },
    { label: "bridge", emoji: "🌉", bin: "made" },
    { label: "road", emoji: "🛣️", bin: "made" },
    { label: "school", emoji: "🏫", bin: "made" },
    { label: "tall building", emoji: "🏢", bin: "made" },
    { label: "bike", emoji: "🚲", bin: "made" },
  ],
};

const CARE_SORT: SortSet = {
  prompt: "Does it help or harm nature? Tap an item, then tap its basket.",
  hint: "Caring for the land, water and animals keeps our community healthy.",
  bins: [
    { id: "help", label: "helps nature", emoji: "💚" },
    { id: "harm", label: "harms nature", emoji: "💔" },
  ],
  items: [
    { label: "recycle", emoji: "♻️", bin: "help" },
    { label: "pick up litter", emoji: "🧤", bin: "help" },
    { label: "plant a tree", emoji: "🌱", bin: "help" },
    { label: "reuse a bag", emoji: "🛍️", bin: "help" },
    { label: "walk to school", emoji: "🚶", bin: "help" },
    { label: "drop litter", emoji: "🥤", bin: "harm" },
    { label: "leave the tap running", emoji: "🚰", bin: "harm" },
    { label: "leave lights on all day", emoji: "💡", bin: "harm" },
    { label: "pick all the wildflowers", emoji: "🥀", bin: "harm" },
    { label: "break branches off trees", emoji: "🪵", bin: "harm" },
  ],
};

const LAND_BANK: Item[] = [
  {
    prompt: "Which one is natural (not made by people)?",
    right: { label: "mountain", emoji: "⛰️" },
    wrong: [
      { label: "bridge", emoji: "🌉" },
      { label: "house", emoji: "🏠" },
    ],
    hint: "Mountains are part of nature. People build bridges and houses.",
  },
  {
    prompt: "Which one was made by people?",
    right: { label: "road", emoji: "🛣️" },
    wrong: [
      { label: "tree", emoji: "🌳" },
      { label: "lake", emoji: "🌊" },
    ],
    hint: "People build roads so cars, bikes and buses can get around.",
  },
  {
    prompt: "Where should an empty plastic bottle go?",
    right: { label: "recycling bin", emoji: "♻️" },
    wrong: [
      { label: "on the grass", emoji: "🌱" },
      { label: "in the lake", emoji: "🌊" },
    ],
    hint: "Plastic bottles can be recycled into new things!",
  },
  {
    prompt: "Where should a candy wrapper go?",
    right: { label: "garbage can", emoji: "🗑️" },
    wrong: [
      { label: "on the sidewalk", emoji: "🛣️" },
      { label: "in the pond", emoji: "🦆" },
    ],
    hint: "Litter can hurt animals and make places messy. Put it in the garbage.",
  },
  {
    prompt: "Where it snows a lot, what do people need?",
    right: { label: "warm coats and boots", emoji: "🧥" },
    wrong: [
      { label: "sandals", emoji: "👡" },
      { label: "swimsuits", emoji: "🩱" },
    ],
    hint: "The weather where we live changes what we wear.",
    emoji: "❄️",
  },
  {
    prompt: "People cut down some trees to make…",
    right: { label: "wood for houses", emoji: "🪵" },
    wrong: [
      { label: "rocks", emoji: "🪨" },
      { label: "water", emoji: "💧" },
    ],
    hint: "Wood from trees is used to build houses and make paper.",
    emoji: "🌲",
  },
  {
    prompt: "Your town is next to a lake. What can you do there in summer?",
    right: { label: "swim", emoji: "🏊" },
    wrong: [
      { label: "build a snowman", emoji: "⛄" },
      { label: "go sledding", emoji: "🛷" },
    ],
    hint: "The land and water near us change how we play. A lake in summer is great for swimming!",
  },
  {
    prompt: "What does reuse mean?",
    right: { label: "use something again", emoji: "🔁" },
    wrong: [
      { label: "throw it away", emoji: "🗑️" },
      { label: "break it", emoji: "💥" },
    ],
    hint: "Reusing means finding another use for something, like a jar for crayons.",
  },
  {
    prompt: "Why do people build bridges?",
    right: { label: "to cross rivers safely", emoji: "🌉" },
    wrong: [
      { label: "to stop the rain", emoji: "🌧️" },
      { label: "to grow food", emoji: "🌾" },
    ],
    hint: "People change the land to meet their needs. A bridge helps us get over water.",
    hard: true,
  },
  {
    prompt: "What does reduce mean?",
    right: { label: "use less", emoji: "⬇️" },
    wrong: [
      { label: "use more", emoji: "⬆️" },
      { label: "use it once and toss it", emoji: "🗑️" },
    ],
    hint: "Reduce means using less, so there is less garbage.",
    hard: true,
  },
  {
    prompt: "Which one makes less garbage?",
    right: { label: "a reusable lunch box", emoji: "🍱" },
    wrong: [
      { label: "a new plastic bag every day", emoji: "🛍️" },
      { label: "paper plates at every meal", emoji: "🍽️" },
    ],
    hint: "Things you can use again and again make less garbage.",
    hard: true,
  },
  {
    prompt: "Why should we leave wildflowers growing?",
    right: { label: "bees and other animals need them", emoji: "🐝" },
    wrong: [
      { label: "flowers are too heavy to pick", emoji: "🏋️" },
      { label: "flowers grow back in one minute", emoji: "⏱️" },
    ],
    hint: "Bees and butterflies drink from flowers. Leaving them helps nature.",
    emoji: "🌼",
    hard: true,
  },
  {
    prompt: "What can old paper be recycled into?",
    right: { label: "new paper", emoji: "📄" },
    wrong: [
      { label: "apples", emoji: "🍎" },
      { label: "rocks", emoji: "🪨" },
    ],
    hint: "Old paper is mashed up and made into new paper. That's recycling!",
    emoji: "♻️",
    hard: true,
  },
  {
    prompt: "How does the land help us live?",
    right: { label: "it gives us food, water and wood", emoji: "🌾" },
    wrong: [
      { label: "it gives us nothing", emoji: "🚫" },
      { label: "it only gives us toys", emoji: "🧸" },
    ],
    hint: "We get food, water and building materials from the land, so we take care of it.",
    hard: true,
  },
  {
    prompt: "How did people change the land to grow food?",
    right: { label: "they made farms", emoji: "🚜" },
    wrong: [
      { label: "they made it snow", emoji: "❄️" },
      { label: "they built bridges", emoji: "🌉" },
    ],
    hint: "People cleared land and planted fields to make farms.",
    hard: true,
  },
];

function ourLand({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return shuffle([
    sortQuestion(NATURAL_SORT, perBin(difficulty)),
    sortQuestion(CARE_SORT, perBin(difficulty)),
    ...levelled(LAND_BANK, 6, difficulty),
  ]);
}

// ---------- Maps ----------

interface Place {
  label: string;
  emoji: string;
}

const PLACES: Place[] = [
  { label: "school", emoji: "🏫" },
  { label: "store", emoji: "🏪" },
  { label: "hospital", emoji: "🏥" },
  { label: "park", emoji: "🌳" },
  { label: "library", emoji: "📚" },
  { label: "fire hall", emoji: "🚒" },
  { label: "pool", emoji: "🏊" },
];

type Dir = "north" | "east" | "south" | "west";

const DIRECTIONS: Record<Dir, { arrow: string; side: string; where: string }> = {
  north: { arrow: "⬆️", side: "at the top", where: "just above" },
  south: { arrow: "⬇️", side: "at the bottom", where: "just below" },
  east: { arrow: "➡️", side: "on the right", where: "just right of" },
  west: { arrow: "⬅️", side: "on the left", where: "just left of" },
};

const ALL_DIRS: Dir[] = ["north", "east", "south", "west"];

/** A tiny town map: the house in the middle, a place on each side, north at the top. */
function townMap() {
  const [n, e, s, w] = sample(PLACES, 4);
  const at: Record<Dir, Place> = { north: n, east: e, south: s, west: w };
  return {
    at,
    visual: {
      type: "story" as const,
      lines: ["⬆️ North is up", `🟩 ${n.emoji} 🟩`, `${w.emoji} 🏠 ${e.emoji}`, `🟩 ${s.emoji} 🟩`],
    },
  };
}

/** "What is north of the house?" */
function whatIsThere(difficulty: Level): Question {
  const { at, visual } = townMap();
  const dir = pick<Dir>(difficulty === 1 ? ["north", "south"] : ALL_DIRS);
  const others = sample(
    ALL_DIRS.filter((d) => d !== dir),
    2,
  ).map((d) => at[d]);
  const { side, where } = DIRECTIONS[dir];
  const hint = `On this map, ${dir} is ${side}. Look ${where} the house.`;
  return textChoice(`Look at the map. What is ${dir} of the house?`, at[dir], others, hint, visual);
}

/** "Which way is the school from the house?" */
function whichWay(): Question {
  const { at, visual } = townMap();
  const dir = pick(ALL_DIRS);
  const wrong = sample(
    ALL_DIRS.filter((d) => d !== dir),
    2,
  ).map((d) => ({ label: d, emoji: DIRECTIONS[d].arrow }));
  return textChoice(
    `Look at the map. Which way is the ${at[dir].label} from the house?`,
    { label: dir, emoji: DIRECTIONS[dir].arrow },
    wrong,
    `The ${at[dir].label} is ${DIRECTIONS[dir].where} the house. On this map, that is ${dir}.`,
    visual,
  );
}

const THINGS: Place[] = [
  { label: "apple", emoji: "🍎" },
  { label: "ball", emoji: "⚽" },
  { label: "dog", emoji: "🐕" },
  { label: "tree", emoji: "🌳" },
  { label: "bike", emoji: "🚲" },
  { label: "teddy bear", emoji: "🧸" },
  { label: "cat", emoji: "🐈" },
  { label: "kite", emoji: "🪁" },
];

/** Near and far along a path that starts at the child. */
function nearFar(difficulty: Level): Question {
  const askNear = chance(0.5);
  const nearHint = "Near means close by. Look for the one right next to the child.";
  const farHint = "Far means a long way away. Look for the one at the other end of the path.";
  if (difficulty === 1) {
    const [a, b] = sample(THINGS, 2);
    return textChoice(
      askNear ? "Which one is near the child?" : "Which one is far from the child?",
      askNear ? a : b,
      [askNear ? b : a],
      askNear ? nearHint : farHint,
      { type: "emojiRow", items: ["🧒", a.emoji, "➖", "➖", "➖", b.emoji] },
    );
  }
  const [a, b, c] = sample(THINGS, 3);
  return textChoice(
    askNear ? "Which one is nearest to the child?" : "Which one is farthest from the child?",
    askNear ? a : c,
    askNear ? [b, c] : [a, b],
    askNear ? nearHint : farHint,
    { type: "emojiRow", items: ["🧒", a.emoji, "➖", b.emoji, "➖", "➖", c.emoji] },
  );
}

const MAP_BANK: Item[] = [
  {
    prompt: "What does a map show?",
    right: { label: "where places are", emoji: "📍" },
    wrong: [
      { label: "what time it is", emoji: "⏰" },
      { label: "what we ate for lunch", emoji: "🥪" },
    ],
    hint: "A map is a drawing that shows where things are.",
    emoji: "🗺️",
  },
  {
    prompt: "Which tool helps you find north?",
    right: { label: "compass", emoji: "🧭" },
    wrong: [
      { label: "clock", emoji: "⏰" },
      { label: "ruler", emoji: "📏" },
    ],
    hint: "A compass needle always points north.",
  },
  {
    prompt: "On most maps, north is at the…",
    right: { label: "top", emoji: "⬆️" },
    wrong: [
      { label: "bottom", emoji: "⬇️" },
      { label: "left side", emoji: "⬅️" },
    ],
    hint: "Most maps put north at the top, so south is at the bottom.",
    emoji: "🗺️",
  },
  {
    prompt: "On most maps, what colour shows water?",
    right: { label: "blue", emoji: "🔵" },
    wrong: [
      { label: "red", emoji: "🔴" },
      { label: "yellow", emoji: "🟡" },
    ],
    hint: "Lakes, rivers and oceans are usually coloured blue on a map.",
  },
  {
    prompt: "A map shows a place as if you were…",
    right: { label: "a bird looking down", emoji: "🐦" },
    wrong: [
      { label: "a fish looking up", emoji: "🐟" },
      { label: "a worm underground", emoji: "🪱" },
    ],
    hint: "Maps show places from above, like a bird flying over.",
  },
  {
    prompt: "On a map, a little tree symbol often means…",
    right: { label: "a park or forest", emoji: "🌲" },
    wrong: [
      { label: "a swimming pool", emoji: "🏊" },
      { label: "a hospital", emoji: "🏥" },
    ],
    hint: "Map symbols are small pictures. A tree stands for a park or forest.",
    emoji: "🌳",
  },
  {
    prompt: "A map of your classroom would show…",
    right: { label: "desks, doors and windows", emoji: "🪑" },
    wrong: [
      { label: "the planets", emoji: "🪐" },
      { label: "the ocean", emoji: "🌊" },
    ],
    hint: "A classroom map shows what is in the room and where it is.",
  },
  {
    prompt: "What tells you what the symbols on a map mean?",
    right: { label: "the legend (or key)", emoji: "🔑" },
    wrong: [
      { label: "the title", emoji: "🏷️" },
      { label: "the colours", emoji: "🎨" },
    ],
    hint: "The legend, or key, is a little box that tells what each symbol means.",
    emoji: "🗺️",
    hard: true,
  },
  {
    prompt: "What is the opposite of north?",
    right: { label: "south", emoji: "⬇️" },
    wrong: [
      { label: "east", emoji: "➡️" },
      { label: "west", emoji: "⬅️" },
    ],
    hint: "North and south are opposites. East and west are opposites too.",
    emoji: "🧭",
    hard: true,
  },
  {
    prompt: "What is the opposite of east?",
    right: { label: "west", emoji: "⬅️" },
    wrong: [
      { label: "north", emoji: "⬆️" },
      { label: "south", emoji: "⬇️" },
    ],
    hint: "East and west are opposites. North and south are opposites too.",
    emoji: "🧭",
    hard: true,
  },
  {
    prompt: "The sun comes up in the…",
    right: { label: "east", emoji: "🌅" },
    wrong: [
      { label: "west", emoji: "🌇" },
      { label: "north", emoji: "⬆️" },
    ],
    hint: "Each morning the sun rises in the east. In the evening it sets in the west.",
    hard: true,
  },
  {
    prompt: "What do N, S, E and W on a compass mean?",
    right: { label: "north, south, east, west", emoji: "🧭" },
    wrong: [
      { label: "near, small, easy, wide", emoji: "🔤" },
      { label: "nose, smile, ears, wave", emoji: "😊" },
    ],
    hint: "Each letter is the first letter of a direction.",
    hard: true,
  },
  {
    prompt: "What do we call a round model of the whole Earth?",
    right: { label: "globe", emoji: "🌍" },
    wrong: [
      { label: "compass", emoji: "🧭" },
      { label: "ruler", emoji: "📏" },
    ],
    hint: "A globe is shaped like a ball, just like Earth.",
    hard: true,
  },
];

function maps({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const mapQuestions =
    difficulty === 1
      ? [whatIsThere(1), whatIsThere(1)]
      : difficulty === 2
        ? [whatIsThere(2), whatIsThere(2), whichWay()]
        : [whatIsThere(3), whichWay(), whichWay()];
  const bankCount = 8 - mapQuestions.length - 1;
  return shuffle([...mapQuestions, nearFar(difficulty), ...levelled(MAP_BANK, bankCount, difficulty)]);
}

export const course: Course = {
  grade: "1",
  subject: "social",
  bigIdeas: {
    "ca-bc": [
      "We shape the local environment, and the local environment shapes who we are and how we live.",
      "Our communities are diverse and made of individuals who have a lot in common.",
      "Healthy communities recognize and respect the diversity of individuals and care for the local environment.",
    ],
  },
  units: [
    {
      id: "my-community",
      title: "My Community",
      emoji: "🏘️",
      blurb: "Places, helpers and good choices",
      standards: { "ca-bc": "Rights, roles, and responsibilities in the local community" },
      parentNote:
        "Community helpers and places, plus rights, rules, roles and responsibilities at home, at school and in the community.",
      generate: myCommunity,
    },
    {
      id: "different-and-alike",
      title: "Different & Alike",
      emoji: "🤗",
      blurb: "Families, cultures and celebrations",
      standards: {
        "ca-bc":
          "Characteristics that make one's family and community unique; diverse cultures and traditions in the community",
      },
      parentNote:
        "How families, languages, cultures and celebrations differ, what we all share, and how to show respect for each other.",
      generate: differentAndAlike,
    },
    {
      id: "our-land",
      title: "Our Land",
      emoji: "🏞️",
      blurb: "Nature, buildings and caring",
      standards: {
        "ca-bc":
          "Natural and human-made features of the local environment; relationships between people and the environment; how the local environment shapes how people live",
      },
      parentNote:
        "Natural and human-made features, how the land shapes how we live, and caring for it by reducing, reusing and recycling.",
      generate: ourLand,
    },
    {
      id: "maps",
      title: "Maps",
      emoji: "🗺️",
      blurb: "Symbols, directions, near and far",
      standards: { "ca-bc": "Maps and directions: simple maps, symbols, near and far" },
      parentNote:
        "Reading a simple map with north at the top, using north, south, east and west, map symbols and legends, and near and far.",
      generate: maps,
    },
  ],
};
