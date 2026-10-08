import { chance, pick, randInt, sample, shuffle, textChoice } from "../../random";
import { formatMoney } from "../../money";
import type {
  ChoiceQuestion,
  CoinsQuestion,
  Course,
  GenerateOptions,
  InputQuestion,
  OrderQuestion,
  Question,
  ShapeName,
  Visual,
} from "../../types";

// ---------- Shared helpers ----------

type Level = 1 | 2 | 3;

/** 1 = easier, 2 = on grade level, 3 = stretch. */
const levelOf = (opts?: GenerateOptions): Level => opts?.difficulty ?? 2;

const eq = (text: string): Visual => ({ type: "equation", text });

function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

/** Whole numbers the way Canadian math books write them: 4726, but 10 000. */
function fmt(n: number): string {
  const s = String(n);
  return n >= 10000 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : s;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const NAMES = ["Maya", "Jay", "Sam", "Amir", "Lena", "Kenji", "Zoe", "Ravi", "Ana", "Noah", "Priya", "Leo"];

/** Distinct strings, leaving out any listed in `skip`. */
function uniq(items: string[], skip: string[] = []): string[] {
  const seen = new Set(skip);
  const out: string[] = [];
  for (const s of items) {
    if (!seen.has(s)) {
      seen.add(s);
      out.push(s);
    }
  }
  return out;
}

/** Up to `count` different whole numbers from min to max that pass `ok`. */
function distinctInts(count: number, min: number, max: number, ok: (n: number) => boolean = () => true): number[] {
  const out = new Set<number>();
  for (let tries = 0; out.size < count && tries < 500; tries++) {
    const n = randInt(min, max);
    if (ok(n)) out.add(n);
  }
  return [...out];
}

function typeIn(
  prompt: string,
  answer: number | string,
  hint: string,
  visual?: Visual,
  extra: { keypad?: InputQuestion["keypad"]; accept?: string[]; suffix?: string } = {},
): InputQuestion {
  const q: InputQuestion = {
    kind: "input",
    prompt,
    hint,
    visual,
    answer: String(answer),
    keypad: extra.keypad ?? "number",
  };
  if (extra.accept?.length) q.accept = extra.accept;
  if (extra.suffix) q.suffix = extra.suffix;
  return q;
}

/**
 * A multiple-choice question with number answers. `wrongs` are tried first (the
 * plausible mistakes), then numbers `step` away fill any gaps. Labels never repeat.
 */
function numChoice(
  prompt: string,
  answer: number,
  wrongs: number[],
  hint: string,
  visual?: Visual,
  opts: { format?: (n: number) => string; step?: number; min?: number; count?: number } = {},
): ChoiceQuestion {
  const { format = fmt, step = 1, min = 0, count = 4 } = opts;
  const right = format(answer);
  const seen = new Set([right]);
  const picked: string[] = [];
  const add = (n: number) => {
    if (picked.length >= count - 1 || !Number.isFinite(n) || n < min) return;
    const label = format(n);
    if (seen.has(label)) return;
    seen.add(label);
    picked.push(label);
  };
  wrongs.forEach(add);
  for (let k = 1; picked.length < count - 1 && k < 60; k++) {
    add(answer + k * step);
    add(answer - k * step);
  }
  return textChoice(prompt, right, picked, hint, visual);
}

type Sign = "<" | "=" | ">";
const signOf = (a: number, b: number): Sign => (a < b ? "<" : a > b ? ">" : "=");

function signChoice(left: string, right: string, sign: Sign, hint: string): ChoiceQuestion {
  return {
    kind: "choice",
    prompt: "Which sign goes in the box?",
    hint,
    visual: eq(`${left} ☐ ${right}`),
    answer: sign,
    choices: [
      { id: "<", label: "<" },
      { id: "=", label: "=" },
      { id: ">", label: ">" },
    ],
  };
}

/** `labels` must already be in the correct order. */
function orderQ(prompt: string, labels: string[], hint: string): OrderQuestion {
  return { kind: "order", prompt, hint, items: labels.map((label, i) => ({ id: `n${i}`, label })) };
}

/** What makes two questions "the same" for a child: prompt, picture and right answer. */
function questionKey(q: Question): string {
  const answer =
    q.kind === "choice"
      ? q.choices.find((c) => c.id === q.answer)?.label
      : q.kind === "input"
        ? q.answer
        : q.kind === "build" || q.kind === "coins"
          ? q.target
          : q.kind === "order"
            ? q.items.map((i) => i.label).join(",")
            : "";
  return `${q.prompt}#${JSON.stringify(q.visual ?? null)}#${answer}`;
}

type Maker = () => Question;

/** Run each maker once, re-rolling any question that repeats one already in the set. */
function buildSet(makers: Maker[]): Question[] {
  const out: Question[] = [];
  const seen = new Set<string>();
  for (const make of makers) {
    let q = make();
    for (let tries = 0; seen.has(questionKey(q)) && tries < 40; tries++) q = make();
    seen.add(questionKey(q));
    out.push(q);
  }
  return shuffle(out);
}

const digitAt = (n: number, place: number) => Math.floor(n / place) % 10;

// ---------- Numbers to 10 000 ----------

const PLACE = ["ones", "tens", "hundreds", "thousands"];
const POW = [1, 10, 100, 1000];

/** Digits from the ones place up: 4726 → [6, 2, 7, 4]. */
const placeDigits = (n: number): number[] => String(n).split("").reverse().map(Number);

/** "1 hundred", "4 tens". */
const placeCount = (x: number, i: number) => `${x} ${x === 1 ? PLACE[i].slice(0, -1) : PLACE[i]}`;

/** "4 thousands, 7 hundreds, 2 tens and 6 ones" */
function placeWords(n: number): string {
  const parts = placeDigits(n)
    .map((x, i) => placeCount(x, i))
    .reverse();
  return parts.length > 1 ? `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}` : parts[0];
}

/** Non-zero place values, biggest first: 6048 → [6000, 40, 8]. */
const expandedParts = (n: number): number[] =>
  placeDigits(n)
    .map((x, i) => x * POW[i])
    .filter((v) => v > 0)
    .reverse();

const ONES_WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen",
];
const TENS_WORDS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

/** 4206 → "four thousand two hundred six" */
function numberWords(n: number): string {
  if (n === 10000) return "ten thousand";
  const th = Math.floor(n / 1000);
  const h = Math.floor(n / 100) % 10;
  const rest = n % 100;
  const parts: string[] = [];
  if (th) parts.push(`${ONES_WORDS[th]} thousand`);
  if (h) parts.push(`${ONES_WORDS[h]} hundred`);
  if (rest) {
    parts.push(
      rest < 20 ? ONES_WORDS[rest] : `${TENS_WORDS[Math.floor(rest / 10)]}${rest % 10 ? `-${ONES_WORDS[rest % 10]}` : ""}`,
    );
  }
  return parts.join(" ") || "zero";
}

/** A number with `len` different digits and no leading zero. */
function distinctDigitNumber(len: number): number {
  const first = randInt(1, 9);
  return Number([first, ...sample(range(0, 9).filter((x) => x !== first), len - 1)].join(""));
}

function digitValue(d: Level): Question {
  const len = d === 1 ? 3 : 4;
  const n = distinctDigitNumber(len);
  const digits = placeDigits(n);
  const p = pick(range(0, len - 1).filter((i) => digits[i] !== 0));
  const digit = digits[p];
  const values = range(0, 3).map((i) => digit * POW[i]);
  return textChoice(
    `In ${fmt(n)}, what is the value of the digit ${digit}?`,
    fmt(values[p]),
    values.filter((_, i) => i !== p).map(fmt),
    `The ${digit} is in the ${PLACE[p]} place. ${digit} × ${POW[p]} = ${fmt(values[p])}.`,
    eq(fmt(n)),
  );
}

function expandedToNumber(d: Level): Question {
  let n: number;
  if (d === 1) {
    n = randInt(1, 9) * 100 + randInt(1, 9) * 10 + randInt(1, 9);
  } else if (d === 2) {
    do n = randInt(1001, 9999);
    while (expandedParts(n).length < 3);
  } else {
    // Zeros in the middle, and the parts out of order.
    do {
      n = randInt(1, 9) * 1000 + pick([0, randInt(1, 9)]) * 100 + pick([0, randInt(1, 9)]) * 10 + randInt(0, 9);
    } while (expandedParts(n).length < 2 || !String(n).includes("0"));
  }
  const parts = d === 3 ? shuffle(expandedParts(n)) : expandedParts(n);
  return typeIn(
    "What number is this?",
    n,
    `Put each part in its place: ${placeWords(n)}.${d === 3 ? " Write a 0 for any place that is empty." : ""}`,
    eq(parts.map(fmt).join(" + ")),
  );
}

function numberToExpanded(): Question {
  let n: number;
  do n = randInt(1001, 9999);
  while (expandedParts(n).length < 3);
  const parts = expandedParts(n);
  const label = (ps: number[]) => ps.map(fmt).join(" + ");
  const right = label(parts);
  // Wrong answers: a part in the wrong place (never two parts in one place),
  // a digit read wrong, or a part left out.
  const okParts = (ps: number[]) =>
    ps.every((v) => v > 0 && v < 10000) && new Set(ps.map((v) => String(v).length)).size === ps.length;
  const shifted: string[] = [];
  const slips: string[] = [];
  parts.forEach((v, i) => {
    const lead = Number(String(v)[0]);
    const scale = v / lead;
    for (const w of [v * 10, v / 10]) {
      const ps = parts.map((x, j) => (j === i ? w : x));
      if (Number.isInteger(w) && okParts(ps)) shifted.push(label(ps));
    }
    if (lead < 9) slips.push(label(parts.map((x, j) => (j === i ? (lead + 1) * scale : x))));
    if (parts.length > 2) slips.push(label(parts.filter((_, j) => j !== i)));
  });
  return textChoice(
    `Which shows ${fmt(n)} in expanded form?`,
    right,
    uniq([...shuffle(shifted), ...shuffle(slips)], [right]).slice(0, 3),
    `${fmt(n)} is ${placeWords(n)}. Write each digit as its place value and skip the zeros: ${right}.`,
    eq(fmt(n)),
  );
}

function placeChart(d: Level): Question {
  const prompt = "What number does the place value chart show?";
  if (d === 3) {
    const th = randInt(1, 8);
    const h = randInt(10, 15);
    const t = randInt(0, 9);
    const o = randInt(1, 9);
    const n = th * 1000 + h * 100 + t * 10 + o;
    return typeIn(
      prompt,
      n,
      `${h} hundreds is the same as 1 thousand and ${placeCount(h - 10, 2)}. So you have ${placeCount(th + 1, 3)}, ${placeCount(h - 10, 2)}, ${placeCount(t, 1)} and ${placeCount(o, 0)}.`,
      { type: "table", headers: ["Thousands", "Hundreds", "Tens", "Ones"], rows: [[th, h, t, o]] },
    );
  }
  const n = d === 1 ? randInt(101, 999) : randInt(1001, 9999);
  const headers = d === 1 ? ["Hundreds", "Tens", "Ones"] : ["Thousands", "Hundreds", "Tens", "Ones"];
  return typeIn(prompt, n, `Read the digits from left to right: ${placeWords(n)}.`, {
    type: "table",
    headers,
    rows: [placeDigits(n).reverse()],
  });
}

/** Swap two different digits (keeping a non-zero first digit). */
function swapDigits(n: number): number {
  const ds = String(n).split("");
  for (let t = 0; t < 40; t++) {
    const [i, j] = sample(range(0, ds.length - 1), 2);
    if (ds[i] === ds[j]) continue;
    const c = [...ds];
    [c[i], c[j]] = [c[j], c[i]];
    if (c[0] === "0") continue;
    return Number(c.join(""));
  }
  return n + 10 <= 9999 ? n + 10 : n - 10;
}

function compareNumbers(d: Level): Question {
  let a: number;
  let b: number;
  if (d === 1) {
    do {
      a = randInt(100, 9999);
      b = chance(0.4) ? randInt(100, 999) : randInt(1000, 9999);
    } while (a === b || (String(a).length === String(b).length && String(a)[0] === String(b)[0]));
  } else if (d === 2) {
    const th = randInt(1, 9) * 1000;
    a = th + randInt(0, 999);
    do b = th + randInt(0, 999);
    while (b === a);
  } else {
    a = randInt(1000, 9999);
    b = chance(0.3) ? a : swapDigits(a);
  }
  const left = d === 3 ? expandedParts(a).map(fmt).join(" + ") : fmt(a);
  const hint =
    d === 3
      ? `First put the parts together: ${left} = ${fmt(a)}. Then compare with ${fmt(b)}, starting with the thousands.`
      : String(a).length !== String(b).length
        ? "Count the digits. A 4-digit number is always greater than a 3-digit number."
        : "Compare the thousands first. If they're the same, compare the hundreds, then the tens, then the ones.";
  return signChoice(left, fmt(b), signOf(a, b), hint);
}

function orderNumbers(d: Level): Question {
  if (d === 3) {
    const digits = sample(range(0, 9), 4);
    const set = new Set<number>();
    for (let t = 0; set.size < 4 && t < 300; t++) {
      const p = shuffle(digits);
      if (p[0] !== 0) set.add(Number(p.join("")));
    }
    const nums = [...set].sort((x, y) => y - x);
    return orderQ(
      "Put the numbers in order from greatest to least.",
      nums.map(fmt),
      `They all use the same digits, so compare place by place. Start with the biggest thousands digit: ${fmt(nums[0])}.`,
    );
  }
  if (d === 1) {
    const nums = [...distinctInts(2, 100, 999), ...distinctInts(2, 1000, 9999)].sort((x, y) => x - y);
    return orderQ(
      "Put the numbers in order from least to greatest.",
      nums.map(fmt),
      "Numbers with fewer digits are smaller. If two numbers have the same number of digits, compare the biggest place first.",
    );
  }
  const th = randInt(1, 9) * 1000;
  const nums = distinctInts(4, th, th + 999).sort((x, y) => x - y);
  return orderQ(
    "Put the numbers in order from least to greatest.",
    nums.map(fmt),
    `They all have ${th / 1000} thousands, so compare the hundreds, then the tens. The least is ${fmt(nums[0])}.`,
  );
}

const ROUND_NAME: Record<number, string> = { 10: "ten", 100: "hundred", 1000: "thousand" };

function roundNumber(d: Level): Question {
  let n: number;
  let unit: number;
  do {
    if (d === 1) {
      unit = pick([10, 100]);
      n = randInt(101, 989);
    } else if (d === 2) {
      unit = pick([100, 1000]);
      n = randInt(1010, 8990);
    } else {
      unit = pick([100, 1000]);
      // Rounding that ripples into the next place: 3962 → 4000, 9612 → 10 000.
      n = unit === 100 ? randInt(1, 9) * 1000 + 900 + randInt(51, 99) : 9000 + randInt(501, 999);
    }
  } while (n % unit === 0 || n % unit === unit / 2);
  const down = Math.floor(n / unit) * unit;
  const ans = n - down > unit / 2 ? down + unit : down;
  const other = ans === down ? down + unit : down;
  const otherUnit = unit === 1000 ? 100 : unit === 100 ? (d === 1 ? 10 : 1000) : 100;
  const otherRound = Math.round(n / otherUnit) * otherUnit;
  const look = digitAt(n, unit / 10);
  const lookPlace = PLACE[Math.log10(unit / 10)];
  return numChoice(
    `Round ${fmt(n)} to the nearest ${ROUND_NAME[unit]}.`,
    ans,
    [other, otherRound, ans + unit],
    `To round to the nearest ${ROUND_NAME[unit]}, look at the ${lookPlace} digit: ${look}. ${look >= 5 ? "It's 5 or more, so round up" : "It's less than 5, so round down"} to ${fmt(ans)}.`,
    undefined,
    { step: unit },
  );
}

function numberLine10000(d: Level): Question {
  const min = d === 1 ? 0 : d === 2 ? randInt(1, 8) * 1000 : randInt(10, 98) * 100;
  const step = d === 3 ? 10 : 100;
  const labelEvery = step * 5;
  const max = min + step * 10;
  const k = pick([1, 2, 3, 4, 6, 7, 8, 9]);
  const ans = min + k * step;
  const base = k < 5 ? min : min + 5 * step;
  const jumps = k < 5 ? k : k - 5;
  const wrongs = [ans + step, ans - step, ans + 2 * step, ans - 2 * step, min + k * step * 10].filter(
    (w) => w >= min && w <= max,
  );
  return numChoice(
    "What number goes where the ? is?",
    ans,
    shuffle(wrongs),
    `Each small jump is ${step}. Start at ${fmt(base)} and count on ${jumps} ${jumps === 1 ? "jump" : "jumps"} of ${step}.`,
    { type: "numberLine", min, max, step, labelEvery, blankAt: ans },
    { step },
  );
}

function moreOrLess(d: Level): Question {
  const more = chance(0.5);
  let n: number;
  let change: number;
  if (d === 1) {
    change = pick([10, 100]);
    n = randInt(110, 889);
  } else if (d === 2) {
    change = pick([100, 1000]);
    n = more ? randInt(1000, 8999) : randInt(2000, 9999);
  } else {
    change = pick([10, 100]);
    // Make the change ripple into the next place: 4950 + 100, 3002 − 10.
    if (more) {
      n = change === 10 ? randInt(10, 98) * 100 + randInt(90, 99) : randInt(1, 8) * 1000 + 900 + randInt(0, 99);
    } else {
      n = change === 10 ? randInt(1, 9) * 1000 + randInt(0, 9) : randInt(1, 9) * 1000 + randInt(0, 99);
    }
  }
  const ans = more ? n + change : n - change;
  const place = PLACE[Math.log10(change)];
  return typeIn(
    `What is ${change} ${more ? "more" : "less"} than ${fmt(n)}?`,
    ans,
    d === 3
      ? `${change} ${more ? "more" : "less"} changes the ${place} digit by 1. The ${place} digit is ${digitAt(n, change)}, so you need to regroup with the next place.`
      : `${change} ${more ? "more" : "less"} changes only the ${place} digit, by 1.`,
    eq(`${fmt(n)} ${more ? "+" : "−"} ${change} = ?`),
  );
}

function wordsToNumber(d: Level): Question {
  let n: number;
  if (d === 1) n = randInt(101, 999);
  else if (d === 2) n = randInt(1001, 9999);
  else {
    do n = randInt(1, 9) * 1000 + pick([0, randInt(1, 9)]) * 100 + pick([0, randInt(1, 9)]) * 10 + randInt(0, 9);
    while (!String(n).includes("0") || n % 1000 === 0);
  }
  return typeIn(
    `Write this number with digits: ${numberWords(n)}.`,
    n,
    `Find each place: ${placeWords(n)}.${String(n).includes("0") ? " Use a 0 to hold any empty place." : ""}`,
  );
}

function numbersTo10000(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  if (d === 1) {
    return buildSet([
      () => digitValue(1),
      () => expandedToNumber(1),
      () => placeChart(1),
      () => compareNumbers(1),
      () => orderNumbers(1),
      () => roundNumber(1),
      () => numberLine10000(1),
      () => moreOrLess(1),
    ]);
  }
  if (d === 2) {
    return buildSet([
      () => digitValue(2),
      () => expandedToNumber(2),
      () => wordsToNumber(2),
      () => compareNumbers(2),
      () => orderNumbers(2),
      () => roundNumber(2),
      () => numberLine10000(2),
      () => moreOrLess(2),
    ]);
  }
  return buildSet([
    numberToExpanded,
    () => placeChart(3),
    () => wordsToNumber(3),
    () => compareNumbers(3),
    () => orderNumbers(3),
    () => roundNumber(3),
    () => numberLine10000(3),
    () => moreOrLess(3),
  ]);
}

