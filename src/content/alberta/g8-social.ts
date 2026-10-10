import type { SortSet } from "../bank";
import { orderOf } from "../grades/kit";
import type { Unit } from "../types";
import { ab } from "./kit";
import { partsPlus, q } from "./g8-bank";

// Alberta Grade 8 social studies (2005): Historical Models of Societies. 8.1 Japan, 8.2 Renaissance Europe
// and 8.3 the Spanish and the Aztecs (the Mexica). BC's Renaissance and Reformation unit is shared (see g8.ts).
// All content is original. The Mexica and Nahua peoples are described with care: they are living cultures,
// and their descendants speak Nahuatl today. No sacred or ceremonial detail is included.

// ---------- 8.1 Japan ----------

const JAPAN_LAND = [
  q(1, "Japan is a country made up of…", "many islands", ["one large island", "a long peninsula only", "a desert"], "Japan has thousands of islands, and four main ones."),
  q(1, "Which is the largest of Japan's four main islands?", "Honshu", ["Hokkaido", "Kyushu", "Shikoku"], "Honshu is the biggest island and is home to Tokyo and Kyoto."),
  q(1, "Why do most people in Japan live on narrow coastal plains?", "Much of the land is mountainous.", ["The mountains are too warm.", "The plains are above the clouds.", "There are no rivers."], "Japan is about three-quarters mountains, so flat land is precious."),
  q(1, "What crop has been central to farming in Japan for a very long time?", "rice", ["wheat", "canola", "potatoes"], "Rice grown in flooded paddies fed many people in Japan."),
  q(2, "Japan lies where tectonic plates meet. What natural hazard is common there?", "earthquakes", ["blizzards", "locust swarms", "tornado outbreaks across plains"], "Many earthquakes and volcanoes happen around the Pacific plate boundaries."),
  q(2, "Shinto, an old belief in Japan, honours…", "kami, the spirits in nature and special places", ["only the shogun", "only foreign gods", "machines"], "Shinto shrines are found near mountains, trees and waterfalls."),
  q(2, "Buddhism came to Japan around the 500s CE from…", "Korea and China", ["Egypt", "Spain", "Mexico"], "Ideas, writing and religion travelled to Japan from nearby parts of Asia."),
  q(2, "Confucian ideas in Japan stressed…", "respect for family, order and duty", ["the freedom to ignore rules", "trade with other countries only", "staying away from people"], "Confucian teachings from China shaped ideas about loyalty and respect."),
  q(2, "Why did the sea help Japan stay separate from mainland Asia?", "Water lies between Japan and its neighbours.", ["There are no ships.", "The sea is frozen all year.", "Japan is joined to Korea."], "Being an island nation made it easier to limit contact."),
  q(3, "What is one way geography shaped how people in Japan lived?", "Fishing and farming on small amounts of flat land shaped communities.", ["Japan has huge flat prairies.", "Deserts shaped most towns.", "Japan has no coast."], "Mountains and the sea shaped where people lived and how they worked."),
  q(3, "How do a society's beliefs and values shape its worldview?", "They guide what people think is important and how they act.", ["They have no effect on people.", "They only matter to rulers.", "They change every day."], "Worldview is shaped by religion, philosophy, geography and experience."),
  q(3, "Which value did the samurai class admire?", "loyalty and discipline", ["wealth from trade", "avoiding all rules", "travelling abroad"], "Samurai were warriors who served lords and honoured a code of conduct."),
  q(3, "Why were arts such as haiku poetry and woodblock prints popular in Edo (Tokyo) in the 1700s?", "Peace and growing cities created audiences, and printing made art affordable.", ["There were no cities.", "The shogun banned all art.", "Printing was not yet known."], "Long peace helped city life and the arts to flourish."),
];

