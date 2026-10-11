import { bankUnit, type Q } from "../own";

// Grade 4 social studies, Nova Scotia: what exploration is, stories of explorers and the impacts of exploration.
// Mi'kmaw and African content is factual and in the past or present tense as fits, and needs partner review.

const EXPLORATION: Q[] = [
  ["Exploration means…", "travelling to learn about new places", ["staying home all year", "building a house"], "Explorers go to places that are new to them to find out what is there."],
  ["Which of these is a reason people explore?", "curiosity", ["fear of every new place", "a wish to stay home"], "Many people explore because they want to know what is over the next hill or across the sea."],
  ["Which is another reason people have explored?", "to trade goods", ["to avoid learning anything", "to stay in one place"], "Trade, land, science and survival are all reasons people have travelled."],
  ["Which is a reason that some explorers went to sea?", "to find new land or trade routes", ["to avoid all people", "to stop the tides"], "Many early European explorers hoped to find riches and trade."],
  ["Which of these is a tool explorers use to find direction?", "compass", ["umbrella", "whistle"], "A compass needle points north so you can find your way."],
  ["An astrolabe was used by sailors to…", "measure the height of the sun or stars to find their position", ["catch fish", "take pictures"], "Astrolabes helped sailors work out where they were at sea."],
  ["Which tool shows the shape of lands and waters?", "a map", ["a thermometer", "a calendar"], "Maps help explorers record what they see."],
  ["How did the Mi’kmaq travel on rivers and along the coast?", "by canoe", ["by train", "by airplane"], "The Mi’kmaq knew their rivers, coasts and trails very well."],
  ["When European explorers arrived in what is now Nova Scotia, who already lived there?", "the Mi’kmaq", ["no one", "only soldiers"], "People had lived in Mi’kma’ki for thousands of years."],
  ["A family moves to a new neighbourhood and walks around to see what is there. This is a kind of…", "exploration", ["recycling", "voting"], "Exploring can be as simple as learning about a new place."],
  ["Which kind of exploration happens in outer space?", "space exploration", ["land exploration", "sea exploration"], "Astronauts and space probes explore beyond Earth."],
  ["Which kind of exploration uses a ship?", "sea exploration", ["space exploration", "exploring on foot only"], "Sailing across oceans is exploration by sea."],
  ["Which of these helped early travellers cross land without roads?", "walking on foot or by canoe along waterways", ["flying in jets", "riding a subway"], "Rivers and trails were the main routes long ago."],
  ["Scientists exploring the ocean floor today use…", "special submarines and cameras", ["a spoon", "paper boats only"], "Modern tools let us explore places humans cannot easily go.", true],
  ["Which statement is true?", "Exploration can be done by anyone, including kids", ["Only adults can explore", "Exploration ended long ago"], "People of all ages explore, in their communities and beyond.", true],
  ["Why is it important to say that places were ‘new to explorers’ rather than ‘discovered’?", "Because people already lived there", ["Because the places had no names", "Because maps were not invented"], "Saying new to them respects people who were already there.", true],
  ["Which pair of tools could help a sailor find direction and position?", "compass and astrolabe", ["umbrella and whistle", "spoon and pencil"], "Both tools helped sailors know where they were heading.", true],
  ["Which of these is a reason people today explore?", "to learn science and protect nature", ["to avoid knowing anything", "to make deserts bigger"], "Scientists explore to learn how the world works.", true],
  ["Which tool helps explorers see things far away?", "a telescope", ["a blanket", "a spoon"], "A telescope makes faraway things look closer."],
  ["Which tool today finds your location using satellites?", "GPS", ["a paintbrush", "a candle"], "GPS can tell you where you are on a map."],
  ["Which is used to walk on deep snow?", "snowshoes", ["roller skates", "swim flippers"], "Snowshoes spread out your weight so you do not sink."],
  ["A person who travels to learn about new places is an…", "explorer", ["accountant", "baker"], "Explorers want to find out what is out there."],
  ["What do we call a journey made to explore?", "an expedition", ["a recess", "a lunch"], "An expedition has a goal, a plan and supplies."],
  ["What made exploring by sea dangerous long ago?", "storms and not knowing exactly where they were", ["too many cars", "warm hotels"], "Sailors had few tools to find their way.", true],
  ["Why did explorers draw maps?", "to share what they learned", ["to hide the land", "for decoration only"], "Maps let other travellers use what was learned.", true],
  ["Mi’kmaw travel and trade routes show that First Nations were…", "skilled travellers who knew the land and water", ["never away from home", "unfamiliar with the water"], "Rivers, coasts and trails were well known to the Mi’kmaq.", true],
  ["Which is an example of exploring in your own community?", "walking a new trail to see what is there", ["skipping a trail you know", "staying in bed all day"], "Exploring can start close to home.", true],
];

