import type { SortSet } from "../../bank";
import type { Course, GenerateOptions, Question } from "../../types";
import { fromParts, orderOf, q, type Item } from "../kit";

// Grade 8 social studies: the world from about 600 to 1750 CE. Dates are given as
// "about" where historians differ, and societies are described as diverse, never as one block.

// ---------- Medieval Europe ----------

const MEDIEVAL: Item[] = [
  q(1, "What does “medieval” refer to?", "The Middle Ages in Europe, between ancient and modern times", ["Ancient Egypt", "The modern era", "Prehistoric times"], "The Middle Ages lasted from about 500 to 1500 CE."),
  q(1, "In the feudal system, who gave land to nobles in return for loyalty and military service?", "the king", ["the peasants", "the merchants", "the monks"], "Kings granted land (fiefs) to nobles, who promised support in return."),
  q(1, "What was a manor?", "A lord's estate, including a house, farmland and village", ["A type of castle only", "A royal army", "A market square"], "Most people lived on manors, where peasants worked the land for the lord."),
  q(1, "Who made up most of the population in medieval Europe?", "peasants", ["knights", "kings", "merchants"], "Most people were peasants who farmed the land."),
  q(1, "What was a serf?", "A peasant tied to the lord's land who owed him work and a share of the harvest", ["A kind of knight", "A merchant who travelled far", "A scholar in a university"], "Serfs could not leave the manor without the lord's permission."),
  q(2, "Why were castles built?", "To protect people and control the surrounding land", ["To store books", "To train sailors", "To hold fairs only"], "Castles gave lords a safe base with defences such as walls and moats."),
  q(2, "What was the main role of the Christian Church in medieval Europe?", "It guided religious life and also had great influence in politics, education and daily life.", ["It had little influence.", "It only built castles.", "It ruled only in Asia."], "The Church owned land, ran schools and hospitals, and advised rulers."),
  q(2, "What was a guild?", "A group of craftspeople or merchants who set standards and protected their trade", ["A type of noble title", "A religious ceremony", "A sort of castle"], "Guilds set prices and quality, and trained apprentices."),
  q(2, "What did the Magna Carta (1215) establish?", "That even the king must follow the law", ["That peasants own land", "That the king rules by himself", "That the Church can tax the king"], "English nobles forced King John to accept limits on royal power."),
  q(2, "How did the growth of towns change life in medieval Europe?", "People could earn money from trade and crafts instead of farming only.", ["People stopped trading.", "Everyone became a knight.", "Castles disappeared overnight."], "Towns grew with markets, guilds and new jobs."),
  q(2, "The Black Death arrived in Europe in the 1340s. What was one cause of its spread?", "Fleas on rats travelling along trade routes", ["Crop failure only", "A volcanic eruption", "Poor harvests only"], "The plague spread along trade routes, carried by fleas on rats and by people."),
  q(3, "What was one major effect of the Black Death?", "Labour became scarce, so surviving workers could demand better pay and freedoms.", ["Europe's population grew rapidly.", "Trade increased overnight.", "Feudalism became stronger."], "With many people dead, workers were in demand, weakening the feudal system."),
  q(3, "The Crusades (starting in 1096) were…", "a series of religious wars over control of the holy land", ["trade agreements", "peaceful pilgrimages only", "wars over castles in France"], "They also increased contact and trade between Europe and the Islamic world."),
  q(3, "Why did the Black Death spread so quickly across Europe?", "Trade routes, crowded towns and a lack of medical knowledge helped it travel.", ["People travelled very little.", "The weather was too cold for it.", "Doctors knew how to stop it."], "People did not know germs caused disease, so sick travellers and fleas moved freely."),
];

const FEUDAL_ORDER = orderOf(
  "Put the feudal pyramid in order, from the most powerful to the least.",
  "In the feudal system the king was at the top, followed by nobles, then knights, then peasants who worked the land.",
  [
    { id: "king", label: "King", emoji: "👑" },
    { id: "nobles", label: "Nobles (lords)", emoji: "🏰" },
    { id: "knights", label: "Knights", emoji: "🛡️" },
    { id: "peasants", label: "Peasants and serfs", emoji: "🌾" },
  ],
);

