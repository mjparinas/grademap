import { chance, pick, randInt, sample, shuffle, textChoice } from "../random";
import type { GenerateOptions, OrderQuestion, Question, Unit, Visual } from "../types";
import { buildSet, eq, levelOf, on, ordinal, spaced, typeIn } from "./kit";

// Ontario Grade 8 mathematics (2020 curriculum). BC's fraction operations, squares and roots, ratios and
// rates, Pythagorean theorem, surface area and volume, and two-step equations units are shared (see g8.ts).
// These units cover the rest: scientific notation and real numbers, integers, percents, patterns,
// algebra, scatter plots, multiple events, transformations, scale, measurement, angles and money.

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
const dec = (n: number): string => String(Math.round(n * 1000) / 1000);
const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const sup = (n: number): string => (n < 0 ? "⁻" : "") + String(Math.abs(n)).split("").map((d) => SUP[Number(d)]).join("");
/** −5 for negative numbers (a real minus sign), plain digits otherwise. */
const minus = (n: number): string => (n < 0 ? `−${-n}` : String(n));
/** Operands in brackets when negative: (−5). */
const op = (n: number): string => (n < 0 ? `(−${-n})` : String(n));
const sci = (c: number | string, e: number): string => `${c} × 10${sup(e)}`;
const pt = (x: number, y: number): string => `(${minus(x)}, ${minus(y)})`;
/** "+ 5" or "− 5" for the constant part of an expression. */
const signed = (n: number): string => (n < 0 ? `− ${-n}` : `+ ${n}`);

/** A multiple-choice question whose wrong answers are de-duplicated and never equal the right one. */
function mc(prompt: string, right: string, wrong: string[], hint: string, visual?: Visual): Question {
  const w = [...new Set(wrong)].filter((x) => x !== right);
  return textChoice(prompt, right, w.slice(0, 3), hint, visual);
}

/** A fraction in lowest terms as typed-answer text; also accepts the unsimplified form. */
function fracAnswer(n: number, d: number): { ans: string; accept: string[] } {
  const g = gcd(n, d);
  const ans = `${n / g}/${d / g}`;
  return { ans, accept: ans === `${n}/${d}` ? [] : [`${n}/${d}`] };
}

interface Fact {
  prompt: string;
  right: string;
  wrong: string[];
  hint: string;
}

/** Pick `n` hand-written questions. */
function facts(bank: Fact[], n: number): Question[] {
  return sample(bank, n).map((f) => mc(f.prompt, f.right, f.wrong, f.hint));
}

// ---------- Numbers: scientific notation and real numbers ----------

function numbers8(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const COEFFS = [1.2, 1.9, 2.5, 3.2, 3.6, 4.7, 5.6, 6.1, 7.3, 8.4, 9.5];
  const ci = (c: number) => Math.round(c * 10);

  const toStandard = (): Question => {
    const c = pick(COEFFS);
    const negative = d >= 2 && chance(0.5);
    if (negative) {
      const e = randInt(2, 6);
      const zeros = (k: number) => "0".repeat(Math.max(0, k));
      const right = `0.${zeros(e - 1)}${ci(c)}`;
      return mc(`Which number is equal to ${sci(c, -e)}?`, right, [`0.${zeros(e - 2)}${ci(c)}`, `0.${zeros(e)}${ci(c)}`, spaced(ci(c) * 10 ** (e - 1))], "A negative exponent makes a number smaller than 1. Move the decimal point that many places to the left.");
    }
    const e = randInt(3, 8);
    return mc(`Which number is equal to ${sci(c, e)}?`, spaced(ci(c) * 10 ** (e - 1)), [spaced(ci(c) * 10 ** (e - 2)), spaced(ci(c) * 10 ** e), spaced(ci(c) * 10 ** (e + 1))], "A positive exponent makes a big number. Move the decimal point that many places to the right, adding zeros.");
  };
  const toSci = (): Question => {
    const c = pick(COEFFS);
    const negative = d >= 2 && chance(0.5);
    if (negative) {
      const e = randInt(2, 6);
      const standard = `0.${"0".repeat(e - 1)}${ci(c)}`;
      return mc(`Write ${standard} in scientific notation (a number from 1 up to 10, times a power of 10).`, sci(c, -e), [sci(c, -e + 1), sci(c, e), `${ci(c)} × 10${sup(-e - 1)}`], "Count how many places the decimal point moves to get a number from 1 to 10. Moving right makes the exponent negative.");
    }
    const e = randInt(3, 8);
    return mc(`Write ${spaced(ci(c) * 10 ** (e - 1))} in scientific notation (a number from 1 up to 10, times a power of 10).`, sci(c, e), [sci(c, e - 1), sci(c, e + 1), `${ci(c)} × 10${sup(e - 1)}`], "Move the decimal point until the first number is from 1 up to 10. The number of places moved is the exponent.");
  };
  const compareSci = (): Question => {
    const exps = sample(d === 1 ? [2, 3, 4, 5, 6, 7] : [-8, -6, -4, -2, 2, 4, 6, 8, 9], 3);
    const nums = exps.map((e) => ({ c: pick(COEFFS), e }));
    const greatest = chance(0.5);
    const best = nums.reduce((a, b) => ((greatest ? b.e > a.e : b.e < a.e) ? b : a));
    return mc(`Which is the ${greatest ? "greatest" : "least"} number?`, sci(best.c, best.e), nums.filter((n) => n !== best).map((n) => sci(n.c, n.e)), "Compare the exponents first. A greater exponent means a greater number, whatever the first number is.");
  };
  const scale = (): Question =>
    pick<() => Question>([
      () => mc("Compared with 1.5 × 10⁹ m, a distance of 1.5 × 10¹¹ m is…", "100 times as far", ["2 times as far", "10 times as far", "1.5 times as far"], "Subtract the exponents: 11 − 9 = 2, so it is 10² = 100 times as much."),
      () => mc("A virus is about 1 × 10⁻⁷ m wide and a bacterium is about 1 × 10⁻⁶ m wide. Which is wider?", "the bacterium, 10 times as wide", ["the virus, 10 times as wide", "the bacterium, 2 times as wide", "they are the same width"], "−6 is greater than −7, so 10⁻⁶ is the greater number. The difference of 1 in the exponents is a factor of 10."),
      () => mc("Which quantity is most likely written with a negative exponent in scientific notation?", "the width of a human hair, in metres", ["the distance from Earth to the Sun, in metres", "the number of people in Canada", "the mass of Earth, in kilograms"], "A negative exponent is for numbers smaller than 1, such as a hair's width of about 0.00008 m."),
      () => mc("Which quantity is most likely written with a large positive exponent in scientific notation?", "the distance light travels in a year, in metres", ["the thickness of a soap bubble, in metres", "the mass of a grain of sand, in kilograms", "the width of a pencil, in metres"], "Very large numbers use large positive exponents. Light travels about 9 460 000 000 000 000 m in a year."),
      () => mc("A scientist writes 6.02 × 10²³. What does the exponent 23 tell you?", "The decimal point moves 23 places to the right.", ["Multiply 6.02 by 23.", "The decimal point moves 23 places to the left.", "The number has 23 digits before the decimal point."], "The exponent counts how many places the decimal point moves. A positive exponent moves it right."),
      () => mc("Why do scientists use scientific notation?", "It makes very large and very small numbers easier to read and compare.", ["It makes numbers smaller in value.", "It only works for whole numbers.", "It rounds every number to the nearest ten."], "Scientific notation is a short way to write numbers with many zeros. The value does not change."),
    ])();
  const mental = (): Question => {
    if (chance(0.5)) {
      const q = randInt(1, 3);
      const v = (randInt(11, 999) / 10 ** q).toFixed(q);
      const k = randInt(1, 4);
      return typeIn(`Use mental math. What is ${v} × ${spaced(10 ** k)}?`, dec(Number(v) * 10 ** k), `Multiplying by ${spaced(10 ** k)} moves the decimal point ${k} place${k > 1 ? "s" : ""} to the right.`, eq(`${v} × ${10 ** k} = ?`), { keypad: "decimal" });
    }
    const q = randInt(0, 1);
    const v = (randInt(11, 999) / 10 ** q).toFixed(q);
    const k = randInt(1, 2);
    return typeIn(`Use mental math. What is ${v} ÷ ${10 ** k}?`, dec(Number(v) / 10 ** k), `Dividing by ${10 ** k} moves the decimal point ${k} place${k > 1 ? "s" : ""} to the left.`, eq(`${v} ÷ ${10 ** k} = ?`), { keypad: "decimal" });
  };
  const IRR = ["√2", "√3", "√5", "√7", "√10", "√11", "√13", "π"];
  const RAT = ["√16", "√25", "√49", "√81", "0.25", "−3/4", "1.5", "√100", "−0.6", "2/3"];
  const classify = (): Question =>
    chance(0.5)
      ? mc("Which number is irrational?", pick(IRR), sample(RAT, 3), "An irrational number cannot be written as a fraction. Its decimal never ends and never repeats. Roots of non-square numbers are irrational.")
      : mc("Which number is rational?", pick(RAT), sample(IRR, 3), "A rational number can be written as a fraction of two integers. Square roots of perfect squares, like √49 = 7, are rational.");
  const order = (): Question => {
    const pool = [
      { label: "−√5", v: -2.236 }, { label: "−1.5", v: -1.5 }, { label: "√2", v: 1.414 }, { label: "1.5", v: 1.5 }, { label: "√5", v: 2.236 }, { label: "√10", v: 3.162 }, { label: "π", v: 3.1416 }, { label: "3.2", v: 3.2 }, { label: "−√3", v: -1.732 },
    ];
    const picks = sample(pool, d === 1 ? 3 : 4).sort((a, b) => a.v - b.v);
    const q: OrderQuestion = { kind: "order", prompt: "Tap the numbers from least to greatest.", hint: "Estimate each square root: √2 is about 1.4, √5 about 2.2, √10 about 3.2. Negative numbers come first.", items: picks.map((p, i) => ({ id: `r${i}`, label: p.label })) };
    return q;
  };
  const repeating = (): Question =>
    pick<() => Question>([
      () => mc("Which describes 0.333… (the 3 repeats forever)?", "rational, because it equals 1/3", ["irrational, because it never ends", "not a real number", "an integer"], "A repeating decimal is rational because it can be written as a fraction."),
      () => mc("Which describes √2 = 1.41421356…?", "irrational, because it never ends and never repeats", ["rational, because it is a decimal", "an integer, because it starts with 1", "rational, because it can be rounded"], "Rounding a number does not change what kind of number it is. √2 cannot be written as a fraction."),
      () => mc("Every integer is…", "a rational number", ["an irrational number", "a negative number", "a decimal that never ends"], "An integer like 5 can be written as 5/1, so it is rational."),
      () => mc("Which statement is true?", "All rational numbers and all irrational numbers are real numbers.", ["Irrational numbers are rational numbers.", "Real numbers are only whole numbers.", "A number can be both rational and irrational."], "Together, the rational and irrational numbers make up the real number system."),
    ])();
  return buildSet([toStandard, toSci, compareSci, scale, mental, classify, order, d === 1 ? repeating : pick([repeating, mental])]);
}

// ---------- Integers ----------

