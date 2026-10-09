import type { SortSet } from "../bank";
import { shuffle } from "../random";
import type { OrderQuestion, Question, Unit } from "../types";
import { levelled, withSort, type Item, type Level } from "./g56-bank";
import { on } from "./kit";

// Ontario Grade 5 Social Studies (2023): Strand A, Interactions of Indigenous Peoples and Europeans
// prior to 1713, and Strand B, The Role of Government and Responsible Citizenship. BC's levels of
// government, making laws and rights units are shared. The Indigenous history units here stay at
// the level of well-established facts and say "some" or "many" rather than speaking for all
// Nations; deeper content (A3.7 differences in governance and spiritual life, B3.3 Indigenous
// governance structures) is left for development with First Nations, Métis and Inuit partners.

function withOrder(bank: Item[], order: OrderQuestion, d: Level): Question[] {
  return shuffle([...levelled(bank, 7, d), order]);
}

// ---------- First Nations, Métis and Inuit before and during early contact (A3.1, A3.2) ----------

const PEOPLES: Item[] = [
  { prompt: "First Nations, Métis and Inuit are the three groups recognized as…", right: "Indigenous peoples of what is now Canada", wrong: ["newcomers who arrived in 1867", "a single nation with one culture"], hint: "Indigenous peoples were here long before Europeans arrived, and each group has its own cultures and histories." },
  { prompt: "Which statement is most accurate?", right: "First Nations, Métis and Inuit each have their own cultures, languages and histories", wrong: ["All Indigenous peoples in Canada share one culture", "Indigenous peoples no longer live in Canada"], hint: "There are many different Nations and communities, and they are living communities today." },
  { prompt: "A story passed from generation to generation by speaking is called…", right: "oral history", wrong: ["a petroglyph", "a census"], hint: "Many Indigenous communities keep their histories in spoken stories shared by Elders and knowledge keepers." },
  { prompt: "What is a petroglyph?", right: "A picture or symbol carved into rock", wrong: ["A song sung by Elders", "A kind of belt woven from shells"], hint: "'Petro' means rock, and 'glyph' means carving." },
  { prompt: "What is a pictograph?", right: "A picture painted on a rock surface", wrong: ["A picture carved into rock", "A story told aloud"], hint: "A pictograph is painted. A petroglyph is carved." },
  { prompt: "What is a wampum belt?", right: "A belt of shell beads used by some nations to record agreements and share messages", wrong: ["A belt for carrying tools while hunting", "A kind of boat used in the Arctic"], hint: "The patterns of beads held meaning and were used to remember important agreements." },
  { prompt: "Who are Elders and knowledge keepers?", right: "Community members respected for their knowledge, who share teachings", wrong: ["Government workers who collect taxes", "Newcomers who arrived by ship"], hint: "Elders and knowledge keepers help pass on language, history and teachings." },
  { prompt: "Which Indigenous people have a homeland in the Arctic?", right: "Inuit", wrong: ["The Mi'kmaq", "The Wendat"], hint: "Inuit Nunangat is the Inuit homeland across the Arctic." },
  { prompt: "The Mi'kmaq have lived for thousands of years in what is now which part of Canada?", right: "The Atlantic region", wrong: ["The Arctic", "The Prairies"], hint: "Mi'kma'ki, the Mi'kmaw homeland, includes parts of the Maritime provinces and the Gaspé." },
  { prompt: "Around which large bodies of water have Anishinaabe peoples traditionally lived?", right: "The Great Lakes", wrong: ["The Beaufort Sea", "Hudson Bay only"], hint: "The Anishinaabe include the Ojibwe, Odawa, Potawatomi and others who are connected to the Great Lakes." },
  { prompt: "Many Wendat and Haudenosaunee communities grew corn, beans and squash. These crops are often called…", right: "the Three Sisters", wrong: ["the Three Rivers", "the Great Lakes crops"], hint: "The three plants help each other grow." },
  { prompt: "Which of these is one of the nations of the Haudenosaunee Confederacy?", right: "Mohawk", wrong: ["Mi'kmaq", "Inuit", "Cree"], hint: "The Mohawk (Kanien'kehá:ka), Oneida, Onondaga, Cayuga and Seneca were the original five nations." },
  { prompt: "Before 1713, how many nations formed the Haudenosaunee Confederacy?", right: "Five", wrong: ["Three", "Seven"], hint: "The Tuscarora joined later, which is why people now say 'Six Nations'.", hard: true },
  { prompt: "Before Europeans arrived, nations traded goods such as corn, furs, fish and tools with one another. What does this show?", right: "Nations had trade networks and relationships long before contact", wrong: ["Nations never met each other", "Trade began when Europeans arrived"], hint: "Trade routes crossed the land by canoe and on foot.", hard: true },
  { prompt: "Some nations lived in farming villages. Others moved with the seasons to hunt, fish and gather. What helped explain these different ways of life?", right: "The land, climate and resources of their region", wrong: ["Their nations were ordered to do so by the French", "They all wanted to live the same way"], hint: "People lived in ways suited to the place where they lived.", hard: true },
  { prompt: "The Haudenosaunee Confederacy's Great Law of Peace is an example of…", right: "nations agreeing to work together under a shared system of governing", wrong: ["a European fur trade company", "a map of trade routes"], hint: "Nations joined together under agreed laws long before 1713.", hard: true },
  { prompt: "Which Indigenous people have lived for a very long time around Hudson Bay and James Bay, in what is now northern Ontario and Quebec?", right: "Cree (Eeyou and Eenou) communities", wrong: ["The Mi'kmaq", "The Inuit of Nunavut only"], hint: "Many Cree communities have homelands around James Bay and Hudson Bay.", hard: true },
  { prompt: "What does it mean to say Indigenous peoples are living communities?", right: "They have lived here for thousands of years and are part of Canada today", wrong: ["They only exist in history books", "They arrived with the first European ships"], hint: "First Nations, Métis and Inuit communities continue today." },
  { prompt: "Why do we say 'some' or 'many' when we talk about First Nations?", right: "Each nation has its own languages, traditions and history", wrong: ["Because there are only two nations", "Because all nations are exactly the same"], hint: "Never speak for all Nations as if they were one." },
  { prompt: "Which word describes the first peoples who lived on this land before Europeans arrived?", right: "Indigenous", wrong: ["Colonist", "Explorer"], hint: "Indigenous means originally from a place." },
  { prompt: "Inuit Nunangat is…", right: "the homeland of Inuit in Canada's Arctic", wrong: ["a river in Ontario", "a trading post"], hint: "Nunangat means land, water and ice together." },
  { prompt: "Which is a way that Elders and knowledge keepers share history?", right: "Through stories, teachings and conversation", wrong: ["Only through printed newspapers", "By sending letters to the government"], hint: "Oral history is shared by speaking and listening." },
  { prompt: "Many First Nations had villages near water. What was one reason?", right: "Waterways were routes for travel, trade and food", wrong: ["They were afraid of land", "Boats were not allowed on land"], hint: "Rivers and lakes were like roads and food sources.", hard: true },
  { prompt: "The Métis Nation homeland includes parts of which region?", right: "The Prairies and parts of Ontario and the North", wrong: ["Only the Atlantic coast", "Only Nunavut"], hint: "Métis communities are found across many regions of Canada.", hard: true },
];

