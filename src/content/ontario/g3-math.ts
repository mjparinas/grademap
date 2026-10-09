import { pick, randInt, sample, shuffle, textChoice } from "../random";
import type { GenerateOptions, Question, Unit, Visual } from "../types";
import { buildSet, levelOf, on, others, numQ, range, typeIn } from "./kit";

// Ontario Grade 3 mathematics (2020 curriculum). Whole numbers go up to 1000.

// ---------- Round, count and compare ----------

function roundAndCount(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const toTen = (): Question => {
    let n = randInt(11, 989);
    while (n % 10 === 5 || n % 10 === 0) n = randInt(11, 989);
    const down = Math.floor(n / 10) * 10;
    const up = down + 10;
    const right = n - down < 5 ? down : up;
    const wrong = [...new Set([right === down ? up : down, Math.round(n / 100) * 100, n])].filter((w) => w !== right).slice(0, 2);
    return textChoice(`Round ${n} to the nearest ten.`, String(right), wrong.map(String), "Look at the ones digit. 5 or more, round up. Less than 5, round down.", { type: "numberLine", min: down, max: up, step: 1, marks: [n] });
  };
  const toHundred = (): Question => {
    let n = randInt(101, 989);
    while (n % 100 === 50 || n % 100 === 0) n = randInt(101, 989);
    const down = Math.floor(n / 100) * 100;
    const up = down + 100;
    const right = n - down < 50 ? down : up;
    const wrong = [right === down ? up : down, Math.round(n / 10) * 10];
    const uniq = [...new Set(wrong.filter((w) => w !== right))];
    while (uniq.length < 2) uniq.push(right + 200);
    return textChoice(`Round ${n} to the nearest hundred.`, String(right), uniq.slice(0, 2).map(String), "Look at the tens digit. 5 or more, round up. Less than 5, round down.");
  };
  const skip = (): Question => {
    const step = pick(d === 1 ? [50, 100] : [50, 100, 200]);
    const start = step * randInt(0, 3);
    const seq = range(0, 4).map((i) => start + i * step);
    const blank = randInt(1, 3);
    const shown = seq.map((n, i) => (i === blank ? "☐" : String(n))).join(", ");
    return numQ("What number is missing?", seq[blank], `Count by ${step}s.`, { type: "equation", text: shown }, 1200);
  };
  const back = (): Question => {
    const step = pick([50, 100]);
    const start = step * randInt(6, 10);
    const seq = range(0, 3).map((i) => start - i * step);
    return numQ(`Count back by ${step}s. What comes next?`, start - 4 * step, `Take away ${step} each time.`, { type: "equation", text: `${seq.join(", ")}, ☐` }, 1000);
  };
  const greatest = (): Question => {
    const nums = sample(range(100, 999), 3);
    const big = Math.max(...nums);
    return textChoice("Which number is the greatest?", String(big), nums.filter((n) => n !== big).map(String), "Compare the hundreds first, then the tens.");
  };
  const order = (): Question => {
    const nums = sample(range(100, 999), 4).sort((a, b) => a - b);
    return { kind: "order", prompt: "Tap the numbers from smallest to biggest.", hint: "Compare the hundreds digit first.", items: nums.map((n) => ({ id: String(n), label: String(n) })) };
  };
  const estimate = (): Question => {
    let n = randInt(21, 99);
    while (n % 10 === 5 || n % 10 === 0) n = randInt(21, 99);
    const right = Math.round(n / 10) * 10;
    return textChoice(`There are ${n} balloons at a party. About how many is that, to the nearest ten?`, String(right), others([right - 10, right + 10, n], right, 2).map(String), "Round to the nearest ten.", { type: "emoji", emoji: "🎈", caption: `${n} balloons` });
  };
  return buildSet([toTen, toTen, d === 1 ? toTen : toHundred, toHundred, skip, back, greatest, d === 3 ? estimate : order]);
}

// ---------- Fair shares ----------

