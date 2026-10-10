import type { SortSet } from "../bank";
import { shuffle } from "../random";
import type { OrderQuestion, Question, Unit } from "../types";
import { levelled, withSort, type Item, type Level } from "../ontario/g56-bank";
import { order } from "../ontario/g3-4-kit";
import { ab } from "./kit";

// Alberta Grade 5 social studies (2022 curriculum): Ancient civilizations. Every unit is written for Alberta;
// none are shared with BC or Ontario. Ancient Egypt, Mesopotamia, the Indus Valley, China, Greece and Rome are
// used alongside the Maya, Aztec (Mexica) and Inca of the Americas and Kush in Africa. The peoples of the
// Americas are described as living peoples, and no ceremonial or sacred detail is included. Dates are the
// ones commonly given in school resources, so they are rounded ("about").

const withOrder = (bank: Item[], o: OrderQuestion, d: Level): Question[] => shuffle([...levelled(bank, 7, d), o]);

// ---------- Where and when ----------

const WHERE: Item[] = [
  { prompt: "Ancient Egyptian civilization grew up along which river?", right: "the Nile", wrong: ["the Tigris", "the Indus", "the Yellow River"], hint: "The Nile flows north through Egypt, in northeastern Africa.", emoji: "🏺" },
  { prompt: "Sumer, one of the first civilizations, was in Mesopotamia. What does Mesopotamia mean?", right: "the land between the rivers", wrong: ["the land of the sun", "the great sea", "the mountain kingdom"], hint: "Mesopotamia lay between the Tigris and Euphrates rivers.", emoji: "🌾" },
  { prompt: "Which two rivers framed Mesopotamia?", right: "the Tigris and the Euphrates", wrong: ["the Nile and the Congo", "the Indus and the Ganges", "the Rhine and the Danube"], hint: "Mesopotamia's rivers are in Southwest Asia, in what is now mostly Iraq." },
  { prompt: "The Indus Valley civilization is in what is now mostly…", right: "Pakistan and northwestern India", wrong: ["Egypt and Libya", "Greece and Italy", "Peru and Chile"], hint: "The Indus River flows through South Asia.", emoji: "🏙️" },
  { prompt: "Ancient Chinese civilization began in the valley of which river?", right: "the Yellow River (Huang He)", wrong: ["the Nile", "the Amazon", "the Danube"], hint: "The Yellow River is in East Asia and brings rich yellow soil.", emoji: "🐉" },
  { prompt: "Ancient Greece and ancient Rome were both located mainly around which sea?", right: "the Mediterranean Sea", wrong: ["the Arctic Ocean", "the Caribbean Sea", "the Black Sea only"], hint: "Greece and Italy are on the Mediterranean, in southern Europe." },
  { prompt: "On which continent was ancient Egypt?", right: "Africa", wrong: ["Europe", "South America", "Antarctica"], hint: "Egypt is in the northeast corner of Africa." },
  { prompt: "The Maya built cities in a region called Mesoamerica. Where is it?", right: "southern Mexico and Central America", wrong: ["northern Canada", "the Mediterranean coast", "western China"], hint: "Mesoamerica includes parts of Mexico, Guatemala, Belize and Honduras.", emoji: "🌴" },
  { prompt: "The Inca Empire stretched along which mountains?", right: "the Andes", wrong: ["the Rockies", "the Alps", "the Himalayas"], hint: "The Andes run along the west coast of South America.", emoji: "⛰️" },
  { prompt: "The Aztec (Mexica) capital Tenochtitlan was built on an island in…", right: "a lake in central Mexico", wrong: ["the Atlantic Ocean", "the Nile delta", "a desert in Africa"], hint: "Tenochtitlan was in Lake Texcoco. Mexico City now stands on the same place.", emoji: "🏝️" },
  { prompt: "The Kingdom of Kush was south of Egypt along the Nile. Which present-day country was it mostly in?", right: "Sudan", wrong: ["Greece", "Mexico", "India"], hint: "Kush was in Nubia, in what is now northern Sudan." },
  { prompt: "Which period of time does 'BCE' stand for?", right: "before the common era", wrong: ["before Canadian education", "big city empires", "before Caesar's empire"], hint: "BCE years count down to year 1. Larger BCE numbers are older." },
  { prompt: "Which date is earliest?", right: "3000 BCE", wrong: ["500 BCE", "1 CE", "500 CE"], hint: "For BCE dates, a bigger number means longer ago." },
  { prompt: "A historian says an event happened 'about 2500 BCE'. Roughly how many years ago is that, from 2025?", right: "about 4500 years", wrong: ["about 500 years", "about 1500 years", "about 2500 years"], hint: "Add 2500 and 2025 (there is no year 0).", hard: true },
  { prompt: "The Maya, Aztec and Inca peoples are not only in the past. Which statement is true?", right: "Descendants of these peoples live and speak their languages today", wrong: ["All of these peoples have disappeared", "They only exist in museums", "They lived only in Europe"], hint: "Maya peoples live today in Guatemala, Mexico and nearby countries, and Quechua is spoken in the Andes.", hard: true },
  { prompt: "Which two civilizations were both on the Nile?", right: "Egypt and Kush", wrong: ["Sumer and Rome", "Greece and Inca", "Maya and Aztec"], hint: "Egypt and Kush were neighbours along the same river.", hard: true },
];