const EXPLORERS: Q[] = [
  ["Mi’kmaw travellers knew the coasts and rivers of Mi’kma’ki…", "long before ships from Europe arrived", ["only after maps were made", "for one summer"], "People had lived and travelled here for thousands of years."],
  ["John Cabot sailed from England in which year?", "1497", ["1297", "1867"], "John Cabot’s voyage in 1497 reached the Newfoundland region."],
  ["John Cabot’s voyage in 1497 took him to the area near…", "Newfoundland", ["Manitoba", "Vancouver Island"], "He crossed the Atlantic Ocean and reached the Newfoundland region."],
  ["John Cabot sailed for which country?", "England", ["Japan", "Brazil"], "He sailed from England."],
  ["Jacques Cartier sailed for which country?", "France", ["England", "Spain"], "Cartier made voyages for France in the 1530s."],
  ["Jacques Cartier sailed up which river in the 1530s?", "St. Lawrence River", ["Fraser River", "Red River"], "He sailed into the Gulf of St. Lawrence and up the river."],
  ["Samuel de Champlain helped set up a settlement in 1605. What was it called?", "Port-Royal", ["Halifax", "Vancouver"], "Port-Royal was in what is now Nova Scotia."],
  ["Port-Royal was set up in what is today…", "Nova Scotia", ["Alberta", "Ontario"], "Port-Royal was on the Annapolis Basin."],
  ["Pierre Dugua de Mons and Samuel de Champlain were…", "French explorers and leaders of an early settlement", ["Mi’kmaw chiefs", "English kings"], "They worked together to start Port-Royal."],
  ["Some early French settlers began to farm the land near Port-Royal. They became known as…", "Acadians", ["Gaels", "Loyalists"], "The Acadians farmed and built dikes along the marshes."],
  ["Who was Mathieu Da Costa?", "an African navigator and interpreter who worked with Mi’kmaw and European traders", ["a king of Spain", "the first Prime Minister"], "He used his language skills to help people from different places talk with each other."],
  ["Mathieu Da Costa lived in the early…", "1600s", ["1900s", "1300s"], "He worked as an interpreter in the early 1600s."],
  ["Henry Hudson explored the bay that now has his name. What is it called?", "Hudson Bay", ["Bay of Fundy", "Lake Ontario"], "Hudson Bay is in northern Canada."],
  ["Henry Hudson explored Hudson Bay in which year?", "1610", ["1910", "1710"], "He explored it in 1610."],
  ["Why were interpreters important to explorers?", "They helped people who spoke different languages talk to each other", ["They drew maps", "They sailed the ships"], "Language helpers made trade and talking possible.", true],
  ["Why did early settlers at Port-Royal need to prepare for winter?", "Winters were cold and food was hard to find", ["Winters were warm all year", "There was no snow in Nova Scotia"], "Good planning, food and help from neighbours were needed.", true],
  ["Cartier and Cabot both sailed across which ocean?", "Atlantic Ocean", ["Pacific Ocean", "Arctic Ocean"], "Both left Europe and crossed the Atlantic.", true],
  ["Which explorer is linked to Port-Royal?", "Samuel de Champlain", ["Jacques Cartier", "Henry Hudson"], "Champlain helped start Port-Royal in 1605.", true],
  ["Which explorer is linked to a bay in northern Canada?", "Henry Hudson", ["John Cabot", "Samuel de Champlain"], "Hudson Bay is named after him.", true],
  ["Which explorer sailed for France and went up the St. Lawrence River?", "Jacques Cartier", ["John Cabot", "Henry Hudson"], "Cartier made voyages for France in the 1530s."],
  ["Which explorer sailed for England and reached the Newfoundland area in 1497?", "John Cabot", ["Samuel de Champlain", "Jacques Cartier"], "Cabot sailed from England across the Atlantic."],
  ["In which year was Port-Royal started?", "1605", ["1805", "1405"], "Port-Royal was started in 1605 in what is now Nova Scotia."],
  ["Hudson Bay is in which part of Canada?", "the north", ["the far south", "the Pacific coast"], "Hudson Bay is a large bay in northern Canada."],
  ["Samuel de Champlain founded Quebec City in which year?", "1608", ["1908", "1408"], "Champlain founded Quebec after his time at Port-Royal.", true],
  ["What was the name of John Cabot’s ship?", "the Matthew", ["the Titanic", "the Bluenose"], "The Matthew crossed the Atlantic in 1497.", true],
  ["The Order of Good Cheer at Port-Royal was started to…", "share food and company in the winter", ["race boats", "teach map reading"], "Champlain hosted feasts to lift spirits and share food.", true],
  ["Membertou was a Mi’kmaw leader who lived near…", "Port-Royal", ["Vancouver", "Winnipeg"], "He met the French at Port-Royal in the early 1600s.", true],
];