const DEN_NAMES: Record<number, [string, string]> = { 2: ["half", "halves"], 3: ["third", "thirds"], 4: ["fourth", "fourths"], 5: ["fifth", "fifths"], 6: ["sixth", "sixths"], 8: ["eighth", "eighths"], 10: ["tenth", "tenths"] };
const NUM_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/** Words for a fraction such as 3/4: "three fourths". */
function fractionWords(n: number, den: number): string {
  const g = gcd(n, den);
  const a = n / g;
  const b = den / g;
  if (b === 2) return a === 1 ? "one half" : `${NUM_WORDS[a]} halves`;
  const names = DEN_NAMES[b];
  return `${NUM_WORDS[a]} ${a === 1 ? names[0] : names[1]}`;
}

/** What each person gets when `items` are shared fairly by `sharers`, in words. */
function shareText(items: number, sharers: number): string {
  const whole = Math.floor(items / sharers);
  const rem = items % sharers;
  if (rem === 0) return String(whole);
  const frac = fractionWords(rem, sharers);
  return whole === 0 ? frac : `${whole} and ${frac}`;
}

function fairShares3(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const sharerPool = d === 1 ? [2, 4, 5, 10] : d === 2 ? [2, 3, 4, 5, 6] : [2, 3, 4, 5, 6, 8, 10];
  const share = (): Question => {
    const sharers = pick(sharerPool);
    const items = randInt(sharers < 5 ? 3 : 4, 20);
    const right = shareText(items, sharers);
    const wrong = [...new Set([items + 1, items - 1, items + 2, items - 2, items + sharers].filter((i) => i > 0 && i !== items).map((i) => shareText(i, sharers)))].filter((w) => w !== right);
    const q = textChoice(`${items} muffins are shared fairly by ${sharers} friends. How much does each friend get?`, right, wrong.slice(0, 2), "Give each friend the same number of whole muffins. Cut what is left over into equal parts.", { type: "dots", count: items, emoji: "🧁" });
    q.speak = `${items} muffins are shared fairly by ${sharers} friends. How much does each friend get?`;
    return q;
  };
  const groups = [
    ["one half", "two fourths", "four eighths", "five tenths"],
    ["one fourth", "two eighths"],
    ["three fourths", "six eighths"],
    ["one third", "two sixths"],
    ["two thirds", "four sixths"],
    ["one fifth", "two tenths"],
    ["two fifths", "four tenths"],
  ];
  const same = (): Question => {
    const g = pick(groups);
    const [a, b] = sample(g, 2);
    const wrong = sample(groups.filter((x) => x !== g).map((x) => pick(x)), 2);
    return textChoice(`Which is the same amount as ${a}?`, b, wrong, "Cut every part into smaller equal parts. The amount stays the same.");
  };
  const more = (): Question => {
    const a = pick([2, 3, 4, 5]);
    const b = pick([6, 8, 10].filter((x) => x > a));
    return textChoice(`The same loaf is shared fairly by ${a} friends or by ${b} friends. Which gives a bigger share?`, `shared by ${a}`, [`shared by ${b}`], "The more friends who share, the smaller each share is.", { type: "emoji", emoji: "🍞" });
  };
  const part = (): Question => {
    const den = pick([3, 4, 5, 6, 8, 10] as const);
    const num = randInt(1, den - 1);
    const wrong = others(range(1, den - 1), num, 2).map((n) => `${n}/${den}`);
    return textChoice("What fraction of the shape is shaded?", `${num}/${den}`, wrong, "The bottom number says how many equal parts. The top number says how many are shaded.", { type: "fraction", numerator: num, denominator: den, shape: pick(["bar", "circle"] as const) });
  };
  return buildSet([share, share, share, share, same, same, more, d === 1 ? same : part]);
}

// ---------- Data and the mean ----------

const TOPICS = [
  { title: "Favourite lunch", cats: ["Pasta", "Rice", "Wraps", "Soup"] },
  { title: "How we get to school", cats: ["Walk", "Bus", "Bike", "Car"] },
  { title: "Favourite sport", cats: ["Soccer", "Hockey", "Swimming", "Basketball"] },
  { title: "Favourite pet", cats: ["Dog", "Cat", "Fish", "Bird"] },
];

