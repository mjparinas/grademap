import { chance, pick, sample, shuffle, textChoice } from "../../random";
import type { Course, GenerateOptions, InputQuestion, OrderQuestion, Question } from "../../types";
import { fromBank, sortQuestion, type BankItem, type SortSet } from "../../bank";

// Bank items marked `hard` are stretch questions. Difficulty 1 uses only the
// easier items, 2 mixes in about a third, 3 is mostly stretch.
type Item = BankItem & { hard?: true };
type Level = 1 | 2 | 3;

function levelled(bank: Item[], count: number, difficulty: Level): Question[] {
  const easy = bank.filter((b) => !b.hard);
  const hard = bank.filter((b) => b.hard);
  const want = difficulty === 1 ? 0 : difficulty === 2 ? Math.ceil(count / 3) : Math.ceil((count * 2) / 3);
  const nHard = Math.min(want, hard.length);
  return [...fromBank(easy, count - nHard), ...fromBank(hard, nHard)];
}

/** Smaller two-basket sorts at difficulty 1, bigger ones at 3. */
const perBin = (difficulty: Level) => (difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4);

/** A short original reading with questions about it. */
interface Reading {
  title: string;
  paragraphs: string[];
  questions: Item[];
}

function readingQuestion(readings: Reading[], d: Level): Question {
  const r = pick(readings);
  const pool = d === 1 ? r.questions.filter((q) => !q.hard) : r.questions;
  const b = pick(pool);
  return textChoice(b.prompt, b.right, b.wrong, b.hint, { type: "passage", title: r.title, paragraphs: r.paragraphs });
}

/** A timeline event. `when` is shown instead of the year when it isn't exact. */
interface TimelineEvent {
  year: number;
  label: string;
  emoji?: string;
  when?: string;
}

/** Pick `count` events and ask for them in time order (labels show the year). */
function timeline(prompt: string, hint: string, events: TimelineEvent[], count: number): OrderQuestion {
  const chosen = new Set(sample(events, Math.min(count, events.length)));
  return {
    kind: "order",
    prompt,
    hint,
    items: events
      .filter((e) => chosen.has(e))
      .sort((a, b) => a.year - b.year)
      .map((e) => ({ id: `y${e.year}`, label: `${e.label} (${e.when ?? e.year})`, emoji: e.emoji })),
  };
}

const timelineSize = (d: Level) => (d === 1 ? 3 : d === 2 ? 4 : 5);

// =====================================================================
// First Peoples & the Land
// =====================================================================

const FIRST_PEOPLES_READINGS: Reading[] = [
  {
    title: "Clam Gardens",
    paragraphs: [
      "For thousands of years, some First Nations on the Pacific coast have built clam gardens. They piled rocks into low walls along the beach, near the lowest tide line.",
      "Over time, sand and gravel collected behind the walls and made wide, flat terraces. Clams grew well there, so families had more food to eat and to trade.",
      "Clam gardens were cared for over many generations. Today, some First Nations are working with scientists to rebuild and look after clam gardens again.",
    ],
    questions: [
      {
        prompt: "Why did people build rock walls on the beach?",
        right: "To make flat places where more clams could grow",
        wrong: ["To keep whales away from the beach", "To build houses by the sea", "To stop the tide from coming in"],
        hint: "Read the second paragraph. What collected behind the walls, and what grew well there?",
      },
      {
        prompt: "What is happening with clam gardens today?",
        right: "Some First Nations are rebuilding and caring for them",
        wrong: ["They have all been forgotten", "Only tourists use them now", "They are used to grow potatoes"],
        hint: "Look at the last sentence of the passage.",
      },
      {
        prompt: "Clam gardens were cared for \"over many generations.\" What does that mean?",
        right: "For a very long time, by grandparents, parents, children and more",
        wrong: ["For one afternoon", "Only by scientists", "Only during the winter"],
        hint: "A generation is everyone born around the same time. Many generations means a very long time.",
        hard: true,
      },
    ],
  },
  {
    title: "Trading Long Ago",
    paragraphs: [
      "Long before Europeans arrived, First Peoples across North America traded with each other. Trade routes followed rivers, coastlines and mountain passes, and some goods travelled hundreds of kilometres.",
      "On the Pacific coast, an oil made from a small fish called the eulachon was very valuable. The trails used to carry it inland became known as grease trails.",
      "Nations traded what they had for what they needed, such as shells, dried fish, furs and obsidian, a sharp black stone used for making tools.",
    ],
    questions: [
      {
        prompt: "What does the passage tell us about trade before Europeans arrived?",
        right: "First Peoples already traded over long distances",
        wrong: ["There was no trade at all", "Only Europeans knew how to trade", "People only traded with the family next door"],
        hint: "The first paragraph says some goods travelled hundreds of kilometres.",
      },
      {
        prompt: "Why were some trails called grease trails?",
        right: "People carried valuable eulachon oil along them",
        wrong: ["They were muddy and slippery", "Wagons greased their wheels there", "Fur traders built them"],
        hint: "Read the second paragraph. What valuable oil was carried inland?",
      },
      {
        prompt: "What was obsidian used for?",
        right: "Making sharp tools",
        wrong: ["Making oil", "Building canoes", "Drying fish"],
        hint: "The passage calls obsidian a sharp black stone. What would a sharp stone be good for?",
        hard: true,
      },
    ],
  },
  {
    title: "Making Decisions Together",
    paragraphs: [
      "Before Europeans arrived, First Peoples had their own ways of governing, or making decisions and rules for their communities. Each Nation had its own laws, its own leaders and its own ways of choosing them.",
      "In many Nations, leaders listened to Elders and talked things over with their people. In the east, five Nations joined together as the Haudenosaunee Confederacy, so they could make decisions together and keep peace among them.",
      "First Nations governments still lead their communities today. They make decisions about things like land, schools and health.",
    ],
    questions: [
      {
        prompt: "In the passage, what does governing mean?",
        right: "Making decisions and rules for a community",
        wrong: ["Trading furs for tools", "Building canoes", "Travelling to new lands"],
        hint: "The first paragraph explains the word right after it says governing.",
      },
      {
        prompt: "Why did five Nations join together as the Haudenosaunee Confederacy?",
        right: "To make decisions together and keep peace",
        wrong: ["To start the fur trade", "To build a railway", "To search for gold"],
        hint: "Read the second paragraph. It says what joining together let them do.",
      },
      {
        prompt: "What does the passage say about First Nations governments today?",
        right: "They still lead their communities",
        wrong: ["They ended long ago", "They are run from Europe", "They only make rules about fishing"],
        hint: "Read the last paragraph.",
        hard: true,
      },
    ],
  },
];

const RESOURCE_SORT: SortSet = {
  prompt: "Long ago, First Peoples used the resources of their own region. Where is each one from?",
  hint: "The Pacific coast has giant cedar trees and sea foods. The Plains have wide grasslands where bison roamed. The Arctic has sea ice, caribou and Arctic char.",
  bins: [
    { id: "coast", label: "Pacific coast", emoji: "🌊" },
    { id: "plains", label: "Plains", emoji: "🌾" },
    { id: "arctic", label: "Arctic", emoji: "❄️" },
  ],
  items: [
    { label: "western red cedar", emoji: "🌲", bin: "coast" },
    { label: "clams from clam gardens", emoji: "🐚", bin: "coast" },
    { label: "eulachon oil", emoji: "🐟", bin: "coast" },
    { label: "bison", emoji: "🦬", bin: "plains" },
    { label: "pemmican made from bison meat", emoji: "🍖", bin: "plains" },
    { label: "seals hunted at holes in the sea ice", emoji: "🦭", bin: "arctic" },
    { label: "Arctic char", emoji: "🎣", bin: "arctic" },
  ],
};

