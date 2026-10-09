import type { SortSet } from "../../bank";
import type { Course, GenerateOptions, Question } from "../../types";
import { fromParts, orderOf, q, type Item } from "../kit";

// Grade 9 social studies: the world and Canada from about 1750 to 1919. Dates are given
// plainly, and Indigenous peoples are described as distinct nations whose communities
// continue today. Hard events are described factually, without graphic detail.

type Parts = Parameters<typeof fromParts>[0];
const unit = (parts: Parts) => (opts?: GenerateOptions): Question[] => fromParts(parts, opts);

// ---------- Enlightenment & Revolutions ----------

const REVOLUTIONS: Item[] = [
  q(1, "What was the Enlightenment?", "A movement that stressed reason, science and individual rights", ["A religious festival", "A type of government", "A war between kingdoms"], "Enlightenment thinkers in the 1600s and 1700s argued that reason could improve society."),
  q(1, "Which Enlightenment thinker argued that people have natural rights to life, liberty and property?", "John Locke", ["Napoleon Bonaparte", "King Louis XIV", "Karl Marx"], "Locke's ideas influenced the American Declaration of Independence."),
  q(1, "In what year did the American colonies declare independence from Britain?", "1776", ["1607", "1812", "1867"], "The Declaration of Independence was adopted on July 4, 1776."),
  q(1, "What was the Bastille?", "A prison in Paris that revolutionaries stormed in 1789", ["A royal palace in London", "A French cathedral", "A fort in Quebec"], "July 14, 1789, is seen as the start of the French Revolution."),
  q(2, "What were the main causes of the French Revolution?", "Unfair taxes, food shortages and anger at inequality", ["Peace and prosperity", "A war with Canada", "A lack of newspapers"], "The Third Estate (most people) paid most taxes while the nobility and clergy had privileges."),
  q(2, "What did the Declaration of the Rights of Man and of the Citizen (1789) state?", "All men are born free and equal in rights", ["The king owns all land", "Only nobles can vote", "Taxes should be doubled"], "It promoted liberty, equality and citizens' rights, though it left out women and enslaved people."),
  q(2, "Why did Enlightenment ideas challenge the power of kings?", "They argued that governments should rule with the consent of the people.", ["They said kings were gods.", "They banned new ideas.", "They encouraged war."], "Thinkers like Rousseau argued that authority comes from the people."),
  q(2, "Who led the Haitian Revolution against French colonial rule and slavery?", "Toussaint Louverture", ["Napoleon Bonaparte", "George Washington", "Thomas Jefferson"], "Enslaved and free people of colour won independence, and Haiti became the first free Black republic in 1804."),
  q(2, "Who seized power in France in 1799 and later crowned himself emperor?", "Napoleon Bonaparte", ["Louis XVI", "Robespierre", "Voltaire"], "After the Revolution, Napoleon rose from army general to emperor of France."),
  q(2, "What happened to King Louis XVI during the French Revolution?", "He was put on trial and executed in 1793.", ["He won the war.", "He moved to Canada.", "He became president."], "The monarchy was abolished and France became a republic."),
  q(3, "How did the American Revolution inspire people elsewhere?", "It showed that colonies could challenge an empire and create a government based on rights.", ["It ended all wars.", "It restored kings.", "It had no impact."], "The ideas of liberty and self-government spread to France and Latin America."),
  q(3, "Why did many Loyalists leave the American colonies for British North America after 1783?", "They remained loyal to the British Crown.", ["They wanted to join France.", "They disliked snow.", "They wanted to find gold."], "Thousands moved to places like Nova Scotia, New Brunswick and Quebec."),
  q(3, "The Reign of Terror (1793–1794) in France showed that…", "revolutions can turn violent when leaders fear enemies", ["revolutions are always peaceful", "kings became stronger", "the Church ruled France"], "Thousands were executed as radical leaders hunted those they saw as enemies."),
  q(3, "Which group was left out of many of the rights promised by revolutions of this period?", "women and enslaved people", ["wealthy nobles only", "soldiers", "kings"], "Ideas of “equality” were limited, and later movements fought to extend rights."),
];

const REVOLUTION_ORDER = orderOf(
  "Put these events in order, earliest first.",
  "The Declaration of Independence was in 1776, the storming of the Bastille in 1789, the execution of Louis XVI in 1793, and Haitian independence in 1804.",
  [
    { id: "us", label: "American Declaration of Independence (1776)", emoji: "🗽" },
    { id: "bastille", label: "Storming of the Bastille (1789)", emoji: "🏰" },
    { id: "louis", label: "King Louis XVI is executed (1793)", emoji: "⚔️" },
    { id: "haiti", label: "Haiti declares independence (1804)", emoji: "🇭🇹" },
  ],
);

// ---------- The Industrial Revolution ----------

