import { COIN_NAMES } from "../money";
import { numberChoice, pick, randInt, sample, shuffle, textChoice } from "../random";
import type { BuildQuestion, ChoiceQuestion, CoinsQuestion, GenerateOptions, OrderQuestion, Question, SortQuestion } from "../types";
import { buildSet, eq, levelOf, NAMES, on, ordinal, range, THINGS, times, typeIn } from "./kit";
import type { Unit } from "../types";

// Ontario Grade 1 mathematics (2020 curriculum). Whole numbers go up to 50.

const choice = (prompt: string, answer: number, hint: string, visual?: ChoiceQuestion["visual"], max = 50): ChoiceQuestion =>
  numberChoice(prompt, answer, hint, visual, { min: 0, max });

// ---------- Numbers to 50 ----------

function numbersTo50(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const hi = d === 1 ? 20 : 50;
  const readBlocks = (): Question => {
    const n = randInt(11, hi);
    return choice("What number is shown?", n, "Count the tens first, then the ones.", { type: "blocks", tens: Math.floor(n / 10), ones: n % 10 }, 50);
  };
  const build = (): BuildQuestion => {
    const target = randInt(12, hi);
    return { kind: "build", prompt: `Build the number ${target}.`, hint: `${target} is ${Math.floor(target / 10)} tens and ${target % 10} ones.`, target };
  };
  const skip = (): Question => {
    const by = d === 1 ? pick([2, 10]) : pick([2, 5, 10]);
    const start = by === 10 ? 0 : by * randInt(0, 3);
    const seq = [0, 1, 2, 3].map((i) => start + by * i);
    const answer = start + by * 4;
    if (answer > 50) return build();
    return choice(`Count by ${by}s: ${seq.join(", ")}, ?`, answer, `Each number is ${by} more than the one before it.`);
  };
  const compare = (): Question => {
    const nums = sample(range(10, hi), 3);
    const most = nums.length && randInt(0, 1) === 1;
    const answer = most ? Math.max(...nums) : Math.min(...nums);
    return textChoice(`Which number is the ${most ? "greatest" : "least"}?`, String(answer), nums.filter((n) => n !== answer).map(String), "Compare the tens first. If they match, compare the ones.");
  };
  const order = (): OrderQuestion => {
    const nums = sample(range(5, hi), 4).sort((a, b) => a - b);
    return { kind: "order", prompt: "Tap the numbers from smallest to biggest.", hint: `Start with the smallest number, ${nums[0]}.`, items: nums.map((n) => ({ id: String(n), label: String(n) })) };
  };
  const decompose = (): Question => {
    const n = randInt(12, hi);
    return choice(`${n} is ${Math.floor(n / 10)} tens and how many ones?`, n % 10, "Take away the tens. What is left over is the ones.", { type: "blocks", tens: Math.floor(n / 10), ones: n % 10 }, 9);
  };
  const dots = (): Question => {
    const t = pick(THINGS);
    const n = randInt(11, Math.min(hi, 30));
    const q = choice(`How many ${t.emoji}?`, n, "Group them in tens to count faster.", { type: "dots", count: n, emoji: t.emoji }, 30);
    q.speak = `How many ${t.word}?`;
    return q;
  };
  return buildSet([readBlocks, readBlocks, build, skip, skip, compare, order, d === 1 ? dots : decompose]);
}

// ---------- Adding and subtracting to 50 ----------