// ---------- The Islamic World ----------

const ISLAMIC: Item[] = [
  q(1, "Islam began in the 600s CE in which region?", "the Arabian Peninsula", ["Northern Europe", "East Asia", "North America"], "The Prophet Muhammad lived in Makkah (Mecca) and Madinah in Arabia."),
  q(1, "What is the holy book of Islam?", "the Qur'an", ["the Torah", "the Vedas", "the Analects"], "Muslims believe the Qur'an was revealed to the Prophet Muhammad."),
  q(1, "What is a mosque?", "A place of worship for Muslims", ["A castle", "A marketplace", "A school for knights"], "Mosques are also gathering places for community life."),
  q(1, "Baghdad became the capital of the Abbasid caliphate in 762. It was a major centre of…", "learning and trade", ["farming only", "ocean exploration", "castle building"], "Baghdad grew into one of the largest and most important cities in the world."),
  q(2, "What was the House of Wisdom in Baghdad?", "A centre where scholars translated and studied books from many cultures", ["A royal palace", "A market", "A military school"], "Scholars from different backgrounds gathered, translated and added new ideas."),
  q(2, "Al-Khwarizmi's work in the 800s helped develop which subject?", "algebra", ["geology", "printing", "navigation by satellite"], "The word “algebra” comes from the Arabic “al-jabr” in the title of his book."),
  q(2, "The numerals 0 to 9 used today are often called…", "Hindu-Arabic numerals", ["Roman numerals", "Mayan glyphs", "Egyptian symbols"], "They began in India and were spread by Arabic-speaking scholars."),
  q(2, "Ibn Sina (Avicenna) wrote a medical text that was used for centuries. What was it called?", "The Canon of Medicine", ["The Book of Optics", "The Republic", "The Prince"], "It was studied in both the Islamic world and Europe for hundreds of years."),
  q(2, "Ibn al-Haytham (Alhazen) made important discoveries in…", "optics, the science of light and vision", ["chemistry of fire", "farming", "mining"], "He used experiments to show that we see because light enters the eye."),
  q(2, "Cordoba in Muslim Spain (al-Andalus) was known for…", "libraries, scholars and a mix of cultures", ["being an empty desert", "being a remote fishing village", "having no trade"], "Muslims, Christians and Jews lived and shared knowledge in al-Andalus for long periods."),
  q(3, "Why was the Islamic world well placed to spread ideas and goods?", "It sat at the crossroads of trade routes linking Asia, Africa and Europe.", ["It had no contact with other regions.", "It was surrounded by ice.", "It banned writing."], "Merchants and scholars on the Silk Road and sea routes carried goods and ideas."),
  q(3, "In 1453 the Ottoman Turks captured Constantinople. Why does this matter?", "It ended the Byzantine Empire and gave the Ottomans control of a key trading city.", ["It started the Black Death.", "It created the Magna Carta.", "It discovered the Americas."], "Constantinople was a capital and a gateway between Europe and Asia."),
  q(3, "The Ottoman Empire was known for…", "ruling many different peoples across three continents", ["only farming", "staying small", "isolating itself from trade"], "At its height it controlled parts of southeast Europe, western Asia and North Africa."),
];

// ---------- Trade & Empires ----------

