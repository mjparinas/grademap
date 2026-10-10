import type { SortSet } from "../bank";
import { pick, sample, shuffle, textChoice } from "../random";
import type { Question, Unit, Visual } from "../types";
import { bankUnit, hq, q, type Item } from "./g3-4-kit";
import { on } from "./kit";

// Ontario Grade 4 Social Studies (2023): Early Societies to 1500 CE, and Political and Physical
// Regions of Canada. The First Nation (Haudenosaunee) and Inuit societies are described as living
// peoples. Deeper Indigenous content (ceremony, spiritual life, Elders' teachings) is not written
// here and needs review with First Nations, Métis and Inuit partners.

// ---------- Early societies ----------

const SOCIETY_SORT: SortSet = {
  prompt: "Which early society is it? Tap an item, then tap its basket.",
  hint: "Ancient Egypt grew along the Nile and had pharaohs. The Haudenosaunee have lived around the lower Great Lakes and have longhouses. Inuit live in the Arctic and hunt on land and sea ice.",
  bins: [
    { id: "egypt", label: "ancient Egypt", emoji: "🏺" },
    { id: "haud", label: "Haudenosaunee", emoji: "🌽" },
    { id: "inuit", label: "Inuit", emoji: "❄️" },
  ],
  items: [
    { label: "ruled by a pharaoh", emoji: "👑", bin: "egypt" },
    { label: "farming along the Nile", emoji: "🌾", bin: "egypt" },
    { label: "living in longhouses", emoji: "🏘️", bin: "haud" },
    { label: "the Great Law of Peace", emoji: "🕊️", bin: "haud" },
    { label: "hunting seals at the sea ice", emoji: "🦭", bin: "inuit" },
    { label: "travelling in a qajaq (kayak)", emoji: "🛶", bin: "inuit" },
  ],
};

const EARLY: Item[] = [
  q("Where did ancient Egyptian civilization grow up?", "along the Nile River", ["on the Arctic coast", "in the Rocky Mountains", "on the Prairies"], "The Nile's yearly floods left rich soil for farming in a desert land.", "🏺"),
  q("Who ruled ancient Egypt?", "a pharaoh", ["a mayor", "a prime minister", "a clan mother"], "The pharaoh was king and was thought to be very powerful.", "👑"),
  q("In ancient Athens, who could vote in the assembly?", "free adult male citizens", ["all children", "all women", "everyone who lived there, including enslaved people"], "Athens had an early kind of democracy, but many people could not take part.", "🏛️"),
  q("What is a democracy?", "a way of governing where citizens have a say", ["rule by one king only", "rule by an army", "rule by no one"], "In Athens, citizens voted on laws.", "🗳️"),
  q("In medieval Europe, a king gave land to nobles, and nobles had peasants work it. This system is called…", "feudalism", ["democracy", "a republic", "a clan system"], "In feudalism, land was exchanged for loyalty and service.", "🏰"),
  q("Who were serfs in medieval Europe?", "peasants who worked the lord's land and could not leave", ["knights who owned castles", "kings", "traders who sailed"], "Serfs belonged to the land they worked.", "🌾"),
  q("The Haudenosaunee Confederacy is made up of…", "six nations", ["two nations", "twelve nations", "one nation"], "Mohawk, Oneida, Onondaga, Cayuga, Seneca and Tuscarora.", "🌳"),
  q("In Haudenosaunee society, descent is traced through…", "the mother's family (clan)", ["the father's family only", "the oldest child", "the richest person"], "Haudenosaunee society is matrilineal, and clan mothers have an important role.", "👩"),
  q("What is the Great Law of Peace?", "the Haudenosaunee system of government and unity among nations", ["a law about farming only", "a Greek playground", "a Roman road"], "It is still important to Haudenosaunee people today.", "🕊️"),
  q("Inuit homelands are in…", "the Arctic", ["the desert", "the tropical rainforest", "the Prairies"], "Inuit have lived in the Arctic for a very long time, and live there today.", "❄️"),
  q("The Maya of Mesoamerica built…", "large cities with stepped pyramids", ["igloos", "log cabins", "castles with moats"], "Maya cities like Tikal had tall stone temples.", "🛕"),
  q("The Mali Empire in West Africa was famous for…", "its gold trade and centres of learning like Timbuktu", ["ice fishing", "building pyramids on the Nile", "the Great Wall"], "Mansa Musa, a ruler of Mali, was known for his wealth.", "👑"),
  q("In Rome's Republic, a senator was…", "an important leader who helped make laws", ["a farmer", "a gladiator", "an enslaved worker"], "The Senate was a council of powerful Romans.", "🏛️"),
  q("In many early societies, people were divided into groups with different rights and jobs. This is called…", "social organization", ["geography", "weather", "map making"], "Rulers, nobles, farmers and enslaved people all had different roles.", "👥"),
  q("Which of these societies lived in the Americas before 1500?", "the Maya and the Haudenosaunee", ["the Romans", "the Egyptians", "the Greeks"], "Many Indigenous societies lived in the Americas for thousands of years.", "🌎"),
  q("What did the ancient Egyptians use to write on?", "papyrus, made from a river plant", ["plastic sheets", "paper from trees", "computer screens"], "Papyrus grew along the Nile and was pressed into sheets.", "📜"),
  q("Where is the Mali Empire found on a map today?", "in West Africa", ["in the Arctic", "in South America", "in northern Europe"], "Mali was in West Africa, near the Niger River.", "🌍"),
  q("In ancient Rome, what was the Colosseum used for?", "public shows and games", ["growing wheat", "storing grain only", "ruling the Senate"], "It was a large stadium where crowds gathered.", "🏟️"),
  q("In the Haudenosaunee Confederacy, who chooses the chiefs?", "clan mothers", ["the pharaoh", "the Roman Senate", "kings of Europe"], "Clan mothers have an important role in choosing leaders.", "👩"),
  q("Ancient Greece was made up of many…", "independent city-states", ["small countries with one king", "farms with no towns", "empires ruled by one pharaoh"], "Athens and Sparta were separate city-states.", "🏛️"),
  q("What is a historian?", "someone who studies the past", ["someone who predicts the weather", "someone who builds boats", "someone who draws maps only"], "Historians use evidence to learn about long ago.", "🔍"),
  q("About how long ago did the pyramids of Giza get built?", "more than 4000 years ago", ["about 100 years ago", "about 500 years ago", "about 2 years ago"], "They were built by ancient Egyptians for pharaohs.", "🔺"),
  q("What was a castle in medieval Europe mainly used for?", "to protect and house a lord and his people", ["to grow food on the roof", "to give classes", "to launch boats"], "Castles were built with thick walls.", "🏰"),
  hq("Why can it be misleading to say 'ancient' societies are all in the past?", "some, like the Haudenosaunee and Inuit, are living peoples today", ["because none of them were real", "because all disappeared", "because history isn't real"], "Many Indigenous peoples are living, thriving communities.", "🪶"),
  hq("Egypt and feudal Europe both had classes. What is one difference?", "in Egypt the pharaoh was ruler of all, in feudal Europe power was shared among a king and nobles", ["Egypt had no rulers", "Europe had no farmers", "Egypt had no farmers"], "Different systems of power.", "⚖️"),
  hq("Athens is called an early democracy, but it was limited. Why?", "women, enslaved people and non-citizens could not vote", ["no one could vote", "all children could vote", "only kings voted"], "Democracy then was not like today.", "🗳️"),
  hq("Why do historians study where an early society was located?", "the land and climate shaped how people lived", ["location doesn't matter", "it tells them the year", "it tells them the colour of the sky"], "Environment shapes ways of life.", "🗺️"),
];

