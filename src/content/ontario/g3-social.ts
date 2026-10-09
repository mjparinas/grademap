import type { SortSet } from "../bank";
import { pick, randInt, sample, shuffle, textChoice, numberChoice } from "../random";
import type { Question, Unit, Visual } from "../types";
import { bankUnit, hq, order, q, type Item } from "./g3-4-kit";
import { on } from "./kit";

// Ontario Grade 3 Social Studies (2023): Communities in Canada, 1780–1850, and Living and Working in
// Ontario. First Nations, Métis and Inuit communities are described as distinct, living peoples; the
// deeper Indigenous expectations are not written here and need review with partners.

// ---------- Life in Canada, then and now ----------

const THEN_NOW_SORT: SortSet = {
  prompt: "Was this part of daily life around 1800, or is it part of life today? Tap an item, then tap its basket.",
  hint: "Around 1800 there was no electricity or running water in homes. Light switches, taps and tablets are part of life today.",
  bins: [
    { id: "then", label: "around 1800", emoji: "🕯️" },
    { id: "now", label: "today", emoji: "💡" },
  ],
  items: [
    { label: "light from a candle", emoji: "🕯️", bin: "then" },
    { label: "carrying water from a well", emoji: "🪣", bin: "then" },
    { label: "travelling by canoe or horse", emoji: "🛶", bin: "then" },
    { label: "writing with a quill pen", emoji: "🪶", bin: "then" },
    { label: "flipping a light switch", emoji: "💡", bin: "now" },
    { label: "water from a tap", emoji: "🚰", bin: "now" },
    { label: "riding a school bus", emoji: "🚌", bin: "now" },
    { label: "using a tablet", emoji: "📱", bin: "now" },
  ],
};

const LIFE: Item[] = [
  q("Which light source did most families use at night around 1800?", "candles and oil lamps", ["LED bulbs", "flashlights", "television screens"], "There was no electricity in homes yet.", "🕯️"),
  q("How did most settler families get water around 1800?", "from wells, rivers and streams", ["from a tap in the kitchen", "from bottles delivered by truck", "from pipes under a city"], "There was no running water in houses.", "🪣"),
  q("How did most people travel between towns in Upper Canada around 1830?", "by walking, by horse or by boat", ["by airplane", "by subway", "by electric car"], "Roads were rough, so many people travelled by water when they could.", "🐴"),
  q("Many settler families in Upper Canada built their first homes from…", "logs from the forest nearby", ["glass and steel", "concrete blocks", "plastic panels"], "Settlers cleared trees and used the logs to build log cabins.", "🛖"),
  q("Which chore might a farm child have had around 1800?", "carrying water and gathering firewood", ["charging a tablet", "ordering groceries online", "riding a school bus"], "Children helped their families with daily work.", "🪵"),
  q("Many First Nations, Métis and Inuit children learned skills by…", "watching and helping family members and Elders, and listening to stories", ["only reading textbooks", "watching videos", "using computers"], "Learning from family and Elders was, and is, important in many Indigenous communities.", "📖"),
  q("What was a Red River cart?", "a wooden cart used by the Métis to carry goods", ["a kind of canoe", "a train car", "a sled with runners"], "The Métis used these carts for hunts and trade across the Prairies.", "🛒"),
  q("Michif is a language that is still spoken today. It mixes…", "Cree and French", ["English and German", "Latin and Greek", "Spanish and Italian"], "Michif was developed by the Métis, who have both First Nations and European ancestors.", "🗣️"),
  q("In winter, some Inuit families in parts of the Arctic built houses from…", "snow", ["logs", "bricks", "glass"], "Snow houses, called iglus, were built by some Inuit communities for winter hunting trips. Different Inuit regions had different homes.", "❄️"),
  q("Around 1800, most people in Canada lived…", "on farms and in small settlements", ["in tall apartment towers", "in cities of over a million people", "on boats only"], "There were very few large cities.", "🌾"),
  q("Canada's two official languages are…", "English and French", ["English and German", "French and Spanish", "Cree and English only"], "Canada is a bilingual country. Many other languages are spoken too.", "🍁"),
  q("Which three groups of Indigenous peoples are named in Canada's Constitution?", "First Nations, Métis and Inuit", ["Loyalists, habitants and voyageurs", "Settlers, traders and sailors", "Upper, Lower and Middle"], "Each group has its own cultures, languages and histories.", "🇨🇦"),
  q("Multiculturalism means that…", "people from many cultures live together in Canada and share their ways of life", ["everyone must do the same things", "only one language is allowed", "no new people can come"], "Canada is home to people from all over the world.", "🌍"),
  q("How did families keep food from spoiling around 1800?", "by salting, drying and storing it in cold cellars", ["in an electric fridge", "in a plastic freezer bag", "with a vending machine"], "There were no refrigerators.", "🧂"),
  q("Many settlers made their clothing from…", "wool and linen cloth spun and woven at home", ["nylon", "polyester fleece", "rubber"], "Cloth was made by hand in many homes.", "🧶"),
  q("Compared to today, many children in 1800…", "worked on the farm and did not go to school every day", ["went to school every day on a bus", "spent all day on screens", "never helped at home"], "Children's work was important to their families.", "🌾"),
  hq("Different First Nations lived in different ways around 1800. Why?", "they lived on different lands and had different cultures", ["they all lived in exactly the same way", "none of them used the land", "they all spoke the same language"], "There are many First Nations, each with its own languages, traditions and homelands.", "🗺️"),
  hq("Why is it wrong to say that all Indigenous people lived the same way?", "First Nations, Métis and Inuit have many nations with their own languages and cultures", ["because they lived in only one place", "because they had no languages", "because they all moved to cities"], "Each nation and community is different.", "🪶"),
  hq("Around 1800, what jobs did most women and girls on a farm help with?", "cooking, gardening, spinning and making clothes", ["driving trucks", "working in offices", "working in factories with electricity"], "Many women also worked in the fields, but these chores were very common.", "👩‍🌾"),
  hq("Which of these is a key part of Canada's identity today?", "religious freedom", ["having only one culture", "one official religion", "no languages"], "People in Canada are free to follow their own beliefs.", "🏛️"),
];

