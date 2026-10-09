import type { SortSet } from "../bank";
import type { Unit } from "../types";
import { levelled, withSort, type Item } from "./g56-bank";
import { on } from "./kit";

// Ontario Grade 6 Social Studies (2023): Strand A, Communities in Canada, Past and Present, and
// Strand B, Canada's Interactions with the Global Community. BC's map skills, global challenges and
// trade units are shared. The Indigenous history units state well-established facts only and are
// flagged in their parent notes for review with First Nations, Métis and Inuit partners; deeper
// expectations (A2.1, A3.7 Jewish communities, A3.9 community comparisons, A3.10 the child's own
// community) are left for teacher and partner development.

// ---------- Canadian identities (A1.1, A1.4, A3.4, A3.11) ----------

const IDENTITY: Item[] = [
  { prompt: "Which two languages are Canada's official languages?", right: "English and French", wrong: ["English and Spanish", "French and Mohawk"], hint: "The Official Languages Act of 1969 made Canada officially bilingual." },
  { prompt: "What kind of government does Canada have?", right: "A parliamentary democracy and constitutional monarchy", wrong: ["A dictatorship", "A republic with no parliament"], hint: "Canadians elect Members of Parliament, and the King is the head of state." },
  { prompt: "Who represents the King in Canada?", right: "The Governor General", wrong: ["The prime minister", "The Chief Justice"], hint: "The Governor General carries out the King's duties in Canada." },
  { prompt: "What does multiculturalism mean?", right: "Valuing and respecting many cultures in one country", wrong: ["Everyone has to follow one culture", "Only one language is allowed"], hint: "Canada adopted a multiculturalism policy in 1971." },
  { prompt: "What is the Canadian Charter of Rights and Freedoms?", right: "A part of the Constitution that protects people's rights", wrong: ["A list of Canadian cities", "A treaty with France"], hint: "It became part of the Constitution in 1982." },
  { prompt: "Which of these is a built feature that helps shape Canada's image?", right: "The CN Tower", wrong: ["The Rocky Mountains", "Niagara Falls"], hint: "A built feature is made by people." },
  { prompt: "Which of these is a physical feature that helps shape Canada's image?", right: "The Rocky Mountains", wrong: ["The CN Tower", "A hockey arena"], hint: "A physical feature is part of nature." },
  { prompt: "Canada's universal health care is an example of…", right: "a value that many Canadians share, about caring for everyone", wrong: ["a type of climate", "an Indigenous treaty"], hint: "Public health care is a fundamental part of Canadian identity." },
  { prompt: "Which three groups are often described as Canada's founding peoples?", right: "Indigenous peoples, the French and the British", wrong: ["The Vikings, the Dutch and the Spanish", "Canada has only one founding people"], hint: "Indigenous peoples were here first. French and British settlers came later." },
  { prompt: "What does it mean to say that First Nations, Métis and Inuit are the original inhabitants of Canada?", right: "They lived on these lands long before Europeans arrived", wrong: ["They arrived after the French", "They came in 1867"], hint: "Treaties and rights recognize this fact." },
  { prompt: "In what year did Canada become a country through Confederation?", right: "1867", wrong: ["1759", "1982"], hint: "Canada Day on July 1 marks it." },
  { prompt: "The beaver was made an official national symbol of Canada in 1975. Which of these is also a symbol of Canada?", right: "The maple leaf", wrong: ["The eagle", "The kangaroo"], hint: "The maple leaf is on the flag." },
  { prompt: "In 1929, the 'Persons Case' decided that women were…", right: "persons who could be appointed to the Senate", wrong: ["not allowed to own land", "required to attend school"], hint: "It was a step toward inclusion for women.", hard: true },
  { prompt: "Which group gained the right to vote in federal elections without giving up their status in 1960?", right: "First Nations people with status", wrong: ["Women of all backgrounds", "Children aged 14"], hint: "Many groups had to work for decades to gain the right to vote.", hard: true },
  { prompt: "The 1971 multiculturalism policy made Canada the first country in the world to…", right: "adopt an official multiculturalism policy", wrong: ["elect a woman prime minister", "have no borders"], hint: "It recognized Canada's cultural diversity.", hard: true },
  { prompt: "How have civil rights movements contributed to inclusiveness in Canada?", right: "They worked for laws and attitudes that treat everyone fairly", wrong: ["They limited people's freedoms", "They ended elections"], hint: "Groups worked for change to make Canada more inclusive.", hard: true },
];

