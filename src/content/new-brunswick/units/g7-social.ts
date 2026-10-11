import { bankUnit, type Q } from "../own";

// Grade 7 social studies, New Brunswick: Wabanaki worldviews, languages and cultures. The content is light, in the present
// tense for living communities, and needs review by Wolastoqey, Mi'kmaq and Peskotomuhkati partners before launch.

const WORLDVIEW: Q[] = [
  ["What is a worldview?", "the way a person or group understands the world and their place in it", ["a map of the whole Earth", "a kind of telescope", "a type of weather forecast"], "Worldviews come from beliefs, values, languages and experiences."],
  ["Which statement describes the Wabanaki worldview that all living things are connected?", "People are part of nature and depend on and care for other living things", ["People are separate from nature", "Only humans matter", "Land is only for selling"], "Many Wabanaki teachings describe relationships among people, animals, plants, land and water."],
  ["In Mi’kmaw, the phrase Msit No’kmaq means…", "all my relations", ["good morning", "thank you for the gift", "one more time"], "It reminds us that all living things are connected."],
  ["Netukulimk is a Mi’kmaw idea about…", "meeting needs while caring for the land, water and community", ["building fast boats", "buying more than you need", "saving money in a bank"], "Taking only what is needed helps keep the environment healthy for the future."],
  ["Which of these is a Wabanaki language of New Brunswick?", "Wolastoqey", ["Swahili", "Hindi", "Portuguese"], "Mi’kmaw and Peskotomuhkati are also languages of New Brunswick."],
  ["Why are Wabanaki languages important?", "They carry stories, knowledge and identity", ["They are only for tourists", "They have no stories", "They are used only in books"], "Many communities have language programs to teach children."],
  ["What is language revitalization?", "efforts to bring a language back into everyday use", ["learning to read faster", "changing a name", "painting a language on a wall"], "Elders, schools and families work together to teach and use their languages.", true],
  ["How do Wabanaki communities share their cultures today?", "through stories, art, music, ceremonies, languages and teaching", ["only through museums", "they do not", "through advertising only"], "Wabanaki cultures are living and changing."],
  ["Basket making from ash and sweetgrass is an example of…", "a Wabanaki art and tradition that continues today", ["an old tradition that no longer exists", "a European invention", "a kind of machine"], "Basket makers pass skills to the next generation."],
  ["Powwows are…", "gatherings with music, dance and community", ["quiet libraries", "science fairs", "sports leagues"], "Many communities welcome visitors, with respect and permission."],
  ["Why is it respectful to ask permission before taking photographs at a cultural event?", "Some moments are private or sacred and belong to the people", ["It is a rule only in cities", "Photographs are never allowed", "It does not matter"], "Asking shows respect for people and their culture."],
  ["What does it mean to treat a culture with respect?", "listen, learn from the people and avoid stereotypes", ["copy their clothing as a costume", "decide what they believe", "make jokes about them"], "Respect starts with listening to the people themselves."],
  ["A stereotype is…", "an unfair idea that all people in a group are the same", ["a true fact about everyone", "a kind of music", "a type of map"], "Stereotypes can hurt people."],
  ["Which sentence avoids a stereotype?", "Wabanaki Peoples are different communities with their own histories and languages.", ["All Indigenous Peoples are the same.", "Wabanaki Peoples do not live in the present.", "They all live the same way."], "Each Nation and community is unique."],
  ["How do Wabanaki Peoples describe themselves?", "by the names of their own Nations, such as Wolastoqiyik, Mi’kmaq and Peskotomuhkatiyik", ["by names chosen by visitors", "by a single colour", "by a number"], "Using the names Nations choose shows respect."],
  ["What does culture include?", "language, art, food, beliefs and traditions", ["only clothing", "only buildings", "only money"], "Culture is the way a group of people live and share."],
  ["What is identity?", "who you are and how you see yourself", ["your street address", "your school bus number", "your height"], "Identity comes from family, culture, beliefs and experiences."],
  ["Which of these can shape a person’s identity?", "family, language, community and beliefs", ["only the weather", "only money", "only the day of the week"], "Many things shape identity."],
  ["How can cross-cultural understanding help a community?", "People learn from each other and work together fairly", ["People stop talking", "Everyone must be the same", "Nothing changes"], "Respectful conversation helps communities grow."],
  ["Which action shows listening to a different point of view?", "asking questions and letting the person finish", ["interrupting often", "ignoring the speaker", "laughing at the idea"], "Good listeners try to understand."],
  ["Why is hearing from Elders and knowledge keepers important?", "They hold teachings and history in their communities", ["They write only textbooks", "They live far away", "They do not know history"], "Learning from people with lived knowledge is respectful.", true],
  ["Wampum belts have been used by many Nations to…", "record agreements and important events", ["measure time", "mark property for sale", "play games only"], "Wampum belts hold meaning and memory.", true],
  ["The Truth and Reconciliation Commission’s Calls to Action ask Canadians to…", "work to repair relationships with Indigenous Peoples", ["forget about the past", "close all schools", "ignore treaties"], "Reconciliation involves learning and action.", true],
  ["Why do names of places matter?", "They show who has lived there and what is important", ["They never matter", "They are only for maps", "They are only for tourists"], "Many New Brunswick place names come from Wabanaki languages.", true],
  ["Wabanaki Peoples in New Brunswick today live in…", "communities, towns and cities across the province", ["only in the past", "nowhere in the province", "only in museums"], "They are part of modern New Brunswick."],
  ["Why is it important to use the present tense when learning about Wabanaki Peoples?", "They are living Peoples with cultures that continue today", ["They no longer exist", "It sounds nicer", "It is shorter"], "Past tense can wrongly suggest cultures have ended."],
];