// ---------- Add & Subtract to 10 000 ----------

function carryCount(a: number, b: number): number {
  let count = 0;
  let carry = 0;
  for (let p = 1; p <= 1000; p *= 10) {
    carry = digitAt(a, p) + digitAt(b, p) + carry >= 10 ? 1 : 0;
    count += carry;
  }
  return count;
}

function borrowCount(a: number, b: number): number {
  let count = 0;
  let borrow = 0;
  for (let p = 1; p <= 1000; p *= 10) {
    borrow = digitAt(a, p) - borrow - digitAt(b, p) < 0 ? 1 : 0;
    count += borrow;
  }
  return count;
}

/** The answer you get by forgetting to regroup. */
function addNoRegroup(a: number, b: number): number {
  let r = 0;
  for (let p = 1; p <= 1000; p *= 10) r += ((digitAt(a, p) + digitAt(b, p)) % 10) * p;
  return r;
}

/** The answer you get by always taking the smaller digit from the bigger one. */
function subSmallFromBig(a: number, b: number): number {
  let r = 0;
  for (let p = 1; p <= 1000; p *= 10) r += Math.abs(digitAt(a, p) - digitAt(b, p)) * p;
  return r;
}

function pickAdd(d: Level): [number, number] {
  for (;;) {
    if (d === 1) {
      const a = randInt(100, 799);
      const b = randInt(100, 899);
      if (a + b <= 999 && carryCount(a, b) <= 1) return [a, b];
    } else if (d === 2) {
      const a = randInt(1000, 6999);
      const b = randInt(100, 2999);
      if (a + b <= 9999 && carryCount(a, b) >= 1) return [a, b];
    } else {
      const a = randInt(1000, 7999);
      const b = randInt(1000, 8999);
      if (a + b <= 10000 && carryCount(a, b) >= 2) return [a, b];
    }
  }
}

function pickSub(d: Level, allowTenThousand = false): [number, number] {
  for (;;) {
    if (d === 1) {
      const a = randInt(300, 999);
      const b = randInt(100, a - 50);
      if (borrowCount(a, b) <= 1) return [a, b];
    } else if (d === 2) {
      const a = randInt(2000, 9999);
      const b = randInt(100, a - 100);
      if (borrowCount(a, b) >= 1) return [a, b];
    } else {
      // Subtracting across zeros: 6000 − 2375, 5003 − 1268.
      const t = randInt(2, 9) * 1000;
      const a = allowTenThousand && chance(0.2) ? 10000 : t + pick([0, randInt(1, 9), randInt(1, 9) * 10, randInt(1, 9) * 100]);
      const b = randInt(1000, a - 500);
      if (a === 10000 || borrowCount(a, b) >= 2) return [a, b];
    }
  }
}

function addHint(a: number, b: number): string {
  const steps: string[] = [];
  const sums: number[] = [];
  for (const p of [1000, 100, 10, 1]) {
    const x = digitAt(a, p) * p;
    const y = digitAt(b, p) * p;
    if (x + y === 0) continue;
    steps.push(`${fmt(x)} + ${fmt(y)} = ${fmt(x + y)}`);
    sums.push(x + y);
  }
  if (sums.length < 2) return "Line up the places and add the ones, tens, hundreds, then thousands.";
  return `Add place by place: ${steps.join(", ")}. Then add those: ${sums.map(fmt).join(" + ")}.`;
}

/** Count up from `from` to `to` in friendly jumps. */
function countUpHint(from: number, to: number): string {
  const jumps: number[] = [];
  const stops: number[] = [];
  let cur = from;
  for (const p of [10, 100, 1000]) {
    const next = Math.ceil(cur / p) * p;
    if (next > cur && next <= to) {
      jumps.push(next - cur);
      stops.push(next);
      cur = next;
    }
  }
  if (cur < to) {
    jumps.push(to - cur);
    stops.push(to);
  }
  if (jumps.length < 2) return `Count up from ${fmt(from)} to ${fmt(to)}.`;
  const path = jumps.map((j, i) => `+${fmt(j)} → ${fmt(stops[i])}`).join(", ");
  return `Count up from ${fmt(from)}: ${path}. Then add up the jumps: ${jumps.map(fmt).join(" + ")}.`;
}

function subHint(a: number, b: number, d: Level): string {
  if (d === 3) return countUpHint(b, a);
  return `Line up the places and start with the ones. If the top digit is too small, regroup 1 from the next place to the left. Check by adding your answer to ${fmt(b)}: you should get ${fmt(a)}.`;
}

function addInput(d: Level): Question {
  const [a, b] = pickAdd(d);
  return typeIn(`What is ${fmt(a)} + ${fmt(b)}?`, a + b, addHint(a, b), eq(`${fmt(a)} + ${fmt(b)} = ?`));
}

function addChoice(d: Level): Question {
  const [a, b] = pickAdd(d);
  const s = a + b;
  return numChoice(
    `What is ${fmt(a)} + ${fmt(b)}?`,
    s,
    [addNoRegroup(a, b), s + 10, s - 100, s + 100, s - 10],
    addHint(a, b),
    eq(`${fmt(a)} + ${fmt(b)} = ?`),
    { step: 10 },
  );
}

function subInput(d: Level): Question {
  const [a, b] = pickSub(d, true);
  return typeIn(`What is ${fmt(a)} − ${fmt(b)}?`, a - b, subHint(a, b, d), eq(`${fmt(a)} − ${fmt(b)} = ?`));
}

function subChoice(d: Level): Question {
  const [a, b] = pickSub(d);
  const diff = a - b;
  return numChoice(
    `What is ${fmt(a)} − ${fmt(b)}?`,
    diff,
    [subSmallFromBig(a, b), diff + 10, diff - 100, diff + 100, diff - 10],
    subHint(a, b, d),
    eq(`${fmt(a)} − ${fmt(b)} = ?`),
    { step: 10 },
  );
}

function estimateSum(d: Level): Question {
  const unit = d === 2 ? 1000 : 100;
  const isSub = d === 3;
  const roundTo = (n: number) => Math.round(n / unit) * unit;
  const bad = (n: number) => n % unit === 0 || n % unit === unit / 2;
  let a: number;
  let b: number;
  do {
    if (d === 1) {
      a = randInt(110, 590);
      b = randInt(110, 390);
    } else if (d === 2) {
      a = randInt(1100, 5900);
      b = randInt(1100, 3900);
    } else {
      a = randInt(5100, 9800);
      b = randInt(1100, 4900);
    }
  } while (bad(a) || bad(b));
  const ra = roundTo(a);
  const rb = roundTo(b);
  const est = isSub ? ra - rb : ra + rb;
  const op = isSub ? "−" : "+";
  return numChoice(
    `Estimate ${fmt(a)} ${op} ${fmt(b)} by rounding each number to the nearest ${ROUND_NAME[unit]}.`,
    est,
    shuffle([est + unit, est - unit, est + 2 * unit]),
    `${fmt(a)} rounds to ${fmt(ra)} and ${fmt(b)} rounds to ${fmt(rb)}. ${fmt(ra)} ${op} ${fmt(rb)} = ${fmt(est)}.`,
    undefined,
    { step: unit },
  );
}

const ADD_STORIES: { emoji: string; text: (a: string, b: string, who: string) => string }[] = [
  { emoji: "📚", text: (a, b) => `A library has ${a} books. It gets ${b} new books. How many books does it have now?` },
  { emoji: "🎃", text: (a, b) => `A farm grew ${a} pumpkins last year and ${b} pumpkins this year. How many pumpkins is that in all?` },
  { emoji: "👟", text: (a, b, who) => `${who} walked ${a} steps before lunch and ${b} steps after lunch. How many steps in all?` },
  { emoji: "🥫", text: (a, b) => `A school collected ${a} cans in May and ${b} cans in June. How many cans altogether?` },
  { emoji: "✈️", text: (a, b) => `A plane flew ${a} km on Monday and ${b} km on Tuesday. How far did it fly in both days?` },
];

const SUB_STORIES: { emoji: string; text: (a: string, b: string, who: string) => string }[] = [
  { emoji: "🎵", text: (a, b) => `A concert hall has ${a} seats. ${b} people came to the show. How many seats were empty?` },
  { emoji: "🚗", text: (a, b) => `A road trip is ${a} km long. The family has driven ${b} km. How many kilometres are left?` },
  { emoji: "🏫", text: (a, b) => `A school wants to raise $${a}. So far it has raised $${b}. How many more dollars does it need?` },
  { emoji: "🏖️", text: (a, b) => `A beach had ${a} visitors on Saturday and ${b} visitors on Sunday. How many more came on Saturday?` },
  { emoji: "🧩", text: (a, b, who) => `A giant puzzle has ${a} pieces. ${who} has placed ${b} pieces. How many pieces are left?` },
];

function addStory(d: Level): Question {
  const [a, b] = pickAdd(d);
  const story = pick(ADD_STORIES);
  return numChoice(
    story.text(fmt(a), fmt(b), pick(NAMES)),
    a + b,
    [addNoRegroup(a, b), a + b + 100, a + b - 10, a - b],
    `Put the two amounts together: ${fmt(a)} + ${fmt(b)}. ${addHint(a, b)}`,
    { type: "emoji", emoji: story.emoji },
    { step: 10 },
  );
}

function subStory(d: Level): Question {
  const [a, b] = pickSub(d);
  const story = pick(SUB_STORIES);
  return typeIn(
    story.text(fmt(a), fmt(b), pick(NAMES)),
    a - b,
    `Find the difference: ${fmt(a)} − ${fmt(b)}. ${d === 3 ? countUpHint(b, a) : "Or count up from the smaller number to the bigger one."}`,
    { type: "emoji", emoji: story.emoji },
  );
}

function missingAddend(d: Level): Question {
  let a: number;
  let c: number;
  if (d === 1) {
    c = pick([500, 600, 700, 800, 900, 1000]);
    a = randInt(110, c - 50);
  } else if (d === 2) {
    c = randInt(20, 99) * 100;
    a = randInt(1000, c - 100);
  } else {
    c = randInt(3000, 9999);
    a = randInt(1000, c - 100);
  }
  return typeIn(
    "What number goes in the box?",
    c - a,
    `Think: what do you add to ${fmt(a)} to make ${fmt(c)}? ${countUpHint(a, c)}`,
    eq(`${fmt(a)} + ☐ = ${fmt(c)}`),
  );
}

function checkInverse(): Question {
  let a: number;
  let b: number;
  do [a, b] = pickSub(3);
  while (a - b === b);
  const diff = a - b;
  return textChoice(
    `Which addition checks that ${fmt(a)} − ${fmt(b)} = ${fmt(diff)}?`,
    `${fmt(diff)} + ${fmt(b)} = ${fmt(a)}`,
    [`${fmt(a)} + ${fmt(b)} = ${fmt(a + b)}`, `${fmt(a)} + ${fmt(diff)} = ${fmt(a + diff)}`],
    "Addition undoes subtraction. Add the answer to the number you took away. You should get back the number you started with.",
  );
}

function addSubtract(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  if (d === 3) {
    return buildSet([
      () => addInput(3),
      () => subInput(3),
      () => addChoice(3),
      () => subChoice(3),
      () => estimateSum(3),
      () => subStory(3),
      () => missingAddend(3),
      checkInverse,
    ]);
  }
  return buildSet([
    () => addInput(d),
    () => subInput(d),
    () => addChoice(d),
    () => subChoice(d),
    () => estimateSum(d),
    () => addStory(d),
    () => subStory(d),
    () => missingAddend(d),
  ]);
}

// ---------- Multiplication & division facts ----------

function factPair(d: Level): [number, number] {
  const a = d === 1 ? pick([2, 3, 4, 5, 10]) : d === 2 ? randInt(2, 9) : pick([6, 7, 8, 9]);
  const b = d === 1 ? randInt(2, 10) : d === 2 ? randInt(2, 10) : randInt(4, 9);
  return chance(0.5) ? [a, b] : [b, a];
}

/** A strategy for a × b that uses an easier fact. */
function mulHint(a: number, b: number): string {
  const p = a * b;
  const has = (k: number) => a === k || b === k;
  const other = (k: number) => (a === k ? b : a);
  if (has(10)) return `Times 10 is easy: ${other(10)} tens is ${p}.`;
  if (has(2)) return `Times 2 means double: ${other(2)} + ${other(2)} = ${p}.`;
  if (has(5)) return `Count by 5s ${other(5)} times, or take half of 10 × ${other(5)} = ${10 * other(5)}.`;
  if (has(9)) {
    const n = other(9);
    return `Use 10s: 10 × ${n} = ${10 * n}, then take away one ${n}.`;
  }
  if (has(4)) {
    const n = other(4);
    return `Double, then double again: ${n} → ${2 * n} → ${4 * n}.`;
  }
  if (has(3)) {
    const n = other(3);
    return `Double ${n} to get ${2 * n}, then add one more ${n}.`;
  }
  if (has(6)) {
    const n = other(6);
    return `5 × ${n} = ${5 * n}. Add one more group of ${n}.`;
  }
  if (has(8)) {
    const n = other(8);
    return `Double three times: ${n} → ${2 * n} → ${4 * n} → ${8 * n}.`;
  }
  return "Split 7 into 5 + 2: 5 × 7 = 35 and 2 × 7 = 14. Add them together.";
}

const ARRAY_EMOJI = ["🍪", "🌸", "⭐", "🍓", "🐞", "🧁", "🍎", "⚽"];

function arrayTotal(d: Level): Question {
  const rows = d === 1 ? randInt(2, 5) : d === 2 ? randInt(3, 6) : randInt(6, 9);
  const cols = d === 1 ? randInt(2, 6) : d === 2 ? randInt(4, 8) : randInt(6, 9);
  const emoji = pick(ARRAY_EMOJI);
  const p = rows * cols;
  return numChoice(
    `How many ${emoji} are in this array?`,
    p,
    [p + cols, p - cols, p + rows, rows + cols],
    `There are ${rows} rows with ${cols} in each row. ${rows} × ${cols} = ${p}.`,
    { type: "array", rows, cols, emoji },
    { min: 1 },
  );
}

function arrayMatch(): Question {
  const rows = randInt(2, 5);
  const cols = randInt(3, 7);
  return textChoice(
    "Which multiplication matches this array?",
    `${rows} × ${cols}`,
    [`${rows} + ${cols}`, `${rows} × ${cols + 1}`, `${rows + 1} × ${cols}`],
    `Count the rows (${rows}) and how many are in each row (${cols}). ${rows} rows of ${cols} is ${rows} × ${cols}.`,
    { type: "array", rows, cols, emoji: pick(ARRAY_EMOJI) },
  );
}

function mulFact(d: Level, input = true): Question {
  const [a, b] = factPair(d);
  const p = a * b;
  const visual = eq(`${a} × ${b} = ?`);
  return input
    ? typeIn(`What is ${a} × ${b}?`, p, mulHint(a, b), visual)
    : numChoice(`What is ${a} × ${b}?`, p, [p + a, p - b, p + b, p - a], `${mulHint(a, b)} So ${a} × ${b} = ${p}.`, visual);
}

function divFact(d: Level): Question {
  const [a, b] = factPair(d);
  const p = a * b;
  return typeIn(
    `What is ${p} ÷ ${a}?`,
    b,
    `Think multiplication: ${a} × what number = ${p}? Try counting by ${a}s up to ${p}.`,
    eq(`${p} ÷ ${a} = ?`),
  );
}

function missingFactor(d: Level): Question {
  const [a, b] = factPair(d);
  const p = a * b;
  const first = chance(0.5);
  const ans = first ? a : b;
  const known = first ? b : a;
  return numChoice(
    "What number goes in the box?",
    ans,
    [ans + 1, ans - 1, ans + 2],
    `Think division: ${p} ÷ ${known} = ${ans}. Check: ${a} × ${b} = ${p}.`,
    eq(first ? `☐ × ${b} = ${p}` : `${a} × ☐ = ${p}`),
    { min: 1 },
  );
}

function factFamily(d: Level): Question {
  const [a, b0] = factPair(d);
  const b = a === b0 ? (b0 > 2 ? b0 - 1 : b0 + 1) : b0;
  const p = a * b;
  return textChoice(
    `Which fact is in the same fact family as ${a} × ${b} = ${p}?`,
    `${p} ÷ ${a} = ${b}`,
    [`${p} ÷ ${b} = ${b}`, `${a} + ${b} = ${a + b}`, `${p} − ${a} = ${p - a}`],
    `A fact family uses the same three numbers: ${a}, ${b} and ${p}. Division undoes multiplication, so ${p} ÷ ${a} = ${b}.`,
  );
}

function turnaround(): Question {
  const [a, b] = sample(range(2, 9), 2);
  return textChoice(
    `Which has the same answer as ${a} × ${b}?`,
    `${b} × ${a}`,
    [`${b} + ${a}`, `${a} × ${a}`, `${b} × ${b}`],
    `You can multiply in any order: ${a} rows of ${b} is the same amount as ${b} rows of ${a}. Both are ${a * b}.`,
    { type: "array", rows: a, cols: b },
  );
}

const GROUP_STORIES: { emoji: string; text: (a: number, b: number, who: string) => string }[] = [
  { emoji: "🍊", text: (a, b, who) => `${who} has ${a} bags with ${b} oranges in each bag. How many oranges is that?` },
  { emoji: "🪑", text: (a, b) => `There are ${a} rows of chairs with ${b} chairs in each row. How many chairs are there?` },
  { emoji: "🧃", text: (a, b) => `Each pack has ${b} juice boxes. How many juice boxes are in ${a} packs?` },
  { emoji: "🖍️", text: (a, b) => `${a} friends each have ${b} crayons. How many crayons do they have altogether?` },
  { emoji: "🌷", text: (a, b, who) => `${who} plants ${a} rows of tulips with ${b} tulips in each row. How many tulips?` },
];

function groupsStory(d: Level): Question {
  const [a, b] = factPair(d);
  const s = pick(GROUP_STORIES);
  return typeIn(s.text(a, b, pick(NAMES)), a * b, `${a} equal groups of ${b} is ${a} × ${b}. ${mulHint(a, b)}`, {
    type: "emoji",
    emoji: s.emoji,
  });
}

const SHARE_STORIES: { emoji: string; text: (p: number, a: number) => string }[] = [
  { emoji: "🍪", text: (p, a) => `${p} cookies are shared equally among ${a} friends. How many cookies does each friend get?` },
  { emoji: "⚽", text: (p, a) => `${p} students make teams of ${a}. How many teams are there?` },
  { emoji: "📚", text: (p, a) => `${p} books are placed equally on ${a} shelves. How many books go on each shelf?` },
  { emoji: "🌱", text: (p, a) => `${p} seedlings are planted in rows of ${a}. How many rows are there?` },
];

function shareStory(d: Level): Question {
  const [a, b] = factPair(d);
  const p = a * b;
  const s = pick(SHARE_STORIES);
  return numChoice(
    s.text(p, a),
    b,
    [b + 1, b - 1, b + 2, a],
    `Divide: ${p} ÷ ${a}. Think: ${a} × what number = ${p}? ${a} × ${b} = ${p}.`,
    { type: "emoji", emoji: s.emoji },
    { min: 1 },
  );
}