const IDENTITY_SORT: SortSet = {
  prompt: "Built feature or physical feature? Tap an item, then tap its basket.",
  hint: "Built features are made by people. Physical features are part of nature.",
  bins: [
    { id: "built", label: "Built feature", emoji: "🏗️" },
    { id: "physical", label: "Physical feature", emoji: "⛰️" },
  ],
  items: [
    { label: "CN Tower", emoji: "🗼", bin: "built" },
    { label: "Parliament buildings", emoji: "🏛️", bin: "built" },
    { label: "Rideau Canal", emoji: "🛶", bin: "built" },
    { label: "A hockey arena", emoji: "🏒", bin: "built" },
    { label: "Rocky Mountains", emoji: "⛰️", bin: "physical" },
    { label: "Niagara Falls", emoji: "🌊", bin: "physical" },
    { label: "The Great Lakes", emoji: "💧", bin: "physical" },
    { label: "The Arctic tundra", emoji: "❄️", bin: "physical" },
  ],
};

// ---------- Contributions of First Nations, Métis and Inuit (A1.2, A3.1, A3.4) ----------

const CONTRIBUTIONS: Item[] = [
  { prompt: "Many places in Canada have names from Indigenous languages. Which is one?", right: "Saskatchewan", wrong: ["Vancouver", "Halifax"], hint: "Saskatchewan comes from a Cree word for a swift-flowing river." },
  { prompt: "The name Canada likely comes from an Iroquoian word, 'kanata'. What does it mean?", right: "Village or settlement", wrong: ["Mountain", "River"], hint: "Cartier heard the word and used it for the region." },
  { prompt: "Nunavut, a territory created in 1999, comes from an Inuktitut word. What does it mean?", right: "Our land", wrong: ["Frozen sea", "North wind"], hint: "It's an Inuit homeland." },
  { prompt: "Which of these words in English comes from an Indigenous language?", right: "Toboggan", wrong: ["Hockey", "Poutine"], hint: "Toboggan comes from a Mi'kmaw word." },
  { prompt: "The kayak was designed by which people?", right: "Inuit", wrong: ["Vikings", "French settlers"], hint: "Inuit hunters designed it for travelling on Arctic waters." },
  { prompt: "The birch-bark canoe was a design invented by…", right: "Indigenous peoples", wrong: ["English shipbuilders", "French engineers"], hint: "It was later used by traders and explorers across the country." },
  { prompt: "Lacrosse has roots in games played by…", right: "Indigenous nations, including the Haudenosaunee", wrong: ["Norse sailors", "French soldiers"], hint: "Lacrosse is one of Canada's two national sports." },
  { prompt: "Kenojuak Ashevak, from Kinngait (Cape Dorset), was a famous…", right: "Inuit artist known for printmaking", wrong: ["Hockey player", "Prime minister"], hint: "Her prints are admired around the world." },
  { prompt: "Norval Morrisseau is known as the founder of the Woodland School of art. He was…", right: "an Anishinaabe artist", wrong: ["a French explorer", "an English architect"], hint: "His paintings show Anishinaabe stories and symbols." },
  { prompt: "Tom Longboat, an Onondaga runner from Six Nations of the Grand River, won which race in 1907?", right: "The Boston Marathon", wrong: ["The Olympic hurdles", "The Stanley Cup"], hint: "He became one of the most famous long-distance runners in the world." },
  { prompt: "What is the purpose of a land acknowledgement?", right: "To recognize Indigenous peoples' relationship to the land on which we live", wrong: ["To sell the land", "To name the mayor"], hint: "It's meant to be respectful, and should be followed by actions." },
  { prompt: "The Métis people made which important contribution to Canada's history?", right: "A distinct Métis culture and leadership in joining Manitoba to Canada", wrong: ["They designed the Parliament buildings", "They built the first railway"], hint: "Louis Riel led the Red River Resistance, and Manitoba became a province in 1870.", hard: true },
  { prompt: "Which of these is a food that Indigenous peoples gave to the world?", right: "Corn (maize)", wrong: ["Wheat", "Rice"], hint: "Corn was first grown by Indigenous peoples in the Americas.", hard: true },
  { prompt: "Maple syrup was first made by…", right: "Indigenous peoples in northeastern North America", wrong: ["Viking settlers", "English colonists"], hint: "Many nations in the region made sugar from maple sap long before Europeans arrived.", hard: true },
  { prompt: "Why do many Indigenous communities work to revitalize their languages?", right: "Language carries culture, history and identity", wrong: ["There are too many languages", "Languages are not important"], hint: "Language keeps stories and teachings alive.", hard: true },
  { prompt: "Which statement is most accurate?", right: "First Nations, Métis and Inuit communities are diverse and are living, changing communities today", wrong: ["Indigenous peoples all have the same traditions", "Indigenous cultures are only part of the past"], hint: "Each community has its own history and culture, and contributes to Canada now.", hard: true },
];

// ---------- Newcomers (A3.2, A3.3, A3.4) ----------