function dataAndMean(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const graph = () => {
    const t = pick(TOPICS);
    const each = pick([2, 5, 10]);
    const counts = sample(range(1, 6), t.cats.length);
    return { t, each, counts };
  };
  const pictograph = (): Question => {
    const { t, each, counts } = graph();
    const i = randInt(0, 3);
    return numQ(`Each picture stands for ${each} children. How many chose ${t.cats[i]}?`, counts[i] * each, `Count the pictures, then count by ${each}s.`, { type: "pictograph", title: t.title, each, rows: t.cats.map((label, j) => ({ label, emoji: "🙂", count: counts[j] })) }, 70);
  };
  const bars = (): Question => {
    const t = pick(TOPICS);
    const vals = sample(range(2, 14), 4).map((v) => v * 2);
    const bars = t.cats.map((label, i) => ({ label, value: vals[i] }));
    const [a, b] = sample(bars, 2);
    const hi = a.value > b.value ? a : b;
    const lo = hi === a ? b : a;
    return numQ(`How many more children chose ${hi.label} than ${lo.label}?`, hi.value - lo.value, "Read both bars, then subtract.", { type: "bars", title: t.title, bars }, 40);
  };
  const dataset = (n: number) => {
    // numbers with a whole-number mean
    for (;;) {
      const m = randInt(3, 12);
      const nums = range(1, n - 1).map(() => randInt(1, 15));
      const last = m * n - nums.reduce((s, x) => s + x, 0);
      if (last >= 1 && last <= 20 && new Set([...nums, last]).size === n) return { nums: [...nums, last], mean: m };
    }
  };
  const mean = (): Question => {
    const { nums, mean: m } = dataset(d === 1 ? 3 : pick([3, 4]));
    return numQ("What is the mean of these numbers?", m, "Add the numbers, then share the total equally. Divide by how many numbers there are.", { type: "equation", text: nums.join(", ") }, 25, 1);
  };
  const modeSet = () => {
    const pool = sample(range(1, 15), 4);
    const top = pool[0];
    const list = shuffle([top, top, top, ...pool.slice(1, 4)]);
    return { list, top };
  };
  const mode = (): Question => {
    const { list, top } = modeSet();
    return textChoice("What is the mode of these numbers?", String(top), others([...new Set(list)], top, 2).map(String), "The mode is the number that shows up most often.", { type: "equation", text: list.join(", ") });
  };
  const meaning = (): Question =>
    pick([
      () => textChoice("Which one tells you the value that shows up most often?", "the mode", ["the mean", "the total"], "The mode is the most common value."),
      () => textChoice("Which one tells you the amount each person would get if everything were shared equally?", "the mean", ["the mode", "the biggest number"], "The mean is the equal-share amount."),
    ])();
  const twoWay = (): Question => {
    const [a, b, c, e] = [randInt(2, 9), randInt(2, 9), randInt(2, 9), randInt(2, 9)];
    const table: Visual = { type: "table", title: "Our class lunch box", headers: ["", "Girls", "Boys"], rows: [["Fruit", a, c], ["No fruit", b, e]] };
    const which = pick([
      { q: "How many boys have fruit?", v: c },
      { q: "How many girls have no fruit?", v: b },
      { q: "How many children have fruit?", v: a + c },
      { q: "How many children are in the class?", v: a + b + c + e },
    ]);
    return numQ(which.q, which.v, "Find the row and the column that match the question.", table, 40);
  };
  return buildSet([pictograph, pictograph, bars, mean, mean, mode, meaning, d === 1 ? mode : twoWay]);
}

// ---------- Likelihood ----------

const TERMS = ["impossible", "unlikely", "equally likely", "likely", "certain"];

