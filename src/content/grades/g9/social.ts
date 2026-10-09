import { chance, pick, randInt, sample, shuffle, textChoice } from "../../random";
import type { Course, GenerateOptions, InputQuestion, OrderQuestion, Question } from "../../types";
import { fromBank, sortQuestion, type BankItem, type SortSet } from "../../bank";

// Bank items marked `hard` are stretch questions. Difficulty 1 uses only the
// easier items, 2 mixes in about a third, 3 is mostly stretch.
type Item = BankItem & { hard?: true };
type Level = 1 | 2 | 3;

function levelled(bank: Item[], count: number, difficulty: Level): Question[] {
  if (count <= 0) return [];
  const easy = bank.filter((b) => !b.hard);
  const hard = bank.filter((b) => b.hard);
  const want = difficulty === 1 ? 0 : difficulty === 2 ? Math.ceil(count / 3) : Math.ceil((count * 2) / 3);
  const nHard = Math.min(want, hard.length);
  return [...fromBank(easy, count - nHard), ...fromBank(hard, nHard)];
}

/** Two-basket sorts: 6 items at difficulty 1, 8 at 2 and 3. */
const perBin = (difficulty: Level) => (difficulty === 1 ? 3 : 4);
const lvl = (opts?: GenerateOptions): Level => opts?.difficulty ?? 2;

function numInput(prompt: string, answer: number, hint: string, suffix?: string, visual?: Question["visual"]): InputQuestion {
  return { kind: "input", prompt, answer: String(answer), hint, keypad: "number", suffix, visual };
}

// ---------- Timelines ----------

interface Ev {
  id: string;
  /** A short description of the event, as a sentence fragment. */
  label: string;
  year: number;
  /** Month 1–12, to order events within one year. */
  month?: number;
  emoji: string;
}

/** Choose `n` events with different years, returned in chronological order (the list must already be sorted). */
function spread(events: Ev[], n: number): Ev[] {
  const chosen: number[] = [];
  const years = new Set<number>();
  for (const i of shuffle(events.map((_, k) => k))) {
    if (chosen.length >= n) break;
    if (years.has(events[i].year)) continue;
    years.add(events[i].year);
    chosen.push(i);
  }
  return chosen.sort((a, b) => a - b).map((i) => events[i]);
}

function timelineOrder(events: Ev[], d: Level, prompt = "Put these events in order, earliest first."): OrderQuestion {
  const picked = spread(events, d + 2);
  return {
    kind: "order",
    prompt,
    hint: `Look for clues in the wording. The dates are: ${picked.map((e) => `${e.label} (${e.year})`).join("; ")}.`,
    items: picked.map((e) => ({ id: e.id, label: d === 1 ? `${e.year}: ${e.label}` : e.label, emoji: e.emoji })),
  };
}

function yearQ(events: Ev[]): Question {
  const e = pick(events);
  const others = sample(
    events.filter((x) => x.year !== e.year),
    4,
  ).map((x) => x.year);
  const pool = [...new Set(others)];
  for (const off of shuffle([1, 2, 3, 5, -1, -2, -3, -5, 10, -10])) {
    if (pool.length >= 3) break;
    if (off + e.year !== e.year && !pool.includes(e.year + off)) pool.push(e.year + off);
  }
  return textChoice(
    `In which year did this happen: ${e.label}?`,
    String(e.year),
    pool.slice(0, 3).map(String),
    `Place it on the timeline. ${e.label} happened in ${e.year}.`,
  );
}

function gapQ(events: Ev[]): Question {
  const sorted = spread(events, 2);
  const [a, b] = sorted;
  return numInput(
    `How many years passed between these two events?`,
    b.year - a.year,
    `Subtract the earlier year from the later year: ${b.year} − ${a.year}.`,
    "years",
    {
      type: "table",
      headers: ["Event", "Year"],
      rows: [
        [a.label, a.year],
        [b.label, b.year],
      ],
    },
  );
}

// ---------- Source excerpts (all invented for these exercises) ----------

interface Src {
  title: string;
  paragraphs: string[];
  items: Item[];
}

function sourceQ(src: Src, d: Level): Question {
  const easy = src.items.filter((i) => !i.hard);
  const hard = src.items.filter((i) => i.hard);
  const item = d === 1 || hard.length === 0 ? pick(easy) : chance(d === 3 ? 0.7 : 0.35) ? pick(hard) : pick(easy);
  const [q] = fromBank([item], 1);
  return {
    ...q,
    prompt: item.prompt,
    visual: { type: "passage", title: `${src.title} (invented for this exercise)`, paragraphs: src.paragraphs },
  };
}

const SRC_MILL: Src = {
  title: "A mill worker's letter, Britain, 1840s",
  paragraphs: [
    "I start work at five in the morning and finish at seven at night, with half an hour for dinner. My brother, who is nine, works beside me tying broken threads. The machines never stop, and neither can we.",
    "Still, the wage is the only money our family has, and we are grateful for it, though we are very tired.",
  ],
  items: [
    {
      prompt: "Which feature of early factory life does this letter show most clearly?",
      right: "Long working days, and children working alongside adults",
      wrong: ["Short hours and well-paid work", "Workers choosing their own schedules", "Children attending school full-time"],
      hint: "Look for the hours and for the brother's age. Both show typical conditions in early factories.",
    },
    {
      prompt: "If this were a real letter written at the time, it would be a…",
      right: "primary source",
      wrong: ["secondary source", "textbook summary", "modern opinion"],
      hint: "A primary source is created by someone who lived through the events or was there at the time.",
    },
    {
      prompt: "Why does the writer say they are 'grateful' for the wage despite the hard conditions?",
      right: "The family has few other ways to earn money",
      wrong: ["Factory work was easy and relaxing", "The wages were extremely high", "The writer owns the factory"],
      hint: "Read the second paragraph: the wage is the family's only money. Many people had little choice.",
    },
    {
      prompt: "What is one limitation of using this single letter to understand all factory workers' lives?",
      right: "It shows one person's experience, which may not match every worker's",
      wrong: ["Letters can never be primary sources", "It has no information about work", "It must be false because it's personal"],
      hint: "Historians compare several sources to build a fuller picture.",
      hard: true,
    },
  ],
};

const SRC_OWNER: Src = {
  title: "A mill owner's speech, Britain, 1840s",
  paragraphs: [
    "My mill gives work to four hundred families who would otherwise have none. If Parliament limits our hours, we will lose customers to our rivals abroad, and then every worker will lose their wage.",
  ],
  items: [
    {
      prompt: "Whose interests does this speaker most likely want to protect?",
      right: "Owners' profits, while also arguing that workers benefit",
      wrong: ["Children's schooling above all", "Government inspectors", "The rights of trade unions"],
      hint: "Ask who gains if hours stay long. The speaker is an owner, so their perspective is shaped by that position.",
    },
    {
      prompt: "How does this speaker's perspective differ from a mill worker's?",
      right: "The owner focuses on business costs; the worker focuses on tiring work and survival",
      wrong: ["Both describe the exact same experience", "The owner has no opinion about hours", "The worker owns the machines"],
      hint: "Perspective depends on a person's position, values and interests.",
    },
    {
      prompt: "The speaker claims that limiting hours would cause every worker to lose their wage. How should a historian treat this claim?",
      right: "As an argument to check against other evidence, not as proven fact",
      wrong: ["As proven fact because owners know their business", "As false because owners always lie", "As irrelevant"],
      hint: "People often make arguments that support their own interests. Check claims against evidence from other sources.",
      hard: true,
    },
  ],
};

const SRC_CONFED: Src = {
  title: "A newspaper editorial, 1860s",
  paragraphs: [
    "A union of our colonies would let us build a railway from sea to sea, trade freely among ourselves and stand together should any neighbour covet our land. Surely such strength is worth a little give and take.",
  ],
  items: [
    {
      prompt: "Which two arguments for union does this editorial make?",
      right: "Economic benefits (railway, trade) and defence",
      wrong: ["Religion and language", "Sports and entertainment", "Farming and fishing rights"],
      hint: "Find the phrases about the railway and trade, and about standing together against a neighbour.",
    },
    {
      prompt: "Which group's voice is missing from this editorial?",
      right: "Indigenous peoples, whose lands were being discussed",
      wrong: ["Newspaper editors", "Railway investors", "Colonial politicians"],
      hint: "The writer speaks of 'our land' as if it were uncontested. Indigenous nations were not part of the Confederation talks.",
    },
    {
      prompt: "Which 'neighbour' does the writer most likely mean?",
      right: "The United States",
      wrong: ["France", "Australia", "Mexico"],
      hint: "In the 1860s, many colonists feared American expansion after the U.S. Civil War.",
      hard: true,
    },
  ],
};

const SRC_HEADTAX: Src = {
  title: "A family memory, shared by a grandchild",
  paragraphs: [
    "My grandfather paid five hundred dollars to enter Canada. It took him years of hard work to repay a debt that no other newcomers were asked to pay. He rarely spoke about it, but our family remembers.",
  ],
  items: [
    {
      prompt: "What does this account show about the Chinese head tax?",
      right: "It was a heavy cost placed on Chinese immigrants only",
      wrong: ["It applied equally to all immigrants", "It was a small fee", "It was paid by employers"],
      hint: "Note the phrase 'no other newcomers were asked'. The head tax targeted people of Chinese origin.",
    },
    {
      prompt: "This source passes on a family's memory. It is best described as…",
      right: "an oral history shared by a descendant",
      wrong: ["a government law", "a first-hand 1903 receipt", "a modern textbook"],
      hint: "It was told by a grandchild, not recorded by the person at the time. Oral histories preserve experiences that might not appear in official records.",
      hard: true,
    },
    {
      prompt: "Why does it matter that the impact is described as lasting through generations?",
      right: "Discriminatory laws can affect families long after the laws end",
      wrong: ["Laws never have long-term effects", "Only the person who paid is affected", "It shows the tax was removed immediately"],
      hint: "Debt, separation of families and stigma continue to affect descendants.",
    },
  ],
};

const SRC_TREATY: Src = {
  title: "Two views of a treaty, 1870s",
  paragraphs: [
    "Crown negotiator: In return for annual payments and reserves, the people agree to surrender their rights to this land forever.",
    "First Nations leader: We agreed to share this land and to be neighbours. We did not agree to give it away.",
  ],
  items: [
    {
      prompt: "What do these two statements show about the treaty?",
      right: "The two sides understood the agreement very differently",
      wrong: ["Both sides understood it the same way", "No one signed the treaty", "The treaty was never discussed"],
      hint: "Compare 'surrender' with 'share'. Written texts, oral traditions, translation and worldviews could lead to different understandings.",
    },
    {
      prompt: "Which factor could have made it hard to reach shared understanding?",
      right: "Different worldviews about land, plus translation between languages",
      wrong: ["Both sides spoke the same language fluently", "The land had no value", "No leaders were involved"],
      hint: "Many First Nations see land as a relationship to care for and share, not as property to be sold.",
    },
    {
      prompt: "Why do historians read both viewpoints?",
      right: "A single side leaves out important perspectives",
      wrong: ["To prove one side is always right", "Because only one is a real source", "To avoid using evidence"],
      hint: "Using multiple perspectives gives a fuller and fairer account.",
      hard: true,
    },
  ],
};