// ---------- Who lived where ----------

const UPPER_LOWER_SORT: SortSet = {
  prompt: "Was this place in Upper Canada or Lower Canada? Tap an item, then tap its basket.",
  hint: "Upper Canada was in what is now southern Ontario. Lower Canada was in what is now southern Quebec.",
  bins: [
    { id: "upper", label: "Upper Canada (Ontario)", emoji: "🍁" },
    { id: "lower", label: "Lower Canada (Quebec)", emoji: "⚜️" },
  ],
  items: [
    { label: "Kingston", emoji: "🏰", bin: "upper" },
    { label: "York (now Toronto)", emoji: "🏙️", bin: "upper" },
    { label: "Bytown (now Ottawa)", emoji: "🏛️", bin: "upper" },
    { label: "London", emoji: "🌳", bin: "upper" },
    { label: "Quebec City", emoji: "🏰", bin: "lower" },
    { label: "Montreal", emoji: "⛰️", bin: "lower" },
    { label: "Trois-Rivières", emoji: "🌊", bin: "lower" },
    { label: "Sorel", emoji: "⚓", bin: "lower" },
  ],
};

const EARLY_ORDER = order("Put these in order from earliest to latest.", "Loyalists moved north in the 1780s. Upper and Lower Canada were created in 1791. Bytown was founded in 1826. The Elgin Settlement began in 1849.", [
  ["Loyalists move north", "🧳"],
  ["Upper and Lower Canada are created", "🗺️"],
  ["Bytown is founded", "🏗️"],
  ["The Elgin Settlement begins", "🏡"],
]);

const SETTLERS: Item[] = [
  q("In 1791, what is now southern Ontario became part of…", "Upper Canada", ["Lower Canada", "Nova Scotia", "Newfoundland"], "The colony of Quebec was divided into Upper Canada and Lower Canada in 1791.", "🗺️"),
  q("Lower Canada was mostly in what is now southern…", "Quebec", ["Ontario", "Manitoba", "Nunavut"], "Lower Canada was along the lower part of the St. Lawrence River.", "⚜️"),
  q("Who were the Loyalists?", "people who stayed loyal to Britain during the American Revolution", ["people who fought against Britain", "Inuit hunters", "sailors on fur trade ships"], "Many Loyalists moved north into what is now Canada.", "🧳"),
  q("French settlers along the St. Lawrence River had long, narrow farms. Why?", "so each family could reach the river", ["so they could be far from the water", "because the farms were all round", "so they could grow only trees"], "The river was the main road for travel and trade.", "🌊"),
  q("What were French farmers in Lower Canada called?", "habitants", ["voyageurs", "Loyalists", "refugees"], "Habitants were farmers. Voyageurs paddled canoes in the fur trade.", "🌾"),
  q("The Elgin Settlement at Buxton, Ontario, was started by…", "Black families who had escaped slavery in the United States, and others who supported them", ["British soldiers", "fur traders", "sailors from France"], "Buxton became a free Black community in Upper Canada in the late 1840s. Its descendants still live in the area.", "🏡"),
  q("Bytown was built for workers on the…", "Rideau Canal", ["St. Lawrence Seaway", "Trans-Canada Highway", "Welland Canal"], "Bytown later became the city of Ottawa.", "🏗️"),
  q("The city of Toronto was first called…", "York", ["Kingston", "Bytown", "Buxton"], "York became Toronto in 1834.", "🏙️"),
  q("The Six Nations of the Grand River is a Haudenosaunee community. It is in what is now…", "southern Ontario", ["British Columbia", "Nunavut", "Nova Scotia"], "Many Haudenosaunee families made their homes along the Grand River from 1784 on. It is still a vibrant community today.", "🏘️"),
  q("Many settlements grew up beside lakes and rivers. Why?", "water was used for travel, trade and fresh water", ["there were no trees there", "people did not want to travel", "rivers were quiet"], "Boats and canoes were often faster than walking.", "🛶"),
  q("A trading post was a place where…", "people traded furs for goods like metal tools and cloth", ["people only slept", "ships were built", "children went to school"], "Trading posts were set up along trade routes.", "🏪"),
  q("The Métis are a people who have…", "their own culture, language and history", ["no history", "only English traditions", "no communities"], "The Métis Nation grew out of the fur trade. Many Métis families lived along rivers and the Great Lakes.", "🪶"),
  q("The name Nova Scotia means…", "New Scotland", ["New France", "New England", "New Spain"], "Many Scots settled in Nova Scotia in the 1770s and after.", "🏴"),
  q("What did voyageurs do in the fur trade?", "paddled canoes carrying furs and goods", ["built log cabins", "ran general stores", "ran farms"], "Voyageurs paddled for many hours a day.", "🛶"),
  q("A seigneurie was…", "a large piece of land managed by a landowner called a seigneur", ["a type of canoe", "a school", "a trading post"], "Many French settlers farmed land in seigneuries along the St. Lawrence.", "🌾"),
  hq("After the American Revolution, where did some Haudenosaunee families who had supported Britain make new homes?", "along the Grand River and the Bay of Quinte", ["on Vancouver Island", "in the Arctic", "on the Prairies"], "Both communities exist today, at Six Nations of the Grand River and Tyendinaga.", "🏘️"),
  hq("Why did the government give land grants to Loyalists?", "to help them settle and to reward them", ["to build the Rideau Canal", "to end the fur trade", "to stop trade with Britain"], "A land grant is land given to a person or group.", "📜"),
  hq("Being forced to leave your home is called…", "displacement", ["migration of birds", "trade", "recreation"], "Many First Nations were forced to move as settlers took over their land.", "🧳"),
  hq("Why were trading posts often built on rivers and lakes?", "traders travelled by canoe along these routes", ["no one used rivers", "furs grew by the water", "ships could not reach them"], "Trade routes followed waterways.", "🛶"),
  hq("Settlers cleared forests to farm. What effect did this have on First Nations hunting grounds?", "there was less forest for animals and hunting", ["there was more forest", "nothing changed", "hunting got easier"], "Settlement changed the land.", "🌲"),
];

// ---------- Challenges and how people met them ----------

