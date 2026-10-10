import { shuffle } from "../random";
import type { GenerateOptions, Question, Unit } from "../types";
import { type Item, levelled, orderQuestion } from "../ontario/g7-bank";
import { ab, levelOf } from "./kit";

// Alberta Grade 7 social studies (2005): 7.1 Toward Confederation and 7.2 Following Confederation: Canadian
// Expansions, under "Canada: Origins, Histories and Movement of Peoples". These units add the western and
// Alberta story to the shared New France, 1713 to 1800, War of 1812 and reform units.
// First Nations and Métis content is written in the present tense and left light; it needs review with
// First Nations and Métis partners before launch.

// ---------- The fur trade in the West (7.1) ----------

const FUR_STEPS = [
  { id: "hbc", label: "Hudson's Bay Company receives its charter, 1670", emoji: "📜" },
  { id: "nwc", label: "North West Company formed in Montreal, 1779", emoji: "🛶" },
  { id: "chip", label: "A trading post is built at Fort Chipewyan, 1788", emoji: "🏚️" },
  { id: "edm", label: "Fort Edmonton, a Hudson's Bay Company post, is built on the North Saskatchewan River, 1795", emoji: "🏘️" },
  { id: "merge", label: "The two companies join, 1821", emoji: "🤝" },
];

const FUR_BANK: Item[] = [
  { prompt: "Which company received a royal charter in 1670 to trade in the Hudson Bay region?", right: "The Hudson's Bay Company", wrong: ["The North West Company", "The Canadian Pacific Railway", "The Alberta Trading Company"], hint: "The Hudson's Bay Company was based in London, England." },
  { prompt: "Why did the fur trade depend on First Nations and Métis people?", right: "They knew the land, trapped and prepared furs, and were trading partners and guides", wrong: ["They did not take part in the trade", "They built all the forts alone", "They only bought goods"], hint: "Trade was a partnership." },
  { prompt: "Cree, Dene and Blackfoot peoples all traded with the companies in what is now Alberta. What does this show?", right: "There were many different Nations, each with its own language and culture", wrong: ["There was only one Nation in the West", "All Nations spoke the same language", "No Nations lived in the West"], hint: "Never treat all Nations as one." },
  { prompt: "What was pemmican?", right: "Dried bison meat mixed with fat and sometimes berries, used as long-lasting food", wrong: ["A kind of canoe", "A trade fort", "A fur hat"], hint: "Pemmican fed traders on long journeys." },
  { prompt: "Who made much of the pemmican and moved goods by Red River cart in the fur trade?", right: "Many Métis families", wrong: ["Only British soldiers", "Only people from Europe", "Only gold miners"], hint: "The Métis have a long history in the western fur trade." },
  { prompt: "Why were beaver pelts in demand in Europe?", right: "They were made into fashionable felt hats", wrong: ["They were burned for fuel", "They were used for rope", "They were eaten as food"], hint: "Felt made from beaver fur was waterproof." },
  { prompt: "David Thompson, who worked for the North West Company, is remembered for…", right: "mapping large parts of western North America", wrong: ["building the CPR", "signing Treaty 7", "leading the Red River Resistance"], hint: "He was a fur trader and surveyor." },
  { prompt: "Fur trade posts such as Fort Edmonton were built beside rivers. Why?", right: "Rivers were the main routes for travel and moving goods", wrong: ["There were no roads or rivers", "Rivers were never used for trade", "Posts had to be far from water"], hint: "Canoes and boats carried people and goods." },
  { prompt: "Why did the Hudson's Bay Company and the North West Company join in 1821?", right: "Competition was costly and sometimes violent", wrong: ["The Rocky Mountains moved", "Both wanted to stop trading", "Canada was formed that year"], hint: "Joining ended the rivalry." },
  { prompt: "What did First Nations trading partners often receive in the trade?", right: "Goods such as metal tools, cloth, guns and kettles", wrong: ["Only paper money", "Only land", "Nothing at all"], hint: "Trade goods were exchanged for furs and food.", hard: true },
  { prompt: "Rupert's Land was the huge territory whose rivers drain into Hudson Bay. Who claimed to hold it by royal charter?", right: "The Hudson's Bay Company", wrong: ["The Government of Alberta", "The Dominion of Canada in 1670", "The United States"], hint: "The Crown's claim did not consider the Nations who already lived there.", hard: true },
  { prompt: "The fur trade changed the lives of Indigenous peoples. One long-term effect was…", right: "new trade goods and, with settlers, disease and pressure on the land", wrong: ["no change at all", "the end of all trade", "every Nation moved to Europe"], hint: "The trade brought benefits and hardships.", hard: true },
];

