import { pick, randInt, sample, shuffle, textChoice } from "../random";
import type { GenerateOptions, Question, Unit, Visual } from "../types";
import { buildSet, levelOf, on, others, numQ, range, typeIn } from "./kit";

// Ontario Grade 6 mathematics (2020 curriculum). Whole numbers go up to a million, decimals to thousandths,
// and integers appear for the first time.

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
const dec = (n: number): string => String(Math.round(n * 1000) / 1000);
const money = (n: number): string => `$${(Math.round(n * 100) / 100).toFixed(2)}`;
/** Integers with a real minus sign. */
const int = (n: number): string => (n < 0 ? `−${Math.abs(n)}` : String(n));

/** "5/6", "1 1/4" or "2" for a fraction in lowest terms. */
function frac(n: number, d: number): string {
  const g = gcd(n, d);
  const a = n / g;
  const b = d / g;
  if (b === 1) return String(a);
  if (a > b) return `${Math.floor(a / b)} ${a % b}/${b}`;
  return `${a}/${b}`;
}

// ---------- Integers and decimals ----------

function numbers6(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const onLine = (): Question => {
    const v = randInt(-8, 8);
    const wrong = others(range(-9, 9), v, 2).map(int);
    return textChoice("Which integer belongs at the ? on the number line?", int(v), wrong, "Numbers to the right of 0 are positive. Numbers to the left are negative.", { type: "numberLine", min: -10, max: 10, step: 1, blankAt: v, labelEvery: 2 });
  };
  const compareInt = (): Question => {
    const [a, b] = sample(range(-12, 12), 2);
    const big = Math.max(a, b);
    const small = Math.min(a, b);
    return textChoice(`Which is greater, ${int(a)} or ${int(b)}?`, int(big), [int(small)], "On a number line, the number farther to the right is greater.");
  };
  const orderInt = (): Question => {
    const nums = sample(range(-9, 9), 4).sort((x, y) => x - y);
    return { kind: "order", prompt: "Tap the integers from least to greatest.", hint: "Negative numbers are less than zero. The farther below zero, the smaller the number.", items: nums.map((n) => ({ id: String(n), label: int(n) })) };
  };
  const context = (): Question => {
    const n = randInt(2, 30);
    const cases = [
      { t: `A diver is ${n} m below sea level. Which integer shows this?`, a: int(-n), w: [String(n), "0"] },
      { t: `The temperature is ${n} degrees below zero. Which integer shows this?`, a: int(-n), w: [String(n), String(n + 1)] },
      { t: `A bank account is overdrawn by $${n}. Which integer shows this?`, a: int(-n), w: [String(n), int(-n - 1)] },
    ];
    const c = pick(cases);
    return textChoice(c.t, c.a, c.w, "Below zero, owing and losing are shown with negative integers.");
  };
  const place = (): Question => {
    const digits = sample(range(1, 9), 4);
    const text = `${digits[0]}.${digits[1]}${digits[2]}${digits[3]}`;
    const names = ["tenths", "hundredths", "thousandths"];
    const pos = randInt(0, 2);
    return textChoice(`In ${text}, which place is the digit ${digits[pos + 1]} in?`, names[pos], others(names, names[pos], 2), "The first digit after the decimal point is tenths, then hundredths, then thousandths.");
  };
  const orderDec = (): Question => {
    const nums = sample(range(1, 999), 4).sort((a, b) => a - b);
    return { kind: "order", prompt: "Tap the decimals from least to greatest.", hint: "Line up the decimal points. Compare tenths, then hundredths, then thousandths.", items: nums.map((n) => ({ id: String(n), label: (n / 1000).toFixed(3) })) };
  };
  const round = (): Question => {
    let t = randInt(1001, 9989);
    while (t % 10 === 5 || t % 10 === 0) t = randInt(1001, 9989);
    const kind = pick(["tenth", "hundredth", "whole number"]);
    const places = kind === "tenth" ? 1 : kind === "hundredth" ? 2 : 0;
    const unit = 10 ** (3 - places);
    const floor = Math.floor(t / unit);
    const roundedUp = (t % unit) * 2 > unit;
    const rounded = roundedUp ? floor + 1 : floor;
    const fmt = (k: number) => ((k * unit) / 1000).toFixed(places);
    const neighbour = roundedUp ? floor : floor + 1;
    const beyond = roundedUp ? rounded + 1 : Math.max(0, rounded - 1);
    return textChoice(`Round ${(t / 1000).toFixed(3)} to the nearest ${kind}.`, fmt(rounded), [...new Set([fmt(neighbour), fmt(beyond)])].filter((w) => w !== fmt(rounded)), "Look at the digit just after the place you are rounding to. 5 or more, round up.");
  };
  const repeating = (): Question => {
    const cases = [
      { f: "1/3", w: "0.333…", t: "0.3", h: "0.33", altT: "0.4", altH: "0.34" },
      { f: "2/3", w: "0.666…", t: "0.7", h: "0.67", altT: "0.6", altH: "0.66" },
      { f: "1/6", w: "0.1666…", t: "0.2", h: "0.17", altT: "0.1", altH: "0.16" },
      { f: "5/6", w: "0.8333…", t: "0.8", h: "0.83", altT: "0.9", altH: "0.84" },
    ];
    const c = pick(cases);
    return pick([
      () => textChoice(`${c.f} as a decimal is ${c.w} Round it to the nearest hundredth.`, c.h, [c.t, c.altH], "Look at the third decimal place to decide how to round."),
      () => textChoice(`${c.f} as a decimal is ${c.w} Round it to the nearest tenth.`, c.t, [c.altT, c.h], "Look at the hundredths digit to decide how to round the tenths."),
    ])();
  };
  const equiv = (): Question => {
    const cases = [
      { f: "1/8", d: "0.125" },
      { f: "3/8", d: "0.375" },
      { f: "5/8", d: "0.625" },
      { f: "7/8", d: "0.875" },
      { f: "1/4", d: "0.25" },
      { f: "3/5", d: "0.6" },
      { f: "1/2", d: "0.5" },
      { f: "3/4", d: "0.75" },
    ];
    const c = pick(cases);
    const ws = sample(cases.filter((x) => x !== c), 2);
    return pick([
      () => textChoice(`Which decimal is equal to ${c.f}?`, c.d, ws.map((x) => x.d), "Divide the top by the bottom.", { type: "equation", text: c.f }),
      () => textChoice(`Which fraction is equal to ${c.d}?`, c.f, ws.map((x) => x.f), "Think of the decimal as tenths, hundredths or thousandths, then simplify.", { type: "equation", text: c.d }),
    ])();
  };
  const combo = (): Question => {
    for (;;) {
      const vals = sample(
        [
          { l: "0.7", v: 0.7 },
          { l: "3/5", v: 0.6 },
          { l: "3/4", v: 0.75 },
          { l: "0.65", v: 0.65 },
          { l: "7/10", v: 0.7 },
          { l: "0.8", v: 0.8 },
          { l: "5/8", v: 0.625 },
          { l: "0.55", v: 0.55 },
        ],
        3,
      );
      const best = Math.max(...vals.map((x) => x.v));
      const winners = vals.filter((x) => x.v === best);
      if (winners.length !== 1 || new Set(vals.map((x) => x.v)).size !== 3) continue;
      return textChoice("Which is the greatest?", winners[0].l, vals.filter((x) => x !== winners[0]).map((x) => x.l), "Change each number to a decimal, then compare.");
    }
  };
  return buildSet([onLine, compareInt, orderInt, context, place, orderDec, round, d === 1 ? place : pick([repeating, equiv, combo])]);
}

