import type { SortSet } from "../bank";
import { fromParts, orderOf, q, qe, type Item, type Level, type UnitParts } from "../grades/kit";
import { pick, randInt, sample, shuffle } from "../random";
import type { GenerateOptions, Question, Unit } from "../types";
import { levelOf, on, spaced, typeIn } from "./kit";

// Ontario Grade 8 social studies (2018): History (Creating Canada, 1850–1890; Canada, 1890–1914) and
// Geography (Global Settlement; Global Inequalities). The BC Grade 8 course covers the world from about
// 600 to 1750, so none of its units are shared. All content is original. Dates were checked against
// standard references; the units on treaties, the Métis resistances and residential schools use careful
// wording and still need review with First Nations, Métis and Inuit partners before launch.

const plain = (parts: UnitParts) => (opts?: GenerateOptions): Question[] => fromParts(parts, opts);

/** A unit from a bank of items, with typed-answer calculations mixed in. */
function withCalc(parts: UnitParts, calcs: ((level: Level) => Question)[], count: number) {
  return (opts?: GenerateOptions): Question[] => {
    const level = levelOf(opts);
    const keep = [...fromParts(parts, opts)];
    for (let removed = 0; removed < count; removed++) {
      const i = keep.findIndex((x) => x.kind === "choice");
      if (i >= 0) keep.splice(i, 1);
    }
    return shuffle([...keep, ...sample(calcs, count).map((make) => make(level))]);
  };
}

// ---------- Confederation ----------

const CONFEDERATION: Item[] = [
  q(1, "In what year did Canada become a country, the Dominion of Canada?", "1867", ["1837", "1885", "1905"], "Confederation took effect on July 1, 1867."),
  q(1, "Which four provinces made up the Dominion of Canada in 1867?", "Ontario, Quebec, Nova Scotia and New Brunswick", ["Ontario, Quebec, Manitoba and British Columbia", "Ontario, Nova Scotia, Prince Edward Island and Newfoundland", "Quebec, New Brunswick, Manitoba and Nova Scotia"], "The Province of Canada split into Ontario and Quebec, and joined Nova Scotia and New Brunswick."),
  q(1, "Who was Canada's first prime minister?", "Sir John A. Macdonald", ["Sir Wilfrid Laurier", "George-Étienne Cartier", "Louis Riel"], "Macdonald led the Conservatives and became prime minister in 1867."),
  q(1, "What is Confederation?", "the joining of British North American colonies to form a new country in 1867", ["a war between Britain and the United States", "a treaty with a First Nation", "a new railway line"], "The colonies agreed to unite under one federal government."),
  q(1, "Which 1864 conference was first planned to discuss a union of the Maritime colonies?", "the Charlottetown Conference", ["the London Conference", "the Ottawa Conference", "the Winnipeg Conference"], "Delegates from the Province of Canada asked to join the talks."),
  q(1, "What is the capital city of the Dominion of Canada?", "Ottawa", ["Toronto", "Montreal", "Halifax"], "Ottawa became the capital before Confederation and remained the capital in 1867."),
  q(2, "Why did the threat of American expansion help push the colonies toward Confederation?", "They hoped that a larger union would better defend British North America.", ["They wanted to join the United States.", "They wanted to stop all trade.", "They hoped to end the monarchy."], "The U.S. had just finished its Civil War, and many Americans talked about Manifest Destiny."),
  q(2, "Why was the Province of Canada's government hard to run in the 1860s?", "Canada East and Canada West had equal seats, and governments often could not get a majority.", ["It had no parliament.", "It had no railway.", "It had no cities."], "Political deadlock was a major reason for seeking a larger union."),
  q(2, "How did Confederation try to solve the problem of different needs in different regions?", "It created a federal system with provincial governments for local matters.", ["It gave all power to Britain.", "It gave all power to cities.", "It ended local government."], "The federal government handles national matters, and provinces handle many local ones."),
  q(2, "The Fenians were Irish-American groups who raided across the border in 1866. How did this affect Confederation?", "It increased fears for security and the desire for joint defence.", ["It ended all talks.", "It made Britain take over defence completely.", "It had no effect on anyone."], "Fear of attack made some people more willing to unite."),
  q(2, "The United States ended the Reciprocity Treaty in 1866. Why did this matter?", "Colonies lost free-trade access to American markets and looked for trade among themselves.", ["Colonies gained new markets in the U.S.", "Trade between colonies stopped.", "It made Britain leave."], "A bigger Canadian market could help replace the lost trade."),
  q(2, "Why was the proposed Intercolonial Railway important to the Maritime colonies?", "It would connect them to Quebec and Ontario all year.", ["It would connect them to Japan.", "It would replace all ships.", "It would carry only mail to Europe."], "Ice closed St. Lawrence ports in winter, so a railway to the Maritimes was needed."),
  q(2, "Which Father of Confederation was the leading French-Canadian politician from Quebec?", "George-Étienne Cartier", ["George Brown", "Charles Tupper", "Joseph Howe"], "Cartier helped ensure that Quebec's language, laws and religion were protected."),
  q(2, "Which Nova Scotian leader campaigned against Confederation?", "Joseph Howe", ["Charles Tupper", "Sir John A. Macdonald", "George-Étienne Cartier"], "Howe feared Nova Scotia would lose control over its own affairs."),
  q(2, "Which groups were NOT invited to the Confederation conferences?", "First Nations, Métis and Inuit leaders, and women", ["delegates from the Province of Canada", "delegates from Nova Scotia", "delegates from New Brunswick"], "The decisions were made by colonial politicians who were almost all men."),
  q(2, "In 1869 the Hudson's Bay Company agreed to transfer Rupert's Land to Canada. Why did the Métis of Red River object?", "They were not consulted about the land where they lived.", ["They wanted the land to stay empty.", "They owned the Hudson's Bay Company.", "They wanted to join the United States."], "The transfer was arranged between governments and the company, without asking the people who lived there."),
  q(3, "Why did some people in Nova Scotia and New Brunswick oppose Confederation?", "They feared higher taxes and losing control to Central Canada.", ["They wanted to give up self-government.", "They wanted to join France.", "They wanted a smaller railway."], "Many Maritimers thought their interests might be ignored."),
  q(3, "The British North America Act (1867) is described as a “federal” union. What does federal mean?", "Power is divided between a central government and provincial governments.", ["Only one government rules.", "Only provinces have power.", "Only Britain makes laws."], "Different governments are responsible for different matters."),
  q(3, "Whose perspective would be missing if you studied Confederation using only the conference records?", "Indigenous peoples, women and many ordinary workers", ["the delegates", "the Fathers of Confederation", "the newspapers"], "The records show the views of the delegates, not everyone affected."),
  q(3, "Who could vote in most places in 1867?", "mostly men who owned property", ["every adult", "only women", "everyone over 16"], "Women could not vote, and most Indigenous people and many workers could not either."),
  q(3, "Why did Britain support Confederation in the 1860s?", "It wanted the colonies to take on more of their own defence and costs.", ["It wanted to take more control.", "It wanted to sell its navy.", "It wanted to end trade."], "Many British politicians thought the colonies should be more self-reliant."),
  q(3, "Manitoba joined Canada in 1870 after the Red River Resistance. Which statement is accurate?", "Manitoba was created as a province through the Manitoba Act.", ["Manitoba was one of the original four provinces.", "Manitoba joined in 1905.", "Manitoba joined without any negotiation."], "The Manitoba Act (1870) followed negotiations with the Provisional Government."),
];

const CONFED_ORDER = orderOf(
  "Put these events in order, earliest first.",
  "Charlottetown and Quebec both happened in 1864; Confederation was in 1867; Manitoba joined in 1870, British Columbia in 1871 and PEI in 1873.",
  [
    { id: "charlottetown", label: "The Charlottetown Conference (1864)", emoji: "🏛️" },
    { id: "quebec", label: "The Quebec Conference (1864)", emoji: "🏰" },
    { id: "confed", label: "Confederation (1867)", emoji: "🍁" },
    { id: "manitoba", label: "Manitoba joins Canada (1870)", emoji: "🌾" },
    { id: "bc", label: "British Columbia joins Canada (1871)", emoji: "🏔️" },
    { id: "pei", label: "Prince Edward Island joins Canada (1873)", emoji: "🥔" },
  ],
);

const PROVINCE_SORT: SortSet = {
  prompt: "Was it one of the four original provinces in 1867, or did it join later?",
  hint: "Ontario, Quebec, Nova Scotia and New Brunswick were the original four. Manitoba (1870), British Columbia (1871), Prince Edward Island (1873), Alberta and Saskatchewan (1905) joined later.",
  bins: [
    { id: "original", label: "Original province, 1867", emoji: "1️⃣" },
    { id: "later", label: "Joined later", emoji: "➕" },
  ],
  items: [
    { label: "Ontario", emoji: "🍁", bin: "original" },
    { label: "Quebec", emoji: "⚜️", bin: "original" },
    { label: "Nova Scotia", emoji: "⚓", bin: "original" },
    { label: "New Brunswick", emoji: "🌲", bin: "original" },
    { label: "Manitoba", emoji: "🌾", bin: "later" },
    { label: "British Columbia", emoji: "🏔️", bin: "later" },
    { label: "Prince Edward Island", emoji: "🥔", bin: "later" },
    { label: "Alberta", emoji: "🛢️", bin: "later" },
  ],
};

// ---------- The railway, the West and the new nation ----------

const RAILWAY: Item[] = [
  q(1, "What was the Canadian Pacific Railway (CPR)?", "a railway built to link eastern Canada with British Columbia", ["a ship line to Europe", "a road across the Prairies", "a telegraph company"], "It was completed across the country in 1885."),
  q(1, "Where was the last spike of the CPR driven in 1885?", "Craigellachie, British Columbia", ["Toronto, Ontario", "Halifax, Nova Scotia", "Regina, Saskatchewan"], "The ceremony took place on November 7, 1885."),
  q(1, "Which promise helped bring British Columbia into Canada in 1871?", "a railway to link it with the East", ["a new canal", "a free ship to Asia", "a gold coin for each person"], "The railway was meant to be built within ten years."),
  q(1, "Who was recruited in large numbers to build dangerous sections of the CPR through the mountains?", "Chinese workers", ["British soldiers", "Fur traders", "Sailors"], "Thousands of Chinese labourers did hard, dangerous work and were paid less than other workers."),
  q(1, "What was the North-West Mounted Police (NWMP), formed in 1873?", "a federal police force for the West", ["a naval force", "a railway company", "a trade union"], "It was the early version of today's RCMP."),
  q(2, "What was the National Policy of 1879?", "a plan with tariffs, a railway and settlement of the West to build the economy", ["a plan to end all trade", "a treaty with the United States", "a plan to close the railway"], "Tariffs on imported goods were meant to protect Canadian industry."),
  q(2, "Why did the government put a tariff on imported goods in the National Policy?", "to encourage people to buy Canadian-made products", ["to make products cheaper everywhere", "to stop factories", "to pay for the war"], "Higher prices on imports helped Canadian manufacturers compete."),
  q(2, "What was the Pacific Scandal of 1873?", "Macdonald's party accepted money from railway backers, and he resigned", ["a Pacific Ocean war", "the sinking of a CPR ship", "a gold rush"], "It led to the Conservatives losing power until 1878."),
  q(2, "The Dominion Lands Act (1872) offered settlers…", "160 acres of land for a small registration fee", ["free houses", "a free railway ticket", "a job on the CPR"], "The government wanted the Prairies settled by farmers."),
  q(2, "Why did the government want to settle the Prairies quickly?", "to claim the land, grow food and give the railway customers", ["to leave the land empty", "to stop trade", "to protect the bison herds"], "Settlement supported the National Policy and made the CPR profitable."),
  q(2, "By the late 1870s, the plains bison had nearly disappeared. How did this affect Plains First Nations?", "It made it much harder to feed their communities and led to hardship.", ["It made life easier.", "It had no effect.", "It made trade with Europe grow."], "Many nations had relied on bison for food, clothing and shelter."),
  q(2, "What was the effect of the Toronto printers' strike of 1872?", "It brought attention to the nine-hour working day and helped lead to the legal recognition of trade unions.", ["It ended all printing.", "It made trade unions illegal.", "It made children work longer."], "The Trade Unions Act of 1872 followed the strike."),
  q(2, "The Fraser River gold rush began in 1858. How did it change British Columbia?", "Many newcomers arrived quickly, and a colony was formed on the mainland.", ["No one came.", "The railway ended.", "The population shrank."], "The mainland Colony of British Columbia was created in 1858."),
  q(2, "The Industrial Revolution brought factories to Canadian cities. What was one effect?", "More people moved to cities to work in factories.", ["Fewer goods were made.", "People stopped using machines.", "Cities got smaller."], "Urban centres grew as workers moved from farms."),
  q(3, "Why was the CPR important to Confederation?", "It linked the country, helped move settlers and goods, and made the Dominion more than a name.", ["It made trade with the United States unnecessary.", "It ended the need for a government.", "It was built for tourists only."], "A railway across the continent tied the regions together."),
  q(3, "Which group's perspective is often left out of stories about the CPR?", "the Chinese workers who built it", ["the shareholders", "the engineers", "the politicians who talked about it"], "Chinese labourers were paid less and lived in poor conditions, and many died."),
  q(3, "Why might the railway have been viewed differently by a First Nation on the Prairies than by a settler farmer?", "The railway brought settlers, and settlers took up land the First Nation had lived on.", ["The railway delivered free goods.", "Both groups saw it as a purely good change.", "The railway left First Nations alone."], "The same development can have different consequences for different people."),
  q(3, "Which statement about the National Policy is accurate?", "It helped some industries grow but made imported goods more expensive for farmers.", ["It helped every person equally.", "It eliminated all tariffs.", "It stopped all settlement."], "Tariffs protected manufacturers, but they raised the cost of equipment."),
  q(3, "Why did Canadian governments in the 1870s and 1880s want to fill the West with settlers?", "They feared the United States might expand into the unsettled lands.", ["They wanted to give the land back to Britain.", "They did not want a railway.", "They had no interest in farming."], "A settled West helped assert Canada's claim."),
];

