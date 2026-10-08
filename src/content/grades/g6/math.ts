import { chance, pick, randInt, sample, shuffle, textChoice } from "../../random";
import type {
  ChoiceQuestion,
  Course,
  GenerateOptions,
  InputQuestion,
  Question,
  ShapeName,
  Visual,
} from "../../types";

// ---------- Shared helpers ----------

type Level = 1 | 2 | 3;
const level = (opts?: GenerateOptions): Level => opts?.difficulty ?? 2;

const NAMES = ["Maya", "Jay", "Sam", "Amir", "Lena", "Kenji", "Zoe", "Ravi", "Ana", "Noah", "Priya", "Leo"];

/** Clean up float noise: 20.399999999 → 20.4. */
const tidy = (n: number): number => Number(n.toFixed(6));
const str = (n: number): string => String(tidy(n));

/** 4500000 → "4 500 000" (SI spacing); numbers under 10 000 stay as they are. */
function group(n: number): string {
  const s = str(n);
  if (Math.abs(n) < 10000) return s;
  const [whole, frac] = s.split(".");
  const spaced = whole.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return frac ? `${spaced}.${frac}` : spaced;
}

/** Cents → "$4.20", or "$45" for whole dollars. */
function cash(cents: number): string {
  const c = Math.round(cents);
  return c % 100 === 0 ? `$${c / 100}` : `$${(c / 100).toFixed(2)}`;
}

/** Cents → a keypad answer: "4.20" or "45". */
function cashAnswer(cents: number): string {
  const c = Math.round(cents);
  return c % 100 === 0 ? String(c / 100) : (c / 100).toFixed(2);
}

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
const lcm = (a: number, b: number): number => (a / gcd(a, b)) * b;
const range = (lo: number, hi: number): number[] => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
const factorsOf = (n: number): number[] => range(1, n).filter((f) => n % f === 0);
const plural = (n: number, word: string): string => `${n} ${word}${n === 1 ? "" : "s"}`;
const cap = (s: string): string => s[0].toUpperCase() + s.slice(1);

/** "6/8" plus its simplest form "3/4", for `accept`. */
function fracForms(n: number, d: number): string[] {
  const g = gcd(n, d);
  return [...new Set([`${n}/${d}`, `${n / g}/${d / g}`])];
}

const mixed = (w: number, n: number, d: number): string =>
  n === 0 ? String(w) : w === 0 ? `${n}/${d}` : `${w} ${n}/${d}`;

/** A random whole number in [lo, hi] that doesn't end in 0. */
function nonTen(lo: number, hi: number): number {
  let x: number;
  do x = randInt(lo, hi);
  while (x % 10 === 0);
  return x;
}

/** Multiple choice from labels; repeats and copies of the answer are dropped. */
function choose(prompt: string, right: string, wrong: string[], hint: string, visual?: Visual, maxWrong = 4): ChoiceQuestion {
  const seen = new Set([right]);
  const picked: string[] = [];
  for (const w of wrong) {
    if (picked.length >= maxWrong) break;
    if (seen.has(w)) continue;
    seen.add(w);
    picked.push(w);
  }
  return textChoice(prompt, right, picked, hint, visual);
}

/** Multiple choice with numeric answers. Plausible `wrong` values go first; small offsets fill any gaps. */
function numChoice(
  prompt: string,
  answer: number,
  wrong: number[],
  hint: string,
  visual?: Visual,
  fmt: (n: number) => string = group,
  maxWrong = 3,
): ChoiceQuestion {
  const backups = shuffle([1, -1, 2, -2, 3, -3, 5, -5, 10, -10]).map((d) => answer + d);
  const labels = [...wrong, ...backups].filter((n) => Number.isFinite(n) && n > 0).map((n) => fmt(tidy(n)));
  return choose(prompt, fmt(tidy(answer)), labels, hint, visual, maxWrong);
}

type Keypad = NonNullable<InputQuestion["keypad"]>;

/** A keypad question. Number answers are tidied; the keypad is picked from the answer unless given. */
function ask(
  prompt: string,
  answer: number | string,
  hint: string,
  o: { keypad?: Keypad; accept?: string[]; suffix?: string; visual?: Visual } = {},
): InputQuestion {
  const a = typeof answer === "number" ? str(answer) : answer;
  const keypad: Keypad = o.keypad ?? (a.includes("/") ? "fraction" : /^\d+$/.test(a) ? "number" : "decimal");
  const q: InputQuestion = { kind: "input", prompt, hint, answer: a, keypad };
  const accept = (o.accept ?? []).filter((x) => x !== a);
  if (accept.length) q.accept = accept;
  if (o.suffix) q.suffix = o.suffix;
  if (o.visual) q.visual = o.visual;
  return q;
}

// ---------- 1. Thousandths to Billions ----------

const PLACES = [
  "ones",
  "tens",
  "hundreds",
  "thousands",
  "ten thousands",
  "hundred thousands",
  "millions",
  "ten millions",
  "hundred millions",
  "billions",
];
const DECIMAL_PLACES = ["tenths", "hundredths", "thousandths"];

const ONES = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen",
];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function wordsUnder1000(n: number): string {
  const parts: string[] = [];
  const h = Math.floor(n / 100);
  const r = n % 100;
  if (h) parts.push(`${ONES[h]} hundred`);
  if (r) parts.push(r < 20 ? ONES[r] : `${TENS[Math.floor(r / 10)]}${r % 10 ? `-${ONES[r % 10]}` : ""}`);
  return parts.join(" ");
}

/** 3040000000 → "three billion forty million". */
function words(n: number): string {
  if (n === 0) return "zero";
  const parts: string[] = [];
  let rest = n;
  const scales: [number, string][] = [
    [1e9, "billion"],
    [1e6, "million"],
    [1e3, "thousand"],
    [1, ""],
  ];
  for (const [size, name] of scales) {
    const count = Math.floor(rest / size);
    rest -= count * size;
    if (count) parts.push(name ? `${wordsUnder1000(count)} ${name}` : wordsUnder1000(count));
  }
  return parts.join(" ");
}

function digitValueQ(d: Level): Question {
  const len = d === 1 ? 7 : d === 2 ? randInt(8, 9) : 10;
  const p = randInt(3, len - 1);
  const t = randInt(2, 9);
  const others = range(0, 9).filter((x) => x !== t);
  const digits = range(0, len - 1).map((i) => {
    if (len - 1 - i === p) return t;
    return i === 0 ? pick(others.filter((x) => x > 0)) : pick(others);
  });
  const n = Number(digits.join(""));
  const wrong = shuffle([p - 1, p + 1, p - 2, p + 2].filter((k) => k >= 0 && k <= 10)).map((k) => group(t * 10 ** k));
  return choose(
    `In ${group(n)}, what is the value of the digit ${t}?`,
    group(t * 10 ** p),
    wrong,
    `Find the ${t} and name its place. It's in the ${PLACES[p]} place, so it is worth ${t} × ${group(10 ** p)}.`,
    undefined,
    3,
  );
}

function decimalDigitQ(d: Level): Question {
  const dp = d === 1 ? 2 : 3;
  const ds = sample(range(1, 9), dp);
  const whole = pick(range(0, 9).filter((x) => !ds.includes(x)));
  const k = randInt(1, dp);
  const t = ds[k - 1];
  const right = str(t / 10 ** k);
  const wrong = shuffle([0, 1, 2, 3].filter((j) => j !== k).map((j) => str(t / 10 ** j)).concat(String(t * 10)));
  return choose(
    `What is the value of the ${t} in ${whole}.${ds.join("")}?`,
    right,
    wrong,
    `After the decimal point the places are tenths, hundredths, then thousandths. The ${t} is in the ${DECIMAL_PLACES[k - 1]} place.`,
    undefined,
    3,
  );
}

function standardFormQ(d: Level): Question {
  const millions = d === 1 ? 0 : d === 2 ? randInt(1, 9) : randInt(10, 999);
  const thousands = d === 1 ? randInt(100, 999) : chance(0.25) ? 0 : randInt(1, 999);
  const ones = chance(0.35) ? randInt(1, 99) : randInt(100, 999);
  const n = millions * 1e6 + thousands * 1e3 + ones;
  const pad = (x: number) => String(x).padStart(3, "0");
  const periods = millions
    ? `millions ${millions}, thousands ${pad(thousands)}, ones ${pad(ones)}`
    : `thousands ${thousands}, ones ${pad(ones)}`;
  return ask(
    `Write in standard form: ${words(n)}.`,
    n,
    `Work one period (group of three digits) at a time, using zeros as placeholders: ${periods}.`,
  );
}

function compareDecimalsQ(d: Level): Question {
  const whole = randInt(0, 9);
  const t = randInt(2, 7);
  const values = new Set<number>(); // thousandths after the whole number
  while (values.size < 4) {
    const places = pick(d === 1 ? [1, 2] : [1, 2, 3]);
    const tenths = pick([t - 1, t, t + 1, 0]);
    const hundredths = places >= 2 ? randInt(places === 2 ? 1 : 0, 9) : 0;
    const thousandths = places === 3 ? randInt(1, 9) : 0;
    const v = tenths * 100 + hundredths * 10 + thousandths;
    if (v > 0) values.add(v);
  }
  const nums = [...values].map((v) => tidy(whole + v / 1000));
  const greatest = chance(0.5);
  const target = greatest ? Math.max(...nums) : Math.min(...nums);
  return choose(
    `Which number is the ${greatest ? "greatest" : "least"}?`,
    str(target),
    nums.filter((n) => n !== target).map(str),
    "Line up the decimal points. Compare the tenths first, then the hundredths, then the thousandths. Adding zeros on the end (0.4 = 0.400) can help.",
  );
}

function decimalLineQ(d: Level): Question {
  const f = 10 ** d; // steps of 0.1, 0.01 or 0.001
  const start = (d === 1 ? randInt(0, 9) : d === 2 ? randInt(10, 98) : randInt(100, 998)) * 10;
  const k = randInt(1, 9);
  const min = start / f;
  const max = (start + 10) / f;
  const at = (start + k) / f;
  return ask(
    "What decimal belongs at the ? on the number line?",
    at,
    `The line from ${str(min)} to ${str(max)} is split into 10 equal steps, so each step is ${str(1 / f)}. Count the steps from ${str(min)} to the ?.`,
    { keypad: "decimal", visual: { type: "numberLine", min, max, step: 1 / f, labelEvery: 10 / f, blankAt: at } },
  );
}

function roundingQ(d: Level): Question {
  if (d === 3) {
    const n = randInt(10_000_000, 899_999_999);
    const p = pick([5, 6]);
    const placeName = p === 5 ? "hundred thousand" : "million";
    return ask(
      `Round ${group(n)} to the nearest ${placeName}.`,
      Math.round(n / 10 ** p) * 10 ** p,
      `Find the ${PLACES[p]} digit, then look at the digit just to its right. 5 or more rounds up; 4 or less rounds down. Every place after it becomes 0.`,
    );
  }
  const X = d === 1 ? nonTen(101, 999) : nonTen(1001, 9999);
  const x = X / (d === 1 ? 100 : 1000);
  const ans = d === 1 ? Math.round(X / 10) / 10 : Math.round(X / 10) / 100;
  const place = d === 1 ? "tenth" : "hundredth";
  return ask(
    `Round ${str(x)} to the nearest ${place}.`,
    ans,
    `Look at the digit just to the right of the ${place}s place. 5 or more rounds up; 4 or less rounds down.`,
    { keypad: "decimal" },
  );
}

function wordFormQ(d: Level): Question {
  const topScale = d === 1 ? 1e6 : 1e9;
  const top = d === 1 ? randInt(2, 99) : d === 2 ? randInt(1, 9) : randInt(10, 99);
  const second = pick([randInt(1, 9) * 10, randInt(1, 9) * 100 + randInt(1, 9), randInt(11, 99), randInt(1, 9) * 100]);
  const sub = topScale / 1000;
  const n = top * topScale + second * sub;
  const wrong = [
    words(n / 1000),
    second * 10 < 1000
      ? words(top * topScale + second * 10 * sub)
      : words(top * topScale + Math.floor(second / 10) * sub),
    top * 10 < 1000 ? words(top * 10 * topScale + second * sub) : words(Math.floor(top / 10) * topScale + second * sub),
    n * 1000 < 1e12 ? words(n * 1000) : words(top * topScale + (second * sub) / 1000),
  ];
  return choose(
    `Which words name the number ${group(n)}?`,
    words(n),
    shuffle(wrong),
    "Split the digits into periods of three, starting from the right. Read each period, then say its name: billion, million, thousand.",
    undefined,
    3,
  );
}

function tenthsOrPowersQ(d: Level): Question {
  if (chance(0.5)) {
    const denom = d === 1 ? pick([10, 100]) : d === 2 ? pick([100, 1000]) : 1000;
    let k: number;
    do k = denom === 1000 && chance(0.6) ? randInt(1, 99) : randInt(1, denom - 1);
    while (k % 10 === 0);
    const places = denom === 10 ? 1 : denom === 100 ? 2 : 3;
    return ask(
      `Write ${k}/${denom} as a decimal.`,
      k / denom,
      `${cap(DECIMAL_PLACES[places - 1])} need ${places} digit${places > 1 ? "s" : ""} after the decimal point. Write ${k} so its last digit is in the ${DECIMAL_PLACES[places - 1]} place, using zeros as placeholders.`,
      { keypad: "decimal", visual: { type: "equation", text: `${k}/${denom} = ☐` } },
    );
  }
  const options: { op: "×" | "÷"; s: number; k: number }[] =
    d === 1
      ? [{ op: "×", s: 1, k: 1 }, { op: "×", s: 1, k: 2 }]
      : d === 2
        ? [{ op: "×", s: 2, k: 3 }, { op: "÷", s: 1, k: 2 }, { op: "×", s: 2, k: 2 }]
        : [{ op: "÷", s: 0, k: 3 }, { op: "÷", s: 1, k: 2 }, { op: "×", s: 3, k: 2 }];
  const { op, s, k } = pick(options);
  const X = s === 0 ? nonTen(101, 9999) : s === 1 ? nonTen(11, 999) : s === 2 ? nonTen(101, 999) : nonTen(1001, 9999);
  const x = X / 10 ** s;
  const ans = op === "×" ? X * 10 ** (k - s) : X / 10 ** (s + k);
  return ask(
    `What is ${str(x)} ${op} ${10 ** k}?`,
    ans,
    `${op === "×" ? "Multiplying" : "Dividing"} by ${10 ** k} moves every digit ${plural(k, "place")} to the ${op === "×" ? "left, so the number gets bigger" : "right, so the number gets smaller"}.`,
    { keypad: "decimal", visual: { type: "equation", text: `${str(x)} ${op} ${10 ** k} = ?` } },
  );
}

function placeValue(opts?: GenerateOptions): Question[] {
  const d = level(opts);
  return shuffle([
    digitValueQ(d),
    decimalDigitQ(d),
    standardFormQ(d),
    compareDecimalsQ(d),
    decimalLineQ(d),
    roundingQ(d),
    wordFormQ(d),
    tenthsOrPowersQ(d),
  ]);
}

// ---------- 2. Facts & Factors ----------

