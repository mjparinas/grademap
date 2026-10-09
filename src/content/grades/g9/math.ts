import { sortQuestion } from "../../bank";
import { chance, pick, randInt, sample, shuffle, textChoice } from "../../random";
import type { ChoiceQuestion, Course, GenerateOptions, InputQuestion, Question, Visual } from "../../types";

// Grade 9 maths for the "big" age band. Every answer is computed in code from the same
// numbers that appear in the prompt. Exact decimals are built from whole-number units
// (tenths, hundredths, cents) so floating-point noise never reaches a student.
// Negative numbers inside typed or checked labels use "-" (so keypads and tests can read
// them); "−" is used for subtraction and in displayed algebra.

type Level = 1 | 2 | 3;
const levelOf = (opts?: GenerateOptions): Level => opts?.difficulty ?? 2;

const NAMES = ["Maya", "Jay", "Sam", "Amir", "Lena", "Kenji", "Zoe", "Ravi", "Ana", "Noah", "Priya", "Leo"];

// ---------- Shared helpers ----------

function fmt(x: number): string {
  const v = Number(x.toFixed(6));
  return String(v === 0 ? 0 : v);
}
/** A number inside an expression: negatives get brackets, e.g. 5 − (-3). */
function br(x: number): string {
  return x < 0 ? `(${fmt(x)})` : fmt(x);
}
/** Display a number with a true minus sign. */
function num(x: number): string {
  return x < 0 ? `−${fmt(-x)}` : fmt(x);
}
function roundTo(x: number, dp: number): number {
  const f = 10 ** dp;
  return Math.round(x * f + 1e-7) / f;
}
function signed(min: number, max: number): number {
  const n = randInt(min, max);
  return chance(0.5) ? -n : n;
}
function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}
const plural = (n: number, word: string): string => `${n} ${word}${Math.abs(n) === 1 ? "" : "s"}`;

const SUP: Record<string, string> = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻" };
const sup = (n: number): string => String(n).split("").map((c) => SUP[c]).join("");
/** A power of a variable: pw("x", 1) → "x", pw("x", 3) → "x³", pw("x", 0) → "1". */
const pw = (base: string, e: number): string => (e === 0 ? "1" : e === 1 ? base : `${base}${sup(e)}`);

/** Group digits in threes with spaces (Canadian style) for numbers with 5 or more digits. */
function groupDigits(s: string, fromLeft = false): string {
  if (s.length < 5) return s;
  if (fromLeft) return s.replace(/(\d{3})(?=\d)/g, "$1 ");
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
/** Standard-form text for m × 10^k (m a whole number), with Canadian spacing. */
function standardForm(m: number, k: number): string {
  const s = String(m);
  if (k >= 0) return groupDigits(s + "0".repeat(k));
  const len = s.length;
  if (-k < len) return `${groupDigits(s.slice(0, len + k))}.${groupDigits(s.slice(len + k), true)}`;
  return `0.${groupDigits("0".repeat(-k - len) + s, true)}`;
}
/** The same, with no spaces, for a typed answer. */
const plainForm = (m: number, k: number): string => standardForm(m, k).replace(/ /g, "");

/** Multiple choice from strings; wrong answers that match the right one (or repeat) are dropped. */
function mc(prompt: string, right: string, wrong: string[], hint: string, visual?: Visual, max = 3): ChoiceQuestion {
  const uniq = [...new Set(wrong.filter((w) => w !== right))];
  if (uniq.length < 2) throw new Error(`Too few distractors for: ${prompt}`);
  return textChoice(prompt, right, sample(uniq, Math.min(max, uniq.length)), hint, visual);
}

interface NumOpts {
  unit?: string;
  format?: (n: number) => string;
  step?: number;
  min?: number;
  count?: number;
}
/** Multiple choice with number answers; gaps are filled with nearby values. */
function numQ(prompt: string, answer: number, wrong: number[], hint: string, visual?: Visual, opts: NumOpts = {}): ChoiceQuestion {
  const { unit = "", format = fmt, step = 1, min = -Infinity, count = 4 } = opts;
  const label = (n: number) => `${format(n)}${unit}`;
  const right = label(answer);
  const used = new Set([right]);
  const out: string[] = [];
  const tryAdd = (n: number) => {
    if (out.length >= count - 1 || !Number.isFinite(n) || n < min) return;
    const l = label(Number(n.toFixed(6)));
    if (!used.has(l)) {
      used.add(l);
      out.push(l);
    }
  };
  wrong.forEach(tryAdd);
  for (let k = 1; out.length < count - 1 && k < 200; k++) {
    tryAdd(answer + k * step);
    tryAdd(answer - k * step);
  }
  return textChoice(prompt, right, out, hint, visual);
}

function typed(
  prompt: string,
  answer: string,
  hint: string,
  keypad: NonNullable<InputQuestion["keypad"]>,
  extra: { accept?: string[]; suffix?: string; visual?: Visual } = {},
): InputQuestion {
  const q: InputQuestion = { kind: "input", prompt, hint, answer, keypad };
  const accept = [...new Set(extra.accept ?? [])].filter((a) => a !== answer);
  if (accept.length) q.accept = accept;
  if (extra.suffix) q.suffix = extra.suffix;
  if (extra.visual) q.visual = extra.visual;
  return q;
}

/** Dollars-and-cents answer text, plus the shorter forms a student might type. */
function moneyAnswer(cents: number): { answer: string; accept: string[] } {
  const answer = (cents / 100).toFixed(2);
  const accept: string[] = [];
  if (cents % 100 === 0) accept.push(String(cents / 100));
  else if (cents % 10 === 0) accept.push((cents / 100).toFixed(1));
  return { answer, accept };
}
/** Whole dollars → "$12 500". */
const dollarsText = (d: number): string => `$${groupDigits(String(d))}`;
/** Cents → "$12.50" (always two decimals). */
const exactMoney = (cents: number): string => `$${groupDigits(Math.trunc(cents / 100).toString())}.${String(cents % 100).padStart(2, "0")}`;

/** A question generator that only appears from a certain level up. */
interface Maker {
  min: Level;
  fn: (lv: Level) => Question;
}
const mk = (fn: (lv: Level) => Question, min: Level = 1): Maker => ({ min, fn });

/** Build a set of questions from makers: every maker is tried once before any repeats. */
function gen(makers: Maker[], opts?: GenerateOptions, count = 8): Question[] {
  const lv = levelOf(opts);
  const pool = makers.filter((m) => m.min <= lv);
  const out: Question[] = [];
  const seen = new Set<string>();
  let queue: Maker[] = [];
  for (let tries = 0; out.length < count && tries < 300; tries++) {
    if (!queue.length) queue = shuffle(pool);
    const q = queue.pop()!.fn(lv);
    const key = q.prompt + JSON.stringify(q.visual ?? "");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }
  return out;
}

// ---------- Rational numbers ----------

interface R {
  n: number;
  d: number;
}
function rat(n: number, d = 1): R {
  if (d < 0) {
    n = -n;
    d = -d;
  }
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
}
const radd = (a: R, b: R): R => rat(a.n * b.d + b.n * a.d, a.d * b.d);
const rsub = (a: R, b: R): R => rat(a.n * b.d - b.n * a.d, a.d * b.d);
const rmul = (a: R, b: R): R => rat(a.n * b.n, a.d * b.d);
const rdiv = (a: R, b: R): R => rat(a.n * b.d, a.d * b.n);
/** "-3/4", "5" (ASCII minus). */
const rs = (r: R): string => (r.d === 1 ? String(r.n) : `${r.n}/${r.d}`);
/** Fraction text inside an expression: always bracketed unless it's a plain non-negative whole number. */
const rw = (r: R): string => (r.d === 1 ? br(r.n) : `(${rs(r)})`);
const rv = (r: R): number => r.n / r.d;

/** Forms of the same fraction a student might type, e.g. 3/4 → 6/8, 9/12. */
function equivalents(r: R): string[] {
  const out: string[] = [];
  for (const k of [2, 3]) {
    const t = `${r.n * k}/${r.d * k}`;
    if (t.length <= 9) out.push(t);
  }
  return out;
}

function randFrac(dens: number[], maxWhole = 1, neg = false): R {
  const d = pick(dens);
  let n = randInt(1, d * maxWhole - 1);
  if (n % d === 0) n += 1;
  return rat(chance(neg ? 0.5 : 0) ? -n : n, d);
}

/** Multiple choice for a fraction answer, with distractors and filler. */
function fracQ(prompt: string, ans: R, wrong: R[], hint: string, visual?: Visual): ChoiceQuestion {
  const right = rs(ans);
  const labels: string[] = [];
  const add = (r: R) => {
    const l = rs(r);
    if (l !== right && !labels.includes(l) && l.length <= 9) labels.push(l);
  };
  wrong.forEach(add);
  for (let k = 1; labels.length < 3 && k < 12; k++) {
    add(rat(ans.n + k, ans.d));
    add(rat(ans.n, ans.d + k));
  }
  return textChoice(prompt, right, labels.slice(0, 3), hint, visual);
}

function fracInput(prompt: string, ans: R, hint: string, visual?: Visual): InputQuestion {
  return typed(prompt, rs(ans), hint, "fraction", { accept: ans.d === 1 ? [] : equivalents(ans), visual });
}

function fractionAddSub(lv: Level): Question {
  const pairs: [number[], number[]][] =
    lv === 1
      ? [[[2, 4], [2, 4]], [[3, 6], [3, 6]], [[5, 10], [5, 10]], [[4, 8], [4, 8]], [[3], [3]], [[5], [5]]]
      : lv === 2
        ? [[[2, 3, 4, 5, 6], [2, 3, 4, 5, 6]], [[3, 4, 6, 8], [3, 4, 6, 8]], [[5, 10, 4], [10, 5, 4]]]
        : [[[3, 4, 5, 6, 7, 8, 9], [3, 4, 5, 6, 7, 8, 9]], [[6, 8, 10, 12], [4, 9, 15]]];
  const [da, db] = pick(pairs);
  let a = randFrac(da, lv === 3 ? 2 : 1, lv >= 2);
  let b = randFrac(db, 1, lv >= 2);
  const op = chance(0.5) ? "+" : "−";
  if (lv === 1 && op === "−" && rv(a) < rv(b)) [a, b] = [b, a];
  const ans = op === "+" ? radd(a, b) : rsub(a, b);
  const visual: Visual = { type: "equation", text: `${rw(a)} ${op} ${rw(b)} = ?` };
  const hint = `Rewrite both fractions with a common denominator (${(a.d * b.d) / gcd(a.d, b.d)} works), ${op === "+" ? "add" : "subtract"} the numerators and keep the denominator, then simplify. The answer is ${rs(ans)}.`;
  if (chance(0.5)) return fracInput("Calculate. Give your answer as a fraction in lowest terms.", ans, hint, visual);
  const wrong = [
    rat(op === "+" ? a.n + b.n : a.n - b.n, a.d + b.d),
    op === "+" ? rsub(a, b) : radd(a, b),
    rat(-ans.n, ans.d),
    rat(a.n * b.n, a.d * b.d),
  ];
  return fracQ("Calculate.", ans, wrong, hint, visual);
}

function fractionMulDiv(lv: Level): Question {
  const dens = lv === 1 ? [2, 3, 4, 5] : [2, 3, 4, 5, 6, 8, 9, 10];
  const a = randFrac(dens, lv === 3 ? 2 : 1, lv >= 2);
  const b = randFrac(dens, 1, lv >= 2);
  const mult = chance(0.5);
  const ans = mult ? rmul(a, b) : rdiv(a, b);
  const visual: Visual = { type: "equation", text: `${rw(a)} ${mult ? "×" : "÷"} ${rw(b)} = ?` };
  const hint = mult
    ? `Multiply the numerators, multiply the denominators, then simplify. Watch the signs: different signs give a negative. The answer is ${rs(ans)}.`
    : `Dividing by a fraction means multiplying by its reciprocal: ${rs(a)} × ${b.n < 0 ? `${-b.d}/${-b.n}` : `${b.d}/${b.n}`}. The answer is ${rs(ans)}.`;
  if (chance(0.5)) return fracInput("Calculate. Give your answer as a fraction in lowest terms.", ans, hint, visual);
  const wrong = [
    mult ? rdiv(a, b) : rmul(a, b),
    rat(-ans.n, ans.d),
    mult ? radd(a, b) : rdiv(b, a),
    rat(ans.d, ans.n),
  ];
  return fracQ("Calculate.", ans, wrong, hint, visual);
}

function decimalOps(lv: Level): Question {
  const op = pick(lv === 1 ? ["+", "−"] : ["+", "−", "×", "÷"]);
  const t = (max: number) => (lv === 1 ? randInt(1, max) : signed(1, max)); // tenths
  let aT = t(lv === 3 ? 99 : 59);
  let bT = t(lv === 3 ? 99 : 59);
  if (lv === 1 && op === "−" && aT < bT) [aT, bT] = [bT, aT];
  let text: string;
  let ansH: number; // answer in hundredths
  let hint: string;
  const a = aT / 10;
  const b = bT / 10;
  if (op === "+" || op === "−") {
    ansH = (op === "+" ? aT + bT : aT - bT) * 10;
    text = `${fmt(a)} ${op} ${br(b)}`;
    hint = `Line up the decimal points. ${op === "−" && b < 0 ? "Subtracting a negative is the same as adding its positive. " : ""}${fmt(a)} ${op} ${br(b)} = ${fmt(ansH / 100)}.`;
  } else if (op === "×") {
    ansH = aT * bT;
    text = `${fmt(a)} × ${br(b)}`;
    hint = `Multiply ${Math.abs(aT)} × ${Math.abs(bT)} = ${Math.abs(ansH)}, then place the decimal (two places in total). Different signs give a negative answer. The answer is ${fmt(ansH / 100)}.`;
  } else {
    // build a ÷ b with an exact quotient
    const qT = t(30);
    const aH = bT * qT;
    ansH = qT * 10;
    text = `${fmt(aH / 100)} ÷ ${br(b)}`;
    hint = `Multiply both numbers by 10 to clear the decimal in ${fmt(b)}: ${fmt(aH / 10)} ÷ ${fmt(bT)} = ${fmt(qT)}. Signs: same signs give positive, different signs give negative. The answer is ${fmt(ansH / 100)}.`;
  }
  const ans = ansH / 100;
  const visual: Visual = { type: "equation", text: `${text} = ?` };
  if (chance(0.5)) return typed("Calculate.", fmt(ans), hint, "decimal", { visual });
  return numQ("Calculate.", ans, [-ans, ans * 10, ans / 10, ans + 0.1], hint, visual, { step: 0.1 });
}

function orderOfOps(lv: Level): Question {
  const kind = randInt(1, lv === 1 ? 3 : lv === 2 ? 4 : 6);
  let text: string;
  let value: number;
  let steps: string;
  if (kind === 1) {
    const a = signed(1, 9);
    const b = randInt(2, 9);
    const c = signed(1, 9);
    const d = signed(1, 9);
    value = a + b * (c - d);
    text = `${fmt(a)} + ${b} × (${fmt(c)} − ${br(d)})`;
    steps = `Brackets first: ${fmt(c)} − ${br(d)} = ${c - d}. Then multiply: ${b} × ${c - d} = ${b * (c - d)}. Then add ${fmt(a)}.`;
  } else if (kind === 2) {
    const e = pick([2, 3, 4, 5]);
    const d = e * randInt(1, 6);
    const a = randInt(1, 9);
    const b = randInt(1, 9);
    const c = randInt(2, 6);
    value = (a + b) * c - d / e;
    text = `(${a} + ${b}) × ${c} − ${d} ÷ ${e}`;
    steps = `Brackets: ${a + b}. Then multiply and divide before subtracting: ${a + b} × ${c} = ${(a + b) * c} and ${d} ÷ ${e} = ${d / e}.`;
  } else if (kind === 3) {
    const a = randInt(10, 30);
    const b = randInt(2, 6);
    const c = signed(1, 6);
    value = a - b * c;
    text = `${a} − ${b} × ${br(c)}`;
    steps = `Multiply before subtracting: ${b} × ${br(c)} = ${b * c}. Then ${a} − ${br(b * c)} = ${value}.`;
  } else if (kind === 4) {
    const a = signed(1, 9);
    const b = randInt(2, 6);
    const c = randInt(2, 6);
    const d = randInt(1, 5);
    value = a + b * (c + d) ** 2 - 0;
    text = `${fmt(a)} + ${b} × (${c} + ${d})²`;
    steps = `Brackets: ${c + d}. Exponent: ${c + d}² = ${(c + d) ** 2}. Multiply: ${b} × ${(c + d) ** 2}. Then add ${fmt(a)}.`;
  } else if (kind === 5) {
    const a = randInt(10, 20);
    const b = randInt(1, 8);
    const c = randInt(1, 8);
    const d = signed(2, 6);
    value = (a - (b + c)) * d;
    text = `(${a} − (${b} + ${c})) × ${br(d)}`;
    steps = `Work from the inside out: ${b} + ${c} = ${b + c}, then ${a} − ${b + c} = ${a - b - c}, then multiply by ${br(d)}.`;
  } else {
    // with fractions
    const a = randFrac([2, 3, 4], 1, true);
    const b = randFrac([2, 3, 4, 5], 1, false);
    const c = rat(randInt(2, 6), pick([1, 1, 2, 3]));
    const ans = radd(a, rmul(b, c));
    return fracInput(
      "Calculate. Multiply before you add. Give a fraction in lowest terms.",
      ans,
      `Multiply first: ${rs(b)} × ${rs(c)} = ${rs(rmul(b, c))}. Then add ${rs(a)}: ${rs(ans)}.`,
      { type: "equation", text: `${rw(a)} + ${rw(b)} × ${rw(c)} = ?` },
    );
  }
  return typed("Calculate, following the order of operations.", fmt(value), `${steps} The answer is ${value}.`, "integer", {
    visual: { type: "equation", text: `${text} = ?` },
  });
}

function orderRationals(lv: Level): Question {
  const pool: { v: number; label: string }[] = [];
  const fr: [number, number][] = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [1, 3], [2, 3], [5, 8], [7, 8], [1, 8], [3, 10]];
  const dec = [0.1, 0.25, 0.3, 0.45, 0.6, 0.75, 0.9, 1.2, 1.5, 0.05, 0.8, 0.35];
  const negOk = lv >= 2;
  for (const [n, d] of fr) {
    pool.push({ v: n / d, label: `${n}/${d}` });
    if (negOk) pool.push({ v: -n / d, label: `-${n}/${d}` });
  }
  for (const x of dec) {
    pool.push({ v: x, label: fmt(x) });
    if (negOk) pool.push({ v: -x, label: fmt(-x) });
  }
  let picked: { v: number; label: string }[] = [];
  for (let t = 0; t < 50; t++) {
    picked = sample(pool, lv === 3 ? 5 : 4);
    const vs = picked.map((p) => p.v).sort((a, b) => a - b);
    if (vs.every((v, i) => i === 0 || v - vs[i - 1] > 0.02)) break;
  }
  const ordered = [...picked].sort((a, b) => a.v - b.v);
  return {
    kind: "order",
    prompt: "Put these numbers in order from least to greatest.",
    hint: "Turn each number into a decimal to compare. Negatives sit left of zero, and a negative with a bigger size is smaller (−0.75 is less than −0.5).",
    items: ordered.map((p, i) => ({ id: `r${i}`, label: p.label })),
  };
}

