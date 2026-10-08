import { chance, nearbyNumbers, pick, randInt, sample, shuffle, textChoice } from "../../random";
import { sortQuestion, type SortSet } from "../../bank";
import { formatMoney } from "../../money";
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

/** 1 = easier, 2 = on grade level, 3 = stretch. */
const levelOf = (opts?: GenerateOptions): Level => opts?.difficulty ?? 2;

const eq = (text: string): Visual => ({ type: "equation", text });

function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

function repeat<T>(item: T, n: number): T[] {
  return Array.from({ length: n }, () => item);
}

/** "1 ten", "3 tens". */
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** "A" or "An" to start a sentence with this word. */
const capArticle = (word: string) => (/^[aeiou]/i.test(word) ? "An" : "A");

const cap = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

const NAMES = ["Maya", "Jay", "Sam", "Amir", "Lena", "Kenji", "Zoe", "Ravi", "Ana", "Noah", "Priya", "Leo", "Mila", "Omar", "Sofia", "Eli"];

function typeIn(
  prompt: string,
  answer: number | string,
  hint: string,
  visual?: Visual,
  extra: Pick<InputQuestion, "suffix" | "keypad" | "accept"> = {},
): InputQuestion {
  return { kind: "input", prompt, hint, visual, answer: String(answer), keypad: "number", ...extra };
}

interface NumOpts {
  /** How each number is shown on its button. */
  fmt?: (n: number) => string;
  min?: number;
  max?: number;
  count?: number;
}

/**
 * A number question with believable wrong answers. `likely` lists mistakes
 * children often make (most useful first); nearby numbers fill any gaps.
 */
function numChoice(
  prompt: string,
  answer: number,
  likely: number[],
  hint: string,
  visual?: Visual,
  opts: NumOpts = {},
): ChoiceQuestion {
  const { fmt = String, min = 0, max = Math.max(answer * 2, answer + 20), count = 4 } = opts;
  const wrong: number[] = [];
  const add = (n: number) => {
    if (wrong.length < count - 1 && Number.isInteger(n) && n !== answer && n >= min && n <= max && !wrong.includes(n)) {
      wrong.push(n);
    }
  };
  likely.forEach(add);
  nearbyNumbers(answer, count + 4, min, max).forEach(add);
  return {
    kind: "choice",
    prompt,
    hint,
    visual,
    answer: String(answer),
    choices: shuffle([answer, ...wrong]).map((n) => ({ id: String(n), label: fmt(n) })),
  };
}

type Opt = { label: string; emoji?: string; shape?: ShapeName; coin?: number };

/** Multiple choice from labelled options. Drops wrong options that repeat a label, and keeps at most `count` choices. */
function pickOne(
  prompt: string,
  right: Opt | string,
  wrong: (Opt | string)[],
  hint: string,
  visual?: Visual,
  count = 4,
): ChoiceQuestion {
  const label = (o: Opt | string) => (typeof o === "string" ? o : o.label);
  const seen = new Set([label(right)]);
  const keep: (Opt | string)[] = [];
  for (const w of wrong) {
    if (keep.length >= count - 1) break;
    if (!seen.has(label(w))) {
      seen.add(label(w));
      keep.push(w);
    }
  }
  return textChoice(prompt, right, keep, hint, visual);
}

