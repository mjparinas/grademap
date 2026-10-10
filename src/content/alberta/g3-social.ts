import type { SortSet } from "../bank";
import type { Unit } from "../types";
import { bankUnit, hq, order, q, type Item } from "../ontario/g3-4-kit";
import { ab } from "./kit";

// Alberta Grade 3 social studies: Alberta and the prairies. Indigenous content is light and written in the
// present tense about living communities; it names distinct peoples ("some", "many") and leaves out
// anything sacred. Discrimination is introduced through fairness, respect and standing up for others.
// All of it should be reviewed with Alberta teachers and with First Nations and Métis partners.

// ---------- Alberta's regions and boundaries ----------

const REGION_SORT: SortSet = {
  prompt: "Which part of Alberta is it? Tap an item, then tap its basket.",
  hint: "The Rocky Mountains are in the west. The grasslands are in the south-east. The boreal forest covers much of the north.",
  bins: [
    { id: "mountain", label: "Rocky Mountains", emoji: "🏔️" },
    { id: "boreal", label: "Boreal Forest", emoji: "🌲" },
    { id: "grass", label: "Grasslands", emoji: "🌾" },
  ],
  items: [
    { label: "Banff and Jasper", emoji: "🏔️", bin: "mountain" },
    { label: "tall peaks and glaciers", emoji: "🧊", bin: "mountain" },
    { label: "bighorn sheep on steep slopes", emoji: "🐏", bin: "mountain" },
    { label: "spruce and pine forests with many lakes", emoji: "🌲", bin: "boreal" },
    { label: "Fort McMurray and the far north", emoji: "🛢️", bin: "boreal" },
    { label: "moose and wolves in the trees", emoji: "🫎", bin: "boreal" },
    { label: "wide open fields of wheat", emoji: "🌾", bin: "grass" },
    { label: "dry, warm southern plains", emoji: "☀️", bin: "grass" },
    { label: "prairie grasses and pronghorn", emoji: "🦌", bin: "grass" },
  ],
};

const REGIONS: Item[] = [
  q("What is the capital city of Alberta?", "Edmonton", ["Calgary", "Lethbridge", "Red Deer"], "Edmonton is the capital. Calgary is the biggest city.", "🏛️"),
  q("Which province is west of Alberta?", "British Columbia", ["Saskatchewan", "Manitoba", "Ontario"], "The Rocky Mountains run along much of the border with British Columbia.", "🧭"),
  q("Which province is east of Alberta?", "Saskatchewan", ["British Columbia", "Quebec", "Nova Scotia"], "Saskatchewan is Alberta's neighbour to the east.", "🧭"),
  q("Which territory is north of Alberta?", "the Northwest Territories", ["Nunavut", "Yukon", "Saskatchewan"], "Alberta's northern border is with the Northwest Territories.", "🧭"),
  q("Alberta's southern border is with…", "the state of Montana in the United States", ["Manitoba", "Mexico", "British Columbia"], "The southern border follows the 49th parallel.", "🇺🇸"),
  q("The three Prairie provinces are Alberta, Saskatchewan and…", "Manitoba", ["Ontario", "Quebec", "Nova Scotia"], "These provinces are in the middle of Canada's west.", "🌾"),
  q("The mountains along Alberta's west side are called the…", "Rocky Mountains", ["Appalachians", "Laurentians", "Torngats"], "Banff and Jasper are in the Rockies.", "🏔️"),
  q("Which region is flat and is covered with grass?", "the grasslands", ["the Rocky Mountains", "the boreal forest", "the lakes"], "The southern grasslands are warm and dry.", "🌾"),
  q("Which region is mostly forest, with many lakes and wetlands?", "the boreal forest", ["the grasslands", "the Rocky Mountains", "the badlands"], "Much of northern Alberta is boreal forest.", "🌲"),
  q("The foothills lie between the mountains and the…", "plains", ["ocean", "desert", "city"], "They are the rolling hills at the foot of the Rockies.", "⛰️"),
  q("A political boundary is…", "a line that shows where one province or country ends", ["a hill", "a river", "a kind of road"], "Boundaries are drawn by people on maps.", "🗺️"),
  q("A physical region is…", "an area with its own kind of land and climate", ["a kind of animal", "a city", "a flag"], "Mountains, grasslands and forests are physical regions.", "🏞️"),
  q("Lloydminster is a city on the border between Alberta and…", "Saskatchewan", ["Montana", "British Columbia", "Ontario"], "The city lies in both provinces.", "🏙️"),
  q("Which city is the largest in Alberta?", "Calgary", ["Lethbridge", "Medicine Hat", "Grande Prairie"], "Calgary is the biggest city and Edmonton is the capital.", "🏙️"),
  hq("The Peace River flows through the north. Which region is it in?", "the boreal forest", ["the grasslands", "the Rocky Mountains", "the badlands"], "The Peace River country is in northern Alberta.", "🏞️"),
  hq("Why do different parts of Alberta grow different things?", "each region has its own land, climate and soil", ["all regions are the same", "farmers only plant in the mountains", "rain never falls"], "Grasslands and parkland are good for crops, while mountains are steep and cold.", "🌱"),
  hq("The parkland is a region between the grasslands and the boreal forest. What does it have?", "a mix of trees and open fields", ["only ice", "only sand", "only mountains"], "Edmonton and Red Deer are in the parkland.", "🌳"),
];