const TOKUGAWA = [
  q(1, "Who held the real power in Japan during the Tokugawa period?", "the shogun", ["the emperor", "the merchants", "the farmers"], "The emperor was honoured, but the shogun ruled."),
  q(1, "Samurai were…", "warriors who served their lords", ["merchants", "farmers", "fishers"], "Samurai were at the top of Japan's class system."),
  q(1, "What is a daimyo?", "a regional lord who ruled a domain", ["a farming tool", "a type of sword", "a foreign trader"], "The daimyo ruled their lands under the shogun's authority."),
  q(1, "The Tokugawa shogunate ruled Japan for about…", "250 years", ["25 years", "10 years", "1000 years"], "From 1603 to 1868, Japan was ruled by the Tokugawa family."),
  q(2, "Which group was ranked highest in the Tokugawa class system?", "the samurai", ["the merchants", "the artisans", "the farmers"], "Samurai were first, then farmers, artisans and merchants."),
  q(2, "Merchants often had a lot of money. Where were they ranked in the Tokugawa class system?", "at the bottom", ["at the top", "just below the shogun", "above the samurai"], "The system ranked people by their role, not their wealth."),
  q(2, "Why did Tokugawa rulers make daimyo spend alternate years in Edo?", "To help the shogun keep control of the lords.", ["To help the lords learn English.", "To lower taxes.", "To teach the lords to farm."], "The system of 'alternate attendance' kept daimyo busy, costly and watched."),
  q(2, "What was Japan's isolation policy?", "It limited contact and trade with other countries.", ["It invited everyone to settle in Japan.", "It ended all farming.", "It made the emperor a shogun."], "From the 1630s, Japanese people were not allowed to leave, and foreign trade was tightly controlled."),
  q(2, "During the isolation period, which foreign traders were allowed at Nagasaki?", "the Dutch and the Chinese", ["the English and the French", "the Spanish and the Portuguese", "the Americans and Canadians"], "Only a few foreign traders were allowed, under strict rules."),
  q(2, "Which city became a huge centre of government and trade, and later became Tokyo?", "Edo", ["Kyoto", "Osaka", "Nagoya"], "By the 1700s Edo was one of the largest cities in the world."),
  q(3, "Why did the shogunate want to limit foreign contact?", "To protect its control and stop foreign influence from changing society.", ["To make trade bigger.", "To bring in foreign armies.", "To let anyone travel."], "Leaders feared that outside ideas and powers could weaken their rule."),
  q(3, "During isolation, how did Japanese scholars still learn about Western science?", "Through books brought by Dutch traders (called 'Dutch learning').", ["By travelling to Europe freely.", "By sending letters through the emperor.", "They did not learn anything."], "Some knowledge came through Nagasaki, even when contact was limited."),
  q(3, "The Tokugawa period was mostly peaceful. How did this affect Japan?", "Cities, trade and the arts grew.", ["Cities disappeared.", "Farming stopped.", "The shogun lost power at once."], "Without long wars, people could build, trade and create."),
  q(3, "How did a rice-based economy affect the status of samurai?", "Samurai were paid in rice, but some struggled when its value changed.", ["Samurai earned no payment.", "Samurai grew all the rice themselves.", "Samurai stopped serving lords."], "A fixed income in rice could shrink in value while merchants grew richer."),
];

const TOKUGAWA_ORDER = orderOf(
  "Put these events in Japan's history in order.",
  "Tokugawa Ieyasu became shogun in 1603. The isolation laws came in the 1630s, Perry arrived in 1853 and the Meiji Restoration was in 1868.",
  [
    { id: "shogun", label: "Tokugawa Ieyasu becomes shogun", emoji: "🏯" },
    { id: "isolation", label: "Japan limits contact with other countries", emoji: "🚪" },
    { id: "perry", label: "American ships arrive and ask Japan to open its ports", emoji: "⛴️" },
    { id: "meiji", label: "The Meiji Restoration begins", emoji: "🏛️" },
  ],
);

const MEIJI = [
  q(1, "Which country did Commodore Perry sail from to ask Japan to open its ports?", "the United States", ["Spain", "Mexico", "Brazil"], "Perry's ships arrived in 1853 and again in 1854."),
  q(1, "The new government of 1868 put which leader at its centre?", "the emperor", ["the shogun", "the merchants", "the farmers"], "The Meiji Restoration 'restored' the emperor to the centre of government."),
  q(1, "After 1868, Edo was renamed…", "Tokyo", ["Kyoto", "Osaka", "Nagasaki"], "The emperor moved there, and it became the capital."),
  q(1, "What does 'adaptation' mean?", "changing to fit new conditions", ["staying exactly the same", "forgetting everything", "keeping everything out"], "A society adapts when it takes on new ideas while keeping what matters to it."),
  q(2, "How did Perry's visit change Japan?", "It pushed Japan to open some ports to trade and weakened the shogunate.", ["It ended trade for good.", "It made Japan a colony.", "It had no effect."], "The treaty signed in 1854 opened ports and showed Japan's rulers could not stop foreign power."),
  q(2, "Which of these was a part of Japan's modernization in the Meiji period?", "building railways and factories", ["closing all ports", "banning schools", "stopping all trade"], "Japan built its first railway in 1872 and invested in industry."),
  q(2, "In the Meiji period, Japan set up…", "a national system of schools", ["a ban on reading", "a system of only private tutors", "no schools at all"], "Education was made widely available to build a skilled population."),
  q(2, "What happened to the privileges of the samurai class in the Meiji period?", "They were ended.", ["They were doubled.", "They stayed the same for 100 years.", "They were given to merchants only."], "The new government created a new army of ordinary citizens and ended the old class system."),
  q(2, "Why did Japan's leaders look to other countries for ideas?", "They wanted to build a strong, modern country that could protect itself.", ["They wanted to give up independence.", "They wanted to stop all change.", "They wanted to become isolated again."], "Leaders sent missions abroad to study technology, law and education."),
  q(3, "How is the Meiji period an example of 'adapting' to new conditions?", "Japan borrowed Western technology and methods while keeping much of its own culture.", ["Japan copied everything and changed nothing of its own.", "Japan rejected all new ideas.", "Japan gave its land away."], "Japan combined new tools with its own traditions and identity."),
  q(3, "Why was the end of isolation a major change for Japan?", "People, goods and ideas could now flow in and out.", ["Nothing changed.", "The land moved.", "The ports were already open."], "Contact with the world brought new opportunities and challenges."),
  q(3, "Which phrase describes the Meiji government's aims?", "'rich country, strong army'", ["'closed doors, empty ports'", "'no schools, no trade'", "'old ways only'"], "Leaders linked a strong economy with the ability to defend the country."),
  q(3, "Why did some samurai oppose the Meiji reforms?", "They lost their special status and income.", ["They wanted more railways.", "They liked the new schools.", "They were given more land."], "Reforms ended old privileges, and some samurai protested."),
];