function furTrade(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  return shuffle([orderQuestion("Put these events in the order they happened.", "Charter 1670, North West Company 1779, Fort Chipewyan 1788, Edmonton post 1795, merger 1821.", FUR_STEPS, d), ...levelled(FUR_BANK, 7, d)]);
}

// ---------- Confederation (7.1) ----------

const CONFED_STEPS = [
  { id: "char", label: "Charlottetown Conference, 1864", emoji: "🏛️" },
  { id: "que", label: "Quebec Conference, 1864", emoji: "🏰" },
  { id: "lon", label: "London Conference, 1866", emoji: "🇬🇧" },
  { id: "conf", label: "Confederation creates Canada, 1867", emoji: "🎉" },
  { id: "man", label: "Manitoba joins, 1870", emoji: "🌾" },
  { id: "bc", label: "British Columbia joins, 1871", emoji: "🏔️" },
  { id: "pei", label: "Prince Edward Island joins, 1873", emoji: "🏝️" },
];

const CONFED_BANK: Item[] = [
  { prompt: "On July 1, 1867, which colonies joined to form the Dominion of Canada?", right: "Nova Scotia, New Brunswick, and the Province of Canada split into Ontario and Quebec", wrong: ["British Columbia, Alberta and Manitoba", "Newfoundland and Prince Edward Island only", "Ontario and the United States"], hint: "There were four provinces at first." },
  { prompt: "What is Confederation?", right: "The joining of colonies into one country under one federal government", wrong: ["A war between colonies", "A trade company", "A railway"], hint: "A confederation is a union of separate parts." },
  { prompt: "Who was Canada's first prime minister?", right: "Sir John A. Macdonald", wrong: ["George Brown", "Louis Riel", "Alexander Mackenzie"], hint: "He led the government in 1867." },
  { prompt: "Which was one reason many colonial leaders supported Confederation?", right: "Fear of invasion from the United States and the need to share defence costs", wrong: ["Gold was found in every colony", "Britain forced the colonies to leave", "The colonies wanted to stop trading"], hint: "After the American Civil War, some feared the United States." },
  { prompt: "Another reason for Confederation was a political deadlock in the Province of Canada. What does deadlock mean?", right: "Neither side had enough support to pass laws", wrong: ["The colony ran out of money", "Everyone agreed", "There was no government"], hint: "Parties were nearly equal in strength." },
  { prompt: "Why did the colonies want a railway to link them together?", right: "To move people and goods and strengthen trade", wrong: ["To stop all trade", "To carry mail only", "To block the Atlantic Ocean"], hint: "Railways were key to trade and to holding the country together." },
  { prompt: "The Charlottetown Conference of 1864 was first called to discuss…", right: "a union of the Maritime colonies", wrong: ["building the CPR", "joining the United States", "a treaty with the Blackfoot"], hint: "Leaders from the Province of Canada then asked to join the talks." },
  { prompt: "At the Quebec Conference, leaders agreed on 72 Resolutions. What did these become?", right: "The base of the British North America Act", wrong: ["The first Alberta law", "A trade treaty with France", "Treaty 6"], hint: "Britain's Parliament passed the Act in 1867." },
  { prompt: "Who took part in the Confederation talks?", right: "Only a small group of colonial men; women, First Nations, Métis and Inuit were not at the talks", wrong: ["Every adult living in the colonies", "All First Nations leaders", "Women's groups"], hint: "Many people's voices were left out of the decisions.", hard: true },
  { prompt: "In 1867, the area that is now Alberta was part of…", right: "Rupert's Land and the North-Western Territory, not part of the new Dominion", wrong: ["Ontario", "Quebec", "Nova Scotia"], hint: "Alberta did not exist as a province until 1905." },
  { prompt: "The government of Canada got Rupert's Land from the Hudson's Bay Company in 1869 to 1870. What did it include?", right: "Much of the Prairies, including most of present-day Alberta", wrong: ["Only Newfoundland", "Only Nova Scotia", "Only Vancouver Island"], hint: "Canada more than doubled in size." },
  { prompt: "Which was the first province to join Canada after the original four?", right: "Manitoba (1870)", wrong: ["Alberta (1870)", "British Columbia (1870)", "Newfoundland (1870)"], hint: "The Manitoba Act was passed in 1870." },
  { prompt: "Responsible government means…", right: "the government must have the support of the elected assembly", wrong: ["the government never changes", "the governor decides everything", "only the Queen can vote"], hint: "The government answers to the people's elected representatives." },
  { prompt: "In what year did Alberta and Saskatchewan become provinces?", right: "1905", wrong: ["1867", "1870", "1949"], hint: "Both joined the same year.", hard: true },
];

