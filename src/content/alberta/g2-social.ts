import type { Unit } from "../types";
import { ab } from "./kit";
import { order, q, sorter, unitOf, type Item } from "../ontario/k-g2-kit";

// Alberta Grade 2 social studies (2023): Canada - Communities and Heritage. The five topics are in the grade
// snapshot in docs/research/alberta/outcomes.json. BC's and Ontario's traditions and groups units fit the heritage
// topic and are shared in g2.ts; the units below cover the rest.
// First Nations, Métis, Inuit and francophone content is kept light and accurate: present tense, living
// communities, and "some" or "many" rather than one description for every Nation. Nothing sacred or ceremonial.

// ---------- Canada's physical regions and natural resources ----------

const RESOURCE_SORT = {
  prompt: "Is the resource grown or dug up? Tap an item, then tap its basket.",
  hint: "Farmers grow crops and foresters grow trees. Oil, natural gas and coal are found under the ground.",
  bins: [
    { id: "grown", label: "grown", emoji: "🌱" },
    { id: "ground", label: "from the ground", emoji: "⛏️" },
  ],
  items: [
    { label: "wheat", emoji: "🌾", bin: "grown" },
    { label: "canola", emoji: "🌼", bin: "grown" },
    { label: "trees for lumber", emoji: "🌲", bin: "grown" },
    { label: "oil", emoji: "🛢️", bin: "ground" },
    { label: "natural gas", emoji: "🔥", bin: "ground" },
    { label: "coal", emoji: "⚫", bin: "ground" },
  ],
};

const REGIONS: Item[] = [
  q("A physical region is a part of a country that has similar…", "land and landforms", ["flags", "clothes"], "Physical regions are described by their land, rocks and plants."),
  q("Most of Alberta is in which physical region of Canada?", "the Interior Plains", ["the Arctic Lands", "the Appalachians"], "The Interior Plains are the flat prairies. The Rocky Mountains are in the Cordillera.", { d: 2 }),
  q("Alberta's Rocky Mountains are part of the…", "Cordillera", ["Canadian Shield", "Appalachians"], "The Cordillera is Canada's mountain region in the west.", { d: 2 }),
  q("Which is a natural resource?", "oil", ["a toy car", "a sidewalk"], "Natural resources come from nature. People did not make them.", { emoji: "🛢️" }),
  q("Which is a natural resource?", "water", ["a bicycle", "a hockey stick"], "Water is a natural resource we all need.", { emoji: "💧" }),
  q("Farmers in Alberta grow wheat and canola. These are natural resources that come from the…", "land", ["ocean", "clouds"], "Crops grow in soil.", { d: 2 }),
  q("Canola is a crop with yellow flowers. It is grown for its…", "seeds, which are used to make oil", ["roots for soup", "bark"], "Canola fields look like yellow carpets in summer.", { d: 2 }),
  q("Forests give us a natural resource called…", "wood", ["plastic", "glass"], "Wood from trees is used for houses, furniture and paper."),
  q("Which region of Canada is cold, windy and has few trees?", "the Arctic", ["the Prairies", "the Great Lakes"], "The far north is very cold and has tundra.", { d: 2 }),
  q("The Canadian Shield is a region of…", "very old rock, lakes and forests", ["sandy deserts", "tall skyscrapers"], "The Shield covers much of northern Canada.", { d: 3 }),
  q("The Prairies are good for…", "growing crops and raising cattle", ["catching ocean fish", "mining coral"], "The flat, open land has rich soil.", { d: 2 }),
  q("Fish are a natural resource found in…", "lakes and oceans", ["mountains only", "deserts only"], "People fish in lakes, rivers and oceans."),
  q("The Rocky Mountains have trees, rock and rivers. Which resource could people use for building?", "wood from the trees", ["wool from sheep", "cotton from fields"], "Forests grow on many mountain slopes.", { d: 3 }),
  q("Why should we use natural resources with care?", "so there is enough for the future", ["so nobody can use them", "because they do not matter"], "Careful use helps resources last."),
  q("Oil and natural gas are found…", "under the ground", ["in the sky", "in the sea only"], "They are pumped up from deep under the ground in places like Alberta.", { d: 3 }),
  q("Wind and sunshine can be used to make…", "electricity", ["bread", "paper"], "Wind turbines and solar panels make power.", { d: 3 }),
  q("Which resource do people drink?", "fresh water", ["salt water", "oil"], "We need clean fresh water.", { d: 2 }),
  q("A rancher raises cattle on grassland. Cattle give us…", "beef and milk", ["wool and silk", "lumber"], "Cattle ranches are common in southern Alberta.", { d: 2 }),
  q("Which is NOT a natural resource?", "a phone", ["a tree", "a river"], "A phone is made by people from natural resources.", { d: 2 }),
  q("Which of these does Alberta have a lot of?", "wide prairies and tall mountains", ["tropical beaches", "a desert with camels"], "Alberta has prairies, foothills and the Rockies.", { d: 3 }),
];