const RAILWAY_ORDER = orderOf(
  "Put these events in order, earliest first.",
  "BC joined in 1871, the NWMP formed in 1873, the National Policy began in 1879 and the CPR was completed in 1885.",
  [
    { id: "bc", label: "British Columbia joins Canada (1871)", emoji: "🏔️" },
    { id: "nwmp", label: "The North-West Mounted Police is formed (1873)", emoji: "🐎" },
    { id: "national", label: "The National Policy begins (1879)", emoji: "🏭" },
    { id: "cpr", label: "The CPR is completed (1885)", emoji: "🚂" },
  ],
);

// ---------- Treaties and the Indian Act ----------

const TREATIES: Item[] = [
  q(1, "What is a treaty?", "a formal agreement between nations", ["a type of ship", "a new law for one town", "a map"], "Treaties between First Nations and the Crown are still in force today."),
  q(1, "Which treaties were made in 1850 with Anishinaabe nations north of Lakes Huron and Superior?", "the Robinson Treaties", ["the Jay Treaty", "Treaty 7", "the Oregon Treaty"], "They were named after the Crown's negotiator, William Benjamin Robinson."),
  q(1, "How many Numbered Treaties were signed between 1871 and 1921?", "11", ["3", "20", "50"], "They covered much of what is now Ontario, the Prairies and parts of the North."),
  q(1, "What is a reserve?", "land set aside under the Indian Act for the use of a First Nation", ["a type of park for tourists", "a type of military base", "a place only for newcomers"], "Reserves are often much smaller than the territories nations once used."),
  q(1, "Which law passed in 1876 gave the government wide control over First Nations people's lives?", "the Indian Act", ["the Dominion Lands Act", "the National Policy", "the Manitoba Act"], "It combined and expanded earlier laws, and it still exists today in amended form."),
  q(2, "How did many Crown officials and many First Nations understand treaties differently?", "Officials often saw land surrenders; many First Nations saw agreements to share the land and live together.", ["Both saw them as ways to end all trade.", "Both saw them as military alliances only.", "Both saw them as unimportant."], "Understandings of treaties differed, and Nations also hold oral histories of what was promised."),
  q(2, "What is meant by saying a treaty is a “nation-to-nation” agreement?", "It was made between two peoples, each with its own government and authority.", ["It was made between two towns.", "It was made between two companies.", "It was made between two churches."], "First Nations were nations with their own laws and governments."),
  q(2, "Treaty 3, signed in 1873, covers part of which present-day region?", "northwestern Ontario and eastern Manitoba", ["British Columbia's coast", "the Maritime provinces", "Nunavut"], "It was negotiated at the Northwest Angle with Anishinaabe leaders."),
  q(2, "What did the Indian Act allow the government to do?", "decide who counted as “Indian” in law and control reserves, governance and education", ["give First Nations control of all land", "end the need for treaties", "protect all Indigenous languages"], "The Act put many parts of life under federal control."),
  q(2, "Under the Indian Act, what happened to First Nations women who married men without Indian status?", "They lost their own status.", ["They gained extra rights.", "They became chiefs.", "They became citizens of a foreign country."], "This rule was discriminatory, and later changes (1985) began to restore status."),
  q(2, "What was an “Indian agent”?", "a government official who oversaw life on a reserve", ["a First Nations chief", "a fur trader", "a railway worker"], "Agents had power over many parts of daily life, such as leaving the reserve to sell goods."),
  q(2, "Why did Mistahimaskwa (Big Bear), a Cree leader, wait until 1882 to sign Treaty 6?", "He wanted better terms and a way for his people to keep a say in their future.", ["He had never heard of the treaty.", "He wanted to start a war.", "He wanted to sell land."], "Several leaders pressed for fairer terms as the bison disappeared."),
  q(2, "Crowfoot (Isapo-muxika) of the Siksika Nation was a leader at which treaty negotiation in 1877?", "Treaty 7", ["Treaty 1", "Treaty 9", "the Jay Treaty"], "Treaty 7 covered southern Alberta, with the Blackfoot Confederacy and others."),
  q(3, "What is meant by “enfranchisement” in the Indian Act?", "giving up Indian status in order to have certain legal rights, such as voting", ["receiving a gift of land", "joining the army", "receiving a pension"], "Giving up status meant leaving the community in law, which was a very harsh choice."),
  q(3, "Why do many First Nations say treaty promises were not always kept?", "Some promised supports, land and rights were not fully honoured.", ["No promises were ever made.", "Governments gave more than promised.", "Every treaty was fully honoured."], "Disagreements over what was promised and what was delivered are still being addressed."),
  q(3, "The Royal Proclamation of 1763 matters for treaty making because it…", "said the Crown must negotiate with First Nations before taking their land", ["gave all land to settlers", "banned all treaties", "created the Indian Act"], "It recognized First Nations' rights to their lands, though it was often not followed."),
  q(3, "A history textbook describes the Numbered Treaties only from the government's records. What is missing?", "the perspectives and oral histories of the First Nations who made them", ["the dates of signing", "the names of the treaties", "the number of treaties"], "Oral histories are an important source about what was agreed."),
  q(3, "Which of these is a way First Nations leaders acted to protect their people during this period?", "negotiating treaty terms and pressing for supports such as food, health care and farming help", ["leaving all decisions to Indian agents", "giving up all rights", "ignoring the government"], "Leaders used the negotiations to try to secure a future for their communities."),
  q(3, "Treaty 9 was first signed in 1905–06. In which part of Canada is it?", "northern Ontario", ["southern British Columbia", "Nova Scotia", "Prince Edward Island"], "It is also known as the James Bay Treaty."),
];

const TREATY_ORDER = orderOf(
  "Put these events in order, earliest first.",
  "The Robinson Treaties were in 1850, Treaty 3 in 1873, the Indian Act in 1876, and Treaty 7 in 1877.",
  [
    { id: "robinson", label: "The Robinson Treaties (1850)", emoji: "📜" },
    { id: "treaty3", label: "Treaty 3 (1873)", emoji: "🪶" },
    { id: "indianact", label: "The Indian Act is passed (1876)", emoji: "⚖️" },
    { id: "treaty7", label: "Treaty 7 (1877)", emoji: "🤝" },
  ],
);

// ---------- Métis and the resistances ----------

const METIS: Item[] = [
  q(1, "Who are the Métis?", "a distinct Indigenous people with their own culture, language and history", ["a group of fur traders from Europe", "a type of First Nation reserve", "a political party"], "The Métis Nation grew out of relationships between First Nations and European fur traders, and it is its own people."),
  q(1, "Who led the Provisional Government of the Red River Métis in 1869–70?", "Louis Riel", ["Gabriel Dumont", "Crowfoot", "John A. Macdonald"], "Riel was a young Métis leader."),
  q(1, "Where was the Red River Settlement?", "near present-day Winnipeg, Manitoba", ["near present-day Halifax", "near present-day Vancouver", "near present-day Iqaluit"], "It was a large Métis community at the meeting of two rivers."),
  q(1, "Which law created the province of Manitoba in 1870?", "the Manitoba Act", ["the Indian Act", "the British North America Act", "the Dominion Lands Act"], "It followed negotiations with the Provisional Government."),
  q(2, "Why did the Red River Métis form a Provisional Government in 1869?", "to protect their land and rights before Canada took over", ["to attack Ontario", "to join the United States", "to trade furs"], "Surveyors arrived before the Métis had been consulted."),
  q(2, "What did the Manitoba Act promise the Métis?", "land for Métis families and protection of language and religious rights", ["no land at all", "a seat on the Senate for every family", "all of Rupert's Land"], "About 1.4 million acres were set aside for Métis children, though many families did not receive land."),
  q(2, "Gabriel Dumont was a Métis leader known for…", "military leadership in the Saskatchewan region in 1885", ["building the CPR", "starting the NWMP", "founding Ottawa"], "He led Métis forces at Batoche."),
  q(2, "Where did the Battle of Batoche take place in 1885?", "in what is now Saskatchewan", ["in Ontario", "in Nova Scotia", "in British Columbia"], "The Métis community of Batoche was on the South Saskatchewan River."),
  q(2, "Why did the Métis in the Saskatchewan region take action in 1885?", "They were concerned about land titles, rights and the government's slow response.", ["They wanted to build a railway.", "They wanted to end farming.", "They wanted to move to Europe."], "Petitions to the government had gone unanswered for years."),
  q(2, "Which Cree leaders were convicted and imprisoned after the events of 1885?", "Poundmaker and Mistahimaskwa (Big Bear)", ["Crowfoot and Sitting Bull", "Joseph Brant and Tecumseh", "Isapo-muxika and Peguis"], "Both were convicted of treason-felony and imprisoned, and both died within a few years of their release."),
  q(2, "What happened to Louis Riel after the 1885 resistance?", "He was convicted of high treason and executed in November 1885.", ["He became prime minister.", "He moved to Europe.", "He became head of the NWMP."], "His death remains a very sensitive subject, especially for the Métis and many French Canadians."),
  q(3, "How did English-speaking and French-speaking Canadians often react differently to Riel's execution?", "Many French Canadians were angry, while many English Canadians supported the decision.", ["Everyone agreed with the decision.", "No one cared.", "Only the Maritimes were upset."], "It deepened divisions in the country."),
  q(3, "In 2013, the Supreme Court of Canada ruled that the Crown had failed to carry out the Manitoba Act land promise honourably. What did that show?", "The Métis claim about the land promise was recognized as valid.", ["The Manitoba Act was never real.", "Land promises are not important.", "The Métis had no claim."], "The Manitoba Métis Federation case recognized a long-standing grievance."),
  q(3, "Why is it important to consider Métis sources, not only government reports, about the Resistances?", "The Métis have their own accounts and understandings of what happened and why.", ["Government reports are always complete.", "Métis accounts are never reliable.", "Sources do not matter in history."], "Different people experienced the events differently."),
  q(3, "Many Métis and historians use “Resistance” rather than “Rebellion” for the Red River events. What is one reason?", "The Métis were protecting their community and rights while negotiating with Canada.", ["Nobody took any action.", "It was only a peaceful festival.", "The word has no meaning."], "Word choices reflect perspectives, so historians think carefully about them."),
  q(3, "Manitoba now recognizes Louis Riel as…", "a founder of the province", ["its first prime minister", "a CPR engineer", "a NWMP officer"], "Louis Riel Day is celebrated in Manitoba in February."),
];

// ---------- Residential schools ----------