function confederation(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  return shuffle([orderQuestion("Put these events in the order they happened.", "Charlottetown 1864, Quebec 1864, London 1866, Confederation 1867, Manitoba 1870, BC 1871, PEI 1873.", CONFED_STEPS, d), ...levelled(CONFED_BANK, 7, d)]);
}

// ---------- Red River, the Métis and the North-West (7.2) ----------

const METIS_BANK: Item[] = [
  { prompt: "Who are the Métis?", right: "A distinct Indigenous people whose roots lie in relationships between First Nations and European fur traders, with their own language, culture and history", wrong: ["Settlers who arrived in 1905", "A fur trading company", "Another name for all First Nations"], hint: "The Métis are one of the three recognized Indigenous peoples in Canada." },
  { prompt: "The Red River Settlement was home to many Métis. In what province is it today?", right: "Manitoba", wrong: ["Alberta", "Nova Scotia", "British Columbia"], hint: "Winnipeg is near where the Red and Assiniboine rivers meet." },
  { prompt: "Who led the Métis provisional government at Red River in 1869 and 1870?", right: "Louis Riel", wrong: ["John A. Macdonald", "David Thompson", "Crowfoot"], hint: "Riel is called the founder of Manitoba by many." },
  { prompt: "Why did the Métis at Red River resist the Canadian survey in 1869?", right: "They feared losing their land and way of life and had not been consulted", wrong: ["They wanted to build a railway", "They wanted gold", "They were asked to leave Canada"], hint: "Canada was taking over Rupert's Land without asking the people living there." },
  { prompt: "The Manitoba Act of 1870 did what?", right: "Created the province of Manitoba and included some protections for Métis land and language", wrong: ["Created Alberta", "Ended the fur trade", "Built the CPR"], hint: "Manitoba started out as a small \"postage stamp\" province." },
  { prompt: "In 1885, Métis and First Nations people resisted the government's actions in the North-West. Which Métis leader helped lead the military resistance at Batoche?", right: "Gabriel Dumont", wrong: ["John A. Macdonald", "George Brown", "Wilfrid Laurier"], hint: "Dumont was an excellent hunter and leader." },
  { prompt: "Louis Riel was executed in 1885. Today, many people…", right: "remember him as a Métis leader and defender of Métis rights", wrong: ["have forgotten him completely", "say he led the CPR", "think he was a British general"], hint: "Riel's legacy is still discussed today." },
  { prompt: "How many Métis Settlements are there in Alberta?", right: "Eight", wrong: ["Two", "Twenty", "None"], hint: "Alberta is the only province with a recognized Métis land base." },
  { prompt: "Métis Settlements in Alberta are important because they are…", right: "the only recognized Métis land base in Canada, governed under Alberta law", wrong: ["fur trade forts", "railway stations", "military camps"], hint: "The Métis Settlements Act was passed in 1990." },
  { prompt: "Red River carts were a symbol of Métis travel and trade. What was special about them?", right: "They were built from wood, with no metal, and could be repaired anywhere on the Prairies", wrong: ["They ran on rails", "They flew", "They used steam engines"], hint: "Wood and leather could be fixed on the trail.", hard: true },
  { prompt: "In 1869 to 1870 the HBC gave up its claim to Rupert's Land to Canada. Why do many Métis and First Nations people say this was unfair?", right: "The people who lived there were not asked", wrong: ["The land was too small", "The railway had been finished already", "Alberta was already a province"], hint: "Indigenous peoples had lived on this land for thousands of years.", hard: true },
  { prompt: "Which two Prairie provinces were formed in 1905 from the North-West Territories?", right: "Alberta and Saskatchewan", wrong: ["Manitoba and Alberta", "Ontario and Quebec", "British Columbia and Alberta"], hint: "The North-West Territories included much of the Prairies." },
];

