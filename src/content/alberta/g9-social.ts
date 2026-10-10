import { pick, randInt, textChoice } from "../random";
import type { GenerateOptions, Question, Unit } from "../types";
import { ab, levelOf, typeIn, type Maker } from "./kit";
import { q, unitSet, type Item } from "../ontario/g9-science";

// Alberta Grade 9 social studies (Social Studies K-9, 2005): Canada: Opportunities and Challenges.
// 9.1 Issues for Canadians: Governance and Rights; 9.2 Issues for Canadians: Economic Systems in Canada and
// the United States. BC's Grade 9 is history and Ontario's is the geography of Canada, so no existing
// units are shared; every unit here is written for the Alberta topics.
//
// Treaty and Métis content is kept short and factual (some Nations, present tense). It needs review with
// First Nations, Métis and Inuit partners before launch.

// ---------- 9.1 Governance ----------

const GOVERNANCE: Item[] = [
  q(1, "What kind of government does Canada have?", "a parliamentary democracy with a constitutional monarchy", ["a dictatorship", "a republic led by a president", "a government run by one province"], "Canadians elect representatives to Parliament, and the King is the head of state, whose role is mostly symbolic."),
  q(1, "Which three levels of government do Canadians live under?", "federal, provincial or territorial, and municipal", ["national, global and local", "royal, military and civic", "federal, tribal and school"], "Each level has its own responsibilities."),
  q(1, "Who is the head of the federal government in Canada?", "the Prime Minister", ["the Governor General", "the Chief Justice", "the Speaker of the House of Commons"], "The Prime Minister is usually the leader of the party that can win the support of the House of Commons."),
  q(1, "What is the capital of Alberta?", "Edmonton", ["Calgary", "Red Deer", "Lethbridge"], "The Legislative Assembly of Alberta meets in Edmonton."),
  q(1, "What do we call the elected representatives in Alberta's Legislative Assembly?", "MLAs (Members of the Legislative Assembly)", ["MPs", "Senators", "Mayors"], "MPs sit in the federal House of Commons."),
  q(1, "Which level of government is mainly responsible for local services like garbage collection, local roads and parks?", "municipal", ["federal", "provincial", "international"], "Cities, towns and counties pass bylaws and provide local services."),
  q(1, "In a federal election, how is a Member of Parliament chosen in each riding (constituency)?", "The candidate with the most votes wins", ["The oldest candidate wins", "The Prime Minister appoints one", "The Senate votes"], "This is called the first-past-the-post system."),
  q(1, "What is the voting age for federal elections in Canada?", "18", ["16", "21", "25"], "Canadian citizens who are 18 or older can vote."),
  q(2, "Which is a responsibility of the federal government?", "national defence", ["local zoning", "school boards", "garbage pickup"], "Under the Constitution, the federal government handles things like defence, citizenship, currency and criminal law."),
  q(2, "Which is mainly a provincial responsibility?", "education", ["national defence", "currency", "citizenship"], "Provinces run education, and also deliver health care and manage most natural resources within their borders."),
  q(2, "Which branch of government makes laws?", "legislative", ["executive", "judicial", "military"], "Parliament and provincial legislatures make laws. The executive carries them out, and the courts interpret them."),
  q(2, "Which branch of government interprets laws and decides cases?", "judicial (the courts)", ["legislative", "executive", "municipal"], "Judges are independent from the government so that they can be fair."),
  q(2, "Which body of the federal government is appointed rather than elected?", "the Senate", ["the House of Commons", "a city council", "the Legislative Assembly of Alberta"], "Senators are appointed on the advice of the Prime Minister and sit until they retire."),
  q(2, "A bill must be passed by Parliament and then receives what to become law?", "Royal Assent", ["a referendum", "a court ruling", "a mayor's signature"], "The Governor General gives Royal Assent on behalf of the Crown."),
  q(2, "What does it mean when we say Canada is a federation?", "Power is divided between a national government and provincial governments", ["All power is held by one government", "There are no provinces", "Each city has its own army"], "The Constitution says which level of government is responsible for which matters."),
  q(2, "Alberta and Saskatchewan became provinces in what year?", "1905", ["1867", "1885", "1949"], "Both were created out of the North-West Territories in 1905."),
  q(2, "What is a minority government?", "a government whose party has the most seats but fewer than half", ["a government with no Prime Minister", "a government of just one province", "a government with no opposition"], "A minority government needs support from other parties to pass laws."),
  q(2, "What is the role of the Official Opposition?", "to question and challenge the government and offer alternatives", ["to make the laws without a vote", "to command the army", "to appoint judges"], "The Official Opposition is the party with the second-most seats."),
  q(3, "What was the main result of the Constitution Act, 1982?", "Canada's Constitution could be amended in Canada, and the Charter of Rights and Freedoms was added", ["Canada became a country", "The provinces were created", "Alberta joined Confederation"], "Before 1982 some changes still had to go through the British Parliament. Bringing the Constitution home is called patriation."),
  q(3, "Under the general amending formula, a change to the Constitution needs approval from the federal government and how many provinces?", "at least 7 provinces with at least 50% of the population", ["all 10 provinces", "any 2 provinces", "no provinces"], "This is called the 7/50 formula."),
  q(3, "In 1930, the Natural Resources Transfer Act gave Alberta control over what?", "its public lands and natural resources", ["its military", "its currency", "its criminal law"], "Before then, the federal government managed resources in the Prairie provinces."),
  q(3, "Why do citizens have a responsibility to vote?", "Their votes help decide who makes decisions and laws for them", ["Voting is the only way to pay taxes", "Elections are chosen at random", "Their vote has no effect"], "Participating in elections and staying informed is one way to take part in democracy."),
  q(3, "A municipality is created by a province and gets its powers from it. What does this mean?", "A province can change what a municipality is allowed to do", ["A city can ignore the province", "A city is a country", "The federal government governs every town"], "Municipal governments are not named in the Constitution; provincial law sets their powers."),
];

