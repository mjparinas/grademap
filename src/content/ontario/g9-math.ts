import { fromBank, type BankItem } from "../bank";
import { pick, randInt, sample, shuffle, textChoice } from "../random";
import type { GenerateOptions, Question, Unit, Visual } from "../types";
import { buildSet, levelOf, on, spaced, typeIn } from "./kit";

// Ontario Grade 9 mathematics, MTH1W (2021 de-streamed course). BC's rational numbers, exponent laws,
// polynomials, multi-step equations and linear relations units are shared; these units cover the
// number sets, powers, rates, expressions, coding, linear-relation graphs, data, geometry, measurement
// and financial literacy that Ontario names for Grade 9.

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);
const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const sup = (n: number): string => String(n).split("").map((d) => SUP[Number(d)]).join("");
const minus = (n: number): string => (n < 0 ? `−${-n}` : String(n));
const money = (cents: number): string => `$${(cents / 100).toFixed(2)}`;
const dollars = (n: number): string => `$${spaced(n)}`;

/** "3x + 5", "x − 4", "−2x", "7" for a linear expression in `v`. */
function lin(a: number, b: number, v = "x"): string {
  const first = a === 0 ? "" : a === 1 ? v : a === -1 ? `−${v}` : `${minus(a)}${v}`;
  if (a === 0) return minus(b);
  if (b === 0) return first;
  return `${first} ${b > 0 ? "+" : "−"} ${Math.abs(b)}`;
}
const line = (a: number, b: number): string => `y = ${lin(a, b)}`;

/** Read-aloud says big numbers without the thin spaces. */
function say<T extends Question>(q: T): T {
  const plain = (text: string) => text.replace(/(\d) (?=\d{3}\b)/g, "$1");
  const spoken = plain(q.prompt);
  if (spoken !== q.prompt) q.speak = spoken;
  if (q.kind === "choice") {
    for (const c of q.choices) {
      const s = plain(c.label);
      if (s !== c.label) c.speak = s;
    }
  }
  return q;
}

const code = (lines: string[]): Visual => ({ type: "passage", title: "Code", paragraphs: lines });

// ---------- Number sets ----------

const SETS: BankItem[] = [
  { prompt: "Which of these sets contains −3?", right: "Integers", wrong: ["Whole numbers", "Natural numbers"], hint: "The integers are the whole numbers and their opposites: …, −2, −1, 0, 1, 2, …" },
  { prompt: "Which set contains 0 but not −2?", right: "Whole numbers", wrong: ["Integers", "Rational numbers"], hint: "Whole numbers start at 0 and go up. Integers and rational numbers include negatives." },
  { prompt: "Which number is rational but not an integer?", right: "3/4", wrong: ["−6", "0", "12"], hint: "An integer has no fraction part. 3/4 is a ratio of integers that falls between 0 and 1." },
  { prompt: "Which number is irrational?", right: "√10", wrong: ["√25", "0.125", "−2/9"], hint: "√25 = 5, 0.125 = 1/8 and −2/9 are all ratios of integers. √10 is not a perfect square, so its decimal never ends or repeats." },
  { prompt: "Which number is irrational?", right: "√3", wrong: ["1.7", "7/4", "−1.75"], hint: "Terminating decimals like 1.7 and 1.75 can be written as fractions. √3 cannot." },
  { prompt: "Which statement about π is true?", right: "It is irrational: its decimal never ends or repeats", wrong: ["It is rational because 3.14 is a decimal", "It equals 22/7 exactly", "It is a whole number"], hint: "22/7 and 3.14 are only close approximations of π." },
  { prompt: "How many rational numbers lie between 0 and 1?", right: "Infinitely many", wrong: ["None", "Exactly 9", "Exactly 99"], hint: "You can always find a number halfway between any two rational numbers, and then another, and another." },
  { prompt: "What does it mean to say the rational numbers are dense?", right: "Between any two rational numbers there is always another one", wrong: ["Every rational number is a whole number", "There is a largest rational number", "Rational numbers cannot be written as fractions"], hint: "Dense means there are no gaps: the average of two rational numbers is another rational number between them." },
  { prompt: "A decimal repeats forever: 0.333… Is it rational?", right: "Yes, it equals 1/3", wrong: ["No, because it never ends", "No, because it is not a fraction", "Only if it is rounded"], hint: "A repeating decimal can be written as a fraction, so it is rational." },
  { prompt: "Which list shows the whole numbers?", right: "0, 1, 2, 3, …", wrong: ["1, 2, 3, …", "…, −2, −1, 0, 1, 2, …", "All fractions and decimals"], hint: "Whole numbers are the counting numbers together with 0." },
  { prompt: "Which number is a natural (counting) number?", right: "7", wrong: ["−7", "3/2", "√2"], hint: "Natural numbers are 1, 2, 3, … : the numbers you use to count." },
  { prompt: "Which number is an integer?", right: "−5", wrong: ["−5/2", "√5", "0.5"], hint: "Integers have no fraction or decimal part." },
  { prompt: "What is the largest natural number?", right: "There is no largest one: they go on forever", wrong: ["1 000 000", "999 999 999", "1"], hint: "Add 1 to any natural number and you get a bigger one, so the set is infinite." },
  { prompt: "As n gets very large, what happens to 1/n?", right: "It gets closer and closer to 0", wrong: ["It becomes negative", "It gets larger and larger", "It reaches exactly 0"], hint: "1/10, 1/100, 1/1000 … keep shrinking toward 0, the limit, but never reach it." },
  { prompt: "Which statement is true?", right: "Every integer is a rational number", wrong: ["Every rational number is an integer", "Every irrational number is a rational number", "No integer is a rational number"], hint: "Any integer n can be written as the fraction n/1." },
  { prompt: "Which best describes the set of integers?", right: "The whole numbers and their opposites", wrong: ["Only the positive numbers", "All fractions", "Numbers whose decimals never end"], hint: "Integers include 0, the positive whole numbers and the negatives of those numbers." },
];

function numberSets(): Question[] {
  return fromBank(SETS, 8);
}

// ---------- Powers ----------

