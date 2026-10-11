import { bankUnit, type Q } from "../own";

// Grade 5 social studies, New Brunswick: the Wabanaki Confederacy and the French and British in Atlantic Canada. Wabanaki
// content is light, in the present tense for living communities, and needs review by Wabanaki partners before launch.

const CONFEDERACY: Q[] = [
  ["Which Nations make up the Wabanaki Confederacy in New Brunswick?", "Wolastoqiyik, Mi’kmaq and Peskotomuhkatiyik", ["Cree, Dene and Inuit", "Haida, Squamish and Tsimshian", "Mohawk, Oneida and Cayuga"], "Other Nations, such as the Abenaki and Penobscot, are also part of the Wabanaki Confederacy."],
  ["What is a confederacy?", "an alliance of Nations that agree to work together", ["a kind of boat", "a school subject", "a type of weather"], "Nations join a confederacy to share decisions and protect each other."],
  ["The Wabanaki Confederacy is made up of…", "Nations that govern themselves and also work together", ["one group that rules everyone", "only French settlers", "only one village"], "Each Nation kept its own leaders and decisions."],
  ["Who spoke for a community in Wabanaki governance?", "chiefs and leaders chosen by their community", ["a king far away", "a hockey team", "the weather"], "Leaders listened to their people and to Elders."],
  ["Why were Elders important in Wabanaki governance?", "They carried knowledge, stories and history", ["They were only there for ceremonies", "They did not take part", "They were chosen by lottery"], "Elders help guide decisions today, too."],
  ["Wabanaki governance used…", "talking, listening and agreeing, often in councils", ["votes by mail", "only one person making every choice", "cell phones"], "Councils met to share views until people could agree."],
  ["What was a Grand Council?", "a gathering of leaders from many districts or Nations", ["a large boat", "a kind of feast only", "a law in Europe"], "Leaders met to talk about shared matters."],
  ["Which of these shows how the Wabanaki Confederacy worked?", "Nations helped each other and made decisions together", ["Nations never spoke to each other", "One Nation made all the decisions", "Nations fought every day"], "The Confederacy was a way to keep peace and share responsibility."],
  ["Why did Nations form alliances?", "to work together, protect their homelands and keep peace", ["to stop talking", "to get a new flag", "to build a castle"], "Working together made them stronger."],
  ["Wabanaki Peoples’ ways of making decisions are…", "still practised in communities today", ["forgotten", "only in books", "ended in 1900"], "Communities today combine traditional and modern ways of governing."],
  ["The Peace and Friendship treaties were agreements between…", "Wabanaki Nations and the British Crown", ["Wabanaki Nations and the Roman Empire", "two provinces", "France and Spain"], "They were signed in the 1700s and did not give away the land."],
  ["What did the Peace and Friendship treaties say about land?", "They did not give the land away", ["They gave all land to the Crown", "They were about money only", "They were about hockey"], "Wabanaki Nations continued to have rights to their homelands.", true],
  ["How did the Wabanaki Confederacy help in the 1700s?", "It gave Nations a way to share news and make agreements", ["It built the first railroad", "It started schools in Europe", "It made the first maps of Canada"], "It helped Nations work together during a time of great change.", true],
  ["Why is it important to understand contact and colonization from Wabanaki perspectives?", "It helps us hear what happened from the people who lived it", ["It makes the story shorter", "It is not important", "It is about weather"], "Different people can remember the same events differently.", true],
  ["Which word means getting along peacefully after harm?", "reconciliation", ["colonization", "exploration", "immigration"], "Reconciliation means repairing relationships.", true],
  ["Wabanaki communities in New Brunswick each have…", "their own chief and council today", ["no leaders", "only a king", "no council"], "Communities such as Elsipogtog and Tobique govern themselves."],
  ["Why do many Wabanaki teachings talk about sharing?", "Sharing helps everyone in the community", ["Sharing is a mistake", "People should keep everything", "Sharing is only for kings"], "Respect, sharing and caring for each other are values in many communities."],
  ["Treaties are…", "agreements between nations", ["a type of food", "kinds of storms", "famous buildings"], "Treaties can still be important today."],
  ["Which statement about the Wabanaki Confederacy is true?", "It still exists today", ["It was only a story", "It ended hundreds of years ago", "It was a sports league"], "Wabanaki Nations continue to work together."],
  ["Which group of people has lived in this region for the longest time?", "Wabanaki Peoples", ["Acadians", "Loyalists", "Scottish settlers"], "Wabanaki Peoples have lived here for thousands of years."],
  ["What does it mean to say a Nation is sovereign?", "It has the right to govern itself", ["It lives on a boat", "It has no neighbours", "It cannot make rules"], "Wabanaki Nations govern themselves in ways that go back thousands of years."],
  ["Which word describes agreeing together after everyone has had a say?", "consensus", ["conflict", "competition", "contest"], "Consensus was an important part of many councils."],
  ["Why is a talking circle fair?", "Everyone gets a turn to speak and be heard", ["Only the loudest person speaks", "No one can say anything", "Only the oldest can talk"], "Listening is part of governing well.", true],
  ["Oral traditions are…", "stories and knowledge passed on by speaking", ["written laws only", "photographs", "emails"], "Wabanaki history was kept in stories, songs and wampum.", true],
  ["Wampum belts were used by many Nations to…", "record agreements and important events", ["cook meals", "play games only", "measure time"], "Wampum belts help to remember treaties and promises.", true],
  ["Why do we say “Wabanaki Peoples” and not “the Indians” today?", "It is more respectful and more accurate", ["It is shorter", "It is an old word", "It is a mistake"], "Using names Nations use for themselves shows respect.", true],
];