// ---------- First Nations and Métis in Alberta ----------

const FNM_SORT: SortSet = {
  prompt: "Tap the item, then the group it belongs to.",
  hint: "Treaty 6, 7 and 8 are agreements with First Nations. The Red River cart, the sash and Michif are linked to Métis culture.",
  bins: [
    { id: "fn", label: "First Nations", emoji: "🪶" },
    { id: "metis", label: "Métis", emoji: "➰" },
  ],
  items: [
    { label: "Treaty 6, 7 and 8 are agreements with these peoples", emoji: "📜", bin: "fn" },
    { label: "Blackfoot, Cree and Dene are among these", emoji: "🗣️", bin: "fn" },
    { label: "Siksika, Kainai and Piikani are Nations in the Blackfoot Confederacy", emoji: "🌾", bin: "fn" },
    { label: "Tsuut'ina and Nakoda (Stoney) are Nations in Alberta", emoji: "⛰️", bin: "fn" },
    { label: "the Métis sash", emoji: "🧣", bin: "metis" },
    { label: "the Red River cart", emoji: "🛒", bin: "metis" },
    { label: "Michif, a language that mixes Cree and French", emoji: "💬", bin: "metis" },
    { label: "Alberta's eight Métis Settlements", emoji: "🏡", bin: "metis" },
  ],
};

const FNM: Item[] = [
  q("Which groups of Indigenous peoples live in Alberta today?", "First Nations, Métis and Inuit", ["only one group", "no one", "only visitors"], "Alberta is home to many First Nations, to the Métis and to Inuit people.", "🍁"),
  q("Alberta is covered by three treaties. They are…", "Treaty 6, Treaty 7 and Treaty 8", ["Treaty 1, 2 and 3", "Treaty 10, 11 and 12", "there are none"], "Treaties are agreements between First Nations and the Crown.", "📜"),
  q("Treaty 7 covers the area that includes…", "southern Alberta and Calgary", ["northern Alberta", "Fort McMurray", "the Arctic"], "Treaty 7 is in the south. Treaty 6 is in the middle and Treaty 8 in the north.", "🗺️"),
  q("Edmonton is in the area covered by…", "Treaty 6", ["Treaty 7", "Treaty 8", "no treaty"], "Treaty 6 covers the central part of Alberta.", "🏛️"),
  q("Which of these First Nations has lived in southern Alberta for a very long time?", "the Blackfoot Confederacy", ["the Mi'kmaq", "the Haida", "the Mohawk"], "The Blackfoot Confederacy includes Siksika, Kainai and Piikani.", "🌾"),
  q("Which Nations have homelands in what is now Alberta?", "Cree, Dene, Blackfoot, Tsuut'ina and Nakoda, among others", ["the Inuit only", "the Haida only", "no Nations"], "Each Nation has its own culture and language.", "🪶"),
  q("The Métis are a distinct people with their own culture and…", "history", ["no past", "one language only", "the same traditions as everyone"], "The Métis culture grew from First Nations and European families.", "➰"),
  q("What is the Métis sash?", "a woven belt worn with pride", ["a kind of boat", "a tent", "a canoe paddle"], "The sash is a symbol of Métis culture.", "🧣"),
  q("Alberta has the only Métis land base in Canada, called…", "Métis Settlements", ["Métis Islands", "Métis Towns", "Métis Forts"], "There are eight Métis Settlements in Alberta.", "🏡"),
  q("Michif is a language of the Métis that blends…", "Cree and French", ["English and German", "Spanish and Greek", "Latin and Italian"], "Michif is still spoken today.", "💬"),
  q("The Red River cart was used by Métis people for…", "carrying goods and hunts across the Prairies", ["flying", "swimming", "mining"], "These sturdy wooden carts could cross rough ground.", "🛒"),
  q("Many Alberta place names come from Indigenous languages. One is…", "Wetaskiwin", ["Boston", "London", "Paris"], "Wetaskiwin comes from a Cree word.", "🏙️"),
  q("First Nations and Métis people in Alberta today work as…", "teachers, doctors, farmers, artists and leaders", ["only hunters", "no one", "only in the past"], "Communities are living and changing, not only part of history.", "🧑‍🏫"),
  q("Many First Nations and Métis people share knowledge of the land, animals and plants. This knowledge…", "helps all Albertans understand and care for the land", ["is not useful", "is only a story", "belongs to no one"], "It is a gift from long experience with the land.", "🌿"),
  hq("Why do we say “many First Nations” instead of “the First Nations”?", "each Nation has its own language, history and ways", ["they all think alike", "there is only one", "they live in the same house"], "Different Nations should not be treated as one group.", "🪶"),
  hq("During the fur trade, Métis people helped by working as…", "guides, interpreters, traders and freighters", ["pilots", "bankers", "computer experts"], "Their skills were important to the fur trade.", "🛶"),
  hq("What does a treaty show?", "an agreement between nations that people must respect", ["a kind of boat", "a map", "a game"], "Treaties are promises between First Nations and the Crown.", "🤝"),
];

