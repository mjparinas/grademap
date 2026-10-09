import { sortQuestion } from "../../bank";
import { chance, pick, randInt, sample, textChoice } from "../../random";
import type { Course, GenerateOptions, InputQuestion, OrderQuestion, Question, Visual } from "../../types";

// BC Pre-calculus 11. Everything here is generated: answers are computed from the same numbers that
// appear in the prompt, and distractors come from common slips (sign errors, forgetting to flip, ...).

type Level = 1 | 2 | 3;
const levelOf = (opts?: GenerateOptions): Level => opts?.difficulty ?? 2;

type Maker = [Level, (lv: Level) => Question | undefined];

/** Build `n` distinct questions, favouring makers at the requested level and limiting repeats. */
function build(makers: Maker[], level: Level, n = 8): Question[] {
  const pool: Maker[1][] = [];
  const near = makers.filter(([l]) => Math.abs(l - level) <= 1).length;
  for (const [l, f] of makers) {
    const d = Math.abs(l - level);
    if (d >= 2 && near >= n + 2) continue;
    const weight = d === 0 ? 4 : d === 1 ? 2 : 1;
    for (let i = 0; i < weight; i++) pool.push(f);
  }
  const out: Question[] = [];
  const seen = new Set<string>();
  const used = new Map<Maker[1], number>();
  for (let i = 0; i < 400 && out.length < n; i++) {
    const f = pick(pool);
    if ((used.get(f) ?? 0) >= (i < 150 ? 1 : 2)) continue;
    const q = f(level);
    if (!q || seen.has(q.prompt)) continue;
    seen.add(q.prompt);
    used.set(f, (used.get(f) ?? 0) + 1);
    out.push(q);
  }
  return out;
}

// ---------- formatting helpers ----------

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
/** Number with a true minus sign. */
const M = (n: number): string => (n < 0 ? `−${-n}` : `${n}`);
/** Number in parentheses when negative. */
const P = (n: number): string => (n < 0 ? `(−${-n})` : `${n}`);

/** "3x² − x + 5" from [coefficient, variable] pairs; zero terms are dropped. */
function poly(terms: [number, string][]): string {
  const t = terms.filter(([c]) => c !== 0);
  if (t.length === 0) return "0";
  return t
    .map(([c, v], i) => {
      const a = Math.abs(c);
      const body = v === "" ? `${a}` : a === 1 ? v : `${a}${v}`;
      if (i === 0) return `${c < 0 ? "−" : ""}${body}`;
      return ` ${c < 0 ? "−" : "+"} ${body}`;
    })
    .join("");
}
const fac = (p: number): string => `(x ${p < 0 ? "−" : "+"} ${Math.abs(p)})`;
const frac = (n: number, d: number): string => {
  const g = gcd(n, d) || 1;
  let a = n / g;
  let b = d / g;
  if (b < 0) {
    a = -a;
    b = -b;
  }
  return b === 1 ? M(a) : `${M(a)}/${b}`;
};
/** Largest perfect-square factor pulled out: [outside, inside]. */
function simplifyRad(n: number): [number, number] {
  let out = 1;
  let inn = n;
  for (let f = 2; f * f <= inn; f++) {
    while (inn % (f * f) === 0) {
      out *= f;
      inn /= f * f;
    }
  }
  return [out, inn];
}
/** c√r, with coefficient 1 and radicand 1 dropped. */
function radS(c: number, r: number): string {
  const s = c < 0 ? "−" : "";
  const a = Math.abs(c);
  if (r === 1) return `${s}${a}`;
  return `${s}${a === 1 ? "" : a}√${r}`;
}
/** c√n written in simplest form. */
function radAuto(c: number, n: number): string {
  const [o, i] = simplifyRad(n);
  return radS(c * o, i);
}
const sortedRoots = (p: number, q: number): [number, number] => (p <= q ? [p, q] : [q, p]);
const rootsLabel = (p: number, q: number): string => {
  const [a, b] = sortedRoots(p, q);
  return `x = ${M(a)} or x = ${M(b)}`;
};
/** Vertex form text: y = a(x − h)² + k */
function vf(a: number, h: number, k: number): string {
  const inner = h === 0 ? "x" : `(x ${h < 0 ? "+" : "−"} ${Math.abs(h)})`;
  const sq = h === 0 ? "x²" : `${inner}²`;
  const lead = a === 1 ? "" : a === -1 ? "−" : M(a);
  return `y = ${lead}${sq}${k === 0 ? "" : ` ${k < 0 ? "−" : "+"} ${Math.abs(k)}`}`;
}
const rad = (d: number): number => (d * Math.PI) / 180;
/** Reject values that sit too close to a rounding boundary. */
const safeRound = (v: number, dp: number): boolean => {
  const s = v * 10 ** dp;
  return Math.abs((s % 1) - 0.5) > 0.04 && Math.abs(s) > 0;
};

// ---------- question helpers ----------