const IMPACTS: Q[] = [
  ["Exploration often led to trade between people from different places. This is…", "a positive effect for some people", ["always a harm", "never important"], "Trade brought new goods, but not everyone shared fairly in it."],
  ["What did the Mi’kmaq and Europeans trade with each other?", "furs, metal tools and cloth", ["computers and phones", "plastic toys"], "Trade goods moved both ways."],
  ["Which is a positive result of exploration?", "better maps of the world", ["lost homes", "new diseases"], "Maps helped people share knowledge."],
  ["Which is a result of exploration that harmed many First Nations?", "new diseases that people had not met before", ["new maps", "new songs"], "Many Indigenous people became sick and some communities lost many members."],
  ["Which was a harmful effect of new settlements on First Nations?", "loss of land and the right to make their own decisions", ["more fishing nets", "bigger forests"], "Settlements grew and took land that First Nations had cared for."],
  ["Which describes a conflict that could happen when newcomers arrived?", "people disagreed about land and who could use it", ["everyone agreed every time", "no one met each other"], "Disagreements over land and resources were common."],
  ["The Peace and Friendship Treaties were agreements made between the Mi’kmaq and the British Crown. They were mostly about…", "peace and how people would live together", ["building roads", "naming provinces"], "The treaties were made between 1725 and 1779."],
  ["Which of these new settlements in Mi’kma’ki was started by the French?", "Port-Royal", ["Winnipeg", "Calgary"], "Port-Royal was started in 1605."],
  ["The same event can look different to different people. This is called a…", "perspective", ["compass", "strait"], "A perspective is how a person sees something based on their own experience."],
  ["A ship arrives at a shore. How might the people on the ship see it?", "as a new land to learn about", ["as a place they have always known", "as their home"], "Their view comes from where they have come from."],
  ["A ship arrives at a shore. How might the people already living there see it?", "as strangers arriving on their homeland", ["as an empty place with nobody home", "as a place far from their home"], "They have lived there for a long time and might worry about what changes could come."],
  ["Which is a cause and effect?", "Settlers cut forests for farms, so animals lost their habitat", ["Settlers cut forests, so more animals found homes there", "Animals left the forest, so settlers arrived"], "A cause makes something happen, and the effect is the result."],
  ["New foods from other places came to Canada through exploration. Which of these is a result?", "people eat a wider variety of food today", ["no one eats fish anymore", "all farms disappeared"], "Trade shared plants and animals around the world."],
  ["Why do people today try to learn more than one side of a story about exploration?", "Because different people were affected in different ways", ["Because stories never change", "Because only one side exists"], "Hearing many voices helps us understand fairly.", true],
  ["Which is the best way to describe the impact of exploration?", "It had some good results and some serious harms", ["It had only good results", "It had no effect"], "History is often both good and hard.", true],
  ["How can people today show respect for First Nations when they learn about exploration?", "Listen to Indigenous voices and learn the true history", ["Pretend that nothing bad happened", "Say it was all long ago and does not matter"], "Respect starts with listening and learning.", true],
  ["Which of these is a long-term effect of the arrival of Europeans in Mi’kma’ki?", "French and English became widely spoken alongside Mi’kmaw", ["Everyone stopped speaking languages", "Mi’kmaw is no longer spoken anywhere"], "Mi’kmaw is still a living language that people teach and speak today.", true],
  ["Which pair shows a cause and its effect?", "A ship brought new diseases, so many people got sick", ["Many people got sick, so a ship was built", "A map was drawn, so the sun rose"], "Look for which thing happened first and made the other happen.", true],
  ["A positive effect of exploration was learning about…", "new plants, animals and foods", ["nothing new", "only old things"], "People shared many new foods and ideas."],
  ["Which food was first grown in the Americas by Indigenous peoples?", "corn", ["wheat", "rice"], "Corn is one of the foods that spread around the world."],
  ["When people disagree about land, a fair way to solve it is to…", "talk and make agreements", ["fight each time", "ignore each other"], "Treaties are agreements made by talking."],
  ["Which is a respectful way for newcomers and Mi’kmaw people to treat each other?", "share knowledge about the land", ["take everything", "ignore each other"], "Respect means listening and sharing."],
  ["A perspective is shaped by…", "your own experiences", ["the weather", "the day of the week"], "People see events in different ways because of their lives."],
  ["Treaties are still important today because they are agreements that…", "should be honoured", ["were erased", "never happened"], "The Peace and Friendship Treaties are still part of life in Nova Scotia.", true],
  ["Why can one source about exploration be incomplete?", "it may show only one person’s view", ["it has too many words", "it is always long"], "Many sources help us see the whole story.", true],
  ["Mi’kmaw people sometimes shared knowledge of the land with newcomers. This helped newcomers…", "find food and travel safely", ["build skyscrapers", "avoid winter"], "Knowing the land was valuable.", true],
  ["Which result of exploration still affects us today?", "place names from many languages", ["no change at all", "one language everywhere"], "Names like Shubenacadie and Port-Royal come from different peoples.", true],
];

