import { chance, numberChoice, pick, randInt, sample, shuffle, textChoice } from "../../random";
import { fromBank, sortQuestion, type BankItem, type SortSet } from "../../bank";
import { COIN_NAMES } from "../../money";
import type {
  ChoiceQuestion,
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

/** 1 = numbers to 10, 2 = numbers to 20, 3 = to 20 with harder forms. */
const levelOf = (opts?: GenerateOptions): Level => opts?.difficulty ?? 2;

function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

function repeat<T>(item: T, n: number): T[] {
  return Array.from({ length: n }, () => item);
}

const eq = (text: string): Visual => ({ type: "equation", text });

const TO_20 = { min: 0, max: 20 };

/** "A" or "An" to start a sentence with this word. */
const capArticle = (word: string) => (/^[aeiou]/i.test(word) ? "An" : "A");

function typeIn(prompt: string, answer: number, hint: string, visual?: Visual): InputQuestion {
  return { kind: "input", prompt, hint, visual, answer: String(answer), keypad: "number" };
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
          : "";
  return `${q.prompt}#${JSON.stringify(q.visual ?? null)}#${answer}`;
}

type Maker = () => Question;

/** `n` copies of a maker, for repeated question types. */
const times = (n: number, make: Maker): Maker[] => repeat(make, n);

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

const NAMES = ["Maya", "Jay", "Sam", "Amir", "Lena", "Kenji", "Zoe", "Ravi", "Ana", "Noah", "Priya", "Leo"];

interface Thing {
  emoji: string;
  word: string;
}

const THINGS: Thing[] = [
  { emoji: "🍎", word: "apples" },
  { emoji: "⭐", word: "stars" },
  { emoji: "🐟", word: "fish" },
  { emoji: "🌸", word: "flowers" },
  { emoji: "🐞", word: "ladybugs" },
  { emoji: "🎈", word: "balloons" },
  { emoji: "🍪", word: "cookies" },
  { emoji: "🐥", word: "chicks" },
  { emoji: "🚗", word: "cars" },
  { emoji: "⚽", word: "balls" },
  { emoji: "🍓", word: "strawberries" },
  { emoji: "🐝", word: "bees" },
  { emoji: "🦋", word: "butterflies" },
  { emoji: "🐸", word: "frogs" },
];

// ---------- Numbers to 20 ----------

function countDots(min: number, max: number): Question {
  const t = pick(THINGS);
  const n = randInt(min, max);
  const q = numberChoice(
    `How many ${t.emoji}?`,
    n,
    n > 10 ? "Touch each one as you count, and keep going past 10!" : "Touch each one as you count. Say the numbers out loud!",
    { type: "dots", count: n, emoji: t.emoji },
    TO_20,
  );
  q.speak = `How many ${t.word}?`;
  return q;
}

function numberLineBlank(d: Level): Question {
  const max = d === 1 ? 10 : 20;
  let n = randInt(1, max - 1);
  while (d === 3 && n % 5 === 0) n = randInt(1, max - 1);
  const hint =
    d === 3
      ? `Find ${Math.floor(n / 5) * 5} on the line, then count on by 1s to the ?.`
      : `Look at the number just before the ?. What comes after ${n - 1}?`;
  return numberChoice(
    "What number goes where the ? is?",
    n,
    hint,
    { type: "numberLine", min: 0, max, step: 1, labelEvery: d === 3 ? 5 : 1, blankAt: n },
    { min: 0, max },
  );
}

function missingInCount(d: Level): Question {
  const back = d === 3;
  const max = d === 1 ? 10 : 20;
  const start = back ? randInt(3, max) : randInt(0, max - 3);
  const nums = [0, 1, 2, 3].map((i) => (back ? start - i : start + i));
  const gap = randInt(1, 2);
  const text = nums.map((n, i) => (i === gap ? "☐" : String(n))).join(", ");
  return numberChoice(
    back ? "Count back. What number is missing?" : "What number is missing?",
    nums[gap],
    back ? `Count back from ${nums[0]}. Each number is 1 less.` : `Count on from ${nums[0]}. Each number is 1 more.`,
    eq(text),
    TO_20,
  );
}

function biggerOrSmaller(d: Level): Question {
  if (d === 3) {
    const nums = sample(range(0, 20), 3);
    const smallest = Math.min(...nums);
    return textChoice(
      "Which number is the smallest?",
      String(smallest),
      nums.filter((n) => n !== smallest).map(String),
      "The smallest number comes first when you count.",
    );
  }
  const [a, b] = sample(range(d === 1 ? 0 : 5, d === 1 ? 10 : 20), 2);
  return textChoice(
    "Which number is bigger?",
    String(Math.max(a, b)),
    [String(Math.min(a, b))],
    "The bigger number comes later when you count.",
  );
}

function orderNumbers(d: Level): OrderQuestion {
  const nums = sample(range(0, d === 1 ? 10 : 20), d === 1 ? 3 : 4).sort((x, y) => x - y);
  const down = d === 3;
  const list = down ? [...nums].reverse() : nums;
  return {
    kind: "order",
    prompt: down ? "Tap the numbers from biggest to smallest." : "Tap the numbers from smallest to biggest.",
    hint: down ? `Start with the biggest number, ${list[0]}.` : `Start with the smallest number, ${list[0]}.`,
    items: list.map((n) => ({ id: String(n), label: String(n) })),
  };
}

function readTensOnes(d: Level): Question {
  if (d === 1) {
    const n = randInt(4, 10);
    return numberChoice(
      "How many dots are in the ten frame?",
      n,
      n === 10 ? "Every box is full, and a full ten frame is 10!" : "Count each dot. A full row has 5.",
      { type: "tenFrame", filled: n },
      TO_20,
    );
  }
  const n = randInt(11, 20);
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  if (chance(0.5)) {
    return numberChoice(
      "What number do the blocks show?",
      n,
      ones ? `A ten stick is 10. Then count on ${ones} more.` : "Each ten stick is 10. Count by tens: 10, 20.",
      { type: "blocks", tens, ones },
      TO_20,
    );
  }
  return numberChoice(
    "How many dots in all?",
    n,
    "One ten frame is full. That's 10! Count on the rest.",
    { type: "tenFrame", filled: 10, extra: n - 10 },
    TO_20,
  );
}

function tensOnesHint(n: number): string {
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  if (tens === 0) return `${n} is ${n} ones.`;
  const t = `${tens} ${tens === 1 ? "ten" : "tens"}`;
  if (ones === 0) return `${n} is ${t}.`;
  return `${n} is ${t} and ${ones} ${ones === 1 ? "one" : "ones"}.`;
}

function buildNumber(d: Level): Question {
  const n = d === 1 ? randInt(5, 14) : randInt(11, 20);
  return { kind: "build", prompt: `Build the number ${n}.`, hint: tensOnesHint(n), target: n };
}

function tensOnesWords(): Question {
  const n = randInt(12, 19);
  const o = n - 10;
  return textChoice(
    `How many tens and ones are in ${n}?`,
    `1 ten and ${o} ones`,
    [`${o} tens and 1 one`, `1 ten and ${o === 9 ? 8 : o + 1} ones`],
    `The 1 in ${n} means 1 ten. The ${o} means ${o} ones.`,
    eq(String(n)),
  );
}

function tensOnesTypeIn(): Question {
  const o = randInt(1, 9);
  return typeIn(
    `What number is 1 ten and ${o} ${o === 1 ? "one" : "ones"}?`,
    10 + o,
    `1 ten is 10. Count on ${o} more from 10.`,
    { type: "blocks", tens: 1, ones: o },
  );
}

function numbersTo20(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  if (d === 1) {
    return buildSet([
      () => countDots(3, 10),
      () => countDots(5, 10),
      () => numberLineBlank(1),
      () => missingInCount(1),
      () => biggerOrSmaller(1),
      () => orderNumbers(1),
      () => readTensOnes(1),
      () => buildNumber(1),
    ]);
  }
  if (d === 2) {
    return buildSet([
      () => countDots(8, 15),
      () => countDots(11, 20),
      () => numberLineBlank(2),
      () => missingInCount(2),
      () => biggerOrSmaller(2),
      () => orderNumbers(2),
      () => readTensOnes(2),
      () => buildNumber(2),
    ]);
  }
  return buildSet([
    () => countDots(11, 20),
    () => numberLineBlank(3),
    () => missingInCount(3),
    () => biggerOrSmaller(3),
    () => orderNumbers(3),
    tensOnesWords,
    () => buildNumber(3),
    tensOnesTypeIn,
  ]);
}

// ---------- Make 10 ----------

function fillTheRow(): Question {
  const a = randInt(2, 9);
  const q = numberChoice(
    "How many more 🔴 make 10?",
    10 - a,
    "Count the empty white spots. Each one needs a red dot!",
    { type: "emojiRow", items: [...repeat("🔴", a), ...repeat("⚪", 10 - a)] },
    { min: 0, max: 10 },
  );
  q.speak = "How many more red dots make 10?";
  return q;
}

function missingToTen(input = false): Question {
  const a = randInt(1, 9);
  const visual = eq(`${a} + ☐ = 10`);
  const hint = `Start at ${a} and count up to 10. How many did you count?`;
  return input
    ? typeIn("What number makes 10?", 10 - a, hint, visual)
    : numberChoice("What number makes 10?", 10 - a, hint, visual, { min: 0, max: 10 });
}

function tenEquals(): Question {
  const a = randInt(1, 9);
  return numberChoice(
    "What number is missing?",
    10 - a,
    `10 is ${a} and how many more? Count up from ${a} to 10.`,
    eq(`10 = ${a} + ☐`),
    { min: 0, max: 10 },
  );
}

function pairToTen(hard: boolean): Question {
  const a = randInt(1, 9);
  const wrongs = new Set<string>();
  if (hard) {
    // Same first number, second number just a little off.
    for (const b of shuffle([9 - a, 11 - a, 12 - a, 8 - a])) {
      if (b >= 0 && b <= 10 && wrongs.size < 2) wrongs.add(`${a} + ${b}`);
    }
  } else {
    while (wrongs.size < 2) {
      const x = randInt(1, 8);
      const y = randInt(1, 8);
      if (x + y !== 10 && x + y >= 6 && x + y <= 13) wrongs.add(`${x} + ${y}`);
    }
  }
  return textChoice(
    "Which two numbers make 10?",
    `${a} + ${10 - a}`,
    [...wrongs],
    "Start at the first number and count on. Do you land on 10?",
    { type: "emoji", emoji: "🔟" },
  );
}

function tenFrameTen(): Question {
  const a = randInt(1, 9);
  return numberChoice(
    `What is ${a} + ${10 - a}?`,
    10,
    "Count the red dots, then keep counting the blue dots.",
    { type: "tenFrame", filled: a, extra: 10 - a },
    TO_20,
  );
}

function fingersDown(): Question {
  const up = randInt(2, 9);
  return numberChoice(
    `${up} fingers are up. How many fingers are down?`,
    10 - up,
    `You have 10 fingers. Count up from ${up} to 10.`,
    { type: "emoji", emoji: "🙌", caption: "10 fingers" },
    { min: 0, max: 10 },
  );
}

function storyToTen(): Question {
  const t = pick(THINGS);
  const name = pick(NAMES);
  const a = randInt(2, 8);
  const q = numberChoice(
    `${name} has ${a} ${t.emoji}. How many more to make 10?`,
    10 - a,
    `Count on from ${a} until you reach 10.`,
    { type: "emojiRow", items: repeat(t.emoji, a) },
    { min: 0, max: 10 },
  );
  q.speak = `${name} has ${a} ${t.word}. How many more to make 10?`;
  return q;
}

function turnAroundTen(): Question {
  const a = pick([1, 2, 3, 4, 6, 7, 8, 9]);
  const b = 10 - a;
  return numberChoice(
    `${a} + ${b} = 10. So what is ${b} + ${a}?`,
    10,
    "You can add in any order. The total stays the same!",
    eq(`${b} + ${a} = ?`),
    TO_20,
  );
}

function makeTenToAdd(): Question {
  const a = randInt(6, 9);
  const b = randInt(11 - a, 9);
  const move = 10 - a;
  return numberChoice(
    "What number is missing?",
    a + b - 10,
    `${a} needs ${move} more to make 10. Take ${move} from ${b}. What is left?`,
    eq(`${a} + ${b} = 10 + ☐`),
    { min: 0, max: 10 },
  );
}

function makeTen(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  if (d === 1) {
    return buildSet([
      ...times(2, fillTheRow),
      fingersDown,
      ...times(2, () => missingToTen()),
      () => pairToTen(false),
      tenFrameTen,
      storyToTen,
    ]);
  }
  if (d === 2) {
    return buildSet([
      fillTheRow,
      fingersDown,
      () => missingToTen(),
      tenEquals,
      () => pairToTen(false),
      () => pairToTen(true),
      turnAroundTen,
      storyToTen,
    ]);
  }
  return buildSet([
    () => missingToTen(true),
    tenEquals,
    ...times(2, () => pairToTen(true)),
    ...times(2, makeTenToAdd),
    storyToTen,
    fingersDown,
  ]);
}

// ---------- Adding ----------

function addPair(d: Level): [number, number] {
  if (d === 1) {
    const s = randInt(3, 10);
    const a = randInt(1, s - 1);
    return [a, s - a];
  }
  if (d === 2) {
    const a = randInt(3, 10);
    return [a, randInt(2, Math.min(10, 20 - a))];
  }
  const a = randInt(5, 15);
  return [a, randInt(2, Math.min(9, 20 - a))];
}

function addHint(a: number, b: number): string {
  const big = Math.max(a, b);
  const small = Math.min(a, b);
  if (a === b) return `Doubles! Think of ${a} two times.`;
  if (big < 10 && big + small > 10) {
    const toTen = 10 - big;
    return `Make a ten! ${big} + ${toTen} = 10, then add ${small - toTen} more.`;
  }
  return `Start at ${big} and count up ${small} more.`;
}

function addEquation(d: Level, input = false): Question {
  const [a, b] = addPair(d);
  const prompt = `What is ${a} + ${b}?`;
  const visual = eq(`${a} + ${b} = ?`);
  return input ? typeIn(prompt, a + b, addHint(a, b), visual) : numberChoice(prompt, a + b, addHint(a, b), visual, TO_20);
}

function addTenFrame(d: Level): Question {
  let a: number;
  let b: number;
  if (d === 1) {
    [a, b] = addPair(1);
  } else {
    a = randInt(5, 10);
    b = randInt(2, Math.min(9, 20 - a));
  }
  return numberChoice(
    `What is ${a} + ${b}?`,
    a + b,
    "Count the red dots, then keep counting the blue dots.",
    { type: "tenFrame", filled: a, extra: b },
    TO_20,
  );
}

const GET_MORE = [
  { emoji: "🐚", word: "shells", verb: "finds" },
  { emoji: "⭐", word: "stickers", verb: "gets" },
  { emoji: "🍓", word: "strawberries", verb: "picks" },
  { emoji: "🎈", word: "balloons", verb: "gets" },
  { emoji: "🍪", word: "cookies", verb: "bakes" },
  { emoji: "🌸", word: "flowers", verb: "picks" },
  { emoji: "🍂", word: "leaves", verb: "finds" },
];

function addStory(d: Level): Question {
  const s = pick(GET_MORE);
  const name = pick(NAMES);
  const [a, b] = addPair(d);
  const visual: Visual =
    d === 1
      ? { type: "emojiRow", items: [...repeat(s.emoji, a), "➕", ...repeat(s.emoji, b)] }
      : { type: "emoji", emoji: s.emoji, caption: `${a} + ${b}` };
  const q = numberChoice(
    `${name} has ${a} ${s.emoji} and ${s.verb} ${b} more. How many now?`,
    a + b,
    addHint(a, b),
    visual,
    TO_20,
  );
  q.speak = `${name} has ${a} ${s.word} and ${s.verb} ${b} more. How many ${s.word} now?`;
  return q;
}

function addChangeUnknown(): Question {
  const s = pick(GET_MORE);
  const name = pick(NAMES);
  const a = randInt(4, 12);
  const c = randInt(a + 2, Math.min(20, a + 9));
  const q = numberChoice(
    `${name} had ${a} ${s.emoji}. Now ${name} has ${c}. How many more did ${name} get?`,
    c - a,
    `Count up from ${a} to ${c}. How many did you count?`,
    eq(`${a} + ☐ = ${c}`),
    TO_20,
  );
  q.speak = `${name} had ${a} ${s.word}. Now ${name} has ${c}. How many more did ${name} get?`;
  return q;
}

function addHops(d: Level): Question {
  const max = d === 1 ? 10 : 20;
  const b = randInt(2, d === 1 ? 4 : 6);
  const a = randInt(d === 1 ? 0 : 5, max - b);
  const jumps = range(0, b - 1).map((i) => ({ from: a + i, to: a + i + 1 }));
  return numberChoice(
    `Start at ${a}. Hop ${b} more. Where do you land?`,
    a + b,
    `Put your finger on ${a}. Move one number for each hop.`,
    { type: "numberLine", min: 0, max, step: 1, jumps, blankAt: a + b },
    { min: 0, max },
  );
}

function addTurnAround(): Question {
  let a: number;
  let b: number;
  do {
    a = randInt(1, 9);
    b = randInt(1, 9);
  } while (a === b || a + b > 10);
  return numberChoice(
    `${a} + ${b} = ${a + b}. So what is ${b} + ${a}?`,
    a + b,
    "You can add in any order. The total stays the same!",
    eq(`${b} + ${a} = ?`),
    TO_20,
  );
}

function addDoubles(): Question {
  const a = randInt(2, 10);
  return numberChoice(
    `What is ${a} + ${a}?`,
    2 * a,
    `Doubles! It's like counting ${a} two times.`,
    eq(`${a} + ${a} = ?`),
    TO_20,
  );
}

function addNearDoubles(): Question {
  const a = randInt(3, 9);
  return numberChoice(
    `What is ${a} + ${a + 1}?`,
    2 * a + 1,
    `Use a double: ${a} + ${a} = ${2 * a}. Then add 1 more.`,
    eq(`${a} + ${a + 1} = ?`),
    TO_20,
  );
}

function addThree(): Question {
  const [a, b, c] = [randInt(1, 6), randInt(1, 6), randInt(1, 6)];
  return numberChoice(
    "Add all three numbers.",
    a + b + c,
    `Add two first: ${a} + ${b} = ${a + b}. Then add ${c} more.`,
    eq(`${a} + ${b} + ${c} = ?`),
    TO_20,
  );
}

function addMissing(input = false): Question {
  const a = randInt(3, 12);
  const c = randInt(a + 2, Math.min(20, a + 9));
  const visual = eq(`${a} + ☐ = ${c}`);
  const hint = `Start at ${a} and count up to ${c}. How many did you count?`;
  return input
    ? typeIn("What number is missing?", c - a, hint, visual)
    : numberChoice("What number is missing?", c - a, hint, visual, TO_20);
}

function adding(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  if (d === 1) {
    return buildSet([
      ...times(2, () => addEquation(1)),
      ...times(2, () => addTenFrame(1)),
      ...times(2, () => addStory(1)),
      () => addHops(1),
      addTurnAround,
    ]);
  }
  if (d === 2) {
    return buildSet([
      ...times(2, () => addEquation(2)),
      () => addTenFrame(2),
      ...times(2, () => addStory(2)),
      () => addHops(2),
      addDoubles,
      () => addEquation(2, true),
    ]);
  }
  return buildSet([
    () => addEquation(3),
    () => addMissing(),
    () => addMissing(true),
    addThree,
    addChangeUnknown,
    () => addStory(3),
    () => addHops(3),
    addNearDoubles,
  ]);
}

// ---------- Take Away ----------

function subPair(d: Level): [number, number] {
  if (d === 1) {
    const a = randInt(3, 10);
    return [a, randInt(1, a - 1)];
  }
  const a = randInt(11, 20);
  return [a, randInt(d === 2 ? 2 : 3, d === 2 ? 9 : 10)];
}

function subHint(a: number, b: number): string {
  if (a > 10 && b === 10) return "Take away the ten. Which ones are left?";
  if (a === 20) return `Think of 20 as 10 and 10. Take ${b} away from one of the tens.`;
  if (a > 10 && b <= a % 10) return "Take away from the ones. The ten stays!";
  if (a > 10) {
    const first = a - 10;
    return `Take away ${first} to get to 10, then take away ${b - first} more.`;
  }
  if (b <= 3) return `Start at ${a} and count back ${b}.`;
  return `Think addition: ${b} + ? = ${a}. Count up from ${b}.`;
}

function subEquation(d: Level, input = false): Question {
  const [a, b] = subPair(d);
  const prompt = `What is ${a} − ${b}?`;
  const visual = eq(`${a} − ${b} = ?`);
  return input ? typeIn(prompt, a - b, subHint(a, b), visual) : numberChoice(prompt, a - b, subHint(a, b), visual, TO_20);
}

const EATS: Thing[] = [
  { emoji: "🍪", word: "cookies" },
  { emoji: "🍓", word: "strawberries" },
  { emoji: "🍒", word: "cherries" },
  { emoji: "🫐", word: "blueberries" },
  { emoji: "🥕", word: "carrots" },
  { emoji: "🍇", word: "grapes" },
];

function subCrossOut(d: Level): Question {
  const t = pick(EATS);
  const name = pick(NAMES);
  const a = d === 1 ? randInt(4, 10) : randInt(8, 14);
  const b = randInt(1, Math.min(a - 1, d === 1 ? 5 : 8));
  const q = numberChoice(
    `${name} had ${a} ${t.emoji} and ate ${b}. How many are left?`,
    a - b,
    "Each X shows one that was eaten. Count the ones still there.",
    { type: "emojiRow", items: [...repeat(t.emoji, a - b), ...repeat("❌", b)] },
    TO_20,
  );
  q.speak = `${name} had ${a} ${t.word} and ate ${b}. How many are left?`;
  return q;
}

const GO_AWAY = [
  { emoji: "🐸", word: "frogs", where: "on a log", one: "hops away", many: "hop away", past: "hopped away" },
  { emoji: "🐦", word: "birds", where: "in a tree", one: "flies away", many: "fly away", past: "flew away" },
  { emoji: "🦆", word: "ducks", where: "in a pond", one: "swims away", many: "swim away", past: "swam away" },
  { emoji: "🎈", word: "balloons", where: "at a party", one: "floats away", many: "float away", past: "floated away" },
  { emoji: "🐞", word: "ladybugs", where: "on a leaf", one: "crawls away", many: "crawl away", past: "crawled away" },
  { emoji: "🦋", word: "butterflies", where: "on a bush", one: "flies away", many: "fly away", past: "flew away" },
];

function subStory(d: Level): Question {
  const s = pick(GO_AWAY);
  const [a, b] = subPair(d);
  const verb = b === 1 ? s.one : s.many;
  const visual: Visual =
    d === 1 ? { type: "emojiRow", items: repeat(s.emoji, a) } : { type: "emoji", emoji: s.emoji, caption: `${a} − ${b}` };
  const q = numberChoice(
    `There are ${a} ${s.emoji} ${s.where}. ${b} ${verb}. How many are left?`,
    a - b,
    subHint(a, b),
    visual,
    TO_20,
  );
  q.speak = `There are ${a} ${s.word} ${s.where}. ${b} ${verb}. How many are left?`;
  return q;
}

function subHops(d: Level): Question {
  const max = d === 1 ? 10 : 20;
  const b = randInt(2, d === 1 ? 4 : 6);
  const a = randInt(b + (d === 1 ? 0 : 3), max);
  const jumps = range(0, b - 1).map((i) => ({ from: a - i, to: a - i - 1 }));
  return numberChoice(
    `Start at ${a}. Hop back ${b}. Where do you land?`,
    a - b,
    `Put your finger on ${a}. Move back one number for each hop.`,
    { type: "numberLine", min: 0, max, step: 1, jumps, blankAt: a - b },
    { min: 0, max },
  );
}

function subThinkAddition(d: Level): Question {
  const a = randInt(2, d === 1 ? 7 : 9);
  const b = randInt(1, d === 1 ? 10 - a : 9);
  const s = a + b;
  return numberChoice(
    `${a} + ${b} = ${s}. So what is ${s} − ${b}?`,
    a,
    "Adding and taking away are a team. Use the adding fact to help!",
    eq(`${s} − ${b} = ?`),
    TO_20,
  );
}

function subHowManyMore(): Question {
  const [p1, p2] = sample(NAMES, 2);
  const t = pick(THINGS);
  const a = randInt(5, 10);
  const b = randInt(2, a - 1);
  const q = numberChoice(
    `How many more ${t.emoji} does ${p1} have than ${p2}?`,
    a - b,
    `Match them up in pairs. Count the extra ones ${p1} has.`,
    {
      type: "pictograph",
      title: "Who has more?",
      rows: [
        { label: p1, emoji: t.emoji, count: a },
        { label: p2, emoji: t.emoji, count: b },
      ],
    },
    TO_20,
  );
  q.speak = `How many more ${t.word} does ${p1} have than ${p2}?`;
  return q;
}

function subMissing(): Question {
  const a = randInt(8, 20);
  const b = randInt(2, Math.min(9, a - 1));
  const c = a - b;
  return numberChoice(
    "What number is missing?",
    b,
    `Count back from ${a} to ${c}. How many steps back?`,
    eq(`${a} − ☐ = ${c}`),
    TO_20,
  );
}

function subChangeUnknown(): Question {
  const s = pick(GO_AWAY);
  const a = randInt(8, 18);
  const b = randInt(2, Math.min(9, a - 2));
  const c = a - b;
  const q = numberChoice(
    `There were ${a} ${s.emoji}. Now there are ${c}. How many ${s.past}?`,
    b,
    `Count up from ${c} to ${a}. That's how many ${s.past}.`,
    eq(`${a} − ☐ = ${c}`),
    TO_20,
  );
  q.speak = `There were ${a} ${s.word}. Now there are ${c}. How many ${s.past}?`;
  return q;
}

function takeAway(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  if (d === 1) {
    return buildSet([
      ...times(2, () => subEquation(1)),
      ...times(2, () => subCrossOut(1)),
      ...times(2, () => subStory(1)),
      () => subHops(1),
      () => subThinkAddition(1),
    ]);
  }
  if (d === 2) {
    return buildSet([
      ...times(2, () => subEquation(2)),
      () => subCrossOut(2),
      ...times(2, () => subStory(2)),
      () => subHops(2),
      () => subThinkAddition(2),
      () => subEquation(2, true),
    ]);
  }
  return buildSet([
    () => subEquation(3),
    subMissing,
    ...times(2, subHowManyMore),
    subChangeUnknown,
    () => subHops(3),
    () => subStory(3),
    () => subEquation(3, true),
  ]);
}

// ---------- Equal or Not ----------

interface Labelled {
  label: string;
  emoji: string;
}

const GROUP_PAIRS: [Labelled, Labelled][] = [
  [{ label: "apples", emoji: "🍎" }, { label: "pears", emoji: "🍐" }],
  [{ label: "cats", emoji: "🐱" }, { label: "dogs", emoji: "🐶" }],
  [{ label: "cars", emoji: "🚗" }, { label: "bikes", emoji: "🚲" }],
  [{ label: "stars", emoji: "⭐" }, { label: "moons", emoji: "🌙" }],
  [{ label: "socks", emoji: "🧦" }, { label: "shoes", emoji: "👟" }],
];

function groupsVisual(x: Labelled, y: Labelled, a: number, b: number): Visual {
  return {
    type: "pictograph",
    title: "Let's compare",
    rows: [
      { label: x.label, emoji: x.emoji, count: a },
      { label: y.label, emoji: y.emoji, count: b },
    ],
  };
}

const YES_EQUAL = "Yes, equal (=)";
const NOT_EQUAL = "No, not equal (≠)";

function sameGroups(d: Level): Question {
  const [x, y] = pick(GROUP_PAIRS);
  const a = randInt(2, d === 1 ? 8 : 10);
  const equal = chance(0.5);
  const b = equal ? a : pick([a - 2, a - 1, a + 1, a + 2].filter((n) => n >= 1));
  const q = textChoice(
    `Are there the same number of ${x.emoji} and ${y.emoji}?`,
    equal ? YES_EQUAL : NOT_EQUAL,
    [equal ? NOT_EQUAL : YES_EQUAL],
    `Match each one with a partner in the other row. Are any left over?`,
    groupsVisual(x, y, a, b),
  );
  q.speak = `Are there the same number of ${x.label} and ${y.label}?`;
  return q;
}

function moreOrFewer(d: Level, mode: "more" | "fewer"): Question {
  const [x, y] = pick(GROUP_PAIRS);
  const [a, b] = sample(range(1, d === 1 ? 8 : 10), 2);
  const winner = (mode === "more") === a > b ? x : y;
  const loser = winner === x ? y : x;
  return textChoice(
    mode === "more" ? "Which group has more?" : "Which group has fewer?",
    { label: winner.label, emoji: winner.emoji },
    [{ label: loser.label, emoji: loser.emoji }],
    mode === "more"
      ? "Match them up one to one. The row with extras left over has more."
      : "Match them up one to one. The row that runs out first has fewer.",
    groupsVisual(x, y, a, b),
  );
}

function equalSign(d: Level): ChoiceQuestion {
  let left: string;
  let value: number;
  if (d === 3 && chance(0.5)) {
    const a = randInt(6, 15);
    const b = randInt(1, a - 3);
    left = `${a} − ${b}`;
    value = a - b;
  } else {
    const [a, b] = addPair(d === 3 ? 2 : d);
    left = `${a} + ${b}`;
    value = a + b;
  }
  const equal = chance(0.5);
  let right: string;
  let rightValue: number;
  if (d >= 2 && chance(0.5)) {
    rightValue = equal ? value : value + pick([1, -1]);
    let c = randInt(1, rightValue - 1);
    if (`${c} + ${rightValue - c}` === left) c = rightValue - c;
    right = `${c} + ${rightValue - c}`;
  } else {
    rightValue = equal ? value : value + pick([1, -1, 2]);
    right = String(rightValue);
  }
  return {
    kind: "choice",
    prompt: "Which sign goes in the box?",
    hint: `${left} is ${value}. = means both sides are the same. ≠ means they are not.`,
    visual: eq(`${left} ☐ ${right}`),
    answer: rightValue === value ? "=" : "≠",
    choices: [
      { id: "=", label: "=", speak: "equal" },
      { id: "≠", label: "≠", speak: "not equal" },
    ],
  };
}

function trueSentence(d: Level): Question {
  let left: string;
  let value: number;
  if (d === 3 && chance(0.5)) {
    const a = randInt(6, 18);
    const b = randInt(1, Math.min(9, a - 1));
    left = `${a} − ${b}`;
    value = a - b;
  } else {
    const [a, b] = addPair(d === 3 ? 2 : d);
    left = `${a} + ${b}`;
    value = a + b;
  }
  const isTrue = chance(0.5);
  const shown = isTrue ? value : value + pick([1, -1]);
  const yes = "Yes, it's true";
  const no = "No, it's not true";
  return textChoice(
    "Is this number sentence true?",
    isTrue ? yes : no,
    [isTrue ? no : yes],
    `${left} is ${value}. Is that the same as ${shown}?`,
    eq(`${left} = ${shown}`),
  );
}

function sameAs(): Question {
  const [a, b] = addPair(2);
  const s = a + b;
  const options = range(1, s - 1).filter((c) => c !== a && c !== b);
  const c = pick(options);
  const equal = chance(0.5);
  let e = s - c + (equal ? 0 : pick([1, -1]));
  if (e < 1) e = s - c + 1;
  return textChoice(
    `Is ${a} + ${b} the same as ${c} + ${e}?`,
    e === s - c ? YES_EQUAL : NOT_EQUAL,
    [e === s - c ? NOT_EQUAL : YES_EQUAL],
    `Work out each side: ${a} + ${b} = ${s}. Then add ${c} + ${e}.`,
  );
}

function makeBothEqual(): Question {
  const [a, b] = addPair(2);
  const s = a + b;
  const c = pick(range(1, s - 1).filter((n) => n !== a && n !== b));
  return numberChoice(
    "What number makes both sides equal?",
    s - c,
    `${a} + ${b} = ${s}. What goes with ${c} to make ${s}?`,
    eq(`${a} + ${b} = ${c} + ☐`),
    TO_20,
  );
}

function whichIsMore(): Question {
  const [a, b] = addPair(2);
  const s = a + b;
  const c = pick([s - 2, s - 1, s + 1, s + 2].filter((n) => n >= 1 && n <= 20));
  const sumIsMore = s > c;
  return textChoice(
    "Which is more?",
    sumIsMore ? `${a} + ${b}` : String(c),
    [sumIsMore ? String(c) : `${a} + ${b}`],
    `Work out ${a} + ${b} first. Then compare it with ${c}.`,
  );
}

function whichEquals(d: Level): Question {
  const n = d === 1 ? randInt(4, 10) : randInt(8, 18);
  const a = randInt(1, n - 1);
  const wrongs: string[] = [];
  for (const off of shuffle([1, -1, 2, -2]).slice(0, 2)) {
    const m = n + off;
    const x = randInt(1, m - 1);
    wrongs.push(`${x} + ${m - x}`);
  }
  return textChoice(
    `Which one is equal to ${n}?`,
    `${a} + ${n - a}`,
    wrongs,
    `Add each pair. Which one makes exactly ${n}?`,
    eq(String(n)),
  );
}

function equalOrNot(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  if (d === 1) {
    return buildSet([
      ...times(2, () => sameGroups(1)),
      ...times(2, () => moreOrFewer(1, "more")),
      () => moreOrFewer(1, "fewer"),
      () => equalSign(1),
      () => trueSentence(1),
      () => whichEquals(1),
    ]);
  }
  if (d === 2) {
    return buildSet([
      () => sameGroups(2),
      () => moreOrFewer(2, "fewer"),
      ...times(2, () => equalSign(2)),
      () => trueSentence(2),
      ...times(2, sameAs),
      () => whichEquals(2),
    ]);
  }
  return buildSet([
    ...times(2, () => equalSign(3)),
    sameAs,
    ...times(2, makeBothEqual),
    ...times(2, whichIsMore),
    () => trueSentence(3),
  ]);
}

// ---------- Patterns ----------

interface Element {
  emoji: string;
  name: string;
}

const PATTERN_SETS: Element[][] = [
  [{ emoji: "🍎", name: "apple" }, { emoji: "🍌", name: "banana" }, { emoji: "🍇", name: "grapes" }],
  [{ emoji: "🐶", name: "dog" }, { emoji: "🐱", name: "cat" }, { emoji: "🐭", name: "mouse" }],
  [{ emoji: "⭐", name: "star" }, { emoji: "🌙", name: "moon" }, { emoji: "☀️", name: "sun" }],
  [{ emoji: "🐟", name: "fish" }, { emoji: "🐚", name: "shell" }, { emoji: "🦀", name: "crab" }],
  [{ emoji: "🌲", name: "tree" }, { emoji: "🍄", name: "mushroom" }, { emoji: "🌸", name: "flower" }],
  [{ emoji: "👏", name: "clap" }, { emoji: "🦶", name: "stomp" }, { emoji: "🙌", name: "hands up" }],
  [{ emoji: "🔴", name: "red" }, { emoji: "🔵", name: "blue" }, { emoji: "🟡", name: "yellow" }],
];

// Sets where colour AND shape matter: kids must look at both attributes.
const MULTI_SETS: Element[][] = [
  [{ emoji: "🔴", name: "red circle" }, { emoji: "🟥", name: "red square" }, { emoji: "🔵", name: "blue circle" }],
  [{ emoji: "🟦", name: "blue square" }, { emoji: "🔵", name: "blue circle" }, { emoji: "🟨", name: "yellow square" }],
  [{ emoji: "🟢", name: "green circle" }, { emoji: "🟩", name: "green square" }, { emoji: "💚", name: "green heart" }],
  [{ emoji: "❤️", name: "red heart" }, { emoji: "💙", name: "blue heart" }, { emoji: "🔴", name: "red circle" }],
  [{ emoji: "🟡", name: "yellow circle" }, { emoji: "🟨", name: "yellow square" }, { emoji: "🟣", name: "purple circle" }],
];

const CORES: Record<Level, number[][]> = {
  1: [[0, 1], [0, 0, 1], [0, 1, 1]],
  2: [[0, 1, 2], [0, 0, 1, 1], [0, 1, 1], [0, 0, 1]],
  3: [[0, 1, 1, 2], [0, 0, 1, 2], [0, 1, 2, 2], [0, 1, 0, 2]],
};

function patternSet(d: Level): Element[] {
  if (d === 3) return pick(chance(0.6) ? MULTI_SETS : PATTERN_SETS);
  if (d === 2) return pick(chance(0.4) ? MULTI_SETS : PATTERN_SETS);
  return pick(PATTERN_SETS);
}

const asChoice = (e: Element) => ({ label: e.name, emoji: e.emoji });

function whatComesNext(d: Level): Question {
  const set = patternSet(d);
  const core = pick(CORES[d]);
  const shown = core.length * 2 + randInt(1, core.length);
  const seq = range(0, shown - 1).map((i) => set[core[i % core.length]]);
  const next = set[core[shown % core.length]];
  return textChoice(
    "What comes next?",
    asChoice(next),
    set.filter((s) => s !== next).map(asChoice),
    `Say the pattern out loud: ${core.map((i) => set[i].name).join(", ")}… then it starts again!`,
    { type: "emojiRow", items: seq.map((s) => s.emoji), showBlank: true },
  );
}

function whatIsMissing(d: Level): Question {
  const set = patternSet(d);
  const core = pick(CORES[d]);
  const len = core.length * 3;
  const gap = randInt(1, len - 2);
  const items = range(0, len - 1).map((i) => (i === gap ? "❓" : set[core[i % core.length]].emoji));
  const answer = set[core[gap % core.length]];
  return textChoice(
    "What is missing from the pattern?",
    asChoice(answer),
    set.filter((s) => s !== answer).map(asChoice),
    "Say the pattern out loud. What fits in the empty spot?",
    { type: "emojiRow", items },
  );
}

function findTheCore(d: Level): Question {
  const set = patternSet(d);
  const core = pick(CORES[d]);
  const text = (c: number[]) => c.map((i) => set[i].emoji).join(" ");
  const changed = [...core];
  changed[changed.length - 1] = (changed[changed.length - 1] + 1) % 3;
  const other = core.length >= 3 ? core.slice(0, -1) : [0, 1, 1];
  return textChoice(
    "Which part keeps repeating?",
    text(core),
    [text(changed), text(other)],
    "Find where the pattern starts over again. The part before that repeats.",
    { type: "emojiRow", items: range(0, core.length * 3 - 1).map((i) => set[core[i % core.length]].emoji) },
  );
}

type ShapeKey = "circle" | "square" | "heart";

const COLOUR_SHAPES: ({ colour: string } & Record<ShapeKey, string>)[] = [
  { colour: "red", circle: "🔴", square: "🟥", heart: "❤️" },
  { colour: "blue", circle: "🔵", square: "🟦", heart: "💙" },
  { colour: "green", circle: "🟢", square: "🟩", heart: "💚" },
  { colour: "yellow", circle: "🟡", square: "🟨", heart: "💛" },
  { colour: "purple", circle: "🟣", square: "🟪", heart: "💜" },
  { colour: "orange", circle: "🟠", square: "🟧", heart: "🧡" },
];

function whatChanges(): Question {
  const kinds = ["colour", "shape", "both"] as const;
  const labels = { colour: "Only the colour", shape: "Only the shape", both: "Colour and shape" };
  const kind = pick(kinds);
  const [c1, c2] = sample(COLOUR_SHAPES, 2);
  const [s1, s2] = sample<ShapeKey>(["circle", "square", "heart"], 2);
  const a = c1[s1];
  const b = kind === "colour" ? c2[s1] : kind === "shape" ? c1[s2] : c2[s2];
  const core = pick([[0, 1], [0, 0, 1], [0, 1, 1]]);
  const items = range(0, core.length * 2 + 1).map((i) => (core[i % core.length] === 0 ? a : b));
  return textChoice(
    "What changes in this pattern?",
    labels[kind],
    kinds.filter((k) => k !== kind).map((k) => labels[k]),
    "Look at the colours first. Then look at the shapes. Which ones change?",
    { type: "emojiRow", items },
  );
}

function samePattern(): Question {
  const [s1, s2] = sample(PATTERN_SETS, 2);
  const [c0, c1, c2] = sample([[0, 1], [0, 0, 1], [0, 1, 1], [0, 1, 2]], 3);
  const seq = (set: Element[], core: number[]) => range(0, 5).map((i) => set[core[i % core.length]].emoji);
  return textChoice(
    "Which one has the same pattern?",
    seq(s2, c0).join(" "),
    [seq(s2, c1).join(" "), seq(s2, c2).join(" ")],
    "Use letters: call the first thing A and the next new thing B. Which one sounds the same?",
    { type: "emojiRow", items: seq(s1, c0) },
  );
}

function nextTwo(): Question {
  const set = patternSet(3);
  const core = pick(CORES[3]);
  const shown = core.length * 2 + randInt(0, core.length - 1);
  const seq = range(0, shown - 1).map((i) => set[core[i % core.length]].emoji);
  const correct = `${set[core[shown % core.length]].emoji} ${set[core[(shown + 1) % core.length]].emoji}`;
  const others = set.flatMap((x) => set.map((y) => `${x.emoji} ${y.emoji}`)).filter((t) => t !== correct);
  return textChoice(
    "What are the next two?",
    correct,
    sample(others, 2),
    "Say the pattern out loud, then keep going for two more.",
    { type: "emojiRow", items: [...seq, "❓", "❓"] },
  );
}

function patterns(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  if (d === 1) {
    return buildSet([
      ...times(4, () => whatComesNext(1)),
      ...times(2, () => whatIsMissing(1)),
      ...times(2, () => findTheCore(1)),
    ]);
  }
  if (d === 2) {
    return buildSet([
      ...times(2, () => whatComesNext(2)),
      () => whatIsMissing(2),
      () => findTheCore(2),
      ...times(2, whatChanges),
      ...times(2, samePattern),
    ]);
  }
  return buildSet([
    ...times(2, () => whatComesNext(3)),
    () => whatIsMissing(3),
    () => findTheCore(3),
    whatChanges,
    samePattern,
    ...times(2, nextTwo),
  ]);
}

// ---------- Measuring (non-standard units) ----------

interface Obj {
  name: string;
  emoji: string;
}

const LONG_THINGS: Obj[] = [
  { name: "pencil", emoji: "✏️" },
  { name: "crayon", emoji: "🖍️" },
  { name: "carrot", emoji: "🥕" },
  { name: "caterpillar", emoji: "🐛" },
  { name: "snake", emoji: "🐍" },
  { name: "spoon", emoji: "🥄" },
  { name: "paintbrush", emoji: "🖌️" },
  { name: "banana", emoji: "🍌" },
  { name: "shoe", emoji: "👟" },
  { name: "key", emoji: "🔑" },
];

const MEASURE_UNITS = [
  { name: "paper clips", one: "paper clip", emoji: "📎" },
  { name: "cubes", one: "cube", emoji: "🟦" },
];

type MeasureUnit = (typeof MEASURE_UNITS)[number];

function lengthsVisual(u: MeasureUnit, rows: { obj: Obj; n: number }[]): Visual {
  return {
    type: "pictograph",
    title: `Measured in ${u.name}`,
    rows: rows.map((r) => ({ label: `${r.obj.emoji} ${r.obj.name}`, emoji: u.emoji, count: r.n })),
  };
}

function howLong(d: Level): Question {
  const obj = pick(LONG_THINGS);
  const u = pick(MEASURE_UNITS);
  const n = d === 1 ? randInt(2, 6) : d === 2 ? randInt(3, 9) : randInt(5, 12);
  return numberChoice(
    `How many ${u.name} long is the ${obj.name}?`,
    n,
    `Count each ${u.one} from one end of the ${obj.name} to the other.`,
    { type: "emoji", emoji: obj.emoji, caption: u.emoji.repeat(n) },
    { min: 1, max: 15 },
  );
}

function compareLength(d: Level, mode: "longer" | "shorter"): Question {
  const [o1, o2] = sample(LONG_THINGS, 2);
  const u = pick(MEASURE_UNITS);
  const [a, b] = sample(range(2, d === 1 ? 8 : 12), 2);
  const longer = a > b ? o1 : o2;
  const answer = mode === "longer" ? longer : longer === o1 ? o2 : o1;
  const other = answer === o1 ? o2 : o1;
  return textChoice(
    `Which is ${mode}?`,
    { label: answer.name, emoji: answer.emoji },
    [{ label: other.name, emoji: other.emoji }],
    mode === "longer"
      ? `The one that needs more ${u.name} is longer.`
      : `The one that needs fewer ${u.name} is shorter.`,
    lengthsVisual(u, [
      { obj: o1, n: a },
      { obj: o2, n: b },
    ]),
  );
}

function howManyLonger(): Question {
  const [o1, o2] = sample(LONG_THINGS, 2);
  const u = pick(MEASURE_UNITS);
  const a = randInt(6, 12);
  const b = randInt(2, a - 1);
  return numberChoice(
    `How many more ${u.name} long is the ${o1.name} than the ${o2.name}?`,
    a - b,
    `Match the two rows. Count the extra ${u.name} in the ${o1.name} row.`,
    lengthsVisual(u, [
      { obj: o1, n: a },
      { obj: o2, n: b },
    ]),
    { min: 0, max: 15 },
  );
}

function orderLengths(): OrderQuestion {
  const objs = sample(LONG_THINGS, 3);
  const u = pick(MEASURE_UNITS);
  const lens = sample(range(2, 12), 3);
  const rows = objs.map((obj, i) => ({ obj, n: lens[i] }));
  const sorted = [...rows].sort((x, y) => x.n - y.n);
  return {
    kind: "order",
    prompt: "Tap them from shortest to longest.",
    hint: `Fewer ${u.name} means shorter. Start with the ${sorted[0].obj.name}.`,
    visual: lengthsVisual(u, rows),
    items: sorted.map((r, i) => ({ id: `m${i}`, label: r.obj.name, emoji: r.obj.emoji })),
  };
}

const COMPARE_BANK: BankItem[] = [
  {
    prompt: "Which is the heaviest?",
    right: { label: "elephant", emoji: "🐘" },
    wrong: [{ label: "dog", emoji: "🐕" }, { label: "mouse", emoji: "🐭" }],
    hint: "Imagine lifting each one. Which would be hardest to lift?",
  },
  {
    prompt: "Which is the lightest?",
    right: { label: "feather", emoji: "🪶" },
    wrong: [{ label: "book", emoji: "📕" }, { label: "chair", emoji: "🪑" }],
    hint: "Imagine holding each one. Which one feels like almost nothing?",
  },
  {
    prompt: "Which holds the most water?",
    right: { label: "bathtub", emoji: "🛁" },
    wrong: [{ label: "bucket", emoji: "🪣" }, { label: "cup", emoji: "☕" }],
    hint: "Think about which one has the most space inside.",
  },
  {
    prompt: "Which holds the least water?",
    right: { label: "spoon", emoji: "🥄" },
    wrong: [{ label: "bowl", emoji: "🥣" }, { label: "bucket", emoji: "🪣" }],
    hint: "Think about which one has the least space inside.",
  },
  {
    prompt: "Which is the tallest?",
    right: { label: "giraffe", emoji: "🦒" },
    wrong: [{ label: "horse", emoji: "🐎" }, { label: "rabbit", emoji: "🐇" }],
    hint: "Imagine them standing side by side. Which one reaches the highest?",
  },
  {
    prompt: "Which is the longest?",
    right: { label: "train", emoji: "🚆" },
    wrong: [{ label: "car", emoji: "🚗" }, { label: "skateboard", emoji: "🛹" }],
    hint: "Imagine them parked in a line. Which one stretches the farthest?",
  },
  {
    prompt: "Which is heavier?",
    right: { label: "watermelon", emoji: "🍉" },
    wrong: [{ label: "grape", emoji: "🍇" }],
    hint: "Imagine one in each hand. Which hand would go down?",
  },
];

const HOW_BANK: BankItem[] = [
  {
    prompt: "Where should the first cube go when you measure?",
    right: "Right at the end",
    wrong: ["In the middle", "Anywhere at all"],
    hint: "Start right at one end so you measure the whole thing.",
    emoji: "🟦",
  },
  {
    prompt: "How should you line up the cubes?",
    right: "End to end, no gaps",
    wrong: ["With gaps between", "Piled on top"],
    hint: "Put each cube right next to the last one, with no spaces.",
    emoji: "🟦",
  },
  {
    prompt: "What is best for measuring a pencil?",
    right: { label: "paper clips", emoji: "📎" },
    wrong: [{ label: "footsteps", emoji: "👣" }],
    hint: "Small things need small units.",
  },
  {
    prompt: "To measure fairly, the units should be…",
    right: "All the same size",
    wrong: ["All different sizes"],
    hint: "Same-size units make your count fair and easy to compare.",
    emoji: "📎",
  },
  {
    prompt: "What is best for measuring a long hallway?",
    right: { label: "footsteps", emoji: "👣" },
    wrong: [{ label: "paper clips", emoji: "📎" }],
    hint: "Big things need bigger units, so you don't have to count so many!",
  },
];

const HARD_MEASURE_BANK: BankItem[] = [
  {
    prompt: "Lena and Sam measure a rug with their feet. Lena gets 8, Sam gets 10. Why?",
    right: "Their feet are different sizes",
    wrong: ["Sam walked faster", "The rug got longer"],
    hint: "Smaller feet fit more times. Different-size units give different numbers!",
    emoji: "👣",
  },
  {
    prompt: "You measure a book with 📎 and with ✏️. Which will you need more of?",
    speak: "You measure a book with paper clips and with pencils. Which will you need more of?",
    right: { label: "paper clips", emoji: "📎" },
    wrong: [{ label: "pencils", emoji: "✏️" }],
    hint: "Paper clips are small, so it takes more of them to cover the book.",
  },
  {
    prompt: "A desk is 6 ✏️ long. How many 📎 long will it be?",
    speak: "A desk is 6 pencils long. How many paper clips long will it be?",
    right: "More than 6",
    wrong: ["Less than 6", "Exactly 6"],
    hint: "A paper clip is shorter than a pencil, so you need more of them.",
  },
  {
    prompt: "Ana measures with big and small blocks mixed up. Is that fair?",
    right: "No, use same-size blocks",
    wrong: ["Yes, that is fair"],
    hint: "When the units are different sizes, the count doesn't tell us much.",
    emoji: "🧱",
  },
];

function measuring(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const bank = (items: BankItem[]): Maker => () => fromBank(items, 1)[0];
  if (d === 1) {
    return buildSet([
      ...times(3, () => howLong(1)),
      () => compareLength(1, "longer"),
      ...times(2, bank(COMPARE_BANK)),
      ...times(2, bank(HOW_BANK.slice(0, 3))),
    ]);
  }
  if (d === 2) {
    return buildSet([
      ...times(2, () => howLong(2)),
      () => compareLength(2, "longer"),
      () => compareLength(2, "shorter"),
      orderLengths,
      ...times(2, bank(HOW_BANK)),
      bank(COMPARE_BANK),
    ]);
  }
  return buildSet([
    ...times(2, () => howLong(3)),
    ...times(2, howManyLonger),
    orderLengths,
    ...times(2, bank(HARD_MEASURE_BANK)),
    bank(HOW_BANK.slice(3)),
  ]);
}

// ---------- Shapes (2D and 3D) ----------

const SIDES: Partial<Record<ShapeName, number>> = {
  circle: 0,
  triangle: 3,
  square: 4,
  rectangle: 4,
  pentagon: 5,
  hexagon: 6,
};

const FLAT_POOL: Record<Level, ShapeName[]> = {
  1: ["triangle", "square", "rectangle"],
  2: ["triangle", "square", "rectangle", "hexagon"],
  3: ["triangle", "square", "rectangle", "hexagon", "pentagon"],
};

const SOLIDS: ShapeName[] = ["cube", "sphere", "cylinder", "cone"];

const NAME_HINT: Partial<Record<ShapeName, string>> = {
  circle: "It is round, with no straight sides and no corners.",
  triangle: "Count the sides: 1, 2, 3.",
  square: "It has 4 straight sides that are all the same length.",
  rectangle: "It has 4 sides: 2 long sides and 2 short sides.",
  pentagon: "Count the sides. There are 5!",
  hexagon: "Count the sides. There are 6!",
  cube: "It looks like a box, and every face is a square.",
  sphere: "It is round all over, like a ball.",
  cylinder: "It looks like a can, with a flat circle at each end.",
  cone: "It has a flat circle on one end and a point on the other.",
};

const shapeChoice = (s: ShapeName) => ({ label: s, shape: s });

function nameShape(d: Level): Question {
  const pool: ShapeName[] =
    d === 1
      ? ["circle", "triangle", "square", "rectangle"]
      : d === 2
        ? ["circle", "triangle", "square", "rectangle", "hexagon"]
        : ["circle", "triangle", "square", "rectangle", "hexagon", "pentagon", ...SOLIDS];
  const target = pick(pool);
  // A square is also a rectangle, so never offer "rectangle" as wrong for a square.
  const others = pool.filter((s) => s !== target && !(target === "square" && s === "rectangle"));
  return textChoice(
    "What is this shape called?",
    target,
    sample(others, 2),
    NAME_HINT[target] ?? "Look at its sides and corners.",
    { type: "shape", shape: target },
  );
}

function countSides(d: Level): Question {
  const shape = pick(FLAT_POOL[d]);
  return numberChoice(
    "How many sides does this shape have?",
    SIDES[shape]!,
    "Touch each straight side as you count.",
    { type: "shape", shape },
    { min: 3, max: 8 },
  );
}

function countCorners(d: Level): Question {
  const pool: ShapeName[] = d === 1 ? FLAT_POOL[1] : [...FLAT_POOL[d], "circle"];
  const shape = pick(pool);
  return numberChoice(
    "How many corners does this shape have?",
    SIDES[shape]!,
    shape === "circle"
      ? "A circle is round all the way around. Can you find any pointy corners?"
      : "A corner is where two sides meet. Touch each one as you count.",
    { type: "shape", shape },
    { min: 0, max: 8 },
  );
}

function moreSides(d: Level): Question {
  const pool: ShapeName[] = d === 3 ? ["triangle", "square", "pentagon", "hexagon"] : ["triangle", "square", "hexagon"];
  const [a, b] = sample(pool, 2);
  const more = SIDES[a]! > SIDES[b]! ? a : b;
  const less = more === a ? b : a;
  return textChoice(
    "Which shape has more sides?",
    shapeChoice(more),
    [shapeChoice(less)],
    "Count the sides of each shape. Which number is bigger?",
  );
}

function rollOrStack(d: Level): Question {
  if (d === 1) {
    if (chance(0.5)) {
      const right = pick<ShapeName>(["sphere", "cylinder"]);
      return textChoice(
        "Which one can roll?",
        shapeChoice(right),
        [shapeChoice("cube")],
        "Shapes with a curved surface can roll. Flat faces make things slide.",
      );
    }
    return textChoice(
      "Which one is good for stacking?",
      shapeChoice("cube"),
      [shapeChoice("sphere")],
      "Flat faces sit nicely on top of each other. Round ones roll off!",
    );
  }
  if (chance(0.5)) {
    return textChoice(
      "Which one can NOT roll?",
      shapeChoice("cube"),
      [shapeChoice("sphere"), shapeChoice("cylinder")],
      "A shape needs a curved surface to roll. Which one has only flat faces?",
    );
  }
  return textChoice(
    "Which one is best for stacking?",
    shapeChoice("cube"),
    [shapeChoice("sphere"), shapeChoice("cone")],
    "Flat faces on the top and bottom make a shape easy to stack.",
  );
}

function flatFaces(): Question {
  if (chance(0.5)) {
    return textChoice(
      "Which one has only flat faces?",
      shapeChoice("cube"),
      [shapeChoice("sphere"), shapeChoice("cylinder")],
      "Look for a shape with no curved parts at all.",
    );
  }
  return textChoice(
    "Which one has no flat faces?",
    shapeChoice("sphere"),
    [shapeChoice("cube"), shapeChoice("cylinder")],
    "Look for a shape that is curved all over, like a ball.",
  );
}

const FACE_TRACES: { prompt: string; solid: ShapeName; face: ShapeName }[] = [
  { prompt: "Trace a flat face of a cube. What shape do you get?", solid: "cube", face: "square" },
  { prompt: "Trace the bottom of a cylinder. What shape do you get?", solid: "cylinder", face: "circle" },
  { prompt: "Trace the flat bottom of a cone. What shape do you get?", solid: "cone", face: "circle" },
];

function traceFace(): Question {
  const f = pick(FACE_TRACES);
  return textChoice(
    f.prompt,
    shapeChoice(f.face),
    (["square", "circle", "triangle"] as ShapeName[]).filter((s) => s !== f.face).map(shapeChoice),
    "Imagine pressing the flat face onto paper and drawing around it.",
    { type: "shape", shape: f.solid },
  );
}

const REAL_SOLIDS: { thing: string; emoji: string; shape: ShapeName }[] = [
  { thing: "ball", emoji: "🏀", shape: "sphere" },
  { thing: "orange", emoji: "🍊", shape: "sphere" },
  { thing: "can of soup", emoji: "🥫", shape: "cylinder" },
  { thing: "drum", emoji: "🥁", shape: "cylinder" },
  { thing: "ice cube", emoji: "🧊", shape: "cube" },
  { thing: "number cube", emoji: "🎲", shape: "cube" },
  { thing: "ice cream cone", emoji: "🍦", shape: "cone" },
];

function realSolid(): Question {
  const r = pick(REAL_SOLIDS);
  return textChoice(
    `${capArticle(r.thing)} ${r.thing} is shaped like a…`,
    shapeChoice(r.shape),
    sample(SOLIDS.filter((s) => s !== r.shape), 2).map(shapeChoice),
    "Think about its faces. Is it round all over, or does it have flat faces or a point?",
    { type: "emoji", emoji: r.emoji },
  );
}

function flatOrSolid(d: Level): Question {
  if (d === 3 && chance(0.5)) {
    const solid = pick(SOLIDS);
    return textChoice(
      "Which one is a 3D shape?",
      shapeChoice(solid),
      sample<ShapeName>(["circle", "square", "triangle", "rectangle"], 2).map(shapeChoice),
      "3D shapes are solid. You can hold them, like a ball or a box.",
    );
  }
  const flat = pick<ShapeName>(["circle", "square", "triangle"]);
  return textChoice(
    "Which one is a flat shape?",
    shapeChoice(flat),
    sample(SOLIDS, 2).map(shapeChoice),
    "A flat shape is like a drawing on paper. 3D shapes are solid, like a ball.",
  );
}

const SAME_DIFFERENT: BankItem[] = [
  {
    prompt: "How are a square and a rectangle the same?",
    right: "Both have 4 sides",
    wrong: ["Both are round", "Both have 3 corners"],
    hint: "Count the sides of each one.",
  },
  {
    prompt: "How is a circle different from a square?",
    right: "A circle has no corners",
    wrong: ["A circle has 4 sides", "A circle has more corners"],
    hint: "Run your finger around a circle. Do you bump into any corners?",
  },
  {
    prompt: "How are a ball and a can the same?",
    right: "Both can roll",
    wrong: ["Both have only flat faces", "Both have corners"],
    hint: "Think about what happens when you push each one on its side.",
  },
  {
    prompt: "How is a cube different from a sphere?",
    right: "A cube has flat faces",
    wrong: ["A cube can roll", "A cube is round"],
    hint: "Look at the sides of a cube. Are they flat or curved?",
  },
  {
    prompt: "How is a triangle different from a square?",
    right: "A triangle has 3 sides",
    wrong: ["A triangle has 4 sides", "A triangle is round"],
    hint: "Count the sides of each shape.",
  },
];

const ROLL_SORT: SortSet = {
  prompt: "Does it roll? Sort them.",
  hint: "Round things with curved surfaces roll. Things with only flat faces slide.",
  bins: [
    { id: "rolls", label: "Rolls", emoji: "🔄" },
    { id: "no", label: "Does not roll", emoji: "✋" },
  ],
  items: [
    { label: "soccer ball", emoji: "⚽", bin: "rolls" },
    { label: "basketball", emoji: "🏀", bin: "rolls" },
    { label: "orange", emoji: "🍊", bin: "rolls" },
    { label: "tennis ball", emoji: "🎾", bin: "rolls" },
    { label: "box", emoji: "📦", bin: "no" },
    { label: "brick", emoji: "🧱", bin: "no" },
    { label: "book", emoji: "📕", bin: "no" },
    { label: "ice cube", emoji: "🧊", bin: "no" },
    { label: "gift", emoji: "🎁", bin: "no" },
  ],
};

function shapes(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const sameDifferent = () => fromBank(SAME_DIFFERENT, 1)[0];
  if (d === 1) {
    return buildSet([
      ...times(2, () => nameShape(1)),
      () => countSides(1),
      () => countCorners(1),
      realSolid,
      () => rollOrStack(1),
      () => sortQuestion(ROLL_SORT, 2),
      () => flatOrSolid(1),
    ]);
  }
  if (d === 2) {
    return buildSet([
      () => nameShape(2),
      () => countSides(2),
      () => countCorners(2),
      () => moreSides(2),
      () => rollOrStack(2),
      realSolid,
      () => sortQuestion(ROLL_SORT, 3),
      sameDifferent,
    ]);
  }
  return buildSet([
    () => nameShape(3),
    () => countSides(3),
    () => moreSides(3),
    flatFaces,
    traceFace,
    realSolid,
    () => flatOrSolid(3),
    sameDifferent,
  ]);
}

// ---------- Coins ----------

function centsChoice(prompt: string, answer: number, hint: string, coins?: number[]): ChoiceQuestion {
  const wrong = shuffle([5, -5, 10, -10])
    .map((d) => answer + d)
    .filter((n) => n > 0 && n <= 60)
    .slice(0, 2);
  return {
    kind: "choice",
    prompt,
    hint,
    visual: coins ? { type: "coins", coins } : undefined,
    answer: String(answer),
    choices: shuffle([answer, ...wrong]).map((n) => ({ id: String(n), label: `${n}¢` })),
  };
}

function nameTheCoin(d: Level): Question {
  const pool = d === 3 ? [5, 10, 25, 100] : [5, 10, 25];
  const c = pick(pool);
  return textChoice(
    "What is this coin called?",
    COIN_NAMES[c],
    sample(pool.filter((x) => x !== c), 2).map((x) => COIN_NAMES[x]),
    d === 3
      ? "A nickel is 5¢, a dime is 10¢, a quarter is 25¢ and a loonie is $1."
      : "A nickel is 5¢, a dime is 10¢ and a quarter is 25¢.",
    { type: "coins", coins: [c] },
  );
}

function coinValue(): Question {
  const c = pick([5, 10, 25]);
  return textChoice(
    `How much is a ${COIN_NAMES[c]} worth?`,
    `${c}¢`,
    [5, 10, 25].filter((x) => x !== c).map((x) => `${x}¢`),
    "Nickel = 5¢. Dime = 10¢. Quarter = 25¢.",
    { type: "emoji", emoji: "🪙" },
  );
}

function worthMore(): Question {
  const [a, b] = sample([5, 10, 25], 2);
  const big = Math.max(a, b);
  const small = Math.min(a, b);
  const extra = big === 10 && small === 5 ? " A dime is smaller, but it is worth more!" : "";
  return textChoice(
    "Which coin is worth more?",
    { label: COIN_NAMES[big], coin: big },
    [{ label: COIN_NAMES[small], coin: small }],
    `A ${COIN_NAMES[big]} is ${big}¢ and a ${COIN_NAMES[small]} is ${small}¢.${extra}`,
  );
}

function countMoney(d: Level): Question {
  let coins: number[];
  let hint: string;
  if (d === 1) {
    if (chance(0.5)) {
      coins = repeat(5, randInt(2, 4));
      hint = "Each nickel is 5¢. Count by 5s: 5, 10, 15…";
    } else {
      coins = repeat(10, randInt(2, 3));
      hint = "Each dime is 10¢. Count by 10s: 10, 20, 30…";
    }
  } else if (d === 2) {
    coins = [...repeat(10, randInt(1, 3)), ...repeat(5, randInt(1, 3))];
    hint = "Count the dimes by 10s first. Then count on 5 more for each nickel.";
  } else {
    const rest: number[] = [];
    let total = 25;
    const n = randInt(1, 3);
    for (let i = 0; i < n; i++) {
      const fits = [10, 5].filter((c) => total + c <= 50);
      if (!fits.length) break;
      const c = pick(fits);
      rest.push(c);
      total += c;
    }
    coins = [25, ...rest.sort((x, y) => y - x)];
    hint = "Start at 25 for the quarter. Count on 10 for each dime and 5 for each nickel.";
  }
  const total = coins.reduce((s, c) => s + c, 0);
  return centsChoice("How much money is this?", total, hint, coins);
}

function makeAmount(d: Level): Question {
  const target = d === 1 ? randInt(1, 4) * 5 : d === 2 ? randInt(2, 7) * 5 : randInt(5, 10) * 5;
  return {
    kind: "coins",
    prompt: `Make ${target}¢.`,
    hint:
      d === 1
        ? "A nickel is 5¢ and a dime is 10¢. Count up as you tap!"
        : "Try the biggest coin that fits first, then count on.",
    target,
    coins: d === 1 ? [5, 10] : [5, 10, 25],
  };
}

const EXCHANGES: Record<Level, { q: string; a: number; hint: string; show?: number[] }[]> = {
  1: [
    { q: "How many nickels make a dime?", a: 2, hint: "5¢ + 5¢ = 10¢. Count by 5s up to 10.", show: [10] },
    { q: "How many nickels make 15¢?", a: 3, hint: "Count by 5s: 5, 10, 15." },
    { q: "How many dimes make 20¢?", a: 2, hint: "Count by 10s: 10, 20." },
  ],
  2: [
    { q: "How many nickels make 20¢?", a: 4, hint: "Count by 5s: 5, 10, 15, 20." },
    { q: "How many dimes make 30¢?", a: 3, hint: "Count by 10s: 10, 20, 30." },
    { q: "How many nickels make 2 dimes?", a: 4, hint: "2 dimes are 20¢. Count by 5s up to 20.", show: [10, 10] },
    { q: "How many dimes make 50¢?", a: 5, hint: "Count by 10s: 10, 20, 30, 40, 50." },
  ],
  3: [
    { q: "How many nickels make a quarter?", a: 5, hint: "A quarter is 25¢. Count by 5s up to 25.", show: [25] },
    { q: "How many nickels make 1 dime and 1 nickel?", a: 3, hint: "A dime and a nickel make 15¢. Count by 5s to 15.", show: [10, 5] },
    { q: "How many dimes make 40¢?", a: 4, hint: "Count by 10s: 10, 20, 30, 40." },
    { q: "How many nickels make 30¢?", a: 6, hint: "Count by 5s: 5, 10, 15, 20, 25, 30." },
  ],
};

function exchange(d: Level): Question {
  const e = pick(EXCHANGES[d]);
  return numberChoice(e.q, e.a, e.hint, e.show ? { type: "coins", coins: e.show } : undefined, { min: 1, max: 10 });
}

const TRADES = [
  { coins: [10, 10, 5], answer: 25, hint: "Count them up: 10¢ + 10¢ + 5¢ = 25¢." },
  { coins: [5, 5], answer: 10, hint: "Count them up: 5¢ + 5¢ = 10¢." },
  { coins: [5, 5, 5, 5, 5], answer: 25, hint: "Count by 5s: 5, 10, 15, 20, 25." },
];

function tradeForCoin(): Question {
  const t = pick(TRADES);
  return textChoice(
    "Which one coin is worth the same as these?",
    { label: COIN_NAMES[t.answer], coin: t.answer },
    [5, 10, 25].filter((c) => c !== t.answer).map((c) => ({ label: COIN_NAMES[c], coin: c })),
    t.hint,
    { type: "coins", coins: t.coins },
  );
}

const SHOP = [
  { name: "sticker", emoji: "⭐" },
  { name: "pencil", emoji: "✏️" },
  { name: "apple", emoji: "🍎" },
  { name: "bookmark", emoji: "🔖" },
  { name: "balloon", emoji: "🎈" },
];

function canBuy(): Question {
  const item = pick(SHOP);
  const coins = [...repeat(10, randInt(1, 3)), ...repeat(5, randInt(0, 2))];
  const have = coins.reduce((s, c) => s + c, 0);
  const cost = Math.max(5, have + pick([-10, -5, 0, 5, 10]));
  const enough = have >= cost;
  const yes = "Yes, I have enough";
  const no = "No, not enough";
  return textChoice(
    `${capArticle(item.name)} ${item.name} costs ${cost}¢. Can you buy it with these coins?`,
    enough ? yes : no,
    [enough ? no : yes],
    `Count your coins first. Is it at least ${cost}¢?`,
    { type: "coins", coins },
  );
}

function moneyLeft(): Question {
  const item = pick(SHOP);
  const have = pick([10, 15, 20]);
  const cost = randInt(1, have / 5 - 1) * 5;
  const q = centsChoice(
    `You have ${have}¢. ${capArticle(item.name)} ${item.name} costs ${cost}¢. How much is left?`,
    have - cost,
    `Start at ${have}¢ and count back ${cost}¢ by 5s.`,
  );
  q.visual = { type: "emoji", emoji: item.emoji, caption: `${cost}¢` };
  return q;
}

function coins(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  if (d === 1) {
    return buildSet([
      () => nameTheCoin(1),
      coinValue,
      worthMore,
      ...times(2, () => countMoney(1)),
      ...times(2, () => makeAmount(1)),
      () => exchange(1),
    ]);
  }
  if (d === 2) {
    return buildSet([
      () => nameTheCoin(2),
      worthMore,
      ...times(2, () => countMoney(2)),
      ...times(2, () => makeAmount(2)),
      () => exchange(2),
      canBuy,
    ]);
  }
  return buildSet([
    chance(0.5) ? () => nameTheCoin(3) : coinValue,
    ...times(2, () => countMoney(3)),
    ...times(2, () => makeAmount(3)),
    () => exchange(3),
    tradeForCoin,
    moneyLeft,
  ]);
}

// ---------- Graphs & Chance ----------

const GRAPH_TOPICS: { title: string; rows: Labelled[] }[] = [
  {
    title: "Our favourite fruit",
    rows: [
      { label: "apples", emoji: "🍎" },
      { label: "bananas", emoji: "🍌" },
      { label: "strawberries", emoji: "🍓" },
      { label: "grapes", emoji: "🍇" },
    ],
  },
  {
    title: "Pets in our class",
    rows: [
      { label: "dogs", emoji: "🐶" },
      { label: "cats", emoji: "🐱" },
      { label: "fish", emoji: "🐠" },
      { label: "rabbits", emoji: "🐰" },
    ],
  },
  {
    title: "Weather this month",
    rows: [
      { label: "sunny days", emoji: "☀️" },
      { label: "rainy days", emoji: "🌧️" },
      { label: "cloudy days", emoji: "☁️" },
      { label: "snowy days", emoji: "❄️" },
    ],
  },
  {
    title: "Bugs we found",
    rows: [
      { label: "ladybugs", emoji: "🐞" },
      { label: "bees", emoji: "🐝" },
      { label: "ants", emoji: "🐜" },
      { label: "butterflies", emoji: "🦋" },
    ],
  },
  {
    title: "Toys in the bin",
    rows: [
      { label: "balls", emoji: "⚽" },
      { label: "teddy bears", emoji: "🧸" },
      { label: "blocks", emoji: "🧱" },
      { label: "cars", emoji: "🚗" },
    ],
  },
];

interface GraphRow extends Labelled {
  count: number;
}

interface Graph {
  title: string;
  rows: GraphRow[];
}

function makeGraph(d: Level): Graph {
  const topic = pick(GRAPH_TOPICS);
  const n = d === 1 ? 2 : 3;
  const rows = sample(topic.rows, n);
  const counts = sample(d === 1 ? range(1, 6) : d === 2 ? range(1, 8) : range(2, 10), n);
  return { title: topic.title, rows: rows.map((r, i) => ({ ...r, count: counts[i] })) };
}

const pictograph = (g: Graph): Visual => ({ type: "pictograph", title: g.title, rows: g.rows });

const barGraph = (g: Graph): Visual => ({
  type: "bars",
  title: g.title,
  bars: g.rows.map((r) => ({ label: r.label, value: r.count, emoji: r.emoji })),
});

function graphHowMany(d: Level, bars = false): Question {
  const g = makeGraph(d);
  const row = pick(g.rows);
  return numberChoice(
    `How many ${row.label}?`,
    row.count,
    bars ? `Find the ${row.label} bar. Look at the number where the bar ends.` : `Find the ${row.label} row. Count each picture.`,
    bars ? barGraph(g) : pictograph(g),
    { min: 0, max: 12 },
  );
}

function graphMostFewest(d: Level, mode: "most" | "fewest", bars = false): Question {
  const g = makeGraph(d);
  const sorted = [...g.rows].sort((a, b) => b.count - a.count);
  const target = mode === "most" ? sorted[0] : sorted[sorted.length - 1];
  const prompt =
    g.rows.length === 2
      ? mode === "most"
        ? "Which has more?"
        : "Which has fewer?"
      : mode === "most"
        ? "Which has the most?"
        : "Which has the fewest?";
  const shape = bars ? "bar" : "row";
  return textChoice(
    prompt,
    { label: target.label, emoji: target.emoji },
    g.rows.filter((r) => r !== target).map((r) => ({ label: r.label, emoji: r.emoji })),
    mode === "most" ? `Look for the longest ${shape}.` : `Look for the shortest ${shape}.`,
    bars ? barGraph(g) : pictograph(g),
  );
}

function graphHowManyMore(d: Level): Question {
  const g = makeGraph(d);
  const [a, b] = sample(g.rows, 2).sort((x, y) => y.count - x.count);
  return numberChoice(
    `How many more ${a.label} than ${b.label}?`,
    a.count - b.count,
    `Match the two rows picture by picture. Count the extra ${a.label}.`,
    pictograph(g),
    { min: 0, max: 10 },
  );
}

function graphInAll(): Question {
  const g = makeGraph(3);
  const [a, b] = sample(g.rows, 2);
  return numberChoice(
    `How many ${a.label} and ${b.label} in all?`,
    a.count + b.count,
    `Count the ${a.label}, then keep counting the ${b.label}.`,
    pictograph(g),
    TO_20,
  );
}

type Likely = "likely" | "unlikely";

const LIKELY_EVENTS: { text: string; emoji: string; answer: Likely }[] = [
  { text: "You will see a bird outside this week.", emoji: "🐦", answer: "likely" },
  { text: "It will be cold on a winter day.", emoji: "⛄", answer: "likely" },
  { text: "You will drink some water today.", emoji: "💧", answer: "likely" },
  { text: "It will be warm on a summer day.", emoji: "☀️", answer: "likely" },
  { text: "You will hear a dog bark this week.", emoji: "🐕", answer: "likely" },
  { text: "It will snow on a hot summer day.", emoji: "❄️", answer: "unlikely" },
  { text: "A bird will land on your head today.", emoji: "🐦", answer: "unlikely" },
  { text: "You will find a gold coin on the sidewalk.", emoji: "🪙", answer: "unlikely" },
  { text: "You will eat 20 bananas for lunch.", emoji: "🍌", answer: "unlikely" },
  { text: "A rainbow will stay in the sky all day.", emoji: "🌈", answer: "unlikely" },
];

function likelyQuestion(e: (typeof LIKELY_EVENTS)[number]): ChoiceQuestion {
  return {
    kind: "choice",
    prompt: e.text,
    hint:
      e.answer === "likely"
        ? "Likely means it will probably happen."
        : "Unlikely means it probably won't happen, but it could.",
    visual: { type: "emoji", emoji: e.emoji, caption: "Likely or unlikely?" },
    answer: e.answer,
    choices: [
      { id: "likely", label: "likely", emoji: "👍" },
      { id: "unlikely", label: "unlikely", emoji: "🤏" },
    ],
  };
}

const likelyEvent = (): Question => likelyQuestion(pick(LIKELY_EVENTS));

type Certainty = "certain" | "might" | "impossible";

const CERTAIN_EVENTS: { text: string; emoji: string; answer: Certainty }[] = [
  { text: "Tomorrow will come after today.", emoji: "📅", answer: "certain" },
  { text: "Monday will come after Sunday.", emoji: "🗓️", answer: "certain" },
  { text: "When you count, 5 will come after 4.", emoji: "🔢", answer: "certain" },
  { text: "It will rain tomorrow.", emoji: "🌧️", answer: "might" },
  { text: "You will see a dog today.", emoji: "🐶", answer: "might" },
  { text: "Your friend will wear blue today.", emoji: "👕", answer: "might" },
  { text: "A fish will ride a bike to school.", emoji: "🐟", answer: "impossible" },
  { text: "You will meet a real dragon at recess.", emoji: "🐉", answer: "impossible" },
  { text: "A dog will drive the school bus.", emoji: "🚌", answer: "impossible" },
];

const CERTAINTY_HINT: Record<Certainty, string> = {
  certain: "Certain means it will happen for sure.",
  might: "It could happen, or it might not. We can't be sure!",
  impossible: "Impossible means it can never happen.",
};

function certaintyEvent(k: Certainty): Question {
  const e = pick(CERTAIN_EVENTS.filter((x) => x.answer === k));
  return {
    kind: "choice",
    prompt: e.text,
    hint: CERTAINTY_HINT[k],
    visual: { type: "emoji", emoji: e.emoji, caption: "Will it happen?" },
    answer: k,
    choices: [
      { id: "certain", label: "certain", emoji: "✅" },
      { id: "might", label: "might happen", emoji: "🤔" },
      { id: "impossible", label: "impossible", emoji: "🚫" },
    ],
  };
}

const MARBLES = [
  { name: "red", emoji: "🔴" },
  { name: "blue", emoji: "🔵" },
  { name: "green", emoji: "🟢" },
  { name: "yellow", emoji: "🟡" },
];

function marbleBag(d: Level): Question {
  const n = d === 1 ? 2 : 3;
  const colours = sample(MARBLES, n);
  const counts = d === 1 ? [randInt(5, 7), randInt(1, 2)] : [randInt(5, 7), randInt(3, 4), 1];
  const least = d === 3;
  const answer = least ? colours[n - 1] : colours[0];
  const items = shuffle(colours.flatMap((c, i) => repeat(c.emoji, counts[i])));
  return textChoice(
    `You pick one marble without looking. Which colour is ${least ? "least" : "most"} likely?`,
    { label: answer.name, emoji: answer.emoji },
    colours.filter((c) => c !== answer).map((c) => ({ label: c.name, emoji: c.emoji })),
    least
      ? "The colour with the fewest marbles is the least likely to be picked."
      : "The colour with the most marbles is the most likely to be picked.",
    { type: "emojiRow", items },
  );
}

function graphsAndChance(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  if (d === 1) {
    return buildSet([
      ...times(3, () => graphHowMany(1)),
      () => graphMostFewest(1, "most"),
      () => graphMostFewest(1, "fewest"),
      ...times(2, likelyEvent),
      () => marbleBag(1),
    ]);
  }
  if (d === 2) {
    return buildSet([
      () => graphHowMany(2),
      () => graphHowMany(2, true),
      () => graphMostFewest(2, "most"),
      () => graphMostFewest(2, "fewest"),
      () => graphHowManyMore(2),
      ...times(2, likelyEvent),
      () => marbleBag(2),
    ]);
  }
  const [k1, k2] = sample<Certainty>(["certain", "might", "impossible"], 2);
  return buildSet([
    ...times(2, () => graphHowManyMore(3)),
    graphInAll,
    () => graphMostFewest(3, chance(0.5) ? "most" : "fewest", true),
    () => graphHowMany(3, true),
    () => certaintyEvent(k1),
    () => certaintyEvent(k2),
    () => marbleBag(3),
  ]);
}

// ---------- Course ----------

export const course: Course = {
  grade: "1",
  subject: "math",
  bigIdeas: {
    "ca-bc": [
      "Numbers to 20 represent quantities that can be decomposed into 10s and 1s.",
      "Addition and subtraction with numbers to 10 can be modelled concretely, pictorially, and symbolically to develop computational fluency.",
      "Repeating elements in patterns can be identified.",
      "Objects and shapes have attributes that can be described, measured, and compared.",
      "Concrete items can be represented, compared, and interpreted pictorially in graphs.",
    ],
  },
  units: [
    {
      id: "numbers-to-20",
      title: "Numbers to 20",
      emoji: "🔢",
      blurb: "Count, compare and build numbers",
      standards: { "ca-bc": "Number concepts to 20" },
      parentNote:
        "Counting, ordering and comparing numbers to 20, and seeing teen numbers as 1 ten and some ones.",
      generate: numbersTo20,
    },
    {
      id: "make-ten",
      title: "Make 10",
      emoji: "🔟",
      blurb: "Two numbers that make 10",
      standards: { "ca-bc": "Ways to make 10" },
      parentNote:
        "Finding pairs that make 10 (like 6 + 4) with ten frames, fingers and stories. Making 10 is a key strategy for adding.",
      generate: makeTen,
    },
    {
      id: "adding",
      title: "Adding",
      emoji: "➕",
      blurb: "Put groups together",
      standards: {
        "ca-bc": "Addition and subtraction to 20 (understanding of operation and process); change in quantity to 20",
      },
      parentNote:
        "Adding to 20 with pictures, ten frames, number lines and short stories, using strategies like counting on, doubles and making 10.",
      generate: adding,
    },
    {
      id: "take-away",
      title: "Take Away",
      emoji: "➖",
      blurb: "How many are left?",
      standards: {
        "ca-bc":
          "Addition and subtraction to 20 (understanding of operation and process); change in quantity to 20, concretely and verbally",
      },
      parentNote:
        "Subtracting within 20 by counting back and thinking addition, and solving short take-away and compare stories.",
      generate: takeAway,
    },
    {
      id: "equal-or-not",
      title: "Equal or Not",
      emoji: "⚖️",
      blurb: "Same or not the same?",
      standards: { "ca-bc": "Meaning of equality and inequality" },
      parentNote:
        "Learning that = means \"the same amount as\" (not just \"the answer is\"), and using ≠ when two sides are different.",
      generate: equalOrNot,
    },
    {
      id: "patterns",
      title: "Patterns",
      emoji: "🔁",
      blurb: "What comes next?",
      standards: { "ca-bc": "Repeating patterns with multiple elements and attributes" },
      parentNote:
        "Finding the repeating part (the core) of patterns like AB, ABB and ABBC, including patterns where colour and shape both change.",
      generate: patterns,
    },
    {
      id: "measuring",
      title: "Measuring",
      emoji: "📏",
      blurb: "Measure with cubes and clips",
      standards: { "ca-bc": "Direct measurement with non-standard units (non-uniform and uniform)" },
      parentNote:
        "Measuring length with paper clips and cubes, comparing longer and shorter, heavier and lighter, and seeing why same-size units matter.",
      generate: measuring,
    },
    {
      id: "shapes",
      title: "Shapes",
      emoji: "🔺",
      blurb: "Flat shapes and solid shapes",
      standards: { "ca-bc": "Comparison of 2D shapes and 3D objects" },
      parentNote:
        "Naming and comparing 2D shapes by their sides and corners, and 3D objects by their faces and whether they roll or stack.",
      generate: shapes,
    },
    {
      id: "coins",
      title: "Coins",
      emoji: "🪙",
      blurb: "Nickels, dimes and quarters",
      standards: { "ca-bc": "Financial literacy: values of coins, and monetary exchanges" },
      parentNote:
        "Knowing the values of Canadian nickels, dimes and quarters, counting small amounts, and trading coins of equal value.",
      generate: coins,
    },
    {
      id: "graphs-and-chance",
      title: "Graphs & Chance",
      emoji: "📊",
      blurb: "Read graphs, guess what's likely",
      standards: { "ca-bc": "Concrete or pictorial graphs as a visual tool; likelihood of familiar life events" },
      parentNote:
        "Reading picture and bar graphs (how many, most, fewest, how many more) and talking about how likely everyday events are.",
      generate: graphsAndChance,
    },
  ],
};