const FIRST_PEOPLES_BANK: Item[] = [
  {
    prompt: "How long have First Peoples lived on the land now called Canada?",
    right: "For thousands of years",
    wrong: ["For about 100 years", "Since 1867", "Since the gold rush"],
    hint: "First Peoples were here long before Europeans arrived, for longer than anyone can remember.",
    emoji: "🌲",
  },
  {
    prompt: "Which three groups are recognized as Indigenous peoples in Canada?",
    right: "First Nations, Métis and Inuit",
    wrong: ["Settlers, traders and miners", "British, French and Spanish", "Coast, Plains and Mountain peoples"],
    hint: "Canada's Constitution names three groups of Indigenous peoples: First Nations, Métis and Inuit.",
    emoji: "🍁",
  },
  {
    prompt: "Many First Nations on the Pacific coast used western red cedar to make…",
    right: { label: "canoes, houses and clothing", emoji: "🛶" },
    wrong: [
      { label: "metal pots and pans", emoji: "🍳" },
      { label: "glass windows", emoji: "🪟" },
      { label: "paper books", emoji: "📚" },
    ],
    hint: "Cedar wood was carved into canoes and planks for houses, and its soft bark was woven into clothing and baskets.",
  },
  {
    prompt: "Many First Nations on the Plains relied on the bison for…",
    right: "food, clothing and tools",
    wrong: ["building cedar canoes", "catching salmon", "trading gold"],
    hint: "Almost every part of the bison was used: meat for food, hides for clothing and shelter, and bones for tools.",
    emoji: "🦬",
  },
  {
    prompt: "Inuit and their ancestors have lived for thousands of years in…",
    right: { label: "the Arctic", emoji: "❄️" },
    wrong: [
      { label: "the Prairies", emoji: "🌾" },
      { label: "the Pacific rainforest", emoji: "🌲" },
      { label: "the Great Lakes", emoji: "🏞️" },
    ],
    hint: "Inuit homelands are in the far north of Canada. Many Inuit communities are in Nunavut.",
  },
  {
    prompt: "The land a First Nation has lived on and cared for since long ago is called its…",
    right: "traditional territory",
    wrong: ["province", "colony", "capital city"],
    hint: "Your school is on the traditional territory of one or more First Nations.",
    emoji: "🏞️",
  },
  {
    prompt: "How have many First Peoples passed down history, knowledge and laws?",
    right: "Through oral history, shared by Elders and Knowledge Keepers",
    wrong: ["Only through textbooks", "Through television", "By mailing letters"],
    hint: "Oral history means knowledge shared by speaking, from one generation to the next.",
    emoji: "🗣️",
  },
  {
    prompt: "Which statement about First Peoples today is true?",
    right: "They are living communities with their own governments, languages and cultures",
    wrong: ["They only lived long ago", "They all live the same way", "They no longer live in Canada"],
    hint: "First Peoples are part of Canada today. Each Nation has its own language, culture and leaders.",
    emoji: "🤝",
  },
  {
    prompt: "About how many First Nations communities are there in Canada?",
    right: "More than 600",
    wrong: ["Just 1", "About 10", "About 50"],
    hint: "There are many different First Nations, each with its own history and culture.",
    emoji: "🍁",
  },
  {
    prompt: "Why did many First Peoples travel to different places at different times of year?",
    right: "To fish, hunt and gather foods when each was in season",
    wrong: ["To visit the trading posts", "To search for gold", "To follow the railway"],
    hint: "Salmon, berries and animals are each easiest to find at certain times of year. (Trading posts, gold rushes and railways came much later!)",
    emoji: "🍂",
    hard: true,
  },
  {
    prompt: "Some First Nations built fish weirs (fences across a river). Why let some fish swim through?",
    right: "So enough fish could lay eggs for the future",
    wrong: ["Because they didn't like fish", "To make the river flow faster", "To keep the water clean for drinking"],
    hint: "Taking only part of the catch meant there would be fish for years to come.",
    emoji: "🐟",
    hard: true,
  },
  {
    prompt: "The names Canada, Ottawa and Saskatchewan all come from…",
    right: "Indigenous languages",
    wrong: ["the names of English kings", "French words for rivers", "gold miners' nicknames"],
    hint: "Canada comes from kanata, a word for village. Saskatchewan comes from a Cree name for a fast-flowing river.",
    emoji: "🗺️",
    hard: true,
  },
  {
    prompt: "About how many Indigenous languages are spoken in Canada today?",
    right: "More than 70",
    wrong: ["Only 1", "About 5", "None at all"],
    hint: "There are many Indigenous languages, and communities are working hard to teach them to young people.",
    emoji: "🗣️",
    hard: true,
  },
  {
    prompt: "Why do many schools start events by naming the First Nation whose land they are on?",
    right: "To show respect for the people who have cared for the land for generations",
    wrong: ["Because it is a spelling test", "To decide who wins a game", "To announce the lunch menu"],
    hint: "This is called a land acknowledgement. It reminds us whose traditional territory we live on.",
    emoji: "🏫",
    hard: true,
  },
];