function metis(opts?: GenerateOptions): Question[] {
  return shuffle(levelled(METIS_BANK, 8, levelOf(opts)));
}

// ---------- Treaties in the West (7.2) ----------

const TREATY_BANK: Item[] = [
  { prompt: "What is a treaty?", right: "A formal agreement between nations or governments", wrong: ["A kind of railway", "A fur pelt", "A law about taxes"], hint: "The numbered treaties were made between First Nations and the Crown (the government)." },
  { prompt: "The numbered treaties were made between First Nations and the Crown from 1871 to 1921. How many are there?", right: "Eleven", wrong: ["One", "Three", "Fifty"], hint: "They are called Treaties 1 to 11." },
  { prompt: "Which numbered treaty covers central Alberta, including the Edmonton area?", right: "Treaty 6", wrong: ["Treaty 1", "Treaty 11", "Treaty 9"], hint: "Treaty 6 was made in 1876." },
  { prompt: "Which numbered treaty covers southern Alberta, including the Calgary area?", right: "Treaty 7", wrong: ["Treaty 2", "Treaty 10", "Treaty 3"], hint: "Treaty 7 was made in 1877 at Blackfoot Crossing." },
  { prompt: "Which numbered treaty covers northern Alberta?", right: "Treaty 8", wrong: ["Treaty 1", "Treaty 4", "Treaty 7"], hint: "Treaty 8 was made in 1899." },
  { prompt: "Why do many First Nations leaders and Elders say they entered into treaties?", right: "To build a relationship and share the land and its resources while protecting their way of life", wrong: ["To give up their languages", "Because they wanted to leave", "To end all trade"], hint: "Many Nations share oral histories of the treaty promises." },
  { prompt: "Why was it important to First Nations to have treaties made in the 1870s?", right: "The bison herds were disappearing and people faced hunger and disease", wrong: ["The CPR was already finished", "Alberta was already a province", "They wanted to join the United States"], hint: "Bison had been a main source of food and goods on the Plains.", hard: true },
  { prompt: "The Crown's written treaty text and First Nations' oral histories sometimes describe the treaties differently. What does this show?", right: "People can have different understandings of the same event", wrong: ["Only the written version counts", "Nothing was ever agreed", "Treaties cannot be studied"], hint: "Historians look at both written and oral sources.", hard: true },
  { prompt: "Treaty 7 was signed in 1877 at Blackfoot Crossing. Which Nations are part of Treaty 7?", right: "The Siksika, Kainai, Piikani, Tsuut'ina and Stoney Nakoda Nations", wrong: ["Only the Cree", "Only the Dene", "All Nations in Canada"], hint: "Treaty 7 includes several Nations, each with its own history." },
  { prompt: "Are treaties still important today?", right: "Yes, they are still in effect and are part of Canada's laws and relationships", wrong: ["No, they ended in 1905", "No, they ended when the CPR finished", "Only for Ontario"], hint: "Treaty rights are recognized in the Constitution." },
  { prompt: "What is a reserve (also called a reserve land)?", right: "Land set aside for the use of a First Nation under the treaties", wrong: ["A fur trading fort", "A railway station", "A town for settlers"], hint: "First Nations people live on reserves and also in towns and cities." },
  { prompt: "The Indian Act (1876) is a law that…", right: "gave the government control over many parts of First Nations people's lives, and caused harm", wrong: ["created the CPR", "formed the province of Alberta", "ended the bison hunt"], hint: "It is still in force today but has been changed many times.", hard: true },
  { prompt: "Residential schools were run by churches for the government. What was one result for many children?", right: "They were taken from their families and lost time with their language and culture", wrong: ["They received a better education than anyone", "They all came home each night", "They became prime ministers"], hint: "Survivors have told their stories so that Canadians learn the truth.", hard: true },
  { prompt: "What did the Truth and Reconciliation Commission (2008 to 2015) do?", right: "It listened to survivors and made 94 Calls to Action", wrong: ["It built the first railway", "It made Treaty 6", "It created the province of Alberta"], hint: "Reconciliation means building a respectful relationship.", hard: true },
];