// ---------- Factors and primes ----------

const PRIME_FACTORS: Record<number, number[]> = {
  12: [2, 2, 3], 18: [2, 3, 3], 20: [2, 2, 5], 24: [2, 2, 2, 3], 28: [2, 2, 7], 30: [2, 3, 5], 36: [2, 2, 3, 3], 40: [2, 2, 2, 5], 45: [3, 3, 5], 50: [2, 5, 5], 60: [2, 2, 3, 5], 63: [3, 3, 7], 72: [2, 2, 2, 3, 3],
};

function factors6(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const divisor = (): Question => {
    const div = pick(d === 1 ? [2, 3, 5, 10] : [2, 3, 4, 5, 6, 8, 9, 10]);
    for (;;) {
      const right = div * randInt(Math.ceil(30 / div), Math.floor(900 / div));
      const wrong = [randInt(31, 900), randInt(31, 900)].filter((n) => n % div !== 0 && n !== right);
      if (wrong.length === 2 && wrong[0] !== wrong[1]) return textChoice(`Which number is divisible by ${div}?`, String(right), wrong.map(String), `Use the divisibility rule for ${div}.`);
    }
  };
  const yesNo = (): Question => {
    const div = pick([3, 4, 6, 9]);
    const n = randInt(100, 999);
    const ok = n % div === 0;
    return textChoice(`Is ${n} divisible by ${div}?`, ok ? "Yes" : "No", [ok ? "No" : "Yes"], `Check the rule for ${div}.`);
  };
  const rule = (): Question =>
    pick([
      () => textChoice("A number is divisible by 3 when…", "the sum of its digits is divisible by 3", ["its last digit is 3", "its last digit is even"], "Add the digits. If the total is in the 3 times table, the number is too."),
      () => textChoice("A number is divisible by 9 when…", "the sum of its digits is divisible by 9", ["its last digit is 9", "its digits are all odd"], "Add the digits. If the total is in the 9 times table, the number is too."),
      () => textChoice("A number is divisible by 4 when…", "its last two digits make a number divisible by 4", ["its last digit is 4", "its digits add to 4"], "Look only at the last two digits."),
      () => textChoice("A number is divisible by 6 when…", "it is divisible by both 2 and 3", ["its last digit is 6", "it is divisible by 2 or 3"], "6 = 2 × 3, so the number needs both rules."),
      () => textChoice("A number is divisible by 5 when…", "its last digit is 0 or 5", ["its last digit is 5 only", "its digits add to 5"], "Count by 5s: every number ends in 0 or 5."),
    ])();
  const primeProduct = (): Question => {
    const n = pick(Object.keys(PRIME_FACTORS).map(Number));
    const f = PRIME_FACTORS[n];
    const right = f.join(" × ");
    const composite = `${f[0] * f[1]} × ${f.slice(2).join(" × ")}`.replace(/ × $/, "");
    const bad = [...f];
    bad[bad.length - 1] = bad[bad.length - 1] === 2 ? 3 : 2;
    const wrong = [composite, bad.join(" × ")].filter((w) => w !== right);
    return textChoice(`Which shows ${n} as a product of prime factors?`, right, wrong, "Prime factors are all prime numbers. Check that the product equals the number.");
  };
  const isPrime = (): Question => {
    const primes = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43];
    const composites = [21, 27, 33, 35, 39, 45, 49, 51, 55, 57, 63, 65];
    return pick([
      () => textChoice("Which number is prime?", String(pick(primes)), sample(composites, 2).map(String), "A prime number has exactly two factors: 1 and itself."),
      () => textChoice("Which number is composite?", String(pick(composites)), sample(primes, 2).map(String), "A composite number has more than two factors."),
    ])();
  };
  const tree = (): Question => {
    const n = pick([24, 36, 40, 60, 72]);
    const f = PRIME_FACTORS[n];
    const half = n / f[0];
    return textChoice(`A factor tree for ${n} starts with ${f[0]} × ${half}. Which shows the prime factors at the ends of the tree?`, f.join(" × "), [f.map((x) => (x === 2 ? 3 : 2)).join(" × ")].filter((w) => w !== f.join(" × ")), "Keep splitting each branch until every end is a prime number.");
  };
  const count = (): Question => {
    const n = pick([12, 18, 20, 24, 30, 36]);
    const factors = range(1, n).filter((x) => n % x === 0);
    return numQ(`How many factors does ${n} have?`, factors.length, `List them in pairs: 1 × ${n}, and so on.`, undefined, 15, 2);
  };
  return buildSet([divisor, divisor, yesNo, rule, primeProduct, primeProduct, isPrime, d === 1 ? yesNo : pick([tree, count])]);
}

// ---------- Fractions ----------

