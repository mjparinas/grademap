import { pick, randInt, sample, shuffle, textChoice } from "../random";
import type { GenerateOptions, Question, Unit, Visual } from "../types";
import { buildSet, levelOf, on, others, numQ, range, typeIn } from "./kit";

// Ontario Grade 4 mathematics (2020 curriculum). Whole numbers go up to 10 000 and decimals to tenths.

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
const tenths = (n: number): string => (n / 10).toFixed(1);

// ---------- Fractions ----------

function fractions4(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const dens = d === 1 ? [3, 4, 5] : [3, 4, 5, 6, 8, 10];
  const part = (): Question => {
    const den = pick(dens);
    const num = randInt(1, den - 1);
    const wrong = others(range(1, den - 1), num, 2).map((n) => `${n}/${den}`);
    return textChoice("What fraction of the shape is shaded?", `${num}/${den}`, wrong, "The bottom number counts the equal parts. The top number counts the shaded parts.", { type: "fraction", numerator: num, denominator: den, shape: pick(["bar", "circle"] as const) });
  };
  const meaning = (): Question => {
    const den = pick(dens);
    const num = randInt(1, den - 1);
    return pick([
      () => textChoice(`In ${num}/${den}, what does the ${den} tell you?`, "how many equal parts make a whole", ["how many parts are shaded", "how many wholes there are"], "The denominator is the bottom number. It names the size of the equal parts."),
      () => textChoice(`In ${num}/${den}, what does the ${num} tell you?`, "how many of the equal parts we have", ["how many equal parts make a whole", "how big the whole is"], "The numerator is the top number. It counts the parts we have."),
    ])();
  };
  const count = (): Question => {
    const den = pick(dens);
    const k = randInt(2, Math.min(den - 1, 5));
    const shown = range(1, k).map((n) => `${n}/${den}`).join(", ");
    return textChoice(`Count by ${den === 2 ? "halves" : den === 4 ? "fourths" : den === 8 ? "eighths" : den === 3 ? "thirds" : den === 5 ? "fifths" : den === 6 ? "sixths" : "tenths"}. What comes next?`, `${k + 1}/${den}`, [`${k + 2}/${den}`, `${k}/${den + 1}`], "Each step adds one more equal part.", { type: "equation", text: `${shown}, ☐` });
  };
  const unitTimes = (): Question => {
    const den = pick(dens);
    const n = randInt(2, Math.min(5, den - 1));
    return textChoice("What is this repeated addition as a multiplication?", `${n} × 1/${den} = ${n}/${den}`, [`${n} × 1/${den} = ${n}/${n * den}`, `${n} × 1/${den} = 1/${den + n}`], "Each unit fraction is one equal part. Adding n of them gives n parts.", { type: "equation", text: Array(n).fill(`1/${den}`).join(" + ") });
  };
  const compare = (): Question => {
    const den = pick(dens);
    const a = randInt(1, den - 2);
    const b = randInt(a + 1, den - 1);
    return pick([
      () => textChoice(`Which is greater, ${a}/${den} or ${b}/${den}?`, `${b}/${den}`, [`${a}/${den}`], "The parts are the same size, so more parts means more."),
      () => {
        const [x, y] = sample([2, 3, 4, 5, 6, 8, 10], 2);
        return textChoice(`Which is greater, 1/${x} or 1/${y}?`, `1/${Math.min(x, y)}`, [`1/${Math.max(x, y)}`], "The fewer the equal parts in a whole, the bigger each part is.");
      },
    ])();
  };
  const fairShare = (): Question => {
    const options: [number, number][] = [[1, 2], [2, 3], [3, 4], [3, 5], [4, 5], [5, 6], [2, 5], [3, 8], [5, 8], [7, 10]];
    const [a, b] = sample(options, 2);
    const va = a[0] / a[1];
    const vb = b[0] / b[1];
    const right = va > vb ? "Group A" : "Group B";
    return textChoice(`Group A shares ${a[0]} pizza${a[0] > 1 ? "s" : ""} among ${a[1]} children. Group B shares ${b[0]} pizza${b[0] > 1 ? "s" : ""} among ${b[1]} children. Which group's children get more each?`, right, [right === "Group A" ? "Group B" : "Group A"], `Each child's share is ${a[0]}/${a[1]} for Group A and ${b[0]}/${b[1]} for Group B. Compare the two fractions.`, { type: "emoji", emoji: "🍕" });
  };
  const equal = (): Question => {
    const pairs: [string, string, string[]][] = [["1/2", "5/10", ["1/5", "2/5"]], ["1/2", "3/6", ["1/3", "2/6"]], ["2/4", "1/2", ["1/4", "2/3"]], ["1/4", "2/8", ["1/8", "3/8"]], ["3/4", "6/8", ["3/8", "4/8"]], ["1/5", "2/10", ["1/10", "2/5"]]];
    const [a, b, w] = pick(pairs);
    return textChoice(`Which fraction is equal to ${a}?`, b, w, "Cut every part into smaller equal parts. The amount stays the same.");
  };
  return buildSet([part, part, meaning, count, count, unitTimes, d === 1 ? equal : compare, d === 3 ? fairShare : pick([fairShare, equal])]);
}

