import { chance, pick, randInt, sample, shuffle, textChoice } from "../../random";
import type { Course, GenerateOptions, OrderQuestion, Question, SortQuestion, Visual } from "../../types";

type Level = 1 | 2 | 3;
type Gen = (l: Level) => Question;
const levelOf = (o?: GenerateOptions): Level => o?.difficulty ?? 2;

// ---------- helpers ----------

const M = "−"; // true minus sign for display
const num = (n: number) => (n < 0 ? `${M}${-n}` : String(n));
/** " + 3" or " − 3" */
const addTerm = (n: number) => (n < 0 ? ` ${M} ${-n}` : ` + ${n}`);
const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const sup = (n: number) =>
  (n < 0 ? "⁻" : "") +
  String(Math.abs(n))
    .split("")
    .map((d) => SUP[+d])
    .join("");
const pw = (v: string, n: number) => (n === 1 ? v : `${v}${sup(n)}`);

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;
const isSq = (n: number) => n >= 0 && Number.isInteger(Math.sqrt(n));
const isCube = (n: number) => Number.isInteger(Math.round(Math.cbrt(n))) && Math.round(Math.cbrt(n)) ** 3 === n;
const nonzero = (lo: number, hi: number) => {
  let n = 0;
  while (n === 0) n = randInt(lo, hi);
  return n;
};

/** A multiple-choice question; wrong answers are de-duplicated against the right one. */
function mc(prompt: string, right: string, wrong: string[], hint: string, visual?: Visual): Question {
  const seen = new Set<string>([right]);
  const w: string[] = [];
  for (const x of shuffle(wrong)) {
    if (!seen.has(x)) {
      seen.add(x);
      w.push(x);
    }
  }
  return textChoice(prompt, right, w.slice(0, 4), hint, visual);
}

interface TypedOpts {
  keypad?: "number" | "integer" | "decimal" | "fraction";
  suffix?: string;
  visual?: Visual;
  accept?: string[];
}
function typed(prompt: string, answer: string | number, hint: string, o: TypedOpts = {}): Question {
  return {
    kind: "input",
    prompt,
    hint,
    answer: String(answer),
    keypad: o.keypad ?? "number",
    suffix: o.suffix,
    accept: o.accept,
    visual: o.visual,
  };
}
/** Typed whole number that may be negative. */
const typedInt = (prompt: string, n: number, hint: string, o: TypedOpts = {}) =>
  typed(prompt, n, hint, { ...o, keypad: "integer" });

/** Build a set of distinct questions from templates. */
function build(gens: Gen[], level: Level, count = 8): Question[] {
  const out: Question[] = [];
  const seen = new Set<string>();
  let pool: Gen[] = [];
  for (let tries = 0; out.length < count && tries < count * 10; tries++) {
    if (pool.length === 0) pool = shuffle(gens);
    const q = pool.pop()!(level);
    const key = JSON.stringify(q);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }
  return out;
}

function sortQ(
  prompt: string,
  hint: string,
  bins: { id: string; label: string; emoji: string }[],
  pools: Record<string, string[]>,
  perBin: number,
): SortQuestion {
  const items = bins.flatMap((b) => sample(pools[b.id], perBin).map((label) => ({ label, emoji: b.emoji, bin: b.id })));
  return { kind: "sort", prompt, hint, bins, items: shuffle(items).map((it, i) => ({ id: `s${i}`, ...it })) };
}

// ---------- expression formatting ----------

/** Coefficients from the highest power down, e.g. [2, -3, 5] → "2x² − 3x + 5". */
function polyStr(c: number[], v = "x"): string {
  let s = "";
  const deg = c.length - 1;
  c.forEach((k, i) => {
    if (k === 0) return;
    const d = deg - i;
    const a = Math.abs(k);
    const body = d === 0 ? String(a) : `${a === 1 ? "" : a}${pw(v, d)}`;
    if (s === "") s = (k < 0 ? M : "") + body;
    else s += ` ${k < 0 ? M : "+"} ${body}`;
  });
  return s === "" ? "0" : s;
}
/** px + q */
const linStr = (p: number, q: number, v = "x") => polyStr([p, q], v);
const facStr = (p: number, q: number) => `(${linStr(p, q)})`;
/** Product of two linear factors in a fixed order, so reversed copies never appear. */
function prodStr(f1: [number, number], f2: [number, number]): string {
  const [a, b] = f1[0] < f2[0] || (f1[0] === f2[0] && f1[1] <= f2[1]) ? [f1, f2] : [f2, f1];
  return `${facStr(a[0], a[1])}${facStr(b[0], b[1])}`;
}
const expandLin = (p: number, q: number, r: number, s: number): number[] => [p * r, p * s + q * r, q * s];

/**
 * Wrong answers given as functions of x: keep only those that really differ from `truth`
 * (so no wrong answer is secretly equal to the right one).
 */
function differing(truth: (x: number) => number, cands: { t: string; f: (x: number) => number }[]): string[] {
  const xs = [2, 3, 5, -1, 7];
  return cands.filter((c) => xs.some((x) => Math.abs(c.f(x) - truth(x)) > 1e-9)).map((c) => c.t);
}

// ---------- fractions (for slopes) ----------
type Fr = { n: number; d: number };
const fr = (n: number, d = 1): Fr => {
  const g = gcd(n, d) || 1;
  const s = d < 0 ? -1 : 1;
  return { n: (s * n) / g, d: (s * d) / g };
};
const frStr = (f: Fr) => (f.d === 1 ? num(f.n) : `${num(f.n)}/${f.d}`);
const frEq = (a: Fr, b: Fr) => a.n === b.n && a.d === b.d;
const frNeg = (f: Fr) => fr(-f.n, f.d);
const frRecip = (f: Fr) => fr(f.d, f.n);
/** Slope–intercept equation: y = mx + b with m a fraction and b an integer. */
function eqStr(m: Fr, b: number): string {
  let slope: string;
  if (m.d === 1) slope = m.n === 1 ? "x" : m.n === -1 ? `${M}x` : `${num(m.n)}x`;
  else slope = `${m.n < 0 ? M : ""}(${Math.abs(m.n)}/${m.d})x`;
  return `y = ${slope}${b === 0 ? "" : addTerm(b)}`;
}

// ---------- plots ----------
type Pt = { x: number; y: number };
/** A straight line y = mx + b clipped to the window. */
function lineCurve(m: number, b: number, win: number, label?: string, dashed?: boolean) {
  let lo = -win;
  let hi = win;
  if (m !== 0) {
    const x1 = (-win - b) / m;
    const x2 = (win - b) / m;
    lo = Math.max(lo, Math.min(x1, x2));
    hi = Math.min(hi, Math.max(x1, x2));
  }
  const pts: Pt[] = [
    { x: lo, y: m * lo + b },
    { x: hi, y: m * hi + b },
  ];
  return { points: pts, label, dashed };
}
/** A smooth curve sampled from f, keeping only the part inside the window. */
function funcCurve(f: (x: number) => number, x0: number, x1: number, yMin: number, yMax: number, label?: string) {
  const pts: Pt[] = [];
  for (let x = x0; x <= x1 + 1e-9; x += 0.25) {
    const y = f(x);
    if (y >= yMin - 0.5 && y <= yMax + 0.5) pts.push({ x, y });
  }
  return { points: pts, label };
}
const win = (n: number, curves: ReturnType<typeof lineCurve>[], points?: { x: number; y: number; label?: string }[]): Visual => ({
  type: "plot",
  xMin: -n,
  xMax: n,
  yMin: -n,
  yMax: n,
  step: 1,
  curves,
  points,
});

const pair = (x: number, y: number) => `(${num(x)}, ${num(y)})`;
const NAMES = ["Maya", "Jay", "Sam", "Amir", "Lena", "Kenji", "Zoe", "Ravi", "Ana", "Noah", "Priya", "Leo", "Amara", "Mateo"];

// ---------- Unit 1: Irrational numbers and radicals ----------

const NONSQ = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19, 21, 22, 23];
const SQFREE = [2, 3, 5, 6, 7, 10, 11];
const rad = (a: number, b: number) => (a === 1 ? `√${b}` : `${a}√${b}`);

const irrationalPick: Gen = (l) => {
  const n = pick(NONSQ);
  const cubeNon = pick([2, 3, 4, 5, 6, 7, 9, 10]);
  const right = chance(0.75) ? `√${n}` : `∛${cubeNon}`;
  const k = randInt(2, l === 1 ? 8 : 14);
  const wrong = [
    `√${k * k}`,
    pick(["0.125", "2.75", "−4.6"]),
    `${randInt(1, 9)}/${pick([7, 9, 11, 13])}`,
    pick(["0.272727…", "0.3333…", "1.41"]),
    `∛${randInt(2, 5) ** 3}`,
  ];
  return mc(
    "Which of these numbers is irrational?",
    right,
    wrong,
    "An irrational number cannot be written as a fraction of integers. Square roots of non-perfect squares go on forever without repeating. Terminating and repeating decimals are rational.",
  );
};

const rationalPick: Gen = (l) => {
  const k = randInt(2, l === 1 ? 9 : 15);
  const right = pick([`√${k * k}`, "0.272727…", "−3/4", `∛${randInt(2, 5) ** 3}`, "0.0625"]);
  const wrong = [`√${pick(NONSQ)}`, "π", `√${pick([3, 5, 7, 11])}`, `∛${pick([2, 3, 4, 5])}`, `√${pick([2, 6, 10, 13])}`];
  return mc(
    "Which of these numbers is rational?",
    right,
    wrong,
    "A rational number can be written as a fraction. Perfect-square roots, terminating decimals and repeating decimals all qualify. π and the square roots of non-perfect squares do not.",
  );
};

function simplifyWrongs(a: number, b: number): string[] {
  return [rad(b, a), rad(a * a, b), rad(a, a * b), rad(a + 1, b), rad(a, b + 2)];
}

const simplifyRadical: Gen = (l) => {
  const a = randInt(2, l === 1 ? 4 : l === 2 ? 7 : 10);
  const b = pick(l === 1 ? [2, 3, 5] : SQFREE);
  const c = l === 3 && chance(0.5) ? randInt(2, 4) : 1;
  const n = a * a * b;
  if (c === 1) {
    return mc(
      `Write √${n} as a mixed radical in simplest form.`,
      rad(a, b),
      simplifyWrongs(a, b),
      `Find the largest perfect square that divides ${n}. Here ${n} = ${a * a} × ${b}, so √${n} = √${a * a} × √${b} = ${a}√${b}.`,
    );
  }
  return mc(
    `Simplify ${c}√${n}.`,
    rad(c * a, b),
    [rad(c + a, b), rad(a, c * b), rad(c * a * a, b), rad(c * a, a * b)],
    `Simplify the radical first: √${n} = ${a}√${b}. Then multiply the coefficients: ${c} × ${a} = ${c * a}.`,
  );
};

const entireRadical: Gen = (l) => {
  const a = randInt(2, l === 1 ? 5 : 9);
  const b = pick(l === 1 ? [2, 3, 5] : SQFREE);
  return mc(
    `Write ${a}√${b} as an entire radical.`,
    `√${a * a * b}`,
    [`√${a * b}`, `√${a + b}`, `√${a * b * b}`, `√${a * a + b}`, `√${a * a * b + 1}`],
    `Move the coefficient back under the root by squaring it: ${a}√${b} = √(${a}² × ${b}) = √${a * a * b}.`,
  );
};

const betweenIntegers: Gen = (l) => {
  let n = 0;
  do n = randInt(2, l === 1 ? 60 : l === 2 ? 150 : 400);
  while (isSq(n));
  const k = Math.floor(Math.sqrt(n));
  return mc(
    `Between which two consecutive integers does √${n} lie?`,
    `${k} and ${k + 1}`,
    [`${k - 1} and ${k}`, `${k + 1} and ${k + 2}`, `${Math.floor(n / 2)} and ${Math.floor(n / 2) + 1}`, `${k} and ${k + 2}`],
    `Find the perfect squares on either side of ${n}: ${k}² = ${k * k} and ${(k + 1) ** 2} = ${(k + 1) ** 2}. So √${n} is between ${k} and ${k + 1}.`,
  );
};

const orderValues: Gen = () => {
  const radicands = [2, 3, 5, 7, 8, 10, 11, 12, 13, 15, 17, 19, 20, 21, 22, 23, 24, 26];
  const decimals = [1.5, 2.2, 2.5, 2.8, 3.1, 3.5, 3.8, 4.2, 4.5, 4.7];
  for (let tries = 0; tries < 80; tries++) {
    const items: { label: string; v: number }[] = [
      ...sample(radicands, 2).map((n) => ({ label: `√${n}`, v: Math.sqrt(n) })),
      ...sample(decimals, 2).map((d) => ({ label: String(d), v: d })),
    ];
    const sorted = [...items].sort((a, b) => a.v - b.v);
    if (sorted.every((it, i) => i === 0 || it.v - sorted[i - 1].v > 0.08)) {
      const q: OrderQuestion = {
        kind: "order",
        prompt: "Put these numbers in order from least to greatest.",
        hint: "Estimate each root with its neighbouring perfect squares, or use a calculator, then compare the decimals.",
        items: sorted.map((it, i) => ({ id: `o${i}`, label: it.label })),
      };
      return q;
    }
  }
  return mc("Which is greatest?", "√17", ["4", "√15", "3.5"], "Compare √17 ≈ 4.12 with the others.");
};

const addLike: Gen = (l) => {
  const r = pick(SQFREE);
  const a = randInt(2, 9);
  const b = randInt(2, a - 1 < 2 ? 2 : a - 1);
  if (chance(0.5) || l === 1) {
    return mc(
      `Simplify ${a}√${r} + ${b}√${r}.`,
      `${a + b}√${r}`,
      [`${a + b}√${2 * r}`, `${a * b}√${r}`, `${a * b}√${r * r}`, `${(a + b) * r}`],
      `Like radicals have the same radicand, so add the coefficients and keep the radical: (${a} + ${b})√${r}.`,
    );
  }
  return mc(
    `Simplify ${a + b}√${r} − ${b}√${r}.`,
    `${a}√${r}`,
    [`${a}√${r - r + 2 * r}`, `${a + 2 * b}√${r}`, `${(a + b) * b}√${r}`, `${a}`],
    `Subtract the coefficients and keep the radical: (${a + b} − ${b})√${r}.`,
  );
};

const simplifySum: Gen = () => {
  const r = pick([2, 3, 5, 6]);
  const p = randInt(2, 5);
  let q = randInt(2, 5);
  if (q === p) q = p === 5 ? 2 : p + 1;
  return mc(
    `Simplify √${p * p * r} + √${q * q * r}.`,
    `${p + q}√${r}`,
    [`√${p * p * r + q * q * r}`, `${p * q}√${r}`, `${p + q}√${2 * r}`, `${p + q - 1}√${r}`],
    `Simplify each root first: √${p * p * r} = ${p}√${r} and √${q * q * r} = ${q}√${r}. Now they are like radicals.`,
  );
};

const multiplyRadicals: Gen = (l) => {
  const p = pick([2, 3, 5, 6, 7]);
  const u = randInt(1, l === 1 ? 2 : 4);
  const v = randInt(1, l === 1 ? 2 : 4);
  const x = p * u * u;
  const y = p * v * v;
  const ans = p * u * v;
  return typed(
    `Evaluate √${x} × √${y}.`,
    ans,
    `Multiply under the root: √(${x} × ${y}) = √${x * y}. Then take the square root, which is a whole number here.`,
  );
};

const cubeRoot: Gen = (l) => {
  const k = randInt(1, l === 1 ? 4 : 10);
  const s = chance(0.4) ? -1 : 1;
  const n = s * k ** 3;
  return typedInt(
    `Evaluate ∛(${num(n)}).`,
    s * k,
    `Ask “what number multiplied by itself three times gives ${num(n)}?” A negative number cubed stays negative.`,
  );
};

const sortRational: Gen = () =>
  sortQ(
    "Sort each number: rational or irrational?",
    "Rational numbers can be written as a fraction (including terminating and repeating decimals, and roots of perfect squares). Irrational numbers have decimals that never end or repeat.",
    [
      { id: "rat", label: "Rational", emoji: "➗" },
      { id: "irr", label: "Irrational", emoji: "♾️" },
    ],
    {
      rat: ["√16", "√49", "0.75", "−5", "3/8", "22/7", "3.14", "0.333…", "√0.25", "∛27", "√100"],
      irr: ["√2", "√3", "√5", "√10", "π", "√12", "√50", "√20", "∛2", "√99"],
    },
    3,
  );

const expansionFact: Gen = () => {
  const s = pick(["√2", "√5", "π", "√3"]);
  return mc(
    `Which statement about the decimal form of ${s} is true?`,
    "It never ends and never repeats a pattern.",
    ["It ends after a few digits.", "It repeats a block of digits forever.", "It is exactly equal to a fraction such as 22/7."],
    "Irrational numbers are exactly the ones whose decimals neither terminate nor repeat. Calculator values are only approximations.",
  );
};

const squareSide: Gen = (l) => {
  const a = randInt(2, l === 1 ? 5 : 9);
  const b = pick(l === 1 ? [2, 3, 5] : SQFREE);
  const n = a * a * b;
  return mc(
    `A square tile has an area of ${n} cm². What is its side length in simplest radical form?`,
    `${rad(a, b)} cm`,
    simplifyWrongs(a, b).map((s) => `${s} cm`),
    `Side = √area = √${n}. Pull out the perfect square: ${n} = ${a * a} × ${b}.`,
  );
};

const radicalsUnit = (o?: GenerateOptions) =>
  build(
    [irrationalPick, rationalPick, simplifyRadical, entireRadical, betweenIntegers, orderValues, addLike, simplifySum, multiplyRadicals, cubeRoot, sortRational, expansionFact, squareSide],
    levelOf(o),
  );

// ---------- Unit 2: Exponent laws and rational exponents ----------

const VARS = ["x", "y", "a", "n", "m", "k"];

const productLaw: Gen = (l) => {
  const v = pick(VARS);
  const m = randInt(2, l === 1 ? 5 : 8);
  const n = randInt(l === 3 ? 1 : 2, l === 1 ? 5 : 8);
  return mc(
    `Simplify ${pw(v, m)} × ${pw(v, n)}.`,
    pw(v, m + n),
    [pw(v, m * n), pw(v, m + n + 1), `2${pw(v, m + n)}`, pw(v, Math.abs(m - n) + 1)],
    "When you multiply powers with the same base, keep the base and add the exponents.",
  );
};