// ---------- Francophone settlement ----------

const FRANCO: Item[] = [
  q("A francophone is a person who…", "speaks French", ["speaks Cree", "speaks German", "plays music"], "Francophone means French-speaking.", "🗣️"),
  q("Canada has two official languages. They are…", "English and French", ["English and Cree", "French and German", "English and Spanish"], "Services are available in English and French across Canada.", "🇨🇦"),
  q("French-speaking people came to what is now Alberta first as…", "fur traders and missionaries", ["astronauts", "miners with machines", "bank workers"], "French-speaking voyageurs and Métis travelled and traded here.", "🛶"),
  q("St. Albert, near Edmonton, began as a mission in 1861. A French-speaking missionary who started it was…", "Father Albert Lacombe", ["Terry Fox", "Louis Riel", "Chief Crowfoot"], "Father Lacombe set up the mission that grew into St. Albert.", "⛪"),
  q("In the early 1900s many French-speaking families settled in Alberta to…", "farm and build communities", ["fly planes", "search for gold in space", "work in factories only"], "Francophone farmers settled in places such as Falher and Legal.", "🌾"),
  q("Falher is famous for being the “Honey Capital of Canada”. What do its bees make?", "honey", ["maple syrup", "wool", "soap"], "Falher is a French-speaking community in northern Alberta.", "🍯"),
  q("Which Alberta communities have a long French history?", "Falher, St. Paul and Legal", ["Honolulu", "Paris", "Dallas"], "These communities have French-speaking families and schools.", "🏘️"),
  q("A French-language school in Alberta teaches students in…", "French", ["Spanish", "German", "Greek"], "Francophone schools teach all subjects in French.", "🏫"),
  q("French immersion is a program where children…", "learn school subjects in French", ["learn only music", "stay at home", "visit France"], "Students in immersion learn many subjects in French.", "📚"),
  q("Francophone communities in Alberta today help by sharing…", "their language, music, food and festivals", ["nothing", "only maps", "only money"], "Language and culture make Alberta richer.", "🎶"),
  q("Edmonton's French neighbourhood and cultural centre is called…", "the Cité francophone", ["the Cité Europe", "the Cité Calgary", "the Cité Lethbridge"], "It has French schools, theatre and services.", "🏙️"),
  q("A place name like Morinville tells you that…", "French-speaking people helped build the community", ["no one lives there", "it is a mountain", "it is in France"], "Many Alberta towns have French names.", "🏘️"),
  q("Lac La Biche has a French name. “Lac” means…", "lake", ["mountain", "town", "river"], "Lac La Biche is a lake and a community in Alberta.", "🏞️"),
  hq("Why was it good for French-speaking settlers to come to Alberta?", "they helped build farms, schools and churches", ["they closed all farms", "they stopped trade", "they took the mountains"], "Many communities were built by people of different languages.", "🌾"),
  hq("A francophone Albertan can often get services in…", "both English and French in some places", ["Greek only", "no language", "Latin only"], "Some Alberta services are offered in both languages.", "🏛️"),
  hq("Why is it important to respect different languages?", "everyone belongs in our community", ["only English matters", "languages are all the same", "no one speaks them"], "Many Albertans speak many languages.", "🤝"),
  q("“Bonjour” is a French word for…", "hello", ["goodbye", "thank you", "snow"], "Bonjour is a friendly greeting.", "👋"),
  q("“Merci” is a French word for…", "thank you", ["please", "hello", "good night"], "Merci is a way to show thanks.", "🙏"),
  q("Voyageurs were people who…", "paddled canoes to carry furs and goods", ["flew planes", "drove trains", "built skyscrapers"], "Many voyageurs spoke French and travelled by canoe.", "🛶"),
  q("Michif is a language spoken by some Métis people. It mixes…", "Cree and French", ["English and German", "Greek and Latin", "Spanish and Italian"], "Michif shows how cultures can blend.", "🗣️"),
  q("Francophone Albertans are people who…", "speak French and live in Alberta", ["live in France", "only live in cities", "speak no language"], "Many francophone families have lived in Alberta for generations.", "🏘️"),
  q("Which of these is a sign you might see in both official languages?", "a sign that says “Exit / Sortie”", ["a sign with only numbers", "a sign in Greek", "a blank sign"], "Many federal signs and labels use English and French.", "🚪"),
  q("A cereal box in Canada has words in English and French because…", "Canada has two official languages", ["the cereal is French", "boxes need more words", "French makes it taste better"], "Many packages use both official languages.", "🥣"),
  q("A French Catholic mission was set up in 1861 and later became…", "St. Albert", ["Banff", "Lethbridge", "Medicine Hat"], "St. Albert is one of Alberta's oldest communities.", "⛪"),
  q("Why do many Alberta communities have French names?", "French-speaking people helped settle them", ["French was chosen at random", "they were moved from France", "no one chose the names"], "Names like Legal, Morinville and Beaumont show French influence.", "🏘️"),
  q("A francophone festival might include…", "French music, food and dancing", ["only math tests", "no one", "only silent reading"], "Festivals share and celebrate culture.", "🎉"),
  q("A Franco-Albertan student could go to a school where…", "all subjects are taught in French", ["only gym is taught", "no one speaks", "all classes are in Greek"], "French-language schools support French culture.", "🏫"),
  hq("French-speaking Albertans have lived here for a long time. This means French is…", "part of Alberta's history and present", ["only found in books", "brand new", "not used today"], "Francophone communities are living communities today.", "🌟"),
];