function powers9(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const zero = (): Question => {
    const b = randInt(2, 9);
    return typeIn(`What is ${b}⁰?`, 1, "Any non-zero number to the power 0 equals 1. Each time the exponent drops by 1 you divide by the base, and 5 ÷ 5 = 1.");
  };
  const pattern = (): Question => {
    const b = randInt(2, 5);
    return typeIn(`Complete the pattern: ${b}³ = ${b ** 3}, ${b}² = ${b ** 2}, ${b}¹ = ${b}, ${b}⁰ = ?`, 1, `Each step divides by ${b}, so ${b} ÷ ${b} = 1.`);
  };
  const negative = (): Question => {
    const [b, e] = pick([[2, 3], [2, 4], [2, 5], [3, 2], [3, 3], [4, 2], [5, 2], [10, 2], [10, 3]]);
    return textChoice(`Which value equals ${b}⁻${sup(e)}?`, `1/${b ** e}`, [`−${b ** e}`, `1/${b * e}`, `−${b * e}`], `A negative exponent means the reciprocal: ${b}⁻${sup(e)} = 1/${b}${sup(e)} = 1/${b ** e}.`);
  };
  const decimal = (): Question => {
    const e = randInt(2, d === 1 ? 3 : 5);
    const right = `0.${"0".repeat(e - 1)}1`;
    return textChoice(`What is 10⁻${sup(e)} as a decimal?`, right, [`0.${"0".repeat(e)}1`, `0.${"0".repeat(e - 2)}1`, `−${spaced(10 ** e)}`], `10⁻${sup(e)} = 1/10${sup(e)} = 1/${spaced(10 ** e)}, which has its 1 in the ${e === 2 ? "hundredths" : e === 3 ? "thousandths" : e === 4 ? "ten-thousandths" : "hundred-thousandths"} place.`);
  };
  const tenths = (): number => {
    let t = randInt(11, 99);
    while (t % 10 === 0) t = randInt(11, 99);
    return t;
  };
  const sciBig = (): Question => {
    const t = tenths();
    const k = randInt(3, 7);
    const n = t * 10 ** (k - 1);
    const c = t / 10;
    return say(textChoice(`Write ${spaced(n)} in scientific notation.`, `${c} × 10${sup(k)}`, [`${c} × 10${sup(k - 1)}`, `${c} × 10${sup(k + 1)}`, `${t} × 10${sup(k)}`], "Scientific notation has one non-zero digit before the decimal point. Count how many places the decimal point moves; that is the exponent."));
  };
  const sciSmall = (): Question => {
    const t = tenths();
    const k = randInt(2, 6);
    const c = t / 10;
    const decimal = `0.${"0".repeat(k - 1)}${t}`;
    return textChoice(`Write ${decimal} in scientific notation.`, `${c} × 10⁻${sup(k)}`, [`${c} × 10${sup(k)}`, `${c} × 10⁻${sup(k - 1)}`, `${c} × 10⁻${sup(k + 1)}`], "Move the decimal point right until one non-zero digit is in front. A small number gets a negative exponent equal to the number of places moved.");
  };
  const toStandard = (): Question => {
    const t = tenths();
    const k = randInt(3, 6);
    return typeIn(`Write ${t / 10} × 10${sup(k)} as a whole number (no spaces).`, t * 10 ** (k - 1), `Move the decimal point ${k} places to the right, adding zeros where needed.`);
  };
  const compare = (): Question => {
    let a = randInt(1, 9), b = randInt(1, 9), p = randInt(2, 6), q = randInt(2, 6);
    while (a * 10 ** p === b * 10 ** q) {
      a = randInt(1, 9);
      b = randInt(1, 9);
      p = randInt(2, 6);
      q = randInt(2, 6);
    }
    const A = `${a} × 10${sup(p)}`;
    const B = `${b} × 10${sup(q)}`;
    const right = a * 10 ** p > b * 10 ** q ? A : B;
    return textChoice("Which number is greater?", right, [right === A ? B : A, "They are equal"], "Compare the exponents first: a bigger power of ten usually wins. If they match, compare the numbers in front.");
  };
  return buildSet([() => pick([zero, pattern])(), negative, negative, decimal, sciBig, sciSmall, toStandard, compare]);
}

// ---------- Ratios, rates and percents ----------

function ratesPercents(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const unitRate = (): Question => {
    const speed = randInt(10, d === 1 ? 30 : 60);
    const h = randInt(2, 6);
    return typeIn(`A cyclist rides ${speed * h} km in ${h} hours at a steady pace. What is the rate in km per hour?`, speed, `Divide the distance by the time: ${speed * h} ÷ ${h} = ${speed}.`);
  };
  const betterBuy = (): Question => {
    const prices = sample([10, 15, 20, 25, 30, 35, 40, 45, 50], 2);
    const sizes = sample([2, 3, 4, 5, 6, 8, 10, 12], 2);
    const [uA, uB] = prices;
    const [qA, qB] = sizes;
    const right = uA < uB ? "Pack A" : "Pack B";
    return textChoice(
      `Pack A has ${qA} juice boxes for ${money(uA * qA)}. Pack B has ${qB} juice boxes for ${money(uB * qB)}. Which is the better buy?`,
      right,
      [right === "Pack A" ? "Pack B" : "Pack A", "They cost the same per box"],
      `Find the cost of one box in each pack: ${money(uA * qA)} ÷ ${qA} = ${money(uA)} and ${money(uB * qB)} ÷ ${qB} = ${money(uB)}. The lower unit rate is the better buy.`,
    );
  };
  const percentOf = (): Question => {
    const pct = pick([10, 15, 20, 25, 30, 35, 40, 60, 75]);
    const base = 20 * randInt(2, 20);
    return typeIn(`What is ${pct}% of ${base}?`, (pct * base) / 100, `${pct}% means ${pct}/100. Multiply: ${pct} × ${base} ÷ 100 = ${(pct * base) / 100}.`);
  };
  const percentChange = (): Question => {
    const base = 20 * randInt(2, 10);
    const pct = pick([5, 10, 15, 20, 25, 30, 40, 50]);
    const up = pick([true, false]);
    const next = (base * (up ? 100 + pct : 100 - pct)) / 100;
    return typeIn(`A price ${up ? "rises" : "falls"} from $${base} to $${next}. By what percent did it ${up ? "increase" : "decrease"}?`, pct, `Change ÷ original × 100 = ${Math.abs(next - base)} ÷ ${base} × 100 = ${pct}%.`, undefined, { suffix: "%" });
  };
  const ratioPart = (): Question => {
    const [a, b] = sample([1, 2, 3, 4, 5, 6, 7], 2);
    const k = randInt(2, 9);
    return typeIn(`The ratio of cats to dogs at a shelter is ${a}:${b}. There are ${b * k} dogs. How many cats are there?`, a * k, `${b * k} ÷ ${b} = ${k} groups, so the cats number ${k} × ${a} = ${a * k}.`);
  };
  const rateNegative = (): Question => {
    const r = randInt(2, 9);
    const t = randInt(3, 9);
    return typeIn(`A diver's depth changes at a rate of −${r} m per minute (a negative rate means going down). What is the total change in depth after ${t} minutes?`, -r * t, `Multiply the rate by the time: (−${r}) × ${t} = −${r * t}.`, undefined, { keypad: "integer", suffix: "m" });
  };
  const fractionSign = (): Question => {
    const [a, b] = pick([[3, 4], [2, 5], [5, 8], [3, 7], [1, 6], [2, 9]]);
    return textChoice(`Which is equal to −${a}/${b}?`, `${a}/−${b}`, [`−${a}/−${b}`, `${a}/${b}`, `−${b}/${a}`], `One negative sign anywhere in a fraction makes it negative. Two negatives (−${a}/−${b}) cancel and give a positive.`);
  };
  const discount = (): Question => {
    const price = 20 * randInt(2, 10);
    const pct = pick([10, 15, 20, 25, 30, 40, 50]);
    return typeIn(`A jacket costs $${price}. It is ${pct}% off. What is the sale price in dollars?`, (price * (100 - pct)) / 100, `Pay ${100 - pct}% of the price: ${price} × ${100 - pct} ÷ 100 = ${(price * (100 - pct)) / 100}.`);
  };
  return buildSet([unitRate, betterBuy, percentOf, percentChange, ratioPart, rateNegative, fractionSign, discount]);
}