/** Turn a hyphen used as a minus sign (before a digit) into a true minus. */
const fm = (t: string): string => t.replace(/(^|[\s(=<>≤≥,±×])-(?=\d)/g, "$1−");

/** Multiple choice from a correct label and wrong labels (duplicates removed, at most 4 wrong). */
function mc(prompt: string, right: string, wrong: string[], hint: string, visual?: Visual): Question {
  const r = fm(right);
  const w = [...new Set(wrong.map(fm))].filter((x) => x !== r);
  return textChoice(fm(prompt), r, sample(w, Math.min(4, w.length)), fm(hint), visual);
}
/** Numeric multiple choice; `extras` are the slips we most want to catch. */
function numQ(prompt: string, ans: number, extras: number[], hint: string, visual?: Visual, suffix = ""): Question {
  const w = [...new Set([...extras, ans + 1, ans - 1, -ans, ans + 2, ans - 2, ans * 2])].filter((x) => x !== ans);
  const wrong = w.slice(0, 4);
  return mc(prompt, `${M(ans)}${suffix}`, wrong.map((x) => `${M(x)}${suffix}`), hint, visual);
}
function typed(
  prompt: string,
  answer: number | string,
  hint: string,
  keypad: InputQuestion["keypad"] = "integer",
  visual?: Visual,
  suffix?: string,
  accept?: string[],
): InputQuestion {
  const q: InputQuestion = { kind: "input", prompt: fm(prompt), hint: fm(hint), answer: String(answer), keypad };
  if (visual) q.visual = visual;
  if (suffix) q.suffix = suffix;
  if (accept) q.accept = accept;
  return q;
}
/** A typed decimal answer to 1 dp (also accepts a whole number when the decimal is ".0"). */
function typedDec(prompt: string, value: number, hint: string, suffix?: string, visual?: Visual): InputQuestion {
  const s = value.toFixed(1);
  return typed(prompt, s, hint, "decimal", visual, suffix, s.endsWith(".0") ? [s.slice(0, -2)] : undefined);
}

function curve(f: (x: number) => number, x0: number, x1: number, step = 0.25) {
  const points: { x: number; y: number }[] = [];
  for (let x = x0; x <= x1 + 1e-9; x += step) points.push({ x: Math.round(x * 1e4) / 1e4, y: Math.round(f(x) * 1e4) / 1e4 });
  return { points };
}
function plotOf(
  f: (x: number) => number,
  size = 8,
  ySize = 10,
  points?: { x: number; y: number; label?: string }[],
  extra: { points: { x: number; y: number }[]; dashed?: boolean; label?: string }[] = [],
): Visual {
  return { type: "plot", xMin: -size, xMax: size, yMin: -ySize, yMax: ySize, step: 1, curves: [curve(f, -size, size), ...extra], points };
}
const lineCurve = (m: number, b: number, size = 8, dashed = false) => ({
  points: [
    { x: -size, y: m * -size + b },
    { x: size, y: m * size + b },
  ],
  dashed,
});

const nonZero = (lo: number, hi: number): number => {
  let n = 0;
  while (n === 0) n = randInt(lo, hi);
  return n;
};

// =====================================================================
// 1. Radicals
// =====================================================================

const SQFREE = [2, 3, 5, 6, 7, 10, 11, 13];

function absEval(lv: Level): Question {
  const a = randInt(-12, 12);
  const b = randInt(-12, 12);
  const c = randInt(-9, 9);
  if (lv === 1) {
    const ans = Math.abs(a) + Math.abs(b);
    return numQ(`Evaluate |${M(a)}| + |${M(b)}|.`, ans, [a + b, Math.abs(a + b), Math.abs(a) - Math.abs(b)], "Absolute value is the distance from zero, so each |…| becomes non-negative before you add.");
  }
  const ans = Math.abs(a - b) - Math.abs(c);
  return numQ(
    `Evaluate |${P(a)} − ${P(b)}| − |${P(c)}|.`,
    ans,
    [Math.abs(a) - Math.abs(b) - Math.abs(c), a - b - Math.abs(c), -Math.abs(a - b) - Math.abs(c)],
    "Work inside the bars first, then take the distance from zero, and only then subtract.",
  );
}

function simpRad(lv: Level): Question {
  const a = lv === 1 ? randInt(2, 5) : randInt(2, 9);
  const b = pick(lv === 1 ? [2, 3, 5] : SQFREE);
  const c = lv === 3 ? randInt(2, 4) : 1;
  const n = a * a * b;
  const wrong = [radS(c * a * a, b), radS(c + a, b), `${c * a * b}`, radAuto(c * b, a)];
  return mc(
    c === 1 ? `Simplify √${n}.` : `Simplify ${c}√${n}.`,
    radS(c * a, b),
    wrong,
    `Find the largest perfect square that divides ${n}: ${n} = ${a * a} × ${b}. Then √${a * a} = ${a} comes outside${c === 1 ? "" : ` and multiplies the ${c}`}.`,
  );
}

function entireRad(lv: Level): Question {
  const a = lv === 1 ? randInt(2, 4) : randInt(2, 7);
  const b = pick(lv === 1 ? [2, 3, 5] : SQFREE);
  return mc(
    `Write ${a}√${b} as an entire radical.`,
    `√${a * a * b}`,
    [`√${a * b}`, `√${a * a + b}`, `√${2 * a * b}`, `√${a + b}`],
    `The ${a} outside must be squared before it goes back under the root: ${a}² × ${b} = ${a * a * b}.`,
  );
}

function addRad(lv: Level): Question | undefined {
  const b = pick([2, 3, 5, 6, 7]);
  const op = chance(0.5) ? "+" : "−";
  let prompt: string;
  let ans: number;
  let hint: string;
  if (lv === 1) {
    const p = randInt(2, 9);
    const q = randInt(1, 7);
    ans = op === "+" ? p + q : p - q;
    prompt = `Simplify ${radS(p, b)} ${op} ${radS(q, b)}.`;
    hint = `Like radicals add like like terms: keep √${b} and combine the coefficients ${p} ${op} ${q}.`;
  } else if (lv === 2) {
    const a = randInt(2, 5);
    const q = randInt(1, 5);
    ans = op === "+" ? a + q : a - q;
    prompt = `Simplify √${a * a * b} ${op} ${radS(q, b)}.`;
    hint = `Simplify first: √${a * a * b} = ${radS(a, b)}. Now the radicals are alike, so combine ${a} ${op} ${q}.`;
  } else {
    const a = randInt(3, 7);
    const c = randInt(2, a - 1);
    ans = op === "+" ? a + c : a - c;
    prompt = `Simplify √${a * a * b} ${op} √${c * c * b}.`;
    hint = `Simplify each radical: ${radS(a, b)} and ${radS(c, b)}. Then combine the coefficients.`;
  }
  if (ans === 0) return undefined;
  return mc(prompt, radS(ans, b), [radS(ans + 1, b), radS(ans - 1, b), radAuto(ans, 2 * b), radAuto(1, b * Math.abs(ans)), radS(-ans, b)].filter((x) => !x.startsWith("0")), hint);
}

function mulRad(lv: Level): Question | undefined {
  const pool = [2, 3, 5, 6, 7, 8, 10, 12, 18];
  if (lv === 3 && chance(0.5)) {
    const m = pick([2, 3, 5, 6, 7, 10]);
    const k = randInt(1, 5);
    const ans = m - k * k;
    return typed(`Expand and simplify: (√${m} + ${k})(√${m} − ${k}). Enter the whole-number result.`, ans, "Conjugates multiply to a difference of squares: (√m)² − k², so the radicals disappear.", "integer");
  }
  const m = pick(pool);
  const n = pick(pool);
  if (m === n) return undefined;
  const p = lv === 1 ? 1 : randInt(2, 4);
  const q = lv === 1 ? 1 : randInt(2, 4);
  const [o, inn] = simplifyRad(m * n);
  const c = p * q * o;
  const wrong = [radAuto(p * q, m + n), radAuto(p + q, m * n), radS(c + 1, inn), radS(c, inn + 1), radAuto(p * q * m, n)];
  return mc(
    `Simplify ${p === 1 ? "" : p}√${m} × ${q === 1 ? "" : q}√${n}.`,
    radS(c, inn),
    wrong,
    `Multiply the coefficients (${p * q}) and the radicands (${m} × ${n} = ${m * n}), then simplify √${m * n}.`,
  );
}

function rationalize(lv: Level): Question | undefined {
  const b = pick([2, 3, 5, 7]);
  const c = lv === 1 ? 1 : randInt(2, 4);
  const a = randInt(2, 11);
  if (gcd(a, c * b) !== 1) return undefined;
  const den = c === 1 ? `√${b}` : `${c}√${b}`;
  const wrong = [`${a}/${c * b}`, radS(a, b), c === 1 ? `${a * b}√${b}` : `${a}√${b}/${c}`, `√${b}/${a}`, `${a}√${b}/${c * b + 1}`];
  return mc(
    `Rationalize the denominator of ${a}/${c === 1 ? den : `(${den})`}.`,
    `${a}√${b}/${c * b}`,
    wrong,
    `Multiply the top and bottom by √${b}. The bottom becomes ${c === 1 ? "" : `${c} × `}√${b} × √${b} = ${c * b}, and the top becomes ${a}√${b}.`,
  );
}

const ORDER_POOL: { label: string; v: number }[] = [
  { label: "√10", v: Math.sqrt(10) },
  { label: "2√3", v: 2 * Math.sqrt(3) },
  { label: "3√2", v: 3 * Math.sqrt(2) },
  { label: "4", v: 4 },
  { label: "√17", v: Math.sqrt(17) },
  { label: "2√6", v: 2 * Math.sqrt(6) },
  { label: "5", v: 5 },
  { label: "3√3", v: 3 * Math.sqrt(3) },
  { label: "√30", v: Math.sqrt(30) },
  { label: "2√7", v: 2 * Math.sqrt(7) },
  { label: "√8", v: Math.sqrt(8) },
  { label: "√3", v: Math.sqrt(3) },
];
function orderRad(): OrderQuestion {
  for (;;) {
    const items = sample(ORDER_POOL, 4).sort((x, y) => x.v - y.v);
    if (items.every((it, i) => i === 0 || it.v - items[i - 1].v > 0.1)) {
      return {
        kind: "order",
        prompt: "Order these values from least to greatest.",
        hint: "Convert each to a decimal, or compare by writing everything as an entire radical (e.g. 2√3 = √12).",
        items: items.map((it, i) => ({ id: `o${i}`, label: it.label })),
      };
    }
  }
}

function sortRational() {
  return sortQuestion(
    {
      prompt: "Sort each number as rational or irrational.",
      hint: "A square root is rational only when the radicand is a perfect square (or a fraction of perfect squares). Decimals that end or repeat are rational.",
      bins: [
        { id: "rat", label: "Rational", emoji: "➗" },
        { id: "irr", label: "Irrational", emoji: "♾️" },
      ],
      items: [
        ...["√49", "√(9/4)", "0.75", "−3", "√100", "−√16", "5/7", "√0.25"].map((label) => ({ label, emoji: "🔹", bin: "rat" })),
        ...["√2", "√7", "√12", "√50", "π", "√30", "−√5", "√99"].map((label) => ({ label, emoji: "🔸", bin: "irr" })),
      ],
    },
    3,
  );
}

function radicals(opts?: GenerateOptions): Question[] {
  return build(
    [
      [1, absEval],
      [2, absEval],
      [1, simpRad],
      [2, simpRad],
      [3, simpRad],
      [1, entireRad],
      [2, entireRad],
      [1, addRad],
      [2, addRad],
      [3, addRad],
      [1, mulRad],
      [2, mulRad],
      [3, mulRad],
      [2, rationalize],
      [3, rationalize],
      [2, orderRad],
      [2, sortRational],
    ],
    levelOf(opts),
  );
}

// =====================================================================
// 2. Absolute value and radical equations
// =====================================================================

function absEq(lv: Level): Question | undefined {
  const a = lv === 1 ? 1 : randInt(1, 3);
  const x1 = randInt(-8, 8);
  const x2 = randInt(-8, 8);
  if (x1 === x2 || (a * (x1 + x2)) % 2 !== 0) return undefined;
  const b = (-a * (x1 + x2)) / 2;
  const c = (a * Math.abs(x1 - x2)) / 2;
  const [p, q] = sortedRoots(x1, x2);
  const wrong = [`x = ${M(p)}`, `x = ${M(q)}`, rootsLabel(-p, -q), "No solution", rootsLabel(p + 1, q - 1)];
  return mc(
    `Solve |${poly([[a, "x"], [b, ""]])}| = ${c}.`,
    rootsLabel(p, q),
    wrong,
    `Split into two equations: ${poly([[a, "x"], [b, ""]])} = ${c} and ${poly([[a, "x"], [b, ""]])} = ${-c}. Solve each one.`,
  );
}

function absLarger(): Question {
  const h = randInt(-9, 9);
  const d = randInt(2, 9);
  const inner = h === 0 ? "x" : `x ${h < 0 ? "+" : "−"} ${Math.abs(h)}`;
  return typed(
    `Solve |${inner}| = ${d}. Enter the greater solution.`,
    h + d,
    `The distance from ${h} is ${d}, so x = ${h} + ${d} or x = ${h} − ${d}. Pick the larger one.`,
    "integer",
  );
}

function absCount(): Question {
  const h = nonZero(-7, 7);
  const inner = `x ${h < 0 ? "+" : "−"} ${Math.abs(h)}`;
  const c = pick([-6, -3, -1, 0, 0, 2, 4, 7]);
  const right = c < 0 ? "No solution" : c === 0 ? "One solution" : "Two solutions";
  return mc(
    `How many solutions does |${inner}| = ${M(c)} have?`,
    right,
    ["No solution", "One solution", "Two solutions"],
    "An absolute value is never negative. If it equals a negative number, there is no solution; if it equals 0, there is exactly one; if positive, there are two.",
  );
}

function absIsolate(): Question | undefined {
  const pcoef = randInt(2, 4);
  const d = randInt(1, 6);
  const h = randInt(-5, 5);
  const q = nonZero(-8, 8);
  const r = pcoef * d + q;
  const inner = h === 0 ? "x" : `x ${h < 0 ? "+" : "−"} ${Math.abs(h)}`;
  return mc(
    `Solve ${pcoef}|${inner}| ${q < 0 ? "−" : "+"} ${Math.abs(q)} = ${r}.`,
    rootsLabel(h + d, h - d),
    [rootsLabel(h + d + 1, h - d - 1), `x = ${M(h + d)}`, rootsLabel(-h + d, -h - d), "No solution"],
    `Isolate the absolute value first: |${inner}| = ${d}. Then split into x ${h < 0 ? "+" : "−"} ${Math.abs(h)} = ${d} and x ${h < 0 ? "+" : "−"} ${Math.abs(h)} = ${-d}.`,
  );
}

function absModel(): Question {
  const h = nonZero(-8, 8);
  const d = randInt(2, 9);
  if (d === Math.abs(h)) return absModel();
  const inner = `x ${h < 0 ? "+" : "−"} ${Math.abs(h)}`;
  const flipped = `x ${h < 0 ? "−" : "+"} ${Math.abs(h)}`;
  return mc(
    `Which equation says that x is ${d} units away from ${h} on the number line?`,
    `|${inner}| = ${d}`,
    [`|${flipped}| = ${d}`, `|x| − ${Math.abs(h)} = ${d}`, `|${inner}| = ${Math.abs(h)}`, `|x − ${d}| = ${Math.abs(h)}`],
    "Distance between x and h is |x − h|. Subtract the point you are measuring from.",
  );
}

function absPiece(): Question {
  const h = nonZero(-8, 8);
  const e1 = poly([[1, "x"], [-h, ""]]);
  const e2 = poly([[-1, "x"], [h, ""]]);
  const e3 = poly([[1, "x"], [h, ""]]);
  const right = `${e1} if x ≥ ${h}; ${e2} if x < ${h}`;
  return mc(
    `Which piecewise definition matches |${e1}|?`,
    right,
    [`${e2} if x ≥ ${h}; ${e1} if x < ${h}`, `${e3} if x ≥ ${h}; ${poly([[-1, "x"], [-h, ""]])} if x < ${h}`, `${e1} if x ≥ ${h}; ${e1} if x < ${h}`],
    `The expression inside is zero at x = ${h}. When it is positive, keep it; when it is negative, use its opposite.`,
  );
}

function radSimple(): Question {
  const b = randInt(2, 9);
  const a = nonZero(-6, 6);
  const x = b * b - a;
  return typed(`Solve √(x ${a < 0 ? "−" : "+"} ${Math.abs(a)}) = ${b}.`, x, `Square both sides: x ${a < 0 ? "−" : "+"} ${Math.abs(a)} = ${b * b}. Then solve for x.`, "integer");
}

function radLinear(): Question | undefined {
  const x0 = randInt(-4, 12);
  const a = randInt(2, 4);
  const c = randInt(1, 6);
  const b = c * c - a * x0;
  if (b === 0) return undefined;
  return typed(
    `Solve √(${poly([[a, "x"], [b, ""]])}) = ${c}.`,
    x0,
    `Square both sides: ${poly([[a, "x"], [b, ""]])} = ${c * c}. Solve, then check by substituting back.`,
    "integer",
  );
}

function radExtraneous(): Question {
  const b = randInt(1, 4);
  const r = randInt(b + 2, b + 6);
  const e = 2 * b + 1 - r;
  const a = b * b - r * e;
  // verify: √(r + a) = r − b
  if (Math.sqrt(r + a) !== r - b) throw new Error("radExtraneous setup is wrong");
  const left = `√(${poly([[1, "x"], [a, ""]])})`;
  const right = poly([[1, "x"], [-b, ""]]);
  return mc(
    `Solve ${left} = ${right}.`,
    `x = ${M(r)} only`,
    [`x = ${M(e)} only`, `x = ${M(r)} and x = ${M(e)}`, "No solution"],
    `Squaring gives a quadratic with roots ${M(e)} and ${M(r)}. Check each in the original: x = ${M(e)} makes the right side ${M(e - b)}, but a square root can't be negative, so it is extraneous.`,
  );
}

function radNegative(): Question {
  const a = randInt(1, 7);
  const c = randInt(2, 6);
  const x = c * c - a;
  return mc(
    `Solve √(x + ${a}) = −${c}.`,
    "No solution",
    [`x = ${x}`, `x = ${-c * c - a}`, `x = ${c - a}`],
    `Squaring gives x = ${x}, but then √(${x + a}) = ${c}, not −${c}. A principal square root is never negative, so check: it fails.`,
  );
}

function radDomain(): Question {
  const k = nonZero(-8, 8);
  const flip = chance(0.4);
  if (flip) {
    const c = randInt(1, 9);
    return mc(
      `State the restriction on x for √(${c} − x) to be a real number.`,
      `x ≤ ${c}`,
      [`x ≥ ${c}`, `x < ${c}`, `x ≤ ${-c}`, `x ≥ ${-c}`],
      `The radicand must be at least 0: ${c} − x ≥ 0, so ${c} ≥ x.`,
    );
  }
  return mc(
    `State the restriction on x for √(x ${k < 0 ? "−" : "+"} ${Math.abs(k)}) to be a real number.`,
    `x ≥ ${-k}`,
    [`x ≥ ${k}`, `x > ${-k}`, `x ≤ ${-k}`, `x > ${k}`],
    `The radicand must be 0 or positive: x ${k < 0 ? "−" : "+"} ${Math.abs(k)} ≥ 0. Solve for x.`,
  );
}

function absRadEq(opts?: GenerateOptions): Question[] {
  return build(
    [
      [1, absEq],
      [2, absEq],
      [3, absEq],
      [1, absLarger],
      [1, absCount],
      [2, absIsolate],
      [2, absModel],
      [3, absPiece],
      [1, radSimple],
      [2, radLinear],
      [3, radExtraneous],
      [2, radNegative],
      [2, radDomain],
    ],
    levelOf(opts),
  );
}

// =====================================================================
// 3. Rational expressions and equations
// =====================================================================

function distinctRoots(count: number, lo = -6, hi = 6): number[] {
  const out: number[] = [];
  while (out.length < count) {
    const n = nonZero(lo, hi);
    if (!out.includes(n)) out.push(n);
  }
  return out;
}

function nonPerm(lv: Level): Question {
  const [r1, r2] = distinctRoots(2);
  const n = nonZero(-6, 6);
  const numer = poly([[1, "x"], [n, ""]]);
  if (lv === 1) {
    return mc(
      `State the non-permissible value of (${numer})/(${poly([[1, "x"], [-r1, ""]])}).`,
      `x ≠ ${M(r1)}`,
      [`x ≠ ${M(-r1)}`, `x ≠ ${M(-n)}`, "x ≠ 0", `x ≠ ${M(r1)}, ${M(-n)}`],
      "A rational expression is undefined when its denominator is 0. Set the denominator equal to 0 and solve; ignore the numerator.",
    );
  }
  const [a, b] = sortedRoots(r1, r2);
  const den = lv === 2 ? `${fac(-a)}${fac(-b)}` : poly([[1, "x²"], [-(a + b), "x"], [a * b, ""]]);
  const label = (u: number, v: number) => {
    const [s, t] = sortedRoots(u, v);
    return `x ≠ ${M(s)}, ${M(t)}`;
  };
  return mc(
    `State the non-permissible values of (${numer})/(${den}).`,
    label(a, b),
    [label(-a, -b), `x ≠ ${M(a)}`, `x ≠ ${M(b)}`, `x ≠ ${M(-n)}, ${M(a)}`, label(a, -n)],
    lv === 2 ? "Each factor of the denominator that equals 0 is a restriction: set (x − a) = 0 and (x − b) = 0." : "Factor the denominator, then set each factor equal to 0. The numerator doesn't matter.",
  );
}

function simplify1(): Question | undefined {
  const [p, q] = distinctRoots(2);
  const numer = poly([[1, "x²"], [p + q, "x"], [p * q, ""]]);
  return mc(
    `Simplify (${numer})/(${poly([[1, "x"], [p, ""]])}), x ≠ ${M(-p)}.`,
    poly([[1, "x"], [q, ""]]),
    [poly([[1, "x"], [p, ""]]), poly([[1, "x"], [p * q, ""]]), poly([[1, "x"], [p + q, ""]]), M(q)],
    `Factor the numerator: ${numer} = ${fac(p)}${fac(q)}. Then cancel the common factor ${fac(p)}.`,
  );
}

function simplify2(): Question | undefined {
  const [p, q, r] = distinctRoots(3);
  const numer = poly([[1, "x²"], [p + q, "x"], [p * q, ""]]);
  const den = poly([[1, "x²"], [p + r, "x"], [p * r, ""]]);
  const f = (u: number, v: number) => `(x ${u < 0 ? "−" : "+"} ${Math.abs(u)})/(x ${v < 0 ? "−" : "+"} ${Math.abs(v)})`;
  return mc(
    `Simplify (${numer})/(${den}).`,
    f(q, r),
    [f(r, q), f(p, r), f(q, p), frac(q, r)],
    `Factor both: (${fac(p)}${fac(q)}) / (${fac(p)}${fac(r)}). Cancel only the matching factor ${fac(p)}.`,
  );
}

function simplifyDiffSquares(): Question {
  const k = randInt(2, 9);
  return mc(
    `Simplify (x² − ${k * k})/(x² + ${2 * k}x + ${k * k}), x ≠ ${-k}.`,
    `(x − ${k})/(x + ${k})`,
    [`(x + ${k})/(x − ${k})`, "−1", "1", `(x − ${k})/${k}`],
    `Numerator: difference of squares, (x − ${k})(x + ${k}). Denominator: perfect-square trinomial, (x + ${k})². Cancel one (x + ${k}).`,
  );
}

function mulDiv(lv: Level): Question | undefined {
  const [p, q, r] = distinctRoots(3);
  const A = `(x ${p < 0 ? "−" : "+"} ${Math.abs(p)})`;
  const B = `(x ${q < 0 ? "−" : "+"} ${Math.abs(q)})`;
  const C = `(x ${r < 0 ? "−" : "+"} ${Math.abs(r)})`;
  const f = (u: string, v: string) => `${u}/${v}`;
  if (lv === 3 || chance(0.5)) {
    return mc(
      `Simplify ${f(A, B)} ÷ ${f(C, B)}.`,
      f(A, C),
      [f(C, A), `${A}${C}/${B}²`, f(A, B), f(B, C)],
      "Dividing by a fraction means multiplying by its reciprocal: (A/B) × (B/C). The B factors cancel.",
    );
  }
  return mc(
    `Simplify ${f(A, B)} × ${f(B, C)}.`,
    f(A, C),
    [f(C, A), f(A, B), f(B, C), `${A}${C}`],
    "Multiply across, then cancel any factor that appears on both the top and the bottom.",
  );
}

function addSame(): Question {
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  const [p] = distinctRoots(1);
  const d = `(x ${p < 0 ? "−" : "+"} ${Math.abs(p)})`;
  return mc(
    `Simplify ${a}/${d} + ${b}/${d}.`,
    `${a + b}/${d}`,
    [`${a + b}/${d}²`, `${a * b}/${d}`, `${a + b}/(2x ${p < 0 ? "−" : "+"} ${2 * Math.abs(p)})`, `${a - b}/${d}`],
    "With a common denominator, add the numerators and keep the denominator unchanged.",
  );
}

function addDiff(): Question | undefined {
  const [p, q] = distinctRoots(2);
  const a = randInt(1, 4);
  const b = randInt(1, 4);
  const D = `${fac(p)}${fac(q)}`;
  const num = (c0: number) => poly([[a + b, "x"], [c0, ""]]);
  const right = `(${num(a * q + b * p)})/(${D})`;
  const wrong = [
    `${a + b}/(${poly([[2, "x"], [p + q, ""]])})`,
    `${a + b}/(${D})`,
    `(${num(a * p + b * q)})/(${D})`,
    `(${num(a * q - b * p)})/(${D})`,
  ];
  return mc(
    `Add: ${a}/${fac(p)} + ${b}/${fac(q)}.`,
    right,
    wrong,
    `Use the common denominator ${D}. Multiply the first fraction's top by ${fac(q)} and the second's by ${fac(p)}, then add the tops.`,
  );
}

function evalRational(): Question {
  const k = randInt(2, 8);
  let m = nonZero(-9, 9);
  if (m === k) m = k + 1;
  return typed(
    `Evaluate (x² − ${k * k})/(x − ${k}) when x = ${M(m)}.`,
    m + k,
    `Either substitute directly, or simplify first: (x − ${k})(x + ${k})/(x − ${k}) = x + ${k}.`,
    "integer",
  );
}

function solveFrac(): Question {
  const x0 = randInt(2, 9);
  const B = randInt(1, 4);
  const A = randInt(1, 9);
  const C = A + B * x0;
  return typed(
    `Solve for x: ${A}/x + ${B} = ${C}/x.`,
    x0,
    `Multiply every term by x: ${A} + ${B}x = ${C}. Then solve for x and check that x ≠ 0.`,
    "integer",
  );
}

function solveRatio(): Question {
  const x0 = randInt(1, 8);
  const b = randInt(2, 5);
  const a = x0 * (b - 1);
  return typed(
    `Solve (x + ${a})/x = ${b}.`,
    x0,
    `Multiply both sides by x: x + ${a} = ${b}x. Then collect the x terms: ${a} = ${b - 1}x.`,
    "integer",
  );
}

function solveCross(): Question | undefined {
  const a = randInt(1, 5);
  const b = randInt(1, 5);
  const p = nonZero(-6, 6);
  const q = nonZero(-6, 6);
  if (a === b || p === q) return undefined;
  const num = b * p - a * q;
  const den = a - b;
  if (num % den !== 0) return undefined;
  const x = num / den;
  if (x === -p || x === -q) return undefined;
  return typed(
    `Solve ${a}/${fac(p)} = ${b}/${fac(q)}.`,
    x,
    `Cross-multiply: ${a}${fac(q)} = ${b}${fac(p)}. Expand, collect x terms on one side, and solve. Check the answer isn't a restriction.`,
    "integer",
  );
}

function solveExtraneous(): Question {
  const k = randInt(2, 7);
  const m = randInt(2, 5);
  return mc(
    `Solve x/(x − ${k}) = ${k}/(x − ${k}) + ${m}.`,
    "No solution",
    [`x = ${k}`, `x = ${-k}`, `x = ${k * m}`, `x = ${m}`],
    `Multiplying through by (x − ${k}) leads to x = ${k}. But x = ${k} makes the denominator 0, so it is extraneous and there is no solution.`,
  );
}

function rationals(opts?: GenerateOptions): Question[] {
  return build(
    [
      [1, nonPerm],
      [2, nonPerm],
      [3, nonPerm],
      [1, simplify1],
      [2, simplify2],
      [3, simplifyDiffSquares],
      [2, mulDiv],
      [3, mulDiv],
      [1, addSame],
      [3, addDiff],
      [1, evalRational],
      [2, solveFrac],
      [2, solveRatio],
      [3, solveCross],
      [3, solveExtraneous],
    ],
    levelOf(opts),
  );
}

// =====================================================================
// 4. Quadratic functions
// =====================================================================

function graphVertex(lv: Level): Question | undefined {
  const a = lv === 3 ? pick([1, -1, 2, -2]) : pick([1, -1]);
  const h = nonZero(-4, 4);
  const k = nonZero(-4, 4);
  if (h === k || Math.abs(h) === Math.abs(k)) return undefined;
  const label = (x: number, y: number) => `(${M(x)}, ${M(y)})`;
  return mc(
    "What are the coordinates of the vertex of this parabola?",
    label(h, k),
    [label(k, h), label(-h, k), label(h, -k), label(-h, -k)],
    "The vertex is the turning point: the lowest point if the parabola opens up, the highest if it opens down. Read x first, then y.",
    plotOf((x) => a * (x - h) ** 2 + k),
  );
}

function graphEquation(lv: Level): Question | undefined {
  const a = lv === 3 ? pick([1, -1, 2, -2]) : pick([1, -1]);
  const h = nonZero(-4, 4);
  const k = nonZero(-4, 4);
  return mc(
    "Which equation matches this graph?",
    vf(a, h, k),
    [vf(a, -h, k), vf(a, h, -k), vf(-a, h, k), vf(a, -h, -k)],
    "Vertex form y = a(x − h)² + k has vertex (h, k). Note the sign inside the bracket: x − h means h is the x-coordinate. The sign of a tells you which way it opens.",
    plotOf((x) => a * (x - h) ** 2 + k),
  );
}

function graphZeros(lv: Level): Question | undefined {
  const [p, q] = distinctRoots(2, -5, 5);
  if (Math.abs(p - q) > 6 || Math.abs(p - q) < 2) return undefined;
  const a = lv === 3 ? -1 : 1;
  const label = (u: number, v: number) => {
    const [s, t] = sortedRoots(u, v);
    return `x = ${M(s)} and x = ${M(t)}`;
  };
  return mc(
    "What are the x-intercepts (zeros) of this function?",
    label(p, q),
    [label(-p, -q), label(p, -q), label(p + 1, q + 1), label(p * q, p + q)],
    "The x-intercepts are where the curve crosses the horizontal axis (y = 0). Read their x-values.",
    plotOf((x) => a * (x - p) * (x - q)),
  );
}

function vertexFeature(): Question {
  const a = pick([1, 2, 3, -1, -2, -3]);
  const h = nonZero(-7, 7);
  const k = nonZero(-9, 9);
  const eq = vf(a, h, k);
  const kind = pick(["axis", "extreme", "range", "opens"]);
  if (kind === "axis") {
    return mc(`What is the axis of symmetry of ${eq}?`, `x = ${M(h)}`, [`x = ${M(-h)}`, `x = ${M(k)}`, `y = ${M(k)}`, `x = ${M(-k)}`], "The axis of symmetry is the vertical line through the vertex: x = h. Beware the sign in (x − h).");
  }
  if (kind === "extreme") {
    return typed(
      `What is the ${a > 0 ? "minimum" : "maximum"} value of ${eq}?`,
      k,
      `The vertex is (${M(h)}, ${M(k)}). Because a is ${a > 0 ? "positive" : "negative"}, the parabola opens ${a > 0 ? "up" : "down"}, so the ${a > 0 ? "lowest" : "highest"} y-value is k.`,
      "integer",
    );
  }
  if (kind === "range") {
    const right = a > 0 ? `y ≥ ${M(k)}` : `y ≤ ${M(k)}`;
    return mc(`State the range of ${eq}.`, right, [a > 0 ? `y ≤ ${M(k)}` : `y ≥ ${M(k)}`, `y ≥ ${M(h)}`, `y ≤ ${M(h)}`, "All real numbers"], "The range is every y-value the graph reaches. A parabola that opens up starts at k and goes up; one that opens down goes from k downward.");
  }
  return mc(
    `Does the graph of ${eq} open up or down, and what is its vertex?`,
    `${a > 0 ? "Up" : "Down"}, vertex (${M(h)}, ${M(k)})`,
    [`${a > 0 ? "Down" : "Up"}, vertex (${M(h)}, ${M(k)})`, `${a > 0 ? "Up" : "Down"}, vertex (${M(-h)}, ${M(k)})`, `${a > 0 ? "Down" : "Up"}, vertex (${M(-h)}, ${M(-k)})`],
    "The sign of a decides the direction (positive: up). The vertex is (h, k) from a(x − h)² + k.",
  );
}

function transformation(lv: Level): Question {
  const a = lv === 1 ? 1 : pick([-1, 2, -2, 3]);
  const h = nonZero(-6, 6);
  const k = nonZero(-6, 6);
  const desc = (a2: number, h2: number, k2: number) => {
    const parts: string[] = [];
    if (a2 < 0) parts.push("reflected in the x-axis");
    if (Math.abs(a2) > 1) parts.push(`stretched vertically by a factor of ${Math.abs(a2)}`);
    parts.push(`${Math.abs(h2)} ${h2 > 0 ? "right" : "left"}`);
    parts.push(`${Math.abs(k2)} ${k2 > 0 ? "up" : "down"}`);
    const text = parts.join(", ");
    return text[0].toUpperCase() + text.slice(1);
  };
  return mc(
    `How is the graph of ${vf(a, h, k)} obtained from y = x²?`,
    desc(a, h, k),
    [desc(a, -h, k), desc(a, h, -k), desc(-a, h, k), desc(a, k, h), desc(a, -h, -k)],
    "Read a(x − h)² + k: a reflects and stretches, h moves the graph horizontally (opposite to its sign inside the bracket), k moves it vertically.",
  );
}

function stdIntercept(): Question {
  const a = pick([1, 2, 3, -1, -2]);
  const b = nonZero(-9, 9);
  const c = nonZero(-12, 12);
  return typed(
    `What is the y-intercept of y = ${poly([[a, "x²"], [b, "x"], [c, ""]])}?`,
    c,
    "The y-intercept is where x = 0, so every term with x disappears.",
    "integer",
  );
}

function stdAxis(): Question {
  const a = pick([1, 2, -1, -2]);
  const h = nonZero(-6, 6);
  const b = -2 * a * h;
  const c = nonZero(-10, 10);
  return typed(
    `Find the x-coordinate of the vertex of y = ${poly([[a, "x²"], [b, "x"], [c, ""]])}.`,
    h,
    `Use x = −b/(2a) = −(${M(b)})/(2 × ${M(a)}).`,
    "integer",
  );
}

function stdToVertex(): Question {
  const h = nonZero(-6, 6);
  const b = -2 * h;
  const c = randInt(-10, 12);
  const k = c - h * h;
  if (k === 0) return stdToVertex();
  return mc(
    `Write y = ${poly([[1, "x²"], [b, "x"], [c, ""]])} in vertex form.`,
    vf(1, h, k),
    [vf(1, -h, k), vf(1, h, c), vf(1, h, -k), vf(1, -h, c - h * h * 2)],
    `Complete the square: half of ${M(b)} is ${M(b / 2)}, and ${M(b / 2)}² = ${h * h}. So y = (x ${h < 0 ? "+" : "−"} ${Math.abs(h)})² + (${M(c)} − ${h * h}).`,
  );
}

function xInterceptCount(): Question {
  const a = pick([1, 2, -1, -2]);
  const h = nonZero(-5, 5);
  const k = pick([-8, -5, -2, 0, 3, 6]);
  const roots = k === 0 ? 1 : (a > 0) === (k < 0) ? 2 : 0;
  const label = roots === 0 ? "None" : roots === 1 ? "One" : "Two";
  return mc(
    `How many x-intercepts does ${vf(a, h, k)} have?`,
    label,
    ["None", "One", "Two"],
    "Find the vertex and which way it opens. If the vertex is above the x-axis and the parabola opens up (or below and opens down), it never reaches the axis.",
  );
}

function axisFromFactored(): Question | undefined {
  const [p, q] = distinctRoots(2, -9, 9);
  if ((p + q) % 2 !== 0) return undefined;
  const a = pick([1, 2, -1, -3]);
  const lead = a === 1 ? "" : a === -1 ? "−" : M(a);
  return typed(
    `The function y = ${lead}${fac(-p)}${fac(-q)} has zeros ${M(p)} and ${M(q)}. What is its axis of symmetry, x = ?`,
    (p + q) / 2,
    "The axis of symmetry lies exactly halfway between the zeros: average them.",
    "integer",
  );
}

function ballMax(): Question {
  const t = randInt(1, 4);
  const b = 10 * t;
  const c = randInt(1, 3) * 2;
  const max = c + 5 * t * t;
  return typed(
    `A ball's height in metres after t seconds is h = −5t² + ${b}t + ${c}. What is the maximum height, in metres?`,
    max,
    `The peak happens at t = −b/(2a) = ${b}/10 = ${t} s. Substitute t = ${t} to get the height.`,
    "number",
    undefined,
    "m",
  );
}

function vertexPoint(): Question {
  const h = randInt(-4, 4);
  const k = randInt(-6, 6);
  const a = nonZero(-3, 3);
  const d = randInt(1, 2);
  const x = h + d;
  const y = k + a * d * d;
  return typed(
    `A parabola has vertex (${M(h)}, ${M(k)}) and passes through (${M(x)}, ${M(y)}). In y = a(x − h)² + k, what is a?`,
    a,
    `Substitute the vertex and the point: ${M(y)} = a(${M(x)} − ${P(h)})² + ${P(k)}. Solve for a.`,
    "integer",
  );
}

function quadFunctions(opts?: GenerateOptions): Question[] {
  return build(
    [
      [1, graphVertex],
      [2, graphVertex],
      [1, graphEquation],
      [2, graphEquation],
      [3, graphEquation],
      [2, graphZeros],
      [3, graphZeros],
      [1, vertexFeature],
      [2, vertexFeature],
      [2, transformation],
      [3, transformation],
      [1, stdIntercept],
      [2, stdAxis],
      [3, stdToVertex],
      [2, xInterceptCount],
      [2, axisFromFactored],
      [3, ballMax],
      [3, vertexPoint],
    ],
    levelOf(opts),
  );
}

// =====================================================================
// 5. Quadratic equations
// =====================================================================

function factorSolve(lv: Level): Question | undefined {
  const [p, q] = distinctRoots(2, lv === 1 ? -6 : -9, lv === 1 ? 6 : 9);
  const eq = `${poly([[1, "x²"], [-(p + q), "x"], [p * q, ""]])} = 0`;
  return mc(
    `Solve ${eq}.`,
    rootsLabel(p, q),
    [rootsLabel(-p, -q), rootsLabel(p, -q), rootsLabel(p + q, p * q)],
    `Factor into ${fac(-p)}${fac(-q)} = 0, then set each factor to 0. Remember the roots have the opposite sign of the numbers in the brackets.`,
  );
}

function largerRoot(): Question | undefined {
  const [p, q] = distinctRoots(2, -9, 9);
  return typed(
    `What is the larger root of ${poly([[1, "x²"], [-(p + q), "x"], [p * q, ""]])} = 0?`,
    Math.max(p, q),
    "Find two numbers that multiply to the constant term and add to the x-coefficient, factor, and set each factor to 0.",
    "integer",
  );
}

function factorExpr(): Question | undefined {
  const [p, q] = distinctRoots(2, -8, 8);
  const lab = (u: number, v: number) => {
    const [s, t] = sortedRoots(u, v);
    return `${fac(s)}${fac(t)}`;
  };
  return mc(
    `Factor ${poly([[1, "x²"], [p + q, "x"], [p * q, ""]])}.`,
    lab(p, q),
    [lab(-p, -q), lab(p, -q), lab(-p, q)],
    `Look for two numbers with product ${p * q} and sum ${p + q}.`,
  );
}

function factorHard(): Question | undefined {
  const m = pick([2, 3]);
  const n = pick([1, 2, 3]);
  const p = nonZero(-5, 5);
  const q = nonZero(-5, 5);
  const A = m * n;
  const B = m * q + n * p;
  const C = p * q;
  const r1 = frac(-p, m);
  const r2 = frac(-q, n);
  if (r1 === r2) return undefined;
  const nice = (u: string, v: string) => {
    const vals = [u, v].sort((s, t) => eval0(s) - eval0(t));
    return `x = ${vals[0]} or x = ${vals[1]}`;
  };
  return mc(
    `Solve ${poly([[A, "x²"], [B, "x"], [C, ""]])} = 0.`,
    nice(r1, r2),
    [nice(frac(p, m), frac(q, n)), nice(frac(-p, 1), frac(-q, 1)), nice(frac(-m, p) , frac(-n, q))],
    `Factor as (${poly([[m, "x"], [p, ""]])})(${poly([[n, "x"], [q, ""]])}) = 0. Each root is the constant over the coefficient of x, with the sign changed.`,
  );
}
function eval0(s: string): number {
  const t = s.replace("−", "-");
  if (t.includes("/")) {
    const [a, b] = t.split("/").map(Number);
    return a / b;
  }
  return Number(t);
}

function completeNumber(): Question {
  const half = randInt(1, 9);
  const b = 2 * half;
  return typed(
    `What number completes the square? x² + ${b}x + ☐`,
    half * half,
    `Take half of the x-coefficient (${b} ÷ 2 = ${half}) and square it.`,
    "number",
  );
}

function squareRootForm(): Question | undefined {
  const h = nonZero(-8, 8);
  const k = pick([2, 3, 5, 6, 7, 10, 11]);
  const label = (hh: number, kk: string) => `x = ${M(hh)} ± ${kk}`;
  const sign = h < 0 ? "+" : "−";
  return mc(
    `Solve (x ${sign} ${Math.abs(h)})² = ${k}.`,
    label(h, `√${k}`),
    [label(-h, `√${k}`), label(h, `${k}`), label(h, `√${2 * k}`), label(-h, `${k}`)],
    `Take the square root of both sides (± gives two answers): x ${sign} ${Math.abs(h)} = ±√${k}. Then move the ${Math.abs(h)} to the other side, changing its sign.`,
  );
}

function formulaRoots(): Question | undefined {
  const h = nonZero(-6, 6);
  const b = -2 * h;
  const inside = randInt(2, 30);
  if (Number.isInteger(Math.sqrt(inside))) return undefined;
  const c = h * h - inside;
  const D = b * b - 4 * c; // = 4 * inside
  const [o, inn] = simplifyRad(inside);
  const r = radS(o, inn);
  return mc(
    `Solve ${poly([[1, "x²"], [b, "x"], [c, ""]])} = 0 using the quadratic formula. Give exact roots.`,
    `x = ${M(h)} ± ${r}`,
    [`x = ${M(-h)} ± ${r}`, `x = ${M(h)} ± ${radAuto(1, D)}`, `x = ${M(b)} ± ${r}`, `x = ${M(h)} ± ${radAuto(1, inside + 1)}`],
    `Here a = 1, b = ${M(b)}, c = ${M(c)}, so b² − 4ac = ${D}. Then x = (${M(-b)} ± √${D})/2. Simplify √${D} = ${radAuto(1, D)} and divide each part by 2.`,
  );
}

function discriminantValue(): Question {
  const a = nonZero(-4, 4);
  const b = nonZero(-8, 8);
  const c = nonZero(-8, 8);
  return typed(
    `Find the discriminant of ${poly([[a, "x²"], [b, "x"], [c, ""]])} = 0.`,
    b * b - 4 * a * c,
    `Use b² − 4ac = ${P(b)}² − 4(${P(a)})(${P(c)}). Be careful with the signs.`,
    "integer",
  );
}

function discriminantNature(): Question | undefined {
  const a = nonZero(-3, 3);
  const b = nonZero(-8, 8);
  const c = nonZero(-8, 8);
  const D = b * b - 4 * a * c;
  const labels = ["Two distinct rational roots", "Two distinct irrational roots", "One repeated root", "No real roots"];
  let right: string;
  if (D < 0) right = labels[3];
  else if (D === 0) right = labels[2];
  else right = Number.isInteger(Math.sqrt(D)) ? labels[0] : labels[1];
  return mc(
    `What can you say about the roots of ${poly([[a, "x²"], [b, "x"], [c, ""]])} = 0?`,
    right,
    labels,
    `Compute D = b² − 4ac = ${D}. Negative: no real roots. Zero: one repeated root. Positive and a perfect square: two rational roots. Positive but not a perfect square: two irrational roots.`,
  );
}

function doubleRootK(): Question {
  const half = randInt(1, 8);
  return typed(
    `For what value of k does x² + ${2 * half}x + k = 0 have exactly one (repeated) root?`,
    half * half,
    `One repeated root means the discriminant is 0: ${2 * half}² − 4(1)(k) = 0. Solve for k.`,
    "number",
  );
}

function wordRectangle(): Question {
  const w = randInt(3, 12);
  const d = randInt(2, 8);
  return typed(
    `A rectangular garden is ${d} m longer than it is wide. Its area is ${w * (w + d)} m². How wide is it, in metres?`,
    w,
    `Let the width be w, so the length is w + ${d}. Then w(w + ${d}) = ${w * (w + d)}. Rearrange to 0 and factor, and reject any negative width.`,
    "number",
    undefined,
    "m",
  );
}

function wordConsecutive(): Question {
  const n = randInt(4, 15);
  return typed(
    `The product of two consecutive positive integers is ${n * (n + 1)}. What is the smaller integer?`,
    n,
    `Let the integers be n and n + 1. Solve n(n + 1) = ${n * (n + 1)}, i.e. n² + n − ${n * (n + 1)} = 0, and keep the positive root.`,
    "number",
  );
}

function wordFall(): Question {
  const t = randInt(2, 6);
  return typed(
    `A ball is thrown upward from the ground. Its height is h = −5t² + ${5 * t}t metres after t seconds. After how many seconds does it land?`,
    t,
    "It lands when h = 0. Factor −5t(t − " + t + ") = 0 and take the non-zero solution.",
    "number",
    undefined,
    "s",
  );
}

function quadEquations(opts?: GenerateOptions): Question[] {
  return build(
    [
      [1, factorSolve],
      [2, factorSolve],
      [1, factorExpr],
      [1, largerRoot],
      [3, factorHard],
      [1, completeNumber],
      [2, squareRootForm],
      [3, formulaRoots],
      [2, discriminantValue],
      [2, discriminantNature],
      [3, doubleRootK],
      [2, wordRectangle],
      [2, wordConsecutive],
      [2, wordFall],
    ],
    levelOf(opts),
  );
}

// =====================================================================
// 6. Inequalities
// =====================================================================

const OPS = ["<", ">", "≤", "≥"] as const;
type Op = (typeof OPS)[number];
const flipOp = (op: Op): Op => ({ "<": ">", ">": "<", "≤": "≥", "≥": "≤" })[op] as Op;
const swapStrict = (op: Op): Op => ({ "<": "≤", ">": "≥", "≤": "<", "≥": ">" })[op] as Op;

function linearIneq(lv: Level): Question | undefined {
  const a = lv === 1 ? randInt(2, 5) : nonZero(-6, 6);
  if (Math.abs(a) === 1) return undefined;
  const x0 = nonZero(-8, 8);
  const b = nonZero(-9, 9);
  const c = a * x0 + b;
  const op = pick(OPS);
  const result = a < 0 ? flipOp(op) : op;
  return mc(
    `Solve ${poly([[a, "x"], [b, ""]])} ${op} ${M(c)}.`,
    `x ${result} ${M(x0)}`,
    [`x ${a < 0 ? op : flipOp(op)} ${M(x0)}`, `x ${result} ${M(-x0)}`, `x ${a < 0 ? op : flipOp(op)} ${M(-x0)}`, `x ${swapStrict(result)} ${M(x0)}`],
    `Subtract ${M(b)} from both sides first (or add ${M(-b)}), then divide by ${M(a)}${a < 0 ? ". Dividing by a negative number reverses the inequality sign" : ""}.`,
  );
}

function smallestInt(): Question {
  const a = randInt(2, 5);
  const x0 = randInt(2, 9);
  const b = nonZero(-8, 8);
  const c = a * x0 + b;
  return typed(
    `What is the smallest integer that satisfies ${poly([[a, "x"], [b, ""]])} > ${M(c)}?`,
    x0 + 1,
    `Solve: x > ${x0}. The inequality is strict, so x = ${x0} doesn't count; the next integer does.`,
    "integer",
  );
}

function intv(op: Op, p: number, q: number, outside: boolean): string {
  if (outside) {
    return `x ${op === ">" || op === "<" ? "<" : "≤"} ${M(p)} or x ${op === ">" || op === "<" ? ">" : "≥"} ${M(q)}`;
  }
  const s = op === ">" || op === "<" ? "<" : "≤";
  return `${M(p)} ${s} x ${s} ${M(q)}`;
}

function quadIneq(): Question | undefined {
  const [r1, r2] = distinctRoots(2, -6, 6);
  const [p, q] = sortedRoots(r1, r2);
  const op = pick(OPS);
  const outside = op === ">" || op === "≥";
  return mc(
    `Solve ${poly([[1, "x²"], [-(p + q), "x"], [p * q, ""]])} ${op} 0.`,
    intv(op, p, q, outside),
    [intv(op, p, q, !outside), intv(swapStrict(op), p, q, outside), intv(op, -q, -p, outside), intv(swapStrict(op), p, q, !outside)],
    `Find the zeros ${M(p)} and ${M(q)}. A parabola that opens up is ${outside ? "above" : "below"} the x-axis ${outside ? "outside" : "between"} them. Strict signs (<, >) leave the endpoints out.`,
  );
}

function graphIneq(): Question | undefined {
  const [r1, r2] = distinctRoots(2, -5, 5);
  const [p, q] = sortedRoots(r1, r2);
  if (q - p < 2 || q - p > 6) return undefined;
  const a = pick([1, -1]);
  const op = pick(OPS);
  const pos = op === ">" || op === "≥";
  const outside = (a > 0) === pos;
  return mc(
    `The graph of y = ${a > 0 ? "" : "−"}${fac(-p)}${fac(-q)} is shown. Use it to solve y ${op} 0.`,
    intv(op, p, q, outside),
    [intv(op, p, q, !outside), intv(swapStrict(op), p, q, outside), intv(op, -q, -p, outside)],
    `Look at where the curve is ${pos ? "above" : "below"} the x-axis. The zeros ${M(p)} and ${M(q)} are the boundaries; include them only for ≤ or ≥.`,
    plotOf((x) => a * (x - p) * (x - q)),
  );
}

function pointTest(quad: boolean): Question | undefined {
  const m = pick([1, -1, 2, -2]);
  const b = quad ? randInt(-4, 2) : randInt(-3, 3);
  const f = quad ? (x: number) => x * x + b : (x: number) => m * x + b;
  const op = pick(["<", ">", "≤", "≥"] as Op[]);
  const tests = (x: number, y: number) => {
    const d = y - f(x);
    return op === ">" ? d > 0 : op === "<" ? d < 0 : op === "≥" ? d >= 0 : d <= 0;
  };
  for (let tries = 0; tries < 40; tries++) {
    const pts = sample(
      Array.from({ length: 11 * 13 }, (_, i) => ({ x: (i % 11) - 5, y: Math.floor(i / 11) - 6 })),
      4,
    );
    if (pts.some((p) => Math.abs(p.y - f(p.x)) < 1 && p.y !== f(p.x) && false)) continue;
    const good = pts.filter((p) => tests(p.x, p.y));
    if (good.length !== 1) continue;
    // keep the picture honest: no point exactly on the boundary
    if (pts.some((p) => p.y === f(p.x))) continue;
    const names = ["A", "B", "C", "D"];
    const label = (i: number) => `${names[i]} (${M(pts[i].x)}, ${M(pts[i].y)})`;
    const idx = pts.indexOf(good[0]);
    const eq = quad ? poly([[1, "x²"], [b, ""]]) : poly([[m, "x"], [b, ""]]);
    const boundary = quad
      ? curve(f, -8, 8)
      : lineCurve(m, b);
    const visual: Visual = {
      type: "plot",
      xMin: -8,
      xMax: 8,
      yMin: -8,
      yMax: 8,
      step: 1,
      curves: [{ ...boundary, dashed: op === "<" || op === ">" }],
      points: pts.map((p, i) => ({ x: p.x, y: p.y, label: names[i] })),
    };
    return mc(
      `Which labelled point is a solution of y ${op} ${eq}?`,
      label(idx),
      pts.map((_, i) => label(i)).filter((_, i) => i !== idx),
      `Substitute each point into the inequality, or see which side of the boundary it lies on. ${op === ">" || op === "≥" ? "y greater means above" : "y less means below"} the curve.`,
      visual,
    );
  }
  return undefined;
}

function boundaryType(): Question {
  const op = pick(OPS);
  const m = pick([1, 2, -1, -2, 3]);
  const b = nonZero(-5, 5);
  const quad = chance(0.4);
  const eq = quad ? poly([[1, "x²"], [b, ""]]) : poly([[m, "x"], [b, ""]]);
  const strict = op === "<" || op === ">";
  const above = op === ">" || op === "≥";
  const lab = (s: boolean, a: boolean) => `${s ? "Dashed" : "Solid"} boundary, shade ${a ? "above" : "below"}`;
  return mc(
    `How do you graph y ${op} ${eq}?`,
    lab(strict, above),
    [lab(!strict, above), lab(strict, !above), lab(!strict, !above)],
    "Strict inequalities (<, >) use a dashed boundary because points on the boundary aren't solutions; ≤ and ≥ use a solid one. y greater than means shade above; y less than means shade below.",
  );
}

function ineqWord(): Question {
  const price = randInt(4, 15);
  const fee = randInt(2, 10);
  const n = randInt(3, 12);
  const budget = price * n + fee + randInt(0, price - 1);
  return typed(
    `Tickets cost $${price} each plus a $${fee} booking fee. With $${budget}, what is the greatest number of tickets you can buy?`,
    n,
    `Write ${price}n + ${fee} ≤ ${budget}, solve for n, and round down to a whole number of tickets.`,
    "number",
  );
}

function inequalities(opts?: GenerateOptions): Question[] {
  return build(
    [
      [1, linearIneq],
      [2, linearIneq],
      [3, linearIneq],
      [1, smallestInt],
      [2, quadIneq],
      [3, quadIneq],
      [2, graphIneq],
      [2, () => pointTest(false)],
      [3, () => pointTest(true)],
      [1, boundaryType],
      [2, boundaryType],
      [2, ineqWord],
    ],
    levelOf(opts),
  );
}

// =====================================================================
// 7. Systems of equations
// =====================================================================

const lineEq = (m: number, b: number) => `y = ${poly([[m, "x"], [b, ""]])}`;

function linearSystem(): Question | undefined {
  const x0 = randInt(-6, 6);
  const y0 = randInt(-8, 8);
  const m1 = nonZero(-4, 4);
  let m2 = nonZero(-4, 4);
  if (m1 === m2) m2 = m1 + 1 || 2;
  if (m2 === 0) m2 = 3;
  const b1 = y0 - m1 * x0;
  const b2 = y0 - m2 * x0;
  const askX = chance(0.5);
  return typed(
    `Solve the system ${lineEq(m1, b1)} and ${lineEq(m2, b2)}. What is the ${askX ? "x" : "y"}-coordinate of the solution?`,
    askX ? x0 : y0,
    "Set the two right-hand sides equal to each other, solve for x, then substitute back to find y.",
    "integer",
  );
}

function intersectionPoints(lv: Level): Question | undefined {
  const x1 = randInt(-4, 4);
  const x2 = randInt(-4, 4);
  if (x1 === x2) return undefined;
  const c = lv === 1 ? 0 : randInt(-4, 3);
  const f = (x: number) => x * x + c;
  const m = x1 + x2;
  const d = f(x1) - m * x1;
  const [p, q] = sortedRoots(x1, x2);
  if (Math.abs(f(p)) > 9 || Math.abs(f(q)) > 9) return undefined;
  const label = (pts: number[][]) => pts.map(([x, y]) => `(${M(x)}, ${M(y)})`).join(" and ");
  const right = label([[p, f(p)], [q, f(q)]]);
  const wrong = [
    label([[p, -f(p)], [q, -f(q)]]),
    label([[p, f(q)], [q, f(p)]]),
    label([[-p, f(p)], [-q, f(q)]]),
    `(${M(p)}, ${M(f(p))}) only`,
  ];
  return mc(
    `The graph shows a parabola and the line y = ${poly([[m, "x"], [d, ""]])}. Where do they intersect?`,
    right,
    wrong,
    "Read the points where the two graphs cross. You can check algebraically: set x² + c = mx + d, solve for x, then substitute to find each y.",
    {
      type: "plot",
      xMin: -8,
      xMax: 8,
      yMin: -10,
      yMax: 10,
      step: 1,
      curves: [curve(f, -8, 8), lineCurve(m, d)],
    },
  );
}

function intersectionCount(): Question {
  const c = randInt(-4, 4);
  const k = pick([c - 3, c - 1, c, c + 1, c + 4]);
  const n = k > c ? 2 : k === c ? 1 : 0;
  return mc(
    `How many points do the graphs of y = ${poly([[1, "x²"], [c, ""]])} and y = ${k} share?`,
    n === 0 ? "None" : n === 1 ? "One" : "Two",
    ["None", "One", "Two"],
    `Set x² ${c < 0 ? "−" : "+"} ${Math.abs(c)} = ${k} and solve for x². If x² is positive you get two values of x; if 0, one; if negative, none.`,
  );
}

function substitution(): Question | undefined {
  const m = nonZero(-4, 4);
  const d = nonZero(-6, 6);
  const c = nonZero(-6, 6);
  const b = nonZero(-4, 4);
  // y = m x + d and y = x² + b x + c  ->  x² + (b − m)x + (c − d) = 0
  const right = `${poly([[1, "x²"], [b - m, "x"], [c - d, ""]])} = 0`;
  const wrong = [
    `${poly([[1, "x²"], [b + m, "x"], [c + d, ""]])} = 0`,
    `${poly([[1, "x²"], [b - m, "x"], [c + d, ""]])} = 0`,
    `${poly([[1, "x²"], [b + m, "x"], [c - d, ""]])} = 0`,
  ];
  return mc(
    `Substituting y = ${poly([[m, "x"], [d, ""]])} into y = ${poly([[1, "x²"], [b, "x"], [c, ""]])} and moving everything to one side gives…`,
    right,
    wrong,
    "Set the two expressions for y equal: x² + bx + c = mx + d. Then subtract mx + d from both sides, being careful to change every sign.",
  );
}

function oppositeParabolas(): Question {
  const c1 = randInt(-5, 3);
  const x0 = randInt(1, 3);
  const c2 = c1 + 2 * x0 * x0;
  const y = x0 * x0 + c1;
  const f1 = poly([[1, "x²"], [c1, ""]]);
  const f2 = poly([[-1, "x²"], [c2, ""]]);
  const label = (a: number, b: number) => `(${M(-a)}, ${M(b)}) and (${M(a)}, ${M(b)})`;
  return mc(
    `Find the solutions of the system y = ${f1} and y = ${f2}.`,
    label(x0, y),
    [label(x0, -y), `(${M(x0)}, ${M(y)}) only`, label(x0 * x0, y), label(x0, c1)],
    `Set the right sides equal: ${f1} = ${f2}. That gives 2x² = ${c2 - c1}, so x² = ${x0 * x0} and x = ±${x0}. Substitute either value into one equation to find y.`,
  );
}

function phonePlans(): Question | undefined {
  const x0 = randInt(2, 12);
  const b = randInt(1, 4);
  const d = b + randInt(1, 4);
  const c = randInt(5, 20);
  const a = c + (d - b) * x0;
  return typed(
    `Plan A costs $${a} plus $${b} per GB. Plan B costs $${c} plus $${d} per GB. For how many GB do the plans cost the same?`,
    x0,
    `Set ${a} + ${b}x = ${c} + ${d}x and solve for x.`,
    "number",
    undefined,
    "GB",
  );
}

function systems(opts?: GenerateOptions): Question[] {
  return build(
    [
      [1, linearSystem],
      [1, intersectionPoints],
      [2, intersectionPoints],
      [3, intersectionPoints],
      [1, intersectionCount],
      [2, intersectionCount],
      [2, substitution],
      [3, oppositeParabolas],
      [2, phonePlans],
      [1, phonePlans],
    ],
    levelOf(opts),
  );
}

// =====================================================================
// 8. Sequences and series
// =====================================================================

const ord = (n: number): string => {
  const t = n % 100;
  const suffix = t >= 11 && t <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ?? "th";
  return `${n}${suffix}`;
};
const seqText = (terms: number[]) => terms.map(M).join(", ") + ", …";

function arithTerm(lv: Level): Question {
  const a = randInt(-10, 20);
  const d = nonZero(lv === 1 ? 2 : -8, 8);
  const n = lv === 1 ? randInt(8, 15) : randInt(15, 40);
  const terms = [0, 1, 2, 3].map((i) => a + i * d);
  return typed(
    `Find the ${ord(n)} term of the arithmetic sequence ${seqText(terms)}`,
    a + (n - 1) * d,
    `Common difference d = ${M(d)}. Use tₙ = t₁ + (n − 1)d = ${M(a)} + (${n} − 1)(${M(d)}).`,
    "integer",
  );
}

function arithFindN(): Question {
  const a = randInt(1, 20);
  const d = randInt(2, 9);
  const n = randInt(10, 40);
  const last = a + (n - 1) * d;
  return typed(
    `How many terms are in the arithmetic sequence ${a}, ${a + d}, ${a + 2 * d}, …, ${last}?`,
    n,
    `Solve ${last} = ${a} + (n − 1)(${d}) for n.`,
    "number",
  );
}

function arithSum(): Question {
  const a = randInt(1, 15);
  const d = randInt(2, 7);
  const n = randInt(8, 25);
  const s = (n * (2 * a + (n - 1) * d)) / 2;
  return typed(
    `Find the sum of the first ${n} terms of ${a}, ${a + d}, ${a + 2 * d}, …`,
    s,
    `Use Sₙ = n/2 [2t₁ + (n − 1)d] = ${n}/2 × [2(${a}) + (${n - 1})(${d})].`,
    "number",
  );
}

function generalTermFormula(): Question {
  const a = randInt(-5, 12);
  const d = nonZero(-6, 6);
  const terms = [0, 1, 2, 3].map((i) => a + i * d);
  const right = `tₙ = ${poly([[d, "n"], [a - d, ""]])}`;
  const wrong = [`tₙ = ${poly([[d, "n"], [a, ""]])}`, `tₙ = ${poly([[a, "n"], [d, ""]])}`, `tₙ = ${poly([[d, "n"], [a + d, ""]])}`, `tₙ = ${poly([[a, "n"], [-d, ""]])}`];
  return mc(
    `Which formula gives the general term of ${seqText(terms)}`,
    right,
    wrong,
    `tₙ = t₁ + (n − 1)d = ${M(a)} + (n − 1)(${M(d)}). Expand and simplify, then test n = 1: you should get ${M(a)}.`,
  );
}

function geoRatio(): Question {
  const r = pick([2, 3, -2, -3, 4, 5]);
  const a = nonZero(-4, 6);
  const terms = [0, 1, 2, 3].map((i) => a * r ** i);
  return typed(`What is the common ratio of ${seqText(terms)}`, r, "Divide any term by the term before it: t₂ ÷ t₁.", "integer");
}

function geoTerm(): Question {
  const r = pick([2, 3, -2, 4, -3]);
  const a = nonZero(1, 5);
  const n = randInt(5, 8);
  const terms = [0, 1, 2].map((i) => a * r ** i);
  return typed(
    `Find the ${ord(n)} term of the geometric sequence ${seqText(terms)}`,
    a * r ** (n - 1),
    `r = ${M(r)}. Use tₙ = t₁ rⁿ⁻¹ = ${a} × ${P(r)}^${n - 1}.`,
    "integer",
  );
}

function geoSum(): Question {
  const r = pick([2, 3]);
  const a = randInt(1, 5);
  const n = randInt(4, 7);
  const s = (a * (r ** n - 1)) / (r - 1);
  return typed(
    `Find the sum of the first ${n} terms of the geometric series ${a} + ${a * r} + ${a * r * r} + …`,
    s,
    `Use Sₙ = t₁(rⁿ − 1)/(r − 1) = ${a}(${r}^${n} − 1)/(${r} − 1).`,
    "number",
  );
}

function infiniteSum(): Question {
  const [num, den] = pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]]);
  const a = den * den * randInt(1, 3);
  const s = (a * den) / (den - num);
  if (!Number.isInteger(s)) return infiniteSum();
  return typed(
    `Find the sum of the infinite geometric series ${a} + ${(a * num) / den} + ${(a * num * num) / (den * den)} + … (enter a whole number).`,
    s,
    `r = ${num}/${den}, and |r| < 1 so the series has a sum: S∞ = t₁/(1 − r) = ${a} ÷ (1 − ${num}/${den}).`,
    "number",
  );
}