const WHEN_ORDER: OrderQuestion = order("Put these events in order from earliest to latest.", "BCE years count down toward year 1. Then CE years count up.", [
  ["First cities of Sumer (about 3500 BCE)", "🏙️"],
  ["Great Pyramid built at Giza (about 2560 BCE)", "🔺"],
  ["Qin unites China (221 BCE)", "🐉"],
  ["Western Roman Empire ends (476 CE)", "🏛️"],
  ["Spain conquers the Inca Empire (from 1532 CE)", "⛰️"],
]);

// ---------- Rise and fall ----------

const RISE: Item[] = [
  { prompt: "Why did many early civilizations begin near rivers?", right: "Rivers gave water and rich soil for farming", wrong: ["Rivers were frozen all year", "Rivers keep armies away", "Rivers had no fish"], hint: "Good farmland meant a food surplus, which let cities grow.", emoji: "🌊" },
  { prompt: "A food surplus helped civilizations grow because…", right: "some people could do other jobs, like making tools or building", wrong: ["everyone had to farm", "nobody needed to eat", "cities had to be small"], hint: "A surplus is extra food. It frees people for other work." },
  { prompt: "Which of these is a sign of a civilization?", right: "cities, a system of government and writing", wrong: ["only tents", "no leaders", "no tools"], hint: "Civilizations usually have cities, governments, jobs for different people, and writing." },
  { prompt: "Which would help an empire grow?", right: "a strong army and good roads", wrong: ["no leaders", "poor harvests", "closing all borders"], hint: "Armies and roads helped empires control more land." },
  { prompt: "Rome grew from a city into an empire. What helped it stay connected?", right: "a network of roads", wrong: ["email", "airplanes", "railways"], hint: "Roman roads moved soldiers, messages and goods.", emoji: "🛣️" },
  { prompt: "Which is a reason that a civilization might decline?", right: "invasions from outside groups", wrong: ["a large food surplus", "good leaders", "peaceful trade"], hint: "Invasions, drought, disease and fighting inside can weaken a civilization." },
  { prompt: "A long drought dried up fields in a city-state. How could it hurt that civilization?", right: "Less food could mean hunger and people leaving", wrong: ["It would make more crops grow", "It would end all trade", "It would flood the city"], hint: "Without enough water for crops, people struggle to eat." },
  { prompt: "What happens when a ruler spends too much money on wars?", right: "There may be less money for food, roads and defence", wrong: ["Taxes always disappear", "The empire always grows", "Everyone becomes rich"], hint: "Heavy costs can weaken an empire from inside." },
  { prompt: "The Maya cities of the southern lowlands were left by many people around 800 to 900 CE. What may have contributed?", right: "drought, war and the strain on farmland", wrong: ["a single flood", "a volcanic winter in Europe", "the loss of all knowledge of writing"], hint: "Historians think several causes worked together, and Maya peoples did not disappear.", emoji: "🌿" },
  { prompt: "Did the Maya people disappear when their cities were left?", right: "No, millions of Maya people live today", wrong: ["Yes, they all vanished", "Yes, they moved to Egypt", "They never existed"], hint: "Maya peoples continue to live in Guatemala, Mexico and neighbouring countries." },
  { prompt: "In which way might a civilization 'fall'?", right: "It could be conquered, break apart, or slowly lose power", wrong: ["It could only fall from a cliff", "It could only be flooded", "It could only be forgotten in a single day"], hint: "Civilizations change in many ways. Falls usually happen slowly, with several causes." },
  { prompt: "The western Roman Empire is often said to have ended in 476 CE. Which is a cause historians point to?", right: "invasions, civil wars and a weakened economy", wrong: ["too many farmers", "a long peace", "no roads"], hint: "Many causes together, not just one, are given.", hard: true },
  { prompt: "Which pair of causes might help a civilization rise?", right: "fertile land and a strong leader", wrong: ["invasion and drought", "disease and hunger", "poor roads and fear"], hint: "Rising civilizations used good land and organized leadership.", hard: true },
  { prompt: "A historian says an empire fell because it grew too large to defend. What is this describing?", right: "an over-stretched border", wrong: ["a food surplus", "a good harvest", "a new trade route"], hint: "A large empire needs many soldiers to guard its edges.", hard: true },
  { prompt: "Many empires conquered other peoples. How might conquered peoples feel?", right: "Some may resist while others adapt", wrong: ["All always cheer", "None have any opinion", "All forget their language right away"], hint: "People can have different perspectives about the same events.", hard: true },
];