function integers8(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const hi = d === 1 ? 9 : d === 2 ? 12 : 15;
  const nonzero = (): number => (chance(0.5) ? -1 : 1) * randInt(2, hi);
  const multiply = (): Question => {
    let a = nonzero();
    const b = nonzero();
    if (a > 0 && b > 0) a = -a;
    return typeIn("Multiply.", a * b, "Multiply the numbers, then use the signs: two negatives make a positive; one negative makes a negative.", eq(`${op(a)} × ${op(b)} = ?`), { keypad: "integer" });
  };
  const divide = (): Question => {
    let q = nonzero();
    const b = nonzero();
    if (q > 0 && b > 0) q = -q;
    return typeIn("Divide.", q, "Divide the numbers, then use the same sign rules as multiplying.", eq(`${op(q * b)} ÷ ${op(b)} = ?`), { keypad: "integer" });
  };
  const sign = (): Question => {
    const count = randInt(3, 5);
    const negatives = randInt(1, count);
    const factors = shuffle(Array.from({ length: count }, (_, i) => (i < negatives ? -1 : 1) * randInt(1, 9)));
    const neg = negatives % 2 === 1;
    return mc(`What is the sign of the product ${factors.map(op).join(" × ")}?`, neg ? "negative" : "positive", [neg ? "positive" : "negative", "zero"], "Count the negative factors. An odd number of negatives gives a negative product; an even number gives a positive product.");
  };
  const addSub = (): Question => {
    const a = randInt(-hi, hi) || 5;
    const b = nonzero();
    return chance(0.5)
      ? typeIn("Add.", a + b, "Adding a negative number is the same as subtracting. Think of a number line.", eq(`${minus(a)} + ${op(b)} = ?`), { keypad: "integer" })
      : typeIn("Subtract.", a - b, "Subtracting a negative number is the same as adding its opposite.", eq(`${minus(a)} − ${op(b)} = ?`), { keypad: "integer" });
  };
  const mixed = (): Question => {
    const a = randInt(-9, 9) || 3;
    const b = randInt(-9, 9) || 4;
    const c = nonzero();
    const e = randInt(2, 9);
    if (chance(0.5)) return typeIn("Use the order of operations.", (a + b) * c - e, "Brackets first, then multiply, then subtract.", eq(`(${minus(a)} + ${op(b)}) × ${op(c)} − ${e} = ?`), { keypad: "integer" });
    return typeIn("Use the order of operations.", a + b * c, "Multiply before you add.", eq(`${minus(a)} + ${op(b)} × ${op(c)} = ?`), { keypad: "integer" });
  };
  const context = (): Question => {
    const start = randInt(-12, 8);
    const step = randInt(2, 6);
    const hours = randInt(3, 7);
    return pick<() => Question>([
      () => typeIn(`The temperature is ${minus(start)} °C and it drops ${step} °C each hour. What is the temperature after ${hours} hours, in °C?`, start - step * hours, `Multiply ${step} × ${hours} to find the total drop, then subtract it from ${minus(start)}.`, undefined, { keypad: "integer", suffix: "°C" }),
      () => {
        const depth = step * hours + randInt(1, 8);
        return typeIn(`A diver is ${depth} m below the surface, at −${depth} m. She swims up ${step} m each minute for ${hours} minutes. Where is she now, in metres?`, step * hours - depth, `She rises ${step} × ${hours} = ${step * hours} m, so add ${step * hours} to −${depth}.`, undefined, { keypad: "integer", suffix: "m" });
      },
    ])();
  };
  const decimals = (): Question => {
    const a = pick([0.5, 1.5, 2.5, 3.5, 4.5]);
    const b = 2 * randInt(2, 8);
    const negA = chance(0.5);
    const val = (negA ? -a : a) * -b;
    return typeIn("Multiply.", val, "Multiply the numbers as if they were positive, then fix the sign.", eq(`${negA ? "(−" + a + ")" : String(a)} × (−${b}) = ?`), { keypad: "integer" });
  };
  const powers = (): Question => {
    const a = randInt(2, 6);
    return pick<() => Question>([
      () => typeIn(`What is (−${a})²?`, a * a, `(−${a})² means (−${a}) × (−${a}). Two negatives make a positive.`, undefined, { keypad: "integer" }),
      () => typeIn(`What is −${a}²?`, -(a * a), `The exponent applies only to ${a}. Find ${a}² = ${a * a}, then make it negative.`, undefined, { keypad: "integer" }),
    ])();
  };
  return buildSet([multiply, multiply, divide, addSub, mixed, context, d === 1 ? sign : pick([sign, decimals]), d === 3 ? powers : pick([divide, sign])]);
}

// ---------- Percents ----------

function percents8(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const over100 = (): Question => {
    const k = pick([125, 150, 175, 200, 250, 300]);
    const base = pick([20, 40, 60, 80, 120, 200]);
    return typeIn(`What is ${k}% of ${base}?`, (k * base) / 100, `${k}% is more than the whole. ${k}% = ${k / 100}, so multiply ${base} × ${k / 100}.`);
  };
  const under1 = (): Question => {
    const p = pick([0.5, 0.25, 0.1, 0.2, 0.75]);
    const unit = { 0.5: 200, 0.25: 400, 0.1: 1000, 0.2: 500, 0.75: 400 }[p]!;
    const base = unit * randInt(1, 9);
    return typeIn(`What is ${p}% of ${spaced(base)}?`, Math.round((p * base) / 100), `${p}% = ${p / 100} as a decimal. Multiply ${base} × ${p / 100}.`);
  };
  const convert = (): Question => {
    const bank: { q: string; right: string; wrong: string[]; hint: string }[] = [
      { q: "Which decimal is equal to 0.5%?", right: "0.005", wrong: ["0.05", "0.5", "5"], hint: "Divide by 100: move the decimal point two places left. 0.5% = 0.005." },
      { q: "Which decimal is equal to 0.2%?", right: "0.002", wrong: ["0.02", "0.2", "2"], hint: "Divide by 100: move the decimal point two places left." },
      { q: "Which decimal is equal to 175%?", right: "1.75", wrong: ["0.175", "17.5", "1.075"], hint: "Divide by 100. A percent over 100 is a decimal greater than 1." },
      { q: "Which decimal is equal to 250%?", right: "2.5", wrong: ["0.25", "25", "0.025"], hint: "250% = 250/100 = 2.5." },
      { q: "Which decimal is equal to 0.8%?", right: "0.008", wrong: ["0.08", "0.8", "8"], hint: "Divide by 100: move the decimal point two places left." },
      { q: "Which decimal is equal to 320%?", right: "3.2", wrong: ["0.32", "32", "0.032"], hint: "320% = 320/100 = 3.2." },
      { q: "Which percent is equal to 0.007?", right: "0.7%", wrong: ["7%", "0.07%", "70%"], hint: "Multiply by 100: move the decimal point two places right. 0.007 × 100 = 0.7." },
      { q: "Which percent is equal to 1.8?", right: "180%", wrong: ["18%", "1.8%", "0.18%"], hint: "Multiply by 100. A decimal greater than 1 is more than 100%." },
    ];
    const b = pick(bank);
    return mc(b.q, b.right, b.wrong, b.hint);
  };
  const fracPct = (): Question => {
    const rows: [number, number, string][] = [[5, 4, "125"], [3, 2, "150"], [7, 4, "175"], [9, 5, "180"], [11, 10, "110"], [5, 2, "250"], [1, 8, "12.5"], [3, 8, "37.5"], [5, 8, "62.5"], [7, 8, "87.5"]];
    const [n, dd, ans] = pick(rows);
    return typeIn(`Write ${n}/${dd} as a percent.`, ans, `Divide ${n} ÷ ${dd} to get a decimal, then multiply by 100.`, undefined, { keypad: "decimal", suffix: "%" });
  };
  const hst = (): Question => {
    const price = pick([20, 40, 60, 80, 100, 120, 160, 200, 240, 300, 400, 500]);
    if (chance(0.5) || d === 1) {
      const total = (price * 113) / 100;
      return typeIn(`In Ontario, HST is 13%. A game costs $${price} before tax. What is the total price, in dollars?`, dec(total), `13% of ${price} is ${dec((price * 13) / 100)}. Add it to ${price}, or multiply by 1.13.`, undefined, { keypad: "decimal", accept: dec(total) === total.toFixed(2) ? [] : [total.toFixed(2)] });
    }
    const off = pick([25, 50]);
    const sale = (price * (100 - off)) / 100;
    if (sale % 5 !== 0) return hst();
    const total = (sale * 113) / 100;
    return typeIn(`A $${price} jacket is ${off}% off. HST of 13% is added to the sale price. What is the total, in dollars?`, dec(total), `Sale price: ${price} − ${(price * off) / 100} = ${sale}. Then add 13% HST: ${sale} × 1.13.`, undefined, { keypad: "decimal", accept: dec(total) === total.toFixed(2) ? [] : [total.toFixed(2)] });
  };
  const change = (): Question => {
    const base = pick([40, 50, 80, 100, 200, 250, 400]);
    const up = chance(0.6);
    const p = up ? pick([10, 20, 25, 50, 75, 100, 150]) : pick([10, 20, 25, 40, 50]);
    const next = (base * (up ? 100 + p : 100 - p)) / 100;
    if (!Number.isInteger(next)) return change();
    return typeIn(`A town's population ${up ? "grew" : "fell"} from ${base} to ${next}. What is the percent ${up ? "increase" : "decrease"}?`, p, `Percent change = change ÷ original × 100. The change is ${Math.abs(next - base)}, and ${Math.abs(next - base)} ÷ ${base} × 100 = ${p}.`, undefined, { suffix: "%" });
  };
  const reverse = (): Question => {
    const orig = pick([40, 50, 60, 80, 100, 120, 150, 200, 250, 300]);
    const p = pick([10, 20, 25, 50]);
    const up = chance(0.4);
    const next = (orig * (up ? 100 + p : 100 - p)) / 100;
    if (!Number.isInteger(next)) return reverse();
    return typeIn(`After a ${p}% ${up ? "increase" : "discount"}, a ${up ? "ticket costs" : "game costs"} $${next}. What was the original price, in dollars?`, orig, `The new price is ${up ? 100 + p : 100 - p}% of the original. Divide $${next} by ${(up ? 100 + p : 100 - p) / 100}.`);
  };
  const deal = (): Question => {
    const price = pick([60, 80, 90, 120, 150, 200]);
    const p = pick([20, 25, 30, 40]);
    const save = (price * p) / 100;
    if (!Number.isInteger(save)) return deal();
    const coupon = save + pick([-10, -5, 5, 10]);
    if (coupon <= 0) return deal();
    const pctSaves = save > coupon;
    return mc(`A $${price} jacket can be bought with ${p}% off or with a $${coupon} coupon. Which saves more money?`, pctSaves ? `${p}% off` : `the $${coupon} coupon`, [pctSaves ? `the $${coupon} coupon` : `${p}% off`, "They save the same amount"], `Find ${p}% of ${price}: it is $${save}. Compare that with $${coupon}.`);
  };
  return buildSet([over100, under1, convert, fracPct, hst, change, d === 1 ? deal : reverse, d === 3 ? reverse : deal]);
}

// ---------- Patterns ----------

