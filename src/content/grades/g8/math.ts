import { chance, pick, randInt, sample, shuffle, textChoice } from "../../random";
import type { ChoiceQuestion, Course, GenerateOptions, InputQuestion, OrderQuestion, Question, SortQuestion, Visual } from "../../types";

// Grade 8 maths for the "big" age band. Anything needing exact decimal maths is built
// from whole-number units (cents, hundredths) and only turned into text at the end, so
// floating-point noise never reaches a student. Every answer is computed from the same
// numbers that appear in the prompt.

type Level = 1 | 2 | 3;
const levelOf = (opts?: GenerateOptions): Level => opts?.difficulty ?? 2;

// ---------- Shared helpers ----------

function fmt(x: number): string {
  const v = Number(x.toFixed(6));
  return String(v === 0 ? 0 : v);
}
function br(x: number): string {
  return x < 0 ? `(${fmt(x)})` : fmt(x);
}
const money = (cents: number): string => `$${(cents / 100).toFixed(2)}`;
const dollars = (cents: number): string => (cents / 100).toFixed(2);
const range = (a: number, b: number): number[] => Array.from({ length: b - a + 1 }, (_, i) => a + i);
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
const isSquare = (n: number): boolean => Number.isInteger(Math.sqrt(n));
const isCube = (n: number): boolean => Math.round(Math.cbrt(n)) ** 3 === n;

/** "3x + 2", "-2x − 5", "x". */
function lin(m: number, b: number, v = "x"): string {
  const term = m === 1 ? v : m === -1 ? `-${v}` : `${m}${v}`;
  if (b === 0) return term;
  return `${term} ${b < 0 ? "−" : "+"} ${Math.abs(b)}`;
}

interface NumOpts {
  unit?: string;
  format?: (n: number) => string;
  step?: number;
  min?: number;
  count?: number;
}

/** Multiple choice with number answers; clashing wrong answers are skipped and gaps filled with nearby values. */
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