function addSubtract50(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const top = d === 1 ? 30 : 50;
  const add = (): Question => {
    const a = randInt(10, top - 9);
    const b = randInt(2, Math.min(9, top - a));
    return choice(`What is ${a} + ${b}?`, a + b, "Add the ones. If you get 10 or more, make a new ten.", eq(`${a} + ${b} = ?`));
  };
  const take = (): Question => {
    const a = randInt(14, top);
    const b = randInt(2, 9);
    return choice(`What is ${a} − ${b}?`, a - b, "Count back, or think: what plus " + b + " makes " + a + "?", eq(`${a} − ${b} = ?`));
  };
  const tens = (): Question => {
    const a = randInt(1, 3) * 10 + randInt(0, 9);
    const sub = randInt(0, 1) === 1 && a >= 20;
    return choice(`What is ${a} ${sub ? "−" : "+"} 10?`, sub ? a - 10 : a + 10, "Adding or taking away 10 changes the tens digit by 1.", eq(`${a} ${sub ? "−" : "+"} 10 = ?`));
  };
  const typed = (): Question => {
    const a = randInt(10, top - 10);
    const b = randInt(3, 9);
    return typeIn(`What is ${a} + ${b}?`, a + b, "Add the ones. Make a new ten if you need to.", eq(`${a} + ${b} = ?`));
  };
  const story = (): Question => {
    const name = pick(NAMES);
    const t = pick(THINGS);
    const a = randInt(12, top - 8);
    const b = randInt(3, 8);
    const plus = randInt(0, 1) === 1;
    const q = choice(
      plus ? `${name} has ${a} ${t.emoji}. ${name} gets ${b} more. How many now?` : `${name} has ${a} ${t.emoji}. ${b} are given away. How many are left?`,
      plus ? a + b : a - b,
      plus ? "Getting more means adding." : "Giving away means taking away.",
      eq(plus ? `${a} + ${b} = ?` : `${a} − ${b} = ?`),
    );
    q.speak = plus ? `${name} has ${a} ${t.word}. ${name} gets ${b} more. How many now?` : `${name} has ${a} ${t.word}. ${b} are given away. How many are left?`;
    return q;
  };
  const related = (): Question => {
    const a = randInt(10, 30);
    const b = randInt(4, 15);
    return choice(`${a} + ${b} = ${a + b}. So ${a + b} − ${b} = ?`, a, "Adding and taking away undo each other.", undefined);
  };
  const missing = (): Question => {
    const a = randInt(10, top - 10);
    const b = randInt(3, 9);
    return choice("What number is missing?", b, "Think: what do you add to the first number to get the total?", eq(`${a} + ☐ = ${a + b}`), 12);
  };
  return buildSet([add, add, take, take, tens, d === 1 ? story : typed, story, d === 3 ? related : missing]);
}

// ---------- Fair shares and equal groups ----------

function fairShares(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const share = (): Question => {
    const sharers = d === 1 ? 2 : pick([2, 4]);
    const each = randInt(2, 4);
    const t = pick(THINGS);
    const q = choice(`${sharers * each} ${t.emoji} are shared fairly by ${sharers} friends. How many does each get?`, each, "Deal them out one at a time, like cards, until none are left.", { type: "dots", count: sharers * each, emoji: t.emoji }, 10);
    q.speak = `${sharers * each} ${t.word} are shared fairly by ${sharers} friends. How many does each get?`;
    return q;
  };
  const leftover = (): Question => {
    const sharers = pick([2, 4]);
    const each = randInt(1, 2);
    const left = randInt(1, Math.min(2, sharers - 1));
    const t = pick(THINGS);
    const total = sharers * each + left;
    const q = choice(`${total} ${t.emoji} are shared by ${sharers} friends. How many are left over?`, left, "Share fairly. The ones you can't share equally are left over.", { type: "dots", count: total, emoji: t.emoji }, 4);
    q.speak = `${total} ${t.word} are shared by ${sharers} friends. How many are left over?`;
    return q;
  };
  const part = (): Question => {
    const den = pick([2, 4] as const);
    const names = { 2: "one half", 4: "one fourth" } as const;
    return textChoice("What part of the whole is shaded?", names[den], den === 2 ? ["one fourth", "one third"] : ["one half", "one third"], den === 2 ? "The whole is cut into 2 equal parts. One part is shaded." : "The whole is cut into 4 equal parts. One part is shaded.", { type: "fraction", numerator: 1, denominator: den, shape: pick(["bar", "circle"] as const) });
  };
  const halfFourths = (): Question =>
    textChoice("Which is the same amount as one half?", "two fourths", ["one fourth", "three fourths"], "Two fourths fill the same space as one half.", { type: "fraction", numerator: 2, denominator: 4, shape: "circle" });
  const biggerPiece = (): Question => {
    const [a, b] = sample([2, 3, 4, 5, 6, 8], 2);
    const fewer = Math.min(a, b);
    const more = Math.max(a, b);
    return textChoice(`One pizza is shared fairly. Who gets a bigger piece: ${fewer} friends or ${more} friends?`, `${fewer} friends`, [`${more} friends`], "The more friends who share, the smaller each piece is.", { type: "emoji", emoji: "🍕" });
  };
  const groups = (): Question => {
    const g = randInt(2, 5);
    const each = randInt(2, Math.floor(10 / g));
    const t = pick(THINGS);
    const q = choice(`There are ${g} groups of ${each} ${t.emoji}. How many in all?`, g * each, "Count each group, then add them together.", { type: "array", rows: g, cols: each, emoji: t.emoji }, 10);
    q.speak = `There are ${g} groups of ${each} ${t.word}. How many in all?`;
    return q;
  };
  const halfGroup = (): Question => {
    const half = randInt(1, 4);
    return choice(`Half of the ${half * 2} ⭐ are red. How many are red?`, half, "Half means 2 equal groups. Share them into 2 equal groups.", { type: "dots", count: half * 2, emoji: "⭐" }, 8);
  };
  return buildSet([share, share, leftover, part, halfFourths, biggerPiece, groups, d === 1 ? halfGroup : groups]);
}