const RESIDENTIAL: Item[] = [
  q(1, "What was the residential school system?", "a system of government-funded, church-run schools for First Nations, Métis and Inuit children", ["a system of summer camps", "a system of private colleges", "a system of boarding schools children chose"], "Many children were taken from their families."),
  q(1, "What was the purpose of the residential school system, according to the government that set it up?", "to remove Indigenous children from their families and cultures and assimilate them", ["to protect Indigenous languages", "to train children as sailors", "to teach children to be chiefs"], "Assimilation means forcing people to give up their own culture."),
  q(1, "When did the last federally run residential school close?", "1996", ["1885", "1920", "1950"], "Some schools operated for more than a century."),
  q(1, "Who were survivors?", "people who attended residential schools and lived through the experience", ["school teachers", "government officials", "newcomers to Canada"], "Survivors have shared their stories so that Canadians can learn."),
  q(2, "How did residential schools harm children and communities?", "Children were separated from their families, languages and cultures, and many were mistreated.", ["Children had more time with their families.", "Children were taught only in their own languages.", "Communities received all the support they asked for."], "The effects have lasted for generations."),
  q(2, "Who operated most residential schools for the government?", "churches", ["First Nations governments", "banks", "railway companies"], "Catholic, Anglican, United and other churches ran the schools with federal money."),
  q(2, "What is intergenerational impact?", "harm that continues across generations, from survivors to their children and grandchildren", ["a school program", "a type of map", "a type of treaty"], "Lost language and family ties affected the generations that followed."),
  q(2, "What did the Truth and Reconciliation Commission of Canada (2008–2015) do?", "It heard from survivors and published a report with 94 Calls to Action.", ["It built the schools.", "It closed the Indian Act.", "It created the railway."], "The Calls to Action ask all Canadians and governments to work toward reconciliation."),
  q(2, "What is the National Day for Truth and Reconciliation, on September 30?", "a day to honour survivors, their families and communities and remember the children who did not come home", ["a day for a sports final", "a day of treaties", "a day of voting"], "It is also called Orange Shirt Day by many."),
  q(2, "Which law helped create the conditions for residential schools by giving the government power over First Nations children's education?", "the Indian Act", ["the Manitoba Act", "the National Policy", "the Dominion Lands Act"], "Later amendments made attendance compulsory for many children."),
  q(3, "Why do survivors' stories matter in learning about residential schools?", "They give first-hand knowledge of what happened and how it affected people.", ["They replace all other evidence.", "They are not needed.", "They are only about feelings."], "First-hand accounts and documents together give a fuller picture."),
  q(3, "What does reconciliation mean?", "building respectful relationships by learning the truth and acting to repair harm", ["forgetting the past", "ending all treaties", "moving to a new country"], "It is an ongoing process, not a single event."),
  q(3, "The Truth and Reconciliation Commission said the system of residential schools was a form of…", "cultural genocide", ["a peace treaty", "voluntary education", "a trade policy"], "It described the system as an attempt to destroy Indigenous cultures and identities."),
  q(3, "How did some families and communities resist residential schools?", "Some parents hid children, wrote to officials or kept languages and traditions alive at home.", ["No one ever resisted.", "Families sent all children willingly.", "Communities built the schools."], "Resistance took many forms, often at great risk."),
  q(3, "Which is a way Canadians can respond today?", "learn the history, listen to survivors and support Indigenous-led efforts", ["ignore the topic", "tell survivors how to feel", "say it is all in the past"], "Respectful learning is a first step."),
  q(3, "In 2008, the Prime Minister of Canada did what on behalf of the Government of Canada?", "offered a formal apology to survivors of residential schools", ["created the schools", "signed Treaty 6", "closed the border"], "The apology was made in the House of Commons on June 11, 2008."),
];

// ---------- Black communities in Canada ----------

const BLACK: Item[] = [
  q(1, "What was the Underground Railroad?", "a network of secret routes and safe places that helped people escape slavery", ["a train that ran under cities", "a subway system", "a canal across Ontario"], "It was not a real railroad. It was a network of people, homes and routes."),
  q(1, "Slavery was ended throughout most of the British Empire, including British North America, in which year?", "1834", ["1793", "1867", "1900"], "The Slavery Abolition Act took effect on August 1, 1834."),
  q(1, "Where did many people who escaped slavery settle in Canada West (now Ontario)?", "southwestern Ontario", ["the Arctic", "the Prairies", "Newfoundland"], "Communities grew near Windsor, Amherstburg, Chatham and Buxton, close to the border."),
  q(1, "Which leader of the Underground Railroad lived in St. Catharines, Ontario in the 1850s?", "Harriet Tubman", ["Sir John A. Macdonald", "Louis Riel", "Pauline Johnson"], "She guided many people to freedom and made trips from Canada West."),
  q(1, "Mary Ann Shadd is remembered as the first Black woman in North America to…", "publish a newspaper", ["lead an army", "become prime minister", "build a railway"], "She published The Provincial Freeman, which began in 1853."),
  q(2, "Why did more people leave the United States for Canada after the Fugitive Slave Act of 1850?", "The law put people at risk of capture even in free states.", ["Canada offered free houses.", "The law ended slavery.", "The law closed the border."], "Free states were no longer safe, so many people travelled farther north."),
  q(2, "What was the Elgin Settlement (Buxton), founded in 1849?", "a community in Canada West where formerly enslaved people could own land and attend school", ["a fort on Lake Ontario", "a mining camp in the Yukon", "a trading post for furs"], "It became one of the best-known Black settlements."),
  q(2, "Josiah Henson founded a settlement and school near Dresden, Ontario. What helped make his story widely known?", "He wrote an account of his life.", ["He built a railway.", "He won the Boston Marathon.", "He invented the telephone."], "His autobiography was widely read in his lifetime."),
  q(2, "Why did Henry Bibb publish The Voice of the Fugitive in Canada West in 1851?", "to share the news and stories of people who had escaped slavery", ["to sell railway tickets", "to advertise farms", "to report on hockey"], "Black-owned newspapers helped build community."),
  q(2, "Anderson Ruffin Abbott is remembered as the first…", "Canadian-born Black doctor", ["Black prime minister", "Black judge on the Supreme Court", "Black NWMP officer"], "He was born in Toronto and graduated as a doctor in 1861."),
  q(2, "Black families who reached Canada West were free from slavery. What else is true?", "They still faced racism, including segregated schools in some places.", ["They were treated the same as everyone.", "They could not own land.", "They were all returned to the U.S."], "Freedom from slavery did not end unfair treatment."),
  q(2, "Why did some Black settlers from California move to Vancouver Island in 1858?", "Governor James Douglas invited them, and they hoped for greater safety and opportunity.", ["The CPR was already finished.", "They were forced to move.", "They wanted to join the Klondike gold rush."], "California had unfair laws against Black people."),
  q(2, "What did Upper Canada's Act Against Slavery (1793) do?", "It stopped new enslaved people from being brought in and began a gradual end to slavery.", ["It ended slavery at once.", "It made slavery legal everywhere.", "It created the Dominion."], "It was a first step; slavery fully ended in 1834."),
  q(2, "Why did some Black families move from the United States to Alberta and Saskatchewan between 1905 and 1911?", "to escape growing racism and take up homesteads", ["to build the CPR", "to look for the Klondike", "to join the navy"], "Amber Valley in Alberta was one such community."),
  q(3, "Why is it important to include stories of Black communities in Canadian history?", "It gives a fuller and more accurate picture of Canada's past.", ["It removes other stories.", "It makes history shorter.", "Black communities were not part of Canada."], "Leaving out groups gives an incomplete picture."),
  q(3, "How did Black churches, such as the British Methodist Episcopal Church, help their communities?", "They were places of worship, support and organizing for community needs.", ["They controlled the government.", "They had no role beyond a service.", "They were only for newcomers."], "Churches were centres for schools, aid and activism."),
  q(3, "Which statement best describes Canada as a place of refuge for people escaping slavery?", "It offered freedom from slavery, but Black people still faced discrimination.", ["It was free from racism.", "It returned people to enslavers.", "It had no Black communities."], "Both of these things were true at the same time."),
  q(3, "What do the actions of Mary Ann Shadd and Henry Bibb show?", "Black Canadians were actively working to improve their lives and to speak for their communities.", ["Black communities waited for others to act.", "Newspapers were not important then.", "Only governments made change."], "Their newspapers argued for rights, education and community-building."),
  q(3, "Why are first-hand accounts, such as autobiographies of people who escaped slavery, valuable to historians?", "They show what people experienced in their own words.", ["They are always complete and unbiased.", "They replace all other sources.", "They are not evidence."], "Historians compare these accounts with other evidence."),
  q(3, "Some Black men from Canada West joined the Union army in the American Civil War (1861–65). What does this show?", "Many Black Canadians cared about ending slavery and took part in that struggle.", ["Canada fought in the war.", "No one in Canada cared about slavery.", "Black people were not allowed in the army."], "Some Black men from Canada crossed the border to fight for the Union."),
];

// ---------- Rights, restrictions and newcomers ----------

const NEWCOMERS: Item[] = [
  q(1, "What is immigration?", "moving to a new country to live", ["visiting for a day", "moving to a new house in the same town", "travelling by ship"], "Immigrants are people who come to live in a new country."),
  q(1, "Which part of Canada did the government most want settled by farmers around 1900?", "the Prairies", ["the Arctic", "the Atlantic coast", "downtown Toronto"], "The government advertised cheap land in the West."),
  q(1, "Which region sent large numbers of immigrants to the Prairies around 1900?", "Eastern and Central Europe", ["Antarctica", "Australia", "South America"], "Many Ukrainian, Polish and German families settled as farmers."),
  q(1, "What was the Chinese head tax?", "a fee that Chinese immigrants had to pay to enter Canada", ["a tax on railways", "a fee for fishing", "a tax on homes"], "No other group had to pay it."),
  q(1, "Who gained the right to vote in Canada between 1916 and 1918?", "most women", ["children", "visitors", "no one"], "Manitoba was first in 1916, and federally most women could vote in 1918."),
  q(2, "How much was the Chinese head tax after 1903?", "$500", ["$50", "$100", "$5"], "It rose from $50 in 1885 to $100 in 1900 and $500 in 1903."),
  q(2, "What did the Chinese Immigration Act of 1923 do?", "It almost completely stopped Chinese immigration until 1947.", ["It welcomed Chinese immigrants.", "It ended the head tax and gave everyone the vote.", "It made the head tax cheaper."], "Chinese Canadians called July 1 “Humiliation Day.”"),
  q(2, "In 2006, the Government of Canada…", "formally apologized for the Chinese head tax", ["introduced the head tax", "closed the border", "ended the Indian Act"], "The apology recognized the harm done to Chinese Canadians."),
  q(2, "British Columbia's Qualification of Voters Act (1872) denied the provincial vote to…", "Chinese and First Nations residents", ["Scottish residents", "farmers", "all men"], "Voting rights were denied to people because of their race."),
  q(2, "Clifford Sifton, as minister of the Interior from 1896 to 1905, was known for…", "promoting immigration to settle the Prairies", ["building the CPR", "starting the NWMP", "leading the Klondike gold rush"], "He wanted farmers from many parts of Europe and the United States."),
  q(2, "“The Last Best West” was…", "an advertising slogan to attract settlers to the Prairies", ["a railway", "a treaty", "a gold mine"], "Posters and pamphlets spread the message in many languages."),
  q(2, "“Home Children” were…", "British children sent to Canada, many to work on farms or as servants", ["Indigenous children in residential schools", "children born in Canada to immigrants", "children at boarding schools in Toronto"], "About 100,000 children came between 1869 and the 1930s, and some were treated poorly."),
  q(2, "What happened to the Komagata Maru in Vancouver in 1914?", "Most of its mainly Sikh passengers from India were refused entry and the ship was forced to leave.", ["All passengers were welcomed.", "It carried gold from the Klondike.", "It was a CPR passenger ship to Winnipeg."], "A rule requiring a “continuous journey” blocked them. Canada apologized in 2016."),
  q(2, "In September 1907, a mob attacked what communities in Vancouver?", "Chinese and Japanese neighbourhoods", ["Ukrainian farms", "First Nations reserves", "British shipyards"], "Racism and fear of competition for jobs were behind the riot."),
  q(2, "Nellie McClung is remembered for…", "campaigning for women's right to vote, including a 1914 “mock parliament” in Winnipeg", ["building the CPR", "winning the Boston Marathon", "founding the NWMP"], "The mock parliament used humour to show how unfair it was that women could not vote."),
  q(3, "Why was the 1918 vote for women not equal for all women?", "Many Indigenous women and women of Asian descent were still excluded.", ["Only teachers could vote.", "All women could vote.", "No one voted."], "Other laws still denied voting rights to some groups."),
  q(3, "Until 1960, a First Nations person with Indian status could vote in federal elections only if they…", "gave up their status", ["paid a tax", "owned a business", "lived in a city"], "Giving up status meant giving up rights under the Indian Act, which was a very hard choice."),
  q(3, "The Immigration Act of 1910 did what?", "It gave officials wide power to ban groups they considered “undesirable” or unsuited.", ["It welcomed all newcomers.", "It banned all newcomers.", "It ended all restrictions."], "The law was used unfairly against some groups."),
  q(3, "Why did some workers in British Columbia support limits on Chinese immigration?", "Some feared wage competition, and racist attitudes added to the pressure.", ["Workers wanted more immigrants.", "Chinese workers were paid more than others.", "No workers cared."], "Understanding a view does not mean agreeing with it, and the policy was discriminatory."),
  q(3, "How did Chinese Canadians respond to the head tax and exclusion?", "They paid it, supported each other through associations, and later led campaigns for redress.", ["They accepted it without complaint.", "They left Canada all at once.", "They ignored the law."], "Community groups helped people and kept the story alive until the 2006 apology."),
  q(3, "How did Sikh and South Asian community members respond to the Komagata Maru's arrival?", "They raised money and challenged the exclusion in court.", ["They ignored the ship.", "They built a railway.", "They were not affected."], "The local community supported the passengers."),
  q(3, "The Married Women's Property Act in Ontario (1884) did what?", "It gave married women the right to own and control property.", ["It took away women's property.", "It gave women the vote.", "It banned marriage."], "Before such laws, a wife's property often belonged to her husband."),
];