// ---------- 9.1 The Charter ----------

const CHARTER: Item[] = [
  q(1, "What is the Canadian Charter of Rights and Freedoms?", "part of Canada's Constitution that protects basic rights and freedoms", ["a list of Canadian holidays", "the rules of Parliament", "a set of municipal bylaws"], "It was added to the Constitution in 1982."),
  q(1, "Which is a fundamental freedom in the Charter?", "freedom of peaceful assembly", ["the right to a free car", "freedom from all laws", "the right to ignore taxes"], "Fundamental freedoms include conscience and religion, thought and expression, peaceful assembly and association."),
  q(1, "A person is accused of a crime. What do they have the right to be presumed?", "innocent until proven guilty", ["guilty until proven innocent", "guilty if they are young", "innocent only if they pay"], "The Charter's legal rights protect people who are accused."),
  q(1, "Mobility rights let a Canadian citizen do what?", "live and work in any province or territory", ["avoid paying taxes", "vote at age 12", "own any business without rules"], "Citizens can move freely within Canada and can enter, stay in and leave the country."),
  q(1, "Equality rights mean that every person…", "is equal before and under the law and has equal protection and benefit of the law", ["is exactly the same as every other person", "must earn the same income", "can ignore laws they dislike"], "Equality rights protect against discrimination, for example based on race, religion, sex or disability."),
  q(1, "Which is a responsibility of a citizen?", "obey the law and respect the rights of others", ["avoid all elections", "ignore the rules at school", "take things from others"], "Rights come with responsibilities."),
  q(1, "In 1916 women in Alberta gained the right to…", "vote in provincial elections", ["join Parliament", "become judges", "own farms"], "Alberta was the third province to give women the vote, after Manitoba and Saskatchewan."),
  q(2, "Which group of Alberta women, known as the Famous Five, fought to have women recognized as \"persons\" under the law?", "Emily Murphy, Nellie McClung, Irene Parlby, Louise McKinney and Henrietta Muir Edwards", ["the first five Prime Ministers", "five Alberta premiers", "five chiefs of Treaty 7"], "In 1929 the Privy Council in England ruled that women are persons who can be appointed to the Senate."),
  q(2, "Section 1 of the Charter says rights are subject to…", "reasonable limits that can be justified in a free and democratic society", ["no limits at all", "any limit the government wants", "the opinion of a majority of neighbours"], "For example, freedom of expression does not allow someone to spread hate propaganda."),
  q(2, "Language rights in the Charter make English and French…", "the official languages of the federal government", ["the only languages people can speak", "required in every home", "unofficial languages"], "The Charter also protects minority language education rights where numbers warrant."),
  q(2, "What does the notwithstanding clause (section 33) allow?", "a legislature to pass a law that applies despite certain Charter rights, for up to five years at a time", ["a citizen to ignore any law", "judges to write laws", "the Charter to be erased"], "Section 33 can be used by Parliament or a provincial legislature and must be renewed every five years."),
  q(2, "What is the \"right to a lawyer\" in the Charter?", "the right to a lawyer when arrested or detained, and to be told of that right", ["the right to free groceries", "the right to be a lawyer", "the right to skip a trial"], "These legal rights make sure people are treated fairly by the justice system."),
  q(2, "A student wears a religious symbol to school. Which Charter freedom protects this?", "freedom of conscience and religion", ["mobility rights", "language rights", "democratic rights"], "Freedom of religion includes practising and showing one's beliefs, within reasonable limits."),
  q(2, "Which is a democratic right in the Charter?", "the right of citizens to vote and run for office", ["the right to a pay raise", "the right to a driver's licence", "the right to have a pet"], "Democratic rights ensure elections are held regularly and citizens can take part."),
  q(2, "Why can freedom of expression have limits?", "To protect the rights and safety of others, for example from hate speech", ["Because the government dislikes opinions", "So people stay silent", "Because rights do not matter"], "Courts decide whether a limit on a right is reasonable."),
  q(2, "What does the Alberta Human Rights Act do?", "protects people in Alberta from discrimination in areas like work and housing", ["sets the price of rent", "creates the Charter", "gives Alberta its own army"], "Each province has its own human rights law, and the Alberta Human Rights Commission handles complaints."),
  q(3, "The Charter of Rights and Freedoms became part of the Constitution in what year?", "1982", ["1867", "1960", "1999"], "It was part of the Constitution Act, 1982."),
  q(3, "A court decides a law goes against the Charter. What can happen?", "The law may be struck down or changed", ["The court makes the law stronger", "The Prime Minister is removed", "Nothing can happen"], "Courts interpret the Constitution, and laws that conflict with it can be declared invalid."),
  q(3, "Two rights seem to conflict: one person's freedom of expression and another's right to equality. What does a court do?", "Weigh the rights and decide what limits are reasonable", ["Always choose the louder voice", "Cancel both rights", "Ask the Prime Minister to choose"], "Balancing rights is a major role of the courts."),
  q(3, "What was the Canadian Bill of Rights (1960)?", "a federal law protecting rights, but not part of the Constitution", ["the Constitution Act of 1867", "the same as the Charter", "an Alberta law about farming"], "The Charter later gave rights stronger protection because it is in the Constitution."),
  q(3, "Why is it important that judges are independent of the government?", "So decisions are fair and not affected by political pressure", ["So judges never make mistakes", "So judges can write laws", "So no one needs a lawyer"], "An independent court can decide cases, even those involving the government, without fear."),
  q(3, "The Youth Criminal Justice Act applies to young people aged 12 to 17. Why does Canada have a separate system for youth?", "Young people have less maturity, so the focus is on accountability and rehabilitation", ["Because youth never break laws", "Because adults do not need laws", "Because youth cannot be accused"], "The aim is to hold young people accountable in a way that fits their age and helps them avoid reoffending."),
];