function classifySeq(): Question {
  const kind = pick(["arith", "geo", "neither"]);
  let terms: number[];
  if (kind === "arith") {
    const a = randInt(1, 12);
    const d = nonZero(-5, 6);
    terms = [0, 1, 2, 3].map((i) => a + i * d);
  } else if (kind === "geo") {
    const a = randInt(1, 5);
    const r = pick([2, 3, -2]);
    terms = [0, 1, 2, 3].map((i) => a * r ** i);
  } else {
    terms = pick([[1, 4, 9, 16], [1, 1, 2, 3], [2, 3, 5, 8], [1, 2, 4, 7], [3, 6, 9, 15], [1, 3, 9, 12]]);
  }
  return mc(
    `Is ${seqText(terms)} arithmetic, geometric or neither?`,
    kind === "arith" ? "Arithmetic" : kind === "geo" ? "Geometric" : "Neither",
    ["Arithmetic", "Geometric", "Neither"],
    "Arithmetic: the same number is added each time (constant differences). Geometric: the same number is multiplied each time (constant ratios). Check both.",
  );
}

function seatsWord(): Question {
  const a = randInt(8, 20);
  const d = randInt(2, 4);
  const n = randInt(8, 20);
  return typed(
    `A theatre's first row has ${a} seats and each row behind has ${d} more than the one in front. How many seats are in the first ${n} rows?`,
    (n * (2 * a + (n - 1) * d)) / 2,
    `This is an arithmetic series with t₁ = ${a}, d = ${d}, n = ${n}. Use Sₙ = n/2 [2t₁ + (n − 1)d].`,
    "number",
  );
}

