import { bankUnit, type Q } from "../own";

// Grade 4 social studies, New Brunswick: Wabanaki lands and Canada's physical regions. Wabanaki content is light, in the present
// tense for living communities, and needs review by Wolastoqey, Mi'kmaq and Peskotomuhkati partners before launch.

const LANDS: Q[] = [
  ["What is the name of the Mi’kmaw homeland?", "Mi’kma’ki", ["Wolastoq", "Peskotomuhkati", "Wabanaki"], "Mi’kma’ki reaches across parts of New Brunswick, Nova Scotia, Prince Edward Island and beyond."],
  ["How many districts are in Mi’kma’ki?", "seven", ["two", "twelve", "twenty"], "Each district had its own leaders, who worked together through a Grand Council."],
  ["Which of these Mi’kmaw districts includes part of New Brunswick?", "Siknikt", ["Unama’ki", "Eskikewa’kik", "Kespukwitk"], "Siknikt is in the northeast of New Brunswick. Unama’ki is Cape Breton Island."],
  ["Which Mi’kmaw district is Cape Breton Island?", "Unama’ki", ["Siknikt", "Kespek", "Epekwitk"], "Unama’ki means “land of fog”."],
  ["Which Mi’kmaw district is Prince Edward Island?", "Epekwitk", ["Unama’ki", "Siknikt", "Eskikewa’kik"], "Epekwitk aq Piktuk covers Prince Edward Island and the Pictou area."],
  ["Who are the Wolastoqiyik?", "the people of the beautiful river", ["the people of the sea", "the people of the mountains", "the people of the north"], "Wolastoq is the Saint John River."],
  ["Which river is the heart of the Wolastoqey homeland?", "the Wolastoq (Saint John River)", ["the Fraser River", "the Red River", "the Mackenzie River"], "The Wolastoqiyik travelled and lived along the river and its tributaries."],
  ["Where is the traditional territory of the Peskotomuhkatiyik?", "around the St. Croix River and Passamaquoddy Bay", ["around Hudson Bay", "around Lake Superior", "in the Rocky Mountains"], "Their homeland is on the coast of New Brunswick and Maine."],
  ["Wolastoqiyik, Mi’kmaq and Peskotomuhkatiyik are all part of which alliance?", "the Wabanaki Confederacy", ["the Group of Seven", "the Senate", "the Hudson’s Bay Company"], "Wabanaki means “People of the Dawn”."],
  ["What does Wabanaki mean?", "People of the Dawn", ["People of the Sea", "People of the Mountains", "People of the Trees"], "The Wabanaki live where the sun first rises in North America."],
  ["Wabanaki Peoples have lived on this land for…", "thousands of years", ["about 50 years", "about 200 years", "only since the year 1900"], "Wabanaki cultures and languages are alive today."],
  ["Netukulimk is a Mi’kmaw idea about…", "using what the land and water give in a way that keeps them healthy for the future", ["buying things in a store", "keeping everything for yourself", "moving to a new place every day"], "It means taking what you need, while caring for the land and sharing with the community."],
  ["Why do many Wabanaki teachings say people must take care of the land and water?", "All living things are connected", ["The land is only for show", "Animals are not important", "Water cannot be used up"], "Many teachings describe people as part of the natural world, not apart from it."],
  ["Birchbark canoes were useful on New Brunswick rivers because they were…", "light enough to carry around rapids", ["too heavy to move", "made of metal", "only for the ocean"], "Canoes let families travel long distances and carry goods."],
  ["Which of these is a Wabanaki language spoken in New Brunswick?", "Wolastoqey", ["Latin", "Mandarin", "Greek"], "Mi’kmaw and Peskotomuhkati are also languages of the Wabanaki."],
  ["Which of these is a Wabanaki community in New Brunswick today?", "Elsipogtog", ["Winnipeg", "Calgary", "Kelowna"], "There are many Wabanaki communities in the province, and each has its own leaders."],
  ["How do Wabanaki Peoples stay connected to their culture today?", "through languages, stories, ceremonies and art", ["only by reading old books", "they do not", "only by visiting museums"], "Cultures are living, and communities pass them on to children.", true],
  ["What changed when Europeans took more and more of the land?", "Wabanaki Peoples lost access to much of their land and waters", ["Wabanaki Peoples moved overseas", "Nothing changed", "The land got bigger"], "Colonization disrupted how Wabanaki families lived and cared for the land.", true],
  ["What is colonization?", "when people move to another place and take control of it, and the people who live there", ["a way of planting seeds", "a kind of boat", "a type of weather"], "Colonization has had lasting effects on Indigenous Peoples.", true],
  ["Why is it important to learn about Wabanaki Peoples from Wabanaki voices?", "Their stories and perspectives are the best source", ["They have no stories to share", "Only visitors know the history", "It does not matter"], "Learning from Elders, authors and communities helps us understand fairly.", true],
  ["Many place names in New Brunswick, such as Miramichi, come from…", "Wabanaki languages", ["Latin", "Japanese", "Greek"], "Place names keep Wabanaki languages on the map.", true],
  ["A homeland is…", "the land where a people have lived for a very long time", ["a house made of wood", "a kind of map", "a holiday"], "Wabanaki homelands include forests, rivers and coasts.", true],
  ["Why were rivers like the Wolastoq important to Wabanaki families long ago?", "They were roads for travel and a source of food", ["They were used only for swimming", "They were not important", "They were too small to use"], "Fish such as salmon and eel were important foods."],
  ["Why were the seasons important to Wabanaki families?", "Different foods were found in different places at different times of year", ["Families stayed in one place all year", "Every season had the same foods", "Seasons did not change"], "Families moved with the seasons to fish, hunt and gather."],
  ["Which of these shows respect when learning about a Nation’s name?", "Using the name that the Nation uses for itself", ["Using a nickname instead", "Picking a name that is easier to say", "Mixing up the names on purpose"], "Wolastoqiyik, Mi’kmaq and Peskotomuhkatiyik are the names the Nations use today."],
  ["Which statement about Wabanaki Peoples is true?", "There are three different Nations with their own languages and traditions", ["All Indigenous Peoples in Canada are exactly the same", "They stopped existing long ago", "They all speak the same language"], "Never treat all Nations as one. Each has its own history."],
];