const INDUSTRIAL: Item[] = [
  q(1, "Where did the Industrial Revolution begin?", "Britain, in the late 1700s", ["Canada, in 1867", "Japan, in 1500", "Australia, in 1900"], "Britain had coal, iron, capital and colonies for trade."),
  q(1, "Which invention powered early factories, mines and trains?", "the steam engine", ["the printing press", "the compass", "the telescope"], "Steam engines burned coal to create power, improved by James Watt in the 1760s–1780s."),
  q(1, "What does “urbanization” mean?", "The growth of cities as people move from the countryside", ["The decline of towns", "The building of farms", "The end of trade"], "Many people moved to cities for factory work."),
  q(1, "Before factories, many goods were made…", "by hand in homes and small workshops", ["by robots", "in huge steel mills", "in space"], "Factories made goods faster and cheaper with machines."),
  q(2, "Why was working in early factories often hard?", "Long hours, low pay and unsafe conditions were common.", ["Wages were extremely high.", "Machines did all the work.", "Workdays were short."], "Many factory workers, including children, worked 12 hours or more."),
  q(2, "Why were children employed in factories and mines?", "They were paid less and could fit in small spaces.", ["They owned the factories.", "Children were required to vote.", "There were no adults."], "Child labour was cheap, which made it attractive to owners."),
  q(2, "What is a trade union?", "A group of workers who join together to seek better pay and conditions", ["A group of factory owners", "A kind of tax", "A government office"], "Unions used strikes and negotiation to improve working conditions."),
  q(2, "What did the Factory Acts passed in Britain in the 1800s do?", "Set limits on child labour and working hours", ["Banned factories", "Made children work longer", "Ended unions"], "They were early laws protecting workers."),
  q(2, "How did railways change life in the 1800s?", "They moved people and goods faster and linked distant places.", ["They slowed down trade.", "They replaced all roads.", "They stopped cities from growing."], "Railways made it cheaper to ship goods and helped settlement."),
  q(2, "What is a natural resource that powered the Industrial Revolution?", "coal", ["silk", "gold coins", "paper money"], "Coal fuelled steam engines and iron production."),
  q(3, "How did the Industrial Revolution affect the environment?", "Pollution and resource use increased as factories and cities grew.", ["Air became cleaner.", "Forests grew larger.", "There was no change."], "Burning coal polluted air and water, and cities grew crowded and dirty."),
  q(3, "Why did the Industrial Revolution increase demand for raw materials from overseas?", "Factories needed cotton, rubber and other materials, which encouraged colonial expansion.", ["Factories needed no materials.", "Colonies were closed.", "Raw materials were free."], "Industrial nations looked to colonies for resources and markets."),
  q(3, "Which was a long-term social effect of industrialization?", "A larger middle class and a growing working class in cities", ["The end of cities", "The end of inequality", "The end of education"], "New groups emerged, and some people became very wealthy while many remained poor."),
  q(3, "In Canada, what role did the Canadian Pacific Railway (completed in 1885) play?", "It linked the country from east to west and helped settlement, but displaced Indigenous peoples and relied on underpaid workers.", ["It only carried mail.", "It ended trade.", "It was built without workers."], "The railway tied BC to the rest of Canada. Thousands of Chinese workers built dangerous sections, and settlement affected many First Nations and Métis."),
];

const IND_SORT: SortSet = {
  prompt: "Before or after the Industrial Revolution? Sort each way of working.",
  hint: "Before: hand tools, home workshops, farm work by animal power. After: steam power, factories, machines and railways.",
  bins: [
    { id: "before", label: "Before industrialization", emoji: "🧵" },
    { id: "after", label: "After industrialization", emoji: "🏭" },
  ],
  items: [
    { label: "weaving cloth by hand at home", emoji: "🧶", bin: "before" },
    { label: "ploughing with oxen", emoji: "🐂", bin: "before" },
    { label: "a village blacksmith's shop", emoji: "⚒️", bin: "before" },
    { label: "milling grain with a water wheel", emoji: "💧", bin: "before" },
    { label: "a cotton mill with steam-powered looms", emoji: "🏭", bin: "after" },
    { label: "a steam locomotive pulling freight", emoji: "🚂", bin: "after" },
    { label: "an iron foundry fuelled by coal", emoji: "🔥", bin: "after" },
    { label: "a crowded city with factory workers", emoji: "🏙️", bin: "after" },
  ],
};

// ---------- Imperialism & Colonialism ----------