/** Multiple choice from text labels: duplicates are dropped and `fill` supplies spares. */
function strQ(prompt: string, right: string, wrong: string[], hint: string, visual?: Visual, fill?: () => string): ChoiceQuestion {
  const used = new Set([right]);
  const out: string[] = [];
  for (const w of wrong) {
    if (!used.has(w) && out.length < 3) {
      used.add(w);
      out.push(w);
    }
  }
  for (let i = 0; i < 80 && out.length < 3 && fill; i++) {
    const w = fill();
    if (!used.has(w)) {
      used.add(w);
      out.push(w);
    }
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
  const inDollars = extra.suffix === "$";
  const q: InputQuestion = { kind: "input", prompt: inDollars ? `${prompt} (Answer in dollars.)` : prompt, hint, answer, keypad };
  const accept = [...new Set(extra.accept ?? [])].filter((a) => a !== answer);
  if (accept.length) q.accept = accept;
  if (extra.suffix && !inDollars) q.suffix = extra.suffix;
  if (extra.visual) q.visual = extra.visual;
  return q;
}

/** Typed dollars from cents ("12.50"; whole-dollar and one-decimal forms are also accepted). */
function typedMoney(prompt: string, cents: number, hint: string, visual?: Visual): InputQuestion {
  return typed(prompt, dollars(cents), hint, "decimal", {
    accept: [fmt(cents / 100), (cents / 100).toFixed(1)],
    suffix: "$",
    visual,
  });
}

/** Typed fraction in lowest terms; unreduced forms are accepted too. */
function typedFraction(prompt: string, n: number, d: number, hint: string, visual?: Visual): InputQuestion {
  const g = gcd(n, d);
  const rn = n / g;
  const rd = d / g;
  const answer = rd === 1 ? String(rn) : `${rn}/${rd}`;
  const accept: string[] = [];
  if (rd !== 1) for (let k = 2; k <= 6; k++) accept.push(`${rn * k}/${rd * k}`);
  return typed(prompt, answer, hint, "fraction", { accept: accept.filter((a) => a.length <= 9), visual });
}

/** Build `n` questions from a set of makers, avoiding repeated prompts. */
function build(makers: (() => Question)[], n = 8): Question[] {
  const order = shuffle(makers);
  const out: Question[] = [];
  const seen = new Set<string>();
  for (let i = 0; out.length < n && i < n * 6; i++) {
    const q = order[i % order.length]();
    if (seen.has(q.prompt) && i < n * 5) continue;
    seen.add(q.prompt);
    out.push(q);
  }
  return out;
}

interface Concept {
  levels: Level[];
  prompt: string;
  right: string;
  wrong: string[];
  hint: string;
  visual?: Visual;
}
function conceptQ(bank: Concept[], d: Level): ChoiceQuestion {
  const pool = bank.filter((b) => b.levels.includes(d));
  const c = pick(pool.length ? pool : bank);
  return textChoice(c.prompt, c.right, sample(c.wrong, Math.min(4, c.wrong.length)), c.hint, c.visual);
}

// ---------- 1. Squares and Roots ----------

function squaresRoots(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const maxN = d === 1 ? 12 : d === 2 ? 20 : 30;
  const maxC = d === 1 ? 6 : d === 2 ? 10 : 12;
  const makers: (() => Question)[] = [
    () => {
      const n = randInt(2, maxN);
      return typed(
        `What is √${n * n}?`,
        String(n),
        `Find the number that multiplies by itself to make ${n * n}. ${n} × ${n} = ${n * n}, so √${n * n} = ${n}.`,
        "number",
        { visual: { type: "equation", text: `√${n * n} = ?` } },
      );
    },
    () => {
      const n = randInt(3, maxN);
      return typed(`What is ${n}²?`, String(n * n), `${n}² means ${n} × ${n}, which is ${n * n}.`, "number", {
        visual: { type: "equation", text: `${n}² = ?` },
      });
    },
    () => {
      const n = randInt(2, maxC);
      return typed(
        `What is ∛${n ** 3}?`,
        String(n),
        `Find the number that multiplies by itself three times to make ${n ** 3}. ${n} × ${n} × ${n} = ${n ** 3}, so ∛${n ** 3} = ${n}.`,
        "number",
        { visual: { type: "equation", text: `∛${n ** 3} = ?` } },
      );
    },
    () => {
      const n = randInt(2, maxC);
      return numQ(
        `What is ${n}³?`,
        n ** 3,
        [n * n * 3, n * 3, n ** 3 + n],
        `${n}³ means ${n} × ${n} × ${n}. ${n} × ${n} = ${n * n}, then ${n * n} × ${n} = ${n ** 3}. It is not ${n} × 3.`,
        undefined,
        { min: 1 },
      );
    },
    () => {
      const n = randInt(4, maxN);
      const near = range(n * n - n, n * n + n).filter((x) => !isSquare(x) && x > 1);
      return strQ(
        "Which number is a perfect square?",
        String(n * n),
        sample(near, 3).map(String),
        `A perfect square is a whole number times itself. Try √ of each choice: only √${n * n} = ${n} is a whole number.`,
      );
    },
    () => {
      const n = randInt(4, maxN);
      const near = range(n * n - n, n * n + n).filter((x) => !isSquare(x) && x > 1);
      const squares = sample(range(2, maxN).filter((k) => k !== n), 3).map((k) => k * k);
      return strQ(
        "Which number is NOT a perfect square?",
        String(pick(near)),
        squares.map(String),
        "Check each number: a perfect square has a whole-number square root. Three of these do, and one falls between two squares.",
      );
    },
    () => {
      const a = randInt(3, d === 1 ? 9 : d === 2 ? 14 : 20);
      const n = a * a + randInt(1, 2 * a);
      return strQ(
        `√${n} lies between which two consecutive whole numbers?`,
        `${a} and ${a + 1}`,
        [`${a - 1} and ${a}`, `${a + 1} and ${a + 2}`, `${a - 2} and ${a - 1}`, `${a + 2} and ${a + 3}`],
        `Find the perfect squares on each side of ${n}: ${a}² = ${a * a} and ${a + 1}² = ${(a + 1) ** 2}. Since ${a * a} < ${n} < ${(a + 1) ** 2}, the root is between ${a} and ${a + 1}.`,
      );
    },
    () => {
      const a = randInt(4, d === 1 ? 9 : 15);
      const n = a * a + randInt(1, 2 * a);
      const r = Math.round(Math.sqrt(n));
      return numQ(
        `What is √${n} to the nearest whole number?`,
        r,
        [a, a + 1, r + 1, r - 1],
        `√${n} is between ${a} and ${a + 1}. Compare ${n} with ${a}² = ${a * a} and ${(a + 1) ** 2}: it is closer to ${r === a ? a * a : (a + 1) ** 2}, so the answer is ${r}.`,
        undefined,
        { min: 1 },
      );
    },
    () => {
      const n = randInt(3, d === 1 ? 12 : maxN);
      const item = pick(["garden", "patio", "mat", "playing field"]);
      return typed(
        `A square ${item} has an area of ${n * n} m². What is the length of one side?`,
        String(n),
        `Area = side × side, so the side is √${n * n} = ${n}.`,
        "number",
        { suffix: "m" },
      );
    },
    () => {
      const n = randInt(2, maxC);
      return typed(
        `A cube-shaped box has a volume of ${n ** 3} cm³. How long is each edge?`,
        String(n),
        `Volume of a cube = edge × edge × edge, so the edge is ∛${n ** 3} = ${n}.`,
        "number",
        { suffix: "cm" },
      );
    },
    () => {
      const side = randInt(2, maxN);
      return typed(
        `The perimeter of a square is ${side * 4} cm. What is its area?`,
        String(side * side),
        `Each side is ${side * 4} ÷ 4 = ${side} cm. Area = ${side} × ${side} = ${side * side}.`,
        "number",
        { suffix: "cm²" },
      );
    },
    () => {
      // Order mixed roots and decimals.
      for (let tries = 0; tries < 100; tries++) {
        const items: { label: string; v: number }[] = [];
        const sqNon = sample(range(5, 60).filter((x) => !isSquare(x)), 2);
        sqNon.forEach((x) => items.push({ label: `√${x}`, v: Math.sqrt(x) }));
        items.push({ label: String(randInt(2, 8)), v: 0 });
        items[2].v = Number(items[2].label);
        const dec = randInt(21, 79) / 10;
        items.push({ label: fmt(dec), v: dec });
        const sorted = [...items].sort((a, b) => a.v - b.v);
        let ok = true;
        for (let i = 1; i < sorted.length; i++) if (sorted[i].v - sorted[i - 1].v < 0.15) ok = false;
        if (!ok) continue;
        const q: OrderQuestion = {
          kind: "order",
          prompt: "Put these numbers in order from least to greatest.",
          hint: "Estimate each root using the perfect squares on either side, then compare with the other numbers on a number line.",
          items: sorted.map((it, i) => ({ id: `o${i}`, label: it.label })),
        };
        return q;
      }
      return numQ("What is √81?", 9, [8, 7, 10], "9 × 9 = 81.");
    },
    () => {
      const squares = range(2, 16).map((k) => k * k).filter((x) => !isCube(x));
      const cubes = range(2, 10).map((k) => k ** 3).filter((x) => !isSquare(x));
      const neither = range(10, 200).filter((x) => !isSquare(x) && !isCube(x));
      const sq = sample(squares, 2);
      const cu = sample(cubes, 2);
      const ne = sample(neither, 2);
      const q: SortQuestion = {
        kind: "sort",
        prompt: "Sort each number: perfect square, perfect cube, or neither.",
        hint: "A perfect square is n × n and a perfect cube is n × n × n. Test the roots: √ for squares, ∛ for cubes.",
        bins: [
          { id: "sq", label: "Perfect square", emoji: "⬛" },
          { id: "cu", label: "Perfect cube", emoji: "🧊" },
          { id: "ne", label: "Neither", emoji: "❔" },
        ],
        items: shuffle([
          ...sq.map((x) => ({ label: String(x), emoji: "🔢", bin: "sq" })),
          ...cu.map((x) => ({ label: String(x), emoji: "🔢", bin: "cu" })),
          ...ne.map((x) => ({ label: String(x), emoji: "🔢", bin: "ne" })),
        ]).map((it, i) => ({ id: `s${i}`, ...it })),
      };
      return q;
    },
  ];
  return build(makers);
}

// ---------- 2. Fractions and Mixed Numbers ----------

interface Fr {
  n: number;
  d: number;
}
const F = (n: number, d: number): Fr => {
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
};
const fAdd = (a: Fr, b: Fr): Fr => F(a.n * b.d + b.n * a.d, a.d * b.d);
const fSub = (a: Fr, b: Fr): Fr => F(a.n * b.d - b.n * a.d, a.d * b.d);
const fMul = (a: Fr, b: Fr): Fr => F(a.n * b.n, a.d * b.d);
const fDiv = (a: Fr, b: Fr): Fr => F(a.n * b.d, a.d * b.n);
const fVal = (a: Fr): number => a.n / a.d;
/** Mixed-number text: "2 3/4", "3/4", "5". */
function fMixed(f: Fr): string {
  if (f.d === 1) return String(f.n);
  const w = Math.floor(f.n / f.d);
  const r = f.n - w * f.d;
  return w ? `${w} ${r}/${f.d}` : `${r}/${f.d}`;
}
const fImp = (f: Fr): string => (f.d === 1 ? String(f.n) : `${f.n}/${f.d}`);
/** A mixed number as a (non-reduced) improper fraction. */
const mixedFr = (w: number, n: number, dd: number): Fr => ({ n: w * dd + n, d: dd });
const mixedText = (w: number, n: number, dd: number): string => `${w} ${n}/${dd}`;

function fracQ(prompt: string, ans: Fr, wrong: Fr[], hint: string, visual?: Visual): ChoiceQuestion {
  const fill = (): string => {
    const k = randInt(1, 4);
    const r = F(ans.n + (chance(0.5) ? k : -k), ans.d);
    return r.n > 0 ? fMixed(r) : fMixed(F(ans.n + k, ans.d));
  };
  return strQ(prompt, fMixed(ans), wrong.filter((w) => w.n > 0).map(fMixed), hint, visual, fill);
}

function fReduceText(n: number, dd: number): string {
  const f = F(n, dd);
  return f.d === 1 ? String(f.n) : `${f.n}/${f.d}`;
}

function randFr(dens: number[]): Fr {
  const dd = pick(dens);
  return { n: randInt(1, dd - 1), d: dd };
}

function fractionOps(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const dens = d === 1 ? [2, 3, 4, 5, 6, 8, 10] : [2, 3, 4, 5, 6, 8, 10, 12];
  const text = (f: Fr) => `${f.n}/${f.d}`;

  const addSub = (): Question => {
    let a: Fr, b: Fr;
    if (d === 1) {
      const dd = pick(dens);
      a = { n: randInt(1, dd - 1), d: dd };
      b = { n: randInt(1, dd - 1), d: dd };
    } else {
      do {
        a = randFr(dens);
        b = randFr(dens);
      } while (a.d === b.d);
    }
    const add = chance(0.5);
    if (!add && fVal(a) < fVal(b)) [a, b] = [b, a];
    if (!add && fVal(a) === fVal(b)) a = { n: a.n + a.d, d: a.d };
    const ans = add ? fAdd(a, b) : fSub(a, b);
    const naive = add ? F(a.n + b.n, a.d + b.d) : F(Math.abs(a.n - b.n) || 1, Math.abs(a.d - b.d) || a.d + b.d);
    const l = (a.d * b.d) / gcd(a.d, b.d);
    return fracQ(
      `What is ${text(a)} ${add ? "+" : "−"} ${text(b)}?`,
      ans,
      [naive, F(ans.n + 1, ans.d), F(Math.max(1, ans.n - 1), ans.d), add ? fSub(a, b) : fAdd(a, b)],
      `Write both fractions with a common denominator of ${l}: ${(l / a.d) * a.n}/${l} ${add ? "+" : "−"} ${(l / b.d) * b.n}/${l}. Then ${add ? "add" : "subtract"} the numerators only: ${fImp(ans)}${ans.d > 1 && ans.n > ans.d ? ` = ${fMixed(ans)}` : ""}. Never add the denominators.`,
    );
  };

  const mixedAddSub = (): Question => {
    const dd1 = pick([2, 3, 4, 5, 6, 8]);
    let dd2 = pick([2, 3, 4, 5, 6, 8]);
    if (d === 2 && chance(0.5)) dd2 = dd1;
    const a = mixedFr(randInt(1, 5), randInt(1, dd1 - 1), dd1);
    const b = mixedFr(randInt(1, 4), randInt(1, dd2 - 1), dd2);
    const add = chance(0.5);
    const [big, small] = fVal(a) >= fVal(b) ? [a, b] : [b, a];
    const ans = add ? fAdd(a, b) : fSub(big, small);
    const x = add ? a : big;
    const y = add ? b : small;
    const wholeX = Math.floor(x.n / x.d);
    const wholeY = Math.floor(y.n / y.d);
    const wrongWhole = add ? F(ans.n + ans.d, ans.d) : F(ans.n + ans.d, ans.d);
    return fracQ(
      `What is ${mixedText(wholeX, x.n - wholeX * x.d, x.d)} ${add ? "+" : "−"} ${mixedText(wholeY, y.n - wholeY * y.d, y.d)}?`,
      ans,
      [wrongWhole, F(ans.n - ans.d > 0 ? ans.n - ans.d : ans.n + 1, ans.d), F(ans.n + 1, ans.d), F(Math.max(1, ans.n - 1), ans.d)],
      `Change both to improper fractions (${fImp(F(x.n, x.d))} and ${fImp(F(y.n, y.d))}), use a common denominator, ${add ? "add" : "subtract"}, then write the answer as a mixed number: ${fMixed(ans)}.`,
    );
  };

  const multiply = (): Question => {
    const a = randFr(dens);
    const b = randFr(dens);
    const ans = fMul(a, b);
    return d === 1 || chance(0.5)
      ? typedFraction(
          `What is ${text(a)} × ${text(b)}? Give your answer in lowest terms.`,
          a.n * b.n,
          a.d * b.d,
          `Multiply the numerators and the denominators: (${a.n} × ${b.n}) / (${a.d} × ${b.d}) = ${a.n * b.n}/${a.d * b.d}. Then reduce to ${fImp(ans)}.`,
        )
      : fracQ(
          `What is ${text(a)} × ${text(b)}?`,
          ans,
          [fAdd(a, b), F(a.n * b.d, a.d * b.n), F(a.n * b.n + 1, a.d * b.d), F(a.n + b.n, a.d * b.d)],
          `Multiply the numerators and the denominators: ${a.n * b.n}/${a.d * b.d}${a.n * b.n === ans.n ? "" : ` = ${fImp(ans)} in lowest terms`}.`,
        );
  };

  const divide = (): Question => {
    let a: Fr, b: Fr;
    do {
      a = randFr(dens);
      b = randFr(dens);
    } while (a.n * b.d === a.d * b.n);
    const ans = fDiv(a, b);
    return chance(0.5)
      ? typedFraction(
          `What is ${text(a)} ÷ ${text(b)}? Give your answer in lowest terms.`,
          a.n * b.d,
          a.d * b.n,
          `Dividing by a fraction is the same as multiplying by its reciprocal: ${text(a)} × ${b.d}/${b.n} = ${a.n * b.d}/${a.d * b.n} = ${fImp(ans)}.`,
        )
      : fracQ(
          `What is ${text(a)} ÷ ${text(b)}?`,
          ans,
          [fMul(a, b), F(a.d * b.n, a.n * b.d), F(a.n * b.n, a.d * b.d + 1), F(ans.n + 1, ans.d)],
          `Keep the first fraction, change ÷ to ×, and flip the second: ${text(a)} × ${b.d}/${b.n} = ${fImp(ans)} = ${fMixed(ans)}.`,
        );
  };

  const mixedMultiply = (): Question => {
    const a = mixedFr(randInt(1, 3), randInt(1, 3), 4);
    const b = mixedFr(randInt(1, 3), pick([1, 2]), 3);
    const ans = fMul(a, b);
    return fracQ(
      `What is ${mixedText(Math.floor(a.n / a.d), a.n % a.d, a.d)} × ${mixedText(Math.floor(b.n / b.d), b.n % b.d, b.d)}?`,
      ans,
      [
        F(Math.floor(a.n / a.d) * Math.floor(b.n / b.d) * ans.d + (a.n % a.d) * (b.n % b.d), ans.d),
        F(ans.n + 1, ans.d),
        F(Math.max(1, ans.n - ans.d), ans.d),
        fAdd(a, b),
      ],
      `Write each mixed number as an improper fraction: ${a.n}/${a.d} × ${b.n}/${b.d} = ${a.n * b.n}/${a.d * b.d} = ${fMixed(ans)}. Multiplying the whole parts and fraction parts separately does not work.`,
    );
  };

  const recipe = (): Question => {
    const cups = F(randInt(1, 3) * 4 + randInt(1, 3), 4);
    const batches = pick([2, 3, 4, 5]);
    const ans = fMul(cups, { n: batches, d: 1 });
    const item = pick(["flour", "oats", "milk", "rice"]);
    return fracQ(
      `A recipe needs ${fMixed(cups)} cups of ${item}. How many cups are needed for ${batches} batches?`,
      ans,
      [F(ans.n + 1, ans.d), fAdd(cups, { n: batches, d: 1 }), F(Math.max(1, ans.n - 1), ans.d), F(ans.n + ans.d, ans.d)],
      `Multiply the amount by ${batches}: ${fImp(cups)} × ${batches} = ${fImp(ans)} = ${fMixed(ans)} cups.`,
    );
  };

  const pieces = (): Question => {
    const piece = pick([F(3, 4), F(2, 3), F(3, 8), F(5, 6)]);
    const whole = randInt(4, 12);
    const count = Math.floor(whole / fVal(piece) + 1e-9);
    const rope = pick(["ribbon", "rope", "pipe", "wire"]);
    return typed(
      `A ${whole} m length of ${rope} is cut into pieces that are ${fImp(piece)} m long. How many full pieces can be cut?`,
      String(count),
      `Divide: ${whole} ÷ ${fImp(piece)} = ${whole} × ${piece.d}/${piece.n} = ${fMixed(F(whole * piece.d, piece.n))}. Only the whole number of pieces counts, so ${count}.`,
      "number",
    );
  };

  const howMany = (): Question => {
    const dd = pick([2, 3, 4, 5, 6, 8]);
    const w = randInt(2, 6);
    return typed(
      `How many ${fImp({ n: 1, d: dd })}s are in ${w}?`,
      String(w * dd),
      `Dividing ${w} by 1/${dd} means ${w} × ${dd} = ${w * dd}.`,
      "number",
    );
  };

  const order = (): Question => {
    for (let t = 0; t < 100; t++) {
      const fr = [randFr(dens), randFr(dens), randFr(dens), randFr(dens)];
      const vals = fr.map(fVal);
      if (new Set(vals.map((v) => v.toFixed(6))).size < 4) continue;
      const sorted = [...fr].sort((x, y) => fVal(x) - fVal(y));
      const q: OrderQuestion = {
        kind: "order",
        prompt: "Order these fractions from least to greatest.",
        hint: "Rename each fraction with a common denominator (or turn them into decimals) and compare.",
        items: sorted.map((f, i) => ({ id: `f${i}`, label: text(f) })),
      };
      return q;
    }
    return addSub();
  };

  const makers = d === 1 ? [addSub, addSub, multiply, divide, recipe, howMany, order, pieces] : [addSub, mixedAddSub, mixedAddSub, multiply, divide, mixedMultiply, recipe, pieces, order];
  if (d === 3) makers.push(mixedMultiply, mixedAddSub);
  return build(makers);
}

// ---------- 3. Fractions, Decimals, Percents, Ratios and Rates ----------

const FORMS: [number, number][] = [
  [1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 8], [3, 8], [5, 8], [7, 8], [1, 10], [3, 10], [7, 10],
  [9, 10], [1, 20], [3, 20], [7, 20], [13, 20], [1, 25], [3, 25], [7, 25], [1, 50], [9, 50], [11, 20], [17, 20],
];
/** Tenths of a percent, so 3/8 → 375 (37.5%). */
const permille = (f: [number, number]): number => (f[0] * 1000) / f[1];

function numberForms(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const pool = d === 1 ? FORMS.filter(([, den]) => den !== 8) : FORMS;
  const makers: (() => Question)[] = [
    () => {
      const f = pick(pool);
      const p = permille(f);
      return typed(`Write ${f[0]}/${f[1]} as a decimal.`, fmt(p / 1000), `Divide ${f[0]} ÷ ${f[1]} = ${fmt(p / 1000)}.`, "decimal");
    },
    () => {
      const f = pick(pool);
      const p = permille(f);
      return typed(`Write ${f[0]}/${f[1]} as a percent.`, fmt(p / 10), `${f[0]}/${f[1]} = ${fmt(p / 1000)} as a decimal. Multiply by 100 to get ${fmt(p / 10)}%.`, "decimal", { suffix: "%" });
    },
    () => {
      const f = pick(pool);
      const p = permille(f);
      const dec = p / 1000;
      const r = F(f[0], f[1]);
      return strQ(
        `Which fraction is equal to ${fmt(dec)}?`,
        `${r.n}/${r.d}`,
        [`${r.d}/${r.n}`, `${r.n}/${r.d + 1}`, `${r.n + 1}/${r.d}`, `${r.n}/${r.d * 2}`],
        `${fmt(dec)} is ${fmt(p / 10)} hundredths, so write ${fmt(p / 10)}/100 and reduce it to lowest terms: ${r.n}/${r.d}.`,
      );
    },
    () => {
      const f = pick(pool);
      const p = permille(f);
      const r = F(f[0], f[1]);
      return strQ(
        `Which fraction is equal to ${fmt(p / 10)}%?`,
        `${r.n}/${r.d}`,
        [`${r.n}/${r.d + 1}`, `${r.d}/${r.n}`, `${r.n + 1}/${r.d}`, `${r.n}/${r.d * 2}`],
        `A percent means "out of 100": ${fmt(p / 10)}% = ${fmt(p / 10)}/100. Reduce to lowest terms to get ${r.n}/${r.d}.`,
      );
    },
    () => {
      const f = pick(pool);
      const p = permille(f);
      return numQ(
        `Write ${fmt(p / 1000)} as a percent.`,
        p / 10,
        [p / 1000, p / 100, p / 10 + 10],
        `Multiply a decimal by 100 to get a percent: ${fmt(p / 1000)} × 100 = ${fmt(p / 10)}%.`,
        undefined,
        { unit: "%", min: 0 },
      );
    },
    () => {
      for (let t = 0; t < 100; t++) {
        const chosen = sample(pool, 4);
        const vals = chosen.map(permille);
        if (new Set(vals).size < 4) continue;
        const forms = chosen.map((f, i) => {
          const p = permille(f);
          const kind = i % 3;
          return { v: p, label: kind === 0 ? `${f[0]}/${f[1]}` : kind === 1 ? fmt(p / 1000) : `${fmt(p / 10)}%` };
        });
        const sorted = [...forms].sort((a, b) => a.v - b.v);
        const q: OrderQuestion = {
          kind: "order",
          prompt: "Order from least to greatest.",
          hint: "Change every number to the same form, such as percent, then compare.",
          items: sorted.map((it, i) => ({ id: `n${i}`, label: it.label })),
        };
        return q;
      }
      return typed("Write 1/4 as a decimal.", "0.25", "1 ÷ 4 = 0.25.", "decimal");
    },
    // Ratios
    () => {
      const a = randInt(1, 7);
      let b = randInt(1, 9);
      while (gcd(a, b) !== 1 || a === b) b = randInt(1, 9);
      const k = randInt(2, d === 1 ? 5 : 9);
      return strQ(
        `Write the ratio ${a * k} : ${b * k} in simplest form.`,
        `${a} : ${b}`,
        [`${b} : ${a}`, `${a * k} : ${b}`, `${a + 1} : ${b}`, `${a * k - b * k} : ${b * k}`],
        `Divide both parts by their greatest common factor, ${k}: ${a * k} ÷ ${k} = ${a} and ${b * k} ÷ ${k} = ${b}.`,
      );
    },
    () => {
      const a = randInt(2, 7);
      let b = randInt(2, 9);
      while (a === b) b = randInt(2, 9);
      const k = randInt(2, 6);
      return typed(
        `${a} : ${b} = ${a * k} : ?`,
        String(b * k),
        `Both parts were multiplied by ${a * k} ÷ ${a} = ${k}. Do the same to ${b}: ${b} × ${k} = ${b * k}.`,
        "number",
        { visual: { type: "equation", text: `${a} : ${b} = ${a * k} : ☐` } },
      );
    },
    () => {
      const a = randInt(1, 6);
      let b = randInt(2, 8);
      while (a === b) b = randInt(2, 8);
      const k = randInt(2, d === 3 ? 12 : 8);
      const total = (a + b) * k;
      const [p1, p2] = pick([
        ["red", "blue"],
        ["boys", "girls"],
        ["cats", "dogs"],
      ]);
      const askFirst = chance(0.5);
      return typed(
        `The ratio of ${p1} to ${p2} is ${a} : ${b}. There are ${total} in all. How many ${askFirst ? p1 : p2} are there?`,
        String((askFirst ? a : b) * k),
        `The ratio has ${a} + ${b} = ${a + b} parts. One part is ${total} ÷ ${a + b} = ${k}. So ${askFirst ? p1 : p2} is ${(askFirst ? a : b)} × ${k} = ${(askFirst ? a : b) * k}.`,
        "number",
      );
    },
    // Rates
    () => {
      const speed = randInt(4, d === 1 ? 12 : 25) * (d === 3 ? 5 : 1);
      const hrs = randInt(2, 6);
      return typed(
        `A cyclist travels ${speed * hrs} km in ${hrs} hours at a steady pace. What is the unit rate in km/h?`,
        String(speed),
        `A unit rate is "per one hour". ${speed * hrs} ÷ ${hrs} = ${speed} km/h.`,
        "number",
        { suffix: "km/h" },
      );
    },
    () => {
      const unitCents = 5 * randInt(6, d === 1 ? 30 : 60);
      const n = randInt(3, 12);
      return typedMoney(
        `${n} notebooks cost ${money(unitCents * n)}. What is the cost of one notebook?`,
        unitCents,
        `Divide the total by the number of notebooks: ${money(unitCents * n)} ÷ ${n} = ${money(unitCents)}.`,
      );
    },
    () => {
      const n1 = pick([2, 3, 4, 5, 6]);
      const n2 = n1 * pick([2, 3]);
      const c1 = 5 * randInt(20, 80);
      let c2 = 5 * randInt(20, 160);
      while (c1 * n2 === c2 * n1) c2 += 5;
      const aBetter = c1 * n2 < c2 * n1;
      const unit1 = c1 / n1 / 100;
      const unit2 = c2 / n2 / 100;
      return strQ(
        "Which is the better buy?",
        aBetter ? `${n1} for ${money(c1)}` : `${n2} for ${money(c2)}`,
        [aBetter ? `${n2} for ${money(c2)}` : `${n1} for ${money(c1)}`, "They cost the same per item"],
        `Find the cost of one item for each: ${money(c1)} ÷ ${n1} ≈ $${unit1.toFixed(3)} and ${money(c2)} ÷ ${n2} ≈ $${unit2.toFixed(3)}. The smaller unit price is the better buy.`,
      );
    },
    () => {
      const perMin = randInt(3, 20);
      return typed(
        `A machine fills ${perMin} bottles every minute. How many bottles does it fill in one hour?`,
        String(perMin * 60),
        `There are 60 minutes in an hour, so ${perMin} × 60 = ${perMin * 60}.`,
        "number",
      );
    },
  ];
  return build(makers);
}

// ---------- 4. Percent and Financial Literacy ----------

function percentFinance(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const discounts = d === 1 ? [10, 20, 25, 50] : d === 2 ? [10, 15, 20, 25, 30, 40, 50] : [5, 15, 25, 35, 45, 60, 70];
  const makers: (() => Question)[] = [
    () => {
      const base = 20 * randInt(1, 15);
      const pct = 5 * randInt(1, 19);
      return typed(
        `What is ${pct}% of ${base}?`,
        fmt((base * pct) / 100),
        `Write ${pct}% as ${pct}/100 and multiply: ${base} × ${pct} ÷ 100 = ${fmt((base * pct) / 100)}.`,
        "decimal",
      );
    },
    () => {
      const base = 20 * randInt(1, 12);
      const pct = pick([120, 125, 150, 175, 200, 250, 300]);
      return typed(
        `What is ${pct}% of ${base}?`,
        fmt((base * pct) / 100),
        `A percent over 100 means more than the whole. ${pct}% = ${fmt(pct / 100)}, and ${base} × ${fmt(pct / 100)} = ${fmt((base * pct) / 100)}.`,
        "decimal",
      );
    },
    () => {
      const base = 200 * randInt(1, 10);
      return typed(
        `What is 0.5% of ${base}?`,
        fmt(base / 200),
        `0.5% is half of 1%. 1% of ${base} is ${base / 100}, so half of that is ${fmt(base / 200)}.`,
        "decimal",
      );
    },
    () => {
      const price = 5 * randInt(4, 40);
      const pct = pick(discounts);
      const sale = price * (100 - pct);
      return typedMoney(
        `A jacket costs ${money(price * 100)} and is ${pct}% off. What is the sale price?`,
        sale,
        `Discount = ${pct}% of ${money(price * 100)} = ${money(price * pct)}. Sale price = ${money(price * 100)} − ${money(price * pct)} = ${money(sale)}. (Or find ${100 - pct}% directly.)`,
      );
    },
    () => {
      const price = 5 * randInt(4, 40);
      const rate = pick(d === 1 ? [10, 5] : [5, 7, 8, 10, 12, 13, 15]);
      return typedMoney(
        `A ${money(price * 100)} backpack has ${rate}% sales tax added. What is the total cost?`,
        price * (100 + rate),
        `Tax = ${rate}% of ${money(price * 100)} = ${money(price * rate)}. Total = ${money(price * 100)} + ${money(price * rate)} = ${money(price * (100 + rate))}.`,
      );
    },
    () => {
      const bill = 5 * randInt(4, 24);
      const tip = pick([10, 15, 18, 20]);
      return typedMoney(
        `Your restaurant bill is ${money(bill * 100)}. How much is a ${tip}% tip?`,
        bill * tip,
        `${tip}% of ${money(bill * 100)} = ${bill} × ${tip} ÷ 100 = ${money(bill * tip)}.`,
      );
    },
    () => {
      const n1 = pick([4, 6, 8, 10, 12]);
      const n2 = n1 * pick([2, 3]);
      const c1 = 5 * randInt(30, 90);
      let c2 = 5 * randInt(40, 200);
      while (c1 * n2 === c2 * n1) c2 += 5;
      const aBetter = c1 * n2 < c2 * n1;
      const item = pick(["batteries", "granola bars", "juice boxes", "pencils"]);
      return strQ(
        `Which pack of ${item} is the best buy?`,
        aBetter ? `${n1} for ${money(c1)}` : `${n2} for ${money(c2)}`,
        [aBetter ? `${n2} for ${money(c2)}` : `${n1} for ${money(c1)}`, "Both cost the same per item"],
        `Compare unit prices: ${money(c1)} ÷ ${n1} ≈ $${(c1 / n1 / 100).toFixed(3)} and ${money(c2)} ÷ ${n2} ≈ $${(c2 / n2 / 100).toFixed(3)}. Choose the lower price per item.`,
      );
    },
    () => {
      const P = 100 * randInt(2, d === 1 ? 20 : 50);
      const r = randInt(2, 8);
      const t = randInt(1, 5);
      const I = (P * r * t) / 100;
      return typed(
        `You invest $${P} at ${r}% simple interest per year for ${t} year${t > 1 ? "s" : ""}. How much interest is earned?`,
        String(I),
        `Simple interest = principal × rate × time = ${P} × ${r / 100} × ${t} = $${I}.`,
        "number",
        { suffix: "$" },
      );
    },
    () => {
      const P = 100 * randInt(2, 40);
      const r = randInt(2, 8);
      const t = randInt(2, 5);
      const I = (P * r * t) / 100;
      return typed(
        `A savings account pays ${r}% simple interest per year. What is the total after ${t} years if you start with $${P}?`,
        String(P + I),
        `Interest = ${P} × ${r / 100} × ${t} = $${I}. Total = $${P} + $${I} = $${P + I}.`,
        "number",
        { suffix: "$" },
      );
    },
    () => {
      const a = pick([20, 25, 40, 50, 80, 100, 120, 200]);
      const pct = pick([10, 20, 25, 50]);
      if ((a * pct) % 100 !== 0) return numQ("What is 10% of 50?", 5, [50, 0.5, 15], "10% is one tenth: 50 ÷ 10 = 5.");
      const up = chance(0.5);
      const b = up ? a + (a * pct) / 100 : a - (a * pct) / 100;
      return typed(
        `The price of a video game ${up ? "rose" : "dropped"} from $${a} to $${b}. By what percent did it ${up ? "increase" : "decrease"}?`,
        String(pct),
        `Change = $${Math.abs(b - a)}. Percent change = change ÷ original = ${Math.abs(b - a)} ÷ ${a} = ${fmt(Math.abs(b - a) / a)} = ${pct}%. Always compare to the original price.`,
        "number",
        { suffix: "%" },
      );
    },
    () => {
      const orig = 20 * randInt(2, 15);
      const pct = pick([10, 20, 25, 50]);
      const sale = (orig * (100 - pct)) / 100;
      return typed(
        `After a ${pct}% discount, a bike costs $${sale}. What was the original price?`,
        String(orig),
        `The sale price is ${100 - pct}% of the original, so original × ${fmt((100 - pct) / 100)} = ${sale}. Divide: ${sale} ÷ ${fmt((100 - pct) / 100)} = ${orig}.`,
        "number",
        { suffix: "$" },
      );
    },
    () => {
      const price = 20 * randInt(2, 10);
      const pct = pick([10, 15, 20, 25, 30, 40, 50].filter((p) => (p * price) % 100 === 0));
      const off = (price * pct) / 100;
      let flat = off + 5 * pick([-3, -2, -1, 1, 2, 3]);
      if (flat <= 0) flat = off + 5;
      const pctBetter = off > flat;
      return strQ(
        `A $${price} item is offered with ${pct}% off or a $${flat} coupon. Which saves more?`,
        pctBetter ? `${pct}% off` : `The $${flat} coupon`,
        [pctBetter ? `The $${flat} coupon` : `${pct}% off`, "They save the same amount"],
        `${pct}% of $${price} = $${off}. Compare $${off} with $${flat}: ${pctBetter ? `${off} is greater` : `${flat} is greater`}.`,
      );
    },
  ];
  if (d >= 2) {
    makers.push(() => {
      const price = 20 * randInt(2, 10);
      const pct = pick([10, 20, 25, 50]);
      const rate = pick([5, 10, 12, 15]);
      const sale = price * (100 - pct);
      const total = sale + (sale * rate) / 100;
      return typedMoney(
        `A ${money(price * 100)} coat is ${pct}% off, then ${rate}% tax is added to the sale price. What is the final cost?`,
        total,
        `Sale price = ${money(price * 100)} × ${fmt((100 - pct) / 100)} = ${money(sale)}. Tax = ${rate}% of ${money(sale)} = ${money((sale * rate) / 100)}. Total = ${money(total)}.`,
      );
    });
  }
  if (d === 3) {
    makers.push(() => {
      const P = 100 * randInt(5, 40);
      const r = randInt(2, 9);
      const t = randInt(2, 6);
      const I = (P * r * t) / 100;
      return typed(
        `Simple interest of $${I} was earned on $${P} over ${t} years. What was the yearly interest rate?`,
        String(r),
        `I = P × r × t, so r = I ÷ (P × t) = ${I} ÷ (${P} × ${t}) = ${fmt(r / 100)} = ${r}%.`,
        "number",
        { suffix: "%" },
      );
    });
  }
  return build(makers);
}

// ---------- 5. Solving Linear Equations ----------

function equations(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const bigX = d === 1 ? 9 : 12;

  const solveTwoStep = (): Question => {
    const a = randInt(2, d === 1 ? 6 : 9);
    const x = d === 1 ? randInt(1, bigX) : signed(1, bigX);
    const b = d === 1 ? randInt(1, 12) : signed(1, 15);
    const c = a * x + b;
    return typed(
      `Solve for x: ${lin(a, b)} = ${c}`,
      String(x),
      `Undo the ${b < 0 ? "subtraction" : "addition"} first: ${b < 0 ? "add" : "subtract"} ${Math.abs(b)} on both sides to get ${a}x = ${c - b}. Then divide both sides by ${a}: x = ${x}.`,
      "integer",
      { visual: { type: "equation", text: `${lin(a, b)} = ${c}` } },
    );
  };
  const solveDivide = (): Question => {
    const a = randInt(2, 8);
    const x = a * (d === 1 ? randInt(1, 9) : signed(1, 9));
    const b = d === 1 ? randInt(1, 10) : signed(1, 12);
    const c = x / a + b;
    return typed(
      `Solve for x: x ÷ ${a} ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${c}`,
      String(x),
      `Undo the ${b < 0 ? "subtraction" : "addition"}: x ÷ ${a} = ${c - b}. Then undo the division by multiplying both sides by ${a}: x = ${x}.`,
      "integer",
    );
  };
  const oneStep = (): Question => {
    const a = randInt(2, 12);
    const x = signed(2, 12);
    const type = pick([0, 1, 2]);
    if (type === 0) {
      return typed(`Solve for x: ${a}x = ${a * x}`, String(x), `Divide both sides by ${a}: x = ${a * x} ÷ ${a} = ${x}.`, "integer");
    }
    if (type === 1) {
      const b = randInt(2, 20);
      return typed(`Solve for x: x + ${b} = ${x + b}`, String(x), `Subtract ${b} from both sides: x = ${x + b} − ${b} = ${x}.`, "integer");
    }
    return typed(`Solve for x: x ÷ ${a} = ${x}`, String(a * x), `Multiply both sides by ${a}: x = ${x} × ${a} = ${a * x}.`, "integer");
  };
  const brackets = (): Question => {
    const a = randInt(2, 6);
    const x = signed(1, 9);
    const b = signed(1, 7);
    const c = a * (x + b);
    return typed(
      `Solve for x: ${a}(x ${b < 0 ? "−" : "+"} ${Math.abs(b)}) = ${c}`,
      String(x),
      `Divide both sides by ${a} first: x ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${c / a}. Then ${b < 0 ? "add" : "subtract"} ${Math.abs(b)}: x = ${x}.`,
      "integer",
    );
  };
  const firstStep = (): Question => {
    const a = randInt(2, 9);
    let b = randInt(2, 15);
    if (d > 1 && chance(0.4)) b = -b;
    const x = randInt(2, 10);
    const c = a * x + b;
    const eq = `${lin(a, b)} = ${c}`;
    const right = b > 0 ? `Subtract ${b} from both sides` : `Add ${-b} to both sides`;
    return strQ(
      `To solve ${eq}, what is the best first step?`,
      right,
      [`Divide both sides by ${a}`, b > 0 ? `Add ${b} to both sides` : `Subtract ${-b} from both sides`, `Divide both sides by ${Math.abs(b)}`, `Subtract ${a} from both sides`],
      `Reverse the order of operations: the last operation applied to x was ${b > 0 ? "adding" : "subtracting"} ${Math.abs(b)}, so undo that first. Then undo the multiplication.`,
      { type: "equation", text: eq },
    );
  };
  const whichX = (): Question => {
    const a = randInt(2, 8);
    const b = signed(1, 12);
    const x = signed(1, 9);
    const c = a * x + b;
    return numQ(
      `Which value of x makes ${lin(a, b)} = ${c} true?`,
      x,
      [(c - b) , -x, x + 1, x - 1, c / a].filter((v) => Number.isInteger(v)),
      `Substitute each value. For x = ${x}: ${a}(${br(x)})${b < 0 ? " −" : " +"} ${Math.abs(b)} = ${a * x}${b < 0 ? " −" : " +"} ${Math.abs(b)} = ${c}. It works.`,
    );
  };
  const story = (): Question => {
    const per = randInt(2, 9);
    const fixed = randInt(3, 25);
    const x = randInt(2, 14);
    const total = per * x + fixed;
    const ctx = pick([
      { thing: "A taxi charges", fixedName: "a base fee of", unitName: "per kilometre", v: "k", ans: "kilometres" },
      { thing: "A gym charges", fixedName: "a sign-up fee of", unitName: "per month", v: "m", ans: "months" },
      { thing: "A streaming service charges", fixedName: "a one-time setup fee of", unitName: "per month", v: "m", ans: "months" },
    ]);
    return typed(
      `${ctx.thing} ${ctx.fixedName} $${fixed} plus $${per} ${ctx.unitName}. The total was $${total}. For how many ${ctx.ans}?`,
      String(x),
      `Write an equation: ${per}${ctx.v} + ${fixed} = ${total}. Subtract ${fixed}: ${per}${ctx.v} = ${total - fixed}. Divide by ${per}: ${ctx.v} = ${x}.`,
      "number",
    );
  };
  const writeEq = (): Question => {
    const per = randInt(2, 9);
    let fixed = randInt(3, 20);
    while (per === fixed) fixed++;
    const x = randInt(2, 12);
    const total = per * x + fixed;
    const who = pick(["Sam", "Priya", "Leo", "Amara"]);
    return strQ(
      `${who} pays a $${fixed} deposit plus $${per} for each hour (h) of studio time. The total is $${total}. Which equation fits?`,
      `${per}h + ${fixed} = ${total}`,
      [`${fixed}h + ${per} = ${total}`, `${per}h − ${fixed} = ${total}`, `${per + fixed}h = ${total}`, `${per}(h + ${fixed}) = ${total}`],
      `The amount that changes with the hours is $${per} × h. The deposit of $${fixed} is added once. Together they equal $${total}.`,
    );
  };
  const errorSpot = (): Question => {
    const a = randInt(2, 7);
    const b = randInt(3, 15);
    const x = randInt(2, 9);
    const c = a * x + b;
    return strQ(
      `Jay solved ${a}x + ${b} = ${c} and wrote "${a}x = ${c + b}" as his first step. What went wrong?`,
      `He added ${b} instead of subtracting ${b} from both sides`,
      [`He should have multiplied both sides by ${b}`, `He should have subtracted ${a}`, "Nothing; that step is correct"],
      `To undo "+ ${b}" you do the opposite: subtract ${b} from both sides. That gives ${a}x = ${c - b}.`,
    );
  };
  const makers = d === 1 ? [oneStep, solveTwoStep, solveTwoStep, firstStep, whichX, story, writeEq, errorSpot] : [solveTwoStep, solveDivide, solveTwoStep, firstStep, whichX, story, writeEq, errorSpot, oneStep];
  if (d === 3) makers.push(brackets, brackets, solveDivide);
  return build(makers);
}

// ---------- 6. Patterns and Linear Relations ----------

function linearRelations(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const slope = (): number => {
    const m = d === 1 ? randInt(1, 4) : signed(1, 4);
    return m;
  };
  const planWindow = (m: number, b: number): Extract<Visual, { type: "plot" }> => ({
    type: "plot",
    xMin: -5,
    xMax: 5,
    yMin: -10,
    yMax: 10,
    step: 1,
    curves: [{ points: range(-5, 5).map((x) => ({ x, y: m * x + b })) }],
  });

  const patternTerm = (): Question => {
    const s = randInt(1, 15);
    let diff = randInt(2, 9);
    if (d >= 2 && chance(0.4)) diff = -diff;
    const n = randInt(8, 20);
    const seq = range(0, 3).map((i) => s + i * diff);
    return typed(
      `Pattern: ${seq.join(", ")}, … What is term ${n}?`,
      String(s + (n - 1) * diff),
      `The pattern changes by ${diff} each term. Term n = ${s} ${diff < 0 ? "−" : "+"} ${Math.abs(diff)} × (n − 1). For n = ${n}: ${s} ${diff < 0 ? "−" : "+"} ${Math.abs(diff)} × ${n - 1} = ${s + (n - 1) * diff}.`,
      "integer",
    );
  };
  const whichTerm = (): Question => {
    const s = randInt(2, 10);
    const diff = randInt(2, 7);
    const n = randInt(6, 25);
    const v = s + (n - 1) * diff;
    return typed(
      `The pattern ${s}, ${s + diff}, ${s + 2 * diff}, ${s + 3 * diff}, … continues. Which term number has the value ${v}?`,
      String(n),
      `Term n has value ${s} + ${diff}(n − 1). Solve ${s} + ${diff}(n − 1) = ${v}: ${diff}(n − 1) = ${v - s}, so n − 1 = ${n - 1} and n = ${n}.`,
      "number",
    );
  };
  const tableRule = (): Question => {
    const m = slope();
    let b = signed(1, 6);
    if (d === 1) b = randInt(1, 6);
    while (m === b) b = b > 0 ? b + 1 : b - 1;
    const xs = range(1, 5);
    const rule = `y = ${lin(m, b)}`;
    return strQ(
      "Which rule matches the table of values?",
      rule,
      [`y = ${lin(b, m)}`, `y = ${lin(m, -b)}`, `y = ${lin(m + b, 0)}`, `y = ${lin(m, b + 1)}`],
      `Check the change in y for each step of 1 in x: it is ${m}, so the rule starts with ${m}x. Then test x = 1: ${m}(1) + ? = ${m + b}, so the constant is ${b}.`,
      { type: "table", headers: ["x", "y"], rows: xs.map((x) => [x, m * x + b]) },
    );
  };
  const evalRule = (): Question => {
    const m = slope();
    const b = signed(1, 9);
    const x = d === 1 ? randInt(1, 8) : signed(1, 9);
    return typed(
      `For y = ${lin(m, b)}, find y when x = ${x}.`,
      String(m * x + b),
      `Substitute x = ${x}: y = ${m}(${br(x)})${b < 0 ? " −" : " +"} ${Math.abs(b)} = ${m * x}${b < 0 ? " −" : " +"} ${Math.abs(b)} = ${m * x + b}.`,
      "integer",
    );
  };
  const growth = (): Question => {
    const start = randInt(5, 30);
    const per = randInt(2, 9);
    const w = randInt(5, 12);
    const thing = pick([
      { n: "A plant is", u: "cm tall and grows", t: "week" },
      { n: "A savings jar holds $", u: "and gains $", t: "week" },
    ]);
    const isPlant = thing.n.startsWith("A plant");
    const prompt = isPlant
      ? `A plant is ${start} cm tall and grows ${per} cm each week. Its height is h = ${per}w + ${start}. How tall is it after ${w} weeks?`
      : `A jar holds $${start} and gains $${per} each week. The total is T = ${per}w + ${start}. How much is in the jar after ${w} weeks?`;
    return typed(prompt, String(per * w + start), `Substitute w = ${w}: ${per}(${w}) + ${start} = ${per * w} + ${start} = ${per * w + start}.`, "number", {
      suffix: isPlant ? "cm" : "$",
    });
  };
  const linearOrNot = (): Question => {
    const xs = range(1, 5);
    const isLinear = chance(0.5);
    let ys: number[];
    let why: string;
    if (isLinear) {
      const m = signed(1, 6);
      const b = signed(0, 8);
      ys = xs.map((x) => m * x + b);
      why = `y changes by ${m} every time x goes up by 1, a constant change, so the relation is linear.`;
    } else {
      const kind = pick([0, 1, 2]);
      ys = xs.map((x) => (kind === 0 ? x * x : kind === 1 ? 2 ** x : x * (x + 1)));
      why = `The change in y is ${ys[1] - ys[0]}, then ${ys[2] - ys[1]}, then ${ys[3] - ys[2]}: it is not constant, so the relation is not linear.`;
    }
    return strQ(
      "Is this relation linear?",
      isLinear ? "Linear: y changes by the same amount each time" : "Not linear: the change in y is not constant",
      [isLinear ? "Not linear: the change in y is not constant" : "Linear: y changes by the same amount each time"],
      why,
      { type: "table", headers: ["x", "y"], rows: xs.map((x, i) => [x, ys[i]]) },
    );
  };
  const graphSlope = (): Question => {
    const m = slope();
    const b = randInt(-4, 4);
    const x1 = randInt(-3, 0);
    const x2 = x1 + randInt(1, 2);
    const y1 = m * x1 + b;
    const y2 = m * x2 + b;
    const v = planWindow(m, b);
    v.points = [
      { x: x1, y: y1, label: `A(${x1}, ${y1})` },
      { x: x2, y: y2, label: `B(${x2}, ${y2})` },
    ];
    return typed(
      "What is the slope of this line?",
      String(m),
      `Slope = rise ÷ run = (${y2} − ${br(y1)}) ÷ (${x2} − ${br(x1)}) = ${y2 - y1} ÷ ${x2 - x1} = ${m}.`,
      "integer",
      { visual: v },
    );
  };
  const graphValue = (): Question => {
    const m = slope();
    const b = randInt(-4, 4);
    const x = randInt(-3, 4);
    const y = m * x + b;
    if (Math.abs(y) > 10) return evalRule();
    return typed(
      `Use the graph to find y when x = ${x}.`,
      String(y),
      `Find x = ${x} on the horizontal axis, go up or down to the line, then read across to the y-axis. The point is (${x}, ${y}).`,
      "integer",
      { visual: planWindow(m, b) },
    );
  };
  const graphEquation = (): Question => {
    const m = slope();
    let b = randInt(-4, 4);
    if (b === 0) b = 2;
    while (m === b) b = b > 0 ? b + 1 : b - 1;
    return strQ(
      "Which equation matches the graph?",
      `y = ${lin(m, b)}`,
      [`y = ${lin(-m, b)}`, `y = ${lin(m, -b)}`, `y = ${lin(b, m)}`, `y = ${lin(m, b + 2)}`],
      `The line crosses the y-axis at ${b}, so the constant is ${b}. Moving 1 right changes y by ${m}, so the slope is ${m}.`,
      planWindow(m, b),
    );
  };
  const interceptWord = (): Question => {
    const fixed = randInt(3, 20);
    const per = randInt(2, 8);
    return strQ(
      `A phone plan costs C = ${per}g + ${fixed} dollars for g gigabytes. What does the ${fixed} represent?`,
      "The fixed cost when no data is used",
      [`The cost of each gigabyte`, "The number of gigabytes", "The total cost for all data"],
      `In y = mx + b, the b is the starting value: the amount when g = 0. The ${per} is the rate for each gigabyte.`,
    );
  };
  const makers = d === 1 ? [patternTerm, tableRule, evalRule, growth, linearOrNot, graphValue, graphEquation, whichTerm] : [patternTerm, tableRule, evalRule, growth, linearOrNot, graphSlope, graphValue, graphEquation, whichTerm, interceptWord];
  return build(makers);
}

// ---------- 7. The Pythagorean Theorem ----------

const TRIPLES: [number, number, number][] = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];