function fractions6(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const PAIRS: [number, number][] = [[2, 3], [2, 4], [3, 6], [4, 6], [3, 4], [2, 5], [5, 10], [4, 8], [3, 5], [6, 8], [2, 6], [4, 5]];
  const addSub = (add: boolean): Question => {
    for (;;) {
      const [b, dd] = pick(PAIRS);
      const a = randInt(1, b - 1);
      const c = randInt(1, dd - 1);
      const L = (b * dd) / gcd(b, dd);
      const x = (a * L) / b;
      const y = (c * L) / dd;
      const top = add ? x + y : x - y;
      if (top <= 0 || (add && top > L * 2)) continue;
      if (!add && x <= y) continue;
      const right = frac(top, L);
      const sym = add ? "+" : "−";
      const w1 = add ? frac(a + c, b + dd) : frac(Math.abs(a - c), Math.abs(b - dd) || b);
      const w2 = frac(top + 1, L);
      const w3 = frac(Math.max(1, top - 1), L);
      const uniq = [...new Set([w1, w2, w3])].filter((w) => w !== right && w !== "0");
      if (uniq.length < 2) continue;
      const texts = [`${a}/${b}`, `${c}/${dd}`];
      return textChoice(`What is ${texts[0]} ${sym} ${texts[1]}?`, right, uniq.slice(0, 2), "Change both fractions to the same denominator, then " + (add ? "add" : "subtract") + " the numerators.", { type: "equation", text: `${texts[0]} ${sym} ${texts[1]}` });
    }
  };
  const wholeTimes = (): Question => {
    const den = pick([2, 3, 4, 5, 6, 8]);
    const num = randInt(1, den - 1);
    const k = randInt(2, 6);
    return typeIn(`What is ${den * k} × ${num}/${den}?`, k * num, `Divide ${den * k} into ${den} equal groups, then take ${num} of them.`, { type: "equation", text: `${den * k} × ${num}/${den} = ?` });
  };
  const wholeDiv = (): Question => {
    const den = pick([3, 4, 5, 6, 8]);
    const num = randInt(2, den - 1);
    if (gcd(num, den) !== 1) return wholeDiv();
    const k = randInt(2, 5);
    return typeIn(`How many ${num}/${den}-cup servings are in ${num * k} cups?`, k * den, `Divide ${num * k} by ${num}/${den}. Each cup holds ${den}/${num} servings.`);
  };
  const recipe = (): Question => {
    const den = pick([2, 3, 4]);
    const num = randInt(1, den - 1);
    const batches = den * randInt(2, 4);
    return typeIn(`A recipe uses ${num}/${den} cup of flour. How many cups are needed for ${batches} batches?`, (batches / den) * num, `Multiply ${batches} × ${num}/${den}.`);
  };
  return buildSet([() => addSub(true), () => addSub(true), () => addSub(true), () => addSub(false), () => addSub(false), wholeTimes, d === 1 ? recipe : wholeDiv, d === 1 ? wholeTimes : pick([recipe, wholeDiv])]);
}

// ---------- Percents and ratios ----------

function percents6(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const mental = (): Question => {
    const cases = [
      { p: 1, base: () => 100 * randInt(2, 9) },
      { p: 5, base: () => 20 * randInt(2, 15) },
      { p: 10, base: () => 10 * randInt(3, 40) },
      { p: 15, base: () => 20 * randInt(2, 15) },
      { p: 25, base: () => 4 * randInt(5, 40) },
      { p: 50, base: () => 2 * randInt(10, 100) },
    ];
    const c = pick(d === 1 ? cases.slice(2, 3).concat(cases.slice(4)) : cases);
    const base = c.base();
    return typeIn(`What is ${c.p}% of ${base}?`, (c.p * base) / 100, c.p === 15 ? "Find 10% and 5%, then add them." : c.p === 25 ? "25% is one fourth. Divide by 4." : c.p === 50 ? "50% is half." : c.p === 10 ? "10% is one tenth. Divide by 10." : c.p === 5 ? "Find 10%, then halve it." : "1% is one hundredth. Divide by 100.");
  };
  const sale = (): Question => {
    const price = pick([20, 40, 60, 80, 100, 120]);
    const off = pick([10, 25, 50]);
    return typeIn(`A game costs $${price}. It is ${off}% off. What is the sale price in dollars?`, price - (price * off) / 100, `Find ${off}% of the price, then take it away.`);
  };
  const parts = (): Question => {
    const a = randInt(2, 4);
    let b = randInt(2, 5);
    while (b === a) b = randInt(2, 5);
    const k = randInt(3, 8);
    const total = (a + b) * k;
    return typeIn(`In a class, the ratio of girls to boys is ${a} to ${b}. There are ${total} students. How many are girls?`, a * k, `There are ${a + b} parts. Each part is ${total} ÷ ${a + b} = ${k} students.`, { type: "table", headers: ["Girls", "Boys", "Total"], rows: [[a, b, a + b], ["?", "", total]] });
  };
  const rate = (): Question => {
    const per = randInt(3, 12);
    const h = randInt(2, 5);
    const h2 = h + randInt(2, 4);
    return typeIn(`A cyclist rides ${per * h} km in ${h} hours. At the same rate, how far does the cyclist ride in ${h2} hours?`, per * h2, `First find the rate: ${per * h} ÷ ${h} = ${per} km per hour.`);
  };
  const outOf = (): Question => {
    const total = pick([20, 25, 50, 10, 4, 5]);
    const got = randInt(1, total - 1);
    const pct = (got * 100) / total;
    if (!Number.isInteger(pct)) return outOf();
    return typeIn(`Jay got ${got} out of ${total} questions right. What percent is that?`, pct, `Write ${got}/${total} as a fraction out of 100.`, undefined, { suffix: "%" });
  };
  const scale = (): Question => {
    const a = randInt(2, 5);
    let b = randInt(2, 7);
    while (b === a) b = randInt(2, 7);
    const k = randInt(2, 6);
    return typeIn(`A paint mix uses ${a} parts blue to ${b} parts white. How many parts of white go with ${a * k} parts of blue?`, b * k, `Multiply both parts by ${k}.`);
  };
  const better = (): Question => {
    for (;;) {
      const n1 = randInt(2, 5);
      const n2 = randInt(2, 8);
      if (n1 === n2) continue;
      const p1 = randInt(n1 * 10, n1 * 40) / 10;
      const p2 = randInt(n2 * 10, n2 * 40) / 10;
      if (Math.abs(p1 / n1 - p2 / n2) < 0.2) continue;
      const best = p1 / n1 < p2 / n2 ? "A" : "B";
      return textChoice(`Pack A has ${n1} juice boxes for ${money(p1)}. Pack B has ${n2} juice boxes for ${money(p2)}. Which pack costs less per juice box?`, `Pack ${best}`, [`Pack ${best === "A" ? "B" : "A"}`], "Divide each price by the number of boxes to find the unit rate.");
    }
  };
  return buildSet([mental, mental, mental, sale, parts, rate, d === 1 ? outOf : scale, d === 3 ? better : outOf]);
}

