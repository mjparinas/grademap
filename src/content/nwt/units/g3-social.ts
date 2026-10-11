import { bankUnit, type Q } from "../own";

// Grade 3 social studies: our territory, the Northwest Territories. Geography, communities and the 11 official
// languages. Indigenous content is light, in the present tense, and never treats all Nations as one.

const TERRITORY: Q[] = [
  ["Which city is the capital of the Northwest Territories?", "Yellowknife", ["Whitehorse", "Iqaluit"], "Yellowknife is the capital and the largest community in the NWT."],
  ["The Northwest Territories is one of Canada's…", "three territories", ["ten provinces", "two oceans"], "Canada has ten provinces and three territories: Yukon, the Northwest Territories and Nunavut."],
  ["Which is a territory next to the NWT on the west?", "Yukon", ["Ontario", "Quebec"], "Yukon is west of the NWT."],
  ["Which is a territory next to the NWT on the east?", "Nunavut", ["Manitoba", "Nova Scotia"], "Nunavut is to the east of the NWT."],
  ["Which body of water touches the north of the NWT?", "Arctic Ocean", ["Atlantic Ocean", "Pacific Ocean"], "The NWT's northern coast is on the Arctic Ocean (the Beaufort Sea)."],
  ["Which lake is in the NWT and is one of the biggest in North America?", "Great Slave Lake", ["Lake Ontario", "Lake Winnipeg"], "Yellowknife sits on the north shore of Great Slave Lake."],
  ["Which long river flows north through the NWT to the Arctic Ocean?", "Mackenzie River", ["Fraser River", "Ottawa River"], "The Mackenzie is one of Canada's longest rivers."],
  ["How many official languages does the NWT have?", "11", ["3", "40"], "The NWT has 11 official languages, more than any other place in Canada."],
  ["Which of these is an official language of the NWT?", "Tłı̨chǫ", ["Mandarin", "Spanish"], "Tłı̨chǫ is an Indigenous language spoken in the NWT. It is one of the 11 official languages."],
  ["Which of these is an official language of the NWT?", "Gwich'in", ["Hindi", "German"], "Gwich'in is spoken in the northwest of the NWT."],
  ["Which two languages are official in the NWT along with nine Indigenous languages?", "English and French", ["Latin and Greek", "Russian and Japanese"], "The 11 official languages are nine Indigenous languages, English and French."],
  ["Many NWT communities are far apart. In winter, people can drive on…", "ice roads", ["subways", "cable cars"], "Frozen lakes and rivers become roads in winter in many northern places."],
  ["What can people often see in the night sky in the NWT?", "the northern lights", ["a double moon", "a rainbow at midnight"], "The aurora borealis is bright in the NWT's dark winter skies."],
  ["In summer in the far north the sun…", "stays up for many hours", ["never rises", "sets at noon"], "Summer days in the north are very long."],
  ["Which community is on the Arctic coast of the NWT?", "Tuktoyaktuk", ["Hay River", "Fort Smith"], "Tuktoyaktuk, nicknamed Tuk, is on the Arctic Ocean."],
  ["Which community is on the south shore of Great Slave Lake?", "Hay River", ["Inuvik", "Tuktoyaktuk"], "Hay River is a port town on Great Slave Lake."],
  ["Which is a large park in the south of the NWT?", "Wood Buffalo National Park", ["Banff National Park", "Pacific Rim National Park"], "Wood Buffalo National Park reaches into the NWT and Alberta."],
  ["A community is…", "a group of people who live and work together", ["a type of tree", "a kind of weather"], "Communities can be small or large."],
  ["Why do many NWT communities depend on airplanes?", "Some have no all-season road", ["Planes are cheaper than walking", "There are no airports"], "Planes bring people, food and mail to places far from highways."],
  ["Which direction is the NWT from Alberta?", "north", ["south", "east"], "The NWT is north of Alberta and Saskatchewan."],
  ["The NWT is in which part of Canada?", "the north", ["the south", "the Atlantic coast"], "The territory stretches north to the Arctic Ocean.", true],
  ["Nunavut became its own territory in…", "1999", ["1867", "2020"], "Before 1999, Nunavut was part of the NWT.", true],
  ["How can people reach Tuktoyaktuk on the Arctic coast all year by car?", "The Inuvik to Tuktoyaktuk Highway", ["A train from Yellowknife", "A subway"], "The highway opened in 2017 and reaches the Arctic Ocean.", true],
  ["Why are place names in Indigenous languages important in the NWT?", "They carry the history of the land", ["They are only decoration", "They are easy to spell"], "Many names tell what a place is like or what happened there.", true],
  ["Which statement is true?", "The NWT has Indigenous peoples with different languages and cultures", ["All people in the NWT speak the same language", "Nobody lives in the NWT"], "The NWT is home to many Indigenous nations.", true],
];

export const units = [
  bankUnit({
    id: "nt-our-territory",
    title: "Our Territory: The NWT",
    emoji: "🧭",
    blurb: "Meet the lakes, rivers, communities and languages of the Northwest Territories.",
    parentNote: "NWT schools add local knowledge to the adapted BC curriculum. This unit covers where the Northwest Territories is, its capital, big lakes and rivers, communities and 11 official languages. Present tense, living communities.",
    standards: ["Northwest Territories", "places, communities and official languages of the Northwest Territories"],
    items: TERRITORY,
  }),
];