// ---------- Decimal tenths ----------

function decimals4(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const read = (): Question => {
    const n = randInt(1, 9);
    const wrong = [`${n}.0`, `0.0${n}`].filter((w) => w !== tenths(n));
    return textChoice("The bar has 10 equal parts. What decimal shows the shaded part?", tenths(n), wrong, "Each part is one tenth. Shaded tenths: n tenths = 0.n.", { type: "fraction", numerator: n, denominator: 10, shape: "bar" });
  };
  const compare = (): Question => {
    const [a, b] = sample(range(1, 19), 2);
    const sign = a > b ? ">" : "<";
    return textChoice("Which sign goes in the box?", sign, ["<", ">", "="].filter((s) => s !== sign), "Compare the ones first, then the tenths.", { type: "equation", text: `${tenths(a)} ☐ ${tenths(b)}` });
  };
  const order = (): Question => {
    const nums = sample(range(1, 29), 4).sort((x, y) => x - y);
    return { kind: "order", prompt: "Tap the decimals from least to greatest.", hint: "Compare the ones first, then the tenths.", items: nums.map((n) => ({ id: String(n), label: tenths(n) })) };
  };
  const round = (): Question => {
    let t = randInt(11, 99);
    while (t % 10 === 5 || t % 10 === 0) t = randInt(11, 99);
    const x = t / 10;
    const right = Math.round(x);
    const other = right === Math.floor(x) ? Math.ceil(x) : Math.floor(x);
    return textChoice(`Round ${tenths(t)} to the nearest whole number.`, String(right), [String(other), String(right > other ? right + 1 : right - 1)], "Look at the tenths digit. 5 or more, round up. Less than 5, round down.");
  };
  const equiv = (): Question => {
    const n = randInt(1, 9);
    return pick([
      () => textChoice(`Which decimal is equal to ${n}/10?`, tenths(n), [`${n}.0`, `0.0${n}`], "One tenth is 0.1, so n tenths is 0.n."),
      () => textChoice(`Which fraction is equal to ${tenths(n)}?`, `${n}/10`, [`1/${n + 1}`, `${n}/100`], "The digit after the decimal point counts tenths."),
    ])();
  };
  const add = (): Question => {
    const a = randInt(11, 79);
    const b = randInt(11, 79);
    return typeIn(`What is ${tenths(a)} + ${tenths(b)}?`, tenths(a + b).replace(/\.0$/, ""), "Line up the decimal points and add. Regroup ten tenths as one whole.", { type: "equation", text: `${tenths(a)} + ${tenths(b)} = ?` }, { keypad: "decimal", accept: [tenths(a + b)] });
  };
  const sub = (): Question => {
    const a = randInt(30, 99);
    const b = randInt(11, a - 1);
    return typeIn(`What is ${tenths(a)} − ${tenths(b)}?`, tenths(a - b).replace(/\.0$/, ""), "Line up the decimal points and subtract.", { type: "equation", text: `${tenths(a)} − ${tenths(b)} = ?` }, { keypad: "decimal", accept: [tenths(a - b)] });
  };
  const nextTenth = (): Question => {
    const s = randInt(1, 12);
    return textChoice("What comes next?", tenths(s + 3), [tenths(s + 4), tenths(s + 13)], "Count by one tenth each time.", { type: "equation", text: `${tenths(s)}, ${tenths(s + 1)}, ${tenths(s + 2)}, ☐` });
  };
  return buildSet([read, read, compare, order, round, equiv, d === 1 ? nextTenth : add, d === 1 ? add : sub]);
}

// ---------- Multiplying and dividing ----------

const FRACTION_NAMES = (r: number, den: number): string => {
  const g = gcd(r, den);
  return `${r / g}/${den / g}`;
};