const quotientLaw: Gen = (l) => {
  const v = pick(VARS);
  const n = randInt(2, 5);
  const m = n + randInt(1, l === 1 ? 4 : 6);
  return mc(
    `Simplify ${pw(v, m)} ÷ ${pw(v, n)}.`,
    pw(v, m - n),
    [pw(v, m + n), pw(v, m - n + 1), pw(v, m - n - 1), pw(v, n - m)],
    "When you divide powers with the same base, keep the base and subtract the exponents (top minus bottom).",
  );
};

const powerOfPower: Gen = (l) => {
  const v = pick(VARS);
  const m = randInt(2, l === 1 ? 4 : 6);
  const n = randInt(2, l === 1 ? 4 : 5);
  return mc(
    `Simplify (${pw(v, m)})${sup(n)}.`,
    pw(v, m * n),
    [pw(v, m + n), pw(v, m ** n > 99 ? m * n + 2 : m ** n), pw(v, m * n - 1), pw(v, m * n + 1)],
    "A power raised to a power: keep the base and multiply the exponents.",
  );
};

const coefficientProduct: Gen = (l) => {
  const v = pick(VARS);
  const a = randInt(2, l === 1 ? 4 : 7);
  const b = randInt(2, l === 1 ? 4 : 7);
  const m = randInt(2, 5);
  const n = randInt(2, 5);
  return mc(
    `Simplify (${a}${pw(v, m)})(${b}${pw(v, n)}).`,
    `${a * b}${pw(v, m + n)}`,
    [`${a + b}${pw(v, m + n)}`, `${a * b}${pw(v, m * n)}`, `${a * b}${pw(v, m + n - 1)}`, `${a * b + 1}${pw(v, m + n)}`],
    "Multiply the coefficients, then add the exponents of the same variable.",
  );
};

const powerOfProduct: Gen = (l) => {
  const v = pick(VARS);
  const c = randInt(2, l === 1 ? 3 : 4);
  const m = randInt(2, 4);
  const n = randInt(2, 3);
  return mc(
    `Simplify (${c}${pw(v, m)})${sup(n)}.`,
    `${c ** n}${pw(v, m * n)}`,
    [`${c}${pw(v, m * n)}`, `${c ** n}${pw(v, m + n)}`, `${c * n}${pw(v, m * n)}`, `${c ** n}${pw(v, m)}`],
    "The exponent applies to every factor inside the brackets: raise the coefficient to the power and multiply the variable's exponent.",
  );
};

const zeroExponent: Gen = () => {
  const b = randInt(2, 9);
  const items: { expr: string; val: number; hint: string }[] = [
    { expr: `${b}⁰`, val: 1, hint: "Any non-zero number to the power 0 equals 1." },
    { expr: `(${M}${b})⁰`, val: 1, hint: "The brackets include the negative sign, so the base is nonzero: anything⁰ = 1." },
    { expr: `${M}${b}⁰`, val: -1, hint: "Without brackets, the exponent applies only to the ${b}: first ${b}⁰ = 1, then the negative sign gives −1." },
    { expr: `${b} + ${b}⁰`, val: b + 1, hint: "Evaluate the power first: ${b}⁰ = 1, then add." },
    { expr: `${b}x⁰ (x ≠ 0)`, val: b, hint: "Only x has the exponent 0, so x⁰ = 1 and the coefficient stays." },
  ];
  const it = pick(items);
  const right = num(it.val);
  return mc(
    `Evaluate ${it.expr}.`,
    right,
    ["0", "1", num(-b), String(b), num(-1), String(b + 1)],
    it.hint.replace(/\$\{b\}/g, String(b)),
  );
};

const hasFiniteDecimal = (d: number) => {
  let x = d;
  while (x % 2 === 0) x /= 2;
  while (x % 5 === 0) x /= 5;
  return x === 1;
};

const negativeExponent: Gen = (l) => {
  if (chance(0.45)) {
    const v = pick(VARS);
    const n = randInt(2, 5);
    return mc(
      `Write ${v}${sup(-n)} with a positive exponent.`,
      `1/${pw(v, n)}`,
      [`${M}${pw(v, n)}`, pw(v, n), `${M}${n}${v}`, `1/${pw(v, n + 1)}`],
      "A negative exponent means “take the reciprocal”: x⁻ⁿ = 1/xⁿ. The answer is not negative.",
    );
  }
  const b = pick(l === 1 ? [2, 3, 5] : [2, 3, 4, 5, 10]);
  const n = randInt(1, b === 10 ? 3 : b === 2 ? 4 : 2);
  const d = b ** n;
  return typed(
    `Evaluate ${b}${sup(-n)} as a fraction.`,
    `1/${d}`,
    `${b}${sup(-n)} = 1/${b}${sup(n)} = 1/${d}.`,
    { keypad: "fraction", accept: hasFiniteDecimal(d) ? [String(1 / d)] : undefined },
  );
};

const evaluatePowers: Gen = (l) => {
  const kind = randInt(0, 2);
  for (let tries = 0; tries < 30; tries++) {
    const a = randInt(2, l === 1 ? 3 : 5);
    const m = randInt(2, 4);
    const n = randInt(2, 4);
    if (kind === 0 && a ** (m + n) < 100000) {
      return typed(`Evaluate ${a}${sup(m)} × ${a}${sup(n)}.`, a ** (m + n), `Add the exponents first: ${a}${sup(m + n)}. Then evaluate.`);
    }
    if (kind === 1 && a ** (m * n) < 100000) {
      return typed(`Evaluate (${a}${sup(m)})${sup(n)}.`, a ** (m * n), `Multiply the exponents: ${a}${sup(m * n)}. Then evaluate.`);
    }
    if (kind === 2 && m !== n) {
      const hi = Math.max(m, n) + 1;
      const lo = Math.min(m, n);
      if (a ** hi < 100000) return typed(`Evaluate ${a}${sup(hi)} ÷ ${a}${sup(lo)}.`, a ** (hi - lo), `Subtract the exponents: ${a}${sup(hi - lo)}. Then evaluate.`);
    }
  }
  return typed("Evaluate 2³ × 2².", 32, "Add the exponents: 2⁵ = 32.");
};

const rationalExpEval: Gen = (l) => {
  const idx = l === 1 ? pick([2, 3]) : pick([2, 3, 3, 4]);
  const maxRoot = idx === 2 ? 12 : idx === 3 ? 5 : 3;
  const r = randInt(2, maxRoot);
  const m = l === 1 ? 1 : randInt(1, idx === 2 ? 3 : 3);
  const base = r ** idx;
  const ans = r ** m;
  const word = idx === 2 ? "square root" : idx === 3 ? "cube root" : "fourth root";
  return typed(
    `Evaluate ${base}^(${m}/${idx}).`,
    ans,
    `The denominator ${idx} is the root: take the ${word} of ${base}, which is ${r}. The numerator ${m} is the power: ${r}${sup(m)} = ${ans}.`,
  );
};

const rationalExpNegative: Gen = () => {
  const idx = pick([2, 3]);
  const r = idx === 2 ? randInt(2, 10) : randInt(2, 4);
  const m = pick([1, 1, 2]);
  const base = r ** idx;
  const d = r ** m;
  return typed(
    `Evaluate ${base}^(${M}${m}/${idx}) as a fraction.`,
    `1/${d}`,
    `The negative sign means take the reciprocal: 1 / ${base}^(${m}/${idx}). Then ${base}^(${m}/${idx}) = ${d}.`,
    { keypad: "fraction", accept: hasFiniteDecimal(d) ? [String(1 / d)] : undefined },
  );
};

const radicalForm: Gen = () => {
  const root = (idx: number, e: number) => {
    const sign = idx === 2 ? "√" : "∛";
    return e === 1 ? `${sign}x` : `${sign}(${pw("x", e)})`;
  };
  if (chance(0.5)) {
    const idx = pick([2, 3]);
    const e = idx === 2 ? pick([1, 3, 5]) : pick([1, 2, 4, 5]);
    const w = [`x^(${idx}/${e})`, `x^(${e}·${idx})`, `x^(${M}${e}/${idx})`, `x^(1/${e + idx})`];
    return mc(`Write ${root(idx, e)} as a power with a rational exponent.`, `x^(${e}/${idx})`, w, "The index of the root becomes the denominator; the power under the root becomes the numerator.");
  }
  const idx = pick([2, 3]);
  const e = idx === 2 ? pick([3, 5]) : pick([2, 4, 5]);
  return mc(
    `Write x^(${e}/${idx}) as a radical.`,
    root(idx, e),
    [root(idx === 2 ? 3 : 2, e), root(e === 2 || e === 3 ? e : idx === 2 ? 3 : 2, idx), `${e}√x`, root(idx, 1)],
    "Denominator = the root (index). Numerator = the power on x inside the root.",
  );
};

const lawStatements: Gen = () => {
  const truths = [
    "(ab)³ = a³b³",
    "x⁴ · x⁻² = x²",
    "(x²)³ = x⁶",
    "x⁵ ÷ x² = x³",
    "5⁰ = 1",
    "2⁻³ = 1/8",
    "9^(1/2) = 3",
    "(3x)² = 9x²",
    "8^(1/3) = 2",
    "(a/b)² = a²/b²",
  ];
  const falses = [
    "x³ · x⁴ = x¹²",
    "(x²)³ = x⁵",
    "x⁶ ÷ x² = x³",
    "3⁰ = 0",
    "2⁻³ = −8",
    "(2x)² = 2x²",
    "4^(1/2) = 1/4",
    "x² + x³ = x⁵",
    "(x + y)² = x² + y²",
    "2³ · 2² = 4⁵",
    "−3² = 9",
    "27^(1/3) = 9",
    "x⁻² = −x²",
  ];
  return mc(
    "Which statement is true for all values where it is defined?",
    pick(truths),
    sample(falses, 4),
    "Test each one with small numbers (for example x = 2) or recall the law it relies on. Only one of these is always true.",
  );
};

const findMistake: Gen = () => {
  const cases = [
    { work: "(x³)² = x⁵", right: "The exponents should have been multiplied, not added.", wrong: ["The exponents should have been subtracted.", "The base should have changed to 2x.", "Nothing is wrong."] },
    { work: "x⁴ · x² = x⁸", right: "The exponents should have been added, not multiplied.", wrong: ["The exponents should have been subtracted.", "The base should have been multiplied by 2.", "Nothing is wrong."] },
    { work: "(2x)³ = 2x³", right: "The 2 also needs the exponent: it should be 8x³.", wrong: ["The x should be x⁶.", "The 2 should be added to the exponent.", "Nothing is wrong."] },
    { work: "x⁶ ÷ x² = x³", right: "The exponents should have been subtracted, not divided.", wrong: ["The exponents should have been added.", "The result should be 1.", "Nothing is wrong."] },
    { work: "5⁰ = 0", right: "Any non-zero base to the exponent 0 equals 1.", wrong: ["The answer should be 5.", "The answer should be −5.", "Nothing is wrong."] },
  ];
  const c = pick(cases);
  return mc(`A student wrote “${c.work}”. What is the mistake?`, c.right, c.wrong, "Check which exponent law applies, then redo the step carefully.");
};

const growthContext: Gen = (l) => {
  if (chance(0.5)) {
    const start = pick([5, 10, 20, 50]);
    const hrs = randInt(2, l === 1 ? 4 : 6);
    return typed(
      `A bacteria culture starts at ${start} cells and doubles every hour. How many cells are there after ${hrs} hours?`,
      start * 2 ** hrs,
      `Doubling ${hrs} times multiplies by 2${sup(hrs)} = ${2 ** hrs}. Then ${start} × ${2 ** hrs}.`,
    );
  }
  const mg = pick([400, 800, 1600, 640]);
  const hl = randInt(2, 4);
  return typed(
    `A medicine's half-life is 6 hours. A patient takes ${mg} mg. How many mg remain after ${hl * 6} hours?`,
    mg / 2 ** hl,
    `${hl * 6} hours is ${hl} half-lives, so divide by 2${sup(hl)} = ${2 ** hl}.`,
    { suffix: "mg" },
  );
};

const exponentsUnit = (o?: GenerateOptions) =>
  build(
    [productLaw, quotientLaw, powerOfPower, coefficientProduct, powerOfProduct, zeroExponent, negativeExponent, evaluatePowers, rationalExpEval, rationalExpNegative, radicalForm, lawStatements, findMistake, growthContext],
    levelOf(o),
  );

// ---------- Unit 3: Primes, GCF and LCM ----------

type FMap = Map<number, number>;
function factorize(n: number): FMap {
  const out: FMap = new Map();
  let x = n;
  for (let p = 2; p * p <= x; p++) {
    while (x % p === 0) {
      out.set(p, (out.get(p) ?? 0) + 1);
      x /= p;
    }
  }
  if (x > 1) out.set(x, (out.get(x) ?? 0) + 1);
  return out;
}
const fmtMap = (m: FMap): string =>
  m.size === 0
    ? "1"
    : [...m.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([p, e]) => pw(String(p), e))
        .join(" × ");
const mapValue = (m: FMap) => [...m.entries()].reduce((v, [p, e]) => v * p ** e, 1);
const PRIMES = [2, 3, 5, 7, 11];
const BIG_PRIMES = [53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113];
const FAKE_PRIMES = [51, 57, 87, 91, 77, 119, 121, 133, 143, 169, 117, 111];

function randomFactored(level: Level): FMap {
  const ps = sample(PRIMES.slice(0, level === 1 ? 3 : level === 2 ? 4 : 5), level === 1 ? 2 : 3);
  const m: FMap = new Map();
  for (const p of ps) m.set(p, randInt(1, p <= 3 ? 3 : 2));
  return m;
}

const primeFactorization: Gen = (l) => {
  let m = randomFactored(l);
  while (mapValue(m) > 2500) m = randomFactored(1);
  const n = mapValue(m);
  const entries = [...m.entries()].sort((a, b) => a[0] - b[0]);
  const wrong: string[] = [];
  // Change one exponent or one prime.
  for (const [p, e] of entries) {
    const alt: FMap = new Map(m);
    alt.set(p, e + 1);
    wrong.push(fmtMap(alt));
    if (e > 1) {
      const alt2: FMap = new Map(m);
      alt2.set(p, e - 1);
      wrong.push(fmtMap(alt2));
    }
  }
  // A product that uses a composite number.
  const flat = entries.flatMap(([p, e]) => Array<number>(e).fill(p));
  if (flat.length >= 3) wrong.push([flat[0] * flat[1], ...flat.slice(2)].join(" × "));
  return mc(
    `Which expression shows ${n} written as a product of prime numbers?`,
    fmtMap(m),
    wrong.filter((w) => w !== fmtMap(m)),
    `Divide by the smallest prime you can, again and again, until only primes remain. Check that your answer multiplies back to ${n} and that every factor is prime.`,
  );
};

const gcfInput: Gen = (l) => {
  const g = pick(l === 1 ? [2, 3, 4, 5, 6] : [4, 6, 8, 9, 12, 14, 15]);
  let a = 0;
  let b = 0;
  do {
    a = g * randInt(2, l === 1 ? 6 : 9);
    b = g * randInt(2, l === 1 ? 6 : 9);
  } while (a === b);
  const ans = gcd(a, b);
  return typed(
    `Find the greatest common factor (GCF) of ${a} and ${b}.`,
    ans,
    `List or factor both numbers: ${a} = ${fmtMap(factorize(a))} and ${b} = ${fmtMap(factorize(b))}. Multiply the primes they share, using the smaller exponent.`,
  );
};

const lcmInput: Gen = (l) => {
  let a = 0;
  let b = 0;
  do {
    a = randInt(l === 1 ? 4 : 6, l === 1 ? 12 : 30);
    b = randInt(l === 1 ? 4 : 6, l === 1 ? 12 : 30);
  } while (a === b);
  const ans = lcm(a, b);
  return typed(
    `Find the lowest common multiple (LCM) of ${a} and ${b}.`,
    ans,
    `Factor both: ${a} = ${fmtMap(factorize(a))} and ${b} = ${fmtMap(factorize(b))}. Use every prime that appears, with its larger exponent, then multiply.`,
  );
};

const lcm3: Gen = () => {
  const sets = [[4, 6, 10], [6, 8, 12], [3, 4, 5], [6, 9, 15], [10, 12, 15], [4, 9, 6], [8, 12, 20], [5, 6, 8]];
  const s = pick(sets);
  const ans = lcm(lcm(s[0], s[1]), s[2]);
  return typed(
    `Find the lowest common multiple of ${s[0]}, ${s[1]} and ${s[2]}.`,
    ans,
    "Find the LCM of the first two numbers, then find the LCM of that result and the third.",
  );
};

const factoredGcfLcm: Gen = (l) => {
  const A: FMap = new Map([[2, randInt(1, 4)], [3, randInt(1, 3)]]);
  const B: FMap = new Map([[2, randInt(1, 4)], [3, randInt(1, 3)]]);
  if (l > 1 || chance(0.5)) A.set(5, randInt(1, 2));
  if (l > 1 || chance(0.5)) B.set(7, randInt(1, 2));
  if (l === 3) B.set(5, randInt(1, 2));
  const primes = [...new Set([...A.keys(), ...B.keys()])];
  const mins: FMap = new Map();
  const maxs: FMap = new Map();
  const sums: FMap = new Map();
  for (const p of primes) {
    const a = A.get(p) ?? 0;
    const b = B.get(p) ?? 0;
    if (a > 0 && b > 0) mins.set(p, Math.min(a, b));
    maxs.set(p, Math.max(a, b));
    sums.set(p, a + b);
  }
  const shareMax: FMap = new Map();
  for (const p of primes) if ((A.get(p) ?? 0) > 0 && (B.get(p) ?? 0) > 0) shareMax.set(p, Math.max(A.get(p)!, B.get(p)!));
  const head = `A = ${fmtMap(A)} and B = ${fmtMap(B)}`;
  if (chance(0.5)) {
    return mc(
      `${head}. What is the GCF of A and B?`,
      fmtMap(mins),
      [fmtMap(maxs), fmtMap(shareMax), fmtMap(sums)],
      "The GCF uses only the primes both numbers share, each with the smaller exponent.",
    );
  }
  return mc(
    `${head}. What is the LCM of A and B?`,
    fmtMap(maxs),
    [fmtMap(mins), fmtMap(shareMax), fmtMap(sums)],
    "The LCM uses every prime that appears in either number, each with the larger exponent.",
  );
};