const RISE_SORT: SortSet = {
  prompt: "Did it help a civilization rise or lead to its decline? Tap an item, then tap its basket.",
  hint: "Fertile land, trade and strong leaders helped civilizations grow. War, drought and unfair rule can weaken them.",
  bins: [
    { id: "rise", label: "Helped it rise", emoji: "📈" },
    { id: "fall", label: "Helped it decline", emoji: "📉" },
  ],
  items: [
    { label: "a river that floods fields each year", emoji: "🌊", bin: "rise" },
    { label: "a food surplus", emoji: "🌾", bin: "rise" },
    { label: "new trade routes", emoji: "🐫", bin: "rise" },
    { label: "a strong, organized army", emoji: "🛡️", bin: "rise" },
    { label: "years without rain", emoji: "🏜️", bin: "fall" },
    { label: "invasion from outside", emoji: "⚔️", bin: "fall" },
    { label: "fighting among leaders", emoji: "👑", bin: "fall" },
    { label: "farmland worn out by overuse", emoji: "🥀", bin: "fall" },
  ],
};

// ---------- Environment ----------

const ENV: Item[] = [
  { prompt: "Every year the Nile flooded and left rich soil. What did Egyptians do with this land?", right: "They grew crops like wheat and barley", wrong: ["They left it empty", "They built boats on it", "They covered it in ice"], hint: "The flood left fertile mud, which was good for farming.", emoji: "🌾" },
  { prompt: "Why did ancient Egyptians live close to the Nile?", right: "Most of Egypt was desert, and the river gave water", wrong: ["The desert was full of lakes", "They liked cold weather", "Boats were not allowed"], hint: "Most of the land around the Nile is dry desert.", emoji: "🏜️" },
  { prompt: "What did Egyptians use papyrus reeds from the Nile for?", right: "making paper, boats and baskets", wrong: ["making metal swords", "building stone castles", "making glass"], hint: "Papyrus grew along the river banks.", emoji: "📜" },
  { prompt: "In Mesopotamia, farmers dug canals. Why?", right: "To bring river water to dry fields (irrigation)", wrong: ["To catch all the fish", "To keep out the sun", "To make hills"], hint: "Irrigation moves water from a river to the crops." },
  { prompt: "Mesopotamia had few trees and little stone. What did people build with?", right: "mud bricks", wrong: ["steel", "wood only", "ice blocks"], hint: "Clay was everywhere along the rivers, so bricks of clay and mud were used." },
  { prompt: "Why were the Greek city-states often separate from each other?", right: "Mountains and sea divided the land", wrong: ["They had no rivers", "They were on one flat desert", "They all spoke different time zones"], hint: "Greece is mountainous with many islands.", emoji: "⛰️" },
  { prompt: "Greek land had little good farmland. What did many Greeks do?", right: "They sailed and traded across the sea", wrong: ["They moved to the Arctic", "They stopped eating", "They never used ships"], hint: "A long coastline made sea travel and trade easy." },
  { prompt: "The Inca lived in the steep Andes mountains. What did they build to farm the slopes?", right: "terraces, like steps in the hillside", wrong: ["skyscrapers", "snowmobiles", "lakes on top of mountains"], hint: "Terraces make flat land for crops and hold soil and water.", emoji: "🏔️" },
  { prompt: "People in the Andes dried potatoes in the cold, thin air so they would last. What does this show?", right: "They used the environment to solve a problem", wrong: ["They ignored the weather", "Potatoes don't grow there", "They had refrigerators"], hint: "Cold nights and sunny days helped preserve the food (chuño)." },
  { prompt: "The Mexica (Aztecs) farmed on chinampas. What were they?", right: "small, rich garden plots built in shallow lake water", wrong: ["high mountain farms", "desert wells", "ice fields"], hint: "Chinampas let them grow crops all year in the lake.", emoji: "🪴" },
  { prompt: "In the rainforest, the Maya farmed maize (corn), beans and squash. Why were these good together?", right: "They could be grown in the same fields and make a balanced diet", wrong: ["They only grow in snow", "They are all fruits", "They need no soil"], hint: "These crops are sometimes called the 'three sisters' and are still grown by many peoples." },
  { prompt: "The Indus Valley cities, like Mohenjo-daro, had covered drains. What does this show?", right: "People planned for clean water and waste", wrong: ["They had no water", "They had no rain", "They lived in tents"], hint: "Cities needed drains to stay healthy.", hard: true },
  { prompt: "What is one way the environment can limit a civilization?", right: "A drought can ruin crops", wrong: ["A good harvest lasts forever", "A river makes crops larger", "Soil never wears out"], hint: "Weather and natural disasters can create problems.", hard: true },
  { prompt: "Egypt's Nile flows north. Which direction did boats sail to go with the current?", right: "north", wrong: ["south", "up the mountains", "west"], hint: "Boats floated downstream, and the winds helped them sail upstream.", hard: true },
  { prompt: "A volcano erupts near a city and covers fields in ash. What might be a long-term effect?", right: "The ash can make soil richer, but crops are lost at first", wrong: ["Soil always dies forever", "Rain stops everywhere", "Nothing changes"], hint: "Environmental events can have good and bad effects.", hard: true },
];

