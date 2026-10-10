import { pick, sample, shuffle, textChoice } from "../../random";
import type { Choice, Course, GenerateOptions, Question, Visual } from "../../types";
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

// ---------- Maps & Globes ----------

type Place = { name: string; emoji: string };
type Dir = "north" | "south" | "east" | "west";

const PLACES: Place[] = [
  { name: "school", emoji: "🏫" },
  { name: "park", emoji: "🌳" },
  { name: "library", emoji: "📚" },
  { name: "store", emoji: "🏪" },
  { name: "pool", emoji: "🏊" },
  { name: "hospital", emoji: "🏥" },
  { name: "fire hall", emoji: "🚒" },
  { name: "bakery", emoji: "🥐" },
  { name: "farm", emoji: "🚜" },
  { name: "museum", emoji: "🏛️" },
  { name: "post office", emoji: "🏤" },
  { name: "community garden", emoji: "🥕" },
  { name: "bus station", emoji: "🚌" },
  { name: "soccer field", emoji: "⚽" },
  { name: "arena", emoji: "🏒" },
];

const STEP: Record<Dir, [number, number]> = { north: [-1, 0], south: [1, 0], east: [0, 1], west: [0, -1] };
const DIRS: Dir[] = ["north", "south", "east", "west"];
const MAP_HINT = "North is at the top of the map, south is at the bottom, east is on the right and west is on the left.";

/** A 3 × 3 town map drawn as a table, with north at the top. */
function townMap() {
  const places = sample(PLACES, 9);
  const at = (r: number, c: number): Place | undefined =>
    r >= 0 && r < 3 && c >= 0 && c < 3 ? places[r * 3 + c] : undefined;
  const move = (r: number, c: number, d: Dir): [number, number] => [r + STEP[d][0], c + STEP[d][1]];
  const visual: Visual = {
    type: "table",
    title: "Map of Maple Town (north is at the top)",
    headers: ["", "West", "Middle", "East"],
    rows: ["North", "Middle", "South"].map((rowName, r) => [
      rowName,
      ...[0, 1, 2].map((c) => `${places[r * 3 + c].emoji} ${places[r * 3 + c].name}`),
    ]),
  };
  return { places, at, move, visual };
}

const asChoice = (p: Place): Omit<Choice, "id"> => ({ label: p.name, emoji: p.emoji });

/** "What is one block north of the library?" */
function neighbourQuestion(dirs: Dir[]): Question {
  const { places, at, move, visual } = townMap();
  const options: [number, number, Dir][] = [];
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++)
      for (const d of dirs) if (at(...move(r, c, d))) options.push([r, c, d]);
  const [r, c, d] = pick(options);
  const start = at(r, c)!;
  const answer = at(...move(r, c, d))!;
  const otherNeighbours = DIRS.filter((x) => x !== d)
    .map((x) => at(...move(r, c, x)))
    .filter((p): p is Place => !!p);
  const rest = places.filter((p) => p !== start && p !== answer && !otherNeighbours.includes(p));
  const wrong = [...shuffle(otherNeighbours), ...shuffle(rest)].slice(0, 3);
  return textChoice(
    `Look at the map. What is one block ${d} of the ${start.name}?`,
    asChoice(answer),
    wrong.map(asChoice),
    `Find the ${start.name} first. Then move one square ${d}. ${MAP_HINT}`,
    visual,
  );
}

/** "Which way would you walk from the pool to the farm?" */
function directionQuestion(): Question {
  const { at, move, visual } = townMap();
  const options: [number, number, Dir, number][] = [];
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++)
      for (const d of DIRS)
        for (const n of [1, 2]) {
          let [rr, cc] = [r, c];
          for (let i = 0; i < n; i++) [rr, cc] = move(rr, cc, d);
          if (at(rr, cc)) options.push([r, c, d, n]);
        }
  const [r, c, d, n] = pick(options);
  let [rr, cc] = [r, c];
  for (let i = 0; i < n; i++) [rr, cc] = move(rr, cc, d);
  const from = at(r, c)!;
  const to = at(rr, cc)!;
  return textChoice(
    `Look at the map. Which way would you walk to get from the ${from.name} to the ${to.name}?`,
    d,
    DIRS.filter((x) => x !== d),
    `Put your finger on the ${from.name} and slide it to the ${to.name}. ${MAP_HINT}`,
    visual,
  );
}

/** "Start at the school. Walk 1 block east, then 1 block south. Where are you?" */
function twoStepQuestion(): Question {
  const { places, at, move, visual } = townMap();
  const options: [number, number, Dir, Dir][] = [];
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++)
      for (const a of ["north", "south"] as Dir[])
        for (const b of ["east", "west"] as Dir[]) {
          const mid = move(r, c, a);
          if (at(...mid) && at(...move(mid[0], mid[1], b))) {
            options.push([r, c, a, b]);
            options.push([r, c, b, a]);
          }
        }
  const [r, c, a, b] = pick(options);
  const start = at(r, c)!;
  const mid = move(r, c, a);
  const answer = at(...move(mid[0], mid[1], b))!;
  const traps = [at(...mid)!, at(...move(r, c, b))!, start];
  const rest = places.filter((p) => p !== answer && !traps.includes(p));
  const wrong = [...shuffle(traps), ...shuffle(rest)].slice(0, 3);
  return textChoice(
    `Start at the ${start.name}. Walk 1 block ${a}, then 1 block ${b}. Where are you?`,
    asChoice(answer),
    wrong.map(asChoice),
    `Move one step at a time: first ${a}, then ${b}. ${MAP_HINT}`,
    visual,
  );
}

function mapQuestions(difficulty: Level): Question[] {
  if (difficulty === 1) return [neighbourQuestion(["north", "south"]), neighbourQuestion(["east", "west"])];
  if (difficulty === 2) return [neighbourQuestion(DIRS), directionQuestion()];
  return [directionQuestion(), twoStepQuestion()];
}

const CONTINENT_OCEAN_SORT: SortSet = {
  prompt: "Is it a continent or an ocean? Tap an item, then tap its basket.",
  hint: "Continents are the 7 huge areas of land. Oceans are the 5 huge bodies of salt water between them.",
  bins: [
    { id: "land", label: "continent", emoji: "🌍" },
    { id: "ocean", label: "ocean", emoji: "🌊" },
  ],
  items: [
    { label: "Africa", emoji: "📍", bin: "land" },
    { label: "Asia", emoji: "📍", bin: "land" },
    { label: "Europe", emoji: "📍", bin: "land" },
    { label: "North America", emoji: "📍", bin: "land" },
    { label: "South America", emoji: "📍", bin: "land" },
    { label: "Antarctica", emoji: "📍", bin: "land" },
    { label: "Australia", emoji: "📍", bin: "land" },
    { label: "Pacific", emoji: "📍", bin: "ocean" },
    { label: "Atlantic", emoji: "📍", bin: "ocean" },
    { label: "Indian", emoji: "📍", bin: "ocean" },
    { label: "Arctic", emoji: "📍", bin: "ocean" },
    { label: "Southern", emoji: "📍", bin: "ocean" },
  ],
};