function patterns8(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const table = (rows: [number, number][]): Visual => ({ type: "table", headers: ["Term (n)", "Value"], rows });
  const growing = () => {
    const m = randInt(2, 9);
    let b = randInt(1, 12);
    while (b === m) b = randInt(1, 12);
    return { m, b, value: (n: number) => m * n + b };
  };
  const shrinking = () => {
    const m = randInt(2, 8);
    const b = 10 * m + randInt(3, 15);
    return { m, b, value: (n: number) => b - m * n };
  };
  const rateInit = (): Question => {
    const { m, b, value } = growing();
    const rows = [1, 2, 3, 4].map((n): [number, number] => [n, value(n)]);
    if (chance(0.5)) return mc("A growing pattern is shown in the table. What is the constant rate of change?", String(m), [String(m + 1), String(b), String(m + b), String(m - 1)], "The rate of change is how much the value goes up from one term to the next.", table(rows));
    return typeIn("A growing pattern is shown in the table. What is the initial value (the value when n = 0)?", b, `The value goes up by ${m} each term. Work backwards from term 1: ${m + b} − ${m} = ${b}.`, table(rows));
  };
  const shrinkRule = (): Question => {
    const m = randInt(2, 9);
    const b = 10 * m + randInt(2, 20);
    const ctx = pick([
      { text: `A pool has ${b} L of water and drains ${m} L each minute.`, v: "V" },
      { text: `A phone battery is at ${b}% and drops ${m}% each hour.`, v: "B" },
      { text: `Sam has $${b} and spends $${m} each day.`, v: "M" },
    ]);
    return mc(`${ctx.text} Which rule gives the amount ${ctx.v} after n ${ctx.v === "V" ? "minutes" : ctx.v === "B" ? "hours" : "days"}?`, `${ctx.v} = ${b} − ${m}n`, [`${ctx.v} = ${b} + ${m}n`, `${ctx.v} = ${m} − ${b}n`, `${ctx.v} = ${m}n − ${b}`], "Start with the initial amount, then subtract the rate times n.");
  };
  const compare = (): Question => {
    const a0 = randInt(2, 12);
    let b0 = randInt(2, 12);
    const ra = randInt(2, 6);
    let rb = randInt(2, 6);
    while (b0 === a0) b0 = randInt(2, 12);
    while (rb === ra) rb = randInt(2, 6);
    const fasterA = ra > rb;
    const higherA = a0 > b0;
    const label = (fa: boolean, ha: boolean) => `${fa ? "A" : "B"} grows faster and ${ha ? "A" : "B"} starts higher`;
    const right = label(fasterA, higherA);
    return mc(`Pattern A starts at ${a0} and grows by ${ra} each term. Pattern B starts at ${b0} and grows by ${rb} each term. Which statement is true?`, right, [label(!fasterA, higherA), label(fasterA, !higherA), label(!fasterA, !higherA)], "Compare the rates of change to see which grows faster, and compare the initial values to see which starts higher.");
  };
  const extend = (): Question => {
    const k = randInt(8, 20);
    return pick<() => Question>([
      () => {
        const m = randInt(2, 9);
        const b = randInt(1, 15);
        return typeIn(`A pattern follows the rule value = ${m}n + ${b}. What is the value of term ${k}?`, m * k + b, `Put n = ${k} into the rule: ${m} × ${k} + ${b}.`);
      },
      () => {
        const m10 = pick([5, 15, 25, 35]);
        const b10 = pick([5, 15, 25]);
        return typeIn(`A pattern follows the rule value = ${dec(m10 / 10)}n + ${dec(b10 / 10)}. What is the value of term ${k}?`, dec((m10 * k + b10) / 10), `Put n = ${k} into the rule, multiply first, then add.`, undefined, { keypad: "decimal" });
      },
      () => {
        const { m, b, value } = shrinking();
        const t = randInt(5, 10);
        return typeIn(`A shrinking pattern follows the rule value = ${b} − ${m}n. What is the value of term ${t}?`, value(t), `Put n = ${t} into the rule: ${b} − ${m} × ${t}.`);
      },
    ])();
  };
  const tableValue = (): Question => {
    const p = chance(0.5) ? growing() : shrinking();
    const rows = [1, 2, 3, 4].map((n): [number, number] => [n, p.value(n)]);
    const grows = p.value(2) > p.value(1);
    return typeIn(`The table shows a ${grows ? "growing" : "shrinking"} pattern. What is the value of term 10?`, p.value(10), `The value ${grows ? "goes up" : "goes down"} by ${p.m} each term. Find the rule, then put n = 10 into it.`, table(rows));
  };
  const findTerm = (): Question => {
    const m = randInt(2, 9);
    const b = randInt(1, 15);
    const n = randInt(6, 25);
    return typeIn(`A pattern follows the rule value = ${m}n + ${b}. Which term has a value of ${m * n + b}?`, n, `Solve ${m}n + ${b} = ${m * n + b}. Subtract ${b}, then divide by ${m}.`);
  };
  const ruleFromTable = (): Question => {
    if (chance(0.5)) {
      const { m, b, value } = growing();
      const rows = [1, 2, 3, 4].map((n): [number, number] => [n, value(n)]);
      return mc("Which rule matches the table?", `v = ${m}n + ${b}`, [`v = ${m}n − ${b}`, `v = ${b}n + ${m}`, `v = ${m + b}n`], "Find the rate of change (the number in front of n), then check term 1 to find the constant.", table(rows));
    }
    const m = randInt(2, 8);
    const b = 4 * m + randInt(2, 10);
    const rows = [1, 2, 3, 4].map((n): [number, number] => [n, b - m * n]);
    return mc("Which rule matches the table?", `v = ${b} − ${m}n`, [`v = ${b} + ${m}n`, `v = ${m}n − ${b}`, `v = ${m} − ${b}n`], "The values go down by the same amount each term. Start from the initial value and subtract that rate times n.", table(rows));
  };
  const repeating = (): Question => {
    const shapes = sample(["🔺", "🟦", "🟢", "⭐", "🔶", "🟣"], randInt(3, 4));
    const L = shapes.length;
    const k = randInt(20, 60);
    const right = shapes[(k - 1) % L];
    return mc(`What is the ${ordinal(k)} shape in this repeating pattern?`, right, shapes.filter((s) => s !== right), `The pattern repeats every ${L} shapes. Divide ${k} by ${L} and look at the remainder: remainder ${k % L === 0 ? 0 : k % L} means ${k % L === 0 ? `the last shape of the group` : `the ${ordinal(k % L)} shape of the group`}.`, { type: "emojiRow", items: [...shapes, ...shapes], showBlank: true });
  };
  const rational = (): Question => {
    const s = pick([1, 2, 3, 4, 5]);
    const r = pick([0.25, 0.5, 0.75, 1.5]);
    const terms = [0, 1, 2, 3].map((i) => dec(s - i * r));
    return mc(`Which describes the pattern ${terms.join(", ")}, …?`, `starts at ${s} and decreases by ${dec(r)} each term`, [`starts at ${s} and increases by ${dec(r)} each term`, `starts at ${dec(r)} and decreases by ${s} each term`, `starts at ${s} and decreases by ${dec(s - r)} each term`], "Subtract each term from the one before it to find the rate of change.");
  };
  return buildSet([rateInit, shrinkRule, compare, extend, tableValue, d === 1 ? repeating : findTerm, ruleFromTable, d === 3 ? rational : pick([rational, repeating])]);
}

// ---------- Algebra ----------

function algebra8(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const term = (c: number, v: string): string => (c === 0 ? "0" : c === 1 ? v : c === -1 ? `−${v}` : `${minus(c)}${v}`);
  const binom = (c: number, k: number, v: string): string => (c === 0 ? minus(k) : k === 0 ? term(c, v) : `${term(c, v)} ${signed(k)}`);
  const monomials = (): Question => {
    const v = pick(["x", "n", "y", "a"]);
    const hi = d === 1 ? 8 : 12;
    let a = randInt(-hi, hi) || 3;
    let b = randInt(-hi, hi) || -2;
    while (a + b === 0) b = randInt(-hi, hi) || 4;
    const r = a + b;
    const add = chance(0.5);
    if (!add) {
      if (a === b) a += 1;
      const right = term(a - b, v);
      return mc(`Simplify ${term(a, v)} − (${term(b, v)}).`, right, [term(a + b, v), term(-(a - b), v), `${term(a - b, v)}²`], "Subtracting a term means adding its opposite. Combine the numbers in front; the letter stays.", eq(`${term(a, v)} − (${term(b, v)})`));
    }
    return mc(`Simplify ${term(a, v)} + (${term(b, v)}).`, term(r, v), [term(a - b, v), term(-r, v), `${term(r, v)}²`], "Combine like terms: add the numbers in front. The letter stays the same.", eq(`${term(a, v)} + (${term(b, v)})`));
  };
  const binomials = (): Question => {
    const v = pick(["x", "n", "a"]);
    const a1 = randInt(-6, 8) || 2;
    let b1 = randInt(-6, 8) || 3;
    while (a1 + b1 === 0) b1 = randInt(1, 8);
    const a2 = randInt(-9, 9) || 4;
    let b2 = randInt(-9, 9) || -5;
    while (a2 + b2 === 0) b2 = randInt(1, 9);
    const c = a1 + b1;
    const k = a2 + b2;
    return mc(`Add: (${binom(a1, a2, v)}) + (${binom(b1, b2, v)})`, binom(c, k, v), [binom(c, -k, v), binom(c, a2 - b2, v), `${term(c + k, v)}`, binom(c, k, v) + "²"], "Add the terms with the letter together, then add the numbers on their own.", eq(`(${binom(a1, a2, v)}) + (${binom(b1, b2, v)})`));
  };
  const evaluate = (): Question => {
    if (chance(0.5)) {
      const p = randInt(2, 6);
      const q = randInt(2, 6);
      const a = -randInt(1, 6);
      const b = randInt(1, 8);
      return typeIn(`Evaluate ${p}a + ${q}b when a = ${minus(a)} and b = ${b}.`, p * a + q * b, `Put in the values: ${p} × (${minus(a)}) + ${q} × ${b}. Multiply first, then add.`, eq(`${p}a + ${q}b, a = ${minus(a)}, b = ${b}`), { keypad: "integer" });
    }
    const m10 = pick([5, 15, 25, 35]);
    const x = randInt(2, 9);
    const b10 = pick([5, 15, 25]);
    const ans10 = m10 * x - b10;
    return typeIn(`Evaluate ${dec(m10 / 10)}x − ${dec(b10 / 10)} when x = ${x}.`, dec(ans10 / 10), `Put in x = ${x}: ${dec(m10 / 10)} × ${x} − ${dec(b10 / 10)}. Multiply first, then subtract.`, eq(`${dec(m10 / 10)}x − ${dec(b10 / 10)}, x = ${x}`), { keypad: "decimal" });
  };
  const bothSides = (): Question => {
    const c = randInt(1, 5);
    const k = randInt(2, 6);
    const a = c + k;
    const x = (chance(0.7) ? 1 : -1) * randInt(2, 9);
    const b = randInt(1, 15) * (chance(0.5) ? 1 : -1);
    const dd = k * x + b;
    if (dd === 0) return bothSides();
    return typeIn("Solve for x.", x, `Subtract ${c}x from both sides to get one x term. Then undo the addition or subtraction, and divide.`, eq(`${a}x ${signed(b)} = ${c}x ${signed(dd)}`), { keypad: "integer" });
  };
  const decimalEq = (): Question => {
    const a10 = pick([5, 15, 25]);
    const x = randInt(2, 12);
    const b10 = pick([5, 15, 25, 35, 45]);
    const c10 = a10 * x + b10;
    return typeIn("Solve for x.", x, `Subtract ${dec(b10 / 10)} from both sides, then divide by ${dec(a10 / 10)}.`, eq(`${dec(a10 / 10)}x + ${dec(b10 / 10)} = ${dec(c10 / 10)}`));
  };
  const distribute = (): Question => {
    const a = randInt(2, 6);
    const x = randInt(-5, 12) || 7;
    const b = randInt(1, 9) * (chance(0.5) ? 1 : -1);
    const c = a * (x + b);
    return typeIn("Solve for x.", x, `Divide both sides by ${a} first: x ${signed(b)} = ${x + b}. Then undo the ${b < 0 ? "subtraction" : "addition"}.`, eq(`${a}(x ${signed(b)}) = ${minus(c)}`), { keypad: "integer" });
  };
  const verify = (): Question => {
    const x = randInt(-8, 9) || 5;
    const a = randInt(2, 8);
    const b = randInt(1, 9);
    const claim = chance(0.5) ? x : x + pick([-2, -1, 1, 2]);
    const right = claim === x;
    return mc(`Is x = ${minus(claim)} a solution of ${a}x + ${b} = ${minus(a * x + b)}?`, right ? "Yes" : "No", [right ? "No" : "Yes"], `Put ${minus(claim)} in for x and check whether both sides are equal.`);
  };
  const inequality = (): Question => {
    const negCoef = d >= 2 && chance(0.4);
    const a = randInt(2, 5);
    const t = (chance(0.7) ? 1 : -1) * randInt(1, 8);
    const b = randInt(1, 9);
    const OPS = ["<", ">", "≤", "≥"] as const;
    const flip: Record<string, string> = { "<": ">", ">": "<", "≤": "≥", "≥": "≤" };
    const strict: Record<string, string> = { "<": "≤", ">": "≥", "≤": "<", "≥": ">" };
    const o = pick(OPS);
    if (negCoef) {
      // −a·x + b o c has solution x (flip o) t
      const c = -a * t + b;
      const ans = flip[o];
      return mc("Solve the inequality.", `x ${ans} ${minus(t)}`, [`x ${o} ${minus(t)}`, `x ${strict[ans]} ${minus(t)}`, `x ${ans} ${minus(-a * t)}`], "Divide both sides by the negative number and reverse the inequality sign.", eq(`−${a}x + ${b} ${o} ${minus(c)}`));
    }
    const c = a * t + b;
    return mc("Solve the inequality.", `x ${o} ${minus(t)}`, [`x ${flip[o]} ${minus(t)}`, `x ${strict[o]} ${minus(t)}`, `x ${o} ${minus(c - b)}`], "Solve like an equation. The sign stays the same when you divide by a positive number.", eq(`${a}x + ${b} ${o} ${minus(c)}`));
  };
  const graph = (): Question => {
    const t = randInt(-6, 6);
    const kind = pick([">", "<", "≥", "≤"] as const);
    const open = kind === ">" || kind === "<";
    const dir = kind === ">" || kind === "≥" ? "right" : "left";
    const other = dir === "right" ? "left" : "right";
    return mc(`Which graph shows the solution of x ${kind} ${minus(t)} on a number line?`, `${open ? "an open" : "a closed"} circle at ${minus(t)} with an arrow pointing ${dir}`, [`${open ? "a closed" : "an open"} circle at ${minus(t)} with an arrow pointing ${dir}`, `${open ? "an open" : "a closed"} circle at ${minus(t)} with an arrow pointing ${other}`], "An open circle leaves out the number; a closed circle includes it. The arrow points toward the numbers that work.");
  };
  const solution = (): Question => {
    const t = randInt(-5, 5);
    const o = pick([">", "≥", "<", "≤"] as const);
    const ok = (n: number) => (o === ">" ? n > t : o === "≥" ? n >= t : o === "<" ? n < t : n <= t);
    const right = o === ">" || o === "≥" ? t + randInt(1, 4) : t - randInt(1, 4);
    const wrongs = [t + (o === ">" || o === "≥" ? -randInt(1, 3) : randInt(1, 3)), o === ">" || o === "<" ? t : t + (o === "≥" ? -1 : 1)];
    return mc(`Which of these is a solution of x ${o} ${minus(t)}?`, minus(right), wrongs.filter((w) => !ok(w)).map(minus), "Put each number in for x and check whether the inequality is true.");
  };
  return buildSet([monomials, binomials, evaluate, d === 1 ? decimalEq : bothSides, d === 3 ? distribute : pick([decimalEq, distribute]), d === 1 ? verify : inequality, graph, d === 3 ? inequality : solution]);
}