function bounceWord(): Question {
  const h = 32 * randInt(1, 6);
  const n = pick([3, 4, 5]);
  return typed(
    `A ball is dropped from ${h} cm and rebounds to half of its previous height each bounce. How high is the rebound after bounce ${n}, in centimetres?`,
    h / 2 ** n,
    `Heights form a geometric sequence with ratio 1/2. After ${n} bounces: ${h} × (1/2)^${n}.`,
    "number",
    undefined,
    "cm",
  );
}

function sequences(opts?: GenerateOptions): Question[] {
  return build(
    [
      [1, arithTerm],
      [2, arithTerm],
      [2, arithFindN],
      [2, arithSum],
      [3, generalTermFormula],
      [1, geoRatio],
      [2, geoTerm],
      [3, geoSum],
      [3, infiniteSum],
      [1, classifySeq],
      [2, seatsWord],
      [2, bounceWord],
    ],
    levelOf(opts),
  );
}

// =====================================================================
// 9. Sine and cosine laws
// =====================================================================

function sineSide(lv: Level): Question | undefined {
  const A = randInt(25, 75);
  const B = randInt(25, 90);
  if (A + B >= 160 || A === B) return undefined;
  const a = randInt(8, 30);
  const b = (a * Math.sin(rad(B))) / Math.sin(rad(A));
  if (!safeRound(b, 1)) return undefined;
  const prompt = `In △ABC, ∠A = ${A}°, ∠B = ${B}° and side a = ${a} cm. Find side b to the nearest tenth.`;
  const hint = "Sine law: a/sin A = b/sin B. Solve b = a sin B ÷ sin A. Keep the full calculator value until the end.";
  if (lv === 1) {
    const bad = (a * Math.sin(rad(A))) / Math.sin(rad(B));
    const wrong = [bad, (a * Math.cos(rad(B))) / Math.cos(rad(A)), a + b / 2, b + 3].map((v) => `${v.toFixed(1)} cm`);
    return mc(prompt, `${b.toFixed(1)} cm`, wrong, hint);
  }
  return typedDec(prompt, b, hint, "cm");
}

