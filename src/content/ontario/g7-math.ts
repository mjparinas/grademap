import { pick, randInt, sample, shuffle, textChoice } from "../random";
import type { GenerateOptions, Question, Unit, Visual } from "../types";
import { buildSet, levelOf, on, others, numQ, range, spaced, typeIn } from "./kit";

// Ontario Grade 7 mathematics (2020 curriculum). Whole numbers go up to a billion; rational numbers,
// exponents and proportional reasoning appear for the first time.

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);
const dec = (n: number): string => String(Math.round(n * 1000) / 1000);
const money = (n: number): string => `$${(Math.round(n * 100) / 100).toFixed(2)}`;
const int = (n: number): string => (n < 0 ? `−${Math.abs(n)}` : String(n));
const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const sup = (n: number): string => String(n).split("").map((d) => SUP[Number(d)]).join("");

/** "5/6", "1 1/4" or "2" for a fraction in lowest terms. */
function frac(n: number, d: number): string {
  const g = gcd(n, d);
  const a = n / g;
  const b = d / g;
  if (b === 1) return String(a);
  if (a > b) return `${Math.floor(a / b)} ${a % b}/${b}`;
  return `${a}/${b}`;
}

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

// ---------- Numbers ----------

function numbers7(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const expanded = (): Question => {
    const places = sample([3, 4, 5, 6, 7, 8], 3).sort((a, b) => b - a);
    const digits = places.map(() => randInt(1, 9));
    const n = places.reduce((s, p, i) => s + digits[i] * 10 ** p, 0);
    const right = places.map((p, i) => `${digits[i]} × 10${sup(p)}`).join(" + ");
    const shifted = places.map((p, i) => `${digits[i]} × 10${sup(p + 1)}`).join(" + ");
    const lowered = places.map((p, i) => `${digits[i]} × 10${sup(Math.max(1, p - 1))}`).join(" + ");
    return say(textChoice(`Which shows ${spaced(n)} in expanded form with powers of ten?`, right, [...new Set([shifted, lowered])].filter((w) => w !== right), "Each digit is multiplied by 10 raised to its place value: 100 = 10², 1000 = 10³, and so on."));
  };
  const compareBig = (): Question => {
    const hi = d === 1 ? 99999999 : 999999999;
    const nums = [randInt(10000000, hi), randInt(10000000, hi), randInt(10000000, hi)];
    if (new Set(nums).size < 3) return compareBig();
    const big = Math.max(...nums);
    return say(textChoice("Which number is the greatest?", spaced(big), nums.filter((n) => n !== big).map(spaced), "Compare the digits from the left. The number with more digits is greater."));
  };
  const square = (): Question =>
    pick([
      () => {
        const squares = [16, 25, 36, 49, 64, 81, 100, 121, 144];
        const sq = pick(squares);
        return textChoice("Which number is a perfect square?", String(sq), [String(sq + 1), String(sq - 1)], "A perfect square is a whole number times itself, like 7 × 7 = 49.");
      },
      () => {
        const r = randInt(3, 14);
        return numQ(`What is √${r * r}?`, r, `Find the number that multiplied by itself gives ${r * r}.`, undefined, 16, 2);
      },
      () => {
        const r = randInt(3, 12);
        return numQ(`A square garden has an area of ${r * r} m². How long is each side, in metres?`, r, "The side length is the square root of the area.", undefined, 16, 2);
      },
    ])();
  const rationals: { label: string; v: number }[] = [
    { label: "−3/4", v: -0.75 }, { label: "−2/3", v: -2 / 3 }, { label: "−0.5", v: -0.5 }, { label: "1/4", v: 0.25 }, { label: "0.3", v: 0.3 }, { label: "3/5", v: 0.6 }, { label: "−1.2", v: -1.2 }, { label: "7/8", v: 0.875 }, { label: "−0.1", v: -0.1 }, { label: "1.5", v: 1.5 }, { label: "−5/4", v: -1.25 },
  ];
  const compareRational = (): Question => {
    const [a, b] = sample(rationals, 2);
    const hi = a.v > b.v ? a : b;
    const lo = hi === a ? b : a;
    return textChoice(`Which is greater, ${a.label} or ${b.label}?`, hi.label, [lo.label], "Change them to decimals if you need to. On a number line, the one farther right is greater.");
  };
  const orderRational = (): Question => {
    const picks = sample(rationals, 4).sort((x, y) => x.v - y.v);
    return { kind: "order", prompt: "Tap the numbers from least to greatest.", hint: "Think about where each number sits on a number line.", items: picks.map((p, i) => ({ id: `r${i}`, label: p.label })) };
  };
  const simplify = (): Question => {
    const den = pick([6, 8, 9, 10, 12, 14, 15, 18, 20, 24]);
    let num = randInt(2, den - 1);
    while (gcd(num, den) === 1) num = randInt(2, den - 1);
    const g = gcd(num, den);
    const right = `${num / g}/${den / g}`;
    const wrong = [...new Set([`${num / g}/${den}`, `${num}/${den / g}`, `${num / g + 1}/${den / g}`])].filter((w) => w !== right).slice(0, 2);
    return textChoice(`Write ${num}/${den} in simplest form.`, right, wrong, "Divide the top and bottom by the same number. The greatest common factor works best.");
  };
  const between = (): Question => {
    const bank = [
      { a: "1/4", b: "1/2", right: "3/8", wrong: ["1/8", "5/8"] },
      { a: "1/2", b: "3/4", right: "5/8", wrong: ["3/8", "7/8"] },
      { a: "0.2", b: "0.3", right: "0.25", wrong: ["0.35", "0.15"] },
      { a: "0.5", b: "0.6", right: "0.55", wrong: ["0.45", "0.65"] },
      { a: "2/5", b: "3/5", right: "1/2", wrong: ["1/5", "4/5"] },
      { a: "0.7", b: "0.8", right: "0.75", wrong: ["0.65", "0.85"] },
    ];
    const b = pick(bank);
    return textChoice(`Which number is between ${b.a} and ${b.b}?`, b.right, b.wrong, "Write both numbers as decimals or with a common denominator.");
  };
  const round = (): Question => {
    let t = randInt(1001, 99989);
    while (t % 10 === 5 || t % 10 === 0) t = randInt(1001, 99989);
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
  return buildSet([expanded, expanded, compareBig, square, compareRational, orderRational, d === 1 ? square : simplify, d === 1 ? between : pick([between, round, simplify])]);
}

// ---------- Factors, multiples and exponents ----------

function powers7(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const gcfQ = (): Question => {
    for (;;) {
      const g = pick([2, 3, 4, 5, 6, 8, 12]);
      const a = g * randInt(2, 11);
      const b = g * randInt(2, 11);
      if (a === b || a > 144 || b > 144 || gcd(a, b) !== g) continue;
      return typeIn(`What is the greatest common factor (GCF) of ${a} and ${b}?`, g, "List the factors of each number. Find the biggest one they share.");
    }
  };
  const lcmQ = (): Question => {
    const a = randInt(2, 12);
    let b = randInt(2, 12);
    while (a === b) b = randInt(2, 12);
    return typeIn(`What is the lowest common multiple (LCM) of ${a} and ${b}?`, lcm(a, b), "List the multiples of each number. Find the smallest one they share.");
  };
  const lcm3 = (): Question => {
    const sets = [[2, 3, 4], [2, 3, 5], [3, 4, 6], [2, 4, 5], [2, 5, 10], [3, 5, 6]];
    const s = pick(sets);
    return typeIn(`What is the lowest common multiple of ${s[0]}, ${s[1]} and ${s[2]}?`, lcm(lcm(s[0], s[1]), s[2]), "Find a number that all three divide into evenly. Check the smallest.");
  };
  const exponent = (): Question => {
    const base = pick([2, 3, 4, 5, 10]);
    let n = randInt(3, base === 10 ? 6 : 5);
    if (n === base) n += 1;
    return pick([
      () => textChoice(`Which shows ${Array(n).fill(base).join(" × ")} using an exponent?`, `${base}${sup(n)}`, [`${n}${sup(base)}`, `${base} × ${n}`], "The base is the number being multiplied. The exponent counts how many times it appears."),
      () => typeIn(`What is ${base}${sup(n)}?`, base ** n, `Multiply ${base} by itself ${n} times.`, { type: "equation", text: `${base}${sup(n)} = ?` }),
    ])();
  };
  const evalExp = (): Question => {
    const a = randInt(2, 4);
    const n = randInt(2, 3);
    const b = randInt(1, 9);
    return typeIn(`Evaluate ${a}${sup(n)} + ${b}.`, a ** n + b, "Evaluate the power first. Then add.");
  };
  const wordGcf = (): Question => {
    const g = pick([4, 6, 8, 12]);
    const a = g * randInt(2, 5);
    let b = g * randInt(2, 5);
    while (b === a) b = g * randInt(2, 5);
    const real = gcd(a, b);
    return typeIn(`Ribbons ${a} cm and ${b} cm long are cut into equal pieces with none left over. What is the longest each piece can be, in centimetres?`, real, "This is the greatest common factor of the two lengths.");
  };
  const wordLcm = (): Question => {
    const a = pick([6, 8, 10, 12, 15]);
    let b = pick([4, 9, 12, 18, 20]);
    while (b === a) b = pick([4, 9, 12, 18, 20]);
    return typeIn(`Bus A leaves every ${a} minutes and Bus B every ${b} minutes. They leave together at 8:00. After how many minutes do they leave together again?`, lcm(a, b), "This is the lowest common multiple of the two times.");
  };
  return buildSet([gcfQ, gcfQ, lcmQ, d === 1 ? lcmQ : lcm3, exponent, exponent, evalExp, d === 1 ? wordGcf : pick([wordGcf, wordLcm])]);
}

// ---------- Fractions ----------

function fractions7(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const PAIRS: [number, number][] = [[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [5, 6], [3, 8], [5, 8], [3, 10], [4, 9], [2, 7], [5, 12]];
  const addSub = (add: boolean): Question => {
    for (;;) {
      const [b, dd] = pick(PAIRS);
      const a = randInt(1, b - 1);
      const c = randInt(1, dd - 1);
      const L = lcm(b, dd);
      const x = (a * L) / b;
      const y = (c * L) / dd;
      const top = add ? x + y : x - y;
      if (top <= 0) continue;
      const right = frac(top, L);
      const w1 = add ? frac(a + c, b + dd) : frac(Math.abs(a - c), Math.abs(b - dd));
      const w2 = frac(top + 1, L);
      const w3 = frac(Math.max(1, top - 1), L);
      const uniq = [...new Set([w1, w2, w3])].filter((w) => w !== right && w !== "0" && !w.includes("Infinity") && !w.includes("NaN"));
      if (uniq.length < 2) continue;
      return textChoice(`What is ${a}/${b} ${add ? "+" : "−"} ${c}/${dd}?`, right, uniq.slice(0, 2), `Make the denominators the same (${L}), then ${add ? "add" : "subtract"} the numerators.`, { type: "equation", text: `${a}/${b} ${add ? "+" : "−"} ${c}/${dd}` });
    }
  };
  const mult = (): Question => {
    for (;;) {
      const b = pick([2, 3, 4, 5, 6, 8]);
      const dd = pick([2, 3, 4, 5, 6, 8]);
      const a = randInt(1, b - 1);
      const c = randInt(1, dd - 1);
      const right = frac(a * c, b * dd);
      const w1 = frac(a + c, b + dd);
      const w2 = frac(a * c, b + dd);
      const wrong = [...new Set([w1, w2, frac(a * c + 1, b * dd)])].filter((w) => w !== right).slice(0, 2);
      if (wrong.length < 2) continue;
      return textChoice(`What is ${a}/${b} × ${c}/${dd}?`, right, wrong, "Multiply the numerators. Multiply the denominators. Then simplify.", { type: "equation", text: `${a}/${b} × ${c}/${dd}` });
    }
  };
  const divide = (): Question => {
    for (;;) {
      const b = pick([2, 3, 4, 5, 6, 8]);
      const dd = pick([2, 3, 4, 5, 6]);
      const a = randInt(1, b - 1);
      const c = randInt(1, dd - 1);
      const right = frac(a * dd, b * c);
      const w1 = frac(a * c, b * dd);
      const w2 = frac(b * c, a * dd);
      const wrong = [...new Set([w1, w2])].filter((w) => w !== right);
      if (wrong.length < 2) continue;
      return textChoice(`What is ${a}/${b} ÷ ${c}/${dd}?`, right, wrong, "Keep the first fraction, flip the second, and multiply.", { type: "equation", text: `${a}/${b} ÷ ${c}/${dd}` });
    }
  };
  const ofAmount = (): Question => {
    for (;;) {
      const b = pick([2, 3, 4, 5]);
      const dd = pick([2, 3, 4]);
      const a = randInt(1, b - 1);
      const c = randInt(1, dd - 1);
      const right = frac(a * c, b * dd);
      const wrong = [...new Set([frac(a + c, b + dd), frac(a * c, b + dd), frac(a, b), frac(c, dd)])].filter((w) => w !== right);
      if (wrong.length < 2) continue;
      return textChoice(`A jug is ${c}/${dd} full. You pour out ${a}/${b} of what is in it. What fraction of the whole jug did you pour out?`, right, wrong.slice(0, 2), "Find a fraction OF a fraction. Multiply.");
    }
  };
  return buildSet([() => addSub(true), () => addSub(true), () => addSub(false), () => addSub(false), mult, mult, d === 1 ? mult : divide, d === 1 ? (() => addSub(true)) : pick([divide, ofAmount])]);
}

// ---------- Percents and proportions ----------

function percents7(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const EQ = [
    { f: "1/8", dd: "0.125", p: "12.5%" },
    { f: "3/8", dd: "0.375", p: "37.5%" },
    { f: "5/8", dd: "0.625", p: "62.5%" },
    { f: "1/5", dd: "0.2", p: "20%" },
    { f: "2/5", dd: "0.4", p: "40%" },
    { f: "3/4", dd: "0.75", p: "75%" },
    { f: "1/4", dd: "0.25", p: "25%" },
    { f: "7/10", dd: "0.7", p: "70%" },
    { f: "1/20", dd: "0.05", p: "5%" },
    { f: "3/20", dd: "0.15", p: "15%" },
  ];
  const equiv = (): Question => {
    const c = pick(EQ);
    const ws = sample(EQ.filter((x) => x !== c), 2);
    return pick([
      () => textChoice(`Which percent is equal to ${c.f}?`, c.p, ws.map((x) => x.p), "Divide the top by the bottom to get a decimal, then move the decimal two places for a percent."),
      () => textChoice(`Which fraction is equal to ${c.p}?`, c.f, ws.map((x) => x.f), "Write the percent as a fraction out of 100, then simplify."),
      () => textChoice(`Which decimal is equal to ${c.f}?`, c.dd, ws.map((x) => x.dd), "Divide the top by the bottom."),
    ])();
  };
  const change = (): Question => {
    const cases = [
      { p: 1, base: () => 100 * randInt(2, 9) },
      { p: 5, base: () => 20 * randInt(2, 15) },
      { p: 10, base: () => 10 * randInt(3, 40) },
      { p: 25, base: () => 4 * randInt(5, 40) },
      { p: 50, base: () => 2 * randInt(10, 100) },
      { p: 100, base: () => randInt(10, 400) },
    ];
    const c = pick(d === 1 ? cases.slice(2, 5) : cases);
    const base = c.base();
    const up = pick([true, false]);
    if (!up && c.p === 100) return change();
    const delta = (c.p * base) / 100;
    return typeIn(`${up ? "Increase" : "Decrease"} ${base} by ${c.p}%. What is the new number?`, up ? base + delta : base - delta, `Find ${c.p}% of ${base}, then ${up ? "add it to" : "take it from"} ${base}.`);
  };
  const proportional = (): Question => {
    const bank = [
      { q: "Ravi earns $12 for every hour he works. Is his pay proportional to the hours he works?", right: "Yes, doubling the hours doubles the pay", wrong: ["No, pay goes up by different amounts", "No, pay is the same every hour"] },
      { q: "A taxi charges $4 to start, plus $2 for every kilometre. Is the cost proportional to the distance?", right: "No, there is a starting fee", wrong: ["Yes, because it goes up by $2 each time", "Yes, because the starting fee is small"] },
      { q: "A recipe uses 2 cups of flour for every 3 cups of milk. Is the amount of flour proportional to the amount of milk?", right: "Yes, the ratio stays the same", wrong: ["No, the numbers are different", "No, flour and milk are different foods"] },
      { q: "A person is 150 cm tall at age 10 and 160 cm tall at age 11. Is height proportional to age?", right: "No, height does not double when age doubles", wrong: ["Yes, because both go up", "Yes, because it grew 10 cm"] },
    ];
    const b = pick(bank);
    return textChoice(b.q, b.right, b.wrong, "In a proportional relationship, doubling one amount doubles the other, and the ratio stays the same.");
  };
  const unit = (): Question => {
    const n1 = randInt(2, 5);
    const price = n1 * randInt(150, 400) / 100;
    const n2 = n1 + randInt(2, 5);
    const total = (price / n1) * n2;
    if (Math.abs(total * 100 - Math.round(total * 100)) > 1e-6) return unit();
    return typeIn(`${n1} notebooks cost ${money(price)}. At the same price, how much do ${n2} notebooks cost, in dollars?`, dec(total), `Find the cost of 1 notebook first: ${money(price)} ÷ ${n1}.`, undefined, { keypad: "decimal", accept: [total.toFixed(2), total.toFixed(1)].filter((v) => Number(v) === Math.round(total * 100) / 100) });
  };
  const missing = (): Question => {
    const a = randInt(2, 6);
    const b = randInt(3, 9);
    const k = randInt(2, 6);
    return typeIn("What number makes these ratios equal?", b * k, `${a} × ${k} = ${a * k}, so multiply ${b} by ${k}.`, { type: "equation", text: `${a} : ${b} = ${a * k} : ☐` });
  };
  return buildSet([equiv, equiv, change, change, change, proportional, d === 1 ? missing : unit, d === 3 ? unit : pick([proportional, missing])]);
}

// ---------- Algebra ----------

function algebra7(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const likeTerms = (): Question => {
    const v = pick(["x", "n", "y", "a"]);
    const a = randInt(5, 12);
    const b = randInt(2, a - 1);
    const c = randInt(1, 4);
    return pick([
      () => textChoice(`What is ${a}${v} − ${b}${v}?`, `${a - b}${v}`, [`${a + b}${v}`, `${a - b}`], "Subtract the numbers in front. The letter stays.", { type: "equation", text: `${a}${v} − ${b}${v}` }),
      () => textChoice(`What is ${a}${v} − ${b}${v} + ${c}${v}?`, `${a - b + c}${v}`, [`${a - b - c}${v}`, `${a + b + c}${v}`], "Work from left to right. All the terms have the same letter.", { type: "equation", text: `${a}${v} − ${b}${v} + ${c}${v}` }),
    ])();
  };
  const evaluate = (): Question => {
    const aT = randInt(11, 59);
    const x = randInt(2, 8);
    const bT = randInt(11, 59);
    const ans = (aT * x + bT) / 10;
    return typeIn(`Evaluate ${(aT / 10).toFixed(1)}x + ${(bT / 10).toFixed(1)} when x = ${x}.`, dec(ans), `Put ${x} in for x. Multiply first, then add.`, { type: "equation", text: `${(aT / 10).toFixed(1)}x + ${(bT / 10).toFixed(1)}, x = ${x}` }, { keypad: "decimal", accept: [ans.toFixed(1)] });
  };
  const solve = (): Question => {
    const x = randInt(2, 14);
    const a = randInt(2, 9);
    const b = randInt(1, 20);
    return pick([
      () => typeIn("Solve for x.", x, "Undo the adding first, then undo the multiplying.", { type: "equation", text: `${a}x + ${b} = ${a * x + b}` }),
      () => typeIn("Solve for x.", x, "Undo the subtracting first, then undo the multiplying.", { type: "equation", text: `${a}x − ${b} = ${a * x - b}` }),
    ])();
  };
  const inequality = (): Question => {
    const a = randInt(2, 5);
    const t = randInt(3, 12);
    const b = randInt(1, 9);
    const c = a * t - b;
    const less = pick([true, false]);
    if (less) {
      const right = Math.max(0, t - randInt(1, 3));
      return textChoice(`Which value of n makes ${a}n − ${b} < ${c} true?`, String(right), [String(t), String(t + 2)], "Put each choice in for n and check.", { type: "equation", text: `${a}n − ${b} < ${c}` });
    }
    const right = t + randInt(1, 4);
    return textChoice(`Which value of n makes ${a}n − ${b} > ${c} true?`, String(right), sample([t, t - 1, Math.max(0, t - 2)], 2).map(String), "Put each choice in for n and check.", { type: "equation", text: `${a}n − ${b} > ${c}` });
  };
  const graph = (): Question => {
    const t = randInt(2, 9);
    const kind = pick([">", "<", "≥", "≤"] as const);
    const open = kind === ">" || kind === "<";
    const dir = kind === ">" || kind === "≥" ? "right" : "left";
    const right = `${open ? "an open" : "a closed"} circle at ${t} with an arrow pointing ${dir}`;
    const wrong = [`${open ? "a closed" : "an open"} circle at ${t} with an arrow pointing ${dir}`, `${open ? "an open" : "a closed"} circle at ${t} with an arrow pointing ${dir === "right" ? "left" : "right"}`];
    return textChoice(`Which shows the solution to n ${kind} ${t} on a number line?`, right, wrong, "An open circle leaves out the number. A closed circle includes it. The arrow points the way the solutions go.");
  };
  const verify = (): Question => {
    const x = randInt(3, 12);
    const a = randInt(2, 8);
    const b = randInt(1, 9);
    const claim = pick([true, false]) ? x : x + pick([-2, -1, 1, 2]);
    return textChoice(`Is x = ${claim} a solution of ${a}x + ${b} = ${a * x + b}?`, claim === x ? "Yes" : "No", [claim === x ? "No" : "Yes"], `Put ${claim} in for x and check both sides.`);
  };
  return buildSet([likeTerms, likeTerms, evaluate, solve, solve, inequality, graph, d === 1 ? verify : pick([verify, solve])]);
}

// ---------- Data ----------

function data7(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const why = (): Question =>
    pick([
      () => textChoice("Why are percentages used to describe large sets of data?", "They make groups of different sizes easy to compare.", ["They make the data smaller.", "They hide small numbers."], "A percent is always out of 100, no matter how big the group is."),
      () => textChoice("A survey of 80 students and a survey of 500 students are compared. Which helps most?", "using percents", ["using only the counts", "using only the largest number"], "Percents put both surveys on the same scale."),
    ])();
  const percentOf = (): Question => {
    const total = pick([200, 250, 400, 500, 800, 1000]);
    const part = (total * pick([5, 10, 15, 20, 25, 30, 40])) / 100;
    return typeIn(`In a survey of ${total} students, ${part} walk to school. What percent walk?`, (part * 100) / total, `Write ${part}/${total} as a fraction out of 100.`, undefined, { suffix: "%" });
  };
  const sector = (): Question => {
    const pct = pick([5, 10, 15, 20, 25, 30, 40, 50]);
    return pick([
      () => typeIn(`A sector of a circle graph is ${(pct * 360) / 100}°. What percent of the graph is that?`, pct, "A whole circle is 360°. Divide the angle by 360.", undefined, { suffix: "%" }),
      () => typeIn(`A sector of a circle graph shows ${pct}%. What is the angle of the sector, in degrees?`, (pct * 360) / 100, "A whole circle is 360°. Find the percent of 360.", undefined, { suffix: "°" }),
    ])();
  };
  const addData = (): Question => {
    const nums = sample(range(2, 14), 4).sort((a, b) => a - b);
    const extra = pick([1, 25, 30]);
    const mean = nums.reduce((s, x) => s + x, 0) / 4;
    const newMean = (nums.reduce((s, x) => s + x, 0) + extra) / 5;
    const rises = newMean > mean;
    return textChoice(`The data ${nums.join(", ")} has a mean of ${dec(mean)}. A new value of ${extra} is added. What happens to the mean?`, rises ? "It goes up" : "It goes down", [rises ? "It goes down" : "It goes up", "It stays the same"].filter((w) => !(w === "It stays the same" && newMean === mean)), "Compare the new value with the old mean. A value above the mean pulls it up. A value below pulls it down.");
  };
  const outlier = (): Question =>
    pick([
      () => textChoice("A data set is 4, 5, 5, 6, 40. Which measure is pulled up the most by the 40?", "the mean", ["the median", "the mode"], "A very large value changes the mean a lot. The median and mode barely move."),
      () => textChoice("Which measure of centre changes least when you add one extreme value?", "the median", ["the mean", "the range"], "The median is the middle value, so one extreme value barely moves it."),
      () => textChoice("Removing the greatest value from a data set will always…", "make the range smaller or the same", ["make the median larger", "make the mode larger"], "The range is greatest − least. Taking away the greatest cannot make it bigger."),
    ])();
  const newMedian = (): Question => {
    const nums = sample(range(2, 30), 5).sort((a, b) => a - b);
    const idx = pick([0, 4]);
    const removed = nums[idx];
    const rest = nums.filter((_, i) => i !== idx);
    const median = (rest[1] + rest[2]) / 2;
    return typeIn(`The data ${shuffle(nums).join(", ")} has a median of ${nums[2]}. After the ${idx === 0 ? "least" : "greatest"} value (${removed}) is removed, what is the new median?`, dec(median), "Put the remaining four numbers in order. With two middle numbers, find the number halfway between them.", undefined, { keypad: "decimal", accept: [median.toFixed(1)] });
  };
  const misleading = (): Question => {
    const bank = [
      { q: "A circle graph's sectors add up to 120%. What is wrong?", right: "The parts of a whole must add to 100%.", wrong: ["Nothing is wrong.", "Circle graphs must have 12 sectors."] },
      { q: "Why might a company show a graph that only begins at last month's best sales?", right: "It can make a small increase look big.", wrong: ["It always shows the truth.", "It makes the graph longer."] },
      { q: "A graph only shows data from the three best days of the year. Why is that a problem?", right: "It leaves out data and gives a biased picture.", wrong: ["It makes the graph too accurate.", "It uses too few colours."] },
    ];
    const b = pick(bank);
    return textChoice(b.q, b.right, b.wrong, "Ask what was left out and how the scale was set.");
  };
  return buildSet([why, percentOf, percentOf, sector, sector, addData, d === 1 ? outlier : pick([newMedian, outlier]), misleading]);
}

// ---------- Dependent events ----------

function dependent7(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const classify = (): Question => {
    const bank = [
      { q: "You draw a card, put it back, then draw again. Are the two draws independent or dependent?", a: "independent" },
      { q: "You draw a card, keep it out, then draw again. Are the two draws independent or dependent?", a: "dependent" },
      { q: "You toss a coin and roll a die. Are the two events independent or dependent?", a: "independent" },
      { q: "You take a marble from a bag and do not put it back. You take a second marble. Are the two picks independent or dependent?", a: "dependent" },
      { q: "You spin a spinner twice. Are the two spins independent or dependent?", a: "independent" },
    ];
    const b = pick(bank);
    return textChoice(b.q, b.a, [b.a === "independent" ? "dependent" : "independent"], "Independent: the first event does not change the second. Dependent: it does.");
  };
  const bag = () => {
    const r = randInt(2, 5);
    const b = randInt(1, 5);
    return { r, b, n: r + b };
  };
  const secondRed = (): Question => {
    const g = bag();
    const right = frac(g.r - 1, g.n - 1);
    const wrong = [...new Set([frac(g.r, g.n), frac(g.r, g.n - 1), frac(g.r - 1, g.n)])].filter((w) => w !== right && w !== "0").slice(0, 2);
    return textChoice(`A bag has ${g.r} red and ${g.b} blue marbles. You take out a red marble and do not put it back. What is the probability that the second marble is red?`, right, wrong, "After the first pick, there is one fewer red marble and one fewer marble in all.");
  };
  const bothRedWithout = (): Question => {
    const g = bag();
    const right = frac(g.r * (g.r - 1), g.n * (g.n - 1));
    if (g.r * (g.r - 1) === 0) return bothRedWithout();
    const wrong = [...new Set([frac(g.r * g.r, g.n * g.n), frac(g.r, g.n), frac(g.r - 1, g.n - 1)])].filter((w) => w !== right).slice(0, 2);
    return textChoice(`A bag has ${g.r} red and ${g.b} blue marbles. You take two marbles without putting the first one back. What is the probability that both are red?`, right, wrong, "Multiply the probability of the first red by the probability of the second red, after the first is gone.");
  };
  const bothRedWith = (): Question => {
    const g = bag();
    const right = frac(g.r * g.r, g.n * g.n);
    const wrong = [...new Set([frac(g.r * (g.r - 1), g.n * (g.n - 1)), frac(g.r, g.n), frac(2 * g.r, g.n * g.n)])].filter((w) => w !== right).slice(0, 2);
    return textChoice(`A bag has ${g.r} red and ${g.b} blue marbles. You take out one marble, put it back, then take out another. What is the probability that both are red?`, right, wrong, "The first pick is put back, so the second pick has the same chances as the first. Multiply them.");
  };
  const counting = (): Question => {
    const a = randInt(2, 5);
    const b = randInt(2, 6);
    return numQ(`A café has ${a} kinds of sandwich and ${b} kinds of drink. How many different sandwich-and-drink combinations are possible?`, a * b, "Multiply the number of choices.", undefined, 40, 2);
  };
  const compare = (): Question =>
    pick([
      () => textChoice("Which is true about picking two cards from a deck without putting the first back?", "The probability of the second card depends on the first card.", ["The probabilities never change.", "The second pick is always certain."], "Taking a card out changes what is left."),
      () => textChoice("When two events are independent, the probability of both happening is found by…", "multiplying their probabilities", ["adding their probabilities", "subtracting their probabilities"], "P(A and B) = P(A) × P(B)."),
    ])();
  return buildSet([classify, classify, secondRed, bothRedWithout, bothRedWithout, bothRedWith, d === 1 ? counting : compare, d === 3 ? secondRed : pick([counting, compare])]);
}

// ---------- Solids, dilations and views ----------

function solids7(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const NAMES: Record<number, string> = { 3: "triangular", 4: "square", 5: "pentagonal", 6: "hexagonal" };
  const count = (): Question => {
    const n = pick([3, 4, 5, 6]);
    const prism = pick([true, false]);
    const what = pick(["faces", "edges", "vertices"] as const);
    const values = prism ? { faces: n + 2, edges: 3 * n, vertices: 2 * n } : { faces: n + 1, edges: 2 * n, vertices: n + 1 };
    return numQ(`How many ${what} does a ${NAMES[n]} ${prism ? "prism" : "pyramid"} have?`, values[what], prism ? "A prism has two bases plus one side face for each side of the base." : "A pyramid has one base plus one triangle face for each side of the base.", undefined, 24, 3);
  };
  const classify = (): Question => {
    const bank = [
      { q: "A solid has two parallel, matching hexagon bases joined by rectangles. What is it?", a: "hexagonal prism", w: ["hexagonal pyramid", "cylinder"] },
      { q: "A solid has one square base and four triangle faces that meet at a point. What is it?", a: "square pyramid", w: ["square prism", "cone"] },
      { q: "A solid has two parallel, matching circular bases and a curved side. What is it?", a: "cylinder", w: ["cone", "sphere"] },
      { q: "A solid has one circular base and a curved side that comes to a point. What is it?", a: "cone", w: ["cylinder", "pyramid"] },
      { q: "A solid has two matching triangle bases joined by three rectangles. What is it?", a: "triangular prism", w: ["triangular pyramid", "cone"] },
    ];
    const b = pick(bank);
    return textChoice(b.q, b.a, b.w, "Look at the bases and the side faces.");
  };
  const symmetry = (): Question =>
    pick([
      () => numQ("How many planes of symmetry does a cube have?", 9, "There are 3 planes parallel to faces and 6 diagonal planes.", { type: "shape", shape: "cube" }, 12, 3),
      () => numQ("How many planes of symmetry does a rectangular prism with three different edge lengths have?", 3, "Each plane cuts the prism in half parallel to a pair of faces.", { type: "shape", shape: "rectangular-prism" }, 8, 1),
      () => textChoice("A cylinder is turned around its centre line. Does it look the same at every angle?", "Yes, it has rotational symmetry", ["No, it only matches after a full turn", "No, it has no symmetry"], "A cylinder matches itself at every turn around its axis."),
    ])();
  const dilation = (): Question => {
    const k = pick([2, 3, 4]);
    const sides = pick([[3, 4, 5], [2, 3, 4], [5, 6, 7]]);
    return pick([
      () => typeIn(`A triangle has sides ${sides.join(" cm, ")} cm. It is enlarged by a scale factor of ${k}. What is the length of its longest side now, in centimetres?`, sides[2] * k, `Multiply each side by ${k}.`),
      () => typeIn(`A shape with a side of ${sides[0] * k * 2} cm is shrunk by a scale factor of 1/${k}. What is that side now, in centimetres?`, (sides[0] * k * 2) / k, `Divide by ${k}.`),
    ])();
  };
  const similarity = (): Question =>
    pick([
      () => textChoice("Which is true about a shape and its dilation?", "The angles stay the same and the sides change in the same ratio.", ["The sides stay the same and the angles change.", "Both the angles and the sides stay the same."], "A dilation makes a similar shape: same angles, sides scaled."),
      () => textChoice("When two shapes are similar, corresponding angles are…", "equal", ["doubled", "all right angles"], "Similar shapes have the same angles."),
    ])();
  const scale = (): Question => {
    const sc = pick([2, 5, 10, 20]);
    const real = sc * randInt(3, 12);
    return typeIn(`A drawing uses a scale of 1 cm = ${sc} m. A wall is ${real} m long. How long is it on the drawing, in centimetres?`, real / sc, `Divide ${real} by ${sc}.`);
  };
  return buildSet([count, count, classify, classify, symmetry, dilation, d === 1 ? similarity : pick([similarity, scale]), d === 3 ? scale : pick([dilation, scale])]);
}

// ---------- Volume, capacity and surface area ----------

function measure7(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const mlcm = (): Question => {
    const l = randInt(2, 10);
    const w = randInt(2, 8);
    const h = randInt(2, 6);
    return pick([
      () => typeIn(`A box is ${l} cm long, ${w} cm wide and ${h} cm high. How many millilitres of water does it hold when full?`, l * w * h, "1 cm³ holds 1 mL. Find the volume.", { type: "shape", shape: "rectangular-prism" }),
      () => typeIn("A tank is 50 cm long, 20 cm wide and 30 cm high. How many litres does it hold when full? (1 L = 1000 cm³)", 30, "50 × 20 × 30 = 30 000 cm³. Divide by 1000 for litres.", { type: "shape", shape: "rectangular-prism" }),
    ])();
  };
  const idea = (): Question =>
    pick([
      () => textChoice("What is the difference between volume and capacity?", "Volume is the space an object takes up. Capacity is how much a container can hold.", ["They mean exactly the same thing.", "Volume is about area. Capacity is about length."], "Volume describes the space taken up. Capacity describes what a container holds."),
      () => textChoice("How are millilitres and cubic centimetres related?", "1 mL = 1 cm³", ["1 mL = 10 cm³", "1 mL = 100 cm³"], "A cubic centimetre holds exactly one millilitre."),
      () => textChoice("A cube holds 1000 mL. What is its volume in cubic centimetres?", "1000 cm³", ["100 cm³", "10 cm³"], "1 mL = 1 cm³."),
    ])();
  const convert = (): Question => {
    const n = randInt(2, 9);
    return pick([
      () => typeIn(`${n} m² = ☐ cm²`, n * 10000, "1 m² is 100 cm × 100 cm = 10 000 cm².", { type: "equation", text: `${n} m² = ☐ cm²` }),
      () => typeIn(`${n * 10000} cm² = ☐ m²`, n, "10 000 cm² make 1 m².", { type: "equation", text: `${n * 10000} cm² = ☐ m²` }),
      () => typeIn(`${n} m³ = ☐ cm³`, n * 1000000, "1 m³ is 100 × 100 × 100 = 1 000 000 cm³.", { type: "equation", text: `${n} m³ = ☐ cm³` }),
    ])();
  };
  const mixedUnits = (): Question => {
    const m = randInt(2, 5);
    const cm = pick([20, 40, 50, 60, 80]);
    return typeIn(`A rectangle is ${m} m long and ${cm} cm wide. What is its area in square centimetres?`, m * 100 * cm, "Change metres to centimetres first. Then multiply.", { type: "table", headers: ["Length", "Width"], rows: [[`${m} m`, `${cm} cm`]] });
  };
  const cylinderSA = (): Question => {
    for (;;) {
      const r = randInt(2, 6);
      const h = randInt(3, 10);
      const sa = 2 * 3.14 * r * r + 2 * 3.14 * r * h;
      const frac = sa - Math.floor(sa);
      if (Math.abs(frac - 0.5) < 0.05) continue;
      return typeIn(`A cylinder has a radius of ${r} cm and a height of ${h} cm. What is its surface area? Use 3.14 for π and round to the nearest whole number.`, Math.round(sa), "Add the two circles (2 × π × r²) and the curved part (2 × π × r × h).", { type: "shape", shape: "cylinder" });
    }
  };
  const net = (): Question =>
    pick([
      () => textChoice("When the curved surface of a cylinder is laid flat, what shape is it?", "a rectangle", ["a circle", "a triangle"], "Unroll a can's label. It is a rectangle."),
      () => textChoice("The net of a cylinder has two circles and one…", "rectangle", ["triangle", "pentagon"], "The rectangle wraps around as the curved side."),
      () => textChoice("The length of the rectangle in a cylinder's net equals the…", "circumference of the circle", ["radius of the circle", "area of the circle"], "The rectangle wraps once around the circle."),
    ])();
  const volumePrism = (): Question => {
    const base = randInt(6, 40);
    const h = randInt(3, 12);
    return typeIn(`A prism has a base with an area of ${base} cm² and a height of ${h} cm. What is its volume in cubic centimetres?`, base * h, "Volume = area of the base × height.", { type: "shape", shape: "rectangular-prism" });
  };
  return buildSet([mlcm, mlcm, idea, convert, convert, mixedUnits, d === 1 ? volumePrism : cylinderSA, d === 1 ? net : pick([net, cylinderSA])]);
}

// ---------- Money ----------

function money7(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const exchange = (): Question => {
    const rate = pick([1.25, 1.5, 2]);
    const foreign = pick([20, 40, 60, 80]);
    return pick([
      () => typeIn(`Today 1 foreign currency unit costs $${rate.toFixed(2)} Canadian. How many Canadian dollars do you need for ${foreign} units?`, dec(foreign * rate), `Multiply ${foreign} by ${rate}.`, undefined, { keypad: "decimal", accept: [(foreign * rate).toFixed(2), (foreign * rate).toFixed(1)].filter((v) => Number(v) === foreign * rate) }),
      () => typeIn(`Today 1 foreign currency unit costs $${rate.toFixed(2)} Canadian. How many whole units can you buy with $${foreign * rate}?`, foreign, `Divide ${foreign * rate} by ${rate}.`),
    ])();
  };
  const sources = (): Question => {
    const bank = [
      { q: "Which is the most reliable source for how a savings account works?", right: "a bank's official website or a government site", wrong: ["an ad from an unknown company", "a stranger's social media post"] },
      { q: "Which source is likely to give unbiased advice about credit cards?", right: "a government consumer agency", wrong: ["an ad for a card with free prizes", "a friend who just got a new card"] },
      { q: "Why should you check who wrote financial advice?", right: "They may be trying to sell you something.", wrong: ["Everyone gives correct advice.", "It makes the advice shorter."] },
    ];
    const b = pick(bank);
    return textChoice(b.q, b.right, b.wrong, "Choose sources that are experts and have no reason to push a product.");
  };
  const budget = (): Question => {
    const income = pick([250, 300, 400]);
    const rent = pick([80, 100, 120]);
    const food = pick([40, 50, 60]);
    const fun = pick([20, 30, 40]);
    const left = income - rent - food - fun;
    return typeIn(`A student's monthly budget: income $${income}, rent $${rent}, food $${food}, fun $${fun}. How many dollars are left to save?`, left, "Add the spending, then subtract from the income.", { type: "table", headers: ["Item", "Dollars"], rows: [["Income", income], ["Rent", rent], ["Food", food], ["Fun", fun]] });
  };
  const goalMonths = (): Question => {
    const per = pick([20, 25, 40, 50]);
    const months = randInt(4, 12);
    return typeIn(`Leo wants to save $${per * months} for a computer. He saves $${per} each month. How many months will it take?`, months, "Divide the goal by what he saves each month.");
  };
  const factors = (): Question => {
    const bank = [
      { q: "Which is a personal factor that can affect a financial decision?", right: "how much money a person earns", wrong: ["the colour of a bank card", "the weather on Monday"] },
      { q: "Which is a societal factor that can affect financial decisions?", right: "advertising and what friends are buying", wrong: ["a person's favourite colour", "the number of pockets in a coat"] },
      { q: "How might peer pressure affect a financial decision?", right: "A person may buy something just because friends have it.", wrong: ["It always makes people save more.", "It has no effect."] },
    ];
    const b = pick(bank);
    return textChoice(b.q, b.right, b.wrong, "Think about what influences what people choose to buy or save.");
  };
  const interest = (): Question => {
    const p = pick([200, 500, 1000]);
    const rate = pick([2, 4, 5]);
    const years = randInt(2, 4);
    return pick([
      () => typeIn(`You invest $${p} at ${rate}% simple interest per year for ${years} years. How many dollars of interest do you earn in all?`, (p * rate * years) / 100, `Interest each year is ${rate}% of $${p}. Multiply by ${years}.`),
      () => {
        const comp = pick([{ p: 1000, r: 10, a: 1210 }, { p: 1000, r: 5, a: 1102.5 }, { p: 200, r: 10, a: 242 }, { p: 500, r: 10, a: 605 }]);
        return typeIn(`You put $${comp.p} in an account that pays ${comp.r}% interest, compounded yearly. How much is in the account after 2 years, in dollars?`, dec(comp.a), "Year 1: add the interest. Year 2: find the interest on the new total.", undefined, { keypad: "decimal", accept: [comp.a.toFixed(2), comp.a.toFixed(1)].filter((v) => Number(v) === comp.a) });
      },
    ])();
  };
  const compare = (): Question => {
    const a = pick([1, 2, 3]);
    const b = a + pick([0.5, 1]);
    const fee = pick([2, 5]);
    const bal = 1000;
    const earnA = (bal * a) / 100;
    const earnB = (bal * b) / 100 - fee * 12;
    const best = earnA > earnB ? "Account A" : "Account B";
    return textChoice(`Account A pays ${a}% interest with no fees. Account B pays ${b}% interest but charges $${fee} a month. With $${bal} for a year, which account earns more?`, best, [best === "Account A" ? "Account B" : "Account A"], "Find the interest earned on each account for a year, then subtract the fees.");
  };
  return buildSet([exchange, exchange, sources, budget, goalMonths, factors, d === 1 ? goalMonths : interest, d === 1 ? factors : pick([interest, compare])]);
}

export const units: Unit[] = [
  {
    id: "numbers-7",
    title: "Big & Rational Numbers",
    emoji: "🔢",
    blurb: "Billions, roots and fractions",
    standards: on("B1.1–B1.6", "numbers to one billion, perfect squares, rational numbers, simplifying fractions and rounding"),
    parentNote: "Writing big numbers with powers of ten, perfect squares and square roots, comparing positive and negative fractions and decimals, simplifying fractions and rounding.",
    generate: numbers7,
  },
  {
    id: "powers-7",
    title: "Factors & Exponents",
    emoji: "⚡",
    blurb: "GCF, LCM and powers",
    standards: on("B2.6, B2.7", "greatest common factor, lowest common multiple and exponential notation"),
    parentNote: "Finding the greatest common factor and lowest common multiple, and writing and evaluating repeated multiplication with exponents.",
    generate: powers7,
  },
  {
    id: "fractions-7",
    title: "Fractions",
    emoji: "🍕",
    blurb: "Add, subtract, multiply, divide",
    standards: on("B2.5, B2.8", "adding and subtracting fractions with equivalent fractions, and multiplying and dividing fractions by fractions"),
    parentNote: "Adding and subtracting fractions with different denominators, and multiplying and dividing a fraction by a fraction.",
    generate: fractions7,
  },
  {
    id: "percents-7",
    title: "Percents & Proportions",
    emoji: "💯",
    blurb: "Increase, decrease and proportional",
    standards: on("B2.2, B2.3, B2.10", "common fraction, decimal and percent equivalents, increasing and decreasing by a percent, and proportional reasoning"),
    parentNote: "Knowing common fraction, decimal and percent equivalents, increasing and decreasing numbers by 1%, 5%, 10%, 25%, 50% and 100%, and deciding whether a relationship is proportional.",
    generate: percents7,
  },
  {
    id: "algebra-7",
    title: "Algebra Moves",
    emoji: "🔤",
    blurb: "Like terms and inequalities",
    standards: on("C2.1–C2.4", "adding and subtracting monomials, evaluating expressions, solving equations and solving inequalities"),
    parentNote: "Combining like terms, evaluating expressions with decimals, solving two-step equations, and finding and graphing solutions to inequalities.",
    generate: algebra7,
  },
  {
    id: "data-7",
    title: "Data & Percentages",
    emoji: "📊",
    blurb: "Percents, circle graphs and outliers",
    standards: on("D1.1, D1.2, D1.5, D1.6", "percentages in data, circle graph angles, the effect of adding or removing data, and misleading graphs"),
    parentNote: "Using percents to compare groups, turning circle-graph angles into percents, and seeing how adding or removing a value changes the mean and median.",
    generate: data7,
  },
  {
    id: "dependent-events",
    title: "Dependent Events",
    emoji: "🎲",
    blurb: "With and without replacement",
    standards: on("D2.1, D2.2", "independent and dependent events, and probabilities of two events"),
    parentNote: "Telling independent from dependent events and finding the probability of two events, with and without putting the first item back.",
    generate: dependent7,
  },
  {
    id: "solids-7",
    title: "Solids & Scale",
    emoji: "🧊",
    blurb: "Faces, symmetry and dilations",
    standards: on("E1.1–E1.3", "classifying prisms, pyramids and cylinders, symmetry, dilations and scale drawings"),
    parentNote: "Counting faces, edges and vertices, classifying solids, planes of symmetry, enlarging and shrinking shapes by a scale factor, and scale drawings.",
    generate: solids7,
  },
  {
    id: "measure-7",
    title: "Volume & Surface Area",
    emoji: "📦",
    blurb: "Capacity, conversions and cylinders",
    standards: on("E2.1, E2.2, E2.6, E2.7", "volume and capacity, converting area and volume units, surface area of cylinders and volume of prisms"),
    parentNote: "Linking millilitres and cubic centimetres, converting square and cubic units, the surface area of a cylinder from its net, and the volume of prisms.",
    generate: measure7,
  },
  {
    id: "money-7",
    title: "Money Smarts",
    emoji: "💱",
    blurb: "Exchange rates, budgets and interest",
    standards: on("F1.1–F1.6", "exchange rates, reliable sources, budgets for longer-term goals, factors that influence choices, and interest"),
    parentNote: "Converting between currencies, finding reliable money advice, budgeting for a goal, and seeing how simple and compound interest and fees change savings and borrowing.",
    generate: money7,
  },
];