function pythagoras(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const triple = (): [number, number, number] => {
    const t = pick(d === 1 ? TRIPLES.slice(0, 3) : TRIPLES);
    const k = d === 1 ? randInt(1, 2) : randInt(1, 3);
    return t[2] * k > 100 ? [t[0], t[1], t[2]] : [t[0] * k, t[1] * k, t[2] * k];
  };
  const hyp = (): Question => {
    const [a, b, c] = triple();
    return typed(
      `A right triangle has legs of ${a} cm and ${b} cm. How long is the hypotenuse?`,
      String(c),
      `c² = a² + b² = ${a * a} + ${b * b} = ${c * c}, so c = √${c * c} = ${c}.`,
      "number",
      { suffix: "cm", visual: { type: "equation", text: `${a}² + ${b}² = c²` } },
    );
  };
  const leg = (): Question => {
    const [a, b, c] = triple();
    const [known, miss] = chance(0.5) ? [a, b] : [b, a];
    return typed(
      `The hypotenuse of a right triangle is ${c} cm and one leg is ${known} cm. How long is the other leg?`,
      String(miss),
      `Subtract: leg² = c² − known² = ${c * c} − ${known * known} = ${miss * miss}, so the leg is √${miss * miss} = ${miss}.`,
      "number",
      { suffix: "cm" },
    );
  };
  const hypRound = (): Question => {
    let a = randInt(3, d === 1 ? 9 : 15);
    let b = randInt(3, d === 1 ? 9 : 15);
    while (isSquare(a * a + b * b)) b++;
    if (a > b) [a, b] = [b, a];
    const c = Math.round(Math.sqrt(a * a + b * b) * 10) / 10;
    return typed(
      `The legs of a right triangle are ${a} m and ${b} m. Find the hypotenuse to the nearest tenth.`,
      fmt(c),
      `c² = ${a}² + ${b}² = ${a * a + b * b}. c = √${a * a + b * b} ≈ ${c.toFixed(1)}.`,
      "decimal",
      { suffix: "m" },
    );
  };
  const legRound = (): Question => {
    const a = randInt(3, 12);
    let c = randInt(a + 2, a + 12);
    while (isSquare(c * c - a * a)) c++;
    const b = Math.round(Math.sqrt(c * c - a * a) * 10) / 10;
    return typed(
      `The hypotenuse is ${c} cm and one leg is ${a} cm. Find the other leg to the nearest tenth.`,
      fmt(b),
      `b² = ${c}² − ${a}² = ${c * c - a * a}, so b = √${c * c - a * a} ≈ ${b.toFixed(1)}.`,
      "decimal",
      { suffix: "cm" },
    );
  };
  const isRight = (): Question => {
    const [a, b, c] = triple();
    const right = chance(0.5);
    const cc = right ? c : c + pick([-2, -1, 1, 2]);
    const sorted = [a, b, cc].sort((x, y) => x - y);
    const ok = sorted[0] ** 2 + sorted[1] ** 2 === sorted[2] ** 2;
    return strQ(
      `Is a triangle with sides ${a} cm, ${b} cm and ${cc} cm a right triangle?`,
      ok ? "Yes: a² + b² = c²" : "No: a² + b² ≠ c²",
      [ok ? "No: a² + b² ≠ c²" : "Yes: a² + b² = c²"],
      `Test the converse. Square the two shorter sides: ${sorted[0] ** 2} + ${sorted[1] ** 2} = ${sorted[0] ** 2 + sorted[1] ** 2}. The longest side squared is ${sorted[2] ** 2}. ${ok ? "They match, so it is a right triangle." : "They don't match, so it is not."}`,
    );
  };
  const ladder = (): Question => {
    const [a, b, c] = triple();
    const mode = pick([0, 1, 2]);
    if (mode === 0) {
      return typed(
        `A ${c} m ladder leans against a wall with its base ${a} m from the wall. How high up the wall does it reach?`,
        String(b),
        `The ladder is the hypotenuse. height² = ${c}² − ${a}² = ${b * b}, so height = ${b} m.`,
        "number",
        { suffix: "m" },
      );
    }
    if (mode === 1) {
      return typed(
        `A ladder reaches ${b} m up a wall and its base is ${a} m from the wall. How long is the ladder?`,
        String(c),
        `ladder² = ${b}² + ${a}² = ${b * b + a * a}, so the ladder is ${c} m long.`,
        "number",
        { suffix: "m" },
      );
    }
    return typed(
      `A rectangular field is ${a} m by ${b} m. How long is the diagonal path across it?`,
      String(c),
      `The diagonal is the hypotenuse of a right triangle with legs ${a} and ${b}: √(${a * a} + ${b * b}) = ${c} m.`,
      "number",
      { suffix: "m" },
    );
  };
  const shortcut = (): Question => {
    const [a, b, c] = triple();
    return typed(
      `Mia walks ${a} m east and then ${b} m north. A straight path back would be shorter. How much shorter is the straight path than her walk?`,
      String(a + b - c),
      `Straight path: √(${a}² + ${b}²) = ${c} m. Her walk was ${a} + ${b} = ${a + b} m. The difference is ${a + b} − ${c} = ${a + b - c} m.`,
      "number",
      { suffix: "m" },
    );
  };
  const tv = (): Question => {
    const [a, b, c] = triple();
    return typed(
      `A rectangular screen is ${a} cm wide and ${b} cm tall. What is the length of its diagonal?`,
      String(c),
      `The diagonal splits the rectangle into two right triangles. Diagonal = √(${a}² + ${b}²) = ${c} cm.`,
      "number",
      { suffix: "cm" },
    );
  };
  const concept = (): Question =>
    conceptQ(
      [
        {
          levels: [1, 2, 3],
          prompt: "In a right triangle, which side is the hypotenuse?",
          right: "The longest side, opposite the right angle",
          wrong: ["The shortest side", "Any side next to the right angle", "The side on the bottom"],
          hint: "The hypotenuse is always across from the 90° angle, and it is the longest side.",
        },
        {
          levels: [1, 2, 3],
          prompt: "Which equation correctly states the Pythagorean theorem for legs a and b and hypotenuse c?",
          right: "a² + b² = c²",
          wrong: ["a + b = c", "a² − b² = c²", "a² + b² = c", "2a + 2b = c"],
          hint: "Square the two legs, add them, and the sum equals the hypotenuse squared.",
        },
        {
          levels: [2, 3],
          prompt: "Why can't the Pythagorean theorem be used on this triangle: sides 5, 6 and 7 with no right angle marked?",
          right: "It only applies to right triangles, and 5² + 6² ≠ 7²",
          wrong: ["It only works with even numbers", "It works only if the sides are all different", "It only works when the area is a whole number"],
          hint: "The theorem describes right triangles only. Check: 25 + 36 = 61, but 7² = 49, so this isn't a right triangle.",
        },
        {
          levels: [2, 3],
          prompt: "Which set of numbers is a Pythagorean triple?",
          right: "6, 8, 10",
          wrong: ["4, 5, 6", "5, 7, 9", "7, 8, 12"],
          hint: "Check a² + b² = c² with the largest number as c. 36 + 64 = 100 = 10².",
        },
      ],
      d,
    );
  const makers = d === 1 ? [hyp, hyp, leg, ladder, isRight, concept, tv, hypRound] : [hyp, leg, hypRound, legRound, isRight, ladder, shortcut, tv, concept];
  return build(makers);
}