// ---------- 9.1 Treaties and rights of Indigenous peoples ----------

const TREATIES: Item[] = [
  q(1, "Which three groups of Indigenous peoples are recognized in Canada's Constitution?", "First Nations, Inuit and Métis", ["Cree, Haida and Dene only", "Treaty, Inuit and Settler", "Aboriginal, Native and Tribal"], "Section 35 of the Constitution Act, 1982 recognizes and affirms the Aboriginal and treaty rights of these three peoples."),
  q(1, "Which treaties cover most of Alberta?", "Treaties 6, 7 and 8", ["Treaties 1 and 2", "Treaties 3, 4 and 5", "Treaties 9, 10 and 11"], "Treaty 6 covers central Alberta (including Edmonton), Treaty 7 covers southern Alberta (including Calgary) and Treaty 8 covers northern Alberta."),
  q(1, "A treaty is…", "a formal agreement between Nations or governments", ["a type of road", "a law only for cities", "a kind of tax"], "Treaties in Canada are agreements between First Nations and the Crown."),
  q(1, "Which treaty area includes the city of Calgary?", "Treaty 7", ["Treaty 6", "Treaty 8", "Treaty 1"], "Treaty 7 was signed in 1877 with Nations including the Siksika, Kainai, Piikani, Tsuut'ina and Stoney Nakoda."),
  q(1, "How many Métis Settlements are there in Alberta?", "8", ["2", "20", "50"], "Alberta is the only province with a recognized land base for Métis people, set up under the Métis Settlements Act."),
  q(1, "Who are the Métis?", "a distinct Indigenous people with their own history, culture and communities", ["people who moved to Canada recently", "another name for Inuit", "people who live only in cities"], "The Métis Nation has roots in the fur trade, with their own language (Michif), culture and traditions."),
  q(1, "On September 30 Canadians mark…", "the National Day for Truth and Reconciliation", ["Canada Day", "Remembrance Day", "Victoria Day"], "Many people wear orange to honour residential school survivors and remember the children who did not come home."),
  q(2, "Many First Nations understand the numbered treaties as…", "agreements to share the land and as the start of a lasting relationship", ["a sale of all the land forever", "a declaration of war", "an agreement to leave the land"], "Oral histories of many Nations describe treaties as promises between Nations that are meant to last."),
  q(2, "Treaties 6, 7 and 8 were signed between First Nations and which party?", "the Crown (represented by the Government of Canada)", ["the United States", "the province of Alberta", "the Hudson's Bay Company"], "Alberta did not become a province until 1905, after Treaties 6 (1876), 7 (1877) and 8 (1899)."),
  q(2, "What was the purpose of the Indian Act (1876)?", "a federal law that governs many aspects of the lives of First Nations people, and has been criticized for controlling them", ["to give First Nations full independence", "to end all treaties", "to create Alberta"], "The Act controlled things like who counted as an Indian, reserves and education, and has been changed many times."),
  q(2, "Residential schools in Canada were…", "government-funded, church-run boarding schools that many Indigenous children were required to attend", ["voluntary summer camps", "schools run by First Nations governments", "schools for adults"], "Children were separated from their families, languages and cultures. The last federally run school closed in 1996."),
  q(2, "What was the Truth and Reconciliation Commission of Canada?", "a commission that listened to survivors of residential schools and made 94 Calls to Action", ["a group that made Alberta a province", "a court for treaties", "a police force"], "Its 2015 report called on governments and all Canadians to work towards reconciliation."),
  q(2, "What does \"reconciliation\" mean in this context?", "building respectful relationships between Indigenous and non-Indigenous peoples", ["forgetting what happened", "ending all treaties", "moving everyone to cities"], "Reconciliation involves learning the truth, acknowledging harm and acting to change."),
  q(2, "What is the Métis Nation of Alberta?", "an organization that represents Métis people in Alberta", ["a school board", "an Alberta city", "a treaty area"], "Many Métis people in Alberta live both in cities and on Métis Settlements."),
  q(2, "What is a land acknowledgement?", "a statement that recognizes Indigenous peoples' relationship to the land where an event is held", ["a land sale contract", "a type of treaty", "a legal tax"], "It is a way to show respect, and many people also learn which Nations' lands they live on."),
  q(2, "Why do some First Nations in Alberta and elsewhere talk about \"treaty rights\"?", "Treaties include promises about things such as land, hunting and fishing, and education", ["Because treaties give everyone free housing", "Because treaties ended all laws", "Because treaties apply only to cities"], "Treaty rights are protected in Canada's Constitution, and their meaning is still discussed and decided in negotiations and courts."),
  q(3, "What does the duty to consult mean?", "Governments must consult Indigenous peoples when a decision might affect their rights", ["Indigenous peoples must consult the Prime Minister", "Companies must pay a fee", "Courts must close"], "Canadian courts have said governments have this duty where a decision could affect Aboriginal or treaty rights."),
  q(3, "The United Nations Declaration on the Rights of Indigenous Peoples (UNDRIP) is…", "an international statement of the rights of Indigenous peoples that Canada passed a law to support in 2021", ["a Canadian treaty from 1876", "a part of the Charter", "a municipal bylaw"], "Canada's UNDRIP Act asks the government to make its laws consistent with the Declaration."),
  q(3, "How is a modern land claim agreement different from the numbered treaties?", "It is negotiated in recent decades, often with self-government, between a Nation and governments", ["It was signed before 1800", "It involves no Indigenous people", "It ends the Constitution"], "Examples include the 1999 creation of Nunavut through the Nunavut Land Claims Agreement."),
  q(3, "Why do Indigenous peoples and the Crown sometimes disagree about what treaties mean?", "The oral understandings of Nations and the written text were not always the same", ["Treaties were never written", "Treaties have no meaning", "No one signed them"], "Many Nations rely on oral history, and courts today consider both the written text and the Nations' understanding."),
  q(3, "Which of these is an example of Indigenous self-government in Alberta?", "a Nation or settlement council making decisions for its own community", ["the federal Senate", "an Alberta school", "a municipal pool"], "Métis Settlements have their own councils, and First Nations have chiefs and councils."),
];