const SRC_IMPERIAL: Src = {
  title: "An empire supporter's speech, 1890s",
  paragraphs: [
    "It is our duty to bring railways, schools and order to lands that lack them. The empire is a blessing to all who live under its flag.",
  ],
  items: [
    {
      prompt: "Which motive does the speaker use to justify imperialism?",
      right: "A belief in a duty to 'improve' other societies",
      wrong: ["A desire to protect traditional cultures", "A wish for peace without trade", "Respect for local governments"],
      hint: "This 'civilizing mission' idea treated other cultures as less advanced. Critics point out it ignored local knowledge and often served the empire's own interests.",
    },
    {
      prompt: "Whose perspective is missing from this speech?",
      right: "The people who lived in the colonized lands",
      wrong: ["The speaker's own government", "Empire supporters", "Shipping companies"],
      hint: "The speaker talks about colonized people but does not quote them.",
    },
    {
      prompt: "Which is the best way to test the speaker's claim that the empire is 'a blessing to all'?",
      right: "Compare it with evidence from people who were colonized",
      wrong: ["Trust the claim because it is confident", "Ignore all sources from the era", "Only read other empire supporters"],
      hint: "A strong claim needs evidence from several perspectives, especially those most affected.",
      hard: true,
    },
  ],
};

const SRC_SOLDIER: Src = {
  title: "A soldier's letter home, April 1917",
  paragraphs: [
    "Dear Mum, we took the ridge today. The noise was beyond anything I can describe. I am proud and very tired. Please tell the little ones that I am well and thinking of them.",
  ],
  items: [
    {
      prompt: "What does this letter reveal that a list of battle dates would not?",
      right: "A soldier's personal feelings: pride, fear and tiredness",
      wrong: ["The exact number of soldiers", "The causes of the war", "The terms of the peace treaty"],
      hint: "Personal letters show human experience. They complement official records.",
    },
    {
      prompt: "Soldiers' letters were often read by censors. How might this affect what the writer says?",
      right: "The writer might leave out or soften upsetting details",
      wrong: ["The letter must be completely accurate", "The letter would have more secrets", "Censors write the letters"],
      hint: "Military censors checked mail. Soldiers also wanted to avoid worrying their families.",
      hard: true,
    },
    {
      prompt: "This is a first-hand account from the time. It is a…",
      right: "primary source",
      wrong: ["secondary source", "tertiary source", "modern analysis"],
      hint: "Created at the time of the event, by someone who took part in it.",
    },
  ],
};

const SRC_CONSCRIPT: Src = {
  title: "Two views on conscription, 1917",
  paragraphs: [
    "A Quebec newspaper: Our country has not been attacked. Why should our sons be forced to cross an ocean to fight for an empire we did not choose?",
    "An Ontario newspaper: Our soldiers at the front need fresh troops. Every able man must do his share until the war is won.",
  ],
  items: [
    {
      prompt: "Why did many French Canadians oppose conscription?",
      right: "They felt less connection to Britain's war and were concerned about being forced to fight overseas",
      wrong: ["They did not want to pay taxes", "They were not allowed to be soldiers", "They thought the war was already over"],
      hint: "Many francophones felt little loyalty to the British Empire. Also, early recruiting had been heavily English-speaking.",
    },
    {
      prompt: "What does the conscription crisis show about Canada in 1917?",
      right: "The country was deeply divided along language and regional lines",
      wrong: ["Everyone agreed about the war", "Only soldiers had opinions", "The government avoided the issue"],
      hint: "The two excerpts show opposite positions that split English and French Canada.",
    },
    {
      prompt: "Which strategy would give the fairest picture of the conscription debate?",
      right: "Read sources from several regions and groups, including farmers and Indigenous communities",
      wrong: ["Read only the government's press releases", "Use one newspaper and trust it", "Skip the evidence and guess"],
      hint: "Perspectives differ, so look at many voices.",
      hard: true,
    },
  ],
};

const SRC_ENLIGHT: Src = {
  title: "An Enlightenment idea, in our own words",
  paragraphs: [
    "All people are born with certain natural rights, including life, liberty and property. A government exists to protect those rights. If it fails to do so, the people may change it.",
  ],
  items: [
    {
      prompt: "Which thinker is most closely linked to this idea of natural rights?",
      right: "John Locke",
      wrong: ["Adam Smith", "Napoleon Bonaparte", "James Watt"],
      hint: "Locke argued that governments get their power from the people to protect natural rights.",
    },
    {
      prompt: "Which later document echoes this idea that people have rights a government must protect?",
      right: "The American Declaration of Independence",
      wrong: ["The Royal Proclamation of 1763", "The British North America Act", "The Indian Act"],
      hint: "The Declaration (1776) spoke of 'life, liberty and the pursuit of happiness'.",
    },
    {
      prompt: "Why were these ideas a challenge to monarchs?",
      right: "They suggested rulers' power depends on the consent of the governed",
      wrong: ["They said kings were chosen by wealth alone", "They said governments don't need laws", "They said all kings were gods"],
      hint: "If power comes from the people, a ruler who abuses it can be replaced.",
      hard: true,
    },
  ],
};

const SRC_SCHOOL: Src = {
  title: "A modern summary of residential schools",
  paragraphs: [
    "From the 1800s until 1996, the federal government and churches ran residential schools. About 150,000 First Nations, Métis and Inuit children were taken from their families and communities. The schools aimed to replace Indigenous languages and cultures with European-Canadian ones. Many children were harmed, and many did not return home.",
  ],
  items: [
    {
      prompt: "This summary was written long after the events. It is a…",
      right: "secondary source",
      wrong: ["primary source", "law from the 1880s", "diary entry"],
      hint: "A secondary source is created later, using primary sources and research.",
    },
    {
      prompt: "What was the main goal of the residential school system, as described here?",
      right: "To replace Indigenous languages and cultures (assimilation)",
      wrong: ["To protect Indigenous cultures", "To teach children their own languages", "To honour treaty promises"],
      hint: "Read the third sentence: it says the schools aimed to replace Indigenous languages and cultures.",
    },
    {
      prompt: "Which type of source would add the most important perspective to this summary?",
      right: "Testimony from survivors",
      wrong: ["Advertisements for school supplies", "Maps of railway lines", "Weather records"],
      hint: "Survivors' own words are essential. The TRC collected thousands of statements from survivors, families and communities.",
    },
  ],
};

// ---------- Enlightenment & Revolutions ----------

const REV_EVENTS: Ev[] = [
  { id: "stamp", label: "Britain passes the Stamp Act, taxing the American colonies", year: 1765, emoji: "📜" },
  { id: "tea", label: "Colonists dump tea into Boston Harbour", year: 1773, emoji: "🫖" },
  { id: "decl", label: "The thirteen colonies adopt the Declaration of Independence", year: 1776, emoji: "🖋️" },
  { id: "paris", label: "The Treaty of Paris recognizes American independence", year: 1783, emoji: "🤝" },
  { id: "bast", label: "A crowd storms the Bastille in Paris", year: 1789, emoji: "🏰" },
  { id: "const", label: "The Constitutional Act divides Quebec into Upper and Lower Canada", year: 1791, emoji: "🍁" },
  { id: "louis", label: "King Louis XVI is executed in France", year: 1793, emoji: "👑" },
  { id: "napo", label: "Napoleon Bonaparte seizes power in France", year: 1799, emoji: "🎖️" },
  { id: "haiti", label: "Haiti declares independence after a revolution of enslaved people", year: 1804, emoji: "✊" },
];

const REV_SORT: SortSet = {
  prompt: "American or French Revolution? Sort each item.",
  hint: "The American Revolution (1775–1783) began as a dispute over taxes and representation in British colonies. The French Revolution (from 1789) overthrew France's monarchy and rigid class system.",
  bins: [
    { id: "am", label: "American Revolution", emoji: "🗽" },
    { id: "fr", label: "French Revolution", emoji: "🥖" },
  ],
  items: [
    { label: "Boston Tea Party", emoji: "🫖", bin: "am" },
    { label: "Declaration of Independence", emoji: "🖋️", bin: "am" },
    { label: "'No taxation without representation'", emoji: "💬", bin: "am" },
    { label: "Treaty of Paris, 1783", emoji: "🤝", bin: "am" },
    { label: "Storming of the Bastille", emoji: "🏰", bin: "fr" },
    { label: "The Third Estate demands a voice", emoji: "📣", bin: "fr" },
    { label: "Declaration of the Rights of Man and of the Citizen", emoji: "📜", bin: "fr" },
    { label: "Napoleon rises to power", emoji: "🎖️", bin: "fr" },
  ],
};

const REV_BANK: Item[] = [
  {
    prompt: "What was the Enlightenment?",
    right: "A period of the 1700s when thinkers promoted reason, evidence and individual rights",
    wrong: ["A war between France and Britain", "A religious festival", "A method of making steel"],
    hint: "Enlightenment thinkers questioned tradition and absolute power, and argued for reason, liberty and equality before the law.",
    emoji: "💡",
  },
  {
    prompt: "Montesquieu argued that power should be divided among different branches of government. Why?",
    right: "To prevent any one person or group from having too much power",
    wrong: ["To make the government slower and more expensive", "So kings could rule without limits", "So that elections would not be needed"],
    hint: "Dividing power (for example into law-making, executive and judicial branches) creates checks and balances.",
  },
  {
    prompt: "Voltaire is best known for defending…",
    right: "freedom of speech and religious tolerance",
    wrong: ["the divine right of kings", "the factory system", "empire-building in Africa"],
    hint: "Voltaire criticized censorship and intolerance. He argued that people should be free to hold and share ideas.",
  },
  {
    prompt: "Mary Wollstonecraft argued in 1792 that…",
    right: "women should receive the same education and opportunities as men",
    wrong: ["only nobles should be educated", "women should have no role in society", "kings should be elected"],
    hint: "Her book A Vindication of the Rights of Woman applied Enlightenment ideas of reason and equality to women.",
  },
  {
    prompt: "In 1776, the Declaration of Independence said governments get their power from…",
    right: "the consent of the governed",
    wrong: ["the will of the king", "divine right", "military strength"],
    hint: "This echoed Locke's idea that people can change a government that fails to protect their rights.",
  },
  {
    prompt: "Which slogan best matches the cause of American colonists before 1776?",
    right: "'No taxation without representation'",
    wrong: ["'Liberty, equality, fraternity'", "'Workers of the world, unite!'", "'Peace, order and good government'"],
    hint: "Colonists paid taxes to Britain but had no elected members in the British Parliament.",
  },
  {
    prompt: "Before the French Revolution, French society was divided into three estates. The Third Estate was…",
    right: "everyone else: peasants, workers and the middle class",
    wrong: ["the clergy", "the nobility", "the royal family"],
    hint: "The First Estate was the clergy, the Second was the nobility, and the Third included nearly everyone else (about 98%).",
  },
  {
    prompt: "What was one cause of the French Revolution?",
    right: "Unfair taxes, food shortages and a society where nobles had privileges",
    wrong: ["A war with Canada", "The invention of the railway", "A shortage of kings"],
    hint: "Ordinary people paid heavy taxes while the clergy and nobles had exemptions, and bread prices were high.",
  },
  {
    prompt: "The Declaration of the Rights of Man and of the Citizen (1789) is best described as…",
    right: "a statement that all men are born free and equal in rights",
    wrong: ["a treaty with Britain", "a list of factory laws", "a law about colonies"],
    hint: "It was inspired by Enlightenment ideas. However, it left out women and did not end slavery, so many people continued to struggle for these rights.",
  },
  {
    prompt: "Many Loyalists left the United States after the American Revolution. Where did many move?",
    right: "British North America, including parts of what is now Canada",
    wrong: ["Mexico", "Australia", "Russia"],
    hint: "Loyalists supported Britain. Thousands settled in Nova Scotia, New Brunswick and Quebec, changing the makeup of those colonies.",
    hard: true,
  },
  {
    prompt: "The Constitutional Act of 1791 created Upper Canada and Lower Canada. Why?",
    right: "To give English-speaking Loyalists and French-speaking Canadiens separate governments suited to their laws and traditions",
    wrong: ["To remove French language rights", "To end British rule", "To join the colonies to the U.S."],
    hint: "Upper Canada (mostly English-speaking, British law) and Lower Canada (mostly French-speaking, French civil law and the seigneurial system).",
    hard: true,
  },
  {
    prompt: "The Haitian Revolution (1791–1804) was significant because…",
    right: "enslaved people overthrew colonial rule and created an independent state",
    wrong: ["it ended the American Revolution", "it was a war between Spain and Britain", "it created the British Empire"],
    hint: "Led by people such as Toussaint Louverture, it was the only successful large-scale uprising of enslaved people to create a new nation.",
    hard: true,
  },
  {
    prompt: "How did the revolutions influence ideas of power?",
    right: "They spread the idea that ordinary people can challenge rulers and demand rights",
    wrong: ["They made all kings more powerful", "They ended all wars", "They ended taxes forever"],
    hint: "Revolutions showed that governments could be changed, inspiring later movements in other places.",
  },
  {
    prompt: "Who was NOT included in most 18th-century declarations of rights?",
    right: "Women, enslaved people and Indigenous peoples",
    wrong: ["Wealthy property-owning men", "Nobles", "Merchants"],
    hint: "These documents spoke of universal rights, but in practice they excluded many people. Later movements pushed to widen them.",
    hard: true,
  },
];