// ---------- Data and graphs ----------

const SORTS = [
  {
    prompt: "Sort the animals. Where do they live?",
    bins: [
      { id: "land", label: "Land", emoji: "🌳" },
      { id: "water", label: "Water", emoji: "🌊" },
    ],
    items: [
      { label: "dog", emoji: "🐶", bin: "land" },
      { label: "cow", emoji: "🐄", bin: "land" },
      { label: "rabbit", emoji: "🐰", bin: "land" },
      { label: "horse", emoji: "🐴", bin: "land" },
      { label: "fish", emoji: "🐟", bin: "water" },
      { label: "whale", emoji: "🐋", bin: "water" },
      { label: "octopus", emoji: "🐙", bin: "water" },
      { label: "crab", emoji: "🦀", bin: "water" },
    ],
  },
  {
    prompt: "Sort by colour.",
    bins: [
      { id: "red", label: "Red", emoji: "🔴" },
      { id: "blue", label: "Blue", emoji: "🔵" },
    ],
    items: [
      { label: "red circle", emoji: "🔴", bin: "red" },
      { label: "red heart", emoji: "❤️", bin: "red" },
      { label: "red square", emoji: "🟥", bin: "red" },
      { label: "apple", emoji: "🍎", bin: "red" },
      { label: "blue circle", emoji: "🔵", bin: "blue" },
      { label: "blue heart", emoji: "💙", bin: "blue" },
      { label: "blue square", emoji: "🟦", bin: "blue" },
      { label: "blue book", emoji: "📘", bin: "blue" },
    ],
  },
  {
    prompt: "Sort by shape.",
    bins: [
      { id: "round", label: "Round", emoji: "⚪" },
      { id: "square", label: "Square", emoji: "⬜" },
    ],
    items: [
      { label: "ball", emoji: "⚽", bin: "round" },
      { label: "sun", emoji: "🌞", bin: "round" },
      { label: "clock", emoji: "🕒", bin: "round" },
      { label: "moon", emoji: "🌕", bin: "round" },
      { label: "window", emoji: "🪟", bin: "square" },
      { label: "gift", emoji: "🎁", bin: "square" },
      { label: "box", emoji: "📦", bin: "square" },
      { label: "game board", emoji: "♟️", bin: "square" },
    ],
  },
] as const;

const GRAPH_TOPICS = [
  { title: "Our favourite fruit", items: [{ label: "apples", emoji: "🍎" }, { label: "bananas", emoji: "🍌" }, { label: "grapes", emoji: "🍇" }, { label: "oranges", emoji: "🍊" }] },
  { title: "Pets at home", items: [{ label: "dogs", emoji: "🐶" }, { label: "cats", emoji: "🐱" }, { label: "fish", emoji: "🐟" }, { label: "birds", emoji: "🐦" }] },
  { title: "How we get to school", items: [{ label: "walk", emoji: "🚶" }, { label: "bus", emoji: "🚌" }, { label: "bike", emoji: "🚲" }, { label: "car", emoji: "🚗" }] },
  { title: "Our favourite seasons", items: [{ label: "winter", emoji: "⛄" }, { label: "spring", emoji: "🌷" }, { label: "summer", emoji: "☀️" }, { label: "fall", emoji: "🍂" }] },
];

