import { chance, pick, randInt, sample, shuffle, textChoice } from "../../random";
import type { Course, GenerateOptions, InputQuestion, Question, Visual } from "../../types";

// Grade 12 maths: BC Pre-calculus 12 (the academic pathway). Every answer is computed in code from
// the same numbers that appear in the prompt. Whole numbers are used wherever a typed answer is
// asked for, and decimals are only used when rounded to a stated number of places.

type Level = 1 | 2 | 3;
const levelOf = (opts?: GenerateOptions): Level => opts?.difficulty ?? 2;

type Maker = (lv: Level) => Question;
/** A maker, optionally limited to a range of difficulty levels. */
type Entry = Maker | [Maker, Level, Level];

/** Draw `n` questions from the makers that suit this level, using each type before repeating one. */
function build(entries: Entry[], lv: Level, n = 8): Question[] {
  const ok = entries.filter((e) => (Array.isArray(e) ? e[1] <= lv && lv <= e[2] : true));
  const makers = (ok.length >= 4 ? ok : entries).map((e) => (Array.isArray(e) ? e[0] : e));
  const out: Question[] = [];
  let pool = shuffle(makers);
  while (out.length < n) {
    if (pool.length === 0) pool = shuffle(makers);
    out.push(pool.pop()!(lv));
  }
  return out;
}

// ---------- Shared helpers ----------

const MINUS = "−";
const num = (n: number): string => (n < 0 ? `${MINUS}${-n}` : String(n === 0 ? 0 : n));
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const nz = (a: number, b: number): number => {
  let n: number;
  do n = randInt(a, b);
  while (n === 0);
  return n;
};
const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const SUB = "₀₁₂₃₄₅₆₇₈₉";
const sup = (n: number): string => String(n).split("").map((c) => (c === "-" ? "⁻" : SUP[Number(c)])).join("");
const sub = (n: number): string => String(n).split("").map((c) => SUB[Number(c)]).join("");
const round = (x: number, dp = 4): number => Math.round(x * 10 ** dp) / 10 ** dp;

/** A reduced fraction as text (negative uses "−" for reading, "-" when ascii is true). */
function frac(n: number, d: number, ascii = false): string {
  const g = gcd(n, d) || 1;
  let nn = n / g;
  let dd = d / g;
  if (dd < 0) {
    nn = -nn;
    dd = -dd;
  }
  const sign = nn < 0 ? (ascii ? "-" : MINUS) : "";
  return dd === 1 ? `${sign}${Math.abs(nn)}` : `${sign}${Math.abs(nn)}/${dd}`;
}

/** A hand-written multiple-choice question; wrong answers are de-duplicated and capped at four. */
function mc(prompt: string, right: string, wrong: string[], hint: string, visual?: Visual): Question {
  const seen = new Set([right]);
  const w: string[] = [];
  for (const x of wrong) {
    if (!seen.has(x)) {
      seen.add(x);
      w.push(x);
    }
  }
  return textChoice(prompt, right, sample(w, Math.min(4, w.length)), hint, visual);
}

function typed(
  prompt: string,
  answer: number | string,
  hint: string,
  o: { keypad?: InputQuestion["keypad"]; visual?: Visual; suffix?: string; accept?: string[] } = {},
): InputQuestion {
  return { kind: "input", prompt, hint, answer: String(answer), keypad: o.keypad ?? "integer", visual: o.visual, suffix: o.suffix, accept: o.accept };
}

// ---------- Polynomial text and arithmetic (coefficients run from the highest power down) ----------

const xp = (p: number): string => (p === 0 ? "" : p === 1 ? "x" : `x${sup(p)}`);
function poly(c: number[]): string {
  let out = "";
  c.forEach((k, i) => {
    const p = c.length - 1 - i;
    if (k === 0) return;
    const a = Math.abs(k);
    const body = a === 1 && p > 0 ? xp(p) : `${a}${xp(p)}`;
    out += out ? ` ${k < 0 ? MINUS : "+"} ${body}` : `${k < 0 ? MINUS : ""}${body}`;
  });
  return out || "0";
}
const pmul = (a: number[], b: number[]): number[] => {
  const r: number[] = Array(a.length + b.length - 1).fill(0);
  a.forEach((x, i) => b.forEach((y, j) => (r[i + j] += x * y)));
  return r;
};
const peval = (c: number[], x: number): number => c.reduce((s, k) => s * x + k, 0);
/** "x − 3" or "x + 3" */
const lin = (r: number): string => (r === 0 ? "x" : r > 0 ? `x ${MINUS} ${r}` : `x + ${-r}`);
/** Synthetic division by (x − r). */
function synth(c: number[], r: number): { q: number[]; rem: number } {
  const out = [c[0]];
  for (let i = 1; i < c.length; i++) out.push(c[i] + r * out[i - 1]);
  const rem = out.pop()!;
  return { q: out, rem };
}
/** A random coefficient list with the given leading coefficient. */
function randPoly(degree: number, lead: number, spread: number): number[] {
  return [lead, ...Array.from({ length: degree }, () => randInt(-spread, spread))];
}

// ---------- Plot helpers ----------

type Pt = { x: number; y: number };
function curve(f: (x: number) => number, x0: number, x1: number, dx = 0.1): Pt[] {
  const n = Math.max(2, Math.round((x1 - x0) / dx));
  return Array.from({ length: n + 1 }, (_, i) => {
    const x = x0 + (i * (x1 - x0)) / n;
    return { x: round(x), y: round(f(x)) };
  });
}
const line2 = (x0: number, y0: number, x1: number, y1: number): Pt[] => [
  { x: x0, y: y0 },
  { x: x1, y: y1 },
];

// ======================================================================
// Unit 1: Transformations of functions
// ======================================================================

type Fam = "quad" | "abs" | "sqrt";
const FAM_NAME: Record<Fam, string> = { quad: "x²", abs: "|x|", sqrt: "√x" };

function ratStr(x: number): string {
  for (let d = 1; d <= 6; d++) {
    const n = Math.round(x * d);
    if (Math.abs(x * d - n) < 1e-9) return d === 1 ? String(n) : `${n}/${d}`;
  }
  return String(x);
}
/** A coefficient written in front of something: 1 → "", −1 → "−", ½ → "(1/2)". */
function coefStr(x: number): string {
  if (x === 1) return "";
  if (x === -1) return MINUS;
  const s = ratStr(Math.abs(x));
  return `${x < 0 ? MINUS : ""}${s.includes("/") ? `(${s})` : s}`;
}
const addConst = (k: number): string => (k === 0 ? "" : k > 0 ? ` + ${k}` : ` ${MINUS} ${-k}`);

function famEq(fam: Fam, a: number, h: number, k: number): string {
  const inner = lin(h);
  const core = fam === "quad" ? (h === 0 ? "x²" : `(${inner})²`) : fam === "abs" ? `|${inner}|` : h === 0 ? "√x" : `√(${inner})`;
  return `${coefStr(a)}${core}${addConst(k)}`;
}
function famCurve(fam: Fam, a: number, h: number, k: number): Pt[] {
  if (fam === "quad") return curve((x) => a * (x - h) ** 2 + k, -6, 6, 0.1);
  if (fam === "abs") return curve((x) => a * Math.abs(x - h) + k, -6, 6, 0.1);
  return curve((x) => a * Math.sqrt(Math.max(0, x - h)) + k, h, 6, 0.05);
}

function innerStr(b: number, h: number): string {
  const cb = coefStr(b);
  if (h === 0) return `${cb}x`;
  return b === 1 ? lin(h) : `${cb}(${lin(h)})`;
}
const fnEq = (a: number, b: number, h: number, v: number): string => `${coefStr(a)}f(${innerStr(b, h)})${addConst(v)}`;

const units = (n: number): string => `${n} ${n === 1 ? "unit" : "units"}`;
function describe(a: number, b: number, h: number, v: number): string {
  const parts: string[] = [];
  if (Math.abs(a) !== 1) parts.push(`vertical stretch by a factor of ${ratStr(Math.abs(a))}`);
  if (a < 0) parts.push("reflection in the x-axis");
  if (Math.abs(b) !== 1) parts.push(`horizontal stretch by a factor of ${ratStr(1 / Math.abs(b))}`);
  if (b < 0) parts.push("reflection in the y-axis");
  const t: string[] = [];
  if (h !== 0) t.push(`${units(Math.abs(h))} ${h > 0 ? "right" : "left"}`);
  if (v !== 0) t.push(`${units(Math.abs(v))} ${v > 0 ? "up" : "down"}`);
  if (t.length) parts.push(`${parts.length ? "then " : ""}translation ${t.join(" and ")}`);
  return parts.join(", ");
}
/** Variations on a transformation that a student might get wrong. */
function mutations(a: number, b: number, h: number, v: number): [number, number, number, number][] {
  const b2 = Math.abs(b) === 1 ? -b : 1 / b;
  return [
    [a, b, -h, v],
    [a, b, h, -v],
    [-a, b, h, v],
    [a, b2, h, v],
    [a, -b, h, v],
  ];
}

function transGraphEquation(lv: Level): Question {
  const fam = pick<Fam>(["quad", "abs", "sqrt"]);
  const a = pick(lv === 1 ? [1, -1] : lv === 2 ? [1, -1, 2, -2] : [2, -2, 3, -3]);
  const h = nz(-3, 3);
  const k = nz(-3, 3);
  const right = `g(x) = ${famEq(fam, a, h, k)}`;
  const wrong = [famEq(fam, a, -h, k), famEq(fam, a, h, -k), famEq(fam, -a, h, k), famEq(fam, a, -h, -k)].map((s) => `g(x) = ${s}`);
  return mc(
    `The solid graph g is a transformation of f(x) = ${FAM_NAME[fam]} (dashed). Which equation describes g?`,
    right,
    wrong,
    "Find the starting point (vertex or corner) to get the translation. Replacing x with (x − h) moves the graph h units right. Then check whether it opens up or down and how steep it is.",
    {
      type: "plot",
      xMin: -6,
      xMax: 6,
      yMin: -6,
      yMax: 6,
      curves: [
        { points: famCurve(fam, 1, 0, 0), dashed: true, label: "f" },
        { points: famCurve(fam, a, h, k), label: "g" },
      ],
      points: lv === 1 ? [{ x: h, y: k }] : undefined,
    },
  );
}

function transDescribe(lv: Level): Question {
  const a = pick(lv === 1 ? [1, -1] : [1, -1, 2, 3, 0.5, -2]);
  const b = pick(lv === 1 ? [1] : lv === 2 ? [1, 2, 3, 0.5] : [2, 3, 0.5, -1, -2]);
  const h = nz(-4, 4);
  const v = nz(-4, 4);
  const right = describe(a, b, h, v);
  const wrong = mutations(a, b, h, v).map(([a2, b2, h2, v2]) => describe(a2, b2, h2, v2));
  return mc(
    `How is the graph of y = f(x) transformed to give y = ${fnEq(a, b, h, v)}?`,
    right,
    wrong,
    "Inside the brackets, changes act on x and do the opposite of what you might expect: f(x − 3) moves right, f(2x) squeezes horizontally by 1/2. Outside the brackets they act on y and do what they say.",
  );
}

function transFromWords(lv: Level): Question {
  const fam = pick<Fam>(["quad", "abs"]);
  const a = pick(lv === 1 ? [1, -1] : [1, -1, 2, -2, 3]);
  const h = nz(-4, 4);
  const v = nz(-4, 4);
  const right = `y = ${famEq(fam, a, h, v)}`;
  const wrong = [famEq(fam, a, -h, v), famEq(fam, a, h, -v), famEq(fam, -a, h, v), famEq(fam, a, -h, -v)].map((s) => `y = ${s}`);
  return mc(
    `The graph of y = ${FAM_NAME[fam]} is transformed by: ${describe(a, 1, h, v)}. What is the new equation?`,
    right,
    wrong,
    "Write the vertical changes outside (a and the + k) and the horizontal shift inside as (x − h). A shift right by h becomes x − h.",
  );
}

function transImage(lv: Level): Question {
  const bs: [number, number][] = lv === 1 ? [[1, 1], [2, 1], [-1, 1]] : [[2, 1], [3, 1], [-1, 1], [-2, 1], [1, 2], [1, 3], [4, 1]];
  const as: [number, number][] = lv === 1 ? [[1, 1], [-1, 1], [2, 1]] : [[2, 1], [3, 1], [-1, 1], [1, 2], [-2, 1], [-1, 2]];
  const [bn, bd] = pick(bs);
  const [an, ad] = pick(as);
  const b = bn / bd;
  const a = an / ad;
  const h = randInt(-4, 4);
  const v = randInt(-4, 4);
  const k1 = nz(-3, 3);
  const k2 = nz(-3, 3);
  const p = k1 * bn;
  const q = k2 * ad;
  const imgX = k1 * bd + h;
  const imgY = k2 * an + v;
  const askX = chance(0.5);
  const base = `The point (${num(p)}, ${num(q)}) lies on y = f(x). A new graph is y = ${fnEq(a, b, h, v)}. `;
  return askX
    ? typed(
        `${base}What is the x-coordinate of the matching point on the new graph?`,
        imgX,
        "The x-coordinate is divided by b (that is, x → x/b) and then shifted by h. Stretches come first, then translations.",
      )
    : typed(
        `${base}What is the y-coordinate of the matching point on the new graph?`,
        imgY,
        "The y-coordinate is multiplied by a and then v is added: y → a·y + v.",
      );
}

function transDomainRange(lv: Level): Question {
  const b = pick(lv === 1 ? [1, -1] : [2, -1, 0.5, -2]);
  const a = pick(lv === 1 ? [2, -1] : [-1, 2, -2, 3]);
  const h = nz(-3, 3);
  const v = nz(-4, 4);
  let xl: number, xr: number;
  do {
    xl = 2 * randInt(-3, 0);
    xr = xl + 2 * randInt(2, 4);
  } while (xl + xr === 0);
  const yl = randInt(0, 2);
  const yr = yl + randInt(3, 6);
  const dr = (aa: number, bb: number, hh: number, vv: number): string => {
    const xs = [xl / bb + hh, xr / bb + hh].sort((m, n) => m - n);
    const ys = [aa * yl + vv, aa * yr + vv].sort((m, n) => m - n);
    return `domain ${num(xs[0])} ≤ x ≤ ${num(xs[1])}, range ${num(ys[0])} ≤ y ≤ ${num(ys[1])}`;
  };
  const right = dr(a, b, h, v);
  const wrong = [dr(a, 1, h, v), dr(a, b, -h, v), dr(1, b, h, v), dr(a, b, h, -v), dr(-a, b, h, v)];
  return mc(
    `The function f has domain ${num(xl)} ≤ x ≤ ${num(xr)} and range ${yl} ≤ y ≤ ${yr}. What are the domain and range of y = ${fnEq(a, b, h, v)}?`,
    right,
    wrong,
    "Transform the end-points. x-values: divide by b, then add h. y-values: multiply by a, then add v. If a stretch or a reflection flips the order, write the smaller value first.",
  );
}

const REFLECT_SHAPES: Pt[][] = [
  [{ x: 1, y: 1 }, { x: 2, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 1 }],
  [{ x: 1, y: 3 }, { x: 3, y: 1 }, { x: 4, y: 2 }, { x: 5, y: 4 }],
  [{ x: 1, y: 1 }, { x: 3, y: 2 }, { x: 3.5, y: 4 }, { x: 5, y: 4 }],
];
function transReflect(): Question {
  const shape = pick(REFLECT_SHAPES);
  const kind = pick(["x", "y", "both"] as const);
  const sx = kind === "x" ? 1 : -1;
  const sy = kind === "y" ? 1 : -1;
  const g = shape.map((p) => ({ x: p.x * sx, y: p.y * sy }));
  const right = kind === "x" ? "g(x) = −f(x)" : kind === "y" ? "g(x) = f(−x)" : "g(x) = −f(−x)";
  return mc(
    "The solid graph g is the dashed graph f after a reflection. Which equation relates them?",
    right,
    ["g(x) = −f(x)", "g(x) = f(−x)", "g(x) = −f(−x)", "g(x) = f(x) − 4", "g(x) = 1/f(x)"].filter((s) => s !== right),
    "A negative outside the brackets flips the graph over the x-axis (y-values change sign). A negative inside flips it over the y-axis (x-values change sign). Both together flip it through the origin.",
    {
      type: "plot",
      xMin: -6,
      xMax: 6,
      yMin: -6,
      yMax: 6,
      curves: [
        { points: shape, dashed: true, label: "f" },
        { points: g, label: "g" },
      ],
    },
  );
}

