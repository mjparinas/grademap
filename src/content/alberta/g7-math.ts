import { nearbyNumbers, pick, randInt, sample, shuffle, textChoice } from "../random";
import type { GenerateOptions, Question, Unit } from "../types";
import { ab, buildSet, levelOf, numQ, times } from "./kit";

// Alberta Grade 7 mathematics (Mathematics K–9, 2007): units written for outcomes the shared BC and Ontario
// units do not cover (divisibility, fractions with unlike denominators, expressions and equations, central
// tendency, area and constructions).

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

/** "5/6", "1 1/4" or "2" for a fraction in lowest terms. */
function frac(n: number, d: number): string {
  const g = gcd(n, d);
  const a = n / g;
  const b = d / g;
  if (b === 1) return String(a);
  if (a > b) return `${Math.floor(a / b)} ${a % b}/${b}`;
  return `${a}/${b}`;
}

/** Distinct wrong labels, never equal to the right one. */
function distinct(right: string, wrong: string[], n = 3): string[] {
  return [...new Set(wrong)].filter((w) => w !== right).slice(0, n);
}

// ---------- Divisibility ----------

const RULES: Record<number, string> = {
  2: "A number is divisible by 2 if its last digit is even.",
  3: "A number is divisible by 3 if its digits add up to a multiple of 3.",
  4: "A number is divisible by 4 if its last two digits form a multiple of 4.",
  5: "A number is divisible by 5 if it ends in 0 or 5.",
  6: "A number is divisible by 6 if it is divisible by both 2 and 3.",
  8: "A number is divisible by 8 if its last three digits form a multiple of 8.",
  9: "A number is divisible by 9 if its digits add up to a multiple of 9.",
  10: "A number is divisible by 10 if it ends in 0.",
};

function divisibility(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const divisors = d === 1 ? [2, 3, 5, 10] : d === 2 ? [2, 3, 4, 5, 6, 9, 10] : [3, 4, 6, 8, 9];
  const top = d === 1 ? 200 : d === 2 ? 999 : 9999;
  const multipleOf = (r: number) => r * randInt(Math.ceil(20 / r), Math.floor(top / r));
  const nonMultiple = (r: number) => {
    let n = randInt(20, top);
    while (n % r === 0) n = randInt(20, top);
    return n;
  };
  const which = (): Question => {
    const r = pick(divisors);
    const right = multipleOf(r);
    const wrong = new Set<number>();
    while (wrong.size < 3) wrong.add(nonMultiple(r));
    return textChoice(`Which number is divisible by ${r}?`, String(right), [...wrong].map(String), RULES[r]);
  };
  const yesNo = (): Question => {
    const r = pick(divisors);
    const n = pick([true, false]) ? multipleOf(r) : nonMultiple(r);
    return textChoice(`Is ${n} divisible by ${r}?`, n % r === 0 ? "Yes" : "No", [n % r === 0 ? "No" : "Yes"], RULES[r]);
  };
  const missingDigit = (): Question => {
    // 9: the digits must add to a multiple of 9, and one digit from 0 to 9 does it (never both 0 and 9).
    for (;;) {
      const a = randInt(1, 9);
      const b = randInt(1, 9);
      if ((a + b) % 9 === 0) continue;
      const digit = (9 - ((a + b) % 9)) % 9;
      return numQ(`Which digit can replace ■ so that ${a}■${b} is divisible by 9?`, digit, `The digits must add up to a multiple of 9. ${a} + ${b} = ${a + b}, so add ■ to reach the next multiple of 9.`, undefined, 9, 0);
    }
  };
  const both = (): Question => {
    // Divisible by 6 needs both 2 and 3: the wrong answers each fail one test.
    const right = multipleOf(6);
    let evenNot3 = nonMultiple(3);
    while (evenNot3 % 2 !== 0) evenNot3 = nonMultiple(3);
    let oddMult3 = multipleOf(3);
    while (oddMult3 % 2 === 0) oddMult3 = multipleOf(3);
    let neither = nonMultiple(3);
    while (neither % 2 === 0) neither = nonMultiple(3);
    return textChoice("Which number is divisible by 6?", String(right), [String(evenNot3), String(oddMult3), String(neither)], RULES[6]);
  };
  const zero: Question = textChoice(
    "Why can a number not be divided by 0?",
    "No number multiplied by 0 gives a number other than 0, so there is no answer",
    ["The answer is always 0", "The answer is always 1", "The answer is the number itself"],
    "Division asks: what number times the divisor gives the dividend? Nothing times 0 gives 12, for example.",
  );
  const makers = d === 1 ? [which, which, which, yesNo, yesNo, yesNo, zero, which] : [which, which, yesNo, yesNo, missingDigit, both, zero, d === 3 ? missingDigit : which];
  return buildSet(makers);
}