function treaties(opts?: GenerateOptions): Question[] {
  return shuffle(levelled(TREATY_BANK, 8, levelOf(opts)));
}

// ---------- Railway, police and settlement of the West (7.2) ----------

const WEST_STEPS = [
  { id: "dl", label: "Dominion Lands Act offers homesteads, 1872", emoji: "🏡" },
  { id: "nwmp", label: "North-West Mounted Police formed, 1873", emoji: "🐴" },
  { id: "t7", label: "Treaty 7 is made, 1877", emoji: "📜" },
  { id: "cpr", label: "Canadian Pacific Railway is finished, 1885", emoji: "🚂" },
  { id: "ab", label: "Alberta becomes a province, 1905", emoji: "🌻" },
];

const WEST_BANK: Item[] = [
  { prompt: "What was the Canadian Pacific Railway (CPR)?", right: "A railway built to link eastern Canada to British Columbia", wrong: ["A fur trade fort", "A treaty", "A police force"], hint: "The last spike was driven in 1885." },
  { prompt: "In what year was the last spike of the CPR driven at Craigellachie, British Columbia?", right: "1885", wrong: ["1867", "1905", "1812"], hint: "It was the same year as the North-West Resistance." },
  { prompt: "Thousands of Chinese workers helped build the CPR through the mountains. What was true of this work?", right: "It was dangerous and low paid, and many workers died", wrong: ["It was safe and well paid", "They were given free land", "They were paid the same as other workers"], hint: "Chinese workers did some of the hardest and most dangerous jobs." },
  { prompt: "After the railway was finished, what did the Canadian government do to Chinese immigrants beginning in 1885?", right: "Charged a head tax, which made it very hard to come to Canada", wrong: ["Gave them free land", "Paid them to come", "Made them prime ministers"], hint: "The head tax was $50 at first, then $100 and $500." },
  { prompt: "What was a homestead?", right: "A free-or-low-cost piece of land (160 acres) for a settler who farmed and lived on it", wrong: ["A kind of fort", "A railway car", "A kind of treaty"], hint: "Settlers paid a small fee and had to farm the land." },
  { prompt: "The Dominion Lands Act of 1872 offered settlers 160 acres for a $10 fee. What did settlers have to do?", right: "Live on the land and farm it for several years", wrong: ["Build a railway", "Join the police", "Leave after one year"], hint: "Settlers had to prove they were farming the land." },
  { prompt: "Why did the government want settlers on the Prairies?", right: "To grow crops, build towns and establish Canadian claims to the land", wrong: ["To close down the railway", "To end farming", "To send people to Europe"], hint: "Settlement was part of the government's plan for the West." },
  { prompt: "What did the North-West Mounted Police do in the 1870s?", right: "Enforced Canadian law and helped the government manage the West", wrong: ["Built the CPR", "Hunted bison", "Led the fur companies"], hint: "The NWMP later became the RCMP." },
  { prompt: "What happened to the bison herds on the Plains by the early 1880s?", right: "They had almost disappeared because of overhunting", wrong: ["They doubled in size", "They moved to Ontario", "They became pets"], hint: "The loss of the bison hurt Plains Nations and Métis communities." },
  { prompt: "How did the railway change the Prairies?", right: "It brought settlers, goods and new towns, and let farmers ship grain", wrong: ["It stopped all travel", "It ended farming", "It closed the towns"], hint: "The CPR reached Calgary in 1883." },
  { prompt: "Many early Prairie settlers were from Britain and Europe. Which crop made much of the Prairies famous?", right: "Wheat", wrong: ["Bananas", "Coffee", "Rice"], hint: "Prairie wheat was shipped by rail to ports." },
  { prompt: "Which city became the capital of Alberta when it became a province in 1905?", right: "Edmonton", wrong: ["Calgary", "Lethbridge", "Red Deer"], hint: "Edmonton sits on the North Saskatchewan River." },
  { prompt: "Alberta was named after Princess Louise Caroline Alberta. Why is her name used?", right: "She was a daughter of Queen Victoria and wife of a governor general of Canada", wrong: ["She built the railway", "She signed Treaty 6", "She discovered gold in Alberta"], hint: "Lake Louise is named after her too.", hard: true },
  { prompt: "Why were many Prairie towns built along the railway line?", right: "The railway brought people and supplies and let farmers ship their grain", wrong: ["Railways were far from all farms", "Towns could only be built on lakes", "The railway only carried gold"], hint: "Grain elevators often stood beside the tracks." },
];