const PERIOD_SORT: SortSet = {
  prompt: "Tokugawa period or Meiji period? Sort each description.",
  hint: "The Tokugawa shoguns ruled until 1868 and limited foreign contact. The Meiji period began in 1868 with rapid modernization.",
  bins: [
    { id: "tokugawa", label: "Tokugawa (before 1868)", emoji: "🏯" },
    { id: "meiji", label: "Meiji (after 1868)", emoji: "🚆" },
  ],
  items: [
    { label: "the shogun holds real power", emoji: "🏯", bin: "tokugawa" },
    { label: "foreign trade limited to Nagasaki", emoji: "🚢", bin: "tokugawa" },
    { label: "samurai ranked at the top", emoji: "⚔️", bin: "tokugawa" },
    { label: "daimyo rule their domains", emoji: "🗾", bin: "tokugawa" },
    { label: "first railway opens", emoji: "🚆", bin: "meiji" },
    { label: "national schools for children", emoji: "🏫", bin: "meiji" },
    { label: "emperor is the centre of government in Tokyo", emoji: "🏛️", bin: "meiji" },
    { label: "an army of ordinary citizens", emoji: "🪖", bin: "meiji" },
  ],
};

// ---------- 8.2 Renaissance Europe ----------

const RENAISSANCE = [
  q(1, "'Renaissance' means…", "rebirth", ["war", "harvest", "empire"], "People became very interested in learning and art from ancient Greece and Rome."),
  q(1, "Where did the Renaissance begin?", "Italy", ["Japan", "Mexico", "Canada"], "It began in wealthy Italian city-states such as Florence."),
  q(1, "Which Italian city is known as an early centre of the Renaissance?", "Florence", ["Paris", "London", "Madrid"], "Florence's merchants, bankers and artists helped start it."),
  q(1, "A patron is…", "someone who pays artists and thinkers to do their work", ["someone who paints walls", "a kind of mask", "a type of ship"], "Rich families supported artists so they could create."),
  q(2, "Which Florentine family was a famous patron of artists?", "the Medici", ["the Tokugawa", "the Tudors", "the Habsburgs"], "The Medici were bankers who spent money on art, buildings and learning."),
  q(2, "What is humanism?", "a way of thinking that values human learning and achievement", ["a belief that learning is useless", "a form of farming", "a law about trade"], "Humanists studied literature, history and the arts."),
  q(2, "Why did trade help to start the Renaissance in Italy?", "Trade made merchants and cities wealthy enough to pay for art and learning.", ["Trade made all people poor.", "Trade stopped all travel.", "Trade ended cities."], "Italian cities such as Venice and Genoa traded across the Mediterranean."),
  q(2, "The Black Death (1347–1351) changed Europe because…", "so many people died that society and work changed", ["it ended all farming", "it made cities larger", "it improved health"], "Fewer workers meant higher wages, and people asked new questions about life."),
  q(2, "In the Middle Ages, much of Europe's thinking centred on the Church. What shifted in the Renaissance?", "More attention to human abilities and the world, alongside religion", ["Religion disappeared at once", "Everyone stopped reading", "People stopped using art"], "Most people stayed deeply religious, but interest in human achievement grew."),
  q(2, "What does 'individualism' mean?", "valuing a person's talents and achievements", ["valuing only the group", "valuing only machines", "ignoring people"], "Renaissance artists and thinkers began to sign and be proud of their work."),
  q(3, "Why did scholars from the Greek-speaking East bring useful knowledge to Italy in the 1400s?", "They carried ancient Greek texts and ideas with them.", ["They brought gunpowder.", "They brought Indigenous maps from the Americas.", "They brought no books."], "Ancient Greek and Roman writings were studied again."),
  q(3, "Why is the Renaissance called the start of a 'Western worldview'?", "Its ideas about reason, the individual and learning influenced later Western societies.", ["It had no effect on later society.", "It ended Western ideas.", "It was a copy of Japan's isolation."], "Many ideas that shaped later societies were developed in this time."),
  q(3, "How did wealthy city-states in Italy differ from large kingdoms?", "Each city-state governed itself with its own leaders.", ["They all had one king.", "They had no cities.", "They were part of Japan."], "Florence, Venice and Milan each had their own governments."),
  q(3, "Which statement best compares the Renaissance with the Middle Ages?", "The Renaissance placed greater value on learning from ancient writers and on individual achievement.", ["The Middle Ages had no religion.", "The Renaissance had no art.", "They were exactly the same."], "Both periods were religious, but their focus and emphasis changed."),
];