function revolutions(opts?: GenerateOptions): Question[] {
  const d = lvl(opts);
  return shuffle([
    timelineOrder(REV_EVENTS, d),
    sortQuestion(REV_SORT, perBin(d)),
    sourceQ(SRC_ENLIGHT, d),
    chance(0.5) ? yearQ(REV_EVENTS) : gapQ(REV_EVENTS),
    ...levelled(REV_BANK, 4, d),
  ]).slice(0, 8);
}

// ---------- Industrial Revolution ----------

const IND_EVENTS: Ev[] = [
  { id: "watt", label: "James Watt patents his improved steam engine", year: 1769, emoji: "⚙️" },
  { id: "loom", label: "Edmund Cartwright patents a power loom", year: 1785, emoji: "🧵" },
  { id: "boat", label: "Robert Fulton's steamboat Clermont sails on the Hudson River", year: 1807, emoji: "🚢" },
  { id: "rail", label: "The Stockton and Darlington Railway opens in England", year: 1825, emoji: "🚂" },
  { id: "act", label: "Britain's Factory Act limits the work of children in textile mills", year: 1833, emoji: "📜" },
  { id: "steel", label: "Henry Bessemer announces a cheap way to make steel", year: 1856, emoji: "🔩" },
  { id: "union", label: "Canada passes the Trade Unions Act after Toronto printers' strike", year: 1872, emoji: "✊" },
];

const WORK_SORT: SortSet = {
  prompt: "Cottage industry or factory system? Sort each feature.",
  hint: "Before industrialization, goods were made by hand at home or in small workshops. Factories used powered machines, hired workers for wages, and ran on set hours.",
  bins: [
    { id: "cottage", label: "work before factories", emoji: "🏡" },
    { id: "factory", label: "factory system", emoji: "🏭" },
  ],
  items: [
    { label: "making cloth by hand at home", emoji: "🧶", bin: "cottage" },
    { label: "a family working at their own pace", emoji: "🕰️", bin: "cottage" },
    { label: "a craftsperson making a whole product", emoji: "🪑", bin: "cottage" },
    { label: "small production for local needs", emoji: "🏘️", bin: "cottage" },
    { label: "steam- or water-powered machines", emoji: "⚙️", bin: "factory" },
    { label: "workers paid wages by the hour or day", emoji: "💵", bin: "factory" },
    { label: "each worker does one small task", emoji: "🔧", bin: "factory" },
    { label: "bells and fixed shifts set the schedule", emoji: "🔔", bin: "factory" },
  ],
};

function townGrowthQ(d: Level): Question {
  const start = pick([5000, 8000, 10000, 12000, 20000]);
  const factor = d === 1 ? 2 : pick([3, 4, 5]);
  const years = pick([30, 40, 50]);
  return numInput(
    `A fictional factory town has ${start} people. After ${years} years of industrial growth its population is ${factor} times as large. How many people live there now?`,
    start * factor,
    `Multiply the starting population by ${factor}: ${start} × ${factor}. Rapid urban growth like this overwhelmed housing and sanitation in many industrial towns.`,
  );
}

const IND_BANK: Item[] = [
  {
    prompt: "Where did the Industrial Revolution begin?",
    right: "Britain, in the later 1700s",
    wrong: ["Canada in the early 1900s", "Japan in the 1500s", "Brazil in the 1600s"],
    hint: "Britain had coal and iron, capital to invest, colonial markets and new inventions, all in the right combination.",
  },
  {
    prompt: "Which was a key fuel for the early steam engines and factories?",
    right: "coal",
    wrong: ["uranium", "solar power", "natural gas pipelines"],
    hint: "Coal powered steam engines and smelted iron. Britain had large coal deposits.",
    emoji: "🪨",
  },
  {
    prompt: "Why did agricultural improvements help industrialization?",
    right: "Fewer farm workers were needed, freeing people to work in towns and factories",
    wrong: ["Farms stopped producing food", "Farmers built the first factories", "Factories needed no workers"],
    hint: "Better farming methods and enclosed land meant farms could feed more people with fewer workers. Many moved to cities.",
  },
  {
    prompt: "How did colonies help industrial Britain?",
    right: "They supplied raw materials like cotton and bought manufactured goods",
    wrong: ["They built Britain's factories for free", "They invented the steam engine", "They had no connection to industry"],
    hint: "Raw materials flowed to the mills and finished products were sold in colonial markets. This tied industrialization and imperialism together.",
  },
  {
    prompt: "Which was a common danger for children working in early factories?",
    right: "Unguarded machinery and very long hours",
    wrong: ["Too much time for school", "Too few chores", "Paid holidays"],
    hint: "Small children were hired for tasks near moving machines, with little protection.",
  },
  {
    prompt: "What did Britain's Factory Act of 1833 do?",
    right: "It limited the hours of children in textile mills and created inspectors",
    wrong: ["It banned all factories", "It made child labour compulsory", "It ended trade unions"],
    hint: "It was an early law to protect children, though enforcement was limited at first.",
  },
  {
    prompt: "What is urbanization?",
    right: "The growth of cities as more people move from the countryside",
    wrong: ["The growth of farms", "The shrinking of factories", "The movement of cities to the coast"],
    hint: "Industrial cities grew quickly because factories needed workers nearby.",
    emoji: "🏙️",
  },
  {
    prompt: "Many industrial cities faced health problems such as cholera. What was a main cause?",
    right: "Crowded housing without clean water or sewage systems",
    wrong: ["Too many parks", "Too much fresh air", "Wide streets"],
    hint: "Cities grew faster than public services. Contaminated water spread diseases until sewers and clean-water systems were built.",
  },
  {
    prompt: "What is a labour union?",
    right: "A group of workers who join together to bargain for better wages and conditions",
    wrong: ["A company's board of owners", "A government tax office", "A type of machine"],
    hint: "Together, workers have more bargaining power than as individuals. Strikes were one tool.",
  },
  {
    prompt: "Why did railways change economies and societies?",
    right: "They moved goods and people faster and cheaper over long distances",
    wrong: ["They made trade slower", "They only carried mail", "They had no effect on cities"],
    hint: "Railways connected farms, mines, factories and markets, and helped new towns grow.",
    emoji: "🚂",
  },
  {
    prompt: "Industrial capitalists became wealthy, while many workers lived in poverty. This is an example of…",
    right: "growing inequality between social classes",
    wrong: ["a fairer economy", "a return to feudalism", "a shortage of wealth"],
    hint: "Factory owners gained profit while wages stayed low, creating a deep gap.",
    hard: true,
  },
  {
    prompt: "In Canada, the Nine-Hour Movement of 1872 demanded…",
    right: "a shorter working day, with strikes in Toronto and other cities",
    wrong: ["longer working days", "an end to railways", "free land for factory owners"],
    hint: "Workers wanted a nine-hour day. Toronto printers' strike led to Canada's Trade Unions Act, which legalized unions.",
    hard: true,
  },
  {
    prompt: "A historian argues the Industrial Revolution brought both progress and hardship. Which pair of facts supports this?",
    right: "Cheap goods and new jobs, alongside pollution and unsafe workplaces",
    wrong: ["Cheap goods only", "Unsafe workplaces only", "No jobs and no goods"],
    hint: "Strong arguments consider more than one side. Look for one benefit and one cost.",
    hard: true,
  },
  {
    prompt: "How did the Industrial Revolution affect the environment?",
    right: "Burning coal and dumping waste caused air and water pollution",
    wrong: ["It cleaned rivers", "It lowered CO₂ in the air", "It had no environmental impact"],
    hint: "Smoke, soot and industrial waste polluted air and rivers, an early step toward today's greenhouse gas emissions.",
  },
  {
    prompt: "Why did many working families send children to work?",
    right: "Family wages were so low that children's earnings were needed",
    wrong: ["Children wanted to avoid play", "Laws required every child to work", "Factories had no adults available"],
    hint: "Poverty pushed families to depend on every possible wage. Laws later limited child labour and required school.",
  },
];

function industrial(opts?: GenerateOptions): Question[] {
  const d = lvl(opts);
  return shuffle([
    timelineOrder(IND_EVENTS, d),
    sortQuestion(WORK_SORT, perBin(d)),
    sourceQ(pick([SRC_MILL, SRC_OWNER]), d),
    chance(0.5) ? townGrowthQ(d) : yearQ(IND_EVENTS),
    ...levelled(IND_BANK, 4, d),
  ]).slice(0, 8);
}

// ---------- Imperialism & Colonialism ----------

const IMP_EVENTS: Ev[] = [
  { id: "royal", label: "The Royal Proclamation of 1763 recognizes Indigenous title and sets rules for land treaties", year: 1763, emoji: "📜" },
  { id: "opium", label: "The First Opium War begins between Britain and China", year: 1839, emoji: "⚓" },
  { id: "hk", label: "Hong Kong is handed to Britain after the Treaty of Nanking", year: 1842, emoji: "🏙️" },
  { id: "raj", label: "The British Crown takes direct control of India from the East India Company", year: 1858, emoji: "👑" },
  { id: "red", label: "Louis Riel's provisional government helps negotiate the creation of Manitoba", year: 1870, emoji: "🌾" },
  { id: "berlin", label: "European powers meet at the Berlin Conference to divide up Africa", year: 1884, emoji: "🗺️" },
  { id: "boer", label: "The South African War (Boer War) begins and Canada sends volunteers", year: 1899, emoji: "🪖" },
];

const MOTIVE_SORT: SortSet = {
  prompt: "Why did empires expand? Sort each motive.",
  hint: "Economic motives are about money (raw materials, markets). Political motives are about power (bases, rivalry, prestige). Cultural motives are about beliefs (religion, a 'civilizing mission').",
  bins: [
    { id: "econ", label: "economic", emoji: "💰" },
    { id: "pol", label: "political / strategic", emoji: "⚓" },
    { id: "cult", label: "cultural / religious", emoji: "🕊️" },
  ],
  items: [
    { label: "finding cheap cotton and rubber", emoji: "🧶", bin: "econ" },
    { label: "gaining new markets for factory goods", emoji: "🏪", bin: "econ" },
    { label: "building naval bases to protect trade routes", emoji: "⚓", bin: "pol" },
    { label: "competing with rival empires for national prestige", emoji: "🏆", bin: "pol" },
    { label: "spreading a missionary religion", emoji: "⛪", bin: "cult" },
    { label: "believing in a 'civilizing mission'", emoji: "🎓", bin: "cult" },
  ],
};