function west(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  return shuffle([orderQuestion("Put these events in the order they happened.", "Dominion Lands Act 1872, NWMP 1873, Treaty 7 1877, CPR finished 1885, Alberta 1905.", WEST_STEPS, d), ...levelled(WEST_BANK, 7, d)]);
}

// ---------- People on the move: immigration to the West (7.2) ----------

const MOVE_BANK: Item[] = [
  { prompt: "Why did many people from Europe come to the Prairies around 1900?", right: "The government offered land and advertised the West as a place to farm", wrong: ["They were sent by the fur companies", "They wanted to build Fort Edmonton", "They came to join the NWMP only"], hint: "Free or cheap land was a strong pull." },
  { prompt: "Clifford Sifton, Canada's Minister of the Interior from 1896, is known for…", right: "promoting immigration to the Prairies", wrong: ["leading the Métis resistance", "building the CPR", "signing Treaty 7"], hint: "He wanted farmers who would settle the West." },
  { prompt: "Many Ukrainian families began to settle in east-central Alberta from 1891. What did they do?", right: "Homesteaded and farmed, and built churches and communities", wrong: ["Built the first railway", "Led the fur trade", "Negotiated Treaty 6"], hint: "Many settlers brought languages, food and traditions with them." },
  { prompt: "In the early 1900s, Black families from the United States settled at Amber Valley and other places in Alberta. Why?", right: "They hoped for land and a better life, but they also met discrimination", wrong: ["They were sent by the CPR", "They were fur traders", "They worked for the NWMP"], hint: "Black pioneers built farms, churches and communities in Alberta." },
  { prompt: "What is immigration?", right: "Moving to a new country to live", wrong: ["Moving to a new house in the same town", "Travelling for a holiday", "Visiting another country for a short time"], hint: "Immigrants come from other countries." },
  { prompt: "What is a push factor in migration?", right: "A reason that makes people want to leave, such as war or poverty", wrong: ["A new road", "A better school", "A job in a new city"], hint: "Push factors push people out; pull factors pull them in." },
  { prompt: "What is a pull factor in migration?", right: "A reason that attracts people, such as free land and jobs", wrong: ["War", "Famine", "Fear"], hint: "The promise of land pulled many settlers to the Prairies." },
  { prompt: "Chinese immigrants faced a head tax and, in 1923, a law that nearly stopped Chinese immigration. Today the government…", right: "has apologized for these laws", wrong: ["still uses the head tax", "says it never happened", "gives everyone a prize"], hint: "In 2006 the Prime Minister apologized to Chinese Canadians." },
  { prompt: "People come to Alberta today from many countries. What does this mean for communities?", right: "Communities have many languages, foods and traditions", wrong: ["All communities are the same", "Only one language is spoken", "Immigration has stopped"], hint: "Canada has a diverse population." },
  { prompt: "Which of these is a way that immigrants have helped build the West?", right: "Farming, building railways, working in towns and starting businesses", wrong: ["Closing the border", "Removing the railway", "Stopping all trade"], hint: "People from many places built the West together." },
  { prompt: "Indigenous peoples have lived in the lands we now call Alberta for thousands of years. What does this mean for the history of the West?", right: "The story did not begin with settlers; many Nations and the Métis were here long before", wrong: ["No one lived here before 1867", "History began with the railway", "Only fur traders lived here"], hint: "A full history includes Indigenous peoples." },
  { prompt: "Some settlers faced hardship. Which of these was a challenge for homesteaders?", right: "Harsh winters, isolation and the work of breaking the land", wrong: ["Too many roads", "Too few mosquitoes", "Easy farming with no work"], hint: "Farming new land was hard work.", hard: true },
];