const NEWCOMERS: Item[] = [
  { prompt: "Which of these is a 'push' factor that makes people leave their homeland?", right: "War or famine", wrong: ["Good jobs elsewhere", "Land to farm elsewhere"], hint: "Push factors force people out." },
  { prompt: "Which of these is a 'pull' factor that draws people to Canada?", right: "Land and economic opportunity", wrong: ["War at home", "Famine at home"], hint: "Pull factors attract people to a new place." },
  { prompt: "In the 1840s many people left Ireland for Canada. Why?", right: "A potato famine caused hunger and hardship", wrong: ["To look for gold in Ontario", "To work on the Panama Canal"], hint: "A disease destroyed potato crops, and people starved." },
  { prompt: "Starting in the 1890s, many Ukrainian families settled where?", right: "The Prairies, to farm", wrong: ["The Arctic", "The Maritimes' fishing villages"], hint: "Canada offered land to farmers." },
  { prompt: "Many Chinese workers came to Canada in the 1880s to do what?", right: "Help build the Canadian Pacific Railway", wrong: ["Build the CN Tower", "Dig the Welland Canal"], hint: "They did dangerous work in the mountains of British Columbia." },
  { prompt: "After the American Revolution, Loyalists, including Black Loyalists, came to what is now Canada. Why?", right: "They stayed loyal to Britain and left the new United States", wrong: ["They were invited by the French king", "They wanted to start a fur trade company"], hint: "Loyalists were loyal to the British Crown." },
  { prompt: "In the 1800s, people who had escaped slavery in the United States found freedom in Canada via the…", right: "Underground Railroad", wrong: ["Canadian Pacific Railway", "Trans-Canada Highway"], hint: "It was a network of people and safe places, not a real railroad." },
  { prompt: "Pier 21 in Halifax was a gateway where…", right: "many newcomers first arrived in Canada", wrong: ["airplanes landed", "ships were built"], hint: "From 1928 to 1971, about a million immigrants passed through." },
  { prompt: "What is a refugee?", right: "A person who flees their country to be safe from danger", wrong: ["A tourist", "A person who changes jobs"], hint: "Refugees are forced to leave." },
  { prompt: "In 1979–1980, Canada welcomed tens of thousands of refugees from which country, with help from private sponsors?", right: "Vietnam", wrong: ["Norway", "Brazil"], hint: "Many Canadians formed groups to sponsor families." },
  { prompt: "What is an immigrant?", right: "A person who moves to a new country to live", wrong: ["A person who visits for a day", "A person born in Canada"], hint: "Immigrants make a new home." },
  { prompt: "Newcomer communities often built churches, temples, schools and shops. Why?", right: "To keep their culture and support each other", wrong: ["Because the law told them to", "To avoid meeting neighbours"], hint: "Shared places help communities stay connected.", hard: true },
  { prompt: "Why did the government of Canada advertise free farmland in Europe around 1900?", right: "To attract farmers to settle the Prairies", wrong: ["To get miners for the Arctic", "To fill cities with factory workers"], hint: "Settling the Prairies was a government goal.", hard: true },
  { prompt: "Which is an economic reason that people moved to Canada?", right: "Finding work or a better income", wrong: ["Fleeing a war", "Escaping religious persecution"], hint: "Economic reasons are about jobs and money.", hard: true },
  { prompt: "Which is a political or religious reason that people moved to Canada?", right: "Seeking freedom to practise their beliefs", wrong: ["Wanting a higher salary", "Following a job offer"], hint: "Some groups came to live without being persecuted.", hard: true },
];

// ---------- Hard chapters in the history of communities (A3.6, A3.8) ----------