export const exploration = bankUnit({
  id: "ns-exploration-4",
  title: "What Is Exploration?",
  emoji: "🧭",
  blurb: "Why people explore, how they find their way, and who was already there.",
  parentNote:
    "Practises what exploration is, why people explore, the tools they use and the fact that people already lived in the places explorers reached. It follows the Grade 4 Nova Scotia social studies outcome on the concept of exploration.",
  standards: ["Investigate the concept of exploration", "reasons, ways and tools of exploration"],
  items: EXPLORATION,
});

export const explorers = bankUnit({
  id: "ns-explorers-4",
  title: "Explorers’ Stories",
  emoji: "⛵",
  blurb: "Meet explorers and travellers from long ago.",
  parentNote:
    "Practises well-known facts about explorers connected to Nova Scotia and Canada, including Mi’kmaw travellers, Cabot, Cartier, Champlain, Mathieu Da Costa and Hudson. It follows the Grade 4 Nova Scotia social studies outcome on the stories of explorers.",
  standards: ["Investigate the stories of various explorers", "who explored, when, where and why"],
  items: EXPLORERS,
});

export const explorationImpacts = bankUnit({
  id: "ns-exploration-impacts-4",
  title: "Impacts of Exploration",
  emoji: "⚖️",
  blurb: "Look at the good and the hard things that came from exploration.",
  parentNote:
    "Practises thinking about the positive and negative impacts of exploration, including trade and new maps as well as disease and loss of land for First Nations, and how the same event looks different to different people. It follows the Grade 4 Nova Scotia social studies outcome on the impacts of exploration. Content about First Nations is handled carefully and needs partner review.",
  standards: ["Evaluate the impacts of exploration", "positive and negative effects and different perspectives"],
  items: IMPACTS,
});