function factHint(a: number, b: number): string {
  const [small, big] = a < b ? [a, b] : [b, a];
  if (big === 10) return `Multiplying by 10: ${small} tens.`;
  if (big === 9) return `Use tens: ${small} × 10 = ${small * 10}, then take away one ${small}.`;
  if (big === 5) return `${small} × 5 is half of ${small} × 10.`;
  if (big > 5) {
    return `Split ${big} into 5 + ${big - 5}: ${small} × 5 = ${small * 5} and ${small} × ${big - 5} = ${small * (big - 5)}. Add them.`;
  }
  if (big === 4) return `Times 4 is double, then double again: ${small} × 2 = ${small * 2}, then double that.`;
  if (big === 3) return `Times 3 is double plus one more group: ${small} × 2 = ${small * 2}, then add ${small}.`;
  return `Times 2 is doubling: ${small} + ${small}.`;
}

function factsFactors(opts?: GenerateOptions): Question[] {
  const d = level(opts);
  const lo = d === 1 ? 2 : d === 2 ? 3 : 6;
  const hi = d === 1 ? 7 : d === 2 ? 9 : 10;
  const out: Question[] = [];

  {
    const a = randInt(lo, hi);
    const b = randInt(Math.max(3, lo), hi);
    out.push(ask(`What is ${a} × ${b}?`, a * b, factHint(a, b), { visual: { type: "equation", text: `${a} × ${b} = ?` } }));
  }

  {
    const a = randInt(lo, hi);
    const b = randInt(lo, hi);
    out.push(
      ask(`What is ${a * b} ÷ ${a}?`, b, `Think multiplication: ${a} × ? = ${a * b}. Which fact do you know?`, {
        visual: { type: "equation", text: `${a * b} ÷ ${a} = ?` },
      }),
    );
  }

  {
    const a = randInt(lo, hi);
    const b = randInt(lo, hi);
    out.push(
      numChoice(
        "What number goes in the box?",
        b,
        shuffle([b + 1, b - 1, b + 2, b - 2]),
        `Divide to find a missing factor: ${a * b} ÷ ${a}.`,
        { type: "equation", text: `${a} × ☐ = ${a * b}` },
      ),
    );
  }

  if (chance(0.5)) {
    const N = pick(d === 1 ? [12, 18, 20, 24, 30] : d === 2 ? [36, 42, 48, 54, 60, 72] : [66, 72, 78, 84, 90, 96]);
    const f = pick(factorsOf(N).filter((x) => x > 1 && x < N));
    const non = range(2, Math.min(N - 1, 15)).filter((x) => N % x !== 0);
    out.push(
      choose(
        `Which number is a factor of ${N}?`,
        String(f),
        sample(non, 3).map(String),
        `A factor divides ${N} with no remainder. Try dividing ${N} by each choice. For example, ${N} ÷ ${f} = ${N / f} exactly.`,
      ),
    );
  } else {
    const k = randInt(d === 1 ? 3 : 6, d === 3 ? 15 : 9);
    const m = k * randInt(d === 1 ? 3 : 5, d === 3 ? 12 : 9);
    const near = [m + 1, m - 1, m + 2, m - 2, m + 3, m - 3, m + 4].filter((x) => x % k !== 0);
    out.push(
      numChoice(
        `Which number is a multiple of ${k}?`,
        m,
        shuffle(near),
        `A multiple of ${k} is in the ${k} times table: ${k} × 1, ${k} × 2, ${k} × 3, and so on. Check which choice divides by ${k} with nothing left over.`,
      ),
    );
  }

  {
    const primes = d === 1 ? [5, 7, 11, 13, 17, 19, 23, 29] : d === 2 ? [23, 29, 31, 37, 41, 43, 47, 53] : [59, 61, 67, 71, 73, 79, 83, 89, 97];
    const fakes = d === 1 ? [9, 15, 21, 25, 27, 33] : d === 2 ? [21, 27, 33, 39, 49, 51, 57] : [51, 57, 69, 77, 87, 91, 93];
    const p = pick(primes);
    const comps = sample(fakes, 3);
    const shown = comps[0];
    const f = factorsOf(shown)[1];
    out.push(
      choose(
        "Which of these numbers is prime?",
        String(p),
        comps.map(String),
        `A prime number has exactly two factors: 1 and itself. Test each number by dividing by 2, 3, 5 and 7. For example, ${shown} = ${f} × ${shown / f}, so ${shown} is not prime.`,
      ),
    );
  }

  {
    let a = 0;
    let b = 0;
    let g = 0;
    const limit = d === 1 ? 30 : d === 2 ? 60 : 100;
    for (;;) {
      g = d === 1 ? randInt(2, 6) : d === 2 ? randInt(2, 12) : randInt(4, 16);
      const [m, n] = sample(d === 1 ? [1, 2, 3, 4, 5] : d === 2 ? [2, 3, 4, 5, 7] : [2, 3, 4, 5, 6, 7, 8, 9], 2);
      a = g * m;
      b = g * n;
      if (gcd(m, n) === 1 && Math.max(a, b) <= limit) break;
    }
    out.push(
      ask(
        `What is the greatest common factor (GCF) of ${a} and ${b}?`,
        g,
        "List the factors of each number. The GCF is the biggest number that appears in both lists.",
        d === 1
          ? {
              visual: {
                type: "table",
                headers: ["Number", "Factors"],
                rows: [
                  [a, factorsOf(a).join(", ")],
                  [b, factorsOf(b).join(", ")],
                ],
              },
            }
          : {},
      ),
    );
  }

  {
    let a = 0;
    let b = 0;
    const [min, max, limit] = d === 1 ? [2, 8, 40] : d === 2 ? [3, 12, 72] : [4, 15, 120];
    for (;;) {
      a = randInt(min, max);
      b = randInt(min, max);
      const l = lcm(a, b);
      if (a !== b && l <= limit && l !== Math.max(a, b)) break;
    }
    const [small, big] = a < b ? [a, b] : [b, a];
    out.push(
      ask(
        `What is the least common multiple (LCM) of ${a} and ${b}?`,
        lcm(a, b),
        `List multiples of the bigger number: ${big}, ${big * 2}, ${big * 3}… Stop at the first one that ${small} also divides into evenly.`,
      ),
    );
  }

  if (chance(0.5)) {
    let a = 0;
    let b = 0;
    let g = 0;
    for (;;) {
      g = randInt(d === 1 ? 2 : 4, d === 3 ? 12 : 8);
      const [m, n] = sample([2, 3, 4, 5, 7], 2);
      a = g * m;
      b = g * n;
      if (gcd(m, n) === 1) break;
    }
    const name = pick(NAMES);
    const [x, y] = pick([
      ["granola bars", "juice boxes"],
      ["red beads", "blue beads"],
      ["pencils", "erasers"],
      ["apples", "oranges"],
      ["hockey cards", "stickers"],
    ]);
    const smallerCommon = factorsOf(g).filter((f) => f > 1 && f < g);
    out.push(
      numChoice(
        `${name} has ${a} ${x} and ${b} ${y}. ${name} wants to pack them into identical bags with nothing left over. What is the greatest number of bags ${name} can make?`,
        g,
        shuffle([...sample(smallerCommon, 1), a / g, b / g, Math.min(a, b)]),
        `Identical bags with nothing left over means the number of bags must divide both ${a} and ${b}. Find the greatest common factor.`,
      ),
    );
  } else {
    let a = 0;
    let b = 0;
    for (;;) {
      a = randInt(d === 1 ? 2 : 4, d === 3 ? 15 : 10);
      b = randInt(d === 1 ? 2 : 4, d === 3 ? 15 : 10);
      if (a !== b && lcm(a, b) !== Math.max(a, b) && lcm(a, b) <= 90) break;
    }
    const l = lcm(a, b);
    const ctx = pick([
      `Buns come in packs of ${a} and veggie dogs come in packs of ${b}. What is the fewest buns you can buy to have exactly the same number of buns and veggie dogs?`,
      `One bus leaves the station every ${a} minutes and another leaves every ${b} minutes. They just left together. In how many minutes will they next leave together?`,
      `Two lights blink together. One blinks every ${a} seconds and the other every ${b} seconds. After how many seconds will they next blink at the same time?`,
    ]);
    out.push(
      numChoice(
        ctx,
        l,
        shuffle([a * b === l ? 2 * l : a * b, a + b, Math.max(a, b), 2 * l]),
        `You need a number that is a multiple of both ${a} and ${b}. Find the least common multiple.`,
      ),
    );
  }

  return shuffle(out);
}

// ---------- 3. Mixed Numbers & Ratios ----------

const RATIO_PAIRS = [
  [{ emoji: "🍎", name: "apples" }, { emoji: "🍌", name: "bananas" }],
  [{ emoji: "⚽", name: "soccer balls" }, { emoji: "🏀", name: "basketballs" }],
  [{ emoji: "🐶", name: "dogs" }, { emoji: "🐱", name: "cats" }],
  [{ emoji: "🔴", name: "red counters" }, { emoji: "🔵", name: "blue counters" }],
  [{ emoji: "🌻", name: "sunflowers" }, { emoji: "🌷", name: "tulips" }],
];

const RATIO_TABLES = [
  { title: "Pancake recipe", a: "Cups of flour", b: "Eggs" },
  { title: "Lemonade", a: "Scoops of mix", b: "Cups of water" },
  { title: "Paint mix", a: "Cans of blue", b: "Cans of yellow" },
  { title: "Bracelet pattern", a: "Red beads", b: "White beads" },
];

const RATIO_STORIES = [
  { a: "girls", b: "boys", where: "in a choir" },
  { a: "wins", b: "losses", where: "for a hockey team this season" },
  { a: "fiction books", b: "non-fiction books", where: "on a classroom shelf" },
  { a: "cats", b: "dogs", where: "at an animal shelter" },
];

const sameRatio = (x1: number, y1: number, x2: number, y2: number) => x1 * y2 === x2 * y1;

/** A numerator from 1 to den − 1 in simplest form with den (so 2 3/5, never 4 2/8). */
const properPart = (den: number): number => pick(range(1, den - 1).filter((r) => gcd(r, den) === 1));

/** A mixed number with its fraction part simplified: (1, 2, 4) → "1 1/2". */
function mixedSimple(w: number, n: number, d: number): string {
  const g = gcd(n, d);
  return mixed(w, n / g, d / g);
}

function mixedRatios(opts?: GenerateOptions): Question[] {
  const d = level(opts);
  const dens = d === 1 ? [2, 3, 4] : d === 2 ? [3, 4, 5, 6, 8] : [5, 6, 8, 10, 12];
  const out: Question[] = [];

  {
    const den = pick(dens);
    const whole = randInt(1, 2);
    const rem = randInt(1, den - 1);
    const n = whole * den + rem;
    out.push(
      ask(
        `Each whole is cut into ${den} equal parts. Write the shaded amount as an improper fraction.`,
        `${n}/${den}`,
        `Count every shaded part: ${plural(whole, "full whole")} ${whole > 1 ? "are" : "is"} ${whole * den} parts, plus ${rem} more. Put the total over ${den}.`,
        {
          keypad: "fraction",
          accept: fracForms(n, den),
          visual: { type: "fraction", numerator: n, denominator: den, shape: den <= 6 && chance(0.5) ? "circle" : "bar" },
        },
      ),
    );
  }

  {
    const den = pick(dens);
    const whole = d === 1 ? randInt(1, 3) : d === 2 ? randInt(2, 6) : randInt(4, 9);
    const rem = properPart(den);
    const n = whole * den + rem;
    out.push(
      ask(
        `Write the mixed number ${mixed(whole, rem, den)} as an improper fraction.`,
        `${n}/${den}`,
        `Multiply the whole number by the denominator, then add the numerator: ${whole} × ${den} + ${rem}. Keep the denominator, ${den}.`,
        { keypad: "fraction", accept: fracForms(n, den) },
      ),
    );
  }

  {
    const den = pick(dens);
    const w = d === 1 ? randInt(1, 2) : randInt(2, 7);
    const r = properPart(den);
    const n = w * den + r;
    const wrong = shuffle([
      mixedSimple(w, den - r, den),
      mixed(w + 1, r, den),
      w > 1 ? mixed(w - 1, r, den) : mixed(w + 2, r, den),
      r !== w && w < den ? mixedSimple(r, w, den) : `${w} ${r}/${n}`,
    ]);
    out.push(
      choose(
        `Which mixed number is equal to ${n}/${den}?`,
        mixed(w, r, den),
        wrong,
        `Divide ${n} by ${den}. The quotient is the number of wholes. The remainder becomes the numerator of the fraction part, over ${den}.`,
        d === 1 ? { type: "fraction", numerator: n, denominator: den } : undefined,
        3,
      ),
    );
  }

  {
    const den = pick(d === 3 ? [4, 6, 8, 10, 12] : dens);
    const bden = d === 3 ? den / 2 : den;
    const w = randInt(1, 4);
    const r2 = properPart(bden);
    const mixedVal = w * den + r2 * (den / bden);
    let p = chance(0.25) ? mixedVal : mixedVal + pick([-2, -1, 1, 2]);
    if (p <= den) p = mixedVal + 1;
    const A = `${p}/${den}`;
    const B = mixed(w, r2, bden);
    const answer = p > mixedVal ? A : p < mixedVal ? B : "They are equal";
    out.push(
      choose(
        `Which is greater: ${A} or ${B}?`,
        answer,
        [A, B, "They are equal"],
        `Write the mixed number as an improper fraction with denominator ${den}: ${B} = ${mixedVal}/${den}. Then compare the numerators.`,
      ),
    );
  }

  {
    const den = pick(d === 1 ? [2, 4] : d === 2 ? [3, 4, 5, 6] : [5, 6, 8]);
    const max = d === 1 ? 2 : 3;
    const w = randInt(1, max - 1);
    const r = properPart(den);
    const wrong = shuffle([
      r + 1 < den ? mixedSimple(w, r + 1, den) : mixed(w - 1, r, den),
      r - 1 > 0 ? mixedSimple(w, r - 1, den) : mixed(w + 1, r, den),
      mixed(w + 1, r, den),
      mixed(w, r, den + 1),
    ]);
    out.push(
      choose(
        "Which mixed number belongs at the ? on the number line?",
        mixed(w, r, den),
        wrong,
        `Each whole is split into ${den} equal jumps, so each jump is 1/${den}. Find the whole number just before the ?, then count the jumps past it.`,
        { type: "numberLine", min: 0, max, step: 1 / den, labelEvery: 1, blankAt: w + r / den },
        3,
      ),
    );
  }

  {
    const [p0, p1] = pick(RATIO_PAIRS);
    let a = 0;
    let b = 0;
    do {
      a = randInt(2, 7);
      b = randInt(2, 7);
    } while (a === b);
    const total = a + b;
    const mode = d === 1 ? pick(["ab", "ba"]) : pick(["ab", "ba", "aw"]);
    const [x, y] = mode === "ab" ? [a, b] : mode === "ba" ? [b, a] : [a, total];
    const prompt =
      mode === "aw"
        ? `What is the ratio of ${p0.name} to all the items?`
        : mode === "ab"
          ? `What is the ratio of ${p0.name} to ${p1.name}?`
          : `What is the ratio of ${p1.name} to ${p0.name}?`;
    const cands: [number, number][] = [
      [y, x],
      [a, b],
      [b, a],
      [a, total],
      [b, total],
      [total, a],
    ];
    out.push(
      choose(
        prompt,
        `${x}:${y}`,
        shuffle(cands.filter(([cx, cy]) => !sameRatio(cx, cy, x, y)).map(([cx, cy]) => `${cx}:${cy}`)),
        mode === "aw"
          ? `A part-to-whole ratio compares one group with everything. Count the ${p0.name}, then count all the items.`
          : "Count each group. Write the numbers in the same order as the words: first : second.",
        { type: "emojiRow", items: [...Array<string>(a).fill(p0.emoji), ...Array<string>(b).fill(p1.emoji)] },
        3,
      ),
    );
  }

  {
    const ctx = pick(RATIO_TABLES);
    let p = 0;
    let q = 0;
    do {
      p = randInt(1, 5);
      q = randInt(1, 6);
    } while (p === q || gcd(p, q) !== 1);
    const shown = d === 3 ? [2, 3, 5] : [1, 2, 3];
    const m = d === 1 ? 4 : d === 2 ? randInt(5, 8) : randInt(7, 12);
    const missingA = d === 3 && chance(0.5);
    const rows: (string | number)[][] = shown.map((k) => [k * p, k * q]);
    rows.push(missingA ? ["?", m * q] : [m * p, "?"]);
    out.push(
      ask(
        `The table shows equivalent ratios. What number replaces the ?`,
        missingA ? m * p : m * q,
        `Find what the known number in the last row was multiplied by, compared with the ratio ${p}:${q}. Multiply the other number by the same amount.`,
        { visual: { type: "table", title: ctx.title, headers: [ctx.a, ctx.b], rows } },
      ),
    );
  }

  {
    const s = pick(RATIO_STORIES);
    let p = 0;
    let q = 0;
    do {
      p = randInt(1, 7);
      q = randInt(1, 7);
    } while (p === q || gcd(p, q) !== 1);
    const m = d === 1 ? randInt(2, 4) : randInt(3, 9);
    if (d === 3) {
      out.push(
        ask(
          `The ratio of ${s.a} to ${s.b} ${s.where} is ${p}:${q}. There are ${(p + q) * m} altogether. How many are ${s.a}?`,
          p * m,
          `Each "group" in the ratio has ${p} + ${q} = ${p + q}. Find how many groups fit into ${(p + q) * m}, then multiply by ${p}.`,
        ),
      );
    } else {
      out.push(
        ask(
          `The ratio of ${s.a} to ${s.b} ${s.where} is ${p}:${q}. There are ${p * m} ${s.a}. How many ${s.b} are there?`,
          q * m,
          `${p * m} ${s.a} is ${p} × ${m}. Keep the ratio equivalent: multiply ${q} by ${m} too.`,
        ),
      );
    }
  }

  return shuffle(out);
}