const IMP_BANK: Item[] = [
  {
    prompt: "What is imperialism?",
    right: "When a powerful country extends its control over other territories and peoples",
    wrong: ["When people choose to trade equally", "A type of democracy", "A farming method"],
    hint: "Empires gained power by conquest, treaties, trade pressure and settlement.",
  },
  {
    prompt: "What is colonialism?",
    right: "Establishing control over another territory, often by settling people there and governing it for the colonizing country",
    wrong: ["Sharing power equally with local people", "Studying other cultures", "Ending all trade"],
    hint: "Colonizers often took land and resources and imposed laws and systems on the people already living there.",
  },
  {
    prompt: "What happened at the Berlin Conference of 1884–85?",
    right: "European leaders set rules for dividing African territory, with no African leaders present",
    wrong: ["African nations signed a peace with Europe", "Africa was declared off limits to Europe", "The slave trade began"],
    hint: "The 'Scramble for Africa' drew borders to suit European powers, ignoring existing nations, languages and communities.",
    hard: true,
  },
  {
    prompt: "What was the effect of the Opium Wars on China?",
    right: "Britain forced China to open ports and give up Hong Kong",
    wrong: ["China conquered Britain", "China became part of Canada", "Opium was banned worldwide"],
    hint: "Britain used military force to protect its trade, and China had to accept unequal treaties.",
    hard: true,
  },
  {
    prompt: "India was ruled by Britain for about 90 years after 1857 under a system known as…",
    right: "the British Raj",
    wrong: ["the Magna Carta", "the Hudson's Bay Company", "the Dominion"],
    hint: "After a major uprising in 1857, the Crown replaced the East India Company's rule.",
    hard: true,
  },
  {
    prompt: "How did colonialism affect Indigenous peoples in what is now Canada?",
    right: "Loss of lands, new diseases, laws that limited traditional ways of life, and efforts to assimilate them",
    wrong: ["All Nations gained new lands", "Their cultures disappeared by choice", "It had no effects"],
    hint: "Indigenous nations have continued to resist and to maintain languages, laws and cultures despite these pressures.",
  },
  {
    prompt: "The Royal Proclamation of 1763 stated that…",
    right: "Indigenous land could only be sold to the Crown, through a formal treaty process",
    wrong: ["Indigenous nations had no land rights", "Settlers could take any land they wanted", "Only the Hudson's Bay Company could own land"],
    hint: "It recognized that Indigenous peoples had rights to land that had to be addressed by treaty. Many First Nations today point to it as a foundation of their rights.",
  },
  {
    prompt: "Who was Louis Riel?",
    right: "A Métis leader who led the Red River Resistance and later the 1885 North-West Resistance",
    wrong: ["Canada's first prime minister", "A railway engineer", "A British general"],
    hint: "Riel helped negotiate Manitoba's entry into Confederation in 1870. He was hanged in 1885, and the Métis continue to honour him as a leader.",
  },
  {
    prompt: "Why did the Métis of the Red River region form a provisional government in 1869–70?",
    right: "To protect their land and rights when Canada took over the region without consulting them",
    wrong: ["To join the United States", "To build a railway", "To raise money for a railway"],
    hint: "Canada bought Rupert's Land from the Hudson's Bay Company without asking the people who lived there.",
    hard: true,
  },
  {
    prompt: "What was the Hudson's Bay Company's early role in Canada's history?",
    right: "A fur-trading company that operated across large territories with Crown permission",
    wrong: ["A Canadian army unit", "An Indigenous government", "A railway company"],
    hint: "It traded for furs with many Indigenous nations from the 1600s, shaping relationships, trade and settlement.",
  },
  {
    prompt: "Which statement describes how colonized people responded to imperial control?",
    right: "In many ways, from negotiation to organized resistance and continuing their cultures",
    wrong: ["They never resisted", "They all agreed with imperial rule", "They disappeared"],
    hint: "Colonized peoples were not passive. They negotiated, resisted and adapted.",
  },
  {
    prompt: "Canada sent volunteers to the Boer War in 1899. What did this show?",
    right: "Canada was part of the British Empire, and not everyone agreed on joining Britain's wars",
    wrong: ["Canada was fully independent", "Canada had no army", "Everyone in Canada supported it"],
    hint: "English Canadians generally supported the imperial effort, while many French Canadians did not.",
    hard: true,
  },
  {
    prompt: "Which was a long-term effect of European colonialism in Africa and Asia?",
    right: "Borders and economies shaped for outside interests, which continue to affect countries today",
    wrong: ["No political effects", "Entirely peaceful transitions", "Boundaries based on local communities"],
    hint: "Arbitrary borders grouped or divided communities, and economies were built to export raw materials.",
    hard: true,
  },
  {
    prompt: "Which of the following is an economic motive for imperialism?",
    right: "Gaining access to raw materials such as rubber and cotton",
    wrong: ["Spreading a religion", "Winning prestige against rivals", "Setting up military bases"],
    hint: "Economic motives involve money and resources.",
  },
];

function imperialism(opts?: GenerateOptions): Question[] {
  const d = lvl(opts);
  return shuffle([
    timelineOrder(IMP_EVENTS, d),
    sortQuestion(MOTIVE_SORT, 2),
    sourceQ(pick([SRC_IMPERIAL, SRC_TREATY]), d),
    yearQ(IMP_EVENTS),
    ...levelled(IMP_BANK, 4, d),
  ]).slice(0, 8);
}

// ---------- Confederation & Westward Expansion ----------

const CON_EVENTS: Ev[] = [
  { id: "charl", label: "Delegates meet at the Charlottetown Conference", year: 1864, emoji: "🏛️" },
  { id: "fenian", label: "Fenian raids begin along the border", year: 1866, emoji: "⚔️" },
  { id: "conf", label: "Canada becomes a country (Ontario, Quebec, Nova Scotia and New Brunswick)", year: 1867, emoji: "🍁" },
  { id: "man", label: "Manitoba joins Confederation", year: 1870, emoji: "🌾" },
  { id: "bc", label: "British Columbia joins Confederation", year: 1871, emoji: "🏔️" },
  { id: "pei", label: "Prince Edward Island joins Confederation", year: 1873, emoji: "🥔" },
  { id: "np", label: "The National Policy introduces tariffs to protect Canadian industry", year: 1879, emoji: "🏭" },
  { id: "spike", label: "The last spike of the Canadian Pacific Railway is driven at Craigellachie", year: 1885, emoji: "🚂" },
  { id: "alsk", label: "Alberta and Saskatchewan become provinces", year: 1905, emoji: "🌻" },
  { id: "nfld", label: "Newfoundland joins Confederation", year: 1949, emoji: "⛵" },
];

const TABLE_SORT: SortSet = {
  prompt: "Who was at the Confederation conference table? Sort each group.",
  hint: "The Confederation conferences were attended by appointed delegates from the colonial governments, who were all men. Indigenous nations, women and ordinary voters had no direct say.",
  bins: [
    { id: "in", label: "at the table", emoji: "🪑" },
    { id: "out", label: "not at the table", emoji: "🚪" },
  ],
  items: [
    { label: "John A. Macdonald", emoji: "🎩", bin: "in" },
    { label: "George-Étienne Cartier", emoji: "🎩", bin: "in" },
    { label: "George Brown", emoji: "🎩", bin: "in" },
    { label: "Colonial politicians and delegates", emoji: "🏛️", bin: "in" },
    { label: "First Nations leaders", emoji: "🏞️", bin: "out" },
    { label: "Women of any background", emoji: "👩", bin: "out" },
    { label: "Ordinary voters (no vote on Confederation)", emoji: "🗳️", bin: "out" },
    { label: "Métis leaders", emoji: "🌾", bin: "out" },
  ],
};

const CON_BANK: Item[] = [
  {
    prompt: "Which colonies formed the original Dominion of Canada in 1867?",
    right: "Ontario, Quebec, Nova Scotia and New Brunswick",
    wrong: ["Ontario, Manitoba, British Columbia and Quebec", "Quebec, Newfoundland, PEI and Nova Scotia", "Alberta, Saskatchewan, Ontario and Quebec"],
    hint: "Canada began with four provinces. The rest joined in the decades that followed.",
  },
  {
    prompt: "Who was Canada's first prime minister?",
    right: "John A. Macdonald",
    wrong: ["George Brown", "Wilfrid Laurier", "Robert Borden"],
    hint: "Macdonald led the Conservatives and was prime minister at Confederation in 1867.",
  },
  {
    prompt: "Which was a reason for Confederation?",
    right: "Fear of American expansion and the need for stronger defence",
    wrong: ["A wish to join the United States", "A desire to end the railway", "A wish to leave the British Empire"],
    hint: "After the U.S. Civil War, colonists worried about an American invasion. Joining together offered shared defence.",
  },
  {
    prompt: "How did the end of the Reciprocity Treaty (1866) influence Confederation?",
    right: "It ended free trade with the U.S., pushing colonies to trade more with each other",
    wrong: ["It forced colonies to join the U.S.", "It started a railway", "It ended fur trading"],
    hint: "Without free trade with the Americans, the colonies saw an advantage in an internal market.",
    hard: true,
  },
  {
    prompt: "What was 'political deadlock' in the Province of Canada before 1867?",
    right: "Governments kept falling because no party held a stable majority, partly due to the split between Canada West and Canada East",
    wrong: ["Every politician agreed", "The railway stopped working", "No elections were held"],
    hint: "Parties were so evenly balanced that governments kept falling. A federation offered a way to share power.",
    hard: true,
  },
  {
    prompt: "Why was the railway important to Confederation?",
    right: "It linked far-apart regions and was promised to bring BC into Canada",
    wrong: ["It was only for tourists", "It replaced telephone lines", "It was built by Britain with no cost to Canada"],
    hint: "Linking east and west by rail was needed to unite the country, and BC joined on the promise of a railway.",
    emoji: "🚂",
  },
  {
    prompt: "British Columbia joined Canada in 1871. What was the key promise?",
    right: "A railway connecting BC to the rest of Canada",
    wrong: ["A new king", "Free land for everyone", "No taxes"],
    hint: "Canada promised to begin a railway within two years and finish it within ten years.",
  },
  {
    prompt: "Which of these was NOT a feature of the National Policy (1879)?",
    right: "Free trade with the United States",
    wrong: ["Tariffs on imported goods", "A transcontinental railway", "Settling the West"],
    hint: "The National Policy had three parts: tariffs to protect industry, a railway, and settlement of the Prairies.",
    hard: true,
  },
  {
    prompt: "The North-West Mounted Police (NWMP) were created in 1873 to…",
    right: "extend federal authority across the Prairies",
    wrong: ["fight in Europe", "run the railway", "collect immigration fees"],
    hint: "Canada wanted to assert control over the West before American settlers and traders did. The NWMP became part of how treaties and laws were enforced.",
  },
  {
    prompt: "Who did the construction of the CPR rely on in the BC mountains?",
    right: "Thousands of Chinese workers, many of whom were paid less than other workers and faced dangerous conditions",
    wrong: ["Only volunteers from the army", "Only wealthy investors", "Robots"],
    hint: "Contractors hired Chinese labourers for the most dangerous sections. Many died, and they received little recognition.",
  },
  {
    prompt: "How did the building of the railway affect Indigenous peoples on the Prairies?",
    right: "It brought settlers, helped end the buffalo economy and increased pressure to sign treaties and move to reserves",
    wrong: ["It gave them control of the railway", "It had no impact", "It stopped all settlement"],
    hint: "The railway, new settlers and the collapse of buffalo herds disrupted the Plains First Nations' way of life.",
    hard: true,
  },
  {
    prompt: "What did the Manitoba Act of 1870 do?",
    right: "It created the province of Manitoba and promised land rights to Métis families",
    wrong: ["It created BC", "It ended the fur trade", "It gave away the railway"],
    hint: "The Red River Métis negotiated its terms. In practice, many Métis never received the land promised.",
    hard: true,
  },
  {
    prompt: "What is a federation?",
    right: "A system where power is shared between a central government and regional governments",
    wrong: ["A system run only by a king", "A system with no laws", "A group of friends"],
    hint: "Canada's federal and provincial governments each have their own powers.",
  },
  {
    prompt: "From whose perspective is the story of Confederation often told, and who might tell it differently?",
    right: "Settler politicians' perspective; Indigenous peoples and many Maritimers could tell it differently",
    wrong: ["Everyone told the same story", "Only Britain's perspective exists", "No one else was affected"],
    hint: "Confederation brought benefits to some and loss of land and autonomy to others.",
    hard: true,
  },
];

