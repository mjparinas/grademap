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
  q(1, "In the feudal system, what did a vassal promise a lord?", "Loyalty and military service", ["Free grain forever", "A new castle every year", "Silk and spices"], "A vassal received land (a fief) and promised to support the lord who gave it."),
  q(1, "What was a fief?", "Land that a lord gave to a vassal in return for loyalty", ["A type of armour", "A church tax", "A merchant's cart"], "Fiefs were the payment in the feudal system. Land was the main source of wealth."),
  q(1, "Which language was used by the Church and scholars across much of western Europe?", "Latin", ["Mandarin", "Old Norse only", "Arabic only"], "Latin was used for church services, law and learning, even though people spoke local languages every day."),
  q(1, "What was a monastery?", "A community where monks lived, prayed and often copied books by hand", ["A royal court", "A merchant fair", "A castle moat"], "Monasteries were centres of learning, farming and care for the poor and sick."),
  q(1, "Which feature helped defend a medieval castle?", "Thick stone walls, towers and a moat", ["Large glass windows", "Open fields with no walls", "A wide, unguarded gate"], "Castles were built to be hard to attack."),
  q(2, "Why were monasteries important for learning?", "Monks copied and kept books, and some ran schools.", ["Monks burned all books.", "They banned reading.", "They were only farms."], "Before the printing press, books were copied by hand, often in monasteries."),
  q(2, "What was the tithe?", "A tax, about one tenth of a person's income or crops, paid to the Church", ["A tax paid only by nobles to the king", "A payment to a guild for a loan", "A fine for being late"], "The Church used tithes to support priests, churches and help for the poor."),
  q(2, "What was an apprentice?", "A young person who learned a trade by working for a master craftsperson", ["A knight's horse", "A tax collector", "A priest's assistant only"], "Apprentices trained for years before becoming skilled workers, often within a guild."),
  q(2, "What was the three-field system?", "A farming method that rotated crops and left one field resting each year", ["A plan for building a castle", "A tax paid three times a year", "A way of dividing the army"], "Resting a field (letting it lie fallow) helped the soil recover and increased harvests."),
  q(2, "Why did peasants give part of their crops and labour to the lord?", "In return for land to farm and protection", ["Because they owned the manor", "Because there was no farming", "Because the Church banned money"], "In the feudal system, each group owed something to the group above it."),
  q(3, "Why did the growth of trade help weaken feudalism?", "Merchants and townspeople gained wealth and independence outside the lord-peasant system.", ["Trade made lords richer than kings.", "Trade stopped towns from growing.", "Peasants gave up all their rights."], "Money and towns offered new ways to earn a living apart from the manor."),
  q(3, "Why is the Magna Carta important for later ideas about government?", "It supported the idea that rulers are not above the law.", ["It gave all peasants the vote.", "It made kings all-powerful.", "It ended the Church's power."], "Over the centuries, the Magna Carta was cited by people seeking limits on rulers' power."),
  q(3, "Why did kings and the Church sometimes come into conflict?", "Both claimed authority, including over who could appoint bishops and collect taxes.", ["They never met.", "The Church had no land.", "Kings were forbidden from reading."], "The Church was powerful and wealthy, so disagreements with rulers could be serious."),
  q(3, "A medieval town charter gave a town certain rights. What might it allow?", "Running its own markets and courts", ["Ruling the whole country", "Avoiding all laws", "Keeping its own army of knights only"], "Charters let townspeople manage their own affairs and encouraged trade."),
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
  q(1, "What is a person who follows Islam called?", "a Muslim", ["a Buddhist", "a Sikh", "a Hindu"], "Muslims follow the teachings of Islam. Muslim communities exist all around the world."),
  q(1, "What is the Hajj?", "The pilgrimage to Makkah that Muslims who are able are asked to make", ["A harvest festival in Spain", "A type of mosque", "A trade tax"], "Pilgrims from many lands meet in Makkah each year."),
  q(1, "During which month do many Muslims fast from dawn until sunset?", "Ramadan", ["Diwali", "Passover", "Vaisakhi"], "Ramadan is a month of fasting, prayer and caring for others."),
  q(1, "Arabic became widely used for learning across the early Islamic world. How did this help ideas spread?", "Scholars from many regions could read and share the same texts.", ["Nobody could read Arabic.", "It stopped translation.", "It banned trade."], "A shared language of scholarship made it easier to exchange books and ideas."),
  q(2, "What was a caliph?", "A leader of the Muslim community and ruler of a caliphate", ["A kind of mosque", "A trade caravan", "A merchant guild"], "The Abbasid caliphs ruled from Baghdad for centuries."),
  q(2, "Who was Ibn Battuta?", "A scholar from Morocco who travelled across Africa and Asia in the 1300s", ["An Ottoman sultan", "A Mongol general", "A Spanish king"], "He travelled for about thirty years and wrote an account of the places he visited."),
  q(2, "Muslim scholars translated and preserved many writings from ancient Greece. Why did this matter later?", "Europeans later learned many of these ideas through Arabic translations.", ["It destroyed the ideas.", "It stopped scholars from learning.", "It banned science."], "Translation kept knowledge alive and passed it on."),
  q(2, "What was an astrolabe used for?", "Measuring the positions of the Sun and stars to find time, direction and location", ["Grinding grain", "Making paper", "Weaving cloth"], "Muslim astronomers improved this instrument, which helped travellers and set times for prayer."),
  q(2, "Why is a number system with zero and place value useful?", "It makes writing large numbers and calculating easier than Roman numerals.", ["It makes numbers bigger.", "It removes the need to count.", "It only works for money."], "Hindu-Arabic numerals reached Europe through Arabic-speaking scholars."),
  q(2, "Al-Zahrawi, a physician in al-Andalus, is known for…", "writing a large medical text with drawings of surgical tools", ["inventing the printing press", "building a trade fleet", "writing the Qur'an"], "His work was studied in the Islamic world and in Europe."),
  q(2, "Fatima al-Fihri founded the University of al-Qarawiyyin in Fez in 859. Why is it notable?", "It is often described as one of the oldest universities still operating.", ["It was built in Spain.", "It taught only farming.", "It was a castle."], "Education in the Islamic world included women as founders, learners and teachers."),
  q(2, "What was a caravanserai?", "A roadside inn where traders and their animals could rest", ["A royal prison", "A school for scribes", "A type of ship"], "Caravanserais were stops along trade routes such as the Silk Road."),
  q(2, "How did the Hajj help ideas spread?", "Pilgrims from many lands met, shared news and carried ideas home.", ["Pilgrims were forbidden to speak.", "It kept people apart.", "It ended trade."], "Travel and meeting new people spread knowledge and goods."),
  q(3, "Why is it wrong to describe the Islamic world as one uniform society?", "It included many peoples, languages and cultures across three continents.", ["Everyone spoke the same language.", "It was a single village.", "It had only one city."], "Diverse regions had different customs, foods, art and ways of governing."),
  q(3, "The Alhambra in Granada, Spain, is known for…", "Islamic art with geometric patterns, arches and courtyards", ["Viking longhouses", "Roman arenas", "Gothic cathedral spires"], "It was built by the rulers of Granada in the 1200s and 1300s."),
  q(3, "Suleiman I, who ruled the Ottoman Empire from 1520 to 1566, is remembered for…", "expanding the empire and organizing its laws", ["discovering the Americas", "writing the Magna Carta", "leading the Crusades"], "He is known in Turkish as “Kanuni,” the Lawgiver."),
  q(3, "The Ottoman millet system allowed…", "religious communities to run some of their own affairs, such as courts and schools", ["only one religion to exist", "everyone to move freely without any laws", "the sultan to be elected by farmers"], "Many Christian and Jewish communities lived under Ottoman rule with some self-government."),
  q(3, "How did paper-making reach Europe from Asia?", "It spread along trade routes through the Islamic world, and paper mills later appeared in Muslim Spain.", ["It was invented in Europe first.", "Sailors carried it from the Americas.", "It was never used in Europe."], "Paper was cheaper than parchment and helped make more books."),
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
  q(1, "Marco Polo was a merchant from Venice who travelled to…", "China and wrote about his journey", ["North America", "Australia", "Antarctica"], "His book made many Europeans curious about Asia."),
  q(1, "Which animal was used to carry goods across the Sahara?", "the camel", ["the llama", "the reindeer", "the elephant"], "Camels can travel a long way in dry heat with little water."),
  q(1, "The “Spice Islands” in Southeast Asia were famous for which spices?", "cloves and nutmeg", ["pepper from Canada", "vanilla from Europe", "salt from the Sahara"], "These spices were costly and traded across oceans."),
  q(2, "Which Chinese invention helped sailors find direction?", "the magnetic compass", ["the printing press", "the astrolabe", "the telescope"], "Chinese sailors used the compass to navigate long before it reached Europe."),
  q(2, "What was the Hanseatic League?", "A group of northern European trading towns that worked together to protect trade", ["A Mongol army", "A Silk Road caravan", "A West African empire"], "Towns such as Lübeck and Hamburg joined to protect merchants and trade."),
  q(2, "Why did Italian city-states such as Venice grow rich from trade?", "Their ports linked Europe with goods arriving from Asia and the Middle East.", ["They had no ports.", "They stopped all trade.", "They lay deep in the Sahara."], "Goods from the east entered Europe through Mediterranean ports."),
  q(2, "Kublai Khan, a grandson of Genghis Khan, founded which dynasty in China?", "the Yuan dynasty", ["the Ming dynasty", "the Han dynasty", "the Edo period"], "The Yuan dynasty was a Mongol dynasty. The Ming dynasty followed it."),
  q(2, "The Forbidden City in Beijing was built by the Ming as…", "a palace for the emperor and his court", ["a trading port", "a fort for the Mongols", "a university"], "Construction began in the early 1400s."),
  q(3, "How did the trans-Saharan trade help spread Islam in West Africa?", "Muslim merchants and scholars travelled with caravans and settled in trading cities.", ["The Sahara was empty of people.", "Islam was banned from trade.", "Caravans carried only gold."], "Trade routes carried religion and learning as well as goods."),
  q(3, "Historians suggest Ming China ended its treasure-fleet voyages after 1433 partly because…", "of the high cost and a shift of attention to defending the northern border", ["the ships had sunk in the Atlantic", "China ran out of paper", "the Mongols took the ships"], "Rulers decided the money was needed elsewhere."),
  q(3, "How did Mansa Musa's pilgrimage change how others saw Mali?", "Its wealth made Mali known across North Africa, the Middle East and Europe.", ["Mali was forgotten.", "Mali stopped trading gold.", "Mali became part of Rome."], "Maps made soon after show Mansa Musa holding a gold nugget."),
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
  q(1, "Who painted the Mona Lisa?", "Leonardo da Vinci", ["Michelangelo", "Johannes Gutenberg", "Nicolaus Copernicus"], "The painting is famous for its soft shading and mysterious smile."),
  q(1, "Michelangelo painted the ceiling of which famous chapel in Rome?", "the Sistine Chapel", ["Notre-Dame", "St. Paul's", "the Alhambra"], "He painted it between 1508 and 1512."),
  q(1, "What did Gutenberg's press use to print many copies of a page?", "movable metal type", ["a single carved stone", "monks copying by hand", "a loom"], "Letters could be arranged, inked, printed and reused."),
  q(1, "A patron of the arts is someone who…", "pays artists to create work", ["paints in secret", "burns books", "builds ships"], "Wealthy families and rulers were patrons of many Renaissance artists."),
  q(1, "William Shakespeare, a famous English writer in the late 1500s and early 1600s, wrote…", "plays and poems", ["maps", "laws", "encyclopedias"], "His plays are still performed around the world."),
  q(2, "Before the printing press, how were books made in Europe?", "Copied by hand, which was slow and costly", ["Printed by machine", "Read aloud from tablets only", "Made in factories"], "A single book could take months to copy."),
  q(2, "Which Italian family was well known for supporting artists in Florence?", "the Medici", ["the Tudors", "the Vikings", "the Mongols"], "The Medici were bankers and rulers who paid for art, buildings and learning."),
  q(2, "Renaissance artists used linear perspective to…", "make flat paintings look three-dimensional, with depth", ["avoid using colour", "paint only portraits", "make paintings smaller"], "Lines that meet at a distant point make a picture seem to go back in space."),
  q(2, "What was one belief of Protestant reformers such as Luther?", "People should be able to read the Bible for themselves, in their own language.", ["Only priests may read.", "Books should be burned.", "All Church lands belong to kings."], "Bibles were translated and printed in many local languages."),
  q(2, "Andreas Vesalius, in 1543, changed medicine by…", "publishing detailed drawings of the human body based on careful study", ["inventing the thermometer", "discovering the Americas", "painting the Sistine Chapel"], "He showed that some older medical books contained mistakes."),
  q(3, "Isaac Newton's book Principia (1687) explained…", "gravity and the laws of motion", ["how to print books", "how to sail to Asia", "why the Black Death spread"], "Newton showed that the same laws describe falling objects and planets."),
  q(3, "Why did Church leaders object to Galileo's ideas?", "His Sun-centred view seemed to challenge long-held teachings and authority.", ["He copied Aristotle exactly.", "He refused to use the telescope.", "He wanted to ban printing."], "Evidence-based science clashed with tradition."),
  q(3, "How did the Renaissance differ from the Middle Ages in what people valued?", "There was more interest in individual achievement, classical learning and the human world.", ["People stopped valuing art.", "Only castles mattered.", "Learning was forbidden."], "Humanists studied ancient texts and celebrated human abilities."),
  q(3, "Why did the Reformation spread quickly in parts of Europe?", "Many rulers and townspeople supported it, and printed pamphlets carried its ideas.", ["Printing was banned.", "Nobody wanted change.", "It started in the Americas."], "Printing let ideas travel quickly."),
  q(3, "The Renaissance did not reach everyone equally. Who mostly benefited?", "Wealthy patrons and city dwellers, while most peasants' lives changed little", ["Everyone in Europe equally", "Only sailors", "Only monks"], "Art and learning mostly flourished where there was money and leisure."),
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