const IMPERIALISM: Item[] = [
  q(1, "What is imperialism?", "When a powerful country takes control of other lands and peoples", ["Trading peacefully with neighbours", "A type of farming", "A kind of religion"], "Imperial powers expanded their empires through trade, treaties and force."),
  q(1, "What is a colony?", "A territory controlled by another country", ["A kind of city", "A type of tax", "A school"], "Colonies were ruled from a distant capital for the benefit of the empire."),
  q(1, "Which country had the largest empire in the 1800s?", "Britain", ["Switzerland", "Mexico", "Norway"], "It was said that “the sun never sets on the British Empire.”"),
  q(2, "What were motives for imperial expansion?", "Raw materials, new markets, national pride and strategic power", ["Exploring caves", "Escaping taxes", "Finding poetry"], "Industrial nations wanted resources and markets, and rivalry pushed them to claim more land."),
  q(2, "What was the Scramble for Africa?", "European powers rapidly claiming most of Africa in the late 1800s", ["A running race", "A trade fair", "An African alliance"], "By 1914 most of the continent was under European control."),
  q(2, "At the Berlin Conference (1884–1885), European powers…", "set rules for dividing Africa among themselves, without African leaders", ["invited African kings to decide", "agreed to leave Africa alone", "ended slavery overnight"], "African peoples were not consulted, and borders were drawn that ignored existing nations and cultures."),
  q(2, "Which empire took control of much of India in the 1800s?", "Britain", ["Spain", "Russia", "Japan"], "Britain ruled India directly after 1858, a period known as the Raj."),
  q(2, "What were the Opium Wars (1839–1842 and 1856–1860) about?", "Britain forcing China to open its markets, including to the opium trade", ["A fight over silk", "A war over potatoes", "A peace treaty"], "China lost the wars and was forced to open ports and give up territory, such as Hong Kong."),
  q(2, "How did European rule often affect colonized people?", "Their land, resources and labour were controlled for the benefit of the empire.", ["They became rulers.", "They were given full rights.", "Their culture was left untouched."], "Colonial rule often brought hardship, loss of land and loss of self-government."),
  q(3, "Why did many colonized peoples resist imperial rule?", "They wanted self-government and to protect their land and cultures.", ["They liked foreign taxes.", "They had no opinions.", "They wanted fewer schools."], "Resistance took many forms, from petitions to armed revolt."),
  q(3, "How did new technologies help imperial powers conquer lands?", "Steamships, rifles and medicines like quinine allowed them to travel and fight farther from home.", ["They had no new technology.", "Only horses mattered.", "Telegraphs were banned."], "Technology gave European armies and traders advantages."),
  q(3, "Some people at the time argued that empire was a “civilizing mission.” Why is this view criticized today?", "It treated other cultures as inferior and justified taking control.", ["It was too generous.", "It protected local cultures.", "It was accurate."], "Historians note that “civilizing” excused conquest and ignored the achievements of existing societies."),
  q(3, "Japan avoided being colonized in the 1800s partly because it…", "modernized its industry and military rapidly after 1868", ["closed all trade forever", "joined the British Empire", "had no cities"], "The Meiji government adopted new technology and became a regional power."),
];

// ---------- Canada: Confederation & Expansion ----------

const CONFEDERATION: Item[] = [
  q(1, "In what year did Canada become a country (Confederation)?", "1867", ["1776", "1812", "1914"], "The British North America Act created the Dominion of Canada on July 1, 1867."),
  q(1, "Which four provinces made up Canada at Confederation?", "Ontario, Quebec, Nova Scotia and New Brunswick", ["British Columbia, Alberta, Manitoba and Yukon", "Newfoundland, Ontario, Quebec and Alberta", "Nova Scotia, PEI, Quebec and Manitoba"], "These four British colonies joined. Others joined later."),
  q(1, "Who was Canada's first prime minister?", "Sir John A. Macdonald", ["Wilfrid Laurier", "Louis Riel", "Pierre Trudeau"], "Macdonald led Canada from 1867 to 1873 and from 1878 to 1891. His legacy includes policies harmful to Indigenous peoples."),
  q(2, "Why did the colonies want to unite?", "For defence, trade and to build a railway", ["To end farming", "To join the United States", "To remove the Queen"], "Fears of American expansion and economic hopes pushed union."),
  q(2, "In what year did British Columbia join Confederation?", "1871", ["1867", "1885", "1905"], "BC joined on the condition that a railway would link it to the east."),
  q(2, "Why was the railway promise important for BC?", "It would connect the province to the rest of Canada.", ["It would end fishing.", "It would stop immigration.", "It would shut the ports."], "BC's population was spread out, and the railway promised trade and travel."),
  q(2, "Who was Louis Riel?", "A Métis leader who led the Red River (1869–70) and North-West (1885) resistances", ["The first prime minister", "A railway builder", "A fur trader from France"], "Riel defended Métis rights and helped bring Manitoba into Confederation in 1870. He was executed in 1885."),
  q(2, "The Métis are…", "a distinct Indigenous people with their own culture, language and history", ["the same as all First Nations", "European settlers only", "a political party"], "Métis culture grew from the fur trade, combining First Nations and European roots into a unique identity."),
  q(2, "Which workers faced dangerous conditions and low pay on the Canadian Pacific Railway?", "Thousands of Chinese labourers", ["British lords", "Government ministers", "Native-born artists"], "Many died building the railway through BC's mountains, and the government later imposed a Head Tax (1885) on Chinese immigrants."),
  q(2, "What was the Head Tax?", "A fee charged to Chinese immigrants starting in 1885", ["A tax on hats", "A tax on railway tickets", "A tax on land"], "Canada's government formally apologized for it in 2006."),
  q(3, "What was the National Policy (1879)?", "Tariffs on imports, western settlement and a railway to build a national economy", ["A plan to leave the Empire", "A treaty with the United States", "A school policy"], "It aimed to protect Canadian industry and fill the West with settlers."),
  q(3, "How did westward settlement affect Plains First Nations?", "The buffalo declined, treaties were signed, and many people were moved onto reserves.", ["They became the main settlers.", "Nothing changed.", "They controlled the railway."], "The loss of buffalo and pressure from settlement caused hardship, and treaty promises were often not kept."),
  q(3, "Why is it important to understand that Confederation was decided without Indigenous peoples at the table?", "It shaped laws and policies that affected Indigenous peoples without their consent.", ["It had no effect.", "Indigenous peoples wrote the BNA Act.", "It only affected the Maritimes."], "Decisions about land and rights were made by colonial governments, and their impacts continue today."),
];

