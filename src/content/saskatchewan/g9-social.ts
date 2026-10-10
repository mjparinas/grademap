import type { SortSet } from "../bank";
import type { Unit } from "../types";
import { bankUnit, hq, order, q, type Item } from "../ontario/g3-4-kit";
import { sk } from "./kit";

// Saskatchewan Grade 9 Social Studies: societies of the past and their influence on Canada today
// (IN9.1–RW9.3). Examples are ancient Mesopotamia, Egypt, Greece and Rome; the questions teach the ideas
// (worldview, evidence, power, trade) rather than one fixed list of societies. Written for Saskatchewan.

// ---------- What makes a society, and worldview ----------

const WORLDVIEW_SORT: SortSet = {
  prompt: "Is it a factor that shapes a worldview, or an example of worldview in daily life? Tap an item, then tap its basket.",
  hint: "Factors are things like time and place, culture, language and religion. Daily-life examples are things people build, wear, eat or celebrate.",
  bins: [
    { id: "factor", label: "shapes a worldview", emoji: "🧠" },
    { id: "daily", label: "shows a worldview in daily life", emoji: "🏺" },
  ],
  items: [
    { label: "language", emoji: "🗣️", bin: "factor" },
    { label: "religion", emoji: "🕊️", bin: "factor" },
    { label: "education", emoji: "📚", bin: "factor" },
    { label: "time and place", emoji: "🌍", bin: "factor" },
    { label: "temples built for the gods", emoji: "🏛️", bin: "daily" },
    { label: "festivals and celebrations", emoji: "🎉", bin: "daily" },
    { label: "burial customs", emoji: "⚱️", bin: "daily" },
    { label: "art and storytelling", emoji: "🎭", bin: "daily" },
  ],
};

const WORLDVIEW: Item[] = [
  q("A society is…", "a group of people who share a place, a way of life and organized relationships", ["one person", "a type of building", "a group of strangers on a bus"], "Societies have common ways of living, working and making decisions.", "🏘️"),
  q("A worldview is…", "the way a person or group understands and explains the world", ["a map of the world", "a type of camera", "a word for weather"], "A worldview shapes beliefs and choices.", "👓"),
  q("Which can shape a society's worldview?", "religion, language and culture", ["only the weather", "only age", "only the colour of clothing"], "Time and place, culture, language, religion, gender identity, socio-economic situation and education all play a role.", "🧠"),
  q("Ancient Egyptians built pyramids as tombs for pharaohs. This shows their belief in…", "life after death", ["no gods", "only farming", "democracy"], "Burial beliefs shaped how they built and what they buried with the dead.", "🔺"),
  q("In ancient Greece, many people believed that gods like Zeus and Athena watched over them. How might this show up in daily life?", "temples, festivals and offerings", ["no festivals", "no art", "no stories"], "Beliefs appear in buildings and celebrations.", "🏛️"),
  q("Ancient Mesopotamians built ziggurats. What were they?", "stepped temple towers", ["bridges", "libraries", "ships"], "Ziggurats were religious centres of Mesopotamian cities.", "🏯"),
  q("A group's language is part of its worldview because…", "words carry ideas, stories and ways of understanding", ["language never changes", "everyone speaks the same", "words have no meaning"], "Languages hold knowledge and cultural memory.", "🗣️"),
  q("A society's economy can shape its worldview. For example, farming societies often…", "pay close attention to seasons and weather", ["ignore the weather", "never plant", "never trade"], "Their work affects what they value and celebrate.", "🌾"),
  q("A festival that celebrates a successful harvest shows…", "what the society values", ["nothing at all", "that no one farms", "a random event"], "Celebrations reveal values.", "🎊"),
  q("Which is an example of a worldview influencing a decision?", "a leader consults priests before going to war", ["flipping a coin", "ignoring everyone", "closing a market"], "Beliefs affected choices in many ancient societies.", "⚔️"),
  q("Which is an example of how a worldview is shown in architecture?", "building temples at the centre of a city", ["building a wall of sand", "removing every building", "building only boats"], "Important buildings show what people value.", "🏛️"),
  q("In many Indigenous worldviews in what is now Canada, people see themselves as…", "connected to the land, animals and each other", ["separate from nature", "owners of nature", "visitors only"], "Many First Nations and Métis worldviews stress relationships and responsibility to the land.", "🌿"),
  q("Why might two people in the same society hold different worldviews?", "their experiences, age, status and beliefs can differ", ["everyone always agrees", "societies have only one person", "differences are impossible"], "No society is entirely uniform.", "👥"),
  q("Gender roles in ancient societies often…", "differed from today's and varied between societies", ["were identical everywhere", "never existed", "were the same as today's"], "Different societies gave men and women different rights and roles.", "⚖️"),
  q("A person's socio-economic situation means…", "their place in society based on wealth, work and status", ["their favourite food", "their hair colour", "their favourite colour"], "Wealth and status affect opportunities and views.", "💰"),
  q("Why is education part of a worldview?", "what people learn shapes how they see the world", ["school has no effect", "everyone learns the same", "it makes the sun rise"], "Education passes down knowledge and values.", "🎓"),
  q("In ancient Egypt, scribes were important because…", "few people could read and write, and they kept records", ["they grew the crops", "they led the army", "they built the boats"], "Writing was a powerful skill.", "✍️"),
  q("Which is an example of a society sharing values through stories?", "myths and legends told across generations", ["a road sign", "a grocery receipt", "a bus schedule"], "Stories carry values and history.", "📖"),
  hq("Why can a worldview make it hard to understand a society of the past?", "we may judge them by our own beliefs instead of theirs", ["they spoke too quietly", "they lived in the same place", "there are no differences"], "Historians try to understand people on their own terms.", "🔍"),
  hq("A society believes the river is a god who gives life. How might that affect its choices?", "people may build shrines, hold festivals and protect the river", ["they will ignore the river", "they will forget the river", "they will drain it first"], "Beliefs affect how people treat the environment.", "🌊"),
  hq("Which is the best example of a society's worldview influencing interactions with another society?", "refusing to trade with people who worship different gods", ["trading without thought", "never meeting anyone", "moving to the sea"], "Beliefs can bring cooperation or conflict.", "🤝"),
  hq("Why do historians say a worldview can change over time?", "contact with new ideas, events and technologies changes how people see things", ["people never learn", "societies stay frozen", "nothing influences beliefs"], "Worldviews are not fixed.", "🔄"),
  hq("Why is language called a carrier of worldview?", "it holds the concepts, stories and values of its speakers", ["it is only for writing", "it never changes", "it has no meaning"], "Losing a language can mean losing knowledge and ways of seeing.", "🗝️"),
  hq("How might a society's worldview affect how it treats people from outside the society?", "it may welcome, trade with, avoid or fight them depending on what it believes", ["it will always treat them the same", "it ignores them", "it has no opinions"], "Worldview influences interactions.", "🌍"),
];

