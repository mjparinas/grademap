import type { SortSet } from "../bank";
import type { Unit } from "../types";
import { bankUnit, hq, q, type Item } from "../ontario/g3-4-kit";
import { sk } from "./kit";

// Saskatchewan Grade 4 Social Studies: Saskatchewan, its people, land, treaties, governments and resources.
// Written for the Saskatchewan outcomes IN4.1–RW4.3. First Nations and Métis content is kept to widely
// shared facts and needs review with First Nations and Métis partners before launch.

// ---------- People of Saskatchewan ----------

const PEOPLE_SORT: SortSet = {
  prompt: "Is it a provincial symbol of Saskatchewan? Tap an item, then tap its basket.",
  hint: "The sharp-tailed grouse, the western red lily and the white birch are symbols of Saskatchewan.",
  bins: [
    { id: "symbol", label: "a symbol of Saskatchewan", emoji: "🍁" },
    { id: "not", label: "not a symbol", emoji: "❌" },
  ],
  items: [
    { label: "western red lily", emoji: "🌺", bin: "symbol" },
    { label: "sharp-tailed grouse", emoji: "🐦", bin: "symbol" },
    { label: "white birch", emoji: "🌳", bin: "symbol" },
    { label: "white-tailed deer", emoji: "🦌", bin: "symbol" },
    { label: "polar bear", emoji: "🐻‍❄️", bin: "not" },
    { label: "palm tree", emoji: "🌴", bin: "not" },
    { label: "camel", emoji: "🐪", bin: "not" },
    { label: "cactus", emoji: "🌵", bin: "not" },
  ],
};