// ---------- European exploration (A3.3) ----------

const EXPLORERS: Item[] = [
  { prompt: "Who founded the settlement of Québec in 1608?", right: "Samuel de Champlain", wrong: ["John Cabot", "Henry Hudson"], hint: "Champlain was a French explorer who established a trading post at Québec." },
  { prompt: "Jacques Cartier explored the St. Lawrence River for which country?", right: "France", wrong: ["England", "Norway"], hint: "Cartier made voyages in 1534–1536 on behalf of the king of France." },
  { prompt: "John Cabot reached the coast of Newfoundland in 1497 sailing for which country?", right: "England", wrong: ["France", "Spain"], hint: "Cabot was born in Italy but sailed under the English king." },
  { prompt: "About how long ago did Norse people build a settlement at L'Anse aux Meadows in Newfoundland?", right: "About 1000 years ago", wrong: ["About 100 years ago", "About 400 years ago"], hint: "The Norse arrived around the year 1000, centuries before Cabot." },
  { prompt: "What were many early explorers hoping to find?", right: "A sea route to Asia", wrong: ["A way to the Moon", "A lost European city"], hint: "Europeans wanted a shorter route to the riches of Asia, such as spices and silk." },
  { prompt: "Why did fishers from Europe sail to the waters off Newfoundland in the 1500s?", right: "To catch plentiful cod", wrong: ["To find gold in the sea", "To hunt dinosaurs"], hint: "The Grand Banks had huge numbers of cod, which could be dried and sold in Europe." },
  { prompt: "What is a colony?", right: "A territory settled and controlled by another country", wrong: ["A kind of ship", "A type of fur"], hint: "France and England set up colonies in North America." },
  { prompt: "Which was a main reason Europeans set up fur-trading posts?", right: "Beaver fur was valuable in Europe", wrong: ["They wanted to build roads", "They needed sand for glass"], hint: "Fur, especially beaver, was made into fashionable hats." },
  { prompt: "Missionaries came to the lands that became Canada to…", right: "spread their religion, Christianity", wrong: ["build steamships", "collect fur only"], hint: "Many French missionaries lived in Wendat and other communities and tried to teach Christianity." },
  { prompt: "Henry Hudson explored the large bay now named after him in 1610–1611. Where is this bay?", right: "In northern Canada", wrong: ["In the Gulf of Mexico", "Off the coast of Newfoundland"], hint: "Hudson Bay is a large inland sea in northern Canada." },
  { prompt: "When European explorers claimed land for their kings, what was missing?", right: "The land was already home to Indigenous peoples, who were not asked", wrong: ["No one had ever walked there", "It was already a European colony"], hint: "Nations had lived on and cared for these lands for thousands of years.", hard: true },
  { prompt: "Étienne Brûlé, a young French interpreter, is known for…", right: "living with the Wendat and learning their language", wrong: ["founding Port-Royal", "leading the English fleet"], hint: "He was sent by Champlain to live among the Wendat around 1610.", hard: true },
  { prompt: "Pierre Dugua de Mons and Champlain founded which early French settlement in Acadia in 1605?", right: "Port-Royal", wrong: ["Québec", "Montréal"], hint: "Port-Royal was on the Bay of Fundy.", hard: true },
  { prompt: "Besides wealth, why did European rulers want colonies?", right: "To gain power and control over land and resources", wrong: ["Because Indigenous nations asked them to", "To give land back to Indigenous nations"], hint: "Claiming land increased a ruler's power and wealth.", hard: true },
  { prompt: "Which was an early settlement attempt by the Norse?", right: "L'Anse aux Meadows", wrong: ["Port-Royal", "Québec"], hint: "It is in northern Newfoundland and is a UNESCO World Heritage Site.", hard: true },
  { prompt: "Who was Jacques Cartier?", right: "A French explorer who sailed up the St. Lawrence River", wrong: ["An English fur trader", "A Norse chief"], hint: "Cartier made voyages for France in the 1530s." },
  { prompt: "What did Cartier and other explorers often do when they met Indigenous peoples?", right: "They traded with them and learned about the land from them", wrong: ["They found empty villages everywhere", "They asked permission to join the Navy"], hint: "Many Indigenous guides helped newcomers travel and survive." },
  { prompt: "Which sea creature drew many European fishers across the Atlantic?", right: "Cod", wrong: ["Whales only", "Jellyfish"], hint: "Cod could be salted and dried for the long trip home." },
  { prompt: "Why did explorers need maps and compasses?", right: "To find their way across oceans and unknown coasts", wrong: ["To play games on the ships", "To count their coins"], hint: "Navigation tools helped sailors stay on course." },
  { prompt: "Which country sent Henry Hudson on his voyage to the bay later named after him?", right: "England (and Dutch traders also hired him earlier)", wrong: ["Spain only", "Norway only"], hint: "Hudson sailed in 1610 on an English ship.", hard: true },
  { prompt: "Which explorer is linked to the early French settlement of Québec?", right: "Samuel de Champlain", wrong: ["Jacques Cartier", "Henry Hudson"], hint: "Champlain founded Québec in 1608." },
  { prompt: "What is a trading post?", right: "A place where goods such as furs were traded", wrong: ["A kind of canoe", "A school for sailors"], hint: "Traders swapped furs for goods like metal tools and cloth." },
  { prompt: "Who first lived on the lands that explorers called a 'New World'?", right: "Indigenous peoples", wrong: ["No one", "French settlers"], hint: "The land was new to Europeans, but not to the people who lived here." },
];

const EXPLORER_ORDER: OrderQuestion = {
  kind: "order",
  prompt: "Put these events in order from earliest to latest.",
  hint: "Norse about 1000, Cabot in 1497, Cartier in 1534 and Champlain at Québec in 1608.",
  items: [
    { id: "norse", label: "Norse settlement at L'Anse aux Meadows (about 1000)", emoji: "⛵" },
    { id: "cabot", label: "John Cabot reaches Newfoundland (1497)", emoji: "🧭" },
    { id: "cartier", label: "Jacques Cartier sails up the St. Lawrence (1534)", emoji: "🌊" },
    { id: "champlain", label: "Champlain founds Québec (1608)", emoji: "🏘️" },
  ],
};