// ---------- Expressions ----------

function expressions9(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const ab = (): [number, number] => {
    const a = randInt(2, d === 1 ? 4 : 6);
    let b = randInt(1, 9);
    while (b === a) b = randInt(1, 9);
    return [a, b];
  };
  const tiles = (): Question => {
    const [a, b] = ab();
    const n = randInt(8, 20);
    return typeIn(`Figure n in a pattern uses ${lin(a, b, "n")} tiles. How many tiles does figure ${n} use?`, a * n + b, `Replace n with ${n}: ${a} × ${n} + ${b} = ${a * n + b}.`);
  };
  const tableExpr = (): Question => {
    const [a, b] = ab();
    const rows = [1, 2, 3, 4].map((n) => [n, a * n + b]);
    return textChoice("Which expression gives the number of tiles in figure n?", lin(a, b, "n"), [lin(b, a, "n"), `${a + b}n`, lin(a, -b, "n")], `The tiles grow by ${a} each figure, so the n-term is ${a}n. Figure 1 has ${a + b} tiles, so add ${b}.`, { type: "table", headers: ["Figure n", "Tiles"], rows });
  };
  const words = (): Question => {
    const [a, b] = ab();
    if (chance2()) {
      return textChoice(`Jay has ${b} more than ${a} times the number of stickers Sam has. If Sam has n stickers, which expression gives the number Jay has?`, lin(a, b, "n"), [lin(b, a, "n"), `${a}(n + ${b})`, `${a + b}n`], `"${a} times" Sam's number is ${a}n. "${b} more" is added after that: ${lin(a, b, "n")}.`);
    }
    return textChoice(`Ana has ${b} fewer than ${a} times the number of cards Leo has. If Leo has n cards, which expression gives the number Ana has?`, lin(a, -b, "n"), [lin(b, -a, "n"), `${a}(n − ${b})`, `${b} − ${a}n`], `"${a} times" Leo's number is ${a}n. "${b} fewer" is taken away after that: ${lin(a, -b, "n")}.`);
  };
  const expand = (): Question => {
    let a = randInt(2, 6), b = randInt(2, 9);
    while (a + b === a * b) {
      a = randInt(2, 6);
      b = randInt(2, 9);
    }
    if (chance2()) {
      return textChoice(`Which expression is equivalent to ${a}(x + ${b})?`, lin(a, a * b), [lin(a, b), lin(1, a * b), lin(a, a + b)], `Multiply both terms inside the brackets by ${a}: ${a} × x = ${a}x and ${a} × ${b} = ${a * b}.`);
    }
    return textChoice(`Which expression is equivalent to ${a}(x − ${b})?`, lin(a, -a * b), [lin(a, -b), lin(1, -a * b), lin(a, -a - b)], `Multiply both terms inside the brackets by ${a}: ${a}x and ${a} × (−${b}) = −${a * b}.`);
  };
  const collect = (): Question => {
    const a = randInt(1, 6), c = randInt(1, 6), b = randInt(1, 9);
    let e = randInt(-9, 9);
    while (e === 0 || b + e === 0) e = randInt(-9, 9);
    const start = `${lin(a, b)} + ${c === 1 ? "x" : `${c}x`} ${e > 0 ? "+" : "−"} ${Math.abs(e)}`;
    return textChoice(`Which expression is equivalent to ${start}?`, lin(a + c, b + e), [lin(a + c, b - e), lin(a + c + 1, b + e), lin(a + c + 1, b - e)], "Add the x-terms together and add the numbers together. Watch the sign of the number.");
  };
  const notEquivalent = (): Question => {
    const a = randInt(2, 4), k = randInt(2, 5);
    const coef = (n: number) => (n === 1 ? "x" : `${n}x`);
    return textChoice(
      `Which expression is NOT equivalent to ${lin(a, a * k)}?`,
      `${a}(x + ${a * k})`,
      [`${a}(x + ${k})`, `x + ${coef(a - 1)} + ${a * k}`, `${a * k} + ${coef(a)}`],
      `Expand each one. ${a}(x + ${k}) = ${lin(a, a * k)}, but ${a}(x + ${a * k}) = ${lin(a, a * a * k)}.`,
    );
  };
  const evaluate = (): Question => {
    const a = randInt(2, 7), b = randInt(-9, 9), v = randInt(3, 12);
    return typeIn(`If n = ${v}, what is the value of ${lin(a, b, "n")}?`, a * v + b, `Replace n with ${v}: ${a} × ${v} ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${a * v + b}.`, undefined, { keypad: "integer" });
  };
  return buildSet([tiles, tableExpr, words, words, expand, collect, notEquivalent, evaluate]);
}

/** A coin flip using the seeded generator. */
function chance2(): boolean {
  return randInt(0, 1) === 1;
}

// ---------- Coding ----------