function distinctCounts(n: number, max: number): number[] {
  return sample(range(1, max), n);
}

function dataAndGraphs(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const setup = () => {
    const topic = pick(GRAPH_TOPICS);
    const picks = sample(topic.items, d === 1 ? 3 : 4);
    const counts = distinctCounts(picks.length, d === 1 ? 7 : 9);
    const rows = picks.map((p, i) => ({ ...p, value: counts[i] }));
    return { topic, rows };
  };
  const pictograph = (rows: { label: string; emoji: string; value: number }[], title: string) => ({
    type: "pictograph" as const,
    title,
    rows: rows.map((r) => ({ label: r.label, emoji: r.emoji, count: r.value })),
  });
  const most = (): Question => {
    const { topic, rows } = setup();
    const top = [...rows].sort((a, b) => b.value - a.value);
    const least = randInt(0, 1) === 1;
    const answer = least ? top[top.length - 1] : top[0];
    return textChoice(`Which has the ${least ? "fewest" : "most"}?`, answer.label, rows.filter((r) => r !== answer).map((r) => r.label), "Look for the longest row for most and the shortest row for fewest.", pictograph(rows, topic.title));
  };
  const howMany = (): Question => {
    const { topic, rows } = setup();
    const r = pick(rows);
    return choice(`How many chose ${r.label}?`, r.value, "Count the pictures in that row. Each picture is 1.", pictograph(rows, topic.title), 12);
  };
  const diff = (): Question => {
    const { topic, rows } = setup();
    const [a, b] = sample(rows, 2);
    const hi = a.value > b.value ? a : b;
    const lo = hi === a ? b : a;
    return choice(`How many more chose ${hi.label} than ${lo.label}?`, hi.value - lo.value, "Take away the smaller number from the bigger number.", pictograph(rows, topic.title), 12);
  };
  const orderCats = (): OrderQuestion => {
    const { topic, rows } = setup();
    const sorted = [...rows].sort((a, b) => b.value - a.value);
    return { kind: "order", prompt: "Tap the groups from the most to the fewest.", hint: `${sorted[0].label} has the most, so it goes first.`, visual: { type: "bars", title: topic.title, bars: rows.map((r) => ({ label: r.label, value: r.value, emoji: r.emoji })) }, items: sorted.map((r, i) => ({ id: `o${i}`, label: r.label, emoji: r.emoji })) };
  };
  const barRead = (): Question => {
    const { topic, rows } = setup();
    const r = pick(rows);
    return choice(`How many chose ${r.label}?`, r.value, "Follow the bar to its number.", { type: "bars", title: topic.title, bars: rows.map((x) => ({ label: x.label, value: x.value, emoji: x.emoji })) }, 12);
  };
  const sort = (): SortQuestion => {
    const set = pick(SORTS);
    const per = 2;
    const items = set.bins.flatMap((b) => sample(set.items.filter((i) => i.bin === b.id), per));
    return { kind: "sort", prompt: set.prompt, hint: "Look at each one and decide which basket it belongs in.", bins: set.bins.map((b) => ({ ...b })), items: shuffle(items).map((it, i) => ({ id: `s${i}`, ...it })) };
  };
  return buildSet([most, howMany, diff, orderCats, sort, barRead, d === 1 ? howMany : diff, d === 3 ? diff : most]);
}

// ---------- Impossible, possible, certain ----------