// ---------- New France (A3.4) ----------

const NEW_FRANCE: Item[] = [
  { prompt: "New France was a colony belonging to which country?", right: "France", wrong: ["England", "Spain"], hint: "The French king ruled New France." },
  { prompt: "Which settlement became the capital of New France?", right: "Québec", wrong: ["Port-Royal", "Halifax"], hint: "Québec sits high on a cliff over the St. Lawrence River." },
  { prompt: "What was a seigneur?", right: "A landowner who was given a large piece of land by the king", wrong: ["A fur trader who paddled canoes", "A priest who led a church"], hint: "In the seigneurial system, the king gave land to seigneurs." },
  { prompt: "What were farmers on seigneurs' land called?", right: "Habitants", wrong: ["Intendants", "Voyageurs"], hint: "Habitants farmed a long strip of land and paid fees to the seigneur." },
  { prompt: "Why were seigneuries divided into long, narrow strips?", right: "So every farm could reach the river", wrong: ["Because the land was square", "To keep farms small on purpose for tax"], hint: "The river was the road, so each farm needed access to it." },
  { prompt: "Who was the head of the government in France and New France?", right: "The king", wrong: ["The bishop", "The governor"], hint: "New France was ruled by the king through his officials." },
  { prompt: "What was the governor's main role in New France?", right: "To lead the military and deal with other nations and colonies", wrong: ["To run the church", "To farm the land"], hint: "The governor represented the king." },
  { prompt: "What did the intendant look after?", right: "Justice, money and the economy", wrong: ["Church services", "Fishing"], hint: "The intendant managed the day-to-day running of the colony." },
  { prompt: "Which institution ran most schools and hospitals in New France?", right: "The Roman Catholic Church", wrong: ["The fur trade companies", "The governor's army"], hint: "Nuns and priests taught students and cared for the sick." },
  { prompt: "Who were the 'filles du roi' (King's Daughters)?", right: "Young women sent from France in the 1660s–1670s to marry settlers", wrong: ["Nuns who ran hospitals", "Queens of France"], hint: "The king wanted the population of New France to grow." },
  { prompt: "Who led the Church in New France?", right: "The bishop", wrong: ["The intendant", "The seigneur"], hint: "The bishop led the Roman Catholic Church in the colony." },
  { prompt: "Who was in charge of the colony's justice and finances: the governor, the bishop or the intendant?", right: "The intendant", wrong: ["The governor", "The bishop"], hint: "Jean Talon, the first intendant, helped the colony grow.", hard: true },
  { prompt: "Why was the seigneurial system important to the king of France?", right: "It helped settle land and grow farms along the river", wrong: ["It ended the fur trade", "It made sure farmers could vote"], hint: "Settlers on farms made the colony stronger.", hard: true },
  { prompt: "Who did the seigneur rent land to?", right: "Habitants", wrong: ["The governor", "The bishop"], hint: "Habitants farmed the land and paid fees." },
  { prompt: "What was Jean Talon known for as intendant of New France?", right: "Helping the colony grow with farms, businesses and more settlers", wrong: ["Leading the English navy", "Running the fur trade company"], hint: "Talon encouraged families and trades.", hard: true },
  { prompt: "What was the capital of Acadia, a French colony in the east?", right: "Port-Royal", wrong: ["Montréal", "Calgary"], hint: "Port-Royal was on the Bay of Fundy." },
  { prompt: "Who ruled New France from far away in Europe?", right: "The king of France", wrong: ["The English queen", "A band council"], hint: "The king sent governors and officials to run the colony." },
  { prompt: "Why did many people in New France go to church on Sundays?", right: "The Roman Catholic Church was an important part of community life", wrong: ["There was no other building", "The king ordered everyone to farm"], hint: "Parishes brought neighbours together." },
  { prompt: "What did a habitant usually grow on a narrow farm by the river?", right: "Wheat and other crops, and vegetables", wrong: ["Cocoa and bananas", "Rice and cotton"], hint: "Crops that could grow in the St. Lawrence valley." },
  { prompt: "Which job did sisters and nuns often do in New France?", right: "Teach children and care for the sick", wrong: ["Run the fur trade", "Lead the army"], hint: "Many hospitals and schools were run by religious orders." },
  { prompt: "Why was the St. Lawrence River so important to New France?", right: "It was a main route for travel and trade", wrong: ["It was too icy to use", "It was far from the farms"], hint: "The river worked like a highway in the colony." },
  { prompt: "A colony far from home needs people to settle there. How did the king encourage families?", right: "He sent young women and gave help to new couples", wrong: ["He banned marriage", "He closed the farms"], hint: "The King's Daughters came in the 1660s and 1670s." },
  { prompt: "The seigneur lived in a manor house. What did the seigneur do for the habitants?", right: "Built a mill and helped organize the land", wrong: ["Paid their taxes", "Gave them free food"], hint: "In return for fees, a seigneur had some duties, like a mill for grinding grain.", hard: true },
  { prompt: "Which was true about daily life for habitants?", right: "They farmed, paid dues to the seigneur and attended church", wrong: ["They could choose their own king", "They paid no dues of any kind"], hint: "Farm life centred on the land, the seigneur and the parish.", hard: true },
];

// ---------- The fur trade and the Métis (A3.5, A3.6, A1.1, A1.2) ----------