const rootsByFactoring: Gen = (l) => {
  const cube = chance(0.35);
  const k = cube ? randInt(2, l === 1 ? 5 : 10) : randInt(2, l === 1 ? 12 : l === 2 ? 20 : 30);
  const n = cube ? k ** 3 : k * k;
  return typed(
    `Use prime factorization to find ${cube ? "∛" : "√"}${n}.`,
    k,
    `Factor ${n} = ${fmtMap(factorize(n))}. For a ${cube ? "cube root" : "square root"}, split each prime's exponent into ${cube ? "3" : "2"} equal groups and keep one group.`,
  );
};

const perfectPick: Gen = () => {
  const cube = chance(0.4);
  const k = randInt(3, cube ? 9 : 25);
  const right = cube ? k ** 3 : k * k;
  const wrong = new Set<number>();
  let guard = 0;
  while (wrong.size < 4 && guard++ < 200) {
    const n = right + randInt(-12, 12);
    if (n > 1 && n !== right && !isSq(n) && !isCube(n)) wrong.add(n);
  }
  return mc(
    `Which of these is a perfect ${cube ? "cube" : "square"}?`,
    String(right),
    [...wrong].map(String),
    `In the prime factorization of a perfect ${cube ? "cube" : "square"}, every exponent is a multiple of ${cube ? 3 : 2}. Try factoring each number.`,
  );
};

const factoredValue: Gen = (l) => {
  const p = pick([2, 3]);
  const q = pick([5, 7]);
  const a = randInt(2, l === 1 ? 3 : 4);
  const b = randInt(1, 3);
  const v = p ** a * q ** b;
  return mc(
    `Which number has the prime factorization ${pw(String(p), a)} × ${pw(String(q), b)}?`,
    String(v),
    [String(p * a * q * b), String(p ** a + q ** b), String(p ** (a + b) * q), String(p ** a * q ** b + p)],
    `Evaluate each power first (${pw(String(p), a)} = ${p ** a}), then multiply. The exponent tells you how many copies to multiply, not what to multiply by.`,
  );
};

const gcfWord: Gen = () => {
  const g = pick([4, 5, 6, 8, 12]);
  const a = g * randInt(3, 8);
  let b = g * randInt(3, 8);
  if (b === a) b += g;
  const ctx = pick([
    [`A teacher has ${a} pencils and ${b} erasers. She makes identical supply kits using all of both items, with nothing left over. What is the greatest number of kits she can make?`],
    [`Two ribbons are ${a} cm and ${b} cm long. They are cut into equal pieces with no waste. What is the greatest possible length of a piece, in cm?`],
    [`A club has ${a} juniors and ${b} seniors. They split into teams with the same mix on every team and nobody left out. What is the greatest number of teams?`],
  ])[0];
  return typed(ctx, gcd(a, b), `“Greatest” and “equal groups with nothing left” point to the GCF of ${a} and ${b}.`);
};

const lcmWord: Gen = () => {
  const a = pick([6, 8, 9, 10, 12, 15]);
  let b = pick([4, 5, 6, 8, 12, 14, 18]);
  if (b === a) b += 2;
  const ctx = pick([
    `Bus A leaves the terminal every ${a} minutes and bus B every ${b} minutes. They leave together at 8:00. After how many minutes do they next leave together?`,
    `A lighthouse flashes every ${a} seconds and a buoy light every ${b} seconds. They flash together now. In how many seconds will they flash together again?`,
    `Maya practises every ${a} days and Ravi every ${b} days. They are both at the gym today. In how many days will they both be there again?`,
  ]);
  return typed(ctx, lcm(a, b), `“Next time together” means the lowest common multiple of ${a} and ${b}.`);
};

const countFactors: Gen = (l) => {
  const p = pick([2, 3, 5]);
  const q = pick([7, 11, 3].filter((x) => x !== p));
  const a = randInt(1, 3);
  const b = randInt(1, l === 1 ? 1 : 2);
  const n = p ** a * q ** b;
  let count = 0;
  for (let d = 1; d <= n; d++) if (n % d === 0) count++;
  return typed(
    `How many positive factors does ${n} have?`,
    count,
    `Write ${n} = ${fmtMap(factorize(n))}. Add 1 to each exponent and multiply the results: ${[...factorize(n).values()].map((e) => `(${e}+1)`).join(" × ")}.`,
  );
};

const simplifyFraction: Gen = (l) => {
  const g = pick([4, 6, 8, 9, 12]);
  let p = 0;
  let q = 0;
  do {
    p = randInt(2, l === 1 ? 6 : 10);
    q = randInt(3, l === 1 ? 8 : 13);
  } while (gcd(p, q) !== 1 || p >= q);
  return typed(
    `Simplify ${g * p}/${g * q} by dividing the top and bottom by their GCF.`,
    `${p}/${q}`,
    `The GCF of ${g * p} and ${g * q} is ${g}. Divide both by ${g}.`,
    { keypad: "fraction" },
  );
};

const primePick: Gen = () => {
  const prime = pick(BIG_PRIMES);
  return mc(
    "Which of these numbers is prime?",
    String(prime),
    sample(FAKE_PRIMES, 4).map(String),
    "A prime has exactly two factors, 1 and itself. Test divisibility by 2, 3, 5 and 7: numbers like 51 (3 × 17) and 91 (7 × 13) look prime but are not.",
  );
};

const factorsUnit = (o?: GenerateOptions) =>
  build([primeFactorization, gcfInput, lcmInput, lcm3, factoredGcfLcm, rootsByFactoring, perfectPick, factoredValue, gcfWord, lcmWord, countFactors, simplifyFraction, primePick], levelOf(o));

// ---------- Unit 4: Polynomials ----------

const evalC = (c: number[], x: number) => c.reduce((acc, k) => acc * x + k, 0);
/** Choice question for an expansion, with wrong answers checked to differ from the truth. */
function polyChoice(prompt: string, truth: number[], wrongs: number[][], hint: string): Question {
  const rightStr = polyStr(truth);
  return mc(
    prompt,
    rightStr,
    wrongs.filter((w) => [2, 3, 5, -1].some((x) => evalC(w, x) !== evalC(truth, x))).map((w) => polyStr(w)),
    hint,
  );
}

const expandMonic: Gen = (l) => {
  let a = 0;
  let b = 0;
  do {
    a = l === 1 ? randInt(1, 6) : nonzero(-9, 9);
    b = l === 1 ? randInt(1, 6) : nonzero(-9, 9);
  } while (a + b === 0);
  const f = (v: number) => `(x${addTerm(v)})`;
  return polyChoice(
    `Expand and simplify ${f(a)}${f(b)}.`,
    [1, a + b, a * b],
    [[1, a * b, a + b], [1, a + b, -a * b], [1, 0, a * b], [1, -(a + b), a * b], [1, a + b, a + b]],
    "Multiply every term in the first bracket by every term in the second (FOIL), then combine the like x-terms.",
  );
};

const expandGeneral: Gen = (l) => {
  const p = randInt(1, l === 1 ? 2 : 4);
  const r = randInt(1, l === 1 ? 2 : 4);
  const q = nonzero(l === 1 ? 1 : -6, 6);
  const s = nonzero(l === 1 ? 1 : -6, 6);
  const t = expandLin(p, q, r, s);
  const lin = (a: number, b: number) => `(${linStr(a, b)})`;
  return polyChoice(
    `Expand and simplify ${lin(p, q)}${lin(r, s)}.`,
    t,
    [[t[0], p * s - q * r, t[2]], [t[0], t[1], -t[2]], [t[0], q + s, t[2]], [t[0], t[1], q + s], [t[0], p * s + q * r + 1, t[2]], [p + r, t[1], t[2]]],
    "Use FOIL: First, Outer, Inner, Last. The outer and inner products are both x-terms, so add them.",
  );
};

const perfectSquareExpand: Gen = (l) => {
  const p = l === 1 ? 1 : randInt(1, 3);
  const a = nonzero(l === 1 ? 1 : -7, 7);
  return polyChoice(
    `Expand (${linStr(p, a)})².`,
    [p * p, 2 * p * a, a * a],
    [[p * p, 0, a * a], [p * p, p * a, a * a], [p * p, 2 * p * a, 2 * a], [p * p, 2 * p * a, -a * a], [p * p, -2 * p * a, a * a]],
    "Squaring a binomial means multiplying it by itself: (A + B)² = A² + 2AB + B². Don't forget the middle term.",
  );
};

const differenceOfSquaresExpand: Gen = (l) => {
  const p = randInt(1, l === 1 ? 1 : 4);
  const q = randInt(1, 9);
  return polyChoice(
    `Expand (${linStr(p, q)})(${linStr(p, -q)}).`,
    [p * p, 0, -q * q],
    [[p * p, 0, q * q], [p, 0, -q * q], [p * p, -2 * p * q, -q * q], [p * p, 2 * p * q, q * q], [p * p, 0, -q]],
    "The middle terms cancel: (A + B)(A − B) = A² − B².",
  );
};

const coefficientQuestion: Gen = (l) => {
  const p = randInt(1, l === 1 ? 2 : 3);
  const r = randInt(1, l === 1 ? 2 : 3);
  const q = nonzero(-6, 6);
  const s = nonzero(-6, 6);
  const t = expandLin(p, q, r, s);
  const which = randInt(0, 2);
  const names = ["x²", "x", "constant"];
  return typedInt(
    `When (${linStr(p, q)})(${linStr(r, s)}) is expanded and simplified, what is the ${which === 2 ? "constant term" : `coefficient of ${names[which]}`}?`,
    t[which],
    which === 1 ? "Add the outer and inner products." : which === 0 ? "Multiply the two x-coefficients." : "Multiply the two constants.",
  );
};

const addPolys: Gen = (l) => {
  const a = (): number[] => [nonzero(-5, 6), randInt(-6, 6), randInt(-8, 8)];
  const P = a();
  const Q = a();
  const sub = l > 1 && chance(0.5);
  const f = (c: number[]) => `(${polyStr(c)})`;
  const truth = P.map((k, i) => (sub ? k - Q[i] : k + Q[i]));
  const wrongs: number[][] = sub
    ? [[P[0] - Q[0], P[1] + Q[1], P[2] + Q[2]], [P[0] - Q[0], P[1] - Q[1], P[2] + Q[2]], P.map((k, i) => k + Q[i]), [P[0] + Q[0], P[1] - Q[1], P[2] - Q[2]]]
    : [[truth[0], truth[1], P[2] - Q[2]], [truth[0], P[1] - Q[1], truth[2]], [P[0] - Q[0], truth[1], truth[2]], [truth[0] + 1, truth[1], truth[2]]];
  return polyChoice(
    `Simplify ${f(P)} ${sub ? M : "+"} ${f(Q)}.`,
    truth,
    wrongs,
    sub ? "Subtracting a polynomial changes the sign of EVERY term inside the second bracket. Then combine like terms." : "Combine like terms: add the x² terms, the x terms and the constants separately.",
  );
};

const degreeQuestion: Gen = () => {
  const deg = randInt(2, 6);
  const exps = [deg, ...sample(Array.from({ length: deg - 1 }, (_, i) => i), randInt(1, Math.min(2, deg - 1)))];
  exps.sort((a, b) => b - a);
  const coefs = Array<number>(deg + 1).fill(0);
  exps.forEach((e) => (coefs[deg - e] = nonzero(-8, 9)));
  const terms = coefs.filter((k) => k !== 0).length;
  const wrong = [deg + 1, deg + 2, deg - 1, terms, Math.abs(coefs[0])].map(String);
  return mc(`What is the degree of the polynomial ${polyStr(coefs)}?`, String(deg), wrong, "The degree is the highest exponent of the variable. It is not the number of terms or a coefficient.");
};

const classifyTerms: Gen = () => {
  const n = randInt(1, 3);
  const exps = [3, 2, 1, 0];
  const chosen = sample(exps, n).sort((a, b) => b - a);
  const coefs = [0, 0, 0, 0];
  chosen.forEach((e) => (coefs[3 - e] = nonzero(-7, 9)));
  const name = ["Monomial", "Binomial", "Trinomial"][n - 1];
  return mc(
    `How many terms does ${polyStr(coefs)} have? Choose its name.`,
    name,
    ["Monomial", "Binomial", "Trinomial"].filter((x) => x !== name).concat(["Not a polynomial"]),
    "Count the terms separated by + or −. One term is a monomial, two a binomial, three a trinomial.",
  );
};

const whichPolynomial: Gen = () => {
  const polys = ["3x² − 5x + 2", "x³ + 7", "4x − 9", "2x⁴ − x", "6x² + x + 1", "5x²y − 3"];
  const non = ["x⁻² + 3", "5/x + 1", "√x + 4", "x^(1/2) − 2", "2ˣ + 1", "3/x² − x"];
  return mc(
    "Which expression is a polynomial?",
    pick(polys),
    sample(non, 4),
    "In a polynomial, every variable has a whole-number exponent (0, 1, 2, …) and no variable appears in a denominator, under a root or as an exponent.",
  );
};

const factorCommon: Gen = (l) => {
  const g = randInt(2, l === 1 ? 5 : 9);
  let p = randInt(1, 6);
  let q = nonzero(l === 1 ? 1 : -7, 7);
  while (gcd(p, q) !== 1) {
    p = randInt(1, 6);
    q = nonzero(l === 1 ? 1 : -7, 7);
  }
  const withX = l > 1 && chance(0.6);
  if (withX) {
    const a = g * p;
    const b = g * q;
    const truth = (x: number) => a * x * x + b * x;
    const right = `${g}x(${linStr(p, q)})`;
    const partial = [`${g}(${polyStr([p, q, 0])})`, `x(${linStr(a, b)})`];
    return mc(
      `Factor completely: ${polyStr([a, b, 0])}.`,
      right,
      [
        ...partial,
        ...differing(truth, [
          { t: `${g}x(${linStr(p, q * g)})`, f: (x) => g * x * (p * x + q * g) },
          { t: `${g}x(${linStr(p, -q)})`, f: (x) => g * x * (p * x - q) },
          { t: `${g}(${linStr(p, q)})`, f: (x) => g * (p * x + q) },
        ]),
      ],
      "Take out the greatest common factor of the numbers AND the variable: find the largest number dividing both coefficients, and the lowest power of x.",
    );
  }
  const a = g * p;
  const b = g * q;
  const truth = (x: number) => a * x + b;
  const partialG = [2, 3, 5, 7].find((d) => g % d === 0 && d < g);
  const cands = [
    { t: `${p}(${linStr(g, q)})`, f: (x: number) => p * (g * x + q) },
    { t: `${g}(${linStr(p, -q)})`, f: (x: number) => g * (p * x - q) },
    { t: `${g}(${linStr(p, q + 1)})`, f: (x: number) => g * (p * x + q + 1) },
    { t: `${g}x(${linStr(p, q)})`, f: (x: number) => g * x * (p * x + q) },
  ];
  const partial = partialG ? [`${partialG}(${linStr(a / partialG, b / partialG)})`] : [];
  return mc(`Factor completely: ${linStr(a, b)}.`, `${g}(${linStr(p, q)})`, [...partial, ...differing(truth, cands)], "Find the greatest common factor of the coefficients, divide it out of each term, and check by expanding.");
};

const factorTrinomial: Gen = (l) => {
  let m = 0;
  let n = 0;
  do {
    m = l === 1 ? randInt(1, 8) : nonzero(-9, 9);
    n = l === 1 ? randInt(1, 8) : nonzero(-9, 9);
  } while (m === -n);
  const b = m + n;
  const c = m * n;
  const truth = (x: number) => x * x + b * x + c;
  const mk = (p: number, q: number) => ({ t: prodStr([1, p], [1, q]), f: (x: number) => (x + p) * (x + q) });
  const cands = [mk(-m, -n), mk(m, -n), mk(-m, n), mk(m + 1, n - 1), mk(m - 1, n + 1), mk(m + 2, n - 2)];
  return mc(
    `Factor ${polyStr([1, b, c])}.`,
    prodStr([1, m], [1, n]),
    differing(truth, cands),
    `Look for two integers that multiply to ${num(c)} and add to ${num(b)}. Check your pair by expanding.`,
  );
};

const factorDiffSquares: Gen = (l) => {
  const p = randInt(1, l === 1 ? 1 : 5);
  const q = randInt(2, 12);
  const truth = (x: number) => p * p * x * x - q * q;
  const cands = [
    { t: `(${linStr(p, -q)})²`, f: (x: number) => (p * x - q) ** 2 },
    { t: `(${linStr(p, q)})²`, f: (x: number) => (p * x + q) ** 2 },
    { t: prodStr([p * p, -q * q], [1, 1]), f: (x: number) => (p * p * x - q * q) * (x + 1) },
    { t: prodStr([p, q * q], [p, -q * q]), f: (x: number) => (p * x + q * q) * (p * x - q * q) },
    { t: prodStr([p, q], [p, q + 1]), f: (x: number) => (p * x + q) * (p * x + q + 1) },
  ];
  return mc(
    `Factor ${polyStr([p * p, 0, -q * q])}.`,
    prodStr([p, -q], [p, q]),
    differing(truth, cands),
    `It is a difference of squares: ${p * p}x² = (${p === 1 ? "" : p}x)² and ${q * q} = ${q}². Use A² − B² = (A − B)(A + B).`,
  );
};

const factorGeneral: Gen = () => {
  let p = 0;
  let r = 0;
  let q = 0;
  let s = 0;
  do {
    p = randInt(1, 3);
    r = randInt(1, 3);
    q = nonzero(-6, 6);
    s = nonzero(-6, 6);
  } while (p * r === 1 || gcd(gcd(p * r, p * s + q * r), q * s) !== 1 || p * s + q * r === 0);
  const t = expandLin(p, q, r, s);
  const truth = (x: number) => t[0] * x * x + t[1] * x + t[2];
  const mk = (a: number, b: number, c: number, d: number) => ({ t: prodStr([a, b], [c, d]), f: (x: number) => (a * x + b) * (c * x + d) });
  const cands = [mk(p, s, r, q), mk(p, -q, r, -s), mk(p, q, r, -s), mk(p, -q, r, s), mk(p + 1, q, r, s), mk(p, q + 1, r, s - 1)];
  return mc(
    `Factor ${polyStr(t)}.`,
    prodStr([p, q], [r, s]),
    differing(truth, cands),
    `Multiply the leading coefficient by the constant: ${t[0]} × ${num(t[2])} = ${num(t[0] * t[2])}. Find two numbers with that product that add to ${num(t[1])}, split the middle term and factor by grouping. Or test each choice by expanding.`,
  );
};