const PEOPLE: Item[] = [
  q("What is the capital city of Saskatchewan?", "Regina", ["Saskatoon", "Moose Jaw", "Prince Albert"], "The Legislative Building, where the provincial government meets, is in Regina.", "🏛️"),
  q("The name Saskatchewan comes from a Cree word that means…", "swift-flowing river", ["wheat field", "land of the sky", "big lake"], "The Cree name for the river was kisiskâciwanisîpiy, which became “Saskatchewan”.", "🏞️"),
  q("In what year did Saskatchewan become a province of Canada?", "1905", ["1867", "1945", "1999"], "Saskatchewan and Alberta both became provinces in 1905.", "📅"),
  q("Which of these is a First Nation whose homeland includes parts of Saskatchewan?", "Cree", ["Mi'kmaq", "Haida", "Inuit"], "Cree, Dene, Saulteaux, Nakota and Dakota Nations are among those with homelands in Saskatchewan.", "🪶"),
  q("Which of these is another First Nations people of Saskatchewan?", "Dene", ["Haudenosaunee", "Tlingit", "Beothuk"], "The Dene live mainly in northern Saskatchewan.", "🌲"),
  q("The Métis are…", "a distinct Indigenous people with their own culture and history", ["the first settlers from Europe", "visitors from another country", "a kind of farm"], "Métis culture grew from the families of First Nations and European fur traders, and it is its own culture.", "🎻"),
  q("What is the name of the Métis language?", "Michif", ["Latin", "Spanish", "Cree only"], "Michif combines Cree and French and is spoken by some Métis people today.", "🗣️"),
  q("Which Métis item is a bright, woven belt worn with pride?", "the Métis sash", ["a snowshoe", "a toque", "a canoe paddle"], "The sash is a symbol of Métis identity.", "🧣"),
  q("Which kind of music and dance is an important part of Métis culture?", "fiddling and jigging", ["opera", "ballet", "marching band"], "Fiddle music and jigging are part of many Métis celebrations.", "🎻"),
  q("First Nations and Métis people are…", "still shaping Saskatchewan today", ["only part of the past", "visitors", "no longer living here"], "First Nations and Métis communities, leaders, artists, farmers and businesses are part of Saskatchewan now.", "🌟"),
  q("Many families came to farm in Saskatchewan in the late 1800s and early 1900s. Where did some of them come from?", "Ukraine, Germany, Scandinavia and the British Isles", ["only the same town", "outer space", "the ocean floor"], "People came from many countries because land was offered for farming.", "🚂"),
  q("Why did so many settlers come to the prairies about 120 years ago?", "to farm land that was offered to them", ["to look for beaches", "to build skyscrapers", "to find a volcano"], "The government offered 160 acres of land for a small fee, and railways brought people west.", "🌾"),
  q("What is the motto on Saskatchewan's coat of arms?", "From many peoples, strength", ["Wheat for all", "First in the nation", "Land of living skies"], "The motto celebrates the many peoples who live here.", "🤝"),
  q("Today, people have moved to Saskatchewan from many places. Which is one example?", "the Philippines", ["the Moon", "Antarctica", "no one has moved here"], "Newcomers from places such as the Philippines, India, China and Africa have joined communities across the province.", "🌍"),
  q("What is Saskatchewan's provincial flower?", "western red lily", ["rose", "tulip", "sunflower"], "The western red lily is the province's floral emblem.", "🌺"),
  q("Which person led the first government in Canada to bring in medicare, and is a famous Saskatchewan leader?", "Tommy Douglas", ["Terry Fox", "Louis Riel", "Wayne Gretzky"], "Tommy Douglas was premier of Saskatchewan. His government helped lead the way to medicare for all of Canada.", "🏥"),
  q("What did Saskatchewan do that later spread across Canada?", "it began public health insurance", ["it invented hockey", "it built the first airport", "it started the Olympics"], "Saskatchewan introduced hospital insurance in 1947 and medical care insurance in 1962. Other provinces followed.", "🩺"),
  q("Saskatchewan's nickname is the “Land of Living…”", "Skies", ["Lakes", "Mountains", "Cities"], "The wide prairie sky is so big that it is on the licence plates.", "🌅"),
  q("What is the largest city in Saskatchewan?", "Saskatoon", ["Regina", "Swift Current", "Yorkton"], "Saskatoon sits on the South Saskatchewan River.", "🌉"),
  q("A community festival has bannock, perogies, jigging and bagpipes. What does this show?", "many cultures live in the community", ["everyone has the same culture", "festivals are not important", "only one group is welcome"], "Different foods and music show the many cultures that came together in Saskatchewan.", "🎉"),
  hq("What is one way that First Nations and Métis people have shaped Saskatchewan?", "through their languages, place names and communities", ["they have not shaped it", "by building the railway alone", "only by moving away"], "Many place names, including Saskatchewan and Saskatoon, come from First Nations languages.", "🗺️"),
  hq("The Cree word for the berry that gave Saskatoon its name is misâskwatômina. What does this show?", "place names can come from First Nations languages", ["Cree is no longer spoken", "the city was named after a car", "the name was made up last year"], "Saskatoon is named for the saskatoon berry, a name from Cree.", "🫐"),
  hq("Why is Batoche an important place to many Métis people?", "it is a historic Métis community on the South Saskatchewan River", ["it is a big airport", "it is a farm machine museum", "it is a mine"], "Batoche National Historic Site tells the story of the Métis and the events of 1885.", "🏞️"),
  hq("Why does Saskatchewan's motto, “From many peoples, strength”, fit the province?", "people from many cultures have built it together", ["because everyone looks the same", "because the people are all strong in sports", "because the motto is old"], "Strong communities include everyone.", "🤝"),
  hq("Tommy Douglas's idea of medicare was that…", "health care should be paid for by everyone together, not just by the sick person", ["only rich people should get care", "doctors should work for free", "hospitals should close"], "Public health insurance means people get care when they need it.", "💙"),
  hq("Which describes the influence of a Saskatchewan program on the rest of Canada?", "medicare began in Saskatchewan and spread across the country", ["wheat farming started in Saskatchewan and ended there", "hockey began in Saskatchewan and ended there", "nothing from Saskatchewan has spread"], "Saskatchewan's health insurance became a model for the rest of the country.", "🏥"),
];

// ---------- The land ----------

const LAND_SORT: SortSet = {
  prompt: "Which part of Saskatchewan has it? Tap an item, then tap its basket.",
  hint: "The south is mostly prairie and farmland. The north has more forest, lakes and rock.",
  bins: [
    { id: "south", label: "mostly in the south", emoji: "🌾" },
    { id: "north", label: "mostly in the north", emoji: "🌲" },
  ],
  items: [
    { label: "wheat fields", emoji: "🌾", bin: "south" },
    { label: "grain elevators", emoji: "🏚️", bin: "south" },
    { label: "grassland and prairie", emoji: "🌿", bin: "south" },
    { label: "cattle ranches", emoji: "🐄", bin: "south" },
    { label: "boreal forest", emoji: "🌲", bin: "north" },
    { label: "thousands of lakes", emoji: "🛶", bin: "north" },
    { label: "rock of the Canadian Shield", emoji: "🪨", bin: "north" },
    { label: "Athabasca Sand Dunes", emoji: "🏜️", bin: "north" },
  ],
};