// ---------- Fairness, discrimination and racism ----------

const FAIR_SORT: SortSet = {
  prompt: "Is it fair or unfair treatment? Tap an item, then tap its basket.",
  hint: "Fair means everyone is treated with respect. Unfair means treating someone worse because of who they are.",
  bins: [
    { id: "fair", label: "fair and kind", emoji: "🤝" },
    { id: "unfair", label: "unfair", emoji: "🚫" },
  ],
  items: [
    { label: "inviting a new student to play", emoji: "🧒", bin: "fair" },
    { label: "learning to say a classmate's name correctly", emoji: "🗣️", bin: "fair" },
    { label: "standing up for someone who is teased", emoji: "🛡️", bin: "fair" },
    { label: "sharing the swings in turns", emoji: "🎠", bin: "fair" },
    { label: "leaving someone out because of their skin colour", emoji: "🙈", bin: "unfair" },
    { label: "laughing at someone's accent", emoji: "😞", bin: "unfair" },
    { label: "saying a group of people are all alike", emoji: "🚷", bin: "unfair" },
    { label: "making fun of someone's lunch", emoji: "🍱", bin: "unfair" },
  ],
};

const FAIR: Item[] = [
  q("Discrimination means…", "treating people unfairly because of who they are", ["being kind to everyone", "sharing toys", "following the rules"], "It is unfair to treat someone worse because of their skin colour, language, religion or how they look.", "🚫"),
  q("Racism is…", "treating people unfairly because of their skin colour or background", ["liking all colours", "being proud of your culture", "learning another language"], "Racism is unfair and hurts people.", "🛑"),
  q("A stereotype is…", "an unfair idea that all people in a group are the same", ["a true fact about one person", "a kind of music", "a school rule"], "Each person is different.", "💭"),
  q("A new student speaks a different first language. What is a kind thing to do?", "welcome them and help them join in", ["ignore them", "laugh at their words", "tell them to go away"], "Kindness helps everyone feel they belong.", "👋"),
  q("Someone is teased about their skin colour. What can you do?", "tell a trusted adult and be kind to the person", ["join in", "laugh", "do nothing at all"], "Telling an adult and showing care helps.", "🛡️"),
  q("An upstander is a person who…", "speaks up or acts to help when something is unfair", ["watches and laughs", "starts the teasing", "hides"], "Upstanders show courage and kindness.", "🦸"),
  q("Why is it important to say a classmate's name correctly?", "it shows respect for them", ["names are not important", "it is a rule of grammar", "it is a joke"], "Learning a name is a way to say you care.", "🏷️"),
  q("Everyone in Alberta has human rights. This means…", "everyone should be treated fairly and with respect", ["only some people count", "rights are for adults only", "rules do not matter"], "Human rights belong to every person.", "⚖️"),
  q("Which words are kind and fair?", "“You can play with us.”", ["“You can't play, you're different.”", "“Go back where you came from.”", "“We don't want you.”"], "Include people instead of leaving them out.", "💬"),
  q("A friend says something unkind about another person's culture. What could you say?", "That isn't fair. Everybody's culture matters.", ["Yes, that is funny.", "Say nothing and laugh.", "I agree with you."], "Speaking up politely can help.", "🗣️"),
  q("Why is it good to learn about other people's cultures?", "it helps us understand and respect each other", ["it is not important", "it makes us all the same", "it is only for adults"], "Learning leads to respect.", "🌍"),
  q("Long ago, some people in Canada were treated unfairly because of their background. Today, laws…", "help protect everyone's rights", ["make unfair treatment allowed", "say only some people matter", "have no effect"], "Laws such as the Alberta Human Rights Act say people must be treated fairly.", "📜"),
  q("People in Alberta come from many places. This helps our communities because…", "we can share many ideas, foods, languages and stories", ["it makes everyone the same", "it makes learning harder", "it stops friendships"], "Differences can make a community richer.", "🌈"),
  hq("Why is it not fair to say “All kids from that school are bad”?", "it is a stereotype, because every person is different", ["it is always true", "schools are all alike", "it is a rule"], "A stereotype is an unfair idea about a whole group.", "🏫"),
  hq("You see someone left out at recess because of the way they talk. What is a helpful choice?", "invite them in or get a teacher if needed", ["wait and watch", "join the teasing", "pretend not to see"], "Small kind actions matter.", "🛝"),
  hq("Why do some people stay silent when they see unfair treatment?", "they may feel scared, but speaking up or telling an adult helps", ["they like unfairness", "it is always the best plan", "they do not have voices"], "Telling a trusted adult is one safe way to help.", "🤫"),
];

// ---------- Provincial and municipal government ----------

