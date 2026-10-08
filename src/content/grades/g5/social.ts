import { pick, sample, shuffle, textChoice } from "../../random";
import type { Course, GenerateOptions, OrderQuestion, Question, Visual } from "../../types";
import { sortQuestion, type BankItem, type SortSet } from "../../bank";

// Grade 5 social studies: Canadian government and law, rights and freedoms,
// immigration and multiculturalism, past discriminatory policies and their
// legacies, and the resources and regions of Canada. Bank items marked `hard`
// are stretch questions: difficulty 1 uses only the core items, 2 mixes in
// about a third, 3 is mostly stretch.

type Level = NonNullable<GenerateOptions["difficulty"]>;
type Item = BankItem & { hard?: true; visual?: Visual };

function toQuestion(b: Item): Question {
  const visual: Visual | undefined =
    b.visual ?? (b.emoji ? { type: "emoji", emoji: b.emoji, caption: b.caption } : undefined);
  const q = textChoice(b.prompt, b.right, b.wrong, b.hint, visual);
  if (b.speak) q.speak = b.speak;
  return q;
}

function levelled(bank: Item[], count: number, difficulty: Level): Question[] {
  const easy = bank.filter((b) => !b.hard);
  const hard = bank.filter((b) => b.hard);
  const want = difficulty === 1 ? 0 : difficulty === 2 ? Math.ceil(count / 3) : Math.ceil((count * 2) / 3);
  const nHard = Math.min(want, hard.length);
  return [...sample(easy, count - nHard), ...sample(hard, nHard)].map(toQuestion);
}

/** Two-basket sorts grow with difficulty (4, 6 or 8 items). */
const perBin = (d: Level) => (d === 1 ? 2 : d === 2 ? 3 : 4);

interface HistoryEvent {
  year: number;
  label: string;
  emoji?: string;
}

function gapsOk(events: HistoryEvent[], minGap: number): boolean {
  return events.every((e, i) => i === 0 || e.year - events[i - 1].year >= minGap);
}

/** A timeline: `n` events at least `minGap` years apart, listed oldest first. */
function timeline(events: HistoryEvent[], n: number, minGap: number, prompt: string): OrderQuestion {
  const byYear = (list: HistoryEvent[]) => [...list].sort((a, b) => a.year - b.year);
  let chosen = byYear(sample(events, n));
  for (let tries = 0; tries < 60 && !gapsOk(chosen, minGap); tries++) chosen = byYear(sample(events, n));
  if (!gapsOk(chosen, minGap)) {
    const all = byYear(events);
    chosen = Array.from({ length: n }, (_, i) => all[Math.round((i * (all.length - 1)) / (n - 1))]);
  }
  return {
    kind: "order",
    prompt,
    hint: `Check the years, then put the earliest first. ${shuffle(chosen).map((e) => `${e.label} (${e.year}).`).join(" ")}`,
    items: chosen.map((e) => ({ id: `y${e.year}`, label: e.label, emoji: e.emoji })),
  };
}

// ---------- Levels of Government ----------

type Level3 = "federal" | "provincial" | "municipal";

const LEVEL_LABEL: Record<Level3, string> = {
  federal: "federal (Parliament and the Prime Minister)",
  provincial: "provincial (the legislature and the Premier)",
  municipal: "municipal (the city or town council)",
};

const GOV_TABLE: Visual = {
  type: "table",
  title: "Canada's levels of government",
  headers: ["Level", "Leader", "Elected representatives", "Looks after (examples)"],
  rows: [
    ["Federal", "Prime Minister", "Members of Parliament (MPs)", "passports, the military, money"],
    ["Provincial or territorial", "Premier", "Members of the legislature (MLAs in most provinces)", "schools, hospitals, highways"],
    ["Municipal", "Mayor", "Councillors", "garbage pickup, local streets, tap water"],
  ],
};

const GOV_SCENARIOS: { text: string; level: Level3 }[] = [
  { text: "The streetlight outside Zoe's house has burned out.", level: "municipal" },
  { text: "Leo wants a crosswalk added on his street.", level: "municipal" },
  { text: "Priya's recycling bin was skipped on pickup day.", level: "municipal" },
  { text: "Ravi's family needs passports for a trip.", level: "federal" },
  { text: "Noah wants to share his opinion about Canada's rules for new immigrants.", level: "federal" },
  { text: "Jay has an idea for a new design on Canada's coins.", level: "federal" },
  { text: "Ana is worried about long wait times at the hospital.", level: "provincial" },
  { text: "Maya thinks students in her province need more school counsellors.", level: "provincial" },
  { text: "Amir wants the provincial park near his town to stay open longer each year.", level: "provincial" },
];

function govScenario(s: { text: string; level: Level3 }, showTable: boolean): Question {
  const others = (Object.keys(LEVEL_LABEL) as Level3[]).filter((l) => l !== s.level);
  return textChoice(
    `${s.text} Which level of government is responsible for this?`,
    LEVEL_LABEL[s.level],
    others.map((l) => LEVEL_LABEL[l]),
    "Think about which level of government is responsible. Local services are municipal; schools and health care are provincial; things for the whole country are federal.",
    showTable ? GOV_TABLE : { type: "emoji", emoji: "🏛️" },
  );
}

const GOV_SORT: SortSet = {
  prompt: "Which level of government is mainly responsible? Tap an item, then tap its basket.",
  hint: "Federal looks after the whole country. Provincial looks after things like schools and hospitals. Municipal looks after local services.",
  bins: [
    { id: "federal", label: "federal", emoji: "🍁" },
    { id: "provincial", label: "provincial", emoji: "🏛️" },
    { id: "municipal", label: "municipal", emoji: "🏘️" },
  ],
  items: [
    { label: "printing money", emoji: "💵", bin: "federal" },
    { label: "the Canadian Armed Forces", emoji: "🪖", bin: "federal" },
    { label: "passports", emoji: "🛂", bin: "federal" },
    { label: "mail delivery by Canada Post", emoji: "📬", bin: "federal" },
    { label: "public schools", emoji: "🏫", bin: "provincial" },
    { label: "hospitals", emoji: "🏥", bin: "provincial" },
    { label: "driver's licences", emoji: "🚗", bin: "provincial" },
    { label: "provincial parks", emoji: "🏞️", bin: "provincial" },
    { label: "garbage and recycling pickup", emoji: "🗑️", bin: "municipal" },
    { label: "tap water and sewers", emoji: "🚰", bin: "municipal" },
    { label: "fire halls", emoji: "🚒", bin: "municipal" },
    { label: "dog licences", emoji: "🐕", bin: "municipal" },
  ],
};