const LAND: Item[] = [
  q("What is the southern part of Saskatchewan mostly like?", "flat to rolling prairie and farmland", ["jungle", "tall mountains", "ocean coast"], "The prairie is wide, open and good for growing crops.", "🌾"),
  q("What covers much of northern Saskatchewan?", "forest, lakes and rock", ["desert", "tall cities", "coral reefs"], "The boreal forest and the Canadian Shield cover the north.", "🌲"),
  q("Which river gives the province its name?", "the Saskatchewan River", ["the Fraser River", "the St. Lawrence River", "the Rhine River"], "The North and South Saskatchewan Rivers join and flow east.", "🌊"),
  q("Why did many early towns and farms start near rivers and lakes?", "people needed water", ["rivers are boring", "there were no roads", "to avoid fish"], "Water is a need for people, animals and crops.", "💧"),
  q("Which animal did Plains Cree and other First Nations depend on for food, clothing and shelter?", "the bison", ["the kangaroo", "the penguin", "the elephant"], "Bison provided meat, hides for tipis and clothing, and bones for tools.", "🦬"),
  q("What happened to the bison herds in the 1880s?", "they nearly disappeared", ["they doubled in size", "they moved to the sea", "they learned to fly"], "Overhunting nearly ended the herds. This changed life for the people who depended on them.", "📉"),
  q("A homestead was…", "land a settler could farm and own after living on it", ["a type of tractor", "a school", "a kind of boat"], "Homesteaders received a quarter section, which is 160 acres, for a small fee.", "🏡"),
  q("Why did towns grow up along the railway lines?", "trains brought people and took grain to market", ["trains were quiet", "no one liked roads", "trains grew crops"], "A grain elevator and a station often marked a new town.", "🚂"),
  q("What did many early settlers build for houses because trees were scarce on the prairie?", "sod houses", ["glass towers", "igloos", "bamboo huts"], "Blocks of prairie sod (soil held by grass roots) made thick walls.", "🏠"),
  q("What is a shelterbelt?", "rows of trees planted to slow the wind and protect soil", ["a belt for tools", "a type of tent", "a kind of fence for goats"], "Shelterbelts help protect crops, farmyards and soil from strong winds.", "🌳"),
  q("What is a dugout?", "a hole dug to collect water on a farm", ["a type of canoe", "a baseball bench", "a cellar for wheat only"], "Dugouts store rain and snowmelt for animals and gardens.", "💧"),
  q("What does a farmer worry about during a drought?", "not enough rain for crops to grow", ["too many clouds of snow", "too many rainbows", "too many trees"], "A drought is a long period with very little rain.", "☀️"),
  q("Which is a weather challenge on the prairies?", "very cold winters and blizzards", ["hurricanes", "monsoons", "tsunamis"], "Prairie winters can be cold and windy, so people plan carefully.", "❄️"),
  q("Which national park in southern Saskatchewan protects a large area of native prairie?", "Grasslands National Park", ["Banff National Park", "Jasper National Park", "Gros Morne National Park"], "Grasslands National Park is in the south and protects the native prairie.", "🌿"),
  q("Which northern Saskatchewan feature is a rare area of sand dunes?", "the Athabasca Sand Dunes", ["the Rocky Mountains", "Niagara Falls", "the Bay of Fundy"], "These dunes are found near Lake Athabasca.", "🏜️"),
  q("How do many First Nations and Métis people describe their relationship with the land?", "as caring for it and being connected to it", ["as owning it to sell", "as having no connection", "as something to ignore"], "Many First Nations and Métis people see themselves as caretakers of the land, with stories, languages and ways of life connected to it.", "💚"),
  q("A farmer leaves last year's stalks on the field and plants through them with no tilling. What does this help?", "protect the soil and save moisture", ["make the soil blow away", "make the crop smaller", "melt the snow"], "No-till farming keeps the soil in place and holds water.", "🚜"),
  q("What is a good way for people to deal with long, cold winters?", "wear layers and heat their homes well", ["wear shorts", "stay outside all night", "ignore the weather"], "People plan and use technology to stay safe in cold weather.", "🧥"),
  q("Lake Diefenbaker was created by building a dam. What is one reason for it?", "to store water for farms, towns and power", ["to hold ice cream", "to hide a city", "to stop the wind"], "The Gardiner Dam holds back the South Saskatchewan River.", "⚡"),
  q("Why did buildings in the early 1900s often have thick walls and small windows?", "to keep warm in winter", ["to keep out birds", "for looks only", "to stay cool in a jungle"], "Insulation helped keep heat in during the cold months.", "🏠"),
  q("The Qu'Appelle Valley is…", "a wide river valley in southern Saskatchewan", ["a mountain range", "an ocean bay", "a desert"], "The valley was carved by water long ago, and many communities and lakes are found there.", "🏞️"),
  hq("How did the land affect where people settled in Saskatchewan?", "most settled in the south where the soil is good for farming", ["most settled on bare rock", "most settled in swamps only", "the land did not matter"], "The deep prairie soil is good for farming, so more people settled there.", "🌾"),
  hq("Why do many northern communities in Saskatchewan rely on fishing, trapping and forestry?", "the north has lakes and forest", ["the north has no water", "the north has only deserts", "the north has no animals"], "The boreal forest and lakes shape the work and food of northern communities.", "🎣"),
  hq("Which is a strategy people use to meet the challenge of dry years?", "irrigation and water storage", ["planting at night", "painting the soil", "building bigger roofs"], "Irrigation brings water to crops, and dugouts store water.", "💦"),
  hq("Why did the loss of the bison affect First Nations and Métis people so much?", "they depended on bison for food, clothing, shelter and trade", ["bison were only pets", "bison made roads", "bison were used for toys only"], "Losing the herds changed their ways of life.", "🦬"),
  hq("A farm family lives far from a town. Which technology helps them stay connected?", "satellite internet and cell service", ["carrier pigeons only", "smoke signals only", "a time machine"], "New technology helps people on the prairies reach friends, schools and clinics.", "📡"),
];