const rectangleWidth: Gen = () => {
  const m = randInt(1, 8);
  const n = randInt(1, 8);
  return mc(
    `A rectangle has area ${polyStr([1, m + n, m * n])} and length x + ${m}. What is its width?`,
    `x + ${n}`,
    [`x + ${m + n}`, `x + ${m * n}`, `x ${M} ${n}`, `x + ${n + 1}`].filter((s) => s !== `x + ${m}` || m === n),
    `Area = length × width, so factor the area: find two numbers that multiply to ${m * n} and add to ${m + n}. One factor is x + ${m}; the other is the width.`,
  );
};

const polynomialsUnit = (o?: GenerateOptions) =>
  build(
    [expandMonic, expandGeneral, perfectSquareExpand, differenceOfSquaresExpand, coefficientQuestion, addPolys, degreeQuestion, classifyTerms, whichPolynomial, factorCommon, factorTrinomial, factorTrinomial, factorDiffSquares, factorGeneral, rectangleWidth],
    levelOf(o),
  );

// ---------- Unit 5: Relations and functions ----------

const setStr = (xs: number[]) => `{${xs.map(num).join(", ")}}`;
const uniqSorted = (xs: number[]) => [...new Set(xs)].sort((a, b) => a - b);

function randomRelation(isFunc: boolean, size: number): [number, number][] {
  const xs = sample([-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6], size);
  const pairs: [number, number][] = xs.map((x) => [x, randInt(-5, 8)]);
  if (!isFunc) {
    const i = randInt(0, size - 1);
    let y = randInt(-5, 8);
    while (y === pairs[i][1]) y = randInt(-5, 8);
    pairs.push([pairs[i][0], y]);
  }
  return shuffle(pairs);
}
const pairsStr = (ps: [number, number][]) => `{${ps.map(([x, y]) => pair(x, y)).join(", ")}}`;

const isFunctionPairs: Gen = (l) => {
  const yes = chance(0.5);
  const ps = randomRelation(yes, l === 1 ? 4 : 5);
  return mc(
    `Is the relation ${pairsStr(ps)} a function?`,
    yes ? "Yes, each x-value has exactly one y-value" : "No, one x-value is paired with two y-values",
    [yes ? "No, one x-value is paired with two y-values" : "Yes, each x-value has exactly one y-value"],
    "A relation is a function when every input (x) has exactly one output (y). Look for an x-value that appears twice with different y-values. Repeated y-values are fine.",
  );
};

const isFunctionTable: Gen = (l) => {
  const yes = chance(0.5);
  const ps = randomRelation(yes, l === 1 ? 4 : 5).sort((a, b) => a[0] - b[0]);
  return mc(
    "Does this table show y as a function of x?",
    yes ? "Yes" : "No",
    [yes ? "No" : "Yes"],
    "Check the x column: if any x-value appears twice with different y-values, it is not a function.",
    { type: "table", headers: ["x", "y"], rows: ps.map(([x, y]) => [num(x), num(y)]) },
  );
};

const domainRange: Gen = (l) => {
  const ps = randomRelation(true, l === 1 ? 4 : 5);
  // Make sure some y repeats on harder levels so the range set is smaller than the domain.
  if (l > 1) ps[1][1] = ps[0][1];
  const dom = uniqSorted(ps.map((p) => p[0]));
  const ran = uniqSorted(ps.map((p) => p[1]));
  const wantDomain = chance(0.5);
  const right = wantDomain ? dom : ran;
  const other = wantDomain ? ran : dom;
  const extra = right[right.length - 1] + 1;
  return mc(
    `What is the ${wantDomain ? "domain" : "range"} of the relation ${pairsStr(ps)}?`,
    setStr(right),
    [setStr(other), right.length > 1 ? setStr(right.slice(1)) : setStr([...right, extra]), setStr([...right, extra]), `{${ps.map(([x, y]) => `${num(x)}, ${num(y)}`).join(", ")}}`],
    "The domain is the set of all x-values (inputs); the range is the set of all y-values (outputs). List each value once.",
  );
};

const evalLinear: Gen = (l) => {
  const m = nonzero(l === 1 ? 1 : -6, 7);
  const b = randInt(-9, 9);
  const a = randInt(l === 1 ? 0 : -6, 8);
  return typedInt(
    `If f(x) = ${linStr(m, b)}, what is f(${num(a)})?`,
    m * a + b,
    `Replace x with ${num(a)}: f(${num(a)}) = ${m}(${num(a)})${addTerm(b)}.`,
  );
};

const evalQuadratic: Gen = (l) => {
  const A = nonzero(l === 2 ? 1 : -3, 3);
  const B = randInt(-5, 5);
  const C = randInt(-8, 8);
  const a = nonzero(-4, 4);
  return typedInt(
    `If g(x) = ${polyStr([A, B, C])}, what is g(${num(a)})?`,
    A * a * a + B * a + C,
    `Substitute x = ${num(a)}. Square it first (a negative number squared is positive), multiply by ${A}, then add the other terms.`,
  );
};

const solveForInput: Gen = (l) => {
  const m = nonzero(l === 1 ? 1 : -5, 6);
  const b = randInt(-8, 8);
  const x = randInt(-6, 8);
  return typedInt(
    `For f(x) = ${linStr(m, b)}, find x when f(x) = ${num(m * x + b)}.`,
    x,
    `Set ${linStr(m, b)} = ${num(m * x + b)} and solve for x: undo the ${b < 0 ? "subtraction" : "addition"}, then divide by ${m}.`,
  );
};

const meaningOfNotation: Gen = () => {
  const a = randInt(2, 9);
  const b = randInt(-4, 20);
  return mc(
    `A function f has f(${a}) = ${num(b)}. What does this tell you?`,
    `When the input is ${a}, the output is ${num(b)}.`,
    [`When the input is ${num(b)}, the output is ${a}.`, `f multiplied by ${a} equals ${num(b)}.`, `The function has ${a} terms and a value of ${num(b)}.`],
    "f(a) = b means “the output at input a is b”. It is the point (a, b) on the graph, not multiplication.",
  );
};

function parabola(h: number, k: number, s: number) {
  return (x: number) => s * (x - h) ** 2 + k;
}

const verticalLineTest: Gen = (l) => {
  const kinds = ["line", "parabola", "sideways", "circle", "abs"];
  const kind = pick(l === 1 ? ["line", "parabola", "sideways", "circle"] : kinds);
  let curve: { points: Pt[]; label?: string };
  let isFn = true;
  if (kind === "line") {
    curve = lineCurve(nonzero(-2, 2), randInt(-3, 3), 6);
  } else if (kind === "parabola") {
    curve = funcCurve(parabola(randInt(-2, 2), randInt(-3, 3), pick([1, -1])), -6, 6, -6, 6);
  } else if (kind === "abs") {
    const h = randInt(-2, 2);
    const k = randInt(-3, 3);
    curve = funcCurve((x) => Math.abs(x - h) + k, -6, 6, -6, 6);
  } else if (kind === "sideways") {
    isFn = false;
    const h = randInt(-2, 2);
    const s = pick([1, -1]);
    curve = funcCurve((y) => y, -4, 4, -6, 6);
    curve = { points: curve.points.map((p) => ({ x: s * p.y * p.y * 0.5 + h, y: p.x })).filter((p) => Math.abs(p.x) <= 6) };
  } else {
    isFn = false;
    const r = randInt(3, 5);
    const pts: Pt[] = [];
    for (let i = 0; i <= 72; i++) pts.push({ x: r * Math.cos((i * Math.PI) / 36), y: r * Math.sin((i * Math.PI) / 36) });
    curve = { points: pts };
  }
  return mc(
    "Does this graph represent a function?",
    isFn ? "Yes: no vertical line crosses it more than once" : "No: a vertical line can cross it twice",
    [isFn ? "No: a vertical line can cross it twice" : "Yes: no vertical line crosses it more than once", isFn ? "No: it is not a straight line" : "Yes: it is a smooth curve"],
    "Use the vertical line test: sweep an imaginary vertical line across the graph. If it ever touches the graph in two places, one x-value has two y-values, so it is not a function.",
    win(6, [curve as ReturnType<typeof lineCurve>]),
  );
};

const parabolaRange: Gen = () => {
  const h = randInt(-2, 2);
  const k = randInt(-4, 4);
  const s = pick([1, -1]);
  const curve = funcCurve(parabola(h, k, s), -6, 6, -7, 7);
  return mc(
    "What is the range of this function?",
    s === 1 ? `y ≥ ${num(k)}` : `y ≤ ${num(k)}`,
    [s === 1 ? `y ≤ ${num(k)}` : `y ≥ ${num(k)}`, s === 1 ? `y ≥ ${num(h)}` : `y ≤ ${num(h)}`, "all real numbers", `x ≥ ${num(k)}`],
    "The range is the set of y-values the graph reaches. Find the vertex: does the graph open up (the vertex is the lowest point) or down (the highest point)?",
    { type: "plot", xMin: -6, xMax: 6, yMin: -7, yMax: 7, step: 1, curves: [curve] },
  );
};

const segmentDomain: Gen = () => {
  let x1 = 0;
  let x2 = 0;
  let y1 = 0;
  let y2 = 0;
  do {
    x1 = randInt(-5, 2);
    x2 = x1 + randInt(2, 6);
    y1 = randInt(-5, 5);
    y2 = randInt(-5, 5);
  } while (y1 === y2 || x2 > 6);
  const wantDomain = chance(0.5);
  const [lo, hi] = wantDomain ? [x1, x2] : [Math.min(y1, y2), Math.max(y1, y2)];
  const v = wantDomain ? "x" : "y";
  const [olo, ohi] = wantDomain ? [Math.min(y1, y2), Math.max(y1, y2)] : [x1, x2];
  const ov = wantDomain ? "y" : "x";
  const form = (a: number, b: number, w: string) => `${num(a)} ≤ ${w} ≤ ${num(b)}`;
  return mc(
    `The graph is a line segment with endpoints marked. What is its ${wantDomain ? "domain" : "range"}?`,
    form(lo, hi, v),
    [form(olo, ohi, ov), form(lo, hi + 1, v), form(lo - 1, hi, v), `${v} ≥ ${num(lo)}`],
    `The ${wantDomain ? "domain is the span of x-values, left endpoint to right endpoint" : "range is the span of y-values, lowest endpoint to highest"}. The dots show the segment includes its endpoints.`,
    {
      type: "plot",
      xMin: -6,
      xMax: 6,
      yMin: -6,
      yMax: 6,
      step: 1,
      curves: [{ points: [{ x: x1, y: y1 }, { x: x2, y: y2 }] }],
      points: [{ x: x1, y: y1 }, { x: x2, y: y2 }],
    },
  );
};

const contextDomain: Gen = () => {
  const r = pick([3, 4, 5, 6, 8]);
  const fee = pick([10, 15, 20, 25]);
  const T = randInt(5, 12);
  const V0 = r * T * pick([1, 2]);
  const tt = V0 / r;
  const bank: Question[] = [
    mc(
      `A gym charges $${fee} to join plus $${r} per class: C = ${r}n + ${fee}, where n is the number of classes. Which domain makes sense?`,
      "n = 0, 1, 2, 3, … (whole numbers)",
      ["all real numbers", "n < 0", "all integers, including negatives", "n > 100 only"],
      "Ask what values of n are possible: you can attend 0 or more whole classes, not −2 classes or 2.5 classes.",
    ),
    mc(
      `A tank holds ${V0} L and drains at ${r} L per minute: V = ${V0} ${M} ${r}t. What domain makes sense for t (minutes)?`,
      `0 ≤ t ≤ ${tt}`,
      [`t ≥ 0`, `0 ≤ t ≤ ${V0}`, "all real numbers", `t ≤ ${tt}`],
      `The tank starts draining at t = 0 and is empty when ${V0} ${M} ${r}t = 0, which is t = ${tt}. After that the formula no longer describes the tank.`,
    ),
    mc(
      `Using the same tank (V = ${V0} ${M} ${r}t), what is the range of V?`,
      `0 ≤ V ≤ ${V0}`,
      [`0 ≤ V ≤ ${tt}`, "V ≥ 0", "all real numbers", `${V0} ≤ V ≤ ${V0 * 2}`],
      "The volume starts at the full amount and falls to 0. Those are the lowest and highest outputs.",
    ),
  ];
  return pick(bank);
};

const independentVariable: Gen = () => {
  const bank = [
    { ctx: "The distance a cyclist has travelled depends on the time spent riding.", right: "time", wrong: ["distance", "speed of the wind", "the cyclist's name"] },
    { ctx: "The cost of a taxi ride depends on how many kilometres are driven.", right: "kilometres driven", wrong: ["cost", "the colour of the taxi", "the driver"] },
    { ctx: "A plant's height depends on the number of weeks since planting.", right: "number of weeks", wrong: ["height", "the plant's species", "the pot size"] },
    { ctx: "Your phone's battery level depends on how long you have been streaming video.", right: "streaming time", wrong: ["battery level", "phone brand", "screen size"] },
  ];
  const it = pick(bank);
  return mc(`${it.ctx} Which is the independent variable?`, it.right, it.wrong, "The independent variable is the input you choose or that changes on its own. The dependent variable's value depends on it.");
};

const tableToRule: Gen = (l) => {
  const m = nonzero(l === 1 ? 1 : -4, 5);
  const b = randInt(-6, 8);
  const xs = [0, 1, 2, 3];
  const rule = (mm: number, bb: number) => `y = ${linStr(mm, bb)}`;
  const cands = [rule(m, -b), rule(-m, b), rule(b, m), rule(m + 1, b), rule(m, b + 1), rule(m - 1, b)];
  const right = rule(m, b);
  return mc(
    "Which rule matches the table?",
    right,
    cands.filter((c) => c !== right),
    "Look at how y changes each time x goes up by 1: that is the coefficient of x. The y-value when x = 0 is the constant.",
    { type: "table", headers: ["x", "y"], rows: xs.map((x) => [x, num(m * x + b)]) },
  );
};

const readFromGraph: Gen = (l) => {
  const useParabola = l > 1 && chance(0.6);
  const x0 = randInt(-3, 3);
  if (useParabola) {
    const h = randInt(-1, 1);
    const k = randInt(-3, 2);
    const s = pick([1, -1]);
    const f = parabola(h, k, s);
    const y0 = f(x0);
    if (Math.abs(y0) > 7) return readFromGraph(1);
    return typedInt(
      `Use the graph to find f(${num(x0)}).`,
      y0,
      `Find x = ${num(x0)} on the horizontal axis, go straight up or down to the curve, then read the y-value.`,
      { visual: { type: "plot", xMin: -6, xMax: 6, yMin: -8, yMax: 8, step: 1, curves: [funcCurve(f, -6, 6, -8, 8)], points: [{ x: x0, y: y0 }] } },
    );
  }
  const m = nonzero(-2, 2);
  const b = randInt(-3, 3);
  const y0 = m * x0 + b;
  return typedInt(
    `Use the graph to find f(${num(x0)}).`,
    y0,
    `Find x = ${num(x0)} on the horizontal axis, go straight up or down to the line, then read the y-value.`,
    { visual: win(10, [lineCurve(m, b, 10)], [{ x: x0, y: y0 }]) },
  );
};

const functionsUnit = (o?: GenerateOptions) =>
  build(
    [isFunctionPairs, isFunctionTable, domainRange, evalLinear, evalQuadratic, solveForInput, meaningOfNotation, verticalLineTest, parabolaRange, segmentDomain, contextDomain, independentVariable, tableToRule, readFromGraph],
    levelOf(o),
  );

// ---------- Unit 6: Linear relations ----------

function terms(parts: [number, string][]): string {
  let s = "";
  for (const [k, v] of parts) {
    if (k === 0) continue;
    const a = Math.abs(k);
    const body = v === "" ? String(a) : `${a === 1 ? "" : a}${v}`;
    s += s === "" ? (k < 0 ? M : "") + body : ` ${k < 0 ? M : "+"} ${body}`;
  }
  return s === "" ? "0" : s;
}
const genStr = (A: number, B: number, C: number) => `${terms([[A, "x"], [B, "y"], [C, ""]])} = 0`;
const stdStr = (A: number, B: number, C: number) => `${terms([[A, "x"], [B, "y"]])} = ${num(C)}`;
function normLine(A: number, B: number, C: number): string {
  const g = gcd(gcd(Math.abs(A), Math.abs(B)), Math.abs(C)) || 1;
  let [a, b, c] = [A / g, B / g, C / g];
  if (a < 0 || (a === 0 && b < 0)) [a, b, c] = [-a, -b, -c];
  return `${a},${b},${c}`;
}
const subStr = (v: number) => (v >= 0 ? `${M} ${v}` : `+ ${-v}`);
function slopeFactor(m: Fr): string {
  if (m.d === 1) return m.n === 1 ? "" : m.n === -1 ? M : num(m.n);
  return `${m.n < 0 ? M : ""}(${Math.abs(m.n)}/${m.d})`;
}
const pointSlopeStr = (m: Fr, x1: number, y1: number) => `y ${subStr(y1)} = ${slopeFactor(m)}(x ${subStr(x1)})`;

const INT_SLOPES = [fr(1), fr(2), fr(3), fr(4), fr(-1), fr(-2), fr(-3), fr(-4)];
const FRAC_SLOPES = [fr(1, 2), fr(-1, 2), fr(3, 2), fr(-3, 2), fr(2, 3), fr(-2, 3), fr(1, 3), fr(-1, 3), fr(3, 4), fr(-3, 4), fr(4, 3), fr(-4, 3)];
const slopesFor = (l: Level) => (l === 1 ? INT_SLOPES.slice(0, 3).concat(INT_SLOPES.slice(4, 6)) : l === 2 ? [...INT_SLOPES, ...FRAC_SLOPES.slice(0, 4)] : [...INT_SLOPES, ...FRAC_SLOPES]);