// ---------- Algebra ----------

function algebra6(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const monomials = (): Question => {
    const a = randInt(2, 9);
    let b = randInt(2, 9);
    while (a * b === a + b) b = randInt(2, 9);
    const v = pick(["x", "n", "y", "a"]);
    return textChoice(`What is ${a}${v} + ${b}${v}?`, `${a + b}${v}`, [`${a * b}${v}`, String(a + b)], "Add the numbers in front. The letter stays the same, like adding apples to apples.", { type: "equation", text: `${a}${v} + ${b}${v}` });
  };
  const plusOne = (): Question => {
    const a = randInt(2, 9);
    const v = pick(["x", "n", "y"]);
    return textChoice(`What is ${a}${v} + ${v}?`, `${a + 1}${v}`, [`${a}${v}²`, `${a + 1}`], `${v} means 1${v}. So add ${a} + 1.`, { type: "equation", text: `${a}${v} + ${v}` });
  };
  const evaluate = (): Question => {
    const a = randInt(2, 6);
    const nTenths = randInt(11, 59);
    const b = randInt(2, 9);
    const ans = (a * nTenths + b * 10) / 10;
    return typeIn(`Evaluate ${a}n + ${b} when n = ${(nTenths / 10).toFixed(1)}.`, dec(ans), `Put ${(nTenths / 10).toFixed(1)} in for n. Multiply first, then add.`, { type: "equation", text: `${a}n + ${b}, n = ${(nTenths / 10).toFixed(1)}` }, { keypad: "decimal", accept: [ans.toFixed(1)] });
  };
  const evalWhole = (): Question => {
    const a = randInt(2, 9);
    const n = randInt(3, 12);
    const b = randInt(1, Math.min(9, a * n - 1));
    return typeIn(`Evaluate ${a}n − ${b} when n = ${n}.`, a * n - b, `Put ${n} in for n. Multiply first, then subtract.`, { type: "equation", text: `${a}n − ${b}, n = ${n}` });
  };
  const inequality = (): Question => {
    const a = randInt(2, 5);
    const t = randInt(3, 12);
    const b = randInt(1, 9);
    const c = a * t + b;
    const greater = pick([true, false]);
    if (greater) {
      const right = t + randInt(1, 5);
      const wrong = sample([t, t - 1, Math.max(0, t - 2)], 2);
      return textChoice(`Which value of n makes ${a}n + ${b} > ${c} true?`, String(right), wrong.map(String), "Try each choice in the inequality.", { type: "equation", text: `${a}n + ${b} > ${c}` });
    }
    const right = Math.max(0, t - randInt(1, 3));
    return textChoice(`Which value of n makes ${a}n + ${b} < ${c} true?`, String(right), [String(t), String(t + 2)], "Try each choice in the inequality.", { type: "equation", text: `${a}n + ${b} < ${c}` });
  };
  const graph = (): Question => {
    const t = randInt(2, 9);
    const greater = pick([true, false]);
    const right = `an open circle at ${t} with an arrow pointing ${greater ? "right" : "left"}`;
    const wrong = [`an open circle at ${t} with an arrow pointing ${greater ? "left" : "right"}`, `a closed circle at ${t} with an arrow pointing ${greater ? "right" : "left"}`];
    return textChoice(`Which shows the solution to n ${greater ? ">" : "<"} ${t} on a number line?`, right, wrong, "An open circle means the number itself is not included. The arrow points to the numbers that work.");
  };
  const triple = (): Question => {
    const v = pick(["x", "n", "y"]);
    return textChoice(`What is ${v} + ${v} + ${v}?`, `3${v}`, [`${v}${v}${v}`, `${v}3`], "Three of the same unknown number is 3 times that number.");
  };
  return buildSet([monomials, monomials, plusOne, evaluate, evalWhole, inequality, graph, d === 1 ? triple : pick([inequality, graph])]);
}

// ---------- Data ----------