const NEWCOMER_ORDER = orderOf(
  "Put these events in order, earliest first.",
  "The head tax began in 1885, the Vancouver riot was in 1907, the continuous journey rule in 1908, the Immigration Act in 1910 and the Komagata Maru in 1914.",
  [
    { id: "head", label: "The Chinese head tax begins (1885)", emoji: "💰" },
    { id: "riot", label: "Anti-Asian riot in Vancouver (1907)", emoji: "🏙️" },
    { id: "cont", label: "“Continuous journey” rule (1908)", emoji: "🚢" },
    { id: "act", label: "The Immigration Act of 1910", emoji: "📄" },
    { id: "komagata", label: "The Komagata Maru arrives in Vancouver (1914)", emoji: "⚓" },
  ],
);

// ---------- Canada, 1890–1914 ----------

const CANADA_1900: Item[] = [
  q(1, "Who was prime minister of Canada from 1896 to 1911?", "Sir Wilfrid Laurier", ["Sir John A. Macdonald", "Robert Borden", "Louis Riel"], "Laurier was the first French-Canadian prime minister."),
  q(1, "The Klondike Gold Rush took place in which part of Canada?", "the Yukon", ["Nova Scotia", "Manitoba", "Prince Edward Island"], "Thousands of people travelled north in 1897 and 1898."),
  q(1, "In what year did Alberta and Saskatchewan become provinces?", "1905", ["1867", "1885", "1949"], "The new provinces were carved out of the North-West Territories."),
  q(1, "Which book by L. M. Montgomery was published in 1908?", "Anne of Green Gables", ["The Wind in the Willows", "Huckleberry Finn", "Treasure Island"], "It is set on Prince Edward Island."),
  q(1, "Alexander Graham Bell is best known for inventing the…", "telephone", ["airplane", "radio", "railway"], "He worked on the telephone in Brantford and Boston."),
  q(1, "Tom Longboat, an Onondaga runner from Six Nations of the Grand River, won which race in 1907?", "the Boston Marathon", ["the Stanley Cup", "the Olympic hockey final", "the Grey Cup"], "He became one of the most famous athletes in Canada."),
  q(1, "Which war began for Canada in August 1914 when Britain declared war?", "the First World War", ["the Boer War", "the American Civil War", "the Second World War"], "As part of the British Empire, Canada was at war automatically."),
  q(2, "The Boer War (1899–1902) was fought in…", "South Africa", ["Canada", "India", "Australia"], "Thousands of Canadian volunteers served overseas."),
  q(2, "Why were Canadians divided over sending soldiers to the Boer War?", "Many English Canadians supported helping Britain, while many French Canadians opposed fighting in a British war.", ["Everyone agreed to send soldiers.", "No one knew about the war.", "Only Quebec had an army."], "The war raised questions about Canada's loyalties and independence."),
  q(2, "Henri Bourassa, a French-Canadian nationalist, argued that…", "Canada should not be drawn into Britain's wars", ["Canada should send more soldiers to Britain", "Quebec should join the United States", "Canada should end all trade"], "He founded the newspaper Le Devoir in 1910."),
  q(2, "What did the Naval Service Act of 1910 create?", "a Canadian navy", ["a new railway", "a new province", "a new police force"], "Some wanted to give ships to Britain instead, and others did not want a navy at all."),
  q(2, "Why did the Klondike Gold Rush change the Yukon so quickly?", "Thousands of people arrived, Dawson City boomed, and the Yukon became a territory in 1898.", ["No one came.", "The railway ended.", "The population shrank."], "Dawson City grew from a tiny camp into a busy town."),
  q(2, "Why did the NWMP require prospectors to bring about a year's supplies over the Chilkoot Pass?", "to prevent hunger in the Yukon", ["to make the trip longer", "to help the CPR", "to stop gold being found"], "The Yukon could not feed thousands of newcomers."),
  q(2, "Silver was discovered near Cobalt in 1903. What was one effect?", "A mining boom brought railways and workers to northern Ontario.", ["Northern Ontario was abandoned.", "The CPR was cancelled.", "Mining ended in Ontario."], "Mining in the Cobalt, Sudbury and Porcupine areas changed northern Ontario."),
  q(2, "Why was the Hydro-Electric Power Commission of Ontario set up in 1906?", "to provide public electricity at cost", ["to build the CPR", "to run the NWMP", "to print money"], "Cheap electric power from Niagara Falls helped industry grow."),
  q(2, "Pauline Johnson (Tekahionwake) was a…", "Mohawk poet and performer from Six Nations", ["prime minister", "railway engineer", "NWMP officer"], "She performed across North America and Britain."),
  q(2, "Maude Abbott is remembered as…", "a doctor who became an expert on heart conditions", ["a prime minister", "an inventor of the telephone", "a gold prospector"], "She was a pioneering woman in medicine."),
  q(3, "What was Laurier's 1911 plan for reciprocity?", "free trade in many goods with the United States, which lost him the election", ["a tax on all imports", "a new railway", "a war with the United States"], "Many feared closer ties with the U.S., and the Conservatives under Borden won."),
  q(3, "Canada's population was about 5.4 million in 1901 and 7.2 million in 1911. About how many people were added?", "1.8 million", ["12.6 million", "0.2 million", "3.6 million"], "Subtract: 7.2 − 5.4 = 1.8."),
  q(3, "Why did the Naval Service Act divide Canadians?", "Some English Canadians wanted to give ships directly to Britain, while many French Canadians did not want to be drawn into British wars.", ["Everyone wanted a larger navy.", "No one cared about ships.", "Quebec controlled the navy."], "Disagreements reflected different ideas about Canada's ties to Britain."),
  q(3, "The Klondike Gold Rush brought thousands of newcomers to the traditional territory of the Tr'ondëk Hwëch'in. What happened to them?", "They were moved from the site of Dawson City to Moosehide.", ["They built Dawson City.", "They left Canada.", "They were not affected."], "The rush changed life for the First Nation whose land it took place on."),
  q(3, "Treaty 9 was first signed in 1905–06. Why did governments want it?", "to open land in northern Ontario to railways, mining and settlement", ["to end the Indian Act", "to remove the railway", "to give land to the Yukon"], "Governments saw the land as important for resources and development."),
  q(3, "Why was Canada automatically at war in August 1914?", "As part of the British Empire, Britain made the decision on Canada's behalf.", ["Canada chose to declare war first.", "Canada was invaded.", "Canada had no government."], "Canada's own government soon decided how much to contribute."),
  q(3, "The Silver Dart made the first powered flight in Canada in 1909. Where did it fly?", "Baddeck, Nova Scotia", ["Winnipeg, Manitoba", "Dawson City, Yukon", "Kingston, Ontario"], "J. A. D. McCurdy piloted it near Alexander Graham Bell's home."),
];

const CANADA_ORDER = orderOf(
  "Put these events in order, earliest first.",
  "The Klondike gold was found in 1896, the Boer War began in 1899, Alberta and Saskatchewan joined in 1905, the Naval Service Act was passed in 1910, and the First World War began in 1914.",
  [
    { id: "klondike", label: "Gold is found in the Klondike (1896)", emoji: "⛏️" },
    { id: "boer", label: "The Boer War begins (1899)", emoji: "🪖" },
    { id: "prov", label: "Alberta and Saskatchewan become provinces (1905)", emoji: "🌾" },
    { id: "naval", label: "The Naval Service Act (1910)", emoji: "⚓" },
    { id: "ww1", label: "The First World War begins (1914)", emoji: "🕊️" },
  ],
);

// ---------- Work, cities and reform, 1890–1914 ----------

const WORK: Item[] = [
  q(1, "What is a union?", "an organization of workers who act together for better pay and conditions", ["a company's boss", "a kind of tax", "a train line"], "Workers have more power together than alone."),
  q(1, "What is a strike?", "when workers stop work to press for changes", ["a type of tax", "a school holiday", "a kind of machine"], "A strike puts pressure on an employer."),
  q(1, "Why did cities grow quickly around 1900?", "People came to work in factories and new industries.", ["Factories closed.", "Farms got bigger and needed more workers.", "People left for the United States."], "Many people moved from farms and from other countries."),
  q(1, "A sweatshop was…", "a crowded workplace with long hours, low pay and poor conditions", ["a gym", "a modern school", "a shop for sweaters only"], "Many garment workers, including women and children, worked in them."),
  q(1, "Why did reformers want laws about child labour?", "Young children were working long hours in dangerous places.", ["Children asked for more work.", "Factories wanted fewer workers.", "Schools were closed."], "Reformers wanted children in school, not in factories."),
  q(2, "J. J. Kelso founded the Children's Aid Society in Toronto in 1891 to…", "protect children from neglect, abuse and exploitation", ["build railways", "train soldiers", "sell newspapers"], "Societies like it spread across Ontario."),
  q(2, "What did suffragists want?", "the right for women to vote", ["a shorter school year", "cheaper train tickets", "an end to taxes"], "The women's suffrage movement grew strongly in this period."),
  q(2, "Why were women often paid less than men for similar work?", "Employers and society valued women's work less.", ["Women could not read.", "Women were given extra pay.", "Men did not work."], "Unequal attitudes meant unequal pay."),
  q(2, "In 1890 most Canadians lived in rural areas. What was changing?", "More and more people were moving to cities.", ["Cities were shrinking.", "No one lived on farms.", "Everyone moved to the Arctic."], "By 1921 about half of Canadians lived in cities."),
  q(2, "In Toronto, “The Ward” was a neighbourhood where…", "many newcomers lived in crowded, poor housing", ["only the wealthy lived", "the CPR headquarters stood", "farms covered the land"], "Housing for the urban poor was often crowded and unsafe."),
  q(2, "What did the Industrial Disputes Investigation Act (1907) require in some industries?", "an investigation before a strike or lockout could start", ["an end to all unions", "a ban on all wages", "free housing"], "It tried to settle labour disputes without work stoppages."),
  q(2, "Which change helped northern Ontario mining and settlement grow around 1905?", "the Temiskaming and Northern Ontario Railway", ["the Welland Canal", "the Rideau Canal", "the Intercolonial Railway"], "The railway reached Cobalt and the north."),
  q(2, "How did electric streetcars change cities?", "People could live farther from where they worked.", ["People could not leave home.", "Cities got smaller.", "Streets were closed."], "Cities spread outward as transit grew."),
  q(3, "Why might a factory owner and a worker view a strike differently?", "The owner may focus on lost profit while workers focus on pay and safety.", ["Both want the same thing.", "Neither cares.", "Strikes help only owners."], "Perspective depends on a person's interests."),
  q(3, "Some people argued that women's votes would protect children and families, while opponents said women belonged at home. What does this show?", "People had very different views about women's roles.", ["Everyone agreed on women's role.", "No one discussed the vote.", "Women had no opinion."], "Historians compare arguments to understand perspectives."),
  q(3, "Which is a difference between 1900 and today for young workers in Ontario?", "Today, laws set minimum ages and limits on hours, which were rare in 1900.", ["Today, children work in mines.", "Today, there are no laws.", "In 1900, all children went to school."], "Reforms changed rules over time."),
  q(3, "Why were many immigrants willing to take dangerous, low-paying jobs?", "They needed work and often had few other choices.", ["The jobs were the best paid.", "They were forced by law to take them.", "They liked the danger."], "Language barriers and discrimination limited their options."),
  q(3, "Which pair shows continuity between 1900 and today?", "People still move to cities for work and opportunities.", ["Streetcars are the only transit.", "Child labour is common.", "Women cannot vote."], "Some patterns continue while others change."),
];