// ---------- Leaders in Canada ----------

const LEADER_SORT = {
  prompt: "Who leads it? Tap an item, then tap its basket.",
  hint: "The prime minister leads Canada. A premier leads a province. A mayor leads a city or town.",
  bins: [
    { id: "pm", label: "prime minister", emoji: "🍁" },
    { id: "premier", label: "premier", emoji: "🏛️" },
    { id: "mayor", label: "mayor", emoji: "🏙️" },
  ],
  items: [
    { label: "leads the whole country", emoji: "🍁", bin: "pm" },
    { label: "works in Ottawa", emoji: "🏛️", bin: "pm" },
    { label: "leads a province or territory", emoji: "🗺️", bin: "premier" },
    { label: "leads the government of Alberta", emoji: "🌾", bin: "premier" },
    { label: "leads a city or town", emoji: "🏙️", bin: "mayor" },
    { label: "works at city hall", emoji: "🏢", bin: "mayor" },
  ],
};

const LEADERS: Item[] = [
  q("Who is the leader of the government of Canada?", "the prime minister", ["the premier", "the mayor"], "The prime minister leads the country.", { emoji: "🍁" }),
  q("Who is the leader of a province?", "the premier", ["the prime minister", "the mayor"], "Each province has a premier."),
  q("Who is the leader of a city or town?", "the mayor", ["the premier", "the prime minister"], "A mayor works for the people of a city or town."),
  q("Where is Canada's capital city?", "Ottawa", ["Calgary", "Vancouver"], "Ottawa is in Ontario, on the Ottawa River.", { d: 2 }),
  q("What is Alberta's capital city?", "Edmonton", ["Calgary", "Lethbridge"], "Edmonton is Alberta's capital. The Legislature building is there.", { d: 2 }),
  q("Each province has a premier. Do the territories have premiers too?", "Yes", ["No, never", "Only on holidays"], "Yukon, the Northwest Territories and Nunavut each have a premier.", { d: 3 }),
  q("Alberta is a…", "province", ["territory", "country"], "Alberta is one of Canada's ten provinces.", { d: 2 }),
  q("How many provinces are in Canada?", "10", ["3", "20"], "Canada has 10 provinces and 3 territories.", { d: 3 }),
  q("How do many leaders get their jobs?", "People vote in elections", ["Nobody picks them", "They win a race"], "In an election, citizens choose their leaders."),
  q("A leader's job is to help…", "make decisions for the people they serve", ["only themselves", "no one"], "Leaders work for the people."),
  q("Which job is a leader's responsibility?", "listening to the people they serve", ["ignoring them", "closing all libraries"], "Good leaders listen.", { d: 2 }),
  q("People who are elected to the Alberta Legislature are called…", "MLAs", ["mayors", "judges"], "MLA stands for Member of the Legislative Assembly.", { d: 3 }),
  q("The mayor of your town leads the…", "town council", ["school bus", "hockey team"], "A mayor and councillors make decisions for a town.", { d: 2 }),
  q("A leader says, “Let's hear everyone's ideas.” This is a good way to…", "include different voices", ["stop the meeting", "avoid listening"], "Good leaders ask for many views.", { d: 3 }),
  q("When people vote, what do they choose?", "a leader or a plan", ["the weather", "their age"], "Voting is one way people have a say."),
  q("Which place is where a province's laws are made?", "the Legislature building", ["a grocery store", "a hockey rink"], "In Alberta, it is in Edmonton.", { d: 3 }),
  q("Which of these is a leader of a province?", "a premier", ["a principal", "a bus driver"], "A principal leads a school.", { d: 2 }),
];