const FUR: Item[] = [
  { prompt: "Why did Europeans want beaver fur?", right: "It was used to make felt hats", wrong: ["It was used to make ships", "It was used to make glass"], hint: "Beaver felt hats were fashionable in Europe." },
  { prompt: "What did First Nations traders often receive in exchange for furs?", right: "Metal tools, kettles and cloth", wrong: ["Cars", "Plastic toys"], hint: "Metal pots and tools were valuable trade goods." },
  { prompt: "Which was a way First Nations helped newcomers?", right: "They shared knowledge of travel, such as canoes and snowshoes", wrong: ["They built castles for them", "They taught them to speak French first"], hint: "Many newcomers survived because of Indigenous knowledge of the land." },
  { prompt: "European diseases like smallpox harmed many First Nations communities because…", right: "people had no earlier exposure, so many became very ill", wrong: ["the diseases were harmless to people", "the diseases only affected animals"], hint: "They had never been exposed to these illnesses, so they had little immunity." },
  { prompt: "What was a coureur de bois?", right: "A French fur trader who travelled the interior without an official licence", wrong: ["A government official", "A type of canoe"], hint: "The name means 'runner of the woods'." },
  { prompt: "The Hudson's Bay Company was founded in 1670 by traders from which country?", right: "England", wrong: ["France", "Spain"], hint: "It was an English company that traded for furs around Hudson Bay." },
  { prompt: "Who designed the birch-bark canoe used in the fur trade?", right: "Indigenous peoples", wrong: ["French sailors", "English shipbuilders"], hint: "Newcomers adopted Indigenous canoe designs because they were light and fast." },
  { prompt: "Which was a positive result of trade for some First Nations?", right: "Access to new goods such as metal tools", wrong: ["Protection from disease", "More land"], hint: "Metal tools and goods were useful." },
  { prompt: "Which was a negative result of contact for many First Nations?", right: "Loss of land and lives to disease", wrong: ["Gaining new holidays", "Lower prices"], hint: "Contact brought harm as well as trade." },
  { prompt: "Which people were important partners in the fur trade?", right: "First Nations traders, who gathered and traded furs", wrong: ["Only European soldiers", "Only farmers in New France"], hint: "First Nations people trapped, prepared and traded furs and knew the land." },
  { prompt: "Who are the Métis?", right: "A distinct Indigenous people with their own culture, history and identity", wrong: ["Anyone who has parents from two countries", "A group of French settlers"], hint: "Métis have their own distinct culture, often with the Michif language.", hard: true },
  { prompt: "The Métis people came about through relationships between…", right: "First Nations women and European fur traders", wrong: ["Inuit and Norse settlers", "French and English soldiers"], hint: "Over generations their children and families formed a new, distinct people.", hard: true },
  { prompt: "What does 'ethnogenesis' mean?", right: "The way a new, distinct people comes into being", wrong: ["The study of old maps", "A treaty between two nations"], hint: "'Genesis' means beginning.", hard: true },
  { prompt: "The fur trade made it harder for some First Nations because…", right: "competition for furs and loss of access to lands changed their ways of life", wrong: ["they had no beavers anywhere", "it ended all trade"], hint: "More hunting and settlement changed the land and left less space for traditional ways of life.", hard: true },
  { prompt: "Which animal's fur was the most valuable in the fur trade?", right: "Beaver", wrong: ["Mouse", "Moose"], hint: "Beaver fur made warm felt for hats." },
  { prompt: "What is a trading post?", right: "A place where people traded goods such as furs", wrong: ["A kind of canoe", "A school"], hint: "Traders swapped furs for tools and cloth." },
  { prompt: "Who paddled large canoes carrying furs and goods?", right: "Voyageurs", wrong: ["Seigneurs", "Intendants"], hint: "Voyageurs were canoe travellers in the fur trade." },
  { prompt: "What was one benefit of partnerships between traders and First Nations?", right: "Both sides shared goods and knowledge", wrong: ["Nobody learned anything", "The fur trade stopped"], hint: "Traders needed Indigenous knowledge of rivers, land and animals." },
  { prompt: "Which company was created in 1670 and traded around Hudson Bay?", right: "The Hudson's Bay Company", wrong: ["The Northwest Passage Company", "The Cabot Trading Group"], hint: "It was an English company." },
  { prompt: "Why did traders bring metal kettles and knives to trade?", right: "First Nations traders found them useful and valuable", wrong: ["Nobody wanted them", "They were free gifts only"], hint: "Metal lasted longer than some older tools." },
  { prompt: "Which language is spoken by many Métis communities and combines Indigenous and French words?", right: "Michif", wrong: ["Latin", "Norse"], hint: "Michif is a Métis language.", hard: true },
  { prompt: "Why did some First Nations people become guides and interpreters?", right: "They knew the land and languages, and traders needed their help", wrong: ["They were forced by law in 1600", "They wanted to leave their homes"], hint: "Skilled knowledge made them important partners." },
  { prompt: "The fur trade changed the number of beavers in some places. Why?", right: "Many were trapped, so there were fewer beavers", wrong: ["Beavers moved to Europe", "Nobody trapped them"], hint: "Too much trapping can harm an animal population.", hard: true },
  { prompt: "Which sentence about the fur trade is fair?", right: "It brought both benefits and harms to Indigenous peoples", wrong: ["It only helped Europeans", "It never affected anyone"], hint: "Look at more than one side.", hard: true },
];

// ---------- Conflict and change before 1713 (A3.8) ----------