// ---------- Historical thinking ----------

const THINKING: Item[] = [
  q(1, "A diary written by a person who lived through an event is a…", "primary source", ["secondary source", "map legend", "timeline"], "Primary sources come from the time of the event."),
  q(1, "A textbook written today about 1867 is a…", "secondary source", ["primary source", "treaty", "diary"], "Secondary sources are written later by people who study the past."),
  q(1, "Which is a primary source about life in 1900?", "a letter written in 1900", ["a documentary made in 2015", "a textbook written last year", "an encyclopedia article"], "A letter was created at the time."),
  q(1, "What does a timeline show?", "events in the order they happened", ["how big places are", "how many people live somewhere", "what the weather is"], "Timelines help us see sequence and time between events."),
  q(1, "Which is the best question to start a historical inquiry?", "Why did the Métis form a Provisional Government in 1869?", ["What year did the Manitoba Act pass?", "Who is Louis Riel?", "Yes or no: was there a railway?"], "Open questions that ask why or how lead to deeper thinking than questions with a single date or name as the answer."),
  q(2, "What is bias in a source?", "a one-sided view that favours one perspective", ["a sharp pencil", "a type of map", "a treaty"], "Bias is not always intentional, but it affects what is included."),
  q(2, "Why compare several sources about the same event?", "to see different perspectives and check which details are reliable", ["to make the research longer", "to find the shortest source", "to avoid reading"], "Each source shows part of the story."),
  q(2, "On a map, which feature tells you how map distance relates to real distance?", "the scale", ["the title", "the compass rose", "the border"], "A scale such as 1 cm = 5 km lets you measure distances."),
  q(2, "What does the legend (key) on a map explain?", "what the symbols and colours mean", ["who made the map", "how old the map is", "how large the land is"], "Always read the legend before interpreting a map."),
  q(2, "Which source would best show the perspective of a Métis family in 1885?", "a letter or oral history from a Métis family", ["a railway advertisement", "a tariff chart", "a map of Ontario"], "To learn a group's perspective, look for sources from that group."),
  q(2, "In history, a “cause” is…", "something that helped make an event happen", ["the date of an event", "a place on a map", "a source's title"], "The Fenian raids were one cause that helped bring about Confederation."),
  q(2, "In history, a “consequence” is…", "a result of an event", ["the person who wrote about it", "the scale of a map", "a kind of treaty"], "The Manitoba Act was a consequence of the Red River Resistance."),
  q(2, "Historical significance asks whether an event…", "had a big impact on many people or lasting results", ["happened on a weekend", "was written about once", "happened close to home"], "Significance is judged by consequences and by how people remember an event."),
  q(2, "Which is an example of continuity from 1867 to today?", "Canada still has a federal system with provinces and a central government.", ["Women could not vote in 1867 and still cannot.", "The capital moved to Montreal.", "Canada has only four provinces."], "Continuity means something stayed the same over time."),
  q(2, "“Historical perspective” means…", "understanding people and events in the context of their time without excusing harm", ["judging the past only by today's rules", "ignoring what people believed", "assuming everyone thought the same"], "We can explain the attitudes of the time and still say that harm was done."),
  qe(2, "“FREE LAND! Come to the Canadian West. 160 acres of rich farmland. A new life awaits you!” — a poster printed by the government in 1900.", "What is the best question to ask about this poster's credibility?", "Who made it, and what did they want people to do?", ["How many letters are on the poster?", "What colour is the paper?", "Is it a copy?"], "A poster is made to persuade. Think about the author's purpose."),
  qe(3, "“FREE LAND! Come to the Canadian West. 160 acres of rich farmland. A new life awaits you!” — a poster printed by the government in 1900.", "Why should historians be careful using this poster to describe what life was like on the Prairies?", "It was made to attract settlers, so it may leave out hardships.", ["It was printed, so it must be wrong.", "It is too old to read.", "It was written in English."], "Evidence can be useful without being a complete picture."),
  qe(3, "One 1885 newspaper in Toronto calls the events in Saskatchewan “a rebellion”. A Métis oral history from Batoche calls them a defence of land and rights.", "What should a historian do?", "Compare the accounts and consider each author's purpose and point of view.", ["Choose only the newspaper.", "Choose only the oral history.", "Ignore both."], "Different sources can both be useful, even when they disagree."),
  q(3, "A student claims, “Everyone was happy about Confederation.” Which evidence would best test this claim?", "newspapers and letters from different regions and groups", ["one speech by Macdonald", "a map of the provinces", "the date of Confederation"], "Look at many perspectives, especially of groups that were not at the conferences."),
  q(3, "Which is a conclusion that is supported by evidence?", "Several sources show Chinese workers were paid less than others on the CPR, so the pay was unequal.", ["Everyone liked working on the CPR.", "The CPR was the only railway.", "No one worked on the railway."], "A good conclusion matches the evidence available."),
  q(3, "A political cartoon from 1911 shows Laurier shaking hands with a figure labelled “Uncle Sam.” Which question helps analyse it?", "Who drew it, and what point of view does it show?", ["What size is the paper?", "What colour is the ink?", "Who owns the cartoon today?"], "Cartoons use symbols to argue a point."),
  q(3, "A map shows the locations of the Klondike gold fields and the routes to them. What kind of question can it help answer?", "Where did events happen, and how did geography shape the rush?", ["What did miners eat each day?", "Who was the prime minister?", "What was the price of gold?"], "Maps show where things are and help explain why."),
  q(3, "A museum puts together an exhibit on the head tax for Grade 8 students. Which format best fits the audience?", "short text, photographs and first-person accounts", ["a 300-page legal report", "a table of tax law numbers only", "an unlabelled map"], "Choose a format that suits the audience and purpose."),
];

const INQUIRY_ORDER = orderOf(
  "Put the steps of the historical inquiry process in order.",
  "Historians ask questions first, then gather and check sources, analyse them, draw conclusions and communicate.",
  [
    { id: "question", label: "Ask a question", emoji: "❓" },
    { id: "gather", label: "Gather and organize sources", emoji: "📚" },
    { id: "credible", label: "Check how credible the sources are", emoji: "🔍" },
    { id: "analyse", label: "Analyse the evidence", emoji: "🧩" },
    { id: "conclude", label: "Draw conclusions", emoji: "✅" },
    { id: "communicate", label: "Communicate the findings", emoji: "📣" },
  ],
);

const SOURCE_SORT: SortSet = {
  prompt: "Is each item a primary source or a secondary source?",
  hint: "Primary sources come from the time of the event. Secondary sources are written or made later by people studying the past.",
  bins: [
    { id: "primary", label: "Primary source", emoji: "📜" },
    { id: "secondary", label: "Secondary source", emoji: "📘" },
  ],
  items: [
    { label: "a diary from 1885", emoji: "📓", bin: "primary" },
    { label: "a photograph taken in 1900", emoji: "📷", bin: "primary" },
    { label: "a newspaper from 1867", emoji: "📰", bin: "primary" },
    { label: "a signed treaty document", emoji: "✒️", bin: "primary" },
    { label: "a Grade 8 textbook", emoji: "📕", bin: "secondary" },
    { label: "a documentary made in 2015", emoji: "🎬", bin: "secondary" },
    { label: "an encyclopedia article", emoji: "📚", bin: "secondary" },
    { label: "a museum website summary", emoji: "🏛️", bin: "secondary" },
  ],
};

// ---------- Geography: settlement patterns ----------

const SETTLEMENT: Item[] = [
  q(1, "Population density is the number of people living in…", "each square kilometre", ["each province", "each home", "each year"], "Density = population ÷ area."),
  q(1, "Houses built in a line along a river or road form a…", "linear pattern", ["clustered pattern", "scattered pattern", "random pattern"], "Linear means in a line."),
  q(1, "Buildings close together around a centre, such as a village, form a…", "clustered pattern", ["linear pattern", "scattered pattern", "straight line"], "Clustered settlements are grouped tightly."),
  q(1, "Farms spread far apart on the Prairies show a…", "scattered pattern", ["clustered pattern", "linear pattern", "grid of skyscrapers"], "Scattered (dispersed) settlements are widely spaced."),
  q(1, "Which place is most likely to have a high population density?", "a fertile river valley with fresh water", ["a very dry desert", "a high, cold mountain peak", "the middle of the Arctic Ocean"], "People settle where there is water, flat land and fertile soil."),
  q(1, "What is urbanization?", "the growth of cities and the share of people living in them", ["moving to farms", "building a mountain", "a type of map"], "More people live in urban areas each year."),
  q(2, "Most Egyptians live along the Nile and its delta. Why?", "The river provides water and fertile soil in a dry desert region.", ["The desert has the most rain.", "The Nile is a mountain.", "Egyptians are not allowed in the desert."], "Physical features such as rivers shape settlement."),
  q(2, "Most of Japan is mountainous. Where do most people live?", "on the narrow coastal plains", ["on the mountain peaks", "in the forests", "in the open ocean"], "Flat land is limited, so people are crowded onto the plains."),
  q(2, "Most Canadians live within a few hundred kilometres of the southern border. Why?", "The climate is milder, farmland is better and early settlement and trade started there.", ["The Arctic has the most farms.", "The north has the most roads.", "No one lives in the south."], "Climate and soil strongly affect where large populations settle."),
  q(2, "Most Ontarians live in southern Ontario. Which is one reason?", "The land is good for farming, the climate is milder and the Great Lakes provide transportation.", ["There is no farmland.", "The north has more cities.", "Southern Ontario has no water."], "Physical geography and early transport routes shaped settlement."),
  q(2, "Inuit communities in the Arctic are small and widely spaced. What helps explain this?", "The cold climate and limited food and fuel in the region limit how many people can live together.", ["The Arctic has fertile soil.", "Inuit have never lived there.", "There is no ocean."], "Inuit have lived in the Arctic for thousands of years, and communities are located where the land and sea provide resources."),
  q(2, "Why do many people move from rural areas to cities?", "to find jobs, schools and services", ["to avoid all people", "because cities have no jobs", "because farms are free"], "These pulls draw people to urban areas."),
  q(2, "More than half of the world's people now live…", "in cities", ["on farms", "on boats", "in deserts"], "The share of people living in cities has grown rapidly."),
  q(2, "What is urban sprawl?", "low-density development spreading from a city onto surrounding land", ["tall buildings in a downtown", "a city shrinking", "a farm market"], "Sprawl can use up farmland and natural areas."),
  q(2, "On a choropleth map, what do different shades of one colour show?", "different values of a measurement, such as population density, by region", ["roads and railways", "mountains only", "where the map was made"], "Check the legend to see what each shade means."),
  q(3, "Why do geographers use density instead of total population to compare regions?", "It accounts for differences in the size of each region.", ["It makes the numbers bigger.", "Density ignores people.", "Area never matters."], "A small region with 1 million people is more crowded than a large one with the same number."),
  q(3, "Why might a mountainous region have scattered settlement?", "Steep land limits where people can farm or build.", ["Mountains attract large cities.", "Mountains make rivers flat.", "Mountains have no weather."], "Landforms limit flat, usable land."),
  q(3, "Some people in large cities now move to small towns. Which is one reason?", "high housing costs and more options to work remotely", ["small towns have more skyscrapers", "cities have no jobs", "towns have more traffic"], "Trends in settlement can change as technology and prices change."),
  q(3, "Bangladesh has a very high population density. Which physical factor helps explain this?", "fertile soil in a river delta that supports farming", ["a large desert", "a high mountain range", "a polar climate"], "Rich delta soil can feed many people."),
  q(3, "A megacity is usually defined as a city with…", "more than 10 million people", ["a population of 10 000", "no suburbs", "only one street"], "Tokyo and Delhi are examples."),
];

const calcPopDensity = (level: Level): Question => {
  const d = pick(level === 1 ? [10, 20, 25] : [10, 20, 25, 40, 50, 100]);
  const area = pick(level === 1 ? [100, 200] : [100, 200, 250, 400, 500]);
  return typeIn(`A region has ${spaced(d * area)} people living in ${area} km². What is its population density, in people per km²?`, d, "Density = population ÷ area.", undefined, { suffix: "per km²" });
};
const calcPopulation = (level: Level): Question => {
  const d = pick(level === 1 ? [10, 20] : [10, 20, 25, 50, 100]);
  const area = pick(level === 1 ? [10, 20] : [10, 20, 30, 40, 50]);
  return typeIn(`A town has a population density of ${d} people per km² and an area of ${area} km². How many people live there?`, d * area, "Population = density × area.", undefined, { suffix: "people" });
};