const PAST: Item[] = [
  { prompt: "In 1755, British authorities began forcing many Acadians from their homes in what is now the Maritimes. This is called…", right: "the Expulsion of the Acadians", wrong: ["Confederation", "the Quiet Revolution"], hint: "Families were separated and sent to many places." },
  { prompt: "In 1759 the British defeated the French on the Plains of Abraham. Where was the battle?", right: "Near Québec City", wrong: ["Near Halifax", "Near Winnipeg"], hint: "It was a turning point for New France." },
  { prompt: "What was the Chinese head tax?", right: "A fee charged only to Chinese immigrants entering Canada", wrong: ["A fee paid by all hockey fans", "A tax on hats"], hint: "It rose to $500 in 1903." },
  { prompt: "When did the Government of Canada apologize for the Chinese head tax?", right: "2006", wrong: ["1885", "1923"], hint: "Prime Minister Harper made the apology in the House of Commons." },
  { prompt: "In 1914 the ship Komagata Maru brought mostly Sikh passengers to Vancouver. What happened?", right: "Most were not allowed to land and had to go back", wrong: ["They all became citizens right away", "The ship sank in the harbour"], hint: "Laws at the time were discriminatory." },
  { prompt: "In 2016, the Prime Minister of Canada apologized in Parliament for…", right: "the Komagata Maru incident", wrong: ["the building of the railway", "winning the Stanley Cup"], hint: "It was a formal apology for a past wrong." },
  { prompt: "In 1942 the federal government forced thousands of Japanese Canadians to leave the BC coast and took their property. This is called…", right: "the internment of Japanese Canadians", wrong: ["the Quebec Act", "the Gold Rush"], hint: "People were treated unfairly because of their background." },
  { prompt: "In 1988, the Government of Canada formally did what about the treatment of Japanese Canadians?", right: "Apologized and offered redress", wrong: ["Refused to apologize", "Built a museum without any apology"], hint: "Redress means making amends." },
  { prompt: "Africville was a Black community in which city?", right: "Halifax", wrong: ["Toronto", "Vancouver"], hint: "The city demolished it in the 1960s and apologized in 2010." },
  { prompt: "What does 'redress' mean?", right: "To make up for a wrong", wrong: ["To remove a rule", "To count votes again"], hint: "Compensation and apologies are forms of redress." },
  { prompt: "Why do governments apologize for past wrongs?", right: "To acknowledge harm and work toward fairness", wrong: ["To avoid history class", "To raise taxes"], hint: "Apologies are part of building trust.", hard: true },
  { prompt: "Which was true about the Acadians after the Expulsion?", right: "Many were scattered, and some later returned or settled in places such as Louisiana", wrong: ["They were all kept in Québec", "They moved to the Arctic"], hint: "The Acadians kept their culture and are still part of Canada.", hard: true },
  { prompt: "After the British won in 1759–1760, the 1774 Quebec Act allowed French Canadians to keep what?", right: "Their language, religion and legal system in civil matters", wrong: ["Their own army", "Their own king"], hint: "It helped French culture continue in Québec.", hard: true },
  { prompt: "Which pair is correct?", right: "Head tax — Chinese Canadians; Internment — Japanese Canadians", wrong: ["Head tax — Japanese Canadians; Internment — Chinese Canadians", "Head tax — Ukrainian Canadians; Internment — Acadians"], hint: "Each event affected a specific community.", hard: true },
];

// ---------- First Nations, Métis and Inuit histories (A3.5, A3.8) ----------

const INDIGENOUS_HISTORY: Item[] = [
  { prompt: "The Royal Proclamation of 1763 said that Indigenous lands could only be sold to…", right: "the Crown (the government), not to private people", wrong: ["any settler", "any fur trader"], hint: "It created a process for dealing with Indigenous lands." },
  { prompt: "The Indian Act of 1876 is a federal law that…", right: "gave the government control over many parts of First Nations peoples' lives", wrong: ["created Nunavut", "ended all treaties"], hint: "It still exists, though parts have been changed." },
  { prompt: "For many years, laws banned some Indigenous ceremonies and gatherings. What was a harm of this?", right: "It made it harder to share culture and language", wrong: ["It made communities larger", "It created new holidays"], hint: "Culture is passed on through gathering and sharing." },
  { prompt: "Residential schools were run by churches and funded by the federal government. What happened to the children?", right: "Many Indigenous children were taken from their families and communities", wrong: ["They were taught only their own language", "They lived with their families"], hint: "Children lost time with family, language and culture." },
  { prompt: "When did the last federally run residential school close?", right: "1996", wrong: ["1867", "1932"], hint: "This was not very long ago." },
  { prompt: "In 2008, the Prime Minister of Canada did what on behalf of the government?", right: "Apologized to former students of residential schools", wrong: ["Created the Indian Act", "Closed all schools"], hint: "Survivors were present in Parliament." },
  { prompt: "September 30 is the National Day for…", right: "Truth and Reconciliation", wrong: ["Thanksgiving", "Remembrance"], hint: "It honours residential school survivors and remembers children who did not come home." },
  { prompt: "What is Orange Shirt Day?", right: "A day to remember residential school survivors and say that every child matters", wrong: ["A fashion day", "A school sports day"], hint: "It began with Phyllis Webstad's story." },
  { prompt: "Which territory was created in 1999 after Inuit negotiated a land claim?", right: "Nunavut", wrong: ["Yukon", "Labrador"], hint: "Inuit are the majority of people there." },
  { prompt: "The Constitution Act of 1982 recognized which three groups of Aboriginal (Indigenous) peoples?", right: "First Nations, Métis and Inuit", wrong: ["English, French and Métis", "Haida, Cree and Inuit only"], hint: "Section 35 recognizes and affirms existing Aboriginal and treaty rights." },
  { prompt: "In 1869–70, the Métis at Red River, led by Louis Riel, protested what?", right: "Canada taking over their lands without talking to them", wrong: ["A new railway ticket", "A ban on fishing"], hint: "The resistance helped lead to the creation of Manitoba." },
  { prompt: "In 1999, the Supreme Court's Marshall decision affirmed what for Mi'kmaq people?", right: "Treaty rights to fish and trade for a moderate livelihood", wrong: ["Ownership of all of Nova Scotia", "The right to ban all fishing"], hint: "Court decisions have confirmed treaty rights.", hard: true },
  { prompt: "Nunatsiavut is a self-governing Inuit region in which part of Canada?", right: "Northern Labrador", wrong: ["Southern Ontario", "Vancouver Island"], hint: "Labrador Inuit gained self-government in 2005.", hard: true },
  { prompt: "Why did the fur trade change communities for many First Nations and Métis?", right: "It created new economies, new families and new pressures on land", wrong: ["It ended all trading", "It had no effect"], hint: "The fur trade affected many people in different ways.", hard: true },
  { prompt: "The Truth and Reconciliation Commission shared its report in 2015. What did it include?", right: "Calls to Action for governments and all Canadians", wrong: ["A list of hockey scores", "Plans for new roads"], hint: "It listened to survivors and made recommendations.", hard: true },
];