const RIGHTS: Q[] = [
  ["What are human rights?", "basic rights that every person has", ["rules only for adults", "rights only for citizens", "rights that people can buy"], "Human rights belong to everyone, everywhere."],
  ["Which organization adopted the Universal Declaration of Human Rights in 1948?", "the United Nations", ["the Olympic Committee", "NATO", "the Red Cross"], "It was written after World War II."],
  ["The Universal Declaration of Human Rights says all people are born…", "free and equal in dignity and rights", ["rich", "with different rights", "with no rights"], "It has 30 articles."],
  ["Which international agreement protects the rights of children?", "the Convention on the Rights of the Child", ["the Treaty of Paris", "the Kyoto Protocol", "the Magna Carta"], "It was adopted in 1989."],
  ["Which of these is a right of every child?", "an education", ["a car", "a phone", "a pet"], "Education is a right under the Convention."],
  ["Which right protects people from being held as slaves?", "freedom from slavery", ["the right to a holiday", "the right to a pet", "the right to a vote at age 5"], "Slavery is banned in international law."],
  ["What is discrimination?", "treating people unfairly because of who they are", ["treating everyone equally", "sharing a snack", "waiting in line"], "It can be based on race, religion, gender or ability."],
  ["What is a refugee?", "a person who has to flee their country to be safe", ["a tourist", "a diplomat", "a traveller on holiday"], "Refugees are protected under international law."],
  ["What does apartheid mean?", "a system of racial separation that was law in South Africa", ["a type of food", "a kind of music", "a sport"], "It ended in the early 1990s."],
  ["Who was imprisoned for 27 years for fighting apartheid and became South Africa’s president?", "Nelson Mandela", ["Martin Luther King Jr.", "Mahatma Gandhi", "Abraham Lincoln"], "He led the new South Africa from 1994."],
  ["Malala Yousafzai received the Nobel Peace Prize for…", "speaking up for girls' right to education", ["winning a race", "writing a cookbook", "exploring space"], "She was the youngest winner at age 17."],
  ["Which Canadian law protects people's rights in New Brunswick workplaces, housing and services?", "the New Brunswick Human Rights Act", ["the Fisheries Act", "the Indian Act", "the Weather Act"], "The Human Rights Commission helps with complaints."],
  ["The Canadian Charter of Rights and Freedoms was added to the Constitution in…", "1982", ["1867", "1927", "2005"], "It protects fundamental freedoms."],
  ["Which of these is a fundamental freedom in the Charter?", "freedom of expression", ["freedom from taxes", "freedom from school", "freedom to hurt others"], "People can share ideas peacefully."],
  ["What does legislation mean?", "laws made by a government", ["a type of speech", "a kind of voting machine", "a school rule only"], "Human rights legislation protects people's rights."],
  ["Why do human rights laws differ from country to country?", "countries have different histories and governments", ["rights are not real", "laws are random", "it is a rule of the sea"], "Some countries protect rights better than others."],
  ["What is child labour?", "work that harms children or keeps them from school", ["an after-school job with safe hours", "helping with chores", "volunteering"], "Many countries have laws against it."],
  ["Which organization works to protect children's rights worldwide?", "UNICEF", ["FIFA", "NASA", "the Olympics"], "UNICEF is part of the United Nations.", true],
  ["Why is it important that everyone has a voice in decisions that affect them?", "it makes decisions fairer", ["it makes meetings longer", "it makes people quarrel", "it makes it harder"], "Everyone's views matter."],
  ["What can individuals do to support human rights?", "learn, speak up respectfully and help others", ["ignore problems", "join in teasing", "stay silent about unfairness"], "Small actions make a difference."],
  ["What is a petition used for?", "asking leaders to take action by collecting signatures", ["ordering food", "sending a text", "booking a trip"], "Petitions are a peaceful way to be heard."],
  ["Why do countries sometimes disagree about human rights?", "they may value different things or have different laws", ["they never talk", "there are no rights", "only one country has rights"], "Dialogue and international agreements help.", true],
  ["What is the right to clean water?", "everyone should have safe water to drink", ["only cities get water", "water is optional", "water is a luxury"], "The UN recognized it as a human right in 2010.", true],
  ["Wabanaki Peoples' rights are protected by…", "treaties, the Constitution and the United Nations declaration on Indigenous Peoples", ["no laws", "only local customs", "only international rules"], "Rights of Indigenous Peoples are recognized in many ways.", true],
  ["Why is freedom of the press important?", "it lets people learn what is happening", ["it helps hide the news", "it stops opinions", "it keeps secrets"], "A free press helps hold leaders to account."],
];

