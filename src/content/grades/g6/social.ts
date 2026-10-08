import { chance, pick, randInt, sample, shuffle, textChoice } from "../../random";
import type { Course, GenerateOptions, InputQuestion, Question, Visual } from "../../types";
import { sortQuestion, type BankItem, type SortSet } from "../../bank";

type Level = 1 | 2 | 3;
/** A bank question. `hard` marks a stretch item; `visual` replaces the emoji picture. */
type Item = BankItem & { hard?: true; visual?: Visual };

function ask(b: Item): Question {
  const visual: Visual | undefined =
    b.visual ?? (b.emoji ? { type: "emoji", emoji: b.emoji, caption: b.caption } : undefined);
  return textChoice(b.prompt, b.right, b.wrong, b.hint, visual);
}

/** Difficulty 1 uses only core items, 2 mixes in about a third stretch items, 3 is mostly stretch. */
function levelled(bank: Item[], count: number, difficulty: Level): Question[] {
  const easy = bank.filter((b) => !b.hard);
  const hard = bank.filter((b) => b.hard);
  const want = difficulty === 1 ? 0 : difficulty === 2 ? Math.ceil(count / 3) : Math.ceil((count * 2) / 3);
  const nHard = Math.min(want, hard.length);
  return [...sample(easy, count - nHard), ...sample(hard, nHard)].map(ask);
}

/** One question from a small set, matched to the difficulty where possible. */
function oneOf(items: Item[], difficulty: Level): Question {
  const pool = items.filter((i) => (difficulty === 1 ? !i.hard : difficulty === 3 ? i.hard : true));
  return ask(pick(pool.length ? pool : items));
}

/** Two-basket sorts: 6 items, or 8 at stretch level. */
const perBin = (d: Level) => (d === 3 ? 4 : 3);

const withCommas = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// ---------- Map Skills ----------

interface GridPoint {
  x: number;
  y: number;
}

const coordText = (p: GridPoint) =>
  `${Math.abs(p.y) * 10}°${p.y > 0 ? "N" : "S"}, ${Math.abs(p.x) * 10}°${p.x > 0 ? "E" : "W"}`;
const gridHemispheres = (p: GridPoint) => `${p.y > 0 ? "Northern" : "Southern"} and ${p.x > 0 ? "Eastern" : "Western"}`;
const ALL_HEMISPHERES = ["Northern and Eastern", "Northern and Western", "Southern and Eastern", "Southern and Western"];

function gridQ(d: Level): Question {
  const ax = randInt(1, 5);
  const ay = pick([1, 2, 3, 4, 5].filter((n) => n !== ax));
  const target = { x: pick([-1, 1]) * ax, y: pick([-1, 1]) * ay };
  // Common mix-ups: wrong east/west, wrong north/south, latitude and longitude swapped.
  const decoys = [
    { x: -target.x, y: target.y },
    { x: target.x, y: -target.y },
    { x: target.y, y: target.x },
  ];
  const points = shuffle([target, ...decoys]).map((p, i) => ({ ...p, label: "ABCD"[i] }));
  const t = points.find((p) => p.x === target.x && p.y === target.y)!;
  const others = points.filter((p) => p !== t);
  const visual: Visual = { type: "grid", size: 6, min: -6, points };
  const intro = "On this map grid, each number stands for 10° (so 3 means 30°). Up is north and right is east.";
  const hint =
    "Latitude is how far north (up) or south (down) of the equator, the 0 line across. Longitude is how far east (right) or west (left) of the prime meridian, the 0 line up and down. Latitude is written first.";
  if (d === 1) {
    return textChoice(
      `${intro} Point ${t.label} is in which two hemispheres?`,
      gridHemispheres(t),
      ALL_HEMISPHERES.filter((h) => h !== gridHemispheres(t)),
      "Above the equator is the Northern Hemisphere and below is the Southern. Right of the prime meridian is the Eastern Hemisphere and left is the Western.",
      visual,
    );
  }
  if (d === 2) {
    return textChoice(
      `${intro} Which point is at ${coordText(t)}?`,
      `Point ${t.label}`,
      others.map((p) => `Point ${p.label}`),
      hint,
      visual,
    );
  }
  return textChoice(
    `${intro} What are the latitude and longitude of point ${t.label}?`,
    coordText(t),
    others.map(coordText),
    hint,
    visual,
  );
}

interface City {
  name: string;
  lat: number;
  lon: number;
}

// Rounded to the nearest degree.
const CITIES: City[] = [
  { name: "Ottawa", lat: 45, lon: -76 },
  { name: "Halifax", lat: 45, lon: -64 },
  { name: "Iqaluit", lat: 64, lon: -69 },
  { name: "Mexico City", lat: 19, lon: -99 },
  { name: "Reykjavik", lat: 64, lon: -22 },
  { name: "Lima", lat: -12, lon: -77 },
  { name: "Rio de Janeiro", lat: -23, lon: -43 },
  { name: "Buenos Aires", lat: -35, lon: -58 },
  { name: "Nairobi", lat: -1, lon: 37 },
  { name: "Cape Town", lat: -34, lon: 18 },
  { name: "Sydney", lat: -34, lon: 151 },
  { name: "Lagos", lat: 6, lon: 3 },
  { name: "Cairo", lat: 30, lon: 31 },
  { name: "Moscow", lat: 56, lon: 38 },
  { name: "Mumbai", lat: 19, lon: 73 },
  { name: "Singapore", lat: 1, lon: 104 },
  { name: "Tokyo", lat: 36, lon: 140 },
];

const latText = (lat: number) => `${Math.abs(lat)}°${lat >= 0 ? "N" : "S"}`;
const lonText = (lon: number) => `${Math.abs(lon)}°${lon >= 0 ? "E" : "W"}`;
const cityHemispheres = (c: City) => `${c.lat > 0 ? "Northern" : "Southern"} and ${c.lon > 0 ? "Eastern" : "Western"}`;

const cityTable = (cities: City[]): Visual => ({
  type: "table",
  title: "World cities",
  headers: ["City", "Latitude", "Longitude"],
  rows: cities.map((c) => [c.name, latText(c.lat), lonText(c.lon)]),
});

type CityAsk = "hemispheres" | "equator" | "farthest" | "north" | "south";

const CITY_ASKS: Record<Exclude<CityAsk, "hemispheres">, { prompt: string; hint: string; score: (c: City) => number }> = {
  equator: {
    prompt: "Which city is closest to the equator?",
    hint: "The equator is 0° latitude. The smaller the latitude number, N or S, the closer a city is to the equator.",
    score: (c) => -Math.abs(c.lat),
  },
  farthest: {
    prompt: "Which city is farthest from the equator?",
    hint: "The bigger the latitude number, N or S, the farther a city is from the equator.",
    score: (c) => Math.abs(c.lat),
  },
  north: {
    prompt: "Which city is farthest north?",
    hint: "Any N latitude is north of any S latitude. Among the N latitudes, the biggest number is farthest north.",
    score: (c) => c.lat,
  },
  south: {
    prompt: "Which city is farthest south?",
    hint: "Any S latitude is south of any N latitude. Among the S latitudes, the biggest number is farthest south.",
    score: (c) => -c.lat,
  },
};

function cityQ(d: Level): Question {
  const ask: CityAsk =
    d === 1 ? "hemispheres" : pick<CityAsk>(d === 2 ? ["hemispheres", "equator", "north"] : ["equator", "farthest", "south"]);
  if (ask !== "hemispheres") {
    const { prompt, hint, score } = CITY_ASKS[ask];
    for (let tries = 0; tries < 40; tries++) {
      const cities = sample(CITIES, 4);
      const best = Math.max(...cities.map(score));
      const winners = cities.filter((c) => score(c) === best);
      if (winners.length !== 1) continue;
      return textChoice(
        prompt,
        winners[0].name,
        cities.filter((c) => c !== winners[0]).map((c) => c.name),
        hint,
        cityTable(cities),
      );
    }
  }
  const answer = pick(CITIES);
  const others = sample(
    CITIES.filter((c) => cityHemispheres(c) !== cityHemispheres(answer)),
    3,
  );
  return textChoice(
    `Which city is in both the ${cityHemispheres(answer)} Hemispheres?`,
    answer.name,
    others.map((c) => c.name),
    "N latitude means the Northern Hemisphere and S means the Southern. E longitude means the Eastern Hemisphere and W means the Western.",
    cityTable(shuffle([answer, ...others])),
  );
}

const HEMISPHERE_SORT: SortSet = {
  prompt: "Is the whole country in the Northern or the Southern Hemisphere? Tap an item, then tap its basket.",
  hint: "The equator divides Earth into the Northern and Southern Hemispheres. Picture a globe: is the country above or below the equator?",
  bins: [
    { id: "north", label: "Northern Hemisphere", emoji: "⬆️" },
    { id: "south", label: "Southern Hemisphere", emoji: "⬇️" },
  ],
  items: [
    { label: "Canada", emoji: "🌎", bin: "north" },
    { label: "Mexico", emoji: "🌎", bin: "north" },
    { label: "Iceland", emoji: "🌍", bin: "north" },
    { label: "Egypt", emoji: "🌍", bin: "north" },
    { label: "Japan", emoji: "🌏", bin: "north" },
    { label: "India", emoji: "🌏", bin: "north" },
    { label: "Argentina", emoji: "🌎", bin: "south" },
    { label: "Chile", emoji: "🌎", bin: "south" },
    { label: "South Africa", emoji: "🌍", bin: "south" },
    { label: "Madagascar", emoji: "🌍", bin: "south" },
    { label: "Australia", emoji: "🌏", bin: "south" },
    { label: "New Zealand", emoji: "🌏", bin: "south" },
  ],
};