function strategyChoice(): Question {
  const kind = pick(["nine", "six", "eight", "seven"] as const);
  const n = randInt(3, 8);
  if (kind === "nine") {
    return textChoice(
      `To find 9 × ${n}, you can find 10 × ${n} and then…`,
      `subtract ${n}`,
      [`add ${n}`, "subtract 9", "subtract 10"],
      `9 groups is one group less than 10 groups. 10 × ${n} = ${10 * n}, and ${10 * n} − ${n} = ${9 * n}.`,
    );
  }
  if (kind === "six") {
    return textChoice(
      `6 × ${n} is double…`,
      `3 × ${n}`,
      [`2 × ${n}`, `6 + ${n}`, `4 × ${n}`],
      `6 is double 3, so 6 × ${n} is double 3 × ${n}: ${3 * n} + ${3 * n} = ${6 * n}.`,
    );
  }
  if (kind === "eight") {
    return textChoice(
      `8 × ${n} is double…`,
      `4 × ${n}`,
      [`2 × ${n}`, `8 + ${n}`, `6 × ${n}`],
      `8 is double 4, so 8 × ${n} is double 4 × ${n}: ${4 * n} + ${4 * n} = ${8 * n}.`,
    );
  }
  return textChoice(
    `7 × ${n} is the same as 5 × ${n} plus…`,
    `2 × ${n}`,
    [`2 + ${n}`, `7 × 2`, `5 × 2`],
    `7 groups = 5 groups + 2 groups. 5 × ${n} = ${5 * n} and 2 × ${n} = ${2 * n}, so 7 × ${n} = ${7 * n}.`,
  );
}

function timesFacts(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  if (d === 1) {
    return buildSet([
      () => arrayTotal(1),
      arrayMatch,
      () => mulFact(1),
      () => mulFact(1, false),
      () => divFact(1),
      () => missingFactor(1),
      () => groupsStory(1),
      turnaround,
    ]);
  }
  if (d === 2) {
    return buildSet([
      () => arrayTotal(2),
      () => mulFact(2),
      () => mulFact(2, false),
      () => divFact(2),
      () => missingFactor(2),
      () => factFamily(2),
      () => groupsStory(2),
      () => shareStory(2),
    ]);
  }
  return buildSet([
    () => mulFact(3),
    () => mulFact(3, false),
    () => divFact(3),
    () => divFact(3),
    () => missingFactor(3),
    () => factFamily(3),
    () => shareStory(3),
    strategyChoice,
  ]);
}

// ---------- Multiply & divide bigger numbers ----------

/** "Split 347 into 300 + 40 + 7: …" */
function splitMulHint(n: number, k: number): string {
  const parts = expandedParts(n);
  if (parts.length < 2) {
    const lead = Number(String(n)[0]);
    const place = n >= 100 ? "hundreds" : "tens";
    return `Think ${lead} × ${k} = ${lead * k}. So ${lead} ${place} × ${k} = ${lead * k} ${place}.`;
  }
  return `Split ${n} into ${parts.join(" + ")}. Multiply each part by ${k}: ${parts.map((p) => `${p} × ${k} = ${fmt(p * k)}`).join(", ")}. Then add the parts.`;
}

function mulTens(d: Level): Question {
  const k = d === 1 ? randInt(2, 5) : randInt(3, 9);
  const big = d === 1 ? 10 : chance(0.5) ? 10 : 100;
  const t = randInt(2, 9);
  const n = t * big;
  const p = n * k;
  return numChoice(
    `What is ${n} × ${k}?`,
    p,
    [p / 10, p * 10, p + n],
    `${t} × ${k} = ${t * k}. So ${t} ${big === 10 ? "tens" : "hundreds"} × ${k} = ${t * k} ${big === 10 ? "tens" : "hundreds"}, which is ${fmt(p)}.`,
    eq(`${n} × ${k} = ?`),
    { step: big },
  );
}

function mul2by1(d: Level): Question {
  let n: number;
  let k: number;
  do {
    n = d === 1 ? randInt(11, 49) : randInt(12, 99);
    k = d === 1 ? randInt(2, 5) : randInt(3, 9);
  } while (n % 10 === 0);
  return typeIn(`What is ${n} × ${k}?`, n * k, splitMulHint(n, k), eq(`${n} × ${k} = ?`));
}

function mul3by1(d: Level, input: boolean): Question {
  let n: number;
  do n = d === 3 ? randInt(120, 999) : randInt(101, 399);
  while (expandedParts(n).length < 3);
  const k = d === 3 ? randInt(3, 9) : randInt(2, 4);
  const p = n * k;
  const visual = eq(`${n} × ${k} = ?`);
  return input
    ? typeIn(`What is ${n} × ${k}?`, p, splitMulHint(n, k), visual)
    : numChoice(`What is ${n} × ${k}?`, p, shuffle([p + 10, p - 10, p + 100, p - 100]), splitMulHint(n, k), visual, {
        step: 10,
      });
}

function divNoRemainder(d: Level): Question {
  let k: number;
  let q: number;
  do {
    k = d === 1 ? randInt(2, 4) : randInt(3, 9);
    q = d === 3 ? randInt(21, 99) : randInt(11, 33);
  } while (q % 10 === 0 || (d === 3 ? k * q < 100 : k * q > 99));
  const p = k * q;
  const tens = Math.floor(q / 10) * 10;
  return typeIn(
    `What is ${p} ÷ ${k}?`,
    q,
    `Split ${p} into parts that are easy to share by ${k}: ${k * tens} + ${k * (q % 10)}. ${k * tens} ÷ ${k} = ${tens} and ${k * (q % 10)} ÷ ${k} = ${q % 10}. Add the two answers.`,
    eq(`${p} ÷ ${k} = ?`),
  );
}

function divRemainder(d: Level): Question {
  let k: number;
  let p: number;
  do {
    k = d === 1 ? randInt(3, 5) : randInt(3, 9);
    p = d === 1 ? randInt(10, 40) : d === 2 ? randInt(20, 99) : randInt(100, 500);
  } while (p % k === 0);
  const q = Math.floor(p / k);
  const r = p % k;
  const right = `${q} R${r}`;
  return textChoice(
    `What is ${p} ÷ ${k}?`,
    right,
    uniq([`${q} R${r + 1 < k ? r + 1 : r - 1}`, `${q - 1} R${r + k}`, `${q + 1} R${r}`], [right]),
    `${k} × ${q} = ${k * q}, the closest you can get without going over ${p}. ${p} − ${k * q} = ${r} left over, so the remainder is ${r}.`,
    eq(`${p} ÷ ${k}`),
  );
}

function remainderInput(d: Level): Question {
  let k: number;
  let p: number;
  do {
    k = d === 1 ? randInt(3, 5) : randInt(4, 9);
    p = d === 1 ? randInt(13, 40) : randInt(25, 99);
  } while (p % k === 0);
  return typeIn(
    `What is the remainder when you divide ${p} by ${k}?`,
    p % k,
    `Find the biggest multiple of ${k} that is not more than ${p}. How many are left over?`,
    eq(`${p} ÷ ${k} = ☐ R ☐`),
  );
}

function areaModel(d: Level): Question {
  const k = randInt(3, 9);
  if (d === 3) {
    const h = randInt(1, 9) * 100;
    const t = randInt(1, 9) * 10;
    const o = randInt(1, 9);
    return textChoice(
      `Which shows a way to find ${k} × ${h + t + o}?`,
      `${k} × ${h} + ${k} × ${t} + ${k} × ${o}`,
      [`${k} × ${h} + ${k} × ${t} + ${o}`, `${k} × ${h / 100} + ${k} × ${t / 10} + ${k} × ${o}`, `${k} × ${h} + ${t} + ${o}`],
      `Split ${h + t + o} into ${h} + ${t} + ${o}. Every part must be multiplied by ${k}.`,
    );
  }
  const t = randInt(2, 9) * 10;
  const o = randInt(1, 9);
  return textChoice(
    `Which shows a way to find ${k} × ${t + o}?`,
    `${k} × ${t} + ${k} × ${o}`,
    [`${k} × ${t} + ${o}`, `${k} × ${t / 10} + ${k} × ${o}`, `${k} × ${t} × ${o}`],
    `Split ${t + o} into ${t} + ${o}. Multiply both parts by ${k}: ${k} × ${t} = ${k * t} and ${k} × ${o} = ${k * o}. Then add.`,
  );
}

const MUL_STORIES: { emoji: string; text: (n: number, k: number) => string }[] = [
  { emoji: "✏️", text: (n, k) => `A carton holds ${n} pencils. How many pencils are in ${k} cartons?` },
  { emoji: "🚂", text: (n, k) => `A train carries ${n} passengers on each trip. How many passengers ride on ${k} trips?` },
  { emoji: "🌻", text: (n, k) => `A farmer plants ${n} sunflowers in each field. How many sunflowers are in ${k} fields?` },
  { emoji: "🏟️", text: (n, k) => `Each section of a stadium has ${n} seats. How many seats are in ${k} sections?` },
];

function mulStory(d: Level): Question {
  const n = d === 1 ? randInt(12, 25) : d === 2 ? randInt(15, 99) : randInt(105, 450);
  const k = d === 1 ? randInt(2, 4) : d === 2 ? randInt(3, 9) : randInt(3, 8);
  const s = pick(MUL_STORIES);
  return typeIn(s.text(n, k), n * k, `${k} groups of ${n} is ${n} × ${k}. ${splitMulHint(n, k)}`, {
    type: "emoji",
    emoji: s.emoji,
  });
}

function divStory(d: Level): Question {
  if (d === 3) {
    const k = randInt(4, 8);
    const q = randInt(5, 12);
    const r = randInt(1, k - 1);
    const p = k * q + r;
    if (chance(0.5)) {
      return numChoice(
        `${p} students are going on a field trip. Each van holds ${k} students. How many vans are needed?`,
        q + 1,
        [q, q + 2, r],
        `${p} ÷ ${k} = ${q} R${r}. ${q} vans are full, and the ${r} students left over need one more van.`,
        { type: "emoji", emoji: "🚐" },
        { min: 1 },
      );
    }
    return numChoice(
      `${p} muffins are packed in boxes of ${k}. How many boxes can be filled all the way?`,
      q,
      [q + 1, r, q - 1],
      `${p} ÷ ${k} = ${q} R${r}. Only ${q} boxes are full. The ${r} extra muffins can't fill another box.`,
      { type: "emoji", emoji: "🧁" },
      { min: 1 },
    );
  }
  let k: number;
  let q: number;
  do {
    k = d === 1 ? randInt(2, 4) : randInt(3, 8);
    q = randInt(11, 32);
  } while (k * q > 99 || q % 10 === 0);
  const p = k * q;
  const story = pick([
    { emoji: "⭐", text: `${p} stickers are shared equally among ${k} albums. How many stickers go in each album?` },
    { emoji: "🍎", text: `${p} apples are put into bags of ${k}. How many bags are filled?` },
    { emoji: "🎨", text: `${p} paintbrushes are shared equally by ${k} tables. How many paintbrushes does each table get?` },
  ]);
  return typeIn(
    story.text,
    q,
    `Divide ${p} by ${k}. Split ${p} into ${k * Math.floor(q / 10) * 10} + ${k * (q % 10)} and divide each part by ${k}.`,
    { type: "emoji", emoji: story.emoji },
  );
}

function estimateProduct(): Question {
  const h = randInt(2, 9);
  const n = h * 100 + pick([-4, -3, -2, -1, 1, 2, 3, 4]);
  const k = randInt(3, 9);
  const est = h * 100 * k;
  return numChoice(
    `About how much is ${n} × ${k}? Round ${n} to the nearest hundred first.`,
    est,
    [(h + 1) * 100 * k, (h - 1) * 100 * k, h * 10 * k],
    `${n} is close to ${h * 100}. ${h * 100} × ${k} = ${fmt(est)}.`,
    eq(`${n} × ${k} ≈ ?`),
    { step: 100 },
  );
}

function multiplyDivide(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  if (d === 1) {
    return buildSet([
      () => mulTens(1),
      () => mul2by1(1),
      () => mul2by1(1),
      () => divNoRemainder(1),
      () => divRemainder(1),
      () => remainderInput(1),
      () => mulStory(1),
      () => divStory(1),
    ]);
  }
  if (d === 2) {
    return buildSet([
      () => mulTens(2),
      () => mul2by1(2),
      () => mul3by1(2, true),
      () => divNoRemainder(2),
      () => divRemainder(2),
      () => areaModel(2),
      () => mulStory(2),
      () => divStory(2),
    ]);
  }
  return buildSet([
    () => mul3by1(3, true),
    () => mul3by1(3, false),
    () => divNoRemainder(3),
    () => divRemainder(3),
    estimateProduct,
    () => areaModel(3),
    () => mulStory(3),
    () => divStory(3),
  ]);
}

// ---------- Fractions ----------

const fr = (n: number, d: number) => `${n}/${d}`;

function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a;
}

/** Every way to write n/d with a denominator up to 24 (for typed answers). */
function fracForms(n: number, d: number): string[] {
  const g = gcd(n, d);
  const out: string[] = [];
  for (let k = 1; (d / g) * k <= 24; k++) out.push(fr((n / g) * k, (d / g) * k));
  return out;
}

/** Compare n1/d1 with n2/d2 without decimals. */
const fracSign = (n1: number, d1: number, n2: number, d2: number): Sign => signOf(n1 * d2, n2 * d1);

function nameFraction(d: Level, input: boolean): Question {
  const den = pick(d === 1 ? [2, 3, 4, 5, 6, 8] : d === 2 ? [3, 4, 5, 6, 8, 10] : [6, 8, 9, 10, 12]);
  const n = randInt(1, den - 1);
  const visual: Visual = { type: "fraction", numerator: n, denominator: den, shape: den <= 8 && chance(0.4) ? "circle" : "bar" };
  const hint = `Count all the equal parts (${den}). That's the bottom number. Count the shaded parts (${n}). That's the top number.`;
  const right = fr(n, den);
  if (input) {
    return typeIn("What fraction is shaded?", right, hint, visual, {
      keypad: "fraction",
      accept: fracForms(n, den).filter((f) => f !== right),
    });
  }
  return textChoice(
    "What fraction is shaded?",
    right,
    uniq([fr(den - n, den), fr(n, den - n), fr(n, den + 1), fr(den, n)], [right]).slice(0, 3),
    hint,
    visual,
  );
}

function compareSameDen(d: Level): Question {
  const den = pick(d === 1 ? [4, 5, 6, 8] : [6, 8, 10, 12]);
  const [a, b] = sample(range(1, den - 1), 2);
  return signChoice(
    fr(a, den),
    fr(b, den),
    signOf(a, b),
    `Both fractions are cut into ${den} equal parts, so the parts are the same size. ${Math.max(a, b)} parts is more than ${Math.min(a, b)} ${Math.min(a, b) === 1 ? "part" : "parts"}.`,
  );
}

function compareSameNum(d: Level): Question {
  const n = d === 1 ? 1 : randInt(1, 3);
  const [x, y] = sample(range(n + 1, 12), 2);
  return signChoice(
    fr(n, x),
    fr(n, y),
    signOf(y, x),
    `Both have ${n} ${n === 1 ? "part" : "parts"}. A whole cut into fewer parts has bigger parts: one ${Math.min(x, y)}-part piece is bigger than one ${Math.max(x, y)}-part piece. So ${fr(n, Math.min(x, y))} is bigger than ${fr(n, Math.max(x, y))}.`,
  );
}

function unitFraction(): Question {
  const dens = sample([2, 3, 4, 5, 6, 8, 10], 3);
  const greatest = chance(0.5);
  const target = greatest ? Math.min(...dens) : Math.max(...dens);
  return textChoice(
    `Which fraction is the ${greatest ? "greatest" : "least"}?`,
    fr(1, target),
    dens.filter((x) => x !== target).map((x) => fr(1, x)),
    "Think of sharing one pizza. Sharing with fewer people gives bigger slices, so a smaller bottom number means a bigger fraction.",
    { type: "emoji", emoji: "🍕" },
  );
}

function benchmarkHalf(d: Level): Question {
  const greater = d === 3 ? chance(0.5) : true;
  const dens = sample([3, 4, 5, 6, 8, 10, 12], 3);
  const make = (above: boolean, den: number) => {
    const n = pick(range(1, den - 1).filter((x) => (above ? 2 * x > den : 2 * x < den)));
    return { n, den, label: fr(n, den) };
  };
  const right = make(greater, dens[0]);
  return textChoice(
    `Which fraction is ${greater ? "greater" : "less"} than 1/2?`,
    right.label,
    [make(!greater, dens[1]).label, make(!greater, dens[2]).label],
    `Double the top number and compare it with the bottom number. For ${right.label}: ${right.n} + ${right.n} = ${2 * right.n}, which is ${greater ? "more" : "less"} than ${right.den}, so it's ${greater ? "more" : "less"} than half.`,
  );
}

function orderFractions(d: Level): Question {
  if (d === 1) {
    const den = pick([5, 6, 8, 10, 12]);
    const nums = sample(range(1, den - 1), 4).sort((a, b) => a - b);
    return orderQ(
      "Put the fractions in order from least to greatest.",
      nums.map((n) => fr(n, den)),
      `All the parts are the same size (${den} in a whole), so just compare how many parts: fewer parts is less.`,
    );
  }
  if (d === 2) {
    const n = randInt(1, 3);
    const dens = sample(range(n + 1, 12), 4).sort((a, b) => b - a);
    return orderQ(
      "Put the fractions in order from least to greatest.",
      dens.map((x) => fr(n, x)),
      `They all have ${n} ${n === 1 ? "part" : "parts"}. The more pieces a whole is cut into, the smaller each piece. So the biggest bottom number is the least.`,
    );
  }
  const small = randInt(6, 10);
  const mid = pick([3, 4]);
  const half = pick(["1/2", "2/4", "3/6", "4/8", "5/10"]);
  const big = randInt(5, 8);
  return orderQ(
    "Put the fractions in order from least to greatest.",
    [fr(1, small), fr(1, mid), half, fr(big - 1, big)],
    `Use 1/2 as a benchmark. ${half} is exactly one half. ${fr(big - 1, big)} is almost a whole. For 1/${small} and 1/${mid}, fewer pieces means bigger pieces.`,
  );
}