// ---------- 9.2 Economic systems ----------

const SYSTEMS: Item[] = [
  q(1, "What is scarcity?", "not having enough resources to meet everyone's wants and needs", ["having too much of everything", "a type of money", "a government"], "Because resources are limited, people and governments must make choices."),
  q(1, "What does the economic term \"opportunity cost\" mean?", "what you give up when you choose one thing over another", ["the price of a ticket", "the profit a business earns", "a tax on land"], "If you spend $20 on a book, you cannot spend the same $20 on a movie."),
  q(1, "Which are the four factors of production?", "land (natural resources), labour, capital and entrepreneurship", ["rent, taxes, fees and fines", "money, banks, loans and interest", "supply, demand, price and profit"], "These are the ingredients needed to produce goods and services."),
  q(1, "In a market economy, who mostly decides what to produce and how much to charge?", "businesses and consumers", ["only the government", "only the courts", "only the military"], "Prices are influenced by what buyers are willing to pay and what sellers are willing to accept."),
  q(1, "In a command economy, who makes most economic decisions?", "the government", ["individual buyers", "small businesses", "families"], "A government plan decides what is produced and at what price."),
  q(1, "What is a mixed economy?", "an economy with both private businesses and government involvement", ["an economy with no money", "an economy run only by the government", "an economy without trade"], "Canada and the United States both have mixed economies, though they mix in different amounts."),
  q(1, "A profit is…", "the money left after a business pays its costs", ["the total cost of making a product", "a tax paid to the government", "a loan from a bank"], "Profit = revenue (the money earned) minus costs."),
  q(2, "Which of these is a good rather than a service?", "a bicycle", ["a haircut", "a bus ride", "a dentist visit"], "Goods are things you can touch. Services are work done for someone."),
  q(2, "In a traditional economy, what decisions about work and sharing are mostly based on?", "customs and the ways the community has done things over time", ["a government plan", "competition between corporations", "stock prices"], "Traditional economies often rely on farming, hunting, gathering and trading, with roles passed down in families or communities."),
  q(2, "What is private property?", "land or goods that individuals or companies can own and use", ["land the government keeps for itself", "land no one can use", "a type of tax"], "Private ownership is a feature of market economies, and it is protected by law."),
  q(2, "Which is an example of a Crown corporation (owned by a government)?", "ATB Financial, owned by the Government of Alberta", ["a local corner store", "a family farm", "a private bank"], "Crown corporations show how mixed economies include both private and public ownership."),
  q(2, "Why does a market economy need competition?", "Competition pushes businesses to improve quality and keep prices fair", ["Competition ensures every business makes a profit", "Competition removes the need for customers", "Competition stops all trade"], "When customers can choose between sellers, sellers try to give them better value."),
  q(2, "A government provides public schools and roads that everyone can use, paid for by taxes. What does this show about a mixed economy?", "The government provides some goods and services itself", ["The government owns every business", "Taxes do not exist", "Roads are private property"], "Mixed economies use taxes to pay for services that benefit everyone."),
  q(2, "What does the Goods and Services Tax (GST) charge on most purchases in Alberta?", "5%", ["0%", "13%", "25%"], "Alberta has no provincial sales tax, so only the 5% federal GST applies to most purchases."),
  q(2, "Which is a strength of a market economy?", "People have many choices and businesses are encouraged to innovate", ["It guarantees equal incomes", "It removes all competition", "It needs no rules"], "A market system also has weaknesses, such as unequal incomes and businesses that may harm the environment, which is why governments set rules."),
  q(2, "Which is a weakness of a command economy?", "People may have few choices, and plans can fail to match what people want", ["It has too many businesses", "It has no government", "It rewards competition too much"], "When one central plan decides everything, it can be slow to respond to what people need."),
  q(3, "Why do governments regulate businesses in a mixed economy?", "To protect consumers, workers and the environment", ["To stop all profit", "To make every product the same", "To end competition"], "Rules about safety, labour and pollution help balance the interests of business with the public good."),
  q(3, "The Alberta Heritage Savings Trust Fund was created in 1976. What is its purpose?", "to save part of the money from non-renewable resource revenues for the future", ["to pay for municipal elections", "to buy the Prairies", "to set interest rates"], "The idea is that because oil and gas are non-renewable, some of the income should be saved."),
  q(3, "Why can an economy that depends on one resource be risky?", "A drop in the price of that resource can affect the whole economy", ["Resources never change price", "It is always very diverse", "It cannot trade"], "Diversifying the economy helps a region be more stable."),
  q(3, "A town's only factory closes. What is the most direct effect on the town?", "Workers lose income, so they have less to spend at local businesses", ["Everyone becomes richer", "Prices of all goods fall to zero", "The government takes over all stores"], "Spending in an economy is linked: one business's costs are another person's income."),
  q(3, "Why is it hard to compare two economies fairly?", "Each has different resources, history, population and values", ["Economies are all identical", "Countries do not trade", "Only taxes matter"], "Looking at several measures, such as incomes, jobs and well-being, gives a more complete picture."),
];