function likelihood3(opts?: GenerateOptions): Question[] {
  const bag = (): Question => {
    const cases = [
      { red: 6, blue: 0, ask: "red", term: "certain" },
      { red: 6, blue: 0, ask: "blue", term: "impossible" },
      { red: 7, blue: 1, ask: "red", term: "likely" },
      { red: 1, blue: 7, ask: "red", term: "unlikely" },
      { red: 4, blue: 4, ask: "blue", term: "equally likely" },
    ];
    const c = pick(cases);
    const segments = [...Array(c.red).fill("🔴"), ...Array(c.blue).fill("🔵")];
    const wrong = sample(TERMS.filter((t) => t !== c.term), 3);
    return textChoice(`A bag holds the marbles shown. You pick one without looking. Picking ${c.ask} is…`, c.term, wrong, "Compare how many marbles are red with how many are blue.", { type: "emojiRow", items: segments });
  };
  const statement = (): Question => {
    const bank = [
      { t: "A fish walks to school.", term: "impossible" },
      { t: "You spin a 7 on a spinner numbered 1 to 6.", term: "impossible" },
      { t: "A coin lands on heads or tails.", term: "certain" },
      { t: "Tomorrow comes after today.", term: "certain" },
      { t: "You roll a number from 1 to 6 on a regular die.", term: "certain" },
    ];
    const s = pick(bank);
    return textChoice(`How likely is this? “${s.t}”`, s.term, sample(TERMS.filter((t) => t !== s.term), 3), "Ask yourself: can it happen? Will it always happen?");
  };
  const predict = (): Question => {
    const a = randInt(7, 9);
    const colours: [string, string] = pick([["blue", "green"], ["red", "yellow"], ["purple", "orange"]] as [string, string][]);
    return textChoice(`Maya pulled a cube from a bag 10 times and put it back each time. She got ${colours[0]} ${a} times and ${colours[1]} ${10 - a} ${10 - a === 1 ? "time" : "times"}. Which colour is the bag likely to have more of?`, colours[0], [colours[1], "the same of each"], "The colour that came out more often is probably in the bag more.");
  };
  const meanMode = (): Question => {
    const sets = [
      [2, 3, 3, 3, 4],
      [1, 2, 2, 2, 8],
      [5, 5, 5, 5, 5],
      [2, 4, 6, 8, 10],
      [3, 3, 3, 4, 2],
      [1, 1, 1, 1, 6],
    ];
    const s = pick(sets);
    const mean = s.reduce((x, y) => x + y, 0) / s.length;
    const counts = new Map<number, number>();
    s.forEach((n) => counts.set(n, (counts.get(n) ?? 0) + 1));
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    const unique = [...counts.values()].filter((c) => c === top[1]).length === 1;
    const same = unique && mean === top[0];
    return textChoice("Is the mean of this data the same as the mode?", same ? "Yes, they are the same" : "No, they are different", [same ? "No, they are different" : "Yes, they are the same"], "Find the mode (most common). Find the mean (add up, then divide by how many).", { type: "equation", text: s.join(", ") });
  };
  return buildSet([bag, bag, bag, statement, predict, predict, meanMode, meanMode]);
}

// ---------- Area and perimeter ----------