function betweenRationals(lv: Level): Question {
  const sets: [R, R, R, R[]][] = [
    [rat(-3, 4), rat(-1, 2), rat(-5, 8), [rat(-1, 1), rat(-1, 4), rat(0), rat(-7, 8)]],
    [rat(1, 3), rat(1, 2), rat(2, 5), [rat(1, 4), rat(3, 5), rat(2, 3), rat(1, 5)]],
    [rat(-1, 2), rat(1, 4), rat(0), [rat(-3, 4), rat(1, 2), rat(-5, 8), rat(3, 8)]],
    [rat(-2, 3), rat(-1, 3), rat(-1, 2), [rat(-5, 6), rat(0), rat(-1, 4), rat(-3, 4)]],
    [rat(3, 5), rat(4, 5), rat(7, 10), [rat(1, 2), rat(9, 10), rat(1, 1), rat(11, 20)]],
  ];
  const [lo, hi, mid, outside] = pick(sets);
  const scale = lv === 3 ? 1 : 1;
  void scale;
  return mc(
    `Which number is between ${rs(lo)} and ${rs(hi)}?`,
    rs(mid),
    outside.map(rs),
    `Convert to decimals: ${rs(lo)} ≈ ${fmt(roundTo(rv(lo), 3))} and ${rs(hi)} ≈ ${fmt(roundTo(rv(hi), 3))}. The answer must sit strictly between them on the number line.`,
  );
}

function rationalWord(lv: Level): Question {
  const kind = randInt(1, 3);
  if (kind === 1) {
    const t0 = signed(1, 9) / 2;
    const dropH = randInt(1, 4) * 25; // hundredths per hour
    const hours = randInt(2, 6);
    const endH = Math.round(t0 * 100) - dropH * hours;
    return typed(
      `At 6 p.m. the temperature is ${num(t0)}°C. It changes by −${fmt(dropH / 100)}°C each hour. What is the temperature ${plural(hours, "hour")} later?`,
      fmt(endH / 100),
      `Multiply the hourly change by ${hours}: ${hours} × (−${fmt(dropH / 100)}) = ${fmt(-(dropH * hours) / 100)}. Add to ${fmt(t0)}: ${fmt(endH / 100)}.`,
      "decimal",
      { suffix: "°C" },
    );
  }
  if (kind === 2) {
    const name = pick(NAMES);
    const balC = randInt(20, 90) * 100;
    const payC = randInt(1, 12) * 500 + (lv > 1 ? 250 : 0);
    const n = randInt(2, 5);
    const end = balC - payC * n;
    return typed(
      `${name}'s account balance is $${(balC / 100).toFixed(2)}. Each week a $${(payC / 100).toFixed(2)} payment comes out. What is the balance after ${n} weeks? (A negative balance means money owed.)`,
      (end / 100).toFixed(2),
      `Total payments: ${n} × ${(payC / 100).toFixed(2)} = ${((payC * n) / 100).toFixed(2)}. Balance = ${(balC / 100).toFixed(2)} − ${((payC * n) / 100).toFixed(2)} = ${(end / 100).toFixed(2)}.`,
      "decimal",
    );
  }
  const a = rat(randInt(1, 3), pick([2, 3, 4]));
  const b = rat(randInt(1, 2), pick([2, 3, 5]));
  const total = rat(randInt(6, 12), 1);
  const used = rmul(a, total);
  const ans = rsub(total, used);
  void b;
  return fracInput(
    `A ${total.n} m board is cut. A piece ${rs(a)} of the board's length is removed. How many metres are left? (Fraction in lowest terms.)`,
    ans,
    `Piece removed: ${rs(a)} × ${total.n} = ${rs(used)} m. Left over: ${total.n} − ${rs(used)} = ${rs(ans)} m.`,
  );
}

function rationalNumbers(opts?: GenerateOptions): Question[] {
  return gen(
    [
      mk(fractionAddSub),
      mk(fractionAddSub),
      mk(fractionMulDiv),
      mk(decimalOps),
      mk(decimalOps),
      mk(orderOfOps),
      mk(orderOfOps),
      mk(orderRationals),
      mk(betweenRationals),
      mk(rationalWord),
    ],
    opts,
  );
}

// ---------- Exponent laws ----------

const VARS = ["x", "y", "a", "m", "t", "k"];

function productLaw(lv: Level): Question {
  if (lv >= 2 && chance(0.6)) {
    const v = pick(VARS);
    const a = randInt(2, 7);
    const b = randInt(2, 7);
    const c = randInt(2, 6);
    const d = randInt(2, 5);
    return mc(
      "Simplify.",
      `${c * d}${pw(v, a + b)}`,
      [`${c * d}${pw(v, a * b)}`, `${c + d}${pw(v, a + b)}`, `${c * d}${pw(v, a + b + 1)}`, `${c + d}${pw(v, a * b)}`, `${c * d}${pw(v, a + b - 1)}`],
      `Multiply the coefficients (${c} × ${d} = ${c * d}) and add the exponents of the same base (${a} + ${b} = ${a + b}).`,
      { type: "equation", text: `(${c}${pw(v, a)})(${d}${pw(v, b)})` },
    );
  }
  if (chance(0.4)) {
    const base = randInt(2, 7);
    const a = randInt(2, 6);
    const b = randInt(2, 6);
    return mc(
      "Write as a single power.",
      `${base}${sup(a + b)}`,
      [`${base * base}${sup(a + b)}`, `${base}${sup(a * b)}`, `${base * base}${sup(a * b)}`, `${base}${sup(a + b + 1)}`, `${base}${sup(a + b - 1)}`],
      `Same base, so keep the base and add the exponents: ${a} + ${b} = ${a + b}. The bases are not multiplied together.`,
      { type: "equation", text: `${base}${sup(a)} × ${base}${sup(b)}` },
    );
  }
  const v = pick(VARS);
  const a = randInt(2, 8);
  const b = randInt(2, 8);
  return mc(
    "Simplify.",
    pw(v, a + b),
    [pw(v, a * b), pw(v, Math.abs(a - b) || a + b + 1), pw(v, a + b - 1), pw(v, a + b + 1)],
    `When you multiply powers with the same base, add the exponents: ${a} + ${b} = ${a + b}.`,
    { type: "equation", text: `${pw(v, a)} × ${pw(v, b)}` },
  );
}

function quotientLaw(lv: Level): Question {
  const v = pick(VARS);
  if (lv === 3 && chance(0.5)) {
    const a = randInt(2, 4);
    const b = a + randInt(1, 4);
    return mc(
      "Write with a positive exponent.",
      `1/${pw(v, b - a)}`,
      [pw(v, b - a), `−${pw(v, b - a)}`, `1/${pw(v, a + b)}`, pw(v, a + b)],
      `Subtract exponents: ${a} − ${b} = ${a - b}, so you get ${v}${sup(a - b)}. A negative exponent means reciprocal: ${v}${sup(a - b)} = 1/${pw(v, b - a)}.`,
      { type: "equation", text: `${pw(v, a)} ÷ ${pw(v, b)}` },
    );
  }
  if (lv >= 2 && chance(0.6)) {
    const b = randInt(2, 4);
    const q = randInt(2, 9);
    const c = b * q;
    const a = randInt(4, 9);
    const e = randInt(2, a - 1);
    return mc(
      "Simplify.",
      `${q}${pw(v, a - e)}`,
      [`${q}${pw(v, a + e)}`, `${q}${pw(v, Math.round(a / e))}`, `${c - b}${pw(v, a - e)}`, `${q}${pw(v, a * e)}`],
      `Divide the coefficients (${c} ÷ ${b} = ${q}) and subtract the exponents (${a} − ${e} = ${a - e}).`,
      { type: "equation", text: `${c}${pw(v, a)} ÷ ${b}${pw(v, e)}` },
    );
  }
  const a = randInt(4, 12);
  const b = randInt(2, a - 1);
  return mc(
    "Simplify.",
    pw(v, a - b),
    [pw(v, a + b), pw(v, b - a < 0 ? a * b : b - a), pw(v, a - b + 1), pw(v, Math.round(a / b) + 1)],
    `Same base: subtract the exponents, ${a} − ${b} = ${a - b}.`,
    { type: "equation", text: `${pw(v, a)} ÷ ${pw(v, b)}` },
  );
}

function powerOfPower(lv: Level): Question {
  const v = pick(VARS);
  if (lv >= 2 && chance(0.7)) {
    const c = randInt(2, 5);
    const a = randInt(2, 4);
    const b = randInt(2, 3);
    return mc(
      "Simplify.",
      `${c ** b}${pw(v, a * b)}`,
      [`${c * b}${pw(v, a * b)}`, `${c}${pw(v, a * b)}`, `${c ** b}${pw(v, a + b)}`, `${c * b}${pw(v, a + b)}`, `${c ** b}${pw(v, a * b + 1)}`, `${c ** b + 1}${pw(v, a * b)}`],
      `Raise every factor to the outside power: ${c}${sup(b)} = ${c ** b} and (${pw(v, a)})${sup(b)} = ${pw(v, a * b)}, because ${a} × ${b} = ${a * b}.`,
      { type: "equation", text: `(${c}${pw(v, a)})${sup(b)}` },
    );
  }
  const a = randInt(2, 6);
  const b = randInt(2, 5);
  return mc(
    "Simplify.",
    pw(v, a * b),
    [pw(v, a + b), pw(v, a ** b > 99 ? a * b + 2 : a ** b), pw(v, a * b - 1), pw(v, a * b + 1), pw(v, a * b + 2)],
    `A power raised to a power: multiply the exponents, ${a} × ${b} = ${a * b}.`,
    { type: "equation", text: `(${pw(v, a)})${sup(b)}` },
  );
}

function evalPower(lv: Level): Question {
  const k = randInt(1, lv === 1 ? 3 : 5);
  if (k === 1) {
    const base = randInt(2, lv === 1 ? 6 : 9);
    const e = randInt(2, base > 5 ? 3 : 5);
    return typed("Evaluate.", String(base ** e), `${base}${sup(e)} means ${base} multiplied by itself ${e} times: ${Array(e).fill(base).join(" × ")} = ${base ** e}.`, "number", {
      visual: { type: "equation", text: `${base}${sup(e)}` },
    });
  }
  if (k === 2) {
    const base = randInt(2, 99);
    return typed("Evaluate.", "1", `Any non-zero number raised to the power 0 equals 1. So ${base}⁰ = 1.`, "integer", {
      visual: { type: "equation", text: `${base}⁰` },
    });
  }
  if (k === 3) {
    const base = randInt(2, 6);
    const e = pick([2, 4]);
    const sign = chance(0.5);
    const right = sign ? base ** e : -(base ** e);
    return mc(
      "Evaluate.",
      fmt(right),
      [fmt(-right), fmt(base * e), fmt(-base * e), fmt(right * 2), fmt(Math.sign(right) * (base + 1) ** e)],
      sign
        ? `The brackets mean the exponent applies to −${base} itself: (−${base})${sup(e)} = ${base ** e} because an even number of negatives gives a positive.`
        : `Without brackets, the exponent applies only to ${base}: −${base}${sup(e)} = −(${base ** e}) = ${-(base ** e)}.`,
      { type: "equation", text: sign ? `(−${base})${sup(e)}` : `−${base}${sup(e)}` },
    );
  }
  if (k === 4) {
    const base = pick([2, 3, 4, 5, 6, 10]);
    const e = randInt(1, base === 10 ? 4 : 3);
    const denom = base ** e;
    if (base === 10) {
      return typed("Evaluate. Give a decimal.", fmt(1 / denom), `${base}${sup(-e)} = 1/${base}${sup(e)} = 1/${denom} = ${fmt(1 / denom)}.`, "decimal", {
        visual: { type: "equation", text: `10${sup(-e)}` },
      });
    }
    return typed("Evaluate. Give a fraction.", `1/${denom}`, `A negative exponent means reciprocal: ${base}${sup(-e)} = 1/${base}${sup(e)} = 1/${denom}.`, "fraction", {
      visual: { type: "equation", text: `${base}${sup(-e)}` },
    });
  }
  const n = randInt(1, 3);
  const d = pick([2, 3, 4, 5].filter((x) => gcd(x, n) === 1));
  const e = 2;
  return typed(
    "Evaluate. Give a fraction.",
    `${d ** e}/${n ** e}`,
    `A negative exponent flips the fraction: (${n}/${d})${sup(-e)} = (${d}/${n})${sup(e)} = ${d ** e}/${n ** e}.`,
    "fraction",
    { visual: { type: "equation", text: `(${n}/${d})${sup(-e)}` } },
  );
}

function sameBaseNumbers(): Question {
  const base = randInt(2, 6);
  const a = randInt(3, 7);
  const b = randInt(2, 5);
  const mul = chance(0.5);
  const right = mul ? `${base}${sup(a + b)}` : `${base}${sup(a - b)}`;
  const wrong = mul
    ? [`${base * base}${sup(a + b)}`, `${base}${sup(a * b)}`, `${base * base}${sup(a * b)}`]
    : [`1${sup(a - b)}`, `${base}${sup(a * b)}`, `${base}${sup(a + b)}`, `${base}${sup(a - b + 1)}`];
  const qs = mul ? `${base}${sup(a)} × ${base}${sup(b)}` : `${base}${sup(a)} ÷ ${base}${sup(b)}`;
  return mc(
    "Which expression is equal to the one shown?",
    right,
    wrong,
    mul ? "Keep the base and add the exponents. Never multiply the bases." : "Keep the base and subtract the exponents. Dividing powers never makes the base 1.",
    { type: "equation", text: qs },
  );
}

function negativeExponentRewrite(): Question {
  const v = pick(VARS);
  const e = randInt(2, 6);
  return mc(
    `Which expression is equal to ${v}${sup(-e)}?`,
    `1/${pw(v, e)}`,
    [pw(v, e), `−${pw(v, e)}`, `−${e}${v}`, `${v}/${e}`],
    `A negative exponent does not make the number negative. It means “take the reciprocal”: ${v}${sup(-e)} = 1/${v}${sup(e)}.`,
  );
}

function toSci(lv: Level): Question {
  const m = randInt(11, 99);
  const e = lv === 1 ? randInt(2, 6) : randInt(-6, 7);
  if (e === 0) return toSci(lv);
  const k = e - 1;
  const mant = `${Math.floor(m / 10)}.${m % 10}`;
  const sci = (x: number, mt = mant) => `${mt} × 10${sup(x)}`;
  if (k >= 8 || k <= -8) return toSci(lv);
  return mc(
    "Write in scientific notation (one non-zero digit before the decimal point).",
    sci(e),
    [sci(e + 1), sci(e - 1), sci(-e), `${m} × 10${sup(k)}`, `0.${m} × 10${sup(e + 1)}`],
    `Move the decimal point so exactly one non-zero digit is in front of it. Count the moves: large numbers give a positive exponent, numbers smaller than 1 give a negative exponent. Here the answer is ${sci(e)}.`,
    { type: "equation", text: standardForm(m, k) },
    4,
  );
}

function fromSci(lv: Level): Question {
  const m = randInt(11, 99);
  const e = lv === 1 ? randInt(2, 6) : randInt(-7, 6);
  if (e === 0) return fromSci(lv);
  const mant = `${Math.floor(m / 10)}.${m % 10}`;
  const k = e - 1;
  const plain = plainForm(m, k);
  if (plain.length > 9) return fromSci(lv);
  return typed(
    "Write in standard form (no spaces).",
    plain,
    e > 0
      ? `A positive exponent moves the decimal point ${e} places right: ${mant} → ${standardForm(m, k)}.`
      : `A negative exponent moves the decimal point ${-e} places left, filling with zeros: ${mant} → ${standardForm(m, k)}.`,
    e > 0 && k >= 0 ? "number" : "decimal",
    { visual: { type: "equation", text: `${mant} × 10${sup(e)}` } },
  );
}

function compareSci(): Question {
  for (let t = 0; t < 40; t++) {
    const items = Array.from({ length: 4 }, () => ({ m: randInt(11, 99), e: randInt(-5, 5) }));
    const val = (i: { m: number; e: number }) => i.m * 10 ** (i.e - 1);
    const sorted = [...items].sort((a, b) => val(a) - val(b));
    const distinct = sorted.every((s, i) => i === 0 || Math.abs(val(s) / val(sorted[i - 1]) - 1) > 0.03);
    const labels = items.map((i) => `${Math.floor(i.m / 10)}.${i.m % 10} × 10${sup(i.e)}`);
    if (!distinct || new Set(labels).size < 4) continue;
    const big = chance(0.5);
    const target = big ? sorted[3] : sorted[0];
    return mc(
      `Which number is the ${big ? "greatest" : "least"}?`,
      `${Math.floor(target.m / 10)}.${target.m % 10} × 10${sup(target.e)}`,
      items.filter((i) => i !== target).map((i) => `${Math.floor(i.m / 10)}.${i.m % 10} × 10${sup(i.e)}`),
      "Compare the exponents of 10 first: a bigger exponent means a bigger number. Only compare the front numbers when the exponents match.",
    );
  }
  return toSci(2);
}