// ---------- Data: scatter plots and analysis ----------

const DATA_ONE_TWO: { one: string; two: string }[] = [
  { one: "What is each student's favourite lunch?", two: "Do students who sleep more hours get higher test scores?" },
  { one: "How many students ride the bus each day?", two: "How does a plant's height change with the hours of sunlight it gets?" },
  { one: "What is the median height of the players on a team?", two: "Is a player's height related to the number of rebounds they get?" },
  { one: "What colour is each car in the parking lot?", two: "How does the age of a car relate to its resale price?" },
  { one: "How long is each student's walk to school?", two: "Do students who live farther away spend longer travelling to school?" },
];

const DATA_GRAPH: Fact[] = [
  { prompt: "Which graph is best for showing how height and arm span are related for 30 students?", right: "a scatter plot", wrong: ["a circle graph", "a pictograph", "a bar graph of the heights only"], hint: "A scatter plot shows two numerical variables as points, so you can look for a relationship." },
  { prompt: "Which graph is best for showing what part of a monthly budget goes to each category?", right: "a circle graph", wrong: ["a scatter plot", "a line graph", "a histogram"], hint: "A circle graph shows parts of a whole." },
  { prompt: "Which graph is best for showing how the temperature in a town changes over 24 hours?", right: "a line graph", wrong: ["a circle graph", "a pictograph", "a scatter plot with no order"], hint: "A line graph shows change over time." },
  { prompt: "Which graph is best for comparing the number of students in each club?", right: "a bar graph", wrong: ["a scatter plot", "a line graph", "a circle graph with no percents"], hint: "A bar graph compares amounts for separate categories." },
  { prompt: "A student collects data on hours of practice and number of free throws made. Which graph best shows whether the two are related?", right: "a scatter plot", wrong: ["a pictograph", "a circle graph", "a bar graph with one bar"], hint: "Two numerical variables measured for each person fit a scatter plot." },
];

const DATA_MISLEADING: Fact[] = [
  { prompt: "A bar graph's vertical axis starts at 90 instead of 0. What effect can this have?", right: "Small differences look much larger than they are.", wrong: ["Large differences look smaller than they are.", "It has no effect on how the graph looks.", "The bars become impossible to compare."], hint: "A bar's height should match its value. Cutting off the bottom exaggerates differences." },
  { prompt: "A line graph uses a very stretched vertical scale. What can this do?", right: "Make a small change look dramatic.", wrong: ["Hide every change in the data.", "Make the data more accurate.", "Turn the data into a circle graph."], hint: "Stretching a scale makes small changes look steep." },
  { prompt: "A pictograph shows twice as many sales using a picture twice as wide and twice as tall. Why is this misleading?", right: "The picture's area is four times as large, so it looks like more than double.", wrong: ["The picture is the wrong shape.", "Pictographs cannot show sales.", "Twice as wide always means twice as many."], hint: "Doubling both width and height multiplies the area by 4." },
  { prompt: "A graph has no title and no labels on its axes. What is the problem?", right: "Readers cannot tell what the data shows.", wrong: ["The data must be wrong.", "The graph must be a scatter plot.", "Nothing, because the shape tells the story."], hint: "A good graph has a title, labels, units and a source." },
  { prompt: "A survey asks only people leaving a gym whether exercise is important. Why might conclusions be misleading?", right: "The sample is biased toward people who already exercise.", wrong: ["Gym members cannot answer surveys.", "The sample is too varied.", "Surveys never show opinions."], hint: "Check who was asked and how the data was collected." },
  { prompt: "Which should you check first when a graph seems surprising?", right: "the scale, the labels and the source", wrong: ["the colours used", "how large the graph is", "whether it has a border"], hint: "Scales, labels and sources tell you if the graph is fair." },
];

const DATA_FACTS: Fact[] = [
  { prompt: "Which variable is continuous?", right: "the time it takes to run 100 m", wrong: ["the number of goals scored in a game", "the number of siblings a student has", "the number of students in a class"], hint: "Continuous data can be any value in a range, like 12.37 seconds. Counts are whole numbers." },
  { prompt: "Which variable is continuous?", right: "the mass of an apple", wrong: ["the number of apples in a bag", "the number of seeds in an apple", "the number of trees in an orchard"], hint: "You measure continuous data. You count discrete data." },
  { prompt: "Which variable is continuous?", right: "the height of a plant", wrong: ["the number of leaves on a plant", "the number of plants on a shelf", "the number of flowers that open"], hint: "Heights can be measured to any precision, so they are continuous." },
  { prompt: "What is the purpose of an infographic?", right: "to tell a story about data using tables, graphs and images", wrong: ["to list raw data with no explanation", "to replace the data collection", "to hide small values"], hint: "An infographic combines visuals and text to communicate the main message." },
  { prompt: "Every graph should show…", right: "a title, labelled axes, a suitable scale and a source", wrong: ["only the data points", "the most colourful design", "the largest values at the left"], hint: "These features let readers understand and trust the graph." },
  { prompt: "A data set is collected with a table of values. What goes in each row of a table for two-variable data?", right: "a pair of values, one for each variable", wrong: ["only the largest value", "the mean of the data", "a single value for both variables"], hint: "Each row records one pair, like a student's height and arm span." },
];

function data8(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const oneTwo = (): Question => {
    const s = pick(DATA_ONE_TWO);
    const wantTwo = chance(0.6);
    return mc(wantTwo ? "Which question needs two-variable data?" : "Which question needs only one-variable data?", wantTwo ? s.two : s.one, [wantTwo ? s.one : s.two, ...sample(DATA_ONE_TWO.filter((x) => x !== s), 1).map((x) => (wantTwo ? x.one : x.two))], "One-variable data describes one thing for each person or object. Two-variable data pairs two measurements to look for a relationship.");
  };
  const relation = (): Question => {
    const dirs = [
      { id: "positive", up: "go up too" },
      { id: "negative", up: "go down" },
    ];
    if (chance(0.25)) {
      return mc("The points on a scatter plot are spread out with no pattern. How would you describe the relationship?", "none", ["strong positive", "strong negative", "weak positive"], "If one variable does not predict the other, there is no relationship.");
    }
    const dir = pick(dirs);
    const strong = chance(0.5);
    const right = `${strong ? "strong" : "weak"} ${dir.id}`;
    const all = ["strong positive", "weak positive", "strong negative", "weak negative", "none"];
    return mc(`On a scatter plot, as the x-values increase, the y-values ${dir.up}. The points ${strong ? "lie very close to a line" : "are loosely scattered around a line"}. How would you describe the relationship?`, right, all.filter((a) => a !== right), "Positive means both go up together; negative means one goes up as the other goes down. Strong means the points are close to a line.");
  };
  const context = (): Question => {
    const items = [
      { text: "the number of hours a student studies and their test mark", right: "positive" },
      { text: "the outside temperature and the number of layers of clothing people wear", right: "negative" },
      { text: "the age of a used car and its price", right: "negative" },
      { text: "the number of hours spent reading and the length of a person's arm", right: "none" },
      { text: "the height of a person and their shoe size", right: "positive" },
      { text: "the speed of a runner and the time to finish a race", right: "negative" },
    ];
    const it = pick(items);
    return mc(`Which best describes the relationship between ${it.text}?`, it.right === "none" ? "no relationship" : `a ${it.right} relationship`, ["a positive relationship", "a negative relationship", "no relationship"], "Ask: as one goes up, what does the other tend to do? If nothing, there is no relationship.");
  };
  const outlier = (): Question => {
    const m = randInt(2, 4);
    const b = randInt(1, 6);
    const n = 6;
    const odd = randInt(2, n);
    const rows: [number, number][] = [];
    for (let x = 1; x <= n; x++) rows.push([x, x === odd ? m * x + b + pick([-1, 1]) * randInt(12, 20) : m * x + b]);
    const bad = rows[odd - 1];
    const visual: Visual = { type: "table", title: "Points on a scatter plot", headers: ["x", "y"], rows };
    return mc("All of the points but one lie on a line. Which point is the outlier?", pt(bad[0], bad[1]), rows.filter((r) => r !== bad).map((r) => pt(r[0], r[1])), "An outlier does not fit the pattern of the other points. Find the point that is far from the line the others make.", visual);
  };
  const outlierEffect = (): Question =>
    pick<() => Question>([
      () => mc("A scatter plot shows a strong positive relationship, but one outlier lies far from the line. What happens if the outlier is removed?", "The relationship looks stronger.", ["The relationship looks weaker.", "The relationship becomes negative.", "Nothing changes at all."], "The outlier pulls the pattern away from a line. Without it, the other points fit the line more closely."),
      () => mc("Why should you investigate an outlier before removing it?", "It might be an error, or it might be an important true value.", ["Outliers are always mistakes.", "Outliers are never important.", "Removing it makes the data more honest."], "An outlier can come from a measuring mistake or a real unusual case. Find out which."),
    ])();
  const predict = (): Question => {
    const m = randInt(2, 7);
    const b = randInt(1, 9);
    const rows: [number, number][] = [1, 2, 3, 4, 5].map((x) => [x, m * x + b]);
    return typeIn("The points of a scatter plot fall exactly on a line. Use the table to predict y when x = 10.", m * 10 + b, `y goes up by ${m} each time x goes up by 1. From x = 5, add ${m} five more times: ${m * 5 + b} + ${m * 5} = ${m * 10 + b}.`, { type: "table", headers: ["x", "y"], rows });
  };
  return buildSet([oneTwo, ...facts(DATA_GRAPH, 1).map((q) => () => q), relation, relation, d === 1 ? context : outlier, ...facts(DATA_MISLEADING, 1).map((q) => () => q), () => facts(DATA_FACTS, 1)[0], d === 3 ? predict : pick([context, outlierEffect, () => facts(DATA_FACTS, 1)[0]])]);
}