function profit(): Question {
  const items = randInt(20, 90);
  const price = randInt(3, 12);
  const cost = randInt(100, 400);
  const revenue = items * price;
  const net = revenue - cost;
  if (net <= 0) return typeIn("A business earns $500 and its costs are $350. What is its profit, in dollars?", 150, "Profit = revenue − costs = 500 − 350 = 150.");
  return typeIn(`A stand sells ${items} items at $${price} each. Its costs are $${cost}. What is its profit, in dollars?`, net, `Revenue is ${items} × ${price} = $${revenue}. Profit = revenue − costs = ${revenue} − ${cost} = $${net}.`);
}

function gst(): Question {
  const price = pick([20, 40, 60, 80, 100, 120, 200]);
  const tax = price / 20;
  return typeIn(`In Alberta there is no provincial sales tax. Only 5% GST applies. How much GST is added to a $${price} item, in dollars?`, tax, `5% of ${price} is ${price} ÷ 20 = $${tax}.`, undefined, { keypad: "decimal" });
}

function systems(opts?: GenerateOptions): Question[] {
  return unitSet(SYSTEMS, levelOf(opts), [profit, gst]);
}

// ---------- 9.2 Supply and demand ----------

const MARKETS: Item[] = [
  q(1, "What is demand?", "how much of a good or service buyers want and are able to buy at different prices", ["how much a seller has", "what the government charges", "the cost of making something"], "Demand is about buyers."),
  q(1, "What is supply?", "how much of a good or service sellers are willing to offer at different prices", ["how much buyers want", "the colour of a product", "a type of tax"], "Supply is about sellers."),
  q(1, "When the price of a good goes up, what usually happens to the quantity people want to buy?", "It goes down", ["It goes up", "It stays exactly the same", "It doubles"], "At higher prices, fewer people can or will buy."),
  q(1, "When the price of a good goes up, what usually happens to the quantity sellers want to supply?", "It goes up", ["It goes down", "It becomes zero", "It stays exactly the same"], "Higher prices give sellers more reason to produce and sell."),
  q(1, "A shop has more coats than shoppers want to buy. What is likely to happen to the price?", "It will fall", ["It will rise", "It will stay the same", "It will become a tax"], "Sellers lower prices to sell extra goods."),
  q(1, "A new video game is very popular and the store sells out. What is likely to happen to the price?", "It will rise", ["It will fall", "It will stay the same", "It will be free"], "When demand is greater than supply, sellers can raise prices."),
  q(1, "A consumer is…", "a person who buys goods and services", ["a person who makes laws", "a person who owns a bank", "a tax collector"], "Consumers' choices influence what businesses produce."),
  q(2, "What is the equilibrium price?", "the price at which the quantity buyers want equals the quantity sellers offer", ["the highest price a seller can charge", "the price set by the government", "the cost of the ingredients"], "At that price, there is no leftover supply and no shortage."),
  q(2, "A late frost destroys much of the canola crop. What is likely to happen to the price of canola, other things equal?", "It will rise, because supply has fallen", ["It will fall, because supply has risen", "It will stay the same", "It will become free"], "A smaller supply with the same demand pushes the price up."),
  q(2, "A new technology cuts the cost of producing tablets. What is likely to happen to their price?", "It will fall as sellers can supply more at lower prices", ["It will rise", "It will not change at all", "It will be set by the court"], "Lower costs usually increase supply."),
  q(2, "Which is a substitute for bus tickets?", "ride-sharing", ["bus passes for children", "bus drivers' uniforms", "bus shelters"], "If the price of a good rises, people may switch to a substitute."),
  q(2, "The price of gasoline rises sharply. What is likely to happen to the demand for fuel-efficient cars?", "It will increase", ["It will fall", "It will disappear", "It will not change"], "Buyers look for ways to cut fuel costs."),
  q(2, "A shortage happens when…", "the quantity demanded is greater than the quantity supplied at the current price", ["there are too many goods", "prices are zero", "the government collects taxes"], "Shortages can push prices up."),
  q(2, "A surplus happens when…", "the quantity supplied is greater than the quantity demanded at the current price", ["buyers cannot find the product", "there are not enough sellers", "the price falls to zero"], "Surpluses can lead sellers to lower prices."),
  q(2, "A price ceiling, like a limit on how high rent can go, is set by…", "the government", ["the seller", "the buyer", "a competitor"], "Price controls try to keep goods affordable, but they can create shortages."),
  q(2, "A well-known advertisement makes more people want a brand of running shoes. What happens to the demand for those shoes?", "Demand increases", ["Demand decreases", "Supply decreases", "Nothing changes"], "Advertising and fashions can change what people want."),
  q(3, "A bakery's flour costs rise, so it charges more for bread. What does this show?", "Higher production costs can raise prices", ["Prices are independent of costs", "Bakeries ignore cost", "Flour is a service"], "Sellers must cover their costs to stay in business."),
  q(3, "Why are tickets for a very popular concert often resold at higher prices?", "Demand is far greater than the limited supply of seats", ["The seats become bigger", "The concert is cheaper", "Supply is unlimited"], "When something is scarce and many people want it, the price can climb."),
  q(3, "If demand for oil falls around the world but supply stays high, what is likely to happen to oil prices?", "They will fall", ["They will rise", "They will stay the same forever", "They will be set at zero"], "Alberta's economy is affected by oil prices, which is one reason diversifying matters."),
  q(3, "A business raises prices and its customers switch to a similar product from another company. What does this show?", "Competition and substitutes limit how high a business can set its price", ["Customers do not notice prices", "Businesses cannot change prices", "Substitutes do not exist"], "Consumers have choices, so sellers must consider competitors."),
  q(3, "An item's demand schedule shows buyers at different prices. Which describes a normal demand curve?", "As price rises, quantity demanded falls", ["As price rises, quantity demanded rises", "Price and quantity are unrelated", "Quantity is always constant"], "This inverse relationship is the law of demand."),
];