// ---------- Canada and international organizations (B1.1, B3.1–B3.3) ----------

const WORLD: Item[] = [
  { prompt: "What does the United Nations (UN) do?", right: "It brings countries together to work for peace and cooperation", wrong: ["It runs the Canadian government", "It makes hockey rules"], hint: "Countries cooperate on peace, health and human rights." },
  { prompt: "Canada was one of the original members of the United Nations, which was founded in which year?", right: "1945", wrong: ["1867", "1982"], hint: "It started after the Second World War." },
  { prompt: "What does NGO stand for?", right: "Non-governmental organization", wrong: ["National government office", "Northern grain operation"], hint: "NGOs are independent of governments." },
  { prompt: "Doctors Without Borders is an example of…", right: "an NGO that provides medical care in emergencies", wrong: ["a branch of the Canadian army", "a trade agreement"], hint: "It helps where people are in need, no matter where." },
  { prompt: "The World Health Organization (WHO) works to…", right: "improve health around the world", wrong: ["control world trade", "protect forests only"], hint: "It's part of the UN." },
  { prompt: "NATO is…", right: "an alliance of countries that cooperate on defence", wrong: ["a trade club for farmers", "a space agency"], hint: "Canada has been a member since 1949." },
  { prompt: "UNICEF works to protect…", right: "children's rights and well-being", wrong: ["only animals", "tall buildings"], hint: "Its full name relates to children." },
  { prompt: "Lester B. Pearson won the Nobel Peace Prize in 1957 for helping to…", right: "create a UN peacekeeping force", wrong: ["end the fur trade", "build the Trans-Canada Highway"], hint: "He was a Canadian diplomat and later prime minister." },
  { prompt: "What is a peacekeeper?", right: "A soldier or police officer who helps keep peace after a conflict", wrong: ["A tax collector", "A judge in Canada"], hint: "Canada has sent peacekeepers to many countries." },
  { prompt: "What is the name of the trade agreement that links Canada, the United States and Mexico?", right: "CUSMA (also called USMCA or T-MEC)", wrong: ["NATO", "UNICEF"], hint: "It replaced NAFTA in 2020." },
  { prompt: "Why does Canada take part in international accords?", right: "Many problems cross borders and need countries to cooperate", wrong: ["Canada is not allowed to refuse", "To avoid solving problems"], hint: "Pollution, disease and trade affect many countries." },
  { prompt: "The UN Declaration on the Rights of Indigenous Peoples is a global statement about…", right: "the rights of Indigenous peoples around the world", wrong: ["rules for sports", "air travel safety"], hint: "Canada has taken steps to put it into law.", hard: true },
  { prompt: "The Commonwealth is a group of countries that…", right: "mostly have a history connected to the British Empire and cooperate", wrong: ["only speak French", "are all in North America"], hint: "Canada is a member.", hard: true },
  { prompt: "La Francophonie is an organization of countries and regions where…", right: "French is spoken or shared", wrong: ["English is the only language", "everyone is a farmer"], hint: "Canada is a member, with Québec and New Brunswick taking part.", hard: true },
  { prompt: "Why can NGOs be useful in a crisis?", right: "They can act quickly and focus on specific needs", wrong: ["They make the laws of each country", "They control each country's military"], hint: "Different organizations help in different ways.", hard: true },
];

// ---------- Responding to global events (B1.2, B1.3, B3.4, B3.5, B3.10) ----------