// ---------- 8. Surface Area and Volume ----------

function surfaceVolume(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const dim = () => randInt(2, d === 1 ? 8 : 14);
  const PI = 3.14;
  const boxV = (): Question => {
    const l = dim(), w = dim(), h = dim();
    return typed(
      `A rectangular prism is ${l} cm long, ${w} cm wide and ${h} cm tall. What is its volume?`,
      String(l * w * h),
      `Volume = length × width × height = ${l} × ${w} × ${h} = ${l * w * h}.`,
      "number",
      { suffix: "cm³", visual: { type: "shape", shape: "rectangular-prism" } },
    );
  };
  const boxSA = (): Question => {
    const l = dim(), w = dim(), h = dim();
    return typed(
      `Find the surface area of a rectangular prism that is ${l} cm by ${w} cm by ${h} cm.`,
      String(2 * (l * w + l * h + w * h)),
      `There are three pairs of faces: 2(${l}×${w}) + 2(${l}×${h}) + 2(${w}×${h}) = ${2 * l * w} + ${2 * l * h} + ${2 * w * h} = ${2 * (l * w + l * h + w * h)}.`,
      "number",
      { suffix: "cm²", visual: { type: "shape", shape: "rectangular-prism" } },
    );
  };
  const cubeSA = (): Question => {
    const e = randInt(2, d === 1 ? 9 : 15);
    return typed(
      `What is the surface area of a cube with edges of ${e} cm?`,
      String(6 * e * e),
      `A cube has 6 identical square faces. Each has area ${e} × ${e} = ${e * e}, so 6 × ${e * e} = ${6 * e * e}.`,
      "number",
      { suffix: "cm²", visual: { type: "shape", shape: "cube" } },
    );
  };
  const missingH = (): Question => {
    const l = dim(), w = dim(), h = randInt(2, 12);
    return typed(
      `A box has a volume of ${l * w * h} cm³. Its base is ${l} cm by ${w} cm. How tall is it?`,
      String(h),
      `Volume = base area × height. Base area = ${l} × ${w} = ${l * w}. Height = ${l * w * h} ÷ ${l * w} = ${h}.`,
      "number",
      { suffix: "cm" },
    );
  };
  const triV = (): Question => {
    const [ta, tb] = pick(TRIPLES.slice(0, 3));
    const k = randInt(1, 2);
    const a = ta * k, b = tb * k;
    const L = randInt(4, 15);
    return typed(
      `A triangular prism has a right-triangle base with legs ${a} cm and ${b} cm. The prism is ${L} cm long. What is its volume?`,
      String((a * b * L) / 2),
      `Base area = ½ × ${a} × ${b} = ${(a * b) / 2}. Volume = base area × length = ${(a * b) / 2} × ${L} = ${(a * b * L) / 2}.`,
      "number",
      { suffix: "cm³" },
    );
  };
  const triSA = (): Question => {
    const [ta, tb, tc] = pick(TRIPLES.slice(0, 3));
    const k = randInt(1, 2);
    const a = ta * k, b = tb * k, c = tc * k;
    const L = randInt(4, 12);
    const sa = a * b + (a + b + c) * L;
    return typed(
      `A triangular prism has a right-triangle base with sides ${a} cm, ${b} cm and ${c} cm. The prism is ${L} cm long. What is its surface area?`,
      String(sa),
      `Two triangles: 2 × ½ × ${a} × ${b} = ${a * b}. Three rectangles share the length ${L}: (${a} + ${b} + ${c}) × ${L} = ${(a + b + c) * L}. Total = ${sa}.`,
      "number",
      { suffix: "cm²" },
    );
  };
  const cylV = (): Question => {
    const r = randInt(2, d === 1 ? 6 : 10);
    const h = randInt(2, d === 1 ? 10 : 20);
    const v = (314 * r * r * h) / 100;
    const useDia = d >= 2 && chance(0.5);
    return typed(
      `A cylinder has ${useDia ? `a diameter of ${2 * r}` : `a radius of ${r}`} cm and a height of ${h} cm. Use π = 3.14. What is its volume?`,
      fmt(v),
      `Volume = πr²h. ${useDia ? `The radius is half of ${2 * r}, so r = ${r}. ` : ""}${PI} × ${r}² × ${h} = ${PI} × ${r * r * h} = ${fmt(v)}.`,
      "decimal",
      { suffix: "cm³", visual: { type: "shape", shape: "cylinder" } },
    );
  };
  const cylSA = (): Question => {
    const r = randInt(2, 8);
    const h = randInt(2, 15);
    const sa = (2 * 314 * r * (r + h)) / 100;
    return typed(
      `A cylinder has a radius of ${r} cm and a height of ${h} cm. Use π = 3.14. What is its surface area?`,
      fmt(sa),
      `Surface area = 2πr² + 2πrh = 2 × ${PI} × ${r} × (${r} + ${h}) = ${fmt(sa)}.`,
      "decimal",
      { suffix: "cm²", visual: { type: "shape", shape: "cylinder" } },
    );
  };
  const cylH = (): Question => {
    const r = randInt(2, 8);
    const h = randInt(2, 12);
    const v = (314 * r * r * h) / 100;
    return typed(
      `A cylinder with radius ${r} cm has a volume of ${fmt(v)} cm³ (π = 3.14). What is its height?`,
      String(h),
      `V = πr²h, so h = V ÷ (π r²) = ${fmt(v)} ÷ (${PI} × ${r * r}) = ${fmt(v)} ÷ ${fmt((314 * r * r) / 100)} = ${h}.`,
      "number",
      { suffix: "cm" },
    );
  };
  const capacity = (): Question => {
    for (let t = 0; t < 60; t++) {
      const l = pick([10, 20, 25, 40, 50, 100]);
      const w = pick([10, 20, 25, 40, 50]);
      const h = pick([10, 20, 30, 40, 50]);
      if ((l * w * h) % 1000 === 0 && l * w * h <= 200000) {
        return typed(
          `A fish tank is ${l} cm long, ${w} cm wide and ${h} cm tall. How many litres of water can it hold when full? (1 L = 1000 cm³)`,
          String((l * w * h) / 1000),
          `Volume = ${l} × ${w} × ${h} = ${l * w * h} cm³. Divide by 1000 to convert to litres: ${(l * w * h) / 1000} L.`,
          "number",
          { suffix: "L" },
        );
      }
    }
    return boxV();
  };
  const scale = (): Question => {
    const e = randInt(2, 6);
    const asked = pick(["surface area", "volume"]);
    const factor = asked === "volume" ? 8 : 4;
    return numQ(
      `Every edge of a cube is doubled. By what factor does the ${asked} multiply?`,
      factor,
      [2, 6, asked === "volume" ? 4 : 8, 16],
      asked === "volume"
        ? `Try an edge of ${e}: volume ${e ** 3}. Doubling gives ${2 * e}: volume ${(2 * e) ** 3}, which is ${((2 * e) ** 3) / e ** 3} times bigger.`
        : `Try an edge of ${e}: surface area ${6 * e * e}. Doubling gives ${2 * e}: surface area ${6 * (2 * e) ** 2}, which is ${(6 * (2 * e) ** 2) / (6 * e * e)} times bigger.`,
    );
  };
  const nets = (): Question =>
    conceptQ(
      [
        {
          levels: [1, 2, 3],
          prompt: "A net of a triangular prism is made of which faces?",
          right: "2 triangles and 3 rectangles",
          wrong: ["3 triangles and 2 rectangles", "2 triangles and 2 rectangles", "5 triangles"],
          hint: "Picture unfolding the prism: the two ends are triangles, and each side of the triangle has a rectangle attached.",
        },
        {
          levels: [1, 2, 3],
          prompt: "A net of a cylinder is made of which shapes?",
          right: "2 circles and 1 rectangle",
          wrong: ["1 circle and 2 rectangles", "2 circles and 2 rectangles", "3 circles"],
          hint: "The curved side unrolls into a rectangle. The rectangle's length is the circle's circumference.",
        },
        {
          levels: [1, 2, 3],
          prompt: "Which unit is used to measure the volume of a prism?",
          right: "Cubic centimetres (cm³)",
          wrong: ["Square centimetres (cm²)", "Centimetres (cm)", "Degrees (°)"],
          hint: "Volume measures 3D space, so the units are cubed. Surface area uses square units.",
        },
        {
          levels: [2, 3],
          prompt: "1 cm³ holds the same amount as which of these?",
          right: "1 mL",
          wrong: ["1 L", "10 mL", "100 mL"],
          hint: "A cube 1 cm on each edge holds exactly 1 millilitre, and 1000 of them make 1 litre.",
        },
      ],
      d,
    );
  const makers = d === 1 ? [boxV, boxSA, cubeSA, missingH, triV, cylV, nets, capacity] : [boxV, boxSA, missingH, triV, triSA, cylV, cylSA, capacity, nets];
  if (d === 3) makers.push(cylH, scale, triSA);
  if (d === 2) makers.push(scale);
  return build(makers);
}