// ---------- Probability: multiple events ----------

function chance8(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const venn = (): Question => {
    const total = pick([30, 32, 36, 40]);
    const both = randInt(2, 7);
    const a = both + randInt(4, 14);
    const b = both + randInt(3, 12);
    if (a + b - both >= total) return venn();
    const NAMES2 = [["soccer", "basketball"], ["art", "music"], ["chess", "robotics"]];
    const [n1, n2] = pick(NAMES2);
    const mode = pick(["neither", "only1", "either"] as const);
    const either = a + b - both;
    const ans = mode === "neither" ? total - either : mode === "only1" ? a - both : either;
    const ask = mode === "neither" ? `How many students are in neither club?` : mode === "only1" ? `How many students are in only ${n1}?` : `How many students are in at least one of the clubs?`;
    return typeIn(`In a class of ${total}, ${a} students are in ${n1} club and ${b} are in ${n2} club. ${both} students are in both clubs. ${ask}`, ans, "Draw a Venn diagram. Start with the overlap, then fill in the rest of each circle. Parts add to the total.");
  };
  const independent = (): Question => {
    const sides = pick([4, 5, 6, 8]);
    const cases = [
      { text: `A coin is flipped and a die is rolled. What is P(heads and a 6)?`, n: 1, dd: 12 },
      { text: `A coin is flipped twice. What is P(two heads)?`, n: 1, dd: 4 },
      { text: `A spinner has ${sides} equal sections numbered 1 to ${sides}. It is spun, and a coin is flipped. What is P(a 1 and tails)?`, n: 1, dd: 2 * sides },
      { text: `A die is rolled twice. What is P(a 6 both times)?`, n: 1, dd: 36 },
      { text: `A spinner is half red, a quarter blue and a quarter green. It is spun twice. What is P(red both times)?`, n: 1, dd: 4 },
    ];
    const c = pick(cases);
    const f = fracAnswer(c.n, c.dd);
    return typeIn(`${c.text} Type a fraction.`, f.ans, "For independent events, multiply the probabilities of each event.", undefined, { keypad: "fraction", accept: f.accept });
  };
  const without = (): Question => {
    const r = randInt(3, 6);
    const b = randInt(3, 7);
    const n = r + b;
    const f = fracAnswer(r * (r - 1), n * (n - 1));
    return typeIn(`A bag has ${r} red and ${b} blue marbles. Two marbles are drawn one after the other without putting the first back. What is P(both red)? Type a fraction in lowest terms.`, f.ans, `P(first red) = ${r}/${n}. With one red gone, P(second red) = ${r - 1}/${n - 1}. Multiply them.`, undefined, { keypad: "fraction", accept: f.accept });
  };
  const withReplacement = (): Question => {
    const r = randInt(2, 5);
    const b = randInt(3, 7);
    const n = r + b;
    const f = fracAnswer(r * r, n * n);
    return typeIn(`A bag has ${r} red and ${b} blue marbles. A marble is drawn, put back, and a second is drawn. What is P(both red)? Type a fraction in lowest terms.`, f.ans, `The first marble is put back, so both draws have probability ${r}/${n}. Multiply ${r}/${n} × ${r}/${n}.`, undefined, { keypad: "fraction", accept: f.accept });
  };
  const classify = (): Question => {
    const items = [
      { text: "rolling a die twice", right: "independent" },
      { text: "flipping a coin and then spinning a spinner", right: "independent" },
      { text: "drawing two cards from a deck without putting the first back", right: "dependent" },
      { text: "choosing a name from a hat, keeping it out, then choosing a second name", right: "dependent" },
      { text: "taking a sock from a drawer, putting it back, then taking another", right: "independent" },
      { text: "picking a winner and then picking a runner-up from the same group", right: "dependent" },
    ];
    const it = pick(items);
    return mc(`Are these events independent or dependent? ${it.text[0].toUpperCase()}${it.text.slice(1)}.`, it.right, [it.right === "independent" ? "dependent" : "independent"], "Events are dependent when the first outcome changes the probability of the second. Putting an item back makes events independent.");
  };
  const experimental = (): Question => {
    const trials = pick([20, 40, 50, 60, 100]);
    const hits = randInt(3, Math.floor(trials / 2));
    if (chance(0.5)) {
      const f = fracAnswer(hits, trials);
      return typeIn(`A spinner is spun ${trials} times and lands on green ${hits} times. What is the experimental probability of green? Type a fraction in lowest terms.`, f.ans, "Experimental probability = number of times it happened ÷ number of trials.", undefined, { keypad: "fraction", accept: f.accept });
    }
    return mc("Which experiment is likely to give an experimental probability closest to the theoretical probability?", "one with many trials", ["one with very few trials", "one stopped as soon as the result looks good", "one that is run only once"], "The more trials you do, the closer experimental results usually get to theoretical probability.");
  };
  const tree = (): Question => {
    const a = randInt(2, 4);
    const b = randInt(2, 4);
    const c = randInt(2, 3);
    return typeIn(`A tree diagram shows a choice of ${a} shirts, then ${b} pants, then ${c} hats. How many different outfits are there?`, a * b * c, "Multiply the number of branches at each step.");
  };
  const vennProb = (): Question => {
    const total = pick([20, 25, 40]);
    const both = pick([2, 3, 4]);
    const a = pick([7, 8, 9, 10]);
    const b = pick([5, 6, 7]);
    const either = a + b - both;
    const f = fracAnswer(either, total);
    return typeIn(`Of ${total} students, ${a} like pizza, ${b} like tacos and ${both} like both. What is the probability that a student chosen at random likes pizza or tacos? Type a fraction in lowest terms.`, f.ans, `Pizza or tacos = ${a} + ${b} − ${both} = ${either} students (the ones who like both were counted twice).`, undefined, { keypad: "fraction", accept: f.accept });
  };
  return buildSet([venn, independent, without, withReplacement, classify, d === 1 ? tree : experimental, d === 3 ? vennProb : pick([tree, vennProb]), d === 1 ? venn : pick([independent, without])]);
}

// ---------- Transformations and tessellations ----------

const TESSELLATION: Fact[] = [
  { prompt: "Which regular polygon can tessellate (cover a plane with no gaps or overlaps) on its own?", right: "a hexagon", wrong: ["a pentagon", "an octagon", "a heptagon"], hint: "The angles that meet at a point must add to 360°. Each angle of a regular hexagon is 120°, and 3 × 120° = 360°." },
  { prompt: "Why can't regular pentagons tessellate on their own?", right: "Their angles of 108° do not add to exactly 360° at a point.", wrong: ["Their sides are too long.", "Pentagons have too few sides.", "Their angles are too small to meet."], hint: "3 × 108° = 324°, which leaves a gap, and 4 × 108° = 432°, which overlaps." },
  { prompt: "What do the angles that meet at one point in a tessellation add to?", right: "360°", wrong: ["180°", "90°", "720°"], hint: "There is a full turn around any point." },
  { prompt: "Each angle of a regular hexagon is 120°. How many hexagons meet at each point in a hexagon tessellation?", right: "3", wrong: ["2", "4", "6"], hint: "Divide 360° by 120°." },
  { prompt: "Squares tessellate because each angle is 90°. How many squares meet at each point?", right: "4", wrong: ["3", "6", "8"], hint: "Divide 360° by 90°." },
  { prompt: "Regular octagons alone leave square-shaped gaps. What can be added to make a tessellation?", right: "squares", wrong: ["circles", "more octagons turned over", "pentagons"], hint: "Octagon angles are 135° and square angles are 90°; 135° + 135° + 90° = 360°." },
  { prompt: "Rows of identical bricks in a wall are each slid along without turning. Which transformation is that?", right: "translation", wrong: ["reflection", "rotation", "dilation"], hint: "A translation slides a shape without turning or flipping it." },
  { prompt: "In a tiling of triangles, every second triangle is a flipped copy of the one next to it across a shared side. Which transformation links them?", right: "reflection", wrong: ["translation", "dilation", "a slide"], hint: "A reflection flips a shape over a line, like a mirror." },
  { prompt: "In a pinwheel tiling, each tile is a copy of the one before it, turned around a centre point. Which transformation is that?", right: "rotation", wrong: ["translation", "reflection", "dilation"], hint: "A rotation turns a shape around a point." },
  { prompt: "A tessellation uses copies that are all the same size. Which transformation is NOT needed to make it?", right: "dilation", wrong: ["translation", "reflection", "rotation"], hint: "A dilation changes size. The copies in a tessellation are congruent, so the size stays the same." },
];