const GLOBAL_HELP: Item[] = [
  { prompt: "After the 2010 earthquake in Haiti, Canadians helped by…", right: "donating money and sending aid through the government and NGOs", wrong: ["closing the borders", "ignoring the news"], hint: "Many Canadians gave to relief efforts." },
  { prompt: "In 2004, a huge tsunami struck countries around the Indian Ocean. What kind of help did Canada send?", right: "Money and aid for relief and rebuilding", wrong: ["Hockey equipment", "Winter coats only"], hint: "Disaster relief helps people recover." },
  { prompt: "Why are environmental issues like climate change an international concern?", right: "Pollution and warming affect every region, not only one country", wrong: ["They only affect cold countries", "They only affect cities"], hint: "Air and oceans cross borders." },
  { prompt: "The Montreal Protocol (1987) is an agreement to protect…", right: "the ozone layer", wrong: ["fish in the Atlantic", "the Arctic ice"], hint: "Countries agreed to stop using chemicals that damage it." },
  { prompt: "The Paris Agreement of 2015 is about…", right: "reducing greenhouse gases to limit climate change", wrong: ["trade between Canada and France", "sharing sports rules"], hint: "Countries make promises to cut pollution." },
  { prompt: "In 2015–2016, Canada welcomed about 25,000 refugees from which country?", right: "Syria", wrong: ["Brazil", "Australia"], hint: "Many Canadians sponsored families." },
  { prompt: "What does the word 'aid' mean?", right: "Help, such as money, food or supplies, given to people in need", wrong: ["A kind of tax", "A type of map"], hint: "Aid is a form of support." },
  { prompt: "A child in Canada can help people far away by…", right: "raising money for a trusted charity", wrong: ["Doing nothing", "Sending anything without asking"], hint: "Citizens can take part in global issues." },
  { prompt: "Which action helps protect the global environment?", right: "Reducing waste and using less energy", wrong: ["Burning more garbage", "Cutting down more rainforest"], hint: "Everyday choices add up." },
  { prompt: "In 1939 the ship MS St. Louis, carrying Jewish refugees fleeing Nazi Germany, was refused entry to Canada. What does this show?", right: "Canada's immigration rules at the time were very restrictive", wrong: ["Canada welcomed all refugees", "Canada had no immigration rules"], hint: "In 2018 the Prime Minister apologized for this decision.", hard: true },
  { prompt: "Why might both governments and NGOs respond to a disaster?", right: "Governments have resources and organization; NGOs have experience and can act quickly", wrong: ["They both do exactly the same thing", "Neither is able to help"], hint: "Different groups can help in different ways.", hard: true },
  { prompt: "Canadian peacekeepers helped stabilize some regions. What is one effect?", right: "Less fighting and safer conditions for people", wrong: ["More wars", "No change at all"], hint: "Peacekeeping aims to protect civilians.", hard: true },
  { prompt: "Invasive species can travel between countries on ships. How is this an environmental effect of global trade?", right: "Species can reach places where they harm native life", wrong: ["It makes plants taller", "It cleans the water"], hint: "Trade connects regions, including their ecosystems.", hard: true },
  { prompt: "After a disaster, why is clean water one of the first needs?", right: "Dirty water spreads illness", wrong: ["It is needed for decoration", "It makes buildings stronger"], hint: "Aid agencies bring safe water first.", hard: true },
];

// ---------- Canada's partners on the map (B3.7, B3.8, B3.9) ----------