const WEALTH: Q[] = [
  ["What is wealth?", "the money and resources people or countries have", ["the weather", "a feeling", "a school grade"], "Wealth can be shared very unevenly."],
  ["What is poverty?", "not having enough money to meet basic needs", ["having many cars", "living by the sea", "living in a large house"], "Poverty affects food, housing and health."],
  ["What does GDP measure?", "the total value of goods and services a country produces", ["its population", "its height", "its area"], "GDP per person is used to compare countries."],
  ["What is a developing country?", "a country with a lower average income and fewer services", ["a country that is new", "a country with no people", "a country in a desert"], "Many countries are working to improve living standards."],
  ["What is a developed country?", "a country with a high average income and many services", ["a country with only cities", "a country with no farms", "a country in a cold climate"], "Canada is one."],
  ["Which is a sign of higher living standards?", "clean water, health care and schools for most people", ["fewer schools", "no hospitals", "unsafe water"], "These services affect health and learning."],
  ["What is life expectancy?", "how long people are expected to live", ["the speed of a car", "the age of a country", "the height of a person"], "It is higher in countries with better health care."],
  ["What is literacy?", "the ability to read and write", ["the ability to jump", "the ability to run", "the ability to sing"], "Education helps people earn more."],
  ["Why can a lack of education keep a family in poverty?", "jobs that pay more usually need skills", ["school is boring", "teachers cost money", "children don't want to learn"], "Education opens doors."],
  ["What is fair trade?", "trading that gives workers and farmers fair pay", ["trading only with neighbours", "taxing imports", "trading for free"], "Fair trade labels help shoppers choose."],
  ["What is foreign aid?", "help, such as money or supplies, given to people in other countries", ["a bank loan to a friend", "a tax", "a prize"], "Canada gives aid to many countries."],
  ["What is a microloan?", "a very small loan to help someone start a small business", ["a tax", "a gift", "a bank fee"], "Microloans help many families earn an income."],
  ["What does export mean?", "send goods to another country to sell", ["buy goods from another country", "make goods at home", "throw goods away"], "Canada exports lumber, grain and seafood."],
  ["What does import mean?", "bring goods in from another country", ["send goods away", "burn goods", "make goods"], "Canada imports fruit that doesn't grow in cold climates."],
  ["Why do countries trade?", "they have different resources and skills", ["they have the same things", "they dislike their goods", "they must follow a game"], "Trade allows countries to get what they lack."],
  ["What are the Sustainable Development Goals?", "17 goals adopted by the UN in 2015 to end poverty and protect the planet", ["a list of sports", "a set of recipes", "a school timetable"], "They aim to be reached by 2030."],
  ["Which goal on the UN list is about ending hunger?", "Zero Hunger", ["Quality Education", "Clean Energy", "Life Below Water"], "Food security is a basic need.", true],
  ["How can a big difference between rich and poor affect a society?", "it can cause unfairness and conflict", ["it makes everyone equal", "it ends trade", "it makes weather worse"], "Fairer sharing helps societies."],
  ["Which of these helps reduce poverty?", "good schools, jobs and health care", ["closing schools", "removing clean water", "ending trade"], "Many things work together."],
  ["What is a standard of living?", "the level of comfort and services people have", ["a kind of ruler", "a weather report", "a flag"], "It includes housing, food, health and education."],
  ["What is a sweatshop?", "a factory where people work long hours for very low pay in poor conditions", ["a gym", "a fancy restaurant", "a school"], "Consumers can choose companies with fair labour.", true],
  ["How can shoppers support fair wages?", "choose fair-trade products when they can", ["buy the cheapest item always", "ignore labels", "never buy anything"], "Each choice sends a message.", true],
  ["What does 'distribution of wealth' mean?", "how wealth is shared among people in a society", ["how wealth is counted", "how wealth is spelled", "how wealth is hidden"], "It can be fairly equal or very unequal."],
  ["Which Canadian government program helps share wealth through taxes?", "services paid for by taxes, like schools and health care", ["lottery tickets", "private clubs", "a chain of malls"], "Taxes help pay for public services.", true],
  ["How can food banks and community groups help in Canada?", "they share food and supplies with people in need", ["they remove food", "they raise prices", "they close shops"], "Many communities, including in New Brunswick, rely on volunteers."],
];

