import { chance, pick, randInt, sample, shuffle, textChoice } from "../../random";
import { fromBank, sortQuestion, type BankItem, type SortSet } from "../../bank";
import { COIN_NAMES } from "../../money";
import type { Choice, ChoiceQuestion, Course, GenerateOptions, Question, ShapeName, Visual } from "../../types";

type Diff = 1 | 2 | 3;
type Opt = Omit<Choice, "id">;

const rep = (item: string, n: number): string[] => Array.from({ length: n }, () => item);
const range = (lo: number, hi: number): number[] => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

/** Pick-the-number question for numbers 0–10: 3 choices, wrong ones close to the answer. */
function count(
  prompt: string,
  answer: number,
  hint: string,
  visual?: Visual,
  speak?: string,
  max = 10,
): ChoiceQuestion {
  const near = (offsets: number[]) =>
    shuffle(offsets)
      .map((o) => answer + o)
      .filter((n) => n >= 0 && n <= max);
  const wrong = [...near([1, -1, 2, -2]), ...near([3, -3, 4, -4])].slice(0, 2);
  const q: ChoiceQuestion = {
    kind: "choice",
    prompt,
    hint,
    visual,
    answer: String(answer),
    choices: shuffle([answer, ...wrong]).map((n) => ({ id: String(n), label: String(n) })),
  };
  if (speak) q.speak = speak;
  return q;
}

interface Thing {
  emoji: string;
  name: string;
}

const THINGS: Thing[] = [
  { emoji: "🍎", name: "apples" },
  { emoji: "🐟", name: "fish" },
  { emoji: "⭐", name: "stars" },
  { emoji: "🐞", name: "ladybugs" },
  { emoji: "🌸", name: "flowers" },
  { emoji: "🚗", name: "cars" },
  { emoji: "🐥", name: "chicks" },
  { emoji: "🍓", name: "strawberries" },
  { emoji: "🎈", name: "balloons" },
  { emoji: "🦆", name: "ducks" },
  { emoji: "🍪", name: "cookies" },
  { emoji: "🐸", name: "frogs" },
];

const NAMES = ["Maya", "Jay", "Sam", "Amir", "Lena", "Kenji", "Zoe", "Ravi", "Ana", "Noah", "Priya", "Leo"];

// ---------- Count to 10 ----------

function howManyDots(t: Thing, n: number): Question {
  return count(
    `How many ${t.emoji}?`,
    n,
    "Touch each one as you count. The last number you say is how many!",
    { type: "dots", count: n, emoji: t.emoji },
    `How many ${t.name}?`,
  );
}

function countFrame(n: number): Question {
  return count(
    "How many dots?",
    n,
    n > 5 ? "The top row has 5. Start at 5 and count on!" : "Point to each dot as you count.",
    { type: "tenFrame", filled: n },
  );
}

function whichGroupHas(d: Diff, t: Thing): Question {
  const n = d === 1 ? randInt(1, 4) : d === 2 ? randInt(2, 5) : randInt(4, 6);
  const near = d === 3 ? [n - 1, n + 1, n - 2] : [n - 2, n - 1, n + 1, n + 2];
  const wrong = sample(
    near.filter((k) => k >= 1 && k <= 6),
    2,
  );
  const group = (k: number) => rep(t.emoji, k).join("");
  return textChoice(
    `Which group has ${n}?`,
    group(n),
    wrong.map(group),
    `Count each group. Which one has ${n}?`,
    { type: "letter", text: String(n) },
  );
}

function nextNumber(d: Diff): Question {
  if (d === 3 && chance(0.5)) {
    const start = randInt(5, 10);
    const seq = [start, start - 1, start - 2];
    return count(
      "What number comes next?",
      start - 3,
      `We are counting back. What number comes just before ${seq[2]}?`,
      { type: "equation", text: `${seq.join(", ")}, ☐` },
    );
  }
  const start = d === 1 ? randInt(1, 2) : d === 2 ? randInt(1, 7) : randInt(4, 7);
  const seq = [start, start + 1, start + 2];
  return count(
    "What number comes next?",
    start + 3,
    `Say it out loud: ${seq.join(", ")}… What do you say next?`,
    { type: "equation", text: `${seq.join(", ")}, ☐` },
  );
}

function orderNumbers(d: Diff): Question {
  let nums: number[];
  if (d === 1) {
    const s = randInt(1, 3);
    nums = [s, s + 1, s + 2];
  } else if (d === 2) {
    const s = randInt(1, 7);
    nums = [s, s + 1, s + 2, s + 3];
  } else {
    nums = sample(range(0, 10), 4).sort((a, b) => a - b);
  }
  return {
    kind: "order",
    prompt: "Tap the numbers in counting order.",
    hint:
      d === 3
        ? "Count from 0 to 10. Tap each number when you get to it."
        : `Start with ${nums[0]}. What number comes after it?`,
    items: nums.map((n) => ({ id: String(n), label: String(n) })),
  };
}

function mixedRow(d: Diff): Question {
  const [t, other] = sample(THINGS, 2);
  const n = d === 3 ? randInt(4, 7) : randInt(2, 5);
  const items = shuffle([...rep(t.emoji, n), ...rep(other.emoji, randInt(2, 3))]);
  return count(
    `How many ${t.emoji}?`,
    n,
    `Only count the ${t.name}. Skip the ${other.name}!`,
    { type: "emojiRow", items },
    `How many ${t.name}?`,
  );
}

function zeroPlate(): Question {
  const t = pick(THINGS.filter((x) => ["🍪", "🍎", "🍓"].includes(x.emoji)));
  return count(
    `The plate is empty. How many ${t.emoji}?`,
    0,
    "Nothing there means zero!",
    { type: "emoji", emoji: "🍽️", caption: "empty plate" },
    `The plate is empty. How many ${t.name} are on it?`,
    3,
  );
}