// ---------- 9. Probability of Independent Events ----------

function enumeratePairs(pred: (a: number, b: number) => boolean): [number, number] {
  let favourable = 0;
  for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (pred(a, b)) favourable++;
  return [favourable, 36];
}

function probability(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const coinDie = (): Question => {
    const events = [
      { t: "a 6", c: 1 },
      { t: "an even number", c: 3 },
      { t: "a number greater than 4", c: 2 },
      { t: "a number less than 3", c: 2 },
      { t: "a 1 or a 2", c: 2 },
    ];
    const e = pick(events);
    const side = pick(["heads", "tails"]);
    return typedFraction(
      `You flip a coin and roll a fair die. What is P(${side} and ${e.t})? Answer as a fraction.`,
      e.c,
      12,
      `The events are independent, so multiply: P(${side}) × P(${e.t}) = 1/2 × ${e.c}/6 = ${e.c}/12${fReduceText(e.c, 12) === `${e.c}/12` ? "" : `, which reduces to ${fReduceText(e.c, 12)}`}.`,
    );
  };
  const spinners = (): Question => {
    const a = pick([4, 5, 6, 8]);
    const b = pick([3, 4, 5, 6]);
    const ea = Math.floor(a / 2);
    const ob = Math.ceil(b / 2);
    return typedFraction(
      `Spinner A has equal sections numbered 1 to ${a}. Spinner B has equal sections numbered 1 to ${b}. You spin both. What is P(A is even and B is odd)?`,
      ea * ob,
      a * b,
      `P(A even) = ${ea}/${a} and P(B odd) = ${ob}/${b}. Independent events multiply: ${ea}/${a} × ${ob}/${b} = ${ea * ob}/${a * b}.`,
      { type: "spinner", segments: range(1, a).map(String) },
    );
  };
  const marbles = (): Question => {
    const r = randInt(2, 5), bl = randInt(2, 5), g = randInt(1, 4);
    const t = r + bl + g;
    return typedFraction(
      `A bag has ${r} red, ${bl} blue and ${g} green marbles. You draw one, put it back, then draw again. What is P(red, then blue)?`,
      r * bl,
      t * t,
      `Because you replace the marble, the draws are independent. P(red) = ${r}/${t} and P(blue) = ${bl}/${t}. Multiply: ${r * bl}/${t * t}.`,
    );
  };
  const bothPercent = (): Question => {
    const p = 10 * randInt(2, 8);
    const q = 10 * randInt(2, 8);
    const mode = d === 1 ? 0 : pick([0, 1]);
    const ans = mode === 0 ? (p * q) / 100 : (p * (100 - q)) / 100;
    return typed(
      `The chance of rain on Saturday is ${p}% and on Sunday is ${q}%, independently. What is the chance that ${mode === 0 ? "it rains on both days" : "it rains on Saturday but not on Sunday"}?`,
      fmt(ans),
      `Convert to decimals and multiply: ${mode === 0 ? `${fmt(p / 100)} × ${fmt(q / 100)}` : `${fmt(p / 100)} × ${fmt((100 - q) / 100)}`} = ${fmt(ans / 100)}, which is ${fmt(ans)}%.`,
      "decimal",
      { suffix: "%" },
    );
  };
  const twoDice = (): Question => {
    const target = randInt(2, 12);
    const [fav, tot] = enumeratePairs((a, b) => a + b === target);
    const atLeast = d === 3 && chance(0.5);
    const lim = randInt(8, 11);
    const [f2, t2] = atLeast ? enumeratePairs((a, b) => a + b >= lim) : [fav, tot];
    return typedFraction(
      atLeast ? `You roll two fair dice. What is P(the sum is ${lim} or more)?` : `You roll two fair dice. What is P(the sum is ${target})?`,
      f2,
      t2,
      `There are 6 × 6 = 36 equally likely outcomes. List the ones that work: there are ${f2}. So the probability is ${f2}/36.`,
    );
  };
  const independence = (): Question =>
    conceptQ(
      [
        {
          levels: [1, 2, 3],
          prompt: "Which pair of events is independent?",
          right: "Flipping a coin, then rolling a die",
          wrong: [
            "Drawing a card, keeping it, then drawing a second card",
            "Picking a marble, keeping it out, then picking another",
            "Choosing the first name from a hat, then the second name without replacing it",
          ],
          hint: "Events are independent when the first result does not change the chances for the second one. Keeping the first item changes what is left.",
        },
        {
          levels: [1, 2, 3],
          prompt: "Two independent events A and B have P(A) = 1/3 and P(B) = 1/4. What is P(A and B)?",
          right: "1/12",
          wrong: ["7/12", "2/7", "1/7"],
          hint: "For independent events, multiply the probabilities: 1/3 × 1/4 = 1/12. Adding is for 'or' with no overlap.",
        },
        {
          levels: [2, 3],
          prompt: "A coin lands heads five times in a row. What is the probability of heads on the next flip?",
          right: "1/2",
          wrong: ["Less than 1/2, since tails is due", "More than 1/2, since it's on a streak", "1/32"],
          hint: "A coin has no memory. Each flip is independent, so the chance of heads is always 1/2.",
        },
        {
          levels: [2, 3],
          prompt: "P(A) = 0.4. What is the probability that A does NOT happen?",
          right: "0.6",
          wrong: ["0.4", "0.04", "1.4"],
          hint: "The chances of an event happening and not happening add to 1. 1 − 0.4 = 0.6.",
        },
      ],
      d,
    );
  const experimental = (): Question => {
    const trials = pick([20, 25, 40, 50]);
    const hits = randInt(3, trials - 5);
    const colour = pick(["red", "green", "blue", "yellow"]);
    return typedFraction(
      `A spinner was spun ${trials} times and landed on ${colour} ${hits} times. What is the experimental probability of ${colour}? Answer as a fraction.`,
      hits,
      trials,
      `Experimental probability = successes ÷ trials = ${hits}/${trials}. Reduce if you can.`,
    );
  };
  const predict = (): Question => {
    const trials = pick([20, 25, 40, 50]);
    const k = pick([2, 3, 4, 5]);
    const hits = pick([1, 3, 7, 9, 11].filter((x) => x < trials)) ;
    const future = trials * k;
    return typed(
      `In ${trials} spins, a spinner landed on blue ${hits} times. Based on this, about how many blues would you expect in ${future} spins?`,
      fmt((hits * future) / trials),
      `Experimental probability = ${hits}/${trials}. Expected = ${hits}/${trials} × ${future} = ${hits} × ${k} = ${hits * k}.`,
      "number",
    );
  };
  const counting = (): Question => {
    const a = randInt(2, 6), b = randInt(2, 5), c = d === 1 ? 1 : randInt(2, 4);
    return typed(
      `An outfit is one of ${a} shirts, one of ${b} pairs of pants${c > 1 ? ` and one of ${c} pairs of shoes` : ""}. How many different outfits are possible?`,
      String(a * b * c),
      `Multiply the choices for each part: ${a} × ${b}${c > 1 ? ` × ${c}` : ""} = ${a * b * c}.`,
      "number",
    );
  };
  const makers = d === 1 ? [coinDie, coinDie, spinners, marbles, independence, counting, experimental, twoDice] : [coinDie, spinners, marbles, bothPercent, twoDice, independence, experimental, predict, counting];
  return build(makers);
}