// ---------- Treaties ----------

const TREATIES: Item[] = [
  q("A treaty is…", "an agreement made between nations", ["a type of crop", "a school rule", "a kind of tent"], "Treaties in Saskatchewan are agreements between First Nations and the Crown.", "📜"),
  q("How many numbered treaties cover Saskatchewan?", "six", ["one", "three", "twelve"], "Treaties 2, 4, 5, 6, 8 and 10 cover parts of Saskatchewan.", "6️⃣"),
  q("Which of these is one of the numbered treaties covering Saskatchewan?", "Treaty 6", ["Treaty 1", "Treaty 3", "Treaty 7"], "Treaties 2, 4, 5, 6, 8 and 10 cover Saskatchewan.", "📜"),
  q("Treaty 6 was made in 1876. At which place was it first signed?", "Fort Carlton", ["Halifax", "Victoria", "Toronto"], "Treaty 6 was signed at Fort Carlton and later at Fort Pitt.", "🏰"),
  q("Treaty 4 was made at Fort Qu'Appelle. In what year?", "1874", ["1774", "1905", "1965"], "Treaty 4 covers much of southern Saskatchewan.", "📅"),
  q("Who made treaties with each other?", "First Nations and the Crown (Canada)", ["farmers and wheat", "the Métis and the moon", "towns and trees"], "The Crown's representatives negotiated treaties with First Nations leaders.", "🤝"),
  q("What does it mean to say “We are all Treaty people”?", "everyone who lives here has a part in the treaty relationship", ["only some people live here", "treaties are only for the past", "treaties are only for one group"], "Treaties involve First Nations people and all other people who live on treaty land.", "🌎"),
  q("Many First Nations people say treaties were made to last…", "as long as the sun shines, the grass grows and the rivers flow", ["for one year", "until the next election", "for only ten days"], "The words show that treaties were meant to be lasting promises.", "☀️"),
  q("How are treaties understood by many First Nations?", "through oral history shared by Elders as well as the written text", ["only through newspapers", "only through comic books", "they are not understood"], "Elders carry the oral history of what was agreed.", "🗣️"),
  q("What is a reserve?", "land set aside for the use of a First Nation", ["a type of cow", "a hotel", "a hockey team"], "Reserves were created through treaties and are home to First Nations communities.", "🏡"),
  q("What is an annuity under the numbered treaties?", "a yearly payment to each treaty member", ["a type of wheat", "a river", "a food"], "Treaty annuities were a promise of a small yearly payment.", "💵"),
  q("What did Treaty 6 promise to help in times of sickness?", "a medicine chest", ["a library", "a bus", "a theatre"], "The “medicine chest” promise is still discussed in connection with health care.", "💊"),
  q("What did the treaties also promise?", "schools, tools and farm supplies", ["gold coins for everyone", "a ride on a rocket", "free hockey tickets"], "Different treaties included promises about schools and help with farming.", "🏫"),
  q("Why do treaties matter today?", "they are still promises that both sides are meant to keep", ["they ended long ago", "they are only stories", "they were never made"], "Treaty rights and responsibilities continue.", "⚖️"),
  q("Treaty Education in Saskatchewan helps students…", "learn about treaties and the people who made them", ["learn how to build a barn", "learn about space", "learn about dinosaurs only"], "Treaty Education is part of the curriculum for all students in Saskatchewan.", "📚"),
  q("A First Nation chooses its own leaders. What is the leader of a First Nation often called?", "Chief", ["Mayor of a city only", "Premier", "Governor General"], "Many First Nations are led by a chief and council.", "🪶"),
  q("Which statement shows a good way to learn about treaties?", "listen to Elders, read, and ask respectful questions", ["guess and tell others", "avoid the topic", "make jokes about it"], "Respectful learning begins with listening.", "👂"),
  q("Where can you often see a sign about which treaty land you are on?", "on a school or community land acknowledgement", ["only on a bus", "on a candy wrapper", "on a hat"], "Land acknowledgements remind people of the treaty land they live and learn on.", "🪧"),
  q("Which of these is a treaty promise to First Nations?", "to share the land in a respectful way", ["to take all the land", "to end all farming", "to move everyone away"], "Treaties were about sharing and living together.", "🤲"),
  q("Why should treaty promises be kept?", "promises are important and treaties are agreements", ["because it is quick", "because it is silly", "because they are for decoration"], "Keeping promises builds trust.", "🤝"),
  hq("What was the relationship between the Crown and First Nations meant to be, in the treaties?", "a lasting relationship of respect and sharing", ["a relationship that would end soon", "a game", "no relationship"], "Treaty relationships were meant to last for generations.", "🔗"),
  hq("How do treaties affect people who are not First Nations?", "they live on treaty land and share the responsibilities", ["they do not affect them", "they only affect farmers", "they only affect cities"], "Everyone who lives in Saskatchewan lives on treaty land or the homeland of the Métis.", "🌎"),
  hq("Why do people hold treaty gatherings and ceremonies on anniversaries?", "to remember the agreements and the promises made", ["to sell wheat", "to build fences", "to stop the wind"], "Remembering helps each generation understand the treaties.", "🪶"),
  hq("Why is it important that written treaties and oral history are both respected?", "each carries part of what was agreed and understood", ["only one matters", "neither matters", "oral history is not real"], "Elders' oral histories explain the spirit and intent of the treaties.", "📜"),
];