function transSingle(): Question {
  const k = randInt(2, 5);
  const forms: { eq: string; right: string; wrong: string[] }[] = [
    { eq: `f(x − ${k})`, right: `translation ${units(k)} right`, wrong: [`translation ${units(k)} left`, `translation ${units(k)} up`, `translation ${units(k)} down`] },
    { eq: `f(x + ${k})`, right: `translation ${units(k)} left`, wrong: [`translation ${units(k)} right`, `translation ${units(k)} up`, `translation ${units(k)} down`] },
    { eq: `f(x) + ${k}`, right: `translation ${units(k)} up`, wrong: [`translation ${units(k)} down`, `translation ${units(k)} left`, `translation ${units(k)} right`] },
    { eq: `${k}f(x)`, right: `vertical stretch by a factor of ${k}`, wrong: [`horizontal stretch by a factor of ${k}`, `vertical stretch by a factor of 1/${k}`, `horizontal stretch by a factor of 1/${k}`] },
    { eq: `f(${k}x)`, right: `horizontal stretch by a factor of 1/${k}`, wrong: [`horizontal stretch by a factor of ${k}`, `vertical stretch by a factor of ${k}`, `vertical stretch by a factor of 1/${k}`] },
    { eq: `f(x/${k})`, right: `horizontal stretch by a factor of ${k}`, wrong: [`horizontal stretch by a factor of 1/${k}`, `vertical stretch by a factor of ${k}`, `vertical stretch by a factor of 1/${k}`] },
    { eq: "−f(x)", right: "reflection in the x-axis", wrong: ["reflection in the y-axis", "reflection in the line y = x", "translation 1 unit down"] },
    { eq: "f(−x)", right: "reflection in the y-axis", wrong: ["reflection in the x-axis", "reflection in the line y = x", "translation 1 unit left"] },
  ];
  const f = pick(forms);
  return mc(`What single transformation maps y = f(x) to y = ${f.eq}?`, f.right, f.wrong, "Inside the brackets the effect is horizontal and 'backwards'; outside the brackets it is vertical and 'as written'.");
}

function transformations(opts?: GenerateOptions): Question[] {
  return build(
    [
      transGraphEquation,
      transGraphEquation,
      transDescribe,
      transFromWords,
      transImage,
      transImage,
      [transDomainRange, 2, 3],
      transReflect,
      [transSingle, 1, 2],
    ],
    levelOf(opts),
  );
}

// ======================================================================
// Unit 2: Operations on functions and inverses
// ======================================================================

function opsEvaluate(lv: Level): Question {
  const a = nz(-4, 4);
  const b = randInt(-5, 5);
  const c = lv === 1 ? nz(-3, 3) : nz(-3, 3);
  const d = randInt(-5, 5);
  const f = [a, b];
  const g = lv === 1 ? [c, d] : [c, 0, d];
  const x = nz(-3, 3);
  const op = pick(["+", "−", "×"] as const);
  const fv = peval(f, x);
  const gv = peval(g, x);
  const ans = op === "+" ? fv + gv : op === "−" ? fv - gv : fv * gv;
  return typed(
    `Let f(x) = ${poly(f)} and g(x) = ${poly(g)}. Find (f ${op === "×" ? "·" : op} g)(${num(x)}).`,
    ans,
    `Work out f(${num(x)}) = ${num(fv)} and g(${num(x)}) = ${num(gv)} first, then ${op === "+" ? "add" : op === "−" ? "subtract" : "multiply"} them.`,
  );
}

function opsCompose(lv: Level): Question {
  const a = nz(-3, 3);
  const b = randInt(-4, 4);
  const c = nz(-2, 3);
  const d = randInt(-5, 5);
  const f = [a, b];
  const g = lv === 1 ? [c, d] : [c, 0, d];
  if (lv === 1 && a === c && b === d) return opsCompose(lv);
  const x = nz(-3, 3);
  const fog = chance(0.5);
  const inner = fog ? peval(g, x) : peval(f, x);
  const ans = fog ? peval(f, inner) : peval(g, inner);
  return typed(
    `Let f(x) = ${poly(f)} and g(x) = ${poly(g)}. Find (${fog ? "f ∘ g" : "g ∘ f"})(${num(x)}).`,
    ans,
    `${fog ? "(f ∘ g)(x) = f(g(x))" : "(g ∘ f)(x) = g(f(x))"}: work from the inside out. The inside function gives ${num(inner)} at x = ${num(x)}, so put ${num(inner)} into the outside function.`,
  );
}

function opsComposeSymbolic(lv: Level): Question {
  const a = nz(-3, 3);
  const b = nz(-4, 4);
  const c = lv === 1 ? 1 : pick([1, 1, 2, -1]);
  const d = nz(-5, 5);
  const f = [a, b];
  const g = [c, 0, d];
  const fog = chance(0.5);
  const fogC = [a * c, 0, a * d + b];
  const sq = pmul(f, f).map((k) => k * c);
  const gof = [sq[0], sq[1], sq[2] + d];
  const right = poly(fog ? fogC : gof);
  const wrong = [
    poly(fog ? gof : fogC),
    poly([c * a * a, 0, c * b * b + d]),
    poly(pmul(f, g)),
    poly([a * c, 0, a * d + b + 1]),
  ];
  return mc(
    `If f(x) = ${poly(f)} and g(x) = ${poly(g)}, which expression is (${fog ? "f ∘ g" : "g ∘ f"})(x)?`,
    right,
    wrong,
    fog
      ? "Replace every x in f with the whole expression g(x), then simplify."
      : "Replace every x in g with the whole expression f(x). Square the entire bracket, including the middle term, then simplify.",
  );
}

function opsDomainQuotient(lv: Level): Question {
  const c = randInt(2, 5);
  let p: number;
  do p = nz(-6, 6);
  while (Math.abs(p) === c);
  const single = lv === 1 || chance(0.4);
  const f = [1, p];
  const g = single ? [1, -c] : [1, 0, -c * c];
  const right = single ? `all real x except x = ${c}` : `all real x except x = ${MINUS}${c} and x = ${c}`;
  const wrong = [
    `all real x except x = ${num(-p)}`,
    single ? `all real x except x = ${MINUS}${c}` : `all real x except x = ${c}`,
    "all real numbers",
    single ? `all real x except x = ${c} and x = ${num(-p)}` : `all real x except x = ${num(-p)}, x = ${MINUS}${c} and x = ${c}`,
  ];
  return mc(
    `If f(x) = ${poly(f)} and g(x) = ${poly(g)}, what is the domain of (f/g)(x)?`,
    right,
    wrong,
    "A quotient is undefined wherever the denominator g(x) equals 0. Solve g(x) = 0 and exclude those values. Zeros of the numerator don't matter for the domain.",
  );
}

function opsInverseLinear(lv: Level): Question {
  const a = pick(lv === 1 ? [2, 3, 4] : [2, 3, 4, 5, -2, -3]);
  const b = nz(-9, 9);
  const den = (v: number) => (v < 0 ? `(${MINUS}${-v})` : String(v));
  const top = (bb: number) => (bb >= 0 ? `x ${MINUS} ${bb}` : `x + ${-bb}`);
  const topWrong = (bb: number) => (bb >= 0 ? `x + ${bb}` : `x ${MINUS} ${-bb}`);
  const right = `(${top(b)})/${den(a)}`;
  const wrong = [
    `(${topWrong(b)})/${den(a)}`,
    `${den(a)}(${top(b)})`,
    `x/${den(a)} ${b >= 0 ? MINUS : "+"} ${Math.abs(b)}`,
    `(${top(b)})/${den(-a)}`,
    `${den(a)}x ${b >= 0 ? MINUS : "+"} ${Math.abs(b)}`,
  ];
  return mc(
    `What is the inverse of f(x) = ${poly([a, b])}?`,
    `f⁻¹(x) = ${right}`,
    wrong.map((w) => `f⁻¹(x) = ${w}`),
    "Swap x and y, then solve for y. Undo the addition or subtraction first, then divide by the coefficient of x.",
  );
}

function opsInverseValue(lv: Level): Question {
  const a = pick(lv === 1 ? [2, 3, 4] : [2, 3, 4, 5, -2, -3]);
  const b = nz(-9, 9);
  const t = randInt(-6, 8);
  const y = a * t + b;
  return typed(
    `Let f(x) = ${poly([a, b])}. Find f⁻¹(${num(y)}).`,
    t,
    `f⁻¹(${num(y)}) asks: which input gives ${num(y)}? Solve ${poly([a, b])} = ${num(y)}.`,
  );
}

function opsInversePoint(): Question {
  const p = nz(-6, 6);
  const q = nz(-6, 6);
  const pt = (x: number, y: number) => `(${num(x)}, ${num(y)})`;
  return mc(
    `The point ${pt(p, q)} is on the graph of y = f(x), and f has an inverse. Which point must be on y = f⁻¹(x)?`,
    pt(q, p),
    [pt(p, q), pt(-p, -q), pt(-q, p), pt(q, -p), pt(-q, -p)].filter((s) => s !== pt(q, p)),
    "An inverse swaps inputs and outputs, so (a, b) on f becomes (b, a) on f⁻¹: the graph is reflected in the line y = x.",
  );
}

function opsHorizontalLine(): Question {
  const kind = pick(["quad", "cube", "abs", "exp", "quartic"] as const);
  let pts: Pt[];
  let has: boolean;
  const h = randInt(-1, 1);
  const k = randInt(-1, 1);
  if (kind === "quad") {
    pts = curve((x) => (x - h) ** 2 + k, -6, 6);
    has = false;
  } else if (kind === "cube") {
    pts = curve((x) => (x - h) ** 3 / 3 + k + (x - h), -6, 6);
    has = true;
  } else if (kind === "abs") {
    pts = curve((x) => Math.abs(x - h) + k, -6, 6);
    has = false;
  } else if (kind === "exp") {
    pts = curve((x) => 2 ** (x + h) - 1, -6, 6);
    has = true;
  } else {
    pts = curve((x) => ((x - h) ** 4) / 8 - (x - h) ** 2 / 2 + k, -6, 6);
    has = false;
  }
  const yes = "Yes: every horizontal line crosses the graph at most once";
  const no = "No: some horizontal lines cross the graph twice or more";
  return mc(
    "Does the inverse of this function exist as a function?",
    has ? yes : no,
    has ? [no, "No: the graph fails the vertical line test"] : [yes, "Yes: the graph passes the vertical line test"],
    "An inverse is a function only if the original passes the horizontal line test: no output may repeat for two different inputs.",
    { type: "plot", xMin: -6, xMax: 6, yMin: -6, yMax: 6, curves: [{ points: pts }] },
  );
}

function opsInverseQuadratic(): Question {
  const h = nz(-4, 4);
  const k = randInt(-4, 4);
  const sh = (hh: number) => (hh >= 0 ? `x ${MINUS} ${hh}` : `x + ${-hh}`);
  const sq = `(${sh(h)})²${addConst(k)}`;
  const inv = (hh: number, kk: number, s: "+" | "−") => `f⁻¹(x) = ${num(hh)} ${s} √(${sh(kk)})`.replace(/ \+ -/, " − ");
  const right = inv(h, k, "+");
  return mc(
    `For f(x) = ${sq} with x ≥ ${num(h)}, what is f⁻¹(x)?`,
    right,
    [inv(h, k, "−"), inv(-h, k, "+"), inv(h, -k, "+"), inv(k, h, "+")].filter((s) => s !== right),
    "Swap x and y, isolate the squared bracket, take the square root, then add h. Because the original domain is x ≥ h, only the positive root is used.",
  );
}

function opsPriceCompose(lv: Level): Question {
  const cut = pick([10, 20, 25, 50]);
  const coupon = pick([5, 10]);
  const m = randInt(2, lv === 1 ? 5 : 9);
  const couponFirst = chance(0.5);
  const price = 20 * m + (couponFirst ? coupon : 0);
  const base = couponFirst ? price - coupon : price;
  const afterPct = (base * (100 - cut)) / 100;
  const ans = couponFirst ? afterPct : afterPct - coupon;
  return typed(
    `A jacket costs $${price}. A $${coupon} coupon and a ${cut}% sale discount both apply, with the ${couponFirst ? "coupon" : "percentage discount"} taken first. What is the final price, in dollars?`,
    ans,
    couponFirst
      ? `Take $${coupon} off first, then take ${cut}% off the result. This is a composition: the order matters.`
      : `Take ${cut}% off first, then subtract the $${coupon}. This is a composition: the order matters.`,
    { keypad: "number", suffix: "dollars" },
  );
}

function operations(opts?: GenerateOptions): Question[] {
  return build(
    [
      opsEvaluate,
      opsEvaluate,
      opsCompose,
      opsCompose,
      opsComposeSymbolic,
      opsDomainQuotient,
      opsInverseLinear,
      opsInverseValue,
      opsInversePoint,
      [opsHorizontalLine, 1, 3],
      [opsInverseQuadratic, 3, 3],
      opsPriceCompose,
    ],
    levelOf(opts),
  );
}

// ======================================================================
// Unit 3: Polynomial functions
// ======================================================================

type Root = [number, number]; // [zero, multiplicity]
function facProd(a: number, roots: Root[]): string {
  const sorted = [...roots].sort((p, q) => p[0] - q[0]);
  const body = sorted
    .map(([r, m]) => {
      if (r === 0) return m === 1 ? "x" : `x${sup(m)}`;
      return `(${lin(r)})${m === 1 ? "" : sup(m)}`;
    })
    .join("");
  const lead = a === 1 ? "" : a === -1 ? MINUS : String(a);
  return `${lead}${body}`;
}

function polyEnd(lv: Level): Question {
  const degree = pick(lv === 1 ? [3, 4] : [3, 4, 5, 6]);
  const lead = pick(lv === 1 ? [1, -1, 2, -2] : [1, -1, 2, -2, 3, -3]);
  const c = randPoly(degree, lead, 5);
  const up = lead > 0;
  const even = degree % 2 === 0;
  const QUAD = {
    upup: "from quadrant II to quadrant I",
    downdown: "from quadrant III to quadrant IV",
    odd_up: "from quadrant III to quadrant I",
    odd_down: "from quadrant II to quadrant IV",
  };
  const right = even ? (up ? QUAD.upup : QUAD.downdown) : up ? QUAD.odd_up : QUAD.odd_down;
  return mc(
    `What is the end behaviour of y = ${poly(c)}? The graph extends…`,
    right,
    Object.values(QUAD),
    "Look only at the term with the highest power. Even degree: both ends point the same way. Odd degree: the ends point opposite ways. A positive leading coefficient means the right end rises.",
  );
}

function polyMultiplicity(lv: Level): Question {
  const rootsPool = shuffle([-4, -3, -2, -1, 0, 1, 2, 3, 4]).slice(0, lv === 1 ? 2 : 3);
  const mults = rootsPool.map(() => pick(lv === 1 ? [1, 2] : [1, 2, 3]));
  if (!mults.some((m) => m >= 2)) mults[0] = 2;
  const roots: Root[] = rootsPool.map((r, i) => [r, mults[i]]);
  const a = pick([1, -1, 2]);
  const target = pick(roots);
  const right =
    target[1] === 1 ? "crosses the x-axis" : target[1] === 2 ? "touches the x-axis and turns around" : "flattens out as it crosses the x-axis";
  return mc(
    `The graph of y = ${facProd(a, roots)} meets the x-axis at x = ${target[0]}. At that point it…`,
    right,
    ["crosses the x-axis", "touches the x-axis and turns around", "flattens out as it crosses the x-axis", "has a vertical asymptote"].filter((s) => s !== right),
    "Look at the exponent on that factor. Multiplicity 1: crosses straight through. Even multiplicity: touches and turns. Odd multiplicity of 3 or more: flattens as it crosses.",
  );
}

function polyGraph(lv: Level): Question {
  const a = pick([1, -1]);
  let roots: Root[];
  if (lv === 3 || chance(0.35)) {
    const [r1, r2] = shuffle([-3, -2, -1, 0, 1, 2, 3]).slice(0, 2);
    roots = [[r1, 2], [r2, 1]];
  } else {
    roots = shuffle([-3, -2, -1, 0, 1, 2, 3]).slice(0, 3).map((r): Root => [r, 1]);
  }
  const f = (x: number) => a * roots.reduce((p, [r, m]) => p * (x - r) ** m, 1);
  const right = `y = ${facProd(a, roots)}`;
  const negRoots = roots.map(([r, m]): Root => [-r, m]);
  const swapped: Root[] = roots.length === 2 ? [[roots[0][0], 1], [roots[1][0], 2]] : [[roots[0][0], 2], [roots[1][0], 1], [roots[2][0], 1]];
  const wrong = [facProd(-a, roots), facProd(a, negRoots), facProd(-a, negRoots), facProd(a, swapped)].map((s) => `y = ${s}`);
  return mc(
    "Which equation could match this graph?",
    right,
    wrong,
    "Read the x-intercepts: a zero at x = r gives the factor (x − r). A graph that touches and turns has a squared factor. Then check the ends: rising on the right means a positive leading coefficient for odd degree.",
    {
      type: "plot",
      xMin: -5,
      xMax: 5,
      yMin: -10,
      yMax: 10,
      curves: [{ points: curve(f, -5, 5, 0.1) }],
      points: lv === 1 ? roots.map(([r]) => ({ x: r, y: 0 })) : undefined,
    },
  );
}