function countTo10({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const d = difficulty;
  const [lo, hi] = d === 1 ? [1, 5] : d === 2 ? [3, 10] : [6, 10];
  const things = sample(THINGS, 4);
  const dots = things.slice(0, d === 3 ? 2 : 3).map((t) => howManyDots(t, randInt(lo, hi)));
  const extra = d === 3 ? [mixedRow(d), mixedRow(d)] : [chance(0.5) ? zeroPlate() : mixedRow(d)];
  return shuffle([
    ...dots,
    countFrame(randInt(lo, hi)),
    whichGroupHas(d, things[3]),
    nextNumber(d),
    orderNumbers(d),
    ...extra,
  ]);
}

// ---------- Make 5 and 10 ----------

function moreToMake(target: 5 | 10, showEmpty: boolean): Question {
  const have = randInt(1, target - 1);
  const items = [...rep("🔴", have), ...(showEmpty ? rep("⚪", target - have) : [])];
  return count(
    `How many more to make ${target}?`,
    target - have,
    showEmpty
      ? "Count the empty ⚪ spots. That's how many more you need!"
      : `Start at ${have}. Count up to ${target} on your fingers.`,
    { type: "emojiRow", items },
    undefined,
    target,
  );
}

function fiveAndMore(d: Diff): Question {
  let a: number, b: number;
  if (d === 1) {
    a = randInt(1, 4);
    b = randInt(1, 5 - a);
  } else if (d === 2) {
    a = 5;
    b = randInt(1, 5);
  } else {
    a = randInt(3, 8);
    b = randInt(1, 10 - a);
  }
  return count(
    "How many dots in all?",
    a + b,
    a === 5
      ? "The red row is 5. Start at 5 and count on the blue dots!"
      : "Count the red dots. Then keep counting the blue ones!",
    { type: "tenFrame", filled: a, extra: b },
  );
}

function waysToMake(d: Diff): Question {
  const total = d === 1 ? 5 : d === 2 ? pick([5, 10]) : pick([6, 7, 8, 9, 10]);
  const a = randInt(1, total - 1);
  const b = total - a;
  const near: [number, number][] = [];
  for (let x = 1; x <= 9; x++) {
    for (let y = 1; y <= 9; y++) {
      const s = x + y;
      if (s !== total && Math.abs(s - total) <= 2 && s <= 10 && (x === a || y === b)) near.push([x, y]);
    }
  }
  return textChoice(
    `Which two make ${total}?`,
    `${a} and ${b}`,
    sample(near, 2).map(([x, y]) => `${x} and ${y}`),
    `Hold up fingers for each number. Count them all. Do you get ${total}?`,
    { type: "letter", text: String(total) },
  );
}

const HIDERS: Thing[] = [
  { emoji: "🐸", name: "frogs" },
  { emoji: "🐞", name: "ladybugs" },
  { emoji: "🐟", name: "fish" },
  { emoji: "🐥", name: "chicks" },
  { emoji: "🐰", name: "bunnies" },
  { emoji: "🦆", name: "ducks" },
];

function hiddenPart(d: Diff, t: Thing): Question {
  const whole = d === 1 ? randInt(3, 5) : d === 2 ? randInt(5, 10) : randInt(6, 10);
  const seen = randInt(1, whole - 1);
  return count(
    `${whole} ${t.emoji} in all. How many are hiding?`,
    whole - seen,
    `You can see ${seen}. Count on from ${seen} up to ${whole}.`,
    { type: "emojiRow", items: rep(t.emoji, seen), showBlank: true },
    `There are ${whole} ${t.name} in all. How many are hiding?`,
  );
}

const HANDS: Record<Diff, { hands: string[]; n: number }[]> = {
  1: [
    { hands: ["✌️"], n: 2 },
    { hands: ["☝️", "✌️"], n: 3 },
    { hands: ["✌️", "✌️"], n: 4 },
    { hands: ["🖐️"], n: 5 },
  ],
  2: [
    { hands: ["✌️", "✌️"], n: 4 },
    { hands: ["🖐️"], n: 5 },
    { hands: ["🖐️", "☝️"], n: 6 },
    { hands: ["🖐️", "✌️"], n: 7 },
  ],
  3: [
    { hands: ["🖐️", "☝️"], n: 6 },
    { hands: ["🖐️", "✌️"], n: 7 },
    { hands: ["🖐️", "🖐️"], n: 10 },
  ],
};

function fingers(d: Diff): Question {
  const h = pick(HANDS[d]);
  return count(
    "How many fingers are up?",
    h.n,
    h.n > 5 ? "One whole hand is 5. Start at 5 and count on!" : "Touch and count each finger that is up.",
    { type: "emojiRow", items: h.hands },
  );
}

function aroundFive(d: Diff): Question {
  const pool = d === 1 ? [1, 2, 3, 7, 8, 9] : d === 2 ? [1, 2, 3, 4, 6, 7, 8, 9, 10] : [3, 4, 6, 7];
  const n = chance(0.25) ? 5 : pick(pool);
  const t = pick(THINGS);
  return {
    kind: "choice",
    prompt: "Is this less than 5, just 5, or more than 5?",
    hint: "Count to 5. Did you run out first, or are there extras?",
    visual: { type: "dots", count: n, emoji: t.emoji },
    answer: n < 5 ? "less" : n > 5 ? "more" : "five",
    choices: [
      { id: "less", label: "less than 5" },
      { id: "five", label: "just 5" },
      { id: "more", label: "more than 5" },
    ],
  };
}

function makeFiveTen({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const d = difficulty;
  const more =
    d === 1
      ? [moreToMake(5, true), moreToMake(5, true)]
      : d === 2
        ? [moreToMake(5, true), moreToMake(10, true)]
        : [moreToMake(10, true), moreToMake(chance(0.5) ? 5 : 10, false)];
  const [h1, h2] = sample(HIDERS, 2);
  return shuffle([
    ...more,
    fiveAndMore(d),
    waysToMake(d),
    hiddenPart(d, h1),
    hiddenPart(d, h2),
    fingers(d),
    aroundFive(d),
  ]);
}

// ---------- Add & Take Away ----------

interface Critter extends Thing {
  /** [one, many] */
  come: [string, string];
  go: [string, string];
}

const CRITTERS: Critter[] = [
  { emoji: "🐦", name: "birds", come: ["flies in", "fly in"], go: ["flies away", "fly away"] },
  { emoji: "🐸", name: "frogs", come: ["hops in", "hop in"], go: ["hops away", "hop away"] },
  { emoji: "🦆", name: "ducks", come: ["swims over", "swim over"], go: ["swims away", "swim away"] },
  { emoji: "🐞", name: "ladybugs", come: ["lands", "land"], go: ["flies away", "fly away"] },
  { emoji: "🐟", name: "fish", come: ["swims in", "swim in"], go: ["swims away", "swim away"] },
  { emoji: "🐰", name: "bunnies", come: ["hops in", "hop in"], go: ["hops away", "hop away"] },
  { emoji: "🐥", name: "chicks", come: ["walks in", "walk in"], go: ["walks away", "walk away"] },
];

const SNACKS: Thing[] = [
  { emoji: "🍪", name: "cookies" },
  { emoji: "🍓", name: "strawberries" },
  { emoji: "🍎", name: "apples" },
  { emoji: "🧁", name: "cupcakes" },
];

function addParts(d: Diff): [number, number] {
  if (d === 1) {
    const a = randInt(2, 4);
    return [a, randInt(1, 5 - a)];
  }
  if (d === 2) {
    const a = randInt(2, 8);
    return [a, randInt(1, Math.min(3, 10 - a))];
  }
  const a = randInt(3, 7);
  return [a, randInt(2, 10 - a)];
}

function takeParts(d: Diff): [number, number] {
  if (d === 1) {
    const a = randInt(2, 5);
    return [a, randInt(1, a - 1)];
  }
  if (d === 2) {
    const a = randInt(3, 10);
    return [a, randInt(1, Math.min(3, a - 1))];
  }
  const a = randInt(5, 10);
  return [a, chance(0.15) ? a : randInt(2, Math.min(5, a - 1))];
}

function joinCritters(d: Diff, c: Critter): Question {
  const [a, b] = addParts(d);
  const verb = c.come[b === 1 ? 0 : 1];
  return count(
    `${a} ${c.emoji} are here. ${b} more ${verb}. How many now?`,
    a + b,
    `Start at ${a} and count on ${b} more.`,
    { type: "emojiRow", items: [...rep(c.emoji, a), "➕", ...rep(c.emoji, b)] },
    `${a} ${c.name} are here. ${b} more ${verb}. How many ${c.name} are there now?`,
  );
}

function joinSnacks(d: Diff, s: Thing): Question {
  const [a, b] = addParts(d);
  const who = pick(NAMES);
  return count(
    `${who} has ${a} ${s.emoji} and gets ${b} more. How many now?`,
    a + b,
    `Start at ${a} and count on ${b} more.`,
    { type: "emojiRow", items: [...rep(s.emoji, a), "➕", ...rep(s.emoji, b)] },
    `${who} has ${a} ${s.name} and gets ${b} more. How many ${s.name} now?`,
  );
}

function takeCritters(d: Diff, c: Critter): Question {
  const [a, b] = takeParts(d);
  const verb = c.go[b === 1 ? 0 : 1];
  // Easier: show the ones that left as puffs. Harder: show only the starting group.
  const items = d === 1 ? [...rep(c.emoji, a - b), ...rep("💨", b)] : rep(c.emoji, a);
  return count(
    `${a} ${c.emoji} are here. ${b} ${verb}. How many are left?`,
    a - b,
    d === 1
      ? `The 💨 shows the ones that left. Count the ${c.name} still here.`
      : `Hold up ${a} fingers. Put ${b} down. How many are still up?`,
    { type: "emojiRow", items },
    `${a} ${c.name} are here. ${b} ${verb}. How many ${c.name} are left?`,
  );
}

function moreOrLessThan(d: Diff, dir: "more" | "less"): Question {
  const k = d === 3 ? pick([1, 2]) : 1;
  const top = d === 1 ? 5 : 10;
  const n = dir === "more" ? randInt(1, top - k) : randInt(k + 1, top);
  const answer = dir === "more" ? n + k : n - k;
  const hint =
    dir === "more"
      ? k === 1
        ? "1 more is the next number when you count up."
        : `Start at ${n} and count up ${k}.`
      : k === 1
        ? "1 less is the number just before when you count."
        : `Start at ${n} and count back ${k}.`;
  return count(`What is ${k} ${dir} than ${n}?`, answer, hint, { type: "dots", count: n, emoji: "⭐" });
}

function addTakeAway({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const d = difficulty;
  const c = sample(CRITTERS, 5);
  return shuffle([
    joinCritters(d, c[0]),
    joinCritters(d, c[1]),
    joinSnacks(d, pick(SNACKS)),
    takeCritters(d, c[2]),
    takeCritters(d, c[3]),
    takeCritters(d, c[4]),
    moreOrLessThan(d, "more"),
    moreOrLessThan(d, "less"),
  ]);
}

// ---------- More, Less, Same ----------

interface Row {
  label: string;
  emoji: string;
}

const PAIRS: [Row, Row][] = [
  [{ label: "dogs", emoji: "🐶" }, { label: "cats", emoji: "🐱" }],
  [{ label: "apples", emoji: "🍎" }, { label: "bananas", emoji: "🍌" }],
  [{ label: "cars", emoji: "🚗" }, { label: "bikes", emoji: "🚲" }],
  [{ label: "frogs", emoji: "🐸" }, { label: "fish", emoji: "🐟" }],
  [{ label: "stars", emoji: "⭐" }, { label: "moons", emoji: "🌙" }],
  [{ label: "cupcakes", emoji: "🧁" }, { label: "cookies", emoji: "🍪" }],
  [{ label: "ducks", emoji: "🦆" }, { label: "chicks", emoji: "🐥" }],
];

const pairTitle = (pair: [Row, Row]) => `${cap(pair[0].label)} and ${pair[1].label}`;

function twoCounts(d: Diff, equal = false): [number, number] {
  if (equal) {
    const n = d === 1 ? randInt(1, 5) : randInt(2, 9);
    return [n, n];
  }
  let a: number, b: number;
  do {
    if (d === 1) {
      a = randInt(1, 5);
      b = randInt(1, 5);
    } else if (d === 2) {
      a = randInt(1, 9);
      b = randInt(1, 9);
    } else {
      a = randInt(4, 9);
      b = a + pick([1, -1]);
    }
  } while (a === b || (d === 1 && Math.abs(a - b) < 2));
  return [a, b];
}

function compareGroups(d: Diff, mode: "more" | "fewer", pair: [Row, Row]): Question {
  const [a, b] = twoCounts(d);
  const rows = [
    { ...pair[0], count: a },
    { ...pair[1], count: b },
  ];
  const bigger = a > b ? rows[0] : rows[1];
  const smaller = a > b ? rows[1] : rows[0];
  const [target, other] = mode === "more" ? [bigger, smaller] : [smaller, bigger];
  return textChoice(
    `Which has ${mode}?`,
    { label: target.label, emoji: target.emoji },
    [{ label: other.label, emoji: other.emoji }],
    mode === "more"
      ? "Match them up one to one. The row with extras left over has more."
      : "Match them up one to one. The row that runs out first has fewer.",
    { type: "pictograph", title: pairTitle(pair), rows },
  );
}

const SAME: Opt = { label: "yes, the same", emoji: "✅" };
const NOT_SAME: Opt = { label: "no, not the same", emoji: "❌" };

function sameOrNot(d: Diff, pair: [Row, Row]): Question {
  const same = chance(0.5);
  const [a, b] = twoCounts(d, same);
  return textChoice(
    "Do both rows have the same number?",
    same ? SAME : NOT_SAME,
    [same ? NOT_SAME : SAME],
    "Match each one on top with one below. Any left over? Then they are not the same.",
    {
      type: "pictograph",
      title: pairTitle(pair),
      rows: [
        { ...pair[0], count: a },
        { ...pair[1], count: b },
      ],
    },
  );
}

function makeSame(d: Diff, pair: [Row, Row]): Question {
  const gap = d === 1 ? randInt(1, 2) : d === 2 ? randInt(1, 4) : randInt(2, 5);
  const small = randInt(1, (d === 1 ? 5 : 10) - gap);
  const [low, high] = shuffle(pair);
  return count(
    `How many more ${low.emoji} to make them the same?`,
    gap,
    "Match them up one to one. Count the ones with no partner.",
    {
      type: "pictograph",
      title: pairTitle(pair),
      rows: pair.map((r) => ({ ...r, count: r === low ? small : small + gap })),
    },
    `How many more ${low.label} do we need so there are the same number of ${low.label} and ${high.label}?`,
  );
}

function scaleRow(red: number, blue: number): Visual {
  return { type: "emojiRow", items: [...rep("🟥", red), "⚖️", ...rep("🟦", blue)] };
}

function balanceScale(d: Diff): Question {
  const lo = d === 3 ? 3 : 1;
  const hi = d === 1 ? 5 : 6;
  const red = randInt(lo, hi);
  let blue = red;
  if (!chance(1 / 3)) {
    do {
      blue = d === 3 ? red + pick([1, -1]) : randInt(lo, hi);
    } while (blue === red || (d === 1 && Math.abs(blue - red) < 2));
  }
  return {
    kind: "choice",
    prompt: "All the blocks weigh the same. What will the scale do?",
    hint: "The side with more blocks is heavier, so it goes down. Same number? It balances!",
    visual: scaleRow(red, blue),
    answer: red > blue ? "red" : blue > red ? "blue" : "even",
    choices: [
      { id: "red", label: "red side goes down", emoji: "🟥" },
      { id: "blue", label: "blue side goes down", emoji: "🟦" },
      { id: "even", label: "it balances", emoji: "⚖️" },
    ],
  };
}

function balanceFix(d: Diff): Question {
  const blue = randInt(1, d === 3 ? 5 : 4);
  const gap = d === 3 ? randInt(2, 4) : randInt(1, 3);
  return count(
    "How many 🟦 should we add so the scale balances?",
    gap,
    "Both sides need the same number of blocks. How many more does the red side have?",
    scaleRow(blue + gap, blue),
    "How many blue blocks should we add so the scale balances?",
  );
}

const GRAPH_TOPICS: { title: string; rows: Row[] }[] = [
  {
    title: "Our favourite fruit",
    rows: [
      { label: "apples", emoji: "🍎" },
      { label: "bananas", emoji: "🍌" },
      { label: "grapes", emoji: "🍇" },
      { label: "strawberries", emoji: "🍓" },
    ],
  },
  {
    title: "Pets in our class",
    rows: [
      { label: "dogs", emoji: "🐶" },
      { label: "cats", emoji: "🐱" },
      { label: "fish", emoji: "🐟" },
      { label: "bunnies", emoji: "🐰" },
    ],
  },
  {
    title: "Toys in the bin",
    rows: [
      { label: "teddy bears", emoji: "🧸" },
      { label: "cars", emoji: "🚗" },
      { label: "balls", emoji: "⚽" },
      { label: "blocks", emoji: "🧱" },
    ],
  },
  {
    title: "Bugs we saw",
    rows: [
      { label: "ladybugs", emoji: "🐞" },
      { label: "bees", emoji: "🐝" },
      { label: "ants", emoji: "🐜" },
      { label: "butterflies", emoji: "🦋" },
    ],
  },
];

function makeGraph(d: Diff, size: number) {
  const topic = pick(GRAPH_TOPICS);
  const rows = sample(topic.rows, size);
  let counts: number[];
  if (d === 3) {
    const base = randInt(3, 7);
    counts = shuffle(range(base, base + size - 1));
  } else {
    counts = sample(range(1, d === 1 ? 5 : 8), size);
  }
  return { title: topic.title, rows: rows.map((r, i) => ({ ...r, count: counts[i] })) };
}

function graphMost(d: Diff): Question {
  const g = makeGraph(d, 3);
  const mode = d === 1 ? "most" : pick(["most", "fewest"] as const);
  const sorted = [...g.rows].sort((x, y) => y.count - x.count);
  const target = mode === "most" ? sorted[0] : sorted[sorted.length - 1];
  return textChoice(
    `Which has the ${mode}?`,
    { label: target.label, emoji: target.emoji },
    g.rows.filter((r) => r !== target).map((r) => ({ label: r.label, emoji: r.emoji })),
    mode === "most" ? "Find the longest row. It has the most." : "Find the shortest row. It has the fewest.",
    { type: "pictograph", ...g },
  );
}

function graphCount(d: Diff): Question {
  const g = makeGraph(d, d === 1 ? 2 : 3);
  const row = pick(g.rows);
  return count(
    `How many ${row.emoji} are in the graph?`,
    row.count,
    `Find the ${row.emoji} row. Touch and count each one.`,
    { type: "pictograph", ...g },
    `How many ${row.label} are in the graph?`,
  );
}

function moreLessSame({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const d = difficulty;
  const pairs = sample(PAIRS, 4);
  return shuffle([
    compareGroups(d, "more", pairs[0]),
    compareGroups(d, "fewer", pairs[1]),
    sameOrNot(d, pairs[2]),
    makeSame(d, pairs[3]),
    balanceScale(d),
    d === 1 ? balanceScale(d) : balanceFix(d),
    graphMost(d),
    graphCount(d),
  ]);
}

// ---------- Patterns ----------

interface Item {
  emoji: string;
  name: string;
}

const PATTERN_SETS: Item[][] = [
  [{ emoji: "🍎", name: "apple" }, { emoji: "🍌", name: "banana" }, { emoji: "🍇", name: "grapes" }],
  [{ emoji: "🔴", name: "red" }, { emoji: "🔵", name: "blue" }, { emoji: "🟡", name: "yellow" }],
  [{ emoji: "⭐", name: "star" }, { emoji: "🌙", name: "moon" }, { emoji: "☀️", name: "sun" }],
  [{ emoji: "🐟", name: "fish" }, { emoji: "🐚", name: "shell" }, { emoji: "🦀", name: "crab" }],
  [{ emoji: "🌲", name: "tree" }, { emoji: "🍄", name: "mushroom" }, { emoji: "🌸", name: "flower" }],
  [{ emoji: "🐶", name: "dog" }, { emoji: "🐱", name: "cat" }, { emoji: "🐭", name: "mouse" }],
  [{ emoji: "❤️", name: "red heart" }, { emoji: "💙", name: "blue heart" }, { emoji: "💛", name: "yellow heart" }],
];

const ACTIONS: Item[] = [
  { emoji: "👏", name: "clap" },
  { emoji: "👣", name: "stomp" },
  { emoji: "🙌", name: "hands up" },
];

// Cores with two or three elements: AB, AAB, ABB, ABC.
const CORES: Record<Diff, number[][]> = {
  1: [[0, 1]],
  2: [
    [0, 1],
    [0, 0, 1],
    [0, 1, 1],
    [0, 1, 2],
  ],
  3: [
    [0, 1, 2],
    [0, 0, 1],
    [0, 1, 1],
  ],
};

const CORE_WRONGS: Record<string, number[][]> = {
  "0,1": [
    [0, 0, 1],
    [0, 1, 1],
  ],
  "0,0,1": [
    [0, 1],
    [0, 1, 1],
  ],
  "0,1,1": [
    [0, 1],
    [0, 0, 1],
  ],
  "0,1,2": [
    [0, 1],
    [0, 2, 1],
  ],
};

const toOpt = (s: Item): Opt => ({ label: s.name, emoji: s.emoji });
const run = (core: number[], length: number) => Array.from({ length }, (_, i) => core[i % core.length]);
const sayCore = (set: Item[], core: number[]) => [...core, ...core].map((c) => set[c].name).join(", ");
const patternSet = () => shuffle(pick(PATTERN_SETS));

function whatNext(set: Item[], core: number[]): Question {
  const shown = core.length * 2 + randInt(0, core.length - 1);
  const seq = run(core, shown);
  const next = set[core[shown % core.length]];
  return textChoice(
    "What comes next?",
    toOpt(next),
    set.filter((s) => s !== next).map(toOpt),
    `Say it out loud: ${sayCore(set, core)}… What part repeats?`,
    { type: "emojiRow", items: seq.map((i) => set[i].emoji), showBlank: true },
  );
}

function whatMissing(set: Item[], core: number[]): Question {
  const seq = run(core, core.length * 3);
  const gap = randInt(1, seq.length - 2);
  const missing = set[seq[gap]];
  return textChoice(
    "Which one is missing?",
    toOpt(missing),
    set.filter((s) => s !== missing).map(toOpt),
    "Say the pattern out loud. What belongs in the ❔ spot?",
    { type: "emojiRow", items: seq.map((c, i) => (i === gap ? "❔" : set[c].emoji)) },
  );
}

function repeats(seq: number[]): boolean {
  for (let p = 1; p <= 4; p++) if (seq.every((x, i) => x === seq[i % p])) return true;
  return false;
}

function whichIsPattern(set: Item[], core: number[]): Question {
  const good = run(core, 6);
  const text = (s: number[]) => s.map((c) => set[c].emoji).join("");
  const wrongs: string[] = [];
  for (let tries = 0; tries < 60 && wrongs.length < 2; tries++) {
    const s = shuffle(good);
    if (!repeats(s) && !wrongs.includes(text(s))) wrongs.push(text(s));
  }
  // Fallbacks that never repeat: all the A's first, or all the A's last.
  const sorted = [...good].sort((a, b) => a - b);
  for (const s of [sorted, [...sorted].reverse()]) {
    if (wrongs.length < 2 && !wrongs.includes(text(s))) wrongs.push(text(s));
  }
  return textChoice(
    "Which one is a pattern?",
    text(good),
    wrongs,
    "A pattern repeats the same part again and again.",
  );
}

function whichPartRepeats(set: Item[], core: number[]): Question {
  const show = (c: number[]) => c.map((i) => set[i].emoji).join(" ");
  return textChoice(
    "Which part repeats?",
    show(core),
    CORE_WRONGS[core.join(",")].map(show),
    "Find where the pattern starts again. The part before that repeats!",
    { type: "emojiRow", items: run(core, core.length * 3).map((i) => set[i].emoji) },
  );
}

function samePattern(core: number[]): Question {
  const [top, bottom] = sample(PATTERN_SETS, 2).map((s) => shuffle(s));
  const others = sample(
    Object.keys(CORE_WRONGS)
      .map((k) => k.split(",").map(Number))
      .filter((c) => c.join(",") !== core.join(",")),
    2,
  );
  const row = (set: Item[], c: number[]) => run(c, 6).map((i) => set[i].emoji).join("");
  const letters = [core, core].map((c) => c.map((i) => "ABC"[i]).join(" ")).join(", ");
  return textChoice(
    "Which one has the same pattern?",
    row(bottom, core),
    others.map((c) => row(bottom, c)),
    `This pattern goes ${letters}. Find the one that goes the same way.`,
    { type: "emojiRow", items: run(core, 6).map((i) => top[i].emoji) },
  );
}

function actionPattern(d: Diff): Question {
  const set = shuffle(ACTIONS);
  const core = d === 1 ? [0, 1] : d === 2 ? pick([[0, 0, 1], [0, 1, 1]]) : [0, 1, 2];
  const shown = core.length * 2 + randInt(0, core.length - 1);
  const seq = run(core, shown);
  const next = set[core[shown % core.length]];
  const q = textChoice(
    "What do we do next?",
    toOpt(next),
    set.filter((s) => s !== next).map(toOpt),
    `Do it with your body: ${sayCore(set, core)}…`,
    { type: "emojiRow", items: seq.map((i) => set[i].emoji), showBlank: true },
  );
  q.speak = `${seq.map((i) => set[i].name).join(", ")}. What do we do next?`;
  return q;
}

function patterns({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const d = difficulty;
  const core = () => pick(CORES[d]);
  const nexts = Array.from({ length: d === 1 ? 5 : 4 }, () => whatNext(patternSet(), core()));
  const extra = d === 1 ? [] : d === 2 ? [whichPartRepeats(patternSet(), core())] : [samePattern(core())];
  return shuffle([
    ...nexts,
    whatMissing(patternSet(), core()),
    whichIsPattern(patternSet(), core()),
    actionPattern(d),
    ...extra,
  ]);
}

// ---------- Shapes & Sizes ----------

type KShape = "circle" | "square" | "triangle" | "rectangle" | "sphere" | "cube" | "cylinder" | "cone";

const BASIC: KShape[] = ["circle", "square", "triangle"];
const FLAT: KShape[] = ["circle", "square", "triangle", "rectangle"];
const SOLID: KShape[] = ["sphere", "cube", "cylinder", "cone"];
const LOOKALIKE: Record<string, KShape> = { sphere: "circle", cube: "square", cylinder: "rectangle", cone: "triangle" };

const SHAPE_HINT: Record<KShape, string> = {
  circle: "A circle is round all the way around. It has no corners.",
  square: "A square has 4 sides that are all the same length.",
  triangle: "A triangle has 3 sides and 3 corners.",
  rectangle: "A rectangle has 4 sides and 4 corners, like a door.",
  sphere: "A sphere is round all over, like a ball.",
  cube: "A cube is like a toy block. Every face is a square.",
  cylinder: "A cylinder is like a can. It has a flat circle at each end.",
  cone: "A cone has a circle at the bottom and a point at the top.",
};

const shapeOpt = (s: ShapeName): Opt => ({ label: s, shape: s });

function findShape(d: Diff): Question {
  let target: KShape;
  let wrong: KShape[];
  if (d === 1) {
    target = pick(BASIC);
    wrong = BASIC.filter((s) => s !== target);
  } else if (d === 2) {
    target = pick(FLAT);
    // A square is also a rectangle, so it is never a wrong answer for "rectangle".
    wrong = sample(
      FLAT.filter((s) => s !== target && !(target === "rectangle" && s === "square")),
      2,
    );
  } else {
    target = pick(SOLID);
    wrong = [LOOKALIKE[target], pick(SOLID.filter((s) => s !== target))];
  }
  return textChoice(`Tap the ${target}.`, shapeOpt(target), wrong.map(shapeOpt), SHAPE_HINT[target]);
}

interface ShapeFact {
  q: string;
  right: KShape;
  wrong: KShape[];
  hint: string;
}

const FACTS_EASY: ShapeFact[] = [
  { q: "Which shape has 3 sides?", right: "triangle", wrong: ["square", "circle"], hint: "Count the straight sides on each shape." },
  { q: "Which shape is round?", right: "circle", wrong: ["triangle", "square"], hint: "A round shape has no straight sides and no corners." },
  { q: "Which shape has 4 sides?", right: "square", wrong: ["triangle", "circle"], hint: "Count the straight sides on each shape." },
  { q: "Which shape has no corners?", right: "circle", wrong: ["square", "triangle"], hint: "A corner is where two sides meet. Which shape has none?" },
];

const FACTS_FLAT: ShapeFact[] = [
  { q: "Which shape has 3 corners?", right: "triangle", wrong: ["rectangle", "circle"], hint: "A corner is where two sides meet. Count them!" },
  { q: "Which shape has 4 sides that are all the same?", right: "square", wrong: ["rectangle", "triangle"], hint: "Look for 4 sides that are all the same length." },
  { q: "Which shape has 4 corners?", right: "rectangle", wrong: ["triangle", "circle"], hint: "A corner is where two sides meet. Count them!" },
];

const FACTS_SOLID: ShapeFact[] = [
  { q: "Which one cannot roll?", right: "cube", wrong: ["sphere", "cylinder"], hint: "Things with a round, curved side can roll. Which one is flat all over?" },
  { q: "Which one is round all over, like a ball?", right: "sphere", wrong: ["cylinder", "cone"], hint: "A ball is round everywhere, with no flat parts." },
  { q: "Which one has a point at the top?", right: "cone", wrong: ["cylinder", "sphere"], hint: "Look for the one that comes to a point, like a party hat." },
  { q: "Which one can stack and also roll?", right: "cylinder", wrong: ["sphere", "cube"], hint: "It needs flat ends for stacking and a curved side for rolling." },
  { q: "Which one has only square faces?", right: "cube", wrong: ["cylinder", "cone"], hint: "A cube is like a toy block. Every face is a square." },
];

function shapeFact(d: Diff): Question {
  const f = pick(d === 1 ? FACTS_EASY : d === 2 ? [...FACTS_EASY, ...FACTS_FLAT] : FACTS_SOLID);
  return textChoice(f.q, shapeOpt(f.right), f.wrong.map(shapeOpt), f.hint);
}

interface RealThing {
  thing: string;
  emoji: string;
  shape: KShape;
}

const REAL_FLAT: RealThing[] = [
  { thing: "clock", emoji: "🕒", shape: "circle" },
  { thing: "cookie", emoji: "🍪", shape: "circle" },
  { thing: "full moon", emoji: "🌕", shape: "circle" },
  { thing: "door", emoji: "🚪", shape: "rectangle" },
  { thing: "phone", emoji: "📱", shape: "rectangle" },
  { thing: "TV", emoji: "📺", shape: "rectangle" },
  { thing: "tent", emoji: "⛺", shape: "triangle" },
];

const REAL_SOLID: RealThing[] = [
  { thing: "ball", emoji: "⚽", shape: "sphere" },
  { thing: "orange", emoji: "🍊", shape: "sphere" },
  { thing: "can", emoji: "🥫", shape: "cylinder" },
  { thing: "drum", emoji: "🥁", shape: "cylinder" },
  { thing: "dice", emoji: "🎲", shape: "cube" },
  { thing: "ice cube", emoji: "🧊", shape: "cube" },
  { thing: "ice cream cone", emoji: "🍦", shape: "cone" },
];

function realShape(d: Diff): Question {
  const solid = d === 3 || (d === 2 && chance(0.5));
  const r = pick(solid ? REAL_SOLID : REAL_FLAT);
  const pool = solid ? SOLID : FLAT;
  const wrong = sample(
    pool.filter((s) => s !== r.shape && !(r.shape === "rectangle" && s === "square")),
    2,
  );
  return textChoice(
    `Which shape is like this ${r.thing}?`,
    shapeOpt(r.shape),
    wrong.map(shapeOpt),
    SHAPE_HINT[r.shape],
    { type: "emoji", emoji: r.emoji },
  );
}

const ROLL_SET: SortSet = {
  prompt: "Does it roll? Sort them.",
  hint: "Things with a round, curved side can roll. Things that are flat all over can't.",
  bins: [
    { id: "rolls", label: "Rolls", emoji: "🔄" },
    { id: "no", label: "Does not roll", emoji: "🛑" },
  ],
  items: [
    { label: "ball", emoji: "⚽", bin: "rolls" },
    { label: "orange", emoji: "🍊", bin: "rolls" },
    { label: "can", emoji: "🥫", bin: "rolls" },
    { label: "tomato", emoji: "🍅", bin: "rolls" },
    { label: "basketball", emoji: "🏀", bin: "rolls" },
    { label: "box", emoji: "📦", bin: "no" },
    { label: "book", emoji: "📕", bin: "no" },
    { label: "brick", emoji: "🧱", bin: "no" },
    { label: "gift", emoji: "🎁", bin: "no" },
    { label: "ice cube", emoji: "🧊", bin: "no" },
  ],
};

interface Sizer {
  more: string;
  less: string;
  most: string;
  least: string;
  hintMore: string;
  hintLess: string;
  /** Each set is ordered from smallest to largest. */
  sets: Row[][];
}

const SIZERS: Sizer[] = [
  {
    more: "Which is bigger?",
    less: "Which is smaller?",
    most: "Which is the biggest?",
    least: "Which is the smallest?",
    hintMore: "Think about how big each one is in real life.",
    hintLess: "Think about how big each one is in real life.",
    sets: [
      [{ label: "mouse", emoji: "🐭" }, { label: "dog", emoji: "🐶" }, { label: "elephant", emoji: "🐘" }],
      [{ label: "ladybug", emoji: "🐞" }, { label: "bunny", emoji: "🐰" }, { label: "horse", emoji: "🐴" }],
      [{ label: "strawberry", emoji: "🍓" }, { label: "apple", emoji: "🍎" }, { label: "watermelon", emoji: "🍉" }],
    ],
  },
  {
    more: "Which is taller?",
    less: "Which is shorter?",
    most: "Which is the tallest?",
    least: "Which is the shortest?",
    hintMore: "Picture them standing side by side. Which one reaches up highest?",
    hintLess: "Picture them standing side by side. Which one stays lowest?",
    sets: [
      [{ label: "cat", emoji: "🐱" }, { label: "child", emoji: "🧒" }, { label: "giraffe", emoji: "🦒" }],
      [{ label: "tent", emoji: "⛺" }, { label: "house", emoji: "🏠" }, { label: "tall building", emoji: "🏢" }],
      [{ label: "mushroom", emoji: "🍄" }, { label: "sunflower", emoji: "🌻" }, { label: "tree", emoji: "🌳" }],
    ],
  },
  {
    more: "Which is longer?",
    less: "Which is shorter?",
    most: "Which is the longest?",
    least: "Which is the shortest?",
    hintMore: "Picture them lined up from the same starting spot. Which one reaches farthest?",
    hintLess: "Picture them lined up from the same starting spot. Which one stops first?",
    sets: [
      [{ label: "key", emoji: "🔑" }, { label: "spoon", emoji: "🥄" }, { label: "broom", emoji: "🧹" }],
      [{ label: "car", emoji: "🚗" }, { label: "bus", emoji: "🚌" }, { label: "train", emoji: "🚆" }],
    ],
  },
  {
    more: "Which is heavier?",
    less: "Which is lighter?",
    most: "Which is the heaviest?",
    least: "Which is the lightest?",
    hintMore: "Think about lifting each one. Which is hardest to lift?",
    hintLess: "Think about lifting each one. Which is easiest to lift?",
    sets: [
      [{ label: "balloon", emoji: "🎈" }, { label: "apple", emoji: "🍎" }, { label: "watermelon", emoji: "🍉" }],
      [{ label: "leaf", emoji: "🍃" }, { label: "book", emoji: "📕" }, { label: "car", emoji: "🚗" }],
      [{ label: "mouse", emoji: "🐭" }, { label: "cat", emoji: "🐱" }, { label: "horse", emoji: "🐴" }],
    ],
  },
  {
    more: "Which holds more water?",
    less: "Which holds less water?",
    most: "Which holds the most water?",
    least: "Which holds the least water?",
    hintMore: "Think about filling each one with water. Which needs the most to fill?",
    hintLess: "Think about filling each one with water. Which fills up fastest?",
    sets: [
      [{ label: "spoon", emoji: "🥄" }, { label: "cup", emoji: "☕" }, { label: "bathtub", emoji: "🛁" }],
      [{ label: "cup", emoji: "☕" }, { label: "pot", emoji: "🍲" }, { label: "bathtub", emoji: "🛁" }],
      [{ label: "spoon", emoji: "🥄" }, { label: "bowl", emoji: "🥣" }, { label: "bathtub", emoji: "🛁" }],
    ],
  },
];

function compareReal(d: Diff, s: Sizer): Question {
  const set = pick(s.sets);
  const less = chance(d === 3 ? 0.6 : 0.4);
  const options = d === 1 ? [set[0], set[set.length - 1]] : set;
  const target = less ? options[0] : options[options.length - 1];
  const prompt = d === 1 ? (less ? s.less : s.more) : less ? s.least : s.most;
  return textChoice(
    prompt,
    target,
    options.filter((o) => o !== target),
    less ? s.hintLess : s.hintMore,
  );
}

function trainLength(d: Diff): Question {
  const train = (n: number) => "🚂" + "🚃".repeat(n);
  const hint = "Count the cars on each train. More cars make a longer train.";
  if (d === 1) {
    const a = randInt(1, 5);
    let b: number;
    do b = randInt(1, 5);
    while (Math.abs(a - b) < 2);
    return textChoice("Which train is longer?", train(Math.max(a, b)), [train(Math.min(a, b))], hint);
  }
  let counts: number[];
  if (d === 2) {
    counts = sample(range(1, 5), 3);
  } else {
    const base = randInt(1, 3);
    counts = [base, base + 1, base + 2];
  }
  const longest = chance(0.5);
  const sorted = [...counts].sort((x, y) => x - y);
  const ans = longest ? sorted[2] : sorted[0];
  return textChoice(
    `Which train is the ${longest ? "longest" : "shortest"}?`,
    train(ans),
    counts.filter((c) => c !== ans).map(train),
    longest ? hint : "Count the cars on each train. Fewer cars make a shorter train.",
  );
}

function shapesAndSizes({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const d = difficulty;
  return shuffle([
    findShape(d),
    shapeFact(d),
    realShape(d),
    sortQuestion(ROLL_SET, d === 1 ? 2 : 3),
    ...sample(SIZERS, 3).map((s) => compareReal(d, s)),
    trainLength(d),
  ]);
}

// ---------- Coins ----------

const COIN_LIST = [5, 10, 25, 100, 200];
const SILVER = [5, 10, 25];
const coinOpt = (c: number): Opt => ({ label: COIN_NAMES[c], coin: c });

const COIN_HINT: Record<number, string> = {
  5: "A nickel is silver and has a beaver on it.",
  10: "A dime is the smallest coin. It is silver and has a sailing ship on it.",
  25: "A quarter is a big silver coin with a caribou on it.",
  100: "A loonie is gold and has 11 sides. It has a loon on it.",
  200: "A toonie has two colours: silver on the outside and gold in the middle.",
};

function nameCoin(d: Diff, c: number): Question {
  let others: number[];
  if (d === 3) {
    // Harder: tell apart coins that look alike.
    others = SILVER.includes(c) ? SILVER.filter((x) => x !== c) : [c === 100 ? 200 : 100, pick(SILVER)];
  } else {
    others = sample(
      COIN_LIST.filter((x) => x !== c),
      2,
    );
  }
  return textChoice(
    "What is this coin called?",
    COIN_NAMES[c],
    others.map((o) => COIN_NAMES[o]),
    COIN_HINT[c],
    { type: "coins", coins: [c] },
  );
}

function coinSize(d: Diff): Question {
  const biggest = chance(0.5);
  let options: number[];
  if (biggest) options = d === 1 ? [200, 10, 5] : d === 2 ? [200, ...sample(SILVER, 2)] : [200, 100, 25];
  else options = d === 1 ? [10, 100, 200] : d === 2 ? [10, 25, 100] : [10, 5, 25];
  return textChoice(
    `Which coin is the ${biggest ? "biggest" : "smallest"}?`,
    coinOpt(options[0]),
    options.slice(1).map(coinOpt),
    biggest
      ? "The toonie is the biggest coin. Look at the size, not the number on it."
      : "The dime is the smallest coin, even smaller than the nickel!",
  );
}

function coinColour(d: Diff): Question {
  const kind = d === 3 ? pick(["gold", "two", "sides"] as const) : pick(["gold", "two"] as const);
  if (kind === "gold") {
    return textChoice(
      "Which coin is gold in colour?",
      coinOpt(100),
      sample(SILVER, 2).map(coinOpt),
      "The loonie is gold. The nickel, dime and quarter are silver.",
    );
  }
  if (kind === "two") {
    return textChoice(
      "Which coin has two colours?",
      coinOpt(200),
      [coinOpt(100), coinOpt(pick(SILVER))],
      "The toonie is silver on the outside and gold in the middle.",
    );
  }
  return textChoice(
    "Which coin has 11 flat sides?",
    coinOpt(100),
    [coinOpt(200), coinOpt(25)],
    "Look at the edges. The loonie has 11 sides. The others are round.",
  );
}

const COIN_PICTURES: { coin: number; what: string; emoji?: string; caption?: string; hint: string }[] = [
  { coin: 5, what: "a beaver", hint: "The nickel has a beaver on it." },
  { coin: 10, what: "a sailing ship", emoji: "⛵", caption: "sailing ship", hint: "The dime has a sailing ship on it." },
  { coin: 25, what: "a caribou", emoji: "🦌", caption: "caribou", hint: "The quarter has a caribou on it." },
  { coin: 100, what: "a loon", emoji: "🐦", caption: "loon", hint: "The loonie has a loon bird on it. That's how it got its name!" },
  { coin: 200, what: "a polar bear", hint: "The toonie has a polar bear on it." },
];

function coinPicture(): Question {
  const p = pick(COIN_PICTURES);
  return textChoice(
    `Which coin has ${p.what} on it?`,
    coinOpt(p.coin),
    sample(
      COIN_LIST.filter((c) => c !== p.coin),
      2,
    ).map(coinOpt),
    p.hint,
    p.emoji ? { type: "emoji", emoji: p.emoji, caption: p.caption } : undefined,
  );
}

function whichIsCoin(): Question {
  return textChoice(
    "Which one is a coin?",
    coinOpt(pick(COIN_LIST)),
    sample(
      [
        { label: "button", emoji: "🔘" },
        { label: "cookie", emoji: "🍪" },
        { label: "sticker", emoji: "⭐" },
      ],
      2,
    ),
    "Coins are money made of metal. We use them to buy things.",
  );
}

const ROLE_PLAY: BankItem[] = [
  {
    prompt: "At the store, what do we use to pay?",
    right: { label: "money", emoji: "💵" },
    wrong: [
      { label: "leaves", emoji: "🍃" },
      { label: "crayons", emoji: "🖍️" },
    ],
    hint: "Stores give us things, and we give them money.",
    emoji: "🏪",
  },
  {
    prompt: "Where can you keep your coins safe?",
    right: { label: "piggy bank", emoji: "🐷" },
    wrong: [
      { label: "in the grass", emoji: "🌱" },
      { label: "in a puddle", emoji: "💧" },
    ],
    hint: "A piggy bank keeps money safe until you need it.",
  },
  {
    prompt: "You play store and want a toy. What do you do?",
    right: { label: "pay for it", emoji: "💵" },
    wrong: [
      { label: "just take it", emoji: "🏃" },
      { label: "hide it", emoji: "🙈" },
    ],
    hint: "At a store, we pay before we take things home.",
    emoji: "🧸",
  },
  {
    prompt: "Who do you pay at the store?",
    right: { label: "the cashier", emoji: "🧾" },
    wrong: [
      { label: "another shopper", emoji: "🛒" },
      { label: "the bus driver", emoji: "🚌" },
    ],
    hint: "The cashier works at the store. They take the money and give you your things.",
    emoji: "🏪",
  },
  {
    prompt: "Which coin has a polar bear on it?",
    right: { label: "toonie", coin: 200 },
    wrong: [
      { label: "dime", coin: 10 },
      { label: "nickel", coin: 5 },
    ],
    hint: "The toonie is the big coin with a polar bear on it.",
  },
  {
    prompt: "Which coin is silver and the smallest?",
    right: { label: "dime", coin: 10 },
    wrong: [
      { label: "quarter", coin: 25 },
      { label: "toonie", coin: 200 },
    ],
    hint: "The dime is silver and the smallest coin of all.",
  },
  {
    prompt: "Which coin has a loon bird on it?",
    right: { label: "loonie", coin: 100 },
    wrong: [
      { label: "nickel", coin: 5 },
      { label: "quarter", coin: 25 },
    ],
    hint: "The loonie is gold and has a loon on it.",
    emoji: "🐦",
  },
  {
    prompt: "Which coin has a sailing ship on it?",
    right: { label: "dime", coin: 10 },
    wrong: [
      { label: "loonie", coin: 100 },
      { label: "quarter", coin: 25 },
    ],
    hint: "Look for the little ship. It is on the dime.",
    emoji: "⛵",
  },
  {
    prompt: "Which coin has a caribou on it?",
    right: { label: "quarter", coin: 25 },
    wrong: [
      { label: "dime", coin: 10 },
      { label: "toonie", coin: 200 },
    ],
    hint: "The quarter is a big silver coin with a caribou.",
    emoji: "🦌",
  },
  {
    prompt: "Which coin has a beaver on it?",
    right: { label: "nickel", coin: 5 },
    wrong: [
      { label: "loonie", coin: 100 },
      { label: "toonie", coin: 200 },
    ],
    hint: "The nickel is silver with a busy beaver on it.",
  },
  {
    prompt: "Which one do you need to pay at a store?",
    right: { label: "coins", emoji: "🪙" },
    wrong: [
      { label: "a spoon", emoji: "🥄" },
      { label: "a sock", emoji: "🧦" },
    ],
    hint: "We pay with money. Coins are one kind of money.",
  },
  {
    prompt: "Your coin rolls under the table. What do you do?",
    right: { label: "pick it up", emoji: "🪙" },
    wrong: [
      { label: "leave it there", emoji: "🙈" },
      { label: "throw it away", emoji: "🗑️" },
    ],
    hint: "Money is worth keeping. Pick it up and put it somewhere safe.",
  },
  {
    prompt: "Which coin is gold and has 11 sides?",
    right: { label: "loonie", coin: 100 },
    wrong: [
      { label: "dime", coin: 10 },
      { label: "nickel", coin: 5 },
    ],
    hint: "The loonie is gold. Its edge has 11 sides.",
  },
  {
    prompt: "Which coin has two colours?",
    right: { label: "toonie", coin: 200 },
    wrong: [
      { label: "nickel", coin: 5 },
      { label: "dime", coin: 10 },
    ],
    hint: "The toonie is silver on the outside and gold in the middle.",
  },
  {
    prompt: "Who might give you coins for a piggy bank?",
    right: { label: "a grown-up", emoji: "🧑" },
    wrong: [
      { label: "a tree", emoji: "🌳" },
      { label: "a cloud", emoji: "☁️" },
    ],
    hint: "Grown-ups can give us money, like for a birthday or for helping out.",
    emoji: "🐷",
  },
];

function coins({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const d = difficulty;
  const [c1, c2] = sample(COIN_LIST, 2);
  return shuffle([
    nameCoin(d, c1),
    nameCoin(d, c2),
    coinSize(d),
    coinColour(d),
    coinPicture(),
    whichIsCoin(),
    ...fromBank(ROLE_PLAY, 2),
  ]);
}

// ---------- Likely or Unlikely ----------

interface LifeEvent {
  text: string;
  short: string;
  emoji: string;
}

const LIKELY: LifeEvent[] = [
  { text: "You will eat food today.", short: "eat food", emoji: "🍽️" },
  { text: "You will sleep tonight.", short: "sleep tonight", emoji: "😴" },
  { text: "It will be dark tonight.", short: "dark tonight", emoji: "🌙" },
  { text: "You will see a bird outside.", short: "see a bird", emoji: "🐦" },
  { text: "You will drink water today.", short: "drink water", emoji: "💧" },
  { text: "You will put on shoes to go outside.", short: "put on shoes", emoji: "👟" },
  { text: "It will be cold in winter.", short: "cold in winter", emoji: "⛄" },
  { text: "You will brush your teeth tonight.", short: "brush your teeth", emoji: "🦷" },
  { text: "You will hear someone laugh today.", short: "hear a laugh", emoji: "😂" },
];

const UNLIKELY: LifeEvent[] = [
  { text: "It will snow on a hot summer day.", short: "snow in summer", emoji: "☃️" },
  { text: "You will see a whale at the park.", short: "a whale at the park", emoji: "🐋" },
  { text: "A cow will come to your class.", short: "a cow in class", emoji: "🐄" },
  { text: "You will eat ice cream for breakfast.", short: "ice cream for breakfast", emoji: "🍦" },
  { text: "A penguin will ride your school bus.", short: "a penguin on the bus", emoji: "🐧" },
  { text: "You will fly to the moon today.", short: "fly to the moon", emoji: "🚀" },
  { text: "Your teacher will wear a crown.", short: "teacher in a crown", emoji: "👑" },
  { text: "It will rain inside your house.", short: "rain inside", emoji: "☔" },
  { text: "A frog will hop into your lunch box.", short: "a frog in your lunch", emoji: "🐸" },
];

function likelyOrNot(e: LifeEvent, likely: boolean): Question {
  return {
    kind: "choice",
    prompt: e.text,
    speak: `${e.text} Is that likely or unlikely?`,
    hint: "Likely means it will probably happen. Unlikely means it probably won't.",
    visual: { type: "emoji", emoji: e.emoji, caption: "Likely or unlikely?" },
    answer: likely ? "likely" : "unlikely",
    choices: [
      { id: "likely", label: "likely", emoji: "👍" },
      { id: "unlikely", label: "unlikely", emoji: "👎" },
    ],
  };
}

const eventOpt = (e: LifeEvent): Opt => ({ label: e.short, emoji: e.emoji });

function compareLikely(d: Diff, likely: LifeEvent[], unlikely: LifeEvent[]): Question {
  if (d === 3 && chance(0.5)) {
    return textChoice(
      "Which is least likely to happen?",
      eventOpt(unlikely[0]),
      likely.slice(0, 2).map(eventOpt),
      "Think about which one almost never happens.",
    );
  }
  return textChoice(
    d === 1 ? "Which is more likely to happen?" : "Which is most likely to happen?",
    eventOpt(likely[0]),
    unlikely.slice(0, d === 1 ? 1 : 2).map(eventOpt),
    "Think about which one happens a lot.",
  );
}

const MARBLES: Opt[] = [
  { label: "red", emoji: "🔴" },
  { label: "blue", emoji: "🔵" },
  { label: "green", emoji: "🟢" },
  { label: "yellow", emoji: "🟡" },
];

function marbleBag(d: Diff): Question {
  // The first count is always the biggest.
  const counts =
    d === 1
      ? pick([[5, 1], [4, 1], [6, 1]])
      : d === 2
        ? pick([[5, 2], [4, 1, 1], [5, 1, 2]])
        : pick([[4, 2, 1], [3, 2, 1], [5, 3, 1], [4, 3, 2]]);
  const colours = sample(MARBLES, counts.length);
  return textChoice(
    "You pick one without looking. Which colour will you most likely get?",
    colours[0],
    colours.slice(1),
    "The colour with the most in the bag is the most likely to be picked.",
    { type: "emojiRow", items: shuffle(colours.flatMap((c, i) => rep(c.emoji!, counts[i]))) },
  );
}

function likelyUnlikely({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const d = difficulty;
  const likely = shuffle(LIKELY);
  const unlikely = shuffle(UNLIKELY);
  const singles = [
    likelyOrNot(likely[0], true),
    likelyOrNot(likely[1], true),
    likelyOrNot(unlikely[0], false),
    likelyOrNot(unlikely[1], false),
  ];
  if (d === 1) singles.push(chance(0.5) ? likelyOrNot(likely[2], true) : likelyOrNot(unlikely[2], false));
  const compares = Array.from({ length: d === 1 ? 2 : 3 }, (_, i) =>
    compareLikely(d, likely.slice(3 + i * 2, 5 + i * 2), unlikely.slice(3 + i * 2, 5 + i * 2)),
  );
  return shuffle([...singles, ...compares, marbleBag(d)]);
}

// ---------- Course ----------

export const course: Course = {
  grade: "k",
  subject: "math",
  bigIdeas: {
    "ca-bc": [
      "Numbers represent quantities that can be decomposed into smaller parts.",
      "One-to-one correspondence and a sense of 5 and 10 are essential for fluency with numbers.",
      "Repeating elements in patterns can be identified.",
      "Objects have attributes that can be described, measured, and compared.",
      "Familiar events can be described as likely or unlikely and compared.",
    ],
  },
  units: [
    {
      id: "count-to-10",
      title: "Count to 10",
      emoji: "🔢",
      blurb: "Count things up to 10",
      standards: { "ca-bc": "Number concepts to 10" },
      parentNote:
        "Counting objects one at a time, matching numbers to amounts, counting on and back, putting numbers in order, and knowing that nothing is zero.",
      generate: countTo10,
    },
    {
      id: "make-5-and-10",
      title: "Make 5 and 10",
      emoji: "✋",
      blurb: "Fill frames to 5 and 10",
      standards: { "ca-bc": "Ways to make 5; decomposition of numbers to 10" },
      parentNote:
        "Using 5 and 10 as anchors (fingers, five and ten frames), finding how many more make 5 or 10, and breaking numbers into two parts.",
      generate: makeFiveTen,
    },
    {
      id: "add-and-take-away",
      title: "Add & Take Away",
      emoji: "➕",
      blurb: "Join and take away",
      standards: { "ca-bc": "Change in quantity to 10, using concrete materials" },
      parentNote:
        "Small story problems where some join or some leave (totals to 10), plus finding one more and one less.",
      generate: addTakeAway,
    },
    {
      id: "more-less-same",
      title: "More, Less, Same",
      emoji: "⚖️",
      blurb: "Compare groups and balance",
      standards: {
        "ca-bc":
          "Equality as a balance and inequality as an imbalance; concrete graphs, using one-to-one correspondence",
      },
      parentNote:
        "Comparing groups by matching them one to one, seeing equal as balanced and unequal as unbalanced on a scale, and reading simple picture graphs.",
      generate: moreLessSame,
    },
    {
      id: "patterns",
      title: "Patterns",
      emoji: "🔁",
      blurb: "What comes next?",
      standards: { "ca-bc": "Repeating patterns with two or three elements" },
      parentNote:
        "Spotting the part that repeats in patterns like AB, AAB, ABB and ABC, then predicting what comes next or what is missing.",
      generate: patterns,
    },
    {
      id: "shapes-and-sizes",
      title: "Shapes & Sizes",
      emoji: "🔷",
      blurb: "Shapes, big and small",
      standards: {
        "ca-bc":
          "Single attributes of 2D shapes and 3D objects; direct comparative measurement (e.g., linear, mass, capacity)",
      },
      parentNote:
        "Naming flat shapes and solid objects by one feature (sides, corners, rolls or not), and comparing things by size, height, length, weight and how much they hold.",
      generate: shapesAndSizes,
    },
    {
      id: "coins",
      title: "Coins",
      emoji: "🪙",
      blurb: "Get to know our coins",
      standards: { "ca-bc": "Financial literacy: attributes of coins, and financial role-play" },
      parentNote:
        "Recognizing the nickel, dime, quarter, loonie and toonie by colour, size and picture (values come in Grade 1), and playing store.",
      generate: coins,
    },
    {
      id: "likely-or-unlikely",
      title: "Likely or Unlikely",
      emoji: "🎲",
      blurb: "Will it happen?",
      standards: { "ca-bc": "Likelihood of familiar life events" },
      parentNote:
        "Describing everyday events as likely or unlikely, and comparing which of two or three things is more likely.",
      generate: likelyUnlikely,
    },
  ],
};