// ---------- Heritage across Canada ----------

const HERITAGE: Item[] = [
  q("Heritage is…", "traditions, stories and ways of living passed down", ["a kind of weather", "a toy shop"], "Heritage connects us with people who lived before."),
  q("Which two languages are Canada's official languages?", "English and French", ["Spanish and Latin", "Arabic and Greek"], "Canada's official languages are English and French.", { d: 2 }),
  q("Many francophone communities in Alberta speak…", "French", ["Mandarin only", "Latin"], "Alberta has francophone communities in places such as Edmonton, Falher and St. Paul.", { d: 2 }),
  q("Which of these is a First Nation with communities in Alberta?", "the Cree", ["the Romans", "the Vikings"], "Cree, Blackfoot, Dene, Stoney Nakoda and Tsuut'ina are some of the First Nations in Alberta.", { d: 3 }),
  q("Alberta is home to First Nations, Métis and Inuit people. They are…", "living communities today", ["only in the past", "only in books"], "First Nations, Métis and Inuit communities are part of Alberta now.", { d: 2 }),
  q("Alberta has eight Métis Settlements. They are…", "communities where Métis people live", ["ski resorts", "large airports"], "Alberta is the only province with Métis Settlement land that has its own laws.", { d: 3 }),
  q("Many Inuit live in the Arctic and some live in Alberta cities too. Inuit are…", "an Indigenous people", ["visitors from space", "a type of weather"], "Inuit have their own language, Inuktitut, and rich traditions.", { d: 3 }),
  q("People first lived on this land long before Canada became a country. These people are…", "First Nations, Métis and Inuit", ["only newcomers", "no one"], "Indigenous peoples have lived here for thousands of years.", { d: 2 }),
  q("Why do many places in Alberta have signs in more than one language?", "Many people speak different languages", ["Signs like colours", "It is a rule for pets"], "Canada has many languages in its communities.", { d: 2 }),
  q("In Vegreville, Alberta, there is a giant decorated egg called a pysanka. It shows the heritage of…", "Ukrainian Canadians", ["Arctic hunters", "ancient Greeks"], "A pysanka is a Ukrainian decorated egg. Many Ukrainian families came to Alberta long ago.", { d: 3 }),
  q("Families came to Canada from many countries. This makes Canadian communities…", "diverse", ["all the same", "empty"], "Diverse means a mix of many different peoples and traditions."),
  q("Which festival is a spring harvest and new year celebration for many Sikh families?", "Vaisakhi", ["Canada Day", "Halloween"], "Vaisakhi is celebrated in many Canadian cities.", { d: 3 }),
  q("Which celebration is held on July 1 across Canada?", "Canada Day", ["Remembrance Day", "Diwali"], "Canada Day marks the anniversary of Confederation.", { d: 2 }),
  q("A family shares a recipe from their grandmother's country. This is a way to…", "pass on heritage", ["forget the past", "end a tradition"], "Foods, songs and stories help heritage live on.", { d: 2 }),
  q("A person who speaks French in Canada can be called…", "a francophone", ["a geologist", "a baker"], "A francophone is a French-speaking person.", { d: 3 }),
  q("Why do we listen carefully when someone shares their heritage?", "to learn and show respect", ["to make fun of it", "because we must win"], "Respect helps communities live well together."),
  q("A new neighbour tells you about a holiday you do not know. What is a good response?", "“Tell me about it!”", ["“That is weird.”", "“I'm not listening.”"], "Be curious and kind.", { d: 2 }),
  q("Many Canadians trace their heritage to…", "countries all around the world", ["only one place", "nowhere"], "Canada is home to people from all over the world.", { d: 2 }),
  q("Treaty 6, Treaty 7 and Treaty 8 cover land in Alberta. A treaty is…", "an agreement between peoples", ["a kind of tree", "a type of boat"], "Treaties are promises made between First Nations and the Crown.", { d: 3 }),
];