const ENV_SORT: SortSet = {
  prompt: "Which place did people use this way of living in? Tap an item, then tap its basket.",
  hint: "The Nile Valley had a flooding river and desert. The Andes had steep mountains and cold air.",
  bins: [
    { id: "nile", label: "Nile Valley (Egypt)", emoji: "🏺" },
    { id: "andes", label: "Andes (Inca)", emoji: "⛰️" },
  ],
  items: [
    { label: "farming after the yearly flood", emoji: "🌾", bin: "nile" },
    { label: "papyrus reeds for paper", emoji: "📜", bin: "nile" },
    { label: "boats carrying stone down the river", emoji: "⛵", bin: "nile" },
    { label: "a shaduf to lift river water", emoji: "💧", bin: "nile" },
    { label: "terraces on steep slopes", emoji: "🏔️", bin: "andes" },
    { label: "llamas carrying loads", emoji: "🦙", bin: "andes" },
    { label: "potatoes dried in cold air", emoji: "🥔", bin: "andes" },
    { label: "rope bridges across canyons", emoji: "🌉", bin: "andes" },
  ],
};

// ---------- Trade and taxes ----------

const TRADE: Item[] = [
  { prompt: "What is trade?", right: "exchanging goods or services", wrong: ["keeping everything for yourself", "taking things by force only", "making a map"], hint: "People trade when they swap things or buy and sell.", emoji: "🔄" },
  { prompt: "What is barter?", right: "trading goods for other goods without money", wrong: ["paying with coins", "paying a tax", "stealing"], hint: "Barter means swapping one good for another, such as grain for pottery." },
  { prompt: "Why did ancient people trade?", right: "to get goods their own land did not have", wrong: ["because they had too much of everything", "to avoid meeting others", "because they did not need anything"], hint: "Wood, metal, spices and stone were not in every place.", emoji: "⚖️" },
  { prompt: "The Silk Roads were…", right: "networks of trade routes linking East Asia, Central Asia and Europe", wrong: ["a single paved highway", "roads made of silk", "a river in China"], hint: "Many routes crossed deserts and mountains. Traders carried silk, spices and ideas.", emoji: "🐫" },
  { prompt: "What is a tax?", right: "money or goods people give to their government", wrong: ["a gift to a neighbour", "a trade between merchants", "a type of coin"], hint: "A tax pays for what a government does." },
  { prompt: "Egyptian farmers paid taxes with…", right: "a share of their grain", wrong: ["airplanes", "diamonds only", "electricity"], hint: "Most people did not use coins, so taxes were usually paid in goods.", emoji: "🌾" },
  { prompt: "The Inca system called mit'a asked people to…", right: "work for the state for a set time, as a kind of tax", wrong: ["pay in gold coins", "give up their language", "buy their land"], hint: "People worked on roads, farms and buildings for the empire instead of paying with money.", emoji: "🛣️" },
  { prompt: "Why did governments collect taxes?", right: "to pay for things like armies, roads and storehouses", wrong: ["to buy video games", "to give gifts to every citizen", "to avoid building anything"], hint: "Taxes funded public projects and officials." },
  { prompt: "Which ancient group is known for early coins?", right: "Lydia (in today's Turkey), about 600 BCE", wrong: ["Canada, about 1900", "Inuit, about 700 CE", "the Maya, about 4000 BCE"], hint: "Coins made trade easier than barter. Many places used coins later.", emoji: "🪙" },
  { prompt: "Which of these was sold along the Silk Roads?", right: "silk cloth", wrong: ["tablet computers", "snowmobiles", "plastic toys"], hint: "China made silk, and traders carried it to other lands." },
  { prompt: "The Mexica (Aztec) Empire collected tribute from the cities it ruled. What is tribute?", right: "payments of goods, like cloth and cacao, to a stronger ruler", wrong: ["a prize for winning a race", "a type of trade in a market", "a map of roads"], hint: "Tribute is like a required tax from conquered or allied cities.", emoji: "🍫" },
  { prompt: "Why was a market useful in a city?", right: "People could buy and sell many goods in one place", wrong: ["People could vote there only", "It was used to store weapons", "It was a school"], hint: "Markets bring buyers and sellers together." },
  { prompt: "How did trade networks spread ideas as well as goods?", right: "Traders carried languages, religions and inventions with them", wrong: ["Traders could not speak", "Ideas stayed in one town", "Trade stopped all learning"], hint: "Paper from China and numerals from India travelled along trade routes.", hard: true },
  { prompt: "Rome's roads were built to move armies. How did they also help trade?", right: "Merchants could carry goods across the empire", wrong: ["They stopped all travel", "Only soldiers could use them", "They ended trade"], hint: "A good road helps anyone who is travelling.", hard: true },
  { prompt: "Which was a disadvantage of paying taxes in goods like grain?", right: "The grain had to be stored and could spoil", wrong: ["It could never be used", "It weighed nothing", "It was easier than coins"], hint: "Goods need storehouses and guards.", hard: true },
  { prompt: "Why might a very high tax make people unhappy?", right: "They keep less of what they grew or earned", wrong: ["They keep more", "They become richer", "Nothing changes"], hint: "Unfair or heavy taxes can lead to protests and unrest.", hard: true },
];