// ---------- Fractions with unlike denominators; comparing and ordering ----------

const DENOMS = [2, 3, 4, 5, 6, 8, 10, 12];

function properFraction(): { n: number; d: number } {
  const d = pick(DENOMS);
  return { n: randInt(1, d - 1), d };
}

function fractionSum(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const addQ = (): Question => {
    for (;;) {
      const a = properFraction();
      const b = properFraction();
      if (a.d === b.d && d > 1) continue;
      const l = lcm(a.d, b.d);
      const n = (a.n * l) / a.d + (b.n * l) / b.d;
      const right = frac(n, l);
      const wrong = distinct(right, [frac(a.n + b.n, a.d + b.d), frac(a.n + b.n, l), frac(a.n + b.n, Math.max(a.d, b.d)), frac(n + 1, l), frac(n - 1, l)]);
      if (wrong.length < 3 || n === l) continue;
      return textChoice(`What is ${a.n}/${a.d} + ${b.n}/${b.d}?`, right, wrong, `Write both fractions with the common denominator ${l}, add the numerators, then simplify.`, { type: "equation", text: `${a.n}/${a.d} + ${b.n}/${b.d}` });
    }
  };
  const subQ = (): Question => {
    for (;;) {
      let a = properFraction();
      let b = properFraction();
      if (a.d === b.d && d > 1) continue;
      if (a.n * b.d < b.n * a.d) [a, b] = [b, a];
      const l = lcm(a.d, b.d);
      const n = (a.n * l) / a.d - (b.n * l) / b.d;
      if (n <= 0) continue;
      const right = frac(n, l);
      const wrong = distinct(right, [frac(Math.abs(a.n - b.n) || 1, Math.abs(a.d - b.d) || a.d), frac(a.n - b.n > 0 ? a.n - b.n : 1, l), frac(n + 1, l), frac(n + 2, l), frac(n + l, l * 2)]);
      if (wrong.length < 3) continue;
      return textChoice(`What is ${a.n}/${a.d} − ${b.n}/${b.d}?`, right, wrong, `Use the common denominator ${l}, subtract the numerators, then simplify.`, { type: "equation", text: `${a.n}/${a.d} − ${b.n}/${b.d}` });
    }
  };
  const mixedQ = (): Question => {
    for (;;) {
      const w1 = randInt(1, 4);
      const w2 = randInt(1, 3);
      const a = properFraction();
      const b = properFraction();
      if (a.d === b.d) continue;
      const l = lcm(a.d, b.d);
      const adding = pick([true, false]);
      const n1 = w1 * a.d + a.n;
      const n2 = w2 * b.d + b.n;
      const top = adding ? (n1 * l) / a.d + (n2 * l) / b.d : (n1 * l) / a.d - (n2 * l) / b.d;
      if (top <= 0) continue;
      const right = frac(top, l);
      const sign = adding ? "+" : "−";
      const wholeOp = adding ? w1 + w2 : Math.abs(w1 - w2);
      const wrong = distinct(right, [`${wholeOp} ${frac(a.n + b.n, a.d + b.d)}`, frac(top + l, l), frac(top - l > 0 ? top - l : top + 2 * l, l), frac(top + 1, l), `${wholeOp + 1}`]);
      if (wrong.length < 3 || top % l === 0) continue;
      return textChoice(`What is ${w1} ${a.n}/${a.d} ${sign} ${w2} ${b.n}/${b.d}?`, right, wrong, `Change each mixed number to an improper fraction (or work with the whole numbers and fractions separately), use the common denominator ${l}, then simplify.`);
    }
  };
  const story = (): Question => {
    const a = properFraction();
    const b = properFraction();
    const name = pick(["Maya", "Jay", "Amir", "Lena", "Kenji", "Zoe"]);
    if (a.d === b.d) return story();
    const l = lcm(a.d, b.d);
    const n = (a.n * l) / a.d + (b.n * l) / b.d;
    const right = frac(n, l);
    const wrong = distinct(right, [frac(a.n + b.n, a.d + b.d), frac(a.n + b.n, l), frac(n + 1, l), frac(n + 2, l)]);
    if (wrong.length < 3) return story();
    return textChoice(`${name} walked ${a.n}/${a.d} km to the library and then ${b.n}/${b.d} km to a friend's house. How far did ${name} walk in all, in kilometres?`, right, wrong, `Add ${a.n}/${a.d} + ${b.n}/${b.d} using the common denominator ${l}.`);
  };
  return buildSet(d === 1 ? [addQ, addQ, addQ, subQ, subQ, story, addQ, subQ] : d === 2 ? [addQ, addQ, subQ, subQ, mixedQ, mixedQ, story, story] : [addQ, subQ, mixedQ, mixedQ, mixedQ, mixedQ, story, subQ]);
}