const FRACTION_BASES: [number, number][] = [
  [1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [1, 5],
];

function equivalentChoice(): Question {
  const [a, b] = pick(FRACTION_BASES);
  const m = randInt(2, b <= 3 ? 4 : 3);
  const right = fr(a * m, b * m);
  const candidates: [number, number][] = [
    [a + m, b + m],
    [a * m + 1, b * m],
    [a * m - 1, b * m],
    [a * m, b * m + 1],
    [b * m - a * m, b * m],
  ];
  const wrongs = uniq(
    candidates.filter(([n, den]) => n >= 1 && n * b !== a * den).map(([n, den]) => fr(n, den)),
    [right],
  );
  return textChoice(
    `Which fraction is equal to ${fr(a, b)}?`,
    right,
    sample(wrongs, 2),
    `Multiply the top and the bottom by the same number: ${a} × ${m} = ${a * m} and ${b} × ${m} = ${b * m}. Same amount, just more pieces.`,
    { type: "fraction", numerator: a, denominator: b },
  );
}

function equivalentMissing(): Question {
  const [a, b] = pick(FRACTION_BASES);
  const m = randInt(2, 4);
  return typeIn(
    "What number goes in the box?",
    a * m,
    `The bottom number was multiplied by ${m} (${b} × ${m} = ${b * m}). Multiply the top number by ${m} too.`,
    eq(`${fr(a, b)} = ☐/${b * m}`),
  );
}

function numberLineFraction(d: Level): Question {
  const den = pick(d === 1 ? [3, 4] : d === 2 ? [3, 4, 5, 6, 8] : [5, 6, 8, 10]);
  const k = randInt(1, den - 1);
  const right = fr(k, den);
  return textChoice(
    "What fraction goes where the ? is?",
    right,
    uniq([fr(k, den + 1), k + 1 < den ? fr(k + 1, den) : fr(k - 1, den), fr(den - k, den), fr(k - 1, den)], [right, fr(0, den)]).slice(
      0,
      3,
    ),
    `The space from 0 to 1 is cut into ${den} equal jumps. Count the jumps (not the tick marks) from 0 to the ?.`,
    { type: "numberLine", min: 0, max: 1, step: 1 / den, labelEvery: 1, blankAt: k / den },
  );
}

function storyCompare(d: Level): Question {
  const [A, B] = sample(NAMES, 2);
  const same = "They are the same";
  if (d === 1) {
    const den = pick([4, 5, 6, 8, 10]);
    const [x, y] = sample(range(1, den - 1), 2);
    return textChoice(
      `${A} ate ${fr(x, den)} of a pizza. ${B} ate ${fr(y, den)} of a same-size pizza. Who ate more?`,
      x > y ? A : B,
      [x > y ? B : A, same],
      `Both pizzas are cut into ${den} equal slices. Compare the number of slices: ${x} and ${y}.`,
      { type: "emoji", emoji: "🍕" },
    );
  }
  if (d === 2) {
    const n = randInt(1, 3);
    const [x, y] = sample(range(n + 1, 10), 2);
    return textChoice(
      `${A} ran ${fr(n, x)} of a trail. ${B} ran ${fr(n, y)} of the same trail. Who ran farther?`,
      x < y ? A : B,
      [x < y ? B : A, same],
      `Both ran ${n} ${n === 1 ? "part" : "parts"}. A trail cut into fewer parts has longer parts, so the smaller bottom number is farther.`,
      { type: "emoji", emoji: "🏃" },
    );
  }
  if (chance(0.3)) {
    const [a, b] = pick([[1, 2], [2, 3], [3, 4], [1, 3]] as [number, number][]);
    const m = randInt(2, 3);
    return textChoice(
      `${A} painted ${fr(a, b)} of a fence. ${B} painted ${fr(a * m, b * m)} of a same-size fence. Who painted more?`,
      same,
      [A, B],
      `${fr(a, b)} and ${fr(a * m, b * m)} are equal fractions: multiply the top and bottom of ${fr(a, b)} by ${m}.`,
      { type: "emoji", emoji: "🎨" },
    );
  }
  const [d1, d2] = sample([4, 5, 6, 8, 10], 2);
  const below = pick(range(1, d1 - 1).filter((n) => 2 * n < d1));
  const above = pick(range(1, d2 - 1).filter((n) => 2 * n > d2));
  const aFirst = chance(0.5);
  return textChoice(
    `${A} painted ${aFirst ? fr(below, d1) : fr(above, d2)} of a fence. ${B} painted ${aFirst ? fr(above, d2) : fr(below, d1)} of a same-size fence. Who painted more?`,
    aFirst ? B : A,
    [aFirst ? A : B, same],
    `Compare each fraction with 1/2. ${fr(below, d1)} is less than half, and ${fr(above, d2)} is more than half.`,
    { type: "emoji", emoji: "🎨" },
  );
}

function mixedCompare(): Question {
  if (chance(0.35)) {
    const [a, b] = pick([[1, 2], [1, 3], [2, 3], [3, 4], [1, 4]] as [number, number][]);
    const m = randInt(2, 3);
    const flip = chance(0.5);
    const big = fr(a * m, b * m);
    return signChoice(
      flip ? big : fr(a, b),
      flip ? fr(a, b) : big,
      "=",
      `Multiply the top and bottom of ${fr(a, b)} by ${m} and you get ${big}. They're equal.`,
    );
  }
  const [d1, d2] = sample([3, 4, 5, 6, 8, 10], 2);
  const below = pick(range(1, d1 - 1).filter((n) => 2 * n < d1));
  const above = pick(range(1, d2 - 1).filter((n) => 2 * n > d2));
  const flip = chance(0.5);
  const [ln, ld, rn, rd] = flip ? [above, d2, below, d1] : [below, d1, above, d2];
  return signChoice(
    fr(ln, ld),
    fr(rn, rd),
    fracSign(ln, ld, rn, rd),
    `Use 1/2 as a benchmark. ${fr(below, d1)} is less than half and ${fr(above, d2)} is more than half.`,
  );
}

function fractions(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  if (d === 1) {
    return buildSet([
      () => nameFraction(1, false),
      () => nameFraction(1, true),
      () => compareSameDen(1),
      () => compareSameNum(1),
      unitFraction,
      () => orderFractions(1),
      () => numberLineFraction(1),
      () => storyCompare(1),
    ]);
  }
  if (d === 2) {
    return buildSet([
      () => nameFraction(2, true),
      () => compareSameDen(2),
      () => compareSameNum(2),
      () => benchmarkHalf(2),
      () => orderFractions(2),
      equivalentChoice,
      () => numberLineFraction(2),
      () => storyCompare(2),
    ]);
  }
  return buildSet([
    () => nameFraction(3, true),
    () => compareSameNum(3),
    mixedCompare,
    () => benchmarkHalf(3),
    () => orderFractions(3),
    equivalentMissing,
    () => numberLineFraction(3),
    () => storyCompare(3),
  ]);
}

// ---------- Decimals ----------
// Decimals are kept as whole numbers of hundredths so the maths stays exact.

/** Shortest form: 250 → "2.5", 205 → "2.05", 300 → "3". */
function dec(h: number): string {
  const whole = Math.floor(h / 100);
  const part = h % 100;
  if (part === 0) return String(whole);
  if (part % 10 === 0) return `${whole}.${part / 10}`;
  return `${whole}.${String(part).padStart(2, "0")}`;
}

/** Always two decimal places: 250 → "2.50". */
const dec2 = (h: number) => `${Math.floor(h / 100)}.${String(h % 100).padStart(2, "0")}`;

function decInput(prompt: string, h: number, hint: string, visual?: Visual): InputQuestion {
  const answer = dec(h);
  return typeIn(prompt, answer, hint, visual, {
    keypad: "decimal",
    accept: uniq([dec2(h), h % 100 === 0 ? `${h / 100}.0` : ""].filter(Boolean), [answer]),
  });
}

function tenthsModel(d: Level): Question {
  const k = randInt(1, 9);
  const wholes = d - 1;
  const h = wholes * 100 + k * 10;
  return decInput(
    wholes ? "Each bar is 1 whole. What decimal shows the shaded part?" : "The bar is 1 whole. What decimal shows the shaded part?",
    h,
    `Each bar has 10 equal parts, so each part is 1 tenth (0.1).${wholes ? ` ${wholes} full ${wholes === 1 ? "bar is" : "bars are"} ${wholes} ${wholes === 1 ? "whole" : "wholes"}.` : ""} Count the shaded tenths in the last bar: ${k}.`,
    { type: "fraction", numerator: wholes * 10 + k, denominator: 10 },
  );
}

function writeDecimal(d: Level): Question {
  if (d === 1) {
    const k = randInt(1, 9);
    return chance(0.5)
      ? decInput(`Write ${k} tenths as a decimal.`, k * 10, "Tenths go in the first place after the decimal point.")
      : decInput("Write this fraction as a decimal.", k * 10, "Tenths go in the first place after the decimal point.", eq(fr(k, 10)));
  }
  if (d === 2) {
    let n: number;
    do n = randInt(11, 99);
    while (n % 10 === 0);
    return chance(0.5)
      ? decInput(`Write ${n} hundredths as a decimal.`, n, "Hundredths use two places after the decimal point: tenths, then hundredths.")
      : decInput(
          "Write this fraction as a decimal.",
          n,
          `${n}/100 is ${n} hundredths. Hundredths use two places after the decimal point.`,
          eq(fr(n, 100)),
        );
  }
  const w = randInt(1, 9);
  const n = chance(0.5) ? randInt(1, 9) : randInt(11, 99);
  return decInput(
    `Write ${numberWords(w)} and ${n} hundredths as a decimal.`,
    w * 100 + n,
    `Write ${w} for the ones, then the decimal point, then ${n} hundredths using two places.${n < 10 ? " There are 0 tenths, so put a 0 in the tenths place." : ""}`,
  );
}

function decimalNumberLine(d: Level): Question {
  // Everything in hundredths.
  const minH = d === 1 ? 0 : d === 2 ? randInt(1, 9) * 100 : randInt(10, 98) * 10;
  const stepH = d === 3 ? 1 : 10;
  const k = pick([1, 2, 3, 4, 6, 7, 8, 9]);
  const ans = minH + k * stepH;
  const maxH = minH + 10 * stepH;
  const wrongs = [ans + stepH, ans - stepH, ans + 2 * stepH, ans - 2 * stepH].filter((w) => w > minH && w < maxH);
  if (d === 3) wrongs.push(minH + k * 10);
  return numChoice(
    "What decimal goes where the ? is?",
    ans,
    shuffle(wrongs),
    `Each small jump is ${stepH === 10 ? "1 tenth (0.1)" : "1 hundredth (0.01)"}. Count the jumps from ${dec(k < 5 ? minH : minH + 5 * stepH)}.`,
    {
      type: "numberLine",
      min: minH / 100,
      max: maxH / 100,
      step: stepH / 100,
      labelEvery: (5 * stepH) / 100,
      blankAt: ans / 100,
    },
    { format: dec, step: stepH, min: minH + 1 },
  );
}

function compareDecimals(d: Level): Question {
  let a: number;
  let b: number;
  let left: string;
  let right: string;
  if (d === 1) {
    const w = pick([0, randInt(1, 9)]);
    const [x, y] = sample(range(1, 9), 2);
    a = w * 100 + x * 10;
    b = w * 100 + y * 10;
    left = dec(a);
    right = dec(b);
  } else if (d === 2 || chance(0.6)) {
    // Tenths against hundredths: is the longer number bigger? Not always!
    const w = randInt(0, 3);
    do {
      a = w * 100 + randInt(1, 9) * 10;
      b = w * 100 + randInt(1, 99);
    } while (b % 10 === 0 || a === b);
    left = dec(a);
    right = dec(b);
  } else {
    // Equal decimals written differently: 0.5 and 0.50.
    a = randInt(0, 9) * 100 + randInt(1, 9) * 10;
    b = a;
    left = dec(a);
    right = dec2(a);
  }
  const flip = chance(0.5);
  return signChoice(
    flip ? right : left,
    flip ? left : right,
    flip ? signOf(b, a) : signOf(a, b),
    `Line up the decimal points. Write both with hundredths (${dec2(a)} and ${dec2(b)}) and compare the ones, then the tenths, then the hundredths.`,
  );
}

function decimalPlaceValue(): Question {
  const [w, t, h] = sample(range(1, 9), 3);
  const n = `${w}.${t}${h}`;
  const askTenths = chance(0.5);
  const digit = askTenths ? t : h;
  return textChoice(
    `In ${n}, what is the value of the digit ${digit}?`,
    `${digit} ${askTenths ? "tenths" : "hundredths"}`,
    [`${digit} ${askTenths ? "hundredths" : "tenths"}`, `${digit} ones`, `${digit} tens`],
    "After the decimal point, the first place is tenths and the second place is hundredths.",
    eq(n),
  );
}

function fractionToDecimal(d: Level): Question {
  if (d === 1) {
    const k = randInt(1, 9);
    return textChoice(
      `Which decimal is equal to ${fr(k, 10)}?`,
      `0.${k}`,
      [`0.0${k}`, `${k}.0`, `1.${k}`],
      `${fr(k, 10)} is ${k} tenths. Tenths go in the first place after the decimal point: 0.${k}.`,
      { type: "fraction", numerator: k, denominator: 10 },
    );
  }
  const n = chance(0.5) ? randInt(1, 9) : randInt(11, 99);
  const right = dec(n);
  const wrongs =
    n < 10
      ? [`0.${n}`, `${n}.0`, `0.${n}1`]
      : [dec(n * 10), `0.${n % 10}${Math.floor(n / 10)}`, `${Math.floor(n / 10)}.${n % 10}0`];
  return textChoice(
    `Which decimal is equal to ${fr(n, 100)}?`,
    right,
    uniq(wrongs, [right, dec2(n)]).slice(0, 3),
    `${fr(n, 100)} is ${n} hundredths, so it needs two places after the decimal point${n < 10 ? ", with a 0 in the tenths place" : ""}.`,
  );
}

function orderDecimals(d: Level): Question {
  let hs: number[];
  if (d === 1) {
    const w = randInt(0, 5);
    hs = sample(range(1, 9), 4).map((t) => w * 100 + t * 10);
  } else if (d === 2) {
    hs = distinctInts(4, 1, 99, (n) => n % 10 !== 0 || chance(0.5));
  } else {
    const w = randInt(1, 9);
    hs = distinctInts(4, 1, 99).map((n) => w * 100 + n);
  }
  hs.sort((a, b) => a - b);
  return orderQ(
    "Put the decimals in order from least to greatest.",
    hs.map(dec),
    "Write them all with hundredths (like 0.4 → 0.40) so they're easier to compare. Then compare the ones, the tenths, then the hundredths.",
  );
}

function pickDecimalPair(d: Level, sub: boolean): [number, number] {
  for (;;) {
    let a: number;
    let b: number;
    if (d === 1) {
      a = randInt(1, 9) * 100 + randInt(1, 9) * 10;
      b = randInt(1, 5) * 100 + randInt(1, 9) * 10;
      const ta = (a % 100) / 10;
      const tb = (b % 100) / 10;
      if (sub ? a > b && ta >= tb : ta + tb <= 9) return [a, b];
    } else if (d === 2) {
      if (chance(0.5)) {
        a = randInt(1, 9) * 100 + randInt(1, 9) * 10;
        b = randInt(1, 5) * 100 + randInt(1, 9) * 10;
      } else {
        a = randInt(100, 899);
        b = randInt(100, 499);
      }
      if (a % 10 === 0 && b % 10 !== 0) continue;
      if (sub ? a - b >= 10 : a + b < 1000) return [a, b];
    } else {
      a = randInt(110, 899);
      b = randInt(105, 699);
      if (a % 100 === 0 || b % 100 === 0 || (a % 10 === 0 && b % 10 === 0)) continue;
      if (sub ? a - b >= 50 : a + b < 1000) return [a, b];
    }
  }
}

function addDecimals(d: Level): Question {
  const [a, b] = pickDecimalPair(d, false);
  return decInput(
    `What is ${dec(a)} + ${dec(b)}?`,
    a + b,
    `Line up the decimal points. Write both with hundredths (${dec2(a)} and ${dec2(b)}), then add the hundredths, the tenths and the ones. Estimate first: about ${Math.round(a / 100)} + ${Math.round(b / 100)}.`,
    eq(`${dec(a)} + ${dec(b)} = ?`),
  );
}

function subtractDecimals(d: Level): Question {
  const [a, b] = pickDecimalPair(d, true);
  const hint = `Line up the decimal points and write both with hundredths: ${dec2(a)} − ${dec2(b)}. Subtract the hundredths, then the tenths, then the ones, regrouping if you need to.`;
  const visual = eq(`${dec(a)} − ${dec(b)} = ?`);
  if (d === 1) {
    return numChoice(`What is ${dec(a)} − ${dec(b)}?`, a - b, [a - b + 10, a - b - 100, a - b + 100], hint, visual, {
      format: dec,
      step: 10,
      min: 1,
    });
  }
  return decInput(`What is ${dec(a)} − ${dec(b)}?`, a - b, hint, visual);
}

function decimalStory(): Question {
  const who = pick(NAMES);
  if (chance(0.5)) {
    const a = randInt(51, 199) * 5;
    const b = randInt(11, 99) * 10;
    const story = pick([
      `${who} ran ${dec(a)} km on Monday and ${dec(b)} km on Tuesday. How far did ${who} run in all?`,
      `A red ribbon is ${dec(a)} m long and a blue ribbon is ${dec(b)} m long. What is their total length?`,
    ]);
    const misaligned = a + b / 10;
    return numChoice(
      story,
      a + b,
      [misaligned, a + b + 10, a + b - 100],
      `Line up the decimal points: ${dec2(a)} + ${dec2(b)}. Add hundredths, tenths, then ones.`,
      { type: "emoji", emoji: "📏" },
      { format: dec, step: 10, min: 1 },
    );
  }
  const a = randInt(301, 899);
  const b = randInt(11, Math.floor(a / 10) - 5) * 10;
  return numChoice(
    `A pumpkin has a mass of ${dec(a)} kg. A squash has a mass of ${dec(b)} kg. How much heavier is the pumpkin?`,
    a - b,
    [a - b / 10, a - b + 10, a - b - 100],
    `Find the difference, lining up the decimal points: ${dec2(a)} − ${dec2(b)}.`,
    { type: "emoji", emoji: "🎃" },
    { format: dec, step: 10, min: 1 },
  );
}

function decimals(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  if (d === 1) {
    return buildSet([
      () => tenthsModel(1),
      () => writeDecimal(1),
      () => decimalNumberLine(1),
      () => compareDecimals(1),
      () => fractionToDecimal(1),
      () => orderDecimals(1),
      () => addDecimals(1),
      () => subtractDecimals(1),
    ]);
  }
  if (d === 2) {
    return buildSet([
      () => tenthsModel(2),
      () => writeDecimal(2),
      () => decimalNumberLine(2),
      () => compareDecimals(2),
      decimalPlaceValue,
      () => orderDecimals(2),
      () => addDecimals(2),
      () => subtractDecimals(2),
    ]);
  }
  return buildSet([
    () => writeDecimal(3),
    () => decimalNumberLine(3),
    () => compareDecimals(3),
    () => fractionToDecimal(3),
    () => orderDecimals(3),
    () => addDecimals(3),
    () => subtractDecimals(3),
    decimalStory,
  ]);
}

// ---------- Patterns & tables ----------

function makeSeq(d: Level, up: boolean, length: number): { step: number; seq: number[] } {
  let step: number;
  let start: number;
  const span = length - 1;
  if (d === 1) {
    step = randInt(2, 10);
    start = up ? randInt(1, 50) : step * span + randInt(5, 60);
  } else if (d === 2) {
    step = pick([11, 12, 15, 20, 25, 50, 75]);
    start = up ? randInt(10, 500) : step * span + randInt(20, 400);
  } else {
    step = pick([125, 150, 200, 250, 300, 500]);
    start = up ? randInt(1, 40) * 50 : step * span + randInt(1, 60) * 50;
  }
  return { step, seq: range(0, span).map((i) => (up ? start + i * step : start - i * step)) };
}

function nextTerm(d: Level, up: boolean): Question {
  const { step, seq } = makeSeq(d, up, 5);
  const shown = seq.slice(0, 4);
  const next = seq[4];
  const sign = up ? "+" : "−";
  const hint = `Find the change from one number to the next: ${fmt(shown[0])} to ${fmt(shown[1])} is ${sign}${fmt(step)}. Do the same to ${fmt(shown[3])}.`;
  const visual = eq(`${shown.map(fmt).join(", ")}, ☐`);
  if (up) return typeIn("What number comes next?", next, hint, visual);
  return numChoice(
    "What number comes next?",
    next,
    [next - step, shown[3] + step, next + 10, next - 10],
    hint,
    visual,
    { step: d === 3 ? 50 : 1 },
  );
}

function missingMiddle(d: Level): Question {
  const up = chance(0.5);
  const { step, seq } = makeSeq(d, up, 5);
  const gap = randInt(1, 3);
  const ans = seq[gap];
  const text = seq.map((n, i) => (i === gap ? "☐" : fmt(n))).join(", ");
  return numChoice(
    "What number is missing?",
    ans,
    d === 3 ? [ans + 100, ans - 100, ans + 50] : [ans + 10, ans - 10, ans + 1, ans - 1],
    `The pattern ${up ? "goes up" : "goes down"} by ${fmt(step)} each time. ${fmt(seq[gap - 1])} ${up ? "+" : "−"} ${fmt(step)} = ${fmt(ans)}.`,
    eq(text),
    { step: d === 3 ? 50 : 1 },
  );
}

function patternRule(d: Level): Question {
  const up = d === 1 ? true : chance(0.5);
  const { step, seq } = makeSeq(d, up, 4);
  const verb = up ? "Add" : "Subtract";
  const other = up ? "Subtract" : "Add";
  const rule = (start: number, v: string, k: number) => `Start at ${fmt(start)}. ${v} ${fmt(k)} each time.`;
  return textChoice(
    "What is the pattern rule?",
    rule(seq[0], verb, step),
    [rule(seq[0], other, step), rule(seq[0], verb, step + (d === 3 ? 50 : 1)), rule(seq[1], verb, step)],
    `A pattern rule tells the first number and how it changes. ${fmt(seq[0])} to ${fmt(seq[1])} goes ${up ? "up" : "down"} by ${fmt(step)}.`,
    eq(seq.map(fmt).join(", ")),
  );
}

const RATE_TABLES = [
  { a: "Tricycles", b: "Wheels", k: 3 },
  { a: "Spiders", b: "Legs", k: 8 },
  { a: "Packs", b: "Juice boxes", k: 6 },
  { a: "Weeks", b: "Days", k: 7 },
  { a: "Cars", b: "Wheels", k: 4 },
  { a: "Starfish", b: "Arms", k: 5 },
  { a: "Bikes", b: "Wheels", k: 2 },
  { a: "Hands", b: "Fingers", k: 5 },
];

function tableNext(d: Level): Question {
  if (d === 3) {
    const who = pick(NAMES);
    const start = randInt(2, 10) * 5;
    const k = pick([5, 10, 15, 20]);
    const ask = randInt(6, 9);
    return typeIn(
      `${who} adds the same amount to savings every week. How many dollars will ${who} have by week ${ask}?`,
      start + k * (ask - 1),
      `The total goes up by $${k} each week. Keep adding $${k} until you reach week ${ask}.`,
      {
        type: "table",
        title: `${who}'s savings`,
        headers: ["Week", "Total saved ($)"],
        rows: range(1, 4).map((w) => [w, start + k * (w - 1)]),
      },
    );
  }
  const t = pick(RATE_TABLES);
  const shown = d === 1 ? [1, 2, 3] : [1, 2, 3, 4];
  const ask = d === 1 ? 4 : randInt(6, 9);
  const rows: (string | number)[][] = shown.map((n) => [n, n * t.k]);
  if (d === 1) rows.push([4, "?"]);
  return typeIn(
    `How many ${t.b.toLowerCase()} are there for ${ask} ${t.a.toLowerCase()}?`,
    ask * t.k,
    d === 1
      ? `Each row adds ${t.k} more ${t.b.toLowerCase()}. Add ${t.k} to the last number.`
      : `The ${t.b.toLowerCase()} are always ${t.k} times the ${t.a.toLowerCase()}. Multiply ${ask} × ${t.k}.`,
    { type: "table", headers: [t.a, t.b], rows },
  );
}

interface Rule {
  label: string;
  f: (x: number) => number;
}

function tableRule(d: Level): Question {
  const rules: Rule[] = [
    ...range(2, 12).map((k) => ({ label: `Add ${k}`, f: (x: number) => x + k })),
    ...range(2, 9).map((k) => ({ label: `Multiply by ${k}`, f: (x: number) => x * k })),
    ...(d >= 2 ? range(1, 9).map((k) => ({ label: `Subtract ${k}`, f: (x: number) => x - k })) : []),
  ];
  const ins =
    d === 1 ? pick([[1, 2, 3, 4], [2, 3, 4, 5]]) : distinctInts(4, d === 2 ? 1 : 3, d === 2 ? 10 : 15).sort((a, b) => a - b);
  const valid = rules.filter((r) => ins.every((x) => r.f(x) >= 0));
  const right = pick(valid);
  const outs = ins.map(right.f);
  const fails = (r: Rule) => ins.some((x, i) => r.f(x) !== outs[i]);
  const tricky = valid.filter((r) => r !== right && fails(r) && r.f(ins[0]) === outs[0]);
  const others = valid.filter((r) => r !== right && fails(r) && r.f(ins[0]) !== outs[0]);
  const wrongs = uniq([...sample(tricky, 1), ...sample(others, 3)].map((r) => r.label), [right.label]).slice(0, 3);
  return textChoice(
    "Which rule turns each In number into its Out number?",
    right.label,
    wrongs,
    `Test a rule on every row, not just the first one. A rule that works for ${ins[0]} → ${outs[0]} might not work for ${ins[1]} → ${outs[1]}.`,
    { type: "table", headers: ["In", "Out"], rows: ins.map((x, i) => [x, outs[i]]) },
  );
}

const RELATIONS = [
  { one: "table", many: "tables", has: "chairs", k: 4, emoji: "🪑" },
  { one: "bike", many: "bikes", has: "wheels", k: 2, emoji: "🚲" },
  { one: "pack", many: "packs", has: "markers", k: 8, emoji: "🖍️" },
  { one: "carton", many: "cartons", has: "eggs", k: 12, emoji: "🥚" },
  { one: "team", many: "teams", has: "players", k: 5, emoji: "🏀" },
  { one: "spider", many: "spiders", has: "legs", k: 8, emoji: "🕷️" },
  { one: "week", many: "weeks", has: "days", k: 7, emoji: "📅" },
];

function relationship(d: Level): Question {
  const r = pick(RELATIONS);
  const n = d === 1 ? randInt(3, 6) : randInt(6, 12);
  if (d === 3) {
    return typeIn(
      `For every 1 ${r.one}, there are ${r.k} ${r.has}. There are ${n * r.k} ${r.has}. How many ${r.many} are there?`,
      n,
      `Each ${r.one} has ${r.k} ${r.has}, so divide: ${n * r.k} ÷ ${r.k}. Or count by ${r.k}s to ${n * r.k}.`,
      { type: "emoji", emoji: r.emoji },
    );
  }
  return typeIn(
    `For every 1 ${r.one}, there are ${r.k} ${r.has}. How many ${r.has} are there for ${n} ${r.many}?`,
    n * r.k,
    `Each ${r.one} adds ${r.k} ${r.has}. Multiply: ${n} × ${r.k}.`,
    { type: "emoji", emoji: r.emoji },
  );
}

const DOWN_CONTEXTS = [
  { row: "Hour", col: "Litres left", text: "A tank drains the same amount of water every hour.", unit: "litres", ask: "hour" },
  { row: "Day", col: "Pages left", text: "WHO reads the same number of pages every day.", unit: "pages", ask: "day" },
  { row: "Week", col: "Dollars left", text: "WHO spends the same amount of money every week.", unit: "dollars", ask: "week" },
];

function decreasingTable(d: Level): Question {
  const c = pick(DOWN_CONTEXTS);
  const k = d === 1 ? randInt(2, 9) : randInt(5, 15);
  const ask = d === 1 ? 4 : d === 2 ? 5 : 7;
  const start = k * ask + randInt(1, 6) * (d === 1 ? 2 : 5);
  const ans = start - k * ask;
  return numChoice(
    `${c.text.replace("WHO", pick(NAMES))} How many ${c.unit} will be left after ${c.ask} ${ask}?`,
    ans,
    [ans + k, ans - k, ans + 2 * k, ans + 1],
    `The number goes down by ${k} each ${c.ask}. Keep subtracting ${k} until you reach ${c.ask} ${ask}.`,
    { type: "table", headers: [c.row, c.col], rows: range(0, 3).map((i) => [i, start - k * i]) },
  );
}

function patterns(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  return buildSet([
    () => nextTerm(d, true),
    () => nextTerm(d, false),
    () => missingMiddle(d),
    () => patternRule(d),
    () => tableNext(d),
    () => tableRule(d),
    () => relationship(d),
    () => decreasingTable(d),
  ]);
}

// ---------- Equations ----------

/** Facts for each level: [factor, factor]. */
function eqFactors(d: Level): [number, number] {
  if (d === 1) return [randInt(2, 5), randInt(2, 10)];
  if (d === 2) return [randInt(2, 9), randInt(2, 10)];
  return [randInt(3, 9), randInt(11, 25)];
}

function eqTotal(d: Level): number {
  return d === 1 ? randInt(20, 100) : d === 2 ? randInt(200, 1000) : randInt(2000, 9999);
}

function missingAddendEq(d: Level): Question {
  const c = eqTotal(d);
  const a = randInt(Math.ceil(c / 5), c - 5);
  return typeIn(
    "What number goes in the box?",
    c - a,
    `What do you add to ${fmt(a)} to make ${fmt(c)}? Subtract to find it: ${fmt(c)} − ${fmt(a)}.`,
    eq(`${fmt(a)} + ☐ = ${fmt(c)}`),
  );
}

function missingPartSub(d: Level): Question {
  const a = eqTotal(d);
  const c = randInt(Math.ceil(a / 5), a - 5);
  const ans = a - c;
  return numChoice(
    "What number goes in the box?",
    ans,
    [a + c, ans + 10, ans - 1, ans + 1],
    `Taking away the box number leaves ${fmt(c)}. So the box number is ${fmt(a)} − ${fmt(c)} = ${fmt(ans)}.`,
    eq(`${fmt(a)} − ☐ = ${fmt(c)}`),
    { min: 1 },
  );
}

function missingWholeSub(d: Level): Question {
  const total = eqTotal(d);
  const b = randInt(Math.ceil(total / 5), total - 5);
  const c = total - b;
  return typeIn(
    "What number goes in the box?",
    total,
    `Work backwards: you took away ${fmt(b)} and had ${fmt(c)} left. Add ${fmt(b)} back on to ${fmt(c)}.`,
    eq(`☐ − ${fmt(b)} = ${fmt(c)}`),
  );
}

function missingFactorEq(d: Level): Question {
  const [k, q] = eqFactors(d);
  const p = k * q;
  return typeIn(
    "What number goes in the box?",
    q,
    `What times ${k} makes ${p}? Divide to find it: ${p} ÷ ${k}.`,
    eq(chance(0.5) ? `☐ × ${k} = ${p}` : `${k} × ☐ = ${p}`),
  );
}

function missingDivisorEq(d: Level): Question {
  const [k, q] = eqFactors(d === 3 ? 2 : d);
  const p = k * q;
  return numChoice(
    "What number goes in the box?",
    k,
    [k + 1, k - 1, q, k + 2],
    `${p} split into groups gives ${q}. Think: ${q} × what number = ${p}? ${q} × ${k} = ${p}.`,
    eq(`${p} ÷ ☐ = ${q}`),
    { min: 1 },
  );
}

function missingDividendEq(d: Level): Question {
  const [k, q] = eqFactors(d);
  return numChoice(
    "What number goes in the box?",
    k * q,
    [k + q, k * q + k, k * q - k, q],
    `Work backwards with multiplication: if a number shared into ${k} groups gives ${q}, the number is ${q} × ${k} = ${k * q}.`,
    eq(`☐ ÷ ${k} = ${q}`),
    { min: 1 },
  );
}

function letterEquation(): Question {
  const letter = pick(["n", "x", "m"]);
  const kind = randInt(0, 5);
  let text: string;
  let ans: number;
  let hint: string;
  if (kind === 0) {
    const b = randInt(12, 85);
    ans = randInt(15, 90);
    text = `${letter} + ${b} = ${ans + b}`;
    hint = `Undo the adding: ${ans + b} − ${b}.`;
  } else if (kind === 1) {
    const b = randInt(12, 60);
    ans = randInt(b + 10, 99);
    text = `${letter} − ${b} = ${ans - b}`;
    hint = `Undo the taking away: ${ans - b} + ${b}.`;
  } else if (kind === 2) {
    const a = randInt(60, 150);
    ans = randInt(12, a - 10);
    text = `${a} − ${letter} = ${a - ans}`;
    hint = `What do you take from ${a} to leave ${a - ans}? Find ${a} − ${a - ans}.`;
  } else if (kind === 3) {
    const k = randInt(3, 9);
    ans = randInt(6, 12);
    text = `${k} × ${letter} = ${k * ans}`;
    hint = `Undo the multiplying: ${k * ans} ÷ ${k}.`;
  } else if (kind === 4) {
    const k = randInt(3, 9);
    const q = randInt(4, 12);
    ans = k * q;
    text = `${letter} ÷ ${k} = ${q}`;
    hint = `Undo the dividing: ${q} × ${k}.`;
  } else {
    const k = randInt(3, 9);
    ans = randInt(3, 9);
    text = `${k * ans} ÷ ${letter} = ${k}`;
    hint = `${k} × what number = ${k * ans}?`;
  }
  return typeIn(`What is the value of ${letter}?`, ans, `The letter ${letter} stands for an unknown number. ${hint}`, eq(text));
}

function storyToEquation(d: Level): Question {
  const who = pick(NAMES);
  const kind = randInt(0, 3);
  if (kind === 0) {
    const b = d === 1 ? randInt(5, 20) : randInt(20, 300);
    const c = b + (d === 1 ? randInt(5, 30) : randInt(20, 500));
    return textChoice(
      "Which equation matches the story?",
      `☐ + ${b} = ${c}`,
      [`☐ − ${b} = ${c}`, `${c} + ${b} = ☐`, `${b} − ☐ = ${c}`],
      `The box stands for the number ${who} started with. Then ${b} more were added to make ${c}.`,
      { type: "story", lines: [`${who} had some marbles.`, `${who} got ${b} more.`, `Now ${who} has ${c} marbles.`] },
    );
  }
  if (kind === 1) {
    const a = d === 1 ? randInt(20, 60) : randInt(100, 900);
    const c = randInt(Math.ceil(a / 4), a - 5);
    return textChoice(
      "Which equation matches the story?",
      `${a} − ☐ = ${c}`,
      [`${a} + ☐ = ${c}`, `☐ − ${a} = ${c}`, `${a} + ${c} = ☐`],
      `${who} started with ${a}. The box is the number given away. Taking it away left ${c}.`,
      { type: "story", lines: [`${who} had ${a} stickers.`, `${who} gave some away.`, `Now ${who} has ${c} stickers.`] },
    );
  }
  const [k, q] = eqFactors(d);
  if (kind === 2) {
    return textChoice(
      "Which equation matches the story?",
      `☐ × ${k} = ${k * q}`,
      [`☐ + ${k} = ${k * q}`, `${k * q} × ${k} = ☐`, `☐ ÷ ${k} = ${k * q}`],
      `The box is the number of boxes. Each box has ${k} pencils, so the number of boxes × ${k} = ${k * q}.`,
      {
        type: "story",
        lines: [`Some boxes each hold ${k} pencils.`, `There are ${k * q} pencils in all.`, "How many boxes are there?"],
      },
    );
  }
  return textChoice(
    "Which equation matches the story?",
    `${k * q} ÷ ☐ = ${q}`,
    [`${k * q} × ☐ = ${q}`, `☐ ÷ ${k * q} = ${q}`, `${k * q} − ☐ = ${q}`],
    `${k * q} cookies are shared equally. The box is the number of plates, and each plate gets ${q}.`,
    {
      type: "story",
      lines: [`${k * q} cookies are shared equally on some plates.`, `Each plate gets ${q} cookies.`, "How many plates are there?"],
    },
  );
}

function balanceEq(d: Level): Question {
  if (d === 1) {
    const a = randInt(4, 12);
    const b = randInt(4, 12);
    const c = randInt(2, a + b - 2);
    return typeIn(
      "What number makes both sides equal?",
      a + b - c,
      `The = sign means both sides are worth the same. The left side is ${a + b}. What plus ${c} makes ${a + b}?`,
      eq(`${a} + ${b} = ☐ + ${c}`),
    );
  }
  if (d === 2) {
    const a = randInt(3, 9);
    const b = randInt(3, 10);
    const c = randInt(2, a * b - 2);
    return typeIn(
      "What number makes both sides equal?",
      a * b - c,
      `The = sign means both sides are worth the same. The left side is ${a} × ${b} = ${a * b}. What plus ${c} makes ${a * b}?`,
      eq(`${a} × ${b} = ☐ + ${c}`),
    );
  }
  const p = pick([12, 16, 18, 20, 24, 30, 36, 40, 48]);
  const pairs = range(2, 12)
    .filter((f) => p % f === 0 && p / f >= 2 && p / f <= 12 && f <= p / f)
    .map((f) => [f, p / f]);
  const [left, right] = sample(pairs, 2);
  const [l1, l2] = shuffle(left);
  const [r1, r2] = shuffle(right);
  return typeIn(
    "What number makes both sides equal?",
    r2,
    `Both sides must be worth the same. The left side is ${l1} × ${l2} = ${p}. ${r1} × what number = ${p}?`,
    eq(`${l1} × ${l2} = ${r1} × ☐`),
  );
}

function whichEquation(): Question {
  const t = randInt(3, 9);
  const make = (x: number, op: number): string => {
    if (op === 0) {
      const b = randInt(4, 30);
      return `☐ + ${b} = ${x + b}`;
    }
    if (op === 1) {
      const b = randInt(2, 9);
      return `☐ × ${b} = ${x * b}`;
    }
    if (op === 2) {
      const q = randInt(2, 9);
      return `${x * q} ÷ ☐ = ${q}`;
    }
    const b = randInt(10, 40);
    return `${b + x} − ☐ = ${b}`;
  };
  const ops = shuffle([0, 1, 2, 3]);
  const right = make(t, ops[0]);
  const wrongVals = sample([t - 2, t - 1, t + 1, t + 2], 3);
  return textChoice(
    `In which equation does ☐ stand for ${t}?`,
    right,
    wrongVals.map((v, i) => make(v, ops[i + 1])),
    `Put ${t} in the box of each equation and check whether both sides match. It works in ${right}.`,
  );
}

function storySolve(d: Level): Question {
  const who = pick(NAMES);
  const kind = randInt(0, 3);
  if (kind === 0) {
    const [k, q] = eqFactors(d);
    return typeIn(
      `${who} puts the same number of stamps on each of ${k} pages. There are ${k * q} stamps in all. How many stamps are on each page?`,
      q,
      `Write it as an equation: ${k} × ☐ = ${k * q}. Divide to find the box.`,
      { type: "emoji", emoji: "📮" },
    );
  }
  if (kind === 1) {
    const c = eqTotal(d);
    const b = randInt(Math.ceil(c / 5), c - 5);
    return typeIn(
      `${who} had some trading cards and got ${fmt(b)} more. Now ${who} has ${fmt(c)}. How many cards did ${who} have at first?`,
      c - b,
      `Write it as an equation: ☐ + ${fmt(b)} = ${fmt(c)}. Subtract to find the box.`,
      { type: "emoji", emoji: "🃏" },
    );
  }
  if (kind === 2) {
    const a = eqTotal(d);
    const c = randInt(Math.ceil(a / 5), a - 5);
    return typeIn(
      `A library shelf had ${fmt(a)} books. Some were borrowed, and ${fmt(c)} are left. How many books were borrowed?`,
      a - c,
      `Write it as an equation: ${fmt(a)} − ☐ = ${fmt(c)}. Find what you take from ${fmt(a)} to leave ${fmt(c)}.`,
      { type: "emoji", emoji: "📚" },
    );
  }
  const [k, q] = eqFactors(d);
  return typeIn(
    `Some grapes were shared equally by ${k} friends. Each friend got ${q} grapes. How many grapes were there?`,
    k * q,
    `Write it as an equation: ☐ ÷ ${k} = ${q}. Multiply to work backwards.`,
    { type: "emoji", emoji: "🍇" },
  );
}

function equations(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  if (d === 3) {
    return buildSet([
      letterEquation,
      letterEquation,
      () => missingDivisorEq(3),
      () => missingDividendEq(3),
      () => storyToEquation(3),
      () => balanceEq(3),
      whichEquation,
      () => storySolve(3),
    ]);
  }
  return buildSet([
    () => missingAddendEq(d),
    () => (chance(0.5) ? missingPartSub(d) : missingWholeSub(d)),
    () => missingFactorEq(d),
    () => missingDivisorEq(d),
    () => missingDividendEq(d),
    () => storyToEquation(d),
    () => balanceEq(d),
    () => storySolve(d),
  ]);
}

// ---------- Telling time ----------

const pad2 = (n: number) => String(n).padStart(2, "0");
/** 12-hour clock time without a.m./p.m.: "4:05". */
const t12 = (h: number, m: number) => `${h}:${pad2(m)}`;
/** From a 24-hour hour (0–23): "4:05 p.m." */
const tAmPm = (h24: number, m: number) => `${h24 % 12 === 0 ? 12 : h24 % 12}:${pad2(m)} ${h24 < 12 ? "a.m." : "p.m."}`;
/** "07:05", "16:40" */
const t24 = (h24: number, m: number) => `${pad2(h24)}:${pad2(m)}`;
/** Minutes after midnight → 12-hour time without a.m./p.m. */
const clockText = (mins: number) => t12(Math.floor(mins / 60) % 12 === 0 ? 12 : Math.floor(mins / 60) % 12, mins % 60);
/** "1 h 35 min", "2 h", "45 min" */
const hm = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h} h${m ? ` ${m} min` : ""}` : `${m} min`;
};

const CLOCK_HINT = "The short red hand shows the hour. The long blue hand shows the minutes: each number on the clock is 5 more minutes.";

function readClock(d: Level): Question {
  const h = randInt(1, 12);
  let m: number;
  if (d === 1) m = randInt(0, 11) * 5;
  else if (d === 2) m = randInt(7, 11) * 5;
  else {
    do m = randInt(1, 59);
    while (m % 5 === 0);
  }
  const right = t12(h, m);
  const next = (h % 12) + 1;
  const prev = h === 1 ? 12 : h - 1;
  const wrongs: string[] = [];
  if (m >= 30) wrongs.push(t12(next, m));
  if (m % 5 === 0 && m > 0) wrongs.push(t12(h, m / 5), t12(m / 5, (h * 5) % 60));
  if (m % 5 !== 0) wrongs.push(t12(h, m + 5 <= 59 ? m + 5 : m - 5), t12(h, m >= 10 ? m - 5 : m + 10));
  wrongs.push(t12(prev, m), t12(h, (m + 30) % 60), t12(next, m));
  return textChoice(
    "What time does the clock show?",
    right,
    uniq(wrongs, [right]).slice(0, 3),
    m >= 30
      ? `${CLOCK_HINT} The hour hand is past the ${h} but not yet at the ${next}, so the hour is still ${h}.`
      : CLOCK_HINT,
    { type: "clock", hour: h, minute: m },
  );
}

/** Everyday events, each with a time that makes sense and one that clearly doesn't (24-hour hours). */
const DAY_EVENTS = [
  { text: "eats breakfast before school", h: 7, m: 30, odd: 2, emoji: "🥣" },
  { text: "gets to school", h: 8, m: 45, odd: 3, emoji: "🏫" },
  { text: "wakes up for school", h: 6, m: 50, odd: 23, emoji: "⏰" },
  { text: "eats supper with family", h: 18, m: 0, odd: 2, emoji: "🍲" },
  { text: "goes to bed", h: 20, m: 30, odd: 12, emoji: "🛏️" },
  { text: "goes to soccer practice after school", h: 16, m: 15, odd: 10, emoji: "⚽" },
  { text: "reads a bedtime story", h: 19, m: 45, odd: 13, emoji: "📖" },
];

function amOrPm(): Question {
  const e = pick(DAY_EVENTS);
  return textChoice(
    `${pick(NAMES)} ${e.text}. Which time makes the most sense?`,
    tAmPm(e.h, e.m),
    [tAmPm((e.h + 12) % 24, e.m), tAmPm(e.odd, e.m)],
    "a.m. times are from midnight to noon (night and morning). p.m. times are from noon to midnight (afternoon and evening).",
    { type: "emoji", emoji: e.emoji },
  );
}

function pickHour24(d: Level): number {
  if (d === 1) return randInt(13, 23);
  if (d === 2) return chance(0.5) ? randInt(1, 11) : randInt(13, 23);
  return pick([0, 12, randInt(13, 23), randInt(1, 11)]);
}

const H24_HINT =
  "For p.m. times from 1 p.m. on, add 12 to the hour. a.m. times keep their hour. 12 noon is 12:00, and midnight is 00:00.";

function to24Hour(d: Level): Question {
  const h24 = pickHour24(d);
  const m = randInt(0, 11) * 5;
  const right = t24(h24, m);
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const wrongs = [
    h24 >= 12 ? t24(h12 === 12 ? 0 : h12, m) : t24(h12 === 12 ? 12 : h12 + 12, m),
    t24((h24 + 22) % 24, m),
    t24((h24 + 2) % 24, m),
  ];
  return textChoice(
    `What is ${tAmPm(h24, m)} in 24-hour time?`,
    right,
    uniq(wrongs, [right]),
    H24_HINT,
    { type: "clock", hour: h12, minute: m },
  );
}

function from24Hour(d: Level): Question {
  const h24 = pickHour24(d);
  const m = randInt(0, 11) * 5;
  const right = tAmPm(h24, m);
  return textChoice(
    `What is ${t24(h24, m)} in 12-hour time?`,
    right,
    uniq([tAmPm((h24 + 12) % 24, m), tAmPm((h24 + 22) % 24, m), tAmPm((h24 + 2) % 24, m)], [right]),
    "In 24-hour time, 00:00 to 11:59 is a.m. and 12:00 to 23:59 is p.m. For hours 13 to 23, subtract 12 from the hour. 00 is midnight, so 00:15 is 12:15 a.m.",
    { type: "letter", text: t24(h24, m), caption: "24-hour clock" },
  );
}

function clockTo24(d: Level): Question {
  const h = randInt(1, 11);
  let m = randInt(0, 11) * 5;
  if (d === 3) {
    do m = randInt(1, 59);
    while (m % 5 === 0);
  }
  const part = h <= 5 ? "afternoon" : "evening";
  return textChoice(
    `It is ${part}. What time does the clock show in 24-hour time?`,
    t24(h + 12, m),
    uniq([t24(h, m), t24(h + 10, m), t24(h + 12 <= 22 ? h + 13 : h + 11, m)], [t24(h + 12, m)]),
    `First read the clock: ${t12(h, m)}. In the ${part}, add 12 to the hour: ${h} + 12 = ${h + 12}.`,
    { type: "clock", hour: h, minute: m },
  );
}

function elapsedMinutes(d: Level): Question {
  const h = randInt(1, 9);
  let m1: number;
  let len: number;
  if (d === 1) {
    m1 = randInt(0, 6) * 5;
    len = randInt(2, (55 - m1) / 5) * 5;
  } else if (d === 2) {
    m1 = randInt(6, 11) * 5;
    len = randInt(Math.ceil((65 - m1) / 5), 11) * 5;
  } else {
    m1 = randInt(0, 11) * 5;
    do len = randInt(13, 30) * 5;
    while (len % 60 === 0);
  }
  const start = h * 60 + m1;
  const end = start + len;
  const hint =
    d === 1
      ? `Count on by 5s from ${clockText(start)} to ${clockText(end)}.`
      : `First count to the next hour: ${clockText(start)} to ${clockText(Math.ceil(start / 60) * 60 || start + 60)}${m1 === 0 ? " is a full hour" : ` is ${60 - m1} minutes`}. Then add the minutes after that.${d === 3 ? " Each full hour is 60 minutes." : ""}`;
  return typeIn(`How many minutes is it from ${clockText(start)} to ${clockText(end)}?`, len, hint, eq(`${clockText(start)} → ${clockText(end)}`), {
    suffix: "min",
  });
}

function durationChoice(): Question {
  const sh = randInt(13, 19);
  const m1 = randInt(1, 11) * 5;
  let len: number;
  do len = randInt(13, 35) * 5;
  while (len % 60 === 0);
  const start = sh * 60 + m1;
  const end = start + len;
  const eh = Math.floor(end / 60);
  const em = end % 60;
  const right = hm(len);
  const naive = `${eh - sh} h ${Math.abs(em - m1)} min`;
  return textChoice(
    `How long is a movie that runs from ${tAmPm(sh, m1)} to ${tAmPm(eh, em)}?`,
    right,
    uniq([naive, hm(len + 10), hm(len - 10), hm(len + 60)], [right]).slice(0, 3),
    `Count on from ${tAmPm(sh, m1)}: whole hours first, then the minutes that are left. Remember there are 60 minutes in an hour, not 100.`,
    { type: "emoji", emoji: "🎬" },
  );
}

const TIMED_EVENTS = [
  { name: "Recess", emoji: "⚽" },
  { name: "A swimming lesson", emoji: "🏊" },
  { name: "A bus ride", emoji: "🚌" },
  { name: "Baking cookies", emoji: "🍪" },
  { name: "A library visit", emoji: "📚" },
];

function endTime(d: Level): Question {
  if (d === 3) {
    const e = pick(TIMED_EVENTS.filter((x) => x.name !== "Recess"));
    const sh = randInt(6, 21);
    const m = randInt(0, 11) * 5;
    const dur = randInt(7, 19) * 5;
    const start = sh * 60 + m;
    const end = start + dur;
    const right = t24(Math.floor(end / 60), end % 60);
    return textChoice(
      `${e.name} starts at ${t24(sh, m)} and lasts ${dur} minutes. What time does it end?`,
      right,
      uniq(
        [t24(sh, end % 60), t24(Math.floor((end + 10) / 60), (end + 10) % 60), t24(Math.floor((end - 10) / 60), (end - 10) % 60)],
        [right],
      ),
      `Count on ${dur} minutes from ${t24(sh, m)}. Get to the next hour first, then add the rest.`,
      { type: "emoji", emoji: e.emoji },
    );
  }
  const e = pick(TIMED_EVENTS);
  const h = randInt(1, 10);
  const m = d === 1 ? randInt(0, 6) * 5 : randInt(7, 11) * 5;
  const dur = d === 1 ? randInt(2, (55 - m) / 5) * 5 : randInt(Math.ceil((65 - m) / 5), 9) * 5;
  const start = h * 60 + m;
  const end = start + dur;
  const right = clockText(end);
  const wrongs = [clockText(end + 5), clockText(end - 5), clockText(end + 10)];
  if (d === 2) wrongs.unshift(t12(h, end % 60));
  return textChoice(
    `${e.name} starts at ${t12(h, m)} and lasts ${dur} minutes. What time does it end?`,
    right,
    uniq(wrongs, [right]).slice(0, 3),
    d === 1
      ? `Count on by 5s from ${t12(h, m)}, ${dur / 5} times.`
      : `From ${t12(h, m)} it is ${60 - m} minutes to ${clockText((h + 1) * 60)}. Then add the other ${dur - (60 - m)} minutes.`,
    { type: "emoji", emoji: e.emoji },
  );
}

function minutesHours(d: Level): Question {
  if (d === 1) {
    const n = randInt(2, 5);
    return typeIn(`How many minutes are in ${n} hours?`, n * 60, `Each hour is 60 minutes. Add 60, ${n} times.`, undefined, { suffix: "min" });
  }
  if (d === 2) {
    const h = randInt(1, 2);
    const m = randInt(1, 11) * 5;
    return typeIn(
      `How many minutes are in ${h} h ${m} min?`,
      h * 60 + m,
      `${h} ${h === 1 ? "hour is" : "hours are"} ${h * 60} minutes. Then add the ${m} extra minutes.`,
      undefined,
      { suffix: "min" },
    );
  }
  let mins: number;
  do mins = randInt(14, 35) * 5;
  while (mins % 60 === 0);
  const right = hm(mins);
  const digitRead = mins >= 100 && mins % 100 < 60 ? `${Math.floor(mins / 100)} h ${mins % 100} min` : hm(mins + 50);
  return textChoice(
    `How long is ${mins} minutes in hours and minutes?`,
    right,
    uniq([digitRead, hm(mins + 60), hm(mins - 10)], [right]).slice(0, 3),
    `Take away 60 minutes for each full hour. ${mins} − 60 = ${mins - 60}${mins - 60 >= 60 ? `, and ${mins - 60} − 60 = ${mins - 120}` : ""}.`,
  );
}

function tellingTime(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  if (d === 1) {
    return buildSet([
      () => readClock(1),
      () => readClock(1),
      amOrPm,
      () => to24Hour(1),
      () => from24Hour(1),
      () => elapsedMinutes(1),
      () => endTime(1),
      () => minutesHours(1),
    ]);
  }
  if (d === 2) {
    return buildSet([
      () => readClock(2),
      () => readClock(1),
      () => clockTo24(2),
      () => to24Hour(2),
      () => from24Hour(2),
      () => elapsedMinutes(2),
      () => endTime(2),
      () => minutesHours(2),
    ]);
  }
  return buildSet([
    () => readClock(3),
    () => clockTo24(3),
    () => to24Hour(3),
    () => from24Hour(3),
    () => elapsedMinutes(3),
    durationChoice,
    () => endTime(3),
    () => minutesHours(3),
  ]);
}

// ---------- Polygons, symmetry & perimeter ----------

interface Poly {
  shape: ShapeName;
  sides: number;
  regular: boolean;
  lines: number;
  why: string;
  symmetry: string;
}

const POLYGONS: Poly[] = [
  {
    shape: "square",
    sides: 4,
    regular: true,
    lines: 4,
    why: "All 4 sides are the same length and all 4 angles are equal.",
    symmetry: "Fold a square top to bottom, side to side, or along either diagonal: all 4 folds match.",
  },
  {
    shape: "pentagon",
    sides: 5,
    regular: true,
    lines: 5,
    why: "All 5 sides are the same length and all 5 angles are equal.",
    symmetry: "A regular polygon has as many lines of symmetry as sides. This regular pentagon has 5.",
  },
  {
    shape: "hexagon",
    sides: 6,
    regular: true,
    lines: 6,
    why: "All 6 sides are the same length and all 6 angles are equal.",
    symmetry: "A regular polygon has as many lines of symmetry as sides. This regular hexagon has 6.",
  },
  {
    shape: "octagon",
    sides: 8,
    regular: true,
    lines: 8,
    why: "All 8 sides are the same length and all 8 angles are equal.",
    symmetry: "A regular polygon has as many lines of symmetry as sides. This regular octagon has 8.",
  },
  {
    shape: "rectangle",
    sides: 4,
    regular: false,
    lines: 2,
    why: "Its angles are all equal, but the long sides are longer than the short sides.",
    symmetry: "Fold it top to bottom or side to side and the halves match. A diagonal fold doesn't match. That's 2.",
  },
  {
    shape: "rhombus",
    sides: 4,
    regular: false,
    lines: 2,
    why: "Its sides are all the same length, but its angles are not all equal.",
    symmetry: "Fold this rhombus corner to corner, along either diagonal, and the halves match. That's 2.",
  },
  {
    shape: "trapezoid",
    sides: 4,
    regular: false,
    lines: 1,
    why: "Its sides are different lengths and its angles are not all equal.",
    symmetry: "Only one fold works: straight down the middle, so the left half lands on the right half.",
  },
  {
    shape: "parallelogram",
    sides: 4,
    regular: false,
    lines: 0,
    why: "Its sides are not all the same length and its angles are not all equal.",
    symmetry: "Try folding it any way: the halves never land exactly on each other. So it has 0 lines of symmetry.",
  },
];

const polyOf = (shape: ShapeName) => POLYGONS.find((p) => p.shape === shape)!;

const SIDES_NAME: Record<number, string> = { 3: "triangle", 4: "quadrilateral", 5: "pentagon", 6: "hexagon", 8: "octagon" };

/** "square" or "regular hexagon": a square is already regular. */
const regularName = (p: Poly) => (p.shape === "square" ? "square" : `regular ${p.shape}`);

const SIDE_NAMES: { shape: ShapeName; sides: number }[] = [
  { shape: "triangle", sides: 3 },
  { shape: "pentagon", sides: 5 },
  { shape: "hexagon", sides: 6 },
  { shape: "octagon", sides: 8 },
];

function nameBySides(): Question {
  const [target, ...others] = sample(SIDE_NAMES, 3);
  return textChoice(
    `A polygon has ${target.sides} sides. What is it called?`,
    { label: target.shape, shape: target.shape },
    others.map((o) => ({ label: o.shape, shape: o.shape })),
    "tri- means 3, penta- means 5, hexa- means 6 and octa- means 8 (like an octopus's 8 arms).",
  );
}

function notPolygon(): Question {
  const curved = pick<ShapeName>(["circle", "oval"]);
  return textChoice(
    "Which shape is NOT a polygon?",
    { label: curved, shape: curved },
    sample<ShapeName>(["triangle", "pentagon", "hexagon", "trapezoid", "octagon"], 2).map((s) => ({ label: s, shape: s })),
    "A polygon is a closed shape made only of straight sides. A shape with a curved edge is not a polygon.",
  );
}

function regularOrNot(d: Level): Question {
  const pool: ShapeName[] =
    d === 1
      ? ["square", "hexagon", "octagon", "trapezoid", "parallelogram"]
      : d === 2
        ? ["square", "pentagon", "hexagon", "rectangle", "trapezoid", "parallelogram"]
        : ["rhombus", "rectangle", "octagon", "pentagon", "rhombus", "rectangle"];
  const p = polyOf(pick(pool));
  // Name it by its number of sides, and say whether it's regular.
  const neighbours: Record<number, number[]> = { 4: [3, 5], 5: [4, 6], 6: [5, 8], 8: [6] };
  const other = pick(neighbours[p.sides]);
  const kind = (regular: boolean, sides: number) => `${regular ? "regular" : "irregular"} ${SIDES_NAME[sides]}`;
  return textChoice(
    "What kind of polygon is this?",
    kind(p.regular, p.sides),
    [kind(!p.regular, p.sides), kind(p.regular, other), kind(!p.regular, other)],
    `Count the sides: ${p.sides}, so it is ${/^[aeiou]/.test(SIDES_NAME[p.sides]) ? "an" : "a"} ${SIDES_NAME[p.sides]}. A regular polygon has all sides equal AND all angles equal. ${p.why}`,
    { type: "shape", shape: p.shape },
  );
}

function whichRegular(d: Level): Question {
  const right = d === 3 ? polyOf("square") : polyOf(pick<ShapeName>(["square", "pentagon", "hexagon", "octagon"]));
  const wrongPool: ShapeName[] = d === 3 ? ["rhombus", "rectangle", "parallelogram"] : ["trapezoid", "parallelogram", "rectangle"];
  return textChoice(
    "Which polygon is regular?",
    { label: right.shape, shape: right.shape },
    sample(wrongPool, d === 3 ? 3 : 2).map((s) => ({ label: s, shape: s })),
    `A regular polygon has all sides equal and all angles equal. ${right.why}${d === 3 ? " A rhombus has equal sides but not equal angles, and a rectangle has equal angles but not equal sides." : ""}`,
  );
}

function symmetryLines(d: Level): Question {
  const p = polyOf(pick<ShapeName>(d === 2 ? ["square", "rectangle", "hexagon", "trapezoid"] : ["rhombus", "parallelogram", "octagon", "pentagon"]));
  return numChoice(
    "How many lines of symmetry does this shape have?",
    p.lines,
    [p.sides, p.lines + 1, p.lines - 1, p.lines * 2],
    `A line of symmetry is a fold line where both halves match exactly. ${p.symmetry}`,
    { type: "shape", shape: p.shape },
  );
}

const SYM_LETTERS = ["A", "H", "M", "T", "U", "V", "W", "X", "Y", "O"];
const NON_SYM_LETTERS = ["F", "G", "J", "L", "N", "P", "R", "S", "Z", "Q"];

function letterSymmetry(d: Level): Question {
  const none = d >= 2 && chance(0.5);
  const right = pick(none ? NON_SYM_LETTERS : SYM_LETTERS);
  const wrongs = sample(none ? SYM_LETTERS : NON_SYM_LETTERS, 2);
  return textChoice(
    none ? "Which letter has NO line of symmetry?" : "Which letter has a line of symmetry?",
    right,
    wrongs,
    none
      ? `Imagine folding each letter. ${wrongs.join(" and ")} can fold so the halves match, but ${right} can't fold that way.`
      : `Imagine folding the letter. ${right} can fold down the middle so both halves match exactly.`,
  );
}