function demandTable(): Question {
  const base = pick([100, 120, 150, 200]);
  const price = [2, 3, 4, 5];
  const step = pick([10, 15, 20]);
  const rows = price.map((p, i) => [`$${p}`, base - step * i]);
  const target = randInt(1, 3);
  return typeIn(
    `The table shows how many cups of hot chocolate customers want each day at different prices. How many cups do they want at $${price[target]}?`,
    base - step * target,
    "Read across from the price to the quantity demanded.",
    { type: "table", title: "Daily demand", headers: ["Price", "Cups wanted"], rows },
  );
}

function revenue(): Question {
  const price = randInt(2, 9);
  const qty = randInt(10, 60);
  return typeIn(`A seller sells ${qty} items at $${price} each. What is the total revenue, in dollars?`, price * qty, `Revenue = price × quantity = ${price} × ${qty} = $${price * qty}.`);
}

function markets(opts?: GenerateOptions): Question[] {
  return unitSet(MARKETS, levelOf(opts), [demandTable, revenue]);
}

// ---------- 9.2 Canada and the United States ----------

const TRADE: Item[] = [
  q(1, "Which country is Canada's largest trading partner?", "the United States", ["Mexico", "Australia", "Japan"], "Most of Canada's exports go to the United States."),
  q(1, "What are exports?", "goods and services sold to other countries", ["goods bought from other countries", "taxes paid at the border", "money given as a gift"], "Imports are goods and services bought from other countries."),
  q(1, "What are imports?", "goods and services bought from other countries", ["goods and services sold abroad", "things made at home", "types of tax"], "Canada imports things such as cars, electronics and fruit."),
  q(1, "A tariff is…", "a tax on imported goods", ["a type of road", "a free trade agreement", "a government subsidy"], "Tariffs make imported goods more expensive."),
  q(1, "Which of these is an important Alberta export to the United States?", "oil and natural gas", ["bananas", "coffee", "rubber"], "Pipelines carry oil and gas from Alberta to the United States."),
  q(1, "Both Canada and the United States are examples of…", "mixed market economies", ["command economies", "traditional economies", "economies without trade"], "Both rely mainly on private businesses and also have government roles."),
  q(1, "Which pair of countries is next to each other and shares the world's longest international border?", "Canada and the United States", ["Canada and Mexico", "Canada and Russia", "Mexico and Brazil"], "The land border between Canada and the United States is about 9 000 km long."),
  q(2, "What does CUSMA stand for?", "Canada–United States–Mexico Agreement", ["Canada Union of Small Merchants Alliance", "Canadian Union of Skilled Mechanics Association", "Central United States Market Agreement"], "It replaced NAFTA in 2020 and sets rules for trade between the three countries."),
  q(2, "Which agreement did CUSMA replace?", "NAFTA (North American Free Trade Agreement)", ["the Auto Pact", "the Treaty of Paris", "the Charter"], "NAFTA came into effect in 1994."),
  q(2, "Why is a free trade agreement helpful to businesses?", "It reduces tariffs and other trade barriers", ["It forbids all imports", "It ends all taxes", "It makes every product the same"], "Cheaper trade lets companies sell to a bigger market."),
  q(2, "How is health care mainly paid for in Canada compared with the United States?", "In Canada, provincial plans funded by taxes cover medically necessary care; in the United States, much of it is paid for through private insurance and some government programs", ["Canada has no health care; the US has public care for all", "Both countries charge the same fee for every visit", "Neither country has any government role"], "Both countries have a mix of public and private parts, but Canada relies more on public funding."),
  q(2, "A product's supply chain crosses the Canada–US border several times. This shows…", "that the two economies are closely connected", ["that the economies are separate", "that tariffs do not exist", "that exports cannot happen"], "Many goods, such as cars, have parts made in both countries."),
  q(2, "Which is a benefit of trade between countries?", "Consumers have more choices and businesses reach more customers", ["Every country makes the same goods", "Prices never change", "No jobs are affected"], "Countries can specialize in what they produce best and trade for the rest."),
  q(2, "A country has more imports than exports. This is called…", "a trade deficit", ["a trade surplus", "a tariff", "a quota"], "A trade surplus is when exports are greater than imports."),
  q(2, "Why might some workers worry about free trade?", "Their industry may face competition from cheaper imports", ["Trade stops all sales", "It increases all wages", "It closes the border"], "Trade creates winners and losers, so governments sometimes help workers move to new jobs."),
  q(2, "Why might the government of one country put tariffs on another country's steel?", "to protect its own steel producers from competition", ["to give away steel", "to end all trade", "to lower steel prices to zero"], "Tariffs can protect some jobs but also make goods cost more for consumers."),
  q(3, "Alberta's canola oil, beef and grain are sold in many countries. Why does it help Alberta to have many trading partners?", "It lowers the risk from problems in any one market", ["It means no taxes are needed", "It forces prices to fall", "It stops competition"], "Diversifying markets makes an economy more stable."),
  q(3, "What does \"economic interdependence\" mean?", "Countries rely on each other for goods, services and markets", ["Countries produce everything themselves", "Countries never trade", "Countries share one government"], "Canada and the United States are strongly interdependent."),
  q(3, "Which is one way Canada's economy differs from the US economy?", "Canada has a much smaller population and a greater share of its economy tied to exports", ["Canada has no private businesses", "Canada has no trade", "The US has no government"], "Canada's smaller domestic market means it depends on trade, especially with the US."),
  q(3, "Globalization means…", "growing connections among the world's economies, cultures and people", ["countries closing their borders", "ending all businesses", "a single world government"], "Trade, communication and travel link economies across the world."),
  q(3, "Why do Canadian and American economies respond to each other's economic events?", "They trade heavily and their businesses and workers are connected", ["They share one currency", "They share one prime minister", "They have no connection"], "A slowdown in one country can reduce the sales of the other."),
];

