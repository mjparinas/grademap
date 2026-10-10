import type { Unit } from "../types";
import { ab } from "./kit";
import { e, order, q, sorter, unitOf, type Item } from "../ontario/k-g2-kit";

// Alberta Grade 1 social studies (2023): local communities and cultures. BC and Ontario units on roles,
// belonging, diversity, community places and services are shared in g1.ts; the units below are new.
// Indigenous and francophone content is kept light, in the present tense, and never treats all Nations as one.

// ---------- Landmarks and physical features ----------

const LANDMARKS: Item[] = [
  q("A landmark is something that…", "is easy to see and helps people find a place", ["is hidden underground", "nobody has ever seen"], "Landmarks help us know where we are.", { emoji: "📍" }),
  q("Which one is a physical feature?", e("a mountain", "🏔️"), [e("a toy shop", "🧸"), e("a bus", "🚌")], "Mountains, rivers and lakes are physical features made by nature."),
  q("The Rocky Mountains are in the west of…", "Alberta", ["Newfoundland", "Nunavut"], "Banff and Jasper are in the Rocky Mountains of Alberta.", { emoji: "🏔️" }),
  q("Which river flows through the city of Edmonton?", "the North Saskatchewan River", ["the Rideau Canal", "the Fraser River"], "Edmonton sits beside the North Saskatchewan River.", { emoji: "🏞️", d: 2 }),
  q("Which river flows through the city of Calgary?", "the Bow River", ["the Red River", "the Ottawa River"], "The Bow River runs through downtown Calgary.", { emoji: "🏞️", d: 2 }),
  q("The Calgary Tower is a…", "built landmark", ["natural landmark", "river"], "People built the tower. It is a landmark you can see from far away.", { emoji: "🗼" }),
  q("The Alberta Legislature Building is in…", "Edmonton", ["Lethbridge", "Banff"], "Edmonton is the capital city of Alberta.", { emoji: "🏛️", d: 2 }),
  q("Lake Louise is a…", "lake in the mountains", ["city street", "hill of sand"], "Lake Louise is a famous lake near Banff.", { emoji: "🏞️" }),
  q("Drumheller is known for its giant…", "dinosaur statue", ["ice cream cone", "space rocket"], "Drumheller is near many dinosaur fossils.", { emoji: "🦖", d: 2 }),
  q("The prairie is mostly…", "flat or gently rolling land with grass", ["tall snowy peaks", "deep ocean"], "Much of southern Alberta is prairie.", { emoji: "🌾" }),
  q("Which natural feature is a big, flowing body of water?", "a river", ["a hill", "a prairie"], "A river moves water along a path.", { d: 1 }),
  q("A hill is…", "land higher than the land around it", ["a body of water", "a kind of road"], "Hills are bumps in the land.", { emoji: "⛰️" }),
  q("A bridge helps people…", "cross a river", ["climb a cloud", "dig a hole"], "Bridges are built landmarks over water or roads.", { emoji: "🌉", d: 2 }),
  q("Lethbridge has a very long, high bridge for trains. It is a…", "built landmark", ["natural landmark", "type of animal"], "The High Level Bridge was built by people.", { emoji: "🚆", d: 3 }),
  q("Why can a landmark help you find your way?", "it stands out from other places", ["it moves around", "it is hidden"], "You can tell someone to turn at the big red barn.", { d: 3 }),
  q("Your community has a school, a park and a river. Those are…", "places and features in your community", ["only things in other countries", "just ideas"], "Communities have natural features and built places.", { d: 2 }),
  q("A valley is…", "low land between hills or mountains", ["a tall tower", "a kind of road"], "Valleys sit between higher land.", { emoji: "🏞️", d: 3 }),
];

const NATURAL_BUILT = sorter({
  prompt: "Natural or built? Tap a landmark, then tap its basket.",
  hint: "Natural features were made by nature. Built ones were made by people.",
  bins: [
    { id: "nature", label: "Natural", emoji: "🌿" },
    { id: "built", label: "Built", emoji: "🏗️" },
  ],
  items: [
    { label: "mountain", emoji: "🏔️", bin: "nature" },
    { label: "river", emoji: "🏞️", bin: "nature" },
    { label: "lake", emoji: "💧", bin: "nature" },
    { label: "valley", emoji: "🌄", bin: "nature" },
    { label: "tower", emoji: "🗼", bin: "built" },
    { label: "bridge", emoji: "🌉", bin: "built" },
    { label: "statue", emoji: "🗽", bin: "built" },
    { label: "grain elevator", emoji: "🏭", bin: "built" },
  ],
});