const RENAISSANCE_ART = [
  q(1, "Who painted the Mona Lisa?", "Leonardo da Vinci", ["Michelangelo", "Gutenberg", "Galileo"], "Leonardo was a painter, inventor and scientist."),
  q(1, "Who sculpted the marble statue David?", "Michelangelo", ["Leonardo da Vinci", "Shakespeare", "Luther"], "Michelangelo carved David between 1501 and 1504."),
  q(1, "Which invention helped books spread ideas quickly in Europe?", "the printing press", ["the telescope", "the compass", "the clock"], "Johannes Gutenberg's press (about 1450) made many copies quickly."),
  q(1, "A Renaissance artist who wanted to show depth in a flat picture used…", "perspective", ["silence", "stone", "wax"], "Perspective makes things look as if they are in 3-D."),
  q(2, "Michelangelo painted the ceiling of which famous chapel?", "the Sistine Chapel", ["the Mona Lisa Room", "the Tower of London", "the Alhambra"], "He painted it from 1508 to 1512 in Rome."),
  q(2, "Leonardo da Vinci's notebooks show that he studied…", "anatomy, machines and nature", ["only music", "only farming", "only trade"], "He drew the human body, flying machines and the flow of water."),
  q(2, "Brunelleschi designed which famous feature of Florence?", "the dome of its cathedral", ["the printing press", "the first telescope", "the compass"], "His dome was an engineering marvel of the early 1400s."),
  q(2, "William Shakespeare, a writer of the late 1500s and early 1600s, lived in…", "England", ["Italy", "Spain", "Japan"], "Shakespeare's plays are still performed today."),
  q(2, "Why did the printing press matter?", "It let ideas spread faster and to more people.", ["It made books very rare.", "It stopped people from reading.", "It was used only by kings."], "Cheaper books meant more people could learn to read and share ideas."),
  q(3, "Copernicus proposed that the Earth and other planets…", "travel around the Sun", ["are fixed at the centre of everything", "stand still while the Sun goes around Earth", "do not move"], "He published his Sun-centred idea in 1543."),
  q(3, "Galileo used a telescope to observe moons around Jupiter. Why was this important?", "It gave evidence that not everything orbits the Earth.", ["It proved the Earth is flat.", "It ended the Black Death.", "It started a new religion."], "Observation became important for testing ideas."),
  q(3, "Why did Renaissance scientists value observation and experiment?", "They wanted to test ideas with evidence instead of only trusting old authorities.", ["They wanted to avoid thinking.", "They stopped using books.", "They distrusted all evidence."], "This approach shaped modern science."),
  q(3, "Why did some Church leaders object to new scientific ideas?", "The ideas seemed to challenge long-held teachings and authority.", ["The ideas were boring.", "The Church disliked writing.", "The ideas were too cheap."], "New observations challenged old beliefs, which led to disagreements."),
  q(3, "Why did Renaissance patrons often place their family names or symbols on works of art?", "To show wealth, power and support for learning.", ["To hide the artist.", "To avoid being noticed.", "To stop others from seeing the art."], "Art was also a way to show a family's standing."),
];

const RENAISSANCE_ORDER = orderOf(
  "Put these Renaissance-era events in order.",
  "Gutenberg's press (about 1450) came first, then Luther in 1517, Copernicus in 1543 and Galileo's telescope observations in 1610.",
  [
    { id: "gutenberg", label: "Gutenberg's printing press (about 1450)", emoji: "🖨️" },
    { id: "luther", label: "Martin Luther's Ninety-five Theses (1517)", emoji: "📜" },
    { id: "copernicus", label: "Copernicus publishes his Sun-centred model (1543)", emoji: "☀️" },
    { id: "galileo", label: "Galileo observes the moons of Jupiter (1610)", emoji: "🔭" },
  ],
);

// ---------- 8.3 The Spanish and the Aztecs ----------

