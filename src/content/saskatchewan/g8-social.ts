import type { SortSet } from "../bank";
import type { Unit } from "../types";
import { bankUnit, hq, order, q, type Item } from "../ontario/g3-4-kit";
import { sk } from "./kit";

// Saskatchewan Grade 8 Social Studies: Canadian identity (IN8.1–RW8.3). Neither BC nor Ontario teaches this
// course in Grade 8, so these units are written for Saskatchewan. First Nations, Métis and treaty content is kept
// to widely shared facts and needs review with partners before launch.

// ---------- Culture and immigration ----------

const CULTURE: Item[] = [
  q("Culture is…", "the shared beliefs, values, languages, customs and arts of a group", ["only food", "only clothing", "only music"], "Culture includes many things that a group of people share.", "🎭"),
  q("Canada's three Indigenous peoples recognized in the Constitution are…", "First Nations, Inuit and Métis", ["Cree, Dene and Haida only", "Vikings, Romans and Greeks", "French, English and Scots"], "The Constitution recognizes First Nations, Inuit and Métis peoples.", "🪶"),
  q("Canada's two founding European languages are…", "English and French", ["Latin and Greek", "Spanish and Italian", "German and Dutch"], "The Official Languages Act (1969) makes English and French official in federal institutions.", "🗣️"),
  q("What does multiculturalism mean?", "many cultures live side by side and are respected", ["everyone must be the same", "only one culture is allowed", "no one shares anything"], "Canada's multiculturalism policy began in 1971.", "🤝"),
  q("Which of these is a source of Canada's cultural diversity?", "immigration from countries all around the world", ["a single country only", "only tourism", "a film festival"], "People have come to Canada from many parts of the world.", "🌍"),
  q("What is immigration?", "moving to a new country to live", ["visiting for a day", "buying a house", "a school trip"], "Immigrants become part of Canadian communities.", "✈️"),
  q("What is a refugee?", "a person forced to leave their country because it is unsafe", ["a person on holiday", "a student", "a business traveller"], "Refugees need safety and protection.", "🏠"),
  q("What is a “push factor” in migration?", "a reason that makes people leave a place, such as war or famine", ["an attraction like jobs", "a type of bus", "a place to rest"], "War, poverty and persecution can push people to leave.", "⬅️"),
  q("What is a “pull factor” in migration?", "a reason that draws people to a place, such as jobs or safety", ["a reason to leave home", "a ship's rope", "a weather forecast"], "Opportunity and freedom can pull people to Canada.", "➡️"),
  q("In 1885 the Canadian government began a charge on Chinese immigrants called the…", "Head Tax", ["Income Tax", "Sales Tax", "Gas Tax"], "The Chinese Head Tax was unfair, and the government apologized in 2006.", "⚖️"),
  q("Why is it important that Canada admits when it made mistakes in the past?", "to learn from them and make things right", ["to hide history", "to feel proud only", "to stop all immigration"], "Recognizing mistakes helps build fairer communities.", "🧭"),
  q("Many Ukrainian, German and Scandinavian settlers came to the prairies because…", "land was offered for farming", ["they wanted beaches", "there was no snow", "they were looking for a volcano"], "Settlers were offered land under the Dominion Lands Act.", "🌾"),
  q("What does it mean to “integrate” in a new country?", "to take part in the community while keeping parts of your own culture", ["to forget your home language", "to avoid all neighbours", "to never learn anything new"], "Newcomers and communities can learn from one another.", "🤲"),
  q("Which of these is a way that newcomers have changed Canadian culture?", "new foods, music, languages and festivals", ["no changes at all", "removing all festivals", "removing all stories"], "Cultural exchange enriches communities.", "🍜"),
  q("How can you learn about someone's culture respectfully?", "ask questions politely and listen", ["make assumptions", "make fun of it", "avoid talking to them"], "Respect starts with curiosity and listening.", "👂"),
  q("Which describes cultural change over time?", "traditions can stay the same, change or blend with others", ["cultures never change", "cultures disappear overnight", "every culture is identical"], "Culture changes as people share ideas.", "🔁"),
  q("Which of these is a Canadian cultural symbol?", "the maple leaf", ["a pyramid", "a kangaroo", "a samurai sword"], "The maple leaf flag was first raised in 1965.", "🍁"),
  q("Which sport is often called Canada's national winter sport?", "hockey", ["cricket", "baseball", "rugby"], "Hockey is the national winter sport. Lacrosse is the national summer sport.", "🏒"),
  q("What do we call the process of a person becoming a Canadian citizen?", "naturalization", ["mutation", "privatization", "migration"], "Newcomers can apply for citizenship after living in Canada for a number of years.", "🍁"),
  hq("Why can the same cultural festival look different in different communities?", "people adapt traditions to their own place and history", ["festivals never change", "festivals are identical", "no one celebrates"], "Traditions grow and adapt.", "🎉"),
  hq("Why did Canada's immigration rules once favour people from certain countries?", "of discriminatory attitudes that have since been challenged", ["they were fair to all", "there were no rules", "everyone was welcomed equally"], "In the past, immigration policies treated people unfairly based on race or origin.", "⚖️"),
  hq("How does immigration help Canada's economy?", "newcomers bring skills, fill jobs and start businesses", ["it always lowers wages", "it stops trade", "it has no effect"], "Immigrants contribute to workplaces and communities.", "💼"),
  hq("Why is it important to include Indigenous peoples' voices in the story of Canadian cultural diversity?", "Indigenous peoples were here long before newcomers and have living cultures", ["they were not important", "they arrived last", "their cultures ended"], "Canadian diversity begins with the original peoples.", "🪶"),
  hq("Which is a reason communities create programs to help newcomers learn English or French?", "language helps people find work and take part in the community", ["to make them forget their languages", "to stop immigration", "to make schools shorter"], "Support helps newcomers settle and succeed.", "🏫"),
];