// ---------- Evidence and events ----------

const SOURCE_SORT: SortSet = {
  prompt: "Is it a primary source or a secondary source about ancient Rome? Tap an item, then tap its basket.",
  hint: "A primary source comes from the time. A secondary source was made later by someone studying the past.",
  bins: [
    { id: "primary", label: "primary source", emoji: "🏺" },
    { id: "secondary", label: "secondary source", emoji: "📚" },
  ],
  items: [
    { label: "a Roman coin found in a field", emoji: "🪙", bin: "primary" },
    { label: "a letter written by a Roman citizen", emoji: "✉️", bin: "primary" },
    { label: "a mosaic from a Roman house", emoji: "🧩", bin: "primary" },
    { label: "a clay tablet from Mesopotamia", emoji: "🪨", bin: "primary" },
    { label: "a modern textbook about Rome", emoji: "📘", bin: "secondary" },
    { label: "a documentary made last year", emoji: "🎬", bin: "secondary" },
    { label: "an encyclopedia article", emoji: "📖", bin: "secondary" },
    { label: "a museum website summary", emoji: "💻", bin: "secondary" },
  ],
};

const TIMELINE = order("Put these events in order from earliest to most recent.", "Mesopotamia and Egypt came first, then classical Greece, then the Roman Empire.", [
  ["Cities grow in Mesopotamia", "🏙️"],
  ["The pyramids of Giza are built in Egypt", "🔺"],
  ["Athens develops democracy", "🏛️"],
  ["Augustus becomes the first Roman emperor", "👑"],
]);