// ---------- Daily life ----------

const DAILY_SORT: SortSet = {
  prompt: "Which early society is this part of daily life from? Tap an item, then tap its basket.",
  hint: "Longhouses are Haudenosaunee homes. Tents, snow houses and sod houses are Inuit homes. Mud-brick houses were common in ancient Egypt.",
  bins: [
    { id: "haud", label: "Haudenosaunee", emoji: "🌽" },
    { id: "inuit", label: "Inuit", emoji: "❄️" },
    { id: "egypt", label: "ancient Egypt", emoji: "🏺" },
  ],
  items: [
    { label: "a longhouse covered in bark", emoji: "🏘️", bin: "haud" },
    { label: "corn, beans and squash", emoji: "🌽", bin: "haud" },
    { label: "a snow house in winter", emoji: "🧊", bin: "inuit" },
    { label: "clothing made of caribou and sealskin", emoji: "🧥", bin: "inuit" },
    { label: "a mud-brick house", emoji: "🧱", bin: "egypt" },
    { label: "bread and onions with fish from the Nile", emoji: "🍞", bin: "egypt" },
  ],
};

const DAILY: Item[] = [
  q("Most children in early societies learned skills by…", "watching and helping adults", ["watching videos", "using computers", "reading online"], "There were few schools, and children often learned from their families.", "👧"),
  q("In ancient Egypt, a scribe was someone who…", "could read and write", ["built boats", "baked bread", "ruled the land"], "Scribes learned for many years and held respected jobs.", "📜"),
  q("Which job in ancient Rome had the most power?", "senator", ["enslaved worker", "farmer", "shopkeeper"], "Senators were wealthy leaders.", "🏛️"),
  q("In medieval Europe, the children of peasants usually…", "worked on the farm with their families", ["went to a castle school", "wore silk and jewels", "ruled a village"], "Most children did not go to school.", "🌾"),
  q("A noble in medieval Europe often lived in…", "a castle or large manor house", ["a snow house", "a longhouse", "a tent"], "Nobles had stone homes with servants.", "🏰"),
  q("Haudenosaunee longhouses were large homes that sheltered…", "several related families", ["only one person", "animals only", "tools only"], "A longhouse was built from a wooden frame covered with bark.", "🏘️"),
  q("What are the Three Sisters in Haudenosaunee farming?", "corn, beans and squash", ["fish, deer and berries", "wheat, oats and rye", "apples, pears and plums"], "They are grown together and support each other.", "🌽"),
  q("Inuit traditionally hunted, among other animals…", "seals and caribou", ["camels", "elephants", "kangaroos"], "Food came from the land, ice and sea.", "🦭"),
  q("Why did many Inuit wear clothing made from caribou and sealskin?", "it kept them warm and dry in the Arctic cold", ["it was fashionable in Rome", "it was cheap in Egypt", "it was light for hot weather"], "People used what the land gave them.", "🧥"),
  q("In ancient Greece, boys from wealthy families often went to school, while girls usually…", "learned skills at home", ["went to a bigger school", "ruled the city", "voted"], "Girls usually learned household skills.", "🏺"),
  q("A child in an early society probably had more chores than a child today. Why?", "families needed everyone's help to get food and keep the home going", ["there were no chores", "chores were against the law", "children were not allowed to help"], "Work was shared in the family.", "🧺"),
  q("Which of these was part of daily life for a Greek or Roman child?", "playing with a ball or knucklebones", ["playing video games", "riding a school bus", "using a phone"], "Children had games too.", "⚽"),
  q("Inuit children learn from their families and Elders. This is true…", "in the past and today", ["only in the past", "never", "only in cities"], "Inuit knowledge is shared across generations.", "👵"),
  q("Which food was a main part of the diet of ancient Egyptians?", "bread", ["maple syrup", "seal meat", "pizza"], "Bread and onions were common.", "🍞"),
  hq("Which is a similarity between children's lives in early societies and now?", "they play games and learn from adults", ["they all went to the same school", "they had phones", "they travelled by plane"], "Children everywhere have played and learned from family.", "🎲"),
  hq("Why were the lives of a noble and a peasant so different in medieval Europe?", "their rank decided their rights, work and home", ["they lived in the same house", "they had no differences", "they had no work"], "Social class decided much of daily life.", "👑"),
  hq("Which does NOT match daily life in the Arctic long ago?", "growing wheat in big fields", ["hunting seals", "building snow houses", "using dog teams"], "The Arctic climate is too cold and the growing season too short for wheat.", "🌾"),
  q("What did ancient Roman children often use to play a game?", "knucklebones or small stones", ["tablet games", "trading cards", "video consoles"], "Children played simple games with objects they could find.", "🎲"),
  q("In ancient Egypt, most people were…", "farmers", ["knights", "pirates", "ship captains"], "Farmers fed the kingdom with crops grown near the Nile.", "🌾"),
  q("How did most food reach a medieval peasant family?", "they grew it on the land they worked", ["they bought it in a supermarket", "it was delivered by trucks", "they ordered it by phone"], "Most people farmed.", "🌾"),
  q("Which clothing would an Inuit family in the past most likely wear in winter?", "warm clothes made from animal skins and fur", ["thin cotton shirts", "silk robes", "linen togas"], "Warm clothing was essential in the Arctic cold.", "🧥"),
  q("Which of these is something both children long ago and children today do?", "play games with friends", ["use smartphones", "ride school buses", "watch cartoons"], "Play is part of childhood in every time.", "🧒"),
  q("In Haudenosaunee villages, who often helped care for the Three Sisters gardens?", "many families working together", ["only the king", "only travelling traders", "nobody"], "Gardening was shared work in the community.", "🌽"),
  q("What was a Roman toga?", "a long piece of cloth worn as a garment", ["a kind of boat", "a soldier's shield", "a loaf of bread"], "Roman citizens wore togas for special occasions.", "👘"),
  hq("An enslaved person in ancient Rome differed from a senator because the enslaved person…", "was not free and had no say in their work", ["could vote", "made the laws", "owned many slaves"], "Slavery meant being owned by another person.", "⛓️"),
];

// ---------- Environment and ways of life ----------