function confed(opts?: GenerateOptions): Question[] {
  const d = lvl(opts);
  return shuffle([
    timelineOrder(CON_EVENTS, d),
    sortQuestion(TABLE_SORT, perBin(d)),
    sourceQ(SRC_CONFED, d),
    chance(0.5) ? gapQ(CON_EVENTS) : yearQ(CON_EVENTS),
    ...levelled(CON_BANK, 4, d),
  ]).slice(0, 8);
}

// ---------- Indigenous peoples & government policy ----------

const POL_EVENTS: Ev[] = [
  { id: "royal", label: "The Royal Proclamation sets rules for treaties with Indigenous nations", year: 1763, emoji: "📜" },
  { id: "douglas", label: "The Douglas Treaties begin on Vancouver Island", year: 1850, emoji: "🌲" },
  { id: "t1", label: "Treaty 1 is signed in what is now Manitoba", year: 1871, emoji: "🤝" },
  { id: "ia", label: "The Indian Act is passed", year: 1876, emoji: "⚖️" },
  { id: "pot", label: "The potlatch is banned under the Indian Act", year: 1884, emoji: "🚫" },
  { id: "t8", label: "Treaty 8 is signed, including parts of northeast BC", year: 1899, emoji: "🖊️" },
  { id: "last", label: "The last federally run residential school closes", year: 1996, emoji: "🏫" },
  { id: "apol", label: "The Prime Minister apologizes in Parliament for the residential school system", year: 2008, emoji: "🕊️" },
  { id: "trc", label: "The Truth and Reconciliation Commission releases its final report and 94 Calls to Action", year: 2015, emoji: "📖" },
];

const TREATY_SORT: SortSet = {
  prompt: "Treaty or Indian Act? Sort each statement.",
  hint: "Treaties were agreements between the Crown and First Nations, though understandings differed. The Indian Act was a federal law imposed by Parliament that controlled many parts of First Nations people's lives.",
  bins: [
    { id: "treaty", label: "treaty", emoji: "🤝" },
    { id: "act", label: "Indian Act", emoji: "⚖️" },
  ],
  items: [
    { label: "negotiated between First Nations leaders and Crown representatives", emoji: "🗣️", bin: "treaty" },
    { label: "included promises such as reserves, payments and hunting rights", emoji: "🎁", bin: "treaty" },
    { label: "the Numbered Treaties (1871–1921)", emoji: "🔢", bin: "treaty" },
    { label: "promises are still part of Canadian law today", emoji: "🏛️", bin: "treaty" },
    { label: "a federal law passed in 1876 and revised many times", emoji: "📜", bin: "act" },
    { label: "defined who counted as 'Indian' in law", emoji: "🆔", bin: "act" },
    { label: "banned the potlatch from 1884", emoji: "🚫", bin: "act" },
    { label: "created a pass system that limited movement off reserves", emoji: "🎫", bin: "act" },
  ],
};

const POL_BANK: Item[] = [
  {
    prompt: "What was the main purpose of the Numbered Treaties (1871–1921)?",
    right: "To make agreements about land and relationships between the Crown and First Nations across the Prairies, northern Ontario and parts of the North",
    wrong: ["To end the fur trade", "To create the Canadian flag", "To set up Canada's national parks"],
    hint: "Eleven treaties were negotiated. The Crown wanted land for settlement and railways; First Nations sought security, support and a future for their people.",
  },
  {
    prompt: "Why do First Nations and the Crown sometimes disagree about what treaties meant?",
    right: "The written texts, spoken promises and understandings of land, sharing and ownership differed",
    wrong: ["No one remembers the treaties", "Treaties were never written", "Treaties were all identical"],
    hint: "Many First Nations relied on oral tradition and a worldview that land is shared, which did not match the Crown's written 'surrender'.",
  },
  {
    prompt: "Most of British Columbia is not covered by historic treaties. What does this mean?",
    right: "Many First Nations in BC never signed treaties giving up their land, and the question of title is still being addressed",
    wrong: ["Land belongs to no one", "All BC First Nations signed treaties in 1871", "There are no First Nations in BC"],
    hint: "Exceptions include the Douglas Treaties on Vancouver Island, Treaty 8 in the northeast and modern treaties such as the Nisga'a Treaty.",
    hard: true,
  },
  {
    prompt: "What is a reserve?",
    right: "Land set aside for the use of a First Nation under federal law",
    wrong: ["A national park for tourists", "A school", "A military base"],
    hint: "Reserves were often small and were not always the lands communities chose. Today, many First Nations are seeking more control over their lands and resources.",
  },
  {
    prompt: "Which was an effect of the Indian Act on First Nations?",
    right: "The federal government gained control over many aspects of life, including governance, movement and cultural practices",
    wrong: ["First Nations gained complete control over Canada's government", "It ended all discrimination", "It only affected schools"],
    hint: "The Act restricted self-government, made it illegal to hold certain ceremonies and gave Indian agents power over day-to-day matters.",
  },
  {
    prompt: "The potlatch ban (1884–1951) targeted a central tradition of some coastal First Nations. What does this show?",
    right: "Policies aimed to weaken Indigenous cultures and governance",
    wrong: ["Governments respected all customs", "The ban helped communities", "It was a tax law"],
    hint: "The potlatch is a gathering that carries law, history and governance for some Nations. Banning it was an attack on those systems. People continued their traditions, sometimes in secret.",
    hard: true,
  },
  {
    prompt: "Which best describes the residential school system?",
    right: "Government-funded, church-run boarding schools that separated children from their families to assimilate them",
    wrong: ["Optional summer camps", "Schools run by Indigenous communities", "Universities"],
    hint: "About 150,000 First Nations, Métis and Inuit children attended. The last federally run school closed in 1996.",
  },
  {
    prompt: "What were harms of the residential school system?",
    right: "Loss of language and culture, separation from family, and widespread harm and neglect",
    wrong: ["Better family relationships", "Stronger languages", "More traditional knowledge"],
    hint: "The TRC concluded the system caused lasting harm to individuals, families and communities, and called it cultural genocide.",
  },
  {
    prompt: "What is intergenerational trauma?",
    right: "Harm from past events that continues to affect the children and grandchildren of those who experienced them",
    wrong: ["A school subject", "A kind of treaty", "A disease only in older people"],
    hint: "When parents are harmed and separated from their families, the effects can pass on in families and communities.",
    hard: true,
  },
  {
    prompt: "The Truth and Reconciliation Commission (TRC) collected statements from…",
    right: "survivors, families and communities across Canada",
    wrong: ["only government officials", "only church leaders", "only historians"],
    hint: "Thousands of survivors shared their experiences. The Commission's 2015 report included 94 Calls to Action.",
  },
  {
    prompt: "What is reconciliation?",
    right: "An ongoing process of building respectful relationships, based on truth and action",
    wrong: ["Forgetting the past", "A single apology that ends all issues", "A new law about railways"],
    hint: "The TRC emphasizes learning the truth, acknowledging harm and taking action to renew relationships.",
  },
  {
    prompt: "September 30 is the National Day for Truth and Reconciliation. What is its purpose?",
    right: "To honour survivors and remember children who did not come home, and to reflect on what each of us can do",
    wrong: ["To celebrate Confederation", "To mark the end of treaties", "To honour railway workers"],
    hint: "It is also Orange Shirt Day, started by Phyllis Webstad, a survivor, to say 'Every Child Matters'.",
  },
  {
    prompt: "Since 2021, several First Nations have used ground-penetrating radar to search former residential school sites. Why?",
    right: "To find and honour children who died at the schools and never returned home, as survivors and communities have long said",
    wrong: ["To find hidden treasure", "To build new roads", "To study the weather"],
    hint: "Communities lead these searches. Survivors had told these stories for decades, and the work brings truth and healing.",
    hard: true,
  },
  {
    prompt: "How have First Nations, Métis and Inuit communities kept their cultures strong?",
    right: "By passing on languages, laws and traditions, and working to revitalize them today",
    wrong: ["Their cultures ended", "They gave up their traditions voluntarily", "Only museums keep them"],
    hint: "Despite harmful policies, Indigenous peoples have persisted. Language programs and cultural gatherings are growing.",
  },
];

function policy(opts?: GenerateOptions): Question[] {
  const d = lvl(opts);
  return shuffle([
    timelineOrder(POL_EVENTS, d),
    sortQuestion(TREATY_SORT, perBin(d)),
    sourceQ(pick([SRC_TREATY, SRC_SCHOOL]), d),
    yearQ(POL_EVENTS),
    ...levelled(POL_BANK, 4, d),
  ]).slice(0, 8);
}

// ---------- Immigration & Discrimination ----------

const IMM_EVENTS: Ev[] = [
  { id: "ht85", label: "Canada introduces a $50 head tax on Chinese immigrants", year: 1885, emoji: "💵" },
  { id: "sifton", label: "Clifford Sifton becomes minister and promotes settlement of the Prairies", year: 1896, emoji: "🌾" },
  { id: "ht03", label: "The Chinese head tax rises to $500", year: 1903, emoji: "💰" },
  { id: "riot", label: "An anti-Asian riot hits Vancouver", year: 1907, emoji: "🏙️" },
  { id: "cj", label: "The 'continuous journey' rule is brought in to keep out immigrants from India", year: 1908, emoji: "🚢" },
  { id: "kom", label: "The Komagata Maru arrives in Vancouver and is turned away", year: 1914, emoji: "⚓" },
  { id: "excl", label: "The Chinese Immigration Act of 1923 nearly ends Chinese immigration", year: 1923, emoji: "🚫" },
  { id: "repeal", label: "The Chinese Immigration Act is repealed", year: 1947, emoji: "📜" },
  { id: "apol", label: "The Prime Minister apologizes for the Chinese head tax", year: 2006, emoji: "🕊️" },
  { id: "kapol", label: "The Prime Minister apologizes for the Komagata Maru incident", year: 2016, emoji: "🕊️" },
];

const IMM_SORT: SortSet = {
  prompt: "Who was welcomed and who was kept out? Sort each policy.",
  hint: "Canada's early immigration policy was selective. Settlers from Britain, the U.S. and parts of Europe were recruited for farms, while people from Asia faced taxes and bans based on race.",
  bins: [
    { id: "welcome", label: "encouraged certain newcomers", emoji: "🌾" },
    { id: "restrict", label: "excluded or restricted people", emoji: "🚫" },
  ],
  items: [
    { label: "free 160-acre homesteads for farm families", emoji: "🏡", bin: "welcome" },
    { label: "advertising in Europe to attract farmers", emoji: "📣", bin: "welcome" },
    { label: "assisted passage for some British settlers", emoji: "🚢", bin: "welcome" },
    { label: "land grants for settlers on the Prairies", emoji: "🗺️", bin: "welcome" },
    { label: "the Chinese head tax", emoji: "💵", bin: "restrict" },
    { label: "the continuous journey rule", emoji: "🛂", bin: "restrict" },
    { label: "the Chinese Immigration Act of 1923", emoji: "📜", bin: "restrict" },
    { label: "denying many Asian Canadians the vote", emoji: "🗳️", bin: "restrict" },
  ],
};

