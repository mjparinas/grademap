import { chance, pick, randInt, sample, shuffle, textChoice } from "../../random";
import type { Course, GenerateOptions, InputQuestion, OrderQuestion, Question, Visual } from "../../types";
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

/** Eight questions: the generated/sort/order extras plus enough bank items to fill up. */
function make(bank: Item[], difficulty: Level, extras: Question[], total = 8): Question[] {
  return shuffle([...levelled(bank, total - extras.length, difficulty), ...extras]);
}

const level = (o?: GenerateOptions): Level => o?.difficulty ?? 2;

/** Two-basket sorts: 6 items at difficulty 1, 8 at 2 and 3. */
const perBin = (difficulty: Level) => (difficulty === 1 ? 3 : 4);

function numInput(
  prompt: string,
  answer: number | string,
  hint: string,
  keypad: InputQuestion["keypad"] = "number",
  suffix?: string,
  visual?: Visual,
): InputQuestion {
  return { kind: "input", prompt, answer: String(answer), hint, keypad, suffix, visual };
}

// ---------- Timelines ----------

interface TimelineEvent {
  id: string;
  label: string;
  year: number;
  /** How the date is written, e.g. "1347" or "about 1450". */
  date: string;
  emoji?: string;
}

/** Keep `n` of the events, spread out, and ask for them earliest first. */
function timelineOrder(events: TimelineEvent[], difficulty: Level): OrderQuestion {
  const n = Math.min(events.length, difficulty + 2);
  const chosen = sample(events, n).sort((a, b) => a.year - b.year);
  return {
    kind: "order",
    prompt: "Put these events on a timeline, earliest first.",
    hint: `${chosen.map((e) => `${e.label}: ${e.date}`).join(". ")}. Compare the years: a smaller number is earlier in CE.`,
    items: chosen.map((e) => ({
      id: e.id,
      label: difficulty === 1 ? `${e.date}: ${e.label}` : e.label,
      emoji: e.emoji,
    })),
  };
}

const ordinal = (n: number) => {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  return `${n}${["th", "st", "nd", "rd"][n % 10 < 4 ? n % 10 : 0]}`;
};

function centuryQuestion(): Question {
  const year = pick([650, 711, 800, 870, 962, 1000, 1001, 1066, 1099, 1200, 1215, 1271, 1300, 1347, 1368, 1400, 1450, 1492, 1500, 1517, 1543, 1600]);
  const c = Math.ceil(year / 100);
  const wrong = [c - 1, c + 1, c - 2, c + 2].filter((x) => x >= 5);
  return textChoice(
    `In which century did the year ${year} CE fall?`,
    `the ${ordinal(c)} century`,
    wrong.slice(0, 3).map((x) => `the ${ordinal(x)} century`),
    `The years 1 to 100 are the 1st century, 101 to 200 the 2nd, and so on. Divide ${year} by 100 and round up${year % 100 === 0 ? " (an exact hundred, such as " + year + ", is the last year of its century)" : ""}.`,
  );
}

// ---------- Source analysis ----------

interface SourceSet {
  title: string;
  paragraphs: string[];
  questions: { prompt: string; right: string; wrong: string[]; hint: string }[];
}

function sourceQuestion(sources: SourceSet[]): Question {
  const s = pick(sources);
  const q = pick(s.questions);
  return textChoice(q.prompt, q.right, q.wrong, q.hint, { type: "passage", title: s.title, paragraphs: s.paragraphs });
}

// ---------- Think Like a Historian ----------

const MIXED_EVENTS: TimelineEvent[] = [
  { id: "hijra", label: "Muhammad and his followers travel to Medina (the Hijra)", year: 622, date: "622", emoji: "🕌" },
  { id: "baghdad", label: "Baghdad is founded", year: 762, date: "762", emoji: "🏙️" },
  { id: "charlemagne", label: "Charlemagne is crowned emperor", year: 800, date: "800", emoji: "👑" },
  { id: "norman", label: "The Norman conquest of England", year: 1066, date: "1066", emoji: "⚔️" },
  { id: "magna", label: "King John signs Magna Carta", year: 1215, date: "1215", emoji: "📜" },
  { id: "plague", label: "The Black Death reaches Europe", year: 1347, date: "1347", emoji: "🐀" },
  { id: "ming", label: "The Ming dynasty begins in China", year: 1368, date: "1368", emoji: "🏯" },
  { id: "constantinople", label: "Constantinople falls to the Ottomans", year: 1453, date: "1453", emoji: "🏰" },
  { id: "columbus", label: "Columbus crosses the Atlantic for Spain", year: 1492, date: "1492", emoji: "⛵" },
  { id: "luther", label: "Martin Luther posts his Ninety-five Theses", year: 1517, date: "1517", emoji: "✍️" },
];

function yearsBetween(): Question {
  const [a, b] = sample(MIXED_EVENTS, 2).sort((x, y) => x.year - y.year);
  return numInput(
    `How many years passed between "${a.label}" (${a.year}) and "${b.label}" (${b.year})?`,
    b.year - a.year,
    `Subtract the earlier year from the later year: ${b.year} − ${a.year}.`,
    "number",
    "years",
  );
}

const SOURCE_SORT: SortSet = {
  prompt: "Primary or secondary source? Sort each example.",
  hint: "A primary source was made by someone who lived through the events or at the time. A secondary source was made later, using research on the past.",
  bins: [
    { id: "primary", label: "primary source", emoji: "📜" },
    { id: "secondary", label: "secondary source", emoji: "📚" },
  ],
  items: [
    { label: "a letter written by a merchant in 1300", emoji: "✉️", bin: "primary" },
    { label: "a coin minted in the 1200s", emoji: "🪙", bin: "primary" },
    { label: "a diary kept by a traveller during her journey", emoji: "📔", bin: "primary" },
    { label: "a map drawn by a sailor on a voyage", emoji: "🗺️", bin: "primary" },
    { label: "a textbook chapter about the Renaissance", emoji: "📖", bin: "secondary" },
    { label: "a documentary made last year about the Mongols", emoji: "🎬", bin: "secondary" },
    { label: "a biography of Mansa Musa written by a modern historian", emoji: "🧑‍🏫", bin: "secondary" },
    { label: "an encyclopedia article on the Black Death", emoji: "🖥️", bin: "secondary" },
  ],
};

const TOOLKIT_SOURCES: SourceSet[] = [
  {
    title: "A merchant's letter (imagined for practice)",
    paragraphs: [
      "To my brother in the city: the caravan reached the oasis on the thirtieth day. The wells were low, so we paid the guide extra to lead us to a second one.",
      "Silk is expensive here this season because the road to the east has been closed by fighting. I will sell the pepper while I wait.",
    ],
    questions: [
      {
        prompt: "What does this source suggest about trade at the time?",
        right: "Merchants travelled long distances in caravans, and events such as conflict could change prices",
        wrong: [
          "Merchants never left their home city",
          "Silk was cheap because every road was open",
          "All trade was done by ship",
        ],
        hint: "Look for details in the text: a caravan, an oasis, a closed road and a price that changed.",
      },
      {
        prompt: "From whose perspective is this source written?",
        right: "A merchant who makes a living from trade",
        wrong: ["A ruler who taxes the caravans", "A farmer who has never travelled", "A historian writing centuries later"],
        hint: "Ask who is speaking. The writer talks about selling pepper and the price of silk.",
      },
      {
        prompt: "If this letter were a real document written during the journey, it would be…",
        right: "a primary source",
        wrong: ["a secondary source", "a modern opinion", "a map"],
        hint: "A primary source is created by someone who was there at the time.",
      },
    ],
  },
  {
    title: "Two accounts of one market day (imagined for practice)",
    paragraphs: [
      "Account A, by a guild member: The market was a triumph. Our cloth sold out before noon, and the town council praised our fair prices.",
      "Account B, by a weaver's neighbour: The market was a disaster. The guild kept prices so high that poorer families went home with nothing.",
    ],
    questions: [
      {
        prompt: "Why might these two accounts of the same day be so different?",
        right: "The writers have different perspectives and interests",
        wrong: ["One of them must have been on a different day", "Historians never find different accounts", "Only one of them could be a real person"],
        hint: "People's experiences and interests shape what they notice and how they describe it.",
      },
      {
        prompt: "What is the best next step for a historian who finds these two accounts?",
        right: "Look for more sources, such as town records, to compare them",
        wrong: ["Pick the one that sounds happier", "Throw both away because they disagree", "Assume that the longer one is true"],
        hint: "Historians cross-check sources. Disagreement can be useful, because it shows different viewpoints.",
      },
    ],
  },
];

const TOOLKIT_BANK: Item[] = [
  {
    prompt: "What is a primary source?",
    right: "Evidence created at the time of an event by someone who took part or lived then",
    wrong: [
      "A source that is more important than the others",
      "A textbook written by a modern historian",
      "Any source that is the first one you read",
    ],
    hint: "'Primary' refers to being from the time and place, not to being the most important. Letters, diaries, coins and photographs are examples.",
  },
  {
    prompt: "What is a secondary source?",
    right: "An account created later, based on research into primary sources",
    wrong: [
      "A source that is less true than a primary source",
      "Any source written in a second language",
      "A diary written by someone who was there",
    ],
    hint: "A secondary source is one step removed. A historian today who writes about the 1300s is creating a secondary source.",
  },
  {
    prompt: "Which of these is a primary source about the Black Death?",
    right: "a letter written by a town official in 1348",
    wrong: ["a movie about the plague", "a museum website written in 2020", "a science textbook chapter on bacteria"],
    hint: "Look for the item made by someone alive at the time.",
  },
  {
    prompt: "A historian asks, 'Who wrote this, and why?' What is she thinking about?",
    right: "The author's perspective and purpose",
    wrong: ["The font in which it was printed", "How much it would sell for", "Whether it is long enough"],
    hint: "Understanding who created a source and why helps a historian judge how to use it.",
  },
  {
    prompt: "Which statement is a fact rather than an opinion?",
    right: "Gutenberg printed a Bible using movable metal type in the 1450s.",
    wrong: [
      "Gutenberg's press was the most important invention ever.",
      "Medieval people were not as clever as people today.",
      "The Renaissance was the best time in history.",
    ],
    hint: "A fact can be checked against evidence. Words like 'most', 'best' and 'not as clever' signal opinions.",
  },
  {
    prompt: "Oral traditions and oral histories, passed on by speaking, are…",
    right: "valid sources of history that many societies, including many Indigenous peoples, have relied on for generations",
    wrong: [
      "not useful, because anything that is not written down cannot be evidence",
      "only useful for children's stories",
      "always the same as written records",
    ],
    hint: "Writing is one way to keep a record. Many communities have carefully preserved their histories through speaking and teaching, and historians increasingly work with them.",
  },
  {
    prompt: "A coin from the 1200s is found in a field. What can it tell historians?",
    right: "Where it was made and who ruled then, and perhaps how far it travelled in trade",
    wrong: [
      "Nothing, because it is not a written source",
      "The exact thoughts of the person who dropped it",
      "Only how much it is worth today",
    ],
    hint: "Artifacts are evidence too. Coins carry symbols or writing, and where they are found shows trade links.",
  },
  {
    prompt: "What does 'cause and consequence' help a historian do?",
    right: "Explain why an event happened and what difference it made afterwards",
    wrong: ["Put events in alphabetical order", "Decide which people were good or bad", "Count how many years passed"],
    hint: "A cause leads to an event. A consequence is a result. Events often have several of each.",
  },
  {
    prompt: "Which pair is a cause and its consequence?",
    right: "A plague kills many workers → survivors can ask for higher wages",
    wrong: [
      "Higher wages → a plague kills many workers",
      "A plague → the invention of paper",
      "A king is crowned → a plague begins in Asia",
    ],
    hint: "Check the direction. When workers became scarce after the Black Death, their labour was worth more.",
  },
  {
    prompt: "In history, 'continuity' means…",
    right: "something stayed the same over a period of time",
    wrong: ["a great change happened quickly", "a series of wars", "a timeline with missing dates"],
    hint: "Historians look at both change and continuity. Most people stayed farmers even as towns grew.",
  },
  {
    prompt: "What does 'historical significance' mean?",
    right: "How much an event or person mattered, because it affected many people or lasted a long time",
    wrong: ["How famous someone is today", "How old an event is", "Whether it is in a textbook"],
    hint: "Ask: Who was affected? How deeply? For how long? What does it help us understand?",
  },
  {
    prompt: "A ruler's official historian writes a glowing account of the ruler's reign. What should a historian be careful about?",
    right: "The writer may have been paid to praise the ruler, so the account may leave things out",
    wrong: [
      "Official accounts are always exactly true",
      "Official accounts can never be used",
      "Only the ruler's enemies write true history",
    ],
    hint: "Bias doesn't make a source useless. It means a historian reads it carefully and compares it with other evidence.",
    hard: true,
  },
  {
    prompt: "Historical perspective-taking means…",
    right: "trying to understand why people in the past thought and acted as they did, in the context of their time, while still judging their actions fairly",
    wrong: [
      "agreeing with everything people did in the past",
      "judging everyone by the values of today without learning about their world",
      "ignoring what people said about their own lives",
    ],
    hint: "Understanding doesn't mean excusing. It means learning about the beliefs, information and limits that people had.",
    hard: true,
  },
  {
    prompt: "Which type of question could you answer by comparing a primary and a secondary source about the same event?",
    right: "How have people's views of this event changed over time?",
    wrong: ["What colour was the author's hair?", "What is the weather today?", "Who owns the document now?"],
    hint: "Primary sources show views from the time. Secondary sources show how later writers interpret the events.",
    hard: true,
  },
  {
    prompt: "A source says, 'The foreign traders were greedy and sly.' The writer was a rival merchant. What does a historian conclude?",
    right: "This shows the writer's opinion and perspective, and it should be checked against other evidence",
    wrong: [
      "It proves that foreign traders were greedy",
      "It proves the writer was lying about everything",
      "It tells nothing at all",
    ],
    hint: "Words that judge people reveal a viewpoint. A historian looks for other sources, especially from the traders themselves.",
    hard: true,
  },
  {
    prompt: "What do the letters CE and BCE stand for?",
    right: "Common Era and Before the Common Era",
    wrong: ["Christian Empire and Before the Christian Empire", "Century End and Before Century End", "Calendar Era and Before Calendar Era"],
    hint: "CE and BCE are used worldwide to number years without tying the system to one religion. They match AD and BC.",
  },
];