const EVIDENCE: Item[] = [
  q("What is a primary source?", "a record made at the time of the event", ["a modern book about the event", "a guess", "a movie made later"], "Letters, tools, coins and art from the time are primary sources.", "🏺"),
  q("What is a secondary source?", "an account made later by someone who studied the past", ["a letter written at the time", "a coin from the time", "a tool from the time"], "Textbooks and documentaries are secondary sources.", "📚"),
  q("What is an artifact?", "an object made by people in the past", ["a modern phone", "a type of weather", "a map of the sky"], "Pottery, tools and jewellery are artifacts.", "🏺"),
  q("What does an archaeologist do?", "studies the past by digging up and analyzing remains", ["predicts the weather", "builds skyscrapers", "writes the news"], "Archaeologists study artifacts and sites.", "⛏️"),
  q("Why is the Rosetta Stone famous?", "it helped scholars read Egyptian hieroglyphs", ["it is the largest pyramid", "it is a Roman road", "it is a Greek temple"], "The stone carried the same text in three scripts, including Greek.", "🪨"),
  q("What do the letters BCE stand for?", "before the common era", ["big city empire", "born before Caesar", "built by Egyptians"], "BCE years count down toward the year 1.", "📅"),
  q("What do the letters CE stand for?", "common era", ["city empire", "ancient Caesar", "central Europe"], "CE counts years after the year 1.", "📅"),
  q("Which is older, 500 BCE or 100 BCE?", "500 BCE", ["100 BCE", "they are the same", "neither"], "BCE years get smaller as they get closer to the present.", "⏳"),
  q("Why can it be hard to find information about societies of the past?", "many records were lost, damaged or never written down", ["everything was saved", "they used phones", "they wrote everything in English"], "Time, weather and war destroy evidence.", "🏚️"),
  q("Why do historians check more than one source?", "one source may be incomplete or biased", ["one source is always enough", "sources never disagree", "it makes books longer"], "Comparing sources gives a fuller picture.", "🔎"),
  q("A source is biased if it…", "shows only one point of view unfairly", ["is very old", "is made of stone", "is long"], "Bias can affect who wrote it and why.", "⚖️"),
  q("The Nile flooded each year. How did this help ancient Egypt?", "it left rich soil for farming", ["it destroyed all crops", "it dried up the river", "it brought snow"], "The Nile's annual flood supported agriculture.", "🌊"),
  q("Mesopotamia means “land between rivers”. Which rivers?", "the Tigris and the Euphrates", ["the Nile and the Congo", "the Thames and the Seine", "the Amazon and the Mississippi"], "These rivers watered the farmland.", "🌾"),
  q("Which ancient society is often credited with early forms of democracy?", "Athens in Greece", ["Egypt", "Babylon", "Carthage"], "In Athens, adult male citizens voted on laws.", "🗳️"),
  q("Where does the word “democracy” come from?", "Greek words meaning rule by the people", ["Latin words for emperor", "Egyptian words for river", "French words for king"], "Greek societies influenced modern governments.", "🏛️"),
  q("Which alphabet that we use today came to us through Rome?", "the Latin alphabet", ["hieroglyphs", "cuneiform", "runes"], "English is written with the Latin alphabet.", "🔤"),
  q("Roman law influenced modern law in many countries. One idea is that…", "a person is innocent until proven guilty", ["leaders are above the law", "laws should be secret", "trials are unnecessary"], "Rome developed many legal ideas that later systems adapted.", "⚖️"),
  q("Why do people in Canada still use some Latin words, like the motto on Saskatchewan's coat of arms?", "Latin influenced many languages and traditions", ["it is the main language of Canada", "Latin is the language of the weather", "Latin is only spoken at sea"], "Saskatchewan's motto is “Multis e gentibus vires”.", "🔤"),
  q("Which of these buildings shows Roman influence on Canadian architecture?", "columns and domes on government buildings", ["igloos", "log cabins", "tipis"], "Many legislatures copy classical styles.", "🏛️"),
  q("A calendar with twelve months comes to us from…", "the Roman calendar", ["Viking sagas", "the Maya only", "no one"], "Our month names come from Roman ones.", "📆"),
  hq("Why might a Roman historian's account of a war be biased?", "he may have been writing for the winning side", ["he was an artist", "he lived in Canada", "he used a computer"], "Sources reflect their author's point of view.", "✒️"),
  hq("How can an archaeologist know that a site was a market?", "by finding weights, coins and stalls", ["by guessing", "by asking the sun", "by counting clouds"], "Evidence from many artifacts supports a conclusion.", "🔍"),
  hq("Why did building aqueducts matter to Roman cities?", "they brought clean water to large populations", ["they were for decoration only", "they stopped the sea", "they kept the army out"], "Roman engineering still influences cities today.", "🏗️"),
  hq("How do ancient Greek ideas influence contemporary Canada?", "they helped shape democracy, theatre, science and philosophy", ["they have no influence", "they invented hockey", "they ended trade"], "Many modern institutions have ancient roots.", "🎭"),
  hq("Why is it important to ask “whose story is missing?” when studying the past?", "records often tell the story of the powerful and leave out others", ["every group is fully recorded", "no one is left out", "the question has no value"], "Enslaved people, women and the poor left fewer written records.", "🔎"),
];