// ---------- 4. Decimal × and ÷ ----------

const SHOP_ITEMS = [
  { plural: "notebooks", emoji: "📓" },
  { plural: "apples", emoji: "🍎" },
  { plural: "juice boxes", emoji: "🧃" },
  { plural: "pencils", emoji: "✏️" },
  { plural: "bus tickets", emoji: "🎫" },
  { plural: "tennis balls", emoji: "🎾" },
];

function decimalOps(opts?: GenerateOptions): Question[] {
  const d = level(opts);
  const out: Question[] = [];

  {
    const s = d === 1 ? 1 : 2;
    const A = d === 1 ? nonTen(11, 99) : d === 2 ? nonTen(101, 999) : nonTen(1001, 2999);
    const b = d === 1 ? randInt(2, 5) : d === 2 ? randInt(3, 9) : randInt(6, 12);
    const x = A / 10 ** s;
    out.push(
      ask(
        `What is ${str(x)} × ${b}?`,
        (A * b) / 10 ** s,
        `Multiply as if there were no decimal point: ${A} × ${b} = ${A * b}. ${str(x)} has ${plural(s, "decimal place")}, so the answer does too.`,
        { keypad: "decimal", visual: { type: "equation", text: `${str(x)} × ${b} = ?` } },
      ),
    );
  }

  {
    const s = d === 1 ? 1 : 2;
    const b = d === 1 ? randInt(2, 5) : d === 2 ? randInt(3, 9) : randInt(4, 12);
    const Q = d === 1 ? nonTen(11, 49) : d === 2 ? nonTen(11, 199) : nonTen(101, 999);
    const dividend = (Q * b) / 10 ** s;
    const unit = s === 1 ? "tenths" : "hundredths";
    out.push(
      ask(
        `What is ${str(dividend)} ÷ ${b}?`,
        Q / 10 ** s,
        `Think of ${str(dividend)} as ${Q * b} ${unit}. Divide: ${Q * b} ÷ ${b} = ${Q} ${unit}. Then write that as a decimal.`,
        { keypad: "decimal", visual: { type: "equation", text: `${str(dividend)} ÷ ${b} = ?` } },
      ),
    );
  }

  {
    const item = pick(SHOP_ITEMS);
    const name = pick(NAMES);
    const price = d === 1 ? randInt(5, 19) * 25 : d === 2 ? randInt(21, 99) * 5 : randInt(101, 999);
    const qty = d === 1 ? randInt(2, 4) : d === 2 ? randInt(3, 8) : randInt(6, 12);
    out.push(
      ask(
        `${name} buys ${qty} ${item.plural} at ${cash(price)} each. What is the total cost in dollars?`,
        cashAnswer(price * qty),
        `Multiply the price by ${qty}. It can help to work in cents: ${price}¢ × ${qty}, then change cents to dollars (100¢ = $1).`,
        { keypad: "decimal", visual: { type: "emoji", emoji: item.emoji, caption: `${cash(price)} each` } },
      ),
    );
  }

  {
    const whole = d === 3 ? randInt(11, 29) : randInt(2, 9);
    const f = pick([...range(5, 35), ...range(65, 95)]);
    const x = whole + f / 100;
    const yWhole = randInt(2, 9);
    const g = pick([1, 2, 3, 7, 8, 9]);
    const y = yWhole + g / 10;
    const rx = f > 50 ? whole + 1 : whole;
    const ry = g > 5 ? yWhole + 1 : yWhole;
    const est = rx * ry;
    out.push(
      numChoice(
        `Which is the best estimate for ${str(x)} × ${str(y)}?`,
        est,
        [est * 10, est / 10, est * 100],
        `Round each number to the nearest whole number, then multiply: ${rx} × ${ry}. Check that the size of the answer makes sense.`,
      ),
    );
  }

  {
    const A = nonTen(12, 99);
    const B = nonTen(12, d === 1 ? 19 : 99);
    const P = A * B;
    const sB = d === 1 ? 0 : d === 2 ? 1 : 2;
    const k = 1 + sB;
    out.push(
      numChoice(
        `${A} × ${B} = ${P}. Use this fact to find ${str(A / 10)} × ${str(B / 10 ** sB)}.`,
        P / 10 ** k,
        shuffle([0, 1, 2, 3, 4].filter((j) => j !== k).map((j) => P / 10 ** j)),
        `The digits come from ${P}. Count the decimal places in both factors (${k} in total), then move the decimal point in ${P} that many places to the left.${P % 10 === 0 ? " Zeros at the end after the decimal point can be dropped." : ""}`,
        { type: "equation", text: `${A} × ${B} = ${P}` },
      ),
    );
  }

  {
    const [A, sA, B, sB] =
      d === 1
        ? [randInt(2, 9), 1, randInt(2, 9), 1]
        : d === 2
          ? [nonTen(11, 49), 1, randInt(2, 9), 1]
          : [nonTen(101, 499), 2, randInt(2, 9), 1];
    const x = A / 10 ** sA;
    const y = B / 10 ** sB;
    const k = sA + sB;
    out.push(
      ask(
        `What is ${str(x)} × ${str(y)}?`,
        (A * B) / 10 ** k,
        `Multiply the whole numbers: ${A} × ${B} = ${A * B}. There are ${k} decimal places in the factors altogether, so count ${k} places from the right.`,
        { keypad: "decimal", visual: { type: "equation", text: `${str(x)} × ${str(y)} = ?` } },
      ),
    );
  }

  {
    const n = d === 1 ? randInt(2, 4) : d === 2 ? randInt(3, 8) : randInt(4, 9);
    const s = d === 3 ? 2 : 1;
    const P = d === 1 ? nonTen(2, 19) : d === 2 ? nonTen(11, 99) : nonTen(11, 199);
    const total = (P * n) / 10 ** s;
    const T = str(total);
    const ctx = pick([
      { text: `A ${T} m ribbon is cut into ${n} equal pieces. How long is each piece?`, unit: "m" },
      { text: `${T} L of juice is poured equally into ${n} bottles. How much juice goes in each bottle?`, unit: "L" },
      { text: `A ${T} km relay is split equally among ${n} runners. How far does each runner go?`, unit: "km" },
      { text: `A ${T} m board is cut into ${n} equal shelves. How long is each shelf?`, unit: "m" },
    ]);
    out.push(
      ask(
        ctx.text,
        P / 10 ** s,
        `Divide the total by ${n}: ${T} ÷ ${n}. Think of ${T} as ${P * n} ${s === 1 ? "tenths" : "hundredths"} to make it easier.`,
        { keypad: "decimal", suffix: ctx.unit },
      ),
    );
  }

  {
    const size = pick(d === 1 ? [0.5] : d === 2 ? [0.5, 0.25, 0.2] : [0.25, 0.4, 0.75, 0.2]);
    const count = d === 1 ? randInt(3, 12) : randInt(6, 20);
    const total = str(size * count);
    const scale = size === 0.25 || size === 0.75 ? 100 : 10;
    const ctx = pick([
      `How many ${size} L cups can be filled from ${total} L of water?`,
      `A ${total} m rope is cut into pieces that are each ${size} m long. How many pieces are there?`,
      `A bag holds ${total} kg of trail mix. How many ${size} kg portions can be made?`,
    ]);
    out.push(
      ask(
        ctx,
        count,
        `Divide ${total} by ${size}. Multiply both numbers by ${scale} to get whole numbers first: ${str(size * count * scale)} ÷ ${str(size * scale)}.`,
        { keypad: "number" },
      ),
    );
  }

  return shuffle(out);
}

// ---------- 5. Percents & Budgets ----------

const SALE_ITEMS = [
  { name: "hoodie", emoji: "🧥" },
  { name: "skateboard", emoji: "🛹" },
  { name: "backpack", emoji: "🎒" },
  { name: "pair of running shoes", emoji: "👟" },
  { name: "board game", emoji: "🎲" },
  { name: "pair of headphones", emoji: "🎧" },
];

function percentHint(p: number, base: string): string {
  if (p === 50) return `50% is one half, so divide ${base} by 2.`;
  if (p === 25) return `25% is one quarter, so divide ${base} by 4.`;
  if (p === 75) return `75% is three quarters: divide ${base} by 4, then multiply by 3.`;
  if (p === 10) return `10% is one tenth, so divide ${base} by 10.`;
  if (p % 10 === 0) return `Find 10% of ${base} by dividing by 10. Then ${p}% is ${p / 10} times as much.`;
  if (p % 5 === 0) return `Find 10% of ${base} (divide by 10). 5% is half of that. Build ${p}% from 10% and 5% pieces.`;
  return `Find 1% of ${base} by dividing by 100, then multiply by ${p}.`;
}

function percentsBudgets(opts?: GenerateOptions): Question[] {
  const d = level(opts);
  const out: Question[] = [];
  const name = pick(NAMES);

  {
    const den = pick(d === 1 ? [2, 4, 10] : d === 2 ? [4, 5, 10, 20] : [4, 5, 20]);
    const num = randInt(1, den - 1);
    out.push(
      ask(
        "What percent of the bar is shaded?",
        (num * 100) / den,
        `The whole bar is 100%. It has ${den} equal parts, so each part is ${100 / den}%. Multiply by the number of shaded parts.`,
        { suffix: "%", visual: { type: "fraction", numerator: num, denominator: den } },
      ),
    );
  }

  {
    const p = pick(d === 1 ? [10, 50, 25] : d === 2 ? [20, 30, 75, 40, 5] : [15, 35, 45, 60, 12]);
    const unit = 100 / gcd(p, 100);
    const hi = d === 1 ? 200 : d === 2 ? 400 : 600;
    const base = unit * randInt(Math.max(1, Math.ceil(20 / unit)), Math.floor(hi / unit));
    out.push(ask(`What is ${p}% of ${base}?`, (p * base) / 100, percentHint(p, String(base))));
  }

  {
    const item = pick(SALE_ITEMS);
    const p = pick(d === 1 ? [10, 50, 25] : d === 2 ? [20, 25, 30, 40] : [15, 35, 40, 60]);
    const unit = 100 / gcd(p, 100);
    const price = unit * randInt(Math.ceil(20 / unit), Math.floor(160 / unit));
    const off = (price * p) / 100;
    const sale = price - off;
    out.push(
      numChoice(
        `A ${item.name} costs ${cash(price * 100)}. It is on sale for ${p}% off. What is the sale price?`,
        sale,
        shuffle([off, price - p, price + off]).concat([sale - off]),
        `First find the discount: ${p}% of ${cash(price * 100)}. Then subtract the discount from the original price.`,
        { type: "emoji", emoji: item.emoji, caption: `${p}% off` },
        (n) => cash(n * 100),
      ),
    );
  }

  {
    const item = pick(SALE_ITEMS);
    const p = pick(d === 1 ? [10, 50] : d === 2 ? [20, 25, 30] : [15, 25, 20, 10]);
    // Keep the discount a whole number of cents (difficulty 3) or of dollars (difficulty 1–2).
    const unit = 100 / gcd(p, 100);
    let cents: number;
    if (d === 3) {
      do cents = unit * randInt(Math.ceil(1500 / unit), Math.floor(9000 / unit));
      while (cents % 100 === 0);
    } else {
      cents = unit * randInt(Math.ceil(12 / unit), Math.floor(120 / unit)) * 100;
    }
    const off = (cents * p) / 100;
    out.push(
      ask(
        `${name} buys a ${item.name} that normally costs ${cash(cents)}. The store takes ${p}% off. How many dollars does ${name} save?`,
        cashAnswer(off),
        `The amount saved is the discount: ${p}% of ${cash(cents)}. ${percentHint(p, cash(cents))}`,
        { keypad: "decimal" },
      ),
    );
  }

  if (chance(0.5)) {
    let num = 0;
    let den = 0;
    do {
      den = pick([2, 4, 5, 10, 20, 25, 50]);
      num = randInt(1, den - 1);
    } while (gcd(num, den) !== 1);
    const pct = (num * 100) / den;
    out.push(
      choose(
        `Which percent is equal to ${num}/${den}?`,
        `${pct}%`,
        shuffle([`${num}${den}%`, `${num}%`, `${den}%`, `${100 - pct}%`, `${pct / 10}%`]),
        `Percent means "out of 100". Make an equivalent fraction with 100 as the denominator: multiply the top and bottom of ${num}/${den} by ${100 / den}.`,
        undefined,
        3,
      ),
    );
  } else {
    const pct = d === 1 ? randInt(1, 9) * 10 : randInt(1, 99);
    out.push(
      choose(
        `Which decimal is equal to ${pct}%?`,
        str(pct / 100),
        shuffle([str(pct / 10), str(pct / 1000), String(pct), str(pct / 100 + 1)]),
        `${pct}% means ${pct} out of 100, or ${pct} hundredths. Hundredths go 2 places after the decimal point.`,
        undefined,
        3,
      ),
    );
  }

  {
    const items = sample(
      ["Bus pass", "Lunches", "Movie with friends", "Art supplies", "Snacks", "Gift for a friend", "Swim lessons", "Phone top-up"],
      d === 3 ? 4 : 3,
    );
    const income = (d === 1 ? randInt(5, 9) * 10 : d === 2 ? randInt(6, 12) * 10 : randInt(90, 150)) * 100;
    let costs: number[];
    do {
      costs = items.map(() =>
        d === 1 ? randInt(1, 4) * 500 : d === 2 ? randInt(3, 25) * 100 : randInt(12, 120) * 25,
      );
    } while (costs.reduce((s, c) => s + c, 0) > income - 500);
    const spent = costs.reduce((s, c) => s + c, 0);
    out.push(
      ask(
        `${name} has a monthly budget of ${cash(income)}. After paying for everything in the table, how many dollars are left to save?`,
        cashAnswer(income - spent),
        `Add up the costs first, then subtract the total from ${cash(income)}.`,
        {
          keypad: "decimal",
          visual: {
            type: "table",
            title: `${name}'s spending this month`,
            headers: ["Item", "Cost"],
            rows: items.map((it, i) => [it, cash(costs[i])]),
          },
        },
      ),
    );
  }

  {
    const item = pick([
      { one: "granola bar", many: "granola bars" },
      { one: "juice box", many: "juice boxes" },
      { one: "pen", many: "pens" },
      { one: "muffin", many: "muffins" },
    ]);
    const c1 = randInt(2, 6);
    const c2 = c1 + randInt(2, 6);
    const u1 = randInt(8, 30) * 5;
    let u2: number;
    do u2 = u1 + (d === 1 ? pick([-20, -15, -10, 10, 15, 20]) : d === 2 ? pick([-10, -5, 5, 10]) : pick([-4, -3, -2, -1, 1, 2, 3, 4]));
    while (u2 <= 0);
    const t1 = c1 * u1;
    const t2 = c2 * u2;
    const opt1 = `${c1} for ${cash(t1)}`;
    const opt2 = `${c2} for ${cash(t2)}`;
    out.push(
      choose(
        `Which is the better buy for ${item.many}?`,
        u1 < u2 ? opt1 : opt2,
        [u1 < u2 ? opt2 : opt1, `Both cost the same per ${item.one}`],
        `Find the price of one ${item.one} in each deal: divide the price by the number of ${item.many}. The lower price for one is the better buy.`,
      ),
    );
  }

  {
    const goalItem = pick(["a bike", "a skateboard", "a tent", "a keyboard", "a telescope", "a new pair of skates"]);
    if (d === 1) {
      const save = pick([5, 10, 15, 20]);
      const weeks = randInt(3, 10);
      out.push(
        ask(
          `${name} saves ${cash(save * 100)} each week for ${goalItem} that costs ${cash(save * weeks * 100)}. How many weeks will it take?`,
          weeks,
          `Divide the cost by the amount saved each week: ${save * weeks} ÷ ${save}.`,
        ),
      );
    } else if (d === 2) {
      const save = pick([5, 10, 15, 20, 25]);
      const weeks = randInt(4, 12);
      const start = randInt(1, 8) * 5;
      out.push(
        ask(
          `${name} already has ${cash(start * 100)} and saves ${cash(save * 100)} each week. ${cap(goalItem)} costs ${cash((start + save * weeks) * 100)}. How many weeks until ${name} can buy it?`,
          weeks,
          `Subtract what ${name} already has from the cost to find how much is still needed. Then divide by ${cash(save * 100)}.`,
        ),
      );
    } else {
      const p = pick([20, 25, 50]);
      const save = randInt(5, p === 50 ? 15 : 8);
      const earn = (save * 100) / p;
      const weeks = randInt(4, 12);
      const job = pick(["walking dogs", "babysitting", "doing extra chores", "mowing lawns"]);
      out.push(
        ask(
          `${name} earns ${cash(earn * 100)} a week ${job} and saves ${p}% of it. How many weeks will it take to save ${cash(save * weeks * 100)} for ${goalItem}?`,
          weeks,
          `First find ${p}% of ${cash(earn * 100)}: that's the amount saved each week. Then divide the goal by that amount.`,
        ),
      );
    }
  }

  return shuffle(out);
}