function headTaxQ(d: Level): Question {
  const year = pick([1885, 1900, 1903]);
  const tax = year === 1885 ? 50 : year === 1900 ? 100 : 500;
  const n = randInt(2, d === 1 ? 3 : 6);
  const kind = d === 1 ? 0 : randInt(0, 1);
  if (kind === 0) {
    return numInput(
      `The Chinese head tax was $${tax} per person from ${year} until the next change. How much did a family of ${n} pay in total to enter Canada?`,
      tax * n,
      `Multiply the tax by the number of people: ${n} × $${tax}. The tax was a heavy burden on families who earned very little.`,
      "$",
    );
  }
  return numInput(
    `A worker earned about $1 a day. How many days of pay did it take to cover a $${tax} head tax? (Use $1 per day.)`,
    tax,
    `Divide the tax by daily pay: $${tax} ÷ $1. Many workers needed years to pay off the debt.`,
    "days",
  );
}

const IMM_BANK: Item[] = [
  {
    prompt: "Why did Canada recruit farmers to settle the Prairies in the 1890s–1900s?",
    right: "To grow food, build the economy and populate the West",
    wrong: ["To reduce the number of farms", "To stop the railway", "To avoid settlement"],
    hint: "Minister Clifford Sifton advertised the 'Last Best West' to attract farmers from Europe and the U.S.",
  },
  {
    prompt: "Who built many of the most dangerous sections of the CPR through the BC mountains?",
    right: "Chinese labourers, who were paid less and faced hazardous work",
    wrong: ["Only soldiers", "Only European engineers", "Only students"],
    hint: "Thousands of Chinese workers built the railway, and many lost their lives. After the line was finished, Canada added a head tax to discourage more arrivals.",
  },
  {
    prompt: "What was the Chinese head tax?",
    right: "A fee charged to Chinese people entering Canada, raised from $50 to $500",
    wrong: ["A tax on all immigrants", "A tax on railway tickets", "A tax on tea"],
    hint: "It started in 1885. By 1903 it was $500, which was a very large sum at that time.",
  },
  {
    prompt: "What did the Chinese Immigration Act of 1923 do?",
    right: "It nearly stopped Chinese immigration until it was repealed in 1947",
    wrong: ["It welcomed Chinese workers", "It ended the head tax and gave voting rights", "It created a railway"],
    hint: "Chinese Canadians called July 1, the day it came into force, 'Humiliation Day'. Families were separated for decades.",
  },
  {
    prompt: "The Komagata Maru arrived in Vancouver in 1914. Who was on board?",
    right: "About 376 passengers from India, mostly Sikh, who were British subjects",
    wrong: ["Soldiers returning from Europe", "A crew of fur traders", "Chinese railway workers"],
    hint: "The passengers were British subjects. They were refused entry because of the continuous journey rule and kept on the ship for two months.",
  },
  {
    prompt: "What was the 'continuous journey' rule used for in 1908?",
    right: "To block immigrants from India, because no ship ran directly from India to Canada",
    wrong: ["To speed up railway travel", "To limit ship sizes", "To help immigrants find homes"],
    hint: "The rule required immigrants to travel to Canada in one unbroken trip from their country of origin, which was nearly impossible for people from India.",
  },
  {
    prompt: "In 2016, the Prime Minister apologized in Parliament for…",
    right: "the Komagata Maru incident",
    wrong: ["the building of the railway", "the Confederation debates", "the fur trade"],
    hint: "Governments have apologized for several past injustices, including the Chinese head tax (2006).",
  },
  {
    prompt: "During the First World War, thousands of people from Ukraine and other European countries were interned as 'enemy aliens'. Why is this considered unjust?",
    right: "Most were civilians who had done nothing wrong and were treated as threats because of where they came from",
    wrong: ["They were soldiers", "They had committed crimes", "They volunteered"],
    hint: "About 8,500 people were interned and many more were forced to register. Many were from the Austro-Hungarian Empire, which was at war with Canada.",
    hard: true,
  },
  {
    prompt: "In 1907 a crowd marched through Vancouver's Chinatown and Japantown, breaking windows. What does this show?",
    right: "Racism and fear toward Asian Canadians were present in the community",
    wrong: ["Everyone welcomed newcomers", "It was a parade", "It was about railway workers' pay only"],
    hint: "Economic competition, fear and prejudice fed anti-Asian racism. Communities responded and defended their neighbourhoods.",
    hard: true,
  },
  {
    prompt: "Why is it important to learn about discriminatory laws from the past?",
    right: "So we can understand their impacts and work to prevent similar injustices",
    wrong: ["To forget them", "To blame today's students", "Because they don't matter"],
    hint: "Understanding the past helps us explain present inequalities and make better decisions.",
  },
  {
    prompt: "The Underground Railroad helped enslaved people escape to British North America. What does this reveal about Canada's history?",
    right: "Black communities settled here and built lives, but also faced discrimination",
    wrong: ["There was no discrimination", "Black people never lived in Canada", "Slavery never existed in Canada"],
    hint: "Slavery existed in Canada until it was abolished in the British Empire in 1834. Black settlers faced segregation even after.",
    hard: true,
  },
  {
    prompt: "Immigrants helped build Canada. Which statement is the most accurate?",
    right: "Newcomers made key contributions, even though many faced unfair laws and treatment",
    wrong: ["Newcomers contributed nothing", "All newcomers were treated the same", "Only one group built the country"],
    hint: "Both parts are true: communities built the country's economy and culture while facing discrimination.",
  },
  {
    prompt: "Why were Indigenous peoples not 'immigrants' in this story?",
    right: "They lived on these lands long before European settlement",
    wrong: ["They were recruited to settle the Prairies in the 1890s", "They arrived in Canada after Confederation", "They came as railway workers"],
    hint: "First Nations, Métis and Inuit have lived here for thousands of years.",
  },
];

function immigration(opts?: GenerateOptions): Question[] {
  const d = lvl(opts);
  return shuffle([
    timelineOrder(IMM_EVENTS, d),
    sortQuestion(IMM_SORT, perBin(d)),
    sourceQ(SRC_HEADTAX, d),
    chance(0.5) ? headTaxQ(d) : yearQ(IMM_EVENTS),
    ...levelled(IMM_BANK, 4, d),
  ]).slice(0, 8);
}

// ---------- Canada's Geography & Population ----------

const GEO_SORT: SortSet = {
  prompt: "Physical or human geography? Sort each feature.",
  hint: "Physical geography is about natural features: landforms, climate, water and soils. Human geography is about people: where they live, how they use land and what they build.",
  bins: [
    { id: "phys", label: "physical geography", emoji: "⛰️" },
    { id: "human", label: "human geography", emoji: "🏙️" },
  ],
  items: [
    { label: "the Rocky Mountains", emoji: "🏔️", bin: "phys" },
    { label: "the Great Lakes", emoji: "🌊", bin: "phys" },
    { label: "permafrost in the North", emoji: "🧊", bin: "phys" },
    { label: "fertile prairie soil", emoji: "🌱", bin: "phys" },
    { label: "where most people live", emoji: "👥", bin: "human" },
    { label: "the highway and rail network", emoji: "🛣️", bin: "human" },
    { label: "the location of big cities", emoji: "🌆", bin: "human" },
    { label: "farms and mines built by people", emoji: "⛏️", bin: "human" },
  ],
};

const REGION_SORT: SortSet = {
  prompt: "Canadian Shield or Interior Plains? Sort each description.",
  hint: "The Canadian Shield is ancient rock with thin soil, thousands of lakes and mineral deposits. The Interior Plains are flat or gently rolling with deep, fertile soil and large-scale farming.",
  bins: [
    { id: "shield", label: "Canadian Shield", emoji: "🪨" },
    { id: "plains", label: "Interior Plains", emoji: "🌾" },
  ],
  items: [
    { label: "very old rock exposed at the surface", emoji: "🪨", bin: "shield" },
    { label: "thousands of lakes and thin soil", emoji: "🏞️", bin: "shield" },
    { label: "rich in minerals such as nickel", emoji: "⛏️", bin: "shield" },
    { label: "mostly forest and rock", emoji: "🌲", bin: "shield" },
    { label: "wheat and canola farms", emoji: "🌾", bin: "plains" },
    { label: "flat or gently rolling land", emoji: "🟩", bin: "plains" },
    { label: "deep, fertile soil", emoji: "🌱", bin: "plains" },
    { label: "oil and natural gas deposits in places", emoji: "🛢️", bin: "plains" },
  ],
};

function densityQ(d: Level): Question {
  const area = pick([10, 20, 25, 40, 50, 100, 200]);
  const dens = randInt(2, d === 1 ? 20 : 60);
  const pop = area * dens;
  const kind = d === 1 ? 0 : randInt(0, 2);
  if (kind === 0) {
    return numInput(
      `A fictional region has ${pop} people living on ${area} square kilometres. What is its population density?`,
      dens,
      `Density = population ÷ area = ${pop} ÷ ${area}.`,
      "people per km²",
    );
  }
  if (kind === 1) {
    return numInput(
      `A fictional valley has a population density of ${dens} people per km² and an area of ${area} km². How many people live there?`,
      pop,
      `Population = density × area = ${dens} × ${area}.`,
    );
  }
  return numInput(
    `A fictional county has ${pop} people and a density of ${dens} people per km². What is its area?`,
    area,
    `Area = population ÷ density = ${pop} ÷ ${dens}.`,
    "km²",
  );
}

function urbanQ(): Question {
  const total = pick([200, 500, 1000, 2000]);
  const pct = pick([20, 40, 50, 60, 70, 80]);
  const urban = (total * pct) / 100;
  return numInput(
    `In a fictional province of ${total} thousand people, ${urban} thousand live in cities. What percent of the population is urban?`,
    pct,
    `Percent urban = (${urban} ÷ ${total}) × 100.`,
    "%",
  );
}

const fmtHour = (h: number) => `${h > 12 ? h - 12 : h} ${h >= 12 ? "p.m." : "a.m."}`;

function timeZoneQ(): Question {
  const zones = [
    { city: "Calgary", off: 1 },
    { city: "Winnipeg", off: 2 },
    { city: "Toronto", off: 3 },
    { city: "Halifax", off: 4 },
  ];
  const z = pick(zones);
  const h = randInt(7, 11);
  const answer = h + z.off;
  const options = shuffle([answer, answer + 1, answer - 1, answer + 2].filter((x) => x !== answer && x >= 1 && x <= 23)).slice(0, 3);
  return textChoice(
    `Canada has several time zones. When it is ${fmtHour(h)} in Vancouver, what time is it in ${z.city}?`,
    fmtHour(answer),
    options.map(fmtHour),
    `Time zones run Pacific, Mountain, Central, Eastern, Atlantic from west to east, each one hour later than the one before. ${z.city} is ${z.off} hour${z.off > 1 ? "s" : ""} ahead of Vancouver.`,
  );
}