const REGIONS: Q[] = [
  ["How many physiographic (landform) regions does Canada have?", "seven", ["three", "ten", "twelve"], "Canada’s regions are grouped by landforms, rocks and how the land was shaped."],
  ["Which Canadian region is the Rocky Mountains part of?", "the Western Cordillera", ["the Appalachian Region", "the Arctic Lands", "the Hudson Bay Lowlands"], "The Cordillera is a long chain of mountains in the west."],
  ["Which landform region covers most of the Prairie provinces?", "the Interior Plains", ["the Canadian Shield", "the Appalachian Region", "the Arctic Lands"], "The Plains are flat and good for farming."],
  ["Which landform region is the largest in Canada?", "the Canadian Shield", ["the Interior Plains", "the Hudson Bay Lowlands", "the Appalachian Region"], "It covers nearly half of Canada and has very old rock, lakes and forests."],
  ["Which Canadian region includes most of New Brunswick?", "the Appalachian Region", ["the Western Cordillera", "the Interior Plains", "the Arctic Lands"], "It has older, rounded mountains and hills."],
  ["What are the Appalachian Mountains like compared with the Rockies?", "older, lower and more rounded", ["younger, taller and sharper", "flat like the plains", "made of ice"], "The Appalachians have worn down over a very long time."],
  ["Which region has the most people living in it?", "the Great Lakes–St. Lawrence Lowlands", ["the Arctic Lands", "the Hudson Bay Lowlands", "the Canadian Shield"], "Lots of fertile land, good water and big cities are found there."],
  ["Which region is cold, has islands and is covered by snow and ice much of the year?", "the Arctic Lands", ["the Interior Plains", "the Appalachian Region", "the Great Lakes–St. Lawrence Lowlands"], "It includes many islands in the far north."],
  ["Which region is swampy, flat and next to a large bay?", "the Hudson Bay Lowlands", ["the Western Cordillera", "the Appalachian Region", "the Interior Plains"], "It has lots of wetlands."],
  ["Canada has coasts on three oceans. Which of these is one of them?", "the Arctic Ocean", ["the Indian Ocean", "the Southern Ocean", "the Mediterranean Sea"], "The other two are the Atlantic and the Pacific."],
  ["New Brunswick has a coast on which ocean?", "the Atlantic Ocean", ["the Pacific Ocean", "the Arctic Ocean", "the Indian Ocean"], "The Bay of Fundy and Chaleur Bay open to the Atlantic."],
  ["What is the highest mountain above sea level in the world?", "Mount Everest", ["Mount Logan", "Mount Carleton", "Mount Fuji"], "Mount Everest is in the Himalayas in Asia."],
  ["Which is the highest mountain in Canada?", "Mount Logan", ["Mount Everest", "Mount Carleton", "Mount Royal"], "Mount Logan is in the Yukon.", true],
  ["Which is the largest ocean on Earth?", "the Pacific Ocean", ["the Atlantic Ocean", "the Arctic Ocean", "the Indian Ocean"], "It covers about a third of the Earth’s surface."],
  ["Which desert is the largest hot desert in the world?", "the Sahara", ["the Gobi", "the Amazon", "the Arctic"], "The Sahara is in northern Africa."],
  ["Which river is in Egypt and is one of the longest in the world?", "the Nile", ["the Amazon", "the Mackenzie", "the Wolastoq"], "The Nile flows north to the Mediterranean Sea."],
  ["Which continent is the coldest and is covered mostly by ice?", "Antarctica", ["Africa", "Australia", "South America"], "Antarctica is at the South Pole."],
  ["Which of the Great Lakes is the largest?", "Lake Superior", ["Lake Ontario", "Lake Erie", "Lake Huron"], "It is the largest freshwater lake in the world by surface area.", true],
  ["Why are mountains and rivers important to people?", "They shape where people live, travel and get food and water", ["They are not important", "They only look nice", "They move cities"], "Rivers give water and travel routes, and mountains affect weather and travel."],
  ["Which feature of land is surrounded by water?", "an island", ["a valley", "a plain", "a plateau"], "Prince Edward Island is an island."],
  ["A plain is…", "a large area of flat land", ["a very tall mountain", "a body of water", "a patch of ice"], "Plains are good for farming."],
  ["A bay is…", "a part of the sea that curves into the land", ["a very high hill", "a desert", "a kind of tree"], "The Bay of Fundy is a famous bay."],
  ["Which is the longest river in Canada?", "the Mackenzie River", ["the Saint John River", "the Miramichi River", "the Red River"], "The Mackenzie flows through the Northwest Territories to the Arctic Ocean.", true],
  ["What does a map’s legend (or key) show?", "what the symbols on the map mean", ["how old the map is", "who drew the map", "the price of the map"], "A legend explains colours and symbols."],
  ["Which direction is opposite north?", "south", ["east", "west", "up"], "North, south, east and west are the four cardinal directions."],
  ["Which of these landforms is very tall?", "a mountain", ["a plain", "a bay", "a lowland"], "A mountain rises high above the land around it."],
  ["Which region of Canada would you visit to see the Canadian Shield’s thousands of lakes?", "central Canada, from Labrador to the Northwest Territories", ["only the Atlantic coast", "only the Arctic islands", "only British Columbia"], "The Shield is very large and curves around Hudson Bay.", true],
];