const MATERIAL_SORT: SortSet = {
  prompt: "Which society used this material to build homes? Tap an item, then tap its basket.",
  hint: "Elm bark covered Haudenosaunee longhouses. Snow blocks and sod were used for Inuit homes. Mud bricks were used in Egypt.",
  bins: [
    { id: "haud", label: "Haudenosaunee", emoji: "🌳" },
    { id: "inuit", label: "Inuit", emoji: "❄️" },
    { id: "egypt", label: "ancient Egypt", emoji: "🏺" },
  ],
  items: [
    { label: "elm bark sheets", emoji: "🪵", bin: "haud" },
    { label: "bent young trees as a frame", emoji: "🌳", bin: "haud" },
    { label: "blocks of snow", emoji: "🧊", bin: "inuit" },
    { label: "sod and stone", emoji: "🪨", bin: "inuit" },
    { label: "mud bricks dried in the sun", emoji: "🧱", bin: "egypt" },
    { label: "reeds and palm wood", emoji: "🌴", bin: "egypt" },
  ],
};

const ENVIRONMENT: Item[] = [
  q("Why did ancient Egyptians farm near the Nile?", "its yearly floods left rich soil in a dry land", ["it never flooded", "it was snowy and frozen", "it was far from any water"], "The Nile gave water and fertile soil.", "🌊"),
  q("The mountains of Greece made it hard to travel by land. What did many Greeks do?", "sail and trade by sea", ["move to the Arctic", "farm on the Prairies", "dig canals through the mountains"], "The sea connected the Greek city-states.", "⛵"),
  q("Many Inuit communities followed the seasons, moving to hunt different animals. Why?", "animals were found in different places at different times of year", ["they didn't like staying in one place", "the Sun told them to", "it was a game"], "Seasonal rhythms shaped Inuit life.", "🗓️"),
  q("The Haudenosaunee used the forests for…", "wood and bark for homes, and for hunting", ["growing wheat only", "mining gold", "building pyramids"], "The forest supplied materials.", "🌲"),
  q("The Haudenosaunee grow corn, beans and squash. These crops grow best in…", "fertile soil with warm summers", ["ice", "desert sand", "the ocean"], "The Great Lakes region has good farmland.", "🌽"),
  q("Why is farming almost impossible in the Arctic?", "the ground is frozen and the summers are short", ["it is too hot", "it rains every day", "there is too much soil"], "The Arctic climate shapes how people live.", "❄️"),
  q("The Sahara desert was crossed by traders in the Mali Empire. They carried…", "gold and salt", ["ice and snow", "maple syrup", "fish only"], "Gold from the south, and salt from the Sahara, were traded.", "🐪"),
  q("Why did the Maya grow corn?", "it grew well in their warm, rainy land and fed many people", ["it grew on snow", "it needed no water", "they had no other food"], "Corn was a key food.", "🌽"),
  q("Egyptian farmers planted crops after the Nile's flood receded. Why?", "the soil was rich and wet", ["the soil was frozen", "the soil had washed away entirely", "they didn't plant at all"], "The flood deposited silt.", "🌾"),
  q("What does 'relationship with the environment' mean for an early society?", "how people lived with the land, water and animals around them", ["only the weather", "a map's scale", "the date"], "People depended on their surroundings.", "🌿"),
  q("An Inuit hunter waits at a breathing hole in the sea ice. This is an example of…", "using knowledge of animals and the environment to get food", ["a game", "a ceremony", "a school test"], "Hunting skills are passed on by experienced hunters.", "🦭"),
  q("Why were many early cities built near rivers?", "water for drinking, farming and travel", ["rivers keep people far away", "rivers are always warm", "rivers have no fish"], "Rivers supported food and trade.", "🏙️"),
  hq("Egyptian farmers depended on the Nile's flood. What might happen in a year with no flood?", "crops might fail and people could go hungry", ["there would be more food", "nothing would change", "the Nile would turn to ice"], "Their way of life depended on the river.", "🏜️"),
  hq("Many Indigenous peoples take only what they need from the land. Why is this important?", "so the land and animals stay healthy for the future", ["because they have no tools", "because the land is useless", "to save money"], "This is stewardship.", "🌱"),
  hq("The Inuit made tools and clothing from animals. How does this show their relationship with the environment?", "they used what the land and sea provided", ["they ignored the land", "they bought everything", "they avoided animals"], "Knowledge of the environment guided their lives.", "🧵"),
  hq("The Maya built terraces and used rainfall and rivers for farming. This shows that…", "people adapted farming to their environment", ["people could not farm", "rain was never helpful", "farms were underwater"], "Adapting to the land helps people meet their needs.", "🌽"),
  hq("Both ancient Egypt and the Haudenosaunee relied on farming. What does this tell us?", "farming helped many societies stay in one place", ["only hunters could settle", "farming was impossible", "farmers never traded"], "Farming provides a steady food supply.", "🌾"),
  hq("Why are an Arctic community's winter and summer homes different?", "the seasons and the animals they hunt change", ["they like variety only", "they must hide from the Sun", "they move to cities"], "Homes fit the season.", "🏠"),
  q("Why were mountains an obstacle for people in Greece?", "they made travel and farming on steep land harder", ["they made the land flat", "they made the climate hot", "they filled the land with rivers"], "Mountains separate valleys.", "⛰️"),
  q("How did ancient Egyptians use the Nile to travel?", "by boat", ["by airplane", "by train", "by bus"], "The river was like a highway.", "⛵"),
  q("Which animal helped traders cross the Sahara desert?", "camels", ["polar bears", "reindeer", "seals"], "Camels can go a long time without water.", "🐪"),
  q("The Haudenosaunee collected maple sap in spring. What does this show?", "people used plants and trees for food", ["they never used trees", "maple trees do not exist", "they bought syrup"], "Seasons shape what people gather.", "🍁"),
  q("Why do Arctic people use dog teams or sleds in winter?", "to travel across snow and ice", ["to cross deserts", "to climb palm trees", "to sail on rivers"], "Snow and ice make sleds a good choice.", "🛷"),
  q("A society near a lake or sea could get food by…", "fishing", ["farming in ice", "mining in sand", "hunting in the sky"], "Water supplied fish and other food.", "🎣"),
  q("Why did many societies set up villages near forests?", "for wood to build homes and burn for fire", ["forests keep people cold", "forests have no resources", "forests are always flooded"], "Trees were useful for many needs.", "🌲"),
];

// ---------- How societies were governed ----------

const GOV_SORT: SortSet = {
  prompt: "Which was a reason for cooperation, and which led to conflict? Tap an item, then tap its basket.",
  hint: "Trade, shared decisions and treaties help people cooperate. Fights over land, resources and power can lead to conflict.",
  bins: [
    { id: "coop", label: "cooperation", emoji: "🤝" },
    { id: "conflict", label: "conflict", emoji: "⚔️" },
  ],
  items: [
    { label: "trading goods along a river", emoji: "🛶", bin: "coop" },
    { label: "voting together on a law", emoji: "🗳️", bin: "coop" },
    { label: "nations agreeing to keep peace", emoji: "🕊️", bin: "coop" },
    { label: "sharing knowledge of the land", emoji: "🗺️", bin: "coop" },
    { label: "fighting over farmland", emoji: "⚔️", bin: "conflict" },
    { label: "an empire taking more territory", emoji: "🏛️", bin: "conflict" },
    { label: "rivals competing for resources", emoji: "💰", bin: "conflict" },
    { label: "kings and nobles quarrelling over power", emoji: "👑", bin: "conflict" },
  ],
};