const PATTERN_SORT: SortSet = {
  prompt: "Which settlement pattern does each description show?",
  hint: "Linear settlements follow a line, clustered ones group tightly, and scattered ones are widely spaced.",
  bins: [
    { id: "linear", label: "Linear", emoji: "➖" },
    { id: "clustered", label: "Clustered", emoji: "⚫" },
    { id: "scattered", label: "Scattered", emoji: "✳️" },
  ],
  items: [
    { label: "homes along a river bank", emoji: "🏞️", bin: "linear" },
    { label: "towns along a highway", emoji: "🛣️", bin: "linear" },
    { label: "buildings along a railway", emoji: "🚂", bin: "linear" },
    { label: "a compact village around a market", emoji: "🏘️", bin: "clustered" },
    { label: "houses around a mine", emoji: "⛏️", bin: "clustered" },
    { label: "a dense city centre", emoji: "🏙️", bin: "clustered" },
    { label: "prairie farms a kilometre apart", emoji: "🌾", bin: "scattered" },
    { label: "ranches across a dry plain", emoji: "🐄", bin: "scattered" },
    { label: "isolated cabins in forest", emoji: "🌲", bin: "scattered" },
  ],
};

// ---------- Geography: sustainable settlement ----------

const SUSTAIN: Item[] = [
  q(1, "Sustainable development means meeting today's needs without…", "harming the ability of future generations to meet theirs", ["building anything", "using any resources", "changing any laws"], "It balances people's needs with care for the environment."),
  q(1, "Which action helps make a community more sustainable?", "using public transit", ["cutting down every tree", "burning garbage", "leaving lights on"], "Transit lowers pollution and saves energy."),
  q(1, "Which is a source of renewable energy?", "wind", ["coal", "oil", "natural gas"], "Wind and solar energy do not run out."),
  q(1, "Composting kitchen scraps helps by…", "reducing the amount of garbage sent to landfills", ["increasing waste", "making food last forever", "polluting rivers"], "Compost can return nutrients to the soil."),
  q(2, "Which settlement activity can cause water pollution?", "runoff of fertilizer, sewage and industrial waste", ["planting trees", "building a park", "riding bicycles"], "What we put on the land can wash into rivers and lakes."),
  q(2, "Clearing forests for housing and farms leads to…", "loss of wildlife habitat", ["more wildlife", "cleaner air everywhere", "less soil erosion"], "Habitat loss threatens many species."),
  q(2, "Urban sprawl can threaten…", "farmland and natural areas", ["downtown parks only", "the ocean floor", "the Arctic"], "Spreading onto land reduces what is left for farming and nature."),
  q(2, "Ontario's Greenbelt was created in 2005 to…", "protect farmland and natural areas around the Greater Golden Horseshoe from development", ["build more highways", "close all farms", "protect only downtown Toronto"], "It limits sprawl in one of Canada's fastest-growing regions."),
  q(2, "Land reclamation, such as the polders of the Netherlands, means…", "creating new land from the sea, lakes or wetlands", ["destroying a mountain", "moving a city", "protecting forests"], "Dikes and pumps keep the water out."),
  q(2, "Rising sea levels due to melting ice most threaten…", "low-lying coastal cities and islands", ["inland mountain towns", "polar deserts", "high plateaus"], "Cities such as those on low islands face flooding."),
  q(2, "Desertification is…", "fertile land becoming desert, which can threaten farming communities", ["the creation of rainforest", "building a canal", "a type of map"], "Drought, overgrazing and climate change can all contribute."),
  q(2, "Earthquakes threaten crowded cities. Which response helps?", "strict building codes", ["more sprawl", "no planning", "removing warning systems"], "Strong buildings protect people."),
  q(2, "Which is a land-use conflict?", "farmers and developers both wanting the same land", ["two towns agreeing on a park", "a library opening", "a school holiday"], "Competition for land is common near growing cities."),
  q(2, "Land claims and treaty rights are examples of land-use issues because they involve…", "who has rights to use or decide about the land", ["the price of gas", "the colour of maps", "weather forecasts"], "Many First Nations have treaty rights and land claims that affect how land is used."),
  q(2, "Which features belong in a more sustainable community of the future?", "green roofs, bike lanes and community gardens", ["more parking lots only", "more highways only", "no trees"], "These features reduce energy use and pollution."),
  q(3, "A city plans a subdivision on a wetland. Which evidence helps most in deciding?", "environmental studies of flooding and habitat, plus community input", ["the colour of the houses", "the number of garages", "the price of paint"], "Good decisions use evidence about impacts and listen to those affected."),
  q(3, "About one quarter of the Netherlands lies below sea level. Which is a major reason it has dikes and pumps?", "to keep the sea out of low-lying settlements and farmland", ["to create mountains", "to heat buildings", "to make deserts"], "Water management is essential to people's safety."),
  q(3, "Why can a compact city with mixed housing and shops reduce environmental impact?", "People travel shorter distances and use less land and energy.", ["People drive farther.", "It uses more farmland.", "It needs more roads."], "Compact design supports walking, cycling and transit."),
  q(3, "Trees and green spaces in a city help by…", "providing shade, cooling the air and absorbing some pollution", ["adding heat", "blocking all rainfall", "creating smog"], "A tree canopy reduces the urban heat island effect."),
  q(3, "A coastal city faces rising seas. Which is a reasonable response?", "build sea walls and restrict building in flood-prone zones", ["add more shoreline buildings", "ignore the problem", "remove all pumps"], "Cities adapt by planning and protecting."),
  q(3, "Who should be consulted about a large development on farmland in treaty territory?", "farmers, residents, the municipality, developers and the First Nations with rights in that territory", ["only the developer", "no one", "only tourists"], "Fair decisions include all affected groups."),
];

const SUSTAIN_SORT: SortSet = {
  prompt: "Does each practice help make a community more sustainable, or does it make it less sustainable?",
  hint: "Sustainable practices save energy, reduce waste and protect land and water. Practices that waste resources or damage the environment are less sustainable.",
  bins: [
    { id: "more", label: "More sustainable", emoji: "🌱" },
    { id: "less", label: "Less sustainable", emoji: "🏭" },
  ],
  items: [
    { label: "community gardens", emoji: "🥕", bin: "more" },
    { label: "composting food scraps", emoji: "♻️", bin: "more" },
    { label: "solar panels on roofs", emoji: "☀️", bin: "more" },
    { label: "frequent public transit", emoji: "🚌", bin: "more" },
    { label: "building on the best farmland", emoji: "🏗️", bin: "less" },
    { label: "dumping waste in rivers", emoji: "🛢️", bin: "less" },
    { label: "wide highways for sprawl", emoji: "🛣️", bin: "less" },
    { label: "draining wetlands for parking lots", emoji: "🅿️", bin: "less" },
  ],
};

// ---------- Geography: maps, graphs and data ----------

const MAPS: Item[] = [
  q(1, "A choropleth map uses…", "shades or colours to show data for different areas", ["pictures of buildings", "only black lines", "only roads"], "Darker shades usually show higher values."),
  q(1, "On a map, 1 cm stands for 5 km. What is this called?", "the scale", ["the legend", "the title", "the border"], "A scale links map distance to real distance."),
  q(1, "What does a scatter graph show?", "the relationship between two sets of data using points", ["a list of names", "one bar for each year", "a map of roads"], "Each point shows two values for one place."),
  q(1, "GIS stands for…", "geographic information system", ["great island system", "global income score", "ground inventory survey"], "GIS software lets you layer data on maps."),
  q(2, "A scatter graph shows the points rising from left to right. What does this show?", "a positive correlation: as one value rises, the other tends to rise", ["a negative correlation", "no data", "a mistake"], "A line of best fit would slope upward."),
  q(2, "A scatter graph shows the points falling from left to right. What does this show?", "a negative correlation: as one value rises, the other tends to fall", ["a positive correlation", "no data", "a perfect circle"], "A line of best fit would slope downward."),
  q(2, "Which statement about correlation is correct?", "A correlation shows a link between two measures but does not prove that one causes the other.", ["A correlation always proves a cause.", "A correlation means the data is wrong.", "A correlation only works with maps."], "Another factor may influence both."),
  Object.assign(q(2, "The table shows made-up data. What does it suggest about literacy rate and life expectancy?", "As literacy rate rises, life expectancy tends to rise.", ["As literacy rate rises, life expectancy tends to fall.", "There is no pattern.", "Both stay the same."], "Compare the columns: higher literacy goes with longer life expectancy."), { visual: { type: "table" as const, title: "Made-up data for five countries", headers: ["Country", "Literacy rate (%)", "Life expectancy (years)"], rows: [["A", 99, 82], ["B", 92, 76], ["C", 75, 68], ["D", 55, 60], ["E", 38, 54]] } }),
  Object.assign(q(2, "The table shows made-up data. What does it suggest about infant mortality and life expectancy?", "As infant mortality rises, life expectancy tends to fall.", ["As infant mortality rises, life expectancy tends to rise.", "There is no pattern.", "Both rise together."], "Compare the columns: higher infant mortality goes with lower life expectancy."), { visual: { type: "table" as const, title: "Made-up data for five countries", headers: ["Country", "Infant deaths per 1000 births", "Life expectancy (years)"], rows: [["F", 3, 83], ["G", 12, 77], ["H", 30, 69], ["I", 55, 62], ["J", 80, 56]] } }),
  Object.assign(q(2, "A population pyramid has a very wide base and narrows quickly toward the top. What does this suggest?", "A high birth rate and a large share of young people", ["A low birth rate and many older people", "No children", "A stable population with equal age groups"], "A wide base means many children for the number of adults."), { visual: { type: "bars" as const, title: "Share of population by age (%)", bars: [{ label: "0–14", value: 42 }, { label: "15–64", value: 55 }, { label: "65+", value: 3 }] } }),
  Object.assign(q(2, "The graph shows made-up data. Which description fits this population?", "an older population with a low birth rate", ["a very young population with a high birth rate", "no older people", "all children"], "A large share aged 65 and older and a smaller share of children shows an aging population."), { visual: { type: "bars" as const, title: "Share of population by age (%)", bars: [{ label: "0–14", value: 13 }, { label: "15–64", value: 63 }, { label: "65+", value: 24 }] } }),
  q(2, "Which kind of data suits a choropleth map best?", "a rate or density, such as people per square kilometre", ["the number of people at one house", "the names of streets", "the colour of cars"], "Densities and rates compare regions fairly."),
  q(2, "On a scatter graph, which axis usually shows the variable that might influence the other?", "the horizontal (x) axis", ["the title", "the legend", "neither axis"], "The independent variable usually goes on the x-axis."),
  q(2, "Why do map makers include a title?", "to tell the reader what the map is about", ["to show distance", "to show north", "to make the map look full"], "A clear title helps readers know what the map shows."),
  q(3, "Why can GIS help with a land-use inquiry?", "It lets you layer maps, such as rivers, farmland and roads, to see how they overlap.", ["It prevents all land-use conflict.", "It replaces the need for evidence.", "It only prints maps."], "Layering reveals patterns that single maps do not."),
  q(3, "A scatter graph shows a strong link between ice cream sales and drownings. What is the most reasonable explanation?", "Both rise in hot weather, so a third factor affects both.", ["Ice cream causes drowning.", "Drowning causes ice cream sales.", "The data must be wrong."], "Correlation does not prove causation."),
  q(3, "Why is a choropleth map of total population misleading for comparing regions of different size?", "Large regions look important even if they are not crowded.", ["Small regions always have more people.", "Maps cannot show populations.", "Total population is not a number."], "Rates or densities are fairer."),
  Object.assign(q(3, "What does this made-up pyramid data suggest about the country's future needs?", "It will need many schools and jobs for a growing young population.", ["It will need mostly care homes for the old.", "It will need no schools.", "Its population is certain to shrink."], "A large young population means growing demand for education and work."), { visual: { type: "bars" as const, title: "Share of population by age (%)", bars: [{ label: "0–14", value: 40 }, { label: "15–64", value: 56 }, { label: "65+", value: 4 }] } }),
  Object.assign(q(3, "Which describes the made-up data below?", "no clear correlation", ["a strong positive correlation", "a strong negative correlation", "a perfect correlation"], "The second column goes up and down while the first rises, so there is no clear pattern."), { visual: { type: "table" as const, title: "Made-up data for five countries", headers: ["Country", "Number of airports", "Literacy rate (%)"], rows: [["K", 10, 90], ["L", 20, 60], ["M", 30, 95], ["N", 40, 50], ["O", 50, 85]] } }),
];