const TRADE_SORT: SortSet = {
  prompt: "Is it trade or a tax? Tap an item, then tap its basket.",
  hint: "Trade is an exchange both sides choose. A tax is something people must give to the government.",
  bins: [
    { id: "trade", label: "Trade", emoji: "🔄" },
    { id: "tax", label: "Tax or tribute", emoji: "🏛️" },
  ],
  items: [
    { label: "swapping grain for pottery", emoji: "🏺", bin: "trade" },
    { label: "a merchant selling spices", emoji: "🌶️", bin: "trade" },
    { label: "silk traded for horses", emoji: "🐎", bin: "trade" },
    { label: "buying a lamp at the market", emoji: "🪔", bin: "trade" },
    { label: "giving part of the harvest to the pharaoh's officials", emoji: "🌾", bin: "tax" },
    { label: "working on the state's roads (mit'a)", emoji: "🛣️", bin: "tax" },
    { label: "cloth sent to the Aztec capital as tribute", emoji: "🧵", bin: "tax" },
    { label: "silver paid to a Roman official", emoji: "💰", bin: "tax" },
  ],
};

// ---------- Governments and social systems ----------

const GOV: Item[] = [
  { prompt: "What is an authoritarian government?", right: "one where a ruler or small group holds most of the power", wrong: ["one where every person votes on every law", "one with no leaders", "one run only by children"], hint: "Authoritarian means a few people hold the power and others have little say." },
  { prompt: "Who ruled ancient Egypt?", right: "a pharaoh", wrong: ["a mayor", "a prime minister", "a school board"], hint: "A pharaoh was a king or queen who held great power.", emoji: "👑" },
  { prompt: "Egyptians believed the pharaoh was…", right: "both a ruler and a god-king", wrong: ["only a farmer", "a foreign visitor", "chosen by a vote of all"], hint: "This belief gave the pharaoh great authority." },
  { prompt: "What is a social system?", right: "the way a society is divided into groups with different roles", wrong: ["a way to read a map", "a type of farm tool", "a kind of boat"], hint: "Social systems show who has more or less power, wealth and freedom." },
  { prompt: "In many ancient societies, who were scribes?", right: "people who could read and write records", wrong: ["farmers in the fields", "enslaved workers only", "soldiers on the border"], hint: "Few people could read, so scribes held an important job.", emoji: "✍️" },
  { prompt: "In many ancient societies, who worked on farms and paid most of the taxes?", right: "peasants or farmers", wrong: ["pharaohs", "priests", "kings"], hint: "Most people were farmers who grew the food." },
  { prompt: "Enslaved people in ancient societies were…", right: "forced to work and had no freedom", wrong: ["paid fair wages", "free to leave", "the rulers"], hint: "Slavery existed in many ancient societies and was unfair.", emoji: "⛓️" },
  { prompt: "Athens had an early form of democracy. Who could vote in its assembly?", right: "free adult male citizens", wrong: ["all adults", "everyone including enslaved people", "all children"], hint: "Women, enslaved people and foreigners could not vote." },
  { prompt: "How was Athens different from Egypt under a pharaoh?", right: "Citizens voted on laws instead of one ruler deciding", wrong: ["There were no laws", "Athens had a pharaoh too", "Athens had no cities"], hint: "Democracy means citizens take part in decisions, though in Athens only some people were citizens." },
  { prompt: "King Hammurabi of Babylon wrote down laws on a stone pillar. Why is this useful?", right: "People could see the rules and what the punishments were", wrong: ["It meant there were no rules", "It let slaves rule", "It made laws secret"], hint: "Written laws let everyone know what was expected.", emoji: "📜" },
  { prompt: "Who was at the top of the Inca Empire?", right: "the Sapa Inca (emperor)", wrong: ["a pharaoh", "a consul", "a mayor"], hint: "The emperor held the highest power in the Inca Empire." },
  { prompt: "In the Roman Republic, power was shared by…", right: "elected officials and the Senate", wrong: ["one pharaoh", "a single god", "all citizens equally"], hint: "Rome began as a republic. Later Augustus became the first emperor.", hard: true },
  { prompt: "Rome changed from a republic to an empire. What changed?", right: "One emperor held most of the power", wrong: ["Everyone voted on everything", "Rome had no leader", "Rome became a small village"], hint: "Augustus became the first emperor in 27 BCE.", hard: true },
  { prompt: "How might a ruler keep control over a large empire?", right: "with an army, officials and tax collectors", wrong: ["with a vote of all farmers", "by letting go of the land", "with no officials"], hint: "Authoritarian rulers often used soldiers and officials to enforce rules.", hard: true },
  { prompt: "Why might people living under an authoritarian ruler have little say?", right: "The ruler and elites make the decisions", wrong: ["Everyone votes weekly", "There are no rules", "People choose all laws"], hint: "Power rests with the few.", hard: true },
];