const CONFLICT: Item[] = [
  { prompt: "Wars between European countries sometimes reached North America. Which two countries were often rivals?", right: "France and England", wrong: ["France and Norway", "England and Japan"], hint: "France and England competed for land and trade in North America." },
  { prompt: "Acadia changed hands between the French and which other country several times?", right: "The British (English)", wrong: ["Spain", "Russia"], hint: "Port-Royal was captured several times before 1713." },
  { prompt: "The Treaty of Utrecht in 1713 gave which region of Acadia to Britain?", right: "Most of present-day Nova Scotia", wrong: ["Québec City", "Hudson Bay only"], hint: "France gave up Acadia (peninsular Nova Scotia), Newfoundland claims and Hudson Bay." },
  { prompt: "In 1701, New France and about forty First Nations signed a peace agreement. What is it called?", right: "The Great Peace of Montreal", wrong: ["The Treaty of Utrecht", "The Royal Proclamation"], hint: "It ended a long period of fighting between France and many nations." },
  { prompt: "Some First Nations became allies of the French and others of the English. What effect could this have?", right: "Nations might find themselves on opposite sides of a European war", wrong: ["All fighting ended", "Nations stopped trading"], hint: "European conflicts pulled Indigenous nations into wars.", hard: true },
  { prompt: "What did the English and French compete over in North America?", right: "Land, trade and furs", wrong: ["Rights to the Moon", "Coins"], hint: "Both countries wanted the wealth of the fur trade." },
  { prompt: "What was the effect of European rivalries on Indigenous nations?", right: "They were drawn into conflicts they didn't start", wrong: ["Nothing changed for them", "They became part of the English army by law"], hint: "Many nations had to decide which side, if any, to support." },
  { prompt: "The Hudson's Bay Company and French traders competed. This is called…", right: "a fur trade rivalry", wrong: ["a treaty", "a census"], hint: "Both wanted furs from the same First Nations traders.", hard: true },
  { prompt: "The Mi'kmaq lived in Acadia and did not leave when control passed from the French to the British. What does this show?", right: "Indigenous nations remained on their lands despite changes in European control", wrong: ["The Mi'kmaq were French settlers", "Acadia had no people before 1713"], hint: "The Mi'kmaq were there long before either colony.", hard: true },
  { prompt: "In which year was the Treaty of Utrecht signed?", right: "1713", wrong: ["1608", "1867"], hint: "It ended Queen Anne's War. The end of this unit's period is also 1713." },
  { prompt: "A treaty between European countries that gave away land (like the Treaty of Utrecht) often didn't ask…", right: "the Indigenous nations who lived on that land", wrong: ["the king", "the governor"], hint: "Indigenous nations were not part of those treaties.", hard: true },
  { prompt: "Why did Britain and France fight over Acadia?", right: "Both wanted the land, ports and trade", wrong: ["Nobody lived there", "They both wanted to stop trading"], hint: "Acadia was in a useful place along the Atlantic coast." },
  { prompt: "Who were the Acadians?", right: "French-speaking settlers in Acadia", wrong: ["English soldiers", "Inuit hunters"], hint: "Acadia was a French colony in the east." },
  { prompt: "The Wendat and the French became trading partners. What was this called?", right: "An alliance", wrong: ["A census", "A glossary"], hint: "An alliance is a partnership between groups." },
  { prompt: "Why were alliances risky for First Nations?", right: "They could be drawn into wars between Europeans", wrong: ["They stopped all trade", "They made everyone move to Europe"], hint: "European rivals asked allies to take sides." },
  { prompt: "The Great Peace of Montreal was signed in which year?", right: "1701", wrong: ["1608", "1867"], hint: "It was signed 12 years before the Treaty of Utrecht." },
  { prompt: "What was the Great Peace of Montreal meant to do?", right: "End fighting and set out ways to settle disputes", wrong: ["Start a new war", "Create a fur company"], hint: "It brought many nations and the French together." },
  { prompt: "Which of these was a result of the Treaty of Utrecht?", right: "France gave Acadia and other claims to Britain", wrong: ["Canada became a country", "The fur trade ended"], hint: "France lost some colonies in 1713." },
  { prompt: "When France and Britain fought, what did many Acadians have to do?", right: "Live through changes in who ruled their homeland", wrong: ["Move to Asia", "Join the Navy"], hint: "Control of Acadia changed more than once." },
  { prompt: "Which people were not asked about the Treaty of Utrecht, though it affected their lands?", right: "Indigenous nations like the Mi'kmaq", wrong: ["The king of France", "British sailors"], hint: "Europeans made decisions about land without the nations who lived there." },
  { prompt: "Why did the fur trade lead to rivalries among Europeans?", right: "They competed for furs and trading partners", wrong: ["They all wanted fewer furs", "They traded in secret to help each other"], hint: "More trade meant more wealth." },
  { prompt: "A conflict between nations can lead to…", right: "changes in land, trade and relationships", wrong: ["no changes at all", "more sunny weather"], hint: "Conflict affects many parts of life." },
  { prompt: "The Mi'kmaq signed Peace and Friendship Treaties with Britain later in the 1700s. What do those show?", right: "Nations used treaties to set out relationships", wrong: ["Nobody wrote anything down", "France ruled all of Acadia"], hint: "Treaties describe promises between nations.", hard: true },
  { prompt: "What does an 'ally' mean?", right: "A partner who agrees to help another side", wrong: ["An enemy", "A trader of cloth"], hint: "Allies share goals and support each other." },
];

// ---------- Treaties and today (A1.3, B3.6) ----------

const TREATIES: Item[] = [
  { prompt: "What is a treaty?", right: "A formal agreement between nations or governments", wrong: ["A type of fur", "A kind of map"], hint: "Treaties set out promises made by each side." },
  { prompt: "Are treaties with Indigenous nations still important today?", right: "Yes, they are legal agreements that still guide relationships", wrong: ["No, they ended long ago", "Only for lands in the far north"], hint: "Treaty rights and responsibilities continue." },
  { prompt: "Treaties include rights and responsibilities for…", right: "both sides", wrong: ["only one side", "neither side"], hint: "Each side made promises." },
  { prompt: "What is a land claim?", right: "When an Indigenous community asks for its rights to land to be recognized", wrong: ["A map of cities", "A tax on land"], hint: "Land claims are negotiated with governments." },
  { prompt: "Nunavut was created in 1999. What agreement helped this happen?", right: "A land claim agreement with the Inuit", wrong: ["The Treaty of Utrecht", "The Great Peace of Montreal"], hint: "The Nunavut Land Claims Agreement was signed in 1993 and the territory began in 1999." },
  { prompt: "In what is now the Maritimes, Peace and Friendship Treaties were signed in the 1700s with which peoples?", right: "Mi'kmaq, Wolastoqiyik (Maliseet) and Passamaquoddy", wrong: ["Inuit and Métis", "Cree and Blackfoot"], hint: "These treaties were made with the British Crown.", hard: true },
  { prompt: "What does the 'duty to consult' mean?", right: "Governments must talk with Indigenous communities before decisions that could affect their rights", wrong: ["Governments must ask the whole country to vote", "Indigenous communities must ask the government for permission to hunt"], hint: "It is a legal responsibility of the federal and provincial governments.", hard: true },
  { prompt: "Which situation might require governments to consult a First Nation?", right: "A plan for a mine or pipeline on its traditional territory", wrong: ["A new bus stop in a faraway city", "A school bake sale"], hint: "A major project that could affect the land and treaty rights calls for consultation.", hard: true },
  { prompt: "The Robinson Treaties of 1850 cover which part of the continent?", right: "Lands north of lakes Huron and Superior in Ontario", wrong: ["The Maritime provinces", "Vancouver Island"], hint: "These treaties are important in northern Ontario today.", hard: true },
  { prompt: "Why do issues like land claims connect the past to present-day Canada?", right: "Agreements made long ago still affect rights and responsibilities today", wrong: ["Because maps never change", "Because treaties are only for history class"], hint: "Past promises are still being discussed and honoured.", hard: true },
  { prompt: "Whose responsibility is it to honour treaties?", right: "Governments and citizens, as treaty partners", wrong: ["Only Indigenous communities", "No one anymore"], hint: "Treaties are about relationships and shared responsibilities." },
  { prompt: "Treaty rights are held by…", right: "Indigenous peoples who are parties to the treaty", wrong: ["Only the federal government", "Anyone who visits Canada"], hint: "The treaty names the peoples whose rights it protects." },
  { prompt: "Where can you find the names of the peoples who made a treaty?", right: "In the treaty text and in government and community records", wrong: ["Nowhere", "On a weather map"], hint: "Treaties are written and remembered by both sides." },
  { prompt: "Treaty Day is an event in some communities. What does it help people do?", right: "Remember and honour the agreement", wrong: ["Forget old promises", "Change the weather"], hint: "Treaties are living agreements." },
  { prompt: "Which of these might a modern treaty or land claim agreement include?", right: "Rights to use land and manage resources", wrong: ["A new brand of cereal", "A holiday on Mars"], hint: "Agreements describe land and rights." },
  { prompt: "A territory acknowledgement at a school event recognizes…", right: "that the school is on the traditional lands of Indigenous peoples", wrong: ["who won a sports game", "when lunch starts"], hint: "It is a way to show respect and remember the land's history." },
  { prompt: "Why is it important to learn about treaties in Ontario?", right: "Many communities live on treaty lands, and treaties affect everyone", wrong: ["Only Indigenous students need to know", "They are only decorations"], hint: "Everyone in Ontario lives on lands covered by treaties or agreements." },
  { prompt: "The Royal Proclamation of 1763 said the Crown must make treaties before…", right: "settling on Indigenous land", wrong: ["building any roads", "visiting Canada"], hint: "The Proclamation recognized Indigenous rights to land.", hard: true },
  { prompt: "What does 'honouring a treaty' mean?", right: "Keeping the promises made in it", wrong: ["Hanging it on a wall", "Ignoring the parts that are hard"], hint: "Honour means to follow and respect." },
  { prompt: "A modern treaty is negotiated between…", right: "an Indigenous group and governments", wrong: ["only two cities", "two sports teams"], hint: "Land claim and self-government agreements are examples." },
  { prompt: "If a treaty's promises are not kept, what might a community do?", right: "Ask governments to fix it and, if needed, go to court", wrong: ["Nothing, ever", "Cancel all rules in the country"], hint: "Communities use talks and courts to protect their rights.", hard: true },
  { prompt: "Which of these is a symbol of agreement between nations in Haudenosaunee and other traditions?", right: "A wampum belt", wrong: ["A lunch menu", "A parking ticket"], hint: "Beaded patterns helped record and remember agreements." },
  { prompt: "A treaty is different from a law passed by a school council because it is…", right: "an agreement between nations or governments", wrong: ["a class rule", "a sports score"], hint: "Treaties are nation-to-nation or Crown-to-nation agreements." },
  { prompt: "Which tool did Indigenous nations and the Crown use to agree on ways of sharing the land in many treaties?", right: "Negotiation (talking and agreeing)", wrong: ["Weather forecasts", "Coin sorting"], hint: "Each side talked about what it wanted and promised." },
];

