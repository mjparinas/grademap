import { chance, pick, randInt, sample, shuffle, textChoice } from "../../random";
import type {
  Choice,
  ChoiceQuestion,
  CoinsQuestion,
  Course,
  InputQuestion,
  OrderQuestion,
  Question,
  ShapeName,
  Visual,
} from "../../types";

type Level = 1 | 2 | 3;
type Opt = string | Omit<Choice, "id">;

const NAMES = ["Maya", "Jay", "Sam", "Amir", "Lena", "Kenji", "Zoe", "Ravi", "Ana", "Noah", "Priya", "Leo"];

// ---------- Formatting ----------

/** A non-breaking space, so big numbers never wrap in the middle. */
const NB = "\u00A0";

/** Canadian (SI) style: 4-digit numbers stay plain, longer ones are grouped with spaces (345 678). */
function fmt(n: number): string {
  const s = String(Math.abs(n));
  const body = s.length <= 4 ? s : s.replace(/\B(?=(\d{3})+(?!\d))/g, NB);
  return n < 0 ? `−${body}` : body;
}

/** A decimal stored as a whole number of thousandths (2375 → "2.375"). */
function dec(th: number): string {
  const whole = Math.floor(th / 1000);
  const frac = th % 1000;
  if (!frac) return fmt(whole);
  return `${fmt(whole)}.${String(frac).padStart(3, "0").replace(/0+$/, "")}`;
}

/** Thousandths shown with a fixed number of decimal places (for rounding answers). */
function decFixed(th: number, places: number): string {
  const whole = Math.floor(th / 1000);
  if (places <= 0) return fmt(whole);
  return `${fmt(whole)}.${String(th % 1000).padStart(3, "0").slice(0, places)}`;
}

/** Cents as dollars and cents: 3255 → "$32.55". */
function cash(cents: number): string {
  return `$${fmt(Math.floor(cents / 100))}.${String(cents % 100).padStart(2, "0")}`;
}

/** Whole dollars: 45 → "$45". */
function dollars(d: number): string {
  return `$${fmt(d)}`;
}

/** Cents as a keypad answer: 3255 → "32.55". */
function cashAnswer(cents: number): string {
  return `${Math.floor(cents / 100)}.${String(cents % 100).padStart(2, "0")}`;
}

const SMALL_WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen",
];
const TENS_WORDS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function words999(n: number): string {
  const h = Math.floor(n / 100);
  const r = n % 100;
  const parts: string[] = [];
  if (h) parts.push(`${SMALL_WORDS[h]} hundred`);
  if (r) parts.push(r < 20 ? SMALL_WORDS[r] : TENS_WORDS[Math.floor(r / 10)] + (r % 10 ? `-${SMALL_WORDS[r % 10]}` : ""));
  return parts.join(" ");
}

/** Number words without "and", the way Canadian classrooms write them. */
function numberWords(n: number): string {
  if (n === 0) return "zero";
  if (n === 1000000) return "one million";
  const th = Math.floor(n / 1000);
  const r = n % 1000;
  return [th ? `${words999(th)} thousand` : "", r ? words999(r) : ""].filter(Boolean).join(" ");
}

const ordinal = (n: number) => `${n}${n % 10 === 1 && n !== 11 ? "st" : n % 10 === 2 && n !== 12 ? "nd" : n % 10 === 3 && n !== 13 ? "rd" : "th"}`;

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
const lcm = (a: number, b: number) => (a * b) / gcd(a, b);

// ---------- Question builders ----------

/** A choice question; wrong options that look like the answer (or each other) are dropped. */
function choose(prompt: string, right: Opt, wrong: Opt[], hint: string, visual?: Visual, max = 4): ChoiceQuestion {
  const look = (o: Opt) => (typeof o === "string" ? `|||${o}` : `${o.emoji ?? ""}|${o.shape ?? ""}|${o.coin ?? ""}|${o.label}`);
  const seen = new Set([look(right)]);
  const keep: Opt[] = [];
  for (const w of wrong) {
    if (keep.length >= max - 1) break;
    const k = look(w);
    if (seen.has(k)) continue;
    seen.add(k);
    keep.push(w);
  }
  return textChoice(prompt, right, keep, hint, visual);
}

/** A choice question that keeps its options in a natural order (like 0, 1/2, 1). */
function fixedChoice(prompt: string, labels: string[], answer: string, hint: string, visual?: Visual): ChoiceQuestion {
  const q: ChoiceQuestion = {
    kind: "choice",
    prompt,
    hint,
    answer: `c${labels.indexOf(answer)}`,
    choices: labels.map((label, i) => ({ id: `c${i}`, label })),
  };
  if (visual) q.visual = visual;
  return q;
}

function numChoice(
  prompt: string,
  answer: number,
  wrong: number[],
  hint: string,
  visual?: Visual,
  show: (n: number) => string = fmt,
  max = 4,
): ChoiceQuestion {
  return choose(prompt, show(answer), wrong.filter((w) => w !== answer && w >= 0).map(show), hint, visual, max);
}

function ask(
  prompt: string,
  answer: string | number,
  hint: string,
  opts: { keypad?: InputQuestion["keypad"]; accept?: string[]; suffix?: string; visual?: Visual } = {},
): InputQuestion {
  const q: InputQuestion = { kind: "input", prompt, hint, answer: String(answer), keypad: opts.keypad ?? "number" };
  if (opts.accept?.length) q.accept = opts.accept;
  if (opts.suffix) q.suffix = opts.suffix;
  if (opts.visual) q.visual = opts.visual;
  return q;
}

/** `labels` are listed in the correct order. */
function orderQ(prompt: string, labels: string[], hint: string): OrderQuestion {
  return { kind: "order", prompt, hint, items: labels.map((label, i) => ({ id: `i${i}`, label })) };
}

/** Read-aloud says "345678", not "345 678", and the questions come out in a fresh order. */
function finish(qs: Question[]): Question[] {
  const plain = (t: string) => t.replace(/(\d)\u00A0(?=\d)/g, "$1");
  for (const q of qs) {
    const said = q.speak ?? q.prompt;
    if (said.includes(NB)) q.speak = plain(said);
    if (q.kind === "choice") for (const c of q.choices) if (c.label.includes(NB)) c.speak = plain(c.label);
  }
  return shuffle(qs);
}

// ---------- Numbers to a Million ----------

/** A number with some zeros inside it (harder to read and write). */
function withZeros(len: number): number {
  const digits = [randInt(1, 9)];
  for (let i = 1; i < len; i++) digits.push(chance(0.4) ? 0 : randInt(1, 9));
  return Number(digits.join(""));
}

function bigNumber(d: Level): number {
  if (d === 1) return randInt(10000, 99999);
  if (d === 2) return randInt(100000, 999999);
  return withZeros(6);
}

function digitValue(d: Level): Question {
  for (;;) {
    const n = d === 1 ? randInt(10000, 99999) : randInt(100000, 999999);
    const s = String(n);
    const p = randInt(d === 1 ? 1 : 2, s.length - 1);
    const digit = s[s.length - 1 - p];
    if (digit === "0" || s.split(digit).length > 2) continue;
    const dv = Number(digit);
    const wrong = shuffle([p - 2, p - 1, p + 1, 0].filter((e) => e >= 0 && e <= 5 && e !== p)).map((e) => dv * 10 ** e);
    return numChoice(
      `In ${fmt(n)}, what is the value of the digit ${digit}?`,
      dv * 10 ** p,
      wrong,
      `Name the place of the ${digit}, counting from the right: ones, tens, hundreds, thousands, ten thousands, hundred thousands. The digit is worth ${digit} of that place.`,
    );
  }
}

function standardForm(d: Level): Question {
  const n = bigNumber(d);
  return ask(
    `Write this number using digits: ${numberWords(n)}.`,
    n,
    "Split the number at the word “thousand”. Write the thousands part, then the last three digits. Use a 0 to hold any empty place.",
  );
}

function expandedForm(d: Level): Question {
  if (d < 3) {
    const n = withZeros(d === 1 ? 5 : 6);
    const s = String(n);
    const parts = s
      .split("")
      .map((c, i) => Number(c) * 10 ** (s.length - 1 - i))
      .filter((v) => v > 0);
    return ask(
      `What number is ${parts.map(fmt).join(" + ")}?`,
      n,
      "Each part fills one place value. Write the digits from the greatest place to the ones, and put a 0 in any place that is missing.",
    );
  }
  const ht = randInt(1, 8);
  const th = randInt(11, 29);
  const tens = randInt(1, 19);
  const ones = randInt(0, 9);
  const n = ht * 100000 + th * 1000 + tens * 10 + ones;
  const terms = [`${ht} hundred thousands`, `${th} thousands`, `${tens} tens`, ...(ones ? [`${ones} ones`] : [])];
  return ask(
    `What number is ${terms.join(" + ")}?`,
    n,
    `Find the value of each part first (for example, ${th} thousands = ${fmt(th * 1000)} and ${tens} tens = ${tens * 10}), then add the parts.`,
  );
}

function roundBig(d: Level): Question {
  const unit = d === 1 ? 1000 : d === 2 ? 10000 : pick([10000, 100000]);
  const name = unit === 1000 ? "thousand" : unit === 10000 ? "ten thousand" : "hundred thousand";
  let n: number;
  do {
    n = d === 1 ? randInt(10000, 99999) : randInt(100000, 989999);
    if (d === 3 && unit === 10000) {
      // Make the rounding carry into the next place (like 396 512 → 400 000).
      n = Math.floor(n / 100000) * 100000 + 90000 + randInt(5000, 9999);
    }
  } while (n % unit === 0);
  const ans = Math.round(n / unit) * unit;
  const down = Math.floor(n / unit) * unit;
  const other = ans === down ? down + unit : down;
  const finer = Math.round(n / (unit / 10)) * (unit / 10);
  const coarser = Math.round(n / (unit * 10)) * (unit * 10);
  return numChoice(
    `Round ${fmt(n)} to the nearest ${name}.`,
    ans,
    [other, finer, coarser, down - unit, down + 2 * unit].filter((w) => w > 0),
    `Look at the digit just to the right of the ${name}s place. If it is 5 or more, round up; if it is less than 5, round down. Then every place to the right becomes 0.`,
  );
}

function orderBig(d: Level): Question {
  const len = d === 1 ? 5 : 6;
  for (;;) {
    const base = String(randInt(10 ** (len - 1), 10 ** len - 1)).split("");
    const set = new Set<number>([Number(base.join(""))]);
    for (let guard = 0; set.size < 4 && guard < 60; guard++) {
      const v = [...base];
      const i = randInt(d === 3 ? 1 : 0, len - 2);
      [v[i], v[i + 1]] = [v[i + 1], v[i]];
      if (v[0] === "0") continue;
      set.add(Number(v.join("")));
    }
    if (set.size < 4) continue;
    const nums = [...set].slice(0, 4).sort((a, b) => a - b);
    return orderQ(
      "Put these numbers in order from least to greatest.",
      nums.map(fmt),
      "Compare the greatest place first. If those digits match, move one place to the right, and keep going until the digits are different.",
    );
  }
}

function moreLess(d: Level): Question {
  const step = d === 1 ? 1000 : d === 2 ? 10000 : pick([10000, 100000]);
  const more = chance(0.5);
  const lo = d === 1 ? 10000 : 100000;
  let n: number;
  do {
    n = d === 1 ? randInt(10000, 99999) : randInt(100000, 999999);
    if (step < 100000 && chance(d === 1 ? 0.3 : 0.6)) {
      // Force a regroup: a 9 when adding, a 0 when taking away.
      const digit = Math.floor(n / step) % 10;
      n += ((more ? 9 : 0) - digit) * step;
    }
  } while (more ? n + step > 1000000 : n - step < lo);
  const place = step === 1000 ? "thousands" : step === 10000 ? "ten thousands" : "hundred thousands";
  return ask(
    `What number is ${fmt(step)} ${more ? "more" : "less"} than ${fmt(n)}?`,
    more ? n + step : n - step,
    `Only the ${place} digit should change by 1. If that digit is ${more ? "9" : "0"}, regroup with the place to its left.`,
  );
}

function lineBig(d: Level): Question {
  const span = d === 2 ? 1000000 : 100000;
  const min = d === 3 ? randInt(1, 8) * 100000 : 0;
  const step = span / 10;
  const ans = min + pick([1, 2, 3, 4, 6, 7, 8, 9]) * step;
  return ask(
    "What number belongs in the box on the number line?",
    ans,
    `The line is split into 10 equal jumps from ${fmt(min)} to ${fmt(min + span)}, so each jump is ${fmt(step)}. Count the jumps to the box.`,
    { visual: { type: "numberLine", min, max: min + span, step, labelEvery: span / 2, blankAt: ans } },
  );
}

function closestBig(d: Level): Question {
  const scale = d === 1 ? 1000 : 10000;
  const target = pick([25, 50, 75]) * scale;
  const sign = () => (chance(0.5) ? 1 : -1);
  const near = target + sign() * (randInt(1, 4) * (scale / 10) + randInt(1, 9) * (scale / 100));
  const farOff = () => (d === 3 ? randInt(11, 29) : randInt(30, 90)) * (scale / 10) + randInt(1, 9) * (scale / 100);
  const wrong = shuffle([target + farOff(), target - farOff(), Math.round(near / 10)]);
  return numChoice(
    `Which number is closest to ${fmt(target)}?`,
    near,
    wrong,
    "Find how far each number is from the benchmark. Check the number of digits too: a number with fewer digits is much smaller.",
  );
}

function bigNumbers(d: Level): Question[] {
  return finish([
    digitValue(d),
    standardForm(d),
    expandedForm(d),
    roundBig(d),
    orderBig(d),
    moreLess(d),
    lineBig(d),
    closestBig(d),
  ]);
}

// ---------- Add & Subtract ----------

const PLACE_HEADS = ["O", "T", "H", "Th", "TTh", "HTh", "M"];

/** A place-value chart that lines numbers up for column adding or subtracting. */
function columns(a: number, b: number, op: "+" | "−"): Visual {
  const len = Math.max(String(a).length, String(b).length);
  const heads = PLACE_HEADS.slice(0, len).reverse();
  const row = (n: number, sign: string) => [
    sign,
    ...String(n)
      .padStart(len, " ")
      .split("")
      .map((c) => (c === " " ? "" : c)),
  ];
  return { type: "table", title: "Line up the places", headers: ["", ...heads], rows: [row(a, ""), row(b, op)] };
}

function addPair(d: Level): [number, number] {
  if (d === 1) return [randInt(10000, 59999), randInt(1000, 39999)];
  if (d === 2) return [randInt(100000, 599999), randInt(10000, 399999)];
  const a = randInt(200000, 699999);
  return [a, randInt(100000, 1000000 - a)];
}

function subPair(d: Level): [number, number] {
  if (d === 1) {
    const a = randInt(20000, 99999);
    return [a, randInt(1000, a - 1000)];
  }
  if (d === 2) {
    const a = randInt(200000, 999999);
    return [a, randInt(10000, a - 10000)];
  }
  // Stretch: regroup across zeros.
  const a = pick([
    randInt(2, 9) * 100000,
    randInt(2, 9) * 100000 + randInt(1, 9) * 100,
    randInt(2, 9) * 100000 + randInt(1, 9) * 1000,
    1000000,
  ]);
  return [a, randInt(100001, a - 1)];
}

function columnAdd(d: Level): Question {
  const [a, b] = addPair(d);
  return ask(
    `Add: ${fmt(a)} + ${fmt(b)}`,
    a + b,
    "Start with the ones and work left. When a place adds to 10 or more, regroup 10 of that place as 1 of the next place.",
    { visual: columns(a, b, "+") },
  );
}

function columnSubtract(d: Level): Question {
  const [a, b] = subPair(d);
  return ask(
    `Subtract: ${fmt(a)} − ${fmt(b)}`,
    a - b,
    `Start with the ones. When the top digit is too small, regroup 1 from the next place (across zeros if needed). Check by adding your answer to ${fmt(b)}.`,
    { visual: columns(a, b, "−") },
  );
}

const ADD_STORIES: ((a: string, b: string) => string)[] = [
  (a, b) => `An arena sold ${a} tickets on Friday and ${b} tickets on Saturday. How many tickets were sold in all?`,
  (a, b) => `A library lent out ${a} books last year and ${b} books this year. How many books is that altogether?`,
  (a, b) => `A website had ${a} visits in May and ${b} visits in June. How many visits were there in the two months?`,
  (a, b) => `A city has ${a} adults and ${b} children. How many people live in the city?`,
];