const GOVERN: Item[] = [
  q("In ancient Egypt, who made the main decisions?", "the pharaoh", ["the voters", "a club of students", "the nobles alone"], "The pharaoh had the most power.", "👑"),
  q("In Athens, citizens voted in an assembly. This is a kind of…", "direct democracy", ["feudalism", "empire", "monarchy"], "Citizens spoke and voted themselves.", "🗳️"),
  q("The Haudenosaunee Grand Council makes decisions by…", "talking until the nations reach agreement", ["one ruler's order", "flipping a coin", "a duel"], "Decisions are made by discussion and agreement.", "🕊️"),
  q("In Haudenosaunee society, clan mothers…", "choose the chiefs and can remove them", ["lead armies", "farm all the land", "build boats"], "Women have an important role in leadership.", "👩"),
  q("What was the Great Law of Peace meant to do?", "unite nations and end fighting among them", ["start a war", "build a wall", "make trade harder"], "It set out how nations would cooperate.", "🕊️"),
  q("In medieval Europe, a king relied on nobles who gave him…", "soldiers and loyalty", ["votes from every citizen", "free schools", "snowmobiles"], "Nobles promised to serve the king.", "⚔️"),
  q("The Magna Carta (1215) was an agreement that…", "limited the king's power", ["made the king a god", "ended all laws", "gave everyone a vote"], "It said even the king had to follow the law.", "📜"),
  q("Roman roads helped the empire by…", "letting armies and traders travel quickly", ["blocking trade", "preventing travel", "making deserts"], "Roads connected the empire.", "🛣️"),
  q("In many Inuit camps, decisions were made…", "by talking together and listening to experienced people", ["by a king far away", "by flipping coins", "by a ruler in a castle"], "Elders and skilled hunters were respected. Communities make decisions together today.", "🧓"),
  q("Mansa Musa ruled the Mali Empire. A 'mansa' was a…", "ruler", ["farmer", "boat", "tool"], "Mansa is a title for a king or emperor.", "👑"),
  q("Why might a city-state go to war with another?", "to gain land or resources", ["to share all its crops", "to make friends", "to take a holiday"], "Competition over land and wealth caused conflict.", "⚔️"),
  q("How could two societies avoid conflict?", "by trading and making agreements", ["by sailing away", "by burning crops", "by hiding"], "Peaceful agreements help.", "🤝"),
  hq("Why was Athenian democracy different from democracy in Canada today?", "only some adult men could vote", ["there was no voting", "children voted", "everyone could vote"], "Canada's democracy lets all adult citizens vote.", "🗳️"),
  hq("The Haudenosaunee Confederacy formed hundreds of years before Canada did. This shows that…", "Indigenous nations had their own governments long ago", ["they had no government", "they only followed European laws", "governments are new"], "Indigenous nations have long had their own systems of government.", "🌳"),
  hq("In a feudal system, why might a peasant have little say in the government?", "power was held by the king and nobles", ["peasants led the government", "everyone voted", "there was no government"], "Rank decided power.", "🏰"),
  hq("Why were wampum belts important in Haudenosaunee government?", "they helped record agreements and laws", ["they were money in stores", "they were clothing only", "they told jokes"], "They are a record of promises.", "📿"),
  hq("An empire controls many lands and peoples. Why can that be a source of conflict?", "conquered peoples may want to rule themselves", ["everyone is always happy", "there are no differences", "empires don't have borders"], "Control by force often leads to resistance.", "🏛️"),
  hq("Which is an attempt to deal with conflict by sharing power?", "the Great Law of Peace", ["a siege", "a raid", "a battle"], "It's a peace agreement and system of government.", "🕊️"),
];

// ---------- Inventions and evidence ----------

const EVIDENCE_SORT: SortSet = {
  prompt: "Is it a primary source (from the time) or a secondary source (about the time)? Tap an item, then tap its basket.",
  hint: "A primary source was made by someone who was there, or at that time. A secondary source was made later.",
  bins: [
    { id: "primary", label: "primary source", emoji: "🏺" },
    { id: "secondary", label: "secondary source", emoji: "📘" },
  ],
  items: [
    { label: "a clay pot from ancient Greece", emoji: "🏺", bin: "primary" },
    { label: "a carving made by an Inuit artist long ago", emoji: "🪨", bin: "primary" },
    { label: "a mosaic from a Roman house", emoji: "🧩", bin: "primary" },
    { label: "a hieroglyph on a temple wall", emoji: "🔤", bin: "primary" },
    { label: "a textbook written this year", emoji: "📘", bin: "secondary" },
    { label: "a documentary about Egypt", emoji: "🎬", bin: "secondary" },
    { label: "a website about the Maya", emoji: "💻", bin: "secondary" },
    { label: "a museum guide book", emoji: "📚", bin: "secondary" },
  ],
};

const INVENTIONS: Item[] = [
  q("What did the ancient Egyptians write on?", "papyrus", ["paper made from trees in Canada", "plastic", "glass"], "Papyrus was made from a reed that grows along the Nile.", "📜"),
  q("What are hieroglyphs?", "an ancient Egyptian system of picture writing", ["a kind of food", "a Roman road", "an Inuit boat"], "Egyptians carved and painted hieroglyphs on walls.", "🔤"),
  q("The Maya made a calendar to…", "track days, seasons and important events", ["catch fish", "build roads", "cook bread"], "Their calendars were very exact.", "🗓️"),
  q("Which invention helped medieval Europe spread books quickly?", "the printing press", ["the telephone", "the airplane", "the computer"], "Gutenberg's press was developed in the 1400s.", "🖨️"),
  q("Roman aqueducts carried…", "water to cities", ["armies", "gold", "snow"], "Aqueducts were bridges and channels for water.", "💧"),
  q("An Inuit qajaq (kayak) is a boat used for…", "hunting and travelling on the water", ["flying", "farming", "digging"], "Qajaqs are light, narrow boats.", "🛶"),
  q("A qamutiik is an Inuit…", "sled", ["boat", "house", "tool for cooking"], "It is pulled over snow and ice, traditionally by dogs.", "🛷"),
  q("A qulliq is an Inuit stone lamp that burned oil. What did it give?", "light and heat", ["sound", "cold air", "water"], "It lit and warmed the home.", "🪔"),
  q("The Haudenosaunee developed a way of planting corn, beans and squash together. This is an example of a…", "farming technology", ["war machine", "boat", "musical instrument"], "People developed methods to grow food.", "🌽"),
  q("The Maya used a number system with the idea of zero. Why was this important?", "it made big numbers and maths easier", ["it stopped time", "it was only for games", "it made food"], "Zero helps with counting and recording.", "0️⃣"),
  q("Timbuktu in the Mali Empire was known for…", "its libraries, schools and scholars", ["its pyramids", "its ice houses", "its castles"], "Scholars came from far away to study there.", "📚"),
  q("A mosaic is a picture made from…", "tiny pieces of tile or stone", ["paint only", "clay only", "ink only"], "Roman mosaics decorated floors.", "🧩"),
  q("What is an artifact?", "an object made by people long ago", ["a plant", "an animal", "a natural rock"], "Artifacts help us learn about the past.", "🏺"),
  q("A painting on a Greek vase shows people racing. What can we learn from it?", "that sports were part of daily life", ["what the weather was like today", "how to bake bread", "what colour the sky is"], "Visual evidence tells us how people lived.", "🏺"),
  hq("Why is a primary source useful to historians?", "it comes from the time they are studying", ["it is the newest book", "it is always correct about everything", "it was made yesterday"], "Primary sources give direct evidence.", "🔍"),
  hq("Which is the best way to learn about Inuit life long ago?", "listen to Inuit Elders and study Inuit-made objects", ["guess", "only read one book", "ignore Inuit voices"], "Respect the people whose history it is.", "🧓"),
  hq("The printing press changed society by…", "making books cheaper and spreading ideas faster", ["stopping all reading", "making books disappear", "ending writing"], "Many more people could read.", "📖"),
  hq("The compass was invented in China long ago. How did it help travellers?", "it showed direction so they could find their way", ["it measured weight", "it told the time", "it made roads"], "Technology from one region spread to others.", "🧭"),
  hq("Which of these is a way early societies used technology to meet needs?", "building irrigation canals to bring water to crops", ["making video games", "building airplanes", "using cell phones"], "Irrigation let farmers grow food in dry land.", "💧"),
];