// ---------- Trade and transportation ----------

const TRADE_SORT = {
  prompt: "Is the trade close to home or far away? Tap an item, then tap its basket.",
  hint: "Local trade happens in your own community. Trade far away uses trucks, trains, ships and planes.",
  bins: [
    { id: "near", label: "close to home", emoji: "🏘️" },
    { id: "far", label: "far away", emoji: "🌍" },
  ],
  items: [
    { label: "buying carrots at a farmers' market", emoji: "🥕", bin: "near" },
    { label: "swapping toys with a neighbour", emoji: "🧸", bin: "near" },
    { label: "selling lemonade on your street", emoji: "🍋", bin: "near" },
    { label: "bananas shipped from another country", emoji: "🍌", bin: "far" },
    { label: "canola sold to other countries", emoji: "🌼", bin: "far" },
    { label: "oranges brought in from a warm place", emoji: "🍊", bin: "far" },
  ],
};

const TRADE: Item[] = [
  q("Trade means…", "exchanging goods or services", ["keeping everything", "throwing things away"], "People trade by buying, selling and swapping."),
  q("When people in a community buy bananas from far away, they use…", "trade and transportation", ["only a library", "only a park"], "Bananas do not grow in Canada, so they are brought here.", { emoji: "🍌" }),
  q("Which one carries goods across the ocean?", "a ship", ["a bicycle", "a skateboard"], "Big ships carry goods between countries.", { emoji: "🚢" }),
  q("Which one carries goods fast over long distances in the air?", "a plane", ["a tractor", "a wagon"], "Planes move goods and people quickly.", { emoji: "✈️" }),
  q("Which one carries lots of grain overland to a port?", "a train", ["a canoe", "a scooter"], "Long trains can carry grain from the Prairies to ports.", { d: 2, emoji: "🚆" }),
  q("A truck brings milk from a farm to a store. This helps a community by…", "bringing food people need", ["making roads disappear", "stopping trade"], "Transportation moves goods to where people need them.", { d: 2 }),
  q("A highway links Edmonton and Calgary. How does it help people?", "It lets people and goods travel between cities", ["It keeps cities apart", "It stops trucks"], "Roads connect communities.", { d: 2 }),
  q("A farmers' market lets farmers…", "sell what they grow to people nearby", ["only mail things", "close their farms"], "Farmers' markets are a form of local trade.", { d: 2 }),
  q("Alberta sells canola, beef and other goods to other places. Selling goods to other places is called…", "trade", ["recess", "weather"], "Alberta trades with other provinces and other countries.", { d: 3 }),
  q("What do we call things that are sold to another country?", "exports", ["imports", "passengers"], "Goods sent out of a country are exports.", { d: 3 }),
  q("What do we call things that are brought into a country to be sold?", "imports", ["exports", "weather"], "Goods coming in are imports.", { d: 3 }),
  q("Why do many communities have bus routes?", "to help people get to work, school and stores", ["to block traffic", "to make noise"], "Transportation helps people move around."),
  q("A community with a good road, a rail line and an airport can…", "trade with many other places", ["trade with no one", "stay completely alone"], "More ways to travel mean more chances to trade.", { d: 3 }),
  q("Which job helps move goods from one place to another?", "a truck driver", ["a baker", "a librarian"], "Truck drivers carry goods along the roads.", { d: 2 }),
  q("Which is a way to travel on water?", "a ferry", ["a bike", "a train"], "Ferries carry people and vehicles over water.", { d: 2 }),
  q("People in one community make boots. Another community grows wheat. They can…", "trade boots for wheat or money", ["never meet", "stop eating"], "Trade helps communities get what they need.", { d: 3 }),
  q("Why do stores in Alberta sell oranges in winter?", "They are brought from warm places", ["Oranges grow in snow", "They fall from the sky"], "Transportation brings food from warmer places.", { d: 2 }),
];