const TRADE: Item[] = [
  q(1, "What did the Silk Road connect?", "China, Central Asia, the Middle East and Europe", ["Africa and Australia only", "North and South America", "Europe and Antarctica"], "Traders carried silk, spices and ideas along these routes."),
  q(1, "Which West African empire was famous for its gold?", "Mali", ["Rome", "Ming China", "Mexica (Aztec)"], "Mali's gold helped make its rulers among the wealthiest in the world."),
  q(1, "Mansa Musa is best known for…", "his pilgrimage to Makkah in 1324 with a huge caravan", ["conquering Rome", "inventing the compass", "founding Baghdad"], "He gave so much gold on the way that its price fell in some cities."),
  q(1, "Timbuktu was famous in the Mali and Songhai empires as a centre of…", "learning, with libraries and universities, and trade", ["castle building", "ship building", "tea farming"], "Scholars and traders from across Africa gathered there."),
  q(2, "What goods crossed the Sahara in caravans?", "Gold and salt, among other things", ["Computers and phones", "Tea from the Americas", "Potatoes from Europe"], "West Africa had gold; the Sahara had salt. Each wanted what the other had."),
  q(2, "Genghis Khan united the Mongol tribes in 1206. What empire did the Mongols build?", "The largest land empire in history, stretching across Asia", ["An island kingdom", "A small kingdom in Europe", "A sea empire"], "At its peak it reached from Korea to eastern Europe."),
  q(2, "What was the Pax Mongolica?", "A time of relative peace and safe trade across the Mongol Empire", ["A Mongol war", "A kind of ship", "A law code of Rome"], "Safe routes made it easier for traders and travellers like Marco Polo to cross Asia."),
  q(2, "Between 1405 and 1433, Zheng He led voyages of Ming China's treasure fleet to…", "Southeast Asia, India, the Arabian Peninsula and East Africa", ["North America", "Australia", "Greenland"], "The huge fleets traded and showed China's power in the Indian Ocean."),
  q(2, "In Japan, what was a shogun?", "A military ruler who held real power under the emperor", ["A Buddhist monk", "A farmer", "A merchant"], "From 1192, shoguns led Japan while the emperor was a figurehead for centuries."),
  q(2, "What was the role of a samurai in feudal Japan?", "A warrior who served a lord", ["A trader", "A priest", "A scholar only"], "Samurai were bound to their lords by loyalty, like European knights."),
  q(3, "How did trade help spread ideas as well as goods?", "Traders and travellers carried religions, technology and knowledge along their routes.", ["Trade had no effect on ideas.", "Only goods could travel.", "Ideas stayed in one place."], "Paper, gunpowder, numerals and religions all travelled with traders."),
  q(3, "Why did Mongol rule in some regions cause fear and suffering as well as trade?", "Conquest brought destruction of cities and many deaths in places that resisted.", ["The Mongols never fought.", "They built no roads.", "They banned all trade."], "The Mongol Empire grew through war and conquest, even though it later protected trade routes."),
  q(3, "Why did rulers want to control trade routes?", "Taxing trade brought wealth and power.", ["Trade routes cost nothing.", "Trade lowered their status.", "Routes were only used by armies."], "Tolls and taxes on merchants could make a ruler very rich."),
];

const TRADE_SORT: SortSet = {
  prompt: "Which region did each famous trade good or idea mainly come from?",
  hint: "Silk, paper and gunpowder came from China. Gold from the Sahel region of West Africa. Spices such as pepper came from South and Southeast Asia.",
  bins: [
    { id: "china", label: "China", emoji: "🏯" },
    { id: "wafrica", label: "West Africa", emoji: "🌍" },
    { id: "sasia", label: "South Asia", emoji: "🌶️" },
  ],
  items: [
    { label: "silk cloth", emoji: "🧵", bin: "china" },
    { label: "paper", emoji: "📄", bin: "china" },
    { label: "gunpowder", emoji: "🎆", bin: "china" },
    { label: "gold from the Mali empire", emoji: "🪙", bin: "wafrica" },
    { label: "kola nuts and ivory traded across the Sahara", emoji: "🌰", bin: "wafrica" },
    { label: "pepper", emoji: "🫚", bin: "sasia" },
    { label: "cotton cloth", emoji: "🧶", bin: "sasia" },
    { label: "numerals 0-9", emoji: "0️⃣", bin: "sasia" },
  ],
};