function areaPerimeter3(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const dims = () => {
    const l = randInt(d === 1 ? 3 : 4, d === 3 ? 15 : 10);
    const w = randInt(2, l - 1);
    return { l, w };
  };
  const rect = (): Question => {
    const { l, w } = dims();
    const q = numQ(`A rectangle is ${l} cm long and ${w} cm wide. What is its perimeter in centimetres?`, 2 * (l + w), "Add all four sides: length, width, length, width.", undefined, 80);
    return q;
  };
  const triangle = (): Question => {
    const a = randInt(3, 9);
    const b = randInt(3, 9);
    const c = randInt(Math.abs(a - b) + 1, a + b - 1);
    return typeIn(`A triangle has sides of ${a} cm, ${b} cm and ${c} cm. What is its perimeter in centimetres?`, a + b + c, "Add the three sides.");
  };
  const missing = (): Question => {
    const { l, w } = dims();
    return numQ(`A rectangle has a perimeter of ${2 * (l + w)} cm. It is ${l} cm long. How wide is it, in centimetres?`, w, "Half the perimeter is length + width. Take away the length.", undefined, 20, 1);
  };
  const count = (): Question => {
    const rows = randInt(2, 6);
    const cols = randInt(3, 7);
    return numQ("Each square is 1 square centimetre. What is the area, in square centimetres?", rows * cols, "Count the squares, or multiply rows by columns.", { type: "array", rows, cols, emoji: "🟦" }, 45, 4);
  };
  const area = (): Question => {
    const { l, w } = dims();
    return numQ(`A rectangle is ${l} cm long and ${w} cm wide. What is its area, in square centimetres?`, l * w, "Area = length × width.", undefined, l * w + 15, 4);
  };
  const sameArea = (): Question => {
    const n = pick([12, 16, 18, 20, 24]);
    const pairs = range(1, 12).filter((a) => n % a === 0 && a <= n / a).map((a) => [a, n / a] as [number, number]);
    const [a, b] = pick(pairs);
    const rest = pairs.filter(([x]) => x !== a);
    const [c, e] = pick(rest);
    const wrong = [`${a + 1} by ${b}`, `${c} by ${e + 1}`].filter((w) => w !== `${a} by ${b}`);
    return textChoice(`Which rectangle has the same area as a ${a} by ${b} rectangle?`, `${c} by ${e}`, wrong, "Work out the area of each rectangle. Look for the same answer.");
  };
  const unit = (): Question =>
    pick([
      () => textChoice("Which unit is best for the area of a classroom floor?", "square metres", ["square centimetres", "metres"], "A floor is big, so use a big unit. Area uses square units."),
      () => textChoice("Which unit is best for the area of a postage stamp?", "square centimetres", ["square metres", "centimetres"], "A stamp is small, so use a small unit. Area uses square units."),
      () => textChoice("Which unit is best for the area of a soccer field?", "square metres", ["square centimetres", "metres"], "A field is big, so use a big unit. Area uses square units."),
    ])();
  return buildSet([rect, triangle, missing, count, area, area, sameArea, d === 1 ? count : unit]);
}

// ---------- Shapes and movement ----------

const DIRS = ["north", "east", "south", "west"];

function moveIt(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const TURNS = [
    { text: "a quarter turn to the right", by: 1 },
    { text: "a quarter turn to the left", by: -1 },
    { text: "a half turn", by: 2 },
  ];
  const turn = (): Question => {
    const start = randInt(0, 3);
    const t = pick(TURNS);
    const end = (start + t.by + 4) % 4;
    return textChoice(`Ravi faces ${DIRS[start]}. He makes ${t.text}. Which way does he face now?`, DIRS[end], others(DIRS, DIRS[end], 2), "Picture yourself turning. A quarter turn is a corner. A half turn is facing the other way.");
  };
  const twoTurns = (): Question => {
    const start = randInt(0, 3);
    const [t1, t2] = sample(TURNS, 2);
    const end = (start + t1.by + t2.by + 8) % 4;
    return textChoice(`Zoe faces ${DIRS[start]}. She makes ${t1.text}, then ${t2.text}. Which way does she face now?`, DIRS[end], others(DIRS, DIRS[end], 2), "Do the first turn, then do the second turn from where you are facing.");
  };
  const steps = (): Question => {
    const y = randInt(1, 5);
    const x1 = randInt(1, 3);
    const x2 = randInt(x1 + 2, 8);
    return numQ("How many squares do you move right to go from A to B?", x2 - x1, "Count the squares between A and B along the row.", { type: "grid", size: 8, points: [{ x: x1, y, label: "A" }, { x: x2, y, label: "B" }] }, 8, 1);
  };
  const FACES: { name: string; faces: number }[] = [
    { name: "cube", faces: 6 },
    { name: "rectangular prism", faces: 6 },
    { name: "square-based pyramid", faces: 5 },
  ];
  const compose = (): Question => {
    const [a, b] = sample(FACES, 2);
    const na = randInt(1, 3);
    const nb = randInt(1, 3);
    const total = na * a.faces + nb * b.faces;
    return numQ(`A structure is built from ${na} ${a.name}${na > 1 ? "s" : ""} and ${nb} ${b.name}${nb > 1 ? "s" : ""}. How many faces do the pieces have in all?`, total, "Find the faces on one piece, then multiply by how many pieces there are.", undefined, 40, 5);
  };
  const SETS: number[][] = [[3, 4, 5], [5, 5, 6], [4, 4, 4], [6, 8, 10], [5, 7, 8]];
  const congruentTri = (): Question => {
    const s = pick(SETS);
    const same = pick([true, false]);
    const other = same ? shuffle(s) : (() => {
      const o = [...s];
      const i = randInt(0, 2);
      o[i] = o[i] + 1;
      return shuffle(o);
    })();
    return textChoice(`Triangle A has sides ${s.join(", ")} cm. Triangle B has sides ${other.join(", ")} cm. Are they congruent?`, same ? "Yes, they match exactly" : "No, they do not match", [same ? "No, they do not match" : "Yes, they match exactly"], "Congruent shapes are exactly the same size and shape. Compare all the sides.");
  };
  const congruentMeaning = (): Question =>
    textChoice("What does congruent mean?", "exactly the same size and shape", ["the same colour", "the same size but a different shape"], "Congruent shapes match perfectly when one is placed on the other.");
  const quarterTurns = (): Question => numQ("How many quarter turns make a whole turn?", 4, "Turn a quarter at a time until you face the way you started.", undefined, 8, 1);
  return buildSet([turn, turn, twoTurns, steps, compose, congruentTri, d === 1 ? congruentMeaning : congruentTri, d === 3 ? twoTurns : quarterTurns]);
}