export const landmarksUnit: Unit = {
  id: "landmarks-ab",
  title: "Landmarks & Land Features",
  emoji: "🏔️",
  blurb: "Mountains, rivers, towers and bridges!",
  parentNote: "Communities have physical features (mountains, rivers, lakes, prairies) and landmarks (towers, bridges, buildings) that help people find their way. Children meet some well-known places in Alberta.",
  standards: ab("key physical features and landmarks of communities", "natural and built landmarks in Alberta communities"),
  generate: unitOf(LANDMARKS, [NATURAL_BUILT]),
};

// ---------- Cultures in Alberta ----------

const CULTURES: Item[] = [
  q("Which people have lived on the land now called Alberta for thousands of years?", "First Nations, Métis and Inuit peoples", ["only people from far away", "nobody"], "Indigenous peoples have lived here since long before Canada began.", { emoji: "🌎" }),
  q("Are there First Nations communities in Alberta today?", "Yes, many", ["No, none", "Only in stories"], "First Nations communities are part of Alberta today.", { emoji: "🏘️" }),
  q("Alberta is home to many different…", "cultures", ["clouds", "robots"], "Families come from many cultures and have many traditions.", { emoji: "🌍" }),
  q("Many people in Alberta speak French at home and at school. These are…", "francophone communities", ["underwater communities", "only visitors"], "Francophone means French-speaking.", { emoji: "🇫🇷", d: 2 }),
  q("Which is a way to learn about a friend's culture?", "ask kindly and listen", ["laugh at it", "say it is strange"], "Curious, kind questions show respect.", { emoji: "👂" }),
  q("Cree is a language spoken by many people in Alberta. A language is used to…", "talk and share ideas", ["only to draw", "only to count"], "Languages carry stories, songs and ideas.", { emoji: "💬", d: 2 }),
  q("Communities can share their culture through…", "music, food and stories", ["only one kind of lunch", "nothing at all"], "Songs, food, art and stories are all part of culture.", { emoji: "🎵" }),
  q("Métis people have their own culture. Many love to share…", "fiddle music and dancing", ["only quiet games", "only snow sculptures"], "Métis fiddling and jigging are part of Métis culture.", { emoji: "🎻", d: 2 }),
  q("Alberta has Métis Settlements, which are…", "communities where Métis people live", ["buildings for animals", "parks with no people"], "Alberta is the only province with Métis Settlements.", { d: 3 }),
  q("Inuit are Indigenous people whose homelands are in…", "the far north of Canada", ["the Rocky Mountains", "the south of Alberta"], "Inuit homelands are in the Arctic in the north of Canada. Some Inuit families live in Alberta too.", { emoji: "❄️", d: 3 }),
  q("Different families celebrate different special days. Is that okay?", "Yes, everyone has traditions", ["No, we must all be the same", "Only one is allowed"], "Everyone's traditions matter.", { emoji: "🎉" }),
  q("A neighbour says hello in a language you do not know. You can…", "smile and ask how to say it", ["ignore them", "make fun of it"], "Learning a new word is a kind way to connect.", { d: 2 }),
  q("Why is it good to have many cultures in one community?", "we can learn from each other", ["it makes everyone fight", "it is boring"], "Many cultures mean many ideas, foods and stories.", { d: 3 }),
  q("Treaty 6, Treaty 7 and Treaty 8 are agreements that cover…", "parts of Alberta", ["only the ocean", "outer space"], "Treaties are agreements made between First Nations and the Crown.", { d: 3 }),
  q("Which is a French word you could learn?", "bonjour", ["salaam", "namaste"], "Bonjour means hello in French.", { emoji: "👋", d: 2 }),
  q("Inuktitut is a language of the…", "Inuit", ["Romans", "Vikings"], "Inuktitut is spoken by many Inuit in the north of Canada today.", { emoji: "💬", d: 3 }),
  q("The Blackfoot people have their own language. This means they…", "have their own words and stories", ["have no words", "speak only English"], "Many First Nations have languages that are used today.", { d: 2 }),
  q("A family cooks food from their culture. They are sharing…", "a tradition", ["a thunderstorm", "a bus"], "Food can be part of a family's culture.", { emoji: "🍲" }),
  q("A friend's name is hard to say. What can you do?", "ask them to help you say it", ["give them a new name", "skip it"], "Saying a name well shows respect."),
  q("Some Alberta schools teach in French. This helps children…", "learn in two languages", ["forget English", "stop reading"], "Many children in Alberta learn French and English.", { emoji: "📚", d: 2 }),
  q("Eid, Diwali, Christmas and Hanukkah are…", "special days for different families", ["names of animals", "kinds of weather"], "Families celebrate many special days.", { emoji: "🎉" }),
  q("A song from a culture can help us…", "share stories and feelings", ["stop listening", "forget the past"], "Music is one way people share who they are.", { emoji: "🎶", d: 2 }),
  q("Métis fiddlers play at gatherings in Alberta today. Today means…", "now, not just long ago", ["only long ago", "never"], "Métis culture is alive in Alberta now.", { emoji: "🎻", d: 2 }),
  q("A family is new to Alberta. How can you be a good neighbour?", "say hello and welcome them", ["stay away", "tell them to leave"], "A friendly hello helps people feel at home.", { emoji: "👋" }),
  q("People who move to Alberta from other countries are called…", "newcomers", ["only tourists", "only students"], "Newcomers bring new foods, songs and ideas.", { d: 2 }),
  q("Cree and Dene are names of…", "First Nations", ["rivers", "mountains"], "Cree and Dene peoples have communities in Alberta today.", { d: 3 }),
  q("Different cultures have different foods. This is…", "okay and interesting", ["wrong", "scary"], "Trying new foods can teach us about others.", { emoji: "🍽️" }),
];