// ---------- Physical regions and human activity ----------

const REGION_SORT: SortSet = {
  prompt: "Which physical region is it? Tap an item, then tap its basket.",
  hint: "The Western Cordillera has mountains. The Interior Plains have flat farmland. The Canadian Shield is old rock with lakes and forest.",
  bins: [
    { id: "cordillera", label: "Western Cordillera", emoji: "🏔️" },
    { id: "plains", label: "Interior Plains", emoji: "🌾" },
    { id: "shield", label: "Canadian Shield", emoji: "🪨" },
  ],
  items: [
    { label: "the Rocky Mountains", emoji: "🏔️", bin: "cordillera" },
    { label: "skiing resorts like Whistler", emoji: "⛷️", bin: "cordillera" },
    { label: "wheat and canola fields", emoji: "🌾", bin: "plains" },
    { label: "cattle ranches and oil wells", emoji: "🐄", bin: "plains" },
    { label: "thousands of lakes and rocky ground", emoji: "🪨", bin: "shield" },
    { label: "mining for nickel and gold", emoji: "⛏️", bin: "shield" },
  ],
};

const PHYSICAL: Item[] = [
  q("Which physical region has the Rocky Mountains?", "the Western Cordillera", ["the Canadian Shield", "the Interior Plains", "the Appalachian region"], "Cordillera means a chain of mountains.", "🏔️"),
  q("Which region is flat, with farms that grow wheat and canola?", "the Interior Plains", ["the Western Cordillera", "the Canadian Shield", "the Arctic"], "The Prairies are part of this region.", "🌾"),
  q("Which region wraps around Hudson Bay like a horseshoe and is made of old rock?", "the Canadian Shield", ["the Interior Plains", "the Western Cordillera", "the Appalachian region"], "It is the largest physical region in Canada.", "🪨"),
  q("The Great Lakes–St. Lawrence Lowlands is home to…", "about half of all Canadians", ["almost no one", "only polar bears", "only farms"], "Big cities and good farmland share the region.", "🏙️"),
  q("In which direction from Ontario is the Western Cordillera?", "west", ["east", "south", "north"], "The Rocky Mountains are in the west of Canada.", "🧭"),
  q("What kind of climate does the Arctic region have?", "very cold, with short summers", ["hot and wet", "warm all year", "dry and hot"], "Tundra plants grow in the cold, dry Arctic.", "❄️"),
  q("Tundra is a kind of vegetation with…", "low plants and no trees", ["tall rainforest trees", "palm trees", "wheat fields"], "It is too cold for trees.", "🌿"),
  q("Boreal forest, with spruce and pine, grows across much of…", "central Canada", ["the Arctic coast only", "the deserts", "the ocean"], "It stretches in a wide band across the country.", "🌲"),
  q("Which region has mild, rainy winters on the Pacific coast?", "the west coast of British Columbia", ["Nunavut", "the Prairies", "the Arctic"], "The ocean keeps the coast mild.", "🌧️"),
  q("Farming in large fields is common in the…", "Interior Plains and the lowlands", ["Arctic", "mountain peaks", "the ocean"], "Flat land with good soil is ideal for crops.", "🚜"),
  q("Mining and smelting are common in the…", "Canadian Shield", ["Interior Plains", "Great Lakes", "the ocean"], "Valuable minerals are found in the old rock.", "⛏️"),
  q("Cattle ranching is common in the grassy foothills near the…", "Rocky Mountains", ["Arctic", "St. Lawrence River", "Hudson Bay"], "Grass fed on foothills and plains is good for cattle.", "🐄"),
  q("The Appalachian region is in…", "eastern Canada", ["western Canada", "the Arctic only", "the Prairies"], "It includes parts of Atlantic Canada and Quebec.", "⛰️"),
  q("Which region is close to the Great Lakes and has the most factories and cities?", "the Great Lakes–St. Lawrence Lowlands", ["the Arctic", "the Western Cordillera", "the Canadian Shield"], "Factories need workers, roads and shipping.", "🏭"),
  hq("Why are there few farms on the Canadian Shield?", "the soil is thin and rocky", ["the soil is too deep", "there is no rock", "there is too much sun"], "Rocky land is hard to farm.", "🪨"),
  hq("Why are tourists attracted to the Western Cordillera?", "the mountains offer hiking, skiing and views", ["the land is flat and hot", "there are no lakes", "it's far from everything"], "Natural features can support tourism.", "⛰️"),
  hq("The Interior Plains are good for farming. Why?", "flat land and fertile soil", ["steep slopes and rock", "ice and snow", "deep forest"], "Machines work well on flat land.", "🚜"),
  hq("Why might a region with a lot of water and forest develop forestry and hydroelectric power?", "trees and rivers are natural resources there", ["there are no resources", "it is a desert", "it is under the sea"], "Industries often grow where resources are.", "🌲"),
  hq("Which physical region would be hardest to build roads across?", "the Western Cordillera", ["the Interior Plains", "a flat lowland", "a prairie"], "Mountains are steep and rugged.", "🛣️"),
  q("Which region has the Great Lakes?", "the Great Lakes–St. Lawrence Lowlands and the Canadian Shield", ["the Western Cordillera", "the Arctic only", "the Interior Plains only"], "The lakes sit between the lowlands and the Shield.", "🌊"),
  q("Which physical region covers the north above the tree line?", "the Arctic", ["the Great Lakes–St. Lawrence Lowlands", "the Appalachian region", "the Interior Plains"], "The Arctic has tundra and cold winters.", "❄️"),
  q("Which region is known for wheat and canola farming?", "the Interior Plains", ["the Arctic", "the Canadian Shield", "the Appalachian region"], "Flat land and deep soil suit big farms.", "🌾"),
  q("What is a lowland?", "an area of low, flat land", ["a mountain peak", "a frozen sea", "an island"], "Low means closer to sea level.", "🏞️"),
  q("What is a plain?", "a large area of flat land", ["a steep cliff", "a frozen lake", "a rainforest"], "Plains are flat and good for farms.", "🌾"),
  q("Where in Canada would you find mostly tundra?", "the far north", ["the southwest coast", "the Great Lakes", "the Prairies"], "Tundra is cold with low plants.", "🌿"),
  q("Which activity is popular in the Western Cordillera in winter?", "skiing and snowboarding", ["growing wheat", "sailing on the Prairies", "riding camels"], "Snowy mountains attract visitors.", "⛷️"),
];