const MAP_BANK: Item[] = [
  {
    prompt: "How many continents are there?",
    right: "7",
    wrong: ["5", "6", "8"],
    hint: "North America, South America, Europe, Africa, Asia, Australia (Oceania) and Antarctica.",
    emoji: "🗺️",
  },
  {
    prompt: "What is the largest continent?",
    right: "Asia",
    wrong: ["Africa", "North America", "Europe"],
    hint: "This continent stretches from the Middle East to Japan and holds more than half the world's people.",
    emoji: "🌏",
  },
  {
    prompt: "What is the largest ocean?",
    right: "the Pacific Ocean",
    wrong: ["the Atlantic Ocean", "the Indian Ocean", "the Arctic Ocean"],
    hint: "This ocean lies between Asia and the Americas and covers about a third of Earth's surface.",
    emoji: "🌊",
  },
  {
    prompt: "Which three oceans border Canada?",
    right: "Pacific, Arctic and Atlantic",
    wrong: ["Pacific, Indian and Atlantic", "Arctic, Southern and Indian", "Atlantic, Indian and Southern"],
    hint: "Canada has coasts on the west, the north and the east.",
    emoji: "🍁",
  },
  {
    prompt: "What is the latitude of the equator?",
    right: "0°",
    wrong: ["90°N", "180°", "45°N"],
    hint: "Latitude is measured from the equator, so the equator itself is the starting line.",
  },
  {
    prompt: "Lines of latitude measure distance…",
    right: "north or south of the equator",
    wrong: ["east or west of the prime meridian", "above sea level", "between two cities"],
    hint: "Latitude lines run east–west around the globe like rungs on a ladder, and they tell you how far north or south you are.",
  },
  {
    prompt: "Lines of longitude measure distance…",
    right: "east or west of the prime meridian",
    wrong: ["north or south of the equator", "below sea level", "from the Sun"],
    hint: "Longitude lines run from pole to pole and tell you how far east or west you are.",
  },
  {
    prompt: "What is the latitude of the North Pole?",
    right: "90°N",
    wrong: ["0°", "180°N", "45°N"],
    hint: "Latitude goes from 0° at the equator up to 90° at each pole.",
    emoji: "🧭",
  },
  {
    prompt: "Canada is in which two hemispheres?",
    right: "Northern and Western",
    wrong: ["Southern and Western", "Northern and Eastern", "Southern and Eastern"],
    hint: "Canada is north of the equator and west of the prime meridian.",
    emoji: "🍁",
  },
  {
    prompt: "Which imaginary line divides Earth into the Northern and Southern Hemispheres?",
    right: "the equator",
    wrong: ["the prime meridian", "the International Date Line", "the Arctic Circle"],
    hint: "This line circles the middle of Earth at 0° latitude.",
  },
  {
    prompt: "Which line at 0° longitude helps divide Earth into the Eastern and Western Hemispheres?",
    right: "the prime meridian",
    wrong: ["the equator", "the Tropic of Cancer", "the Arctic Circle"],
    hint: "This line runs from the North Pole to the South Pole through Greenwich, England.",
  },
  {
    prompt: "The prime meridian passes through which place?",
    right: "Greenwich, in London, England",
    wrong: ["Paris, France", "Ottawa, Canada", "Cairo, Egypt"],
    hint: "In 1884, countries agreed to measure longitude from an observatory in this part of London.",
    hard: true,
  },
  {
    prompt: "Which continent do both the equator and the prime meridian cross?",
    right: "Africa",
    wrong: ["South America", "Europe", "Asia"],
    hint: "The point 0°, 0° lies in the ocean just off the west coast of this continent.",
    emoji: "🌍",
    hard: true,
  },
  {
    prompt: "What is the largest number of degrees used for longitude?",
    right: "180°",
    wrong: ["90°", "360°", "45°"],
    hint: "Longitude goes 180° east and 180° west from the prime meridian, meeting on the far side of the globe.",
    hard: true,
  },
  {
    prompt: "Earth turns 360° in about 24 hours. How many degrees of longitude does it turn in one hour?",
    right: "15°",
    wrong: ["10°", "24°", "36°"],
    hint: "Divide 360 by 24. This is why time zones are about 15° wide.",
    emoji: "🕐",
    hard: true,
  },
  {
    prompt: "Where do all lines of longitude meet?",
    right: "at the North and South Poles",
    wrong: ["at the equator", "at the prime meridian", "They never meet"],
    hint: "Picture the lines on a globe. They're far apart at the equator and squeeze together at the top and bottom.",
    hard: true,
  },
  {
    prompt: "How many time zones does Canada have?",
    right: "6",
    wrong: ["3", "4", "10"],
    hint: "From west to east: Pacific, Mountain, Central, Eastern, Atlantic and Newfoundland.",
    emoji: "🕐",
    hard: true,
  },
  {
    prompt: "The International Date Line roughly follows which line of longitude?",
    right: "180°",
    wrong: ["0°", "90°W", "45°E"],
    hint: "It's on the opposite side of the globe from the prime meridian.",
    hard: true,
  },
  {
    prompt: "Why does every flat map of the whole world have some distortion?",
    right: "A round globe can't be flattened without stretching or squishing it",
    wrong: ["Mapmakers make mistakes on purpose", "Countries keep changing size", "Satellites can't photograph Earth"],
    hint: "Try flattening an orange peel. It tears or stretches.",
    emoji: "🗺️",
    hard: true,
  },
  {
    prompt: "Which ocean surrounds Antarctica?",
    right: "the Southern Ocean",
    wrong: ["the Arctic Ocean", "the Indian Ocean", "the Atlantic Ocean"],
    hint: "Its name tells you where it is.",
    hard: true,
  },
  {
    prompt: "What is the smallest ocean?",
    right: "the Arctic Ocean",
    wrong: ["the Indian Ocean", "the Atlantic Ocean", "the Pacific Ocean"],
    hint: "This ocean surrounds the North Pole and is covered by sea ice for much of the year.",
    hard: true,
  },
];