function transformations8(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const point = (): { x: number; y: number } => {
    const x = (chance(0.5) ? 1 : -1) * randInt(1, 6);
    let y = (chance(0.5) ? 1 : -1) * randInt(1, 6);
    while (Math.abs(x) === Math.abs(y)) y = (chance(0.5) ? 1 : -1) * randInt(1, 6);
    return { x, y };
  };
  const grid = (x: number, y: number): Visual => ({ type: "grid", size: 9, min: -9, points: [{ x, y, label: "A" }] });
  const translate = (): Question => {
    const { x, y } = point();
    const dx = (chance(0.5) ? 1 : -1) * randInt(1, 5);
    const dy = (chance(0.5) ? 1 : -1) * randInt(1, 5);
    return mc(`Point A${pt(x, y)} is translated ${Math.abs(dx)} unit${Math.abs(dx) > 1 ? "s" : ""} ${dx > 0 ? "right" : "left"} and ${Math.abs(dy)} unit${Math.abs(dy) > 1 ? "s" : ""} ${dy > 0 ? "up" : "down"}. What are the coordinates of A′?`, pt(x + dx, y + dy), [pt(x - dx, y + dy), pt(x + dx, y - dy), pt(x + dy, y + dx), pt(x - dx, y - dy)], "Right and up add to the coordinates. Left and down subtract: x changes for left and right, y changes for up and down.", grid(x, y));
  };
  const reflect = (): Question => {
    const { x, y } = point();
    const axis = pick(["x-axis", "y-axis"]);
    const right = axis === "x-axis" ? pt(x, -y) : pt(-x, y);
    const wrong = [axis === "x-axis" ? pt(-x, y) : pt(x, -y), pt(-x, -y), pt(y, x)];
    return mc(`Point A${pt(x, y)} is reflected in the ${axis}. What are the coordinates of A′?`, right, wrong, axis === "x-axis" ? "A reflection in the x-axis flips the point up or down: the y-coordinate changes sign." : "A reflection in the y-axis flips the point left or right: the x-coordinate changes sign.", grid(x, y));
  };
  const rotate = (): Question => {
    const { x, y } = point();
    const kinds = [
      { text: "90° clockwise", img: pt(y, -x) },
      { text: "90° counterclockwise", img: pt(-y, x) },
      { text: "180°", img: pt(-x, -y) },
    ];
    const k = pick(kinds);
    const wrong = [...kinds.filter((o) => o !== k).map((o) => o.img), pt(x, -y), pt(-x, y)];
    return mc(`Point A${pt(x, y)} is rotated ${k.text} about the origin. What are the coordinates of A′?`, k.img, shuffle(wrong), "Turn the grid in your mind. A 180° turn changes both signs. A 90° turn swaps the coordinates and changes one sign.", grid(x, y));
  };
  const dilate = (): Question => {
    if (d >= 2 && chance(0.4)) {
      const x = 2 * (chance(0.5) ? 1 : -1) * randInt(1, 4);
      const y = 2 * (chance(0.5) ? 1 : -1) * randInt(1, 4);
      if (Math.abs(x) === Math.abs(y)) return dilate();
      return mc(`Point A${pt(x, y)} is dilated by a scale factor of 1/2 about the origin. What are the coordinates of A′?`, pt(x / 2, y / 2), [pt(2 * x, 2 * y), pt(x - 2, y - 2), pt(x / 2, y)], "Multiply each coordinate by the scale factor. A factor less than 1 shrinks the figure toward the origin.", grid(x, y));
    }
    const { x, y } = point();
    const k = pick([2, 3]);
    return mc(`Point A${pt(x, y)} is dilated by a scale factor of ${k} about the origin. What are the coordinates of A′?`, pt(x * k, y * k), [pt(x + k, y + k), pt(x * k, y), pt(x, y * k)], "Multiply each coordinate by the scale factor.", grid(x, y));
  };
  const rule = (): Question =>
    pick<() => Question>([
      () => mc("Which rule describes a reflection in the y-axis?", "(x, y) → (−x, y)", ["(x, y) → (x, −y)", "(x, y) → (−x, −y)", "(x, y) → (y, x)"], "A reflection in the y-axis keeps the height the same and flips left and right."),
      () => mc("Which rule describes a reflection in the x-axis?", "(x, y) → (x, −y)", ["(x, y) → (−x, y)", "(x, y) → (−x, −y)", "(x, y) → (y, x)"], "A reflection in the x-axis keeps the left-right position and flips up and down."),
      () => mc("Which rule describes a rotation of 180° about the origin?", "(x, y) → (−x, −y)", ["(x, y) → (−x, y)", "(x, y) → (y, x)", "(x, y) → (x, −y)"], "A half turn takes a point to the opposite side of the origin."),
      () => mc("Which rule describes a dilation by a scale factor of 3 about the origin?", "(x, y) → (3x, 3y)", ["(x, y) → (x + 3, y + 3)", "(x, y) → (3x, y)", "(x, y) → (x/3, y/3)"], "A dilation multiplies both coordinates by the scale factor."),
    ])();
  const sizes = (): Question => {
    const k = randInt(2, 5);
    const side = randInt(2, 9);
    if (chance(0.5)) return typeIn(`A rectangle is dilated by a scale factor of ${k}. A side that was ${side} cm long is now how long, in centimetres?`, side * k, "Every length is multiplied by the scale factor.", undefined, { suffix: "cm" });
    const area = randInt(2, 12);
    return typeIn(`A shape with an area of ${area} cm² is dilated by a scale factor of ${k}. What is the area of the image, in square centimetres?`, area * k * k, `Lengths are multiplied by ${k}, but area is multiplied by ${k} × ${k} = ${k * k}.`, undefined, { suffix: "cm²" });
  };
  return buildSet([translate, reflect, rotate, dilate, ...facts(TESSELLATION, 2).map((q) => () => q), d === 1 ? rule : sizes, d === 3 ? sizes : rule]);
}

// ---------- Scale, views and models ----------

function scale8(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const toActual = (): Question => {
    if (chance(0.5)) {
      const k = pick([5, 10, 20, 25, 50]);
      const L = randInt(3, 12);
      return typeIn(`On a map, 1 cm stands for ${k} km. Two towns are ${L} cm apart on the map. How far apart are they, in kilometres?`, L * k, `Multiply the map distance by the scale: ${L} × ${k}.`, undefined, { suffix: "km" });
    }
    const k = pick([100, 200, 500]);
    const L = randInt(2, 15);
    return typeIn(`A scale drawing uses a scale of 1 : ${k}. A wall is ${L} cm long on the drawing. How long is the real wall, in metres?`, (L * k) / 100, `The real length is ${L} × ${k} = ${L * k} cm. Then divide by 100 to change centimetres to metres.`, undefined, { suffix: "m" });
  };
  const toDrawing = (): Question => {
    const k = pick([100, 200, 500]);
    const L = randInt(2, 20);
    return typeIn(`A room is ${(L * k) / 100} m long. On a scale drawing with a scale of 1 : ${k}, how long is the room, in centimetres?`, L, `Change ${(L * k) / 100} m to ${L * k} cm. Then divide by ${k}.`, undefined, { suffix: "cm" });
  };
  const roomArea = (): Question => {
    const s = pick([1, 2, 3, 5]);
    const w = randInt(3, 9);
    const h = randInt(2, 8);
    return typeIn(`On a floor plan, 1 cm stands for ${s} m. A room is drawn ${w} cm by ${h} cm. What is the real area of the room, in square metres?`, w * s * h * s, `The real room is ${w * s} m by ${h * s} m. Multiply to find the area.`, undefined, { suffix: "m²" });
  };
  const rescale = (): Question => {
    const ks = [10, 20, 40, 50, 100, 200];
    for (let tries = 0; tries < 50; tries++) {
      const [k1, k2] = sample(ks, 2);
      const L2 = randInt(1, 15);
      const L1 = (L2 * k2) / k1;
      if (Number.isInteger(L1) && L1 >= 1 && L1 <= 60) {
        return typeIn(`A line is ${L1} cm long on a scale drawing with a scale of 1 : ${k1}. The drawing is redrawn at a scale of 1 : ${k2}. How long is the line now, in centimetres?`, L2, `The real length is ${L1} × ${k1} = ${L1 * k1} cm. Divide by ${k2} for the new drawing.`, undefined, { suffix: "cm" });
      }
    }
    return typeIn("A line is 8 cm long on a scale drawing with a scale of 1 : 20. The drawing is redrawn at a scale of 1 : 40. How long is the line now, in centimetres?", 4, "The real length is 8 × 20 = 160 cm. Divide by 40.", undefined, { suffix: "cm" });
  };
  const SOLIDS: { test: string; right: string; wrong: string[] }[] = [
    { test: "a circle as its top view and a rectangle as its front view", right: "a cylinder", wrong: ["a cone", "a sphere", "a cube"] },
    { test: "a circle as its top view and a triangle as its front view", right: "a cone", wrong: ["a cylinder", "a sphere", "a cube"] },
    { test: "a circle as both its top view and its front view", right: "a sphere", wrong: ["a cylinder", "a cone", "a cube"] },
    { test: "a square as both its top view and its front view", right: "a cube", wrong: ["a sphere", "a cone", "a cylinder"] },
    { test: "a square as its top view and a triangle as its front view", right: "a square-based pyramid", wrong: ["a cone", "a cube", "a cylinder"] },
  ];
  const views = (): Question => {
    const s = pick(SOLIDS);
    return mc(`Which solid, standing on its base, has ${s.test}?`, s.right, s.wrong, "Picture looking straight down at the solid, then straight at it from the front.");
  };
  const model = (): Question => {
    const k = pick([100, 200, 500]);
    const m = randInt(4, 30);
    return typeIn(`A tower is ${(m * k) / 100} m tall. A model of it is built at a scale of 1 : ${k}. How tall is the model, in centimetres?`, m, `Change ${(m * k) / 100} m to ${m * k} cm. Then divide by ${k}.`, undefined, { suffix: "cm" });
  };
  const cubes = (): Question => {
    const rows = randInt(2, 3);
    const grid = Array.from({ length: rows }, () => [randInt(1, 4), randInt(1, 4), randInt(1, 4)]);
    const visual: Visual = { type: "table", title: "Cubes in each stack (top view)", headers: ["Left", "Middle", "Right"], rows: grid };
    if (chance(0.5)) return typeIn("A model is built from stacks of cubes. The top view shows how many cubes are in each stack. How many cubes are in the model?", grid.flat().reduce((a, b) => a + b, 0), "Add the numbers in every cell.", visual);
    const col = randInt(0, 2);
    const name = ["left", "middle", "right"][col];
    return typeIn(`The table shows the stacks seen from above; each row is a row of stacks from back to front. From the front, how many cubes tall is the tallest stack you can see in the ${name} column?`, Math.max(...grid.map((r) => r[col])), "From the front, the tallest stack in a column hides the shorter ones behind it. Find the greatest number in that column.", visual);
  };
  const areaFactor = (): Question => {
    const k = randInt(2, 5);
    const area = randInt(3, 12);
    return typeIn(`A scale drawing is made at a scale factor of ${k}, so every length is ${k} times as long. The original rectangle had an area of ${area} cm². What is the area of the new rectangle, in square centimetres?`, area * k * k, `Area changes by the square of the scale factor: ${k} × ${k} = ${k * k}.`, undefined, { suffix: "cm²" });
  };
  return buildSet([toActual, toDrawing, d === 1 ? model : roomArea, rescale, views, cubes, d === 3 ? areaFactor : model, d === 1 ? toActual : pick([roomArea, areaFactor])]);
}

// ---------- Measurement: metric prefixes and composite shapes ----------

const PREFIX: { sym: string; name: string; exp: number }[] = [
  { sym: "Tm", name: "terametre", exp: 12 },
  { sym: "Gm", name: "gigametre", exp: 9 },
  { sym: "Mm", name: "megametre", exp: 6 },
  { sym: "km", name: "kilometre", exp: 3 },
  { sym: "m", name: "metre", exp: 0 },
  { sym: "mm", name: "millimetre", exp: -3 },
  { sym: "µm", name: "micrometre", exp: -6 },
  { sym: "nm", name: "nanometre", exp: -9 },
  { sym: "pm", name: "picometre", exp: -12 },
];