// ---------- Economic sectors ----------

const SECTOR_SORT: SortSet = {
  prompt: "Which economic sector is the job in? Tap an item, then tap its basket.",
  hint: "Primary: gathering resources. Secondary: making goods. Tertiary: providing services.",
  bins: [
    { id: "primary", label: "primary (resources)", emoji: "⛏️" },
    { id: "secondary", label: "secondary (making things)", emoji: "🏭" },
    { id: "tertiary", label: "tertiary (services)", emoji: "🛍️" },
  ],
  items: [
    { label: "wheat farmer", emoji: "🌾", bin: "primary" },
    { label: "miner", emoji: "⛏️", bin: "primary" },
    { label: "fisher", emoji: "🎣", bin: "primary" },
    { label: "car factory worker", emoji: "🚗", bin: "secondary" },
    { label: "baker making bread in a bakery factory", emoji: "🍞", bin: "secondary" },
    { label: "steel mill worker", emoji: "🏭", bin: "secondary" },
    { label: "nurse", emoji: "🩺", bin: "tertiary" },
    { label: "store clerk", emoji: "🛍️", bin: "tertiary" },
    { label: "bus driver", emoji: "🚌", bin: "tertiary" },
  ],
};

const SECTORS: Item[] = [
  q("The primary sector is based on…", "gathering natural resources", ["manufacturing", "services", "information"], "Farming, mining, fishing and forestry are primary jobs.", "⛏️"),
  q("The secondary sector is based on…", "making and processing goods", ["gathering resources", "providing services", "research only"], "Factories turn materials into products.", "🏭"),
  q("The tertiary sector is based on…", "providing services", ["gathering resources", "manufacturing", "farming"], "Teachers, doctors and shopkeepers are in the service sector.", "🛍️"),
  q("The quaternary sector is based on…", "information and knowledge, like research and technology", ["farming", "manufacturing", "mining"], "Software and research jobs are in this sector.", "💻"),
  q("A software developer works in the…", "quaternary sector", ["primary sector", "secondary sector", "tertiary sector only"], "Information work is quaternary.", "💻"),
  q("A fish plant worker who cleans and packs fish works in the…", "secondary sector", ["primary sector", "quaternary sector", "tertiary sector"], "Processing is secondary.", "🐟"),
  q("A farmer works in the…", "primary sector", ["secondary sector", "tertiary sector", "quaternary sector"], "Farming takes a resource from the land.", "🌾"),
  q("A hockey coach works in the…", "tertiary sector", ["primary sector", "secondary sector", "quaternary sector"], "Coaching is a service.", "🏒"),
  q("A sawmill turns logs into lumber. A sawmill worker is in the…", "secondary sector", ["primary sector", "tertiary sector", "quaternary sector"], "Making wood products is secondary.", "🪚"),
  q("Which job is part of the primary sector?", "a logger cutting trees", ["a teacher", "an accountant", "a chef"], "Primary jobs get resources from the land.", "🪓"),
  q("Which region is known for fishing, because of its ocean waters?", "Atlantic Canada", ["the Prairies", "the Yukon", "northern Ontario"], "The cold Atlantic waters have long supported fishing.", "🎣"),
  q("Alberta's oil sands are an example of…", "a primary-sector industry", ["a service business", "a tourism business only", "a school"], "Oil is taken from the ground.", "🛢️"),
  hq("Why do most of Canada's cars get made in southern Ontario?", "it has factories, workers and transportation links", ["it is a desert", "it has the most mines", "cars grow on trees there"], "Manufacturing needs workers and good transport.", "🚗"),
  hq("Why might a country that sells only resources worry?", "resource prices can rise and fall quickly", ["resources never run out", "everyone wants every resource", "nothing can change"], "Relying on one industry can be risky.", "📉"),
  hq("A maple syrup farm that bottles syrup combines which sectors?", "primary and secondary", ["secondary and quaternary only", "tertiary only", "none"], "Tapping trees is primary and bottling is secondary.", "🍁"),
  hq("The sale of syrup in a store is part of which sector?", "tertiary", ["primary", "secondary", "quaternary"], "Selling is a service.", "🛍️"),
  hq("An industry that uses natural resources depends on…", "the natural environment", ["only the weather forecast", "nothing", "video games"], "Primary industries depend on the land and water.", "🌲"),
];

// ---------- Industry and the environment ----------

const STEWARD_SORT: SortSet = {
  prompt: "Is it a way to harm the environment or a way to protect it? Tap an item, then tap its basket.",
  hint: "Reclaiming a mine, using solar panels and setting fishing limits protect the environment. Releasing waste and overfishing harm it.",
  bins: [
    { id: "protect", label: "protects", emoji: "💚" },
    { id: "harm", label: "harms", emoji: "⚠️" },
  ],
  items: [
    { label: "replanting trees after logging", emoji: "🌳", bin: "protect" },
    { label: "setting fishing limits", emoji: "🎣", bin: "protect" },
    { label: "putting solar panels on a roof", emoji: "☀️", bin: "protect" },
    { label: "cleaning up a mine site", emoji: "⛏️", bin: "protect" },
    { label: "releasing waste into a river", emoji: "🛢️", bin: "harm" },
    { label: "catching too many fish", emoji: "🐟", bin: "harm" },
    { label: "cutting all the trees and not replanting", emoji: "🪓", bin: "harm" },
    { label: "leaving toxic tailings uncovered", emoji: "☣️", bin: "harm" },
  ],
};