function historianToolkit(opts?: GenerateOptions): Question[] {
  const d = level(opts);
  const extras: Question[] = [sortQuestion(SOURCE_SORT, perBin(d)), sourceQuestion(TOOLKIT_SOURCES), centuryQuestion()];
  if (d >= 2) extras.push(yearsBetween());
  return make(TOOLKIT_BANK, d, extras, 8);
}

// ---------- Geography Shapes Societies ----------

function caravanQuestion(difficulty: Level): Question {
  const speed = pick(difficulty === 1 ? [20, 25, 30] : [20, 25, 30, 35, 40]);
  const days = randInt(4, difficulty === 1 ? 20 : 45);
  const dist = speed * days;
  if (difficulty === 3 && chance(0.5)) {
    return numInput(
      `A camel caravan takes ${days} days to cross a desert route that is ${dist} km long, travelling at the same pace every day. How many kilometres does it cover each day?`,
      speed,
      `Divide the distance by the number of days: ${dist} ÷ ${days}.`,
      "number",
      "km",
    );
  }
  return numInput(
    `A camel caravan travels about ${speed} km each day. How many days will it take to cross a ${dist} km route?`,
    days,
    `Days = distance ÷ speed. Divide ${dist} by ${speed}.`,
    "number",
    "days",
  );
}

const TRAVEL_SORT: SortSet = {
  prompt: "Did this feature help trade and travel, or make it harder? Sort each one.",
  hint: "Navigable rivers, good harbours, predictable winds and oases helped people move goods. Waterless deserts, high mountains and thick forest made journeys slow and risky.",
  bins: [
    { id: "helped", label: "helped trade and travel", emoji: "⛵" },
    { id: "hindered", label: "made travel harder", emoji: "⛰️" },
  ],
  items: [
    { label: "a wide river that boats can navigate", emoji: "🛶", bin: "helped" },
    { label: "a sheltered natural harbour", emoji: "⚓", bin: "helped" },
    { label: "seasonal monsoon winds that sailors can predict", emoji: "🌬️", bin: "helped" },
    { label: "an oasis with a well along a desert route", emoji: "🌴", bin: "helped" },
    { label: "a very high mountain range with few passes", emoji: "🏔️", bin: "hindered" },
    { label: "a hot desert with no water for weeks", emoji: "🏜️", bin: "hindered" },
    { label: "dense rainforest with no roads", emoji: "🌳", bin: "hindered" },
    { label: "a sea that freezes solid in winter", emoji: "🧊", bin: "hindered" },
  ],
};

const GEOGRAPHY_BANK: Item[] = [
  {
    prompt: "Why was Constantinople's location so valuable?",
    right: "It sat on a narrow strait linking the Black Sea and the Mediterranean, between Europe and Asia, so it controlled trade routes",
    wrong: [
      "It was in the middle of a desert far from any trade route",
      "It was surrounded by mountains and cut off from the sea",
      "It was at the mouth of the Nile",
    ],
    hint: "Think of a crossroads. Goods moving by sea and by land had to pass near the city.",
  },
  {
    prompt: "What are monsoon winds?",
    right: "Seasonal winds that blow in one direction for part of the year and then reverse",
    wrong: ["Winds that never change direction", "Winds that only happen over deserts", "Very cold winds from the poles"],
    hint: "Indian Ocean sailors timed voyages to ride the winds out in one season and back in the other.",
  },
  {
    prompt: "How did the Sahara affect trade between North and West Africa?",
    right: "It was a huge barrier, but traders crossed it with camels along routes that linked oases",
    wrong: [
      "It was easy to cross by river boat",
      "It made trade impossible for hundreds of years",
      "It was a rich forest full of towns",
    ],
    hint: "Camels can go several days without water. Oasis wells set where the routes ran.",
  },
  {
    prompt: "What is the steppe?",
    right: "A huge, mostly treeless grassland in Central Asia, good for raising horses and herds",
    wrong: ["A thick rainforest in South America", "A frozen sea near the poles", "A river delta in Egypt"],
    hint: "The Mongols grew up on the steppe, where herding and horse riding were part of daily life.",
  },
  {
    prompt: "How did the Niger River help the growth of cities in West Africa?",
    right: "It supported farming and gave a route for moving goods by boat",
    wrong: [
      "It froze each winter, making a road of ice",
      "It was too dry to be useful",
      "It flowed through the Sahara with no people living nearby",
    ],
    hint: "A reliable water supply allows farming, and rivers let boats carry goods. Many trading towns grew up near the Niger.",
  },
  {
    prompt: "Many Silk Road routes went around the Taklamakan Desert instead of straight across it. Why?",
    right: "Travellers followed the edges of the desert, where oasis towns gave water and supplies",
    wrong: [
      "The desert was filled with water",
      "Camels cannot walk on sand",
      "The desert had roads of stone",
    ],
    hint: "Routes follow water. Oasis towns on the desert's rim became important trading stops.",
  },
  {
    prompt: "The Mexica built their capital Tenochtitlan on an island in a lake and made farm plots called chinampas. How did this fit the geography?",
    right: "They used the shallow lake and its rich mud to grow food close to the city",
    wrong: [
      "They moved the lake to the mountains",
      "They avoided farming altogether",
      "They farmed only on dry desert soil",
    ],
    hint: "Chinampas are rectangular plots built up in shallow water, with rich soil and plenty of moisture.",
  },
  {
    prompt: "How did the Inca farm on the steep slopes of the Andes?",
    right: "They built stepped terraces that made flat fields and helped hold water and soil",
    wrong: [
      "They farmed only on the ocean floor",
      "They did not farm at all",
      "They flooded the mountains",
    ],
    hint: "Terraces turn a steep slope into steps of level ground. The Inca also grew many varieties of potatoes suited to different heights.",
  },
  {
    prompt: "Why did Venice become a rich trading city?",
    right: "Its position on a lagoon at the head of the Adriatic Sea put it between Europe and eastern Mediterranean markets",
    wrong: [
      "It had the largest farms in Europe",
      "It controlled the Silk Road across Asia",
      "It was far from the sea and safe from invasion",
    ],
    hint: "Ships from Venice could reach Constantinople and Egypt. Location made it a gateway for goods coming to Europe.",
  },
  {
    prompt: "Which line of latitude is at 0°?",
    right: "the equator",
    wrong: ["the prime meridian", "the Tropic of Cancer", "the Arctic Circle"],
    hint: "Latitude measures distance north or south of the equator. The prime meridian is a line of longitude.",
  },
  {
    prompt: "Why was China's Grand Canal important?",
    right: "It linked the Yangtze and Yellow River regions so grain and goods could move between north and south",
    wrong: [
      "It cut across the Sahara",
      "It protected China from the Mongols",
      "It was built to stop all trade",
    ],
    hint: "China's major rivers run east–west, so the canal that runs north–south connected the regions.",
  },
  {
    prompt: "Which is an example of people changing the environment?",
    right: "Building terraces on a mountain slope",
    wrong: ["A monsoon changing direction", "A river flooding in spring", "A volcano erupting"],
    hint: "Human-environment interaction can go both ways: nature shapes what people can do, and people reshape the land.",
  },
  {
    prompt: "Why did many early towns in medieval Europe grow up beside rivers?",
    right: "Rivers provided water, power for mills and an easy way to move goods",
    wrong: ["Rivers kept all enemies away", "Rivers were always frozen", "Towns could not exist anywhere else"],
    hint: "Water for drinking, mills and boats made river sites useful for craftspeople and merchants.",
  },
  {
    prompt: "How did the geography of the Swahili coast of East Africa help its port cities such as Kilwa grow?",
    right: "Monsoon winds brought ships from Arabia and India, and African gold and ivory could be shipped out",
    wrong: [
      "The coast was cut off from all other lands",
      "It was located along the Silk Road in Central Asia",
      "It had no harbours",
    ],
    hint: "Winds that reversed each season brought merchants to the coast, and the cities traded between Africa and the Indian Ocean world.",
    hard: true,
  },
  {
    prompt: "Why was it hard for the Inca to move armies and messages across their empire, and how did they respond?",
    right: "Steep mountains made travel slow, so they built a network of roads, bridges and relay runners",
    wrong: [
      "The land was flat, so they needed no roads",
      "They used railways",
      "They sent messages by carrier pigeon",
    ],
    hint: "The Inca solved a geographic challenge with engineering: stone roads, rope bridges and chasqui relay runners.",
    hard: true,
  },
  {
    prompt: "The Mongol Empire stretched across Eurasia. Which geographic advantage helped Mongol armies move fast?",
    right: "The open grasslands of the steppe suited their horses",
    wrong: ["Dense forests all across Asia", "Deep rivers they could not cross", "Coastal harbours for their navy"],
    hint: "The steppe has few barriers, and the Mongols' horse-riding skills let them cover great distances quickly.",
    hard: true,
  },
  {
    prompt: "Which statement best describes the relationship between geography and history?",
    right: "Geography shapes the choices people have, but people also choose how to respond",
    wrong: [
      "Geography decides everything people do",
      "Geography has no effect on history",
      "Only climate matters, not landforms",
    ],
    hint: "Two societies with similar land can make different choices. Geography shapes opportunities and limits.",
    hard: true,
  },
];

function geographyUnit(opts?: GenerateOptions): Question[] {
  const d = level(opts);
  return make(GEOGRAPHY_BANK, d, [sortQuestion(TRAVEL_SORT, perBin(d)), caravanQuestion(d)], 8);
}

// ---------- Byzantine & Islamic Worlds ----------

const BYZ_ISLAM_EVENTS: TimelineEvent[] = [
  { id: "hagia", label: "Hagia Sophia is completed in Constantinople", year: 537, date: "537", emoji: "⛪" },
  { id: "hijra", label: "Muhammad and his followers travel to Medina (the Hijra)", year: 622, date: "622", emoji: "🕌" },
  { id: "baghdad", label: "Baghdad is founded as the Abbasid capital", year: 762, date: "762", emoji: "🏙️" },
  { id: "fihri", label: "Fatima al-Fihri founds al-Qarawiyyin in Fez", year: 859, date: "859", emoji: "📚" },
  { id: "schism", label: "The Eastern (Orthodox) and Western (Catholic) churches formally split", year: 1054, date: "1054", emoji: "⛪" },
  { id: "mongol", label: "Mongol forces capture Baghdad", year: 1258, date: "1258", emoji: "🐎" },
  { id: "fall", label: "Constantinople falls to the Ottomans", year: 1453, date: "1453", emoji: "🏰" },
];