function polyRemainder(lv: Level): Question {
  const degree = pick(lv === 1 ? [2, 3] : [3, 4]);
  const c = randPoly(degree, pick([1, 1, 2, -1]), 4);
  const r = nz(-3, 3);
  const divisor = `x ${r > 0 ? MINUS : "+"} ${Math.abs(r)}`;
  return typed(
    `What is the remainder when P(x) = ${poly(c)} is divided by (${divisor})?`,
    peval(c, r),
    `By the remainder theorem, the remainder is P(${num(r)}). Substitute ${num(r)} for x. (The divisor x ${r > 0 ? MINUS : "+"} ${Math.abs(r)} = 0 gives x = ${num(r)}.)`,
  );
}

function polyFactorK(lv: Level): Question {
  const r = nz(-3, 3);
  const k = nz(-4, 4);
  const m = randInt(-5, 5);
  const lead = lv === 1 ? 1 : pick([1, 2]);
  // P(x) = lead·x³ + k·x² + m·x + n with n chosen so that P(r) = 0
  const n = -(lead * r ** 3 + k * r * r + m * r);
  const text = `${lead === 1 ? "" : lead}x³ + kx²${m === 0 ? "" : ` ${m < 0 ? MINUS : "+"} ${Math.abs(m) === 1 ? "" : Math.abs(m)}x`}${addConst(n)}`;
  return typed(
    `Find k so that (${lin(r)}) is a factor of P(x) = ${text}.`,
    k,
    `By the factor theorem, P(${num(r)}) must equal 0. Substitute x = ${num(r)} into P(x), set it equal to 0, and solve for k.`,
  );
}

function polyFactorYesNo(lv: Level): Question {
  const r = nz(-3, 3);
  const q = [1, randInt(-3, 3), randInt(-4, 4)];
  if (lv >= 2) q[0] = pick([1, 2]);
  const isFactor = chance(0.5);
  const base = pmul([1, -r], q);
  const extra = isFactor ? 0 : nz(-4, 4);
  const c = [...base];
  c[c.length - 1] += extra;
  const val = peval(c, r);
  return mc(
    `Is (${lin(r)}) a factor of P(x) = ${poly(c)}?`,
    isFactor ? `Yes, because P(${num(r)}) = 0` : `No, because P(${num(r)}) = ${num(val)}`,
    [
      isFactor ? `No, because P(${num(r)}) = ${num(c[c.length - 1])}` : `Yes, because P(${num(r)}) = 0`,
      `No, because P(0) = ${num(c[c.length - 1])}`,
      isFactor ? `No, because P(${num(-r)}) = ${num(peval(c, -r))}` : `Yes, because P(${num(-r)}) = ${num(peval(c, -r))}`,
    ],
    "Use the factor theorem: (x − r) is a factor exactly when P(r) = 0. Substitute x = r (not −r) and see whether you get 0.",
  );
}

function polyDivide(lv: Level): Question {
  const r = nz(-4, 4);
  const q = [lv === 1 ? 1 : pick([1, 2, -1]), randInt(-4, 4), nz(-6, 6)];
  const rem = chance(0.5) ? 0 : nz(-5, 5);
  const p = pmul([1, -r], q);
  p[p.length - 1] += rem;
  const { q: quo, rem: rr } = synth(p, r);
  const wrongSynth = synth(p, -r).q;
  const bump = (i: number) => quo.map((k, j) => (j === i ? k + (chance(0.5) ? 1 : -1) * 1 : k));
  const right = poly(quo) + (rr === 0 ? "" : `, remainder ${num(rr)}`);
  const wrongs = [poly(wrongSynth) + (rr === 0 ? "" : `, remainder ${num(rr)}`), poly(bump(1)) + (rr === 0 ? "" : `, remainder ${num(rr)}`), poly(bump(2)) + (rr === 0 ? "" : `, remainder ${num(rr)}`), poly([...quo.slice(1), quo[0]]) + (rr === 0 ? "" : `, remainder ${num(rr)}`)];
  if (rr !== 0) wrongs.push(poly(quo) + `, remainder ${num(-rr)}`);
  else wrongs.push(poly(quo) + `, remainder ${r}`);
  return mc(
    `Divide P(x) = ${poly(p)} by (${lin(r)}). What is the quotient${rr === 0 ? "" : " and remainder"}?`,
    right,
    wrongs,
    `Use synthetic division with ${num(r)} (the zero of the divisor). Bring down the first coefficient, multiply by ${num(r)}, add to the next coefficient, and repeat.`,
  );
}

function polyRationalZeros(): Question {
  const lead = pick([2, 3, 4, 6]);
  const cst = pick([6, 8, 9, 10, 12, 15]) * pick([1, -1]);
  const divs = (n: number) => Array.from({ length: Math.abs(n) }, (_, i) => i + 1).filter((d) => Math.abs(n) % d === 0);
  const valid = (fn: number, fd: number) => Math.abs(cst) % fn === 0 && lead % fd === 0;
  const candidates: [number, number][] = [];
  for (const p of divs(cst)) for (const q of divs(lead)) if (gcd(p, q) === 1) candidates.push([p, q]);
  const bad: [number, number][] = [];
  for (let p = 1; p <= 12; p++) for (let q = 1; q <= 8; q++) if (gcd(p, q) === 1 && !valid(p, q)) bad.push([p, q]);
  const sign = () => (chance(0.5) ? "" : MINUS);
  const show = ([p, q]: [number, number], s: string) => `${s}${q === 1 ? p : `${p}/${q}`}`;
  const [bp, bq] = pick(bad);
  const goods = sample(candidates, 4).map((c) => show(c, sign()));
  const cstText = `${num(cst)}`;
  const poly3 = `${lead}x³ + 3x² ${MINUS} 5x ${cst < 0 ? MINUS : "+"} ${Math.abs(cst)}`;
  void cstText;
  return mc(
    `Using the rational zero theorem, which of these is NOT a possible rational zero of P(x) = ${poly3}?`,
    show([bp, bq], sign()),
    goods,
    `A rational zero p/q (in lowest terms) needs p to divide the constant term ${Math.abs(cst)} and q to divide the leading coefficient ${lead}. Test each choice; one fails.`,
  );
}

function polyFacts(lv: Level): Question {
  const n = randInt(3, lv === 1 ? 6 : 9);
  const kind = pick(["turn", "zeros", "min", "intercept", "degree"] as const);
  if (kind === "turn") {
    return typed(`What is the greatest number of turning points a polynomial function of degree ${n} can have?`, n - 1, "A polynomial of degree n has at most n − 1 turning points.", { keypad: "number" });
  }
  if (kind === "zeros") {
    return typed(`What is the greatest number of real zeros a polynomial function of degree ${n} can have?`, n, "A polynomial of degree n has at most n real zeros.", { keypad: "number" });
  }
  if (kind === "min") {
    const odd = chance(0.5);
    const d = odd ? pick([3, 5, 7]) : pick([4, 6, 8]);
    return typed(
      `What is the least number of real zeros a polynomial function of degree ${d} must have?`,
      odd ? 1 : 0,
      "Odd-degree polynomials have ends that point in opposite directions, so they must cross the x-axis at least once. Even-degree polynomials can stay entirely above or below it.",
      { keypad: "number" },
    );
  }
  if (kind === "intercept") {
    const a = pick([1, -1, 2, -2, 3]);
    const roots = shuffle([-3, -2, -1, 1, 2, 3, 4]).slice(0, 3);
    const prod = roots.reduce((p, r) => p * (0 - r), a);
    return typed(
      `What is the y-intercept of y = ${facProd(a, roots.map((r): Root => [r, 1]))}?`,
      prod,
      "The y-intercept is the value at x = 0. Substitute 0 into every bracket and multiply.",
    );
  }
  const roots: Root[] = shuffle([-3, -2, -1, 1, 2, 3]).slice(0, 3).map((r): Root => [r, pick([1, 2, 3])]);
  const deg = roots.reduce((s, r) => s + r[1], 0);
  const desc = roots.map(([r, m]) => `x = ${num(r)} (multiplicity ${m})`).join(", ");
  return typed(
    `A polynomial function has zeros at ${desc} and no others. What is the least possible degree?`,
    deg,
    "The degree is at least the sum of the multiplicities of all the zeros.",
    { keypad: "number" },
  );
}

function polynomials(opts?: GenerateOptions): Question[] {
  return build(
    [polyEnd, polyMultiplicity, polyGraph, polyGraph, polyRemainder, polyFactorK, polyFactorYesNo, polyDivide, polyDivide, [polyRationalZeros, 2, 3], polyFacts, polyFacts],
    levelOf(opts),
  );
}

// ======================================================================
// Unit 4: Radical and rational functions
// ======================================================================

const ineq = (op: "≥" | "≤", n: number) => `x ${op} ${num(n)}`;

function radDomain(lv: Level): Question {
  const a = pick(lv === 1 ? [1, 2, 3] : [1, 2, 3, -1, -2, -3]);
  const r = nz(-5, 5);
  const bConst = -a * r;
  const op = a > 0 ? "≥" : "≤";
  const flip = op === "≥" ? "≤" : "≥";
  const right = ineq(op, r);
  return mc(
    `What is the domain of f(x) = √(${poly([a, bConst])})?`,
    right,
    [ineq(flip, r), ineq(op, -r), ineq(flip, -r), ineq(op, bConst), ineq(op, a * r)].filter((s) => s !== right),
    "The expression under the square root must be 0 or greater. Solve " + `${poly([a, bConst])} ≥ 0` + " — and remember to reverse the inequality sign if you divide by a negative number.",
  );
}

function radGraph(lv: Level, showEquation: boolean): Question {
  const a = pick(lv === 1 ? [1, -1] : [1, -1, 2, -2]);
  const b = pick([1, -1]);
  const h = randInt(-3, 3);
  const k = randInt(-3, 3);
  const f = (x: number) => a * Math.sqrt(Math.max(0, b * (x - h))) + k;
  const pts = b === 1 ? curve(f, h, 6, 0.05) : curve(f, -6, h, 0.05);
  const eqInner = b === 1 ? (h === 0 ? "x" : lin(h)) : h === 0 ? "−x" : `${num(h)} ${MINUS} x`;
  const eq = `y = ${coefStr(a)}√${b === 1 && h === 0 ? "x" : `(${eqInner})`}${addConst(k)}`;
  const dom = b === 1 ? ineq("≥", h) : ineq("≤", h);
  const rng = a > 0 ? `y ≥ ${num(k)}` : `y ≤ ${num(k)}`;
  const flipD = b === 1 ? ineq("≤", h) : ineq("≥", h);
  const flipR = a > 0 ? `y ≤ ${num(k)}` : `y ≥ ${num(k)}`;
  const right = `domain ${dom}, range ${rng}`;
  const wrong = [
    `domain ${flipD}, range ${rng}`,
    `domain ${dom}, range ${flipR}`,
    `domain ${flipD}, range ${flipR}`,
    `domain ${b === 1 ? "x" : "x"} ${b === 1 ? "≥" : "≤"} ${num(k)}, range y ${a > 0 ? "≥" : "≤"} ${num(h)}`,
  ];
  const visual: Visual = {
    type: "plot",
    xMin: -6,
    xMax: 6,
    yMin: -6,
    yMax: 6,
    curves: [{ points: pts }],
    points: showEquation && lv > 1 ? undefined : [{ x: h, y: k }],
  };
  return mc(
    showEquation ? `Give the domain and range of ${eq}.` : "Give the domain and range of the function graphed.",
    right,
    wrong,
    "The domain is the set of x-values the graph covers; the range is the set of y-values. The graph starts at its end-point and extends in one direction only.",
    visual,
  );
}

function radSolve(lv: Level): Question {
  if (lv === 1 || chance(0.4)) {
    const a = nz(-6, 6);
    const b = randInt(2, 6);
    const x = b * b - a;
    return typed(
      `Solve √(x ${a < 0 ? MINUS : "+"} ${Math.abs(a)}) = ${b}.`,
      x,
      "Square both sides to remove the square root, then solve. Check your answer in the original equation.",
    );
  }
  const q = randInt(1, 4);
  const x1 = randInt(q + 2, q + 5);
  const x2 = 2 * q + 1 - x1;
  const p = q * q - x1 * x2;
  if (p === 0) return radSolve(lv);
  const eq = `√(x ${p < 0 ? MINUS : "+"} ${Math.abs(p)}) = x ${MINUS} ${q}`;
  return typed(
    `Solve ${eq}. One apparent solution is extraneous, so enter the valid one.`,
    x1,
    "Square both sides and solve the resulting quadratic. Then substitute each solution into the original equation: a square root can't equal a negative number, so one answer fails.",
  );
}

function radExtraneous(): Question {
  const q = randInt(1, 4);
  const x1 = randInt(q + 2, q + 5);
  const x2 = 2 * q + 1 - x1;
  const p = q * q - x1 * x2;
  if (p === 0) return radExtraneous();
  const eq = `√(x ${p < 0 ? MINUS : "+"} ${Math.abs(p)}) = x ${MINUS} ${q}`;
  return mc(
    `Solving ${eq} by squaring gives x = ${num(x2)} or x = ${num(x1)}. Which solution(s) actually work?`,
    `x = ${x1} only`,
    [`x = ${num(x2)} only`, `both x = ${num(x2)} and x = ${x1}`, "neither: there is no solution"],
    `Check each value in the original equation. Right side x − ${q} must be 0 or greater, since it equals a square root.`,
  );
}

function ratAsymptotesDegree(): Question {
  const n = randInt(1, 3);
  const d = randInt(1, 3);
  const a = pick([1, 2, 3, 4, 6, -2, -3]);
  const c = pick([1, 2, 3, 5]);
  const num_ = randPoly(n, a, 3);
  const den = randPoly(d, c, 3);
  if (den.every((k, i) => i === 0 || k === 0)) den[den.length - 1] = 1;
  const g = gcd(a, c);
  const ratio = `y = ${frac(a, c)}`;
  const right = n < d ? "y = 0" : n === d ? ratio : "no horizontal asymptote";
  const wrong = ["y = 0", ratio, `y = ${num(a)}`, `y = ${c}`, `y = ${frac(c, a)}`, "no horizontal asymptote", "y = 1"];
  void g;
  return mc(
    `What is the horizontal asymptote of f(x) = (${poly(num_)})/(${poly(den)})?`,
    right,
    wrong,
    "Compare the degrees of the top and bottom. Top lower: y = 0. Same degree: y = (leading coefficient of top)/(leading coefficient of bottom). Top higher: no horizontal asymptote.",
  );
}

function ratBranches(a: number, h: number, k: number, dx = 0.05): Pt[][] {
  const f = (x: number) => a / (x - h) + k;
  return [curve(f, -6, h - 0.05, dx), curve(f, h + 0.05, 6, dx)];
}

function ratAsymptotesGraph(lv: Level): Question {
  const a = pick([1, -1, 2, -2]);
  const h = nz(-3, 3);
  let k = nz(-3, 3);
  while (k === h) k = nz(-3, 3);
  const [l, r] = ratBranches(a, h, k);
  const ask = (hh: number, kk: number) => `vertical asymptote x = ${num(hh)}, horizontal asymptote y = ${num(kk)}`;
  void lv;
  return mc(
    "What are the asymptotes of this function?",
    ask(h, k),
    [ask(k, h), ask(-h, k), ask(h, -k), ask(-h, -k)],
    "A vertical asymptote is a vertical line the graph approaches but never touches; a horizontal asymptote is the level the graph flattens toward on the far left and right.",
    { type: "plot", xMin: -6, xMax: 6, yMin: -6, yMax: 6, curves: [{ points: l }, { points: r }] },
  );
}

function ratEquation(lv: Level): Question {
  const a = pick(lv === 1 ? [1, -1] : [1, -1, 2, -2]);
  const h = randInt(-3, 3);
  const k = randInt(-3, 3);
  const [l, r] = ratBranches(a, h, k);
  const mk = (aa: number, hh: number, kk: number) => `y = ${num(aa)}/${hh === 0 ? "x" : `(${lin(hh)})`}${addConst(kk)}`;
  const ptx = h + 1;
  return mc(
    "Which equation matches this graph? (The dashed lines are its asymptotes.)",
    mk(a, h, k),
    [mk(-a, h, k), mk(a, -h, k), mk(a, h, -k), mk(a, -h, -k)],
    "The vertical asymptote x = h comes from the denominator factor (x − h). The horizontal asymptote y = k is the number added at the end. The sign and size of a decide which corners the branches sit in; test the labelled point.",
    {
      type: "plot",
      xMin: -6,
      xMax: 6,
      yMin: -6,
      yMax: 6,
      curves: [{ points: l }, { points: r }, { points: line2(h, -6, h, 6), dashed: true }, { points: line2(-6, k, 6, k), dashed: true }],
      points: [{ x: ptx, y: a + k, label: `(${num(ptx)}, ${num(a + k)})` }],
    },
  );
}