const INDUSTRY: Item[] = [
  q("What is sustainable use of resources?", "using them in a way that protects them for the future", ["using them up as fast as possible", "never using them", "selling them all"], "Sustainable means able to last.", "🌱"),
  q("Hydroelectric dams make electricity from…", "flowing water", ["burning coal", "the wind", "the Sun"], "Quebec makes most of its electricity this way.", "💧"),
  q("One effect of building a large dam is…", "flooding land upstream, which can affect habitats and communities", ["no effect on the land", "making the river dry", "creating a mountain range"], "Large dams change river landscapes.", "🌊"),
  q("What are mine tailings?", "waste material left after minerals are removed", ["a type of fish", "a kind of tree", "a tool for farming"], "Tailings must be stored carefully.", "⛏️"),
  q("Why do some fishing areas have limits on how many fish can be caught?", "so fish populations can recover", ["to make more boats", "to sell more fish", "to protect the dock"], "Overfishing can empty the sea.", "🎣"),
  q("Alberta's oil sands bring jobs but can also…", "harm land, water and air if not managed carefully", ["clean the air", "build forests", "stop the wind"], "Industry has costs and benefits.", "🛢️"),
  q("Wind farms make electricity from…", "moving air", ["flowing rivers", "burning wood", "coal"], "Wind turbines turn in the wind.", "🌬️"),
  q("Putting solar panels on a roof helps by…", "making electricity from sunlight without burning fuel", ["using more coal", "blocking the Sun", "making noise"], "Solar power is a clean source of energy.", "☀️"),
  q("A company plants new trees after logging a forest. This is…", "reforestation, one way of using forests sustainably", ["deforestation", "pollution", "mining"], "Planting trees helps forests recover.", "🌲"),
  q("Which action by a citizen helps the environment?", "recycling and using public transit", ["littering", "leaving lights on", "leaving taps running"], "Everyone can help.", "♻️"),
  q("Cattle ranching and farming on the Prairies can change the…", "native grassland habitat", ["ocean floor", "Arctic ice", "tides"], "Land use changes habitats.", "🌾"),
  q("A forest company and a nature group disagree about cutting trees. They have different…", "perspectives", ["colours", "coins", "countries"], "Each group values different things.", "👥"),
  q("How could a community balance new jobs with protecting nature?", "plan carefully and set rules for cleanup", ["ignore nature", "build wherever it wants", "close all jobs"], "Balance means thinking about people and nature.", "⚖️"),
  hq("Why is it important that people near a mine are part of decisions about it?", "the mine affects their land, water and lives", ["it doesn't affect them", "they don't care", "mines never change land"], "Many perspectives matter.", "👥"),
  hq("Reclaiming a mine means…", "restoring the land afterward so it can be used again", ["digging it deeper", "selling the mine", "leaving it bare"], "Reclamation is a major stewardship task.", "🌱"),
  hq("Why can overfishing hurt people as well as fish?", "fishing jobs and food can disappear", ["nothing happens to people", "more fish appear", "the sea dries up"], "The cod collapse in Newfoundland and Labrador cost many jobs.", "🐟"),
  hq("Industries and citizens both need to act for sustainability. Which is an example from citizens?", "choosing to walk, bike or take transit", ["building a bigger mine", "using more plastic", "cutting more trees"], "Citizens can also make a difference.", "🚲"),
  hq("A map shows where forests, mines and towns are. How can this help balance needs and stewardship?", "it shows where nature and industry overlap", ["it hides places", "it predicts the future", "it tells the time"], "Thematic maps can guide planning.", "🗺️"),
];

// ---------- Political regions and directions ----------

const POLITICAL_SORT: SortSet = {
  prompt: "Is it a province or a territory? Tap an item, then tap its basket.",
  hint: "Canada has 10 provinces and 3 territories. The territories are Yukon, the Northwest Territories and Nunavut.",
  bins: [
    { id: "prov", label: "province", emoji: "🏞️" },
    { id: "terr", label: "territory", emoji: "🧭" },
  ],
  items: [
    { label: "Ontario", emoji: "🍁", bin: "prov" },
    { label: "Manitoba", emoji: "🌾", bin: "prov" },
    { label: "Nova Scotia", emoji: "🦞", bin: "prov" },
    { label: "Alberta", emoji: "🏔️", bin: "prov" },
    { label: "Yukon", emoji: "⛏️", bin: "terr" },
    { label: "Nunavut", emoji: "❄️", bin: "terr" },
    { label: "Northwest Territories", emoji: "💎", bin: "terr" },
  ],
};

/** A 3 × 3 map; the question is about the corners around the centre. */
function compassQuestion(): Question {
  const features = sample(
    [
      ["campground", "⛺"],
      ["lake", "🌊"],
      ["school", "🏫"],
      ["hospital", "🏥"],
      ["airport", "✈️"],
      ["farm", "🚜"],
      ["museum", "🏛️"],
      ["market", "🧺"],
      ["library", "📚"],
      ["harbour", "⚓"],
      ["arena", "🏒"],
    ] as [string, string][],
    9,
  );
  const names = ["northwest", "north", "northeast", "west", "centre", "east", "southwest", "south", "southeast"];
  const visual: Visual = {
    type: "table",
    title: "Map of Fairview (north is at the top)",
    headers: ["", "West", "Middle", "East"],
    rows: ["North", "Middle", "South"].map((rowName, r) => [rowName, ...[0, 1, 2].map((c) => `${features[r * 3 + c][1]} ${features[r * 3 + c][0]}`)]),
  };
  const dir = pick(["northwest", "northeast", "southwest", "southeast"]);
  const target = features[names.indexOf(dir)];
  const wrong = shuffle(features.filter((f, i) => i !== names.indexOf(dir) && names[i] !== "centre")).slice(0, 3);
  return textChoice(
    `Look at the map. Which place is ${dir} of the ${features[4][0]} in the middle?`,
    { label: target[0], emoji: target[1] },
    wrong.map((w) => ({ label: w[0], emoji: w[1] })),
    "Start at the middle square. Move one square in the first direction, then one in the second. North is at the top, east is on the right.",
    visual,
  );
}