// ---------- 6. Patterns & Graphs ----------

/** 3, 2 → "3n + 2"; 1, 0 → "n"; 4, -1 → "4n − 1". */
function expr(m: number, b: number, v = "n"): string {
  const head = m === 1 ? v : `${m}${v}`;
  return b === 0 ? head : b > 0 ? `${head} + ${b}` : `${head} − ${-b}`;
}

const INC_SETS = [
  [3, 2, 1, 1, 0],
  [4, 2, 1, 1, 0],
  [3, 1, 2, 0, 1],
  [2, 4, 1, 0, 1],
  [1, 3, 2, 1, 0],
];

const GRAPH_CONTEXTS = [
  { what: "height of a bean plant (cm)", unit: "week", up: true },
  { what: "distance a hiker has walked (km)", unit: "hour", up: true },
  { what: "height of a burning candle (cm)", unit: "hour", up: false },
];

function graphData(up: boolean): number[] {
  const incs = shuffle(pick(INC_SETS));
  const sum = incs.reduce((s, x) => s + x, 0);
  const ys = [up ? randInt(0, 10 - sum) : randInt(sum, 10)];
  for (const inc of incs) ys.push(ys[ys.length - 1] + (up ? inc : -inc));
  return ys;
}

function patternsGraphs(opts?: GenerateOptions): Question[] {
  const d = level(opts);
  const out: Question[] = [];

  {
    const m = d === 1 ? randInt(2, 3) : randInt(2, 6);
    let b: number;
    do b = d === 1 ? randInt(0, 3) : d === 2 ? randInt(1, 7) : pick([-3, -2, -1, 1, 2, 3, 4, 5]);
    while (m + b <= 0);
    const rows = [1, 2, 3, 4].map((n) => [n, m * n + b]);
    const wrong = shuffle([
      ...(b >= 2 ? [expr(b, m)] : []),
      expr(1, m + b),
      expr(m + b, 0),
      expr(m + 1, b - 1),
      expr(m, b + 1),
    ]);
    out.push(
      choose(
        "Which expression gives the output for any input n?",
        expr(m, b),
        wrong,
        `The output changes by ${m} each time the input goes up by 1, so the rule starts with ${m}n. Then check n = 1 and adjust with + or −.`,
        { type: "table", title: "Pattern rule", headers: ["Input (n)", "Output"], rows },
        3,
      ),
    );
  }

  {
    if (d === 3) {
      const step = randInt(5, 15);
      const start = randInt(9 * step + 5, 9 * step + 60);
      const seq = [0, 1, 2, 3].map((i) => start - i * step);
      out.push(
        ask(
          "This pattern keeps decreasing the same way. What is the 10th number?",
          start - 9 * step,
          `Each number is ${step} less than the one before. The 10th number is 9 steps after the 1st: ${start} − 9 × ${step}.`,
          { visual: { type: "equation", text: `${seq.join(", ")}, …` } },
        ),
      );
    } else {
      const up = d === 1;
      const step = up ? randInt(3, 9) : randInt(4, 12);
      const start = up ? randInt(2, 20) : randInt(60, 120);
      const seq = [0, 1, 2, 3].map((i) => start + (up ? i : -i) * step);
      out.push(
        ask(
          "What number comes next in the pattern?",
          start + (up ? 4 : -4) * step,
          `Find the change from one number to the next. Each number ${up ? "goes up" : "goes down"} by the same amount.`,
          { visual: { type: "equation", text: `${seq.join(", ")}, ☐` } },
        ),
      );
    }
  }

  {
    const m = randInt(2, d === 1 ? 4 : 9);
    const b = randInt(0, d === 1 ? 3 : 9);
    const N = d === 1 ? 6 : d === 2 ? randInt(10, 15) : randInt(20, 50);
    const rows: (string | number)[][] = [1, 2, 3, 4].map((n) => [n, m * n + b]);
    rows.push([N, "?"]);
    out.push(
      ask(
        `Find the pattern rule. What is the output when the input is ${N}?`,
        m * N + b,
        `The output goes up by ${m} each time, so the rule is ${m} × n, plus or minus a fixed number. Check it with n = 1, then use n = ${N}.`,
        { visual: { type: "table", title: "Input and output", headers: ["Input (n)", "Output"], rows } },
      ),
    );
  }

  {
    const askX = d === 3 ? 5 : 4;
    let up = true;
    let m = 1;
    let b = 0;
    const y = (x: number) => (up ? m * x + b : b - m * x);
    do {
      up = d === 1 ? true : chance(0.5);
      m = randInt(1, 2);
      b = up ? randInt(0, 2) : randInt(9, 10);
    } while (y(askX) < 0 || y(askX) > 10);
    out.push(
      ask(
        `These points follow a ${up ? "growing" : "shrinking"} linear pattern. If it continues, what is y when x = ${askX}?`,
        y(askX),
        `Each time x goes up by 1, y ${up ? "goes up" : "goes down"} by ${m}. Keep going from the last point, (3, ${y(3)}).`,
        {
          visual: {
            type: "grid",
            size: 10,
            points: [0, 1, 2, 3].map((x) => ({ x, y: y(x), label: d === 1 ? `(${x}, ${y(x)})` : undefined })),
          },
        },
      ),
    );
  }

  {
    const [c1, c2] = sample(GRAPH_CONTEXTS, 2);
    const ys = graphData(c1.up);
    let a = 0;
    let b = 0;
    do {
      a = randInt(0, 3);
      b = randInt(a + 2, 5);
    } while (ys[a] === ys[b]);
    out.push(
      ask(
        `The points show the ${c1.what} at the start (x = 0) and after each ${c1.unit}. How much did it ${c1.up ? "increase" : "decrease"} from ${c1.unit} ${a} to ${c1.unit} ${b}?`,
        Math.abs(ys[b] - ys[a]),
        `Read the y-value above x = ${a} and above x = ${b}. Subtract the smaller value from the larger one.`,
        { visual: { type: "grid", size: 10, points: ys.map((v, x) => ({ x, y: v })) } },
      ),
    );

    const ys2 = graphData(c2.up);
    const changes = ys2.slice(1).map((v, i) => Math.abs(v - ys2[i]));
    const most = changes.indexOf(Math.max(...changes));
    const labels = changes.map((_, i) => `${cap(c2.unit)} ${i} to ${i + 1}`);
    out.push(
      choose(
        `The points show the ${c2.what} after each ${c2.unit}. Between which two ${c2.unit}s did it change the most?`,
        labels[most],
        labels.filter((_, i) => i !== most),
        "Look for the biggest jump between neighbouring points. On a line graph, that's the steepest part of the line.",
        { type: "grid", size: 10, points: ys2.map((v, x) => ({ x, y: v })) },
      ),
    );
  }

  {
    const ctx = pick([
      { text: (r: string, f: string) => `A climbing gym charges ${r} per visit plus a one-time membership fee of ${f}.`, v: "v", what: "visits" },
      { text: (r: string, f: string) => `A bowling alley charges ${r} per game plus ${f} for shoe rental.`, v: "g", what: "games" },
      { text: (r: string, f: string) => `A taxi charges ${r} per kilometre plus a starting fee of ${f}.`, v: "k", what: "kilometres" },
      { text: (r: string, f: string) => `A pottery class costs ${r} per session plus ${f} for supplies.`, v: "s", what: "sessions" },
    ]);
    const r = randInt(2, 9);
    let f: number;
    do f = randInt(2, 15);
    while (f === r);
    out.push(
      choose(
        `${ctx.text(cash(r * 100), cash(f * 100))} Which expression gives the total cost, in dollars, for ${ctx.v} ${ctx.what}?`,
        expr(r, f, ctx.v),
        shuffle([expr(f, r, ctx.v), expr(r + f, 0, ctx.v), expr(1, r + f, ctx.v), expr(r, 0, ctx.v)]),
        `The cost that repeats (${cash(r * 100)} each time) is multiplied by ${ctx.v}. The one-time cost (${cash(f * 100)}) is added only once.`,
        undefined,
        3,
      ),
    );
  }

  {
    const name = pick(NAMES);
    const rate = d === 1 ? randInt(2, 5) : randInt(3, 12);
    const t = d === 1 ? randInt(2, 5) : randInt(4, 9);
    if (d === 3) {
      const r = randInt(4, 12);
      const T = randInt(6, 15);
      out.push(
        ask(
          `A rain barrel holds ${r * T} L of water. A tap drains ${r} L every minute. After how many minutes will the barrel be empty?`,
          T,
          `The amount goes down by ${r} L each minute. Find how many groups of ${r} are in ${r * T}: divide.`,
        ),
      );
    } else {
      const ctx = pick(
        [
          {
            text: (S: number) => `A rain barrel holds ${S} L of water. A tap drains ${rate} L every minute. How many litres are left after ${t} minutes?`,
            max: 200,
          },
          {
            text: (S: number) => `A tablet battery is at ${S}% and drops ${rate}% every hour of video. What percent is left after ${t} hours?`,
            max: 100,
          },
          {
            text: (S: number) => `${name} has ${S} pages left to read and reads ${rate} pages every day. How many pages are left after ${t} days?`,
            max: 300,
          },
        ].filter((c) => rate * t + 10 <= c.max),
      );
      const S = randInt(rate * t + 5, ctx.max);
      out.push(
        ask(
          ctx.text(S),
          S - rate * t,
          `This is a decreasing pattern: start at ${S} and subtract ${rate} each time. After ${t} times, that's ${S} − ${t} × ${rate}.`,
        ),
      );
    }
  }

  return shuffle(out);
}

// ---------- 7. Equations ----------

interface OrderProblem {
  text: string;
  value: number;
  wrong: number[];
  steps: string;
}