function sineAngle(): Question | undefined {
  const A = randInt(25, 70);
  const a = randInt(10, 30);
  const b = randInt(10, 30);
  const sinB = (b * Math.sin(rad(A))) / a;
  if (sinB >= 0.95 || sinB <= 0.1 || a <= b) return undefined; // a > b: only one triangle
  const B = (Math.asin(sinB) * 180) / Math.PI;
  if (!safeRound(B, 0)) return undefined;
  return typed(
    `In △ABC, ∠A = ${A}°, a = ${a} cm and b = ${b} cm (a is the longer side). Find ∠B to the nearest degree.`,
    Math.round(B),
    "Sine law: sin B / b = sin A / a. Find sin B, then use sin⁻¹. Since a > b, angle B must be acute.",
    "number",
    undefined,
    "°",
  );
}

function cosSide(lv: Level): Question | undefined {
  const a = randInt(6, 20);
  const b = randInt(6, 20);
  const C = randInt(30, 140);
  const c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(rad(C)));
  if (!safeRound(c, 1)) return undefined;
  const prompt = `In △ABC, a = ${a} cm, b = ${b} cm and ∠C = ${C}°. Find side c to the nearest tenth.`;
  const hint = "Cosine law: c² = a² + b² − 2ab cos C. Work out the right side, then take the square root.";
  if (lv === 1) {
    const forgetSqrt = c * c;
    const plus = Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(rad(C)));
    const wrong = [forgetSqrt, plus, Math.sqrt(a * a + b * b), (a + b) / 2].map((v) => `${v.toFixed(1)} cm`);
    return mc(prompt, `${c.toFixed(1)} cm`, wrong, hint);
  }
  return typedDec(prompt, c, hint, "cm");
}