function sciArithmetic(lv: Level): Question {
  const mul = lv === 2 ? true : chance(0.5);
  const x = randInt(2, 6);
  const y = randInt(2, 5);
  if (mul) {
    const a = randInt(2, 4);
    const bMax = lv === 3 ? 9 : Math.floor(9 / a);
    const b = randInt(2, Math.max(2, bMax));
    const prod = a * b;
    const right = prod >= 10 ? `${fmt(prod / 10)} × 10${sup(x + y + 1)}` : `${prod} × 10${sup(x + y)}`;
    const wrong = [
      prod >= 10 ? `${prod} × 10${sup(x + y)}` : `${prod} × 10${sup(x * y)}`,
      `${prod} × 10${sup(x + y + 1)}`,
      `${prod} × 10${sup(x * y)}`,
      `${a + b} × 10${sup(x + y)}`,
      `${prod} × 10${sup(x + y - 1)}`,
      `${prod} × 10${sup(x + y + 2)}`,
    ];
    return mc(
      "Multiply. Write the answer in scientific notation.",
      right,
      wrong,
      `Multiply the front numbers (${a} × ${b} = ${prod}) and add the exponents (${x} + ${y} = ${x + y}).${prod >= 10 ? ` Then rewrite ${prod} × 10${sup(x + y)} so there is one digit before the decimal point.` : ""}`,
      { type: "equation", text: `(${a} × 10${sup(x)})(${b} × 10${sup(y)})` },
    );
  }
  const q = randInt(2, 4);
  const b = randInt(2, 3);
  const a = q * b;
  const e1 = y + randInt(2, 5);
  return mc(
    "Divide. Write the answer in scientific notation.",
    `${q} × 10${sup(e1 - y)}`,
    [`${q} × 10${sup(e1 + y)}`, `${q} × 10${sup(Math.round(e1 / y))}`, `${a - b} × 10${sup(e1 - y)}`, `${q} × 10${sup(e1 - y + 1)}`, `${q} × 10${sup(e1 - y - 1)}`],
    `Divide the front numbers (${a} ÷ ${b} = ${q}) and subtract the exponents (${e1} − ${y} = ${e1 - y}).`,
    { type: "equation", text: `(${a} × 10${sup(e1)}) ÷ (${b} × 10${sup(y)})` },
  );
}

function exponentLaws(opts?: GenerateOptions): Question[] {
  return gen(
    [
      mk(productLaw),
      mk(quotientLaw),
      mk(powerOfPower),
      mk(evalPower),
      mk(evalPower),
      mk(sameBaseNumbers),
      mk(negativeExponentRewrite),
      mk(toSci),
      mk(fromSci),
      mk(compareSci, 2),
      mk(sciArithmetic, 2),
    ],
    opts,
  );
}

// ---------- Polynomials ----------

/** Coefficients indexed by degree: [constant, x, x², …]. */
type Poly = number[];

function termText(c: number, k: number, v: string): string {
  const a = Math.abs(c);
  if (k === 0) return String(a);
  return `${a === 1 ? "" : a}${pw(v, k)}`;
}
function fmtPoly(p: Poly, v = "x"): string {
  let out = "";
  for (let k = p.length - 1; k >= 0; k--) {
    const c = p[k];
    if (!c) continue;
    const body = termText(c, k, v);
    out += out === "" ? `${c < 0 ? "−" : ""}${body}` : ` ${c < 0 ? "−" : "+"} ${body}`;
  }
  return out || "0";
}
const trim = (p: Poly): Poly => {
  const q = [...p];
  while (q.length > 1 && q[q.length - 1] === 0) q.pop();
  return q;
};
const polyAdd = (a: Poly, b: Poly): Poly => trim(Array.from({ length: Math.max(a.length, b.length) }, (_, i) => (a[i] ?? 0) + (b[i] ?? 0)));
const polyNeg = (a: Poly): Poly => a.map((c) => -c);

function randPoly(maxDeg: number, minTerms = 2, range = 8): Poly {
  for (let t = 0; t < 50; t++) {
    const p = Array.from({ length: maxDeg + 1 }, () => (chance(0.8) ? signed(1, range) : 0));
    if (p[maxDeg] === 0) p[maxDeg] = signed(1, range);
    if (p.filter(Boolean).length >= minTerms) return p;
  }
  return Array.from({ length: maxDeg + 1 }, () => signed(1, range));
}

/** Variants of a polynomial for distractors: one coefficient nudged or one sign flipped. */
function polyVariants(p: Poly): Poly[] {
  const out: Poly[] = [];
  p.forEach((c, k) => {
    if (!c) return;
    const flip = [...p];
    flip[k] = -c;
    out.push(flip);
    const up = [...p];
    up[k] = c + (c > 0 ? 1 : -1) * randInt(1, 2);
    out.push(up);
  });
  return out;
}

function polyChoice(prompt: string, right: Poly, extra: Poly[], hint: string, v: string, visual?: Visual): ChoiceQuestion {
  return mc(prompt, fmtPoly(right, v), [...extra, ...shuffle(polyVariants(right))].map((p) => fmtPoly(p, v)), hint, visual, 3);
}

function polyDegree(lv: Level): Question {
  if (lv === 3 && chance(0.6)) {
    const terms = sample([[3, 2, 1], [-4, 1, 2], [5, 3, 1], [2, 2, 2], [-6, 1, 1], [7, 0, 3], [4, 4, 0]], 3);
    const text = terms
      .map(([c, a, b], i) => {
        const body = `${Math.abs(c) === 1 ? "" : Math.abs(c)}${a ? pw("x", a) : ""}${b ? pw("y", b) : ""}`;
        return i === 0 ? `${c < 0 ? "−" : ""}${body}` : ` ${c < 0 ? "−" : "+"} ${body}`;
      })
      .join("");
    const deg = Math.max(...terms.map(([, a, b]) => a + b));
    return numQ("What is the degree of this polynomial?", deg, [Math.max(...terms.map(([, a]) => a)), terms.length, deg + 1], "For a term with more than one variable, add the exponents of that term. The degree of the polynomial is the largest of those sums.", {
      type: "equation",
      text,
    }, { min: 0 });
  }
  const p = randPoly(randInt(1, lv === 1 ? 3 : 5), 2);
  const deg = p.length - 1;
  return numQ("What is the degree of this polynomial?", deg, [p.filter(Boolean).length, deg + 1, deg - 1, Math.abs(p[deg])], "The degree is the highest exponent on the variable (once like terms are combined).", { type: "equation", text: fmtPoly(p) }, { min: 0 });
}

function polyClassify(): Question {
  const n = randInt(1, 4);
  const degs = sample([0, 1, 2, 3, 4], n);
  const p: Poly = Array(Math.max(...degs) + 1).fill(0);
  degs.forEach((d) => (p[d] = signed(1, 9)));
  const names = ["Monomial", "Binomial", "Trinomial", "Polynomial with 4 terms"];
  return mc(
    "How many terms does this polynomial have, and what is it called?",
    names[n - 1],
    names.filter((_, i) => i !== n - 1),
    "Count the terms separated by + and − signs. 1 term is a monomial, 2 a binomial, 3 a trinomial.",
    { type: "equation", text: fmtPoly(p) },
  );
}

function notPolynomial(): Question {
  const polys = ["5x² − 3x + 1", "4x³ + 2", "7x", "−2x⁴ + x² − 9", "x² + 6x + 8", "3x + 11", "9", "2x³ − 5x"];
  const non = ["3x⁻² + 5", "7/x + 2", "4x² + 6x⁻¹", "5 + 2/x²", "x⁻³ − 4x"];
  return mc(
    "Which expression is NOT a polynomial?",
    pick(non),
    sample(polys, 3),
    "In a polynomial, every variable has a whole-number exponent (0, 1, 2…) and no variable is in a denominator. A negative exponent or a variable in the denominator rules an expression out.",
  );
}

function polyCoefficient(): Question {
  const p = randPoly(3, 3);
  const ks = p.map((c, k) => (c ? k : -1)).filter((k) => k >= 1);
  const k = pick(ks);
  const name = k === 1 ? "x" : `x${sup(k)}`;
  return numQ(`In this polynomial, what is the coefficient of the ${name} term?`, p[k], [-p[k], p[0], k, p[p.length - 1]], "The coefficient is the number multiplying the variable part, including its sign.", { type: "equation", text: fmtPoly(p) });
}

function polyAddSub(lv: Level): Question {
  const v = pick(["x", "x", "a", "n", "t"]);
  const deg = lv === 1 ? 1 : 2;
  const a = randPoly(deg, 2);
  const b = randPoly(deg, 2);
  const add = chance(0.5);
  const right = add ? polyAdd(a, b) : polyAdd(a, polyNeg(b));
  if (right.every((c) => c === 0)) return polyAddSub(lv);
  const flawed = a.map((c, i) => (i === a.length - 1 ? c - (b[i] ?? 0) : c + (b[i] ?? 0)));
  const prompt = `Simplify: (${fmtPoly(a, v)}) ${add ? "+" : "−"} (${fmtPoly(b, v)})`;
  const hint = add
    ? "Group like terms (same variable and exponent) and add their coefficients."
    : "Subtracting a bracket changes the sign of EVERY term inside it. Rewrite as adding the opposite, then combine like terms.";
  return polyChoice(prompt, right, add ? [polyAdd(a, polyNeg(b))] : [polyAdd(a, b), trim(flawed)], hint, v);
}

function polyMultiply(lv: Level): Question {
  const v = pick(["x", "x", "y", "n"]);
  const k = lv === 1 ? 0 : randInt(1, lv === 3 ? 2 : 1);
  const m = lv === 1 ? randInt(2, 6) : signed(2, 6);
  const p = randPoly(lv === 1 ? 1 : 2, 2, 6);
  const right: Poly = Array(p.length + k).fill(0);
  p.forEach((c, i) => (right[i + k] = c * m));
  const mono = k === 0 ? String(m) : `${m < 0 ? "−" : ""}${Math.abs(m) === 1 ? "" : Math.abs(m)}${pw(v, k)}`;
  const noShift: Poly = Array(p.length).fill(0);
  p.forEach((c, i) => (noShift[i] = c * m));
  const onlyFirst = [...p];
  const topIdx = p.length - 1;
  onlyFirst[topIdx] = p[topIdx] * m;
  const shifted: Poly = Array(p.length + k).fill(0);
  onlyFirst.forEach((c, i) => (shifted[i + (i === topIdx ? k : 0)] = c));
  const lastFlip = [...right];
  const li = right.findIndex((c) => c !== 0);
  lastFlip[li] = -lastFlip[li];
  return polyChoice(
    `Expand and simplify: ${mono}(${fmtPoly(p, v)})`,
    right,
    k > 0 ? [trim(noShift), trim(shifted), trim(lastFlip)] : [trim(shifted), trim(lastFlip)],
    `Multiply EVERY term inside the brackets by ${mono}${k > 0 ? ". Multiply the coefficients and add the exponents (x · x = x²)" : ""}. Watch the signs.`,
    v,
  );
}

function polyDivide(lv: Level): Question {
  const v = pick(["x", "x", "y", "a"]);
  const dm = lv === 1 ? 0 : randInt(1, 2);
  const cm = lv === 1 ? randInt(2, 6) : pick([2, 3, 4, 5, -2, -3]);
  const q = randPoly(lv === 1 ? 1 : 2, 2, 5);
  // make sure each quotient term exists in the numerator at degree + dm
  const num: Poly = Array(q.length + dm).fill(0);
  q.forEach((c, i) => (num[i + dm] = c * cm));
  const mono = dm === 0 ? String(cm) : `${cm < 0 ? "−" : ""}${Math.abs(cm)}${pw(v, dm)}`;
  const divisor = cm < 0 ? `(${mono})` : mono;
  const onlyFirst: Poly = Array(num.length).fill(0);
  num.forEach((c, i) => (onlyFirst[i] = c));
  const topI = num.length - 1;
  onlyFirst[topI] = num[topI] / cm;
  const shiftedFirst: Poly = Array(q.length).fill(0);
  q.forEach((c, i) => (shiftedFirst[i] = i === q.length - 1 ? c : num[i + dm] ?? 0));
  const wrong: Poly[] = [trim(onlyFirst), trim(shiftedFirst)];
  if (dm > 0) wrong.push(trim(Array.from({ length: num.length }, (_, i) => (num[i] ?? 0) / cm)));
  return polyChoice(
    `Simplify: (${fmtPoly(num, v)}) ÷ ${divisor}`,
    q,
    wrong,
    `Divide EVERY term by ${mono}: divide the coefficients${dm > 0 ? " and subtract the exponents (x³ ÷ x = x²)" : ""}. Check by multiplying your answer back.`,
    v,
  );
}

function polyEvaluate(lv: Level): Question {
  const p = randPoly(2, 3, lv === 1 ? 4 : 6);
  const x = lv === 1 ? randInt(1, 4) : signed(1, 5);
  const val = p.reduce((s, c, k) => s + c * x ** k, 0);
  const parts = p.map((c, k) => (c ? `${c < 0 ? "(" : ""}${c}${c < 0 ? ")" : ""}(${x < 0 ? `(${x})` : x})${k > 1 ? sup(k) : ""}` : "")).filter(Boolean);
  void parts;
  return typed(
    `Evaluate the polynomial when x = ${num(x)}.`,
    fmt(val),
    `Substitute x = ${br(x)} and use brackets around negative values: square before multiplying by the coefficient. The value is ${val}.`,
    "integer",
    { visual: { type: "equation", text: fmtPoly(p) } },
  );
}

function polyGeometry(lv: Level): Question {
  const k = randInt(2, 6);
  const p1 = randInt(1, 5);
  const q1 = randInt(1, 9);
  if (chance(0.5)) {
    const right: Poly = [k * q1, k * p1];
    return polyChoice(
      `A rectangle has width ${k} and length ${fmtPoly([q1, p1])}. Which expression gives its area?`,
      right,
      [[k + q1, k * p1], [k * q1, p1], [k * q1, p1 + k]],
      "Area = width × length. Multiply EVERY term of the length by the width.",
      "x",
    );
  }
  const p2 = lv === 1 ? 1 : randInt(1, 4);
  const q2 = randInt(1, 7);
  const right: Poly = [2 * (q1 + q2), 2 * (p1 + p2)];
  return polyChoice(
    `A rectangle has length ${fmtPoly([q1, p1])} and width ${fmtPoly([q2, p2])}. Which expression gives its perimeter?`,
    right,
    [[q1 + q2, p1 + p2], [2 * q1 + q2, 2 * p1 + p2], [q1 * q2, p1 * p2]],
    "Perimeter = 2 × (length + width). Add the lengths, combine like terms, then double.",
    "x",
  );
}

function likeTerms(): Question {
  const a = randInt(1, 3);
  const b = randInt(1, 3);
  const c = signed(2, 9);
  const base = `${Math.abs(c)}${pw("x", a)}${pw("y", b)}`;
  const baseLabel = `${c < 0 ? "−" : ""}${base}`;
  const right = `${(c > 0 ? -1 : 1) * randInt(2, 8)}`;
  const likeText = `${Number(right) < 0 ? "−" : ""}${Math.abs(Number(right))}${pw("x", a)}${pw("y", b)}`;
  return mc(
    `Which term is a like term with ${baseLabel}?`,
    likeText,
    [`${Math.abs(c)}${pw("x", b)}${pw("y", a)}`, `${Math.abs(c)}${pw("x", a + 1)}${pw("y", b)}`, `${Math.abs(c)}${pw("x", a)}`, `${Math.abs(c)}${pw("y", b)}`].filter(
      (t) => !(a === b && t === `${Math.abs(c)}${pw("x", b)}${pw("y", a)}`),
    ),
    "Like terms have exactly the same variables with exactly the same exponents. Only the coefficients can differ.",
    undefined,
    3,
  );
}

function polynomials(opts?: GenerateOptions): Question[] {
  return gen(
    [
      mk(polyDegree),
      mk(polyClassify),
      mk(notPolynomial, 2),
      mk(polyCoefficient),
      mk(polyAddSub),
      mk(polyAddSub),
      mk(polyMultiply),
      mk(polyMultiply),
      mk(polyDivide),
      mk(polyEvaluate),
      mk(polyGeometry),
      mk(likeTerms, 2),
    ],
    opts,
  );
}

// ---------- Linear relations ----------

const lineCoef = (m: R, v: string): string => {
  if (m.d === 1) return m.n === 1 ? v : m.n === -1 ? `−${v}` : `${num(m.n)}${v}`;
  return `${m.n < 0 ? "−" : ""}(${Math.abs(m.n)}/${m.d})${v}`;
};
/** "y = −3x + 5". */
function lineEq(m: R, b: number, y = "y", x = "x"): string {
  if (m.n === 0) return `${y} = ${num(b)}`;
  const c = lineCoef(m, x);
  return `${y} = ${c}${b === 0 ? "" : ` ${b < 0 ? "−" : "+"} ${Math.abs(b)}`}`;
}

function slopeFor(lv: Level): R {
  if (lv === 1) return rat(randInt(1, 4));
  if (lv === 2) return rat(signed(1, 4));
  for (;;) {
    const m = rat(signed(1, 5), pick([2, 3, 4]));
    if (m.d > 1) return m;
  }
}

/** The two points where a line meets the edges of the window (for drawing). */
function lineSegment(m: number, b: number, lo: number, hi: number): { x: number; y: number }[] {
  const xs = [lo, hi];
  if (m !== 0) xs.push((lo - b) / m, (hi - b) / m);
  const inside = xs.filter((x) => x >= lo - 1e-9 && x <= hi + 1e-9 && m * x + b >= lo - 1e-9 && m * x + b <= hi + 1e-9);
  const a = Math.min(...inside);
  const z = Math.max(...inside);
  return [a, z].map((x) => ({ x, y: m * x + b }));
}

function linePlot(m: R, b: number, labelled: { x: number; y: number }[]): Visual {
  return {
    type: "plot",
    xMin: -10,
    xMax: 10,
    yMin: -10,
    yMax: 10,
    step: 1,
    curves: [{ points: lineSegment(rv(m), b, -10, 10) }],
    points: labelled.map((p) => ({ x: p.x, y: p.y, label: `(${p.x}, ${p.y})` })),
  };
}