const GOV_SORT: SortSet = {
  prompt: "Who held a lot of power and who had little say? Tap an item, then tap its basket.",
  hint: "Rulers, high priests and generals had power. Farmers, enslaved people and many women had little say.",
  bins: [
    { id: "power", label: "Held a lot of power", emoji: "👑" },
    { id: "little", label: "Had little say", emoji: "🌾" },
  ],
  items: [
    { label: "a pharaoh of Egypt", emoji: "👑", bin: "power" },
    { label: "the Sapa Inca emperor", emoji: "🏔️", bin: "power" },
    { label: "a Roman emperor", emoji: "🏛️", bin: "power" },
    { label: "a high priest", emoji: "🛕", bin: "power" },
    { label: "an Egyptian farmer", emoji: "🌾", bin: "little" },
    { label: "an enslaved worker", emoji: "⛓️", bin: "little" },
    { label: "a peasant who owed tribute", emoji: "🧺", bin: "little" },
    { label: "a woman in ancient Athens", emoji: "🏺", bin: "little" },
  ],
};

// ---------- Legacies ----------

const LEGACY: Item[] = [
  { prompt: "What is a legacy?", right: "something handed down from the past that still matters", wrong: ["a type of food", "a broken tool", "a kind of boat"], hint: "A legacy can be an idea, a tool, a word or a custom." },
  { prompt: "Which of these ideas came from ancient Greece?", right: "democracy", wrong: ["paper", "the quipu", "zero in numbers"], hint: "Athens developed an early democracy.", emoji: "🗳️" },
  { prompt: "Which Greek tradition continues today?", right: "the Olympic Games", wrong: ["the Great Wall", "Silk Roads", "hieroglyphs"], hint: "The first Olympic Games were held in Greece, traditionally in 776 BCE.", emoji: "🏅" },
  { prompt: "Ancient Rome gave us…", right: "roads, aqueducts and Latin", wrong: ["paper and printing", "the pyramids", "terraced farms"], hint: "Latin is the root of many languages, like French and Spanish." },
  { prompt: "What did Roman aqueducts do?", right: "carry water to cities", wrong: ["carry soldiers", "carry mail only", "block rivers"], hint: "Aqueducts were channels that carried water over long distances.", emoji: "🏗️" },
  { prompt: "Which invention is linked to ancient China?", right: "paper", wrong: ["the wheel", "zero as a number", "the Olympic Games"], hint: "Paper was invented in China around 100 CE.", emoji: "📄" },
  { prompt: "Ancient Egypt gave the world early forms of…", right: "papyrus paper and a 365-day calendar", wrong: ["electricity", "cars", "the telegraph"], hint: "Egyptians made a calendar of 365 days based on the Nile and the stars." },
  { prompt: "Sumer in Mesopotamia developed one of the first writing systems. It was called…", right: "cuneiform", wrong: ["hieroglyphics", "Morse code", "Braille"], hint: "Cuneiform was written by pressing a reed into clay.", emoji: "🪨" },
  { prompt: "We divide an hour into 60 minutes. Which ancient people used a counting system based on 60?", right: "the Sumerians of Mesopotamia", wrong: ["the Inca", "the Greeks only", "the Romans"], hint: "The Sumerians counted in sixties, and the idea is still in our clocks." },
  { prompt: "The Inca built a network of roads through the Andes. What was it called?", right: "the Qhapaq Ñan", wrong: ["the Silk Road", "the Appian Way", "the Nile"], hint: "Parts of the Inca road system are still used today.", emoji: "🛣️" },
  { prompt: "Which legacy of the Maya is still used by some peoples today?", right: "calendar knowledge and the Mayan languages", wrong: ["Roman numerals", "the abacus", "the alphabet of Greek"], hint: "Many Maya people speak Mayan languages today.", emoji: "🌿" },
  { prompt: "Which ancient people used a concept of zero in their number system?", right: "the Maya", wrong: ["the Romans", "the Greeks only", "the Vikings"], hint: "The Maya used a symbol for zero in their counting.", hard: true },
  { prompt: "Which of these still uses a legacy of Rome?", right: "Many laws and many words in English and French", wrong: ["Only comic books", "Only bicycles", "Nothing at all"], hint: "Latin words and Roman legal ideas are still used.", hard: true },
  { prompt: "Which statement shows a legacy of ancient Greece in school today?", right: "Students learn math ideas like geometry that Greek thinkers wrote about", wrong: ["Students learn to read hieroglyphs only", "Students use mit'a labour", "Students weigh grain as tax"], hint: "Greek mathematicians such as Euclid wrote about geometry.", hard: true },
];