function cosAngle(): Question | undefined {
  const a = randInt(5, 16);
  const b = randInt(5, 16);
  const c = randInt(5, 16);
  if (a + b <= c || a + c <= b || b + c <= a) return undefined;
  const C = (Math.acos((a * a + b * b - c * c) / (2 * a * b)) * 180) / Math.PI;
  if (!safeRound(C, 0)) return undefined;
  return typed(
    `A triangle has sides ${a} cm, ${b} cm and ${c} cm. Find the angle opposite the ${c} cm side to the nearest degree.`,
    Math.round(C),
    `Cosine law rearranged: cos C = (a² + b² − c²) / (2ab) = (${a * a} + ${b * b} − ${c * c}) / ${2 * a * b}. Then use cos⁻¹.`,
    "number",
    undefined,
    "°",
  );
}

function whichLaw(): Question {
  const cases: { given: string; law: string }[] = [
    { given: "two sides and the angle between them (SAS)", law: "Cosine law" },
    { given: "all three sides (SSS)", law: "Cosine law" },
    { given: "two angles and the side between them (ASA)", law: "Sine law" },
    { given: "two angles and a side not between them (AAS)", law: "Sine law" },
  ];
  const c = pick(cases);
  return mc(
    `You know ${c.given} and want to find a missing side or angle. Which law do you start with?`,
    c.law,
    [c.law === "Sine law" ? "Cosine law" : "Sine law", "Pythagorean theorem (needs a right angle)"],
    "Sine law needs a matching pair (a side and its opposite angle). Cosine law is for SAS (side-angle-side) or SSS, where no such pair exists yet.",
  );
}