// ---------- Land, treaties and history ----------

const EVENT_ORDER = order("Put these events in the order they happened.", "Confederation (1867) came first, then Saskatchewan becoming a province (1905), then the Charter (1982), then the Truth and Reconciliation Commission's final report (2015).", [
  ["Confederation", "🍁"],
  ["Saskatchewan becomes a province", "🌾"],
  ["The Charter of Rights and Freedoms", "📘"],
  ["The Truth and Reconciliation Commission's final report", "🕊️"],
]);

const IDENTITY_SORT: SortSet = {
  prompt: "Which feature of the land has shaped Canadian identity? Tap an item, then tap its basket.",
  hint: "Canada's identity has been shaped by its large, varied land, its long winters and its many waterways.",
  bins: [
    { id: "land", label: "shaped by the land", emoji: "🏞️" },
    { id: "other", label: "not about the land", emoji: "❌" },
  ],
  items: [
    { label: "winter sports like skating", emoji: "⛸️", bin: "land" },
    { label: "canoes and rivers in stories", emoji: "🛶", bin: "land" },
    { label: "the vastness of the prairies and the north", emoji: "🌾", bin: "land" },
    { label: "the importance of the fur trade routes", emoji: "🦫", bin: "land" },
    { label: "a made-up video game", emoji: "🎮", bin: "other" },
    { label: "a rule about cell phones", emoji: "📱", bin: "other" },
    { label: "a recipe from another country", emoji: "🍜", bin: "other" },
    { label: "a school bus schedule", emoji: "🚌", bin: "other" },
  ],
};