function slopeFromPoints(lv: Level): Question {
  const m = slopeFor(lv);
  let x1: number, y1: number, x2: number, y2: number;
  for (let t = 0; ; t++) {
    const k = lv === 3 || m.d > 1 ? 1 : randInt(1, 2);
    const dx = m.d * k;
    const dy = m.n * k;
    x1 = randInt(-5, 5);
    y1 = randInt(-5, 5);
    x2 = x1 + dx;
    y2 = y1 + dy;
    if (Math.abs(x2) <= 8 && Math.abs(y2) <= 8) break;
    if (t > 200) throw new Error("slope points");
  }
  if (chance(0.5)) [x1, y1, x2, y2] = [x2, y2, x1, y1];
  const visual: Visual = { type: "grid", size: 8, min: -8, points: [{ x: x1, y: y1, label: "A" }, { x: x2, y: y2, label: "B" }] };
  return typed(
    `What is the slope of the line through A(${x1}, ${y1}) and B(${x2}, ${y2})? Give an integer or a fraction.`,
    rs(m),
    `Slope = rise ÷ run = (y₂ − y₁) ÷ (x₂ − x₁) = (${y2} − ${br(y1)}) ÷ (${x2} − ${br(x1)}) = ${y2 - y1}/${x2 - x1}${rs(rat(y2 - y1, x2 - x1)) !== `${y2 - y1}/${x2 - x1}` ? ` = ${rs(m)}` : ""}.`,
    "fraction",
    { accept: [...(m.d === 1 ? [] : equivalents(m)), ...(m.d === 1 ? equivalents(m) : [])], visual },
  );
}

function readEquation(lv: Level): Question {
  const m = slopeFor(lv === 3 ? 2 : lv);
  const b = signed(1, 9);
  const ask = pick(["slope", "intercept"]);
  const flip = lv >= 2 && chance(0.5);
  const eqText = flip && m.d === 1 ? `y = ${num(b)} ${m.n < 0 ? "−" : "+"} ${Math.abs(m.n) === 1 ? "" : Math.abs(m.n)}x` : lineEq(m, b);
  if (ask === "slope") {
    return numQ("What is the slope of this line?", m.n, [-m.n, b, -b], "In y = mx + b, the slope m is the coefficient of x. Look at the number multiplying x, including its sign (even when the terms are in a different order).", { type: "equation", text: eqText });
  }
  return numQ("What is the y-intercept (the y value where the line crosses the y-axis)?", b, [-b, m.n, -m.n], "In y = mx + b, the y-intercept b is the constant term, the value of y when x = 0.", { type: "equation", text: eqText });
}

function standardForm2(lv: Level): Question {
  const p = randInt(2, lv === 3 ? 9 : 6);
  const q = randInt(2, lv === 3 ? 9 : 6);
  let a = randInt(1, 6);
  let b = randInt(1, 6);
  if (gcd(a, b) > 1) b = b + 1;
  a = a * 1;
  const c = a * p * b; // x-int = c/a = b*p, y-int = c/b = a*p
  void q;
  const xi = c / a;
  const yi = c / b;
  const askX = chance(0.5);
  const text = `${a === 1 ? "" : a}x + ${b === 1 ? "" : b}y = ${c}`;
  return typed(
    `Where does the line ${askX ? "cross the x-axis" : "cross the y-axis"}? Give the ${askX ? "x" : "y"} value of the intercept.`,
    String(askX ? xi : yi),
    askX ? `To find the x-intercept, set y = 0: ${a === 1 ? "" : a}x = ${c}, so x = ${xi}.` : `To find the y-intercept, set x = 0: ${b === 1 ? "" : b}y = ${c}, so y = ${yi}.`,
    "integer",
    { visual: { type: "equation", text } },
  );
}

function standardToSlope(): Question {
  const a = randInt(1, 6);
  let b = randInt(2, 6);
  if (a % b === 0) b += 1;
  const c = signed(2, 12);
  const m = rat(-a, b);
  return fracInput(
    "What is the slope of this line? Give a fraction in lowest terms.",
    m,
    `Solve for y: subtract the x-term and divide by ${b}, giving y = (−${a}/${b})x ${c < 0 ? "−" : "+"} ${rs(rat(Math.abs(c), b))}. The slope is the coefficient of x: ${rs(m)} (in lowest terms).`,
    { type: "equation", text: `${a === 1 ? "" : a}x + ${b}y = ${num(c)}` },
  );
}

function equationFromGraph(lv: Level): Question {
  for (let t = 0; t < 200; t++) {
    const m = slopeFor(lv);
    const b = randInt(-5, 5);
    const p2 = { x: m.d, y: b + m.n };
    if (Math.abs(p2.y) > 9 || b === 0) continue;
    const labelled = [{ x: 0, y: b }, p2];
    const right = lineEq(m, b);
    const wrong = [lineEq(rat(-m.n, m.d), b), lineEq(m, -b), m.d === 1 ? lineEq(rat(b), m.n) : lineEq(rat(m.d, m.n), b)];
    return mc("Which equation matches the graph?", right, wrong, "Read the y-intercept where the line crosses the y-axis. Then count the rise and run to the next marked point to find the slope. A line going down as you move right has a negative slope.", linePlot(m, b, labelled));
  }
  throw new Error("graph");
}

function slopeFromGraph(lv: Level): Question {
  for (let t = 0; t < 200; t++) {
    const m = slopeFor(lv);
    const b = randInt(-5, 5);
    const p2 = { x: m.d, y: b + m.n };
    if (Math.abs(p2.y) > 9) continue;
    return fracInput(
      "What is the slope of the line? Give an integer or a fraction.",
      m,
      `Pick the two marked points and count: rise = ${p2.y - b}, run = ${p2.x}. Slope = rise ÷ run = ${rs(m)}.`,
      linePlot(m, b, [{ x: 0, y: b }, p2]),
    );
  }
  throw new Error("graph slope");
}

function tableQ(lv: Level): Question {
  const m = lv === 1 ? randInt(1, 5) : signed(1, 6);
  const b = signed(0, 12);
  const step = lv === 1 ? 1 : pick([1, 2, 5]);
  const x0 = randInt(0, 3);
  const xs = [0, 1, 2, 3].map((i) => x0 + i * step);
  const ys = xs.map((x) => m * x + b);
  const visual: Visual = { type: "table", headers: ["x", ...xs.map(String)], rows: [["y", ...ys.map(String)]] };
  const kind = randInt(1, 3);
  if (kind === 1) {
    return typed("What is the rate of change (slope) shown in this table?", fmt(m), `Rate of change = change in y ÷ change in x. From the first two columns: (${ys[1]} − ${br(ys[0])}) ÷ (${xs[1]} − ${xs[0]}) = ${ys[1] - ys[0]}/${step} = ${m}.`, "integer", { visual });
  }
  if (kind === 2) {
    const xt = xs[3] + step * randInt(2, 5);
    return typed(`The pattern continues in the same way. What is y when x = ${xt}?`, fmt(m * xt + b), `The slope is ${m} (y changes by ${m} for each 1 in x${step === 1 ? "" : `, so by ${m * step} for each step of ${step}`}). The equation is y = ${m}x ${b < 0 ? "−" : "+"} ${Math.abs(b)} (use any column to find the constant), so at x = ${xt}, y = ${m * xt + b}.`, "integer", { visual });
  }
  const right = lineEq(rat(m), b);
  return mc("Which equation matches the table?", right, [lineEq(rat(-m), b), lineEq(rat(m), -b), lineEq(rat(b === 0 ? m + 1 : b), m)], `Find the slope from the change in y over the change in x (${m}). Then use any column to find b: b = y − m·x.`, visual);
}

function isLinearTable(): Question {
  const linear = chance(0.5);
  const xs = [0, 1, 2, 3, 4];
  const ys = linear
    ? xs.map((x) => signed(2, 5) * 0 + x * pick([3]) + 2)
    : (() => {
        const kind = pick(["sq", "double", "tri"]);
        return xs.map((x) => (kind === "sq" ? x * x + 1 : kind === "double" ? 2 ** x : (x * (x + 1)) / 2));
      })();
  const real = linear ? (() => { const m = randInt(2, 6); const b = randInt(-3, 8); return xs.map((x) => m * x + b); })() : ys;
  const diffs = real.slice(1).map((y, i) => y - real[i]);
  return mc(
    "Is this relation linear?",
    linear ? "Yes, the y values change by the same amount each time" : "No, the y values do not change by a constant amount",
    linear
      ? ["No, the y values do not change by a constant amount", "No, because y increases", "Yes, because x increases by 1 each time and y increases"]
      : ["Yes, the y values change by the same amount each time", "Yes, because y keeps increasing", "No, because x starts at 0"],
    `Find the first differences in y while x goes up by 1: ${diffs.join(", ")}. A linear relation has the same difference every time.`,
    { type: "table", headers: ["x", ...xs.map(String)], rows: [["y", ...real.map(String)]] },
  );
}

function equationFromPoint(lv: Level): Question {
  for (let t = 0; t < 100; t++) {
    const m = lv === 1 ? randInt(1, 4) : signed(1, 5);
    const x1 = signed(1, 5);
    const y1 = randInt(-9, 9);
    const b = y1 - m * x1;
    if (Math.abs(b) > 20 || b === 0 || b === y1) continue;
    const wrong = [lineEq(rat(m), y1 + m * x1), lineEq(rat(m), y1), lineEq(rat(-m), b), lineEq(rat(m), -b)];
    if (lv === 3) {
      const m2 = m;
      const x2 = x1 + randInt(1, 3);
      const y2 = m2 * x2 + b;
      return mc(`A line passes through (${x1}, ${y1}) and (${x2}, ${y2}). Which equation describes it?`, lineEq(rat(m), b), wrong, `First find the slope: (${y2} − ${br(y1)}) ÷ (${x2} − ${br(x1)}) = ${m}. Then substitute one point into y = mx + b to find b = ${y1} − ${br(m * x1)} = ${b}.`);
    }
    return mc(`A line has slope ${m} and passes through (${x1}, ${y1}). Which equation describes it?`, lineEq(rat(m), b), wrong, `Substitute the point into y = mx + b: ${y1} = ${m}(${x1}) + b, so b = ${y1} − ${br(m * x1)} = ${b}.`);
  }
  throw new Error("point eq");
}

interface Context {
  y: string;
  x: string;
  sign: 1 | -1;
  text: (m: number, b: number) => string;
  ask: string;
  bMeaning: string;
  mMeaning: string;
  unitY: string;
  xName: string;
}
const CONTEXTS: Context[] = [
  { y: "C", x: "d", sign: 1, text: (m, b) => `A taxi charges a flat fee of $${b} plus $${m} for each kilometre.`, ask: "cost C (in dollars) for a trip of d kilometres", bMeaning: "the flat fee, charged before any distance", mMeaning: "the cost for each kilometre", unitY: "$", xName: "kilometres" },
  { y: "S", x: "w", sign: 1, text: (m, b) => `Priya has $${b} saved and adds $${m} to her account every week.`, ask: "savings S (in dollars) after w weeks", bMeaning: "the amount she had at the start", mMeaning: "the amount added each week", unitY: "$", xName: "weeks" },
  { y: "H", x: "t", sign: -1, text: (m, b) => `A candle is ${b} cm tall and burns down ${m} cm every hour.`, ask: "height H (in cm) after t hours", bMeaning: "the starting height of the candle", mMeaning: "how much height is lost each hour", unitY: " cm", xName: "hours" },
  { y: "V", x: "t", sign: -1, text: (m, b) => `A tank holds ${b} L of water and drains at ${m} L every minute.`, ask: "volume V (in litres) after t minutes", bMeaning: "the starting volume of water", mMeaning: "how much water drains each minute", unitY: " L", xName: "minutes" },
];

function wordLine(lv: Level): Question {
  const c = pick(CONTEXTS);
  const m = lv === 1 ? randInt(2, 9) : randInt(3, 15);
  const T = randInt(3, 8);
  const b = c.sign === 1 ? randInt(2, 12) * 5 : m * T + randInt(0, 3) * 5;
  const slope = rat(c.sign * m);
  const eq = lineEq(slope, b, c.y, c.x);
  const kind = randInt(1, 3);
  if (kind === 1) {
    return mc(`${c.text(m, b)} Which equation gives the ${c.ask}?`, eq, [lineEq(rat(c.sign * b), m, c.y, c.x), lineEq(rat(-c.sign * m), b, c.y, c.x), `${c.y} = ${m}${c.x}`, lineEq(slope, -b, c.y, c.x)], "Start value = y-intercept (b). Amount that changes each time = slope (m); it is negative if the quantity goes down.");
  }
  if (kind === 2) {
    const meaningB = Math.random; // keep eslint quiet about unused (never called)
    void meaningB;
    const asked = chance(0.5);
    const right = asked ? c.bMeaning : c.mMeaning;
    const wrong = [asked ? c.mMeaning : c.bMeaning, `the value of ${c.x} after one ${c.xName.replace(/s$/, "")}`, `the total after ${T} ${c.xName}`];
    return mc(`In the equation ${eq}, what does the ${asked ? num(b) : num(c.sign * m)} represent?`, right, wrong, asked ? "The constant term is the value when x = 0: the starting amount." : "The coefficient of x is the rate of change: how much y changes for each 1 in x.");
  }
  const val = c.sign * m * T + b;
  return typed(`${c.text(m, b)} What is the ${c.ask.split(" for ")[0].split(" after ")[0]}${c.unitY === "$" ? " (in dollars)" : ""} after ${T} ${c.xName}?`, fmt(val), `Use ${eq} with ${c.x} = ${T}: ${c.sign * m} × ${T} + ${b} = ${val}.`, "integer", { suffix: c.unitY === "$" ? undefined : c.unitY.trim() });
}

function pointOnLine(): Question {
  const m = signed(1, 5);
  const b = signed(1, 9);
  const x = signed(1, 5);
  const onLine = chance(0.5);
  const y = m * x + b + (onLine ? 0 : pick([-2, -1, 1, 2, m, -m].filter((d) => d !== 0)));
  const actual = m * x + b;
  return mc(`Is the point (${x}, ${y}) on the line ${lineEq(rat(m), b)}?`, y === actual ? "Yes" : "No", [y === actual ? "No" : "Yes", "Not enough information"], `Substitute x = ${x} into the equation: y = ${m}(${x}) ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${actual}. The point is on the line only if its y value is ${actual}.`, undefined, 2);
}

function parallelLine(): Question {
  const m = signed(2, 5);
  const b = signed(1, 8);
  const b2 = b + pick([-3, 2, 4, -5]);
  return mc(`Which line is parallel to ${lineEq(rat(m), b)}?`, lineEq(rat(m), b2), [lineEq(rat(-m), b), lineEq(rat(m + 1), b), lineEq(rat(b), m)], "Parallel lines never meet because they have the same slope but different y-intercepts.");
}

function linearRelations(opts?: GenerateOptions): Question[] {
  return gen(
    [
      mk(slopeFromPoints),
      mk(slopeFromPoints),
      mk(readEquation),
      mk(equationFromGraph),
      mk(slopeFromGraph),
      mk(tableQ),
      mk(tableQ),
      mk(isLinearTable, 2),
      mk(equationFromPoint),
      mk(wordLine),
      mk(wordLine),
      mk(standardForm2, 2),
      mk(standardToSlope, 3),
      mk(pointOnLine),
      mk(parallelLine, 2),
    ],
    opts,
  );
}

// ---------- Solving linear equations ----------

const lin = (m: number, b: number, v: string): string => {
  const term = m === 1 ? v : m === -1 ? `−${v}` : `${num(m)}${v}`;
  return b === 0 ? term : `${term} ${b < 0 ? "−" : "+"} ${Math.abs(b)}`;
};
const EQ_VARS = ["x", "n", "k", "t", "m", "p"];

/** Typed or multiple-choice solution to an equation, shown big. */
function solveQ(eq: string, v: string, s: number, hint: string): Question {
  const visual: Visual = { type: "equation", text: eq };
  if (chance(0.25)) {
    return numQ(`Which value of ${v} solves the equation?`, s, [-s, s + 1, s - 1, s * 2], `Substitute each choice into the equation and see which makes both sides equal. Or solve it step by step. ${hint}`, visual, { step: 1 });
  }
  return typed(`Solve for ${v}.`, fmt(s), `${hint} The solution is ${v} = ${s}.`, "integer", { visual });
}

function twoStepEq(lv: Level): Question {
  const v = pick(EQ_VARS);
  const a = randInt(2, lv === 1 ? 6 : 9);
  const s = signed(1, lv === 1 ? 8 : 12);
  const b = signed(1, 15);
  const c = a * s + b;
  return solveQ(`${lin(a, b, v)} = ${num(c)}`, v, s, `Undo the ${b < 0 ? "−" : "+"}${Math.abs(b)} first: ${b < 0 ? "add" : "subtract"} ${Math.abs(b)} on both sides to get ${a}${v} = ${num(c - b)}. Then divide both sides by ${a}.`);
}

function bothSidesEq(lv: Level): Question {
  const v = pick(EQ_VARS);
  const a = randInt(3, 9);
  const c = lv === 2 ? randInt(1, a - 1) : pick([-4, -3, -2, -1, 1, 2, 3, 4, 5].filter((x) => x !== a));
  const s = signed(1, 9);
  const b = signed(1, 12);
  const d = (a - c) * s + b;
  return solveQ(`${lin(a, b, v)} = ${lin(c, d, v)}`, v, s, `Collect the ${v}-terms on one side: subtract ${num(c)}${v} from both sides, giving ${num(a - c)}${v} ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${num(d)}. Then solve the two-step equation.`);
}

function bracketEq(lv: Level): Question {
  const v = pick(EQ_VARS);
  const s = signed(1, 9);
  if (lv === 3 && chance(0.6)) {
    const a = randInt(2, 5);
    let c = randInt(2, 5);
    if (c === a) c += 1;
    const k = signed(1, 3);
    const b = c * k - s;
    const d = a * k - s;
    return solveQ(`${a}(${lin(1, b, v)}) = ${c}(${lin(1, d, v)})`, v, s, `Expand both brackets, then gather the ${v}-terms on one side and the numbers on the other.`);
  }
  const a = randInt(2, 7);
  const b = signed(1, 9);
  if (lv === 1 || chance(0.5)) {
    return solveQ(`${a}(${lin(1, b, v)}) = ${num(a * (s + b))}`, v, s, `Either divide both sides by ${a} first, or expand the bracket (${a} × ${v} and ${a} × ${num(b)}) before isolating ${v}.`);
  }
  const d = signed(1, 12);
  return solveQ(`${a}(${lin(1, b, v)}) ${d < 0 ? "−" : "+"} ${Math.abs(d)} = ${num(a * (s + b) + d)}`, v, s, `Move the ${d < 0 ? "−" : "+"}${Math.abs(d)} first, then expand or divide by ${a}.`);
}