// ---------- Renaissance & Reformation ----------

const RENAISSANCE: Item[] = [
  q(1, "“Renaissance” means…", "rebirth", ["revolution", "war", "discovery"], "People were “reborn” into interest in art, learning and ideas from ancient Greece and Rome."),
  q(1, "Where did the Renaissance begin?", "Italy", ["England", "Japan", "Brazil"], "Wealthy Italian city-states such as Florence supported artists and scholars."),
  q(1, "Leonardo da Vinci was famous as…", "an artist, inventor and scientist", ["a king", "a sailor only", "a merchant only"], "He painted the Mona Lisa and filled notebooks with designs and studies."),
  q(1, "Which invention made books cheaper and helped spread new ideas quickly?", "the printing press", ["the compass", "the telescope", "the clock"], "Johannes Gutenberg's press (about 1450) allowed many copies to be printed."),
  q(2, "What is humanism?", "A way of thinking that focuses on human abilities, reason and education", ["A belief that only kings matter", "A form of farming", "A belief that learning is useless"], "Renaissance humanists studied literature, history and the arts."),
  q(2, "Why did Italian city-states such as Florence become centres of the Renaissance?", "Wealth from trade paid for art and learning.", ["They had no merchants.", "They were closed to ideas.", "They were ruled by Mongols."], "Rich families, like the Medici, supported artists and scholars."),
  q(2, "What did Martin Luther do in 1517?", "He published criticisms of Church practices, starting the Reformation.", ["He sailed to the Americas.", "He painted the Sistine Chapel.", "He invented the printing press."], "His Ninety-five Theses led to new Christian churches (Protestant)."),
  q(2, "How did the printing press help the Reformation spread?", "Pamphlets and Bibles could be printed in large numbers.", ["Nobody could read.", "Books were banned.", "Presses were rare."], "Luther's ideas reached thousands of people quickly."),
  q(2, "Who is credited with writing in 1543 that the Earth moves around the Sun?", "Nicolaus Copernicus", ["Aristotle", "Gutenberg", "Marco Polo"], "Copernicus challenged the long-held belief that the Sun circled the Earth."),
  q(3, "Galileo used a telescope to observe moons around Jupiter. Why was this important?", "It showed that not everything orbits the Earth.", ["It proved the Earth is flat.", "It ended the Black Death.", "It started the Crusades."], "The observations supported the Sun-centred model and showed the value of observation."),
  q(3, "The Scientific Revolution encouraged people to…", "test ideas with observation and experiments", ["accept traditions without question", "stop studying nature", "ban the printing press"], "Evidence, not just authority, became the basis of knowledge."),
  q(3, "Which was a lasting result of the Reformation?", "Christianity in Europe split into Catholic and Protestant churches.", ["Everyone joined the same church.", "The Church became wealthier.", "Printing was abandoned."], "Different churches formed, and religious disagreements shaped politics for centuries."),
];

const RENAISSANCE_ORDER = orderOf(
  "Put these events in order, earliest first.",
  "The Black Death (1347–1351) came first, then the printing press (about 1450), the Reformation (1517), and Galileo's telescope observations (1610).",
  [
    { id: "plague", label: "The Black Death reaches Europe (1347)", emoji: "🐀" },
    { id: "press", label: "Gutenberg's printing press (about 1450)", emoji: "📚" },
    { id: "luther", label: "Luther's Ninety-five Theses (1517)", emoji: "📜" },
    { id: "galileo", label: "Galileo observes Jupiter's moons (1610)", emoji: "🔭" },
  ],
);

// ---------- Exploration & Exchange ----------