const EMPIRE_SORT: SortSet = {
  prompt: "Byzantine Empire or the Islamic world? Sort each item.",
  hint: "The Byzantine Empire was the Greek-speaking Eastern Roman Empire centred on Constantinople. Baghdad, the Hajj and scholars such as al-Khwarizmi belong to the Islamic world.",
  bins: [
    { id: "byz", label: "Byzantine Empire", emoji: "⛪" },
    { id: "islam", label: "Islamic world", emoji: "🕌" },
  ],
  items: [
    { label: "Hagia Sophia built under Emperor Justinian", emoji: "🏛️", bin: "byz" },
    { label: "Justinian's law code", emoji: "⚖️", bin: "byz" },
    { label: "capital at Constantinople", emoji: "🏰", bin: "byz" },
    { label: "Orthodox Christian church leadership", emoji: "✝️", bin: "byz" },
    { label: "House of Wisdom in Baghdad", emoji: "📚", bin: "islam" },
    { label: "al-Khwarizmi's work on algebra", emoji: "➗", bin: "islam" },
    { label: "Ibn Sina's Canon of Medicine", emoji: "💊", bin: "islam" },
    { label: "the Hajj pilgrimage to Mecca", emoji: "🕋", bin: "islam" },
  ],
};

const BYZ_SOURCES: SourceSet[] = [
  {
    title: "A scholar's note from Baghdad (imagined for practice)",
    paragraphs: [
      "Today the translators finished another book from the Greeks, and a second from India about the numbers. We copy them neatly so that students from many lands may study them.",
      "The caliph pays for the paper and for the translators' work, because he believes knowledge is a treasure for everyone.",
    ],
    questions: [
      {
        prompt: "What does this source suggest about scholars in Baghdad?",
        right: "They gathered and translated knowledge from different cultures, with support from the ruler",
        wrong: [
          "They destroyed books from other lands",
          "They refused to study ideas from outside their city",
          "They worked in secret without any support",
        ],
        hint: "Find the clues: books 'from the Greeks' and 'from India' were translated, and the caliph paid for the work.",
      },
      {
        prompt: "Which detail in the source shows that rulers supported learning?",
        right: "The caliph pays for the paper and the translators",
        wrong: [
          "The students come from many lands",
          "The books are copied neatly",
          "The translators finished a book today",
        ],
        hint: "Look for who provides the money and resources.",
      },
    ],
  },
];

const BYZ_ISLAM_BANK: Item[] = [
  {
    prompt: "What was the Byzantine Empire?",
    right: "The eastern part of the Roman Empire, which lasted until 1453 and was centred on Constantinople",
    wrong: [
      "A kingdom founded by Charlemagne",
      "An empire in the Americas",
      "A Mongol state in Central Asia",
    ],
    hint: "When the western Roman Empire fell in the 400s, the eastern half continued for nearly 1000 more years. Historians call it 'Byzantine'.",
  },
  {
    prompt: "What is Hagia Sophia, completed in 537 under Emperor Justinian?",
    right: "A huge church in Constantinople famous for its great dome",
    wrong: ["A Roman fortress in Spain", "A library in Baghdad", "A palace in Cairo"],
    hint: "Hagia Sophia means 'Holy Wisdom'. It became a mosque after 1453.",
  },
  {
    prompt: "How did Justinian's law code affect later societies?",
    right: "It collected and organized Roman law and influenced legal systems in Europe for centuries",
    wrong: [
      "It banned all written laws",
      "It had no effect after his death",
      "It applied only to the city of Rome",
    ],
    hint: "Justinian ordered scholars to gather Roman laws into one organized collection, which later European scholars studied.",
  },
  {
    prompt: "Islam began in the early 600s in which region?",
    right: "The Arabian Peninsula",
    wrong: ["Central Europe", "East Asia", "The Andes"],
    hint: "Islam began with the Prophet Muhammad in Mecca. Muslims follow the teachings of the Qur'an.",
  },
  {
    prompt: "Which of these is one of the Five Pillars of Islam?",
    right: "Hajj, the pilgrimage to Mecca",
    wrong: ["Building a pyramid", "Collecting a tithe for the king", "Hiring a scribe"],
    hint: "The Five Pillars are the declaration of faith, prayer, giving to charity, fasting in Ramadan and the Hajj.",
  },
  {
    prompt: "What was a caliph?",
    right: "A leader of the Muslim community who succeeded the Prophet Muhammad",
    wrong: ["A Byzantine army general", "A kind of ship", "A market official"],
    hint: "Caliph comes from the Arabic word for 'successor'. Caliphs led large states like the Umayyad and Abbasid caliphates.",
  },
  {
    prompt: "Why was Baghdad an important city for learning?",
    right: "The Abbasid rulers made it a capital and supported scholars, translators and libraries such as the House of Wisdom",
    wrong: [
      "It was a quiet village far from trade",
      "It banned books from other cultures",
      "It was a Mongol camp",
    ],
    hint: "Baghdad was founded in 762. Under the Abbasids, it became a centre where scholars gathered and translated books.",
  },
  {
    prompt: "The word 'algebra' comes from the Arabic 'al-jabr', used in a book by which mathematician?",
    right: "al-Khwarizmi",
    wrong: ["Euclid", "Fibonacci", "Ibn Battuta"],
    hint: "Al-Khwarizmi worked in Baghdad in the 800s. The word 'algorithm' also comes from his name.",
  },
  {
    prompt: "Which numbers did scholars in the Islamic world help to spread to Europe, including the digit zero?",
    right: "the Hindu-Arabic numerals (0 to 9)",
    wrong: ["Roman numerals", "Mayan bars and dots", "Egyptian hieroglyph numbers"],
    hint: "The system started in India and was developed and carried by Arabic-speaking scholars. It's the system we use today.",
  },
  {
    prompt: "Ibn Sina (Avicenna) wrote a medical encyclopedia that doctors in both the Islamic world and Europe used for centuries. What was it called?",
    right: "The Canon of Medicine",
    wrong: ["The Book of Optics", "The Silk Road Handbook", "The Great Charter"],
    hint: "Ibn Sina lived from about 980 to 1037. His Canon of Medicine was taught in universities for hundreds of years.",
  },
  {
    prompt: "Ibn al-Haytham's Book of Optics explained how we see. Which of his ideas was right?",
    right: "Light travels from objects into the eye, rather than rays leaving the eye",
    wrong: ["The eye sends out rays that touch objects", "We see only in the dark", "Light does not travel in straight lines"],
    hint: "He tested ideas with experiments, such as a dark room with a small hole, which makes him an early example of the scientific method.",
  },
  {
    prompt: "Who founded al-Qarawiyyin in Fez in 859, often described as one of the world's oldest universities still operating?",
    right: "Fatima al-Fihri",
    wrong: ["Mansa Musa", "Empress Theodora", "Genghis Khan"],
    hint: "Fatima al-Fihri used her inheritance to found a mosque and school that grew into a centre of learning.",
  },
  {
    prompt: "What did Muslim astronomers and navigators use an astrolabe for?",
    right: "To measure the position of the sun and stars, tell time and find direction",
    wrong: ["To grind grain", "To weigh gold", "To write letters"],
    hint: "An astrolabe is a handheld model of the sky. It helped with navigation, prayer times and astronomy.",
  },
  {
    prompt: "Why did the 1054 split between Eastern (Orthodox) and Western (Catholic) churches matter?",
    right: "It divided Christians in Europe into two major branches that still exist today",
    wrong: [
      "It ended Christianity",
      "It made the Byzantine Empire larger",
      "It created Islam",
    ],
    hint: "Disagreements over authority and beliefs built up for centuries. The Byzantine emperor and church followed the Orthodox side.",
  },
  {
    prompt: "In 1453, Ottoman forces led by Sultan Mehmed II captured Constantinople. What did this end?",
    right: "The Byzantine Empire",
    wrong: ["The Abbasid Caliphate", "The Mongol Empire", "The Inca Empire"],
    hint: "The Byzantine Empire lasted from the end of the Roman west until 1453, about 1000 years.",
  },
  {
    prompt: "Many Islamic buildings are decorated with geometric patterns and calligraphy. Why?",
    right: "Artists developed rich designs from patterns and the written word, which are valued in Islamic art",
    wrong: [
      "They had no tools for any other decoration",
      "The Qur'an forbids all colour",
      "They copied Roman statues",
    ],
    hint: "Beautiful writing of the Qur'an and complex mathematical patterns were important art forms.",
    hard: true,
  },
  {
    prompt: "The Abbasid Caliphate ended in 1258 when Baghdad was captured by…",
    right: "Mongol forces",
    wrong: ["Byzantine forces", "Viking raiders", "Spanish conquistadors"],
    hint: "Hulagu Khan, a grandson of Genghis Khan, led the Mongol army. The city's libraries suffered great losses.",
    hard: true,
  },
  {
    prompt: "Which was an important result of Muslim scholars translating Greek, Persian and Indian works into Arabic?",
    right: "Ideas were preserved, improved and later passed to European scholars",
    wrong: [
      "Greek books were lost forever",
      "No new discoveries were made",
      "Scholars stopped using writing",
    ],
    hint: "Scholars did more than copy: they added new work in maths, medicine and astronomy. Later, many Arabic books were translated into Latin.",
    hard: true,
  },
  {
    prompt: "Why were hospitals (bimaristans) in cities like Cairo and Baghdad considered advanced?",
    right: "They treated people with different illnesses, trained doctors and kept records",
    wrong: [
      "They only treated soldiers",
      "They had no doctors at all",
      "They were run by the Mongols",
    ],
    hint: "These hospitals served the public and were also places of study, with medical students learning from practising doctors.",
    hard: true,
  },
];

function byzantineIslamic(opts?: GenerateOptions): Question[] {
  const d = level(opts);
  const extras: Question[] = [timelineOrder(BYZ_ISLAM_EVENTS, d), sortQuestion(EMPIRE_SORT, perBin(d)), sourceQuestion(BYZ_SOURCES)];
  return make(BYZ_ISLAM_BANK, d, extras, 8);
}

// ---------- Medieval Europe ----------

const MEDIEVAL_EVENTS: TimelineEvent[] = [
  { id: "charlemagne", label: "Charlemagne is crowned emperor", year: 800, date: "800", emoji: "👑" },
  { id: "norman", label: "The Norman conquest of England", year: 1066, date: "1066", emoji: "⚔️" },
  { id: "crusade", label: "The First Crusade begins", year: 1096, date: "1096", emoji: "🛡️" },
  { id: "magna", label: "King John signs Magna Carta", year: 1215, date: "1215", emoji: "📜" },
  { id: "plague", label: "The Black Death reaches Europe", year: 1347, date: "1347", emoji: "🐀" },
];

const FEUDAL_ORDER = [
  { id: "king", label: "king", emoji: "👑" },
  { id: "nobles", label: "nobles (lords)", emoji: "🏰" },
  { id: "knights", label: "knights", emoji: "🛡️" },
  { id: "peasants", label: "peasants and serfs", emoji: "🌾" },
];

function feudalOrder(difficulty: Level): OrderQuestion {
  return {
    kind: "order",
    prompt: "Put the feudal system in order, from the top of the pyramid to the bottom.",
    hint: "The king granted land to powerful nobles, who gave land and protection to knights in exchange for service. The peasants who worked the land were at the bottom.",
    items: difficulty === 1 ? [FEUDAL_ORDER[0], FEUDAL_ORDER[1], FEUDAL_ORDER[3]] : FEUDAL_ORDER,
  };
}

const MANOR_SORT: SortSet = {
  prompt: "Manor life or town life? Sort each description.",
  hint: "A manor was a lord's farming estate where peasants owed labour. Medieval towns grew around markets, with merchants and craftspeople who paid for their freedoms.",
  bins: [
    { id: "manor", label: "life on a manor", emoji: "🌾" },
    { id: "town", label: "life in a town", emoji: "🏘️" },
  ],
  items: [
    { label: "serfs farming strips of the lord's land", emoji: "🧑‍🌾", bin: "manor" },
    { label: "the lord's mill that peasants had to use", emoji: "⚙️", bin: "manor" },
    { label: "a village centred on a lord's estate", emoji: "🏡", bin: "manor" },
    { label: "owing labour days to the lord", emoji: "🗓️", bin: "manor" },
    { label: "guilds setting standards for craftspeople", emoji: "🔨", bin: "town" },
    { label: "a weekly market square", emoji: "🛒", bin: "town" },
    { label: "merchants and apprentices", emoji: "📦", bin: "town" },
    { label: "a charter granting the townspeople some self-rule", emoji: "📜", bin: "town" },
  ],
};