const SUB_STORIES: ((big: string, small: string) => string)[] = [
  (big, small) => `A city's population grew from ${small} to ${big}. By how many people did it grow?`,
  (big, small) => `A charity wants to raise $${big}. So far it has raised $${small}. How many more dollars does it need?`,
  (big, small) => `A stadium has ${big} seats. So far, ${small} tickets have been sold. How many seats are still available?`,
  (big, small) => `A plane flew ${big} km this year and ${small} km last year. How many more kilometres did it fly this year?`,
];

function addStory(d: Level): Question {
  const [a, b] = addPair(d);
  return ask(
    pick(ADD_STORIES)(fmt(a), fmt(b)),
    a + b,
    "The total of two amounts means add. Line up the places and add from the ones, regrouping as you go.",
  );
}

function subStory(d: Level): Question {
  const [a, b] = subPair(d === 3 ? 2 : d);
  return ask(
    pick(SUB_STORIES)(fmt(a), fmt(b)),
    a - b,
    "Finding a difference or how many more means subtract the smaller amount from the greater one. You can also count up from the smaller number.",
  );
}

function estimateSum(d: Level): Question {
  const sub = chance(d === 3 ? 0.6 : 0.4);
  const unit = d === 1 ? 1000 : 10000;
  const unitName = d === 1 ? "thousand" : "ten thousand";
  let a: number;
  let b: number;
  do [a, b] = sub ? subPair(d === 3 ? 2 : d) : addPair(d === 3 ? 2 : d);
  while (a % unit === 0 || b % unit === 0 || b < unit);
  const r = (n: number) => Math.round(n / unit) * unit;
  const t = (n: number) => Math.floor(n / unit) * unit;
  const est = sub ? r(a) - r(b) : r(a) + r(b);
  const front = sub ? t(a) - t(b) : t(a) + t(b);
  return numChoice(
    `Round each number to the nearest ${unitName}, then ${sub ? "subtract" : "add"}. What is the estimate for ${fmt(a)} ${sub ? "−" : "+"} ${fmt(b)}?`,
    est,
    shuffle([front, est + unit, est - unit, est * 10]).filter((w) => w > 0),
    `Round each number first: look at the digit to the right of the ${unitName}s place. Then ${sub ? "subtract" : "add"} the rounded numbers.`,
  );
}

function compensation(d: Level): Question {
  const near = pick(
    d === 1 ? [99, 199, 999, 101, 1001] : d === 2 ? [998, 1999, 2998, 4999, 1002, 3001] : [9998, 19999, 49998, 29997, 10002],
  );
  const round = Math.round(near / 100) * 100;
  const k = round - near;
  const a = d === 1 ? randInt(1200, 8999) : d === 2 ? randInt(10000, 89999) : randInt(100000, 899999);
  const sub = chance(0.5);
  const ans = sub ? a - near : a + near;
  const noAdjust = sub ? a - round : a + round;
  const wrongWay = sub ? a - round - k : a + round + k;
  return numChoice(
    "Use mental math. What is the answer?",
    ans,
    shuffle([noAdjust, wrongWay, ans + (sub ? -1000 : 1000)]),
    `${fmt(near)} is ${Math.abs(k)} ${k > 0 ? "less" : "more"} than ${fmt(round)}. ${sub ? "Subtract" : "Add"} ${fmt(round)} first, then adjust by ${Math.abs(k)}. Think about which way to adjust!`,
    { type: "equation", text: `${fmt(a)} ${sub ? "−" : "+"} ${fmt(near)} = ?` },
  );
}

function makeBenchmark(d: Level): Question {
  const target = d === 1 ? 10000 : d === 2 ? 100000 : 1000000;
  const a =
    d === 1 ? randInt(11, 99) * 100 : d === 2 ? randInt(11, 99) * 1000 + pick([0, 500]) : randInt(101, 999) * 1000 + pick([0, 500, 250]);
  return ask(
    `What do you add to ${fmt(a)} to make ${fmt(target)}?`,
    target - a,
    `Count up in friendly jumps: first to the next round number, then on to ${fmt(target)}. Add up all your jumps.`,
    { visual: { type: "equation", text: `${fmt(a)} + ☐ = ${fmt(target)}` } },
  );
}

const GOAL_STORIES: ((goal: string, p1: string, p2: string) => string)[] = [
  (g, p1, p2) => `A school wants to collect ${g} cans of food. Grade 4 collected ${p1} and Grade 5 collected ${p2}. How many more cans do they need?`,
  (g, p1, p2) => `A community wants to plant ${g} trees. Volunteers planted ${p1} in the spring and ${p2} in the fall. How many more trees do they need to plant?`,
  (g, p1, p2) => `A charity run hopes to raise $${g}. It raised $${p1} online and $${p2} on the day of the run. How many more dollars does it need?`,
];

function twoStepGoal(d: Level): Question {
  const goal = pick(d === 1 ? [8000, 10000, 20000] : d === 2 ? [50000, 75000, 100000] : [500000, 750000, 1000000]);
  const part = () => randInt(Math.round(goal * 0.15), Math.round(goal * 0.4));
  const p1 = part();
  const p2 = part();
  const ans = goal - p1 - p2;
  return numChoice(
    pick(GOAL_STORIES)(fmt(goal), fmt(p1), fmt(p2)),
    ans,
    shuffle([p1 + p2, goal - p1, goal - p2, ans + 1000]),
    "This takes two steps. First add the two amounts collected. Then subtract that total from the goal.",
  );
}

function addSubtract(d: Level): Question[] {
  return finish([
    columnAdd(d),
    columnSubtract(d),
    addStory(d),
    subStory(d),
    estimateSum(d),
    compensation(d),
    makeBenchmark(d),
    twoStepGoal(d),
  ]);
}

// ---------- Multiply ----------

function multPair(d: Level): [number, number] {
  if (d === 1) return [randInt(12, 99), randInt(3, 9)];
  if (d === 2) return chance(0.5) ? [randInt(12, 99), randInt(11, 39)] : [randInt(101, 999), randInt(3, 9)];
  return [randInt(101, 999), randInt(11, 99)];
}

/** Place-value parts of a number: 345 → [300, 40, 5]. */
function placeParts(n: number): number[] {
  const s = String(n);
  return s
    .split("")
    .map((c, i) => Number(c) * 10 ** (s.length - 1 - i))
    .filter((v) => v > 0);
}

function multiplyFact(d: Level): Question {
  const [a, b] = multPair(d);
  return ask(
    "Multiply.",
    a * b,
    `Split ${a} into place-value parts (${placeParts(a).join(" + ")}). Multiply each part by ${b}, then add the partial products.`,
    { visual: { type: "equation", text: `${a} × ${b} = ?` } },
  );
}

function areaModel(d: Level): Question {
  // No zero digits, so every part of the model has something in it.
  const noZero = (lo: number, hi: number) => {
    let n: number;
    do n = randInt(lo, hi);
    while (String(n).includes("0"));
    return n;
  };
  const [a, b] =
    d === 1 ? [noZero(12, 99), randInt(3, 9)] : d === 2 ? [noZero(12, 99), noZero(11, 39)] : [noZero(111, 999), noZero(11, 39)];
  const cols = placeParts(a);
  const rows = placeParts(b);
  return ask(
    `Use the area model. What is ${a} × ${b}?`,
    a * b,
    "Each box holds a partial product. Add all the partial products inside the model to get the total.",
    {
      visual: {
        type: "table",
        title: `Area model for ${a} × ${b}`,
        headers: ["×", ...cols.map(String)],
        rows: rows.map((r) => [String(r), ...cols.map((c) => fmt(c * r))]),
      },
    },
  );
}

function powersOfTen(d: Level): Question {
  let a: number;
  let b: number;
  if (d === 1) {
    a = randInt(12, 99);
    b = pick([10, 100]);
  } else if (d === 2) {
    a = randInt(12, 250);
    b = pick([10, 100, 1000]);
  } else {
    a = randInt(12, 99);
    b = randInt(2, 9) * pick([100, 1000]);
  }
  return ask(
    "Multiply using a pattern.",
    a * b,
    "Multiply the non-zero parts first, then write all the zeros from the factors on the end.",
    { visual: { type: "equation", text: `${a} × ${fmt(b)} = ?` } },
  );
}

function strategyChoice(d: Level): Question {
  if (chance(0.5)) {
    const base = pick(d === 1 ? [20, 30, 50] : d === 2 ? [100, 200, 50] : [100, 500, 1000]);
    const k = randInt(1, 2);
    const up = chance(0.5);
    const b = up ? base + k : base - k;
    const a = d === 1 ? randInt(3, 9) : d === 2 ? randInt(4, 25) : randInt(12, 48);
    const s = up ? "+" : "−";
    const o = up ? "−" : "+";
    return choose(
      `Which is a mental math way to find ${a} × ${fmt(b)}?`,
      `${a} × ${fmt(base)} ${s} ${a} × ${k}`,
      shuffle([`${a} × ${fmt(base)} ${s} ${k}`, `${a} × ${fmt(base)} ${o} ${a} × ${k}`, `${a + k} × ${fmt(base)}`]),
      `${fmt(b)} is ${k} ${up ? "more" : "less"} than ${fmt(base)}. Multiply by ${fmt(base)}, then ${up ? "add" : "subtract"} ${k} more group${k > 1 ? "s" : ""} of ${a}.`,
    );
  }
  const a = pick(d === 1 ? [5, 15, 25] : d === 2 ? [25, 35, 45, 50] : [125, 25, 75, 250]);
  const b = 2 * randInt(d === 1 ? 3 : 4, d === 3 ? 24 : 16);
  const product = a * b;
  const cands: [number, number][] = [
    [a * 2, b * 2],
    [a, b / 2],
    [a * 2, b],
    [a + 2, b - 2],
  ];
  const wrong = cands.filter(([x, y]) => x * y !== product).map(([x, y]) => `${x} × ${y}`);
  return choose(
    `Which has the same product as ${a} × ${b}?`,
    `${a * 2} × ${b / 2}`,
    shuffle(wrong),
    "Doubling one factor and halving the other keeps the product the same. Check that only one factor was doubled and the other was halved.",
  );
}

function estimateProduct(d: Level): Question {
  const notRound = (lo: number, hi: number, by: number) => {
    let n: number;
    do n = randInt(lo, hi);
    while (n % by === 0);
    return n;
  };
  const r = (n: number, by: number) => Math.round(n / by) * by;
  const t = (n: number, by: number) => Math.floor(n / by) * by;
  let a: number;
  let b: number;
  let prompt: string;
  let est: number;
  let front: number;
  let alt: number;
  if (d === 1) {
    a = notRound(12, 98, 10);
    b = randInt(3, 9);
    est = r(a, 10) * b;
    front = t(a, 10) * b;
    alt = (r(a, 10) === t(a, 10) ? t(a, 10) + 10 : t(a, 10)) * b;
    prompt = `Round ${a} to the nearest ten. What is the estimate for ${a} × ${b}?`;
  } else if (d === 2) {
    a = notRound(12, 98, 10);
    b = notRound(12, 98, 10);
    est = r(a, 10) * r(b, 10);
    front = t(a, 10) * t(b, 10);
    alt = (r(a, 10) + 10) * r(b, 10);
    prompt = `Round each factor to the nearest ten. What is the estimate for ${a} × ${b}?`;
  } else {
    a = notRound(101, 949, 100);
    b = notRound(12, 98, 10);
    est = r(a, 100) * r(b, 10);
    front = t(a, 100) * t(b, 10);
    alt = r(a, 100) * (r(b, 10) + 10);
    prompt = `Round ${a} to the nearest hundred and ${b} to the nearest ten. What is the estimate for ${a} × ${b}?`;
  }
  return numChoice(
    prompt,
    est,
    shuffle([front, alt, est * 10, est / 10]),
    "Round first, then multiply the friendly numbers: multiply the non-zero digits and attach the zeros.",
  );
}

const PRODUCT_STORIES: { text: (big: number, small: number) => string; maxBig: number; suffix: string }[] = [
  { text: (a, b) => `A theatre has ${a} rows with ${b} seats in each row. How many seats are there?`, maxBig: 60, suffix: "seats" },
  { text: (a, b) => `A bakery packs ${b} muffins in each box. How many muffins are in ${a} boxes?`, maxBig: 999, suffix: "muffins" },
  { text: (a, b) => `A school orders ${a} boxes of pencils with ${b} pencils in each box. How many pencils is that?`, maxBig: 999, suffix: "pencils" },
  { text: (a, b) => `A delivery van drives ${b} km every day. How far does it drive in ${a} days?`, maxBig: 999, suffix: "km" },
  { text: (a, b) => `An orchard has ${a} rows of apple trees with ${b} trees in each row. How many trees are there?`, maxBig: 99, suffix: "trees" },
];

function productStory(d: Level): Question {
  const [a, b] = multPair(d);
  const story = pick(PRODUCT_STORIES.filter((s) => s.maxBig >= a));
  return ask(
    story.text(a, b),
    a * b,
    "Equal groups mean multiply. Split one factor into place-value parts, multiply each part, then add.",
    { suffix: story.suffix },
  );
}

function twoStepProduct(d: Level): Question {
  const price = d === 1 ? randInt(4, 9) : d === 2 ? randInt(11, 25) : randInt(12, 45);
  const count = d === 1 ? randInt(12, 30) : d === 2 ? randInt(21, 35) : randInt(105, 240);
  const extra = randInt(2, 12) * 5;
  const story = pick([
    `Tickets to a science centre cost $${price} each. A school buys ${count} tickets and also pays $${extra} for parking. What is the total cost in dollars?`,
    `A team orders ${count} T-shirts at $${price} each, plus a $${extra} delivery fee. What is the total cost in dollars?`,
    `A club buys ${count} plants for $${price} each and a bag of soil for $${extra}. How many dollars do they spend in all?`,
  ]);
  return ask(story, price * count + extra, "Step 1: multiply to find the cost of all the items. Step 2: add the extra cost.");
}

function greatestProduct(d: Level): Question {
  for (;;) {
    const pairs: [number, number][] = Array.from({ length: 4 }, () =>
      d === 1 ? [randInt(12, 60), randInt(3, 9)] : d === 2 ? [randInt(11, 60), randInt(11, 40)] : [randInt(101, 400), randInt(11, 40)],
    );
    const prods = pairs.map(([x, y]) => x * y);
    if (new Set(prods).size < 4) continue;
    const idx = prods.indexOf(Math.max(...prods));
    const labels = pairs.map(([x, y]) => `${x} × ${y}`);
    return choose(
      "Which product is the greatest?",
      labels[idx],
      labels.filter((_, i) => i !== idx),
      "Estimate each product with friendly numbers. If two estimates are close, work those out exactly.",
    );
  }
}

function multiply(d: Level): Question[] {
  return finish([
    multiplyFact(d),
    areaModel(d),
    powersOfTen(d),
    strategyChoice(d),
    estimateProduct(d),
    productStory(d),
    twoStepProduct(d),
    greatestProduct(d),
  ]);
}

// ---------- Divide ----------

/** [dividend, divisor] with no remainder. */
function divPair(d: Level): [number, number] {
  const b = d === 1 ? randInt(2, 9) : d === 2 ? randInt(3, 9) : randInt(6, 9);
  const lo = d === 1 ? 11 : d === 2 ? Math.ceil(100 / b) : 100;
  const hi = d === 1 ? Math.floor(99 / b) : Math.floor(999 / b);
  return [b * randInt(lo, Math.max(lo, hi)), b];
}

/** [dividend, divisor, quotient, remainder] with a remainder. */
function remPair(d: Level): [number, number, number, number] {
  for (;;) {
    const b = randInt(3, 9);
    const r = randInt(1, b - 1);
    const q = d === 1 ? randInt(5, Math.floor((99 - r) / b)) : randInt(Math.ceil((100 - r) / b), Math.floor((999 - r) / b));
    const a = b * q + r;
    if (a >= (d === 1 ? 20 : 100) && a <= 999) return [a, b, q, r];
  }
}

function divideFact(d: Level): Question {
  const [a, b] = divPair(d);
  const q = a / b;
  const chunk = b * Math.floor(q / 10) * 10;
  return ask(
    "Divide.",
    q,
    chunk > 0 && chunk < a
      ? `Think: ${b} × ? = ${a}. Split ${a} into parts that divide easily by ${b}, like ${chunk} and ${a - chunk}.`
      : `Think: ${b} × ? = ${a}. Use a multiplication fact you know.`,
    { visual: { type: "equation", text: `${a} ÷ ${b} = ?` } },
  );
}