const COMPARE_POOL: { label: string; v: number }[] = [
  { label: "1/4", v: 0.25 }, { label: "0.3", v: 0.3 }, { label: "2/5", v: 0.4 }, { label: "0.45", v: 0.45 },
  { label: "1/2", v: 0.5 }, { label: "0.55", v: 0.55 }, { label: "3/5", v: 0.6 }, { label: "0.65", v: 0.65 },
  { label: "3/4", v: 0.75 }, { label: "0.8", v: 0.8 }, { label: "7/8", v: 0.875 }, { label: "0.9", v: 0.9 },
  { label: "1 1/4", v: 1.25 }, { label: "1.3", v: 1.3 }, { label: "1 1/2", v: 1.5 }, { label: "1.75", v: 1.75 },
];

function compareOrder(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const greatest = (): Question => {
    const set = sample(COMPARE_POOL, 4);
    const top = set.reduce((m, x) => (x.v > m.v ? x : m));
    return textChoice("Which is the greatest?", top.label, set.filter((x) => x !== top).map((x) => x.label), "Change the fractions to decimals (1/4 = 0.25, 1/2 = 0.5, 3/4 = 0.75) so you can compare them.");
  };
  const least = (): Question => {
    const set = sample(COMPARE_POOL, 4);
    const low = set.reduce((m, x) => (x.v < m.v ? x : m));
    return textChoice("Which is the least?", low.label, set.filter((x) => x !== low).map((x) => x.label), "Change the fractions to decimals so you can compare them.");
  };
  const order = (n: number): Question => {
    const set = sample(COMPARE_POOL, n).sort((a, b) => a.v - b.v);
    return { kind: "order", prompt: "Tap the numbers from least to greatest.", hint: "Change every number to a decimal, then compare. A number line can help.", items: set.map((x, i) => ({ id: `o${i}`, label: x.label })) };
  };
  const between = (): Question => {
    const lo = pick([0.2, 0.3, 0.4, 0.5]);
    const hi = lo + 0.1;
    const right = (lo + 0.05).toFixed(2);
    const wrong = [(lo - 0.05).toFixed(2), (hi + 0.05).toFixed(2), (hi + 0.15).toFixed(2)];
    return textChoice(`Which decimal is between ${lo.toFixed(1)} and ${hi.toFixed(1)}?`, right, wrong, `Think of ${lo.toFixed(1)} as ${lo.toFixed(2)} and ${hi.toFixed(1)} as ${hi.toFixed(2)}.`);
  };
  const thousandths = (): Question => {
    const base = randInt(1, 8) / 10;
    const a = base + 0.001 * randInt(1, 9);
    const b = base + 0.01 * randInt(1, 9);
    if (a === b) return thousandths();
    const bigger = Math.max(a, b);
    const smaller = Math.min(a, b);
    return textChoice("Which decimal is greater?", bigger.toFixed(bigger === a ? 3 : 2), [smaller.toFixed(smaller === a ? 3 : 2)], "Line up the place values: tenths, hundredths, then thousandths.");
  };
  return buildSet(d === 1 ? [greatest, greatest, least, least, () => order(3), () => order(3), between, thousandths] : [greatest, least, () => order(4), () => order(4), () => order(d === 3 ? 5 : 4), between, thousandths, thousandths]);
}