// ---------- Who does what? (B3.2, B3.4, B3.7) ----------

const SERVICES: Item[] = [
  { prompt: "Which level of government usually looks after garbage pickup?", right: "Municipal (city or town)", wrong: ["Federal", "Provincial"], hint: "Local governments run neighbourhood services." },
  { prompt: "Which level of government is responsible for passports?", right: "Federal", wrong: ["Municipal", "School board"], hint: "Passports are Canada-wide documents." },
  { prompt: "Which level of government mainly runs the public health care system in Ontario?", right: "Provincial", wrong: ["Municipal", "Federal only"], hint: "Provinces and territories deliver health care." },
  { prompt: "Which level of government looks after the Canadian army, navy and air force?", right: "Federal", wrong: ["Provincial", "Municipal"], hint: "National defence is a federal job." },
  { prompt: "Who is elected to run public schools in a local area?", right: "School board trustees", wrong: ["The prime minister", "Band councillors"], hint: "School boards are elected bodies that manage local schools." },
  { prompt: "A band council is the governing body of…", right: "a First Nation community", wrong: ["a school board", "a provincial parliament"], hint: "Chiefs and councillors are elected in many First Nations." },
  { prompt: "Who looks after local parks, libraries and recreation centres?", right: "Municipal government", wrong: ["Federal government", "Band council only"], hint: "These are local services." },
  { prompt: "Which level of government usually looks after provincial highways?", right: "Provincial", wrong: ["Federal", "Municipal"], hint: "Provinces build and maintain highways." },
  { prompt: "Which services are handled by city councils?", right: "Local roads, public transit and fire protection", wrong: ["National defence and passports", "Currency and immigration"], hint: "Those are local services." },
  { prompt: "Who is in charge of the Canadian post office and national parks?", right: "The federal government", wrong: ["Each city separately", "School boards"], hint: "These are national services." },
  { prompt: "Clean drinking water needs several levels to work together. Which pairing is right?", right: "The city treats the water; the province sets safety rules", wrong: ["The city sets national rules; the federal government treats it", "School boards test water"], hint: "Responsibilities for services like water are often shared.", hard: true },
  { prompt: "Transportation is a shared responsibility. Which is correct?", right: "City streets are municipal; highways are provincial; airports are federal", wrong: ["Airports are municipal; streets are federal", "Everything is municipal"], hint: "Different governments look after different parts.", hard: true },
  { prompt: "Health care is a shared responsibility. Which statement fits?", right: "Provinces deliver it, and the federal government gives funding and sets national rules", wrong: ["Cities decide all laws", "Only the federal government runs hospitals"], hint: "The Canada Health Act sets national principles.", hard: true },
  { prompt: "Which government could respond to a flood affecting several provinces?", right: "Provincial and federal governments, working with local governments", wrong: ["Only a school board", "Only the band council"], hint: "A large emergency may need more than one level of government.", hard: true },
  { prompt: "Canada's three territories are Yukon, the Northwest Territories and…", right: "Nunavut", wrong: ["Labrador", "Manitoba"], hint: "Nunavut became a territory in 1999." },
];

const SERVICES_SORT: SortSet = {
  prompt: "Municipal or federal government? Tap an item, then tap its basket.",
  hint: "Municipal governments look after local services. The federal government looks after Canada-wide ones.",
  bins: [
    { id: "municipal", label: "Municipal", emoji: "🏘️" },
    { id: "federal", label: "Federal", emoji: "🍁" },
  ],
  items: [
    { label: "Garbage pickup", emoji: "🗑️", bin: "municipal" },
    { label: "Local library", emoji: "📚", bin: "municipal" },
    { label: "City parks", emoji: "🌳", bin: "municipal" },
    { label: "Snow removal on city streets", emoji: "🚜", bin: "municipal" },
    { label: "Passports", emoji: "🛂", bin: "federal" },
    { label: "Canadian Armed Forces", emoji: "🪖", bin: "federal" },
    { label: "Canadian money", emoji: "💵", bin: "federal" },
    { label: "Canada Post", emoji: "📮", bin: "federal" },
  ],
};

// ---------- Citizens and action (B1, B3.8, B3.9) ----------