const EXPLORERS: Q[] = [
  ["What is an explorer?", "a person who travels to discover new places, things or ideas", ["a person who sells maps", "a person who builds boats only", "a person who stays home"], "Explorers can travel across land, over oceans, into space or into new ideas."],
  ["Why did European explorers sail to North America?", "to find new trade routes, lands and riches", ["to find a place to hide from the sun", "to meet a king in Africa", "to plant gardens"], "Many hoped to find a sea route to Asia."],
  ["Who explored the Atlantic region long before Europeans arrived?", "Wabanaki Peoples", ["Spanish soldiers", "Dutch traders", "Roman sailors"], "Wabanaki Peoples have known the land and waters for thousands of years."],
  ["Who were the Vikings?", "sailors from Scandinavia who reached North America about a thousand years ago", ["French settlers in 1600", "British soldiers in 1800", "Spanish traders in 1500"], "A Viking site is at L’Anse aux Meadows in Newfoundland."],
  ["Where is the Viking site at L’Anse aux Meadows?", "Newfoundland", ["New Brunswick", "Manitoba", "Yukon"], "It is a World Heritage Site."],
  ["Which explorer sailed for England and reached the Atlantic coast of North America in 1497?", "John Cabot", ["Jacques Cartier", "Samuel de Champlain", "Henry Hudson"], "Cabot’s voyage helped England claim land in North America."],
  ["Which explorer claimed land at Gaspé for France in 1534?", "Jacques Cartier", ["John Cabot", "Neil Armstrong", "Roald Amundsen"], "Cartier then explored the St. Lawrence River."],
  ["Which explorer built a settlement on St. Croix Island in 1604?", "Samuel de Champlain", ["Jacques Cartier", "John Cabot", "Henry Hudson"], "The island is in the St. Croix River, on the border of New Brunswick and Maine."],
  ["Champlain founded Quebec City in…", "1608", ["1408", "1708", "1908"], "Quebec City was the first lasting French settlement on the St. Lawrence."],
  ["Which explorer sailed into the bay that was later named after him in 1610?", "Henry Hudson", ["John Cabot", "Jacques Cartier", "Roberta Bondar"], "Hudson Bay is named for him."],
  ["Who was the first person to walk on the Moon?", "Neil Armstrong", ["Marc Garneau", "Chris Hadfield", "Roberta Bondar"], "He stepped onto the Moon in 1969."],
  ["Who was the first Canadian in space?", "Marc Garneau", ["Neil Armstrong", "Buzz Aldrin", "Yuri Gagarin"], "He flew on the space shuttle in 1984."],
  ["Who was the first Canadian woman in space?", "Roberta Bondar", ["Julie Payette", "Marc Garneau", "Sally Ride"], "She flew in 1992 and studied how space affects the body."],
  ["Which Canadian astronaut played guitar on the International Space Station and shared photos with the world?", "Chris Hadfield", ["Neil Armstrong", "Marc Garneau", "Roberta Bondar"], "He commanded the station in 2013.", true],
  ["What is Canadarm?", "a robotic arm used in space", ["a type of boat", "a kind of tent", "a fishing tool"], "Canada built the arm to move things on the space shuttle and the space station."],
  ["Which kind of exploration looks for answers with experiments and new ideas?", "exploring ideas", ["exploring oceans", "exploring mountains", "exploring deserts"], "Inventors and scientists explore ideas."],
  ["Who invented the telephone, which he worked on in Canada and the United States?", "Alexander Graham Bell", ["Samuel de Champlain", "John Cabot", "Henry Hudson"], "Bell’s first successful phone call was in 1876."],
  ["Who discovered insulin, helping people with diabetes?", "Frederick Banting and his team", ["Alexander Graham Bell", "Jacques Cartier", "Henry Hudson"], "Banting was a Canadian doctor who worked on insulin in 1921.", true],
  ["What is a discovery?", "finding or learning something for the first time", ["breaking a rule", "painting a picture", "building a bridge"], "Explorers make discoveries."],
  ["Which of these is a primary source about an explorer?", "a diary the explorer wrote", ["a movie about the explorer", "a textbook written today", "a poster made last week"], "A primary source comes from the time of the event."],
  ["Which of these is a secondary source about an explorer?", "a book written years later", ["a map the explorer drew", "a ship’s log", "a letter from the explorer"], "A secondary source is made later."],
  ["How did European exploration affect Indigenous Peoples?", "It brought new diseases and took lands and ways of life", ["It had no effect at all", "It made everything easier", "It ended all trade"], "Many people suffered from diseases and from losing control of land."],
  ["What was one good result for some people from the meeting of cultures?", "sharing knowledge, tools and trade goods", ["fewer languages", "more fighting only", "closed borders"], "Trade and knowledge were shared, but not always fairly.", true],
  ["Why are the ideas of Indigenous Peoples important when we learn about exploration?", "They give us the other side of the story", ["They are not important", "They were written by explorers", "They are only about weather"], "Hearing many voices gives us a fairer history.", true],
  ["Which of these is a criterion for deciding if a discovery was significant?", "it changed the way many people live", ["it was found on a Tuesday", "it was made by someone famous", "it was in a book"], "We can ask: how big was the change? Who did it help?"],
  ["Which discovery changed communication forever?", "the telephone", ["the paper clip", "the umbrella", "the pencil sharpener"], "People could speak to each other from far away."],
  ["Which Canadian-made tool helps astronauts work in space?", "Canadarm2", ["a snow shovel", "a canoe paddle", "a hockey stick"], "Canadarm2 is on the International Space Station.", true],
  ["Mi’kmaq, Wolastoqiyik and Peskotomuhkatiyik met European explorers…", "as the people already living here", ["as visitors from Europe", "as explorers from the sea", "as people who had just arrived"], "Explorers met Nations whose homelands they had come to."],
];