// ---------- Expressions and equations ----------

function expressions(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const v = () => pick(["x", "n", "a", "m", "p"]);
  const isEquation = (): Question => {
    const x = v();
    const mk = () => `${randInt(2, 9)}${x} ${pick(["+", "−"])} ${randInt(1, 12)}`;
    const exprs = sample([mk(), mk(), mk(), `${randInt(2, 6)}(${x} + ${randInt(1, 5)})`], 3);
    const equation = `${mk()} = ${randInt(10, 40)}`;
    return textChoice("Which one is an equation?", equation, exprs, "An equation has an equals sign and says two amounts are the same. An expression does not.");
  };
  const isExpression = (): Question => {
    const x = v();
    const mk = () => `${randInt(2, 9)}${x} ${pick(["+", "−"])} ${randInt(1, 12)}`;
    const expr = mk();
    const eqs = [`${mk()} = ${randInt(10, 40)}`, `${randInt(2, 9)}${x} = ${randInt(10, 40)}`, `${x} + ${randInt(1, 9)} = ${randInt(10, 30)}`];
    return textChoice("Which one is an expression?", expr, eqs, "An expression is a maths phrase with no equals sign, like 3n + 2.");
  };
  const evaluate = (): Question => {
    const x = v();
    const a = randInt(2, 9);
    const b = randInt(1, 12);
    const val = randInt(2, 9);
    if (d < 3) return numQ(`Evaluate ${a}${x} + ${b} when ${x} = ${val}.`, a * val + b, `Replace ${x} with ${val}: ${a} × ${val} + ${b}.`, undefined, 120, 0);
    const c = randInt(2, 6);
    const y = val + randInt(1, 3);
    return numQ(`Evaluate ${a}x + ${c}y when x = ${val} and y = ${y}.`, a * val + c * y, `Replace x with ${val} and y with ${y}: ${a} × ${val} + ${c} × ${y}.`, undefined, 150, 0);
  };
  const operation = (): Question => {
    const x = v();
    const a = randInt(2, 15);
    const b = a + randInt(2, 20);
    const kind = pick(["add", "mult"] as const);
    if (kind === "add") {
      return textChoice(`To solve ${x} + ${a} = ${b}, what do you do to both sides?`, `Subtract ${a} from both sides`, [`Add ${a} to both sides`, `Divide both sides by ${a}`, `Subtract ${b} from both sides`], "Keep the equation balanced: do the same thing to both sides. Subtracting undoes adding.");
    }
    const m = randInt(2, 9);
    return textChoice(`To solve ${m}${x} = ${m * a}, what do you do to both sides?`, `Divide both sides by ${m}`, [`Subtract ${m} from both sides`, `Multiply both sides by ${m}`, `Add ${m} to both sides`], "Do the same thing to both sides. Dividing undoes multiplying.");
  };
  const equivalent = (): Question => {
    const x = v();
    const a = randInt(2, 6);
    const r = randInt(2, 9);
    const k = randInt(2, 4);
    const right = `${a * k}${x} = ${a * r * k}`;
    return textChoice(`Which equation is equivalent to ${a}${x} = ${a * r}? (Same solution.)`, right, [`${a * k}${x} = ${a * r}`, `${a}${x} + ${k} = ${a * r}`, `${a * k}${x} = ${a * r + k}`], `Multiplying both sides by ${k} gives ${a * k}${x} = ${a * r * k}.`);
  };
  const intEq = (): Question => {
    const x = v();
    const a = randInt(2, 12);
    const answer = pick([-1, 1]) * randInt(2, 15);
    const sum = answer + a;
    const sign = pick(["+", "−"]);
    // x + a = sum, or x − a = (answer − a)
    if (sign === "+") return numQ(`Solve ${x} + ${a} = ${sum}.`, answer, `Subtract ${a} from both sides: ${sum} − ${a}.`, undefined, 30, -30);
    return numQ(`Solve ${x} − ${a} = ${answer - a}.`, answer, `Add ${a} to both sides: ${answer - a} + ${a}.`, undefined, 30, -30);
  };
  const word = (): Question => {
    const a = randInt(2, 8);
    const b = randInt(1, 10);
    const total = a * randInt(2, 7) + b;
    return textChoice(`Jay buys ${a} notebooks that each cost the same price, n, and a $${b} pen. The total is $${total}. Which equation matches?`, `${a}n + ${b} = ${total}`, [`${a}n − ${b} = ${total}`, `${a} + n + ${b} = ${total}`, `n + ${a * b} = ${total}`], `The notebooks cost ${a} × n, then add the pen: ${a}n + ${b}.`);
  };
  return buildSet(d === 1 ? [isEquation, isExpression, evaluate, evaluate, operation, intEq, operation, evaluate] : [isEquation, isExpression, evaluate, operation, equivalent, intEq, word, d === 3 ? evaluate : word]);
}