const GOV_SORT: SortSet = {
  prompt: "Which government does this job? Tap an item, then tap its basket.",
  hint: "Municipal governments look after local things like parks and garbage. The province looks after things like health care, schools and highways.",
  bins: [
    { id: "muni", label: "city or town", emoji: "🏙️" },
    { id: "prov", label: "province of Alberta", emoji: "🏛️" },
  ],
  items: [
    { label: "picking up garbage and recycling", emoji: "🗑️", bin: "muni" },
    { label: "plowing city streets", emoji: "🚜", bin: "muni" },
    { label: "city parks and playgrounds", emoji: "🛝", bin: "muni" },
    { label: "local fire department", emoji: "🚒", bin: "muni" },
    { label: "running hospitals and health care", emoji: "🏥", bin: "prov" },
    { label: "setting rules for schools", emoji: "🏫", bin: "prov" },
    { label: "main highways between cities", emoji: "🛣️", bin: "prov" },
    { label: "provincial parks", emoji: "🏞️", bin: "prov" },
  ],
};

const GOV: Item[] = [
  q("A government is a group of people who…", "make decisions and rules for a community", ["sell toys", "play games", "bake bread"], "Governments serve people.", "🏛️"),
  q("The government of Alberta meets in the Legislature Building in…", "Edmonton", ["Calgary", "Banff", "Lethbridge"], "The Legislature is in the capital.", "🏛️"),
  q("People elected to represent Albertans in the Legislature are called…", "MLAs, Members of the Legislative Assembly", ["mayors", "judges", "teachers"], "Each MLA speaks for people in their area.", "🗳️"),
  q("The leader of the Alberta government is the…", "Premier", ["Mayor", "Prime Minister", "Principal"], "The Premier leads the province.", "👤"),
  q("A city or town is led by a…", "mayor and council", ["premier", "king", "principal"], "Citizens elect a mayor and councillors.", "🏙️"),
  q("Who makes decisions for your town or city?", "the mayor and city council", ["the Prime Minister alone", "a bank", "a hockey team"], "A council makes local decisions.", "🏙️"),
  q("Which service does a municipal government usually provide?", "garbage and recycling pickup", ["running hospitals", "making passports", "printing money"], "Cities and towns look after local services.", "🗑️"),
  q("Which service does the province of Alberta usually provide?", "health care and schools", ["street sweeping only", "garbage pickup", "local pet licences"], "Alberta looks after health care, education and highways.", "🏥"),
  q("Why do citizens vote in elections?", "to choose the people who will make decisions for them", ["to get a prize", "to pick a sports team", "to play a game"], "Voting is a way to have a say.", "🗳️"),
  q("How old must a person be to vote in Alberta elections?", "18 and a Canadian citizen", ["5", "10", "12"], "Adults vote. Children can learn about it and share ideas.", "🎂"),
  q("The Prime Minister leads the…", "government of Canada", ["government of Alberta", "city council", "school board"], "Ottawa is the capital of Canada.", "🇨🇦"),
  q("Which person leads a city in Alberta?", "the mayor", ["the premier", "the principal", "the prime minister"], "A mayor leads the council.", "🏙️"),
  q("Governments pay for services like roads and schools with money from…", "taxes", ["gifts from stores", "lotteries only", "toy sales"], "People pay taxes, which are shared for community needs.", "💰"),
  hq("Why does your city need rules about speed limits?", "to keep people safe", ["to make people late", "because roads are lonely", "to be silly"], "Rules protect people.", "🚦"),
  hq("Your class wants a new playground. Who decides about a city park?", "the city council", ["the Prime Minister", "the premier alone", "a store"], "City parks are a local matter.", "🛝"),
  hq("What is a good way for children to take part in their community government?", "write a letter or attend a meeting with an adult", ["ignore it", "avoid asking questions", "stay silent"], "Everyone can share ideas.", "✉️"),
];

// ---------- Alberta's official symbols ----------

const SYMBOLS_SORT: SortSet = {
  prompt: "Is it a plant or an animal symbol of Alberta? Tap an item, then tap its basket.",
  hint: "The wild rose and lodgepole pine are plants. The great horned owl, bighorn sheep and bull trout are animals.",
  bins: [
    { id: "plant", label: "plant", emoji: "🌹" },
    { id: "animal", label: "animal", emoji: "🐾" },
  ],
  items: [
    { label: "wild rose", emoji: "🌹", bin: "plant" },
    { label: "lodgepole pine", emoji: "🌲", bin: "plant" },
    { label: "rough fescue", emoji: "🌾", bin: "plant" },
    { label: "great horned owl", emoji: "🦉", bin: "animal" },
    { label: "bighorn sheep", emoji: "🐏", bin: "animal" },
    { label: "bull trout", emoji: "🐟", bin: "animal" },
  ],
};