export const wabanakiLands = bankUnit({
  id: "nb-wabanaki-lands-4",
  title: "Wabanaki Lands & Waters",
  emoji: "🛶",
  blurb: "Mi’kma’ki, the Wolastoq and Peskotomuhkati lands.",
  parentNote:
    "Practises the districts of Mi’kma’ki and the traditional territories of the Wolastoqiyik and Peskotomuhkatiyik, and Wabanaki Peoples’ relationships with the natural environment. The content is light, in the present tense, and needs review by Wabanaki partners.",
  standards: ["Geography: Places and Regions, Wabanaki: Identity", "the districts of Mi’kma’ki, Wolastoqiyik and Peskotomuhkatiyik territory, and Wabanaki relationships with the land"],
  items: LANDS,
});

export const physicalRegions = bankUnit({
  id: "nb-physical-regions-4",
  title: "Canada’s Landform Regions",
  emoji: "🏔️",
  blurb: "Seven regions and the world’s big features.",
  parentNote:
    "Practises Canada's seven physiographic regions, including the Appalachian Region where New Brunswick sits, and the major physical features of the world. It follows the Grade 4 social studies skill descriptors on places and regions in the New Brunswick curriculum.",
  standards: ["Geography: Places and Regions", "the importance of major physical features of the world and Canada's seven physiographic regions"],
  items: REGIONS,
});

export const exploration = bankUnit({
  id: "nb-exploration-4",
  title: "Explorers & Discoveries",
  emoji: "🧭",
  blurb: "Explorers of land, ocean, space and ideas.",
  parentNote:
    "Practises the stories of explorers of land, ocean, space and ideas, how to use primary and secondary sources, and the impact of European exploration. It follows the Grade 4 social studies skill descriptors on history in the New Brunswick curriculum.",
  standards: ["History: Events and Peoples, History: Sources and Methods", "the stories of explorers, evidence from sources, and the impact of European exploration over time"],
  items: EXPLORERS,
});