const EXPLORATION: Item[] = [
  q(1, "Which tool helped sailors find direction at sea?", "the compass", ["the printing press", "the abacus", "the loom"], "A magnetized needle always points north, helping ships travel far from land."),
  q(1, "In 1492, Christopher Columbus, sailing for Spain, reached…", "islands in the Caribbean", ["Australia", "Antarctica", "Japan"], "Columbus was looking for a sea route to Asia and reached the Americas, where millions of people already lived."),
  q(1, "Which people had been living in the Americas for thousands of years before 1492?", "Indigenous peoples with many diverse nations", ["Only the Vikings", "Only Spanish settlers", "No one"], "Many Indigenous nations had their own languages, governments and ways of life."),
  q(1, "What were Europeans mostly hoping to find by sailing to Asia?", "Spices, silk and wealth through trade", ["Cold weather", "Computers", "New languages"], "Spices and silk were valuable, and Europeans wanted direct routes to them."),
  q(2, "What was the Columbian Exchange?", "The transfer of plants, animals, people and diseases between the Americas and the rest of the world", ["A trade deal between Spain and Rome", "A bank in Venice", "A map of the Atlantic"], "It began after 1492 and changed diets, farming and populations on both sides."),
  q(2, "Which food crop came from the Americas to the rest of the world?", "potato", ["wheat", "rice", "olives"], "Potatoes, maize (corn), tomatoes and cacao originated in the Americas."),
  q(2, "Which animal was brought to the Americas by Europeans?", "horse", ["llama", "turkey", "bison"], "Horses changed transport, hunting and warfare for many Indigenous nations."),
  q(2, "What was one of the worst effects of contact for Indigenous peoples in the Americas?", "Diseases like smallpox killed huge numbers of people.", ["Everyone became wealthy.", "Many new crops died.", "Trade with Europe stopped."], "Indigenous people had no previous exposure to these diseases, and many communities were devastated."),
  q(2, "Tenochtitlan, built on an island in a lake, was the capital of the…", "Mexica (Aztec) Empire", ["Inca Empire", "Mali Empire", "Ming dynasty"], "It was one of the largest cities in the world, with canals, markets and a great temple."),
  q(2, "The Inca Empire was centred in the Andes mountains and was known for…", "a huge road network and the quipu record-keeping system", ["the printing press", "ships that reached Europe", "castles with moats"], "The Inca built thousands of kilometres of roads and kept records using knotted cords."),
  q(2, "Spanish conquistadors such as Hernán Cortés (1519–1521) were able to defeat the Mexica partly because…", "they allied with other Indigenous nations and diseases weakened the Mexica", ["the Mexica had no army", "Cortés had thousands of ships", "the Mexica did not live in cities"], "Many Indigenous groups resented Mexica rule and joined Cortés, while smallpox swept the region."),
  q(3, "Why is it more accurate to say Columbus “reached” the Americas than “discovered” them?", "Millions of people already lived there.", ["No one lived there.", "Vikings had never visited.", "Columbus invented the continent."], "The land was already well known to its Indigenous peoples."),
  q(3, "Which was a consequence of the transatlantic slave trade that began in this era?", "Millions of Africans were forcibly taken to the Americas.", ["Africans freely moved to Europe.", "Gold fell in price.", "It ended in 1500."], "Enslaved people were taken to work on plantations. This caused enormous suffering."),
  q(3, "Why did European powers set up colonies in the Americas?", "To gain land, resources and wealth", ["To share their power equally", "To end all trade", "To study the weather"], "Colonies produced silver, sugar and other goods, increasing the power of European empires, often at great cost to Indigenous peoples."),
];

const EXPLORATION_SORT: SortSet = {
  prompt: "Where did each food or animal start out before 1492?",
  hint: "Potatoes, maize (corn), tomatoes and cacao were first grown in the Americas. Wheat, rice, grapes and sheep came from Europe, Asia and Africa and were brought to the Americas by Europeans.",
  bins: [
    { id: "americas", label: "Americas", emoji: "🌎" },
    { id: "oldworld", label: "Europe, Asia and Africa", emoji: "🌍" },
  ],
  items: [
    { label: "potatoes", emoji: "🥔", bin: "americas" },
    { label: "maize (corn)", emoji: "🌽", bin: "americas" },
    { label: "tomatoes", emoji: "🍅", bin: "americas" },
    { label: "cacao (chocolate)", emoji: "🍫", bin: "americas" },
    { label: "wheat", emoji: "🌾", bin: "oldworld" },
    { label: "rice", emoji: "🍚", bin: "oldworld" },
    { label: "sheep", emoji: "🐑", bin: "oldworld" },
    { label: "grapes", emoji: "🍇", bin: "oldworld" },
  ],
};

