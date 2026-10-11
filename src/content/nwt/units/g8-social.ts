import { bankUnit, type Q } from "../own";

// Grade 8 social studies: treaties, land claims and self-government in the NWT. Indigenous content is light, in the
// present tense, and never treats all Nations as one. It needs review by Indigenous partners and NWT Education,
// Culture and Employment before launch.

const AGREEMENTS: Q[] = [
  ["A treaty is…", "an agreement between nations", ["a kind of map", "a sports rule"], "Treaties are agreements between First Nations and the Crown."],
  ["Treaty 8 was first made in…", "1899", ["1799", "1999"], "Treaty 8 covers parts of the NWT, Alberta, BC and Saskatchewan."],
  ["Treaty 11 was made in…", "1921", ["1821", "2021"], "Treaty 11 covers much of the NWT."],
  ["A land claim agreement is…", "a modern agreement about land, rights and decisions", ["a tax form", "a weather map"], "Several NWT nations negotiated them with governments."],
  ["The Inuvialuit Final Agreement was signed in…", "1984", ["1884", "2004"], "It was the first comprehensive land claim in the NWT."],
  ["The Gwich'in Comprehensive Land Claim Agreement was signed in…", "1992", ["1892", "2012"], "It covers the Gwich'in Settlement Area."],
  ["The Sahtú Dene and Métis Comprehensive Land Claim Agreement was signed in…", "1993", ["1793", "2013"], "It covers the Sahtú Settlement Area."],
  ["The Tłı̨chǫ Agreement took effect in…", "2005", ["1905", "1985"], "It gave the Tłı̨chǫ Government law-making powers for Tłı̨chǫ lands and citizens."],
  ["Nunavut became a territory in…", "1999", ["1867", "2020"], "It was created from the eastern part of the old NWT."],
  ["Self-government means a nation can…", "make decisions for its own citizens and lands", ["decide the weather", "close the country"], "Self-government is about making your own decisions."],
  ["Devolution moved decision-making about lands and resources from Canada to…", "the Government of the NWT", ["a mining company", "the United States"], "It took effect on April 1, 2014."],
  ["Which levels of government can affect people in the NWT?", "Indigenous, territorial and federal", ["Only a school", "Only one"], "Many people live under several governments at once."],
  ["Where does the NWT government meet?", "Yellowknife", ["Ottawa", "Whitehorse"], "Yellowknife is the capital."],
  ["The NWT Legislative Assembly is run by consensus. That means…", "there are no political parties and members work together", ["only one party rules", "no one votes"], "The NWT uses consensus government.", true],
  ["Why are agreements written down and signed?", "So everyone understands what was promised", ["So they can be lost", "Because paper is shiny"], "Written agreements make promises clear."],
  ["Who negotiated modern land claims in the NWT?", "Indigenous nations with the governments of Canada and the NWT", ["Only the federal government", "A private company"], "They were negotiated for years."],
  ["Which region is the Inuvialuit Settlement Region part of?", "the western Arctic", ["the Atlantic coast", "southern Ontario"], "It includes Inuvik and Tuktoyaktuk."],
  ["Why do governments consult Indigenous nations before big projects?", "Decisions affect their lands and rights", ["It is only a custom", "To delay everything"], "Consultation is part of respecting agreements and rights.", true],
  ["A land claim can include…", "ownership of land and a say in decisions", ["only gifts", "nothing at all"], "Agreements set out rights, land and responsibilities.", true],
  ["Which statement is true?", "Treaties and land claims are living agreements still in use today", ["They are only history", "They have been cancelled"], "Nations and governments still work under them.", true],
  ["A citizen's role in government includes…", "voting when old enough and sharing opinions", ["skipping every meeting", "never learning about it"], "Citizens help shape decisions."],
  ["Why are Elders asked for advice?", "They carry knowledge and experience", ["They pick the weather", "They must sign every cheque"], "Elders help guide decisions.", true],
  ["The Mackenzie River Valley is important to…", "many nations as a travel and food route", ["no one", "only tourists"], "Rivers connect communities.", true],
  ["Which is the best way to describe the nations of the NWT?", "By their own names", ["With one name for all", "As people of the past"], "Using the right names shows respect.", true],
];

export const units = [
  bankUnit({
    id: "nt-treaties-agreements",
    title: "Treaties, Land Claims and Self-Government",
    emoji: "📜",
    blurb: "How Indigenous nations and governments in the NWT made agreements.",
    parentNote: "NWT schools add local knowledge to the adapted BC curriculum. This unit covers Treaty 8 and 11, modern land claims, the Tłı̨chǫ Agreement, devolution and consensus government. Present tense, living communities.",
    standards: ["Northwest Territories", "treaties, land claims and self-government in the Northwest Territories"],
    items: AGREEMENTS,
  }),
];