// ---------- Government ----------

const GOV_SORT: SortSet = {
  prompt: "Which level of government usually looks after it? Tap an item, then tap its basket.",
  hint: "Provinces look after things like health care, schools and highways. Local governments handle streets, garbage and parks.",
  bins: [
    { id: "province", label: "the province", emoji: "🏛️" },
    { id: "local", label: "the town, city or RM", emoji: "🏘️" },
  ],
  items: [
    { label: "health care and hospitals", emoji: "🏥", bin: "province" },
    { label: "highways", emoji: "🛣️", bin: "province" },
    { label: "schools (with school boards)", emoji: "🏫", bin: "province" },
    { label: "provincial parks", emoji: "🏕️", bin: "province" },
    { label: "garbage pick-up", emoji: "🗑️", bin: "local" },
    { label: "local streets and snow clearing", emoji: "🚜", bin: "local" },
    { label: "town recreation centre", emoji: "🏟️", bin: "local" },
    { label: "water for a town", emoji: "🚰", bin: "local" },
  ],
};

const GOVERNMENT: Item[] = [
  q("Where does the provincial government of Saskatchewan meet?", "the Legislative Building in Regina", ["the Parliament Buildings in Ottawa", "the CN Tower", "the Peace Tower"], "The Legislative Assembly meets in Regina.", "🏛️"),
  q("What does MLA stand for?", "Member of the Legislative Assembly", ["Mayor of Local Area", "Main Line Access", "Most Likely Answer"], "An MLA is elected to speak for people in a constituency.", "🗳️"),
  q("Who is the head of the provincial government?", "the Premier", ["the Mayor", "the Prime Minister", "the Chief Justice"], "The Premier leads the government of the province.", "👤"),
  q("People who are 18 or older and are Canadian citizens can…", "vote in elections", ["drive a combine only", "run the weather", "make wheat grow"], "Voting is a way to choose who will speak for you.", "🗳️"),
  q("How often does Saskatchewan hold provincial elections?", "about every four years", ["every day", "every 50 years", "never"], "Saskatchewan has fixed election dates about every four years.", "📆"),
  q("How many MLAs are in the Legislative Assembly of Saskatchewan?", "61", ["6", "16", "161"], "There are 61 constituencies, and each elects one MLA.", "🔢"),
  q("Who represents the King in Saskatchewan?", "the Lieutenant Governor", ["the Mayor", "a school principal", "the Chief of Police"], "The Lieutenant Governor represents the Crown in the province.", "👑"),
  q("What is a rural municipality (RM)?", "a local government for a rural area", ["a type of farm tool", "a type of wheat", "a river"], "Saskatchewan has many RMs that look after roads and services in rural areas.", "🏘️"),
  q("Which is the head of a town or city government?", "the Mayor", ["the Premier", "the Governor General", "the Principal"], "A mayor and a council lead a town or city.", "🏙️"),
  q("What do school boards do?", "make local decisions about schools within provincial rules", ["decide the weather", "grow crops", "make highways"], "Elected school boards look after schools in their divisions.", "🏫"),
  q("Why do we have laws and rules?", "to keep people safe and treat people fairly", ["to make things confusing", "to make life boring", "to hide the sun"], "Governments make laws to help communities work well.", "⚖️"),
  q("A bill is…", "an idea for a new law", ["a bird's beak", "a store receipt", "a type of vote"], "Bills are discussed and voted on in the Legislative Assembly.", "📄"),
  q("What is the group of MLAs who disagree with the government and challenge its decisions called?", "the Opposition", ["the Chiefs", "the Council", "the Jury"], "The Opposition asks questions and suggests changes.", "🗣️"),
  q("Many First Nations in Saskatchewan are led by…", "a chief and council", ["a premier and a senator", "a mayor only", "a king"], "Each First Nation chooses its leaders, and many also follow traditional ways of governing.", "🪶"),
  q("What group speaks for many First Nations in Saskatchewan on shared issues?", "the Federation of Sovereign Indigenous Nations (FSIN)", ["the Roughriders", "the Wheat Pool", "the school board"], "The FSIN represents First Nations in Saskatchewan.", "🤝"),
  q("The Métis people in Saskatchewan are represented by…", "Métis Nation–Saskatchewan", ["the Rotary Club", "the Roughriders", "the Wheat Board"], "Métis Nation–Saskatchewan has elected leaders and represents Métis citizens.", "🧣"),
  q("Why is a clean, safe community a sign of a good government?", "good decisions help people's quality of life", ["governments do not matter", "it is by accident", "cleaning is the only job"], "Services such as health care, schools and roads are part of quality of life.", "🌟"),
  q("If you want to share an idea with your MLA, what can you do?", "write a letter or email, or visit their office", ["shout from home", "send a pigeon", "wait for 10 years"], "Citizens can contact their MLA.", "✉️"),
  q("What is a constituency?", "an area whose voters elect one MLA", ["a type of tractor", "a lake", "a restaurant"], "Saskatchewan is divided into 61 constituencies.", "🗺️"),
  hq("How does the provincial government help the quality of life of people in Saskatchewan?", "by providing services such as health care, schools and roads", ["by changing the weather", "by growing all the food", "by deciding everyone's bedtime"], "Good services help people live well.", "💙"),
  hq("Why do some governments have both a Premier and a Lieutenant Governor?", "one leads the government and the other represents the Crown", ["they do the same job", "one is for farmers only", "one is a mayor"], "The Premier is the head of government. The Lieutenant Governor is the Crown's representative.", "🏛️"),
  hq("Why is it important that different levels of government work together?", "each looks after different needs, and some issues cross levels", ["they should never talk", "they all do the same thing", "it is not important"], "Federal, provincial, First Nations, Métis and local governments cooperate on many issues.", "🤝"),
  hq("Who can speak for Métis citizens in Saskatchewan?", "elected leaders of Métis Nation–Saskatchewan", ["the Premier alone", "a hockey coach", "the Governor General"], "Métis people have their own governance system and elected leaders.", "🧣"),
  hq("An election is a way for citizens to…", "choose who will make decisions for them", ["decide the weather", "avoid all laws", "keep all taxes"], "Voting is a key way to take part in government.", "🗳️"),
];