const CANADA_ORDER = orderOf(
  "Put these events in order, earliest first.",
  "Confederation was 1867, Manitoba joined in 1870, BC joined in 1871, and the CPR was completed in 1885.",
  [
    { id: "conf", label: "Confederation: Canada is created (1867)", emoji: "🍁" },
    { id: "man", label: "Manitoba joins Canada (1870)", emoji: "🌾" },
    { id: "bc", label: "British Columbia joins Canada (1871)", emoji: "🌲" },
    { id: "cpr", label: "The Canadian Pacific Railway is completed (1885)", emoji: "🚂" },
  ],
);

// ---------- Indigenous Peoples & Canada ----------

const INDIGENOUS: Item[] = [
  q(1, "Which are the three groups recognized as Indigenous peoples in Canada's Constitution?", "First Nations, Inuit and Métis", ["Algonquin, Cree and Dene only", "Settlers, traders and farmers", "Ojibwe, Mohawk and Cree only"], "Each group has many distinct nations, languages and cultures."),
  q(1, "About how many distinct First Nations are in British Columbia?", "more than 200", ["about 5", "about 20", "exactly 1"], "BC is home to over 200 First Nations and more than 30 languages."),
  q(1, "What does it mean that most of BC is “unceded”?", "Most of the land was never given up by treaty.", ["The land belongs to the Queen by treaty", "The land is empty", "The land has no owners"], "Aside from a few treaties, such as the Douglas Treaties and Treaty 8, Indigenous title was never signed away."),
  q(2, "What was the Royal Proclamation of 1763?", "A British declaration that recognized Indigenous rights to land and required treaties before settlement", ["A French law", "A map of Canada", "A railway plan"], "It is still referred to in court cases about Indigenous rights."),
  q(2, "What is a treaty?", "A formal agreement between nations", ["A kind of tax", "A school", "A type of map"], "Treaties between the Crown and First Nations were meant to be agreements between nations."),
  q(2, "What was the Indian Act (1876)?", "A federal law giving the government control over many aspects of First Nations peoples' lives", ["A trade deal", "A treaty between nations", "A school curriculum"], "The Act controlled who counted as “Indian,” reserve land, and many aspects of daily life, and it is still in force with amendments."),
  q(2, "What were residential schools?", "Government-funded, church-run boarding schools that took Indigenous children from their families", ["Schools for farmers' children", "Summer camps", "Universities"], "The system aimed to assimilate children by separating them from their languages and cultures. Many suffered neglect and abuse."),
  q(2, "When did the last federally run residential school close?", "1996", ["1876", "1920", "1950"], "Families and communities have felt the harm for generations."),
  q(2, "The potlatch is a ceremony of many Northwest Coast Nations. What happened to it in 1885?", "Canada banned it, and the ban remained until 1951.", ["It became the national festival", "It was copied by settlers", "It was never banned"], "The ban attacked governance, law and cultural life, and was ignored in secret by many communities."),
  q(3, "What was the Truth and Reconciliation Commission (2008–2015)?", "A commission that heard survivors' stories and issued 94 Calls to Action", ["A court that punished survivors", "A school board", "A railway company"], "It documented the history and legacy of residential schools."),
  q(3, "What is the Tsilhqot’in decision (2014)?", "A Supreme Court of Canada ruling that recognized Aboriginal title to land in BC for the first time", ["A law ending reserves", "A treaty with Britain", "A school law"], "It confirmed that Indigenous title can exist on land never ceded by treaty."),
  q(3, "What does the BC Declaration on the Rights of Indigenous Peoples Act (2019) do?", "It commits the province to align its laws with the UN Declaration on the Rights of Indigenous Peoples", ["It removes all treaties", "It creates new reserves only", "It ends school funding"], "BC was the first province to pass such legislation."),
  q(3, "Why do historians say reconciliation is ongoing?", "Harms from colonial policies continue, and relationships and rights still need to be repaired.", ["It was completed in 1900.", "It is only a symbol.", "It affects no one today."], "Reconciliation is a continuing process involving everyone."),
  q(3, "Which is a respectful way to refer to a person's community?", "Use the name they use for themselves, such as their specific Nation", ["Call everyone by one general name", "Use a nickname", "Use an outdated term"], "Using specific names respects distinct identities and histories."),
];