function remainderChoice(d: Level): Question {
  const [a, b, q, r] = remPair(d);
  return choose(
    `What is ${a} ÷ ${b}?`,
    `${q} R ${r}`,
    shuffle([`${q} R ${r + 1}`, `${q + 1} R ${r}`, `${q - 1} R ${r + b}`, `${q}`]),
    `Find the greatest multiple of ${b} that is not more than ${a}. What is left over is the remainder, and it must be less than ${b}.`,
    { type: "equation", text: `${a} ÷ ${b}` },
  );
}

function remainderOnly(d: Level): Question {
  const [a, b, q] = remPair(d);
  return ask(
    `What is the remainder when ${a} is divided by ${b}?`,
    a - b * q,
    `Find the greatest multiple of ${b} that fits into ${a}. Subtract it from ${a}; what is left is the remainder.`,
  );
}

const ROUND_UP: { text: (t: string, s: number) => string; small: number[]; big: number[] }[] = [
  {
    text: (t, s) => `${t} people are coming to a banquet. Each table seats ${s}. How many tables are needed so everyone has a seat?`,
    small: [6, 8],
    big: [12, 16],
  },
  {
    text: (t, s) => `A farm has ${t} eggs to pack in cartons that hold ${s} eggs each. How many cartons are needed for all the eggs?`,
    small: [6],
    big: [12, 18, 30],
  },
  {
    text: (t, s) => `${t} students are going on a field trip. Each ${s > 12 ? "bus" : "van"} holds ${s} students. How many ${s > 12 ? "buses" : "vans"} are needed?`,
    small: [7, 8, 9],
    big: [24, 30, 36],
  },
  {
    text: (t, s) => `A store needs to ship ${t} books. Each box holds ${s} books. How many boxes are needed?`,
    small: [4, 5, 6, 8, 9],
    big: [15, 20, 25],
  },
];

function roundUpStory(d: Level): Question {
  const story = pick(ROUND_UP);
  const s = pick(d === 3 ? story.big : story.small);
  let t: number;
  do t = d === 1 ? randInt(20, 99) : randInt(100, 999);
  while (t % s === 0 || t < s * 3);
  return ask(
    story.text(fmt(t), s),
    Math.ceil(t / s),
    "Divide. If there is a remainder, the leftover ones still need a place, so you need one more than the quotient.",
  );
}

const ROUND_DOWN: { text: (t: number, s: number, name: string) => string; small: number[]; big: number[] }[] = [
  {
    text: (t, s) => `A ribbon is ${t} cm long. How many pieces ${s} cm long can be cut from it?`,
    small: [3, 4, 6, 7, 8, 9],
    big: [12, 15, 25],
  },
  {
    text: (t, s, n) => `${n} has $${t}. Each book costs $${s}. How many books can ${n} buy?`,
    small: [4, 6, 7, 8, 9],
    big: [12, 14, 15],
  },
  {
    text: (t, s) => `${t} players sign up for a tournament. Each team needs exactly ${s} players. How many full teams can be made?`,
    small: [5, 6, 9],
    big: [11, 12, 15],
  },
  {
    text: (t, s) => `A baker has ${t} cookies and puts ${s} in each bag. How many bags can be filled?`,
    small: [4, 6, 8],
    big: [12, 20, 24],
  },
];

function roundDownStory(d: Level): Question {
  const story = pick(ROUND_DOWN);
  const s = pick(d === 3 ? story.big : story.small);
  let t: number;
  do t = d === 1 ? randInt(20, 99) : randInt(100, 999);
  while (t % s === 0 || t < s * 3);
  return ask(
    story.text(t, s, pick(NAMES)),
    Math.floor(t / s),
    "Divide. The remainder is not enough to make one more, so leave it out and use only the quotient.",
  );
}

function estimateQuotient(d: Level): Question {
  const b = d === 1 ? randInt(2, 5) : randInt(3, 9);
  // Levels 2 and 3 divide a 3-digit number, so the friendly number is at least 120.
  const est = d === 1 ? randInt(1, 4) * 10 : randInt(Math.max(d === 2 ? 2 : 5, Math.ceil(12 / b)), Math.floor(99 / b)) * 10;
  const c = b * est;
  let a: number;
  do a = c + pick([-1, 1]) * randInt(1, Math.max(2, Math.floor(c * 0.04)));
  while (a === c || (d > 1 && a < 100));
  return numChoice(
    `Which is the best estimate for ${a} ÷ ${b}?`,
    est,
    shuffle([est * 10, est / 10, est * 2]),
    `Change ${a} to a nearby number that divides easily by ${b}, like ${c}. Then divide the friendly number.`,
  );
}

function checkDivision(d: Level): Question {
  if (d === 3) {
    const [a, b, q, r] = remPair(3);
    return choose(
      `How can you check that ${a} ÷ ${b} = ${q} R ${r}?`,
      `Work out ${q} × ${b} + ${r}`,
      shuffle([`Work out ${q} × ${b} − ${r}`, `Work out ${q} × ${r} + ${b}`, `Work out ${a} × ${b} + ${r}`]),
      `Multiplication undoes division. ${b} groups of ${q}, plus the ${r} left over, should make ${a}.`,
    );
  }
  const [a, b] = divPair(d);
  const q = a / b;
  return choose(
    `How can you check that ${a} ÷ ${b} = ${q}?`,
    `Multiply ${q} × ${b}`,
    shuffle([`Multiply ${a} × ${b}`, `Divide ${q} ÷ ${b}`, `Add ${q} + ${b}`]),
    "Multiplication and division undo each other. If the quotient times the divisor gives the dividend, the division is right.",
  );
}

const SHARE_STORIES: ((a: number, b: number) => string)[] = [
  (a, b) => `${b} friends share $${a} equally. How many dollars does each friend get?`,
  (a, b) => `A ${b}-day bike trip covers ${a} km, with the same distance each day. How many kilometres is that per day?`,
  (a, b) => `${a} chairs are set up in ${b} equal rows. How many chairs are in each row?`,
  (a, b) => `A class collects ${a} cans and packs them equally into ${b} boxes. How many cans go in each box?`,
];

function shareStory(d: Level): Question {
  const [a, b] = divPair(d);
  return ask(
    pick(SHARE_STORIES)(a, b),
    a / b,
    `Sharing equally means divide by ${b}. Split ${a} into parts that are easy to share, then add the shares.`,
  );
}

function divide(d: Level): Question[] {
  return finish([
    divideFact(d),
    remainderChoice(d),
    remainderOnly(d),
    roundUpStory(d),
    roundDownStory(d),
    estimateQuotient(d),
    checkDivision(d),
    shareStory(d),
  ]);
}

// ---------- Equivalent Fractions ----------

function baseFraction(d: Level): [number, number] {
  const dens = d === 1 ? [2, 3, 4, 5] : d === 2 ? [3, 4, 5, 6, 8, 10] : [3, 4, 5, 6, 8, 9, 10, 12];
  for (;;) {
    const den = pick(dens);
    const n = randInt(1, den - 1);
    if (gcd(n, den) === 1) return [n, den];
  }
}

/** Every equivalent form with a denominator up to 100, e.g. 3/4 → 3/4, 6/8, 9/12… */
function equivalentForms(n: number, d: number): string[] {
  const g = gcd(n, d);
  const out: string[] = [];
  for (let k = 1; (d / g) * k <= 100; k++) out.push(`${(n / g) * k}/${(d / g) * k}`);
  return out;
}

function missingEquivalent(d: Level): Question {
  const [n, den] = baseFraction(d);
  const k = randInt(2, d === 1 ? 3 : d === 2 ? 4 : 6);
  const mode = d === 3 ? pick(["num", "den", "down"]) : d === 2 ? pick(["num", "num", "down"]) : "num";
  if (mode === "num") {
    return ask("What number goes in the box to make the fractions equivalent?", n * k, `What was ${den} multiplied by to get ${den * k}? Multiply the numerator by the same number.`, {
      visual: { type: "equation", text: `${n}/${den} = ☐/${den * k}` },
    });
  }
  if (mode === "den") {
    return ask("What number goes in the box to make the fractions equivalent?", den * k, `What was ${n} multiplied by to get ${n * k}? Multiply the denominator by the same number.`, {
      visual: { type: "equation", text: `${n}/${den} = ${n * k}/☐` },
    });
  }
  return ask("What number goes in the box to make the fractions equivalent?", n, `What was ${den * k} divided by to get ${den}? Divide the numerator by the same number.`, {
    visual: { type: "equation", text: `${n * k}/${den * k} = ☐/${den}` },
  });
}

function shadedFraction(d: Level): Question {
  const [n, den] = baseFraction(d === 1 ? 1 : 2);
  const k = d === 1 ? 1 : randInt(2, Math.min(4, Math.floor(24 / den)));
  const visual: Visual = { type: "fraction", numerator: n * k, denominator: den * k, shape: chance(0.5) ? "bar" : "circle" };
  if (d === 3) {
    return ask(
      "What fraction is shaded? Write it in simplest form.",
      `${n}/${den}`,
      "Count the shaded parts and all the parts. Then divide the numerator and denominator by the same number until they can't share any more factors.",
      { keypad: "fraction", visual },
    );
  }
  const answer = `${n * k}/${den * k}`;
  return ask(
    "What fraction is shaded? (Any equivalent fraction is correct.)",
    answer,
    "The numerator is the number of shaded parts. The denominator is the number of equal parts in the whole shape.",
    { keypad: "fraction", visual, accept: equivalentForms(n, den).filter((f) => f !== answer) },
  );
}

function pickEquivalent(d: Level): Question {
  const [n, den] = baseFraction(d);
  const k = randInt(2, d === 1 ? 3 : 5);
  const right = `${n * k}/${den * k}`;
  if (d < 3 && chance(0.5)) {
    return ask(
      `Write a fraction equivalent to ${n}/${den} that has a denominator of ${den * k}.`,
      right,
      `What do you multiply ${den} by to get ${den * k}? Multiply the numerator by the same number.`,
      { keypad: "fraction" },
    );
  }
  const cands: [number, number][] = [
    [n + k, den + k],
    [n * k, den],
    [n, den * k],
    [n * k + 1, den * k],
  ];
  return choose(
    `Which fraction is equivalent to ${n}/${den}?`,
    right,
    shuffle(cands.filter(([x, y]) => x * den !== n * y).map(([x, y]) => `${x}/${y}`)),
    "Equivalent fractions come from multiplying (or dividing) the numerator and the denominator by the same number.",
    { type: "fraction", numerator: n, denominator: den },
  );
}

function notEquivalent(d: Level): Question {
  const [n, den] = baseFraction(d);
  const ks = sample([2, 3, 4, 5], 3);
  const add = randInt(1, 3);
  return choose(
    `Which fraction is NOT equivalent to ${n}/${den}?`,
    `${n + add}/${den + add}`,
    ks.map((k) => `${n * k}/${den * k}`),
    "For each fraction, check: were the numerator and denominator both multiplied by the same number? Adding the same number to both does not keep a fraction equivalent.",
  );
}

function fractionBenchmark(d: Level): Question {
  const maxDen = d === 1 ? 8 : d === 2 ? 10 : 12;
  for (;;) {
    const den = randInt(3, maxDen);
    const n = randInt(1, den - 1);
    // Skip fractions exactly halfway between two benchmarks, and 1/2 itself.
    if (4 * n === den || 4 * n === 3 * den || 2 * n === den) continue;
    const ans = 4 * n < den ? "0" : 4 * n > 3 * den ? "1" : "1/2";
    return fixedChoice(
      `Is ${n}/${den} closest to 0, 1/2 or 1?`,
      ["0", "1/2", "1"],
      ans,
      `Half of ${den} is ${dec(den * 500)}. Compare the numerator ${n} with that: much smaller is near 0, about the same is near 1/2, and close to ${den} is near 1.`,
    );
  }
}

function compareFractions(d: Level): Question {
  if (d < 3) {
    const maxDen = d === 1 ? 8 : 12;
    const used = new Set<number>();
    const make = (test: (n: number, den: number) => boolean) => {
      for (;;) {
        const den = randInt(3, maxDen);
        const n = randInt(1, den - 1);
        if (!used.has(den) && test(n, den)) {
          used.add(den);
          return `${n}/${den}`;
        }
      }
    };
    const right = make((n, den) => 2 * n > den);
    const half = make((n, den) => 2 * n === den);
    const less1 = make((n, den) => 2 * n < den);
    const less2 = make((n, den) => 2 * n < den);
    return choose(
      "Which fraction is greater than 1/2?",
      right,
      shuffle([half, less1, less2]),
      "A fraction is greater than 1/2 when its numerator is more than half of its denominator. Exactly half means it equals 1/2.",
    );
  }
  for (;;) {
    const d1 = randInt(3, 12);
    const d2 = randInt(3, 12);
    if (d1 === d2) continue;
    const n1 = randInt(1, d1 - 1);
    const n2 = randInt(1, d2 - 1);
    if (n1 * d2 === n2 * d1 || Math.abs(n1 / d1 - n2 / d2) > 0.2) continue;
    const a = `${n1}/${d1}`;
    const b = `${n2}/${d2}`;
    const big = n1 * d2 > n2 * d1 ? a : b;
    return fixedChoice(
      `Which is greater: ${a} or ${b}?`,
      [a, b, "They are equal"],
      big,
      `Rename both fractions with the common denominator ${lcm(d1, d2)}, then compare the numerators.`,
    );
  }
}

function orderFractions(d: Level): Question {
  for (;;) {
    let fr: [number, number][];
    if (d === 1) {
      if (chance(0.5)) {
        fr = sample([2, 3, 4, 5, 6, 8, 10], 4).map((den) => [1, den]);
      } else {
        const den = randInt(6, 12);
        fr = sample(
          Array.from({ length: den - 1 }, (_, i) => i + 1),
          4,
        ).map((n) => [n, den]);
      }
    } else {
      const fam = d === 2 ? pick([[2, 4, 8], [3, 6, 12], [2, 5, 10], [2, 3, 6]]) : [3, 4, 5, 6, 8, 10, 12];
      fr = Array.from({ length: 4 }, () => {
        const den = pick(fam);
        return [randInt(1, den - 1), den];
      });
    }
    const keys = fr.map(([n, den]) => (n / den).toFixed(6));
    if (new Set(keys).size < 4) continue;
    const sorted = [...fr].sort((x, y) => x[0] / x[1] - y[0] / y[1]);
    return orderQ(
      "Put these fractions in order from least to greatest.",
      sorted.map(([n, den]) => `${n}/${den}`),
      "Compare with benchmarks (0, 1/2, 1), or rename the fractions with a common denominator. When numerators match, the greater denominator means smaller pieces.",
    );
  }
}

function fractionOfSet(d: Level): Question {
  const [n, den] = baseFraction(d === 1 ? 1 : 2);
  const k = randInt(2, d === 1 ? 3 : d === 2 ? 4 : 6);
  const total = den * k;
  const name = pick(NAMES);
  const stories = [
    ...(total <= 16 ? [`A pizza is cut into ${total} equal slices. ${name}'s family eats ${n}/${den} of it. How many slices is that?`] : []),
    `A class has ${total} students. ${n}/${den} of them walk to school. How many students walk?`,
    `${name} has ${total} trading cards. ${n}/${den} of them are hockey cards. How many hockey cards does ${name} have?`,
    `A garden has ${total} plants. ${n}/${den} of them are tomato plants. How many tomato plants are there?`,
  ];
  return ask(
    pick(stories),
    n * k,
    `Write ${n}/${den} as an equivalent fraction with a denominator of ${total}. Its numerator is the answer.`,
    { visual: { type: "fraction", numerator: n, denominator: den, shape: "circle" } },
  );
}

function fractions(d: Level): Question[] {
  return finish([
    missingEquivalent(d),
    shadedFraction(d),
    pickEquivalent(d),
    notEquivalent(d),
    fractionBenchmark(d),
    compareFractions(d),
    orderFractions(d),
    fractionOfSet(d),
  ]);
}

// ---------- Decimals ----------

const DEC_PLACES = ["ones", "tenths", "hundredths", "thousandths"];

function decimalPlaceValue(d: Level): Question {
  for (;;) {
    const places = d === 1 ? 2 : 3;
    const whole = randInt(1, d === 3 ? 99 : 9);
    const digits = Array.from({ length: places }, () => randInt(1, 9));
    const s = `${whole}.${digits.join("")}`;
    const p = randInt(1, places);
    const digit = digits[p - 1];
    if (s.split(String(digit)).length > 2) continue;
    const label = (place: number) => {
      const unit = digit === 1 ? DEC_PLACES[place].slice(0, -1) : DEC_PLACES[place];
      return `${digit} ${unit} (${dec(digit * 10 ** (3 - place))})`;
    };
    return choose(
      `In ${s}, what is the value of the digit ${digit}?`,
      label(p),
      shuffle([0, 1, 2, 3].filter((x) => x !== p)).map(label),
      "After the decimal point, the places are tenths, then hundredths, then thousandths.",
    );
  }
}