/** What makes two questions "the same" for a child: the prompt and the picture. */
function questionKey(q: Question): string {
  return `${q.prompt}#${JSON.stringify(q.visual ?? null)}`;
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

/** "4, 8, 12" — counting by `step`, `times` times. */
function skipList(step: number, times: number): string {
  return Array.from({ length: times }, (_, i) => (i + 1) * step).join(", ");
}

/** Explain a × b by skip counting with the friendlier number. */
function skipHint(a: number, b: number): string {
  const easy = (n: number) => n === 2 || n === 5 || n === 10;
  if (!easy(b) && (easy(a) || a < b)) {
    return `Turn it around: ${a} × ${b} = ${b} × ${a}. Count by ${a}s ${b} times: ${skipList(a, b)}.`;
  }
  return `Count by ${b}s ${a} times: ${skipList(b, a)}.`;
}

// =====================================================================
// Numbers to 1000
// =====================================================================

const digitsOf = (n: number) => ({ h: Math.floor(n / 100), t: Math.floor((n % 100) / 10), o: n % 10 });

function placeWords(n: number): string {
  const { h, t, o } = digitsOf(n);
  return `${plural(h, "hundred")}, ${plural(t, "ten")} and ${plural(o, "one")}`;
}

function threeDigit(d: Level): number {
  if (d === 1) return randInt(1, 4) * 100 + randInt(1, 9) * 10 + randInt(1, 9);
  if (d === 2) return randInt(1, 9) * 100 + randInt(1, 9) * 10 + randInt(0, 9);
  // Stretch: a zero in the tens or the ones place.
  return chance(0.5) ? randInt(1, 9) * 100 + randInt(1, 9) : randInt(1, 9) * 100 + randInt(1, 9) * 10;
}

function buildHundreds(d: Level): Question {
  const n = threeDigit(d);
  const { t, o } = digitsOf(n);
  return {
    kind: "build",
    prompt: `Build the number ${n}.`,
    hint: `${n} is ${placeWords(n)}.${t === 0 || o === 0 ? " A 0 means you don't need any of that block." : ""}`,
    target: n,
    hundreds: true,
  };
}

function readBlocks(d: Level): Question {
  const h = randInt(1, d === 1 ? 4 : d === 2 ? 9 : 7);
  const t = d === 3 ? randInt(10, 14) : randInt(0, 9);
  const o = randInt(d === 1 ? 1 : 0, 9);
  const n = h * 100 + t * 10 + o;
  const visual: Visual = { type: "blocks", hundreds: h, tens: t, ones: o };
  const prompt = "What number do the blocks show?";
  if (d === 3) {
    return typeIn(
      prompt,
      n,
      `There are ${t} tens. 10 tens make a hundred, so ${t} tens is ${t * 10}. Then ${h * 100} + ${t * 10} + ${o} = ${n}.`,
      visual,
    );
  }
  const hint = `Count the big squares by 100s, the long rods by 10s and the small cubes by 1s: ${h * 100} + ${t * 10} + ${o} = ${n}.`;
  if (d === 2) return typeIn(prompt, n, hint, visual);
  return numChoice(prompt, n, [h * 100 + o * 10 + t, n + 10, n - 10, n + 100, n - 100], hint, visual, {
    min: 100,
    max: 999,
  });
}

function digitWorth(d: Level): Question {
  const [a, b, c] = sample(range(1, 9), 3);
  const n = a * 100 + b * 10 + c;
  const place = d === 1 ? 10 : d === 2 ? pick([100, 10]) : pick([100, 10, 1]);
  const digit = place === 100 ? a : place === 10 ? b : c;
  const placeName = place === 100 ? "hundreds" : place === 10 ? "tens" : "ones";
  return pickOne(
    `In ${n}, what is the ${digit} worth?`,
    String(digit * place),
    [100, 10, 1].filter((p) => p !== place).map((p) => String(digit * p)),
    `The ${digit} is in the ${placeName} place, so it is worth ${plural(digit, placeName.slice(0, -1), placeName)}: ${digit * place}.`,
    eq(String(n)),
  );
}

function expandedForm(d: Level): Question {
  const prompt = "What number is this?";
  if (d === 3) {
    const h = randInt(1, 8);
    const t = randInt(10, 15);
    const o = randInt(1, 9);
    const n = h * 100 + t * 10 + o;
    return typeIn(
      `What number is ${plural(h, "hundred")}, ${t} tens and ${plural(o, "one")}?`,
      n,
      `${t} tens is ${t * 10}. So ${h * 100} + ${t * 10} + ${o} = ${n}.`,
    );
  }
  const h = randInt(1, d === 1 ? 4 : 9);
  const t = randInt(1, 9);
  const o = randInt(1, 9);
  if (d === 2 && chance(0.5)) {
    const noTens = chance(0.5);
    const n = noTens ? h * 100 + o : h * 100 + t * 10;
    const other = noTens ? o : t * 10;
    const missing = noTens ? "tens" : "ones";
    return typeIn(
      prompt,
      n,
      `There are no ${missing}, so put a 0 in the ${missing} place: ${n}.`,
      eq(`${h * 100} + ${other} = ?`),
    );
  }
  const n = h * 100 + t * 10 + o;
  const parts = d === 2 ? shuffle([h * 100, t * 10, o]) : [h * 100, t * 10, o];
  return typeIn(
    prompt,
    n,
    `${h * 100} is ${plural(h, "hundred")}, ${t * 10} is ${plural(t, "ten")} and ${o} is ${plural(o, "one")}. Put each digit in its place: ${n}.`,
    eq(`${parts.join(" + ")} = ?`),
  );
}

function compareSign(d: Level): Question {
  let a: number, b: number;
  if (d === 1) {
    const [h1, h2] = sample(range(1, 9), 2);
    a = h1 * 100 + randInt(0, 99);
    b = h2 * 100 + randInt(0, 99);
  } else if (d === 2) {
    const h = randInt(1, 9);
    const [t1, t2] = sample(range(0, 9), 2);
    a = h * 100 + t1 * 10 + randInt(0, 9);
    b = h * 100 + t2 * 10 + randInt(0, 9);
  } else {
    const base = randInt(1, 9) * 100 + randInt(0, 9) * 10;
    a = base + randInt(0, 9);
    b = chance(0.25) ? a : base + randInt(0, 9);
  }
  const sign = a < b ? "<" : a > b ? ">" : "=";
  const why =
    d === 1
      ? "Look at the hundreds first. More hundreds means a bigger number."
      : d === 2
        ? "The hundreds are the same, so compare the tens."
        : "The hundreds and tens are the same, so compare the ones.";
  return {
    kind: "choice",
    prompt: "Which sign goes in the box?",
    hint:
      sign === "="
        ? `Both numbers are ${a}, so they are equal.`
        : `${why} The open side of < or > faces the bigger number, ${Math.max(a, b)}.`,
    visual: eq(`${a} ☐ ${b}`),
    answer: sign,
    choices: [
      { id: "<", label: "<" },
      { id: "=", label: "=" },
      { id: ">", label: ">" },
    ],
  };
}

function orderNumbers(d: Level): Question {
  let nums: number[];
  if (d === 1) {
    nums = sample(range(1, 9), 3).map((h) => h * 100 + randInt(0, 99));
  } else if (d === 2) {
    const h = randInt(1, 8);
    nums = sample(range(h * 100, h * 100 + 199), 4);
  } else {
    // The same three digits in different orders.
    const [x, y, z] = sample(range(1, 9), 3);
    const perms = [
      [x, y, z],
      [x, z, y],
      [y, x, z],
      [y, z, x],
      [z, x, y],
      [z, y, x],
    ];
    nums = sample(perms, 4).map(([p, q, r]) => p * 100 + q * 10 + r);
  }
  nums.sort((m, n) => m - n);
  const down = d === 3;
  const list = down ? [...nums].reverse() : nums;
  return {
    kind: "order",
    prompt: down ? "Tap the numbers from biggest to smallest." : "Tap the numbers from smallest to biggest.",
    hint: down
      ? `These numbers use the same digits! Compare the hundreds first, then the tens. The biggest is ${list[0]}.`
      : `Compare the hundreds first, then the tens, then the ones. The smallest is ${list[0]}.`,
    items: list.map((n) => ({ id: String(n), label: String(n) })),
  };
}

function numberLineSpot(d: Level): Question {
  const prompt = "What number goes where the ? is?";
  if (d === 2 && chance(0.5)) {
    const n = pick([100, 200, 300, 400, 600, 700, 800, 900]);
    return numChoice(
      prompt,
      n,
      [n + 100, n - 100, n + 200, n - 200],
      `Each mark is 100 more than the one before. Count by 100s from ${n < 500 ? 0 : 500}.`,
      { type: "numberLine", min: 0, max: 1000, step: 100, labelEvery: 500, blankAt: n },
      { min: 0, max: 1000 },
    );
  }
  const start = randInt(1, 8) * 100;
  const step = d === 3 ? 5 : 10;
  let n: number;
  do n = start + randInt(1, 100 / step - 1) * step;
  while (n % 50 === 0);
  return numChoice(
    prompt,
    n,
    [n + step, n - step, n + 2 * step, n - 2 * step],
    `The labels go up by 50, and each small mark is ${step} more. Count by ${step}s from ${Math.floor(n / 50) * 50}.`,
    { type: "numberLine", min: start, max: start + 100, step, labelEvery: 50, blankAt: n },
    { min: start, max: start + 100 },
  );
}

function moreOrLess(d: Level): Question {
  let n: number;
  let amount: 10 | 100;
  let more: boolean;
  let hint: string;
  if (d === 3) {
    // Crossing a hundred: 395 + 10, or 503 − 10.
    amount = 10;
    more = chance(0.5);
    const h = randInt(1, 8);
    n = more ? h * 100 + 90 + randInt(0, 9) : h * 100 + randInt(0, 9);
    const ans = more ? n + 10 : n - 10;
    hint = more
      ? `${n} has 9 tens. 10 more makes 10 tens, which is a new hundred: ${ans}.`
      : `${n} has 0 tens. Trade 1 hundred for 10 tens, then take 1 ten away: ${ans}.`;
  } else {
    amount = pick([10, 100] as const);
    more = d === 1 ? true : chance(0.5);
    const h = amount === 100 ? (more ? randInt(1, 8) : randInt(2, 9)) : randInt(1, d === 1 ? 4 : 9);
    const t = amount === 10 ? (more ? randInt(0, 8) : randInt(1, 9)) : randInt(0, 9);
    n = h * 100 + t * 10 + randInt(0, 9);
    const ans = more ? n + amount : n - amount;
    hint = `Only the ${amount === 10 ? "tens" : "hundreds"} digit changes. It goes ${more ? "up" : "down"} by 1: ${ans}.`;
  }
  const ans = more ? n + amount : n - amount;
  const { h, t, o } = digitsOf(n);
  return typeIn(
    `What is ${amount} ${more ? "more" : "less"} than ${n}?`,
    ans,
    hint,
    d === 1 ? { type: "blocks", hundreds: h, tens: t, ones: o } : undefined,
  );
}

function numbersTo1000(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  return buildSet([
    () => buildHundreds(d),
    () => readBlocks(d),
    () => digitWorth(d),
    () => expandedForm(d),
    () => compareSign(d),
    () => orderNumbers(d),
    () => numberLineSpot(d),
    () => moreOrLess(d),
  ]);
}

// =====================================================================
// Facts to 20
// =====================================================================

function addPair(d: Level): [number, number] {
  if (d === 1) {
    const a = randInt(3, 9);
    return [a, randInt(2, Math.min(9, 12 - a))];
  }
  // Facts that cross 10.
  const lo = d === 2 ? 2 : 5;
  const a = randInt(lo, 9);
  return [a, randInt(Math.max(lo, 11 - a), 9)];
}

/** [whole, part taken away] */
function subPair(d: Level): [number, number] {
  if (d === 1) {
    const b = randInt(2, 6);
    return [b + randInt(1, 6), b];
  }
  const lo = d === 2 ? 3 : 6;
  const b = randInt(lo, 9);
  return [b + randInt(Math.max(2, 11 - b), 9), b];
}

function addFactHint(a: number, b: number): string {
  const big = Math.max(a, b);
  const small = Math.min(a, b);
  if (a === b) return `It's a double! ${a} + ${a} = ${a + b}.`;
  if (big - small === 1) return `Use a double: ${small} + ${small} = ${small * 2}, and 1 more makes ${a + b}.`;
  if (big < 10 && a + b > 10) {
    const need = 10 - big;
    return `Make a ten: ${big} + ${need} = 10. Then add the ${small - need} left over: 10 + ${small - need} = ${a + b}.`;
  }
  return `Start at ${big} and count on ${small}: ${a + b}.`;
}

function subFactHint(a: number, b: number): string {
  const c = a - b;
  if (a > 10 && c < 10) {
    const down = a - 10;
    return `Take away ${down} to get to 10, then take away ${b - down} more: 10 − ${b - down} = ${c}. Or think ${b} + ? = ${a}.`;
  }
  return `Think addition: ${b} + ? = ${a}. Count up from ${b} to ${a}: ${c}.`;
}

function addFact(d: Level, input: boolean): Question {
  const [a, b] = addPair(d);
  const prompt = `What is ${a} + ${b}?`;
  const visual = eq(`${a} + ${b} = ?`);
  const hint = addFactHint(a, b);
  return input
    ? typeIn(prompt, a + b, hint, visual)
    : numChoice(prompt, a + b, [a + b + 1, a + b - 1, a + b + 10, a + b - 10], hint, visual, { min: 0, max: 20 });
}

function subFact(d: Level, input: boolean): Question {
  const [a, b] = subPair(d);
  const prompt = `What is ${a} − ${b}?`;
  const visual = eq(`${a} − ${b} = ?`);
  const hint = subFactHint(a, b);
  return input
    ? typeIn(prompt, a - b, hint, visual)
    : numChoice(prompt, a - b, [a - b + 1, a - b - 1, a + b], hint, visual, { min: 0, max: 20 });
}

function tenFrameAdd(): Question {
  const a = randInt(6, 9);
  const b = randInt(11 - a, Math.min(9, 14 - a));
  return numChoice(
    `What is ${a} + ${b}?`,
    a + b,
    [a + b + 1, a + b - 1, a + b - 10],
    `Fill the first frame to make 10, then count the dots in the second frame: 10 + ${a + b - 10} = ${a + b}.`,
    { type: "tenFrame", filled: a, extra: b },
    { min: 0, max: 20 },
  );
}

function makeTenSplit(): Question {
  const a = randInt(7, 9);
  const b = randInt(11 - a, 9);
  const need = 10 - a;
  return numChoice(
    "Make a ten! What number goes in the box?",
    a + b - 10,
    [a + b - 9, a + b - 11, b, need],
    `${a} needs ${need} more to make 10. Take ${need} from ${b}, and ${b - need} is left over.`,
    eq(`${a} + ${b} = 10 + ☐`),
    { min: 0, max: 10 },
  );
}

function nearDouble(d: Level): Question {
  const a = d === 1 ? randInt(2, 6) : randInt(5, 9);
  const plusOne = d === 3 ? chance(0.5) : true;
  const b = plusOne ? a + 1 : a - 1;
  const prompt = d === 3 ? `What is ${a} + ${b}?` : `${a} + ${a} = ${a * 2}. So what is ${a} + ${b}?`;
  const hint = `Use the double ${a} + ${a} = ${a * 2}. ${a} + ${b} is 1 ${plusOne ? "more" : "less"}, so it's ${a + b}.`;
  return numChoice(prompt, a + b, [a * 2, a + b + 2, a + b - 2], hint, eq(`${a} + ${b} = ?`), { min: 0, max: 20 });
}

function thinkAddition(d: Level): Question {
  const [a, b] = subPair(d);
  return numChoice(
    `To find ${a} − ${b}, think addition. What goes in the box?`,
    a - b,
    [a - b + 1, a - b - 1, a + b],
    `Count up from ${b} to ${a}. ${b} + ${a - b} = ${a}, so ${a} − ${b} = ${a - b}.`,
    eq(`${b} + ☐ = ${a}`),
    { min: 0, max: 20 },
  );
}

function factFamily(d: Level): Question {
  let a: number, b: number;
  do [a, b] = addPair(d);
  while (a === b);
  const s = a + b;
  const big = Math.max(a, b);
  const small = Math.min(a, b);
  const wrong = [`${s} + ${a} = ${s + a}`, `${s} − ${a + 1} = ${b - 1}`];
  if (big !== 2 * small) wrong.push(`${big} − ${small} = ${big - small}`);
  return pickOne(
    `Which fact is in the same family as ${a} + ${b} = ${s}?`,
    pick([`${s} − ${a} = ${b}`, `${s} − ${b} = ${a}`, `${b} + ${a} = ${s}`]),
    wrong,
    `A fact family uses the same three numbers: ${a}, ${b} and ${s}. Find the fact that uses only those numbers.`,
    eq(`${a} + ${b} = ${s}`),
  );
}

function factStory(d: Level): Question {
  const n = pick(NAMES);
  const mode = d === 3 ? pick(["add", "sub", "compare"] as const) : pick(["add", "sub"] as const);
  if (mode === "add") {
    const [a, b] = addPair(d);
    const s = pick([
      { emoji: "🍎", text: `${n} picks ${a} apples. Then ${n} picks ${b} more. How many apples now?` },
      { emoji: "🚌", text: `There are ${a} kids on the bus. ${b} more get on. How many kids are on the bus now?` },
      { emoji: "📖", text: `${n} reads ${a} pages on Monday and ${b} pages on Tuesday. How many pages in all?` },
    ]);
    return typeIn(s.text, a + b, `Put the two groups together: ${a} + ${b}. ${addFactHint(a, b)}`, {
      type: "emoji",
      emoji: s.emoji,
    });
  }
  const [a, b] = subPair(d);
  if (mode === "compare") {
    const other = pick(NAMES.filter((x) => x !== n));
    return typeIn(
      `${n} has ${a} marbles. ${other} has ${b} marbles. How many more marbles does ${n} have?`,
      a - b,
      `Find the difference: ${a} − ${b}. ${subFactHint(a, b)}`,
      { type: "emoji", emoji: "🔵" },
    );
  }
  const s = pick([
    { emoji: "🐦", text: `There are ${a} birds on a fence. ${b} fly away. How many birds are left?` },
    { emoji: "⭐", text: `${n} has ${a} stickers and gives ${b} to a friend. How many stickers are left?` },
    { emoji: "🍪", text: `A plate has ${a} cookies. The family eats ${b}. How many cookies are left?` },
  ]);
  return typeIn(s.text, a - b, `Take away: ${a} − ${b}. ${subFactHint(a, b)}`, { type: "emoji", emoji: s.emoji });
}

function threeAddends(): Question {
  const x = randInt(1, 9);
  const y = 10 - x;
  const z = randInt(2, 9);
  const order = shuffle([x, y, z]);
  return typeIn(
    `What is ${order.join(" + ")}?`,
    10 + z,
    `Look for two numbers that make 10: ${x} + ${y} = 10. Then 10 + ${z} = ${10 + z}.`,
    eq(`${order.join(" + ")} = ?`),
  );
}

function missingPart(): Question {
  const [a, b] = subPair(3);
  return numChoice(
    "What number goes in the box?",
    b,
    [b + 1, b - 1, a + (a - b)],
    `What do you take from ${a} to leave ${a - b}? Count up from ${a - b} to ${a}: ${b}.`,
    eq(`${a} − ☐ = ${a - b}`),
    { min: 0, max: 20 },
  );
}

function factsTo20(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  if (d === 1) {
    return buildSet([
      tenFrameAdd,
      () => addFact(1, false),
      () => addFact(1, true),
      () => subFact(1, false),
      () => subFact(1, true),
      () => nearDouble(1),
      () => thinkAddition(1),
      () => factStory(1),
    ]);
  }
  if (d === 2) {
    return buildSet([
      makeTenSplit,
      () => addFact(2, false),
      () => addFact(2, true),
      () => subFact(2, false),
      () => subFact(2, true),
      () => nearDouble(2),
      () => factFamily(2),
      () => factStory(2),
    ]);
  }
  return buildSet([
    threeAddends,
    () => addFact(3, false),
    () => subFact(3, false),
    () => subFact(3, true),
    missingPart,
    () => nearDouble(3),
    () => factFamily(3),
    () => factStory(3),
  ]);
}

// =====================================================================
// Add & Subtract to 1000
// =====================================================================

function carries(a: number, b: number): number {
  let count = 0;
  let carry = 0;
  while (a > 0 || b > 0) {
    carry = (a % 10) + (b % 10) + carry >= 10 ? 1 : 0;
    count += carry;
    a = Math.floor(a / 10);
    b = Math.floor(b / 10);
  }
  return count;
}

function borrows(a: number, b: number): number {
  let count = 0;
  let borrow = 0;
  while (b > 0 || borrow > 0) {
    const x = (a % 10) - borrow;
    borrow = x < b % 10 ? 1 : 0;
    count += borrow;
    a = Math.floor(a / 10);
    b = Math.floor(b / 10);
  }
  return count;
}

/** Add each place but forget to carry (a common mistake). */
function noCarrySum(a: number, b: number): number {
  let r = 0;
  for (let p = 1; a > 0 || b > 0; p *= 10) {
    r += (((a % 10) + (b % 10)) % 10) * p;
    a = Math.floor(a / 10);
    b = Math.floor(b / 10);
  }
  return r;
}

/** Take the smaller digit from the bigger in each place (a common mistake). */
function smallFromBig(a: number, b: number): number {
  let r = 0;
  for (let p = 1; a > 0 || b > 0; p *= 10) {
    r += Math.abs((a % 10) - (b % 10)) * p;
    a = Math.floor(a / 10);
    b = Math.floor(b / 10);
  }
  return r;
}

function addPair3(d: Level): [number, number] {
  for (;;) {
    const a = randInt(d === 1 ? 100 : 120, d === 1 ? 699 : 799);
    const b = d === 3 ? randInt(100, 899) : chance(0.5) ? randInt(11, 99) : randInt(100, 399);
    if (a + b > 999) continue;
    const c = carries(a, b);
    if ((d === 1 && c === 0) || (d === 2 && c === 1) || (d === 3 && c >= 2)) return [a, b];
  }
}

function subPair3(d: Level): [number, number] {
  if (d === 3 && chance(0.5)) {
    // Across a zero: 600 − 274 or 503 − 168.
    const h = randInt(3, 9);
    const a = h * 100 + (chance(0.5) ? 0 : randInt(1, 5));
    const b = randInt(1, h - 1) * 100 + randInt(1, 9) * 10 + randInt((a % 10) + 1, 9);
    return [a, b];
  }
  for (;;) {
    const a = randInt(d === 1 ? 150 : 200, 999);
    const b = chance(0.4) ? randInt(11, 99) : randInt(100, a - 10);
    const c = borrows(a, b);
    if ((d === 1 && c === 0) || (d === 2 && c === 1) || (d === 3 && c >= 2)) return [a, b];
  }
}

function addPlaceHint(a: number, b: number): string {
  const A = digitsOf(a);
  const B = digitsOf(b);
  const H = (A.h + B.h) * 100;
  const T = (A.t + B.t) * 10;
  const O = A.o + B.o;
  const hundreds = B.h ? `hundreds ${A.h * 100} + ${B.h * 100} = ${H}` : `hundreds ${H}`;
  return `Add each place: ${hundreds}, tens ${A.t * 10} + ${B.t * 10} = ${T}, ones ${A.o} + ${B.o} = ${O}. Then ${H} + ${T} + ${O} = ${a + b}.`;
}

function countUpHint(a: number, b: number): string {
  const jumps: number[] = [];
  let at = b;
  const hop = (to: number) => {
    if (to > at && to <= a) {
      jumps.push(to - at);
      at = to;
    }
  };
  hop(Math.ceil(at / 10) * 10);
  hop(Math.ceil(at / 100) * 100);
  hop(at + Math.floor((a - at) / 100) * 100);
  hop(at + Math.floor((a - at) / 10) * 10);
  hop(a);
  const total = jumps.length > 1 ? ` Add the jumps: ${jumps.join(" + ")} = ${a - b}.` : ` That's ${a - b}.`;
  return `Count up from ${b} to ${a}: ${jumps.map((j) => `+${j}`).join(", ")}.${total}`;
}

function subHint3(a: number, b: number): string {
  if (borrows(a, b) > 0) return countUpHint(a, b);
  const A = digitsOf(a);
  const B = digitsOf(b);
  return `Take away each place: hundreds ${A.h * 100} − ${B.h * 100} = ${(A.h - B.h) * 100}, tens ${A.t * 10} − ${B.t * 10} = ${(A.t - B.t) * 10}, ones ${A.o} − ${B.o} = ${A.o - B.o}. Together: ${a - b}.`;
}

function addQ3(d: Level, input: boolean): Question {
  const [a, b] = addPair3(d);
  const s = a + b;
  const prompt = `What is ${a} + ${b}?`;
  const visual = eq(`${a} + ${b} = ?`);
  const hint = addPlaceHint(a, b);
  return input
    ? typeIn(prompt, s, hint, visual)
    : numChoice(prompt, s, [noCarrySum(a, b), s + 10, s - 10, s + 100, s - 100], hint, visual, { min: 0, max: 1000 });
}

function subQ3(d: Level, input: boolean): Question {
  const [a, b] = subPair3(d);
  const r = a - b;
  const prompt = `What is ${a} − ${b}?`;
  const visual = eq(`${a} − ${b} = ?`);
  const hint = subHint3(a, b);
  return input
    ? typeIn(prompt, r, hint, visual)
    : numChoice(prompt, r, [smallFromBig(a, b), r + 10, r - 10, r + 100, r - 100], hint, visual, { min: 0, max: 1000 });
}

function friendlyAdd(): Question {
  const h = randInt(1, 6);
  const t = randInt(0, 8);
  const a = h * 100 + t * 10;
  const byHundreds = chance(0.5);
  const b = byHundreds ? randInt(1, 9 - h) * 100 : randInt(1, 9 - t) * 10;
  return numChoice(
    `What is ${a} + ${b}?`,
    a + b,
    [a + b + 10, a + b - 10, a + b + 100, a + b - 100],
    byHundreds
      ? `Add the hundreds: ${plural(h, "hundred")} + ${plural(b / 100, "hundred")} = ${plural(h + b / 100, "hundred")}. The tens stay the same: ${a + b}.`
      : `Add the tens: ${plural(t, "ten")} + ${plural(b / 10, "ten")} = ${plural(t + b / 10, "ten")}. The hundreds stay the same: ${a + b}.`,
    eq(`${a} + ${b} = ?`),
    { min: 0, max: 1000 },
  );
}

function estimateQ(d: Level): Question {
  const near = (H: number) => H * 100 + pick([-1, 1]) * randInt(1, 12);
  if (d === 3 && chance(0.5)) {
    const H1 = randInt(5, 9);
    const H2 = randInt(1, H1 - 2);
    const a = near(H1);
    const b = near(H2);
    const est = (H1 - H2) * 100;
    return numChoice(
      `About how much is ${a} − ${b}?`,
      est,
      [est - 100, est + 100, est + 200],
      `Round each number to the nearest hundred: ${a} is close to ${H1 * 100} and ${b} is close to ${H2 * 100}. ${H1 * 100} − ${H2 * 100} = ${est}.`,
      undefined,
      { min: 100, max: 1000 },
    );
  }
  const H1 = randInt(1, 6);
  const H2 = randInt(1, 8 - H1);
  const a = near(H1);
  const b = near(H2);
  const est = (H1 + H2) * 100;
  return numChoice(
    `About how much is ${a} + ${b}?`,
    est,
    [est - 100, est + 100, est + 200],
    `Round each number to the nearest hundred: ${a} is close to ${H1 * 100} and ${b} is close to ${H2 * 100}. ${H1 * 100} + ${H2 * 100} = ${est}.`,
    undefined,
    { min: 100, max: 1000 },
  );
}

function numberLineJump(d: Level): Question {
  const line = (from: number, to: number, jumps: { from: number; to: number }[]): Visual => {
    const min = Math.floor(Math.min(from, to) / 100) * 100;
    const max = Math.ceil(Math.max(from, to) / 100) * 100;
    return { type: "numberLine", min, max, step: 10, labelEvery: max - min > 200 ? 100 : 50, marks: [from], jumps };
  };
  if (d === 3) {
    // Adding 199 is adding 200, then taking 1 away.
    const big = pick([200, 300]);
    const off = pick([1, 2]);
    const b = big - off;
    const a = randInt(120, 990 - big);
    const s = a + b;
    return numChoice(
      `What is ${a} + ${b}? Use the jumps.`,
      s,
      [s + 10, s - 10, a + big, s + 100],
      `${b} is ${off} less than ${big}. Jump ${big}: ${a} + ${big} = ${a + big}. Then jump back ${off}: ${s}.`,
      line(a, a + big, [
        { from: a, to: a + big },
        { from: a + big, to: s },
      ]),
      { min: 0, max: 1000 },
    );
  }
  const hJump = randInt(1, 2) * 100;
  const tJump = randInt(1, 9) * 10;
  const b = hJump + tJump;
  if (d === 2 && chance(0.5)) {
    const a = randInt(b + 100, 999);
    const r = a - b;
    return numChoice(
      `What is ${a} − ${b}? Use the jumps.`,
      r,
      [r + 10, r - 10, r + 100, r - 100],
      `Jump back ${hJump} from ${a} to ${a - hJump}, then jump back ${tJump} to ${r}.`,
      line(a, r, [
        { from: a, to: a - hJump },
        { from: a - hJump, to: r },
      ]),
      { min: 0, max: 1000 },
    );
  }
  const a = randInt(101, 999 - b);
  const s = a + b;
  return numChoice(
    `What is ${a} + ${b}? Use the jumps.`,
    s,
    [s + 10, s - 10, s + 100, s - 100],
    `Jump ${hJump} from ${a} to ${a + hJump}, then jump ${tJump} more to ${s}.`,
    line(a, s, [
      { from: a, to: a + hJump },
      { from: a + hJump, to: s },
    ]),
    { min: 0, max: 1000 },
  );
}

function addStory3(d: Level): Question {
  const [a, b] = addPair3(d);
  const n = pick(NAMES);
  const s = pick([
    { emoji: "📚", text: `A school library has ${a} books. It gets ${b} new books. How many books does it have now?` },
    { emoji: "👟", text: `${n} walked ${a} steps before lunch and ${b} steps after lunch. How many steps in all?` },
    { emoji: "🍎", text: `A farm stand sold ${a} apples on Saturday and ${b} apples on Sunday. How many apples were sold in all?` },
    { emoji: "🎭", text: `A theatre has ${a} seats downstairs and ${b} seats upstairs. How many seats are there in all?` },
  ]);
  return typeIn(s.text, a + b, `Put them together: ${a} + ${b}. ${addPlaceHint(a, b)}`, { type: "emoji", emoji: s.emoji });
}

function subStory3(d: Level): Question {
  const [a, b] = subPair3(d);
  const n = pick(NAMES);
  const s = pick([
    { emoji: "🧁", text: `A bakery made ${a} muffins. It sold ${b}. How many muffins are left?` },
    { emoji: "📖", text: `${n}'s book has ${a} pages. ${n} has read ${b} pages. How many pages are left to read?` },
    { emoji: "🌲", text: `A tree farm had ${a} trees. It sold ${b} trees. How many trees are left?` },
    { emoji: "🎵", text: `There were ${a} people at a concert. ${b} people left early. How many people stayed?` },
  ]);
  const r = a - b;
  return numChoice(
    s.text,
    r,
    [smallFromBig(a, b), a + b, r + 10, r - 10, r + 100],
    `Take away to find what's left: ${a} − ${b}. ${subHint3(a, b)}`,
    { type: "emoji", emoji: s.emoji },
    { min: 0, max: 1000 },
  );
}

function compareStory3(): Question {
  const [a, b] = subPair3(3);
  const [n1, n2] = sample(NAMES, 2);
  const s = pick([
    {
      emoji: "🎮",
      text: `${n1} scored ${a} points in a game. ${n2} scored ${b} points. How many more points did ${n1} score?`,
    },
    {
      emoji: "🎀",
      text: `A red ribbon is ${a} cm long. A blue ribbon is ${b} cm long. How much longer is the red ribbon?`,
    },
  ]);
  return typeIn(s.text, a - b, `Find the difference: ${a} − ${b}. ${subHint3(a, b)}`, { type: "emoji", emoji: s.emoji });
}

function addSubtract1000(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  return buildSet([
    () => addQ3(d, false),
    () => addQ3(d, true),
    () => subQ3(d, false),
    () => subQ3(d, true),
    d === 1 ? friendlyAdd : () => estimateQ(d),
    d === 3 ? compareStory3 : () => addStory3(d),
    () => subStory3(d),
    () => numberLineJump(d),
  ]);
}

// =====================================================================
// Multiplication
// =====================================================================

const ARRAY_EMOJI = ["🍪", "⭐", "🌸", "🍓", "🧁", "🍎", "🌼", "🐞"];

/** [groups, in each group] */
function multPair(d: Level): [number, number] {
  if (d === 1) return chance(0.5) ? [randInt(2, 5), pick([2, 5, 10])] : [pick([2, 5, 10]), randInt(2, 5)];
  if (d === 2) return [randInt(2, 5), randInt(2, 5)];
  return chance(0.5) ? [randInt(2, 5), randInt(6, 9)] : [randInt(6, 9), randInt(2, 5)];
}

function arrayCount(d: Level, input: boolean): Question {
  const [r, c] = multPair(d);
  const emoji = pick(ARRAY_EMOJI);
  const prompt = `How many ${emoji} are in the array?`;
  const hint = `There are ${r} rows of ${c}, so it's ${r} × ${c}. ${skipHint(r, c)}`;
  const visual: Visual = { type: "array", rows: r, cols: c, emoji };
  return input
    ? typeIn(prompt, r * c, hint, visual)
    : numChoice(prompt, r * c, [r * c + c, r * c - c, r + c, r * c + r], hint, visual, { min: 1, max: 100 });
}

function arrayMatch(d: Level): Question {
  let r: number, c: number;
  do [r, c] = multPair(d);
  while (r === 2 && c === 2);
  return pickOne(
    "Which multiplication matches the array?",
    `${r} × ${c}`,
    [`${r} + ${c}`, `${r} × ${c + 1}`, `${r + 1} × ${c}`],
    `Count the rows (${r}) and how many are in each row (${c}). ${r} rows of ${c} is ${r} × ${c}.`,
    { type: "array", rows: r, cols: c, emoji: pick(ARRAY_EMOJI) },
  );
}

const GROUP_THINGS = [
  { groups: "bags", group: "bag", things: "apples", emoji: "🍎" },
  { groups: "boxes", group: "box", things: "crayons", emoji: "🖍️" },
  { groups: "vases", group: "vase", things: "flowers", emoji: "🌷" },
  { groups: "plates", group: "plate", things: "cookies", emoji: "🍪" },
  { groups: "packs", group: "pack", things: "stickers", emoji: "⭐" },
  { groups: "nests", group: "nest", things: "eggs", emoji: "🥚" },
  { groups: "baskets", group: "basket", things: "strawberries", emoji: "🍓" },
];

function groupsStory(d: Level): Question {
  const [a, b] = multPair(d);
  const g = pick(GROUP_THINGS);
  return typeIn(
    `${pick(NAMES)} has ${a} ${g.groups} with ${b} ${g.things} in each ${g.group}. How many ${g.things} in all?`,
    a * b,
    `${a} groups of ${b} is ${a} × ${b}. ${skipHint(a, b)}`,
    { type: "emoji", emoji: g.emoji, caption: `${a} groups of ${b}` },
  );
}

function repeatedAdd(d: Level): Question {
  let k: number, n: number;
  do {
    k = d === 3 ? randInt(3, 6) : randInt(2, 5);
    n = d === 1 ? pick([2, 5, 10]) : d === 2 ? randInt(2, 5) : randInt(3, 9);
  } while (k === 2 && n === 2);
  return pickOne(
    "Which multiplication means the same as this?",
    `${k} × ${n}`,
    [`${k} + ${n}`, `${n} × ${n}`, `${k + 1} × ${n}`, `${k} × ${n + 1}`],
    `There are ${k} groups of ${n} added together, so it's ${k} × ${n} = ${k * n}.`,
    eq(repeat(String(n), k).join(" + ")),
  );
}

function multEq(d: Level, input: boolean): Question {
  const [a, b] = multPair(d);
  const p = a * b;
  const prompt = `What is ${a} × ${b}?`;
  const visual = eq(`${a} × ${b} = ?`);
  const hint = skipHint(a, b);
  return input
    ? typeIn(prompt, p, hint, visual)
    : numChoice(prompt, p, [p + b, p - b, p + a, p - a, a + b], hint, visual, { min: 0, max: 100 });
}

function hopLine(d: Level): Question {
  const [a, b] = multPair(d);
  const p = a * b;
  const small = p + b <= 40;
  const max = small ? Math.ceil((p + 1) / 5) * 5 : (a + 1) * b;
  return numChoice(
    `A frog makes ${a} hops. Each hop is ${b} long. Where does it land?`,
    p,
    [p + b, p - b, a + b],
    `Count by ${b}s, once for each hop: ${skipList(b, a)}. That's ${a} × ${b} = ${p}.`,
    {
      type: "numberLine",
      min: 0,
      max,
      step: small ? 1 : b,
      labelEvery: small ? 5 : b,
      blankAt: p,
      jumps: Array.from({ length: a }, (_, i) => ({ from: i * b, to: (i + 1) * b })),
    },
    { min: 0, max: 100 },
  );
}

function turnAround(d: Level): Question {
  let a: number, b: number;
  do [a, b] = multPair(d);
  while (a === b);
  return numChoice(
    `${a} × ${b} = ${a * b}. So what is ${b} × ${a}?`,
    a * b,
    [a * b + a, a * b - b, a + b],
    `You can multiply in any order. ${b} rows of ${a} is the same number as ${a} rows of ${b}: ${a * b}.`,
    eq(`${b} × ${a} = ?`),
    { min: 0, max: 100 },
  );
}

function timesSpecial(): Question {
  const n = randInt(2, 9);
  const m = pick([10, 1, 0]);
  const hint =
    m === 10
      ? `${n} groups of 10. Count by 10s ${n} times: ${skipList(10, n)}.`
      : m === 1
        ? `${n} groups of 1 is just ${n}.`
        : `${n} groups of nothing is nothing. Any number times 0 is 0.`;
  const likely = m === 10 ? [n, n + 10, n * 10 + 10] : m === 1 ? [n + 1, 1, n * 10] : [n, 1, 10];
  return numChoice(`What is ${n} × ${m}?`, n * m, likely, hint, eq(`${n} × ${m} = ?`), { min: 0, max: 100 });
}

function multiplication(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  return buildSet([
    () => arrayCount(d, d !== 1),
    () => arrayMatch(d),
    () => groupsStory(d),
    d === 3 ? () => turnAround(d) : () => repeatedAdd(d),
    () => multEq(d, false),
    () => multEq(d, true),
    () => hopLine(d),
    d === 1 ? () => arrayCount(d, false) : d === 2 ? () => turnAround(d) : timesSpecial,
  ]);
}

// =====================================================================
// Division
// =====================================================================

function divFact(d: Level): { total: number; by: number; each: number } {
  const by = d === 1 ? pick([2, 5, 10]) : d === 2 ? randInt(2, 5) : pick([2, 3, 4, 5, 10]);
  const each = d === 3 ? randInt(4, 10) : randInt(2, 5);
  return { total: by * each, by, each };
}

const SHARE_THINGS = [
  { things: "strawberries", emoji: "🍓", groups: "plates", group: "plate", into: "onto" },
  { things: "pencils", emoji: "✏️", groups: "cups", group: "cup", into: "into" },
  { things: "cookies", emoji: "🍪", groups: "bags", group: "bag", into: "into" },
  { things: "flowers", emoji: "🌼", groups: "vases", group: "vase", into: "into" },
  { things: "stickers", emoji: "⭐", groups: "pages", group: "page", into: "onto" },
  { things: "apples", emoji: "🍎", groups: "baskets", group: "basket", into: "into" },
];

function thingsVisual(total: number, emoji: string, caption: string): Visual {
  return total <= 30 ? { type: "dots", count: total, emoji } : { type: "emoji", emoji, caption };
}

function shareStory(d: Level): Question {
  const { total, by, each } = divFact(d);
  const s = pick(SHARE_THINGS);
  return typeIn(
    `${pick(NAMES)} puts ${total} ${s.things} ${s.into} ${by} ${s.groups}, the same number ${s.into === "onto" ? "on" : "in"} each. How many ${s.things} go ${s.into === "onto" ? "on" : "in"} each ${s.group}?`,
    each,
    `Share them out one at a time, like dealing cards, until they're all gone. Or think: ${by} × ? = ${total}. ${by} × ${each} = ${total}.`,
    thingsVisual(total, s.emoji, `${total} shared into ${by}`),
  );
}

function groupStory(d: Level): Question {
  const { total, by, each } = divFact(d);
  const s = pick(SHARE_THINGS);
  return numChoice(
    `There are ${total} ${s.things}. Each ${s.group} gets ${by}. How many ${s.groups} are needed?`,
    each,
    [each + 1, each - 1, by, each + 2],
    `Make groups of ${by}. Count by ${by}s up to ${total}: ${skipList(by, each)}. That's ${each} ${s.groups}.`,
    thingsVisual(total, s.emoji, `groups of ${by}`),
    { min: 1, max: 20 },
  );
}

function divEq(d: Level, input: boolean): Question {
  const { total, by, each } = divFact(d);
  const prompt = `What is ${total} ÷ ${by}?`;
  const visual = eq(`${total} ÷ ${by} = ?`);
  const hint = `Think multiplication: ${by} × ? = ${total}. Count by ${by}s to ${total}: ${skipList(by, each)}. That's ${each} jumps.`;
  return input
    ? typeIn(prompt, each, hint, visual)
    : numChoice(prompt, each, [each + 1, each - 1, total - by, by], hint, visual, { min: 0, max: 100 });
}

function relatedFact(d: Level): Question {
  const { total, by, each } = divFact(d);
  return numChoice(
    `${by} × ${each} = ${total}. So what is ${total} ÷ ${by}?`,
    each,
    [by, each + 1, each - 1, total],
    `Multiplying and dividing undo each other. ${by} groups of ${each} make ${total}, so ${total} split into ${by} groups is ${each}.`,
    eq(`${total} ÷ ${by} = ?`),
    { min: 0, max: 100 },
  );
}

function missingFactor(d: Level): Question {
  const { total, by, each } = divFact(d);
  return numChoice(
    "What number goes in the box?",
    each,
    [each + 1, each - 1, total - by],
    `Count by ${by}s until you reach ${total}: ${skipList(by, each)}. How many ${by}s did you count?`,
    eq(`${by} × ☐ = ${total}`),
    { min: 0, max: 100 },
  );
}

function arrayDivide(d: Level): Question {
  const { total, by, each } = divFact(d);
  const emoji = pick(ARRAY_EMOJI);
  return typeIn(
    `These ${total} ${emoji} are in ${by} equal rows. How many are in each row?`,
    each,
    `${total} ÷ ${by} = ? Count one row, or think ${by} × ? = ${total}. ${by} × ${each} = ${total}.`,
    { type: "array", rows: by, cols: each, emoji },
  );
}

function matchDivision(d: Level): Question {
  const { total, by } = divFact(d);
  const s = pick(SHARE_THINGS);
  return pickOne(
    "Which number sentence matches the story?",
    `${total} ÷ ${by}`,
    [`${total} − ${by}`, `${total} × ${by}`, `${total} + ${by}`],
    `Sharing equally into groups is division: ${total} things ÷ ${by} groups.`,
    {
      type: "story",
      lines: [
        `${total} ${s.things} are shared equally ${s.into} ${by} ${s.groups}.`,
        `How many go ${s.into === "onto" ? "on" : "in"} each ${s.group}?`,
      ],
    },
  );
}

function jumpBack(): Question {
  const { total, by, each } = divFact(3);
  const small = total <= 40;
  return numChoice(
    `Start at ${total}. Jump back ${by} at a time until you reach 0. How many jumps?`,
    each,
    [each + 1, each - 1, by],
    `Each jump takes away ${by}. Count the jumps: ${each}. So ${total} ÷ ${by} = ${each}.`,
    {
      type: "numberLine",
      min: 0,
      max: total,
      step: small ? 1 : by,
      labelEvery: by,
      jumps: Array.from({ length: each }, (_, i) => ({ from: total - i * by, to: total - (i + 1) * by })),
    },
    { min: 1, max: 20 },
  );
}

function division(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  return buildSet([
    () => shareStory(d),
    () => groupStory(d),
    () => divEq(d, false),
    () => divEq(d, true),
    () => relatedFact(d),
    () => arrayDivide(d),
    () => missingFactor(d),
    d === 3 ? jumpBack : () => matchDivision(d),
  ]);
}

// =====================================================================
// Fractions
// =====================================================================

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const frac = (n: number, d: number) => `${n}/${d}`;

/** Other ways to write the same fraction (4/8 → 2/4, 1/2). */
function equivalents(n: number, d: number): string[] {
  const out: string[] = [];
  for (let k = 2; k <= gcd(n, d); k++) if (n % k === 0 && d % k === 0) out.push(frac(n / k, d / k));
  return out;
}

/** A fraction question. Wrong options equal in value to the answer or to each other (like 1/2 and 2/4), or not between 0 and 1, are dropped. */
function fracChoice(
  prompt: string,
  [n, d]: [number, number],
  wrong: [number, number][],
  hint: string,
  visual?: Visual,
): ChoiceQuestion {
  const keep: string[] = [];
  const values: number[] = [n / d];
  const fallback: [number, number][] = [
    [n, d + 1],
    [n, d + 2],
    [n + 1, d + 1],
    [n + 1, d + 2],
  ];
  for (const [wn, wd] of [...wrong, ...fallback]) {
    const label = frac(wn, wd);
    if (keep.length >= 3) break;
    if (wn <= 0 || wn >= wd || values.some((x) => Math.abs(x - wn / wd) < 1e-9)) continue;
    keep.push(label);
    values.push(wn / wd);
  }
  return textChoice(prompt, frac(n, d), keep, hint, visual);
}

const DENOMS: Record<Level, number[]> = { 1: [2, 3, 4], 2: [3, 4, 5, 6, 8], 3: [5, 6, 8, 10, 12] };

const FRACTION_NAMES: Record<number, string> = {
  2: "halves",
  3: "thirds",
  4: "fourths",
  5: "fifths",
  6: "sixths",
  8: "eighths",
  10: "tenths",
  12: "twelfths",
};

function shadedModel(d: Level): { num: number; den: number; visual: Visual } {
  const den = pick(DENOMS[d]);
  const num = randInt(1, den - 1);
  return {
    num,
    den,
    visual: { type: "fraction", numerator: num, denominator: den, shape: pick(["bar", "circle"] as const) },
  };
}

function shadedChoice(d: Level): Question {
  const { num, den, visual } = shadedModel(d);
  return fracChoice(
    "What fraction is shaded?",
    [num, den],
    [
      [den - num, den],
      [num, den - num],
      [num + 1, den],
    ],
    `The top number counts the shaded parts (${num}). The bottom number counts all the equal parts (${den}). So it's ${frac(num, den)}.`,
    visual,
  );
}

function shadedInput(d: Level): Question {
  const { num, den, visual } = shadedModel(d);
  return typeIn(
    "What fraction is shaded? Type it like 1/2.",
    frac(num, den),
    `Count the shaded parts for the top number (${num}) and all the equal parts for the bottom number (${den}): ${frac(num, den)}.`,
    visual,
    { keypad: "fraction", accept: equivalents(num, den) },
  );
}

function notShaded(d: Level): Question {
  const { num, den, visual } = shadedModel(d);
  return fracChoice(
    "What fraction is NOT shaded?",
    [den - num, den],
    [
      [num, den],
      [den - num, num],
      [den - num + 1, den],
    ],
    `There are ${den} equal parts and ${num} ${num === 1 ? "is" : "are"} shaded, so ${den - num} ${den - num === 1 ? "is" : "are"} not shaded: ${frac(den - num, den)}.`,
    visual,
  );
}

function partsCount(): Question {
  const den = pick([2, 3, 4, 5, 6, 8]);
  return typeIn(
    "How many equal parts is this whole cut into?",
    den,
    "Count every part, shaded or not. That's the bottom number of the fraction.",
    { type: "fraction", numerator: 1, denominator: den, shape: pick(["bar", "circle"] as const) },
  );
}

function partsMeaning(d: Level): Question {
  const den = pick(DENOMS[d]);
  const num = randInt(1, den - 1);
  const bottom = chance(0.5);
  const whole = "How many equal parts make the whole";
  const counted = "How many of the parts are shaded";
  return pickOne(
    `In ${frac(num, den)}, what does the ${bottom ? den : num} tell you?`,
    bottom ? whole : counted,
    [bottom ? counted : whole, "How many wholes there are"],
    "The bottom number (denominator) tells how many equal parts the whole is cut into. The top number (numerator) tells how many of those parts we are counting.",
    { type: "fraction", numerator: num, denominator: den },
  );
}

function compareUnit(d: Level): Question {
  if (d === 3 && chance(0.5)) {
    const top = randInt(2, 3);
    const [x, y] = sample([4, 5, 6, 8, 10], 2);
    const bigger = Math.min(x, y);
    const smaller = Math.max(x, y);
    return pickOne(
      `Which is bigger: ${frac(top, x)} or ${frac(top, y)}?`,
      frac(top, bigger),
      [frac(top, smaller), "They are the same"],
      `Both have ${top} parts. ${cap(FRACTION_NAMES[bigger])} are bigger pieces than ${FRACTION_NAMES[smaller]}, so ${frac(top, bigger)} is bigger.`,
    );
  }
  const pool = d === 1 ? [2, 3, 4] : d === 2 ? [2, 3, 4, 6, 8] : [3, 4, 5, 6, 8, 10];
  const dens = sample(pool, d === 3 ? 3 : 2);
  const best = Math.min(...dens);
  const others = dens.filter((x) => x !== best).map((x) => frac(1, x));
  return pickOne(
    d === 3 ? `Which fraction is the biggest: ${dens.map((x) => frac(1, x)).join(", ")}?` : `Which is bigger: ${frac(1, dens[0])} or ${frac(1, dens[1])}?`,
    frac(1, best),
    d === 3 ? others : [...others, "They are the same"],
    `The more parts a whole is cut into, the smaller each part. ${frac(1, best)} has the fewest parts, so its part is the biggest.`,
  );
}

function compareSame(d: Level): Question {
  const den = pick(d === 1 ? [3, 4, 5] : d === 2 ? [4, 5, 6, 8] : [6, 8, 10, 12]);
  const [x, y] = sample(range(1, den - 1), 2);
  const big = Math.max(x, y);
  const small = Math.min(x, y);
  return pickOne(
    `Which is more: ${frac(x, den)} or ${frac(y, den)}?`,
    frac(big, den),
    [frac(small, den), "They are the same"],
    `The parts are all the same size (${FRACTION_NAMES[den]}). ${plural(big, "part")} is more than ${plural(small, "part")}.`,
  );
}

const SET_PAIRS = [
  { a: "🍎", aWord: "red", b: "🍏", bWord: "green", whole: "apples" },
  { a: "🐶", aWord: "dogs", b: "🐱", bWord: "cats", whole: "pets" },
  { a: "⚽", aWord: "soccer balls", b: "🏀", bWord: "basketballs", whole: "balls" },
  { a: "🌷", aWord: "tulips", b: "🌻", bWord: "sunflowers", whole: "flowers" },
  { a: "🔴", aWord: "red", b: "🔵", bWord: "blue", whole: "counters" },
];

function fractionOfSet(d: Level): Question {
  const s = pick(SET_PAIRS);
  const total = d === 1 ? randInt(3, 6) : d === 2 ? randInt(5, 8) : randInt(6, 10);
  let k: number;
  do k = randInt(1, total - 1);
  while (k * 2 === total);
  const askA = chance(0.5);
  const target = askA ? k : total - k;
  const word = askA ? s.aWord : s.bWord;
  return fracChoice(
    `What fraction of the ${s.whole} are ${word}?`,
    [target, total],
    [
      [total - target, total],
      [target, total - target],
      [target, total + 1],
    ],
    `There are ${total} ${s.whole} in all, so the bottom number is ${total}. ${target} of them ${target === 1 ? "is" : "are"} ${word}: ${frac(target, total)}.`,
    { type: "emojiRow", items: [...repeat(s.a, k), ...repeat(s.b, total - k)] },
  );
}

const FOOD_PARTS = [
  { whole: "pizza", emoji: "🍕", part: "slice" },
  { whole: "pie", emoji: "🥧", part: "slice" },
  { whole: "chocolate bar", emoji: "🍫", part: "piece" },
  { whole: "birthday cake", emoji: "🎂", part: "piece" },
];

function foodStory(d: Level, input: boolean): Question {
  const f = pick(FOOD_PARTS);
  const den = pick(d === 1 ? [2, 3, 4] : d === 2 ? [4, 6, 8] : [6, 8, 10, 12]);
  const k = randInt(1, den - 1);
  const n = pick(NAMES);
  const left = d === 3;
  const target = left ? den - k : k;
  const prompt = `${capArticle(f.whole)} ${f.whole} is cut into ${den} equal ${f.part}s. ${n} eats ${plural(k, f.part)}. ${
    left ? `What fraction of the ${f.whole} is left?` : `What fraction of the ${f.whole} did ${n} eat?`
  }`;
  const hint = left
    ? `${den} ${f.part}s in all, and ${k} ${k === 1 ? "is" : "are"} eaten. ${den} − ${k} = ${den - k} ${den - k === 1 ? "is" : "are"} left: ${frac(den - k, den)}.`
    : `The ${f.whole} has ${den} equal ${f.part}s, and ${n} eats ${k} of them: ${frac(k, den)}.`;
  const visual: Visual = { type: "emoji", emoji: f.emoji, caption: `${den} ${f.part}s` };
  if (input) return typeIn(prompt, frac(target, den), hint, visual, { keypad: "fraction", accept: equivalents(target, den) });
  return fracChoice(
    prompt,
    [target, den],
    [
      [den - target, den],
      [target, den - target],
      [target, den + 1],
    ],
    hint,
    visual,
  );
}

function wholeParts(d: Level): Question {
  const den = pick(d === 1 ? [2, 3, 4] : [5, 6, 8, 10]);
  return typeIn(
    `How many ${FRACTION_NAMES[den]} make one whole?`,
    den,
    `A whole cut into ${FRACTION_NAMES[den]} has ${den} equal parts. ${frac(den, den)} is one whole.`,
    { type: "fraction", numerator: den, denominator: den, shape: "bar" },
  );
}

function lineFraction(): Question {
  const den = pick([3, 4, 5, 6, 8]);
  const k = randInt(1, den - 1);
  return fracChoice(
    "What fraction goes where the ? is?",
    [k, den],
    [
      [k, den + 1],
      [den - k, den],
      [k + 1, den],
      [k - 1, den],
    ],
    `The line from 0 to 1 is cut into ${den} equal jumps (count the spaces, not the marks). The ? is ${plural(k, "jump")} from 0, so it's ${frac(k, den)}.`,
    { type: "numberLine", min: 0, max: 1, step: 1 / den, labelEvery: 1, blankAt: k / den },
  );
}

function fractions(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  if (d === 1) {
    return buildSet([
      () => shadedChoice(1),
      () => shadedChoice(1),
      () => shadedInput(1),
      partsCount,
      () => compareUnit(1),
      () => fractionOfSet(1),
      () => foodStory(1, false),
      () => wholeParts(1),
    ]);
  }
  if (d === 2) {
    return buildSet([
      () => shadedChoice(2),
      () => shadedInput(2),
      () => notShaded(2),
      () => partsMeaning(2),
      () => compareUnit(2),
      () => compareSame(2),
      () => fractionOfSet(2),
      () => foodStory(2, true),
    ]);
  }
  return buildSet([
    () => shadedInput(3),
    () => notShaded(3),
    () => compareUnit(3),
    () => compareSame(3),
    () => fractionOfSet(3),
    lineFraction,
    () => foodStory(3, true),
    () => wholeParts(3),
  ]);
}

// =====================================================================
// Patterns & Equations
// =====================================================================

interface Pattern {
  terms: number[];
  next: number;
  step: number;
  up: boolean;
}

function makePattern(d: Level, len: number): Pattern {
  let step: number, up: boolean, low: number;
  if (d === 1) {
    step = pick([2, 5, 10]);
    up = true;
    low = step === 2 ? randInt(1, 30) : step === 5 ? randInt(0, 18) * 5 : randInt(1, 40) * 10 + pick([0, 0, 5]);
  } else if (d === 2) {
    step = pick([3, 4, 25, 50, 100]);
    up = chance(0.6);
    low = step === 100 ? randInt(0, 4) * 100 + randInt(1, 99) : step >= 25 ? randInt(0, 12) * 25 : randInt(1, 50);
  } else {
    step = pick([6, 7, 8, 9, 15, 20, 25, 50]);
    up = chance(0.4);
    low = step >= 15 ? randInt(1, 30) * 5 : randInt(1, 60);
  }
  const seq = Array.from({ length: len + 1 }, (_, i) => low + i * step);
  const ordered = up ? seq : [...seq].reverse();
  return { terms: ordered.slice(0, len), next: ordered[len], step, up };
}

function nextTerm(d: Level): Question {
  const { terms, next, step, up } = makePattern(d, 4);
  const last = terms[terms.length - 1];
  return numChoice(
    "What number comes next?",
    next,
    up ? [next + step, next + 1, next - 1, next + 10] : [next - step, next + 1, next - 1, last + step],
    `Each number ${up ? "goes up" : "goes down"} by ${step}. ${last} ${up ? "+" : "−"} ${step} = ${next}.`,
    eq(`${terms.join(", ")}, ☐`),
    { min: 0, max: 1100 },
  );
}

function missingTerm(d: Level): Question {
  const { terms, step, up } = makePattern(d, 5);
  const gap = randInt(1, 3);
  return typeIn(
    "What number is missing from the pattern?",
    terms[gap],
    `The numbers go ${up ? "up" : "down"} by ${step} each time. ${terms[gap - 1]} ${up ? "+" : "−"} ${step} = ${terms[gap]}.`,
    eq(terms.map((t, i) => (i === gap ? "☐" : String(t))).join(", ")),
  );
}

function ruleWords(d: Level): Question {
  const { terms, step, up } = makePattern(d, 4);
  const rule = (start: number, by: number, add: boolean) => `Start at ${start} and ${add ? "add" : "subtract"} ${by} each time`;
  const other = step >= 10 ? step * 2 : step + 1;
  return pickOne(
    "Which pattern rule fits?",
    rule(terms[0], step, up),
    [rule(terms[0], step, !up), rule(terms[0], other, up), rule(terms[1], step, up)],
    `The pattern starts at ${terms[0]}. Then it changes by the same amount each time: ${terms[0]} to ${terms[1]} is ${up ? "+" : "−"}${step}.`,
    eq(terms.join(", ")),
  );
}

function patternKind(): Question {
  const kind = pick(["increasing", "decreasing", "repeating"] as const);
  const s = randInt(1, 2);
  const a = randInt(1, 3);
  const heights =
    kind === "increasing"
      ? [a, a + s, a + 2 * s, a + 3 * s]
      : kind === "decreasing"
        ? [a + 3 * s, a + 2 * s, a + s, a]
        : [a, a + s + 1, a, a + s + 1, a];
  return pickOne(
    "What kind of pattern is this?",
    cap(kind),
    ["Increasing", "Decreasing", "Repeating"],
    "Increasing patterns get bigger each time. Decreasing patterns get smaller. In a repeating pattern, the same part comes again and again.",
    { type: "towers", heights },
  );
}

function towersNext(): Question {
  const step = randInt(1, 3);
  const start = randInt(1, 3);
  const heights = [0, 1, 2].map((i) => start + i * step);
  const next = start + 3 * step;
  return numChoice(
    "How many blocks will the next tower have?",
    next,
    [next + 1, next - 1, heights[2] + 1],
    `Each tower has ${plural(step, "more block", "more blocks")} than the one before. ${heights[2]} + ${step} = ${next}.`,
    { type: "towers", heights, showBlank: true },
    { min: 1, max: 15 },
  );
}

const TABLE_CONTEXTS: { x: string; y: string; word: string; fixed?: number }[] = [
  { x: "Bikes", y: "Wheels", word: "wheels", fixed: 2 },
  { x: "Tricycles", y: "Wheels", word: "wheels", fixed: 3 },
  { x: "Cars", y: "Wheels", word: "wheels", fixed: 4 },
  { x: "Hands", y: "Fingers", word: "fingers", fixed: 5 },
  { x: "Week", y: "Dollars saved", word: "dollars" },
  { x: "Day", y: "Pages read", word: "pages" },
  { x: "Week", y: "Plant height (cm)", word: "centimetres" },
];

function tableRule(d: Level): Question {
  const ctx = pick(d === 1 ? TABLE_CONTEXTS.filter((c) => c.fixed) : TABLE_CONTEXTS);
  const step = ctx.fixed ?? (d === 2 ? randInt(2, 5) : randInt(3, 9));
  const start = ctx.fixed ?? randInt(2, 20);
  const shown = d === 2 ? 4 : 3;
  const askAt = d === 3 ? 6 : shown + 1;
  const value = (x: number) => start + (x - 1) * step;
  const rest = range(shown + 1, askAt).map(value);
  return typeIn(
    "Follow the pattern. What number goes where the ? is?",
    value(askAt),
    `Each row has ${step} more ${ctx.word}. Keep adding ${step}: ${value(shown)} → ${rest.join(" → ")}.`,
    {
      type: "table",
      headers: [ctx.x, ctx.y],
      rows: [...range(1, shown).map((x) => [x, value(x)]), [askAt, "?"]],
    },
  );
}

function useRule(): Question {
  const up = chance(0.5);
  const k = pick([3, 4, 6, 7, 8, 9, 25]);
  const s = up ? randInt(10, 200) : k * 4 + randInt(5, 100);
  const terms = range(0, 4).map((i) => (up ? s + i * k : s - i * k));
  return typeIn(
    `Start at ${s}. ${up ? "Add" : "Subtract"} ${k} each time. What is the 5th number?`,
    terms[4],
    `Write the numbers out: ${terms.join(", ")}. The 5th number is ${terms[4]}.`,
  );
}

function eqPair(d: Level): [number, number] {
  if (d === 1) {
    const a = randInt(3, 12);
    return [a, randInt(2, 20 - a)];
  }
  if (d === 2) {
    const a = randInt(12, 65);
    return [a, randInt(5, 99 - a)];
  }
  const a = randInt(12, 60) * 10 + pick([0, 5]);
  return [a, randInt(5, Math.floor((1000 - a) / 5)) * 5];
}

function unknownAdd(d: Level): Question {
  const [a, b] = eqPair(d);
  const c = a + b;
  return numChoice(
    "What number goes in the box?",
    b,
    [b + 1, b - 1, a + c, b + 10, b - 10],
    `Count up from ${a} to ${c}, or think ${c} − ${a} = ${b}.`,
    eq(`${a} + ☐ = ${c}`),
    { min: 0, max: 1000 },
  );
}

function unknownFirst(d: Level): Question {
  const [a, b] = eqPair(d);
  const c = a + b;
  return typeIn(
    "What number goes in the box?",
    a,
    `What number plus ${b} makes ${c}? Think ${c} − ${b} = ${a}.`,
    eq(`☐ + ${b} = ${c}`),
  );
}

function unknownSub(d: Level, input: boolean): Question {
  const [a, b] = eqPair(d);
  const whole = a + b;
  const takeAway = chance(0.5);
  const answer = takeAway ? b : whole;
  const visual = takeAway ? eq(`${whole} − ☐ = ${a}`) : eq(`☐ − ${b} = ${a}`);
  const hint = takeAway
    ? `What do you take away from ${whole} to leave ${a}? Count up from ${a} to ${whole}: ${b}.`
    : `Something take away ${b} leaves ${a}. Put the ${b} back: ${a} + ${b} = ${whole}.`;
  if (input) return typeIn("What number goes in the box?", answer, hint, visual);
  return numChoice(
    "What number goes in the box?",
    answer,
    takeAway ? [b + 1, b - 1, whole + a] : [a - b, whole + 1, whole - 1, whole + 10],
    hint,
    visual,
    { min: 0, max: 2000 },
  );
}

const STORY_THINGS = ["stickers", "marbles", "shells", "trading cards", "beads"];

function storyMatch(d: Level): Question {
  const [a, b] = eqPair(d === 3 ? 2 : d);
  const c = a + b;
  const n = pick(NAMES);
  const t = pick(STORY_THINGS);
  const prompt = "Which equation matches the story? The ☐ is the number we don't know.";
  if (chance(0.5)) {
    return pickOne(
      prompt,
      `☐ + ${b} = ${c}`,
      [`${c} + ${b} = ☐`, `☐ − ${b} = ${c}`],
      `Some ${t}, plus ${b} more, makes ${c}. So ☐ + ${b} = ${c}.`,
      { type: "story", lines: [`${n} had some ${t}.`, `Then ${n} got ${b} more.`, `Now ${n} has ${c}.`] },
    );
  }
  return pickOne(
    prompt,
    `${c} − ☐ = ${a}`,
    [`${c} + ${a} = ☐`, `☐ − ${c} = ${a}`],
    `${n} started with ${c} and gave some away, leaving ${a}. So ${c} − ☐ = ${a}.`,
    { type: "story", lines: [`${n} had ${c} ${t}.`, `${n} gave some to friends.`, `Now ${n} has ${a}.`] },
  );
}

function storySolve(): Question {
  const [a, b] = eqPair(2);
  const c = a + b;
  const n = pick(NAMES);
  const t = pick(STORY_THINGS);
  return typeIn(
    `How many ${t} did ${n} have at first?`,
    a,
    `Write it as ☐ + ${b} = ${c}. To find the ☐, take away the ${b}: ${c} − ${b} = ${a}.`,
    { type: "story", lines: [`${n} had some ${t}.`, `A friend gave ${n} ${b} more.`, `Now ${n} has ${c}.`] },
  );
}

function balance(): Question {
  const a = randInt(11, 49);
  const c = Math.floor(a / 10) * 10 + 10;
  const b = randInt(c - a + 1, 29);
  const answer = a + b - c;
  return numChoice(
    "What number makes both sides equal?",
    answer,
    [a + b, answer + 1, answer - 1, b],
    `Both sides must be worth the same. ${a} + ${b} = ${a + b}, so ${c} + ? = ${a + b}. The box is ${answer}.`,
    eq(`${a} + ${b} = ${c} + ☐`),
    { min: 0, max: 100 },
  );
}

function patternsAndEquations(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  if (d === 1) {
    return buildSet([
      () => nextTerm(1),
      patternKind,
      towersNext,
      () => tableRule(1),
      () => unknownAdd(1),
      () => unknownFirst(1),
      () => storyMatch(1),
      () => unknownSub(1, true),
    ]);
  }
  if (d === 2) {
    return buildSet([
      () => nextTerm(2),
      () => missingTerm(2),
      () => ruleWords(2),
      () => tableRule(2),
      () => unknownAdd(2),
      () => unknownFirst(2),
      () => storyMatch(2),
      () => unknownSub(2, false),
    ]);
  }
  return buildSet([
    () => nextTerm(3),
    () => ruleWords(3),
    useRule,
    () => tableRule(3),
    () => unknownAdd(3),
    () => unknownSub(3, false),
    storySolve,
    balance,
  ]);
}

// =====================================================================
// Measuring
// =====================================================================

const RULER_THINGS = [
  { name: "pencil", emoji: "✏️" },
  { name: "crayon", emoji: "🖍️" },
  { name: "carrot", emoji: "🥕" },
  { name: "key", emoji: "🔑" },
  { name: "paintbrush", emoji: "🖌️" },
  { name: "spoon", emoji: "🥄" },
  { name: "caterpillar", emoji: "🐛" },
  { name: "feather", emoji: "🪶" },
];

function rulerQ(d: Level, input: boolean): Question {
  const obj = pick(RULER_THINGS);
  const length = d === 1 ? randInt(3, 10) : randInt(4, 14);
  const prompt = `How long is the ${obj.name}?`;
  const hint = `The ${obj.name} starts at 0. Read the number at its end: ${length} cm.`;
  const visual: Visual = { type: "ruler", length, emoji: obj.emoji };
  return input
    ? typeIn(prompt, length, hint, visual, { suffix: "cm" })
    : numChoice(prompt, length, [length + 1, length - 1, length + 2], hint, visual, {
        min: 1,
        max: 15,
        fmt: (n) => `${n} cm`,
      });
}

type Attr = "length" | "mass" | "capacity";

interface Thing {
  name: string;
  emoji: string;
}

const UNIT_SETS: Record<
  Attr,
  { smallUnit: string; bigUnit: string; otherUnits: string[]; ask: (t: string) => string; small: Thing[]; big: Thing[]; hint: string }
> = {
  length: {
    smallUnit: "centimetres",
    bigUnit: "metres",
    otherUnits: ["kilograms", "litres"],
    ask: (t) => `Which unit would you use to measure the length of ${t}?`,
    small: [
      { name: "a crayon", emoji: "🖍️" },
      { name: "a ladybug", emoji: "🐞" },
      { name: "a book", emoji: "📕" },
      { name: "a spoon", emoji: "🥄" },
      { name: "a leaf", emoji: "🍃" },
    ],
    big: [
      { name: "a swimming pool", emoji: "🏊" },
      { name: "a soccer field", emoji: "⚽" },
      { name: "a school bus", emoji: "🚌" },
      { name: "a train", emoji: "🚆" },
      { name: "a hallway", emoji: "🚪" },
    ],
    hint: "Use centimetres for short things and metres for long things. 1 metre is 100 centimetres.",
  },
  mass: {
    smallUnit: "grams",
    bigUnit: "kilograms",
    otherUnits: ["metres", "millilitres"],
    ask: (t) => `Which unit would you use to measure the mass of ${t}?`,
    small: [
      { name: "a paper clip", emoji: "📎" },
      { name: "a strawberry", emoji: "🍓" },
      { name: "a feather", emoji: "🪶" },
      { name: "a grape", emoji: "🍇" },
      { name: "a coin", emoji: "🪙" },
    ],
    big: [
      { name: "a watermelon", emoji: "🍉" },
      { name: "a dog", emoji: "🐕" },
      { name: "a bicycle", emoji: "🚲" },
      { name: "a pumpkin", emoji: "🎃" },
      { name: "a bag of potatoes", emoji: "🥔" },
    ],
    hint: "Grams are for light things, like a paper clip. Kilograms are for heavy things, like a bag of potatoes. 1 kilogram is 1000 grams.",
  },
  capacity: {
    smallUnit: "millilitres",
    bigUnit: "litres",
    otherUnits: ["grams", "centimetres"],
    ask: (t) => `Which unit would you use to measure how much ${t} holds?`,
    small: [
      { name: "a spoon", emoji: "🥄" },
      { name: "a juice box", emoji: "🧃" },
      { name: "a baby bottle", emoji: "🍼" },
      { name: "a teacup", emoji: "☕" },
    ],
    big: [
      { name: "a bathtub", emoji: "🛁" },
      { name: "a bucket", emoji: "🪣" },
      { name: "a fish tank", emoji: "🐠" },
      { name: "a big soup pot", emoji: "🍲" },
    ],
    hint: "Millilitres are for small amounts, like a spoonful. Litres are for big amounts, like a bucket of water. 1 litre is 1000 millilitres.",
  },
};

function chooseUnit(attr: Attr): Question {
  const set = UNIT_SETS[attr];
  const isBig = chance(0.5);
  const thing = pick(isBig ? set.big : set.small);
  return pickOne(
    set.ask(thing.name),
    isBig ? set.bigUnit : set.smallUnit,
    [isBig ? set.smallUnit : set.bigUnit, pick(set.otherUnits)],
    set.hint,
    { type: "emoji", emoji: thing.emoji },
  );
}

const ESTIMATES: { q: string; emoji: string; right: string; wrong: string[]; hint: string }[] = [
  { q: "About how long is a new pencil?", emoji: "✏️", right: "19 cm", wrong: ["19 m", "190 cm"], hint: "A pencil fits in your hand, so it's measured in centimetres: about 19 cm." },
  { q: "About how tall is a classroom door?", emoji: "🚪", right: "2 m", wrong: ["2 cm", "20 m"], hint: "A door is a bit taller than a grown-up, but much shorter than a house: about 2 m." },
  { q: "About how long is a school bus?", emoji: "🚌", right: "12 m", wrong: ["12 cm", "120 m"], hint: "A school bus is long, so use metres. It's about as long as 12 big steps: about 12 m." },
  { q: "About how tall is a Grade 3 student?", emoji: "🧒", right: "130 cm", wrong: ["13 cm", "130 m"], hint: "A Grade 3 student is a bit taller than 1 metre (100 cm): about 130 cm." },
  { q: "About how long is a paper clip?", emoji: "📎", right: "3 cm", wrong: ["3 m", "30 cm"], hint: "A paper clip is tiny, shorter than your finger: about 3 cm." },
  { q: "About how heavy is an apple?", emoji: "🍎", right: "150 g", wrong: ["150 kg", "15 kg"], hint: "An apple is light enough to measure in grams: about 150 g." },
  { q: "About how heavy is a bag of potatoes?", emoji: "🥔", right: "5 kg", wrong: ["5 g", "500 kg"], hint: "A bag of potatoes is heavy to carry, so use kilograms: about 5 kg." },
  { q: "About how heavy is a paper clip?", emoji: "📎", right: "1 g", wrong: ["1 kg", "100 g"], hint: "A paper clip is very light. Its mass is about 1 gram." },
  { q: "About how heavy is a watermelon?", emoji: "🍉", right: "4 kg", wrong: ["4 g", "40 kg"], hint: "A watermelon is heavy, but you can still carry it: about 4 kg." },
  { q: "About how heavy is a child's bicycle?", emoji: "🚲", right: "10 kg", wrong: ["10 g", "100 kg"], hint: "A child's bike is heavy, but a grown-up can lift it easily: about 10 kg." },
  { q: "About how much does a juice box hold?", emoji: "🧃", right: "200 mL", wrong: ["200 L", "20 L"], hint: "A juice box holds a small drink, so use millilitres: about 200 mL." },
  { q: "About how much water does a bathtub hold?", emoji: "🛁", right: "150 L", wrong: ["150 mL", "15 mL"], hint: "A bathtub holds lots of water, so use litres: about 150 L." },
  { q: "About how much does a teaspoon hold?", emoji: "🥄", right: "5 mL", wrong: ["5 L", "500 mL"], hint: "A teaspoon holds just a tiny bit: about 5 mL." },
  { q: "About how much milk is in a big carton?", emoji: "🥛", right: "2 L", wrong: ["2 mL", "20 L"], hint: "A big carton of milk holds about 2 litres." },
  { q: "About how much water does a bucket hold?", emoji: "🪣", right: "10 L", wrong: ["10 mL", "100 L"], hint: "A bucket holds lots of water, so use litres: about 10 L." },
];

function estimateMeasure(): Question {
  const e = pick(ESTIMATES);
  return pickOne(e.q, e.right, e.wrong, e.hint, { type: "emoji", emoji: e.emoji });
}

const CONVERSIONS = [
  { small: "centimetres", big: "metre", bigs: "metres", per: 100 },
  { small: "grams", big: "kilogram", bigs: "kilograms", per: 1000 },
  { small: "millilitres", big: "litre", bigs: "litres", per: 1000 },
];

function convertUnits(d: Level): Question {
  const c = d === 1 ? CONVERSIONS[0] : pick(CONVERSIONS);
  if (d === 3 && chance(0.3)) {
    return typeIn(
      `How many ${c.small} are in half a ${c.big}?`,
      c.per / 2,
      `1 ${c.big} is ${c.per} ${c.small}. Half of ${c.per} is ${c.per / 2}.`,
    );
  }
  const k = d === 1 ? 1 : d === 2 ? randInt(1, 2) : randInt(2, 5);
  return typeIn(
    `How many ${c.small} are in ${plural(k, c.big, c.bigs)}?`,
    k * c.per,
    k === 1 ? `1 ${c.big} is ${c.per} ${c.small}.` : `1 ${c.big} is ${c.per} ${c.small}, so ${k} ${c.bigs} is ${k} × ${c.per} = ${k * c.per}.`,
  );
}

const COMPARE_UNITS: Record<Attr, { big: string; small: string; per: number; ask: string }> = {
  length: { big: "m", small: "cm", per: 100, ask: "Which is longer" },
  mass: { big: "kg", small: "g", per: 1000, ask: "Which is heavier" },
  capacity: { big: "L", small: "mL", per: 1000, ask: "Which holds more" },
};

function compareMeasure(d: Level): Question {
  const attr = pick(["length", "mass", "capacity"] as const);
  const u = COMPARE_UNITS[attr];
  const same = "They are the same";
  if (d === 1) {
    return pickOne(
      `${u.ask}: 1 ${u.big} or 1 ${u.small}?`,
      `1 ${u.big}`,
      [`1 ${u.small}`, same],
      `1 ${u.big} is ${u.per} ${u.small}, so 1 ${u.big} is much more than 1 ${u.small}.`,
    );
  }
  const k = d === 2 ? 1 : randInt(2, 4);
  const offsets = u.per === 100 ? [20, 30, 50] : [200, 250, 500];
  const smallAmount = chance(0.25) ? k * u.per : k * u.per + pick([-1, 1]) * pick(offsets);
  const bigText = `${k} ${u.big}`;
  const smallText = `${smallAmount} ${u.small}`;
  const right = smallAmount === k * u.per ? same : smallAmount > k * u.per ? smallText : bigText;
  const options = [bigText, smallText, same];
  return pickOne(
    `${u.ask}: ${bigText} or ${smallText}?`,
    right,
    options.filter((o) => o !== right),
    right === same
      ? `Change to the same unit: 1 ${u.big} = ${u.per} ${u.small}, so ${bigText} is exactly ${smallText}.`
      : `Change to the same unit: 1 ${u.big} = ${u.per} ${u.small}, so ${bigText} = ${k * u.per} ${u.small}. Now compare ${k * u.per} ${u.small} with ${smallText}.`,
  );
}

function measureStory(d: Level): Question {
  const n = pick(NAMES);
  if (d === 3) {
    const s = pick([
      () => {
        const a = pick([1000, 2000]);
        const b = randInt(2, a / 50 - 2) * 50;
        return {
          text: `A jug holds ${a} mL of juice. ${n} pours out ${b} mL. How many millilitres are left?`,
          ans: a - b,
          suffix: "mL",
          emoji: "🧃",
          hint: `Take away: ${a} − ${b}. ${countUpHint(a, b)}`,
        };
      },
      () => {
        const a = pick([1000, 2000]);
        const b = randInt(2, a / 50 - 2) * 50;
        return {
          text: `A bag has ${a} g of flour. ${n} uses ${b} g to bake bread. How many grams are left?`,
          ans: a - b,
          suffix: "g",
          emoji: "🍞",
          hint: `Take away: ${a} − ${b}. ${countUpHint(a, b)}`,
        };
      },
      () => {
        const a = randInt(150, 300);
        const b = randInt(25, 120);
        return {
          text: `A ribbon is ${a} cm long. ${n} cuts off ${b} cm. How long is the ribbon now?`,
          ans: a - b,
          suffix: "cm",
          emoji: "🎀",
          hint: `Take away: ${a} − ${b}. ${countUpHint(a, b)}`,
        };
      },
    ])();
    return typeIn(s.text, s.ans, s.hint, { type: "emoji", emoji: s.emoji }, { suffix: s.suffix });
  }
  const big = d === 2;
  const s = pick([
    () => {
      const a = big ? randInt(40, 95) : randInt(12, 20);
      const b = big ? randInt(11, a - 15) : randInt(2, 9);
      return { text: `A ribbon is ${a} cm long. ${n} cuts off ${b} cm. How long is the ribbon now?`, ans: a - b, suffix: "cm", emoji: "🎀", sign: "−", a, b };
    },
    () => {
      const a = big ? randInt(30, 80) : randInt(5, 12);
      const b = big ? randInt(5, 19) : randInt(2, 8);
      return { text: `A sunflower is ${a} cm tall. It grows ${b} cm more. How tall is it now?`, ans: a + b, suffix: "cm", emoji: "🌻", sign: "+", a, b };
    },
    () => {
      const a = big ? randInt(15, 40) : randInt(6, 12);
      const b = big ? randInt(2, 9) : randInt(1, 4);
      return { text: `A puppy has a mass of ${a} kg. A kitten has a mass of ${b} kg. How much more mass does the puppy have?`, ans: a - b, suffix: "kg", emoji: "🐶", sign: "−", a, b };
    },
    () => {
      const a = big ? randInt(10, 30) : randInt(2, 6);
      const b = big ? randInt(5, 15) : randInt(1, 4);
      return { text: `A pot has ${a} L of soup. ${n} adds ${b} L more. How many litres of soup now?`, ans: a + b, suffix: "L", emoji: "🍲", sign: "+", a, b };
    },
  ])();
  return typeIn(
    s.text,
    s.ans,
    `${s.sign === "+" ? "Add" : "Take away"}: ${s.a} ${s.sign} ${s.b} = ${s.ans} ${s.suffix}.`,
    { type: "emoji", emoji: s.emoji },
    { suffix: s.suffix },
  );
}

function perimeter(): Question {
  const kind = pick(["rectangle", "square", "triangle"] as const);
  if (kind === "rectangle") {
    const l = randInt(4, 12);
    const w = randInt(2, l - 1);
    return typeIn(
      `A garden is a rectangle ${l} m long and ${w} m wide. How far is it all the way around?`,
      2 * (l + w),
      `Add all four sides: ${l} + ${w} + ${l} + ${w} = ${2 * (l + w)} m.`,
      { type: "shape", shape: "rectangle" },
      { suffix: "m" },
    );
  }
  if (kind === "square") {
    const s = randInt(3, 12);
    return typeIn(
      `Each side of a square sandbox is ${s} m long. How far is it all the way around?`,
      4 * s,
      `A square has 4 equal sides: ${s} + ${s} + ${s} + ${s} = ${4 * s} m.`,
      { type: "shape", shape: "square" },
      { suffix: "m" },
    );
  }
  const a = randInt(3, 9);
  const b = randInt(3, 9);
  const c = randInt(Math.abs(a - b) + 1, a + b - 1);
  return typeIn(
    `A triangle has sides ${a} cm, ${b} cm and ${c} cm long. How far is it all the way around?`,
    a + b + c,
    `Add the three sides: ${a} + ${b} + ${c} = ${a + b + c} cm.`,
    { type: "shape", shape: "triangle" },
    { suffix: "cm" },
  );
}

function measuring(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  if (d === 1) {
    return buildSet([
      () => rulerQ(1, false),
      () => rulerQ(1, true),
      () => chooseUnit("length"),
      () => chooseUnit("mass"),
      () => chooseUnit("capacity"),
      estimateMeasure,
      () => compareMeasure(1),
      () => measureStory(1),
    ]);
  }
  const [u1, u2] = sample(["length", "mass", "capacity"] as const, 2);
  if (d === 2) {
    return buildSet([
      () => rulerQ(2, true),
      () => chooseUnit(u1),
      () => chooseUnit(u2),
      estimateMeasure,
      estimateMeasure,
      () => convertUnits(2),
      () => compareMeasure(2),
      () => measureStory(2),
    ]);
  }
  return buildSet([
    () => rulerQ(3, false),
    () => chooseUnit(u1),
    estimateMeasure,
    estimateMeasure,
    () => convertUnits(3),
    () => compareMeasure(3),
    () => measureStory(3),
    perimeter,
  ]);
}

// =====================================================================
// Time
// =====================================================================

const wrapHour = (h: number) => ((((h - 1) % 12) + 12) % 12) + 1;
const clockText = (h: number, m: number) => `${wrapHour(h)}:${String(m).padStart(2, "0")}`;

/** The clock time `mins` minutes after h:m (12-hour clock). */
function addMinutes(h: number, m: number, mins: number): [number, number] {
  const total = (((h * 60 + m + mins) % 720) + 720) % 720;
  return [wrapHour(Math.floor(total / 60)), total % 60];
}

const at = (h: number, m: number, mins: number) => clockText(...addMinutes(h, m, mins));

function durText(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const parts = [h ? plural(h, "hour") : "", m ? plural(m, "minute") : ""].filter(Boolean);
  return parts.join(" and ");
}

function readClock(d: Level): Question {
  const h = randInt(1, 12);
  let m: number;
  if (d === 1) m = pick([0, 15, 30, 45]);
  else if (d === 2) m = randInt(1, 11) * 5;
  else if (chance(0.5)) m = randInt(7, 11) * 5;
  else {
    do m = randInt(1, 58);
    while (m % 5 === 0);
  }
  const wrong: string[] = [clockText(m >= 30 ? h + 1 : h - 1, m)];
  if (m % 5 === 0) {
    const handAt = m === 0 ? 12 : m / 5;
    wrong.push(clockText(h, handAt), clockText(handAt, (h % 12) * 5), clockText(h, (m + 5) % 60));
  } else {
    wrong.push(clockText(h, m + 1 > 59 ? m - 1 : m + 1), clockText(h, m >= 10 ? m - 5 : m + 5), clockText(h, (m + 30) % 60));
  }
  let hint = "The short red hand shows the hour. The long blue hand shows the minutes.";
  if (m === 0) hint += ` The long hand points to 12, so it's exactly ${h} o'clock.`;
  else {
    if (m >= 30) hint += ` The short hand has gone past ${h} but hasn't reached ${wrapHour(h + 1)} yet, so the hour is still ${h}.`;
    hint +=
      m % 5 === 0
        ? ` Count by 5s from the 12 to the long hand: ${m} minutes.`
        : ` Count by 5s from the 12, then count the small marks by 1s: ${plural(m, "minute")}.`;
  }
  return pickOne("What time does the clock show?", clockText(h, m), wrong, `${hint} It's ${clockText(h, m)}.`, {
    type: "clock",
    hour: h,
    minute: m,
  });
}

function minutesPast(d: Level): Question {
  const h = randInt(1, 12);
  let m: number;
  if (d === 1) m = pick([15, 30, 45]);
  else if (d === 2) m = randInt(1, 11) * 5;
  else {
    do m = randInt(1, 59);
    while (m % 5 === 0);
  }
  return typeIn(
    `How many minutes after ${h} o'clock is it?`,
    m,
    m % 5 === 0
      ? `Start at the 12. Count by 5s to where the long hand points: ${skipList(5, m / 5)}.`
      : `Start at the 12. Count by 5s to ${Math.floor(m / 5) * 5}, then count the small marks by 1s: ${m}.`,
    { type: "clock", hour: h, minute: m },
    { suffix: "minutes" },
  );
}

const TIME_FACTS: Record<Level, { q: string; a: number; hint: string }[]> = {
  1: [
    { q: "How many days are in 1 week?", a: 7, hint: "Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday: 7 days." },
    { q: "How many months are in 1 year?", a: 12, hint: "January to December is 12 months." },
    { q: "How many minutes are in 1 hour?", a: 60, hint: "The long hand goes all the way around the clock in 1 hour. That's 60 minutes." },
    { q: "How many hours are in 1 day?", a: 24, hint: "A whole day and night is 24 hours. The hour hand goes around the clock twice." },
  ],
  2: [
    { q: "How many seconds are in 1 minute?", a: 60, hint: "1 minute is 60 seconds." },
    { q: "How many minutes are in half an hour?", a: 30, hint: "1 hour is 60 minutes. Half of 60 is 30." },
    { q: "How many minutes are in a quarter of an hour?", a: 15, hint: "1 hour is 60 minutes. A quarter is 1 of 4 equal parts: 15 minutes." },
    { q: "How many days are in 2 weeks?", a: 14, hint: "1 week is 7 days. 7 + 7 = 14." },
  ],
  3: [
    { q: "How many minutes are in 2 hours?", a: 120, hint: "1 hour is 60 minutes. 60 + 60 = 120." },
    { q: "How many days are in 3 weeks?", a: 21, hint: "1 week is 7 days. 7 + 7 + 7 = 21." },
    { q: "How many hours are in 2 days?", a: 48, hint: "1 day is 24 hours. 24 + 24 = 48." },
    { q: "How many months are in 2 years?", a: 24, hint: "1 year is 12 months. 12 + 12 = 24." },
    { q: "How many seconds are in 2 minutes?", a: 120, hint: "1 minute is 60 seconds. 60 + 60 = 120." },
  ],
};

function timeFact(d: Level): Question {
  const f = pick(TIME_FACTS[d]);
  return typeIn(f.q, f.a, f.hint, { type: "emoji", emoji: "⏳" });
}

function timeLater(): Question {
  const h = randInt(1, 12);
  const m = pick([0, 30]);
  const add = pick([30, 60, 120]);
  return pickOne(
    `What time will it be in ${durText(add)}?`,
    at(h, m, add),
    [at(h, m, add + 30), at(h, m, add - 30), at(h, m, -add), at(h, m, add + 60)],
    `It's ${clockText(h, m)} now. Count on ${durText(add)}: ${at(h, m, add)}.`,
    { type: "clock", hour: h, minute: m },
  );
}

const ACTIVITIES = ["Soccer practice", "The movie", "Art class", "Swimming lessons", "Music practice", "The library visit", "The bus ride"];

function countOnHint(h: number, m: number, dur: number): string {
  const toHour = 60 - m;
  const start = clockText(h, m);
  if (dur < toHour) return `Count on ${durText(dur)} from ${start}: ${at(h, m, dur)}.`;
  if (dur === toHour) return `From ${start}, ${dur} minutes gets you to ${at(h, m, dur)}.`;
  return `From ${start}, ${toHour} minutes gets you to ${at(h, m, toHour)}. Then ${durText(dur - toHour)} more is ${at(h, m, dur)}.`;
}

function endTime(d: Level): Question {
  const act = pick(ACTIVITIES);
  const h = randInt(1, 11);
  let m: number, dur: number;
  if (d === 1) {
    m = 0;
    dur = randInt(1, 3) * 60;
  } else if (d === 2) {
    m = pick([0, 30]);
    dur = pick([15, 30, 45, 60, 90]);
  } else {
    do {
      m = randInt(2, 11) * 5;
      dur = randInt(4, 11) * 5;
    } while (m + dur <= 60);
  }
  const [, em] = addMinutes(h, m, dur);
  const forgotHour = clockText(h, em);
  return pickOne(
    `${act} starts at ${clockText(h, m)} and lasts ${durText(dur)}. What time does it end?`,
    at(h, m, dur),
    d === 3
      ? [forgotHour, at(h, m, dur + 15), at(h, m, dur - 15), at(h, m, dur + 60)]
      : [at(h, m, dur + 60), at(h, m, dur - 15), at(h, m, dur + 30), forgotHour],
    d === 1 ? `Count on ${durText(dur)} from ${clockText(h, m)}: ${at(h, m, dur)}.` : countOnHint(h, m, dur),
    { type: "clock", hour: h, minute: m },
  );
}

function howLong(): Question {
  const act = pick(ACTIVITIES);
  const h = randInt(1, 11);
  const m = pick([0, 30]);
  const dur = pick([30, 45, 60, 90, 120]);
  return pickOne(
    `${act} starts at ${clockText(h, m)} and ends at ${at(h, m, dur)}. How long is it?`,
    durText(dur),
    [durText(dur + 30), durText(dur - 15), durText(dur + 60), durText(dur - 30)].filter((t) => t !== ""),
    countOnHint(h, m, dur),
    { type: "table", headers: ["Starts", "Ends"], rows: [[clockText(h, m), at(h, m, dur)]] },
  );
}

function howLongMinutes(): Question {
  const act = pick(ACTIVITIES);
  const h = randInt(1, 11);
  let m: number, dur: number;
  do {
    m = randInt(5, 11) * 5;
    dur = randInt(3, 11) * 5;
  } while (m + dur <= 60);
  const toHour = 60 - m;
  return typeIn(
    `${act} starts at ${clockText(h, m)} and ends at ${at(h, m, dur)}. How many minutes long is it?`,
    dur,
    `From ${clockText(h, m)} to ${at(h, m, toHour)} is ${toHour} minutes. Then to ${at(h, m, dur)} is ${dur - toHour} more. ${toHour} + ${dur - toHour} = ${dur}.`,
    { type: "table", headers: ["Starts", "Ends"], rows: [[clockText(h, m), at(h, m, dur)]] },
    { suffix: "minutes" },
  );
}

const TIME_UNITS = ["seconds", "minutes", "hours", "days", "weeks", "months", "years"];

const DURATIONS = [
  { what: "how long it takes to blink", unit: "seconds", emoji: "😉" },
  { what: "how long it takes to clap 3 times", unit: "seconds", emoji: "👏" },
  { what: "how long it takes to brush your teeth", unit: "minutes", emoji: "🪥" },
  { what: "how long it takes to eat a snack", unit: "minutes", emoji: "🍎" },
  { what: "how long a school day lasts", unit: "hours", emoji: "🏫" },
  { what: "how long you sleep at night", unit: "hours", emoji: "😴" },
  { what: "how old a grandparent is", unit: "years", emoji: "👵" },
  { what: "how long it takes a baby to grow up", unit: "years", emoji: "👶" },
];

function bestTimeUnit(): Question {
  const item = pick(DURATIONS);
  const i = TIME_UNITS.indexOf(item.unit);
  const far = TIME_UNITS.filter((_, j) => Math.abs(j - i) >= 2);
  return pickOne(
    `Which unit would you use to measure ${item.what}?`,
    item.unit,
    sample(far, 2),
    "Think about how long it really takes. Seconds are very short, minutes are a bit longer, hours are long, and years are very, very long.",
    { type: "emoji", emoji: item.emoji },
  );
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function calendar(d: Level): Question {
  if (d === 1) {
    const i = randInt(0, 11);
    return pickOne(
      `What month comes after ${MONTHS[i]}?`,
      MONTHS[(i + 1) % 12],
      [MONTHS[(i + 11) % 12], MONTHS[(i + 2) % 12]],
      `Say the months in order: ${MONTHS[i]}, then ${MONTHS[(i + 1) % 12]}.`,
      { type: "emoji", emoji: "📅" },
    );
  }
  if (d === 2) {
    const i = randInt(0, 11);
    const k = randInt(2, 4);
    return pickOne(
      `What month is ${k} months after ${MONTHS[i]}?`,
      MONTHS[(i + k) % 12],
      [MONTHS[(i + k - 1) % 12], MONTHS[(i + k + 1) % 12], MONTHS[(i - k + 12) % 12]],
      `Count on ${k} months from ${MONTHS[i]}: ${range(1, k)
        .map((j) => MONTHS[(i + j) % 12])
        .join(", ")}.`,
      { type: "emoji", emoji: "📅" },
    );
  }
  const i = randInt(0, 6);
  const k = randInt(8, 13);
  return pickOne(
    `Today is ${DAYS[i]}. What day of the week will it be in ${k} days?`,
    DAYS[(i + k) % 7],
    [DAYS[(i + k + 1) % 7], DAYS[(i + k + 6) % 7], DAYS[(i + k + 2) % 7]],
    `In 7 days it will be ${DAYS[i]} again. Then count ${plural(k - 7, "more day", "more days")}: ${DAYS[(i + k) % 7]}.`,
    { type: "emoji", emoji: "📅" },
  );
}

const DURATION_PAIRS: { a: string; b: string; longer: "a" | "b" | "same"; why: string }[] = [
  { a: "90 minutes", b: "1 hour", longer: "a", why: "1 hour is 60 minutes, and 90 is more than 60." },
  { a: "2 hours", b: "100 minutes", longer: "a", why: "2 hours is 120 minutes, and 120 is more than 100." },
  { a: "1 week", b: "10 days", longer: "b", why: "1 week is 7 days, and 10 days is more than 7." },
  { a: "50 seconds", b: "1 minute", longer: "b", why: "1 minute is 60 seconds, and 60 is more than 50." },
  { a: "1 year", b: "10 months", longer: "a", why: "1 year is 12 months, and 12 is more than 10." },
  { a: "30 hours", b: "1 day", longer: "a", why: "1 day is 24 hours, and 30 is more than 24." },
  { a: "3 weeks", b: "20 days", longer: "a", why: "3 weeks is 21 days, and 21 is more than 20." },
  { a: "60 minutes", b: "1 hour", longer: "same", why: "1 hour is exactly 60 minutes." },
  { a: "14 days", b: "2 weeks", longer: "same", why: "2 weeks is 7 + 7 = 14 days." },
];

function compareDurations(): Question {
  const p = pick(DURATION_PAIRS);
  const same = "They are the same";
  const right = p.longer === "a" ? p.a : p.longer === "b" ? p.b : same;
  return pickOne(
    `Which is longer: ${p.a} or ${p.b}?`,
    right,
    [p.a, p.b, same].filter((x) => x !== right),
    `Change them to the same unit. ${p.why}`,
    { type: "emoji", emoji: "⏱️" },
  );
}

function time(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  if (d === 1) {
    return buildSet([
      () => readClock(1),
      () => readClock(1),
      () => minutesPast(1),
      () => timeFact(1),
      timeLater,
      () => endTime(1),
      bestTimeUnit,
      () => calendar(1),
    ]);
  }
  if (d === 2) {
    return buildSet([
      () => readClock(2),
      () => readClock(2),
      () => minutesPast(2),
      () => timeFact(2),
      () => endTime(2),
      howLong,
      bestTimeUnit,
      () => calendar(2),
    ]);
  }
  return buildSet([
    () => readClock(3),
    () => readClock(3),
    () => minutesPast(3),
    () => timeFact(3),
    () => endTime(3),
    howLongMinutes,
    compareDurations,
    () => calendar(3),
  ]);
}

// =====================================================================
// 3D Objects
// =====================================================================

const SOLID_NAMES: Partial<Record<ShapeName, string>> = {
  cube: "cube",
  "rectangular-prism": "rectangular prism",
  pyramid: "pyramid",
  cylinder: "cylinder",
  cone: "cone",
  sphere: "sphere",
};

const SOLID_HINTS: Partial<Record<ShapeName, string>> = {
  cube: "A cube has 6 square faces that are all the same size.",
  "rectangular-prism": "A rectangular prism is shaped like a box. Its faces are rectangles.",
  pyramid: "A pyramid has triangle faces that meet at a point on top.",
  cylinder: "A cylinder has 2 flat circle faces and a curved side, like a can.",
  cone: "A cone has 1 flat circle face and a curved side that comes to a point.",
  sphere: "A sphere is round all over, like a ball.",
};

const solidOpt = (shape: ShapeName): Opt => ({ label: SOLID_NAMES[shape]!, shape });

/** Wrong 3D answers. A cube is also a rectangular prism, so never offer one as wrong for the other. */
function otherSolids(right: ShapeName, pool: ShapeName[], count: number): Opt[] {
  const clash = (s: ShapeName) =>
    (right === "cube" && s === "rectangular-prism") || (right === "rectangular-prism" && s === "cube");
  return sample(
    pool.filter((s) => s !== right && !clash(s)),
    count,
  ).map(solidOpt);
}

const ALL_SOLIDS: ShapeName[] = ["cube", "rectangular-prism", "pyramid", "cylinder", "cone", "sphere"];

function nameSolid(d: Level): Question {
  let shape: ShapeName;
  let pool: ShapeName[];
  if (d === 1) {
    pool = ["cube", "cylinder", "cone", "sphere"];
    shape = pick(pool);
  } else if (d === 2) {
    pool = ALL_SOLIDS;
    shape = pick(pool);
  } else {
    shape = pick(["rectangular-prism", "pyramid", "cylinder"] as ShapeName[]);
    pool = ["cube", "rectangular-prism", "pyramid", "cylinder", "cone"];
  }
  return pickOne("What is this 3D object called?", solidOpt(shape), otherSolids(shape, pool, 3), SOLID_HINTS[shape]!, {
    type: "shape",
    shape,
  });
}

const REAL_SOLIDS: { thing: string; emoji: string; shape: ShapeName }[] = [
  { thing: "number cube", emoji: "🎲", shape: "cube" },
  { thing: "ice cube", emoji: "🧊", shape: "cube" },
  { thing: "brick", emoji: "🧱", shape: "rectangular-prism" },
  { thing: "can of soup", emoji: "🥫", shape: "cylinder" },
  { thing: "drum", emoji: "🥁", shape: "cylinder" },
  { thing: "candle", emoji: "🕯️", shape: "cylinder" },
  { thing: "ice cream cone", emoji: "🍦", shape: "cone" },
  { thing: "basketball", emoji: "🏀", shape: "sphere" },
  { thing: "orange", emoji: "🍊", shape: "sphere" },
  { thing: "globe", emoji: "🌍", shape: "sphere" },
];

function realSolid(): Question {
  const r = pick(REAL_SOLIDS);
  return pickOne(
    `${capArticle(r.thing)} ${r.thing} is shaped most like a…`,
    solidOpt(r.shape),
    otherSolids(r.shape, ALL_SOLIDS, 3),
    `Look at its faces. Are they flat or curved? ${SOLID_HINTS[r.shape]}`,
    { type: "emoji", emoji: r.emoji },
  );
}

const FACE_QS: { q: string; solid: ShapeName; right: ShapeName; wrong: ShapeName[]; hint: string }[] = [
  { q: "What shape are the faces of a cube?", solid: "cube", right: "square", wrong: ["triangle", "circle", "hexagon"], hint: "Every face of a cube is a square, and they're all the same size." },
  { q: "What shape is the flat face of a cone?", solid: "cone", right: "circle", wrong: ["triangle", "square", "hexagon"], hint: "Trace the bottom of a cone and you get a circle." },
  { q: "What shape are the 2 flat faces of a cylinder?", solid: "cylinder", right: "circle", wrong: ["square", "triangle", "pentagon"], hint: "Trace the top or bottom of a can and you get a circle." },
  { q: "What shape are the slanted faces of a pyramid?", solid: "pyramid", right: "triangle", wrong: ["circle", "square", "hexagon"], hint: "The slanted faces of a pyramid are triangles that meet at a point on top." },
  { q: "What shape are the faces of a rectangular prism?", solid: "rectangular-prism", right: "rectangle", wrong: ["triangle", "circle", "hexagon"], hint: "A rectangular prism is like a box. Its faces are rectangles." },
];

function faceShape(): Question {
  const f = pick(FACE_QS);
  return pickOne(
    f.q,
    { label: f.right, shape: f.right },
    f.wrong.map((s) => ({ label: s, shape: s })),
    f.hint,
    { type: "shape", shape: f.solid },
  );
}

const SOLID_COUNTS: { shape: ShapeName; name: string; faces: number; edges?: number; vertices?: number; faceHint: string; edgeHint?: string; vertexHint?: string }[] = [
  {
    shape: "cube",
    name: "cube",
    faces: 6,
    edges: 12,
    vertices: 8,
    faceHint: "A cube has a top, a bottom and 4 sides: 1 + 1 + 4 = 6 faces.",
    edgeHint: "An edge is where two faces meet. There are 4 edges around the top, 4 around the bottom and 4 going up the sides: 12.",
    vertexHint: "A vertex is a corner. There are 4 on the top and 4 on the bottom: 8.",
  },
  {
    shape: "rectangular-prism",
    name: "rectangular prism",
    faces: 6,
    edges: 12,
    vertices: 8,
    faceHint: "Top, bottom, front, back, left and right: 6 faces.",
    edgeHint: "An edge is where two faces meet. There are 4 edges around the top, 4 around the bottom and 4 going up the sides: 12.",
    vertexHint: "A vertex is a corner. There are 4 on the top and 4 on the bottom: 8.",
  },
  {
    shape: "pyramid",
    name: "square-based pyramid",
    faces: 5,
    edges: 8,
    vertices: 5,
    faceHint: "1 square on the bottom and 4 triangles around the sides: 5 faces.",
    edgeHint: "4 edges around the square base and 4 going up to the point: 8.",
    vertexHint: "4 corners around the square base and 1 at the top: 5.",
  },
  { shape: "cylinder", name: "cylinder", faces: 2, faceHint: "One circle on the top and one on the bottom. The side is curved, so it isn't a flat face." },
  { shape: "cone", name: "cone", faces: 1, faceHint: "Just 1 circle on the bottom. The rest of a cone is curved." },
];

const solidCounts = (shapes: ShapeName[]) => SOLID_COUNTS.filter((s) => shapes.includes(s.shape));

function countFaces(d: Level): Question {
  const s = pick(solidCounts(d === 1 ? ["cube", "cylinder", "cone"] : d === 2 ? ["cube", "rectangular-prism", "pyramid", "cylinder"] : ["rectangular-prism", "pyramid"]));
  return typeIn(`How many flat faces does a ${s.name} have?`, s.faces, s.faceHint, { type: "shape", shape: s.shape });
}

function countEdges(): Question {
  const s = pick(solidCounts(["cube", "rectangular-prism", "pyramid"]));
  return typeIn(`How many edges does a ${s.name} have?`, s.edges!, s.edgeHint!, { type: "shape", shape: s.shape });
}

function countVertices(d: Level): Question {
  const s = pick(solidCounts(d === 1 ? ["cube"] : ["cube", "rectangular-prism", "pyramid"]));
  const prompt = `How many vertices (corners) does a ${s.name} have?`;
  const visual: Visual = { type: "shape", shape: s.shape };
  if (d === 1) return typeIn(prompt, s.vertices!, s.vertexHint!, visual);
  return numChoice(prompt, s.vertices!, [s.faces, s.edges!, s.vertices! + 1, s.vertices! - 1], s.vertexHint!, visual, {
    min: 1,
    max: 12,
  });
}

const BUILDS: { parts: string; shape: ShapeName }[] = [
  { parts: "6 squares", shape: "cube" },
  { parts: "2 squares and 4 long rectangles", shape: "rectangular-prism" },
  { parts: "1 square and 4 triangles", shape: "pyramid" },
  { parts: "2 circles and a rectangle rolled into a tube", shape: "cylinder" },
  { parts: "1 circle and a curved piece rolled into a point", shape: "cone" },
];

function buildFromFaces(): Question {
  const b = pick(BUILDS);
  const n = pick(NAMES);
  return pickOne(
    `${n} builds a 3D object out of paper using ${b.parts}. What did ${n} build?`,
    solidOpt(b.shape),
    otherSolids(b.shape, ["cube", "rectangular-prism", "pyramid", "cylinder", "cone"], 3),
    `Think about which object has those faces. ${SOLID_HINTS[b.shape]}`,
  );
}

function skeleton(): Question {
  const s = pick(solidCounts(["cube", "rectangular-prism", "pyramid"]));
  const n = pick(NAMES);
  const straws = chance(0.5);
  return typeIn(
    `${n} builds a ${s.name} skeleton with straws for the edges and clay balls for the corners. How many ${straws ? "straws" : "clay balls"} does ${n} need?`,
    straws ? s.edges! : s.vertices!,
    straws ? `One straw for each edge. ${s.edgeHint}` : `One clay ball for each corner (vertex). ${s.vertexHint}`,
    { type: "shape", shape: s.shape },
  );
}

const ROLL_QS: { q: string; right: ShapeName; wrong: ShapeName[]; hint: string }[] = [
  { q: "Which 3D object can roll but can't be stacked?", right: "sphere", wrong: ["cube", "cylinder", "rectangular-prism"], hint: "A sphere is round all over, so it rolls, but nothing can sit flat on it." },
  { q: "Which 3D object can roll AND be stacked?", right: "cylinder", wrong: ["sphere", "cube", "pyramid"], hint: "A cylinder rolls on its curved side and stacks on its flat circle faces." },
  { q: "Which 3D object can be stacked but can't roll?", right: "cube", wrong: ["sphere", "cylinder", "cone"], hint: "A cube has only flat faces, so it stacks but doesn't roll." },
  { q: "Which 3D object has no flat faces?", right: "sphere", wrong: ["cube", "cylinder", "cone"], hint: "A sphere is curved all over, like a ball." },
  { q: "Which 3D object has exactly one flat face?", right: "cone", wrong: ["cylinder", "cube", "sphere"], hint: "A cone has just 1 flat circle on the bottom." },
];

function rollStack(): Question {
  const r = pick(ROLL_QS);
  return pickOne(r.q, solidOpt(r.right), r.wrong.map(solidOpt), r.hint);
}

function objects3d(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  if (d === 1) {
    return buildSet([
      () => nameSolid(1),
      realSolid,
      realSolid,
      faceShape,
      rollStack,
      () => countFaces(1),
      () => countVertices(1),
      buildFromFaces,
    ]);
  }
  if (d === 2) {
    return buildSet([
      () => nameSolid(2),
      realSolid,
      faceShape,
      () => countFaces(2),
      countEdges,
      () => countVertices(2),
      buildFromFaces,
      rollStack,
    ]);
  }
  return buildSet([
    () => nameSolid(3),
    faceShape,
    () => countFaces(3),
    countEdges,
    () => countVertices(3),
    buildFromFaces,
    skeleton,
    rollStack,
  ]);
}

// =====================================================================
// Graphs & Chance
// =====================================================================

const VOTE_TOPICS = [
  {
    title: "Favourite fruit",
    rows: [
      { label: "apples", emoji: "🍎" },
      { label: "bananas", emoji: "🍌" },
      { label: "grapes", emoji: "🍇" },
      { label: "oranges", emoji: "🍊" },
      { label: "pears", emoji: "🍐" },
    ],
  },
  {
    title: "Favourite sport",
    rows: [
      { label: "soccer", emoji: "⚽" },
      { label: "hockey", emoji: "🏒" },
      { label: "basketball", emoji: "🏀" },
      { label: "swimming", emoji: "🏊" },
      { label: "baseball", emoji: "⚾" },
    ],
  },
  {
    title: "Favourite pet",
    rows: [
      { label: "dogs", emoji: "🐶" },
      { label: "cats", emoji: "🐱" },
      { label: "fish", emoji: "🐠" },
      { label: "rabbits", emoji: "🐰" },
      { label: "birds", emoji: "🐦" },
    ],
  },
  {
    title: "Favourite season",
    rows: [
      { label: "spring", emoji: "🌷" },
      { label: "summer", emoji: "☀️" },
      { label: "fall", emoji: "🍂" },
      { label: "winter", emoji: "❄️" },
    ],
  },
  {
    title: "Favourite snack",
    rows: [
      { label: "popcorn", emoji: "🍿" },
      { label: "pretzels", emoji: "🥨" },
      { label: "cheese", emoji: "🧀" },
      { label: "carrots", emoji: "🥕" },
    ],
  },
];

function voteData(values: number[]) {
  const topic = pick(VOTE_TOPICS);
  const rows = sample(topic.rows, values.length);
  return { title: topic.title, rows: rows.map((r, i) => ({ ...r, value: values[i] })) };
}

function pictoData(n: number) {
  const g = voteData(sample(range(1, 9), n));
  return {
    rows: g.rows,
    visual: { type: "pictograph", title: g.title, rows: g.rows.map((r) => ({ label: r.label, emoji: r.emoji, count: r.value })) } as Visual,
  };
}

/** Bar values on a scale of 1s (easier), 2s (on level) or 5s (stretch). */
function barValues(d: Level, n: number): number[] {
  const unit = d === 1 ? 1 : d === 2 ? 2 : 5;
  const minTop = d === 1 ? 0 : d === 2 ? 10 : 20;
  let values: number[];
  do values = sample(range(1, 10), n).map((v) => v * unit);
  while (Math.max(...values) <= minTop);
  return values;
}

function barData(d: Level, n: number) {
  const g = voteData(barValues(d, n));
  return {
    rows: g.rows,
    visual: { type: "bars", title: g.title, bars: g.rows.map((r) => ({ label: r.label, value: r.value, emoji: r.emoji })) } as Visual,
  };
}

const scaleHint = (d: Level) =>
  d === 1 ? "The numbers on the side count by 1s." : `The numbers on the side count by ${d === 2 ? "2s" : "5s"}.`;

function pictoCount(input: boolean): Question {
  const { rows, visual } = pictoData(randInt(3, 4));
  const row = pick(rows);
  const prompt = `How many votes did ${row.label} get?`;
  const hint = `Each picture stands for 1 vote. Count the ${row.emoji} in the ${row.label} row.`;
  return input ? typeIn(prompt, row.value, hint, visual) : numChoice(prompt, row.value, [row.value + 1, row.value - 1], hint, visual, { min: 1, max: 12 });
}

function mostLeast(d: Level): Question {
  const { rows, visual } = d === 1 ? pictoData(randInt(3, 4)) : barData(d, randInt(3, 4));
  const most = chance(0.6);
  const sorted = [...rows].sort((a, b) => b.value - a.value);
  const target = most ? sorted[0] : sorted[sorted.length - 1];
  return pickOne(
    `Which got the ${most ? "most" : "fewest"} votes?`,
    { label: target.label, emoji: target.emoji },
    rows.filter((r) => r !== target).map((r) => ({ label: r.label, emoji: r.emoji })),
    most ? `Look for the longest ${d === 1 ? "row" : "bar"}.` : `Look for the shortest ${d === 1 ? "row" : "bar"}.`,
    visual,
  );
}

function barRead(d: Level): Question {
  const { rows, visual } = barData(d, randInt(3, 4));
  const row = pick(rows);
  return typeIn(
    `How many votes did ${row.label} get?`,
    row.value,
    `Find the top of the ${row.label} bar and look straight across to the numbers. ${scaleHint(d)}`,
    visual,
  );
}

function barCompare(d: Level): Question {
  const { rows, visual } = barData(d, 3);
  const [a, b] = sample(rows, 2).sort((x, y) => y.value - x.value);
  const diff = a.value - b.value;
  const unit = d === 1 ? 1 : d === 2 ? 2 : 5;
  return numChoice(
    `How many more votes did ${a.label} get than ${b.label}?`,
    diff,
    [a.value, diff + unit, diff - unit, a.value + b.value],
    `${cap(a.label)} got ${a.value} and ${b.label} got ${b.value}. ${a.value} − ${b.value} = ${diff}.`,
    visual,
    { min: 1, max: 60 },
  );
}

function barTotal(): Question {
  const { rows, visual } = barData(3, 3);
  const total = rows.reduce((s, r) => s + r.value, 0);
  return typeIn(
    "How many votes were there in all?",
    total,
    `Read each bar, then add: ${rows.map((r) => r.value).join(" + ")} = ${total}.`,
    visual,
  );
}

function keyedTable(k: number, n: number) {
  const g = voteData(sample(range(1, 6), n));
  return {
    rows: g.rows,
    visual: {
      type: "table",
      title: `${g.title} (each ⭐ = ${k} votes)`,
      headers: ["Choice", "Votes"],
      rows: g.rows.map((r) => [`${r.emoji} ${r.label}`, "⭐".repeat(r.value)]),
    } as Visual,
  };
}

function manyToOne(d: Level): Question {
  const k = d === 1 ? 2 : d === 2 ? pick([2, 5]) : pick([5, 10]);
  const { rows, visual } = keyedTable(k, randInt(3, 4));
  const row = pick(rows);
  const votes = row.value * k;
  return numChoice(
    `Each ⭐ stands for ${k} votes. How many votes did ${row.label} get?`,
    votes,
    [row.value, votes + k, votes - k],
    `Count by ${k}s, once for each ⭐: ${skipList(k, row.value)}.`,
    visual,
    { min: 1, max: 100 },
  );
}

function starsNeeded(): Question {
  const k = pick([2, 5, 10]);
  const c = randInt(2, 8);
  return typeIn(
    `In a picture graph, each ⭐ stands for ${k} votes. How many ⭐ show ${k * c} votes?`,
    c,
    `Count by ${k}s until you reach ${k * c}: ${skipList(k, c)}. That's ${c} stars.`,
    { type: "emoji", emoji: "⭐", caption: `⭐ = ${k} votes` },
  );
}

const COLOURS = [
  { name: "red", emoji: "🔴", hex: "#ef4444" },
  { name: "blue", emoji: "🔵", hex: "#3b82f6" },
  { name: "green", emoji: "🟢", hex: "#22c55e" },
  { name: "yellow", emoji: "🟡", hex: "#facc15" },
  { name: "purple", emoji: "🟣", hex: "#a855f7" },
];

function spinnerQ(d: Level): Question {
  const [x, y, z] = sample(COLOURS, 3);
  if (d === 3) {
    const n = randInt(2, 3);
    const zn = pick([1, 4, n === 2 ? 3 : 2]);
    return pickOne(
      "Which two colours are equally likely?",
      `${x.name} and ${y.name}`,
      [`${x.name} and ${z.name}`, `${y.name} and ${z.name}`],
      `Colours with the same amount of space are equally likely. ${cap(x.name)} and ${y.name} each have ${n} parts.`,
      { type: "spinner", segments: shuffle([...repeat(x.hex, n), ...repeat(y.hex, n), ...repeat(z.hex, zn)]) },
    );
  }
  const most = d === 1 || chance(0.5);
  const [cx, cy, cz] = d === 1 ? [randInt(5, 6), 1, 2] : sample([1, 2, 3, 4, 5], 3);
  const colours = [
    { c: x, n: cx },
    { c: y, n: cy },
    { c: z, n: cz },
  ];
  const sorted = [...colours].sort((a, b) => b.n - a.n);
  const target = most ? sorted[0] : sorted[2];
  return pickOne(
    `Which colour is the spinner ${most ? "most" : "least"} likely to land on?`,
    { label: target.c.name, emoji: target.c.emoji },
    colours.filter((c) => c !== target).map((c) => ({ label: c.c.name, emoji: c.c.emoji })),
    `The colour with the ${most ? "most" : "least"} space is ${most ? "most" : "least"} likely. ${cap(target.c.name)} has ${plural(target.n, "part")}.`,
    { type: "spinner", segments: shuffle(colours.flatMap((c) => repeat(c.c.hex, c.n))) },
  );
}

const CHANCE_WORDS = {
  certain: { label: "certain", emoji: "✅" },
  likely: { label: "likely", emoji: "👍" },
  unlikely: { label: "unlikely", emoji: "🤏" },
  impossible: { label: "impossible", emoji: "🚫" },
};
type ChanceWord = keyof typeof CHANCE_WORDS;

const DIE_EVENTS: { text: string; ways: number; answer: ChanceWord }[] = [
  { text: "a number less than 7", ways: 6, answer: "certain" },
  { text: "a number from 1 to 6", ways: 6, answer: "certain" },
  { text: "a number greater than 0", ways: 6, answer: "certain" },
  { text: "a number greater than 1", ways: 5, answer: "likely" },
  { text: "a number less than 6", ways: 5, answer: "likely" },
  { text: "a number that is not 4", ways: 5, answer: "likely" },
  { text: "a 6", ways: 1, answer: "unlikely" },
  { text: "a 2", ways: 1, answer: "unlikely" },
  { text: "a number greater than 5", ways: 1, answer: "unlikely" },
  { text: "a 7", ways: 0, answer: "impossible" },
  { text: "a 0", ways: 0, answer: "impossible" },
  { text: "a number greater than 6", ways: 0, answer: "impossible" },
];

function dieEvent(d: Level): Question {
  const pool =
    d === 1
      ? DIE_EVENTS.filter((e) => e.answer === "certain" || e.answer === "impossible")
      : d === 3
        ? DIE_EVENTS.filter((e) => e.answer === "likely" || e.answer === "unlikely")
        : DIE_EVENTS;
  const e = pick(pool);
  const why = {
    certain: "Every number works, so it is certain to happen.",
    likely: "Most of the numbers work, so it will probably happen.",
    unlikely: "Only 1 number works, so it probably won't happen.",
    impossible: "No number works, so it can never happen.",
  }[e.answer];
  return {
    kind: "choice",
    prompt: `You roll a number cube with the numbers 1 to 6. How likely is it that you roll ${e.text}?`,
    hint: `${e.ways} of the 6 numbers ${e.ways === 1 ? "works" : "work"}. ${why}`,
    visual: { type: "emoji", emoji: "🎲" },
    answer: e.answer,
    choices: (Object.keys(CHANCE_WORDS) as ChanceWord[]).map((k) => ({ id: k, ...CHANCE_WORDS[k] })),
  };
}

function marbleBag(d: Level): Question {
  const [x, y] = sample(COLOURS, 2);
  let a: number, b: number;
  if (d === 1) {
    a = randInt(6, 9);
    b = randInt(1, 2);
  } else if (d === 2) {
    a = randInt(4, 7);
    b = randInt(1, a - 1);
  } else if (chance(0.35)) {
    a = b = randInt(3, 6);
  } else {
    a = randInt(4, 8);
    b = a - randInt(1, 2);
  }
  const equal: Opt = { label: "Both are equally likely", emoji: "⚖️" };
  const xo: Opt = { label: x.name, emoji: x.emoji };
  const yo: Opt = { label: y.name, emoji: y.emoji };
  const right = a === b ? equal : xo;
  return pickOne(
    "You pick one marble from the bag without looking. Which colour are you more likely to pick?",
    right,
    [xo, yo, equal].filter((o) => o !== right),
    a === b
      ? `There are ${a} ${x.name} and ${b} ${y.name}. They have the same number, so they are equally likely.`
      : `There are ${a} ${x.name} and ${b} ${y.name}. The colour with more marbles is more likely to be picked.`,
    { type: "emojiRow", items: shuffle([...repeat(x.emoji, a), ...repeat(y.emoji, b)]) },
  );
}

function graphsAndChance(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  if (d === 1) {
    return buildSet([
      () => pictoCount(false),
      () => pictoCount(true),
      () => mostLeast(1),
      () => barRead(1),
      () => barCompare(1),
      () => spinnerQ(1),
      () => dieEvent(1),
      () => marbleBag(1),
    ]);
  }
  if (d === 2) {
    return buildSet([
      () => pictoCount(true),
      () => barRead(2),
      () => barCompare(2),
      () => mostLeast(2),
      () => manyToOne(2),
      () => spinnerQ(2),
      () => dieEvent(2),
      () => marbleBag(2),
    ]);
  }
  return buildSet([
    () => barRead(3),
    () => barCompare(3),
    barTotal,
    () => manyToOne(3),
    starsNeeded,
    () => spinnerQ(3),
    () => dieEvent(3),
    () => marbleBag(3),
  ]);
}

// =====================================================================
// Money
// =====================================================================

const ALL_MONEY = [5, 10, 25, 100, 200, 500, 1000, 2000, 5000];

const SHOP_ITEMS = [
  { name: "book", emoji: "📕" },
  { name: "kite", emoji: "🪁" },
  { name: "puzzle", emoji: "🧩" },
  { name: "backpack", emoji: "🎒" },
  { name: "soccer ball", emoji: "⚽" },
  { name: "paint set", emoji: "🎨" },
  { name: "plant", emoji: "🪴" },
  { name: "hat", emoji: "🧢" },
  { name: "yo-yo", emoji: "🪀" },
  { name: "teddy bear", emoji: "🧸" },
];

/** Fewest coins and bills for an amount (works for Canadian money). */
function fewest(cents: number, kinds = ALL_MONEY): number[] {
  const out: number[] = [];
  let left = cents;
  for (const c of [...kinds].sort((a, b) => b - a)) {
    while (left >= c) {
      out.push(c);
      left -= c;
    }
  }
  return out;
}

function moneyPile(d: Level): number[] {
  const out: number[] = [];
  let total = 0;
  const add = (options: number[], times: number, cap: number) => {
    for (let i = 0; i < times; i++) {
      const fits = options.filter((c) => total + c <= cap);
      if (!fits.length) return;
      const c = pick(fits);
      out.push(c);
      total += c;
    }
  };
  if (d === 1) add([200, 100, 25, 10, 5], randInt(4, 7), 1000);
  else if (d === 2) add([2000, 1000, 500, 200, 100], randInt(3, 6), 10000);
  else {
    add([5000, 2000, 1000, 500], randInt(1, 3), 9000);
    add([200, 100], randInt(1, 2), 9500);
    add([25, 10, 5], randInt(2, 3), 9995);
  }
  return out.sort((a, b) => b - a);
}

function runningTotals(pile: number[]): string {
  let sum = 0;
  return pile.map((c) => formatMoney((sum += c))).join(", ");
}

function countMoney(d: Level): Question {
  const pile = moneyPile(d);
  const total = pile.reduce((s, c) => s + c, 0);
  const likely =
    d === 1
      ? [total + 25, total - 25, total + 10, total - 10, total + 100]
      : d === 2
        ? [total + 100, total - 100, total + 500, total - 500, total + 1000]
        : [total + 25, total - 25, total + 100, total - 100, total + 1000];
  return numChoice(
    "How much money is this?",
    total,
    likely,
    `Start with the biggest and count on: ${runningTotals(pile)}.`,
    { type: "coins", coins: pile },
    { fmt: formatMoney, min: 5, max: 10000 },
  );
}

function countDollars(): Question {
  const pile = moneyPile(2);
  const total = pile.reduce((s, c) => s + c, 0);
  return typeIn(
    "How many dollars is this?",
    total / 100,
    `Start with the biggest bill and count on: ${runningTotals(pile)}.`,
    { type: "coins", coins: pile },
    { suffix: "dollars" },
  );
}

function makeAmount(d: Level): Question {
  const target = d === 1 ? randInt(21, 199) * 5 : d === 2 ? randInt(6, 99) * 100 : randInt(5, 99) * 100 + randInt(1, 19) * 5;
  const coins = d === 1 ? [5, 10, 25, 100, 200] : ALL_MONEY;
  const way = fewest(target, coins).map(formatMoney).join(" + ");
  const tip =
    d === 1
      ? "Use toonies and loonies for the dollars, then quarters, dimes and nickels for the cents."
      : d === 2
        ? "Start with the biggest bill that fits, then keep adding smaller bills and coins."
        : "Make the dollars with bills and coins first. Then make the cents with quarters, dimes and nickels.";
  return { kind: "coins", prompt: `Make ${formatMoney(target)}.`, hint: `${tip} One way: ${way}.`, target, coins };
}

function changeQ(d: Level): Question {
  const item = pick(SHOP_ITEMS);
  if (d === 3) {
    const paid = pick([500, 1000, 2000]);
    let price: number;
    do price = randInt(paid / 10, paid / 5 - 1) * 5;
    while (price % 100 === 0);
    const change = paid - price;
    const up = Math.ceil(price / 100) * 100;
    const steps =
      up === paid
        ? `From ${formatMoney(price)} to ${formatMoney(paid)} is ${formatMoney(change)}.`
        : `From ${formatMoney(price)} to ${formatMoney(up)} is ${formatMoney(up - price)}. From ${formatMoney(up)} to ${formatMoney(paid)} is ${formatMoney(paid - up)}.`;
    return numChoice(
      `A ${item.name} costs ${formatMoney(price)}. You pay with a ${formatMoney(paid)} bill. How much change do you get?`,
      change,
      [change + 100, change - 100, change + 25, change - 25, change + 10],
      `Count up from the price. ${steps} So the change is ${formatMoney(change)}.`,
      { type: "coins", coins: [paid] },
      { fmt: formatMoney, min: 5, max: paid },
    );
  }
  const paid = d === 1 ? 10 : pick([20, 50]);
  const price = d === 1 ? randInt(1, 9) : randInt(Math.ceil(paid / 2), paid - 1);
  return typeIn(
    `A ${item.name} costs $${price}. You pay with a $${paid} bill. How many dollars of change do you get?`,
    paid - price,
    `Count up from $${price} to $${paid}, or take away: ${paid} − ${price} = ${paid - price}.`,
    { type: "coins", coins: [paid * 100] },
    { suffix: "dollars" },
  );
}

function totalCost(d: Level): Question {
  const [a, b] = sample(SHOP_ITEMS, 2);
  const price = () =>
    d === 1 ? randInt(2, 15) * 100 : d === 2 ? randInt(10, 45) * 100 : randInt(2, 40) * 100 + randInt(1, 19) * 5;
  const pa = price();
  const pb = price();
  const sum = pa + pb;
  let hint: string;
  if (d === 3) {
    const ca = pa % 100;
    const cb = pb % 100;
    hint = `Add the dollars: ${formatMoney(pa - ca)} + ${formatMoney(pb - cb)} = ${formatMoney(pa - ca + pb - cb)}. Add the cents: ${ca}¢ + ${cb}¢ = ${ca + cb}¢${
      ca + cb >= 100 ? `, which is ${formatMoney(ca + cb)}` : ""
    }. Together: ${formatMoney(sum)}.`;
  } else {
    hint = `Add the prices: $${pa / 100} + $${pb / 100} = $${sum / 100}.`;
  }
  return numChoice(
    `How much do the ${a.name} and the ${b.name} cost together?`,
    sum,
    d === 3 ? [sum - 100, sum + 100, sum + 10, sum - 10] : [sum + 100, sum - 100, sum + 1000, sum - 1000],
    hint,
    {
      type: "table",
      title: "Price list",
      headers: ["Item", "Price"],
      rows: [
        [`${a.emoji} ${a.name}`, formatMoney(pa)],
        [`${b.emoji} ${b.name}`, formatMoney(pb)],
      ],
    },
    { fmt: formatMoney, min: 100, max: 10000 },
  );
}

function earning(d: Level): Question {
  const n = pick(NAMES);
  if (d === 1) {
    const a = randInt(3, 15);
    const b = randInt(3, 15);
    return typeIn(
      `${n} earns $${a} on Saturday and $${b} on Sunday for helping a neighbour in the garden. How many dollars does ${n} earn in all?`,
      a + b,
      `Add what ${n} earns each day: ${a} + ${b} = ${a + b}.`,
      { type: "emoji", emoji: "🌱" },
      { suffix: "dollars" },
    );
  }
  if (d === 2) {
    if (chance(0.5)) {
      const k = randInt(2, 5);
      const w = randInt(3, 6);
      return typeIn(
        `${n} earns $${k} each week for doing chores. How many dollars will ${n} earn in ${w} weeks?`,
        k * w,
        `Count by ${k}s, once for each week: ${skipList(k, w)}.`,
        { type: "emoji", emoji: "🧹" },
        { suffix: "dollars" },
      );
    }
    const e = randInt(15, 40);
    const s = randInt(5, e - 5);
    return typeIn(
      `${n} earns $${e} raking leaves and spends $${s} on a book. How many dollars are left?`,
      e - s,
      `Take away what ${n} spends: ${e} − ${s} = ${e - s}.`,
      { type: "emoji", emoji: "🍂" },
      { suffix: "dollars" },
    );
  }
  const k = pick([2, 3, 4, 5, 10]);
  const w = randInt(3, 10);
  return typeIn(
    `${n} earns $${k} for each dog walk. How many walks does ${n} need to earn $${k * w}?`,
    w,
    `Count by ${k}s until you reach ${k * w}: ${skipList(k, w)}. That's ${w} walks.`,
    { type: "emoji", emoji: "🐕" },
    { suffix: "walks" },
  );
}

const EARN_OR_PAY: SortSet = {
  prompt: "Is it earning money or paying for something?",
  hint: "Earning is getting money for doing a job or selling something. Paying is giving money to buy something.",
  bins: [
    { id: "earn", label: "Earning money", emoji: "💵" },
    { id: "pay", label: "Paying for things", emoji: "🛍️" },
  ],
  items: [
    { label: "Getting paid to walk a dog", emoji: "🐕", bin: "earn" },
    { label: "Selling lemonade", emoji: "🍋", bin: "earn" },
    { label: "Getting an allowance for chores", emoji: "🧹", bin: "earn" },
    { label: "Getting paid to rake leaves", emoji: "🍂", bin: "earn" },
    { label: "Selling crafts at a market", emoji: "🎨", bin: "earn" },
    { label: "Tapping a debit card at a store", emoji: "💳", bin: "pay" },
    { label: "Paying cash for a book", emoji: "📕", bin: "pay" },
    { label: "Buying a bus ticket", emoji: "🎫", bin: "pay" },
    { label: "Paying for a haircut", emoji: "💇", bin: "pay" },
    { label: "Buying groceries", emoji: "🛒", bin: "pay" },
  ],
};

function earnOrPay(d: Level): Question {
  return sortQuestion(EARN_OR_PAY, d === 1 ? 2 : 3);
}

function waysToPay(): Question {
  if (chance(0.5)) {
    return pickOne(
      "Which of these is a way to pay for something?",
      { label: "Tapping a debit card", emoji: "💳" },
      [
        { label: "Doing chores", emoji: "🧹" },
        { label: "Selling lemonade", emoji: "🍋" },
      ],
      "To pay, you give money to buy something. You can pay with cash, a debit card or a credit card.",
    );
  }
  return pickOne(
    "Which of these is a way to earn money?",
    { label: "Raking leaves for a neighbour", emoji: "🍂" },
    [
      { label: "Buying a snack", emoji: "🍪" },
      { label: "Paying with cash", emoji: "💵" },
    ],
    "To earn money, you do a job or sell something, and someone pays you.",
  );
}

const EXCHANGES: Record<Level, { q: string; a: number; show: number; hint: string }[]> = {
  1: [
    { q: "How many quarters make $1?", a: 4, show: 25, hint: "Count by 25s: 25, 50, 75, 100. That's 4 quarters." },
    { q: "How many loonies make a toonie?", a: 2, show: 100, hint: "A loonie is $1 and a toonie is $2. $1 + $1 = $2." },
    { q: "How many toonies make $10?", a: 5, show: 200, hint: "Count by 2s: 2, 4, 6, 8, 10. That's 5 toonies." },
    { q: "How many $5 bills make $10?", a: 2, show: 500, hint: "$5 + $5 = $10. That's 2 bills." },
    { q: "How many nickels make a quarter?", a: 5, show: 5, hint: "Count by 5s: 5, 10, 15, 20, 25. That's 5 nickels." },
  ],
  2: [
    { q: "How many $5 bills make $20?", a: 4, show: 500, hint: "Count by 5s: 5, 10, 15, 20. That's 4 bills." },
    { q: "How many toonies make $20?", a: 10, show: 200, hint: "5 toonies make $10, so 10 toonies make $20." },
    { q: "How many quarters make $2?", a: 8, show: 25, hint: "4 quarters make $1, so 8 quarters make $2." },
    { q: "How many $10 bills make $50?", a: 5, show: 1000, hint: "Count by 10s: 10, 20, 30, 40, 50. That's 5 bills." },
    { q: "How many $20 bills make $100?", a: 5, show: 2000, hint: "Count by 20s: 20, 40, 60, 80, 100. That's 5 bills." },
  ],
  3: [
    { q: "How many quarters make $5?", a: 20, show: 25, hint: "4 quarters make $1, so $5 is 4 + 4 + 4 + 4 + 4 = 20 quarters." },
    { q: "How many dimes make $3?", a: 30, show: 10, hint: "10 dimes make $1, so $3 is 10 + 10 + 10 = 30 dimes." },
    { q: "How many toonies make $50?", a: 25, show: 200, hint: "5 toonies make $10, and $50 is five $10s: 5 × 5 = 25 toonies." },
    { q: "How many $5 bills make $100?", a: 20, show: 500, hint: "2 bills make $10, and $100 is ten $10s: 10 × 2 = 20 bills." },
    { q: "How many loonies make $20?", a: 20, show: 100, hint: "Each loonie is $1, so $20 is 20 loonies." },
  ],
};

function exchange(d: Level): Question {
  const e = pick(EXCHANGES[d]);
  const visual: Visual = { type: "coins", coins: [e.show] };
  if (d === 3) return typeIn(e.q, e.a, e.hint, visual);
  return numChoice(e.q, e.a, [e.a + 1, e.a - 1, e.a * 2], e.hint, visual, { min: 1, max: 40 });
}

function fewestBills(): Question {
  const dollars = randInt(11, 99);
  const parts = fewest(dollars * 100, [5000, 2000, 1000, 500, 200, 100]);
  return numChoice(
    `What is the smallest number of bills and coins that make $${dollars}?`,
    parts.length,
    [parts.length + 1, parts.length - 1, parts.length + 2],
    `Use the biggest bill or coin that fits, again and again: ${parts.map(formatMoney).join(" + ")} = $${dollars}. That's ${parts.length}.`,
    undefined,
    { min: 1, max: 15 },
  );
}

function canAfford(): Question {
  const have = randInt(10, 40) * 100 + randInt(1, 19) * 5;
  const [buy, ...others] = sample(SHOP_ITEMS, 4);
  const n = pick(NAMES);
  const cheap = have - randInt(1, 60) * 5;
  const close = have + randInt(1, 20) * 5;
  const far = have + randInt(3, 15) * 100;
  const far2 = have + randInt(1, 30) * 5 + 100;
  const opt = (item: (typeof SHOP_ITEMS)[number], price: number): Opt => ({
    label: `${cap(item.name)}: ${formatMoney(price)}`,
    emoji: item.emoji,
  });
  return pickOne(
    `${n} has this much money. Which one can ${n} buy?`,
    opt(buy, cheap),
    [opt(others[0], close), opt(others[1], far), opt(others[2], far2)],
    `Count the money first: ${runningTotals(fewest(have))}. ${n} can buy something that costs ${formatMoney(have)} or less.`,
    { type: "coins", coins: fewest(have) },
  );
}

function money(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  if (d === 1) {
    return buildSet([
      () => countMoney(1),
      () => makeAmount(1),
      () => changeQ(1),
      () => totalCost(1),
      () => earning(1),
      () => earnOrPay(1),
      waysToPay,
      () => exchange(1),
    ]);
  }
  if (d === 2) {
    return buildSet([
      () => countMoney(2),
      countDollars,
      () => makeAmount(2),
      () => changeQ(2),
      () => totalCost(2),
      () => earning(2),
      () => exchange(2),
      () => earnOrPay(2),
    ]);
  }
  return buildSet([
    () => countMoney(3),
    () => makeAmount(3),
    () => changeQ(3),
    () => totalCost(3),
    () => earning(3),
    fewestBills,
    () => exchange(3),
    canAfford,
  ]);
}

// =====================================================================
// Course
// =====================================================================

export const course: Course = {
  grade: "3",
  subject: "math",
  bigIdeas: {
    "ca-bc": [
      "Numbers to 1000 represent quantities that can be decomposed into 100s, 10s, and 1s.",
      "Fractions are numbers that represent an amount or quantity.",
      "Development of computational fluency in addition, subtraction, multiplication, and division of whole numbers requires flexible decomposing and composing.",
      "Regular changes in patterns can be identified and represented using tools and tables.",
      "Standard units are used to describe, measure, and compare attributes of objects' shapes.",
      "The likelihood of possible outcomes can be examined, compared, and interpreted.",
    ],
  },
  units: [
    {
      id: "numbers-to-1000",
      title: "Numbers to 1000",
      emoji: "🧱",
      blurb: "Hundreds, tens and ones",
      standards: { "ca-bc": "Number concepts to 1000" },
      parentNote:
        "Reading, building, comparing and ordering numbers to 1000 as hundreds, tens and ones, including tricky zeros and regrouping (12 tens is 1 hundred and 2 tens).",
      generate: numbersTo1000,
    },
    {
      id: "facts-to-20",
      title: "Facts to 20",
      emoji: "⚡",
      blurb: "Quick adding and subtracting",
      standards: { "ca-bc": "Addition and subtraction facts to 20 (developing computational fluency)" },
      parentNote:
        "Building fast, flexible recall of addition and subtraction facts to 20 with strategies like making ten, near doubles, fact families and thinking addition to subtract.",
      generate: factsTo20,
    },
    {
      id: "add-subtract-1000",
      title: "Add & Subtract",
      emoji: "➕",
      blurb: "Bigger numbers to 1000",
      standards: { "ca-bc": "Addition and subtraction to 1000" },
      parentNote:
        "Adding and subtracting 2- and 3-digit numbers by place value, number-line jumps and counting up, plus estimating by rounding to the nearest hundred.",
      generate: addSubtract1000,
    },
    {
      id: "multiplication",
      title: "Multiplication",
      emoji: "✖️",
      blurb: "Equal groups and arrays",
      standards: { "ca-bc": "Multiplication and division concepts: multiplication as equal groups, arrays and repeated addition" },
      parentNote:
        "Understanding multiplication as equal groups, arrays, repeated addition and skip counting. Easier sets use 2s, 5s and 10s; stretch sets go beyond 5 × 5.",
      generate: multiplication,
    },
    {
      id: "division",
      title: "Division",
      emoji: "➗",
      blurb: "Sharing and grouping",
      standards: { "ca-bc": "Multiplication and division concepts: division as equal sharing and equal grouping" },
      parentNote:
        "Understanding division as sharing fairly and as making equal groups, and using multiplication facts to divide (3 × 4 = 12, so 12 ÷ 3 = 4).",
      generate: division,
    },
    {
      id: "fractions",
      title: "Fractions",
      emoji: "🍕",
      blurb: "Parts of a whole",
      standards: { "ca-bc": "Fraction concepts" },
      parentNote:
        "Naming fractions of a shape, a set and a number line, knowing what the top and bottom numbers mean, and comparing fractions by the size of their parts.",
      generate: fractions,
    },
    {
      id: "patterns-and-equations",
      title: "Patterns & Equations",
      emoji: "📈",
      blurb: "Pattern rules and mystery numbers",
      standards: {
        "ca-bc":
          "Increasing and decreasing patterns; pattern rules using words and numbers; one-step addition and subtraction equations with an unknown number",
      },
      parentNote:
        "Extending increasing and decreasing patterns, describing pattern rules in words and tables, and solving one-step equations like ☐ + 8 = 23.",
      generate: patternsAndEquations,
    },
    {
      id: "measuring",
      title: "Measuring",
      emoji: "📏",
      blurb: "Length, mass and capacity",
      standards: { "ca-bc": "Measurement, using standard units (linear, mass, and capacity)" },
      parentNote:
        "Measuring with centimetres and metres, grams and kilograms, millilitres and litres: choosing sensible units, estimating, comparing and solving measurement problems.",
      generate: measuring,
    },
    {
      id: "time",
      title: "Time",
      emoji: "⏰",
      blurb: "Clocks, minutes and calendars",
      standards: { "ca-bc": "Time concepts" },
      parentNote:
        "Telling time on an analog clock, working out start and end times, and knowing how seconds, minutes, hours, days, weeks, months and years relate.",
      generate: time,
    },
    {
      id: "3d-objects",
      title: "3D Objects",
      emoji: "🧊",
      blurb: "Faces, edges and vertices",
      standards: { "ca-bc": "Construction of 3D objects" },
      parentNote:
        "Naming 3D objects, counting their faces, edges and vertices, and thinking about how they are built from flat faces or from straws and clay.",
      generate: objects3d,
    },
    {
      id: "graphs-and-chance",
      title: "Graphs & Chance",
      emoji: "📊",
      blurb: "Read graphs, predict chances",
      standards: {
        "ca-bc":
          "One-to-one and many-to-one correspondence, using bar graphs and pictographs; likelihood of possible outcomes",
      },
      parentNote:
        "Reading pictographs and bar graphs where one symbol can stand for one vote or several, and describing how likely outcomes are with spinners, marbles and number cubes.",
      generate: graphsAndChance,
    },
    {
      id: "money",
      title: "Money",
      emoji: "💵",
      blurb: "Coins and bills to $100",
      standards: { "ca-bc": "Financial literacy: fluency with coins and bills to 100 dollars, and earning and payment" },
      parentNote:
        "Counting and making amounts with Canadian coins and bills up to $100, making change, and talking about ways to earn money and to pay for things.",
      generate: money,
    },
  ],
};