const slopeTwoPoints: Gen = (l) => {
  const m = pick(l === 1 ? [1, 2, 3, 4] : [-4, -3, -2, -1, 1, 2, 3, 4, 5]);
  const dx = randInt(1, 4);
  const x1 = randInt(-5, 3);
  const y1 = randInt(-6, 6);
  const [p, q] = [pair(x1, y1), pair(x1 + dx, y1 + m * dx)];
  const first = chance(0.5);
  return typedInt(
    `Find the slope of the line through ${first ? p : q} and ${first ? q : p}.`,
    m,
    "Slope = rise ÷ run = (y₂ − y₁) ÷ (x₂ − x₁). Subtract the coordinates in the same order for both.",
  );
};

const slopeFractionChoice: Gen = () => {
  let dx = 0;
  let dy = 0;
  do {
    dx = randInt(2, 7);
    dy = nonzero(-8, 8);
  } while (gcd(dx, dy) !== 1);
  const x1 = randInt(-5, 0);
  const y1 = randInt(-5, 5);
  const right = fr(dy, dx);
  return mc(
    `What is the slope of the line through ${pair(x1, y1)} and ${pair(x1 + dx, y1 + dy)}?`,
    frStr(right),
    [frStr(fr(dx, dy)), frStr(frNeg(right)), frStr(frRecip(frNeg(right))), `${num(dy)}`],
    `Rise = ${num(y1 + dy)} ${M} ${num(y1)} = ${num(dy)}; run = ${num(x1 + dx)} ${M} ${num(x1)} = ${dx}. Slope = rise/run, and it should be reduced if possible.`,
  );
};

const slopeFromGraph: Gen = (l) => {
  const q = l === 1 ? 1 : randInt(1, 3);
  let p = nonzero(-4, 4);
  while (gcd(p, q) !== 1) p = nonzero(-4, 4);
  const x1 = randInt(-5, 2);
  const y1 = randInt(-4, 3);
  const m = p / q;
  const b = y1 - m * x1;
  const vis = win(8, [lineCurve(m, b, 8)], [{ x: x1, y: y1, label: "A" }, { x: x1 + q, y: y1 + p, label: "B" }]);
  if (q === 1) return typedInt("Use the marked points A and B to find the slope of the line.", p, "From A to B, count the rise (up is positive, down is negative) and the run to the right.", { visual: vis });
  return mc(
    "Use the marked points A and B to find the slope of the line.",
    frStr(fr(p, q)),
    [frStr(fr(q, p)), frStr(fr(-p, q)), frStr(fr(-q, p))],
    "Count the rise (up positive, down negative) from A to B, then the run to the right. Slope = rise/run.",
    vis,
  );
};

const slopeAndIntercept: Gen = (l) => {
  const m = pick(slopesFor(l));
  const b = nonzero(-9, 9);
  const form = (s: Fr, i: number) => `slope ${frStr(s)}, y-intercept ${num(i)}`;
  return mc(
    `Identify the slope and y-intercept of ${eqStr(m, b)}.`,
    form(m, b),
    [form(frNeg(m), b), form(m, -b), `slope ${num(b)}, y-intercept ${frStr(m)}`, form(frRecip(m), b)],
    "In y = mx + b, m is the slope (the number multiplying x, with its sign) and b is the y-intercept (where the line crosses the y-axis).",
  );
};

const equationFromGraph: Gen = (l) => {
  const m = pick(slopesFor(l).filter((s) => s.d <= 2));
  const b = randInt(-4, 4);
  const right = eqStr(m, b);
  return mc(
    "Which equation matches the graph?",
    right,
    [eqStr(frNeg(m), b), eqStr(m, -b), eqStr(frRecip(m), b), eqStr(m, b + 1)],
    "Read the y-intercept first (where the line crosses the y-axis). Then count rise over run between two points for the slope, paying attention to whether the line goes up or down.",
    win(8, [lineCurve(m.n / m.d, b, 8)], [{ x: 0, y: b }]),
  );
};

const equationFromPoint: Gen = (l) => {
  const m = pick(slopesFor(l).filter((s) => s.d <= 2));
  const k = nonzero(-3, 3);
  const x1 = k * m.d;
  const y1 = randInt(-6, 6);
  const mx = m.n * k;
  const b = y1 - mx;
  const right = eqStr(m, b);
  return mc(
    `A line has slope ${frStr(m)} and passes through ${pair(x1, y1)}. Which is its equation in slope–intercept form?`,
    right,
    [eqStr(m, y1 + mx), eqStr(m, y1), eqStr(m, -b), eqStr(m, y1 - m.n)],
    `Substitute the point into y = mx + b: ${num(y1)} = ${frStr(m)}(${num(x1)}) + b. Solve for b.`,
  );
};

const equationTwoPoints: Gen = (l) => {
  const m = pick((l === 1 ? INT_SLOPES.slice(0, 3) : INT_SLOPES).map((s) => s.n));
  const dx = randInt(1, 3);
  const x1 = randInt(-4, 2);
  const y1 = randInt(-6, 6);
  const b = y1 - m * x1;
  return mc(
    `Find the equation of the line through ${pair(x1, y1)} and ${pair(x1 + dx, y1 + m * dx)}.`,
    eqStr(fr(m), b),
    [eqStr(fr(m), -b), eqStr(fr(-m), b), eqStr(fr(m), y1), eqStr(fr(m), b + m)],
    "First find the slope from the two points. Then substitute one point into y = mx + b to find b.",
  );
};

const pointSlopeForm: Gen = (l) => {
  const m = pick(slopesFor(l));
  const x1 = nonzero(-7, 7);
  const y1 = nonzero(-7, 7);
  return mc(
    `Which equation, in point–slope form, has slope ${frStr(m)} and passes through ${pair(x1, y1)}?`,
    pointSlopeStr(m, x1, y1),
    [pointSlopeStr(m, -x1, y1), pointSlopeStr(m, x1, -y1), pointSlopeStr(m, -x1, -y1), pointSlopeStr(frNeg(m), x1, y1), pointSlopeStr(m, y1, x1)],
    "Point–slope form is y − y₁ = m(x − x₁). Subtracting a negative number turns into adding.",
  );
};

const readPointSlope: Gen = (l) => {
  const m = pick(slopesFor(l).filter((s) => s.d === 1));
  const x1 = nonzero(-7, 7);
  const y1 = nonzero(-7, 7);
  return mc(
    `The line ${pointSlopeStr(m, x1, y1)} passes through which point?`,
    pair(x1, y1),
    [pair(-x1, y1), pair(x1, -y1), pair(-x1, -y1), pair(y1, x1)],
    "In y − y₁ = m(x − x₁) the point is (x₁, y₁). Watch the signs: x + 4 means x − (−4), so x₁ = −4.",
  );
};

const toGeneralForm: Gen = (l) => {
  const m = pick(slopesFor(l).filter((s) => s.d <= 3));
  const b = nonzero(-7, 7);
  // y = (n/d)x + b  →  n x − d y + d b = 0
  let A = m.n;
  let B = -m.d;
  let C = m.d * b;
  if (A < 0) [A, B, C] = [-A, -B, -C];
  const truth = normLine(A, B, C);
  const cands: [number, number, number][] = [[A, B, -C], [A, -B, C], [A, -B, -C], [B, A, C], [A, B, C + 1]];
  return mc(
    `Rewrite ${eqStr(m, b)} in general form Ax + By + C = 0, with A positive.`,
    genStr(A, B, C),
    cands.filter((c) => normLine(...c) !== truth).map((c) => genStr(...c)),
    "Clear any fraction by multiplying every term by the denominator. Then move all terms to one side so the other side is 0, and make the x-coefficient positive.",
  );
};

const slopeFromGeneral: Gen = (l) => {
  const A = nonzero(l === 1 ? 1 : -6, 6);
  const B = nonzero(l === 1 ? 1 : -6, 6);
  const C = nonzero(-9, 9);
  const right = fr(-A, B);
  return mc(
    `What is the slope of the line ${genStr(A, B, C)}?`,
    frStr(right),
    [frStr(fr(A, B)), frStr(fr(B, A)), frStr(fr(-B, A)), frStr(fr(-C, B))],
    "Solve for y: By = −Ax − C, so y = (−A/B)x − C/B. The slope is −A/B. (It is not A/B.)",
  );
};

const interceptsStd: Gen = () => {
  let px = nonzero(-8, 8);
  let py = nonzero(-8, 8);
  while (Math.abs(px) === Math.abs(py) && chance(0.7)) py = nonzero(-8, 8);
  if (px === 0) px = 1;
  let A = py;
  let B = px;
  let C = px * py;
  const g = gcd(Math.abs(A), Math.abs(B));
  [A, B, C] = [A / g, B / g, C / g];
  if (A < 0) [A, B, C] = [-A, -B, -C];
  const wantX = chance(0.5);
  return typedInt(
    `What is the ${wantX ? "x" : "y"}-intercept of ${stdStr(A, B, C)}?`,
    wantX ? C / A : C / B,
    `To find the ${wantX ? "x" : "y"}-intercept, set ${wantX ? "y" : "x"} = 0 and solve for ${wantX ? "x" : "y"}.`,
  );
};

const parallelChoice: Gen = (l) => {
  const m = pick(slopesFor(l));
  const b = randInt(-6, 6);
  let b2 = randInt(-6, 6);
  if (b2 === b) b2 = b + 1;
  const wrongSlopes = [frNeg(m), frRecip(m), frNeg(frRecip(m))].filter((s) => !frEq(s, m));
  return mc(
    `Which line is parallel to ${eqStr(m, b)}?`,
    eqStr(m, b2),
    wrongSlopes.map((s) => eqStr(s, b2)).concat([eqStr(fr(m.n + m.d, m.d), b)]),
    "Parallel lines have the same slope but different y-intercepts. Compare slopes only.",
  );
};

const perpendicularChoice: Gen = (l) => {
  const m = pick(slopesFor(l).filter((s) => Math.abs(s.n) !== s.d));
  const b = randInt(-6, 6);
  const b2 = randInt(-6, 6);
  const right = frNeg(frRecip(m));
  const wrongSlopes = [m, frNeg(m), frRecip(m)].filter((s) => !frEq(s, right));
  return mc(
    `Which line is perpendicular to ${eqStr(m, b)}?`,
    eqStr(right, b2),
    wrongSlopes.map((s) => eqStr(s, b2)),
    "Perpendicular slopes are negative reciprocals: flip the fraction and change the sign. Their product is −1.",
  );
};

const relationGraph: Gen = (l) => {
  const kind = pick(["Parallel", "Perpendicular", "Neither"]);
  const pool = slopesFor(l).filter((s) => s.d <= 2 && Math.abs(s.n) <= 3);
  let m1 = pick(pool);
  let m2: Fr;
  if (kind === "Parallel") m2 = m1;
  else if (kind === "Perpendicular") {
    m1 = pick(pool.filter((s) => s.d <= 2 && Math.abs(s.n) <= 2 && Math.abs(s.n) !== s.d));
    m2 = frNeg(frRecip(m1));
  } else {
    do m2 = pick(pool);
    while (frEq(m2, m1) || frEq(m2, frNeg(frRecip(m1))));
  }
  const b1 = randInt(-4, 4);
  let b2 = randInt(-4, 4);
  if (kind === "Parallel" && b2 === b1) b2 = b1 + 3;
  const lab = l < 3;
  return mc(
    "Are the two lines parallel, perpendicular or neither?",
    kind,
    ["Parallel", "Perpendicular", "Neither"].filter((k) => k !== kind),
    "Compare slopes. Equal slopes mean parallel. Slopes that are negative reciprocals (product −1) mean perpendicular. Anything else is neither.",
    win(8, [lineCurve(m1.n / m1.d, b1, 8, lab ? eqStr(m1, b1) : undefined), lineCurve(m2.n / m2.d, b2, 8, lab ? eqStr(m2, b2) : undefined)]),
  );
};

const lineThroughPoint: Gen = (l) => {
  const perp = l > 1 && chance(0.5);
  const y1 = randInt(-6, 6);
  const c = randInt(-5, 5);
  if (!perp) {
    const m = pick([-4, -3, -2, -1, 1, 2, 3, 4]);
    const x1 = nonzero(-5, 5);
    const b = y1 - m * x1;
    return mc(
      `Find the line through ${pair(x1, y1)} that is parallel to ${eqStr(fr(m), c)}.`,
      eqStr(fr(m), b),
      [eqStr(fr(m), y1 + m * x1), eqStr(fr(-m), b), eqStr(fr(m), c), eqStr(fr(-1, m), b)],
      "A parallel line has the same slope. Substitute the point into y = mx + b to find the new y-intercept.",
    );
  }
  const m = pick([-4, -3, -2, 2, 3, 4]);
  const k = nonzero(-2, 2);
  const x1 = k * m;
  const b = y1 + k;
  const perpM = fr(-1, m);
  return mc(
    `Find the line through ${pair(x1, y1)} that is perpendicular to ${eqStr(fr(m), c)}.`,
    eqStr(perpM, b),
    [eqStr(frNeg(perpM), y1 - k), eqStr(perpM, y1), eqStr(fr(m), y1 - m * x1), eqStr(perpM, -b)],
    `The perpendicular slope is the negative reciprocal, ${frStr(perpM)}. Substitute the point to find b: b = ${num(y1)} ${M} (${frStr(perpM)})(${num(x1)}).`,
  );
};

const specialLines: Gen = () => {
  const c = nonzero(-9, 9);
  const t = randInt(0, 2);
  if (t === 0) {
    return mc(`What is the slope of the line x = ${num(c)}?`, "undefined", ["0", num(c), "1"], "x = a constant is a vertical line. Its run is 0, so rise ÷ 0 is undefined.");
  }
  if (t === 1) {
    return mc(`What is the slope of the line y = ${num(c)}?`, "0", ["undefined", num(c), "1"], "y = a constant is a horizontal line. It does not rise at all, so the slope is 0.");
  }
  const a = nonzero(-8, 8);
  return mc(
    `Which equation describes the vertical line through ${pair(a, c)}?`,
    `x = ${num(a)}`,
    [`y = ${num(c)}`, `x = ${num(c)}`, `y = ${num(a)}`],
    "A vertical line keeps the same x-value for every point, so its equation is x = that value.",
  );
};

const rateContext: Gen = () => {
  const r = pick([12, 15, 18, 20, 25, 60]);
  const cr = pick([2, 3, 4, 5]);
  const b = pick([30, 45, 50, 80]);
  const wantRate = chance(0.5);
  const bank = [
    {
      eq: `C = ${r}h + ${b}`,
      rateTxt: String(r),
      story: "A technician charges a call-out fee plus an hourly rate. C is the total cost in dollars and h is the hours worked.",
      rate: "The hourly rate, in dollars per hour",
      start: "The call-out fee, in dollars",
      other: ["The number of hours worked", "The total cost after one hour"],
    },
    {
      eq: `H = ${b} ${M} ${cr}t`,
      rateTxt: `${M}${cr}`,
      story: "A candle burns down as time passes. H is its height in centimetres and t is the time in hours.",
      rate: `The height falls by ${cr} cm each hour`,
      start: "The candle's height when it is first lit",
      other: ["The time it takes to burn out", "The candle's height after 1 hour"],
    },
    {
      eq: `D = ${r}t + ${b}`,
      rateTxt: String(r),
      story: "A hiker is already some distance along a trail when a timer starts. D is the distance from the trailhead in metres and t is the time in minutes.",
      rate: "The hiker's speed, in metres per minute",
      start: "The hiker's distance from the trailhead at t = 0",
      other: ["The total time of the hike", "The distance after one hour"],
    },
  ];
  const c = pick(bank);
  const target = wantRate ? c.rateTxt : String(b);
  return mc(
    `${c.story} In ${c.eq}, what does the ${target} represent?`,
    wantRate ? c.rate : c.start,
    [wantRate ? c.start : c.rate, ...c.other],
    "In a linear relation y = mx + b, m is the rate of change (how much y changes per 1 unit of x) and b is the initial value (y when x = 0).",
  );
};

const tableRate: Gen = (l) => {
  const step = pick(l === 1 ? [1] : [1, 2, 5]);
  const m = nonzero(l === 1 ? 1 : -5, 6);
  const b = randInt(-6, 10);
  const xs = [0, 1, 2, 3].map((i) => i * step);
  if (l > 1 && chance(0.35)) {
    return mc(
      "Is the relationship in this table linear?",
      "No, the rate of change is not constant",
      ["Yes, because y keeps increasing"],
      "A relation is linear when y changes by the same amount for each equal step in x. Check the differences between consecutive y-values.",
      { type: "table", headers: ["x", "y"], rows: xs.map((x) => [x, x * x + b]) },
    );
  }
  return typedInt(
    "What is the rate of change (Δy ÷ Δx) shown in this table?",
    m,
    `Pick two rows: rate = (change in y) ÷ (change in x)${step > 1 ? ". Careful: x goes up by " + step + " each row, so divide the change in y by " + step : ""}.`,
    { visual: { type: "table", headers: ["x", "y"], rows: xs.map((x) => [x, num(m * x + b)]) } },
  );
};

const linesUnit = (o?: GenerateOptions) =>
  build(
    [slopeTwoPoints, slopeFractionChoice, slopeFromGraph, slopeAndIntercept, equationFromGraph, equationFromPoint, equationTwoPoints, pointSlopeForm, readPointSlope, toGeneralForm, slopeFromGeneral, interceptsStd, parallelChoice, perpendicularChoice, relationGraph, lineThroughPoint, specialLines, rateContext, tableRate],
    levelOf(o),
  );

// ---------- Unit 7: Arithmetic sequences and series ----------

const seqTerms = (a: number, d: number, n: number) => Array.from({ length: n }, (_, i) => a + i * d);
const seqStr = (xs: number[], tail = true) => xs.map(num).join(", ") + (tail ? ", …" : "");
const tn = (a: number, d: number, n: number) => a + (n - 1) * d;
const sumN = (a: number, d: number, n: number) => (n * (2 * a + (n - 1) * d)) / 2;
function seqParams(l: Level) {
  const d = l === 1 ? randInt(2, 6) : nonzero(-9, 9);
  const a = l === 1 ? randInt(1, 12) : randInt(-12, 25);
  return { a, d };
}

const commonDifference: Gen = (l) => {
  const { a, d } = seqParams(l);
  return typedInt(`Find the common difference of the sequence ${seqStr(seqTerms(a, d, 4))}`, d, "Subtract any term from the term after it. In an arithmetic sequence the answer is the same every time (it can be negative).");
};