const PARTNERS: Item[] = [
  { prompt: "Which country is Canada's closest neighbour and largest trading partner?", right: "The United States", wrong: ["Mexico", "China"], hint: "More than half of Canada's trade is with the US." },
  { prompt: "In which country is Washington, D.C. located?", right: "The United States", wrong: ["Canada", "The United Kingdom"], hint: "Washington, D.C. is the U.S. capital." },
  { prompt: "In which country is Tokyo?", right: "Japan", wrong: ["China", "India"], hint: "Tokyo is the capital of Japan." },
  { prompt: "Beijing is the capital of which country?", right: "China", wrong: ["Japan", "Kenya"], hint: "China is one of Canada's major trading partners." },
  { prompt: "On which continent is Kenya, where Nairobi is located?", right: "Africa", wrong: ["Asia", "South America"], hint: "Nairobi is in eastern Africa." },
  { prompt: "Mumbai is a large city in which country?", right: "India", wrong: ["Pakistan", "China"], hint: "Mumbai is on India's west coast." },
  { prompt: "Port-au-Prince is the capital of which country in the Caribbean?", right: "Haiti", wrong: ["Cuba", "Jamaica"], hint: "Canada has helped Haiti many times." },
  { prompt: "Latitude lines measure distance…", right: "north or south of the equator", wrong: ["east or west of the prime meridian", "from the Moon"], hint: "Lines of latitude run east-west." },
  { prompt: "Longitude lines measure distance…", right: "east or west of the prime meridian", wrong: ["north or south of the equator", "above sea level"], hint: "Lines of longitude run north-south." },
  { prompt: "Tokyo is in which hemispheres?", right: "Northern and Eastern", wrong: ["Southern and Western", "Northern and Western"], hint: "Tokyo is north of the equator and east of the prime meridian." },
  { prompt: "Washington, D.C. is in which hemispheres?", right: "Northern and Western", wrong: ["Southern and Eastern", "Northern and Eastern"], hint: "It's north of the equator and west of the prime meridian." },
  { prompt: "London is very close to which line?", right: "The prime meridian (0° longitude)", wrong: ["The equator", "The Arctic Circle"], hint: "The prime meridian passes through Greenwich, in London." },
  { prompt: "Canada, the United States and Mexico have a trade agreement. Why?", right: "To make it easier to buy and sell goods across borders", wrong: ["To share one currency", "To create one government"], hint: "Trade agreements reduce barriers.", hard: true },
  { prompt: "What can happen to some Canadian jobs when companies move factories to countries with lower labour costs?", right: "Some jobs in manufacturing may be lost", wrong: ["All jobs are created", "Nothing changes"], hint: "Trade changes can affect workers.", hard: true },
  { prompt: "Tourists visiting Canada from other countries have what effect on the economy?", right: "They bring money into the economy", wrong: ["They remove all jobs", "They make trade agreements end"], hint: "Visitors spend money on hotels, food and attractions.", hard: true },
  { prompt: "Nairobi is just south of the equator. Which is correct?", right: "It is in the Southern Hemisphere", wrong: ["It is in the Northern Hemisphere", "It is in the Western Hemisphere"], hint: "South of the equator means the Southern Hemisphere.", hard: true },
];

// ---------- Social studies inquiry (A2, B2) ----------

const INQUIRY6: Item[] = [
  { prompt: "Which source gives a first-hand view of an event in 1914?", right: "A newspaper report written in 1914", wrong: ["A textbook written in 2020", "A movie made last year"], hint: "A primary source was made at the time." },
  { prompt: "Which is the best inquiry question about newcomer communities?", right: "How did newcomers change communities, and how did communities change them?", wrong: ["What year did Pier 21 open?", "Who was the first immigrant?"], hint: "Good inquiry questions are open and need research." },
  { prompt: "An interview with a community member is a…", right: "primary source", wrong: ["secondary source", "map"], hint: "It comes directly from someone with knowledge or experience." },
  { prompt: "Why should we check who created a source?", right: "Their purpose and point of view may shape what they say", wrong: ["Because everyone's source is identical", "It's just for fun"], hint: "Every source has a perspective." },
  { prompt: "Which map would best show where immigrants to Canada came from?", right: "A thematic map with arrows or colours showing countries of origin", wrong: ["A weather map", "A road map"], hint: "Thematic maps show data about a topic." },
  { prompt: "A statement like 'Canada is the best country' is…", right: "an opinion", wrong: ["a fact", "a date"], hint: "It cannot be proven true or false." },
  { prompt: "A statement like 'Canada became a country in 1867' is…", right: "a fact", wrong: ["an opinion", "a prediction"], hint: "It can be checked." },
  { prompt: "Which source type shows many perspectives on the same event?", right: "Several sources made by different people", wrong: ["A single source", "A copy of the same article"], hint: "Compare sources." },
  { prompt: "When Elders or knowledge keepers share oral stories, how should you treat the information?", right: "With respect, and credit who shared it and from which community", wrong: ["As if it were your own idea", "As unimportant"], hint: "Their voice is authentic and valuable.", hard: true },
  { prompt: "A graphic organizer helps you…", right: "sort evidence and compare different perspectives", wrong: ["draw a map", "pick a winner"], hint: "Use charts to organize information.", hard: true },
  { prompt: "A conclusion is strongest when it is based on…", right: "evidence from several reliable sources", wrong: ["one source only", "guessing"], hint: "More evidence means more confidence.", hard: true },
  { prompt: "A map of Canada's trade partners uses darker colours for larger amounts of trade. What is this part of the map called?", right: "The legend (key)", wrong: ["The compass rose", "The scale"], hint: "It explains what colours mean.", hard: true },
];

