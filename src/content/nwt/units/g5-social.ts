import { bankUnit, type Q } from "../own";

// Grade 5 social studies: Dene Kede, the NWT's Dene curriculum, which stays in NWT schools alongside the adapted
// BC curriculum. Indigenous content is light, in the present tense, never treats all Nations as one, and leaves out
// ceremony. It needs review by Dene partners and NWT Education, Culture and Employment before launch.

const DENE_KEDE: Q[] = [
  ["Dene Kede is…", "a curriculum that teaches from a Dene point of view", ["a kind of boat", "a type of weather"], "Dene Kede is used in NWT schools to weave Dene language, ways of knowing and the land into learning."],
  ["The word Dene means…", "the people", ["the river", "the north"], "Dene is the word many Dene nations use for themselves: the people."],
  ["Dene communities in the NWT are…", "living communities today", ["only part of the past", "all the same"], "Dene people live, work and learn in the NWT now."],
  ["Is every Dene nation exactly the same?", "No, each has its own history and ways", ["Yes, they are all the same", "Yes, they share one language"], "Dene peoples in the NWT include Dehcho, Sahtú, Tłı̨chǫ and Akaitcho communities, each with its own history."],
  ["Which of these is a Dene language of the NWT?", "Tłı̨chǫ", ["Cree", "Haida"], "Tłı̨chǫ is spoken in communities north of Great Slave Lake."],
  ["Which of these is a Dene language of the NWT?", "South Slavey", ["Inuktitut", "Mi'kmaq"], "South Slavey is spoken in the Dehcho region."],
  ["Which of these is a Dene language of the NWT?", "Chipewyan", ["Ojibwe", "Blackfoot"], "Chipewyan (Dëne Sųłıné) is spoken in the east and south of the NWT."],
  ["Which is a respectful way to learn about a Dene nation?", "Listen to the stories its people choose to share", ["Guess and make things up", "Copy things without asking"], "The best teachers are the people of the Nation, including Elders."],
  ["Who are Elders in a Dene community?", "Respected people who share knowledge and guidance", ["The youngest students", "Government clerks"], "Elders share teachings, stories and advice with the community."],
  ["Why do schools teach Dene languages?", "Language carries history and ways of knowing", ["Because it is easy to learn", "Because the law says so"], "Languages hold stories, place names and knowledge."],
  ["Dene Kede teaches about relationships with the land, with other people and…", "with yourself", ["with machines only", "with the weather forecast"], "Learning about yourself, others and the land go together in Dene Kede.", true],
  ["Traditional knowledge about the land is passed on by…", "Elders, families and communities", ["only by textbooks", "no one"], "Many people learn on the land from family and Elders."],
  ["Learning on the land means…", "learning by being outdoors with people who know it", ["learning only from a screen", "never going outside"], "On-the-land learning is part of many NWT schools."],
  ["Place names in a Dene language often…", "describe the land or what happened there", ["are picked at random", "are invented for maps"], "Many names tell what a place is like."],
  ["Treaty 8 and Treaty 11 cover parts of the NWT. A treaty is…", "an agreement between nations", ["a type of map", "a sports rule"], "Treaties are agreements made between First Nations and the Crown."],
  ["What is traditional territory?", "Land a Nation has lived on and cared for over generations", ["Land someone bought last year", "A park for tourists"], "It is land connected to a Nation's history and way of life."],
  ["The Mackenzie River is called Deh Cho by Dene people. Deh Cho means…", "big river", ["cold lake", "high mountain"], "Deh Cho is a Dene name for the Mackenzie River, and also a region of the NWT.", true],
  ["Which is a respectful way to work with an Elder?", "Listen carefully and say thank you", ["Interrupt", "Walk away"], "Listening shows respect and helps you learn."],
  ["Why does it matter to name the specific nation, like Tłı̨chǫ or Dehcho, and not just \"Indigenous people\"?", "It is more accurate and respectful", ["It is shorter", "It means a different country"], "Naming the right nation shows you have learned about it.", true],
  ["Which statement is true?", "Many Dene languages are still spoken and taught today", ["Dene languages are lost forever", "Dene languages are only in museums"], "Language programs and schools help young people learn them."],
  ["Land claim and self-government agreements in the NWT were…", "negotiated by Indigenous nations with governments", ["decided without them", "written by tourists"], "Examples include the Tłı̨chǫ Agreement (2005).", true],
  ["A river can be important to a Nation because it…", "gives food, travel routes and a place to gather", ["is only a map line", "has no use"], "Rivers and lakes connect communities.", true],
  ["Which of these is a good way to look after the land?", "Not leaving garbage behind", ["Dumping oil", "Burning plastic"], "Caring for the land is a shared responsibility."],
  ["Sharing stories helps a community…", "keep its history and language strong", ["forget the past", "stop talking"], "Stories carry knowledge from one generation to the next."],
  ["Which is a Dene nation or region of the NWT?", "Dehcho", ["Haida Gwaii", "Nunavik"], "Dehcho is a region in the southwest of the NWT.", true],
];

export const units = [
  bankUnit({
    id: "nt-dene-kede",
    title: "Dene Kede: Learning from the Land",
    emoji: "🌲",
    blurb: "Dene languages, Elders and caring for the land in the NWT.",
    parentNote: "Dene Kede is an NWT curriculum from a Dene perspective that stays in schools alongside the adapted BC curriculum. This unit covers Dene peoples and languages, Elders, learning on the land and treaties. Present tense, living communities.",
    standards: ["Dene Kede", "Dene peoples, languages and learning from the land in the NWT"],
    items: DENE_KEDE,
  }),
];