function bigMultiply4(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const shift = (): Question => {
    const n = randInt(2, 99);
    const p = pick([10, 100, 1000]);
    return pick([
      () => typeIn(`What is ${n} × ${p}?`, n * p, `Multiplying by ${p} moves each digit ${String(p).length - 1} place${p > 10 ? "s" : ""} to the left.`, { type: "equation", text: `${n} × ${p} = ?` }),
      () => typeIn(`What is ${n * 10} ÷ 10?`, n, "Dividing by 10 moves each digit one place to the right.", { type: "equation", text: `${n * 10} ÷ 10 = ?` }),
    ])();
  };
  const mult = (): Question => {
    const a = d === 1 ? randInt(11, 60) : randInt(d === 3 ? 101 : 21, d === 3 ? 499 : 99);
    const b = randInt(2, 9);
    return typeIn(`What is ${a} × ${b}?`, a * b, "Break the number into tens and ones. Multiply each part, then add.", { type: "equation", text: `${a} × ${b} = ?` });
  };
  const divExact = (): Question => {
    const b = randInt(2, 9);
    const q = randInt(11, d === 3 ? 99 : 60);
    return typeIn(`What is ${b * q} ÷ ${b}?`, q, "Think of the multiplication fact that goes with it.", { type: "equation", text: `${b * q} ÷ ${b} = ?` });
  };
  const divFraction = (): Question => {
    const den = pick([2, 4, 5, 8, 10]);
    const q = randInt(3, 20);
    const r = randInt(1, den - 1);
    const total = q * den + r;
    const text = (x: number) => `${q} and ${FRACTION_NAMES(x, den)}`;
    const wrongR = others(range(1, den - 1).filter((x) => FRACTION_NAMES(x, den) !== FRACTION_NAMES(r, den)), r, 2);
    const wrong = wrongR.map(text);
    return textChoice(`A ribbon ${total} cm long is cut into ${den} equal pieces. How long is each piece, in centimetres?`, text(r), wrong.length ? wrong : [`${q + 1} and ${FRACTION_NAMES(1, den)}`, `${q}`], "Divide to find the whole number. Write the remainder as a fraction of the pieces.");
  };
  const rate = (): Question => {
    const per = randInt(2, 9);
    const n = randInt(3, 9);
    const thing = pick([
      { one: "bag", item: "apples" },
      { one: "box", item: "markers" },
      { one: "tray", item: "muffins" },
    ]);
    return typeIn(`There are ${per} ${thing.item} in each ${thing.one}. How many ${thing.item} are in ${n} ${thing.one}s?`, per * n, `For every 1 ${thing.one} there are ${per}. Multiply by ${n}.`, { type: "table", headers: [`${thing.one}s`, thing.item], rows: [[1, per], [2, per * 2], [3, per * 3]] });
  };
  const rateBack = (): Question => {
    const per = randInt(3, 9);
    const n = randInt(3, 9);
    return typeIn(`Each pack has ${per} cards. Lena has ${per * n} cards in packs. How many packs is that?`, n, "Divide the total by the number in each pack.");
  };
  return buildSet([shift, shift, mult, mult, divExact, divFraction, rate, d === 1 ? mult : rateBack]);
}

// ---------- Equations ----------

function equations4(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const solve = (): Question => {
    const kinds = [
      () => {
        const n = randInt(5, 35);
        const a = randInt(5, 50 - n);
        return { text: `n + ${a} = ${n + a}`, n };
      },
      () => {
        const a = randInt(5, 30);
        const n = randInt(a + 3, 50);
        return { text: `n − ${a} = ${n - a}`, n };
      },
      () => {
        const a = randInt(2, 9);
        const n = randInt(2, Math.floor(50 / a));
        return { text: `${a} × n = ${a * n}`, n };
      },
      () => {
        const a = randInt(2, 9);
        const n = randInt(2, Math.floor(50 / a));
        return { text: `n ÷ ${a} = ${n}`, n: n * a };
      },
    ];
    const k = pick(d === 1 ? kinds.slice(0, 2) : kinds)();
    return typeIn("Solve for n.", k.n, "Think about which operation undoes the one you see.", { type: "equation", text: k.text });
  };
  const verify = (): Question => {
    const n = randInt(5, 30);
    const a = randInt(4, 15);
    const claim = pick([true, false]) ? n : n + pick([-2, -1, 1, 2]);
    const ok = claim === n;
    return textChoice(`Is n = ${claim} the solution to n + ${a} = ${n + a}?`, ok ? "Yes" : "No", [ok ? "No" : "Yes"], `Put ${claim} in for n and see whether both sides are equal.`, { type: "equation", text: `${claim} + ${a} = ${n + a}` });
  };
  const variable = (): Question => textChoice("In 3 × n = 24, what does n stand for?", "a number we do not know yet", ["the answer 24", "the number 3"], "A variable is a symbol, like n or ☐, that stands for an unknown number.", { type: "equation", text: "3 × n = 24" });
  const story = (): Question => {
    const start = randInt(8, 30);
    const more = randInt(5, 15);
    return numQ(`Mia had some stickers. She got ${more} more, and now has ${start + more}. How many did she start with?`, start, `Write it as n + ${more} = ${start + more}, then solve for n.`, { type: "equation", text: `n + ${more} = ${start + more}` }, 60, 1);
  };
  const inequality = (): Question => {
    const bound = randInt(10, 20);
    const a = randInt(3, bound - 3);
    const limit = bound - a;
    return pick([
      () => {
        const right = randInt(0, limit - 1);
        const wrong = sample(range(limit, limit + 4), 2);
        return textChoice(`Which number makes n + ${a} < ${bound} true?`, String(right), wrong.map(String), "Put each choice in for n and check whether the left side is less than the right.", { type: "equation", text: `n + ${a} < ${bound}` });
      },
      () => {
        const right = randInt(limit + 1, limit + 5);
        const wrong = sample(range(Math.max(0, limit - 4), limit), 2);
        return textChoice(`Which number makes n + ${a} > ${bound} true?`, String(right), wrong.map(String), "Put each choice in for n and check whether the left side is greater than the right.", { type: "equation", text: `n + ${a} > ${bound}` });
      },
    ])();
  };
  return buildSet([solve, solve, solve, verify, variable, story, inequality, d === 1 ? solve : inequality]);
}