const EVENTS: { text: string; answer: "impossible" | "possible" | "certain"; emoji: string }[] = [
  { text: "The sun will rise tomorrow.", answer: "certain", emoji: "🌅" },
  { text: "A dog will bark today.", answer: "possible", emoji: "🐕" },
  { text: "You will grow wings tonight.", answer: "impossible", emoji: "🪽" },
  { text: "It will snow in Ontario this winter.", answer: "certain", emoji: "❄️" },
  { text: "You will see a friend at school tomorrow.", answer: "possible", emoji: "🧒" },
  { text: "A fish will ride a bike.", answer: "impossible", emoji: "🐟" },
  { text: "Tomorrow comes after today.", answer: "certain", emoji: "📅" },
  { text: "It will rain on your birthday.", answer: "possible", emoji: "🌧️" },
  { text: "A cow will jump over the real moon.", answer: "impossible", emoji: "🐄" },
  { text: "A coin you flip will land heads.", answer: "possible", emoji: "🪙" },
  { text: "Water will turn into a cookie.", answer: "impossible", emoji: "💧" },
  { text: "You will be one day older tomorrow.", answer: "certain", emoji: "🎂" },
];

const SPIN = [
  { name: "red", emoji: "🔴", hex: "#ef4444" },
  { name: "blue", emoji: "🔵", hex: "#3b82f6" },
  { name: "green", emoji: "🟢", hex: "#22c55e" },
  { name: "yellow", emoji: "🟡", hex: "#facc15" },
];

function possibleCertain(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const hints = {
    impossible: "Impossible means it can never happen.",
    possible: "Possible means it might happen, but it might not.",
    certain: "Certain means it will definitely happen.",
  };
  const event = (): Question => {
    const e = pick(EVENTS);
    return {
      kind: "choice",
      prompt: e.text,
      hint: hints[e.answer],
      visual: { type: "emoji", emoji: e.emoji, caption: "Impossible, possible or certain?" },
      answer: e.answer,
      choices: shuffle(["impossible", "possible", "certain"]).map((id) => ({ id, label: id })),
    };
  };
  const spinnerWord = (): Question => {
    const [a, b] = sample(SPIN, 2);
    const kind = pick(["certain", "impossible", "possible"] as const);
    const segments = kind === "certain" ? [a.hex, a.hex, a.hex, a.hex] : kind === "impossible" ? [a.hex, a.hex, a.hex, a.hex] : [a.hex, a.hex, b.hex, a.hex];
    const target = kind === "impossible" ? b : a;
    return {
      kind: "choice",
      prompt: `You spin the spinner. Will it land on ${target.name}?`,
      hint: kind === "possible" ? "More than one colour is on the spinner, so it might happen." : kind === "certain" ? "Every part is the same colour, so it will happen for sure." : `There is no ${b.name} on the spinner, so it can never happen.`,
      visual: { type: "spinner", segments },
      answer: kind,
      choices: shuffle(["impossible", "possible", "certain"]).map((id) => ({ id, label: id })),
    };
  };
  const mostLikely = (): Question => {
    const [main, o1, o2] = sample(SPIN, 3);
    const n = randInt(4, 6);
    const segments = shuffle([...Array(n).fill(main.hex), o1.hex, o2.hex]);
    return textChoice("Which colour will the spinner most likely land on?", { label: main.name, emoji: main.emoji }, [o1, o2].map((c) => ({ label: c.name, emoji: c.emoji })), "The colour with the most space is the one it will most likely land on.", { type: "spinner", segments });
  };
  const sameBag = (): Question => {
    const red = randInt(5, 8);
    const blue = randInt(1, 3);
    const emoji = shuffle([...Array(red).fill("🔴"), ...Array(blue).fill("🔵")]);
    return textChoice("You pick one without looking. What will you most likely get?", { label: "a red one", emoji: "🔴" }, [{ label: "a blue one", emoji: "🔵" }], "There are more red ones, so red is more likely.", { type: "emojiRow", items: emoji });
  };
  return buildSet([...times(d === 1 ? 3 : 2, event), spinnerWord, spinnerWord, mostLikely, sameBag, event, event].slice(0, 8));
}

// ---------- Calendar ----------

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const SEASON_OF: Record<string, string> = { December: "winter", January: "winter", February: "winter", March: "spring", April: "spring", May: "spring", June: "summer", July: "summer", August: "summer", September: "fall", October: "fall", November: "fall" };