function data6(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const kind = (): Question => {
    const discrete = pick([true, false]);
    const item = pick(discrete ? ["the number of pets in a home", "the goals scored in a game", "the number of students in a class", "cars sold in a week"] : ["a person's height", "the time it takes to run a race", "the temperature outside", "the mass of a backpack"]);
    return textChoice(`Is this data discrete or continuous? ${item}`, discrete ? "discrete" : "continuous", [discrete ? "continuous" : "discrete"], "Discrete data is counted and has gaps. Continuous data is measured and can be any value in a range.");
  };
  const histogram = () => {
    const bins = ["0–9", "10–19", "20–29", "30–39"];
    const counts = bins.map(() => randInt(2, 12));
    const visual: Visual = { type: "table", title: "Minutes spent reading (histogram)", headers: ["Minutes", "Students"], rows: bins.map((b, i) => [b, counts[i]]) };
    return { bins, counts, visual };
  };
  const histRead = (): Question => {
    const h = histogram();
    const i = randInt(0, 3);
    return numQ(`How many students read for ${h.bins[i]} minutes?`, h.counts[i], "Find the row for that interval.", h.visual, 15, 1);
  };
  const histTotal = (): Question => {
    const h = histogram();
    return numQ("How many students were counted in all?", h.counts.reduce((s, x) => s + x, 0), "Add the counts for every interval.", h.visual, 45, 8);
  };
  const broken = (): Question => {
    const hours = ["8 a.m.", "10 a.m.", "12 p.m.", "2 p.m."];
    const temps = [randInt(5, 12)];
    for (let i = 1; i < 4; i++) temps.push(temps[i - 1] + randInt(-3, 6));
    const visual: Visual = { type: "table", title: "Temperature (°C) through the day", headers: ["Time", "°C"], rows: hours.map((h, i) => [h, temps[i]]) };
    const diffs = temps.slice(1).map((t, i) => t - temps[i]);
    const maxRise = Math.max(...diffs);
    if (diffs.filter((x) => x === maxRise).length !== 1) return broken();
    const idx = diffs.indexOf(maxRise);
    return textChoice("Between which two times did the temperature rise the most?", `${hours[idx]} to ${hours[idx + 1]}`, others(diffs.map((_, i) => `${hours[i]} to ${hours[i + 1]}`), `${hours[idx]} to ${hours[idx + 1]}`, 2), "On a broken-line graph, the steepest climb shows the biggest rise.", visual);
  };
  const range6 = (): Question => {
    const nums = sample(range(1, 50), 5);
    return numQ("What is the range of this data?", Math.max(...nums) - Math.min(...nums), "Range = greatest value − least value.", { type: "equation", text: shuffle(nums).join(", ") }, 49, 1);
  };
  const compare = (): Question => {
    for (;;) {
      const a = sample(range(1, 30), 5);
      const b = sample(range(1, 30), 5);
      const ra = Math.max(...a) - Math.min(...a);
      const rb = Math.max(...b) - Math.min(...b);
      if (ra === rb) continue;
      const wider = ra > rb ? "Set A" : "Set B";
      return textChoice("Which data set has the greater range?", wider, [wider === "Set A" ? "Set B" : "Set A"], "Find the range of each set. The greater range is more spread out.", { type: "table", headers: ["Set A", "Set B"], rows: a.map((x, i) => [x, b[i]]) });
    }
  };
  const mean = (): Question => {
    const m = randInt(4, 14);
    for (;;) {
      const nums = range(1, 4).map(() => randInt(2, 25));
      const last = m * 5 - nums.reduce((s, x) => s + x, 0);
      if (last >= 1 && last <= 30 && new Set([...nums, last]).size === 5) return numQ("What is the mean of this data?", m, "Add the values, then divide by how many there are.", { type: "equation", text: shuffle([...nums, last]).join(", ") }, 30, 1);
    }
  };
  const misleading = (): Question => {
    const bank = [
      { q: "A line graph's vertical axis starts at 90 instead of 0. Why can that be misleading?", right: "Small changes look very large.", wrong: ["Large changes look small.", "The lines become curved."] },
      { q: "A bar graph has bars of different widths. Why is that misleading?", right: "Wider bars look bigger even if the values are equal.", wrong: ["Narrow bars are always wrong.", "It makes the graph more accurate."] },
      { q: "A graph's scale jumps from 10 to 50 to 60 with equal spacing. Why is that misleading?", right: "Equal spaces stand for different amounts.", wrong: ["The numbers are too small.", "There are too many colours."] },
    ];
    const b = pick(bank);
    return textChoice(b.q, b.right, b.wrong, "Check the scale, the widths and the labels before you trust a graph.");
  };
  return buildSet([kind, kind, histRead, histTotal, broken, d === 1 ? range6 : compare, d === 1 ? mean : range6, misleading]);
}

// ---------- Probability ----------

function probability6(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const spinner = () => {
    const total = pick([4, 5, 10, 20]);
    const red = randInt(1, total - 1);
    return { total, red, segs: shuffle([...Array(red).fill("🔴"), ...Array(total - red).fill("🔵")]) as string[] };
  };
  const asPercent = (): Question => {
    const s = spinner();
    return typeIn("The spinner has equal sections. What is the probability of landing on red, as a percent?", (s.red * 100) / s.total, `Write ${s.red}/${s.total} as a fraction out of 100.`, { type: "spinner", segments: s.segs }, { suffix: "%" });
  };
  const asDecimal = (): Question => {
    const total = pick([4, 5, 10]);
    const red = randInt(1, total - 1);
    const v = red / total;
    const wrong = [...new Set([dec((total - red) / total), dec(red / 10), dec(Math.min(0.95, v + 0.1)), dec(v / 2)])].filter((w) => w !== dec(v)).slice(0, 2);
    return textChoice("The spinner has equal sections. What is the probability of landing on red, as a decimal?", dec(v), wrong, "Divide the red sections by all the sections.", { type: "spinner", segments: shuffle([...Array(red).fill("🔴"), ...Array(total - red).fill("🔵")]) as string[] });
  };
  const independent = (): Question => {
    const events = [
      { t: "heads", p: [1, 2] },
      { t: "tails", p: [1, 2] },
    ];
    const dieEvents = [
      { t: "a 6", p: [1, 6] },
      { t: "an even number", p: [3, 6] },
      { t: "a number greater than 4", p: [2, 6] },
      { t: "a 1 or a 2", p: [2, 6] },
    ];
    const c = pick(events);
    const e = pick(dieEvents);
    const num = c.p[0] * e.p[0];
    const den = c.p[1] * e.p[1];
    const right = frac(num, den);
    const w1 = frac(c.p[0] * e.p[1] + e.p[0] * c.p[1], c.p[1] * e.p[1]);
    const w2 = frac(e.p[0], e.p[1]);
    const wrong = [...new Set([w1, w2, frac(num + 1, den)])].filter((w) => w !== right).slice(0, 2);
    return textChoice(`A fair coin is tossed and a fair die is rolled. What is the probability of ${c.t} and ${e.t}?`, right, wrong, "For two independent events, multiply the two probabilities.");
  };
  const theory = (): Question =>
    pick([
      () => textChoice("A coin and a die are used in an experiment. Which is true about experimental probability?", "It comes from the results of actual trials.", ["It never changes.", "It is always the same as the theoretical probability."], "Experimental probability uses what really happened."),
      () => textChoice("Why do more trials usually make the experimental probability closer to the theoretical probability?", "The luck of a few trials evens out.", ["The coin changes.", "The theory changes."], "A small number of trials can be unusual."),
    ])();
  const predict = (): Question => {
    const p = pick([10, 20, 25, 30, 40, 50]);
    const days = pick([20, 100, 200]);
    return typeIn(`The chance of rain on any day is ${p}%. About how many rainy days would you expect in ${days} days?`, (p * days) / 100, `Find ${p}% of ${days}.`);
  };
  const line = (): Question => {
    const cases = [
      { q: "An event has a probability of 0.9. Where is it on the probability line?", right: "close to 1 (very likely)", wrong: ["close to 0 (very unlikely)", "exactly in the middle"] },
      { q: "An event has a probability of 5%. Where is it on the probability line?", right: "close to 0 (unlikely)", wrong: ["close to 1 (very likely)", "exactly in the middle"] },
      { q: "An event has a probability of 1/2. Where is it on the probability line?", right: "exactly in the middle", wrong: ["at 0", "at 1"] },
    ];
    const c = pick(cases);
    return textChoice(c.q, c.right, c.wrong, "0 means impossible, 1 means certain, and 1/2 is halfway.");
  };
  return buildSet([asPercent, asPercent, asDecimal, independent, independent, theory, d === 1 ? line : predict, d === 3 ? independent : line]);
}