function ambiguous(): Question | undefined {
  const A = randInt(22, 58);
  const b = randInt(9, 24);
  const a = randInt(4, b + 8);
  const h = b * Math.sin(rad(A));
  let n: number;
  if (a < h - 0.3) n = 0;
  else if (Math.abs(a - h) < 0.3) return undefined;
  else if (a < b) n = 2;
  else n = 1;
  return mc(
    `In △ABC, ∠A = ${A}°, b = ${b} cm and a = ${a} cm. How many triangles are possible?`,
    n === 0 ? "No triangle" : n === 1 ? "One triangle" : "Two triangles",
    ["No triangle", "One triangle", "Two triangles"],
    `This is the SSA (ambiguous) case with an acute angle. Compute the height h = b sin A ≈ ${h.toFixed(1)} cm. If a < h: none. If h < a < b: two. If a ≥ b: one.`,
  );
}

function thirdAngle(): Question {
  const A = randInt(30, 80);
  const B = randInt(30, 80);
  return typed(`In △ABC, ∠A = ${A}° and ∠B = ${B}°. What is ∠C?`, 180 - A - B, "The angles of a triangle add to 180°. This is the first step before using the sine law.", "number", undefined, "°");
}

function areaSine(): Question | undefined {
  const a = randInt(6, 20);
  const b = randInt(6, 20);
  const C = randInt(25, 150);
  const area = 0.5 * a * b * Math.sin(rad(C));
  if (!safeRound(area, 1)) return undefined;
  return typedDec(
    `A triangle has two sides of ${a} cm and ${b} cm with an included angle of ${C}°. Find its area to the nearest tenth.`,
    area,
    "Area = ½ ab sin C when C is the angle between the two sides.",
    "cm²",
  );
}

function riverWord(): Question | undefined {
  const AB = randInt(60, 200);
  const A = randInt(40, 80);
  const B = randInt(40, 80);
  const C = 180 - A - B;
  const AC = (AB * Math.sin(rad(B))) / Math.sin(rad(C));
  if (A + B >= 150 || !safeRound(AC, 1)) return undefined;
  return typedDec(
    `A surveyor stands at A and B, ${AB} m apart on one bank of a lake, and sights a post C on the far shore. ∠CAB = ${A}° and ∠CBA = ${B}°. How far is it from A to C, to the nearest tenth of a metre?`,
    AC,
    `First find ∠C = 180° − ${A}° − ${B}° = ${C}°. Then use the sine law: AC / sin B = AB / sin C.`,
    "m",
  );
}

function sinecosine(opts?: GenerateOptions): Question[] {
  return build(
    [
      [1, thirdAngle],
      [1, whichLaw],
      [1, sineSide],
      [2, sineSide],
      [3, sineAngle],
      [1, cosSide],
      [2, cosSide],
      [3, cosAngle],
      [2, ambiguous],
      [3, ambiguous],
      [2, areaSine],
      [3, riverWord],
    ],
    levelOf(opts),
  );
}

// =====================================================================
// 10. Angles in standard position and exact values
// =====================================================================

type Fn = "sin" | "cos" | "tan";
const EXACT: Record<Fn, Record<number, string>> = {
  sin: { 30: "1/2", 45: "√2/2", 60: "√3/2" },
  cos: { 30: "√3/2", 45: "√2/2", 60: "1/2" },
  tan: { 30: "√3/3", 45: "1", 60: "√3" },
};
const ALL_VALUES = ["1/2", "√2/2", "√3/2", "1", "√3/3", "√3"];

function quadrantOf(theta: number): 1 | 2 | 3 | 4 {
  return theta < 90 ? 1 : theta < 180 ? 2 : theta < 270 ? 3 : 4;
}
function refAngle(theta: number): number {
  const q = quadrantOf(theta);
  return q === 1 ? theta : q === 2 ? 180 - theta : q === 3 ? theta - 180 : 360 - theta;
}
function positive(fn: Fn, q: number): boolean {
  return fn === "sin" ? q <= 2 : fn === "cos" ? q === 1 || q === 4 : q === 1 || q === 3;
}
function exactValue(fn: Fn, theta: number): string {
  const mag = EXACT[fn][refAngle(theta)];
  return positive(fn, quadrantOf(theta)) ? mag : `−${mag}`;
}

function exactSpecial(lv: Level): Question {
  const fn = pick<Fn>(["sin", "cos", "tan"]);
  const r = pick([30, 45, 60]);
  const theta = lv === 1 ? r : pick([r, 180 - r, 180 + r, 360 - r]);
  const right = exactValue(fn, theta);
  const pool = ALL_VALUES.flatMap((v) => [v, `−${v}`]);
  const q = quadrantOf(theta);
  const wrong = lv === 1 ? ALL_VALUES : [...ALL_VALUES, positive(fn, q) ? `−${right}` : right.slice(1)].concat(sample(pool, 2));
  return mc(
    `What is the exact value of ${fn} ${theta}°?`,
    right,
    wrong,
    lv === 1
      ? "Remember the special triangles: 30-60-90 has sides 1, √3, 2; 45-45-90 has sides 1, 1, √2. Use SOH-CAH-TOA."
      : `The reference angle is ${r}°, so the size is ${EXACT[fn][r]}. Then decide the sign: in quadrant ${q}, ${fn} is ${positive(fn, q) ? "positive" : "negative"} (ASTC).`,
  );
}

function refAngleQ(): Question {
  const theta = pick([randInt(95, 175), randInt(185, 265), randInt(275, 355)]);
  const ref = refAngle(theta);
  return typed(
    `What is the reference angle for ${theta}°?`,
    ref,
    `The reference angle is the acute angle to the x-axis. In quadrant ${quadrantOf(theta)}, use ${["", "", "180° − θ", "θ − 180°", "360° − θ"][quadrantOf(theta)]}.`,
    "number",
    undefined,
    "°",
  );
}