// ---------- Data ----------

const QUAL = ["your favourite colour", "the kind of pet you have", "your eye colour", "your favourite book", "the name of your street"];
const QUANT = ["the number of brothers and sisters you have", "your height in centimetres", "the minutes you spend reading", "your age in years", "how many goals a team scored"];

function data4(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const kind = (): Question => {
    const qual = pick([true, false]);
    const item = pick(qual ? QUAL : QUANT);
    return textChoice(`Is this qualitative or quantitative data? ${item}`, qual ? "qualitative" : "quantitative", [qual ? "quantitative" : "qualitative"], "Qualitative data describes with words. Quantitative data counts or measures with numbers.");
  };
  const whole = (n: number, mean: number) => {
    for (;;) {
      const nums = range(1, n - 1).map(() => randInt(1, 15));
      const last = mean * n - nums.reduce((s, x) => s + x, 0);
      if (last >= 1 && last <= 20 && new Set([...nums, last]).size === n) return [...nums, last];
    }
  };
  const mean = (): Question => {
    const m = randInt(4, 12);
    const nums = whole(d === 1 ? 3 : 4, m);
    return numQ("What is the mean of these numbers?", m, "Add the numbers, then divide by how many there are.", { type: "equation", text: nums.join(", ") }, 25, 1);
  };
  const median = (): Question => {
    const nums = sample(range(1, 40), pick([5, 7])).sort((a, b) => a - b);
    const m = nums[(nums.length - 1) / 2];
    return textChoice("What is the median of these numbers?", String(m), others(nums, m, 2).map(String), "Put the numbers in order. The median is the one in the middle.", { type: "equation", text: shuffle(nums).join(", ") });
  };
  const mode = (): Question => {
    const pool = sample(range(1, 15), 4);
    const list = shuffle([pool[0], pool[0], pool[0], ...pool.slice(1)]);
    return textChoice("What is the mode of these numbers?", String(pool[0]), others([...new Set(list)], pool[0], 2).map(String), "The mode is the number that shows up most often.", { type: "equation", text: list.join(", ") });
  };
  const stem = () => {
    const stems = sample([1, 2, 3, 4], 3).sort();
    const rows = stems.map((s) => ({ s, leaves: sample(range(0, 9), randInt(2, 4)).sort((a, b) => a - b) }));
    const visual: Visual = { type: "table", title: "Stem-and-leaf plot (stem | leaves)", headers: ["Stem", "Leaves"], rows: rows.map((r) => [r.s, r.leaves.join(" ")]) };
    return { rows, visual };
  };
  const stemCount = (): Question => {
    const { rows, visual } = stem();
    const total = rows.reduce((s, r) => s + r.leaves.length, 0);
    return numQ("How many numbers are in this plot?", total, "Each leaf is one number. Count all the leaves.", visual, 20, 2);
  };
  const stemMax = (): Question => {
    const { rows, visual } = stem();
    const last = rows[rows.length - 1];
    const biggest = last.s * 10 + last.leaves[last.leaves.length - 1];
    return numQ("What is the greatest number in this plot?", biggest, "Read the last stem and its biggest leaf together. A stem of 3 and a leaf of 4 is 34.", visual, 60, 10);
  };
  const multiBar = (): Question => {
    const months = ["Jan", "Feb", "Mar"];
    const a = months.map(() => randInt(4, 15));
    const b = months.map(() => randInt(4, 15));
    const visual: Visual = { type: "table", title: "Books read", headers: ["Month", "Class A", "Class B"], rows: months.map((m, i) => [m, a[i], b[i]]) };
    const i = randInt(0, 2);
    return pick([
      () => numQ(`How many books did Class B read in ${months[i]}?`, b[i], "Find the month, then the column for Class B.", visual, 25),
      () => numQ(`How many books did the two classes read in ${months[i]} together?`, a[i] + b[i], "Add the two numbers in that row.", visual, 35),
    ])();
  };
  const measure = (): Question => textChoice("Which one is the number in the middle when the data is put in order?", "the median", ["the mean", "the mode"], "The median is the middle value.");
  return buildSet([kind, kind, mean, median, mode, stemCount, d === 1 ? measure : stemMax, multiBar]);
}

// ---------- Chance and predictions ----------