const POLITICAL: Item[] = [
  q("How many provinces and territories does Canada have in all?", "13", ["10", "3", "50"], "There are 10 provinces and 3 territories.", "🍁"),
  q("Which of these is a territory?", "Nunavut", ["Manitoba", "Quebec", "Alberta"], "Nunavut became a territory in 1999.", "❄️"),
  q("Which kind of political region is run by a local government like a mayor and council?", "a municipality", ["a continent", "an ocean", "a country"], "Cities, towns and villages are municipalities.", "🏙️"),
  q("The powers of a province come from…", "Canada's Constitution", ["a school", "a store", "a family"], "The Constitution divides powers between governments.", "📜"),
  q("Many First Nations communities are led by…", "a chief and council", ["a mayor only", "a king", "a premier"], "Each community has its own government.", "🏘️"),
  q("Which province is the only officially bilingual province?", "New Brunswick", ["Ontario", "Manitoba", "Alberta"], "English and French are both official languages there.", "🍁"),
  q("Which direction is Ontario from Manitoba?", "east", ["west", "north", "south"], "Manitoba is west of Ontario.", "🧭"),
  q("Which province is directly west of Manitoba?", "Saskatchewan", ["Ontario", "Quebec", "Nova Scotia"], "Alberta, Saskatchewan and Manitoba are in a row.", "🗺️"),
  q("Which province is directly east of Alberta?", "Saskatchewan", ["British Columbia", "Ontario", "Quebec"], "Look at a map of the Prairies.", "🗺️"),
  q("Which ocean is on the east coast of Canada?", "the Atlantic Ocean", ["the Pacific Ocean", "the Arctic Ocean", "the Indian Ocean"], "Atlantic Canada is on the Atlantic coast.", "🌊"),
  q("The Northwest Territories are in the…", "north of Canada", ["south of Canada", "far east of Canada", "middle of the Prairies"], "Territories are mostly in the north.", "🧭"),
  q("Job opportunities in Alberta's oil industry are an example of…", "an opportunity in a political region", ["a landform", "a lake", "a mountain"], "Different regions offer different jobs.", "🛢️"),
  q("The loss of cod fishing jobs in Newfoundland and Labrador is an example of…", "a challenge for quality of life in a region", ["a new opportunity", "a landform", "a political map"], "When an industry shrinks, people lose jobs.", "🎣"),
  q("Communities in the far north may find it hard to get fresh food because…", "it must be flown or shipped long distances", ["there are too many stores", "it is too sunny", "there are too many roads"], "Remote communities face challenges.", "✈️"),
  hq("A province has a 'premier' and a legislature. A territory's government has powers that are…", "given by the federal government", ["the same as a province's, directly from the Constitution", "none", "decided by a school"], "Territorial powers are delegated by the federal government.", "🏛️"),
  hq("Northeast is the direction between…", "north and east", ["south and west", "north and west", "south and east"], "Intermediate directions are in between.", "🧭"),
  hq("Which direction is Nunavut from Ontario?", "north", ["south", "east", "southeast"], "Nunavut is in the Arctic.", "🧭"),
  hq("A letter and number grid on a map helps you…", "find a place by naming its square", ["see the time", "measure the weather", "write a letter"], "Use the letter and number, like B3.", "🔤"),
  hq("Why do political maps use different letter styles for countries, provinces and cities?", "to show different types of places", ["to be pretty", "to hide names", "to save ink"], "Bigger, bolder letters show bigger political areas.", "🗺️"),
];

export const units: Unit[] = [
  {
    id: "early-societies",
    title: "Early Societies",
    emoji: "🏺",
    blurb: "Egypt, Greece, Rome, the Haudenosaunee, Inuit and more",
    standards: on("A1.1, A3.1, A3.8", "who early societies were, where they lived, and how they were organized"),
    parentNote: "Meet societies from before 1500 CE: ancient Egypt, Greece and Rome, medieval Europe, the Mali Empire, the Maya, and the First Nation Haudenosaunee and the Inuit, whose descendants live in Canada today, and compare how each was organized.",
    generate: bankUnit(EARLY, { sorts: [SOCIETY_SORT] }),
  },
  {
    id: "daily-life-4",
    title: "Daily Life Long Ago",
    emoji: "🧺",
    blurb: "Homes, food, clothing and childhood in early societies",
    standards: on("A1.2, A1.3, A3.3", "daily life in early societies and how it compares with a young person's life today"),
    parentNote: "What people ate, wore and lived in, how children learned, and how life differed for different people (a Roman senator and an enslaved person, a noble and a peasant), compared with life today.",
    generate: bankUnit(DAILY, { sorts: [DAILY_SORT] }),
  },
  {
    id: "environment-4",
    title: "People & the Land",
    emoji: "🌿",
    blurb: "How the environment shaped early ways of life",
    standards: on("A1.4, A2.1–A2.6, A3.4, A3.5", "how the local environment shaped how early societies met their needs"),
    parentNote: "How rivers, deserts, mountains, forests and Arctic seasons shaped food, homes and travel for societies such as ancient Egypt, Greece, the Haudenosaunee and the Inuit, and how to investigate this with maps and evidence.",
    generate: bankUnit(ENVIRONMENT, { sorts: [MATERIAL_SORT] }),
  },
  {
    id: "governing-4",
    title: "Governing & Getting Along",
    emoji: "🕊️",
    blurb: "Pharaohs, assemblies, clan mothers and peace agreements",
    standards: on("A3.7, A3.9, A3.10", "how early societies were governed, and why groups cooperated or came into conflict"),
    parentNote: "How early societies were governed (a pharaoh, the Athenian assembly, feudal kings and nobles, Haudenosaunee clan mothers and the Great Law of Peace), and why groups worked together or came into conflict.",
    generate: bankUnit(GOVERN, { sorts: [GOV_SORT] }),
  },
  {
    id: "early-tech-4",
    title: "Inventions & Evidence",
    emoji: "📜",
    blurb: "Calendars, writing, boats and clues from the past",
    standards: on("A2.2, A2.4, A3.2, A3.6", "scientific and technological developments in early societies, and learning about them from artifacts and other evidence"),
    parentNote: "Writing, calendars, aqueducts, printing, qajaqs and farming methods, plus how historians learn from artifacts, art and primary and secondary sources.",
    generate: bankUnit(INVENTIONS, { sorts: [EVIDENCE_SORT] }),
  },
  {
    id: "physical-regions-4",
    title: "Canada's Physical Regions",
    emoji: "🏔️",
    blurb: "Landforms, climate and what people do there",
    standards: on("B1.1, B3.1, B3.2", "Canada's physical regions and how they shape industry and activities"),
    parentNote: "Canada's landform, vegetation and climate regions, such as the Western Cordillera, Interior Plains and Canadian Shield, and how each shapes farming, mining, forestry, fishing and recreation.",
    generate: bankUnit(PHYSICAL, { sorts: [REGION_SORT] }),
  },
  {
    id: "sectors-4",
    title: "Jobs & Industries",
    emoji: "🏭",
    blurb: "Primary, secondary, tertiary and quaternary sectors",
    standards: on("B1.1, B3.2, B3.3", "the four economic sectors and Canadian industries in different regions"),
    parentNote: "The four economic sectors (gathering resources, making goods, providing services and working with information), and examples of Canadian industries in each.",
    generate: bankUnit(SECTORS, { sorts: [SECTOR_SORT] }),
  },
  {
    id: "industry-env-4",
    title: "Industry & the Environment",
    emoji: "🌱",
    blurb: "Balancing people's needs with caring for nature",
    standards: on("B1.2, B1.3, B2.1–B2.6", "how industries affect the environment and ways industries and citizens act for sustainability"),
    parentNote: "Effects of dams, mines, oil, forestry and fishing on the environment, sustainability actions by companies and citizens, and weighing different perspectives about land and resource use.",
    generate: bankUnit(INDUSTRY, { sorts: [STEWARD_SORT] }),
  },
  {
    id: "political-4",
    title: "Provinces, Territories & Directions",
    emoji: "🧭",
    blurb: "Political regions and finding places on a map",
    standards: on("B3.4–B3.7", "political regions of Canada, quality of life in different regions, and directions on maps"),
    parentNote: "Provinces, territories, municipalities and First Nations governments, challenges and opportunities in different regions, and using cardinal and intermediate directions such as northeast and number and letter grids.",
    generate: bankUnit(POLITICAL, { sorts: [POLITICAL_SORT], makers: [() => compassQuestion()] }),
  },
];