// ---------- Power, citizens and trade ----------

const POWER_SORT: SortSet = {
  prompt: "Which society is it? Tap an item, then tap its basket.",
  hint: "Egypt was ruled by pharaohs. Athens had a democracy of male citizens. Rome grew from a republic into an empire.",
  bins: [
    { id: "egypt", label: "ancient Egypt", emoji: "🔺" },
    { id: "athens", label: "ancient Athens", emoji: "🏛️" },
  ],
  items: [
    { label: "a pharaoh ruled", emoji: "👑", bin: "egypt" },
    { label: "rule passed within a royal family", emoji: "🏺", bin: "egypt" },
    { label: "scribes kept records for the state", emoji: "✍️", bin: "egypt" },
    { label: "the Nile held the kingdom together", emoji: "🌊", bin: "egypt" },
    { label: "citizens voted in the Assembly", emoji: "🗳️", bin: "athens" },
    { label: "only adult male citizens could vote", emoji: "👥", bin: "athens" },
    { label: "juries decided court cases", emoji: "⚖️", bin: "athens" },
    { label: "the Acropolis stood above the city", emoji: "🏛️", bin: "athens" },
  ],
};

const POWER: Item[] = [
  q("In ancient Egypt, who held the most power?", "the pharaoh", ["the farmers", "the traders", "the sailors"], "Pharaohs were seen as both rulers and gods.", "👑"),
  q("In Athens, who could vote in the Assembly?", "adult male citizens", ["all adults", "children", "everyone who lived there"], "Women, enslaved people and foreigners could not vote.", "🗳️"),
  q("Why is Athens' democracy called limited?", "many people were not allowed to take part", ["no one voted", "there was no assembly", "it had a king"], "Only a small share of the population could vote.", "⚖️"),
  q("What is an empire?", "a large territory or group of peoples ruled by one government", ["a small village", "a type of boat", "a school"], "Empires grow by conquest or agreement.", "🌍"),
  q("Who was the first Roman emperor?", "Augustus", ["Cleopatra", "Pericles", "Hammurabi"], "Rome moved from a republic to an empire under Augustus.", "👑"),
  q("What is a republic?", "a government in which officials are chosen by citizens or their representatives", ["a government led by a god", "rule by an army only", "rule by a single family forever"], "Early Rome was a republic.", "🏛️"),
  q("What can empire-building do to the peoples who are conquered?", "take their land and change their way of life", ["make them rich", "leave them alone", "give them everything"], "Conquest often harmed local people and their cultures.", "⚔️"),
  q("In the Roman Empire, many people were enslaved. What does this show?", "power and wealth were unequal", ["everyone was free", "there were no laws", "everyone was rich"], "Roman wealth rested on the labour of enslaved people.", "⛓️"),
  q("What was Hammurabi's Code?", "an early set of written laws from Babylon", ["a recipe", "a map", "a poem"], "It shows that societies wrote down rules for justice.", "📜"),
  q("Today in Canada, one responsibility of citizens is…", "to obey the law and pay taxes", ["to ignore laws", "to be the ruler", "to avoid voting always"], "Citizens also have rights, such as voting.", "🍁"),
  q("A citizen in Canada has the right to…", "vote and be protected by the Charter", ["ignore school", "own a pharaoh", "skip laws"], "Rights come with responsibilities.", "📘"),
  q("A major difference between Athens and Canada today is that in Canada…", "most adult citizens can vote, regardless of gender", ["only men vote", "no one votes", "only the wealthy vote"], "Voting rights have expanded over time.", "🗳️"),
  q("The Silk Road was…", "a network of trade routes linking Asia and the Mediterranean", ["a type of fabric", "a river", "a modern highway"], "Silk, spices and ideas travelled along it.", "🛤️"),
  q("Why did trade matter to ancient Mediterranean societies?", "it brought goods, wealth and ideas", ["it stopped growth", "it hurt every city", "it changed nothing"], "Trade connected distant peoples.", "⛵"),
  q("What did Roman roads help with?", "moving armies, goods and messages", ["flying", "hiding", "farming"], "Many modern roads follow old Roman routes.", "🛣️"),
  q("Coins were useful in trade because…", "they have a shared value everyone accepts", ["they are heavy", "they are shiny", "they cannot be used"], "Money makes trade easier than barter.", "🪙"),
  q("Which technology from the past still influences us?", "the arch, concrete and aqueducts", ["the telephone", "the car", "the computer"], "Roman engineering inspired later builders.", "🏗️"),
  q("Why did cities often grow near rivers or the sea?", "water helped farming, travel and trade", ["rivers were dangerous only", "cities avoid water", "no one liked boats"], "Transportation shaped where societies developed.", "🌊"),
  hq("Why did the pharaoh have so much power?", "people believed the pharaoh was a god-king who kept order", ["he was the best farmer", "he lived far away", "he had a large boat"], "Religion and politics were closely tied.", "👑"),
  hq("Why is wealth in ancient societies often described differently by rulers and by ordinary people?", "they had different experiences of how wealth was gained and shared", ["they agreed on everything", "wealth did not exist", "all people were rich"], "Perspectives on wealth vary.", "💰"),
  hq("How did the Roman Empire's roads and ports help it hold together?", "they let it move troops, trade goods and send orders quickly", ["they stopped movement", "they made travel slower", "they were only for show"], "Transportation supports control and trade.", "🛣️"),
  hq("What is one lasting influence of Greek and Roman governments on Canada?", "ideas such as citizen participation, courts and representative government", ["the idea of a pharaoh", "the idea of a ziggurat", "the idea of barter only"], "Canadian institutions have roots in ancient ideas.", "🏛️"),
  hq("Why might people in conquered lands have a different story of the Roman Empire than Rome did?", "they experienced loss of land, freedom or culture", ["they agreed with Rome", "they wrote Rome's history", "they never met Romans"], "Perspectives differ between rulers and the ruled.", "🔍"),
  hq("How is the role of a Canadian citizen different from that of a subject of a pharaoh?", "citizens have rights, can vote and can challenge leaders", ["there is no difference", "citizens obey without question", "a pharaoh has to vote"], "Modern citizenship includes rights and participation.", "🍁"),
];