function decimalWords(d: Level): Question {
  const D = d === 1 ? pick([10, 100]) : d === 2 ? pick([100, 1000]) : 1000;
  let m: number;
  do {
    m = d === 3 ? pick([randInt(1, 9), randInt(11, 99), randInt(1, 9) * 100 + randInt(1, 9)]) : randInt(1, D - 1);
  } while (D > 10 && m % 10 === 0);
  const whole = d === 1 ? (chance(0.5) ? 0 : randInt(1, 9)) : d === 2 ? randInt(0, 20) : randInt(0, 99);
  const unit = D === 10 ? "tenth" : D === 100 ? "hundredth" : "thousandth";
  const words = `${whole ? `${numberWords(whole)} and ` : ""}${numberWords(m)} ${unit}${m === 1 ? "" : "s"}`;
  return ask(
    `Write this as a decimal: ${words}.`,
    dec(whole * 1000 + m * (1000 / D)),
    "The word “and” marks the decimal point. The last word tells you the last place: tenths = 1 digit after the point, hundredths = 2, thousandths = 3. Use zeros to hold empty places.",
    { keypad: "decimal" },
  );
}

function fractionToDecimal(d: Level): Question {
  const D = d === 1 ? pick([10, 100]) : d === 2 ? pick([100, 1000]) : 1000;
  let m: number;
  do m = d === 3 ? pick([randInt(1, 9), randInt(11, 99)]) : randInt(1, D - 1);
  while (D > 10 && m % 10 === 0);
  const whole = d === 3 && chance(0.5) ? randInt(1, 9) : 0;
  const text = `${whole ? `${whole} ` : ""}${m}/${D}`;
  return ask(
    `Write ${text} as a decimal.`,
    dec(whole * 1000 + m * (1000 / D)),
    "The denominator tells you the last place: 10 → tenths, 100 → hundredths, 1000 → thousandths. Use zeros to fill any empty places.",
    { keypad: "decimal", visual: { type: "equation", text: `${text} = ?` } },
  );
}

function decimalLine(d: Level): Question {
  const stepTh = d === 1 ? 100 : d === 2 ? 10 : 1;
  const minTh = d === 1 ? randInt(0, 9) * 1000 : d === 2 ? randInt(10, 99) * 100 : randInt(100, 999) * 10;
  const ansTh = minTh + pick([1, 2, 3, 4, 6, 7, 8, 9]) * stepTh;
  return ask(
    "What decimal belongs in the box on the number line?",
    dec(ansTh),
    `The line goes from ${dec(minTh)} to ${dec(minTh + 10 * stepTh)} in 10 equal jumps, so each jump is ${dec(stepTh)}. Count the jumps to the box.`,
    {
      keypad: "decimal",
      visual: {
        type: "numberLine",
        min: minTh / 1000,
        max: (minTh + 10 * stepTh) / 1000,
        step: stepTh / 1000,
        labelEvery: (5 * stepTh) / 1000,
        blankAt: ansTh / 1000,
      },
    },
  );
}

function orderDecimals(d: Level): Question {
  let t: number;
  let h: number;
  do {
    t = randInt(1, 9);
    h = randInt(1, 9);
  } while (t === h);
  const w = d === 3 ? randInt(0, 5) * 1000 : 0;
  const pool = [t * 100, t * 100 + h * 10, h * 100 + t * 10, t * 100 + h, t * 100 + h * 10 + h];
  const chosen = d === 1 ? pool.slice(0, 3) : d === 2 ? pool.slice(0, 4) : pool;
  const vals = chosen.map((v) => v + w).sort((a, b) => a - b);
  return orderQ(
    "Put these decimals in order from least to greatest.",
    vals.map(dec),
    "Compare place by place: tenths first, then hundredths, then thousandths. Writing zeros on the end (0.5 = 0.500) can help.",
  );
}

function roundDecimal(d: Level): Question {
  if (d === 3 && chance(0.5)) {
    let th: number;
    do th = randInt(20, 980);
    while (Math.abs(th - 250) < 15 || Math.abs(th - 750) < 15 || Math.abs(th - 500) < 5);
    const ans = th < 250 ? "0" : th > 750 ? "1" : "0.5";
    return fixedChoice(
      `Is ${dec(th)} closest to 0, 0.5 or 1?`,
      ["0", "0.5", "1"],
      ans,
      "Use 0.25 and 0.75 as halfway marks: below 0.25 is closest to 0, from 0.25 to 0.75 is closest to 0.5, and above 0.75 is closest to 1.",
    );
  }
  const places = d === 1 ? 0 : d === 2 ? 1 : 2;
  const unit = 10 ** (3 - places);
  const name = ["whole number", "tenth", "hundredth"][places];
  let th: number;
  do th = d === 1 ? randInt(100, 999) * 10 : randInt(1000, 9999);
  while (th % unit === 0 || (unit >= 100 && th % (unit / 10) === 0));
  const ans = Math.round(th / unit) * unit;
  const down = Math.floor(th / unit) * unit;
  const other = ans === down ? down + unit : down;
  const finer = Math.round(th / (unit / 10)) * (unit / 10);
  const wrong = [decFixed(other, places), decFixed(finer, places + 1)];
  if (places > 0) wrong.push(decFixed(Math.round(th / (unit * 10)) * unit * 10, places - 1));
  return choose(
    `Round ${dec(th)} to the nearest ${name}.`,
    decFixed(ans, places),
    shuffle(wrong),
    `Look at the digit just to the right of the ${name === "whole number" ? "ones" : `${name}s`} place. If it is 5 or more, round up; if it is less than 5, round down.`,
  );
}

const ADD_DEC: { text: (n: string, a: string, b: string) => string; suffix: string }[] = [
  { text: (n, a, b) => `${n} ran ${a} km on Saturday and ${b} km on Sunday. How far did ${n} run in all?`, suffix: "km" },
  { text: (n, a, b) => `${n}'s recipe uses ${a} kg of flour and ${b} kg of sugar. What is the total mass?`, suffix: "kg" },
  { text: (n, a, b) => `${n} pours ${a} L of water into a tank, then adds ${b} L more. How much water is in the tank?`, suffix: "L" },
  { text: (n, a, b) => `${n} measured ${a} cm of rain on Monday and ${b} cm on Tuesday. How much rain fell in the two days?`, suffix: "cm" },
];

function addDecimals(d: Level): Question {
  // Every number keeps its last decimal place (no 7.0 hiding as 7).
  const dp = (lo: number, hi: number, unit: number) => {
    let n: number;
    do n = randInt(lo, hi) * unit;
    while (n % (unit * 10) === 0);
    return n;
  };
  let a: number;
  let b: number;
  if (d === 1) {
    a = dp(11, 99, 100);
    b = dp(11, 99, 100);
  } else if (d === 2) {
    a = dp(101, 999, 10);
    b = dp(11, 99, 100);
  } else {
    a = dp(1001, 9999, 1);
    b = dp(101, 999, 10);
  }
  if (chance(0.5)) [a, b] = [b, a];
  const story = pick(ADD_DEC);
  return ask(
    story.text(pick(NAMES), dec(a), dec(b)),
    dec(a + b),
    "Line up the decimal points. Write zeros so both numbers have the same number of decimal places, then add as with whole numbers.",
    { keypad: "decimal", suffix: story.suffix, visual: { type: "equation", text: `${dec(a)} + ${dec(b)} = ?` } },
  );
}

const SUB_DEC: { text: (n: string, a: string, b: string) => string; suffix: string }[] = [
  { text: (n, a, b) => `A jug holds ${a} L of juice. ${n} pours out ${b} L. How much juice is left?`, suffix: "L" },
  { text: (n, a, b) => `A board is ${a} m long. ${n} cuts off ${b} m. How long is the board now?`, suffix: "m" },
  { text: (n, a, b) => `A hiking trail is ${a} km long. ${n} has walked ${b} km. How much farther is it to the end?`, suffix: "km" },
  { text: (n, a, b) => `${n}'s pumpkin has a mass of ${a} kg. A friend's pumpkin is ${b} kg. How much heavier is ${n}'s pumpkin?`, suffix: "kg" },
];

function subtractDecimals(d: Level): Question {
  let a: number;
  let b: number;
  if (d === 1) {
    do {
      a = randInt(30, 99) * 100;
      b = randInt(11, a / 100 - 5) * 100;
    } while (a % 1000 === 0 || b % 1000 === 0 || a % 1000 === b % 1000);
  } else if (d === 2) {
    a = randInt(30, 99) * 100;
    do b = randInt(101, a / 10 - 20) * 10;
    while (b % 100 === 0);
  } else {
    a = chance(0.5) ? randInt(2, 9) * 1000 : randInt(20, 99) * 100;
    do b = randInt(101, a - 100);
    while (b % 10 === 0);
  }
  const story = pick(SUB_DEC);
  return ask(
    story.text(pick(NAMES), dec(a), dec(b)),
    dec(a - b),
    "Line up the decimal points and write zeros in any empty places (for example, 2 = 2.000). Then subtract, regrouping as needed.",
    { keypad: "decimal", suffix: story.suffix, visual: { type: "equation", text: `${dec(a)} − ${dec(b)} = ?` } },
  );
}

function decimals(d: Level): Question[] {
  return finish([
    decimalPlaceValue(d),
    decimalWords(d),
    fractionToDecimal(d),
    decimalLine(d),
    orderDecimals(d),
    roundDecimal(d),
    addDecimals(d),
    subtractDecimals(d),
  ]);
}

// ---------- Patterns & Equations ----------

const VARS = ["n", "a", "b", "m", "y", "k", "p"];

function patternNext(d: Level, up: boolean): Question {
  const k = d === 1 ? randInt(3, 9) : d === 2 ? randInt(11, 25) : pick([12, 15, 25, 50, 75, 125]);
  const s = up
    ? d === 1 ? randInt(1, 30) : d === 2 ? randInt(10, 150) : randInt(100, 999)
    : d === 1 ? randInt(60, 120) : d === 2 ? randInt(300, 600) : randInt(1500, 5000);
  const term = (i: number) => (up ? s + i * k : s - i * k);
  const shown = [0, 1, 2, 3].map(term).join(", ");
  if (d === 3) {
    const N = pick([8, 10, 12]);
    return ask(
      `This pattern keeps ${up ? "increasing" : "decreasing"} by the same amount. What is the ${ordinal(N)} number in the pattern?`,
      term(N - 1),
      `Find the change from one number to the next. The ${ordinal(N)} number is the first number ${up ? "plus" : "minus"} ${N - 1} of those changes.`,
      { visual: { type: "equation", text: `${shown}, …` } },
    );
  }
  return ask(
    "What number comes next in the pattern?",
    term(4),
    `Find how much the pattern ${up ? "grows" : "shrinks"} from one number to the next, then apply that change once more.`,
    { visual: { type: "equation", text: `${shown}, ☐` } },
  );
}

function patternRule(d: Level): Question {
  const up = chance(0.5);
  const k = d === 1 ? randInt(2, 9) : d === 2 ? randInt(6, 15) : randInt(11, 30);
  const s = up ? randInt(1, 40) : randInt(5 * k + 10, 5 * k + 100);
  const terms = [0, 1, 2, 3].map((i) => (up ? s + i * k : s - i * k));
  const verb = up ? "add" : "subtract";
  const other = up ? "subtract" : "add";
  return choose(
    "Which rule describes this pattern?",
    `Start at ${s} and ${verb} ${k} each time.`,
    shuffle([
      `Start at ${s} and ${other} ${k} each time.`,
      `Start at ${k} and ${verb} ${s} each time.`,
      `Start at ${s} and ${verb} ${k + 1} each time.`,
      `Start at ${terms[1]} and ${verb} ${k} each time.`,
    ]),
    "A pattern rule tells the starting number and how the pattern changes each step. Check the first number, then find the difference between neighbours.",
    { type: "equation", text: `${terms.join(", ")}, …` },
  );
}

function ruleFor(d: Level): [number, number] {
  if (d === 1) return [1, randInt(3, 20)];
  if (d === 2) return [randInt(2, 12), 0];
  return [randInt(2, 9), randInt(1, 9)];
}

function ruleTable(a: number, b: number): Visual {
  return { type: "table", title: "Input and output", headers: ["Input (n)", "Output"], rows: [1, 2, 3, 4].map((n) => [n, a * n + b]) };
}

function tableValue(d: Level): Question {
  const [a, b] = ruleFor(d);
  const N = d === 3 ? randInt(15, 25) : randInt(8, 12);
  return ask(
    `The table follows a rule. What is the output when n = ${N}?`,
    a * N + b,
    "Compare each output with its input and find a rule that works for every row (like “add 5”, “multiply by 3” or “multiply by 2, then add 1”). Then use the rule on the new input.",
    { visual: ruleTable(a, b) },
  );
}

function tableExpression(d: Level): Question {
  const [a, b] = ruleFor(d);
  const label = (p: number, q: number) => `${p === 1 ? "" : p}n${q ? ` + ${q}` : ""}`;
  const cands: [number, number][] =
    d === 1
      ? [[b, 0], [1, b + 1], [2, b - 1], [b + 1, 0]]
      : d === 2
        ? [[1, a], [a + 1, 0], [a, 1], [2, a - 2]]
        : [[1, a], [a + b, 0], [b, a], [a, b + 1], [a + 1, b - 1]];
  const wrong = cands.filter(([p, q]) => p >= 1 && q >= 0 && !(p === a && q === b)).map(([p, q]) => label(p, q));
  return choose(
    "Which expression matches the rule in the table?",
    label(a, b),
    shuffle(wrong),
    "Test each expression with every row: replace n with the input and see if you get the output. (3n means 3 × n.)",
    ruleTable(a, b),
  );
}

type EqKind = "add" | "sub" | "mul" | "div";

function equationQ(d: Level, kind: EqKind): Question {
  const v = pick(VARS);
  let text: string;
  let ans: number;
  let hint: string;
  if (kind === "add" || kind === "sub") {
    const x = d === 1 ? randInt(21, 60) : d === 2 ? randInt(60, 250) : randInt(250, 900);
    const c = d === 1 ? randInt(11, 19) : d === 2 ? randInt(25, 55) : randInt(120, 240);
    if (kind === "add") {
      text = chance(0.5) ? `${v} + ${c} = ${x + c}` : `${c} + ${v} = ${x + c}`;
      hint = `Undo adding ${c}: subtract ${c} from ${x + c}.`;
    } else {
      text = `${v} − ${c} = ${x - c}`;
      hint = `Undo subtracting ${c}: add ${c} to ${x - c}.`;
    }
    ans = x;
  } else if (kind === "mul") {
    const c = randInt(3, d === 1 ? 9 : 12);
    const x = randInt(d === 3 ? 11 : 2, d === 1 ? 9 : d === 2 ? 12 : 25);
    text = chance(0.5) ? `${c} × ${v} = ${c * x}` : `${v} × ${c} = ${c * x}`;
    hint = `Think: ${c} times what number makes ${c * x}? Divide ${c * x} by ${c} to undo the multiplying.`;
    ans = x;
  } else {
    const c = randInt(2, 9);
    const q = randInt(d === 3 ? 11 : 2, d === 3 ? 30 : 12);
    text = `${v} ÷ ${c} = ${q}`;
    hint = `Undo dividing by ${c}: multiply ${q} by ${c}.`;
    ans = c * q;
  }
  return ask(`Solve for ${v}.`, ans, hint, { visual: { type: "equation", text } });
}