const GEO_BANK: Item[] = [
  {
    prompt: "Canada is the second-largest country in the world by total area. Which country is the largest?",
    right: "Russia",
    wrong: ["China", "United States", "Brazil"],
    hint: "Canada covers nearly 10 million km², but Russia is larger.",
  },
  {
    prompt: "Which physical region includes the Rocky Mountains and the coast ranges in western Canada?",
    right: "The Cordillera",
    wrong: ["The Canadian Shield", "The Appalachians", "The Interior Plains"],
    hint: "The Cordillera runs along the west and includes BC and Yukon's mountains.",
    emoji: "🏔️",
  },
  {
    prompt: "Why do most Canadians live in the south, within a few hundred kilometres of the U.S. border?",
    right: "The climate is milder, the soil better for farming, and cities and trade routes developed there",
    wrong: ["The north has no land", "The south has more mountains", "The north has too many people"],
    hint: "Climate, soil, transportation and economic opportunities have drawn people south.",
  },
  {
    prompt: "About how much of Canada's population lives in urban areas today?",
    right: "More than 80%",
    wrong: ["About 10%", "About 30%", "Exactly half"],
    hint: "Canada is highly urbanized, with most people living in cities and large towns.",
    hard: true,
  },
  {
    prompt: "Which two cities have the largest populations in Canada?",
    right: "Toronto and Montreal",
    wrong: ["Vancouver and Halifax", "Regina and Winnipeg", "Ottawa and Victoria"],
    hint: "Toronto is the largest city, followed by Montreal. Vancouver is the third-largest metropolitan area.",
  },
  {
    prompt: "Why does the BC coast usually have milder winters than the Prairies?",
    right: "The Pacific Ocean moderates temperatures",
    wrong: ["It is closer to the equator", "There is more desert", "It has no mountains"],
    hint: "Water heats and cools more slowly than land, so coastal areas have milder temperatures than inland areas at the same latitude.",
  },
  {
    prompt: "Why are the Prairies drier than the BC coast?",
    right: "Mountains block moist Pacific air, creating a rain shadow",
    wrong: ["They are near the ocean", "They have more forest", "They are farther south than Mexico"],
    hint: "Air loses moisture as it rises over the mountains. By the time it gets to the Prairies, it is dry.",
    hard: true,
  },
  {
    prompt: "What is permafrost?",
    right: "Ground that stays frozen for at least two years, common in northern Canada",
    wrong: ["A type of Prairie soil", "Warm ocean water", "A mountain range"],
    hint: "Permafrost is found across much of the North. Thawing from climate change can damage buildings and roads.",
  },
  {
    prompt: "Which region was home to Canada's early industrial growth and holds a large share of its population?",
    right: "The Great Lakes–St. Lawrence Lowlands",
    wrong: ["The Arctic", "The Hudson Bay Lowlands", "The Cordillera"],
    hint: "It has fertile land, waterways for transport, mild climate and large cities like Toronto and Montreal.",
  },
  {
    prompt: "Which factor most influences where people choose to settle?",
    right: "Access to water, usable land, jobs and transport",
    wrong: ["The colour of the soil", "The name of the region", "The flag"],
    hint: "Physical geography and economic opportunity shape settlement patterns.",
  },
  {
    prompt: "How did the physical environment influence the building of the CPR?",
    right: "Mountains and the Canadian Shield made construction difficult and costly",
    wrong: ["There were no obstacles", "The Prairies blocked it", "The ocean was too shallow"],
    hint: "Engineers had to blast through rock and cross rivers and canyons.",
    hard: true,
  },
  {
    prompt: "How does immigration affect Canada's population growth today?",
    right: "It accounts for much of the growth, because births are close to replacement levels",
    wrong: ["It has no effect", "It lowers the population", "It only affects the territories"],
    hint: "Canada's population is aging and fewer children are born per family than in the past, so immigration contributes a lot of growth.",
    hard: true,
  },
  {
    prompt: "What is a population distribution map used for?",
    right: "To show where people live and where they are concentrated",
    wrong: ["To show the weather today", "To show mountain heights", "To show ocean depth"],
    hint: "Dark areas typically mean high density.",
  },
];

function geography(opts?: GenerateOptions): Question[] {
  const d = lvl(opts);
  return shuffle([
    densityQ(d),
    chance(0.5) ? urbanQ() : timeZoneQ(),
    sortQuestion(pick([GEO_SORT, REGION_SORT]), perBin(d)),
    ...levelled(GEO_BANK, 5, d),
  ]).slice(0, 8);
}

// ---------- The First World War ----------

const WW_EVENTS: Ev[] = [
  { id: "sar", label: "Archduke Franz Ferdinand is assassinated in Sarajevo", year: 1914, month: 6, emoji: "📰" },
  { id: "ypres", label: "Canadians hold the line at the Second Battle of Ypres, facing poison gas", year: 1915, emoji: "☁️" },
  { id: "somme", label: "The Battle of the Somme begins", year: 1916, emoji: "🪖" },
  { id: "vimy", label: "Canadian Corps captures Vimy Ridge", year: 1917, month: 4, emoji: "⛰️" },
  { id: "msa", label: "The Military Service Act brings in conscription", year: 1917, month: 8, emoji: "📋" },
  { id: "arm", label: "The Armistice ends the fighting", year: 1918, emoji: "🕊️" },
  { id: "vers", label: "The Treaty of Versailles is signed, with Canada signing separately", year: 1919, emoji: "🖋️" },
];

const WW_CAUSE_SORT: SortSet = {
  prompt: "Cause or consequence of the First World War? Sort each item.",
  hint: "Causes lead up to the war: alliances, militarism, imperial rivalry, nationalism and the assassination. Consequences come after: peace treaties, new borders and changes at home.",
  bins: [
    { id: "cause", label: "cause of the war", emoji: "🔥" },
    { id: "cons", label: "consequence of the war", emoji: "🌱" },
  ],
  items: [
    { label: "rival alliances across Europe", emoji: "🤝", bin: "cause" },
    { label: "an arms race and large armies", emoji: "🪖", bin: "cause" },
    { label: "competition between empires for colonies", emoji: "🗺️", bin: "cause" },
    { label: "the assassination of Archduke Franz Ferdinand", emoji: "📰", bin: "cause" },
    { label: "the Treaty of Versailles", emoji: "🖋️", bin: "cons" },
    { label: "Canada signing the treaty separately from Britain", emoji: "🍁", bin: "cons" },
    { label: "most women gaining the federal vote in 1918", emoji: "🗳️", bin: "cons" },
    { label: "the introduction of income tax in Canada (1917)", emoji: "💵", bin: "cons" },
  ],
};

function lossQ(d: Level): Question {
  const enlisted = 620000;
  const died = 60000;
  if (d === 1) {
    return numInput(
      "About 620 000 Canadians served in the First World War and about 60 000 died. How many of those who served did NOT die? (Use these rounded numbers.)",
      enlisted - died,
      `Subtract: ${enlisted} − ${died} = ${enlisted - died}.`,
    );
  }
  return numInput(
    "About 620 000 Canadians served in the First World War and about 60 000 died. What percent died, to the nearest whole number?",
    10,
    "Divide deaths by those who served: 60 000 ÷ 620 000 ≈ 0.097, or about 10%.",
    "%",
  );
}

const WW_BANK: Item[] = [
  {
    prompt: "Which event set off the First World War in 1914?",
    right: "The assassination of Archduke Franz Ferdinand of Austria-Hungary",
    wrong: ["The sinking of the Titanic", "The Treaty of Versailles", "The Russian Revolution"],
    hint: "The assassination in Sarajevo in June 1914 set off a chain reaction because of alliances.",
  },
  {
    prompt: "What does MAIN stand for when remembering the causes of the First World War?",
    right: "Militarism, Alliances, Imperialism, Nationalism",
    wrong: ["Monarchy, Agriculture, Industry, Navy", "Markets, Armies, Islands, Nations", "Money, Art, Ideas, Newspapers"],
    hint: "These four long-term causes built tension in Europe before 1914.",
  },
  {
    prompt: "Why was Canada automatically at war in August 1914?",
    right: "As part of the British Empire, Canada followed Britain's declaration of war",
    wrong: ["Canada was attacked first", "Canada chose after a vote", "Canada was in an alliance with Germany"],
    hint: "Britain controlled foreign policy for the whole empire, though Canada decided how many troops to send.",
  },
  {
    prompt: "Which battle in April 1917 is often called a defining moment for Canada?",
    right: "Vimy Ridge",
    wrong: ["The Plains of Abraham", "Waterloo", "Gettysburg"],
    hint: "For the first time, all four Canadian divisions fought together and captured the ridge.",
  },
  {
    prompt: "Why is Vimy Ridge remembered with mixed feelings?",
    right: "It was a major success, but thousands of Canadians were killed or wounded",
    wrong: ["It was a failure for Canada", "No one fought there", "It ended the war"],
    hint: "Remembrance includes both pride in the achievement and grief for those lost.",
  },
  {
    prompt: "How did women contribute on the home front?",
    right: "They worked in factories, farms and offices, and as nurses",
    wrong: ["They were banned from working", "They stayed in school only", "They were not involved"],
    hint: "With men overseas, women filled many roles, such as making munitions.",
  },
  {
    prompt: "What were Victory Bonds?",
    right: "Loans that Canadians made to the government to help pay for the war",
    wrong: ["Medals for soldiers", "Taxes on food", "Types of ration cards"],
    hint: "People bought bonds and were paid back with interest after the war.",
  },
  {
    prompt: "Why was conscription so controversial in 1917?",
    right: "Volunteers were falling short, but many opposed forcing men to fight overseas, especially in Quebec",
    wrong: ["Everyone supported it", "It only affected officers", "It was voluntary"],
    hint: "English Canada mostly supported conscription, but many in Quebec, farmers and labour groups opposed it.",
  },
  {
    prompt: "The Wartime Elections Act of 1917 gave the vote to…",
    right: "female relatives of soldiers, while removing it from some 'enemy aliens'",
    wrong: ["all Canadian women", "only farmers", "Indigenous veterans"],
    hint: "It was designed to help the government win the 1917 election. It extended the vote to some women and took it from some naturalized citizens.",
    hard: true,
  },
  {
    prompt: "By the end of 1918, most Canadian women could vote in federal elections. Which provinces were among the first to let women vote provincially (1916)?",
    right: "Manitoba, Saskatchewan and Alberta",
    wrong: ["Nova Scotia, PEI and Quebec", "Newfoundland and Ontario", "Yukon and BC"],
    hint: "Manitoba was first in January 1916, followed soon by Saskatchewan and Alberta. BC and Ontario followed in 1917.",
    hard: true,
  },
  {
    prompt: "Many First Nations and Métis men volunteered to serve. Which was true of their rights at home?",
    right: "Most could not vote in federal elections despite serving",
    wrong: ["They all received the vote in 1914", "They received land in every case", "They were required to serve"],
    hint: "Status First Nations people did not get the federal vote without conditions until 1960.",
    hard: true,
  },
  {
    prompt: "Black Canadians were at first turned away from enlisting. What was formed in 1916 in response?",
    right: "The No. 2 Construction Battalion",
    wrong: ["The Royal Navy", "The Mounties", "The Home Guard"],
    hint: "After pressure from Black communities, the No. 2 Construction Battalion was formed, the only mostly-Black battalion in Canadian military history.",
    hard: true,
  },
  {
    prompt: "How did the war affect Canada's place in the world?",
    right: "Canada gained confidence and more independence, signing the Treaty of Versailles on its own",
    wrong: ["Canada became part of the U.S.", "Canada lost its government", "Canada left the Commonwealth"],
    hint: "Canada's contribution gave it a stronger voice, and it joined the League of Nations in 1919.",
  },
  {
    prompt: "What happened in Halifax on December 6, 1917?",
    right: "A munitions ship exploded in the harbour, devastating much of the city",
    wrong: ["A battle with Germany", "A great fire at a mill", "A railway strike"],
    hint: "The Halifax Explosion was one of the largest human-made explosions before nuclear weapons, killing about 2,000 people.",
    hard: true,
  },
  {
    prompt: "Remembrance Day is observed on November 11 because…",
    right: "The Armistice ending fighting was signed on that date in 1918",
    wrong: ["Canada was founded then", "Vimy Ridge was captured then", "The war began then"],
    hint: "The fighting stopped at 11 a.m. on the 11th day of the 11th month.",
  },
];

function ww1(opts?: GenerateOptions): Question[] {
  const d = lvl(opts);
  return shuffle([
    timelineOrder(WW_EVENTS, d),
    sortQuestion(WW_CAUSE_SORT, perBin(d)),
    sourceQ(pick([SRC_SOLDIER, SRC_CONSCRIPT]), d),
    chance(0.5) ? lossQ(d) : yearQ(WW_EVENTS),
    ...levelled(WW_BANK, 4, d),
  ]).slice(0, 8);
}

// ---------- Thinking Like a Historian ----------