function perimeterRegular(d: Level): Question {
  const p = d === 1 ? polyOf("square") : polyOf(pick<ShapeName>(d === 2 ? ["pentagon", "hexagon", "square"] : ["octagon", "hexagon", "pentagon"]));
  const s = d === 1 ? randInt(3, 12) : d === 2 ? randInt(4, 12) : randInt(11, 25);
  return typeIn(
    `Each side of this ${regularName(p)} is ${s} cm long. What is its perimeter?`,
    p.sides * s,
    `Perimeter is the distance all the way around. A ${regularName(p)} has ${p.sides} equal sides, so multiply ${p.sides} × ${s}.`,
    { type: "shape", shape: p.shape },
    { suffix: "cm" },
  );
}

function perimeterGrid(d: Level): Question {
  const rows = d === 1 ? randInt(2, 4) : randInt(3, 6);
  const cols = d === 1 ? randInt(3, 7) : randInt(4, 9);
  return typeIn(
    "Each square is 1 cm on a side. What is the perimeter of this rectangle?",
    2 * (rows + cols),
    `Count the squares along the top (${cols}) and down one side (${rows}). Opposite sides match, so add ${cols} + ${rows} + ${cols} + ${rows}.`,
    { type: "array", rows, cols, emoji: "🟦" },
    { suffix: "cm" },
  );
}