function coding9(): Question[] {
  const assign = (): Question => {
    const x = randInt(2, 9), m = randInt(2, 5), c = randInt(1, 9);
    return typeIn("What does this code print?", m * x + c, `x is ${x}, so y = ${m} × ${x} + ${c} = ${m * x + c}.`, code([`x = ${x}`, `y = ${m} * x + ${c}`, "print(y)"]));
  };
  const loop = (): Question => {
    const k = randInt(3, 8), s = randInt(2, 9);
    return typeIn("What does this code print?", k * s, `The loop adds ${s} a total of ${k} times: ${k} × ${s} = ${k * s}.`, code(["total = 0", `repeat ${k} times: total = total + ${s}`, "print(total)"]));
  };
  const ifElse = (): Question => {
    const t = randInt(5, 15);
    const x = pick([t - 3, t - 1, t, t + 1, t + 4]);
    const out = x > t ? "big" : "small";
    return textChoice("What does this code print?", out, [out === "big" ? "small" : "big", "Nothing is printed"], `${x} > ${t} is ${x > t ? "true" : "false"}, so the code prints "${out}".`, code([`x = ${x}`, `if x > ${t}: print("big")`, `otherwise: print("small")`]));
  };
  const alterStep = (): Question => {
    const k = randInt(3, 8);
    const s = randInt(2, 6);
    let s2 = randInt(2, 9);
    while (s2 === s) s2 = randInt(2, 9);
    return typeIn(`This code prints ${k * s}. Change the value of step so it prints ${k * s2} instead. What should step be?`, s2, `The loop adds step ${k} times, so ${k} × step = ${k * s2}. Divide: ${k * s2} ÷ ${k} = ${s2}.`, code([`step = ${s}`, "total = 0", `repeat ${k} times: total = total + step`, "print(total)"]));
  };
  const func = (): Question => {
    const a = randInt(2, 9), b = randInt(2, 9);
    if (chance2()) return typeIn("What does this code print?", a * b, `area(${a}, ${b}) returns ${a} × ${b} = ${a * b}.`, code(["define area(w, h): return w * h", `print(area(${a}, ${b}))`]));
    return typeIn("What does this code print?", 2 * (a + b), `perimeter(${a}, ${b}) returns 2 × (${a} + ${b}) = ${2 * (a + b)}.`, code(["define perimeter(w, h): return 2 * (w + h)", `print(perimeter(${a}, ${b}))`]));
  };
  const boolean = (): Question => {
    const x = randInt(3, 12), c = randInt(2, 9), L = randInt(8, 18);
    const out = x + c < L ? "true" : "false";
    return textChoice("What does this code print?", out, [out === "true" ? "false" : "true", "An error"], `${x} + ${c} = ${x + c}, and ${x + c} < ${L} is ${out}.`, code([`x = ${x}`, `print(x + ${c} < ${L})`]));
  };
  const whileLoop = (): Question => {
    const s = randInt(1, 3), m = randInt(2, 3), L = randInt(20, 100);
    let n = s;
    while (n < L) n *= m;
    return typeIn("What does this code print?", n, `Keep multiplying by ${m} until n is ${L} or more. The last value is ${n}.`, code([`n = ${s}`, `while n < ${L}: n = n * ${m}`, "print(n)"]));
  };
  const create = (): Question => {
    const p = randInt(5, 25);
    return textChoice(`Which line of code stores the cost of n tickets that cost $${p} each?`, `cost = ${p} * n`, [`cost = ${p} + n`, `cost = n / ${p}`, `${p} = cost * n`], "Cost is the price times the number of tickets. The variable being created goes on the left of the equals sign.");
  };
  return buildSet([assign, loop, ifElse, alterStep, func, boolean, whileLoop, create]);
}

// ---------- Lines ----------

function lines9(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const slope = (): number => pick([-4, -3, -2, -1, 1, 2, 3, 4]);
  const twoLines = () => {
    const a1 = slope();
    let a2 = slope();
    while (a2 === a1) a2 = slope();
    const x0 = randInt(-4, 4);
    const y0 = randInt(-6, 6);
    return { a1, a2, x0, y0, b1: y0 - a1 * x0, b2: y0 - a2 * x0 };
  };
  const intersect = (): Question => {
    const { a1, a2, x0, y0, b1, b2 } = twoLines();
    const askX = d === 1 || chance2();
    return typeIn(
      `The lines ${line(a1, b1)} and ${line(a2, b2)} meet at one point. What is the ${askX ? "x" : "y"}-coordinate of that point?`,
      askX ? x0 : y0,
      `Set the two expressions equal: ${lin(a1, b1)} = ${lin(a2, b2)}. Solve for x to get x = ${minus(x0)}, then put x back to find y = ${minus(y0)}.`,
      undefined,
      { keypad: "integer" },
    );
  };
  const plans = () => {
    const a1 = pick([5, 10]);
    const a2 = a1 + pick([5, 10]);
    const m0 = randInt(2, 8);
    const b2 = pick([0, 10, 20]);
    const b1 = b2 + (a2 - a1) * m0;
    return { a1, a2, b1, b2, m0, cost: b1 + a1 * m0 };
  };
  const context = (): Question => {
    const { a1, a2, b1, b2, m0 } = plans();
    const second = b2 === 0 ? `Plan B has no joining fee and costs $${a2} per month` : `Plan B costs $${b2} to join plus $${a2} per month`;
    return typeIn(`Plan A costs $${b1} to join plus $${a1} per month. ${second}. After how many months do the two plans cost the same?`, m0, `Total cost: A = ${b1} + ${a1}m and B = ${b2} + ${a2}m. Set them equal and solve for m.`);
  };
  const meaning = (): Question => {
    const { a1, a2, b1, b2, m0, cost } = plans();
    return textChoice(
      `Plan A is ${line(a1, b1)} and Plan B is ${line(a2, b2)}, where x is months and y is total cost in dollars. The lines meet at (${m0}, ${cost}). What does this point mean?`,
      `After ${m0} months both plans cost $${cost}`,
      [`After ${cost} months both plans cost $${m0}`, `Plan A costs $${m0} and Plan B costs $${cost}`, `Both plans cost $${cost} per month`],
      "The first number in a point is x (months) and the second is y (total cost). A point where the lines meet is where both plans cost the same.",
    );
  };
  const horizVert = (): Question => {
    const k = pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7]);
    if (chance2()) {
      return textChoice(`Which describes the graph of x = ${minus(k)}?`, `A vertical line through (${minus(k)}, 0)`, [`A horizontal line through (0, ${minus(k)})`, `A vertical line through (0, ${minus(k)})`, `A line through the origin with slope ${minus(k)}`], "x = k means every point has the same x-value, so the line goes straight up and down through that x on the x-axis.");
    }
    return textChoice(`Which describes the graph of y = ${minus(k)}?`, `A horizontal line through (0, ${minus(k)})`, [`A vertical line through (${minus(k)}, 0)`, `A horizontal line through (${minus(k)}, 0)`, `A line through the origin with slope ${minus(k)}`], "y = k means every point has the same y-value, so the line runs flat across through that y on the y-axis.");
  };
  const intercept = (): Question => {
    const a = randInt(2, 6), b = randInt(2, 6);
    const k = lcm(a, b) * randInt(1, 3);
    const xInt = chance2();
    return typeIn(
      `What is the ${xInt ? "x" : "y"}-intercept of the line ${a}x + ${b}y = ${k}?`,
      xInt ? k / a : k / b,
      xInt ? `On the x-axis y = 0, so ${a}x = ${k} and x = ${k / a}.` : `On the y-axis x = 0, so ${b}y = ${k} and y = ${k / b}.`,
    );
  };
  const inequality = (): Question => {
    const a = pick([-3, -2, -1, 1, 2, 3]), b = randInt(-5, 5);
    const greater = chance2();
    const xs = sample([-3, -2, -1, 0, 1, 2, 3, 4], 4);
    const onLine = (x: number) => a * x + b;
    const side = greater ? 1 : -1;
    const pt = (x: number, y: number) => `(${minus(x)}, ${minus(y)})`;
    const right = pt(xs[0], onLine(xs[0]) + side * randInt(1, 4));
    const wrong = [pt(xs[1], onLine(xs[1])), pt(xs[2], onLine(xs[2]) - side * randInt(1, 4)), pt(xs[3], onLine(xs[3]) - side * randInt(1, 4))];
    return textChoice(`Which point is in the region ${greater ? "y >" : "y <"} ${lin(a, b)}?`, right, wrong, `Put each point into the inequality. A point on the line is not included because the sign is strict, and the other side of the line is the wrong region.`);
  };
  const translate = (): Question => {
    const a = pick([-4, -3, -2, 2, 3, 4]);
    const k = randInt(2, 5);
    if (chance2()) {
      return textChoice(`The line ${line(a, 0)} is translated ${k} units up. What is its new equation?`, line(a, k), [line(a, -k), line(a, a * k), line(a + k, 0)], "Moving a line up adds the same amount to every y-value, so the number added at the end is the shift.");
    }
    return textChoice(`The line ${line(a, 0)} is translated ${k} units to the right. What is its new equation?`, line(a, -a * k), [line(a, a * k), line(a, k), line(a, -k)], `Every point moves ${k} to the right: replace x with (x − ${k}), so y = ${a < 0 ? `−${-a}` : a}(x − ${k}).`);
  };
  const reflect = (): Question => {
    const a = randInt(2, 5);
    const kind = pick(["x-axis", "y-axis", "turn", "half"]);
    if (kind === "x-axis" || kind === "y-axis") {
      return textChoice(`The line y = ${a}x is reflected in the ${kind}. What is the equation of the image?`, `y = −${a}x`, [`y = ${a}x`, `y = x/${a}`, `y = −x/${a}`], "A reflection in either axis flips the sign of the slope but the line still passes through the origin.");
    }
    if (kind === "turn") {
      return textChoice(`The line y = ${a}x is rotated 90° about the origin. What is the equation of the image?`, `y = −x/${a}`, [`y = x/${a}`, `y = −${a}x`, `y = ${a}x`], "After a quarter turn, the new slope is the negative reciprocal of the old slope.");
    }
    return textChoice(`The line y = ${a}x is rotated 180° about the origin. What happens?`, "It lands on itself: the same line", [`y = −${a}x`, `y = x/${a}`, `y = ${a}x + 1`], "A half turn about the origin sends each point (x, y) to (−x, −y), which is on the same line through the origin.");
  };
  return buildSet([intersect, context, meaning, horizVert, intercept, inequality, translate, reflect]);
}