// ---------- Making change ----------

const fmt = (c: number): string => (c < 100 ? `${c}¢` : c % 100 === 0 ? `$${c / 100}` : `$${(c / 100).toFixed(2)}`);

function makeChange(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const options = (ans: number): string[] => {
    const cand = [ans + 5, ans - 5, ans + 10, ans - 10, ans + 15, ans - 15, ans + 100, ans - 100].filter((c) => c >= 5);
    return shuffle(cand).slice(0, 2).map(fmt);
  };
  const cents = (): Question => {
    const price = 5 * randInt(2, 19);
    const ans = 100 - price;
    return textChoice(`A pencil costs ${price}¢. Jay pays with a $1 coin. How much change does he get?`, fmt(ans), options(ans), "Count up from the price to $1, or take the price away from 100¢.", { type: "coins", coins: [100] });
  };
  const dollars = (): Question => {
    const pay = pick([5, 10, 20]);
    const price = randInt(1, pay - 1);
    return numQ(`A book costs $${price}. Ana pays with $${pay}. How many dollars of change does she get?`, pay - price, "Take the price away from what she paid.", undefined, pay, 1);
  };
  const mixed = (): Question => {
    const pay = pick([5, 10]);
    const dollarsPart = randInt(1, pay - 2);
    const price = dollarsPart * 100 + 5 * randInt(1, 19);
    const ans = pay * 100 - price;
    return textChoice(`A toy costs ${fmt(price)}. Leo pays with $${pay}. How much change does he get?`, fmt(ans), options(ans), "Count up from the price to the next dollar, then on to what was paid.");
  };
  const twoItems = (): Question => {
    const a = 5 * randInt(3, 12);
    const b = 5 * randInt(3, 12);
    const total = a + b;
    const pay = total <= 100 ? 100 : 200;
    const ans = pay - total;
    return textChoice(`Priya buys a ${fmt(a)} sticker and a ${fmt(b)} eraser. She pays with ${fmt(pay)}. How much change does she get?`, fmt(ans), options(ans), "Add the two prices first. Then find the change.");
  };
  const enough = (): Question => {
    const a = 5 * randInt(6, 18);
    const b = 5 * randInt(6, 18);
    const ok = pick([true, false]);
    const have = ok ? 5 * randInt(Math.ceil((a + b) / 5), Math.ceil((a + b) / 5) + 3) : 5 * randInt(Math.ceil((a + b) / 5) - 4, Math.ceil((a + b) / 5) - 1);
    return textChoice(`Sam has ${fmt(have)}. He wants to buy a ${fmt(a)} snack and a ${fmt(b)} drink. Does he have enough?`, ok ? "Yes" : "No", [ok ? "No" : "Yes"], "Add the prices. Is the total more than what Sam has?");
  };
  const count = (): Question => {
    const coins = [100, 25, 25, 10, 5];
    const n = randInt(2, 5);
    const picked = sample(coins, n);
    const total = picked.reduce((s, c) => s + c, 0);
    return textChoice("How much money is this?", fmt(total), options(total), "Add the coins. Start with the biggest one.", { type: "coins", coins: picked });
  };
  return buildSet([cents, cents, d === 1 ? cents : mixed, mixed, dollars, twoItems, enough, count]);
}