const nextTerm: Gen = (l) => {
  const { a, d } = seqParams(l);
  const shown = 4;
  const ask = shown + randInt(1, l === 1 ? 1 : 2);
  return typedInt(
    `What is term number ${ask} of ${seqStr(seqTerms(a, d, shown))}`,
    tn(a, d, ask),
    `Find the common difference (${num(d)}), then keep adding it until you reach term ${ask}, or use t(n) = a + (n − 1)d.`,
  );
};

const generalTermChoice: Gen = (l) => {
  const { a, d } = seqParams(l === 1 ? 2 : l);
  const f = (p: number, q: number) => `t(n) = ${linStr(p, q, "n")}`;
  return mc(
    `Which formula gives the general term of ${seqStr(seqTerms(a, d, 4))}`,
    f(d, a - d),
    [f(d, a), f(a, d), f(d, a + d), f(a, a - d), f(-d, a - d)],
    `Use t(n) = a + (n − 1)d with a = ${num(a)} and d = ${num(d)}, then simplify: ${d}n + (${num(a)} − ${num(d)}). Test it on the first term: n = 1 must give ${num(a)}.`,
  );
};

const findTermValue: Gen = (l) => {
  const { a, d } = seqParams(l);
  const n = randInt(l === 1 ? 8 : 10, l === 3 ? 60 : 30);
  return typedInt(
    `An arithmetic sequence has first term ${num(a)} and common difference ${num(d)}. Find term ${n}.`,
    tn(a, d, n),
    `t(${n}) = ${num(a)} + (${n} − 1)(${num(d)}) = ${num(a)} + ${n - 1}(${num(d)}).`,
  );
};

const whichTerm: Gen = (l) => {
  const { a, d } = seqParams(l === 1 ? 2 : l);
  const n = randInt(10, 40);
  const v = tn(a, d, n);
  return typed(
    `In the sequence ${seqStr(seqTerms(a, d, 4))} which term number equals ${num(v)}?`,
    n,
    `Solve ${num(v)} = ${num(a)} + (n − 1)(${num(d)}) for n: subtract ${num(a)}, divide by ${num(d)}, then add 1.`,
  );
};

const countTerms: Gen = (l) => {
  const { a, d } = seqParams(l === 1 ? 2 : l);
  const n = randInt(10, 45);
  const last = tn(a, d, n);
  return typed(
    `How many terms are in the sequence ${seqStr(seqTerms(a, d, 3), false)}, …, ${num(last)}?`,
    n,
    `Use last = a + (n − 1)d and solve for n. Check: (last − first) ÷ d gives the gaps; the number of terms is one more than the number of gaps.`,
  );
};

const sumFirstN: Gen = (l) => {
  const { a, d } = seqParams(l);
  const n = randInt(8, l === 3 ? 40 : 25);
  const s = sumN(a, d, n);
  return typedInt(
    `Find the sum of the first ${n} terms of an arithmetic series with a = ${num(a)} and d = ${num(d)}.`,
    s,
    `Use S(n) = n/2 × [2a + (n − 1)d] = ${n}/2 × [${2 * a} + ${n - 1}(${num(d)})].`,
  );
};

const sumGivenEnds: Gen = (l) => {
  const { a, d } = seqParams(l === 1 ? 2 : l);
  const n = randInt(8, 30);
  const last = tn(a, d, n);
  return typedInt(
    `Find the sum ${seqStr(seqTerms(a, d, 3), false)} + … + ${num(last)}.`,
    sumN(a, d, n),
    `First find the number of terms n (here ${n}). Then S(n) = n/2 × (first + last).`,
  );
};

const gaussSum: Gen = () => {
  const n = pick([20, 30, 40, 50, 60, 80, 100]);
  return typed(`Find 1 + 2 + 3 + … + ${n}.`, (n * (n + 1)) / 2, `Pair the first and last terms: each pair sums to ${n + 1}, and there are ${n}/2 pairs. Or use S = n(first + last)/2.`);
};

const identifyType: Gen = (l) => {
  const kind = pick(["Arithmetic", "Geometric", "Neither"]);
  let seq: number[];
  if (kind === "Arithmetic") {
    const { a, d } = seqParams(l === 1 ? 2 : l);
    seq = seqTerms(a, d, 5);
  } else if (kind === "Geometric") {
    const r = pick([2, 3, -2, 5]);
    const a = randInt(1, 4);
    seq = Array.from({ length: 5 }, (_, i) => a * r ** i);
  } else {
    seq = pick([[1, 4, 9, 16, 25], [1, 1, 2, 3, 5], [1, 3, 6, 10, 15], [2, 3, 5, 8, 12], [1, 2, 4, 7, 11]]);
  }
  return mc(
    `Is the sequence ${seqStr(seq)} arithmetic, geometric or neither?`,
    kind,
    ["Arithmetic", "Geometric", "Neither"].filter((k) => k !== kind),
    "Arithmetic: the same number is ADDED each time (constant difference). Geometric: the same number is MULTIPLIED each time (constant ratio). Check both.",
  );
};

const twoTerms: Gen = (l) => {
  const { a, d } = seqParams(l === 1 ? 2 : l);
  const p = randInt(2, 4);
  const q = p + randInt(2, 5);
  const wantA = chance(0.5);
  return typedInt(
    `In an arithmetic sequence, t(${p}) = ${num(tn(a, d, p))} and t(${q}) = ${num(tn(a, d, q))}. What is the ${wantA ? "first term" : "common difference"}?`,
    wantA ? a : d,
    `The terms are ${q - p} steps apart, so d = (${num(tn(a, d, q))} − ${num(tn(a, d, p))}) ÷ ${q - p}.${wantA ? " Then work backwards from t(" + p + ") to the first term." : ""}`,
  );
};

const missingTerm: Gen = (l) => {
  const gaps = l === 1 ? 2 : pick([3, 4]);
  const { a, d } = seqParams(l === 1 ? 2 : l);
  const e = a + gaps * d;
  const blanks = Array.from({ length: gaps - 1 }, () => "__").join(", ");
  const which = randInt(1, gaps - 1);
  return typedInt(
    `Insert ${gaps - 1} arithmetic ${gaps === 2 ? "mean" : "means"} between ${num(a)} and ${num(e)}: ${num(a)}, ${blanks}, ${num(e)}. What is the ${which === 1 ? "first" : which === 2 ? "second" : "third"} missing number?`,
    a + which * d,
    `There are ${gaps} equal steps from ${num(a)} to ${num(e)}, so d = (${num(e)} − ${num(a)}) ÷ ${gaps}. Add d the right number of times.`,
  );
};

const seqContext: Gen = (l) => {
  const a = randInt(8, 20);
  const d = randInt(2, l === 1 ? 4 : 7);
  const n = randInt(8, l === 3 ? 30 : 20);
  const total = chance(0.5);
  const ctx = pick([
    { s: `A theatre's first row has ${a} seats, and each row behind it has ${d} more seats.`, unit: "seats", item: "row" },
    { s: `Amara saves $${a} in week 1 and increases her saving by $${d} each week.`, unit: "dollars", item: "week" },
    { s: `Kenji practises for ${a} minutes on day 1 and adds ${d} minutes each day after that.`, unit: "minutes", item: "day" },
  ]);
  return typed(
    `${ctx.s} ${total ? `How many ${ctx.unit} in total over the first ${n} ${ctx.item}s?` : `How many ${ctx.unit} in ${ctx.item} ${n}?`}`,
    total ? sumN(a, d, n) : tn(a, d, n),
    total ? `Use S(n) = n/2 × [2a + (n − 1)d] with a = ${a}, d = ${d}, n = ${n}.` : `Use t(n) = a + (n − 1)d with a = ${a}, d = ${d}, n = ${n}.`,
  );
};

const sequenceGraph: Gen = (l) => {
  const d = nonzero(l === 1 ? 1 : -4, 5);
  const a = randInt(d < 0 ? 12 : 1, d < 0 ? 22 : 12);
  const pts = seqTerms(a, d, 5).map((y, i) => ({ x: i + 1, y }));
  const ys = pts.map((p) => p.y);
  const yMin = Math.min(0, ...ys) - 1;
  const yMax = Math.max(...ys) + 1;
  return typedInt(
    "The points show the first five terms of an arithmetic sequence (n, t(n)). What is the common difference?",
    d,
    "Read the y-value of two neighbouring points and subtract. The points rise (positive d) or fall (negative d) by the same amount each step.",
    { visual: { type: "plot", xMin: 0, xMax: 6, yMin, yMax, step: 1, curves: [], points: pts } },
  );
};

const sequencesUnit = (o?: GenerateOptions) =>
  build([commonDifference, nextTerm, generalTermChoice, findTermValue, whichTerm, countTerms, sumFirstN, sumGivenEnds, gaussSum, identifyType, twoTerms, missingTerm, seqContext, sequenceGraph], levelOf(o));

// ---------- Unit 8: Systems of linear equations ----------

interface System {
  sx: number;
  sy: number;
  m: number; // y = m x + b
  b: number;
  A: number; // A x + B y = C
  B: number;
  C: number;
}
function makeSystem(l: Level): System {
  for (let t = 0; t < 200; t++) {
    const sx = randInt(-5, 6);
    const sy = randInt(-5, 6);
    const m = nonzero(l === 1 ? 1 : -4, 4);
    const A = nonzero(l === 1 ? 1 : -5, 5);
    const B = nonzero(l === 1 ? 1 : -5, 5);
    if (A + B * m === 0) continue;
    return { sx, sy, m, b: sy - m * sx, A, B, C: A * sx + B * sy };
  }
  return { sx: 2, sy: 3, m: 1, b: 1, A: 1, B: 1, C: 5 };
}
const yEq = (m: number, b: number) => eqStr(fr(m), b);

const substitutionSolve: Gen = (l) => {
  const s = makeSystem(l);
  const wantX = chance(0.5);
  return typedInt(
    `Solve the system by substitution: ${yEq(s.m, s.b)} and ${stdStr(s.A, s.B, s.C)}. What is ${wantX ? "x" : "y"}?`,
    wantX ? s.sx : s.sy,
    `Replace y in the second equation with ${linStr(s.m, s.b)}, solve for x, then substitute back to find y.`,
  );
};

const eliminationSolve: Gen = (l) => {
  let a1 = 0, b1 = 0, a2 = 0, b2 = 0, sx = 0, sy = 0;
  for (let t = 0; t < 200; t++) {
    sx = randInt(-5, 6);
    sy = randInt(-5, 6);
    if (l === 1) {
      b1 = nonzero(1, 5);
      b2 = -b1;
      a1 = nonzero(-5, 5);
      a2 = nonzero(-5, 5);
    } else if (l === 2) {
      b1 = pick([1, -1]);
      b2 = -b1 * pick([2, 3]);
      a1 = nonzero(-5, 5);
      a2 = nonzero(-5, 5);
    } else {
      b1 = nonzero(-6, 6);
      b2 = nonzero(-6, 6);
      a1 = nonzero(-6, 6);
      a2 = nonzero(-6, 6);
    }
    if (a1 * b2 - a2 * b1 !== 0 && (l !== 3 || Math.abs(b1) !== Math.abs(b2))) break;
  }
  const c1 = a1 * sx + b1 * sy;
  const c2 = a2 * sx + b2 * sy;
  const wantX = chance(0.5);
  return typedInt(
    `Solve by elimination: ${stdStr(a1, b1, c1)} and ${stdStr(a2, b2, c2)}. What is ${wantX ? "x" : "y"}?`,
    wantX ? sx : sy,
    "Multiply one or both equations so a variable has opposite coefficients, add the equations to eliminate it, solve, then substitute back to find the other variable.",
  );
};

const eliminationStep: Gen = () => {
  let a1 = 0, b1 = 0, a2 = 0, b2 = 0;
  do {
    a1 = nonzero(-6, 6);
    a2 = nonzero(-6, 6);
    b1 = nonzero(2, 6);
    b2 = -nonzero(2, 6);
  } while (Math.abs(b1) === Math.abs(b2) || a1 * b2 - a2 * b1 === 0);
  const g = gcd(b1, -b2);
  const k1 = -b2 / g;
  const k2 = b1 / g;
  const label = (x: number, y: number) => `Multiply equation 1 by ${x} and equation 2 by ${y}, then add`;
  const wrongPairs = [[k2, k1], [b1, -b2], [-b2, b1 + 1], [k1 + 1, k2]].filter(([p, q]) => b1 * p + b2 * q !== 0);
  const wrong = wrongPairs.map(([p, q]) => label(p, q));
  return mc(
    `To eliminate y from ${stdStr(a1, b1, 0).replace(" = 0", "")} = c₁ and ${stdStr(a2, b2, 0).replace(" = 0", "")} = c₂, what should you do?`,
    label(k1, k2),
    wrong,
    `You need the y-terms to cancel: ${b1}y and ${num(b2)}y. Multiply so both become ${num(Math.abs(lcm(b1, -b2)))} in size with opposite signs, then add.`,
  );
};

const graphSolution: Gen = (l) => {
  let s = makeSystem(2);
  let m2 = 0;
  do {
    s = makeSystem(2);
    m2 = nonzero(-3, 3);
  } while (m2 === s.m || Math.abs(s.sx) > 5 || Math.abs(s.sy) > 5);
  const b2 = s.sy - m2 * s.sx;
  const lab = l < 3;
  const right = pair(s.sx, s.sy);
  return mc(
    "The graph shows two lines. What is the solution of the system?",
    right,
    [pair(s.sy, s.sx), pair(-s.sx, s.sy), pair(s.sx, -s.sy), pair(s.sx + 1, s.sy), pair(s.sx, s.sy + 1)],
    "The solution is the point where the lines cross. Read its x-coordinate first, then its y-coordinate, and check it in both equations.",
    win(8, [lineCurve(s.m, s.b, 8, lab ? yEq(s.m, s.b) : undefined), lineCurve(m2, b2, 8, lab ? yEq(m2, b2) : undefined)]),
  );
};

const parallelGraph: Gen = () => {
  const m = nonzero(-3, 3);
  const b1 = randInt(-5, 0);
  const b2 = b1 + randInt(2, 4);
  return mc(
    "The graph shows two lines. How many solutions does the system have?",
    "No solution",
    ["Exactly one solution", "Infinitely many solutions", "Exactly two solutions"],
    "The lines have the same slope and never meet, so no point lies on both. Parallel lines mean no solution.",
    win(8, [lineCurve(m, b1, 8, yEq(m, b1)), lineCurve(m, b2, 8, yEq(m, b2))]),
  );
};

const verifyPair: Gen = (l) => {
  const s = makeSystem(l);
  const wrong = [pair(s.sx + 1, s.sy + s.m), pair(s.sx + s.B, s.sy - s.A), pair(s.sy, s.sx), pair(s.sx, s.sy + 1)];
  return mc(
    `Which ordered pair is the solution of both ${yEq(s.m, s.b)} and ${stdStr(s.A, s.B, s.C)}?`,
    pair(s.sx, s.sy),
    wrong,
    "A solution must make BOTH equations true. Substitute each choice into both equations; some pairs satisfy only one.",
  );
};

const solutionCount: Gen = (l) => {
  const kind = pick(["one", "none", "inf"]);
  const m = nonzero(-4, 4);
  const b = nonzero(-6, 6);
  let eq2: string;
  if (kind === "none") eq2 = yEq(m, b + nonzero(-4, 4));
  else if (kind === "inf") {
    const k = pick([2, 3]);
    eq2 = stdStr(-m * k, k, b * k);
  } else {
    let m2 = nonzero(-4, 4);
    if (m2 === m) m2 = m + 1 === 0 ? 2 : m + 1;
    eq2 = yEq(m2, nonzero(-6, 6));
  }
  void l;
  const labels = { one: "Exactly one solution", none: "No solution", inf: "Infinitely many solutions" };
  return mc(
    `How many solutions does this system have? ${yEq(m, b)} and ${eq2}`,
    labels[kind as keyof typeof labels],
    Object.entries(labels).filter(([k]) => k !== kind).map(([, v]) => v),
    "Write both in slope–intercept form and compare. Different slopes: one solution. Same slope, different intercepts: none. Same slope and same intercept: the same line, so infinitely many.",
  );
};

const ticketsProblem: Gen = (l) => {
  const adult = randInt(8, 18);
  const child = randInt(4, adult - 2);
  const na = randInt(4, l === 1 ? 20 : 40);
  const nc = randInt(4, l === 1 ? 20 : 40);
  const name = pick(NAMES);
  return typed(
    `At a school play, adult tickets cost $${adult} and student tickets cost $${child}. ${name} sold ${na + nc} tickets and collected $${na * adult + nc * child}. How many student tickets were sold?`,
    nc,
    `Let a = adult tickets and s = student tickets. Then a + s = ${na + nc} and ${adult}a + ${child}s = ${na * adult + nc * child}. Solve the system.`,
  );
};

const pricesProblem: Gen = () => {
  const x = randInt(2, 9);
  const y = randInt(1, 6);
  const [p, q, r, s] = [nonzero(1, 4), nonzero(1, 4), nonzero(1, 5), nonzero(1, 5)];
  if (p * s - q * r === 0) return pricesProblem(1);
  const item = pick([["notebook", "pen"], ["sandwich", "juice"], ["ticket", "snack"]]);
  return typed(
    `${p} ${item[0]}${p > 1 ? "s" : ""} and ${q} ${item[1]}${q > 1 ? "s" : ""} cost $${p * x + q * y}. ${r} ${item[0]}${r > 1 ? "s" : ""} and ${s} ${item[1]}${s > 1 ? "s" : ""} cost $${r * x + s * y}. How much does one ${item[0]} cost, in dollars?`,
    x,
    `Let x = the cost of one ${item[0]} and y = the cost of one ${item[1]}. Write two equations and solve them.`,
  );
};

const numbersProblem: Gen = (l) => {
  const big = randInt(10, l === 1 ? 30 : 60);
  const small = randInt(2, big - 2);
  return typed(
    `Two numbers have a sum of ${big + small} and a difference of ${big - small}. What is the larger number?`,
    big,
    "Let the numbers be x and y: x + y = sum and x − y = difference. Adding the equations eliminates y.",
  );
};