const HISTORY: Item[] = [
  q("Confederation, the joining of the first provinces into Canada, happened in…", "1867", ["1492", "1905", "1982"], "Canada became a country on July 1, 1867.", "🍁"),
  q("How did the land shape Canadian identity?", "its size, winters and waterways influenced how people lived and travelled", ["it had no effect", "it made everyone move", "it is a flat desert"], "Canada's land and climate show up in its art, sport and stories.", "🏞️"),
  q("What is a treaty?", "a formal agreement between nations", ["a sports team", "a map", "a type of farm"], "Treaties between First Nations and the Crown are part of Canada's history.", "📜"),
  q("Numbered treaties were signed between First Nations and the Crown mostly between…", "1871 and 1921", ["1500 and 1600", "1950 and 1960", "2000 and 2010"], "Treaties 1 to 11 covered much of the Prairies, northern Ontario and the North.", "📅"),
  q("How does the treaty relationship influence Canadian identity?", "it is part of Canada's founding story and still affects how people live together", ["it has no connection", "it only matters in sports", "it was cancelled"], "Treaty rights and responsibilities are part of the country.", "🤝"),
  q("The Métis Nation's identity is connected to…", "its own culture, language and history, including the Red River and Batoche", ["only Ontario farms", "only British history", "no particular history"], "The Métis are a distinct Indigenous people.", "🧣"),
  q("What were residential schools?", "government-funded, church-run boarding schools that took Indigenous children from their families", ["summer camps", "universities", "hockey academies"], "The system caused great harm and lasted until the 1990s.", "🏫"),
  q("What was the purpose of the Truth and Reconciliation Commission?", "to learn about residential schools and recommend ways to move forward", ["to win a sports game", "to count the population", "to choose a flag"], "It issued 94 Calls to Action in 2015.", "🕊️"),
  q("How many Calls to Action did the Truth and Reconciliation Commission issue?", "94", ["9", "194", "1000"], "The Calls to Action cover education, health, justice and more.", "🔢"),
  q("What is reconciliation?", "building respectful relationships by addressing past harms", ["forgetting the past", "taking sides", "winning an argument"], "Reconciliation takes actions by governments and by individuals.", "🤲"),
  q("The Canadian Pacific Railway, finished in 1885, connected…", "eastern and western Canada", ["Canada and Europe", "Canada and Mexico", "two parts of a single town"], "The railway helped bring settlers to the prairies but also changed life for Indigenous peoples.", "🚂"),
  q("What event is often seen as a turning point for Canada's identity in the First World War?", "the Battle of Vimy Ridge in 1917", ["Confederation", "the Gold Rush", "the Charter"], "Canadian troops fought together for the first time as a single corps.", "🎖️"),
  q("What did the Constitution Act, 1982 do?", "brought the Constitution home to Canada and added the Charter", ["created the railway", "ended treaties", "banned winter"], "It is also called the patriation of the Constitution.", "📘"),
  q("Which of these historic events made Canada officially bilingual?", "the Official Languages Act of 1969", ["the gold rush", "the railway", "the fur trade"], "It recognized English and French as official languages of the federal government.", "🗣️"),
  q("Why do people study history?", "to understand how the past shapes the present", ["to memorize every date only", "because it is easy", "to avoid the present"], "History helps explain who we are.", "📚"),
  q("The year 2015 is when Canada…", "welcomed many Syrian refugees and received the Truth and Reconciliation final report", ["became a country", "built the first railway", "started hockey"], "Both events remain important to Canadians' sense of identity.", "🌎"),
  q("A historical event is often described differently by different people because…", "people have different experiences and perspectives", ["only one story exists", "history is made up", "no one remembers"], "Multiple perspectives give a fuller picture.", "👥"),
  q("Which of these is an example of land shaping Canadian identity?", "the importance of the Canadian Shield and boreal forest in art and stories", ["building a skyscraper", "a new smartphone", "a pizza recipe"], "Painters such as the Group of Seven were inspired by the landscape.", "🎨"),
  hq("Why do many First Nations say treaties are living agreements?", "the promises were meant to continue as long as the sun shines, the grass grows and the rivers flow", ["they expired in 1900", "they were destroyed", "they never mattered"], "Treaties are understood to be lasting promises.", "☀️"),
  hq("How did treaties and the arrival of settlers affect the same land in the prairies?", "settlers farmed land that First Nations agreed to share, and the effects continue", ["no one lived there", "the land was empty", "settlers owned it before treaties"], "Understanding the treaties helps explain the present.", "🌾"),
  hq("Why do many people say reconciliation is a responsibility for all Canadians?", "everyone lives on treaty land and shares the country's history", ["only governments are involved", "it applies only to schools", "it is already finished"], "“We are all Treaty people.”", "🌎"),
  hq("How do events like Vimy Ridge and the Charter help shape national identity?", "they become shared stories and values for people in Canada", ["they are forgotten", "they are only for soldiers", "they are only for lawyers"], "National identity is built from shared stories, values and symbols.", "🍁"),
  hq("Why is it important to ask whose voices are missing from a history story?", "stories can leave out people who were there", ["all stories are complete", "voices don't matter", "it makes the story shorter"], "Asking questions leads to a fuller history.", "🔍"),
];

// ---------- Citizenship and decision making ----------

const BILL_ORDER = order("Put the steps in order for how a bill becomes a law in Canada.", "A bill is introduced, debated, studied in committee, voted on, reviewed by the Senate and finally given Royal Assent.", [
  ["The bill is introduced (first reading)", "📄"],
  ["The bill is debated (second reading)", "🗣️"],
  ["A committee studies it", "🔍"],
  ["The House of Commons votes (third reading)", "🗳️"],
  ["The Senate reviews it", "🏛️"],
  ["Royal Assent makes it law", "👑"],
]);