function chance4(): Question[] {
  const bag = () => {
    const total = pick([4, 5, 8, 10]);
    const red = randInt(1, total - 1);
    return { total, red, blue: total - red, items: [...Array(red).fill("🔴"), ...Array(total - red).fill("🔵")] as string[] };
  };
  const term = (red: number, total: number): string => (red * 2 === total ? "equally likely" : red * 2 > total ? "likely" : "unlikely");
  const fraction = (): Question => {
    const b = bag();
    return textChoice("You pick one marble without looking. What fraction of the marbles are red?", `${b.red}/${b.total}`, others(range(1, b.total - 1), b.red, 2).map((n) => `${n}/${b.total}`), "Count the red marbles. Then count all the marbles.", { type: "emojiRow", items: b.items });
  };
  const words = (): Question => {
    const b = bag();
    const right = term(b.red, b.total);
    return textChoice("You pick one marble without looking. Picking red is…", right, sample(["unlikely", "equally likely", "likely"].filter((t) => t !== right), 2), "Compare the red marbles with all the marbles. Is it more than half, half, or less than half?", { type: "emojiRow", items: b.items });
  };
  const predict = (): Question => {
    const a = randInt(6, 9);
    return textChoice(`Zoe spun a spinner 10 times and got blue ${a} times and green ${10 - a} ${10 - a === 1 ? "time" : "times"}. Which colour does the spinner most likely have more of?`, "blue", ["green", "the same of each"], "The colour that came up more often probably takes up more of the spinner.");
  };
  const meanMedian = (): Question => {
    const sets = [[2, 4, 6, 8, 10], [1, 2, 3, 4, 20], [5, 5, 6, 7, 7], [3, 3, 3, 3, 3], [1, 1, 2, 9, 12], [10, 12, 14, 16, 18]];
    const s = pick(sets);
    const mean = s.reduce((x, y) => x + y, 0) / s.length;
    const median = s[2];
    const same = mean === median;
    return textChoice("Are the mean and the median of this data the same?", same ? "Yes, they are the same" : "No, they are different", [same ? "No, they are different" : "Yes, they are the same"], "Find the middle number for the median. Add all the numbers and divide for the mean.", { type: "equation", text: s.join(", ") });
  };
  const statement = (): Question => {
    const bank = [
      { t: "You roll a number from 1 to 6 on a regular die.", term: "certain" },
      { t: "You roll an 8 on a regular die.", term: "impossible" },
      { t: "A coin lands on tails.", term: "equally likely" },
    ];
    const s = pick(bank);
    const all = ["impossible", "unlikely", "equally likely", "likely", "certain"];
    return textChoice(`How likely is this? “${s.t}”`, s.term, sample(all.filter((t) => t !== s.term), 3), "Can it happen? Will it always happen? Are two outcomes the same size?");
  };
  return buildSet([fraction, fraction, words, words, predict, meanMedian, meanMedian, statement]);
}

// ---------- Rectangles, coordinates and moves ----------

function geometry4(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const props = (): Question =>
    pick([
      () => numQ("How many right angles does a rectangle have?", 4, "Look at each corner. Every one is a square corner.", { type: "shape", shape: "rectangle" }, 8, 1),
      () => numQ("How many pairs of parallel sides does a rectangle have?", 2, "Parallel sides never meet. The top and bottom are one pair. The left and right are another.", { type: "shape", shape: "rectangle" }, 6, 1),
      () => numQ("How many lines of symmetry does a rectangle that is not a square have?", 2, "You can fold it in half across or down. You cannot fold it corner to corner.", { type: "shape", shape: "rectangle" }, 6, 1),
      () => textChoice("Sides that meet at a right angle are called…", "perpendicular", ["parallel", "congruent"], "Perpendicular sides cross or meet to make a square corner."),
      () => textChoice("Lines that stay the same distance apart and never meet are called…", "parallel", ["perpendicular", "symmetrical"], "Think of railway tracks."),
    ])();
  const readPoint = (): Question => {
    const x = randInt(1, 7);
    let y = randInt(1, 7);
    while (y === x) y = randInt(1, 7);
    const wrong = [`(${y}, ${x})`, `(${x + 1}, ${y})`];
    return textChoice("What are the coordinates of point A? The first number is across, the second is up.", `(${x}, ${y})`, wrong, "Go across to find x first. Then go up to find y.", { type: "grid", size: 8, points: [{ x, y, label: "A" }] });
  };
  const translate = (): Question => {
    const x = randInt(1, 4);
    const y = randInt(1, 4);
    const dx = randInt(1, 4);
    const dy = pick([1, 2, 3, 4].filter((v) => v !== dx));
    return textChoice(`Point A is at (${x}, ${y}). It is moved ${dx} to the right and ${dy} up. Where does it land?`, `(${x + dx}, ${y + dy})`, [`(${x + dy}, ${y + dx})`, `(${x + dx}, ${y})`], "Add to x for moves right. Add to y for moves up.", { type: "grid", size: 8, points: [{ x, y, label: "A" }] });
  };
  const reflect = (): Question => {
    const x = randInt(1, 3);
    const y = randInt(1, 6);
    const line = randInt(x + 1, 4);
    const nx = 2 * line - x;
    return textChoice(`Point A is at (${x}, ${y}). It is flipped over the vertical line x = ${line}. Where does it land?`, `(${nx}, ${y})`, [`(${x}, ${y + 1})`, `(${line}, ${y})`], "A reflection puts the point the same distance on the other side of the line.", { type: "grid", size: 8, points: [{ x, y, label: "A" }] });
  };
  const concept = (): Question =>
    pick([
      () => textChoice("Which move slides a shape without turning or flipping it?", "translation", ["reflection", "symmetry"], "A translation is a slide."),
      () => textChoice("Which move flips a shape over a line, like a mirror?", "reflection", ["translation", "congruent"], "A reflection is a flip."),
      () => textChoice("After a translation or a reflection, is the shape still the same size?", "Yes, it is the same size and shape", ["No, it gets bigger", "No, it gets smaller"], "These moves do not stretch or shrink a shape."),
    ])();
  return buildSet([props, props, readPoint, readPoint, translate, d === 1 ? concept : reflect, concept, d === 3 ? reflect : translate]);
}