const MEDIEVAL_SOURCES: SourceSet[] = [
  {
    title: "A town clerk's note (imagined for practice)",
    paragraphs: [
      "A ship from the east tied up at our harbour in the spring, and soon after, the sickness appeared among the dock workers. By summer, many shops were closed and many families had left for the countryside.",
      "The council has ordered that ships must wait forty days before landing. The priest says we must pray, and the physician says we must avoid crowded places.",
    ],
    questions: [
      {
        prompt: "What does this source suggest about how the sickness reached the town?",
        right: "It arrived aboard a ship that came into the harbour",
        wrong: ["It came from the farms nearby", "It was carried by the town council", "It came from a nearby castle"],
        hint: "Look at the first sentence: a ship arrived, and 'soon after' the sickness appeared among the dock workers.",
      },
      {
        prompt: "What action did the council take?",
        right: "It ordered ships to wait before landing",
        wrong: ["It closed the countryside", "It built a new harbour", "It sent the priest away"],
        hint: "Find the sentence that begins 'The council has ordered…'.",
      },
      {
        prompt: "What does this source show about how people in the town responded to the crisis?",
        right: "Some turned to prayer, some to medical advice, and some left town",
        wrong: [
          "Everyone responded in exactly the same way",
          "Nobody did anything",
          "Everybody stayed in the town",
        ],
        hint: "Look at what the priest and the physician say, and at what the families did.",
      },
    ],
  },
];

const MEDIEVAL_BANK: Item[] = [
  {
    prompt: "What was feudalism?",
    right: "A system in which land was held in exchange for loyalty and service",
    wrong: [
      "A system in which everyone owned equal land",
      "A kind of trade network across the desert",
      "A way of choosing kings by vote",
    ],
    hint: "Kings gave land (fiefs) to nobles, who promised military service and loyalty. They in turn granted land to knights.",
  },
  {
    prompt: "What was a serf?",
    right: "A peasant who worked a lord's land and could not leave without permission",
    wrong: ["A knight who guarded a castle", "A merchant who travelled to Asia", "A priest in a cathedral"],
    hint: "Serfs were not slaves, but they were tied to the land and owed labour and a share of their crops.",
  },
  {
    prompt: "What was a medieval manor?",
    right: "A lord's estate with fields, a village and often a mill and a church",
    wrong: ["A walled trading port", "A royal court in a capital", "A school for scribes"],
    hint: "Most people in medieval Europe lived in small farming villages on manors.",
  },
  {
    prompt: "What was a tithe?",
    right: "A payment of about a tenth of a person's income or crops to the Church",
    wrong: ["A tax paid to a foreign king", "A prize in a tournament", "A kind of medieval coin"],
    hint: "'Tithe' means 'tenth'. The Church used it to support priests, the poor and church buildings.",
  },
  {
    prompt: "How did monasteries help preserve knowledge in medieval Europe?",
    right: "Monks and nuns copied books by hand, preserving them",
    wrong: ["They printed books with presses", "They destroyed old books", "They only studied farming"],
    hint: "Before the printing press, every book had to be copied by hand, and monasteries kept libraries and scriptoria.",
  },
  {
    prompt: "What was a medieval guild?",
    right: "An association of craftspeople or merchants that set standards and protected members' interests",
    wrong: ["A group of knights", "A court of law", "A school for peasants"],
    hint: "Guilds, such as those for bakers or weavers, trained apprentices and controlled quality and prices.",
  },
  {
    prompt: "Why did towns grow in Europe after about 1000?",
    right: "Better farming created surplus food, and trade created markets and jobs",
    wrong: [
      "People were forced to leave farms",
      "Towns were required by the king",
      "There was no trade",
    ],
    hint: "Better farming tools and crop rotation grew more food, so fewer people had to farm, and more could be craftspeople and merchants.",
  },
  {
    prompt: "What did Magna Carta (1215) establish?",
    right: "The idea that even the king had to follow the law",
    wrong: [
      "That the king could make any law he liked",
      "That peasants could vote",
      "The first university",
    ],
    hint: "English nobles forced King John to agree to limits on his power. It became an important step in the history of rule of law.",
  },
  {
    prompt: "What caused the Black Death, which reached Europe in 1347?",
    right: "A bacterium spread mostly by fleas that lived on rats, carried along trade routes",
    wrong: ["Bad smells from rubbish", "A punishment from the stars", "Poisoned wells"],
    hint: "People at the time did not know the cause. Modern science traced it to the bacterium Yersinia pestis.",
  },
  {
    prompt: "How did the Black Death spread so quickly across Europe?",
    right: "Ships and trade routes carried it to ports and towns, where people lived close together",
    wrong: [
      "It stayed in one village only",
      "It did not travel with people at all",
      "It spread only in winter by snow",
    ],
    hint: "The same trade networks that moved goods also carried disease. Crowded towns made it spread faster.",
  },
  {
    prompt: "A third or more of Europe's people may have died in the Black Death. How did this change life for the survivors who worked the land?",
    right: "Workers were scarce, so many could ask for higher wages or better conditions",
    wrong: [
      "Wages fell everywhere",
      "Nobody could farm any more",
      "Serfdom immediately became stricter everywhere",
    ],
    hint: "When there are fewer workers, their labour is worth more. Over time, serfdom weakened in much of western Europe.",
  },
  {
    prompt: "During the plague, some people wrongly blamed minority groups, such as Jewish communities. What does this show?",
    right: "In a crisis, fear and misinformation can lead to unfair blame of others",
    wrong: [
      "The blame was based on good evidence",
      "Everybody agreed with the blame",
      "Disease only affected minority groups",
    ],
    hint: "The real cause was a bacterium. Unfair blame and persecution are examples of how fear can harm innocent people.",
  },
  {
    prompt: "What are some features of a Gothic cathedral?",
    right: "Pointed arches, tall windows with stained glass, and flying buttresses",
    wrong: ["Flat roofs and no windows", "Only wooden walls", "A single small room"],
    hint: "Flying buttresses were stone supports outside the walls. They let builders make high walls with big windows.",
  },
  {
    prompt: "What were the Crusades?",
    right: "A series of religious wars, beginning in 1096, called by the Church to take control of Jerusalem and nearby lands",
    wrong: [
      "Peaceful trading voyages to Asia",
      "A series of wars in Africa",
      "A single battle in England",
    ],
    hint: "The Crusades began when Pope Urban II called Christians to fight in 1095. Effects included lasting conflict, but also contact and trade between Europe and the eastern Mediterranean.",
  },
  {
    prompt: "Which of these was a result of contact between Europe and the eastern Mediterranean during the Crusades?",
    right: "Europeans gained a taste for goods such as spices, sugar and silk, and learned about new ideas",
    wrong: [
      "Europeans stopped all trade",
      "Europeans learned nothing from other cultures",
      "Europe became isolated",
    ],
    hint: "Contact is a two-way street. Goods and ideas moved, even though the wars caused great suffering.",
    hard: true,
  },
  {
    prompt: "Why did the Church have so much influence in medieval Europe?",
    right: "Most people were Christian, and the Church ran schools, cared for the poor, owned land and shaped daily life",
    wrong: [
      "The Church had no connection to ordinary people",
      "The Church was banned by kings",
      "The Church only existed in Rome",
    ],
    hint: "The Church was part of everyday life: baptisms, weddings, festivals, education and charity.",
    hard: true,
  },
  {
    prompt: "Medieval universities such as Bologna, Paris and Oxford taught mainly in which language?",
    right: "Latin",
    wrong: ["Arabic", "Greek", "Mongolian"],
    hint: "Latin was the shared language of scholars across Europe, so students and teachers from many places could understand each other.",
    hard: true,
  },
  {
    prompt: "What was the three-field system?",
    right: "A farming method where land was divided in three parts so one rested each year, keeping soil fertile",
    wrong: [
      "A way of dividing the king's land among three sons",
      "A system of three kinds of taxes",
      "A kind of castle design",
    ],
    hint: "Rotating crops and letting one field rest (lie fallow) improved yields and helped towns grow.",
    hard: true,
  },
];

function medievalEurope(opts?: GenerateOptions): Question[] {
  const d = level(opts);
  const extras: Question[] = [feudalOrder(d), sortQuestion(MANOR_SORT, perBin(d)), sourceQuestion(MEDIEVAL_SOURCES)];
  if (d >= 2) extras.push(timelineOrder(MEDIEVAL_EVENTS, d));
  return make(MEDIEVAL_BANK, d, extras, 8);
}

// ---------- Trade Networks ----------

const TRADE_EVENTS: TimelineEvent[] = [
  { id: "mali", label: "Sundiata Keita founds the Mali Empire", year: 1235, date: "about 1235", emoji: "🌍" },
  { id: "polo", label: "Marco Polo sets out from Venice for China", year: 1271, date: "1271", emoji: "🐪" },
  { id: "hajj", label: "Mansa Musa travels to Mecca on pilgrimage", year: 1324, date: "1324", emoji: "🕋" },
  { id: "battuta", label: "Ibn Battuta visits Mali", year: 1352, date: "1352", emoji: "🧳" },
  { id: "atlas", label: "The Catalan Atlas shows Mansa Musa holding gold", year: 1375, date: "1375", emoji: "🗺️" },
];

const ROUTE_SORT: SortSet = {
  prompt: "Which trade network does each description fit best?",
  hint: "The Silk Roads linked China with Central Asia and the Mediterranean overland. The Indian Ocean network depended on monsoon winds. The trans-Saharan routes carried gold and salt by camel.",
  bins: [
    { id: "silk", label: "Silk Roads", emoji: "🧵" },
    { id: "ocean", label: "Indian Ocean trade", emoji: "⛵" },
    { id: "sahara", label: "trans-Saharan trade", emoji: "🐪" },
  ],
  items: [
    { label: "named for a prized cloth from China", emoji: "🧵", bin: "silk" },
    { label: "caravanserai inns in Central Asian oasis towns", emoji: "🏨", bin: "silk" },
    { label: "sailors waiting for seasonal monsoon winds", emoji: "🌬️", bin: "ocean" },
    { label: "Swahili coast ports such as Kilwa", emoji: "🏝️", bin: "ocean" },
    { label: "desert salt traded for West African gold", emoji: "🧂", bin: "sahara" },
    { label: "camel caravans crossing the Sahara to Timbuktu", emoji: "🐪", bin: "sahara" },
  ],
};

const TRADE_SOURCES: SourceSet[] = [
  {
    title: "A caravan guide's account (imagined for practice)",
    paragraphs: [
      "We load the salt slabs at the mine at dawn. Fifty camels walk in a long line, and the journey south takes many weeks.",
      "In the markets by the great river, traders will give us gold for each slab. Nobody in the desert has gold, and nobody by the river has salt, so both sides gain.",
    ],
    questions: [
      {
        prompt: "Why do both sides gain from this trade, according to the source?",
        right: "Each has something that the other lacks",
        wrong: ["Both sides have too much salt", "Nobody wants gold", "The camels do all the trading"],
        hint: "Find the sentence 'Nobody in the desert has gold, and nobody by the river has salt'.",
      },
      {
        prompt: "What does the source suggest about the geography of this trade route?",
        right: "Caravans of camels crossed a long desert route to reach markets near a river",
        wrong: ["Ships carried all the salt", "The route went through mountains", "It was a short journey of a day"],
        hint: "Look at what the source says about camels, weeks of travel and 'the great river'.",
      },
    ],
  },
];

function marginQuestion(difficulty: Level): Question {
  const bolts = pick(difficulty === 1 ? [10, 20, 30] : [12, 25, 40, 60]);
  const buy = randInt(8, 20);
  const sell = buy + randInt(3, 12);
  return numInput(
    `A merchant buys ${bolts} bolts of silk for ${buy} silver coins each and sells them all in a distant city for ${sell} coins each. How many coins of profit does she make in total?`,
    bolts * (sell - buy),
    `Profit per bolt = ${sell} − ${buy}. Multiply that by ${bolts} bolts.`,
    "number",
    "coins",
  );
}