const LEGACY_SORT: SortSet = {
  prompt: "Which civilization is it from? Tap an item, then tap its basket.",
  hint: "Greece gave us democracy, the Olympics and theatre. Rome gave us aqueducts, roads and Latin.",
  bins: [
    { id: "greece", label: "Ancient Greece", emoji: "🏛️" },
    { id: "rome", label: "Ancient Rome", emoji: "🛣️" },
  ],
  items: [
    { label: "democracy in Athens", emoji: "🗳️", bin: "greece" },
    { label: "the first Olympic Games", emoji: "🏅", bin: "greece" },
    { label: "plays in a theatre", emoji: "🎭", bin: "greece" },
    { label: "geometry by Euclid", emoji: "📐", bin: "greece" },
    { label: "aqueducts", emoji: "🏗️", bin: "rome" },
    { label: "paved roads", emoji: "🛣️", bin: "rome" },
    { label: "Latin", emoji: "📜", bin: "rome" },
    { label: "the Colosseum", emoji: "🏟️", bin: "rome" },
  ],
};

// ---------- Informed citizenship ----------

const CITIZEN: Item[] = [
  { prompt: "How do archaeologists learn about ancient peoples?", right: "by studying objects and places they left behind", wrong: ["by asking them", "by guessing", "by watching videos from long ago"], hint: "Archaeologists dig up and study artifacts such as pots, tools and buildings.", emoji: "⛏️" },
  { prompt: "An artifact is…", right: "an object made or used by people in the past", wrong: ["a type of rock only", "a living animal", "a map"], hint: "Pots, coins and jewellery are artifacts." },
  { prompt: "What is a primary source?", right: "something made at the time, like a letter or a coin", wrong: ["a book written yesterday about the past", "a guess", "an advertisement"], hint: "Primary sources come from the time being studied." },
  { prompt: "What is a secondary source?", right: "something written later about the past, like a textbook", wrong: ["a clay tablet from long ago", "a coin from the time", "a tomb painting"], hint: "A secondary source explains events using other sources." },
  { prompt: "Why should you check more than one source?", right: "One source may be wrong, missing details or biased", wrong: ["Sources are always perfect", "It makes research shorter", "One source is always enough"], hint: "Comparing sources helps you find out what is true." },
  { prompt: "What does bias mean?", right: "leaning toward one side without being fair to others", wrong: ["being very tall", "a kind of map", "an old coin"], hint: "A biased source may leave out other points of view." },
  { prompt: "What is a perspective?", right: "a point of view on events", wrong: ["a kind of tool", "a date", "a river"], hint: "People may see the same event in different ways." },
  { prompt: "Which is a fact?", right: "Rome had an aqueduct that carried water to the city.", wrong: ["Rome was the best empire.", "Roman food was tasty.", "Everyone should love Rome."], hint: "A fact can be checked. An opinion says what someone thinks." },
  { prompt: "Which is an opinion?", right: "The Great Pyramid is the most beautiful building ever.", wrong: ["The Great Pyramid is in Egypt.", "The Great Pyramid is made of stone.", "The Great Pyramid was built for a pharaoh."], hint: "'Most beautiful' is a view, not something you can measure." },
  { prompt: "What is an informed citizen?", right: "someone who learns the facts and thinks carefully before acting", wrong: ["someone who never asks questions", "someone who believes everything online", "someone who avoids news"], hint: "Informed citizens use good sources and ask questions." },
  { prompt: "In Athens, citizens could speak at the assembly. What is one way citizens take part in Canada today?", right: "voting in elections", wrong: ["paying tribute to a pharaoh", "building a pyramid", "serving as a Roman senator"], hint: "In Canada, adult citizens can vote in municipal, provincial and federal elections.", emoji: "🗳️" },
  { prompt: "A museum label says a mask was made in 1200 CE. Why is it a good source?", right: "The museum has studied it and tells where it came from", wrong: ["It was made last week", "It has no label", "The label is not about the mask"], hint: "Good sources explain who made them and how we know." },
  { prompt: "A website says, 'Everyone knows Rome was perfect.' What should you do?", right: "Check other sources and look for evidence", wrong: ["Believe it", "Ignore all websites", "Copy it into your project"], hint: "'Everyone knows' is a clue that opinion may be mixed with fact.", hard: true },
  { prompt: "Two historians disagree about why an empire fell. What does this show?", right: "People can read the same evidence and reach different conclusions", wrong: ["One is always lying", "History is made up", "There was no empire"], hint: "Weighing the evidence is part of thinking like a historian.", hard: true },
  { prompt: "Why do citizens need to be informed before they vote?", right: "To choose based on facts about the issues and candidates", wrong: ["So they can vote faster", "So they can avoid people", "So they never change their mind"], hint: "Informed decisions are better for everyone.", hard: true },
];

