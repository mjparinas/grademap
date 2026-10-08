import { chance, pick, randInt, sample, shuffle, textChoice } from "../../random";
import type { Course, GenerateOptions, InputQuestion, OrderQuestion, Question, Visual } from "../../types";
import { sortQuestion, type BankItem, type SortSet } from "../../bank";

type Level = 1 | 2 | 3;
/** A bank question. `hard` marks a stretch item; `visual` replaces the emoji picture. */
type Item = BankItem & { hard?: true; visual?: Visual };

function ask(b: Item): Question {
  const visual: Visual | undefined =
    b.visual ?? (b.emoji ? { type: "emoji", emoji: b.emoji, caption: b.caption } : undefined);
  return textChoice(b.prompt, b.right, b.wrong, b.hint, visual);
}

/** Difficulty 1 uses only core items, 2 mixes in about a third stretch items, 3 is mostly stretch. */
function levelled(bank: Item[], count: number, difficulty: Level): Question[] {
  const easy = bank.filter((b) => !b.hard);
  const hard = bank.filter((b) => b.hard);
  const want = difficulty === 1 ? 0 : difficulty === 2 ? Math.ceil(count / 3) : Math.ceil((count * 2) / 3);
  const nHard = Math.min(want, hard.length);
  return [...sample(easy, count - nHard), ...sample(hard, nHard)].map(ask);
}

/** One question from a small set, matched to the difficulty where possible. */
function oneOf(items: Item[], difficulty: Level): Question {
  const pool = items.filter((i) => (difficulty === 1 ? !i.hard : difficulty === 3 ? i.hard : true));
  return ask(pick(pool.length ? pool : items));
}

/** Two-basket sorts: 6 items, or 8 at stretch level. */
const perBin = (d: Level) => (d === 3 ? 4 : 3);

/** A random subset of an ordered list, kept in order. */
function inOrder<T>(items: readonly T[], count: number): T[] {
  const keep = new Set(sample(items.map((_, i) => i), count));
  return items.filter((_, i) => keep.has(i));
}

const withCommas = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/** "A" or "An" before a number word, e.g. "An 85 kg wagon". */
const aOrAn = (n: number) => (String(n).startsWith("8") || n === 11 || n === 18 ? "An" : "A");

// ---------- Body Systems ----------

const SYSTEM_SORT: SortSet = {
  prompt: "Which body system does each part belong to? Tap an item, then tap its basket.",
  hint: "The nervous system carries fast electrical messages. The excretory system removes wastes. Endocrine glands release hormones into the blood.",
  bins: [
    { id: "nervous", label: "nervous system", emoji: "⚡" },
    { id: "excretory", label: "excretory system", emoji: "🚰" },
    { id: "endocrine", label: "endocrine (hormone) system", emoji: "🧪" },
  ],
  items: [
    { label: "brain", emoji: "🧠", bin: "nervous" },
    { label: "spinal cord", emoji: "🔗", bin: "nervous" },
    { label: "nerves", emoji: "〰️", bin: "nervous" },
    { label: "kidneys", emoji: "💧", bin: "excretory" },
    { label: "bladder", emoji: "🎈", bin: "excretory" },
    { label: "ureters", emoji: "🧵", bin: "excretory" },
    { label: "pituitary gland", emoji: "🎛️", bin: "endocrine" },
    { label: "thyroid gland", emoji: "🦋", bin: "endocrine" },
    { label: "adrenal glands", emoji: "🏃", bin: "endocrine" },
  ],
};

const REFLEX_ORDER: OrderQuestion = {
  kind: "order",
  prompt: "You touch a hot pan. Put the steps of this reflex in order.",
  hint: "A reflex is a shortcut: the message goes from your skin to your spinal cord and straight back out to your muscles, before your brain even notices.",
  items: [
    { id: "detect", label: "Sensors in your skin detect the heat", emoji: "🔥" },
    { id: "sensory", label: "Sensory nerves carry the message to the spinal cord" },
    { id: "spine", label: "The spinal cord sends a message straight back" },
    { id: "motor", label: "Motor nerves carry the message to your arm muscles" },
    { id: "move", label: "Your muscles pull your hand away", emoji: "✋" },
  ],
};

const CATCH_ORDER: OrderQuestion = {
  kind: "order",
  prompt: "A ball is thrown to you. Put the steps in order as your nervous system helps you catch it.",
  hint: "Messages travel from your senses to your brain, the brain decides, and then messages travel out to your muscles.",
  items: [
    { id: "see", label: "Your eyes see the ball coming", emoji: "👀" },
    { id: "sensory", label: "Sensory nerves send the message to your brain" },
    { id: "brain", label: "Your brain decides to catch it", emoji: "🧠" },
    { id: "motor", label: "Motor nerves carry signals to your arm muscles" },
    { id: "catch", label: "Your hands close around the ball", emoji: "🙌" },
  ],
};

const WASTE_ORDER: OrderQuestion = {
  kind: "order",
  prompt: "Put the path of liquid waste (urine) through the excretory system in order.",
  hint: "The kidneys clean the blood first. Tubes called ureters lead to the bladder, which stores urine until it leaves through the urethra.",
  items: [
    { id: "kidney", label: "Kidneys filter wastes out of the blood" },
    { id: "ureter", label: "Ureters carry urine down from the kidneys" },
    { id: "bladder", label: "The bladder stores urine" },
    { id: "urethra", label: "Urine leaves the body through the urethra" },
  ],
};

const SIGNAL_TABLE: Visual = {
  type: "table",
  title: "Two ways the body sends messages",
  headers: ["Feature", "Nerve signals", "Hormones"],
  rows: [
    ["Travel through", "nerves", "the blood"],
    ["Speed", "a fraction of a second", "seconds to hours"],
    ["Effect lasts", "a short time", "minutes to years"],
  ],
};