const ACADIA: Q[] = [
  ["Who were the first Europeans to settle for a long time in what is now New Brunswick?", "French settlers", ["Vikings", "Spanish explorers", "Roman soldiers"], "French settlers called the region Acadia."],
  ["Acadia was…", "a French colony in the Atlantic region", ["a province of Spain", "a mountain", "a kind of fish"], "It included parts of today’s New Brunswick, Nova Scotia and Prince Edward Island."],
  ["Who are the Acadians?", "descendants of French settlers in Acadia", ["people from Italy", "people from the Prairies", "people who live only in cities"], "Acadian culture is alive in New Brunswick today."],
  ["Which Acadian region in New Brunswick is known for fishing and a big festival every August?", "the Acadian Peninsula", ["the Miramichi", "the Saint John River valley only", "Grand Manan"], "Caraquet hosts a large Acadian festival every August."],
  ["Who helped the first French settlers survive the early winters?", "the Mi’kmaq", ["the Roman army", "the Vikings", "the Spanish"], "The Mi’kmaq shared knowledge of the land and trade."],
  ["What happened to many Acadians in the 1750s?", "They were forced to leave their homes", ["They moved by choice to a new province", "They were given more land", "They went on a holiday"], "This is called the Expulsion, or Le Grand Dérangement."],
  ["Many Acadians later returned to…", "the Atlantic region, including New Brunswick", ["Spain", "Japan", "South America"], "They built new communities, many along the east coast of New Brunswick."],
  ["Who were the Loyalists?", "people who stayed loyal to Britain after the American Revolution", ["people who loved the French king", "sailors from Spain", "Indigenous leaders"], "Thousands came to the Atlantic region in 1783."],
  ["In which year did many Loyalists arrive at the mouth of the Saint John River?", "1783", ["1583", "1883", "1983"], "The Loyalists landed at what is now Saint John."],
  ["New Brunswick became a separate colony in…", "1784", ["1534", "1867", "1920"], "Loyalists asked for a colony of their own, separate from Nova Scotia."],
  ["Where does the name “Fredericton” come from?", "Prince Frederick, a son of King George III", ["a Wabanaki word", "a French explorer", "a famous river"], "The city was named for a British prince.", true],
  ["Who lived in Atlantic Canada before the French and British arrived?", "Wabanaki Peoples", ["Roman settlers", "Dutch settlers", "no one"], "Wabanaki Peoples have lived here for thousands of years."],
  ["Evidence of French presence in New Brunswick includes…", "French place names and Acadian culture", ["only Roman roads", "castles from Spain", "Egyptian pyramids"], "French is also an official language of the province."],
  ["Evidence of British presence in New Brunswick includes…", "English place names and Loyalist history", ["pyramids", "Viking helmets", "Greek temples"], "English is also an official language of the province."],
  ["Which of these is a place name with Wabanaki roots?", "Miramichi", ["Fredericton", "Saint John", "New Brunswick"], "Fredericton honours a British prince, and Saint John was named by a French explorer.", true],
  ["A primary source is…", "something made at the time of an event, like a letter or photograph", ["a story told 200 years later", "a school textbook", "a movie"], "A primary source comes directly from the past."],
  ["A secondary source is…", "something written later about the past", ["a diary written at the time", "an old map", "a treaty document"], "Textbooks and encyclopedias are secondary sources."],
  ["What is a historian?", "a person who studies the past", ["a person who studies the stars", "a person who builds bridges", "a person who plants trees"], "Historians use sources to answer questions."],
  ["Which question would a historian ask?", "How do we know what happened?", ["What is the weather today?", "What is your favourite colour?", "How much does a ticket cost?"], "Historians ask about evidence."],
  ["Why do different sources sometimes tell different stories?", "People may see the same event in different ways", ["They are always wrong", "Only one is real", "Sources never disagree"], "Looking at many sources gives a fuller picture."],
  ["Which of these is a good way to learn about the past?", "reading letters and looking at old maps", ["guessing", "asking no one", "ignoring evidence"], "Primary and secondary sources help us understand."],
  ["How did the Mi’kmaq and French settlers work together?", "They traded and shared knowledge of the land", ["They never spoke", "They built a bridge to Europe", "They played hockey"], "Many Acadian and Mi’kmaw families built close relationships.", true],
  ["Which two languages are official in New Brunswick?", "English and French", ["English and Spanish", "French and Mi’kmaw", "English and German"], "New Brunswick is Canada’s only officially bilingual province.", true],
  ["What is the Acadian flag?", "the French tricolour with a gold star", ["a Union Jack", "a maple leaf", "a green cross"], "The star honours Stella Maris, “Star of the Sea”.", true],
  ["When is National Acadian Day?", "August 15", ["July 1", "December 25", "January 1"], "Acadians celebrate it with parades and music.", true],
  ["Why did people come to Atlantic Canada from Europe?", "to fish, farm, trade and find new homes", ["to avoid the sea", "to learn English only", "to build airports"], "Reasons included land, fishing and trade."],
];