const GOV_BANK: Item[] = [
  {
    prompt: "Who leads the federal government of Canada?",
    right: "the Prime Minister",
    wrong: ["a Premier", "a Mayor", "the Governor General"],
    hint: "The Prime Minister leads the federal government. Premiers lead provinces and territories, and mayors lead cities and towns.",
    emoji: "🍁",
  },
  {
    prompt: "Who leads a provincial government?",
    right: "the Premier",
    wrong: ["the Prime Minister", "the Mayor", "the Lieutenant Governor"],
    hint: "Each province and territory has a Premier as the head of its government.",
    emoji: "🏛️",
  },
  {
    prompt: "Who leads a city or town council?",
    right: "the Mayor",
    wrong: ["the Premier", "the Prime Minister", "a Senator"],
    hint: "Voters in a city or town elect a mayor and councillors to run local government.",
    emoji: "🏘️",
  },
  {
    prompt: "In which city does Canada's federal Parliament meet?",
    right: "Ottawa",
    wrong: ["Toronto", "Vancouver", "Montréal"],
    hint: "Ottawa, in Ontario, is Canada's capital city. Parliament meets there.",
  },
  {
    prompt: "Which level of government usually picks up garbage and recycling?",
    right: "municipal",
    wrong: ["federal", "provincial"],
    hint: "Everyday local services, like garbage pickup and tap water, are run by your city or town.",
    emoji: "🗑️",
  },
  {
    prompt: "Which level of government is mainly responsible for public schools?",
    right: "provincial or territorial",
    wrong: ["federal", "municipal"],
    hint: "Education is a provincial and territorial responsibility. That's why school rules can differ between provinces.",
    emoji: "🏫",
  },
  {
    prompt: "How many provinces and territories does Canada have?",
    right: "10 provinces and 3 territories",
    wrong: ["13 provinces and no territories", "8 provinces and 5 territories", "10 provinces and 2 territories"],
    hint: "The three territories are Yukon, the Northwest Territories and Nunavut.",
    emoji: "🗺️",
  },
  {
    prompt: "Which level of government is responsible for Canada's army, navy and air force?",
    right: "federal",
    wrong: ["provincial", "municipal"],
    hint: "Defending the whole country is a federal job.",
    emoji: "🪖",
  },
  {
    prompt: "Where do governments get most of the money they spend on services?",
    right: "taxes paid by people and businesses",
    wrong: ["printing as much new money as they want", "selling public parks", "parking tickets alone"],
    hint: "Taxes pay for schools, hospitals, roads and other services we share.",
    emoji: "💵",
  },
  {
    prompt: "Which level of government issues Canadian passports?",
    right: "federal",
    wrong: ["provincial", "municipal"],
    hint: "Passports are for travelling outside the country, so the federal government is in charge of them.",
    emoji: "🛂",
  },
  {
    hard: true,
    prompt: "Municipal governments get much of their money from which tax?",
    right: "property tax",
    wrong: ["income tax", "the GST", "passport fees"],
    hint: "Owners of homes and businesses pay property tax to their city or town. It helps pay for local services.",
  },
  {
    hard: true,
    prompt: "Who represents the King in Canada at the federal level?",
    right: "the Governor General",
    wrong: ["the Prime Minister", "the Speaker of the House", "a Premier"],
    hint: "The King is Canada's head of state. The Governor General represents him federally, and Lieutenant Governors do so in the provinces.",
  },
  {
    hard: true,
    prompt: "Some First Nations govern themselves under self-government agreements. What might a First Nation government decide about?",
    right: "land, housing, education and language programs for its community",
    wrong: ["printing Canada's money", "running the Canadian Armed Forces", "issuing Canadian passports"],
    hint: "Indigenous governments make decisions for their own communities. Money, the military and passports are federal responsibilities.",
    emoji: "🤝",
  },
  {
    hard: true,
    prompt: "Which document divides powers between the federal and provincial governments?",
    right: "the Constitution, starting with the Constitution Act, 1867",
    wrong: ["the Charter of the United Nations", "a city bylaw", "the Indian Act"],
    hint: "When Canada formed in 1867, its Constitution listed which powers belonged to the federal government and which to the provinces.",
    emoji: "📜",
  },
  {
    hard: true,
    prompt: "Why does Canada have provinces with their own governments, not just one government for everything?",
    right: "regions are very different, so provinces can make choices that fit local needs",
    wrong: ["Canada is too small for one government", "every province speaks a different language", "provinces are separate countries"],
    hint: "Canada is huge and diverse. Sharing power lets each province shape schools, health care and resources to fit its people.",
  },
  {
    hard: true,
    prompt: "In the provinces, natural resources like forests and minerals are mostly managed by which level of government?",
    right: "provincial",
    wrong: ["municipal", "federal only"],
    hint: "The Constitution gives provinces control over most natural resources within their borders.",
    emoji: "🌲",
  },
  {
    hard: true,
    prompt: "The Government of Canada recognizes that Indigenous peoples have an inherent right to self-government. What does 'inherent' mean here?",
    right: "the right comes from being the first peoples of this land, not from another government",
    wrong: ["the right was invented in 2020", "the right only applies in big cities", "the right was a gift from the Prime Minister"],
    hint: "Indigenous peoples governed themselves long before Canada existed. 'Inherent' means the right already belongs to them.",
  },
  {
    hard: true,
    prompt: "How are territories different from provinces?",
    right: "territories get their powers from the federal Parliament",
    wrong: ["territories have no government at all", "territories are run by city councils", "territories can't elect anyone"],
    hint: "Provinces get their powers from the Constitution. Territories have elected governments, but their powers are given to them by federal law.",
  },
];