const CITIZEN: Item[] = [
  q("A citizen is…", "a person with the rights and responsibilities of belonging to a country", ["a visitor", "an animal", "a tourist"], "Citizens can vote, hold a Canadian passport and take part in public life.", "🍁"),
  q("Which of these is a right of a Canadian citizen?", "to vote in federal elections", ["to ignore laws", "to skip school forever", "to be above the law"], "Citizens aged 18 and over can vote.", "🗳️"),
  q("Which of these is a responsibility of a Canadian citizen?", "to obey laws and respect the rights of others", ["to ignore elections", "to avoid community", "to litter"], "Rights come with responsibilities.", "⚖️"),
  q("Which is a fundamental freedom in the Charter?", "freedom of expression", ["freedom to ignore speed limits", "freedom from taxes", "freedom from school"], "The Charter protects freedoms such as conscience, religion, thought and peaceful assembly.", "📘"),
  q("How can citizens take part in the political process beyond voting?", "by writing to an MP, joining a group or running for office", ["by never talking to anyone", "by avoiding the news", "by ignoring laws"], "Active citizens help shape decisions.", "🤲"),
  q("What is a majority government?", "a government in which the governing party has more than half of the seats", ["a government with no party", "a government of one person", "a government that cannot make laws"], "A majority government can pass most bills.", "🏛️"),
  q("What is the role of the opposition in Parliament?", "to question the government and suggest alternatives", ["to agree with everything", "to run the courts", "to appoint judges"], "The opposition holds the government accountable.", "🗣️"),
  q("What is consensus decision making?", "working until the group can agree", ["one person decides alone", "voting once and ignoring the result", "flipping a coin"], "Many Indigenous governance traditions use consensus and circle processes.", "⭕"),
  q("In which situation is majority rule a common way to decide?", "an election", ["a family prayer", "a private choice", "a dream"], "In a vote, the option with the most support wins.", "🗳️"),
  q("A class decides on a field trip by talking until everyone agrees. This is…", "consensus", ["a dictatorship", "a coin toss", "an election"], "Consensus values everyone's input.", "🤝"),
  q("Who has the power to decide the outcome in a dictatorship?", "one person", ["every voter", "the whole class", "the Senate"], "Different decision-making systems place power in different hands.", "👑"),
  q("What does a Member of Parliament do?", "represents the people of a riding in the House of Commons", ["delivers mail", "runs a hospital", "owns a farm"], "MPs debate and vote on bills.", "🏛️"),
  q("Voter turnout means…", "the percentage of eligible voters who vote", ["the number of candidates", "the number of ballots printed", "the length of an election"], "A strong turnout means more people took part.", "📊"),
  q("Why might a person decide not to vote?", "they might feel their vote doesn't matter, but voting is how people have a say", ["voting is illegal", "voting is easy", "elections are every day"], "Every vote adds to the outcome.", "🗳️"),
  q("A petition is…", "a request signed by many people asking for action", ["a type of tax", "a speech", "a map"], "Petitions are one way that citizens can ask a government to act.", "✍️"),
  q("A citizen who volunteers for a community cleanup is…", "taking part in civic life", ["breaking a law", "avoiding duties", "voting twice"], "Civic engagement includes volunteering and speaking up.", "🧹"),
  q("What is the age to vote in federal elections in Canada?", "18", ["12", "16", "21"], "Canadians who are 18 or older and are citizens may vote.", "🔢"),
  q("What does it mean for a law to be “passed”?", "it has been approved by Parliament and given Royal Assent", ["it was written on paper", "it was printed", "it was mentioned in the news"], "Only then does the bill become law.", "📜"),
  hq("Why can it be difficult for a government to balance the interests of different groups?", "people want different things, and resources are limited", ["everyone agrees all the time", "there is only one group", "governments do not make choices"], "Leaders weigh competing interests.", "⚖️"),
  hq("Why might a student who can't yet vote still have an impact on political decisions?", "they can speak up, write to leaders and take part in their community", ["they cannot do anything", "only adults matter", "voting is the only way"], "Young people can be involved long before they can vote.", "🎓"),
  hq("Why is it important for citizens to check their sources before sharing information?", "false information can mislead others and harm decisions", ["it doesn't matter", "to be first", "facts are never important"], "Good decisions rely on reliable information.", "🔎"),
  hq("Why do many people say a healthy democracy needs engaged citizens?", "decisions reflect people who take part, so more voices make better outcomes", ["it works better if no one votes", "it needs fewer voices", "leaders never need feedback"], "Citizen engagement keeps leaders accountable.", "🗳️"),
  hq("Which describes how a legislature can use committees?", "to study bills closely and hear from experts and the public", ["to make coffee", "to cancel elections", "to appoint judges only"], "Committees give a bill careful review.", "🔍"),
];