export const wabanakiWorldview = bankUnit({
  id: "nb-wabanaki-worldview-7",
  title: "Wabanaki Worldviews & Cultures",
  emoji: "🌅",
  blurb: "Languages, values and respect.",
  parentNote:
    "Practises Wabanaki worldviews, languages, cultures and traditions, with respect for living communities. The content is light, in the present tense, and needs review by Wabanaki partners. It follows the Grade 7 social studies skill descriptors on Wabanaki identity and on culture and identity in the New Brunswick curriculum.",
  standards: ["Wabanaki: Identity, Geography: Human Systems and Interactions", "the worldviews, languages, cultures and traditions of Wabanaki Peoples, and how worldview and culture influence identity"],
  items: WORLDVIEW,
});

export const humanRights = bankUnit({
  id: "nb-human-rights-7",
  title: "Human Rights Around the World",
  emoji: "🕊️",
  blurb: "Declarations, laws and standing up for fairness.",
  parentNote:
    "Practises human rights legislation around the world, including the Universal Declaration of Human Rights, the rights of children and Canadian and New Brunswick law, and taking action as a global citizen. It follows the Grade 7 social studies skill descriptors on rights and responsibilities and on civic engagement in the New Brunswick curriculum.",
  standards: ["Civics: Rights and Responsibilities, Civics: Civic Engagement", "issues relating to human rights legislation around the world and actions as a global citizen"],
  items: RIGHTS,
});

export const globalWealth = bankUnit({
  id: "nb-global-wealth-7",
  title: "Sharing the World’s Wealth",
  emoji: "💰",
  blurb: "Trade, aid and why wealth is shared unevenly.",
  parentNote:
    "Practises the effects of the distribution of wealth around the world, including trade, aid and living standards. It follows the Grade 7 social studies skill descriptor on economic systems in the New Brunswick curriculum.",
  standards: ["Economics: Systems", "the effects of the distribution of wealth around the world"],
  items: WEALTH,
});