// ---------- Agriculture and resources ----------

const RESOURCE_SORT: SortSet = {
  prompt: "Does it grow, or is it dug from the ground? Tap an item, then tap its basket.",
  hint: "Crops grow from seeds. Potash, uranium and oil come from underground.",
  bins: [
    { id: "grown", label: "grown on farms", emoji: "🌾" },
    { id: "mined", label: "taken from the ground", emoji: "⛏️" },
  ],
  items: [
    { label: "wheat", emoji: "🌾", bin: "grown" },
    { label: "canola", emoji: "🌼", bin: "grown" },
    { label: "lentils", emoji: "🫘", bin: "grown" },
    { label: "oats", emoji: "🌾", bin: "grown" },
    { label: "potash", emoji: "🪨", bin: "mined" },
    { label: "uranium", emoji: "⚛️", bin: "mined" },
    { label: "oil", emoji: "🛢️", bin: "mined" },
    { label: "natural gas", emoji: "🔥", bin: "mined" },
  ],
};

const RESOURCES: Item[] = [
  q("Which crop is Saskatchewan well known for growing?", "wheat", ["bananas", "coffee", "pineapples"], "Wheat grows well on the prairies and is used for bread and pasta.", "🌾"),
  q("What is canola?", "a crop grown for its oil", ["a kind of fish", "a metal", "a tool"], "Canola was developed in Canada, and its seeds are pressed for cooking oil.", "🌼"),
  q("Saskatchewan grows more of this small, round pulse crop than almost anywhere in the world.", "lentils", ["pumpkins", "kiwis", "mangoes"], "Lentils and peas are pulse crops grown on the prairies.", "🫘"),
  q("What is potash?", "a mineral used in fertilizer", ["a kind of bread", "a type of tree", "a toy"], "Potash helps plants grow. Saskatchewan has some of the largest reserves in the world.", "🪨"),
  q("What is a grain elevator?", "a tall building for storing grain", ["a type of lift in a hotel", "a ride at the fair", "a school"], "Prairie towns were often marked by grain elevators beside the railway.", "🏚️"),
  q("What does a combine do?", "cuts and separates the grain at harvest", ["bakes bread", "digs mines", "plants trees"], "A combine harvester does several jobs at once.", "🚜"),
  q("What is a drought's effect on farming?", "crops may not grow well", ["crops grow taller", "farms flood", "the soil turns to gold"], "Without enough rain, yields are lower.", "☀️"),
  q("Where in Saskatchewan is uranium mined?", "in the north, in the Athabasca Basin", ["on the southern prairie", "under Regina's streets", "in the middle of a lake"], "Uranium mining takes place in northern Saskatchewan.", "⛏️"),
  q("Which resource is pumped from deep underground in southeastern Saskatchewan?", "oil", ["wheat", "water lilies", "maple syrup"], "Oil wells are found in the southeast and southwest of the province.", "🛢️"),
  q("Why does agriculture matter to Saskatchewan?", "it is a big part of the economy and culture", ["it does not matter", "it is just a hobby", "only for the weather"], "Many families farm, and food is sold across Canada and the world.", "🌾"),
  q("Where does much of Saskatchewan's wheat and canola go?", "it is sold around the world", ["it stays in one barn", "it is thrown away", "it is eaten by one family"], "Saskatchewan is a big exporter of crops.", "🌍"),
  q("What is the forest industry in the north?", "cutting and processing trees into products like lumber", ["growing wheat", "making cheese", "building boats only"], "Northern forests supply wood and pulp.", "🌲"),
  q("What is a rancher?", "a person who raises cattle or other livestock", ["a person who drives a train", "a person who mines potash", "a person who builds houses"], "Ranchers care for animals such as beef cattle.", "🐄"),
  q("What tool helps farmers plant seeds in the exact rows with GPS?", "a GPS-guided seeder", ["a spoon", "a kite", "a snow globe"], "Technology lets farmers plant and harvest with great accuracy.", "🛰️"),
  q("The Canadian Light Source in Saskatoon is…", "a large science machine used for research", ["a lighthouse", "a hockey rink", "a farm"], "It is a synchrotron, which makes very bright light that helps scientists study materials.", "🔬"),
  q("Why do farmers rotate crops?", "to keep the soil healthy", ["to make the field spin", "to confuse the birds", "because it is fun"], "Growing different crops helps the soil stay rich.", "🔄"),
  q("What can mines do to the environment if they are not looked after well?", "harm land and water", ["make more trees grow", "stop the wind", "clean the sky"], "Mines are regulated so they protect land, water and wildlife.", "⚠️"),
  q("What is a good way to protect farmland from soil erosion?", "leave stubble on the field and plant shelterbelts", ["remove all plants", "plough the field bare in the wind", "pour sand on it"], "Roots and stubble hold soil in place.", "🌳"),
  q("Potash is mostly used to…", "help crops grow", ["power cars", "make glass", "feed fish"], "Potash is a source of potassium that plants need.", "🌱"),
  q("Which jobs depend on Saskatchewan's resources?", "farming, mining and trucking", ["only dancing", "only fishing in the ocean", "no jobs"], "Many jobs connect to farming and resources.", "💼"),
  hq("Why are Saskatchewan's resources important beyond the province?", "other provinces and countries use the food and minerals", ["no one else uses them", "they are never sold", "they are only for the farm"], "Wheat, canola, potash and uranium are sold to many countries.", "🌍"),
  hq("Why do farmers and scientists test new crop varieties?", "to grow food that withstands dry weather and disease", ["to make food look blue", "because it is a game", "to avoid harvesting"], "Science helps farmers grow more with less water.", "🧪"),
  hq("Which technology helps reduce the damage to soil on a prairie farm?", "zero-till seeding", ["plowing the field twice", "burning the fields", "leaving soil bare in winter"], "Zero-till seeding disturbs the soil very little.", "🚜"),
  hq("What is one way that using resources can have a positive and a negative effect?", "mining brings jobs, but it can affect the land and water", ["mining brings no jobs", "mining always helps the land", "resources do not matter"], "Governments, communities and companies weigh benefits and risks.", "⚖️"),
  hq("Why might a farmer plant drought-resistant crops?", "dry years are a risk on the prairies", ["they like dry soil only", "it saves electricity", "they dislike rain"], "Choosing the right crop helps farmers meet the challenge of weather.", "🌾"),
];