const plansProblem: Gen = () => {
  const f1 = pick([10, 15, 20]);
  const f2 = f1 + pick([10, 15, 20]);
  const r2 = pick([2, 3, 4]);
  const diff = f2 - f1;
  const g = pick([2, 3, 4, 5, 10].filter((x) => diff % x === 0));
  const r1 = r2 + diff / g;
  return typed(
    `Plan A costs $${f1} per month plus $${r1} per GB. Plan B costs $${f2} per month plus $${r2} per GB. For how many GB do the plans cost the same?`,
    g,
    `Set the costs equal: ${f1} + ${r1}g = ${f2} + ${r2}g. Solve for g.`,
  );
};

const firstStep: Gen = () => {
  const m = nonzero(-4, 4);
  const b = nonzero(-6, 6);
  return mc(
    `For the system ${yEq(m, b)} and 2x + 3y = 12, which first step is the most direct?`,
    `Substitute ${linStr(m, b)} for y in the second equation`,
    [`Substitute 2x + 3y for y in the first equation`, "Add the two equations as they are", "Multiply the first equation by 12"],
    "When one equation is already solved for a variable, substitution is the quickest: replace that variable in the other equation.",
  );
};

const systemsUnit = (o?: GenerateOptions) =>
  build([substitutionSolve, eliminationSolve, eliminationStep, graphSolution, parallelGraph, verifyPair, solutionCount, ticketsProblem, pricesProblem, numbersProblem, plansProblem, firstStep, substitutionSolve, eliminationSolve], levelOf(o));

// ---------- Unit 9: Right-triangle trigonometry ----------

const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]];
const RAD = Math.PI / 180;
const tenth = (x: number) => (Math.round(x * 10) / 10).toFixed(1);
/** True when rounding x to one decimal place is not a close call. */
const clearTenth = (x: number) => Math.abs(x * 10 - Math.floor(x * 10) - 0.5) > 0.12;
const clearWhole = (x: number) => Math.abs(x - Math.floor(x) - 0.5) > 0.12;
const decimalAnswer = (x: number): TypedOpts & { answer: string } => {
  const s = tenth(x);
  return { answer: s, keypad: "decimal", accept: s.endsWith(".0") ? [s.slice(0, -2)] : undefined };
};

type Ratio = "sin" | "cos" | "tan";
type Role = "opposite" | "adjacent" | "hypotenuse";
const RATIO_DEF: Record<Ratio, [Role, Role]> = { sin: ["opposite", "hypotenuse"], cos: ["adjacent", "hypotenuse"], tan: ["opposite", "adjacent"] };
const fnOf = (r: Ratio, deg: number) => (r === "sin" ? Math.sin(deg * RAD) : r === "cos" ? Math.cos(deg * RAD) : Math.tan(deg * RAD));
const roleText = (r: Role) => (r === "hypotenuse" ? "hypotenuse" : r === "opposite" ? "side opposite the angle" : "side adjacent to the angle");

const ratioIdentify: Gen = () => {
  const [p, q, h] = pick(TRIPLES);
  const [bc, ac] = chance(0.5) ? [p, q] : [q, p];
  const angle = pick(["A", "B"]);
  const opp = angle === "A" ? bc : ac;
  const adj = angle === "A" ? ac : bc;
  const ratio = pick(["sin", "cos", "tan"] as Ratio[]);
  const vals: Record<Role, number> = { opposite: opp, adjacent: adj, hypotenuse: h };
  const [n, d] = RATIO_DEF[ratio];
  const all: [Role, Role][] = [["opposite", "hypotenuse"], ["adjacent", "hypotenuse"], ["opposite", "adjacent"], ["hypotenuse", "opposite"], ["hypotenuse", "adjacent"], ["adjacent", "opposite"]];
  const label = (a: Role, b: Role) => `${vals[a]}/${vals[b]}`;
  return mc(
    `In right triangle ABC, ∠C = 90°, BC = ${bc}, AC = ${ac} and AB = ${h}. What is ${ratio} ${angle}?`,
    label(n, d),
    all.filter(([a, b]) => !(a === n && b === d)).map(([a, b]) => label(a, b)),
    `For angle ${angle}, the opposite side is ${opp}, the adjacent side is ${adj} and the hypotenuse is ${h}. Remember SOH-CAH-TOA: sin = opp/hyp, cos = adj/hyp, tan = opp/adj.`,
  );
};

const conceptNames: Gen = () => {
  const bank: { p: string; r: string }[] = [
    { p: "Which ratio is (side opposite the angle) ÷ hypotenuse?", r: "sine" },
    { p: "Which ratio is (side adjacent to the angle) ÷ hypotenuse?", r: "cosine" },
    { p: "Which ratio is (side opposite the angle) ÷ (side adjacent to the angle)?", r: "tangent" },
  ];
  const it = pick(bank);
  return mc(it.p, it.r, ["sine", "cosine", "tangent"].filter((x) => x !== it.r), "Use SOH-CAH-TOA: Sine = Opposite/Hypotenuse, Cosine = Adjacent/Hypotenuse, Tangent = Opposite/Adjacent.");
};

const sidesRoles: Gen = () => {
  const bank = [
    { p: "In a right triangle, which side is always the longest?", r: "The hypotenuse", w: ["The side opposite the angle", "The side adjacent to the angle", "It depends on the angle"] },
    { p: "Which side is the hypotenuse?", r: "The side opposite the 90° angle", w: ["The side touching the 90° angle", "The shortest side", "The side adjacent to the given angle"] },
    { p: "The side adjacent to an acute angle θ is…", r: "the leg that touches θ (not the hypotenuse)", w: ["the longest side", "the side across from θ", "the side opposite the right angle"] },
  ];
  const it = pick(bank);
  return mc(it.p, it.r, it.w, "Label the triangle from the point of view of the angle you are working with: hypotenuse across from the 90°, opposite across from θ, adjacent next to θ.");
};

const chooseEquation: Gen = () => {
  const ratio = pick(["sin", "cos", "tan"] as Ratio[]);
  const [nr, dr] = RATIO_DEF[ratio];
  const unknownNum = chance(0.5);
  const ang = randInt(20, 70);
  const k = randInt(6, 40);
  const eq = (r: Ratio, numUnknown: boolean) => `${r} ${ang}° = ${numUnknown ? `x/${k}` : `${k}/x`}`;
  const [unknownRole, knownRole] = unknownNum ? [nr, dr] : [dr, nr];
  const wrong = (["sin", "cos", "tan"] as Ratio[]).filter((r) => r !== ratio).map((r) => eq(r, unknownNum));
  wrong.push(eq(ratio, !unknownNum));
  return mc(
    `In a right triangle, an acute angle is ${ang}°. The ${knownRole === "hypotenuse" ? "hypotenuse" : `side ${knownRole} to it`} is ${k} and the ${unknownRole === "hypotenuse" ? "hypotenuse" : `side ${unknownRole} to it`} is x. Which equation can you use to find x?`,
    eq(ratio, unknownNum),
    wrong,
    `Name the two sides involved: ${nr} and ${dr}. That tells you the ratio (SOH-CAH-TOA). Then put the ratio's numerator over its denominator in the right order.`,
  );
};

const solveSide: Gen = (l) => {
  for (let t = 0; t < 80; t++) {
    const ratio = pick(["sin", "cos", "tan"] as Ratio[]);
    const [nr, dr] = RATIO_DEF[ratio];
    const unknownNum = chance(0.5);
    const ang = randInt(20, 70);
    const k = randInt(l === 1 ? 6 : 8, 45);
    const rv = fnOf(ratio, ang);
    const x = unknownNum ? rv * k : k / rv;
    if (!clearTenth(x)) continue;
    const [unknownRole, knownRole] = unknownNum ? [nr, dr] : [dr, nr];
    const prompt = `In a right triangle, an acute angle is ${ang}°. The ${roleText(knownRole)} is ${k} cm. Find the ${roleText(unknownRole)}, to the nearest tenth of a centimetre.`;
    const hint = `Use ${ratio} ${ang}° = ${nr}/${dr}. ${unknownNum ? `Multiply: x = ${k} × ${ratio} ${ang}°.` : `Divide: x = ${k} ÷ ${ratio} ${ang}°.`} Make sure your calculator is in degree mode.`;
    if (l === 1 || chance(0.4)) {
      const alts = [Math.sin, Math.cos, Math.tan].flatMap((f) => [f(ang * RAD) * k, k / f(ang * RAD)]).map(tenth);
      const right = tenth(x);
      return mc(prompt, `${right} cm`, alts.filter((a) => a !== right).map((a) => `${a} cm`), hint);
    }
    return typed(prompt, decimalAnswer(x).answer, hint, { keypad: "decimal", suffix: "cm", accept: decimalAnswer(x).accept });
  }
  return typed("In a right triangle with hypotenuse 10 cm, what is the side opposite a 30° angle?", 5, "sin 30° = 0.5, so opposite = 10 × 0.5.", { suffix: "cm" });
};

const solveAngle: Gen = (l) => {
  for (let t = 0; t < 80; t++) {
    const ratio = pick(["sin", "cos", "tan"] as Ratio[]);
    const [nr, dr] = RATIO_DEF[ratio];
    let a = randInt(3, l === 1 ? 20 : 40);
    let b = randInt(3, l === 1 ? 20 : 40);
    if (ratio !== "tan" && a > b) [a, b] = [b, a];
    if (ratio !== "tan" && a === b) continue;
    const value = a / b;
    const theta = (ratio === "sin" ? Math.asin(value) : ratio === "cos" ? Math.acos(value) : Math.atan(value)) / RAD;
    if (!clearWhole(theta) || theta < 5 || theta > 85) continue;
    const inv = ratio === "sin" ? "sin⁻¹" : ratio === "cos" ? "cos⁻¹" : "tan⁻¹";
    const prompt = `In a right triangle, the ${roleText(nr)}${nr === "hypotenuse" ? "" : " θ"} is ${a} and the ${roleText(dr)}${dr === "hypotenuse" ? "" : " θ"} is ${b}. Find θ to the nearest degree.`;
    const hint = `${nr}/${dr} = ${a}/${b}, so ${ratio} θ = ${a}/${b}. Use ${inv}(${a} ÷ ${b}) on your calculator in degree mode.`;
    const ans = Math.round(theta);
    if (chance(0.35)) {
      const others = [90 - ans, Math.round(Math.atan(value) / RAD), ans + 6, ans - 6, ans + 12].filter((x) => x > 0 && x < 90).map(String);
      return mc(prompt, `${ans}°`, others.filter((x) => x !== String(ans)).map((x) => `${x}°`), hint);
    }
    return typed(prompt, ans, hint, { suffix: "°" });
  }
  return typed("If sin θ = 0.5 in a right triangle, what is θ to the nearest degree?", 30, "sin⁻¹(0.5) = 30°.", { suffix: "°" });
};

const elevation: Gen = (l) => {
  for (let t = 0; t < 80; t++) {
    const thing = pick(["tower", "tree", "building", "flagpole", "cliff"]);
    const ang = randInt(20, 65);
    const d = randInt(15, 80);
    const eye = l === 3 ? pick([1.5, 1.6, 1.7]) : 0;
    const h = d * Math.tan(ang * RAD) + eye;
    if (!clearTenth(h)) continue;
    const base = `From a point ${d} m from the base of a ${thing}, the angle of elevation to its top is ${ang}°.`;
    const prompt = eye ? `${base} The observer's eyes are ${eye} m above the ground. How tall is the ${thing}, to the nearest tenth of a metre?` : `${base} How tall is the ${thing}, to the nearest tenth of a metre?`;
    const hint = `The distance ${d} m is the side adjacent to ${ang}°, and the height is opposite, so use tan ${ang}° = height ÷ ${d}.${eye ? ` Then add the observer's eye height of ${eye} m.` : ""}`;
    const o = decimalAnswer(h);
    return typed(prompt, o.answer, hint, { keypad: "decimal", suffix: "m", accept: o.accept, visual: l < 3 ? { type: "angle", degrees: ang } : undefined });
  }
  return typed("A 10 m ladder leans at 60° to the ground. How high up the wall does it reach? (nearest tenth)", "8.7", "Height = 10 × sin 60°.", { keypad: "decimal", suffix: "m" });
};

const depression: Gen = () => {
  for (let t = 0; t < 80; t++) {
    const ang = randInt(15, 60);
    const h = randInt(30, 120);
    const dist = h / Math.tan(ang * RAD);
    if (!clearTenth(dist)) continue;
    const o = decimalAnswer(dist);
    return typed(
      `From the top of a ${h} m cliff, the angle of depression to a boat is ${ang}°. How far is the boat from the base of the cliff, to the nearest tenth of a metre?`,
      o.answer,
      `The angle of depression is measured down from the horizontal, so it equals the angle of elevation from the boat (alternate angles). In the triangle, tan ${ang}° = ${h} ÷ distance. Solve for the distance.`,
      { keypad: "decimal", suffix: "m", accept: o.accept },
    );
  }
  return typed("A cliff is 50 m high; the angle of depression to a boat is 45°. How far away is the boat?", 50, "tan 45° = 1.", { suffix: "m" });
};

const ladder: Gen = () => {
  for (let t = 0; t < 80; t++) {
    const L = randInt(4, 12);
    const ang = randInt(55, 80);
    const up = chance(0.5);
    const v = up ? L * Math.sin(ang * RAD) : L * Math.cos(ang * RAD);
    if (!clearTenth(v)) continue;
    const o = decimalAnswer(v);
    return typed(
      `A ${L} m ladder leans against a wall and makes an angle of ${ang}° with the ground. ${up ? "How high up the wall does it reach" : "How far is the foot of the ladder from the wall"}, to the nearest tenth of a metre?`,
      o.answer,
      `The ladder is the hypotenuse. ${up ? `The height up the wall is opposite the ${ang}° angle: use sin.` : `The distance along the ground is adjacent to the ${ang}° angle: use cos.`}`,
      { keypad: "decimal", suffix: "m", accept: o.accept },
    );
  }
  return typed("A 6 m ladder makes a 60° angle with the ground. How far is its foot from the wall?", 3, "cos 60° = 0.5.", { suffix: "m" });
};

const pythagoras: Gen = (l) => {
  const [a, b, c] = pick(TRIPLES.slice(0, l === 1 ? 2 : 5));
  const s = l === 1 ? 1 : pick([1, 1, 2, 3]);
  const hyp = chance(0.5);
  return typed(
    hyp ? `A right triangle has legs ${a * s} and ${b * s}. What is the length of the hypotenuse?` : `A right triangle has hypotenuse ${c * s} and one leg ${a * s}. What is the other leg?`,
    hyp ? c * s : b * s,
    hyp ? "Use a² + b² = c². Add the squares of the legs, then take the square root." : "Use a² + b² = c². Subtract the square of the known leg from the square of the hypotenuse, then take the square root.",
  );
};

const complementary: Gen = () => {
  const ang = randInt(10, 80);
  const r = pick(["sin", "cos"]);
  const other = r === "sin" ? "cos" : "sin";
  if (chance(0.5)) {
    return typed(`${r} ${ang}° = ${other} x°. What is x?`, 90 - ang, `For the two acute angles of a right triangle, sin of one equals cos of the other, and they add to 90°: x = 90 ${M} ${ang}.`);
  }
  return typed(`One acute angle of a right triangle is ${ang}°. What is the other acute angle?`, 90 - ang, "The three angles add to 180° and the right angle uses 90°, so the acute angles add to 90°.", { suffix: "°" });
};

const specialValues: Gen = () => {
  const items = [
    { q: "sin 30°", v: "0.5" }, { q: "cos 60°", v: "0.5" }, { q: "sin 60°", v: "0.866" }, { q: "cos 30°", v: "0.866" },
    { q: "sin 45°", v: "0.707" }, { q: "cos 45°", v: "0.707" }, { q: "tan 45°", v: "1" }, { q: "tan 30°", v: "0.577" }, { q: "tan 60°", v: "1.732" },
  ];
  const it = pick(items);
  const vals = ["0.5", "0.866", "0.707", "1", "0.577", "1.732"];
  return mc(
    `What is ${it.q}, to three decimal places where needed?`,
    it.v,
    vals.filter((v) => v !== it.v),
    "These come from the special triangles: a 45°-45°-90° triangle (sides 1, 1, √2) and a 30°-60°-90° triangle (sides 1, √3, 2). Build the ratio from the sides.",
  );
};

const calculatorRead: Gen = () => {
  const ang = pick([20, 25, 35, 40, 50, 55, 65]);
  const r = pick(["sin", "cos", "tan"] as Ratio[]);
  const f = (x: Ratio) => fnOf(x, ang).toFixed(3);
  const radianVal = (r === "sin" ? Math.sin(ang) : r === "cos" ? Math.cos(ang) : Math.tan(ang)).toFixed(3);
  const right = f(r);
  return mc(
    `With a calculator in degree mode, what is ${r} ${ang}°, rounded to three decimal places?`,
    right,
    (["sin", "cos", "tan"] as Ratio[]).filter((x) => x !== r).map(f).concat([radianVal]),
    "Make sure the calculator shows DEG (degrees), not RAD. A wrong mode is the most common source of trig errors.",
  );
};

const trendConcept: Gen = () => {
  const bank = [
    { p: "As an acute angle θ grows from 0° towards 90°, what happens to sin θ?", r: "It increases from 0 towards 1", w: ["It decreases from 1 towards 0", "It stays the same", "It increases without any limit"] },
    { p: "As an acute angle θ grows from 0° towards 90°, what happens to cos θ?", r: "It decreases from 1 towards 0", w: ["It increases from 0 towards 1", "It stays the same", "It increases without any limit"] },
    { p: "As an acute angle θ grows towards 90°, what happens to tan θ?", r: "It gets larger and larger without limit", w: ["It decreases towards 0", "It stops at 1", "It stays between 0 and 1"] },
    { p: "Why can sin θ and cos θ never be greater than 1 in a right triangle?", r: "The hypotenuse is the longest side, so a leg divided by it is less than 1", w: ["Because calculators cap the answer at 1", "Because the legs are always longer than the hypotenuse", "Because angles are less than 90°, so the ratio must be small"] },
  ];
  const it = pick(bank);
  return mc(it.p, it.r, it.w, "Picture the triangle changing: as θ grows, the opposite side gets longer while the adjacent side shrinks.");
};

const trigUnit = (o?: GenerateOptions) =>
  build([ratioIdentify, conceptNames, sidesRoles, chooseEquation, solveSide, solveSide, solveAngle, elevation, depression, ladder, pythagoras, complementary, specialValues, calculatorRead, trendConcept], levelOf(o));