export const units: Unit[] = [
  {
    id: "sk-worldview-9",
    title: "Society & Worldview",
    emoji: "🧠",
    blurb: "What shapes how people see the world",
    standards: { "ca-sk": sk("IN9.1–IN9.4", "what makes a society, the factors that shape a worldview, and how worldview shows in daily life and decisions") },
    parentNote: "What a society is, what shapes a worldview (time and place, culture, language, religion, gender identity, socio-economic situation and education), and how worldview shows up in buildings, stories, celebrations and decisions in societies of the past.",
    generate: bankUnit(WORLDVIEW, { sorts: [WORLDVIEW_SORT] }),
  },
  {
    id: "sk-evidence-9",
    title: "Evidence of the Past",
    emoji: "🏺",
    blurb: "Sources, key events and what we inherited",
    standards: { "ca-sk": sk("DR9.1–DR9.4", "the challenges of learning about the past, key events, the natural environment, and the influence of past societies on Canada") },
    parentNote: "Primary and secondary sources, artifacts and archaeology, bias, dating with BCE and CE, how rivers and land shaped early societies, and ideas Canada inherited from societies of the past.",
    generate: bankUnit(EVIDENCE, { sorts: [SOURCE_SORT], orders: [TIMELINE] }),
  },
  {
    id: "sk-power-trade-9",
    title: "Power, Citizens & Trade",
    emoji: "🏛️",
    blurb: "Who held power, and how trade built societies",
    standards: { "ca-sk": sk("PA9.1–PA9.3, RW9.1–RW9.3", "power and authority, empire-building, the roles of citizens, resources and wealth, and trade and technology") },
    parentNote: "How power was held in societies such as Egypt, Athens and Rome, the effects of empire-building on conquered peoples, citizens' roles then and now, and how trade, transport and technology shaped wealth and societies.",
    generate: bankUnit(POWER, { sorts: [POWER_SORT] }),
  },
];