function exchange(): Question {
  const rate = pick([1.25, 1.5, 1.4, 1.2]);
  const usd = pick([20, 40, 60, 80, 100, 200]);
  const cad = Math.round(usd * rate * 100) / 100;
  const label = String(cad);
  return typeIn(`If US$1 equals C$${rate}, how many Canadian dollars (C$) is US$${usd} worth?`, label, `Multiply by the exchange rate: ${usd} × ${rate} = ${label}.`, undefined, { keypad: "decimal" });
}

function balance(): Question {
  const exports = randInt(30, 90) * 10;
  const diff = randInt(1, 9) * 10;
  const surplus = randInt(0, 1) === 0;
  const imports = surplus ? exports - diff : exports + diff;
  return textChoice(
    `A country exports $${exports} million of goods and imports $${imports} million. What is its trade balance?`,
    surplus ? `a surplus of $${diff} million` : `a deficit of $${diff} million`,
    [surplus ? `a deficit of $${diff} million` : `a surplus of $${diff} million`, "balanced exactly", `a surplus of $${exports + imports} million`],
    `Subtract imports from exports: ${exports} − ${imports} = ${exports - imports}. ${surplus ? "Exports are greater, so it is a surplus." : "Imports are greater, so it is a deficit."}`,
  );
}

function trade(opts?: GenerateOptions): Question[] {
  const makers: Maker[] = [exchange, balance];
  return unitSet(TRADE, levelOf(opts), makers);
}