// ---------- Central tendency and outliers ----------

function dataSet(n: number, lo: number, hi: number): number[] {
  return Array.from({ length: n }, () => randInt(lo, hi));
}

const sortNum = (xs: number[]) => [...xs].sort((a, b) => a - b);

function centralTendency(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const list = (xs: number[]) => xs.join(", ");
  const names = ["quiz scores", "daily steps (hundreds)", "points scored", "books read"];
  const mean = (): Question => {
    const n = pick([4, 5]);
    const xs = dataSet(n, d === 1 ? 3 : 4, d === 3 ? 40 : 20);
    const rem = xs.reduce((s, x) => s + x, 0) % n;
    if (rem !== 0) xs[n - 1] += n - rem;
    const m = xs.reduce((s, x) => s + x, 0) / n;
    return numQ(`What is the mean of ${list(xs)}?`, m, `Add all the numbers (${xs.reduce((s, x) => s + x, 0)}), then divide by how many there are (${n}).`, undefined, 80, 0);
  };
  const median = (): Question => {
    const odd = d === 1 || pick([true, false]);
    let xs: number[];
    let ans: number;
    if (odd) {
      xs = shuffle(dataSet(5, 2, d === 3 ? 40 : 20));
      ans = sortNum(xs)[2];
    } else {
      xs = dataSet(6, 2, 20);
      const s = sortNum(xs);
      // make the two middle values add to an even number so the median is whole
      if ((s[2] + s[3]) % 2 !== 0) s[3] += 1;
      xs = shuffle(s);
      ans = (sortNum(xs)[2] + sortNum(xs)[3]) / 2;
    }
    return numQ(`What is the median of ${list(xs)}?`, ans, odd ? "Put the numbers in order. The median is the middle one." : "Put the numbers in order. With an even number of values, the median is halfway between the two middle ones.", undefined, 60, 0);
  };
  const mode = (): Question => {
    const base = sample(Array.from({ length: 15 }, (_, i) => i + 2), 5);
    const m = base[0];
    const xs = shuffle([...base, m, ...(d === 3 ? [m] : [])]);
    return numQ(`What is the mode of ${list(xs)}?`, m, "The mode is the value that appears most often.", undefined, 20, 0);
  };
  const range = (): Question => {
    const xs = shuffle(Array.from(new Set(dataSet(7, 3, 60))).slice(0, 5));
    const s = sortNum(xs);
    return numQ(`What is the range of ${list(xs)}?`, s[s.length - 1] - s[0], "The range is the greatest value minus the least value.", undefined, 80, 0);
  };
  const outlier = (): Question => {
    const base = sortNum(sample(Array.from({ length: 12 }, (_, i) => i + 10), 5));
    const odd = base[base.length - 1] * pick([4, 5, 6]);
    const xs = shuffle([...base, odd]);
    return textChoice(`Which value is an outlier in ${list(xs)}?`, String(odd), base.slice(0, 3).map(String), "An outlier is far away from the other values in the data set.");
  };
  const effect = (): Question => {
    const base = sortNum(sample(Array.from({ length: 8 }, (_, i) => i + 10), 5));
    const big = base[4] * pick([5, 6, 8]);
    return textChoice(
      `The data ${list(base)} get one more value: ${big}. Which measure changes the most?`,
      "The mean",
      ["The median", "The mode", "They all change the same amount"],
      "A value far from the others pulls the mean toward it. The median and mode barely move.",
    );
  };
  const context = (): Question => {
    const xs = shuffle([8, 9, 9, 10, 9, 10, 8, 35]);
    return textChoice(`The ${pick(names)} are ${list(xs)}. Which measure best describes a typical value?`, "The median, because the outlier pulls the mean up", ["The mean, because it uses every value", "The range, because it is the biggest", "The mode only if nothing repeats"], "Test each measure. The mean is pulled by the 35. The median stays near the middle of the data.");
  };
  return buildSet(d === 1 ? [mean, mean, median, median, mode, mode, range, outlier] : [mean, median, mode, range, outlier, effect, d === 3 ? context : median, mean]);
}