function storyEquation(d: Level): Question {
  const name = pick(NAMES);
  const kind: EqKind = d === 1 ? pick(["add", "sub"] as EqKind[]) : d === 2 ? pick(["mul", "div"] as EqKind[]) : pick(["add", "sub", "mul", "div"] as EqKind[]);
  const hint = "Read the story in order and write the actions you see: getting more is +, spending or losing is −, equal groups is ×, sharing equally is ÷.";
  if (kind === "add") {
    const a = randInt(12, d === 3 ? 250 : 40);
    const b = a + randInt(10, d === 3 ? 400 : 60);
    return choose(
      `${name} had some stickers. After getting ${a} more, ${name} has ${b}. Which equation can find s, the number of stickers ${name} started with?`,
      `s + ${a} = ${b}`,
      shuffle([`s − ${a} = ${b}`, `s + ${b} = ${a}`, `${a} × s = ${b}`]),
      hint,
    );
  }
  if (kind === "sub") {
    const a = randInt(5, d === 3 ? 150 : 30);
    const b = randInt(5, d === 3 ? 300 : 60);
    return choose(
      `${name} had some money, then spent $${a}. Now ${name} has $${b} left. Which equation can find m, the amount ${name} started with?`,
      `m − ${a} = ${b}`,
      shuffle([`m + ${a} = ${b}`, `${a} − m = ${b}`, `m ÷ ${a} = ${b}`]),
      hint,
    );
  }
  if (kind === "mul") {
    const a = randInt(3, 9);
    const b = a * randInt(4, d === 3 ? 25 : 12);
    return choose(
      `${name} bought ${a} packs of pencils with the same number in each pack. There are ${b} pencils in all. Which equation can find p, the number of pencils in each pack?`,
      `${a} × p = ${b}`,
      shuffle([`p + ${a} = ${b}`, `p ÷ ${a} = ${b}`, `p − ${a} = ${b}`]),
      hint,
    );
  }
  const a = randInt(3, 9);
  const b = randInt(4, d === 3 ? 30 : 12);
  return choose(
    `${name} shared some grapes equally among ${a} friends. Each friend got ${b} grapes. Which equation can find g, the total number of grapes?`,
    `g ÷ ${a} = ${b}`,
    shuffle([`g × ${a} = ${b}`, `${a} ÷ g = ${b}`, `g − ${a} = ${b}`]),
    hint,
  );
}

function patternsEquations(d: Level): Question[] {
  const [k1, k2]: EqKind[] = d === 1 ? shuffle(["add", "sub"] as EqKind[]) : d === 2 ? shuffle(["mul", "div"] as EqKind[]) : sample(["add", "sub", "mul", "div"] as EqKind[], 2);
  return finish([
    patternNext(d, true),
    patternNext(d, false),
    patternRule(d),
    tableValue(d),
    tableExpression(d),
    equationQ(d, k1),
    equationQ(d, k2),
    storyEquation(d),
  ]);
}

// ---------- Area & Perimeter ----------

const AREA_THINGS = [
  { thing: "garden", unit: "m", emoji: "🌻" },
  { thing: "poster", unit: "cm", emoji: "🖼️" },
  { thing: "classroom floor", unit: "m", emoji: "🏫" },
  { thing: "placemat", unit: "cm", emoji: "🍽️" },
  { thing: "skating rink", unit: "m", emoji: "⛸️" },
  { thing: "photo", unit: "cm", emoji: "📷" },
];

/** [length, width] with the length always the longer side. */
function dims(d: Level): [number, number] {
  for (;;) {
    const [l, w] = d === 1 ? [randInt(4, 12), randInt(2, 9)] : d === 2 ? [randInt(11, 25), randInt(4, 12)] : [randInt(15, 40), randInt(11, 25)];
    if (l > w) return [l, w];
  }
}

function squareUnits(d: Level): Question {
  const rows = d === 1 ? randInt(3, 6) : d === 2 ? randInt(5, 9) : randInt(9, 12);
  const cols = d === 1 ? randInt(4, 8) : d === 2 ? randInt(6, 12) : randInt(10, 12);
  return ask(
    "How many square units cover this rectangle?",
    rows * cols,
    "Count the squares in one row, then multiply by the number of rows: area = rows × columns.",
    { suffix: "square units", visual: { type: "array", rows, cols, emoji: "🟩" } },
  );
}

function rectangleArea(d: Level): Question {
  const [l, w] = dims(d);
  const t = pick(AREA_THINGS);
  return ask(
    `A rectangular ${t.thing} is ${l} ${t.unit} long and ${w} ${t.unit} wide. What is its area?`,
    l * w,
    "Area of a rectangle = length × width. The answer is in square units.",
    { suffix: `${t.unit}²`, visual: { type: "emoji", emoji: t.emoji, caption: `${l} ${t.unit} × ${w} ${t.unit}` } },
  );
}

function rectanglePerimeter(d: Level): Question {
  const [l, w] = dims(d);
  const t = pick([
    { s: `A farmer is putting a fence around a rectangular field that is ${l} m long and ${w} m wide. How many metres of fence are needed?`, unit: "m" },
    { s: `${pick(NAMES)} is gluing ribbon around the edge of a rectangular poster ${l} cm long and ${w} cm wide. How much ribbon is needed?`, unit: "cm" },
    { s: `A rectangular park is ${l} m long and ${w} m wide. How far is it to walk once around the edge?`, unit: "m" },
  ]);
  return ask(t.s, 2 * (l + w), "Perimeter is the distance around: add all four sides, or work out 2 × (length + width).", { suffix: t.unit });
}

function squareQ(d: Level): Question {
  if (d === 1) {
    const s = randInt(2, 10);
    return ask(`A square tile has sides of ${s} cm. What is its area?`, s * s, "All four sides of a square are equal, so area = side × side.", {
      suffix: "cm²",
      visual: { type: "shape", shape: "square" },
    });
  }
  if (d === 2) {
    const s = randInt(5, 15);
    return chance(0.5)
      ? ask(`A square garden has sides of ${s} m. What is its area?`, s * s, "Area of a square = side × side.", { suffix: "m²", visual: { type: "shape", shape: "square" } })
      : ask(`A square has a perimeter of ${4 * s} cm. How long is each side?`, s, "A square has 4 equal sides, so divide the perimeter by 4.", {
          suffix: "cm",
          visual: { type: "shape", shape: "square" },
        });
  }
  const s = randInt(6, 20);
  return ask(
    `A square has a perimeter of ${4 * s} cm. What is its area?`,
    s * s,
    "Two steps: divide the perimeter by 4 to find one side, then multiply side × side for the area.",
    { suffix: "cm²", visual: { type: "shape", shape: "square" } },
  );
}

function missingSide(d: Level): Question {
  if (d === 3 && chance(0.6)) {
    const l = randInt(10, 30);
    const w = randInt(4, l - 1);
    return ask(
      `A rectangle has a perimeter of ${2 * (l + w)} m. Its length is ${l} m. What is its width?`,
      w,
      "Half the perimeter is one length plus one width. Find half the perimeter, then subtract the length.",
      { suffix: "m", visual: { type: "shape", shape: "rectangle" } },
    );
  }
  const l = d === 1 ? randInt(3, 10) : randInt(6, 15);
  const w = randInt(2, l - 1);
  return ask(
    `A rectangle has an area of ${l * w} cm². Its length is ${l} cm. What is its width?`,
    w,
    `Area = length × width, so ${l} × ? = ${l * w}. Divide the area by the length.`,
    { suffix: "cm", visual: { type: "shape", shape: "rectangle" } },
  );
}

function bestRectangle(d: Level): Question {
  if (d === 3) {
    const area = pick([24, 36, 48, 60, 72]);
    const pairs: [number, number][] = [];
    for (let w = 1; w * w <= area; w++) if (area % w === 0) pairs.push([area / w, w]);
    const best = pairs[pairs.length - 1];
    const label = ([l, w]: [number, number]) => `${l} m by ${w} m`;
    return choose(
      `These rectangles all have an area of ${area} m². Which one has the smallest perimeter?`,
      label(best),
      sample(pairs.slice(0, -1), 3).map(label),
      "Work out 2 × (length + width) for each one. For the same area, the closer the shape is to a square, the smaller the perimeter.",
    );
  }
  const half = randInt(d === 1 ? 8 : 10, d === 1 ? 10 : 16);
  const pairs: [number, number][] = [];
  for (let w = 1; w <= half / 2; w++) pairs.push([half - w, w]);
  const best = pairs[pairs.length - 1];
  const label = ([l, w]: [number, number]) => `${l} m by ${w} m`;
  return choose(
    `These rectangles all have a perimeter of ${2 * half} m. Which one has the greatest area?`,
    label(best),
    sample(pairs.slice(0, -1), 3).map(label),
    "Work out length × width for each one. For the same perimeter, the closer the shape is to a square, the greater the area.",
  );
}

function compareRectangles(d: Level): Question {
  const sameArea = chance(0.5);
  for (;;) {
    let a: [number, number];
    let b: [number, number];
    if (sameArea) {
      const area = pick(d === 1 ? [12, 16, 18, 20, 24] : [24, 30, 36, 40, 48, 60]);
      const pairs: [number, number][] = [];
      for (let w = 1; w * w <= area; w++) if (area % w === 0) pairs.push([area / w, w]);
      [a, b] = sample(pairs, 2);
    } else {
      const half = randInt(8, d === 1 ? 12 : 20);
      const w1 = randInt(1, Math.floor(half / 2));
      const w2 = randInt(1, Math.floor(half / 2));
      a = [half - w1, w1];
      b = [half - w2, w2];
    }
    if (a[1] === b[1]) continue;
    const per = (r: [number, number]) => 2 * (r[0] + r[1]);
    const ar = (r: [number, number]) => r[0] * r[1];
    const [va, vb] = sameArea ? [per(a), per(b)] : [ar(a), ar(b)];
    const what = sameArea ? "perimeter" : "area";
    const options = [`Rectangle A has the greater ${what}.`, `Rectangle B has the greater ${what}.`, `They have the same ${what}.`];
    return fixedChoice(
      `Rectangles A and B have the same ${sameArea ? "area" : "perimeter"}. Which statement is true?`,
      options,
      options[va > vb ? 0 : 1],
      sameArea ? "Find each perimeter: 2 × (length + width). Same area does not mean same perimeter!" : "Find each area: length × width. Same perimeter does not mean same area!",
      {
        type: "table",
        headers: ["Rectangle", "Length", "Width"],
        rows: [
          ["A", `${a[0]} cm`, `${a[1]} cm`],
          ["B", `${b[0]} cm`, `${b[1]} cm`],
        ],
      },
    );
  }
}

const AREA_IDEAS: { level: Level; prompt: string; right: string; wrong: string[]; hint: string }[] = [
  {
    level: 1,
    prompt: "Which unit is best for the area of a classroom floor?",
    right: "square metres (m²)",
    wrong: ["metres (m)", "square centimetres (cm²)", "kilograms (kg)"],
    hint: "Area is measured in square units. A floor is big, so use a big square unit.",
  },
  {
    level: 1,
    prompt: "Which unit is best for the area of a postage stamp?",
    right: "square centimetres (cm²)",
    wrong: ["square metres (m²)", "centimetres (cm)", "litres (L)"],
    hint: "Area is measured in square units. A stamp is small, so use a small square unit.",
  },
  {
    level: 1,
    prompt: "What does perimeter measure?",
    right: "The distance around a shape",
    wrong: ["The space inside a shape", "How heavy a shape is", "How many corners a shape has"],
    hint: "Think of walking along the edge of a shape: that distance is the perimeter.",
  },
  {
    level: 2,
    prompt: "A rectangle is 6 cm by 4 cm. If you double its length, what happens to its area?",
    right: "The area doubles.",
    wrong: ["The area stays the same.", "The area is 4 times as big.", "The area goes up by 2 cm²."],
    hint: "Try it: 6 × 4 = 24 cm². Now 12 × 4 = ? Compare the two areas.",
  },
  {
    level: 2,
    prompt: "Two rectangles have the same perimeter. Must they have the same area?",
    right: "No, their areas can be different.",
    wrong: ["Yes, always.", "Only if they are both red.", "Yes, if they are rectangles."],
    hint: "Try two rectangles with a perimeter of 20 m: 9 m by 1 m and 5 m by 5 m. Find both areas.",
  },
  {
    level: 3,
    prompt: "If you double both the length and the width of a rectangle, its area becomes…",
    right: "4 times as big",
    wrong: ["2 times as big", "the same", "8 times as big"],
    hint: "Try it with a 3 cm by 2 cm rectangle: area 6 cm². Then try 6 cm by 4 cm.",
  },
  {
    level: 3,
    prompt: "If you double the side length of a square, its perimeter becomes…",
    right: "2 times as long",
    wrong: ["4 times as long", "the same", "8 times as long"],
    hint: "Try it with a 3 cm square (perimeter 12 cm). Then try a 6 cm square.",
  },
];

function areaIdea(d: Level): Question {
  const item = pick(AREA_IDEAS.filter((i) => i.level <= d && i.level >= d - 1));
  return choose(item.prompt, item.right, shuffle(item.wrong), item.hint);
}

function areaPerimeter(d: Level): Question[] {
  return finish([
    squareUnits(d),
    rectangleArea(d),
    rectanglePerimeter(d),
    squareQ(d),
    missingSide(d),
    bestRectangle(d),
    compareRectangles(d),
    areaIdea(d),
  ]);
}

// ---------- Time & Duration ----------