const SYMBOLS: Item[] = [
  q("Which flower is Alberta's official flower?", "the wild rose", ["the tulip", "the maple leaf", "the lily"], "The wild rose grows across the province.", "🌹"),
  q("Alberta's official tree is the…", "lodgepole pine", ["maple", "oak", "palm"], "Lodgepole pines grow tall and straight in the mountains and foothills.", "🌲"),
  q("Alberta's official bird is the…", "great horned owl", ["bald eagle", "robin", "penguin"], "It is a large owl with feathers that look like horns.", "🦉"),
  q("Alberta's official mammal is the…", "bighorn sheep", ["moose", "polar bear", "bison"], "The bighorn lives in the Rocky Mountains.", "🐏"),
  q("Alberta's official fish is the…", "bull trout", ["salmon", "goldfish", "tuna"], "Bull trout live in cold, clear Alberta streams.", "🐟"),
  q("Alberta's official stone is…", "petrified wood", ["a diamond", "granite", "a pebble"], "Petrified wood is wood turned to stone.", "🪵"),
  q("The Alberta provincial flag shows…", "the provincial shield of arms on a blue background", ["a maple leaf", "a beaver only", "a red cross only"], "The flag is blue with the shield in the middle.", "🚩"),
  q("The shield on Alberta's coat of arms shows…", "mountains, hills, prairie and wheat fields", ["palm trees", "a beach", "skyscrapers"], "It stands for Alberta's land.", "🛡️"),
  q("Two animals hold up the shield on Alberta's coat of arms. They are a lion and a…", "pronghorn antelope", ["moose", "bear", "goat"], "The supporters stand for tradition and the Prairies.", "🦌"),
  q("Alberta's motto is “Fortis et Liber”. In English this means…", "strong and free", ["fast and fun", "big and bold", "old and wise"], "A motto states an ideal.", "📜"),
  q("Why do provinces have official symbols?", "to show what is special about the place and its people", ["to make flags pretty only", "to pick teams", "to tell time"], "Symbols help people feel they belong.", "🎖️"),
  q("A symbol that is a tartan is…", "a pattern of woven cloth", ["a song", "a flower", "a coin"], "Alberta has an official tartan with colours that stand for the land.", "🧵"),
  hq("Why was the wild rose chosen as Alberta's flower?", "it grows all over the province", ["it grows only in Ontario", "it is made of plastic", "it is a type of tree"], "A symbol is often chosen for being common and well-known.", "🌹"),
  hq("Which of these is a provincial symbol of Alberta?", "the bighorn sheep", ["the loon", "the maple leaf", "the polar bear"], "The bighorn sheep is Alberta's official mammal. The maple leaf is a symbol of Canada.", "🏔️"),
  hq("Why do we protect the animals and plants that are symbols?", "they show what Albertans value about nature", ["they are all extinct", "they cost money", "they are toys"], "Symbols remind us to care for nature.", "💚"),
];

// ---------- Natural resources ----------

const RESOURCE_SORT: SortSet = {
  prompt: "Renewable or non-renewable? Tap an item, then tap its basket.",
  hint: "Renewable resources can grow back or never run out (trees if replanted, wind, sunlight). Non-renewable resources take millions of years to form (oil, natural gas, coal).",
  bins: [
    { id: "renew", label: "renewable", emoji: "♻️" },
    { id: "nonrenew", label: "non-renewable", emoji: "⛽" },
  ],
  items: [
    { label: "wind", emoji: "💨", bin: "renew" },
    { label: "sunlight", emoji: "☀️", bin: "renew" },
    { label: "trees that are replanted", emoji: "🌲", bin: "renew" },
    { label: "crops grown each year", emoji: "🌾", bin: "renew" },
    { label: "oil", emoji: "🛢️", bin: "nonrenew" },
    { label: "natural gas", emoji: "🔥", bin: "nonrenew" },
    { label: "coal", emoji: "⚫", bin: "nonrenew" },
    { label: "gravel", emoji: "🪨", bin: "nonrenew" },
  ],
};

const RESOURCES: Item[] = [
  q("A natural resource is…", "something from nature that people use", ["a toy", "a building", "a computer"], "Water, soil, forests and oil are natural resources.", "🌍"),
  q("Which natural resource is found in northern Alberta's oil sands?", "oil", ["gold", "diamonds", "salt"], "The oil sands are near Fort McMurray.", "🛢️"),
  q("Which of these is a natural resource found in Alberta?", "natural gas", ["silk", "cocoa", "coffee"], "Alberta has large amounts of oil and natural gas.", "🔥"),
  q("Alberta's farmers grow crops such as…", "wheat and canola", ["bananas and coffee", "rice and cocoa", "oranges and mangoes"], "These crops grow well on the Prairies.", "🌾"),
  q("Trees in Alberta's forests are used to make…", "lumber and paper", ["glass", "plastic toys only", "cars"], "Forestry is an important industry.", "🌲"),
  q("Ranchers in Alberta raise…", "cattle", ["penguins", "camels", "polar bears"], "Beef cattle graze on grassland.", "🐄"),
  q("Water from the Rocky Mountains' rivers is used for…", "drinking, farming and electricity", ["making diamonds", "making oil", "freezing the sea"], "Rivers provide water for people and farms.", "💧"),
  q("Which is a renewable resource?", "wind", ["oil", "coal", "natural gas"], "Wind will keep blowing.", "💨"),
  q("Which is a non-renewable resource?", "oil", ["sunlight", "wind", "crops"], "Oil forms over millions of years.", "🛢️"),
  q("Why should we use resources carefully?", "so there is enough for the future", ["so they disappear sooner", "because they are boring", "so we have no jobs"], "Using resources wisely helps people tomorrow.", "🌎"),
  q("Which job uses a natural resource?", "farming", ["telling time", "reading a map", "drawing"], "Farmers use soil, sun and water.", "🧑‍🌾"),
  q("Wind turbines in southern Alberta make…", "electricity from wind", ["gas from oil", "lumber", "wheat"], "Wind farms are common near the Rocky Mountain foothills.", "⚡"),
  hq("Why is using less water a way to look after resources?", "clean water is needed by all living things", ["water costs nothing", "rain never falls", "water is not needed"], "Saving resources helps everyone.", "🚰"),
  hq("In 1947, a large oil discovery was made at Leduc, near…", "Edmonton", ["Lethbridge", "Banff", "Fort McMurray"], "This find changed Alberta's economy.", "🛢️"),
  hq("Why do some people want to use more renewable resources?", "they will not run out and can be kinder to the environment", ["they cost nothing to build", "they are made of oil", "they are only used in cities"], "Wind, sun and water keep renewing.", "☀️"),
];