const CHALLENGE_SORT: SortSet = {
  prompt: "Is it a challenge or a way people met a challenge? Tap an item, then tap its basket.",
  hint: "A challenge is a problem. Working together, building roads and storing food are ways people met them.",
  bins: [
    { id: "challenge", label: "a challenge", emoji: "⚠️" },
    { id: "solution", label: "a way to meet it", emoji: "🤝" },
  ],
  items: [
    { label: "long, cold winters", emoji: "❄️", bin: "challenge" },
    { label: "no doctor nearby", emoji: "🩺", bin: "challenge" },
    { label: "forests to clear before farming", emoji: "🌲", bin: "challenge" },
    { label: "neighbours living far away", emoji: "🏡", bin: "challenge" },
    { label: "neighbours holding a barn raising", emoji: "🏚️", bin: "solution" },
    { label: "storing food in a root cellar", emoji: "🥔", bin: "solution" },
    { label: "building roads and canals", emoji: "🛣️", bin: "solution" },
    { label: "trading for goods at a trading post", emoji: "🏪", bin: "solution" },
  ],
};

const CHALLENGES: Item[] = [
  q("What does 'isolation' mean?", "being far away from other people", ["being very noisy", "having lots of friends", "being rich"], "Some rural settlements were many kilometres from the nearest town.", "🏡"),
  q("What does 'hardship' mean?", "a time of great difficulty", ["a kind of soup", "a rule at school", "a fast boat"], "Many people faced hardship in the early 1800s.", "💪"),
  q("What is a settler?", "a person who moves to a new place to live", ["a fur trader only", "a ship", "a tool"], "Settlers came to Canada from many countries.", "🧳"),
  q("What is a treaty?", "a formal agreement between nations or groups", ["a type of boat", "a type of food", "a school subject"], "Treaties are agreements about how people will live together and share land.", "📜"),
  q("What is a land grant?", "land given to a person or a group", ["a kind of map", "a loan of money", "a house"], "The government gave land grants to some settlers.", "📜"),
  q("What is an enslaved person?", "someone who is owned by another person and not free", ["someone on holiday", "a farmer", "a sailor"], "Slavery existed in parts of North America. Many people escaped to freedom in Canada.", "⛓️"),
  q("What is a refugee?", "a person who has to leave their country to find safety", ["a person who loves to travel", "a rich traveller", "a fur trader"], "Many refugees came to Canada looking for a safe home.", "🧳"),
  q("Why were doctors hard to find in early settlements?", "settlements were far apart and there were few doctors", ["everybody was healthy", "doctors did not exist", "there were doctors on every street"], "People used home remedies, midwives and healers.", "🩺"),
  q("A barn raising was a time when…", "neighbours gathered to build a barn together", ["children took a test", "people sailed across the ocean", "traders swapped furs"], "Working together made big jobs possible.", "🏚️"),
  q("Which is a primary source about life in 1830?", "a letter written by a farmer in 1835", ["a textbook written this year", "a movie made last year", "a website written last month"], "A primary source is made by someone who was there at the time.", "✉️"),
  q("Which is a secondary source about life in 1830?", "a book written today about settlers", ["a diary from 1830", "a tool used in 1830", "a letter from 1830"], "A secondary source tells about the past, but was made later.", "📘"),
  q("Which question can you investigate in social studies?", "How did families keep warm in winter in 1830?", ["Which colour is nicest?", "What will the weather be in 2090?", "Is pizza tastier than soup?"], "A good inquiry question can be answered with evidence.", "❓"),
  q("A thematic map shows…", "one topic, like where forests or settlements were", ["only the weather today", "only road names", "pictures of people"], "Thematic maps focus on one theme.", "🗺️"),
  q("Many newcomers survived their first winters because First Nations neighbours shared knowledge. This is an example of…", "cooperation", ["conflict", "boredom", "weather"], "Sharing knowledge of the land helped many newcomers.", "🤝"),
  q("Why was a root cellar useful?", "it kept food cool so it lasted through winter", ["it kept food hot", "it made food disappear", "it was a kind of road"], "Cellars under the ground stay cool.", "🥔"),
  hq("As settlers cleared land for farms, many First Nations lost access to hunting and gathering places. This was a major…", "challenge for those communities", ["benefit for those communities", "type of food", "kind of map"], "Settlement changed the land that people depended on.", "🌲"),
  hq("An oral history is…", "the memories and stories told by people, passed on by speaking", ["a map", "a kind of tool", "a legal agreement"], "Many Indigenous communities share history through oral stories.", "🗣️"),
  hq("Which tools help you see how a community changed over time?", "timelines and maps", ["only photographs of food", "only music", "only weather reports"], "Timelines show order and maps show where things happened.", "🗓️"),
  hq("To learn about a challenge, which is the best plan?", "use several sources and check that they agree", ["trust the first thing you read", "only ask one friend", "guess"], "Good evidence comes from many sources.", "🔍"),
  hq("Why did many settlers' towns grow near rivers and lakes even though winters were hard?", "water gave them transportation, power for mills and fresh water", ["the water was warm all year", "rivers kept snow away", "the land was flat everywhere"], "Rivers were roads and also powered mills.", "🌊"),
];

// ---------- Treaties and relationships ----------

const COOP_SORT: SortSet = {
  prompt: "Was it cooperation or conflict? Tap an item, then tap its basket.",
  hint: "Cooperation is working together. Conflict is a disagreement or fight.",
  bins: [
    { id: "coop", label: "cooperation", emoji: "🤝" },
    { id: "conflict", label: "conflict", emoji: "⚔️" },
  ],
  items: [
    { label: "trading furs for tools", emoji: "🦫", bin: "coop" },
    { label: "settlers learning to grow corn from Indigenous farmers", emoji: "🌽", bin: "coop" },
    { label: "neighbours holding a barn raising", emoji: "🏚️", bin: "coop" },
    { label: "signing a treaty to share land", emoji: "📜", bin: "coop" },
    { label: "the War of 1812", emoji: "⚔️", bin: "conflict" },
    { label: "disagreements over land and hunting grounds", emoji: "🗺️", bin: "conflict" },
    { label: "fur trading companies competing", emoji: "🛶", bin: "conflict" },
    { label: "settlers cutting down forests used for hunting", emoji: "🪓", bin: "conflict" },
  ],
};