const WORLDVIEW: Q[] = [
  ["What is a worldview?", "the way a person or group understands the world and how it works", ["a map of the globe", "a kind of telescope", "a weather forecast"], "Beliefs, values and experiences shape worldviews."],
  ["Why can two groups of people make different choices about the same thing?", "They may have different worldviews", ["They live on different planets", "One group always makes mistakes", "Choices are random"], "Worldviews change what people think is important."],
  ["Many Wabanaki teachings say people should take only what they need from the land. This is an example of…", "a worldview that values sharing and caring for the land", ["a rule about money", "a sports game", "a kind of map"], "It shows respect for all living things."],
  ["Which statement shows a worldview in which land can be bought and sold?", "Land is something a person can own", ["Land belongs to everyone and no one can own it", "Land is a spirit that cannot be touched", "Land is not important"], "Different worldviews treat land in different ways."],
  ["What is economics?", "how people make choices about goods and services", ["the study of mountains", "the study of the weather", "the study of stars"], "Economics includes making, trading and using things."],
  ["What is barter?", "trading goods or services without using money", ["buying with a credit card", "saving in a bank", "earning interest"], "Furs could be traded for tools by barter."],
  ["Which is an example of barter?", "trading a basket for a bag of flour", ["paying with a debit card", "depositing a cheque", "borrowing from a bank"], "No money changes hands in a barter."],
  ["What is currency?", "money used to buy and sell things", ["a kind of river", "a school grade", "a type of food"], "Dollars are the currency of Canada."],
  ["What is a need?", "something you must have to live, such as food and shelter", ["a new game", "a toy", "a treat"], "Needs are different from wants."],
  ["What is a want?", "something you would like but can live without", ["water", "shelter", "food"], "A video game is a want."],
  ["What does scarcity mean?", "there is not enough of something for everyone to have all they want", ["there is too much of everything", "something is very cheap", "something is very old"], "Scarcity means we must make choices."],
  ["The Mi’kmaw idea of Netukulimk can guide economic choices because it asks people to…", "meet needs while keeping the environment healthy for the future", ["use up all the resources", "sell everything quickly", "ignore the community"], "It joins economy, community and care for the land."],
  ["The fur trade changed how some Nations and Europeans traded. Why did Europeans want furs?", "to make hats and clothing that were popular in Europe", ["to eat them", "to use as money", "to build boats"], "Beaver felt hats were in fashion."],
  ["What did Wabanaki trappers and traders receive in the fur trade?", "tools, cloth and other goods", ["only gold", "only land", "only paper"], "Trade goods could be useful but also changed daily life."],
  ["How did the fur trade change Wabanaki ways of life?", "Families spent more time trapping and trading, and began to depend on traded goods", ["It changed nothing", "It ended all travel", "It made everyone move to Europe"], "Many changes followed from new goods, new diseases and new rules.", true],
  ["Why might the same trade look fair to one group and unfair to another?", "They may value things differently", ["They count the same way", "Everyone agrees on value", "Trade is never fair"], "Value depends on worldview.", true],
  ["What is an opportunity cost?", "what you give up when you choose one thing over another", ["the price of a ticket", "the amount of tax on food", "the cost of a bus ride"], "Choosing a snack means giving up other snacks."],
  ["If you spend your allowance on a game, what are you giving up?", "the chance to spend it on something else", ["nothing", "your friends", "your summer"], "That is the opportunity cost."],
  ["Which group usually makes decisions in a community that uses a consensus approach?", "everyone talks until they agree", ["only the youngest person", "a stranger", "the loudest person"], "Many Nations use councils to reach agreement."],
  ["Which is an example of a community decision?", "deciding how to share fish caught by many families", ["choosing a sandwich", "picking a pair of socks", "deciding which song to hum"], "Communities decide how to share resources."],
  ["What is a resource?", "something people use to meet their needs", ["a type of storm", "a type of fog", "a type of holiday"], "Water, trees and fish are resources."],
  ["Which is a renewable resource?", "fish that can reproduce if not overfished", ["coal", "oil", "iron ore"], "Renewable resources can be replaced naturally.", true],
  ["Which is a non-renewable resource?", "coal", ["a forest that regrows", "wind", "fish"], "Non-renewable resources cannot be replaced quickly.", true],
  ["Why do we need to think about the future when we make economic choices?", "Our choices affect people who come after us", ["The future never changes", "No one will ever need resources again", "Only today matters"], "Many teachings ask us to think seven generations ahead.", true],
  ["How do worldviews help explain different approaches to the economy?", "They shape what people think is fair, valuable and important", ["They decide the weather", "They give everyone the same idea", "They have no effect"], "A worldview that values sharing may use a different system than one that values profit."],
  ["Which is an example of sharing resources?", "families dividing a large catch so everyone has food", ["selling all the fish to one buyer", "keeping all fish for one family", "throwing away the extra"], "Sharing is part of many Wabanaki economies.", true],
  ["What is trade?", "exchanging goods or services between people or groups", ["building a bridge", "naming a place", "painting a canoe"], "People have traded for thousands of years."],
];