export const units: Unit[] = [
  {
    id: "round-and-count",
    title: "Round & Count",
    emoji: "🎯",
    blurb: "Round, count and compare to 1000",
    standards: on("B1.2–B1.4", "comparing and ordering numbers to 1000, rounding to the nearest ten or hundred, and counting by 50s, 100s and 200s"),
    parentNote: "Rounding numbers to the nearest ten or hundred, counting forward and back by 50s, 100s and 200s, and comparing and ordering numbers up to 1000.",
    generate: roundAndCount,
  },
  {
    id: "fair-shares-3",
    title: "Fair Shares",
    emoji: "🧁",
    blurb: "Share up to 20 things",
    standards: on("B1.6, B1.7", "fair-share problems with up to 20 items and 2, 3, 4, 5, 6, 8 or 10 sharers, and equivalent fractions"),
    parentNote: "Sharing up to 20 items fairly among 2, 3, 4, 5, 6, 8 or 10 people, including leftovers that must be cut up, and seeing that different fractions can be the same amount.",
    generate: fairShares3,
  },
  {
    id: "data-and-mean",
    title: "Data, Mean & Mode",
    emoji: "📊",
    blurb: "Read graphs and find the mean",
    standards: on("D1.1–D1.5", "sorting data, graphs with different scales, and finding the mean and mode"),
    parentNote: "Reading pictographs and bar graphs with different scales, reading two-way tables, and finding the mean (equal share) and the mode (most common) of a set of numbers.",
    generate: dataAndMean,
  },
  {
    id: "likelihood-3",
    title: "How Likely?",
    emoji: "🎲",
    blurb: "From impossible to certain",
    standards: on("D2.1, D2.2", "describing likelihood from impossible to certain, making predictions, and comparing the mean and mode"),
    parentNote: "Using the words impossible, unlikely, equally likely, likely and certain, predicting from results, and noticing when the mean and mode of a data set match.",
    generate: likelihood3,
  },
  {
    id: "area-and-perimeter-3",
    title: "Area & Perimeter",
    emoji: "📐",
    blurb: "Around and inside shapes",
    standards: on("E2.1, E2.7–E2.9", "perimeter of polygons, comparing areas, and square centimetres and square metres"),
    parentNote: "Finding the perimeter (distance around) of rectangles and triangles, finding a missing side, and measuring area in square centimetres and square metres.",
    generate: areaPerimeter3,
  },
  {
    id: "move-it",
    title: "Turns & Structures",
    emoji: "🧭",
    blurb: "Quarter turns, faces and congruent shapes",
    standards: on("E1.2–E1.4", "putting together and taking apart structures, congruent shapes, and directions with half and quarter turns"),
    parentNote: "Following directions with half and quarter turns, counting the faces of 3D pieces in a structure, and knowing when two shapes are congruent (exactly the same).",
    generate: moveIt,
  },
  {
    id: "make-change",
    title: "Making Change",
    emoji: "🪙",
    blurb: "How much change do I get?",
    standards: on("F1.1", "estimating and calculating change for whole-dollar amounts and amounts under one dollar"),
    parentNote: "Working out change from $1, $5, $10 and $20, adding two prices, and checking whether there is enough money. Amounts are in multiples of 5¢, since Canada no longer has pennies.",
    generate: makeChange,
  },
];