const TREATIES: Item[] = [
  q("A treaty is…", "a formal agreement between nations or groups", ["a type of canoe", "a kind of song", "a place to trade"], "Treaties describe how people will live together and use land.", "📜"),
  q("Wampum belts are made of…", "shell beads", ["gold coins", "feathers", "paper"], "Beads were strung or woven into belts to record agreements.", "📿"),
  q("Why were wampum belts made?", "to record and remember agreements", ["to be worn for sports", "to tie up boats", "to use as money in stores today"], "Wampum belts helped people remember promises.", "📿"),
  q("In the Two Row Wampum tradition, what do the two purple rows stand for?", "two peoples travelling side by side in their own vessels", ["two rivers that never meet", "two roads to a city", "two fences around a farm"], "The Haudenosaunee canoe and the European ship travel side by side without steering each other's vessel.", "🛶"),
  q("How many nations are in the Haudenosaunee Confederacy today?", "six", ["two", "ten", "twenty"], "The Mohawk, Oneida, Onondaga, Cayuga, Seneca and Tuscarora nations.", "🪶"),
  q("Who was Tecumseh?", "a Shawnee leader who worked with the British in the War of 1812", ["a fur trader", "a Loyalist farmer", "a ship captain"], "Tecumseh tried to unite Indigenous nations to protect their lands.", "🪶"),
  q("In the War of 1812, many First Nations people fought as…", "allies of the British", ["settlers", "Loyalists", "sailors on trade ships"], "Several First Nations fought alongside British soldiers to protect their homelands.", "⚔️"),
  q("An ally is…", "a person or group who joins with you for a shared goal", ["an enemy", "a stranger", "a tool"], "Allies help each other.", "🤝"),
  q("Treaties are still important today because…", "governments and First Nations are still expected to keep their promises", ["they are only history", "they are no longer used", "they were for sports"], "Many treaties are still in effect and are talked about every day.", "📜"),
  q("The Robinson Treaties were signed in 1850 between the Crown and Anishinaabe leaders. They are about…", "land and resources north of Lakes Huron and Superior", ["Atlantic fishing rights", "the Arctic", "railways in Quebec"], "These treaties still matter to the Anishinaabe communities in the region today.", "📜"),
  q("Which describes the relationship between traders and First Nations in the fur trade?", "they often traded and worked together", ["they never met", "they never traded", "they only fought"], "Trade was a key relationship, even though there was also conflict.", "🦫"),
  q("Why would a nation want an ally?", "to help defend and support each other", ["to make the winters shorter", "to speak a new language", "to stop travel"], "Allies share risks and help.", "🤝"),
  q("Was the relationship between settlers and Indigenous peoples always the same?", "no, there was both cooperation and conflict", ["yes, always friendly", "yes, always fighting", "there was no relationship"], "Relationships changed over time and in different places.", "⚖️"),
  hq("'Nation-to-nation' agreements are agreements…", "between peoples who each govern themselves", ["between two shops", "between two cities only", "between two schools"], "Treaties were made between nations.", "🏛️"),
  hq("The Two Row Wampum is about respect. What does it say about how the two peoples should live?", "side by side without interfering with each other", ["one should lead the other", "they should become one people", "they should stop travelling"], "The rows do not touch.", "📿"),
  hq("Why do many First Nations today still talk about treaty promises?", "treaties are agreements that are meant to last", ["because treaties ended long ago", "because treaties were jokes", "because treaties were about sports"], "Treaties are living agreements for many communities.", "🌿"),
  hq("The War of 1812 was fought mostly between…", "Britain (with allies) and the United States", ["France and Spain", "Canada and Mexico", "Quebec and Ontario"], "Many First Nations, settlers and soldiers were affected.", "⚔️"),
  hq("A good question to ask about a treaty is…", "Who made it, and what did each side promise?", ["What colour was it?", "What was its favourite food?", "How tall was it?"], "Good inquiry questions focus on who, what and why.", "❓"),
  hq("Why can a map help us understand a treaty?", "it can show the land the treaty is about", ["it shows what people ate", "it shows the weather", "it is a song"], "Maps connect agreements to places.", "🗺️"),
];

// ---------- Regions of Ontario ----------

const REGION_SORT: SortSet = {
  prompt: "Which landform region is it? Tap an item, then tap its basket.",
  hint: "The Canadian Shield is rocky with many lakes. The Great Lakes–St. Lawrence Lowlands have farmland and big cities. The Hudson Bay Lowlands are flat and wet.",
  bins: [
    { id: "shield", label: "Canadian Shield", emoji: "🪨" },
    { id: "lowlands", label: "Great Lakes–St. Lawrence Lowlands", emoji: "🌾" },
    { id: "hudson", label: "Hudson Bay Lowlands", emoji: "🦆" },
  ],
  items: [
    { label: "rocky hills and thousands of lakes", emoji: "🪨", bin: "shield" },
    { label: "mining towns like Sudbury", emoji: "⛏️", bin: "shield" },
    { label: "fertile farmland and orchards", emoji: "🍑", bin: "lowlands" },
    { label: "big cities and factories", emoji: "🏙️", bin: "lowlands" },
    { label: "flat, wet land with muskeg", emoji: "🌫️", bin: "hudson" },
    { label: "few roads and few people", emoji: "🛤️", bin: "hudson" },
  ],
};