// ---------- Quadrilaterals, views and the plane ----------

function geometry6(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const symmetry = (): Question => {
    const cases = [
      { q: "How many lines of symmetry does a square have?", a: 4 },
      { q: "How many lines of symmetry does a rectangle that is not a square have?", a: 2 },
      { q: "How many lines of symmetry does a rhombus that is not a square have?", a: 2 },
      { q: "How many lines of symmetry does a parallelogram that is not a rectangle or a rhombus have?", a: 0 },
      { q: "How many lines of symmetry does a kite have?", a: 1 },
    ];
    const c = pick(cases);
    return numQ(c.q, c.a, "Picture folding the shape so both halves match exactly.", undefined, 5, 0);
  };
  const rotational = (): Question => {
    const cases = [
      { q: "What is the order of rotational symmetry of a square?", a: 4 },
      { q: "What is the order of rotational symmetry of a rectangle that is not a square?", a: 2 },
      { q: "What is the order of rotational symmetry of a parallelogram that is not a rectangle or a rhombus?", a: 2 },
    ];
    const c = pick(cases);
    return numQ(c.q, c.a, "Count how many times the shape fits onto itself in one full turn.", undefined, 6, 1);
  };
  const diagonals = (): Question =>
    pick([
      () => textChoice("What is true about the diagonals of every rectangle?", "They are equal in length and bisect each other.", ["They meet at right angles.", "They are always different lengths."], "Draw both diagonals of a rectangle and compare."),
      () => textChoice("What is true about the diagonals of every rhombus?", "They meet at right angles.", ["They are always equal in length.", "They never cross."], "A rhombus's diagonals cross at 90°."),
      () => textChoice("What do the diagonals of every parallelogram do?", "They bisect (cut in half) each other.", ["They are always perpendicular.", "They never cross."], "The diagonals cross at the middle of each other."),
    ])();
  const views = (): Question =>
    pick([
      () => textChoice("Which object has a top view that is a circle and a front view that is a rectangle?", "cylinder", ["cone", "cube"], "A cylinder has a round top and a rectangular side."),
      () => textChoice("Which object has a top view that is a circle and a front view that is a triangle?", "cone", ["cylinder", "pyramid with a square base"], "A cone is round from above and pointed from the side."),
      () => textChoice("Which object has a square top view and a triangular front view?", "pyramid with a square base", ["cone", "cylinder"], "A square-based pyramid looks like a triangle from the side."),
    ])();
  const quadrant = (): Question => {
    const x = pick([-1, 1]) * randInt(1, 7);
    const y = pick([-1, 1]) * randInt(1, 7);
    const q = x > 0 && y > 0 ? "I" : x < 0 && y > 0 ? "II" : x < 0 ? "III" : "IV";
    return textChoice(`In which quadrant is the point (${int(x)}, ${int(y)})?`, `Quadrant ${q}`, ["I", "II", "III", "IV"].filter((r) => r !== q).slice(0, 2).map((r) => `Quadrant ${r}`), "Quadrant I is top right, II is top left, III is bottom left, and IV is bottom right.", { type: "grid", size: 8, min: -8, points: [{ x, y, label: "P" }] });
  };
  const readPoint = (): Question => {
    const x = pick([-1, 1]) * randInt(1, 7);
    const y = pick([-1, 1]) * randInt(1, 7);
    const right = `(${int(x)}, ${int(y)})`;
    const wrong = [...new Set([`(${int(y)}, ${int(x)})`, `(${int(-x)}, ${int(y)})`, `(${int(x)}, ${int(-y)})`, `(${int(-x)}, ${int(-y)})`])].filter((w) => w !== right).slice(0, 2);
    return textChoice("What are the coordinates of point P?", right, wrong, "The first number is left or right. The second number is up or down.", { type: "grid", size: 8, min: -8, points: [{ x, y, label: "P" }] });
  };
  const translate = (): Question => {
    const x = randInt(-5, 5);
    const y = randInt(-5, 5);
    const dx = randInt(-4, 4) || 3;
    const dy = randInt(-4, 4) || -2;
    const right = `(${int(x + dx)}, ${int(y + dy)})`;
    const dirs = `${Math.abs(dx)} ${dx > 0 ? "right" : "left"} and ${Math.abs(dy)} ${dy > 0 ? "up" : "down"}`;
    return textChoice(`Point A is at (${int(x)}, ${int(y)}). It is translated ${dirs}. Where does it land?`, right, others([`(${int(x - dx)}, ${int(y + dy)})`, `(${int(x + dx)}, ${int(y - dy)})`, `(${int(y + dy)}, ${int(x + dx)})`], right, 3).slice(0, 2), "Right and up add. Left and down subtract.");
  };
  const combo = (): Question => {
    const x = randInt(1, 6);
    const y = randInt(-4, 5);
    const dx = randInt(1, 3);
    const nx = x + dx;
    const right = `(${int(-nx)}, ${int(y)})`;
    return textChoice(`Point P is at (${x}, ${int(y)}). It is translated ${dx} right, then reflected in the y-axis. Where does it land?`, right, [`(${int(nx)}, ${int(y)})`, `(${int(-x)}, ${int(y)})`], "First slide the point. Then flip it across the y-axis by changing the sign of x.");
  };
  return buildSet([symmetry, rotational, diagonals, views, quadrant, readPoint, translate, d === 1 ? diagonals : combo]);
}

// ---------- Measurement ----------