export const wabanakiConfederacy = bankUnit({
  id: "nb-wabanaki-confederacy-5",
  title: "The Wabanaki Confederacy",
  emoji: "🪶",
  blurb: "Nations working together.",
  parentNote:
    "Practises the governance structure and role of the Wabanaki Confederacy and the Peace and Friendship treaties. The content is light, in the present tense, and needs review by Wabanaki partners. It follows the Grade 5 social studies skill descriptors on power and governance and on reconciliation in the New Brunswick curriculum.",
  standards: ["Civics: Power and Governance, Wabanaki: Reconciliation", "the governance structure and role of the Wabanaki Confederacy, and contact and colonization from Wabanaki perspectives"],
  items: CONFEDERACY,
});

export const acadiaLoyalists = bankUnit({
  id: "nb-acadia-loyalists-5",
  title: "French & British in Atlantic Canada",
  emoji: "⚓",
  blurb: "Acadians, Loyalists and the evidence they left.",
  parentNote:
    "Practises the evidence of British and French presence in Atlantic Canada, using primary and secondary sources. It follows the Grade 5 social studies skill descriptors on human systems and on historical sources in the New Brunswick curriculum.",
  standards: ["Geography: Human Systems and Interactions, History: Sources and Methods", "evidence of British and French presence in Atlantic Canada, and using primary and secondary sources"],
  items: ACADIA,
});

export const worldviewEconomics = bankUnit({
  id: "nb-worldview-economics-5",
  title: "Worldviews & Deciding Together",
  emoji: "⚖️",
  blurb: "How what we believe shapes how we trade and share.",
  parentNote:
    "Practises how different worldviews lead to different approaches to economic decisions, with examples such as barter, the fur trade and Netukulimk. It follows the Grade 5 social studies skill descriptors on economic decision-making in the New Brunswick curriculum.",
  standards: ["Economics: Decision-Making", "worldview, and how different worldviews lead to different approaches to economic decision-making"],
  items: WORLDVIEW,
});