export const units: Unit[] = [
  {
    id: "governance-ab",
    title: "Governing Canada",
    emoji: "🏛️",
    blurb: "Levels, branches and elections",
    standards: ab("9.1", "how Canada and Alberta are governed: levels and branches of government, elections and the Constitution"),
    parentNote: "The three levels of government, who is responsible for what, how laws are made, how elections work and how the Constitution is changed, with examples from Alberta.",
    generate: (opts) => unitSet(GOVERNANCE, levelOf(opts), []),
  },
  {
    id: "charter-ab",
    title: "Rights & Responsibilities",
    emoji: "⚖️",
    blurb: "The Charter, human rights and justice",
    standards: ab("9.1", "the Charter of Rights and Freedoms, human rights, responsibilities of citizens and the justice system"),
    parentNote: "The Canadian Charter of Rights and Freedoms, the limits on rights, the Alberta Human Rights Act, the role of the courts, and the rights and responsibilities of citizens.",
    generate: (opts) => unitSet(CHARTER, levelOf(opts), []),
  },
  {
    id: "treaties-and-rights-ab",
    title: "Treaties & Indigenous Rights",
    emoji: "🤝",
    blurb: "Treaties 6, 7 and 8, Métis Settlements and reconciliation",
    standards: ab("9.1", "treaties and the rights of First Nations, Métis and Inuit peoples in Canada, and reconciliation"),
    parentNote: "The treaty areas of Alberta, the Métis Settlements, the Constitution's recognition of First Nations, Inuit and Métis rights, residential schools and the Calls to Action. These topics need care; talk about them together. Review with First Nations and Métis partners is planned before launch.",
    generate: (opts) => unitSet(TREATIES, levelOf(opts), []),
  },
  {
    id: "economic-systems-ab",
    title: "Economic Systems",
    emoji: "💱",
    blurb: "Traditional, command, market and mixed",
    standards: ab("9.2", "traditional, command, market and mixed economic systems, scarcity, opportunity cost and profit"),
    parentNote: "The four kinds of economic system, how scarcity forces choices, the factors of production, profit, and how Canada and the United States blend private business with government roles.",
    generate: systems,
  },
  {
    id: "supply-demand-ab",
    title: "Supply & Demand",
    emoji: "📈",
    blurb: "How prices are set in a market",
    standards: ab("9.2", "supply, demand, prices and how markets respond to change"),
    parentNote: "Why prices rise or fall, what a shortage and a surplus are, how costs and substitutes affect prices, and where government price controls come in.",
    generate: markets,
  },
  {
    id: "canada-us-trade-ab",
    title: "Canada, the US & Trade",
    emoji: "🌎",
    blurb: "Trading partners and trade agreements",
    standards: ab("9.2", "comparing the Canadian and American economies, and trade between them and the world"),
    parentNote: "Imports and exports, tariffs, trade agreements such as CUSMA, how Alberta's industries depend on trade with the United States, and how the two economies are alike and different.",
    generate: trade,
  },
];