// ---------- People on the Move ----------

const MIGRATION: Item[] = [
  q(1, "What is migration?", "People moving from one place to live in another", ["Animals sleeping through the winter", "A kind of trade route", "A type of crop"], "People migrate for many reasons, such as work, safety, family or land."),
  q(1, "Which is a push factor, a reason that makes people leave a place?", "A famine that leaves no food", ["A new school nearby", "Fertile farmland elsewhere", "A well-paid job offer"], "Push factors drive people away. Pull factors, like jobs or land, attract them."),
  q(1, "Which is a pull factor, a reason that attracts people to a place?", "Good farmland and trade opportunities", ["War and conflict", "Drought", "Disease spreading"], "Pull factors make a new place look better than home."),
  q(1, "What is urbanization?", "The growth of towns and cities as more people live in them", ["Farmers moving to bigger farms", "Cities becoming smaller", "Forests growing back"], "Between about 1000 and 1750 CE, trade and crafts helped many towns and cities grow."),
  q(2, "Why did many European towns grow after about 1000 CE?", "Trade, markets and crafts drew people in from the countryside.", ["Castles were abolished.", "The Church banned farming.", "Everyone had to move to cities."], "Towns offered work outside farming, and the growth of trade fed them."),
  q(2, "What was one problem faced by crowded medieval and early modern cities?", "Disease spread quickly, because of poor sanitation and close living.", ["There were too many farms.", "Trade routes closed forever.", "Nobody could find work."], "Crowded streets, waste and no clean water helped illnesses spread."),
  q(2, "What is the difference between forced and unforced migration?", "Forced migration happens when people are made to move against their will, and unforced migration is a free choice.", ["Forced migration is always shorter.", "Unforced migration only happens by sea.", "There is no difference."], "Forced migration includes enslavement and expulsion. Unforced migration includes moving for work or family."),
  q(2, "Which is an example of forced migration?", "Enslaved Africans carried across the Atlantic", ["A merchant who sets up shop in a new city", "A family that moves to farm new land by choice", "A student who travels to study"], "The transatlantic slave trade moved millions of people against their will."),
  q(2, "Which is an example of unforced migration?", "Craftspeople moving to a growing trading city to find work", ["People expelled from their country", "People sold into slavery", "A population forced to leave by an army"], "These people chose to move, hoping for a better living."),
  q(2, "How did the Black Death change where people lived and worked?", "With many deaths, villages shrank and survivors moved to find better pay.", ["Everyone moved to the countryside forever.", "It had no effect on population.", "Cities doubled in size overnight."], "Fewer workers meant higher wages, and some people left manors for towns."),
  q(2, "How did the Columbian Exchange affect the populations of the Americas?", "Diseases brought from Europe killed very large numbers of Indigenous people.", ["Populations grew quickly everywhere.", "No one was affected by disease.", "Only animals were affected."], "Indigenous peoples had no earlier exposure to diseases such as smallpox, so epidemics were devastating."),
  q(3, "Why can new crops change how many people a region can feed?", "Higher-yield crops such as potatoes can support larger populations.", ["Crops never change population.", "New crops always cause famine.", "Only meat affects population."], "After potatoes reached Europe from the Americas, many regions could feed more people."),
  q(3, "How can growing towns affect the environment?", "People use up local wood, water and farmland, and produce waste.", ["Towns have no effect on land.", "Towns always plant more forests.", "Towns make rivers cleaner."], "More people means more demand for fuel, building materials and food from the surrounding land."),
  q(3, "Why do historians say population change and living standards are linked?", "Food supply, health and work all shape how many people live in a place and how well.", ["They are never connected.", "Only rulers affect living standards.", "Population never changes."], "Living standards include food, shelter, health and safety, and they influence population size."),
  q(3, "Which is the best example of an environmental factor that caused people to move?", "Drought and crop failure", ["A new written law", "A festival in a nearby town", "A new type of music"], "Environmental changes, such as droughts or floods, can force people to look for new land."),
  q(1, "Which of these is a reason people migrate?", "To find work, land or safety", ["To avoid all travel", "To stop trading", "To lose their homes on purpose"], "Most people move because they hope for a better life, or because they must leave."),
  q(1, "What is a living standard?", "How well people live, including food, shelter, health and safety", ["The number of castles in a country", "A kind of law", "A type of map"], "Living standards can rise or fall when food supply, health or work change."),
  q(1, "Which place usually grows quickly when trade routes meet?", "a port or trading city", ["a remote mountain pass", "an empty desert", "a frozen lake"], "Cities such as Venice, Timbuktu and Samarkand grew where traders met."),
  q(2, "Why might an epidemic make people leave a city?", "They hope to escape the illness in a safer place.", ["They want to catch the illness.", "They are ordered to build castles.", "Epidemics help trade."], "People have often fled crowded cities during outbreaks, sometimes carrying the disease with them."),
  q(2, "How did the Columbian Exchange change what people ate in Europe?", "Crops such as potatoes, tomatoes and maize arrived from the Americas.", ["Europeans stopped eating bread.", "Rice was invented in Europe.", "No foods crossed the ocean."], "New foods from the Americas changed diets across the world."),
  q(2, "What is one way a growing city can change the land around it?", "Forests are cut and farmland is used to supply the city.", ["The land stays untouched.", "Farmland turns into ocean.", "The city has no need for resources."], "Cities need food, wood and water from the land around them."),
  q(3, "What is a good reason to be careful when we say \"people moved because of one cause\"?", "Most migrations have several causes that work together.", ["People never have reasons.", "Only weather ever matters.", "Historians do not study migration."], "Push and pull factors usually combine, and people respond differently."),
  q(3, "How might clean water and a food surplus change a city's population?", "More people survive and the city can grow.", ["The city must shrink.", "Nobody is affected.", "The city loses its market."], "Better food and health let more children live to adulthood and let more newcomers settle."),
];