// ---------- Data ----------

const DATA_BANK: BankItem[] = [
  { prompt: "In a box plot, what does the box show?", right: "The middle 50% of the data, from Q1 to Q3", wrong: ["All of the data from least to greatest", "The lowest 25% of the data", "Only the median"], hint: "The box stretches from the first quartile (Q1) to the third quartile (Q3)." },
  { prompt: "As the number of hours of study goes up, test marks tend to go up too. What kind of correlation is this?", right: "Positive correlation", wrong: ["Negative correlation", "No correlation", "A perfect fraction"], hint: "When both variables increase together, the scatter plot rises from left to right." },
  { prompt: "As the outdoor temperature falls in winter, the heating bill tends to rise. What kind of correlation is this?", right: "Negative correlation", wrong: ["Positive correlation", "No correlation", "A perfect correlation"], hint: "One variable rises while the other falls, so the points slope downward from left to right." },
  { prompt: "Shoe size and test marks for a class are plotted. The points look scattered with no pattern. What does that suggest?", right: "There is little or no correlation", wrong: ["A strong positive correlation", "A strong negative correlation", "The data must be wrong"], hint: "Without a visible trend in the points, the variables are not related." },
  { prompt: "A correlation coefficient is r = −0.92. What does it tell you?", right: "A strong negative correlation", wrong: ["A strong positive correlation", "A weak negative correlation", "No correlation"], hint: "A value close to −1 means a strong negative relationship, and a value close to 0 means a weak one." },
  { prompt: "Ice cream sales and sunburn cases both rise in July. What is the best explanation?", right: "Hot weather affects both, so one does not cause the other", wrong: ["Ice cream causes sunburn", "Sunburn makes people buy ice cream", "The data must be wrong"], hint: "Two variables can move together because a third factor drives both. Correlation is not causation." },
  { prompt: "A line of best fit is used to…", right: "Describe the trend and predict values", wrong: ["Join every point exactly", "Make the data larger", "Prove one variable causes the other"], hint: "The line models the overall trend. It need not pass through every point." },
  { prompt: "A fitness app stores a user's location every minute for years. Which is a possible consequence?", right: "Private information could be misused if it is shared without permission", wrong: ["The data can never be wrong", "Nobody can learn anything from it", "It uses no storage space"], hint: "Large amounts of personal data raise privacy and safety concerns when it is collected, stored and shared." },
  { prompt: "On a box plot, the median line is much closer to Q1 than to Q3. What does this tell you?", right: "The data between the median and Q3 is more spread out than the data between Q1 and the median", wrong: ["The data between Q1 and the median is more spread out", "There are no values below the median", "The mean must equal the median"], hint: "A longer part of the box means those values are spread over a wider range." },
  { prompt: "Which type of graph shows the relationship between two numerical variables?", right: "A scatter plot", wrong: ["A circle graph", "A pictograph", "A bar graph of one variable"], hint: "A scatter plot puts one variable on each axis and a dot for every pair of values." },
];

function data9(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const dataset = () => {
    const v: number[] = [randInt(10, 40)];
    for (let i = 1; i < 8; i++) v.push(v[i - 1] + pick([2, 4, 6]));
    const shown = d === 1 ? v : shuffle(v);
    const q1 = (v[1] + v[2]) / 2;
    const q3 = (v[5] + v[6]) / 2;
    const median = (v[3] + v[4]) / 2;
    return { v, text: shown.join(", "), q1, q3, median };
  };
  const ctx = "Eight students recorded the minutes they read last night:";
  const median = (): Question => {
    const s = dataset();
    return typeIn(`${ctx} ${s.text}. What is the median?`, s.median, `Put the values in order. With 8 values, the median is the mean of the 4th and 5th: (${s.v[3]} + ${s.v[4]}) ÷ 2 = ${s.median}.`);
  };
  const q1 = (): Question => {
    const s = dataset();
    return typeIn(`${ctx} ${s.text}. What is the first quartile, Q1?`, s.q1, `Q1 is the median of the lower half (${s.v.slice(0, 4).join(", ")}): (${s.v[1]} + ${s.v[2]}) ÷ 2 = ${s.q1}.`);
  };
  const iqr = (): Question => {
    const s = dataset();
    return typeIn(`${ctx} ${s.text}. What is the interquartile range (Q3 − Q1)?`, s.q3 - s.q1, `Q1 = ${s.q1} and Q3 = ${s.q3} (the medians of the lower and upper halves). Subtract: ${s.q3} − ${s.q1} = ${s.q3 - s.q1}.`);
  };
  const predict = (): Question => {
    const a = pick([2, 3, 4, 5]), b = randInt(5, 30), x = randInt(2, 12);
    return typeIn(`A line of best fit for hours of practice (x) and score (y) is y = ${a}x + ${b}. What score does the model predict after ${x} hours?`, a * x + b, `Substitute x = ${x}: y = ${a} × ${x} + ${b} = ${a * x + b}.`);
  };
  return shuffle([...buildSet([median, q1, iqr, predict]), ...fromBank(DATA_BANK, 4)]);
}

// ---------- Geometry ----------

const TRIPLES: [number, number, number][] = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];