export const units: Unit[] = [
  {
    id: "sk-people",
    title: "People of Saskatchewan",
    emoji: "🌾",
    blurb: "First Nations, Métis and the many cultures here",
    standards: { "ca-sk": sk("IN4.1–IN4.3", "how First Nations and Métis people shape Saskatchewan, where our cultural diversity comes from, and Saskatchewan's influence across Canada") },
    parentNote: "Who has lived in Saskatchewan and still does: First Nations and Métis peoples, newcomers from many countries, symbols of the province, and how a Saskatchewan idea (public health insurance) spread across Canada.",
    generate: bankUnit(PEOPLE, { sorts: [PEOPLE_SORT] }),
  },
  {
    id: "sk-land",
    title: "The Land and Its People",
    emoji: "🌅",
    blurb: "Prairie, forest, rivers and how people live with them",
    standards: { "ca-sk": sk("DR4.1, DR4.2, RW4.1", "how the land shapes where and how people live, how First Nations and Métis people relate to it, and strategies for meeting environmental challenges") },
    parentNote: "Saskatchewan's regions, why people settled where they did, the importance of bison, homesteading, and how people deal with cold, wind and dry years.",
    generate: bankUnit(LAND, { sorts: [LAND_SORT] }),
  },
  {
    id: "sk-treaties",
    title: "Treaties in Saskatchewan",
    emoji: "📜",
    blurb: "Agreements, promises and “We are all Treaty people”",
    standards: { "ca-sk": sk("DR4.3, DR4.2", "the Treaty relationship in Saskatchewan and what it means today") },
    parentNote: "What treaties are, the six numbered treaties that cover Saskatchewan, why oral history matters, and how treaty promises still matter today. This is introductory and needs review with First Nations partners.",
    generate: bankUnit(TREATIES),
  },
  {
    id: "sk-government",
    title: "Governing Saskatchewan",
    emoji: "🏛️",
    blurb: "MLAs, Premiers, councils and First Nations and Métis governments",
    standards: { "ca-sk": sk("PA4.1–PA4.4", "how the provincial government works, how First Nations and Métis governments work, and how governments affect quality of life") },
    parentNote: "The provincial system of government (Premier, MLAs, Lieutenant Governor), local governments, First Nations governance and Métis governance, and how services affect quality of life.",
    generate: bankUnit(GOVERNMENT, { sorts: [GOV_SORT] }),
  },
  {
    id: "sk-resources",
    title: "Farming and Resources",
    emoji: "🚜",
    blurb: "Wheat, canola, potash and more",
    standards: { "ca-sk": sk("RW4.2, RW4.3", "the importance of agriculture to Saskatchewan, and the impact of its resources and new technologies") },
    parentNote: "Crops, ranching, mining, forestry and energy, why agriculture matters to the economy and culture, and how technology and resource use affect people and the environment.",
    generate: bankUnit(RESOURCES, { sorts: [RESOURCE_SORT] }),
  },
];