// ---------- World War I & Canada ----------

const WWI: Item[] = [
  q(1, "In what year did World War I begin?", "1914", ["1812", "1939", "1867"], "It started in July–August 1914 and lasted until November 1918."),
  q(1, "On which date did World War I end with an armistice?", "November 11, 1918", ["June 28, 1914", "July 1, 1867", "April 9, 1917"], "Remembrance Day marks the armistice."),
  q(1, "Which battle in April 1917 became a symbol of Canadian achievement?", "Vimy Ridge", ["Waterloo", "Gettysburg", "Hastings"], "Canadian troops fought together for the first time and captured the ridge, but many were killed."),
  q(2, "What does the acronym M.A.I.N. stand for in the causes of WWI?", "Militarism, Alliances, Imperialism, Nationalism", ["Money, Armies, Islands, Navies", "Maps, Allies, Industry, Nations", "Markets, Arms, Iron, Needs"], "These forces built tension among European powers."),
  q(2, "What event on June 28, 1914, triggered the start of the war?", "The assassination of Archduke Franz Ferdinand in Sarajevo", ["The sinking of the Titanic", "The invasion of Poland", "The end of the Boer War"], "Austria-Hungary blamed Serbia, and alliances pulled other nations into the war."),
  q(2, "Why did Canada enter WWI in 1914?", "As part of the British Empire, Britain’s declaration also meant Canada was at war.", ["Canada was attacked first", "The United States asked", "Canada had a treaty with Germany"], "Canada had no independent foreign policy yet."),
  q(2, "What was trench warfare?", "Fighting from long ditches with machine guns and barbed wire between the lines", ["Naval battles", "Cavalry charges", "Air raids"], "Trench lines stretched across western Europe, and attacks cost huge numbers of lives."),
  q(2, "Which new technologies were used in WWI?", "Machine guns, poison gas, tanks and aircraft", ["Nuclear bombs", "Drones", "Satellites"], "New weapons made the war deadlier."),
  q(2, "What was the conscription crisis of 1917?", "A bitter dispute over forcing men to serve, which divided English and French Canada", ["A railway strike", "A choice of flags", "A tax increase"], "Many French Canadians opposed conscription, since they felt less connection to the British Empire."),
  q(2, "Many Indigenous men volunteered to fight in WWI. What often happened when they returned?", "They faced the same discrimination and restrictions as before.", ["They were given full rights and land", "They became prime ministers", "They were welcomed with no change"], "Despite their service, many veterans were denied the same benefits as other soldiers."),
  q(3, "How did WWI change women’s roles in Canada?", "Many worked in factories and offices, and some gained the vote in 1917–1918.", ["Women were banned from work", "Women lost rights", "Nothing changed"], "Wartime work helped win the right to vote in federal elections for most women in 1918."),
  q(3, "During WWI, thousands of people were held in internment camps in Canada. Who were most of them?", "Ukrainian Canadians and other people from enemy countries, labelled “enemy aliens”", ["Soldiers who disobeyed orders", "Canadian-born British citizens", "Visitors from the United States"], "More than 8,500 people were interned between 1914 and 1920 under the War Measures Act, and many more had to report regularly to authorities. Canada has since recognized this injustice."),
  q(3, "What happened to the Komagata Maru in 1914?", "Canadian authorities refused entry to its passengers from India in Vancouver, and it was forced to leave.", ["It was welcomed with a parade", "It carried soldiers to Europe", "It sank in Halifax"], "Passengers were mostly Sikh men who were British subjects. Canada formally apologized in 2016."),
  q(3, "What was the Treaty of Versailles (1919)?", "The peace treaty that ended WWI and blamed Germany for the war", ["The treaty that began WWI", "A trade deal", "A treaty about Canada’s borders"], "Harsh terms on Germany contributed to later tensions."),
  q(3, "How did WWI affect Canada’s status in the world?", "Canada signed the Treaty of Versailles separately, showing growing independence.", ["Canada became a British colony again", "Canada joined the United States", "Canada stopped trading"], "Canada's sacrifices helped it earn a seat at the peace conference and its own signature."),
];