function triple(): [number, number, number] {
  const [a, b, c] = pick(TRIPLES);
  const k = c > 20 ? 1 : randInt(1, 3);
  return [a * k, b * k, c * k];
}

function geometry9(): Question[] {
  const hyp = (): Question => {
    const [a, b, c] = triple();
    return typeIn(`A ramp has a horizontal run of ${a} m and a rise of ${b} m. How long is the sloping surface, in metres?`, c, `Use a² + b² = c²: ${a * a} + ${b * b} = ${c * c}, so c = ${c}.`, undefined, { suffix: "m" });
  };
  const leg = (): Question => {
    const [a, b, c] = triple();
    return typeIn(`A ${c} m ladder leans on a wall with its foot ${a} m from the wall. How high up the wall does it reach, in metres?`, b, `Use a² + b² = c²: ${a * a} + b² = ${c * c}, so b² = ${b * b} and b = ${b}.`, undefined, { suffix: "m" });
  };
  const rightCheck = (): Question => {
    const [a, b, c] = triple();
    const isRight = chance2();
    const side = isRight ? c : c + 1;
    return textChoice(
      `A triangle has sides ${a} cm, ${b} cm and ${side} cm. Is it a right triangle?`,
      isRight ? "Yes, it is a right triangle" : "No, it is not a right triangle",
      [isRight ? "No, it is not a right triangle" : "Yes, it is a right triangle"],
      `Check whether ${a}² + ${b}² equals ${side}²: ${a * a} + ${b * b} = ${a * a + b * b} and ${side}² = ${side * side}.`,
    );
  };
  const diagonalOrRoof = (): Question => {
    const [a, b, c] = triple();
    if (chance2()) return typeIn(`A rectangular field is ${a} m by ${b} m. How long is its diagonal, in metres?`, c, `The diagonal is the hypotenuse of a right triangle: √(${a * a} + ${b * b}) = ${c}.`, undefined, { suffix: "m" });
    return typeIn(`The end of a roof is an isosceles triangle with a base of ${2 * a} m and two equal sloping sides of ${c} m. How tall is it, in metres?`, b, `Split the triangle in half: a right triangle with hypotenuse ${c} and base ${a}. The height is √(${c * c} − ${a * a}) = ${b}.`, undefined, { suffix: "m" });
  };
  const factor = (): Question => {
    const k = randInt(2, 4);
    const options: [string, number, string][] = [
      [`Every side of a square is multiplied by ${k}. By what factor does the area change?`, k * k, "Area depends on length × length, so the factor is squared."],
      [`Every edge of a cube is multiplied by ${k}. By what factor does the volume change?`, k ** 3, "Volume depends on length × width × height, so the factor is cubed."],
      [`Every edge of a cube is multiplied by ${k}. By what factor does the surface area change?`, k * k, "Surface area is made of squares, so the factor is squared."],
      [`The radius of a circle is multiplied by ${k}. By what factor does the circumference change?`, k, "Circumference = 2πr, which grows in step with r."],
      [`The radius of a circle is multiplied by ${k}. By what factor does the area change?`, k * k, "Area = πr², so the factor is squared."],
      [`Every side of a rectangle is multiplied by ${k}. By what factor does the perimeter change?`, k, "Perimeter adds lengths, so it grows by the same factor."],
    ];
    const [prompt, answer, hint] = pick(options);
    return typeIn(prompt, answer, hint, undefined, { suffix: "times" });
  };
  const areaChange = (): Question => {
    const w = randInt(2, 9), h = randInt(2, 9), k = randInt(2, 4);
    return typeIn(`A rectangle is ${w} cm by ${h} cm. Its width is multiplied by ${k}, and its height stays the same. What is the new area, in cm²?`, w * k * h, `New width = ${w * k} cm. Area = ${w * k} × ${h} = ${w * k * h}.`, undefined, { suffix: "cm²" });
  };
  const angles = (): Question => {
    const choice = randInt(0, 2);
    if (choice === 0) return typeIn("An angle drawn from the two ends of a circle's diameter to any point on the circle measures how many degrees?", 90, "An angle in a semicircle is always a right angle.", undefined, { suffix: "°" });
    if (choice === 1) {
      const apex = pick([20, 30, 40, 50, 60, 80, 100]);
      return typeIn(`An isosceles triangle has an apex angle of ${apex}°. How big is each of the two equal base angles?`, (180 - apex) / 2, `The angles add to 180°. (180 − ${apex}) ÷ 2 = ${(180 - apex) / 2}.`, undefined, { suffix: "°" });
    }
    const x = randInt(30, 70), y = randInt(30, 70);
    return typeIn(`Two angles of a triangle measure ${x}° and ${y}°. How big is the third angle?`, 180 - x - y, `Angles in a triangle add to 180°: 180 − ${x} − ${y} = ${180 - x - y}.`, undefined, { suffix: "°" });
  };
  return buildSet([hyp, leg, rightCheck, diagonalOrRoof, factor, factor, areaChange, angles]);
}

// ---------- Volume and units ----------

