import { bankUnit, type Q } from "../own";

// Grade 4 social studies: the peoples and languages of the NWT, with the Gwich'in, Sahtú Dene and Métis, Tłı̨chǫ,
// Dehcho, Akaitcho, Inuvialuit and Métis. Indigenous content is light, in the present tense, and never treats all
// Nations as one. It needs review by Indigenous partners and NWT Education, Culture and Employment before launch.

const PEOPLES: Q[] = [
  ["How many official languages does the NWT have?", "11", ["3", "40"], "Nine are Indigenous languages, plus English and French."],
  ["Which of these is an official language of the NWT?", "North Slavey", ["Latin", "Swahili"], "North Slavey is spoken in the Sahtú region around Great Bear Lake."],
  ["Which of these is an official language of the NWT?", "Cree", ["Greek", "Italian"], "Cree is one of the NWT's 11 official languages."],
  ["Which of these is an official language of the NWT?", "Inuvialuktun", ["Portuguese", "Polish"], "Inuvialuktun is spoken by the Inuvialuit in the western Arctic."],
  ["Which of these is an official language of the NWT?", "Inuinnaqtun", ["Dutch", "Korean"], "Inuinnaqtun is an Inuit language."],
  ["Which of these is an official language of the NWT?", "Inuktitut", ["Russian", "Arabic"], "Inuktitut is an Inuit language."],
  ["Which of these is an official language of the NWT?", "South Slavey", ["Turkish", "Vietnamese"], "South Slavey is spoken in the Dehcho region."],
  ["Which of these is an official language of the NWT?", "Chipewyan", ["Hebrew", "Swedish"], "Chipewyan (Dëne Sųłıné) is spoken in the east and south."],
  ["The Gwich'in live mainly in the…", "Mackenzie Delta area", ["far south near Alberta", "Great Slave Lake's south shore"], "Aklavik, Fort McPherson and Tsiigehtchic are Gwich'in communities."],
  ["The Sahtú region is around which lake?", "Great Bear Lake", ["Lake Ontario", "Lake Erie"], "Délı̨nę is on Great Bear Lake."],
  ["The Tłı̨chǫ live mainly…", "north of Great Slave Lake", ["on the Arctic coast", "in southern Alberta"], "Behchokǫ̀ is the largest Tłı̨chǫ community."],
  ["Who are the Inuvialuit?", "The Inuit of the western Canadian Arctic", ["People from the south", "A kind of animal"], "They live in the Inuvialuit Settlement Region."],
  ["Who are the Métis?", "A distinct Indigenous people with their own history and culture", ["Visitors to the NWT", "A kind of language"], "Métis communities in the NWT include Fort Smith and Hay River."],
  ["Are all Indigenous peoples in the NWT the same?", "No, each has its own history, language and ways", ["Yes, all are the same", "Yes, all speak one language"], "The NWT is home to Dene, Inuvialuit and Métis peoples, among others."],
  ["Dene peoples, Inuvialuit and Métis in the NWT are…", "living communities today", ["only part of the past", "gone"], "People live, work, teach and lead in the NWT now."],
  ["Why do communities teach their own languages in school?", "Language carries history and ways of knowing", ["It is the easiest subject", "The law makes them"], "Languages hold stories, place names and knowledge."],
  ["Which is a respectful way to learn about a people?", "Listen to the stories they choose to share", ["Guess and make things up", "Copy things without asking"], "The best teachers are the people themselves."],
  ["What is a region?", "An area with shared features or a shared name", ["A kind of fruit", "A school rule"], "The NWT has regions such as the Sahtú, Dehcho and Inuvialuit Settlement Region."],
  ["Who are Elders?", "Respected people who share knowledge and guidance", ["The youngest students", "Government clerks"], "Elders help keep languages and stories strong."],
  ["Which community is the largest in the NWT?", "Yellowknife", ["Tuktoyaktuk", "Délı̨nę"], "Yellowknife is the capital and the largest community."],
  ["Which of these is a Gwich'in community?", "Fort McPherson", ["Hay River", "Fort Smith"], "Fort McPherson is in the Mackenzie Delta area.", true],
  ["Which of these is a Tłı̨chǫ community?", "Whatì", ["Tuktoyaktuk", "Aklavik"], "Whatì is north of Great Slave Lake.", true],
  ["Which region is on the Mackenzie River in the southwest?", "Dehcho", ["Inuvialuit Settlement Region", "Sahtú"], "Dehcho means big river.", true],
  ["Which of these is a Sahtú community?", "Norman Wells", ["Hay River", "Behchokǫ̀"], "Norman Wells is on the Mackenzie River.", true],
  ["Naming a specific nation, like Gwich'in or Tłı̨chǫ, instead of one word for everyone is…", "more accurate and respectful", ["too long to use", "against the rules"], "Each nation has its own name for itself.", true],
];

export const units = [
  bankUnit({
    id: "nt-peoples-languages",
    title: "Peoples and Languages of the NWT",
    emoji: "🗣️",
    blurb: "Meet the Dene, Inuvialuit and Métis, and the 11 official languages.",
    parentNote: "NWT schools add local knowledge to the adapted BC curriculum. This unit covers the NWT's Indigenous peoples, regions, communities and 11 official languages. Present tense, living communities.",
    standards: ["Our Languages", "Indigenous peoples, regions and official languages of the NWT"],
    items: PEOPLES,
  }),
];