function measure8(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const prefixExp = (): Question => {
    const p = pick(PREFIX.filter((x) => Math.abs(x.exp) >= 6));
    if (p.exp > 0) return typeIn(`1 ${p.name} (${p.sym}) = 10 to what power, in metres?`, p.exp, `Mega is 10⁶, giga is 10⁹ and tera is 10¹². Count the zeros in the number of metres.`, eq(`1 ${p.sym} = 10☐ m`), { keypad: "integer" });
    return typeIn(`1 ${p.name} (${p.sym}) = 10 to what power, in metres?`, p.exp, "Micro is 10⁻⁶, nano is 10⁻⁹ and pico is 10⁻¹². Small units have negative exponents.", eq(`1 ${p.sym} = 10☐ m`), { keypad: "integer" });
  };
  const convertDown = (): Question => {
    const bigs = PREFIX.filter((x) => x.exp >= 0);
    const a = pick(bigs.slice(0, 4));
    const smalls = PREFIX.filter((x) => x.exp < a.exp && a.exp - x.exp <= 6);
    const b = pick(smalls);
    const q = randInt(2, 40);
    return typeIn(`Convert ${q} ${a.sym} to ${b.sym}.`, q * 10 ** (a.exp - b.exp), `${a.sym} is 10${sup(a.exp - b.exp)} times as large as ${b.sym}, so multiply by 1${"0".repeat(a.exp - b.exp)}.`, undefined, { suffix: b.sym });
  };
  const convertUp = (): Question => {
    const a = pick(PREFIX.filter((x) => x.exp <= 3 && x.exp >= -9));
    const bigger = PREFIX.filter((x) => x.exp > a.exp && x.exp - a.exp <= 3);
    const b = pick(bigger);
    const diff = b.exp - a.exp;
    const q = randInt(11, 999);
    const value = q / 10 ** diff;
    return typeIn(`Convert ${q} ${a.sym} to ${b.sym}.`, dec(value), `${b.sym} is 10${sup(diff)} times as large as ${a.sym}, so divide by 1${"0".repeat(diff)}. Move the decimal point ${diff} place${diff > 1 ? "s" : ""} to the left.`, undefined, { keypad: "decimal", suffix: b.sym });
  };
  const orderUnits = (): Question => {
    const picks = sample(PREFIX, d === 1 ? 3 : 4).sort((a, b) => a.exp - b.exp);
    const q: OrderQuestion = { kind: "order", prompt: "Tap the metric units from smallest to largest.", hint: "Pico, nano, micro and milli are small. Kilo, mega, giga and tera are large. A greater exponent means a larger unit.", items: picks.map((p, i) => ({ id: `u${i}`, label: p.name })) };
    return q;
  };
  const lShape = (): Question => {
    const W = randInt(8, 16);
    const H = randInt(7, 14);
    const w = randInt(2, W - 3);
    const h = randInt(2, H - 3);
    const u = pick(["cm", "m"]);
    if (chance(0.5)) {
      return typeIn(`An L-shape is made by cutting a ${w} ${u} by ${h} ${u} rectangle from the corner of a ${W} ${u} by ${H} ${u} rectangle. What is its area?`, W * H - w * h, `Subtract the cut-out from the whole rectangle: ${W} × ${H} − ${w} × ${h}.`, undefined, { suffix: `${u}²` });
    }
    return typeIn(`An L-shape is made by cutting a ${w} ${u} by ${h} ${u} rectangle from the corner of a ${W} ${u} by ${H} ${u} rectangle. What is its perimeter?`, 2 * (W + H), "Cutting out a corner does not change the perimeter. It is the same as the perimeter of the whole rectangle.", undefined, { suffix: u });
  };
  const semicircle = (): Question => {
    const r = pick([2, 4, 5, 10]);
    const len = randInt(r + 2, r + 10);
    const area = 2 * r * len + 1.57 * r * r;
    return typeIn(`A shape is a rectangle ${len} cm long and ${2 * r} cm wide with a semicircle added on one end (the diameter is the ${2 * r} cm side). What is its area, in square centimetres? Use π ≈ 3.14.`, dec(area), `Rectangle: ${len} × ${2 * r} = ${len * 2 * r}. Semicircle: half of 3.14 × ${r}² = ${dec(1.57 * r * r)}. Add them.`, undefined, { keypad: "decimal", suffix: "cm²" });
  };
  const ring = (): Question => {
    const R = randInt(4, 10);
    const r = randInt(1, R - 2);
    return typeIn(`A circular path has an outer radius of ${R} m and an inner radius of ${r} m. What is the area of the path, in square metres? Use π ≈ 3.14.`, dec(3.14 * (R * R - r * r)), `Area of the big circle minus area of the small circle: 3.14 × (${R}² − ${r}²).`, undefined, { keypad: "decimal", suffix: "m²" });
  };
  const stackVolume = (): Question => {
    const l = randInt(6, 12);
    const w = randInt(5, 9);
    const h = randInt(2, 6);
    const e = randInt(2, Math.min(l, w) - 1);
    return typeIn(`A cube with edges of ${e} cm sits on top of a box that is ${l} cm long, ${w} cm wide and ${h} cm tall. What is the total volume, in cubic centimetres?`, l * w * h + e ** 3, `Find each volume and add: ${l} × ${w} × ${h} + ${e}³.`, undefined, { suffix: "cm³" });
  };
  const stackSurface = (): Question => {
    const l = randInt(6, 12);
    const w = randInt(5, 9);
    const h = randInt(2, 6);
    const e = randInt(2, Math.min(l, w) - 1);
    const boxSA = 2 * (l * w + l * h + w * h);
    return typeIn(`A cube with edges of ${e} cm sits on top of a box that is ${l} cm long, ${w} cm wide and ${h} cm tall. What is the surface area of the whole solid, in square centimetres?`, boxSA + 4 * e * e, `Start with the box: ${boxSA} cm². The cube's bottom covers part of the box's top, but the cube's own top face takes that area back. So just add the cube's 4 side faces: 4 × ${e}².`, undefined, { suffix: "cm²" });
  };
  return buildSet([prefixExp, d === 1 ? convertDown : pick([convertDown, convertUp]), convertUp, orderUnits, lShape, pick([semicircle, ring]), d === 1 ? lShape : stackVolume, d === 1 ? semicircle : stackSurface]);
}

// ---------- Angles ----------

function angles8(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const parallel = (): Question => {
    const a = randInt(35, 145);
    const rel = pick([
      { name: "an alternate interior angle", same: true },
      { name: "a corresponding angle", same: true },
      { name: "a vertically opposite angle", same: true },
      { name: "a co-interior angle (on the same side of the transversal, between the lines)", same: false },
      { name: "an angle that forms a straight line with it", same: false },
    ]);
    return typeIn(`A transversal crosses two parallel lines. One angle measures ${a}°. How many degrees is ${rel.name} to it?`, rel.same ? a : 180 - a, rel.same ? "These angles are equal when the lines are parallel." : "These two angles add to 180°.", undefined, { suffix: "°" });
  };
  const polygonSum = (): Question => {
    const n = randInt(5, d === 1 ? 8 : 12);
    return typeIn(`What is the sum of the interior angles of a polygon with ${n} sides?`, (n - 2) * 180, `Split it into triangles: (n − 2) × 180° = ${n - 2} × 180°.`, undefined, { suffix: "°" });
  };
  const regular = (): Question => {
    const n = pick([5, 6, 8, 9, 10, 12]);
    return typeIn(`What is the measure of each interior angle of a regular polygon with ${n} sides?`, ((n - 2) * 180) / n, `Find the sum, ${(n - 2) * 180}°, then divide by ${n}.`, undefined, { suffix: "°" });
  };
  const exterior = (): Question => {
    const n = pick([5, 6, 8, 9, 10, 12]);
    return typeIn(`What is the measure of each exterior angle of a regular polygon with ${n} sides?`, 360 / n, `The exterior angles of any polygon add to 360°. Divide 360° by ${n}.`, undefined, { suffix: "°" });
  };
  const triangle = (): Question => {
    if (chance(0.5)) {
      const a = randInt(30, 70);
      const b = randInt(35, 75);
      return typeIn(`In a triangle, two interior angles are ${a}° and ${b}°. What is the exterior angle at the third vertex?`, a + b, `An exterior angle equals the sum of the two opposite interior angles: ${a} + ${b}.`, undefined, { suffix: "°" });
    }
    const apex = 2 * randInt(15, 60);
    return typeIn(`An isosceles triangle has a top angle of ${apex}°. What is each base angle?`, (180 - apex) / 2, `The angles add to 180°. The two base angles are equal: (180 − ${apex}) ÷ 2.`, undefined, { suffix: "°" });
  };
  const quad = (): Question => {
    const a = randInt(60, 120);
    const b = randInt(60, 120);
    const c = randInt(60, 110);
    return typeIn(`Three angles of a quadrilateral are ${a}°, ${b}° and ${c}°. What is the fourth angle?`, 360 - a - b - c, `The angles of a quadrilateral add to 360°. Subtract the three you know from 360°.`, undefined, { suffix: "°" });
  };
  const algebra = (): Question => {
    for (let tries = 0; tries < 60; tries++) {
      const x = randInt(10, 30);
      const m = randInt(2, 3);
      const a = randInt(5, 30);
      const b = 180 - a - (1 + m) * x;
      if (b >= 5 && b <= 40) {
        return typeIn(`Two co-interior angles between parallel lines measure (x + ${a})° and (${m}x + ${b})°. What is x?`, x, `Co-interior angles add to 180°. Solve x + ${a} + ${m}x + ${b} = 180.`);
      }
    }
    return typeIn("Two co-interior angles between parallel lines measure (x + 20)° and (2x + 10)°. What is x?", 50, "Co-interior angles add to 180°. Solve x + 20 + 2x + 10 = 180.");
  };
  return buildSet([parallel, parallel, polygonSum, regular, exterior, triangle, d === 1 ? quad : algebra, d === 3 ? algebra : pick([quad, regular])]);
}

// ---------- Money ----------

const PAYMENT: Fact[] = [
  { prompt: "A credit card charges a 2.5% foreign transaction fee. What is a disadvantage of using it in another country?", right: "The fee adds to the cost of every purchase.", wrong: ["The card stops working at borders.", "Prices in the store go up for everyone.", "You must pay the whole balance before leaving."], hint: "A fee of 2.5% on a $100 purchase adds $2.50." },
  { prompt: "What is an advantage of paying with a debit card?", right: "The money comes straight out of your own account, so you cannot overspend what you have.", wrong: ["You are lent money that you pay back later with interest.", "The bank charges no fees in any country.", "You earn interest on every purchase."], hint: "Debit uses your own money. Credit uses borrowed money." },
  { prompt: "What is an advantage of carrying some local cash when you travel?", right: "You can pay in places that do not take cards.", wrong: ["It earns interest while you carry it.", "It is always safe from loss or theft.", "It gets a better exchange rate than any card."], hint: "Cash works almost anywhere, but if it is lost it is hard to get back." },
  { prompt: "What is a risk of carrying a lot of cash?", right: "If it is lost or stolen, it usually cannot be replaced.", wrong: ["It loses value every day.", "It cannot be used to buy things.", "It always charges an exchange fee."], hint: "Cards can be cancelled and replaced. Cash cannot." },
  { prompt: "A store offers a choice of paying in Canadian dollars or in the local currency. Why is it smart to compare the two?", right: "The exchange rate and fees used can be different, which changes the final cost.", wrong: ["Both always cost exactly the same.", "Local currency is always cheaper.", "Canadian dollars are always cheaper."], hint: "Check the rate and any fees before choosing." },
];

const BUDGET: Fact[] = [
  { prompt: "A budget has income of $2 400 and expenses of $2 650. What is this called?", right: "a deficit", wrong: ["a surplus", "a balanced budget", "a savings goal"], hint: "When spending is more than income, there is a deficit." },
  { prompt: "A budget has income of $1 800 and expenses of $1 650. What is the extra $150 called?", right: "a surplus", wrong: ["a deficit", "a loan", "an expense"], hint: "When income is more than expenses, there is a surplus that can be saved." },
  { prompt: "Which is a fixed expense?", right: "monthly rent", wrong: ["eating out", "movie tickets", "a new game"], hint: "A fixed expense is the same amount each month." },
  { prompt: "Which is the best way to track all of your income and spending?", right: "a spreadsheet or budgeting app updated regularly", wrong: ["remembering the big purchases", "checking only at the end of the year", "tracking income but not spending"], hint: "You need to record both income and spending to know where your money goes." },
  { prompt: "Which action helps to balance a budget that is in deficit?", right: "reduce a flexible expense such as eating out", wrong: ["use a credit card for more purchases", "ignore the fixed expenses", "stop tracking spending"], hint: "To balance a budget, spend less or earn more." },
];

const CREDIT: Fact[] = [
  { prompt: "Why is it a good idea to pay off a credit card balance in full each month?", right: "You avoid paying interest on the balance.", wrong: ["The card company pays you interest.", "It is the only way to earn rewards.", "It lowers the price of what you bought."], hint: "Interest is charged on what you still owe." },
  { prompt: "Which cost is paid just for having a credit card, whether or not you use it?", right: "the annual fee", wrong: ["the interest on purchases", "sales tax", "the exchange rate"], hint: "An annual fee is charged once a year." },
];