// ---------- Charitable giving and volunteering ----------

const GIVING: Item[] = [
  q("A volunteer is a person who…", "helps without being paid", ["is paid a lot", "takes things", "plays all day"], "Volunteers give their time to help others.", "🙋"),
  q("A donation is…", "a gift of money, time or things to help others", ["a sale", "a toy swap", "a test"], "People donate to food banks, shelters and charities.", "🎁"),
  q("A charity is…", "a group that helps people or animals in need", ["a store", "a race car", "a kind of storm"], "Charities use donations to help.", "🤲"),
  q("Which is a way to give to a food bank?", "donate canned food", ["throw it away", "eat it all", "hide it"], "Food banks give food to families who need it.", "🥫"),
  q("Which is a way to volunteer at school?", "help set up for an assembly", ["skip class", "make a mess", "take someone's lunch"], "Helping out is volunteering.", "🏫"),
  q("A neighbour is ill and cannot shovel snow. A kind thing to do is…", "offer to shovel their walk", ["ignore it", "make it icy", "pile more snow"], "Small acts of kindness matter.", "❄️"),
  q("A child holds a bake sale to raise money for animals in need. This is…", "charitable giving", ["a robbery", "a competition", "a mistake"], "The money is given to help others.", "🧁"),
  q("Why do people volunteer?", "to help others and their community", ["to get a prize", "so no one knows", "because they must"], "Volunteers feel proud and connected.", "💚"),
  q("The Terry Fox Run raises money for…", "cancer research", ["new toys", "car washes", "video games"], "People walk and run to help find cures.", "🏃"),
  q("Which can you give if you have no money?", "your time and kindness", ["nothing", "other people's things", "only gold"], "You can donate time, skills and care.", "⏰"),
  q("Which is volunteering?", "reading to younger children at the library", ["playing video games alone", "napping", "eating lunch"], "Helping others for free is volunteering.", "📚"),
  q("Which is an example of a charity in Alberta?", "a food bank", ["a movie theatre", "a candy store", "a toy company"], "Food banks collect food for families.", "🥫"),
  q("A family gives winter coats to a shelter. This is…", "a donation", ["a purchase", "a bill", "a rule"], "The coats help people stay warm.", "🧥"),
  hq("Why do charities often depend on volunteers?", "volunteers let more of the money go to the cause", ["volunteers are never needed", "charities have no goals", "volunteers are paid a lot"], "Volunteers help charities save money.", "🤝"),
  hq("Why is it nice to give without asking for something back?", "it shows you care about others", ["it is silly", "it hurts people", "it costs money only"], "Kindness is its own reward.", "💞"),
  hq("Which action helps a community most?", "everyone doing a little to help", ["only one person doing it all", "no one helping", "complaining"], "Many small acts add up.", "🌟"),
  q("Which is a way to help a community garden?", "water the plants and pull weeds", ["pick all the vegetables", "stomp on the beds", "leave garbage"], "Volunteers keep gardens growing.", "🥕"),
  q("Which is an example of giving time?", "helping an older neighbour carry groceries", ["buying a game", "sleeping late", "ignoring a neighbour"], "Your time is a gift.", "🛒"),
  q("A coin drive collects money to help…", "people or animals in need", ["a toy shop", "a race track", "a candy factory"], "Charities use the money to help.", "🪙"),
  q("Which person is a volunteer?", "a parent who coaches a team for free", ["a store clerk paid by the hour", "a taxi driver paid by the trip", "a bank worker"], "Volunteers are not paid for helping.", "⚽"),
  q("Why do shelters ask for blankets and warm clothes in winter?", "winters in Alberta can be very cold", ["blankets are decorations", "it is summer", "shelters sell them"], "Warm things help people stay safe.", "🧣"),
  q("A class collects books for children who have none. This is…", "giving to others", ["taking from others", "a test", "a trade"], "Sharing books helps others learn.", "📚"),
  q("Giving can also feel good because it…", "helps us feel connected and proud", ["makes us sad forever", "costs a lot", "makes others unhappy"], "Helping others is rewarding.", "😊"),
  q("A volunteer firefighter or search and rescue member…", "helps their community for free", ["is paid a huge salary", "makes things up", "only works at night"], "Many communities depend on volunteers.", "🚒"),
  q("Which is a donation of time?", "picking up litter in a park", ["buying a toy", "playing a game", "watching TV"], "You give your time to help.", "🧤"),
  q("Which is a donation of food?", "bringing canned soup to a food drive", ["eating dinner", "throwing away leftovers", "buying chips"], "Food banks share food.", "🍲"),
  q("A person can help others by giving…", "time, money or things", ["only gold", "only toys", "nothing at all"], "There are many ways to give.", "🎁"),
  hq("Why do food drives often take place before holidays?", "many families need extra help then", ["food is free then", "stores close", "because people forget"], "Communities try to help during busy, costly times.", "🎄"),
];