export const culturesUnit: Unit = {
  id: "cultures-alberta-ab",
  title: "Cultures in Alberta",
  emoji: "🌍",
  blurb: "Many peoples, many languages, one community!",
  parentNote: "Alberta communities include First Nations, Métis, Inuit, francophone and many other cultures. Children learn that cultures share music, food, languages and stories, and that being curious and kind helps people feel welcome. Indigenous content is kept light and in the present tense; it should be explored further with local communities.",
  standards: ab("cultures of diverse communities, including First Nations, Métis, Inuit, and francophone communities", "cultures that live in Alberta today, and respectful ways to learn about them"),
  generate: unitOf(CULTURES),
};

// ---------- Goods and services ----------

const GOODS: Item[] = [
  q("Goods are things you can…", "touch and use", ["only hear", "only dream"], "Bread, boots and books are goods.", { emoji: "📦" }),
  q("A service is a job that…", "helps other people", ["makes a toy", "grows a plant"], "A haircut and a bus ride are services.", { emoji: "🤝" }),
  q("Which one is a service?", "a haircut", ["a loaf of bread", "a pair of boots"], "A service is something a person does for you.", { emoji: "💇" }),
  q("Which one is a good?", "a pair of mittens", ["a doctor visit", "a bus ride"], "A good is something you can hold.", { emoji: "🧤" }),
  q("A farmer grows wheat. Who might turn it into bread?", "a baker", ["a pilot", "a vet"], "Wheat becomes flour, and bakers make bread.", { emoji: "🌾" }),
  q("Canola grows in big yellow fields in Alberta. It is made into…", "cooking oil", ["boots", "paper clips"], "Many farms in Alberta grow canola.", { emoji: "🌼", d: 2 }),
  q("You pay money at a store. What do you get?", "goods or a service", ["nothing", "a rain cloud"], "We exchange money for goods and services.", { emoji: "🛒" }),
  q("Two friends trade a sticker for a pencil. This is called…", "trading", ["growing", "melting"], "Trading means swapping one thing for another.", { emoji: "🔄", d: 2 }),
  q("A bus driver gives people a ride. This is a…", "service", ["good", "toy"], "Drivers provide a service.", { emoji: "🚌" }),
  q("A bakery sells bread. Bread is a…", "good", ["service", "season"], "You can touch and eat bread.", { emoji: "🥖" }),
  q("Where do families buy fresh vegetables?", "a grocery store or farmers' market", ["a library only", "a fire hall"], "Stores and markets sell food.", { emoji: "🥕", d: 1 }),
  q("A farmers' market lets farmers…", "sell food straight to people", ["fly airplanes", "build bridges"], "Farmers bring their food to share and sell.", { emoji: "🧺", d: 2 }),
  q("Who provides a service at a school?", "a teacher", ["a loaf of bread", "a toy"], "Teachers help students learn.", { emoji: "🧑‍🏫", d: 2 }),
  q("A mechanic fixes cars. Fixing is a…", "service", ["good", "colour"], "The mechanic does a job for you.", { d: 2 }),
  q("Why do people trade goods and services?", "to get what they need", ["to make things disappear", "because they must not talk"], "Nobody can make everything alone.", { d: 3 }),
  q("A truck driver takes milk from a farm to a store. That is a…", "service", ["good", "season"], "Drivers move goods from place to place.", { emoji: "🚚", d: 3 }),
];