const MAP_BANK: Item[] = [
  {
    prompt: "How many continents are there on Earth?",
    right: "7",
    wrong: ["5", "3", "12"],
    hint: "Africa, Antarctica, Asia, Australia, Europe, North America and South America. Count them!",
    emoji: "🌍",
  },
  {
    prompt: "Canada is on which continent?",
    right: "North America",
    wrong: ["South America", "Europe", "Asia"],
    hint: "Canada, the United States and Mexico are all in North America.",
    emoji: "🌎",
  },
  {
    prompt: "What is the biggest ocean on Earth?",
    right: "the Pacific Ocean",
    wrong: ["the Atlantic Ocean", "the Arctic Ocean", "the Indian Ocean"],
    hint: "The Pacific Ocean is so big that all the continents could fit inside it.",
    emoji: "🌊",
  },
  {
    prompt: "What does a map legend (also called a key) show?",
    right: "what the symbols on the map mean",
    wrong: ["the name of the person who drew it", "how old the map is"],
    hint: "A legend explains the map's symbols, like a tree for a park or a blue line for a river.",
    emoji: "🗺️",
  },
  {
    prompt: "What does a compass rose show on a map?",
    right: "the directions north, south, east and west",
    wrong: ["where roses grow", "how far apart places are"],
    hint: "A compass rose points the way. N is north, S is south, E is east and W is west.",
    emoji: "🧭",
  },
  {
    prompt: "On most maps, north is at the…",
    right: "top",
    wrong: ["bottom", "left side"],
    hint: "Most maps put north at the top. Check the compass rose to be sure.",
    emoji: "🧭",
  },
  {
    prompt: "In the morning, the sun rises in the…",
    right: "east",
    wrong: ["west", "north"],
    hint: "The sun rises in the east and sets in the west.",
    emoji: "🌅",
  },
  {
    prompt: "Which direction is the opposite of north?",
    right: "south",
    wrong: ["east", "west"],
    hint: "North and south are opposites. East and west are opposites too.",
    emoji: "🧭",
  },
  {
    prompt: "What is a globe?",
    right: "a round model of Earth",
    wrong: ["a flat drawing of one town", "a picture of the moon"],
    hint: "Earth is shaped like a ball, so a globe is a ball-shaped map of the whole world.",
    emoji: "🌍",
  },
  {
    prompt: "Which continent is the coldest and is almost all covered in ice?",
    right: "Antarctica",
    wrong: ["Africa", "Australia"],
    hint: "Antarctica is at the South Pole. Penguins live there, and scientists visit to do research.",
    emoji: "🐧",
  },
  {
    prompt: "Which ocean is on the west coast of Canada?",
    right: "the Pacific Ocean",
    wrong: ["the Atlantic Ocean", "the Indian Ocean"],
    hint: "West is on the left side of a map of Canada. The Pacific Ocean is there.",
    emoji: "🌊",
  },
  {
    prompt: "Most of Earth's surface is covered by…",
    right: "water",
    wrong: ["sand", "forests"],
    hint: "Look at a globe: there's more blue than any other colour! Oceans cover most of Earth.",
    emoji: "🌏",
  },
  {
    prompt: "Which continent is the largest?",
    right: "Asia",
    wrong: ["Africa", "Europe", "Antarctica"],
    hint: "Asia is the biggest continent, and more people live there than anywhere else.",
    emoji: "🌏",
    hard: true,
  },
  {
    prompt: "Which ocean is on the east coast of Canada?",
    right: "the Atlantic Ocean",
    wrong: ["the Pacific Ocean", "the Indian Ocean"],
    hint: "East is on the right side of the map. The Atlantic Ocean is between Canada and Europe.",
    emoji: "🌊",
    hard: true,
  },
  {
    prompt: "Which ocean is north of Canada?",
    right: "the Arctic Ocean",
    wrong: ["the Southern Ocean", "the Indian Ocean"],
    hint: "The Arctic Ocean is around the North Pole, at the top of the globe.",
    emoji: "🧊",
    hard: true,
  },
  {
    prompt: "The equator is an imaginary line that…",
    right: "circles the middle of Earth",
    wrong: ["goes from the North Pole to the South Pole", "goes around the moon"],
    hint: "The equator is halfway between the North Pole and the South Pole. Places near it are usually hot.",
    emoji: "🌍",
    hard: true,
  },
  {
    prompt: "What does a map scale help you find?",
    right: "the real distance between places",
    wrong: ["the colour of the land", "what time it is"],
    hint: "A scale might say 1 cm on the map = 1 km in real life.",
    emoji: "📏",
    hard: true,
  },
  {
    prompt: "Which continent is also a country?",
    right: "Australia",
    wrong: ["Africa", "Europe"],
    hint: "Australia is a country that covers a whole continent. Africa and Europe have many countries.",
    emoji: "🌏",
    hard: true,
  },
  {
    prompt: "In the evening, Ravi watches the sun set. Which direction is he facing?",
    right: "west",
    wrong: ["east", "north", "south"],
    hint: "The sun rises in the east and sets in the west.",
    emoji: "🌇",
    hard: true,
  },
  {
    prompt: "Which is the smallest of the five oceans?",
    right: "the Arctic Ocean",
    wrong: ["the Pacific Ocean", "the Atlantic Ocean"],
    hint: "The Arctic Ocean is the smallest. It is around the North Pole and often covered in ice.",
    emoji: "🧊",
    hard: true,
  },
];