function ratHole(): Question {
  const p = nz(-4, 4);
  let s: number;
  do s = nz(-4, 4);
  while (s === p);
  let q: number;
  do q = nz(-4, 4);
  while (q === -p || -q === s || q === p * -1);
  const top = pmul([1, -p], [1, q]);
  const bottom = pmul([1, -p], [1, -s]);
  return mc(
    `Where does f(x) = (${poly(top)})/(${poly(bottom)}) have a hole and where does it have a vertical asymptote?`,
    `hole at x = ${num(p)}; vertical asymptote at x = ${num(s)}`,
    [
      `vertical asymptotes at x = ${num(p)} and x = ${num(s)}`,
      `hole at x = ${num(s)}; vertical asymptote at x = ${num(p)}`,
      `holes at x = ${num(p)} and x = ${num(s)}`,
      `hole at x = ${num(-q)}; vertical asymptote at x = ${num(s)}`,
    ],
    `Factor both parts: (${lin(p)})(${lin(-q)}) over (${lin(p)})(${lin(s)}). A factor that cancels (x = ${num(p)}) leaves a hole; a factor left in the denominator (x = ${num(s)}) gives an asymptote.`,
  );
}

function ratSolve(lv: Level): Question {
  if (lv === 1) {
    const t = nz(-5, 6);
    const B = randInt(2, 5);
    const p = nz(-5, 5);
    const A = B * t;
    const x = t - p;
    return typed(
      `Solve ${num(A)}/(${lin(-p)}) = ${B}.`,
      x,
      "Multiply both sides by the denominator, then divide by the number on the right. Finally solve for x.",
    );
  }
  if (lv === 2) {
    const u = randInt(2, 4);
    const C = randInt(1, 3);
    const B = C + u;
    const t = nz(-4, 4);
    const A = u * t;
    const p = nz(-4, 4);
    const x = t + p;
    return typed(
      `Solve ${num(A)}/(${lin(p)}) + ${C} = ${B}.`,
      x,
      "Subtract the constant first, so the fraction is alone. Then multiply both sides by (x − p) and solve.",
    );
  }
  let r: number;
  let s: number;
  do {
    r = nz(-5, 5);
    s = nz(-5, 5);
  } while (r === s);
  const a = r * s;
  const b = r + s;
  return typed(
    `Solve x ${a < 0 ? MINUS : "+"} ${Math.abs(a)}/x = ${num(b)}. Enter the smaller solution.`,
    Math.min(r, s),
    "Multiply every term by x to clear the fraction, rearrange into a quadratic equal to 0, and factor. Remember that x can't be 0.",
  );
}

function ratSimplify(): Question {
  const a = nz(-5, 5);
  let b: number;
  do b = nz(-5, 5);
  while (b === a || a + b === 0);
  const topPoly = pmul([1, a], [1, b]);
  const right = `${lin(-b)}, x ≠ ${num(-a)}`;
  return mc(
    `Simplify (${poly(topPoly)})/(${lin(-a)}) and state the non-permissible value.`,
    right,
    [
      `${lin(-a)}, x ≠ ${num(-a)}`,
      `${lin(-b)}, x ≠ ${num(-b)}`,
      `${lin(-b)} (no restrictions)`,
      `${lin(a * b > 0 ? -a * b : -a * b)}, x ≠ ${num(-a)}`,
    ],
    `Factor the top into (${lin(-a)})(${lin(-b)}), cancel the common factor, and note that the original denominator can't be 0.`,
  );
}

function radicalRational(opts?: GenerateOptions): Question[] {
  return build(
    [
      radDomain,
      (lv) => radGraph(lv, true),
      (lv) => radGraph(lv, false),
      radSolve,
      [radExtraneous, 2, 3],
      ratAsymptotesDegree,
      ratAsymptotesGraph,
      ratEquation,
      [ratHole, 2, 3],
      ratSolve,
      [ratSimplify, 2, 3],
    ],
    levelOf(opts),
  );
}

// ======================================================================
// Unit 5: Exponential functions and growth/decay
// ======================================================================

function expModel(): Question {
  const growth = chance(0.5);
  const n0 = pick([20, 50, 100, 200, 500]);
  if (growth) {
    const g = pick([2, 3, 4]);
    const p = pick([2, 3, 4, 5, 6, 8]);
    const word = g === 2 ? "doubles" : g === 3 ? "triples" : "quadruples";
    const right = `N(t) = ${n0} × ${g}^(t/${p})`;
    return mc(
      `A culture starts with ${n0} cells and ${word} every ${p} hours. Which model gives the number of cells after t hours?`,
      right,
      [`N(t) = ${n0} × ${g}^(${p}t)`, `N(t) = ${n0} × ${p}^(t/${g})`, `N(t) = ${n0} × (1/${g})^(t/${p})`, `N(t) = ${n0} × ${g}^t/${p}`],
      "Use N = (initial amount) × (growth factor)^(t ÷ period). The exponent counts how many full periods have passed.",
    );
  }
  const h = pick([3, 4, 5, 6, 8, 10, 12]);
  const right = `A(t) = ${n0} × (1/2)^(t/${h})`;
  return mc(
    `A ${n0} mg sample of a substance has a half-life of ${h} days. Which model gives the amount left after t days?`,
    right,
    [`A(t) = ${n0} × 2^(t/${h})`, `A(t) = ${n0} × (1/2)^(${h}t)`, `A(t) = ${n0} × (1/${h})^(t/2)`, `A(t) = ${n0} × (1/2)^t/${h}`],
    "Each half-life multiplies the amount by 1/2. After t days, there have been t ÷ half-life of them.",
  );
}

function expGrowthValue(lv: Level): Question {
  const g = pick(lv === 1 ? [2, 3] : [2, 3, 4, 5]);
  const p = pick([2, 3, 4, 5, 6]);
  const periods = randInt(2, lv === 3 ? 6 : 4);
  const n0 = pick([5, 10, 12, 20, 25, 40]);
  const t = p * periods;
  return typed(
    `A population of ${n0} bacteria multiplies by ${g} every ${p} hours. How many are there after ${t} hours?`,
    n0 * g ** periods,
    `${t} hours is ${periods} periods of ${p} hours. Multiply the starting number by ${g}, ${periods} times: ${n0} × ${g}^${periods}.`,
    { keypad: "number" },
  );
}

function expHalfLife(lv: Level): Question {
  const h = pick([2, 3, 4, 5, 8, 12]);
  const n = randInt(2, lv === 3 ? 6 : 4);
  const a0 = randInt(1, lv === 1 ? 5 : 9) * 2 ** n * pick([5, 10]);
  if (chance(0.5)) {
    return typed(
      `A ${a0} mg sample has a half-life of ${h} days. How many milligrams remain after ${h * n} days?`,
      a0 / 2 ** n,
      `${h * n} days is ${n} half-lives, so halve the amount ${n} times: ${a0} × (1/2)^${n}.`,
      { keypad: "number", suffix: "mg" },
    );
  }
  return typed(
    `A substance has a half-life of ${h} days. How many days until only 1/${2 ** n} of the original amount remains?`,
    h * n,
    `1/${2 ** n} = (1/2)^${n}, so ${n} half-lives are needed. Multiply by the half-life length of ${h} days.`,
    { keypad: "number", suffix: "days" },
  );
}

function expCompound(lv: Level): Question {
  const principal = pick([500, 1000, 1500, 2000, 2500, 5000]);
  const rate = pick([2, 3, 4, 5, 6]);
  const years = randInt(2, lv === 1 ? 5 : 10);
  const periods = lv === 1 ? 1 : pick([1, 2, 4, 12]);
  const label = periods === 1 ? "annually" : periods === 2 ? "semi-annually" : periods === 4 ? "quarterly" : "monthly";
  const value = principal * (1 + rate / 100 / periods) ** (periods * years);
  const frac_ = value - Math.floor(value);
  if (Math.abs(frac_ - 0.5) < 0.08) return expCompound(lv);
  return typed(
    `$${principal} is invested at ${rate}% per year, compounded ${label}, for ${years} years. What is it worth, to the nearest dollar?`,
    Math.round(value),
    `Use A = P(1 + r/n)^(nt) with P = ${principal}, r = ${rate / 100}, n = ${periods} and t = ${years}. Round only at the very end.`,
    { keypad: "number", suffix: "dollars" },
  );
}

function expCompoundModel(): Question {
  const principal = pick([1000, 2000, 3000, 5000]);
  const rate = pick([3, 4, 6, 8]);
  const n = pick([2, 4, 12]);
  const t = randInt(3, 8);
  const r = rate / 100;
  const name = n === 2 ? "semi-annually" : n === 4 ? "quarterly" : "monthly";
  const right = `A = ${principal}(1 + ${r}/${n})^(${n} × ${t})`;
  return mc(
    `$${principal} is invested at ${rate}% per year compounded ${name}. Which expression gives its value after ${t} years?`,
    right,
    [
      `A = ${principal}(1 + ${r})^(${n} × ${t})`,
      `A = ${principal}(1 + ${r}/${n})^${t}`,
      `A = ${principal}(1 + ${r} × ${n})^${t}`,
      `A = ${principal}(${r}/${n})^(${n} × ${t})`,
    ],
    "Each period earns r/n interest, and there are n × t periods. So the growth factor is (1 + r/n) and the exponent is n × t.",
  );
}

/** a × b^x, written the way a textbook would. */
const expTerm = (a: number, b: string): string => (a === 1 ? `${b}^x` : a === -1 ? `${MINUS}${b}^x` : `${num(a)} × ${b}^x`);

function expGraphBase(lv: Level): Question {
  const a = pick(lv === 1 ? [1] : [1, 2, 3]);
  const b = pick([2, 3, 1 / 2]);
  const f = (x: number) => a * b ** x;
  const bText = b === 0.5 ? "(1/2)" : String(b);
  const mk = (aa: number, bb: string) => `y = ${expTerm(aa, bb)}`;
  const right = mk(a, bText);
  const options = ["2", "3", "(1/2)", "4"];
  const wrong = options.filter((o) => o !== bText).map((o) => mk(a, o));
  const yMax = Math.min(12, Math.max(6, Math.ceil(f(2)) + 1));
  return mc(
    "Which equation matches this exponential graph?",
    right,
    [...wrong, a === 1 ? mk(2, bText) : mk(1, bText)],
    "Read the y-intercept first: it equals a. Then compare the y-values one step apart; they change by the factor b each time x increases by 1.",
    {
      type: "plot",
      xMin: -3,
      xMax: 3,
      yMin: -1,
      yMax,
      curves: [{ points: curve(f, -3, 3, 0.1) }],
      points: [
        { x: 0, y: a, label: `(0, ${a})` },
        { x: 1, y: a * b, label: `(1, ${ratStr(a * b)})` },
      ],
    },
  );
}

function expFeatures(lv: Level): Question {
  const a = nz(-4, 4);
  const b = pick([2, 3, 4]);
  const k = nz(-5, 5);
  const eq = `y = ${expTerm(a, String(b))}${addConst(k)}`;
  if (lv === 1 || chance(0.5)) {
    return typed(`What is the y-intercept of ${eq}?`, a + k, "Substitute x = 0. Any base to the power 0 is 1.");
  }
  return mc(
    `What is the equation of the horizontal asymptote of ${eq}?`,
    `y = ${num(k)}`,
    [`y = ${num(-k)}`, `y = ${num(a)}`, "y = 0", "x = 0"].filter((s) => s !== `y = ${num(k)}`),
    "The term " + `${b}^x` + " gets closer and closer to 0 but never reaches it, so the graph levels off at the constant being added.",
  );
}

function expSameBase(lv: Level): Question {
  if (lv === 1) {
    const base = pick([2, 3, 5]);
    const n = randInt(2, 5);
    return typed(`Solve ${base}^x = ${base ** n}.`, n, `Write ${base ** n} as a power of ${base}. If the bases match, the exponents must be equal.`, { keypad: "number" });
  }
  const p = pick([2, 3, 5]);
  for (let tries = 0; tries < 200; tries++) {
    const u = randInt(1, 3);
    let v = randInt(1, 3);
    if (u === v) v = (v % 3) + 1;
    const c1 = randInt(-3, 3);
    const c2 = randInt(-3, 3);
    const top = v * c2 - u * c1;
    const bot = u - v;
    if (top % bot === 0 && u !== v) {
      const x = top / bot;
      const L = p ** u;
      const R = p ** v;
      const sh = (c: number) => (c === 0 ? "x" : c > 0 ? `x + ${c}` : `x ${MINUS} ${-c}`);
      return typed(
        `Solve ${L}^(${sh(c1)}) = ${R}^(${sh(c2)}).`,
        x,
        `Rewrite both sides with the same base ${p}: ${L} = ${p}^${u} and ${R} = ${p}^${v}. Then set the exponents equal and solve.`,
      );
    }
  }
  return typed("Solve 4^(x + 1) = 8^(x − 1).", 5, "Rewrite both sides with base 2: 2^(2x + 2) = 2^(3x − 3). Then set the exponents equal.");
}

function expDoubling(): Question {
  const g = pick([2, 3]);
  const p = pick([2, 3, 4, 5, 6]);
  const n = randInt(2, 5);
  return typed(
    `A population ${g === 2 ? "doubles" : "triples"} every ${p} hours. After how many hours is it ${g ** n} times its original size?`,
    n * p,
    `${g ** n} = ${g}^${n}, so ${n} periods are needed. Multiply by ${p} hours per period.`,
    { keypad: "number", suffix: "hours" },
  );
}

function exponentials(opts?: GenerateOptions): Question[] {
  return build(
    [expModel, expGrowthValue, expHalfLife, expHalfLife, expCompound, expCompoundModel, expGraphBase, expFeatures, expSameBase, expDoubling],
    levelOf(opts),
  );
}

// ======================================================================
// Unit 6: Logarithms
// ======================================================================

const logName = (b: number): string => `log${sub(b)}`;

function logEvaluate(lv: Level): Question {
  const b = pick(lv === 1 ? [2, 3, 10] : [2, 3, 4, 5, 10]);
  const nMax = b === 10 ? 4 : b === 2 ? 6 : 3;
  const n = lv === 1 ? randInt(1, nMax) : randInt(-3, nMax);
  const arg = n >= 0 ? String(b ** n) : `1/${b ** -n}`;
  const nameStr = b === 10 ? "log" : logName(b);
  return typed(
    `Evaluate ${nameStr} ${n >= 0 ? arg : `(${arg})`}.`,
    n,
    `Ask: ${b} to what power gives ${arg}? ${n < 0 ? "A negative exponent means a reciprocal. " : ""}Write ${arg} as a power of ${b}.`,
  );
}

function logFractionAnswer(): Question {
  const rows: [number, number, number][] = [[4, 2, 2], [9, 3, 2], [16, 4, 2], [25, 5, 2], [8, 2, 3], [27, 3, 3], [125, 5, 3]];
  const [base, arg, k] = pick(rows);
  if (arg ** k !== base) throw new Error("log table");
  return typed(
    `Evaluate ${logName(base)} ${arg}. Enter a fraction.`,
    `1/${k}`,
    `Ask: ${base} to what power is ${arg}? Since ${arg}^${k} = ${base}, the base ${base} is the ${k === 2 ? "square" : "cube"} of ${arg}, so the answer is a fraction: 1/${k}.`,
    { keypad: "fraction" },
  );
}

function logForms(): Question {
  const b = pick([2, 3, 4, 5, 10]);
  const n = randInt(2, b === 10 ? 4 : 4);
  const x = b ** n;
  const nameStr = b === 10 ? "log" : logName(b);
  if (chance(0.5)) {
    return mc(
      `Write ${nameStr} ${x} = ${n} in exponential form.`,
      `${b}${sup(n)} = ${x}`,
      [`${n}${sup(b)} = ${x}`, `${x}${sup(n)} = ${b}`, `${b}${sup(x)} = ${n}`, `${n}${sup(x)} = ${b}`],
      "In log_b(x) = y the base is b, the answer to the log is the exponent y, and x is the result: b^y = x.",
    );
  }
  const right = `${nameStr} ${x} = ${n}`;
  return mc(
    `Write ${b}${sup(n)} = ${x} in logarithmic form.`,
    right,
    [`${b === 10 ? "log" : logName(n)} ${x} = ${b}`, `${logName(x)} ${b} = ${n}`, `${nameStr} ${n} = ${x}`, `${logName(x)} ${n} = ${b}`].filter((s) => s !== right),
    "The exponent is what the logarithm equals: if b^y = x then log_b(x) = y. The base stays the base.",
  );
}