function volume9(): Question[] {
  const prismPyramid = (): Question => {
    const p = 5 * randInt(2, 16);
    if (chance2()) return typeIn(`A pyramid and a prism have the same base and the same height. The pyramid's volume is ${p} cm³. What is the prism's volume, in cm³?`, 3 * p, "A pyramid holds one third of the prism with the same base and height, so the prism holds 3 times as much.", undefined, { suffix: "cm³" });
    return typeIn(`A prism and a pyramid have the same base and the same height. The prism's volume is ${3 * p} cm³. What is the pyramid's volume, in cm³?`, p, `A pyramid is one third of the prism: ${3 * p} ÷ 3 = ${p}.`, undefined, { suffix: "cm³" });
  };
  const cylinderCone = (): Question => {
    const n = randInt(5, 60);
    if (chance2()) return typeIn(`A cylinder and a cone have the same base and the same height. The cylinder holds ${3 * n} cm³. How much does the cone hold, in cm³?`, n, `A cone is one third of the cylinder: ${3 * n} ÷ 3 = ${n}.`, undefined, { suffix: "cm³" });
    return typeIn(`A cone and a cylinder have the same base and the same height. The cone holds ${n} cm³. How much does the cylinder hold, in cm³?`, 3 * n, `The cylinder holds 3 times as much as the cone: 3 × ${n} = ${3 * n}.`, undefined, { suffix: "cm³" });
  };
  const pyramid = (): Question => {
    const b = randInt(3, 9), h = 3 * randInt(1, 4);
    return typeIn(`A pyramid has a square base ${b} m by ${b} m and a height of ${h} m. What is its volume, in m³?`, (b * b * h) / 3, `V = (base area × height) ÷ 3 = (${b * b} × ${h}) ÷ 3 = ${(b * b * h) / 3}.`, undefined, { suffix: "m³" });
  };
  const cone = (): Question => {
    const r = randInt(2, 6), h = 3 * randInt(1, 4);
    return typeIn(`A cone has a radius of ${r} cm and a height of ${h} cm. Its volume is how many π cm³? (V = 1/3 × π × r² × h)`, (r * r * h) / 3, `r² × h ÷ 3 = ${r * r} × ${h} ÷ 3 = ${(r * r * h) / 3}.`, undefined, { suffix: "π cm³" });
  };
  const si = (): Question => {
    const rel = pick([
      { from: "L", to: "mL", f: 1000, rule: "1 L = 1000 mL" },
      { from: "km", to: "m", f: 1000, rule: "1 km = 1000 m" },
      { from: "kg", to: "g", f: 1000, rule: "1 kg = 1000 g" },
      { from: "m³", to: "L", f: 1000, rule: "1 m³ = 1000 L" },
      { from: "m", to: "cm", f: 100, rule: "1 m = 100 cm" },
      { from: "cm³", to: "mL", f: 1, rule: "1 cm³ = 1 mL" },
    ]);
    const n = randInt(2, 48);
    return typeIn(`How many ${rel.to} is ${n} ${rel.from}?`, n * rel.f, `${rel.rule}, so ${n} × ${rel.f} = ${n * rel.f}.`, undefined, { suffix: rel.to });
  };
  const systems = (): Question => {
    const opts = [
      { prompt: (n: number) => `A trail is ${n} miles long. About how many kilometres is that? (1 mile ≈ 1.6 km)`, f: 1.6, n: [5, 10, 15, 20, 25, 30], suffix: "km" },
      { prompt: (n: number) => `A board is ${n} inches long. About how many centimetres is that? (1 inch = 2.54 cm)`, f: 2.54, n: [10, 20, 30, 50], suffix: "cm" },
      { prompt: (n: number) => `A bag weighs ${n} kg. About how many pounds is that? (1 kg ≈ 2.2 lb)`, f: 2.2, n: [5, 10, 15, 20], suffix: "lb" },
    ];
    const o = pick(opts);
    const n = pick(o.n);
    const ans = Math.round(n * o.f * 100) / 100;
    return typeIn(o.prompt(n), ans, `Multiply by the conversion factor: ${n} × ${o.f} = ${ans}.`, undefined, { keypad: "decimal", suffix: o.suffix });
  };
  const glasses = (): Question => {
    const glass = pick([125, 250, 500]);
    const litres = randInt(1, 5);
    return typeIn(`How many ${glass} mL glasses can be filled from a ${litres} L jug?`, (litres * 1000) / glass, `${litres} L = ${litres * 1000} mL, and ${litres * 1000} ÷ ${glass} = ${(litres * 1000) / glass}.`);
  };
  return buildSet([prismPyramid, cylinderCone, pyramid, cone, si, si, systems, glasses]);
}

// ---------- Financial literacy ----------

const LOAN_BANK: BankItem[] = [
  { prompt: "Two loans have the same interest rate and the same amount. One is repaid over 2 years and one over 4 years. Which costs more in total interest?", right: "The 4-year loan", wrong: ["The 2-year loan", "They cost the same", "It depends only on the first payment"], hint: "Interest is charged for longer on money you still owe, so a longer loan costs more in total." },
  { prompt: "A buyer makes a larger down payment on a car. What is the effect?", right: "Less money is borrowed, so less interest is paid", wrong: ["More money is borrowed", "The interest rate must go up", "The total cost always doubles"], hint: "The down payment is paid up front, so the amount you borrow and pay interest on is smaller." },
  { prompt: "Which loan has the lowest total cost, if everything else is equal?", right: "The one with the lowest interest rate", wrong: ["The one with the highest interest rate", "The one with the longest time to repay", "The one with the smallest down payment"], hint: "A lower rate, a shorter time and a bigger down payment each reduce what you pay in interest." },
  { prompt: "Why might you compare the total cost of two loans instead of only the monthly payment?", right: "A lower monthly payment over a longer time can cost more in total", wrong: ["Monthly payments are never important", "Longer loans always cost less", "The total cost never changes"], hint: "Stretching payments out lowers each payment but adds more interest overall." },
];

function finance9(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const decimalAnswer = (cents: number) => {
    const dollarsText = (cents / 100).toFixed(2);
    return { answer: dollarsText.endsWith("00") ? dollarsText.slice(0, -3) : dollarsText.endsWith("0") ? dollarsText.slice(0, -1) : dollarsText, accept: [dollarsText] };
  };
  const depreciate = (): Question => {
    const pct = pick([10, 20, 50]);
    const v = pick([400, 800, 1000, 2000]);
    const after2 = (v * (100 - pct) * (100 - pct)) / 10000;
    return typeIn(`A ${dollars(v)} item loses ${pct}% of its value each year. What is it worth after 2 years, in dollars?`, after2, `Year 1: ${v} × ${(100 - pct) / 100} = ${(v * (100 - pct)) / 100}. Year 2: multiply by ${(100 - pct) / 100} again to get ${after2}.`);
  };
  const appreciate = (): Question => {
    const start = 100 * randInt(2, 10);
    const per = 25 * randInt(1, 4);
    const years = randInt(3, 8);
    return typeIn(`A painting bought for $${start} gains $${per} in value each year. What is it worth after ${years} years, in dollars?`, start + per * years, `Gain: ${per} × ${years} = ${per * years}. Add to the start: ${start} + ${per * years} = ${start + per * years}.`);
  };
  const tableDirection = (): Question => {
    const up = chance2();
    const start = 100 * randInt(8, 15);
    const step = 50 * randInt(1, 4);
    const rows = [0, 1, 2, 3].map((y) => [y, `$${start + (up ? 1 : -1) * step * y}`]);
    const right = up ? "Appreciation: the value is growing" : "Depreciation: the value is shrinking";
    return textChoice("What does this table of values show?", right, [up ? "Depreciation: the value is shrinking" : "Appreciation: the value is growing", "Neither: the value stays the same"], "Appreciation means the value goes up over time; depreciation means it goes down.", { type: "table", title: "Value over time", headers: ["Year", "Value"], rows });
  };
  const graphRate = (): Question => {
    const loss = 500 * randInt(2, 6);
    const years = randInt(2, 5);
    const start = 20000;
    return say(typeIn(`On a graph, a car's value falls from ${dollars(start)} at year 0 to ${dollars(start - loss * years)} at year ${years}. How many dollars does it lose per year on average?`, loss, `Change in value ÷ change in time = ${spaced(loss * years)} ÷ ${years} = ${loss}.`));
  };
  const interest = (): Question => {
    const P = pick([500, 1000, 2000, 5000]);
    const r = pick([2, 4, 5, 10]);
    const t = randInt(2, 4);
    if (chance2() || d === 1) {
      return typeIn(`You borrow ${dollars(P)} at ${r}% simple interest per year for ${t} years. How much interest do you pay, in dollars?`, (P * r * t) / 100, `Simple interest = principal × rate × time = ${P} × ${r / 100} × ${t} = ${(P * r * t) / 100}.`);
    }
    return typeIn(`You invest ${dollars(1000)} at 10% interest per year, compounded annually. How much is it worth after 2 years, in dollars?`, 1210, "Year 1: 1000 × 1.10 = 1100. Year 2: 1100 × 1.10 = 1210. The interest earns interest.");
  };
  const compare = (): Question => {
    const P = pick([1000, 2000, 5000]);
    const r = pick([5, 10]);
    const diff = (P * r * r) / 10000;
    const diffCents = Math.round(diff * 100);
    const simple = (P * r * 2) / 100;
    return textChoice(
      `You borrow ${dollars(P)} for 2 years at ${r}% per year. Which way of charging interest costs more, and by how much?`,
      `Compound interest, by ${money(diffCents)}`,
      [`Simple interest, by ${money(diffCents)}`, "They cost the same", `Compound interest, by ${money(diffCents * 2)}`],
      `Simple interest is $${simple} (the same each year). Compound interest also charges interest on last year's interest, so it costs ${money(diffCents)} more over 2 years.`,
    );
  };
  const loanBank = (): Question => fromBank(LOAN_BANK, 1)[0];
  const budget = (): Question => {
    const income = 100 * randInt(20, 30);
    const rent = 50 * randInt(12, 18);
    const food = 50 * randInt(5, 8);
    const fun = 50 * randInt(3, 6);
    const savings = income - rent - food - fun;
    const rise = 50 * randInt(1, Math.min(3, Math.floor(savings / 50)));
    const cut = 50 * randInt(1, Math.min(2, Math.floor(fun / 50)));
    return typeIn(
      `Rent rises by $${rise}, and the entertainment budget is cut by $${cut}. Income stays the same and everything else is unchanged. How much is left for savings now, in dollars?`,
      savings - rise + cut,
      `Savings is what remains of income. The change: ${savings} − ${rise} + ${cut} = ${savings - rise + cut}.`,
      { type: "table", title: "Monthly budget", headers: ["Item", "Dollars"], rows: [["Income", income], ["Rent", rent], ["Food", food], ["Entertainment", fun], ["Savings", savings]] },
    );
  };
  const hst = (): Question => {
    const price = 5 * randInt(4, 40);
    const cents = price * 113;
    const { answer, accept } = decimalAnswer(cents);
    return typeIn(`An item costs $${price} before tax. What is the total with 13% HST, in dollars?`, answer, `Pay 113% of the price: ${price} × 1.13 = ${(cents / 100).toFixed(2)}.`, undefined, { keypad: "decimal", accept: accept.filter((a) => a !== answer) });
  };
  return buildSet([depreciate, appreciate, tableDirection, graphRate, interest, compare, () => pick([loanBank, budget])(), hst]);
}