const TRADE_BANK: Item[] = [
  {
    prompt: "What were the Silk Roads?",
    right: "Networks of land and sea routes linking East Asia with the Mediterranean world",
    wrong: ["A single paved highway", "A river in China", "Roads built only for the king's army"],
    hint: "There wasn't just one road. Many routes carried silk, spices, paper, ideas and religions across Asia.",
  },
  {
    prompt: "Besides goods, what else travelled along the Silk Roads?",
    right: "Ideas, technologies, religions and diseases",
    wrong: ["Nothing but cloth", "Only soldiers", "Only animals"],
    hint: "Papermaking, Buddhism and Islam are examples of ideas that moved with travellers. So did diseases.",
  },
  {
    prompt: "What was a caravanserai?",
    right: "A roadside inn where merchants and their animals could rest safely",
    wrong: ["A kind of ship", "A tax collector", "A type of silk"],
    hint: "Caravanserais were built about a day's travel apart on major routes, with space for animals, goods and people.",
  },
  {
    prompt: "What two goods were mainly exchanged in the trans-Saharan trade?",
    right: "Salt from the Sahara and gold from West Africa",
    wrong: ["Silk and tea", "Potatoes and corn", "Paper and printing presses"],
    hint: "Salt was scarce in the forest regions to the south, while the West African goldfields supplied much of the gold used in the Mediterranean world.",
  },
  {
    prompt: "Which animal made trade across the Sahara possible?",
    right: "the camel",
    wrong: ["the horse", "the llama", "the ox"],
    hint: "Camels can travel for days without drinking and are well suited to sand and heat.",
  },
  {
    prompt: "Who founded the Mali Empire around 1235?",
    right: "Sundiata Keita",
    wrong: ["Mansa Musa", "Kublai Khan", "Suleiman"],
    hint: "Sundiata's story is remembered by griots, West African oral historians, who still tell it today.",
  },
  {
    prompt: "What made Mansa Musa's 1324 pilgrimage to Mecca famous?",
    right: "He travelled with a huge caravan and gave away so much gold that people spoke of it for years",
    wrong: [
      "He travelled in secret with a few servants",
      "He asked other rulers to pay for the journey",
      "He brought no gold with him",
    ],
    hint: "Accounts from Cairo describe his generosity. News of Mali's wealth spread as far as Europe.",
  },
  {
    prompt: "Why is Timbuktu remembered?",
    right: "It was a trading city in Mali and a centre of Islamic learning, with scholars and libraries",
    wrong: [
      "It was the capital of the Mongol Empire",
      "It was a port on the Silk Road in China",
      "It was a Viking town",
    ],
    hint: "Timbuktu's mosques and schools drew scholars, and many handwritten manuscripts from the area still survive.",
  },
  {
    prompt: "What were dhows?",
    right: "Sailing ships with triangular sails used on Indian Ocean trade routes",
    wrong: ["Camel saddles", "Chinese coins", "Market tents"],
    hint: "The triangular (lateen) sail lets a ship sail well across and into the wind.",
  },
  {
    prompt: "Why did Indian Ocean sailors plan their trips around the monsoon?",
    right: "The winds blew one way in one season and the other way in another, so ships could sail out and back",
    wrong: [
      "The winds never changed",
      "The monsoon froze the sea",
      "Ships were not allowed to sail in the dry season",
    ],
    hint: "Predictable seasonal winds were like a conveyor belt in each direction.",
  },
  {
    prompt: "Ibn Battuta, a scholar from Morocco, is known for what?",
    right: "Travelling across much of the Muslim world and beyond for nearly 30 years and writing about his journeys",
    wrong: [
      "Leading the Mongol army",
      "Inventing the printing press",
      "Being the first European to reach Asia",
    ],
    hint: "He left Tangier in 1325 and visited places from West Africa to Asia. His account is a valuable source, though historians check it against others.",
  },
  {
    prompt: "What was the Hanseatic League?",
    right: "An alliance of northern European trading towns that protected their trade",
    wrong: [
      "A group of Mongol generals",
      "A Chinese dynasty",
      "A pilgrimage route",
    ],
    hint: "Towns such as Lübeck and Hamburg worked together to protect merchants and shipments in the Baltic and North seas.",
  },
  {
    prompt: "Marco Polo was a merchant from which city?",
    right: "Venice",
    wrong: ["Baghdad", "Timbuktu", "Beijing"],
    hint: "Venice was a major trading city. His book about his travels in Asia was read widely in Europe.",
  },
  {
    prompt: "Great Zimbabwe, a large stone city in southern Africa, was a centre of trade in which goods?",
    right: "gold and cattle, linked to coastal ports on the Indian Ocean",
    wrong: ["silk and porcelain only", "furs from the Arctic", "printing presses"],
    hint: "It was a wealthy city from about 1100 to 1450. Goods from inland were traded to Swahili coast cities.",
    hard: true,
  },
  {
    prompt: "Mansa Musa's wealth came mainly from…",
    right: "Mali's control of gold-producing regions and the trade routes that carried it",
    wrong: [
      "Silk farms in the desert",
      "Conquering Europe",
      "Printing paper money",
    ],
    hint: "Mali taxed and controlled the trade in gold and salt, which brought great wealth.",
    hard: true,
  },
  {
    prompt: "The Catalan Atlas (1375), a European map, shows a ruler of Mali holding a gold nugget. What does this suggest?",
    right: "People in Europe knew of Mali's wealth by then",
    wrong: [
      "Europeans had visited Mali and ruled it",
      "Gold was found only in Europe",
      "The map was drawn in Mali",
    ],
    hint: "Maps are sources too. The picture shows how far the news of the wealth of West Africa had travelled.",
    hard: true,
  },
  {
    prompt: "Why were trade cities often places where new ideas appeared?",
    right: "Merchants and travellers from different places met there and shared goods, languages and knowledge",
    wrong: [
      "Trade cities had no visitors",
      "People in trade cities avoided new ideas",
      "Merchants did not talk to each other",
    ],
    hint: "Exchanges don't only involve goods. Ideas, languages, foods and inventions travelled too.",
    hard: true,
  },
];

function tradeNetworks(opts?: GenerateOptions): Question[] {
  const d = level(opts);
  const extras: Question[] = [timelineOrder(TRADE_EVENTS, d), sortQuestion(ROUTE_SORT, 2), sourceQuestion(TRADE_SOURCES)];
  if (d >= 2) extras.push(marginQuestion(d));
  return make(TRADE_BANK, d, extras, 8);
}

// ---------- China & the Mongol Empire ----------

const CHINA_EVENTS: TimelineEvent[] = [
  { id: "song", label: "The Song dynasty begins", year: 960, date: "960", emoji: "🏮" },
  { id: "genghis", label: "Genghis Khan unites the Mongol peoples", year: 1206, date: "1206", emoji: "🐎" },
  { id: "yuan", label: "Kublai Khan founds the Yuan dynasty", year: 1271, date: "1271", emoji: "👑" },
  { id: "ming", label: "The Ming dynasty begins", year: 1368, date: "1368", emoji: "🏯" },
  { id: "zheng", label: "Zheng He's first treasure voyage sails", year: 1405, date: "1405", emoji: "🚢" },
];

const CHINA_SORT: SortSet = {
  prompt: "Song China or the Mongol Empire? Sort each item.",
  hint: "Song China (960–1279) is known for paper money, movable-type printing and civil service exams. The Mongols are known for horse archers, the yam relay system and conquest across Asia.",
  bins: [
    { id: "song", label: "Song China", emoji: "🏮" },
    { id: "mongol", label: "Mongol Empire", emoji: "🐎" },
  ],
  items: [
    { label: "paper money used widely", emoji: "💴", bin: "song" },
    { label: "movable-type printing", emoji: "🖨️", bin: "song" },
    { label: "civil service exams for officials", emoji: "📝", bin: "song" },
    { label: "faster-ripening Champa rice", emoji: "🌾", bin: "song" },
    { label: "skilled horse archers", emoji: "🏹", bin: "mongol" },
    { label: "the yam relay-post system", emoji: "📮", bin: "mongol" },
    { label: "Genghis Khan", emoji: "🐎", bin: "mongol" },
    { label: "an empire from East Asia into Eastern Europe", emoji: "🗺️", bin: "mongol" },
  ],
};

function dynastyLength(): Question {
  const d = pick([
    { name: "Song", from: 960, to: 1279 },
    { name: "Yuan", from: 1271, to: 1368 },
    { name: "Ming", from: 1368, to: 1644 },
    { name: "Tang", from: 618, to: 907 },
  ]);
  return numInput(
    `The ${d.name} dynasty ruled from ${d.from} to ${d.to}. For how many years did it last?`,
    d.to - d.from,
    `Subtract the start year from the end year: ${d.to} − ${d.from}.`,
    "number",
    "years",
  );
}

const CHINA_BANK: Item[] = [
  {
    prompt: "Which of these inventions or developments is linked to Song China?",
    right: "Widespread paper money and movable-type printing",
    wrong: ["The printing press with a screw press", "Steam engines", "Railways"],
    hint: "Bi Sheng developed movable type from clay around 1040. Paper money was used widely in the Song era to make trade easier.",
  },
  {
    prompt: "How did the Chinese magnetic compass change travel?",
    right: "It helped sailors find direction at sea even when they could not see land or stars",
    wrong: ["It measured how fast a ship moved", "It predicted storms", "It was used to catch fish"],
    hint: "A magnetised needle points north-south. This helped navigation and was later used across the Indian Ocean and Europe.",
  },
  {
    prompt: "How were officials chosen in Song China?",
    right: "Many were chosen through civil service examinations based on Confucian learning",
    wrong: [
      "All were chosen by lottery",
      "Only by their military victories",
      "Only by their wealth",
    ],
    hint: "The exams opened government jobs to talented students, though in practice education was costly.",
  },
  {
    prompt: "Who united the Mongol peoples in 1206 and became known as Genghis Khan?",
    right: "Temujin",
    wrong: ["Kublai", "Zhu Yuanzhang", "Zheng He"],
    hint: "Temujin was given the title Genghis Khan, meaning something like 'universal ruler' or 'strong ruler'.",
  },
  {
    prompt: "Which skills helped the Mongol army win so many battles?",
    right: "Mobility on horseback, discipline and skilled archery",
    wrong: ["Heavy stone fortresses", "Large navies", "Steam engines"],
    hint: "Mongol warriors grew up riding and herding. They could travel long distances and shoot while riding.",
  },
  {
    prompt: "What was the yam system?",
    right: "A network of relay stations that let messengers and travellers cross the Mongol Empire quickly",
    wrong: ["A tax on grain", "A type of horse armour", "A school for scribes"],
    hint: "Riders swapped tired horses for fresh ones at stations along the route.",
  },
  {
    prompt: "What is meant by the Pax Mongolica?",
    right: "A period when Mongol rule made long-distance travel and trade across Asia safer",
    wrong: [
      "A peace treaty that ended the Mongol Empire",
      "A law code of Genghis Khan",
      "A war between the Mongols and Spain",
    ],
    hint: "'Pax' means peace in Latin. Merchants and travellers could cross Asia more safely, which increased the exchange of goods and ideas.",
  },
  {
    prompt: "Kublai Khan, a grandson of Genghis Khan, founded which dynasty in China?",
    right: "the Yuan dynasty",
    wrong: ["the Tang dynasty", "the Ming dynasty", "the Song dynasty"],
    hint: "Kublai founded the Yuan dynasty in 1271 and completed his conquest of the Song in 1279.",
  },
  {
    prompt: "Which statement about the Mongol conquests is the most accurate?",
    right: "They caused huge destruction and loss of life in many places, and Mongol rule also connected regions through trade and travel",
    wrong: [
      "They were peaceful and caused no harm",
      "They only brought harm and no connections",
      "They affected only China",
    ],
    hint: "A good historian holds both truths. The conquests were violent, and the empire also linked regions.",
  },
  {
    prompt: "Which dynasty drove the Mongols out of China in 1368?",
    right: "the Ming dynasty",
    wrong: ["the Yuan dynasty", "the Song dynasty", "the Qing dynasty"],
    hint: "Zhu Yuanzhang, founder of the Ming and known as the Hongwu Emperor, led the rebellion.",
  },
  {
    prompt: "What was the Forbidden City?",
    right: "The emperor's palace complex in Beijing, built in the early 1400s",
    wrong: ["A Mongol camp", "A port city", "A walled village for farmers"],
    hint: "Built under the Yongle Emperor of the Ming dynasty, it was the centre of imperial government for centuries.",
  },
  {
    prompt: "Who was Zheng He?",
    right: "A Ming admiral who led large fleets on voyages to Southeast Asia, India, Arabia and East Africa",
    wrong: ["A Mongol general", "A Song poet", "An explorer for Spain"],
    hint: "Between 1405 and 1433, Zheng He led seven voyages with hundreds of ships, to show Ming power and to trade.",
  },
  {
    prompt: "What does Confucianism emphasize?",
    right: "Respect, education, family duty and harmony in society",
    wrong: ["Conquering other lands", "Abandoning all schools", "Trade with Europe"],
    hint: "Confucian ideas shaped government and family life in China for centuries.",
  },
  {
    prompt: "Why was the Grand Canal important to Ming and Song rulers?",
    right: "It carried grain and goods between the productive south and the capital in the north",
    wrong: ["It kept out the Mongols", "It was a trade route to Europe", "It protected the coast"],
    hint: "Moving large amounts of grain by water was far cheaper than carrying it overland.",
  },
  {
    prompt: "After Zheng He's voyages ended in 1433, China's government did not send such fleets again. Which of these have historians suggested as reasons?",
    right: "The high cost, defence needs on the northern border, and shifting priorities at court",
    wrong: [
      "They ran out of ships because of a plague at sea",
      "They were defeated in a naval battle with Spain",
      "The compass stopped working",
    ],
    hint: "Historians look at several reasons. The fleets were expensive and the Ming faced threats along its northern frontier.",
    hard: true,
  },
  {
    prompt: "The Mongols often allowed conquered people to keep their religions. How did this help their empire?",
    right: "It reduced conflict and let the Mongols use skilled people from many backgrounds",
    wrong: [
      "It forced everyone to become Mongol",
      "It had no effect",
      "It ended all trade",
    ],
    hint: "Practical rulers used skilled officials, translators and merchants from many cultures.",
    hard: true,
  },
  {
    prompt: "How did Champa rice, introduced to Song China from Southeast Asia, affect society?",
    right: "It ripened faster and allowed more harvests, so food supplies and population grew",
    wrong: [
      "It was too slow to grow",
      "It made farmland unusable",
      "It was only used for medicine",
    ],
    hint: "More food meant larger cities, more trade and more people free for crafts and learning.",
    hard: true,
  },
  {
    prompt: "Why was Genghis Khan's empire called the largest contiguous land empire?",
    right: "It stretched across Asia and into Eastern Europe without being separated by sea",
    wrong: [
      "It included islands in every ocean",
      "It covered only the Gobi desert",
      "It was based on naval power",
    ],
    hint: "'Contiguous' means connected. Mongol territories were joined together over land.",
    hard: true,
  },
];