function mapSkills({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return shuffle([
    gridQ(difficulty),
    cityQ(difficulty),
    sortQuestion(HEMISPHERE_SORT, perBin(difficulty)),
    ...levelled(MAP_BANK, 5, difficulty),
  ]);
}

// ---------- Cities & Migration ----------

const MIGRATION_SORT: SortSet = {
  prompt: "Push factor or pull factor? Tap an item, then tap its basket.",
  hint: "Push factors make people want to leave a place. Pull factors attract people to a new place.",
  bins: [
    { id: "push", label: "push factor (reason to leave)", emoji: "👋" },
    { id: "pull", label: "pull factor (reason to come)", emoji: "🧲" },
  ],
  items: [
    { label: "few jobs in the area", emoji: "📉", bin: "push" },
    { label: "war or conflict", emoji: "⚠️", bin: "push" },
    { label: "drought ruins the crops", emoji: "🏜️", bin: "push" },
    { label: "a flood destroys homes", emoji: "🌊", bin: "push" },
    { label: "no school nearby", emoji: "🏚️", bin: "push" },
    { label: "being treated unfairly", emoji: "🚫", bin: "push" },
    { label: "plenty of jobs", emoji: "💼", bin: "pull" },
    { label: "good schools", emoji: "🏫", bin: "pull" },
    { label: "peace and safety", emoji: "🕊️", bin: "pull" },
    { label: "family already living there", emoji: "👨‍👩‍👧", bin: "pull" },
    { label: "better hospitals", emoji: "🏥", bin: "pull" },
    { label: "freedom to speak and worship", emoji: "🗣️", bin: "pull" },
  ],
};

const YEARS = [1985, 1995, 2005, 2015, 2025];

function populationQ(d: Level): Question {
  const growth = sample([5, 10, 15, 20, 25, 30, 35, 40], 4);
  const thousands = [randInt(3, 8) * 10];
  for (const g of growth) thousands.push(thousands[thousands.length - 1] + g);
  const people = thousands.map((t) => t * 1000);
  const visual: Visual = {
    type: "table",
    title: "Population of Riverton (a made-up city)",
    headers: ["Year", "Population"],
    rows: YEARS.map((y, i) => [y, withCommas(people[i])]),
  };
  if (d === 1) {
    const i = randInt(0, YEARS.length - 1);
    return textChoice(
      `What was Riverton's population in ${YEARS[i]}?`,
      withCommas(people[i]),
      sample(
        people.filter((_, j) => j !== i),
        3,
      ).map(withCommas),
      "Find the year in the left column, then read across to the population.",
      visual,
    );
  }
  if (d === 2) {
    const i = randInt(0, YEARS.length - 2);
    const j = randInt(i + 1, YEARS.length - 1);
    const q: InputQuestion = {
      kind: "input",
      prompt: `By how many people did Riverton grow from ${YEARS[i]} to ${YEARS[j]}?`,
      hint: "Subtract the earlier population from the later one.",
      visual,
      answer: String(people[j] - people[i]),
      keypad: "number",
    };
    return q;
  }
  const best = growth.indexOf(Math.max(...growth));
  const period = (k: number) => `${YEARS[k]} to ${YEARS[k + 1]}`;
  return textChoice(
    "In which ten-year period did Riverton grow the most?",
    period(best),
    [0, 1, 2, 3].filter((k) => k !== best).map(period),
    "Work out how many people were added in each ten-year period, then compare the increases.",
    visual,
  );
}

const MOVE_PASSAGE: Visual = {
  type: "passage",
  title: "Moving to the City",
  paragraphs: [
    "Ravi's grandparents grew up in a small farming village. When the rains failed for three years in a row, their crops dried up and there was little work. Like millions of other people around the world, they decided to move to a fast-growing city.",
    "In the city, Ravi's grandfather found a job in a factory, and his grandmother trained as a nurse. Their children could walk to a school and a health clinic. But city life was not always easy. Rent was expensive, buses were crowded, and the air was smoky on hot days.",
    "Years later, Ravi's parents moved again, this time to Canada, where a cousin helped them find an apartment and work. Ravi was born a year after they arrived.",
  ],
};

const MOVE_ITEMS: Item[] = [
  {
    prompt: "What push factor made Ravi's grandparents leave their village?",
    right: "Drought ruined their crops and work was scarce",
    wrong: ["They wanted to work in a factory", "A cousin lived in Canada", "The village had too many schools"],
    hint: "A push factor is a reason to leave. Look at the first paragraph.",
    visual: MOVE_PASSAGE,
  },
  {
    prompt: "Which pull factors drew the family to the city?",
    right: "jobs, a school and a health clinic",
    wrong: ["expensive rent", "crowded buses", "smoky air"],
    hint: "A pull factor is something that attracts people. Look at the second paragraph.",
    visual: MOVE_PASSAGE,
  },
  {
    prompt: "Which problems of fast-growing cities does the passage describe?",
    right: "expensive housing, crowded transit and air pollution",
    wrong: ["too few people and empty buses", "too many farms", "no jobs at all"],
    hint: "Find the sentence that begins “But city life was not always easy.”",
    visual: MOVE_PASSAGE,
    hard: true,
  },
  {
    prompt: "When Ravi's parents moved to Canada, they became…",
    right: "immigrants to Canada",
    wrong: ["emigrants to Canada", "internal migrants", "tourists"],
    hint: "People who move into a new country to live are immigrants. (From the country they left, they're called emigrants.)",
    visual: MOVE_PASSAGE,
    hard: true,
  },
];

const MIGRATION_BANK: Item[] = [
  {
    prompt: "What is urbanization?",
    right: "the growth of cities as more people move to urban areas",
    wrong: ["people moving from cities to farms", "building more farms", "a decrease in the number of cities"],
    hint: "Urban means having to do with cities and towns.",
    emoji: "🏙️",
  },
  {
    prompt: "What is migration?",
    right: "people moving from one place to another to live",
    wrong: ["a type of government", "the study of maps", "trading goods between countries"],
    hint: "Birds migrate with the seasons. People migrate too, often for work, safety or family.",
    emoji: "🧳",
  },
  {
    prompt: "Someone who moves to a new country to live there permanently is called an…",
    right: "immigrant",
    wrong: ["ambassador", "astronaut", "athlete"],
    hint: "Immigrate means to come into a new country to live.",
  },
  {
    prompt: "A refugee is a person who…",
    right: "is forced to flee their country because of war, violence or persecution",
    wrong: ["travels for a vacation", "goes on a business trip", "moves to a new house in the same town"],
    hint: "Refugees don't choose to leave. They must escape danger to find safety.",
  },
  {
    prompt: "Which is a pull factor that attracts people to a city?",
    right: "more job opportunities",
    wrong: ["high crime", "air pollution", "a drought"],
    hint: "A pull factor is something good that draws people to a place.",
    emoji: "💼",
  },
  {
    prompt: "Which is a push factor that makes people want to leave a place?",
    right: "war or conflict",
    wrong: ["good schools", "a safe neighbourhood", "family living nearby"],
    hint: "A push factor is a problem that pushes people away.",
  },
  {
    prompt: "Rural areas are…",
    right: "countryside areas with farms and small communities",
    wrong: ["big cities with tall buildings", "areas under the ocean", "the downtown core of a city"],
    hint: "Rural is the opposite of urban.",
    emoji: "🌾",
  },
  {
    prompt: "Where do most Canadians live today?",
    right: "in urban areas (cities and towns)",
    wrong: ["on farms", "in the far North", "on small islands"],
    hint: "About 4 out of 5 people in Canada live in urban areas.",
    emoji: "🏙️",
  },
  {
    prompt: "Which is a challenge when a city grows very quickly?",
    right: "not enough affordable housing",
    wrong: ["too many empty roads", "too few customers for stores", "too much open space"],
    hint: "When many people arrive at once, homes, roads and services can't keep up.",
  },
  {
    prompt: "What do we call moving from one place to another within the same country?",
    right: "internal migration",
    wrong: ["immigration", "globalization", "urban farming"],
    hint: "Internal means inside. The person doesn't cross a border into another country.",
  },
  {
    prompt: "A megacity is a city with more than…",
    right: "10 million people",
    wrong: ["1,000 people", "100,000 people", "1 billion people"],
    hint: "Megacities are the giants of the urban world. There are only a few dozen on Earth.",
    emoji: "🏙️",
    hard: true,
  },
  {
    prompt: "Today, more than half of the world's people live…",
    right: "in urban areas",
    wrong: ["on farms", "on islands", "in the Arctic"],
    hint: "Urbanization has been happening around the world for more than 200 years.",
    emoji: "🌐",
    hard: true,
  },
  {
    prompt: "Money that migrants send home to family in another country is called…",
    right: "remittances",
    wrong: ["tariffs", "taxes", "exports"],
    hint: "For many families and some countries, this money is a very important source of income.",
    hard: true,
  },
  {
    prompt: "Which United Nations agency works to protect refugees?",
    right: "UNHCR, the UN Refugee Agency",
    wrong: ["UNESCO", "the World Trade Organization", "the World Bank"],
    hint: "Its full name is the Office of the United Nations High Commissioner for Refugees.",
    hard: true,
  },
  {
    prompt: "Informal settlements (sometimes called slums) grow when…",
    right: "cities grow faster than affordable housing can be built",
    wrong: ["too few people move to a city", "cities have too many parks", "farms grow too much food"],
    hint: "People who can't find or afford housing may build their own shelters on unused land.",
    hard: true,
  },
  {
    prompt: "People forced to move by rising seas, droughts or stronger storms are sometimes called…",
    right: "climate migrants",
    wrong: ["tourists", "commuters", "ambassadors"],
    hint: "Changes in climate can make some places harder to live in.",
    emoji: "🌊",
    hard: true,
  },
  {
    prompt: "In recent decades, most of Canada's population growth has come from…",
    right: "immigration",
    wrong: ["people moving from cities to farms", "people leaving Canada", "longer summers"],
    hint: "Each year, many people from around the world move to Canada to live.",
    emoji: "🍁",
    hard: true,
  },
  {
    prompt: "One way growing cities try to reduce traffic jams is to…",
    right: "build better public transit, like buses and trains",
    wrong: ["remove all sidewalks", "close every bike lane", "build homes far from jobs"],
    hint: "When many people can ride together, fewer cars are on the road.",
    emoji: "🚌",
    hard: true,
  },
];

function citiesAndMigration({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return shuffle([
    sortQuestion(MIGRATION_SORT, perBin(difficulty)),
    populationQ(difficulty),
    oneOf(MOVE_ITEMS, difficulty),
    ...levelled(MIGRATION_BANK, 5, difficulty),
  ]);
}

// ---------- Global Challenges ----------

const ACTOR_SORT: SortSet = {
  prompt: "Who is taking action: an individual, a government or an NGO? Tap an item, then tap its basket.",
  hint: "Individuals are single people or families. Governments make laws and run public programs. NGOs are non-profit groups that aren't part of any government.",
  bins: [
    { id: "person", label: "individual", emoji: "🙂" },
    { id: "gov", label: "government", emoji: "🏛️" },
    { id: "ngo", label: "NGO (non-profit group)", emoji: "🤝" },
  ],
  items: [
    { label: "a student organizes a food drive", emoji: "🥫", bin: "person" },
    { label: "a teen volunteers at a shelter", emoji: "🙋", bin: "person" },
    { label: "a family donates warm coats", emoji: "🧥", bin: "person" },
    { label: "a country passes a law banning some plastic bags", emoji: "📜", bin: "gov" },
    { label: "a national government pays for free vaccines", emoji: "💉", bin: "gov" },
    { label: "a government sends emergency supplies after an earthquake", emoji: "📦", bin: "gov" },
    { label: "a non-profit charity builds wells in villages", emoji: "🚰", bin: "ngo" },
    { label: "a volunteer doctors' group runs clinics in disaster zones", emoji: "🩺", bin: "ngo" },
    { label: "an environmental group plants trees", emoji: "🌳", bin: "ngo" },
  ],
};

const VILLAGES = ["Hillside", "Lakeview", "Riverbend", "Sunvale"];
const NEEDS = [
  { column: "Homes with clean water", project: "a clean-water project" },
  { column: "Children in school", project: "a new school" },
  { column: "Homes with electricity", project: "solar panels for electricity" },
];

function villageQ(d: Level): Question {
  const n = d === 1 ? 3 : 4;
  const names = VILLAGES.slice(0, n);
  const values = NEEDS.map(() => sample([30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95], n));
  const k = randInt(0, NEEDS.length - 1);
  const worst = values[k].indexOf(Math.min(...values[k]));
  return textChoice(
    `A charity can pay for ${NEEDS[k].project} in one village. Based on the data, which village needs it most?`,
    names[worst],
    names.filter((_, i) => i !== worst),
    `Look down the “${NEEDS[k].column}” column and find the lowest percentage.`,
    {
      type: "table",
      title: `Survey of ${n === 3 ? "three" : "four"} made-up villages`,
      headers: ["Village", ...NEEDS.map((x) => x.column)],
      rows: names.map((v, i) => [v, ...values.map((col) => `${col[i]}%`)]),
    },
  );
}

const OZONE_PASSAGE: Visual = {
  type: "passage",
  title: "A Global Success Story",
  paragraphs: [
    "High above Earth, a layer of ozone gas blocks much of the Sun's harmful ultraviolet (UV) light. In the 1980s, scientists discovered that this ozone layer was getting dangerously thin, especially over Antarctica.",
    "The cause was a group of chemicals called CFCs, which were used in fridges, air conditioners and spray cans. No single country could fix the problem alone, because the chemicals drifted around the whole planet.",
    "In 1987, countries signed an agreement called the Montreal Protocol to phase out these chemicals. Over time, every member country of the United Nations joined. Companies had to invent new ways to make fridges and sprays, which took time and money.",
    "Today, scientists report that the ozone layer is slowly healing and is expected to recover over the coming decades.",
  ],
};

const OZONE_ITEMS: Item[] = [
  {
    prompt: "What does the ozone layer do?",
    right: "blocks much of the Sun's harmful UV light",
    wrong: ["keeps the oceans salty", "makes rain clouds", "holds the Moon in orbit"],
    hint: "Look at the first sentence of the passage.",
    visual: OZONE_PASSAGE,
  },
  {
    prompt: "Why couldn't one country solve the ozone problem alone?",
    right: "The chemicals drifted around the whole planet",
    wrong: ["Only one country used CFCs", "The ozone layer is above only one country", "Scientists never found the cause"],
    hint: "Look at the second paragraph.",
    visual: OZONE_PASSAGE,
  },
  {
    prompt: "Why was the Montreal Protocol a difficult choice for countries?",
    right: "Companies had to spend time and money replacing CFCs",
    wrong: ["It made the ozone layer thinner", "It banned fridges forever", "Only scientists were allowed to sign it"],
    hint: "Look at the third paragraph. Solving global problems often has costs.",
    visual: OZONE_PASSAGE,
    hard: true,
  },
  {
    prompt: "What does this passage show about global problems?",
    right: "International cooperation can solve problems no country could solve alone",
    wrong: ["Global problems can never be solved", "One country should make all the decisions", "Science can't help with global problems"],
    hint: "Think about what happened after every country joined the agreement.",
    visual: OZONE_PASSAGE,
    hard: true,
  },
];

const GLOBAL_BANK: Item[] = [
  {
    prompt: "What does NGO stand for?",
    right: "non-governmental organization",
    wrong: ["national government office", "new global order", "northern growth organization"],
    hint: "NGOs are groups that work for a cause but aren't run by any government.",
    emoji: "🤝",
  },
  {
    prompt: "When was the United Nations founded?",
    right: "1945, after the Second World War",
    wrong: ["1867, when Canada became a country", "1982, with the Charter", "2001, at the start of the century"],
    hint: "Countries created the UN right after a terrible world war, hoping to prevent another.",
  },
  {
    prompt: "What is the main purpose of the United Nations?",
    right: "to keep peace and help countries work together",
    wrong: ["to run one government for the whole world", "to build roads in every country", "to sell goods between countries"],
    hint: "Almost every country is a member. They meet to solve problems that cross borders.",
    emoji: "🕊️",
  },
  {
    prompt: "Which UN agency works for children around the world?",
    right: "UNICEF",
    wrong: ["the World Trade Organization", "the Canadian Space Agency", "the World Bank"],
    hint: "This agency helps children get health care, clean water, education and protection.",
  },
  {
    prompt: "Which UN agency focuses on health, such as fighting diseases?",
    right: "the World Health Organization (WHO)",
    wrong: ["UNESCO", "the World Trade Organization", "the International Space Station"],
    hint: "Its name says what it's about.",
    emoji: "🩺",
  },
  {
    prompt: "What is poverty?",
    right: "not having enough money or resources to meet basic needs",
    wrong: ["having more than you need", "living in a city", "owning a small car"],
    hint: "Basic needs include food, clean water, shelter, health care and education.",
  },
  {
    prompt: "Which helps families move out of poverty over time?",
    right: "access to education",
    wrong: ["fewer schools", "higher food prices", "less clean water"],
    hint: "Education helps people find better jobs and stay healthier.",
    emoji: "🏫",
  },
  {
    prompt: "Why do problems like climate change need international cooperation?",
    right: "Their effects cross borders, so countries must work together",
    wrong: ["Only one country causes them", "One person can solve them alone", "They only affect cities"],
    hint: "The air and oceans are shared by everyone on Earth.",
    emoji: "🌍",
  },
  {
    prompt: "Burning fossil fuels like oil, coal and gas adds which gas to the air, warming the planet?",
    right: "carbon dioxide",
    wrong: ["oxygen", "helium", "nitrogen"],
    hint: "This greenhouse gas traps heat in the atmosphere.",
    emoji: "🏭",
  },
  {
    prompt: "What is one way an individual can help with a global problem?",
    right: "volunteer, donate or raise awareness",
    wrong: ["ignore the news", "waste more food", "throw recycling in the garbage"],
    hint: "Small actions add up when many people take part.",
    emoji: "🙋",
  },
  {
    prompt: "What does inequality mean?",
    right: "an unfair gap, such as some people having far more money or opportunity than others",
    wrong: ["everyone having exactly the same", "a law that treats people equally", "a kind of weather pattern"],
    hint: "In-equality means not equal.",
  },
  {
    prompt: "Why is plastic in the ocean a global problem?",
    right: "Currents carry it around the world and it harms sea life",
    wrong: ["Plastic dissolves quickly in water", "It stays on just one beach", "Fish need plastic to survive"],
    hint: "Plastic breaks into tiny pieces but doesn't go away, and ocean currents spread it far.",
    emoji: "🐢",
  },
  {
    prompt: "In 2015, UN members agreed to 17 Sustainable Development Goals. What is Goal 1?",
    right: "No poverty",
    wrong: ["Build more highways", "Explore Mars", "Use more plastic"],
    hint: "The first goal is about the problem that affects basic needs most directly.",
    hard: true,
  },
  {
    prompt: "The Sustainable Development Goals aim to be reached by which year?",
    right: "2030",
    wrong: ["1990", "2000", "2100"],
    hint: "The goals were set in 2015 for about 15 years.",
    hard: true,
  },
  {
    prompt: "The Paris Agreement (2015) is an international agreement about…",
    right: "limiting climate change",
    wrong: ["sharing fishing rights", "building the space station", "the rights of the child"],
    hint: "Countries agreed to cut greenhouse gases to slow global warming.",
    emoji: "🌡️",
    hard: true,
  },
  {
    prompt: "A small loan that helps someone start a tiny business, like selling vegetables, is called a…",
    right: "microloan",
    wrong: ["mortgage", "tariff", "pension"],
    hint: "Micro means very small.",
    hard: true,
  },
  {
    prompt: "Why is educating girls an important way to reduce poverty?",
    right: "Educated girls tend to earn more and raise healthier families",
    wrong: ["It makes schools more crowded", "It reduces the number of jobs", "It has no effect on poverty"],
    hint: "In some places, girls are less likely to finish school. Closing that gap helps whole communities.",
    hard: true,
  },
  {
    prompt: "Why is cutting down rainforests a global problem?",
    right: "Trees store carbon and forests are home to many species",
    wrong: ["Rainforests are found in only one country", "Trees cause pollution", "Forests block sunlight from cities"],
    hint: "Forests affect the climate and biodiversity of the whole planet.",
    emoji: "🌳",
    hard: true,
  },
  {
    prompt: "A country must choose between protecting a forest and allowing logging that creates jobs. This shows that global problems involve…",
    right: "difficult choices with trade-offs",
    wrong: ["easy answers everyone agrees on", "no effect on people", "only one possible solution"],
    hint: "A trade-off means gaining one thing by giving up another.",
    hard: true,
  },
  {
    prompt: "What is the difference between absolute and relative poverty?",
    right: "Absolute poverty means lacking basic needs; relative poverty means having much less than most people around you",
    wrong: [
      "Relative poverty means lacking basic needs; absolute poverty means having less than your neighbours",
      "They mean exactly the same thing",
      "Absolute poverty only happens in cities",
    ],
    hint: "Absolute is about basic survival needs. Relative compares you to others in your society.",
    hard: true,
  },
  {
    prompt: "The World Food Programme, which won the Nobel Peace Prize in 2020, works to…",
    right: "fight hunger around the world",
    wrong: ["build rockets", "set trade rules", "run elections"],
    hint: "Its name says what it does.",
    hard: true,
  },
];

function globalChallenges({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return shuffle([
    sortQuestion(ACTOR_SORT, 2),
    villageQ(difficulty),
    oneOf(OZONE_ITEMS, difficulty),
    ...levelled(GLOBAL_BANK, 5, difficulty),
  ]);
}

// ---------- Governments & Rights ----------

const GOV_SORT: SortSet = {
  prompt: "Is it more typical of a democracy or a dictatorship? Tap an item, then tap its basket.",
  hint: "In a democracy, citizens choose leaders and their rights are protected by law. In a dictatorship, one ruler holds power without free elections and can limit people's rights.",
  bins: [
    { id: "dem", label: "democracy", emoji: "🗳️" },
    { id: "dict", label: "dictatorship", emoji: "👤" },
  ],
  items: [
    { label: "citizens vote in free and fair elections", emoji: "🗳️", bin: "dem" },
    { label: "people can criticize leaders without being punished", emoji: "🗣️", bin: "dem" },
    { label: "newspapers report freely on the government", emoji: "📰", bin: "dem" },
    { label: "leaders must follow the same laws as everyone", emoji: "⚖️", bin: "dem" },
    { label: "power changes hands peacefully after elections", emoji: "🤝", bin: "dem" },
    { label: "one leader holds power with no real elections", emoji: "🚫", bin: "dict" },
    { label: "the ruler controls what the news can say", emoji: "📺", bin: "dict" },
    { label: "people can be jailed for peaceful protest", emoji: "🔒", bin: "dict" },
    { label: "the leader can rule for life with no limits", emoji: "♾️", bin: "dict" },
    { label: "laws change whenever the ruler wants", emoji: "📜", bin: "dict" },
  ],
};

interface GovSystem {
  name: string;
  desc: string;
  hint: string;
  core?: true;
}

const SYSTEMS: GovSystem[] = [
  {
    name: "representative democracy",
    desc: "Citizens elect people to make laws and decisions for them.",
    hint: "Canada is a representative democracy: voters elect Members of Parliament and other representatives.",
    core: true,
  },
  {
    name: "direct democracy",
    desc: "Citizens vote on each law themselves instead of electing representatives.",
    hint: "Ancient Athens used this system. Today, a referendum is a small taste of it.",
    core: true,
  },
  {
    name: "constitutional monarchy",
    desc: "A king or queen is head of state, but a constitution limits their power and elected officials make the laws.",
    hint: "Canada is a constitutional monarchy. The King is head of state, but elected governments make the decisions.",
    core: true,
  },
  {
    name: "dictatorship",
    desc: "One person holds power without free elections and rules with few limits.",
    hint: "Dictators often control the media and limit people's rights so no one can challenge them.",
    core: true,
  },
  {
    name: "absolute monarchy",
    desc: "A king or queen holds nearly all the power, and the role is passed down in the family.",
    hint: "Absolute means complete. Unlike a constitutional monarch, this ruler's power is not limited by a constitution.",
  },
  {
    name: "oligarchy",
    desc: "A small group of powerful people, such as the very wealthy or military leaders, controls the government.",
    hint: "Oligarchy comes from Greek words meaning “rule by a few”.",
  },
  {
    name: "consensus government",
    desc: "Elected members work without political parties and try to reach decisions everyone can accept.",
    hint: "In Canada, the Northwest Territories and Nunavut use consensus government.",
  },
];

function systemQ(d: Level): Question {
  const pool = d === 1 ? SYSTEMS.filter((s) => s.core) : SYSTEMS;
  const s = pick(pool);
  return textChoice(
    `“${s.desc}” Which system of government is this?`,
    s.name,
    sample(
      pool.filter((o) => o !== s),
      3,
    ).map((o) => o.name),
    s.hint,
    { type: "emoji", emoji: "🏛️" },
  );
}

const CHILD_RIGHTS = [
  { right: "the right to education", scenario: "Every child in a community can go to school for free." },
  { right: "the right to be heard", scenario: "A school asks students for their ideas before redesigning the playground." },
  { right: "the right to rest and play", scenario: "Children get time each day to relax, play and enjoy their hobbies." },
  { right: "the right to a name and nationality", scenario: "A newborn baby is officially registered with a name and a country." },
  { right: "the right to health care", scenario: "A child who is sick can see a doctor and get the medicine she needs." },
  { right: "the right to protection from harmful work", scenario: "Laws stop children from doing dangerous jobs in mines and factories." },
  { right: "the right to their own culture and language", scenario: "An Indigenous student learns her Nation's language at school." },
];

function rightsQ(): Question {
  const r = pick(CHILD_RIGHTS);
  return textChoice(
    `“${r.scenario}” Which right from the UN Convention on the Rights of the Child does this protect?`,
    r.right,
    sample(
      CHILD_RIGHTS.filter((o) => o !== r),
      3,
    ).map((o) => o.right),
    "The Convention on the Rights of the Child lists rights that every person under 18 should have. Match what is happening to the child with the right it protects.",
    { type: "emoji", emoji: "🧒" },
  );
}

const GOV_BANK: Item[] = [
  {
    prompt: "In a democracy, who holds the power to choose leaders?",
    right: "the citizens, by voting",
    wrong: ["one ruler alone", "the army", "the richest family"],
    hint: "Demo- comes from a Greek word for “the people”.",
    emoji: "🗳️",
  },
  {
    prompt: "Canada is a constitutional monarchy and a…",
    right: "parliamentary democracy",
    wrong: ["dictatorship", "absolute monarchy", "direct democracy"],
    hint: "Canadians elect Members of Parliament, and the party that can win votes in Parliament forms the government.",
    emoji: "🍁",
  },
  {
    prompt: "Who is the head of government in Canada?",
    right: "the Prime Minister",
    wrong: ["the King", "the Governor General", "the Chief Justice"],
    hint: "The King is head of state, but the leader who runs the government day to day is the Prime Minister.",
    emoji: "🍁",
  },
  {
    prompt: "What is the Universal Declaration of Human Rights?",
    right: "a 1948 UN document listing rights every person should have",
    wrong: ["Canada's first constitution", "a trade deal between countries", "a set of rules for the Olympics"],
    hint: "Universal means for everyone, everywhere.",
    emoji: "📜",
  },
  {
    prompt: "The UN Convention on the Rights of the Child protects everyone under what age?",
    right: "18",
    wrong: ["12", "16", "21"],
    hint: "The Convention defines a child as anyone below the age of adulthood used in most countries.",
    emoji: "🧒",
  },
  {
    prompt: "Which of these is a human right?",
    right: "freedom of expression",
    wrong: ["owning a car", "having a phone", "a vacation every year"],
    hint: "Human rights are basic freedoms and protections that belong to every person.",
  },
  {
    prompt: "What is the Canadian Charter of Rights and Freedoms?",
    right: "part of Canada's Constitution that protects people's rights",
    wrong: ["a UN treaty about trade", "a list of provincial capitals", "a law about sports"],
    hint: "It became part of Canada's Constitution in 1982.",
    emoji: "📜",
  },
  {
    prompt: "Which freedom lets people gather peacefully to share their views?",
    right: "freedom of peaceful assembly",
    wrong: ["freedom of movement", "freedom from taxes", "freedom to break laws"],
    hint: "To assemble means to come together as a group.",
  },
  {
    prompt: "You have the right to free speech. What responsibility comes with it?",
    right: "respecting other people's right to speak too",
    wrong: ["shouting over people you disagree with", "never sharing your opinion", "making others agree with you"],
    hint: "Rights come with responsibilities to respect the rights of others.",
    emoji: "🗣️",
  },
  {
    prompt: "What does the “rule of law” mean?",
    right: "everyone, including leaders, must follow the law",
    wrong: ["leaders don't have to follow laws", "only police follow laws", "laws change every day"],
    hint: "No one is above the law, not even the most powerful person.",
    emoji: "⚖️",
  },
  {
    prompt: "A Canadian, John Humphrey, wrote the first draft of which important document?",
    right: "the Universal Declaration of Human Rights",
    wrong: ["the Charter of Rights and Freedoms", "the Montreal Protocol", "the Paris Agreement"],
    hint: "He was a law professor who worked at the United Nations in the 1940s.",
    hard: true,
  },
  {
    prompt: "Which branch of government interprets laws and decides cases?",
    right: "the judicial branch (the courts)",
    wrong: ["the legislative branch", "the executive branch", "the media"],
    hint: "Judges work in this branch.",
    emoji: "⚖️",
    hard: true,
  },
  {
    prompt: "Which branch of government makes new laws?",
    right: "the legislative branch",
    wrong: ["the judicial branch", "the courts", "the police"],
    hint: "In Canada, Parliament and the provincial legislatures make laws.",
    hard: true,
  },
  {
    prompt: "In Canada, who represents the King?",
    right: "the Governor General",
    wrong: ["the Prime Minister", "the Speaker of the House", "a city mayor"],
    hint: "This person carries out the King's duties in Canada, such as giving Royal Assent to new laws.",
    hard: true,
  },
  {
    prompt: "Why do dictatorships often control newspapers and the internet?",
    right: "to stop people from hearing criticism of the leader",
    wrong: ["to make the news more accurate", "to help citizens vote", "to protect freedom of speech"],
    hint: "A free press can expose problems and hold leaders accountable.",
    emoji: "📰",
    hard: true,
  },
  {
    prompt: "Which is a democratic right protected by the Canadian Charter?",
    right: "the right of citizens to vote in elections",
    wrong: ["the right to drive at any age", "the right to free video games", "the right to never pay taxes"],
    hint: "Democratic rights are about taking part in choosing the government.",
    emoji: "🗳️",
    hard: true,
  },
  {
    prompt: "December 10 is Human Rights Day because on that date in 1948…",
    right: "the UN adopted the Universal Declaration of Human Rights",
    wrong: ["Canada became a country", "the United Nations was founded", "the Charter became law"],
    hint: "Think about which famous human rights document is from 1948.",
    hard: true,
  },
  {
    prompt: "How do systems of government differ in protecting human rights?",
    right: "Democracies usually protect rights with laws, courts and a free press; dictatorships often limit them",
    wrong: [
      "Dictatorships usually protect rights better than democracies",
      "All governments protect rights equally",
      "No government has anything to do with rights",
    ],
    hint: "Think about who can check a leader's power in each system.",
    hard: true,
  },
  {
    prompt: "The UN Declaration on the Rights of Indigenous Peoples (2007) recognizes rights such as…",
    right: "practising and revitalizing their cultures and languages",
    wrong: ["running every country's army", "ignoring all laws", "owning all the world's oceans"],
    hint: "The declaration protects Indigenous peoples' cultures, languages, lands and self-determination.",
    hard: true,
  },
  {
    prompt: "Many First Nations govern themselves through self-government agreements. This means they…",
    right: "make their own decisions on matters like education, land and culture",
    wrong: ["have no government at all", "are ruled by another country", "cannot make any laws"],
    hint: "Self-government means a community has the authority to govern its own affairs.",
    hard: true,
  },
];

function governmentsAndRights({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return shuffle([
    sortQuestion(GOV_SORT, perBin(difficulty)),
    systemQ(difficulty),
    rightsQ(),
    ...levelled(GOV_BANK, 5, difficulty),
  ]);
}

// ---------- Trade & Globalization ----------

const TRADE_SORT: SortSet = {
  prompt: "From Canada's point of view, is it an import or an export? Tap an item, then tap its basket.",
  hint: "Exports are goods made in Canada and sold to other countries. Imports are goods made elsewhere and brought into Canada.",
  bins: [
    { id: "import", label: "import (comes into Canada)", emoji: "📥" },
    { id: "export", label: "export (leaves Canada)", emoji: "📤" },
  ],
  items: [
    { label: "bananas grown in Central America sold in Canadian stores", emoji: "🍌", bin: "import" },
    { label: "coffee beans from South America arriving in Canada", emoji: "☕", bin: "import" },
    { label: "phones made overseas sold in Canada", emoji: "📱", bin: "import" },
    { label: "oranges from a warm country in a Canadian grocery store", emoji: "🍊", bin: "import" },
    { label: "T-shirts sewn in Asia sold in a Canadian mall", emoji: "👕", bin: "import" },
    { label: "Canadian lumber shipped to Japan", emoji: "🪵", bin: "export" },
    { label: "Canadian wheat sold to other countries", emoji: "🌾", bin: "export" },
    { label: "maple syrup from Canada sold in Europe", emoji: "🍁", bin: "export" },
    { label: "Canadian potash sent to farms overseas", emoji: "🚢", bin: "export" },
    { label: "fish caught off Canada's coast sold abroad", emoji: "🐟", bin: "export" },
  ],
};

const PRODUCTS = ["lumber", "wheat", "fish", "cars", "phones", "clothing", "minerals", "machinery"];

function tradeQ(d: Level): Question {
  const products = sample(PRODUCTS, 3);
  const values = sample([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 18, 20], 6);
  const exports = values.slice(0, 3);
  const imports = values.slice(3);
  if (d === 1) {
    const best = exports.indexOf(Math.max(...exports));
    return textChoice(
      "Which product is Norland's biggest export?",
      products[best],
      products.filter((_, i) => i !== best),
      "Find the largest number in the Exports column.",
      {
        type: "table",
        title: "Norland's exports (a made-up country)",
        headers: ["Product", "Exports ($ billions)"],
        rows: products.map((p, i) => [p, exports[i]]),
      },
    );
  }
  const visual: Visual = {
    type: "table",
    title: "Norland's trade (a made-up country)",
    headers: ["Product", "Exports ($ billions)", "Imports ($ billions)"],
    rows: products.map((p, i) => [p, exports[i], imports[i]]),
  };
  const totalOut = exports.reduce((a, b) => a + b, 0);
  const totalIn = imports.reduce((a, b) => a + b, 0);
  if (d === 2 || totalOut === totalIn) {
    const q: InputQuestion = {
      kind: "input",
      prompt: "What is the total value of all of Norland's exports, in billions of dollars?",
      hint: "Add up every number in the Exports column.",
      visual,
      answer: String(totalOut),
      keypad: "number",
      suffix: "billion dollars",
    };
    return q;
  }
  const gap = Math.abs(totalOut - totalIn);
  const kind = totalOut > totalIn ? "surplus" : "deficit";
  const other = kind === "surplus" ? "deficit" : "surplus";
  return textChoice(
    "Add up each column. Does Norland have a trade surplus or a trade deficit?",
    `a trade ${kind} of $${gap} billion`,
    [`a trade ${other} of $${gap} billion`, `a trade ${kind} of $${totalOut + totalIn} billion`, "balanced trade"],
    "A trade surplus means a country exports more than it imports. A trade deficit means it imports more than it exports. Subtract the smaller total from the larger one.",
    visual,
  );
}

const SHIRT_PASSAGE: Visual = {
  type: "passage",
  title: "The Journey of a T-shirt",
  paragraphs: [
    "Before a T-shirt reaches a store in Canada, it may travel around the world. The cotton might be grown in one country, spun into thread in a second, and sewn into a shirt in a third, where wages are lower. Finally, the shirt is shipped across the ocean to be sold.",
    "This worldwide web of trade is part of globalization. It can make clothes cheaper for shoppers and create jobs in many countries. But it can also have costs: some factory workers are paid very little or work in unsafe conditions, and shipping goods long distances adds pollution.",
    "Some shoppers look for fair-trade labels or buy second-hand clothes. Some governments and companies set rules for safer factories. People disagree about the best balance between low prices, fair wages and the environment.",
  ],
};

const SHIRT_ITEMS: Item[] = [
  {
    prompt: "Which benefit of globalization does the passage mention?",
    right: "cheaper clothes and jobs in many countries",
    wrong: ["pollution from shipping", "unsafe factories", "very low wages"],
    hint: "Look in the second paragraph for what globalization “can” do that helps people.",
    visual: SHIRT_PASSAGE,
  },
  {
    prompt: "Which cost of globalization does the passage mention?",
    right: "pollution from shipping goods long distances",
    wrong: ["cheaper clothes", "jobs in many countries", "more second-hand stores"],
    hint: "Look for the word “costs” in the second paragraph.",
    visual: SHIRT_PASSAGE,
  },
  {
    prompt: "Why might a company have its shirts sewn in a faraway country?",
    right: "Wages and costs are lower there",
    wrong: ["Cotton can only be sewn near an ocean", "The law requires it", "Shipping is free"],
    hint: "Look at the end of the first sentence about where the shirt is sewn.",
    visual: SHIRT_PASSAGE,
    hard: true,
  },
  {
    prompt: "What does the passage say about the best balance between prices, wages and the environment?",
    right: "People disagree about it",
    wrong: ["Everyone agrees low prices matter most", "The problem has been completely solved", "Only factory owners can decide"],
    hint: "Read the last sentence carefully.",
    visual: SHIRT_PASSAGE,
    hard: true,
  },
];

const TRADE_BANK: Item[] = [
  {
    prompt: "What is an export?",
    right: "a good or service sold to another country",
    wrong: ["a good bought from another country", "a tax on imported goods", "something made and used at home"],
    hint: "Ex- means out. Exports go out of a country.",
    emoji: "📤",
  },
  {
    prompt: "What is an import?",
    right: "a good or service bought from another country",
    wrong: ["a good sold to another country", "a tax paid by farmers", "a product that never leaves the factory"],
    hint: "Im- means in. Imports come into a country.",
    emoji: "📥",
  },
  {
    prompt: "What is globalization?",
    right: "the growing connection of countries through trade, travel and technology",
    wrong: ["countries cutting all ties with each other", "making a globe for a classroom", "one country ruling the world"],
    hint: "Think of how products, ideas and people now move around the whole globe.",
    emoji: "🌐",
  },
  {
    prompt: "Which country is Canada's largest trading partner?",
    right: "the United States",
    wrong: ["Japan", "Brazil", "Australia"],
    hint: "This neighbour shares the world's longest land border with Canada.",
    emoji: "🍁",
  },
  {
    prompt: "In a market economy, who mostly decides what gets made and what it costs?",
    right: "businesses and shoppers, through supply and demand",
    wrong: ["the government decides everything", "elders, following long traditions", "a lottery"],
    hint: "In a market, buyers and sellers make choices that set prices.",
  },
  {
    prompt: "In a command economy, who makes most economic decisions?",
    right: "the government",
    wrong: ["shoppers", "small businesses", "each family on its own"],
    hint: "In a command economy, a central authority gives the orders about what to produce.",
  },
  {
    prompt: "Canada has a mixed economy. This means…",
    right: "it combines free markets with some government programs and rules",
    wrong: ["the government owns every business", "people trade only by bartering", "there are no rules at all"],
    hint: "Mixed means a combination: private businesses, plus public services like health care.",
    emoji: "🍁",
  },
  {
    prompt: "In a traditional economy, decisions are mostly based on…",
    right: "customs and the way things have long been done",
    wrong: ["what a government plan orders", "stock market prices", "online shopping trends"],
    hint: "Traditions are passed down from one generation to the next.",
  },
  {
    prompt: "A frost destroys much of the orange crop, but people still want oranges. The price of oranges will most likely…",
    right: "go up",
    wrong: ["go down", "stay exactly the same", "drop to zero"],
    hint: "When supply falls and demand stays the same, the price usually rises.",
    emoji: "🍊",
  },
  {
    prompt: "Which natural resource does Canada export in large amounts?",
    right: "lumber from forests",
    wrong: ["bananas", "coffee beans", "cocoa"],
    hint: "Canada has huge forests. The other choices grow in warm, tropical places.",
    emoji: "🪵",
  },
  {
    prompt: "Why do countries trade with each other?",
    right: "to get goods they can't easily make and sell what they make well",
    wrong: ["to stop all travel", "because trading is required by the UN", "to make every country the same"],
    hint: "No country can efficiently make everything its people need.",
    emoji: "🚢",
  },
  {
    prompt: "What is a tariff?",
    right: "a tax on imported goods",
    wrong: ["a gift between countries", "a type of passport", "a free trade agreement"],
    hint: "Tariffs make imported goods more expensive, often to protect local businesses.",
    hard: true,
  },
  {
    prompt: "How can tariffs lead to conflict between countries?",
    right: "One country's tariffs may lead the other to add tariffs back, starting a trade dispute",
    wrong: ["Tariffs always make both countries richer", "Tariffs remove all trade rules", "Tariffs only affect the weather"],
    hint: "Each country is looking out for its own economy, which can lead to back-and-forth disputes.",
    hard: true,
  },
  {
    prompt: "Two countries both want the fish in the waters between them. This is an example of…",
    right: "economic self-interest that can cause conflict",
    wrong: ["a traditional economy", "a balanced budget", "urbanization"],
    hint: "When valuable resources are shared, each side may want more for itself.",
    emoji: "🐟",
    hard: true,
  },
  {
    prompt: "What does a free trade agreement usually do?",
    right: "lowers or removes tariffs between the countries that sign it",
    wrong: ["makes all trade illegal", "creates one shared government", "makes everyone use the same money"],
    hint: "Canada, the United States and Mexico have a free trade agreement with each other.",
    hard: true,
  },
  {
    prompt: "What is a trade deficit?",
    right: "when a country imports more than it exports",
    wrong: ["when a country exports more than it imports", "when trade is exactly balanced", "when a country stops trading"],
    hint: "A deficit means falling short: more money goes out for imports than comes in from exports.",
    hard: true,
  },
  {
    prompt: "What does a fair-trade label on chocolate mean?",
    right: "the cocoa farmers were paid a fair, agreed price",
    wrong: ["the chocolate is free", "the chocolate was made in Canada", "the chocolate has no sugar"],
    hint: "Fair trade is about how the people who grow the product are treated and paid.",
    emoji: "🍫",
    hard: true,
  },
  {
    prompt: "Which is a concern some people have about globalization?",
    right: "Jobs can move to countries where wages are lower",
    wrong: ["Prices for many goods can go down", "People can learn about other cultures", "Shoppers have more choices"],
    hint: "The other choices are benefits. Look for a possible cost.",
    hard: true,
  },
  {
    prompt: "Before a project like a mine is approved on lands where Indigenous peoples have rights, governments in Canada have a duty to…",
    right: "consult the Indigenous peoples affected",
    wrong: ["keep the project secret", "ask only the mining company", "build it without asking anyone"],
    hint: "Canadian courts have ruled that governments must consult, and sometimes accommodate, Indigenous peoples whose rights could be affected.",
    hard: true,
  },
  {
    prompt: "What is a supply chain?",
    right: "all the steps a product goes through, from raw materials to the store",
    wrong: ["a chain used to lock up supplies", "a list of store prices", "a line of trucks on a highway"],
    hint: "Think of a T-shirt: cotton farm, thread factory, sewing factory, ship, store.",
    hard: true,
  },
];

function tradeAndGlobalization({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return shuffle([
    sortQuestion(TRADE_SORT, perBin(difficulty)),
    tradeQ(difficulty),
    oneOf(SHIRT_ITEMS, difficulty),
    ...levelled(TRADE_BANK, 5, difficulty),
  ]);
}

// ---------- Media Literacy ----------

const FACT_SORT: SortSet = {
  prompt: "Fact or opinion? Tap an item, then tap its basket.",
  hint: "A fact can be checked and proven true. An opinion tells what someone thinks or feels, and others might disagree.",
  bins: [
    { id: "fact", label: "fact", emoji: "✅" },
    { id: "opinion", label: "opinion", emoji: "💭" },
  ],
  items: [
    { label: "The United Nations was founded in 1945.", emoji: "🏛️", bin: "fact" },
    { label: "Canada has 10 provinces and 3 territories.", emoji: "🍁", bin: "fact" },
    { label: "Water freezes at 0°C.", emoji: "🧊", bin: "fact" },
    { label: "The Pacific is the largest ocean.", emoji: "🌊", bin: "fact" },
    { label: "The Charter of Rights and Freedoms became law in 1982.", emoji: "📜", bin: "fact" },
    { label: "Summer is the best season.", emoji: "☀️", bin: "opinion" },
    { label: "The new park downtown is boring.", emoji: "🌳", bin: "opinion" },
    { label: "Hockey is the most exciting sport.", emoji: "🏒", bin: "opinion" },
    { label: "That movie was the funniest ever made.", emoji: "🎬", bin: "opinion" },
    { label: "Homework is a waste of time.", emoji: "📚", bin: "opinion" },
  ],
};

const BIKE_ARTICLE: Visual = {
  type: "passage",
  title: "New Bike Lanes Open Downtown",
  paragraphs: [
    "(1) The city opened 12 km of new bike lanes on Monday.",
    "(2) The project cost $3 million and took two years to build.",
    "(3) These amazing lanes are the best thing the city has ever done.",
    "(4) Some store owners say they worry that losing parking spots will hurt their business.",
    "(5) City staff will count how many cyclists use the lanes this summer.",
  ],
};

const DRINK_PAGE: Visual = {
  type: "passage",
  title: "Miracle Drink Makes Kids Smarter!",
  paragraphs: [
    "A website claims that drinking one bottle of a new fizzy drink each day will make kids smarter in just one week.",
    "The page shows a photo of a smiling student holding a trophy, but it does not name any scientists or studies.",
    "At the bottom, in small print, it says the page is paid for by the company that sells the drink.",
    "The page has thousands of shares, and many comments say, “This really works!”",
  ],
};

const FLOOD_NEWS: Visual = {
  type: "passage",
  title: "News After the Flood",
  paragraphs: [
    "When heavy rain flooded a river valley, TV reporters and local newspapers shared live updates about road closures and emergency shelters.",
    "Videos of volunteers filling sandbags spread quickly online. Within a week, people across the country had donated food, blankets and money.",
    "But not every post was accurate. Some people shared dramatic photos that were really from a different flood years earlier, and a false rumour claimed that a dam had broken.",
    "Emergency officials posted corrections and reminded people to check official sources before sharing.",
  ],
};

const ARTICLE_ITEMS: Item[] = [
  {
    prompt: "Which sentence in the article is an opinion?",
    right: "Sentence 3: “These amazing lanes are the best thing the city has ever done.”",
    wrong: [
      "Sentence 1: “The city opened 12 km of new bike lanes on Monday.”",
      "Sentence 2: “The project cost $3 million and took two years to build.”",
      "Sentence 5: “City staff will count how many cyclists use the lanes this summer.”",
    ],
    hint: "An opinion can't be proven. Look for words that judge, like “amazing” or “best”.",
    visual: BIKE_ARTICLE,
  },
  {
    prompt: "Which words in the article show the writer's bias?",
    right: "“amazing” and “the best thing”",
    wrong: ["“12 km” and “Monday”", "“$3 million” and “two years”", "“this summer”"],
    hint: "Biased or loaded words show the writer's feelings instead of facts.",
    visual: BIKE_ARTICLE,
  },
  {
    prompt: "Sentence 4 reports what store owners think. Why does including it help the article?",
    right: "It shows more than one point of view",
    wrong: ["It proves the bike lanes are bad", "It turns the article into an advertisement", "It makes sentence 3 a fact"],
    hint: "Fair reporting includes the views of different people affected by a story.",
    visual: BIKE_ARTICLE,
    hard: true,
  },
  {
    prompt: "Why should you be suspicious of this web page?",
    right: "It's paid for by the seller and names no studies",
    wrong: ["It has a photo", "It's about a drink", "It was shared many times, so it must be true"],
    hint: "Ask: Who made this? Why? What evidence do they give?",
    visual: DRINK_PAGE,
  },
  {
    prompt: "The page has thousands of shares and lots of “This really works!” comments. What does that tell you?",
    right: "The claim is popular, not that it's true",
    wrong: ["Scientists have proven the claim", "The drink must be safe", "The page is a news report"],
    hint: "Lots of people can share something false. Popularity isn't evidence.",
    visual: DRINK_PAGE,
    hard: true,
  },
  {
    prompt: "What is the best way to check the drink's claim?",
    right: "Look for trusted health sources and scientific studies about it",
    wrong: ["Trust the comments", "Share it and ask friends", "Buy the drink and see"],
    hint: "Check with experts who have nothing to sell you.",
    visual: DRINK_PAGE,
    hard: true,
  },
  {
    prompt: "Which part of the passage shows media having a positive effect?",
    right: "Live updates on road closures and shelters helped people stay safe",
    wrong: ["Old photos from a different flood were shared", "A false rumour spread about a dam", "Some posts were inaccurate"],
    hint: "Look at the first two paragraphs.",
    visual: FLOOD_NEWS,
  },
  {
    prompt: "Which part of the passage shows media having a negative effect?",
    right: "Old photos and a false rumour were shared as if they were new and true",
    wrong: ["Volunteer videos inspired donations", "Officials posted corrections", "Reporters shared where the shelters were"],
    hint: "Look at the third paragraph.",
    visual: FLOOD_NEWS,
  },
  {
    prompt: "What did officials remind people to do?",
    right: "check official sources before sharing",
    wrong: ["share every post quickly", "stop watching the news", "post more dramatic photos"],
    hint: "Look at the last paragraph.",
    visual: FLOOD_NEWS,
    hard: true,
  },
];

function sourceQ(d: Level): Question {
  const n = d === 1 ? 3 : 4;
  const names = ["A", "B", "C", "D"].slice(0, n);
  const good = randInt(0, n - 1);
  type Flaw = "author" | "date" | "cites" | "selling";
  const rows = names.map((name, i) => {
    let flaws: Flaw[];
    if (i === good) flaws = [];
    // The stretch trap: everything looks right, but the source is selling something.
    else if (d === 3 && i === (good + 1) % n) flaws = ["selling"];
    else {
      flaws = sample<Flaw>(["author", "date", "cites"], d === 1 ? 2 : randInt(1, 2));
      if (chance(0.4)) flaws.push("selling");
    }
    const yes = (f: Flaw) => (flaws.includes(f) ? "no" : "yes");
    return [`Source ${name}`, yes("author"), yes("date"), yes("cites"), flaws.includes("selling") ? "yes" : "no"];
  });
  return textChoice(
    "Ana is researching ocean plastic for a school project. Which source is most likely to be reliable?",
    `Source ${names[good]}`,
    names.filter((_, i) => i !== good).map((x) => `Source ${x}`),
    "A reliable source has an expert author, is up to date, lists where its information came from, and isn't trying to sell you something.",
    {
      type: "table",
      title: "Checking sources",
      headers: ["Source", "Expert author?", "Up to date?", "Lists sources?", "Selling something?"],
      rows,
    },
  );
}

const MEDIA_BANK: Item[] = [
  {
    prompt: "What is a fact?",
    right: "a statement that can be checked and proven true",
    wrong: ["what someone feels or believes", "anything said on TV", "a post with lots of likes"],
    hint: "You can check a fact in a reliable source.",
  },
  {
    prompt: "What is an opinion?",
    right: "a statement of what someone thinks, feels or believes",
    wrong: ["a statement that is always true", "a number from a science test", "a date from history"],
    hint: "Opinions can't be proven true or false, and people can disagree about them.",
    emoji: "💭",
  },
  {
    prompt: "What is bias?",
    right: "favouring one side, often without showing others fairly",
    wrong: ["telling every side fairly", "a type of graph", "a correction to a story"],
    hint: "A biased story leans one way.",
  },
  {
    prompt: "What is misinformation?",
    right: "false or misleading information, often shared by people who think it's true",
    wrong: ["true information from experts", "a paid advertisement", "a kind of map"],
    hint: "Mis- means wrongly. It's information that's wrong, whether or not the sharer knows it.",
  },
  {
    prompt: "Which source is usually most reliable for health facts?",
    right: "a government health agency or hospital website",
    wrong: ["an anonymous comment", "a viral video with no source", "an ad for vitamins"],
    hint: "Choose experts who have nothing to sell and who list their evidence.",
    emoji: "🩺",
  },
  {
    prompt: "A headline says: “You WON'T BELIEVE what this cat did next!” What kind of headline is this?",
    right: "clickbait",
    wrong: ["a scientific report", "a correction", "a primary source"],
    hint: "Clickbait uses exciting or mysterious wording to get you to click.",
    emoji: "🐈",
  },
  {
    prompt: "Before sharing a surprising post, you should…",
    right: "check whether trusted sources report the same thing",
    wrong: ["share it right away", "add more exciting details", "read only the headline"],
    hint: "Stop and check before you share.",
    emoji: "🔍",
  },
  {
    prompt: "What is the purpose of most advertisements?",
    right: "to persuade you to buy or do something",
    wrong: ["to give a balanced view", "to report the news", "to correct mistakes"],
    hint: "Ads are made by people who want something from you.",
    emoji: "📺",
  },
  {
    prompt: "Which is a positive effect of media?",
    right: "It can quickly warn people about emergencies",
    wrong: ["It can spread rumours", "It can show only one side", "It can make false claims go viral"],
    hint: "Media can help or harm our understanding. Look for the helpful one.",
    emoji: "📻",
  },
  {
    prompt: "What is a primary source?",
    right: "a first-hand record, like a diary, photo or interview from the time",
    wrong: ["a textbook summary written much later", "an encyclopedia article", "a movie based on a true story"],
    hint: "Primary sources come straight from people who were there.",
  },
  {
    prompt: "What is the difference between misinformation and disinformation?",
    right: "Disinformation is false information spread on purpose; misinformation may be shared by mistake",
    wrong: [
      "Misinformation is spread on purpose; disinformation is always an accident",
      "They are both true information",
      "Disinformation is only found in newspapers",
    ],
    hint: "Dis- information is designed to deceive.",
    hard: true,
  },
  {
    prompt: "Checking what other trusted websites say about a source, instead of only reading the source itself, is called…",
    right: "lateral reading",
    wrong: ["skimming", "clickbait", "bias"],
    hint: "Lateral means sideways. You open new tabs to read across, not just down the page.",
    hard: true,
  },
  {
    prompt: "Apps often show you more posts like the ones you already liked. Over time this can…",
    right: "create an echo chamber where you mostly see views you already agree with",
    wrong: ["make sure you see every point of view", "remove all false information", "make every post reliable"],
    hint: "In an echo chamber, you keep hearing your own views repeated back.",
    emoji: "📱",
    hard: true,
  },
  {
    prompt: "A shocking photo is spreading online. What is a smart first step?",
    right: "do a reverse image search to see where it first appeared",
    wrong: ["share it quickly before it's deleted", "trust it, because photos can't be edited", "believe it if it looks real"],
    hint: "Photos can be edited, taken from another event, or made by a computer.",
    emoji: "🖼️",
    hard: true,
  },
  {
    prompt: "What is sponsored content?",
    right: "material paid for by a company but made to look like regular content",
    wrong: ["news written by independent reporters", "a correction to a story", "a government law"],
    hint: "Look for small labels like “sponsored”, “ad” or “paid partnership”.",
    hard: true,
  },
  {
    prompt: "Two stories about the same protest use different words: one says “crowd”, the other says “mob”. What does this show?",
    right: "Word choice can shape how readers feel about an event",
    wrong: ["Both words mean exactly the same", "Only one story is about the protest", "Word choice never matters"],
    hint: "“Mob” sounds much more negative than “crowd”. That's called loaded language.",
    hard: true,
  },
  {
    prompt: "Leaving out important facts so that a story favours one side is a kind of…",
    right: "bias by omission",
    wrong: ["fact-checking", "a primary source", "satire"],
    hint: "Omit means to leave out.",
    hard: true,
  },
  {
    prompt: "An article about a health topic is most trustworthy when…",
    right: "it's written by an expert and lists its research sources",
    wrong: ["it has bright colours", "it uses lots of emoji", "it has a catchy headline"],
    hint: "Look for expertise and evidence, not style.",
    hard: true,
  },
  {
    prompt: "What is satire?",
    right: "humour that exaggerates to make a point, not meant as real news",
    wrong: ["a serious news report", "a government announcement", "a scientific study"],
    hint: "Satire can look like news, but it's a joke. Check before you believe it!",
    emoji: "🎭",
    hard: true,
  },
  {
    prompt: "Why do reliable news organizations publish corrections?",
    right: "to fix mistakes openly and keep readers' trust",
    wrong: ["to hide their mistakes", "to sell more ads", "to make stories longer"],
    hint: "Everyone makes mistakes. Trustworthy sources admit and fix them.",
    hard: true,
  },
];

function mediaLiteracy({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return shuffle([
    sortQuestion(FACT_SORT, perBin(difficulty)),
    oneOf(ARTICLE_ITEMS, difficulty),
    sourceQ(difficulty),
    ...levelled(MEDIA_BANK, 5, difficulty),
  ]);
}

export const course: Course = {
  grade: "6",
  subject: "social",
  bigIdeas: {
    "ca-bc": [
      "Economic self-interest can be a significant cause of conflict among peoples and governments.",
      "Complex global problems require international cooperation to make difficult choices for the future.",
      "Systems of government vary in their respect for human rights and freedoms.",
      "Media sources can both positively and negatively affect our understanding of important events and issues.",
    ],
  },
  units: [
    {
      id: "map-skills",
      title: "Map Skills",
      emoji: "🧭",
      blurb: "Latitude, longitude and hemispheres",
      standards: { "ca-bc": "Geographic skills for studying global issues: latitude and longitude, hemispheres, continents and oceans" },
      parentNote:
        "Reading latitude and longitude on a grid and in a table, telling which hemispheres a place is in, and knowing the continents, oceans and key lines like the equator and prime meridian.",
      generate: mapSkills,
    },
    {
      id: "cities-and-migration",
      title: "Cities & Migration",
      emoji: "🏙️",
      blurb: "Why people move",
      standards: { "ca-bc": "Urbanization and migration of people" },
      parentNote:
        "Push and pull factors, immigrants, refugees and internal migrants, how and why cities grow, and the challenges of rapid urbanization, with a short reading and a population table.",
      generate: citiesAndMigration,
    },
    {
      id: "global-challenges",
      title: "Global Challenges",
      emoji: "🌍",
      blurb: "Poverty, planet and working together",
      standards: {
        "ca-bc":
          "Global poverty and inequality issues; roles of individuals, governments, NGOs and international organizations, including the United Nations; international cooperation on global issues",
      },
      parentNote:
        "Poverty and inequality, global environmental problems, and how individuals, governments, NGOs and the UN work together, including the Montreal Protocol as a cooperation success story.",
      generate: globalChallenges,
    },
    {
      id: "governments-and-rights",
      title: "Governments & Rights",
      emoji: "🏛️",
      blurb: "Who decides, and whose rights?",
      standards: { "ca-bc": "Different systems of government; human rights and responses to human rights violations" },
      parentNote:
        "Democracy, constitutional monarchy, dictatorship and other systems; how Canada's government works; and rights in the Universal Declaration of Human Rights, the Convention on the Rights of the Child and the Canadian Charter.",
      generate: governmentsAndRights,
    },
    {
      id: "trade-and-globalization",
      title: "Trade & Globalization",
      emoji: "🚢",
      blurb: "Imports, exports and a connected world",
      standards: {
        "ca-bc": "Economic policies and resource management; trade and globalization; economic self-interest and conflict",
      },
      parentNote:
        "Imports and exports, market, command, traditional and mixed economies, supply and demand, tariffs and trade disputes, and the benefits and costs of globalization, presented from several points of view.",
      generate: tradeAndGlobalization,
    },
    {
      id: "media-literacy",
      title: "Media Literacy",
      emoji: "📰",
      blurb: "Fact, opinion and reliable sources",
      standards: { "ca-bc": "Media technologies and coverage of current events; bias, reliability and misinformation" },
      parentNote:
        "Telling fact from opinion, spotting bias and loaded language, judging whether a source is reliable, and recognizing misinformation, clickbait and ads, plus how media can both help and harm understanding.",
      generate: mediaLiteracy,
    },
  ],
};