function logLawsEvaluate(lv: Level): Question {
  const b = pick(lv === 1 ? [2, 3] : [2, 3, 5, 10]);
  const n = randInt(2, b === 10 ? 4 : 4);
  const total = b ** n;
  const divs: number[] = [];
  for (let d = 2; d < total; d++) if (total % d === 0) divs.push(d);
  const name = b === 10 ? "log" : logName(b);
  const kind = pick(["sum", "diff", "power"] as const);
  if (kind === "sum") {
    const A = pick(divs);
    return typed(`Evaluate ${name} ${A} + ${name} ${total / A}.`, n, `Product law: log A + log B = log (A × B). Here ${A} × ${total / A} = ${total}, and ${total} = ${b}^${n}.`);
  }
  if (kind === "diff") {
    const B = randInt(2, 7);
    const A = total * B;
    return typed(`Evaluate ${name} ${A} ${MINUS} ${name} ${B}.`, n, `Quotient law: log A − log B = log (A ÷ B). Here ${A} ÷ ${B} = ${total}, and ${total} = ${b}^${n}.`);
  }
  const k = randInt(2, 4);
  const m = randInt(1, 2);
  return typed(
    `Evaluate ${k} ${name} ${b ** m}.`,
    k * m,
    `Power law: k log A = log (A^k). Or work it out directly: ${name} ${b ** m} = ${m}, then multiply by ${k}.`,
  );
}

function logExpand(lv: Level): Question {
  const b = pick([2, 3, 5, 10]);
  const nm = b === 10 ? "log" : logName(b);
  const a = pick(lv === 1 ? [2, 3] : [2, 3, 4]);
  const c = pick([1, 2, 3]);
  const d = pick(lv === 1 ? [2] : [2, 3]);
  const co = (k: number) => (k === 1 ? "" : `${k} `);
  const sq = (v: string, e: number) => (e === 1 ? v : `${v}${sup(e)}`);
  if (chance(0.5)) {
    const expr = `${nm} (${sq("x", a)}${sq("y", c)}/${sq("z", d)})`;
    const right = `${co(a)}${nm} x + ${co(c)}${nm} y ${MINUS} ${co(d)}${nm} z`;
    return mc(
      `Expand ${expr}.`,
      right,
      [
        `${co(a)}${nm} x + ${co(c)}${nm} y + ${co(d)}${nm} z`,
        `${co(a)}${nm} x ${MINUS} ${co(c)}${nm} y + ${co(d)}${nm} z`,
        `${nm} x + ${nm} y ${MINUS} ${nm} z`,
        `(${co(a)}${nm} x)(${co(c)}${nm} y) ÷ (${co(d)}${nm} z)`,
      ],
      "Products become sums, quotients become differences, and exponents come down as multipliers.",
    );
  }
  const expr = `${co(a)}${nm} x + ${co(c)}${nm} y ${MINUS} ${co(d)}${nm} z`;
  const right = `${nm} (${sq("x", a)}${sq("y", c)}/${sq("z", d)})`;
  return mc(
    `Write ${expr} as a single logarithm.`,
    right,
    [
      `${nm} (${sq("x", a)}${sq("y", c)}${sq("z", d)})`,
      `${nm} (${sq("x", a)}${sq("z", d)}/${sq("y", c)})`,
      `${nm} (${a}x + ${c}y ${MINUS} ${d}z)`,
      `${nm} (x${a === 1 ? "" : ` × ${a}`}y/z)`.replace(" × 1", ""),
    ].filter((s) => s !== right),
    "Bring each coefficient up as an exponent first. Then addition becomes multiplication and subtraction becomes division.",
  );
}

function logChangeBase(lv: Level): Question {
  const b = pick([2, 3, 5, 7]);
  let m: number;
  do m = randInt(3, lv === 1 ? 30 : 99);
  while (Math.log(m) / Math.log(b) === Math.round(Math.log(m) / Math.log(b)));
  const v = Math.log(m) / Math.log(b);
  const scaled = v * 100;
  if (Math.abs(scaled - Math.floor(scaled) - 0.5) < 0.12) return logChangeBase(lv);
  return typed(
    `Use the change-of-base formula to evaluate ${logName(b)} ${m}, rounded to 2 decimal places.`,
    (Math.round(scaled) / 100).toFixed(2),
    `log_b(m) = log m ÷ log b. On a calculator, divide log ${m} by log ${b}, and round to 2 decimal places.`,
    { keypad: "decimal" },
  );
}

function logChangeBaseChoice(): Question {
  const b = pick([2, 3, 5, 7]);
  const m = pick([6, 10, 12, 20, 30]);
  return mc(
    `Which expression equals ${logName(b)} ${m}?`,
    `log ${m} ÷ log ${b}`,
    [`log ${b} ÷ log ${m}`, `log ${m} × log ${b}`, `log ${m} ${MINUS} log ${b}`, `${m} ÷ ${b}`],
    "Change of base: log_b(m) = log m ÷ log b. The number you take the log of goes on top.",
  );
}

function logSolveExp(lv: Level): Question {
  const b = pick([2, 3, 5]);
  const c = lv === 1 ? 1 : pick([1, 2, 3, 5]);
  const target = randInt(5, lv === 3 ? 90 : 60);
  const rhs = c * target;
  const x = Math.log(target) / Math.log(b);
  if (x === Math.round(x)) return logSolveExp(lv);
  const scaled = x * 100;
  if (Math.abs(scaled - Math.floor(scaled) - 0.5) < 0.12) return logSolveExp(lv);
  return typed(
    `Solve ${c === 1 ? "" : c}${b}^x = ${rhs}. Round to 2 decimal places.`,
    (Math.round(scaled) / 100).toFixed(2),
    c === 1
      ? `Take the logarithm of both sides: x log ${b} = log ${rhs}, so x = log ${rhs} ÷ log ${b}.`
      : `Divide both sides by ${c} first to isolate the power: ${b}^x = ${target}. Then take logs: x = log ${target} ÷ log ${b}.`,
    { keypad: "decimal" },
  );
}

function logSolveLog(lv: Level): Question {
  const b = pick([2, 3, 4, 5]);
  const n = randInt(1, b === 2 ? 5 : 3);
  const T = b ** n;
  if (lv <= 2 || chance(0.4)) {
    if (lv === 1 || chance(0.5)) {
      const c = nz(-6, 6);
      return typed(`Solve ${logName(b)} (x ${c < 0 ? MINUS : "+"} ${Math.abs(c)}) = ${n}.`, T - c, `Rewrite in exponential form: x ${c < 0 ? MINUS : "+"} ${Math.abs(c)} = ${b}^${n} = ${T}. Then solve for x.`);
    }
    for (let i = 0; i < 100; i++) {
      const m = randInt(2, 4);
      const c = nz(-6, 6);
      if ((T - c) % m === 0) {
        const x = (T - c) / m;
        return typed(
          `Solve ${logName(b)} (${m}x ${c < 0 ? MINUS : "+"} ${Math.abs(c)}) = ${n}.`,
          x,
          `Rewrite in exponential form: ${m}x ${c < 0 ? MINUS : "+"} ${Math.abs(c)} = ${b}^${n} = ${T}. Then solve for x.`,
        );
      }
    }
  }
  const a1 = randInt(2, 4);
  const b1 = randInt(1, a1 - 1);
  const x1 = 2 ** a1;
  const d = 2 ** a1 - 2 ** b1;
  return typed(
    `Solve ${logName(2)} x + ${logName(2)} (x ${MINUS} ${d}) = ${a1 + b1}. Enter the valid solution.`,
    x1,
    `Combine with the product law: ${logName(2)} (x(x ${MINUS} ${d})) = ${a1 + b1}, so x(x ${MINUS} ${d}) = 2^${a1 + b1} = ${2 ** (a1 + b1)}. Solve the quadratic, then reject any solution that makes a log argument negative.`,
  );
}

function logApplication(): Question {
  const kind = pick(["ph", "quake", "sound", "ph2"] as const);
  if (kind === "ph") {
    const k = randInt(2, 11);
    return typed(
      `The pH of a solution is pH = ${MINUS}log[H⁺]. If [H⁺] = 10${sup(-k)} mol/L, what is the pH?`,
      k,
      `pH = ${MINUS}log(10${sup(-k)}) = ${MINUS}(${MINUS}${k}).`,
      { keypad: "number" },
    );
  }
  if (kind === "ph2") {
    const lo = randInt(2, 5);
    const diff = randInt(1, 3);
    return typed(
      `Solution A has pH ${lo} and solution B has pH ${lo + diff}. How many times greater is the hydrogen-ion concentration of A than of B?`,
      10 ** diff,
      `Each drop of 1 in pH means 10 times the hydrogen-ion concentration. A difference of ${diff} gives 10^${diff}.`,
      { keypad: "number" },
    );
  }
  if (kind === "quake") {
    const m1 = randInt(4, 6);
    const diff = randInt(1, 3);
    return typed(
      `An earthquake of magnitude ${m1 + diff} is how many times as strong (in ground-motion amplitude) as one of magnitude ${m1}?`,
      10 ** diff,
      `On the Richter scale, each step of 1 in magnitude means 10 times the amplitude. A difference of ${diff} is 10^${diff}.`,
      { keypad: "number" },
    );
  }
  const k = randInt(2, 12);
  return typed(
    `Sound level in decibels is L = 10 log(I/I₀). A sound has intensity I = 10${sup(k)} × I₀. What is L in decibels?`,
    10 * k,
    `L = 10 log(10${sup(k)}) = 10 × ${k}.`,
    { keypad: "number", suffix: "dB" },
  );
}

function logGraph(): Question {
  const b = pick([2, 3, 4]);
  const f = (x: number) => Math.log(x) / Math.log(b);
  const pts = [...curve(f, 0.1, 10, 0.05)];
  const options = [2, 3, 4, 5].filter((o) => o !== b);
  return mc(
    "Which equation matches this graph?",
    `y = ${logName(b)} x`,
    [...options.slice(0, 3).map((o) => `y = ${logName(o)} x`), `y = ${b}^x`],
    "Find a point where y = 1. For y = log_b(x), that happens when x = b.",
    {
      type: "plot",
      xMin: -1,
      xMax: 10,
      yMin: -3,
      yMax: 3,
      curves: [{ points: pts }],
      points: [
        { x: 1, y: 0, label: "(1, 0)" },
        { x: b, y: 1, label: `(${b}, 1)` },
      ],
    },
  );
}

function logInverse(): Question {
  const b = pick([2, 3, 5, 10]);
  const nm = b === 10 ? "log" : logName(b);
  if (chance(0.5)) {
    return mc(`What is the inverse of y = ${b}^x?`, `y = ${nm} x`, [`y = x^${b}`, `y = ${b}${MINUS}x`.replace(MINUS + "x", "^(−x)"), `y = 1/${b}^x`, `y = ${nm.replace(/log/, "log")} (1/x)`], "Swap x and y: x = b^y. Writing this in log form gives y = log_b(x).");
  }
  return mc(`What is the inverse of y = ${nm} x?`, `y = ${b}^x`, [`y = x^${b}`, `y = ${b} x`, `y = ${nm} (1/x)`, `y = 1/${b}^x`], "Swap x and y: x = log_b(y). In exponential form that is y = b^x.");
}

function logarithms(opts?: GenerateOptions): Question[] {
  return build(
    [logEvaluate, logEvaluate, [logFractionAnswer, 2, 3], logForms, logLawsEvaluate, logExpand, logChangeBase, [logChangeBaseChoice, 1, 2], logSolveExp, logSolveLog, logSolveLog, logApplication, logGraph, logInverse],
    levelOf(opts),
  );
}

// ======================================================================
// Unit 7: Trigonometric functions
// ======================================================================