const ON_REGIONS: Item[] = [
  q("Which Great Lake does Ontario NOT touch?", "Lake Michigan", ["Lake Superior", "Lake Huron", "Lake Erie"], "Ontario borders Lakes Superior, Huron, Erie and Ontario.", "🌊"),
  q("What is the capital city of Ontario?", "Toronto", ["Ottawa", "Kingston", "Hamilton"], "Ottawa is the capital of Canada.", "🏙️"),
  q("What is the capital city of Canada?", "Ottawa", ["Toronto", "Montreal", "Quebec City"], "Ottawa is in Ontario.", "🏛️"),
  q("Which landform region covers most of northern and central Ontario?", "the Canadian Shield", ["the Great Lakes–St. Lawrence Lowlands", "the Hudson Bay Lowlands", "the Prairies"], "The Shield is a huge area of old rock, forests and lakes.", "🪨"),
  q("Which region has most of Ontario's farmland and big cities?", "the Great Lakes–St. Lawrence Lowlands", ["the Canadian Shield", "the Hudson Bay Lowlands", "the Arctic"], "This southern region has warm summers and fertile soil.", "🌾"),
  q("Which region is flat, wet and next to Hudson Bay and James Bay?", "the Hudson Bay Lowlands", ["the Great Lakes–St. Lawrence Lowlands", "the Canadian Shield", "the Rockies"], "It has few people and a lot of wetland.", "🦆"),
  q("Why do most people in Ontario live in the south?", "it has warmer weather, good farmland, and cities near the Great Lakes", ["there are no winters in the north", "the north has no land", "the south is made of rock"], "People live where jobs and farmland are.", "🏙️"),
  q("Sudbury is known for mining nickel. Which landform region is Sudbury in?", "the Canadian Shield", ["the Hudson Bay Lowlands", "the Great Lakes–St. Lawrence Lowlands", "the Appalachians"], "The Shield has many minerals.", "⛏️"),
  q("Niagara Falls is on the Niagara River, which flows between which two Great Lakes?", "Lake Erie and Lake Ontario", ["Lake Huron and Lake Superior", "Lake Superior and Lake Erie", "Lake Huron and Lake Ontario"], "Water flows from Lake Erie over the falls into Lake Ontario.", "💦"),
  q("Which local government services are usually provided by a town or city?", "garbage pickup, water and fire protection", ["making the weather", "growing the food", "choosing the seasons"], "Local governments provide services close to home.", "🚒"),
  q("Ontario is divided into entities such as…", "cities, towns, townships, villages and counties", ["oceans and islands", "continents", "planets"], "These are municipal regions. First Nations communities and Métis regions are also part of Ontario.", "🗺️"),
  q("Who leads many First Nations communities?", "a chief and council", ["a mayor only", "a premier", "a king"], "Each community has its own government and ways of choosing leaders.", "🏘️"),
  q("On a political map, a city name like 'Hamilton' is usually written in…", "lowercase letters with a capital at the start", ["boldface capitals", "tiny numbers", "red ink only"], "Bigger places like countries get bigger, bolder letters.", "🗺️"),
  q("A political map shows…", "borders between countries, provinces and cities", ["the height of mountains only", "the weather today", "the local bus routes only"], "Political maps show boundaries and names.", "🗺️"),
  hq("Why can't farmers grow lots of food on much of the Canadian Shield?", "there is only thin soil over rock", ["the soil is too deep", "there is no sunlight", "there is no rain"], "Rocky land is hard to farm.", "🪨"),
  hq("Moose Factory and Moosonee are near James Bay. Which region are they in?", "the Hudson Bay Lowlands", ["the Great Lakes–St. Lawrence Lowlands", "the Canadian Shield", "the Prairies"], "The region is flat and very far north.", "🧭"),
  hq("The Hudson Bay Lowlands are wet, flat and have few people. What does this mean?", "the land is hard to build roads and farms on", ["it is a good place for skyscrapers", "it is a desert", "it is hotter than Toronto"], "Wet ground is hard to build on.", "🌫️"),
  hq("Which statement best describes the Great Lakes–St. Lawrence Lowlands?", "flat or gently rolling land with fertile soil and many cities", ["rocky and covered by lakes", "wet and swampy", "frozen all year"], "This region supports farms and cities.", "🌾"),
  hq("The Great Lakes are important because they…", "provide fresh water, shipping routes and places to play", ["are salty", "are used as farmland", "are made of rock"], "Many cities were built on the lakes.", "🚢"),
];

// ---------- Land use and jobs ----------

const LAND_USE_SORT: SortSet = {
  prompt: "How is the land used? Tap an item, then tap its basket.",
  hint: "Fields and orchards are farming. Houses and apartments are housing. Parks and trails are recreation.",
  bins: [
    { id: "farm", label: "farming", emoji: "🌾" },
    { id: "housing", label: "housing", emoji: "🏘️" },
    { id: "rec", label: "recreation", emoji: "🌳" },
  ],
  items: [
    { label: "wheat field", emoji: "🌾", bin: "farm" },
    { label: "apple orchard", emoji: "🍎", bin: "farm" },
    { label: "cattle pasture", emoji: "🐄", bin: "farm" },
    { label: "apartment buildings", emoji: "🏢", bin: "housing" },
    { label: "row of townhouses", emoji: "🏘️", bin: "housing" },
    { label: "neighbourhood of houses", emoji: "🏠", bin: "housing" },
    { label: "city park", emoji: "🌳", bin: "rec" },
    { label: "hiking trail", emoji: "🥾", bin: "rec" },
    { label: "playground", emoji: "🛝", bin: "rec" },
  ],
};

const PLACES_TABLE: Visual = {
  type: "table",
  title: "People in three Ontario communities",
  headers: ["Community", "People", "Main job"],
  rows: [
    ["Pinecrest", 800, "forestry"],
    ["Lakeview", 25000, "tourism and shops"],
    ["Brookfield", 120000, "factories and offices"],
  ],
};