// ---------- 10. Data and Statistics ----------

function dataStats(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const listText = (xs: number[]) => xs.join(", ");

  const meanQ = (): Question => {
    const n = d === 3 ? 5 : randInt(4, 6);
    const vals = range(1, n).map(() => randInt(4, d === 1 ? 20 : 40));
    if (d < 3) {
      const rem = vals.reduce((s, v) => s + v, 0) % n;
      if (rem) vals[n - 1] += n - rem;
    }
    const sum = vals.reduce((s, v) => s + v, 0);
    const mean = sum / n;
    const ctx = pick(["points scored", "minutes spent reading", "km run", "pages read"]);
    return typed(
      `Daily ${ctx} this week: ${listText(vals)}. What is the mean?`,
      fmt(mean),
      `Add all ${n} values: ${vals.join(" + ")} = ${sum}. Divide by ${n}: ${sum} ÷ ${n} = ${fmt(mean)}.`,
      "decimal",
    );
  };
  const medianQ = (): Question => {
    const n = chance(0.5) ? 7 : d === 1 ? 5 : 6;
    const vals = shuffle(range(1, n).map(() => randInt(3, 50)));
    const sorted = [...vals].sort((a, b) => a - b);
    const med = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
    return typed(
      `What is the median of ${listText(vals)}?`,
      fmt(med),
      `Put the values in order: ${listText(sorted)}. ${n % 2 ? `The middle value is ${med}.` : `The two middle values are ${sorted[n / 2 - 1]} and ${sorted[n / 2]}; their mean is ${fmt(med)}.`}`,
      "decimal",
    );
  };
  const modeQ = (): Question => {
    const m = randInt(5, 30);
    const others = sample(range(3, 40).filter((x) => x !== m), 5);
    const vals = shuffle([m, m, m, ...others.slice(0, d === 1 ? 3 : 5)]);
    return typed(
      `What is the mode of ${listText(vals)}?`,
      String(m),
      `The mode is the value that appears most often. ${m} appears 3 times and every other value appears once.`,
      "number",
    );
  };
  const rangeQ = (): Question => {
    const vals = sample(range(2, 90), 6);
    const hi = Math.max(...vals), lo = Math.min(...vals);
    return typed(
      `What is the range of ${listText(vals)}?`,
      String(hi - lo),
      `Range = greatest − least = ${hi} − ${lo} = ${hi - lo}.`,
      "number",
    );
  };
  const missing = (): Question => {
    for (let t = 0; t < 60; t++) {
      const m = randInt(70, 90);
      const others = range(1, 4).map(() => randInt(m - 12, m + 12));
      const x = 5 * m - others.reduce((s, v) => s + v, 0);
      if (x >= 40 && x <= 100) {
        return typed(
          `Four test scores are ${listText(others)}. What score on a fifth test gives a mean of ${m}?`,
          String(x),
          `A mean of ${m} over 5 tests means the total must be 5 × ${m} = ${5 * m}. The first four add to ${5 * m - x}, so you need ${5 * m} − ${5 * m - x} = ${x}.`,
          "number",
        );
      }
    }
    return meanQ();
  };
  const outlier = (): Question =>
    conceptQ(
      [
        {
          levels: [1, 2, 3],
          prompt: "The data set 12, 14, 15, 15, 16, 90 has an outlier. Which measure of centre is pulled up the most by it?",
          right: "The mean",
          wrong: ["The median", "The mode", "The range"],
          hint: "The mean uses every value, so a very large value drags it up. The median only looks at the middle, so it stays near 15.",
        },
        {
          levels: [2, 3],
          prompt: "Five houses sell for $310 000, $325 000, $330 000, $340 000 and $2 100 000. Which measure best shows a typical price?",
          right: "The median",
          wrong: ["The mean", "The range", "The largest value"],
          hint: "One very expensive house pulls the mean far above what most houses cost. The median is not affected by that extreme value.",
        },
        {
          levels: [1, 2, 3],
          prompt: "Which measure tells you the most common value in a data set?",
          right: "The mode",
          wrong: ["The mean", "The median", "The range"],
          hint: "'Mode' means the most frequent value, like the most popular style in a shop.",
        },
        {
          levels: [2, 3],
          prompt: "A data set has mean 20. If every value goes up by 5, what is the new mean?",
          right: "25",
          wrong: ["20", "100", "5"],
          hint: "Adding 5 to every value shifts the whole set, including the mean, up by 5.",
        },
      ],
      d,
    );
  const barRead = (): Question => {
    const labels = sample(["Soccer", "Basketball", "Swimming", "Hockey", "Tennis", "Volleyball"], 5);
    const vals = labels.map(() => randInt(4, 30));
    const sortedIdx = vals.map((v, i) => [v, i]).sort((a, b) => b[0] - a[0]);
    const unique = new Set(vals).size === vals.length;
    const v: Visual = { type: "bars", title: "Favourite sport (students)", bars: labels.map((l, i) => ({ label: l, value: vals[i] })) };
    if (unique && chance(0.5)) {
      const topIdx = sortedIdx[0][1];
      return strQ("Which sport is the most popular?", labels[topIdx], labels.filter((_, i) => i !== topIdx), "Find the tallest bar.", v);
    }
    const [i, j] = vals[0] === vals[1] ? [0, 2] : vals[0] > vals[1] ? [0, 1] : [1, 0];
    if (vals[i] <= vals[j]) return missing();
    return typed(
      `How many more students chose ${labels[i]} than ${labels[j]}?`,
      String(vals[i] - vals[j]),
      `${labels[i]} has ${vals[i]} and ${labels[j]} has ${vals[j]}. Subtract: ${vals[i]} − ${vals[j]} = ${vals[i] - vals[j]}.`,
      "number",
      { visual: v },
    );
  };
  const circleAngle = (): Question => {
    const p = 5 * randInt(2, 14);
    const deg = p * 3.6;
    const mode = pick([0, 1, 2]);
    if (mode === 0) {
      return typed(
        "A sector of a circle graph is shown. What percent of the whole is it?",
        String(p),
        `A full circle is 360°. Percent = ${deg} ÷ 360 × 100 = ${p}%.`,
        "number",
        { suffix: "%", visual: { type: "angle", degrees: deg } },
      );
    }
    if (mode === 1) {
      return typed(
        `In a circle graph, a category is ${p}% of the data. What is the angle of its sector?`,
        fmt(deg),
        `${p}% of 360° = ${fmt(p / 100)} × 360 = ${fmt(deg)}°.`,
        "decimal",
        { suffix: "°" },
      );
    }
    const total = 20 * randInt(2, 10);
    return typed(
      `${total} students were surveyed. ${p}% chose pizza as their favourite lunch. How many students is that?`,
      fmt((total * p) / 100),
      `${p}% of ${total} = ${total} × ${fmt(p / 100)} = ${fmt((total * p) / 100)}.`,
      "decimal",
    );
  };
  const sampling = (): Question =>
    conceptQ(
      [
        {
          levels: [1, 2, 3],
          prompt: "A school wants to know what all students think about the cafeteria. Which sample is best?",
          right: "30 students chosen at random from the attendance list",
          wrong: ["The 30 students in the lunch line first", "The student council members", "Students who volunteer at the cafeteria"],
          hint: "A good sample is random, so every student has an equal chance to be included. The other groups are likely to share the same opinion.",
        },
        {
          levels: [1, 2, 3],
          prompt: "A survey about favourite music is given only at a rock concert. What is the problem?",
          right: "The sample is biased toward people who like rock",
          wrong: ["The sample is too large", "Music can't be surveyed", "The sample is random"],
          hint: "A sample is biased when it leaves out or favours some groups. Concert-goers don't represent everyone.",
        },
        {
          levels: [2, 3],
          prompt: "Which survey question is the least biased?",
          right: "How do you usually get to school?",
          wrong: ["Don't you agree that biking is the best way to get to school?", "Wouldn't you rather bike than sit in a boring bus?", "Since cars cause pollution, why do you still ride in one?"],
          hint: "A fair question uses neutral wording and doesn't push people toward a particular answer.",
        },
        {
          levels: [1, 2, 3],
          prompt: "Which graph is best for showing how parts make up a whole, like how a family budget is divided?",
          right: "Circle graph",
          wrong: ["Line graph", "Scatter plot", "Pictograph of totals only"],
          hint: "A circle graph shows each category as a part of 100%.",
        },
        {
          levels: [2, 3],
          prompt: "Which graph is best for showing how a plant's height changes over 10 weeks?",
          right: "Line graph",
          wrong: ["Circle graph", "Bar graph of categories", "Tally chart"],
          hint: "Line graphs show change over time.",
        },
        {
          levels: [1, 2, 3],
          prompt: "A population is all the people you want to learn about. What is a sample?",
          right: "A smaller group chosen from the population",
          wrong: ["The whole population", "The result of the survey", "The mean of the data"],
          hint: "We survey a sample when it would take too long to ask everyone.",
        },
      ],
      d,
    );
  const makers = d === 1 ? [meanQ, medianQ, modeQ, rangeQ, barRead, circleAngle, sampling, outlier] : [meanQ, medianQ, modeQ, rangeQ, missing, barRead, circleAngle, sampling, outlier];
  if (d === 3) makers.push(missing, medianQ);
  return build(makers);
}