export const units: Unit[] = [
  {
    id: "canadian-identities-6",
    title: "What Makes Canada, Canada?",
    emoji: "🍁",
    blurb: "Identity, symbols and values",
    standards: on("A1.1, A1.4, A3.4, A3.11", "features and values that shape Canadian identities, and efforts toward inclusiveness"),
    parentNote: "Official languages, parliamentary democracy and the constitutional monarchy, multiculturalism, the Charter, built and physical features, and groups working for inclusion.",
    generate: ({ difficulty = 2 } = {}) => withSort(IDENTITY, IDENTITY_SORT, difficulty),
  },
  {
    id: "indigenous-contributions-6",
    title: "Indigenous Contributions",
    emoji: "🛶",
    blurb: "Names, art, inventions and ideas",
    standards: on("A1.2, A3.1, A3.4", "contributions of First Nations, Métis and Inuit communities, and Indigenous place names and territories"),
    parentNote: "Contributions of First Nations, Métis and Inuit communities to art, place names, food, sport and inventions, and why Indigenous communities are diverse and living. Needs review with Indigenous partners.",
    generate: ({ difficulty = 2 } = {}) => levelled(CONTRIBUTIONS, 8, difficulty),
  },
  {
    id: "newcomers-6",
    title: "Coming to Canada",
    emoji: "🚢",
    blurb: "Why people moved here",
    standards: on("A1.3, A3.2–A3.4", "why different peoples migrated to Canada, and how newcomer communities shaped the country"),
    parentNote: "Push and pull factors, several waves of newcomers (Irish, Ukrainian, Chinese, Loyalist, Black freedom seekers, Vietnamese, Syrian and more), and how newcomer communities contributed.",
    generate: ({ difficulty = 2 } = {}) => levelled(NEWCOMERS, 8, difficulty),
  },
  {
    id: "communities-past-6",
    title: "Hard Chapters, Honest History",
    emoji: "📖",
    blurb: "Past wrongs, apologies and redress",
    standards: on("A3.6, A3.8", "significant events in the history of settler and newcomer communities, including discrimination and apologies"),
    parentNote: "A factual, age-appropriate look at the Expulsion of the Acadians, the Plains of Abraham, the Chinese head tax, the Komagata Maru, the internment of Japanese Canadians and Africville, with a focus on apologies and redress. No graphic detail.",
    generate: ({ difficulty = 2 } = {}) => levelled(PAST, 8, difficulty),
  },
  {
    id: "indigenous-histories-6",
    title: "Indigenous Histories",
    emoji: "🧡",
    blurb: "Treaties, rights and reconciliation",
    standards: on("A3.5, A3.8", "significant events in the histories of First Nations, Métis and Inuit communities"),
    parentNote: "Well-documented events: the Royal Proclamation, the Indian Act, residential schools and the apology, the Red River Resistance, the creation of Nunavut, and reconciliation. Needs review with First Nations, Métis and Inuit partners before launch.",
    generate: ({ difficulty = 2 } = {}) => levelled(INDIGENOUS_HISTORY, 8, difficulty),
  },
  {
    id: "canada-and-world-6",
    title: "Canada in the World",
    emoji: "🌐",
    blurb: "The UN, NGOs and accords",
    standards: on("B1.1, B3.1–B3.3", "how Canada interacts with other nations, international organizations and NGOs"),
    parentNote: "What the UN, NATO, WHO, UNICEF, the Commonwealth and La Francophonie do, how NGOs differ from governments, peacekeeping, and why countries sign accords.",
    generate: ({ difficulty = 2 } = {}) => levelled(WORLD, 8, difficulty),
  },
  {
    id: "global-help-6",
    title: "Helping Around the World",
    emoji: "🤲",
    blurb: "Disasters, refugees and the planet",
    standards: on("B1.2, B1.3, B3.4, B3.5, B3.10", "responses of Canada and Canadians to disasters, refugees and environmental issues"),
    parentNote: "How governments, NGOs and citizens respond to disasters and global issues, the Montreal Protocol and Paris Agreement, refugees, and a factual look at Canada's response to the MS St. Louis in 1939.",
    generate: ({ difficulty = 2 } = {}) => levelled(GLOBAL_HELP, 8, difficulty),
  },
  {
    id: "canada-partners-6",
    title: "Canada's Partners",
    emoji: "🧭",
    blurb: "Countries, cities and trade",
    standards: on("B3.7–B3.9", "countries and regions Canada interacts with, locating them with latitude and longitude, and the economic effects of trade"),
    parentNote: "Locating countries and cities that matter to Canada, using hemispheres and the equator and prime meridian, and how trade affects workers and the economy.",
    generate: ({ difficulty = 2 } = {}) => levelled(PARTNERS, 8, difficulty),
  },
  {
    id: "inquiry-6",
    title: "Investigate It",
    emoji: "🔎",
    blurb: "Sources, facts and perspectives",
    standards: on("A2.2–A2.5, A2.6, B2.2–B2.5, B2.6", "gathering and evaluating information, perspectives, maps and vocabulary"),
    parentNote: "Primary and secondary sources, fact versus opinion, perspective, reading thematic maps and drawing conclusions from evidence.",
    generate: ({ difficulty = 2 } = {}) => levelled(INQUIRY6, 8, difficulty),
  },
];