/** Minutes after midnight → "3:45 p.m." */
function clockText(mins: number): string {
  const h24 = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h}:${String(m).padStart(2, "0")} ${h24 < 12 ? "a.m." : "p.m."}`;
}

function durText(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return [h ? `${h} h` : "", m ? `${m} min` : ""].filter(Boolean).join(" ");
}

const ACTIVITIES = ["Soccer practice", "A piano lesson", "A school concert", "A swim meet", "A bus trip", "A hike", "A science fair"];

function elapsedMinutes(d: Level): Question {
  let start: number;
  let dur: number;
  if (d === 1) {
    start = randInt(8, 16) * 60 + pick([0, 15, 30]);
    dur = randInt(4, 11) * 5;
  } else if (d === 2) {
    start = randInt(8 * 12, 16 * 12) * 5;
    dur = randInt(13, 23) * 5;
  } else {
    start = randInt(10 * 12, 11 * 12 + 9) * 5;
    dur = randInt(25, 50) * 5;
  }
  return ask(
    `${pick(ACTIVITIES)} starts at ${clockText(start)} and ends at ${clockText(start + dur)} How many minutes long is it?`,
    dur,
    "Count up from the start time: first to the next hour, then whole hours (60 minutes each), then the minutes left. Add the pieces.",
    { suffix: "min" },
  );
}

function endTimeOnClock(d: Level): Question {
  const start = randInt(13 * 12, 17 * 12 + 11) * 5;
  const dur = d === 1 ? randInt(4, 11) * 5 : d === 2 ? randInt(13, 23) * 5 : randInt(25, 40) * 5;
  const end = start + dur;
  const h24 = Math.floor(start / 60);
  return choose(
    `The clock shows when a movie starts in the afternoon. The movie is ${durText(dur)} long. What time does it end?`,
    clockText(end),
    shuffle([end + 60, end - 60, end + 10, end - 10, end + 30]).map(clockText),
    "Read the start time. Add the hours first, then the minutes. If the minutes reach 60 or more, that makes one more hour.",
    { type: "clock", hour: h24 % 12 === 0 ? 12 : h24 % 12, minute: start % 60 },
  );
}

function convertTime(d: Level): Question {
  if (d === 1) {
    if (chance(0.5)) {
      const h = randInt(2, 8);
      return ask(`How many minutes are in ${h} hours?`, 60 * h, "There are 60 minutes in 1 hour. Multiply the hours by 60.", { suffix: "min" });
    }
    const m = randInt(2, 9);
    return ask(`How many seconds are in ${m} minutes?`, 60 * m, "There are 60 seconds in 1 minute. Multiply the minutes by 60.", { suffix: "s" });
  }
  if (d === 2 || chance(0.5)) {
    const h = d === 2 ? randInt(1, 5) : randInt(6, 12);
    const m = randInt(1, 11) * 5;
    return ask(`How many minutes are in ${h} h ${m} min?`, 60 * h + m, "Change the hours to minutes (× 60), then add the extra minutes.", { suffix: "min" });
  }
  const m = randInt(3, 12);
  const s = randInt(1, 11) * 5;
  return ask(`How many seconds are in ${m} min ${s} s?`, 60 * m + s, "Change the minutes to seconds (× 60), then add the extra seconds.", { suffix: "s" });
}

function longerUnits(d: Level): Question {
  if (d === 1) {
    if (chance(0.5)) {
      const w = randInt(2, 9);
      return ask(`How many days are in ${w} weeks?`, 7 * w, "There are 7 days in 1 week. Multiply the weeks by 7.", { suffix: "days" });
    }
    const n = randInt(2, 5);
    return ask(`How many hours are in ${n} days?`, 24 * n, "There are 24 hours in 1 day. Multiply the days by 24.", { suffix: "h" });
  }
  if (d === 2) {
    if (chance(0.5)) {
      const w = randInt(2, 8);
      const x = randInt(1, 6);
      return ask(`How many days are in ${w} weeks and ${x} days?`, 7 * w + x, "Change the weeks to days (× 7), then add the extra days.", { suffix: "days" });
    }
    const n = randInt(6, 10);
    return ask(`How many hours are in ${n} days?`, 24 * n, "There are 24 hours in 1 day. Multiply by 24: try × 20 and × 4, then add.", { suffix: "h" });
  }
  return pick([
    () => {
      const n = randInt(1, 3);
      return ask(`How many minutes are in ${n} day${n > 1 ? "s" : ""}?`, 1440 * n, "Two steps: 1 day = 24 hours, and 1 hour = 60 minutes. Multiply 24 × 60 first.", { suffix: "min" });
    },
    () => {
      const w = randInt(2, 4);
      return ask(`How many hours are in ${w} weeks?`, 168 * w, "Two steps: 1 week = 7 days, and 1 day = 24 hours. Multiply 7 × 24 first.", { suffix: "h" });
    },
    () => {
      const h = randInt(1, 2);
      return ask(`How many seconds are in ${h} hour${h > 1 ? "s" : ""}?`, 3600 * h, "Two steps: 1 hour = 60 minutes, and 1 minute = 60 seconds. Multiply 60 × 60 first.", { suffix: "s" });
    },
  ])();
}

const DURATIONS: Record<Level, { label: string; s: number }[]> = {
  1: [
    { label: "30 seconds", s: 30 },
    { label: "5 minutes", s: 300 },
    { label: "1 hour", s: 3600 },
    { label: "1 day", s: 86400 },
    { label: "1 week", s: 604800 },
    { label: "1 year", s: 31536000 },
  ],
  2: [
    { label: "90 seconds", s: 90 },
    { label: "1 minute", s: 60 },
    { label: "45 minutes", s: 2700 },
    { label: "1 hour", s: 3600 },
    { label: "100 minutes", s: 6000 },
    { label: "2 hours", s: 7200 },
    { label: "36 hours", s: 129600 },
    { label: "1 day", s: 86400 },
    { label: "10 days", s: 864000 },
    { label: "1 week", s: 604800 },
  ],
  3: [
    { label: "100 seconds", s: 100 },
    { label: "2 minutes", s: 120 },
    { label: "150 seconds", s: 150 },
    { label: "75 minutes", s: 4500 },
    { label: "1 h 20 min", s: 4800 },
    { label: "1 h 10 min", s: 4200 },
    { label: "90 minutes", s: 5400 },
    { label: "48 hours", s: 172800 },
    { label: "3 days", s: 259200 },
    { label: "2 days 12 h", s: 216000 },
  ],
};

function orderDurations(d: Level): Question {
  const picked = sample(DURATIONS[d], 4).sort((a, b) => a.s - b.s);
  return orderQ(
    "Put these durations in order from shortest to longest.",
    picked.map((p) => p.label),
    "Change them to the same unit before comparing. Remember: 60 s = 1 min, 60 min = 1 h, 24 h = 1 day, 7 days = 1 week.",
  );
}

const STOPS = ["Library", "Community Centre", "Park", "Arena", "Hospital", "School", "Museum"];

function timetable(d: Level): Question {
  if (d === 3) {
    const runners = sample(NAMES, 4);
    const secs = sample(
      Array.from({ length: 211 }, (_, i) => 330 + i),
      4,
    );
    const show = (s: number) => `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, "0")} s`;
    return ask(
      "How many seconds faster was the fastest runner than the slowest runner?",
      Math.max(...secs) - Math.min(...secs),
      "Find the least time (fastest) and the greatest time (slowest). Change both to seconds (1 min = 60 s), then subtract.",
      { suffix: "s", visual: { type: "table", title: "1 km race results", headers: ["Runner", "Time"], rows: runners.map((r, i) => [r, show(secs[i])]) } },
    );
  }
  const stops = sample(STOPS, 4);
  const times = [randInt(7 * 12, 10 * 12) * 5];
  for (let i = 1; i < 4; i++) times.push(times[i - 1] + (d === 1 ? randInt(2, 6) * 5 : randInt(3, 9) * 5 + randInt(0, 4)));
  const i = d === 1 ? randInt(0, 2) : randInt(0, 1);
  const j = d === 1 ? i + 1 : randInt(i + 2, 3);
  return ask(
    `How many minutes does the bus take to go from the ${stops[i]} to the ${stops[j]}?`,
    times[j] - times[i],
    "Find both times in the schedule. Count up from the earlier time to the later time, using the next hour as a stepping stone.",
    { suffix: "min", visual: { type: "table", title: "Bus schedule", headers: ["Stop", "Time"], rows: stops.map((s, k) => [s, clockText(times[k])]) } },
  );
}

function workBackwards(d: Level): Question {
  const name = pick(NAMES);
  const arrive = randInt(8 * 4, 9 * 4) * 15;
  if (d === 1) {
    const a = randInt(3, 11) * 5;
    return choose(
      `The walk to school takes ${a} minutes. ${name} needs to arrive by ${clockText(arrive)} What is the latest time ${name} can leave home?`,
      clockText(arrive - a),
      shuffle([arrive + a, arrive - a - 10, arrive - a + 10, arrive - 60]).map(clockText),
      "Work backwards: start at the arrival time and count back the minutes of the walk.",
    );
  }
  const a = randInt(4, 12) * 5;
  const b = randInt(2, 8) * 5 + (d === 3 ? pick([2, 3, 4]) : 0);
  const total = a + b;
  return choose(
    `${name} needs to be at school by ${clockText(arrive)} Getting ready takes ${a} minutes and the walk takes ${b} minutes. What is the latest time ${name} can start getting ready?`,
    clockText(arrive - total),
    shuffle([arrive - a, arrive - b, arrive + total, arrive - total - 10, arrive - total + 10]).map(clockText),
    "Add the two durations to find the total time needed. Then count back that much from the arrival time.",
  );
}

const TIME_SENSE: { prompt: string; right: string; wrong: string[] }[] = [
  { prompt: "About how long does it take to brush your teeth?", right: "2 minutes", wrong: ["2 seconds", "2 hours", "2 days"] },
  { prompt: "About how long is a school day?", right: "6 hours", wrong: ["6 minutes", "6 days", "60 seconds"] },
  { prompt: "About how long is a professional soccer game?", right: "90 minutes", wrong: ["90 seconds", "90 hours", "9 days"] },
  { prompt: "About how long are the summer holidays?", right: "about 2 months", wrong: ["about 2 days", "about 2 hours", "about 2 years"] },
  { prompt: "About how long does a blink of an eye take?", right: "less than 1 second", wrong: ["about 1 minute", "about 10 minutes", "about 1 hour"] },
  { prompt: "About how long does it take to walk 1 km?", right: "about 15 minutes", wrong: ["about 15 seconds", "about 15 hours", "about 15 days"] },
  { prompt: "About how long is a flight across Canada?", right: "about 5 hours", wrong: ["about 5 minutes", "about 5 days", "about 5 weeks"] },
  { prompt: "About how long does it take a pumpkin to grow from a seed?", right: "about 3 months", wrong: ["about 3 hours", "about 3 days", "about 3 years"] },
];

function timeSense(): Question {
  const t = pick(TIME_SENSE);
  return choose(
    t.prompt,
    t.right,
    shuffle(t.wrong),
    "Picture it happening. Is it over in moments, minutes, hours, days or months?",
  );
}

function time(d: Level): Question[] {
  return finish([
    elapsedMinutes(d),
    endTimeOnClock(d),
    convertTime(d),
    longerUnits(d),
    orderDurations(d),
    timetable(d),
    workBackwards(d),
    timeSense(),
  ]);
}

// ---------- Prisms, Pyramids & Transformations ----------

const BASES = [
  { n: 3, prism: "triangular prism", pyramid: "triangular pyramid", base: "triangle" },
  { n: 4, prism: "rectangular prism", pyramid: "square pyramid", base: "rectangle" },
  { n: 5, prism: "pentagonal prism", pyramid: "pentagonal pyramid", base: "pentagon" },
  { n: 6, prism: "hexagonal prism", pyramid: "hexagonal pyramid", base: "hexagon" },
  { n: 8, prism: "octagonal prism", pyramid: "octagonal pyramid", base: "octagon" },
];

function basesFor(d: Level) {
  return d === 1 ? BASES.slice(0, 2) : d === 2 ? BASES.slice(0, 4) : BASES.slice(2);
}

function nameSolid(d: Level): Question {
  const b = pick(basesFor(d));
  const others = BASES.filter((x) => x !== b);
  if (chance(0.5)) {
    const baseWord = b.n === 4 ? "rectangle" : b.base;
    return choose(
      `A 3D object has 2 matching ${baseWord} bases and ${b.n} rectangular faces joining them. What is it?`,
      b.prism,
      shuffle([b.pyramid, ...sample(others, 2).map((o) => o.prism), pick(others).pyramid]),
      "Two matching bases joined by rectangles make a prism. Name it after the shape of its bases.",
    );
  }
  const baseWord = b.n === 4 ? "square" : b.base;
  return choose(
    `A 3D object has 1 ${baseWord} base and ${b.n} triangular faces that meet at a point. What is it?`,
    b.pyramid,
    shuffle([b.prism, ...sample(others, 2).map((o) => o.pyramid), pick(others).prism]),
    "One base with triangles meeting at a point (the apex) makes a pyramid. Name it after the shape of its base.",
  );
}

function countFaces(d: Level): Question {
  const b = pick(basesFor(d));
  const prism = chance(0.5);
  return ask(
    `How many faces does a ${prism ? b.prism : b.pyramid} have?`,
    prism ? b.n + 2 : b.n + 1,
    prism
      ? "A prism has 2 bases plus 1 rectangular face for each side of the base."
      : "A pyramid has 1 base plus 1 triangular face for each side of the base.",
    b.n === 4 ? { visual: { type: "shape", shape: prism ? "rectangular-prism" : "pyramid" } } : {},
  );
}

function countEdgesVertices(d: Level): Question {
  const b = pick(basesFor(d));
  const prism = chance(0.5);
  const edges = d === 1 ? false : chance(0.5);
  const name = prism ? b.prism : b.pyramid;
  const ans = edges ? (prism ? 3 * b.n : 2 * b.n) : prism ? 2 * b.n : b.n + 1;
  const hint = edges
    ? prism
      ? "Each base has as many edges as it has sides, and there is one more edge joining each pair of matching corners."
      : "Count the edges around the base, then add one edge from each base corner up to the apex."
    : prism
      ? "Each base has as many corners as it has sides, and a prism has 2 bases."
      : "Count the corners of the base, then add 1 for the apex (the point at the top).";
  return ask(`How many ${edges ? "edges" : "vertices (corners)"} does a ${name} have?`, ans, hint);
}

function whichSolid(): Question {
  const kind = pick(["prism", "pyramid", "neither"] as const);
  const opt = (s: ShapeName) => ({ label: s.replace("-", " "), shape: s });
  if (kind === "prism") {
    const right = pick(["cube", "rectangular-prism"] as ShapeName[]);
    return choose(
      "Which of these is a prism?",
      opt(right),
      sample(["pyramid", "cone", "cylinder", "sphere"] as ShapeName[], 3).map(opt),
      "A prism has 2 matching flat bases, and all its other faces are rectangles. It has no curved surfaces.",
    );
  }
  if (kind === "pyramid") {
    return choose(
      "Which of these is a pyramid?",
      opt("pyramid"),
      sample(["cone", "cube", "rectangular-prism", "cylinder"] as ShapeName[], 3).map(opt),
      "A pyramid has 1 flat base and triangular faces that meet at a point. A cone has a point too, but its base is a circle and its surface is curved.",
    );
  }
  const right = pick(["cylinder", "cone", "sphere"] as ShapeName[]);
  return choose(
    "Which of these is NOT a prism or a pyramid?",
    opt(right),
    ["cube", "rectangular-prism", "pyramid"].map((s) => opt(s as ShapeName)),
    "Prisms and pyramids have only flat faces. Look for a curved surface.",
  );
}

const SOLID_IDEAS: { prompt: string; right: string; wrong: string[]; hint: string }[] = [
  {
    prompt: "What do all prisms have?",
    right: "2 matching bases joined by rectangles",
    wrong: ["1 base and a point at the top", "Only triangular faces", "A curved surface"],
    hint: "Think of a box or a tent: the shapes at both ends match.",
  },
  {
    prompt: "What shape are the faces that meet at the top point of a pyramid?",
    right: "triangles",
    wrong: ["rectangles", "circles", "pentagons"],
    hint: "The faces of a pyramid rise from the base edges and meet at one point, the apex.",
  },
  {
    prompt: "Prisms and pyramids get their names from the shape of their…",
    right: "base",
    wrong: ["height", "colour", "number of vertices"],
    hint: "A hexagonal prism has hexagon bases; a square pyramid has a square base.",
  },
  {
    prompt: "A tent has a triangle shape at the front and back. What 3D object is it shaped like?",
    right: "triangular prism",
    wrong: ["triangular pyramid", "rectangular prism", "cone"],
    hint: "The front and back are 2 matching triangles, joined by rectangles.",
  },
  {
    prompt: "A new, unsharpened pencil has 6 flat sides. What 3D object is it shaped like?",
    right: "hexagonal prism",
    wrong: ["hexagonal pyramid", "cylinder", "pentagonal prism"],
    hint: "Both ends are matching hexagons (6 sides), joined by rectangles.",
  },
  {
    prompt: "The ancient pyramids of Egypt have square bases. What 3D object is each one?",
    right: "square pyramid",
    wrong: ["rectangular prism", "triangular pyramid", "cube"],
    hint: "One square base, with 4 triangular faces meeting at the top.",
  },
];

function solidIdea(d: Level): Question {
  if (d === 3 && chance(0.5)) {
    const [p, q] = sample(BASES, 2);
    const prismEdges = 3 * p.n;
    const pyrEdges = 2 * q.n;
    if (prismEdges !== pyrEdges) {
      return choose(
        `Which has more edges: a ${p.prism} or a ${q.pyramid}?`,
        prismEdges > pyrEdges ? `the ${p.prism}` : `the ${q.pyramid}`,
        [prismEdges > pyrEdges ? `the ${q.pyramid}` : `the ${p.prism}`, "They have the same number"],
        "A prism with an n-sided base has 3 × n edges. A pyramid with an n-sided base has 2 × n edges.",
      );
    }
  }
  const item = pick(SOLID_IDEAS);
  return choose(item.prompt, item.right, shuffle(item.wrong), item.hint);
}

function slide(both: boolean) {
  for (;;) {
    let dx = randInt(-6, 6);
    let dy = both ? randInt(-6, 6) : 0;
    if (dx === 0 || (both && dy === 0)) continue;
    if (both && Math.abs(dx) === Math.abs(dy)) continue;
    if (!both && chance(0.5)) [dx, dy] = [dy, dx];
    const x1 = randInt(0, 10);
    const y1 = randInt(0, 10);
    const x2 = x1 + dx;
    const y2 = y1 + dy;
    if (x2 < 0 || x2 > 10 || y2 < 0 || y2 > 10) continue;
    const visual: Visual = {
      type: "grid",
      size: 10,
      points: [
        { x: x1, y: y1, label: "A" },
        { x: x2, y: y2, label: "A′" },
      ],
    };
    return { dx, dy, visual };
  }
}

const units = (n: number) => `${n} unit${n === 1 ? "" : "s"}`;

function translationInput(d: Level): Question {
  const { dx, dy, visual } = slide(d > 1);
  const across = dx !== 0 && (dy === 0 || chance(0.5));
  const dir = across ? (dx > 0 ? "right" : "left") : dy > 0 ? "up" : "down";
  return ask(
    `Point A was translated (slid) to A′. How many units ${dir} did it move?`,
    Math.abs(across ? dx : dy),
    across
      ? "Count the grid squares from A to A′ going straight across (left or right) only."
      : "Count the grid squares from A to A′ going straight up or down only.",
    { visual },
  );
}

function translationChoice(): Question {
  const { dx, dy, visual } = slide(true);
  const h = (n: number) => `${units(Math.abs(n))} ${n > 0 ? "right" : "left"}`;
  const v = (n: number) => `${units(Math.abs(n))} ${n > 0 ? "up" : "down"}`;
  return choose(
    "Which describes the translation from A to A′?",
    `${h(dx)}, ${v(dy)}`,
    shuffle([`${h(Math.sign(dx) * Math.abs(dy))}, ${v(Math.sign(dy) * Math.abs(dx))}`, `${h(-dx)}, ${v(dy)}`, `${h(dx)}, ${v(-dy)}`]),
    "Count how far A moves across (right or left) first, then how far it moves up or down.",
    visual,
  );
}

const MOVES = {
  translation: "translation (slide)",
  reflection: "reflection (flip)",
  rotation: "rotation (turn)",
};
type Move = keyof typeof MOVES;

const MOVE_ITEMS: { prompt: string; letter?: string; answer: Move }[] = [
  { prompt: "Which single transformation changes the first letter into the second?", letter: "b → d", answer: "reflection" },
  { prompt: "Which single transformation changes the first letter into the second?", letter: "b → p", answer: "reflection" },
  { prompt: "Which single transformation changes the first letter into the second?", letter: "p → q", answer: "reflection" },
  { prompt: "Which single transformation changes the first letter into the second (a half turn)?", letter: "p → d", answer: "rotation" },
  { prompt: "Which single transformation changes the first letter into the second (a half turn)?", letter: "b → q", answer: "rotation" },
  { prompt: "A shape slides 4 units to the right without turning or flipping. What transformation is this?", answer: "translation" },
  { prompt: "A shape is flipped over a line to make a mirror image. What transformation is this?", answer: "reflection" },
  { prompt: "A shape turns a quarter turn around one of its corners. What transformation is this?", answer: "rotation" },
  { prompt: "The hands of a clock move around its centre. What transformation is this?", answer: "rotation" },
  { prompt: "An elevator carries a box straight up 3 floors. What transformation moves the box?", answer: "translation" },
  { prompt: "You see your face in a mirror. What transformation makes the mirror image?", answer: "reflection" },
];

function nameMove(): Question {
  const item = pick(MOVE_ITEMS);
  return fixedChoice(
    item.prompt,
    Object.values(MOVES),
    MOVES[item.answer],
    "A translation slides (no turning or flipping). A reflection flips over a line, like a mirror. A rotation turns around a point.",
    item.letter ? { type: "letter", text: item.letter } : undefined,
  );
}

function shapesMoves(d: Level): Question[] {
  return finish([
    nameSolid(d),
    countFaces(d),
    countEdgesVertices(d),
    whichSolid(),
    solidIdea(d),
    translationInput(d),
    nameMove(),
    translationChoice(),
  ]);
}

// ---------- Graphs & Chance ----------

const DOUBLE_GRAPHS: {
  title: string;
  head: string;
  groups: [string, string];
  cats: string[];
  unit: string;
  read: (g: string, c: string) => string;
  diff: (more: string, less: string, c: string) => string;
  total: (g: string) => string;
  which: (g: string, other: string) => string;
}[] = [
  {
    title: "Books read",
    head: "Month",
    groups: ["Class A", "Class B"],
    cats: ["September", "October", "November", "December"],
    unit: "books",
    read: (g, c) => `How many books did ${g} read in ${c}?`,
    diff: (m, l, c) => `In ${c}, how many more books did ${m} read than ${l}?`,
    total: (g) => `How many books did ${g} read altogether?`,
    which: (g, o) => `In which month did ${g} read more books than ${o}?`,
  },
  {
    title: "Favourite sports",
    head: "Sport",
    groups: ["Grade 4", "Grade 5"],
    cats: ["Soccer", "Hockey", "Basketball", "Swimming"],
    unit: "votes",
    read: (g, c) => `How many students in ${g} voted for ${c.toLowerCase()}?`,
    diff: (m, l, c) => `How many more students in ${m} than in ${l} voted for ${c.toLowerCase()}?`,
    total: (g) => `How many students in ${g} voted altogether?`,
    which: (g, o) => `Which sport got more votes from ${g} than from ${o}?`,
  },
  {
    title: "Cans collected",
    head: "Week",
    groups: ["Room 1", "Room 2"],
    cats: ["Week 1", "Week 2", "Week 3", "Week 4"],
    unit: "cans",
    read: (g, c) => `How many cans did ${g} collect in ${c}?`,
    diff: (m, l, c) => `In ${c}, how many more cans did ${m} collect than ${l}?`,
    total: (g) => `How many cans did ${g} collect altogether?`,
    which: (g, o) => `In which week did ${g} collect more cans than ${o}?`,
  },
  {
    title: "Visitors to the pool",
    head: "Time",
    groups: ["Saturday", "Sunday"],
    cats: ["Morning", "Afternoon", "Evening"],
    unit: "visitors",
    read: (g, c) => `How many visitors came to the pool on ${g} ${c.toLowerCase()}?`,
    diff: (m, l, c) => `In the ${c.toLowerCase()}, how many more visitors came on ${m} than on ${l}?`,
    total: (g) => `How many visitors came to the pool on ${g} altogether?`,
    which: (g, o) => `At which time of day did more visitors come on ${g} than on ${o}?`,
  },
];

const SQ_A = "🟦";
const SQ_B = "🟧";

/** A double bar graph drawn with squares, where each square stands for several items. */
function doubleGraph(d: Level) {
  const g = pick(DOUBLE_GRAPHS);
  const k = d === 1 ? 2 : d === 2 ? 5 : pick([10, 25]);
  const n = g.cats.length;
  const special = randInt(0, n - 1);
  const a: number[] = [];
  const b: number[] = [];
  for (let i = 0; i < n; i++) {
    const x = randInt(2, 7);
    // Group B beats group A in exactly one category.
    const y = i === special ? randInt(x + 1, 8) : randInt(1, x);
    a.push(x);
    b.push(y);
  }
  const visual: Visual = {
    type: "table",
    title: `${g.title} (each square = ${k} ${g.unit})`,
    headers: [g.head, `${SQ_A} ${g.groups[0]}`, `${SQ_B} ${g.groups[1]}`],
    rows: g.cats.map((c, i) => [c, SQ_A.repeat(a[i]), SQ_B.repeat(b[i])]),
  };
  return { g, k, a, b, special, visual };
}

function readDouble(d: Level): Question {
  const { g, k, a, b, visual } = doubleGraph(d);
  const i = randInt(0, g.cats.length - 1);
  const second = chance(0.5);
  return ask(
    g.read(g.groups[second ? 1 : 0], g.cats[i]),
    (second ? b[i] : a[i]) * k,
    `Count the squares in that bar, then multiply by ${k}, because each square stands for ${k} ${g.unit}.`,
    { visual },
  );
}

function differenceDouble(d: Level): Question {
  const { g, k, a, b, visual } = doubleGraph(d);
  let i: number;
  do i = randInt(0, g.cats.length - 1);
  while (a[i] === b[i]);
  const aMore = a[i] > b[i];
  return ask(
    g.diff(aMore ? g.groups[0] : g.groups[1], aMore ? g.groups[1] : g.groups[0], g.cats[i]),
    Math.abs(a[i] - b[i]) * k,
    `Find how many more squares one bar has than the other, then multiply by ${k}. Or find both amounts and subtract.`,
    { visual },
  );
}

function whichDouble(d: Level): Question {
  const { g, special, visual } = doubleGraph(d);
  return choose(
    g.which(g.groups[1], g.groups[0]),
    g.cats[special],
    g.cats.filter((_, i) => i !== special),
    `Compare the ${SQ_A} and ${SQ_B} bars for each row. Look for the row where the ${SQ_B} bar is longer.`,
    visual,
  );
}

function totalDouble(d: Level): Question {
  const { g, k, a, b, visual } = doubleGraph(d);
  const second = chance(0.5);
  const squares = (second ? b : a).reduce((s, x) => s + x, 0);
  return ask(
    g.total(g.groups[second ? 1 : 0]),
    squares * k,
    `Count all the ${second ? SQ_B : SQ_A} squares, then multiply by ${k}.`,
    { visual },
  );
}

const BAR_GRAPHS: { title: string; labels: string[]; ask: (l: string) => string }[] = [
  { title: "Kilometres cycled this month", labels: NAMES, ask: (l) => `How many kilometres did ${l} cycle this month?` },
  { title: "Students in each club", labels: ["Art", "Chess", "Coding", "Choir", "Drama"], ask: (l) => `How many students are in the ${l} club?` },
  { title: "Pages read this week", labels: NAMES, ask: (l) => `How many pages did ${l} read this week?` },
];

function readBars(d: Level): Question {
  const graph = pick(BAR_GRAPHS);
  const labels = sample(graph.labels, 4);
  let values: number[];
  if (d === 1) values = labels.map(() => randInt(1, 10) * 5);
  else if (d === 2) values = labels.map(() => randInt(1, 10) * 10);
  else values = labels.map(() => randInt(1, 20) * 5);
  // Keep the scale predictable: count by 5s (Grade 1 level) or by 10s.
  values[randInt(0, 3)] = d === 1 ? randInt(5, 10) * 5 : randInt(6, 10) * 10;
  let i = randInt(0, 3);
  if (d === 3) {
    const odd = values.findIndex((v) => v % 10 === 5);
    if (odd >= 0) i = odd;
  }
  const step = d === 1 ? 5 : 10;
  return ask(
    graph.ask(labels[i]),
    values[i],
    `Each grid line on this graph counts by ${step}. Find where the top of the bar lines up${d === 3 ? "; halfway between two lines is half a step" : ""}.`,
    { visual: { type: "bars", title: graph.title, bars: labels.map((label, j) => ({ label, value: values[j] })) } },
  );
}

function scaleKey(d: Level): Question {
  const k = d === 1 ? 2 : d === 2 ? 5 : pick([10, 50]);
  const s = randInt(3, 9);
  const mode = d === 3 ? pick(["count", "per", "half"]) : pick(["count", "per"]);
  if (mode === "count") {
    return numChoice(
      `On a graph, each ⭐ stands for ${k} votes. How many ⭐ are needed to show ${s * k} votes?`,
      s,
      shuffle([s + 1, s - 1, s * k, s * 2]),
      `Divide the votes by ${k}, because each ⭐ is worth ${k}.`,
    );
  }
  if (mode === "per") {
    return numChoice(
      `On a graph, ${s} ⭐ show ${s * k} votes. How many votes does each ⭐ stand for?`,
      k,
      shuffle([k * 2, k + 1, s, s * k]),
      `Share the ${s * k} votes equally among the ${s} stars: divide.`,
    );
  }
  return numChoice(
    `Each ⭐ stands for ${k} votes. A row shows ${s} and a half ⭐. How many votes is that?`,
    s * k + k / 2,
    shuffle([s * k, s * k + 1, (s + 1) * k, s * k + k / 10]),
    `${s} whole stars are ${s} × ${k}. Half a star is half of ${k}. Add them.`,
    { type: "emojiRow", items: [...Array(s).fill("⭐"), "½"] },
  );
}

const SPIN_COLOURS = [
  { name: "red", hex: "#ef4444", emoji: "🔴" },
  { name: "blue", hex: "#3b82f6", emoji: "🔵" },
  { name: "green", hex: "#22c55e", emoji: "🟢" },
  { name: "yellow", hex: "#facc15", emoji: "🟡" },
];

function spinnerProbability(d: Level): Question {
  const total = d === 1 ? 4 : d === 2 ? pick([6, 8]) : pick([8, 10, 12]);
  const [main, ...rest] = sample(SPIN_COLOURS, 3);
  const c = randInt(1, total - 2);
  const r1 = randInt(1, total - c - 1);
  const segments = shuffle([...Array(c).fill(main.hex), ...Array(r1).fill(rest[0].hex), ...Array(total - c - r1).fill(rest[1].hex)]);
  const answer = `${c}/${total}`;
  return ask(
    `The spinner has ${total} equal sections. What is the probability that it lands on ${main.name}? Write it as a fraction.`,
    answer,
    `Probability = number of ${main.name} sections ÷ total number of equal sections. Any equivalent fraction counts.`,
    { keypad: "fraction", visual: { type: "spinner", segments }, accept: equivalentForms(c, total).filter((f) => f !== answer) },
  );
}

function bagProbability(d: Level): Question {
  const cols = sample(SPIN_COLOURS, 3);
  let counts: number[];
  do counts = cols.map(() => randInt(1, d === 1 ? 5 : 6));
  while (new Set(counts).size < 3);
  const total = counts.reduce((s, x) => s + x, 0);
  const visual: Visual = { type: "emojiRow", items: cols.flatMap((c, i) => Array(counts[i]).fill(c.emoji)) };
  if (d === 1) {
    const best = counts.indexOf(Math.max(...counts));
    return choose(
      "You pick one marble from this bag without looking. Which colour are you most likely to pick?",
      { label: cols[best].name, emoji: cols[best].emoji },
      cols.filter((_, i) => i !== best).map((c) => ({ label: c.name, emoji: c.emoji })),
      "The colour with the most marbles has the greatest chance of being picked.",
      visual,
    );
  }
  const i = randInt(0, 2);
  const not = d === 3 && chance(0.5);
  const favourable = not ? total - counts[i] : counts[i];
  const value = favourable / total;
  const cands: [number, number][] = [
    [favourable, total - favourable],
    [total - favourable, total],
    [1, 3],
    [favourable, total + 1],
  ];
  return choose(
    `You pick one marble from this bag without looking. What is the probability that it is ${not ? "NOT " : ""}${cols[i].name}?`,
    `${favourable}/${total}`,
    shuffle(cands.filter(([x, y]) => y > 0 && Math.abs(x / y - value) > 1e-9).map(([x, y]) => `${x}/${y}`)),
    `Probability = number of ${not ? "marbles that are not " + cols[i].name : cols[i].name + " marbles"} ÷ total number of marbles.`,
    visual,
  );
}

function experiment(d: Level): Question {
  const name = pick(NAMES);
  const kind = d === 1 ? pick(["die", "coin"]) : d === 2 ? pick(["die", "coin", "streak"]) : pick(["die", "streak", "results"]);
  if (kind === "die") {
    const N = pick(d === 1 ? [30, 60] : [60, 120, 300]);
    const face = randInt(1, 6);
    return choose(
      `${name} rolls a number cube (1 to 6) ${N} times. About how many times would you expect to roll a ${face}?`,
      `about ${N / 6}`,
      shuffle([`about ${N / 2}`, `about ${N / 3}`, "about 6", `about ${N - N / 6}`]),
      `Each number has a 1 in 6 chance. Divide ${N} rolls into 6 equal shares.`,
    );
  }
  if (kind === "coin") {
    const N = pick([20, 50, 100, 200]);
    return choose(
      `${name} flips a coin ${N} times. About how many heads would you expect?`,
      `about ${N / 2}`,
      shuffle([`about ${N}`, "about 2", `about ${N / 10}`]),
      "Heads and tails are equally likely, so expect about half of the flips to be heads.",
    );
  }
  if (kind === "streak") {
    return choose(
      `${name} flipped a coin 10 times and got 7 heads. Which statement is true?`,
      "This can happen; small experiments often don't match what we expect.",
      shuffle(["The coin must be broken.", "The next flip will surely be tails.", "Every 10 flips will give 7 heads."]),
      "Each flip is still a 1 in 2 chance. With only a few flips, results can be uneven; with many flips, they get closer to half.",
    );
  }
  const cols = sample(SPIN_COLOURS, 3);
  let counts: number[];
  do counts = cols.map(() => randInt(3, 25));
  while (new Set(counts).size < 3);
  const best = counts.indexOf(Math.max(...counts));
  return choose(
    "These are the results of spinning a spinner many times. Which colour probably covers the most space on the spinner?",
    { label: cols[best].name, emoji: cols[best].emoji },
    cols.filter((_, i) => i !== best).map((c) => ({ label: c.name, emoji: c.emoji })),
    "The bigger a colour's section, the more often the spinner lands on it. Look for the greatest count.",
    { type: "table", title: "Spinner results", headers: ["Colour", "Times landed"], rows: cols.map((c, i) => [`${c.emoji} ${c.name}`, counts[i]]) },
  );
}

function dataChance(d: Level): Question[] {
  return finish([
    readDouble(d),
    differenceDouble(d),
    whichDouble(d),
    pick([totalDouble, readBars])(d),
    scaleKey(d),
    spinnerProbability(d),
    bagProbability(d),
    experiment(d),
  ]);
}

// ---------- Money & Budgets ----------

const SMALL_ITEMS = ["A sandwich", "A notebook", "A smoothie", "A pack of markers", "A pair of mitts", "A comic book"];
const MID_ITEMS = ["A board game", "A backpack", "A pair of running shoes", "A soccer ball", "A winter hat and scarf"];
const BIG_ITEMS = ["A bike", "A tablet", "A tent", "A guitar", "A set of hockey gear", "A desk"];

function makeChange(d: Level): Question {
  const name = pick(NAMES);
  let price: number;
  let paid: number;
  let item: string;
  if (d === 1) {
    price = randInt(21, 395) * 5;
    paid = price < 1000 ? 1000 : 2000;
    item = pick(SMALL_ITEMS);
  } else if (d === 2) {
    price = randInt(401, 1990) * 5;
    paid = price <= 5000 ? 5000 : 10000;
    item = pick(MID_ITEMS);
  } else {
    price = randInt(2001, 19990) * 5;
    paid = chance(0.5) ? Math.ceil(price / 10000) * 10000 : Math.ceil(price / 5000) * 5000;
    if (paid === price) paid += 5000;
    item = pick(BIG_ITEMS);
  }
  return ask(
    `${item} costs ${cash(price)}. ${name} pays with ${dollars(paid / 100)}. How much change, in dollars, should ${name} get?`,
    cashAnswer(paid - price),
    "Count up from the price: first to the next dollar, then to the next ten dollars, then to the amount paid. Add up the jumps.",
    { keypad: "decimal" },
  );
}

function changeWithCoins(d: Level): CoinsQuestion {
  let price: number;
  let paid: number;
  let coins: number[];
  let item: string;
  if (d === 1) {
    price = randInt(5, 95) * 5;
    paid = 500;
    coins = [5, 10, 25, 100, 200];
    item = pick(["A granola bar", "A pencil case", "A muffin", "A bottle of water"]);
  } else if (d === 2) {
    price = randInt(101, 395) * 5;
    paid = 2000;
    coins = [5, 10, 25, 100, 200, 500, 1000];
    item = pick(SMALL_ITEMS);
  } else {
    price = randInt(401, 1995) * 5;
    paid = 10000;
    coins = [5, 10, 25, 100, 200, 500, 1000, 2000];
    item = pick(MID_ITEMS);
  }
  return {
    kind: "coins",
    prompt: `${item} costs ${cash(price)}. You pay with a ${dollars(paid / 100)} bill. Show the change.`,
    hint: "Count up from the price with coins: reach the next quarter or dollar first, then use bigger coins and bills to reach the amount paid.",
    target: paid - price,
    coins,
  };
}

function countMoney(d: Level): Question {
  const plan: [number, number][] =
    d === 1
      ? [[1000, 1], [500, 1], [200, 2], [100, 2], [25, 3], [10, 2], [5, 1]]
      : d === 2
        ? [[2000, 2], [1000, 1], [500, 1], [200, 2], [100, 2], [25, 3], [10, 2], [5, 1]]
        : [[5000, 2], [2000, 2], [1000, 1], [500, 1], [200, 2], [100, 1], [25, 3], [10, 2], [5, 1]];
  let coins: number[];
  do coins = plan.flatMap(([c, max]) => Array(randInt(0, max)).fill(c));
  while (coins.length < 4 || coins.length > 10);
  const total = coins.reduce((s, c) => s + c, 0);
  return numChoice(
    "How much money is shown?",
    total,
    shuffle([total + 25, total - 25, total + 100, total - 100, total + 500, total - 10]).filter((w) => w > 0),
    "Start with the bill or coin worth the most, then count on with the rest from greatest to least.",
    { type: "coins", coins },
    cash,
  );
}

function savingsPlan(d: Level): Question {
  const name = pick(NAMES);
  const item = pick(["skateboard", "art set", "pair of skates", "telescope", "keyboard"]);
  if (d < 3) {
    const s = d === 1 ? pick([4, 5, 8, 10]) : randInt(6, 25);
    const w = d === 1 ? randInt(3, 10) : randInt(6, 15);
    return ask(
      `${name} saves ${dollars(s)} each week for a ${item} that costs ${dollars(s * w)}. How many weeks will it take?`,
      w,
      `Find how many groups of ${dollars(s)} make ${dollars(s * w)}: divide, or count up week by week.`,
      { suffix: "weeks" },
    );
  }
  const h = randInt(10, 60);
  const s = randInt(8, 25);
  const w = randInt(5, 12);
  const goal = h + s * w - randInt(0, s - 1);
  return ask(
    `${name} already has ${dollars(h)} and saves ${dollars(s)} every week. A ${item} costs ${dollars(goal)}. After how many weeks will ${name} have enough?`,
    w,
    "First subtract what is already saved from the cost. Then find how many weeks of saving cover the rest. If it doesn't divide evenly, one more week is needed.",
    { suffix: "weeks" },
  );
}

const EXPENSES: [string, number, number][] = [
  ["Snacks", 6, 20],
  ["Bus fare", 10, 25],
  ["Gift for a friend", 10, 30],
  ["Movie ticket", 12, 18],
  ["Art supplies", 5, 25],
  ["Donation to the food bank", 5, 15],
  ["Book", 8, 20],
];

function budgetTable(d: Level): Question {
  const name = pick(NAMES);
  const picked = sample(EXPENSES, d === 1 ? 2 : 3);
  if (d === 3) {
    const costs = picked.map(([, lo, hi]) => randInt(lo * 100, hi * 300));
    const spent = costs.reduce((s, c) => s + c, 0);
    const income = Math.ceil((spent + randInt(1000, 8000)) / 500) * 500;
    return ask(
      `${name} made this plan for the month. How much money, in dollars, is left to save?`,
      cashAnswer(income - spent),
      "Add up all the spending. Then subtract that total from the money earned. Line up the decimal points.",
      {
        keypad: "decimal",
        visual: {
          type: "table",
          title: `${name}'s monthly plan`,
          headers: ["Item", "Amount"],
          rows: [["Money earned", cash(income)], ...picked.map(([label], i) => [label, cash(costs[i])])],
        },
      },
    );
  }
  const scale = d === 1 ? 1 : 3;
  const costs = picked.map(([, lo, hi]) => randInt(lo, hi) * scale);
  const spent = costs.reduce((s, c) => s + c, 0);
  const income = Math.ceil((spent + randInt(5, 40)) / 5) * 5;
  return ask(
    `${name} made this plan for the month. How many dollars are left to save?`,
    income - spent,
    "Add up all the spending. Then subtract that total from the money earned.",
    {
      suffix: "dollars",
      visual: {
        type: "table",
        title: `${name}'s monthly plan`,
        headers: ["Item", "Amount"],
        rows: [["Money earned", dollars(income)], ...picked.map(([label], i) => [label, dollars(costs[i])])],
      },
    },
  );
}