function perimeterRectangle(d: Level): Question {
  const l = d === 3 ? randInt(15, 60) : randInt(6, 20);
  const w = randInt(Math.max(3, Math.ceil(l / 3)), l - 2);
  const thing = d === 3 ? pick(["garden", "playground", "skating rink", "parking lot"]) : "rectangle";
  return typeIn(
    `A ${thing} is ${l} m long and ${w} m wide. What is its perimeter?`,
    2 * (l + w),
    `A rectangle has two long sides and two short sides. Add all four: ${l} + ${w} + ${l} + ${w}. Or add ${l} + ${w} and double it.`,
    { type: "shape", shape: "rectangle" },
    { suffix: "m" },
  );
}

const POLY_NAME: Record<number, string> = { 4: "quadrilateral", 5: "pentagon", 6: "hexagon" };

function sideLengths(n: number, max: number): number[] {
  for (;;) {
    const sides = range(1, n).map(() => randInt(2, max));
    const total = sides.reduce((s, x) => s + x, 0);
    if (Math.max(...sides) < total - Math.max(...sides) && new Set(sides).size > 1) return sides;
  }
}

function perimeterIrregular(d: Level): Question {
  const n = d + 3;
  const sides = sideLengths(n, d === 3 ? 25 : 12);
  const letters = "ABCDEF".split("");
  return typeIn(
    `An irregular ${POLY_NAME[n]} has these side lengths. What is its perimeter?`,
    sides.reduce((s, x) => s + x, 0),
    `Perimeter is the distance all the way around, so add every side: ${sides.join(" + ")}. Tip: add pairs that are easy first.`,
    { type: "table", headers: ["Side", "Length (cm)"], rows: sides.map((x, i) => [letters[i], x]) },
    { suffix: "cm" },
  );
}