// ---------- Angles and area ----------

function anglesArea4(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const kinds = [
    { name: "acute", range: [20, 80] },
    { name: "right", range: [90, 90] },
    { name: "obtuse", range: [100, 170] },
    { name: "straight", range: [180, 180] },
  ];
  const classify = (): Question => {
    const k = pick(d === 1 ? kinds.slice(0, 3) : kinds);
    const deg = randInt(k.range[0], k.range[1]);
    return textChoice("What kind of angle is this?", k.name, kinds.filter((x) => x.name !== k.name).map((x) => x.name).slice(0, 3), "Acute is smaller than a square corner. Right is a square corner. Obtuse is bigger but not flat. Straight is flat.", { type: "angle", degrees: deg });
  };
  const real = (): Question =>
    pick([
      () => textChoice("What kind of angle is the corner of a book?", "right angle", ["acute angle", "obtuse angle"], "A book corner is a square corner."),
      () => textChoice("The hands of a clock at 3:00 make what kind of angle?", "right angle", ["acute angle", "straight angle"], "At 3:00 the hands make a square corner."),
      () => textChoice("A straight line makes what kind of angle?", "straight angle", ["right angle", "obtuse angle"], "It is flat, like half a turn."),
    ])();
  const array = (): Question => {
    const rows = randInt(3, 8);
    const cols = randInt(3, 9);
    return numQ("Each square is 1 square unit. What is the area of the rectangle?", rows * cols, "Count the rows, and the squares in each row. Multiply them.", { type: "array", rows, cols, emoji: "🟦" }, 80, 6);
  };
  const area = (): Question => {
    const l = randInt(4, 14);
    const w = randInt(3, 9);
    return typeIn(`A rectangle is ${l} cm long and ${w} cm wide. What is its area in square centimetres?`, l * w, "Area = length × width.");
  };
  const missing = (): Question => {
    const l = randInt(5, 12);
    const w = randInt(3, 9);
    return typeIn(`A rectangle has an area of ${l * w} square centimetres. It is ${l} cm long. How wide is it, in centimetres?`, w, "Divide the area by the length to find the width.", { type: "equation", text: `${l} × ☐ = ${l * w}` });
  };
  return buildSet([classify, classify, classify, real, array, area, area, missing]);
}

// ---------- Metric measurement ----------