// ---------- Consumers and the economy ----------

const WANTS_SORT: SortSet = {
  prompt: "Is it a need or a want? Tap an item, then tap its basket.",
  hint: "Needs are things we must have to live. Wants are things we would like to have.",
  bins: [
    { id: "need", label: "need", emoji: "🍞" },
    { id: "want", label: "want", emoji: "🎮" },
  ],
  items: [
    { label: "food", emoji: "🍞", bin: "need" },
    { label: "a warm coat in a prairie winter", emoji: "🧥", bin: "need" },
    { label: "safe housing", emoji: "🏠", bin: "need" },
    { label: "clean water", emoji: "🚰", bin: "need" },
    { label: "the newest game console", emoji: "🎮", bin: "want" },
    { label: "designer sneakers", emoji: "👟", bin: "want" },
    { label: "a fourth pair of headphones", emoji: "🎧", bin: "want" },
    { label: "a limited-edition toy", emoji: "🧸", bin: "want" },
  ],
};

const ECON: Item[] = [
  q("A consumer is…", "a person who buys goods and services", ["a person who only sells", "a type of store", "a government worker"], "Everyone is a consumer at some time.", "🛍️"),
  q("In a market economy, prices are mostly set by…", "supply and demand", ["the weather", "one person's rule", "the first letter of the product"], "When demand is high and supply is low, prices rise.", "📈"),
  q("Canada has a mixed market economy. What does “mixed” mean?", "private businesses and governments both play a role", ["there is no money", "only the government runs businesses", "only farmers are allowed to sell"], "Governments provide services such as health care and schools, and businesses sell many goods.", "⚖️"),
  q("Supply means…", "how much of a product is available", ["how many people want it", "how much it weighs", "how long it lasts"], "Demand is how much people want it.", "📦"),
  q("Demand means…", "how much people want a product", ["how much is available", "how much it costs to make", "how heavy it is"], "When more people want something, demand goes up.", "🙋"),
  q("What is consumerism?", "the idea that buying and owning more things will make you happier", ["avoiding all spending", "giving things away only", "growing your own food"], "Consumerism encourages people to keep buying.", "🛒"),
  q("Which of these is one social effect of consumerism?", "people may feel pressure to buy the newest things", ["everyone owns the same", "shops close", "the price of everything is zero"], "Advertising and social media encourage buying.", "📱"),
  q("Which is one environmental effect of high consumption?", "more waste in landfills", ["cleaner air", "less packaging", "fewer factories"], "Making and throwing away goods uses resources and creates waste.", "🗑️"),
  q("What does it mean to be a responsible consumer?", "to think about needs, costs and the impact of buying", ["to buy everything on sale", "to never save", "to ignore labels"], "Responsible consumers ask where goods come from and what happens when they are thrown away.", "🤔"),
  q("What are the “3 Rs” of waste reduction?", "reduce, reuse, recycle", ["read, write, run", "rest, relax, repeat", "rain, rock, river"], "Reducing is the best first step.", "♻️"),
  q("Which is the best first choice before buying something new?", "check if you can repair, borrow or buy it used", ["buy a new one at once", "throw the old one away", "buy two"], "Reusing saves resources.", "🔧"),
  q("What does a fair trade label tell shoppers?", "the producers were paid fairly under set standards", ["the product is free", "the product was made in a lab", "the product is the cheapest"], "Labels help consumers make informed choices.", "🏷️"),
  q("A shopper compares the price per 100 mL of two shampoos. This is…", "unit pricing", ["a tax", "a coupon", "a loan"], "Unit prices help shoppers compare value.", "🧴"),
  q("Why do advertisers use celebrities and catchy songs?", "to make products appealing and memorable", ["to give facts only", "to lower prices", "to protect the environment"], "Advertising is designed to influence choices.", "📺"),
  q("What is a budget?", "a plan for how to spend and save money", ["a type of bank", "a tax", "a receipt"], "A budget helps balance what comes in and goes out.", "💰"),
  q("What does stewardship of the environment mean?", "taking care of it so it lasts for the future", ["using up everything quickly", "ignoring pollution", "planting nothing"], "Stewardship is a responsibility for everyone.", "🌱"),
  q("Which is an example of Canadians taking action on sustainability?", "recycling and composting programs", ["building more landfills only", "banning all trees", "using more plastic"], "Many communities have recycling and composting programs.", "♻️"),
  q("Which of these is a renewable energy source that Saskatchewan is using more of?", "wind and solar power", ["coal only", "oil only", "candles"], "Wind and solar energy do not use up the source.", "🌬️"),
  hq("Why can the same product have different prices in different stores?", "stores set prices based on costs, competition and demand", ["prices are fixed by the weather", "all stores must charge the same", "prices are random"], "Competition and costs affect prices.", "🏷️"),
  hq("How can personal consumer choices affect people in other countries?", "buying goods affects workers and resources where they are made", ["they have no effect", "only local people are affected", "only factories are affected"], "Global supply chains connect shoppers and producers.", "🌍"),
  hq("Why do governments regulate things like food safety and advertising to children?", "to protect consumers and keep markets fair", ["to make shopping harder", "to raise prices only", "because it is fun"], "Rules protect people from harm and unfair practices.", "🛡️"),
  hq("A company advertises a product as “eco-friendly” without proof. This is called…", "greenwashing", ["recycling", "bartering", "fair trade"], "Consumers should look for evidence behind claims.", "🔎"),
  hq("Why might Canada's wealth of natural resources make sustainability decisions difficult?", "using resources brings jobs and income but can harm the environment", ["resources never run out", "there are no jobs", "the environment is not affected"], "Balancing benefits and costs is hard.", "⚖️"),
  hq("Which action best shows critical thinking about a purchase?", "asking whether you need it, what it costs and what happens to it later", ["buying because a friend did", "buying the first one you see", "buying because of an ad"], "Good choices consider both short- and long-term effects.", "🧠"),
];