function fractionEq(lv: Level): Question {
  const v = pick(EQ_VARS);
  if (lv === 3 && chance(0.5)) {
    const [p, q] = pick([[2, 3], [2, 4], [3, 4], [2, 5], [3, 6]]);
    const l = (p * q) / gcd(p, q);
    const s = l * signed(1, 3);
    return solveQ(`${v}/${p} + ${v}/${q} = ${s / p + s / q}`, v, s, `Multiply every term by the common denominator ${l} to clear the fractions: ${l / p}${v} + ${l / q}${v} = ${l * (s / p + s / q)}.`);
  }
  if (lv >= 2 && chance(0.5)) {
    const a = randInt(2, 6);
    const c = signed(1, 8);
    const b = signed(1, 9);
    const s = a * c - b;
    return solveQ(`(${lin(1, b, v)})/${a} = ${num(c)}`, v, s, `Multiply both sides by ${a} to clear the fraction: ${v} ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${num(a * c)}. Then undo the ${b < 0 ? "−" : "+"}${Math.abs(b)}.`);
  }
  const a = randInt(2, 7);
  const t = signed(1, 8);
  const b = signed(1, 12);
  const s = a * t;
  return solveQ(`${v}/${a} ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${num(t + b)}`, v, s, `Undo the ${b < 0 ? "−" : "+"}${Math.abs(b)} first to get ${v}/${a} = ${num(t)}. Then multiply both sides by ${a}.`);
}

function decimalEq(): Question {
  const v = pick(EQ_VARS);
  const aT = randInt(2, 9);
  const s = signed(1, 10);
  const bT = signed(1, 29);
  const cT = aT * s + bT;
  const dec = (t: number) => (t < 0 ? `−${fmt(-t / 10)}` : fmt(t / 10));
  return solveQ(`${fmt(aT / 10)}${v} ${bT < 0 ? "−" : "+"} ${fmt(Math.abs(bT) / 10)} = ${dec(cT)}`, v, s, `Multiply every term by 10 to remove the decimals: ${aT}${v} ${bT < 0 ? "−" : "+"} ${Math.abs(bT)} = ${cT}. Then solve the two-step equation.`);
}

function stepsOrder(): Question {
  const v = pick(EQ_VARS);
  const a = randInt(2, 6);
  const b = randInt(1, 8);
  const s = signed(1, 8);
  const c = a * (s + b);
  return {
    kind: "order",
    prompt: `Put the steps in order to solve ${a}(${v} + ${b}) = ${num(c)}.`,
    hint: "Expand the bracket first, then undo the addition, then undo the multiplication.",
    items: [
      { id: "s1", label: `Expand: ${a}${v} + ${a * b} = ${num(c)}` },
      { id: "s2", label: `Subtract ${a * b} from both sides: ${a}${v} = ${num(c - a * b)}` },
      { id: "s3", label: `Divide both sides by ${a}: ${v} = ${num(s)}` },
    ],
  };
}

function equivalentEq(): Question {
  const v = pick(EQ_VARS);
  const a = randInt(2, 6);
  const b = randInt(1, 9);
  const s = randInt(b + 1, b + 7);
  const c = a * (s - b);
  const right = `${v} − ${b} = ${c / a}`;
  const wrongVals = new Set<number>([c - a, c - b, c / a + 1].filter((x) => x !== c / a));
  const wrong = [`${a}${v} − ${b} = ${c}`, ...[...wrongVals].map((x) => `${v} − ${b} = ${x}`)];
  return mc(`Which equation is equivalent to ${a}(${v} − ${b}) = ${c}?`, right, wrong, `Divide both sides by ${a}. The bracket stays together: ${v} − ${b} = ${c} ÷ ${a}.`);
}

function equationWord(lv: Level): Question {
  const kind = randInt(1, 3);
  if (kind === 1) {
    const m1 = randInt(2, 9);
    const m2 = randInt(1, m1 - 1);
    const s = randInt(3, 15);
    const b1 = randInt(2, 8) * 5;
    const b2 = b1 + (m1 - m2) * s;
    return typed(
      `Phone plan A costs $${b1} plus $${m1} per GB of data. Plan B costs $${b2} plus $${m2} per GB. For how many GB do the two plans cost the same?`,
      String(s),
      `Set the costs equal: ${m1}g + ${b1} = ${m2}g + ${b2}. Collect the g-terms: ${m1 - m2}g = ${b2 - b1}. ${m1 - m2 === 1 ? "" : `Divide by ${m1 - m2}.`}`,
      "number",
      { suffix: "GB" },
    );
  }
  if (kind === 2) {
    const s = randInt(3, 15);
    const a = randInt(1, 8);
    const P = 2 * (2 * s + a);
    return typed(
      `A rectangle's length is ${a} cm more than twice its width. Its perimeter is ${P} cm. What is the width?`,
      String(s),
      `Let w be the width. Length = 2w + ${a}. Perimeter: 2(w + 2w + ${a}) = ${P}, which simplifies to 6w + ${2 * a} = ${P}. Solve for w.`,
      "number",
      { suffix: "cm" },
    );
  }
  const m = randInt(2, 6) * 5;
  const months = randInt(3, 14);
  const fee = randInt(1, 6) * 10;
  const total = fee + m * months;
  void lv;
  return typed(
    `A gym charges a $${fee} sign-up fee plus $${m} per month. Ana has paid $${total} in total so far. For how many months has she been a member?`,
    String(months),
    `Write an equation: ${m}n + ${fee} = ${total}. Subtract ${fee} from both sides (${m}n = ${total - fee}), then divide by ${m}.`,
    "number",
    { suffix: "months" },
  );
}

function linearEquations(opts?: GenerateOptions): Question[] {
  return gen(
    [
      mk(twoStepEq),
      mk(twoStepEq),
      mk(bothSidesEq, 2),
      mk(bracketEq),
      mk(bracketEq, 2),
      mk(fractionEq),
      mk(fractionEq, 2),
      mk(decimalEq, 2),
      mk(stepsOrder),
      mk(equivalentEq),
      mk(equationWord, 2),
      mk(equationWord, 1),
    ],
    opts,
  );
}

// ---------- Similar figures and scale ----------

function scaleFactor(lv: Level): Question {
  const k2 = pick(lv === 1 ? [4, 6, 8] : [1, 3, 5, 4, 6, 8]); // factor = k2 / 2
  const k = k2 / 2;
  const base = sample([4, 6, 8, 10, 12, 14, 16], 3).sort((a, b) => a - b);
  const B = base.map((x) => (x * k2) / 2);
  const visual: Visual = {
    type: "table",
    headers: ["Triangle", "Side 1", "Side 2", "Side 3"],
    rows: [["Original", ...base.map(String)], ["Image", ...B.map(String)]],
  };
  if (chance(0.5)) {
    return typed("The two triangles are similar. What is the scale factor from the original to the image?", fmt(k), `Scale factor = image side ÷ original side = ${B[0]} ÷ ${base[0]} = ${fmt(k)}. All three pairs give the same value.`, "decimal", { visual });
  }
  return numQ("The triangles are similar. By what factor do you multiply a side of the original to get the matching side of the image?", k, [1 / k, k + 1, B[0] - base[0], k * 2], `Divide a side of the image by the matching side of the original: ${B[0]} ÷ ${base[0]} = ${fmt(k)}.`, visual, { step: 0.5, min: 0 });
}


function missingSide(lv: Level): Question {
  const k = pick(lv === 1 ? [2, 3, 4] : [2, 3, 4, 5, 1.5, 2.5]);
  const even = k % 1 !== 0;
  const pickSide = () => pick(even ? [4, 6, 8, 10, 12] : [3, 4, 5, 6, 8, 9]);
  const a1 = pickSide();
  let a2 = pickSide();
  if (a2 === a1) a2 += 2;
  const b1 = a1 * k;
  const b2 = a2 * k;
  const findBigger = chance(0.6);
  const visual: Visual = findBigger
    ? { type: "table", headers: ["Matching sides", "Figure A", "Figure B"], rows: [["Side 1", a1, b1], ["Side 2", a2, "?"]] }
    : { type: "table", headers: ["Matching sides", "Figure A", "Figure B"], rows: [["Side 1", a1, b1], ["Side 2", "?", b2]] };
  return typed(
    findBigger ? "Figure B is similar to Figure A. Find the missing side of Figure B." : "Figure B is similar to Figure A. Find the missing side of Figure A.",
    fmt(findBigger ? b2 : a2),
    `Find the scale factor from the known pair: ${b1} ÷ ${a1} = ${fmt(k)}. ${findBigger ? `Multiply the side of A by ${fmt(k)}: ${a2} × ${fmt(k)} = ${fmt(b2)}.` : `Divide the side of B by ${fmt(k)}: ${fmt(b2)} ÷ ${fmt(k)} = ${a2}.`}`,
    "decimal",
    { visual },
  );
}

function similarRectangles(lv: Level): Question {
  const l = randInt(4, 12);
  const w = randInt(2, l - 1);
  const k = pick([2, 3, 1.5]);
  const sim = chance(0.5);
  const l2 = l * k;
  let w2 = w * k;
  if (!sim) w2 += pick([-1, 1, 2]);
  if (!Number.isInteger(l2) || !Number.isInteger(w2) || w2 <= 0) return similarRectangles(lv);
  const yes = l2 / l === w2 / w;
  return mc(
    `Rectangle A is ${l} cm by ${w} cm. Rectangle B is ${l2} cm by ${w2} cm. Are the rectangles similar?`,
    yes ? "Yes, the sides are proportional" : "No, the sides are not proportional",
    yes ? ["No, the sides are not proportional", "No, because the rectangles are different sizes"] : ["Yes, the sides are proportional", "Yes, because both are rectangles"],
    `Compare the ratios of matching sides: ${l2} ÷ ${l} = ${fmt(l2 / l)} and ${w2} ÷ ${w} = ${fmt(w2 / w)}. Figures are similar only if these scale factors are equal. (Different sizes alone don't rule out similarity.)`,
    { type: "table", headers: ["Rectangle", "Length", "Width"], rows: [["A", l, w], ["B", l2, w2]] },
  );
}

function mapScale(): Question {
  const kind = randInt(1, 3);
  if (kind === 1) {
    const N = pick([2, 5, 10, 20, 25, 50]);
    const dT = randInt(11, 99);
    return typed(`On a map, 1 cm represents ${N} km. Two towns are ${fmt(dT / 10)} cm apart on the map. How far apart are they in real life?`, fmt((dT * N) / 10), `Multiply the map distance by the scale: ${fmt(dT / 10)} × ${N} = ${fmt((dT * N) / 10)} km.`, "decimal", { suffix: "km" });
  }
  if (kind === 2) {
    const N = pick([5, 10, 20, 25, 50]);
    const dT = randInt(11, 79);
    const real = (dT * N) / 10;
    return typed(`A map's scale is 1 cm : ${N} km. A trail is ${fmt(real)} km long. How long is it on the map?`, fmt(dT / 10), `Divide the real distance by the scale: ${fmt(real)} ÷ ${N} = ${fmt(dT / 10)} cm.`, "decimal", { suffix: "cm" });
  }
  const r = pick([20, 40, 50, 100, 200]);
  const dT = randInt(12, 90);
  const realM = (r * dT) / 1000;
  return typed(`An architect's drawing uses the scale 1 : ${r}. A wall is ${fmt(dT / 10)} cm long on the drawing. How long is the real wall, in metres?`, fmt(realM), `Real length = drawing length × ${r} = ${fmt(dT / 10)} × ${r} = ${fmt((dT * r) / 10)} cm. Divide by 100 to convert to metres: ${fmt(realM)} m.`, "decimal", { suffix: "m" });
}

function perimeterArea(lv: Level): Question {
  const k = randInt(2, 5);
  const kind = lv === 1 ? 1 : randInt(1, 3);
  if (kind === 1) {
    const P = randInt(6, 20) * 2;
    return typed(`A shape has a perimeter of ${P} cm. A similar shape is made with scale factor ${k}. What is the new perimeter?`, String(P * k), `Perimeter (a length) scales by the scale factor: ${P} × ${k} = ${P * k}.`, "number", { suffix: "cm" });
  }
  if (kind === 2) {
    const A = randInt(3, 15);
    return mc(`A rectangle has an area of ${A} cm². It is enlarged with scale factor ${k}. What is the area of the enlarged rectangle?`, `${A * k * k} cm²`, [`${A * k} cm²`, `${A + k} cm²`, `${A * k * k * k} cm²`], `Area scales by the SQUARE of the scale factor: ${k}² = ${k * k}, so the new area is ${A} × ${k * k} = ${A * k * k} cm². (Both length and width are multiplied by ${k}.)`);
  }
  const A = randInt(2, 9);
  return typed(`The area of a similar figure is ${A * k * k} cm² and the original has area ${A} cm². What is the scale factor from the original to the larger figure?`, String(k), `Divide the areas: ${A * k * k} ÷ ${A} = ${k * k}. The scale factor is the square root of that: √${k * k} = ${k}.`, "number");
}

function similarAngles(): Question {
  const a = randInt(30, 80);
  const b = randInt(35, 85);
  const c = 180 - a - b;
  if (c < 20 || a === b || a === c || b === c) return similarAngles();
  return typed(
    `Triangle ABC is similar to triangle DEF (A matches D, B matches E, C matches F). Angle A = ${a}° and angle B = ${b}°. What is angle F?`,
    String(c),
    `Angles of triangle ABC add to 180°, so C = 180 − ${a} − ${b} = ${c}°. Matching angles of similar figures are equal, so F = C = ${c}°.`,
    "number",
    { suffix: "°" },
  );
}

function shadowQ(): Question {
  const person = pick([1.5, 1.8, 1.2, 2]);
  const shadowP = pick([1, 2, 3]);
  const factor = randInt(2, 8);
  const treeH = Math.round(person * factor * 10) / 10;
  const treeShadow = shadowP * factor;
  return typed(
    `A ${fmt(person)} m tall person casts a ${fmt(shadowP)} m shadow at the same time that a tree casts a ${fmt(treeShadow)} m shadow. How tall is the tree?`,
    fmt(treeH),
    `The person and the tree form similar right triangles with their shadows. Scale factor = ${fmt(treeShadow)} ÷ ${fmt(shadowP)} = ${factor}. Tree height = ${fmt(person)} × ${factor} = ${fmt(treeH)} m.`,
    "decimal",
    { suffix: "m" },
  );
}

function similarFigures(opts?: GenerateOptions): Question[] {
  return gen(
    [mk(scaleFactor), mk(scaleFactor), mk(missingSide), mk(missingSide), mk(similarRectangles), mk(mapScale), mk(mapScale), mk(perimeterArea), mk(perimeterArea, 2), mk(similarAngles), mk(shadowQ)],
    opts,
  );
}

// ---------- Surface area and volume ----------

const piTerm = (k: number, unit: string): string => `${k === 1 ? "" : k}π ${unit}`;

function rectPrism(lv: Level): Question {
  const mx = lv === 1 ? 8 : lv === 2 ? 12 : 20;
  const l = randInt(3, mx);
  const w = randInt(2, mx - 1);
  const h = randInt(2, mx - 2);
  const vol = chance(0.5);
  const val = vol ? l * w * h : 2 * (l * w + l * h + w * h);
  return typed(
    `A rectangular prism measures ${l} cm by ${w} cm by ${h} cm. What is its ${vol ? "volume" : "surface area"}?`,
    String(val),
    vol ? `Volume = length × width × height = ${l} × ${w} × ${h} = ${val} cm³.` : `Surface area = 2(lw + lh + wh) = 2(${l * w} + ${l * h} + ${w * h}) = ${val} cm². Count all six faces.`,
    "number",
    { suffix: vol ? "cm³" : "cm²", visual: { type: "shape", shape: "rectangular-prism" } },
  );
}

function compositeVolume(lv: Level): Question {
  const kind = lv === 1 ? 1 : randInt(1, 3);
  if (kind === 1) {
    const l = randInt(8, 14);
    const w = randInt(6, 10);
    const h = randInt(3, 8);
    const a = randInt(2, l - 3);
    const b = randInt(2, w - 2);
    return typed(
      `A ${l} cm by ${w} cm by ${h} cm block has a rectangular notch cut out of one corner, all the way through its height. The notch is ${a} cm by ${b} cm. What is the volume of the remaining block?`,
      String((l * w - a * b) * h),
      `Volume of the whole block: ${l * w * h}. Volume removed: ${a} × ${b} × ${h} = ${a * b * h}. Remaining: ${l * w * h} − ${a * b * h} = ${(l * w - a * b) * h} cm³.`,
      "number",
      { suffix: "cm³" },
    );
  }
  if (kind === 2) {
    const b = randInt(2, 8) * 2;
    const ht = randInt(3, 9);
    const L = randInt(4, 15);
    return typed(
      `A triangular prism has a triangular base with base ${b} cm and height ${ht} cm. The prism is ${L} cm long. What is its volume?`,
      String((b * ht * L) / 2),
      `Area of the triangle = ½ × ${b} × ${ht} = ${(b * ht) / 2} cm². Volume = base area × length = ${(b * ht) / 2} × ${L} = ${(b * ht * L) / 2} cm³.`,
      "number",
      { suffix: "cm³" },
    );
  }
  const k = randInt(1, 3);
  const L = randInt(5, 12);
  const sa = 12 * k * k + 12 * k * L;
  return typed(
    `A triangular prism has right-triangle ends with sides ${3 * k} cm, ${4 * k} cm and ${5 * k} cm. The prism is ${L} cm long. What is its surface area?`,
    String(sa),
    `Two triangular ends: 2 × ½ × ${3 * k} × ${4 * k} = ${12 * k * k}. Three rectangles: (${3 * k} + ${4 * k} + ${5 * k}) × ${L} = ${12 * k * L}. Total: ${sa} cm².`,
    "number",
    { suffix: "cm²" },
  );
}