// ---------- Area of triangles and parallelograms; constructions ----------

function areaConstructions(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const triangle = (): Question => {
    const b = randInt(3, d === 3 ? 20 : 14);
    const h = randInt(2, 12) * 2;
    const w = (h * b) / 2;
    return numQ(`A triangle has a base of ${b} cm and a height of ${h} cm. What is its area, in square centimetres?`, w, `Area of a triangle = base × height ÷ 2 = ${b} × ${h} ÷ 2.`, undefined, 250, 0);
  };
  const parallelogram = (): Question => {
    const b = randInt(3, 15);
    const h = randInt(2, 12);
    const slant = h + randInt(1, 4);
    return numQ(`A parallelogram has a base of ${b} cm, a height of ${h} cm and a slanted side of ${slant} cm. What is its area, in square centimetres?`, b * h, `Use the height (the straight-up distance), not the slanted side: base × height = ${b} × ${h}.`, undefined, 260, 0);
  };
  const findHeight = (): Question => {
    const b = randInt(4, 12);
    const h = randInt(3, 12);
    return numQ(`A triangle has an area of ${(b * h) / (b % 2 === 0 || h % 2 === 0 ? 2 : 1)} cm² and a base of ${b} cm. What is its height, in centimetres?`, b % 2 === 0 || h % 2 === 0 ? h : (b * h) / b, "Area × 2 ÷ base = height.", undefined, 40, 0);
  };
  const height = (): Question =>
    textChoice("What is the height of a triangle?", "The straight distance from the base to the opposite corner, at a right angle to the base", ["The length of its longest side", "The distance around the triangle", "The length of its shortest side"], "The height makes a right angle with the base.");
  const rectRelation = (): Question =>
    textChoice("A triangle and a rectangle have the same base and the same height. How do their areas compare?", "The triangle's area is half the rectangle's", ["They are equal", "The triangle's area is double the rectangle's", "The triangle's area is a quarter of the rectangle's"], "Two matching triangles fit together to make the rectangle (or a parallelogram), so each is half.");
  const construct = (): Question =>
    pick([
      () => textChoice("A line that cuts a line segment into two equal parts at a right angle is called a…", "perpendicular bisector", ["angle bisector", "parallel line", "diagonal"], "Perpendicular means at a right angle. Bisect means to cut in two equal parts."),
      () => {
        const a = randInt(4, 20) * 10;
        return numQ(`An angle bisector cuts a ${a}° angle into two equal angles. How large is each one, in degrees?`, a / 2, "Bisect means to cut into two equal parts. Divide by 2.", undefined, 100, 0);
      },
      () => textChoice("Two lines that are always the same distance apart and never meet are…", "parallel", ["perpendicular", "bisectors", "intersecting"], "Think of railway tracks."),
      () => textChoice("Two lines meet at a 90° angle. They are…", "perpendicular", ["parallel", "angle bisectors", "equal"], "A right angle is 90°."),
    ])();
  return buildSet(d === 1 ? [triangle, triangle, parallelogram, parallelogram, height, construct, construct, rectRelation] : [triangle, parallelogram, parallelogram, findHeight, height, construct, construct, d === 3 ? findHeight : rectRelation]);
}