// ---------- The course ----------

export const course: Course = {
  grade: "8",
  subject: "math",
  bigIdeas: {
    "ca-bc": [
      "Computational fluency and flexibility with numbers extend to operations with fractions.",
      "Number represents, describes, and compares quantities, including perfect squares and cube roots.",
      "Proportional reasoning, rates and percents are used to make decisions, including financial decisions.",
      "Linear relations can be represented in a variety of connected ways to identify regularities and make generalizations.",
      "Mathematical operations can be used to solve for unknowns in equations.",
      "Geometric and measurement relationships, such as the Pythagorean theorem and surface area and volume, can be used to solve problems.",
      "Analysis of data and probability helps us make informed decisions about independent events and samples.",
    ],
  },
  units: [
    {
      id: "squares-roots",
      title: "Squares & Roots",
      emoji: "🟦",
      blurb: "Perfect squares and cube roots",
      standards: { "ca-bc": "Number: perfect squares, square roots and cube roots; estimating roots" },
      parentNote:
        "Squaring a number and undoing it with a square root, cubes and cube roots, estimating roots that aren't whole numbers, and using them to find side lengths of squares and cubes.",
      generate: squaresRoots,
    },
    {
      id: "fractions",
      title: "Fractions & Mixed Numbers",
      emoji: "🍕",
      blurb: "Add, subtract, multiply, divide",
      standards: { "ca-bc": "Operations with fractions and mixed numbers, including problem solving" },
      parentNote:
        "Adding, subtracting, multiplying and dividing fractions and mixed numbers with unlike denominators, plus everyday uses such as scaling recipes and cutting lengths.",
      generate: fractionOps,
    },
    {
      id: "number-forms",
      title: "Ratios & Rates",
      emoji: "🔁",
      blurb: "Fractions, decimals, percents, ratios",
      standards: { "ca-bc": "Number: fractions, decimals, percents, ratios and rates; unit rates and proportional reasoning" },
      parentNote:
        "Moving between fractions, decimals and percents, simplifying and scaling ratios, and comparing unit rates such as price per item or speed.",
      generate: numberForms,
    },
    {
      id: "percent-finance",
      title: "Percent & Money",
      emoji: "🛍️",
      blurb: "Sales, tax, tips and interest",
      standards: { "ca-bc": "Financial literacy: percents, discounts, taxes, best buys and simple interest" },
      parentNote:
        "Percents including values over 100% and under 1%, discounts, sales tax, tips, best buys, percent change and simple interest. Money skills used in real shopping and saving decisions.",
      generate: percentFinance,
    },
    {
      id: "equations",
      title: "Solving Equations",
      emoji: "⚖️",
      blurb: "Find the unknown, step by step",
      standards: { "ca-bc": "Algebra: solving one- and two-step linear equations and writing equations for problems" },
      parentNote:
        "Solving equations such as 3x + 5 = 20 by undoing operations, checking solutions, and writing equations from real situations like fees and rates.",
      generate: equations,
    },
    {
      id: "linear-relations",
      title: "Patterns & Graphs",
      emoji: "📈",
      blurb: "Tables, rules and straight lines",
      standards: { "ca-bc": "Algebra: linear relations represented in words, tables, equations and graphs" },
      parentNote:
        "Describing linear patterns with tables, rules and graphs, finding slope and values from a graph, and telling linear relations from non-linear ones.",
      generate: linearRelations,
    },
    {
      id: "pythagoras",
      title: "Pythagorean Theorem",
      emoji: "📐",
      blurb: "a² + b² = c²",
      standards: { "ca-bc": "Geometry and measurement: the Pythagorean theorem in two-dimensional contexts" },
      parentNote:
        "Using a² + b² = c² to find the hypotenuse or a missing leg of a right triangle, checking whether a triangle is a right triangle, and solving ladder and diagonal problems.",
      generate: pythagoras,
    },
    {
      id: "surface-volume",
      title: "Surface Area & Volume",
      emoji: "🧊",
      blurb: "Prisms and cylinders in 3D",
      standards: { "ca-bc": "Geometry and measurement: surface area and volume of right prisms and cylinders" },
      parentNote:
        "Finding surface area and volume of rectangular prisms, triangular prisms and cylinders, working backwards to a missing dimension, and linking cm³ to millilitres and litres. Cylinder questions use π = 3.14.",
      generate: surfaceVolume,
    },
    {
      id: "probability",
      title: "Probability",
      emoji: "🎲",
      blurb: "Independent events",
      standards: { "ca-bc": "Data and probability: probability of independent events" },
      parentNote:
        "Finding the probability of two independent events by multiplying, listing outcomes, comparing experimental and theoretical probability, and the counting principle.",
      generate: probability,
    },
    {
      id: "data",
      title: "Data & Statistics",
      emoji: "📊",
      blurb: "Averages, graphs and sampling",
      standards: { "ca-bc": "Data and probability: measures of central tendency, graphs, and sampling" },
      parentNote:
        "Mean, median, mode and range, the effect of outliers, reading bar and circle graphs, and judging whether a sample and survey questions are fair.",
      generate: dataStats,
    },
  ],
};