const TRIG_REF: Record<number, { sin: string; cos: string; tan: string }> = {
  0: { sin: "0", cos: "1", tan: "0" },
  30: { sin: "1/2", cos: "√3/2", tan: "√3/3" },
  45: { sin: "√2/2", cos: "√2/2", tan: "1" },
  60: { sin: "√3/2", cos: "1/2", tan: "√3" },
  90: { sin: "1", cos: "0", tan: "undefined" },
};
type TrigFn = "sin" | "cos" | "tan";
const TRIG_MATH: Record<TrigFn, (r: number) => number> = { sin: Math.sin, cos: Math.cos, tan: Math.tan };
function exactVal(fn: TrigFn, deg: number): string {
  const d = ((deg % 360) + 360) % 360;
  const ref = d <= 90 ? d : d <= 180 ? 180 - d : d <= 270 ? d - 180 : 360 - d;
  const base = TRIG_REF[ref][fn];
  if (base === "0" || base === "undefined") return base;
  return TRIG_MATH[fn]((d * Math.PI) / 180) < 0 ? `${MINUS}${base}` : base;
}
function radStr(deg: number): string {
  if (deg === 0) return "0";
  if (deg < 0) return `${MINUS}${radStr(-deg)}`;
  const g = gcd(deg, 180);
  const n = deg / g;
  const d = 180 / g;
  const top = n === 1 ? "π" : `${n}π`;
  return d === 1 ? top : `${top}/${d}`;
}
const SPECIAL = [30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
const NON_AXIS = SPECIAL.filter((d) => d % 90 !== 0);
const quadrantOf = (deg: number): string => {
  const d = ((deg % 360) + 360) % 360;
  return d < 90 ? "I" : d < 180 ? "II" : d < 270 ? "III" : "IV";
};

function trigConvert(lv: Level): Question {
  const pool = lv === 1 ? [30, 45, 60, 90, 120, 135, 150, 180, 270, 360] : [15, 75, 105, 120, 135, 150, 210, 225, 240, 300, 315, 330, 12, 36, 72, 84];
  const deg = pick(pool);
  const kind = pick(["toRad", "toDeg", "toDeg"] as const);
  if (kind === "toDeg") {
    return typed(`Convert ${radStr(deg)} radians to degrees.`, deg, "Multiply by 180/π. Since π radians = 180°, replace π with 180 and simplify.", { keypad: "number", suffix: "°" });
  }
  const right = radStr(deg);
  const g = gcd(deg, 180);
  const inverted = `${(180 / g) === 1 ? "" : 180 / g}π/${deg / g}`;
  const wrong = [radStr(deg + 15), radStr(deg + 30 > 360 ? deg - 30 : deg + 30), inverted, radStr(deg > 180 ? deg - 90 : deg + 90)];
  return mc(`Convert ${deg}° to radians.`, right, wrong, "Multiply by π/180, then simplify the fraction.");
}

function trigArc(lv: Level): Question {
  if (lv === 1 || chance(0.5)) {
    const r = randInt(2, 12);
    const th = randInt(2, 6);
    return typed(
      `A sector has radius ${r} cm and central angle ${th} radians. What is the arc length, in cm?`,
      r * th,
      "When the angle is in radians, arc length = radius × angle (a = rθ).",
      { keypad: "number", suffix: "cm" },
    );
  }
  const r = pick([6, 9, 12, 8, 10, 15]);
  const deg = pick([30, 45, 60, 90, 120, 150]);
  const piOf = (n: number, d: number): string => {
    const g = gcd(n, d);
    const nn = n / g;
    const dd = d / g;
    return `${nn === 1 ? "" : nn}π${dd === 1 ? "" : `/${dd}`}`;
  };
  const right = `${piOf(r * deg, 180)} cm`;
  const wrong = [`${r * deg}π cm`, `${frac(r * deg, 180)} cm`, `${radStr(deg)} cm`, `${piOf(r * 180, deg)} cm`, `${piOf(r * deg * 2, 180)} cm`];
  return mc(
    `A circle has radius ${r} cm. What is the length of the arc subtended by a ${deg}° angle at the centre?`,
    right,
    wrong,
    "Convert the angle to radians first (multiply by π/180), then use arc length = rθ.",
  );
}

function trigExact(lv: Level): Question {
  const fn = pick<TrigFn>(lv === 1 ? ["sin", "cos"] : ["sin", "cos", "tan"]);
  const deg = pick(lv === 1 ? [30, 45, 60, 120, 150, 210, 300] : fn === "tan" ? [...NON_AXIS, 90, 270, 180] : [...SPECIAL, 0, 360]);
  const useRad = chance(0.6);
  const angle = useRad ? radStr(deg) : `${deg}°`;
  const right = exactVal(fn, deg);
  const pool = fn === "tan" ? ["0", "1", `${MINUS}1`, "√3", `${MINUS}√3`, "√3/3", `${MINUS}√3/3`, "undefined"] : ["0", "1", `${MINUS}1`, "1/2", `${MINUS}1/2`, "√2/2", `${MINUS}√2/2`, "√3/2", `${MINUS}√3/2`];
  const other = fn === "sin" ? exactVal("cos", deg) : exactVal(fn === "cos" ? "sin" : "cos", deg);
  const neg = (s: string) => (s.startsWith(MINUS) ? s.slice(1) : s === "0" || s === "undefined" ? s : `${MINUS}${s}`);
  const wrong = [neg(right), other, neg(other), ...shuffle(pool)].filter((s) => pool.includes(s));
  return mc(
    `What is the exact value of ${fn} (${angle})?`,
    right,
    wrong,
    "Find the reference angle (the acute angle to the x-axis), use its exact value from a 30-60-90 or 45-45-90 triangle, then choose the sign from the quadrant (All, Sin, Tan, Cos).",
  );
}

function trigQuadrant(): Question {
  const sinPos = chance(0.5);
  const cosPos = chance(0.5);
  const quad = sinPos ? (cosPos ? "I" : "II") : cosPos ? "IV" : "III";
  return mc(
    `In which quadrant is the terminal arm of θ if sin θ is ${sinPos ? "positive" : "negative"} and cos θ is ${cosPos ? "positive" : "negative"}?`,
    `Quadrant ${quad}`,
    ["I", "II", "III", "IV"].filter((q) => q !== quad).map((q) => `Quadrant ${q}`),
    "Sine is positive above the x-axis (I and II). Cosine is positive to the right of the y-axis (I and IV).",
  );
}

function trigReferenceAngle(lv: Level): Question {
  const deg = pick(lv === 1 ? [120, 150, 210, 240, 300, 330] : [110, 125, 160, 200, 215, 250, 290, 340, 400, 460, 500]);
  const d = deg % 360;
  const ref = d <= 90 ? d : d <= 180 ? 180 - d : d <= 270 ? d - 180 : 360 - d;
  return typed(
    `What is the reference angle for ${deg}°, in degrees?`,
    ref,
    `${deg > 360 ? `Subtract 360° to get ${d}°, a coterminal angle. ` : ""}The reference angle is the acute angle between the terminal arm and the x-axis. In quadrant ${quadrantOf(d)} it is ${d <= 90 ? "the angle itself" : d <= 180 ? "180° − θ" : d <= 270 ? "θ − 180°" : "360° − θ"}.`,
    { keypad: "number", suffix: "°" },
  );
}

function trigCoterminal(): Question {
  const k = pick([-2, -1, 1, 2]);
  const base = randInt(20, 340);
  const shown = base + 360 * k;
  return typed(
    `Find the angle between 0° and 360° that is coterminal with ${num(shown)}°.`,
    base,
    "Add or subtract multiples of 360° until the angle lies between 0° and 360°.",
    { keypad: "number", suffix: "°" },
  );
}

function trigUnitPoint(): Question {
  const deg = pick(NON_AXIS);
  const c = exactVal("cos", deg);
  const s = exactVal("sin", deg);
  const neg = (t: string) => (t.startsWith(MINUS) ? t.slice(1) : t === "0" ? t : `${MINUS}${t}`);
  const pt = (x: string, y: string) => `(${x}, ${y})`;
  const right = pt(c, s);
  return mc(
    `What are the coordinates of the point where the terminal arm of ${radStr(deg)} meets the unit circle?`,
    right,
    [pt(s, c), pt(neg(c), s), pt(c, neg(s)), pt(neg(c), neg(s)), pt(neg(s), c)].filter((t) => t !== right),
    "On the unit circle, the point for angle θ is (cos θ, sin θ). Use the reference angle for the sizes and the quadrant for the signs.",
  );
}

const TRIG_B = [1, 2, 3, 0.5];
const periodText = (b: number): string => ({ 1: "2π", 2: "π", 3: "2π/3", 0.5: "4π" } as Record<number, string>)[b];
const bxText = (b: number): string => (b === 1 ? "x" : b === 0.5 ? "x/2" : `${b}x`);
function trigEq(fn: "sin" | "cos", a: number, b: number, d: number): string {
  return `y = ${a === 1 ? "" : a} ${fn}(${bxText(b)})${addConst(d)}`.replace("=  ", "= ").replace(" ", " ");
}

function trigGraph(lv: Level, what: "amp" | "mid" | "period" | "eq"): Question {
  const fn = pick<"sin" | "cos">(["sin", "cos"]);
  const a = pick(lv === 1 ? [1, 2] : [1, 2, 3]);
  const b = pick(lv === 1 ? [1, 2] : TRIG_B);
  const d = lv === 1 ? 0 : pick([-2, -1, 0, 1, 2]);
  const f = (x: number) => a * (fn === "sin" ? Math.sin(b * x) : Math.cos(b * x)) + d;
  const xMax = b < 1 ? 13 : 7;
  const visual: Visual = {
    type: "plot",
    xMin: 0,
    xMax,
    yMin: d - a - 1,
    yMax: d + a + 1,
    curves: [{ points: curve(f, 0, xMax, 0.05) }],
    points: lv === 1 ? [{ x: 0, y: f(0), label: `(0, ${f(0)})` }] : undefined,
  };
  if (what === "amp") return typed("What is the amplitude of this sinusoidal graph?", a, "Amplitude is half the distance from the maximum to the minimum: (max − min) ÷ 2.", { keypad: "number", visual });
  if (what === "mid") return typed("What is the equation of the midline? Enter the value of y.", d, "The midline is halfway between the maximum and minimum: (max + min) ÷ 2.", { visual });
  if (what === "period") {
    const right = periodText(b);
    return mc("What is the period of this graph?", right, ["2π", "π", "2π/3", "4π", "π/2"].filter((p) => p !== right), "The period is the horizontal length of one full cycle. Note that 2π ≈ 6.28 and π ≈ 3.14 on this axis.", visual);
  }
  const otherFn = fn === "sin" ? "cos" : "sin";
  const bAlt = pick(TRIG_B.filter((x) => x !== b));
  const right = trigEq(fn, a, b, d);
  return mc(
    "Which equation matches this graph?",
    right,
    [trigEq(otherFn, a, b, d), trigEq(fn, a, bAlt, d), trigEq(fn, a, b, d === 0 ? 1 : -d), trigEq(fn, a === 1 ? 2 : a - 1, b, d)],
    "Check where the graph starts at x = 0: on the midline and rising means sine; at a maximum means cosine. Then use the amplitude, the midline and the period (2π ÷ b).",
    visual,
  );
}

const PHASES = ["π/6", "π/4", "π/3", "π/2", "2π/3", "π"];
function trigSymbolic(lv: Level): Question {
  const fn = pick<"sin" | "cos">(["sin", "cos"]);
  const a = pick([2, 3, 4, 5]);
  const b = pick(lv === 1 ? [1, 2] : TRIG_B);
  const c = pick(PHASES);
  const left = chance(0.4);
  const d = nz(-4, 4);
  const inner = b === 1 ? `x ${left ? "+" : MINUS} ${c}` : `${b === 0.5 ? "(1/2)" : b}(x ${left ? "+" : MINUS} ${c})`;
  const eq = `y = ${a} ${fn}(${inner})${addConst(d)}`;
  const desc = (aa: number, pp: string, ph: string, left_: boolean, dd: number) =>
    `amplitude ${aa}, period ${pp}, phase shift ${ph} to the ${left_ ? "left" : "right"}, midline y = ${num(dd)}`;
  const right = desc(a, periodText(b), c, left, d);
  const bAlt = pick(TRIG_B.filter((x) => x !== b));
  const phAlt = pick(PHASES.filter((p) => p !== c));
  return mc(
    `State the key features of ${eq}.`,
    right,
    [
      desc(a, periodText(bAlt), c, left, d),
      desc(a, periodText(b), c, !left, d),
      desc(a, periodText(b), c, left, -d),
      desc(a + 1, periodText(b), phAlt, left, d),
    ],
    "In y = a sin(b(x − c)) + d: amplitude = |a|, period = 2π ÷ b, phase shift = c (to the right if positive), midline y = d. Note that (x + c) means a shift to the left.",
  );
}

function trigPhaseFactored(): Question {
  const pairs: [number, number][] = [[2, 30], [3, 30], [3, 45], [2, 60], [3, 60], [4, 60]];
  const [b, phiDeg] = pick(pairs);
  const shiftDeg = phiDeg / b;
  const phiText = radStr(phiDeg);
  const shiftText = radStr(shiftDeg);
  const right = `${shiftText} to the right`;
  return mc(
    `What is the phase shift of y = sin(${b}x ${MINUS} ${phiText})?`,
    right,
    [`${phiText} to the right`, `${radStr(phiDeg * b)} to the right`, `${shiftText} to the left`, `${phiText} to the left`, `${radStr(phiDeg + shiftDeg)} to the right`],
    `Factor out ${b}: sin(${b}x ${MINUS} ${phiText}) = sin(${b}(x ${MINUS} ${shiftText})). The shift is ${phiText} divided by ${b}, which is ${shiftText}.`,
  );
}

function trigSolve(lv: Level): Question {
  const fn = pick<TrigFn>(lv === 1 ? ["sin", "cos"] : ["sin", "cos", "tan"]);
  const d0 = pick(NON_AXIS.filter((d) => d < 180));
  const v = TRIG_MATH[fn]((d0 * Math.PI) / 180);
  const sols: number[] = [];
  for (const d of [...SPECIAL.filter((x) => x !== 180 && x !== 360), ...NON_AXIS]) {
    if (!sols.includes(d) && Math.abs(TRIG_MATH[fn]((d * Math.PI) / 180) - v) < 1e-9 && d % 90 !== 0) sols.push(d);
  }
  sols.sort((p, q) => p - q);
  const show = (arr: number[]) => arr.map(radStr).join(" and ");
  const key = (arr: number[]) => [...arr].sort((p, q) => p - q).join(",");
  const rightKey = key(sols);
  const cands = [
    [d0, 180 - d0],
    [d0, 180 + d0],
    [d0, 360 - d0],
    [180 - d0, 180 + d0],
    [180 - d0, 360 - d0],
    [180 + d0, 360 - d0],
    [d0, d0 + 90 > 360 ? d0 - 90 : d0 + 90],
  ].filter((arr) => key(arr) !== rightKey);
  const valText = exactVal(fn, d0);
  return mc(
    `Solve ${fn} x = ${valText} for 0 ≤ x < 2π.`,
    show(sols),
    cands.map(show),
    `Find the reference angle with this value, then place it in the two quadrants where ${fn} has the right sign. Reference angle: ${radStr(d0)}.`,
  );
}

function trigModel(lv: Level): Question {
  const a = pick([2, 3, 4, 5, 6, 8]);
  const d = a + randInt(1, 6);
  const k = pick([2, 3, 4, 6]);
  const fnName = chance(0.5) ? "sin" : "cos";
  const eq = `h(t) = ${a} ${fnName}(πt/${k}) + ${d}`;
  const kind = lv === 1 ? pick(["max", "min"] as const) : pick(["max", "min", "period", "range"] as const);
  const ctx = `The height of the water in a harbour, in metres, is modelled by ${eq}, where t is in hours.`;
  if (kind === "max") return typed(`${ctx} What is the greatest height?`, d + a, "The maximum is the midline value plus the amplitude: d + a.", { keypad: "number", suffix: "m" });
  if (kind === "min") return typed(`${ctx} What is the least height?`, d - a, "The minimum is the midline value minus the amplitude: d − a.", { keypad: "number", suffix: "m" });
  if (kind === "period") return typed(`${ctx} How many hours are there between one high tide and the next?`, 2 * k, "That's one period: 2π ÷ (π/k) = 2k.", { keypad: "number", suffix: "hours" });
  return typed(`${ctx} What is the difference between high tide and low tide, in metres?`, 2 * a, "The range of the water level is twice the amplitude.", { keypad: "number", suffix: "m" });
}

function trigFunctions(opts?: GenerateOptions): Question[] {
  return build(
    [
      trigConvert,
      trigConvert,
      trigArc,
      trigExact,
      trigExact,
      trigQuadrant,
      trigReferenceAngle,
      trigCoterminal,
      trigUnitPoint,
      (lv) => trigGraph(lv, "amp"),
      (lv) => trigGraph(lv, "mid"),
      (lv) => trigGraph(lv, "period"),
      (lv) => trigGraph(lv, "eq"),
      [trigSymbolic, 2, 3],
      [trigPhaseFactored, 3, 3],
      [trigSolve, 2, 3],
      trigModel,
    ],
    levelOf(opts),
  );
}

// ======================================================================
// Unit 8: Trigonometric identities
// ======================================================================

const TRIPLES: [number, number, number][] = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]];

function identPythagorean(lv: Level): Question {
  const [p, q, r] = pick(lv === 1 ? TRIPLES.slice(0, 2) : TRIPLES);
  const [A, B] = chance(0.5) ? [p, q] : [q, p];
  const quad = randInt(1, 4);
  const sx = quad === 1 || quad === 4 ? 1 : -1;
  const sy = quad === 1 || quad === 2 ? 1 : -1;
  const x = sx * A;
  const y = sy * B;
  const vals: Record<TrigFn, string> = { sin: frac(y, r), cos: frac(x, r), tan: frac(y, x) };
  const given = pick<TrigFn>(["sin", "cos", "tan"]);
  const ask = pick<TrigFn>((["sin", "cos", "tan"] as TrigFn[]).filter((f) => f !== given));
  const right = vals[ask];
  const pool = new Set<string>();
  const flip = (s: string) => (s.startsWith(MINUS) ? s.slice(1) : `${MINUS}${s}`);
  pool.add(flip(right));
  const recip = ask === "tan" ? frac(x, y) : frac(r, ask === "sin" ? y : x);
  pool.add(recip);
  pool.add(flip(recip));
  pool.add(vals[given === ask ? "sin" : given]);
  pool.add(frac(A, B));
  pool.add(frac(-A, B));
  const qName = ["I", "II", "III", "IV"][quad - 1];
  return mc(
    `If ${given} θ = ${vals[given]} and θ is in quadrant ${qName}, what is ${ask} θ?`,
    right,
    [...pool].filter((s) => s !== right),
    "Sketch the triangle in the stated quadrant. Use sin² θ + cos² θ = 1 (or the Pythagorean triple) for the missing side, and set the signs by the quadrant: x is negative in II and III, y is negative in III and IV.",
  );
}

const SIMPLIFY: { expr: string; right: string; level: Level }[] = [
  { expr: "sin x ÷ cos x", right: "tan x", level: 1 },
  { expr: "1 ÷ sin x", right: "csc x", level: 1 },
  { expr: "1 ÷ cos x", right: "sec x", level: 1 },
  { expr: "cos x ÷ sin x", right: "cot x", level: 1 },
  { expr: "1 − cos²x", right: "sin²x", level: 1 },
  { expr: "1 − sin²x", right: "cos²x", level: 1 },
  { expr: "tan x cos x", right: "sin x", level: 2 },
  { expr: "sin x csc x", right: "1", level: 1 },
  { expr: "sec²x − 1", right: "tan²x", level: 2 },
  { expr: "csc²x − 1", right: "cot²x", level: 2 },
  { expr: "cot x sin x", right: "cos x", level: 2 },
  { expr: "(1 − sin x)(1 + sin x)", right: "cos²x", level: 2 },
  { expr: "tan²x cos²x", right: "sin²x", level: 3 },
  { expr: "sin²x ÷ (1 − sin²x)", right: "tan²x", level: 3 },
  { expr: "(sin x ÷ cos x) ÷ (1 ÷ cos x)", right: "sin x", level: 3 },
  { expr: "sec x cot x", right: "csc x", level: 3 },
  { expr: "(1 + tan²x) cos²x", right: "1", level: 3 },
  { expr: "csc x tan x", right: "sec x", level: 3 },
];
const SIMPLE_FORMS = ["sin x", "cos x", "tan x", "1", "sin²x", "cos²x", "tan²x", "sec x", "csc x", "cot x", "sec²x", "csc²x"];
function identSimplify(lv: Level): Question {
  const pool = SIMPLIFY.filter((s) => Math.abs(s.level - lv) <= 1);
  const it = pick(pool);
  return mc(
    `Simplify ${it.expr}.`,
    it.right,
    SIMPLE_FORMS.filter((f) => f !== it.right),
    "Rewrite everything in sine and cosine (tan = sin ÷ cos, sec = 1 ÷ cos, csc = 1 ÷ sin, cot = cos ÷ sin), or use sin²x + cos²x = 1, then cancel.",
  );
}