function metric4(): Question[] {
  const conv = (): Question => {
    const n = randInt(2, 9);
    return pick([
      () => typeIn(`${n} kg = ☐ g`, n * 1000, "1 kilogram is 1000 grams.", { type: "equation", text: `${n} kg = ☐ g` }),
      () => typeIn(`${n * 1000} g = ☐ kg`, n, "1000 grams make 1 kilogram.", { type: "equation", text: `${n * 1000} g = ☐ kg` }),
      () => typeIn(`${n} L = ☐ mL`, n * 1000, "1 litre is 1000 millilitres.", { type: "equation", text: `${n} L = ☐ mL` }),
      () => typeIn(`${n * 1000} mL = ☐ L`, n, "1000 millilitres make 1 litre.", { type: "equation", text: `${n * 1000} mL = ☐ L` }),
    ])();
  };
  const prefix = (): Question =>
    pick([
      () => textChoice("What does the prefix “kilo” mean?", "1000 times as much", ["one thousandth as much", "one hundredth as much"], "A kilometre is 1000 metres."),
      () => textChoice("What does the prefix “milli” mean?", "one thousandth", ["1000 times as much", "one hundred times as much"], "A millimetre is one thousandth of a metre."),
      () => textChoice("What does the prefix “centi” mean?", "one hundredth", ["one thousandth", "1000 times as much"], "A centimetre is one hundredth of a metre."),
    ])();
  const unit = (): Question => {
    const bank = [
      { q: "Which unit is best for the mass of an apple?", right: "grams", wrong: ["kilograms", "litres"] },
      { q: "Which unit is best for the mass of a student?", right: "kilograms", wrong: ["grams", "millilitres"] },
      { q: "Which unit is best for the capacity of a bathtub?", right: "litres", wrong: ["millilitres", "grams"] },
      { q: "Which unit is best for the capacity of a spoon?", right: "millilitres", wrong: ["litres", "kilograms"] },
      { q: "Which unit is best for the distance between two towns?", right: "kilometres", wrong: ["centimetres", "millimetres"] },
      { q: "Which unit is best for the thickness of a coin?", right: "millimetres", wrong: ["kilometres", "metres"] },
      { q: "Which tool would you use to measure mass?", right: "a scale", wrong: ["a measuring cup", "a ruler"] },
      { q: "Which tool would you use to measure capacity?", right: "a measuring cup", wrong: ["a scale", "a ruler"] },
    ];
    const b = pick(bank);
    return textChoice(b.q, b.right, b.wrong, "Picture the size of the thing. Choose a unit that is not too big or too small.");
  };
  const bench = (): Question => {
    const bank = [
      { q: "About how much mass does a paper clip have?", right: "1 g", wrong: ["1 kg", "100 g"] },
      { q: "About how much mass does a bag of sugar have?", right: "1 kg", wrong: ["1 g", "100 kg"] },
      { q: "About how much does a juice box hold?", right: "250 mL", wrong: ["250 L", "25 mL"] },
      { q: "About how much does a large bottle of water hold?", right: "1 L", wrong: ["1 mL", "100 L"] },
    ];
    const b = pick(bank);
    return textChoice(b.q, b.right, b.wrong, "Use things you know as benchmarks. A paper clip is about 1 g. A litre of milk is 1 L.");
  };
  return buildSet([conv, conv, conv, prefix, unit, unit, bench, bench]);
}

// ---------- Money ----------

function money4(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const pay = (): Question =>
    pick([
      () => textChoice("Which way to pay takes money straight from your bank account?", "debit card", ["credit card", "gift card"], "A debit card uses the money you already have in your account."),
      () => textChoice("Which way to pay means you borrow money and pay it back later?", "credit card", ["debit card", "cash"], "A credit card is a loan. You must pay it back."),
      () => textChoice("Which way to pay uses money you put on the card before?", "gift card", ["credit card", "cheque"], "A gift card has a set amount loaded on it."),
    ])();
  const concept = (): Question =>
    pick([
      () => textChoice("What does it mean to save money?", "keep some to use later", ["use it all today", "give it away"], "Saving is setting money aside."),
      () => textChoice("What does it mean to earn money?", "get paid for work", ["borrow money", "find a coupon"], "You earn money by working."),
      () => textChoice("What does it mean to donate money?", "give it to help others", ["keep it for later", "buy something with it"], "Donating is giving to a cause or to people in need."),
      () => textChoice("What does it mean to invest money?", "put it somewhere it may grow over time", ["spend it right away", "hide it under the bed"], "People invest with the hope that money will grow."),
    ])();
  const total = (): Question => {
    const n = randInt(2, 5);
    const price = randInt(2, 9);
    const extra = randInt(2, 9);
    return numQ(`Ana buys ${n} notebooks at $${price} each and a pen for $${extra}. What is the total cost, in dollars?`, n * price + extra, "Multiply first, then add.", undefined, 60, 4);
  };
  const change = (): Question => {
    const price = randInt(7, 18);
    const paid = pick([20, 20, 50].filter((p) => p > price));
    return numQ(`A game costs $${price}. Sam pays with $${paid}. How many dollars of change does he get?`, paid - price, "Take the price away from what he paid.", undefined, paid, 1);
  };
  const bestBuy = (): Question => {
    for (;;) {
      const n1 = randInt(2, 6);
      const n2 = randInt(2, 8);
      if (n1 === n2) continue;
      const u1 = randInt(10, 40) / 10;
      const u2 = randInt(10, 40) / 10;
      const p1 = Math.round(n1 * u1);
      const p2 = Math.round(n2 * u2);
      const r1 = p1 / n1;
      const r2 = p2 / n2;
      if (Math.abs(r1 - r2) < 0.15) continue;
      const better = r1 < r2 ? "A" : "B";
      return textChoice(`Pack A has ${n1} muffins for $${p1}. Pack B has ${n2} muffins for $${p2}. Which is the better buy?`, `Pack ${better}`, [`Pack ${better === "A" ? "B" : "A"}`], "Work out how much one muffin costs in each pack.", { type: "emoji", emoji: "🧁" });
    }
  };
  const goal = (): Question => {
    const week = randInt(3, 8);
    const weeks = randInt(4, 9);
    return numQ(`Kenji saves $${week} each week. How many weeks will it take to save $${week * weeks}?`, weeks, "Divide the goal by what he saves each week.", undefined, 15, 2);
  };
  return buildSet([pay, concept, concept, total, total, change, d === 1 ? total : bestBuy, goal]);
}