const AZTEC = [
  q(1, "The Aztec Empire was led by the people who called themselves…", "the Mexica", ["the Inuit", "the Samurai", "the Medici"], "'Aztec' is the name many people use today. The people called themselves Mexica."),
  q(1, "What was the capital city of the Mexica?", "Tenochtitlan", ["Edo", "Florence", "Cuzco"], "It was built on an island in Lake Texcoco."),
  q(1, "What language did the Mexica speak?", "Nahuatl", ["Spanish", "Japanese", "Latin"], "Nahuatl is still spoken by well over a million people in Mexico today."),
  q(1, "Which crop was the most important food in Mexica farming?", "maize (corn)", ["rice", "wheat", "oats"], "Maize was grown with beans and squash."),
  q(2, "How did the Mexica grow food on and around the lake?", "on chinampas, small artificial islands built in shallow water", ["by cutting down all the forests", "with machine tractors", "on mountain glaciers"], "Chinampas were fertile, and farmers could grow several crops a year."),
  q(2, "How did people reach Tenochtitlan from the mainland?", "by causeways and by canoe", ["by train", "by flying machines", "through tunnels only"], "Raised roads called causeways crossed the lake."),
  q(2, "Tenochtitlan had a huge market. What was often used as money there?", "cacao beans", ["gold coins from Spain", "paper bills", "metal coins with a king's face"], "Cacao beans and cloth were used in trade."),
  q(2, "The Triple Alliance was an agreement among which three city-states?", "Tenochtitlan, Texcoco and Tlacopan", ["Venice, Florence and Milan", "Edo, Kyoto and Osaka", "Madrid, Seville and Granada"], "Together they formed the strongest power in central Mexico."),
  q(2, "What was tribute?", "goods or labour paid to a ruler by conquered peoples", ["a kind of sword", "a festival of music", "a type of farm"], "The Mexica collected tribute such as cloth, food and cacao from many peoples."),
  q(2, "Who was Moctezuma II?", "the Mexica ruler when the Spanish arrived", ["a Spanish king", "a samurai", "an Italian painter"], "He led from 1502 until 1520."),
  q(3, "What was a calpulli?", "a neighbourhood or community group in Mexica cities", ["a type of cloth", "a kind of boat", "a Spanish ship"], "Calpultin organized land, education and work for families."),
  q(3, "How did the Mexica society have different roles?", "There were nobles, commoners, merchants, artisans and enslaved people.", ["Everyone had the same job.", "There were only farmers.", "There were only soldiers."], "Social roles shaped daily life, but a person could earn honour through service."),
  q(3, "Why was the pochteca (merchants') network important?", "It linked far-off regions and brought goods and information to Tenochtitlan.", ["It stopped all trade.", "It built the causeways.", "It taught Spanish."], "Long-distance traders also gathered information about other lands."),
  q(3, "Why did some peoples under Mexica rule resent the empire?", "They had to pay tribute and had little say in government.", ["They received free trade goods.", "They were never conquered.", "They ruled Tenochtitlan."], "Resentment of tribute helps explain later alliances with the Spanish."),
  q(3, "The Mexica kept records in books made of folded paper called codices. What did these show?", "pictures and symbols recording history, tribute and calendars", ["only Spanish letters", "machines", "maps of Europe"], "Many were destroyed, but some survive and are studied today."),
];

const SPAIN = [
  q(1, "Which country sent Christopher Columbus on his 1492 voyage?", "Spain", ["Japan", "Mexico", "Canada"], "Queen Isabella and King Ferdinand supported his voyage."),
  q(1, "A conquistador was…", "a Spanish soldier-explorer who sought to conquer lands", ["a Japanese lord", "a Mexica farmer", "an Italian painter"], "Conquistador means 'conqueror' in Spanish."),
  q(1, "Which animal did the Spanish bring to the Americas that changed travel and war?", "the horse", ["the elephant", "the penguin", "the kangaroo"], "Horses were new to the Americas before the Spanish arrived."),
  q(1, "Many Spanish explorers wanted gold, wealth and…", "to spread the Catholic faith", ["to set up Buddhist temples", "to learn Nahuatl", "to find the North Pole"], "Motives were often described as 'God, gold and glory'."),
  q(2, "Which three motives are often used to describe Spanish exploration?", "God, gold and glory", ["peace, farms and trade", "music, art and food", "maps, ships and fish"], "Religion, wealth and fame all mattered to explorers and rulers."),
  q(2, "Why did the Spanish crown support explorers?", "To gain wealth and power, and to spread Christianity.", ["To give land to the Mexica.", "To end all trade.", "To stay inside Spain."], "Rulers expected to gain resources and new territory."),
  q(2, "Spanish soldiers had steel swords, armour and guns. What was one advantage?", "Their weapons could be very effective in battle against forces without them.", ["Steel made them invisible.", "Horses made them smaller.", "Guns could never fire."], "Technology was one factor among many in the conquest."),
  q(2, "What is meant by the Columbian Exchange?", "the movement of plants, animals, people and diseases between the Americas and the Old World", ["a trade of paintings", "a sports competition", "a Spanish election"], "Contact after 1492 changed the diets and lives of people on both sides of the Atlantic."),
  q(2, "In Spain in the 1500s, who had the most authority?", "the monarch and the Catholic Church", ["the merchants only", "the artists", "the farmers"], "Spain was a monarchy closely tied to the Church."),
  q(3, "How did the worldview of many Spanish people in the 1500s differ from the Mexica worldview?", "They had different beliefs, languages, governments and ideas of land and wealth.", ["They were exactly the same.", "Neither had any beliefs.", "They shared the same language."], "Differences in worldview led to misunderstanding and conflict."),
  q(3, "What is ethnocentrism?", "judging other cultures only by the standards of your own", ["loving all cultures equally", "avoiding all trade", "studying only maps"], "Some Europeans believed their ways were superior, which shaped how they treated Indigenous peoples."),
  q(3, "Why do historians compare the viewpoints of the Spanish and the Mexica?", "To understand how each side saw the same events in different ways.", ["To decide who is better.", "To ignore one side.", "To avoid learning history."], "Looking at several perspectives gives a fuller picture."),
  q(3, "Which of these is an effect of the Columbian Exchange on Europe?", "Foods like potatoes, tomatoes and maize were added to farming and diets.", ["Europe lost all its farms.", "Europe stopped trade.", "Europeans gave up cooking."], "Crops from the Americas changed what people could grow and eat."),
];