export const units: Unit[] = [
  {
    id: "number-sets-9",
    title: "Number Sets",
    emoji: "🔢",
    blurb: "Whole, rational and irrational",
    standards: on("B1.2, B1.3", "subsets of the number system, density, infinity and limits"),
    parentNote: "Natural numbers, whole numbers, integers, rational and irrational numbers, how they fit inside each other, and why there are always more numbers between any two rational numbers.",
    generate: numberSets,
  },
  {
    id: "powers-9",
    title: "Powers & Scientific Notation",
    emoji: "🔭",
    blurb: "Zero, negative exponents and big numbers",
    standards: on("B2.1", "the sign and size of an exponent, and scientific notation"),
    parentNote: "Patterns that show why a power to the zero is 1 and a negative exponent makes a reciprocal, and writing very large and very small numbers in scientific notation.",
    generate: powers9,
  },
  {
    id: "rates-percents-9",
    title: "Rates & Percents",
    emoji: "🏷️",
    blurb: "Unit rates, discounts and proportions",
    standards: on("B3.3, B3.5", "rates, percentages and proportions, and the effect of negative signs"),
    parentNote: "Unit rates and best buys, percent of an amount, percent increase and decrease, proportions in ratios, and negative rates such as a diver going down.",
    generate: ratesPercents,
  },
  {
    id: "expressions-9",
    title: "Expressions",
    emoji: "✏️",
    blurb: "Build, compare and match",
    standards: on("C1.2, C1.3, C1.4", "creating algebraic expressions and finding equivalent ones"),
    parentNote: "Writing an expression for a pattern or a sentence, deciding which expressions are equivalent, expanding brackets, and collecting like terms.",
    generate: expressions9,
  },
  {
    id: "coding-9",
    title: "Code Reader",
    emoji: "💻",
    blurb: "Predict what the code does",
    standards: on("C2.1, C2.2, C2.3", "reading and altering code with variables, equations and inequalities"),
    parentNote: "Reading short programs with variables, loops, if statements and functions, predicting the output, and changing a parameter to get a new result. No typing is needed; the code is written in plain pseudocode.",
    generate: coding9,
  },
  {
    id: "lines-9",
    title: "Lines & Intersections",
    emoji: "📉",
    blurb: "Graphs, inequalities and transformations",
    standards: on("C3.3, C4.2, C4.3", "comparing linear relations, graphing equations and inequalities, and transforming lines"),
    parentNote: "Finding where two lines meet and what it means in a story, graphing x = k, y = k and ax + by = k, regions of an inequality, and translating, reflecting and rotating lines through the origin.",
    generate: lines9,
  },
  {
    id: "data-9",
    title: "Data & Scatter Plots",
    emoji: "📊",
    blurb: "Quartiles, box plots and correlation",
    standards: on("D1.1, D1.2, D1.3", "quartiles and box plots, scatter plots, correlation and lines of best fit"),
    parentNote: "Finding the median and quartiles of a data set, reading a box plot, telling positive, negative and no correlation apart, and using a line of best fit to make predictions. Correlation does not prove one thing causes another.",
    generate: data9,
  },
  {
    id: "geometry-9",
    title: "Right Triangles & Scaling",
    emoji: "📐",
    blurb: "Pythagoras and changing dimensions",
    standards: on("E1.2, E1.4, E1.5", "triangle and circle properties, the right-triangle relationship, and how scaling affects measures"),
    parentNote: "Using the Pythagorean relationship for ladders, ramps, roofs and diagonals, deciding whether a triangle is right-angled, and seeing how doubling or tripling dimensions changes perimeter, area and volume.",
    generate: geometry9,
  },
  {
    id: "volume-units-9",
    title: "Volume & Units",
    emoji: "🧊",
    blurb: "Pyramids, cones and conversions",
    standards: on("E1.3, E1.6", "volume of pyramids and cones, and converting units within and between systems"),
    parentNote: "A pyramid holds a third of the matching prism and a cone a third of the matching cylinder, plus converting between metric units and between metric and imperial units.",
    generate: volume9,
  },
  {
    id: "finance-9",
    title: "Money Decisions",
    emoji: "💰",
    blurb: "Value, interest and budgets",
    standards: on("F1.1, F1.2, F1.3, F1.4", "appreciation and depreciation, borrowing costs, interest and changing a budget"),
    parentNote: "Items that gain or lose value over time, simple and compound interest, how rate, time and down payments change the cost of borrowing, adjusting a budget, and adding 13% HST.",
    generate: finance9,
  },
];