function missingSide(): Question {
  if (chance(0.5)) {
    const p = polyOf(pick<ShapeName>(["square", "pentagon", "hexagon", "octagon"]));
    const s = randInt(4, 15);
    return typeIn(
      `A ${regularName(p)} has a perimeter of ${p.sides * s} cm. How long is each side?`,
      s,
      `A ${regularName(p)} has ${p.sides} equal sides. Share the perimeter equally: ${p.sides * s} ÷ ${p.sides}.`,
      { type: "shape", shape: p.shape },
      { suffix: "cm" },
    );
  }
  const sides = sideLengths(4, 20);
  const total = sides.reduce((s, x) => s + x, 0);
  return typeIn(
    `A quadrilateral has a perimeter of ${total} cm. Three of its sides are ${sides[0]} cm, ${sides[1]} cm and ${sides[2]} cm. How long is the fourth side?`,
    sides[3],
    `Add the three sides you know: ${sides[0]} + ${sides[1]} + ${sides[2]} = ${sides[0] + sides[1] + sides[2]}. Then take that away from ${total}.`,
    { type: "shape", shape: "trapezoid" },
    { suffix: "cm" },
  );
}

function polygons(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  if (d === 1) {
    return buildSet([
      nameBySides,
      notPolygon,
      () => regularOrNot(1),
      () => letterSymmetry(1),
      () => perimeterRegular(1),
      () => perimeterGrid(1),
      () => perimeterIrregular(1),
      () => whichRegular(1),
    ]);
  }
  if (d === 2) {
    return buildSet([
      () => whichRegular(2),
      () => regularOrNot(2),
      () => symmetryLines(2),
      () => letterSymmetry(2),
      () => perimeterRegular(2),
      () => perimeterRectangle(2),
      () => perimeterIrregular(2),
      () => perimeterGrid(2),
    ]);
  }
  return buildSet([
    () => whichRegular(3),
    () => regularOrNot(3),
    () => symmetryLines(3),
    () => letterSymmetry(3),
    () => perimeterRegular(3),
    () => perimeterIrregular(3),
    missingSide,
    () => perimeterRectangle(3),
  ]);
}

// ---------- Graphs & chance ----------

const SURVEYS = [
  {
    title: "Favourite fruit",
    items: [
      { label: "apples", emoji: "🍎" },
      { label: "bananas", emoji: "🍌" },
      { label: "grapes", emoji: "🍇" },
      { label: "oranges", emoji: "🍊" },
      { label: "strawberries", emoji: "🍓" },
    ],
  },
  {
    title: "Favourite sport",
    items: [
      { label: "soccer", emoji: "⚽" },
      { label: "hockey", emoji: "🏒" },
      { label: "basketball", emoji: "🏀" },
      { label: "swimming", emoji: "🏊" },
      { label: "skiing", emoji: "⛷️" },
    ],
  },
  {
    title: "Favourite season",
    items: [
      { label: "spring", emoji: "🌷" },
      { label: "summer", emoji: "☀️" },
      { label: "fall", emoji: "🍂" },
      { label: "winter", emoji: "❄️" },
    ],
  },
  {
    title: "Favourite pet",
    items: [
      { label: "dogs", emoji: "🐶" },
      { label: "cats", emoji: "🐱" },
      { label: "fish", emoji: "🐠" },
      { label: "rabbits", emoji: "🐰" },
      { label: "birds", emoji: "🐦" },
    ],
  },
];

interface DataRow {
  label: string;
  emoji: string;
  value: number;
}

/** Survey rows whose values are distinct multiples of `unit` from min to max. */
function surveyRows(count: number, unit: number, min: number, max: number): { title: string; rows: DataRow[] } {
  const s = pick(SURVEYS);
  const values = sample(range(Math.ceil(min / unit), Math.floor(max / unit)), count).map((v) => v * unit);
  return { title: s.title, rows: sample(s.items, count).map((it, i) => ({ ...it, value: values[i] })) };
}

const chose = (label: string) => `How many students chose ${label}?`;

function pictographCount(): Question {
  const g = surveyRows(randInt(3, 4), 1, 2, 9);
  const row = pick(g.rows);
  return numChoice(
    chose(row.label),
    row.value,
    [row.value + 1, row.value - 1, row.value + 2],
    `Find the ${row.emoji} row. Each picture stands for 1 student, so count the pictures.`,
    { type: "pictograph", title: g.title, rows: g.rows.map((r) => ({ label: r.label, emoji: r.emoji, count: r.value })) },
    { min: 1 },
  );
}

/** A pictograph where each picture stands for `key` votes, drawn as a table. */
function keyedPictograph(g: { title: string; rows: DataRow[] }, key: number): Visual {
  return {
    type: "table",
    title: `${g.title} (each picture = ${key} votes)`,
    headers: ["Choice", "Votes"],
    rows: g.rows.map((r) => [r.label, r.emoji.repeat(r.value / key)]),
  };
}

function pictographMany(d: Level): Question {
  const key = d === 1 ? 2 : d === 2 ? pick([5, 10]) : pick([4, 5, 10]);
  const g = surveyRows(3, key, key, key * 8);
  if (d === 3) {
    const [a, b] = [...g.rows].sort((x, y) => y.value - x.value);
    return typeIn(
      `How many more students chose ${a.label} than ${b.label}?`,
      a.value - b.value,
      `Each picture is ${key} votes. ${cap(a.label)} has ${a.value / key} pictures and ${b.label} has ${b.value / key}. Find each total, then subtract.`,
      keyedPictograph(g, key),
    );
  }
  const row = pick(g.rows);
  return typeIn(
    chose(row.label),
    row.value,
    `Each picture stands for ${key} votes. Count the ${row.emoji} pictures (${row.value / key}) and skip count by ${key}s.`,
    keyedPictograph(g, key),
  );
}

function symbolsNeeded(d: Level): Question {
  const key = d === 2 ? pick([2, 5, 10]) : pick([4, 5, 10, 25]);
  const n = randInt(3, 9);
  const item = pick(pick(SURVEYS).items);
  return typeIn(
    `In a pictograph, each ${item.emoji} stands for ${key} votes. How many ${item.emoji} show ${n * key} votes?`,
    n,
    `Skip count by ${key}s until you reach ${n * key}. Count how many jumps you made. Or divide: ${n * key} ÷ ${key}.`,
    { type: "emoji", emoji: item.emoji, caption: `= ${key} votes` },
  );
}

function barSettings(d: Level): { unit: number; min: number; max: number } {
  if (d === 1) return { unit: 1, min: 2, max: 10 };
  if (d === 2) return { unit: 5, min: 5, max: 50 };
  return { unit: 5, min: 10, max: 100 };
}

/** Bar graph rows whose values sit on (or halfway between) the drawn grid lines. */
function barRows(d: Level, count: number): { title: string; rows: DataRow[] } {
  const { unit, min, max } = barSettings(d);
  for (;;) {
    const g = surveyRows(count, unit, min, max);
    const top = Math.max(...g.rows.map((r) => r.value));
    if (d === 2 && top <= 20) continue;
    if (d === 3 && top <= 50) continue;
    return g;
  }
}

const barsVisual = (g: { title: string; rows: DataRow[] }): Visual => ({
  type: "bars",
  title: g.title,
  bars: g.rows.map((r) => ({ label: r.label, value: r.value, emoji: r.emoji })),
});

function barRead(d: Level): Question {
  const g = barRows(d, 4);
  const row = pick(g.rows);
  const { unit } = barSettings(d);
  return numChoice(
    chose(row.label),
    row.value,
    [row.value + unit, row.value - unit, row.value + 2 * unit],
    d === 3
      ? `Follow the top of the ${row.label} bar across to the scale. The lines go up by 10s, so a bar halfway between two lines is a 5.`
      : `Follow the top of the ${row.label} bar across to the numbers on the side. The scale counts by ${d === 1 ? "1s" : "5s"}.`,
    barsVisual(g),
    { step: unit, min: 1 },
  );
}

function barCompare(d: Level): Question {
  const g = barRows(d, 3);
  const [a, , c] = [...g.rows].sort((x, y) => y.value - x.value);
  return typeIn(
    `How many more students chose ${a.label} than ${c.label}?`,
    a.value - c.value,
    `Read both bars: ${a.label} and ${c.label}. Then subtract the smaller number from the bigger one.`,
    barsVisual(g),
  );
}

function barTotal(d: Level): Question {
  const g = barRows(d, d === 1 ? 3 : 4);
  return typeIn(
    "How many students voted in all?",
    g.rows.reduce((s, r) => s + r.value, 0),
    "Read each bar, then add all the numbers together.",
    barsVisual(g),
  );
}

function mostFewest(d: Level): Question {
  const g = barRows(d, 4);
  const fewest = chance(0.5);
  const sorted = [...g.rows].sort((x, y) => x.value - y.value);
  const target = fewest ? sorted[0] : sorted[sorted.length - 1];
  return textChoice(
    `Which got the ${fewest ? "fewest" : "most"} votes?`,
    { label: target.label, emoji: target.emoji },
    g.rows.filter((r) => r !== target).map((r) => ({ label: r.label, emoji: r.emoji })),
    fewest ? "Look for the shortest bar." : "Look for the tallest bar.",
    barsVisual(g),
  );
}

const SPIN_COLOURS = [
  { name: "red", hex: "#ef4444" },
  { name: "blue", hex: "#3b82f6" },
  { name: "green", hex: "#22c55e" },
  { name: "yellow", hex: "#facc15" },
];

function spinnerExpect(d: Level): Question {
  const [t, a, b, c] = shuffle(SPIN_COLOURS);
  let segments: string[];
  let ways: number;
  let N: number;
  if (d === 1) {
    segments = [t.hex, a.hex];
    ways = 1;
    N = pick([20, 40, 60, 100]);
  } else if (d === 2) {
    segments = [t.hex, a.hex, b.hex, c.hex];
    ways = 1;
    N = pick([20, 40, 80, 100]);
  } else if (chance(0.5)) {
    segments = [t.hex, a.hex, b.hex, t.hex, a.hex, b.hex];
    ways = 2;
    N = pick([30, 60, 90]);
  } else {
    segments = [t.hex, t.hex, t.hex, a.hex];
    ways = 3;
    N = pick([20, 40, 80]);
  }
  const parts = segments.length;
  const ans = (N * ways) / parts;
  const wrongs = [N, N / parts, N - ans, N / 2, N / 4, N / 5].filter((x) => Number.isInteger(x) && x !== ans);
  return numChoice(
    `${pick(NAMES)} spins this spinner ${N} times. About how many times should it land on ${t.name}?`,
    ans,
    wrongs,
    `${ways} out of ${parts} equal parts ${ways === 1 ? "is" : "are"} ${t.name}. So about ${ways} out of every ${parts} spins should land on ${t.name}. Split ${N} into ${parts} equal groups${ways > 1 ? ` and take ${ways} of them` : ""}.`,
    { type: "spinner", segments },
    { min: 1, count: 3, step: 5 },
  );
}

function experimentTable(d: Level): Question {
  const who = pick(NAMES);
  if (d === 1) {
    const flips = pick([20, 30, 40]);
    let heads: number;
    do heads = randInt(Math.round(flips * 0.3), Math.round(flips * 0.7));
    while (heads * 2 === flips);
    return typeIn(
      `${who} flipped a coin and recorded the results. How many times did ${who} flip the coin?`,
      flips,
      "Add the results for heads and tails together.",
      { type: "table", title: `${who}'s coin flips`, headers: ["Outcome", "Times"], rows: [["Heads", heads], ["Tails", flips - heads]] },
    );
  }
  if (d === 2) {
    const counts = range(1, 6).map(() => randInt(2, 8));
    const max = Math.max(...counts);
    if (counts.filter((c) => c === max).length > 1) counts[counts.indexOf(max)] += 1;
    const top = counts.indexOf(Math.max(...counts)) + 1;
    const visual: Visual = {
      type: "table",
      title: `${who} rolled a number cube ${counts.reduce((s, c) => s + c, 0)} times`,
      headers: ["Number", "Times rolled"],
      rows: counts.map((c, i) => [i + 1, c]),
    };
    if (chance(0.5)) {
      return textChoice(
        "Which number was rolled most often?",
        String(top),
        sample(range(1, 6).filter((n) => n !== top), 3).map(String),
        "Find the biggest number in the Times rolled column.",
        visual,
      );
    }
    const even = counts[1] + counts[3] + counts[5];
    return typeIn("How many times was an even number rolled?", even, "The even numbers on a number cube are 2, 4 and 6. Add their results.", visual);
  }
  const N = 40;
  const mode = randInt(0, 2);
  const red = mode === 0 ? randInt(27, 33) : mode === 1 ? randInt(7, 13) : randInt(18, 22);
  const options = ["3 red and 1 blue", "1 red and 3 blue", "2 red and 2 blue"];
  return textChoice(
    `${who} pulled a cube from a bag ${N} times, putting it back each time. Which bag was it most likely?`,
    options[mode],
    options.filter((_, i) => i !== mode),
    mode === 2
      ? "Red and blue came up about the same number of times, so the bag probably has the same number of each."
      : `${mode === 0 ? "Red" : "Blue"} came up about 3 out of every 4 times, so the bag probably has 3 ${mode === 0 ? "red" : "blue"} cubes for every 1 of the other colour.`,
    { type: "table", title: `${who}'s results`, headers: ["Colour", "Times"], rows: [["🔴 Red", red], ["🔵 Blue", N - red]] },
  );
}

const DIE_EVENTS = [
  { text: "rolling a 6", ways: 1 },
  { text: "rolling a 1 or a 2", ways: 2 },
  { text: "rolling an even number", ways: 3 },
  { text: "rolling a number greater than 2", ways: 4 },
  { text: "rolling a number greater than 1", ways: 5 },
  { text: "rolling a 5 or a 6", ways: 2 },
  { text: "rolling an odd number", ways: 3 },
  { text: "rolling a number less than 5", ways: 4 },
  { text: "rolling a 3", ways: 1 },
];