const BODY_BANK: Item[] = [
  {
    prompt: "What are the main parts of the nervous system?",
    right: "brain, spinal cord and nerves",
    wrong: ["heart, blood and blood vessels", "kidneys, bladder and ureters", "lungs, windpipe and diaphragm"],
    hint: "The nervous system is your body's message network. The brain and spinal cord are the control centre, and nerves reach every part of you.",
    emoji: "🧠",
  },
  {
    prompt: "What is the main job of the excretory system?",
    right: "removing wastes from the body",
    wrong: ["pumping blood around the body", "breaking down food", "sending messages to muscles"],
    hint: "To excrete means to get rid of waste. Your kidneys, bladder, skin and lungs all help.",
    emoji: "🚰",
  },
  {
    prompt: "Which organs filter wastes out of your blood to make urine?",
    right: "kidneys",
    wrong: ["bladder", "stomach", "heart"],
    hint: "You have two bean-shaped kidneys near your lower back. They clean your blood all day long.",
  },
  {
    prompt: "What are hormones?",
    right: "chemical messengers carried in the blood",
    wrong: ["electrical signals that travel along nerves", "tiny bones inside the ear", "cells that fight germs"],
    hint: "Glands in the endocrine system release hormones into the blood, which carries them all over the body.",
    emoji: "🧪",
  },
  {
    prompt: "Which part of the body controls thinking, memory and decisions?",
    right: "the brain",
    wrong: ["the spinal cord", "the heart", "the kidneys"],
    hint: "Your brain is the body's control centre. It thinks, remembers and decides.",
  },
  {
    prompt: "Which bones protect your brain?",
    right: "the skull",
    wrong: ["the ribs", "the pelvis", "the kneecaps"],
    hint: "The brain sits inside a hard case of bone in your head.",
    emoji: "⛑️",
  },
  {
    prompt: "Which organ stores urine until you go to the washroom?",
    right: "the bladder",
    wrong: ["the kidney", "the ureter", "the stomach"],
    hint: "This stretchy organ fills up like a balloon and then empties.",
  },
  {
    prompt: "What does the reproductive system make possible?",
    right: "producing offspring (babies)",
    wrong: ["removing waste from the blood", "keeping your balance", "digesting food"],
    hint: "To reproduce means to make new living things of the same kind.",
  },
  {
    prompt: "Where does a baby develop before it is born?",
    right: "the uterus",
    wrong: ["the stomach", "the bladder", "the kidneys"],
    hint: "The uterus is part of the female reproductive system. A baby grows there for about nine months.",
  },
  {
    prompt: "What is a reflex?",
    right: "a fast, automatic response you don't have to think about",
    wrong: ["a slow decision you plan carefully", "a hormone made by the kidneys", "a type of bone in the arm"],
    hint: "Blinking when something flies at your eye is a reflex. It happens before you can think about it.",
  },
  {
    prompt: "Which body system lets you feel a cold breeze on your skin?",
    right: "the nervous system",
    wrong: ["the excretory system", "the reproductive system", "the endocrine system"],
    hint: "Sensors in your skin send messages along nerves to your brain.",
    emoji: "🌬️",
  },
  {
    prompt: "How do your lungs help remove waste?",
    right: "They breathe out carbon dioxide",
    wrong: ["They make urine", "They store food", "They release hormones"],
    hint: "Your cells make carbon dioxide as waste. Your blood carries it to your lungs, and you breathe it out.",
    emoji: "🫁",
  },
  {
    prompt: "Using the table, which kind of message pulls your hand off a hot pan?",
    right: "nerve signals",
    wrong: ["hormones", "both, at exactly the same speed"],
    hint: "You need to move in a fraction of a second. Check the Speed row.",
    visual: SIGNAL_TABLE,
  },
  {
    prompt: "Using the table, which kind of message controls slow changes like growing taller over many years?",
    right: "hormones",
    wrong: ["nerve signals", "neither one"],
    hint: "Look at the Effect lasts row. Which message's effects can last for years?",
    visual: SIGNAL_TABLE,
    hard: true,
  },
  {
    prompt: "Which part of the brain helps with balance and coordination?",
    right: "the cerebellum",
    wrong: ["the cerebrum", "the brain stem", "the spinal cord"],
    hint: "The cerebellum sits at the back of the brain, under the larger cerebrum. It keeps your movements smooth and steady.",
    hard: true,
  },
  {
    prompt: "Which part of the brain automatically controls breathing and heartbeat?",
    right: "the brain stem",
    wrong: ["the cerebellum", "the cerebrum", "the pituitary gland"],
    hint: "The brain stem connects the brain to the spinal cord. It runs things you never have to think about.",
    hard: true,
  },
  {
    prompt: "Which gland is called the “master gland” because it signals other glands?",
    right: "the pituitary gland",
    wrong: ["the thyroid gland", "the adrenal glands", "the pancreas"],
    hint: "This pea-sized gland sits at the base of the brain and also makes growth hormone.",
    hard: true,
  },
  {
    prompt: "Your heart pounds before a big race. Which hormone from the adrenal glands causes this?",
    right: "adrenaline",
    wrong: ["insulin", "growth hormone", "melatonin"],
    hint: "This hormone gets your body ready for action: a faster heartbeat and quicker breathing.",
    emoji: "🏃",
    hard: true,
  },
  {
    prompt: "What does insulin, a hormone made by the pancreas, help control?",
    right: "the amount of sugar in the blood",
    wrong: ["how fast your hair grows", "the colour of your eyes", "how well you hear"],
    hint: "Insulin helps your cells take in sugar from the blood to use for energy.",
    hard: true,
  },
  {
    prompt: "What do sensory neurons do?",
    right: "carry messages from the senses to the brain and spinal cord",
    wrong: [
      "carry messages from the brain to the muscles",
      "filter wastes out of the blood",
      "release hormones into the blood",
    ],
    hint: "Sensory means having to do with the senses. These nerve cells bring information in.",
    hard: true,
  },
  {
    prompt: "What do motor neurons do?",
    right: "carry messages from the brain and spinal cord to the muscles",
    wrong: [
      "carry messages from the eyes to the brain",
      "store urine until it leaves the body",
      "make egg and sperm cells",
    ],
    hint: "Motor means having to do with movement. These nerve cells carry instructions out to muscles.",
    hard: true,
  },
  {
    prompt: "What are nephrons?",
    right: "tiny filters inside the kidneys",
    wrong: ["nerve cells in the brain", "glands in the neck", "tubes that carry urine to the bladder"],
    hint: "Each kidney has about a million of these tiny filtering units.",
    hard: true,
  },
  {
    prompt: "Puberty is started by chemical messengers. Which body system releases them?",
    right: "the endocrine (hormone) system",
    wrong: ["the excretory system", "the skeletal system", "the digestive system"],
    hint: "Hormones from glands such as the pituitary signal the body to begin the changes of puberty.",
    hard: true,
  },
  {
    prompt: "What happens during fertilization?",
    right: "a sperm cell and an egg cell join",
    wrong: ["a baby is born", "the kidneys make urine", "a nerve sends a message"],
    hint: "Fertilization is the very first step in making a new living thing. Two reproductive cells join into one.",
    hard: true,
  },
  {
    prompt: "Which organs produce egg cells?",
    right: "the ovaries",
    wrong: ["the testes", "the uterus", "the kidneys"],
    hint: "In the female reproductive system, two ovaries make egg cells and hormones.",
    hard: true,
  },
  {
    prompt: "Besides the kidneys and lungs, which organ removes some waste through sweat?",
    right: "the skin",
    wrong: ["the heart", "the brain", "the bladder"],
    hint: "Sweat is mostly water, but it also carries small amounts of salts and wastes out of your body.",
    emoji: "💦",
    hard: true,
  },
  {
    prompt: "Why does the spinal cord handle some reflexes without waiting for the brain?",
    right: "It saves time, so you react faster to danger",
    wrong: ["The brain is asleep during reflexes", "The spinal cord makes hormones", "The brain can't feel pain"],
    hint: "A shorter path for the message means a quicker reaction.",
    hard: true,
  },
];