const CITIZEN_SORT: SortSet = {
  prompt: "Is it a primary source or a secondary source? Tap an item, then tap its basket.",
  hint: "A primary source was made at the time, like a coin or letter from the past. A secondary source was made later to explain it.",
  bins: [
    { id: "primary", label: "Primary source", emoji: "🏺" },
    { id: "secondary", label: "Secondary source", emoji: "📖" },
  ],
  items: [
    { label: "a Roman coin", emoji: "🪙", bin: "primary" },
    { label: "a letter on papyrus", emoji: "📜", bin: "primary" },
    { label: "a carving on a temple wall", emoji: "🏛️", bin: "primary" },
    { label: "a clay pot dug up in Mesopotamia", emoji: "🏺", bin: "primary" },
    { label: "a textbook chapter about Egypt", emoji: "📘", bin: "secondary" },
    { label: "a museum website about the Maya", emoji: "💻", bin: "secondary" },
    { label: "a documentary about Rome", emoji: "🎬", bin: "secondary" },
    { label: "an encyclopedia entry on the Inca", emoji: "📚", bin: "secondary" },
  ],
};

export const units: Unit[] = [
  {
    id: "where-and-when-ab",
    title: "Where and When?",
    emoji: "🗺️",
    blurb: "Find ancient civilizations in place and time",
    standards: ab("the rise and fall of ancient civilizations", "locating civilizations on a map and placing them on a timeline, with BCE and CE dates"),
    parentNote: "Where early civilizations grew up (the Nile, Mesopotamia, the Indus Valley, China, the Mediterranean, the Americas) and how to read BCE and CE dates. The peoples of the Americas are shown as living peoples.",
    generate: ({ difficulty = 2 } = {}) => withOrder(WHERE, WHEN_ORDER, difficulty),
  },
  {
    id: "rise-and-fall-ab",
    title: "Rise and Fall",
    emoji: "📈",
    blurb: "Why civilizations grew and why they changed",
    standards: ab("the rise and fall of ancient civilizations", "what helped civilizations grow, and the many causes of decline"),
    parentNote: "Food surplus, rivers, trade and strong leaders helped civilizations rise. Drought, invasion, fighting inside and worn-out farmland could lead to decline, usually through several causes together.",
    generate: ({ difficulty = 2 } = {}) => withSort(RISE, RISE_SORT, difficulty),
  },
  {
    id: "environment-ab",
    title: "Land and Water",
    emoji: "🌊",
    blurb: "How the environment shaped ancient life",
    standards: ab("influence of the environment on ancient civilizations", "how rivers, mountains, deserts and seas shaped farming, building and trade"),
    parentNote: "How the Nile, the Tigris and Euphrates, the Andes, the Greek coast and the lakes of Mexico shaped farming, homes, tools and trade, and how droughts and floods created challenges.",
    generate: ({ difficulty = 2 } = {}) => withSort(ENV, ENV_SORT, difficulty),
  },
  {
    id: "trade-and-taxes-ab",
    title: "Trade and Taxes",
    emoji: "🪙",
    blurb: "Markets, barter, tribute and taxes",
    standards: ab("development of economic practices, including trade networks and taxes", "barter, coins, trade routes, tribute and taxes in ancient economies"),
    parentNote: "How people traded goods and ideas, the Silk Roads, barter and early coins, and how rulers collected taxes and tribute in grain, labour or goods.",
    generate: ({ difficulty = 2 } = {}) => withSort(TRADE, TRADE_SORT, difficulty),
  },
  {
    id: "governments-ab",
    title: "Rulers and Society",
    emoji: "👑",
    blurb: "Who held power in ancient societies",
    standards: ab("authoritarian governments and social systems", "pharaohs, emperors, social groups, laws and who had a say"),
    parentNote: "Authoritarian rule (pharaohs, emperors), how societies were organized into groups with different power, written law codes, and the contrast with Athenian democracy, which only some people could take part in.",
    generate: ({ difficulty = 2 } = {}) => withSort(GOV, GOV_SORT, difficulty),
  },
  {
    id: "legacies-ab",
    title: "Gifts from the Past",
    emoji: "🏛️",
    blurb: "Ideas and inventions we still use",
    standards: ab("legacies of ancient civilizations and empires", "writing, laws, roads, ideas and inventions that last until today"),
    parentNote: "What ancient Egypt, Mesopotamia, China, Greece, Rome, the Maya and the Inca left behind, such as writing, a 60-minute hour, paper, democracy, roads and languages.",
    generate: ({ difficulty = 2 } = {}) => withSort(LEGACY, LEGACY_SORT, difficulty),
  },
  {
    id: "informed-citizens-ab",
    title: "Be an Informed Citizen",
    emoji: "🔍",
    blurb: "Sources, evidence and good questions",
    standards: ab("informed citizenship", "primary and secondary sources, fact and opinion, bias, and taking part as a citizen"),
    parentNote: "How archaeologists and historians use evidence, telling primary from secondary sources, fact from opinion, spotting bias, and why informed citizens check facts before they vote or act.",
    generate: ({ difficulty = 2 } = {}) => withSort(CITIZEN, CITIZEN_SORT, difficulty),
  },
];