const calcScale = (level: Level): Question => {
  const km = pick(level === 1 ? [2, 5] : [2, 5, 10, 20, 25]);
  const cm = randInt(3, level === 1 ? 6 : 9);
  return typeIn(`On a map, 1 cm represents ${km} km. Two towns are ${cm} cm apart on the map. How far apart are they in real life, in km?`, km * cm, "Multiply the map distance by the scale.", undefined, { suffix: "km" });
};
const calcScaleBack = (level: Level): Question => {
  const km = pick([2, 5, 10]);
  const cm = randInt(3, level === 1 ? 6 : 9);
  return typeIn(`On a map, 1 cm represents ${km} km. A lake is ${km * cm} km long. How long is it on the map, in cm?`, cm, "Divide the real distance by the scale.", undefined, { suffix: "cm" });
};

// ---------- Geography: quality of life ----------

const QOL: Item[] = [
  q(1, "Quality of life describes…", "how well people can meet needs such as health, education, safe water and income", ["how large a country is", "how many mountains it has", "how old its flag is"], "Geographers use several indicators to measure it."),
  q(1, "Life expectancy is…", "the average number of years a person is expected to live", ["the age of the oldest person", "the number of people in a country", "the number of babies born"], "Higher life expectancy usually goes with better health care and nutrition."),
  q(1, "Literacy rate is the percentage of people who can…", "read and write", ["run fast", "drive a car", "grow food"], "Education is an important indicator."),
  q(1, "Why is access to clean water an important quality-of-life indicator?", "Unsafe water spreads disease.", ["Clean water is a mineral.", "Water has no effect on health.", "Only farms use water."], "Many illnesses are carried by dirty water."),
  q(1, "The infant mortality rate is the number of babies who die…", "before their first birthday, for every 1000 born", ["after age 80", "on the day of birth only", "each year in a city"], "A high rate often means weak health care or poor nutrition."),
  q(1, "GDP per capita means…", "a country's total production divided by its population", ["the number of cars per person", "the area of a country per person", "the depth of a lake"], "Per capita means “per person.”"),
  q(2, "The Human Development Index (HDI) combines which three things?", "life expectancy, education and income", ["rainfall, temperature and wind", "population, area and borders", "flags, anthems and languages"], "The United Nations uses the HDI to compare countries."),
  q(2, "How can a lack of clean water lead to higher death rates?", "Water-borne diseases spread more easily.", ["Clean water increases disease.", "People live longer without it.", "Water has no link to health."], "Interrelationships mean one problem can lead to others."),
  q(2, "Educating girls and women is linked to…", "healthier children and stronger local economies", ["higher infant mortality", "less income for families", "more water-borne disease"], "Education improves skills and choices."),
  Object.assign(q(2, "The table shows made-up numbers. Which country probably has the higher quality of life?", "Country P", ["Country Q", "They are the same.", "It cannot be known."], "Compare several indicators: higher life expectancy and literacy and lower infant mortality are signs of a higher quality of life."), { visual: { type: "table" as const, title: "Made-up data for two countries", headers: ["Indicator", "Country P", "Country Q"], rows: [["Life expectancy (years)", 80, 58], ["Literacy rate (%)", 98, 61], ["Infant deaths per 1000 births", 4, 52]] } }),
  q(2, "What does Doctors Without Borders (Médecins Sans Frontières) do?", "provides emergency medical care in conflict zones and disasters", ["builds railways", "prints maps", "sells houses"], "It sends medical teams where people urgently need care."),
  q(2, "Right To Play uses play and sport to…", "teach children life skills and support their education in difficult situations", ["train professional athletes only", "sell sports equipment", "build stadiums"], "It is a charity that works with children around the world."),
  q(2, "Water For People works to…", "bring safe water and sanitation to communities", ["sell bottled water", "build dams for power", "drain wetlands"], "Safe water and toilets reduce disease."),
  q(2, "How did global vaccination efforts improve quality of life?", "They helped eliminate smallpox in 1980 and reduced other diseases.", ["They increased disease.", "They had no effect.", "They stopped people travelling."], "Programs that prevent disease are among the most effective."),
  q(2, "A microloan is…", "a small loan that helps a person start or grow a small business", ["a loan only for countries", "a tax", "a prize"], "Microloans can help families earn income."),
  q(2, "Fair trade aims to…", "give producers fair prices and safer working conditions", ["lower all prices", "ban trade", "make goods more expensive for no reason"], "Fair-trade labels appear on goods such as coffee and chocolate."),
  q(3, "A strong correlation between two measures means…", "they tend to change together, but it does not prove that one causes the other", ["one always causes the other", "the data are wrong", "they are the same thing"], "Another factor might influence both."),
  q(3, "A program that provides clean water close to homes can improve school attendance. Why?", "Children, especially girls, spend less time collecting water and are healthier.", ["Water makes school shorter.", "Children dislike clean water.", "It has no link to school."], "Solving one problem can improve others."),
  q(3, "Why can a single indicator, such as GDP per capita, be misleading?", "It shows only one part of quality of life and hides differences within a country.", ["It always shows the whole truth.", "It measures only health.", "It cannot be calculated."], "Averages can hide inequality, so geographers use several indicators."),
  q(3, "Some geographers question the labels “developed” and “developing” countries. Why?", "They can oversimplify the differences among countries.", ["All countries are exactly the same.", "No country has an economy.", "The labels never appear in textbooks."], "Countries differ in many ways and change over time."),
  q(3, "A charity advertisement shows one sad photo and a request for money. What is one limitation of this kind of media?", "It may oversimplify a complex problem.", ["It always tells the whole story.", "It cannot raise money.", "It is always false."], "Media can raise awareness, but it should be weighed alongside other evidence."),
  q(3, "Which approach is most likely to improve quality of life for a community over the long term?", "working with the community to meet its own priorities", ["sending goods that are not needed", "ignoring local knowledge", "making decisions without them"], "Programs work best when communities lead."),
];

const calcNatural = (level: Level): Question => {
  const death = pick(level === 1 ? [8, 10] : [6, 8, 10, 12]);
  const inc = pick(level === 1 ? [10, 20] : [8, 12, 16, 20, 25]);
  return typeIn(`A country has a birth rate of ${death + inc} per 1000 people and a death rate of ${death} per 1000. What is its natural increase per 1000 people?`, inc, "Natural increase = birth rate − death rate.", undefined, { suffix: "per 1000" });
};
const calcDoubling = (): Question => {
  const g = pick([1, 2, 5, 7, 10]);
  return typeIn(`A population grows by ${g}% each year. Use the rule “doubling time ≈ 70 ÷ growth rate” to estimate how many years it takes to double.`, 70 / g, "Divide 70 by the growth rate (as a number).", undefined, { suffix: "years" });
};
const calcPerCapita = (level: Level): Question => {
  const pc = pick(level === 1 ? [2000, 5000] : [2000, 5000, 10000, 20000, 40000]);
  const pop = pick([10, 20, 40, 50]);
  return typeIn(`A country's GDP is $${(pc * pop) / 1000} billion and its population is ${pop} million. What is the GDP per capita, in dollars?`, pc, "Divide the GDP by the population. A billion divided by a million is 1000.", undefined, { suffix: "$" });
};

const INDICATOR_SORT: SortSet = {
  prompt: "Does each sign usually point to higher or lower quality of life?",
  hint: "Longer life expectancy, high literacy and clean water point to a higher quality of life. High infant mortality, little schooling and unsafe water point to a lower one.",
  bins: [
    { id: "higher", label: "Higher quality of life", emoji: "😊" },
    { id: "lower", label: "Lower quality of life", emoji: "😟" },
  ],
  items: [
    { label: "life expectancy of 82 years", emoji: "👵", bin: "higher" },
    { label: "literacy rate of 99%", emoji: "📖", bin: "higher" },
    { label: "clean water for nearly everyone", emoji: "🚰", bin: "higher" },
    { label: "very few infant deaths", emoji: "👶", bin: "higher" },
    { label: "life expectancy of 52 years", emoji: "⏳", bin: "lower" },
    { label: "literacy rate of 40%", emoji: "✏️", bin: "lower" },
    { label: "many families without safe water", emoji: "🪣", bin: "lower" },
    { label: "high infant mortality rate", emoji: "🏥", bin: "lower" },
  ],
};

// ---------- Geography: economies and development ----------

const ECONOMY: Item[] = [
  q(1, "Which economic system do Canada, the United States and most other countries have today?", "a mixed economy, with both private businesses and government involvement", ["a pure command economy", "a pure traditional economy", "no economy"], "Canada has private businesses and also government services such as health care and schools."),
  q(1, "Which job is in the primary sector?", "a commercial fisher", ["a car assembly worker", "a dentist", "a software designer"], "The primary sector takes resources from nature."),
  q(1, "Which job is in the secondary sector?", "a car assembly worker", ["a miner", "a nurse", "a researcher"], "The secondary sector turns raw materials into products."),
  q(1, "Which job is in the tertiary sector?", "a teacher", ["a farmer", "a steel worker", "a forester"], "The tertiary sector provides services."),
  q(1, "A traditional economy mostly depends on…", "customs, farming, hunting and trading goods", ["computers", "banks", "stock markets"], "People grow, make and trade what their community needs."),
  q(2, "In a market economy, what mostly decides what is made and what it costs?", "supply, demand and the choices of businesses and consumers", ["a single government plan", "tradition alone", "the weather"], "Prices rise when demand is high and supply is low."),
  q(2, "In a command economy, who makes most decisions about production?", "the government", ["each family", "customers", "shopkeepers"], "The government plans what is produced and how."),
  q(2, "Which sector includes research, data analysis and information technology?", "the quaternary sector", ["the primary sector", "the secondary sector", "the tertiary sector"], "Quaternary jobs are knowledge-based."),
  q(2, "Countries where most people work in the primary sector tend to rank…", "lower on the HDI", ["higher on the HDI", "the same as all others", "outside the HDI"], "Selling raw materials usually earns less than making products or providing services."),
  q(2, "Why do many countries try to build secondary and tertiary industries?", "Making products and providing services usually add more value than selling raw materials.", ["Raw materials are worthless.", "Factories cost nothing.", "Services are never needed."], "Value-added activities can create more jobs and income."),
  q(2, "How can a colonial legacy affect a country's economy today?", "Many colonies were set up to export raw materials, and this shaped their economies.", ["Colonies made only finished goods.", "Colonies had no trade.", "Colonialism had no effects."], "Trade patterns and borders created in the past can continue to matter."),
  q(2, "How can foreign ownership of natural resources affect a developing country?", "Much of the profit may leave the country.", ["All profit stays at home.", "Resources become unlimited.", "It has no effect."], "Who owns the resources decides who gains from them."),
  q(2, "How can a heavy debt load limit development?", "Money used to pay interest cannot be spent on schools or health care.", ["Debt increases spending on schools.", "Debt is always good.", "Debt turns into GDP."], "Governments with big debts have less to invest."),
  q(2, "War and political instability slow development because…", "they damage homes, schools and roads and discourage investment", ["they build factories", "they raise literacy", "they reduce all costs"], "Peace and stability help economies grow."),
  q(2, "GDP is…", "the total value of goods and services produced in a country in a year", ["the number of people in a country", "the length of its coastline", "its tallest building"], "GDP per capita divides this by the number of people."),
  q(2, "Which regions hold most of the world's wealth?", "North America, Europe and parts of East Asia and the Middle East", ["Antarctica and the Arctic", "the Sahara and the Amazon", "only small islands"], "Wealth is unevenly distributed across the world."),
  q(2, "Which are considered emerging economies that have grown rapidly in recent decades?", "China, India and Brazil", ["Iceland, Malta and Monaco", "Antarctica and Greenland", "The Vatican and Andorra"], "Their growth has changed the global pattern of wealth."),
  q(3, "A country earns most of its income from exporting one raw material. Why is this risky?", "If the price falls, its whole economy can suffer.", ["Prices never change.", "It is always safe.", "It has too many industries."], "Diverse economies are more stable."),
  q(3, "Wealth is unevenly distributed within countries too. Which is an example?", "Urban areas may have more wealth than rural areas.", ["Everyone has the same income.", "Wealth is evenly shared.", "Only the capital exists."], "Differences within countries can also be large."),
  q(3, "Which of these could help a developing country's economy grow in the long term?", "investing in education, health and a variety of industries", ["ignoring schools", "exporting only raw materials", "ending all trade"], "A healthy, educated population and diverse industries support growth."),
  q(3, "Waterloo Region in Ontario is known for technology and research. Which sector does this show?", "the quaternary sector", ["the primary sector", "the traditional sector", "no sector"], "Knowledge-based work is a growing part of Canada's economy."),
  q(3, "Why might fair trade help producers in lower-income countries?", "They receive more stable and fairer prices for their goods.", ["They are paid nothing.", "They must work longer hours.", "They lose their land."], "Fair trade rules aim to protect small producers."),
];