function chinaAndMongols(opts?: GenerateOptions): Question[] {
  const d = level(opts);
  const extras: Question[] = [timelineOrder(CHINA_EVENTS, d), sortQuestion(CHINA_SORT, perBin(d))];
  if (d >= 2) extras.push(dynastyLength());
  return make(CHINA_BANK, d, extras, 8);
}

// ---------- Renaissance, Print & Reformation ----------

const RENAISSANCE_EVENTS: TimelineEvent[] = [
  { id: "press", label: "Gutenberg develops printing with movable metal type in Mainz", year: 1450, date: "about 1450", emoji: "🖨️" },
  { id: "sistine", label: "Michelangelo finishes painting the Sistine Chapel ceiling", year: 1512, date: "1512", emoji: "🎨" },
  { id: "luther", label: "Martin Luther posts his Ninety-five Theses", year: 1517, date: "1517", emoji: "✍️" },
  { id: "henry", label: "England's Parliament makes the king head of the Church of England", year: 1534, date: "1534", emoji: "👑" },
  { id: "copernicus", label: "Copernicus publishes his sun-centred model of the universe", year: 1543, date: "1543", emoji: "☀️" },
];

const RENREF_SORT: SortSet = {
  prompt: "Renaissance or Reformation? Sort each item.",
  hint: "The Renaissance was a revival of learning and art, starting in Italy. The Reformation began in 1517 as a challenge to the Church, which led to Protestant churches.",
  bins: [
    { id: "ren", label: "Renaissance", emoji: "🎨" },
    { id: "ref", label: "Reformation", emoji: "✝️" },
  ],
  items: [
    { label: "linear perspective in paintings", emoji: "🖼️", bin: "ren" },
    { label: "study of ancient Greek and Roman texts", emoji: "📚", bin: "ren" },
    { label: "Michelangelo's statue of David", emoji: "🗿", bin: "ren" },
    { label: "rich patrons such as the Medici family", emoji: "🏦", bin: "ren" },
    { label: "the Ninety-five Theses", emoji: "📜", bin: "ref" },
    { label: "a Bible translated into everyday German", emoji: "📖", bin: "ref" },
    { label: "new Protestant churches", emoji: "⛪", bin: "ref" },
    { label: "arguments over the selling of indulgences", emoji: "💰", bin: "ref" },
  ],
};

const PRINT_SOURCES: SourceSet[] = [
  {
    title: "A printer's apprentice writes home (imagined for practice)",
    paragraphs: [
      "Dear mother, this week I helped set type for a book. We place each metal letter in a frame, ink it and press the paper down. One day's work makes two hundred pages.",
      "A monk once needed a year to copy a book like this by hand. Now students in towns near and far can afford their own copies.",
    ],
    questions: [
      {
        prompt: "What change does this source describe?",
        right: "Printing made books faster and cheaper to produce than hand copying",
        wrong: [
          "Books became harder to find",
          "Monks began to print books with their hands",
          "Books were no longer written in any language",
        ],
        hint: "Compare the 'two hundred pages' per day with a monk's year of copying.",
      },
      {
        prompt: "What consequence of printing does the source suggest?",
        right: "More people could own books",
        wrong: [
          "Fewer people could read",
          "Books became rarer",
          "The Church banned all writing",
        ],
        hint: "Look at the last sentence: students 'can afford their own copies'.",
      },
    ],
  },
];

const RENAISSANCE_BANK: Item[] = [
  {
    prompt: "What does 'Renaissance' mean?",
    right: "Rebirth",
    wrong: ["Revolution", "Reformation", "Rule"],
    hint: "People in Europe saw it as a rebirth of interest in classical Greek and Roman learning and art.",
  },
  {
    prompt: "In which country did the Renaissance begin?",
    right: "Italy, especially city-states like Florence",
    wrong: ["Russia", "Japan", "Egypt"],
    hint: "Wealthy Italian trading cities could pay for art and learning, and Roman ruins inspired them.",
  },
  {
    prompt: "What was a patron in the Renaissance?",
    right: "A wealthy person or family who paid artists and scholars",
    wrong: ["A teacher in a church school", "A type of painting", "A kind of printing press"],
    hint: "Families such as the Medici of Florence supported artists, which let them spend time on their work.",
  },
  {
    prompt: "What is humanism?",
    right: "A way of thinking that studied classical texts and valued human abilities and achievements",
    wrong: ["A belief that humans are unimportant", "A style of church building", "A trading company"],
    hint: "Humanists wanted people to be educated in history, language, art and ethics.",
  },
  {
    prompt: "Leonardo da Vinci is called a 'Renaissance person'. Why?",
    right: "He was skilled in many fields, such as painting, engineering and anatomy",
    wrong: ["He lived only in one city", "He only painted portraits", "He was a king"],
    hint: "His notebooks include designs for machines, studies of the human body and detailed drawings.",
  },
  {
    prompt: "What did artists using linear perspective learn to do?",
    right: "Draw realistic depth on a flat surface",
    wrong: ["Paint without colour", "Make statues taller", "Print books"],
    hint: "Lines going into the distance meet at a vanishing point, which makes flat pictures look three-dimensional.",
  },
  {
    prompt: "Who developed a printing press using movable metal type in Mainz, Germany, around 1450?",
    right: "Johannes Gutenberg",
    wrong: ["Leonardo da Vinci", "Martin Luther", "Galileo"],
    hint: "Gutenberg's most famous print is the Gutenberg Bible, completed in the 1450s.",
  },
  {
    prompt: "How were books made in Europe before the printing press?",
    right: "Scribes copied them by hand",
    wrong: ["Machines stamped them", "They were all carved in stone", "They were written by computers"],
    hint: "Copying took months, so books were rare and expensive.",
  },
  {
    prompt: "How did the printing press change the spread of ideas?",
    right: "Books became cheaper and more plentiful, so ideas spread faster to more people",
    wrong: [
      "Books became harder to find",
      "Fewer people learned to read",
      "Ideas spread only by speaking",
    ],
    hint: "Within about 50 years, millions of books were printed. Reading and learning spread widely.",
  },
  {
    prompt: "Movable type was used before Gutenberg in…",
    right: "China and Korea",
    wrong: ["the Americas", "Africa", "Australia"],
    hint: "Bi Sheng in China (about 1040) and printers in Korea (metal type in the 1300s) used movable type centuries earlier.",
  },
  {
    prompt: "What did Martin Luther criticize in 1517?",
    right: "The Church's sale of indulgences",
    wrong: ["The invention of paper", "The use of printing", "Trade with Asia"],
    hint: "Indulgences were payments believed to reduce punishment for sins. Luther argued that forgiveness could not be bought.",
  },
  {
    prompt: "Why did Luther's ideas spread so quickly?",
    right: "Printing presses made copies of his writings available across Europe",
    wrong: ["He had no writings", "His ideas were secret", "Only the king heard of them"],
    hint: "Pamphlets and translations could be printed in large numbers and carried across regions.",
  },
  {
    prompt: "What does 'Protestant' refer to?",
    right: "Christians who broke away from the Roman Catholic Church during the Reformation",
    wrong: ["Followers of the Orthodox church", "Scholars of ancient Greece", "Members of a guild"],
    hint: "The Reformation led to new Christian churches, such as Lutheran and Reformed churches, and later others.",
  },
  {
    prompt: "What was one long-term result of the Reformation?",
    right: "Western Christianity was divided into Catholic and Protestant churches, and conflicts followed in many places",
    wrong: [
      "All Europeans joined the same church",
      "The Church became stronger everywhere",
      "Religion stopped mattering",
    ],
    hint: "The split changed politics as well as religion. Some wars and persecutions followed, and later some places gained more religious toleration.",
  },
  {
    prompt: "In 1543, Copernicus published a model in which…",
    right: "the Earth and other planets orbit the Sun",
    wrong: ["the Sun orbits the Earth", "the Moon is a planet", "the stars are painted on a dome"],
    hint: "This was a major shift in thinking, based on observation and mathematics.",
    hard: true,
  },
  {
    prompt: "Why did some Greek scholars bring manuscripts to Italy after 1453?",
    right: "Constantinople fell to the Ottomans, and some scholars left, bringing texts with them",
    wrong: [
      "Italy had banned Greek books",
      "Greek books were printed first in Italy",
      "Greece had no scholars",
    ],
    hint: "This is one of several factors that strengthened interest in classical learning in Italy. Others included wealth and patrons.",
    hard: true,
  },
  {
    prompt: "Which statement about the Renaissance is most accurate?",
    right: "It was a period of great change in art and learning in parts of Europe, built on ideas from many cultures",
    wrong: [
      "It happened everywhere in the world at the same time",
      "It invented all science from nothing",
      "It involved no knowledge from outside Europe",
    ],
    hint: "Renaissance thinkers learned from Greek and Roman writings and also from Arabic scholars, whose books had been translated.",
    hard: true,
  },
  {
    prompt: "Which of these was a consequence of the printing press for languages?",
    right: "Printing helped standardize spelling and encouraged books in local languages instead of only Latin",
    wrong: [
      "Printing ended the use of all languages",
      "Only Latin books were printed",
      "Printing made reading illegal",
    ],
    hint: "Luther's German Bible and other books in local languages helped shape modern languages.",
    hard: true,
  },
];

function renaissanceAndReformation(opts?: GenerateOptions): Question[] {
  const d = level(opts);
  const extras: Question[] = [timelineOrder(RENAISSANCE_EVENTS, d), sortQuestion(RENREF_SORT, perBin(d)), sourceQuestion(PRINT_SOURCES)];
  return make(RENAISSANCE_BANK, d, extras, 8);
}

// ---------- Civilizations of the Americas ----------

const AMERICAS_EVENTS: TimelineEvent[] = [
  { id: "classic", label: "The Classic period of Maya city-states begins", year: 250, date: "about 250", emoji: "🗿" },
  { id: "cahokia", label: "Cahokia, near present-day St. Louis, becomes a large city", year: 1050, date: "about 1050", emoji: "⛰️" },
  { id: "tenochtitlan", label: "Tenochtitlan is founded on an island in Lake Texcoco", year: 1325, date: "1325", emoji: "🏙️" },
  { id: "alliance", label: "Tenochtitlan, Texcoco and Tlacopan form the Triple Alliance", year: 1428, date: "1428", emoji: "🤝" },
  { id: "inca", label: "Pachacuti begins to expand the Inca state", year: 1438, date: "about 1438", emoji: "🏔️" },
];