function movement(opts?: GenerateOptions): Question[] {
  return shuffle(levelled(MOVE_BANK, 8, levelOf(opts)));
}

export const units: Unit[] = [
  {
    id: "fur-trade-west-ab",
    title: "The Fur Trade in the West",
    emoji: "🦫",
    blurb: "Trading posts, partners and rivers",
    parentNote: "The Hudson's Bay Company and North West Company in the West, trading partnerships with First Nations and Métis people, pemmican and trading posts such as Fort Edmonton.",
    standards: ab("7.1", "the fur trade in western Canada and its partnerships with First Nations and Métis people"),
    generate: furTrade,
  },
  {
    id: "confederation-ab",
    title: "Confederation",
    emoji: "🇨🇦",
    blurb: "How Canada began in 1867",
    parentNote: "Why the colonies joined in 1867, the conferences that led to it, who was included in the decisions and who was not, and how the country grew to include the West.",
    standards: ab("7.1", "the reasons for Confederation, the conferences and the provinces that joined"),
    generate: confederation,
  },
  {
    id: "metis-red-river-ab",
    title: "The Métis & the Red River",
    emoji: "🏹",
    blurb: "Louis Riel and the Métis in the West",
    parentNote: "The Métis as a distinct Indigenous people, the Red River Settlement, Louis Riel and the Manitoba Act, 1885, and Métis Settlements in Alberta today.",
    standards: ab("7.2", "the Métis, the Red River Settlement and the expansion of Canada into the West"),
    generate: metis,
  },
  {
    id: "treaties-west-ab",
    title: "Treaties 6, 7 and 8",
    emoji: "🪶",
    blurb: "Agreements that still matter",
    parentNote: "The numbered treaties, especially Treaties 6, 7 and 8 in Alberta, different understandings of the treaties, and the Indian Act and residential schools in age-appropriate terms.",
    standards: ab("7.2", "the numbered treaties in the West, different perspectives on them and their continuing importance"),
    generate: treaties,
  },
  {
    id: "railway-settlement-ab",
    title: "Railway & Settlement",
    emoji: "🚂",
    blurb: "The CPR, the NWMP and homesteads",
    parentNote: "The Canadian Pacific Railway, the North-West Mounted Police, homesteading under the Dominion Lands Act, the loss of the bison and how Alberta became a province in 1905.",
    standards: ab("7.2", "the railway, the North-West Mounted Police, homesteading and the creation of Alberta"),
    generate: west,
  },
  {
    id: "people-on-the-move-ab",
    title: "People on the Move",
    emoji: "🧳",
    blurb: "Who came to the West, and why?",
    parentNote: "Reasons people moved to the Prairies, immigration policies, the contributions and hardships of newcomers including Ukrainian, Chinese and Black settlers, and the long history of Indigenous peoples in the West.",
    standards: ab("7.2", "immigration to the West, push and pull factors, and the contributions of newcomers"),
    generate: movement,
  },
];