function enoughMoney(d: Level): Question {
  const name = pick(NAMES);
  const budget = d === 1 ? 20 : d === 2 ? 50 : pick([200, 300, 500]);
  const count = d === 1 ? 2 : 3;
  let prices: number[];
  let total: number;
  do {
    prices = Array.from({ length: count }, () => randInt(Math.round((budget * 100) / (count + 1.5)), Math.round((budget * 100) / (count - 0.5))));
    total = prices.reduce((s, p) => s + p, 0);
  } while (Math.abs(total - budget * 100) < budget * 8);
  const enough = total <= budget * 100;
  const r = Math.round(total / 100);
  const off = budget >= 200 ? 50 : 10;
  const yes = (x: number) => `Yes, the total is about ${dollars(x)}.`;
  const no = (x: number) => `No, the total is about ${dollars(x)}.`;
  const right = enough ? yes(r) : no(r);
  return choose(
    `${name} has ${dollars(budget)} and wants to buy items costing ${prices.slice(0, -1).map(cash).join(", ")} and ${cash(prices[prices.length - 1])}. Is that enough money?`,
    right,
    shuffle([enough ? no(r) : yes(r), enough ? no(r + off) : yes(r - off), enough ? yes(r - off) : no(r + off)]),
    "Round each price to the nearest dollar and add the rounded prices. Then compare the estimate with the money you have.",
  );
}