const CIV_SORT: SortSet = {
  prompt: "Maya, Mexica (Aztec) or Inca? Sort each item.",
  hint: "The Maya had glyph writing and a base-20 number system. The Mexica built Tenochtitlan on a lake. The Inca ruled the Andes, kept records with quipus and built roads.",
  bins: [
    { id: "maya", label: "Maya", emoji: "🗿" },
    { id: "mexica", label: "Mexica (Aztec)", emoji: "🏙️" },
    { id: "inca", label: "Inca", emoji: "🏔️" },
  ],
  items: [
    { label: "glyph writing and a base-20 number system", emoji: "🔢", bin: "maya" },
    { label: "city-states such as Tikal and Palenque", emoji: "🏛️", bin: "maya" },
    { label: "a capital on an island in Lake Texcoco", emoji: "🏝️", bin: "mexica" },
    { label: "chinampa farm plots feeding the capital", emoji: "🌽", bin: "mexica" },
    { label: "quipu knotted cords for keeping records", emoji: "🧶", bin: "inca" },
    { label: "a road network and rope bridges through the Andes", emoji: "🌉", bin: "inca" },
  ],
};

function quipuQuestion(difficulty: Level): Question {
  const h = difficulty === 1 ? 0 : randInt(1, 9);
  const t = randInt(1, 9);
  const o = randInt(1, 9);
  const n = h * 100 + t * 10 + o;
  const parts = h > 0 ? `${h} knots in the hundreds position, ${t} in the tens position and ${o} in the ones position` : `${t} knots in the tens position and ${o} in the ones position`;
  return numInput(
    `Inca record-keepers used quipus, cords with knots whose positions show place value. A cord has ${parts}. What number does it record?`,
    n,
    "Each position is a place value, like in our number system. The number of knots in a position is that digit.",
    "number",
  );
}

function mayaQuestion(difficulty: Level): Question {
  const bars = randInt(difficulty === 1 ? 0 : 1, 3);
  const dots = randInt(bars === 0 ? 1 : 0, 4);
  const n = bars * 5 + dots;
  return numInput(
    `A Maya numeral uses a bar for 5 and a dot for 1. What number is shown by ${bars} bar${bars === 1 ? "" : "s"} and ${dots} dot${dots === 1 ? "" : "s"}?`,
    n,
    `Each bar is worth 5, so ${bars} × 5 = ${bars * 5}. Then add ${dots} for the dots.`,
    "number",
  );
}

const AMERICAS_BANK: Item[] = [
  {
    prompt: "Where did the ancient Maya civilization develop?",
    right: "Southern Mexico and Central America",
    wrong: ["The Andes in South America", "The Arctic coast", "The Great Plains of North America"],
    hint: "Maya cities such as Tikal were in present-day Guatemala, Belize, Honduras, El Salvador and Mexico.",
  },
  {
    prompt: "Which of these did the Maya develop?",
    right: "A writing system of glyphs, a calendar and advanced mathematics including a symbol for zero",
    wrong: ["The printing press", "Gunpowder", "Iron swords"],
    hint: "Maya astronomers tracked the sun, moon and Venus, and they used a base-20 number system.",
  },
  {
    prompt: "Are there Maya people today?",
    right: "Yes. Millions of Maya people live in Mexico, Guatemala and nearby countries and speak Maya languages",
    wrong: [
      "No. The Maya disappeared completely",
      "Only a few families remain",
      "Only in museums",
    ],
    hint: "Maya cities were abandoned or declined, but the people did not vanish. Their communities continue today.",
  },
  {
    prompt: "What was the Mexica (Aztec) capital called?",
    right: "Tenochtitlan",
    wrong: ["Cusco", "Tikal", "Cahokia"],
    hint: "Tenochtitlan was built on an island in Lake Texcoco, where Mexico City stands today.",
  },
  {
    prompt: "What were chinampas?",
    right: "Artificial farming plots built in shallow lake water",
    wrong: ["Stone temples", "Trading ships", "Writing tablets"],
    hint: "Farmers piled mud and plants to make rectangular fields, which gave high yields of crops like maize and beans.",
  },
  {
    prompt: "How did the Mexica rulers get wealth and goods from the peoples they controlled?",
    right: "Through tribute, a regular payment of goods or labour",
    wrong: ["Through a bank", "Through coins made of silver", "By selling printed books"],
    hint: "Tribute lists show cotton cloth, cacao, feathers and food coming to the capital.",
  },
  {
    prompt: "What language was widely used in the Mexica empire, and is still spoken today?",
    right: "Nahuatl",
    wrong: ["Latin", "Arabic", "Quechua"],
    hint: "More than a million people speak Nahuatl today. Words like chocolate, tomato and avocado come from it.",
  },
  {
    prompt: "What was the Inca capital?",
    right: "Cusco",
    wrong: ["Tenochtitlan", "Copán", "Calakmul"],
    hint: "Cusco is in the Andes of present-day Peru. The Inca called their empire Tawantinsuyu, 'the four parts together'.",
  },
  {
    prompt: "What was a quipu?",
    right: "A set of knotted cords used by the Inca to record numbers and information",
    wrong: ["A kind of Inca coin", "A mountain pass", "A type of potato"],
    hint: "The colour, knot type and position all carried meaning. Specialists called quipucamayocs read them.",
  },
  {
    prompt: "How did the Inca connect their empire across the mountains?",
    right: "With stone roads, rope suspension bridges and relay runners",
    wrong: ["Railways", "Canals through the Andes", "Horses and wagons"],
    hint: "The road system, the Qhapaq Ñan, covered tens of thousands of kilometres. The Inca had no horses or wheeled carts.",
  },
  {
    prompt: "What was the Inca mit'a system?",
    right: "A labour service in which people took turns working on roads, farms and buildings for the state",
    wrong: ["A coin system", "An alphabet", "A market for gold"],
    hint: "Instead of paying money, communities gave labour as a kind of tax.",
  },
  {
    prompt: "Machu Picchu, built about 1450, was most likely…",
    right: "a royal estate for the Inca ruler Pachacuti",
    wrong: ["a port city", "a Mexica temple", "a Maya observatory"],
    hint: "It sits high in the Andes. Today it is a famous site that is also connected to Indigenous people in the region.",
  },
  {
    prompt: "Cahokia, near present-day St. Louis, was home to thousands of people about 1050. What is it known for?",
    right: "Huge earthen mounds and being one of the largest cities in North America at the time",
    wrong: ["Stone pyramids covered in glyphs", "Iron-working", "A seaport"],
    hint: "Cahokia was part of the Mississippian culture. Monks Mound is one of the largest earthen structures in the Americas.",
  },
  {
    prompt: "Which crop was central to life for the Maya and the Mexica?",
    right: "maize (corn)",
    wrong: ["wheat", "rice", "oats"],
    hint: "Maize, beans and squash were grown together. Many Maya stories speak of maize as a gift.",
  },
  {
    prompt: "Maya cities such as Tikal had tall stepped pyramids. What were they used for?",
    right: "Temples and royal monuments, often tied to astronomy and rulers' history",
    wrong: ["Warehouses for grain", "Hotels for visitors", "Lighthouses"],
    hint: "Pyramids were centres of religious and political life. Carved stone monuments recorded rulers' stories and dates.",
    hard: true,
  },
  {
    prompt: "The Mexica Triple Alliance was formed by Tenochtitlan, Texcoco and Tlacopan. Why was it important?",
    right: "It joined three city-states that together controlled a large area through tribute",
    wrong: [
      "It united all peoples of North and South America",
      "It ended trade between cities",
      "It formed after Spain arrived",
    ],
    hint: "The alliance formed around 1428 and grew into what is often called the Aztec Empire, years before Europeans arrived.",
    hard: true,
  },
  {
    prompt: "How did the Inca store food against hard times?",
    right: "They freeze-dried potatoes (chuño) and kept crops in state storehouses",
    wrong: [
      "They had no way to store food",
      "They imported all food from Europe",
      "They canned vegetables",
    ],
    hint: "In the cold, high Andes, potatoes freeze at night and are dried in the sun, so they last for years.",
    hard: true,
  },
  {
    prompt: "Why should we be careful about calling Indigenous societies without large cities or written scripts 'primitive'?",
    right: "Societies can be complex and knowledgeable in many ways, and cities or writing are not the only measures of achievement",
    wrong: [
      "Only societies with cities matter in history",
      "Writing is the only way to keep a record",
      "Historians never describe Indigenous societies",
    ],
    hint: "Many Indigenous societies in the Americas, with or without cities, developed deep knowledge, governance, law and ways of keeping records.",
    hard: true,
  },
];

function americasBeforeContact(opts?: GenerateOptions): Question[] {
  const d = level(opts);
  const extras: Question[] = [timelineOrder(AMERICAS_EVENTS, d), sortQuestion(CIV_SORT, 2), chance(0.5) ? quipuQuestion(d) : mayaQuestion(d)];
  return make(AMERICAS_BANK, d, extras, 8);
}

// ---------- Contact & Exchange ----------

const CONTACT_EVENTS: TimelineEvent[] = [
  { id: "norse", label: "Norse people build a settlement at L'Anse aux Meadows", year: 1000, date: "about 1000", emoji: "🛶" },
  { id: "columbus", label: "Columbus sails across the Atlantic for Spain", year: 1492, date: "1492", emoji: "⛵" },
  { id: "gama", label: "Vasco da Gama reaches India by sailing around Africa", year: 1498, date: "1498", emoji: "🧭" },
  { id: "tenochtitlan", label: "Tenochtitlan falls to Spanish and Indigenous allied forces", year: 1521, date: "1521", emoji: "🏙️" },
  { id: "magellan", label: "The Magellan expedition completes the first voyage around the world", year: 1522, date: "1522", emoji: "🌍" },
  { id: "cartier", label: "Jacques Cartier first sails into the Gulf of St. Lawrence", year: 1534, date: "1534", emoji: "🧭" },
];

const EXCHANGE_SORT: SortSet = {
  prompt: "Where did it come from? Sort each item in the Columbian exchange.",
  hint: "Potatoes, maize, tomatoes and cacao came from the Americas. Horses, wheat, sugar cane and cattle came from Europe, Asia and Africa.",
  bins: [
    { id: "americas", label: "from the Americas", emoji: "🌽" },
    { id: "old", label: "from Europe, Asia and Africa", emoji: "🐎" },
  ],
  items: [
    { label: "potatoes", emoji: "🥔", bin: "americas" },
    { label: "maize (corn)", emoji: "🌽", bin: "americas" },
    { label: "tomatoes", emoji: "🍅", bin: "americas" },
    { label: "cacao (chocolate)", emoji: "🍫", bin: "americas" },
    { label: "horses", emoji: "🐎", bin: "old" },
    { label: "wheat", emoji: "🌾", bin: "old" },
    { label: "sugar cane", emoji: "🎋", bin: "old" },
    { label: "cattle", emoji: "🐄", bin: "old" },
  ],
};

const CONTACT_SOURCES: SourceSet[] = [
  {
    title: "A ship officer's log (imagined for practice)",
    paragraphs: [
      "We have sighted land. People came out to the shore in canoes to meet us. They gave us cotton thread and parrots, and we gave them small glass beads.",
      "I will write to the king that the land is rich and that these people could be of great use to our cause.",
    ],
    questions: [
      {
        prompt: "From whose perspective is this source written?",
        right: "A European officer reporting to a ruler back home",
        wrong: [
          "An Indigenous person who lived on the shore",
          "A modern historian",
          "A neutral observer with no interests",
        ],
        hint: "Notice who the writer reports to and what he hopes to gain.",
      },
      {
        prompt: "What is missing from this source?",
        right: "The views and voices of the people who lived there",
        wrong: [
          "Any mention of land",
          "The date of the diary",
          "Information about canoes",
        ],
        hint: "A single source gives one view. Historians look for Indigenous oral histories and other sources too.",
      },
      {
        prompt: "What does the line 'could be of great use to our cause' suggest about the writer's purpose?",
        right: "He sees the people as a way to benefit his own side, which may colour how he describes them",
        wrong: [
          "He wants to leave the land forever",
          "He is only interested in the weather",
          "He respects them as equals in every way",
        ],
        hint: "Purpose shapes what writers include and how they describe other people.",
      },
    ],
  },
];