function quadrantQ(): Question {
  const theta = randInt(5, 355);
  if ([90, 180, 270].includes(theta)) return quadrantQ();
  const q = quadrantOf(theta);
  return mc(
    `In which quadrant does the terminal arm of ${theta}° lie?`,
    `Quadrant ${q === 1 ? "I" : q === 2 ? "II" : q === 3 ? "III" : "IV"}`,
    ["Quadrant I", "Quadrant II", "Quadrant III", "Quadrant IV"],
    "Quadrant I: 0°–90°, II: 90°–180°, III: 180°–270°, IV: 270°–360°.",
  );
}

function coterminal(): Question {
  const mode = pick(["pos", "neg", "big"]);
  if (mode === "pos") {
    const t = randInt(20, 340);
    return typed(`Find the angle between 0° and 360° that is coterminal with ${t + 360}°.`, t, "Coterminal angles differ by multiples of 360°. Subtract 360°.", "number", undefined, "°");
  }
  if (mode === "neg") {
    const t = randInt(20, 170);
    return typed(`Find the angle between 0° and 360° that is coterminal with −${t}°.`, 360 - t, "Add 360° to a negative angle to find its coterminal angle in a full turn.", "number", undefined, "°");
  }
  const t = randInt(20, 340);
  const k = randInt(2, 3);
  return typed(`Find the angle between 0° and 360° that is coterminal with ${t + 360 * k}°.`, t, `Subtract 360° repeatedly (${k} times): ${t + 360 * k} − ${360 * k}.`, "number", undefined, "°");
}

const TRIPLES: [number, number, number][] = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
];

function armRatio(lv: Level): Question {
  const [u, v, r] = pick(TRIPLES);
  const [ax, ay] = chance(0.5) ? [u, v] : [v, u];
  const x = chance(0.5) ? ax : -ax;
  const y = chance(0.5) ? ay : -ay;
  const fn = pick<Fn>(["sin", "cos", "tan"]);
  const ans = fn === "sin" ? frac(y, r) : fn === "cos" ? frac(x, r) : frac(y, x);
  const size = Math.max(Math.abs(x), Math.abs(y)) + 1;
  const s = size > 10 ? Math.ceil(size / 2) * 2 : size;
  const vis: Visual = {
    type: "plot",
    xMin: -s,
    xMax: s,
    yMin: -s,
    yMax: s,
    step: s > 10 ? 2 : 1,
    curves: [{ points: [{ x: 0, y: 0 }, { x, y }] }],
    points: [{ x, y, label: `P(${M(x)}, ${M(y)})` }],
  };
  const prompt = `The terminal arm of angle θ in standard position passes through P(${M(x)}, ${M(y)}). Find ${fn} θ.`;
  const hint = `The distance from the origin is r = √(${x * x} + ${y * y}) = ${r}. Then sin = y/r, cos = x/r, tan = y/x. Keep the sign of each coordinate.`;
  if (lv === 3) return typed(prompt + " Enter a fraction in lowest terms.", ans.replace("−", "-"), hint, "fraction", vis);
  const wrong = [
    fn === "sin" ? frac(x, r) : fn === "cos" ? frac(y, r) : frac(x, y),
    frac(-(fn === "sin" ? y : fn === "cos" ? x : y), fn === "tan" ? x : r),
    fn === "sin" ? frac(y, x) : fn === "cos" ? frac(x, y) : frac(y, r),
    fn === "tan" ? frac(-y, -x) === ans ? frac(x, r) : frac(-y, -x) : frac(Math.abs(fn === "sin" ? y : x), r) === ans ? frac(r, Math.abs(fn === "sin" ? y : x)) : frac(Math.abs(fn === "sin" ? y : x), r),
  ];
  return mc(prompt, ans, wrong, hint, vis);
}

function solveTrig(): Question {
  const fn = pick<Fn>(["sin", "cos", "tan"]);
  const r = pick([30, 45, 60]);
  const sign = pick([true, false]);
  const value = sign ? EXACT[fn][r] : `−${EXACT[fn][r]}`;
  const quads: Record<string, number[]> = {
    "1,2": [r, 180 - r],
    "3,4": [180 + r, 360 - r],
    "1,4": [r, 360 - r],
    "2,3": [180 - r, 180 + r],
    "1,3": [r, 180 + r],
    "2,4": [180 - r, 360 - r],
  };
  const qs: number[] = [1, 2, 3, 4].filter((q) => positive(fn, q) === sign);
  const key = qs.join(",");
  const lab = (a: number[]) => [...a].sort((s, t) => s - t).map((d) => `${d}°`).join(" and ");
  const wrongs = Object.entries(quads)
    .filter(([k]) => k !== key)
    .map(([, v]) => lab(v));
  return mc(
    `Solve ${fn} θ = ${value} for 0° ≤ θ ≤ 360°.`,
    lab(quads[key]),
    wrongs,
    `The reference angle is ${r}°. ${fn} is ${sign ? "positive" : "negative"} in quadrants ${qs.map((q) => ["", "I", "II", "III", "IV"][q]).join(" and ")}, so find the angles there with reference angle ${r}°.`,
  );
}

function signQuadrant(): Question {
  const combos: [string, string, string][] = [
    ["sin θ > 0 and cos θ > 0", "Quadrant I", "all are positive in quadrant I"],
    ["sin θ > 0 and cos θ < 0", "Quadrant II", "only sine is positive in quadrant II"],
    ["sin θ < 0 and cos θ < 0", "Quadrant III", "only tangent is positive in quadrant III"],
    ["sin θ < 0 and cos θ > 0", "Quadrant IV", "only cosine is positive in quadrant IV"],
  ];
  const [cond, ans, why] = pick(combos);
  return mc(
    `In which quadrant could the terminal arm lie if ${cond}?`,
    ans,
    ["Quadrant I", "Quadrant II", "Quadrant III", "Quadrant IV"],
    `Use the ASTC rule: ${why}. Match both conditions.`,
  );
}

function angles(opts?: GenerateOptions): Question[] {
  return build(
    [
      [1, quadrantQ],
      [1, exactSpecial],
      [2, exactSpecial],
      [3, exactSpecial],
      [1, refAngleQ],
      [2, refAngleQ],
      [1, coterminal],
      [2, armRatio],
      [3, armRatio],
      [2, solveTrig],
      [3, solveTrig],
      [2, signQuadrant],
    ],
    levelOf(opts),
  );
}

// =====================================================================
// The course
// =====================================================================

export const course: Course = {
  grade: "11",
  subject: "math",
  bigIdeas: {
    "ca-bc": [
      "Absolute value describes the distance of a number from zero, and radicals extend our number system beyond the rational numbers.",
      "Rational expressions and equations follow the same rules as numeric fractions, with restrictions on the variable.",
      "Quadratic functions and equations model situations with a maximum, a minimum or a change in direction, and can be represented in several equivalent forms.",
      "Inequalities and systems describe situations where more than one condition must be satisfied at once.",
      "Arithmetic and geometric sequences and series describe patterns of constant change and constant growth.",
      "Trigonometric ratios extend beyond right triangles to any angle, and the sine and cosine laws let us solve any triangle.",
    ],
  },
  units: [
    {
      id: "radicals",
      title: "Radicals",
      emoji: "√",
      blurb: "Simplify, combine and rationalize",
      parentNote:
        "Absolute value of numbers, entire and mixed radicals, adding, subtracting and multiplying radicals, ordering and classifying irrational numbers, and rationalizing a monomial denominator. This course follows the Pre-calculus 11 (academic) pathway; Foundations of Mathematics 11 and Workplace Mathematics 11 are other pathways not covered here.",
      standards: { "ca-bc": "Pre-calculus 11: absolute value of a real number; operations on radicals with numerical radicands; rationalizing monomial denominators; mixed and entire radicals" },
      generate: radicals,
    },
    {
      id: "abs-radical-equations",
      title: "Absolute Value & Radical Equations",
      emoji: "🧮",
      blurb: "Solve, check, reject extraneous roots",
      parentNote:
        "Solving equations with an absolute value (two cases), writing absolute-value statements for distance, and solving radical equations, including checking for extraneous roots and finding restrictions on the variable.",
      standards: { "ca-bc": "Pre-calculus 11: absolute value equations; solving radical equations and identifying extraneous roots; restrictions on radicands" },
      generate: absRadEq,
    },
    {
      id: "rational-expressions",
      title: "Rational Expressions & Equations",
      emoji: "➗",
      blurb: "Fractions with variables",
      parentNote:
        "Non-permissible values, simplifying, multiplying, dividing, adding and subtracting rational expressions, and solving rational equations, including recognizing extraneous solutions.",
      standards: { "ca-bc": "Pre-calculus 11: rational expressions and equations; non-permissible values; operations on rational expressions with monomial and binomial denominators" },
      generate: rationals,
    },
    {
      id: "quadratic-functions",
      title: "Quadratic Functions",
      emoji: "📈",
      blurb: "Parabolas, vertices and graphs",
      parentNote:
        "Reading parabolas from graphs, vertex form and standard form, transformations of y = x², finding the vertex, axis of symmetry, intercepts, domain and range, and modelling with maximum or minimum values.",
      standards: { "ca-bc": "Pre-calculus 11: quadratic functions in vertex and standard form; transformations; vertex, axis of symmetry, intercepts, domain and range" },
      generate: quadFunctions,
    },
    {
      id: "quadratic-equations",
      title: "Quadratic Equations",
      emoji: "🧩",
      blurb: "Factor, complete, use the formula",
      parentNote:
        "Solving quadratic equations by factoring, taking square roots, completing the square and the quadratic formula; using the discriminant to describe roots; and solving word problems that lead to quadratic equations.",
      standards: { "ca-bc": "Pre-calculus 11: solving quadratic equations by factoring, completing the square and the quadratic formula; discriminant; problems involving quadratic equations" },
      generate: quadEquations,
    },
    {
      id: "inequalities",
      title: "Inequalities",
      emoji: "⚖️",
      blurb: "Solve and graph regions",
      parentNote:
        "Solving linear and quadratic inequalities in one variable (including from a graph), and deciding which points satisfy an inequality in two variables, including boundary lines and shading.",
      standards: { "ca-bc": "Pre-calculus 11: linear and quadratic inequalities in one variable; linear and quadratic inequalities in two variables" },
      generate: inequalities,
    },
    {
      id: "systems",
      title: "Systems of Equations",
      emoji: "✖️",
      blurb: "Where do two graphs meet?",
      parentNote:
        "Solving systems of two linear equations and systems with a linear and a quadratic equation (and two quadratics), by graphing and algebra, and counting the number of solutions.",
      standards: { "ca-bc": "Pre-calculus 11: systems of linear-quadratic and quadratic-quadratic equations in two variables, solved graphically and algebraically" },
      generate: systems,
    },
    {
      id: "sequences-series",
      title: "Sequences & Series",
      emoji: "🔢",
      blurb: "Patterns that add or multiply",
      parentNote:
        "Arithmetic and geometric sequences: common difference and ratio, general terms, finding the number of terms, sums of finite series, and the sum of an infinite geometric series.",
      standards: { "ca-bc": "Pre-calculus 11: arithmetic and geometric sequences and series; general term; sum of finite and infinite geometric series" },
      generate: sequences,
    },
    {
      id: "sine-cosine-laws",
      title: "Sine & Cosine Laws",
      emoji: "📐",
      blurb: "Solve any triangle",
      parentNote:
        "Choosing between the sine law and cosine law, finding unknown sides and angles in non-right triangles, the ambiguous (SSA) case, area using sine, and applications such as surveying.",
      standards: { "ca-bc": "Pre-calculus 11: sine law and cosine law, including the ambiguous case; problem solving with triangles" },
      generate: sinecosine,
    },
    {
      id: "angles-exact-values",
      title: "Angles & Exact Values",
      emoji: "🧭",
      blurb: "Beyond right triangles",
      parentNote:
        "Angles in standard position, quadrants, reference and coterminal angles, trigonometric ratios from a point on the terminal arm, exact values for 30°, 45° and 60° (and their related angles), and solving simple trigonometric equations from 0° to 360°.",
      standards: { "ca-bc": "Pre-calculus 11: angles in standard position from 0° to 360°; reference angles; trigonometric ratios of any angle; exact values for special angles" },
      generate: angles,
    },
  ],
};