function money8(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const exchange = (): Question => {
    if (chance(0.5)) {
      const cur = pick([
        { name: "US dollars", sym: "US$", rate: pick([0.7, 0.75, 0.8]) },
        { name: "euros", sym: "€", rate: pick([0.6, 0.65, 0.7]) },
        { name: "British pounds", sym: "£", rate: pick([0.5, 0.55, 0.6]) },
      ]);
      const cad = pick([20, 40, 60, 80, 100, 200]);
      return typeIn(`C$1 = ${cur.sym}${cur.rate.toFixed(2)}. How many ${cur.name} do you get for C$${cad}?`, dec(cad * cur.rate), `Multiply the Canadian amount by the rate: ${cad} × ${cur.rate.toFixed(2)}.`, undefined, { keypad: "decimal", suffix: cur.sym });
    }
    const cur = pick([
      { sym: "US$", rate: pick([1.25, 1.3, 1.4]) },
      { sym: "€", rate: pick([1.4, 1.5, 1.6]) },
      { sym: "£", rate: pick([1.75, 1.8, 2]) },
    ]);
    const amt = pick([20, 40, 60, 80, 100]);
    return typeIn(`${cur.sym}1 = C$${cur.rate.toFixed(2)}. A souvenir costs ${cur.sym}${amt}. How much is that in Canadian dollars?`, dec(amt * cur.rate), `Multiply the foreign amount by the rate: ${amt} × ${cur.rate.toFixed(2)}.`, undefined, { keypad: "decimal", suffix: "C$" });
  };
  const goal = (): Question => {
    if (chance(0.5)) {
      const income = pick([800, 900, 1000, 1200]);
      const spend = income - pick([100, 150, 200, 250]);
      const months = randInt(6, 18);
      const target = (income - spend) * months;
      return typeIn(`Mia earns $${income} a month and spends $${spend}. She saves the rest for a $${target} trip. How many months will it take?`, months, `She saves $${income - spend} a month. Divide $${target} by $${income - spend}.`);
    }
    const price = pick([100, 200, 300, 400, 500, 1000]);
    const total = (price * 113) / 100;
    return typeIn(`A bike costs $${price} before tax. HST in Ontario is 13%. How much must Jay save to buy it, in dollars?`, dec(total), `Add 13% HST: ${price} × 1.13.`, undefined, { keypad: "decimal", accept: dec(total) === total.toFixed(2) ? [] : [total.toFixed(2)] });
  };
  const budget = (): Question => {
    const income = pick([2200, 2400, 2600, 3000]);
    const rent = pick([900, 1000, 1100]);
    const food = pick([400, 450, 500]);
    const save = pick([200, 300]);
    const fun = income - rent - food - save;
    return typeIn(`A monthly budget has $${spaced(income)} of income, $${rent} for rent, $${food} for food and $${save} set aside for savings. How much is left for everything else, in dollars?`, fun, `Subtract all the planned amounts from the income: ${income} − ${rent} − ${food} − ${save}.`);
  };
  const interest = (): Question => {
    const P = pick([500, 800, 1000, 2000]);
    const r = pick([2, 4, 5, 10]);
    const t = randInt(2, 5);
    if (chance(0.5) || d === 1) {
      return typeIn(`Simple interest: $${P} is invested at ${r}% a year for ${t} years. How much interest is earned, in dollars?`, (P * r * t) / 100, `Interest = principal × rate × time = ${P} × ${r / 100} × ${t}.`, undefined, { keypad: "decimal" });
    }
    const P2 = pick([400, 800, 1200, 2000]);
    const r2 = pick([5, 10]);
    const total = P2 * (1 + r2 / 100) ** 2;
    return typeIn(`Compound interest: $${P2} is invested at ${r2}% a year, compounded once a year. What is the amount after 2 years, in dollars?`, dec(total), `Year 1: ${P2} × ${1 + r2 / 100} = ${dec(P2 * (1 + r2 / 100))}. Year 2: multiply by ${1 + r2 / 100} again.`, undefined, { keypad: "decimal", accept: dec(total) === total.toFixed(2) ? [] : [total.toFixed(2)] });
  };
  const simpleVsCompound = (): Question => {
    const P = pick([1000, 2000, 5000]);
    const r = pick([5, 10]);
    const extra = (P * r * r) / 10000;
    return typeIn(`$${P} earns ${r}% a year for 2 years. How many more dollars does compound interest earn than simple interest?`, dec(extra), `Simple: ${P} × ${r / 100} × 2 = ${(P * r * 2) / 100}. Compound earns interest on the interest too: the second year's interest is on ${dec(P * (1 + r / 100))}.`, undefined, { keypad: "decimal", accept: dec(extra) === extra.toFixed(2) ? [] : [extra.toFixed(2)] });
  };
  const bogo = (): Question => {
    const P = pick([40, 50, 60, 80, 100]);
    const p = pick([20, 30, 40]);
    const bogoCost = P * 1.5;
    const pctCost = 2 * P * (1 - p / 100);
    const cheaper = pctCost < bogoCost;
    return mc(`Two shirts cost $${P} each. Store A: ${p}% off each shirt. Store B: buy one, get the second half price. Which store has the lower total for two shirts?`, cheaper ? "Store A" : "Store B", [cheaper ? "Store B" : "Store A", "They cost the same"], `Store A: 2 × ${P} × ${1 - p / 100} = ${dec(pctCost)}. Store B: ${P} + ${P / 2} = ${dec(bogoCost)}.`);
  };
  const points = (): Question => {
    const spend = pick([100, 200, 300, 400, 500]);
    const perDollar = pick([1, 2]);
    const reward = (spend * perDollar * 5) / 100;
    return typeIn(`A store gives ${perDollar} loyalty point${perDollar > 1 ? "s" : ""} for every $1 spent. Every 100 points can be traded for a $5 reward. How many dollars of rewards do you get after spending $${spend}?`, reward, `You earn ${spend} × ${perDollar} = ${spend * perDollar} points. Every 100 points is $5.`);
  };
  const card = (): Question => {
    const bal = pick([500, 1000, 2000]);
    const rA = pick([18, 20, 22]);
    const rB = pick([14, 16, 24]);
    const fA = pick([0, 0, 30]);
    const fB = pick([60, 99, 120]);
    const costA = (bal * rA) / 100 + fA;
    const costB = (bal * rB) / 100 + fB;
    if (costA === costB) return card();
    const cheaper = costA < costB ? "Card A" : "Card B";
    return mc(`Card A has ${rA}% interest and a $${fA} annual fee. Card B has ${rB}% interest and a $${fB} annual fee. If you carry a balance of $${spaced(bal)} for a year, which card costs less in interest and fees?`, cheaper, [cheaper === "Card A" ? "Card B" : "Card A", "They cost the same"], `Card A: ${bal} × ${rA / 100} + ${fA} = ${dec(costA)}. Card B: ${bal} × ${rB / 100} + ${fB} = ${dec(costB)}.`);
  };
  return buildSet([
    exchange, exchange, goal, budget, interest,
    ...facts([...PAYMENT, ...BUDGET, ...CREDIT], 1).map((q) => () => q),
    d === 1 ? bogo : pick([bogo, card, simpleVsCompound]),
    d === 3 ? card : pick([points, bogo, simpleVsCompound]),
  ]);
}

export const units: Unit[] = [
  {
    id: "numbers-8",
    title: "Big, Small & Real Numbers",
    emoji: "🔭",
    blurb: "Scientific notation and irrational numbers",
    standards: on("B1.1, B1.2, B2.3", "scientific notation, rational and irrational numbers, and multiplying and dividing by powers of ten"),
    parentNote: "Writing very large and very small numbers in scientific notation, telling rational from irrational numbers, ordering numbers such as √2 and π, and mentally multiplying and dividing by powers of ten.",
    generate: numbers8,
  },
  {
    id: "integers-8",
    title: "Integer Operations",
    emoji: "➖",
    blurb: "Multiply, divide and mix",
    standards: on("B2.1, B2.4, B2.7", "adding, subtracting, multiplying and dividing integers, and the order of operations"),
    parentNote: "Multiplying and dividing positive and negative integers, adding and subtracting them, working with the order of operations, and solving real-life problems such as temperature changes.",
    generate: integers8,
  },
  {
    id: "percents-8",
    title: "Percents Beyond 100",
    emoji: "💯",
    blurb: "Over 100%, under 1%, tax and change",
    standards: on("B1.4, B2.1", "percents greater than 100% or less than 1%, percent change, and multi-step percent problems"),
    parentNote: "Using fractions, decimals and percents together, including percents over 100% and under 1%, finding percent increase and decrease, working backwards from a sale price, and adding Ontario's 13% HST.",
    generate: percents8,
  },
  {
    id: "patterns-8",
    title: "Growing & Shrinking Patterns",
    emoji: "📉",
    blurb: "Rates, initial values and rules",
    standards: on("C1.1–C1.4", "repeating, growing and shrinking patterns, rates of change, initial values, and rules as algebraic expressions"),
    parentNote: "Finding the constant rate and initial value of a pattern, comparing patterns, writing a rule such as 5n + 2 or 40 − 3n, and using the rule to predict later terms.",
    generate: patterns8,
  },
  {
    id: "algebra-8",
    title: "Algebra Workshop",
    emoji: "🔧",
    blurb: "Monomials, equations and inequalities",
    standards: on("C2.1–C2.4", "adding and subtracting monomials and binomials, evaluating expressions, solving equations with multiple terms, and solving and graphing inequalities"),
    parentNote: "Combining like terms, evaluating expressions with integers and decimals, solving equations with the variable on both sides, and solving inequalities and graphing the solutions on a number line.",
    generate: algebra8,
  },
  {
    id: "data-8",
    title: "Scatter Plots & Stories",
    emoji: "📈",
    blurb: "Two-variable data and misleading graphs",
    standards: on("D1.1–D1.6", "one- and two-variable data, choosing graphs, scatter plots, strong and weak relationships, outliers and misleading graphs"),
    parentNote: "Deciding when two-variable data is needed, picking the best graph, describing scatter plots as strong, weak, positive, negative or none, spotting outliers, and noticing graphs that mislead.",
    generate: data8,
  },
  {
    id: "chance-8",
    title: "Chance with Many Events",
    emoji: "🎰",
    blurb: "Venn diagrams, trees and dependent events",
    standards: on("D2.1, D2.2", "probability using Venn and tree diagrams, and independent and dependent events"),
    parentNote: "Using Venn diagrams and tree diagrams, finding the probability of two or more independent events, comparing drawing with and without replacement, and comparing experimental with theoretical probability.",
    generate: chance8,
  },
  {
    id: "transformations-8",
    title: "Tessellations & Transformations",
    emoji: "🪞",
    blurb: "Slides, flips, turns and dilations",
    standards: on("E1.1, E1.4", "tessellations and their transformations, and translations, reflections, rotations and dilations on a Cartesian plane"),
    parentNote: "Why some shapes tessellate, naming the transformations in a tiling, and finding the image of a point after a translation, reflection, rotation or dilation on a coordinate grid.",
    generate: transformations8,
  },
  {
    id: "scale-8",
    title: "Scale & Models",
    emoji: "🗺️",
    blurb: "Scale drawings, views and models",
    standards: on("E1.2, E1.3", "top, front and side views of objects, models, and scale drawings used to find lengths and areas"),
    parentNote: "Using scale drawings and maps to find real lengths and areas, redrawing at a new scale, matching solids to their top and front views, and building models from views.",
    generate: scale8,
  },
  {
    id: "measure-8",
    title: "Metric Giants & Composite Shapes",
    emoji: "📏",
    blurb: "Mega to pico, and shapes stuck together",
    standards: on("E2.1, E2.3", "very large and very small metric units, and perimeter, area, volume and surface area of composite shapes"),
    parentNote: "Converting between metric units from pico to tera using powers of ten, and finding the perimeter, area, volume and surface area of shapes made from several simpler shapes.",
    generate: measure8,
  },
  {
    id: "angles-8",
    title: "Angle Detective",
    emoji: "📐",
    blurb: "Parallel lines and polygons",
    standards: on("E2.2", "angle properties of parallel and intersecting lines, triangles and polygons"),
    parentNote: "Using equal and supplementary angles when a transversal crosses parallel lines, and the angle sums of triangles, quadrilaterals and polygons, including exterior angles.",
    generate: angles8,
  },
  {
    id: "money-8",
    title: "Money Planner",
    emoji: "💳",
    blurb: "Exchange, interest, budgets and cards",
    standards: on("F1.1–F1.6", "payment methods and exchange rates, financial plans, budgets, simple and compound interest, getting value, and comparing credit cards"),
    parentNote: "Converting between currencies, comparing ways to pay, planning to save for a goal, balancing a budget, finding simple and compound interest, comparing sales and loyalty programs, and weighing credit card fees and interest.",
    generate: money8,
  },
];