const LAND_USE: Item[] = [
  q("A town on a big lake has a port. Why is a lake a good place for a port?", "ships can carry goods in and out", ["lakes have no waves", "lakes are made of land", "ships cannot use water"], "Ports are on the water so ships can load and unload.", "🚢"),
  q("Where is farming most likely?", "on flat land with fertile soil", ["on bare rock", "on a steep cliff", "on a frozen lake"], "Crops need good soil and flat fields.", "🌾"),
  q("Sudbury grew up as a mining town because the land there has…", "rich minerals like nickel and copper", ["lots of palm trees", "warm oceans", "volcanoes"], "Jobs often follow natural resources.", "⛏️"),
  q("Which job depends on forests?", "a forester or logger", ["a ferry captain", "a dairy farmer", "a baker"], "Forests give wood for lumber and paper.", "🌲"),
  q("Which job is part of tourism?", "a tour guide at Niagara Falls", ["a miner", "a grain farmer", "a trucker for a factory"], "Tourism is about visitors and the places they enjoy.", "💦"),
  q("Which job is part of manufacturing?", "building cars in a factory", ["picking apples", "teaching school", "guiding canoe trips"], "Manufacturing means making things from materials.", "🚗"),
  q("A big city usually has more of which thing than a village?", "roads, tall buildings and stores", ["farm fields", "wild forests", "lakes"], "More people means more roads and buildings.", "🏙️"),
  q("Which land use mainly meets a human need?", "farmland that grows food", ["a movie theatre", "a water park", "a golf course"], "We need food every day.", "🌾"),
  q("A conservation area is land that is…", "protected so nature can stay healthy", ["covered in pavement", "used for mining", "used to build a mall"], "Conservation areas protect plants, animals and water.", "🌲"),
  q("Which of these is a kind of land use for transportation?", "highways and railways", ["farms", "parks", "forests"], "Roads and tracks move people and goods.", "🛤️"),
  q("Some First Nations communities in Ontario run their own businesses, such as…", "tourism lodges and forestry companies", ["theme parks on the Moon", "ocean cruise ships", "volcanoes"], "Each community decides what is best for it.", "🏞️"),
  q("A farm is often near a city because…", "people in the city need food", ["farms cannot grow food", "cities have no markets", "people don't eat"], "Farms supply food to nearby communities.", "🥕"),
  hq("Why is land close to a port and a railway good for factories?", "goods can be moved in and out easily", ["there are no workers", "trees grow there", "the land is wet"], "Transportation links help industries.", "🏭"),
  hq("Which community probably has the most roads, stores and offices?", "Brookfield", ["Pinecrest", "Lakeview"], "Brookfield is the largest.", "🏙️", PLACES_TABLE),
  hq("What is the main job in Pinecrest?", "forestry", ["tourism and shops", "factories and offices"], "Read the table.", "🌲", PLACES_TABLE),
  hq("Which community is the smallest?", "Pinecrest", ["Lakeview", "Brookfield"], "Look at the number of people.", "👥", PLACES_TABLE),
  hq("Why might Lakeview have jobs in tourism?", "it probably has a lake that visitors enjoy", ["it is in the middle of a desert", "it has no water", "it has no people"], "Natural features can draw visitors.", "🏖️"),
  hq("Farm land can also be built on. This is a trade-off between…", "growing food and building new homes", ["music and art", "summer and winter", "red and blue"], "People must choose how to use land.", "⚖️"),
  hq("Land is used for housing, farming, industry and recreation. These are all…", "types of land use", ["types of weather", "types of animals", "types of rocks"], "People use land in many ways.", "🗺️"),
];

// ---------- Land, resources and the environment ----------

const ENV_SORT: SortSet = {
  prompt: "Does it help the environment or harm it? Tap an item, then tap its basket.",
  hint: "Planting trees, recycling and using public transit help. Dumping and clearing without replanting harm.",
  bins: [
    { id: "help", label: "helps", emoji: "💚" },
    { id: "harm", label: "harms", emoji: "⚠️" },
  ],
  items: [
    { label: "replanting trees after logging", emoji: "🌳", bin: "help" },
    { label: "taking public transit", emoji: "🚌", bin: "help" },
    { label: "restoring a wetland", emoji: "🦆", bin: "help" },
    { label: "recycling paper", emoji: "♻️", bin: "help" },
    { label: "clearing a forest with no replanting", emoji: "🪓", bin: "harm" },
    { label: "dumping waste in a river", emoji: "🗑️", bin: "harm" },
    { label: "leaving litter in a park", emoji: "🍬", bin: "harm" },
    { label: "leaving a mine site bare after it closes", emoji: "⛏️", bin: "harm" },
  ],
};

const FOREST_TABLE = (a: number, b: number, c: number): Visual => ({
  type: "table",
  title: "Forest area near a town (hectares)",
  headers: ["Year", "Forest area"],
  rows: [
    ["1990", a],
    ["2000", b],
    ["2010", c],
  ],
});