const TRUE_IDS = [
  "sin²x + cos²x = 1",
  "1 + tan²x = sec²x",
  "1 + cot²x = csc²x",
  "tan x = sin x ÷ cos x",
  "cot x = cos x ÷ sin x",
  "sin 2x = 2 sin x cos x",
  "cos 2x = cos²x − sin²x",
  "cos 2x = 1 − 2 sin²x",
  "sin(A + B) = sin A cos B + cos A sin B",
  "cos(A − B) = cos A cos B + sin A sin B",
];
const FALSE_IDS = [
  "sin(A + B) = sin A + sin B",
  "sin 2x = 2 sin x",
  "cos 2x = 2 cos x",
  "1 + sin²x = cos²x",
  "sec²x = 1 − tan²x",
  "cos(A − B) = cos A − cos B",
  "tan x = cos x ÷ sin x",
  "cos(A + B) = cos A cos B + sin A sin B",
  "csc x = 1 ÷ cos x",
];
function identNotIdentity(): Question {
  const bad = pick(FALSE_IDS);
  return mc(
    "Which of these is NOT a trigonometric identity?",
    bad,
    sample(TRUE_IDS, 4),
    "Test a value, e.g. x = 30° or A = B = 45°, in each statement. An identity must work for every angle, so one counter-example is enough.",
  );
}

function identSumDiffExact(lv: Level): Question {
  if (lv >= 2 && chance(0.5)) {
    const form = pick(["sinsum", "cossum", "sindiff", "cosdiff"] as const);
    for (let i = 0; i < 100; i++) {
      const A = pick([10, 15, 20, 25, 35, 40, 50, 55, 65, 70, 80, 100, 110, 130, 140, 160, 170]);
      const B = pick([10, 15, 20, 25, 35, 40, 50, 55, 65, 70, 80, 100, 110, 130, 140, 160, 170]);
      let target: number;
      let fn: TrigFn;
      let expr: string;
      if (form === "sinsum") {
        target = A + B;
        fn = "sin";
        expr = `sin ${A}° cos ${B}° + cos ${A}° sin ${B}°`;
      } else if (form === "cossum") {
        target = A + B;
        fn = "cos";
        expr = `cos ${A}° cos ${B}° ${MINUS} sin ${A}° sin ${B}°`;
      } else if (form === "sindiff") {
        target = A - B;
        fn = "sin";
        expr = `sin ${A}° cos ${B}° ${MINUS} cos ${A}° sin ${B}°`;
      } else {
        target = A - B;
        fn = "cos";
        expr = `cos ${A}° cos ${B}° + sin ${A}° sin ${B}°`;
      }
      if (target < 0 || target > 330 || !(target === 0 || [30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330].includes(target))) continue;
      if (target === 0) continue;
      const right = exactVal(fn, target);
      const pool = ["0", "1", `${MINUS}1`, "1/2", `${MINUS}1/2`, "√2/2", `${MINUS}√2/2`, "√3/2", `${MINUS}√3/2`];
      if (!pool.includes(right)) continue;
      return mc(
        `Find the exact value of ${expr}.`,
        right,
        pool.filter((p) => p !== right),
        "Recognize a compound-angle formula and collapse it into a single trig function of one angle, then use exact values.",
      );
    }
  }
  const items: { fn: TrigFn; deg: number }[] = [75, 105, 15, 165, 195, 255, 285, 345].flatMap((deg) => (["sin", "cos"] as const).map((fn) => ({ fn, deg })));
  const { fn, deg } = pick(items);
  const A = "(√6 + √2)/4";
  const B = "(√6 − √2)/4";
  const v = TRIG_MATH[fn]((deg * Math.PI) / 180);
  const mag = Math.abs(v) > 0.9 ? A : B;
  const right = v < 0 ? `${MINUS}${mag}` : mag;
  const pool = [A, B, `${MINUS}${A}`, `${MINUS}${B}`, "(√2 + 1)/2"];
  const decomp: Record<number, string> = { 15: "45° − 30°", 75: "45° + 30°", 105: "60° + 45°", 165: "135° + 30°", 195: "150° + 45°", 255: "225° + 30°", 285: "240° + 45°", 345: "300° + 45°" };
  return mc(
    `Use a sum or difference formula to find the exact value of ${fn} ${deg}°.`,
    right,
    pool.filter((p) => p !== right),
    `Write ${deg}° as ${decomp[deg]}, apply the ${fn === "sin" ? "sin(A ± B) = sin A cos B ± cos A sin B" : "cos(A ± B) = cos A cos B ∓ sin A sin B"} formula, and use the exact values of the special angles. (Note that sin(A + B) is not sin A + sin B.)`,
  );
}

function identDoubleAngleValue(lv: Level): Question {
  const [p, q, r] = pick(lv === 1 ? TRIPLES.slice(0, 2) : TRIPLES);
  const quad = pick(lv === 1 ? [1] : [1, 2, 3, 4]);
  const sx = quad === 1 || quad === 4 ? 1 : -1;
  const sy = quad === 1 || quad === 2 ? 1 : -1;
  const [A, B] = chance(0.5) ? [p, q] : [q, p];
  const x = sx * A;
  const y = sy * B;
  const r2 = r * r;
  const askSin = chance(0.5);
  const ans = askSin ? frac(2 * x * y, r2, true) : frac(x * x - y * y, r2, true);
  const qName = ["I", "II", "III", "IV"][quad - 1];
  return typed(
    `If sin θ = ${frac(y, r)} and cos θ = ${frac(x, r)} (θ in quadrant ${qName}), find ${askSin ? "sin 2θ" : "cos 2θ"} as a fraction.`,
    ans,
    askSin ? "Use sin 2θ = 2 sin θ cos θ and multiply the two fractions, keeping the signs." : "Use cos 2θ = cos²θ − sin²θ. Square each fraction first, then subtract.",
    { keypad: "fraction" },
  );
}

function identDoubleAngleExact(): Question {
  const A = pick([15, 30, 45, 60, 75]);
  const form = pick(["sin", "cosd", "cos1", "cos2"] as const);
  const expr =
    form === "sin"
      ? `2 sin ${A}° cos ${A}°`
      : form === "cosd"
        ? `cos²${A}° ${MINUS} sin²${A}°`
        : form === "cos1"
          ? `1 ${MINUS} 2 sin²${A}°`
          : `2 cos²${A}° ${MINUS} 1`;
  const fn: TrigFn = form === "sin" ? "sin" : "cos";
  const right = exactVal(fn, 2 * A);
  const pool = ["0", "1", `${MINUS}1`, "1/2", `${MINUS}1/2`, "√2/2", `${MINUS}√2/2`, "√3/2", `${MINUS}√3/2`];
  return mc(
    `Use a double-angle identity to find the exact value of ${expr}.`,
    right,
    pool.filter((p) => p !== right),
    `This is the double-angle formula for ${fn === "sin" ? "sine" : "cosine"}: it equals ${fn} ${2 * A}°. Look up the exact value for ${2 * A}°.`,
  );
}

function identCosForms(): Question {
  const forms = ["cos²x − sin²x", "1 − 2 sin²x", "2 cos²x − 1"];
  const wrongForms = ["2 cos x sin x", "cos²x + sin²x", "2 cos x − 1", "1 − 2 cos²x", "sin²x − cos²x"];
  return mc("Which of these is equal to cos 2x?", pick(forms), sample(wrongForms, 4), "Start from cos 2x = cos²x − sin²x. Replace cos²x with 1 − sin²x or sin²x with 1 − cos²x to get the other two forms.");
}

function identities(opts?: GenerateOptions): Question[] {
  return build(
    [
      identPythagorean,
      identPythagorean,
      identSimplify,
      identSimplify,
      identSimplify,
      identNotIdentity,
      identSumDiffExact,
      identSumDiffExact,
      identDoubleAngleValue,
      identDoubleAngleExact,
      [identCosForms, 1, 2],
    ],
    levelOf(opts),
  );
}

// ======================================================================
// Unit 9: Permutations, combinations and the binomial theorem
// ======================================================================

const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));
const perm = (n: number, r: number): number => fact(n) / fact(n - r);
const comb = (n: number, r: number): number => Math.round(fact(n) / (fact(r) * fact(n - r)));

function cntEvaluate(lv: Level): Question {
  const n = randInt(5, lv === 1 ? 8 : 12);
  const r = randInt(2, Math.min(5, n - 1));
  const kind = pick(["P", "C"] as const);
  const ans = kind === "P" ? perm(n, r) : comb(n, r);
  return typed(
    `Evaluate ${kind}(${n}, ${r}).`,
    ans,
    kind === "P" ? `P(n, r) = n! ÷ (n − r)!. Here that's ${n}! ÷ ${n - r}!, which is the product of the ${r} numbers counting down from ${n}.` : `C(n, r) = n! ÷ (r!(n − r)!). It's P(${n}, ${r}) ÷ ${r}!.`,
    { keypad: "number" },
  );
}

function cntWhichFormula(): Question {
  const n = randInt(6, 12);
  const r = randInt(3, 4);
  const kind = pick(["P", "C", "rep"] as const);
  const items = ["students", "players", "volunteers", "finalists"];
  const noun = pick(items);
  const prompt =
    kind === "P"
      ? `From ${n} ${noun}, the top ${r} places are awarded in order (1st, 2nd, 3rd${r === 3 ? "" : ", 4th"}). Which expression counts the possible results?`
      : kind === "C"
        ? `A group of ${r} is chosen from ${n} ${noun} to attend a workshop. Which expression counts the possible groups?`
        : `A ${r}-digit PIN uses the digits 0 to 9, and digits may repeat. Which expression counts the possible PINs?`;
  const ps = kind === "P" ? r : r;
  const rightText = kind === "P" ? `P(${n}, ${ps})` : kind === "C" ? `C(${n}, ${r})` : `10${sup(r)}`;
  const wrong =
    kind === "rep"
      ? [`P(10, ${r})`, `C(10, ${r})`, `${r}${sup(10)}`, `10 × ${r}`]
      : [kind === "P" ? `C(${n}, ${ps})` : `P(${n}, ${r})`, `${n}${sup(kind === "P" ? ps : r)}`, `${n}!`, `${n}! ÷ ${kind === "P" ? ps : r}!`];
  return mc(prompt, rightText, wrong, "Ask whether order matters. If different orders are different outcomes, use a permutation P(n, r). If not, use a combination C(n, r). If repeats are allowed, multiply the number of options at each step.");
}

function cntArrange(lv: Level): Question {
  const kind = pick(["row", "together", "medals", "committee", "officers"] as const);
  if (kind === "row") {
    const n = randInt(4, lv === 1 ? 6 : 8);
    return typed(`In how many different ways can ${n} books be arranged in a row on a shelf?`, fact(n), `Each position has one fewer choice: ${n}! = ${n} × ${n - 1} × … × 1.`, { keypad: "number" });
  }
  if (kind === "together") {
    const n = randInt(5, 7);
    return typed(
      `${n} friends line up for a photo. In how many ways can they line up if two particular friends must stand next to each other?`,
      2 * fact(n - 1),
      `Treat the pair as one block: ${n - 1} items can be arranged in ${n - 1}! ways. The two friends can swap places inside the block, so multiply by 2!.`,
      { keypad: "number" },
    );
  }
  if (kind === "medals") {
    const n = randInt(6, 10);
    return typed(`${n} runners are in a race. In how many ways can gold, silver and bronze medals be awarded?`, perm(n, 3), `Order matters: P(${n}, 3) = ${n} × ${n - 1} × ${n - 2}.`, { keypad: "number" });
  }
  if (kind === "committee") {
    const n = randInt(8, 12);
    const r = randInt(3, 4);
    return typed(`A committee of ${r} is to be chosen from ${n} students. How many different committees are possible?`, comb(n, r), `Order doesn't matter, so use C(${n}, ${r}) = ${n}! ÷ (${r}! × ${n - r}!).`, { keypad: "number" });
  }
  const n = randInt(7, 10);
  return typed(
    `A club of ${n} members needs a president, a vice-president and a treasurer, all different people. How many ways can these roles be filled?`,
    perm(n, 3),
    `Each role is different, so order matters: P(${n}, 3).`,
    { keypad: "number" },
  );
}

function cntRepeated(): Question {
  const words = ["BANANA", "LETTER", "COFFEE", "BALLOON", "SUCCESS", "STATISTICS", "MISSISSIPPI", "MATHEMATICS", "BOOKKEEPER", "TOMORROW"];
  const w = pick(words);
  const counts = new Map<string, number>();
  for (const ch of w) counts.set(ch, (counts.get(ch) ?? 0) + 1);
  const reps = [...counts.values()].filter((c) => c > 1);
  const ans = fact(w.length) / reps.reduce((p, c) => p * fact(c), 1);
  const repText = [...counts.entries()].filter(([, c]) => c > 1).map(([ch, c]) => `${ch} appears ${c} times`).join(", ");
  return typed(
    `How many distinguishable arrangements are there of the letters in ${w}?`,
    ans,
    `Total arrangements ${w.length}! divided by the factorial of each repeated letter's count (${repText}).`,
    { keypad: "number" },
  );
}

function cntAtLeast(): Question {
  const m = randInt(4, 7);
  const w = randInt(3, 6);
  const k = randInt(3, 4);
  if (chance(0.5)) {
    return typed(
      `A team of ${k} is chosen from ${m} boys and ${w} girls. How many teams include at least one girl?`,
      comb(m + w, k) - comb(m, k),
      `Count all teams, then subtract the teams with no girls: C(${m + w}, ${k}) − C(${m}, ${k}).`,
      { keypad: "number" },
    );
  }
  const g = 2;
  return typed(
    `A team of ${k} is chosen from ${m} boys and ${w} girls. How many teams have exactly ${g} girls?`,
    comb(w, g) * comb(m, k - g),
    `Choose the girls and the boys separately and multiply: C(${w}, ${g}) × C(${m}, ${k - g}).`,
    { keypad: "number" },
  );
}

function cntSolveN(lv: Level): Question {
  const n = randInt(4, 12);
  if (lv === 1 || chance(0.5)) {
    return typed(`Solve P(n, 2) = ${perm(n, 2)}.`, n, "P(n, 2) = n(n − 1). Find two consecutive whole numbers with that product.", { keypad: "number" });
  }
  return typed(`Solve C(n, 2) = ${comb(n, 2)}.`, n, "C(n, 2) = n(n − 1) ÷ 2. Multiply the right side by 2 and find two consecutive whole numbers with that product.", { keypad: "number" });
}

function cntIdentity(): Question {
  const n = randInt(7, 12);
  const r = randInt(2, 4);
  if (chance(0.5)) {
    return typed(`If C(${n}, ${r}) = C(${n}, k) and k ≠ ${r}, what is k?`, n - r, "Choosing r items to take is the same as choosing n − r items to leave behind: C(n, r) = C(n, n − r).", { keypad: "number" });
  }
  return mc(`Which single expression equals C(${n}, ${r}) + C(${n}, ${r + 1})?`, `C(${n + 1}, ${r + 1})`, [`C(${n + 1}, ${r})`, `C(${n}, ${2 * r + 1})`, `C(${n + 1}, ${r + 2})`, `C(${n}, ${r + 2})`], "Pascal's identity: C(n, r) + C(n, r + 1) = C(n + 1, r + 1). Two neighbouring entries in a row add to the entry below them.");
}

function binomialCoefficient(lv: Level): Question {
  const n = randInt(4, lv === 1 ? 5 : 7);
  if (lv === 1) {
    const k = randInt(1, n - 1);
    return typed(`What is the coefficient of ${xp(k)} in the expansion of (x + 1)${sup(n)}?`, comb(n, k), `The coefficients come from row ${n} of Pascal's triangle, which is C(${n}, k). Here k = ${k}.`, { keypad: "number" });
  }
  const a = nz(-3, 3);
  const k = randInt(1, n - 1);
  const coeff = comb(n, k) * a ** (n - k);
  return typed(
    `What is the coefficient of ${xp(k)} in the expansion of (x ${a < 0 ? MINUS : "+"} ${Math.abs(a)})${sup(n)}?`,
    coeff,
    `The general term is C(${n}, k) x^k (${num(a)})^(${n} − k). For ${xp(k)}, use k = ${k}: C(${n}, ${k}) × (${num(a)})^${n - k}.`,
  );
}

function binomialGeneral(): Question {
  const a = pick([2, 3]);
  const n = randInt(4, 6);
  const k = randInt(1, n - 1);
  const b = pick([1, -1]);
  const coeff = comb(n, k) * a ** k * b ** (n - k);
  return typed(
    `What is the coefficient of ${xp(k)} in the expansion of (${a}x ${b < 0 ? MINUS : "+"} 1)${sup(n)}?`,
    coeff,
    `The term in ${xp(k)} is C(${n}, ${k}) (${a}x)^${k} (${num(b)})^${n - k}. Don't forget to raise the ${a} to the power ${k} too.`,
  );
}

function binomialFacts(): Question {
  const n = randInt(6, 15);
  const kind = pick(["terms", "sum"] as const);
  if (kind === "terms") return typed(`How many terms are there in the expansion of (x + y)${sup(n)}?`, n + 1, "The powers of x run from n down to 0, so there are n + 1 terms.", { keypad: "number" });
  return typed(`What is the sum of the coefficients in the expansion of (x + 1)${sup(n)}? (Hint: let x = 1.)`, 2 ** n, "Substitute x = 1: every x^k becomes 1, leaving the sum of the coefficients, which is 2^n.", { keypad: "number" });
}