const MIGRATION_SORT: SortSet = {
  prompt: "Is each a push factor (a reason to leave) or a pull factor (a reason to go somewhere)? Sort each one.",
  hint: "Push factors make a place hard to stay in, such as famine, war or disease. Pull factors make somewhere else look better, such as jobs, land or safety.",
  bins: [
    { id: "push", label: "Push", emoji: "⬅️" },
    { id: "pull", label: "Pull", emoji: "➡️" },
  ],
  items: [
    { label: "crops fail year after year", emoji: "🌾", bin: "push" },
    { label: "a plague spreads through the village", emoji: "🦠", bin: "push" },
    { label: "an army invades the region", emoji: "⚔️", bin: "push" },
    { label: "a busy market town needs workers", emoji: "🏘️", bin: "pull" },
    { label: "rich, unfarmed land is available", emoji: "🌱", bin: "pull" },
    { label: "a trade city offers safe work", emoji: "⚓", bin: "pull" },
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
      "Contacts and conflicts between peoples stimulated significant cultural, social, and political change.",
      "Human and environmental factors shape changes in population and living standards.",
      "Exploration, expansion, and colonization had varying consequences for different groups.",
      "Changing ideas about the world created tension between people wanting to adopt new ideas and those wanting to preserve established traditions.",
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
    {
      id: "people-on-the-move",
      title: "People on the Move",
      emoji: "🧭",
      blurb: "Migration, growing cities and living standards",
      standards: { "ca-bc": "Changes in population and living standards: forced and unforced migration, diseases and health, urbanization, and environmental impact" },
      parentNote:
        "Why people move (push and pull factors), the difference between forced and unforced migration, how towns and cities grew, how disease and new crops changed populations, and the effect of growing communities on land and resources.",
      generate: unit(MIGRATION, [MIGRATION_SORT]),
    },
  ],
};