function bodySystems({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const orders = shuffle([REFLEX_ORDER, CATCH_ORDER, WASTE_ORDER]).slice(0, difficulty === 3 ? 2 : 1);
  return shuffle([
    ...orders,
    sortQuestion(SYSTEM_SORT, 2),
    ...levelled(BODY_BANK, 7 - orders.length, difficulty),
  ]);
}

// ---------- Mixtures & Solutions ----------

const PURE_SORT: SortSet = {
  prompt: "Pure substance or mixture? Tap an item, then tap its basket.",
  hint: "A pure substance is made of only one kind of particle. A mixture has two or more substances combined, even if it looks like one thing.",
  bins: [
    { id: "pure", label: "pure substance", emoji: "🔹" },
    { id: "mix", label: "mixture", emoji: "🔀" },
  ],
  items: [
    { label: "distilled water", emoji: "💧", bin: "pure" },
    { label: "table salt", emoji: "🧂", bin: "pure" },
    { label: "pure gold", emoji: "🪙", bin: "pure" },
    { label: "oxygen gas", emoji: "💨", bin: "pure" },
    { label: "diamond (pure carbon)", emoji: "💎", bin: "pure" },
    { label: "salad", emoji: "🥗", bin: "mix" },
    { label: "air", emoji: "🌬️", bin: "mix" },
    { label: "salt water", emoji: "🌊", bin: "mix" },
    { label: "trail mix", emoji: "🥜", bin: "mix" },
    { label: "soil", emoji: "🪴", bin: "mix" },
    { label: "concrete", emoji: "🧱", bin: "mix" },
  ],
};

const MIX_SORT: SortSet = {
  prompt: "Mechanical mixture or solution? Tap an item, then tap its basket.",
  hint: "In a mechanical mixture you can see the different parts. In a solution, one substance dissolves into another, so it looks the same all the way through.",
  bins: [
    { id: "mech", label: "mechanical mixture", emoji: "🥣" },
    { id: "sol", label: "solution", emoji: "🧪" },
  ],
  items: [
    { label: "trail mix", emoji: "🥜", bin: "mech" },
    { label: "salad", emoji: "🥗", bin: "mech" },
    { label: "sand stirred into water", emoji: "🏖️", bin: "mech" },
    { label: "pizza", emoji: "🍕", bin: "mech" },
    { label: "chocolate chip cookie", emoji: "🍪", bin: "mech" },
    { label: "salt dissolved in water", emoji: "🧂", bin: "sol" },
    { label: "sugar dissolved in tea", emoji: "🍵", bin: "sol" },
    { label: "air", emoji: "🌬️", bin: "sol" },
    { label: "brass (copper and zinc)", emoji: "🎺", bin: "sol" },
    { label: "fizzy water", emoji: "🥤", bin: "sol" },
  ],
};

interface SolutionInfo {
  name: string;
  /** Extra detail shown after the name in the prompt. */
  note?: string;
  solute: string;
  solvent: string;
  hard?: true;
}

const SOLUTIONS: SolutionInfo[] = [
  { name: "salt water", solute: "salt", solvent: "water" },
  { name: "sugar water", solute: "sugar", solvent: "water" },
  { name: "the drink", note: " (drink crystals stirred into water)", solute: "drink crystals", solvent: "water" },
  { name: "vinegar", note: " (a little acetic acid mixed into water)", solute: "acetic acid", solvent: "water", hard: true },
  { name: "fizzy water", note: " (carbon dioxide gas dissolved in water)", solute: "carbon dioxide gas", solvent: "water", hard: true },
  { name: "brass", note: " (a metal made of copper with a little zinc)", solute: "zinc", solvent: "copper", hard: true },
  { name: "air", note: " (mostly nitrogen, with some oxygen)", solute: "oxygen", solvent: "nitrogen", hard: true },
];

function soluteQ(d: Level): Question {
  const pool = SOLUTIONS.filter((s) => (d === 1 ? !s.hard : d === 3 ? s.hard : true));
  const s = pick(pool);
  const role = pick(["solute", "solvent"] as const);
  const right = role === "solute" ? s.solute : s.solvent;
  const other = role === "solute" ? s.solvent : s.solute;
  return textChoice(
    `In ${s.name}${s.note ?? ""}, which is ${role === "solute" ? "a solute" : "the solvent"}?`,
    right,
    [other, s.name],
    "The solute is what dissolves (usually the smaller amount). The solvent does the dissolving (usually the larger amount). Together they make the solution.",
    { type: "emoji", emoji: "🧪" },
  );
}

function concentrationQ(d: Level): Question {
  const n = d === 1 ? 3 : 4;
  const names = ["A", "B", "C", "D"].slice(0, n);
  // grams of sugar per 100 mL, all different
  const per100 = sample([2, 3, 4, 5, 6, 8, 10, 12], n);
  const volumes = names.map(() => (d === 1 ? 100 : pick(d === 2 ? [100, 200] : [100, 200, 300, 500])));
  const grams = per100.map((c, i) => (c * volumes[i]) / 100);
  const most = chance(0.5) || d === 1;
  const best = per100.indexOf(most ? Math.max(...per100) : Math.min(...per100));
  return textChoice(
    `Which cup of sugar water is the ${most ? "most" : "least"} concentrated?`,
    `Cup ${names[best]}`,
    names.filter((_, i) => i !== best).map((x) => `Cup ${x}`),
    d === 1
      ? "Concentration is how much solute is dissolved in an amount of solvent. All the cups have the same amount of water, so compare the sugar."
      : "Concentration is how much solute is dissolved in an amount of solvent. Work out the grams of sugar in each 100 mL of water, then compare.",
    {
      type: "table",
      title: "Sugar water cups",
      headers: ["Cup", "Sugar", "Water"],
      rows: names.map((x, i) => [x, `${grams[i]} g`, `${volumes[i]} mL`]),
    },
  );
}

const MIX_BANK: Item[] = [
  {
    prompt: "What is a mixture?",
    right: "two or more substances combined, each keeping its own properties",
    wrong: [
      "a single substance made of one kind of particle",
      "a brand-new substance made by burning",
      "a substance that can never be separated",
    ],
    hint: "In a mixture, the substances are just mixed together. They can be separated again.",
  },
  {
    prompt: "What is a pure substance?",
    right: "matter made of only one kind of particle",
    wrong: ["any liquid you can see through", "two substances stirred together", "anything found in nature"],
    hint: "Distilled water, table salt and gold are pure substances. Each is made of just one kind of particle.",
  },
  {
    prompt: "In a mechanical mixture, you can…",
    right: "see the different parts",
    wrong: ["never separate the parts", "only find liquids", "see just one uniform substance"],
    hint: "Think of trail mix: you can see the nuts, raisins and seeds.",
    emoji: "🥜",
  },
  {
    prompt: "Salt stirred into water seems to disappear. What happened?",
    right: "It dissolved, forming a solution",
    wrong: ["It melted into a liquid", "It was destroyed", "It turned into water"],
    hint: "The salt is still there (taste it!). Its particles spread out evenly among the water particles. That's dissolving, not melting.",
    emoji: "🧂",
  },
  {
    prompt: "How could you separate sand from water?",
    right: "pour it through a filter",
    wrong: ["use a magnet", "stir it faster", "add more water"],
    hint: "A filter lets water pass through but traps the bigger sand grains.",
    emoji: "🏖️",
  },
  {
    prompt: "How could you get the salt back out of salt water?",
    right: "let the water evaporate",
    wrong: ["pour it through a filter", "use a magnet", "pick it out with tweezers"],
    hint: "Dissolved salt passes right through a filter. But when the water evaporates, the salt is left behind as crystals.",
    emoji: "☀️",
  },
  {
    prompt: "Which tool would quickly separate iron filings from sand?",
    right: "a magnet",
    wrong: ["a filter", "a funnel", "a thermometer"],
    hint: "Iron is magnetic. Sand is not.",
    emoji: "🧲",
  },
  {
    prompt: "Which method separates small pebbles from fine sand?",
    right: "sifting through a sieve",
    wrong: ["evaporation", "using a magnet", "boiling"],
    hint: "A sieve (screen) has holes that let small grains fall through and keep the bigger pieces.",
  },
  {
    prompt: "Which of these is a solution?",
    right: "sugar dissolved in water",
    wrong: ["a bowl of cereal and milk", "sand and gravel", "a tossed salad"],
    hint: "In a solution, one substance dissolves into another and looks the same throughout.",
  },
  {
    prompt: "Which change makes sugar dissolve faster?",
    right: "stirring the water",
    wrong: ["using colder water", "using bigger sugar lumps", "putting a lid on the cup"],
    hint: "Stirring, warmer water and smaller pieces all help a solute dissolve faster.",
    emoji: "🥄",
  },
  {
    prompt: "In a solution, the substance that does the dissolving is the…",
    right: "solvent",
    wrong: ["solute", "suspension", "filter"],
    hint: "In salt water, water is the solvent and salt is the solute.",
  },
  {
    prompt: "Recycling plants use giant magnets. What do the magnets pull out?",
    right: "steel cans",
    wrong: ["plastic bottles", "glass jars", "cardboard boxes"],
    hint: "Steel contains iron, which is magnetic.",
    emoji: "♻️",
  },
  {
    prompt: "Muddy water stands for an hour, and the mud sinks to the bottom. This kind of mixture is a…",
    right: "suspension",
    wrong: ["solution", "pure substance", "solvent"],
    hint: "In a suspension, the pieces are mixed in but not dissolved, so they settle out over time.",
    hard: true,
  },
  {
    prompt: "A solution that can't dissolve any more solute is called…",
    right: "saturated",
    wrong: ["diluted", "pure", "evaporated"],
    hint: "Keep adding sugar to water and eventually it piles up on the bottom. The solution is full, or saturated.",
    hard: true,
  },
  {
    prompt: "How can you get pure drinking water from salt water?",
    right: "distillation: boil it and collect the cooled steam",
    wrong: ["pour it through a paper filter", "use a strong magnet", "stir in more salt"],
    hint: "When salt water boils, only the water turns to steam. Cooling the steam turns it back into pure water.",
    hard: true,
  },
  {
    prompt: "Black marker ink spreads up wet paper and splits into blue, red and yellow bands. What separation method is this?",
    right: "chromatography",
    wrong: ["distillation", "filtration", "magnetism"],
    hint: "Chroma means colour. Different dyes travel up the paper at different speeds.",
    emoji: "🖊️",
    hard: true,
  },
  {
    prompt: "Why can't a magnet pick up aluminium cans?",
    right: "Aluminium isn't magnetic",
    wrong: ["Aluminium is too heavy", "The cans are empty", "Magnets only attract plastic"],
    hint: "Only a few metals, like iron, nickel and cobalt, are attracted to magnets.",
    hard: true,
  },
  {
    prompt: "Water is sometimes called the “universal solvent” because…",
    right: "it can dissolve more substances than almost any other liquid",
    wrong: ["it dissolves every substance", "it is found everywhere in space", "it never mixes with anything"],
    hint: "Water dissolves many things, like salt and sugar, but not everything. Oil and sand don't dissolve in water.",
    hard: true,
  },
  {
    prompt: "What can Priya conclude from her experiment?",
    right: "Sugar dissolves faster in warmer water",
    wrong: ["Sugar dissolves faster in colder water", "Water temperature makes no difference", "Sugar can't dissolve in hot water"],
    hint: "Look at how the bars change as the water gets warmer. A shorter bar means less time to dissolve.",
    visual: {
      type: "bars",
      title: "Seconds for a sugar cube to dissolve",
      bars: [
        { label: "cold", value: 90, emoji: "🧊" },
        { label: "room temp", value: 55 },
        { label: "hot", value: 20, emoji: "♨️" },
      ],
    },
    hard: true,
  },
  {
    prompt: "Pouring off the liquid after solids have settled to the bottom is called…",
    right: "decanting",
    wrong: ["sifting", "distilling", "evaporating"],
    hint: "Think of carefully pouring water off the top of a jar of settled mud.",
    hard: true,
  },
  {
    prompt: "Panning for gold works because gold is…",
    right: "denser than sand, so it sinks to the bottom of the pan",
    wrong: ["magnetic, so it sticks to the pan", "dissolved in the river water", "lighter than sand, so it floats"],
    hint: "Swirling the pan washes the lighter sand away while the heavy gold settles.",
    emoji: "🪙",
    hard: true,
  },
  {
    prompt: "Steel is mostly iron with a little carbon spread evenly through it. What kind of matter is steel?",
    right: "a mixture (a solid solution)",
    wrong: ["a pure element", "a gas", "a suspension"],
    hint: "Steel is made of more than one substance, mixed evenly. Metal mixtures like this are called alloys.",
    hard: true,
  },
];

function mixtures({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const sort = difficulty === 1 ? PURE_SORT : pick([PURE_SORT, MIX_SORT]);
  return shuffle([
    sortQuestion(sort, perBin(difficulty)),
    concentrationQ(difficulty),
    soluteQ(difficulty),
    ...levelled(MIX_BANK, 5, difficulty),
  ]);
}

// ---------- Newton's Laws ----------

const LAW_SORT: SortSet = {
  prompt: "Which of Newton's laws does each example show? Tap an item, then tap its basket.",
  hint: "1st law: things keep doing what they're doing (inertia). 2nd law: more force or less mass means more acceleration. 3rd law: every push has an equal push back.",
  bins: [
    { id: "first", label: "1st law: inertia", emoji: "1️⃣" },
    { id: "second", label: "2nd law: F = m × a", emoji: "2️⃣" },
    { id: "third", label: "3rd law: action and reaction", emoji: "3️⃣" },
  ],
  items: [
    { label: "Riders lurch forward when a bus brakes hard", emoji: "🚌", bin: "first" },
    { label: "A puck keeps gliding on smooth ice", emoji: "🏒", bin: "first" },
    { label: "A ball sits still until someone kicks it", emoji: "⚽", bin: "first" },
    { label: "An empty cart is easier to speed up than a full one", emoji: "🛒", bin: "second" },
    { label: "A harder throw makes a ball go faster", emoji: "⚾", bin: "second" },
    { label: "A loaded truck needs more force to speed up than a bike", emoji: "🚚", bin: "second" },
    { label: "A rocket pushes gas down and the gas pushes it up", emoji: "🚀", bin: "third" },
    { label: "A swimmer pushes water back to move forward", emoji: "🏊", bin: "third" },
    { label: "Stepping out of a canoe pushes the canoe backward", emoji: "🛶", bin: "third" },
  ],
};

function forceMathQ(d: Level): Question {
  if (d === 1) {
    const [m1, m2] = sample([2, 3, 5, 8, 10, 15, 20], 2);
    const lighter = m1 < m2 ? "Cart A" : "Cart B";
    return textChoice(
      `Two carts get exactly the same push. Cart A has a mass of ${m1} kg and cart B has a mass of ${m2} kg. Which one speeds up more?`,
      lighter,
      [lighter === "Cart A" ? "Cart B" : "Cart A", "Both speed up the same"],
      "Newton's second law: with the same force, the object with less mass speeds up (accelerates) more.",
      { type: "table", headers: ["Cart", "Mass", "Push"], rows: [["A", `${m1} kg`, "same"], ["B", `${m2} kg`, "same"]] },
    );
  }
  if (d === 3 && chance(0.5)) {
    const m = pick([2, 4, 5, 10, 20, 25, 50]);
    const a = randInt(2, 6);
    const q: InputQuestion = {
      kind: "input",
      prompt: `A net force of ${m * a} N pushes ${aOrAn(m).toLowerCase()} ${m} kg cart. What is the cart's acceleration?`,
      hint: "Newton's second law: F = m × a. To find acceleration, divide the force (N) by the mass (kg).",
      visual: { type: "equation", text: "a = F ÷ m" },
      answer: String(a),
      keypad: "number",
      suffix: "m/s²",
    };
    return q;
  }
  const m = d === 2 ? randInt(2, 12) * 5 : randInt(11, 40) * 5;
  const a = randInt(2, 6);
  const q: InputQuestion = {
    kind: "input",
    prompt: `${aOrAn(m)} ${m} kg wagon speeds up at ${a} m/s². What net force is acting on it?`,
    hint: "Newton's second law: force = mass × acceleration. Multiply the mass in kilograms by the acceleration.",
    visual: { type: "equation", text: "F = m × a" },
    answer: String(m * a),
    keypad: "number",
    suffix: "N",
  };
  return q;
}

const NEWTON_BANK: Item[] = [
  {
    prompt: "Newton's first law is also called the law of…",
    right: "inertia",
    wrong: ["gravity", "friction", "reflection"],
    hint: "Objects resist changes to their motion. That resistance has a special name.",
  },
  {
    prompt: "What is inertia?",
    right: "an object's resistance to a change in its motion",
    wrong: ["the force that pulls objects toward Earth", "the rubbing of two surfaces", "how bright an object is"],
    hint: "A still object stays still and a moving object keeps moving, unless a force changes it.",
  },
  {
    prompt: "A bus stops suddenly and the riders lurch forward. Why?",
    right: "Their bodies keep moving forward because of inertia",
    wrong: ["The bus pushes them forward", "Gravity pulls them forward", "The bus floor pulls them forward"],
    hint: "The bus stopped, but nothing stopped the riders yet. They keep going the way they were moving.",
    emoji: "🚌",
  },
  {
    prompt: "Which has the most inertia?",
    right: "a loaded truck",
    wrong: ["a bicycle", "a skateboard", "a tennis ball"],
    hint: "The more mass something has, the more inertia it has, and the harder it is to start or stop.",
  },
  {
    prompt: "By Newton's second law, if you push a cart harder, it will…",
    right: "speed up more",
    wrong: ["speed up less", "not change at all", "get heavier"],
    hint: "More force on the same mass means more acceleration.",
    emoji: "🛒",
  },
  {
    prompt: "Newton's third law says that for every action force there is…",
    right: "an equal and opposite reaction force",
    wrong: ["a bigger reaction force", "no reaction at all", "a reaction force in the same direction"],
    hint: "Forces come in pairs. If you push on a wall, the wall pushes back on you just as hard.",
  },
  {
    prompt: "How does a rocket lift off?",
    right: "It pushes hot gases down, and the gases push the rocket up",
    wrong: ["It pushes against the air above it", "Gravity pulls it upward", "Its wings lift it like a plane"],
    hint: "That's Newton's third law: action (gas pushed down) and reaction (rocket pushed up). It even works in space, where there's no air.",
    emoji: "🚀",
  },
  {
    prompt: "What unit do scientists use to measure force?",
    right: "the newton (N)",
    wrong: ["the kilogram (kg)", "the metre (m)", "the litre (L)"],
    hint: "The unit of force is named after Isaac Newton.",
  },
  {
    prompt: "Why do seatbelts keep people safe?",
    right: "They stop inertia from carrying you forward in a sudden stop",
    wrong: ["They make the car lighter", "They make the car go faster", "They turn off gravity"],
    hint: "When a car stops suddenly, your body keeps moving forward. The seatbelt supplies the force that stops you.",
    emoji: "🚗",
  },
  {
    prompt: "When you jump, you push down on the ground. What does the ground do?",
    right: "It pushes up on you with an equal force",
    wrong: ["Nothing at all", "It pulls you down harder", "It moves away from you"],
    hint: "Newton's third law: your push on the ground is matched by the ground's push on you.",
  },
  {
    prompt: "A soccer ball sits still on the grass. What will make it start moving?",
    right: "an unbalanced force, like a kick",
    wrong: ["waiting long enough", "its own inertia", "balanced forces"],
    hint: "Newton's first law: an object at rest stays at rest unless an unbalanced force acts on it.",
    emoji: "⚽",
  },
  {
    prompt: "A puck slides much farther on ice than on carpet. Why?",
    right: "Ice has less friction, so less force slows the puck",
    wrong: ["The puck has more inertia on ice", "The ice pushes the puck forward", "Gravity is weaker over ice"],
    hint: "Without a force to slow it, a moving object would keep going. Less friction means less slowing.",
    emoji: "🏒",
    hard: true,
  },
  {
    prompt: "Far out in space, a probe's engines shut off. What happens to the probe?",
    right: "It keeps moving in a straight line at the same speed",
    wrong: ["It slowly comes to a stop", "It falls straight down", "It starts spinning in circles"],
    hint: "With no friction or air to slow it, nothing changes its motion. That's Newton's first law.",
    emoji: "🛰️",
    hard: true,
  },
  {
    prompt: "Action and reaction forces are equal and opposite. Why don't they cancel out?",
    right: "They act on different objects",
    wrong: ["One is always a bit bigger", "They happen at different times", "They do cancel, so nothing ever moves"],
    hint: "When you push a wall, your push acts on the wall and the wall's push acts on you. Forces only cancel when they act on the same object.",
    hard: true,
  },
  {
    prompt: "A 2 kg ball and a 4 kg ball get the same push. Compared with the 4 kg ball, the 2 kg ball's acceleration is…",
    right: "twice as large",
    wrong: ["half as large", "the same", "four times as large"],
    hint: "Acceleration = force ÷ mass. Half the mass means double the acceleration.",
    hard: true,
  },
  {
    prompt: "Which change would double a cart's acceleration?",
    right: "doubling the force but keeping the mass the same",
    wrong: ["doubling the mass but keeping the force the same", "doubling both the force and the mass", "cutting the force in half"],
    hint: "a = F ÷ m. To make the answer twice as big, make the top number twice as big.",
    hard: true,
  },
  {
    prompt: "A swimmer pushes off the pool wall. Which force moves the swimmer forward?",
    right: "the wall pushing back on the swimmer",
    wrong: ["the swimmer pushing on the wall", "gravity", "the water's friction"],
    hint: "The swimmer pushes the wall (action), and the wall pushes the swimmer (reaction). Only the force on the swimmer moves the swimmer.",
    emoji: "🏊",
    hard: true,
  },
  {
    prompt: "Why is a loaded wagon harder to stop than an empty one going the same speed?",
    right: "It has more mass, so it has more inertia",
    wrong: ["It has less mass", "Friction only acts on empty wagons", "Gravity pushes it forward"],
    hint: "More mass means more inertia, so a bigger force is needed to change its motion.",
    hard: true,
  },
  {
    prompt: "Why does a hose push back on your hands when water sprays out fast?",
    right: "The hose pushes water forward, and the water pushes the hose back",
    wrong: ["The water is heavier than the hose", "Gravity pulls the hose backward", "Friction pushes the water out"],
    hint: "Action and reaction: whenever something pushes, it gets pushed back.",
    hard: true,
  },
  {
    prompt: "An astronaut floating outside the space station throws a tool forward. What happens to the astronaut?",
    right: "The astronaut drifts backward",
    wrong: ["The astronaut drifts forward", "Nothing happens to the astronaut", "The astronaut falls to Earth"],
    hint: "The astronaut pushes the tool forward, so the tool pushes the astronaut backward.",
    emoji: "👩‍🚀",
    hard: true,
  },
];

function newtonsLaws({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return shuffle([sortQuestion(LAW_SORT, 2), forceMathQ(difficulty), ...levelled(NEWTON_BANK, 6, difficulty)]);
}

// ---------- Gravity, Friction & Net Force ----------

function tugOfWarQ(d: Level): Question {
  const values = d === 1 ? [100, 200, 300, 400, 500] : Array.from({ length: 41 }, (_, i) => 200 + i * 10);
  const left = pick(values);
  const right = chance(0.2) ? left : pick(values.filter((v) => v !== left));
  const visual: Visual = {
    type: "bars",
    title: "Pulling force (N)",
    bars: [
      { label: "Blue (left)", value: left, emoji: "⬅️" },
      { label: "Gold (right)", value: right, emoji: "➡️" },
    ],
  };
  const prompt = `In a tug-of-war, the Blue team pulls left with ${left} N and the Gold team pulls right with ${right} N. What is the net force on the rope?`;
  const hint =
    "When forces point in opposite directions, subtract the smaller from the larger. The net force points the way of the bigger force. Equal forces are balanced: the net force is 0 N.";
  if (left === right) {
    return textChoice(
      prompt,
      "0 N (balanced)",
      [`${left} N to the left`, `${left} N to the right`, `${left * 2} N to the right`],
      hint,
      visual,
    );
  }
  const net = Math.abs(left - right);
  const dir = left > right ? "left" : "right";
  const other = dir === "left" ? "right" : "left";
  return textChoice(
    prompt,
    `${net} N to the ${dir}`,
    [`${net} N to the ${other}`, `${left + right} N to the ${dir}`, "0 N (balanced)"],
    hint,
    visual,
  );
}

function boxPushQ(): Question {
  const push = randInt(6, 15) * 10;
  const help = randInt(2, 8) * 10;
  const total = push + help;
  const balanced = chance(0.25);
  const friction = balanced ? total : randInt(2, total / 10 - 1) * 10;
  const prompt = `Ana pushes a heavy box to the right with ${push} N, and Leo helps by pushing right with ${help} N. Friction pushes back to the left with ${friction} N. What is the net force on the box?`;
  const hint =
    "Add the forces pointing the same way, then subtract the force pointing the opposite way. If they're equal, the forces are balanced.";
  if (balanced) {
    return textChoice(
      prompt,
      "0 N (balanced)",
      [`${total} N to the right`, `${total * 2} N to the right`, `${push} N to the left`],
      hint,
      { type: "emoji", emoji: "📦" },
    );
  }
  const net = total - friction;
  return textChoice(
    prompt,
    `${net} N to the right`,
    [`${net} N to the left`, `${total + friction} N to the right`, `${total} N to the right`, "0 N (balanced)"],
    hint,
    { type: "emoji", emoji: "📦" },
  );
}

function weightQ(d: Level): Question {
  if (d === 1) {
    const m = pick([48, 54, 60, 66, 72]);
    return textChoice(
      `An astronaut has a mass of ${m} kg on Earth. What is her mass on the Moon?`,
      `${m} kg`,
      [`about ${m / 6} kg`, "0 kg", `about ${m * 6} kg`],
      "Mass is the amount of matter in an object, so it stays the same everywhere. Weight, the pull of gravity, is what changes on the Moon.",
      { type: "emoji", emoji: "👩‍🚀" },
    );
  }
  if (d === 2) {
    const w = randInt(2, 15) * 60;
    const q: InputQuestion = {
      kind: "input",
      prompt: `The Moon's gravity is about 1/6 as strong as Earth's. A rover weighs ${w} N on Earth. About how much does it weigh on the Moon?`,
      hint: "Weight is the pull of gravity. With 1/6 of the gravity, the rover weighs 1/6 as much, so divide its Earth weight by 6.",
      visual: { type: "emoji", emoji: "🌙" },
      answer: String(w / 6),
      keypad: "number",
      suffix: "N",
    };
    return q;
  }
  const w = randInt(2, 12) * 40;
  const q: InputQuestion = {
    kind: "input",
    prompt: `Gravity at Jupiter's cloud tops is about 2.5 times as strong as Earth's. A probe weighs ${w} N on Earth. About how much would it weigh at Jupiter?`,
    hint: "Stronger gravity means more weight. Multiply the Earth weight by 2.5 (double it, then add half of it).",
    visual: { type: "emoji", emoji: "🟠" },
    answer: String(w * 2.5),
    keypad: "number",
    suffix: "N",
  };
  return q;
}

const FRICTION_SORT: SortSet = {
  prompt: "Is the friction helpful or a problem? Tap an item, then tap its basket.",
  hint: "Friction is helpful when we need grip or need to stop. It's a problem when it wears things out, wastes energy or makes things hard to move.",
  bins: [
    { id: "help", label: "helpful friction", emoji: "👍" },
    { id: "problem", label: "friction is a problem", emoji: "👎" },
  ],
  items: [
    { label: "shoe treads gripping the gym floor", emoji: "👟", bin: "help" },
    { label: "bike brakes stopping a wheel", emoji: "🚲", bin: "help" },
    { label: "sand spread on an icy sidewalk", emoji: "❄️", bin: "help" },
    { label: "tire treads gripping a wet road", emoji: "🚗", bin: "help" },
    { label: "a pencil leaving marks on paper", emoji: "✏️", bin: "help" },
    { label: "a stiff, squeaky door hinge", emoji: "🚪", bin: "problem" },
    { label: "a bike chain wearing out", emoji: "⛓️", bin: "problem" },
    { label: "a blister from a rubbing shoe", emoji: "🩹", bin: "problem" },
    { label: "engine parts heating up and wearing down", emoji: "⚙️", bin: "problem" },
    { label: "a heavy box that's hard to slide", emoji: "📦", bin: "problem" },
  ],
};

const FORCE_BANK: Item[] = [
  {
    prompt: "What is gravity?",
    right: "a force of attraction between objects that have mass",
    wrong: ["a force that only acts on falling objects", "a push from the air", "a force made only by magnets"],
    hint: "Every object with mass pulls on every other one. Earth is so massive that its pull keeps us on the ground.",
    emoji: "🍎",
  },
  {
    prompt: "What is friction?",
    right: "a force that resists motion when surfaces rub together",
    wrong: ["a force that pulls objects toward Earth", "a force that only acts in space", "the speed of a moving object"],
    hint: "Rub your hands together. The force you feel resisting the motion is friction.",
  },
  {
    prompt: "On which surface would a sliding hockey puck slow down fastest?",
    right: "carpet",
    wrong: ["smooth ice", "a polished gym floor", "wet tile"],
    hint: "Rougher surfaces create more friction, which slows things down faster.",
    emoji: "🏒",
  },
  {
    prompt: "The forces on an object are balanced. What happens to its motion?",
    right: "It doesn't change",
    wrong: ["It speeds up", "It slows down", "It changes direction"],
    hint: "Balanced forces cancel out. A still object stays still, and a moving one keeps the same speed and direction.",
  },
  {
    prompt: "Which situation shows unbalanced forces?",
    right: "a car speeding up from a red light",
    wrong: ["a book resting on a table", "a lamp hanging still from the ceiling", "a parked bike"],
    hint: "Unbalanced forces change motion: speeding up, slowing down or turning.",
  },
  {
    prompt: "What is the difference between mass and weight?",
    right: "Mass is the amount of matter; weight is the pull of gravity on it",
    wrong: [
      "They are exactly the same thing",
      "Weight is the amount of matter; mass is the pull of gravity on it",
      "Mass changes on the Moon, but weight never does",
    ],
    hint: "Mass is measured in kilograms and stays the same everywhere. Weight is a force, measured in newtons, and depends on gravity.",
  },
  {
    prompt: "Why do many drivers put winter tires on their cars?",
    right: "Their treads give more friction on snow and ice",
    wrong: ["They make the car lighter", "They reduce gravity", "They remove all friction"],
    hint: "More grip (friction) helps a car start, turn and stop safely on slippery roads.",
    emoji: "❄️",
  },
  {
    prompt: "Why do people put oil on a bike chain?",
    right: "to reduce friction",
    wrong: ["to increase friction", "to add weight", "to increase gravity"],
    hint: "Oil makes surfaces slippery, so parts slide past each other more easily.",
    emoji: "🚲",
  },
  {
    prompt: "How does a parachute slow a skydiver down?",
    right: "by increasing air resistance",
    wrong: ["by turning off gravity", "by decreasing air resistance", "by making the skydiver heavier"],
    hint: "Air resistance is friction with the air. A big parachute catches lots of air.",
    emoji: "🪂",
  },
  {
    prompt: "A book rests on a table. Gravity pulls it down. What force balances gravity?",
    right: "the table pushing up on the book",
    wrong: ["air pushing down on the book", "friction pulling it sideways", "nothing; the forces are unbalanced"],
    hint: "The book isn't moving, so the forces must be balanced. Something must push up as hard as gravity pulls down.",
    emoji: "📕",
  },
  {
    prompt: "Where would you weigh the least?",
    right: "on the Moon",
    wrong: ["on Earth", "on Jupiter", "on Neptune"],
    hint: "The Moon has much less mass than Earth, so its gravity is weaker.",
    emoji: "🌙",
  },
  {
    prompt: "A car cruises at a steady 80 km/h on a straight highway. The forces on it are…",
    right: "balanced: the engine's push equals friction and air resistance",
    wrong: [
      "unbalanced: the engine's push is bigger",
      "unbalanced: friction is bigger",
      "zero: no forces act on a moving car",
    ],
    hint: "Steady speed in a straight line means the motion isn't changing, so the forces must be balanced.",
    hard: true,
  },
  {
    prompt: "On the Moon, an astronaut dropped a hammer and a feather at the same time. What happened?",
    right: "They hit the ground at the same time",
    wrong: ["The hammer landed first", "The feather landed first", "They floated away"],
    hint: "The Moon has no air, so there's no air resistance. Gravity makes all objects fall at the same rate.",
    hard: true,
  },
  {
    prompt: "On Earth, why does a feather fall more slowly than a rock?",
    right: "Air resistance slows the feather much more",
    wrong: ["Gravity doesn't pull on feathers", "The feather has more mass", "Gravity pulls light things upward"],
    hint: "The feather is light and spread out, so the air pushes back on it a lot compared to its weight.",
    hard: true,
  },
  {
    prompt: "What happens to the pull of gravity between two objects as they move farther apart?",
    right: "It gets weaker",
    wrong: ["It gets stronger", "It stays exactly the same", "It disappears instantly"],
    hint: "Gravity depends on mass and distance. The farther apart, the weaker the pull.",
    hard: true,
  },
  {
    prompt: "Why do we use wheels to move heavy loads?",
    right: "Rolling friction is much less than sliding friction",
    wrong: ["Wheels make loads lighter", "Wheels increase gravity", "Wheels remove all friction"],
    hint: "Try sliding a heavy box, then rolling it on a cart. Rolling takes much less force.",
    hard: true,
  },
  {
    prompt: "Which force keeps the Moon in orbit around Earth?",
    right: "gravity",
    wrong: ["friction", "magnetism", "air resistance"],
    hint: "Earth's pull keeps tugging the Moon toward it, bending its path into an orbit.",
    emoji: "🌙",
    hard: true,
  },
  {
    prompt: "Rubbing your hands together warms them up. Friction changes motion energy into…",
    right: "thermal (heat) energy",
    wrong: ["light energy", "chemical energy", "electrical energy"],
    hint: "That's why brakes and engine parts get hot.",
    emoji: "👐",
    hard: true,
  },
  {
    prompt: "You push a heavy box, but it doesn't move. Why not?",
    right: "Friction pushes back just as hard, so the forces are balanced",
    wrong: ["Gravity pushes it sideways", "Your push has no force at all", "The box has no inertia"],
    hint: "If the motion doesn't change, the forces must be balanced.",
    emoji: "📦",
    hard: true,
  },
  {
    prompt: "A ball is thrown straight up. At the very top of its path, which force is still acting on it?",
    right: "gravity",
    wrong: ["the force of the throw", "no forces at all", "friction from the ground"],
    hint: "Once the ball leaves your hand, your push is gone. Gravity never stops pulling.",
    hard: true,
  },
];

function forcesAtWork({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const netForce = difficulty === 3 && chance(0.6) ? boxPushQ() : tugOfWarQ(difficulty);
  return shuffle([
    netForce,
    weightQ(difficulty),
    sortQuestion(FRICTION_SORT, perBin(difficulty)),
    ...levelled(FORCE_BANK, 5, difficulty),
  ]);
}

// ---------- Our Solar System ----------

interface Planet {
  name: string;
  /** Diameter at the equator, km. */
  diameter: number;
  /** Average distance from the Sun, AU. */
  au: number;
  /** Length of one orbit, in Earth years. */
  year: number;
}

const PLANETS: Planet[] = [
  { name: "Mercury", diameter: 4879, au: 0.4, year: 0.24 },
  { name: "Venus", diameter: 12104, au: 0.7, year: 0.62 },
  { name: "Earth", diameter: 12756, au: 1.0, year: 1 },
  { name: "Mars", diameter: 6792, au: 1.5, year: 1.9 },
  { name: "Jupiter", diameter: 142984, au: 5.2, year: 11.9 },
  { name: "Saturn", diameter: 120536, au: 9.6, year: 29.5 },
  { name: "Uranus", diameter: 51118, au: 19.2, year: 84 },
  { name: "Neptune", diameter: 49528, au: 30.1, year: 165 },
];

const SUN_OUTWARD = ["Mercury", "Venus", "Earth", "Mars", "asteroid belt", "Jupiter", "Saturn", "Uranus", "Neptune"];

function planetOrderQ(d: Level): OrderQuestion {
  const planets = PLANETS.map((p) => p.name);
  let names: string[];
  if (d === 3) {
    const picked = sample(planets, 5);
    names = SUN_OUTWARD.filter((n) => n === "asteroid belt" || picked.includes(n));
  } else {
    names = inOrder(planets, d === 1 ? 4 : 5);
  }
  return {
    kind: "order",
    prompt: "Put these in order, starting with the one closest to the Sun.",
    hint: "Try: My Very Educated Mother Just Served Us Nachos (Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune). The asteroid belt lies between Mars and Jupiter.",
    items: names.map((n) => ({ id: n.replace(/ /g, "-").toLowerCase(), label: n })),
  };
}

function planetTableQ(d: Level): Question {
  const rows = inOrder(PLANETS, 4);
  const visual: Visual = {
    type: "table",
    title: "Planet data",
    headers: ["Planet", "Diameter (km)", "Distance from Sun (AU)", "Year (Earth years)"],
    rows: rows.map((p) => [p.name, withCommas(p.diameter), p.au.toFixed(1), String(p.year)]),
  };
  const names = rows.map((p) => p.name);
  const choose = (answer: string, prompt: string, hint: string) =>
    textChoice(prompt, answer, names.filter((n) => n !== answer), hint, visual);
  const byDiameter = [...rows].sort((a, b) => b.diameter - a.diameter);
  const farthest = rows[rows.length - 1];
  const kinds =
    d === 1 ? ["largest", "smallest", "closest"] : d === 2 ? ["largest", "smallest", "longest"] : ["longest", "pattern", "times"];
  let kind = pick(kinds);
  if (kind === "times" && farthest.au < 5) kind = "pattern";
  switch (kind) {
    case "largest":
      return choose(byDiameter[0].name, "Which planet in the table is the largest?", "Compare the diameters. The biggest number is the widest planet.");
    case "smallest":
      return choose(
        byDiameter[byDiameter.length - 1].name,
        "Which planet in the table is the smallest?",
        "Compare the diameters. The smallest number is the narrowest planet.",
      );
    case "closest":
      return choose(rows[0].name, "Which planet in the table is closest to the Sun?", "Look for the smallest distance from the Sun.");
    case "longest":
      return choose(
        farthest.name,
        "Which planet in the table takes the longest to travel once around the Sun?",
        "One trip around the Sun is a planet's year. Find the biggest number in the Year column.",
      );
    case "pattern":
      return textChoice(
        "What pattern does the table show?",
        "The farther a planet is from the Sun, the longer its year",
        ["The closer a planet is to the Sun, the longer its year", "Every planet's year is as long as Earth's"],
        "Compare the Distance and Year columns. As one goes up, what happens to the other?",
        visual,
      );
    default: {
      const n = Math.round(farthest.au);
      return textChoice(
        `1 AU is Earth's distance from the Sun. About how many times farther from the Sun than Earth is ${farthest.name}?`,
        `about ${n} times`,
        [`about ${Math.round(n / 2)} times`, `about ${n * 2} times`, `about ${n * 10} times`],
        `Earth is 1 AU from the Sun. A planet ${farthest.au} AU away is about ${farthest.au} times as far, so round to the nearest whole number.`,
        visual,
      );
    }
  }
}

const PLANET_SORT: SortSet = {
  prompt: "Rocky planet or giant planet? Tap an item, then tap its basket.",
  hint: "The four inner planets are small and rocky. The four outer planets are huge giants made mostly of gas and ice.",
  bins: [
    { id: "rocky", label: "rocky planet", emoji: "🪨" },
    { id: "giant", label: "giant planet", emoji: "🎈" },
  ],
  items: [
    { label: "Mercury", emoji: "⚪", bin: "rocky" },
    { label: "Venus", emoji: "🟡", bin: "rocky" },
    { label: "Earth", emoji: "🌍", bin: "rocky" },
    { label: "Mars", emoji: "🔴", bin: "rocky" },
    { label: "Jupiter", emoji: "🟠", bin: "giant" },
    { label: "Saturn", emoji: "🪐", bin: "giant" },
    { label: "Uranus", emoji: "🟢", bin: "giant" },
    { label: "Neptune", emoji: "🔵", bin: "giant" },
  ],
};

const SOLAR_BANK: Item[] = [
  {
    prompt: "What is at the centre of our solar system?",
    right: "the Sun",
    wrong: ["Earth", "the Moon", "Jupiter"],
    hint: "All eight planets orbit around the same star.",
    emoji: "☀️",
  },
  {
    prompt: "The Sun is a…",
    right: "star",
    wrong: ["planet", "moon", "galaxy"],
    hint: "The Sun makes its own light and heat. So do the other stars you see at night; they're just much farther away.",
    emoji: "☀️",
  },
  {
    prompt: "Where is the asteroid belt?",
    right: "between Mars and Jupiter",
    wrong: ["between Earth and Mars", "between Saturn and Uranus", "between Venus and Earth"],
    hint: "The asteroid belt separates the four rocky inner planets from the four giant outer planets.",
    emoji: "🪨",
  },
  {
    prompt: "Which planet is the largest?",
    right: "Jupiter",
    wrong: ["Saturn", "Earth", "Neptune"],
    hint: "This giant is so big that more than 1000 Earths could fit inside it.",
    emoji: "🟠",
  },
  {
    prompt: "Which planet is closest to the Sun?",
    right: "Mercury",
    wrong: ["Venus", "Earth", "Mars"],
    hint: "It's the smallest planet and it zips around the Sun in just 88 days.",
  },
  {
    prompt: "Which planet is known as the Red Planet?",
    right: "Mars",
    wrong: ["Venus", "Jupiter", "Mercury"],
    hint: "This planet, fourth from the Sun, has rusty red dust.",
    emoji: "🔴",
  },
  {
    prompt: "How many moons does Earth have?",
    right: "1",
    wrong: ["0", "2", "4"],
    hint: "We call it “the Moon”.",
    emoji: "🌙",
  },
  {
    prompt: "Which planet is famous for its bright, wide rings?",
    right: "Saturn",
    wrong: ["Mars", "Venus", "Mercury"],
    hint: "All four giant planets have rings, but this one's rings of ice and rock are by far the brightest.",
    emoji: "🪐",
  },
  {
    prompt: "What is a moon?",
    right: "a natural object that orbits a planet",
    wrong: ["a star that orbits the Sun", "a planet with rings", "a cloud of gas between planets"],
    hint: "Earth has one moon, Mars has two, and the giant planets have dozens each.",
  },
  {
    prompt: "About how long does Earth take to travel once around the Sun?",
    right: "about 365 days",
    wrong: ["about 24 hours", "about 30 days", "about 10 years"],
    hint: "One trip around the Sun is one year.",
    emoji: "🌍",
  },
  {
    prompt: "In 2006, which object was reclassified as a dwarf planet?",
    right: "Pluto",
    wrong: ["Mars", "Neptune", "Mercury"],
    hint: "This small, icy world lies beyond Neptune.",
  },
  {
    prompt: "Which planet is the hottest, because its thick atmosphere traps heat?",
    right: "Venus",
    wrong: ["Mercury", "Mars", "Jupiter"],
    hint: "Mercury is closer to the Sun, but Venus's thick carbon dioxide atmosphere traps heat like a blanket.",
    emoji: "🌡️",
    hard: true,
  },
  {
    prompt: "What are Mars's two small moons called?",
    right: "Phobos and Deimos",
    wrong: ["Titan and Io", "Europa and Ganymede", "Triton and Charon"],
    hint: "Their names come from Greek words for fear and dread.",
    emoji: "🔴",
    hard: true,
  },
  {
    prompt: "Which is the largest moon in the solar system?",
    right: "Ganymede, a moon of Jupiter",
    wrong: ["Earth's Moon", "Titan, a moon of Saturn", "Phobos, a moon of Mars"],
    hint: "The largest planet also has the largest moon. It's even bigger than the planet Mercury.",
    hard: true,
  },
  {
    prompt: "Which planet spins tipped over almost completely on its side?",
    right: "Uranus",
    wrong: ["Neptune", "Saturn", "Venus"],
    hint: "This blue-green ice giant is tilted about 98°, so it seems to roll around the Sun.",
    hard: true,
  },
  {
    prompt: "About how long does sunlight take to reach Earth?",
    right: "about 8 minutes",
    wrong: ["about 8 seconds", "about 8 hours", "about 8 days"],
    hint: "Light is the fastest thing there is, but the Sun is about 150 million km away.",
    emoji: "☀️",
    hard: true,
  },
  {
    prompt: "The Kuiper belt is a region of icy objects found…",
    right: "beyond Neptune",
    wrong: ["between Mars and Jupiter", "inside the Sun", "between Earth and the Moon"],
    hint: "Pluto is one of the bigger objects in this cold, faraway region.",
    hard: true,
  },
  {
    prompt: "What is one astronomical unit (AU)?",
    right: "the average distance from Earth to the Sun",
    wrong: ["the distance across the Milky Way", "the width of Earth", "the distance light travels in a year"],
    hint: "Astronomers use Earth's distance from the Sun as a handy ruler for the solar system.",
    hard: true,
  },
  {
    prompt: "A comet's tail always points…",
    right: "away from the Sun",
    wrong: ["toward the Sun", "toward Earth", "straight down"],
    hint: "Sunlight and the solar wind push gas and dust off the comet, away from the Sun.",
    emoji: "☄️",
    hard: true,
  },
  {
    prompt: "What keeps the planets in orbit around the Sun?",
    right: "the Sun's gravity",
    wrong: ["Earth's magnetism", "friction with space", "the planets' rings"],
    hint: "The Sun holds about 99.8% of the solar system's mass, so its pull is enormous.",
    hard: true,
  },
  {
    prompt: "Ceres is the largest object in the asteroid belt. What is it classified as?",
    right: "a dwarf planet",
    wrong: ["a gas giant", "a star", "a comet"],
    hint: "Like Pluto, Ceres is round but shares its orbit with lots of other objects.",
    hard: true,
  },
  {
    prompt: "Why does Mars look red?",
    right: "Its soil contains rusty iron (iron oxide)",
    wrong: ["It is covered in red plants", "It is hot like lava", "It reflects red light from Jupiter"],
    hint: "Mars is actually very cold. Its colour comes from iron in the dust that has rusted.",
    emoji: "🔴",
    hard: true,
  },
];

function solarSystem({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return [
    planetOrderQ(difficulty),
    ...shuffle([planetTableQ(difficulty), sortQuestion(PLANET_SORT, perBin(difficulty)), ...levelled(SOLAR_BANK, 5, difficulty)]),
  ];
}

// ---------- Galaxies & Space Tech ----------

const SPACE_SORT: SortSet = {
  prompt: "Is it in our solar system or beyond it? Tap an item, then tap its basket.",
  hint: "Our solar system is the Sun and everything that orbits it. Other stars, nebulas and galaxies are far beyond it.",
  bins: [
    { id: "in", label: "in our solar system", emoji: "☀️" },
    { id: "beyond", label: "beyond our solar system", emoji: "🌌" },
  ],
  items: [
    { label: "the Moon", emoji: "🌙", bin: "in" },
    { label: "the asteroid belt", emoji: "🪨", bin: "in" },
    { label: "Pluto", emoji: "❄️", bin: "in" },
    { label: "Halley's Comet", emoji: "☄️", bin: "in" },
    { label: "Jupiter's moon Europa", emoji: "🧊", bin: "in" },
    { label: "the Andromeda Galaxy", emoji: "🌀", bin: "beyond" },
    { label: "Proxima Centauri, the nearest other star", emoji: "⭐", bin: "beyond" },
    { label: "the Orion Nebula", emoji: "🌫️", bin: "beyond" },
    { label: "the North Star (Polaris)", emoji: "✨", bin: "beyond" },
    { label: "the centre of the Milky Way", emoji: "🌌", bin: "beyond" },
  ],
};

const SIZE_ORDER = [
  { id: "moon", label: "the Moon", emoji: "🌙" },
  { id: "earth", label: "Earth", emoji: "🌍" },
  { id: "sun", label: "the Sun", emoji: "☀️" },
  { id: "solar", label: "our solar system", emoji: "🪐" },
  { id: "galaxy", label: "the Milky Way", emoji: "🌌" },
  { id: "universe", label: "the universe", emoji: "✨" },
];

function sizeOrderQ(d: Level): OrderQuestion {
  return {
    kind: "order",
    prompt: "Put these in order from smallest to largest.",
    hint: "The Moon orbits Earth. Earth orbits the Sun. The Sun and its planets make our solar system, which is one tiny part of the Milky Way. The universe holds billions of galaxies.",
    items: inOrder(SIZE_ORDER, d === 1 ? 4 : d === 2 ? 5 : 6),
  };
}

const SKY_PASSAGE: Visual = {
  type: "passage",
  title: "Reading the Night Sky",
  paragraphs: [
    "For thousands of years, Indigenous peoples across North America have watched the night sky closely. Knowledge about the stars, the Moon and the seasons has been passed down through generations in stories, songs and teachings shared by Elders and Knowledge Keepers.",
    "Different Nations have their own names and stories for the same groups of stars. A star pattern that some people call the Big Dipper may be seen as a different figure in another Nation's teachings.",
    "Many communities have used the sky as a calendar. The changing shape of the Moon and the rising of certain stars could signal when it was time to fish, hunt, gather plants or move to a new camp. Some Indigenous calendars name each Moon cycle after what is happening in nature at that time of year.",
    "Today, some scientists and Indigenous Knowledge Keepers work together, sharing different ways of knowing about the sky.",
  ],
};

const TECH_PASSAGE: Visual = {
  type: "passage",
  title: "Eyes and Arms in Space",
  paragraphs: [
    "Earth's atmosphere blurs and blocks some of the light that comes from space. That's why some telescopes are launched into orbit. The Hubble Space Telescope was launched in 1990, and the James Webb Space Telescope, launched in 2021, studies the universe using infrared light.",
    "Canada has helped build important space tools. Canadarm, a robotic arm, first flew on a space shuttle in 1981. Canadarm2 helped build and maintain the International Space Station. Canada also built a guidance sensor and a science instrument for the Webb telescope.",
    "Technology made for space often ends up in everyday life. These “spinoffs” include some camera sensors used in phones, memory foam and better water filters.",
  ],
};

const GALAXY_PASSAGE: Visual = {
  type: "passage",
  title: "Our Home Galaxy",
  paragraphs: [
    "On a dark night far from city lights, you may see a faint, milky band stretching across the sky. That band is our view of the Milky Way galaxy, seen from inside its flat disk.",
    "The Milky Way is a spiral galaxy with long, curving arms. It holds hundreds of billions of stars and is so wide that light takes about 100,000 years to cross it. Our Sun sits in one of the arms, about halfway out from the centre.",
    "The Sun and its planets travel around the centre of the galaxy. One trip takes about 230 million years.",
    "The Milky Way is just one of billions of galaxies. Our closest large neighbour, the Andromeda Galaxy, is about 2.5 million light-years away.",
  ],
};

const PASSAGE_ITEMS: Item[] = [
  {
    prompt: "According to the passage, how has sky knowledge been passed down?",
    right: "through stories, songs and teachings from Elders and Knowledge Keepers",
    wrong: ["only through printed textbooks", "only through telescope photos", "it was never shared"],
    hint: "Look at the first paragraph.",
    visual: SKY_PASSAGE,
  },
  {
    prompt: "Why isn't there just one Indigenous story about the Big Dipper?",
    right: "Different Nations have their own names and stories for the stars",
    wrong: ["Nobody could see the Big Dipper", "All Nations share exactly the same story", "The Big Dipper appeared only recently"],
    hint: "Reread the second paragraph. Each Nation has its own knowledge.",
    visual: SKY_PASSAGE,
  },
  {
    prompt: "How did many communities use the sky as a calendar?",
    right: "The Moon's shape and certain stars signalled times to fish, hunt or gather",
    wrong: ["The stars showed the exact date of each birthday", "The sky was used to predict earthquakes", "The Moon was used to measure temperature"],
    hint: "Look at the third paragraph.",
    visual: SKY_PASSAGE,
    hard: true,
  },
  {
    prompt: "Why are some telescopes put into space?",
    right: "Earth's atmosphere blurs and blocks some light from space",
    wrong: ["Telescopes are too big to fit on Earth", "Space telescopes don't need any power", "It costs less than building them on the ground"],
    hint: "Look at the first sentence of the passage.",
    visual: TECH_PASSAGE,
  },
  {
    prompt: "Which Canadian tool helped build the International Space Station?",
    right: "Canadarm2, a robotic arm",
    wrong: ["the Hubble Space Telescope", "a Mars rover", "the Webb telescope's mirror"],
    hint: "Look at the second paragraph.",
    visual: TECH_PASSAGE,
  },
  {
    prompt: "What is a space “spinoff”?",
    right: "an everyday product that grew out of space research",
    wrong: ["a rocket that spins as it launches", "a broken satellite", "a newly discovered planet"],
    hint: "Look at the last paragraph and its examples.",
    visual: TECH_PASSAGE,
    hard: true,
  },
  {
    prompt: "According to the passage, why does the Milky Way look like a band across the sky?",
    right: "We see the galaxy's flat disk from inside it",
    wrong: ["It's a long cloud of water vapour", "It's sunlight reflected off the Moon", "It's the tail of a comet"],
    hint: "Look at the first paragraph.",
    visual: GALAXY_PASSAGE,
  },
  {
    prompt: "Where is our Sun in the Milky Way?",
    right: "in one of the spiral arms, about halfway out from the centre",
    wrong: ["at the very centre", "outside the galaxy", "inside the Andromeda Galaxy"],
    hint: "Look at the second paragraph.",
    visual: GALAXY_PASSAGE,
  },
  {
    prompt: "About how long does the Sun take to travel once around the centre of the galaxy?",
    right: "about 230 million years",
    wrong: ["about 365 days", "about 100 years", "about 2.5 million years"],
    hint: "Look at the third paragraph. Be careful: another number in the passage is about distance, not time.",
    visual: GALAXY_PASSAGE,
    hard: true,
  },
];

const GALAXY_BANK: Item[] = [
  {
    prompt: "What is the name of our galaxy?",
    right: "the Milky Way",
    wrong: ["Andromeda", "the solar system", "the Big Dipper"],
    hint: "On a very dark night, it looks like a hazy, milky band of light.",
    emoji: "🌌",
  },
  {
    prompt: "What is a galaxy?",
    right: "a huge system of billions of stars, gas and dust held together by gravity",
    wrong: ["a planet with many moons", "a single very bright star", "a group of planets around one sun"],
    hint: "Our Sun is just one of the hundreds of billions of stars in our galaxy.",
    emoji: "🌀",
  },
  {
    prompt: "What shape is the Milky Way?",
    right: "a spiral, with curving arms",
    wrong: ["a perfect ball", "a cube", "a straight line"],
    hint: "Seen from above, our galaxy would look like a giant pinwheel.",
    emoji: "🌀",
  },
  {
    prompt: "About how many galaxies are there in the universe?",
    right: "billions",
    wrong: ["about 10", "exactly 100", "just one"],
    hint: "Deep photos from space telescopes show galaxies in every direction, too many to count.",
    emoji: "🔭",
  },
  {
    prompt: "What is a light-year?",
    right: "the distance light travels in one year",
    wrong: ["the time Earth takes to orbit the Sun", "how long a star shines", "a year on another planet"],
    hint: "Even though it has “year” in its name, a light-year measures distance. It's about 9.5 trillion km.",
  },
  {
    prompt: "What is the International Space Station?",
    right: "a science lab that orbits Earth with astronauts on board",
    wrong: ["a telescope on a mountaintop", "a base on the Moon", "a rocket launch pad"],
    hint: "Astronauts from many countries live and do experiments there as it circles Earth.",
    emoji: "🛰️",
  },
  {
    prompt: "Which tool would an astronomer use to study faraway galaxies?",
    right: "a telescope",
    wrong: ["a microscope", "a thermometer", "a periscope"],
    hint: "This tool gathers light from very distant objects.",
    emoji: "🔭",
  },
  {
    prompt: "What do the satellites that orbit Earth help us with?",
    right: "weather forecasts, GPS and communication",
    wrong: ["making it rain", "growing crops faster", "changing the seasons"],
    hint: "Satellites watch the weather, send signals for maps and help phones and TV work.",
    emoji: "🛰️",
  },
  {
    prompt: "Why are robotic rovers used to explore Mars?",
    right: "They can go places too far or dangerous for people",
    wrong: ["Mars is too small for people", "Robots are needed to make Mars red", "People are not allowed in space"],
    hint: "A trip to Mars takes many months, and its surface is very cold with thin air.",
    emoji: "🤖",
  },
  {
    prompt: "Many Indigenous peoples have watched the Moon and stars closely. One way this knowledge was used is to…",
    right: "track the seasons and know when to fish, hunt or harvest",
    wrong: ["measure the distance to other galaxies", "predict earthquakes", "find metals underground"],
    hint: "The sky changes in a regular pattern through the year, so it works like a calendar.",
    emoji: "🌙",
  },
  {
    prompt: "Who was the first Canadian woman in space, in 1992?",
    right: "Roberta Bondar",
    wrong: ["Chris Hadfield", "Marc Garneau", "Julie Payette"],
    hint: "She was a doctor and scientist who studied how space affects the human body.",
    emoji: "👩‍🚀",
    hard: true,
  },
  {
    prompt: "In 2013, Chris Hadfield became the first Canadian to…",
    right: "command the International Space Station",
    wrong: ["walk on the Moon", "land on Mars", "build the Hubble telescope"],
    hint: "He was in charge of the whole space station crew.",
    emoji: "🛰️",
    hard: true,
  },
  {
    prompt: "What are the three main shapes of galaxies?",
    right: "spiral, elliptical and irregular",
    wrong: ["round, square and triangle", "hot, cold and warm", "rocky, gassy and icy"],
    hint: "Some galaxies have arms, some are smooth ovals, and some have no clear shape.",
    hard: true,
  },
  {
    prompt: "Light from the Andromeda Galaxy takes about 2.5 million years to reach us. When we look at it, we see it…",
    right: "as it was about 2.5 million years ago",
    wrong: ["exactly as it is today", "as it will look in the future", "only in the daytime"],
    hint: "The light left Andromeda long ago. Looking far into space is like looking back in time.",
    emoji: "🌀",
    hard: true,
  },
  {
    prompt: "Why is it important to learn sky stories from local Knowledge Keepers?",
    right: "Each Nation has its own knowledge, names and stories",
    wrong: ["All Indigenous peoples share one story", "Sky stories are the same as science textbooks", "The stories are only about the Sun"],
    hint: "Indigenous knowledge is diverse. It belongs to specific Nations and places.",
    emoji: "✨",
    hard: true,
  },
  {
    prompt: "Which is the closest large spiral galaxy to the Milky Way?",
    right: "the Andromeda Galaxy",
    wrong: ["the Sombrero Galaxy", "the Whirlpool Galaxy", "the Cartwheel Galaxy"],
    hint: "It's about 2.5 million light-years away and can be seen without a telescope on a very dark night.",
    emoji: "🌀",
    hard: true,
  },
  {
    prompt: "What is the nearest star to Earth?",
    right: "the Sun",
    wrong: ["Proxima Centauri", "the North Star", "Sirius"],
    hint: "Proxima Centauri is the nearest star beyond our solar system, but there's one much closer!",
    emoji: "☀️",
    hard: true,
  },
];

function galaxiesAndSpace({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return shuffle([
    sortQuestion(SPACE_SORT, perBin(difficulty)),
    sizeOrderQ(difficulty),
    oneOf(PASSAGE_ITEMS, difficulty),
    ...levelled(GALAXY_BANK, 5, difficulty),
  ]);
}

export const course: Course = {
  grade: "6",
  subject: "science",
  bigIdeas: {
    "ca-bc": [
      "Multicellular organisms rely on internal systems to survive, reproduce, and interact with their environment.",
      "Everyday materials are often mixtures.",
      "Newton's three laws of motion describe the relationship between force and motion.",
      "The solar system is part of the Milky Way, which is one of billions of galaxies.",
    ],
  },
  units: [
    {
      id: "body-systems",
      title: "Body Systems",
      emoji: "🧠",
      blurb: "Nerves, hormones, kidneys and more",
      standards: { "ca-bc": "Basic structures and functions of body systems: excretory, reproductive, hormonal and nervous" },
      parentNote:
        "How the nervous and endocrine (hormone) systems send messages, how the excretory system removes waste, and the basic organs of the reproductive system, all at a simple organ-and-job level.",
      generate: bodySystems,
    },
    {
      id: "mixtures",
      title: "Mixtures & Solutions",
      emoji: "🧪",
      blurb: "Mix it, dissolve it, separate it",
      standards: { "ca-bc": "Pure substances and mixtures; mechanical mixtures and solutions; separation of mixtures" },
      parentNote:
        "Telling pure substances from mixtures, mechanical mixtures from solutions, solutes and solvents, comparing concentration, and choosing separation methods like filtering, evaporation, magnets and distillation.",
      generate: mixtures,
    },
    {
      id: "newtons-laws",
      title: "Newton's Laws",
      emoji: "🚀",
      blurb: "Three laws of motion",
      standards: { "ca-bc": "Newton's three laws of motion" },
      parentNote:
        "Inertia (1st law), force = mass × acceleration (2nd law) and action–reaction pairs (3rd law), with everyday examples and a few simple calculations.",
      generate: newtonsLaws,
    },
    {
      id: "forces-at-work",
      title: "Gravity & Friction",
      emoji: "🛷",
      blurb: "Balanced and unbalanced forces",
      standards: { "ca-bc": "Effects of balanced and unbalanced forces in daily physical activities; force of gravity; friction" },
      parentNote:
        "Working out net force, telling balanced from unbalanced forces, mass versus weight on the Moon and other planets, and when friction helps or causes problems.",
      generate: forcesAtWork,
    },
    {
      id: "solar-system",
      title: "Our Solar System",
      emoji: "🪐",
      blurb: "Planets, moons and the asteroid belt",
      standards: { "ca-bc": "Overview of our solar system: the Sun, planets, moons, the asteroid belt and other objects" },
      parentNote:
        "The planets in order, rocky versus giant planets, reading a table of planet data, moons, dwarf planets, comets and the asteroid belt.",
      generate: solarSystem,
    },
    {
      id: "galaxies-and-space",
      title: "Galaxies & Space Tech",
      emoji: "🌌",
      blurb: "The Milky Way and beyond",
      standards: {
        "ca-bc":
          "The Milky Way and other galaxies; space exploration technologies, including Canadian contributions; First Peoples knowledge of the sky",
      },
      parentNote:
        "Our place in the Milky Way, light-years and other galaxies, telescopes, satellites and Canadian space technology, and how Indigenous peoples have observed and shared knowledge of the sky.",
      generate: galaxiesAndSpace,
    },
  ],
};