function cylinderPi(lv: Level): Question {
  const r = randInt(2, lv === 1 ? 6 : 9);
  const h = randInt(2, 12);
  const useD = lv >= 2 && chance(0.5);
  const given = useD ? `diameter ${2 * r} cm` : `radius ${r} cm`;
  const vol = chance(0.5);
  const right = vol ? r * r * h : 2 * r * (r + h);
  const wrong = vol
    ? [(2 * r) ** 2 * h, r * h, r * r * h * 2]
    : [r * r * h, r * (r + h), 2 * r * h, 2 * r * r + r * h];
  const wrongK = wrong.filter((x) => x !== right);
  return mc(
    `A cylinder has ${given} and height ${h} cm. What is its ${vol ? "volume" : "total surface area"}, in terms of π?`,
    piTerm(right, vol ? "cm³" : "cm²"),
    wrongK.map((x) => piTerm(x, vol ? "cm³" : "cm²")),
    vol ? `V = πr²h. The radius is ${r} cm: V = π × ${r}² × ${h} = ${r * r * h}π.${useD ? " Remember to halve the diameter first." : ""}` : `SA = 2πr² + 2πrh = 2π(${r})(${r} + ${h}) = ${right}π. Two circular ends plus the curved side.${useD ? " Remember to halve the diameter first." : ""}`,
    { type: "shape", shape: "cylinder" },
  );
}

function conePi(lv: Level): Question {
  const triples: [number, number, number][] = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20]];
  const vol = lv === 1 ? true : chance(0.5);
  if (vol) {
    const r = pick([3, 6, 9, 4, 5]);
    const h = r % 3 === 0 ? randInt(2, 10) : pick([3, 6, 9]);
    const k = (r * r * h) / 3;
    return mc(
      `A cone has radius ${r} cm and height ${h} cm. What is its volume, in terms of π?`,
      piTerm(k, "cm³"),
      [piTerm(r * r * h, "cm³"), piTerm((r * h) / 3 === Math.floor((r * h) / 3) ? (r * h) / 3 : r * h, "cm³"), piTerm(3 * r * r * h, "cm³"), piTerm((r * r * h) / 3 + 1, "cm³")],
      `V = ⅓πr²h = ⅓ × π × ${r}² × ${h} = ${k}π. Don't forget the ⅓: a cone holds a third of the matching cylinder.`,
      { type: "shape", shape: "cone" },
    );
  }
  const [r, h, l] = pick(triples);
  const k = r * (r + l);
  return mc(
    `A cone has radius ${r} cm, height ${h} cm and slant height ${l} cm. What is its total surface area, in terms of π?`,
    piTerm(k, "cm²"),
    [piTerm(r * (r + h), "cm²"), piTerm(r * l, "cm²"), piTerm(r * r + l, "cm²"), piTerm((r * r * h) / 3 === Math.floor((r * r * h) / 3) ? (r * r * h) / 3 : r * r * h, "cm²")],
    `SA = πr² + πrl (the circular base plus the curved side) = π(${r})² + π(${r})(${l}) = ${r * r}π + ${r * l}π = ${k}π. Use the slant height l, not the height.`,
    { type: "shape", shape: "cone" },
  );
}

function spherePi(lv: Level): Question {
  const vol = chance(0.5);
  if (vol) {
    const r = pick(lv === 1 ? [3] : [3, 6]);
    const k = (4 * r ** 3) / 3;
    return mc(
      `A sphere has radius ${r} cm. What is its volume, in terms of π?`,
      piTerm(k, "cm³"),
      [piTerm(4 * r * r, "cm³"), piTerm(4 * r ** 3, "cm³"), piTerm((4 * r * r) / 3 === Math.floor((4 * r * r) / 3) ? (4 * r * r) / 3 : 4 * r * r + 1, "cm³"), piTerm(((2 * r) ** 3 * 4) / 3, "cm³")],
      `V = (4/3)πr³ = (4/3) × π × ${r}³ = (4/3) × ${r ** 3}π = ${k}π. The radius is cubed, not squared.`,
      { type: "shape", shape: "sphere" },
    );
  }
  const r = randInt(2, lv === 1 ? 6 : 10);
  return mc(
    `A sphere has ${chance(0.5) ? `radius ${r} cm` : `radius ${r} cm`}. What is its surface area, in terms of π?`,
    piTerm(4 * r * r, "cm²"),
    [piTerm(2 * r * r, "cm²"), piTerm(4 * r, "cm²"), piTerm(r * r, "cm²"), piTerm(4 * r ** 3, "cm²")],
    `SA = 4πr² = 4 × π × ${r}² = ${4 * r * r}π.`,
    { type: "shape", shape: "sphere" },
  );
}

function compositeRound(): Question {
  const r = pick([3, 6]);
  const h = randInt(2, 8);
  const kind = randInt(1, 2);
  if (kind === 1) {
    const k = (2 * r ** 3) / 3;
    return mc(
      `A hemisphere (half a sphere) has radius ${r} cm. What is its volume, in terms of π?`,
      piTerm(k, "cm³"),
      [piTerm(2 * k, "cm³"), piTerm(k / 2, "cm³"), piTerm(r ** 3, "cm³"), piTerm(2 * r * r, "cm³")],
      `A sphere has V = (4/3)πr³, so a hemisphere is half of that: (2/3)π(${r})³ = (2/3) × ${r ** 3}π = ${k}π.`,
      { type: "shape", shape: "sphere" },
    );
  }
  const total = r * r * h + (2 * r ** 3) / 3;
  return mc(
    `A silo is a cylinder with radius ${r} m and height ${h} m, topped by a hemisphere with the same radius. What is its total volume, in terms of π?`,
    piTerm(total, "m³"),
    [piTerm(r * r * h, "m³"), piTerm(r * r * h + (4 * r ** 3) / 3, "m³"), piTerm(r * r * h + r ** 3, "m³"), piTerm(r * r * h * 2, "m³")],
    `Add the two volumes. Cylinder: π × ${r}² × ${h} = ${r * r * h}π. Hemisphere: (2/3)π × ${r}³ = ${(2 * r ** 3) / 3}π. Total: ${total}π.`,
    { type: "shape", shape: "cylinder" },
  );
}

function approxCylinder(): Question {
  for (let t = 0; t < 50; t++) {
    const r = randInt(2, 9);
    const h = randInt(3, 20);
    const N = r * r * h;
    if ((314 * N) % 100 === 50) continue;
    const v = Math.round((314 * N) / 100);
    return typed(
      `A cylindrical can has radius ${r} cm and height ${h} cm. Use π ≈ 3.14. What is its volume, to the nearest whole cm³?`,
      String(v),
      `V = πr²h ≈ 3.14 × ${r}² × ${h} = 3.14 × ${N} = ${fmt((314 * N) / 100)}. Round to ${v} cm³.`,
      "number",
      { suffix: "cm³", visual: { type: "shape", shape: "cylinder" } },
    );
  }
  throw new Error("approx");
}

function capacityQ(): Question {
  const l = randInt(2, 6) * 5;
  const w = randInt(2, 5) * 2;
  const h = randInt(2, 5) * 5;
  const mL = l * w * h;
  return typed(
    `A rectangular tank is ${l} cm by ${w} cm by ${h} cm. How many millilitres of water can it hold? (1 cm³ = 1 mL)`,
    String(mL),
    `Volume = ${l} × ${w} × ${h} = ${mL} cm³. Since 1 cm³ holds 1 mL, the capacity is ${mL} mL.`,
    "number",
    { suffix: "mL" },
  );
}

function missingDimension(): Question {
  if (chance(0.5)) {
    const l = randInt(3, 9);
    const w = randInt(2, 8);
    const h = randInt(2, 12);
    return typed(`A prism has volume ${l * w * h} cm³ and a base that is ${l} cm by ${w} cm. What is its height?`, String(h), `Volume = base area × height, and the base area is ${l} × ${w} = ${l * w}. So h = ${l * w * h} ÷ ${l * w} = ${h}.`, "number", { suffix: "cm" });
  }
  const e = randInt(2, 12);
  return typed(`A cube has a surface area of ${6 * e * e} cm². What is its edge length?`, String(e), `A cube has 6 identical square faces, so one face has area ${6 * e * e} ÷ 6 = ${e * e} cm². The edge is √${e * e} = ${e} cm.`, "number", { suffix: "cm" });
}

function surfaceVolume(opts?: GenerateOptions): Question[] {
  return gen(
    [mk(rectPrism), mk(compositeVolume), mk(compositeVolume), mk(cylinderPi), mk(cylinderPi), mk(conePi), mk(spherePi), mk(approxCylinder, 2), mk(compositeRound, 2), mk(capacityQ), mk(missingDimension)],
    opts,
  );
}

// ---------- Pythagorean theorem ----------

const TRIPLES: [number, number, number][] = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]];
function tripleFor(lv: Level): [number, number, number] {
  const [a, b, c] = pick(lv === 1 ? TRIPLES.slice(0, 2) : TRIPLES);
  const k = lv === 1 ? pick([1, 2]) : lv === 2 ? pick([1, 2, 3]) : pick([1, 2, 3, 4]);
  const t: [number, number, number] = [a * k, b * k, c * k];
  return chance(0.5) ? t : [t[1], t[0], t[2]];
}
const isSquare = (n: number): boolean => Number.isInteger(Math.sqrt(n));

/** Square root rounded to one decimal place, avoiding cases that sit on a rounding boundary. */
function sqrtTenth(n: number): number | undefined {
  const x = Math.sqrt(n) * 10;
  return Math.abs(x - Math.floor(x) - 0.5) > 0.03 ? Math.round(x) / 10 : undefined;
}

function hypotenuse(lv: Level): Question {
  const [a, b, c] = tripleFor(lv);
  return typed("Find the length of the hypotenuse.", String(c), `c² = a² + b² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c}, so c = √${c * c} = ${c}.`, "number", { visual: { type: "equation", text: `a = ${a},  b = ${b},  c = ?` } });
}

function missingLeg(lv: Level): Question {
  const [a, b, c] = tripleFor(lv);
  return typed("Find the missing leg of the right triangle.", String(b), `a² + b² = c², so b² = c² − a² = ${c * c} − ${a * a} = ${b * b}. Then b = √${b * b} = ${b}.`, "number", { visual: { type: "equation", text: `a = ${a},  c = ${c} (hypotenuse),  b = ?` } });
}

function nonTriple(lv: Level): Question {
  for (let t = 0; t < 200; t++) {
    const a = randInt(2, lv === 1 ? 9 : 15);
    const b = randInt(2, lv === 1 ? 9 : 15);
    if (a === b) continue;
    const hyp = chance(0.6);
    if (hyp) {
      const n = a * a + b * b;
      if (isSquare(n)) continue;
      const r = sqrtTenth(n);
      if (r === undefined) continue;
      return typed(`A right triangle has legs ${a} cm and ${b} cm. Find the hypotenuse, to the nearest tenth.`, fmt(r), `c² = ${a}² + ${b}² = ${n}, so c = √${n} ≈ ${fmt(r)} cm.`, "decimal", { suffix: "cm" });
    }
    const c = Math.max(a, b) + randInt(1, 5);
    const n = c * c - a * a;
    if (isSquare(n)) continue;
    const r = sqrtTenth(n);
    if (r === undefined) continue;
    return typed(`A right triangle has hypotenuse ${c} cm and one leg ${a} cm. Find the other leg, to the nearest tenth.`, fmt(r), `b² = c² − a² = ${c * c} − ${a * a} = ${n}, so b = √${n} ≈ ${fmt(r)} cm.`, "decimal", { suffix: "cm" });
  }
  throw new Error("non triple");
}

function converse(lv: Level): Question {
  const [a, b, c] = tripleFor(lv);
  const fake = (): [number, number, number] => {
    for (;;) {
      const f: [number, number, number] = [a + randInt(-1, 2), b + randInt(-2, 1), c + randInt(-1, 2)];
      f.sort((x, y) => x - y);
      if (f[0] > 0 && f[0] + f[1] > f[2] && f[0] ** 2 + f[1] ** 2 !== f[2] ** 2) return f;
    }
  };
  if (chance(0.5)) {
    const sides = [a, b, c].sort((x, y) => x - y);
    const ok = chance(0.5);
    const s = ok ? sides : fake();
    const right = s[0] ** 2 + s[1] ** 2 === s[2] ** 2;
    return mc(`A triangle has sides ${s[0]} cm, ${s[1]} cm and ${s[2]} cm. Is it a right triangle?`, right ? "Yes" : "No", [right ? "No" : "Yes", "Not enough information"], `Check whether the two shorter sides squared add up to the longest side squared: ${s[0] ** 2} + ${s[1] ** 2} = ${s[0] ** 2 + s[1] ** 2}, and ${s[2]}² = ${s[2] ** 2}. If they match, it is a right triangle.`, undefined, 2);
  }
  const good = [a, b, c].sort((x, y) => x - y);
  const bad: number[][] = [];
  while (bad.length < 3) {
    const f = fake();
    if (!bad.some((x) => x.join() === f.join()) && f.join() !== good.join()) bad.push(f);
  }
  const label = (s: number[]) => s.join(", ");
  return mc("Which set of side lengths forms a right triangle?", label(good), bad.map(label), "Test each set: the two smaller sides squared must add to the largest side squared (a² + b² = c²).");
}

function pythagorasWord(lv: Level): Question {
  const [a, b, c] = tripleFor(lv);
  const small = c <= 17;
  const kind = pick(small ? [1, 2, 3, 4, 5] : [2, 2, 4, 5]);
  if (kind === 1) {
    return typed(`A ${c} m ladder leans against a wall with its foot ${Math.min(a, b)} m from the wall. How high up the wall does it reach?`, String(Math.max(a, b)), `The ladder is the hypotenuse. height² = ${c}² − ${Math.min(a, b)}² = ${c * c} − ${Math.min(a, b) ** 2} = ${Math.max(a, b) ** 2}, so the height is ${Math.max(a, b)} m.`, "number", { suffix: "m" });
  }
  if (kind === 2) {
    return typed(`A rectangular field is ${a} m by ${b} m. How long is the path along its diagonal?`, String(c), `The diagonal is the hypotenuse of a right triangle with legs ${a} and ${b}: √(${a * a} + ${b * b}) = √${c * c} = ${c} m.`, "number", { suffix: "m" });
  }
  if (kind === 3) {
    return typed(`A ramp rises ${Math.min(a, b)} m over a horizontal distance of ${Math.max(a, b)} m. How long is the ramp surface?`, String(c), `The ramp is the hypotenuse: √(${a * a} + ${b * b}) = ${c} m.`, "number", { suffix: "m" });
  }
  if (kind === 4) {
    return typed(`A guy wire is attached to the top of a ${Math.max(a, b)} m pole and anchored ${Math.min(a, b)} m from its base. How long is the wire?`, String(c), `The pole and the ground meet at a right angle, so the wire is the hypotenuse: √(${a * a} + ${b * b}) = ${c} m.`, "number", { suffix: "m" });
  }
  void lv;
  const legs = [a, b].sort((x, y) => x - y);
  return typed(`A right triangle has hypotenuse ${c} cm and one leg ${legs[0]} cm. What is its area?`, String((legs[0] * legs[1]) / 2), `Find the other leg: √(${c * c} − ${legs[0] * legs[0]}) = ${legs[1]}. Area = ½ × ${legs[0]} × ${legs[1]} = ${(legs[0] * legs[1]) / 2} cm².`, "decimal", { suffix: "cm²" });
}

function gridDistance(lv: Level): Question {
  const useTriple = lv === 1 || chance(0.5);
  for (let t = 0; t < 200; t++) {
    let dx: number;
    let dy: number;
    if (useTriple) {
      [dx, dy] = pick([[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5]].filter(([x, y]) => x <= 12 && y <= 12));
      if (chance(0.5)) dx = -dx;
      if (chance(0.5)) dy = -dy;
    } else {
      dx = signed(2, 8);
      dy = signed(2, 8);
    }
    const x1 = randInt(-10, 10);
    const y1 = randInt(-10, 10);
    const x2 = x1 + dx;
    const y2 = y1 + dy;
    if (Math.abs(x2) > 10 || Math.abs(y2) > 10) continue;
    const n = dx * dx + dy * dy;
    const visual: Visual = { type: "grid", size: 10, min: -10, points: [{ x: x1, y: y1, label: "A" }, { x: x2, y: y2, label: "B" }] };
    if (isSquare(n)) {
      return typed(`Find the distance between A(${x1}, ${y1}) and B(${x2}, ${y2}).`, String(Math.sqrt(n)), `Draw a right triangle: horizontal leg = |${x2} − ${br(x1)}| = ${Math.abs(dx)}, vertical leg = |${y2} − ${br(y1)}| = ${Math.abs(dy)}. Distance = √(${dx * dx} + ${dy * dy}) = √${n} = ${Math.sqrt(n)}.`, "number", { suffix: "units", visual });
    }
    const r = sqrtTenth(n);
    if (r === undefined) continue;
    return typed(`Find the distance between A(${x1}, ${y1}) and B(${x2}, ${y2}), to the nearest tenth.`, fmt(r), `The legs are ${Math.abs(dx)} and ${Math.abs(dy)}. Distance = √(${dx * dx} + ${dy * dy}) = √${n} ≈ ${fmt(r)} units.`, "decimal", { suffix: "units", visual });
  }
  throw new Error("grid distance");
}

function spaceDiagonal(): Question {
  const [l, w, h, d] = pick([[1, 2, 2, 3], [2, 3, 6, 7], [4, 4, 7, 9], [2, 10, 11, 15], [6, 6, 7, 11], [2, 6, 9, 11]]);
  const q = shuffle([l, w, h]);
  return typed(
    `A box measures ${q[0]} cm by ${q[1]} cm by ${q[2]} cm. How long is the longest straight line that fits inside it, from one corner to the opposite corner?`,
    String(d),
    `First find the diagonal of the base, then use it as a leg with the height: d² = ${q[0]}² + ${q[1]}² + ${q[2]}² = ${l * l + w * w + h * h}, so d = ${d}.`,
    "number",
    { suffix: "cm", visual: { type: "shape", shape: "rectangular-prism" } },
  );
}

function pythagorasLetters(): Question {
  const [p, q, r] = pick([["a", "b", "c"], ["p", "q", "r"], ["x", "y", "z"], ["m", "n", "k"]]);
  return mc(
    `In a right triangle, the legs are ${p} and ${q} and the hypotenuse is ${r}. Which equation is true?`,
    `${p}² + ${q}² = ${r}²`,
    [`${p} + ${q} = ${r}`, `${p}² + ${r}² = ${q}²`, `${p}² − ${q}² = ${r}²`, `${p}² + ${q}² = ${r}`],
    "The hypotenuse is the longest side, opposite the right angle. The squares of the two legs add up to the square of the hypotenuse.",
  );
}