function orderProblem(d: Level): OrderProblem {
  const form = pick(d === 1 ? ["a+bc", "a-bc"] : d === 2 ? ["(a+b)c", "a-p/q", "a+bc"] : ["ab-ce", "a(b+c)-e", "a+b(c-e)"]);
  switch (form) {
    case "a+bc": {
      const a = randInt(2, 20), b = randInt(2, 9), c = randInt(2, 9);
      return {
        text: `${a} + ${b} × ${c}`,
        value: a + b * c,
        wrong: [(a + b) * c, a + b + c, a * b + c],
        steps: `Multiply first: ${b} × ${c} = ${b * c}. Then add ${a}.`,
      };
    }
    case "a-bc": {
      const b = randInt(2, 9), c = randInt(2, 9), a = b * c + randInt(5, 40);
      return {
        text: `${a} − ${b} × ${c}`,
        value: a - b * c,
        wrong: [(a - b) * c, a - b - c, a - b * c + 10],
        steps: `Multiply first: ${b} × ${c} = ${b * c}. Then subtract it from ${a}.`,
      };
    }
    case "(a+b)c": {
      const a = randInt(2, 15), b = randInt(2, 15), c = randInt(2, 9);
      return {
        text: `(${a} + ${b}) × ${c}`,
        value: (a + b) * c,
        wrong: [a + b * c, a * c + b, a + b + c],
        steps: `Brackets first: ${a} + ${b} = ${a + b}. Then multiply by ${c}.`,
      };
    }
    case "a-p/q": {
      const q = randInt(2, 9), k = randInt(2, 9), p = q * k, a = p + randInt(5, 40);
      return {
        text: `${a} − ${p} ÷ ${q}`,
        value: a - k,
        wrong: [(a - p) / q, a - p - q, a - k + q],
        steps: `Divide first: ${p} ÷ ${q} = ${k}. Then subtract it from ${a}.`,
      };
    }
    case "ab-ce": {
      let a: number, b: number, c: number, e: number;
      do {
        a = randInt(3, 9);
        b = randInt(3, 9);
        c = randInt(2, 6);
        e = randInt(2, 5);
      } while (a * b <= c * e);
      return {
        text: `${a} × ${b} − ${c} × ${e}`,
        value: a * b - c * e,
        wrong: [(a * b - c) * e, a * b - c + e, a * (b - c) * e],
        steps: `Do both multiplications first: ${a} × ${b} = ${a * b} and ${c} × ${e} = ${c * e}. Then subtract.`,
      };
    }
    case "a(b+c)-e": {
      const a = randInt(2, 9), b = randInt(2, 9), c = randInt(2, 9), e = randInt(1, 2 * a);
      return {
        text: `${a} × (${b} + ${c}) − ${e}`,
        value: a * (b + c) - e,
        wrong: [a * b + c - e, a * (b + c - e), a * (b + c) + e],
        steps: `Brackets first: ${b} + ${c} = ${b + c}. Multiply by ${a}, then subtract ${e}.`,
      };
    }
    default: {
      let c: number, e: number;
      do {
        c = randInt(3, 9);
        e = randInt(1, 8);
      } while (e >= c);
      const a = randInt(2, 20), b = randInt(2, 9);
      return {
        text: `${a} + ${b} × (${c} − ${e})`,
        value: a + b * (c - e),
        wrong: [(a + b) * (c - e), a + b * c - e, a + b + c - e],
        steps: `Brackets first: ${c} − ${e} = ${c - e}. Multiply by ${b}, then add ${a}.`,
      };
    }
  }
}

const ORDER_RULE = "Order of operations: brackets first, then × and ÷ from left to right, then + and − from left to right.";

type EqType = "add" | "sub" | "mul" | "div";

interface Equation {
  text: string;
  solution: number;
  a: number;
  hint: string;
}

function makeEquation(type: EqType, d: Level, v: string): Equation {
  const big = d === 1 ? 20 : d === 2 ? 60 : 150;
  switch (type) {
    case "add": {
      const a = randInt(5, big), sol = randInt(3, big), b = sol + a;
      return {
        text: d === 3 && chance(0.5) ? `${b} = ${v} + ${a}` : `${v} + ${a} = ${b}`,
        solution: sol,
        a,
        hint: `Undo adding ${a}: subtract ${a} from both sides. ${v} = ${b} − ${a}.`,
      };
    }
    case "sub": {
      const a = randInt(3, big), b = randInt(2, big);
      return {
        text: d === 3 && chance(0.5) ? `${b} = ${v} − ${a}` : `${v} − ${a} = ${b}`,
        solution: a + b,
        a,
        hint: `Undo subtracting ${a}: add ${a} to both sides. ${v} = ${b} + ${a}.`,
      };
    }
    case "mul": {
      const a = randInt(2, d === 1 ? 9 : 12), sol = randInt(2, d === 1 ? 9 : d === 2 ? 12 : 25), b = a * sol;
      return {
        text: d === 3 && chance(0.5) ? `${b} = ${a}${v}` : `${a}${v} = ${b}`,
        solution: sol,
        a,
        hint: `${a}${v} means ${a} × ${v}. Undo multiplying: divide both sides by ${a}.`,
      };
    }
    default: {
      const a = randInt(2, d === 1 ? 6 : 12), q = randInt(2, d === 1 ? 9 : 12);
      return {
        text: `${v} ÷ ${a} = ${q}`,
        solution: a * q,
        a,
        hint: `Undo dividing: multiply both sides by ${a}. ${v} = ${q} × ${a}.`,
      };
    }
  }
}

const INVERSE_STEP: Record<EqType, (a: number) => string> = {
  add: (a) => `Subtract ${a} from both sides`,
  sub: (a) => `Add ${a} to both sides`,
  mul: (a) => `Divide both sides by ${a}`,
  div: (a) => `Multiply both sides by ${a}`,
};

function equations(opts?: GenerateOptions): Question[] {
  const d = level(opts);
  const out: Question[] = [];
  const name = pick(NAMES);

  {
    const p = orderProblem(d);
    out.push(ask(`What is ${p.text}?`, p.value, `${ORDER_RULE} ${p.steps}`, { visual: { type: "equation", text: `${p.text} = ?` } }));
  }

  {
    const p = orderProblem(d);
    out.push(
      numChoice(
        `What is the value of ${p.text}?`,
        p.value,
        p.wrong.filter((w) => Number.isInteger(w)),
        `${ORDER_RULE} ${p.steps}`,
        { type: "equation", text: `${p.text} = ?` },
      ),
    );
  }

  const types = sample<EqType>(["add", "sub", "mul", "div"], 3);
  for (const type of types) {
    const v = pick(["n", "x", "m", "k", "y"]);
    const eq = makeEquation(type, d, v);
    out.push(ask(`Solve for ${v}.`, eq.solution, eq.hint, { visual: { type: "equation", text: eq.text } }));
  }

  {
    const type = pick<EqType>(["add", "sub", "mul", "div"]);
    const v = pick(["n", "x", "m"]);
    const eq = makeEquation(type, d, v);
    out.push(
      choose(
        `Which step solves ${eq.text} for ${v}?`,
        INVERSE_STEP[type](eq.a),
        (Object.keys(INVERSE_STEP) as EqType[]).filter((t) => t !== type).map((t) => INVERSE_STEP[t](eq.a)),
        "Use the inverse (opposite) operation: subtraction undoes addition, and division undoes multiplication.",
        { type: "equation", text: eq.text },
      ),
    );
  }

  {
    const type = pick<EqType>(["add", "sub", "mul", "div"]);
    const a = randInt(3, 9);
    const sol = randInt(3, d === 1 ? 9 : 15);
    const stories: Record<EqType, { text: string; right: string; wrong: string[] }> = {
      mul: {
        text: `${name} buys ${a} packs of stickers with the same number in each pack. That's ${a * sol} stickers in all. Which equation could find n, the number of stickers in one pack?`,
        right: `${a}n = ${a * sol}`,
        wrong: [`n + ${a} = ${a * sol}`, `n ÷ ${a} = ${a * sol}`, `n − ${a} = ${a * sol}`],
      },
      add: {
        text: `A basketball team had some points at half-time. They scored ${a * 4} more and finished with ${a * 4 + sol * 3} points. Which equation could find n, the half-time score?`,
        right: `n + ${a * 4} = ${a * 4 + sol * 3}`,
        wrong: [`n − ${a * 4} = ${a * 4 + sol * 3}`, `${a * 4}n = ${a * 4 + sol * 3}`, `n ÷ ${a * 4} = ${a * 4 + sol * 3}`],
      },
      sub: {
        text: `${name} had some money, spent $${a * 2} on a book, and has $${sol} left. Which equation could find n, the amount ${name} started with?`,
        right: `n − ${a * 2} = ${sol}`,
        wrong: [`n + ${a * 2} = ${sol}`, `${a * 2}n = ${sol}`, `n ÷ ${a * 2} = ${sol}`],
      },
      div: {
        text: `A bag of n apples is shared equally among ${a} friends. Each friend gets ${sol} apples. Which equation fits?`,
        right: `n ÷ ${a} = ${sol}`,
        wrong: [`${a}n = ${sol}`, `n − ${a} = ${sol}`, `n + ${a} = ${sol}`],
      },
    };
    const s = stories[type];
    out.push(
      choose(
        s.text,
        s.right,
        s.wrong,
        "Ask what happens to the unknown amount n: is something added to it, taken away, multiplied or shared? Write that action with n.",
      ),
    );
  }

  {
    const type = pick<EqType>(["add", "sub", "mul", "div"]);
    const a = d === 1 ? randInt(4, 15) : randInt(12, 60);
    const b = d === 1 ? randInt(4, 20) : randInt(15, 80);
    const k = randInt(3, d === 1 ? 6 : 12);
    const q = randInt(4, d === 1 ? 9 : 15);
    const stories: Record<EqType, { text: string; answer: number; eq: string }> = {
      add: {
        text: `${name} had some hockey cards. After getting ${a} more, ${name} has ${a + b}. How many cards did ${name} start with?`,
        answer: b,
        eq: `n + ${a} = ${a + b}`,
      },
      sub: {
        text: `A library shelf had some books. After ${a} were borrowed, ${b} books are left. How many books were on the shelf at first?`,
        answer: a + b,
        eq: `n − ${a} = ${b}`,
      },
      mul: {
        text: `${k} tickets to a science centre cost $${k * q} in all. Each ticket costs the same. How many dollars is one ticket?`,
        answer: q,
        eq: `${k}n = ${k * q}`,
      },
      div: {
        text: `A class splits into ${k} equal teams with ${q} students on each team. How many students are in the class?`,
        answer: k * q,
        eq: `n ÷ ${k} = ${q}`,
      },
    };
    const s = stories[type];
    out.push(ask(s.text, s.answer, `Write an equation, like ${s.eq}. Then use the inverse operation to find n.`));
  }

  return shuffle(out);
}

// ---------- 8. Perimeter & Area ----------

const AREA_CONCEPTS: { prompt: string; right: string; wrong: string[]; hint: string; shape: ShapeName }[] = [
  {
    prompt: "A triangle and a parallelogram have the same base and the same height. How do their areas compare?",
    right: "The triangle's area is half the parallelogram's",
    wrong: ["Their areas are equal", "The triangle's area is double", "The triangle's area is one quarter"],
    hint: "Two copies of the triangle fit together to make a parallelogram with the same base and height.",
    shape: "parallelogram",
  },
  {
    prompt: "Which formula gives the area of a trapezoid with parallel sides a and b and height h?",
    right: "(a + b) × h ÷ 2",
    wrong: ["a × b × h", "(a + b) × 2 × h", "a + b + h"],
    hint: "Two copies of a trapezoid make a parallelogram with base a + b and height h. The trapezoid is half of it.",
    shape: "trapezoid",
  },
  {
    prompt: "To find the area of a parallelogram, which two measurements do you multiply?",
    right: "The base and the perpendicular height",
    wrong: ["The base and the slanted side", "The two slanted sides", "The perimeter and the base"],
    hint: "Cut a triangle off one end and slide it to the other end. You get a rectangle with the same base and height.",
    shape: "parallelogram",
  },
  {
    prompt: "Two triangles have the same base and the same height but look different. What is true about their areas?",
    right: "Their areas are equal",
    wrong: ["The one with longer sides has more area", "The one that leans more has less area", "You need the perimeter to tell"],
    hint: "The area of a triangle only depends on its base and height: base × height ÷ 2.",
    shape: "triangle",
  },
  {
    prompt: "Why does the triangle area formula divide by 2?",
    right: "A triangle is half of a parallelogram with the same base and height",
    wrong: ["Because a triangle has 3 sides", "Because the height is always half the base", "To change centimetres into metres"],
    hint: "Copy the triangle, turn the copy around and join them. Together they make a parallelogram.",
    shape: "triangle",
  },
];