const EXCHANGE_SORT: SortSet = {
  prompt: "Which way did each travel in the Columbian Exchange?",
  hint: "Maize, potatoes, tomatoes and cacao were first grown in the Americas. Horses, wheat, cattle and pigs came across the Atlantic with Europeans.",
  bins: [
    { id: "toEurope", label: "From the Americas to Europe", emoji: "🌽" },
    { id: "toAmericas", label: "From Europe to the Americas", emoji: "🐎" },
  ],
  items: [
    { label: "maize (corn)", emoji: "🌽", bin: "toEurope" },
    { label: "potatoes", emoji: "🥔", bin: "toEurope" },
    { label: "tomatoes", emoji: "🍅", bin: "toEurope" },
    { label: "cacao (chocolate)", emoji: "🍫", bin: "toEurope" },
    { label: "horses", emoji: "🐎", bin: "toAmericas" },
    { label: "wheat", emoji: "🌾", bin: "toAmericas" },
    { label: "cattle", emoji: "🐄", bin: "toAmericas" },
    { label: "pigs", emoji: "🐖", bin: "toAmericas" },
  ],
};

const CONQUEST = [
  q(1, "Which Spanish leader arrived on the coast of Mexico in 1519?", "Hernán Cortés", ["Christopher Columbus", "Moctezuma", "Tokugawa Ieyasu"], "Cortés landed near what is now Veracruz."),
  q(1, "What disease, brought by Europeans, killed very many people in the Americas?", "smallpox", ["a cold only", "no disease", "scurvy"], "People in the Americas had never been exposed to it, so it spread quickly."),
  q(1, "In 1521, the Spanish and their allies took control of…", "Tenochtitlan", ["Edo", "Florence", "Madrid"], "Tenochtitlan fell after a long siege."),
  q(1, "What city was built on the ruins of Tenochtitlan?", "Mexico City", ["Madrid", "Lima", "Toronto"], "Mexico City is built on the lake bed where Tenochtitlan stood."),
  q(2, "Which peoples became important allies of Cortés?", "the Tlaxcalans and other peoples who opposed Mexica rule", ["the Japanese", "the Medici", "the Vikings"], "Many peoples hoped to end the tribute they paid to the Mexica."),
  q(2, "Who was Malintzin (also called Doña Marina or Malinche)?", "a Nahua woman who translated for Cortés", ["a Spanish queen", "a Mexica merchant", "a samurai"], "Her ability to speak several languages made her an important figure."),
  q(2, "Why was it hard for the Mexica to fight the Spanish after 1520?", "A smallpox epidemic killed many people, including leaders.", ["They had no weapons at all.", "They were all away at sea.", "They agreed with the Spanish."], "Disease weakened the city before the final siege."),
  q(2, "What does 'siege' mean?", "surrounding a city to cut off its supplies and force it to give up", ["a festival", "a sea voyage", "a trade agreement"], "The Spanish and their allies surrounded Tenochtitlan in 1521."),
  q(2, "Who was the last Mexica leader at the fall of Tenochtitlan?", "Cuauhtémoc", ["Moctezuma II", "Cortés", "Columbus"], "He led the defence and surrendered in August 1521."),
  q(2, "Which area did Spain name after it took control?", "New Spain", ["New France", "New Japan", "New Italy"], "New Spain was ruled from Mexico City."),
  q(3, "Many factors helped the Spanish succeed. Which statement is the most complete?", "Allies, disease, weapons and divisions among peoples all played a part.", ["Only weapons mattered.", "Only luck mattered.", "Only Cortés mattered."], "Historians point to several causes working together."),
  q(3, "Why were Indigenous allies so important to the Spanish campaign?", "Thousands of allied warriors fought alongside the Spanish.", ["They fought against the Spanish only.", "They were not involved at all.", "They sailed the ships."], "The conquest was not just Spanish against Mexica; many peoples took sides."),
  q(3, "What happened to the people and culture of the Mexica after the conquest?", "Nahua peoples and the Nahuatl language continue today.", ["Everyone disappeared.", "Nahuatl is no longer spoken.", "Mexico City was never rebuilt."], "Many descendants live in Mexico today and keep their language and traditions alive."),
  q(3, "How could the Spanish and Mexica worldviews have caused conflict?", "They differed on rule, land, religion and what a conquest meant.", ["They shared everything.", "Neither had leaders.", "Neither wanted trade."], "Different values led to different expectations."),
];