function pythagoras(opts?: GenerateOptions): Question[] {
  return gen(
    [mk(hypotenuse), mk(missingLeg), mk(nonTriple, 2), mk(nonTriple, 2), mk(converse), mk(pythagorasWord), mk(pythagorasWord), mk(gridDistance), mk(spaceDiagonal, 3), mk(pythagorasLetters)],
    opts,
  );
}

// ---------- Financial literacy ----------

function wageQ(lv: Level): Question {
  const w = randInt(15, 38);
  const ot = randInt(2, 12);
  if (lv === 1 || chance(0.4)) {
    const hrs = randInt(12, 40);
    const cents = w * 100 * hrs;
    const { answer, accept } = moneyAnswer(cents);
    return typed(`${pick(NAMES)} earns $${w} per hour and works ${hrs} hours this week. What is the gross pay (before deductions), in dollars?`, answer, `Gross pay = hourly rate × hours = ${w} × ${hrs} = $${answer}.`, "decimal", { accept });
  }
  const cents = w * 100 * 40 + w * 150 * ot;
  const { answer, accept } = moneyAnswer(cents);
  return typed(`A company pays "time and a half" (1.5 times the regular rate) for every hour over 40 in a week. Ravi earns $${w} per hour and works ${40 + ot} hours. What is his gross pay for the week, in dollars?`, answer, `Regular pay: 40 × ${w} = ${40 * w}. Overtime rate: 1.5 × ${w} = ${fmt(1.5 * w)}. Overtime pay: ${ot} × ${fmt(1.5 * w)} = ${fmt(ot * 1.5 * w)}. Total: $${answer}.`, "decimal", { accept });
}

function commissionQ(): Question {
  const base = randInt(8, 24) * 100;
  const rate = pick([2, 3, 4, 5, 6, 8, 10]);
  const sales = randInt(5, 40) * 1000;
  const comm = (sales * rate) / 100;
  const total = base + comm;
  return typed(
    `Amina earns a base salary of ${dollarsText(base)} a month plus a ${rate}% commission on her sales. Last month her sales were ${dollarsText(sales)}. What was her total pay for the month, in dollars?`,
    String(total),
    `Commission = ${rate}% of ${sales} = ${comm}. Total = base + commission = ${base} + ${comm} = ${total}.`,
    "number",
  );
}

function netPayQ(): Question {
  const gross = pick([1200, 1500, 1800, 2000, 2400, 2600, 3000, 3200]);
  const p1 = randInt(10, 22);
  const p2 = pick([5, 6, 7]);
  const flat = pick([20, 25, 35, 40, 60]);
  const taxes = (gross * (p1 + p2)) / 100;
  const net = gross - taxes - flat;
  return typed(
    `A paycheque shows gross pay of ${dollarsText(gross)}. Deductions are ${p1}% for income tax, ${p2}% for pension and insurance, and a flat $${flat} for benefits. What is the net pay, in dollars?`,
    String(net),
    `Percent deductions: ${p1 + p2}% of ${gross} = ${taxes}. Take away the flat amount too: ${gross} − ${taxes} − ${flat} = ${net}.`,
    "number",
  );
}

function budgetPercent(): Question {
  const income = pick([2400, 2800, 3000, 3200, 3600, 4000, 4500]);
  const kind = randInt(1, 3);
  if (kind === 1) {
    const p = pick([25, 30, 35, 40]);
    return typed(`Jay's monthly income after tax is ${dollarsText(income)}. He budgets ${p}% for rent. How much is that, in dollars?`, String((income * p) / 100), `${p}% of ${income} = ${income} × ${p / 100} = ${(income * p) / 100}.`, "number");
  }
  if (kind === 2) {
    const p = pick([5, 10, 15, 20, 25, 30]);
    const amt = (income * p) / 100;
    return typed(`A family spends ${dollarsText(amt)} on groceries each month out of an after-tax income of ${dollarsText(income)}. What percent of their income is that?`, String(p), `Percent = amount ÷ income × 100 = ${amt} ÷ ${income} × 100 = ${p}%.`, "number", { suffix: "%" });
  }
  const needs = (income * 50) / 100;
  const wants = (income * 30) / 100;
  const savings = income - needs - wants;
  return mc(
    `A popular budgeting guideline suggests 50% of income for needs, 30% for wants and 20% for savings. With ${dollarsText(income)} a month, how much goes to savings?`,
    dollarsText(savings),
    [dollarsText(needs), dollarsText(wants), dollarsText(income * 2), dollarsText(income - savings)],
    `20% of ${income} = ${income} × 0.20 = ${savings}.`,
  );
}

function fixedVariable(): Question {
  return sortQuestion(
    {
      prompt: "Sort these expenses: fixed (about the same every month) or variable (changes)?",
      hint: "Fixed expenses stay the same each month, like rent or a subscription. Variable expenses change with how much you use or buy.",
      bins: [
        { id: "fixed", label: "Fixed", emoji: "📌" },
        { id: "variable", label: "Variable", emoji: "📈" },
      ],
      items: [
        { label: "Rent", emoji: "🏠", bin: "fixed" },
        { label: "Monthly transit pass", emoji: "🚌", bin: "fixed" },
        { label: "Insurance premium", emoji: "🛡️", bin: "fixed" },
        { label: "Streaming subscription", emoji: "📺", bin: "fixed" },
        { label: "Groceries", emoji: "🛒", bin: "variable" },
        { label: "Electricity bill", emoji: "💡", bin: "variable" },
        { label: "Eating out", emoji: "🍜", bin: "variable" },
        { label: "Fuel for a car", emoji: "⛽", bin: "variable" },
      ],
    },
    3,
  );
}

function simpleInterest(lv: Level): Question {
  const P = randInt(2, 40) * 100;
  const r = randInt(2, 9);
  const t = randInt(1, lv === 1 ? 3 : 6);
  const I = P * r * t; // cents
  const kind = lv === 1 ? 1 : randInt(1, 3);
  if (kind === 1) {
    const { answer, accept } = moneyAnswer(I);
    return typed(`You invest ${dollarsText(P)} at ${r}% simple interest per year. How much interest do you earn in ${plural(t, "year")}?`, answer, `I = Prt = ${P} × ${r / 100} × ${t} = $${answer}.`, "decimal", { accept });
  }
  if (kind === 2) {
    return typed(`A loan of ${dollarsText(P)} earns ${dollarsText(I / 100)} in simple interest over ${plural(t, "year")}. What is the annual interest rate, as a percent?`, String(r), `I = Prt, so r = I ÷ (P × t) = ${I / 100} ÷ (${P} × ${t}) = ${fmt(I / 100 / (P * t))} = ${r}%.`, "number", { suffix: "%" });
  }
  return typed(`How many years does it take ${dollarsText(P)} to earn ${dollarsText(I / 100)} in simple interest at ${r}% per year?`, String(t), `I = Prt, so t = I ÷ (P × r) = ${I / 100} ÷ (${P} × ${r / 100}) = ${t} years.`, "number", { suffix: "years" });
}

function compoundQ(lv: Level): Question {
  for (let tries = 0; tries < 100; tries++) {
    const P = randInt(1, 20) * 100;
    const r = pick([2, 3, 4, 5, 6, 8, 10]);
    const years = lv === 3 ? 3 : 2;
    let bal = P * 100;
    const path = [bal];
    let ok = true;
    for (let y = 0; y < years; y++) {
      if ((bal * (100 + r)) % 100 === 50) ok = false;
      bal = Math.round((bal * (100 + r)) / 100);
      path.push(bal);
    }
    if (!ok) continue;
    const simple = P * 100 + P * r * years;
    const kind = lv === 1 ? 1 : randInt(1, 2);
    if (kind === 1) {
      const { answer, accept } = moneyAnswer(path[years]);
      return typed(
        `${dollarsText(P)} is invested at ${r}% interest compounded annually. What is the balance after ${years} years? (Round to the nearest cent each year.)`,
        answer,
        `Year 1: ${exactMoney(path[0])} × ${(100 + r) / 100} = ${exactMoney(path[1])}. ${years > 1 ? `Year 2: ${exactMoney(path[1])} × ${(100 + r) / 100} = ${exactMoney(path[2])}. ` : ""}${years > 2 ? `Year 3: ${exactMoney(path[2])} × ${(100 + r) / 100} = ${exactMoney(path[3])}. ` : ""}Each year the interest is added to the balance, so it earns interest too.`,
        "decimal",
        { accept },
      );
    }
    const diff = path[years] - simple;
    const { answer, accept } = moneyAnswer(diff);
    return typed(
      `${dollarsText(P)} is invested for ${years} years at ${r}% per year. How much more interest does compound interest (compounded annually) earn than simple interest? (Round to the nearest cent each year.)`,
      answer,
      `Simple: ${P} × ${r / 100} × ${years} = ${exactMoney(P * r * years)}. Compound balance: ${exactMoney(path[years])}, so compound interest = ${exactMoney(path[years] - path[0])}. Difference: $${answer}.`,
      "decimal",
      { accept },
    );
  }
  throw new Error("compound");
}

function discountTax(): Question {
  for (let t = 0; t < 200; t++) {
    const priceDollars = randInt(4, 40) * 5;
    const d = pick([10, 15, 20, 25, 30, 40]);
    const tax = pick([5, 7, 12]);
    const priceC = priceDollars * 100;
    const offC = (priceC * d) / 100;
    const saleC = priceC - offC;
    const taxC = (saleC * tax) / 100;
    if (!Number.isInteger(offC) || !Number.isInteger(taxC)) continue;
    const total = saleC + taxC;
    const { answer, accept } = moneyAnswer(total);
    return typed(
      `A jacket is priced at $${priceDollars}. It is ${d}% off, and then ${tax}% sales tax is added to the sale price. What is the final cost, in dollars?`,
      answer,
      `Discount: ${d}% of ${priceDollars} = ${exactMoney(offC)}. Sale price: ${exactMoney(saleC)}. Tax: ${tax}% of ${exactMoney(saleC)} = ${exactMoney(taxC)}. Total: $${answer}.`,
      "decimal",
      { accept },
    );
  }
  throw new Error("discount");
}

function bestBuy(): Question {
  const sizes = shuffle([300, 400, 500, 600, 750, 1000]).slice(0, 3).sort((a, b) => a - b);
  const unit = sample(Array.from({ length: 16 }, (_, i) => 60 + i * 12), 3); // cents per 100 g
  const opts = sizes.map((g, i) => ({ g, cents: (unit[i] * g) / 100, u: unit[i] }));
  const best = opts.reduce((a, b) => (b.u < a.u ? b : a));
  const label = (o: { g: number; cents: number }) => `${groupDigits(String(o.g))} g for ${exactMoney(Math.round(o.cents))}`;
  if (opts.some((o) => !Number.isInteger(o.cents))) return bestBuy();
  return mc(
    "Which is the best buy (lowest price per 100 g)?",
    label(best),
    opts.filter((o) => o !== best).map(label),
    `Divide each price by the number of 100 g units: ${opts.map((o) => `${exactMoney(o.cents)} ÷ ${o.g / 100} = ${exactMoney(o.u)} per 100 g`).join("; ")}.`,
  );
}

function taxBrackets(): Question {
  const t1 = pick([40, 50, 60]) * 1000;
  const r1 = pick([8, 10, 12]);
  const r2 = r1 + pick([4, 5, 6, 8]);
  const inc = t1 + randInt(1, 5) * 10000;
  const tax = (t1 * r1) / 100 + ((inc - t1) * r2) / 100;
  return typed(
    `In a simple tax system, the first ${dollarsText(t1)} of income is taxed at ${r1}% and any income above that is taxed at ${r2}%. How much tax is owed on an income of ${dollarsText(inc)}?`,
    String(tax),
    `Tax on the first part: ${r1}% of ${t1} = ${(t1 * r1) / 100}. Income above ${t1}: ${inc - t1}, taxed at ${r2}% = ${((inc - t1) * r2) / 100}. Add: ${tax}. (The higher rate applies only to the extra income.)`,
    "number",
  );
}

function financeConcept(): Question {
  const items: { prompt: string; right: string; wrong: string[]; hint: string }[] = [
    { prompt: "Which pays more after several years: $1 000 at 5% simple interest or at 5% compounded annually?", right: "Compounded annually, because interest earns interest", wrong: ["Simple interest, because it is simpler", "They always pay exactly the same", "It depends only on the amount invested"], hint: "Compounding adds each year's interest to the balance, so next year's interest is calculated on a larger amount." },
    { prompt: "What is the difference between gross pay and net pay?", right: "Gross is before deductions; net is what you take home", wrong: ["Gross is what you take home; net is before deductions", "Gross is only overtime pay; net is regular pay", "They are two names for the same amount"], hint: "Net pay is what is left after taxes and other deductions come off gross pay." },
    { prompt: "A person pays off only the minimum on a credit card each month. What is the most likely result?", right: "Interest keeps adding up, so the debt costs much more over time", wrong: ["The debt is paid off faster", "No interest is charged", "The balance never changes"], hint: "Interest is charged on the unpaid balance, and small payments leave most of it unpaid." },
    { prompt: "Which is the best example of a financial goal that is specific and measurable?", right: "Save $600 for a laptop in 8 months", wrong: ["Save some money soon", "Be rich someday", "Spend less on things"], hint: "A measurable goal has an amount and a deadline, so you can check your progress." },
  ];
  const q = pick(items);
  return mc(q.prompt, q.right, q.wrong, q.hint);
}

function financialLiteracy(opts?: GenerateOptions): Question[] {
  return gen(
    [mk(wageQ), mk(wageQ), mk(commissionQ), mk(netPayQ), mk(budgetPercent), mk(budgetPercent), mk(fixedVariable), mk(simpleInterest), mk(simpleInterest), mk(compoundQ), mk(discountTax, 2), mk(bestBuy), mk(taxBrackets, 3), mk(financeConcept)],
    opts,
  );
}

// ---------- Data and probability ----------

function probAnswer(prompt: string, count: number, total: number, hint: string, visual?: Visual): Question {
  const r = rat(count, total);
  const accept = [...equivalents(r), ...(count / gcd(count, total) !== count ? [`${count}/${total}`] : [])].filter((a) => a.length <= 9);
  return typed(prompt, rs(r), hint, "fraction", { accept: r.d === 1 ? [] : accept, visual });
}

function vennQ(lv: Level): Question {
  const onlyA = randInt(4, 18);
  const both = randInt(2, 10);
  const onlyB = randInt(3, 16);
  const neither = randInt(1, 9);
  const total = onlyA + both + onlyB + neither;
  const [A, B] = pick([["soccer", "basketball"], ["art", "music"], ["swimming", "running"], ["chess", "robotics"]]);
  const kind = lv === 1 ? 1 : randInt(1, 4);
  const visual: Visual = {
    type: "table",
    title: `Students in clubs (${total} students)`,
    headers: ["Region of the Venn diagram", "Students"],
    rows: [[`${A} only`, onlyA], [`${A} and ${B}`, both], [`${B} only`, onlyB], ["Neither", neither]],
  };
  if (kind === 1) return typed(`How many students do ${A}? (Include those who also do ${B}.)`, String(onlyA + both), `Everyone in the ${A} circle counts: ${onlyA} (only) + ${both} (both) = ${onlyA + both}.`, "number", { visual });
  if (kind === 2) return typed(`How many students do at least one of ${A} or ${B}?`, String(onlyA + both + onlyB), `Add the three shaded regions, without counting the overlap twice: ${onlyA} + ${both} + ${onlyB} = ${onlyA + both + onlyB}.`, "number", { visual });
  if (kind === 3) return typed(`How many students do exactly one of ${A} or ${B}, but not both?`, String(onlyA + onlyB), `Leave out the overlap: ${onlyA} + ${onlyB} = ${onlyA + onlyB}.`, "number", { visual });
  const a = onlyA + both;
  const b = onlyB + both;
  return typed(`In a group of ${total} students, ${a} do ${A}, ${b} do ${B}, and ${both} do both. How many do neither?`, String(neither), `Students in at least one club = ${a} + ${b} − ${both} (subtract the overlap so it isn't counted twice) = ${a + b - both}. Neither = ${total} − ${a + b - both} = ${neither}.`, "number");
}

function independentQ(lv: Level): Question {
  const mode = lv === 3 ? randInt(1, 3) : randInt(1, 2);
  if (mode === 1) {
    const [stuff, c1, c2] = pick([["marbles", "red", "blue"], ["tiles", "green", "yellow"], ["beads", "black", "white"]]);
    const r = randInt(2, 6);
    const b = randInt(2, 6);
    const n = r + b;
    const first = pick([c1, c2]);
    const second = pick([c1, c2]);
    const f1 = first === c1 ? r : b;
    const f2 = second === c1 ? r : b;
    return probAnswer(`A bag has ${r} ${c1} and ${b} ${c2} ${stuff}. You draw one, note its colour, put it back, and draw again. What is the probability of drawing ${first} and then ${second}?`, f1 * f2, n * n, `The draws are independent because of the replacement. Multiply: P = (${f1}/${n}) × (${f2}/${n}) = ${f1 * f2}/${n * n}.`);
  }
  if (mode === 2) {
    const [A, pa, ca] = pick([["a coin lands heads", 1, 2], ["a die shows an even number", 3, 6], ["a die shows a number greater than 4", 2, 6]] as [string, number, number][]);
    const [B, pb, cb] = pick([["a spinner with 4 equal sections numbered 1 to 4 lands on 3", 1, 4], ["a coin lands tails", 1, 2], ["a die shows a 6", 1, 6]] as [string, number, number][]);
    return probAnswer(`Event 1: ${A}. Event 2: ${B}. Both are done once, independently. What is the probability that both happen?`, pa * pb, ca * cb, `Independent events: multiply the probabilities. (${pa}/${ca}) × (${pb}/${cb}) = ${pa * pb}/${ca * cb}, then simplify.`);
  }
  const r = randInt(3, 6);
  const b = randInt(2, 5);
  const n = r + b;
  return probAnswer(`A bag has ${r} red and ${b} blue marbles. You draw two marbles WITHOUT putting the first back. What is the probability that both are red?`, r * (r - 1), n * (n - 1), `After a red marble is removed, there are ${r - 1} red among ${n - 1} left. P = (${r}/${n}) × (${r - 1}/${n - 1}) = ${r * (r - 1)}/${n * (n - 1)}.`);
}

