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