const ENVIRONMENT: Item[] = [
  q("Stewardship means…", "taking care of land and water for the future", ["selling all the land", "building as fast as possible", "using up all the trees"], "A steward looks after something.", "🌿"),
  q("Deforestation is…", "cutting down large areas of forest", ["planting trees", "building a campsite", "a type of flower"], "Forests are home to many animals.", "🪓"),
  q("Planting new trees after logging is called…", "reforestation", ["deforestation", "pollution", "erosion"], "Re- means again. It is planting forests again.", "🌳"),
  q("Rehabilitation of a mine site means…", "cleaning and restoring the land after mining", ["opening a new mine", "digging deeper", "building a mall"], "Companies must repair the land when a mine closes.", "⛏️"),
  q("How does public transit help the environment?", "fewer cars on the road means less pollution", ["buses make more smoke than trains", "it uses no energy", "it puts more cars on the road"], "A bus can carry many people at once.", "🚌"),
  q("A quarry digs up gravel and stone. One effect on the environment is…", "noise, dust and the loss of habitat", ["more forest", "cleaner air", "more flowers"], "Quarries must be restored afterward.", "🪨"),
  q("Which action reduces your ecological footprint?", "walking or biking to school", ["leaving the lights on all day", "driving short trips", "throwing away food"], "Your footprint is the effect you have on the Earth.", "🚲"),
  q("Why do trees in a city matter?", "they clean the air, give shade and are homes for animals", ["they make traffic worse", "they create noise", "they cause pollution"], "Urban trees help people too.", "🌳"),
  q("In Sudbury, a regreening program planted millions of trees. What was the goal?", "to restore land damaged by mining and smelting", ["to build a mall", "to dig more mines", "to cut down the forest"], "Regreening helped the land recover.", "🌲"),
  q("Ontario's Greenbelt is a protected area. Why was it created?", "to protect farmland and natural areas from being built on", ["to build more highways", "to move cities", "to make lakes"], "The Greenbelt surrounds a very busy part of southern Ontario.", "🌿"),
  q("To learn how a lake has changed over 50 years, which could you use?", "old photographs and talking with Elders or long-time residents", ["guessing", "only a map from today", "a song"], "Oral histories and photos are good evidence.", "📸"),
  q("A town wants jobs from a new mine, and neighbours worry about clean water. This shows different…", "perspectives", ["seasons", "maps", "numbers"], "People can care about different things.", "👥"),
  q("Too much fertilizer on farm fields can wash into rivers. What can it harm?", "life in the water", ["the sky", "the Moon", "mountains"], "Extra nutrients can make algae grow too much.", "🧪"),
  q("A table shows the forest area near a town going down each decade. This is a…", "downward trend", ["upward trend", "flat trend", "map"], "Read the numbers across the years.", "📉", FOREST_TABLE(500, 420, 350)),
  q("Look at the forest area table. Which year had the most forest?", "1990", ["2000", "2010"], "Find the biggest number.", "🌲", FOREST_TABLE(500, 430, 360)),
  hq("A thematic map of a region shows where its forests, farms and towns are. Why can this help planners?", "they can see how land is used and where to protect nature", ["they can see the weather next year", "it shows people's names", "it shows prices"], "A thematic map shows one topic at a time.", "🗺️"),
  hq("Why is it important to ask questions about the long-term effects of land use?", "some effects show up many years later", ["there are never any effects", "only short-term effects matter", "land never changes"], "Some effects take a long time.", "⏳"),
  hq("Which is a measure that industries can use to reduce pollution?", "installing filters on smokestacks", ["burning more", "dumping more waste", "using more energy"], "Filters clean air before it leaves.", "🏭"),
  hq("Why might a community choose to protect a wetland instead of draining it?", "wetlands clean water and shelter many species", ["wetlands are always dry", "wetlands are the best place for roads", "wetlands have no plants"], "Wetlands are important habitats.", "🦆"),
  hq("Municipalities, First Nations and conservation authorities all work to protect…", "land, water and wildlife", ["only parking lots", "only roads", "only malls"], "Many groups share in caring for the land.", "🤝"),
];

// ---------- Reading maps ----------

/** A 3 × 3 map with letter columns and number rows, like the grids on real maps. */
const FEATURES = [
  ["library", "📚"],
  ["school", "🏫"],
  ["arena", "🏒"],
  ["museum", "🏛️"],
  ["pond", "🦆"],
  ["farm", "🚜"],
  ["lighthouse", "🗼"],
  ["campground", "⛺"],
  ["market", "🧺"],
  ["train station", "🚉"],
  ["dock", "⚓"],
  ["fire hall", "🚒"],
] as const;

function gridMap() {
  const features = sample([...FEATURES], 9);
  const cols = ["A", "B", "C"];
  const visual: Visual = {
    type: "table",
    title: "Map of Lakeside (north is at the top)",
    headers: ["", "A", "B", "C"],
    rows: [1, 2, 3].map((row) => [String(row), ...cols.map((_, c) => `${features[(row - 1) * 3 + c][1]} ${features[(row - 1) * 3 + c][0]}`)]),
  };
  return { features, cols, visual };
}

function gridFind(): Question {
  const { features, cols, visual } = gridMap();
  const index = randInt(0, 8);
  const target = features[index];
  const square = `${cols[index % 3]}${Math.floor(index / 3) + 1}`;
  const squares = shuffle(features.map((_, i) => `${cols[i % 3]}${Math.floor(i / 3) + 1}`).filter((s) => s !== square)).slice(0, 3);
  return textChoice(`Look at the map. Which square is the ${target[0]} in?`, square, squares, "Read the letter along the top and the number down the side.", visual);
}

function gridWhat(): Question {
  const { features, cols, visual } = gridMap();
  const index = randInt(0, 8);
  const square = `${cols[index % 3]}${Math.floor(index / 3) + 1}`;
  const wrong = shuffle(features.filter((_, i) => i !== index)).slice(0, 3).map((f) => ({ label: f[0], emoji: f[1] }));
  return textChoice(`Look at the map. What is in square ${square}?`, { label: features[index][0], emoji: features[index][1] }, wrong, "Find the letter, then the number.", visual);
}

function scaleQuestion(): Question {
  const per = pick([5, 10, 20]);
  const cm = randInt(2, 8);
  return numberChoice(
    `On a map, 1 cm stands for ${per} km. Two towns are ${cm} cm apart on the map. How far apart are they really, in kilometres?`,
    per * cm,
    `Multiply: ${cm} × ${per}. A map scale tells you how far real distance is for each centimetre.`,
    undefined,
    { min: per, max: per * 10, suffix: " km" },
  );
}

const MAP_BANK: Item[] = [
  q("What does a map legend (or key) show?", "what the map's symbols mean", ["who drew the map", "the date today", "the weather"], "A legend explains symbols, like a tent for a campground.", "🗺️"),
  q("What does a compass rose show?", "the directions north, south, east and west", ["where roses grow", "the scale", "the title"], "It points the way.", "🧭"),
  q("On most maps, north is at the…", "top", ["bottom", "left side", "right side"], "Check the compass rose.", "🧭"),
  q("The title of a map tells you…", "what the map is about", ["how far it is", "who owns it", "what time it is"], "Titles name the map's topic.", "🗺️"),
  q("A map scale helps you figure out…", "real distances", ["the weather", "the names of animals", "the date"], "One centimetre on the map stands for a real distance.", "📏"),
  q("Which direction is between north and east?", "northeast", ["southwest", "northwest", "southeast"], "Intermediate directions mix two cardinal directions.", "🧭"),
  q("Which direction is directly opposite north?", "south", ["east", "west", "northeast"], "North and south are opposite.", "🧭"),
  q("A map that uses colours to show where forests, farms and cities are is a…", "thematic map", ["globe", "diary", "timeline"], "Thematic maps focus on one topic.", "🗺️"),
  q("On a population map, darker colours near the Great Lakes mean…", "more people live there", ["fewer people live there", "no one lives there", "it is cold there"], "Population maps use colour to show how many people live in an area.", "👥"),
  q("Which symbol would usually mean a campground on a map legend?", "a tent", ["a plane", "a ship", "a hospital cross"], "Legends use simple pictures.", "⛺"),
  q("To find your way on a city map, you can use…", "a grid with letters and numbers", ["the colours of the clouds", "the names of fish", "your age"], "Grids let you name a square, like B2.", "🔤"),
  q("On a map, a blue area is most likely a…", "lake or river", ["mountain", "desert", "city"], "Blue usually shows water.", "💧"),
  hq("Southwest is between which two directions?", "south and west", ["north and east", "north and west", "south and east"], "Intermediate directions are in between.", "🧭"),
  hq("Why do map makers put a scale on a map?", "so you can measure real distances", ["to decorate it", "to show the time", "to hide places"], "The scale connects map length to real length.", "📏"),
  hq("Why is it a good idea to check the legend before you read a map?", "symbols can mean different things on different maps", ["because legends always say the same thing", "because maps have no symbols", "to see the date"], "Always read the legend first.", "🔍"),
  hq("Which tool would help you see the whole Earth with correct shapes and sizes of land?", "a globe", ["a ruler", "a calendar", "a graph"], "A globe is a model of the Earth.", "🌍"),
  hq("Which map would be the best to plan a bike route across your town?", "a street map", ["a map of the world", "a map of the planets", "a map of oceans"], "Pick a map that shows enough detail.", "🚲"),
];