export const units: Unit[] = [
  {
    id: "divisibility-ab",
    title: "Divisibility Rules",
    emoji: "➗",
    blurb: "Is it divisible?",
    parentNote: "Using divisibility rules for 2, 3, 4, 5, 6, 8, 9 and 10 without dividing, and why no number can be divided by 0.",
    standards: ab("N1", "divisibility rules for 2, 3, 4, 5, 6, 8, 9 and 10, and why a number cannot be divided by 0"),
    generate: divisibility,
  },
  {
    id: "fractions-ab",
    title: "Adding & Subtracting Fractions",
    emoji: "🍕",
    blurb: "Unlike denominators and mixed numbers",
    parentNote: "Adding and subtracting positive fractions and mixed numbers with like and unlike denominators, in lowest terms.",
    standards: ab("N5", "adding and subtracting positive fractions and mixed numbers with unlike denominators"),
    generate: fractionSum,
  },
  {
    id: "compare-order-ab",
    title: "Comparing & Ordering",
    emoji: "📏",
    blurb: "Fractions, decimals and whole numbers",
    parentNote: "Comparing and ordering positive fractions, decimals to thousandths and whole numbers, using benchmarks and equivalent decimals.",
    standards: ab("N7", "comparing and ordering positive fractions, decimals (to thousandths) and whole numbers"),
    generate: compareOrder,
  },
  {
    id: "expressions-ab",
    title: "Expressions & Equations",
    emoji: "⚖️",
    blurb: "Keep both sides balanced",
    parentNote: "The difference between an expression and an equation, evaluating expressions, keeping equations balanced, and solving one-step equations with integers.",
    standards: ab("PR3, PR4, PR5, PR6", "expressions versus equations, evaluating expressions, preserving equality and one-step equations"),
    generate: expressions,
  },
  {
    id: "area-constructions-ab",
    title: "Area & Constructions",
    emoji: "📐",
    blurb: "Triangles, parallelograms and bisectors",
    parentNote: "Area of triangles and parallelograms using base and height, and the vocabulary of perpendicular and parallel lines and bisectors.",
    standards: ab("SS2, SS3", "area of triangles and parallelograms, and perpendicular, parallel and bisector constructions"),
    generate: areaConstructions,
  },
  {
    id: "central-tendency-ab",
    title: "Mean, Median & Mode",
    emoji: "📊",
    blurb: "What is typical?",
    parentNote: "Mean, median, mode and range, and how an outlier changes them.",
    standards: ab("SP1, SP2", "mean, median, mode and range, and the effect of outliers"),
    generate: centralTendency,
  },
];

void times;
void nearbyNumbers;