function likelyCompare(d: Level): Question {
  if (d === 3 && chance(0.5)) {
    const impossible = chance(0.5);
    return textChoice(
      `You roll a number cube numbered 1 to 6. Which is ${impossible ? "impossible" : "certain"}?`,
      impossible ? "rolling a 7" : "rolling a number from 1 to 6",
      sample(DIE_EVENTS, 2).map((e) => e.text),
      impossible
        ? "Impossible means it can never happen. A number cube only has 1 to 6, so a 7 can't come up."
        : "Certain means it will always happen. Every roll is a number from 1 to 6.",
      { type: "emoji", emoji: "🎲" },
    );
  }
  let events: typeof DIE_EVENTS;
  let gap: number;
  do {
    events = sample(DIE_EVENTS, 3);
    const ways = events.map((e) => e.ways).sort((a, b) => b - a);
    gap = ways[0] - ways[1];
  } while (gap < (d === 1 ? 2 : 1));
  const best = events.reduce((m, e) => (e.ways > m.ways ? e : m));
  return textChoice(
    "You roll a number cube numbered 1 to 6. Which is most likely?",
    best.text,
    events.filter((e) => e !== best).map((e) => e.text),
    `Count the ways each one can happen. ${cap(best.text)} can happen ${best.ways} ways out of 6, more than the others.`,
    { type: "emoji", emoji: "🎲" },
  );
}

function graphsChance(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  if (d === 1) {
    return buildSet([
      pictographCount,
      () => pictographMany(1),
      () => barRead(1),
      () => mostFewest(1),
      () => barTotal(1),
      () => spinnerExpect(1),
      () => experimentTable(1),
      () => likelyCompare(1),
    ]);
  }
  return buildSet([
    () => pictographMany(d),
    () => symbolsNeeded(d),
    () => barRead(d),
    () => barCompare(d),
    () => (d === 2 ? barTotal(2) : mostFewest(3)),
    () => spinnerExpect(d),
    () => experimentTable(d),
    () => likelyCompare(d),
  ]);
}

// ---------- Money & change ----------

const fm = formatMoney;

const SHOP_ITEMS = [
  { name: "book", emoji: "📕" },
  { name: "board game", emoji: "🎲" },
  { name: "T-shirt", emoji: "👕" },
  { name: "backpack", emoji: "🎒" },
  { name: "soccer ball", emoji: "⚽" },
  { name: "kite", emoji: "🪁" },
  { name: "puzzle", emoji: "🧩" },
  { name: "lunch box", emoji: "🍱" },
  { name: "paint set", emoji: "🎨" },
  { name: "pair of mittens", emoji: "🧤" },
];

/** A typed dollar amount, like 6.25. */
function moneyInput(prompt: string, cents: number, hint: string, visual?: Visual): InputQuestion {
  return typeIn(prompt, dec2(cents), hint, visual, {
    keypad: "decimal",
    accept: uniq([dec(cents)], [dec2(cents)]),
    suffix: "dollars",
  });
}

function countMoney(d: Level): Question {
  const pool = d === 1 ? [200, 100, 25, 10, 5] : d === 2 ? [1000, 500, 200, 100, 25, 10, 5] : [5000, 2000, 1000, 500, 200, 100, 25, 10, 5];
  const max = d === 1 ? 1000 : d === 2 ? 5000 : 10000;
  const least = d === 1 ? 150 : d === 2 ? 1000 : 2500;
  let pieces: number[];
  let total: number;
  do {
    const count = d === 1 ? randInt(3, 6) : d === 2 ? randInt(4, 7) : randInt(5, 8);
    pieces = [];
    total = 0;
    for (let i = 0; i < count; i++) {
      const options = pool.filter((c) => total + c <= max);
      if (!options.length) break;
      const c = pick(options);
      pieces.push(c);
      total += c;
    }
  } while (total < least || total % 100 === 0);
  pieces.sort((a, b) => b - a);
  let run = 0;
  const steps = pieces.map((c) => fm((run += c)));
  return numChoice(
    "How much money is this?",
    total,
    shuffle([total + 25, total - 10, total + 100, total - 5, total + 10]),
    `Start with the biggest and count on: ${steps.join(", ")}.`,
    { type: "coins", coins: pieces },
    { format: fm, step: 5, min: 5 },
  );
}

function makeAmount(d: Level): CoinsQuestion {
  let target: number;
  do target = d === 1 ? randInt(21, 199) * 5 : randInt(201, 999) * 5;
  while (target % 100 === 0);
  return {
    kind: "coins",
    prompt: `Make ${fm(target)} with bills and coins.`,
    hint: `Start with the biggest bill or coin that fits, then work down. ${fm(target)} is $${Math.floor(target / 100)} and ${target % 100}¢.`,
    target,
    coins: d === 1 ? [5, 10, 25, 100, 200, 500] : [5, 10, 25, 100, 200, 500, 1000, 2000],
  };
}

/** Count up from the price to the amount paid. */
function changeHint(price: number, paid: number): string {
  const jumps: number[] = [];
  const stops: number[] = [];
  let cur = price;
  for (const p of [100, 1000]) {
    const next = Math.ceil(cur / p) * p;
    if (next > cur && next < paid) {
      jumps.push(next - cur);
      stops.push(next);
      cur = next;
    }
  }
  jumps.push(paid - cur);
  stops.push(paid);
  if (jumps.length < 2) return `Subtract the price from what was paid: ${fm(paid)} − ${fm(price)}.`;
  return `Count up from ${fm(price)}: ${jumps.map((j, i) => `+ ${fm(j)} makes ${fm(stops[i])}`).join(", ")}. The change is ${jumps.map(fm).join(" + ")}.`;
}

function makeChangeQ(d: Level): Question {
  const item = pick(SHOP_ITEMS);
  const who = pick(NAMES);
  let paid: number;
  let price: number;
  if (d === 1) {
    paid = pick([1000, 2000]);
    price = randInt(2, paid / 100 - 1) * 100;
  } else if (d === 2) {
    paid = pick([1000, 2000]);
    do price = randInt(60, paid / 5 - 1) * 5;
    while (price % 100 === 0);
  } else {
    paid = pick([5000, 10000]);
    do price = randInt(paid / 20, paid / 5 - 20) * 5;
    while (price % 100 === 0);
  }
  return moneyInput(
    `${who} buys a ${item.name} for ${fm(price)} and pays with a ${fm(paid)} bill. How much change should ${who} get?`,
    paid - price,
    changeHint(price, paid),
    { type: "emoji", emoji: item.emoji, caption: fm(price) },
  );
}

function totalCostQ(d: Level): Question {
  const items = sample(SHOP_ITEMS, d === 3 ? 3 : 2);
  const prices = items.map(() => (d === 1 ? randInt(5, 39) * 25 : d === 2 ? randInt(21, 499) * 5 : randInt(101, 599) * 5));
  const dollars = prices.map((p) => Math.floor(p / 100));
  const cents = prices.map((p) => p % 100);
  const cTotal = cents.reduce((s, x) => s + x, 0);
  return moneyInput(
    `${pick(NAMES)} buys ${items.map((it) => `a ${it.name}`).join(items.length > 2 ? ", " : " and ").replace(/, (?=[^,]*$)/, " and ")}. What is the total cost?`,
    prices.reduce((s, x) => s + x, 0),
    `Add the dollars: ${dollars.join(" + ")} = ${dollars.reduce((s, x) => s + x, 0)}. Add the cents: ${cents.join(" + ")} = ${cTotal}¢${cTotal >= 100 ? `, which is ${fm(cTotal)}` : ""}. Then put them together.`,
    { type: "table", headers: ["Item", "Price"], rows: items.map((it, i) => [`${it.emoji} ${it.name}`, fm(prices[i])]) },
  );
}

function enoughMoney(d: Level): Question {
  const who = pick(NAMES);
  const [i1, i2] = sample(SHOP_ITEMS, 2);
  const p1 = d === 1 ? randInt(2, 15) * 100 : randInt(41, 399) * 5;
  const p2 = d === 1 ? randInt(2, 15) * 100 : d === 3 ? randInt(201, 899) * 5 : randInt(41, 399) * 5;
  const total = p1 + p2;
  const enough = chance(0.5);
  const have = enough
    ? Math.ceil((total + 1) / 100) * 100 + randInt(0, 2) * 100
    : Math.floor((total - 1) / 100) * 100 - randInt(0, 1) * 100;
  const diff = Math.abs(have - total);
  const yes = (c: number) => `Yes, with ${fm(c)} left over`;
  const no = (c: number) => `No, ${fm(c)} short`;
  return textChoice(
    `${who} has ${fm(have)}. Is that enough to buy a ${i1.name} for ${fm(p1)} and a ${i2.name} for ${fm(p2)}?`,
    enough ? yes(diff) : no(diff),
    enough ? [no(diff), yes(diff + 100)] : [yes(diff), no(diff + 100)],
    `Add the prices first: ${fm(p1)} + ${fm(p2)} = ${fm(total)}. Then compare with ${fm(have)} and find the difference.`,
  );
}

const DEALS = ["granola bars", "juice boxes", "notebooks", "markers", "pencils"];

function betterBuy(d: Level): Question {
  const thing = pick(DEALS);
  let packN: number;
  let single: number;
  let packEach: number;
  if (d === 3) {
    // Compare 2 for $X with 4 for $Y by doubling.
    const x = randInt(2, 6) * 100;
    const yOptions = [2 * x - 100, 2 * x, 2 * x + 100];
    const y = pick(yOptions);
    const twoDeal = `2 for ${fm(x)}`;
    const fourDeal = `4 for ${fm(y)}`;
    const same = "They cost the same";
    const right = y < 2 * x ? fourDeal : y > 2 * x ? twoDeal : same;
    return textChoice(
      `Which is the better buy for ${thing}?`,
      right,
      [twoDeal, fourDeal, same].filter((c) => c !== right),
      `Make the amounts match: 2 for ${fm(x)} is the same as 4 for ${fm(2 * x)}. Compare that with 4 for ${fm(y)}.`,
      { type: "emoji", emoji: "🛒" },
    );
  }
  if (d === 1) {
    packN = randInt(2, 6);
    packEach = randInt(1, 4) * 100;
    single = packEach + pick([-100, 100, 200].filter((x) => packEach + x > 0));
  } else {
    packN = randInt(3, 5);
    packEach = randInt(8, 19) * 5;
    single = packEach + pick([-15, -10, 10, 15, 20]);
  }
  const packPrice = packN * packEach;
  const packLabel = `${packN} for ${fm(packPrice)}`;
  const singleLabel = `1 for ${fm(single)}`;
  return textChoice(
    `Which is the better buy for ${thing}?`,
    packEach < single ? packLabel : singleLabel,
    [packEach < single ? singleLabel : packLabel, "They cost the same"],
    `Find the price of one in each deal. ${fm(packPrice)} ÷ ${packN} = ${fm(packEach)} each, and the other deal is ${fm(single)} each. The lower price for one is the better buy.`,
    { type: "emoji", emoji: "🛒" },
  );
}

function savingGoal(d: Level): Question {
  const who = pick(NAMES);
  const item = pick(SHOP_ITEMS);
  if (d === 1) {
    const s = randInt(2, 10);
    const w = randInt(3, 10);
    return typeIn(
      `${who} saves $${s} each week. How many weeks will it take to save $${s * w} for a ${item.name}?`,
      w,
      `Count by ${s}s until you reach ${s * w}, or divide: ${s * w} ÷ ${s}.`,
      { type: "emoji", emoji: "🐷" },
      { suffix: "weeks" },
    );
  }
  if (d === 2) {
    const start = randInt(2, 6) * 5;
    const s = randInt(3, 9);
    const w = randInt(3, 9);
    return typeIn(
      `${who} has $${start} saved and saves $${s} more each week. How many weeks until ${who} has $${start + s * w} for a ${item.name}?`,
      w,
      `First find how much more ${who} needs: $${start + s * w} − $${start}. Then divide by $${s} a week.`,
      { type: "emoji", emoji: "🐷" },
      { suffix: "weeks" },
    );
  }
  const a = randInt(8, 15);
  const spend = randInt(2, a - 4);
  const r = a - spend;
  const w = randInt(3, 9);
  return typeIn(
    `${who} gets $${a} a week, spends $${spend} on snacks and saves the rest. How many weeks to save $${r * w} for a ${item.name}?`,
    w,
    `${who} saves $${a} − $${spend} each week. Divide $${r * w} by that amount.`,
    { type: "emoji", emoji: "🐷" },
    { suffix: "weeks" },
  );
}

function spendSaveShare(d: Level): Question {
  const who = pick(NAMES);
  if (d === 1) {
    const e = randInt(4, 10) * 5;
    const s = randInt(1, e / 5 - 1) * 5;
    return typeIn(
      `${who} has $${e} and puts $${s} into savings. How many dollars are left to spend?`,
      e - s,
      `Take the savings away from the total: $${e} − $${s}.`,
      { type: "emoji", emoji: "🐷" },
    );
  }
  if (d === 2) {
    const e = randInt(5, 20) * 2;
    const g = randInt(1, e / 2 - 1);
    return typeIn(
      `${who} earns $${e}. ${who} saves half, gives $${g} to a food bank, and spends the rest. How many dollars does ${who} spend?`,
      e / 2 - g,
      `Half of $${e} is saved, so $${e / 2} is left. Then take away the $${g} that was shared.`,
      { type: "emoji", emoji: "💰" },
    );
  }
  const e = randInt(5, 20) * 4;
  const g = randInt(1, e / 4);
  return typeIn(
    `${who} earns $${e}. ${who} saves 1/4 of it, gives $${g} to a food bank, and spends the rest. How many dollars does ${who} spend?`,
    e - e / 4 - g,
    `1/4 of $${e} is $${e} ÷ 4 = $${e / 4}. Take away the savings and the $${g} that was shared from $${e}.`,
    { type: "emoji", emoji: "💰" },
  );
}

function money(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  if (d === 3) {
    return buildSet([
      () => countMoney(3),
      () => makeChangeQ(3),
      () => makeChangeQ(3),
      () => totalCostQ(3),
      () => betterBuy(3),
      () => enoughMoney(3),
      () => savingGoal(3),
      () => spendSaveShare(3),
    ]);
  }
  return buildSet([
    () => countMoney(d),
    () => makeAmount(d),
    () => makeChangeQ(d),
    () => totalCostQ(d),
    () => betterBuy(d),
    () => enoughMoney(d),
    () => savingGoal(d),
    () => spendSaveShare(d),
  ]);
}

// ---------- Course ----------

export const course: Course = {
  grade: "4",
  subject: "math",
  bigIdeas: {
    "ca-bc": [
      "Fractions and decimals are types of numbers that can represent quantities.",
      "Development of computational fluency and multiplicative thinking requires analysis of patterns and relations in multiplication and division.",
      "Regular changes in patterns can be identified and represented using tools and tables.",
      "Polygons are closed shapes with similar attributes that can be described, measured, and compared.",
      "Analyzing and interpreting experiments in data probability develops an understanding of chance.",
    ],
  },
  units: [
    {
      id: "numbers-to-10000",
      title: "Numbers to 10 000",
      emoji: "🔢",
      blurb: "Place value, compare and round",
      standards: { "ca-bc": "Number concepts to 10 000" },
      parentNote:
        "Reading, writing and comparing numbers up to 10 000: place value, expanded form, number lines, ordering and rounding.",
      generate: numbersTo10000,
    },
    {
      id: "add-subtract",
      title: "Add & Subtract",
      emoji: "➕",
      blurb: "Big numbers, up to 10 000",
      standards: { "ca-bc": "Addition and subtraction to 10 000" },
      parentNote:
        "Adding and subtracting numbers to 10 000 with regrouping, counting up to subtract, estimating by rounding, and solving word problems.",
      generate: addSubtract,
    },
    {
      id: "times-tables",
      title: "Times Tables",
      emoji: "✖️",
      blurb: "Multiply and divide facts",
      standards: { "ca-bc": "Multiplication and division facts to 100 (introductory computational strategies)" },
      parentNote:
        "Multiplication and division facts to 100 with arrays, fact families and strategies like doubling, using 10s, and thinking multiplication to divide.",
      generate: timesFacts,
    },
    {
      id: "multiply-divide",
      title: "Multiply & Divide",
      emoji: "🧮",
      blurb: "Bigger numbers by one digit",
      standards: { "ca-bc": "Multiplication and division of two- or three-digit numbers by one-digit numbers" },
      parentNote:
        "Multiplying and dividing 2- and 3-digit numbers by 1-digit numbers by splitting them by place value, plus remainders, estimating and word problems.",
      generate: multiplyDivide,
    },
    {
      id: "fractions",
      title: "Fractions",
      emoji: "🍕",
      blurb: "Compare and order fractions",
      standards: { "ca-bc": "Ordering and comparing fractions" },
      parentNote:
        "Naming fractions from pictures and number lines, comparing fractions with the same top or bottom number, using 1/2 as a benchmark, and finding equal fractions.",
      generate: fractions,
    },
    {
      id: "decimals",
      title: "Decimals",
      emoji: "🔟",
      blurb: "Tenths, hundredths, add and subtract",
      standards: { "ca-bc": "Decimals to hundredths; addition and subtraction of decimals to hundredths" },
      parentNote:
        "Tenths and hundredths as decimals, linking them to fractions, placing and comparing them on number lines, and adding and subtracting decimals by lining up the decimal points.",
      generate: decimals,
    },
    {
      id: "patterns-and-tables",
      title: "Patterns & Tables",
      emoji: "📈",
      blurb: "Growing and shrinking patterns",
      standards: {
        "ca-bc": "Increasing and decreasing patterns, using tables and charts; algebraic relationships among quantities",
      },
      parentNote:
        "Extending increasing and decreasing number patterns, naming pattern rules, finding rules in input/output tables, and describing how two quantities are related.",
      generate: patterns,
    },
    {
      id: "equations",
      title: "Equations",
      emoji: "⚖️",
      blurb: "Find the mystery number",
      standards: { "ca-bc": "One-step equations with an unknown number, using all operations" },
      parentNote:
        "Solving one-step equations with a box or letter for the unknown, using all four operations, and matching equations to word problems.",
      generate: equations,
    },
    {
      id: "telling-time",
      title: "Telling Time",
      emoji: "🕒",
      blurb: "Analog, digital and 24-hour clocks",
      standards: { "ca-bc": "How to tell time with analog and digital clocks, using 12- and 24-hour clocks" },
      parentNote:
        "Reading analog clocks to the minute, switching between 12-hour (a.m./p.m.) and 24-hour time, and working out how long events last.",
      generate: tellingTime,
    },
    {
      id: "polygons-and-perimeter",
      title: "Polygons & Perimeter",
      emoji: "🔷",
      blurb: "Sides, symmetry and perimeter",
      standards: {
        "ca-bc": "Regular and irregular polygons; line symmetry; perimeter of regular and irregular shapes",
      },
      parentNote:
        "Telling regular polygons (all sides and angles equal) from irregular ones, finding lines of symmetry, and measuring perimeter around regular and irregular shapes.",
      generate: polygons,
    },
    {
      id: "graphs-and-chance",
      title: "Graphs & Chance",
      emoji: "📊",
      blurb: "Read graphs, run experiments",
      standards: {
        "ca-bc":
          "One-to-one correspondence and many-to-one correspondence, using bar graphs and pictographs; probability experiments",
      },
      parentNote:
        "Reading bar graphs and pictographs where one picture can stand for many, and predicting and interpreting the results of spinner, dice and coin experiments.",
      generate: graphsChance,
    },
    {
      id: "money-and-change",
      title: "Money & Change",
      emoji: "💵",
      blurb: "Make change, make smart choices",
      standards: {
        "ca-bc":
          "Financial literacy: monetary calculations, including making change with amounts to 100 dollars and making simple financial decisions",
      },
      parentNote:
        "Counting bills and coins, making change from up to $100, adding prices, and simple money decisions like comparing deals, budgeting and saving.",
      generate: money,
    },
  ],
};