export const units: Unit[] = [
  {
    id: "sk-culture-8",
    title: "Culture & Immigration",
    emoji: "🌍",
    blurb: "Where Canadian diversity comes from",
    standards: { "ca-sk": sk("IN8.1, IN8.2", "the meaning of culture, the origins of Canadian cultural diversity, and the influence of immigration") },
    parentNote: "What culture is, the Indigenous, French and English roots of Canada, why people have come to Canada, and how immigration, past and present, shapes Canadian life.",
    generate: bankUnit(CULTURE),
  },
  {
    id: "sk-identity-8",
    title: "Land, Treaties & History",
    emoji: "🍁",
    blurb: "What shapes who we are as Canadians",
    standards: { "ca-sk": sk("DR8.1–DR8.3", "the significance of the land and the treaty relationship, and how historical events have shaped Canadian identity") },
    parentNote: "How the land has shaped Canadian identity, the treaty relationship, and key events such as Confederation, residential schools, the Charter and the Truth and Reconciliation Commission. This is introductory and needs review with First Nations and Métis partners.",
    generate: bankUnit(HISTORY, { sorts: [IDENTITY_SORT], orders: [EVENT_ORDER] }),
  },
  {
    id: "sk-citizenship-8",
    title: "Citizenship & Decisions",
    emoji: "🗳️",
    blurb: "Rights, responsibilities and how decisions are made",
    standards: { "ca-sk": sk("PA8.1–PA8.4", "Canadian citizenship, decision-making processes, how a bill becomes a law, and citizens' engagement") },
    parentNote: "The rights and responsibilities of Canadian citizens, majority and consensus decision making, the path of a bill from idea to law, and ways citizens take part.",
    generate: bankUnit(CITIZEN, { orders: [BILL_ORDER] }),
  },
  {
    id: "sk-consumers-8",
    title: "Consumers & the Economy",
    emoji: "🛒",
    blurb: "Supply, demand and smart choices",
    standards: { "ca-sk": sk("RW8.1–RW8.3", "Canada's mixed market economy, consumerism, personal consumer choices and environmental stewardship") },
    parentNote: "How a mixed market economy works, supply and demand, the effects of consumerism, making responsible consumer choices and caring for the environment.",
    generate: bankUnit(ECON, { sorts: [WANTS_SORT] }),
  },
];