const unit = (items: Item[], sorts?: SortSet[], orders?: Parameters<typeof fromParts>[0]["orders"]) => (opts?: GenerateOptions): Question[] =>
  fromParts({ items, sorts, orders }, opts);

// ---------- Course ----------

export const course: Course = {
  grade: "8",
  subject: "social",
  bigIdeas: {
    "ca-bc": [
      "Human and environmental factors shape the emergence of civilizations and empires.",
      "The exchange of ideas, goods and people between societies leads to cultural change, and often to conflict.",
      "Changing ideas about knowledge, religion and government shaped societies from the Middle Ages onward.",
      "Contact between peoples has consequences that differ for different groups.",
    ],
  },
  units: [
    {
      id: "medieval-europe",
      title: "Medieval Europe",
      emoji: "🏰",
      blurb: "Feudalism, towns and the Black Death",
      standards: { "ca-bc": "Social, economic and political structures of medieval Europe: feudalism, the Church, towns and the Black Death" },
      parentNote:
        "How medieval Europe was organized (kings, nobles, knights and peasants), the role of the Church and guilds, the Magna Carta, the Black Death, and how change came to the feudal system.",
      generate: unit(MEDIEVAL, undefined, [FEUDAL_ORDER]),
    },
    {
      id: "islamic-world",
      title: "The Islamic World",
      emoji: "🕌",
      blurb: "Scholars, cities and empires",
      standards: { "ca-bc": "The rise of Islam and the Islamic world: learning, trade, cultural exchange and the Ottoman Empire" },
      parentNote:
        "The early Islamic world and its cities, scholars and discoveries (such as algebra and optics), the exchange of knowledge through trade and translation, and the Ottoman Empire.",
      generate: unit(ISLAMIC),
    },
    {
      id: "trade-and-empires",
      title: "Trade & Empires",
      emoji: "🐫",
      blurb: "Mali, the Mongols and Ming China",
      standards: { "ca-bc": "Interactions among societies: Silk Road, trans-Saharan trade, Mali, Mongol Empire, Ming China and Japan" },
      parentNote:
        "Trade routes across Asia and Africa, the wealth of Mali and Timbuktu, the Mongol Empire, Zheng He's voyages, and how trade carried goods and ideas, and sometimes conflict.",
      generate: unit(TRADE, [TRADE_SORT]),
    },
    {
      id: "renaissance-and-reformation",
      title: "Renaissance & Reformation",
      emoji: "🎨",
      blurb: "New art, ideas and printing",
      standards: { "ca-bc": "The Renaissance, printing press, Reformation and the beginning of the Scientific Revolution" },
      parentNote:
        "The rebirth of art and learning in Italy, how the printing press spread ideas, the Reformation, and how questioning led to new science.",
      generate: unit(RENAISSANCE, undefined, [RENAISSANCE_ORDER]),
    },
    {
      id: "exploration-and-exchange",
      title: "Exploration & Exchange",
      emoji: "⛵",
      blurb: "Voyages, the Americas and the Columbian Exchange",
      standards: { "ca-bc": "European exploration and colonization, the Columbian Exchange and effects on Indigenous peoples; Mexica and Inca empires" },
      parentNote:
        "Why Europeans sailed across oceans, what the Mexica and Inca empires were like, the Columbian Exchange of foods, animals and diseases, and the serious consequences for Indigenous peoples and for enslaved Africans.",
      generate: unit(EXPLORATION, [EXPLORATION_SORT]),
    },
  ],
};