function perimeterArea(opts?: GenerateOptions): Question[] {
  const d = level(opts);
  const out: Question[] = [];

  {
    let b: number, h: number;
    do {
      b = d === 1 ? randInt(2, 8) * 2 : randInt(5, d === 2 ? 20 : 25);
      h = randInt(3, d === 1 ? 10 : d === 2 ? 15 : 25);
    } while (d === 2 && (b * h) % 2 !== 0);
    out.push(
      ask(
        `A triangle has a base of ${b} cm and a height of ${h} cm. What is its area?`,
        (b * h) / 2,
        "A triangle is half of a parallelogram with the same base and height, so area = base × height ÷ 2.",
        { keypad: "decimal", suffix: "cm²", visual: { type: "shape", shape: "triangle" } },
      ),
    );
  }

  {
    const b = d === 3 ? randInt(9, 25) + 0.5 : randInt(4, d === 1 ? 10 : 15);
    const h = randInt(3, d === 1 ? 9 : 12);
    const slant = h + randInt(1, 4);
    out.push(
      ask(
        d === 1
          ? `A parallelogram has a base of ${b} m and a height of ${h} m. What is its area?`
          : `A parallelogram has a base of ${str(b)} m, slanted sides of ${slant} m, and a height of ${h} m. What is its area?`,
        b * h,
        "Area of a parallelogram = base × perpendicular height. The slanted side is not the height.",
        { keypad: "decimal", suffix: "m²", visual: { type: "shape", shape: "parallelogram" } },
      ),
    );
  }

  {
    let a: number, b: number, h: number;
    do {
      a = randInt(3, 10);
      b = a + randInt(2, 10);
      h = randInt(2, d === 1 ? 8 : 12);
    } while (d < 3 && ((a + b) * h) % 2 !== 0);
    out.push(
      ask(
        `A trapezoid has parallel sides of ${a} cm and ${b} cm, and a height of ${h} cm. What is its area?`,
        ((a + b) * h) / 2,
        "Add the parallel sides, multiply by the height, then divide by 2: (a + b) × h ÷ 2.",
        { keypad: "decimal", suffix: "cm²", visual: { type: "shape", shape: "trapezoid" } },
      ),
    );
  }

  {
    const W = randInt(4, 8);
    const H = randInt(4, 8);
    let points: { x: number; y: number; label: string }[];
    let hint: string;
    if (d === 1) {
      points = [
        { x: 1, y: 1, label: "A" },
        { x: 1 + W, y: 1, label: "B" },
        { x: 1 + W, y: 1 + H, label: "C" },
        { x: 1, y: 1 + H, label: "D" },
      ];
      hint = "Count the squares along each side, then add all four sides. Perimeter = 2 × (length + width).";
    } else {
      const cw = randInt(1, W - 1);
      const ch = randInt(1, H - 1);
      points = [
        { x: 1, y: 1, label: "A" },
        { x: 1 + W, y: 1, label: "B" },
        { x: 1 + W, y: 1 + H - ch, label: "C" },
        { x: 1 + W - cw, y: 1 + H - ch, label: "D" },
        { x: 1 + W - cw, y: 1 + H, label: "E" },
        { x: 1, y: 1 + H, label: "F" },
      ];
      hint = "Add all 6 sides. Shortcut: the two short steps add up to the full width and height, so the perimeter equals the perimeter of the rectangle around the shape.";
    }
    const last = points[points.length - 1].label;
    out.push(
      ask(
        `Join the points in order, A to ${last}, then back to A. Each grid square is 1 m long. What is the perimeter of the shape?`,
        2 * (W + H),
        hint,
        { suffix: "m", visual: { type: "grid", size: 10, points } },
      ),
    );
  }

  {
    const kind = d === 1 ? "parallelogram" : d === 2 ? pick(["parallelogram", "triangle"]) : pick(["triangle", "trapezoid"]);
    if (kind === "parallelogram") {
      const b = randInt(3, 12), h = randInt(2, 12);
      out.push(
        ask(
          `A parallelogram has an area of ${b * h} cm² and a base of ${b} cm. What is its height?`,
          h,
          `Area = base × height, so height = area ÷ base.`,
          { suffix: "cm", visual: { type: "shape", shape: "parallelogram" } },
        ),
      );
    } else if (kind === "triangle") {
      let b: number, h: number;
      do {
        b = randInt(4, 16);
        h = randInt(3, 14);
      } while ((b * h) % 2 !== 0);
      out.push(
        ask(
          `A triangle has an area of ${(b * h) / 2} cm² and a base of ${b} cm. What is its height?`,
          h,
          "Area = base × height ÷ 2. Double the area to undo the ÷ 2, then divide by the base.",
          { suffix: "cm", visual: { type: "shape", shape: "triangle" } },
        ),
      );
    } else {
      let a: number, b: number, h: number;
      do {
        a = randInt(3, 9);
        b = a + randInt(2, 8);
        h = randInt(2, 10);
      } while (((a + b) * h) % 2 !== 0);
      out.push(
        ask(
          `A trapezoid has an area of ${((a + b) * h) / 2} cm². Its parallel sides are ${a} cm and ${b} cm. What is its height?`,
          h,
          "Area = (a + b) × h ÷ 2. Double the area, then divide by the sum of the parallel sides.",
          { suffix: "cm", visual: { type: "shape", shape: "trapezoid" } },
        ),
      );
    }
  }

  {
    const c = pick(AREA_CONCEPTS);
    out.push(choose(c.prompt, c.right, c.wrong, c.hint, { type: "shape", shape: c.shape }));
  }

  {
    if (d === 1) {
      const [shape, n] = pick<[ShapeName, number]>([
        ["pentagon", 5],
        ["hexagon", 6],
        ["octagon", 8],
      ]);
      const s = randInt(3, 15);
      out.push(
        ask(
          `Every side of this regular ${shape} is ${s} cm long. What is its perimeter?`,
          n * s,
          `A regular ${shape} has ${n} equal sides. Perimeter = number of sides × side length.`,
          { suffix: "cm", visual: { type: "shape", shape } },
        ),
      );
    } else {
      const [shape, n] = d === 2 ? (["pentagon", 5] as [ShapeName, number]) : (["hexagon", 6] as [ShapeName, number]);
      const sides = range(1, n).map(() => randInt(4, 15));
      const P = sides.reduce((s, x) => s + x, 0);
      const known = sides.slice(0, n - 1);
      out.push(
        ask(
          `A garden shaped like a ${shape} has a perimeter of ${P} m. ${n - 1} of its sides are ${known.slice(0, -1).join(" m, ")} m and ${known[known.length - 1]} m. How long is the last side?`,
          sides[n - 1],
          "Add the sides you know. The missing side is the perimeter minus that total.",
          { suffix: "m", visual: { type: "shape", shape } },
        ),
      );
    }
  }

  {
    const kind = pick(["trapezoid", "triangle", "parallelogram"]);
    const fmt = (n: number) => `${str(n)} m²`;
    if (kind === "trapezoid") {
      let a: number, b: number, h: number;
      do {
        a = randInt(2, 8);
        b = a + randInt(1, 6);
        h = randInt(2, 8);
      } while (((a + b) * h) % 2 !== 0);
      out.push(
        numChoice(
          `A garden bed is shaped like a trapezoid. Its parallel sides are ${a} m and ${b} m, and they are ${h} m apart. What is its area?`,
          ((a + b) * h) / 2,
          shuffle([(a + b) * h, a * b * h, a + b + h, a * h + b]),
          "Area of a trapezoid = (a + b) × h ÷ 2. Don't forget to divide by 2.",
          { type: "shape", shape: "trapezoid" },
          fmt,
        ),
      );
    } else if (kind === "triangle") {
      let b: number, h: number;
      do {
        b = randInt(2, 9);
        h = randInt(2, 9);
      } while ((b * h) % 2 !== 0 || b === h);
      out.push(
        numChoice(
          `A triangular sail has a base of ${b} m and a height of ${h} m. How much fabric covers the sail?`,
          (b * h) / 2,
          shuffle([b * h, b + h, 2 * (b + h), b * h * 2]),
          "Fabric covering a surface is an area question. Area of a triangle = base × height ÷ 2.",
          { type: "shape", shape: "triangle" },
          fmt,
        ),
      );
    } else {
      const b = randInt(3, 9), h = randInt(2, 6), s = h + randInt(1, 3);
      out.push(
        numChoice(
          `A parking space is painted as a parallelogram with a base of ${b} m, a height of ${h} m and slanted sides of ${s} m. What is its area?`,
          b * h,
          shuffle([b * s, 2 * (b + s), (b * h) / 2]),
          "Area of a parallelogram = base × perpendicular height. The slanted side is only needed for perimeter.",
          { type: "shape", shape: "parallelogram" },
          fmt,
        ),
      );
    }
  }

  return shuffle(out);
}

// ---------- 9. Angles & Triangles ----------

const ANGLE_TYPES = [
  { name: "acute", lo: 20, hi: 75 },
  { name: "right", lo: 90, hi: 90 },
  { name: "obtuse", lo: 105, hi: 165 },
  { name: "straight", lo: 180, hi: 180 },
  { name: "reflex", lo: 200, hi: 330 },
];

const TRIANGLE_FACTS = [
  {
    prompt: "Can a triangle have two right angles?",
    right: "No, two right angles already add to 180°",
    wrong: ["Yes, if the third side is long enough", "Yes, but only if it is isosceles", "Only if it is equilateral"],
    hint: "The three angles of a triangle add to exactly 180°. Two 90° angles would leave 0° for the third.",
  },
  {
    prompt: "Can a triangle have two obtuse angles?",
    right: "No, two obtuse angles add to more than 180°",
    wrong: ["Yes, in a scalene triangle", "Yes, if the sides are long", "Only in a right triangle"],
    hint: "Obtuse angles are more than 90° each. Two of them already go past the 180° total.",
  },
  {
    prompt: "A right triangle has one 90° angle. What must be true about its other two angles?",
    right: "They add to 90°",
    wrong: ["They add to 180°", "They are both 45°", "One of them is obtuse"],
    hint: "All three angles add to 180°. Take away the 90° angle and see what is left for the other two.",
  },
  {
    prompt: "What is true about every equilateral triangle?",
    right: "All three angles are 60°",
    wrong: ["It has one right angle", "It has one obtuse angle", "Its angles add to 360°"],
    hint: "Equal sides mean equal angles. 180° shared equally by 3 angles is 180° ÷ 3.",
  },
  {
    prompt: "In an isosceles triangle, which angles are equal?",
    right: "The two angles opposite the equal sides",
    wrong: ["All three angles", "None of the angles", "The largest and the smallest angle"],
    hint: "An isosceles triangle has two equal sides. The angles across from those sides (the base angles) match.",
  },
];

function anglesTriangles(opts?: GenerateOptions): Question[] {
  const d = level(opts);
  const out: Question[] = [];

  {
    const t = pick(ANGLE_TYPES);
    const deg = t.lo === t.hi ? t.lo : randInt(t.lo / 5, t.hi / 5) * 5;
    out.push(
      choose(
        d === 3 ? "What kind of angle is this?" : `This angle measures ${deg}°. What kind of angle is it?`,
        t.name,
        ANGLE_TYPES.filter((o) => o !== t).map((o) => o.name),
        "Acute: less than 90°. Right: exactly 90°. Obtuse: between 90° and 180°. Straight: exactly 180°. Reflex: more than 180°.",
        { type: "angle", degrees: deg },
      ),
    );
  }

  {
    const deg = pick(d === 1 ? [30, 60, 90, 120, 150] : [30, 45, 60, 120, 135, 150, 210, 240, 270, 300]);
    const gap = d === 1 ? 60 : d === 2 ? 45 : 30;
    const pool = range(1, 23)
      .map((i) => i * 15)
      .filter((x) => Math.abs(x - deg) >= gap);
    out.push(
      choose(
        "About how many degrees is this angle?",
        `${deg}°`,
        sample(pool, 3).map((x) => `${x}°`),
        "Compare with benchmarks: a square corner is 90°, a straight line is 180°, and three quarters of a full turn is 270°.",
        { type: "angle", degrees: deg },
      ),
    );
  }

  if (d < 3 || chance(0.5)) {
    const a = d === 1 ? randInt(2, 16) * 10 : randInt(15, 165);
    out.push(
      ask(
        `Two angles together make a straight line. One of them is ${a}°. What is the other angle?`,
        180 - a,
        "Angles that make a straight line add to 180°. Subtract the angle you know from 180°.",
        { suffix: "°", visual: { type: "angle", degrees: a } },
      ),
    );
  } else {
    let a: number, b: number, c: number;
    do {
      a = randInt(40, 140);
      b = randInt(40, 140);
      c = randInt(30, 120);
    } while (a + b + c < 220 || a + b + c > 330);
    out.push(
      ask(
        `Four angles meet at a point. Three of them are ${a}°, ${b}° and ${c}°. What is the fourth angle?`,
        360 - a - b - c,
        "Angles around a point make a full turn, 360°. Add the three you know, then subtract from 360°.",
        { suffix: "°" },
      ),
    );
  }

  {
    let a: number, b: number;
    do {
      a = d === 1 ? randInt(3, 20) * 5 : randInt(20, 110);
      b = d === 1 ? randInt(3, 20) * 5 : randInt(20, 110);
    } while (a + b > 165);
    out.push(
      ask(
        `Two angles of a triangle are ${a}° and ${b}°. What is the third angle?`,
        180 - a - b,
        "The three angles in any triangle add to 180°. Add the two you know, then subtract from 180°.",
        { suffix: "°", visual: { type: "shape", shape: "triangle" } },
      ),
    );
  }

  {
    const kind = pick(["isosceles", "scalene"]);
    let sides: number[];
    if (kind === "isosceles") {
      const s = randInt(4, 12);
      let t: number;
      do t = randInt(2, 2 * s - 1);
      while (t === s);
      sides = shuffle([s, s, t]);
    } else {
      do sides = sample(range(3, 15), 3).sort((x, y) => x - y);
      while (sides[0] + sides[1] <= sides[2]);
      sides = shuffle(sides);
    }
    out.push(
      choose(
        `A triangle has sides of ${sides[0]} cm, ${sides[1]} cm and ${sides[2]} cm. What type of triangle is it?`,
        kind,
        ["equilateral", "isosceles", "scalene"],
        "Classify by sides. Equilateral: all 3 sides equal. Isosceles: 2 sides equal. Scalene: no sides equal.",
      ),
    );
  }

  {
    const kind = pick(["acute", "right", "obtuse"]);
    let angles: number[];
    if (kind === "right") {
      const a = randInt(15, 75);
      angles = [90, a, 90 - a];
    } else if (kind === "obtuse") {
      const o = randInt(95, 150);
      const a = randInt(10, 180 - o - 10);
      angles = [o, a, 180 - o - a];
    } else {
      let a: number, b: number;
      do {
        a = randInt(35, 85);
        b = randInt(35, 85);
      } while (180 - a - b >= 90 || 180 - a - b < 10);
      angles = [a, b, 180 - a - b];
    }
    angles = shuffle(angles);
    out.push(
      choose(
        d === 3
          ? `Two angles of a triangle are ${angles[0]}° and ${angles[1]}°. Classify the triangle by its angles.`
          : `A triangle has angles of ${angles[0]}°, ${angles[1]}° and ${angles[2]}°. Classify it by its angles.`,
        `${kind} triangle`,
        ["acute triangle", "right triangle", "obtuse triangle"],
        `${d === 3 ? "First find the third angle: 180° minus the other two. " : ""}Acute: all angles less than 90°. Right: one angle is exactly 90°. Obtuse: one angle is more than 90°.`,
      ),
    );
  }

  {
    if (d === 1 && chance(0.5)) {
      out.push(
        ask(
          "All three angles of an equilateral triangle are equal. How many degrees is each angle?",
          60,
          "The angles of a triangle add to 180°. Share 180° equally among 3 angles.",
          { suffix: "°", visual: { type: "shape", shape: "triangle" } },
        ),
      );
    } else if (d === 3 && chance(0.5)) {
      const base = randInt(20, 85);
      out.push(
        ask(
          `Each base angle of an isosceles triangle is ${base}°. What is the third angle?`,
          180 - 2 * base,
          "The two base angles are equal. Add them, then subtract from 180°.",
          { suffix: "°", visual: { type: "shape", shape: "triangle" } },
        ),
      );
    } else {
      const top = randInt(5, 70) * 2;
      out.push(
        ask(
          `An isosceles triangle has two equal base angles. Its third angle is ${top}°. What is each base angle?`,
          (180 - top) / 2,
          "Subtract the third angle from 180°. The two equal base angles share what is left, so divide by 2.",
          { suffix: "°", visual: { type: "shape", shape: "triangle" } },
        ),
      );
    }
  }

  {
    const f = pick(TRIANGLE_FACTS);
    out.push(choose(f.prompt, f.right, f.wrong, f.hint, { type: "shape", shape: "triangle" }));
  }

  return shuffle(out);
}

// ---------- 10. Volume & Capacity ----------

const UNIT_CHOICES = [
  {
    thing: "the capacity of a bathtub",
    right: "litres (L)",
    wrong: ["millilitres (mL)", "centimetres (cm)", "kilograms (kg)"],
    hint: "Capacity is how much a container holds. A bathtub holds a lot of water, so use a big capacity unit.",
  },
  {
    thing: "a spoonful of medicine",
    right: "millilitres (mL)",
    wrong: ["litres (L)", "metres (m)", "kilograms (kg)"],
    hint: "A spoon holds a tiny amount of liquid, so use a small capacity unit.",
  },
  {
    thing: "the volume of a shoebox",
    right: "cubic centimetres (cm³)",
    wrong: ["cubic metres (m³)", "square centimetres (cm²)", "centimetres (cm)"],
    hint: "Volume is measured in cubic units. A shoebox is small enough for centimetre cubes.",
  },
  {
    thing: "the volume of a shipping container",
    right: "cubic metres (m³)",
    wrong: ["cubic centimetres (cm³)", "square metres (m²)", "millilitres (mL)"],
    hint: "Volume is measured in cubic units. A shipping container is huge, so use metre cubes.",
  },
];