function measure6(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const convert = (): Question => {
    const cases = [
      () => {
        const ml = randInt(12, 98) * 100;
        return typeIn(`${ml} mL = ☐ L`, dec(ml / 1000), "Divide by 1000 to change mL to L.", { type: "equation", text: `${ml} mL = ☐ L` }, { keypad: "decimal", accept: [(ml / 1000).toFixed(1)] });
      },
      () => {
        const km = randInt(11, 99) / 10;
        return typeIn(`${km.toFixed(1)} km = ☐ m`, Math.round(km * 1000), "Multiply by 1000 to change km to m.", { type: "equation", text: `${km.toFixed(1)} km = ☐ m` });
      },
      () => {
        const cm = randInt(11, 99) * 10;
        return typeIn(`${cm} cm = ☐ m`, dec(cm / 100), "Divide by 100 to change cm to m.", { type: "equation", text: `${cm} cm = ☐ m` }, { keypad: "decimal", accept: [(cm / 100).toFixed(1)] });
      },
      () => {
        const kg = randInt(11, 99) / 10;
        return typeIn(`${kg.toFixed(1)} kg = ☐ g`, Math.round(kg * 1000), "Multiply by 1000 to change kg to g.", { type: "equation", text: `${kg.toFixed(1)} kg = ☐ g` });
      },
    ];
    return pick(cases)();
  };
  const clockwise = (): Question => {
    const a = pick([30, 45, 60, 70, 100, 120, 135]);
    return typeIn(`An angle measures ${a}° clockwise. What is the same turn measured counterclockwise?`, 360 - a, "A full turn is 360°. Counterclockwise = 360° − clockwise.");
  };
  const anglePair = (): Question => {
    const a = randInt(20, 80);
    const kind = pick(["supplementary", "complementary"] as const);
    const total = kind === "supplementary" ? 180 : 90;
    const first = kind === "supplementary" ? randInt(40, 140) : a;
    return typeIn(`Two angles are ${kind}. One angle is ${first}°. What is the other angle?`, total - first, `${kind === "supplementary" ? "Supplementary angles add to 180°" : "Complementary angles add to 90°"}.`);
  };
  const exterior = (): Question => {
    const a = randInt(30, 80);
    const b = randInt(30, 80);
    return typeIn(`In a triangle, two interior angles are ${a}° and ${b}°. What is the third interior angle?`, 180 - a - b, "The three interior angles of a triangle add to 180°.");
  };
  const exteriorAngle = (): Question => {
    const a = randInt(30, 80);
    const b = randInt(30, 80);
    return typeIn(`In a triangle, the interior angles at two corners are ${a}° and ${b}°. What is the exterior angle at the third corner?`, a + b, "An exterior angle equals the sum of the two interior angles that are not next to it.");
  };
  const opposite = (): Question => {
    const a = randInt(25, 155);
    return typeIn(`Two lines cross. One angle is ${a}°. What is the angle directly across from it (the opposite angle)?`, a, "Opposite angles are equal.");
  };
  const trapezoid = (): Question => {
    const a = randInt(3, 10);
    const b = randInt(a + 1, 14);
    const h = 2 * randInt(2, 6);
    return typeIn(`A trapezoid has parallel sides of ${a} cm and ${b} cm and a height of ${h} cm. What is its area in square centimetres?`, ((a + b) * h) / 2, "Area = (sum of the parallel sides) × height ÷ 2.", { type: "equation", text: `(${a} + ${b}) × ${h} ÷ 2 = ?` });
  };
  const rhombus = (): Question => {
    const a = 2 * randInt(2, 8);
    const b = randInt(3, 12);
    return typeIn(`A rhombus has diagonals of ${a} cm and ${b} cm. What is its area in square centimetres?`, (a * b) / 2, "Area = diagonal × diagonal ÷ 2.", { type: "equation", text: `${a} × ${b} ÷ 2 = ?` });
  };
  const composite = (): Question => {
    const a = randInt(4, 10);
    const b = randInt(3, 8);
    const c = randInt(2, 5);
    const e = randInt(2, 6);
    return typeIn(`An L-shape is made of a ${a} cm by ${b} cm rectangle and a ${c} cm by ${e} cm rectangle. What is its total area in square centimetres?`, a * b + c * e, "Find the area of each rectangle, then add.");
  };
  const surface = (): Question => {
    const l = randInt(2, 8);
    const w = randInt(2, 6);
    const h = randInt(2, 7);
    return pick([
      () => typeIn(`A box is ${l} cm long, ${w} cm wide and ${h} cm high. What is its surface area in square centimetres?`, 2 * (l * w + l * h + w * h), "Add the areas of all 6 faces: 2 × (lw + lh + wh).", { type: "shape", shape: "rectangular-prism" }),
      () => typeIn(`A cube has edges of ${l} cm. What is its surface area in square centimetres?`, 6 * l * l, "A cube has 6 equal square faces.", { type: "shape", shape: "cube" }),
      () => typeIn(`A square pyramid has a base of ${2 * l} cm by ${2 * l} cm. Each triangle face has a base of ${2 * l} cm and a height of ${h + l} cm. What is its surface area in square centimetres?`, 4 * l * l + 4 * l * (h + l), "Add the square base to the four triangle faces.", { type: "shape", shape: "pyramid" }),
    ])();
  };
  return buildSet([convert, convert, clockwise, anglePair, d === 1 ? opposite : pick([exterior, exteriorAngle]), trapezoid, d === 1 ? composite : pick([rhombus, composite]), surface]);
}

// ---------- Money ----------