function government({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const scenarios = sample(GOV_SCENARIOS, 2).map((s) => govScenario(s, difficulty < 3));
  return shuffle([sortQuestion(GOV_SORT, 2), ...scenarios, ...levelled(GOV_BANK, 5, difficulty)]);
}

// ---------- Making Laws ----------

function billOrder(d: Level): OrderQuestion {
  const steps =
    d === 1
      ? [
          { id: "intro", label: "A bill is introduced in the House of Commons", emoji: "📄" },
          { id: "house", label: "MPs vote to pass the bill", emoji: "✋" },
          { id: "senate", label: "The Senate reviews it and votes", emoji: "🏛️" },
          { id: "assent", label: "The Governor General gives Royal Assent", emoji: "✍️" },
        ]
      : [
          { id: "intro", label: "A bill is introduced in the House of Commons", emoji: "📄" },
          { id: "debate", label: "MPs debate it and a committee studies it", emoji: "💬" },
          { id: "house", label: "MPs vote to pass the bill", emoji: "✋" },
          { id: "senate", label: "The Senate reviews it and votes", emoji: "🏛️" },
          { id: "assent", label: "The Governor General gives Royal Assent", emoji: "✍️" },
        ];
  return {
    kind: "order",
    prompt: "Put the steps for a federal bill becoming a law in order.",
    hint: "A bill starts in the House of Commons, where it's debated and voted on. Then the Senate reviews it. Royal Assent is always the last step.",
    items: steps,
  };
}

const ELECTION_ORDER: OrderQuestion = {
  kind: "order",
  prompt: "Put the steps of a federal election in order.",
  hint: "First the election is called and candidates campaign. Then people vote, the votes are counted, and the results decide who forms the government.",
  items: [
    { id: "call", label: "An election is called", emoji: "📣" },
    { id: "campaign", label: "Candidates in each riding share their ideas", emoji: "🗣️" },
    { id: "vote", label: "Citizens 18 and older vote by secret ballot", emoji: "🗳️" },
    { id: "count", label: "Votes are counted in each riding", emoji: "🔢" },
    { id: "govern", label: "The party with the most seats usually forms the government", emoji: "🏛️" },
  ],
};

const PARTICIPATE_SORT: SortSet = {
  prompt: "Can a Grade 5 student do this now, or only an adult citizen? Tap an item, then tap its basket.",
  hint: "Voting and running in elections are for Canadian citizens 18 and older. Anyone, at any age, can learn, speak up and help their community.",
  bins: [
    { id: "now", label: "I can do this now", emoji: "🧒" },
    { id: "adult", label: "adult citizens (18+)", emoji: "🗳️" },
  ],
  items: [
    { label: "write a letter to your MP", emoji: "✉️", bin: "now" },
    { label: "run for student council", emoji: "🏫", bin: "now" },
    { label: "watch a public council meeting", emoji: "👀", bin: "now" },
    { label: "volunteer in your community", emoji: "🤲", bin: "now" },
    { label: "learn about issues in the news", emoji: "📰", bin: "now" },
    { label: "vote in a federal election", emoji: "🗳️", bin: "adult" },
    { label: "vote in a provincial election", emoji: "✅", bin: "adult" },
    { label: "run to become an MP", emoji: "🏛️", bin: "adult" },
    { label: "run to become mayor", emoji: "🏘️", bin: "adult" },
  ],
};

const BIKE_PASSAGE: Visual = {
  type: "passage",
  title: "The Bike Lane Bylaw",
  paragraphs: [
    "Students at Riverside School noticed that many kids biked to school along a busy road with no bike lane. Amir and Priya started a petition, and 300 people signed it to ask for a safe bike lane.",
    "Town council meetings are open to the public, and residents can ask to speak. At the next meeting, the students showed a map of the road and explained why it felt unsafe.",
    "The councillors asked questions and debated the cost. Some worried that the bike lane would take away parking spaces. A month later, council voted 5 to 2 to pass a bylaw to build the bike lane.",
  ],
};

const BIKE_ITEMS: Item[] = [
  {
    prompt: "Which level of government made the decision in the passage?",
    right: "municipal (the town council)",
    wrong: ["federal (Parliament)", "provincial (the legislature)"],
    hint: "Town councils make bylaws for local things like streets and bike lanes.",
    visual: BIKE_PASSAGE,
  },
  {
    prompt: "What is a list of signatures asking leaders for a change called?",
    right: "a petition",
    wrong: ["a bylaw", "a ballot", "a riding"],
    hint: "Look at the first paragraph. A petition shows leaders how many people want something.",
    visual: BIKE_PASSAGE,
  },
  {
    prompt: "Why were some councillors worried about the plan?",
    right: "the bike lane might take away parking spaces",
    wrong: ["the students were too young to speak", "bike lanes are against federal law", "the school didn't want it"],
    hint: "Reread the last paragraph to find the concern the councillors debated.",
    visual: BIKE_PASSAGE,
  },
  {
    prompt: "How many councillors voted against the bylaw?",
    right: "2",
    wrong: ["5", "7", "3"],
    hint: "Council voted 5 to 2. The second number is how many voted against it.",
    visual: BIKE_PASSAGE,
  },
  {
    prompt: "How did the students take part in their local democracy?",
    right: "they gathered signatures and spoke at a public meeting",
    wrong: ["they voted in the council election", "they wrote and passed the bylaw themselves", "they built the bike lane"],
    hint: "Students can't vote yet, but they can still speak up. Look at what Amir and Priya actually did.",
    visual: BIKE_PASSAGE,
  },
];

const LAW_BANK: Item[] = [
  {
    prompt: "What is a bill?",
    right: "a proposed law that has not been passed yet",
    wrong: ["a law that has already been passed", "a receipt for something you bought", "a vote in an election"],
    hint: "Every law starts as a bill. It must be debated and voted on before it becomes law.",
    emoji: "📄",
  },
  {
    prompt: "What are the people elected to the House of Commons called?",
    right: "Members of Parliament (MPs)",
    wrong: ["Senators", "Mayors", "Premiers"],
    hint: "Each MP is elected by the voters in one area of Canada, called a riding.",
    emoji: "🏛️",
  },
  {
    prompt: "What is the last step before a federal bill becomes law?",
    right: "Royal Assent from the Governor General",
    wrong: ["a vote by a city council", "a speech by a mayor", "a vote by every Canadian"],
    hint: "After both the House of Commons and the Senate pass a bill, the Governor General gives Royal Assent and it becomes law.",
    emoji: "✍️",
  },
  {
    prompt: "How old do you have to be to vote in a federal election in Canada?",
    right: "18",
    wrong: ["16", "19", "21"],
    hint: "Canadian citizens who are 18 or older can vote in federal elections.",
    emoji: "🗳️",
  },
  {
    prompt: "What is a riding?",
    right: "an area whose voters elect one representative",
    wrong: ["a type of law", "a meeting of the Senate", "a province's capital city"],
    hint: "Canada is divided into ridings (also called electoral districts). Each one elects one MP.",
    emoji: "🗺️",
  },
  {
    prompt: "Why do Canadians vote by secret ballot?",
    right: "so people can vote freely, without pressure",
    wrong: ["so the votes can't be counted", "so only some people can vote", "so the results are never shared"],
    hint: "No one can see how you voted, so no one can pressure or punish you for your choice.",
    emoji: "🗳️",
  },
  {
    prompt: "What does a city or town council make?",
    right: "bylaws for the community",
    wrong: ["the Criminal Code", "Canada's money", "agreements with other countries"],
    hint: "Bylaws are local rules, about things like parks, noise, pets and parking.",
    emoji: "🏘️",
  },
  {
    prompt: "Which part of Canada's Parliament is elected by voters?",
    right: "the House of Commons",
    wrong: ["the Senate", "the Governor General"],
    hint: "Voters elect MPs to the House of Commons. Senators and the Governor General are appointed.",
  },
  {
    prompt: "Which is a way for citizens to have a say about laws?",
    right: "writing a letter to their MP",
    wrong: ["paying a parking ticket", "renewing a library card", "buying stamps"],
    hint: "Elected representatives work for the people in their area. Writing, calling or meeting them lets your voice be heard.",
    emoji: "✉️",
  },
  {
    prompt: "How do people become Senators in Canada?",
    right: "they are appointed",
    wrong: ["they are elected in each riding", "they are chosen by city councils"],
    hint: "Senators are appointed by the Governor General on the advice of the Prime Minister.",
  },
  {
    hard: true,
    prompt: "How does someone usually become Prime Minister?",
    right: "by leading the party that wins the most seats in the House of Commons",
    wrong: [
      "by winning a separate vote of all Canadians",
      "by being chosen by the Senate",
      "by being the longest-serving MP",
    ],
    hint: "Canadians vote for an MP in their riding. The leader of the party with the most MPs usually becomes Prime Minister.",
  },
  {
    hard: true,
    prompt: "A bill must pass in which two places before it gets Royal Assent?",
    right: "the House of Commons and the Senate",
    wrong: ["the Supreme Court and the Senate", "city hall and the House of Commons", "a provincial legislature and the Senate"],
    hint: "Canada's Parliament has two houses. A bill must pass both before the Governor General signs it.",
  },
  {
    hard: true,
    prompt: "What is the main job of the Official Opposition?",
    right: "to question and challenge the government's plans",
    wrong: ["to sign bills into law", "to run the courts", "to choose the Governor General"],
    hint: "The party with the second-most seats usually becomes the Official Opposition. Its job is to hold the government to account.",
  },
  {
    hard: true,
    prompt: "The Charter says a federal election must be held at least once every…",
    right: "five years",
    wrong: ["two years", "ten years", "year"],
    hint: "Section 4 of the Charter limits how long a Parliament can last without an election: five years.",
  },
  {
    hard: true,
    prompt: "What does the Supreme Court of Canada do?",
    right: "decides whether laws follow the Constitution and hears final appeals",
    wrong: ["writes new laws", "elects the Prime Minister", "collects taxes"],
    hint: "Parliament makes laws. Courts interpret them, and the Supreme Court has the final word.",
    emoji: "⚖️",
  },
  {
    hard: true,
    prompt: "Why are bills debated before they become laws?",
    right: "debate helps find problems and improve the bill",
    wrong: ["debate makes laws pass faster", "debate lets MPs skip voting", "debate keeps bills secret"],
    hint: "When people with different views question a bill, mistakes are caught and the law can be made better.",
    emoji: "💬",
  },
  {
    hard: true,
    prompt: "In a minority government, the governing party has less than half the seats. What must it do to pass laws?",
    right: "win support from MPs in other parties",
    wrong: ["skip the House of Commons", "ask the mayor of Ottawa to decide", "let the Senate vote first and alone"],
    hint: "To pass a bill, more than half the MPs who vote must say yes. A minority government needs help from other parties.",
  },
  {
    hard: true,
    prompt: "Who can run to become a Member of Parliament?",
    right: "a Canadian citizen who is at least 18",
    wrong: ["only people born in Ottawa", "only people who are already Senators", "anyone in the world over age 10"],
    hint: "Candidates must be eligible voters: Canadian citizens aged 18 or older.",
  },
];

function laws({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const order = difficulty === 1 ? billOrder(1) : pick([billOrder(difficulty), ELECTION_ORDER]);
  return [
    order,
    ...shuffle([
      sortQuestion(PARTICIPATE_SORT, perBin(difficulty)),
      toQuestion(pick(BIKE_ITEMS)),
      ...levelled(LAW_BANK, 5, difficulty),
    ]),
  ];
}

// ---------- Rights & Freedoms ----------

type RightKind = "fundamental" | "democratic" | "mobility" | "legal" | "equality" | "language";

const RIGHT_LABEL: Record<RightKind, string> = {
  fundamental: "Fundamental freedoms",
  democratic: "Democratic rights",
  mobility: "Mobility rights",
  legal: "Legal rights",
  equality: "Equality rights",
  language: "Language rights",
};

const CHARTER_TABLE: Visual = {
  type: "table",
  title: "The Canadian Charter of Rights and Freedoms",
  headers: ["Part of the Charter", "What it protects"],
  rows: [
    ["Fundamental freedoms", "religion, thought, expression, peaceful gathering"],
    ["Democratic rights", "voting and running in elections"],
    ["Mobility rights", "living, working and moving anywhere in Canada"],
    ["Legal rights", "fair treatment by police and courts"],
    ["Equality rights", "equal treatment, without discrimination"],
    ["Language rights", "English and French; minority-language schools"],
  ],
};

const CHARTER_SCENARIOS: { text: string; kind: RightKind }[] = [
  { text: "Ana writes a letter to the newspaper disagreeing with the mayor.", kind: "fundamental" },
  { text: "Leo's family worships at their mosque every week.", kind: "fundamental" },
  { text: "Neighbours gather peacefully in a park to ask for cleaner rivers.", kind: "fundamental" },
  { text: "Ravi's aunt, a Canadian citizen, votes in a federal election.", kind: "democratic" },
  { text: "Maya's dad, a Canadian citizen, moves from Nova Scotia to Alberta for a new job.", kind: "mobility" },
  { text: "A person who has been arrested asks to speak to a lawyer.", kind: "legal" },
  { text: "A person accused of a crime is treated as innocent until proven guilty.", kind: "legal" },
  { text: "A government office can't refuse to hire someone because of the colour of their skin.", kind: "equality" },
  { text: "A government program can't shut someone out because they use a wheelchair.", kind: "equality" },
  { text: "A French-speaking family in Manitoba sends their child to a French-language public school.", kind: "language" },
];

function charterScenario(s: { text: string; kind: RightKind }, showTable: boolean): Question {
  const others = sample(
    (Object.keys(RIGHT_LABEL) as RightKind[]).filter((k) => k !== s.kind),
    3,
  );
  return textChoice(
    `${s.text} Which part of the Charter protects this?`,
    RIGHT_LABEL[s.kind],
    others.map((k) => RIGHT_LABEL[k]),
    "Match the action to what each part of the Charter protects: freedoms (beliefs and speech), voting, moving, fair treatment by courts, equality, or language.",
    showTable ? CHARTER_TABLE : { type: "emoji", emoji: "⚖️" },
  );
}

const RIGHTS_SORT: SortSet = {
  prompt: "Is it a right or a responsibility? Tap an item, then tap its basket.",
  hint: "A right is something you are entitled to. A responsibility is something you should do to respect others and help Canada work.",
  bins: [
    { id: "right", label: "right", emoji: "📜" },
    { id: "responsibility", label: "responsibility", emoji: "🤝" },
  ],
  items: [
    { label: "freedom of religion", emoji: "🕊️", bin: "right" },
    { label: "freedom of expression", emoji: "🗣️", bin: "right" },
    { label: "equality under the law", emoji: "⚖️", bin: "right" },
    { label: "a fair trial", emoji: "🏛️", bin: "right" },
    { label: "living and working in any province", emoji: "🚚", bin: "right" },
    { label: "obeying the law", emoji: "🚦", bin: "responsibility" },
    { label: "respecting the rights of others", emoji: "🤝", bin: "responsibility" },
    { label: "serving on a jury when called", emoji: "👥", bin: "responsibility" },
    { label: "helping others in your community", emoji: "🤲", bin: "responsibility" },
    { label: "caring for the environment", emoji: "🌳", bin: "responsibility" },
  ],
};

const RIGHTS_BANK: Item[] = [
  {
    prompt: "What is the Canadian Charter of Rights and Freedoms?",
    right: "part of Canada's Constitution that protects people's rights and freedoms",
    wrong: ["a list of school rules", "a trade agreement with another country", "a city bylaw about parks"],
    hint: "The Charter is part of the Constitution, Canada's highest law. Other laws must respect it.",
    emoji: "📜",
  },
  {
    prompt: "In what year did the Charter become part of Canada's Constitution?",
    right: "1982",
    wrong: ["1867", "1971", "1999"],
    hint: "The Charter was part of the Constitution Act, 1982. 1867 is the year Canada was formed.",
    emoji: "📜",
  },
  {
    prompt: "Freedom of expression means you can…",
    right: "share your ideas and opinions",
    wrong: ["say anything at all, with no limits", "make others agree with you", "never hear opinions you dislike"],
    hint: "You can speak, write and create to share your views, but not in ways that spread hate or harm others.",
    emoji: "🗣️",
  },
  {
    prompt: "Which of these is a fundamental freedom in the Charter?",
    right: "freedom of religion",
    wrong: ["the right to free internet", "the right to a driver's licence at any age", "the right to skip school"],
    hint: "Fundamental freedoms include religion, thought, belief, opinion, expression, peaceful assembly and association.",
    emoji: "🕊️",
  },
  {
    prompt: "What do the Charter's equality rights mean?",
    right: "everyone is equal under the law, without discrimination",
    wrong: ["everyone must look and think the same", "everyone gets the same amount of money", "only citizens are protected"],
    hint: "Section 15 protects every person from unfair treatment by laws because of things like race, religion, sex, age or disability.",
    emoji: "⚖️",
  },
  {
    prompt: "Which of these is a responsibility of citizens?",
    right: "obeying the law",
    wrong: ["freedom of speech", "freedom of religion", "the right to a lawyer"],
    hint: "Rights are what you're entitled to. Responsibilities are what you should do, like obeying laws and respecting others.",
  },
  {
    prompt: "What are Canada's two official languages?",
    right: "English and French",
    wrong: ["English and Spanish", "French and German", "English and Italian"],
    hint: "The federal government serves people in both English and French.",
  },
  {
    prompt: "If you have freedom of expression, what is your responsibility?",
    right: "to respect other people's rights when you speak",
    wrong: ["to make sure everyone agrees with you", "to never share an opinion", "to speak only once a year"],
    hint: "Rights come with responsibilities. Using your voice respectfully protects everyone's rights.",
  },
  {
    prompt: "Mobility rights let Canadian citizens…",
    right: "live and work in any province, and enter or leave Canada",
    wrong: ["drive without a licence", "travel anywhere in the world without a passport", "move into any house they like"],
    hint: "Section 6 of the Charter lets citizens move freely within Canada and come and go from the country.",
    emoji: "🚚",
  },
  {
    prompt: "Which right helps you if you are arrested?",
    right: "the right to talk to a lawyer",
    wrong: ["the right to choose your own judge", "the right to skip the trial", "the right to keep the arrest secret from the court"],
    hint: "The Charter's legal rights include being told why you are arrested and being able to talk to a lawyer right away.",
    emoji: "⚖️",
  },
  {
    hard: true,
    prompt: "The Charter mainly protects you from unfair actions by…",
    right: "governments and their laws",
    wrong: ["your friends", "private businesses", "other countries"],
    hint: "The Charter applies to governments. Human rights laws in each province and territory protect people from discrimination by businesses and landlords.",
  },
  {
    hard: true,
    prompt: "Section 1 of the Charter says rights can have 'reasonable limits.' Which is an example?",
    right: "freedom of expression doesn't protect spreading hatred against a group",
    wrong: [
      "people may practise religion only on weekends",
      "only adults have freedom of thought",
      "people must ask permission before having an opinion",
    ],
    hint: "Limits are allowed only when they are fair and needed in a free and democratic society, such as protecting people from hate.",
  },
  {
    hard: true,
    prompt: "Under the Charter, who has the right to vote and run in elections?",
    right: "Canadian citizens",
    wrong: ["everyone in Canada, including visitors", "only people born in Canada", "only people who own land"],
    hint: "Democratic rights in section 3 belong to every Canadian citizen, whether born in Canada or not.",
  },
  {
    hard: true,
    prompt: "What does 'innocent until proven guilty' mean?",
    right: "a person accused of a crime is treated as innocent unless a court proves otherwise",
    wrong: ["anyone arrested is always guilty", "the accused person must prove they are innocent", "only innocent people go to court"],
    hint: "It's up to the court to prove guilt in a fair trial, not up to the accused person to prove innocence.",
    emoji: "⚖️",
  },
  {
    hard: true,
    prompt: "Section 25 of the Charter makes sure the Charter doesn't take away which rights?",
    right: "the rights of Indigenous peoples, including treaty rights",
    wrong: ["the rights of city councils", "the rights of the Senate", "the right to drive a car"],
    hint: "Section 25 protects Aboriginal and treaty rights of First Nations, Métis and Inuit peoples.",
  },
  {
    hard: true,
    prompt: "In 1946, Viola Desmond refused to leave the whites-only section of a movie theatre in Nova Scotia. Why is she honoured today?",
    right: "she stood up against racial discrimination",
    wrong: ["she was Canada's first Prime Minister", "she wrote the Charter", "she started a movie company"],
    hint: "Her stand against racism helped inspire Canada's civil rights movement. In 2018, her portrait was put on the $10 bill.",
    emoji: "💵",
  },
  {
    hard: true,
    prompt: "Which United Nations agreement lists rights for every child, like the rights to education, health and play?",
    right: "the Convention on the Rights of the Child",
    wrong: ["the Indian Act", "the Constitution Act, 1867", "the Treaty of Paris"],
    hint: "The UN Convention on the Rights of the Child was adopted in 1989. Canada agreed to it in 1991.",
    emoji: "🧒",
  },
  {
    hard: true,
    prompt: "The Charter's minority language education rights let some families…",
    right: "have their children educated in English or French where enough students need it",
    wrong: ["choose any language for every school", "skip reading lessons", "go to school only in Québec"],
    hint: "French-speaking families outside Québec, and English-speaking families in Québec, can have schools in their language where numbers allow.",
  },
];

function rights({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const scenarios = sample(CHARTER_SCENARIOS, 2).map((s) => charterScenario(s, difficulty < 3));
  return shuffle([sortQuestion(RIGHTS_SORT, perBin(difficulty)), ...scenarios, ...levelled(RIGHTS_BANK, 5, difficulty)]);
}

// ---------- Immigration & Multiculturalism ----------

const IMMIGRATION_EVENTS: HistoryEvent[] = [
  { year: 1867, label: "Confederation creates the Dominion of Canada", emoji: "🍁" },
  { year: 1896, label: "Canada begins a big campaign to attract settlers to the Prairies", emoji: "🌾" },
  { year: 1928, label: "Pier 21 opens as an immigration gateway in Halifax", emoji: "🚢" },
  { year: 1947, label: "Canadian citizenship is created by law", emoji: "📜" },
  { year: 1967, label: "A points system judges immigrants on skills, not origin", emoji: "📋" },
  { year: 1971, label: "Canada adopts an official multiculturalism policy", emoji: "🤝" },
  { year: 1988, label: "The Canadian Multiculturalism Act is passed", emoji: "⚖️" },
  { year: 2021, label: "The citizenship oath is updated to recognize Indigenous rights", emoji: "🪶" },
];

const PUSH_PULL_SORT: SortSet = {
  prompt: "Push factor or pull factor? Tap an item, then tap its basket.",
  hint: "Push factors are reasons people leave their home country. Pull factors are reasons that draw them to a new country.",
  bins: [
    { id: "push", label: "push (reason to leave)", emoji: "👋" },
    { id: "pull", label: "pull (reason to come)", emoji: "🧲" },
  ],
  items: [
    { label: "conflict makes home unsafe", emoji: "⚠️", bin: "push" },
    { label: "few jobs at home", emoji: "📉", bin: "push" },
    { label: "unfair treatment because of beliefs", emoji: "🚫", bin: "push" },
    { label: "a drought ruins farms at home", emoji: "🏜️", bin: "push" },
    { label: "a hurricane destroys homes", emoji: "🌀", bin: "push" },
    { label: "job opportunities in Canada", emoji: "💼", bin: "pull" },
    { label: "family already living in Canada", emoji: "👨‍👩‍👧", bin: "pull" },
    { label: "safety and freedom", emoji: "🕊️", bin: "pull" },
    { label: "good schools and universities", emoji: "🎓", bin: "pull" },
    { label: "free public health care", emoji: "🏥", bin: "pull" },
  ],
};

const AMIR_PASSAGE: Visual = {
  type: "passage",
  title: "Starting Over",
  paragraphs: [
    "Amir was seven when his family left Syria. Fighting had made their city unsafe, so they lived in a neighbouring country for two years while they waited to be resettled. In 2016, they arrived in Canada as refugees.",
    "A group of volunteers from a community centre had agreed to sponsor the family. They found an apartment, helped Amir's parents sign up for English classes, and walked Amir to his new school on his first day.",
    "The first winter was a surprise. Amir had never seen so much snow! Today, his mother works at a pharmacy, his father runs a small bakery, and Amir plays on a hockey team. At home, the family still speaks Arabic and cooks the dishes his grandmother taught them.",
  ],
};

const AMIR_ITEMS: Item[] = [
  {
    prompt: "What push factor made Amir's family leave their home?",
    right: "fighting had made their city unsafe",
    wrong: ["they wanted to see snow", "his father wanted to open a bakery", "they wanted to learn English"],
    hint: "A push factor is a reason to leave. Look in the first paragraph.",
    visual: AMIR_PASSAGE,
  },
  {
    prompt: "Who helped Amir's family settle into their new community?",
    right: "community volunteers who sponsored them",
    wrong: ["Amir's hockey team", "the Prime Minister himself", "nobody, they did it all alone"],
    hint: "The second paragraph tells who found the apartment and helped with classes and school.",
    visual: AMIR_PASSAGE,
  },
  {
    prompt: "How does Amir's family show what multiculturalism means?",
    right: "they take part in Canadian life and keep their own language and food",
    wrong: ["they gave up their language", "they speak only English at home", "they stay away from their community"],
    hint: "Multiculturalism means people can keep their cultures while being part of Canada. Look at the last paragraph.",
    visual: AMIR_PASSAGE,
  },
  {
    prompt: "Why is Amir's family described as refugees, not just immigrants?",
    right: "they had to leave because their home was unsafe",
    wrong: ["they came for a holiday", "they moved to find a bigger house", "they were already Canadian citizens"],
    hint: "Refugees are forced to flee for their safety. Other immigrants choose to move.",
    visual: AMIR_PASSAGE,
  },
];

const IMMIGRATION_BANK: Item[] = [
  {
    prompt: "What is an immigrant?",
    right: "a person who moves to a new country to live there",
    wrong: ["a person visiting on a short holiday", "a person who never leaves their hometown", "a person who moves to another city in the same country"],
    hint: "Immigrants come from another country to make a new home.",
    emoji: "🧳",
  },
  {
    prompt: "What is a refugee?",
    right: "a person forced to flee their country because it is unsafe for them",
    wrong: ["a tourist on vacation", "a student on a school trip", "a person moving to get a bigger house"],
    hint: "Refugees leave because of danger, like war or being treated unfairly for who they are.",
    emoji: "🕊️",
  },
  {
    prompt: "What does multiculturalism mean in Canada?",
    right: "people of many cultures can keep their traditions while being part of Canada",
    wrong: ["everyone must give up their culture", "only one culture is allowed", "each culture must live in a separate area"],
    hint: "Canada encourages people to keep and share their languages, foods and traditions.",
    emoji: "🤝",
  },
  {
    prompt: "In 1971, Canada became the first country in the world to…",
    right: "adopt an official multiculturalism policy",
    wrong: ["join the United Nations", "adopt the maple leaf flag", "sign the Charter of Rights and Freedoms"],
    hint: "In 1971, the federal government announced that Canada would officially support many cultures.",
  },
  {
    prompt: "Which is a pull factor that draws people to Canada?",
    right: "safety and job opportunities",
    wrong: ["a drought at home", "few jobs at home", "conflict at home"],
    hint: "Pull factors attract people to a place. Push factors make them want to leave home.",
    emoji: "🧲",
  },
  {
    prompt: "Which is a push factor that makes people leave their home country?",
    right: "not being safe in their home country",
    wrong: ["having family in Canada", "good schools in Canada", "jobs in Canada"],
    hint: "Push factors push people away from where they live now.",
    emoji: "👋",
  },
  {
    prompt: "About how many people living in Canada were born in another country?",
    right: "almost 1 in 4",
    wrong: ["about 1 in 50", "about 9 in 10", "about 1 in 1000"],
    hint: "The 2021 census found that about 23% of people in Canada were immigrants. That's almost one in four.",
    emoji: "🌍",
  },
  {
    prompt: "Which is a way people share their cultures in Canada?",
    right: "festivals, foods, music and languages",
    wrong: ["keeping their traditions hidden", "banning other holidays", "speaking only one language"],
    hint: "Cultural festivals, restaurants, music and language classes let everyone learn from one another.",
    emoji: "🎉",
  },
  {
    prompt: "To become a Canadian citizen, adults usually need to…",
    right: "live in Canada for a few years, pass a citizenship test and take an oath",
    wrong: ["visit Canada just once", "buy a house in Canada", "have been born in Canada"],
    hint: "Permanent residents can apply after living in Canada for 3 of the last 5 years. Adults take a citizenship test and the oath of citizenship.",
    emoji: "📜",
  },
  {
    prompt: "Canada's people include Indigenous peoples, families who settled long ago and newer immigrants. What does this diversity bring?",
    right: "many languages, foods, ideas and traditions",
    wrong: ["only one way of life", "fewer ideas", "the same holidays for everyone"],
    hint: "People bring different knowledge and traditions, which shape communities across Canada.",
    emoji: "🍁",
  },
  {
    hard: true,
    prompt: "In 1967, Canada introduced a points system for immigration. What changed?",
    right: "people were judged on skills, education and language, not their country or race",
    wrong: ["only people from Europe could come", "immigration was stopped", "people had to pay a head tax"],
    hint: "Earlier rules favoured people from certain countries. The points system looked at what each person could bring instead.",
  },
  {
    hard: true,
    prompt: "In 1988, Parliament passed a law that made multiculturalism part of Canadian law. What is it called?",
    right: "the Canadian Multiculturalism Act",
    wrong: ["the Indian Act", "the Constitution Act, 1867", "the Official Languages Act"],
    hint: "The policy came first in 1971. The Canadian Multiculturalism Act made it law in 1988.",
  },
  {
    hard: true,
    prompt: "From 1928 to 1971, nearly one million immigrants first arrived in Canada at Pier 21. In which city is it?",
    right: "Halifax",
    wrong: ["Vancouver", "Montréal", "Winnipeg"],
    hint: "Pier 21 is on the Atlantic coast in Nova Scotia. Today it is the Canadian Museum of Immigration.",
    emoji: "🚢",
  },
  {
    hard: true,
    prompt: "Around 1900, Canada advertised farmland in Europe and the United States to attract settlers. Which region did many of them settle?",
    right: "the Prairies",
    wrong: ["the Arctic", "Vancouver Island", "Newfoundland"],
    hint: "Settlers from Britain, the United States, Ukraine and many other places came to farm the Prairies, the homelands of First Nations and Métis peoples, whose lives were greatly changed.",
    emoji: "🌾",
  },
  {
    hard: true,
    prompt: "In 2021, the oath for new Canadian citizens was changed. What does it now mention?",
    right: "the Aboriginal and treaty rights of First Nations, Inuit and Métis peoples",
    wrong: ["the rules of hockey", "the rights of city mayors", "the history of Pier 21"],
    hint: "This change answered one of the Truth and Reconciliation Commission's Calls to Action.",
    emoji: "🪶",
  },
  {
    hard: true,
    prompt: "How does immigration help Canada's economy?",
    right: "newcomers fill jobs, start businesses and pay taxes",
    wrong: ["it lowers the number of workers", "it stops new businesses from opening", "newcomers aren't allowed to work"],
    hint: "Many newcomers bring skills that Canada needs, and some start businesses that create more jobs.",
    emoji: "💼",
  },
  {
    hard: true,
    prompt: "Canada is often described as a 'cultural mosaic.' What does this mean?",
    right: "cultures keep their own identities while fitting together into one country",
    wrong: ["all cultures blend into one new culture", "only one culture is official", "people must live in separate areas"],
    hint: "In a mosaic, each tile keeps its own colour but together they make one picture.",
    emoji: "🎨",
  },
  {
    hard: true,
    prompt: "More than 70 Indigenous languages are spoken in Canada. Why are many communities working hard to revitalize them?",
    right: "past policies harmed these languages, and languages carry culture and knowledge",
    wrong: ["the languages are brand new", "they are only found in old books", "every Canadian must learn all of them"],
    hint: "Policies like residential schools stopped children from speaking their languages. Communities are now bringing them back.",
    emoji: "🗣️",
  },
];

function immigration({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const n = difficulty === 1 ? 3 : difficulty === 2 ? 4 : 5;
  const gap = difficulty === 1 ? 25 : difficulty === 2 ? 10 : 4;
  return [
    timeline(IMMIGRATION_EVENTS, n, gap, "Put these events about immigration and citizenship in order, oldest first."),
    ...shuffle([
      sortQuestion(PUSH_PULL_SORT, perBin(difficulty)),
      toQuestion(pick(AMIR_ITEMS)),
      ...levelled(IMMIGRATION_BANK, 5, difficulty),
    ]),
  ];
}

// ---------- Learning from the Past ----------

const PAST_EVENTS: HistoryEvent[] = [
  { year: 1885, label: "The Chinese Head Tax begins", emoji: "💵" },
  { year: 1914, label: "The Komagata Maru is turned away at Vancouver", emoji: "🚢" },
  { year: 1923, label: "A law bans almost all Chinese immigration", emoji: "⛔" },
  { year: 1942, label: "Japanese Canadians are forced from the BC coast", emoji: "🏚️" },
  { year: 1960, label: "First Nations people gain the federal vote without losing status", emoji: "🗳️" },
  { year: 1982, label: "The Charter of Rights and Freedoms becomes law", emoji: "📜" },
  { year: 1988, label: "Canada apologizes to Japanese Canadians and offers redress", emoji: "🤝" },
  { year: 1996, label: "The last federally run residential school closes", emoji: "🏫" },
  { year: 2006, label: "Canada apologizes for the Chinese Head Tax", emoji: "🕊️" },
  { year: 2015, label: "The Truth and Reconciliation Commission releases 94 Calls to Action", emoji: "📘" },
  { year: 2021, label: "The first National Day for Truth and Reconciliation", emoji: "🧡" },
];

const LEGACY_SORT: SortSet = {
  prompt: "Was it a discriminatory policy, or a step toward making things right? Tap an item, then tap its basket.",
  hint: "Discriminatory policies treated groups unfairly because of who they were. Apologies, redress and learning the truth are steps toward making things right.",
  bins: [
    { id: "unfair", label: "discriminatory policy", emoji: "⛔" },
    { id: "repair", label: "step toward making things right", emoji: "🕊️" },
  ],
  items: [
    { label: "the Chinese Head Tax", emoji: "💵", bin: "unfair" },
    { label: "the 'continuous journey' rule", emoji: "🚢", bin: "unfair" },
    { label: "forcing Japanese Canadians from their homes", emoji: "🏚️", bin: "unfair" },
    { label: "the residential school system", emoji: "🏫", bin: "unfair" },
    { label: "the 1923 ban on Chinese immigration", emoji: "📜", bin: "unfair" },
    { label: "the 2008 apology for residential schools", emoji: "🕊️", bin: "repair" },
    { label: "the Japanese Canadian Redress Agreement", emoji: "🤝", bin: "repair" },
    { label: "the National Day for Truth and Reconciliation", emoji: "🧡", bin: "repair" },
    { label: "the Charter's equality rights", emoji: "⚖️", bin: "repair" },
    { label: "the 2016 apology for the Komagata Maru", emoji: "🗣️", bin: "repair" },
  ],
};

const KOMAGATA_PASSAGE: Visual = {
  type: "passage",
  title: "The Komagata Maru",
  paragraphs: [
    "In May 1914, a ship called the Komagata Maru arrived in Vancouver's harbour. It carried 376 passengers from India, which was then ruled by Britain. Most were Sikhs, and others were Muslims and Hindus. As British subjects, many believed they had a right to come to Canada.",
    "But Canada had a rule that immigrants must arrive by a 'continuous journey' from their home country. There was no direct ship route from India to Canada, so the rule was really a way to keep people from India out.",
    "The passengers were kept on board for about two months while they waited. Only 24 were allowed to stay. In July 1914, the ship was forced to leave and sail back to India.",
    "In 2016, Prime Minister Justin Trudeau apologized in the House of Commons for what the government did. Today, a memorial in Vancouver helps people remember.",
  ],
};

const KOMAGATA_ITEMS: Item[] = [
  {
    prompt: "Why were most of the passengers not allowed into Canada?",
    right: "an unfair 'continuous journey' rule was used to keep them out",
    wrong: ["the ship was too small to dock", "the passengers didn't want to stay", "the harbour had no room"],
    hint: "Read the second paragraph. The rule was designed so that people from India couldn't meet it.",
    visual: KOMAGATA_PASSAGE,
  },
  {
    prompt: "About how long were the passengers kept on the ship in Vancouver's harbour?",
    right: "about two months",
    wrong: ["about two days", "about two years", "about two hours"],
    hint: "The ship arrived in May and was forced to leave in July. Check the third paragraph.",
    visual: KOMAGATA_PASSAGE,
  },
  {
    prompt: "What happened in 2016?",
    right: "the Prime Minister apologized in the House of Commons",
    wrong: ["the ship returned to Vancouver", "the continuous journey rule was created", "the passengers were finally welcomed"],
    hint: "Look at the last paragraph. An apology admits that a wrong was done.",
    visual: KOMAGATA_PASSAGE,
  },
  {
    prompt: "Which word best describes the 'continuous journey' rule?",
    right: "discriminatory",
    wrong: ["fair", "welcoming", "helpful"],
    hint: "A discriminatory rule treats a group unfairly because of who they are or where they come from.",
    visual: KOMAGATA_PASSAGE,
  },
];

const PAST_BANK: Item[] = [
  {
    prompt: "What was the Chinese Head Tax?",
    right: "a fee charged to people from China to enter Canada",
    wrong: ["a fee every immigrant paid equally", "a reward for building the railway", "a tax on all Canadian businesses"],
    hint: "From 1885, most people coming from China had to pay a special fee that no other group had to pay.",
    emoji: "💵",
  },
  {
    prompt: "Before the Head Tax began in 1885, thousands of Chinese workers helped build what?",
    right: "the Canadian Pacific Railway",
    wrong: ["the Trans-Canada Highway", "the CN Tower", "the St. Lawrence Seaway"],
    hint: "Chinese workers built some of the hardest and most dangerous sections of the railway through the BC mountains.",
    emoji: "🚂",
  },
  {
    prompt: "What happened to Japanese Canadians living on the BC coast in 1942?",
    right: "they were forced from their homes and sent inland, and their property was taken",
    wrong: ["they were given free land on the coast", "they were invited to join Parliament", "nothing changed for them"],
    hint: "During the Second World War, the government treated Japanese Canadians as a threat, even though most were Canadian citizens.",
  },
  {
    prompt: "What were residential schools?",
    right: "schools that took Indigenous children away from their families, languages and cultures",
    wrong: ["local schools that taught Indigenous languages", "summer camps that families chose", "universities for adults"],
    hint: "The government funded these schools, and churches ran them. Children were separated from their families and not allowed to speak their languages.",
    emoji: "🏫",
  },
  {
    prompt: "Why is September 30 an important day in Canada?",
    right: "it is the National Day for Truth and Reconciliation",
    wrong: ["it is Canada Day", "it is Remembrance Day", "it is Victoria Day"],
    hint: "On September 30, people honour residential school Survivors, their families and the children who never came home.",
    emoji: "🧡",
  },
  {
    prompt: "On Orange Shirt Day, people wear orange to say that…",
    right: "every child matters",
    wrong: ["summer is over", "a sports team has won", "Halloween is coming"],
    hint: "Orange Shirt Day began with Survivor Phyllis Webstad, whose new orange shirt was taken from her on her first day at residential school.",
    emoji: "🧡",
  },
  {
    prompt: "What does reconciliation mean?",
    right: "repairing relationships by learning the truth and making things right",
    wrong: ["forgetting about the past", "pretending nothing happened", "choosing new leaders"],
    hint: "Reconciliation starts with truth: listening, learning what happened and taking action together.",
    emoji: "🤝",
  },
  {
    prompt: "What is a discriminatory policy?",
    right: "a rule that treats a group of people unfairly because of who they are",
    wrong: ["a rule that treats everyone the same", "a rule about recycling", "a rule that only applies on weekends"],
    hint: "Discrimination means treating people unfairly because of their race, religion, culture or another part of who they are.",
  },
  {
    prompt: "Why does the Government of Canada apologize for past wrongs?",
    right: "to admit the harm that was done and commit to doing better",
    wrong: ["because the events never happened", "to remove them from history books", "to stop people learning about them"],
    hint: "An apology says, 'This was wrong.' It's one step in repairing relationships with the people who were hurt.",
    emoji: "🕊️",
  },
  {
    prompt: "Most passengers on the Komagata Maru in 1914 were people from…",
    right: "India, most of them Sikhs",
    wrong: ["France", "China", "Japan"],
    hint: "The ship carried 376 passengers from India, which was then ruled by Britain.",
    emoji: "🚢",
  },
  {
    hard: true,
    prompt: "The Head Tax started at $50 in 1885. By 1903, how much had it risen to?",
    right: "$500",
    wrong: ["$60", "$100", "$5000"],
    hint: "It rose to $100 in 1900, then to $500 in 1903. That was about two years of wages for many workers.",
    emoji: "💵",
  },
  {
    hard: true,
    prompt: "In 1923, a law banned almost all Chinese immigration to Canada. When was it finally repealed?",
    right: "1947",
    wrong: ["1867", "1982", "2006"],
    hint: "It was repealed after the Second World War, in 1947, the same year Chinese Canadians won the right to vote federally.",
  },
  {
    hard: true,
    prompt: "In 2006, what did the Government of Canada do about the Head Tax?",
    right: "it apologized in the House of Commons and made symbolic payments",
    wrong: ["it raised the tax again", "it said the tax never happened", "it made the tax permanent"],
    hint: "Prime Minister Stephen Harper apologized, and payments went to surviving head tax payers and the spouses of those who had died.",
  },
  {
    hard: true,
    prompt: "In 1988, Prime Minister Brian Mulroney apologized to Japanese Canadians. What else did the redress agreement include?",
    right: "payments to survivors and money for community and anti-racism work",
    wrong: ["nothing beyond the words of the apology", "returning every original house and boat", "a new tax on Japanese Canadians"],
    hint: "Redress means making up for a wrong. Survivors received payments, and funds supported communities and fighting racism.",
    emoji: "🤝",
  },
  {
    hard: true,
    prompt: "Japanese Canadians were not allowed to return to the BC coast until which year?",
    right: "1949",
    wrong: ["1942", "1988", "1914"],
    hint: "The restrictions lasted four years after the Second World War ended. They were lifted on April 1, 1949.",
  },
  {
    hard: true,
    prompt: "In which year did the last federally run residential school close?",
    right: "1996",
    wrong: ["1867", "1920", "1945"],
    hint: "Residential schools operated for more than 100 years. The last one closed in 1996, so many Survivors are alive today.",
  },
  {
    hard: true,
    prompt: "In 2015, the Truth and Reconciliation Commission shared what with Canadians?",
    right: "94 Calls to Action",
    wrong: ["a new Constitution", "the Charter of Rights and Freedoms", "a new national flag"],
    hint: "The Commission listened to thousands of Survivors and published 94 Calls to Action for governments, schools and all Canadians.",
    emoji: "📘",
  },
  {
    hard: true,
    prompt: "Why are the effects of residential schools called 'intergenerational'?",
    right: "the harm affected students and also their children and grandchildren",
    wrong: ["the schools were only for grandparents", "the effects lasted only one year", "the schools were all built in one generation"],
    hint: "Losing family, language and culture affected how Survivors could pass them on, so later generations are affected too.",
  },
  {
    hard: true,
    prompt: "During the First World War, thousands of people, many of them Ukrainian Canadians, were interned. What does 'interned' mean?",
    right: "held in camps because of where they or their families came from",
    wrong: ["hired as office interns", "given free land", "sent on holidays"],
    hint: "More than 8,000 people were held in camps and forced to work, though they had done nothing wrong.",
  },
  {
    hard: true,
    prompt: "Which is a positive legacy that came after these past wrongs?",
    right: "stronger human rights laws, apologies and redress",
    wrong: ["more head taxes", "new internment camps", "forgetting what happened"],
    hint: "Learning from injustice led Canada to protect rights more strongly, and to apologize and make amends.",
    emoji: "⚖️",
  },
];

function past({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const n = difficulty === 1 ? 3 : difficulty === 2 ? 4 : 5;
  const gap = difficulty === 1 ? 25 : difficulty === 2 ? 10 : 5;
  return [
    timeline(PAST_EVENTS, n, gap, "Put these events in order, oldest first."),
    ...shuffle([
      sortQuestion(LEGACY_SORT, perBin(difficulty)),
      toQuestion(pick(KOMAGATA_ITEMS)),
      ...levelled(PAST_BANK, 5, difficulty),
    ]),
  ];
}

// ---------- Regions & Resources ----------

type Region = "west" | "prairies" | "central" | "atlantic" | "north";

const REGION_LABEL: Record<Region, string> = {
  west: "the West Coast",
  prairies: "the Prairies",
  central: "Central Canada",
  atlantic: "Atlantic Canada",
  north: "the North",
};

const REGION_TABLE: Visual = {
  type: "table",
  title: "Regions of Canada",
  headers: ["Region", "Provinces and territories", "Key resources and industries"],
  rows: [
    ["West Coast", "British Columbia", "forestry, salmon fishing, mining, Pacific ports"],
    ["Prairies", "Alberta, Saskatchewan, Manitoba", "wheat and canola farming, oil and gas, potash"],
    ["Central Canada", "Ontario, Quebec", "manufacturing, hydroelectricity, maple syrup"],
    ["Atlantic Canada", "N.L., N.S., N.B., P.E.I.", "lobster fishing, offshore oil, potato farming"],
    ["The North", "Yukon, N.W.T., Nunavut", "diamond and gold mining, tourism"],
  ],
};

const REGION_CLUES: { text: string; region: Region }[] = [
  { text: "Lena's uncle works at a busy port on the Pacific Ocean.", region: "west" },
  { text: "Kenji's family runs a salmon-fishing boat.", region: "west" },
  { text: "Sam's cousin works at a potash mine.", region: "prairies" },
  { text: "Ana's grandparents grow canola on their farm.", region: "prairies" },
  { text: "Leo lives in Manitoba.", region: "prairies" },
  { text: "Zoe's aunt builds cars at a factory.", region: "central" },
  { text: "Ravi's family taps maple trees to make syrup.", region: "central" },
  { text: "Maya's dad works on an offshore oil platform off Newfoundland.", region: "atlantic" },
  { text: "Jay's family sets lobster traps each spring.", region: "atlantic" },
  { text: "Priya's mom works at a diamond mine.", region: "north" },
  { text: "Noah lives in Nunavut.", region: "north" },
];

function regionClue(c: { text: string; region: Region }, showTable: boolean): Question {
  const others = sample(
    (Object.keys(REGION_LABEL) as Region[]).filter((r) => r !== c.region),
    3,
  );
  return textChoice(
    `${c.text} Which region of Canada is this most likely in?`,
    REGION_LABEL[c.region],
    others.map((r) => REGION_LABEL[r]),
    "Each region's resources come from its land and water: the Pacific coast, the flat Prairies, the Great Lakes and St. Lawrence, the Atlantic Ocean, or the far North.",
    showTable ? REGION_TABLE : { type: "emoji", emoji: "🗺️" },
  );
}

const REGION_SORT_A: SortSet = {
  prompt: "Which region is it from? Tap an item, then tap its basket.",
  hint: "The West Coast has the Pacific Ocean and huge forests. The Prairies have flat, fertile farmland. Atlantic Canada is surrounded by ocean.",
  bins: [
    { id: "west", label: "West Coast", emoji: "🌲" },
    { id: "prairies", label: "Prairies", emoji: "🌾" },
    { id: "atlantic", label: "Atlantic", emoji: "🌊" },
  ],
  items: [
    { label: "Pacific salmon fishing", emoji: "🐟", bin: "west" },
    { label: "Canada's busiest port, in Vancouver", emoji: "🚢", bin: "west" },
    { label: "logging in coastal rainforests", emoji: "🌲", bin: "west" },
    { label: "wheat farms", emoji: "🌾", bin: "prairies" },
    { label: "potash mines in Saskatchewan", emoji: "⛏️", bin: "prairies" },
    { label: "cattle ranches in Alberta", emoji: "🐄", bin: "prairies" },
    { label: "lobster fishing", emoji: "🦞", bin: "atlantic" },
    { label: "potato farms on P.E.I.", emoji: "🥔", bin: "atlantic" },
    { label: "offshore oil off Newfoundland", emoji: "🛢️", bin: "atlantic" },
  ],
};

const REGION_SORT_B: SortSet = {
  prompt: "Central Canada or the North? Tap an item, then tap its basket.",
  hint: "Central Canada (Ontario and Quebec) has big cities, factories and huge rivers. The North (the three territories) has mines and wide, wild land.",
  bins: [
    { id: "central", label: "Central Canada", emoji: "🏙️" },
    { id: "north", label: "the North", emoji: "❄️" },
  ],
  items: [
    { label: "car factories in Ontario", emoji: "🚗", bin: "central" },
    { label: "maple syrup in Quebec", emoji: "🍁", bin: "central" },
    { label: "big hydroelectric dams in Quebec", emoji: "⚡", bin: "central" },
    { label: "nickel mining near Sudbury, Ontario", emoji: "⛏️", bin: "central" },
    { label: "banks and offices in Toronto", emoji: "🏦", bin: "central" },
    { label: "diamond mines in the Northwest Territories", emoji: "💎", bin: "north" },
    { label: "gold mining in Yukon", emoji: "🪙", bin: "north" },
    { label: "Inuit art co-operatives in Nunavut", emoji: "🎨", bin: "north" },
    { label: "tours to see the northern lights", emoji: "🌌", bin: "north" },
  ],
};

const REGION_BANK: Item[] = [
  {
    prompt: "Which region is known for wheat, canola and potash?",
    right: "the Prairies",
    wrong: ["Atlantic Canada", "the North", "the West Coast"],
    hint: "The Prairies have flat, fertile land for farming and rich potash deposits underground.",
    emoji: "🌾",
  },
  {
    prompt: "Why has fishing been so important in Atlantic Canada?",
    right: "the region is surrounded by the Atlantic Ocean and its rich fishing grounds",
    wrong: ["it has the most wheat farms", "it is in the Arctic", "it has no coastline"],
    hint: "Atlantic Canada's provinces all touch the ocean, and fishing has shaped their towns for hundreds of years.",
    emoji: "🌊",
  },
  {
    prompt: "Which resources is the West Coast of Canada known for?",
    right: "forests and Pacific salmon",
    wrong: ["potash and wheat", "lobster and potatoes", "maple syrup and nickel"],
    hint: "BC's mild, rainy coast grows huge trees, and its rivers and ocean support salmon.",
    emoji: "🌲",
  },
  {
    prompt: "Which province produces most of the world's maple syrup?",
    right: "Quebec",
    wrong: ["Alberta", "British Columbia", "Saskatchewan"],
    hint: "Quebec's maple forests produce most of the world's maple syrup.",
    emoji: "🍁",
  },
  {
    prompt: "Which territory has Canada's biggest diamond mines?",
    right: "the Northwest Territories",
    wrong: ["Yukon", "Nunavut"],
    hint: "Canada's first diamond mine opened in the Northwest Territories in 1998, and its biggest diamond mines have been there ever since.",
    emoji: "💎",
  },
  {
    prompt: "What is the Canadian Shield?",
    right: "a huge area of ancient rock, rich in minerals, covering about half of Canada",
    wrong: ["a fence along Canada's border", "a mountain range on the West Coast", "a flat farming area in the Prairies"],
    hint: "The Canadian Shield wraps around Hudson Bay. Its old rock holds metals like gold, nickel and copper.",
    emoji: "🪨",
  },
  {
    prompt: "What is a resource-based community?",
    right: "a town where many jobs depend on a nearby natural resource",
    wrong: ["a city with no jobs", "a town that makes everything it needs", "a community without schools"],
    hint: "Mining towns, fishing villages and forestry towns are resource-based communities.",
    emoji: "🏘️",
  },
  {
    prompt: "How do natural resources shape a region's identity?",
    right: "they influence its jobs, traditions, stories and how people see their home",
    wrong: ["they have no effect on people", "they only matter to the federal government", "they are the same in every region"],
    hint: "Think of fishing songs in Atlantic Canada or wheat fields on Prairie signs. Resources become part of who people are.",
  },
  {
    prompt: "Which industry is Ontario especially known for?",
    right: "manufacturing, such as building cars",
    wrong: ["lobster fishing", "diamond mining", "potash mining"],
    hint: "Southern Ontario has many factories, including large car plants.",
    emoji: "🏭",
  },
  {
    prompt: "Which region has Canada's busiest port, on the Pacific Ocean?",
    right: "the West Coast",
    wrong: ["the Prairies", "the North", "Central Canada"],
    hint: "The Port of Vancouver ships goods between Canada and countries across the Pacific.",
    emoji: "🚢",
  },
  {
    hard: true,
    prompt: "In 1992, the northern cod fishery off Newfoundland and Labrador was closed after cod numbers crashed. How did this affect the region?",
    right: "tens of thousands of people lost their jobs, changing many communities",
    wrong: ["fishing jobs doubled overnight", "it had no effect on anyone", "everyone moved to the Prairies"],
    hint: "Whole towns depended on cod. When the fishery closed, it was one of the biggest job losses in Canada's history.",
    emoji: "🐟",
  },
  {
    hard: true,
    prompt: "The Klondike Gold Rush brought tens of thousands of people north in the late 1890s. Which territory was created soon after, in 1898?",
    right: "Yukon",
    wrong: ["Nunavut", "the Northwest Territories", "Alberta"],
    hint: "Yukon was separated from the Northwest Territories in 1898 because so many people arrived for the gold rush.",
    emoji: "🪙",
  },
  {
    hard: true,
    prompt: "Nunavut became a territory in 1999. What makes it special?",
    right: "it was created through a land claims agreement with Inuit, who are most of its people",
    wrong: ["it is Canada's smallest territory", "nobody lives there", "it is part of Quebec"],
    hint: "Nunavut means 'our land' in Inuktitut. It is Canada's largest territory, and most of its people are Inuit.",
    emoji: "❄️",
  },
  {
    hard: true,
    prompt: "Much of British Columbia is unceded First Nations territory. What does 'unceded' mean?",
    right: "the land was never given up through a treaty or sale",
    wrong: ["the land has no people", "the land was sold to the government", "the land belongs to another country"],
    hint: "Most First Nations in BC never signed treaties giving up their lands, so questions of title and rights are still being worked out today.",
  },
  {
    hard: true,
    prompt: "In 2014, the Supreme Court of Canada recognized Aboriginal title for the Tsilhqot'in Nation. What does Aboriginal title mean?",
    right: "a First Nation's right to own, use and make decisions about its traditional land",
    wrong: ["a nickname for a leader", "a kind of government job", "permission to visit a park"],
    hint: "It was the first time Canada's highest court declared Aboriginal title to a specific area of land.",
    emoji: "⚖️",
  },
  {
    hard: true,
    prompt: "Why do regions sometimes disagree about resource projects like pipelines?",
    right: "a project can bring jobs to one region but environmental risks to another",
    wrong: ["all regions always agree", "pipelines only affect one city", "resources aren't connected to jobs"],
    hint: "Canada's regions have different economies and priorities. Governments must balance them, which can be a challenge.",
    emoji: "🛢️",
  },
  {
    hard: true,
    prompt: "Oil and gas make up a big part of which province's economy?",
    right: "Alberta",
    wrong: ["Prince Edward Island", "Nova Scotia", "New Brunswick"],
    hint: "Alberta has large oil sands and natural gas fields, which provide many jobs.",
    emoji: "🛢️",
  },
  {
    hard: true,
    prompt: "Saskatchewan has much of the world's supply of potash. What is potash mostly used for?",
    right: "fertilizer to help crops grow",
    wrong: ["fuel for cars", "building roads", "making paper"],
    hint: "Potash contains potassium, which plants need. Most of it is used as fertilizer.",
    emoji: "🌱",
  },
  {
    hard: true,
    prompt: "Long before Europeans arrived, Indigenous peoples traded resources between regions. Which is an example?",
    right: "trading goods like obsidian, copper and food along trade routes",
    wrong: ["buying goods with Canadian dollars", "shipping goods by railway", "ordering goods online"],
    hint: "Indigenous trade networks crossed the continent for thousands of years, long before money, railways or the internet.",
  },
];

function regions({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const sort = pick([sortQuestion(REGION_SORT_A, 2), sortQuestion(REGION_SORT_B, perBin(difficulty))]);
  const clues = sample(REGION_CLUES, 2).map((c) => regionClue(c, difficulty < 3));
  return shuffle([sort, ...clues, ...levelled(REGION_BANK, 5, difficulty)]);
}

export const course: Course = {
  grade: "5",
  subject: "social",
  bigIdeas: {
    "ca-bc": [
      "Natural resources continue to shape the economy and identity of different regions of Canada.",
      "Immigration and multiculturalism continue to shape Canadian society and identity.",
      "Canadian institutions and government reflect the challenge of our regional diversity.",
      "Canada's policies for and treatment of minority peoples have negative and positive legacies.",
    ],
  },
  units: [
    {
      id: "levels-of-government",
      title: "Levels of Government",
      emoji: "🏛️",
      blurb: "Who does what in Canada?",
      standards: {
        "ca-bc": "Levels of government (First Peoples, federal, provincial, and municipal), their main functions, and sources of funding",
      },
      parentNote:
        "Federal, provincial/territorial, municipal and Indigenous governments: who leads them, what each looks after, and how they're funded.",
      generate: government,
    },
    {
      id: "making-laws",
      title: "Making Laws",
      emoji: "🗳️",
      blurb: "Bills, elections and taking part",
      standards: {
        "ca-bc": "The development, structure, and function of Canadian institutions and governments; participation and representation in Canadian government",
      },
      parentNote:
        "How a bill becomes law in Parliament, elections and ridings, local bylaws, and how young people can take part in democracy.",
      generate: laws,
    },
    {
      id: "rights-and-freedoms",
      title: "Rights & Freedoms",
      emoji: "⚖️",
      blurb: "The Charter, rights and responsibilities",
      standards: {
        "ca-bc": "The Canadian Charter of Rights and Freedoms; human rights and responses to discrimination in Canadian society",
      },
      parentNote:
        "The main parts of the Canadian Charter of Rights and Freedoms, applying them to real situations, and the responsibilities that come with rights.",
      generate: rights,
    },
    {
      id: "immigration-multiculturalism",
      title: "Immigration & Multiculturalism",
      emoji: "🌍",
      blurb: "Newcomers shaping Canada",
      standards: { "ca-bc": "Immigration and multiculturalism and how they continue to shape Canadian society and identity" },
      parentNote:
        "Push and pull factors, refugees and citizenship, Canada's multiculturalism policy, and a reading about a family's new start in Canada.",
      generate: immigration,
    },
    {
      id: "learning-from-the-past",
      title: "Learning from the Past",
      emoji: "🧡",
      blurb: "Past wrongs, apologies, reconciliation",
      standards: {
        "ca-bc":
          "Past discriminatory government policies and actions, such as the Chinese Head Tax, the Komagata Maru incident, residential schools, and internments",
      },
      parentNote:
        "An age-appropriate, factual look at the Chinese Head Tax, the Komagata Maru, the internment of Japanese Canadians and residential schools, with a focus on apologies, redress and reconciliation. No graphic detail.",
      generate: past,
    },
    {
      id: "regions-and-resources",
      title: "Regions & Resources",
      emoji: "🗺️",
      blurb: "Resources shaping Canada's regions",
      standards: {
        "ca-bc": "Resources and economic development in different regions of Canada; First Peoples land ownership and use",
      },
      parentNote:
        "The natural resources and industries of Canada's regions, how they shape regional identity, and First Peoples' land rights and title.",
      generate: regions,
    },
  ],
};