const CONQUEST_ORDER = orderOf(
  "Put the events of the Spanish arrival in Mexico in order.",
  "Cortés landed in 1519 and entered Tenochtitlan that autumn. The Spanish were forced out in 1520, and Tenochtitlan fell in 1521.",
  [
    { id: "landing", label: "Cortés lands on the coast of Mexico (1519)", emoji: "⛵" },
    { id: "enters", label: "The Spanish enter Tenochtitlan (1519)", emoji: "🏙️" },
    { id: "flee", label: "The Spanish are forced out of the city (1520)", emoji: "🌧️" },
    { id: "fall", label: "Tenochtitlan falls after a siege (1521)", emoji: "🛡️" },
  ],
);

const WORLDVIEWS = [
  q(1, "A worldview is…", "the way a group of people understands the world and what matters", ["a type of map", "a way to paint", "a tool for farming"], "Worldviews are shaped by beliefs, values, land and history."),
  q(1, "A primary source is…", "created by someone who was there at the time", ["written long after by someone else", "a made-up story", "a textbook summary"], "Letters, diaries and objects from the time are primary sources."),
  q(1, "A perspective is…", "a point of view", ["a kind of ship", "a tool", "a law"], "People can see the same event in different ways."),
  q(2, "Which is an example of a secondary source?", "a textbook about the Renaissance", ["a letter written in 1520", "a painting made in 1500", "a tool from long ago"], "Secondary sources are written later by people who study the past."),
  q(2, "A letter written by Cortés about the conquest shows mostly…", "the Spanish point of view", ["the Mexica point of view", "no point of view", "the point of view of a Japanese shogun"], "A writer's background and goals shape how they describe events."),
  q(2, "Why is it important to look for Mexica and Nahua accounts as well as Spanish ones?", "To hear more than one side of the story.", ["Because Spanish accounts are never useful.", "Because Nahua accounts are always perfect.", "To avoid reading."], "Historians read many sources to understand different perspectives."),
  q(2, "A society that welcomes new ideas while keeping its own traditions is…", "adapting", ["staying isolated", "disappearing", "conquering"], "Japan's Meiji leaders are an example."),
  q(2, "A society that limits contact with others is…", "isolating itself", ["adapting all the time", "building a delta", "expanding quickly"], "Tokugawa Japan limited contact with other countries for about 200 years."),
  q(3, "Why do different people describe the same event differently?", "Their experiences, beliefs and goals shape what they notice and say.", ["They never see the event.", "Events are not real.", "They all have the same view."], "A person's worldview influences how they tell the past."),
  q(3, "Which question helps you judge a historical source?", "Who made it, when, and why?", ["What colour is the paper?", "How long is it?", "Is it famous?"], "Knowing who created a source and why helps you decide how to use it."),
  q(3, "Both Renaissance Italy and Tokugawa Japan had cities that grew rich. What does this show?", "Different societies can develop trade and the arts in different ways.", ["Every society is the same.", "Only Europe had cities.", "Only Japan had art."], "Comparing societies reveals both similarities and differences."),
  q(3, "A museum shows Mexica objects and uses the name 'Nahua' as well as 'Aztec'. Why?", "Using names people use for themselves is more respectful and accurate.", ["Names do not matter.", "To confuse visitors.", "To hide the history."], "Naming peoples carefully shows respect."),
  q(3, "Why do historians avoid saying one civilization was simply 'better' than another?", "Societies have different values and circumstances, so judging them by one standard can be unfair.", ["Because all history is false.", "Because only dates matter.", "Because they cannot read."], "Understanding how people saw their world helps explain their choices."),
];