const GOODS_SORT = sorter({
  prompt: "Good or service? Tap an item, then tap its basket.",
  hint: "A good is something you can hold. A service is a job someone does for you.",
  bins: [
    { id: "good", label: "Goods", emoji: "📦" },
    { id: "service", label: "Services", emoji: "🤝" },
  ],
  items: [
    { label: "apple", emoji: "🍎", bin: "good" },
    { label: "boots", emoji: "🥾", bin: "good" },
    { label: "book", emoji: "📕", bin: "good" },
    { label: "toy truck", emoji: "🚚", bin: "good" },
    { label: "haircut", emoji: "💇", bin: "service" },
    { label: "bus ride", emoji: "🚌", bin: "service" },
    { label: "dentist visit", emoji: "🦷", bin: "service" },
    { label: "snow clearing", emoji: "🧹", bin: "service" },
  ],
});

const FARM_ORDER = order("From farm to table. Put the steps in order.", "Grow it, bake it, sell it, then eat it.", [
  ["A farmer grows wheat", "🌾"],
  ["A baker makes bread", "🥖"],
  ["A store sells the bread", "🛒"],
  ["A family eats it", "🍽️"],
]);

export const goodsUnit: Unit = {
  id: "goods-services-ab",
  title: "Goods & Services",
  emoji: "🛒",
  blurb: "What we make, what we do and what we trade!",
  parentNote: "Goods are things we can touch, like bread and boots. Services are jobs people do for us, like a bus ride. People trade, buy and sell goods and services so everyone gets what they need.",
  standards: ab("exchange of goods and services", "goods and services, trading, and how food gets from farm to table"),
  generate: unitOf(GOODS, [GOODS_SORT, FARM_ORDER]),
};

// ---------- Canada's symbols ----------