function monthTable(startDay: number, days: number, marked: Record<number, string> = {}) {
  const cells: string[] = Array(startDay).fill("");
  for (let day = 1; day <= days; day++) cells.push(marked[day] ? `${marked[day]} ${day}` : String(day));
  while (cells.length % 7) cells.push("");
  const rows: string[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return { type: "table" as const, headers: DAYS, rows };
}

function calendar(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const dayOf = (): Question => {
    const start = randInt(0, 6);
    const days = pick([28, 30, 31]);
    const date = randInt(2, 27);
    const dow = (start + date - 1) % 7;
    return textChoice(`On this calendar, what day of the week is the ${ordinal(date)}?`, DAY_NAMES[dow], sample(DAY_NAMES.filter((_, i) => i !== dow), 3), "Find the date, then look up to the top of its column.", monthTable(start, days));
  };
  const daysInWeek = (): Question => choice("How many days are in one week?", 7, "Sunday, Monday, Tuesday, Wednesday, Thursday, Friday and Saturday.", undefined, 10);
  const monthsInYear = (): Question => choice("How many months are in one year?", 12, "Count from January to December.", undefined, 14);
  const monthAfter = (): Question => {
    const i = randInt(0, 10);
    return textChoice(`Which month comes right after ${MONTHS[i]}?`, MONTHS[i + 1], sample(MONTHS.filter((_, k) => k !== i + 1 && k !== i), 2), "Say the months in order: January, February, March…");
  };
  const season = (): Question => {
    const m = pick(MONTHS);
    const answer = SEASON_OF[m];
    return textChoice(`In Ontario, which season is ${m} in?`, answer, ["winter", "spring", "summer", "fall"].filter((s) => s !== answer).slice(0, 2), "Think about the weather and what the trees look like in that month.");
  };
  const holiday = (): Question => {
    const start = randInt(0, 6);
    const dayNumber = 1;
    const dow = (start + dayNumber - 1) % 7;
    return textChoice("Canada Day is on July 1. On this July calendar, what day is it?", DAY_NAMES[dow], sample(DAY_NAMES.filter((_, i) => i !== dow), 3), "Find the 🍁 on the calendar and look up to the top of its column.", monthTable(start, 31, { 1: "🍁" }));
  };
  const weeks = (): Question => {
    const start = randInt(0, 6);
    const date = randInt(2, 14);
    return choice(`Today is the ${ordinal(date)}. What date is it one week later?`, date + 7, "One week later is 7 days later. Move down one row on the calendar.", monthTable(start, 31), 31);
  };
  return buildSet([dayOf, daysInWeek, monthsInYear, monthAfter, monthAfter, season, d === 1 ? daysInWeek : holiday, d === 3 ? weeks : dayOf]);
}

// ---------- Where is it? ----------

const POSITIONS = [
  { emoji: "🐶", name: "dog" },
  { emoji: "🐱", name: "cat" },
  { emoji: "🐭", name: "mouse" },
  { emoji: "🐰", name: "rabbit" },
  { emoji: "🐸", name: "frog" },
];

function whereIsIt(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const between = (): Question => {
    const row = sample(POSITIONS, 3);
    return textChoice("Which animal is between the other two?", row[1].name, [row[0].name, row[2].name], "The one in the middle has an animal on each side.", { type: "emojiRow", items: row.map((r) => r.emoji) });
  };
  const rightOf = (): Question => {
    const row = sample(POSITIONS, 4);
    const i = randInt(0, 2);
    return textChoice(`Which animal is right next to the ${row[i].name}, on its right?`, row[i + 1].name, sample(row.filter((_, k) => k !== i && k !== i + 1), 2).map((r) => r.name), "Right is the side of your writing hand. Look to the right of the animal.", { type: "emojiRow", items: row.map((r) => r.emoji) });
  };
  const first = (): Question => {
    const row = sample(POSITIONS, 4);
    const last = randInt(0, 1) === 1;
    const answer = last ? row[3] : row[0];
    return textChoice(`Which animal is ${last ? "last" : "first"} in line?`, answer.name, row.filter((r) => r !== answer).slice(0, 2).map((r) => r.name), "The line starts on the left side.", { type: "emojiRow", items: row.map((r) => r.emoji) });
  };
  const word = (): Question => {
    const items = [
      { prompt: "A bird is on top of a tree. Is the bird above or below the tree?", right: "above", wrong: "below", emoji: "🌳" },
      { prompt: "A fish swims under a boat. Is the fish above or below the boat?", right: "below", wrong: "above", emoji: "⛵" },
      { prompt: "A ball is in front of a door. Is the ball in front or behind?", right: "in front", wrong: "behind", emoji: "🚪" },
      { prompt: "A dog hides behind a couch. Is the dog in front or behind?", right: "behind", wrong: "in front", emoji: "🛋️" },
      { prompt: "Your shoe is beside your other shoe. Is it beside or between?", right: "beside", wrong: "between", emoji: "👟" },
    ];
    const it = pick(items);
    return textChoice(it.prompt, it.right, [it.wrong], "Picture it in your mind and think about where each thing is.", { type: "emoji", emoji: it.emoji });
  };
  const steps = (): Question => {
    const sx = randInt(0, 2);
    const sy = randInt(0, 2);
    const dx = randInt(1, 2);
    const dy = d === 1 ? 0 : randInt(0, 2);
    const ex = sx + dx;
    const ey = sy + dy;
    const others = sample(
      [
        [ex + 1, ey],
        [ex, ey + 1],
        [sx, sy + dx],
        [sx + dy + 1, sy],
      ].filter(([x, y]) => (x !== ex || y !== ey) && (x !== sx || y !== sy) && x <= 5 && y <= 5),
      2,
    );
    const unique = [...new Map(others.map((p) => [p.join(","), p])).values()];
    if (unique.length < 2) return between();
    const labels = shuffle(["A", "B", "C"]);
    const points = [
      { x: sx, y: sy, label: "S" },
      { x: ex, y: ey, label: labels[0] },
      { x: unique[0][0], y: unique[0][1], label: labels[1] },
      { x: unique[1][0], y: unique[1][1], label: labels[2] },
    ];
    return textChoice(`Start at S. Go ${dx} to the right${dy ? ` and ${dy} up` : ""}. Where do you land?`, labels[0], [labels[1], labels[2]], "Move right first, then up. Count each step.", { type: "grid", size: 5, points });
  };
  return buildSet([between, between, rightOf, first, word, word, steps, d === 1 ? first : steps]);
}

// ---------- Money to $50 ----------

const bill = (c: number) => `$${c / 100}`;

function moneyTo50(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const coinsPool = [5, 10, 25];
  const dollarPool = [100, 200, 500, 1000, 2000, 5000];
  const value = (c: number) => (c >= 100 ? bill(c) : `${c}¢`);
  const name = (): Question => {
    const c = pick(d === 1 ? coinsPool : [...coinsPool, 100, 200]);
    return textChoice("What is this coin worth?", value(c), sample((d === 1 ? coinsPool : [...coinsPool, 100, 200]).filter((x) => x !== c), 2).map(value), `A ${COIN_NAMES[c]} is worth ${value(c)}.`, { type: "coins", coins: [c] });
  };
  const billWorth = (): Question => {
    const b = pick(dollarPool.slice(2, d === 1 ? 4 : 6));
    return textChoice("How many dollars is this bill worth?", bill(b), sample(dollarPool.slice(2).filter((x) => x !== b), 2).map(bill), `The ${COIN_NAMES[b]} is worth ${bill(b)}.`, { type: "coins", coins: [b] });
  };
  const compare = (): Question => {
    const pool = d === 1 ? coinsPool : [...coinsPool, 100, 200, 500, 1000, 2000, 5000];
    const [a, b] = sample(pool, 2);
    const hi = Math.max(a, b);
    const lo = Math.min(a, b);
    return textChoice("Which is worth more?", { label: COIN_NAMES[hi], coin: hi }, [{ label: COIN_NAMES[lo], coin: lo }], "Think about how many cents or dollars each one is worth.");
  };
  const count = (): Question => {
    const picks = sample([5, 10, 25], randInt(2, 3)).concat(randInt(0, 1) ? [5] : []);
    const total = picks.reduce((s, c) => s + c, 0);
    if (total > 50) return name();
    return textChoice("How much money is this?", `${total}¢`, [`${total + 5}¢`, `${total + 10}¢`], "Count the biggest coin first, then count on.", { type: "coins", coins: picks });
  };
  const make = (): CoinsQuestion => {
    const target = pick([15, 20, 30, 35, 40, 45, 50]);
    return { kind: "coins", prompt: `Show ${target}¢ with coins.`, hint: "Start with the biggest coin that fits, then add smaller coins.", target, coins: [5, 10, 25] };
  };
  const trade = (): Question => {
    const options = [
      { q: "How many nickels are the same as one dime?", a: 2, wrong: [1, 3, 5] },
      { q: "How many nickels are worth the same as one quarter?", a: 5, wrong: [2, 3, 4] },
      { q: "Two dimes and one nickel make how many cents?", a: 25, wrong: [15, 30, 35] },
    ];
    const o = pick(options);
    return textChoice(o.q, String(o.a), sample(o.wrong, 2).map(String), "A nickel is 5¢, a dime is 10¢ and a quarter is 25¢.");
  };
  return buildSet([name, name, billWorth, compare, compare, count, make, d === 1 ? trade : make]);
}

export const units: Unit[] = [
  {
    id: "numbers-to-50",
    title: "Numbers to 50",
    emoji: "🔢",
    blurb: "Count, build and compare",
    standards: on("B1.1–B1.5, C1.4", "reading, composing, comparing and counting whole numbers up to 50"),
    parentNote: "Tens and ones, counting by 2s, 5s and 10s, and comparing and ordering numbers up to 50.",
    generate: numbersTo50,
  },
  {
    id: "add-subtract-to-50",
    title: "Add & Subtract to 50",
    emoji: "➕",
    blurb: "Solve number stories",
    standards: on("B2.1, B2.4", "adding and subtracting whole numbers that add up to no more than 50"),
    parentNote: "Adding and taking away two-digit numbers (totals up to 50) in number stories and equations, and seeing that the two operations undo each other.",
    generate: addSubtract50,
  },
  {
    id: "fair-shares",
    title: "Fair Shares",
    emoji: "🍕",
    blurb: "Halves, fourths and equal groups",
    standards: on("B1.6–B1.8, B2.5", "fair sharing, halves and fourths, and equal groups"),
    parentNote: "Sharing things fairly among 2 or 4 people, what is left over, halves and fourths, and groups of equal size.",
    generate: fairShares,
  },
  {
    id: "data-and-graphs",
    title: "Data & Graphs",
    emoji: "📊",
    blurb: "Sort and read graphs",
    standards: on("D1.1–D1.5", "sorting, and reading concrete graphs and pictographs"),
    parentNote: "Sorting by one attribute, reading picture graphs and bar graphs, and comparing groups.",
    generate: dataAndGraphs,
  },
  {
    id: "possible-or-certain",
    title: "Impossible, Possible, Certain",
    emoji: "🎲",
    blurb: "How likely is it?",
    standards: on("D2.1", "describing likelihood as impossible, possible or certain"),
    parentNote: "Using the words impossible, possible and certain, and using spinners to say which colour is most likely.",
    generate: possibleCertain,
  },
  {
    id: "calendar",
    title: "The Calendar",
    emoji: "📅",
    blurb: "Days, weeks and months",
    standards: on("E2.3", "reading a calendar for days, weeks, months, holidays and seasons"),
    parentNote: "Reading a monthly calendar, naming the days and months in order, and knowing the seasons.",
    generate: calendar,
  },
  {
    id: "where-is-it",
    title: "Where Is It?",
    emoji: "🧭",
    blurb: "Left, right, above and below",
    standards: on("E1.4, E1.5", "describing where things are and following directions"),
    parentNote: "Using words like above, below, between, in front and behind, and following steps from one place to another.",
    generate: whereIsIt,
  },
  {
    id: "money-to-50",
    title: "Money to $50",
    emoji: "💵",
    blurb: "Coins and bills",
    standards: on("F1.1", "Canadian coins up to 50¢ and coins and bills up to $50, and comparing their values"),
    parentNote: "Knowing what each Canadian coin and bill is worth, counting small amounts and comparing values.",
    generate: moneyTo50,
  },
];