function volumeCapacity(opts?: GenerateOptions): Question[] {
  const d = level(opts);
  const out: Question[] = [];

  {
    const hi = d === 1 ? 6 : 12;
    const dims = [randInt(2, hi), randInt(2, hi), randInt(2, hi)];
    if (d === 3) dims[0] = randInt(1, 6) + 0.5;
    if (d === 3 && (dims[0] * dims[1] * dims[2]) % 1 !== 0) dims[1] = randInt(1, 6) * 2;
    const [l, w, h] = dims;
    out.push(
      ask(
        `A rectangular prism is ${str(l)} cm long, ${w} cm wide and ${h} cm high. What is its volume?`,
        l * w * h,
        "Volume = length × width × height. Multiply two of the numbers first, then multiply by the third.",
        { keypad: "decimal", suffix: "cm³", visual: { type: "shape", shape: "rectangular-prism" } },
      ),
    );
  }

  {
    const rows = randInt(2, d === 1 ? 4 : 6);
    const cols = randInt(2, d === 1 ? 5 : 8);
    const layers = randInt(2, d === 1 ? 3 : 6);
    out.push(
      ask(
        `This is the bottom layer of a box packed with 1 cm cubes. The box is ${layers} layers high. What is the volume of the box?`,
        rows * cols * layers,
        "Find the number of cubes in one layer (rows × columns), then multiply by the number of layers.",
        { suffix: "cm³", visual: { type: "array", rows, cols, emoji: "🧊" } },
      ),
    );
  }

  {
    const toMl = d === 1 ? chance(0.7) : chance(0.5);
    const hint = "1 L = 1000 mL. To change litres to millilitres, multiply by 1000. To change millilitres to litres, divide by 1000.";
    if (toMl) {
      const L = d === 1 ? randInt(1, 9) : d === 2 ? randInt(1, 9) + pick([0.5, 0.25, 0.75]) : nonTen(101, 999) / 100;
      out.push(ask(`How many millilitres are in ${str(L)} L?`, L * 1000, hint, { suffix: "mL" }));
    } else {
      const mL = d === 1 ? randInt(1, 9) * 1000 : d === 2 ? randInt(1, 39) * 250 : pick([nonTen(1001, 9999), randInt(11, 99) * 10, nonTen(11, 99)]);
      out.push(ask(`Write ${mL} mL in litres.`, mL / 1000, hint, { keypad: "decimal", suffix: "L" }));
    }
  }

  {
    if (d === 1) {
      const l = randInt(3, 10), w = randInt(2, 6), h = randInt(2, 6);
      out.push(
        ask(
          `A small box is ${l} cm long, ${w} cm wide and ${h} cm high. 1 cm³ holds 1 mL. How many millilitres of water would fill it?`,
          l * w * h,
          "Find the volume in cm³ (length × width × height). Each cm³ holds 1 mL, so the number is the same.",
          { suffix: "mL" },
        ),
      );
    } else {
      const l = pick([10, 20, 30, 40, 50]);
      const w = pick([10, 20, 30]);
      const h = pick([10, 15, 20, 25, 30]);
      const V = l * w * h;
      out.push(
        ask(
          `A fish tank is ${l} cm long, ${w} cm wide and ${h} cm high. 1 cm³ holds 1 mL. How many litres of water does the full tank hold?`,
          V / 1000,
          "Find the volume in cm³, which equals the capacity in mL. Then divide by 1000 to change mL to litres.",
          { keypad: "decimal", suffix: "L", visual: { type: "shape", shape: "rectangular-prism" } },
        ),
      );
    }
  }

  {
    const hi = d === 1 ? 6 : d === 2 ? 10 : 15;
    const l = randInt(2, hi), w = randInt(2, hi), h = randInt(2, hi);
    out.push(
      ask(
        `A box has a volume of ${l * w * h} cm³. It is ${l} cm long and ${w} cm wide. How high is it?`,
        h,
        `Volume = length × width × height. The base is ${l} × ${w} = ${l * w} cm², so divide the volume by ${l * w}.`,
        { suffix: "cm", visual: { type: "shape", shape: "rectangular-prism" } },
      ),
    );
  }

  {
    const u = pick(UNIT_CHOICES);
    out.push(choose(`Which unit is best for measuring ${u.thing}?`, u.right, u.wrong, u.hint));
  }

  {
    const count = d === 1 ? 3 : 4;
    let boxes: number[][];
    let vols: number[];
    for (;;) {
      boxes = range(1, count).map(() => [randInt(2, 10), randInt(2, 10), randInt(2, 10)]);
      vols = boxes.map(([a, b, c]) => a * b * c);
      const best = Math.max(...vols);
      const labels = new Set(boxes.map((b) => b.join("x")));
      const close = d === 3 ? vols.every((v) => v === best || best - v <= 60) : true;
      if (vols.filter((v) => v === best).length === 1 && labels.size === count && close) break;
    }
    const labels = boxes.map(([a, b, c]) => `${a} cm × ${b} cm × ${c} cm`);
    const best = vols.indexOf(Math.max(...vols));
    out.push(
      choose(
        "Which box has the greatest volume?",
        labels[best],
        labels.filter((_, i) => i !== best),
        "Work out each volume (length × width × height), then compare. A box can be longer but still hold less.",
        { type: "shape", shape: "rectangular-prism" },
      ),
    );
  }

  {
    if (d === 3) {
      const bottle = pick([1500, 2000, 2500, 3000]);
      const glass = pick([150, 250, 300, 350]);
      const n = randInt(2, Math.floor(bottle / glass) - 1);
      out.push(
        ask(
          `A ${str(bottle / 1000)} L bottle of water is full. ${pick(NAMES)} pours ${n} glasses of ${glass} mL each. How many millilitres are left in the bottle?`,
          bottle - n * glass,
          `Change litres to millilitres first (× 1000). Then subtract ${n} × ${glass} mL.`,
          { suffix: "mL" },
        ),
      );
    } else {
      const glass = d === 1 ? pick([250, 500]) : pick([200, 250, 300, 500]);
      const n = d === 1 ? randInt(2, 8) : randInt(4, 12);
      const jugMl = glass * n;
      out.push(
        ask(
          `A jug holds ${str(jugMl / 1000)} L of lemonade. How many ${glass} mL glasses can it fill?`,
          n,
          `Change litres to millilitres (× 1000), then divide by ${glass}.`,
          { visual: { type: "emoji", emoji: "🍋", caption: `${str(jugMl / 1000)} L` } },
        ),
      );
    }
  }

  return shuffle(out);
}

// ---------- 11. Transformations ----------

const pt = (x: number, y: number): string => `(${x}, ${y})`;
const inGrid = (v: number) => v >= 0 && v <= 10;

function moveText(dx: number, dy: number): string {
  const parts: string[] = [];
  if (dx) parts.push(`${plural(Math.abs(dx), "unit")} ${dx > 0 ? "right" : "left"}`);
  if (dy) parts.push(`${plural(Math.abs(dy), "unit")} ${dy > 0 ? "up" : "down"}`);
  return parts.join(" and ");
}

const shortMove = (dx: number, dy: number): string =>
  `${Math.abs(dx)} ${dx >= 0 ? "right" : "left"}, ${Math.abs(dy)} ${dy >= 0 ? "up" : "down"}`;

const TRANSFORM_FACTS = [
  {
    prompt: "A shape slides 4 units left without turning or flipping. What is this transformation called?",
    right: "translation",
    wrong: ["reflection", "rotation"],
    hint: "A translation is a slide. A reflection is a flip. A rotation is a turn.",
  },
  {
    prompt: "A shape is flipped over a line to make its mirror image. What is this transformation called?",
    right: "reflection",
    wrong: ["translation", "rotation"],
    hint: "A translation is a slide. A reflection is a flip. A rotation is a turn.",
  },
  {
    prompt: "A shape makes a quarter turn around a fixed point. What is this transformation called?",
    right: "rotation",
    wrong: ["translation", "reflection"],
    hint: "A translation is a slide. A reflection is a flip. A rotation is a turn.",
  },
  {
    prompt: "A shape is translated, then reflected, then rotated. How does the final image compare with the original?",
    right: "Same size and shape (congruent)",
    wrong: ["Twice as big", "Half the size", "Same size but a different shape"],
    hint: "Slides, flips and turns move a shape around, but they never stretch or shrink it.",
  },
];

function transformations(opts?: GenerateOptions): Question[] {
  const d = level(opts);
  const out: Question[] = [];

  {
    let x: number, y: number;
    do {
      x = randInt(1, 9);
      y = randInt(1, 9);
    } while (x === y);
    out.push(
      choose(
        "What are the coordinates of point A?",
        pt(x, y),
        shuffle([pt(y, x), pt(x, y + 1), pt(x - 1, y), pt(x + 1, y - 1)]),
        "Start at (0, 0). Go across to find x first, then up to find y. Write them as (x, y).",
        { type: "grid", size: 10, points: [{ x, y, label: "A" }] },
        3,
      ),
    );
  }

  {
    let x: number, y: number, dx: number, dy: number;
    do {
      x = randInt(1, 9);
      y = randInt(1, 9);
      dx = d === 1 ? randInt(1, 5) : pick([-1, 1]) * randInt(1, 5);
      dy = d === 1 ? randInt(1, 5) : pick([-1, 1]) * randInt(1, 5);
    } while (!inGrid(x + dx) || !inGrid(y + dy) || dx === dy);
    const wrong = [
      [x + dy, y + dx],
      [x - dx, y - dy],
      [x + dx, y - dy],
      [x - dx, y + dy],
      [x + dx + 1, y + dy],
    ]
      .filter(([a, b]) => a >= 0 && b >= 0)
      .map(([a, b]) => pt(a, b));
    out.push(
      choose(
        `Point P is translated ${moveText(dx, dy)}. Where is its image, P′?`,
        pt(x + dx, y + dy),
        shuffle(wrong),
        "Move across first: right adds to x and left subtracts. Then move up (add to y) or down (subtract from y).",
        { type: "grid", size: 10, points: [{ x, y, label: "P" }] },
        3,
      ),
    );
  }

  {
    let pts: { x: number; y: number }[];
    let dx: number, dy: number;
    for (;;) {
      pts = [
        { x: randInt(1, 4), y: randInt(1, 4) },
        { x: randInt(4, 7), y: randInt(1, 4) },
        { x: randInt(2, 6), y: randInt(5, 8) },
      ];
      dx = pick([-1, 1]) * randInt(1, 3);
      dy = pick([-1, 1]) * randInt(1, 3);
      if (pts.every((p) => inGrid(p.x + dx) && inGrid(p.y + dy))) break;
    }
    const B = pts[1];
    const axis = pick(["x", "y"]);
    out.push(
      ask(
        `Triangle ABC is translated ${moveText(dx, dy)}. What is the ${axis}-coordinate of B′?`,
        axis === "x" ? B.x + dx : B.y + dy,
        axis === "x"
          ? "Read B's x-coordinate. Moving right adds to x; moving left subtracts. Up and down don't change x."
          : "Read B's y-coordinate. Moving up adds to y; moving down subtracts. Left and right don't change y.",
        { visual: { type: "grid", size: 10, points: pts.map((p, i) => ({ ...p, label: "ABC"[i] })) } },
      ),
    );
  }

  {
    let m: number, x: number, y: number;
    do {
      m = randInt(3, 7);
      x = randInt(0, 10);
      y = randInt(1, 9);
    } while (x === m || !inGrid(2 * m - x));
    const img = 2 * m - x;
    const line = range(0, 10).map((k) => ({ x: m, y: k }));
    out.push(
      choose(
        `Reflect point P in the vertical mirror line x = ${m} (the dotted line). Where is its image, P′?`,
        pt(img, y),
        shuffle([pt(x, 2 * m - y), pt(img + 1, y), pt(img - 1, y), pt(y, img), pt(x + (m - x), y)]),
        `Count how far P is from the mirror line. The image is the same distance on the other side. In a vertical mirror line, the y-coordinate stays the same.`,
        { type: "grid", size: 10, points: [...line, { x, y, label: "P" }] },
        3,
      ),
    );
  }

  {
    let m: number, x: number, y: number;
    do {
      m = randInt(3, 7);
      x = randInt(1, 9);
      y = randInt(0, 10);
    } while (y === m || !inGrid(2 * m - y));
    const line = range(0, 10).map((k) => ({ x: k, y: m }));
    out.push(
      ask(
        `Point Q is reflected in the horizontal mirror line y = ${m} (the dotted line). What is the y-coordinate of Q′?`,
        2 * m - y,
        `Count how far Q is ${y < m ? "below" : "above"} the line. Q′ is the same distance on the other side. The x-coordinate doesn't change.`,
        { visual: { type: "grid", size: 10, points: [...line, { x, y, label: "Q" }] } },
      ),
    );
  }

  {
    let x: number, y: number;
    do {
      x = randInt(1, 9);
      y = randInt(1, 9);
    } while ((x === 5 && y === 5) || x === y || x + y === 10);
    const turn = d === 1 ? "180°" : pick(["90° clockwise", "90° counterclockwise", "180°"]);
    const cw = pt(y, 10 - x);
    const ccw = pt(10 - y, x);
    const half = pt(10 - x, 10 - y);
    const right = turn === "180°" ? half : turn === "90° clockwise" ? cw : ccw;
    out.push(
      choose(
        `Rotate point P ${turn} around the centre C(5, 5). Where does P land?`,
        right,
        shuffle([cw, ccw, half, pt(10 - x, y), pt(y, x)]),
        turn === "180°"
          ? "In a half turn, P ends up on the opposite side of C at the same distance: if P is 2 right and 3 up from C, its image is 2 left and 3 down."
          : `Picture a line from C to P and turn it a quarter turn ${turn.replace("90° ", "")}. ${
              turn === "90° clockwise"
                ? "Clockwise, a point above C moves to the right of C, and a point right of C moves below it."
                : "Counterclockwise, a point above C moves to the left of C, and a point right of C moves above it."
            }`,
        {
          type: "grid",
          size: 10,
          points: [
            { x: 5, y: 5, label: "C" },
            { x, y, label: "P" },
          ],
        },
        3,
      ),
    );
  }

  if (d === 1) {
    let dx1: number, dy1: number, dx2: number, dy2: number;
    do {
      dx1 = pick([-1, 1]) * randInt(1, 5);
      dy1 = pick([-1, 1]) * randInt(1, 5);
      dx2 = pick([-1, 1]) * randInt(1, 5);
      dy2 = pick([-1, 1]) * randInt(1, 5);
    } while (dx1 + dx2 === 0 || dy1 + dy2 === 0 || dx1 === dx2 || dy1 === dy2);
    const dx = dx1 + dx2;
    const dy = dy1 + dy2;
    out.push(
      choose(
        `A shape is translated ${moveText(dx1, dy1)}, then ${moveText(dx2, dy2)}. Which single translation does the same thing?`,
        shortMove(dx, dy),
        shuffle([shortMove(dx1 - dx2, dy1 - dy2), shortMove(dy, dx), shortMove(-dx, dy), shortMove(dx, -dy)]),
        "Combine the left–right moves and the up–down moves separately. Count right and up as +, left and down as −.",
        undefined,
        3,
      ),
    );
  } else {
    let x: number, y: number, dx: number, dy: number, m: number;
    for (;;) {
      x = randInt(1, 9);
      y = randInt(1, 8);
      dx = pick([-1, 1]) * randInt(1, 3);
      dy = randInt(1, 2);
      m = randInt(3, 7);
      const tx = x + dx;
      if (inGrid(tx) && inGrid(y + dy) && inGrid(2 * m - tx) && inGrid(2 * m - x + dx) && tx !== m && x !== m) break;
    }
    const tx = x + dx;
    const fx = 2 * m - tx;
    const line = range(0, 10).map((k) => ({ x: m, y: k }));
    const prompt = `Point P${pt(x, y)} is translated ${moveText(dx, dy)}, then reflected in the mirror line x = ${m}.`;
    const hint = `Do one step at a time. After the translation P is at ${pt(tx, y + dy)}. Then reflect: the y-coordinate stays the same, and the new x is the same distance on the other side of x = ${m}.`;
    const visual: Visual = { type: "grid", size: 10, points: [...line, { x, y, label: "P" }] };
    if (d === 3) {
      out.push(ask(`${prompt} What is the x-coordinate of its final image?`, fx, hint, { visual }));
    } else {
      out.push(
        choose(
          `${prompt} Where does it end up?`,
          pt(fx, y + dy),
          shuffle([pt(tx, y + dy), pt(2 * m - x + dx, y + dy), pt(2 * m - x, y), pt(fx, y)]),
          hint,
          visual,
          3,
        ),
      );
    }
  }

  {
    const f = pick(TRANSFORM_FACTS);
    out.push(choose(f.prompt, f.right, f.wrong, f.hint));
  }

  return shuffle(out);
}