function firstPeoples({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return shuffle([
    readingQuestion(FIRST_PEOPLES_READINGS, difficulty),
    sortQuestion(RESOURCE_SORT, difficulty === 1 ? 1 : 2),
    ...levelled(FIRST_PEOPLES_BANK, 6, difficulty),
  ]);
}

// =====================================================================
// Contact & the Fur Trade
// =====================================================================

const CONTACT_EVENTS: TimelineEvent[] = [
  { year: 1000, when: "about 1000", label: "Norse sailors reach Newfoundland", emoji: "⛵" },
  { year: 1497, label: "John Cabot sails to the east coast of North America", emoji: "🚢" },
  { year: 1534, label: "Jacques Cartier arrives in the Gulf of St. Lawrence", emoji: "⚓" },
  { year: 1608, label: "Samuel de Champlain founds Quebec", emoji: "🏘️" },
  { year: 1670, label: "The Hudson's Bay Company is founded", emoji: "🦫" },
];

const FUR_EVENTS: TimelineEvent[] = [
  { year: 1670, label: "The Hudson's Bay Company is founded", emoji: "🦫" },
  { year: 1778, label: "Captain Cook's crew trades for sea otter furs at Nootka Sound", emoji: "⛵" },
  { year: 1793, label: "Alexander Mackenzie reaches the Pacific by land", emoji: "🥾" },
  { year: 1808, label: "Simon Fraser travels down the Fraser River", emoji: "🛶" },
  { year: 1821, label: "The HBC and the North West Company join together", emoji: "🤝" },
  { year: 1827, label: "Fort Langley trading post is built", emoji: "🏕️" },
];

function contactTimeline(d: Level): OrderQuestion {
  return chance(0.5)
    ? timeline(
        "Put these early contact events in order, from earliest to latest.",
        "Use the years to help you. The smallest year happened first.",
        CONTACT_EVENTS,
        timelineSize(d),
      )
    : timeline(
        "Put these fur trade events in order, from earliest to latest.",
        "Use the years to help you. The smallest year happened first.",
        FUR_EVENTS,
        timelineSize(d),
      );
}

const COOPERATION_SORT: SortSet = {
  prompt: "Is it cooperation or conflict? Tap an item, then tap its basket.",
  hint: "Cooperation means working together so both sides gain. Conflict means a disagreement or struggle.",
  bins: [
    { id: "coop", label: "cooperation", emoji: "🤝" },
    { id: "conflict", label: "conflict", emoji: "⚡" },
  ],
  items: [
    { label: "trading furs for metal pots and tools", emoji: "🍲", bin: "coop" },
    { label: "First Peoples guiding traders along rivers", emoji: "🛶", bin: "coop" },
    { label: "sharing how to survive the winter", emoji: "❄️", bin: "coop" },
    { label: "selling pemmican to fur traders", emoji: "🍖", bin: "coop" },
    { label: "rival companies fighting over furs", emoji: "🦫", bin: "conflict" },
    { label: "settlers taking land without asking", emoji: "🏠", bin: "conflict" },
    { label: "breaking promises made in agreements", emoji: "📜", bin: "conflict" },
    { label: "arguing over who could trap where", emoji: "🗺️", bin: "conflict" },
  ],
};

const FUR_BANK: Item[] = [
  {
    prompt: "Why did Europeans want beaver fur so much?",
    right: { label: "To make felt hats that were popular in Europe", emoji: "🎩" },
    wrong: [
      { label: "To build boats", emoji: "⛵" },
      { label: "To make paper", emoji: "📄" },
      { label: "To make glue for books", emoji: "📚" },
    ],
    hint: "Beaver fur made excellent waterproof felt, and fancy felt hats were in fashion in Europe.",
  },
  {
    prompt: "What was a trading post?",
    right: "A fort where furs were traded for goods",
    wrong: ["A kind of mailbox", "A school for explorers", "A gold mine"],
    hint: "Trading posts like Fort Langley were places where First Peoples brought furs to trade for European goods.",
    emoji: "🏕️",
  },
  {
    prompt: "Who were the voyageurs?",
    right: "Canoe paddlers who carried furs and trade goods",
    wrong: ["Gold miners", "Railway builders", "Ship captains from Spain"],
    hint: "Voyageurs paddled huge canoes for long hours, often singing to keep the rhythm.",
    emoji: "🛶",
  },
  {
    prompt: "What is a portage?",
    right: "Carrying canoes and goods over land between waterways",
    wrong: ["A kind of canoe paddle", "A fur hat", "A trading fort"],
    hint: "When rapids or waterfalls blocked the way, travellers carried everything over land to the next stretch of water.",
    emoji: "🥾",
  },
  {
    prompt: "Which fur trading company was founded in 1670 and traded around Hudson Bay?",
    right: "The Hudson's Bay Company",
    wrong: ["The North West Company", "The Canadian Pacific Railway"],
    hint: "Its name gives a clue: it traded around Hudson Bay.",
    emoji: "🦫",
  },
  {
    prompt: "What did First Peoples often receive in trade for furs?",
    right: "Metal pots, axes, needles and wool blankets",
    wrong: ["Cars and bicycles", "Phones and computers", "Gold coins only"],
    hint: "Metal goods were useful and long-lasting, and wool blankets were warm.",
    emoji: "🍲",
  },
  {
    prompt: "How did First Peoples help make the fur trade possible?",
    right: "They trapped furs, guided traders and shared knowledge of the land",
    wrong: ["They built the railway", "They sailed ships from Europe", "They ran the company offices in London"],
    hint: "Fur traders depended on First Peoples' skills, routes, canoes, snowshoes and food.",
    emoji: "🧭",
  },
  {
    prompt: "Why were most trading posts built beside rivers and lakes?",
    right: "Water routes were the main highways for canoes",
    wrong: ["Traders liked to swim", "Roads were already everywhere", "Rivers were full of gold"],
    hint: "There were no roads or railways. Canoes carried people and furs along rivers and lakes.",
    emoji: "🏞️",
  },
  {
    prompt: "The Métis are a distinct Indigenous people. Their culture began…",
    right: "in fur trade families with First Nations and European roots",
    wrong: ["in the gold fields in 1858", "on sailing ships from Spain", "in Ottawa after Confederation"],
    hint: "During the fur trade, families formed with First Nations and European ancestors. The Métis Nation grew from these families and is still strong today.",
    emoji: "🍁",
    hard: true,
  },
  {
    prompt: "Why did the Hudson's Bay Company and North West Company join together in 1821?",
    right: "Competing was costly and caused conflict",
    wrong: ["All the beavers moved to Europe", "Gold was found in the Cariboo", "British Columbia joined Canada"],
    hint: "The two companies competed hard for the same furs. Joining together ended the costly rivalry.",
    emoji: "🤝",
    hard: true,
  },
  {
    prompt: "In 1778, Captain Cook's crew traded for sea otter furs in Nootka Sound, on Vancouver Island. Who did they trade with?",
    right: "Nuu-chah-nulth people",
    wrong: ["Inuit hunters", "Spanish soldiers", "Gold miners from California"],
    hint: "Nootka Sound is home to the Mowachaht/Muchalaht First Nation, one of the Nuu-chah-nulth Nations on the west coast of Vancouver Island.",
    emoji: "⛵",
    hard: true,
  },
  {
    prompt: "How did Alexander Mackenzie find his way to the Pacific Ocean in 1793?",
    right: "First Nations guides showed him the trails and rivers",
    wrong: ["He followed the railway tracks", "He used a printed road map", "He sailed around South America"],
    hint: "Mackenzie followed a First Nations trade route, a grease trail, to reach the coast.",
    emoji: "🥾",
    hard: true,
  },
  {
    prompt: "Why was pemmican such an important food for fur traders?",
    right: "It was light, lasted a long time and gave lots of energy",
    wrong: ["It was sweet like candy", "It had to be eaten fresh", "It grew on trees by the river"],
    hint: "Pemmican is dried meat mixed with fat (and sometimes berries). It was made by Plains First Nations and Métis.",
    emoji: "🍖",
    hard: true,
  },
  {
    prompt: "What happened to beaver populations in many places during the fur trade?",
    right: "They dropped because so many were trapped",
    wrong: ["They grew much larger", "They moved to Europe", "Nothing changed at all"],
    hint: "When too many animals are taken, there are fewer left to have young. Traders had to keep moving west to find more.",
    emoji: "🦫",
    hard: true,
  },
  {
    prompt: "Where was the North West Company based?",
    right: { label: "Montreal", emoji: "🏙️" },
    wrong: [
      { label: "London", emoji: "🎡" },
      { label: "Vancouver", emoji: "🏔️" },
      { label: "Barkerville", emoji: "⛏️" },
    ],
    hint: "The Hudson's Bay Company was run from London, England. Its rival, the North West Company, was run from Montreal.",
    hard: true,
  },
];

function furTrade({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return [
    contactTimeline(difficulty),
    ...shuffle([sortQuestion(COOPERATION_SORT, perBin(difficulty)), ...levelled(FUR_BANK, 6, difficulty)]),
  ];
}

// =====================================================================
// Colonization & Treaties
// =====================================================================

const COLONIZATION_READINGS: Reading[] = [
  {
    title: "Treaties",
    paragraphs: [
      "A treaty is a formal agreement between nations. Between 1850 and 1854, James Douglas made 14 agreements, called the Douglas Treaties, with First Nations on Vancouver Island.",
      "From 1871 to 1921, the government of Canada signed 11 Numbered Treaties with First Nations across the Prairies, northern Ontario, the North and northeastern BC. Many First Nations understood these treaties as promises to share the land. Many of the promises were not kept.",
      "Most of BC was never covered by a treaty. Today, some First Nations in BC are making modern treaties. The Nisga'a Treaty, which took effect in 2000, was the first modern treaty in BC.",
    ],
    questions: [
      {
        prompt: "According to the passage, what is a treaty?",
        right: "A formal agreement between nations",
        wrong: ["A kind of canoe", "A gold rush town", "A trading post"],
        hint: "The very first sentence tells you.",
      },
      {
        prompt: "How did many First Nations understand the Numbered Treaties?",
        right: "As promises to share the land",
        wrong: ["As rules for the fur trade", "As plans for a railway", "As maps of the Arctic"],
        hint: "Read the second paragraph.",
      },
      {
        prompt: "Which was the first modern treaty in BC?",
        right: "The Nisga'a Treaty",
        wrong: ["The Douglas Treaties", "Treaty 1", "Treaty 11"],
        hint: "Read the last paragraph. It took effect in 2000.",
        hard: true,
      },
      {
        prompt: "What does the passage say about most of BC?",
        right: "It was never covered by a treaty",
        wrong: ["It was all covered by the Douglas Treaties", "It was part of Treaty 1", "It has no First Nations"],
        hint: "Look at the first sentence of the last paragraph.",
        hard: true,
      },
    ],
  },
  {
    title: "New Diseases",
    paragraphs: [
      "When newcomers arrived from Europe, they carried germs for diseases like smallpox and measles. First Peoples had never been exposed to these diseases, so their bodies had no protection against them.",
      "The diseases spread quickly. Many people became very sick, and many died. Communities lost Elders, knowledge keepers and family members.",
      "These were terrible losses. Still, First Peoples' communities survived, and today they are growing and passing on their languages and cultures.",
    ],
    questions: [
      {
        prompt: "Why did diseases like smallpox affect First Peoples so badly?",
        right: "Their bodies had never met these germs, so they had no protection",
        wrong: ["The diseases came from local animals", "The winters were warmer than usual", "They ate too much salmon"],
        hint: "Read the end of the first paragraph.",
      },
      {
        prompt: "What does the passage say about First Peoples' communities today?",
        right: "They survived and are growing",
        wrong: ["They all disappeared", "They moved to Europe", "They stopped speaking their languages"],
        hint: "Read the last paragraph.",
      },
      {
        prompt: "Why was losing Elders and knowledge keepers such a big loss for communities?",
        right: "They held history, language and knowledge to pass on",
        wrong: ["They were the only people who could fish", "They ran the trading posts", "They owned all the canoes"],
        hint: "Elders and knowledge keepers teach younger people what the community knows.",
        hard: true,
      },
    ],
  },
];

const TREATY_EVENTS: TimelineEvent[] = [
  { year: 1850, label: "The first Douglas Treaties are made on Vancouver Island", emoji: "📜" },
  { year: 1871, label: "Treaty 1 is signed in Manitoba", emoji: "✍️" },
  { year: 1876, label: "The Indian Act is passed", emoji: "🏛️" },
  { year: 1899, label: "Treaty 8 is signed, including northeastern BC", emoji: "🗺️" },
  { year: 1921, label: "Treaty 11, the last Numbered Treaty, is signed", emoji: "📜" },
  { year: 2000, label: "The Nisga'a Treaty takes effect", emoji: "🤝" },
];

const COLONIZATION_BANK: Item[] = [
  {
    prompt: "What is a reserve?",
    right: "Land set aside by the government for a First Nation",
    wrong: ["A fur trading fort", "A national park", "A gold mine"],
    hint: "Reserves were usually much smaller than the traditional territories First Nations had lived on.",
    emoji: "🗺️",
  },
  {
    prompt: "As more settlers arrived, what happened to much of the land First Peoples had used?",
    right: "It was taken over for farms, towns and mines",
    wrong: ["It all stayed the same", "Settlers gave extra land to First Peoples", "It was turned into ocean"],
    hint: "Settlers often took land without agreements, and First Peoples lost access to places they had used for generations.",
    emoji: "🏘️",
  },
  {
    prompt: "The Numbered Treaties were agreements between…",
    right: "First Nations and the government of Canada",
    wrong: ["Two fur trading companies", "Gold miners and store owners", "Britain and France"],
    hint: "Treaties are agreements between nations. They set out rights and promises between First Nations and the government.",
    emoji: "📜",
  },
  {
    prompt: "When people from another country take control of land where people already live, it is called…",
    right: "colonization",
    wrong: ["Confederation", "conservation", "migration"],
    hint: "Colonization brought settlers, colonies and new laws that changed life for First Peoples.",
    emoji: "🚢",
  },
  {
    prompt: "On September 30, many Canadians wear orange. Why?",
    right: "To honour residential school survivors and remember the children",
    wrong: ["To celebrate the fur trade", "To cheer for a sports team", "To welcome Halloween"],
    hint: "September 30 is the National Day for Truth and Reconciliation, also called Orange Shirt Day. Its message is \"Every Child Matters.\"",
    emoji: "🧡",
  },
  {
    prompt: "What does reconciliation mean?",
    right: "Repairing relationships and building respect between Indigenous and non-Indigenous people",
    wrong: ["Forgetting what happened in the past", "Moving to a new province", "Signing a sports contract"],
    hint: "Reconciliation starts with learning the truth about the past and treating each other with respect.",
    emoji: "🤝",
  },
  {
    prompt: "How are many First Peoples keeping their languages strong today?",
    right: "Teaching them in schools and learning from fluent speakers",
    wrong: ["Only speaking them on holidays", "Writing them down and never speaking them", "Waiting for someone else to do it"],
    hint: "Language classes, Elders teaching young people, and language nests for little kids all help.",
    emoji: "🗣️",
  },
  {
    prompt: "Residential schools took many First Nations, Métis and Inuit children away from their families. What were children often not allowed to do there?",
    right: "Speak their own languages",
    wrong: ["Learn English", "Go to class", "Learn arithmetic"],
    hint: "Many children were stopped from speaking their languages and practising their cultures. Survivors and communities are now working to bring languages back.",
    emoji: "🧡",
    hard: true,
  },
  {
    prompt: "The Indian Act, first passed in 1876, did what?",
    right: "Gave the government of Canada a lot of control over First Nations' lives",
    wrong: ["Made First Nations the rulers of Canada", "Started the fur trade", "Ended all treaties"],
    hint: "The Indian Act made many decisions for First Nations that they should have made for themselves.",
    emoji: "🏛️",
    hard: true,
  },
  {
    prompt: "Much of BC is called unceded land. What does unceded mean?",
    right: "First Nations never gave up the land or signed it away in a treaty",
    wrong: ["The land has never had people on it", "The land is covered in seeds", "The land belongs to another country"],
    hint: "To cede means to give something up. Unceded means it was never given up.",
    emoji: "🌲",
    hard: true,
  },
  {
    prompt: "Until 1951, Canadian law banned some important First Nations gatherings, like the potlatch. How did this hurt communities?",
    right: "It made it harder to pass on laws, history and culture",
    wrong: ["It made the fur trade bigger", "It helped communities grow", "It had no effect at all"],
    hint: "These gatherings were important for sharing history, laws and culture in many coastal Nations. Today they are held again.",
    emoji: "📜",
    hard: true,
  },
  {
    prompt: "Why are modern treaties, like the Nisga'a Treaty, important?",
    right: "They help First Nations govern their own lands and futures",
    wrong: ["They start a new gold rush", "They end Canada", "They are only about fishing rods"],
    hint: "Modern treaties recognize a Nation's right to make its own decisions about land, schools, health and more.",
    emoji: "🤝",
    hard: true,
  },
];

function colonization({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return [
    timeline(
      "Put these events about treaties and laws in order, from earliest to latest.",
      "Use the years to help you. The smallest year happened first.",
      TREATY_EVENTS,
      timelineSize(difficulty),
    ),
    ...shuffle([readingQuestion(COLONIZATION_READINGS, difficulty), ...levelled(COLONIZATION_BANK, 6, difficulty)]),
  ];
}

// =====================================================================
// Gold Rushes
// =====================================================================

const GOLD_READINGS: Reading[] = [
  {
    title: "Gold on the Fraser",
    paragraphs: [
      "In 1858, news spread that gold had been found along the Fraser River. In just a few months, about 30,000 people rushed north, many of them from California. Most stopped in Victoria to buy supplies, and the small fort quickly grew into a busy town.",
      "The river ran through the homelands of First Nations such as the Stó:lō and the Nlaka'pamux. Some First Nations people were already finding gold and trading it to the Hudson's Bay Company. The sudden crowds of miners led to conflict over land and fishing places.",
      "To keep control of the area, Britain created the Colony of British Columbia in 1858, with James Douglas as its governor.",
    ],
    questions: [
      {
        prompt: "Where did many of the miners come from?",
        right: "California",
        wrong: ["England", "Montreal", "The Arctic"],
        hint: "Read the second sentence of the first paragraph.",
      },
      {
        prompt: "About how many people rushed north to the Fraser River in 1858?",
        right: "About 30,000",
        wrong: ["About 30", "About 300", "About 30 million"],
        hint: "Read the second sentence of the first paragraph.",
      },
      {
        prompt: "Why did Britain create the Colony of British Columbia in 1858?",
        right: "To keep control as thousands of miners arrived",
        wrong: ["To start the fur trade", "To build a railway to Ontario", "To join Canada"],
        hint: "Read the last paragraph.",
        hard: true,
      },
      {
        prompt: "What does the passage say about the First Nations along the Fraser River?",
        right: "Some were already finding gold and trading it",
        wrong: ["They had never seen gold", "They moved to California", "They ran the stores in Victoria"],
        hint: "Read the second paragraph.",
        hard: true,
      },
    ],
  },
  {
    title: "Barkerville",
    paragraphs: [
      "A few years after the Fraser River rush, miners pushed farther north into the Cariboo Mountains. In 1862, a miner named Billy Barker dug deep beside Williams Creek and struck gold. A town grew up there almost overnight and was named Barkerville.",
      "To bring in supplies, workers built the Cariboo Wagon Road. It was finished all the way to Barkerville in 1865. Prices were very high, because everything had to be hauled a long way by wagon, mule or on foot.",
      "When the gold ran low, many people left. Today, Barkerville is a historic town where visitors can learn what gold rush life was like.",
    ],
    questions: [
      {
        prompt: "How did Barkerville get its name?",
        right: "From Billy Barker, a miner who struck gold there",
        wrong: ["From a dog that barked at night", "From the bark of the trees", "From a ship captain"],
        hint: "Read the first paragraph.",
      },
      {
        prompt: "Why were prices so high in Barkerville?",
        right: "Supplies had to be carried a very long way",
        wrong: ["Gold was worth nothing", "There were no miners there", "Everything was made in town"],
        hint: "Read the second paragraph.",
      },
      {
        prompt: "What was the Cariboo Wagon Road built for?",
        right: "To bring supplies and people to the gold fields",
        wrong: ["To carry furs to Hudson Bay", "To connect BC to Ontario", "To race horses"],
        hint: "The second paragraph tells you why it was built.",
        hard: true,
      },
    ],
  },
];

const PANNING_ORDER: OrderQuestion = {
  kind: "order",
  prompt: "How do you pan for gold? Put the steps in order.",
  hint: "Fill the pan, swirl it, let the light sand wash away, and the heavy gold is left at the bottom.",
  items: [
    { id: "scoop", label: "Scoop gravel and water into your pan", emoji: "🥘" },
    { id: "swirl", label: "Swirl and shake the pan gently", emoji: "🔄" },
    { id: "spill", label: "Let light sand spill over the edge", emoji: "💧" },
    { id: "look", label: "Look for heavy gold flakes at the bottom", emoji: "✨" },
  ],
};

const GOLD_EVENTS: TimelineEvent[] = [
  { year: 1849, label: "The Colony of Vancouver Island is created", emoji: "🏝️" },
  { year: 1858, label: "The Fraser River Gold Rush begins", emoji: "⛏️" },
  { year: 1862, label: "Billy Barker strikes gold in the Cariboo", emoji: "✨" },
  { year: 1865, label: "The Cariboo Wagon Road reaches Barkerville", emoji: "🐎" },
  { year: 1866, label: "The two colonies unite into one", emoji: "🤝" },
  { year: 1871, label: "British Columbia joins Canada", emoji: "🍁" },
];

const GOLD_BANK: Item[] = [
  {
    prompt: "Why did thousands of people rush to the Fraser River in 1858?",
    right: "Gold had been found there",
    wrong: ["A railway had just opened", "Beavers had returned", "Free farms were being given away"],
    hint: "A gold rush is when many people hurry to a place where gold has been found.",
    emoji: "⛏️",
  },
  {
    prompt: "What simple tool did many miners use to find gold in creeks?",
    right: { label: "a gold pan", emoji: "🥘" },
    wrong: [
      { label: "a fishing net", emoji: "🎣" },
      { label: "a telescope", emoji: "🔭" },
      { label: "a canoe paddle", emoji: "🛶" },
    ],
    hint: "Miners swirled gravel and water in a pan to find flakes of gold.",
  },
  {
    prompt: "Why does gold collect at the bottom of a miner's pan?",
    right: "Gold is much heavier than sand and gravel",
    wrong: ["Gold is lighter than water", "Gold is magnetic", "Gold sticks to metal pans"],
    hint: "When you swirl the pan, light sand washes out and heavy gold sinks.",
    emoji: "✨",
  },
  {
    prompt: "A town that grows very quickly, like during a gold rush, is called a…",
    right: "boom town",
    wrong: ["ghost town", "capital city", "trading post"],
    hint: "Boom! Suddenly there are stores, hotels and crowds where there were few before.",
    emoji: "🏘️",
  },
  {
    prompt: "What often happened to gold rush towns when the gold ran out?",
    right: "Many people left, and some became ghost towns",
    wrong: ["They became the capital of Canada", "Everyone moved in", "Gold grew back"],
    hint: "Without gold, there was no reason for many miners to stay.",
    emoji: "🏚️",
  },
  {
    prompt: "In 1862, Billy Barker struck gold in which gold rush area of BC?",
    right: { label: "the Cariboo", emoji: "⛰️" },
    wrong: [
      { label: "the Klondike", emoji: "❄️" },
      { label: "the Prairies", emoji: "🌾" },
      { label: "Haida Gwaii", emoji: "🏝️" },
    ],
    hint: "The Cariboo Gold Rush came a few years after the Fraser River rush. (The Klondike rush was in Yukon, much later, in 1896.)",
  },
  {
    prompt: "In 1858, miners arriving for the Fraser River Gold Rush stopped in which town for supplies?",
    right: { label: "Victoria", emoji: "⚓" },
    wrong: [
      { label: "Vancouver", emoji: "🏙️" },
      { label: "Calgary", emoji: "🐎" },
      { label: "Toronto", emoji: "🏢" },
    ],
    hint: "Vancouver didn't exist yet! Victoria, on Vancouver Island, grew quickly as miners passed through.",
  },
  {
    prompt: "Who was the first governor of the Colony of British Columbia?",
    right: "James Douglas",
    wrong: ["John A. Macdonald", "Simon Fraser", "Billy Barker"],
    hint: "He had been a Hudson's Bay Company leader and was already governor of Vancouver Island.",
    emoji: "🏛️",
  },
  {
    prompt: "How did the gold rush affect First Nations along the Fraser River?",
    right: "Miners crowded onto their lands, leading to conflict and loss of land",
    wrong: ["Nothing changed for them", "They were given all the gold", "They all moved to California"],
    hint: "Thousands of miners arrived on First Nations land without agreements, disturbing villages and fishing places.",
    emoji: "🏞️",
    hard: true,
  },
  {
    prompt: "Many Chinese miners came to the gold rushes. What did many of them do?",
    right: "Mined for gold and ran stores and other businesses",
    wrong: ["Ran the Hudson's Bay Company", "Became colony governors", "Built the first trading posts"],
    hint: "Chinese miners and business owners were an important part of gold rush towns like Barkerville.",
    emoji: "⛏️",
    hard: true,
  },
  {
    prompt: "In 1866, the Colony of Vancouver Island and the Colony of British Columbia…",
    right: "joined into one colony",
    wrong: ["joined the United States", "became two separate countries", "joined Canada"],
    hint: "After the gold rush, the colonies had big debts. Joining together saved money. (Joining Canada came later, in 1871.)",
    emoji: "🤝",
    hard: true,
  },
  {
    prompt: "How did the gold rushes change the land and people of BC?",
    right: "Roads and towns were built, and many newcomers arrived",
    wrong: ["Nothing changed at all", "Everyone left BC", "Forests grew over all the towns"],
    hint: "The search for gold brought thousands of people, new roads like the Cariboo Wagon Road, and new towns.",
    emoji: "🛤️",
    hard: true,
  },
  {
    prompt: "Why did gold mining harm salmon in some rivers?",
    right: "Mud and gravel washed into the water",
    wrong: ["Miners fed the salmon gold", "Salmon don't like noise", "The rivers got too cold"],
    hint: "Digging and washing gravel made rivers muddy, which can hurt salmon eggs. Salmon were an important food for many First Nations.",
    emoji: "🐟",
    hard: true,
  },
];

function goldRush({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const order =
    difficulty === 1
      ? PANNING_ORDER
      : chance(0.5)
        ? PANNING_ORDER
        : timeline(
            "Put these gold rush events in order, from earliest to latest.",
            "Use the years to help you. The smallest year happened first.",
            GOLD_EVENTS,
            timelineSize(difficulty),
          );
  return [order, ...shuffle([readingQuestion(GOLD_READINGS, difficulty), ...levelled(GOLD_BANK, 6, difficulty)])];
}

// =====================================================================
// Confederation & BC
// =====================================================================

const JOIN_EVENTS: TimelineEvent[] = [
  { year: 1867, label: "Ontario, Quebec, Nova Scotia and New Brunswick", emoji: "🍁" },
  { year: 1870, label: "Manitoba", emoji: "🌾" },
  { year: 1871, label: "British Columbia", emoji: "🏔️" },
  { year: 1873, label: "Prince Edward Island", emoji: "🏝️" },
  { year: 1905, label: "Alberta and Saskatchewan", emoji: "🌄" },
  { year: 1949, label: "Newfoundland", emoji: "🐋" },
];

const RAILWAY_ORDER: OrderQuestion = {
  kind: "order",
  prompt: "Put the story of the railway in order.",
  hint: "First came the promise, then the railway company, then the last spike, and then the first passenger train.",
  items: [
    { id: "promise", label: "BC joins Canada with the promise of a railway (1871)", emoji: "🤝" },
    { id: "company", label: "The Canadian Pacific Railway company is formed (1881)", emoji: "🔨" },
    { id: "spike", label: "The last spike is hammered at Craigellachie (1885)", emoji: "🛤️" },
    { id: "train", label: "The first passenger train reaches the Pacific coast (1886)", emoji: "🚂" },
  ],
};

interface YearPair {
  a: string;
  ya: number;
  b: string;
  yb: number;
  level: Level;
}

const YEAR_PAIRS: YearPair[] = [
  { a: "Canada was formed at Confederation", ya: 1867, b: "British Columbia joined Canada", yb: 1871, level: 1 },
  { a: "Manitoba joined Canada", ya: 1870, b: "Prince Edward Island joined", yb: 1873, level: 1 },
  { a: "British Columbia joined Canada", ya: 1871, b: "Prince Edward Island joined", yb: 1873, level: 1 },
  { a: "The Fraser River Gold Rush began", ya: 1858, b: "British Columbia joined Canada", yb: 1871, level: 1 },
  { a: "British Columbia joined Canada", ya: 1871, b: "the last spike of the railway was hammered", yb: 1885, level: 1 },
  { a: "The Fraser River Gold Rush began", ya: 1858, b: "the last spike of the railway was hammered", yb: 1885, level: 2 },
  { a: "Fort Victoria was built", ya: 1843, b: "British Columbia joined Canada", yb: 1871, level: 2 },
  { a: "Canada was formed at Confederation", ya: 1867, b: "Alberta and Saskatchewan joined", yb: 1905, level: 2 },
  { a: "The HBC and North West Company joined together", ya: 1821, b: "the Fraser River Gold Rush began", yb: 1858, level: 2 },
  { a: "The Hudson's Bay Company was founded", ya: 1670, b: "it joined with the North West Company", yb: 1821, level: 3 },
  { a: "Canada was formed at Confederation", ya: 1867, b: "Newfoundland joined Canada", yb: 1949, level: 3 },
  { a: "Captain Cook arrived at Nootka Sound", ya: 1778, b: "British Columbia joined Canada", yb: 1871, level: 3 },
  { a: "British Columbia joined Canada", ya: 1871, b: "Newfoundland joined", yb: 1949, level: 3 },
];

function yearsBetween(d: Level): InputQuestion {
  const p = pick(YEAR_PAIRS.filter((x) => x.level === d));
  return {
    kind: "input",
    prompt: `${p.a} in ${p.ya}. ${p.b[0].toUpperCase()}${p.b.slice(1)} in ${p.yb}. How many years later was that?`,
    hint: `Subtract the earlier year from the later one: ${p.yb} − ${p.ya}. You can also count up from ${p.ya}.`,
    answer: String(p.yb - p.ya),
    keypad: "number",
    suffix: "years",
    visual: {
      type: "table",
      title: "Timeline",
      headers: ["Year", "Event"],
      rows: [
        [p.ya, p.a],
        [p.yb, `${p.b[0].toUpperCase()}${p.b.slice(1)}`],
      ],
    },
  };
}

const CONFEDERATION_BANK: Item[] = [
  {
    prompt: "On July 1, 1867, four colonies joined to form the country of Canada. This is called…",
    right: "Confederation",
    wrong: ["the gold rush", "the fur trade", "a treaty"],
    hint: "Confederation means joining together. We celebrate it every year on Canada Day.",
    emoji: "🍁",
  },
  {
    prompt: "Which four provinces formed Canada in 1867?",
    right: "Ontario, Quebec, Nova Scotia and New Brunswick",
    wrong: [
      "British Columbia, Alberta, Saskatchewan and Manitoba",
      "Ontario, Quebec, British Columbia and Prince Edward Island",
      "Yukon, Nunavut, Ontario and Quebec",
    ],
    hint: "Canada started in the east. The western provinces joined later.",
    emoji: "🍁",
  },
  {
    prompt: "Who was Canada's first prime minister?",
    right: "Sir John A. Macdonald",
    wrong: ["James Douglas", "Simon Fraser", "Billy Barker"],
    hint: "He was a leader of Confederation and promised BC a railway.",
    emoji: "🏛️",
  },
  {
    prompt: "In what year did British Columbia join Canada?",
    right: "1871",
    wrong: ["1858", "1867", "1905"],
    hint: "BC joined four years after Confederation, on July 20, 1871.",
    emoji: "🏔️",
  },
  {
    prompt: "What did Canada promise British Columbia for joining?",
    right: { label: "A railway to connect BC to the rest of Canada", emoji: "🚂" },
    wrong: [
      { label: "A new gold mine", emoji: "⛏️" },
      { label: "Its own army", emoji: "🛡️" },
      { label: "A fur trading company", emoji: "🦫" },
    ],
    hint: "Canada promised to start a railway within 2 years and finish it within 10.",
  },
  {
    prompt: "Why did many people in BC want to join Canada?",
    right: "The colony had big debts and wanted a railway link",
    wrong: ["Canada promised free gold", "To start the fur trade", "To move BC's capital to Toronto"],
    hint: "Canada agreed to take over BC's debts and build a railway across the mountains.",
    emoji: "💰",
  },
  {
    prompt: "Why was a railway so important for connecting BC to the rest of Canada?",
    right: "Mountains made travel very slow and difficult",
    wrong: ["Planes were too expensive", "BC had no rivers", "Horses weren't allowed in BC"],
    hint: "Before the railway, getting from BC to eastern Canada could take weeks or months.",
    emoji: "🏔️",
  },
  {
    prompt: "Canada Day, the day we celebrate Confederation, is on…",
    right: "July 1",
    wrong: ["July 20", "September 30", "November 11"],
    hint: "Canada was formed on July 1, 1867.",
    emoji: "🎉",
  },
  {
    prompt: "Before 1871, what other choice did some people in BC think about?",
    right: "Joining the United States",
    wrong: ["Joining Mexico", "Becoming part of France", "Joining Australia"],
    hint: "BC was next to the United States, which had just bought Alaska in 1867. Some people thought BC should join the U.S.",
    emoji: "🧭",
    hard: true,
  },
  {
    prompt: "Where was the last spike of the Canadian Pacific Railway hammered in 1885?",
    right: { label: "Craigellachie, BC", emoji: "🛤️" },
    wrong: [
      { label: "Halifax, Nova Scotia", emoji: "⚓" },
      { label: "Barkerville, BC", emoji: "⛏️" },
      { label: "Ottawa, Ontario", emoji: "🏛️" },
    ],
    hint: "The railway was finished in the mountains of BC, at a place called Craigellachie.",
    hard: true,
  },
  {
    prompt: "Thousands of Chinese workers built some of the hardest parts of the railway in BC. How were they treated?",
    right: "They were paid less and given the most dangerous jobs",
    wrong: ["They were paid the most", "They were given free land", "They became the railway's owners"],
    hint: "Their work was dangerous and unfair. In 2006, the government of Canada apologized for the unfair head tax later charged to Chinese newcomers.",
    emoji: "🛤️",
    hard: true,
  },
  {
    prompt: "Manitoba joined Canada in 1870 after the Métis, led by Louis Riel, …",
    right: "stood up for their land and rights at Red River",
    wrong: ["found gold in the Cariboo", "built the railway", "founded the Hudson's Bay Company"],
    hint: "The Métis at Red River wanted their land, language and rights protected when Canada took over the region.",
    emoji: "🌾",
    hard: true,
  },
  {
    prompt: "Were First Nations invited to take part when leaders planned Confederation?",
    right: "No, they were left out of the talks",
    wrong: ["Yes, they led all the meetings", "Yes, every Nation voted on it", "Yes, they wrote the plan"],
    hint: "Confederation was planned by colonial leaders. First Nations, whose lands were affected, were not included.",
    emoji: "📜",
    hard: true,
  },
  {
    prompt: "Which was the last province to join Canada, in 1949?",
    right: { label: "Newfoundland", emoji: "🐋" },
    wrong: [
      { label: "Prince Edward Island", emoji: "🏝️" },
      { label: "Alberta", emoji: "🌄" },
      { label: "British Columbia", emoji: "🏔️" },
    ],
    hint: "Newfoundland (now Newfoundland and Labrador) joined Canada in 1949.",
    hard: true,
  },
];

function confederation({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const order =
    difficulty === 1 || chance(0.5)
      ? timeline(
          "Put these in the order they joined Canada, from first to last.",
          "Use the years to help you. The smallest year joined first.",
          JOIN_EVENTS,
          timelineSize(difficulty),
        )
      : RAILWAY_ORDER;
  return [order, ...shuffle([yearsBetween(difficulty), ...levelled(CONFEDERATION_BANK, 6, difficulty)])];
}

// =====================================================================
// Provinces, Territories & Regions
// =====================================================================

interface Place {
  name: string;
  capital: string;
  /** A big city that people often mix up with the capital. */
  trap?: string;
  /** Explains the trap city, if the usual note doesn't fit. */
  trapNote?: string;
  territory?: true;
  emoji: string;
}

const PLACES: Place[] = [
  { name: "British Columbia", capital: "Victoria", trap: "Vancouver", emoji: "🏔️" },
  { name: "Alberta", capital: "Edmonton", trap: "Calgary", emoji: "🌄" },
  { name: "Saskatchewan", capital: "Regina", trap: "Saskatoon", emoji: "🌾" },
  { name: "Manitoba", capital: "Winnipeg", trap: "Brandon", emoji: "🐻" },
  { name: "Ontario", capital: "Toronto", trap: "Ottawa", trapNote: "Ottawa is in Ontario too, but it is the capital of all of Canada, not of the province.", emoji: "🏙️" },
  { name: "Quebec", capital: "Quebec City", trap: "Montreal", emoji: "⚜️" },
  { name: "New Brunswick", capital: "Fredericton", trap: "Moncton", emoji: "🦞" },
  { name: "Nova Scotia", capital: "Halifax", trap: "Sydney", emoji: "⛵" },
  { name: "Prince Edward Island", capital: "Charlottetown", trap: "Summerside", emoji: "🥔" },
  { name: "Newfoundland and Labrador", capital: "St. John's", trap: "Corner Brook", emoji: "🐋" },
  { name: "Yukon", capital: "Whitehorse", trap: "Dawson City", trapNote: "Dawson City was the capital long ago, during the Klondike Gold Rush, but today it's Whitehorse.", territory: true, emoji: "⛰️" },
  { name: "Northwest Territories", capital: "Yellowknife", trap: "Inuvik", territory: true, emoji: "💎" },
  { name: "Nunavut", capital: "Iqaluit", trap: "Rankin Inlet", territory: true, emoji: "🌌" },
];

function capitalQuestion(place: Place, d: Level): Question {
  const others = PLACES.filter((p) => p !== place);
  if (d === 3 && chance(0.5)) {
    return textChoice(
      `${place.capital} is the capital of which province or territory?`,
      { label: place.name, emoji: place.emoji },
      sample(others, 3).map((p) => ({ label: p.name, emoji: p.emoji })),
      `${place.capital} is the capital city of ${place.name}.`,
    );
  }
  const count = d === 1 ? 2 : 3;
  const wrong =
    d === 1 || !place.trap
      ? sample(others, count).map((p) => p.capital)
      : [place.trap, ...sample(others, count - 1).map((p) => p.capital)];
  return textChoice(
    `What is the capital city of ${place.name}?`,
    place.capital,
    wrong,
    place.trap
      ? `The capital is ${place.capital}. ${place.trapNote ?? `${place.trap} is a city there too, but it isn't the capital.`}`
      : `The capital of ${place.name} is ${place.capital}.`,
    { type: "emoji", emoji: place.emoji, caption: place.name },
  );
}

const PROVINCE_SORT: SortSet = {
  prompt: "Province or territory? Tap an item, then tap its basket.",
  hint: "Canada has 10 provinces and 3 territories. The 3 territories are in the north: Yukon, Northwest Territories and Nunavut.",
  bins: [
    { id: "province", label: "province", emoji: "🍁" },
    { id: "territory", label: "territory", emoji: "❄️" },
  ],
  items: PLACES.map((p) => ({ label: p.name, emoji: p.emoji, bin: p.territory ? "territory" : "province" })),
};

interface Region {
  name: string;
  emoji: string;
  land: string;
  resources: string;
  where: string;
}

const REGIONS: Region[] = [
  {
    name: "Cordillera",
    emoji: "🏔️",
    land: "High mountains, deep valleys and plateaus",
    resources: "Forests, minerals and rivers for hydroelectricity",
    where: "Western Canada, including most of BC and Yukon",
  },
  {
    name: "Interior Plains",
    emoji: "🌾",
    land: "Flat or gently rolling land",
    resources: "Rich farmland, oil and natural gas",
    where: "Between the Rocky Mountains and the Canadian Shield",
  },
  {
    name: "Canadian Shield",
    emoji: "🪨",
    land: "Ancient rock, thousands of lakes and forests",
    resources: "Minerals like nickel, gold and copper",
    where: "A giant horseshoe shape around Hudson Bay",
  },
  {
    name: "Great Lakes–St. Lawrence Lowlands",
    emoji: "🏙️",
    land: "Low, gentle land beside big lakes and a river",
    resources: "Good farmland and many factories",
    where: "Southern Ontario and southern Quebec",
  },
  {
    name: "Appalachian region",
    emoji: "🌊",
    land: "Old, worn-down mountains and rocky coasts",
    resources: "Fishing, forests and farming",
    where: "Eastern Quebec and the Atlantic provinces",
  },
  {
    name: "Hudson Bay Lowlands",
    emoji: "🦆",
    land: "Flat, wet, swampy land",
    resources: "Huge wetlands that are home to many birds",
    where: "Along the southern shore of Hudson Bay",
  },
];

function regionDetective(d: Level): Question {
  const region = pick(REGIONS);
  const rows: string[][] = [
    ["Land", region.land],
    ["Resources", region.resources],
  ];
  if (d < 3) rows.push(["Where", region.where]);
  return textChoice(
    "Which physical region of Canada matches these clues?",
    { label: region.name, emoji: region.emoji },
    sample(
      REGIONS.filter((r) => r !== region),
      d === 1 ? 2 : 3,
    ).map((r) => ({ label: r.name, emoji: r.emoji })),
    `Start with the land clue. These clues describe the ${region.name}.`,
    { type: "table", title: "Region clues", headers: ["Clue", "Notes"], rows },
  );
}

const REGION_BANK: Item[] = [
  {
    prompt: "How many provinces and territories does Canada have?",
    right: "10 provinces and 3 territories",
    wrong: ["3 provinces and 10 territories", "13 provinces and no territories", "50 states"],
    hint: "There are 10 provinces and 3 northern territories: 13 in all.",
    emoji: "🍁",
  },
  {
    prompt: "What is the capital city of Canada?",
    right: { label: "Ottawa", emoji: "🏛️" },
    wrong: [
      { label: "Toronto", emoji: "🏙️" },
      { label: "Montreal", emoji: "⛪" },
      { label: "Vancouver", emoji: "🏔️" },
    ],
    hint: "Canada's Parliament meets in Ottawa, Ontario.",
  },
  {
    prompt: "Which ocean is on Canada's west coast?",
    right: { label: "Pacific Ocean", emoji: "🌊" },
    wrong: [
      { label: "Atlantic Ocean", emoji: "⚓" },
      { label: "Arctic Ocean", emoji: "🧊" },
      { label: "Indian Ocean", emoji: "🐠" },
    ],
    hint: "Canada touches three oceans: the Pacific in the west, the Atlantic in the east and the Arctic in the north.",
  },
  {
    prompt: "Which physical region has the Rocky Mountains and covers most of BC?",
    right: { label: "the Cordillera", emoji: "🏔️" },
    wrong: [
      { label: "the Canadian Shield", emoji: "🪨" },
      { label: "the Interior Plains", emoji: "🌾" },
      { label: "the Appalachian region", emoji: "🌊" },
    ],
    hint: "Cordillera means a long chain of mountains. It covers western Canada.",
  },
  {
    prompt: "Which region has flat land with many wheat and canola farms?",
    right: { label: "the Interior Plains", emoji: "🌾" },
    wrong: [
      { label: "the Cordillera", emoji: "🏔️" },
      { label: "the Canadian Shield", emoji: "🪨" },
      { label: "the Hudson Bay Lowlands", emoji: "🦆" },
    ],
    hint: "The Prairies are part of the Interior Plains, with flat land and rich soil.",
  },
  {
    prompt: "Which huge region of ancient rock, lakes and forests covers almost half of Canada?",
    right: { label: "the Canadian Shield", emoji: "🪨" },
    wrong: [
      { label: "the Interior Plains", emoji: "🌾" },
      { label: "the Appalachian region", emoji: "🌊" },
      { label: "the Great Lakes–St. Lawrence Lowlands", emoji: "🏙️" },
    ],
    hint: "The Canadian Shield wraps around Hudson Bay like a giant horseshoe.",
  },
  {
    prompt: "In which region do about half of all Canadians live?",
    right: { label: "the Great Lakes–St. Lawrence Lowlands", emoji: "🏙️" },
    wrong: [
      { label: "the Canadian Shield", emoji: "🪨" },
      { label: "the Cordillera", emoji: "🏔️" },
      { label: "the Hudson Bay Lowlands", emoji: "🦆" },
    ],
    hint: "Big cities like Toronto, Ottawa, Montreal and Quebec City are in this low, gentle region.",
  },
  {
    prompt: "Which territory was created in 1999, with Iqaluit as its capital?",
    right: { label: "Nunavut", emoji: "🌌" },
    wrong: [
      { label: "Yukon", emoji: "⛰️" },
      { label: "Northwest Territories", emoji: "💎" },
    ],
    hint: "Nunavut means \"our land\" in Inuktitut. It was created in 1999, and most people who live there are Inuit.",
    hard: true,
  },
  {
    prompt: "Which region has old, worn-down mountains and rocky Atlantic coasts?",
    right: { label: "the Appalachian region", emoji: "🌊" },
    wrong: [
      { label: "the Cordillera", emoji: "🏔️" },
      { label: "the Interior Plains", emoji: "🌾" },
      { label: "the Hudson Bay Lowlands", emoji: "🦆" },
    ],
    hint: "The Appalachian mountains are very old, so wind, rain and ice have worn them down.",
    hard: true,
  },
  {
    prompt: "Which natural resource is the Canadian Shield famous for?",
    right: "Minerals like nickel, gold and copper",
    wrong: ["Wheat and canola", "Oranges and bananas", "Coral reefs"],
    hint: "The Shield's ancient rock holds many valuable minerals, so mining is important there.",
    emoji: "🪨",
    hard: true,
  },
  {
    prompt: "Which is the only officially bilingual (English and French) province?",
    right: { label: "New Brunswick", emoji: "🦞" },
    wrong: [
      { label: "Quebec", emoji: "⚜️" },
      { label: "Ontario", emoji: "🏙️" },
      { label: "Nova Scotia", emoji: "⛵" },
    ],
    hint: "New Brunswick's laws say English and French are equal there. (Quebec's official language is French.)",
    hard: true,
  },
  {
    prompt: "Which is the largest province by area?",
    right: { label: "Quebec", emoji: "⚜️" },
    wrong: [
      { label: "Ontario", emoji: "🏙️" },
      { label: "British Columbia", emoji: "🏔️" },
      { label: "Prince Edward Island", emoji: "🥔" },
    ],
    hint: "Quebec is the biggest province. (Nunavut is a territory, and it's even bigger!)",
    hard: true,
  },
  {
    prompt: "Why do so many people in the Interior Plains work in farming?",
    right: "The land is flat and the soil is rich",
    wrong: ["It rains every single day", "It has the tallest mountains", "It is covered in ice all year"],
    hint: "Flat land with rich soil is perfect for big fields of wheat, canola and other crops.",
    emoji: "🚜",
    hard: true,
  },
];

function canadaRegions({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const pool = difficulty === 1 ? PLACES.filter((p) => !p.territory) : PLACES;
  return shuffle([
    ...sample(pool, 2).map((p) => capitalQuestion(p, difficulty)),
    regionDetective(difficulty),
    sortQuestion(PROVINCE_SORT, difficulty === 1 ? 2 : 3),
    ...levelled(REGION_BANK, 4, difficulty),
  ]);
}

export const course: Course = {
  grade: "4",
  subject: "social",
  bigIdeas: {
    "ca-bc": [
      "The pursuit of valuable natural resources has played a key role in changing the land, people, and communities of Canada.",
      "Interactions between First Peoples and Europeans lead to conflict and cooperation, which continues to shape Canada's identity.",
      "Demographic changes in North America created shifts in economic and political power.",
      "British Columbia followed a unique path in becoming a part of Canada.",
    ],
  },
  units: [
    {
      id: "first-peoples",
      title: "First Peoples & the Land",
      emoji: "🌲",
      blurb: "Land, trade and leadership",
      standards: { "ca-bc": "First Peoples land ownership and use; First Peoples governance and trade before contact" },
      parentNote: "How First Peoples used and cared for the land and its resources, traded and governed themselves before Europeans arrived, and are living communities today. Includes short readings.",
      generate: firstPeoples,
    },
    {
      id: "fur-trade",
      title: "Contact & the Fur Trade",
      emoji: "🦫",
      blurb: "Beavers, canoes and trading posts",
      standards: { "ca-bc": "Early contact, trade, cooperation and conflict between First Peoples and Europeans; the fur trade in pre-Confederation Canada and BC" },
      parentNote: "Early European contact, the Hudson's Bay and North West Companies, voyageurs and trading posts, the Métis, and examples of cooperation and conflict. Includes timelines.",
      generate: furTrade,
    },
    {
      id: "colonization-and-treaties",
      title: "Colonization & Treaties",
      emoji: "📜",
      blurb: "Changes for First Peoples",
      standards: { "ca-bc": "The impact of colonization on First Peoples societies in BC and Canada; treaties" },
      parentNote: "Age-appropriate, factual coverage of how colonization affected First Peoples (disease, loss of land, the Indian Act, residential schools), historic and modern treaties, and reconciliation today.",
      generate: colonization,
    },
    {
      id: "gold-rush",
      title: "Gold Rushes",
      emoji: "⛏️",
      blurb: "Fraser River and Cariboo gold",
      standards: { "ca-bc": "The Fraser River and Cariboo gold rushes; demographic changes in pre-Confederation BC" },
      parentNote: "The 1858 Fraser River and Cariboo gold rushes, how they brought newcomers and created the Colony of British Columbia, and their effects on First Nations and the land.",
      generate: goldRush,
    },
    {
      id: "confederation",
      title: "Confederation & BC",
      emoji: "🚂",
      blurb: "Canada forms, BC joins",
      standards: { "ca-bc": "Confederation (1867); BC's path to joining Canada (1871) and the promise of a railway" },
      parentNote: "Confederation in 1867, why BC joined Canada in 1871 and the railway promise, the Canadian Pacific Railway, and how the provinces joined over time, with some years-between subtraction.",
      generate: confederation,
    },
    {
      id: "provinces-and-regions",
      title: "Provinces & Regions",
      emoji: "🗺️",
      blurb: "Capitals and landforms of Canada",
      standards: { "ca-bc": "Canada's provinces, territories and capitals; physiographic regions of Canada and their resources" },
      parentNote: "Canada's 10 provinces and 3 territories and their capitals, and its physical regions (like the Cordillera, Interior Plains and Canadian Shield) and their natural resources.",
      generate: canadaRegions,
    },
  ],
};