function money6(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const methods = (): Question => {
    const bank = [
      { q: "What is one advantage of paying with a debit card?", right: "You spend money you already have in your account.", wrong: ["You borrow money to pay.", "You never get a record of it."] },
      { q: "What is a disadvantage of paying with cash?", right: "It can be lost or stolen and cannot be replaced.", wrong: ["It charges interest.", "It cannot be used in stores."] },
      { q: "What is a disadvantage of a credit card?", right: "You pay interest if you do not pay the balance in full.", wrong: ["It cannot be used online.", "It takes money out of your account right away."] },
      { q: "What is an advantage of paying with a credit card?", right: "You can buy now and pay later, and keep a record.", wrong: ["You never have to pay it back.", "It is free to borrow."] },
      { q: "What is an advantage of an e-transfer?", right: "You can send money quickly without cash.", wrong: ["You do not need a bank account.", "It never needs a password."] },
    ];
    const b = pick(bank);
    return textChoice(b.q, b.right, b.wrong, "Think about what each way to pay costs and how fast and safe it is.");
  };
  const goals = (): Question => {
    const bank = [
      { q: "Which is a saving goal?", right: "putting aside $20 a month for a new bike", wrong: ["buying lunch today", "paying for a movie ticket tonight"] },
      { q: "Which is an earning goal?", right: "making $50 by walking dogs this summer", wrong: ["keeping $50 in a jar", "borrowing $50 from a friend"] },
      { q: "Which is a good first step to reach a financial goal?", right: "decide how much you need and by when", wrong: ["spend money on small things", "wait and see"] },
      { q: "Which could help you reach a financial goal?", right: "making a budget and tracking your spending", wrong: ["spending all your money right away", "ignoring prices"] },
      { q: "Which could get in the way of a financial goal?", right: "unplanned spending on things you do not need", wrong: ["a clear savings plan", "an extra job"] },
    ];
    const b = pick(bank);
    return textChoice(b.q, b.right, b.wrong, "A financial goal has an amount, a plan and a time.");
  };
  const interest = (): Question => {
    const principal = pick([100, 200, 400, 500, 1000]);
    const rate = pick([2, 4, 5, 10]);
    return pick([
      () => typeIn(`You put $${principal} in a savings account that pays ${rate}% interest for 1 year. How many dollars of interest do you earn?`, (principal * rate) / 100, `Find ${rate}% of $${principal}.`),
      () => typeIn(`You borrow $${principal} at ${rate}% interest for 1 year. How many dollars of interest do you pay?`, (principal * rate) / 100, `Find ${rate}% of $${principal}.`),
    ])();
  };
  const rates = (): Question =>
    pick([
      () => textChoice("A fixed interest rate…", "stays the same for the whole loan", ["changes every month", "is always 0%"], "Fixed means it does not move."),
      () => textChoice("A variable interest rate…", "can go up or down over time", ["never changes", "is always lower"], "Variable rates change with the market."),
      () => textChoice("Which is a fee a bank might charge?", "a monthly account fee", ["a free gift", "a birthday card"], "Some accounts have fees to keep them open."),
    ])();
  const resources = (): Question => {
    const bank = [
      { q: "What does it mean to lend?", right: "to give something to be paid back later", wrong: ["to give it away forever", "to take it without asking"] },
      { q: "What does it mean to borrow?", right: "to take something and promise to pay it back", wrong: ["to keep it as a gift", "to sell it"] },
      { q: "What does it mean to trade?", right: "to exchange one thing for another", wrong: ["to give without getting anything", "to save for later"] },
      { q: "What does it mean to donate?", right: "to give to help others, without being paid back", wrong: ["to lend and get it back", "to swap for something"] },
    ];
    const b = pick(bank);
    return textChoice(b.q, b.right, b.wrong, "Each word describes a different way money and things move between people.");
  };
  return buildSet([methods, methods, goals, goals, interest, interest, rates, d === 1 ? resources : pick([resources, rates])]);
}

export const units: Unit[] = [
  {
    id: "numbers-6",
    title: "Integers & Decimals",
    emoji: "➖",
    blurb: "Negatives, thousandths and rounding",
    standards: on("B1.2–B1.6", "integers on number lines, comparing integers, decimals and fractions, decimals to thousandths and rounding"),
    parentNote: "Meeting negative numbers on a number line, comparing and ordering integers, decimals and fractions, working with thousandths, and rounding decimals.",
    generate: numbers6,
  },
  {
    id: "factors-6",
    title: "Factors & Primes",
    emoji: "🌳",
    blurb: "Divisibility and prime factors",
    standards: on("B2.2, B2.6", "divisibility rules and prime factorization with factor trees"),
    parentNote: "Using divisibility rules for 2, 3, 4, 5, 6, 8, 9 and 10, telling prime from composite, and writing a number as a product of prime factors.",
    generate: factors6,
  },
  {
    id: "fractions-6",
    title: "Fractions",
    emoji: "🍕",
    blurb: "Unlike denominators and whole numbers",
    standards: on("B2.5, B2.9, B2.10", "adding and subtracting fractions with unlike denominators, and multiplying and dividing whole numbers by proper fractions"),
    parentNote: "Adding and subtracting fractions that have different denominators, and multiplying or dividing whole numbers by fractions such as 2/3.",
    generate: fractions6,
  },
  {
    id: "percents-6",
    title: "Percents & Ratios",
    emoji: "💯",
    blurb: "Mental percents, ratios and rates",
    standards: on("B2.3, B2.12", "percents of whole numbers using mental math, ratios, rates and percent problems"),
    parentNote: "Finding 1%, 5%, 10%, 15%, 25% and 50% of a number in your head, and solving ratio, rate and percent problems.",
    generate: percents6,
  },
  {
    id: "algebra-6",
    title: "Algebra Moves",
    emoji: "🔤",
    blurb: "Monomials and inequalities",
    standards: on("C2.1, C2.2, C2.4", "adding monomials, evaluating expressions with decimal tenths, and inequalities with two operations"),
    parentNote: "Combining like terms such as 3x + 5x, evaluating expressions, and finding values that make an inequality true and showing them on a number line.",
    generate: algebra6,
  },
  {
    id: "data-6",
    title: "Data & Graphs",
    emoji: "📈",
    blurb: "Histograms, range and line graphs",
    standards: on("D1.1–D1.6", "discrete and continuous data, histograms, broken-line graphs, range, and misleading graphs"),
    parentNote: "Telling discrete data (counted) from continuous data (measured), reading histograms and line graphs, finding the range, and spotting misleading graphs.",
    generate: data6,
  },
  {
    id: "probability-6",
    title: "Probability",
    emoji: "🎲",
    blurb: "Percents, decimals and two events",
    standards: on("D2.1, D2.2", "probability as fractions, decimals and percents, and two independent events"),
    parentNote: "Writing probability as a fraction, decimal and percent, and finding the probability of two independent events by multiplying.",
    generate: probability6,
  },
  {
    id: "shapes-6",
    title: "Quadrilaterals & Grids",
    emoji: "🔷",
    blurb: "Symmetry, quadrants and moves",
    standards: on("E1.1–E1.4", "quadrilateral properties, views of 3D objects, coordinates in four quadrants and combined transformations"),
    parentNote: "Properties of quadrilaterals (symmetry and diagonals), top and front views, coordinates in all four quadrants, and combining slides and flips.",
    generate: geometry6,
  },
  {
    id: "measure-6",
    title: "Angles, Area & Surface",
    emoji: "📐",
    blurb: "Angle rules, area and surface area",
    standards: on("E2.1–E2.6", "metric conversions, angle relationships, areas of trapezoids and rhombuses, and surface area"),
    parentNote: "Converting metric units, finding unknown angles, finding the area of trapezoids, rhombuses and L-shapes, and the surface area of boxes and pyramids.",
    generate: measure6,
  },
  {
    id: "money-6",
    title: "Money Plans",
    emoji: "🏦",
    blurb: "Goals, interest and ways to pay",
    standards: on("F1.1–F1.5", "ways to pay, financial goals, interest rates and fees, and ways to move money between people"),
    parentNote: "Comparing ways to pay, setting financial goals, understanding interest and fees, and the difference between trading, lending, borrowing and donating.",
    generate: money6,
  },
];