// ---------- Unit 10: Financial literacy ----------

const grp = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const money = (x: number) => {
  const [w, f] = x.toFixed(2).split(".");
  return `$${grp(Number(w))}.${f}`;
};
const exact2 = (x: number) => Math.abs(x * 100 - Math.round(x * 100)) < 1e-6;
function moneyAns(x: number): { answer: string; accept?: string[] } {
  const c = Math.round(x * 100) / 100;
  if (Number.isInteger(c)) return { answer: String(c), accept: [c.toFixed(2)] };
  const s = c.toFixed(2);
  return { answer: s, accept: s.endsWith("0") ? [String(c)] : undefined };
}
const typedMoney = (prompt: string, x: number, hint: string): Question => {
  const m = moneyAns(x);
  return typed(prompt, m.answer, hint, { keypad: "decimal", accept: m.accept });
};

const PRINCIPALS = [500, 800, 1000, 1200, 1500, 2000, 2500, 3000, 4000, 5000];

function simpleParams(l: Level) {
  for (let t = 0; t < 100; t++) {
    const P = pick(PRINCIPALS);
    const r = pick(l === 1 ? [2, 3, 4, 5] : [2, 2.5, 3, 4, 4.5, 5, 6, 8]);
    const years = pick(l === 1 ? [1, 2, 3] : [1, 2, 3, 4, 5]);
    const I = (P * r * years) / 100;
    if (exact2(I)) return { P, r, years, I };
  }
  return { P: 1000, r: 5, years: 2, I: 100 };
}

const siInterest: Gen = (l) => {
  const { P, r, years, I } = simpleParams(l);
  return typedMoney(
    `${pick(NAMES)} invests ${money(P)} at ${r}% simple interest per year for ${years} year${years > 1 ? "s" : ""}. How much interest is earned? (dollars)`,
    I,
    `I = Prt = ${P} × ${r / 100} × ${years}. Write the rate as a decimal first.`,
  );
};

const siTotal: Gen = (l) => {
  const { P, r, years, I } = simpleParams(l);
  return typedMoney(
    `A loan of ${money(P)} charges ${r}% simple interest per year. What total must be repaid after ${years} year${years > 1 ? "s" : ""}? (dollars)`,
    P + I,
    `First find the interest, I = Prt = ${P} × ${r / 100} × ${years}. The total repaid is the principal plus the interest.`,
  );
};

const siRate: Gen = (l) => {
  const P = pick(PRINCIPALS);
  const r = pick([2, 3, 4, 5, 6, 8, 9]);
  const years = pick(l === 1 ? [1, 2] : [2, 3, 4, 5]);
  const I = (P * r * years) / 100;
  return typed(
    `${money(P)} earns ${money(I)} in simple interest over ${years} year${years > 1 ? "s" : ""}. What is the annual interest rate? (percent)`,
    r,
    `Rearrange I = Prt to r = I ÷ (P × t) = ${I} ÷ (${P} × ${years}). That gives a decimal; multiply by 100 for a percent.`,
    { suffix: "%" },
  );
};

const siTime: Gen = () => {
  const P = pick(PRINCIPALS);
  const r = pick([2, 4, 5, 6, 8]);
  const years = pick([2, 3, 4, 5, 6, 8]);
  const I = (P * r * years) / 100;
  return typed(
    `How many years does it take ${money(P)} to earn ${money(I)} at ${r}% simple interest per year?`,
    years,
    `Rearrange I = Prt to t = I ÷ (P × r) = ${I} ÷ (${P} × ${r / 100}).`,
    { suffix: "years" },
  );
};

const siPrincipal: Gen = () => {
  const P = pick([400, 500, 600, 800, 1000, 1500, 2000, 2500]);
  const r = pick([2, 4, 5, 6, 8]);
  const years = pick([1, 2, 3, 4, 5]);
  const I = (P * r * years) / 100;
  return typed(
    `A savings account paid ${money(I)} in simple interest at ${r}% per year over ${years} year${years > 1 ? "s" : ""}. How much was originally invested? (dollars)`,
    P,
    `Rearrange I = Prt to P = I ÷ (r × t) = ${I} ÷ (${r / 100} × ${years}).`,
  );
};

const siMonths: Gen = () => {
  for (let t = 0; t < 100; t++) {
    const P = pick(PRINCIPALS);
    const r = pick([3, 4, 5, 6, 8, 9]);
    const months = pick([3, 6, 9, 18]);
    const I = (P * r * months) / 1200;
    if (exact2(I)) {
      return typedMoney(
        `How much simple interest does ${money(P)} earn at ${r}% per year in ${months} months? (dollars)`,
        I,
        `Convert the time to years: ${months} ÷ 12 = ${months / 12} year. Then I = Prt.`,
      );
    }
  }
  return typedMoney("How much simple interest does $1 200 earn at 5% per year in 6 months? (dollars)", 30, "6 months is 0.5 year: 1200 × 0.05 × 0.5.");
};

function compoundParams(l: Level) {
  for (let t = 0; t < 200; t++) {
    const P = pick(l === 1 ? [1000, 2000, 5000] : PRINCIPALS);
    const r = pick(l === 1 ? [4, 5, 6] : [3, 4, 5, 6, 8]);
    const n = pick(l === 1 ? [1, 2] : [1, 2, 4, 12]);
    const years = pick(l === 1 ? [2, 3] : [2, 3, 4, 5, 8, 10]);
    const A = P * (1 + r / 100 / n) ** (n * years);
    if (clearWhole(A)) return { P, r, n, years, A };
  }
  return { P: 1000, r: 5, n: 1, years: 2, A: 1102.5 };
}
const freqName = (n: number) => (n === 1 ? "annually" : n === 2 ? "semi-annually" : n === 4 ? "quarterly" : "monthly");

const compoundAmount: Gen = (l) => {
  const { P, r, n, years, A } = compoundParams(l);
  return typed(
    `${money(P)} is invested at ${r}% per year compounded ${freqName(n)} for ${years} years. What is the final amount, to the nearest dollar?`,
    Math.round(A),
    `A = P(1 + r/n)^(nt) with P = ${P}, r = ${r / 100}, n = ${n}, t = ${years}: A = ${P}(1 + ${r / 100}/${n})^${n * years}. Do the exponent before multiplying by P.`,
  );
};

const compoundChoice: Gen = (l) => {
  const { P, r, n, years } = compoundParams(l === 1 ? 2 : l);
  const nn = n === 1 ? 2 : n;
  const A2 = P * (1 + r / 100 / nn) ** (nn * years);
  const wrong = [
    P + (P * r * years) / 100,
    P * (1 + r / 100) ** (nn * years),
    P * (1 + r / 100 / nn) ** years,
    P * (1 + (r / 100) * nn) ** years,
  ];
  return mc(
    `What is the final amount when ${money(P)} earns ${r}% per year compounded ${freqName(nn)} for ${years} years?`,
    money(A2),
    wrong.map(money),
    "Use A = P(1 + r/n)^(nt). Divide the annual rate by the number of compounding periods per year n, and multiply the years by n for the exponent.",
  );
};

const compoundInterestEarned: Gen = (l) => {
  const { P, r, n, years, A } = compoundParams(l);
  const I = A - P;
  if (!clearWhole(I)) return compoundAmount(l);
  return typed(
    `How much interest is earned when ${money(P)} is invested at ${r}% per year compounded ${freqName(n)} for ${years} years? (nearest dollar)`,
    Math.round(I),
    "Find the final amount A = P(1 + r/n)^(nt), then subtract the principal to get the interest.",
  );
};

const compareSimpleCompound: Gen = () => {
  for (let t = 0; t < 100; t++) {
    const P = pick([1000, 2000, 3000, 5000]);
    const r = pick([4, 5, 6, 8]);
    const years = pick([5, 8, 10]);
    const simple = (P * r * years) / 100;
    const comp = P * (1 + r / 100) ** years - P;
    const diff = comp - simple;
    if (!clearWhole(diff)) continue;
    const d = Math.round(diff);
    return mc(
      `${money(P)} is invested for ${years} years at ${r}% per year. Option 1 pays simple interest. Option 2 compounds annually. Which earns more, and by about how much?`,
      `Option 2 earns about $${grp(d)} more`,
      [`Option 1 earns about $${grp(d)} more`, "They earn exactly the same", `Option 2 earns about $${grp(Math.round(simple))} more`, `Option 1 earns about $${grp(Math.round(comp))} more`],
      "Find the interest each way: simple I = Prt; compound interest = P(1 + r)^t − P. Then subtract.",
    );
  }
  return mc("Which grows faster over a long time: simple or compound interest at the same rate?", "Compound interest", ["Simple interest", "They grow at exactly the same rate"], "Compound interest earns interest on interest.");
};

const frequencyConcept: Gen = () => {
  const most = chance(0.5);
  return mc(
    `Same principal, rate and time. Which compounding schedule ends with the ${most ? "largest" : "smallest"} amount?`,
    most ? "Daily" : "Annually",
    most ? ["Annually", "Semi-annually", "Quarterly", "Monthly"] : ["Semi-annually", "Quarterly", "Monthly", "Daily"],
    "More frequent compounding means interest is added to the balance more often, so it starts earning interest sooner. The effect is small but real.",
  );
};

const rule72: Gen = () => {
  const r = pick([2, 3, 4, 6, 8, 9, 12]);
  return typed(
    `Use the Rule of 72 to estimate how many years it takes money to double at ${r}% interest compounded annually.`,
    72 / r,
    `Divide 72 by the interest rate: 72 ÷ ${r}. It is a quick estimate, not an exact answer.`,
    { suffix: "years" },
  );
};

const loanPayment: Gen = () => {
  for (let t = 0; t < 200; t++) {
    const P = pick([1200, 1800, 2400, 3000, 3600, 4800, 6000]);
    const r = pick([4, 5, 6, 8, 10]);
    const years = pick([1, 2, 3]);
    const total = P + (P * r * years) / 100;
    const pay = total / (12 * years);
    if (exact2(pay)) {
      return typedMoney(
        `${pick(NAMES)} borrows ${money(P)} at ${r}% simple interest per year for ${years} year${years > 1 ? "s" : ""} and repays it in equal monthly payments. How much is each payment? (dollars)`,
        pay,
        `Total repaid = P + Prt = ${P} + ${P} × ${r / 100} × ${years}. Divide by the number of months, ${12 * years}.`,
      );
    }
  }
  return typedMoney("A $2 400 loan at 5% simple interest for 2 years is repaid monthly. How much is each payment? (dollars)", 110, "Total = 2400 + 240 = 2640; divide by 24.");
};

const creditCard: Gen = () => {
  const B = pick([400, 500, 800, 1000, 1200, 1500]);
  const monthly = pick([1, 1.5, 2]);
  const I = (B * monthly) / 100;
  return typedMoney(
    `A credit card charges ${monthly * 12}% per year, which is ${monthly}% per month. The balance is ${money(B)} and nothing is paid this month. How much interest is added for the month? (dollars)`,
    I,
    `Use the monthly rate: ${B} × ${monthly / 100}. The annual rate divided by 12 gives the monthly rate.`,
  );
};

const conceptBank: Gen = () => {
  const bank = [
    { p: "In the formula I = Prt, what does P represent?", r: "The principal: the amount borrowed or invested", w: ["The percentage of interest", "The total after interest", "The payment each month"] },
    { p: "Two loans have the same rate, but one has a longer term. With simple interest, which statement is true?", r: "The longer loan costs more interest in total", w: ["The longer loan costs less interest in total", "Both cost the same total interest", "The term does not affect the interest"] },
    { p: "Which describes the difference between simple and compound interest?", r: "Compound interest is also paid on previously earned interest", w: ["Simple interest is always a higher rate", "Compound interest is only for loans, not savings", "Simple interest is paid on interest only"] },
    { p: "Which action usually costs the most if you carry a credit card balance?", r: "Paying only the minimum, so interest keeps building", w: ["Paying the full balance by the due date", "Paying more than the minimum", "Paying early in the month"] },
    { p: "Which is a fixed expense in a monthly budget?", r: "Rent that is the same every month", w: ["Groceries, which change from week to week", "Entertainment spending", "Clothes shopping"] },
    { p: "A savings account advertises 3% interest compounded monthly. Why does it grow slightly faster than 3% compounded yearly?", r: "Interest is added more often, so it earns interest sooner", w: ["The bank adds an extra fee", "The rate secretly changes each month", "Monthly months are longer"] },
  ];
  const it = pick(bank);
  return mc(it.p, it.r, it.w, "Think about what each quantity in the formula or situation means, then eliminate the answers that don't fit.");
};

const financeUnit = (o?: GenerateOptions) =>
  build([siInterest, siTotal, siRate, siTime, siPrincipal, siMonths, compoundAmount, compoundChoice, compoundInterestEarned, compareSimpleCompound, frequencyConcept, rule72, loanPayment, creditCard, conceptBank], levelOf(o));

// ---------- Course ----------

export const course: Course = {
  grade: "10",
  subject: "math",
  bigIdeas: {
    "ca-bc": [
      "Algebraic and numeric thinking: exponent laws extend to rational exponents, and irrational numbers and radicals extend our number system.",
      "Polynomial expressions can be multiplied and factored, and these skills are used to simplify expressions and to solve problems.",
      "Functions and relations describe how one quantity depends on another, and linear functions can be represented as graphs, tables, equations and in words.",
      "Linear relations have a constant rate of change; their equations can be written in several forms, and systems of linear equations model situations with two conditions.",
      "Arithmetic sequences and series model situations with a constant additive change.",
      "Trigonometric ratios let us find unknown sides and angles in right triangles and solve real-world problems.",
      "Financial literacy: interest, borrowing and saving can be modelled mathematically so that we can make informed decisions.",
    ],
  },
  units: [
    {
      id: "roots-radicals",
      title: "Roots & Radicals",
      emoji: "🧮",
      blurb: "Rational, irrational and radicals",
      parentNote:
        "Classifying rational and irrational numbers, estimating and ordering square roots, and simplifying, adding and multiplying radicals. This course is Foundations of Mathematics and Pre-calculus 10, the academic pathway toward Pre-calculus 11/12. Workplace Mathematics 10 follows a different pathway with a more applied focus.",
      standards: { "ca-bc": "Number: irrational numbers, square and cube roots, operations on radicals (entire and mixed radicals)" },
      generate: radicalsUnit,
    },
    {
      id: "exponent-laws",
      title: "Exponent Laws",
      emoji: "⚡",
      blurb: "Powers, zero, negative, rational",
      parentNote: "The exponent laws for products, quotients and powers, zero and negative exponents, and rational exponents such as 8^(2/3), plus growth and decay contexts.",
      standards: { "ca-bc": "Number: powers with integral and rational exponents; exponent laws" },
      generate: exponentsUnit,
    },
    {
      id: "primes-gcf-lcm",
      title: "Primes, GCF & LCM",
      emoji: "🔢",
      blurb: "Factor numbers like a pro",
      parentNote: "Prime factorization, greatest common factor, lowest common multiple, perfect squares and cubes, and using them to solve everyday sharing and scheduling problems.",
      standards: { "ca-bc": "Number: prime factorization; greatest common factor, lowest common multiple, perfect squares and perfect cubes" },
      generate: factorsUnit,
    },
    {
      id: "polynomials",
      title: "Polynomials",
      emoji: "🧩",
      blurb: "Expand it, factor it",
      parentNote:
        "Adding, subtracting and multiplying polynomials, then factoring: common factors, trinomials, differences of squares and trinomials with a leading coefficient. Checking by expanding is encouraged.",
      standards: { "ca-bc": "Algebra: multiplication of polynomial expressions (to a maximum of two binomials); common factors and trinomial factoring, including difference of squares" },
      generate: polynomialsUnit,
    },
    {
      id: "relations-functions",
      title: "Relations & Functions",
      emoji: "🔁",
      blurb: "Inputs, outputs and graphs",
      parentNote: "Telling functions from other relations, domain and range, function notation, and reading information from graphs, tables and contexts.",
      standards: { "ca-bc": "Relations and functions: domain and range, function notation, graphs, tables and contexts" },
      generate: functionsUnit,
    },
    {
      id: "linear-equations",
      title: "Lines & Slope",
      emoji: "📈",
      blurb: "Slope, intercepts and equations",
      parentNote: "Slope and rate of change, equations of lines in slope–intercept, point–slope and general form, intercepts, and parallel and perpendicular lines.",
      standards: { "ca-bc": "Linear functions: slope, rate of change, intercepts and equations of lines in slope–intercept, point–slope and general form; parallel and perpendicular lines" },
      generate: linesUnit,
    },
    {
      id: "arithmetic-sequences",
      title: "Arithmetic Sequences",
      emoji: "🧱",
      blurb: "Patterns that grow by steps",
      parentNote: "Common difference, the general term t(n) = a + (n − 1)d, finding the number of terms, and summing an arithmetic series.",
      standards: { "ca-bc": "Algebra: arithmetic sequences and series: general term and sum" },
      generate: sequencesUnit,
    },
    {
      id: "linear-systems",
      title: "Systems of Equations",
      emoji: "⚖️",
      blurb: "Two equations, one solution",
      parentNote: "Solving systems of two linear equations by graphing, substitution and elimination, deciding how many solutions there are, and solving word problems.",
      standards: { "ca-bc": "Algebra: systems of linear equations in two variables, solved graphically, by substitution and by elimination" },
      generate: systemsUnit,
    },
    {
      id: "right-triangle-trig",
      title: "Right-Triangle Trig",
      emoji: "📐",
      blurb: "Sine, cosine and tangent",
      parentNote: "The primary trigonometric ratios, solving for unknown sides and angles in right triangles, and applications such as angles of elevation and depression.",
      standards: { "ca-bc": "Geometry and measurement: primary trigonometric ratios; solving right triangles; angles of elevation and depression" },
      generate: trigUnit,
    },
    {
      id: "financial-literacy",
      title: "Interest & Loans",
      emoji: "💰",
      blurb: "Saving, borrowing and interest",
      parentNote: "Simple interest, compound interest, comparing the two, the Rule of 72, simple loans and credit-card interest. Real decisions about money use these ideas.",
      standards: { "ca-bc": "Financial literacy: simple and compound interest, and the cost of borrowing" },
      generate: financeUnit,
    },
  ],
};