function outcomeCount(): Question {
  const kind = randInt(1, 3);
  if (kind === 1) {
    const a = randInt(2, 5);
    const b = randInt(2, 4);
    const c = randInt(2, 5);
    return typed(`A café offers ${a} sandwiches, ${b} soups and ${c} drinks. A meal is one of each. How many different meals are possible?`, String(a * b * c), `Multiply the choices at each step (the counting principle): ${a} × ${b} × ${c} = ${a * b * c}.`, "number");
  }
  if (kind === 2) {
    const n = randInt(3, 6);
    return typed(`A coin is flipped ${n} times. How many different sequences of heads and tails are possible?`, String(2 ** n), `Each flip has 2 outcomes, so there are 2 × 2 × … (${n} times) = 2${sup(n)} = ${2 ** n}.`, "number");
  }
  return typed("Two fair dice are rolled. How many different outcomes are possible?", "36", "The first die has 6 outcomes and the second has 6, so 6 × 6 = 36. A tree diagram or table shows them all.", "number");
}

function diceQ(lv: Level): Question {
  const preds: { text: string; f: (a: number, b: number) => boolean; hint: string }[] = [
    { text: "the sum is 7", f: (a, b) => a + b === 7, hint: "List the pairs that add to 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1)." },
    { text: "the sum is 9", f: (a, b) => a + b === 9, hint: "List the pairs that add to 9: (3,6), (4,5), (5,4), (6,3)." },
    { text: "the sum is 4", f: (a, b) => a + b === 4, hint: "List the pairs that add to 4: (1,3), (2,2), (3,1)." },
    { text: "both dice show the same number", f: (a, b) => a === b, hint: "The doubles are (1,1), (2,2), … (6,6)." },
    { text: "at least one die shows a 6", f: (a, b) => a === 6 || b === 6, hint: "Count the outcomes with a 6 on either die, being careful not to count (6,6) twice." },
    { text: "the sum is greater than 9", f: (a, b) => a + b > 9, hint: "Sums of 10, 11 or 12: (4,6), (5,5), (6,4), (5,6), (6,5), (6,6)." },
    { text: "the product is even", f: (a, b) => (a * b) % 2 === 0, hint: "A product is odd only when BOTH numbers are odd. Count those and subtract from 36." },
    { text: "the sum is a prime number", f: (a, b) => [2, 3, 5, 7, 11].includes(a + b), hint: "The prime sums are 2, 3, 5, 7 and 11. Count the ways to make each." },
  ];
  const easy = preds.slice(0, 4);
  const p = pick(lv === 1 ? easy : preds);
  let count = 0;
  for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (p.f(a, b)) count++;
  return probAnswer(`Two fair six-sided dice are rolled. What is the probability that ${p.text}?`, count, 36, `${p.hint} That is ${count} out of 36 outcomes.`);
}

function coinsQ(): Question {
  const n = 3;
  const opts: { text: string; f: (h: number) => boolean; hint: string }[] = [
    { text: "exactly two heads", f: (h) => h === 2, hint: "The outcomes are HHT, HTH, THH: 3 of the 8 possible sequences." },
    { text: "at least one head", f: (h) => h >= 1, hint: "Easier: P(at least one head) = 1 − P(no heads) = 1 − 1/8." },
    { text: "all three the same", f: (h) => h === 0 || h === 3, hint: "Only HHH and TTT: 2 of 8." },
    { text: "at most one tail", f: (h) => h >= 2, hint: "At most one tail means 3 heads or 2 heads: HHH, HHT, HTH, THH." },
  ];
  const p = pick(opts);
  let count = 0;
  for (let i = 0; i < 2 ** n; i++) {
    const h = i.toString(2).split("").filter((c) => c === "1").length;
    if (p.f(h)) count++;
  }
  return probAnswer(`A fair coin is flipped ${n} times. What is the probability of ${p.text}?`, count, 2 ** n, p.hint);
}

function orQ(lv: Level): Question {
  const kind = randInt(1, lv === 1 ? 1 : 2);
  if (kind === 1) {
    const N = pick([10, 12, 20]);
    const preds: { text: string; f: (n: number) => boolean }[] = [
      { text: "an even number", f: (n) => n % 2 === 0 },
      { text: "a multiple of 3", f: (n) => n % 3 === 0 },
      { text: "a number greater than 7", f: (n) => n > 7 },
      { text: "a number less than 4", f: (n) => n < 4 },
      { text: "a multiple of 5", f: (n) => n % 5 === 0 },
    ];
    const [p1, p2] = sample(preds, 2);
    let count = 0;
    let both = 0;
    for (let n = 1; n <= N; n++) {
      if (p1.f(n) || p2.f(n)) count++;
      if (p1.f(n) && p2.f(n)) both++;
    }
    return probAnswer(`A spinner has ${N} equal sections numbered 1 to ${N}. What is the probability that it lands on ${p1.text} OR ${p2.text}?`, count, N, `List the numbers that work for either condition, counting each number once${both ? " (some numbers fit both)" : ""}. There are ${count} out of ${N}.`);
  }
  const options: { text: string; count: number; hint: string }[] = [
    { text: "a king or a heart", count: 16, hint: "4 kings + 13 hearts − 1 king of hearts (counted twice) = 16." },
    { text: "a red card or a face card (jack, queen, king)", count: 32, hint: "26 red cards + 12 face cards − 6 red face cards = 32." },
    { text: "an ace or a spade", count: 16, hint: "4 aces + 13 spades − 1 ace of spades = 16." },
    { text: "a queen or a black card", count: 28, hint: "4 queens + 26 black cards − 2 black queens = 28." },
  ];
  const o = pick(options);
  return probAnswer(`One card is drawn from a standard 52-card deck. What is the probability of drawing ${o.text}?`, o.count, 52, `Use P(A or B) = P(A) + P(B) − P(A and B). ${o.hint} So ${o.count}/52.`);
}

function complementQ(): Question {
  if (chance(0.5)) {
    const p = randInt(1, 19) * 5;
    return typed(`The probability of rain tomorrow is ${p}%. What is the probability that it does NOT rain, as a percent?`, String(100 - p), `P(not A) = 1 − P(A), so 100% − ${p}% = ${100 - p}%.`, "number", { suffix: "%" });
  }
  const d = pick([6, 8, 10, 12]);
  const n = randInt(1, d - 1);
  return probAnswer(`The probability of winning a game is ${n}/${d}. What is the probability of NOT winning?`, d - n, d, `P(not winning) = 1 − ${n}/${d} = ${d - n}/${d}.`);
}

function experimentalQ(): Question {
  if (chance(0.5)) {
    const trials = pick([50, 100, 200, 250]);
    const hits = randInt(2, trials / 5) * 2;
    return probAnswer(`A basketball player makes ${hits} of ${trials} free throws in practice. What is the experimental probability that she makes the next one?`, hits, trials, `Experimental probability = successes ÷ trials = ${hits}/${trials}. Simplify the fraction.`);
  }
  const num = pick([1, 1, 2, 3]);
  const den = pick([4, 5, 6, 10]);
  const total = den * pick([20, 30, 50]);
  return typed(`The probability that a bulb is faulty is ${num}/${den}. Out of ${total} bulbs, about how many would you expect to be faulty?`, String((total * num) / den), `Expected number = probability × total = ${num}/${den} × ${total} = ${(total * num) / den}.`, "number");
}

interface Item {
  level: Level;
  prompt: string;
  right: string;
  wrong: string[];
  hint: string;
  visual?: Visual;
}

const GRAPH_ITEMS: Item[] = [
  { level: 1, prompt: "A bar graph shows Model A phones at 52 sales and Model B phones at 54 sales, but the vertical axis starts at 50. Why is this misleading?", right: "A small difference looks huge because the axis does not start at zero", wrong: ["The bars are different colours", "Bar graphs cannot compare two items", "The graph has a title"], hint: "When an axis is cut off, the bars no longer show how big the values are compared with each other." },
  { level: 1, prompt: "A graph has no title, no axis labels and no units. What is the main problem?", right: "Readers cannot tell what the data measures", wrong: ["The data must be wrong", "Graphs should always use pie charts", "There are too many numbers"], hint: "A graph must say what is measured and in what units, or it can't be interpreted." },
  { level: 1, prompt: "A survey about longer lunch breaks is given only to students standing in the lunch line. What is wrong with this sample?", right: "It is biased: it only asks students who are already at lunch", wrong: ["It is too large", "Surveys should never ask students", "It is random, so it is fair"], hint: "A fair sample should represent the whole group, not just people who are likely to give one answer." },
  { level: 1, prompt: "A pie chart has four sections labelled 40%, 35%, 25% and 15%. What is wrong with it?", right: "The percentages add to 115%, not 100%", wrong: ["Pie charts cannot show percentages", "There should be five sections", "The largest section is too big"], hint: "In a pie chart, all parts add up to one whole: 100%. Add them to check." },
  { level: 2, prompt: "A line graph of a town's population shows only the last 2 years of a 20-year decline, and those 2 years happen to rise slightly. What is misleading?", right: "A short time window hides the long-term trend", wrong: ["Line graphs must show exactly 5 years", "Rising lines are always wrong", "Nothing, since the data is accurate"], hint: "Choosing a small slice of data can tell a different story than the whole picture." },
  { level: 2, prompt: "On a vertical axis the labels are 0, 10, 20, 50, 100 spaced equally. Why is this a problem?", right: "Equal spaces stand for unequal amounts, which distorts the shape of the data", wrong: ["Axes must start at 10", "Axes must have exactly four labels", "Equal spacing is always misleading"], hint: "A scale should use the same step each time so distances on the graph match differences in the data." },
  { level: 2, prompt: "A pictograph shows sales doubling by drawing the icon twice as tall AND twice as wide. Why is this misleading?", right: "The icon's area becomes four times as large, so it looks like four times the sales", wrong: ["Icons cannot be used in graphs", "The icon should be three times as wide", "Doubling is not allowed"], hint: "When both dimensions double, the area grows by 2 × 2 = 4." },
  { level: 2, prompt: "A company graph squeezes the vertical axis so a rise from 1.0 to 1.2 looks flat, while a competitor's identical rise uses a stretched axis. What technique is being used?", right: "Using different scales to exaggerate or hide changes", wrong: ["Random sampling", "Plotting a median", "Adding a legend"], hint: "To compare fairly, graphs should use the same scale." },
  { level: 2, prompt: "A 3-D pie chart tilts so the front slice looks larger than a slice with the same value at the back. What is the issue?", right: "The perspective distorts how large each part appears", wrong: ["Pie charts cannot show 3 values", "Every slice must be the same size", "The colours are too bright"], hint: "3-D effects change apparent sizes, making accurate comparison hard." },
  { level: 3, prompt: "A graph shows ice cream sales and swimming accidents both rise in summer. Which conclusion is best supported?", right: "Hot weather probably affects both; one does not necessarily cause the other", wrong: ["Ice cream causes swimming accidents", "Swimming accidents cause ice cream sales", "The two are exactly unrelated"], hint: "Two things rising together (correlation) doesn't prove one causes the other; a third factor may explain both." },
  { level: 3, prompt: "A company has 9 employees earning $40 000 each and an owner earning $400 000. The ad says, “Our average salary is $76 000!” Which statistic better shows a typical salary?", right: "The median, $40 000, because one very high value pulls the mean up", wrong: ["The mean, because it uses all the data and is never misleading", "The range, $360 000", "The highest salary, $400 000"], hint: "A very high or low value (an outlier) pulls the mean toward it. The median stays in the middle." },
  { level: 3, prompt: "Which survey method will give the most reliable estimate of what all students in a school think?", right: "Randomly choose students from the full school list", wrong: ["Ask only your friends", "Post an online poll that anyone can answer many times", "Ask only students in one club"], hint: "Random selection from the whole group gives every student an equal chance, reducing bias." },
  { level: 3, prompt: "A price rose 20% in one month and then fell 20% the next. A graph labelled only “+20%” and “−20%” makes it look like the price ended where it started. Why is that wrong?", right: "A 20% rise followed by a 20% drop is applied to different amounts, so the price ends lower", wrong: ["The two percentages always cancel out", "Percentages cannot be negative", "The second change is always bigger"], hint: "Try $100: +20% gives $120, then −20% of $120 is $24 off, giving $96, not $100." },
];

function choose<T extends { level: Level }>(items: readonly T[], level: Level, count: number): T[] {
  const main = shuffle(items.filter((i) => i.level === level));
  const near = shuffle(items.filter((i) => Math.abs(i.level - level) === 1));
  const take = Math.min(main.length, Math.ceil(count * 0.65));
  const picked = [...main.slice(0, take), ...near.slice(0, count - take)];
  if (picked.length < count) picked.push(...shuffle(items.filter((i) => !picked.includes(i))).slice(0, count - picked.length));
  return shuffle(picked);
}

function dataProbability(opts?: GenerateOptions): Question[] {
  const lv = levelOf(opts);
  const graphQs = choose(GRAPH_ITEMS, lv, 2).map((i) => mc(i.prompt, i.right, i.wrong, i.hint));
  return [
    ...graphQs,
    ...gen(
      [mk(vennQ), mk(vennQ), mk(independentQ), mk(independentQ, 2), mk(outcomeCount), mk(diceQ), mk(coinsQ), mk(orQ), mk(complementQ), mk(experimentalQ)],
      opts,
      6,
    ),
  ];
}

// ---------- Course ----------

export const course: Course = {
  grade: "9",
  subject: "math",
  bigIdeas: {
    "ca-bc": [
      "The principles and processes underlying operations with numbers apply equally to algebra.",
      "Algebra allows us to generalize relationships through abstract thinking.",
      "Proportional reasoning is used to describe and compare quantities and relationships, including those that are not linear.",
      "Analyzing and applying geometric relationships enables us to describe, measure and compare spatial objects, including similar figures.",
      "Analyzing data and probabilities with a critical eye helps us to make informed decisions about situations of uncertainty.",
    ],
  },
  units: [
    {
      id: "rational-numbers",
      title: "Rational Numbers",
      emoji: "➗",
      blurb: "Fractions and decimals, positive and negative",
      parentNote: "Adding, subtracting, multiplying and dividing positive and negative fractions and decimals, ordering rational numbers, and using the order of operations.",
      standards: { "ca-bc": "Number: operations with rational numbers (fractions and decimals, positive and negative); order of operations" },
      generate: rationalNumbers,
    },
    {
      id: "exponent-laws",
      title: "Exponent Laws",
      emoji: "⚡",
      blurb: "Powers, zero, negatives and big numbers",
      parentNote: "The exponent laws (product, quotient, power of a power), zero and negative exponents, evaluating powers, and scientific notation for very large and very small numbers.",
      standards: { "ca-bc": "Number: exponent laws and powers with integral exponents; scientific notation" },
      generate: exponentLaws,
    },
    {
      id: "polynomials",
      title: "Polynomials",
      emoji: "🧮",
      blurb: "Terms, degree and algebra skills",
      parentNote: "Identifying terms, degree and coefficients; adding and subtracting polynomials; multiplying and dividing a polynomial by a monomial or constant; evaluating and applying polynomials to rectangles.",
      standards: { "ca-bc": "Algebra: polynomials (add, subtract, multiply and divide by a monomial or constant)" },
      generate: polynomials,
    },
    {
      id: "linear-relations",
      title: "Linear Relations",
      emoji: "📈",
      blurb: "Slope, graphs and rates of change",
      parentNote: "Slope as rate of change, reading and writing linear equations from graphs, tables and word problems, intercepts, and graphing with y = mx + b.",
      standards: { "ca-bc": "Algebra: linear relations (slope, rate of change, intercepts, graphing, writing equations in slope-intercept and general form)" },
      generate: linearRelations,
    },
    {
      id: "linear-equations",
      title: "Solving Equations",
      emoji: "⚖️",
      blurb: "Multi-step linear equations",
      parentNote: "Solving multi-step linear equations with variables on both sides, brackets, fractions and decimals, and writing equations from word problems.",
      standards: { "ca-bc": "Algebra: solving multi-step one-variable linear equations (including brackets, fractions and variables on both sides)" },
      generate: linearEquations,
    },
    {
      id: "similar-figures",
      title: "Similar Figures",
      emoji: "🔍",
      blurb: "Scale factors and enlargements",
      parentNote: "Scale factor, finding missing sides of similar figures, scale on maps and drawings, and how perimeter and area change when a shape is enlarged.",
      standards: { "ca-bc": "Geometry and measurement: similar polygons, scale factors and scale diagrams" },
      generate: similarFigures,
    },
    {
      id: "surface-area-volume",
      title: "Surface Area & Volume",
      emoji: "📦",
      blurb: "Prisms, cylinders, cones and spheres",
      parentNote: "Surface area and volume of prisms, composite objects, cylinders, cones and spheres, with answers in terms of π and rounded.",
      standards: { "ca-bc": "Geometry and measurement: surface area and volume of 3-D objects (prisms, cylinders, cones, spheres, composite objects)" },
      generate: surfaceVolume,
    },
    {
      id: "pythagorean-theorem",
      title: "Pythagorean Theorem",
      emoji: "📐",
      blurb: "Right triangles in the real world",
      parentNote: "Using a² + b² = c² to find sides of right triangles, check for right angles, and solve problems about ladders, ramps, diagonals and distance on a grid.",
      standards: { "ca-bc": "Geometry and measurement: the Pythagorean theorem and its applications" },
      generate: pythagoras,
    },
    {
      id: "financial-literacy",
      title: "Money Smarts",
      emoji: "💰",
      blurb: "Pay, budgets and interest",
      parentNote: "Gross and net income, overtime and commission, budgeting with percents, simple and compound interest, discounts, tax and comparing prices.",
      standards: { "ca-bc": "Financial literacy: income, taxes, budgeting, simple and compound interest, and consumer decisions" },
      generate: financialLiteracy,
    },
    {
      id: "data-probability",
      title: "Data & Probability",
      emoji: "🎲",
      blurb: "Chance, Venn diagrams, spotting spin",
      parentNote: "Probability of compound events (independent and dependent), Venn diagrams, counting outcomes, and spotting misleading graphs and biased samples.",
      standards: { "ca-bc": "Statistics and probability: probability of independent events, Venn diagrams, and critically evaluating data displays" },
      generate: dataProbability,
    },
  ],
};