const CONTACT_BANK: Item[] = [
  {
    prompt: "Why did Portugal and Spain look for sea routes to Asia?",
    right: "To trade directly for spices and other goods without paying the many middlemen who controlled overland routes",
    wrong: [
      "Because they wanted to avoid all trade",
      "Because overland roads were freshly paved",
      "Because they knew the Americas were there",
    ],
    hint: "Spices were valuable in Europe. Reaching the source by sea could bring large profits.",
  },
  {
    prompt: "Which technology helped European sailors travel farther in the 1400s?",
    right: "The caravel ship, along with the compass and astrolabe",
    wrong: ["Steamships", "Aeroplanes", "Satellites"],
    hint: "Caravels were light and manoeuvrable, and good at sailing into the wind. Navigation tools were borrowed and improved from other cultures.",
  },
  {
    prompt: "What did Vasco da Gama accomplish in 1498?",
    right: "He reached India by sailing around Africa",
    wrong: ["He reached the Americas", "He sailed around the world", "He built the first caravel"],
    hint: "His voyage opened a direct sea route from Europe to India.",
  },
  {
    prompt: "Columbus believed he had reached Asia in 1492. In fact, he had reached…",
    right: "islands in the Caribbean, where the Taíno and other peoples already lived",
    wrong: [
      "empty islands in the Pacific",
      "the coast of India",
      "the shores of Japan",
    ],
    hint: "The Americas were home to millions of people with their own societies. Europeans were new arrivals.",
  },
  {
    prompt: "Why do many historians avoid saying Europeans 'discovered' the Americas?",
    right: "The lands were already home to Indigenous peoples with their own societies, who had lived there for thousands of years",
    wrong: [
      "Because the voyages never happened",
      "Because the Americas were empty",
      "Because the word is in another language",
    ],
    hint: "'Discovered' is told from only a European viewpoint. Contact is a better term for the meeting of peoples.",
  },
  {
    prompt: "Who were the first Europeans known to have built a settlement in North America, about 1000 CE?",
    right: "Norse people, at L'Anse aux Meadows in Newfoundland",
    wrong: ["The Portuguese in Brazil", "The Spanish in Florida", "The French in Québec"],
    hint: "The site is a UNESCO World Heritage Site. The settlement lasted only a short time.",
  },
  {
    prompt: "What is the Columbian exchange?",
    right: "The movement of plants, animals, people, diseases and ideas between the Americas and Europe, Africa and Asia after 1492",
    wrong: [
      "A trade treaty signed by Columbus",
      "A coin used by Spain",
      "A market in Tenochtitlan",
    ],
    hint: "'Exchange' goes both ways, and not all of it was beneficial.",
  },
  {
    prompt: "Why did diseases like smallpox and measles cause such great loss of life among Indigenous peoples of the Americas?",
    right: "These diseases were new to the Americas, so people had no immunity",
    wrong: [
      "Indigenous peoples did not care for the sick",
      "The diseases came from the Americas",
      "Indigenous peoples had been exposed to the diseases for centuries",
    ],
    hint: "Diseases from Europe, Africa and Asia reached communities that had never met them. Estimates vary, but in many places a very large share of people died.",
  },
  {
    prompt: "How did the arrival of horses change life for many Plains nations in North America over time?",
    right: "They changed hunting, travel and trade, and became important in many cultures",
    wrong: [
      "They had no effect",
      "Horses came from the Americas to Europe",
      "Plains nations had been unable to travel before",
    ],
    hint: "Horses, brought by Europeans, spread through Indigenous trade networks in the 1600s and 1700s. Nations adapted them to their own ways of life.",
  },
  {
    prompt: "How did potatoes and maize from the Americas change the rest of the world?",
    right: "They became important foods, helping populations grow in Europe, Africa and Asia",
    wrong: ["They were quickly forgotten", "They were poisonous everywhere", "They were used only as decorations"],
    hint: "Potatoes grow well in cool climates, and maize adapted to many regions. Both gave a lot of food from small areas.",
  },
  {
    prompt: "What happened in the Americas as European colonies grew in the 1500s?",
    right: "Millions of enslaved Africans were forced to work on plantations, beginning a long and cruel trade across the Atlantic",
    wrong: [
      "Slavery ended everywhere",
      "Europeans left the Americas",
      "African people sailed to the Americas voluntarily in large numbers",
    ],
    hint: "Enslaved Africans were taken against their will. The harm of the slave trade is still felt and studied today.",
  },
  {
    prompt: "Who was in the Spanish expedition that took Tenochtitlan in 1521?",
    right: "Spanish forces and thousands of Indigenous allies, such as the Tlaxcalans, who had their own reasons to oppose the Mexica",
    wrong: [
      "Only Spanish soldiers",
      "The Inca army",
      "Norse explorers",
    ],
    hint: "Many peoples who had been forced to pay tribute joined the Spanish. Disease, especially smallpox, also weakened the city.",
  },
  {
    prompt: "Jacques Cartier sailed into the Gulf of St. Lawrence in 1534. Who lived there then?",
    right: "Indigenous peoples such as the Mi'kmaq and the St. Lawrence Iroquoians",
    wrong: ["Nobody", "Only French settlers", "Only the Norse"],
    hint: "Indigenous nations had lived in and managed these lands and waters for thousands of years and traded with newcomers.",
  },
  {
    prompt: "The Treaty of Tordesillas (1494) divided new lands between Spain and Portugal. What is important about who was left out?",
    right: "The Indigenous peoples who lived on those lands had no say",
    wrong: [
      "Nobody lived on the lands",
      "Indigenous peoples signed the treaty",
      "The treaty gave land back to Indigenous peoples",
    ],
    hint: "A treaty made by two European powers could not decide who owned places that other peoples already lived on.",
    hard: true,
  },
  {
    prompt: "A European chronicle calls Tenochtitlan 'conquered' in 1521. How might a historian add Nahua perspectives?",
    right: "By also reading accounts written or told by Nahua people, which describe the same events differently",
    wrong: [
      "By ignoring all non-European sources",
      "By deleting the chronicle",
      "By assuming Nahua people recorded nothing",
    ],
    hint: "Some Nahua accounts survive, such as texts written in Nahuatl in the 1500s, along with oral histories and art.",
    hard: true,
  },
  {
    prompt: "Which of these foods was unknown in Europe before 1492?",
    right: "tomatoes",
    wrong: ["wheat", "grapes", "olives"],
    hint: "Tomatoes, potatoes, maize and chocolate all came from the Americas. Wheat, grapes and olives were grown around the Mediterranean for thousands of years.",
    hard: true,
  },
  {
    prompt: "Why do Indigenous peoples' own histories matter when we study this period?",
    right: "They add perspectives, evidence and experiences that European records leave out",
    wrong: [
      "They don't matter",
      "Only European records can be trusted",
      "Indigenous peoples did not exist at that time",
    ],
    hint: "Different sources give a fuller picture, especially about the impact and the resistance of Indigenous peoples.",
    hard: true,
  },
  {
    prompt: "Ferdinand Magellan's expedition (1519–1522) is famous for completing the first voyage around the world. Who was in command when it returned to Spain?",
    right: "Juan Sebastián Elcano, because Magellan had died in the Philippines in 1521",
    wrong: ["Magellan himself", "Vasco da Gama", "Christopher Columbus"],
    hint: "Magellan died in battle in 1521. Elcano led the surviving ship home in 1522.",
    hard: true,
  },
];

function contactAndExchange(opts?: GenerateOptions): Question[] {
  const d = level(opts);
  const extras: Question[] = [timelineOrder(CONTACT_EVENTS, d), sortQuestion(EXCHANGE_SORT, perBin(d)), sourceQuestion(CONTACT_SOURCES)];
  return make(CONTACT_BANK, d, extras, 8);
}

// ---------- The course ----------

export const course: Course = {
  grade: "8",
  subject: "social",
  bigIdeas: {
    "ca-bc": [
      "Contacts and conflicts between peoples stimulated significant cultural, social, and political change.",
      "Increasing economic specialization and trade networks led to the growth of urban centres and the exchange of ideas and resources.",
      "Geographic conditions, climate and natural resources shaped the development of societies and their interactions.",
      "Religious and cultural practices that emerged during this period continue to influence people's lives.",
    ],
  },
  units: [
    {
      id: "think-like-a-historian",
      title: "Think Like a Historian",
      emoji: "🔎",
      blurb: "Sources, perspectives and evidence",
      parentNote:
        "Historical thinking skills: primary and secondary sources, perspective and bias, cause and consequence, continuity and change, historical significance, and working with timelines (centuries, CE and BCE).",
      standards: {
        "ca-bc": "Historical thinking: evidence, perspective, cause and consequence, continuity and change, significance; use of primary and secondary sources",
      },
      generate: historianToolkit,
    },
    {
      id: "geography-and-society",
      title: "Land, Sea & Society",
      emoji: "🗺️",
      blurb: "How geography shaped history",
      parentNote:
        "How rivers, deserts, mountains, seas and seasonal winds shaped where societies grew, how trade routes ran and how people adapted to their environments, from the steppe to the Andes.",
      standards: {
        "ca-bc": "Geographic conditions and their influence on the development of societies, trade and exchange between 600 and 1600 CE",
      },
      generate: geographyUnit,
    },
    {
      id: "byzantine-islamic",
      title: "Byzantine & Islamic Worlds",
      emoji: "🕌",
      blurb: "Libraries, science and empires",
      parentNote:
        "The Byzantine Empire and Constantinople, the origins and spread of Islam, and the Islamic Golden Age: scholarship, mathematics, medicine, optics, libraries and the preservation and development of knowledge.",
      standards: {
        "ca-bc": "Byzantine and Islamic civilizations; religious and cultural practices; scientific and mathematical achievements and their influence",
      },
      generate: byzantineIslamic,
    },
    {
      id: "medieval-europe",
      title: "Medieval Europe",
      emoji: "🏰",
      blurb: "Knights, towns and the Church",
      parentNote:
        "Feudalism and manors, the role of the Church, the growth of towns and guilds, Magna Carta, and the Black Death and its causes and consequences, covered factually and without graphic detail.",
      standards: {
        "ca-bc": "Social, political and economic structures of medieval Europe; the role of religion; the Black Death and its consequences",
      },
      generate: medievalEurope,
    },
    {
      id: "trade-networks",
      title: "Trade Networks",
      emoji: "🐪",
      blurb: "Silk, gold, salt and spices",
      parentNote:
        "The Silk Roads, Indian Ocean trade and trans-Saharan trade, the Mali Empire and Mansa Musa, famous travellers, and how trade spread goods, ideas and diseases.",
      standards: {
        "ca-bc": "Exchange of goods, ideas and technologies through trade networks; the growth of urban centres; Mali and Mansa Musa",
      },
      generate: tradeNetworks,
    },
    {
      id: "china-and-mongols",
      title: "China & the Mongols",
      emoji: "🐎",
      blurb: "Song, Yuan and Ming",
      parentNote:
        "Song China's inventions and civil service, the rise of the Mongol Empire under Genghis and Kublai Khan, the Yuan and Ming dynasties and Zheng He's voyages.",
      standards: {
        "ca-bc": "Chinese dynasties from the Song to the Ming; the Mongol Empire and its effects on Eurasia",
      },
      generate: chinaAndMongols,
    },
    {
      id: "renaissance-reformation",
      title: "Renaissance & Reformation",
      emoji: "🎨",
      blurb: "Art, print and new ideas",
      parentNote:
        "The Renaissance in Italy, humanism, art and science, the impact of the printing press, and a high-level look at the Protestant Reformation and its effects.",
      standards: {
        "ca-bc": "The Renaissance and its influence; the printing press; the Reformation and religious change in Europe",
      },
      generate: renaissanceAndReformation,
    },
    {
      id: "civilizations-of-the-americas",
      title: "Civilizations of the Americas",
      emoji: "🗿",
      blurb: "Maya, Mexica and Inca",
      parentNote:
        "Societies of the Americas before sustained contact with Europe: the Maya, the Mexica (Aztec) and the Inca, plus Cahokia. Written in the present tense where appropriate, since descendants of these peoples live today.",
      standards: {
        "ca-bc": "Indigenous civilizations of Mesoamerica and the Andes; social, political and economic structures; achievements and continuing cultures",
      },
      generate: americasBeforeContact,
    },
    {
      id: "contact-and-exchange",
      title: "Contact & Exchange",
      emoji: "⛵",
      blurb: "New routes, new meetings",
      parentNote:
        "European voyages of exploration, first contacts and their impacts on Indigenous peoples, the Columbian exchange of crops, animals and diseases, and how to read sources from more than one perspective.",
      standards: {
        "ca-bc": "European exploration and first contacts; the Columbian exchange; the impacts of contact on Indigenous peoples; multiple perspectives",
      },
      generate: contactAndExchange,
    },
  ],
};