const FOUNDING_ORDER = order("Put these in order from the smallest level of government to the biggest.", "A city is smallest, then the province, then the country.", [
  ["Your city or town council", "🏙️"],
  ["The government of Alberta", "🏛️"],
  ["The government of Canada", "🇨🇦"],
]);

export const units: Unit[] = [
  {
    id: "regions-ab",
    title: "Alberta's Regions & Borders",
    emoji: "🏔️",
    blurb: "Mountains, grasslands, forests and who our neighbours are.",
    parentNote: "Alberta's physical regions (Rocky Mountains, Foothills, Parkland, Grasslands, Boreal Forest), its neighbours, its capital and the Prairie provinces.",
    standards: ab("physical regions and political boundaries of Alberta", "Alberta's physical regions, borders and the Prairie provinces"),
    generate: bankUnit(REGIONS, { sorts: [REGION_SORT] }),
  },
  {
    id: "first-nations-metis-ab",
    title: "First Nations & Métis in Alberta",
    emoji: "🪶",
    blurb: "Living communities, treaties and contributions.",
    parentNote: "Alberta is home to many distinct First Nations, the Métis and Inuit people. Questions are light and written in the present tense about living communities. Each Nation has its own language and history, and Treaty 6, 7 and 8 cover Alberta. Please talk with your child about local Nations and Elders; this unit is not a full account.",
    standards: ab("First Nations and Métis contributions to Alberta", "First Nations and Métis peoples, treaties, languages and contributions"),
    generate: bankUnit(FNM, { sorts: [FNM_SORT] }),
  },
  {
    id: "francophone-ab",
    title: "French-Speaking Albertans",
    emoji: "⚜️",
    blurb: "How francophone settlers and communities helped build Alberta.",
    parentNote: "French-speaking fur traders, missionaries and settlers, French communities in Alberta today, and Canada's two official languages.",
    standards: ab("francophone settlement and contributions to Alberta", "francophone settlers and communities in Alberta"),
    generate: bankUnit(FRANCO),
  },
  {
    id: "fairness-ab",
    title: "Fairness & Respect",
    emoji: "🤝",
    blurb: "What discrimination and racism are, and how to be an upstander.",
    parentNote: "An age-appropriate introduction to discrimination and racism: what they mean, why they hurt, and what children can do, such as welcoming others, telling a trusted adult and standing up kindly.",
    standards: ab("introduction to discrimination and racism in Alberta", "what discrimination and racism are and how to treat others fairly"),
    generate: bankUnit(FAIR, { sorts: [FAIR_SORT] }),
  },
  {
    id: "governments-ab",
    title: "Alberta's Governments",
    emoji: "🏛️",
    blurb: "City councils, the Legislature and who does what.",
    parentNote: "The roles of municipal and provincial governments: who leads, what each looks after, and how citizens take part through voting.",
    standards: ab("provincial and municipal governments", "what provincial and municipal governments do and who leads them"),
    generate: bankUnit(GOV, { sorts: [GOV_SORT], orders: [FOUNDING_ORDER] }),
  },
  {
    id: "symbols-ab",
    title: "Alberta's Symbols",
    emoji: "🌹",
    blurb: "The wild rose, the flag, the coat of arms and more.",
    parentNote: "Alberta's official emblems, such as the wild rose, lodgepole pine, great horned owl, bighorn sheep and the provincial flag.",
    standards: ab("Alberta’s official symbols", "Alberta's flag, coat of arms and official plant and animal emblems"),
    generate: bankUnit(SYMBOLS, { sorts: [SYMBOLS_SORT] }),
  },
  {
    id: "resources-ab",
    title: "Alberta's Natural Resources",
    emoji: "🛢️",
    blurb: "Oil, forests, farmland and water.",
    parentNote: "Alberta's natural resources (oil and natural gas, farmland, forests and water), renewable and non-renewable resources, and using them wisely.",
    standards: ab("Alberta’s natural resources", "Alberta's natural resources and how people use them wisely"),
    generate: bankUnit(RESOURCES, { sorts: [RESOURCE_SORT] }),
  },
  {
    id: "giving-ab",
    title: "Giving & Volunteering",
    emoji: "💚",
    blurb: "How donations and volunteers help the community.",
    parentNote: "Charitable giving and volunteering: how time, skills and donations help people and animals in our community.",
    standards: ab("charitable giving and volunteerism", "how charity and volunteering help communities"),
    generate: bankUnit(GIVING),
  },
];