export const units: Unit[] = [
  {
    id: "fractions-4",
    title: "Fractions",
    emoji: "🍰",
    blurb: "Halves to tenths",
    standards: on("B1.4–B1.6, B2.7", "fractions from halves to tenths, counting by fractions, and repeated addition of a unit fraction"),
    parentNote: "Reading and naming fractions from halves to tenths, counting by fractions, comparing them, and seeing 3 × 1/4 as three fourths.",
    generate: fractions4,
  },
  {
    id: "decimals-4",
    title: "Tenths & Decimals",
    emoji: "🔟",
    blurb: "Decimal tenths",
    standards: on("B1.7–B1.9, B2.3", "decimal tenths: comparing, rounding, linking to fractions, adding and subtracting"),
    parentNote: "Reading, comparing, ordering and rounding decimal tenths, linking them to fractions, and adding and subtracting them.",
    generate: decimals4,
  },
  {
    id: "big-multiply",
    title: "Multiply & Divide",
    emoji: "✖️",
    blurb: "Tens, hundreds and bigger numbers",
    standards: on("B2.3, B2.5, B2.6, B2.8", "multiplying by 10, 100 and 1000, two- and three-digit multiplication, division with remainders as fractions, and rates"),
    parentNote: "Multiplying and dividing by 10, 100 and 1000, multiplying two- and three-digit numbers by one digit, writing remainders as fractions, and solving rate problems.",
    generate: bigMultiply4,
  },
  {
    id: "equations-4",
    title: "Solve It",
    emoji: "🔍",
    blurb: "Equations, variables and inequalities",
    standards: on("C2.1–C2.3", "symbols as variables, solving equations to 50, and inequalities to 20"),
    parentNote: "Using a letter or symbol for an unknown number, solving equations, checking an answer, and finding numbers that make an inequality true.",
    generate: equations4,
  },
  {
    id: "data-4",
    title: "Data & Averages",
    emoji: "📊",
    blurb: "Mean, median, mode and plots",
    standards: on("D1.1–D1.6", "qualitative and quantitative data, mean, median and mode, stem-and-leaf plots and multiple-bar graphs"),
    parentNote: "Telling words-data from number-data, finding the mean, median and mode, and reading stem-and-leaf plots and tables that compare two groups.",
    generate: data4,
  },
  {
    id: "chance-4",
    title: "Chance",
    emoji: "🎲",
    blurb: "How likely, with fractions",
    standards: on("D2.1, D2.2", "describing likelihood, fractions of outcomes, and comparing the mean, median and mode"),
    parentNote: "Using words and fractions to say how likely something is, predicting from results, and noticing when the mean and median match.",
    generate: chance4,
  },
  {
    id: "rectangles-and-grids",
    title: "Rectangles & Grids",
    emoji: "📍",
    blurb: "Coordinates, slides and flips",
    standards: on("E1.1–E1.3", "properties of rectangles, plotting coordinates in the first quadrant, translations and reflections"),
    parentNote: "Properties of rectangles (right angles, parallel and perpendicular sides, symmetry), reading coordinates, and sliding and flipping points on a grid.",
    generate: geometry4,
  },
  {
    id: "angles-and-area",
    title: "Angles & Area",
    emoji: "📐",
    blurb: "Acute, right, obtuse and area",
    standards: on("E2.4–E2.6", "classifying angles, area of rectangles, and finding a missing side from the area"),
    parentNote: "Sorting angles into acute, right, obtuse and straight, finding area by multiplying length by width, and working backward to find a side.",
    generate: anglesArea4,
  },
  {
    id: "metric-4",
    title: "Metric Measures",
    emoji: "⚖️",
    blurb: "Grams, kilograms, litres and millilitres",
    standards: on("E2.1, E2.2", "grams and kilograms, litres and millilitres, metric prefixes and choosing units"),
    parentNote: "Changing between grams and kilograms and between litres and millilitres, understanding kilo, centi and milli, and choosing a sensible unit and tool.",
    generate: metric4,
  },
  {
    id: "money-4",
    title: "Money Sense",
    emoji: "💰",
    blurb: "Spending, saving and good buys",
    standards: on("F1.1–F1.5", "ways to pay, multi-item totals and change, saving, spending, earning, investing and donating, and comparing prices"),
    parentNote: "Ways to pay, totals and change for several items, what it means to spend, save, earn, invest and donate, and comparing prices to find a good buy.",
    generate: money4,
  },
];