const WWI_ORDER = orderOf(
  "Put these events in order, earliest first.",
  "Franz Ferdinand was killed in 1914, Vimy Ridge was 1917, the armistice was 1918, and the Treaty of Versailles was signed in 1919.",
  [
    { id: "fran", label: "Archduke Franz Ferdinand is assassinated (1914)", emoji: "📰" },
    { id: "vimy", label: "Canadians capture Vimy Ridge (1917)", emoji: "🪖" },
    { id: "armi", label: "Armistice ends the fighting (1918)", emoji: "🕊️" },
    { id: "vers", label: "Treaty of Versailles is signed (1919)", emoji: "📜" },
  ],
);

// ---------- Migration & Population ----------

const MIGRATION: Item[] = [
  q(1, "What is immigration?", "Moving into a new country to live there", ["Moving out of a country to live elsewhere", "Travelling for a holiday", "Moving within a city"], "Emigration is leaving a country. Immigration is arriving in one."),
  q(1, "What is a “push factor” in migration?", "Something that makes people want to leave, like famine or war", ["Something that attracts people to a place", "A kind of boat", "A tax"], "Push factors drive people away from home. Pull factors attract them to a new place."),
  q(1, "What is a “pull factor” in migration?", "Something that attracts people to a new place, like jobs or land", ["Something that forces people to leave", "A kind of wagon", "A holiday"], "Pull factors include work, safety, land, family and freedom."),
  q(2, "Why did about a million people leave Ireland in the late 1840s?", "A potato blight caused a famine.", ["They wanted to build railways.", "A gold rush began.", "Ireland had no schools."], "Many Irish people emigrated to Canada, the United States and elsewhere to survive."),
  q(2, "What drew thousands of people to the Fraser River and the Cariboo region in 1858?", "the gold rush", ["a new railway", "cheap farmland on the Prairies", "a shortage of workers in cities"], "Miners from California, China and elsewhere came to BC, which helped lead to the creation of the colony of British Columbia in 1858."),
  q(2, "Between 1801 and 1901, the world's population grew from about 1 billion to about…", "1.6 billion", ["500 million", "3 billion", "6 billion"], "Better food, sanitation and medicine helped people live longer, and populations grew."),
  q(2, "Why did cities grow so fast during the Industrial Revolution?", "People moved from the countryside to find factory work.", ["Farms became larger.", "Cities lowered their taxes.", "Railways were removed."], "Urbanization is the growth of towns and cities."),
  q(2, "Around 1900, the Canadian government encouraged European farmers to settle on the Prairies. What attracted them?", "Cheap land to farm", ["Free housing in cities", "Gold mines", "Short winters"], "Clifford Sifton led a campaign to attract settlers to the West, though settlement meant the loss of land for Indigenous nations."),
  q(2, "Which improvement helped the world's population grow in the 1800s?", "Better sanitation and medicine", ["Fewer farms", "Less trade", "Smaller cities"], "Cleaner water and the first vaccines saved many lives."),
  q(2, "How did many Chinese migrants contribute to BC's early economy?", "They worked in gold fields, mines and on the railway.", ["They ruled the colony.", "They were never in BC.", "They built the legislature."], "They often faced discrimination, low pay and unfair laws such as the Head Tax."),
  q(3, "Why does migration change the places people leave and the places they arrive?", "It changes populations, cultures, languages and economies in both places.", ["It changes nothing.", "It only changes weather.", "It stops trade."], "Migration moves people, skills and traditions."),
  q(3, "Which is an example of forced migration?", "Enslaved Africans being taken to the Americas", ["A family moving for a job", "A student studying abroad", "A tourist visiting Canada"], "Forced migration happens when people have no choice."),
  q(3, "What is a refugee?", "A person forced to leave their country to escape danger or persecution", ["A person who moves for a new job", "A tourist", "A person who travels for school"], "Refugees flee war, violence or persecution."),
  q(3, "Why do historians use population data when studying the past?", "It shows how living standards, health and migration changed over time.", ["It tells exactly who was happy.", "It replaces stories.", "It is never reliable."], "Numbers and personal stories together give a fuller picture."),
];

const PUSH_PULL: SortSet = {
  prompt: "Push factor or pull factor? Sort each reason for migrating.",
  hint: "Push factors make people want to leave (famine, war, no work). Pull factors attract them to a new place (jobs, land, safety, freedom).",
  bins: [
    { id: "push", label: "Push factor", emoji: "👋" },
    { id: "pull", label: "Pull factor", emoji: "🧲" },
  ],
  items: [
    { label: "a crop failure causes famine", emoji: "🥔", bin: "push" },
    { label: "war breaks out at home", emoji: "💥", bin: "push" },
    { label: "no jobs in the village", emoji: "🏚️", bin: "push" },
    { label: "persecution for religious beliefs", emoji: "🚪", bin: "push" },
    { label: "gold is found in a river", emoji: "🪙", bin: "pull" },
    { label: "cheap farmland is offered", emoji: "🌾", bin: "pull" },
    { label: "factories are hiring workers", emoji: "🏭", bin: "pull" },
    { label: "relatives already live there", emoji: "👨‍👩‍👧", bin: "pull" },
  ],
};