function counting(opts?: GenerateOptions): Question[] {
  return build(
    [cntEvaluate, cntWhichFormula, cntArrange, cntArrange, [cntRepeated, 2, 3], cntAtLeast, cntSolveN, cntIdentity, binomialCoefficient, binomialCoefficient, [binomialGeneral, 2, 3], binomialFacts],
    levelOf(opts),
  );
}

// ======================================================================
// Unit 10: Sequences and series
// ======================================================================

/** "3 + 5 − 7": terms joined with the sign of each term shown as an operator. */
function joinTerms(ts: number[]): string {
  return ts.map((t, i) => (i === 0 ? num(t) : t < 0 ? ` ${MINUS} ${-t}` : ` + ${t}`)).join("");
}

function seqArithTerm(lv: Level): Question {
  const a = randInt(-8, 20);
  const d = nz(lv === 1 ? 2 : -9, 9);
  const n = randInt(8, lv === 3 ? 40 : 20);
  const terms = [a, a + d, a + 2 * d, a + 3 * d].map(num).join(", ");
  return typed(`In the arithmetic sequence ${terms}, …, what is term number ${n}?`, a + (n - 1) * d, `Use t_n = a + (n − 1)d with a = ${num(a)} and d = ${num(d)}.`);
}

function seqArithFromTerms(): Question {
  const a = randInt(-5, 15);
  const d = nz(-6, 7);
  const p = randInt(3, 6);
  const q = randInt(p + 3, p + 8);
  const n = q + randInt(4, 10);
  return typed(
    `In an arithmetic sequence, t${sub(p)} = ${num(a + (p - 1) * d)} and t${sub(q)} = ${num(a + (q - 1) * d)}. Find t${sub(n)}.`,
    a + (n - 1) * d,
    `The difference between terms ${p} and ${q} is ${q - p} steps of d. Find d = (t${sub(q)} − t${sub(p)}) ÷ ${q - p}, then continue to term ${n}.`,
  );
}

function seqArithSum(lv: Level): Question {
  const a = randInt(-5, 20);
  const d = nz(-5, 8);
  const n = randInt(6, lv === 1 ? 12 : 30);
  const s = (n * (2 * a + (n - 1) * d)) / 2;
  return typed(`Find the sum of the first ${n} terms of the arithmetic series ${joinTerms([a, a + d, a + 2 * d])} + …`, s, `Use S_n = (n/2)(2a + (n − 1)d) with a = ${num(a)}, d = ${num(d)}, n = ${n}.`);
}

function seqGeoTerm(lv: Level): Question {
  const a = pick([1, 2, 3, 4, 5, 6]);
  const r = pick(lv === 1 ? [2, 3] : [2, 3, 4, -2, -3]);
  const n = randInt(5, lv === 3 ? 8 : 7);
  const t = [a, a * r, a * r * r, a * r ** 3].map(num).join(", ");
  return typed(`In the geometric sequence ${t}, …, what is term number ${n}?`, a * r ** (n - 1), `Use t_n = a·r^(n − 1) with a = ${a} and r = ${num(r)}.`);
}

function seqGeoSum(lv: Level): Question {
  const a = pick([1, 2, 3, 5]);
  const r = pick(lv === 1 ? [2, 3] : [2, 3, 4, -2]);
  const n = randInt(4, lv === 3 ? 8 : 6);
  const s = (a * (r ** n - 1)) / (r - 1);
  return typed(`Find the sum of the first ${n} terms of the geometric series ${joinTerms([a, a * r, a * r * r])} + …`, s, `Use S_n = a(r^n − 1) ÷ (r − 1) with a = ${a}, r = ${num(r)}, n = ${n}.`);
}

function seqInfinite(): Question {
  const rows: [number, number][] = [[1, 2], [1, 3], [2, 3], [3, 4], [4, 5], [-1, 2], [1, 4]];
  const [n, d] = pick(rows);
  const t = pick([1, 2]);
  const a = d * d * (d - n) * t;
  const sum = (a * d) / (d - n);
  const terms = joinTerms([a, (a * n) / d, (a * n * n) / (d * d)]);
  return typed(
    `Find the sum of the infinite geometric series ${terms} + …`,
    sum,
    `Since |r| < 1, the series converges to S∞ = a ÷ (1 − r). Find r = (second term) ÷ (first term) = ${frac(n, d)}, then divide ${a} by 1 − r.`,
    { keypad: "number" },
  );
}

function seqConverge(): Question {
  const kind = pick(["conv", "div"] as const);
  const rows: [number, number][] = kind === "conv" ? [[1, 2], [2, 3], [3, 4], [1, 3], [-1, 2], [-2, 3]] : [[3, 2], [2, 1], [5, 3], [-3, 2], [-2, 1], [4, 3]];
  const [n, d] = pick(rows);
  const a = d * d * pick([1, 2]);
  const terms = joinTerms([a, (a * n) / d, (a * n * n) / (d * d)]);
  return mc(
    `Does the infinite geometric series ${terms} + … have a finite sum?`,
    kind === "conv" ? `Yes: r = ${frac(n, d)}, and |r| < 1` : `No: r = ${frac(n, d)}, and |r| ≥ 1`,
    [kind === "conv" ? `No: r = ${frac(n, d)}, and |r| ≥ 1` : `Yes: r = ${frac(n, d)}, and |r| < 1`, "Yes: every infinite series has a finite sum", "No: the terms are getting smaller"].filter((s) => !(kind === "div" && s.includes("getting smaller")) ),
    "An infinite geometric series has a finite sum only when |r| < 1. Find r by dividing a term by the one before it.",
  );
}

function seqClassify(): Question {
  const type = pick(["arith", "geo", "neither"] as const);
  if (type === "arith") {
    const a = randInt(-3, 10);
    const d = nz(-6, 7);
    const t = [0, 1, 2, 3].map((i) => num(a + i * d)).join(", ");
    return mc(`What type of sequence is ${t}, …?`, `Arithmetic, with d = ${num(d)}`, [`Geometric, with r = ${num(d)}`, "Geometric, with r = " + `${num(d + 1)}`, "Neither arithmetic nor geometric", `Arithmetic, with d = ${num(-d)}`], "Check the differences between consecutive terms. A constant difference means arithmetic.");
  }
  if (type === "geo") {
    const a = pick([1, 2, 3, 5]);
    const r = pick([2, 3, 4, -2, -3]);
    const t = [0, 1, 2, 3].map((i) => num(a * r ** i)).join(", ");
    return mc(`What type of sequence is ${t}, …?`, `Geometric, with r = ${num(r)}`, [`Arithmetic, with d = ${num(r)}`, "Neither arithmetic nor geometric", `Geometric, with r = ${num(-r)}`, `Arithmetic, with d = ${num(a * r - a)}`], "Check the ratios between consecutive terms. A constant ratio means geometric.");
  }
  const kind = pick(["sq", "fib"] as const);
  const t = kind === "sq" ? "1, 4, 9, 16" : "1, 1, 2, 3, 5";
  return mc(`What type of sequence is ${t}, …?`, "Neither arithmetic nor geometric", ["Arithmetic", "Geometric"], "Neither the differences nor the ratios between consecutive terms are constant.");
}

function seqNumTerms(): Question {
  if (chance(0.5)) {
    const a = randInt(-5, 10);
    const d = pick([2, 3, 4, 5, 7]);
    const n = randInt(12, 40);
    const last = a + (n - 1) * d;
    return typed(`How many terms are in the arithmetic sequence ${num(a)}, ${num(a + d)}, ${num(a + 2 * d)}, …, ${num(last)}?`, n, `Solve ${num(last)} = ${num(a)} + (n − 1)(${d}) for n.`, { keypad: "number" });
  }
  const a = pick([1, 2, 3, 5]);
  const r = pick([2, 3]);
  const n = randInt(6, r === 2 ? 11 : 8);
  return typed(`How many terms are in the geometric sequence ${a}, ${a * r}, ${a * r * r}, …, ${a * r ** (n - 1)}?`, n, `Solve ${a}·${r}^(n − 1) = ${a * r ** (n - 1)}: ${r}^(n − 1) = ${r ** (n - 1)}, so n − 1 = ${n - 1}.`, { keypad: "number" });
}

function seqSigma(): Question {
  const a = nz(-3, 5);
  const b = randInt(-4, 6);
  const n = randInt(4, 8);
  let s = 0;
  for (let k = 1; k <= n; k++) s += a * k + b;
  return typed(`Evaluate Σ (${poly([a, b]).replace(/x/g, "k")}) for k = 1 to ${n}. That is, add the terms for k = 1, 2, …, ${n}.`, s, `Substitute k = 1, 2, …, ${n} and add, or use the arithmetic series formula with first term ${num(a + b)} and common difference ${num(a)}.`);
}

function seqApplication(): Question {
  const kind = pick(["savings", "seats", "bounce"] as const);
  if (kind === "savings") {
    const a = pick([20, 25, 30, 40, 50]);
    const d = pick([5, 10]);
    const n = randInt(8, 20);
    return typed(`Mina saves $${a} in week 1, and each week saves $${d} more than the week before. What is her total savings after ${n} weeks, in dollars?`, (n * (2 * a + (n - 1) * d)) / 2, `This is an arithmetic series with a = ${a}, d = ${d} and n = ${n}: S_n = (n/2)(2a + (n − 1)d).`, { keypad: "number", suffix: "dollars" });
  }
  if (kind === "seats") {
    const a = pick([10, 12, 14, 16]);
    const d = pick([2, 3, 4]);
    const n = randInt(10, 25);
    return typed(`A theatre has ${a} seats in the first row, and each row has ${d} more seats than the row in front of it. How many seats are there in ${n} rows?`, (n * (2 * a + (n - 1) * d)) / 2, `Arithmetic series with a = ${a}, d = ${d}, n = ${n}.`, { keypad: "number" });
  }
  const h = pick([16, 32, 48, 64, 80, 96]);
  const n = randInt(3, 5);
  return typed(
    `A ball is dropped from ${h} cm and rebounds to half of its previous height each time. How high, in cm, is the rebound after bounce number ${n}?`,
    h / 2 ** n,
    `The rebound heights form a geometric sequence with r = 1/2. After bounce ${n}, the height is ${h} × (1/2)^${n}.`,
    { keypad: "decimal", suffix: "cm" },
  );
}

function sequences(opts?: GenerateOptions): Question[] {
  return build(
    [seqArithTerm, [seqArithFromTerms, 2, 3], seqArithSum, seqGeoTerm, seqGeoSum, [seqInfinite, 2, 3], seqConverge, seqClassify, seqNumTerms, seqSigma, seqApplication],
    levelOf(opts),
  );
}

// ======================================================================
// The course
// ======================================================================

export const course: Course = {
  grade: "12",
  subject: "math",
  bigIdeas: {
    "ca-bc": [
      "Transformations of functions help us understand how the graph and equation of a function are related, and how one function can be built from another.",
      "Operations on functions, including composition, and inverse functions describe how quantities depend on one another, and can be undone.",
      "Polynomial, radical and rational functions model many situations, and their zeros, end behaviour and asymptotes describe how they behave.",
      "Exponential and logarithmic functions are inverses; together they model growth, decay and quantities that span many orders of magnitude.",
      "Trigonometric functions model periodic phenomena, and the unit circle connects angles, coordinates and exact values.",
      "Trigonometric identities show that expressions that look different can be equivalent, and are tools for simplifying and solving.",
      "Counting methods (permutations, combinations and the binomial theorem) let us count arrangements and selections without listing them.",
      "Sequences and series describe patterns of change, with arithmetic and geometric patterns modelling many real situations.",
    ],
  },
  units: [
    {
      id: "transformations",
      title: "Transforming Graphs",
      emoji: "📈",
      blurb: "Shift, flip and stretch graphs",
      parentNote:
        "Pre-calculus 12 is the academic pathway for students heading to science, engineering, commerce or other fields that need calculus. (Foundations of Mathematics 12, Calculus 12 and the Workplace pathways are not covered here.) This unit covers how translations, reflections and stretches change a function's graph and equation, including combinations of transformations, images of points, and changes to domain and range.",
      standards: {
        "ca-bc": "Transformations of functions: translations, reflections and stretches, compositions of transformations, and their effects on graphs, equations, domain and range",
      },
      generate: transformations,
    },
    {
      id: "operations-inverses",
      title: "Combining & Inverting Functions",
      emoji: "🔁",
      blurb: "Sums, products, compositions, inverses",
      parentNote:
        "Adding, subtracting, multiplying, dividing and composing functions, finding domains of combined functions, and working with inverse functions, including the horizontal line test and the inverse of a linear or quadratic function.",
      standards: {
        "ca-bc": "Operations on functions: sum, difference, product, quotient and composition; inverses of functions and the horizontal line test",
      },
      generate: operations,
    },
    {
      id: "polynomials",
      title: "Polynomial Functions",
      emoji: "〰️",
      blurb: "Zeros, factors and end behaviour",
      parentNote:
        "Reading polynomial graphs and equations: end behaviour, zeros and multiplicity, and using the remainder and factor theorems, synthetic division and the rational zero theorem to factor and analyze polynomials.",
      standards: {
        "ca-bc": "Polynomial functions: degree and end behaviour, zeros and multiplicity, remainder and factor theorems, polynomial division, rational zero theorem",
      },
      generate: polynomials,
    },
    {
      id: "radical-rational",
      title: "Radicals & Rationals",
      emoji: "🧮",
      blurb: "Domains, asymptotes and holes",
      parentNote:
        "Radical functions (domain, range, graphs and solving radical equations including extraneous roots) and rational functions (asymptotes, holes, simplifying and solving rational equations).",
      standards: {
        "ca-bc": "Radical functions and equations; rational functions: asymptotes, non-permissible values, holes, and solving rational equations",
      },
      generate: radicalRational,
    },
    {
      id: "exponentials",
      title: "Exponential Growth & Decay",
      emoji: "🦠",
      blurb: "Half-life, compound growth, graphs",
      parentNote:
        "Exponential functions and their graphs, asymptotes and intercepts, growth and decay models (doubling time, half-life, compound interest), and solving exponential equations with common bases.",
      standards: {
        "ca-bc": "Exponential functions: graphs and transformations, growth and decay models, compound interest, and solving exponential equations with a common base",
      },
      generate: exponentials,
    },
    {
      id: "logarithms",
      title: "Logarithms",
      emoji: "🔢",
      blurb: "The inverse of exponents",
      parentNote:
        "Logarithms as the inverse of exponentials: evaluating, converting between forms, the log laws and change of base, solving exponential and logarithmic equations, and applications such as pH, earthquakes and decibels.",
      standards: {
        "ca-bc": "Logarithmic functions: definition, laws of logarithms, change of base, solving exponential and logarithmic equations, and applications",
      },
      generate: logarithms,
    },
    {
      id: "trig-functions",
      title: "Trig Functions & the Unit Circle",
      emoji: "🌊",
      blurb: "Radians, exact values, sine waves",
      parentNote:
        "Angles in degrees and radians, the unit circle and exact values of special angles, and graphs of sine and cosine with amplitude, period, phase shift and midline, with applications such as tides and arc length.",
      standards: {
        "ca-bc": "Trigonometry: angles in radians and degrees, unit circle and exact values, graphs of sine and cosine with amplitude, period, phase shift and vertical displacement, solving trigonometric equations",
      },
      generate: trigFunctions,
    },
    {
      id: "trig-identities",
      title: "Trig Identities",
      emoji: "🧩",
      blurb: "Same value, different disguise",
      parentNote:
        "Simplifying trigonometric expressions with the Pythagorean, quotient and reciprocal identities, and using the sum, difference and double-angle formulas to find exact values.",
      standards: {
        "ca-bc": "Trigonometric identities: reciprocal, quotient, Pythagorean, sum and difference, and double-angle identities",
      },
      generate: identities,
    },
    {
      id: "counting-binomial",
      title: "Counting & the Binomial Theorem",
      emoji: "🎲",
      blurb: "Arrangements, choices, expansions",
      parentNote:
        "Counting arrangements (permutations) and selections (combinations), including repeated items and 'at least one' problems, and using the binomial theorem and Pascal's triangle to expand powers of binomials.",
      standards: {
        "ca-bc": "Permutations and combinations; the binomial theorem and Pascal's triangle",
      },
      generate: counting,
    },
    {
      id: "sequences-series",
      title: "Sequences & Series",
      emoji: "🪜",
      blurb: "Patterns that add up",
      parentNote:
        "Arithmetic and geometric sequences and series: finding terms, sums, the number of terms, and the sum of an infinite geometric series when it converges.",
      standards: {
        "ca-bc": "Arithmetic and geometric sequences and series, including infinite geometric series",
      },
      generate: sequences,
    },
  ],
};