const SOURCE_SORT: SortSet = {
  prompt: "Primary or secondary source? Sort each source.",
  hint: "A primary source comes from the time period being studied: it was created by someone who was there. A secondary source was made later by someone who studied the evidence, such as a textbook or documentary.",
  bins: [
    { id: "prim", label: "primary source", emoji: "📜" },
    { id: "sec", label: "secondary source", emoji: "📚" },
  ],
  items: [
    { label: "a diary written in 1916", emoji: "📔", bin: "prim" },
    { label: "a photograph taken in 1885", emoji: "📷", bin: "prim" },
    { label: "a treaty's original text", emoji: "🖊️", bin: "prim" },
    { label: "a letter from a soldier", emoji: "✉️", bin: "prim" },
    { label: "a history textbook", emoji: "📘", bin: "sec" },
    { label: "a documentary made last year", emoji: "🎬", bin: "sec" },
    { label: "an encyclopedia article", emoji: "📚", bin: "sec" },
    { label: "a historian's article about the railway", emoji: "📰", bin: "sec" },
  ],
};

const CONCEPT_SORT: SortSet = {
  prompt: "Which thinking concept is each question about?",
  hint: "Cause and consequence: why something happened and what it led to. Perspective: how different people saw it. Continuity and change: what stayed the same and what changed.",
  bins: [
    { id: "cause", label: "cause and consequence", emoji: "🔗" },
    { id: "persp", label: "perspective", emoji: "👀" },
    { id: "cc", label: "continuity and change", emoji: "⏳" },
  ],
  items: [
    { label: "What led to the 1917 conscription crisis?", emoji: "🔗", bin: "cause" },
    { label: "What were the effects of the railway?", emoji: "🚂", bin: "cause" },
    { label: "How did a settler and a First Nations leader view the treaty?", emoji: "👀", bin: "persp" },
    { label: "How would a factory owner and a worker describe the mill?", emoji: "👁️", bin: "persp" },
    { label: "What stayed the same for workers after the Factory Act?", emoji: "⏳", bin: "cc" },
    { label: "How did women's voting rights change over time?", emoji: "🗳️", bin: "cc" },
  ],
};

const THINK_BANK: Item[] = [
  {
    prompt: "What is a primary source?",
    right: "Evidence created at the time by someone who experienced the event",
    wrong: ["A textbook written last year", "An opinion with no evidence", "A summary written by a student"],
    hint: "Primary sources include letters, photos, laws and artifacts from the period.",
  },
  {
    prompt: "What does 'perspective' mean in history?",
    right: "A point of view shaped by a person's experiences, values and position",
    wrong: ["A set of dates", "A type of map", "A fact that everyone agrees on"],
    hint: "Different people can see the same event very differently.",
  },
  {
    prompt: "A newspaper article from 1885 describes Chinese railway workers using insulting words. What should a historian do?",
    right: "Treat it as evidence of attitudes at that time, and look for other voices and sources",
    wrong: ["Accept it as completely true", "Delete it from the record", "Ignore the people it describes"],
    hint: "Biased sources can still be evidence, of the prejudice itself. But they should be checked against other perspectives.",
    hard: true,
  },
  {
    prompt: "Which question best tests the reliability of a source?",
    right: "Who made it, why, and what evidence supports it?",
    wrong: ["How long is it?", "What colour is the cover?", "How many people like it?"],
    hint: "Check the author, purpose, time, audience and evidence.",
  },
  {
    prompt: "What is a cause?",
    right: "An event or condition that helps make something else happen",
    wrong: ["The result of an event", "A person's opinion", "A date"],
    hint: "A consequence is the result, and a cause is what led to it.",
  },
  {
    prompt: "The Industrial Revolution led to the growth of cities. In this relationship, urban growth is a…",
    right: "consequence",
    wrong: ["cause", "source", "perspective"],
    hint: "Factories (the cause) drew people to cities, resulting in urban growth (the consequence).",
  },
  {
    prompt: "What is 'continuity' in history?",
    right: "Something that stays the same over time",
    wrong: ["Something that changes quickly", "A type of source", "A battle"],
    hint: "Historians ask what changed and what stayed the same.",
  },
  {
    prompt: "Why are historians careful about judging people in the past by today's standards only?",
    right: "People lived with different knowledge and rules, but we can still judge actions by ethical standards, including justice and human rights",
    wrong: ["Because the past doesn't matter", "Because ethical judgment is impossible", "Because everyone was right"],
    hint: "Good ethical judgment weighs both the context of the time and lasting principles. Some actions, like discrimination, were unjust even then, and people at the time said so.",
    hard: true,
  },
  {
    prompt: "A museum displays an object. Which question best helps you understand its historical significance?",
    right: "Who used it, what changes did it represent, and who is missing from the story?",
    wrong: ["Is it expensive?", "Is it big?", "Is it shiny?"],
    hint: "Significance is about importance to people then and now, and the changes it caused or reveals.",
  },
  {
    prompt: "Which statement is an opinion rather than a fact?",
    right: "'Confederation was the best thing that ever happened to Canada.'",
    wrong: ["'Canada was formed in 1867.'", "'British Columbia joined in 1871.'", "'The CPR was completed in 1885.'"],
    hint: "Facts can be checked. 'Best' depends on who you ask, so it is an opinion.",
  },
  {
    prompt: "Why is it important to use sources from different groups?",
    right: "No single group tells the whole story",
    wrong: ["Because every source is identical", "To make the research shorter", "To avoid evidence"],
    hint: "Each source shows a slice of the past. Together they give a more complete picture.",
  },
  {
    prompt: "A historian says the railway was both a 'success' and a 'harm'. Which support best explains both?",
    right: "It united the country and boosted trade, but it harmed Indigenous communities and cost many Chinese workers' lives",
    wrong: ["It was built quickly", "It had good paint", "It was long"],
    hint: "To show complexity, use specific evidence on both sides.",
    hard: true,
  },
  {
    prompt: "Which is the best example of historical 'evidence' for an argument?",
    right: "A quote from a signed treaty with a citation",
    wrong: ["A rumour you heard", "A guess", "A feeling"],
    hint: "Evidence is specific, can be checked and links to your claim.",
  },
  {
    prompt: "You find two sources that disagree about the same event. What is the best response?",
    right: "Compare who wrote them, when and why, then look for more evidence",
    wrong: ["Pick the one you like", "Throw both away", "Assume both are the same"],
    hint: "Disagreement is a chance to dig deeper into context and perspective.",
  },
];

function thinking(opts?: GenerateOptions): Question[] {
  const d = lvl(opts);
  const srcs = [SRC_MILL, SRC_OWNER, SRC_CONFED, SRC_HEADTAX, SRC_TREATY, SRC_IMPERIAL, SRC_SOLDIER, SRC_CONSCRIPT, SRC_ENLIGHT, SRC_SCHOOL];
  const [s1, s2] = sample(srcs, 2);
  return shuffle([
    sortQuestion(SOURCE_SORT, perBin(d)),
    sourceQ(s1, d),
    sourceQ(s2, d),
    ...levelled(THINK_BANK, 4, d),
    ...(d === 1 ? [] : [sortQuestion(CONCEPT_SORT, 2)]),
  ]).slice(0, 8);
}

export const course: Course = {
  grade: "9",
  subject: "social",
  bigIdeas: {
    "ca-bc": [
      "Emerging ideas and ideologies profoundly influence societies and events.",
      "Disparities in power alter the balance of relationships between individuals and between societies.",
      "Collective identity is constructed and can change over time.",
      "Historical and contemporary injustices challenge the narrative and identity of Canada as an inclusive, multicultural society.",
      "The physical environment influences the nature of political, social, and economic change.",
    ],
  },
  units: [
    {
      id: "enlightenment-revolutions",
      title: "Enlightenment & Revolutions",
      emoji: "💡",
      blurb: "Ideas that shook the world",
      parentNote:
        "Enlightenment ideas such as natural rights and the separation of powers, the American and French revolutions at a high level, the Haitian Revolution, and how these events shaped the colonies that became Canada.",
      standards: { "ca-bc": "Emerging ideas and ideologies: the Enlightenment, the American and French Revolutions and their effects" },
      generate: revolutions,
    },
    {
      id: "industrial-revolution",
      title: "The Industrial Revolution",
      emoji: "🏭",
      blurb: "Machines, factories and cities",
      parentNote:
        "Why industrialization began in Britain, how factory work, child labour and urban growth changed life, and how workers organized for better conditions, including in Canada.",
      standards: { "ca-bc": "Industrialization: causes, working and living conditions, urbanization, and the rise of labour movements" },
      generate: industrial,
    },
    {
      id: "imperialism-colonialism",
      title: "Empires & Colonialism",
      emoji: "🗺️",
      blurb: "Who held power, and who paid",
      parentNote:
        "Motives for imperialism, examples from Africa, India and China, and the effects of colonialism on Indigenous peoples in what is now Canada, including the Royal Proclamation and the Métis Red River Resistance.",
      standards: { "ca-bc": "Imperialism and colonialism: motives and effects around the world and on Indigenous peoples in Canada" },
      generate: imperialism,
    },
    {
      id: "confederation-expansion",
      title: "Confederation & the West",
      emoji: "🍁",
      blurb: "Building a country, coast to coast",
      parentNote:
        "Why the colonies joined in 1867, who was at (and absent from) the table, the role of the railway, and how British Columbia and other provinces joined.",
      standards: { "ca-bc": "Confederation and western expansion: reasons, perspectives, the railway, and provincial entry" },
      generate: confed,
    },
    {
      id: "indigenous-policy",
      title: "Treaties, the Indian Act & Schools",
      emoji: "🕊️",
      blurb: "Policies, impacts and reconciliation",
      parentNote:
        "Treaties and differing understandings of them, the Indian Act, the residential school system and its lasting harm, and the Truth and Reconciliation Commission. Written factually and without graphic detail, with respect for survivors.",
      standards: { "ca-bc": "Indigenous peoples and government policies: treaties, the Indian Act, residential schools, and reconciliation" },
      generate: policy,
    },
    {
      id: "immigration-discrimination",
      title: "Immigration & Discrimination",
      emoji: "🚢",
      blurb: "Who was welcomed, who wasn't",
      parentNote:
        "Canada's early immigration policies, the Chinese head tax and railway workers, the Komagata Maru, wartime internment, and how apologies and later change address these injustices.",
      standards: { "ca-bc": "Immigration, racism and discrimination in Canada: policies, injustices and responses" },
      generate: immigration,
    },
    {
      id: "canada-geography-population",
      title: "Canada's Land & People",
      emoji: "🌎",
      blurb: "Regions, climate and where we live",
      parentNote:
        "Canada's physical regions, how climate and landforms shape settlement, population density, urbanization, and time zones.",
      standards: { "ca-bc": "Physical geography and population of Canada: regions, climate, distribution and urbanization" },
      generate: geography,
    },
    {
      id: "first-world-war",
      title: "Canada & the First World War",
      emoji: "🌹",
      blurb: "War abroad, change at home",
      parentNote:
        "Causes of the war, Canada's military contribution including Vimy Ridge, the home front, the conscription crisis, who could and couldn't vote, and the war's impact on Canada's independence.",
      standards: { "ca-bc": "Global and regional conflict: the First World War and its impact on Canada" },
      generate: ww1,
    },
    {
      id: "thinking-like-a-historian",
      title: "Thinking Like a Historian",
      emoji: "🔍",
      blurb: "Evidence, perspective and judgment",
      parentNote:
        "Practising the skills of social studies: judging sources, comparing perspectives, cause and consequence, continuity and change, significance and ethical judgment, using short invented source excerpts.",
      standards: { "ca-bc": "Social studies inquiry: evidence, perspective, cause and consequence, continuity and change, significance, ethical judgment" },
      generate: thinking,
    },
  ],
};