// ---------- Canada's Landscapes ----------

const LANDSCAPES: Item[] = [
  q(1, "Which mountain range runs along Canada's west, through BC?", "the Western Cordillera (including the Rockies and Coast Mountains)", ["the Appalachians", "the Canadian Shield", "the Laurentians"], "The Cordillera is a long chain of young, high mountains."),
  q(1, "Which region has flat land and fertile soil, ideal for growing wheat?", "the Interior Plains (the Prairies)", ["the Western Cordillera", "the Appalachians", "the Arctic"], "Glaciers and ancient seas left flat land and rich soil."),
  q(1, "Which region covers about half of Canada and has some of the oldest rocks on Earth?", "the Canadian Shield", ["the Interior Plains", "the Western Cordillera", "the Great Lakes–St. Lawrence Lowlands"], "The Shield is made of ancient rock scraped bare by glaciers, with thousands of lakes."),
  q(1, "Which region has the best farmland and the most people in Canada?", "the Great Lakes–St. Lawrence Lowlands", ["the Arctic", "the Canadian Shield", "the Appalachians"], "Fertile soil, a mild climate and water routes drew settlers and cities."),
  q(2, "How did glaciers shape Canada's land?", "They carved valleys and lakes and left behind soil and rock.", ["They built all the mountains.", "They had no effect.", "They made deserts."], "The last ice age ended about 12,000 years ago, leaving a landscape of lakes, valleys and fertile plains."),
  q(2, "Why is the Western Cordillera still shaped by earthquakes and volcanoes?", "It lies where the Pacific and North American plates meet, so the land is still active.", ["It is far from any plate.", "It is too cold.", "It is made of limestone."], "Plate tectonics built these mountains and continues to shape them."),
  q(2, "Which region has old, worn-down mountains in Atlantic Canada?", "the Appalachians", ["the Rockies", "the Coast Mountains", "the Prairies"], "Millions of years of erosion have rounded the Appalachians, which are far older than the Rockies."),
  q(2, "Why has mining been important in the Canadian Shield?", "The ancient rock contains minerals such as nickel, gold and copper.", ["The Shield is farmland.", "It has no rock.", "It is covered in cities."], "Resource towns grew around mines in places like Sudbury and Timmins."),
  q(2, "How does the physical environment influence where people settle in Canada?", "People tend to settle where farmland, water, resources and transportation are available.", ["People choose the coldest places.", "Landscape has no effect.", "People avoid rivers."], "Rivers, lakes and fertile land have shaped settlement for thousands of years."),
  q(2, "Why were rivers and lakes important to early transportation in Canada?", "They were natural highways for travel and trade by canoe and boat.", ["They were blocked by walls.", "They were not used.", "They were dry."], "Indigenous peoples and later fur traders travelled along waterways."),
  q(3, "What process wears mountains down over millions of years?", "erosion by water, wind and ice", ["volcanic eruptions", "tidal waves", "magnetism"], "Erosion breaks rock and carries it away."),
  q(3, "Why is the Pacific coast of BC at risk of tsunamis and earthquakes?", "It sits near the Cascadia subduction zone, where one plate slides beneath another.", ["It is too far south.", "It is surrounded by deserts.", "It has no faults."], "The Juan de Fuca plate is sliding beneath the North American plate."),
  q(3, "Which is an example of the physical environment affecting the economy?", "BC's forests and ports supported the lumber and shipping industries.", ["BC has no resources.", "The weather has no effect.", "All industries are the same everywhere."], "Resources and coastlines shape what people can make, grow and trade."),
];

const REGION_SORT: SortSet = {
  prompt: "Which landform region is it? Sort each description.",
  hint: "The Western Cordillera has young, high mountains. The Interior Plains are flat farmland. The Canadian Shield is ancient rock with many lakes.",
  bins: [
    { id: "cordillera", label: "Western Cordillera", emoji: "🏔️" },
    { id: "plains", label: "Interior Plains", emoji: "🌾" },
    { id: "shield", label: "Canadian Shield", emoji: "🪨" },
  ],
  items: [
    { label: "tall, young mountains with glaciers", emoji: "🏔️", bin: "cordillera" },
    { label: "earthquakes and volcanoes occur", emoji: "🌋", bin: "cordillera" },
    { label: "flat land with wheat and canola farms", emoji: "🌾", bin: "plains" },
    { label: "rich soil and wide skies", emoji: "☀️", bin: "plains" },
    { label: "ancient rock with thousands of lakes", emoji: "🪨", bin: "shield" },
    { label: "nickel and gold mines", emoji: "⛏️", bin: "shield" },
  ],
};