export const units: Unit[] = [
  {
    id: "life-1780",
    title: "Life Then & Now",
    emoji: "🕯️",
    blurb: "How people lived in Canada around 1780–1850",
    standards: on("A1.1–A1.4, A3.6", "everyday life in communities in Canada from 1780 to 1850 compared with today, and parts of Canadian identity today"),
    parentNote: "How people lived about 200 years ago (homes, light, water, travel, food, chores and school), how it differed among First Nations, Métis, Inuit and settler communities, and what is part of identity in Canada today: two official languages, multiculturalism and religious freedom.",
    generate: bankUnit(LIFE, { sorts: [THEN_NOW_SORT] }),
  },
  {
    id: "settlers-3",
    title: "Communities of the Early 1800s",
    emoji: "🛶",
    blurb: "Who lived where, and why",
    standards: on("A3.1, A3.2, A3.3, A3.5", "First Nations, Métis and settler communities in Upper and Lower Canada and what shaped where they grew"),
    parentNote: "Upper and Lower Canada, Loyalist, French, Irish, Scottish and Black settler communities, First Nations such as the Six Nations of the Grand River, Métis communities, the fur trade, and why settlements grew up on rivers and lakes.",
    generate: bankUnit(SETTLERS, { sorts: [UPPER_LOWER_SORT], orders: [EARLY_ORDER] }),
  },
  {
    id: "challenges-3",
    title: "Challenges & Solutions",
    emoji: "🏚️",
    blurb: "Hardships, teamwork and history detective skills",
    standards: on("A2.1–A2.6, A3.4", "challenges faced by communities from 1780 to 1850 and how people met them, with inquiry skills and vocabulary"),
    parentNote: "Isolation, long winters, few doctors and loss of land, and how neighbours and communities responded. Also builds history detective skills: primary and secondary sources, good questions, maps, timelines and key words like settler, treaty and refugee.",
    generate: bankUnit(CHALLENGES, { sorts: [CHALLENGE_SORT] }),
  },
  {
    id: "treaties-3",
    title: "Treaties & Allies",
    emoji: "📿",
    blurb: "Agreements, wampum and working together",
    standards: on("A3.7, A3.8", "treaties and wampum belts, and cooperation and conflict between communities"),
    parentNote: "What treaties and wampum belts are (including the Two Row Wampum), allies in the War of 1812, and how communities cooperated and sometimes came into conflict. Reviewed with care for First Nations perspectives; deeper treaty content is not covered.",
    generate: bankUnit(TREATIES, { sorts: [COOP_SORT] }),
  },
  {
    id: "regions-on",
    title: "Regions of Ontario",
    emoji: "🌎",
    blurb: "Landform regions, cities and local governments",
    standards: on("B3.1, B3.2, B3.3", "Ontario's municipal regions, political maps, and its landform regions"),
    parentNote: "Ontario's three main landform regions (the Canadian Shield, the Great Lakes–St. Lawrence Lowlands and the Hudson Bay Lowlands), the Great Lakes, cities, towns, First Nations and Métis regions, and what local governments do.",
    generate: bankUnit(ON_REGIONS, { sorts: [REGION_SORT] }),
  },
  {
    id: "land-use-3",
    title: "Land Use & Jobs",
    emoji: "🚜",
    blurb: "How land is used and the work people do",
    standards: on("B1.1–B1.3, B3.4–B3.6", "how landforms and resources shape land use and jobs in Ontario communities"),
    parentNote: "Farming, housing, industry, recreation, transportation and conservation, how natural features lead to ports, farms and mines, jobs in different communities, and comparing land use in small and large places.",
    generate: bankUnit(LAND_USE, { sorts: [LAND_USE_SORT] }),
  },
  {
    id: "land-impact-3",
    title: "Land & the Environment",
    emoji: "🌳",
    blurb: "How using land affects nature, and what helps",
    standards: on("B2.1–B2.6", "the environmental effects of land and resource use in Ontario and measures to reduce harm"),
    parentNote: "How logging, mining, farming and cities affect the environment, ways to reduce harm (reforestation, rehabilitation, public transit, protecting wetlands and the Greenbelt), reading data and maps, and thinking about different perspectives.",
    generate: bankUnit(ENVIRONMENT, { sorts: [ENV_SORT] }),
  },
  {
    id: "maps-on",
    title: "Map Skills",
    emoji: "🧭",
    blurb: "Legends, grids, directions and scale",
    standards: on("B1.3, B2.3, B3.2, B3.7", "reading and making maps: legends, grids, directions and scale"),
    parentNote: "Using a legend, compass rose, number and letter grid and scale, reading population and thematic maps, and telling intermediate directions such as northeast.",
    generate: bankUnit(MAP_BANK, { makers: [() => gridFind(), () => gridWhat(), () => scaleQuestion()] }),
  },
];
