import { bankUnit, type Q } from "../own";

// Grade 6 social studies: Inuuqatigiit, the NWT's Inuit curriculum, which stays in NWT schools alongside the
// adapted BC curriculum, with the Inuvialuit of the western Arctic. Indigenous content is light, in the present
// tense, and leaves out ceremony. It needs review by Inuvialuit partners and NWT Education, Culture and
// Employment before launch.

const INUUQATIGIIT: Q[] = [
  ["Inuuqatigiit is…", "a curriculum that teaches from an Inuit point of view", ["a type of boat", "a weather report"], "Inuuqatigiit is used in NWT schools to bring Inuit language, values and ways of knowing into learning."],
  ["Who are the Inuvialuit?", "The Inuit of the western Canadian Arctic", ["People from Europe", "A kind of animal"], "Inuvialuit live in the Inuvialuit Settlement Region in the north of the NWT."],
  ["Inuvialuit communities today are…", "living communities with schools, leaders and young people", ["only part of the past", "empty"], "Inuvialuit live and work in the NWT now."],
  ["Which of these is an Inuvialuit community?", "Tuktoyaktuk", ["Hay River", "Fort Smith"], "Tuktoyaktuk is on the Arctic coast."],
  ["Which of these is an Inuvialuit community?", "Ulukhaktok", ["Behchokǫ̀", "Yellowknife"], "Ulukhaktok is on Victoria Island."],
  ["Which of these is an Inuvialuit community?", "Paulatuk", ["Fort Simpson", "Hay River"], "Paulatuk is on the Arctic coast."],
  ["The Inuvialuit language is called…", "Inuvialuktun", ["Tłı̨chǫ", "Gwich'in"], "Inuvialuktun is one of the NWT's 11 official languages."],
  ["Inuinnaqtun is…", "an Inuit language spoken in the NWT", ["a kind of sled", "a river"], "Inuinnaqtun and Inuktitut are also official languages of the NWT."],
  ["Why do communities work to keep Inuit languages strong?", "Language carries history and ways of knowing", ["Because it is easy to learn", "Because the law says so"], "Languages hold stories, names and knowledge."],
  ["Is every Indigenous nation in the NWT the same?", "No, each has its own history and language", ["Yes, all are the same", "Yes, all share one language"], "Inuvialuit, Gwich'in and Dene nations are different from one another."],
  ["Who are Elders in an Inuit community?", "Respected people who share knowledge and guidance", ["The youngest students", "Government clerks"], "Elders share teachings and stories."],
  ["The Inuvialuit Final Agreement was signed in…", "1984", ["1867", "2015"], "It was the first comprehensive land claim agreement in the NWT.", true],
  ["The Inuvialuit Final Agreement is an agreement about…", "land, rights and decisions in the western Arctic", ["a hockey game", "a recipe"], "It was negotiated by the Inuvialuit with the Government of Canada."],
  ["Which ocean is next to the Inuvialuit Settlement Region?", "Arctic Ocean", ["Atlantic Ocean", "Indian Ocean"], "The Arctic coast and the Beaufort Sea are home waters of the Inuvialuit."],
  ["Inuvik is…", "a town in the NWT north of the Arctic Circle", ["a river in Ontario", "a mountain in Alberta"], "Inuvik is a regional centre for the western Arctic.", true],
  ["What can the land and sea give people in the Arctic?", "Food, travel routes and a place to gather", ["Nothing", "Only snow"], "Many people hunt, fish and travel on the land and sea."],
  ["Which is a respectful way to learn about the Inuvialuit?", "Listen to the stories their people choose to share", ["Guess and make things up", "Copy things without asking"], "The best teachers are the people themselves."],
  ["Which is the best way to describe Indigenous peoples of the NWT?", "By their own nation's name", ["With one name for everyone", "As people from the past"], "Naming the right nation shows respect.", true],
  ["In summer in the far north the sun…", "stays up for many hours", ["never rises", "sets at noon"], "Summer days near the Arctic Ocean are very long."],
  ["In winter in the far north there are…", "very short days", ["no clouds ever", "no cold weather"], "Winter days in the Arctic are short and dark."],
  ["Learning on the land is…", "learning outdoors with people who know it", ["learning only from screens", "never allowed"], "Many NWT schools include on-the-land programs."],
  ["Why do people use warm clothing in the Arctic?", "To stay safe in the cold", ["Only for fashion", "To be heavier"], "Clothing made for the cold keeps people warm and safe.", true],
  ["Which statement is true?", "Inuit languages are still spoken and taught today", ["They are lost forever", "They are only found in museums"], "Schools and communities teach them to young people.", true],
  ["A land claim agreement is…", "an agreement about land and rights", ["a tax form", "a weather map"], "Several NWT nations negotiated land claim agreements.", true],
  ["Which two Indigenous peoples are neighbours of the Inuvialuit in the NWT?", "The Gwich'in and the Dene", ["Mi'kmaq and Cree", "Haida and Tlingit"], "The Gwich'in live in the Mackenzie Delta area.", true],
];

export const units = [
  bankUnit({
    id: "nt-inuuqatigiit",
    title: "Inuuqatigiit: Inuvialuit Today",
    emoji: "🐻‍❄️",
    blurb: "Meet the Inuvialuit, their communities and language in the western Arctic.",
    parentNote: "Inuuqatigiit is an NWT curriculum from an Inuit perspective that stays in schools alongside the adapted BC curriculum. This unit covers the Inuvialuit, their communities, language, land claim and learning from the land. Present tense, living communities.",
    standards: ["Inuuqatigiit", "the Inuvialuit, their communities, language and land claim in the NWT"],
    items: INUUQATIGIIT,
  }),
];