// ---------- Course ----------

export const course: Course = {
  grade: "9",
  subject: "social",
  bigIdeas: {
    "ca-bc": [
      "Emerging ideas and ideologies profoundly influence societies and events.",
      "The physical environment influences the nature of political, social, and economic change.",
      "Disparities in power alter the balance of relationships between individuals and between societies.",
      "Collective identity is constructed and can change over time.",
    ],
  },
  units: [
    {
      id: "enlightenment-and-revolutions",
      title: "Enlightenment & Revolutions",
      emoji: "💡",
      blurb: "Ideas that changed governments",
      standards: { "ca-bc": "Emerging ideas and ideologies: the Enlightenment and the American, French and Haitian revolutions" },
      parentNote:
        "Enlightenment ideas about reason and rights, why the American, French and Haitian revolutions happened, and who was and wasn't included in the rights they promised.",
      generate: unit({ items: REVOLUTIONS, orders: [REVOLUTION_ORDER] }),
    },
    {
      id: "industrial-revolution",
      title: "The Industrial Revolution",
      emoji: "🏭",
      blurb: "Factories, cities and workers",
      standards: { "ca-bc": "Industrialization: causes, technologies, urbanization, working conditions and environmental effects" },
      parentNote:
        "How steam power and factories changed work and cities, child labour and early unions, railways, and the environmental and social effects of industrialization, including in Canada.",
      generate: unit({ items: INDUSTRIAL, sorts: [IND_SORT] }),
    },
    {
      id: "imperialism-and-colonialism",
      title: "Imperialism & Colonialism",
      emoji: "🗺️",
      blurb: "Empires and their effects",
      standards: { "ca-bc": "Imperialism and colonialism: motives, methods and effects on colonized and colonizing societies" },
      parentNote:
        "Why powerful countries built empires, the Scramble for Africa, British rule in India, the Opium Wars, new technology, and the lasting effects of colonial rule and resistance to it.",
      generate: unit({ items: IMPERIALISM }),
    },
    {
      id: "confederation-and-expansion",
      title: "Confederation & Expansion",
      emoji: "🍁",
      blurb: "Building Canada and BC joining",
      standards: { "ca-bc": "Canadian Confederation and territorial expansion: BC joining Canada, the CPR, the Métis and western settlement" },
      parentNote:
        "Why the colonies united in 1867, how Manitoba and BC joined, the building of the railway and who built it, Louis Riel and the Métis, and how expansion affected First Nations.",
      generate: unit({ items: CONFEDERATION, orders: [CANADA_ORDER] }),
    },
    {
      id: "indigenous-peoples-and-canada",
      title: "Indigenous Peoples & Canada",
      emoji: "🤝",
      blurb: "Treaties, laws and reconciliation",
      standards: { "ca-bc": "Indigenous peoples and colonial policies: treaties, the Indian Act, residential schools and reconciliation" },
      parentNote:
        "Treaties and unceded land in BC, the Indian Act, residential schools and the potlatch ban, and the ongoing work of reconciliation. This unit describes hard history factually, without graphic detail; consider talking it through together.",
      generate: unit({ items: INDIGENOUS }),
    },
    {
      id: "migration-and-population",
      title: "Migration & Population",
      emoji: "🧳",
      blurb: "Why people move and populations grow",
      standards: { "ca-bc": "Global demographic shifts, including patterns of migration and population growth" },
      parentNote:
        "Push and pull factors, famine, gold rushes and urbanization, why the world's population grew in the 1800s, and how migration to Canada and BC shaped communities.",
      generate: unit({ items: MIGRATION, sorts: [PUSH_PULL] }),
    },
    {
      id: "canadas-landscapes",
      title: "Canada's Landscapes",
      emoji: "🏔️",
      blurb: "Mountains, plains, the Shield and the people who live there",
      standards: { "ca-bc": "Physiographic features of Canada and geological processes; how the physical environment influences settlement and change" },
      parentNote:
        "Canada's main landform regions, how glaciers, erosion and plate tectonics shaped them, and how landscape and resources have influenced where and how people live.",
      generate: unit({ items: LANDSCAPES, sorts: [REGION_SORT] }),
    },
    {
      id: "world-war-i",
      title: "World War I & Canada",
      emoji: "🕊️",
      blurb: "Causes, battles and changes at home",
      standards: { "ca-bc": "World War I: causes, Canada's participation and the effects at home, including conscription and women's roles" },
      parentNote:
        "The causes of WWI, Canada's part in it (including Vimy Ridge), the conscription crisis, the war's effect on women and on people who faced discrimination, and how Canada's role in the world changed.",
      generate: unit({ items: WWI, orders: [WWI_ORDER] }),
    },
  ],
};