export const units: Unit[] = [
  {
    id: "japan-land-values-ab",
    title: "Japan: Land, Beliefs & Values",
    emoji: "🗾",
    blurb: "Islands, mountains and the ideas that shaped Japan",
    standards: ab("8.1", "Japan's geography, and the beliefs and values (Shinto, Buddhism, Confucian ideas) that shaped its worldview"),
    parentNote: "Japan's islands and mountains, its farming and fishing, and the Shinto, Buddhist and Confucian ideas that helped shape how people lived and what they valued.",
    generate: partsPlus({ items: JAPAN_LAND }),
  },
  {
    id: "japan-tokugawa-ab",
    title: "Tokugawa Japan & Isolation",
    emoji: "🏯",
    blurb: "Shoguns, samurai and a country that closed its doors",
    standards: ab("8.1", "the Tokugawa shogunate, the feudal class system, and Japan's policy of isolation"),
    parentNote: "How Japan was ruled by shoguns for about 250 years, how its class system worked, why the government limited contact with other countries, and what life in Edo was like.",
    generate: partsPlus({ items: TOKUGAWA, orders: [TOKUGAWA_ORDER] }),
  },
  {
    id: "japan-meiji-ab",
    title: "From Isolation to Adaptation",
    emoji: "🚆",
    blurb: "Perry, the Meiji Restoration and a changing Japan",
    standards: ab("8.1", "the end of isolation, the Meiji Restoration and how Japan adapted to new influences"),
    parentNote: "How American ships arrived in 1853, how Japan opened to the world, and how the Meiji government built railways, schools and industry while keeping parts of its own culture.",
    generate: partsPlus({ items: MEIJI, sorts: [PERIOD_SORT] }),
  },
  {
    id: "renaissance-origins-ab",
    title: "Where the Renaissance Began",
    emoji: "🏛️",
    blurb: "Italian city-states, wealth, patrons and humanism",
    standards: ab("8.2", "the origins of the Renaissance in Italy and the ideas of humanism and individualism"),
    parentNote: "Why Italian city-states such as Florence became centres of wealth and learning, what patrons and humanists did, and how the Renaissance worldview differed from the Middle Ages.",
    generate: partsPlus({ items: RENAISSANCE }),
  },
  {
    id: "renaissance-art-ideas-ab",
    title: "Renaissance Art, Printing & Science",
    emoji: "🎨",
    blurb: "Leonardo, Michelangelo, Gutenberg and Galileo",
    standards: ab("8.2", "Renaissance art and architecture, the printing press and the new scientific thinking"),
    parentNote: "Famous Renaissance artists and builders, how the printing press spread ideas, and how astronomers and scientists began to test old ideas with observation.",
    generate: partsPlus({ items: RENAISSANCE_ART, orders: [RENAISSANCE_ORDER] }),
  },
  {
    id: "aztec-empire-ab",
    title: "The Mexica & Tenochtitlan",
    emoji: "🌽",
    blurb: "A great city on a lake and the people who built it",
    standards: ab("8.3", "the Mexica (Aztec) society, the city of Tenochtitlan, farming, trade, tribute and government"),
    parentNote: "How the Mexica built Tenochtitlan on an island in Lake Texcoco, grew food on chinampas, traded and collected tribute, and how Nahua peoples and the Nahuatl language continue today.",
    generate: partsPlus({ items: AZTEC }),
  },
  {
    id: "spain-worldview-ab",
    title: "Spain & the Age of Exploration",
    emoji: "⛵",
    blurb: "Why Spanish explorers crossed the Atlantic",
    standards: ab("8.3", "the Spanish worldview and motives for exploration, and the Columbian Exchange"),
    parentNote: "What motivated Spain's rulers and explorers (faith, wealth and glory), the technology they brought, and how plants, animals and diseases crossed the Atlantic in both directions.",
    generate: partsPlus({ items: SPAIN, sorts: [EXCHANGE_SORT] }),
  },
  {
    id: "conquest-contact-ab",
    title: "Contact & Conquest in Mexico",
    emoji: "🛡️",
    blurb: "Cortés, allies, disease and the fall of Tenochtitlan",
    standards: ab("8.3", "the arrival of the Spanish, alliances, disease, the fall of Tenochtitlan, and the lasting effects of the conflict"),
    parentNote: "How the Spanish and many Indigenous allies came into conflict with the Mexica between 1519 and 1521, why the outcome had several causes, and how Nahua peoples and culture continue today.",
    generate: partsPlus({ items: CONQUEST, orders: [CONQUEST_ORDER] }),
  },
  {
    id: "worldviews-skills-ab",
    title: "Worldviews & Historical Sources",
    emoji: "🧭",
    blurb: "Comparing perspectives and judging sources",
    standards: ab("8.1; 8.2; 8.3", "comparing worldviews and perspectives, adaptation and isolation, and using primary and secondary sources"),
    parentNote: "What a worldview is, how to tell primary from secondary sources, and how to read a source for point of view. Applies to all three Grade 8 case studies: Japan, Renaissance Europe and the Spanish and Mexica.",
    generate: partsPlus({ items: WORLDVIEWS }),
  },
];