const MONEY_IDEAS: { prompt: string; right: string; wrong: string[]; hint: string }[] = [
  {
    prompt: "What is a budget?",
    right: "A plan for how you will spend and save money",
    wrong: ["A list of things you want to buy", "Money you borrow from a bank", "The change you get back at a store"],
    hint: "A budget plans ahead: money coming in, money going out, and money saved.",
  },
  {
    prompt: "In a budget, what is income?",
    right: "Money you earn or receive",
    wrong: ["Money you spend", "Money you owe", "The price of an item"],
    hint: "Income comes in (like an allowance or pay for chores). Expenses go out.",
  },
  {
    prompt: "Which is the best first step in saving for something you want?",
    right: "Set a goal and decide how much to save each week",
    wrong: ["Spend your money first, then save what is left", "Buy it right away", "Never check how much you have saved"],
    hint: "A savings plan starts with a goal (what it costs) and a regular amount to set aside.",
  },
];

function moneyPlan(d: Level): Question {
  if (d === 1) {
    const item = pick(MONEY_IDEAS);
    return choose(item.prompt, item.right, shuffle(item.wrong), item.hint);
  }
  const name = pick(NAMES);
  const earn = randInt(10, 25);
  const spend = randInt(2, earn - 5);
  const save = earn - spend;
  const w = randInt(4, 12);
  const goal = d === 2 ? save * w : save * w - randInt(1, save - 1);
  return ask(
    `${name} earns ${dollars(earn)} a week and spends ${dollars(spend)} a week on snacks. The rest is saved. ${d === 2 ? "How many weeks will it take" : "After how many weeks will"} ${name} ${d === 2 ? "to save" : "have saved at least"} ${dollars(goal)}?`,
    w,
    "Step 1: find how much is saved each week (earned − spent). Step 2: find how many weeks of saving reach the goal.",
    { suffix: "weeks" },
  );
}

function compareOptions(d: Level): Question {
  const n = d === 1 ? 3 : randInt(3, 5);
  const t = d === 1 ? randInt(3, 9) * 100 + pick([0, 50]) : randInt(5, 15) * 100 + pick([25, 50, 75]);
  const total = t * n;
  const pass = total + pick([-1, 1]) * randInt(1, 6) * (d === 3 ? 25 : 50);
  const singles = `${n} single tickets`;
  return fixedChoice(
    `A family of ${n} is going to a museum. Single tickets cost ${cash(t)} each. A family pass costs ${cash(pass)}. Which costs less?`,
    [singles, "The family pass", "They cost the same"],
    pass < total ? "The family pass" : singles,
    `Find the cost of ${n} single tickets (add ${cash(t)} ${n} times, or multiply). Then compare with the pass.`,
  );
}

function money(d: Level): Question[] {
  return finish([
    makeChange(d),
    changeWithCoins(d),
    countMoney(d),
    savingsPlan(d),
    budgetTable(d),
    enoughMoney(d),
    moneyPlan(d),
    compareOptions(d),
  ]);
}

// ---------- Course ----------

const level = (opts?: { difficulty?: Level }): Level => opts?.difficulty ?? 2;

export const course: Course = {
  grade: "5",
  subject: "math",
  bigIdeas: {
    "ca-bc": [
      "Numbers describe quantities that can be represented by equivalent fractions.",
      "Computational fluency and flexibility with numbers extend to operations with larger (multi-digit) numbers.",
      "Identified regularities in number patterns can be expressed in tables.",
      "Closed shapes have area and perimeter that can be described, measured, and compared.",
      "Data represented in graphs can be used to show many-to-one correspondence.",
    ],
  },
  units: [
    {
      id: "numbers-to-a-million",
      title: "Numbers to a Million",
      emoji: "🔢",
      blurb: "Read, write and compare big numbers",
      standards: { "ca-bc": "Number concepts to 1 000 000; whole-number benchmarks" },
      parentNote:
        "Place value to 1 000 000: digit values, standard and expanded form, number words, rounding, ordering, and using benchmarks like 500 000 on a number line.",
      generate: (o) => bigNumbers(level(o)),
    },
    {
      id: "add-and-subtract",
      title: "Add & Subtract",
      emoji: "➕",
      blurb: "Big sums, differences and estimates",
      standards: {
        "ca-bc":
          "Addition and subtraction of whole numbers to 1 000 000; addition and subtraction estimation strategies; mental math strategies",
      },
      parentNote:
        "Adding and subtracting numbers up to 1 000 000 with regrouping (including across zeros), estimating by rounding, and mental math such as compensation (adding 4999 as 5000 − 1).",
      generate: (o) => addSubtract(level(o)),
    },
    {
      id: "multiply",
      title: "Multiply",
      emoji: "✖️",
      blurb: "Multiply up to three digits",
      standards: { "ca-bc": "Multiplication to three digits; multiplication estimation strategies; mental math strategies" },
      parentNote:
        "Multiplying 2- and 3-digit numbers using area models and partial products, patterns with 10, 100 and 1000, doubling and halving, and estimating products by rounding.",
      generate: (o) => multiply(level(o)),
    },
    {
      id: "divide",
      title: "Divide",
      emoji: "➗",
      blurb: "Share, group and handle remainders",
      standards: { "ca-bc": "Division to three digits, including division with remainders; division estimation strategies" },
      parentNote:
        "Dividing 2- and 3-digit numbers, finding remainders and deciding what they mean in a story (round up for buses, drop the extra for full bags), and estimating with friendly numbers.",
      generate: (o) => divide(level(o)),
    },
    {
      id: "equivalent-fractions",
      title: "Equivalent Fractions",
      emoji: "🍕",
      blurb: "Same amount, different fraction",
      standards: { "ca-bc": "Equivalent fractions; fraction benchmarks" },
      parentNote:
        "Making and recognizing equivalent fractions (2/3 = 8/12), simplifying, comparing and ordering fractions, and judging whether a fraction is close to 0, 1/2 or 1.",
      generate: (o) => fractions(level(o)),
    },
    {
      id: "decimals",
      title: "Decimals",
      emoji: "🧮",
      blurb: "Tenths, hundredths and thousandths",
      standards: {
        "ca-bc": "Decimals to thousandths; decimal benchmarks; addition and subtraction of decimals to thousandths",
      },
      parentNote:
        "Reading, writing, comparing and rounding decimals to thousandths, linking decimals to fractions out of 10, 100 and 1000, and adding and subtracting decimals in real situations.",
      generate: (o) => decimals(level(o)),
    },
    {
      id: "patterns-and-equations",
      title: "Patterns & Equations",
      emoji: "🧩",
      blurb: "Pattern rules and mystery numbers",
      standards: {
        "ca-bc":
          "Rules for increasing and decreasing patterns with words, numbers, symbols, and variables; one-step equations with variables",
      },
      parentNote:
        "Describing growing and shrinking patterns with rules and expressions like 3n + 1, using input–output tables, and solving one-step equations such as n + 37 = 92 or 6 × n = 54.",
      generate: (o) => patternsEquations(level(o)),
    },
    {
      id: "area-and-perimeter",
      title: "Area & Perimeter",
      emoji: "📐",
      blurb: "Measure inside and around shapes",
      standards: { "ca-bc": "Area measurement of squares and rectangles; relationships between area and perimeter" },
      parentNote:
        "Finding the area and perimeter of squares and rectangles, working backwards to a missing side, and discovering that shapes with the same area can have different perimeters (and vice versa).",
      generate: (o) => areaPerimeter(level(o)),
    },
    {
      id: "time-and-duration",
      title: "Time & Duration",
      emoji: "⏱️",
      blurb: "How long does it take?",
      standards: { "ca-bc": "Duration, using measurement of time" },
      parentNote:
        "Working out how long events last, finding end and start times, reading schedules, and converting between seconds, minutes, hours, days and weeks.",
      generate: (o) => time(level(o)),
    },
    {
      id: "prisms-pyramids-and-moves",
      title: "Prisms, Pyramids & Moves",
      emoji: "🔺",
      blurb: "3D objects, slides, flips, turns",
      standards: { "ca-bc": "Classification of prisms and pyramids; single transformations" },
      parentNote:
        "Naming and classifying prisms and pyramids by their bases, counting faces, edges and vertices, and describing single transformations: translations (slides), reflections (flips) and rotations (turns).",
      generate: (o) => shapesMoves(level(o)),
    },
    {
      id: "graphs-and-chance",
      title: "Graphs & Chance",
      emoji: "📊",
      blurb: "Double bar graphs and probability",
      standards: {
        "ca-bc":
          "One-to-one correspondence and many-to-one correspondence, using double bar graphs; probability experiments, single events or outcomes",
      },
      parentNote:
        "Reading double bar graphs where each square stands for several items (many-to-one), comparing two sets of data, and describing the probability of single outcomes with spinners, marbles, dice and coins.",
      generate: (o) => dataChance(level(o)),
    },
    {
      id: "money-and-budgets",
      title: "Money & Budgets",
      emoji: "💵",
      blurb: "Change, budgets and saving goals",
      standards: {
        "ca-bc":
          "Financial literacy — monetary calculations, including making change with amounts to 1000 dollars and developing simple financial plans",
      },
      parentNote:
        "Making change for purchases up to $1000, counting bills and coins, estimating whether there is enough money, and building simple budgets and savings plans.",
      generate: (o) => money(level(o)),
    },
  ],
};