const SECTOR_SORT: SortSet = {
  prompt: "Which economic sector does each job belong to?",
  hint: "Primary jobs take resources from nature. Secondary jobs make products. Tertiary jobs provide services.",
  bins: [
    { id: "primary", label: "Primary", emoji: "⛏️" },
    { id: "secondary", label: "Secondary", emoji: "🏭" },
    { id: "tertiary", label: "Tertiary", emoji: "🛎️" },
  ],
  items: [
    { label: "wheat farmer", emoji: "🌾", bin: "primary" },
    { label: "miner", emoji: "⛏️", bin: "primary" },
    { label: "forester", emoji: "🌲", bin: "primary" },
    { label: "steelmaker", emoji: "🔩", bin: "secondary" },
    { label: "car assembly worker", emoji: "🚗", bin: "secondary" },
    { label: "baker in a bread factory", emoji: "🍞", bin: "secondary" },
    { label: "dentist", emoji: "🦷", bin: "tertiary" },
    { label: "bus driver", emoji: "🚌", bin: "tertiary" },
    { label: "store clerk", emoji: "🛒", bin: "tertiary" },
  ],
};

const SYSTEM_SORT: SortSet = {
  prompt: "Which type of economic system is described?",
  hint: "Traditional economies follow customs. Command economies are planned by the government. Market economies are guided by supply and demand.",
  bins: [
    { id: "traditional", label: "Traditional", emoji: "🏺" },
    { id: "command", label: "Command", emoji: "📋" },
    { id: "market", label: "Market", emoji: "🏪" },
  ],
  items: [
    { label: "customs decide who hunts, farms and shares", emoji: "🏹", bin: "traditional" },
    { label: "goods are often traded or bartered locally", emoji: "🤝", bin: "traditional" },
    { label: "families produce mostly what they use", emoji: "🌽", bin: "traditional" },
    { label: "the government sets production targets", emoji: "🏛️", bin: "command" },
    { label: "a central plan decides what factories make", emoji: "🗂️", bin: "command" },
    { label: "the state owns most businesses", emoji: "🏢", bin: "command" },
    { label: "prices rise when demand is high", emoji: "📈", bin: "market" },
    { label: "private businesses compete for customers", emoji: "🛍️", bin: "market" },
    { label: "consumers choose what to buy", emoji: "🧾", bin: "market" },
  ],
};

// ---------- The units ----------

export const units: Unit[] = [
  {
    id: "confederation-8",
    title: "Making a Country",
    emoji: "🍁",
    blurb: "Why and how Canada began in 1867",
    standards: on("History A1.1, A1.3, A2.4, A3.1, A3.5, A3.8", "factors in the creation of the Dominion of Canada and its expansion, who was and was not at the table, and key people and political changes"),
    parentNote: "The conferences and the British North America Act, the reasons the colonies joined (railways, trade, defence and political deadlock), who could vote, why some people opposed Confederation, and how Manitoba, British Columbia and Prince Edward Island joined.",
    generate: plain({ items: CONFEDERATION, sorts: [PROVINCE_SORT], orders: [CONFED_ORDER] }),
  },
  {
    id: "railway-west-8",
    title: "Railway & the West",
    emoji: "🚂",
    blurb: "The CPR, the National Policy and settling the Prairies",
    standards: on("History A1.1, A1.3, A3.1, A3.6, A3.7, A3.8", "the National Policy, the construction of the CPR, settlement of the West, early labour action and the Industrial Revolution in Canada"),
    parentNote: "Why Canada built the Canadian Pacific Railway, what the National Policy was, who built the railway, how the Prairies were opened to settlement and what that meant for Indigenous peoples, and early labour action such as the Toronto printers' strike of 1872.",
    generate: plain({ items: RAILWAY, orders: [RAILWAY_ORDER] }),
  },
  {
    id: "treaties-indian-act-8",
    title: "Treaties & the Indian Act",
    emoji: "📜",
    blurb: "Agreements, reserves and laws, 1850–1890",
    standards: on("History A1.2, A1.4, A2.3, A3.3, A3.7", "legal status and rights of First Nations, the Robinson and Numbered Treaties, the Indian Act, differing perspectives and the actions of First Nations leaders"),
    parentNote: "What treaties are and why First Nations and the Crown often understood them differently, the Robinson and Numbered Treaties, what the Indian Act did, and how First Nations leaders acted to protect their people. This unit needs review with First Nations partners before launch.",
    generate: plain({ items: TREATIES, orders: [TREATY_ORDER] }),
  },
  {
    id: "metis-resistance-8",
    title: "The Métis & the Resistances",
    emoji: "⚜️",
    blurb: "Red River, Batoche and the Métis Nation",
    standards: on("History A1.2, A1.4, A2.3, A3.1, A3.3, A3.7, A3.8", "the Red River Resistance, the Manitoba Act, the North-West Resistance, and the actions of Métis and Cree leaders"),
    parentNote: "Who the Métis are, why the Red River Métis formed a Provisional Government, what the Manitoba Act promised, why the Métis and some Cree leaders acted in 1885 and what happened to them, and why the words historians choose matter. This unit needs review with Métis partners before launch.",
    generate: plain({ items: METIS }),
  },
  {
    id: "residential-schools-8",
    title: "Residential Schools & Truth",
    emoji: "🧡",
    blurb: "What happened, who was affected, and why we learn it",
    standards: on("History A3.4, B1.2, B3.1, B3.6", "the origins of the residential school system, its impact on First Nations, Métis and Inuit families and communities, and resistance"),
    parentNote: "A careful, age-appropriate introduction to the residential school system: why the government and churches set it up, how it harmed children, families and communities, the work of the Truth and Reconciliation Commission, and ways Canadians can respond. The questions do not describe abuse in detail. Please talk with your child about this unit, and note that it needs review with survivors and First Nations, Métis and Inuit partners before launch.",
    generate: plain({ items: RESIDENTIAL }),
  },
  {
    id: "black-communities-8",
    title: "Black Communities in Canada",
    emoji: "🕊️",
    blurb: "Freedom, settlement and community, 1850–1914",
    standards: on("History A1.4, A3.2, A3.5, B1.4, B3.2", "key events that shaped the experiences of Black people in Canada, the Underground Railroad and Black settlements, and actions Black individuals and communities took to improve their lives"),
    parentNote: "The Underground Railroad and the end of slavery in British North America, the communities, newspapers and leaders that Black Canadians built in Canada West and beyond, the racism they still faced, and later migration to the Prairies.",
    generate: plain({ items: BLACK }),
  },
  {
    id: "newcomers-rights-8",
    title: "Newcomers, Rights & Restrictions",
    emoji: "🚢",
    blurb: "Who could come, who could vote and who spoke up",
    standards: on("History A1.3, A3.5, B1.3, B1.4, B3.3, B3.4, B3.5", "immigration and exclusion, the Chinese head tax, who had political rights, women's suffrage, and actions people took to improve their lives, 1850–1914"),
    parentNote: "Why Canada wanted settlers for the Prairies, how some groups were kept out or taxed (the Chinese head tax, the Komagata Maru), who could and could not vote, the women's suffrage movement, and how communities responded and later received apologies.",
    generate: plain({ items: NEWCOMERS, orders: [NEWCOMER_ORDER] }),
  },
  {
    id: "canada-1890-1914-8",
    title: "Canada, 1890–1914",
    emoji: "⛏️",
    blurb: "Laurier, the Klondike, new provinces and a world at war",
    standards: on("History B1.1, B3.3, B3.4, B3.5, B3.6, B3.7", "key events, political changes and people in Canada between 1890 and 1914, including the Klondike, the Boer War, new provinces, and growing tensions in Europe"),
    parentNote: "The Laurier era, the Klondike Gold Rush and its effects on the Tr'ondëk Hwëch'in, the Boer War and the Naval Service Act, the new Prairie provinces, treaty making in northern Ontario, important people of the time, and the start of the First World War.",
    generate: plain({ items: CANADA_1900, orders: [CANADA_ORDER] }),
  },
  {
    id: "work-cities-reform-8",
    title: "Work, Cities & Reform",
    emoji: "🏭",
    blurb: "Factories, unions and people who pushed for change",
    standards: on("History B1.1, B1.3, B1.4, B3.3, B3.5", "industrialization and urbanization, working conditions, unions, reformers and actions taken to improve lives between 1890 and 1914"),
    parentNote: "How factories, mining and new technology changed work and cities, what working life was like for many families, how unions, reformers and suffragists pushed for change, and how life in 1900 compares with today.",
    generate: plain({ items: WORK }),
  },
  {
    id: "historical-thinking-8",
    title: "Think Like a Historian",
    emoji: "🔍",
    blurb: "Sources, perspectives, cause and consequence",
    standards: on("History A2.1–A2.7, B2.1–B2.7", "forming inquiry questions, gathering and judging sources, comparing perspectives, using maps and evidence, and communicating findings"),
    parentNote: "The historical inquiry process: asking good questions, telling primary from secondary sources, judging credibility and bias, comparing perspectives, using maps and timelines, and building conclusions from evidence.",
    generate: plain({ items: THINKING, sorts: [SOURCE_SORT], orders: [INQUIRY_ORDER] }),
  },
  {
    id: "settlement-patterns-8",
    title: "Where People Live",
    emoji: "🏘️",
    blurb: "Settlement patterns, density and cities",
    standards: on("Geography A1.1, A3.1, A3.2, A3.4, A3.7", "global settlement patterns, population density, how the physical environment influences settlement, and trends such as urbanization"),
    parentNote: "Linear, clustered and scattered settlement patterns, how to calculate population density, how climate, landforms and water shape where people live, and trends such as urbanization and sprawl.",
    generate: withCalc({ items: SETTLEMENT, sorts: [PATTERN_SORT] }, [calcPopDensity, calcPopulation], 1),
  },
  {
    id: "sustainable-settlement-8",
    title: "Sustainable Communities",
    emoji: "🌱",
    blurb: "Land use, the environment and the future",
    standards: on("Geography A1.2, A1.3, A2.5, A3.3, A3.5, A3.6", "environmental effects of settlement, land-use issues, risks such as rising sea levels, and practices that make communities more sustainable"),
    parentNote: "How settlements affect the environment, why land-use conflicts happen (including treaty rights and land claims), how natural hazards and rising seas affect cities, and what features a sustainable community of the future might have.",
    generate: plain({ items: SUSTAIN, sorts: [SUSTAIN_SORT] }),
  },
  {
    id: "maps-graphs-8",
    title: "Maps, Graphs & Data",
    emoji: "🗺️",
    blurb: "Choropleth maps, scatter graphs and pyramids",
    standards: on("Geography A2.3, A2.4, A3.7, B2.3, B2.4, B3.3, B3.4", "analysing and constructing maps, choropleth maps, scatter graphs, correlation and population pyramids"),
    parentNote: "Reading map scales and legends, choropleth maps, scatter graphs and correlation (and why correlation does not prove cause), and what population pyramids say about a country's age and growth. The data in the questions are made up for practice.",
    generate: withCalc({ items: MAPS }, [calcScale, calcScaleBack], 1),
  },
  {
    id: "quality-of-life-8",
    title: "Quality of Life Around the World",
    emoji: "🌍",
    blurb: "Indicators, inequalities and helping groups",
    standards: on("Geography B1.1, B1.3, B1.4, B3.1, B3.2, B3.5", "indicators of quality of life, comparing countries, how factors are connected, and organizations and programs that work to improve lives"),
    parentNote: "Measures such as life expectancy, literacy rate, infant mortality and access to clean water, how these connect to each other, how to compare countries, and the work of groups such as Doctors Without Borders, Right To Play and Water For People. All country data in the questions are made up.",
    generate: withCalc({ items: QOL, sorts: [INDICATOR_SORT] }, [calcNatural, calcDoubling, calcPerCapita], 1),
  },
  {
    id: "economies-8",
    title: "Economies & Development",
    emoji: "💼",
    blurb: "Economic systems, sectors and what shapes development",
    standards: on("Geography B1.2, B3.6, B3.7, B3.8, B3.9", "economic systems, economic sectors, factors that affect economic development and the spatial distribution of wealth"),
    parentNote: "Traditional, command, market and mixed economies, the primary, secondary, tertiary and quaternary sectors, and the factors that help or hold back a country's development, such as resources, trade, colonial legacy, debt, stability and corruption.",
    generate: plain({ items: ECONOMY, sorts: [SECTOR_SORT, SYSTEM_SORT] }),
  },
];