// ---------- Talking and deciding together ----------

const DEMO_SORT = {
  prompt: "Does it help a group decide well? Tap an item, then tap its basket.",
  hint: "Good group members listen, wait their turn, give reasons and respect different ideas.",
  bins: [
    { id: "help", label: "helps", emoji: "👍" },
    { id: "hurt", label: "does not help", emoji: "🚫" },
  ],
  items: [
    { label: "listening to every idea", emoji: "👂", bin: "help" },
    { label: "waiting for your turn", emoji: "✋", bin: "help" },
    { label: "giving a reason for your idea", emoji: "💬", bin: "help" },
    { label: "voting fairly", emoji: "🗳️", bin: "help" },
    { label: "shouting over others", emoji: "📢", bin: "hurt" },
    { label: "making fun of an idea", emoji: "😝", bin: "hurt" },
    { label: "refusing to listen", emoji: "🙉", bin: "hurt" },
  ],
};

const VOTE_ORDER = order("Put the steps for a class vote in order.", "First we share ideas, then we vote, then we count, and last we say the result.", [
  ["Share ideas", "💬"],
  ["Vote", "🗳️"],
  ["Count the votes", "🔢"],
  ["Say the result", "📣"],
]);

const TALK: Item[] = [
  q("Your class must pick a game. Everyone has a different idea. What is a fair way to decide?", "listen, then vote", ["let the loudest voice win", "pick the first idea"], "Voting is a fair way to decide when ideas differ."),
  q("In a vote, the idea with the most votes…", "wins", ["loses", "is thrown away"], "The most votes make the group's decision."),
  q("Ravi's idea did not get the most votes. What should he do?", "accept the result kindly", ["storm off", "say the vote was silly"], "Respect the group's choice even when it is not yours.", { d: 2 }),
  q("When it is your turn to share, what is a good thing to do?", "say your idea clearly and give a reason", ["whisper so no one hears", "say nothing"], "Reasons help others understand your idea."),
  q("Another student shares a different idea from yours. What is a polite thing to say?", "“Thanks for sharing. I think differently.”", ["“That is dumb.”", "“You can't say that.”"], "You can disagree and still be respectful.", { d: 2 }),
  q("What does “compromise” mean?", "each person gives a little to find a plan that works", ["one person gets everything", "no one speaks"], "A compromise helps everyone feel heard.", { d: 3 }),
  q("Two friends both want the swing. A fair plan is…", "take turns", ["fight", "break the swing"], "Taking turns is a fair solution."),
  q("Why do we share ideas before we vote?", "to hear different views", ["to waste time", "to make the vote harder"], "We vote better when we have listened first.", { d: 2 }),
  q("Everyone in a group should have a chance to…", "speak and be heard", ["only listen", "leave quietly"], "Democracy means everyone has a say."),
  q("What is a democracy?", "a way of making decisions where people have a say", ["a place with no rules", "a kind of weather"], "In a democracy, people vote and share their views.", { d: 3 }),
  q("A quiet student has not had a turn to share. What can the group do?", "invite them to speak", ["skip them", "laugh"], "Good group members make room for everyone.", { d: 2 }),
  q("When you disagree, which is better?", "explain your view calmly", ["yell", "walk out"], "Calm words help a group solve problems."),
  q("A group lists three ideas. What can help choose?", "a vote", ["a fight", "no plan"], "Voting is a clear way to choose.", { d: 2 }),
  q("When the class votes by raising hands, you should…", "vote only once", ["vote five times", "vote for everything"], "One person gets one vote.", { d: 2 }),
  q("What can we do if a group decision does not go our way?", "think about how to try again next time", ["quit the class", "refuse to join in"], "Everyone has a chance to share another day.", { d: 3 }),
  q("Why do rules help a group?", "They help everyone be safe and fair", ["They stop all fun", "They are only for teachers"], "Rules and fair ways to decide help a group get along."),
];