const SYMBOLS: Item[] = [
  q("Which leaf is on Canada's flag?", e("maple leaf", "🍁"), [e("oak leaf", "🍂"), e("palm leaf", "🌴")], "The red maple leaf is a symbol of Canada."),
  q("What colours are Canada's flag?", "red and white", ["blue and yellow", "green and orange"], "The flag is red on the sides with a white middle.", { emoji: "🇨🇦" }),
  q("Canada's national anthem is called…", "O Canada", ["Happy Birthday", "Jingle Bells"], "We sing O Canada at school and at special events.", { emoji: "🎶" }),
  q("Which animal is a national symbol of Canada?", e("beaver", "🦫"), [e("penguin", "🐧"), e("camel", "🐪")], "The beaver is a national symbol of Canada."),
  q("A symbol is a picture or thing that…", "stands for an idea or a place", ["is only for decoration", "tells the time"], "A flag stands for a country.", { emoji: "🇨🇦" }),
  q("Which one is an official symbol of Canada?", "the maple leaf", ["a pizza slice", "a toy robot"], "The maple leaf is shown on the flag and on coins.", { emoji: "🍁" }),
  q("Where might you see Canada's flag?", "outside a school or government building", ["only in a swimming pool", "inside a fridge"], "Flags are flown in many places.", { emoji: "🏫", d: 2 }),
  q("What is the wild rose to Alberta?", "its provincial flower", ["its flag", "its anthem"], "The wild rose is a symbol of Alberta.", { emoji: "🌹", d: 2 }),
  q("Which animal is a symbol of Alberta?", e("bighorn sheep", "🐏"), [e("polar bear", "🐻‍❄️"), e("seal", "🦭")], "The bighorn sheep is Alberta's provincial mammal.", { d: 2 }),
  q("Alberta's provincial bird is the…", "great horned owl", ["penguin", "flamingo"], "The great horned owl is a bird of Alberta.", { emoji: "🦉", d: 3 }),
  q("When we stand for O Canada, we are showing…", "respect", ["we are sleepy", "we are lost"], "Standing and listening shows respect for a symbol.", { d: 2 }),
  q("Why do countries have flags?", "to show who they are", ["to keep the wind away", "to tell the weather"], "Flags are symbols that everyone can recognize.", { d: 3 }),
  q("How many colours are on Canada's flag?", "2", ["5", "1"], "The flag is red and white.", { emoji: "🇨🇦", d: 2 }),
  q("Which animal is on the Canadian nickel?", e("beaver", "🦫"), [e("kangaroo", "🦘"), e("giraffe", "🦒")], "The beaver is on the five-cent coin.", { d: 3 }),
  q("Which bird is on the Canadian one-dollar coin?", "loon", ["penguin", "flamingo"], "The loon gives the coin its nickname, the loonie.", { emoji: "🪙", d: 3 }),
  q("Red and white are Canada's…", "official colours", ["school colours", "rainbow colours"], "Red and white are on the flag.", { d: 2 }),
  q("O Canada is Canada's…", "national anthem", ["bedtime song", "birthday song"], "An anthem is a song that stands for a country.", { emoji: "🎶" }),
  q("Alberta's flag is mostly…", "blue", ["red", "green"], "Alberta's flag is blue with the provincial shield in the middle.", { d: 2 }),
  q("Alberta's flag has a picture of…", "the provincial shield", ["a maple leaf", "a beaver"], "The shield shows mountains, hills, prairie and wheat.", { d: 3 }),
  q("Alberta's provincial tree is the…", "lodgepole pine", ["palm tree", "cactus"], "Lodgepole pines grow in Alberta's forests.", { emoji: "🌲", d: 3 }),
  q("Alberta's provincial fish is the…", "bull trout", ["goldfish", "shark"], "The bull trout lives in cold, clear Alberta waters.", { emoji: "🐟", d: 3 }),
  q("A symbol can be a picture, a colour or a…", "song", ["sandwich", "nap"], "Songs like anthems can be symbols too.", { d: 2 }),
  q("Which colour is NOT on Canada's flag?", "blue", ["red", "white"], "The flag has only red and white.", { emoji: "🇨🇦" }),
  q("We fly a flag to show…", "pride in a place", ["it is lunch", "a storm is coming"], "Flags show who we are and where we belong.", { d: 2 }),
  q("The beaver is known for being…", "hard-working", ["lazy", "noisy"], "Beavers work hard to build dams and lodges.", { emoji: "🦫", d: 2 }),
  q("Which one is not a symbol of Canada?", "a skateboard", ["the flag", "O Canada"], "The flag and the anthem both stand for Canada."),
];

export const symbolsUnit: Unit = {
  id: "symbols-canada-ab",
  title: "Canada's Symbols",
  emoji: "🍁",
  blurb: "The flag, the maple leaf, the beaver and more!",
  parentNote: "Symbols such as the national flag, the maple leaf, the beaver and the anthem O Canada stand for our country. Children also meet a few symbols of Alberta.",
  standards: ab("Canada’s official symbols", "Canada’s flag, maple leaf, beaver and anthem, and a few symbols of Alberta"),
  generate: unitOf(SYMBOLS),
};

export const units: Unit[] = [landmarksUnit, culturesUnit, goodsUnit, symbolsUnit];