// ---------- 12. Probability ----------

const COLOURS = [
  { name: "red", hex: "#ef4444", emoji: "🔴" },
  { name: "blue", hex: "#3b82f6", emoji: "🔵" },
  { name: "green", hex: "#22c55e", emoji: "🟢" },
  { name: "yellow", hex: "#facc15", emoji: "🟡" },
  { name: "purple", hex: "#a855f7", emoji: "🟣" },
];

const isPrime = (n: number) => n > 1 && range(2, n - 1).every((f) => n % f !== 0);

const DIE_EVENTS: { text: string; test: (n: number) => boolean }[] = [
  { text: "an even number", test: (n) => n % 2 === 0 },
  { text: "a number greater than 4", test: (n) => n > 4 },
  { text: "a multiple of 3", test: (n) => n % 3 === 0 },
  { text: "a number less than 3", test: (n) => n < 3 },
  { text: "a prime number", test: isPrime },
  { text: "a 5", test: (n) => n === 5 },
  { text: "a multiple of 4", test: (n) => n % 4 === 0 },
];

const SCALE_CHOICES = {
  impossible: "0 (impossible)",
  unlikely: "Close to 0 (unlikely)",
  even: "1/2 (equally likely)",
  likely: "Close to 1 (likely)",
  certain: "1 (certain)",
};
type Scale = keyof typeof SCALE_CHOICES;

const SCALE_EVENTS: { text: string; answer: Scale }[] = [
  { text: "rolling a 7 on a standard die numbered 1 to 6", answer: "impossible" },
  { text: "picking a green marble from a bag of only red marbles", answer: "impossible" },
  { text: "rolling a number less than 7 on a standard die", answer: "certain" },
  { text: "picking a red marble from a bag of only red marbles", answer: "certain" },
  { text: "flipping a fair coin and getting heads", answer: "even" },
  { text: "rolling an even number on a standard die", answer: "even" },
  { text: "spinning red on a spinner with 1 red section and 9 blue sections", answer: "unlikely" },
  { text: "rolling a 1 on a 20-sided die", answer: "unlikely" },
  { text: "picking a blue marble from a bag with 9 blue marbles and 1 red marble", answer: "likely" },
  { text: "rolling a number greater than 1 on a standard die", answer: "likely" },
];

function probability(opts?: GenerateOptions): Question[] {
  const d = level(opts);
  const out: Question[] = [];
  const name = pick(NAMES);

  const spinner = (n: number, k: number) => {
    const [t, o1, o2] = sample(COLOURS, 3);
    const rest = n - k;
    const a = randInt(1, rest - 1);
    const segments = shuffle([...Array<string>(k).fill(t.hex), ...Array<string>(a).fill(o1.hex), ...Array<string>(rest - a).fill(o2.hex)]);
    return { target: t, segments };
  };

  {
    const n = pick(d === 1 ? [4, 6] : d === 2 ? [6, 8, 10] : [8, 10, 12]);
    const k = randInt(1, n - 2);
    const s = spinner(n, k);
    out.push(
      ask(
        `The spinner has ${n} equal sections. What is the probability of landing on ${s.target.name}?`,
        `${k}/${n}`,
        `Probability = favourable outcomes ÷ total outcomes. Count the ${s.target.name} sections and write that number over ${n}.`,
        { keypad: "fraction", accept: fracForms(k, n), visual: { type: "spinner", segments: s.segments } },
      ),
    );
  }

  {
    const sides = d === 3 ? pick([10, 12]) : 6;
    const events = DIE_EVENTS.filter((e) => {
      const c = range(1, sides).filter(e.test).length;
      return c > 0 && c < sides;
    });
    const ev = pick(events);
    const hits = range(1, sides).filter(ev.test);
    out.push(
      ask(
        `You roll a fair ${sides}-sided die numbered 1 to ${sides}. What is the probability of rolling ${ev.text}?`,
        `${hits.length}/${sides}`,
        `List the outcomes that work: ${hits.join(", ")}. Write how many there are over the ${sides} equally likely outcomes.`,
        { keypad: "fraction", accept: fracForms(hits.length, sides) },
      ),
    );
  }

  {
    const cols = sample(COLOURS, 3);
    const counts = cols.map(() => randInt(1, d === 3 ? 15 : 9));
    const total = counts.reduce((s, c) => s + c, 0);
    const i = randInt(0, 2);
    const ci = counts[i];
    const j = (i + 1) % 3;
    const cands: [number, number][] = [
      [ci, total - ci],
      [1, 3],
      [counts[j], total],
      [total - ci, total],
    ];
    out.push(
      choose(
        `A bag holds the marbles in the table. You pick one without looking. What is the probability it is ${cols[i].name}?`,
        `${ci}/${total}`,
        shuffle(cands.filter(([a, b]) => b > 0 && !sameRatio(a, b, ci, total)).map(([a, b]) => `${a}/${b}`)),
        "Probability = marbles of that colour ÷ all the marbles. Add up every marble in the table to find the total first.",
        {
          type: "table",
          title: "Marbles in the bag",
          headers: ["Colour", "Number"],
          rows: cols.map((c, k) => [`${c.emoji} ${c.name}`, counts[k]]),
        },
        3,
      ),
    );
  }

  {
    const N = pick(d === 1 ? [10, 20] : d === 2 ? [20, 25, 40, 50] : [40, 50, 60, 80]);
    const h = randInt(Math.ceil(N * 0.2), Math.floor(N * 0.8));
    const ctx = pick([
      `${name} flips a coin ${N} times and gets heads ${h} times. What is the experimental probability of heads?`,
      `${name} takes ${N} basketball free throws and makes ${h} of them. What is the experimental probability of making a shot?`,
      `A spinner lands on blue ${h} times in ${N} spins. What is the experimental probability of landing on blue?`,
    ]);
    out.push(
      ask(ctx, `${h}/${N}`, "Experimental probability = number of times it happened ÷ total number of trials.", {
        keypad: "fraction",
        accept: fracForms(h, N),
      }),
    );
  }

  {
    const n = pick([4, 5, 6, 8, 10]);
    const k = randInt(1, Math.min(3, n - 2));
    const T = n * randInt(d === 1 ? 2 : 4, d === 3 ? 30 : 12);
    const s = spinner(n, k);
    out.push(
      ask(
        `If you spin this spinner ${T} times, about how many times would you expect it to land on ${s.target.name}?`,
        (T * k) / n,
        `The theoretical probability of ${s.target.name} is ${s.target.name} sections ÷ ${n}. Find that fraction of ${T}: divide ${T} by ${n}, then multiply by the number of ${s.target.name} sections.`,
        { visual: { type: "spinner", segments: s.segments } },
      ),
    );
  }

  {
    const N = pick([20, 30, 40, 50]);
    const h = N / 2 + pick([-4, -3, -2, 2, 3, 4]);
    const higher = h > N / 2;
    out.push(
      choose(
        `${name} flips a fair coin ${N} times and gets ${h} heads. Which statement is true?`,
        `The experimental probability of heads (${h}/${N}) is ${higher ? "higher" : "lower"} than the theoretical probability (1/2).`,
        [
          `The experimental probability of heads (${h}/${N}) is ${higher ? "lower" : "higher"} than the theoretical probability (1/2).`,
          "The coin must be unfair.",
          `The theoretical probability of heads is ${h}/${N}.`,
          `The next flip is more likely to be ${higher ? "tails" : "heads"}.`,
        ],
        "Theoretical probability comes from equally likely outcomes: heads is 1 of 2. Experimental probability comes from real results, which often differ a little, especially with fewer trials.",
        undefined,
        3,
      ),
    );
  }

  {
    const e = pick(SCALE_EVENTS);
    out.push(
      choose(
        `Where does this event belong on a probability line from 0 to 1: ${e.text}?`,
        SCALE_CHOICES[e.answer],
        (Object.keys(SCALE_CHOICES) as Scale[]).filter((k) => k !== e.answer).map((k) => SCALE_CHOICES[k]),
        "0 means it can never happen and 1 means it is certain. 1/2 means it is just as likely to happen as not.",
        { type: "numberLine", min: 0, max: 1, step: 0.25, labelEvery: 0.5 },
      ),
    );
  }

  {
    const cols = sample(COLOURS, d === 1 ? 3 : 4);
    const N = pick([40, 50, 60]);
    let counts: number[];
    for (;;) {
      counts = cols.map(() => randInt(3, 25));
      const best = Math.max(...counts);
      const diffOk = counts.filter((c) => c !== best).every((c) => best - c >= (d === 3 ? 2 : 5));
      if (counts.filter((c) => c === best).length === 1 && diffOk && counts.reduce((s, c) => s + c, 0) <= N) break;
    }
    const total = counts.reduce((s, c) => s + c, 0);
    const best = counts.indexOf(Math.max(...counts));
    out.push(
      choose(
        `A mystery spinner was spun ${total} times. Based on these results, which colour probably covers the most space on the spinner?`,
        cols[best].name,
        cols.filter((_, i) => i !== best).map((c) => c.name),
        "The colour that comes up most often over many trials probably has the biggest section. More trials make the prediction more reliable.",
        { type: "bars", title: "Spinner results", bars: cols.map((c, i) => ({ label: c.name, value: counts[i], emoji: c.emoji })) },
      ),
    );
  }

  return shuffle(out);
}

// ---------- Course ----------

export const course: Course = {
  grade: "6",
  subject: "math",
  bigIdeas: {
    "ca-bc": [
      "Mixed numbers and decimal numbers represent quantities that can be decomposed into parts and wholes.",
      "Computational fluency and flexibility with numbers extend to operations with whole numbers and decimals.",
      "Linear relations can be identified and represented using expressions with variables and line graphs and can be used to form generalizations.",
      "Properties of objects and shapes can be described, measured, and compared using volume, area, perimeter, and angles.",
      "Data from the results of an experiment can be used to predict the theoretical probability of an event and to compare and interpret.",
    ],
  },
  units: [
    {
      id: "thousandths-to-billions",
      title: "Thousandths to Billions",
      emoji: "🔭",
      blurb: "Place value, tiny to huge",
      standards: { "ca-bc": "Small to large numbers (thousandths to billions)" },
      parentNote:
        "Reading, writing, comparing and rounding numbers from thousandths (0.001) up to billions, including multiplying and dividing by 10, 100 and 1000.",
      generate: placeValue,
    },
    {
      id: "facts-and-factors",
      title: "Facts & Factors",
      emoji: "✖️",
      blurb: "Facts, primes, GCF and LCM",
      standards: {
        "ca-bc":
          "Multiplication and division facts to 100 (developing computational fluency); factors and multiples — greatest common factor and least common multiple",
      },
      parentNote:
        "Quick recall of multiplication and division facts, plus factors, multiples and prime numbers, the greatest common factor (GCF) and least common multiple (LCM), and word problems that use them.",
      generate: factsFactors,
    },
    {
      id: "mixed-numbers-and-ratios",
      title: "Mixed Numbers & Ratios",
      emoji: "🍕",
      blurb: "Improper fractions and ratios",
      standards: { "ca-bc": "Improper fractions and mixed numbers; introduction to ratios" },
      parentNote:
        "Switching between improper fractions (like 13/5) and mixed numbers (2 3/5), placing them on a number line, and writing and using ratios such as 3:4 in tables and word problems.",
      generate: mixedRatios,
    },
    {
      id: "decimal-multiply-divide",
      title: "Decimal × and ÷",
      emoji: "🧮",
      blurb: "Multiply and divide decimals",
      standards: { "ca-bc": "Multiplication and division of decimals" },
      parentNote:
        "Multiplying and dividing decimals, estimating to check where the decimal point goes, and solving shopping and measurement problems.",
      generate: decimalOps,
    },
    {
      id: "percents-and-budgets",
      title: "Percents & Budgets",
      emoji: "🏷️",
      blurb: "Discounts, deals and saving",
      standards: {
        "ca-bc": "Whole-number percents and percentage discounts; financial literacy — simple budgeting and consumer math",
      },
      parentNote:
        "Finding percents of amounts, working out sale prices and savings, comparing unit prices to find the better buy, and planning a simple budget and savings goal.",
      generate: percentsBudgets,
    },
    {
      id: "patterns-and-graphs",
      title: "Patterns & Graphs",
      emoji: "📈",
      blurb: "Rules, tables and line graphs",
      standards: {
        "ca-bc":
          "Increasing and decreasing patterns, using expressions, tables, and graphs as functional relationships; line graphs",
      },
      parentNote:
        "Describing growing and shrinking patterns with rules like 3n + 2, using tables and graphs to predict values, and reading change over time from line graphs.",
      generate: patternsGraphs,
    },
    {
      id: "equations",
      title: "Equations",
      emoji: "⚖️",
      blurb: "Order of operations, solve for n",
      standards: {
        "ca-bc": "One-step equations with whole-number coefficients and solutions; order of operations with whole numbers",
      },
      parentNote:
        "Using the order of operations (brackets, then × and ÷, then + and −) and solving one-step equations like 6n = 42 with inverse operations, including writing equations for word problems.",
      generate: equations,
    },
    {
      id: "perimeter-and-area",
      title: "Perimeter & Area",
      emoji: "📐",
      blurb: "Triangles, parallelograms, trapezoids",
      standards: { "ca-bc": "Perimeter of complex shapes; area of triangles, parallelograms, and trapezoids" },
      parentNote:
        "Finding the perimeter of L-shapes and other polygons, and the area of triangles (b × h ÷ 2), parallelograms (b × h) and trapezoids ((a + b) × h ÷ 2), including working backwards to a missing measurement.",
      generate: perimeterArea,
    },
    {
      id: "angles-and-triangles",
      title: "Angles & Triangles",
      emoji: "🔺",
      blurb: "Measure, classify, find missing angles",
      standards: { "ca-bc": "Angle measurement and classification; triangles" },
      parentNote:
        "Estimating and classifying angles (acute, right, obtuse, straight, reflex), finding missing angles on a line and in triangles, and classifying triangles by their sides and angles.",
      generate: anglesTriangles,
    },
    {
      id: "volume-and-capacity",
      title: "Volume & Capacity",
      emoji: "🧊",
      blurb: "Cubes, litres and millilitres",
      standards: { "ca-bc": "Volume and capacity" },
      parentNote:
        "Finding the volume of rectangular prisms, converting between litres and millilitres, and connecting volume to capacity (1 cm³ holds 1 mL).",
      generate: volumeCapacity,
    },
    {
      id: "transformations",
      title: "Transformations",
      emoji: "🔄",
      blurb: "Slide, flip and turn",
      standards: { "ca-bc": "Combinations of transformations" },
      parentNote:
        "Translating, reflecting and rotating points and shapes on a coordinate grid, and combining two transformations in a row.",
      generate: transformations,
    },
    {
      id: "probability",
      title: "Probability",
      emoji: "🎲",
      blurb: "Theoretical and experimental chance",
      standards: { "ca-bc": "Single-outcome probability, both theoretical and experimental" },
      parentNote:
        "Writing probabilities as fractions for spinners, dice and marbles, comparing theoretical probability with experimental results, and making predictions from data.",
      generate: probability,
    },
  ],
};