const CITIZENS: Item[] = [
  { prompt: "How old must you be to vote in a federal election in Canada?", right: "18", wrong: ["16", "21"], hint: "Canadian citizens aged 18 and over can vote." },
  { prompt: "Which is a way a student can take action about a local issue?", right: "Write a letter to the mayor or a councillor", wrong: ["Do nothing, since kids cannot take part", "Wait until you are an adult to say anything"], hint: "Anyone can share an opinion with elected officials." },
  { prompt: "What is a petition?", right: "A list of signatures asking a government to take action", wrong: ["A type of tax", "A kind of election"], hint: "A petition shows how many people care about an issue." },
  { prompt: "A town hall meeting is held so that…", right: "residents can share their views with leaders", wrong: ["only mayors can speak", "citizens can buy tickets"], hint: "Governments ask for public input at meetings like this." },
  { prompt: "Which of these is a way governments get input from the public?", right: "Public hearings", wrong: ["Secret meetings only", "Private chats with friends"], hint: "Hearings, elections and meetings invite people to speak up." },
  { prompt: "People disagree about a new road through a forest. Why might perspectives differ?", right: "Drivers, nature groups and nearby residents care about different things", wrong: ["Everyone wants exactly the same thing", "Nobody has an opinion"], hint: "People's experiences and values shape their opinions." },
  { prompt: "A park has litter everywhere. Which plan best addresses this problem?", right: "Organize a clean-up and add signs and more garbage bins", wrong: ["Hope the litter goes away by itself", "Close the park for good"], hint: "A good plan includes actions that solve the cause." },
  { prompt: "Which is a first step in making a plan of action about an issue?", right: "Find out the facts and who is affected", wrong: ["Decide before learning anything", "Wait for someone else"], hint: "Good plans begin with information." },
  { prompt: "Choosing a candidate whose ideas match your own is an example of…", right: "taking part in democracy by voting", wrong: ["leaving decisions to others", "avoiding all elections"], hint: "Voting is a way citizens have a say." },
  { prompt: "A band council meeting is one way a First Nation community…", right: "makes decisions and hears from its members", wrong: ["chooses a national prime minister", "sets national laws"], hint: "Community members can take part in council meetings." },
  { prompt: "Farmers, environmentalists and an energy company may disagree on a pipeline. Why?", right: "Each group has different priorities and concerns", wrong: ["They all agree on everything", "Only one group has a perspective"], hint: "Perspectives depend on what matters most to each group.", hard: true },
  { prompt: "A plan to reduce school waste would be strongest if it…", right: "listens to students, teachers and custodians and has clear steps", wrong: ["is a secret", "only one person decides"], hint: "Plans that include several perspectives work better.", hard: true },
  { prompt: "Which is a responsibility of a good citizen?", right: "Respecting the rights of others", wrong: ["Ignoring rules that are inconvenient", "Only caring about oneself"], hint: "Rights come with responsibilities.", hard: true },
  { prompt: "A group wants a safer crossing at a busy road. Which action targets the right level of government?", right: "Contact the city council, which looks after local streets", wrong: ["Contact the federal Department of Defence", "Contact the Governor General"], hint: "Match the issue to the government that handles it.", hard: true },
  { prompt: "Which of these is a right all citizens in Canada have?", right: "The right to vote at age 18", wrong: ["The right to ignore all laws", "The right to skip school"], hint: "Voting rights apply to citizens aged 18 and older." },
  { prompt: "Which of these is a responsibility of citizens?", right: "Following laws and helping the community", wrong: ["Breaking rules when nobody is looking", "Leaving litter in parks"], hint: "Citizens have duties as well as rights." },
  { prompt: "Which action can help a school reduce food waste?", right: "Start a compost program and ask students for ideas", wrong: ["Tell everyone to throw out more", "Do nothing and complain"], hint: "A good action addresses the cause." },
  { prompt: "A student wants a crosswalk near school. Who could she contact first?", right: "Her city or town councillor", wrong: ["The prime minister of another country", "The post office"], hint: "Local streets are a municipal job." },
  { prompt: "What is a municipal election?", right: "A vote to choose people for local government", wrong: ["A vote on television shows", "A vote to choose a prime minister only"], hint: "Mayors and councillors are elected locally." },
  { prompt: "What is a mayor?", right: "The leader of a city or town council", wrong: ["The leader of a country", "A provincial premier"], hint: "Mayors lead local councils." },
  { prompt: "Two groups disagree about building a new arena. What is a respectful way to share views?", right: "Listen to each other and speak at a council meeting", wrong: ["Shout over the other side", "Refuse to talk"], hint: "Respectful talk helps people find solutions." },
  { prompt: "Which gives people a chance to learn facts before they vote?", right: "Reading news and candidates' platforms", wrong: ["Guessing", "Ignoring everything"], hint: "Voters should be informed." },
  { prompt: "Why do governments ask for public input on big projects?", right: "To hear different perspectives before deciding", wrong: ["To avoid making decisions", "Because it is a game"], hint: "People can share concerns and ideas.", hard: true },
  { prompt: "A group's petition has 500 signatures. What does that show?", right: "Many people care about the issue", wrong: ["The issue is solved", "Nobody cares"], hint: "A petition shows support.", hard: true },
];

// ---------- Social studies inquiry (A2, B2) ----------

const INQUIRY: Item[] = [
  { prompt: "Which is a primary source?", right: "A diary written by a fur trader in 1670", wrong: ["A modern textbook", "A movie made last year"], hint: "A primary source comes from the time being studied." },
  { prompt: "Which is a secondary source?", right: "A textbook chapter about New France", wrong: ["A letter written in 1650", "A photograph from the 1600s"], hint: "A secondary source was written later by someone who wasn't there." },
  { prompt: "Which question is best for an inquiry?", right: "How did the fur trade change life for First Nations and Europeans?", wrong: ["What year was Québec founded?", "Is beaver fur soft?"], hint: "Inquiry questions are open and need research and thinking." },
  { prompt: "Why should we look at more than one perspective on an event?", right: "People who lived it may have had very different experiences", wrong: ["There is only one correct opinion", "It makes the topic shorter"], hint: "Different groups can see the same event differently." },
  { prompt: "Which map type shows the routes used in the fur trade?", right: "A thematic map", wrong: ["A weather forecast", "A road atlas of today"], hint: "A thematic map shows a particular topic." },
  { prompt: "What does a map legend (key) do?", right: "Explains what the symbols on the map mean", wrong: ["Shows who drew the map", "Lists the weather"], hint: "Always check the legend." },
  { prompt: "An Elder shares an oral history. How can you check it is authentic?", right: "Learn who is sharing it and which community it comes from", wrong: ["Assume it is from nowhere", "Only trust it if it is on the internet"], hint: "Authentic voices are identified and respected.", hard: true },
  { prompt: "Which word means 'to settle in and control land that belongs to others'?", right: "Colonization", wrong: ["Transportation", "Navigation"], hint: "Colonization is a key idea in the history of this period." },
  { prompt: "Which tool helps organize notes comparing two perspectives?", right: "A graphic organizer such as a two-column chart", wrong: ["A calculator", "A stopwatch"], hint: "Organizers help you compare ideas." },
  { prompt: "A source only tells the story from one side. What should you do?", right: "Look for other sources with different perspectives", wrong: ["Believe it completely", "Stop researching"], hint: "Strong conclusions use many sources.", hard: true },
  { prompt: "Which should you check about a source before you trust it?", right: "Who made it, when and why", wrong: ["How long the title is", "What colour the cover is"], hint: "Author, date and purpose help you judge reliability.", hard: true },
  { prompt: "A map's compass rose shows…", right: "directions", wrong: ["distance", "the year"], hint: "North, south, east and west." },
];