export const units: Unit[] = [
  {
    id: "regions-resources-ab",
    title: "Canada's Regions and Resources",
    emoji: "🗺️",
    blurb: "Prairies, mountains and what we get from the land",
    standards: ab("Canada's physical regions and natural resources", "Canada's land regions, and natural resources such as water, wood, oil and crops"),
    parentNote: "Canada has several physical regions, such as the Cordillera (the western mountains), the Interior Plains (the Prairies), the Canadian Shield and the Arctic. Alberta is mostly in the Interior Plains and the Cordillera. Children also learn about natural resources and why we use them with care.",
    generate: unitOf(REGIONS, [sorter(RESOURCE_SORT)]),
  },
  {
    id: "heritage-ab",
    title: "Heritage Across Canada",
    emoji: "🧡",
    blurb: "First Nations, Métis, Inuit, francophone and newcomer communities",
    standards: ab("traditions and heritages across Canada, including those of First Nations, Métis, Inuit, francophones, and diverse communities", "the traditions of First Nations, Métis, Inuit, francophone and many other communities in Canada"),
    parentNote: "Canada's communities have many languages, stories and traditions, including those of First Nations, Métis, Inuit and francophone peoples and newcomers from around the world. Children learn that these are living communities and that heritage deserves respect. The Indigenous content is light. Deeper content should be developed with First Nations, Métis and Inuit partners.",
    generate: unitOf(HERITAGE),
  },
  {
    id: "trade-transport-ab",
    title: "Trade and Transportation",
    emoji: "🚚",
    blurb: "How goods and people get where they need to go",
    standards: ab("ways trade and transportation support communities", "how trade and transportation by road, rail, air and water bring communities what they need"),
    parentNote: "Communities trade goods and move them by truck, train, plane and ship. Trade and transportation bring people the things they cannot grow or make nearby, and let communities sell what they produce.",
    generate: unitOf(TRADE, [sorter(TRADE_SORT)]),
  },
  {
    id: "leaders-ab",
    title: "Leaders in Canada",
    emoji: "🏛️",
    blurb: "Prime minister, premiers and mayors",
    standards: ab("leaders in Canada, including the prime minister and the premiers", "the prime minister, premiers and mayors, and how people choose their leaders"),
    parentNote: "The prime minister leads Canada, a premier leads each province or territory and a mayor leads a city or town. Leaders are chosen by voting. This unit never names the people currently in these jobs, so it stays true over time.",
    generate: unitOf(LEADERS, [sorter(LEADER_SORT)]),
  },
  {
    id: "talking-together-ab",
    title: "Talking and Deciding Together",
    emoji: "🗳️",
    blurb: "Listening, giving reasons and voting fairly",
    standards: ab("competencies for democratic discussion and decision making", "listening, taking turns, giving reasons, respecting different views and voting fairly"),
    parentNote: "Democratic habits start small: listening to every idea, waiting for a turn, giving reasons, disagreeing kindly and voting fairly. These help children take part in class and community decisions.",
    generate: unitOf(TALK, [sorter(DEMO_SORT), VOTE_ORDER]),
  },
];