function maps({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return shuffle([
    ...mapQuestions(difficulty),
    sortQuestion(CONTINENT_OCEAN_SORT, perBin(difficulty)),
    ...levelled(MAP_BANK, 5, difficulty),
  ]);
}

// ---------- Meeting Needs Around the World ----------

const CLOTHES_SORT: SortSet = {
  prompt: "Would you need it more in a hot place or a cold place?",
  hint: "People choose clothes that suit the weather where they live.",
  bins: [
    { id: "hot", label: "hot, sunny place", emoji: "☀️" },
    { id: "cold", label: "cold, snowy place", emoji: "❄️" },
  ],
  items: [
    { label: "sun hat", emoji: "👒", bin: "hot" },
    { label: "sandals", emoji: "🩴", bin: "hot" },
    { label: "shorts", emoji: "🩳", bin: "hot" },
    { label: "sunscreen", emoji: "🧴", bin: "hot" },
    { label: "warm parka", emoji: "🧥", bin: "cold" },
    { label: "mittens", emoji: "🧤", bin: "cold" },
    { label: "scarf", emoji: "🧣", bin: "cold" },
    { label: "winter boots", emoji: "🥾", bin: "cold" },
  ],
};

const HOMES = [
  { place: "mountain town", emoji: "🏔️", weather: "lots of heavy snow", home: "a steep roof so snow slides off" },
  { place: "desert town", emoji: "🏜️", weather: "very hot, dry days", home: "thick walls that keep the inside cool" },
  { place: "river town", emoji: "🌧️", weather: "floods in the rainy season", home: "a house raised up on stilts" },
  { place: "Arctic town", emoji: "❄️", weather: "long, very cold winters", home: "lots of insulation to keep heat in" },
  { place: "rainforest town", emoji: "🌴", weather: "hot and rainy all year", home: "open windows and a wide roof for shade and rain" },
];

/** Read a table of places and their weather, then match a home that suits it. */
function homesQuestion(difficulty: Level): Question {
  const rows = sample(HOMES, difficulty === 1 ? 3 : 4);
  const target = pick(rows);
  return textChoice(
    `Look at the table. Which home would suit the ${target.place} best?`,
    target.home,
    rows.filter((r) => r !== target).map((r) => r.home),
    `The ${target.place} has ${target.weather}. Pick the home that helps with that kind of weather.`,
    {
      type: "table",
      title: "Weather in different places",
      headers: ["Place", "Weather"],
      rows: rows.map((r) => [`${r.emoji} ${r.place}`, r.weather]),
    },
  );
}

const NEEDS_BANK: Item[] = [
  {
    prompt: "Which are basic needs for every person in the world?",
    right: "food, water, shelter and clothing",
    wrong: ["toys, games and phones", "candy, bikes and TV"],
    hint: "Basic needs are things everyone must have to live and stay healthy, wherever they live.",
    emoji: "🌍",
  },
  {
    prompt: "Why do many homes in snowy places have steep roofs?",
    right: "so heavy snow slides off",
    wrong: ["so birds can land on them", "so the house looks taller"],
    hint: "Snow is heavy! A steep roof lets it slide off instead of piling up.",
    emoji: "🏔️",
  },
  {
    prompt: "Why are some homes built up high on stilts?",
    right: "to stay dry in places that flood",
    wrong: ["to get closer to the clouds", "to make the house easier to paint"],
    hint: "In places near rivers or the sea that sometimes flood, stilts keep the house above the water.",
    emoji: "🌊",
  },
  {
    prompt: "Families in a community beside the ocean might get food by…",
    right: { label: "fishing", emoji: "🎣" },
    wrong: [
      { label: "herding camels", emoji: "🐪" },
      { label: "picking cactus fruit", emoji: "🌵" },
    ],
    hint: "People use what is nearby. The ocean is full of fish and seafood.",
  },
  {
    prompt: "Why do many towns and cities grow beside rivers?",
    right: "rivers give water for drinking, farming and travel",
    wrong: ["rivers keep all the rain away", "rivers make the land hotter"],
    hint: "Water is a basic need. Rivers also help people grow food and move from place to place.",
    emoji: "🏞️",
  },
  {
    prompt: "In a hot, sunny place, what helps people stay cool?",
    right: "light, loose clothes and shade",
    wrong: ["thick wool coats", "fur-lined boots"],
    hint: "Light, loose clothes let air move and keep the sun off your skin.",
    emoji: "☀️",
  },
  {
    prompt: "People often build homes with materials from nearby. In a big forest, homes are often made of…",
    right: { label: "wood", emoji: "🪵" },
    wrong: [
      { label: "seashells", emoji: "🐚" },
      { label: "blocks of ice", emoji: "🧊" },
    ],
    hint: "Forests have lots of trees, and trees give us wood for building.",
  },
  {
    prompt: "Rice grows best in places that are…",
    right: "warm and wet",
    wrong: ["cold and icy", "dry and sandy"],
    hint: "Rice plants need lots of water and warm weather. Many rice fields are flooded with water.",
    emoji: "🌾",
  },
  {
    prompt: "How are people all over the world the same?",
    right: "everyone needs food, water and a safe home",
    wrong: ["everyone eats the same food", "everyone lives in the same kind of house"],
    hint: "People meet their needs in different ways, but the needs themselves are the same everywhere.",
    emoji: "🤝",
  },
  {
    prompt: "Why is clean water important everywhere?",
    right: "people need it to drink, cook and stay healthy",
    wrong: ["it is only used for swimming", "it is only for washing cars"],
    hint: "Clean water is a basic need for every person on Earth.",
    emoji: "💧",
  },
  {
    prompt: "Which of these uses the land to meet a basic need?",
    right: { label: "growing vegetables on a farm", emoji: "🥕" },
    wrong: [
      { label: "watching a movie", emoji: "🎬" },
      { label: "playing a video game", emoji: "🎮" },
    ],
    hint: "Farms use soil, water and sunlight from the land to grow food.",
  },
  {
    prompt: "People in a dry place with very little rain might get water from…",
    right: "a deep well under the ground",
    wrong: ["a frozen lake", "a glacier on the roof"],
    hint: "Even in dry places, water can be stored deep under the ground. A well lets people reach it.",
    emoji: "🏜️",
    hard: true,
  },
  {
    prompt: "Homes with thick mud-brick walls are common in some hot, dry places. Why?",
    right: "thick walls keep the inside cool during the hot day",
    wrong: ["mud bricks are colder than ice", "thick walls let in more sunlight"],
    hint: "Thick walls slow down the heat, so the inside stays cooler than outside.",
    emoji: "🧱",
    hard: true,
  },
  {
    prompt: "Why is it important to take care of the land?",
    right: "so it can keep giving us food, water and materials in the future",
    wrong: ["so the land never changes", "so no one can ever use it"],
    hint: "We depend on the land. Caring for it means it can meet our needs, and the needs of people after us.",
    emoji: "🌱",
    hard: true,
  },
  {
    prompt: "In the far north, summers are short and very little food can be grown. How do many families get food?",
    right: "hunting, fishing and buying food at the store",
    wrong: ["growing bananas outside", "picking oranges all winter"],
    hint: "Families use food from the land and sea, like fish and caribou, and also buy food at local stores.",
    emoji: "❄️",
    hard: true,
  },
  {
    prompt: "A family moves from a hot place to a cold place. What will they need?",
    right: "warmer clothes and a heated home",
    wrong: ["fewer clothes", "a home with no walls"],
    hint: "In a cold place, people need clothing and homes that keep the heat in.",
    emoji: "🧥",
    hard: true,
  },
  {
    prompt: "Trading helps people meet their needs when…",
    right: "they can't grow or make something where they live",
    wrong: ["they already have everything", "it is a sunny day"],
    hint: "When a place can't grow bananas, people can trade for them with places that can.",
    emoji: "🍌",
    hard: true,
  },
  {
    prompt: "Which is a natural resource from the land?",
    right: { label: "trees for wood", emoji: "🌲" },
    wrong: [
      { label: "a video game", emoji: "🎮" },
      { label: "a plastic toy", emoji: "🧸" },
    ],
    hint: "Natural resources come from nature, like trees, water, soil and fish.",
    hard: true,
  },
  {
    prompt: "How do the land and weather of a place affect the way people live?",
    right: "they shape the homes, food and clothes people use",
    wrong: ["they don't affect people at all", "they only change people's names"],
    hint: "People use what the land gives them and build homes and wear clothes that suit the weather.",
    emoji: "🏡",
    hard: true,
  },
];

function meetingNeeds({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return shuffle([
    sortQuestion(CLOTHES_SORT, perBin(difficulty)),
    homesQuestion(difficulty),
    ...levelled(NEEDS_BANK, 6, difficulty),
  ]);
}

// ---------- Cultures of the World ----------

const GREETINGS: [string, string][] = [
  ["Bonjour", "French"],
  ["Hola", "Spanish"],
  ["Ni hao", "Mandarin Chinese"],
  ["Namaste", "Hindi"],
  ["Konnichiwa", "Japanese"],
  ["Jambo", "Swahili"],
  ["Kumusta", "Tagalog"],
  ["Guten Tag", "German"],
];

function greetingQuestion(difficulty: Level): Question {
  const [[word, language], ...others] = sample(GREETINGS, difficulty === 1 ? 3 : 4);
  return textChoice(
    `“${word}” is a way to say hello in which language?`,
    language,
    others.map(([, l]) => l),
    `People who speak ${language} often say “${word}” to say hello. Learning a greeting is a friendly way to show respect.`,
    { type: "emoji", emoji: "👋", caption: word },
  );
}

const RIGHTS_SORT: SortSet = {
  prompt: "Is it a right or a responsibility? Tap an item, then tap its basket.",
  hint: "A right is something every child should have. A responsibility is something we should do to help others and our world.",
  bins: [
    { id: "right", label: "a right", emoji: "📜" },
    { id: "resp", label: "a responsibility", emoji: "🤝" },
  ],
  items: [
    { label: "to go to school", emoji: "🏫", bin: "right" },
    { label: "to be safe", emoji: "🏡", bin: "right" },
    { label: "to have clean water", emoji: "💧", bin: "right" },
    { label: "to play and rest", emoji: "⚽", bin: "right" },
    { label: "to share your ideas", emoji: "🗣️", bin: "right" },
    { label: "treat others kindly", emoji: "💛", bin: "resp" },
    { label: "take care of the Earth", emoji: "🌍", bin: "resp" },
    { label: "listen when others speak", emoji: "👂", bin: "resp" },
    { label: "include others in games", emoji: "🧑‍🤝‍🧑", bin: "resp" },
    { label: "reduce, reuse and recycle", emoji: "♻️", bin: "resp" },
  ],
};

const CULTURE_BANK: Item[] = [
  {
    prompt: "What is culture?",
    right: "the way of life of a group of people",
    wrong: ["a type of weather", "the name of a city"],
    hint: "Culture includes a group's language, food, clothing, music, stories and celebrations.",
    emoji: "🌍",
  },
  {
    prompt: "Which of these is part of a culture?",
    right: "its language, food, music and celebrations",
    wrong: ["the number of clouds in the sky", "the height of a mountain"],
    hint: "Culture is about how people live: what they say, eat, make, sing and celebrate.",
    emoji: "🎶",
  },
  {
    prompt: "People all over the world share some things in common. Which is one?",
    right: "families who care for each other",
    wrong: ["everyone speaks the same language", "everyone eats the same breakfast"],
    hint: "Families, friends, learning, food and celebrations are part of life everywhere, even if they look different.",
    emoji: "👨‍👩‍👧",
  },
  {
    prompt: "A classmate brings a lunch you have never seen before. What is a respectful thing to do?",
    right: "ask about it with kindness and curiosity",
    wrong: ["say it looks yucky", "laugh at it with friends"],
    hint: "Being curious and kind helps everyone feel welcome.",
    emoji: "🍱",
  },
  {
    prompt: "Many cultures celebrate the start of a new year in different ways. What does this show?",
    right: "different cultures share some of the same experiences",
    wrong: ["every culture celebrates on the same day", "only one culture has a new year"],
    hint: "Celebrations can look different, but many cultures celebrate the same kinds of events.",
    emoji: "🎉",
  },
  {
    prompt: "What is a global citizen?",
    right: "someone who cares about people and places all over the world",
    wrong: ["someone who has visited every country", "someone who lives in outer space"],
    hint: "You don't have to travel to be a global citizen. You just have to care about the whole world.",
    emoji: "🌏",
  },
  {
    prompt: "Which is a right that every child should have?",
    right: "to go to school and learn",
    wrong: ["to never do chores", "to eat dessert first"],
    hint: "Every child has the right to learn, to be safe, and to have food and clean water.",
    emoji: "🏫",
  },
  {
    prompt: "Which is a responsibility of a global citizen?",
    right: "taking care of the Earth",
    wrong: ["wasting water", "leaving out people who are different"],
    hint: "Global citizens help people and protect the planet we all share.",
    emoji: "🌍",
  },
  {
    prompt: "Which sport is played by kids in almost every country in the world?",
    right: { label: "soccer", emoji: "⚽" },
    wrong: [
      { label: "curling", emoji: "🥌" },
      { label: "ice hockey", emoji: "🏒" },
    ],
    hint: "Soccer (called football in many places) only needs a ball, so kids play it all over the world.",
  },
  {
    prompt: "Why is it good to learn about other cultures?",
    right: "it helps us understand and respect each other",
    wrong: ["it shows that one culture is the best", "it isn't useful"],
    hint: "Learning about each other helps us see what we share and respect how we are different.",
    emoji: "🤝",
  },
  {
    prompt: "Naan, tortillas and pita are all kinds of…",
    right: "bread",
    wrong: ["soup", "fruit"],
    hint: "Bread is eaten in many cultures, but it is made in many different ways.",
    emoji: "🫓",
  },
  {
    prompt: "Canada is called a multicultural country. What does that mean?",
    right: "people from many cultures live here together",
    wrong: ["everyone here shares one culture", "people here speak only one language"],
    hint: "“Multi” means many. People in Canada come from cultures all around the world.",
    emoji: "🍁",
    hard: true,
  },
  {
    prompt: "Kids in Japan, Kenya and Canada all go to school. This is an example of…",
    right: "a common experience",
    wrong: ["a difference between cultures", "a natural resource"],
    hint: "Something that people in many places share is a common experience.",
    emoji: "🎒",
    hard: true,
  },
  {
    prompt: "How can a global citizen help children in other countries?",
    right: "raise money for clean water or schools",
    wrong: ["ignore problems far away", "waste food and water"],
    hint: "Even small actions, like a bake sale for a clean water project, can help people far away.",
    emoji: "💧",
    hard: true,
  },
  {
    prompt: "Who agreed to protect the rights of children around the world?",
    right: "countries in the United Nations",
    wrong: ["one school principal", "a sports team"],
    hint: "Almost every country in the world agreed to protect children's rights through the United Nations.",
    emoji: "🌐",
    hard: true,
  },
  {
    prompt: "Rights come with responsibilities. If you have the right to be safe, your responsibility is to…",
    right: "help keep others safe too",
    wrong: ["only think about yourself", "take other people's things"],
    hint: "Everyone has the same rights, so we all have a responsibility to respect other people's rights.",
    emoji: "🛡️",
    hard: true,
  },
  {
    prompt: "Something done the same way for a long time and passed down in a family or culture is a…",
    right: "tradition",
    wrong: ["trend", "rule"],
    hint: "Family recipes, songs and celebrations passed down over time are traditions.",
    emoji: "🎎",
    hard: true,
  },
  {
    prompt: "Which action shows respect for diversity?",
    right: "learning to say hello in a classmate's language",
    wrong: ["making fun of someone's accent", "only playing with kids who are just like you"],
    hint: "Respecting diversity means valuing the ways people are different.",
    emoji: "👋",
    hard: true,
  },
  {
    prompt: "Why might two cultures cook very different foods?",
    right: "different foods grow or live where they are",
    wrong: ["people in one culture never get hungry", "food tastes the same everywhere"],
    hint: "People cook with what the land and water near them provide, so food changes from place to place.",
    emoji: "🍲",
    hard: true,
  },
];

function cultures({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return shuffle([
    greetingQuestion(difficulty),
    sortQuestion(RIGHTS_SORT, perBin(difficulty)),
    ...levelled(CULTURE_BANK, 6, difficulty),
  ]);
}

// ---------- First Peoples ----------

const BERRY_PASSAGE: Visual = {
  type: "passage",
  title: "Berry Picking with Grandma",
  paragraphs: [
    "Every summer, Maya goes berry picking with her grandmother. Her grandmother is an Elder in their First Nation.",
    "As they walk, Grandma tells stories that her own grandmother told her. She shows Maya which berries are ready and which need more time.",
    "“We take only what we need,” Grandma says, “and leave plenty for the birds, the bears and next year.”",
    "Maya listens carefully. One day, she will share these stories with her own grandchildren.",
  ],
};

const MICHIF_PASSAGE: Visual = {
  type: "passage",
  title: "Leo Learns Michif",
  paragraphs: [
    "Leo is Métis. His grandmother speaks Michif, the language of the Métis. She teaches Leo new words every week.",
    "At a community gathering, Leo's uncle plays the fiddle, and people of all ages get up to jig.",
    "“When you learn our language,” Grandma says, “you help keep it strong for the next generation.”",
  ],
};

const ARCTIC_PASSAGE: Visual = {
  type: "passage",
  title: "Ana's Weekend",
  paragraphs: [
    "Ana is Inuk. She lives in Iqaluit, the capital city of Nunavut. At school, she learns in Inuktitut and English.",
    "On weekends, her family goes out on the land. Her grandfather teaches her how to fish for Arctic char and how to read the weather and the ice.",
    "“The land teaches us,” he says. Ana listens carefully, just as he once listened to his own grandparents.",
  ],
};

const ORAL_PASSAGE: Visual = {
  type: "passage",
  title: "Oral History",
  paragraphs: [
    "Oral history is history that is spoken and heard. Indigenous peoples have passed down knowledge this way for thousands of years, and they still do today.",
    "Elders share stories, songs and teachings about their people's history, the land and how to live well together. Listeners learn to remember carefully so they can pass the knowledge on correctly.",
    "When a whole community remembers important events together, it is called collective memory.",
  ],
};

const PASSAGE_SETS: Item[][] = [
  [
    {
      prompt: "How did Maya's grandmother learn her stories?",
      right: "from her own grandmother",
      wrong: ["from a TV show", "she made them up that morning"],
      hint: "Look at the second paragraph. Stories passed from grandparent to grandchild are oral history.",
      visual: BERRY_PASSAGE,
    },
    {
      prompt: "Why do Maya and Grandma take only what they need?",
      right: "so there is enough for animals and for next year",
      wrong: ["because berries are too heavy to carry", "because Grandma doesn't like berries"],
      hint: "Read what Grandma says in the third paragraph.",
      visual: BERRY_PASSAGE,
    },
    {
      prompt: "What will Maya do with the stories one day?",
      right: "share them with her own grandchildren",
      wrong: ["forget them", "keep them all to herself"],
      hint: "Read the last paragraph. This is how knowledge is passed down through generations.",
      visual: BERRY_PASSAGE,
    },
    {
      prompt: "What is this passage mostly about?",
      right: "an Elder passing knowledge to a young person",
      wrong: ["how to bake a berry pie", "a trip to a big city"],
      hint: "Think about what Grandma shares with Maya the whole time.",
      visual: BERRY_PASSAGE,
    },
  ],
  [
    {
      prompt: "What language is Leo learning?",
      right: "Michif",
      wrong: ["Inuktitut", "Spanish"],
      hint: "Look at the first paragraph. Michif is the language of the Métis.",
      visual: MICHIF_PASSAGE,
    },
    {
      prompt: "Who is teaching Leo the language?",
      right: "his grandmother",
      wrong: ["his teacher at school", "his uncle"],
      hint: "Read the first paragraph again. Who teaches Leo new words every week?",
      visual: MICHIF_PASSAGE,
    },
    {
      prompt: "Why does Grandma say learning the language is important?",
      right: "it helps keep the language strong for the future",
      wrong: ["it helps Leo play the fiddle", "it is only for school tests"],
      hint: "Read what Grandma says in the last paragraph.",
      visual: MICHIF_PASSAGE,
    },
    {
      prompt: "What does Leo's uncle play at the gathering?",
      right: "the fiddle",
      wrong: ["the piano", "the trumpet"],
      hint: "Look at the second paragraph. Fiddle music and jigging are Métis traditions.",
      visual: MICHIF_PASSAGE,
    },
  ],
  [
    {
      prompt: "Where does Ana live?",
      right: "Iqaluit, in Nunavut",
      wrong: ["a city in Australia", "a village in Europe"],
      hint: "Look at the first paragraph. Iqaluit is the capital city of Nunavut, in Canada's Arctic.",
      visual: ARCTIC_PASSAGE,
    },
    {
      prompt: "What does Ana's grandfather teach her?",
      right: "how to fish and read the weather and ice",
      wrong: ["how to build a car", "how to surf big waves"],
      hint: "Read the second paragraph.",
      visual: ARCTIC_PASSAGE,
    },
    {
      prompt: "How did Ana's grandfather learn about the land?",
      right: "by listening to his own grandparents",
      wrong: ["from a video game", "from a magazine"],
      hint: "Read the last sentence. Knowledge is passed from Elders to young people.",
      visual: ARCTIC_PASSAGE,
    },
    {
      prompt: "Which two languages does Ana learn in at school?",
      right: "Inuktitut and English",
      wrong: ["French and Spanish", "Michif and German"],
      hint: "Look at the end of the first paragraph.",
      visual: ARCTIC_PASSAGE,
    },
  ],
  [
    {
      prompt: "What is oral history?",
      right: "history that is spoken and heard",
      wrong: ["history written only in books", "history about the ocean"],
      hint: "Look at the first sentence. “Oral” means spoken.",
      visual: ORAL_PASSAGE,
    },
    {
      prompt: "Why do listeners try to remember the stories carefully?",
      right: "so they can pass them on correctly",
      wrong: ["so they can change the endings", "so they can win a prize"],
      hint: "Read the end of the second paragraph.",
      visual: ORAL_PASSAGE,
    },
    {
      prompt: "When a whole community remembers important events together, it is called…",
      right: "collective memory",
      wrong: ["a calendar", "a secret"],
      hint: "Read the last paragraph. “Collective” means shared by a group.",
      visual: ORAL_PASSAGE,
    },
    {
      prompt: "According to the passage, is oral history still shared today?",
      right: "Yes, Elders still share it today",
      wrong: ["No, it stopped long ago", "No, it is only in museums"],
      hint: "Look at the end of the first paragraph.",
      visual: ORAL_PASSAGE,
    },
  ],
];

const FIRST_PEOPLES_BANK: Item[] = [
  {
    prompt: "Indigenous peoples in Canada include…",
    right: "First Nations, Métis and Inuit",
    wrong: ["only First Nations", "only Inuit"],
    hint: "There are three groups of Indigenous peoples in Canada: First Nations, Métis and Inuit.",
    emoji: "🍁",
  },
  {
    prompt: "Are all First Nations the same?",
    right: "No, each Nation has its own language, history and traditions",
    wrong: ["Yes, they all share one language", "Yes, they all live in one place"],
    hint: "There are more than 600 First Nations in Canada, and each one is different.",
    emoji: "🗺️",
  },
  {
    prompt: "In many Indigenous communities, who is an Elder?",
    right: "a respected person who shares knowledge and teachings",
    wrong: ["anyone who has a birthday", "the youngest person in a family"],
    hint: "Elders are respected knowledge keepers. They share history, language and teachings with younger people.",
    emoji: "🧓",
  },
  {
    prompt: "How is oral history passed down?",
    right: "by telling stories and listening carefully",
    wrong: ["only by reading textbooks", "by sending emails"],
    hint: "Oral means spoken. Oral history is shared out loud from one generation to the next.",
    emoji: "🗣️",
  },
  {
    prompt: "Where do Indigenous peoples in Canada live today?",
    right: "in cities, towns and their own communities",
    wrong: ["only in history books", "only in other countries"],
    hint: "Indigenous peoples are part of communities all across Canada today.",
    emoji: "🏘️",
  },
  {
    prompt: "Many Indigenous languages are spoken in Canada. How are communities keeping them strong?",
    right: "teaching them to children at home and in school",
    wrong: ["never speaking them", "only using them once a year"],
    hint: "Elders, families and schools teach Indigenous languages so young people can speak them.",
    emoji: "📖",
  },
  {
    prompt: "Many schools begin events with a land acknowledgement. What does it do?",
    right: "recognizes the First Peoples whose land we are on",
    wrong: ["tells the weather forecast", "announces the lunch menu"],
    hint: "A land acknowledgement shows respect for the Indigenous peoples who have cared for the land for thousands of years.",
    emoji: "🏫",
  },
  {
    prompt: "What is a tradition?",
    right: "something done the same way and passed down over time",
    wrong: ["something brand new", "a kind of weather"],
    hint: "Traditions are passed from older people to younger people, like songs, stories or ways of preparing food.",
    emoji: "🎶",
  },
  {
    prompt: "Besides telling stories, how else can knowledge be passed down?",
    right: "through songs, art and doing activities together",
    wrong: ["only through tests", "by staying silent"],
    hint: "People learn by listening, watching and doing things alongside Elders and family.",
    emoji: "🎨",
  },
  {
    prompt: "Which action shows respect for the land?",
    right: "taking only what you need",
    wrong: ["leaving garbage behind", "picking every plant you see"],
    hint: "Many First Peoples teach that we should take only what we need, so there is enough for the future.",
    emoji: "🌿",
  },
  {
    prompt: "What does Nunavut mean in Inuktitut?",
    right: "our land",
    wrong: ["big ocean", "cold wind"],
    hint: "Nunavut, a territory in Canada's Arctic, means “our land” in Inuktitut.",
    emoji: "❄️",
    hard: true,
  },
  {
    prompt: "The Métis have their own language. It is called…",
    right: "Michif",
    wrong: ["Inuktitut", "Latin"],
    hint: "Michif is the Métis language. It mixes Cree and French words in its own special way.",
    emoji: "🎻",
    hard: true,
  },
  {
    prompt: "Inuit live mainly in which part of Canada?",
    right: "the Arctic, in the North",
    wrong: ["the Prairies", "the Pacific coast"],
    hint: "Inuit homelands are in Canada's Arctic, including Nunavut and the North.",
    emoji: "🧭",
    hard: true,
  },
  {
    prompt: "Why is careful listening important in oral traditions?",
    right: "the knowledge must be remembered and shared correctly",
    wrong: ["the stories should change every time", "listening isn't important"],
    hint: "In oral history, there's no book to check, so listeners must remember carefully.",
    emoji: "👂",
    hard: true,
  },
  {
    prompt: "Some First Nations on the Pacific Northwest Coast carve tall poles, often called totem poles. What can they show?",
    right: "family histories and important events",
    wrong: ["the time of day", "the weather forecast"],
    hint: "Carved poles can record the history of a family or community, like a story told in wood.",
    emoji: "🌲",
    hard: true,
  },
  {
    prompt: "Why are Indigenous place names important?",
    right: "they hold knowledge about the land and its history",
    wrong: ["they are just made-up sounds", "they are only used on maps"],
    hint: "Many Indigenous place names describe the land or tell what happened there.",
    emoji: "🗺️",
    hard: true,
  },
  {
    prompt: "Why is it good to learn the name of the First Peoples where you live?",
    right: "it shows respect and helps us learn the history of the land",
    wrong: ["it is only for grown-ups", "it doesn't matter"],
    hint: "Knowing whose land you live on is a way to show respect and learn its history.",
    emoji: "🤝",
    hard: true,
  },
  {
    prompt: "Canada has more than 600 First Nations. What does this tell us?",
    right: "there are many Nations, each with its own culture",
    wrong: ["all First Nations share one culture", "all First Nations live in one city"],
    hint: "Each First Nation has its own language, history, traditions and territory.",
    emoji: "🍁",
    hard: true,
  },
];

function firstPeoples({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const passage = sample(pick(PASSAGE_SETS), 2).map(ask);
  return [...passage, ...shuffle(levelled(FIRST_PEOPLES_BANK, 6, difficulty))];
}

// ---------- Indigenous Peoples of the World ----------

const PEOPLES = [
  {
    who: "the Māori",
    home: "Aotearoa New Zealand",
    fact: "Aotearoa is the Māori name for New Zealand, in the Pacific Ocean.",
    core: true,
  },
  {
    who: "the Sámi",
    home: "northern Norway, Sweden, Finland and Russia",
    fact: "The Sámi homeland, called Sápmi, stretches across the north of four countries in Europe.",
    core: true,
  },
  {
    who: "Inuit",
    home: "the Arctic of Canada, Greenland and Alaska",
    fact: "Inuit homelands are in the Arctic, in the far north of the world.",
    core: true,
  },
  {
    who: "Aboriginal and Torres Strait Islander peoples",
    home: "Australia",
    fact: "Aboriginal and Torres Strait Islander peoples are the Indigenous peoples of Australia.",
    core: true,
  },
  { who: "the Ainu", home: "northern Japan", fact: "The Ainu are the Indigenous people of northern Japan.", core: false },
  {
    who: "the Quechua",
    home: "the Andes mountains of South America",
    fact: "Quechua peoples live high in the Andes mountains of South America.",
    core: false,
  },
  {
    who: "the Maasai",
    home: "Kenya and Tanzania in East Africa",
    fact: "The Maasai are Indigenous peoples of Kenya and Tanzania, in East Africa.",
    core: false,
  },
];

function homelandQuestions(difficulty: Level): Question[] {
  const pool = difficulty === 1 ? PEOPLES.filter((p) => p.core) : PEOPLES;
  const choices = difficulty === 1 ? 3 : 4;
  return sample(pool, 2).map((p) => {
    const wrong = sample(
      PEOPLES.filter((o) => o !== p),
      choices - 1,
    ).map((o) => o.home);
    return textChoice(`Where is the homeland of ${p.who}?`, p.home, wrong, p.fact, {
      type: "emoji",
      emoji: "🌏",
    });
  });
}

const GLOBAL_BANK: Item[] = [
  {
    prompt: "What is the Māori name for New Zealand?",
    right: "Aotearoa",
    wrong: ["Nunavut", "Sápmi"],
    hint: "Aotearoa is the Māori name for New Zealand. Many people now say “Aotearoa New Zealand.”",
    emoji: "🌊",
  },
  {
    prompt: "What is te reo Māori?",
    right: "the Māori language",
    wrong: ["a kind of boat", "a kind of food"],
    hint: "Te reo Māori means “the Māori language.” It is an official language of New Zealand.",
    emoji: "🗣️",
  },
  {
    prompt: "Some Sámi families in northern Europe herd which animal?",
    right: { label: "reindeer", emoji: "🦌" },
    wrong: [
      { label: "camels", emoji: "🐪" },
      { label: "kangaroos", emoji: "🦘" },
    ],
    hint: "Reindeer herding is an important tradition for some Sámi families. Many Sámi also work in towns and cities.",
  },
  {
    prompt: "In the Inuit language, what does the word Inuit mean?",
    right: "the people",
    wrong: ["the ice", "the hunters"],
    hint: "Inuit means “the people.” One person is an Inuk.",
    emoji: "❄️",
  },
  {
    prompt: "Where in the world do Indigenous peoples live?",
    right: "all around the world",
    wrong: ["only in Canada", "only on islands"],
    hint: "There are Indigenous peoples in about 90 countries, on almost every continent.",
    emoji: "🌍",
  },
  {
    prompt: "What do many Indigenous peoples around the world share?",
    right: "a deep connection to the land",
    wrong: ["the same language", "the same clothing"],
    hint: "Indigenous peoples have different languages and cultures, but many value caring for the land.",
    emoji: "🌱",
  },
  {
    prompt: "Long ago, Māori ancestors sailed across the Pacific Ocean in large canoes. What helped them find their way?",
    right: "the stars, the waves and the birds",
    wrong: ["phones with maps", "road signs"],
    hint: "Expert navigators read the stars, ocean swells and birds to cross huge distances.",
    emoji: "⭐",
  },
  {
    prompt: "Many Indigenous peoples honour their ancestors. Who are ancestors?",
    right: "family members who lived long before us",
    wrong: ["people who live next door", "babies born today"],
    hint: "Ancestors are the grandparents, great-grandparents and others in your family who came before you.",
    emoji: "🌳",
  },
  {
    prompt: "Why is it important to keep Indigenous languages alive?",
    right: "languages hold a people's knowledge, stories and culture",
    wrong: ["languages are only for games", "it doesn't matter"],
    hint: "When a language is spoken, the knowledge and stories inside it are passed on.",
    emoji: "📖",
  },
  {
    prompt: "How are many Indigenous peoples in Canada and around the world alike?",
    right: "Elders pass down knowledge through stories",
    wrong: ["they all live in the same place", "they all speak the same language"],
    hint: "Oral history and Elders' teachings are important to many Indigenous peoples, in Canada and around the world.",
    emoji: "🗣️",
  },
  {
    prompt: "On what day does Canada celebrate National Indigenous Peoples Day?",
    right: "June 21",
    wrong: ["December 25", "January 1"],
    hint: "National Indigenous Peoples Day is June 21, the summer solstice, the longest day of the year.",
    emoji: "📅",
    hard: true,
  },
  {
    prompt: "The Sámi homeland stretches across four countries. What is it called?",
    right: "Sápmi",
    wrong: ["Aotearoa", "Nunavut"],
    hint: "Sápmi is the Sámi homeland in the north of Norway, Sweden, Finland and Russia.",
    emoji: "🦌",
    hard: true,
  },
  {
    prompt: "Aboriginal and Torres Strait Islander cultures in Australia are among the…",
    right: "oldest living cultures in the world",
    wrong: ["newest cultures in the world", "smallest cultures in the world"],
    hint: "These cultures go back tens of thousands of years, and they are still alive and strong today.",
    emoji: "🌏",
    hard: true,
  },
  {
    prompt: "Which value do many Indigenous societies around the world share?",
    right: "caring for the well-being of people, the land and ancestors",
    wrong: ["using up the land as fast as possible", "forgetting the past"],
    hint: "Many Indigenous peoples see people, the land and their ancestors as connected.",
    emoji: "🌿",
    hard: true,
  },
  {
    prompt: "Quechua farmers grow many kinds of potatoes high in the…",
    right: "Andes mountains of South America",
    wrong: ["Sahara Desert", "Arctic tundra"],
    hint: "Potatoes were first grown in the Andes. Quechua farmers grow hundreds of different kinds.",
    emoji: "🥔",
    hard: true,
  },
  {
    prompt: "The United Nations has a day for the world's Indigenous peoples. Why?",
    right: "to recognize and respect their cultures and rights",
    wrong: ["to celebrate one country only", "to mark the first day of winter"],
    hint: "The International Day of the World's Indigenous Peoples is August 9.",
    emoji: "🌐",
    hard: true,
  },
  {
    prompt: "Kia ora is a greeting in te reo Māori. What does it mean?",
    right: "hello (be well)",
    wrong: ["good night", "see you next year"],
    hint: "Kia ora is a friendly greeting that wishes someone good health.",
    emoji: "👋",
    hard: true,
  },
  {
    prompt: "How do many Indigenous peoples around the world teach young people?",
    right: "Elders share stories and teach by doing, on the land",
    wrong: ["children figure everything out alone", "only by watching TV"],
    hint: "Learning by listening to Elders and doing things together is important in many Indigenous cultures.",
    emoji: "🧓",
    hard: true,
  },
  {
    prompt: "In Aotearoa New Zealand, many schools teach te reo Māori. How does this help?",
    right: "it keeps the Māori language strong for the future",
    wrong: ["it replaces all other languages", "it keeps the language secret"],
    hint: "When children learn a language, they can pass it on to the next generation.",
    emoji: "🏫",
    hard: true,
  },
  {
    prompt: "What does the Māori word whānau mean?",
    right: "family",
    wrong: ["boat", "mountain"],
    hint: "Whānau means family. It can include grandparents, aunts, uncles and cousins too.",
    emoji: "👨‍👩‍👧",
  },
  {
    prompt: "Indigenous peoples around the world have lived in their homelands for…",
    right: "thousands of years",
    wrong: ["a few weeks", "only 50 years"],
    hint: "Many Indigenous peoples have been caring for their homelands since long before there were countries.",
    emoji: "⏳",
  },
  {
    prompt: "Which sentence about Indigenous peoples is true?",
    right: "They live in towns, cities and small communities today.",
    wrong: ["They only lived long ago.", "They no longer exist."],
    hint: "Indigenous peoples are alive and strong today, and their cultures keep growing.",
    emoji: "🏙️",
  },
  {
    prompt: "How can we show respect when we learn about Indigenous peoples?",
    right: "listen to Indigenous voices and ask questions kindly",
    wrong: ["wear their clothing as a costume", "decide that all of them are the same"],
    hint: "Each Nation and community is different, so we listen to the people themselves.",
    emoji: "🤝",
  },
  {
    prompt: "A gákti is traditional clothing worn by some people. Which people?",
    right: "the Sámi",
    wrong: ["the Māori", "the Quechua"],
    hint: "Some Sámi people wear a colourful gákti on special days. Many also wear everyday clothes like you do.",
    emoji: "🧥",
  },
  {
    prompt: "Many Maasai families in East Africa raise which animals?",
    right: { label: "cattle", emoji: "🐄" },
    wrong: [
      { label: "reindeer", emoji: "🦌" },
      { label: "penguins", emoji: "🐧" },
    ],
    hint: "Cattle are an important part of life for many Maasai families, in Kenya and Tanzania.",
  },
  {
    prompt: "Nunavut means “our land” in Inuktitut. Whose homeland is Nunavut?",
    right: "Inuit",
    wrong: ["the Māori", "the Sámi"],
    hint: "Nunavut is a territory in northern Canada. Most people who live there are Inuit.",
    emoji: "🏔️",
    hard: true,
  },
  {
    prompt: "Some Quechua families in the Andes raise which animal for wool?",
    right: { label: "llamas", emoji: "🦙" },
    wrong: [
      { label: "reindeer", emoji: "🦌" },
      { label: "kangaroos", emoji: "🦘" },
    ],
    hint: "Llamas and alpacas live high in the Andes. Their wool is used for warm clothing and weaving.",
    hard: true,
  },
  {
    prompt: "The Ainu homelands include the island of Hokkaido. In which country is it?",
    right: "Japan",
    wrong: ["New Zealand", "Norway"],
    hint: "Hokkaido is the northern main island of Japan.",
    emoji: "🗾",
    hard: true,
  },
  {
    prompt: "Inuktitut is a language. Who speaks it?",
    right: "many Inuit in Canada",
    wrong: ["the Māori in New Zealand", "the Sámi in Europe"],
    hint: "Inuktitut is one of the Inuit languages spoken in northern Canada today.",
    emoji: "🗣️",
    hard: true,
  },
];

function globalIndigenous({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return shuffle([...homelandQuestions(difficulty), ...levelled(GLOBAL_BANK, 6, difficulty)]);
}

export const course: Course = {
  grade: "3",
  subject: "social",
  bigIdeas: {
    "ca-bc": [
      "Learning about Indigenous peoples nurtures multicultural awareness and respect for diversity.",
      "People from diverse cultures and societies share some common experiences and aspects of life.",
      "Indigenous knowledge is passed down through oral history, traditions, and collective memory.",
      "Indigenous societies throughout the world value the well-being of the self, the land, spirits, and ancestors.",
    ],
  },
  units: [
    {
      id: "maps-and-globes",
      title: "Maps & Globes",
      emoji: "🗺️",
      blurb: "Continents, oceans and directions",
      standards: { "ca-bc": "Mapping: continents, oceans, cardinal directions and map features" },
      parentNote:
        "Naming continents and oceans, using north, south, east and west on a simple town map, and reading map features such as a legend (key), compass rose and scale.",
      generate: maps,
    },
    {
      id: "meeting-needs",
      title: "Needs Around the World",
      emoji: "🏡",
      blurb: "Homes, food and clothes everywhere",
      standards: {
        "ca-bc": "How people meet their basic needs in different places; relationships between people and the land",
      },
      parentNote:
        "Everyone needs food, water, shelter and clothing. How people in different places meet these needs using what the land and climate offer, and why caring for the land matters.",
      generate: meetingNeeds,
    },
    {
      id: "world-cultures",
      title: "Cultures of the World",
      emoji: "🌍",
      blurb: "Different cultures, shared experiences",
      standards: {
        "ca-bc": "Diversity of world cultures; common experiences of people around the world; rights and responsibilities of global citizens",
      },
      parentNote:
        "What culture means, how cultures differ (language, food, celebrations) and what people everywhere share, plus the rights and responsibilities of global citizens.",
      generate: cultures,
    },
    {
      id: "first-peoples",
      title: "First Peoples",
      emoji: "🌲",
      blurb: "Nations, languages and Elders' knowledge",
      standards: {
        "ca-bc": "Cultural characteristics and ways of life of local First Peoples; knowledge passed down through oral history, traditions and collective memory",
      },
      parentNote:
        "First Nations, Métis and Inuit in Canada today: many distinct Nations and languages, Elders as knowledge keepers, and how oral history and traditions pass knowledge between generations. Includes short reading passages.",
      generate: firstPeoples,
    },
    {
      id: "global-indigenous",
      title: "Indigenous Peoples of the World",
      emoji: "🌏",
      blurb: "Living cultures around the globe",
      standards: {
        "ca-bc": "Cultural characteristics and ways of life of Indigenous peoples around the world; relationships between people, the land and ancestors",
      },
      parentNote:
        "Indigenous peoples around the world today, such as the Māori of Aotearoa New Zealand, the Sámi of northern Europe and Inuit of the Arctic: their homelands, languages and connections to the land, and what they share with Indigenous peoples in Canada.",
      generate: globalIndigenous,
    },
  ],
};