const INQUIRY_SORT: SortSet = {
  prompt: "Primary source or secondary source? Tap an item, then tap its basket.",
  hint: "A primary source comes from the time being studied. A secondary source was made later.",
  bins: [
    { id: "primary", label: "Primary source", emoji: "📜" },
    { id: "secondary", label: "Secondary source", emoji: "📘" },
  ],
  items: [
    { label: "A letter written in 1650", emoji: "✉️", bin: "primary" },
    { label: "A painting made at the time", emoji: "🖼️", bin: "primary" },
    { label: "A wampum belt", emoji: "📿", bin: "primary" },
    { label: "A trader's diary", emoji: "📔", bin: "primary" },
    { label: "A modern history textbook", emoji: "📘", bin: "secondary" },
    { label: "A documentary made last year", emoji: "🎬", bin: "secondary" },
    { label: "An encyclopedia article", emoji: "📚", bin: "secondary" },
    { label: "A website summarizing the period", emoji: "💻", bin: "secondary" },
  ],
};

export const units: Unit[] = [
  {
    id: "first-peoples-5",
    title: "Nations of Canada",
    emoji: "🗺️",
    blurb: "First Nations, Métis and Inuit",
    standards: on("A3.1, A3.2", "major Indigenous nations and regions, and relationships among nations before and during early contact"),
    parentNote: "Who First Nations, Métis and Inuit are, some major nations and the regions they are connected to, and how nations traded and made agreements. Wording says 'some' and 'many' because each nation is different. Needs review with Indigenous partners.",
    generate: ({ difficulty = 2 } = {}) => levelled(PEOPLES, 8, difficulty),
  },
  {
    id: "explorers-5",
    title: "Explorers and Settlers",
    emoji: "⛵",
    blurb: "Why Europeans came",
    standards: on("A3.3", "motives for European exploration and settlement before 1713"),
    parentNote: "Norse voyages, Cabot, Cartier, Champlain and Hudson, and why Europeans came: routes to Asia, fishing, the fur trade, claiming land and spreading religion, from the point of view that Indigenous peoples already lived here.",
    generate: ({ difficulty = 2 } = {}) => withOrder(EXPLORERS, EXPLORER_ORDER, difficulty),
  },
  {
    id: "new-france-5",
    title: "Life in New France",
    emoji: "⚜️",
    blurb: "Seigneurs, habitants and the Church",
    standards: on("A3.4", "key offices and institutions in New France"),
    parentNote: "How New France was governed by the king, governor, bishop and intendant, how the seigneurial system worked, and the role of the Church.",
    generate: ({ difficulty = 2 } = {}) => levelled(NEW_FRANCE, 8, difficulty),
  },
  {
    id: "fur-trade-5",
    title: "The Fur Trade",
    emoji: "🦫",
    blurb: "Trade, sharing and consequences",
    standards: on("A1.1, A1.2, A3.5, A3.6", "the fur trade, its benefits and harms, and the ethnogenesis of the Métis"),
    parentNote: "Who traded what and why, what each side gained, the harm of disease and lost land, and how the Métis people emerged. Needs review with Indigenous partners.",
    generate: ({ difficulty = 2 } = {}) => levelled(FUR, 8, difficulty),
  },
  {
    id: "conflict-and-change-5",
    title: "Rivals and Allies",
    emoji: "🤝",
    blurb: "European conflicts and nations",
    standards: on("A3.8", "effects of European conflicts on Indigenous peoples and on Acadia"),
    parentNote: "How rivalry between France and England pulled Indigenous nations into conflicts, the Great Peace of Montreal in 1701, and the Treaty of Utrecht in 1713.",
    generate: ({ difficulty = 2 } = {}) => levelled(CONFLICT, 8, difficulty),
  },
  {
    id: "treaties-today-5",
    title: "Treaties and Today",
    emoji: "📜",
    blurb: "Past agreements, present rights",
    standards: on("A1.3, B3.6", "treaties, land claims and the duty to consult"),
    parentNote: "What treaties and land claims are, why they still matter today, and what it means for governments to consult First Nations, Métis and Inuit. Needs review with Indigenous partners.",
    generate: ({ difficulty = 2 } = {}) => levelled(TREATIES, 8, difficulty),
  },
  {
    id: "services-5",
    title: "Who Does What?",
    emoji: "🏛️",
    blurb: "Services and shared jobs",
    standards: on("B3.2, B3.4, B3.7", "who provides which services, and responsibilities shared between governments"),
    parentNote: "Which level of government (municipal, provincial or territorial, federal, band council, school board) provides which service, and issues such as water, health and transportation that need several levels to work together.",
    generate: ({ difficulty = 2 } = {}) => withSort(SERVICES, SERVICES_SORT, difficulty),
  },
  {
    id: "citizen-action-5",
    title: "Taking Action",
    emoji: "✊",
    blurb: "Voices, issues and plans",
    standards: on("B1.2, B1.3, B3.5, B3.8, B3.9", "different perspectives on issues, how the public is heard, and how citizens can act"),
    parentNote: "How citizens can vote, petition, speak at meetings and make plans, and why groups can see the same issue differently.",
    generate: ({ difficulty = 2 } = {}) => levelled(CITIZENS, 8, difficulty),
  },
  {
    id: "inquiry-5",
    title: "Investigate It",
    emoji: "🔎",
    blurb: "Sources, perspectives and maps",
    standards: on("A2.2–A2.4, A2.6, B2.2–B2.4, B2.6", "primary and secondary sources, perspectives, maps and vocabulary"),
    parentNote: "Sorting primary and secondary sources, checking a source, asking good inquiry questions and reading maps.",
    generate: ({ difficulty = 2 } = {}) => withSort(INQUIRY, INQUIRY_SORT, difficulty),
  },
];
